import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";

const root = process.cwd();
const outDir = join(root, "figma-export");

const tokens = {
  stage: "#050807",
  fog: "#dddcd7",
  paper: "#f6f4ee",
  coral: "#f0645a",
  cobalt: "#4867d9",
  moss: "#4d9259",
  stageInk: "#f6f4ee",
  ink: "#121613",
  quietInk: "#636660",
  lineDark: "#2f3430",
  lineLight: "#b7b8b2",
};

const exportedTokens = {
  stage: tokens.stage,
  fog: tokens.fog,
  paper: tokens.paper,
  coral: tokens.coral,
  cobalt: tokens.cobalt,
  moss: tokens.moss,
};

function readJson(path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

function parseFrontmatter(path) {
  const raw = readFileSync(join(root, path), "utf8").trim();
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error(`Missing JSON frontmatter in ${path}`);
  return JSON.parse(match[1]);
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function textLines(text, maxChars) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function textBlock({
  id,
  x,
  y,
  lines,
  size = 24,
  weight = 400,
  fill = tokens.ink,
  lineHeight,
  family = "sans",
  italic = false,
  spacing = 0,
  anchor = "start",
  opacity = 1,
}) {
  const lh = lineHeight ?? Math.round(size * 1.18);
  const font = family === "serif"
    ? "Iowan Old Style, Baskerville, Times New Roman, serif"
    : "Helvetica Neue, Arial, sans-serif";
  const tspans = lines
    .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lh}">${escapeXml(line)}</tspan>`)
    .join("");
  return `<text id="${id}" x="${x}" y="${y}" fill="${fill}" opacity="${opacity}" font-family="${font}" font-size="${size}" font-weight="${weight}" font-style="${italic ? "italic" : "normal"}" letter-spacing="${spacing}" text-anchor="${anchor}">${tspans}</text>`;
}

function phaseLabel({ x, y, number, title, fill = tokens.quietInk }) {
  return `<g id="phase-label-${slug(`${number}-${title}`)}">
    <circle cx="${x + 5}" cy="${y - 4}" r="5" fill="${fill}"/>
    <text x="${x + 20}" y="${y}" fill="${fill}" font-family="Helvetica Neue, Arial, sans-serif" font-size="13" font-weight="500">${escapeXml(`${number} / ${title}`)}</text>
  </g>`;
}

function imageData(path) {
  if (!path || /^https?:\/\//.test(path)) return "";
  const fullPath = join(root, "public", path.replace(/^\//, ""));
  const ext = extname(fullPath).toLowerCase();
  const mime = {
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
  }[ext] || "application/octet-stream";
  return `data:${mime};base64,${readFileSync(fullPath).toString("base64")}`;
}

function imageLayer({ id, href, x, y, width, height, radius = 0, opacity = 1, fit = "slice", position = "xMidYMid" }) {
  const source = href ? basename(href) : "text-led";
  const embedded = imageData(href);
  if (!embedded) {
    return `<g id="${id}" data-source="${href ? `remote:${escapeXml(href)}` : "text-led"}">
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${tokens.lineDark}"/>
      <text x="${x + 18}" y="${y + height - 20}" fill="${tokens.stageInk}" opacity="0.62" font-family="Helvetica Neue, Arial, sans-serif" font-size="12">${href ? "Remote source · replace image fill in Figma" : "Text-led media field"}</text>
    </g>`;
  }
  return `<g id="${id}" data-source="${escapeXml(source)}">
    <defs><clipPath id="${id}-clip"><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}"/></clipPath></defs>
    <image href="${embedded}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="${position} ${fit}" opacity="${opacity}" clip-path="url(#${id}-clip)"/>
  </g>`;
}

function glow({ id, x, y, width, height, color, opacity = 0.58 }) {
  return `<g id="${id}" opacity="${opacity}">
    <defs>
      <radialGradient id="${id}-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="0" stop-color="${color}" stop-opacity="0.8"/>
        <stop offset="0.55" stop-color="${color}" stop-opacity="0.24"/>
        <stop offset="1" stop-color="${color}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="${x + width / 2}" cy="${y + height / 2}" rx="${width / 2}" ry="${height / 2}" fill="url(#${id}-gradient)"/>
  </g>`;
}

function svgFrame({ id, width, height, title, background = tokens.paper, body }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg id="${id}" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${id}-title">
  <title id="${id}-title">${escapeXml(title)}</title>
  <desc>Editable scene storyboard for Hsin-Hsin Yuan's portrait-carrier portfolio. Import into Figma and ungroup to edit text, shapes, and media layers.</desc>
  <rect id="token-page-background" width="${width}" height="${height}" fill="${background}"/>
  <g id="design-tokens" transform="translate(-200 -200)">
    ${Object.entries(exportedTokens).map(([name, value], index) => `<rect id="token-${name}" x="${index * 16}" y="0" width="12" height="12" fill="${value}"/>`).join("\n    ")}
  </g>
${body}
</svg>
`;
}

function buildPortraitCarrier(site, media) {
  const copy = site.en;
  return svgFrame({
    id: "frame-desktop-portrait-carrier",
    width: 1440,
    height: 1800,
    title: "Desktop portrait carrier — opening and release",
    background: tokens.stage,
    body: `
  <g id="scene-opening">
    <rect x="0" y="0" width="1440" height="900" fill="${tokens.stage}"/>
    ${glow({ id: "opening-signal-field", x: 760, y: 50, width: 610, height: 610, color: tokens.coral, opacity: 0.32 })}
    ${phaseLabel({ x: 56, y: 54, number: "01", title: "Opening · 0–25%", fill: tokens.stageInk })}
    <text x="1060" y="54" fill="${tokens.stageInk}" opacity="0.72" font-family="Helvetica Neue, Arial, sans-serif" font-size="13">Works　Practice　Contact　中</text>
    <g id="opening-media-frame">
      <rect x="152" y="104" width="1136" height="690" rx="42" fill="${tokens.lineDark}"/>
      ${imageLayer({ id: "media-opening-background", href: media.hero.abstractLayer, x: 152, y: 104, width: 1136, height: 690, radius: 42, opacity: 0.82 })}
      <rect x="152" y="104" width="1136" height="690" rx="42" fill="${tokens.stage}" opacity="0.32"/>
    </g>
    ${imageLayer({ id: "media-portrait-foreground-opening", href: media.hero.foregroundCutout, x: 430, y: 142, width: 580, height: 652, fit: "meet", position: "xMidYMax" })}
    ${textBlock({ id: "opening-name", x: 56, y: 730, lines: [copy.name], size: 88, weight: 500, fill: tokens.stageInk, lineHeight: 90 })}
    ${textBlock({ id: "opening-role", x: 1025, y: 716, lines: textLines(copy.portraitRole, 28), size: 22, weight: 400, fill: tokens.stageInk, lineHeight: 28 })}
    <text x="1190" y="832" fill="${tokens.stageInk}" opacity="0.68" font-family="Helvetica Neue, Arial, sans-serif" font-size="13">Scroll to release the portrait ↓</text>
  </g>
  <g id="scene-release">
    <rect x="0" y="900" width="1440" height="900" fill="${tokens.fog}"/>
    ${glow({ id: "release-signal-field", x: 365, y: 1010, width: 710, height: 700, color: tokens.coral, opacity: 0.2 })}
    ${phaseLabel({ x: 56, y: 954, number: "02", title: "Release · 25–48%", fill: tokens.ink })}
    <text x="1060" y="954" fill="${tokens.ink}" opacity="0.64" font-family="Helvetica Neue, Arial, sans-serif" font-size="13">Works　Practice　Contact　中</text>
    ${imageLayer({ id: "media-release-abstract", href: media.hero.abstractLayer, x: 72, y: 1050, width: 410, height: 270, radius: 22, opacity: 0.92 })}
    ${imageLayer({ id: "media-release-frame", href: media.hero.background, x: 1010, y: 1044, width: 320, height: 212, radius: 22, opacity: 0.82 })}
    ${imageLayer({ id: "media-portrait-foreground-release", href: media.hero.foregroundCutout, x: 442, y: 1010, width: 560, height: 730, fit: "meet", position: "xMidYMax" })}
    ${textBlock({ id: "release-name", x: 64, y: 1455, lines: [copy.name], size: 76, weight: 500, fill: tokens.ink })}
    ${textBlock({ id: "release-role", x: 1010, y: 1425, lines: textLines(copy.portraitRole, 29), size: 21, weight: 400, fill: tokens.ink, lineHeight: 30 })}
    ${textBlock({ id: "release-statement", x: 64, y: 1640, lines: textLines(copy.portraitStatement, 58), size: 28, weight: 400, fill: tokens.ink, lineHeight: 36 })}
    ${textBlock({ id: "release-accent", x: 1010, y: 1640, lines: [copy.portraitAccent], size: 36, weight: 400, fill: tokens.ink, family: "serif", italic: true })}
    <line x1="64" y1="1738" x2="1376" y2="1738" stroke="${tokens.lineLight}"/>
    <text x="64" y="1770" fill="${tokens.quietInk}" font-family="Helvetica Neue, Arial, sans-serif" font-size="12">Foreground portrait stays independent; background, abstract layer, and crop remain replaceable.</text>
  </g>`,
  });
}

function practiceRail(copy, activeId, signal, y) {
  return `<g id="practice-mode-rail-${activeId}">
    ${copy.practiceModes.map((mode, index) => {
      const active = mode.id === activeId;
      const x = 70 + index * 220;
      return `<g id="rail-${activeId}-${mode.id}">
        <circle cx="${x + 6}" cy="${y - 4}" r="${active ? 6 : 3}" fill="${active ? signal : tokens.quietInk}"/>
        <text x="${x + 20}" y="${y}" fill="${active ? tokens.ink : tokens.quietInk}" font-family="Helvetica Neue, Arial, sans-serif" font-size="13" font-weight="${active ? 600 : 400}">${escapeXml(mode.label)}</text>
      </g>`;
    }).join("\n")}
  </g>`;
}

function buildPracticeModes(site, media) {
  const copy = site.en;
  const body = media.practiceModes.map((modeMedia, index) => {
    const modeCopy = copy.practiceModes.find((mode) => mode.id === modeMedia.id);
    if (!modeCopy) throw new Error(`Missing site copy for practice mode ${modeMedia.id}`);
    const y = index * 900;
    const signal = tokens[modeMedia.signal];
    if (!signal) throw new Error(`Unknown signal token ${modeMedia.signal}`);
    return `<g id="practice-scene-${modeMedia.id}">
      <rect x="0" y="${y}" width="1440" height="900" fill="${index % 2 === 0 ? tokens.fog : tokens.paper}"/>
      ${glow({ id: `practice-${modeMedia.id}-signal-field`, x: 370, y: y + 105, width: 720, height: 680, color: signal, opacity: 0.23 })}
      ${phaseLabel({ x: 70, y: y + 54, number: `0${index + 3}`, title: `Practice · ${modeCopy.label}`, fill: tokens.ink })}
      ${practiceRail(copy, modeMedia.id, signal, y + 106)}
      ${imageLayer({ id: `practice-${modeMedia.id}-primary`, href: modeMedia.primary, x: 72, y: y + 185, width: 390, height: 278, radius: 18, opacity: 0.95 })}
      ${imageLayer({ id: `practice-${modeMedia.id}-supporting`, href: modeMedia.supporting, x: 1045, y: y + 470, width: 310, height: 220, radius: 18, opacity: 0.92 })}
      ${imageLayer({ id: `practice-${modeMedia.id}-portrait`, href: media.hero.foregroundCutout, x: 440, y: y + 125, width: 560, height: 720, fit: "meet", position: "xMidYMax" })}
      <text x="72" y="${y + 570}" fill="${signal}" font-family="Iowan Old Style, Baskerville, Times New Roman, serif" font-size="40" font-style="italic">${escapeXml(modeCopy.verb)}</text>
      ${textBlock({ id: `practice-${modeMedia.id}-title`, x: 72, y: y + 640, lines: textLines(modeCopy.title, 27), size: 38, weight: 500, fill: tokens.ink, lineHeight: 44 })}
      ${textBlock({ id: `practice-${modeMedia.id}-body`, x: 1045, y: y + 215, lines: textLines(modeCopy.body, 34), size: 18, weight: 400, fill: tokens.ink, lineHeight: 28 })}
      <line x1="72" y1="${y + 842}" x2="1355" y2="${y + 842}" stroke="${tokens.lineLight}"/>
      <text x="1045" y="${y + 815}" fill="${tokens.quietInk}" font-family="Helvetica Neue, Arial, sans-serif" font-size="12">Portrait anchor remains fixed while copy, signal, and project stills change.</text>
    </g>`;
  }).join("\n");

  return svgFrame({
    id: "frame-desktop-practice-modes",
    width: 1440,
    height: 2700,
    title: "Desktop practice modes storyboard",
    background: tokens.fog,
    body,
  });
}

function workMediaFor(work, media) {
  if (work.posterImage && !/^https?:\/\//.test(work.posterImage)) return work.posterImage;
  if (work.slug === "tech-dreamers") {
    return media.practiceModes.find((mode) => mode.id === "editorial-systems")?.primary || "";
  }
  return "";
}

function workSupportingFor(work, media) {
  if (work.supportingImages?.[0]?.src) return work.supportingImages[0].src;
  if (work.slug === "tech-dreamers") {
    return media.practiceModes.find((mode) => mode.id === "editorial-systems")?.supporting || "";
  }
  return "";
}

function buildWorkTheatre(site, works, media) {
  const sceneSignals = [tokens.moss, tokens.cobalt, tokens.coral];
  const body = works.map((work, index) => {
    const y = index * 900;
    const signal = sceneSignals[index];
    const mediaPath = workMediaFor(work, media);
    const supportingPath = workSupportingFor(work, media);
    const safeSlug = slug(work.slug);
    const mainMedia = mediaPath
      ? imageLayer({ id: `work-${safeSlug}-primary`, href: mediaPath, x: 64, y: y + 118, width: 850, height: 650, radius: 24, opacity: 0.9 })
      : `<g id="work-${safeSlug}-text-led-field">
          <rect x="64" y="${y + 118}" width="850" height="650" rx="24" fill="${tokens.stage}" stroke="${tokens.lineDark}"/>
          ${glow({ id: `work-${safeSlug}-text-glow`, x: 160, y: y + 210, width: 650, height: 450, color: signal, opacity: 0.22 })}
          ${textBlock({ id: `work-${safeSlug}-field-title`, x: 126, y: y + 415, lines: work.title.en.split(/\s+/), size: 116, weight: 400, fill: tokens.stageInk, lineHeight: 105, family: "serif", italic: true })}
        </g>`;
    return `<g id="work-scene-${safeSlug}">
      <rect x="0" y="${y}" width="1440" height="900" fill="${tokens.stage}"/>
      ${glow({ id: `work-${safeSlug}-signal-field`, x: 810, y: y + 80, width: 560, height: 650, color: signal, opacity: 0.18 })}
      ${phaseLabel({ x: 64, y: y + 54, number: String(index + 1).padStart(2, "0"), title: "Work theatre", fill: tokens.stageInk })}
      <text x="1280" y="${y + 54}" text-anchor="end" fill="${tokens.stageInk}" opacity="0.64" font-family="Helvetica Neue, Arial, sans-serif" font-size="13">${escapeXml(`${work.year} · ${work.platform}`)}</text>
      ${mainMedia}
      ${supportingPath ? imageLayer({ id: `work-${safeSlug}-supporting`, href: supportingPath, x: 760, y: y + 570, width: 220, height: 170, radius: 14, opacity: 0.96 }) : ""}
      ${textBlock({ id: `work-${safeSlug}-title`, x: 980, y: y + 195, lines: textLines(work.title.en, 18), size: 50, weight: 500, fill: tokens.stageInk, lineHeight: 56 })}
      ${textBlock({ id: `work-${safeSlug}-tagline`, x: 980, y: y + 330, lines: textLines(work.tagline.en, 28), size: 25, weight: 400, fill: tokens.stageInk, lineHeight: 32, family: "serif", italic: true })}
      ${textBlock({ id: `work-${safeSlug}-description`, x: 980, y: y + 465, lines: textLines(work.description.en, 34), size: 17, weight: 400, fill: tokens.stageInk, lineHeight: 27, opacity: 0.74 })}
      ${textBlock({ id: `work-${safeSlug}-role`, x: 980, y: y + 640, lines: textLines(work.role.en, 28), size: 14, weight: 500, fill: signal, lineHeight: 22 })}
      <line x1="980" y1="${y + 700}" x2="1350" y2="${y + 700}" stroke="${signal}"/>
      <text x="980" y="${y + 742}" fill="${tokens.stageInk}" font-family="Helvetica Neue, Arial, sans-serif" font-size="14">View project ↗</text>
      <text x="64" y="${y + 852}" fill="${tokens.stageInk}" opacity="0.46" font-family="Helvetica Neue, Arial, sans-serif" font-size="12">Scene ${index + 1} of ${works.length} · one dominant proof, one action</text>
    </g>`;
  }).join("\n");

  return svgFrame({
    id: "frame-desktop-work-theatre",
    width: 1440,
    height: 2700,
    title: site.en.workTheatreTitle,
    background: tokens.stage,
    body,
  });
}

function buildMobileFlow(site, works, media) {
  const copy = site.en;
  const practices = media.practiceModes.map((modeMedia, index) => {
    const modeCopy = copy.practiceModes.find((mode) => mode.id === modeMedia.id);
    const signal = tokens[modeMedia.signal];
    const y = 790 + index * 430;
    return `<g id="mobile-practice-${modeMedia.id}">
      <text x="22" y="${y + 38}" fill="${signal}" font-family="Iowan Old Style, Baskerville, Times New Roman, serif" font-size="25" font-style="italic">${escapeXml(modeCopy.verb)}</text>
      ${textBlock({ id: `mobile-practice-${modeMedia.id}-title`, x: 22, y: y + 88, lines: textLines(modeCopy.title, 26), size: 28, weight: 500, fill: tokens.ink, lineHeight: 32 })}
      ${imageLayer({ id: `mobile-practice-${modeMedia.id}-primary`, href: modeMedia.primary, x: 22, y: y + 154, width: 218, height: 168, radius: 12, opacity: 0.94 })}
      ${imageLayer({ id: `mobile-practice-${modeMedia.id}-supporting`, href: modeMedia.supporting, x: 252, y: y + 222, width: 116, height: 100, radius: 10, opacity: 0.94 })}
      ${textBlock({ id: `mobile-practice-${modeMedia.id}-body`, x: 22, y: y + 360, lines: textLines(modeCopy.body, 48), size: 14, weight: 400, fill: tokens.quietInk, lineHeight: 20 })}
    </g>`;
  }).join("\n");

  const mobileWorkY = 2110;
  const workScenes = works.map((work, index) => {
    const y = mobileWorkY + 70 + index * 520;
    const mediaPath = workMediaFor(work, media);
    const safeSlug = slug(work.slug);
    const signal = [tokens.moss, tokens.cobalt, tokens.coral][index];
    return `<g id="mobile-work-${safeSlug}">
      ${mediaPath
        ? imageLayer({ id: `mobile-work-${safeSlug}-primary`, href: mediaPath, x: 22, y, width: 346, height: 248, radius: 14, opacity: 0.9 })
        : `<g id="mobile-work-${safeSlug}-text-led"><rect x="22" y="${y}" width="346" height="248" rx="14" fill="${tokens.lineDark}"/>${textBlock({ id: `mobile-work-${safeSlug}-field-title`, x: 44, y: y + 105, lines: work.title.en.split(/\s+/), size: 54, weight: 400, fill: tokens.stageInk, family: "serif", italic: true, lineHeight: 50 })}</g>`}
      <text x="22" y="${y + 288}" fill="${signal}" font-family="Helvetica Neue, Arial, sans-serif" font-size="12">${escapeXml(`${work.year} · ${work.role.en}`)}</text>
      ${textBlock({ id: `mobile-work-${safeSlug}-title`, x: 22, y: y + 338, lines: textLines(work.title.en, 22), size: 34, weight: 500, fill: tokens.stageInk, lineHeight: 38 })}
      ${textBlock({ id: `mobile-work-${safeSlug}-tagline`, x: 22, y: y + 410, lines: textLines(work.tagline.en, 40), size: 17, weight: 400, fill: tokens.stageInk, lineHeight: 23, family: "serif", italic: true })}
      <text x="22" y="${y + 480}" fill="${tokens.stageInk}" opacity="0.7" font-family="Helvetica Neue, Arial, sans-serif" font-size="13">View project ↗</text>
    </g>`;
  }).join("\n");

  return svgFrame({
    id: "frame-mobile-static-flow",
    width: 390,
    height: 4200,
    title: "Mobile static stacked flow",
    background: tokens.paper,
    body: `
  <g id="mobile-portrait-carrier">
    <rect x="0" y="0" width="390" height="530" fill="${tokens.stage}"/>
    <text x="20" y="36" fill="${tokens.stageInk}" font-family="Helvetica Neue, Arial, sans-serif" font-size="12">Hsin-Hsin Yuan</text>
    <text x="282" y="36" fill="${tokens.stageInk}" opacity="0.68" font-family="Helvetica Neue, Arial, sans-serif" font-size="11">Works　Contact　中</text>
    ${glow({ id: "mobile-opening-signal", x: 82, y: 80, width: 250, height: 330, color: tokens.coral, opacity: 0.3 })}
    ${imageLayer({ id: "mobile-opening-background", href: media.hero.abstractLayer, x: 20, y: 68, width: 350, height: 350, radius: 24, opacity: 0.78 })}
    <rect x="20" y="68" width="350" height="350" rx="24" fill="${tokens.stage}" opacity="0.28"/>
    ${imageLayer({ id: "mobile-portrait-foreground", href: media.hero.foregroundCutout, x: 78, y: 92, width: 235, height: 410, fit: "meet", position: "xMidYMax" })}
    ${textBlock({ id: "mobile-name", x: 20, y: 466, lines: [copy.name], size: 42, weight: 500, fill: tokens.stageInk })}
  </g>
  <g id="mobile-release-copy">
    <rect x="0" y="530" width="390" height="245" fill="${tokens.fog}"/>
    ${textBlock({ id: "mobile-role", x: 20, y: 590, lines: textLines(copy.portraitRole, 34), size: 19, weight: 400, fill: tokens.ink, lineHeight: 26 })}
    ${textBlock({ id: "mobile-statement", x: 20, y: 672, lines: textLines(copy.portraitStatement, 40), size: 16, weight: 400, fill: tokens.quietInk, lineHeight: 22 })}
    ${textBlock({ id: "mobile-accent", x: 20, y: 742, lines: [copy.portraitAccent], size: 28, weight: 400, fill: tokens.ink, family: "serif", italic: true })}
  </g>
  <g id="mobile-practice-stack">
    <rect x="0" y="775" width="390" height="1335" fill="${tokens.paper}"/>
    ${practices}
  </g>
  <g id="mobile-work-stack">
    <rect x="0" y="${mobileWorkY}" width="390" height="1640" fill="${tokens.stage}"/>
    <text x="22" y="${mobileWorkY + 42}" fill="${tokens.stageInk}" font-family="Helvetica Neue, Arial, sans-serif" font-size="13">${escapeXml(copy.workTheatreTitle)}</text>
    ${workScenes}
  </g>
  <g id="mobile-contact">
    <rect x="0" y="3750" width="390" height="450" fill="${tokens.paper}"/>
    <text x="22" y="3812" fill="${tokens.quietInk}" font-family="Helvetica Neue, Arial, sans-serif" font-size="12">Contact</text>
    ${textBlock({ id: "mobile-contact-title", x: 22, y: 3880, lines: textLines(copy.contactTitle, 23), size: 39, weight: 500, fill: tokens.ink, lineHeight: 43 })}
    ${textBlock({ id: "mobile-contact-copy", x: 22, y: 3990, lines: textLines(copy.contactSubcopy, 50), size: 14, weight: 400, fill: tokens.quietInk, lineHeight: 20 })}
    <rect x="22" y="4118" width="346" height="54" rx="27" fill="${tokens.stage}"/>
    <text x="195" y="4151" text-anchor="middle" fill="${tokens.stageInk}" font-family="Helvetica Neue, Arial, sans-serif" font-size="14">${escapeXml(copy.contactCta)}</text>
  </g>`,
  });
}

function buildManifest(media) {
  return {
    schemaVersion: 1,
    system: "portrait-carrier",
    tokens: exportedTokens,
    mediaContract: {
      treatment: media.hero.treatment,
      foregroundRequired: media.hero.treatment === "portrait-carrier",
      foregroundPath: media.hero.foregroundCutout,
      replaceIn: "data/media.json",
    },
    frames: [
      { file: "01-desktop-portrait-carrier.svg", title: "Portrait carrier · opening and release", width: 1440, height: 1800 },
      { file: "02-desktop-practice-modes.svg", title: "Practice modes · three scene states", width: 1440, height: 2700 },
      { file: "03-desktop-work-theatre.svg", title: "Work theatre · three story scenes", width: 1440, height: 2700 },
      { file: "04-mobile-static-flow.svg", title: "Mobile · static stacked flow", width: 390, height: 4200 },
    ],
  };
}

function buildReadme() {
  return `# Figma Scene Export

This package translates the active Hsin-Hsin Yuan portfolio into editable scene storyboards. Its signature is the portrait carrier: the person separates from the opening frame, stays anchored through three practice modes, then hands the page to the work theatre.

## Files

- \`01-desktop-portrait-carrier.svg\` — opening and release states with independent background, abstract, and foreground portrait layers.
- \`02-desktop-practice-modes.svg\` — Documentary direction, Cross-cultural story, and Editorial systems states.
- \`03-desktop-work-theatre.svg\` — three full-viewport work scenes, including the text-led Slow Steps treatment.
- \`04-mobile-static-flow.svg\` — the static stacked mobile reading path; mobile does not use sticky scene traps.
- \`manifest.json\` — scene inventory, active tokens, dimensions, and portrait media contract.

## Use In Figma

1. Drag the SVG files into Figma or choose \`File > Place image/video\`.
2. Ungroup each imported SVG to reach editable text layers, image layers, signal fields, rules, and scene labels.
3. Replace imagery by selecting its named media layer. Keep the foreground portrait separate from the background frame.
4. Review desktop scene states and the static stacked mobile frame together.
5. Sync approved decisions back to \`data/media.json\`, \`data/site.json\`, \`content/works/*.md\`, and \`src/styles.css\`.

## Boundaries

- The SVGs describe composition states; the website remains the production source of truth.
- Signal colors identify real practice modes and should stay local to their scene.
- Re-run \`npm run figma:export\` after changing portfolio media or copy.
- Photos are embedded for portability. Remote sources use a labeled replace-in-Figma media field.
`;
}

function main() {
  const site = readJson("data/site.json");
  const media = readJson("data/media.json");
  const works = [
    parseFrontmatter("content/works/slow-steps.md"),
    parseFrontmatter("content/works/tech-dreamers.md"),
    parseFrontmatter("content/works/my-art-my-voice.md"),
  ].sort((a, b) => a.order - b.order);

  if (media.hero.treatment === "portrait-carrier" && !media.hero.foregroundCutout) {
    throw new Error("portrait-carrier export requires media.hero.foregroundCutout");
  }

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  writeFileSync(join(outDir, "01-desktop-portrait-carrier.svg"), buildPortraitCarrier(site, media));
  writeFileSync(join(outDir, "02-desktop-practice-modes.svg"), buildPracticeModes(site, media));
  writeFileSync(join(outDir, "03-desktop-work-theatre.svg"), buildWorkTheatre(site, works, media));
  writeFileSync(join(outDir, "04-mobile-static-flow.svg"), buildMobileFlow(site, works, media));
  writeFileSync(join(outDir, "manifest.json"), `${JSON.stringify(buildManifest(media), null, 2)}\n`);
  writeFileSync(join(outDir, "README.md"), buildReadme());

  console.log(`Generated portrait-carrier Figma package in ${outDir}`);
}

main();
