import assert from "node:assert/strict";
import test from "node:test";

import {
  auditDesignContract,
  formatAuditReport,
} from "../scripts/audit-design-contract.mjs";

const rootDir = process.cwd();

test("design contract audit inventories an aligned project without writing", () => {
  const report = auditDesignContract({ rootDir });

  assert.equal(report.status, "pass");
  assert.deepEqual(report.summary, {
    featuredWorks: 6,
    archiveItems: 5,
    globalPressItems: 2,
    workPressItems: 3,
  });
  assert.deepEqual(report.collections.featured.order, [
    "slow-steps",
    "tech-dreamers",
    "my-art-my-voice",
    "interior-spatial-brand-films",
    "pts-taigi-bus",
    "top-gear-china-uk-special",
  ]);
  assert.deepEqual(report.collections.archive.order, [
    "ghost-hand-divine-car",
    "three-minute-micro-drama",
    "heart-of-steel",
    "lying-game",
    "overclocking",
  ]);
  assert.deepEqual(report.collections.globalPress.order, [
    "very-mulan-director-interview",
    "wmw-28-selection-guide-part-1",
  ]);
  assert.equal(report.fieldInventory.featured.presentation, 6);
  assert.equal(report.fieldInventory.featured.hideMediaLabel, undefined);
  assert.equal(report.fieldInventory.featured.featuredMediaAspect, undefined);
  assert.equal(report.fieldInventory.featured.focalPoint, undefined);
  assert.equal(report.fieldInventory.featured.posterFocalPoint, 3);
  assert.deepEqual(report.variants.featured, {
    "fill-card": [
      "slow-steps",
      "tech-dreamers",
      "my-art-my-voice",
      "top-gear-china-uk-special",
    ],
    "centered-16x9": [
      "interior-spatial-brand-films",
      "pts-taigi-bus",
    ],
    source: "explicit",
  });
  const { standard, poster, indexFallback } = report.variants.archive;
  assert.deepEqual(standard, report.collections.archive.order);
  assert.deepEqual(
    [...poster, ...indexFallback].sort(),
    [...standard].sort(),
  );
  assert.deepEqual(poster.filter((slug) => indexFallback.includes(slug)), []);
  assert.deepEqual(poster, standard);
  assert.deepEqual(indexFallback, []);
  assert.deepEqual(report.variants.press, {
    "thumbnail-card": 3,
    "text-note": 2,
  });

  const findingIds = report.findings.map((finding) => finding.id);
  assert.deepEqual(findingIds, []);

  const text = formatAuditReport(report);
  assert.match(text, /Portfolio design contract audit: pass/);
  assert.match(text, /6 Featured \/ 5 Archive \/ 2 global Press/);
  assert.match(text, /No active contract drift found\./);
});
