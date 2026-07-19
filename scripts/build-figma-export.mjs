import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { validateWorkMediaContract } from "./media-manifest.mjs";

const root = process.cwd();
const outDir = join(root, "figma-export");
const pluginDir = join(root, "figma/hsin-portfolio-importer");
const siteUrl = "https://hsin-hsin-yuan-portfolio.vercel.app";

const tokens = {
  stage: "#050807",
  fog: "#dddcd7",
  paper: "#f6f4ee",
  coral: "#f0645a",
  cobalt: "#4867d9",
  moss: "#4d9259",
};

const sectionOrder = [
  "hero",
  "collaborations",
  "watchLoop",
  "availability",
  "selectedWorks",
  "collaborationFit",
  "archive",
  "contact",
];

function readJson(path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

function parseFrontmatter(path) {
  const raw = readFileSync(join(root, path), "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error(`Missing JSON frontmatter in ${path}`);
  return JSON.parse(match[1]);
}

function loadMarkdownCollection(directory) {
  return readdirSync(join(root, directory))
    .filter((name) => name.endsWith(".md"))
    .map((name) => parseFrontmatter(`${directory}/${name}`))
    .sort((a, b) => a.order - b.order);
}

function canonicalSourceFingerprint() {
  const paths = [
    "data/site.json",
    "data/media.json",
    "data/collaborations.json",
    ...readdirSync(join(root, "content/works")).filter((name) => name.endsWith(".md")).sort().map((name) => `content/works/${name}`),
    ...readdirSync(join(root, "content/archive")).filter((name) => name.endsWith(".md")).sort().map((name) => `content/archive/${name}`),
  ];
  const hash = createHash("sha256");
  for (const path of paths) {
    hash.update(path);
    hash.update("\0");
    hash.update(readFileSync(join(root, path)));
    hash.update("\0");
  }
  return `sha256:${hash.digest("hex")}`;
}

function localized(value, lang, fallback = "") {
  if (typeof value === "string") return value;
  return value?.[lang] || value?.en || fallback;
}

function normalizeMedia(work, lang = "en") {
  if (!work.posterImage) {
    return {
      status: work.slug === "slow-steps" ? "text-first" : "open-role",
      src: "",
      alt: "",
      focalPoint: work.focalPoint || "50% 50%",
      mobileFocalPoint: work.mobileFocalPoint || work.focalPoint || "50% 50%",
      dimensions: work.posterDimensions || null,
      remote: false,
    };
  }
  return {
    status: "approved",
    src: work.posterImage,
    alt: localized(work.posterAlt, lang, localized(work.title, lang)),
    focalPoint: work.focalPoint || "50% 50%",
    mobileFocalPoint: work.mobileFocalPoint || work.focalPoint || "50% 50%",
    dimensions: work.posterDimensions || null,
    remote: /^https?:\/\//.test(work.posterImage),
  };
}

function normalizeSupportingMedia(image, lang = "en") {
  return {
    status: "approved",
    src: image.src,
    alt: localized(image.alt, lang),
    focalPoint: image.focalPoint || "50% 50%",
    mobileFocalPoint: image.mobileFocalPoint || image.focalPoint || "50% 50%",
    dimensions: image.dimensions || null,
    remote: /^https?:\/\//.test(image.src),
  };
}

function normalizeWork(work) {
  return {
    slug: work.slug,
    order: work.order,
    year: work.year,
    title: work.title,
    role: work.role,
    platform: work.platform,
    tagline: work.tagline,
    description: work.description,
    watchUrl: work.watchUrl || "",
    media: normalizeMedia(work),
    supportingMedia: (work.supportingImages || []).map((image) => normalizeSupportingMedia(image)),
    tags: work.tags || [],
    metrics: work.metrics || [],
  };
}

function normalizeContent(copy, lang) {
  const defaults = lang === "zh"
    ? {
        watch: "觀看作品",
        works: "精選作品",
        fit: "合作方向",
        collaborations: "合作與平台",
        contact: "聯絡",
      }
    : {
        watch: "Watch selected work",
        works: "Selected Works",
        fit: "Collaboration Fit",
        collaborations: "Platforms & Collaborations",
        contact: "Contact",
      };
  const roles = copy.heroRoles || [];
  return {
    name: copy.name,
    roles,
    statement: [copy.portraitStatement, copy.portraitAccent].filter(Boolean).join(" "),
    showreelTitle: copy.showreelTitle,
    showreelCta: copy.showreelCta,
    collaborationsTitle: copy.collabTitle || defaults.collaborations,
    watchTitle: copy.watchLabel || defaults.watch,
    watchLoopAria: copy.watchLoopAria || defaults.watch,
    availabilityLabel: copy.availabilityLabel,
    availabilityIntro: copy.availabilityIntro,
    availability: copy.availability || [],
    worksTitle: copy.workTheatreTitle || defaults.works,
    fitTitle: copy.createTitle || defaults.fit,
    fitCopy: copy.createSubcopy || "",
    archiveTitle: copy.archiveTitle,
    archiveCopy: copy.archiveSubcopy,
    contactLabel: defaults.contact,
    contactTitle: copy.contactTitle,
    contactCopy: copy.contactSubcopy,
    contactCta: copy.contactCta,
  };
}

function buildModel() {
  const site = readJson("data/site.json");
  const media = readJson("data/media.json");
  const collaborations = readJson("data/collaborations.json");
  const canonicalWorks = loadMarkdownCollection("content/works").filter((work) => work.featured);
  validateWorkMediaContract(canonicalWorks);
  const works = canonicalWorks
    .map(normalizeWork);
  const archive = loadMarkdownCollection("content/archive").map((item) => ({
    slug: item.slug,
    order: item.order,
    year: item.year,
    title: item.title,
    role: item.role,
    platform: item.platform,
    description: item.description,
    metrics: item.metrics || [],
  }));
  const watchPreviews = works.filter((work) => work.watchUrl || work.slug === "slow-steps");

  if (works.length !== 6) throw new Error(`Expected six featured works, found ${works.length}`);
  if (watchPreviews.length !== 5) throw new Error(`Expected five watch previews, found ${watchPreviews.length}`);

  return {
    design: "editorial-watch-loop-hybrid",
    sourceFingerprint: canonicalSourceFingerprint(),
    siteUrl,
    tokens,
    typography: {
      sans: "Helvetica Neue, Arial, sans-serif",
      editorial: "Iowan Old Style, Baskerville, Times New Roman, serif",
    },
    sectionOrder,
    content: {
      en: normalizeContent(site.en, "en"),
      zh: normalizeContent(site.zh, "zh"),
    },
    media: {
      hero: {
        status: "approved",
        src: media.hero.poster,
        video: media.hero.video,
        alt: media.hero.alt,
        focalPoint: media.hero.desktopFocalPoint,
        mobileFocalPoint: media.hero.mobileFocalPoint,
        dimensions: media.hero.dimensions,
        remote: /^https?:\/\//.test(media.hero.poster),
      },
    },
    collaborations,
    watchPreviews,
    works,
    archive,
  };
}

function escapeXml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function textLines(value, maxChars) {
  const words = String(value || "").trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (line && next.length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function textBlock({ id, x, y, value, maxChars = 54, size = 20, lineHeight, fill = tokens.stage, family = "sans", weight = 400, limit = 5 }) {
  const lh = lineHeight || Math.round(size * 1.35);
  const lines = textLines(value, maxChars).slice(0, limit);
  const fontFamily = family === "editorial" ? "Iowan Old Style, Baskerville, Times New Roman, serif" : "Helvetica Neue, Arial, sans-serif";
  const spans = lines.map((line, index) => `<tspan x="${x}" dy="${index ? lh : 0}">${escapeXml(line)}</tspan>`).join("");
  return `<text id="${id}" x="${x}" y="${y}" fill="${fill}" font-family="${fontFamily}" font-size="${size}" font-weight="${weight}">${spans}</text>`;
}

function imageLayer({ id, media, x, y, width, height, radius = 22, showLabel = true }) {
  const status = media?.status || "open-role";
  const label = status === "text-first" ? "TEXT-FIRST / APPROVED NO POSTER" : "MEDIA ROLE OPEN / DATA-ONLY REPLACEMENT";
  if (!media?.src) {
    return `<g id="${id}" data-media-status="${status}" data-focal-point="${escapeXml(media?.focalPoint || "50% 50%")}">
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${tokens.fog}" stroke="${tokens.stage}" stroke-opacity="0.24"/>
      <line x1="${x + 24}" y1="${y + 24}" x2="${x + width - 24}" y2="${y + height - 24}" stroke="${tokens.coral}" stroke-width="2"/>
      <text x="${x + 24}" y="${y + height - 24}" fill="${tokens.stage}" font-family="Helvetica Neue, Arial, sans-serif" font-size="12" font-weight="600">${label}</text>
    </g>`;
  }
  const href = media.remote ? media.src : `${siteUrl}${media.src}`;
  const sourceType = media.remote ? "remote-reference" : "local-production-reference";
  return `<g id="${id}" data-media-status="approved" data-source-type="${sourceType}" data-src="${escapeXml(media.src)}" data-focal-point="${escapeXml(media.focalPoint || "50% 50%")}">
    <defs><clipPath id="clip-${id}"><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}"/></clipPath></defs>
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${tokens.fog}" stroke="${tokens.stage}" stroke-opacity="0.24"/>
    <image href="${escapeXml(href)}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip-${id})"/>
${showLabel ? `    <text x="${x + 18}" y="${y + height - 18}" fill="${tokens.paper}" font-family="Helvetica Neue, Arial, sans-serif" font-size="10" font-weight="600">${escapeXml(media.remote ? `REMOTE REF · ${media.src}` : media.src)}</text>\n` : ""}  </g>`;
}

function sectionLabel(value, x, y, color = tokens.coral) {
  return `<g><line x1="${x}" y1="${y - 5}" x2="${x + 34}" y2="${y - 5}" stroke="${color}" stroke-width="3"/><text x="${x + 48}" y="${y}" fill="${tokens.stage}" font-family="Helvetica Neue, Arial, sans-serif" font-size="13" font-weight="600">${escapeXml(value)}</text></g>`;
}

function renderWatchPreview(work, index, { x, y, width, height, mobile = false }) {
  const mediaHeight = Math.round(height * 0.62);
  const media = mobile ? { ...work.media, focalPoint: work.media.mobileFocalPoint } : work.media;
  return `<g id="watch-preview-${work.slug}" data-anchor="#work-${work.slug}">
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="22" fill="${tokens.paper}" stroke="${tokens.fog}"/>
    ${imageLayer({ id: `watch-media-${work.slug}`, media, x: x + 12, y: y + 12, width: width - 24, height: mediaHeight, radius: 14 })}
    <text x="${x + 20}" y="${y + mediaHeight + 48}" fill="${tokens.coral}" font-family="Helvetica Neue, Arial, sans-serif" font-size="12" font-weight="600">0${index + 1} · ${escapeXml(work.year)}</text>
    ${textBlock({ id: `watch-title-${work.slug}`, x: x + 20, y: y + mediaHeight + 84, value: work.title.en, maxChars: 26, size: 26, lineHeight: 30, weight: 500, limit: 2 })}
  </g>`;
}

function renderSupportingMedia(work, { x, y, mobile }) {
  if (!work.supportingMedia.length) return "";
  const width = mobile ? 144 : 150;
  const height = mobile ? 78 : 90;
  const gap = mobile ? 154 : 162;
  return `<g id="supporting-media-${work.slug}" data-role="supporting-media">${work.supportingMedia.map((media, index) => imageLayer({
    id: `supporting-media-${work.slug}-${index + 1}`,
    media: mobile ? { ...media, focalPoint: media.mobileFocalPoint } : media,
    x: x + index * gap,
    y,
    width,
    height,
    radius: 12,
    showLabel: false,
  })).join("")}</g>`;
}

function renderWorkRow(work, index, { x, y, width, mobile = false }) {
  const signal = [tokens.coral, tokens.cobalt, tokens.moss][index % 3];
  if (mobile) {
    return `<g id="work-row-${work.slug}" data-anchor="work-${work.slug}" data-title="${escapeXml(work.title.en)}">
      <line x1="${x}" y1="${y}" x2="${x + width}" y2="${y}" stroke="${tokens.stage}" stroke-opacity="0.22"/>
      <rect x="${x}" y="${y + 30}" width="28" height="5" rx="2.5" fill="${signal}"/>
      <text x="${x}" y="${y + 76}" fill="${tokens.stage}" font-family="Helvetica Neue, Arial, sans-serif" font-size="12" font-weight="600">0${index + 1} · ${escapeXml(work.year)} · ${escapeXml(localized(work.role, "en"))}</text>
      ${textBlock({ id: `work-title-${work.slug}`, x, y: y + 128, value: work.title.en, maxChars: 25, size: 38, lineHeight: 42, weight: 400, limit: 3 })}
      ${textBlock({ id: `work-description-${work.slug}`, x, y: y + 226, value: work.description.en, maxChars: 40, size: 17, lineHeight: 25, fill: "#30322f", limit: 4 })}
      ${imageLayer({ id: `work-media-${work.slug}`, media: { ...work.media, focalPoint: work.media.mobileFocalPoint }, x, y: y + 340, width, height: 248, radius: 18 })}
      ${renderSupportingMedia(work, { x: x + 12, y: y + 496, mobile: true })}
    </g>`;
  }
  const mediaLeft = index % 2 === 1;
  const mediaX = mediaLeft ? x : x + width - 540;
  const textX = mediaLeft ? x + 610 : x;
  return `<g id="work-row-${work.slug}" data-anchor="work-${work.slug}" data-title="${escapeXml(work.title.en)}">
    <line x1="${x}" y1="${y}" x2="${x + width}" y2="${y}" stroke="${tokens.stage}" stroke-opacity="0.22"/>
    <rect x="${textX}" y="${y + 58}" width="42" height="6" rx="3" fill="${signal}"/>
    <text x="${textX}" y="${y + 112}" fill="${tokens.stage}" font-family="Helvetica Neue, Arial, sans-serif" font-size="13" font-weight="600">0${index + 1} · ${escapeXml(work.year)} · ${escapeXml(localized(work.role, "en"))}</text>
    ${textBlock({ id: `work-title-${work.slug}`, x: textX, y: y + 184, value: work.title.en, maxChars: 28, size: 54, lineHeight: 60, weight: 400, limit: 2 })}
    ${textBlock({ id: `work-description-${work.slug}`, x: textX, y: y + 318, value: work.description.en, maxChars: 48, size: 19, lineHeight: 29, fill: "#30322f", limit: 4 })}
    <text x="${textX}" y="${y + 468}" fill="${signal}" font-family="Iowan Old Style, Baskerville, Times New Roman, serif" font-size="18" font-style="italic">${escapeXml(work.platform)}</text>
    ${imageLayer({ id: `work-media-${work.slug}`, media: work.media, x: mediaX, y: y + 58, width: 540, height: 440, radius: 24 })}
    ${renderSupportingMedia(work, { x: mediaX + 18, y: y + 390, mobile: false })}
  </g>`;
}

function svgFrame({ id, width, height, title, body }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg id="${id}" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${id}-title">
  <title id="${id}-title">${escapeXml(title)}</title>
  <desc>Editable hybrid portfolio design layer generated from canonical site, media, work, collaboration, and archive sources.</desc>
  <rect width="${width}" height="${height}" fill="${tokens.paper}"/>
  <g id="design-tokens" aria-hidden="true" transform="translate(-100 -100)">
    ${Object.entries(tokens).map(([name, value], index) => `<rect id="token-${name}" x="${index * 14}" width="10" height="10" fill="${value}"/>`).join("")}
    <text font-family="Helvetica Neue, Arial, sans-serif">Sans</text><text font-family="Iowan Old Style, Baskerville, Times New Roman, serif">Editorial</text>
  </g>
${body}
</svg>
`;
}

function buildDesktop(model) {
  const copy = model.content.en;
  const heroMedia = { ...model.media.hero, alt: model.media.hero.alt.en };
  const collaborations = model.collaborations.map((item, index) => `<text x="${72 + (index % 4) * 320}" y="${1030 + Math.floor(index / 4) * 62}" fill="${tokens.stage}" font-family="Helvetica Neue, Arial, sans-serif" font-size="22" font-weight="500">${escapeXml(item.label)}</text>`).join("");
  const previews = model.watchPreviews.map((work, index) => renderWatchPreview(work, index, { x: 72 + index * 344, y: 1318, width: 320, height: 360 })).join("");
  const workRows = model.works.map((work, index) => renderWorkRow(work, index, { x: 72, y: 2430 + index * 590, width: 1296 })).join("");
  const archives = model.archive.map((item, index) => `<g id="archive-row-${item.slug}"><line x1="72" y1="${6630 + index * 100}" x2="1368" y2="${6630 + index * 100}" stroke="${tokens.fog}"/><text x="72" y="${6688 + index * 100}" fill="${tokens.paper}" font-family="Helvetica Neue, Arial, sans-serif" font-size="15">${escapeXml(item.year)} · ${escapeXml(localized(item.role, "en"))}</text><text x="470" y="${6688 + index * 100}" fill="${tokens.paper}" font-family="Iowan Old Style, Baskerville, Times New Roman, serif" font-size="28" font-style="italic">${escapeXml(item.title.en)}</text></g>`).join("");

  return svgFrame({
    id: "frame-desktop-home",
    width: 1440,
    height: 8000,
    title: "Desktop / Editorial Watch Loop Hybrid",
    body: `
  <g id="layer-topbar"><rect width="1440" height="88" fill="${tokens.stage}"/><text x="72" y="54" fill="${tokens.paper}" font-family="Helvetica Neue, Arial, sans-serif" font-size="14">${escapeXml(copy.name)}</text><text x="1110" y="54" fill="${tokens.fog}" font-family="Helvetica Neue, Arial, sans-serif" font-size="13">Work · Archive · Contact · 中文</text></g>
  <g id="layer-hero-split" data-statement="${escapeXml(copy.statement)}">
    <rect y="88" width="1440" height="800" fill="${tokens.stage}"/>
    ${imageLayer({ id: "hero-media-role", media: heroMedia, x: 72, y: 146, width: 642, height: 642, radius: 28 })}
    <text x="790" y="244" fill="${tokens.coral}" font-family="Helvetica Neue, Arial, sans-serif" font-size="13" font-weight="600">${escapeXml(copy.roles.join(" · "))}</text>
    ${textBlock({ id: "hero-name", x: 790, y: 374, value: copy.name, maxChars: 16, size: 84, lineHeight: 86, fill: tokens.paper, weight: 400, limit: 2 })}
    ${textBlock({ id: "hero-statement", x: 790, y: 570, value: copy.statement, maxChars: 45, size: 23, lineHeight: 34, fill: tokens.fog, family: "editorial", limit: 5 })}
    <rect x="790" y="730" width="154" height="46" rx="23" fill="none" stroke="${tokens.paper}"/><text x="820" y="759" fill="${tokens.paper}" font-family="Helvetica Neue, Arial, sans-serif" font-size="13">${escapeXml(copy.showreelCta)}</text>
  </g>
  <g id="layer-collaborations"><rect y="888" width="1440" height="250" fill="${tokens.fog}"/>${sectionLabel(copy.collaborationsTitle, 72, 948, tokens.cobalt)}${collaborations}</g>
  <g id="layer-watch-loop" data-motion="calm-auto-loop-desktop"><rect y="1138" width="1440" height="620" fill="${tokens.stage}"/><text x="72" y="1238" fill="${tokens.paper}" font-family="Iowan Old Style, Baskerville, Times New Roman, serif" font-size="54" font-style="italic">${escapeXml(copy.watchTitle)}</text><g aria-label="${escapeXml(copy.watchLoopAria)}">${previews}</g></g>
  <g id="layer-availability"><rect y="1758" width="1440" height="500" fill="${tokens.paper}"/>${sectionLabel(copy.availabilityLabel, 72, 1830, tokens.moss)}${textBlock({ id: "availability-intro", x: 72, y: 1930, value: copy.availabilityIntro, maxChars: 56, size: 34, lineHeight: 44, weight: 400, limit: 4 })}${copy.availability.map((item, index) => `<text x="850" y="${1900 + index * 48}" fill="${tokens.stage}" font-family="Helvetica Neue, Arial, sans-serif" font-size="18">${String(index + 1).padStart(2, "0")} · ${escapeXml(item)}</text>`).join("")}</g>
  <g id="layer-selected-works"><rect y="2258" width="1440" height="3740" fill="${tokens.paper}"/>${sectionLabel(copy.worksTitle, 72, 2330, tokens.coral)}${workRows}</g>
  <g id="layer-collaboration-fit"><rect y="5998" width="1440" height="520" fill="${tokens.fog}"/>${sectionLabel(copy.fitTitle, 72, 6080, tokens.cobalt)}${textBlock({ id: "collaboration-fit-copy", x: 72, y: 6200, value: copy.fitCopy, maxChars: 68, size: 36, lineHeight: 48, family: "editorial", limit: 5 })}</g>
  <g id="layer-archive"><rect y="6518" width="1440" height="560" fill="${tokens.stage}"/><text x="72" y="6600" fill="${tokens.moss}" font-family="Helvetica Neue, Arial, sans-serif" font-size="13" font-weight="600">${escapeXml(copy.archiveTitle)}</text>${archives}</g>
  <g id="layer-contact"><rect y="7078" width="1440" height="922" fill="${tokens.paper}"/>${sectionLabel(copy.contactLabel, 72, 7180, tokens.coral)}${textBlock({ id: "contact-title", x: 72, y: 7340, value: copy.contactTitle, maxChars: 28, size: 76, lineHeight: 82, weight: 400, limit: 3 })}${textBlock({ id: "contact-copy", x: 760, y: 7340, value: copy.contactCopy, maxChars: 50, size: 22, lineHeight: 32, fill: "#30322f", limit: 5 })}<rect x="760" y="7540" width="180" height="52" rx="26" fill="${tokens.stage}"/><text x="794" y="7573" fill="${tokens.paper}" font-family="Helvetica Neue, Arial, sans-serif" font-size="14">${escapeXml(copy.contactCta)}</text></g>`,
  });
}

function buildComponents(model) {
  const previews = model.watchPreviews.map((work, index) => renderWatchPreview(work, index, { x: 54 + index * 276, y: 190, width: 254, height: 320 })).join("");
  const rows = model.works.map((work, index) => renderWorkRow(work, index, { x: 72, y: 720 + index * 590, width: 1296 })).join("");
  return svgFrame({
    id: "frame-desktop-works-logos",
    width: 1440,
    height: 4380,
    title: "Desktop / Watch and Work Components",
    body: `<rect width="1440" height="610" fill="${tokens.stage}"/><text x="54" y="96" fill="${tokens.paper}" font-family="Iowan Old Style, Baskerville, Times New Roman, serif" font-size="48" font-style="italic">Watch Loop · five canonical previews</text><g id="component-watch-loop">${previews}</g><g id="component-selected-work-rows"><text x="72" y="660" fill="${tokens.coral}" font-family="Helvetica Neue, Arial, sans-serif" font-size="14">Selected Works · six editorial rows</text>${rows}</g>`,
  });
}

function buildMobile(model) {
  const copy = model.content.en;
  const heroMedia = { ...model.media.hero, alt: model.media.hero.alt.en, focalPoint: model.media.hero.mobileFocalPoint };
  const logoText = model.collaborations.map((item, index) => `<text x="24" y="${1040 + index * 34}" fill="${tokens.stage}" font-family="Helvetica Neue, Arial, sans-serif" font-size="15">${escapeXml(item.label)}</text>`).join("");
  const previews = model.watchPreviews.map((work, index) => renderWatchPreview(work, index, { x: 24 + index * 278, y: 1440, width: 254, height: 340, mobile: true })).join("");
  const workRows = model.works.map((work, index) => renderWorkRow(work, index, { x: 24, y: 2520 + index * 660, width: 342, mobile: true })).join("");
  const archives = model.archive.map((item, index) => `<g id="archive-row-${item.slug}"><line x1="24" y1="${6900 + index * 115}" x2="366" y2="${6900 + index * 115}" stroke="${tokens.fog}"/><text x="24" y="${6935 + index * 115}" fill="${tokens.moss}" font-family="Helvetica Neue, Arial, sans-serif" font-size="11">${escapeXml(item.year)} · ${escapeXml(localized(item.role, "en"))}</text>${textBlock({ id: `archive-title-${item.slug}`, x: 24, y: 6972 + index * 115, value: item.title.en, maxChars: 30, size: 22, lineHeight: 25, fill: tokens.paper, family: "editorial", limit: 2 })}</g>`).join("");

  return svgFrame({
    id: "frame-mobile-home",
    width: 390,
    height: 8800,
    title: "Mobile / Editorial Watch Loop Hybrid",
    body: `
  <g id="layer-topbar"><rect width="390" height="68" fill="${tokens.stage}"/><text x="24" y="42" fill="${tokens.paper}" font-family="Helvetica Neue, Arial, sans-serif" font-size="12">${escapeXml(copy.name)}</text><text x="340" y="42" fill="${tokens.fog}" font-family="Helvetica Neue, Arial, sans-serif" font-size="12">中</text></g>
  <g id="layer-hero-split" data-statement="${escapeXml(copy.statement)}"><rect y="68" width="390" height="850" fill="${tokens.stage}"/>${imageLayer({ id: "hero-media-role-mobile", media: heroMedia, x: 24, y: 100, width: 342, height: 256, radius: 20 })}<text x="24" y="416" fill="${tokens.coral}" font-family="Helvetica Neue, Arial, sans-serif" font-size="11">${escapeXml(copy.roles.join(" · "))}</text>${textBlock({ id: "hero-name-mobile", x: 24, y: 500, value: copy.name, maxChars: 16, size: 54, lineHeight: 58, fill: tokens.paper, weight: 400, limit: 2 })}${textBlock({ id: "hero-statement-mobile", x: 24, y: 650, value: copy.statement, maxChars: 35, size: 20, lineHeight: 29, fill: tokens.fog, family: "editorial", limit: 6 })}<rect x="24" y="834" width="144" height="42" rx="21" fill="none" stroke="${tokens.paper}"/><text x="50" y="861" fill="${tokens.paper}" font-family="Helvetica Neue, Arial, sans-serif" font-size="12">${escapeXml(copy.showreelCta)}</text></g>
  <g id="layer-collaborations"><rect y="918" width="390" height="380" fill="${tokens.fog}"/>${sectionLabel(copy.collaborationsTitle, 24, 980, tokens.cobalt)}${logoText}</g>
  <g id="layer-watch-loop" data-motion="manual-scroll-only"><rect y="1298" width="390" height="560" fill="${tokens.stage}"/><text x="24" y="1380" fill="${tokens.paper}" font-family="Iowan Old Style, Baskerville, Times New Roman, serif" font-size="40" font-style="italic">${escapeXml(copy.watchTitle)}</text><g aria-label="${escapeXml(copy.watchLoopAria)}" data-overflow="horizontal-clipped-reference">${previews}</g></g>
  <g id="layer-availability"><rect y="1858" width="390" height="540" fill="${tokens.paper}"/>${sectionLabel(copy.availabilityLabel, 24, 1920, tokens.moss)}${textBlock({ id: "availability-intro-mobile", x: 24, y: 2010, value: copy.availabilityIntro, maxChars: 36, size: 24, lineHeight: 32, weight: 400, limit: 6 })}${copy.availability.map((item, index) => `<text x="24" y="${2230 + index * 28}" fill="${tokens.stage}" font-family="Helvetica Neue, Arial, sans-serif" font-size="14">${String(index + 1).padStart(2, "0")} · ${escapeXml(item)}</text>`).join("")}</g>
  <g id="layer-selected-works"><rect y="2398" width="390" height="4050" fill="${tokens.paper}"/>${sectionLabel(copy.worksTitle, 24, 2460, tokens.coral)}${workRows}</g>
  <g id="layer-collaboration-fit"><rect y="6448" width="390" height="390" fill="${tokens.fog}"/>${sectionLabel(copy.fitTitle, 24, 6510, tokens.cobalt)}${textBlock({ id: "collaboration-fit-copy-mobile", x: 24, y: 6600, value: copy.fitCopy, maxChars: 36, size: 24, lineHeight: 32, family: "editorial", limit: 7 })}</g>
  <g id="layer-archive"><rect y="6838" width="390" height="600" fill="${tokens.stage}"/><text x="24" y="6886" fill="${tokens.moss}" font-family="Helvetica Neue, Arial, sans-serif" font-size="12">${escapeXml(copy.archiveTitle)}</text>${archives}</g>
  <g id="layer-contact"><rect y="7438" width="390" height="1362" fill="${tokens.paper}"/>${sectionLabel(copy.contactLabel, 24, 7510, tokens.coral)}${textBlock({ id: "contact-title-mobile", x: 24, y: 7620, value: copy.contactTitle, maxChars: 22, size: 46, lineHeight: 51, weight: 400, limit: 4 })}${textBlock({ id: "contact-copy-mobile", x: 24, y: 7860, value: copy.contactCopy, maxChars: 36, size: 18, lineHeight: 27, fill: "#30322f", limit: 7 })}<rect x="24" y="8100" width="160" height="48" rx="24" fill="${tokens.stage}"/><text x="54" y="8131" fill="${tokens.paper}" font-family="Helvetica Neue, Arial, sans-serif" font-size="13">${escapeXml(copy.contactCta)}</text></g>`,
  });
}

function collectRemoteDomains(model) {
  const domains = new Set([siteUrl]);
  const sources = [model.media.hero, ...model.works.flatMap((work) => [work.media, ...work.supportingMedia])];
  for (const media of sources) {
    if (media?.src && /^https?:\/\//.test(media.src)) domains.add(new URL(media.src).origin);
  }
  return [...domains].sort();
}

function cleanGeneratedText(value) {
  return `${String(value).replace(/[ \t]+$/gm, "").replace(/\n*$/, "")}\n`;
}

function buildReadme() {
  return `# Figma SVG Export — Editorial Watch Loop Hybrid

This package is generated from the portfolio's canonical site copy, media manifest, six work files, collaborations, and archive files.

## Files

- \`01-desktop-home.svg\` — complete desktop page in the approved hybrid order.
- \`02-desktop-works-logos.svg\` — five Watch Loop previews and all six editable work-row components.
- \`03-mobile-home.svg\` — complete mobile page; the Watch Loop is marked manual-scroll-only.
- \`manifest.json\` — canonical inputs, tokens, frame inventory, and item counts.

## Import

Drag the SVG files into Figma and ungroup them to edit text, shapes, borders, and image layers. For a richer editable reconstruction, run the local plugin in \`figma/hsin-portfolio-importer\`.

## Round trip

Do not edit generated copy or image paths as a second source of truth. Update \`data/site.json\`, \`data/media.json\`, \`content/works/*.md\`, \`data/collaborations.json\`, or \`content/archive/*.md\`, then run \`npm run figma:export\`.

Remote media stays a remote reference. A failed remote load is labeled in the importer; it is never silently replaced by a local image.
`;
}

function writePlugin(model) {
  const templatePath = join(pluginDir, "code.template.js");
  const template = readFileSync(templatePath, "utf8");
  if (!template.includes("__PORTFOLIO_MODEL__")) throw new Error("Figma importer template is missing __PORTFOLIO_MODEL__");
  const code = template.replace("__PORTFOLIO_MODEL__", JSON.stringify(model));
  const manifest = {
    name: "Hsin Portfolio Importer",
    id: "hsin-portfolio-importer",
    api: "1.0.0",
    main: "code.js",
    editorType: ["figma"],
    documentAccess: "dynamic-page",
    networkAccess: {
      allowedDomains: collectRemoteDomains(model),
      reasoning: "Loads canonical portfolio media by its recorded local production URL or original remote source; no fallback image substitution.",
    },
  };
  writeFileSync(join(pluginDir, "code.js"), code);
  writeFileSync(join(pluginDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
}

function main() {
  const model = buildModel();
  mkdirSync(outDir, { recursive: true });
  mkdirSync(pluginDir, { recursive: true });

  writeFileSync(join(outDir, "01-desktop-home.svg"), cleanGeneratedText(buildDesktop(model)));
  writeFileSync(join(outDir, "02-desktop-works-logos.svg"), cleanGeneratedText(buildComponents(model)));
  writeFileSync(join(outDir, "03-mobile-home.svg"), cleanGeneratedText(buildMobile(model)));
  writeFileSync(join(outDir, "README.md"), cleanGeneratedText(buildReadme()));
  writeFileSync(join(outDir, "manifest.json"), `${JSON.stringify({
    design: model.design,
    sourceFingerprint: model.sourceFingerprint,
    generatedFrom: "canonical repository sources",
    canonicalSources: {
      site: "data/site.json",
      media: "data/media.json",
      works: "content/works/*.md",
      collaborations: "data/collaborations.json",
      archive: "content/archive/*.md",
    },
    tokens,
    frames: [
      { file: "01-desktop-home.svg", width: 1440, height: 8000, scope: "complete desktop page" },
      { file: "02-desktop-works-logos.svg", width: 1440, height: 4380, scope: "watch and work components" },
      { file: "03-mobile-home.svg", width: 390, height: 8800, scope: "complete mobile page" },
    ],
    counts: {
      watchPreviews: model.watchPreviews.length,
      selectedWorks: model.works.length,
      collaborations: model.collaborations.length,
      archiveItems: model.archive.length,
    },
  }, null, 2)}\n`);

  writePlugin(model);
  console.log(`Generated hybrid Figma package in ${outDir}`);
}

main();
