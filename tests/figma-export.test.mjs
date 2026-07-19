import assert from "node:assert/strict";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const root = process.cwd();
const exportDir = join(root, "figma-export");

function readJson(path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

function parseFrontmatter(path) {
  const raw = readFileSync(join(root, path), "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(match, `${path} should have JSON frontmatter`);
  return JSON.parse(match[1]);
}

function canonicalWorks() {
  return readdirSync(join(root, "content/works"))
    .filter((name) => name.endsWith(".md"))
    .map((name) => parseFrontmatter(`content/works/${name}`))
    .filter((work) => work.featured)
    .sort((a, b) => a.order - b.order);
}

function canonicalArchive() {
  return readdirSync(join(root, "content/archive"))
    .filter((name) => name.endsWith(".md"))
    .map((name) => parseFrontmatter(`content/archive/${name}`))
    .sort((a, b) => a.order - b.order);
}

test("Figma hybrid export package is generated with desktop, mobile, and manifest outputs", () => {
  rmSync(exportDir, { recursive: true, force: true });

  const result = spawnSync(process.execPath, ["scripts/build-figma-export.mjs"], {
    cwd: root,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);

  for (const file of [
    "README.md",
    "manifest.json",
    "01-desktop-home.svg",
    "02-desktop-works-logos.svg",
    "03-mobile-home.svg",
  ]) {
    assert.equal(existsSync(join(exportDir, file)), true, `${file} should exist`);
  }

  const manifest = readJson("figma-export/manifest.json");
  assert.equal(manifest.design, "editorial-watch-loop-hybrid");
  assert.equal(manifest.canonicalSources.site, "data/site.json");
  assert.equal(manifest.canonicalSources.media, "data/media.json");
  assert.equal(manifest.counts.watchPreviews, 5);
  assert.equal(manifest.counts.selectedWorks, 6);
  assert.equal(manifest.counts.archiveItems, 4);
});

test("desktop and mobile exports preserve the complete hybrid information architecture", () => {
  const desktop = readFileSync(join(exportDir, "01-desktop-home.svg"), "utf8");
  const mobile = readFileSync(join(exportDir, "03-mobile-home.svg"), "utf8");

  for (const svg of [desktop, mobile]) {
    const orderedLayers = [
      "layer-hero-split",
      "layer-collaborations",
      "layer-watch-loop",
      "layer-availability",
      "layer-selected-works",
      "layer-collaboration-fit",
      "layer-archive",
      "layer-contact",
    ];
    let previous = -1;
    for (const layer of orderedLayers) {
      const position = svg.indexOf(`id=\"${layer}\"`);
      assert.ok(position > previous, `${layer} should follow the approved page order`);
      previous = position;
    }
  }

  assert.match(desktop, /id="frame-desktop-home"/);
  assert.match(mobile, /id="frame-mobile-home"/);
  assert.match(mobile, /viewBox="0 0 390 8800"/);
  assert.match(mobile, /data-motion="manual-scroll-only"/);
});

test("exports use the approved palette and contain no retired visual fingerprints", () => {
  const outputs = [
    "01-desktop-home.svg",
    "02-desktop-works-logos.svg",
    "03-mobile-home.svg",
  ].map((file) => readFileSync(join(exportDir, file), "utf8")).join("\n");

  for (const color of ["#050807", "#dddcd7", "#f6f4ee", "#f0645a", "#4867d9", "#4d9259"]) {
    assert.match(outputs.toLowerCase(), new RegExp(color));
  }

  assert.doesNotMatch(outputs, /[ \t]+$/m, "generated SVG lines should not carry trailing whitespace");
  assert.match(outputs, /Helvetica Neue/);
  assert.match(outputs, /Iowan Old Style/);
  assert.doesNotMatch(outputs, /#D8FF3E|accent-acid|portrait-carrier|ambient|glow|radialGradient|filter="url|mix-blend|box-shadow/i);
  assert.doesNotMatch(outputs, /<foreignObject/);

  const generator = readFileSync(join(root, "scripts/build-figma-export.mjs"), "utf8");
  assert.doesNotMatch(
    generator,
    /heroRoleLines|heroSubcopy|watchShelfAria|worksLabel|services|practiceModes/,
    "the active Figma generator must not retain retired-schema fallbacks",
  );
});

test("canonical work, collaboration, archive, and media data propagate without truncation or substitution", () => {
  const works = canonicalWorks();
  const archive = canonicalArchive();
  const collaborations = readJson("data/collaborations.json");
  const media = readJson("data/media.json");
  const desktop = readFileSync(join(exportDir, "01-desktop-home.svg"), "utf8");
  const components = readFileSync(join(exportDir, "02-desktop-works-logos.svg"), "utf8");
  const combined = `${desktop}\n${components}`;

  assert.equal(works.length, 6);
  for (const work of works) {
    assert.match(combined, new RegExp(`id=\"work-row-${work.slug}\"`));
    assert.match(combined, new RegExp(work.title.en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.equal((components.match(/id="watch-preview-/g) || []).length, 5);
  assert.equal((components.match(/id="work-row-/g) || []).length, 6);
  assert.match(components, /watch-preview-slow-steps[^]*data-media-status="text-first"/);
  assert.doesNotMatch(components, /watch-preview-interior-spatial-brand-films/);

  for (const item of collaborations) assert.match(desktop, new RegExp(item.label));
  for (const item of archive) assert.match(desktop, new RegExp(item.title.en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.match(desktop, new RegExp(media.hero.poster.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(desktop, new RegExp(readJson("data/site.json").en.portraitAccent.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(combined, /https:\/\/prod-img\.taiwanplus\.com\/program\/224be7ed-057b-400f-af63-a8582cd80cfb\.webp/);
  assert.match(combined, /id="supporting-media-my-art-my-voice-1"/);
  assert.match(combined, /my-art-my-voice-performance-1\.jpg/);
  assert.match(combined, /my-art-my-voice-interview\.jpg/);
  assert.doesNotMatch(combined, /data:image\/webp;base64/);
  assert.doesNotMatch(combined, /hsin-working-white-space\.jpg/);
});

test("generated Figma outputs are deterministic and record one canonical source fingerprint", () => {
  const files = [
    "figma-export/README.md",
    "figma-export/manifest.json",
    "figma-export/01-desktop-home.svg",
    "figma-export/02-desktop-works-logos.svg",
    "figma-export/03-mobile-home.svg",
    "figma/hsin-portfolio-importer/code.js",
    "figma/hsin-portfolio-importer/manifest.json",
  ];
  const before = new Map(files.map((file) => [file, readFileSync(join(root, file))]));
  const result = spawnSync(process.execPath, ["scripts/build-figma-export.mjs"], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  for (const file of files) assert.deepEqual(readFileSync(join(root, file)), before.get(file), `${file} should be deterministic`);

  const manifest = readJson("figma-export/manifest.json");
  assert.match(manifest.sourceFingerprint, /^sha256:[a-f0-9]{64}$/);
});

test("a canonical media mutation propagates to SVG, importer, and the source fingerprint", () => {
  const fixture = mkdtempSync(join(tmpdir(), "hsin-figma-sync-"));
  try {
    for (const path of ["scripts", "data", "content", "figma/hsin-portfolio-importer"]) {
      cpSync(join(root, path), join(fixture, path), { recursive: true });
    }

    const run = () => spawnSync(process.execPath, ["scripts/build-figma-export.mjs"], { cwd: fixture, encoding: "utf8" });
    let result = run();
    assert.equal(result.status, 0, result.stderr || result.stdout);
    const before = JSON.parse(readFileSync(join(fixture, "figma-export/manifest.json"), "utf8"));

    const mediaPath = join(fixture, "data/media.json");
    const media = JSON.parse(readFileSync(mediaPath, "utf8"));
    media.hero.poster = "/assets/showreel/canonical-replacement-probe.png";
    writeFileSync(mediaPath, `${JSON.stringify(media, null, 2)}\n`);

    result = run();
    assert.equal(result.status, 0, result.stderr || result.stdout);
    const after = JSON.parse(readFileSync(join(fixture, "figma-export/manifest.json"), "utf8"));
    const desktop = readFileSync(join(fixture, "figma-export/01-desktop-home.svg"), "utf8");
    const importer = readFileSync(join(fixture, "figma/hsin-portfolio-importer/code.js"), "utf8");

    assert.notEqual(after.sourceFingerprint, before.sourceFingerprint);
    assert.match(desktop, /canonical-replacement-probe\.png/);
    assert.match(importer, /canonical-replacement-probe\.png/);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test("Figma generation rejects work media that violates the shared canonical contract", () => {
  const fixture = mkdtempSync(join(tmpdir(), "hsin-figma-contract-"));
  try {
    for (const path of ["scripts", "data", "content", "figma/hsin-portfolio-importer"]) {
      cpSync(join(root, path), join(fixture, path), { recursive: true });
    }
    const workPath = join(fixture, "content/works/slow-steps.md");
    const source = readFileSync(workPath, "utf8").replace('"mobileFocalPoint": "50% 50%"', '"mobileFocalPoint": "invalid"');
    writeFileSync(workPath, source);

    const result = spawnSync(process.execPath, ["scripts/build-figma-export.mjs"], { cwd: fixture, encoding: "utf8" });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /slow-steps\.mobileFocalPoint must use X% Y%/);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
