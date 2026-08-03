import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function parseFrontmatter(path) {
  const source = readFileSync(path, "utf8");
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error(`Missing JSON frontmatter: ${path}`);
  return JSON.parse(match[1]);
}

function loadMarkdownRecords(dir) {
  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => parseFrontmatter(join(dir, file)))
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}

function fieldInventory(records) {
  const counts = {};
  for (const record of records) {
    for (const field of Object.keys(record)) {
      counts[field] = (counts[field] || 0) + 1;
    }
  }
  return Object.fromEntries(
    Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)),
  );
}

function finding(id, count, message) {
  return { id, severity: "warning", count, message };
}

export function auditDesignContract({ rootDir = process.cwd() } = {}) {
  const featured = loadMarkdownRecords(join(rootDir, "content/works"))
    .filter((work) => work.featured);
  const archive = loadMarkdownRecords(join(rootDir, "content/archive"));
  const globalPress = readJson(join(rootDir, "data/press.json"))
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  const figmaSource = readFileSync(
    join(rootDir, "scripts/build-figma-export.mjs"),
    "utf8",
  );

  const workPress = featured.flatMap((work) => work.press || []);
  const explicitPresentation = featured.every((work) => work.presentation);
  const fillCard = [];
  const centered16x9 = [];
  for (const work of featured) {
    const variant = work.presentation?.desktopMediaVariant
      || (work.featuredMediaAspect === "16:9" ? "centered-16x9" : "fill-card");
    if (variant === "centered-16x9") centered16x9.push(work.slug);
    else fillCard.push(work.slug);
  }

  const findings = [];
  const missingPresentation = featured.filter((work) => !work.presentation).length;
  if (missingPresentation) {
    findings.push(finding(
      "featured.presentation.missing",
      missingPresentation,
      "Featured presentation is still inferred instead of declared.",
    ));
  }
  const hideMediaLabel = featured.filter((work) => Object.hasOwn(work, "hideMediaLabel")).length;
  if (hideMediaLabel) {
    findings.push(finding(
      "featured.legacy.hide-media-label",
      hideMediaLabel,
      "Negative media-label flags remain in source records.",
    ));
  }
  const featuredMediaAspect = featured.filter((work) => Object.hasOwn(work, "featuredMediaAspect")).length;
  if (featuredMediaAspect) {
    findings.push(finding(
      "featured.legacy.featured-media-aspect",
      featuredMediaAspect,
      "Desktop media variants remain encoded as an aspect exception.",
    ));
  }
  const focalNames = new Set();
  for (const record of [...featured, ...archive]) {
    if (Object.hasOwn(record, "focalPoint")) focalNames.add("focalPoint");
    if (Object.hasOwn(record, "posterFocalPoint")) focalNames.add("posterFocalPoint");
  }
  if (focalNames.size > 1) {
    findings.push(finding(
      "media.focal-point.mixed",
      focalNames.size,
      "Source evidence uses more than one focal-point field name.",
    ));
  }
  const flatArchiveEvidence = archive.reduce(
    (count, item) => count + ["platform", "summary", "metrics"].filter((field) => Object.hasOwn(item, field)).length,
    0,
  );
  if (flatArchiveEvidence) {
    findings.push(finding(
      "archive.evidence-fields.flat",
      flatArchiveEvidence,
      "Archive evidence-only fields remain flat in source records and require explicit classification.",
    ));
  }
  if (/readdirSync\(join\(root, "content\/works"\)\)/.test(figmaSource)) {
    findings.push(finding(
      "figma.featured-source.duplicated",
      1,
      "Figma reparses Featured source independently of the public contract loader.",
    ));
  }
  if (/font-weight="800">\/ <tspan[^>]*>Cross-Cultural Storyteller/.test(figmaSource)) {
    findings.push(finding(
      "figma.mobile-role-slash.stale",
      1,
      "The mobile current-reference export retains the removed second-line slash.",
    ));
  }
  if (!/Global Press/.test(figmaSource)) {
    findings.push(finding(
      "figma.press-map.missing",
      1,
      "The generated Figma handoff does not identify global Press in its current-reference map.",
    ));
  }
  if (/panel: "#19191B"/.test(figmaSource) || /panelStrong: "#242428"/.test(figmaSource)) {
    findings.push(finding(
      "figma.tokens.drift",
      2,
      "Figma panel tokens differ from the production CSS tokens.",
    ));
  }

  return {
    status: findings.length ? "migration-warnings" : "pass",
    summary: {
      featuredWorks: featured.length,
      archiveItems: archive.length,
      globalPressItems: globalPress.length,
      workPressItems: workPress.length,
    },
    collections: {
      featured: { order: featured.map((item) => item.slug) },
      archive: { order: archive.map((item) => item.slug) },
      globalPress: { order: globalPress.map((item) => item.id) },
    },
    fieldInventory: {
      featured: fieldInventory(featured),
      archive: fieldInventory(archive),
      globalPress: fieldInventory(globalPress),
      workPress: fieldInventory(workPress),
    },
    variants: {
      featured: {
        "fill-card": fillCard,
        "centered-16x9": centered16x9,
        source: explicitPresentation ? "explicit" : "legacy-inference",
      },
      archive: {
        standard: archive.map((item) => item.slug),
        poster: archive.filter((item) => item.posterImage).map((item) => item.slug),
        indexFallback: archive.filter((item) => !item.posterImage).map((item) => item.slug),
      },
      press: {
        "thumbnail-card": workPress.length,
        "text-note": globalPress.length,
      },
    },
    findings,
  };
}

export function formatAuditReport(report) {
  const lines = [
    `Portfolio design contract audit: ${report.status}`,
    `${report.summary.featuredWorks} Featured / ${report.summary.archiveItems} Archive / ${report.summary.globalPressItems} global Press / ${report.summary.workPressItems} work Press`,
  ];
  if (!report.findings.length) lines.push("No active contract drift found.");
  for (const item of report.findings) {
    lines.push(`- ${item.id} (${item.count}): ${item.message}`);
  }
  return `${lines.join("\n")}\n`;
}

function main() {
  const report = auditDesignContract({ rootDir: process.cwd() });
  if (process.argv.includes("--json")) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } else {
    process.stdout.write(formatAuditReport(report));
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
