import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { basename, extname, posix, resolve } from "node:path";

import {
  probeMediaAsset,
  resolvePublicAssetPath,
  validateMediaManifest,
  verifyMediaAsset,
} from "./media-manifest.mjs";

export const FEATURED_REEL_DELIVERY_MANIFEST =
  "data/generated/featured-reel-delivery-manifest.json";

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) =>
      `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256Bytes(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function featuredSourceAssets(manifest) {
  return manifest.assets.filter((asset) =>
    asset.owner.collection === "featured"
      && asset.owner.field === "featuredReelUrl");
}

function outputPublicPath(sourcePublicPath, delivery) {
  const filename = basename(sourcePublicPath);
  const extension = extname(filename);
  const stem = filename.slice(0, filename.length - extension.length);
  return posix.join(delivery.directory, `${stem}${delivery.suffix}.mp4`);
}

export function featuredReelDeliveryRecipeSha256(manifest) {
  validateMediaManifest(manifest);
  const sourceAssets = featuredSourceAssets(manifest).map((asset) => ({
    id: asset.id,
    publicPath: asset.publicPath,
    profile: asset.profile,
    size: asset.size,
    sha256: asset.sha256,
    duration: asset.duration,
  }));
  return sha256Bytes(Buffer.from(stableJson({
    delivery: manifest.featuredReelDelivery,
    mobileProfile: manifest.profiles[manifest.featuredReelDelivery.mobileProfile],
    sourceAssets,
  })));
}

export function featuredReelDeliveryManifestPath(root) {
  return resolve(root, FEATURED_REEL_DELIVERY_MANIFEST);
}

export function readFeaturedReelDerivativeManifest(root) {
  const filePath = featuredReelDeliveryManifestPath(root);
  if (!existsSync(filePath)) {
    throw new Error(`Missing generated Featured reel delivery manifest: ${filePath}`);
  }
  return JSON.parse(readFileSync(filePath, "utf8"));
}

export function buildFeaturedReelDerivativeInventory(manifest) {
  validateMediaManifest(manifest);
  if (!manifest.featuredReelDelivery) {
    throw new Error("media manifest is missing featuredReelDelivery");
  }
  const delivery = manifest.featuredReelDelivery;
  const profile = manifest.profiles[delivery.mobileProfile];
  return featuredSourceAssets(manifest).map((asset) => ({
    sourceAssetId: asset.id,
    sourcePublicPath: asset.publicPath,
    sourceProfile: asset.profile,
    sourceSize: asset.size,
    sourceSha256: asset.sha256,
    sourceDuration: asset.duration,
    publicPath: outputPublicPath(asset.publicPath, delivery),
    profile: delivery.mobileProfile,
    width: profile.width,
    height: profile.height,
  }));
}

export function deriveFeaturedReelMobileSource({ manifest, sourcePublicPath }) {
  const match = buildFeaturedReelDerivativeInventory(manifest)
    .find((item) => item.sourcePublicPath === sourcePublicPath);
  if (!match) throw new Error(`No canonical Featured reel delivery source for ${sourcePublicPath}`);
  return match.publicPath;
}

export function verifyFeaturedReelSources({ root, manifest }) {
  return buildFeaturedReelDerivativeInventory(manifest).map((item) => {
    const entry = manifest.assets.find((asset) => asset.id === item.sourceAssetId);
    const profile = manifest.profiles[entry.profile];
    const filePath = resolvePublicAssetPath(root, entry.publicPath);
    return { ...item, filePath, probe: verifyMediaAsset({ entry, profile, filePath }) };
  });
}

export function inspectFeaturedReelDerivative({ root, manifest, expected, filePath: requestedFilePath }) {
  const filePath = requestedFilePath || resolvePublicAssetPath(root, expected.publicPath);
  if (!existsSync(filePath)) throw new Error(`Missing Featured reel derivative: ${filePath}`);
  const profile = manifest.profiles[expected.profile];
  const probe = probeMediaAsset(filePath);
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
  for (const [label, actual, wanted] of comparisons) {
    if (wanted !== undefined && actual !== wanted) {
      throw new Error(`${expected.sourceAssetId} mobile ${label} mismatch`);
    }
  }
  if (Math.abs(probe.duration - expected.sourceDuration) >= 0.2) {
    throw new Error(`${expected.sourceAssetId} mobile duration mismatch`);
  }
  const averageBitrateKbps = Number(((probe.size * 8) / probe.duration / 1000).toFixed(3));
  if (averageBitrateKbps > manifest.featuredReelDelivery.encode.maxRateKbps * 1.1) {
    throw new Error(`${expected.sourceAssetId} mobile average bitrate exceeds delivery ceiling`);
  }
  return {
    ...expected,
    filePath,
    size: probe.size,
    sha256: probe.sha256,
    duration: probe.duration,
    codecName: probe.video.codecName,
    audioStreamCount: probe.audioStreamCount,
    faststart: probe.faststart,
    averageBitrateKbps,
  };
}

export function createFeaturedReelDerivativeManifest({ manifest, derivatives }) {
  return {
    schemaVersion: 1,
    recipeSha256: featuredReelDeliveryRecipeSha256(manifest),
    derivatives: derivatives.map((item) => ({
      sourceAssetId: item.sourceAssetId,
      sourcePublicPath: item.sourcePublicPath,
      sourceSha256: item.sourceSha256,
      publicPath: item.publicPath,
      profile: item.profile,
      width: item.width,
      height: item.height,
      size: item.size,
      sha256: item.sha256,
      duration: item.duration,
      codecName: item.codecName,
      audioStreamCount: item.audioStreamCount,
      faststart: item.faststart,
      averageBitrateKbps: item.averageBitrateKbps,
    })),
  };
}

export function verifyFeaturedReelDerivativeManifest({ root, manifest }) {
  verifyFeaturedReelSources({ root, manifest });
  const generated = readFeaturedReelDerivativeManifest(root);
  if (generated.schemaVersion !== 1) {
    throw new Error(`Unsupported Featured reel delivery manifest schema: ${generated.schemaVersion}`);
  }
  const recipeSha256 = featuredReelDeliveryRecipeSha256(manifest);
  if (generated.recipeSha256 !== recipeSha256) {
    throw new Error(`Featured reel delivery recipe SHA-256 mismatch: expected ${recipeSha256}, received ${generated.recipeSha256}`);
  }
  const expected = buildFeaturedReelDerivativeInventory(manifest);
  const recordedByPath = new Map((generated.derivatives || []).map((item) => [item.publicPath, item]));
  if (recordedByPath.size !== expected.length || generated.derivatives?.length !== expected.length) {
    throw new Error(`Featured reel derivative count mismatch: expected ${expected.length}, received ${generated.derivatives?.length ?? 0}`);
  }
  for (const item of expected) {
    const recorded = recordedByPath.get(item.publicPath);
    if (!recorded
      || recorded.sourceAssetId !== item.sourceAssetId
      || recorded.sourcePublicPath !== item.sourcePublicPath
      || recorded.sourceSha256 !== item.sourceSha256
      || recorded.profile !== item.profile
      || recorded.width !== item.width
      || recorded.height !== item.height) {
      throw new Error(`Featured reel delivery contract mismatch: ${item.publicPath}`);
    }
    const inspected = inspectFeaturedReelDerivative({ root, manifest, expected: item });
    for (const field of [
      "size", "sha256", "duration", "codecName", "audioStreamCount", "faststart", "averageBitrateKbps",
    ]) {
      if (recorded[field] !== inspected[field]) {
        throw new Error(`Featured reel derivative ${field} mismatch: ${item.publicPath}`);
      }
    }
  }
  return generated;
}

export function verifyFeaturedReelDerivativeSet({ root, manifest }) {
  const derivatives = buildFeaturedReelDerivativeInventory(manifest).map((expected) =>
    inspectFeaturedReelDerivative({ root, manifest, expected }));
  verifyFeaturedReelDerivativeManifest({ root, manifest });
  return derivatives;
}
