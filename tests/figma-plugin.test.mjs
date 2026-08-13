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
  assert.deepEqual(manifest.networkAccess.allowedDomains, ["https://hsinhsinyuan.com"]);

  const readme = readFileSync(readmePath, "utf8");
  assert.match(readme, /Status: `LEGACY_REFERENCE_DO_NOT_USE`/);
  assert.match(readme, /npm run figma:export/);
  assert.match(readme, /not a bidirectional content importer/i);
});

test("Figma importer creates editable portfolio layers", () => {
  const code = readFileSync(join(pluginDir, "code.js"), "utf8");

  assert.match(code, /const SITE_URL = "https:\/\/hsinhsinyuan\.com";/);
  assert.doesNotMatch(code, /hsin-hsin-yuan-portfolio\.vercel\.app/);
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
  assert.match(code, /TaiwanPlus \/ Travel/);
  assert.match(code, /Let’s build a story together\./);
  assert.doesNotMatch(code, /Who Should Contact Me/);
  assert.doesNotMatch(code, /AI \/ Language Lab/);
  assert.doesNotMatch(code, /Independent Travel Documentary/);
  assert.doesNotMatch(code, /Upcoming/);
  assert.doesNotMatch(code, /Selected Impact/);
  assert.doesNotMatch(code, /paris-cultural-olympiad-team\.jpg/);
});
