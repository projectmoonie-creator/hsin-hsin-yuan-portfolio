import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const pluginDir = join(root, "figma/hsin-portfolio-importer");

test("Figma importer plugin files are present and configured", () => {
  const manifestPath = join(pluginDir, "manifest.json");
  const codePath = join(pluginDir, "code.js");
  const readmePath = join(pluginDir, "README.md");

  assert.equal(existsSync(manifestPath), true);
  assert.equal(existsSync(codePath), true);
  assert.equal(existsSync(readmePath), true);

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  assert.equal(manifest.name, "Hsin Portfolio Importer");
  assert.equal(manifest.main, "code.js");
  assert.equal(manifest.editorType.includes("figma"), true);
  assert.equal(manifest.networkAccess.allowedDomains.includes("https://hsin-hsin-yuan-portfolio.vercel.app"), true);
});

test("Figma importer creates editable portfolio layers", () => {
  const code = readFileSync(join(pluginDir, "code.js"), "utf8");

  assert.match(code, /figma\.createFrame\(\)/);
  assert.match(code, /figma\.createText\(\)/);
  assert.match(code, /figma\.createRectangle\(\)/);
  assert.match(code, /figma\.createImageAsync/);
  assert.match(code, /HSIN-HSIN/);
  assert.match(code, /Documentary Director/);
  assert.match(code, /Desktop \/ Portfolio/);
  assert.match(code, /Mobile \/ Portfolio/);
  assert.match(code, /my-art-my-voice-performance-2\.jpg/);
  assert.match(code, /color\/accent-acid/);
  assert.match(code, /Slow Steps/);
  assert.match(code, /Tech Dreamers/);
  assert.match(code, /Director \/ Editor \/ Producer/);
  assert.doesNotMatch(code, /Upcoming/);
  assert.doesNotMatch(code, /Selected Impact/);
  assert.doesNotMatch(code, /paris-cultural-olympiad-team\.jpg/);
});
