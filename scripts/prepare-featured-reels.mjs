import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

import {
  buildFeaturedReelDerivativeInventory,
  createFeaturedReelDerivativeManifest,
  featuredReelDeliveryManifestPath,
  inspectFeaturedReelDerivative,
  verifyFeaturedReelDerivativeSet,
  verifyFeaturedReelSources,
} from "./lib/featured-reel-delivery.mjs";
import { loadMediaManifest } from "./lib/media-manifest.mjs";

const root = process.cwd();
const manifest = loadMediaManifest(root);
const expected = buildFeaturedReelDerivativeInventory(manifest);
const outputDir = resolve(root, "public", manifest.featuredReelDelivery.directory.replace(/^\/+/, ""));
const expectedNames = new Set(expected.map((item) => basename(item.publicPath)));

function assertNoUnplannedOutput() {
  if (!existsSync(outputDir)) return;
  const unexpected = readdirSync(outputDir).filter((name) => !expectedNames.has(name));
  if (unexpected.length) {
    throw new Error(`Unplanned Featured reel derivative files: ${unexpected.join(", ")}`);
  }
}

function encodeArgs(sourcePath, outputPath) {
  const { encode } = manifest.featuredReelDelivery;
  const profile = manifest.profiles[manifest.featuredReelDelivery.mobileProfile];
  return [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", sourcePath,
    "-map", "0:v:0",
    "-an", "-sn", "-dn",
    "-map_metadata", "-1", "-map_chapters", "-1",
    "-vf", `scale=${profile.width}:${profile.height}:flags=lanczos`,
    "-c:v", "libx264",
    "-preset", encode.preset,
    "-crf", String(encode.crf),
    "-maxrate", `${encode.maxRateKbps}k`,
    "-bufsize", `${encode.bufferKbps}k`,
    "-force_key_frames", `expr:gte(t,n_forced*${encode.keyframeIntervalSeconds})`,
    "-pix_fmt", profile.pixelFormat,
    "-colorspace", profile.colorSpace,
    "-color_trc", profile.colorTransfer,
    "-color_primaries", profile.colorPrimaries,
    "-movflags", "+faststart",
    "-threads", String(encode.threads),
    outputPath,
  ];
}

assertNoUnplannedOutput();
if (process.argv.includes("--check")) {
  const verified = verifyFeaturedReelDerivativeSet({ root, manifest });
  console.log(JSON.stringify({ mode: "check", derivatives: verified.length }, null, 2));
  process.exit(0);
}

const sources = new Map(
  verifyFeaturedReelSources({ root, manifest }).map((item) => [item.sourceAssetId, item]),
);
mkdirSync(dirname(outputDir), { recursive: true });
const stageDir = mkdtempSync(join(dirname(outputDir), ".featured-reel-stage-"));

try {
  const derivatives = [];
  for (const item of expected) {
    const source = sources.get(item.sourceAssetId);
    const stagedPath = join(stageDir, basename(item.publicPath));
    execFileSync("ffmpeg", encodeArgs(source.filePath, stagedPath), { stdio: "pipe" });
    derivatives.push(inspectFeaturedReelDerivative({
      root,
      manifest,
      expected: item,
      filePath: stagedPath,
    }));
  }

  mkdirSync(outputDir, { recursive: true });
  for (const item of expected) {
    renameSync(join(stageDir, basename(item.publicPath)), join(outputDir, basename(item.publicPath)));
  }
  const generatedPath = featuredReelDeliveryManifestPath(root);
  const tempPath = `${generatedPath}.tmp-${process.pid}`;
  mkdirSync(dirname(generatedPath), { recursive: true });
  writeFileSync(tempPath, `${JSON.stringify(createFeaturedReelDerivativeManifest({
    manifest,
    derivatives,
  }), null, 2)}\n`);
  renameSync(tempPath, generatedPath);
} finally {
  rmSync(stageDir, { recursive: true, force: true });
}

const verified = verifyFeaturedReelDerivativeSet({ root, manifest });
console.log(JSON.stringify({
  mode: "prepare",
  derivatives: verified.map(({ sourceAssetId, publicPath, size, averageBitrateKbps }) => ({
    sourceAssetId,
    publicPath,
    size,
    averageBitrateKbps,
  })),
}, null, 2));
