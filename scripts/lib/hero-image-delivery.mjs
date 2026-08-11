import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join, posix, relative, resolve } from "node:path";

import { assertPublicJpegMetadataSafe } from "./jpeg-metadata.mjs";
import { inspectMediaSync } from "./media-inspector.mjs";

export const HERO_DELIVERY_FORMATS = Object.freeze({
  avif: Object.freeze({ extension: "avif", type: "image/avif", codecName: "av1" }),
  webp: Object.freeze({ extension: "webp", type: "image/webp", codecName: "webp" }),
  jpeg: Object.freeze({ extension: "jpg", type: "image/jpeg", codecName: "mjpeg" }),
});

export const HERO_DELIVERY_MANIFEST = "data/generated/hero-delivery-manifest.json";

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256Bytes(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

export function heroDeliveryRecipeSha256(heroMedia) {
  return sha256Bytes(Buffer.from(stableJson({
    src: heroMedia.src,
    dimensions: heroMedia.dimensions,
    delivery: heroMedia.delivery,
  })));
}

export function heroDeliveryManifestPath(root) {
  return resolve(root, HERO_DELIVERY_MANIFEST);
}

export function readHeroDerivativeManifest(root) {
  const filePath = heroDeliveryManifestPath(root);
  if (!existsSync(filePath)) throw new Error(`Missing generated Hero delivery manifest: ${filePath}`);
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function sourceStem(src) {
  const filename = basename(src);
  return filename.slice(0, filename.length - extname(filename).length);
}

function candidateSrc({ directory, stem, width, format }) {
  return posix.join(directory, `${stem}-${width}.${HERO_DELIVERY_FORMATS[format].extension}`);
}

function srcsetFor({ directory, stem, widths, format }) {
  return widths
    .map((width) => `${candidateSrc({ directory, stem, width, format })} ${width}w`)
    .join(", ");
}

export function deriveHeroDelivery({ src, delivery }) {
  const stem = sourceStem(src);
  const profiles = Object.fromEntries(
    Object.entries(delivery.profiles).map(([name, profile]) => {
      const sources = Object.fromEntries(
        Object.keys(HERO_DELIVERY_FORMATS).map((format) => [format, {
          type: HERO_DELIVERY_FORMATS[format].type,
          srcset: srcsetFor({
            directory: delivery.directory,
            stem,
            widths: profile.widths,
            format,
          }),
        }]),
      );
      return [name, {
        media: profile.media,
        sizes: profile.sizes,
        widths: [...profile.widths],
        sources,
        preload: {
          href: candidateSrc({
            directory: delivery.directory,
            stem,
            width: profile.preloadWidth,
            format: "avif",
          }),
          srcset: sources.avif.srcset,
          sizes: profile.sizes,
          media: profile.media,
          type: HERO_DELIVERY_FORMATS.avif.type,
          fetchPriority: "high",
        },
      }];
    }),
  );
  return { directory: delivery.directory, profiles };
}

export function buildHeroDerivativeInventory({ src, dimensions, delivery }) {
  const stem = sourceStem(src);
  const widths = [...new Set(
    Object.values(delivery.profiles).flatMap((profile) => profile.widths),
  )].sort((left, right) => left - right);
  return widths.flatMap((width) => Object.keys(HERO_DELIVERY_FORMATS).map((format) => ({
    format,
    type: HERO_DELIVERY_FORMATS[format].type,
    codecName: HERO_DELIVERY_FORMATS[format].codecName,
    width,
    height: Math.round((dimensions.height * width) / dimensions.width),
    src: candidateSrc({ directory: delivery.directory, stem, width, format }),
  })));
}

function publicFilePath(root, src) {
  const publicRoot = resolve(root, "public");
  const filePath = resolve(publicRoot, src.replace(/^\/+/, ""));
  const rel = relative(publicRoot, filePath);
  if (!rel || rel.startsWith("..") || rel.includes("../")) {
    throw new Error(`Hero delivery path escapes public/: ${src}`);
  }
  return filePath;
}

function probeImage(filePath) {
  const bytes = readFileSync(filePath);
  const inspected = inspectMediaSync(filePath, bytes);
  const privateTag = inspected.metadataKeys
    .find((key) => /gps|location|author|artist|comment|description|copyright|creation/.test(key));
  if (privateTag) throw new Error(`Hero derivative contains private metadata tag ${privateTag}: ${filePath}`);
  return {
    codec_name: inspected.video.codecName,
    width: inspected.video.width,
    height: inspected.video.height,
  };
}

export function verifyHeroSource({ root, heroMedia }) {
  const filePath = publicFilePath(root, heroMedia.src);
  if (!existsSync(filePath)) throw new Error(`Missing canonical Hero source: ${filePath}`);
  const bytes = readFileSync(filePath);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  if (sha256 !== heroMedia.sourceSha256) {
    throw new Error(`Canonical Hero source SHA-256 mismatch: expected ${heroMedia.sourceSha256}, received ${sha256}`);
  }
  assertPublicJpegMetadataSafe(bytes);
  const stream = probeImage(filePath);
  if (stream.codec_name !== "mjpeg"
    || stream.width !== heroMedia.dimensions.width
    || stream.height !== heroMedia.dimensions.height) {
    throw new Error(`Canonical Hero source dimensions or format do not match HeroMedia: ${filePath}`);
  }
  return { filePath, sha256, width: stream.width, height: stream.height };
}

export function inspectHeroDerivative({ filePath, expected }) {
  if (!existsSync(filePath)) throw new Error(`Missing Hero derivative: ${filePath}`);
  const stream = probeImage(filePath);
  if (stream.codec_name !== expected.codecName) {
    throw new Error(`Hero derivative codec mismatch for ${filePath}: expected ${expected.codecName}, received ${stream.codec_name}`);
  }
  if (stream.width !== expected.width || stream.height !== expected.height) {
    throw new Error(`Hero derivative dimensions mismatch for ${filePath}: expected ${expected.width}x${expected.height}, received ${stream.width}x${stream.height}`);
  }
  if (expected.format === "jpeg") {
    assertPublicJpegMetadataSafe(readFileSync(filePath));
  }
  return {
    ...expected,
    filePath,
    bytes: statSync(filePath).size,
    sha256: sha256Bytes(readFileSync(filePath)),
    codecName: stream.codec_name,
  };
}

export function createHeroDerivativeManifest({ heroMedia, derivatives }) {
  return {
    schemaVersion: 1,
    source: {
      src: heroMedia.src,
      sha256: heroMedia.sourceSha256,
      dimensions: heroMedia.dimensions,
    },
    recipeSha256: heroDeliveryRecipeSha256(heroMedia),
    derivatives: derivatives.map(({ src, width, height, format, codecName, bytes, sha256 }) => ({
      src,
      width,
      height,
      format,
      codecName,
      bytes,
      sha256,
    })),
  };
}

export function verifyHeroDerivativeManifest({ root, heroMedia }) {
  const sourcePath = publicFilePath(root, heroMedia.src);
  if (!existsSync(sourcePath)) throw new Error(`Missing canonical Hero source: ${sourcePath}`);
  const sourceSha256 = sha256Bytes(readFileSync(sourcePath));
  if (sourceSha256 !== heroMedia.sourceSha256) {
    throw new Error(`Canonical Hero source SHA-256 mismatch: expected ${heroMedia.sourceSha256}, received ${sourceSha256}`);
  }

  const manifest = readHeroDerivativeManifest(root);
  if (manifest.schemaVersion !== 1) throw new Error(`Unsupported Hero delivery manifest schema: ${manifest.schemaVersion}`);
  if (manifest.source?.src !== heroMedia.src || manifest.source?.sha256 !== heroMedia.sourceSha256
    || manifest.source?.dimensions?.width !== heroMedia.dimensions.width
    || manifest.source?.dimensions?.height !== heroMedia.dimensions.height) {
    throw new Error("Hero delivery manifest source does not match canonical HeroMedia");
  }
  const recipeSha256 = heroDeliveryRecipeSha256(heroMedia);
  if (manifest.recipeSha256 !== recipeSha256) {
    throw new Error(`Hero delivery manifest recipe SHA-256 mismatch: expected ${recipeSha256}, received ${manifest.recipeSha256}`);
  }

  const expected = buildHeroDerivativeInventory(heroMedia);
  const manifestBySrc = new Map((manifest.derivatives || []).map((item) => [item.src, item]));
  if (manifestBySrc.size !== expected.length || manifest.derivatives?.length !== expected.length) {
    throw new Error(`Hero delivery manifest derivative count mismatch: expected ${expected.length}, received ${manifest.derivatives?.length ?? 0}`);
  }
  for (const item of expected) {
    const recorded = manifestBySrc.get(item.src);
    if (!recorded || recorded.width !== item.width || recorded.height !== item.height
      || recorded.format !== item.format || recorded.codecName !== item.codecName) {
      throw new Error(`Hero delivery manifest contract mismatch: ${item.src}`);
    }
    const filePath = publicFilePath(root, item.src);
    if (!existsSync(filePath)) throw new Error(`Missing Hero derivative: ${filePath}`);
    const bytes = readFileSync(filePath);
    const sha256 = sha256Bytes(bytes);
    if (recorded.bytes !== bytes.length || recorded.sha256 !== sha256) {
      throw new Error(`Hero derivative hash or byte-size mismatch: ${item.src}`);
    }
  }
  return manifest;
}

export function verifyHeroDerivativeSet({ root, heroMedia }) {
  verifyHeroSource({ root, heroMedia });
  const verified = buildHeroDerivativeInventory(heroMedia).map((expected) => inspectHeroDerivative({
    filePath: publicFilePath(root, expected.src),
    expected,
  }));
  verifyHeroDerivativeManifest({ root, heroMedia });
  return verified;
}
