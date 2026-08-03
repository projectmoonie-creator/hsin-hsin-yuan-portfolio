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
  assert.equal(works[3].tagline.en, "How design becomes part of everyday life.");
  assert.equal(
    works[3].description.en,
    "Films about residential design and brand collaborations, following how homes are planned, renovated, and lived in—from a designer’s choices to the routines that fill the finished space.",
  );
  assert.equal(works[3].title.zh, "幸福空間與室內設計影像");
  assert.equal(
    works[3].description.zh,
    "我為住宅設計、老屋翻新、設計師作品、居家品牌與廚電業配內容擔任導演 / 剪輯。",
  );
  assert.equal(
    works[3].featuredReelUrl,
    "/assets/showreel/interior-spatial-card-reel.mp4",
  );
  assert.equal(works[3].featuredReelMode, "in-view");
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
  assert.equal(works[3].watchMode, "series");
  assert.equal(works[3].showWatchCta, true);
  assert.equal(
    works[3].watchUrl,
    "https://www.youtube.com/playlist?list=PLJCU8axtQoPI",
  );
  assert.equal(works[4].platform, "PTS Taigi");
  assert.equal(works[4].year, "2021");
  assert.equal(works[4].title.en, "Nothing by Bus");
  assert.equal(works[4].tagline.en, "Taiwan, one bus route at a time.");
  assert.equal(
    works[4].description.en,
    "A Taiwanese-language travel series following local buses off the main road and into the food, work, and daily life of each stop.",
  );
  assert.equal(
    works[4].description.zh,
    "公視台語台行腳節目的單集企劃 / 企編工作，節目以公車路線串起地方記憶、飲食、市集與路上的人。",
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
  assert.equal(works[4].featuredReelMode, "in-view");
  assert.equal(works[4].featuredMediaAspect, "16:9");
  assert.equal(
    works[4].featuredReelPoster,
    works[4].posterImage,
  );
  assert.equal(works[5].role.en, "Director");
  assert.equal(works[5].platform, "China Dragon TV");
  assert.deepEqual(works[5].mediaTitleLines, ["Top Gear China", "UK Special"]);
  assert.equal(works[5].tagline.en, "A world-renowned car show, reimagined for China.");
  assert.equal(
    works[5].description.en,
    "For the UK Special, the Chinese production travelled to Britain to work with the original Top Gear team on a cross-border factual-entertainment shoot.",
  );
  assert.equal(
    works[5].description.zh,
    "擔任《巔峰拍檔》中國版第二季第五期英國篇導演，負責英國拍攝內容，協調播出端、中國製作端與英國原版 Top Gear 團隊之間的製作需求。",
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
  assert.deepEqual(techOfficialEntry.type, { en: "Official page", zh: "官方節目頁" });
  assert.deepEqual(techOfficialEntry.title, { en: "Official program page", zh: "官方節目頁" });
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
    /<h2 class="contact-title"><span class="contact-title-line">一起把故事<\/span><span class="contact-title-line"><span class="contact-title-accent">做出來。<\/span><\/span><\/h2>/,
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
    /<article class="work-panel work-panel-wide-media" id="pts-taigi-bus">[\s\S]*?class="media-frame media-frame-wide media-frame-link"[\s\S]*?data-featured-reel-video[\s\S]*?src="\/assets\/showreel\/nothing-by-bus-card-reel\.mp4"/,
  );
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

test("website visual reel closes on the same focused contact invitation as the page", () => {
  const reelSource = readFileSync(
    join(root, "showreel/website-visual-reel/index.html"),
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
  assert.ok(
    existsSync(join(root, "public/assets/showreel/website-visual-reel.mp4")),
  );
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

test("global press notes preserve audited Women Make Waves source metadata", () => {
  const site = loadSiteData(root);

  assert.equal(site.press.length, 2);
  assert.deepEqual(
    site.press.map((item) => item.id),
    [
      "wmw-28-selection-guide-part-1",
      "wmw-28-selection-guide-part-2",
    ],
  );
  assert.equal(
    site.press[0].canonicalUrl,
    "https://www.facebook.com/watch/?v=257310076279164",
  );
  assert.equal(
    site.press[1].canonicalUrl,
    "https://www.facebook.com/watch/?v=412888580196820",
  );
  assert.equal(site.press[0].sourcePageUrl, "https://www.wmw.org.tw/tw/title/733");
  assert.equal(site.press[1].sourcePageUrl, "https://www.wmw.org.tw/tw/title/734");
  assert.equal(site.press[0].participationStatus, "verified-speaker");
  assert.equal(site.press[1].participationStatus, "companion-event-archive");
  for (const item of site.press) {
    assert.match(item.canonicalUrl, /^https:\/\//);
    assert.match(item.sourcePageUrl, /^https:\/\//);
    assert.equal(item.titleSource, "official Women Make Waves event record");
    assert.equal(item.imageSource, "none; Facebook returned generic Watch metadata");
    assert.equal(item.metadataCheckedAt, "2026-08-03");
    assert.equal("image" in item, false);
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
  assert.match(pressSection, /Press &amp; Conversations/);
  assert.match(pressSection, /28th Women Make Waves Film Festival Selection Guide/);
  assert.match(pressSection, /PART 1/);
  assert.match(pressSection, /Featuring Hsin-Hsin Yuan/);
  assert.match(pressSection, /Companion event archive/);
  assert.match(
    pressSection,
    /href="https:\/\/www\.facebook\.com\/watch\/\?v=257310076279164"[^>]*data-metadata-checked-at="2026-08-03"/,
  );
  assert.match(zh, /訪談與對談/);
  assert.match(zh, /第 28 屆女性影展選片指南/);
  assert.match(zh, /袁欣欣參與對談/);
  assert.match(zh, /同場活動紀錄/);
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
    ["/Us", "ers/"].join(""),
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
    "Gui Shou Shen Che",
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
  assert.equal((archiveMarkup.match(/<a class="archive-card"/g) || []).length, 1);
  assert.equal((archiveMarkup.match(/<article class="archive-card/g) || []).length, 4);
  assert.match(archiveMarkup, /archive-card-copy/);
  assert.match(archiveMarkup, /archive-card-media archive-card-media-placeholder/);
  assert.match(archiveMarkup, /class="archive-card-index" aria-hidden="true">01/);
  assert.match(archiveMarkup, /class="archive-card-index" aria-hidden="true">02/);
  assert.match(archiveMarkup, /data-archive-reel-video/);
  assert.doesNotMatch(
    archiveMarkup,
    /archive-media-card|archive-media-card-lead|archive-item|archive-media-summary|mini-metrics/,
  );
  assert.doesNotMatch(archiveMarkup, /200M|250M|NT\$6M|600K|66%/);
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

test("Overclocking archive data uses the approved local poster and reel", () => {
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
  assert.equal(overclocking.posterSourceTimecode, "00:29:46");
  assert.match(overclocking.imageAlt.en, /green water-bike frame and chain drive/i);
  assert.match(overclocking.imageAlt.zh, /綠色水上腳踏車車架與鏈條傳動/);
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

  assert.match(
    html,
    /<a class="archive-card"[^>]*>[\s\S]*?data-archive-reel-video[\s\S]*?data-archive-reel-mode="after-hold"[\s\S]*?poster="\/assets\/showreel\/overclocking-card-reel-poster\.webp"[\s\S]*?<source src="\/assets\/showreel\/overclocking-card-reel\.mp4" type="video\/mp4">[\s\S]*?<\/a>/,
  );
  assert.match(html, /data-archive-reel-video[\s\S]*?preload="none"/);
  assert.doesNotMatch(html, /archive-media-card-lead/);
  assert.doesNotMatch(html, /india-overclocking-production/i);

  const staticSite = structuredClone(site);
  const staticOverclocking = staticSite.archive.find(
    (item) => item.slug === "overclocking",
  );
  delete staticOverclocking.cardReelMode;
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

  assert.match(html, /for artists, culture, and technology stories/i);
  assert.match(html, /<span>HSIN-HSIN<\/span><span>YUAN<\/span>/);
  assert.match(html, /Documentary Director <span class="role-slash">\/<\/span> Writer <span class="role-slash">\/<\/span> Producer/);
  assert.match(html, /<span><span class="role-slash">\/<\/span> Cross-Cultural Storyteller<\/span>/);
  assert.doesNotMatch(html, /<div class="hero-roles">.*AI-Language Creative.*<\/div>/s);
  assert.match(html, /<div class="hero-media" id="showreel">/);
  assert.doesNotMatch(html, /light-beam-layer|light-beam-right|ambient-canvas/);
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
  assert.match(html, /I can enter a project early as a story partner/);
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
  assert.doesNotMatch(html, /\/assets\/logos\/taiwanplus.svg/);
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
    /<video[\s\S]*?muted[\s\S]*?loop[\s\S]*?playsinline[\s\S]*?preload="metadata"/,
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
    /class="media-frame media-frame-link"[\s\S]*?href="https:\/\/www\.taiwanplus\.com\/shows\/documentary\/business-and-tech\/590\/tech-dreamers"[\s\S]*?aria-label="Play video: Tech Dreamers"[\s\S]*?background-image:[\s\S]*?224be7ed-057b-400f-af63-a8582cd80cfb\.webp/,
  );
  assert.match(
    html,
    /class="media-frame media-frame-link"[\s\S]*?href="https:\/\/www\.taiwanplus\.com\/shows\/documentary\/arts\/410\/my-art-my-voice\/250220001\/whats-the-vibe-in-taiwan-my-art-my-voice"[\s\S]*?aria-label="Play video: My Art, My Voice"/,
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
  assert.match(html, /Selected reel/);
  assert.doesNotMatch(html, /3 yrs/);
  assert.doesNotMatch(html, /Interior Design &amp; Branded Films[\s\S]*?Coming 2026/);
  assert.match(html, /Nothing by Bus/);
  assert.match(html, /Gui Shou Shen Che/);
  assert.doesNotMatch(html, /final public release materials are still being reconstructed/);
  assert.match(html, /Planning \/ Script/);
  assert.match(html, /Top Gear China: UK Special/);
  assert.match(html, /China Dragon TV/);
  assert.match(html, /Director/);
  assert.doesNotMatch(html, /China-side Director/);
  assert.doesNotMatch(html, /Oriental Satellite TV/);
  assert.match(
    html,
    /<div class="media-label media-label-lines"><span>Top Gear China<\/span><span>UK Special<\/span><\/div>/,
  );
  assert.doesNotMatch(html, /<span>Top Gear<\/span><span>China: UK<\/span><span>Special<\/span>/);
  assert.doesNotMatch(html, />car show</i);
  assert.doesNotMatch(html, />broadcast</i);
  assert.doesNotMatch(html, />UK production</i);
  assert.match(html, />factual entertainment</i);
  assert.match(html, /200M/);
  assert.match(html, /previous series average/);
  assert.match(html, /0\.81/);
  assert.match(html, /href="#top-gear-china-uk-special"/);
  assert.match(html, /href="#pts-taigi-bus"/);
  assert.match(html, /href="#interior-spatial-brand-films"/);
  assert.match(html, /https:\/\/youtu\.be\/M_eXe9HRD9Y\?si=YZ_3JZ7FJY4vVcZv/);
  assert.equal((html.match(/>Watch the full series<\/a>/g) || []).length, 2);
  assert.equal((html.match(/<a class="button-link"/g) || []).length, 2);
  assert.match(
    html,
    /href="https:\/\/www\.youtube\.com\/playlist\?list=PLJCU8axtQoPI"[\s\S]*?>Watch the full series<\/a>/,
  );
  assert.match(
    html,
    /href="https:\/\/www\.youtube\.com\/playlist\?list=PLfuPqJAlXvCs"[\s\S]*?>Watch the full series<\/a>/,
  );
  assert.doesNotMatch(html, /Watch the full episode/);
  assert.doesNotMatch(html, />Watch the series<\/a>/);
  assert.doesNotMatch(html, /Watch representative segment/);
  assert.match(html, /Press &amp; Interviews/);
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
  assert.match(html, /17472124753d\.png/);
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
    /<a class="press-preview-card" href="https:\/\/www\.taiwanplus\.com\/shows\/documentary\/business-and-tech\/590\/tech-dreamers"[^>]*>[\s\S]*?官方節目頁[\s\S]*?<\/a>/,
  )?.[0];

  assert.ok(techPanel);
  assert.ok(techOfficialCard);
  assert.ok(techPanelZh);
  assert.ok(techOfficialCardZh);
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

test("English Figma handoff uses the localized Gorgeous Space label", () => {
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

  for (const artifact of [desktopHome, desktopWorks, figmaImporter]) {
    assert.match(artifact, /Gorgeous Space/);
    assert.doesNotMatch(artifact, /幸福空間|\[object Object\]/i);
  }
});

test("build generates English, Chinese, CSS, and JS assets", () => {
  execFileSync("node", ["scripts/build-site.mjs"], { cwd: root, stdio: "pipe" });

  assert.equal(existsSync(join(root, "dist/en/index.html")), true);
  assert.equal(existsSync(join(root, "dist/zh/index.html")), true);
  assert.equal(existsSync(join(root, "dist/styles.css")), true);
  assert.equal(existsSync(join(root, "dist/main.js")), true);
  assert.equal(existsSync(join(root, "dist/ambient-background.js")), false);
  assert.equal(existsSync(join(root, "dist/robots.txt")), true);
  assert.equal(existsSync(join(root, "dist/sitemap.xml")), true);
  assert.equal(existsSync(join(root, "dist/vendor/anime.esm.min.js")), false);
  assert.equal(existsSync(join(root, "dist/vendor/ogl/src/index.js")), false);
  assert.equal(existsSync(join(root, "dist/assets/showreel/website-visual-reel.mp4")), true);
  assert.equal(existsSync(join(root, "dist/assets/showreel/website-visual-reel-poster.png")), true);
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
  assert.match(zh, /觀看 showreel/);
  assert.match(zh, /精選短片/);
  assert.doesNotMatch(zh, /data-about-tabs/);
  assert.match(zh, /可合作項目/);
  assert.doesNotMatch(zh, /<h2 class="section-title">關於我<\/h2>/);
  assert.doesNotMatch(zh, /合作方式/);
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
  assert.match(zh, /FROM THE ARCHIVE/);
  assert.match(zh, /觀看公開節目/);
  assert.match(zh, /觀看官方預告/);
  assert.match(zh, /觀看官方宣傳片/);
  assert.match(zh, /<h2 class="contact-title"><span class="contact-title-line">一起把故事<\/span><span class="contact-title-line"><span class="contact-title-accent">做出來。<\/span><\/span><\/h2>/);
  assert.doesNotMatch(zh, /觀看完整單集/);
  assert.equal((zh.match(/>觀看完整系列<\/a>/g) || []).length, 2);
  assert.match(zh, /href="https:\/\/www\.youtube\.com\/playlist\?list=PLJCU8axtQoPI"/);
  assert.match(zh, /href="https:\/\/www\.youtube\.com\/playlist\?list=PLfuPqJAlXvCs"/);
  assert.doesNotMatch(zh, /觀看代表片段/);
  assert.match(zh, /幸福空間與室內設計影像/);
  assert.match(zh, /導演 \/ 剪輯/);
  assert.doesNotMatch(zh, /3 yrs|三年間|約三年/);
  assert.match(zh, /無事坐巴士/);
  assert.match(zh, /企劃 \/ 企編/);
  assert.match(zh, /《巔峰拍檔》中國版：英國篇/);
  assert.match(zh, /China Dragon TV/);
  assert.match(zh, /汽車節目與紀實娛樂/);
  assert.doesNotMatch(zh, /中方導演/);
  assert.match(zh, /同時段綜藝類冠軍/);
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
  assert.match(css, /url\(\"\/assets\/portfolio\/hsin-working-white-space\.jpg\"\)/);
  assert.match(css, /\.hero-play-button \{/);
  assert.match(css, /\.hero-showreel-video \{/);
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
  assert.match(css, /\.brand-mobile \{\n  display: none;/);
  assert.match(css, /@media \(max-width: 820px\) \{[\s\S]*\.brand-desktop \{[\s\S]*display: none;[\s\S]*\.brand-mobile \{[\s\S]*display: inline;/);
  assert.doesNotMatch(css, /showreel-modal/);
  assert.match(css, /\.collab-grid \{\n  align-items: center;\n  display: flex;/);
  assert.match(css, /\.collab-item \{\n  align-items: center;\n  background: transparent;\n  border: 0;/);
  assert.match(css, /\.partner-name \{\n  display: none;/);
  assert.match(css, /\.hero h1 span \{\n  display: block;\n  white-space: nowrap;/);
  assert.match(css, /@keyframes heroStillPush/);
  assert.match(css, /\.hero-media \{\n    animation: heroStillPush/);
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
  assert.match(js, /const visibleFeaturedReels = new Set\(\);/);
  assert.match(js, /const activeFeaturedReel = visibleFeaturedReels\.size[\s\S]*?featuredReelVideos\.filter[\s\S]*?\.at\(-1\)/);
  assert.match(js, /video === activeFeaturedReel[\s\S]*?playFeaturedReel\(video\)[\s\S]*?resetFeaturedReel\(video\)/);
  assert.match(js, /video\.currentTime = 0;/);
  assert.match(js, /video\.classList\.add\("is-playing"\)/);
  assert.match(js, /video\.classList\.remove\("is-playing"\)/);
  assert.match(js, /video\.addEventListener\("playing"/);
  assert.match(
    js,
    /function playFeaturedReel\(video\) \{[\s\S]*?if \(document\.visibilityState !== "visible"\) \{[\s\S]*?resetFeaturedReel\(video\);/,
  );
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
