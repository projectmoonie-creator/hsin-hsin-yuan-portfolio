import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const root = process.cwd();
const exportDir = join(root, "figma-export");
const expectedFiles = [
  "README.md",
  "manifest.json",
  "01-desktop-portrait-carrier.svg",
  "02-desktop-practice-modes.svg",
  "03-desktop-work-theatre.svg",
  "04-mobile-static-flow.svg",
];

function generateExport() {
  rmSync(exportDir, { recursive: true, force: true });
  return spawnSync(process.execPath, ["scripts/build-figma-export.mjs"], {
    cwd: root,
    encoding: "utf8",
  });
}

function readExport(name) {
  return readFileSync(join(exportDir, name), "utf8");
}

test("Figma export generates the portrait scene storyboard package", () => {
  const result = generateExport();

  assert.equal(result.status, 0, result.stderr || result.stdout);
  for (const file of expectedFiles) {
    assert.equal(existsSync(join(exportDir, file)), true, `${file} should exist`);
  }

  const manifest = JSON.parse(readExport("manifest.json"));
  assert.equal(manifest.system, "portrait-carrier");
  assert.equal(manifest.mediaContract.foregroundRequired, true);
  assert.deepEqual(manifest.tokens, {
    stage: "#050807",
    fog: "#dddcd7",
    paper: "#f6f4ee",
    coral: "#f0645a",
    cobalt: "#4867d9",
    moss: "#4d9259",
  });
  assert.deepEqual(
    manifest.frames.map((frame) => frame.file),
    expectedFiles.slice(2),
  );
});

test("portrait carrier export separates the real foreground subject from the opening frame", () => {
  const svg = readExport("01-desktop-portrait-carrier.svg");

  assert.match(svg, /id="frame-desktop-portrait-carrier"/);
  assert.match(svg, /id="scene-opening"/);
  assert.match(svg, /id="scene-release"/);
  assert.match(svg, /id="media-opening-background"/);
  assert.match(svg, /id="media-opening-background" data-source="my-art-my-voice-performance-2\.jpg"/);
  assert.match(svg, /id="media-portrait-foreground-opening"/);
  assert.match(svg, /id="media-portrait-foreground-release"/);
  assert.match(svg, /hsin-portrait-foreground\.webp/);
  assert.match(svg, /Hsin-Hsin Yuan/);
  assert.match(svg, /stories that travel/);
  assert.match(svg, /#050807/i);
  assert.match(svg, /#dddcd7/i);
  assert.doesNotMatch(svg, /#d8ff3e/i);
  assert.doesNotMatch(svg, /compact[- ]card|moving strip/i);
  assert.doesNotMatch(svg, /<foreignObject/);
});

test("practice storyboard exposes three professional modes and their signal media", () => {
  const svg = readExport("02-desktop-practice-modes.svg");

  for (const id of ["documentary", "cross-cultural", "editorial-systems"]) {
    assert.match(svg, new RegExp(`id="practice-scene-${id}"`));
    assert.match(svg, new RegExp(`id="practice-${id}-primary"`));
    assert.match(svg, new RegExp(`id="practice-${id}-supporting"`));
  }
  assert.match(svg, /Documentary direction/);
  assert.match(svg, /Cross-cultural story/);
  assert.match(svg, /Editorial systems/);
  assert.match(svg, /#f0645a/i);
  assert.match(svg, /#4867d9/i);
  assert.match(svg, /#4d9259/i);
  assert.doesNotMatch(svg, /#d8ff3e/i);
});

test("work theatre export uses three full scenes and a deliberate text-led missing-image state", () => {
  const svg = readExport("03-desktop-work-theatre.svg");

  assert.match(svg, /id="work-scene-slow-steps"/);
  assert.match(svg, /id="work-scene-tech-dreamers"/);
  assert.match(svg, /id="work-scene-my-art-my-voice"/);
  assert.match(svg, /id="work-slow-steps-text-led-field"/);
  assert.match(svg, /A quiet travel documentary/);
  assert.match(svg, /my-art-my-voice-performance-2\.jpg/);
  assert.doesNotMatch(svg, /image pending/i);
  assert.doesNotMatch(svg, /component-work-card|compact[- ]card|moving strip/i);
  assert.doesNotMatch(svg, /#d8ff3e/i);
});

test("mobile export documents the non-sticky stacked reading path", () => {
  const svg = readExport("04-mobile-static-flow.svg");
  const readme = readExport("README.md");

  assert.match(svg, /id="frame-mobile-static-flow"/);
  assert.match(svg, /viewBox="0 0 390 4200"/);
  assert.match(svg, /id="mobile-portrait-carrier"/);
  assert.match(svg, /id="mobile-practice-stack"/);
  assert.match(svg, /id="mobile-work-stack"/);
  assert.match(svg, /id="mobile-contact"/);
  assert.match(readme, /portrait carrier/i);
  assert.match(readme, /static stacked mobile/i);
  assert.match(readme, /editable text layers/i);
  assert.doesNotMatch(svg, /#d8ff3e/i);
});
