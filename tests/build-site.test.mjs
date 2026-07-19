import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  loadMarkdownCollection,
  loadSiteData,
  loadWorks,
  parseFrontmatter,
  renderPage,
} from "../scripts/build-site.mjs";

const root = process.cwd();
const expectedWorkSlugs = [
  "slow-steps",
  "tech-dreamers",
  "my-art-my-voice",
  "interior-spatial-brand-films",
  "pts-taigi-bus",
  "top-gear-china-uk-special",
];
const expectedPreviewSlugs = [
  "slow-steps",
  "tech-dreamers",
  "my-art-my-voice",
  "pts-taigi-bus",
  "top-gear-china-uk-special",
];

function renderEnglish() {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  return { html: renderPage({ lang: "en", site, works }), site, works };
}

test("parseFrontmatter reads JSON frontmatter and body", () => {
  const parsed = parseFrontmatter(`---\n{"title":{"en":"A","zh":"甲"},"order":1}\n---\nBody text`);

  assert.equal(parsed.data.title.en, "A");
  assert.equal(parsed.data.title.zh, "甲");
  assert.equal(parsed.data.order, 1);
  assert.equal(parsed.body.trim(), "Body text");
});

test("loadWorks returns the six bilingual works in canonical order", () => {
  const works = loadWorks(join(root, "content/works"));

  assert.deepEqual(works.map((work) => work.slug), expectedWorkSlugs);
  assert.equal(works[0].title.en, "Slow Steps");
  assert.equal(works[0].role.en, "Director / Editor / Producer");
  assert.equal(works[0].posterImage, "");
  assert.equal(works[1].title.en, "Tech Dreamers");
  assert.equal(works[3].role.en, "Director / Editor");
  assert.equal(works[4].platform, "PTS Taigi / 公視台語台");
  assert.equal(works[5].role.en, "Director");
  assert.equal(works[5].platform, "China Dragon TV");
});

test("loadWorks enforces the shared replaceable-media contract", () => {
  const fixtureDir = mkdtempSync(join(tmpdir(), "portfolio-work-contract-"));
  try {
    writeFileSync(
      join(fixtureDir, "incomplete.md"),
      `---\n{"slug":"incomplete","featured":true,"order":1,"focalPoint":"50% 50%","supportingImages":[]}\n---\n`,
    );
    assert.throws(() => loadWorks(fixtureDir), /incomplete\.mobileFocalPoint/);
  } finally {
    rmSync(fixtureDir, { force: true, recursive: true });
  }
});

test("featured press entries carry source-audit metadata", () => {
  const works = loadWorks(join(root, "content/works"));
  const pressEntries = works.flatMap((work) => work.press || []);

  assert.ok(pressEntries.length > 0);
  for (const item of pressEntries) {
    assert.match(item.canonicalUrl, /^https:\/\//, "press canonicalUrl should be public HTTPS");
    assert.match(item.metadataCheckedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(item.titleSource.length > 4);
    assert.ok(item.imageSource.length > 4);
  }
});

test("site copy uses the current schema plus one watch-loop label", () => {
  const { site, media, archive, ...rest } = loadSiteData(root);
  const retiredFields = [
    "navName",
    "heroEyebrow",
    "heroTitle",
    "heroTitleLines",
    "heroRoleLines",
    "heroSubcopy",
    "worksLabel",
    "worksHint",
    "watchShelfAria",
    "learnLabel",
    "labTitle",
    "labSubcopy",
    "services",
  ];

  assert.equal(rest.collaborations.length > 0, true);
  assert.equal("lab" in rest, false, "homepage data should not load the retired Lab collection");
  assert.equal(media.hero.treatment, "split-showreel");
  assert.ok(archive.length > 0);

  for (const lang of ["en", "zh"]) {
    assert.ok(site[lang].watchLoopAria.length > 4);
    assert.ok(site[lang].portraitRole.length > 12);
    assert.ok(site[lang].portraitStatement.length > 12);
    assert.ok(site[lang].portraitAccent.length > 4);
    assert.ok(site[lang].workTheatreTitle.length > 3);
    assert.equal(site[lang].practiceModes.length, 3);
    for (const field of retiredFields) {
      assert.equal(field in site[lang], false, `${field} should not remain in ${lang} site copy`);
    }
  }
});

test("loadMarkdownCollection still returns ordered archive evidence", () => {
  const archive = loadMarkdownCollection(join(root, "content/archive"));

  assert.equal(archive[0].slug, "three-minute-micro-drama");
  assert.equal(archive[0].metrics[0].value, "200M");
  assert.match(archive[0].body, /Short-form web drama work/);
});

test("renderPage follows the approved hybrid order through the footer", () => {
  const { html } = renderEnglish();
  const markers = [
    'class="hero"',
    'class="section collab-section',
    "data-watch-loop",
    'id="available"',
    'id="works"',
    'class="section collaboration-fit"',
    'class="section archive-section"',
    'id="contact"',
    'class="site-footer"',
  ];
  const positions = markers.map((marker) => html.indexOf(marker));

  assert.ok(positions.every((position) => position >= 0), `missing ordered marker: ${positions}`);
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
});

test("renderPage keeps section wrapper markup balanced", () => {
  const { html } = renderEnglish();
  assert.equal((html.match(/<div\b/g) || []).length, (html.match(/<\/div>/g) || []).length);
  assert.match(
    html,
    /<section class="section archive-section">[\s\S]*?<div class="section-intro">[\s\S]*?<\/div>\s*<div class="archive-list">/,
  );
});

test("renderPage exposes five internal previews and six anchored work rows", () => {
  const { html, works } = renderEnglish();
  const previewLinks = Array.from(
    html.matchAll(/<a class="watch-loop-card[^"]*" href="#([^"]+)"/g),
    (match) => match[1],
  );
  const workRows = Array.from(
    html.matchAll(/<article class="work-row[^"]*" id="([^"]+)"/g),
    (match) => match[1],
  );

  assert.deepEqual(previewLinks, expectedPreviewSlugs);
  assert.deepEqual(workRows, expectedWorkSlugs);
  assert.deepEqual(works.map((work) => work.slug), expectedWorkSlugs);
  assert.equal((html.match(/data-watch-loop-sequence/g) || []).length, 1);
  assert.match(html, /class="watch-loop-card watch-loop-card--text watch-loop-card-text-first" href="#slow-steps"/);
  assert.doesNotMatch(html, /href="#interior-spatial-brand-films"/);
  assert.doesNotMatch(html, /href=""/);
});

test("watch previews use localized semantic images and Slow Steps stays text-first", () => {
  const { html, works } = renderEnglish();
  const slowStart = html.indexOf('href="#slow-steps"');
  const slowEnd = html.indexOf("</a>", slowStart);
  const slowCard = html.slice(slowStart, slowEnd);
  assert.doesNotMatch(slowCard, /<img/);

  for (const slug of expectedPreviewSlugs.slice(1)) {
    const work = works.find((item) => item.slug === slug);
    const start = html.indexOf(`href="#${slug}"`);
    const end = html.indexOf("</a>", start);
    const card = html.slice(start, end);
    assert.match(card, /<span class="watch-loop-media">/);
    assert.match(card, new RegExp(`src="${work.posterImage.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
    assert.match(card, new RegExp(`alt="${work.posterAlt.en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
    assert.match(card, new RegExp(`width="${work.posterDimensions.width}"`));
    assert.match(card, new RegExp(`height="${work.posterDimensions.height}"`));
    assert.match(card, /style="--media-focal: [^"]+"/);
  }
});

test("hero and work media follow the replaceable semantic image contract", () => {
  const { html, site, works } = renderEnglish();
  assert.ok(site.media?.hero, "loadSiteData should expose the validated media manifest");
  const hero = site.media.hero;

  assert.match(html, new RegExp(`class="hero-poster"[\\s\\S]*src="${hero.poster.replaceAll("/", "\\/")}"`));
  assert.match(html, new RegExp(`alt="${hero.alt.en}"`));
  assert.match(html, new RegExp(`width="${hero.dimensions.width}"`));
  assert.match(html, new RegExp(`height="${hero.dimensions.height}"`));
  assert.match(html, new RegExp(`<source src="${hero.video.replaceAll("/", "\\/")}" type="video\\/mp4">`));
  assert.match(html, /--hero-focal: 50% 50%; --hero-mobile-focal: 50% 50%/);

  for (const work of works.filter((item) => item.posterImage)) {
    const start = html.indexOf(`id="${work.slug}"`);
    const end = html.indexOf("</article>", start);
    const row = html.slice(start, end);
    assert.match(row, /<figure class="media-frame">/);
    assert.match(row, /<img class="work-image"/);
    assert.match(row, new RegExp(`width="${work.posterDimensions.width}"`));
    assert.match(row, new RegExp(`height="${work.posterDimensions.height}"`));
    assert.match(row, /style="--media-focal: [^"]+"/);
  }
  assert.doesNotMatch(html, /background-image:/);
});

test("renderPage propagates mobile crops and supporting-image metadata", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const work = works.find((item) => item.slug === "my-art-my-voice");
  work.mobileFocalPoint = "58% 48%";
  work.supportingImages = [
    {
      ...work.supportingImages[0],
      focalPoint: "44% 50%",
      mobileFocalPoint: "60% 50%",
      dimensions: { width: 1600, height: 900 },
    },
  ];

  const html = renderPage({ lang: "en", site, works });
  const rowStart = html.indexOf('id="my-art-my-voice"');
  const rowEnd = html.indexOf("</article>", rowStart);
  const row = html.slice(rowStart, rowEnd);

  assert.match(row, /style="--media-focal: 50% 42%; --media-mobile-focal: 58% 48%"/);
  assert.match(row, /class="work-supporting-image"/);
  assert.match(row, /width="1600" height="900"/);
  assert.match(row, /style="--media-focal: 44% 50%; --media-mobile-focal: 60% 50%"/);
});

test("renderPage retires services, Lab, portrait carrier, ambient, and sticky theatre", () => {
  const { html } = renderEnglish();

  for (const fingerprint of [
    "services-grid",
    "service-card",
    'class="section lab-section',
    "portrait-carrier",
    "portrait-signal",
    "light-beam-layer",
    "ambient-canvas",
    "data-scroll-stack",
    "work-theatre-sticky",
  ]) {
    assert.doesNotMatch(html, new RegExp(fingerprint));
  }
});

test("renderPage preserves contact form, SEO, bilingual links, and verified actions", () => {
  const { html } = renderEnglish();

  assert.match(html, /<form class="contact-form" action="\/api\/contact" method="post" data-contact-form>/);
  assert.match(html, /name="startedAt"/);
  assert.match(html, /name="website"/);
  assert.doesNotMatch(html, /mailto:/);
  assert.match(html, /<script type="application\/ld\+json">/);
  assert.match(html, /"@type":"Person"/);
  assert.match(html, /"name":"Hsin-Hsin Yuan"/);
  assert.match(html, /<link rel="alternate" hreflang="zh-Hant"/);
  assert.match(html, /class="language-switch" href="\/zh\/">中<\/a>/);
  assert.match(html, /https:\/\/youtu\.be\/M_eXe9HRD9Y\?si=YZ_3JZ7FJY4vVcZv/);
  assert.match(html, /Watch the full episode/);
  assert.match(html, /Watch the series/);
  assert.match(html, /Press &amp; Interviews/);
  assert.match(html, /data-metadata-checked-at="2026-07-12"/);
});

test("Chinese output maps the same architecture and action language", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const html = renderPage({ lang: "zh", site, works });

  assert.match(html, /<html lang="zh">/);
  assert.match(html, /代表影像作品/);
  assert.match(html, /可合作項目/);
  assert.match(html, /精選作品/);
  assert.match(html, /誰適合找我/);
  assert.match(html, /精選舊作/);
  assert.match(html, /觀看完整單集/);
  assert.match(html, /觀看完整系列/);
  assert.match(html, /觀看代表片段/);
  assert.match(html, /送出洽詢/);
  assert.match(html, /class="language-switch" href="\/en\/">EN<\/a>/);
  assert.equal((html.match(/<article class="work-row/g) || []).length, 6);
  assert.equal((html.match(/<a class="watch-loop-card/g) || []).length, 5);
});

test("build generates bilingual pages, core assets, watch-loop module, and discovery files", () => {
  execFileSync("node", ["scripts/build-site.mjs"], { cwd: root, stdio: "pipe" });

  for (const path of [
    "dist/en/index.html",
    "dist/zh/index.html",
    "dist/styles.css",
    "dist/main.js",
    "dist/watch-loop.js",
    "dist/robots.txt",
    "dist/sitemap.xml",
    "dist/assets/showreel/website-visual-reel.mp4",
    "dist/assets/showreel/website-visual-reel-poster.png",
  ]) {
    assert.equal(existsSync(join(root, path)), true, `${path} should exist`);
  }
  assert.equal(existsSync(join(root, "dist/ambient-background.js")), false);
  assert.equal(existsSync(join(root, "dist/vendor/anime.esm.min.js")), false);
  assert.equal(existsSync(join(root, "dist/vendor/ogl/src/index.js")), false);

  const en = readFileSync(join(root, "dist/en/index.html"), "utf8");
  const zh = readFileSync(join(root, "dist/zh/index.html"), "utf8");
  const robots = readFileSync(join(root, "dist/robots.txt"), "utf8");
  const sitemap = readFileSync(join(root, "dist/sitemap.xml"), "utf8");
  assert.match(en, /Selected moving-image works/);
  assert.match(zh, /代表影像作品/);
  assert.match(robots, /Sitemap: https:\/\/hsin-hsin-yuan-portfolio\.vercel\.app\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/hsin-hsin-yuan-portfolio\.vercel\.app\/en\/<\/loc>/);
  assert.match(sitemap, /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
});
