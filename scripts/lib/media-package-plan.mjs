import { basename } from "node:path";

import {
  loadMediaManifest,
  probeMediaAsset,
  verifyMediaAsset,
} from "./media-manifest.mjs";

const RIGHTS_STATUSES = new Set([
  "owned",
  "licensed",
  "public-source-user-confirmed-work",
  "user-supplied-local-source",
]);

function requireText(value, label) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} is required`);
}

function normalizeDuration(duration) {
  return Number(duration.toFixed(3));
}

function manifestEntry({ id, publicPath, profile, owner, probe }) {
  const entry = {
    id,
    publicPath,
    profile,
    owner,
    size: probe.size,
    sha256: probe.sha256,
  };
  if (probe.duration !== null) entry.duration = normalizeDuration(probe.duration);
  return entry;
}

export function createArchiveMediaPackagePlan(input, { repoRoot = process.cwd() } = {}) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug || "")) {
    throw new Error("slug must use lowercase kebab-case");
  }
  requireText(input.reelPath, "reel path");
  requireText(input.posterPath, "poster path");
  if (!RIGHTS_STATUSES.has(input.rightsStatus)) throw new Error("rights status is required and supported");
  requireText(input.imageAlt?.en, "English alt");
  requireText(input.imageAlt?.zh, "Chinese alt");
  if (!/^\d{2}:\d{2}:\d{2}(?:\.\d{3})?$/.test(input.posterSourceTimecode || "")) {
    throw new Error("timecode must use HH:MM:SS or HH:MM:SS.mmm");
  }
  const focal = input.posterFocalPoint;
  if (!focal || !Number.isFinite(focal.x) || !Number.isFinite(focal.y)
    || focal.x < 0 || focal.x > 1 || focal.y < 0 || focal.y > 1) {
    throw new Error("focal point must contain x/y values from 0 to 1");
  }

  const manifest = loadMediaManifest(repoRoot);
  const reelProfileName = "silent-h264-720p-bt709";
  const posterProfileName = "webp-1280x720";
  const reelPublicPath = `/assets/showreel/${input.slug}-card-reel.mp4`;
  const posterPublicPath = `/assets/showreel/${input.slug}-card-reel-poster.webp`;
  const reelProbe = probeMediaAsset(input.reelPath);
  const posterProbe = probeMediaAsset(input.posterPath);
  const reelEntry = manifestEntry({
    id: `archive.${input.slug}.reel`,
    publicPath: reelPublicPath,
    profile: reelProfileName,
    owner: { collection: "archive", slug: input.slug, field: "cardReelUrl" },
    probe: reelProbe,
  });
  const posterEntry = manifestEntry({
    id: `archive.${input.slug}.poster`,
    publicPath: posterPublicPath,
    profile: posterProfileName,
    owner: { collection: "archive", slug: input.slug, field: "posterImage" },
    probe: posterProbe,
  });
  verifyMediaAsset({
    entry: reelEntry,
    profile: manifest.profiles[reelProfileName],
    filePath: input.reelPath,
  });
  verifyMediaAsset({
    entry: posterEntry,
    profile: manifest.profiles[posterProfileName],
    filePath: input.posterPath,
  });

  return {
    schemaVersion: 1,
    mode: "dry-run",
    collection: "archive",
    slug: input.slug,
    writesFiles: false,
    assets: [
      {
        kind: "reel",
        sourceBasename: basename(input.reelPath),
        targetPublicPath: reelPublicPath,
        manifestEntry: reelEntry,
      },
      {
        kind: "poster",
        sourceBasename: basename(input.posterPath),
        targetPublicPath: posterPublicPath,
        manifestEntry: posterEntry,
      },
    ],
    frontmatterPatch: {
      posterImage: posterPublicPath,
      imageAlt: { ...input.imageAlt },
      posterRightsStatus: input.rightsStatus,
      posterDimensions: { width: posterProbe.video.width, height: posterProbe.video.height },
      posterFocalPoint: { ...focal },
      posterSourceTimecode: input.posterSourceTimecode,
      cardReelUrl: reelPublicPath,
      cardReelPoster: posterPublicPath,
      cardReelMode: "after-hold",
      cardReelDuration: normalizeDuration(reelProbe.duration),
      cardReelRightsStatus: input.rightsStatus,
    },
  };
}
