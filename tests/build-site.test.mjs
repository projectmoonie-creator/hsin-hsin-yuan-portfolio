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
  assert.doesNotMatch(impact.map((item) => item.detail.en).join(" "), /Earlier English CV|source materials/i);
  assert.doesNotMatch(impact.map((item) => item.detail.zh).join(" "), /舊.*履歷/);
});

test("loadMarkdownCollection returns ordered archive and lab entries", () => {
  const archive = loadMarkdownCollection(join(root, "content/archive"));
  const lab = loadMarkdownCollection(join(root, "content/lab"));

  assert.equal(archive[0].slug, "top-gear-china-uk-special");
  assert.equal(archive[0].metrics[0].value, "200M");
  assert.equal(lab[0].slug, "verified-series-script-workflow");
  assert.match(lab[0].title.en, /Script/i);
});

test("renderPage creates bilingual page with scroll-stack works and video fallbacks", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const html = renderPage({ lang: "en", site, works });

  assert.match(html, /for artists, culture, and technology stories/i);
  assert.match(html, /<span>HSIN-HSIN<\/span><span>YUAN<\/span>/);
  assert.match(html, /Documentary Director <span class="role-slash">\/<\/span> Writer <span class="role-slash">\/<\/span> Producer/);
  assert.match(html, /<span><span class="role-slash">\/<\/span> Cross-Cultural Storyteller<\/span>/);
  assert.doesNotMatch(html, /<div class="hero-roles">.*AI-Language Creative.*<\/div>/s);
  assert.match(html, /<div class="hero-media" id="showreel">/);
  assert.match(html, /class="light-beam-layer"/);
  assert.doesNotMatch(html, /light-beam-left/);
  assert.match(html, /light-beam-right/);
  assert.match(html, /<video[\s\S]*class="hero-showreel-video"[\s\S]*data-showreel-video/);
  assert.match(html, /muted/);
  assert.match(html, /webkit-playsinline/);
  assert.match(html, /preload="none"/);
  assert.doesNotMatch(html, /<video[\s\S]*controls[\s\S]*data-showreel-video/);
  assert.match(html, /aria-label="Watch reel"/);
  assert.doesNotMatch(html, /<span class="hero-media-caption">/);
  assert.doesNotMatch(html, /hero-actions/);
  assert.doesNotMatch(html, /href="#showreel">Reel<\/a>/);
  assert.match(html, /<source src="\/assets\/showreel\/website-visual-reel\.mp4" type="video\/mp4">/);
  assert.doesNotMatch(html, /showreel-modal/);
  assert.doesNotMatch(html, /showreel-section/);
  assert.ok(html.indexOf('id="showreel"') < html.indexOf("collab-section-early"));
  assert.match(html, /Available for/);
  assert.match(html, /available-simple/);
  assert.match(html, /available-pill-list/);
  assert.match(html, /Editing/);
  assert.doesNotMatch(html, /class="available-line"/);
  assert.doesNotMatch(html, /data-about-tabs/);
  assert.doesNotMatch(html, /role="tablist"/);
  assert.doesNotMatch(html, /data-about-tab="available"/);
  assert.doesNotMatch(html, /data-about-panel="available"/);
  assert.doesNotMatch(html, /<h2 class="section-title">About<\/h2>/);
  assert.doesNotMatch(html, /<h2 class="section-title">Work With Me<\/h2>/);
  assert.doesNotMatch(html, /Taiwan-born documentary director and creative producer/i);
  assert.doesNotMatch(html, /Research, treatments, pitch framing, and narrative structure/i);
  assert.doesNotMatch(html, /I partner with artists, cultural teams, producers, and technology companies/i);
  assert.doesNotMatch(html, /interior design and spatial-brand films/i);
  assert.match(html, /For Artists &amp; Cultural Institutions/);
  assert.match(html, /For Documentary \/ Factual Producers/);
  assert.match(html, /Challenge/);
  assert.match(html, /What I shaped/);
  assert.match(html, /Best for/);
  assert.match(html, /impact-grid/);
  assert.match(html, /AI \/ Language Lab/);
  assert.match(html, /fact-checked bilingual script workflow/i);
  assert.match(html, /Selected Archive/);
  assert.match(html, /<form class="contact-form" action="\/api\/contact" method="post" data-contact-form>/);
  assert.match(html, /name="startedAt"/);
  assert.match(html, /name="website"/);
  assert.match(html, /Project type/);
  assert.match(html, /Send inquiry/);
  assert.doesNotMatch(html, /mailto:/);
  assert.match(html, /partner-wordmark/);
  assert.doesNotMatch(html, /\/assets\/logos\/taiwanplus.svg/);
  assert.match(html, /Happy Space/);
  assert.ok(html.indexOf("collab-grid") < html.indexOf("watch-loop"));
  assert.ok(html.indexOf("watch-loop") < html.indexOf("available-section"));
  assert.ok(html.indexOf("watch-loop") < html.indexOf("works-section"));
  assert.ok(html.indexOf("available-section") < html.indexOf("works-section"));
  assert.ok(html.indexOf("works-section") < html.indexOf("impact-section"));
  assert.match(html, /works-stack/);
  assert.match(html, /data-scroll-stack/);
  assert.doesNotMatch(html, /data-horizontal-scroll/);
  assert.match(html, /data-watch-loop/);
  assert.doesNotMatch(html, /Watch Selected Films/);
  assert.doesNotMatch(html, /Screening strip/);
  assert.doesNotMatch(html, /Swipe to explore/);
  assert.match(html, /watch-loop-card/);
  assert.match(html, /href="#my-art-my-voice"/);
  assert.doesNotMatch(html, /View in featured works/);
  assert.doesNotMatch(html, /Scroll to explore/);
  assert.match(html, /My Art, My Voice/);
  assert.match(html, /Tech Dreamers/);
  assert.match(html, /Watch the full episode/);
  assert.match(html, /Watch the series/);
  assert.match(html, /Press &amp; Interviews/);
  assert.match(html, /Official program page/);
  assert.match(html, /Director interview: walking into the sea of creation/);
  assert.match(html, /Very Mulan/);
  assert.match(html, /press-preview-card/);
  assert.doesNotMatch(html, /old English CV|source materials/i);
});

test("build generates English, Chinese, CSS, and JS assets", () => {
  execFileSync("node", ["scripts/build-site.mjs"], { cwd: root, stdio: "pipe" });

  assert.equal(existsSync(join(root, "dist/en/index.html")), true);
  assert.equal(existsSync(join(root, "dist/zh/index.html")), true);
  assert.equal(existsSync(join(root, "dist/styles.css")), true);
  assert.equal(existsSync(join(root, "dist/main.js")), true);
  assert.equal(existsSync(join(root, "dist/ambient-background.js")), true);
  assert.equal(existsSync(join(root, "dist/vendor/anime.esm.min.js")), true);
  assert.equal(existsSync(join(root, "dist/vendor/ogl/src/index.js")), true);
  assert.equal(existsSync(join(root, "dist/assets/showreel/website-visual-reel.mp4")), true);
  assert.equal(existsSync(join(root, "dist/assets/showreel/website-visual-reel-poster.png")), true);

  const zh = readFileSync(join(root, "dist/zh/index.html"), "utf8");
  const css = readFileSync(join(root, "dist/styles.css"), "utf8");
  const js = readFileSync(join(root, "dist/main.js"), "utf8");
  assert.match(zh, /紀錄片導演/);
  assert.match(zh, /觀看 showreel/);
  assert.doesNotMatch(zh, /data-about-tabs/);
  assert.match(zh, /可合作項目/);
  assert.doesNotMatch(zh, /<h2 class="section-title">關於我<\/h2>/);
  assert.doesNotMatch(zh, /合作方式/);
  assert.doesNotMatch(zh, /我是來自台灣的紀錄片導演與創意製作人/);
  assert.doesNotMatch(zh, /情感質地/);
  assert.doesNotMatch(zh, /溫柔但準確地轉譯/);
  assert.doesNotMatch(zh, /住宅與室內設計影像、空間品牌影片/);
  assert.match(zh, /藝術家與文化單位/);
  assert.match(zh, /紀實製作人/);
  assert.match(zh, /剪輯/);
  assert.match(zh, /挑戰/);
  assert.match(zh, /我如何處理/);
  assert.match(zh, /AI \/ Language Lab/);
  assert.match(zh, /精選舊作/);
  assert.match(zh, /觀看完整單集/);
  assert.match(zh, /觀看完整系列/);
  assert.doesNotMatch(zh, /觀看精選影片/);
  assert.match(zh, /有公開影片連結的代表作品/);
  assert.match(zh, /媒體報導與訪談/);
  assert.match(zh, /官方節目頁/);
  assert.match(zh, /真誠地往前走，走進創作的大海/);
  assert.match(zh, /非常木蘭/);
  assert.match(zh, /合作類型/);
  assert.match(zh, /送出洽詢/);
  assert.doesNotMatch(zh, /mailto:/);
  assert.doesNotMatch(zh, /舊.*履歷/);
  assert.match(css, /\.works-stack \{/);
  assert.match(css, /position: sticky;/);
  assert.match(css, /grid-template-columns: minmax\(18rem, 0\.9fr\) minmax\(0, 1fr\)/);
  assert.match(css, /transform: translate3d\(0, calc\(var\(--stack-progress\) \* -0\.45rem\), 0\) scale\(calc\(1 - var\(--stack-progress\) \* 0\.035\)\)/);
  assert.match(css, /\.hero h1 \{\n  font-size: clamp\(3\.5rem, 7\.2vw, 7\.2rem\);/);
  assert.match(css, /\.hero-media \{[\s\S]*?min-height: auto;/);
  assert.match(css, /@media \(max-width: 1280px\) \{\n  \.hero \{\n    grid-template-columns: 1fr;/);
  assert.match(css, /\.impact-item strong \{\n  color: var\(--acid\);\n  display: block;\n  font-size: clamp\(2rem, 3\.2vw, 3\.4rem\);/);
  assert.match(css, /url\(\"\/assets\/portfolio\/hsin-working-white-space\.jpg\"\)/);
  assert.match(css, /\.hero-play-button \{/);
  assert.match(css, /\.hero-showreel-video \{/);
  assert.doesNotMatch(css, /\.hero-actions/);
  assert.doesNotMatch(css, /\.hero-media-caption/);
  assert.doesNotMatch(css, /\.about-tab/);
  assert.doesNotMatch(css, /\.about-copy/);
  assert.match(css, /\.available-pill-list \{/);
  assert.doesNotMatch(css, /\.available-line/);
  assert.doesNotMatch(css, /showreel-modal/);
  assert.match(css, /\.collab-grid \{\n  align-items: center;\n  display: flex;/);
  assert.match(css, /\.collab-item \{\n  align-items: center;\n  background: transparent;\n  border: 0;/);
  assert.match(css, /\.partner-name \{\n  display: none;/);
  assert.match(css, /\.hero h1 span \{\n  display: block;\n  white-space: nowrap;/);
  assert.match(css, /\.hero-roles \.role-slash \{\n  color: var\(--acid\);/);
  assert.match(css, /\.edge-light/);
  assert.match(css, /--edge-proximity/);
  assert.match(css, /\.ambient-canvas \{/);
  assert.match(css, /\.has-ambient-background \.light-beam/);
  assert.doesNotMatch(css, /\.light-beam-left/);
  assert.match(css, /--page-pad: clamp/);
  assert.match(css, /\.watch-loop-card \{/);
  assert.match(css, /\.watch-loop-viewport::before/);
  assert.match(js, /getEdgeProximity/);
  assert.match(js, /pointermove/);
  assert.match(js, /initAmbientBackground/);
  assert.match(js, /scrollRestoration = "manual"/);
  assert.match(js, /data-watch-loop/);
  assert.match(js, /syncLoopCopies/);
  assert.match(js, /offset %= sequenceWidth/);
  assert.match(js, /startLoop/);
  assert.match(js, /pointerdown/);
  assert.match(css, /@media \(max-width: 460px\) \{\n  \.hero h1 \{\n    font-size: clamp\(2\.65rem, 14vw, 3\.45rem\);/);
});
