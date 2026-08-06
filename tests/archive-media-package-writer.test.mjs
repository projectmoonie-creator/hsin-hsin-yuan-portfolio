import assert from "node:assert/strict";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";

import { writeArchiveMediaPackage } from "../scripts/lib/archive-media-package-writer.mjs";
import { loadMediaManifest } from "../scripts/lib/media-manifest.mjs";

const sourceRoot = process.cwd();

function createFixture() {
  const root = mkdtempSync(join(tmpdir(), "archive-media-writer-"));
  for (const directory of [
    "content/archive",
    "data",
    "public/assets/showreel",
    "staged",
  ]) mkdirSync(join(root, directory), { recursive: true });
  const sourceManifest = loadMediaManifest(sourceRoot);
  writeFileSync(join(root, "data/media-manifest.json"), `${JSON.stringify({
    schemaVersion: 1,
    profiles: sourceManifest.profiles,
    assets: [],
  }, null, 2)}\n`);
  writeFileSync(join(root, "content/archive/sample.md"), `---\n${JSON.stringify({
    slug: "sample",
    order: 1,
    year: "2020",
    title: { en: "Sample", zh: "範例" },
  }, null, 2)}\n---\nBody bytes stay exact.\n`);
  const stagedReelPath = join(root, "staged/private-source-reel.mp4");
  const stagedPosterPath = join(root, "staged/private-source-poster.webp");
  cpSync(join(sourceRoot, "public/assets/showreel/overclocking-card-reel.mp4"), stagedReelPath);
  cpSync(join(sourceRoot, "public/assets/showreel/overclocking-card-reel-poster.webp"), stagedPosterPath);
  return {
    root,
    input: {
      repoRoot: root,
      slug: "sample",
      stagedReelPath,
      stagedPosterPath,
      publication: {
        rightsStatus: "user-supplied-local-source",
        imageAlt: { en: "Two sample characters", zh: "兩位範例角色" },
        posterFocalPoint: { x: 0.5, y: 0.5 },
      },
    },
  };
}

function readArchive(root) {
  const source = readFileSync(join(root, "content/archive/sample.md"), "utf8");
  return JSON.parse(source.match(/^---\n([\s\S]*?)\n---/)[1]);
}

function snapshotTargets(root) {
  return [
    "public/assets/showreel/sample-card-reel.mp4",
    "public/assets/showreel/sample-card-reel-poster.webp",
    "data/media-manifest.json",
    "content/archive/sample.md",
  ].map((relativePath) => {
    const path = join(root, relativePath);
    return existsSync(path) ? readFileSync(path).toString("base64") : null;
  });
}

test("writer commits reel poster manifest and frontmatter", () => {
  const fixture = createFixture();
  try {
    const result = writeArchiveMediaPackage(fixture.input);
    assert.equal(result.writesFiles, true);
    assert.equal(readArchive(fixture.root).posterImage, "/assets/showreel/sample-card-reel-poster.webp");
    assert.equal(loadMediaManifest(fixture.root).assets.filter((entry) => entry.owner.slug === "sample").length, 2);
    assert.match(
      readFileSync(join(fixture.root, "data/media-manifest.json"), "utf8"),
      /"owner": \{"collection": "archive", "slug": "sample", "field": "cardReelUrl"\}/,
    );
    assert.equal(JSON.stringify(result).includes(fixture.root), false);
    assert.equal(readFileSync(join(fixture.root, "content/archive/sample.md"), "utf8").endsWith("Body bytes stay exact.\n"), true);
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test("writer rolls all targets back after an injected failure", () => {
  const fixture = createFixture();
  try {
    const before = snapshotTargets(fixture.root);
    assert.throws(() => writeArchiveMediaPackage({
      ...fixture.input,
      beforeRename: ({ index }) => {
        if (index === 2) throw new Error("injected commit failure");
      },
    }), /injected commit failure/);
    assert.deepEqual(snapshotTargets(fixture.root), before);
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test("writer errors redact private directories", () => {
  const fixture = createFixture();
  const privateMissingPath = join(fixture.root, "private/source/missing.mp4");
  try {
    assert.throws(
      () => writeArchiveMediaPackage({ ...fixture.input, stagedReelPath: privateMissingPath }),
      (error) => !error.message.includes(dirname(privateMissingPath)),
    );
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});
