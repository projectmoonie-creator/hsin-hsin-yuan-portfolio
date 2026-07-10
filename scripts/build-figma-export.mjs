import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";

const root = process.cwd();
const outDir = join(root, "figma-export");

const tokens = {
  bg: "#0B0B0C",
  ink: "#F7F2E8",
  muted: "#B8B0A3",
  line: "rgba(247, 242, 232, 0.18)",
  panel: "#19191B",
  panelStrong: "#242428",
  acid: "#D8FF3E",
  heat: "#FF4D1F",
  blue: "#7CC7FF",
};

function readJson(path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

function parseFrontmatter(path) {
  const raw = readFileSync(join(root, path), "utf8").trim();
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error(`Missing JSON frontmatter in ${path}`);
  }
  return JSON.parse(match[1]);
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

function imageData(path) {
  const fullPath = join(root, "public", path.replace(/^\//, ""));
  const ext = extname(fullPath).toLowerCase();
  const mime = ext === ".png" ? "image/png" : ext === ".svg" ? "image/svg+xml" : "image/jpeg";
  return `data:${mime};base64,${readFileSync(fullPath).toString("base64")}`;
}

function imageLayer({ id, href, x, y, width, height, opacity = 1 }) {
  const filename = basename(href);
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
    <rect id="color-accent-blue" x="-140" y="-100" width="10" height="10" fill="${tokens.blue}"/>
  </g>
${body}
</svg>
`;
}

function logoWordmark({ item, x, y, width = 150 }) {
  const display = item.label || item.name;
  return `<g id="logo-${escapeXml(item.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")}" opacity="0.7">
    <text x="${x}" y="${y}" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="800">${escapeXml(display)}</text>
    <text x="${x}" y="${y + 18}" fill="${tokens.muted}" font-family="Inter, Arial, sans-serif" font-size="9" font-weight="700">${escapeXml(item.name)}</text>
    <line x1="${x}" y1="${y + 28}" x2="${x + width}" y2="${y + 28}" stroke="${tokens.ink}" stroke-opacity="0.2"/>
  </g>`;
}

function workCard({ work, x, y, width }) {
  const title = work.title.en;
  const desc = work.description.en;
  const safeSlug = work.slug.replace(/[^a-z0-9-]/gi, "-");
  return `<g id="component-work-card-${safeSlug}">
    <rect x="${x}" y="${y}" width="${width}" height="410" rx="8" fill="${tokens.panel}" stroke="${tokens.line}"/>
    ${imageLayer({ id: `image-work-${safeSlug}`, href: work.posterImage, x: x + 14, y: y + 14, width: width - 28, height: 160, opacity: 0.88 })}
    <text x="${x + 24}" y="${y + 210}" fill="${tokens.acid}" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="800" letter-spacing="1.3">${escapeXml(`${work.year} / ${work.role.en} / ${work.platform}`.toUpperCase())}</text>
    <text x="${x + 24}" y="${y + 252}" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="850">${escapeXml(title)}</text>
    ${textBlock({ id: `text-work-${safeSlug}-description`, x: x + 24, y: y + 286, lines: textLines(desc, 36).slice(0, 3), size: 15, fill: tokens.muted, lineHeight: 22 })}
    <text x="${x + 24}" y="${y + 374}" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="800" letter-spacing="1.3">${escapeXml((work.tags || []).slice(0, 3).join(" / ").toUpperCase())}</text>
  </g>`;
}

function buildDesktopHome(site, works, collaborations) {
  const hero = site.en;
  const featured = works[0];
  const logoRow = collaborations
    .slice(0, 7)
    .map((item, index) => logoWordmark({ item, x: 92 + index * 180, y: 690, width: 132 }))
    .join("\n");

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
    height: 1200,
    title: "Desktop Home",
    body: `
  <g id="layer-topbar">
    <text x="72" y="54" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="850" letter-spacing="1.4">HSIN-HSIN YUAN</text>
    <text x="1050" y="54" fill="${tokens.muted}" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="750" letter-spacing="1.1">WORKS / ABOUT / CONTACT / 中文</text>
  </g>
  <g id="layer-hero">
    ${imageLayer({ id: "layer-hero-image", href: featured.posterImage, x: 72, y: 104, width: 610, height: 520, opacity: 0.96 })}
    <rect x="72" y="104" width="610" height="520" fill="${tokens.bg}" opacity="0.08"/>
    <text id="layer-hero-eyebrow" x="772" y="148" fill="${tokens.acid}" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="850" letter-spacing="1.5">${escapeXml(hero.heroEyebrow.toUpperCase())}</text>
    <g id="layer-hero-title">
      <text x="768" y="282" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="104" font-weight="900">HSIN-HSIN</text>
      <text x="768" y="382" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="104" font-weight="900">YUAN</text>
    </g>
    ${slashLines}
    ${textBlock({ id: "layer-hero-subcopy", x: 772, y: 526, lines: textLines(hero.heroSubcopy, 56).slice(0, 4), size: 18, fill: tokens.muted, lineHeight: 28 })}
    ${pill({ x: 772, y: 590, width: 132, text: hero.heroPrimaryCta, fill: tokens.acid, stroke: tokens.acid, color: tokens.bg })}
    ${pill({ x: 920, y: 590, width: 112, text: hero.heroSecondaryCta })}
  </g>
  <g id="layer-logo-wall">
    <text x="72" y="668" fill="${tokens.muted}" font-family="Inter, Arial, sans-serif" font-size="11" font-weight="800" letter-spacing="1.3">${escapeXml(hero.collabTitle.toUpperCase())}</text>
    ${logoRow}
  </g>
  <g id="layer-about">
    <text x="72" y="840" fill="${tokens.acid}" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="850" letter-spacing="1.4">${escapeXml(hero.aboutTitle.toUpperCase())}</text>
    ${textBlock({ id: "layer-about-lead", x: 72, y: 896, lines: textLines(hero.aboutLead, 60).slice(0, 4), size: 28, weight: 760, fill: tokens.ink, lineHeight: 38 })}
    ${textBlock({ id: "layer-about-body", x: 760, y: 888, lines: textLines(hero.aboutBody, 64).slice(0, 8), size: 17, fill: tokens.muted, lineHeight: 27 })}
  </g>`,
  });
}

function buildDesktopWorksLogos(site, works, collaborations) {
  const copy = site.en;
  const cards = works
    .slice(0, 3)
    .map((work, index) => workCard({ work, x: 72 + index * 430, y: 290, width: 390 }))
    .join("\n");
  const logos = collaborations
    .map((item, index) => logoWordmark({ item, x: 72 + (index % 4) * 330, y: 910 + Math.floor(index / 4) * 92, width: 220 }))
    .join("\n");

  return svgFrame({
    id: "frame-desktop-works-logos",
    width: 1440,
    height: 1200,
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
    <text x="72" y="820" fill="${tokens.acid}" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="850" letter-spacing="1.4">${escapeXml(copy.collabTitle.toUpperCase())}</text>
    <text x="72" y="866" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="850">No boxes, no heavy boundary, just a quiet trust strip.</text>
    ${logos}
  </g>`,
  });
}

function buildMobileHome(site, works, collaborations) {
  const hero = site.en;
  const logos = collaborations
    .slice(0, 4)
    .map((item, index) => logoWordmark({ item, x: 28 + (index % 2) * 168, y: 614 + Math.floor(index / 2) * 62, width: 118 }))
    .join("\n");

  return svgFrame({
    id: "frame-mobile-home",
    width: 390,
    height: 844,
    title: "Mobile Home",
    body: `
  <g id="layer-mobile-topbar">
    <text x="24" y="42" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="850" letter-spacing="1.2">HSIN-HSIN YUAN</text>
    <text x="308" y="42" fill="${tokens.muted}" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="750">中文</text>
  </g>
  <g id="layer-mobile-hero">
    ${imageLayer({ id: "layer-mobile-hero-image", href: works[0].posterImage, x: 24, y: 76, width: 342, height: 252, opacity: 0.94 })}
    <text id="layer-mobile-eyebrow" x="24" y="370" fill="${tokens.acid}" font-family="Inter, Arial, sans-serif" font-size="10" font-weight="850" letter-spacing="1.3">DOCUMENTARY / CULTURE / TECHNOLOGY</text>
    <g id="layer-hero-title">
      <text x="22" y="436" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="54" font-weight="900">HSIN-HSIN</text>
      <text x="22" y="492" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="54" font-weight="900">YUAN</text>
    </g>
    <text x="24" y="532" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="650">Documentary Director <tspan fill="${tokens.acid}">/</tspan> Writer <tspan fill="${tokens.acid}">/</tspan> Producer</text>
    <text x="24" y="558" fill="${tokens.acid}" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="800">/ <tspan fill="${tokens.ink}">Cross-Cultural Storyteller</tspan></text>
    ${pill({ x: 24, y: 582, width: 132, text: hero.heroPrimaryCta, fill: tokens.acid, stroke: tokens.acid, color: tokens.bg, uppercase: false })}
  </g>
  <g id="layer-logo-wall">
    <text x="24" y="596" fill="${tokens.muted}" font-family="Inter, Arial, sans-serif" font-size="10" font-weight="800" letter-spacing="1.2">${escapeXml(hero.collabTitle.toUpperCase())}</text>
    ${logos}
  </g>
  <g id="layer-mobile-about">
    <text x="24" y="748" fill="${tokens.acid}" font-family="Inter, Arial, sans-serif" font-size="10" font-weight="850" letter-spacing="1.2">${escapeXml(hero.aboutTitle.toUpperCase())}</text>
    ${textBlock({ id: "layer-mobile-about-lead", x: 24, y: 782, lines: textLines(hero.aboutLead, 36).slice(0, 3), size: 18, weight: 760, fill: tokens.ink, lineHeight: 24 })}
  </g>`,
  });
}

function buildReadme() {
  return `# Figma SVG Export

This folder is a free Figma import package for the Hsin-Hsin Yuan portfolio design layer.

## Files

- \`01-desktop-home.svg\` - desktop hero, logo strip, and about section.
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
- Photos are embedded as image layers to keep the package portable.
- Text, rectangles, logo wordmarks, cards, and color token swatches remain editable SVG layers, including editable text layers after import.
- This is a design control layer, not the production source of truth.
`;
}

function main() {
  const site = readJson("data/site.json");
  const collaborations = readJson("data/collaborations.json");
  const works = [
    parseFrontmatter("content/works/my-art-my-voice.md"),
    parseFrontmatter("content/works/tech-dreamers.md"),
    parseFrontmatter("content/works/slow-steps.md"),
  ].sort((a, b) => a.order - b.order);

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  writeFileSync(join(outDir, "01-desktop-home.svg"), buildDesktopHome(site, works, collaborations));
  writeFileSync(join(outDir, "02-desktop-works-logos.svg"), buildDesktopWorksLogos(site, works, collaborations));
  writeFileSync(join(outDir, "03-mobile-home.svg"), buildMobileHome(site, works, collaborations));
  writeFileSync(join(outDir, "README.md"), buildReadme());

  console.log(`Generated Figma SVG export package in ${outDir}`);
}

main();
