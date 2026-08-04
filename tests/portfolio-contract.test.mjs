import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  FEATURED_REEL_EVIDENCE_FIELDS,
  FEATURED_REEL_MODES,
  FEATURED_REEL_PUBLIC_FIELDS,
  FIELD_CLASSIFICATION,
  PRESENTATION_VARIANTS,
  normalizeArchiveItem,
  normalizeFeaturedWork,
  normalizeGlobalPressItem,
  normalizeHeroMedia,
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

function heroMedia(overrides = {}) {
  return {
    id: "site.hero",
    src: "/assets/portfolio/hsin-working-white-space.jpg",
    alt: localized(
      "Hsin-Hsin Yuan working on a laptop in a bright white studio",
      "袁欣欣在明亮的白色工作空間使用筆記型電腦",
    ),
    dimensions: { width: 1920, height: 1440 },
    focalPoint: {
      wide: { x: 0.38, y: 0.78 },
      stacked: { x: 0.38, y: 0.77 },
      mobile: { x: 0.38, y: 0.78 },
    },
    motion: "slow-push",
    rightsStatus: "user-supplied-local-source",
    ...overrides,
  };
}

test("HeroMedia normalization freezes one public contract and keeps rights evidence private", () => {
  const normalized = normalizeHeroMedia(heroMedia());

  assert.equal(normalized.contract.kind, "hero-media");
  assert.deepEqual(normalized.contract.public, {
    id: "site.hero",
    src: "/assets/portfolio/hsin-working-white-space.jpg",
    alt: localized(
      "Hsin-Hsin Yuan working on a laptop in a bright white studio",
      "袁欣欣在明亮的白色工作空間使用筆記型電腦",
    ),
    dimensions: { width: 1920, height: 1440 },
    focalPoint: {
      wide: { x: 0.38, y: 0.78 },
      stacked: { x: 0.38, y: 0.77 },
      mobile: { x: 0.38, y: 0.78 },
    },
    motion: "slow-push",
  });
  assert.deepEqual(normalized.contract.evidence, {
    rightsStatus: "user-supplied-local-source",
  });
  assert.equal(Object.hasOwn(normalized.contract.public, "rightsStatus"), false);
  assert.equal(Object.isFrozen(normalized), true);
  assert.equal(Object.isFrozen(normalized.alt), true);
  assert.equal(Object.isFrozen(normalized.dimensions), true);
  assert.equal(Object.isFrozen(normalized.focalPoint), true);
  assert.equal(Object.isFrozen(normalized.focalPoint.wide), true);
  assert.equal(Object.isFrozen(normalized.contract.public), true);
  assert.equal(Object.isFrozen(normalized.contract.evidence), true);
});

test("HeroMedia normalization rejects unknown, missing, unsafe, and unsupported values", () => {
  const cases = [
    [heroMedia({ surprise: true }), /unknown field surprise/],
    [heroMedia({ id: "site.other" }), /id must be site\.hero/],
    [heroMedia({ src: 42 }), /src must be a normalized local portfolio asset/],
    [heroMedia({ src: "https://example.com/hero.jpg" }), /src must be a normalized local portfolio asset/],
    [heroMedia({ src: "/assets/portfolio/../private/hero.jpg" }), /src must be a normalized local portfolio asset/],
    [heroMedia({ alt: { en: "English only" } }), /requires bilingual alt/],
    [heroMedia({ dimensions: { width: 1920, height: 0 } }), /dimensions height must be a positive integer/],
    [heroMedia({ dimensions: { width: 1920, height: 1440, depth: 8 } }), /dimensions has unknown field depth/],
    [heroMedia({ focalPoint: { wide: { x: 0.38, y: 0.78 }, mobile: { x: 0.38, y: 0.78 } } }), /focalPoint is missing stacked/],
    [heroMedia({ focalPoint: { wide: { x: -0.1, y: 0.78 }, stacked: { x: 0.38, y: 0.77 }, mobile: { x: 0.38, y: 0.78 } } }), /focalPoint wide x must be between 0 and 1/],
    [heroMedia({ focalPoint: { wide: { x: 0.38, y: 0.78, z: 1 }, stacked: { x: 0.38, y: 0.77 }, mobile: { x: 0.38, y: 0.78 } } }), /focalPoint wide has unknown field z/],
    [heroMedia({ motion: "pan-and-zoom" }), /motion must be one of: slow-push/],
    [heroMedia({ rightsStatus: "" }), /rightsStatus must be one of: user-supplied-local-source/],
  ];

  for (const [source, expected] of cases) {
    assert.throws(() => normalizeHeroMedia(source), expected);
  }

  const missing = heroMedia();
  delete missing.src;
  assert.throws(() => normalizeHeroMedia(missing), /is missing src/);
});

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

test("featured reel contracts require one complete approved triplet and keep provenance private", () => {
  const publicTriplet = {
    featuredReelMode: "after-hold",
    featuredReelUrl: "/assets/showreel/sample-card-reel.mp4",
    featuredReelPoster: "/assets/sample.webp",
  };
  const provenance = {
    featuredReelSourceFilename: "sample-source.mp4",
    featuredReelSourceSha256: "a".repeat(64),
    featuredReelSourceDuration: 30.03,
    featuredReelSourceDimensions: { width: 1920, height: 1080 },
    featuredReelRightsStatus: "user-supplied-local-source",
  };
  const source = featured({ ...publicTriplet, ...provenance });
  const normalized = normalizeFeaturedWork(source);

  assert.deepEqual(FEATURED_REEL_MODES, ["after-hold"]);
  assert.deepEqual(FEATURED_REEL_PUBLIC_FIELDS, [
    "featuredReelMode",
    "featuredReelUrl",
    "featuredReelPoster",
  ]);
  assert.deepEqual(FEATURED_REEL_EVIDENCE_FIELDS, [
    "featuredReelSourceFilename",
    "featuredReelSourceSha256",
    "featuredReelSourceDuration",
    "featuredReelSourceDimensions",
    "featuredReelRightsStatus",
  ]);
  assert.equal(Object.isFrozen(FEATURED_REEL_PUBLIC_FIELDS), true);
  assert.equal(Object.isFrozen(FEATURED_REEL_EVIDENCE_FIELDS), true);
  assert.deepEqual({
    featuredReelMode: normalized.contract.public.featuredReelMode,
    featuredReelUrl: normalized.contract.public.featuredReelUrl,
    featuredReelPoster: normalized.contract.public.featuredReelPoster,
  }, publicTriplet);
  for (const field of [
    "featuredReelSourceFilename",
    "featuredReelSourceSha256",
    "featuredReelSourceDuration",
    "featuredReelSourceDimensions",
    "featuredReelRightsStatus",
  ]) {
    assert.equal(Object.hasOwn(normalized.contract.public, field), false, field);
  }
  assert.equal(normalized.contract.evidence.featuredReelSourceFilename, "sample-source.mp4");
  assert.equal(normalized.contract.evidence.featuredReelSourceSha256, "a".repeat(64));
  assert.equal(normalized.contract.evidence.featuredReelSourceDuration, 30.03);
  assert.deepEqual(normalized.contract.evidence.featuredReelSourceDimensions, {
    width: 1920,
    height: 1080,
  });
  assert.equal(
    normalized.contract.evidence.featuredReelRightsStatus,
    "user-supplied-local-source",
  );

  const publicEntries = Object.entries(publicTriplet);
  for (let mask = 1; mask < (1 << publicEntries.length) - 1; mask += 1) {
    const subset = Object.fromEntries(
      publicEntries.filter((unused, index) => mask & (1 << index)),
    );
    assert.throws(
      () => normalizeFeaturedWork(featured(subset)),
      /complete featured reel triplet/,
      `public subset: ${Object.keys(subset).join(", ")}`,
    );
  }

  for (const [label, overrides, expectedError] of [
    ["empty mode", { featuredReelMode: "" }, /featuredReelMode must be one of: after-hold/],
    ["null mode", { featuredReelMode: null }, /featuredReelMode must be one of: after-hold/],
    ["empty URL", { featuredReelUrl: "" }, /featuredReelUrl must be non-empty/],
    ["null URL", { featuredReelUrl: null }, /featuredReelUrl must be non-empty/],
    ["empty poster", { featuredReelPoster: "" }, /featuredReelPoster must be non-empty/],
    ["null poster", { featuredReelPoster: null }, /featuredReelPoster must be non-empty/],
  ]) {
    assert.throws(
      () => normalizeFeaturedWork(featured({ ...publicTriplet, ...overrides })),
      expectedError,
      label,
    );
  }

  assert.throws(
    () => normalizeFeaturedWork(featured({
      ...publicTriplet,
      featuredReelMode: "in-view",
    })),
    /featuredReelMode must be one of: after-hold/,
  );

  const provenanceEntries = Object.entries(provenance);
  for (let mask = 1; mask < (1 << provenanceEntries.length) - 1; mask += 1) {
    const subset = Object.fromEntries(
      provenanceEntries.filter((unused, index) => mask & (1 << index)),
    );
    assert.throws(
      () => normalizeFeaturedWork(featured({ ...publicTriplet, ...subset })),
      /requires complete featured reel provenance/,
      `provenance subset: ${Object.keys(subset).join(", ")}`,
    );
  }

  for (const [label, overrides, expectedError] of [
    [
      "empty filename",
      { featuredReelSourceFilename: "" },
      /featuredReelSourceFilename must be non-empty/,
    ],
    [
      "null filename",
      { featuredReelSourceFilename: null },
      /featuredReelSourceFilename must be non-empty/,
    ],
    [
      "empty rights status",
      { featuredReelRightsStatus: "" },
      /featuredReelRightsStatus must be non-empty/,
    ],
    [
      "null rights status",
      { featuredReelRightsStatus: null },
      /featuredReelRightsStatus must be non-empty/,
    ],
    [
      "malformed SHA-256",
      { featuredReelSourceSha256: "not-a-sha" },
      /featuredReelSourceSha256.*SHA-256/,
    ],
    [
      "uppercase SHA-256",
      { featuredReelSourceSha256: "A".repeat(64) },
      /featuredReelSourceSha256.*SHA-256/,
    ],
    [
      "zero duration",
      { featuredReelSourceDuration: 0 },
      /featuredReelSourceDuration must be a positive number/,
    ],
    [
      "negative duration",
      { featuredReelSourceDuration: -1 },
      /featuredReelSourceDuration must be a positive number/,
    ],
    [
      "non-numeric duration",
      { featuredReelSourceDuration: "30.03" },
      /featuredReelSourceDuration must be a positive number/,
    ],
  ]) {
    assert.throws(
      () => normalizeFeaturedWork(featured({
        ...publicTriplet,
        ...provenance,
        ...overrides,
      })),
      expectedError,
      label,
    );
  }

  for (const [label, featuredReelSourceDimensions] of [
    ["missing width", { height: 1080 }],
    ["missing height", { width: 1920 }],
    ["zero width", { width: 0, height: 1080 }],
    ["negative width", { width: -1, height: 1080 }],
    ["non-numeric width", { width: "1920", height: 1080 }],
    ["zero height", { width: 1920, height: 0 }],
    ["negative height", { width: 1920, height: -1 }],
    ["non-numeric height", { width: 1920, height: "1080" }],
  ]) {
    assert.throws(
      () => normalizeFeaturedWork(featured({
        ...publicTriplet,
        ...provenance,
        featuredReelSourceDimensions,
      })),
      /featuredReelSourceDimensions must contain positive numbers/,
      label,
    );
  }
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

test("six Featured works declare the approved poster-first reel contract", () => {
  const expected = new Map([
    ["slow-steps", {
      featuredReelMode: "after-hold",
      featuredReelUrl: "/assets/showreel/slow-steps-card-reel.mp4",
      featuredReelPoster: "/assets/portfolio/slow-steps-poster.webp",
      featuredReelSourceFilename: "Slow Steps 30s系列網路平台宣傳片完成檔.mp4",
      featuredReelSourceSha256: "0def72570da58eeb51af84b07d4cd880b666a3b8718702f7236af468b07f55ba",
      featuredReelSourceDuration: 30.03,
      featuredReelSourceDimensions: { width: 1920, height: 1080 },
      featuredReelRightsStatus: "user-supplied-local-source",
    }],
    ["tech-dreamers", {
      featuredReelMode: "after-hold",
      featuredReelUrl: "/assets/showreel/tech-dreamers-card-reel.mp4",
      featuredReelPoster: "https://prod-img.taiwanplus.com/program/224be7ed-057b-400f-af63-a8582cd80cfb.webp",
      featuredReelSourceFilename: "Promo Tech Dreamers Series 日期版 0705.mp4",
      featuredReelSourceSha256: "5a1eff80776aed305a0144f135ff9d433374f647fe0feca7a2e72ba708beeb0e",
      featuredReelSourceDuration: 30.03,
      featuredReelSourceDimensions: { width: 1920, height: 1080 },
      featuredReelRightsStatus: "user-supplied-local-source",
    }],
    ["my-art-my-voice", {
      featuredReelMode: "after-hold",
      featuredReelUrl: "/assets/showreel/my-art-my-voice-card-reel.mp4",
      featuredReelPoster: "/assets/portfolio/my-art-my-voice-performance-2.jpg",
      featuredReelSourceFilename: "My art  my voice  0214 預告完成檔.mp4",
      featuredReelSourceSha256: "d7ab1b3c7e4a70b479af7ab28801a9c41993576502aaca87fa7032adef1e1bdd",
      featuredReelSourceDuration: 100.033267,
      featuredReelSourceDimensions: { width: 1920, height: 1080 },
      featuredReelRightsStatus: "user-supplied-local-source",
    }],
    ["interior-spatial-brand-films", {
      featuredReelMode: "after-hold",
      featuredReelUrl: "/assets/showreel/interior-spatial-card-reel.mp4",
      featuredReelPoster: "/assets/portfolio/gorgeous-space-sunny-wang-frontal.webp",
    }],
    ["pts-taigi-bus", {
      featuredReelMode: "after-hold",
      featuredReelUrl: "/assets/showreel/nothing-by-bus-card-reel.mp4",
      featuredReelPoster: "https://i.ytimg.com/vi/q4TMcoOpzKA/hqdefault.jpg",
    }],
    ["top-gear-china-uk-special", {
      featuredReelMode: "after-hold",
      featuredReelUrl: "/assets/showreel/top-gear-china-uk-special-card-reel.mp4",
      featuredReelPoster: "/assets/portfolio/top-gear-uk-special-car.jpg",
      featuredReelSourceFilename: "巅峰拍挡第2季第5期20151116 巅峰拍挡之开着自行火炮闯英国 Top Gear China II EP.5东方卫视官方超清.mp4",
      featuredReelSourceSha256: "4ba65130c3c172ffff40851ee83e05db494be261b1e50527576f5b9fcda2c955",
      featuredReelSourceDuration: 3195.04254,
      featuredReelSourceDimensions: { width: 1920, height: 1080 },
      featuredReelRightsStatus: "user-supplied-local-source",
    }],
  ]);
  const reelWorks = readWorkSources().filter((work) => work.featuredReelUrl);
  const provenanceFields = [
    "featuredReelSourceFilename",
    "featuredReelSourceSha256",
    "featuredReelSourceDuration",
    "featuredReelSourceDimensions",
    "featuredReelRightsStatus",
  ];

  assert.deepEqual(reelWorks.map((work) => work.slug), [...expected.keys()]);
  for (const work of reelWorks) {
    const expectedRecord = expected.get(work.slug);
    assert.deepEqual(
      Object.fromEntries(Object.keys(expectedRecord).map((field) => [field, work[field]])),
      expectedRecord,
      work.slug,
    );
    assert.equal(work.featuredReelPoster, expectedRecord.featuredReelPoster, work.slug);
    assert.equal(work.featuredReelPoster, work.posterImage, work.slug);
    if (!Object.hasOwn(expectedRecord, "featuredReelSourceFilename")) {
      for (const field of provenanceFields) {
        assert.equal(Object.hasOwn(work, field), false, `${work.slug}: ${field}`);
      }
    }
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
