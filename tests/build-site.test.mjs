import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  loadImpact,
  loadMarkdownCollection,
  loadSiteData,
  loadWorks,
  parseFrontmatter,
  renderPage,
} from "../scripts/build-site.mjs";

const root = process.cwd();

test("parseFrontmatter reads JSON frontmatter and body", () => {
  const parsed = parseFrontmatter(`---\n{"title":{"en":"A","zh":"甲"},"order":1}\n---\nBody text`);

  assert.equal(parsed.data.title.en, "A");
  assert.equal(parsed.data.title.zh, "甲");
  assert.equal(parsed.data.order, 1);
  assert.equal(parsed.body.trim(), "Body text");
});

test("loadWorks returns ordered bilingual portfolio works", () => {
  const works = loadWorks(join(root, "content/works"));

  assert.deepEqual(
    works.map((work) => work.slug),
    ["my-art-my-voice", "tech-dreamers", "slow-steps"],
  );
  assert.equal(works[0].title.en, "My Art, My Voice");
  assert.equal(works[0].title.zh, "My Art, My Voice");
  assert.equal(works[2].status, "coming-soon");
});

test("loadImpact returns ordered bilingual proof points", () => {
  const impact = loadImpact(join(root, "data/impact.json"));

  assert.deepEqual(
    impact.map((item) => item.id),
    ["top-gear-reach", "top-gear-rating", "overclocking-audience", "public-funding", "paris-cultural-olympiad"],
  );
  assert.equal(impact[0].value, "200M");
  assert.match(impact[0].label.en, /viewers/i);
  assert.match(impact[1].detail.zh, /0.81/);
});

test("loadMarkdownCollection returns ordered archive and lab entries", () => {
  const archive = loadMarkdownCollection(join(root, "content/archive"));
  const lab = loadMarkdownCollection(join(root, "content/lab"));

  assert.equal(archive[0].slug, "top-gear-china-uk-special");
  assert.equal(archive[0].metrics[0].value, "200M");
  assert.equal(lab[0].slug, "verified-series-script-workflow");
  assert.match(lab[0].title.en, /Script/i);
});

test("renderPage creates bilingual page with horizontal works and video fallbacks", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const html = renderPage({ lang: "en", site, works });

  assert.match(html, /for artists, culture, and technology stories/i);
  assert.match(html, /AI-Language Creative/);
  assert.match(html, /About/);
  assert.match(html, /Work With Me/);
  assert.match(html, /interior design, residential, and spatial-brand videos/i);
  assert.match(html, /designed environments into visual stories/i);
  assert.match(html, /For Artists &amp; Cultural Institutions/);
  assert.match(html, /For Documentary \/ Factual Producers/);
  assert.match(html, /Challenge/);
  assert.match(html, /What I shaped/);
  assert.match(html, /Best for/);
  assert.match(html, /impact-grid/);
  assert.match(html, /AI \/ Language Lab/);
  assert.match(html, /fact-checked bilingual script workflow/i);
  assert.match(html, /Selected Archive/);
  assert.match(html, /contact-links/);
  assert.match(html, /partner-logo/);
  assert.match(html, /\/assets\/logos\/taiwanplus.svg/);
  assert.match(html, /Happy Space/);
  assert.ok(html.indexOf("collab-grid") < html.indexOf("about-section"));
  assert.match(html, /works-track/);
  assert.match(html, /My Art, My Voice/);
  assert.match(html, /Tech Dreamers/);
});

test("build generates English, Chinese, CSS, and JS assets", () => {
  execFileSync("node", ["scripts/build-site.mjs"], { cwd: root, stdio: "pipe" });

  assert.equal(existsSync(join(root, "dist/en/index.html")), true);
  assert.equal(existsSync(join(root, "dist/zh/index.html")), true);
  assert.equal(existsSync(join(root, "dist/styles.css")), true);
  assert.equal(existsSync(join(root, "dist/main.js")), true);

  const zh = readFileSync(join(root, "dist/zh/index.html"), "utf8");
  const css = readFileSync(join(root, "dist/styles.css"), "utf8");
  assert.match(zh, /紀錄片導演/);
  assert.match(zh, /關於我/);
  assert.match(zh, /住宅、室內設計與空間品牌影像/);
  assert.match(zh, /材質、動線、生活感與品牌氣質/);
  assert.match(zh, /藝術家與文化單位/);
  assert.match(zh, /紀實製作人/);
  assert.match(zh, /挑戰/);
  assert.match(zh, /我如何處理/);
  assert.match(zh, /AI \/ Language Lab/);
  assert.match(zh, /精選舊作/);
  assert.match(css, /grid-auto-columns: clamp\(320px, 31vw, 460px\)/);
  assert.match(css, /grid-template-rows: auto 1fr/);
});
