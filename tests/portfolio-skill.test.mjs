import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const skillRoot = join(root, ".agents/skills/portfolio-narrative-builder");

test("the tracked portfolio skill routes existing-site hybrid work", () => {
  const skill = readFileSync(join(skillRoot, "SKILL.md"), "utf8");
  assert.match(skill, /^---\nname: portfolio-narrative-builder\n/m);
  assert.match(skill, /materially reshaping an existing portfolio/i);
  assert.match(skill, /existing-site-hybrid-refactor\.md/);
  assert.match(skill, /replaceable-media-and-design-sync\.md/);
  assert.match(skill, /validation-gates\.md/);
  assert.match(skill, /frontend-design/);
  assert.match(skill, /reviewing-with-multiple-ai/);
  for (const file of [
    "process-patterns.md",
    "existing-site-hybrid-refactor.md",
    "replaceable-media-and-design-sync.md",
    "validation-gates.md",
  ]) {
    assert.equal(existsSync(join(skillRoot, "references", file)), true, file);
  }
});

test("the tracked skill keeps provider runtime facts in the canonical review skill", () => {
  const skillFiles = [
    "SKILL.md",
    "references/process-patterns.md",
    "references/existing-site-hybrid-refactor.md",
    "references/replaceable-media-and-design-sync.md",
    "references/validation-gates.md",
  ]
    .map((file) => readFileSync(join(skillRoot, file), "utf8"))
    .join("\n");

  assert.doesNotMatch(skillFiles, /GEMINI_API_KEY|AQ\.|claude-fable-5|quotaId/);
});

test("validation gates reject stale preview servers before visual QA", () => {
  const gates = readFileSync(
    join(skillRoot, "references/validation-gates.md"),
    "utf8",
  );

  assert.match(gates, /before visual QA/i);
  assert.match(gates, /chosen port.*(?:free|available)/i);
  assert.match(gates, /served content fingerprint/i);
  assert.match(gates, /worktree/i);
  assert.match(gates, /unique port/i);
  assert.match(gates, /server[- ]ready.*current build/i);
});

test("project bible protects the selected hybrid behavior", () => {
  const bible = readFileSync(join(root, "PROJECT_BIBLE.md"), "utf8");
  assert.match(bible, /five moving-image previews/i);
  assert.match(bible, /text-first/i);
  assert.match(bible, /data-only media replacement/i);
  assert.match(bible, /no ambient glow/i);
});
