import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";

import {
  applyCopyWorkOrder,
  planCopyWorkOrder,
  validateCopyWorkOrder,
} from "../scripts/lib/copy-work-order.mjs";

const sha256 = "a".repeat(64);
const projectRoot = process.cwd();

function workOrder() {
  return {
    schemaVersion: 1,
    batchId: "sample-bilingual-copy",
    baselineCommit: "b".repeat(40),
    sourceArtifacts: [
      { name: "sample.xlsx", sha256 },
      { name: "sample.json", sha256 },
    ],
    localeScope: ["en", "zh"],
    priorityOrder: ["P0", "P1"],
    entries: [
      {
        priority: "P0",
        sourceFile: "data/site.json",
        stableKey: "site.heroEyebrow",
        changes: {
          en: { op: "replace", expected: "Old English", value: "New English" },
          zh: { op: "replace", expected: "舊中文", value: "新中文" },
        },
      },
      {
        priority: "P1",
        sourceFile: "content/works/sample-work.md",
        stableKey: "featured.sample-work.tagline",
        changes: {
          en: { op: "keep", expected: "Existing English" },
          zh: { op: "replace", expected: "原有中文", value: "核准中文" },
        },
      },
    ],
  };
}

function writeFixtureRepo({ duplicateSiteToken = false } = {}) {
  const root = mkdtempSync(join(tmpdir(), "portfolio-copy-work-order-"));
  const sitePath = join(root, "data/site.json");
  const workPath = join(root, "content/works/sample-work.md");
  mkdirSync(dirname(sitePath), { recursive: true });
  mkdirSync(dirname(workPath), { recursive: true });
  writeFileSync(sitePath, `${JSON.stringify({
    en: {
      heroEyebrow: "Old English",
      ...(duplicateSiteToken ? { duplicate: "Old English" } : {}),
    },
    zh: { heroEyebrow: "舊中文" },
  }, null, 2)}\n`);
  writeFileSync(workPath, `---\n${JSON.stringify({
    slug: "sample-work",
    tagline: { en: "Existing English", zh: "原有中文" },
  }, null, 2)}\n---\nFixture body stays byte-identical.\n`);
  return { root, sitePath, workPath };
}

test("copy work order validates a paired, explicit operation contract", () => {
  const validated = validateCopyWorkOrder(workOrder());
  assert.equal(validated.entries.length, 2);
  assert.deepEqual(validated.localeScope, ["en", "zh"]);
  assert.deepEqual(validated.priorityOrder, ["P0", "P1"]);
  assert.equal(Object.isFrozen(validated), true);
});

test("copy work order dry-run resolves stable keys without changing source bytes", () => {
  const fixture = writeFixtureRepo();
  try {
    const beforeSite = readFileSync(fixture.sitePath);
    const beforeWork = readFileSync(fixture.workPath);
    const plan = applyCopyWorkOrder({
      repoRoot: fixture.root,
      workOrder: workOrder(),
      priority: "P0",
    });

    assert.deepEqual(plan, {
      schemaVersion: 1,
      mode: "dry-run",
      priority: "P0",
      entries: 1,
      replacements: 2,
      keeps: 0,
      conflicts: 0,
      files: ["data/site.json"],
      writesFiles: false,
    });
    assert.deepEqual(readFileSync(fixture.sitePath), beforeSite);
    assert.deepEqual(readFileSync(fixture.workPath), beforeWork);
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test("copy work order rejects one stale value before planning any write", () => {
  const fixture = writeFixtureRepo();
  try {
    const stale = workOrder();
    stale.entries[0].changes.en.expected = "Different English";
    assert.throws(
      () => planCopyWorkOrder({ repoRoot: fixture.root, workOrder: stale, priority: "P0" }),
      /site\.heroEyebrow.*en.*expected current value/i,
    );
    assert.match(readFileSync(fixture.sitePath, "utf8"), /Old English/);
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test("copy work order uses the stable path when the same raw token appears elsewhere", () => {
  const fixture = writeFixtureRepo({ duplicateSiteToken: true });
  try {
    const result = applyCopyWorkOrder({
      repoRoot: fixture.root,
      workOrder: workOrder(),
      priority: "P0",
      write: true,
    });
    const site = JSON.parse(readFileSync(fixture.sitePath, "utf8"));
    assert.equal(result.replacements, 2);
    assert.equal(site.en.heroEyebrow, "New English");
    assert.equal(site.en.duplicate, "Old English");
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test("copy work order fails closed on unsupported stable-key families", () => {
  const invalid = workOrder();
  invalid.entries[0].stableKey = "archive.sample.title";
  assert.throws(() => validateCopyWorkOrder(invalid), /stable key family/i);
});

test("copy work order CLI defaults to dry-run and rejects unsafe write arguments", () => {
  const fixture = writeFixtureRepo();
  try {
    const orderPath = join(fixture.root, "sample-work-order.json");
    writeFileSync(orderPath, `${JSON.stringify(workOrder(), null, 2)}\n`);
    const beforeSite = readFileSync(fixture.sitePath);
    const dryRun = spawnSync(process.execPath, [
      join(projectRoot, "scripts/apply-copy-work-order.mjs"),
      "--work-order",
      orderPath,
    ], { cwd: fixture.root, encoding: "utf8" });

    assert.equal(dryRun.status, 0, dryRun.stderr);
    assert.deepEqual(JSON.parse(dryRun.stdout), {
      schemaVersion: 1,
      mode: "dry-run",
      priority: "all",
      entries: 2,
      replacements: 3,
      keeps: 1,
      conflicts: 0,
      files: ["content/works/sample-work.md", "data/site.json"],
      writesFiles: false,
    });
    assert.deepEqual(readFileSync(fixture.sitePath), beforeSite);

    const unsafe = spawnSync(process.execPath, [
      join(projectRoot, "scripts/apply-copy-work-order.mjs"),
      "--work-order",
      orderPath,
      "--write",
    ], { cwd: fixture.root, encoding: "utf8" });
    assert.notEqual(unsafe.status, 0);
    assert.match(unsafe.stderr, /--write requires --priority/i);
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test("package exposes the guarded copy work-order command", () => {
  const packageJson = JSON.parse(readFileSync(join(projectRoot, "package.json"), "utf8"));
  assert.equal(packageJson.scripts["copy:apply"], "node scripts/apply-copy-work-order.mjs");
});

test("copy work order writes only the intended scalar tokens and enforces P0 before P1", () => {
  const fixture = writeFixtureRepo();
  try {
    const beforeWork = readFileSync(fixture.workPath, "utf8");
    assert.throws(
      () => applyCopyWorkOrder({
        repoRoot: fixture.root,
        workOrder: workOrder(),
        priority: "P1",
        write: true,
      }),
      /P1 requires P0/i,
    );

    const p0 = applyCopyWorkOrder({
      repoRoot: fixture.root,
      workOrder: workOrder(),
      priority: "P0",
      write: true,
    });
    assert.equal(p0.mode, "write");
    assert.equal(p0.writesFiles, true);
    assert.match(readFileSync(fixture.sitePath, "utf8"), /"heroEyebrow": "New English"/);
    assert.match(readFileSync(fixture.sitePath, "utf8"), /"heroEyebrow": "新中文"/);
    assert.equal(readFileSync(fixture.workPath, "utf8"), beforeWork);

    const p1 = applyCopyWorkOrder({
      repoRoot: fixture.root,
      workOrder: workOrder(),
      priority: "P1",
      write: true,
    });
    assert.equal(p1.entries, 1);
    const afterWork = readFileSync(fixture.workPath, "utf8");
    assert.match(afterWork, /"en": "Existing English"/);
    assert.match(afterWork, /"zh": "核准中文"/);
    assert.match(afterWork, /Fixture body stays byte-identical\./);
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test("copy work order rolls every target back after an injected later-file failure", () => {
  const fixture = writeFixtureRepo();
  try {
    const order = workOrder();
    order.entries[1].priority = "P0";
    const before = new Map([
      [fixture.sitePath, readFileSync(fixture.sitePath)],
      [fixture.workPath, readFileSync(fixture.workPath)],
    ]);

    assert.throws(
      () => applyCopyWorkOrder({
        repoRoot: fixture.root,
        workOrder: order,
        priority: "P0",
        write: true,
        beforeReplace: ({ index }) => {
          if (index === 1) throw new Error("injected second-target failure");
        },
      }),
      /injected second-target failure/,
    );

    assert.deepEqual(readFileSync(fixture.sitePath), before.get(fixture.sitePath));
    assert.deepEqual(readFileSync(fixture.workPath), before.get(fixture.workPath));
    for (const directory of [join(fixture.root, "data"), join(fixture.root, "content/works")]) {
      assert.equal(readdirSync(directory).some((name) => name.includes(".copy-work-order-")), false);
    }
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
});

test("approved 31-entry bilingual work order is conflict-free at its frozen baseline", () => {
  const path = join(
    projectRoot,
    "editorial/copy-work-orders/2026-08-09-priority-bilingual.json",
  );
  const order = JSON.parse(readFileSync(path, "utf8"));
  assert.equal(order.baselineCommit, "2f56352cb3049ab8fb535c0ae3c1d0fa57cb599f");
  assert.deepEqual(order.sourceArtifacts, [
    {
      name: "Hsin-Hsin-Yuan-Portfolio-Chinese-Copy-2026-08-06.xlsx",
      sha256: "1d0210cf39a688e417c67edb3b0c2d3ccf9201c3485c055c2d6a541ed6ac9600",
    },
    {
      name: "preview.xlsx",
      sha256: "e0472235778da5bb19c2108e1fe57a293ca5462fd28430699ff1ad4a7acdd897",
    },
    {
      name: "preview.json",
      sha256: "b93e9abfa2589a25d0998c42af5fd14c03753d77f003827c5de2e40b878ebba3",
    },
    {
      name: "preview.md",
      sha256: "10f1a9fb511cc79de088f9b41b251e14ca2fbfedf5dc92e8de4455fbfa69933a",
    },
  ]);
  const plan = applyCopyWorkOrder({ repoRoot: projectRoot, workOrder: order });
  assert.deepEqual(plan, {
    schemaVersion: 1,
    mode: "dry-run",
    priority: "all",
    entries: 31,
    replacements: 57,
    keeps: 5,
    conflicts: 0,
    files: [
      "content/works/interior-spatial-brand-films.md",
      "content/works/my-art-my-voice.md",
      "content/works/pts-taigi-bus.md",
      "content/works/slow-steps.md",
      "content/works/tech-dreamers.md",
      "content/works/top-gear-china-uk-special.md",
      "data/site.json",
    ],
    writesFiles: false,
  });
  assert.equal(order.entries.filter((entry) => entry.priority === "P0").length, 13);
  assert.equal(order.entries.filter((entry) => entry.priority === "P1").length, 18);
});
