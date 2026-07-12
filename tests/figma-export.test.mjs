import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const root = process.cwd();
const exportDir = join(root, "figma-export");

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
  const desktopHome = readFileSync(join(exportDir, "01-desktop-home.svg"), "utf8");
  const worksLogos = readFileSync(join(exportDir, "02-desktop-works-logos.svg"), "utf8");
  const mobileHome = readFileSync(join(exportDir, "03-mobile-home.svg"), "utf8");
  const readme = readFileSync(join(exportDir, "README.md"), "utf8");

  assert.match(desktopHome, /id="frame-desktop-home"/);
  assert.match(desktopHome, /id="layer-hero-title"/);
  assert.match(desktopHome, /HSIN-HSIN/);
  assert.match(desktopHome, /Documentary Director/);
  assert.match(desktopHome, /#D8FF3E/);
  assert.match(desktopHome, /hsin-working-white-space\.jpg/);
  assert.doesNotMatch(desktopHome, /paris-cultural-olympiad-team\.jpg/);

  assert.match(worksLogos, /id="layer-logo-wall"/);
  assert.match(worksLogos, /TaiwanPlus/);
  assert.match(worksLogos, /Public Television Service Taiwan/);
  assert.match(worksLogos, /id="component-work-card-slow-steps"/);
  assert.match(worksLogos, /id="component-work-card-my-art-my-voice"/);
  assert.match(worksLogos, /id="component-work-card-tech-dreamers"/);

  assert.match(mobileHome, /id="frame-mobile-home"/);
  assert.match(mobileHome, /viewBox="0 0 390 844"/);
  assert.match(mobileHome, /id="layer-mobile-available"/);
  assert.match(mobileHome, /AVAILABLE FOR/i);

  assert.match(readme, /Drag the SVG files into Figma/);
  assert.match(readme, /editable text layers/i);
  assert.doesNotMatch(desktopHome, /<foreignObject/);
});
