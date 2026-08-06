import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative } from "node:path";

import { createArchiveMediaPackagePlan } from "./media-package-plan.mjs";
import {
  loadMediaManifest,
  resolvePublicAssetPath,
  validateMediaManifest,
} from "./media-manifest.mjs";

let writeSequence = 0;

function requireExistingFile(path, label) {
  if (typeof path !== "string" || !path || !existsSync(path)) {
    const safeName = typeof path === "string" && path ? basename(path) : "<missing>";
    throw new Error(`${label} is missing: ${safeName}`);
  }
}

function mergeFrontmatter(source, patch) {
  const match = source.match(/^---\n([\s\S]*?)\n---(\n?[\s\S]*)$/);
  if (!match) throw new Error("Archive Markdown is missing JSON frontmatter");
  const data = JSON.parse(match[1]);
  return `---\n${JSON.stringify({ ...data, ...patch }, null, 2)}\n---${match[2]}`;
}

function relativePath(root, path) {
  return relative(root, path).replaceAll("\\", "/");
}

function serializeMediaManifest(manifest) {
  const expanded = JSON.stringify(manifest, null, 2);
  const compactOwners = expanded.replace(
    /"owner": \{\n\s+"collection": "([^"]+)",\n\s+"slug": "([^"]+)",\n\s+"field": "([^"]+)"\n\s+\}/g,
    '"owner": {"collection": "$1", "slug": "$2", "field": "$3"}',
  );
  return `${compactOwners}\n`;
}

function replaceTargetsAtomically({ repoRoot, targets, beforeRename }) {
  const sequence = `${process.pid}-${writeSequence += 1}`;
  const prepared = targets.map((target, index) => {
    mkdirSync(dirname(target.path), { recursive: true });
    const stagePath = join(dirname(target.path), `.${basename(target.path)}.stage-${sequence}-${index}`);
    const backupPath = join(dirname(target.path), `.${basename(target.path)}.backup-${sequence}-${index}`);
    writeFileSync(stagePath, target.bytes, { flag: "wx" });
    return {
      ...target,
      stagePath,
      backupPath,
      hadExisting: existsSync(target.path),
      movedExisting: false,
      committed: false,
    };
  });

  try {
    for (let index = 0; index < prepared.length; index += 1) {
      const target = prepared[index];
      beforeRename({ index, target: relativePath(repoRoot, target.path) });
      if (target.hadExisting) {
        renameSync(target.path, target.backupPath);
        target.movedExisting = true;
      }
      renameSync(target.stagePath, target.path);
      target.committed = true;
    }
    for (const target of prepared) {
      if (target.movedExisting && existsSync(target.backupPath)) rmSync(target.backupPath);
    }
  } catch (error) {
    for (const target of [...prepared].reverse()) {
      if (target.committed && existsSync(target.path)) rmSync(target.path);
      if (target.movedExisting && existsSync(target.backupPath)) {
        renameSync(target.backupPath, target.path);
      }
      if (existsSync(target.stagePath)) rmSync(target.stagePath);
    }
    throw error;
  } finally {
    for (const target of prepared) {
      if (existsSync(target.stagePath)) rmSync(target.stagePath);
      if (existsSync(target.backupPath)) rmSync(target.backupPath);
    }
  }
}

export function writeArchiveMediaPackage({
  repoRoot,
  slug,
  stagedReelPath,
  stagedPosterPath,
  publication,
  beforeRename = () => {},
}) {
  requireExistingFile(stagedReelPath, "staged reel");
  requireExistingFile(stagedPosterPath, "staged poster");
  const archivePath = join(repoRoot, "content/archive", `${slug}.md`);
  requireExistingFile(archivePath, "Archive record");

  const plan = createArchiveMediaPackagePlan({
    slug,
    reelPath: stagedReelPath,
    posterPath: stagedPosterPath,
    posterSourceKind: "still",
    rightsStatus: publication?.rightsStatus,
    imageAlt: publication?.imageAlt,
    posterFocalPoint: publication?.posterFocalPoint,
  }, { repoRoot });

  const manifest = loadMediaManifest(repoRoot);
  const replacementIds = new Set(plan.assets.map((asset) => asset.manifestEntry.id));
  const nextManifest = {
    ...manifest,
    assets: [
      ...manifest.assets.filter((asset) => !replacementIds.has(asset.id)),
      ...plan.assets.map((asset) => asset.manifestEntry),
    ],
  };
  validateMediaManifest(nextManifest);

  const archiveSource = readFileSync(archivePath, "utf8");
  const nextArchive = mergeFrontmatter(archiveSource, plan.frontmatterPatch);
  const reelTarget = resolvePublicAssetPath(repoRoot, plan.assets[0].targetPublicPath);
  const posterTarget = resolvePublicAssetPath(repoRoot, plan.assets[1].targetPublicPath);
  const manifestPath = join(repoRoot, "data/media-manifest.json");

  replaceTargetsAtomically({
    repoRoot,
    beforeRename,
    targets: [
      { path: reelTarget, bytes: readFileSync(stagedReelPath) },
      { path: posterTarget, bytes: readFileSync(stagedPosterPath) },
      { path: manifestPath, bytes: serializeMediaManifest(nextManifest) },
      { path: archivePath, bytes: nextArchive },
    ],
  });

  return {
    schemaVersion: 1,
    mode: "write",
    writesFiles: true,
    slug,
    targets: [reelTarget, posterTarget, manifestPath, archivePath]
      .map((path) => relativePath(repoRoot, path)),
    assets: plan.assets.map((asset) => ({
      kind: asset.kind,
      publicPath: asset.targetPublicPath,
      size: asset.manifestEntry.size,
      sha256: asset.manifestEntry.sha256,
      ...(asset.manifestEntry.duration == null ? {} : { duration: asset.manifestEntry.duration }),
    })),
  };
}
