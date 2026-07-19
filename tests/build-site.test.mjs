import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  loadMarkdownCollection,
  loadSiteData,
  loadWorks,
  parseFrontmatter,
  renderPage,
  validateMediaManifest,
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
    [
      "slow-steps",
      "tech-dreamers",
      "my-art-my-voice",
      "interior-spatial-brand-films",
      "pts-taigi-bus",
      "top-gear-china-uk-special",
    ],
  );
  assert.equal(works[0].title.en, "Slow Steps");
  assert.equal(works[0].status, "external-only");
  assert.equal(works[0].role.en, "Director / Editor / Producer");
  assert.equal(works[1].role.en, "Director / Editor / Producer");
  assert.equal(works[3].role.en, "Director / Editor");
  assert.equal(works[4].platform, "PTS Taigi / 公視台語台");
  assert.equal(works[5].role.en, "Director");
  assert.equal(works[5].platform, "China Dragon TV");
  assert.equal(works[0].posterImage, "");
  assert.equal(works[1].posterImage, "https://prod-img.taiwanplus.com/program/224be7ed-057b-400f-af63-a8582cd80cfb.webp");
  assert.equal(works[1].watchUrl, "https://www.taiwanplus.com/shows/documentary/business-and-tech/590/tech-dreamers");
  assert.equal(works[0].platform, "TaiwanPlus / Travel");
  assert.deepEqual(works[0].tags, ["documentary", "travel"]);
  assert.deepEqual(works[5].tags, ["car show", "factual entertainment", "broadcast", "UK production"]);
  assert.equal(works[0].metrics.length, 0);
  assert.equal(works[2].metrics.length, 0);
});

test("featured press entries carry audit metadata", () => {
  const works = loadWorks(join(root, "content/works"));
  const pressEntries = works.flatMap((work) => work.press || []);

  assert.ok(pressEntries.length > 0);
  for (const item of pressEntries) {
    assert.match(item.canonicalUrl, /^https:\/\//, "press canonicalUrl should be public HTTPS");
    assert.match(item.metadataCheckedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(typeof item.titleSource, "string");
    assert.ok(item.titleSource.length > 4);
    assert.equal(typeof item.imageSource, "string");
    assert.ok(item.imageSource.length > 4);
  }
});

test("site copy has no retired section fields in active data", () => {
  const site = loadSiteData(root).site;
  const retiredFields = [
    "heroPrimaryCta",
    "heroSecondaryCta",
    "aboutTitle",
    "aboutLead",
    "aboutBody",
    "aboutNotes",
    "availabilityDetails",
    "workWithMeTitle",
    "workWithMeSubcopy",
    "workModes",
    "showreelEyebrow",
    "showreelSubcopy",
    "watchShelfKicker",
    "watchShelfTitle",
    "watchShelfHint",
    "watchShelfAction",
    "impactLabel",
  ];

  for (const lang of ["en", "zh"]) {
    assert.equal(typeof site[lang].availabilityIntro, "string");
    assert.ok(site[lang].availabilityIntro.length > 20);
    for (const field of retiredFields) {
      assert.equal(field in site[lang], false, `${field} should not remain in ${lang} site copy`);
    }
  }
});

test("loadMarkdownCollection returns ordered archive and lab entries", () => {
  const archive = loadMarkdownCollection(join(root, "content/archive"));
  const lab = loadMarkdownCollection(join(root, "content/lab"));

  assert.equal(archive[0].slug, "three-minute-micro-drama");
  assert.equal(archive[0].metrics[0].value, "200M");
  assert.match(archive[0].body, /Short-form web drama work/);
  assert.equal(lab[0].slug, "verified-series-script-workflow");
  assert.match(lab[0].title.en, /Script/i);
  assert.match(lab[0].body, /future skill name/);
});

test("media manifest provides a replaceable bilingual hero image", () => {
  const media = loadSiteData(root).media;

  assert.doesNotThrow(() => validateMediaManifest(media));
  assert.match(media.hero.background, /^\/assets\/portfolio\//);
  assert.match(media.hero.foregroundCutout, /^\/assets\/portfolio\//);
  assert.match(media.hero.desktopFocalPoint, /^\d+% \d+%$/);
  assert.match(media.hero.mobileFocalPoint, /^\d+% \d+%$/);
  assert.ok(media.hero.alt.en.length > 5);
  assert.ok(media.hero.alt.zh.length > 2);
});

test("media manifest rejects a hero without bilingual alt text", () => {
  assert.throws(
    () =>
      validateMediaManifest({
        hero: {
          background: "/assets/portfolio/portrait.jpg",
          foregroundCutout: "",
          abstractLayer: "/assets/portfolio/abstract.jpg",
          alternatePortraits: [],
          desktopFocalPoint: "50% 50%",
          mobileFocalPoint: "50% 45%",
          alt: { en: "Portrait", zh: "" },
          treatment: "portrait-layered",
        },
      }),
    /hero\.alt\.zh/,
  );
});

test("portrait carrier treatment requires a real foreground cutout", () => {
  assert.throws(
    () =>
      validateMediaManifest({
        hero: {
          background: "/assets/portfolio/portrait.jpg",
          foregroundCutout: "",
          abstractLayer: "/assets/portfolio/abstract.jpg",
          alternatePortraits: [],
          desktopFocalPoint: "50% 50%",
          mobileFocalPoint: "50% 45%",
          alt: { en: "Portrait", zh: "人物肖像" },
          treatment: "portrait-carrier",
        },
      }),
    /foregroundCutout/,
  );
});

test("homepage uses a portrait carrier, three work scenes, and one practice statement", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const html = renderPage({ lang: "en", site, works });

  assert.match(html, /class="portrait-carrier" data-portrait-carrier/);
  assert.match(html, /src="\/assets\/portfolio\/hsin-portrait-foreground\.webp"/);
  assert.equal((html.match(/class="work-scene"/g) || []).length, 3);
  assert.match(html, /class="editorial-section practice-summary"/);
  assert.match(html, /class="editorial-section history-section"/);
  assert.doesNotMatch(html, /class="services-grid"/);
  assert.doesNotMatch(html, /class="section lab-section"/);
  assert.doesNotMatch(html, /class="tag"/);
  assert.doesNotMatch(html, /data-horizontal-scroll/);
});

test("portrait carrier redesign replaces every high-salience legacy fingerprint", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const en = renderPage({ lang: "en", site, works });
  const zh = renderPage({ lang: "zh", site, works });

  for (const html of [en, zh]) {
    assert.match(html, /data-portrait-carrier/);
    assert.match(html, /class="portrait-foreground"/);
    assert.match(html, /data-practice-mode="documentary"/);
    assert.match(html, /data-practice-mode="cross-cultural"/);
    assert.match(html, /data-practice-mode="editorial-systems"/);
    assert.match(html, /data-work-theatre/);
    assert.equal((html.match(/class="work-scene"/g) || []).length, 3);
    assert.doesNotMatch(html, /data-watch-loop|watch-loop-card|work-panel|light-beam-layer/);
  }
});

test("renderPage creates a concise bilingual scene narrative with safe fallbacks", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const en = renderPage({ lang: "en", site, works });
  const zh = renderPage({ lang: "zh", site, works });

  assert.match(en, /<h1>Hsin-Hsin Yuan<\/h1>/);
  assert.match(en, /Documentary director, writer &amp; cross-cultural story partner/);
  assert.match(en, /Find the human turn/);
  assert.match(en, /Carry context without flattening it/);
  assert.match(en, /Make good judgment repeatable/);
  assert.match(zh, /<h1>袁欣欣<\/h1>/);
  assert.match(zh, /找到人真正改變的那一刻/);
  assert.match(zh, /讓脈絡被帶走，而不是被磨平/);
  assert.match(zh, /讓好的判斷可以被重複/);

  for (const html of [en, zh]) {
    assert.match(html, /class="portrait-showreel-video"[\s\S]*data-showreel-video/);
    assert.match(html, /muted/);
    assert.match(html, /webkit-playsinline/);
    assert.match(html, /preload="none"/);
    assert.match(html, /<source src="\/assets\/showreel\/website-visual-reel\.mp4" type="video\/mp4">/);
    assert.match(html, /class="work-scene-media work-scene-media-text" data-text-led/);
    assert.doesNotMatch(html, /slow-steps[\s\S]*?paris-cultural-olympiad-team\.jpg/);
    assert.match(html, /Tech Dreamers/);
    assert.match(html, /My Art, My Voice/);
    assert.doesNotMatch(html, /Interior \/ Spatial Brand Films/);
    assert.match(html, /class="contact-form" action="\/api\/contact" method="post" data-contact-form/);
    assert.match(html, /name="startedAt"/);
    assert.match(html, /name="website"/);
    assert.doesNotMatch(html, /mailto:/);
    assert.match(html, /<script type="application\/ld\+json">/);
    assert.match(html, /"@type":"Person"/);
    assert.match(html, /styles\.css\?v=[a-f0-9]{12}/);
    assert.match(html, /main\.js\?v=[a-f0-9]{12}/);
    assert.doesNotMatch(html, /old English CV|source materials/i);
  }
});

test("renderPage escapes image URLs in semantic image markup", () => {
  const site = loadSiteData(root);
  const works = [
    {
      slug: "css-url-safety",
      featured: true,
      order: 1,
      status: "coming-soon",
      year: "2026",
      title: { en: "CSS URL Safety", zh: "CSS URL Safety" },
      role: { en: "Director", zh: "導演" },
      platform: "Test",
      tagline: { en: "Safety", zh: "Safety" },
      description: { en: "Safety", zh: "Safety" },
      watchUrl: "https://example.com/watch",
      watchMode: "single",
      posterImage: "/assets/poster\" onerror=\"alert(1).jpg",
      posterAlt: { en: "Poster", zh: "海報" },
      focalPoint: "50% 50%",
      supportingImages: [],
      tags: [],
      metrics: [],
      caseStudy: [],
      press: [],
      accent: "cyan",
    },
  ];

  const html = renderPage({ lang: "en", site, works });

  assert.doesNotMatch(html, /src="\/assets\/poster" onerror=/);
  assert.match(html, /src="\/assets\/poster&quot; onerror=&quot;alert\(1\)\.jpg"/);
});

test("build generates English, Chinese, CSS, and JS assets", () => {
  execFileSync("node", ["scripts/build-site.mjs"], { cwd: root, stdio: "pipe" });

  assert.equal(existsSync(join(root, "dist/en/index.html")), true);
  assert.equal(existsSync(join(root, "dist/zh/index.html")), true);
  assert.equal(existsSync(join(root, "dist/styles.css")), true);
  assert.equal(existsSync(join(root, "dist/main.js")), true);
  assert.equal(existsSync(join(root, "dist/ambient-background.js")), true);
  assert.equal(existsSync(join(root, "dist/robots.txt")), true);
  assert.equal(existsSync(join(root, "dist/sitemap.xml")), true);
  assert.equal(existsSync(join(root, "dist/vendor/anime.esm.min.js")), true);
  assert.equal(existsSync(join(root, "dist/vendor/ogl/src/index.js")), true);
  assert.equal(existsSync(join(root, "dist/assets/showreel/website-visual-reel.mp4")), true);
  assert.equal(existsSync(join(root, "dist/assets/showreel/website-visual-reel-poster.png")), true);

  const zh = readFileSync(join(root, "dist/zh/index.html"), "utf8");
  const robots = readFileSync(join(root, "dist/robots.txt"), "utf8");
  const sitemap = readFileSync(join(root, "dist/sitemap.xml"), "utf8");
  const css = readFileSync(join(root, "dist/styles.css"), "utf8");
  const js = readFileSync(join(root, "dist/main.js"), "utf8");
  const gitignore = readFileSync(join(root, ".gitignore"), "utf8");
  assert.match(gitignore, /^dist\/$/m);
  assert.match(robots, /Sitemap: https:\/\/hsin-hsin-yuan-portfolio\.vercel\.app\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/hsin-hsin-yuan-portfolio\.vercel\.app\/en\/<\/loc>/);
  assert.match(sitemap, /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
  assert.match(zh, /紀錄片導演/);
  assert.match(zh, /觀看 showreel/);
  assert.doesNotMatch(zh, /Showreel 整理中/);
  assert.doesNotMatch(zh, /data-about-tabs/);
  assert.match(zh, /可合作項目/);
  assert.doesNotMatch(zh, /<h2 class="section-title">關於我<\/h2>/);
  assert.doesNotMatch(zh, /合作方式/);
  assert.doesNotMatch(zh, /我是來自台灣的紀錄片導演與創意製作人/);
  assert.doesNotMatch(zh, /情感質地/);
  assert.doesNotMatch(zh, /溫柔但準確地轉譯/);
  assert.doesNotMatch(zh, /住宅與室內設計影像、空間品牌影片/);
  assert.doesNotMatch(zh, /class="services-grid"/);
  assert.match(zh, /剪輯/);
  assert.match(zh, /挑戰/);
  assert.match(zh, /我如何處理/);
  assert.doesNotMatch(zh, /適合合作/);
  assert.doesNotMatch(zh, /代表成績/);
  assert.doesNotMatch(zh, /impact-grid/);
  assert.doesNotMatch(zh, /class="section lab-section"/);
  assert.match(zh, /精選舊作/);
  assert.match(zh, /觀看完整單集/);
  assert.match(zh, /觀看完整系列/);
  assert.doesNotMatch(zh, /觀看代表片段/);
  assert.doesNotMatch(zh, /3 yrs|三年間|約三年/);
  assert.match(zh, /公視台語台《無事坐巴士》/);
  assert.match(zh, /《巔峰拍檔》中國版：英國篇/);
  assert.doesNotMatch(zh, /中方導演/);
  assert.doesNotMatch(zh, /同時段綜藝類冠軍/);
  assert.doesNotMatch(zh, /觀看精選影片/);
  assert.match(zh, /代表影像作品/);
  assert.match(zh, /媒體報導與訪談/);
  assert.match(zh, /官方節目頁/);
  assert.match(zh, /文化奧運紀錄片《My Art, My Voice》　台法藝術家跨國對話/);
  assert.match(zh, /鏡週刊 Mirror Media/);
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
  assert.doesNotMatch(css, /\.impact-grid/);
  assert.doesNotMatch(css, /\.impact-item/);
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
  assert.match(css, /@keyframes heroStillPush/);
  assert.match(css, /\.hero-media \{\n    animation: heroStillPush/);
  assert.match(css, /\.hero-roles \.role-slash \{\n  color: var\(--acid\);/);
  assert.match(css, /\.edge-light/);
  assert.match(css, /--edge-proximity/);
  assert.match(css, /\.ambient-canvas \{/);
  assert.match(css, /\.has-ambient-background \.light-beam/);
  assert.doesNotMatch(css, /\.light-beam-left/);
  assert.match(css, /--page-pad: clamp/);
  assert.match(css, /\.watch-loop-card \{/);
  assert.match(css, /\.watch-loop-card-plain \{/);
  assert.match(css, /\.watch-loop-card-plain \{[\s\S]*?background: transparent;/);
  assert.match(css, /\.watch-loop-viewport::before/);
  assert.match(css, /@media \(max-width: 820px\) \{[\s\S]*\.nav-links > a:not\(\.language-switch\):not\(\[href="#contact"\]\)/);
  assert.doesNotMatch(css, /@media \(max-width: 820px\) \{[\s\S]*\.nav-links > a:not\(\.language-switch\) \{\n    display: none;/);
  assert.match(js, /getEdgeProximity/);
  assert.match(js, /pointermove/);
  assert.match(js, /initAmbientBackground/);
  assert.match(js, /scrollRestoration = "manual"/);
  assert.match(js, /clearInitialHash/);
  assert.match(js, /replaceState/);
  assert.match(js, /data-watch-loop/);
  assert.match(js, /syncLoopCopies/);
  assert.match(js, /offset %= sequenceWidth/);
  assert.match(js, /startLoop/);
  assert.match(js, /pointerdown/);
  assert.match(css, /@media \(max-width: 460px\) \{\n  \.hero h1 \{\n    font-size: clamp\(2\.65rem, 14vw, 3\.45rem\);/);
});
