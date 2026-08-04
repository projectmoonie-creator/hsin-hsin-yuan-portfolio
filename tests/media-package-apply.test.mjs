import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";

import { applyArchiveMediaPackage } from "../scripts/lib/media-package-apply.mjs";
import { createArchiveMediaPackagePlan } from "../scripts/lib/media-package-plan.mjs";

const root = process.cwd();
const reelPath = join(root, "public/assets/showreel/overclocking-card-reel.mp4");
const posterPath = join(root, "public/assets/showreel/overclocking-card-reel-poster.webp");
const contentSource = `---
{
  "slug": "sample-archive",
  "order": 99,
  "year": "2026",
  "title": {
    "en": "Sample Archive",
    "zh": "範例作品"
  },
  "platform": "Fixture platform",
  "summary": {
    "en": "Unrelated summary stays byte-identical.",
    "zh": "未相關摘要的位元組必須保持不變。"
  },
  "sourceNote": "fixture evidence"
}
---
Fixture body stays byte-identical.${"  "}
Second line.
`;

const input = {
  slug: "sample-archive",
  reelPath,
  posterPath,
  rightsStatus: "user-supplied-local-source",
  posterSourceTimecode: "00:29:46.000",
  imageAlt: {
    en: "Green water-bike frame during workshop assembly",
    zh: "工作室裡正在組裝的綠色水上腳踏車車架",
  },
  posterFocalPoint: { x: 0.5, y: 0.5 },
};

function canonicalJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function makeFixture(t) {
  const repoRoot = mkdtempSync(join(tmpdir(), "portfolio-media-apply-"));
  t.after(() => rmSync(repoRoot, { recursive: true, force: true }));
  mkdirSync(join(repoRoot, "data"), { recursive: true });
  mkdirSync(join(repoRoot, "content/archive"), { recursive: true });
  mkdirSync(join(repoRoot, "public/assets/showreel"), { recursive: true });
  copyFileSync(join(root, "data/media-manifest.json"), join(repoRoot, "data/media-manifest.json"));
  writeFileSync(join(repoRoot, "content/archive/sample-archive.md"), contentSource);
  const plan = createArchiveMediaPackagePlan(input, { repoRoot });
  return {
    repoRoot,
    plan,
    approvedPlanText: canonicalJson(plan),
    manifestPath: join(repoRoot, "data/media-manifest.json"),
    contentPath: join(repoRoot, "content/archive/sample-archive.md"),
    targetReel: join(repoRoot, "public/assets/showreel/sample-archive-card-reel.mp4"),
    targetPoster: join(repoRoot, "public/assets/showreel/sample-archive-card-reel-poster.webp"),
  };
}

function invoke(fixture, overrides = {}) {
  const { hooks, ...inputOverrides } = overrides;
  return applyArchiveMediaPackage({
    approvedPlanText: fixture.approvedPlanText,
    reelPath,
    posterPath,
    confirmSlug: "sample-archive",
    ...inputOverrides,
  }, { repoRoot: fixture.repoRoot, hooks });
}

function snapshot(fixture) {
  return {
    manifest: readFileSync(fixture.manifestPath),
    content: readFileSync(fixture.contentPath),
    reel: existsSync(fixture.targetReel) ? readFileSync(fixture.targetReel) : null,
    poster: existsSync(fixture.targetPoster) ? readFileSync(fixture.targetPoster) : null,
  };
}

function assertSnapshot(fixture, before) {
  assert.deepEqual(snapshot(fixture), before);
}

test("fresh apply installs exact assets and preserves unrelated manifest/content bytes", (t) => {
  const fixture = makeFixture(t);
  const originalManifest = readFileSync(fixture.manifestPath, "utf8");
  const originalContent = readFileSync(fixture.contentPath, "utf8");
  const receipt = invoke(fixture);

  assert.deepEqual(receipt, {
    schemaVersion: 1,
    operation: "archive-media-package-apply",
    state: "fresh",
    collection: "archive",
    slug: "sample-archive",
    targets: fixture.plan.assets.map((asset) => asset.targetPublicPath),
  });
  assert.deepEqual(readFileSync(fixture.targetReel), readFileSync(reelPath));
  assert.deepEqual(readFileSync(fixture.targetPoster), readFileSync(posterPath));

  const nextManifest = readFileSync(fixture.manifestPath, "utf8");
  const manifestAnchor = originalManifest.lastIndexOf("\n  ]\n}\n");
  assert.ok(manifestAnchor > 0);
  assert.equal(nextManifest.startsWith(originalManifest.slice(0, manifestAnchor)), true);
  assert.equal(nextManifest.endsWith(originalManifest.slice(manifestAnchor)), true);
  const parsedManifest = JSON.parse(nextManifest);
  assert.deepEqual(parsedManifest.assets.slice(-2), fixture.plan.assets.map((asset) => asset.manifestEntry));

  const nextContent = readFileSync(fixture.contentPath, "utf8");
  const contentAnchor = originalContent.indexOf('  "summary":');
  assert.equal(nextContent.startsWith(originalContent.slice(0, contentAnchor)), true);
  assert.equal(nextContent.endsWith(originalContent.slice(contentAnchor)), true);
  const frontmatter = JSON.parse(nextContent.match(/^---\n([\s\S]*?)\n---/)[1]);
  for (const [key, value] of Object.entries(fixture.plan.frontmatterPatch)) {
    assert.deepEqual(frontmatter[key], value);
  }
});

test("an exact rerun is already-applied and performs zero mutations", (t) => {
  const fixture = makeFixture(t);
  invoke(fixture);
  const before = snapshot(fixture);
  const mtimes = [fixture.manifestPath, fixture.contentPath, fixture.targetReel, fixture.targetPoster]
    .map((path) => statSync(path).mtimeMs);
  const mutations = [];

  const receipt = invoke(fixture, { hooks: { beforeMutation: (step) => mutations.push(step) } });

  assert.equal(receipt.state, "already-applied");
  assert.deepEqual(mutations, []);
  assertSnapshot(fixture, before);
  assert.deepEqual(
    [fixture.manifestPath, fixture.contentPath, fixture.targetReel, fixture.targetPoster]
      .map((path) => statSync(path).mtimeMs),
    mtimes,
  );
});

test("approval and confirmation failures are read-only and path-redacted", async (t) => {
  const cases = [
    ["noncanonical plan", (fixture) => ({ approvedPlanText: fixture.approvedPlanText.trimEnd() })],
    ["confirmation mismatch", () => ({ confirmSlug: "different-slug" })],
    ["unknown patch key", (fixture) => {
      const plan = structuredClone(fixture.plan);
      plan.frontmatterPatch.unapproved = true;
      return { approvedPlanText: canonicalJson(plan) };
    }],
    ["recomputed hash mismatch", (fixture) => {
      const plan = structuredClone(fixture.plan);
      plan.assets[0].manifestEntry.sha256 = "0".repeat(64);
      return { approvedPlanText: canonicalJson(plan) };
    }],
  ];

  for (const [label, mutate] of cases) {
    await t.test(label, (caseTest) => {
      const fixture = makeFixture(caseTest);
      const before = snapshot(fixture);
      assert.throws(() => invoke(fixture, mutate(fixture)), (error) => {
        assert.equal(error.message.includes(fixture.repoRoot), false);
        assert.equal(error.message.includes(reelPath), false);
        assert.equal(error.message.includes(posterPath), false);
        return true;
      });
      assertSnapshot(fixture, before);
    });
  }
});

test("partial and conflicting target states fail closed", async (t) => {
  await t.test("partial exact asset", (caseTest) => {
    const fixture = makeFixture(caseTest);
    copyFileSync(reelPath, fixture.targetReel);
    const before = snapshot(fixture);
    assert.throws(() => invoke(fixture), /partial/i);
    assertSnapshot(fixture, before);
  });

  await t.test("conflicting target asset", (caseTest) => {
    const fixture = makeFixture(caseTest);
    copyFileSync(posterPath, fixture.targetReel);
    const before = snapshot(fixture);
    assert.throws(() => invoke(fixture), /conflict/i);
    assertSnapshot(fixture, before);
  });

  await t.test("partial exact manifest entry", (caseTest) => {
    const fixture = makeFixture(caseTest);
    const manifest = JSON.parse(readFileSync(fixture.manifestPath, "utf8"));
    manifest.assets.push(fixture.plan.assets[0].manifestEntry);
    writeFileSync(fixture.manifestPath, canonicalJson(manifest));
    const before = snapshot(fixture);
    assert.throws(() => invoke(fixture), /partial/i);
    assertSnapshot(fixture, before);
  });

  await t.test("conflicting content field", (caseTest) => {
    const fixture = makeFixture(caseTest);
    const content = readFileSync(fixture.contentPath, "utf8").replace(
      '  "summary":',
      '  "posterImage": "/assets/showreel/conflict.webp",\n  "summary":',
    );
    writeFileSync(fixture.contentPath, content);
    const before = snapshot(fixture);
    assert.throws(() => invoke(fixture), /conflict/i);
    assertSnapshot(fixture, before);
  });
});

test("source and target real-path aliasing fails before writes", (t) => {
  const fixture = makeFixture(t);
  copyFileSync(reelPath, fixture.targetReel);
  const aliasInput = { ...input, reelPath: fixture.targetReel };
  const aliasPlan = createArchiveMediaPackagePlan(aliasInput, { repoRoot: fixture.repoRoot });
  const before = snapshot(fixture);
  assert.throws(() => invoke(fixture, {
    reelPath: fixture.targetReel,
    approvedPlanText: canonicalJson(aliasPlan),
  }), /alias/i);
  assertSnapshot(fixture, before);
});

test("handled failures restore originals and remove only A1-created targets", async (t) => {
  for (const failureStep of ["reel", "poster", "manifest", "content"]) {
    await t.test(`failure after ${failureStep}`, (caseTest) => {
      const fixture = makeFixture(caseTest);
      const before = snapshot(fixture);
      assert.throws(() => invoke(fixture, {
        hooks: {
          afterInstall(step) {
            if (step === failureStep) throw new Error("injected failure");
          },
        },
      }), /failed/i);
      assertSnapshot(fixture, before);
      const leftovers = execFileSync("find", [fixture.repoRoot, "-name", "*.portfolio-studio-*"] , {
        encoding: "utf8",
      });
      assert.equal(leftovers, "");
    });
  }
});

test("media:apply CLI is strict, non-interactive, and redacts private paths", () => {
  const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  assert.equal(packageJson.scripts["media:apply"], "node scripts/apply-archive-media-package.mjs");
  const cliPath = join(root, "scripts/apply-archive-media-package.mjs");
  const missingPlan = join(tmpdir(), "private-plan-that-does-not-exist.json");
  const result = spawnSync(process.execPath, [
    cliPath,
    "--plan", missingPlan,
    "--reel", reelPath,
    "--poster", posterPath,
    "--confirm", "sample-archive",
  ], { encoding: "utf8", timeout: 5000, input: "should-not-be-read\n" });

  assert.equal(result.status, 1);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr.includes(missingPlan), false);
  assert.equal(result.stderr.includes(root), false);

  for (const args of [
    ["--unknown", "value"],
    ["positional"],
    ["--plan", "a", "--plan", "b", "--reel", "r", "--poster", "p", "--confirm", "s"],
  ]) {
    const invalid = spawnSync(process.execPath, [cliPath, ...args], {
      encoding: "utf8",
      timeout: 5000,
      input: "should-not-be-read\n",
    });
    assert.equal(invalid.status, 1);
    assert.equal(invalid.stdout, "");
  }
});
