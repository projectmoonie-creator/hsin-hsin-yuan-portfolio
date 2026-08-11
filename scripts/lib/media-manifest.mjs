import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { join, posix } from "node:path";

import { inspectMediaSync } from "./media-inspector.mjs";

const COLLECTION_FIELDS = Object.freeze({
  featured: Object.freeze(["featuredReelUrl"]),
  archive: Object.freeze(["posterImage", "cardReelUrl", "cardReelPoster"]),
});

function requireObject(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

function requireString(value, label) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function validatePublicPath(publicPath) {
  requireString(publicPath, "media asset publicPath");
  if (!publicPath.startsWith("/assets/")
    || publicPath.includes("\\")
    || posix.normalize(publicPath) !== publicPath) {
    throw new Error("media asset publicPath must stay under /assets/");
  }
}

function validateFeaturedReelDelivery(manifest) {
  if (!Object.hasOwn(manifest, "featuredReelDelivery")) return;
  const delivery = manifest.featuredReelDelivery;
  requireObject(delivery, "featuredReelDelivery");
  for (const field of ["sourceProfile", "mobileProfile"]) {
    requireString(delivery[field], `featuredReelDelivery ${field}`);
    if (!Object.hasOwn(manifest.profiles, delivery[field])) {
      throw new Error(`featuredReelDelivery ${field} is unknown: ${delivery[field]}`);
    }
    if (manifest.profiles[delivery[field]].kind !== "video") {
      throw new Error(`featuredReelDelivery ${field} must reference a video profile`);
    }
  }
  const sourceProfile = manifest.profiles[delivery.sourceProfile];
  const mobileProfile = manifest.profiles[delivery.mobileProfile];
  if (mobileProfile.width >= sourceProfile.width
    || mobileProfile.width * sourceProfile.height !== mobileProfile.height * sourceProfile.width) {
    throw new Error("featuredReelDelivery mobileProfile must be a smaller matching-aspect source profile");
  }
  requireString(delivery.directory, "featuredReelDelivery directory");
  if (!delivery.directory.startsWith("/assets/")
    || delivery.directory.includes("\\")
    || posix.normalize(delivery.directory) !== delivery.directory) {
    throw new Error("featuredReelDelivery directory must stay under /assets/");
  }
  requireString(delivery.suffix, "featuredReelDelivery suffix");
  if (!/^-[a-z0-9-]+$/.test(delivery.suffix)) {
    throw new Error("featuredReelDelivery suffix must be a normalized filename suffix");
  }
  if (delivery.media !== "(max-width: 820px)") {
    throw new Error("featuredReelDelivery media must match the canonical 820px mobile breakpoint");
  }
  requireObject(delivery.encode, "featuredReelDelivery encode");
  for (const field of ["crf", "maxRateKbps", "bufferKbps", "keyframeIntervalSeconds", "threads"]) {
    if (!Number.isInteger(delivery.encode[field]) || delivery.encode[field] <= 0) {
      throw new Error(`featuredReelDelivery encode.${field} must be a positive integer`);
    }
  }
  if (delivery.encode.crf > 51) {
    throw new Error("featuredReelDelivery encode.crf must not exceed 51");
  }
  if (!["slow", "medium", "fast"].includes(delivery.encode.preset)) {
    throw new Error("featuredReelDelivery encode.preset is unsupported");
  }
}

export function resolvePublicAssetPath(repoRoot, publicPath) {
  validatePublicPath(publicPath);
  return join(repoRoot, "public", publicPath.slice(1));
}

export function loadMediaManifest(repoRoot = process.cwd()) {
  const manifest = JSON.parse(readFileSync(join(repoRoot, "data/media-manifest.json"), "utf8"));
  return validateMediaManifest(manifest);
}

export function validateMediaManifest(manifest) {
  requireObject(manifest, "media manifest");
  if (manifest.schemaVersion !== 1) {
    throw new Error("media manifest schemaVersion must be 1");
  }
  requireObject(manifest.profiles, "media manifest profiles");
  for (const [name, profile] of Object.entries(manifest.profiles)) {
    requireObject(profile, `media profile ${name}`);
    if (!['video', 'image'].includes(profile.kind)) {
      throw new Error(`media profile ${name} kind must be video or image`);
    }
    requireString(profile.codecName, `media profile ${name} codecName`);
    for (const field of ["width", "height", "streamCount", "audioStreamCount"]) {
      if (!Number.isInteger(profile[field]) || profile[field] < 0) {
        throw new Error(`media profile ${name} ${field} must be a non-negative integer`);
      }
    }
  }
  validateFeaturedReelDelivery(manifest);
  if (!Array.isArray(manifest.assets)) {
    throw new Error("media manifest assets must be an array");
  }

  const ids = new Set();
  const publicPaths = new Set();
  for (const asset of manifest.assets) {
    requireObject(asset, "media manifest asset");
    if (Object.hasOwn(asset, "sourcePath")) {
      throw new Error(`media manifest asset ${asset.id || "<unknown>"} must not store sourcePath`);
    }
    if (Object.hasOwn(asset, "mobilePublicPath")) {
      throw new Error(`media manifest asset ${asset.id || "<unknown>"} must derive mobile delivery instead of storing mobilePublicPath`);
    }
    requireString(asset.id, "media asset id");
    if (ids.has(asset.id)) throw new Error(`media asset id must be unique: ${asset.id}`);
    ids.add(asset.id);

    validatePublicPath(asset.publicPath);
    if (publicPaths.has(asset.publicPath)) {
      throw new Error(`media asset publicPath must be unique: ${asset.publicPath}`);
    }
    publicPaths.add(asset.publicPath);

    requireString(asset.profile, `media asset ${asset.id} profile`);
    if (!Object.hasOwn(manifest.profiles, asset.profile)) {
      throw new Error(`media asset ${asset.id} uses unknown profile ${asset.profile}`);
    }
    requireObject(asset.owner, `media asset ${asset.id} owner`);
    for (const field of ["collection", "slug", "field"]) {
      requireString(asset.owner[field], `media asset ${asset.id} owner.${field}`);
    }
    if (!Object.hasOwn(COLLECTION_FIELDS, asset.owner.collection)) {
      throw new Error(`media asset ${asset.id} owner.collection is unsupported`);
    }
    if (!Number.isInteger(asset.size) || asset.size <= 0) {
      throw new Error(`media asset ${asset.id} size must be a positive integer`);
    }
    if (!/^[0-9a-f]{64}$/.test(asset.sha256)) {
      throw new Error(`media asset ${asset.id} sha256 must be a lowercase SHA-256`);
    }
    if (manifest.profiles[asset.profile].kind === "video"
      && (typeof asset.duration !== "number" || !Number.isFinite(asset.duration) || asset.duration <= 0)) {
      throw new Error(`media asset ${asset.id} duration must be a positive number`);
    }
    if (manifest.featuredReelDelivery
      && asset.owner.collection === "featured"
      && asset.owner.field === "featuredReelUrl"
      && asset.profile !== manifest.featuredReelDelivery.sourceProfile) {
      throw new Error(`media asset ${asset.id} must use featuredReelDelivery sourceProfile`);
    }
  }
  return manifest;
}

function topLevelAtomOffsets(bytes) {
  const offsets = new Map();
  let offset = 0;
  while (offset + 8 <= bytes.length) {
    let size = bytes.readUInt32BE(offset);
    const type = bytes.toString("ascii", offset + 4, offset + 8);
    let headerSize = 8;
    if (size === 1) {
      if (offset + 16 > bytes.length) break;
      size = Number(bytes.readBigUInt64BE(offset + 8));
      headerSize = 16;
    } else if (size === 0) {
      size = bytes.length - offset;
    }
    if (!Number.isSafeInteger(size) || size < headerSize || offset + size > bytes.length) break;
    if (!offsets.has(type)) offsets.set(type, offset);
    offset += size;
  }
  return offsets;
}

export function probeMediaAsset(filePath) {
  const bytes = readFileSync(filePath);
  const inspected = inspectMediaSync(filePath, bytes);
  const atomOffsets = topLevelAtomOffsets(bytes);
  const moovOffset = atomOffsets.get("moov");
  const mdatOffset = atomOffsets.get("mdat");
  return {
    size: statSync(filePath).size,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    duration: inspected.duration,
    streamCount: inspected.streamCount,
    audioStreamCount: inspected.audioStreamCount,
    video: inspected.video,
    faststart: moovOffset !== undefined && mdatOffset !== undefined
      ? moovOffset < mdatOffset
      : null,
  };
}

export function verifyMediaAsset({ entry, profile, filePath }) {
  const probe = probeMediaAsset(filePath);
  if (probe.size !== entry.size) throw new Error(`${entry.id} exact size mismatch`);
  if (probe.sha256 !== entry.sha256) throw new Error(`${entry.id} exact SHA-256 mismatch`);
  if (profile.kind === "video" && Math.abs(probe.duration - entry.duration) >= 0.2) {
    throw new Error(`${entry.id} duration mismatch`);
  }
  const comparisons = [
    ["stream count", probe.streamCount, profile.streamCount],
    ["audio stream count", probe.audioStreamCount, profile.audioStreamCount],
    ["codec", probe.video.codecName, profile.codecName],
    ["width", probe.video.width, profile.width],
    ["height", probe.video.height, profile.height],
    ["pixel format", probe.video.pixelFormat, profile.pixelFormat],
    ["color space", probe.video.colorSpace, profile.colorSpace],
    ["color transfer", probe.video.colorTransfer, profile.colorTransfer],
    ["color primaries", probe.video.colorPrimaries, profile.colorPrimaries],
    ["faststart", probe.faststart, profile.faststart],
  ];
  for (const [label, actual, expected] of comparisons) {
    if (expected !== undefined && actual !== expected) {
      throw new Error(`${entry.id} ${label} mismatch`);
    }
  }
  return probe;
}

export function verifyManifestContentLinks(manifest, collections) {
  validateMediaManifest(manifest);
  const manifestPaths = new Set(manifest.assets.map((asset) => asset.publicPath));

  for (const asset of manifest.assets) {
    const records = collections[asset.owner.collection] || [];
    const record = records.find((item) => item.slug === asset.owner.slug);
    if (!record || record[asset.owner.field] !== asset.publicPath) {
      throw new Error(
        `media asset ${asset.id} does not match ${asset.owner.collection} ${asset.owner.slug} ${asset.owner.field}`,
      );
    }
  }

  for (const [collection, fields] of Object.entries(COLLECTION_FIELDS)) {
    for (const record of collections[collection] || []) {
      for (const field of fields) {
        const publicPath = record[field];
        if (typeof publicPath !== "string" || !publicPath.startsWith("/assets/showreel/")) continue;
        if (!manifestPaths.has(publicPath)) {
          const label = collection === "featured" ? "Featured" : "Archive";
          throw new Error(`${label} ${record.slug} ${field} is missing from media manifest`);
        }
      }
    }
  }
}
