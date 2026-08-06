#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { createArchiveStillSlideshowTimeline, validateArchiveStillSlideshowRecipe } from "./lib/archive-still-slideshow.mjs";
import { renderArchiveStillSlideshowHtml } from "./lib/archive-still-slideshow-html.mjs";
import { writeArchiveMediaPackage } from "./lib/archive-media-package-writer.mjs";
import { probeMediaAsset, verifyMediaAsset } from "./lib/media-manifest.mjs";
import { assertPublicWebpMetadataSafe } from "./lib/webp-metadata.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const HYPERFRAMES_VERSION = "0.7.94";

const VALUE_OPTIONS = new Set(["config", "source-dir"]);
const FLAG_OPTIONS = new Set(["authoring-only", "write"]);

function parseArguments(args) {
  const values = {};
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (!token.startsWith("--")) throw new Error("Options must start with --");
    const option = token.slice(2);
    if (Object.hasOwn(values, option)) throw new Error(`Repeated option: --${option}`);
    if (FLAG_OPTIONS.has(option)) {
      values[option] = true;
      continue;
    }
    if (!VALUE_OPTIONS.has(option)) throw new Error(`Unknown option: --${option}`);
    const value = args[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Option --${option} requires one value`);
    values[option] = value;
    index += 1;
  }
  if (!values.config) throw new Error("--config is required");
  if (values["authoring-only"] && values.write) {
    throw new Error("--authoring-only and --write are mutually exclusive");
  }
  return values;
}

export function runArchiveStillSlideshow(options) {
  const recipe = validateArchiveStillSlideshowRecipe(
    JSON.parse(readFileSync(options.config, "utf8")),
  );
  const timeline = createArchiveStillSlideshowTimeline(recipe);
  const dryRun = {
    schemaVersion: 1,
    mode: "dry-run",
    writesFiles: false,
    slug: recipe.slug,
    sourceBasenames: recipe.frames.map((frame) => frame.sourceBasename),
    authoringProject: `showreel/${recipe.slug}-card-reel`,
    publicReel: recipe.publicPaths.reel,
    publicPoster: recipe.publicPaths.poster,
    timeline,
  };
  if (!options.authoringOnly && !options.write) return dryRun;
  if (typeof options.sourceDir !== "string" || !options.sourceDir) {
    throw new Error("--source-dir is required for write modes");
  }

  const dependencies = options.dependencies || {};
  const run = dependencies.execFileSync || execFileSync;
  const projectRoot = join(repoRoot, "showreel", `${recipe.slug}-card-reel`);
  if (!existsSync(join(projectRoot, "hyperframes.json"))) {
    throw new Error("Authoring project is not scaffolded");
  }
  const stillsRoot = join(projectRoot, "assets/stills");
  mkdirSync(stillsRoot, { recursive: true });

  const writtenStills = [];
  for (const frame of recipe.frames) {
    const sourcePath = join(options.sourceDir, frame.sourceBasename);
    verifySourceStill(sourcePath, frame, run);
    const outputPath = join(projectRoot, frame.source);
    const temporaryPath = `${outputPath}.stage-${process.pid}.webp`;
    mkdirSync(dirname(outputPath), { recursive: true });
    encodeStill({ sourcePath, outputPath: temporaryPath, frame, run });
    assertPublicWebpMetadataSafe(readFileSync(temporaryPath));
    const probe = probeImageDimensions(temporaryPath, run);
    if (probe.width !== recipe.width || probe.height !== recipe.height) {
      rmSync(temporaryPath, { force: true });
      throw new Error(`Normalized still dimensions mismatch: ${frame.sourceBasename}`);
    }
    renameSync(temporaryPath, outputPath);
    writtenStills.push(frame.source);
  }
  writeFileSync(join(projectRoot, "index.html"), renderArchiveStillSlideshowHtml(recipe));

  if (options.authoringOnly) {
    return {
      ...dryRun,
      mode: "authoring-only",
      writesFiles: true,
      writtenStills,
      generatedComposition: `showreel/${recipe.slug}-card-reel/index.html`,
      hyperframesVersion: HYPERFRAMES_VERSION,
    };
  }

  const stagingRoot = mkdtempSync(join(tmpdir(), "archive-slideshow-render-"));
  try {
    const rawRender = join(stagingRoot, "raw.mp4");
    const stagedReel = join(stagingRoot, "public-reel.mp4");
    const stagedPoster = join(stagingRoot, "public-poster.webp");
    const renderComposition = dependencies.renderComposition || (({ cwd, output }) => {
      run("npx", ["--yes", `hyperframes@${HYPERFRAMES_VERSION}`, "render", "--output", output], {
        cwd,
        stdio: "pipe",
      });
    });
    renderComposition({ cwd: projectRoot, output: rawRender });
    run("ffmpeg", [
      "-y", "-v", "error", "-i", rawRender,
      "-an", "-r", "30", "-t", "10",
      "-c:v", "libx264", "-crf", "18", "-preset", "slow",
      "-pix_fmt", "yuv420p",
      "-colorspace", "bt709", "-color_trc", "bt709", "-color_primaries", "bt709",
      "-movflags", "+faststart", stagedReel,
    ], { stdio: "pipe" });
    const posterFrame = recipe.frames.find((frame) => frame.id === recipe.posterFrameId);
    copyFileSync(join(projectRoot, posterFrame.source), stagedPoster);
    assertPublicWebpMetadataSafe(readFileSync(stagedPoster));
    const stagedReelProbe = probeMediaAsset(stagedReel);
    verifyMediaAsset({
      entry: {
        id: `archive.${recipe.slug}.reel`,
        size: stagedReelProbe.size,
        sha256: stagedReelProbe.sha256,
        duration: 10,
      },
      profile: {
        kind: "video",
        codecName: "h264",
        width: 1280,
        height: 720,
        pixelFormat: "yuv420p",
        colorSpace: "bt709",
        colorTransfer: "bt709",
        colorPrimaries: "bt709",
        streamCount: 1,
        audioStreamCount: 0,
        faststart: true,
      },
      filePath: stagedReel,
    });
    return writeArchiveMediaPackage({
      repoRoot,
      slug: recipe.slug,
      stagedReelPath: stagedReel,
      stagedPosterPath: stagedPoster,
      publication: {
        rightsStatus: recipe.rightsStatus,
        imageAlt: recipe.alt,
        posterFocalPoint: recipe.posterFocalPoint,
      },
    });
  } finally {
    rmSync(stagingRoot, { recursive: true, force: true });
  }
}

function probeImageDimensions(path, run = execFileSync) {
  const result = JSON.parse(run("ffprobe", [
    "-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=width,height",
    "-of", "json", path,
  ], { encoding: "utf8" }));
  return result.streams?.[0] || {};
}

function verifySourceStill(path, frame, run) {
  if (!existsSync(path)) throw new Error(`Source still is missing: ${frame.sourceBasename}`);
  const bytes = readFileSync(path);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  if (sha256 !== frame.sourceSha256) throw new Error(`Source still SHA-256 mismatch: ${frame.sourceBasename}`);
  const dimensions = probeImageDimensions(path, run);
  if (dimensions.width !== frame.sourceDimensions.width
    || dimensions.height !== frame.sourceDimensions.height) {
    throw new Error(`Source still dimensions mismatch: ${frame.sourceBasename}`);
  }
}

function encodeStill({ sourcePath, outputPath, frame, run }) {
  const { x, y } = frame.focalPoint;
  const filter = [
    "scale=1280:720:force_original_aspect_ratio=increase",
    `crop=1280:720:x='min(max(iw*${x}-640,0),iw-1280)':y='min(max(ih*${y}-360,0),ih-720)'`,
    "setsar=1",
  ].join(",");
  run("ffmpeg", [
    "-y", "-v", "error", "-i", sourcePath,
    "-map_metadata", "-1", "-vf", filter,
    "-frames:v", "1", "-c:v", "libwebp", "-q:v", "88", outputPath,
  ], { stdio: "pipe" });
}

function main() {
  let values;
  try {
    values = parseArguments(process.argv.slice(2));
    const result = runArchiveStillSlideshow({
      config: values.config,
      sourceDir: values["source-dir"],
      authoringOnly: Boolean(values["authoring-only"]),
      write: Boolean(values.write),
    });
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    const redactions = [values?.["source-dir"], values?.config]
      .filter(Boolean)
      .map((path) => resolve(path));
    let message = error instanceof Error ? error.message : "Slideshow build failed";
    for (const path of redactions) message = message.replaceAll(path, "<private-path>");
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
