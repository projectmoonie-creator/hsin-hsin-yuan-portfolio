import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  createArchiveStillSlideshowTimeline,
  validateArchiveStillSlideshowRecipe,
} from "../scripts/lib/archive-still-slideshow.mjs";
import { renderArchiveStillSlideshowHtml } from "../scripts/lib/archive-still-slideshow-html.mjs";
import { assertPublicWebpMetadataSafe } from "../scripts/lib/webp-metadata.mjs";

const root = process.cwd();
const frame = (id) => ({
  id,
  source: `assets/stills/${id}.webp`,
  sourceBasename: `${id}.jpg`,
  sourceSha256: "a".repeat(64),
  sourceDimensions: { width: 4032, height: 3024 },
  cropMode: "cover",
  durationFrames: 50,
  focalPoint: { x: 0.5, y: 0.5 },
  scale: { from: 1, to: 1.035 },
  transition: { kind: "dissolve", frames: 8 },
});

const recipe = {
  schemaVersion: 1,
  slug: "sample-archive",
  rightsStatus: "user-supplied-local-source",
  width: 1280,
  height: 720,
  fps: 30,
  durationFrames: 300,
  outputProfiles: {
    reel: "silent-h264-720p-bt709",
    poster: "webp-1280x720",
  },
  publicPaths: {
    reel: "/assets/showreel/sample-archive-card-reel.mp4",
    poster: "/assets/showreel/sample-archive-card-reel-poster.webp",
  },
  posterFrameId: "frame-01",
  posterFocalPoint: { x: 0.5, y: 0.5 },
  alt: { en: "Sample still", zh: "範例劇照" },
  frames: Array.from({ length: 6 }, (_, index) => frame(`frame-0${index + 1}`)),
};

test("recipe validates one safe six-still contract", () => {
  const result = validateArchiveStillSlideshowRecipe(recipe);
  assert.equal(result.frames.length, 6);
  assert.equal(result.frames.reduce((sum, item) => sum + item.durationFrames, 0), 300);
});

test("timeline uses six slots and an eight-frame loop return", () => {
  const timeline = createArchiveStillSlideshowTimeline(recipe);
  assert.deepEqual(timeline.frames.map((item) => item.startFrame), [0, 50, 100, 150, 200, 250]);
  assert.deepEqual(timeline.frames.map((item) => item.fadeOutStartFrame), [50, 100, 150, 200, 250, 292]);
  assert.deepEqual(timeline.loopReturn, {
    frameId: "frame-01",
    startFrame: 292,
    endFrame: 300,
  });
});

test("recipe fails closed on unsafe input", () => {
  const cases = [
    [{ ...recipe, frames: [{ ...recipe.frames[0], source: ["/Us", "ers/person/source.jpg"].join("") }, ...recipe.frames.slice(1)] }, /relative/],
    [{ ...recipe, frames: [{ ...recipe.frames[0], focalPoint: { x: 2, y: 0.5 } }, ...recipe.frames.slice(1)] }, /focal/],
    [{ ...recipe, frames: [recipe.frames[0], recipe.frames[0], ...recipe.frames.slice(2)] }, /unique/],
    [{ ...recipe, durationFrames: 301 }, /duration/],
    [{ ...recipe, publicPaths: { ...recipe.publicPaths, reel: "/assets/showreel/another-card-reel.mp4" } }, /public path/],
    [{ ...recipe, frames: [{ ...recipe.frames[0], sourceDimensions: { width: 0, height: 3024 } }, ...recipe.frames.slice(1)] }, /dimensions/],
  ];
  for (const [input, pattern] of cases) {
    assert.throws(() => validateArchiveStillSlideshowRecipe(input), pattern);
  }
});

test("generic composition renders six stills plus loop return", () => {
  const html = renderArchiveStillSlideshowHtml(recipe);
  assert.match(html, /data-composition-id="archive-still-slideshow"/);
  assert.match(html, /data-duration="10"/);
  assert.match(html, /data-fps="30"/);
  assert.equal((html.match(/class="still-frame"/g) || []).length, 7);
  assert.match(html, /loop-return-frame/);
  assert.match(html, /scale: 1\.035/);
});

test("generic renderer has no Ghost Hand special case", () => {
  const source = readFileSync(join(root, "scripts/lib/archive-still-slideshow-html.mjs"), "utf8");
  assert.doesNotMatch(source, /ghost-hand-divine-car|4arUG0s6|HDHnSa6p/);
});

test("generic renderer accepts a second recipe without code changes", () => {
  const secondRecipe = {
    ...recipe,
    slug: "second-archive",
    publicPaths: {
      reel: "/assets/showreel/second-archive-card-reel.mp4",
      poster: "/assets/showreel/second-archive-card-reel-poster.webp",
    },
  };
  const html = renderArchiveStillSlideshowHtml(secondRecipe);
  assert.match(html, /assets\/stills\/frame-06\.webp/);
  assert.equal((html.match(/class="still-frame"/g) || []).length, 7);
});

function webpWithChunks(chunkNames) {
  const chunks = chunkNames.map((name) => {
    const payload = name === "VP8X" ? Buffer.alloc(10) : Buffer.alloc(0);
    const chunk = Buffer.alloc(8 + payload.length + (payload.length % 2));
    chunk.write(name, 0, 4, "ascii");
    chunk.writeUInt32LE(payload.length, 4);
    payload.copy(chunk, 8);
    return chunk;
  });
  const body = Buffer.concat([Buffer.from("WEBP", "ascii"), ...chunks]);
  const riff = Buffer.alloc(8);
  riff.write("RIFF", 0, 4, "ascii");
  riff.writeUInt32LE(body.length, 4);
  return Buffer.concat([riff, body]);
}

test("media:slideshow defaults to a redacted no-write plan", () => {
  const configDirectory = mkdtempSync(join(tmpdir(), "portfolio-slideshow-config-"));
  const emptyWorkingDirectory = mkdtempSync(join(tmpdir(), "portfolio-slideshow-cwd-"));
  const fixtureConfig = join(configDirectory, "slideshow.json");
  writeFileSync(fixtureConfig, `${JSON.stringify(recipe)}\n`);
  try {
    const output = execFileSync(process.execPath, [
      join(root, "scripts/build-archive-still-slideshow.mjs"),
      "--config", fixtureConfig,
    ], { cwd: emptyWorkingDirectory, encoding: "utf8" });
    const plan = JSON.parse(output);
    assert.equal(plan.mode, "dry-run");
    assert.equal(plan.writesFiles, false);
    assert.equal(output.includes(configDirectory), false);
    assert.deepEqual(readdirSync(emptyWorkingDirectory), []);
  } finally {
    rmSync(configDirectory, { recursive: true, force: true });
    rmSync(emptyWorkingDirectory, { recursive: true, force: true });
  }
});

test("package exposes the stable slideshow command", () => {
  const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  assert.equal(packageJson.scripts["media:slideshow"], "node scripts/build-archive-still-slideshow.mjs");
});

test("authoring WebP privacy check fails closed on metadata and unknown chunks", () => {
  assert.doesNotThrow(() => assertPublicWebpMetadataSafe(webpWithChunks(["VP8 "])));
  for (const chunk of ["EXIF", "XMP ", "ICCP", "JUNK"]) {
    assert.throws(() => assertPublicWebpMetadataSafe(webpWithChunks(["VP8 ", chunk])), /metadata/);
  }
});
