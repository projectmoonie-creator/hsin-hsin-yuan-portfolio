import { randomUUID } from "node:crypto";
import {
  copyFileSync,
  lstatSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";

import {
  loadMediaManifest,
  resolvePublicAssetPath,
  validateMediaManifest,
  verifyMediaAsset,
} from "./media-manifest.mjs";
import { createArchiveMediaPackagePlan } from "./media-package-plan.mjs";

const PLAN_KEYS = [
  "schemaVersion", "mode", "collection", "slug", "writesFiles", "assets", "frontmatterPatch",
];
const PATCH_KEYS = [
  "posterImage",
  "imageAlt",
  "posterRightsStatus",
  "posterDimensions",
  "posterFocalPoint",
  "posterSourceTimecode",
  "cardReelUrl",
  "cardReelPoster",
  "cardReelMode",
  "cardReelDuration",
  "cardReelRightsStatus",
];

export class MediaPackageApplyError extends Error {
  constructor(message) {
    super(message);
    this.name = "MediaPackageApplyError";
  }
}

function fail(message) {
  throw new MediaPackageApplyError(message);
}

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasExactKeys(value, expected) {
  if (!isObject(value)) return false;
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  return isDeepStrictEqual(actual, wanted);
}

function pathExists(path) {
  try {
    lstatSync(path);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

function parseApprovedPlan(approvedPlanText) {
  if (typeof approvedPlanText !== "string") fail("approved plan must be UTF-8 JSON text");
  let plan;
  try {
    plan = JSON.parse(approvedPlanText);
  } catch {
    fail("approved plan is not valid JSON");
  }
  if (`${JSON.stringify(plan, null, 2)}\n` !== approvedPlanText) {
    fail("approved plan is not canonical JSON");
  }
  if (!hasExactKeys(plan, PLAN_KEYS)) fail("approved plan schema is unsupported");
  if (plan.schemaVersion !== 1 || plan.mode !== "dry-run"
    || plan.collection !== "archive" || plan.writesFiles !== false) {
    fail("approved plan contract is unsupported");
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(plan.slug || "")) {
    fail("approved plan slug is invalid");
  }
  if (!Array.isArray(plan.assets) || plan.assets.length !== 2
    || plan.assets[0]?.kind !== "reel" || plan.assets[1]?.kind !== "poster") {
    fail("approved plan must contain reel and poster assets");
  }
  if (!hasExactKeys(plan.frontmatterPatch, PATCH_KEYS)) {
    fail("approved plan frontmatter patch is unsupported");
  }
  return plan;
}

function validateDerivedTargets(plan) {
  const expected = [
    {
      kind: "reel",
      publicPath: `/assets/showreel/${plan.slug}-card-reel.mp4`,
      id: `archive.${plan.slug}.reel`,
      profile: "silent-h264-720p-bt709",
      field: "cardReelUrl",
    },
    {
      kind: "poster",
      publicPath: `/assets/showreel/${plan.slug}-card-reel-poster.webp`,
      id: `archive.${plan.slug}.poster`,
      profile: "webp-1280x720",
      field: "posterImage",
    },
  ];
  for (let index = 0; index < expected.length; index += 1) {
    const asset = plan.assets[index];
    const contract = expected[index];
    if (!hasExactKeys(asset, ["kind", "sourceBasename", "targetPublicPath", "manifestEntry"])) {
      fail("approved plan asset schema is unsupported");
    }
    const entryKeys = contract.kind === "reel"
      ? ["id", "publicPath", "profile", "owner", "size", "sha256", "duration"]
      : ["id", "publicPath", "profile", "owner", "size", "sha256"];
    if (!hasExactKeys(asset.manifestEntry, entryKeys)
      || asset.kind !== contract.kind
      || asset.targetPublicPath !== contract.publicPath
      || asset.manifestEntry.id !== contract.id
      || asset.manifestEntry.publicPath !== contract.publicPath
      || asset.manifestEntry.profile !== contract.profile
      || !isDeepStrictEqual(asset.manifestEntry.owner, {
        collection: "archive", slug: plan.slug, field: contract.field,
      })) {
      fail("approved plan asset target is unsupported");
    }
  }
}

function assertNoAliases(sourcePaths, targetPaths) {
  for (let index = 0; index < sourcePaths.length; index += 1) {
    const source = sourcePaths[index];
    const target = targetPaths[index];
    if (resolve(source) === resolve(target)) fail("source and target paths alias");
    if (pathExists(source) && pathExists(target)
      && realpathSync(source) === realpathSync(target)) {
      fail("source and target real paths alias");
    }
  }
}

function recomputePlan(plan, { reelPath, posterPath, repoRoot }) {
  let recomputed;
  try {
    recomputed = createArchiveMediaPackagePlan({
      slug: plan.slug,
      reelPath,
      posterPath,
      rightsStatus: plan.frontmatterPatch.cardReelRightsStatus,
      posterSourceTimecode: plan.frontmatterPatch.posterSourceTimecode,
      imageAlt: plan.frontmatterPatch.imageAlt,
      posterFocalPoint: plan.frontmatterPatch.posterFocalPoint,
    }, { repoRoot });
  } catch {
    fail("source media does not satisfy the approved plan");
  }
  if (!isDeepStrictEqual(plan, recomputed)) {
    fail("approved plan does not match the current source media");
  }
}

function parseContent(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) fail("target Archive content has unsupported frontmatter");
  let data;
  try {
    data = JSON.parse(match[1]);
  } catch {
    fail("target Archive content has invalid frontmatter");
  }
  return { data, frontmatter: match[1] };
}

function componentState(exists, exact) {
  if (!exists) return "absent";
  return exact ? "exact" : "conflict";
}

function classifyManifestEntries(manifest, plannedEntries) {
  return plannedEntries.map((planned) => {
    const byId = manifest.assets.filter((entry) => entry.id === planned.id);
    const byPath = manifest.assets.filter((entry) => entry.publicPath === planned.publicPath);
    if (byId.length === 0 && byPath.length === 0) return "absent";
    if (byId.length === 1 && byPath.length === 1 && byId[0] === byPath[0]
      && isDeepStrictEqual(byId[0], planned)) return "exact";
    return "conflict";
  });
}

function classifyAsset(path, entry, profile) {
  if (!pathExists(path)) return "absent";
  try {
    if (!lstatSync(path).isFile()) return "conflict";
    verifyMediaAsset({ entry, profile, filePath: path });
    return "exact";
  } catch {
    return "conflict";
  }
}

function classifyPackage({ plan, manifest, content, targetPaths }) {
  const entryStates = classifyManifestEntries(
    manifest,
    plan.assets.map((asset) => asset.manifestEntry),
  );
  const assetStates = plan.assets.map((asset, index) => classifyAsset(
    targetPaths[index],
    asset.manifestEntry,
    manifest.profiles[asset.manifestEntry.profile],
  ));
  const patchStates = PATCH_KEYS.map((key) => componentState(
    Object.hasOwn(content.data, key),
    isDeepStrictEqual(content.data[key], plan.frontmatterPatch[key]),
  ));
  const states = [...entryStates, ...assetStates, ...patchStates];
  if (states.every((state) => state === "absent")) return "fresh";
  if (states.every((state) => state === "exact")) return "already-applied";
  if (states.includes("conflict")) return "conflict";
  return "partial";
}

function serializeManifestEntry(entry) {
  const properties = [
    ["id", entry.id],
    ["publicPath", entry.publicPath],
    ["profile", entry.profile],
  ];
  const lines = ["    {"];
  for (const [key, value] of properties) {
    lines.push(`      ${JSON.stringify(key)}: ${JSON.stringify(value)},`);
  }
  lines.push(`      "owner": ${JSON.stringify(entry.owner)},`);
  lines.push(`      "size": ${entry.size},`);
  lines.push(`      "sha256": ${JSON.stringify(entry.sha256)}${entry.duration === undefined ? "" : ","}`);
  if (entry.duration !== undefined) lines.push(`      "duration": ${entry.duration}`);
  lines.push("    }");
  return lines.join("\n");
}

function createManifestCandidate(original, plan) {
  const tail = "\n  ]\n}\n";
  const anchor = original.lastIndexOf(tail);
  if (anchor < 0 || anchor !== original.length - tail.length) {
    fail("media manifest layout is unsupported");
  }
  const entries = plan.assets.map((asset) => serializeManifestEntry(asset.manifestEntry));
  const candidate = `${original.slice(0, anchor)},\n${entries.join(",\n")}${tail}`;
  try {
    validateMediaManifest(JSON.parse(candidate));
  } catch {
    fail("planned media manifest candidate is invalid");
  }
  return candidate;
}

function createContentCandidate(original, plan) {
  const parsed = parseContent(original);
  if (parsed.data.slug !== plan.slug) fail("target Archive content slug does not match the plan");
  const matches = [...parsed.frontmatter.matchAll(/^  "summary":/gm)];
  if (matches.length !== 1) fail("target Archive content summary anchor is unsupported");
  const orderedPatch = Object.fromEntries(PATCH_KEYS.map((key) => [key, plan.frontmatterPatch[key]]));
  const patchLines = JSON.stringify(orderedPatch, null, 2).split("\n").slice(1, -1);
  patchLines[patchLines.length - 1] += ",";
  const frontmatter = `${parsed.frontmatter.slice(0, matches[0].index)}${patchLines.join("\n")}\n${parsed.frontmatter.slice(matches[0].index)}`;
  const candidate = original.replace(parsed.frontmatter, frontmatter);
  const checked = parseContent(candidate);
  for (const key of PATCH_KEYS) {
    if (!isDeepStrictEqual(checked.data[key], plan.frontmatterPatch[key])) {
      fail("planned Archive content candidate is invalid");
    }
  }
  return candidate;
}

function tempSibling(path, token) {
  return join(dirname(path), `.${basename(path)}.portfolio-studio-${token}`);
}

function removeIfPresent(path) {
  if (pathExists(path)) rmSync(path, { force: true });
}

function restoreFile(path, bytes, mode, token) {
  const restorePath = tempSibling(path, `${token}-restore`);
  writeFileSync(restorePath, bytes, { mode });
  renameSync(restorePath, path);
}

function receipt(plan, state) {
  return {
    schemaVersion: 1,
    operation: "archive-media-package-apply",
    state,
    collection: "archive",
    slug: plan.slug,
    targets: plan.assets.map((asset) => asset.targetPublicPath),
  };
}

function applyFresh({
  plan,
  manifest,
  manifestPath,
  manifestBytes,
  contentPath,
  contentBytes,
  sourcePaths,
  targetPaths,
  hooks,
}) {
  const manifestCandidate = createManifestCandidate(manifestBytes.toString("utf8"), plan);
  const contentCandidate = createContentCandidate(contentBytes.toString("utf8"), plan);
  const token = randomUUID();
  const tempPaths = [
    tempSibling(targetPaths[0], token),
    tempSibling(targetPaths[1], token),
    tempSibling(manifestPath, token),
    tempSibling(contentPath, token),
  ];
  const originalModes = {
    manifest: statSync(manifestPath).mode,
    content: statSync(contentPath).mode,
  };
  const createdAssets = [];
  let installedManifest = false;
  let installedContent = false;

  try {
    hooks?.beforeMutation?.("stage-reel");
    copyFileSync(sourcePaths[0], tempPaths[0]);
    hooks?.beforeMutation?.("stage-poster");
    copyFileSync(sourcePaths[1], tempPaths[1]);
    hooks?.beforeMutation?.("stage-manifest");
    writeFileSync(tempPaths[2], manifestCandidate, { mode: originalModes.manifest });
    hooks?.beforeMutation?.("stage-content");
    writeFileSync(tempPaths[3], contentCandidate, { mode: originalModes.content });

    for (let index = 0; index < 2; index += 1) {
      verifyMediaAsset({
        entry: plan.assets[index].manifestEntry,
        profile: manifest.profiles[plan.assets[index].manifestEntry.profile],
        filePath: tempPaths[index],
      });
    }
    validateMediaManifest(JSON.parse(readFileSync(tempPaths[2], "utf8")));
    parseContent(readFileSync(tempPaths[3], "utf8"));

    for (let index = 0; index < 2; index += 1) {
      const step = plan.assets[index].kind;
      hooks?.beforeMutation?.(`install-${step}`);
      renameSync(tempPaths[index], targetPaths[index]);
      createdAssets.push(targetPaths[index]);
      hooks?.afterInstall?.(step);
    }
    hooks?.beforeMutation?.("install-manifest");
    renameSync(tempPaths[2], manifestPath);
    installedManifest = true;
    hooks?.afterInstall?.("manifest");
    hooks?.beforeMutation?.("install-content");
    renameSync(tempPaths[3], contentPath);
    installedContent = true;
    hooks?.afterInstall?.("content");
  } catch {
    try {
      if (installedContent) restoreFile(contentPath, contentBytes, originalModes.content, token);
      if (installedManifest) restoreFile(manifestPath, manifestBytes, originalModes.manifest, token);
      for (const path of createdAssets) removeIfPresent(path);
      for (const path of tempPaths) removeIfPresent(path);
    } catch {
      fail("media package apply failed and recovery requires inspection");
    }
    fail("media package apply failed; original files were restored");
  }
  for (const path of tempPaths) removeIfPresent(path);
}

export function applyArchiveMediaPackage({
  approvedPlanText,
  reelPath,
  posterPath,
  confirmSlug,
}, { repoRoot = process.cwd(), hooks } = {}) {
  try {
    const plan = parseApprovedPlan(approvedPlanText);
    validateDerivedTargets(plan);
    if (confirmSlug !== plan.slug) fail("confirmation slug does not match the approved plan");
    const sourcePaths = [reelPath, posterPath];
    const targetPaths = plan.assets.map((asset) => resolvePublicAssetPath(
      repoRoot,
      asset.targetPublicPath,
    ));
    assertNoAliases(sourcePaths, targetPaths);
    recomputePlan(plan, { reelPath, posterPath, repoRoot });

    const manifestPath = join(repoRoot, "data/media-manifest.json");
    const contentPath = join(repoRoot, "content/archive", `${plan.slug}.md`);
    const manifestBytes = readFileSync(manifestPath);
    const contentBytes = readFileSync(contentPath);
    const manifest = loadMediaManifest(repoRoot);
    const content = parseContent(contentBytes.toString("utf8"));
    if (content.data.slug !== plan.slug) fail("target Archive content slug does not match the plan");
    const state = classifyPackage({ plan, manifest, content, targetPaths });
    if (state === "already-applied") return receipt(plan, state);
    if (state === "conflict") fail("media package preflight found a conflict");
    if (state === "partial") fail("media package preflight found a partial package");

    applyFresh({
      plan,
      manifest,
      manifestPath,
      manifestBytes,
      contentPath,
      contentBytes,
      sourcePaths,
      targetPaths,
      hooks,
    });
    return receipt(plan, state);
  } catch (error) {
    if (error instanceof MediaPackageApplyError) throw error;
    throw new MediaPackageApplyError("media package apply failed");
  }
}
