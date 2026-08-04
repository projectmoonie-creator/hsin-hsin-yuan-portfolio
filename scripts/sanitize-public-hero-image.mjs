import { createHash } from "node:crypto";
import { readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  assertPublicJpegMetadataSafe,
  stripJpegMetadata,
} from "./lib/jpeg-metadata.mjs";

function argument(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? "" : process.argv[index + 1] || "";
}

const inputArg = argument("--input");
const outputArg = argument("--output");
if (!inputArg || !outputArg) {
  throw new Error("Usage: npm run hero:sanitize -- --input SOURCE_JPEG --output PUBLIC_JPEG");
}

const inputPath = resolve(inputArg);
const outputPath = resolve(outputArg);
if (!/\.jpe?g$/i.test(inputPath) || !/\.jpe?g$/i.test(outputPath)) {
  throw new Error("Hero sanitizer accepts JPEG input and output paths only");
}

const source = readFileSync(inputPath);
const sanitized = stripJpegMetadata(source);
assertPublicJpegMetadataSafe(sanitized);

const temporaryPath = `${outputPath}.sanitize-${process.pid}.tmp`;
try {
  writeFileSync(temporaryPath, sanitized, { flag: "wx" });
  renameSync(temporaryPath, outputPath);
} finally {
  rmSync(temporaryPath, { force: true });
}

const sha256 = createHash("sha256").update(sanitized).digest("hex");
console.log(`Sanitized Hero JPEG: ${outputPath}`);
console.log(`Removed ${source.length - sanitized.length} metadata bytes; SHA-256 ${sha256}`);
