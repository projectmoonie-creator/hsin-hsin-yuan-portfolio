#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { pathToFileURL } from "node:url";

import { normalizeCollaborations } from "./lib/portfolio-contract.mjs";

const MONO_RGB = Object.freeze({
  r: 247 / 255,
  g: 242 / 255,
  b: 232 / 255,
});

export function assertSafeSvg(source) {
  const value = String(source);
  const unsafePatterns = [
    /<\s*(?:script|foreignObject|iframe|object|embed)\b/i,
    /\son[a-z]+\s*=/i,
    /(?:href|src)\s*=\s*["']\s*(?:https?:|\/\/|data:)/i,
    /@import\b/i,
    /url\(\s*["']?\s*(?:https?:|\/\/|data:)/i,
    /<!DOCTYPE\b/i,
    /<\?xml-stylesheet\b/i,
  ];
  if (unsafePatterns.some((pattern) => pattern.test(value))) {
    throw new Error("unsafe SVG source");
  }
}

export function verifySourceSha256(source, expected, label) {
  const actual = createHash("sha256").update(source).digest("hex");
  if (actual !== expected) {
    throw new Error(`${label} source SHA-256 mismatch: expected ${expected}, received ${actual}`);
  }
  return actual;
}

export function buildMonochromeSvg({ source, mime, width, height }) {
  if (!Buffer.isBuffer(source)) throw new Error("logo source must be a Buffer");
  if (!Number.isInteger(width) || width <= 0 || !Number.isInteger(height) || height <= 0) {
    throw new Error("logo dimensions must be positive integers");
  }
  if (!new Set(["image/png", "image/svg+xml"]).has(mime)) {
    throw new Error(`unsupported collaboration logo MIME type: ${mime}`);
  }
  if (mime === "image/svg+xml") assertSafeSvg(source.toString("utf8"));

  const matrix = [
    `0 0 0 0 ${MONO_RGB.r.toFixed(6)}`,
    `0 0 0 0 ${MONO_RGB.g.toFixed(6)}`,
    `0 0 0 0 ${MONO_RGB.b.toFixed(6)}`,
    "0 0 0 1 0",
  ].join(" ");
  const data = source.toString("base64");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
  <defs>
    <filter id="monochrome" color-interpolation-filters="sRGB">
      <feColorMatrix type="matrix" values="${matrix}"/>
    </filter>
  </defs>
  <image href="data:${mime};base64,${data}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" filter="url(#monochrome)"/>
</svg>
`;
}

export function prepareCollaborationLogos({ baseDir, collaborations }) {
  const normalized = normalizeCollaborations(collaborations);
  const prepared = [];

  for (const item of normalized) {
    const publicLogo = item.contract.public.logo;
    const evidence = item.contract.evidence.logo;
    if (!publicLogo || !evidence) continue;

    const sourcePath = join(baseDir, evidence.sourceFile);
    const source = readFileSync(sourcePath);
    verifySourceSha256(source, evidence.sourceSha256, item.id);
    const extension = extname(evidence.sourceFile).toLowerCase();
    const mime = extension === ".png" ? "image/png" : "image/svg+xml";
    const derivative = buildMonochromeSvg({
      source,
      mime,
      width: publicLogo.dimensions.width,
      height: publicLogo.dimensions.height,
    });
    const outputRelative = join("public", publicLogo.src.replace(/^\//, ""));
    const outputPath = join(baseDir, outputRelative);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, derivative);
    prepared.push(outputRelative);
  }

  return prepared;
}

function main() {
  const baseDir = process.cwd();
  const collaborations = JSON.parse(
    readFileSync(join(baseDir, "data/collaborations.json"), "utf8"),
  );
  const prepared = prepareCollaborationLogos({ baseDir, collaborations });
  console.log(`Prepared ${prepared.length} collaboration logo derivative${prepared.length === 1 ? "" : "s"}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
