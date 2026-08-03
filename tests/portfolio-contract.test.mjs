import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  FIELD_CLASSIFICATION,
  PRESENTATION_VARIANTS,
  normalizeArchiveItem,
  normalizeFeaturedWork,
  normalizeGlobalPressItem,
  normalizeWorkPressItem,
  validatePortfolioCollections,
} from "../scripts/lib/portfolio-contract.mjs";

const localized = (en, zh) => ({ en, zh });

function readWorkSources() {
  return readdirSync(join(process.cwd(), "content/works"))
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const source = readFileSync(join(process.cwd(), "content/works", file), "utf8");
      return JSON.parse(source.match(/^---\n([\s\S]*?)\n---/)?.[1]);
    })
    .sort((a, b) => a.order - b.order);
}

function featured(overrides = {}) {
  return {
    slug: "sample-work",
    featured: true,
    order: 1,
    status: "external-only",
    year: "2026",
    title: localized("Sample", "範例"),
    role: localized("Director", "導演"),
    platform: "Sample Platform",
    tagline: localized("A concise line.", "一句精簡介紹。"),
    description: localized("A factual description.", "一段事實描述。"),
    posterImage: "/assets/sample.webp",
    tags: [],
    metrics: [],
    sourceNote: "private-to-public evidence trail",
    presentation: {
      desktopMediaVariant: "fill-card",
      mobileMediaAspect: "16:9",
      siteTitleOverlay: "none",
      sourceArtworkTitle: "absent",
    },
    ...overrides,
  };
}

test("featured normalization requires public anatomy and explicit presentation", () => {
  for (const key of ["slug", "order", "year", "title", "role", "platform", "tagline", "description", "presentation"]) {
    const source = featured();
    delete source[key];
    assert.throws(
      () => normalizeFeaturedWork(source),
      new RegExp(`Featured work .*${key}`),
      key,
    );
  }

  assert.throws(
    () => normalizeFeaturedWork(featured({ title: { en: "English only" } })),
    /bilingual title/,
  );
  assert.throws(
    () => normalizeFeaturedWork(featured({ presentation: {
      desktopMediaVariant: "special-one-off",
      mobileMediaAspect: "16:9",
      siteTitleOverlay: "none",
      sourceArtworkTitle: "absent",
    } })),
    /desktopMediaVariant/,
  );
});

test("featured normalization preserves evidence and renderer compatibility", () => {
  const fill = normalizeFeaturedWork(featured());
  assert.equal(fill.contract.kind, "featured-work");
  assert.equal(fill.contract.public.title.en, "Sample");
  assert.equal(fill.contract.public.sourceNote, undefined);
  assert.equal(fill.contract.evidence.sourceNote, "private-to-public evidence trail");
  assert.equal(fill.hideMediaLabel, true);
  assert.equal(Object.hasOwn(fill, "featuredMediaAspect"), false);
  assert.deepEqual(fill.presentation, {
    desktopMediaVariant: "fill-card",
    mobileMediaAspect: "16:9",
    siteTitleOverlay: "none",
    sourceArtworkTitle: "absent",
  });

  const centered = normalizeFeaturedWork(featured({
    presentation: {
      desktopMediaVariant: "centered-16x9",
      mobileMediaAspect: "16:9",
      siteTitleOverlay: "none",
      sourceArtworkTitle: "present",
    },
  }));
  assert.equal(centered.featuredMediaAspect, "16:9");
  assert.equal(centered.hideMediaLabel, true);
});

test("Archive and Press normalize to separate named component families", () => {
  const archivePoster = normalizeArchiveItem({
    slug: "archive-poster",
    order: 1,
    year: "2020",
    title: localized("Archive", "典藏"),
    role: localized("Writer", "編劇"),
    posterImage: "/assets/archive.webp",
    platform: "Evidence Platform",
    metrics: [{ value: "1", label: localized("proof", "證明") }],
  });
  const archiveIndex = normalizeArchiveItem({
    slug: "archive-index",
    order: 2,
    year: "2019",
    title: localized("Index", "索引"),
    role: localized("Producer", "製作人"),
  });
  assert.deepEqual(archivePoster.presentation, {
    cardVariant: "standard",
    mediaCapability: "poster",
  });
  assert.deepEqual(archiveIndex.presentation, {
    cardVariant: "standard",
    mediaCapability: "index-fallback",
  });
  assert.equal(archivePoster.contract.public.platform, undefined);
  assert.equal(archivePoster.contract.evidence.platform, "Evidence Platform");
  assert.deepEqual(archivePoster.contract.evidence.metrics, [
    { value: "1", label: localized("proof", "證明") },
  ]);

  const workPress = normalizeWorkPressItem({
    type: localized("Official page", "官方節目頁"),
    title: localized("Program page", "節目頁"),
    source: "Platform",
    url: "https://example.com/work",
    canonicalUrl: "https://example.com/work",
    titleSource: "official page",
    imageSource: "official image",
    metadataCheckedAt: "2026-08-03",
  });
  const globalPress = normalizeGlobalPressItem({
    id: "press-note",
    order: 1,
    year: "2026",
    part: localized("INTERVIEW", "訪談"),
    title: localized("Interview", "專訪"),
    source: localized("Publication", "媒體"),
    url: "https://example.com/press",
    canonicalUrl: "https://example.com/press",
    titleSource: "source headline",
    imageSource: "none; text-only",
    metadataCheckedAt: "2026-08-03",
  });
  assert.equal(workPress.presentation.cardVariant, "thumbnail-card");
  assert.equal(globalPress.presentation.cardVariant, "text-note");
});

test("collection validation rejects duplicate identity and order", () => {
  const work = featured();
  const archive = {
    slug: "archive",
    order: 1,
    year: "2020",
    title: localized("Archive", "典藏"),
    role: localized("Writer", "編劇"),
  };
  const press = {
    id: "press",
    order: 1,
    year: "2026",
    part: localized("PRESS", "報導"),
    title: localized("Title", "標題"),
    source: localized("Source", "來源"),
    url: "https://example.com",
    canonicalUrl: "https://example.com",
    titleSource: "headline",
    imageSource: "none",
    metadataCheckedAt: "2026-08-03",
  };

  assert.throws(
    () => validatePortfolioCollections({
      works: [work, { ...work }],
      archive: [archive],
      press: [press],
    }),
    /Featured work slug must be unique/,
  );
  assert.throws(
    () => validatePortfolioCollections({
      works: [work],
      archive: [archive, { ...archive, slug: "archive-2" }],
      press: [press],
    }),
    /Archive order must be unique/,
  );
});

test("field classes and allowed presentation variants are explicit", () => {
  assert.deepEqual(PRESENTATION_VARIANTS.featured.desktopMediaVariant, [
    "fill-card",
    "centered-16x9",
  ]);
  assert.deepEqual(PRESENTATION_VARIANTS.featured.sourceArtworkTitle, [
    "present",
    "absent",
  ]);
  assert.ok(FIELD_CLASSIFICATION.featured.requiredRendered.includes("presentation"));
  assert.ok(FIELD_CLASSIFICATION.featured.evidenceOnly.includes("sourceNote"));
  assert.deepEqual(FIELD_CLASSIFICATION.featured.retired, [
    "hideMediaLabel",
    "featuredMediaAspect",
  ]);
  assert.ok(FIELD_CLASSIFICATION.archive.evidenceOnly.includes("metrics"));
});

test("Featured source records declare approved variants without legacy inference fields", () => {
  const works = readWorkSources();
  const expected = new Map([
    ["slow-steps", ["fill-card", "absent"]],
    ["tech-dreamers", ["fill-card", "present"]],
    ["my-art-my-voice", ["fill-card", "present"]],
    ["interior-spatial-brand-films", ["centered-16x9", "absent"]],
    ["pts-taigi-bus", ["centered-16x9", "present"]],
    ["top-gear-china-uk-special", ["fill-card", "present"]],
  ]);

  assert.equal(works.length, expected.size);
  for (const work of works) {
    const [desktopMediaVariant, sourceArtworkTitle] = expected.get(work.slug);
    assert.deepEqual(work.presentation, {
      desktopMediaVariant,
      mobileMediaAspect: "16:9",
      siteTitleOverlay: "none",
      sourceArtworkTitle,
    }, work.slug);
    assert.equal(Object.hasOwn(work, "hideMediaLabel"), false, work.slug);
    assert.equal(Object.hasOwn(work, "featuredMediaAspect"), false, work.slug);
  }
});

test("media focal evidence uses one normalized field name and shape", () => {
  const works = readWorkSources();
  const focalWorks = works.filter((work) => work.posterFocalPoint || work.focalPoint);

  assert.deepEqual(focalWorks.map((work) => work.slug), [
    "slow-steps",
    "tech-dreamers",
    "interior-spatial-brand-films",
  ]);
  for (const work of focalWorks) {
    assert.equal(Object.hasOwn(work, "focalPoint"), false, work.slug);
    assert.equal(typeof work.posterFocalPoint, "object", work.slug);
    assert.equal(Number.isFinite(work.posterFocalPoint.x), true, work.slug);
    assert.equal(Number.isFinite(work.posterFocalPoint.y), true, work.slug);
  }
});
