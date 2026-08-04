import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { join, posix } from "node:path";

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
  const ffprobe = JSON.parse(execFileSync("ffprobe", [
    "-v", "error",
    "-show_entries",
    "format=duration:stream=codec_name,codec_type,width,height,pix_fmt,color_space,color_transfer,color_primaries",
    "-of", "json",
    filePath,
  ], { encoding: "utf8" }));
  const streams = ffprobe.streams || [];
  const video = streams.find((stream) => stream.codec_type === "video") || {};
  const atomOffsets = topLevelAtomOffsets(bytes);
  const moovOffset = atomOffsets.get("moov");
  const mdatOffset = atomOffsets.get("mdat");
  const duration = Number(ffprobe.format?.duration);
  return {
    size: statSync(filePath).size,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    duration: Number.isFinite(duration) ? duration : null,
    streamCount: streams.length,
    audioStreamCount: streams.filter((stream) => stream.codec_type === "audio").length,
    video: {
      codecName: video.codec_name,
      width: video.width,
      height: video.height,
      pixelFormat: video.pix_fmt,
      colorSpace: video.color_space,
      colorTransfer: video.color_transfer,
      colorPrimaries: video.color_primaries,
    },
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
