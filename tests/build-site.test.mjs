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
  assert.equal(works[3].title.en, "Design & Brand Films");
  assert.equal(works[3].tagline.en, "Films about design—and the way a home is actually lived in.");
  assert.equal(
    works[3].description.en,
    "For Gorgeous Space and home brands, I directed and edited films on residential design, renovation, and product collaborations—bringing design ideas, everyday use, and the people who live there into the same story.",
  );
  assert.equal(works[3].title.zh, "幸福空間與品牌影像");
  assert.equal(
    works[3].description.zh,
    "為幸福空間與居家品牌執導、看空間設計如何影響我們生活的每一處。",
  );
  assert.equal(
    works[3].featuredReelUrl,
    "/assets/showreel/interior-spatial-card-reel.mp4",
  );
  assert.equal(works[3].featuredReelMode, "after-hold");
  assert.equal(works[3].featuredMediaAspect, "16:9");
  assert.equal(
    works[3].featuredReelPoster,
    "/assets/portfolio/gorgeous-space-sunny-wang-frontal.webp",
  );
  assert.equal(
    works[3].posterImage,
    "/assets/portfolio/gorgeous-space-sunny-wang-frontal.webp",
  );
  assert.equal(
    works[3].posterRightsStatus,
    "public-source-user-confirmed-work",
  );
  assert.deepEqual(works[3].posterDimensions, { width: 1280, height: 720 });
  assert.deepEqual(works[3].posterFocalPoint, { x: 0.73, y: 0.3 });
  assert.equal(
    works[3].posterSourceUrl,
    "https://www.youtube.com/watch?v=me4KutyUoT4&t=28s",
  );
  assert.equal(works[3].posterSourceTimecode, "00:00:28");
  assert.equal(works[3].posterFit, "contain");
  assert.equal(works[3].hideMediaLabel, true);
  assert.equal(works[3].watchMode, "selection");
  assert.equal(works[3].showWatchCta, true);
  assert.equal(Object.hasOwn(works[3], "statusLabel"), false);
  assert.deepEqual(works[3].watchLabel, {
    en: "Watch selected reel",
    zh: "觀看精選影片",
  });
  assert.deepEqual(works[3].metrics, [
    { value: "LG / Samsung", label: { en: "brand contexts", zh: "品牌合作案例" } },
  ]);
  assert.equal(
    works[3].watchUrl,
    "https://www.youtube.com/playlist?list=PLJCU8axtQoPI",
  );
  assert.equal(works[4].platform, "PTS Taigi");
  assert.equal(works[4].year, "2021");
  assert.equal(works[4].title.en, "Nothing by Bus");
  assert.equal(works[4].tagline.en, "One bus route at a time, into the everyday life of Taiwan.");
  assert.equal(
    works[4].description.en,
    "I developed and wrote individual episodes for this PTS Taigi travel series, using local bus routes to connect memory, food, markets, and the people along the way.",
  );
  assert.equal(
    works[4].description.zh,
    "以公車路線串起的地方記憶、飲食、市集，以及一路上遇見的人。",
  );
  assert.equal(works[4].watchMode, "series");
  assert.equal(works[4].showWatchCta, true);
  assert.equal(
    works[4].watchUrl,
    "https://www.youtube.com/playlist?list=PLfuPqJAlXvCs",
  );
  assert.equal(
    works[4].featuredReelUrl,
    "/assets/showreel/nothing-by-bus-card-reel.mp4",
  );
  assert.equal(works[4].featuredReelMode, "after-hold");
  assert.equal(works[4].featuredMediaAspect, "16:9");
  assert.equal(
    works[4].featuredReelPoster,
    works[4].posterImage,
  );
  assert.deepEqual(works[4].tags, ["travel factual", "Taiwanese", "local culture"]);
  assert.deepEqual(works[4].metrics, []);
  assert.equal(works[5].role.en, "Director");
  assert.deepEqual(works[5].platform, {
    en: "China Dragon TV",
    zh: "東方衛視",
  });
  assert.equal(works[5].hideMediaLabel, true);
  assert.equal(works[5].mediaTitleLines, undefined);
  assert.equal(works[5].tagline.en, "A cross-border factual-entertainment production filmed in the UK with the original Top Gear team.");
  assert.equal(
    works[5].description.en,
    "Directed the UK episode of Top Gear China Season 2, leading the shoot in Britain and coordinating editorial and production requirements across Dragon TV, the Chinese production team, and the original Top Gear team.",
  );
  assert.equal(
    works[5].description.zh,
    "《巔峰拍檔》中國版第二季第五期「英國篇」導演，負責英國段落的內容與拍攝，並協調東方衛視、中國製作團隊與英國原版 Top Gear 團隊的製作需求。",
  );
  assert.equal(works[5].tagline.zh, "");
  assert.equal(works[5].featuredReelMode, "after-hold");
  assert.equal(
    works[5].featuredReelUrl,
    "/assets/showreel/top-gear-china-uk-special-card-reel.mp4",
  );
  assert.equal(works[5].featuredReelPoster, works[5].posterImage);
  assert.equal(
    works[5].watchUrl,
    "https://youtu.be/M_eXe9HRD9Y?si=YZ_3JZ7FJY4vVcZv",
  );
  assert.deepEqual(works[5].metricsContext, {
    en: "Season 2 audience, reported across television and online",
    zh: "第二季播出數據（電視與線上）",
  });
  assert.deepEqual(
    works[5].metrics.map((metric) => [metric.value, metric.label.en]),
    [
      ["200M", "first five episodes / TV + online"],
      ["9M", "average weekly live audience"],
      ["0.81", "reported TV rating"],
      ["#1", "national time slot / four weeks"],
    ],
  );
  assert.deepEqual(
    works[5].metrics.map((metric) => metric.label.zh),
    [
      "前五集（電視＋線上）",
      "每週平均電視觀眾",
      "電視收視率（依履歷資料）",
      "連續四週全國同時段第一",
    ],
  );
  assert.equal(works[0].posterImage, "/assets/portfolio/slow-steps-poster.webp");
  assert.equal(works[0].posterVariant, "no-title");
  assert.equal(works[0].posterRightsStatus, "user-approved-local");
  assert.equal(
    works[0].posterSourceSha256,
    "3a6f37deee03aab1836fecaee547685f8b79a23106e5b540cac94094a193c78a",
  );
  assert.equal(works[0].platform, "TaiwanPlus / Travel");
  assert.deepEqual(works[0].tags, ["documentary", "travel"]);
  assert.equal(
    works[1].watchUrl,
    "https://www.taiwanplus.com/shows/documentary/business-and-tech/590/tech-dreamers",
  );
  assert.equal(
    works[1].posterImage,
    "https://prod-img.taiwanplus.com/program/224be7ed-057b-400f-af63-a8582cd80cfb.webp",
  );
  assert.equal(works[1].watchLoopTarget, "watch");
  assert.equal(Object.hasOwn(works[1], "mediaWatchUrl"), false);
  const techOfficialEntry = works[1].press[0];
  assert.deepEqual(techOfficialEntry.type, { en: "Official page", zh: "官方頁面" });
  assert.deepEqual(techOfficialEntry.title, { en: "Official program page", zh: "" });
  assert.equal(techOfficialEntry.source, "TaiwanPlus");
  assert.equal(techOfficialEntry.url, works[1].watchUrl);
  assert.equal(techOfficialEntry.canonicalUrl, works[1].watchUrl);
  assert.equal(techOfficialEntry.image, works[1].posterImage);
  assert.equal(techOfficialEntry.titleSource, "official platform page");
  assert.equal(techOfficialEntry.imageSource, "official platform series artwork");
  assert.equal(techOfficialEntry.metadataCheckedAt, "2026-08-03");
  assert.ok(works.every((work) => !Object.hasOwn(work, "caseStudy")));
  assert.deepEqual(works[5].tags, ["factual entertainment"]);
  assert.equal(works[0].metrics.length, 0);
  assert.equal(works[2].metrics.length, 0);
  assert.deepEqual(
    works.filter((work) => work.showWatchCta).map((work) => work.slug),
    ["interior-spatial-brand-films", "pts-taigi-bus"],
  );
});

test("Featured copy preserves approved English while producer-blank Chinese taglines stay empty", () => {
  const worksBySlug = new Map(
    loadWorks(join(root, "content/works")).map((work) => [work.slug, work]),
  );
  const approved = [
    ["slow-steps", "role", "Director / Editor / Producer", "導演／剪輯／製作人"],
    ["slow-steps", "tagline", "A quiet travel documentary with a personal point of view.", ""],
    ["slow-steps", "description", "Through encounters and pauses along the way, the film observes how people make sense of the world before them—and how the journey changes the observer.", "將Walking tour影像化，以在地人的主觀視角記錄每個街區獨特的個人編年史。"],
    ["tech-dreamers", "role", "Director / Editor / Producer", "導演／剪輯／製作人"],
    ["tech-dreamers", "tagline", "Following Taiwanese founders as an idea takes shape, one decision at a time.", ""],
    ["tech-dreamers", "description", "From AI to deep tech, the series goes inside Silicon Valley startups to follow founders as they define problems, test ideas, and bring technology to market.", "從 AI 到深科技，鏡頭走進矽谷新創現場，訪談創始人的創業歷程。"],
    ["my-art-my-voice", "role", "Lead Documentary Director", "紀錄片總導演"],
    ["my-art-my-voice", "tagline", "Taiwanese artists take the stage in Paris—and speak about their work and who they are.", ""],
    ["my-art-my-voice", "description", "Filmed at the Taiwan Pavilion during the Paris Cultural Olympiad, the documentary moves between performance and backstage conversations about art, freedom, and identity.", "巴黎文化奧運台灣館的演出與幕後，聽巴黎與台灣藝術家暢談創作、自由與身分。"],
    ["interior-spatial-brand-films", "title", "Design & Brand Films", "幸福空間與品牌影像"],
    ["interior-spatial-brand-films", "role", "Director / Editor", "導演／剪輯"],
    ["interior-spatial-brand-films", "tagline", "Films about design—and the way a home is actually lived in.", ""],
    ["interior-spatial-brand-films", "description", "For Gorgeous Space and home brands, I directed and edited films on residential design, renovation, and product collaborations—bringing design ideas, everyday use, and the people who live there into the same story.", "為幸福空間與居家品牌執導、看空間設計如何影響我們生活的每一處。"],
    ["pts-taigi-bus", "role", "Episode Development / Writer", "單集企劃／企編"],
    ["pts-taigi-bus", "tagline", "One bus route at a time, into the everyday life of Taiwan.", ""],
    ["pts-taigi-bus", "description", "I developed and wrote individual episodes for this PTS Taigi travel series, using local bus routes to connect memory, food, markets, and the people along the way.", "以公車路線串起的地方記憶、飲食、市集，以及一路上遇見的人。"],
    ["top-gear-china-uk-special", "tagline", "A cross-border factual-entertainment production filmed in the UK with the original Top Gear team.", ""],
    ["top-gear-china-uk-special", "description", "Directed the UK episode of Top Gear China Season 2, leading the shoot in Britain and coordinating editorial and production requirements across Dragon TV, the Chinese production team, and the original Top Gear team.", "《巔峰拍檔》中國版第二季第五期「英國篇」導演，負責英國段落的內容與拍攝，並協調東方衛視、中國製作團隊與英國原版 Top Gear 團隊的製作需求。"],
  ];

  assert.equal(approved.length, 18);
  for (const [slug, field, en, zh] of approved) {
    assert.deepEqual(worksBySlug.get(slug)[field], { en, zh }, `${slug}.${field}`);
  }
});

test("intentional Chinese blanks keep source positions but emit no empty DOM or visual spacer", () => {
  const loaded = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const en = renderPage({ lang: "en", site: loaded, works });
  const zh = renderPage({ lang: "zh", site: loaded, works });
  const blankTaglineSlugs = [
    "slow-steps",
    "tech-dreamers",
    "my-art-my-voice",
    "interior-spatial-brand-films",
    "pts-taigi-bus",
    "top-gear-china-uk-special",
  ];

  assert.equal(loaded.site.en.availability.length, 6);
  assert.equal(loaded.site.zh.availability.length, 6);
  assert.equal(loaded.site.en.availability[5], "AI-assisted editorial workflows");
  assert.equal(loaded.site.zh.availability[5], "");
  assert.equal(works.length, 6);
  for (const slug of blankTaglineSlugs) {
    const work = works.find((item) => item.slug === slug);
    assert.equal(Object.hasOwn(work, "tagline"), true, slug);
    assert.equal(typeof work.tagline.zh, "string", slug);
    assert.equal(work.tagline.zh, "", slug);
    assert.ok(work.tagline.en.length > 0, slug);

    const article = zh.match(
      new RegExp(`<article class="[^"]*" id="${slug}">[\\s\\S]*?<\\/article>`),
    )?.[0];
    assert.ok(article, `${slug} Chinese work detail should render`);
    assert.doesNotMatch(article, /class="work-tagline"/, slug);
    assert.match(article, /<h3>[^<]+<\/h3>\s*<p class="work-description">/, slug);
  }

  const enAvailability = en.match(/<div class="available-pill-list">([\s\S]*?)<\/div>/)?.[1];
  const zhAvailability = zh.match(/<div class="available-pill-list">([\s\S]*?)<\/div>/)?.[1];
  assert.equal((enAvailability?.match(/<span>/g) || []).length, 6);
  assert.equal((zhAvailability?.match(/<span>/g) || []).length, 5);
  assert.equal((en.match(/class="work-tagline"/g) || []).length, 6);
  assert.equal((zh.match(/class="work-tagline"/g) || []).length, 0);
  assert.equal((en.match(/class="watch-loop-tagline"/g) || []).length, 6);
  assert.equal((zh.match(/class="watch-loop-tagline"/g) || []).length, 0);
  assert.doesNotMatch(zh, /<p class="work-tagline">\s*<\/p>/);
  assert.doesNotMatch(zh, /<span class="watch-loop-tagline">\s*<\/span>/);
  assert.doesNotMatch(zhAvailability || "", /<span>\s*<\/span>/);
});

test("locale-specific Hero and Work Press blanks omit complete elements without changing English", () => {
  const loaded = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  loaded.site.zh.heroTitle = "袁欣欣";
  loaded.site.zh.heroTitleLines = ["袁欣欣", ""];
  works.find((work) => work.slug === "tech-dreamers").press[0].title.zh = "";
  works.find((work) => work.slug === "my-art-my-voice").press[0].title.zh = "";

  const en = renderPage({ lang: "en", site: loaded, works });
  const zh = renderPage({ lang: "zh", site: loaded, works });

  assert.match(en, /<h1 aria-label="Hsin-Hsin Yuan"><span>HSIN-HSIN<\/span><span>YUAN<\/span><\/h1>/);
  assert.match(zh, /<h1 aria-label="袁欣欣"><span>袁欣欣<\/span><\/h1>/);
  assert.equal((en.match(/<strong>Official program page<\/strong>/g) || []).length, 2);
  assert.equal((zh.match(/<strong>\s*<\/strong>/g) || []).length, 0);
  assert.equal((zh.match(/<span class="press-preview-type">官方頁面<\/span>/g) || []).length, 2);
});

test("loadSiteData returns one normalized collaboration collection", () => {
  const { collaborations } = loadSiteData(root);

  assert.deepEqual(
    collaborations.map((item) => item.id),
    [
      "taiwanplus",
      "pts",
      "dragon-tv",
      "women-make-waves",
      "ticff",
      "screenhouse",
      "gorgeous-space",
    ],
  );
  assert.equal(collaborations.every((item) => item.contract.kind === "collaboration-mark"), true);
});

test("primary navigation accessibility label comes from localized canonical copy", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  site.site.zh.navPrimaryAria = "測試用主要導覽";

  const zh = renderPage({ lang: "zh", site, works });

  assert.match(zh, /<nav class="nav-links" aria-label="測試用主要導覽">/);
  assert.doesNotMatch(zh, /<nav class="nav-links" aria-label="Primary">/);
});

test("site copy uses the approved bilingual Taiwan positioning", () => {
  const copy = loadSiteData(root).site;
  const positioning = (locale) => ({
    metaTitle: copy[locale].metaTitle,
    metaDescription: copy[locale].metaDescription,
    heroEyebrow: copy[locale].heroEyebrow,
    heroRoleLines: copy[locale].heroRoleLines,
    heroSubcopy: copy[locale].heroSubcopy,
    availabilityLabel: copy[locale].availabilityLabel,
    availabilityIntro: copy[locale].availabilityIntro,
    availability: copy[locale].availability,
    contactSubcopy: copy[locale].contactSubcopy,
  });

  assert.deepEqual(positioning("en"), {
    metaTitle: "Hsin-Hsin Yuan | Documentary Director & Bilingual Producer, Taiwan",
    metaDescription: "Hsin-Hsin Yuan is a Taiwan-based documentary director and bilingual producer working across arts, culture, technology, and international factual production.",
    heroEyebrow: "Based in Taiwan, working internationally",
    heroRoleLines: ["Documentary Director / Bilingual Producer", "Arts / Culture / Technology"],
    heroSubcopy: "I work across arts, culture, and technology, from research and story development through directing and editing. I also provide bilingual field production in Taiwan for international teams.",
    availabilityLabel: "Ways to Work Together",
    availabilityIntro: "I can join at the research and story-development stage, direct the shoot, or shape the edit. For international teams filming in Taiwan, I provide bilingual field production with editorial input.",
    availability: ["Story development", "Directing", "Editing", "Research & interviews", "Bilingual production", "AI-assisted editorial workflows"],
    contactSubcopy: "If you are developing a documentary or factual series, or need a bilingual production partner in Taiwan, share the project stage, timeline, budget range, and the role you have in mind.",
  });
  assert.deepEqual(positioning("zh"), {
    metaTitle: "袁欣欣｜台灣紀錄片導演與雙語製作人",
    metaDescription: "袁欣欣是台灣紀錄片導演與雙語製作人，專長藝術、文化、科技題材，以及需要台灣在地協作的跨國紀實製作。",
    heroEyebrow: "立足台灣，參與跨國製作",
    heroRoleLines: ["紀錄片導演 / 雙語製作人", "藝術 / 文化 / 科技"],
    heroSubcopy: "我從小就是個愛聽故事的人，所以長大後決定將不同的題材轉換成迷人的紀實故事",
    availabilityLabel: "合作方式",
    availabilityIntro: "可以從前期研究與敘事開發加入，也可以負責導演與剪輯。跨國團隊若在台灣拍攝，我能處理雙語溝通、敘事判斷與現場製作。",
    availability: ["敘事開發", "導演", "剪輯", "研究與採訪", "雙語製作", ""],
    contactSubcopy: "如果你正在籌備紀錄片、紀實節目，或需要台灣在地的雙語製作夥伴，歡迎來信。請簡單說明內容、目前階段、時程、預算範圍，以及希望我參與的方式。",
  });
});

test("CollaborationMark renders six verified logos and one intentional fallback", () => {
  const loaded = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const english = renderPage({ lang: "en", site: loaded, works });
  const chinese = renderPage({ lang: "zh", site: loaded, works });
  const ids = loaded.collaborations.map((item) => item.id);

  for (const html of [english, chinese]) {
    let previous = -1;
    for (const id of ids) {
      const index = html.indexOf(`data-collaboration-id="${id}"`);
      assert.ok(index > previous, `${id} should render once in canonical order`);
      previous = index;
    }
    assert.equal((html.match(/class="partner-logo"/g) || []).length, 6);
    assert.equal((html.match(/class="partner-wordmark"/g) || []).length, 1);
    assert.match(html, /src="\/assets\/logos\/taiwanplus-mono\.svg"/);
    assert.match(html, /src="\/assets\/logos\/pts-mono\.svg"/);
    assert.match(html, /src="\/assets\/logos\/dragon-tv-mono\.svg"/);
    assert.match(html, /src="\/assets\/logos\/ticff-mono\.svg"/);
    assert.match(html, /src="\/assets\/logos\/screenhouse-mono\.svg"/);
    assert.match(html, /src="\/assets\/logos\/gorgeous-space-mono\.svg"/);
    assert.match(html, /data-logo-size="wide"/);
    assert.match(html, /--partner-logo-height: 28px; --partner-logo-max-width: 164px/);
    assert.match(html, /<img class="partner-logo"[^>]*alt=""[^>]*aria-hidden="true"/);
    assert.doesNotMatch(html, /partner-name/);
    assert.doesNotMatch(html, /sourceSha256|sourceCheckedAt|official-mark-nominative-use/);
    assert.doesNotMatch(html, /494bc7efb79c834934c4cbafd551754e88c01e7ab473184894369cd6bf02c546/);
  }
  assert.match(english, /data-collaboration-id="gorgeous-space"[^>]*aria-label="Gorgeous Space"/);
  assert.match(chinese, /data-collaboration-id="gorgeous-space"[^>]*aria-label="幸福空間"/);
  assert.match(english, /<a class="collab-item" data-collaboration-id="screenhouse"[^>]*href="https:\/\/www\.screenhouse\.co\.uk\/"[^>]*aria-label="ScreenHouse"/);
});

test("CollaborationMark layout uses reusable four-slot and two-slot rules", () => {
  const css = readFileSync(join(root, "src/styles.css"), "utf8");

  assert.match(css, /\.collab-item \{[\s\S]*?flex: 0 1 calc\(25% - var\(--collab-slot-gap\)\);/);
  assert.match(css, /\.partner-logo \{[\s\S]*?height: var\(--partner-logo-height\);[\s\S]*?max-width: min\(100%, var\(--partner-logo-max-width\)\);/);
  assert.match(css, /@media \(max-width: 820px\) \{[\s\S]*?\.collab-item \{[\s\S]*?flex-basis: calc\(50% - var\(--collab-slot-gap\)\);/);
  assert.doesNotMatch(css, /taiwanplus|dragon-tv|women-make-waves|gorgeous-space/i);
});

test("English output uses Gorgeous Space while Chinese output preserves 幸福空間", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const en = renderPage({ lang: "en", site, works });
  const zh = renderPage({ lang: "zh", site, works });

  assert.doesNotMatch(en, /幸福空間/);
  assert.match(en, /Gorgeous Space/);
  assert.match(zh, /幸福空間/);
});

test("contact heading uses two explicit English lines with only together accented", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const en = renderPage({ lang: "en", site, works });
  const zh = renderPage({ lang: "zh", site, works });

  assert.match(
    en,
    /<h2 class="contact-title"><span class="contact-title-line">Let’s build<\/span><span class="contact-title-line"><span class="contact-title-bridge">a story <\/span><span class="contact-title-accent">together\.<\/span><\/span><\/h2>/,
  );
  assert.doesNotMatch(en, /contact-title-lead">Let’s build a story/);
  assert.match(
    zh,
    /<h2 class="contact-title"><span class="contact-title-line">一起把故事<\/span><span class="contact-title-line"><span class="contact-title-accent">說出來。<\/span><\/span><\/h2>/,
  );
});

test("screening strip stays static while approved reels render in featured panels", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const html = renderPage({ lang: "en", site, works });

  assert.doesNotMatch(html, /data-watch-loop-video/);
  assert.doesNotMatch(html, /class="watch-loop-video/);
  assert.doesNotMatch(html, /data-card-reel-mode/);
  assert.match(
    html,
    /<article class="work-panel work-panel-wide-media" id="interior-spatial-brand-films">[\s\S]*?class="media-frame media-frame-wide media-frame-unlabeled media-frame-link"[\s\S]*?data-featured-reel-video[\s\S]*?src="\/assets\/showreel\/interior-spatial-card-reel\.mp4"/,
  );
  assert.match(
    html,
    /<article class="work-panel work-panel-wide-media" id="pts-taigi-bus">[\s\S]*?class="media-frame media-frame-wide media-frame-unlabeled media-frame-link"[\s\S]*?data-featured-reel-video[\s\S]*?src="\/assets\/showreel\/nothing-by-bus-card-reel\.mp4"/,
  );
});

test("all approved Featured reels hold their existing poster before muted playback", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const html = renderPage({ lang: "en", site, works });
  const videoTags = html.match(/<video\b(?=[^>]*data-featured-reel-video)[^>]*>/g) || [];

  assert.equal(videoTags.length, 6);
  for (const videoTag of videoTags) {
    assert.match(videoTag, /data-featured-reel-mode="after-hold"/);
    assert.match(videoTag, /\smuted(?:\s|>)/);
    assert.match(videoTag, /\sloop(?:\s|>)/);
    assert.match(videoTag, /\splaysinline(?:\s|>)/);
    assert.match(videoTag, /\swebkit-playsinline(?:\s|>)/);
    assert.match(videoTag, /preload="none"/);
    assert.match(videoTag, /poster="[^"]+"/);
    assert.doesNotMatch(videoTag, /\scontrols(?:\s|>)/);
  }

  assert.match(
    html,
    /<article class="work-panel" id="tech-dreamers">[\s\S]*?<a class="media-frame media-frame-unlabeled media-frame-link" href="https:\/\/www\.taiwanplus\.com\/shows\/documentary\/business-and-tech\/590\/tech-dreamers" target="_blank" rel="noreferrer" aria-label="Play video: Tech Dreamers"[\s\S]*?data-featured-reel-video/,
  );
  assert.match(
    html,
    /<article class="work-panel" id="my-art-my-voice">[\s\S]*?<a class="media-frame media-frame-unlabeled media-frame-link" href="https:\/\/www\.taiwanplus\.com\/shows\/documentary\/arts\/410\/my-art-my-voice\/250220001\/whats-the-vibe-in-taiwan-my-art-my-voice" target="_blank" rel="noreferrer" aria-label="Play video: My Art, My Voice"[\s\S]*?data-featured-reel-video/,
  );

  const slowStepsPanel = html.match(
    /<article class="work-panel" id="slow-steps">([\s\S]*?)<\/article>/,
  )?.[1] || "";
  assert.match(slowStepsPanel, /<div class="media-frame media-frame-unlabeled"/);
  assert.match(slowStepsPanel, /data-featured-reel-video/);
  assert.doesNotMatch(slowStepsPanel, /<a class="media-frame/);
  assert.doesNotMatch(slowStepsPanel, /aria-label="Play video:/);
  assert.doesNotMatch(slowStepsPanel, /class="work-media-play"/);
});

test("wide media semantics apply to embedded work frames", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const embeddedWideWork = {
    ...works[3],
    status: "available",
    videoEmbedUrl: "https://example.com/embed/featured-reel",
  };
  const html = renderPage({ lang: "en", site, works: [embeddedWideWork] });

  assert.match(
    html,
    /<article class="work-panel work-panel-wide-media" id="interior-spatial-brand-films">[\s\S]*?<div class="media-frame media-frame-wide(?: [^"]+)?">[\s\S]*?<iframe src="https:\/\/example\.com\/embed\/featured-reel"/,
  );
});

test("all featured media keeps 16:9 prominence at the mobile breakpoint", () => {
  const css = readFileSync(join(root, "src/styles.css"), "utf8");

  assert.match(
    css,
    /@media \(max-width: 820px\) \{[\s\S]*?\.media-frame \{[^}]*aspect-ratio: 16 \/ 9;[^}]*min-height: 0;[^}]*\}/,
  );
  assert.doesNotMatch(
    css,
    /@media \(max-width: 820px\) \{[\s\S]*?\.media-frame-unlabeled \{[^}]*aspect-ratio: 16 \/ 9;/,
  );
});

test("featured media keeps source artwork without a second HTML title layer", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const html = renderPage({ lang: "en", site, works });
  const expected = new Map([
    ["tech-dreamers", "Play video: Tech Dreamers"],
    ["my-art-my-voice", "Play video: My Art, My Voice"],
    ["pts-taigi-bus", "Play video: Nothing by Bus"],
    ["top-gear-china-uk-special", "Play video: Top Gear China: UK Special"],
  ]);

  for (const [slug, ariaLabel] of expected) {
    const work = works.find((item) => item.slug === slug);
    const panel = html.match(
      new RegExp(
        `<article class="[^"]*work-panel[^"]*" id="${slug}">[\\s\\S]*?<\\/article>`,
      ),
    )?.[0];

    assert.equal(work.hideMediaLabel, true, slug);
    assert.ok(panel, slug);
    assert.match(
      panel,
      /class="media-frame[^"]*media-frame-unlabeled[^"]*media-frame-link"/,
    );
    assert.match(panel, new RegExp(`aria-label="${ariaLabel}"`));
    assert.doesNotMatch(panel, /class="media-label(?: |")/);
  }

  const topGear = works.find(
    (item) => item.slug === "top-gear-china-uk-special",
  );
  assert.equal("mediaTitleLines" in topGear, false);
});

test("retired website visual reel remains recoverable authoring evidence only", () => {
  const reelSource = readFileSync(
    join(root, "showreel/website-visual-reel/index.html"),
    "utf8",
  );
  const retirement = readFileSync(
    join(root, "showreel/website-visual-reel/RETIRED.md"),
    "utf8",
  );

  assert.match(
    reelSource,
    /Let’s build a<\/span>\s*<span[^>]*>story<\/span>\s*<span[^>]*>together\.<\/span>/,
  );
  assert.match(reelSource, /Open Contact/);
  assert.doesNotMatch(reelSource, /Let’s build a story with signal\./);
  assert.doesNotMatch(reelSource, /Artists and cultural institutions/);
  assert.doesNotMatch(reelSource, /AI-language editorial workflows/);
  assert.match(retirement, /retired/i);
  assert.match(retirement, /not an active build source/i);
  assert.equal(existsSync(join(root, "public/assets/showreel/website-visual-reel.mp4")), false);
  assert.equal(existsSync(join(root, "public/assets/showreel/website-visual-reel-poster.png")), false);
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

test("global press notes keep audited sources in newest-first order", () => {
  const site = loadSiteData(root);
  const myArt = loadWorks(join(root, "content/works")).find(
    (work) => work.slug === "my-art-my-voice",
  );

  assert.deepEqual(
    site.press.map((item) => [item.id, item.year, item.part.en]),
    [
      ["very-mulan-director-interview", "2025", "INTERVIEW"],
      ["wmw-28-selection-guide-part-1", "2021", "PART 1"],
    ],
  );
  assert.equal(
    myArt.press.some((item) => item.canonicalUrl.includes("verymulan.com")),
    false,
  );
  assert.equal(site.press[0].rightsStatus, "public-link-only");
  assert.equal(site.press[1].rightsStatus, "public-link-only");
  assert.equal(site.press[1].participationStatus, "verified-speaker");
  assert.equal(
    site.press[1].canonicalUrl,
    "https://www.facebook.com/watch/?v=257310076279164",
  );
  assert.equal(site.press[1].sourcePageUrl, "https://www.wmw.org.tw/tw/title/733");
  for (const item of site.press) {
    assert.match(item.canonicalUrl, /^https:\/\//);
    assert.match(item.sourcePageUrl, /^https:\/\//);
    assert.match(item.metadataCheckedAt, /^2026-/);
    assert.equal("image" in item, false);
    assert.equal("type" in item, false);
    assert.equal("context" in item, false);
  }
});

test("global press notes render as a low-priority text-only section after Archive", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const en = renderPage({ lang: "en", site, works });
  const zh = renderPage({ lang: "zh", site, works });
  const archivePosition = en.indexOf('class="section archive-section"');
  const pressPosition = en.indexOf('class="section press-notes-section"');
  const contactPosition = en.indexOf('class="section contact"');
  const pressSection = en.match(
    /<section class="section press-notes-section">[\s\S]*?<\/section>/,
  )?.[0];

  assert.ok(archivePosition >= 0 && pressPosition > archivePosition);
  assert.ok(contactPosition > pressPosition);
  assert.ok(pressSection);
  assert.equal((pressSection.match(/class="press-note-card"/g) || []).length, 2);
  assert.doesNotMatch(pressSection, /<img/);
  assert.match(pressSection, />PRESS</);
  assert.ok(
    pressSection.indexOf("Director interview: walking into the sea of creation") <
      pressSection.indexOf("28th Women Make Waves Film Festival Selection Guide"),
  );
  assert.match(pressSection, /<span class="press-note-part">INTERVIEW<\/span>/);
  assert.match(pressSection, /<span class="press-note-kicker">2025<\/span>/);
  assert.match(pressSection, /<span class="press-note-meta">Very Mulan<\/span>/);
  assert.match(pressSection, /28th Women Make Waves Film Festival Selection Guide/);
  assert.match(pressSection, /<span class="press-note-part">PART 1<\/span>/);
  assert.match(pressSection, /<span class="press-note-kicker">2021<\/span>/);
  assert.match(
    pressSection,
    /<span class="press-note-meta">Women Make Waves Film Festival<\/span>/,
  );
  assert.doesNotMatch(pressSection, /Festival conversation|Featuring Hsin-Hsin Yuan/);
  assert.doesNotMatch(pressSection, /Companion event archive|Selected interviews and festival conversations/);
  assert.doesNotMatch(pressSection, /412888580196820|press-note-arrow|↗/);
  assert.match(
    pressSection,
    /href="https:\/\/www\.verymulan\.com\/story\/[^\"]+"[^>]*data-metadata-checked-at="2026-07-12"/,
  );
  assert.match(
    pressSection,
    /href="https:\/\/www\.facebook\.com\/watch\/\?v=257310076279164"[^>]*data-metadata-checked-at="2026-08-03"/,
  );
  assert.match(zh, />媒體報導</);
  assert.match(zh, /訪談/);
  assert.match(zh, /非常木蘭/);
  assert.match(zh, /第 28 屆女性影展選片指南/);
  assert.doesNotMatch(zh, /影展對談|袁欣欣參與對談/);
  assert.doesNotMatch(zh, /同場活動紀錄|陸續收錄訪談與影展對談/);
});

test("global press notes use the existing 40/60 rhythm with mobile and focus fallbacks", () => {
  const css = readFileSync(join(root, "src/styles.css"), "utf8");

  assert.match(
    css,
    /\.press-notes-layout \{[^}]*display: grid;[^}]*grid-template-columns: minmax\(0, 2fr\) minmax\(0, 3fr\);[^}]*\}/,
  );
  assert.match(css, /\.press-note-list \{[^}]*border-top: 1px solid var\(--line\);/);
  assert.match(css, /\.press-note-card:focus-visible \{[^}]*outline: 2px solid var\(--acid\);/);
  assert.match(
    css,
    /@media \(max-width: 820px\) \{[\s\S]*?\.press-notes-layout \{[^}]*grid-template-columns: 1fr;[^}]*\}/,
  );
  assert.doesNotMatch(css, /\.press-note-arrow/);
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
    "pressNotesSubcopy",
    "workWithMeTitle",
    "workWithMeSubcopy",
    "workModes",
    "showreelEyebrow",
    "showreelSubcopy",
    "showreelTitle",
    "showreelCta",
    "watchShelfKicker",
    "watchShelfTitle",
    "watchShelfHint",
    "watchShelfAction",
    "watchLabel",
    "impactLabel",
    "labTitle",
    "labSubcopy",
    "createTitle",
    "createSubcopy",
    "services",
  ];

  for (const lang of ["en", "zh"]) {
    assert.equal(typeof site[lang].availabilityIntro, "string");
    assert.ok(site[lang].availabilityIntro.length > 20);
    for (const field of retiredFields) {
      assert.equal(field in site[lang], false, `${field} should not remain in ${lang} site copy`);
    }
  }
});

test("public tracked artifacts do not expose the direct contact address", () => {
  const directAddress = ["hsin54", "yahoo.com"].join("@");
  let matches = "";

  try {
    matches = execFileSync(
      "git",
      ["grep", "-n", "-I", "-F", directAddress],
      { cwd: root, encoding: "utf8" },
    ).trim();
  } catch (error) {
    if (error.status !== 1) {
      throw error;
    }
  }

  assert.equal(matches, "");
});

test("public tracked artifacts do not expose private absolute paths", () => {
  const privatePathPattern = [
    [["/Us", "ers/"].join(""), "[^/[:space:]]+/"].join(""),
    ["/tmp/codex-", "remote-attachments"].join(""),
  ].join("|");
  let matches = "";

  try {
    matches = execFileSync(
      "git",
      ["grep", "-n", "-I", "-E", privatePathPattern],
      { cwd: root, encoding: "utf8" },
    ).trim();
  } catch (error) {
    if (error.status !== 1) {
      throw error;
    }
  }

  assert.equal(matches, "");
});

test("loadSiteData keeps retired lab content out of the public site model", () => {
  const siteData = loadSiteData(root);
  const archive = loadMarkdownCollection(join(root, "content/archive"));

  assert.equal("lab" in siteData, false);
  assert.equal(archive[0].slug, "ghost-hand-divine-car");
  assert.equal(archive[0].title.zh, "鬼手神車");
  assert.match(archive[0].summary.zh, /公開版本/);
  assert.equal(archive[1].slug, "three-minute-micro-drama");
  assert.equal(archive[1].metrics[0].value, "200M");
  assert.equal(archive[1].metrics[1].value, "250M");
  assert.match(archive[1].summary.en, /Short-form web drama work/);
  assert.equal(
    archive[1].watchUrl,
    "https://www.youtube.com/playlist?list=PLDTnN3czXyG8",
  );
  assert.deepEqual(archive[1].watchLabel, {
    en: "Watch the full series",
    zh: "觀看完整系列",
  });

  const heartOfSteel = archive.find((item) => item.slug === "heart-of-steel");
  const lyingGame = archive.find((item) => item.slug === "lying-game");
  assert.equal(heartOfSteel.watchUrl, "https://www.youtube.com/watch?v=6g9YLv30DyU");
  assert.equal(lyingGame.watchUrl, "https://www.youtube.com/watch?v=DVzQf5COsyk");
  assert.equal(
    heartOfSteel.posterImage,
    "https://upload.wikimedia.org/wikipedia/zh/4/46/%E9%8B%BC%E9%90%B5%E4%B9%8B%E5%BF%83.jpg",
  );
  assert.equal(
    lyingGame.posterImage,
    "https://upload.wikimedia.org/wikipedia/zh/7/7c/%E8%AC%8A%E8%A8%80%E9%81%8A%E6%88%B2.jpg",
  );
  assert.equal(heartOfSteel.posterFit, "contain");
  assert.equal(lyingGame.posterFit, "contain");
  assert.equal(heartOfSteel.posterRightsStatus, "public-link-only");
  assert.equal(lyingGame.posterRightsStatus, "public-link-only");
  assert.equal(
    heartOfSteel.creditUrl,
    "https://zh.wikipedia.org/zh-tw/%E9%8B%BC%E9%90%B5%E4%B9%8B%E5%BF%83",
  );
  assert.equal(
    heartOfSteel.officialSourceUrl,
    "http://www.dds.com.tw/portfolio-item/heart-of-steel/",
  );
  assert.equal(heartOfSteel.officialSourceStatus, "public-http-only");
  assert.equal(
    lyingGame.creditUrl,
    "https://zh.wikipedia.org/zh-tw/%E8%AC%8A%E8%A8%80%E9%81%8A%E6%88%B2",
  );
  assert.equal(
    lyingGame.officialSourceUrl,
    "http://www.dds.com.tw/portfolio-item/the-lying-game/",
  );
  assert.equal(lyingGame.officialSourceStatus, "public-http-only");
  assert.ok(
    archive.every((item) => !Object.hasOwn(item, "archiveFeature")),
    "visual hierarchy must not live in Archive content",
  );
});

test("archive renders as one descending chronology independent of card treatment", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const html = renderPage({ lang: "en", site, works });
  const archiveSlugs = site.archive.map((item) => item.slug);

  assert.deepEqual(archiveSlugs, [
    "ghost-hand-divine-car",
    "three-minute-micro-drama",
    "heart-of-steel",
    "lying-game",
    "overclocking",
  ]);

  const titlePositions = [
    "The Mechanic",
    "Three-Minute Micro Drama Series",
    "Heart of Steel",
    "Lying Game",
    "Overclocking",
  ].map((title) => html.indexOf(title));

  assert.ok(titlePositions.every((position) => position >= 0));
  assert.deepEqual(titlePositions, [...titlePositions].sort((a, b) => a - b));
  assert.match(html, /class="archive-chronology"/);
});

test("archive renders five equal cards with one 40/60 contract", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const html = renderPage({ lang: "en", site, works });
  const archiveMarkup = html.match(
    /<section class="section archive-section">[\s\S]*?<div class="archive-chronology">[\s\S]*?<\/section>/,
  )?.[0];

  assert.ok(archiveMarkup, "Archive section renders");
  assert.equal((archiveMarkup.match(/class="archive-card(?:\s|")/g) || []).length, 5);
  assert.equal((archiveMarkup.match(/<a class="archive-card"/g) || []).length, 2);
  assert.equal((archiveMarkup.match(/<article class="archive-card/g) || []).length, 3);
  assert.match(archiveMarkup, /archive-card-copy/);
  assert.doesNotMatch(archiveMarkup, /archive-card-media-placeholder/);
  assert.match(archiveMarkup, /object-position: 56% 42%/);
  assert.match(archiveMarkup, /class="archive-card-index" aria-hidden="true">01/);
  assert.match(archiveMarkup, /class="archive-card-index" aria-hidden="true">02/);
  assert.match(
    archiveMarkup,
    /href="https:\/\/www\.youtube\.com\/playlist\?list=PLDTnN3czXyG8"[^>]*aria-label="Watch the full series: Three-Minute Micro Drama Series"[\s\S]*?<span class="archive-card-action">Watch the full series<\/span>/,
  );
  assert.match(archiveMarkup, /data-archive-reel-video/);
  assert.doesNotMatch(
    archiveMarkup,
    /archive-media-card|archive-media-card-lead|archive-item|archive-media-summary|mini-metrics/,
  );
  assert.doesNotMatch(archiveMarkup, /200M|250M|NT\$6M|600K|66%/);
  assert.doesNotMatch(archiveMarkup, /↗/);
});

test("archive drama cards keep trailer viewing and public credit proof separate", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const html = renderPage({ lang: "en", site, works });
  const archiveMarkup = html.match(
    /<section class="section archive-section">[\s\S]*?<div class="archive-chronology">[\s\S]*?<\/section>/,
  )?.[0];

  assert.ok(archiveMarkup, "Archive section renders");
  assert.equal(
    (archiveMarkup.match(/class="archive-card archive-card-with-actions"/g) || []).length,
    2,
  );
  assert.equal(
    (archiveMarkup.match(/class="archive-card-image archive-card-image-contain"/g) || []).length,
    2,
  );
  assert.match(
    archiveMarkup,
    /class="archive-card-action" href="https:\/\/www\.youtube\.com\/watch\?v=6g9YLv30DyU"[^>]*>Watch official trailer/,
  );
  assert.match(
    archiveMarkup,
    /class="archive-card-action archive-card-action-secondary" href="https:\/\/zh\.wikipedia\.org\/zh-tw\/%E9%8B%BC%E9%90%B5%E4%B9%8B%E5%BF%83"[^>]*>View credited role/,
  );
  assert.match(
    archiveMarkup,
    /class="archive-card-media archive-card-media-link" href="https:\/\/www\.youtube\.com\/watch\?v=DVzQf5COsyk"/,
  );
  assert.match(
    archiveMarkup,
    /class="archive-card-action archive-card-action-secondary" href="https:\/\/zh\.wikipedia\.org\/zh-tw\/%E8%AC%8A%E8%A8%80%E9%81%8A%E6%88%B2"[^>]*>View credited role/,
  );
});

test("Overclocking archive data uses the approved static production photo and reel", () => {
  const archive = loadMarkdownCollection(join(root, "content/archive"));
  const overclocking = archive.find((item) => item.slug === "overclocking");

  assert.equal(
    overclocking.posterImage,
    "/assets/showreel/overclocking-card-reel-poster.webp",
  );
  assert.doesNotMatch(overclocking.posterImage, /india/i);
  assert.equal(
    overclocking.cardReelUrl,
    "/assets/showreel/overclocking-card-reel.mp4",
  );
  assert.equal(overclocking.cardReelMode, "after-hold");
  assert.equal(overclocking.cardReelPoster, overclocking.posterImage);
  assert.equal(overclocking.posterRightsStatus, "user-supplied-local-source");
  assert.deepEqual(overclocking.posterDimensions, { width: 1280, height: 720 });
  assert.equal(overclocking.posterSourceTimecode, undefined);
  assert.match(overclocking.imageAlt.en, /illuminated Overclocking installation/i);
  assert.match(overclocking.imageAlt.zh, /發光的 Overclocking 裝置/);
  assert.match(overclocking.sourceNote, /P1070715\.jpg/);
  assert.match(
    overclocking.sourceNote,
    /fa87cb8c20e5199068fc5a8873a0108866ea8e084833deb6c32f1764b73189ea/,
  );
});

test("Ghost Hand archive data uses the approved still slideshow package", () => {
  const archive = loadMarkdownCollection(join(root, "content/archive"));
  const item = archive.find((record) => record.slug === "ghost-hand-divine-car");

  assert.equal(item.posterImage, "/assets/showreel/ghost-hand-divine-car-card-reel-poster.webp");
  assert.equal(item.cardReelUrl, "/assets/showreel/ghost-hand-divine-car-card-reel.mp4");
  assert.equal(item.cardReelPoster, item.posterImage);
  assert.equal(item.cardReelMode, "after-hold");
  assert.equal(item.cardReelDuration, 10);
  assert.equal(item.posterRightsStatus, "user-supplied-local-source");
  assert.equal(item.cardReelRightsStatus, "user-supplied-local-source");
  assert.deepEqual(item.posterDimensions, { width: 1280, height: 720 });
  assert.equal(item.posterSourceTimecode, undefined);
  assert.match(item.imageAlt.en, /two lead characters/i);
  assert.match(item.imageAlt.zh, /兩名主要角色/);
});

test("Overclocking reel package records the approved six-cut local-source edit", () => {
  const reelRoot = join(root, "showreel/overclocking-card-reel");
  const expectedFiles = [
    "scripts/make-selects.sh",
    "compositions/frames/01-mechanism.html",
    "compositions/frames/02-build.html",
    "compositions/frames/03-propeller.html",
    "compositions/frames/04-assembly.html",
    "compositions/frames/05-water-test.html",
    "compositions/frames/06-bottle-detail.html",
  ];

  for (const file of expectedFiles) {
    const sourcePath = join(reelRoot, file);
    assert.ok(existsSync(sourcePath), `missing reel source file: ${file}`);
    if (file.endsWith(".html")) {
      const source = readFileSync(sourcePath, "utf8");
      assert.doesNotMatch(source, /<video/);
      assert.match(source, /class="clip"/);
    }
  }

  const storyboard = readFileSync(join(reelRoot, "STORYBOARD.md"), "utf8");
  const storyboardSources = [
    ...storyboard.matchAll(/^- src: (.+)$/gm),
  ].map(([, source]) => source);
  assert.ok(storyboardSources.length > 0, "storyboard declares frame sources");
  for (const source of storyboardSources) {
    assert.ok(
      existsSync(join(reelRoot, source)),
      `storyboard source resolves: ${source}`,
    );
  }

  const makeSelects = readFileSync(
    join(reelRoot, "scripts/make-selects.sh"),
    "utf8",
  );
  for (const timecode of [
    "00:04:56",
    "00:15:50",
    "00:24:04",
    "00:29:44",
    "00:36:28",
    "00:39:56",
  ]) {
    assert.match(makeSelects, new RegExp(timecode.replaceAll(":", "\\:")));
  }
  assert.match(makeSelects, /00:29:46/);
  assert.doesNotMatch(makeSelects, /Downloads|india/i);

  const composition = readFileSync(join(reelRoot, "index.html"), "utf8");
  assert.match(composition, /data-width="1280"/);
  assert.match(composition, /data-height="720"/);
  assert.equal((composition.match(/data-composition-src=/g) || []).length, 6);
  assert.equal((composition.match(/<video/g) || []).length, 6);
  assert.equal(
    (composition.match(/src="assets\/source-clips\/selects\//g) || []).length,
    6,
  );
  assert.doesNotMatch(composition, /src="\.\.\//);
  assert.doesNotMatch(composition, /\sid="\d/);
});

test("archive reel markup renders only for explicit after-hold approval", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const html = renderPage({ lang: "en", site, works });
  const approvedArchiveReelCount = site.archive.filter(
    (item) => item.cardReelMode === "after-hold" && item.cardReelUrl && item.cardReelPoster,
  ).length;

  assert.equal((html.match(/data-archive-reel-video/g) || []).length, approvedArchiveReelCount);
  assert.match(
    html,
    /<a class="archive-card"[^>]*>[\s\S]*?data-archive-reel-video[\s\S]*?data-archive-reel-mode="after-hold"[\s\S]*?poster="\/assets\/showreel\/overclocking-card-reel-poster\.webp"[\s\S]*?<source src="\/assets\/showreel\/overclocking-card-reel\.mp4" type="video\/mp4">[\s\S]*?<\/a>/,
  );
  assert.match(html, /data-archive-reel-video[\s\S]*?preload="none"/);
  assert.doesNotMatch(html, /archive-media-card-lead/);
  assert.doesNotMatch(html, /india-overclocking-production/i);

  const staticSite = structuredClone(site);
  for (const item of staticSite.archive) delete item.cardReelMode;
  const staticHtml = renderPage({ lang: "en", site: staticSite, works });

  assert.doesNotMatch(staticHtml, /data-archive-reel-video/);
  assert.doesNotMatch(staticHtml, /overclocking-card-reel\.mp4/);
  assert.match(staticHtml, /overclocking-card-reel-poster\.webp/);
});

test("archive reels wait on the poster and reset when playback is no longer allowed", () => {
  const mainSource = readFileSync(join(root, "src/main.js"), "utf8");

  assert.match(mainSource, /const ARCHIVE_REEL_HOLD_MS = 1400;/);
  assert.match(mainSource, /querySelectorAll\("\[data-archive-reel-video\]"\)/);
  assert.match(mainSource, /archiveReelTimers = new Map\(\)/);
  assert.match(
    mainSource,
    /setTimeout\(\(\) => playArchiveReel\(video\), ARCHIVE_REEL_HOLD_MS\)/,
  );
  assert.match(mainSource, /video\.classList\.remove\("is-playing"\)/);
  assert.match(mainSource, /video\.pause\(\)/);
  assert.match(mainSource, /video\.currentTime = 0/);
  assert.match(mainSource, /document\.visibilityState !== "visible"/);
  assert.match(mainSource, /document\.addEventListener\("visibilitychange"/);
  assert.match(mainSource, /function handleArchiveReelViewportChange\(\)/);
  assert.match(mainSource, /window\.addEventListener\("scroll", handleArchiveReelViewportChange/);
  assert.match(mainSource, /window\.addEventListener\("resize", handleArchiveReelViewportChange/);
  assert.match(mainSource, /window\.addEventListener\("pagehide"/);
});

test("archive reel styling keeps the poster visible until playback is confirmed", () => {
  const css = readFileSync(join(root, "src/styles.css"), "utf8");

  assert.match(
    css,
    /\.archive-card-image,\s*\.archive-card-reel \{[^}]*height: 100%;[^}]*object-fit: cover;[^}]*object-position: center;[^}]*position: absolute;[^}]*width: 100%;[^}]*\}/,
  );
  assert.match(
    css,
    /\.archive-card-reel \{[^}]*opacity: 0;[^}]*pointer-events: none;[^}]*transition: opacity[^}]*\}/,
  );
  assert.match(css, /\.archive-card-reel\.is-playing \{[^}]*opacity: 1;[^}]*\}/);
  assert.match(
    css,
    /a\.archive-card:hover \.archive-card-image \{[^}]*transform: scale\(1\.025\);[^}]*\}/,
  );
  assert.match(
    css,
    /a\.archive-card:focus-visible \{[^}]*outline: 2px solid var\(--acid\);[^}]*outline-offset: 3px;[^}]*\}/,
  );
  assert.doesNotMatch(css, /^\.archive-card:hover \.archive-card-image \{/m);
  assert.doesNotMatch(css, /^\.archive-card:focus-visible \{/m);
  assert.match(
    css,
    /@media \(max-width: 460px\) \{[\s\S]*?\.archive-card \{[^}]*aspect-ratio: auto;[^}]*min-height: clamp\(8\.25rem, 38vw, 10rem\);[^}]*\}/,
  );
  assert.match(
    css,
    /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.archive-card-reel \{[^}]*display: none;[^}]*\}/,
  );
});

test("renderPage creates bilingual page with scroll-stack works and video fallbacks", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const html = renderPage({ lang: "en", site, works });
  const zhHtml = renderPage({ lang: "zh", site, works });

  assert.match(html, /Based in Taiwan, working internationally/);
  assert.match(html, /<span>HSIN-HSIN<\/span><span>YUAN<\/span>/);
  assert.match(html, /Documentary Director <span class="role-slash">\/<\/span> Bilingual Producer/);
  assert.match(html, /Arts <span class="role-slash">\/<\/span> Culture <span class="role-slash">\/<\/span> Technology/);
  assert.doesNotMatch(html, /<div class="hero-roles">.*AI-Language Creative.*<\/div>/s);
  assert.equal(site.site.heroMedia.contract.kind, "hero-media");
  assert.match(html, /<link rel="preload" as="image" type="image\/avif" href="\/assets\/portfolio\/hero\/hsin-working-white-space-960\.avif" imagesrcset="[^"]*640\.avif 640w, [^"]*960\.avif 960w" imagesizes="90vw" media="\(max-width: 820px\)" fetchpriority="high">/);
  assert.match(html, /<link rel="preload" as="image" type="image\/avif" href="\/assets\/portfolio\/hero\/hsin-working-white-space-1920\.avif" imagesrcset="[^"]*960\.avif 960w, [^"]*1440\.avif 1440w, [^"]*1920\.avif 1920w" imagesizes="\(min-width: 1281px\) 47vw, 90vw" media="\(min-width: 821px\)" fetchpriority="high">/);
  assert.match(html, /<div class="hero-media hero-media--slow-push"[^>]*data-hero-media-id="site\.hero"/);
  assert.match(html, /<picture class="hero-media-picture">/);
  assert.match(html, /<source type="image\/avif" media="\(max-width: 820px\)" srcset="[^"]*640\.avif 640w, [^"]*960\.avif 960w" sizes="90vw">/);
  assert.match(html, /<source type="image\/webp" media="\(min-width: 821px\)" srcset="[^"]*960\.webp 960w, [^"]*1440\.webp 1440w, [^"]*1920\.webp 1920w" sizes="\(min-width: 1281px\) 47vw, 90vw">/);
  assert.match(html, /<source type="image\/jpeg" media="\(max-width: 820px\)" srcset="[^"]*640\.jpg 640w, [^"]*960\.jpg 960w" sizes="90vw">/);
  assert.match(html, /<img class="hero-media-image" src="\/assets\/portfolio\/hsin-working-white-space\.jpg" width="1920" height="1440" alt="Hsin-Hsin Yuan working on a laptop in a bright white studio" loading="eager" decoding="sync" fetchpriority="high">/);
  assert.doesNotMatch(html, /id="showreel"/);
  assert.match(zhHtml, /alt="袁欣欣坐在明亮的白色工作室裡使用筆記型電腦"/);
  assert.doesNotMatch(html, /class="hero-media[^>]*role="img"|class="hero-media[^>]*aria-label=/);
  assert.match(html, /data-hero-width="1920" data-hero-height="1440"/);
  assert.match(html, /data-hero-motion="slow-push"/);
  assert.doesNotMatch(html, /--hero-image:/);
  assert.match(html, /--hero-wide-x: 38%; --hero-wide-y: 78%/);
  assert.match(html, /--hero-stacked-x: 38%; --hero-stacked-y: 77%/);
  assert.match(html, /--hero-mobile-x: 38%; --hero-mobile-y: 78%/);
  assert.match(html, /--hero-motion-start-scale: 140%; --hero-motion-end-scale: 148%/);
  assert.doesNotMatch(html, /light-beam-layer|light-beam-right|ambient-canvas/);
  assert.doesNotMatch(html, /hero-showreel-video|data-showreel-video|data-showreel-play/);
  assert.doesNotMatch(html, /aria-label="Watch reel"/);
  assert.doesNotMatch(html, /<span class="hero-media-caption">/);
  assert.doesNotMatch(html, /hero-actions/);
  assert.doesNotMatch(html, /href="#showreel">Reel<\/a>/);
  assert.doesNotMatch(html, /website-visual-reel\.(?:mp4|png)/);
  assert.doesNotMatch(html, /showreel-modal/);
  assert.doesNotMatch(html, /showreel-section/);
  assert.ok(html.indexOf('data-hero-media-id="site.hero"') < html.indexOf("collab-section-early"));
  assert.match(html, /Ways to Work Together/);
  assert.match(html, /I can join at the research and story-development stage/);
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
  assert.doesNotMatch(html, /Who Should Contact Me/);
  assert.doesNotMatch(html, /For Artists &amp; Cultural Institutions/);
  assert.doesNotMatch(html, /For Documentary \/ Factual Producers/);
  assert.doesNotMatch(html, /Challenge|What I shaped|class="case-study/);
  assert.doesNotMatch(html, /Best for/);
  assert.doesNotMatch(html, /Selected Impact/);
  assert.doesNotMatch(html, /impact-grid/);
  assert.doesNotMatch(html, /impact-section/);
  assert.doesNotMatch(html, /AI \/ Language Lab/);
  assert.doesNotMatch(html, /fact-checked bilingual script workflow/i);
  assert.doesNotMatch(html, /working home for the future skill name/i);
  assert.match(html, /FROM THE ARCHIVE/);
  assert.match(html, /class="archive-chronology"/);
  assert.match(html, /class="archive-card"/);
  assert.doesNotMatch(html, /archive-media-card|archive-media-card-lead|archive-item/);
  assert.match(html, /href="https:\/\/www\.youtube\.com\/watch\?v=l9__7mhWJBM"/);
  assert.match(html, /href="https:\/\/www\.youtube\.com\/watch\?v=6g9YLv30DyU"/);
  assert.match(html, /href="https:\/\/www\.youtube\.com\/watch\?v=DVzQf5COsyk"/);
  assert.match(html, /Watch public program/);
  assert.match(html, /Watch official trailer/);
  assert.match(html, /Watch official promo/);
  assert.doesNotMatch(html, /Short-form web drama work across food/);
  assert.match(html, /class="nav-contact" href="#contact"/);
  assert.match(html, /<h2 class="contact-title"><span class="contact-title-line">Let’s build<\/span><span class="contact-title-line"><span class="contact-title-bridge">a story <\/span><span class="contact-title-accent">together\.<\/span><\/span><\/h2>/);
  assert.match(html, /<form class="contact-form" action="\/api\/contact" method="post" data-contact-form>/);
  assert.match(html, /name="startedAt"/);
  assert.match(html, /name="website"/);
  assert.match(html, /Project type/);
  assert.match(html, /Send inquiry/);
  assert.doesNotMatch(html, /mailto:/);
  assert.match(html, /partner-wordmark/);
  assert.match(html, /\/assets\/logos\/taiwanplus-mono\.svg/);
  assert.match(html, /Gorgeous Space/);
  assert.doesNotMatch(html, /Happy Space/);
  assert.ok(html.indexOf("collab-grid") < html.indexOf("watch-loop"));
  assert.ok(html.indexOf("watch-loop") < html.indexOf("available-section"));
  assert.ok(html.indexOf("watch-loop") < html.indexOf("works-section"));
  assert.ok(html.indexOf("available-section") < html.indexOf("works-section"));
  assert.ok(html.indexOf('class="section works-section"') < html.indexOf('class="section archive-section"'));
  assert.ok(html.indexOf('class="section archive-section"') < html.indexOf('class="section contact"'));
  assert.doesNotMatch(html, /class="section lab-section"/);
  assert.doesNotMatch(html, /class="services-grid"/);
  assert.match(html, /works-stack/);
  assert.match(html, /data-scroll-stack/);
  assert.doesNotMatch(html, /data-horizontal-scroll/);
  assert.match(html, /data-watch-loop/);
  assert.match(html, /class="watch-loop-frame"/);
  assert.doesNotMatch(html, /Watch Selected Films/);
  assert.doesNotMatch(html, /Screening strip/);
  assert.doesNotMatch(html, /Swipe to explore/);
  assert.match(html, /watch-loop-card/);
  assert.doesNotMatch(html, /data-watch-loop-video/);
  assert.match(html, /data-featured-reel-video/);
  assert.match(
    html,
    /src="\/assets\/showreel\/interior-spatial-card-reel\.mp4"/,
  );
  assert.match(
    html,
    /src="\/assets\/showreel\/nothing-by-bus-card-reel\.mp4"/,
  );
  assert.match(
    html,
    /<video[\s\S]*?muted[\s\S]*?loop[\s\S]*?playsinline[\s\S]*?preload="none"/,
  );
  assert.match(html, /href="#slow-steps"/);
  assert.match(
    html,
    /class="watch-loop-card" href="#slow-steps" style="background-image:[\s\S]*?slow-steps-poster\.webp/,
  );
  assert.ok(
    html.indexOf('href="#slow-steps"') <
      html.indexOf(
        'href="https://www.taiwanplus.com/shows/documentary/business-and-tech/590/tech-dreamers"',
      ),
  );
  assert.doesNotMatch(html, /href="#tech-dreamers"/);
  assert.match(
    html,
    /class="watch-loop-card" href="https:\/\/www\.taiwanplus\.com\/shows\/documentary\/business-and-tech\/590\/tech-dreamers" target="_blank" rel="noreferrer"/,
  );
  assert.match(html, /href="#my-art-my-voice"/);
  assert.doesNotMatch(html, /View in featured works/);
  assert.doesNotMatch(html, /Scroll to explore/);
  assert.match(html, /My Art, My Voice/);
  assert.match(html, /Tech Dreamers/);
  assert.match(html, /Slow Steps/);
  assert.doesNotMatch(html, /slow-steps[\s\S]*?paris-cultural-olympiad-team\.jpg/);
  assert.doesNotMatch(html, /Slow Steps[\s\S]*?Upcoming/);
  assert.doesNotMatch(html, /Slow Steps[\s\S]*?Coming 2026/);
  assert.doesNotMatch(html, /Slow Steps[\s\S]*?Movement/i);
  assert.match(html, /Slow Steps[\s\S]*?Director \/ Editor \/ Producer/);
  assert.match(html, /Slow Steps[\s\S]*?Travel/);
  assert.doesNotMatch(html, /aria-label="Play video: Slow Steps"/);
  assert.match(
    html,
    /<article class="work-panel" id="slow-steps">[\s\S]*?class="media-frame media-frame-unlabeled" style="background-image:[\s\S]*?slow-steps-poster\.webp[\s\S]*?<\/div>[\s\S]*?<div class="work-copy">/,
  );
  assert.doesNotMatch(
    html,
    /<article class="work-panel" id="slow-steps">[\s\S]*?<div class="media-label">Slow Steps<\/div>[\s\S]*?<div class="work-copy">/,
  );
  assert.match(
    html,
    /class="media-frame media-frame-unlabeled media-frame-link"[\s\S]*?href="https:\/\/www\.taiwanplus\.com\/shows\/documentary\/business-and-tech\/590\/tech-dreamers"[\s\S]*?aria-label="Play video: Tech Dreamers"[\s\S]*?background-image:[\s\S]*?224be7ed-057b-400f-af63-a8582cd80cfb\.webp/,
  );
  assert.match(
    html,
    /class="media-frame media-frame-unlabeled media-frame-link"[\s\S]*?href="https:\/\/www\.taiwanplus\.com\/shows\/documentary\/arts\/410\/my-art-my-voice\/250220001\/whats-the-vibe-in-taiwan-my-art-my-voice"[\s\S]*?aria-label="Play video: My Art, My Voice"/,
  );
  assert.match(html, /class="work-media-play" aria-hidden="true"><span><\/span><\/span>/);
  assert.match(html, /Design &amp; Brand Films/);
  assert.match(html, /Gorgeous Space/);
  assert.doesNotMatch(html, /幸福空間/);
  assert.match(
    html,
    /<article class="work-panel work-panel-wide-media" id="interior-spatial-brand-films">[\s\S]*?class="media-frame media-frame-wide media-frame-unlabeled media-frame-link"[\s\S]*?aria-label="Play video: Design &amp; Brand Films"[\s\S]*?linear-gradient\(180deg, rgba\(9,9,10,.04\), rgba\(9,9,10,.26\)\)[\s\S]*?gorgeous-space-sunny-wang-frontal\.webp[\s\S]*?background-size: cover, contain;[\s\S]*?background-repeat: no-repeat;[^>]*>[\s\S]*?class="work-media-play"/,
  );
  assert.match(html, /Director \/ Editor/);
  assert.doesNotMatch(html, /<span class="status-badge">Selected reel<\/span>/);
  assert.doesNotMatch(html, /3 yrs/);
  assert.doesNotMatch(html, /Interior Design &amp; Branded Films[\s\S]*?Coming 2026/);
  assert.match(html, /Nothing by Bus/);
  assert.match(html, /The Mechanic/);
  assert.doesNotMatch(html, /final public release materials are still being reconstructed/);
  assert.match(html, /Episode Development \/ Writer/);
  assert.match(html, /Top Gear China: UK Special/);
  assert.match(html, /China Dragon TV/);
  assert.match(html, /Director/);
  assert.doesNotMatch(html, /China-side Director/);
  assert.doesNotMatch(html, /Oriental Satellite TV/);
  assert.doesNotMatch(
    html,
    /<article class="work-panel" id="top-gear-china-uk-special">[\s\S]*?<div class="media-label/,
  );
  assert.doesNotMatch(html, /<span>Top Gear<\/span><span>China: UK<\/span><span>Special<\/span>/);
  assert.doesNotMatch(html, />car show</i);
  assert.doesNotMatch(html, />broadcast</i);
  assert.doesNotMatch(html, />UK production</i);
  assert.match(html, />factual entertainment</i);
  assert.match(html, /200M/);
  assert.match(html, /Season 2 audience, reported across television and online/);
  assert.match(html, /first five episodes \/ TV \+ online/);
  assert.match(html, /average weekly live audience/);
  assert.match(html, /national time slot \/ four weeks/);
  assert.match(html, /0\.81/);
  assert.match(html, /href="#top-gear-china-uk-special"/);
  assert.match(html, /href="#pts-taigi-bus"/);
  assert.match(html, /href="#interior-spatial-brand-films"/);
  assert.match(html, /https:\/\/youtu\.be\/M_eXe9HRD9Y\?si=YZ_3JZ7FJY4vVcZv/);
  assert.equal((html.match(/>Watch the full series<\/(?:a|span)>/g) || []).length, 2);
  assert.equal((html.match(/>Watch selected reel<\/a>/g) || []).length, 1);
  assert.equal((html.match(/<a class="button-link"/g) || []).length, 2);
  assert.match(
    html,
    /href="https:\/\/www\.youtube\.com\/playlist\?list=PLJCU8axtQoPI"[\s\S]*?>Watch selected reel<\/a>/,
  );
  assert.match(
    html,
    /href="https:\/\/www\.youtube\.com\/playlist\?list=PLfuPqJAlXvCs"[\s\S]*?>Watch the full series<\/a>/,
  );
  assert.match(
    html,
    /href="https:\/\/www\.youtube\.com\/playlist\?list=PLDTnN3czXyG8"[^>]*aria-label="Watch the full series: Three-Minute Micro Drama Series"/,
  );
  assert.doesNotMatch(html, /Watch the full episode/);
  assert.doesNotMatch(html, />Watch the series<\/a>/);
  assert.doesNotMatch(html, /Watch representative segment/);
  assert.doesNotMatch(html, /20\+|public links archived|episode leads archived|>PTS<\/strong>|>public media<|>Taiwanese language</);
  assert.match(html, />LG \/ Samsung<\/strong>/);
  assert.match(html, />Taiwanese<\/span>/);
  assert.doesNotMatch(html, /↗/);
  assert.match(html, /<div class="press-preview" role="group" aria-label="Press &amp; Interviews">/);
  assert.match(html, /Official page/);
  assert.match(html, /Project press/);
  assert.match(html, /Official program page/);
  assert.doesNotMatch(html, /24 artist groups/);
  assert.doesNotMatch(html, />24<\/span>/);
  assert.match(html, /data-metadata-checked-at="2026-07-12"/);
  assert.match(html, /data-image-source="owned project still; official page exception"/);
  assert.match(html, /Cultural Olympiad documentary My Art, My Voice/);
  assert.match(html, /Mirror Media/);
  assert.match(html, /<img src="https:\/\/v3-statics\.mirrormedia\.mg\/images\/00f85da2-db1d-4c46-9b3d-a7359d911e52-w1600\.png" alt="" loading="lazy" decoding="async" onerror="this\.parentElement\.remove\(\)">/);
  assert.match(html, /Director interview: walking into the sea of creation/);
  assert.match(html, /Very Mulan/);
  assert.doesNotMatch(html, /17472124753d\.png/);
  assert.match(html, /press-preview-card/);
  assert.match(html, /<script type="application\/ld\+json">/);
  assert.match(html, /"@type":"Person"/);
  assert.match(html, /"name":"Hsin-Hsin Yuan"/);
  assert.match(html, /"sameAs":\["https:\/\/github.com\/projectmoonie-creator"/);
  assert.doesNotMatch(html, /20260712-strip-first/);
  assert.match(html, /styles\.css\?v=[a-f0-9]{12}/);
  assert.match(html, /main\.js\?v=[a-f0-9]{12}/);
  assert.doesNotMatch(html, /old English CV|source materials/i);
});

test("work Press keeps entry labels but hides its group heading", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const css = readFileSync(join(root, "src/styles.css"), "utf8");
  const en = renderPage({ lang: "en", site, works });
  const zh = renderPage({ lang: "zh", site, works });
  const hasLocalizedPressType = (html, label, type) => {
    const groupStart = `<div class="press-preview" role="group" aria-label="${label}">`;
    const typeElement = `<span class="press-preview-type">${type}</span>`;

    return html
      .split(groupStart)
      .slice(1)
      .some((remainder) => {
        const groupEnd = remainder.indexOf("\n    </div>");
        return groupEnd !== -1 && remainder.slice(0, groupEnd).includes(typeElement);
      });
  };

  assert.doesNotMatch(en, /<p class="press-preview-title"/);
  assert.doesNotMatch(zh, /<p class="press-preview-title"/);
  assert.doesNotMatch(en, />\s*Press &amp; Interviews\s*</);
  assert.doesNotMatch(zh, />\s*媒體報導與訪談\s*</);
  assert.ok(
    en.includes(
      '<div class="press-preview" role="group" aria-label="Press &amp; Interviews">',
    ),
  );
  assert.ok(
    zh.includes('<div class="press-preview" role="group" aria-label="媒體報導與訪談">'),
  );
  assert.equal(hasLocalizedPressType(en, "Press &amp; Interviews", "Official page"), true);
  assert.equal(hasLocalizedPressType(en, "Press &amp; Interviews", "Project press"), true);
  assert.equal(hasLocalizedPressType(zh, "媒體報導與訪談", "官方頁面"), true);
  assert.equal(hasLocalizedPressType(zh, "媒體報導與訪談", "報導"), true);
  assert.match(css, /\.press-preview \{/);
  assert.doesNotMatch(css, /\.press-preview-title/);
});

test("renderPage escapes image URLs for inline CSS contexts", () => {
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
      posterImage: "/assets/poster')bad.jpg",
      tags: [],
      metrics: [],
      press: [],
      accent: "cyan",
    },
  ];

  const html = renderPage({ lang: "en", site, works });

  assert.doesNotMatch(html, /url\('\/assets\/poster'\)bad\.jpg'\)/);
  assert.match(html, /url\(&quot;\/assets\/poster\\'\)bad\.jpg&quot;\)/);
});

test("Tech Dreamers repeats its canonical TaiwanPlus destination as an audited official entry", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const en = renderPage({ lang: "en", site, works });
  const zh = renderPage({ lang: "zh", site, works });
  const techPanel = en.match(
    /<article class="work-panel" id="tech-dreamers">[\s\S]*?<\/article>/,
  )?.[0];
  const techOfficialCard = techPanel?.match(
    /<a class="press-preview-card" href="https:\/\/www\.taiwanplus\.com\/shows\/documentary\/business-and-tech\/590\/tech-dreamers"[^>]*data-metadata-checked-at="2026-08-03"[^>]*>[\s\S]*?Official program page[\s\S]*?<\/a>/,
  )?.[0];
  const techPanelZh = zh.match(
    /<article class="work-panel" id="tech-dreamers">[\s\S]*?<\/article>/,
  )?.[0];
  const techOfficialCardZh = techPanelZh?.match(
    /<a class="press-preview-card" href="https:\/\/www\.taiwanplus\.com\/shows\/documentary\/business-and-tech\/590\/tech-dreamers"[^>]*>[\s\S]*?官方頁面[\s\S]*?<\/a>/,
  )?.[0];

  assert.ok(techPanel);
  assert.ok(techOfficialCard);
  assert.ok(techPanelZh);
  assert.ok(techOfficialCardZh);
  assert.doesNotMatch(techOfficialCardZh, /<strong>/);
});

test("Design title propagates to the English screening-strip card", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const html = renderPage({ lang: "en", site, works });
  const card = html.match(
    /<a class="watch-loop-card" href="#interior-spatial-brand-films"[\s\S]*?<\/a>/,
  )?.[0];

  assert.ok(card);
  assert.match(card, /<strong>Design &amp; Brand Films<\/strong>/);
  assert.doesNotMatch(card, /Interior Design &amp; Branded Films/);
});

test("archive and Design remove redundant copy without losing credit", () => {
  const loaded = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const design = works.find((work) => work.slug === "interior-spatial-brand-films");
  const en = renderPage({ lang: "en", site: loaded, works });
  const zh = renderPage({ lang: "zh", site: loaded, works });
  const designPanel = en.match(
    /<article class="work-panel work-panel-wide-media" id="interior-spatial-brand-films">[\s\S]*?<\/article>/,
  )?.[0];
  const archiveSection = en.match(
    /<section class="section archive-section">[\s\S]*?<\/section>/,
  )?.[0];

  assert.equal("archiveSubcopy" in loaded.site.en, false);
  assert.equal("archiveSubcopy" in loaded.site.zh, false);
  assert.doesNotMatch(en, /Earlier scripted, factual, and international work/);
  assert.doesNotMatch(zh, /早期戲劇、科學節目與國際合作/);
  assert.doesNotMatch(archiveSection, /<p><\/p>/);
  assert.deepEqual(design.tags, ["interior design", "branded content", "lifestyle"]);
  assert.match(designPanel, /Director \/ Editor/);
  assert.doesNotMatch(designPanel, /<span class="tag">editing<\/span>/);
});

test("Figma handoff keeps the canonical Gorgeous Space collaboration identity", () => {
  execFileSync("node", ["scripts/build-figma-export.mjs"], { cwd: root, stdio: "pipe" });

  const desktopHome = readFileSync(
    join(root, "figma-export/01-desktop-home.svg"),
    "utf8",
  );
  const desktopWorks = readFileSync(
    join(root, "figma-export/02-desktop-works-logos.svg"),
    "utf8",
  );
  const figmaImporter = readFileSync(
    join(root, "figma/hsin-portfolio-importer/code.js"),
    "utf8",
  );

  for (const artifact of [desktopHome, desktopWorks]) {
    assert.match(artifact, /id="component-collaboration-gorgeous-space"/);
    assert.match(artifact, /data-source="gorgeous-space-mono\.svg"/);
    assert.doesNotMatch(artifact, /幸福空間|\[object Object\]/i);
  }
  assert.match(figmaImporter, /Gorgeous Space/);
  assert.doesNotMatch(figmaImporter, /幸福空間|\[object Object\]/i);
});

test("build generates English, Chinese, CSS, and JS assets", () => {
  const generator = readFileSync(join(root, "scripts/build-site.mjs"), "utf8");
  assert.match(generator, /verifyHeroDerivativeManifest\(\{ root, heroMedia: rawSite\.heroMedia \}\)/);

  execFileSync("node", ["scripts/build-site.mjs"], { cwd: root, stdio: "pipe" });

  assert.equal(existsSync(join(root, "dist/en/index.html")), true);
  assert.equal(existsSync(join(root, "dist/zh/index.html")), true);
  assert.equal(existsSync(join(root, "dist/styles.css")), true);
  assert.equal(existsSync(join(root, "dist/main.js")), true);
  assert.equal(existsSync(join(root, "dist/archive-reel-selection.js")), true);
  assert.equal(existsSync(join(root, "dist/ambient-background.js")), false);
  assert.equal(existsSync(join(root, "dist/robots.txt")), true);
  assert.equal(existsSync(join(root, "dist/sitemap.xml")), true);
  assert.equal(existsSync(join(root, "dist/vendor/anime.esm.min.js")), false);
  assert.equal(existsSync(join(root, "dist/vendor/ogl/src/index.js")), false);
  assert.equal(existsSync(join(root, "dist/assets/showreel/website-visual-reel.mp4")), false);
  assert.equal(existsSync(join(root, "dist/assets/showreel/website-visual-reel-poster.png")), false);
  assert.equal(
    existsSync(join(root, "dist/assets/showreel/interior-spatial-card-reel.mp4")),
    true,
  );
  assert.equal(
    existsSync(join(root, "dist/assets/showreel/interior-spatial-card-reel-poster.webp")),
    true,
  );
  assert.equal(
    existsSync(join(root, "dist/assets/portfolio/gorgeous-space-sunny-wang-frontal.webp")),
    true,
  );
  assert.equal(
    existsSync(join(root, "dist/assets/showreel/nothing-by-bus-card-reel.mp4")),
    true,
  );
  assert.equal(
    existsSync(join(root, "dist/assets/showreel/nothing-by-bus-card-reel-poster.webp")),
    true,
  );

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
  assert.match(zh, /<span class="brand-desktop">袁欣欣 \/ HSIN-HSIN YUAN<\/span>/);
  assert.match(zh, /<span class="brand-mobile">袁欣欣<\/span>/);
  assert.doesNotMatch(zh, /觀看 showreel|網站視覺 Showreel|website-visual-reel/);
  assert.match(zh, /觀看精選影片/);
  assert.doesNotMatch(zh, /data-about-tabs/);
  assert.doesNotMatch(zh, /可合作項目/);
  assert.doesNotMatch(zh, /<h2 class="section-title">關於我<\/h2>/);
  assert.match(zh, /合作方式/);
  assert.doesNotMatch(zh, /我是來自台灣的紀錄片導演與創意製作人/);
  assert.doesNotMatch(zh, /情感質地/);
  assert.doesNotMatch(zh, /溫柔但準確地轉譯/);
  assert.doesNotMatch(zh, /住宅與室內設計影像、空間品牌影片/);
  assert.doesNotMatch(zh, /誰適合找我/);
  assert.doesNotMatch(zh, /藝術家與文化單位/);
  assert.doesNotMatch(zh, /紀實製作人與節目團隊/);
  assert.match(zh, /剪輯/);
  assert.doesNotMatch(zh, /挑戰|我如何處理|class="case-study/);
  assert.match(zh, /aria-label="播放影片：Tech Dreamers"/);
  assert.doesNotMatch(zh, /適合合作/);
  assert.doesNotMatch(zh, /代表成績/);
  assert.doesNotMatch(zh, /impact-grid/);
  assert.doesNotMatch(zh, /AI \/ Language Lab/);
  assert.doesNotMatch(zh, /future skill name/);
  assert.match(zh, /歷年作品/);
  assert.match(zh, /觀看節目/);
  assert.match(zh, /觀看官方預告片/);
  assert.match(zh, /觀看官方宣傳片/);
  assert.match(zh, /<h2 class="contact-title"><span class="contact-title-line">一起把故事<\/span><span class="contact-title-line"><span class="contact-title-accent">說出來。<\/span><\/span><\/h2>/);
  assert.doesNotMatch(zh, /觀看完整單集/);
  assert.equal((zh.match(/>觀看完整系列<\/(?:a|span)>/g) || []).length, 2);
  assert.equal((zh.match(/>觀看精選影片<\/a>/g) || []).length, 1);
  assert.match(zh, /href="https:\/\/www\.youtube\.com\/playlist\?list=PLJCU8axtQoPI"/);
  assert.match(zh, /href="https:\/\/www\.youtube\.com\/playlist\?list=PLfuPqJAlXvCs"/);
  assert.match(
    zh,
    /href="https:\/\/www\.youtube\.com\/playlist\?list=PLDTnN3czXyG8"[^>]*aria-label="觀看完整系列: 三分超微劇系列"/,
  );
  assert.doesNotMatch(zh, /觀看代表片段/);
  assert.match(zh, /幸福空間與品牌影像/);
  assert.match(zh, /導演／剪輯/);
  assert.doesNotMatch(zh, /3 yrs|三年間|約三年/);
  assert.match(zh, /無事坐巴士/);
  assert.match(zh, /單集企劃／企編/);
  assert.match(zh, /《巔峰拍檔》中國版：英國篇/);
  assert.match(zh, /東方衛視/);
  assert.doesNotMatch(zh, /China Dragon TV/);
  assert.doesNotMatch(zh, /在英國拍攝，與原版 Top Gear 團隊完成跨國汽車節目製作。/);
  assert.doesNotMatch(zh, /中方導演/);
  assert.match(zh, /連續四週全國同時段第一/);
  assert.match(zh, /精選影像作品/);
  assert.match(zh, /<div class="press-preview" role="group" aria-label="媒體報導與訪談">/);
  assert.match(zh, /官方頁面/);
  assert.match(zh, /報導/);
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
  assert.match(css, /--work-panel: #171719;/);
  assert.match(css, /\.work-panel \{\n  background: var\(--work-panel\);/);
  assert.match(css, /grid-template-columns: minmax\(18rem, 0\.9fr\) minmax\(0, 1fr\)/);
  assert.match(css, /z-index: calc\(var\(--stack-index\) \+ 1\);/);
  assert.match(css, /\.works-stack \.work-panel:nth-child\(6\) \{\n  --stack-index: 5;/);
  assert.match(css, /transform: translate3d\(0, calc\(var\(--stack-progress\) \* -0\.45rem\), 0\) scale\(calc\(1 - var\(--stack-progress\) \* 0\.035\)\)/);
  assert.match(css, /\.hero h1 \{\n  font-size: clamp\(3\.5rem, 7\.2vw, 7\.2rem\);/);
  assert.match(css, /\.hero-media \{[\s\S]*?min-height: auto;/);
  assert.match(css, /@media \(max-width: 1280px\) \{\n  \.hero \{\n    grid-template-columns: 1fr;/);
  assert.doesNotMatch(css, /\.impact-grid/);
  assert.doesNotMatch(css, /\.impact-item/);
  assert.doesNotMatch(css, /url\(\"\/assets\/portfolio\/hsin-working-white-space\.jpg\"\)/);
  assert.doesNotMatch(css, /var\(--hero-image\)/);
  assert.match(css, /\.hero-media-picture \{[^}]*inset: 0;[^}]*position: absolute;[^}]*\}/);
  assert.match(css, /\.hero-media-image \{[^}]*height: var\(--hero-static-scale\);[^}]*left: var\(--hero-active-x\);[^}]*max-width: none;[^}]*position: absolute;[^}]*top: var\(--hero-active-y\);[^}]*width: auto;[^}]*\}/);
  assert.match(css, /--hero-active-x: var\(--hero-wide-x\);/);
  assert.match(css, /--hero-active-y: var\(--hero-wide-y\);/);
  assert.match(css, /@media \(max-width: 1280px\) \{[\s\S]*?\.hero-media \{[^}]*--hero-active-x: var\(--hero-stacked-x\);[^}]*--hero-active-y: var\(--hero-stacked-y\);[^}]*--hero-static-scale: 132%;/);
  assert.match(css, /@media \(max-width: 820px\) \{[\s\S]*?\.hero-media \{[^}]*--hero-active-x: var\(--hero-mobile-x\);[^}]*--hero-active-y: var\(--hero-mobile-y\);[^}]*--hero-static-scale: 136%;/);
  assert.doesNotMatch(css, /\.hero-play-button|\.hero-play-icon|\.hero-showreel-video|\.hero-media\.is-playing|\.hero-media:focus-visible/);
  assert.doesNotMatch(css, /\.hero-actions/);
  assert.doesNotMatch(css, /\.hero-media-caption/);
  assert.doesNotMatch(css, /\.about-tab/);
  assert.doesNotMatch(css, /\.about-copy/);
  assert.match(css, /\.available-pill-list \{/);
  assert.doesNotMatch(css, /\.available-line/);
  assert.doesNotMatch(css, /\.services-grid/);
  assert.doesNotMatch(css, /\.service-card/);
  assert.doesNotMatch(css, /\.lab-grid/);
  assert.doesNotMatch(css, /\.lab-card/);
  assert.match(css, /\.archive-chronology \{/);
  assert.match(
    css,
    /\.archive-card \{[^}]*aspect-ratio: 80 \/ 27;[^}]*grid-template-columns: minmax\(0, 2fr\) minmax\(0, 3fr\);[^}]*\}/,
  );
  assert.match(css, /\.archive-card-copy \{/);
  assert.match(css, /\.archive-card-media \{/);
  assert.match(css, /\.archive-card-index \{/);
  assert.doesNotMatch(
    css,
    /\.archive-media-card|\.archive-media-card-lead|\.archive-item|\.archive-media-summary/,
  );
  assert.match(css, /\.nav-contact \{/);
  assert.match(css, /\.contact-title-line \{[^}]*display: block;[^}]*white-space: nowrap;[^}]*\}/);
  assert.match(css, /\.contact-title-accent \{[\s\S]*?color: var\(--acid\);/);
  assert.match(
    css,
    /@media \(max-width: 460px\) \{[\s\S]*?\.contact h2 \{[^}]*line-height: 1\.02;/,
  );
  assert.match(css, /\.brand-mobile \{\n  display: none;/);
  assert.match(css, /@media \(max-width: 820px\) \{[\s\S]*\.brand-desktop \{[\s\S]*display: none;[\s\S]*\.brand-mobile \{[\s\S]*display: inline;/);
  assert.doesNotMatch(css, /showreel-modal/);
  assert.doesNotMatch(js, /playShowreel|showreelMedia|showreelPlay|showreelVideo|data-showreel|#showreel/);
  assert.match(css, /\.collab-grid \{[\s\S]*?align-items: center;[\s\S]*?display: flex;/);
  assert.match(css, /\.collab-item \{\n  align-items: center;\n  background: transparent;\n  border: 0;/);
  assert.doesNotMatch(css, /\.partner-name/);
  assert.match(css, /\.hero h1 span \{\n  display: block;\n  white-space: nowrap;/);
  const heroKeyframes = css.match(/@keyframes heroStillPush \{[\s\S]*?\n  \}/)?.[0] || "";
  assert.match(heroKeyframes, /transform:/);
  assert.doesNotMatch(heroKeyframes, /background-position|background-size/);
  assert.match(css, /\.hero-media--slow-push \.hero-media-image \{[^}]*animation: heroStillPush 18s ease-in-out infinite alternate;/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.hero-media--slow-push \.hero-media-image \{[^}]*animation: none;[^}]*transform:/);
  assert.match(css, /\.hero-roles \.role-slash \{\n  color: var\(--acid\);/);
  assert.match(css, /\.media-frame-link \{/);
  assert.match(css, /\.work-media-play \{/);
  assert.match(css, /\.work-media-play span \{/);
  assert.match(
    css,
    /\.media-frame-wide \{[\s\S]*?align-self: center;[\s\S]*?aspect-ratio: 16 \/ 9;[\s\S]*?min-height: 0;[\s\S]*?width: 100%;/,
  );
  assert.match(
    css,
    /\.featured-reel-video \{[\s\S]*?object-fit: cover;[\s\S]*?object-position: center;/,
  );
  assert.doesNotMatch(css, /\.media-frame-contain/);
  assert.doesNotMatch(css, /\.work-panel-compact-media/);
  assert.match(css, /\.work-media-play \{[\s\S]*?left: 1rem;[\s\S]*?right: auto;/);
  assert.match(css, /\.media-label-lines span \{[\s\S]*?white-space: nowrap;/);
  assert.match(
    css,
    /@media \(max-width: 820px\) \{[\s\S]*?\.work-media-play \{[\s\S]*?bottom: 0\.75rem;[\s\S]*?left: 0\.75rem;[\s\S]*?right: auto;[\s\S]*?top: auto;/,
  );
  assert.doesNotMatch(css, /\.case-study|\.case-study-item/);
  assert.doesNotMatch(
    css,
    /body::before|light-beam|ambient-canvas|edge-glow-card|edge-light|--edge-proximity|--beam-opacity|sectionReflection|frameReflection|\.section\.is-lit|\.section\.is-guided|\.works-section::after|\.hero-media::before|\.watch-loop-card::before/,
  );
  assert.match(css, /--page-pad: clamp/);
  assert.match(css, /\.watch-loop-card \{/);
  assert.doesNotMatch(css, /\.watch-loop-video \{/);
  assert.match(css, /\.featured-reel-video \{/);
  assert.match(css, /\.featured-reel-video \{[\s\S]*?pointer-events: none;/);
  assert.match(
    css,
    /\.featured-reel-video \{[\s\S]*?opacity: 0;[\s\S]*?transition: opacity 260ms ease;/,
  );
  assert.match(
    css,
    /\.featured-reel-video\.is-playing \{[\s\S]*?opacity: 1;/,
  );
  assert.match(
    css,
    /\.featured-reel-video::?-webkit-media-controls \{[\s\S]*?display: none !important;/,
  );
  assert.match(css, /\.watch-loop-scrim \{/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.featured-reel-video \{[\s\S]*?display: none;/);
  assert.match(css, /\.watch-loop-card-plain \{/);
  assert.match(css, /\.watch-loop-card-plain \{[\s\S]*?background: transparent;/);
  assert.doesNotMatch(css, /\.watch-loop-viewport::before/);
  assert.doesNotMatch(css, /\.watch-loop-viewport::after/);
  assert.match(css, /\.watch-loop-frame \{[\s\S]*?position: relative;/);
  assert.match(css, /\.watch-loop-frame::before,/);
  assert.match(css, /\.watch-loop-frame::after \{/);
  assert.match(css, /\.watch-loop-frame::before \{[\s\S]*?linear-gradient\(90deg, var\(--bg\), transparent\)/);
  assert.match(css, /\.watch-loop-frame::after \{[\s\S]*?linear-gradient\(270deg, var\(--bg\), transparent\)/);
  assert.match(css, /@media \(max-width: 820px\) \{[\s\S]*\.nav-links > a:not\(\.language-switch\):not\(\.nav-contact\)/);
  assert.doesNotMatch(css, /@media \(max-width: 820px\) \{[\s\S]*\.nav-links > a:not\(\.language-switch\) \{\n    display: none;/);
  assert.doesNotMatch(js, /getEdgeProximity|initAmbientBackground|lightState|beamOpacity|is-guided|is-lit|edge-glow-card/);
  assert.match(js, /scrollRestoration = "manual"/);
  assert.match(js, /clearInitialHash/);
  assert.match(js, /replaceState/);
  assert.match(js, /data-watch-loop/);
  assert.doesNotMatch(js, /data-watch-loop-video/);
  assert.match(js, /data-featured-reel-video/);
  assert.doesNotMatch(js, /WATCH_LOOP_REEL_HOLD_MS|watchLoopVideoTimers/);
  assert.match(js, /const FEATURED_REEL_DESKTOP_HOLD_MS = 1400;/);
  assert.match(js, /const FEATURED_REEL_MOBILE_HOLD_MS = 700;/);
  assert.match(js, /const featuredReelMobileMedia = window\.matchMedia\("\(max-width: 820px\)"\);/);
  assert.match(js, /const visibleFeaturedReels = new Set\(\);/);
  assert.match(js, /const featuredReelTimers = new Map\(\);/);
  assert.match(js, /const featuredReelActivationGenerations = new WeakMap\(\);/);
  assert.match(js, /const featuredReelPlayGenerations = new WeakMap\(\);/);
  assert.match(js, /let activeFeaturedReel = null;/);
  assert.match(js, /function clearFeaturedReelTimer\(video\)/);
  assert.match(
    js,
    /setTimeout\(\(\) => \{[\s\S]*?playFeaturedReel\(video, generation\);[\s\S]*?\}, getFeaturedReelHoldMs\(\)\)/,
  );
  assert.match(js, /featuredReelMobileMedia\.matches[\s\S]*?selectClosestVisibleReel[\s\S]*?featuredReelVideos\.filter[\s\S]*?\.at\(-1\)/);
  assert.match(js, /function handleFeaturedReelViewportChange\(\)[\s\S]*?window\.requestAnimationFrame[\s\S]*?syncActiveFeaturedReel\(\)/);
  assert.match(js, /window\.addEventListener\("scroll", handleFeaturedReelViewportChange, \{ passive: true \}\)/);
  assert.match(js, /featuredReelMobileMedia\.addEventListener\?\.\("change", handleFeaturedReelModeChange\)/);
  assert.match(js, /video === activeFeaturedReel[\s\S]*?scheduleFeaturedReel\(video\)[\s\S]*?resetFeaturedReel\(video\)/);
  assert.match(
    js,
    /function resetFeaturedReel\(video\) \{[\s\S]*?clearFeaturedReelTimer\(video\);/,
  );
  assert.match(js, /video\.currentTime = 0;/);
  assert.match(js, /video\.classList\.add\("is-playing"\)/);
  assert.match(js, /video\.classList\.remove\("is-playing"\)/);
  assert.match(js, /video\.addEventListener\("playing"/);
  assert.match(
    js,
    /function playFeaturedReel\(video, generation\) \{[\s\S]*?isCurrentFeaturedReelActivation\(video, generation\)/,
  );
  assert.match(js, /function handleFeaturedReelPageShow\(event\)[\s\S]*?event\.persisted[\s\S]*?bindFeaturedReelLifecycle\(\)/);
  assert.match(js, /\{ rootMargin: "0px", threshold: 0\.01 \}/);
  assert.doesNotMatch(js, /rootMargin: "20% 0px"/);
  assert.match(js, /function consumeNativeScroll\(\)/);
  assert.match(js, /const nativeOffset = viewport\.scrollLeft;/);
  assert.match(js, /offset = \(offset \+ nativeOffset\) % sequenceWidth;/);
  assert.match(js, /viewport\.scrollLeft = 0;/);
  assert.match(
    js,
    /viewport\.addEventListener\("scroll", consumeNativeScroll, \{ passive: true \}\)/,
  );
  assert.match(js, /video\.play\(\)\.catch/);
  assert.match(js, /video\.pause\(\)/);
  assert.match(js, /visibilitychange/);
  assert.match(js, /threshold: \[0, 0\.35\]/);
  assert.match(js, /syncLoopCopies/);
  assert.match(js, /offset %= sequenceWidth/);
  assert.match(js, /startLoop/);
  assert.match(js, /pointerdown/);
  assert.match(css, /@media \(max-width: 460px\) \{\n  \.hero h1 \{\n    font-size: clamp\(2\.65rem, 14vw, 3\.45rem\);/);
  assert.match(css, /@media \(max-width: 460px\) \{[\s\S]*?\.contact h2 \{[^}]*font-size: clamp\(2\.25rem, 11vw, 3\.2rem\);[^}]*max-width: none;[^}]*\}/);
});
