import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { pathToFileURL } from "node:url";

import { loadSiteData, loadWorks } from "./build-site.mjs";

const root = process.cwd();
const outDir = join(root, "figma-export");

const tokens = {
  bg: "#0B0B0C",
  ink: "#F7F2E8",
  muted: "#B8B0A3",
  line: "rgba(247, 242, 232, 0.18)",
  panel: "rgba(255, 255, 255, 0.055)",
  panelStrong: "rgba(255, 255, 255, 0.095)",
  workPanel: "#171719",
  acid: "#D8FF3E",
  heat: "#FF4D1F",
};

export function validateFeaturedWorks(works) {
  const slugs = new Set();
  const orders = new Set();

  for (const work of works) {
    if (typeof work.slug !== "string" || !work.slug.trim()) {
      throw new Error("Featured work is missing a non-empty slug");
    }
    if (!Number.isFinite(work.order) || !Number.isInteger(work.order)) {
      throw new Error(`Featured work ${work.slug} must have a finite integer order`);
    }
    if (slugs.has(work.slug)) {
      throw new Error(`Featured work slug must be unique: ${work.slug}`);
    }
    if (orders.has(work.order)) {
      throw new Error(`Featured work order must be unique: ${work.order}`);
    }
    slugs.add(work.slug);
    orders.add(work.order);
  }
}

function englishText(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value.en ?? "";
  }
  return value ?? "";
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function textLines(text, maxChars) {
  const words = String(text).split(/\s+/);
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

function textBlock({ id, x, y, lines, size = 24, weight = 500, fill = tokens.ink, lineHeight, transform = "", spacing = 0 }) {
  const lh = lineHeight ?? Math.round(size * 1.18);
  const tspans = lines
    .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lh}">${escapeXml(line)}</tspan>`)
    .join("");
  return `<text id="${id}" x="${x}" y="${y}" fill="${fill}" font-family="Inter, Arial, sans-serif" font-size="${size}" font-weight="${weight}" letter-spacing="${spacing}" transform="${transform}">${tspans}</text>`;
}

function pill({ x, y, width, text, fill = "transparent", stroke = tokens.line, color = tokens.ink, uppercase = true }) {
  const label = uppercase ? text.toUpperCase() : text;
  return `<g id="pill-${escapeXml(text).toLowerCase().replace(/[^a-z0-9]+/g, "-")}">
    <rect x="${x}" y="${y}" width="${width}" height="34" rx="17" fill="${fill}" stroke="${stroke}"/>
    <text x="${x + 17}" y="${y + 22}" fill="${color}" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="700" letter-spacing="${uppercase ? 1.2 : 0}">${escapeXml(label)}</text>
  </g>`;
}

export function imageData(path) {
  if (/^https?:\/\//.test(path)) {
    throw new Error(`Remote Figma export image requires a local figmaPosterImage: ${path}`);
  }
  const fullPath = join(root, "public", path.replace(/^\//, ""));
  const ext = extname(fullPath).toLowerCase();
  const mime = ext === ".png"
    ? "image/png"
    : ext === ".svg"
      ? "image/svg+xml"
      : ext === ".webp"
        ? "image/webp"
        : "image/jpeg";
  return `data:${mime};base64,${readFileSync(fullPath).toString("base64")}`;
}

function roundSvg(value) {
  return Number(value.toFixed(4));
}

export function objectCoverGeometry({
  sourceWidth,
  sourceHeight,
  frameX,
  frameY,
  frameWidth,
  frameHeight,
  focalPoint,
  heightScale = 1,
}) {
  const scale = Math.max(
    frameWidth / sourceWidth,
    (frameHeight * heightScale) / sourceHeight,
  );
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;
  return {
    x: roundSvg(frameX - (width - frameWidth) * focalPoint.x),
    y: roundSvg(frameY - (height - frameHeight) * focalPoint.y),
    width: roundSvg(width),
    height: roundSvg(height),
  };
}

function imageLayer({
  id,
  href,
  x,
  y,
  width,
  height,
  opacity = 1,
  dimensions,
  focalPoint,
  heightScale = 1,
}) {
  if (!href) {
    return `<g id="${id}" data-source="placeholder">
    <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${tokens.panelStrong}"/>
    <text x="${x + 18}" y="${y + height - 18}" fill="${tokens.ink}" opacity="0.55" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="700">image pending</text>
  </g>`;
  }
  const filename = basename(href);
  if (dimensions && focalPoint) {
    const image = objectCoverGeometry({
      sourceWidth: dimensions.width,
      sourceHeight: dimensions.height,
      frameX: x,
      frameY: y,
      frameWidth: width,
      frameHeight: height,
      focalPoint,
      heightScale,
    });
    return `<g id="${id}" data-source="${escapeXml(filename)}" data-focal-x="${focalPoint.x}" data-focal-y="${focalPoint.y}">
    <defs><clipPath id="${id}-clip"><rect x="${x}" y="${y}" width="${width}" height="${height}"/></clipPath></defs>
    <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${tokens.panelStrong}"/>
    <image href="${imageData(href)}" x="${image.x}" y="${image.y}" width="${image.width}" height="${image.height}" clip-path="url(#${id}-clip)" preserveAspectRatio="none" opacity="${opacity}"/>
    <text x="${x + 18}" y="${y + height - 18}" fill="${tokens.ink}" opacity="0.55" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="700">${escapeXml(filename)}</text>
  </g>`;
  }
  return `<g id="${id}" data-source="${escapeXml(filename)}">
    <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${tokens.panelStrong}"/>
    <image href="${imageData(href)}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" opacity="${opacity}"/>
    <text x="${x + 18}" y="${y + height - 18}" fill="${tokens.ink}" opacity="0.55" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="700">${escapeXml(filename)}</text>
  </g>`;
}

function svgFrame({ id, width, height, title, body }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg id="${id}" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${id}-title">
  <title id="${id}-title">${escapeXml(title)}</title>
  <desc>Editable SVG design layer for Hsin-Hsin Yuan portfolio. Import into Figma and ungroup to edit text, shapes, and image layers.</desc>
  <rect id="token-color-bg" width="${width}" height="${height}" fill="${tokens.bg}"/>
  <g id="tokens">
    <rect id="color-accent-acid" x="-100" y="-100" width="10" height="10" fill="${tokens.acid}"/>
    <rect id="color-accent-heat" x="-120" y="-100" width="10" height="10" fill="${tokens.heat}"/>
    <rect id="token-color-panel" x="-140" y="-100" width="10" height="10" fill="${tokens.panel}"/>
    <rect id="token-color-panel-strong" x="-160" y="-100" width="10" height="10" fill="${tokens.panelStrong}"/>
    <rect id="token-color-work-panel" x="-180" y="-100" width="10" height="10" fill="${tokens.workPanel}"/>
  </g>
${body}
</svg>
`;
}

function collaborationMark({ item, x, y, slotWidth, slotHeight }) {
  const collaboration = item.contract.public;
  const name = englishText(collaboration.name);
  const display = englishText(collaboration.label) || name;
  const logo = collaboration.logo;
  if (!logo) {
    return `<g id="component-collaboration-${escapeXml(collaboration.id)}" transform="translate(${x} ${y})" data-render-mode="fallback" opacity="0.7">
    <text x="${slotWidth / 2}" y="${slotHeight / 2}" text-anchor="middle" dominant-baseline="middle" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="17" font-weight="800" letter-spacing="0.6">${escapeXml(display)}</text>
  </g>`;
  }

  const token = logo.opticalToken;
  let height = Math.min(token.height, slotHeight);
  let width = height * (logo.dimensions.width / logo.dimensions.height);
  const maxWidth = Math.min(token.maxWidth, slotWidth);
  if (width > maxWidth) {
    height *= maxWidth / width;
    width = maxWidth;
  }
  const imageX = roundSvg((slotWidth - width) / 2);
  const imageY = roundSvg((slotHeight - height) / 2);
  return `<g id="component-collaboration-${escapeXml(collaboration.id)}" transform="translate(${x} ${y})" data-render-mode="logo" data-logo-size="${logo.opticalSize}" data-source="${escapeXml(basename(logo.src))}" opacity="0.62">
    <image href="${imageData(logo.src)}" x="${imageX}" y="${imageY}" width="${roundSvg(width)}" height="${roundSvg(height)}" preserveAspectRatio="xMidYMid meet"/>
  </g>`;
}

function collaborationWall({ items, startX, startY, columns, slotWidth, slotHeight, columnGap, rowGap }) {
  const fullRowWidth = columns * slotWidth + (columns - 1) * columnGap;
  return items.map((item, index) => {
    const row = Math.floor(index / columns);
    const rowStart = row * columns;
    const rowCount = Math.min(columns, items.length - rowStart);
    const rowWidth = rowCount * slotWidth + (rowCount - 1) * columnGap;
    const rowOffset = (fullRowWidth - rowWidth) / 2;
    const column = index - rowStart;
    return collaborationMark({
      item,
      x: startX + rowOffset + column * (slotWidth + columnGap),
      y: startY + row * (slotHeight + rowGap),
      slotWidth,
      slotHeight,
    });
  }).join("\n");
}

function workCard({ work, x, y, width }) {
  const title = work.title.en;
  const desc = work.description.en;
  const safeSlug = work.slug.replace(/[^a-z0-9-]/gi, "-");
  return `<g id="component-work-card-${safeSlug}">
    <rect x="${x}" y="${y}" width="${width}" height="410" rx="8" fill="${tokens.workPanel}" stroke="${tokens.line}"/>
    ${imageLayer({ id: `image-work-${safeSlug}`, href: work.figmaPosterImage || work.posterImage, x: x + 14, y: y + 14, width: width - 28, height: 160, opacity: 0.88 })}
    <text x="${x + 24}" y="${y + 210}" fill="${tokens.acid}" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="800" letter-spacing="1.3">${escapeXml(`${work.year} / ${work.role.en} / ${englishText(work.platform)}`.toUpperCase())}</text>
    <text x="${x + 24}" y="${y + 252}" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="850">${escapeXml(title)}</text>
    ${textBlock({ id: `text-work-${safeSlug}-description`, x: x + 24, y: y + 286, lines: textLines(desc, 36).slice(0, 3), size: 15, fill: tokens.muted, lineHeight: 22 })}
    <text x="${x + 24}" y="${y + 374}" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="800" letter-spacing="1.3">${escapeXml((work.tags || []).slice(0, 3).join(" / ").toUpperCase())}</text>
  </g>`;
}

export function buildDesktopHome(site, works, collaborations) {
  const hero = site.en;
  const heroMedia = site.heroMedia.contract.public;
  const logoRow = collaborationWall({
    items: collaborations,
    startX: 72,
    startY: 690,
    columns: 4,
    slotWidth: 260,
    slotHeight: 56,
    columnGap: 64,
    rowGap: 18,
  });

  const slashLines = hero.heroRoleLines
    .map((line, index) => {
      const y = 420 + index * 34;
      if (!line.startsWith("/")) {
        return textBlock({ id: `layer-hero-role-${index + 1}`, x: 772, y, lines: [line], size: 25, weight: 650, fill: tokens.ink });
      }
      return `<g id="layer-hero-role-${index + 1}">
        <text x="772" y="${y}" fill="${tokens.acid}" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="800">/</text>
        <text x="794" y="${y}" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="650">${escapeXml(line.replace(/^\s*\/\s*/, ""))}</text>
      </g>`;
    })
    .join("\n");

  return svgFrame({
    id: "frame-desktop-home",
    width: 1440,
    height: 1420,
    title: "Desktop Home",
    body: `
  <g id="layer-topbar">
    <text x="72" y="54" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="850" letter-spacing="1.4">HSIN-HSIN YUAN</text>
    <text x="980" y="54" fill="${tokens.muted}" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="750" letter-spacing="1.1">AVAILABLE FOR / WORKS / CONTACT / 中文</text>
  </g>
  <g id="layer-hero">
    ${imageLayer({ id: "layer-hero-image", href: heroMedia.src, x: 72, y: 104, width: 610, height: 520, opacity: 0.96, dimensions: heroMedia.dimensions, focalPoint: heroMedia.focalPoint.wide, heightScale: heroMedia.motionProfile.startScale })}
    <rect x="72" y="104" width="610" height="520" fill="${tokens.bg}" opacity="0.08"/>
    <text id="layer-hero-eyebrow" x="772" y="148" fill="${tokens.acid}" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="850" letter-spacing="1.5">${escapeXml(hero.heroEyebrow.toUpperCase())}</text>
    <g id="layer-hero-title">
      <text x="768" y="282" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="104" font-weight="900">HSIN-HSIN</text>
      <text x="768" y="382" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="104" font-weight="900">YUAN</text>
    </g>
    ${slashLines}
    ${textBlock({ id: "layer-hero-subcopy", x: 772, y: 526, lines: textLines(hero.heroSubcopy, 56).slice(0, 4), size: 18, fill: tokens.muted, lineHeight: 28 })}
  </g>
  <g id="layer-logo-wall">
    <text x="72" y="668" fill="${tokens.muted}" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="800" letter-spacing="1.3">${escapeXml(hero.collabTitle.toUpperCase())}</text>
    ${logoRow}
  </g>
  <g id="layer-available">
    <text x="72" y="840" fill="${tokens.acid}" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="850" letter-spacing="1.4">${escapeXml(hero.availabilityLabel.toUpperCase())}</text>
    ${textBlock({ id: "layer-available-intro", x: 72, y: 896, lines: textLines(hero.availabilityIntro, 62).slice(0, 3), size: 26, weight: 760, fill: tokens.ink, lineHeight: 36 })}
    ${textBlock({ id: "layer-available-list", x: 760, y: 888, lines: hero.availability.slice(0, 6), size: 17, fill: tokens.muted, lineHeight: 30 })}
  </g>
  <g id="layer-contact-heading">
    <text x="72" y="1080" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="72" font-weight="900">${escapeXml(hero.contactTitleLead)}</text>
    <text x="72" y="1152" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="72" font-weight="900">${escapeXml(hero.contactTitleBridge ? `${hero.contactTitleBridge} ` : "")}<tspan fill="${tokens.acid}">${escapeXml(hero.contactTitleAccent)}</tspan></text>
  </g>`,
  });
}

function buildDesktopWorksLogos(site, works, collaborations) {
  const copy = site.en;
  const cards = works
    .map((work, index) => workCard({
      work,
      x: 72 + (index % 3) * 430,
      y: 290 + Math.floor(index / 3) * 440,
      width: 390,
    }))
    .join("\n");
  const logos = collaborationWall({
    items: collaborations,
    startX: 72,
    startY: 1370,
    columns: 4,
    slotWidth: 250,
    slotHeight: 58,
    columnGap: 80,
    rowGap: 24,
  });

  return svgFrame({
    id: "frame-desktop-works-logos",
    width: 1440,
    height: 1660,
    title: "Desktop Works and Logo Wall",
    body: `
  <g id="layer-page-title">
    <text x="72" y="110" fill="${tokens.acid}" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="850" letter-spacing="1.4">${escapeXml(copy.worksLabel.toUpperCase())}</text>
    <text x="72" y="178" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="64" font-weight="900">Featured Works</text>
    ${textBlock({ id: "layer-works-intro", x: 760, y: 142, lines: textLines("Compact cards for browsing multiple projects at once. Use this frame to tune poster crops, card density, and work hierarchy before translating changes back into code.", 58).slice(0, 4), size: 18, fill: tokens.muted, lineHeight: 28 })}
  </g>
  <g id="layer-featured-work-cards">
    ${cards}
  </g>
  <g id="layer-logo-wall">
    <text x="72" y="1280" fill="${tokens.acid}" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="850" letter-spacing="1.4">${escapeXml(copy.collabTitle.toUpperCase())}</text>
    <text x="72" y="1326" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="850">No boxes, no heavy boundary, just a quiet trust strip.</text>
    ${logos}
  </g>`,
  });
}

export function buildMobileHome(site, works, collaborations) {
  const hero = site.en;
  const heroMedia = site.heroMedia.contract.public;
  const firstRoleLine = escapeXml(hero.heroRoleLines[0])
    .replaceAll(" / ", ` <tspan fill="${tokens.acid}">/</tspan> `);
  const secondRoleLine = escapeXml(hero.heroRoleLines[1]);
  const logos = collaborationWall({
    items: collaborations,
    startX: 28,
    startY: 610,
    columns: 2,
    slotWidth: 150,
    slotHeight: 50,
    columnGap: 34,
    rowGap: 16,
  });

  return svgFrame({
    id: "frame-mobile-home",
    width: 390,
    height: 1040,
    title: "Mobile Home",
    body: `
  <g id="layer-mobile-topbar">
    <text x="24" y="42" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="850" letter-spacing="1.2">HSIN-HSIN YUAN</text>
    <text x="308" y="42" fill="${tokens.muted}" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="750">中文</text>
  </g>
  <g id="layer-mobile-hero">
    ${imageLayer({ id: "layer-mobile-hero-image", href: heroMedia.src, x: 24, y: 76, width: 342, height: 252, opacity: 0.94, dimensions: heroMedia.dimensions, focalPoint: heroMedia.focalPoint.mobile, heightScale: heroMedia.motionProfile.startScale })}
    <text id="layer-mobile-eyebrow" x="24" y="370" fill="${tokens.acid}" font-family="Inter, Arial, sans-serif" font-size="10" font-weight="850" letter-spacing="1.3">DOCUMENTARY / CULTURE / TECHNOLOGY</text>
    <g id="layer-hero-title">
      <text x="22" y="436" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="54" font-weight="900">HSIN-HSIN</text>
      <text x="22" y="492" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="54" font-weight="900">YUAN</text>
    </g>
    <text x="24" y="532" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="650">${firstRoleLine}</text>
    <text x="24" y="558" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="650">${secondRoleLine}</text>
  </g>
  <g id="layer-logo-wall">
    <text x="24" y="596" fill="${tokens.muted}" font-family="Inter, Arial, sans-serif" font-size="10" font-weight="800" letter-spacing="1.2">${escapeXml(hero.collabTitle.toUpperCase())}</text>
    ${logos}
  </g>
  <g id="layer-mobile-available">
    <text x="24" y="900" fill="${tokens.acid}" font-family="Inter, Arial, sans-serif" font-size="10" font-weight="850" letter-spacing="1.2">${escapeXml(hero.availabilityLabel.toUpperCase())}</text>
    ${textBlock({ id: "layer-mobile-available-intro", x: 24, y: 934, lines: textLines(hero.availabilityIntro, 36).slice(0, 3), size: 18, weight: 760, fill: tokens.ink, lineHeight: 24 })}
  </g>`,
  });
}

function buildReadme() {
  return `# Figma SVG Export

This folder is a free Figma import package for the Hsin-Hsin Yuan portfolio design layer.

## Files

- \`01-desktop-home.svg\` - desktop hero, logo strip, availability, and contact heading.
- \`02-desktop-works-logos.svg\` - compact work cards and logo wall.
- \`03-mobile-home.svg\` - mobile home reference frame.

## How To Use

1. Open your Figma file.
2. Drag the SVG files into Figma, or use \`File > Place image/video\`.
3. Select an imported SVG and ungroup if needed.
4. Edit text layers, move sections, tune spacing, and annotate decisions.
5. Send approved changes back into the website repo, especially \`src/styles.css\`, \`data/site.json\`, and \`content/works/*.md\`.

## Notes

- The SVGs are generated from current site content, so re-run \`npm run figma:export\` after major content changes.
- Hero imagery comes from the same normalized \`data/site.json.heroMedia\` record as the website. Replace its source asset, source SHA-256, localized alt, intrinsic dimensions, and focal points there; sanitize the public JPEG, run \`npm run hero:prepare\`, then regenerate this package.
- Photos are embedded as image layers to keep the package portable.
- Text, rectangles, collaboration marks, cards, and color token swatches remain editable SVG layers, including editable text layers for fallbacks after import.
- This is a design control layer, not the production source of truth.

## Current Contract Map

The public order is Hero, Platforms & Collaborations, Screening Strip,
Available For, Featured Works, FROM THE ARCHIVE, Global Press, and Contact.

- Featured Works uses the named desktop variants \`fill-card\` and
  \`centered-16x9\`; every mobile media frame is 16:9.
- Hero is one non-interactive image component. The SVG records the approved
  animation's static starting crop; it has no Play or video layer.
- Platforms & Collaborations uses the complete canonical data order. Verified
  monochrome marks and visible text fallbacks share one named component family,
  with four desktop slots, two mobile slots, and a centered incomplete row.
- Source artwork may contain its own title, but the site adds no second title
  overlay.
- FROM THE ARCHIVE uses one standard Archive card family; missing media changes
  capability, not card size.
- Global Press is a separate text-only note family. Work Press may retain a
  verified thumbnail inside its project card.
`;
}

function main() {
  const siteData = loadSiteData(root);
  const site = siteData.site;
  const collaborations = siteData.collaborations;
  const works = loadWorks(join(root, "content/works"));
  validateFeaturedWorks(works);

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  writeFileSync(join(outDir, "01-desktop-home.svg"), buildDesktopHome(site, works, collaborations));
  writeFileSync(join(outDir, "02-desktop-works-logos.svg"), buildDesktopWorksLogos(site, works, collaborations));
  writeFileSync(join(outDir, "03-mobile-home.svg"), buildMobileHome(site, works, collaborations));
  writeFileSync(join(outDir, "README.md"), buildReadme());

  console.log(`Generated Figma SVG export package in ${outDir}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
