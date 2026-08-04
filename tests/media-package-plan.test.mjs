import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { createArchiveMediaPackagePlan } from "../scripts/lib/media-package-plan.mjs";

const root = process.cwd();
const baseInput = {
  slug: "sample-archive",
  reelPath: join(root, "public/assets/showreel/overclocking-card-reel.mp4"),
  posterPath: join(root, "public/assets/showreel/overclocking-card-reel-poster.webp"),
  rightsStatus: "user-supplied-local-source",
  posterSourceTimecode: "00:29:46.000",
  imageAlt: {
    en: "Green water-bike frame during workshop assembly",
    zh: "工作室裡正在組裝的綠色水上腳踏車車架",
  },
  posterFocalPoint: { x: 0.5, y: 0.5 },
};

test("Archive media planner returns one path-redacted deterministic change packet", () => {
  const plan = createArchiveMediaPackagePlan(baseInput);
  assert.equal(plan.schemaVersion, 1);
  assert.equal(plan.mode, "dry-run");
  assert.equal(plan.collection, "archive");
  assert.equal(plan.slug, "sample-archive");
  assert.equal(plan.writesFiles, false);
  assert.deepEqual(plan.assets.map((asset) => ({
    kind: asset.kind,
    sourceBasename: asset.sourceBasename,
    targetPublicPath: asset.targetPublicPath,
    id: asset.manifestEntry.id,
  })), [
    {
      kind: "reel",
      sourceBasename: "overclocking-card-reel.mp4",
      targetPublicPath: "/assets/showreel/sample-archive-card-reel.mp4",
      id: "archive.sample-archive.reel",
    },
    {
      kind: "poster",
      sourceBasename: "overclocking-card-reel-poster.webp",
      targetPublicPath: "/assets/showreel/sample-archive-card-reel-poster.webp",
      id: "archive.sample-archive.poster",
    },
  ]);
  assert.deepEqual(plan.frontmatterPatch, {
    posterImage: "/assets/showreel/sample-archive-card-reel-poster.webp",
    imageAlt: baseInput.imageAlt,
    posterRightsStatus: "user-supplied-local-source",
    posterDimensions: { width: 1280, height: 720 },
    posterFocalPoint: { x: 0.5, y: 0.5 },
    posterSourceTimecode: "00:29:46.000",
    cardReelUrl: "/assets/showreel/sample-archive-card-reel.mp4",
    cardReelPoster: "/assets/showreel/sample-archive-card-reel-poster.webp",
    cardReelMode: "after-hold",
    cardReelDuration: 10,
    cardReelRightsStatus: "user-supplied-local-source",
  });
  assert.equal(JSON.stringify(plan).includes(root), false);
});

test("Archive media planner requires explicit publication metadata", () => {
  for (const [label, input] of [
    ["rights", { ...baseInput, rightsStatus: "" }],
    ["English alt", { ...baseInput, imageAlt: { ...baseInput.imageAlt, en: "" } }],
    ["Chinese alt", { ...baseInput, imageAlt: { ...baseInput.imageAlt, zh: "" } }],
    ["timecode", { ...baseInput, posterSourceTimecode: "10 minutes" }],
    ["focal point", { ...baseInput, posterFocalPoint: { x: 2, y: 0.5 } }],
  ]) {
    assert.throws(() => createArchiveMediaPackagePlan(input), new RegExp(label));
  }
});

test("media:plan CLI prints JSON without writing in its working directory", () => {
  const emptyWorkingDirectory = mkdtempSync(join(tmpdir(), "portfolio-media-plan-"));
  const cliPath = join(root, "scripts/plan-archive-media-package.mjs");
  try {
    const output = execFileSync(process.execPath, [
      cliPath,
      "--slug", "sample-archive",
      "--reel", baseInput.reelPath,
      "--poster", baseInput.posterPath,
      "--rights", baseInput.rightsStatus,
      "--timecode", baseInput.posterSourceTimecode,
      "--alt-en", baseInput.imageAlt.en,
      "--alt-zh", baseInput.imageAlt.zh,
      "--focal-x", String(baseInput.posterFocalPoint.x),
      "--focal-y", String(baseInput.posterFocalPoint.y),
    ], { cwd: emptyWorkingDirectory, encoding: "utf8" });
    const plan = JSON.parse(output);
    assert.equal(plan.mode, "dry-run");
    assert.equal(output.includes(root), false);
    assert.deepEqual(readdirSync(emptyWorkingDirectory), []);
  } finally {
    rmSync(emptyWorkingDirectory, { recursive: true, force: true });
  }
});

test("package exposes the Archive media planner as media:plan", () => {
  const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  assert.equal(packageJson.scripts["media:plan"], "node scripts/plan-archive-media-package.mjs");
});
