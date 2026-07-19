import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const root = process.cwd();
const pluginDir = join(root, "figma/hsin-portfolio-importer");

function parseFrontmatter(path) {
  const raw = readFileSync(join(root, path), "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(match);
  return JSON.parse(match[1]);
}

function getGeneratedModel(code) {
  const match = code.match(/const PORTFOLIO_MODEL = (\{.*\});\n\/\* END GENERATED MODEL \*\//);
  assert.ok(match, "generated importer should expose one canonical model snapshot");
  return JSON.parse(match[1]);
}

test("Figma importer is generated from a content-free runtime template", () => {
  const result = spawnSync(process.execPath, ["scripts/build-figma-export.mjs"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);

  for (const file of ["manifest.json", "code.template.js", "code.js", "README.md"]) {
    assert.equal(existsSync(join(pluginDir, file)), true, `${file} should exist`);
  }

  const template = readFileSync(join(pluginDir, "code.template.js"), "utf8");
  const code = readFileSync(join(pluginDir, "code.js"), "utf8");
  assert.match(template, /__PORTFOLIO_MODEL__/);
  assert.doesNotMatch(template, /Slow Steps|Tech Dreamers|My Art, My Voice|hsin-working-white-space/);
  assert.doesNotMatch(code, /const (COPY|ASSETS|WORKS|LOGOS)\s*=/);
  assert.doesNotMatch(code, /#D8FF3E|accent-acid|portrait-carrier|ambient|glow/i);

  const syntax = spawnSync(process.execPath, ["--check", join(pluginDir, "code.js")], { encoding: "utf8" });
  assert.equal(syntax.status, 0, syntax.stderr || syntax.stdout);
});

test("generated importer snapshot matches canonical sources and approved counts", () => {
  const code = readFileSync(join(pluginDir, "code.js"), "utf8");
  const model = getGeneratedModel(code);
  const site = JSON.parse(readFileSync(join(root, "data/site.json"), "utf8"));
  const media = JSON.parse(readFileSync(join(root, "data/media.json"), "utf8"));
  const collaborations = JSON.parse(readFileSync(join(root, "data/collaborations.json"), "utf8"));
  const works = readdirSync(join(root, "content/works"))
    .filter((name) => name.endsWith(".md"))
    .map((name) => parseFrontmatter(`content/works/${name}`))
    .filter((work) => work.featured)
    .sort((a, b) => a.order - b.order);

  assert.equal(model.content.en.name, site.en.name);
  assert.equal(model.media.hero.src, media.hero.poster);
  assert.deepEqual(model.works.map((work) => work.slug), works.map((work) => work.slug));
  assert.deepEqual(model.collaborations.map((item) => item.name), collaborations.map((item) => item.name));
  assert.equal(model.watchPreviews.length, 5);
  assert.equal(model.works.length, 6);
  assert.equal(model.archive.length, 4);
  assert.equal(model.watchPreviews[0].slug, "slow-steps");
  assert.equal(model.watchPreviews[0].media.status, "text-first");
  assert.equal(model.watchPreviews.some((item) => item.slug === "interior-spatial-brand-films"), false);
  assert.equal(model.works.find((work) => work.slug === "tech-dreamers").media.src, "https://prod-img.taiwanplus.com/program/224be7ed-057b-400f-af63-a8582cd80cfb.webp");
  for (const work of works) {
    const generated = model.works.find((item) => item.slug === work.slug);
    assert.equal(generated.media.mobileFocalPoint, work.mobileFocalPoint);
  }
  const myArt = model.works.find((work) => work.slug === "my-art-my-voice");
  assert.deepEqual(myArt.supportingMedia.map((item) => item.src), [
    "/assets/portfolio/my-art-my-voice-performance-1.jpg",
    "/assets/portfolio/my-art-my-voice-interview.jpg",
  ]);
  assert.equal(myArt.supportingMedia[1].mobileFocalPoint, "50% 45%");
});

test("Figma importer builds editable hybrid pages in fixed order and preserves remote media references", () => {
  const code = readFileSync(join(pluginDir, "code.js"), "utf8");
  const manifest = JSON.parse(readFileSync(join(pluginDir, "manifest.json"), "utf8"));

  assert.equal(manifest.name, "Hsin Portfolio Importer");
  assert.equal(manifest.main, "code.js");
  assert.ok(manifest.networkAccess.allowedDomains.includes("https://hsin-hsin-yuan-portfolio.vercel.app"));
  assert.ok(manifest.networkAccess.allowedDomains.includes("https://prod-img.taiwanplus.com"));
  assert.ok(manifest.networkAccess.allowedDomains.includes("https://i.ytimg.com"));

  for (const api of ["figma.createFrame()", "figma.createText()", "figma.createRectangle()", "figma.createImageAsync"]){
    assert.match(code, new RegExp(api.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(code, /Desktop \/ Portfolio \/ Editorial Watch Loop Hybrid/);
  assert.match(code, /Mobile \/ Portfolio \/ Editorial Watch Loop Hybrid/);
  assert.match(code, /createHybridSections/);
  assert.match(code, /sectionKey === "watchLoop" && mode === "mobile"/);
  assert.match(code, /asset\.startsWith\("http"\) \? asset :/);
  assert.match(code, /Remote media reference/);

  const order = ["hero", "collaborations", "watchLoop", "availability", "selectedWorks", "collaborationFit", "archive", "contact"];
  const orderLiteral = JSON.stringify(order);
  assert.match(code, new RegExp(orderLiteral.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});
