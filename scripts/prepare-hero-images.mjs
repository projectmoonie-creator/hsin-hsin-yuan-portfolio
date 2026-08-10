import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

import {
  buildHeroDerivativeInventory,
  createHeroDerivativeManifest,
  heroDeliveryManifestPath,
  inspectHeroDerivative,
  verifyHeroDerivativeSet,
  verifyHeroSource,
} from "./lib/hero-image-delivery.mjs";
import { normalizeHeroMedia } from "./lib/portfolio-contract.mjs";

const root = process.cwd();
const rawSite = JSON.parse(readFileSync(join(root, "data/site.json"), "utf8"));
normalizeHeroMedia(rawSite.heroMedia);

const heroMedia = rawSite.heroMedia;
const expected = buildHeroDerivativeInventory(heroMedia);
const outputDir = resolve(root, "public", heroMedia.delivery.directory.replace(/^\/+/, ""));
const expectedNames = new Set(expected.map((item) => basename(item.src)));

function assertNoUnplannedOutput() {
  if (!existsSync(outputDir)) return;
  const unexpected = readdirSync(outputDir).filter((name) => !expectedNames.has(name));
  if (unexpected.length) {
    throw new Error(`Unplanned Hero derivative files: ${unexpected.join(", ")}`);
  }
}

function encodeArgs(sourcePath, outputPath, item) {
  const common = [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", sourcePath,
    "-map_metadata", "-1",
    "-frames:v", "1",
    "-vf", `scale=${item.width}:${item.height}:flags=lanczos`,
  ];
  const quality = heroMedia.delivery.formats[item.format].quality;
  if (item.format === "avif") {
    const crf = Math.round((63 * (100 - quality)) / 100);
    return [...common,
      "-c:v", "libaom-av1", "-still-picture", "1", "-cpu-used", "6",
      "-crf", String(crf), "-b:v", "0", "-pix_fmt", "yuv420p",
      outputPath,
    ];
  }
  if (item.format === "webp") {
    return [...common,
      "-c:v", "libwebp", "-q:v", String(quality), "-compression_level", "6",
      "-preset", "picture", "-pix_fmt", "yuv420p",
      outputPath,
    ];
  }
  const qScale = Math.max(2, Math.min(31, Math.round(2 + ((100 - quality) * 0.25))));
  return [...common,
    "-c:v", "mjpeg", "-q:v", String(qScale), "-pix_fmt", "yuvj420p", "-flags", "+bitexact",
    outputPath,
  ];
}

assertNoUnplannedOutput();
if (process.argv.includes("--check")) {
  const verified = verifyHeroDerivativeSet({ root, heroMedia });
  console.log(JSON.stringify({ mode: "check", derivatives: verified.length }, null, 2));
  process.exit(0);
}

const source = verifyHeroSource({ root, heroMedia });
mkdirSync(dirname(outputDir), { recursive: true });
const stageDir = mkdtempSync(join(dirname(outputDir), ".hero-stage-"));

try {
  const stagedDerivatives = [];
  for (const item of expected) {
    const stagedPath = join(stageDir, basename(item.src));
    execFileSync("ffmpeg", encodeArgs(source.filePath, stagedPath, item), { stdio: "pipe" });
    stagedDerivatives.push(inspectHeroDerivative({ filePath: stagedPath, expected: item }));
  }

  mkdirSync(outputDir, { recursive: true });
  for (const item of expected) {
    renameSync(join(stageDir, basename(item.src)), join(outputDir, basename(item.src)));
  }
  const manifestPath = heroDeliveryManifestPath(root);
  const manifestTempPath = `${manifestPath}.tmp-${process.pid}`;
  mkdirSync(dirname(manifestPath), { recursive: true });
  writeFileSync(manifestTempPath, `${JSON.stringify(createHeroDerivativeManifest({
    heroMedia,
    derivatives: stagedDerivatives,
  }), null, 2)}\n`);
  renameSync(manifestTempPath, manifestPath);
} finally {
  rmSync(stageDir, { recursive: true, force: true });
}

const verified = verifyHeroDerivativeSet({ root, heroMedia });
console.log(JSON.stringify({
  mode: "prepare",
  sourceSha256: source.sha256,
  derivatives: verified.map(({ src, width, height, codecName, bytes }) => ({
    src, width, height, codecName, bytes,
  })),
}, null, 2));
