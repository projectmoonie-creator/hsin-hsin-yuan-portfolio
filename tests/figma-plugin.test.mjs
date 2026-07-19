import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const root = process.cwd();
const pluginDir = join(root, "figma/hsin-portfolio-importer");

test("Figma importer plugin files are present, configured, and syntactically valid", () => {
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

  const syntax = spawnSync(process.execPath, ["--check", codePath], { encoding: "utf8" });
  assert.equal(syntax.status, 0, syntax.stderr || syntax.stdout);
});

test("Figma importer builds the portrait carrier, practice modes, and work theatre", () => {
  const code = readFileSync(join(pluginDir, "code.js"), "utf8");

  assert.match(code, /figma\.createFrame\(\)/);
  assert.match(code, /figma\.createText\(\)/);
  assert.match(code, /figma\.createRectangle\(\)/);
  assert.match(code, /figma\.createImageAsync/);

  for (const token of ["#050807", "#dddcd7", "#f6f4ee", "#f0645a", "#4867d9", "#4d9259"]) {
    assert.match(code, new RegExp(token, "i"));
  }

  assert.match(code, /Portrait carrier \/ Opening/);
  assert.match(code, /Portrait carrier \/ Release/);
  assert.match(code, /Practice mode \/ Documentary direction/);
  assert.match(code, /Practice mode \/ Cross-cultural story/);
  assert.match(code, /Practice mode \/ Editorial systems/);
  assert.match(code, /Work theatre \/ Slow Steps/);
  assert.match(code, /Work theatre \/ Tech Dreamers/);
  assert.match(code, /Work theatre \/ My Art, My Voice/);
  assert.match(code, /Mobile \/ Static stacked flow/);
  assert.match(code, /hsin-portrait-foreground\.webp/);
  assert.match(code, /my-art-my-voice-performance-2\.jpg/);

  assert.doesNotMatch(code, /#d8ff3e/i);
  assert.doesNotMatch(code, /color\/accent-acid/i);
  assert.doesNotMatch(code, /compact[- ]card|moving strip|Work card/i);
});
