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

test("active CSS is the new scene system rather than a legacy override", () => {
  const css = readFileSync(join(root, "src/styles.css"), "utf8");

  for (const token of ["--stage: #050807", "--fog: #dddcd7", "--paper: #f6f4ee", "--signal-coral: #f0645a", "--signal-cobalt: #4867d9", "--signal-moss: #4d9259"]) {
    assert.match(css.toLowerCase(), new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(css, /\.portrait-carrier/);
  assert.match(css, /\.work-theatre/);
  assert.match(css, /data-phase="opening"[^}]*\.portrait-foreground[\s\S]*?filter: brightness/);
  assert.doesNotMatch(css, /#d8ff3e|\.ambient-canvas|\.watch-loop|\.edge-light|\.work-panel|\.contact-card|Cinematic portfolio system: calm editorial structure/);
});

test("new scene runtime does not ship the retired animation stack", () => {
  const packageData = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

  assert.equal(packageData.dependencies?.animejs, undefined);
  assert.equal(packageData.dependencies?.ogl, undefined);
});

test("build generates English, Chinese, CSS, and JS assets", () => {
  execFileSync("node", ["scripts/build-site.mjs"], { cwd: root, stdio: "pipe" });

  assert.equal(existsSync(join(root, "dist/en/index.html")), true);
  assert.equal(existsSync(join(root, "dist/zh/index.html")), true);
  assert.equal(existsSync(join(root, "dist/styles.css")), true);
  assert.equal(existsSync(join(root, "dist/main.js")), true);
  assert.equal(existsSync(join(root, "dist/scene-state.js")), true);
  assert.equal(existsSync(join(root, "dist/ambient-background.js")), false);
  assert.equal(existsSync(join(root, "dist/robots.txt")), true);
  assert.equal(existsSync(join(root, "dist/sitemap.xml")), true);
  assert.equal(existsSync(join(root, "dist/vendor/anime.esm.min.js")), false);
  assert.equal(existsSync(join(root, "dist/vendor/ogl/src/index.js")), false);
  assert.equal(existsSync(join(root, "dist/assets/showreel/website-visual-reel.mp4")), true);
  assert.equal(existsSync(join(root, "dist/assets/showreel/website-visual-reel-poster.png")), true);
  assert.equal(existsSync(join(root, "dist/assets/portfolio/hsin-portrait-foreground.webp")), true);

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
  assert.match(zh, /class="portrait-carrier" data-portrait-carrier/);
  assert.match(zh, /class="portrait-foreground"/);
  assert.match(zh, /紀錄片導演、編劇，也是跨文化的故事夥伴/);
  assert.match(zh, /觀看 showreel/);
  assert.match(zh, /找到人真正改變的那一刻/);
  assert.match(zh, /讓脈絡被帶走，而不是被磨平/);
  assert.match(zh, /讓好的判斷可以被重複/);
  assert.equal((zh.match(/class="work-scene"/g) || []).length, 3);
  assert.match(zh, /可合作項目/);
  assert.match(zh, /精選舊作/);
  assert.match(zh, /合作類型/);
  assert.match(zh, /送出洽詢/);
  assert.doesNotMatch(zh, /mailto:/);
  assert.doesNotMatch(zh, /data-watch-loop|watch-loop-card|work-panel|light-beam-layer|services-grid/);
  assert.match(css, /--stage: #050807/);
  assert.match(css, /--fog: #dddcd7/);
  assert.match(css, /--paper: #f6f4ee/);
  assert.match(css, /--signal-coral: #f0645a/);
  assert.match(css, /--signal-cobalt: #4867d9/);
  assert.match(css, /--signal-moss: #4d9259/);
  assert.match(css, /\.has-scene-controller \.portrait-carrier/);
  assert.match(css, /\.has-scene-controller \.portrait-foreground/);
  assert.match(css, /\.has-scene-controller \.work-theatre/);
  assert.match(css, /position: sticky;/);
  assert.match(css, /@media \(max-width: 820px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /#d8ff3e|\.ambient-canvas|\.watch-loop|\.edge-light|\.work-panel/);
  assert.match(js, /from "\.\/scene-state\.js"/);
  assert.match(js, /data-portrait-carrier/);
  assert.match(js, /data-work-theatre/);
  assert.match(js, /requestAnimationFrame/);
  assert.match(js, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(js, /getEdgeProximity|pointermove|initAmbientBackground|data-watch-loop|syncLoopCopies/);
});
