import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import {
  buildDesktopHome,
  buildMobileHome,
  imageData,
  objectCoverGeometry,
  validateFeaturedWorks,
} from "../scripts/build-figma-export.mjs";
import { loadSiteData, loadWorks, renderPage } from "../scripts/build-site.mjs";
import { normalizeHeroMedia } from "../scripts/lib/portfolio-contract.mjs";

const root = process.cwd();
const exportDir = join(root, "figma-export");

function workCardBlock(svg, slug) {
  const start = svg.indexOf(`<g id="component-work-card-${slug}">`);
  assert.notEqual(start, -1, `${slug} work card should exist`);
  const next = svg.indexOf('<g id="component-work-card-', start + 1);
  const end = next === -1 ? svg.indexOf('<g id="layer-logo-wall">', start) : next;
  return svg.slice(start, end);
}

function heroImageBlock(svg, id) {
  return svg.match(new RegExp(`<g id="${id}"[\\s\\S]*?<\\/g>`))?.[0] || "";
}

test("Figma Hero geometry matches the live motion start crop", () => {
  const desktop = objectCoverGeometry({
    sourceWidth: 1920,
    sourceHeight: 1440,
    frameX: 72,
    frameY: 104,
    frameWidth: 610,
    frameHeight: 520,
    focalPoint: { x: 0.38, y: 0.78 },
    heightScale: 1.4,
  });
  const mobile = objectCoverGeometry({
    sourceWidth: 1920,
    sourceHeight: 1440,
    frameX: 24,
    frameY: 76,
    frameWidth: 342,
    frameHeight: 252,
    focalPoint: { x: 0.38, y: 0.78 },
    heightScale: 1.4,
  });

  assert.deepEqual(desktop, { x: -65.0533, y: -58.24, width: 970.6667, height: 728 });
  assert.deepEqual(mobile, { x: -24.792, y: -2.624, width: 470.4, height: 352.8 });
});

test("Figma export helpers reject remote images and invalid featured work metadata", () => {
  assert.throws(
    () => imageData("https://example.test/poster.webp"),
    /Remote Figma export image requires a local figmaPosterImage: https:\/\/example\.test\/poster\.webp/,
  );
  assert.doesNotThrow(() => validateFeaturedWorks([{ slug: "valid", order: 1 }]));
  assert.throws(() => validateFeaturedWorks([{ slug: "", order: 1 }]), /missing a non-empty slug/);
  assert.throws(() => validateFeaturedWorks([{ slug: "same", order: 1 }, { slug: "same", order: 2 }]), /slug must be unique/);
  assert.throws(() => validateFeaturedWorks([{ slug: "fraction", order: 1.5 }]), /finite integer order/);
  assert.throws(() => validateFeaturedWorks([{ slug: "nan", order: Number.NaN }]), /finite integer order/);
  assert.throws(() => validateFeaturedWorks([{ slug: "first", order: 1 }, { slug: "second", order: 1 }]), /order must be unique/);
});

test("Figma CollaborationMark components keep the complete canonical wall", () => {
  const loaded = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const desktop = buildDesktopHome(loaded.site, works, loaded.collaborations);
  const mobile = buildMobileHome(loaded.site, works, loaded.collaborations);
  const ids = loaded.collaborations.map((item) => item.id);

  for (const svg of [desktop, mobile]) {
    let previous = -1;
    for (const id of ids) {
      const index = svg.indexOf(`id="component-collaboration-${id}"`);
      assert.ok(index > previous, `${id} should render once in canonical order`);
      previous = index;
    }
    assert.equal((svg.match(/data-render-mode="logo"/g) || []).length, 6);
    assert.equal((svg.match(/data-render-mode="fallback"/g) || []).length, 1);
    assert.match(svg, /data-source="taiwanplus-mono\.svg"/);
    assert.match(svg, /data-source="pts-mono\.svg"/);
    assert.match(svg, /data-source="dragon-tv-mono\.svg"/);
    assert.match(svg, /data-source="ticff-mono\.svg"/);
    assert.match(svg, /data-source="screenhouse-mono\.svg"/);
    assert.match(svg, /data-source="gorgeous-space-mono\.svg"/);
    assert.doesNotMatch(svg, /sourceSha256|sourceCheckedAt|official-mark-nominative-use/);
    assert.doesNotMatch(svg, /494bc7efb79c834934c4cbafd551754e88c01e7ab473184894369cd6bf02c546/);
  }
  assert.match(desktop, /id="component-collaboration-ticff" transform="translate\(234 764\)"/);
  assert.match(desktop, /id="component-collaboration-gorgeous-space" transform="translate\(882 764\)"/);
  assert.match(mobile, /id="component-collaboration-gorgeous-space" transform="translate\(120 808\)"/);
  assert.match(mobile, /height="1040" viewBox="0 0 390 1040"/);
  const generator = readFileSync(join(root, "scripts/build-figma-export.mjs"), "utf8");
  assert.doesNotMatch(generator, /collaborations\s*\n?\s*\.slice\(0, 4\)/);
});

test("Figma SVG export package can be generated from site content", () => {
  rmSync(exportDir, { recursive: true, force: true });

  const result = spawnSync(process.execPath, ["scripts/build-figma-export.mjs"], {
    cwd: root,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);

  const expectedFiles = [
    "README.md",
    "01-desktop-home.svg",
    "02-desktop-works-logos.svg",
    "03-mobile-home.svg",
  ];

  for (const file of expectedFiles) {
    assert.equal(existsSync(join(exportDir, file)), true, `${file} should exist`);
  }
});

test("Figma SVG export keeps portfolio layers editable and named", () => {
  const generator = readFileSync(join(root, "scripts/build-figma-export.mjs"), "utf8");
  const desktopHome = readFileSync(join(exportDir, "01-desktop-home.svg"), "utf8");
  const worksLogos = readFileSync(join(exportDir, "02-desktop-works-logos.svg"), "utf8");
  const mobileHome = readFileSync(join(exportDir, "03-mobile-home.svg"), "utf8");
  const readme = readFileSync(join(exportDir, "README.md"), "utf8");

  assert.match(desktopHome, /id="frame-desktop-home"/);
  assert.match(desktopHome, /id="layer-hero-title"/);
  assert.match(desktopHome, /HSIN-HSIN/);
  assert.match(desktopHome, /Documentary Director/);
  assert.match(
    desktopHome,
    /<text id="layer-hero-role-2" x="772"[^>]*><tspan[^>]*>Cross-Cultural Storyteller<\/tspan><\/text>/,
  );
  assert.doesNotMatch(desktopHome, /<g id="layer-hero-role-2">/);
  assert.match(desktopHome, /#D8FF3E/);
  const desktopHeroImage = heroImageBlock(desktopHome, "layer-hero-image");
  const mobileHeroImage = heroImageBlock(mobileHome, "layer-mobile-hero-image");
  assert.match(desktopHeroImage, /data-source="hsin-working-white-space\.jpg"/);
  assert.match(desktopHeroImage, /data-focal-x="0\.38" data-focal-y="0\.78"/);
  assert.match(desktopHeroImage, /<clipPath id="layer-hero-image-clip">/);
  assert.match(desktopHeroImage, /<image[^>]*x="-65\.0533" y="-58\.24" width="970\.6667" height="728"[^>]*clip-path="url\(#layer-hero-image-clip\)"/);
  assert.match(mobileHeroImage, /data-source="hsin-working-white-space\.jpg"/);
  assert.match(mobileHeroImage, /<image[^>]*x="-24\.792" y="-2\.624" width="470\.4" height="352\.8"/);
  assert.doesNotMatch(desktopHeroImage, /slow-steps-poster\.webp/);
  assert.doesNotMatch(mobileHeroImage, /slow-steps-poster\.webp/);
  assert.doesNotMatch(desktopHome, /paris-cultural-olympiad-team\.jpg/);

  assert.match(worksLogos, /id="layer-logo-wall"/);
  assert.match(worksLogos, /id="component-collaboration-taiwanplus"/);
  assert.match(worksLogos, /data-source="pts-mono\.svg"/);
  assert.match(worksLogos, /id="component-collaboration-gorgeous-space"/);
  assert.match(worksLogos, /id="component-collaboration-women-make-waves"[^>]*data-render-mode="fallback"/);
  assert.doesNotMatch(worksLogos, /Happy Space/);
  for (const slug of [
    "slow-steps",
    "tech-dreamers",
    "my-art-my-voice",
    "interior-spatial-brand-films",
    "pts-taigi-bus",
    "top-gear-china-uk-special",
  ]) {
    assert.match(worksLogos, new RegExp(`id="component-work-card-${slug}"`));
  }
  assert.match(worksLogos, /Design &amp; Brand Films/);
  assert.doesNotMatch(worksLogos, /Interior Design &amp; Branded Films/);
  assert.match(desktopHome, /id="layer-contact-heading"/);
  assert.match(desktopHome, /Let’s build/);
  assert.match(desktopHome, /a story/);
  assert.match(desktopHome, /together\./);
  assert.match(worksLogos, /data:image\/webp;base64,/);

  const workCards = [...worksLogos.matchAll(/<g id="component-work-card-([^"]+)">\n    <rect x="(\d+)" y="(\d+)" width="(\d+)" height="(\d+)"/g)];
  assert.deepEqual(
    workCards.map(([, slug, x, y, width, height]) => ({ slug, x: Number(x), y: Number(y), width: Number(width), height: Number(height) })),
    [
      "slow-steps",
      "tech-dreamers",
      "my-art-my-voice",
      "interior-spatial-brand-films",
      "pts-taigi-bus",
      "top-gear-china-uk-special",
    ].map((slug, index) => ({
      slug,
      x: 72 + (index % 3) * 430,
      y: 290 + Math.floor(index / 3) * 440,
      width: 390,
      height: 410,
    })),
  );
  assert.match(worksLogos, /viewBox="0 0 1440 1660"/);
  assert.match(desktopHome, /viewBox="0 0 1440 1420"/);

  const contactHeading = desktopHome.match(/<g id="layer-contact-heading">([\s\S]*?)<\/g>/)?.[1];
  assert.ok(contactHeading);
  assert.equal((contactHeading.match(/<text\b/g) || []).length, 2);
  assert.match(contactHeading, /<text x="72" y="1080"[^>]*>Let’s build<\/text>/);
  assert.match(contactHeading, /<text x="72" y="1152"[^>]*>a story <tspan fill="#D8FF3E">together\.<\/tspan><\/text>/);

  for (const svg of [desktopHome, worksLogos, mobileHome]) {
    assert.doesNotMatch(svg, /<image href="https?:\/\//);
  }
  for (const slug of ["slow-steps", "interior-spatial-brand-films", "tech-dreamers", "pts-taigi-bus"]) {
    assert.match(workCardBlock(worksLogos, slug), /<image href="data:image\/webp;base64,/);
  }
  for (const slug of ["my-art-my-voice", "top-gear-china-uk-special"]) {
    assert.match(workCardBlock(worksLogos, slug), /<image href="data:image\/jpeg;base64,/);
  }
  assert.match(generator, /function validateFeaturedWorks\(works\)/);
  assert.match(generator, /validateFeaturedWorks\(works\);/);
  assert.match(generator, /import \{ loadSiteData, loadWorks \} from "\.\/build-site\.mjs"/);
  assert.doesNotMatch(generator, /readdirSync\(join\(root, "content\/works"\)\)/);

  assert.match(mobileHome, /id="frame-mobile-home"/);
  assert.match(mobileHome, /viewBox="0 0 390 1040"/);
  assert.match(mobileHome, /id="layer-mobile-available"/);
  assert.match(mobileHome, /AVAILABLE FOR/i);
  assert.match(
    mobileHome,
    /<text x="24" y="558"[^>]*>Cross-Cultural Storyteller<\/text>/,
  );
  assert.doesNotMatch(mobileHome, />\/ <tspan[^>]*>Cross-Cultural Storyteller/);

  assert.match(readme, /Drag the SVG files into Figma/);
  assert.match(readme, /editable text layers/i);
  assert.match(readme, /Global Press/);
  assert.match(readme, /fill-card/);
  assert.match(readme, /centered-16x9/);
  assert.match(readme, /one standard Archive card family/);
  assert.match(worksLogos, /id="token-color-panel"[^>]*fill="rgba\(255, 255, 255, 0\.055\)"/);
  assert.match(worksLogos, /id="component-work-card-slow-steps">\s*<rect[^>]*fill="#171719"/);
  assert.doesNotMatch(desktopHome, /<foreignObject/);
});

test("one HeroMedia source mutation reaches website and both Figma frames", () => {
  const loaded = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const current = loaded.site.heroMedia;
  const replacementSrc = "/assets/portfolio/slow-steps-poster.webp";
  const replacement = normalizeHeroMedia({
    ...current.contract.public,
    src: replacementSrc,
    rightsStatus: current.contract.evidence.rightsStatus,
  });
  const mutatedSite = { ...loaded.site, heroMedia: replacement };
  const loadedWithMutation = { ...loaded, site: mutatedSite };
  const website = renderPage({ lang: "en", site: loadedWithMutation, works });
  const desktop = buildDesktopHome(mutatedSite, works, loaded.collaborations);
  const mobile = buildMobileHome(mutatedSite, works, loaded.collaborations);

  for (const output of [website, desktop, mobile]) {
    assert.match(output, /slow-steps-poster\.webp/);
    assert.doesNotMatch(output, /hsin-working-white-space\.jpg/);
  }
});
