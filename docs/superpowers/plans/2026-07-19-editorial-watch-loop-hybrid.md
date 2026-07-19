# Editorial Watch Loop Hybrid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `anthropic-skills:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a separately previewable portfolio that restores the old split hero, work order, and horizontal preview while applying the approved editorial typography, palette, rounded frames, data-only media replacement, and no-glow motion policy.

**Architecture:** Start from old stable commit `5cdb842` in the dedicated `codex/editorial-watch-loop-hybrid` worktree, then port only canonical copy, work metadata, media validation, and reusable workflow improvements from `e05556c`. Keep the static Node generator and progressive-enhancement JavaScript, but replace the owning CSS/JS architecture instead of appending overrides. Keep all six works as anchored editorial rows and use one isolated watch-loop controller for the five approved previews.

**Tech Stack:** Node.js ESM, static HTML generation, native CSS, native browser JavaScript, Node test runner, SVG/Figma importer tooling, Vercel preview deployments.

---

## File Structure

### Canonical content and media

- Create: `data/media.json` — hybrid showreel media role, dimensions, focal points, and bilingual alt text.
- Modify: `content/works/my-art-my-voice.md` — approved alt/focal/supporting metadata and dimensions.
- Modify: `content/works/slow-steps.md` — explicit text-first poster contract.
- Modify: `content/works/tech-dreamers.md` — official poster, metadata audit fields, focal point, and dimensions.
- Modify: `content/works/pts-taigi-bus.md` — poster alt, focal point, and 480×360 dimensions.
- Modify: `content/works/top-gear-china-uk-special.md` — poster alt, focal point, and 1600×1066 dimensions.
- Create: `scripts/media-manifest.mjs` — one importable hybrid media validator.
- Create: `scripts/validate-media-manifest.mjs` — small CLI wrapper around the shared validator.
- Create: `tests/media-contract.test.mjs` — manifest and work-media contract.

### Reusable portfolio workflow

- Create: `.agents/skills/portfolio-narrative-builder/SKILL.md` — tracked mirror of the existing umbrella skill with hybrid routing.
- Create: `.agents/skills/portfolio-narrative-builder/agents/openai.yaml` — interface metadata aligned with the broader trigger.
- Create: `.agents/skills/portfolio-narrative-builder/references/process-patterns.md` — tracked current reference with cross-output rules deduplicated.
- Create: `.agents/skills/portfolio-narrative-builder/references/existing-site-hybrid-refactor.md` — checkpoint/worktree, selective-port, and owner-level retirement workflow.
- Create: `.agents/skills/portfolio-narrative-builder/references/replaceable-media-and-design-sync.md` — media/Figma single-source contract.
- Create: `.agents/skills/portfolio-narrative-builder/references/validation-gates.md` — semantic, visual, motion, rollback, and external-review gates.
- Create: `tests/portfolio-skill.test.mjs` — skill structure, trigger, references, and validator regression tests.
- Modify: `PROJECT_BIBLE.md` — approved hybrid rules and corrected preview eligibility.

### Site generation and interaction

- Modify: `data/site.json` — current bilingual copy schema plus `watchLoopAria`, changed atomically with the generator.
- Modify: `scripts/build-site.mjs` — load the media manifest and render the approved architecture.
- Create: `src/watch-loop.js` — isolated watch-loop progressive enhancement.
- Modify: `src/main.js` — showreel, contact form, and watch-loop initialization only.
- Modify: `src/styles.css` — complete editorial visual system at the owning source.
- Delete: `src/ambient-background.js` — retired WebGL owner.
- Modify: `package.json` — remove Anime.js/OGL and add media-validation script.
- Modify: `package-lock.json` — lockfile without retired dependencies.
- Modify: `tests/build-site.test.mjs` — semantic architecture and generated-output tests.
- Create: `tests/watch-loop.test.mjs` — motion-policy and runtime-source tests.
- Create: `tests/styles.test.mjs` — approved tokens and legacy-fingerprint absence tests.

### Figma and handoff

- Modify: `scripts/build-figma-export.mjs` — hybrid desktop/mobile frames and manifest.
- Create: `figma/hsin-portfolio-importer/code.template.js` — editable hybrid page builders with one generated-data insertion point.
- Modify: `figma/hsin-portfolio-importer/code.js` — generated importer containing the canonical content/media snapshot.
- Modify: `figma/hsin-portfolio-importer/manifest.json` — explicit network domains for canonical remote media.
- Modify: `figma/hsin-portfolio-importer/README.md` — import and round-trip instructions.
- Replace: `figma-export/01-desktop-home.svg` — generated hybrid opening flow.
- Replace: `figma-export/02-desktop-works-logos.svg` — generated watch loop and six-work system.
- Replace: `figma-export/03-mobile-home.svg` — generated static mobile flow.
- Create: `figma-export/manifest.json` — generated frame inventory and token record.
- Modify: `figma-export/README.md` — active export descriptions.
- Modify: `docs/figma-design-layer.md` — hybrid round-trip contract.
- Modify: `tests/figma-export.test.mjs` — active-frame, token, and no-glow checks.
- Modify: `tests/figma-plugin.test.mjs` — importer page/order/token checks.
- Create: `tests/figma-sync.test.mjs` — canonical-data propagation across SVG and importer output.

### Verification, review, and preview

- Create: `docs/reviews/2026-07-19-editorial-watch-loop-visual-qa.md` — fixed-viewport and reduced-motion evidence.
- Create: `docs/reviews/2026-07-19-editorial-watch-loop-review-packet.md` — frozen read-only reviewer packet.
- Create: `docs/reviews/2026-07-19-editorial-watch-loop-claude-review.json` — raw Claude result or incomplete-attempt status.
- Create: `docs/reviews/2026-07-19-editorial-watch-loop-gemini-packet.md` — Claude-adjudication packet for Gemini.
- Create: `docs/reviews/2026-07-19-editorial-watch-loop-gemini-review.md` — Gemini adjudication or incomplete-attempt status.
- Create: `docs/reviews/2026-07-19-editorial-watch-loop-adjudication.md` — maintainer decision matrix.

## Task 1: Port Canonical Copy And Define The Hybrid Media Contract

**Files:**

- Create: `data/media.json`
- Modify: `content/works/my-art-my-voice.md`
- Modify: `content/works/slow-steps.md`
- Modify: `content/works/tech-dreamers.md`
- Modify: `content/works/pts-taigi-bus.md`
- Modify: `content/works/top-gear-china-uk-special.md`
- Create: `scripts/media-manifest.mjs`
- Create: `scripts/validate-media-manifest.mjs`
- Create: `tests/media-contract.test.mjs`

- [ ] **Step 1: Write the failing canonical-media test**

Create `tests/media-contract.test.mjs` with these public invariants:

```js
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { loadWorks } from "../scripts/build-site.mjs";

const root = process.cwd();

test("hybrid media uses a replaceable split-showreel contract", () => {
  const media = JSON.parse(readFileSync(join(root, "data/media.json"), "utf8"));

  assert.equal(media.hero.treatment, "split-showreel");
  assert.equal(media.hero.poster, "/assets/showreel/website-visual-reel-poster.png");
  assert.equal(media.hero.video, "/assets/showreel/website-visual-reel.mp4");
  assert.deepEqual(media.hero.dimensions, { width: 1920, height: 1080 });
  assert.match(media.hero.desktopFocalPoint, /^\d{1,3}% \d{1,3}%$/);
  assert.match(media.hero.mobileFocalPoint, /^\d{1,3}% \d{1,3}%$/);
  assert.ok(media.hero.alt.en.length > 10);
  assert.ok(media.hero.alt.zh.length > 6);
});

test("every approved work poster has alt, focal point, and dimensions", () => {
  const works = loadWorks(join(root, "content/works"));
  const posterWorks = works.filter((work) => work.posterImage);

  assert.deepEqual(posterWorks.map((work) => work.slug), [
    "tech-dreamers",
    "my-art-my-voice",
    "pts-taigi-bus",
    "top-gear-china-uk-special",
  ]);
  for (const work of posterWorks) {
    assert.ok(work.posterAlt.en.trim());
    assert.ok(work.posterAlt.zh.trim());
    assert.match(work.focalPoint, /^\d{1,3}% \d{1,3}%$/);
    assert.ok(work.posterDimensions.width > 0);
    assert.ok(work.posterDimensions.height > 0);
  }
});

test("the tracked validator accepts the hybrid manifest", () => {
  execFileSync(
    process.execPath,
    [
      "scripts/validate-media-manifest.mjs",
      "data/media.json",
      "public",
    ],
    { cwd: root, stdio: "pipe" },
  );
});
```

- [ ] **Step 2: Run the test and verify the missing manifest/skill failure**

Run: `node --test tests/media-contract.test.mjs`

Expected: FAIL because `data/media.json` and the shared validator are not present on the old baseline.

- [ ] **Step 3: Add the global showreel manifest**

Create `data/media.json` with this exact role contract:

```json
{
  "hero": {
    "treatment": "split-showreel",
    "poster": "/assets/showreel/website-visual-reel-poster.png",
    "video": "/assets/showreel/website-visual-reel.mp4",
    "dimensions": { "width": 1920, "height": 1080 },
    "desktopFocalPoint": "50% 50%",
    "mobileFocalPoint": "50% 50%",
    "alt": {
      "en": "Selected moving-image work by Hsin-Hsin Yuan",
      "zh": "袁欣欣的精選影像作品"
    }
  }
}
```

- [ ] **Step 4: Port approved work metadata and add measured dimensions**

Apply the `e05556c` copy/press/media changes for My Art, Slow Steps, and Tech Dreamers. Add these measured `posterDimensions` values:

```json
"posterDimensions": { "width": 1280, "height": 720 }
```

for Tech Dreamers;

```json
"posterDimensions": { "width": 1600, "height": 900 }
```

for My Art, My Voice;

```json
"posterAlt": {
  "en": "Bus travel episode still from PTS Taigi",
  "zh": "公視台語台《無事坐巴士》節目畫面"
},
"focalPoint": "50% 50%",
"posterDimensions": { "width": 480, "height": 360 }
```

for PTS Taigi; and

```json
"posterAlt": {
  "en": "Car filmed for the Top Gear China UK special",
  "zh": "《巔峰拍檔》中國版英國篇拍攝車輛"
},
"focalPoint": "50% 50%",
"posterDimensions": { "width": 1600, "height": 1066 }
```

for Top Gear. Slow Steps remains explicitly text-first with an empty `posterImage`, empty bilingual `posterAlt`, `focalPoint: "50% 50%"`, and `supportingImages: []`. Do not assign it another project's image or invent a public watch URL.

- [ ] **Step 5: Add one shared validator and a CLI wrapper**

Create `scripts/media-manifest.mjs` with the exported function below, then make `scripts/validate-media-manifest.mjs` read the two CLI arguments, call it, and print `Media manifest is valid.`:

```js
import { existsSync } from "node:fs";
import { resolve } from "node:path";

export function validateMediaManifest(manifest, publicDir = "public") {
  const hero = manifest?.hero;
  if (hero?.treatment !== "split-showreel") throw new Error("hero.treatment must be split-showreel");
  if (!hero.poster || !hero.video) throw new Error("split-showreel requires hero.poster and hero.video");
  if (!(hero.dimensions?.width > 0) || !(hero.dimensions?.height > 0)) {
    throw new Error("split-showreel requires positive hero.dimensions");
  }
  for (const field of ["desktopFocalPoint", "mobileFocalPoint"]) {
    if (!/^\d{1,3}% \d{1,3}%$/.test(hero[field] || "")) throw new Error(`hero.${field} must use X% Y%`);
  }
  for (const lang of ["en", "zh"]) {
    if (!hero.alt?.[lang]?.trim()) throw new Error(`hero.alt.${lang} is required`);
  }
  for (const [role, asset] of [["poster", hero.poster], ["video", hero.video]]) {
    if (/^https?:/.test(asset)) continue;
    const localPath = resolve(publicDir, asset.replace(/^\//, ""));
    if (!existsSync(localPath)) throw new Error(`hero.${role} does not exist: ${localPath}`);
  }
}
```

Create `scripts/validate-media-manifest.mjs` with:

```js
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { validateMediaManifest } from "./media-manifest.mjs";

const [manifestArg, publicArg = "public"] = process.argv.slice(2);
if (!manifestArg) throw new Error("Usage: validate-media-manifest.mjs <manifest.json> [public-dir]");
const manifest = JSON.parse(readFileSync(resolve(manifestArg), "utf8"));
validateMediaManifest(manifest, publicArg);
console.log("Media manifest is valid.");
```

Keep validation logic in one file so the site, Figma generator, CLI, and tests can import the same function.

- [ ] **Step 6: Run media tests and the complete old-baseline suite**

Run:

```bash
node --test tests/media-contract.test.mjs
npm test
```

Expected: the media contract and existing baseline suite PASS. If a ported press-audit date changes an old assertion, update that assertion to verify required audit fields rather than pinning one project's date.

- [ ] **Step 7: Commit the bounded content contract**

```bash
git add data/media.json content/works scripts/media-manifest.mjs scripts/validate-media-manifest.mjs tests/media-contract.test.mjs
git commit -m "Port canonical content and hybrid media contract"
```

## Task 2: Extend The Existing Portfolio Skill With A Tracked Hybrid Workflow

**Files:**

- Create: `.agents/skills/portfolio-narrative-builder/SKILL.md`
- Create: `.agents/skills/portfolio-narrative-builder/agents/openai.yaml`
- Create: `.agents/skills/portfolio-narrative-builder/references/process-patterns.md`
- Create: `.agents/skills/portfolio-narrative-builder/references/existing-site-hybrid-refactor.md`
- Create: `.agents/skills/portfolio-narrative-builder/references/replaceable-media-and-design-sync.md`
- Create: `.agents/skills/portfolio-narrative-builder/references/validation-gates.md`
- Create: `tests/portfolio-skill.test.mjs`
- Modify: `PROJECT_BIBLE.md`

- [ ] **Step 1: Write failing skill-structure and trigger tests**

Create `tests/portfolio-skill.test.mjs`:

```js
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
  ]) assert.equal(existsSync(join(skillRoot, "references", file)), true, file);
});

test("the tracked skill keeps provider runtime facts in the canonical review skill", () => {
  const skillFiles = [
    "SKILL.md",
    "references/process-patterns.md",
    "references/existing-site-hybrid-refactor.md",
    "references/replaceable-media-and-design-sync.md",
    "references/validation-gates.md",
  ].map((file) => readFileSync(join(skillRoot, file), "utf8")).join("\n");
  assert.doesNotMatch(skillFiles, /GEMINI_API_KEY|AQ\.|claude-fable-5|quotaId/);
});

test("project bible protects the selected hybrid behavior", () => {
  const bible = readFileSync(join(root, "PROJECT_BIBLE.md"), "utf8");
  assert.match(bible, /five moving-image previews/i);
  assert.match(bible, /text-first/i);
  assert.match(bible, /data-only media replacement/i);
  assert.match(bible, /no ambient glow/i);
});
```

- [ ] **Step 2: Run the skill tests and verify the missing tracked mirror failure**

Run: `node --test tests/portfolio-skill.test.mjs`

Expected: FAIL because the hybrid repo does not yet contain the tracked skill source.

- [ ] **Step 3: Mirror the existing umbrella skill, then make the router concise**

Use `/Users/hsin-hsinyuan/Documents/Claude/Projects/Moonie V/.agents/skills/portfolio-narrative-builder` as the source, preserving its evidence, narrative, rights, privacy, bilingual, and publishability rules. Update its frontmatter description to include new builds, material reshaping of an existing portfolio, design-reference translation, parallel site/Figma outputs, and replaceable-media handoff.

The body must route an existing-site redesign directly to the three new references and say:

```markdown
**REQUIRED SUB-SKILL:** Use `frontend-design` before changing an active visual system.

For an existing-site hybrid, read:
- `references/existing-site-hybrid-refactor.md`
- `references/replaceable-media-and-design-sync.md`
- `references/validation-gates.md`

When the user asks for Claude, Gemini, Codex, another named reviewer, or two reviewers:
**REQUIRED SUB-SKILL:** Use `reviewing-with-multiple-ai`.
```

Do not create a second overlapping cinematic-portfolio skill. `portfolio-narrative-builder` remains the one user-facing invocation.

- [ ] **Step 4: Add the generic existing-site hybrid reference**

`references/existing-site-hybrid-refactor.md` must define:

```markdown
# Existing-Site Hybrid Refactor

1. Record the current checkpoint and the stable structural baseline by commit and matched screenshots.
2. Preserve the checkpoint with a branch and annotated tag.
3. Create a separate branch and worktree from the structural baseline.
4. Classify each source/output as keep, port, rewrite, or retire.
5. Port canonical content/media before adapting the structural generator.
6. Restore useful behavior in an isolated owner; never restore its retired dependencies or surface effects.
7. Replace high-salience fingerprints at the token, component, controller, exporter, and importer that own them.
8. Add negative proof for retired fingerprints and positive proof for deliberately kept behavior.
9. Compare matched desktop, mobile, reduced-motion, and no-JavaScript states.
10. Deploy a preview; require explicit user approval before production promotion.
```

Explicitly prohibit Finder copies as the primary recovery mechanism, whole-tree merges of two designs, runtime theme flags, and end-of-file tail themes.

- [ ] **Step 5: Add media/Figma single-source and validation references**

`references/replaceable-media-and-design-sync.md` must require named role, source, localized alt, desktop/mobile focal points, width/height, rights status, optionality, and treatment. Ordinary replacement changes only the asset plus manifest/frontmatter. HTML uses semantic images. Site generator, SVG exporter, and Figma importer consume a canonical data snapshot; the importer must not maintain parallel hardcoded `COPY`, `ASSETS`, or `WORKS` arrays.

`references/validation-gates.md` must require TDD, active-output legacy search, fixed desktop/mobile screenshots, reduced motion, no JavaScript, keyboard focus, body overflow, Figma parity, rollback, and `$reviewing-with-multiple-ai` for requested external review. Separate allowed content motion from retired ambient effects.

- [ ] **Step 6: Update the Bible and deduplicate reviewer guidance**

Add an `Editorial Watch Loop Hybrid` section to `PROJECT_BIBLE.md` containing the approved page order, five previews/six works rule, Slow Steps text-first exception, data-only replacement, no ambient glow, no tail overrides, Figma canonical-data parity, and production-preview gate. Replace the old rule “Works enter the screening strip only when they have a public watchUrl” with the approved eligibility rule.

In the mirrored `process-patterns.md`, replace independent reviewer instructions with a direct pointer to `$reviewing-with-multiple-ai`. Do not copy credentials, quota facts, model routing, wrapper commands, or authentication diagnosis into the portfolio skill.

- [ ] **Step 7: Run structural validation and placeholder scans**

Run:

```bash
node --test tests/portfolio-skill.test.mjs
python3 /Users/hsin-hsinyuan/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/portfolio-narrative-builder
rg -n "T[B]D|T[O]DO|f[i]ll in|implement l[a]ter" .agents/skills/portfolio-narrative-builder
```

Expected: Node tests PASS, `quick_validate.py` reports `Skill is valid!`, and the placeholder scan returns no matches.

- [ ] **Step 8: Commit the tracked reusable workflow**

```bash
git add .agents/skills/portfolio-narrative-builder PROJECT_BIBLE.md tests/portfolio-skill.test.mjs
git commit -m "Extend portfolio skill for hybrid refactors"
```

## Task 3: Rewrite The Generator Around The Approved Hybrid Architecture

**Files:**

- Modify: `data/site.json`
- Modify: `scripts/build-site.mjs`
- Modify: `tests/build-site.test.mjs`

- [ ] **Step 1: Replace old visual-fingerprint assertions with semantic hybrid tests**

Keep parsing, ordering, press-audit, contact, SEO, and bilingual tests. Replace the monolithic old-layout test with focused tests for:

```js
test("renderPage follows the approved hybrid order", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const html = renderPage({ lang: "en", site, works });
  const markers = [
    'class="hero"',
    'class="section collab-section',
    'data-watch-loop',
    'id="available"',
    'id="works"',
    'class="section collaboration-fit"',
    'class="section archive-section"',
    'id="contact"',
  ];
  const positions = markers.map((marker) => html.indexOf(marker));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
});

test("renderPage exposes five previews and six anchored work rows", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const html = renderPage({ lang: "en", site, works });
  assert.equal((html.match(/class="watch-loop-card/g) || []).length, 5);
  assert.equal((html.match(/class="work-row/g) || []).length, 6);
  for (const slug of works.map((work) => work.slug)) assert.match(html, new RegExp(`id="${slug}"`));
  assert.match(html, /watch-loop-card watch-loop-card--text/);
  assert.doesNotMatch(html, /href=""/);
});

test("renderPage retires services, lab, portrait carrier, and ambient layers", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const html = renderPage({ lang: "en", site, works });
  for (const fingerprint of [
    "services-grid",
    "lab-section",
    "portrait-carrier",
    "portrait-signal",
    "light-beam-layer",
    "ambient-canvas",
    "data-scroll-stack",
  ]) assert.doesNotMatch(html, new RegExp(fingerprint));
});
```

Also assert that poster-backed watch cards contain `<img>` with localized alt, width, height, and a non-empty `--media-focal` inline custom property; Slow Steps contains no image; and all five preview links point to real internal anchors.

- [ ] **Step 2: Run the focused tests and verify failure against the old generator**

Run: `node --test tests/build-site.test.mjs`

Expected: FAIL on current schema mapping, work-row class, removed services/lab/effects, and semantic preview images.

- [ ] **Step 3: Port the current copy without reviving retired fields**

Use `e05556c:data/site.json` as the copy source and add:

```json
"watchLoopAria": "Selected moving-image works"
```

to English and:

```json
"watchLoopAria": "代表影像作品"
```

to Chinese. Keep `name`, `heroRoles`, `portraitRole`, `portraitStatement`, `portraitAccent`, `practiceModes`, `workTheatreTitle`, availability, archive, collaboration, contact, and form copy. Do not restore `navName`, `heroEyebrow`, `heroTitleLines`, `heroSubcopy`, `worksLabel`, `services`, `labTitle`, or `labSubcopy`.

- [ ] **Step 4: Load the global media manifest**

Change `loadSiteData()` to return `media`:

```js
import { validateMediaManifest } from "./media-manifest.mjs";

export function loadSiteData(baseDir = root) {
  const media = JSON.parse(readFileSync(join(baseDir, "data/media.json"), "utf8"));
  validateMediaManifest(media, join(baseDir, "public"));
  return {
    site: JSON.parse(readFileSync(join(baseDir, "data/site.json"), "utf8")),
    media,
    collaborations: JSON.parse(readFileSync(join(baseDir, "data/collaborations.json"), "utf8")),
    archive: loadMarkdownCollection(join(baseDir, "content/archive")),
  };
}
```

Stop loading homepage lab entries.

- [ ] **Step 5: Render media as semantic images**

Replace CSS-background helpers with one image renderer:

```js
function renderWorkImage(work, lang, className, loading = "lazy") {
  if (!work.posterImage) return "";
  const alt = localize(work.posterAlt, lang);
  const width = work.posterDimensions?.width;
  const height = work.posterDimensions?.height;
  return `<img class="${escapeHtml(className)}" src="${escapeHtml(work.posterImage)}" alt="${escapeHtml(alt)}" width="${escapeHtml(width)}" height="${escapeHtml(height)}" loading="${escapeHtml(loading)}" decoding="async" style="--media-focal: ${escapeHtml(work.focalPoint || "50% 50%")}">`;
}
```

Remove `escapeCssUrl()` and `cssUrl()` after all inline `background-image` usage is gone.

- [ ] **Step 6: Implement five internal preview links**

Use this explicit eligibility rule:

```js
function isWatchLoopWork(work) {
  return Boolean(work.watchUrl) || work.slug === "slow-steps";
}
```

`renderWatchLoopItem()` must link to `#${work.slug}`, use a text-first modifier when `posterImage` is empty, and never put the external watch URL on the preview card. `renderWatchLoop()` must use `copy.watchLoopAria` and emit one original `.watch-loop-sequence`; duplication belongs only to progressive-enhancement JavaScript.

- [ ] **Step 7: Render the split hero and six editorial work rows**

Map current copy without retired fields:

```js
const heroRole = copy.portraitRole;
const heroStatement = copy.portraitStatement;
const heroAccent = copy.portraitAccent;
const worksTitle = copy.workTheatreTitle;
const brand = copy.name;
```

Hero media reads `site.media.hero.poster`, `site.media.hero.video`, dimensions, focal points, and localized alt. It retains the inline showreel play control. Work rows render title, year, role, platform, concise description, current metrics/press where present, current supporting media where present, and one watch/status action. Render all six works in canonical order.

- [ ] **Step 8: Assemble only the approved page order**

`renderPage()` must emit:

```html
<header class="topbar"></header>
<main>
  <section class="hero"></section>
  <section class="section collab-section collab-section-early"></section>
  <section class="section watch-loop-section watch-loop" data-watch-loop></section>
  <section class="section available-section" id="available"></section>
  <section class="section works-section" id="works"></section>
  <section class="section collaboration-fit"></section>
  <section class="section archive-section"></section>
  <section class="section contact" id="contact"></section>
</main>
<footer class="site-footer"></footer>
```

The topbar nav targets `#works`, `#available`, and `#contact`; the language switch remains a real link. No services grid, lab section, ambient layer, portrait carrier, or sticky work theatre appears.

- [ ] **Step 9: Run generator tests**

Run: `node --test tests/build-site.test.mjs tests/media-contract.test.mjs`

Expected: all tests PASS.

- [ ] **Step 10: Commit the generator architecture**

```bash
git add data/site.json scripts/build-site.mjs tests/build-site.test.mjs
git commit -m "Rebuild homepage generator for editorial hybrid"
```

## Task 4: Isolate The Watch Loop And Remove Legacy Runtimes

**Files:**

- Create: `src/watch-loop.js`
- Modify: `src/main.js`
- Delete: `src/ambient-background.js`
- Modify: `scripts/build-site.mjs`
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `tests/watch-loop.test.mjs`
- Modify: `tests/build-site.test.mjs`

- [ ] **Step 1: Write failing motion-policy tests**

Create `tests/watch-loop.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { watchLoopMotionAllowed } from "../src/watch-loop.js";

test("watch loop auto motion is desktop-only and respects reduced motion", () => {
  assert.equal(watchLoopMotionAllowed({ reducedMotion: false, narrowViewport: false }), true);
  assert.equal(watchLoopMotionAllowed({ reducedMotion: true, narrowViewport: false }), false);
  assert.equal(watchLoopMotionAllowed({ reducedMotion: false, narrowViewport: true }), false);
});

test("watch loop controller clones accessibly and pauses for interaction", () => {
  const source = readFileSync(new URL("../src/watch-loop.js", import.meta.url), "utf8");
  assert.match(source, /aria-hidden/);
  assert.match(source, /tabIndex = -1/);
  assert.match(source, /mouseenter/);
  assert.match(source, /focusin/);
  assert.match(source, /pointerdown/);
  assert.match(source, /IntersectionObserver/);
  assert.doesNotMatch(source, /wheel/);
});
```

- [ ] **Step 2: Run the tests and verify the missing module failure**

Run: `node --test tests/watch-loop.test.mjs`

Expected: FAIL with module-not-found for `src/watch-loop.js`.

- [ ] **Step 3: Create the isolated watch-loop module**

Implement this complete controller:

```js
export function watchLoopMotionAllowed({ reducedMotion, narrowViewport }) {
  return !reducedMotion && !narrowViewport;
}

export function initWatchLoops(root = document, view = window) {
  const reducedMotion = view.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const narrowViewport = view.matchMedia("(max-width: 640px)").matches;
  if (!watchLoopMotionAllowed({ reducedMotion, narrowViewport })) return;

  root.querySelectorAll("[data-watch-loop]").forEach((loop) => {
    const viewport = loop.querySelector(".watch-loop-viewport");
    const track = loop.querySelector("[data-watch-loop-track]");
    const sequence = loop.querySelector("[data-watch-loop-sequence]");
    if (!viewport || !track || !sequence) return;

    let sequenceWidth = 0;
    let offset = 0;
    let velocity = Number(loop.dataset.speed || 28);
    let lastTime = 0;
    let isInteracting = false;
    let animationFrame = 0;

    function syncLoopCopies() {
      const copies = Array.from(track.querySelectorAll("[data-watch-loop-sequence]"));
      copies.slice(1).forEach((copy) => copy.remove());
      sequenceWidth = sequence.getBoundingClientRect().width;
      if (!sequenceWidth) return;
      offset %= sequenceWidth;
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      const targetWidth = Math.max(viewport.clientWidth * 2.5, sequenceWidth * 2);
      let renderedWidth = sequenceWidth;
      while (renderedWidth < targetWidth) {
        const clone = sequence.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.querySelectorAll("a").forEach((link) => { link.tabIndex = -1; });
        track.append(clone);
        renderedWidth += sequenceWidth;
      }
    }

    function tick(time) {
      if (!lastTime) lastTime = time;
      const deltaSeconds = Math.min((time - lastTime) / 1000, 0.08);
      lastTime = time;
      const hasFocus = root.activeElement?.closest("[data-watch-loop]") === loop;
      const targetVelocity = isInteracting || hasFocus ? 0 : Number(loop.dataset.speed || 28);
      velocity = targetVelocity === 0
        ? 0
        : velocity + (targetVelocity - velocity) * Math.min(1, deltaSeconds * 5);
      if (sequenceWidth > 0) {
        offset = (offset + velocity * deltaSeconds) % sequenceWidth;
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }
      animationFrame = view.requestAnimationFrame(tick);
    }

    function startLoop() {
      if (animationFrame) return;
      lastTime = 0;
      animationFrame = view.requestAnimationFrame(tick);
    }

    function stopLoop() {
      if (!animationFrame) return;
      view.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }

    loop.addEventListener("mouseenter", () => { isInteracting = true; });
    loop.addEventListener("mouseleave", () => { isInteracting = false; });
    loop.addEventListener("focusin", () => { isInteracting = true; });
    loop.addEventListener("focusout", () => { isInteracting = false; });
    viewport.addEventListener("pointerdown", () => { isInteracting = true; });
    viewport.addEventListener("pointerup", () => { isInteracting = false; });
    viewport.addEventListener("pointercancel", () => { isInteracting = false; });

    const resizeObserver = view.ResizeObserver ? new view.ResizeObserver(syncLoopCopies) : null;
    resizeObserver?.observe(viewport);
    syncLoopCopies();

    const intersectionObserver = view.IntersectionObserver
      ? new view.IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) startLoop();
          else stopLoop();
        }, { rootMargin: "20% 0px", threshold: 0.01 })
      : null;
    if (intersectionObserver) intersectionObserver.observe(loop);
    else startLoop();

    view.addEventListener("pagehide", () => {
      stopLoop();
      intersectionObserver?.disconnect();
      resizeObserver?.disconnect();
    }, { once: true });
  });
}
```

- [ ] **Step 4: Reduce `src/main.js` to three responsibilities**

At the top:

```js
import { initWatchLoops } from "./watch-loop.js";

initWatchLoops();
```

Keep the existing inline showreel play/pause controller and contact-form submission controller. Remove Anime.js, ambient background, scroll-stack transforms, section lighting, guiding light, edge glow, pointer proximity, and related observers.

- [ ] **Step 5: Remove retired dependencies and build copies**

Remove `animejs` and `ogl` from `package.json`, add:

```json
"media:validate": "node scripts/validate-media-manifest.mjs data/media.json public"
```

Regenerate the lockfile with `npm install`. Delete `src/ambient-background.js`. In `scripts/build-site.mjs`, copy `src/watch-loop.js` to `dist/watch-loop.js` and remove ambient/vendor copying.

- [ ] **Step 6: Update build-output tests**

Assert `dist/watch-loop.js` exists and these do not exist:

```js
assert.equal(existsSync(join(root, "dist/ambient-background.js")), false);
assert.equal(existsSync(join(root, "dist/vendor/anime.esm.min.js")), false);
assert.equal(existsSync(join(root, "dist/vendor/ogl/src/index.js")), false);
```

Also assert `package.json` and `package-lock.json` contain neither dependency.

- [ ] **Step 7: Run interaction and build tests**

Run:

```bash
npm run media:validate
node --test tests/watch-loop.test.mjs tests/build-site.test.mjs
npm run build
```

Expected: validator PASS, tests PASS, and build completes without a `vendor` or ambient file.

- [ ] **Step 8: Commit the runtime cleanup**

```bash
git add src scripts/build-site.mjs package.json package-lock.json tests
git commit -m "Isolate watch loop and retire ambient effects"
```

## Task 5: Replace The Old Stylesheet With The Editorial Visual System

**Files:**

- Modify: `src/styles.css`
- Create: `tests/styles.test.mjs`

- [ ] **Step 1: Write failing visual-contract tests**

Create `tests/styles.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

test("stylesheet owns the approved editorial token system", () => {
  for (const token of ["#050807", "#dddcd7", "#f6f4ee", "#f0645a", "#4867d9", "#4d9259"]) {
    assert.match(css.toLowerCase(), new RegExp(token));
  }
  assert.match(css, /Helvetica Neue/);
  assert.match(css, /Iowan Old Style/);
  assert.match(css, /\.hero\s*\{[\s\S]*grid-template-columns/);
  assert.match(css, /\.watch-loop-card\s*\{[\s\S]*border-radius/);
  assert.match(css, /\.work-row\s*\{/);
});

test("stylesheet contains no retired glow or sticky-scene fingerprints", () => {
  for (const fingerprint of [
    "#d8ff3e",
    "radial-gradient",
    "box-shadow",
    "mix-blend-mode",
    "edge-light",
    "ambient-canvas",
    "light-beam",
    "heroStillPush",
    "reflection",
  ]) assert.doesNotMatch(css, new RegExp(fingerprint, "i"));
});

test("mobile and reduced motion keep the preview manually readable", () => {
  assert.match(css, /@media \(max-width: 640px\)/);
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});
```

- [ ] **Step 2: Run the stylesheet tests and verify legacy failures**

Run: `node --test tests/styles.test.mjs`

Expected: FAIL on old acid, radial gradients, shadows, ambient selectors, and missing hybrid work rows.

- [ ] **Step 3: Replace root tokens and global type**

Start the stylesheet with:

```css
:root {
  --stage: #050807;
  --fog: #dddcd7;
  --paper: #f6f4ee;
  --signal-coral: #f0645a;
  --signal-cobalt: #4867d9;
  --signal-moss: #4d9259;
  --ink: #111514;
  --muted: #666a67;
  --line: rgba(17, 21, 20, 0.18);
  --stage-ink: #f6f4ee;
  --stage-muted: rgba(246, 244, 238, 0.68);
  --stage-line: rgba(246, 244, 238, 0.24);
  --sans: "Helvetica Neue", "PingFang TC", Arial, sans-serif;
  --serif: "Iowan Old Style", Baskerville, "Times New Roman", serif;
  --page-pad: clamp(1.1rem, 3.2vw, 3.8rem);
  --radius-large: clamp(1.4rem, 2.4vw, 2.4rem);
  --radius-medium: 1.25rem;
}
```

Set body to Paper, mixed case, ordinary letter spacing, `font-weight: 400`, and no pseudo-element atmosphere.

- [ ] **Step 4: Build the desktop hierarchy at the owning selectors**

Use a sticky but flat topbar; a two-column hero with the showreel media taking the larger field; a borderless collaboration row; a dark Stage watch-loop band; a compact availability split; and six open work rows separated by 1px rules. Hero, preview, and work media receive rounded overflow clipping and `box-shadow: none` is unnecessary because no shadow declaration should exist.

The only signature movement is the watch loop. Hover/focus may change border color and translate a preview by at most `-2px`. Signal colors appear only on short rules, indexes, and focus states.

- [ ] **Step 5: Define exact image and text-first behavior**

All poster-backed media uses:

```css
.watch-loop-image,
.work-row-image {
  display: block;
  height: 100%;
  object-fit: cover;
  object-position: var(--media-focal, 50% 50%);
  width: 100%;
}
```

`.watch-loop-card--text` and `.work-row--text` use typography and a 1px border, not a borrowed image, gradient, glow, or synthetic placeholder.

- [ ] **Step 6: Implement exact mobile and reduced-motion fallbacks**

At `max-width: 820px`, stack hero and work rows, keep Contact in navigation, and remove any sticky section behavior. At `max-width: 640px`, set the original watch-loop sequence to a manually scrollable horizontal grid and hide no cards. Under `prefers-reduced-motion: reduce`, set transitions and animations to none and ensure no transform controls reading order.

- [ ] **Step 7: Run visual-contract and full unit tests**

Run: `npm test`

Expected: all tests PASS with no legacy fingerprint in active CSS/JS/output.

- [ ] **Step 8: Commit the visual system**

```bash
git add src/styles.css tests/styles.test.mjs
git commit -m "Apply editorial hybrid visual system"
```

## Task 6: Synchronize Figma Exports And Importer

**Files:**

- Modify: `scripts/build-figma-export.mjs`
- Create: `figma/hsin-portfolio-importer/code.template.js`
- Modify: `figma/hsin-portfolio-importer/code.js`
- Modify: `figma/hsin-portfolio-importer/manifest.json`
- Modify: `figma/hsin-portfolio-importer/README.md`
- Modify: `figma-export/01-desktop-home.svg`
- Modify: `figma-export/02-desktop-works-logos.svg`
- Modify: `figma-export/03-mobile-home.svg`
- Create: `figma-export/manifest.json`
- Modify: `figma-export/README.md`
- Modify: `docs/figma-design-layer.md`
- Modify: `tests/figma-export.test.mjs`
- Modify: `tests/figma-plugin.test.mjs`
- Create: `tests/figma-sync.test.mjs`

- [ ] **Step 1: Write failing hybrid Figma assertions**

Update tests to require three active frames, a manifest, all six work titles in canonical order, the hybrid tokens, a split hero, a watch-loop rail, and mobile static flow. Add negative checks for acid, glow, portrait carrier, practice modes, services grid, lab section, and only-three-works output. Require `node --check figma/hsin-portfolio-importer/code.js` to pass.

Use semantic checks:

```js
assert.deepEqual(manifest.files, [
  "01-desktop-home.svg",
  "02-desktop-works-logos.svg",
  "03-mobile-home.svg",
]);
assert.equal(manifest.direction, "editorial-watch-loop-hybrid");
assert.deepEqual(manifest.workOrder, [
  "slow-steps",
  "tech-dreamers",
  "my-art-my-voice",
  "interior-spatial-brand-films",
  "pts-taigi-bus",
  "top-gear-china-uk-special",
]);
```

- [ ] **Step 2: Run Figma tests and verify failure**

Run: `node --test tests/figma-export.test.mjs tests/figma-plugin.test.mjs`

Expected: FAIL because old exports use acid tokens, old copy fields, and compact cards.

- [ ] **Step 3: Rebuild the SVG generator from canonical data**

Read `data/site.json`, `data/media.json`, `data/collaborations.json`, and all ordered `content/works/*.md`. Import and run `validateMediaManifest()` before composing frames. Export a function that accepts an output directory so tests can build into a temporary directory. Generate:

1. Desktop opening: topbar, split showreel hero, collaborations, watch loop, availability.
2. Desktop work system: six open editorial rows, collaboration fit, archive/contact sample.
3. Mobile flow: stacked hero, manually scrollable preview representation, six readable work summaries, contact.

Use the exact live tokens and Helvetica/Iowan roles. Do not define or call any `glow()` helper. Local approved images may be embedded as data URIs; remote images must remain source-labelled remote layers or text-first placeholders and must never be replaced with an unrelated local file.

- [ ] **Step 4: Align the Figma importer**

Move the importer page builders into `code.template.js` and use the marker `const PORTFOLIO_DATA = __PORTFOLIO_DATA__;`. During `npm run figma:export`, replace that marker with one JSON-safe snapshot derived from canonical site/media/collaboration/work data and write generated `code.js`. Update token names and page builders so editable pages use the same three compositions and six-work order. Remove portrait/practice/work-theatre pages and all old service/lab components. Keep human-readable layer names for Hero media, Hero copy, Collaborations, Watch loop, Availability, each work slug, Collaboration fit, Archive, and Contact.

Add only the canonical remote hosts used by current work posters to `manifest.json` allowed domains. The generated importer may load those URLs directly or create a labelled placeholder with the same canonical URL; it may not embed a copied third-party asset.

- [ ] **Step 5: Regenerate and document the active package**

Run: `npm run figma:export`

Expected: the three SVGs, `figma-export/manifest.json`, and generated importer `code.js` are regenerated. Update both READMEs and `docs/figma-design-layer.md` with the round-trip rule: content/media changes happen in canonical data first, then regenerate; manual Figma changes are design proposals and must be translated back into source.

- [ ] **Step 6: Prove canonical data propagates into both outputs**

Create `tests/figma-sync.test.mjs`. In a temporary fixture, change one work title, poster path, alt value, and focal point; call `renderPage()` for English and Chinese and generate the Figma package to a temporary output directory; assert the changed title/media values appear in both HTML strings, the relevant SVG, and generated importer `code.js`, while `src/styles.css` contains none of the asset filenames.

- [ ] **Step 7: Run Figma and full tests**

Run:

```bash
node --test tests/figma-export.test.mjs tests/figma-plugin.test.mjs tests/figma-sync.test.mjs
npm test
```

Expected: all tests PASS.

- [ ] **Step 8: Commit Figma alignment**

```bash
git add scripts/build-figma-export.mjs figma figma-export docs/figma-design-layer.md tests
git commit -m "Align Figma workflow with editorial hybrid"
```

## Task 7: Run Browser, Responsive, Accessibility, And Visual QA

**Files:**

- Create: `docs/reviews/2026-07-19-editorial-watch-loop-visual-qa.md`
- Modify: `.agents/skills/portfolio-narrative-builder/references/validation-gates.md` only if this real run exposes a reusable omission.

- [ ] **Step 1: Run deterministic validation from a clean generated state**

Run:

```bash
npm ci
npm run media:validate
npm test
npm run build
git diff --check
```

Expected: install, media validation, all tests, build, and whitespace check PASS.

- [ ] **Step 2: Start the hybrid preview server**

Run: `npm run serve`

Expected: local site is served at `http://localhost:4173/en/` and `/zh/`.

- [ ] **Step 3: Inspect fixed viewports with `webapp-testing`**

Capture and inspect:

- 1440×900 desktop;
- 1200×900 compact desktop;
- 834×1112 tablet;
- 390×844 mobile;
- 360×800 small mobile;
- 1440×900 with reduced motion.

At every viewport verify name, showreel play control, Contact path, five previews, six work anchors, language link, image crops, and no body overflow. On mobile verify no automatic loop transform and manual horizontal access.

- [ ] **Step 4: Run browser-level behavior checks**

Verify:

```js
document.documentElement.scrollWidth === document.documentElement.clientWidth
document.querySelectorAll(".watch-loop-sequence:not([aria-hidden='true']) .watch-loop-card").length === 5
document.querySelectorAll(".work-row[id]").length === 6
```

On desktop confirm the loop pauses on hover and focus, resumes afterward, and has no visible blank gap. With JavaScript disabled confirm the original five-card row remains readable. With reduced motion confirm no automatic transform is applied.

- [ ] **Step 5: Compare the checkpoint at matched states**

Build/serve the sibling `hsin-hsin-yuan-portfolio-edit` checkpoint locally on a second port and capture desktop/mobile opening states. Compare it with the hybrid to confirm intentional continuity: typography/palette/framing remain; portrait carrier, glow, and sticky theatre do not. Record observations, viewport sizes, branch/commit, and screenshot paths in `docs/reviews/2026-07-19-editorial-watch-loop-visual-qa.md`.

- [ ] **Step 6: Apply only evidence-backed visual fixes**

For each observed defect, add or tighten the smallest automated assertion first, then patch the owning CSS/generator/controller. Rerun the affected viewport and full tests. If a failure is reusable, update the smallest skill reference in the same commit.

- [ ] **Step 7: Commit visual QA evidence and fixes**

```bash
git add docs/reviews/2026-07-19-editorial-watch-loop-visual-qa.md src scripts tests .agents/skills/portfolio-narrative-builder
git commit -m "Verify hybrid across responsive and motion states"
```

## Task 8: Run Claude And Gemini Read-Only Review And Adjudicate

**Files:**

- Create: `docs/reviews/2026-07-19-editorial-watch-loop-review-packet.md`
- Create: `docs/reviews/2026-07-19-editorial-watch-loop-claude-review.json`
- Create: `docs/reviews/2026-07-19-editorial-watch-loop-gemini-packet.md`
- Create: `docs/reviews/2026-07-19-editorial-watch-loop-gemini-review.md`
- Create: `docs/reviews/2026-07-19-editorial-watch-loop-adjudication.md`
- Modify: implementation files only for accepted, locally reproduced findings.

- [ ] **Step 1: Freeze one self-contained review packet**

The packet must state branch, objective, approved spec, non-goals, target files, test/build results, fixed-viewport QA, and required severity/file-line/evidence schema. It must say read-only and must not contain a desired verdict, credential, or private evidence.

- [ ] **Step 2: Preflight and dispatch Claude through the canonical wrapper**

From the hybrid repo run:

```bash
node ../scripts/review-with-claude.mjs docs/reviews/2026-07-19-editorial-watch-loop-review-packet.md docs/reviews/2026-07-19-editorial-watch-loop-claude-review.json .
```

Expected request model: `claude-fable-5`. Record requested, observed, completed model, lane, usage if available, result, and failure class. Do not downgrade for authentication, timeout, parse, empty output, missing CLI, or sandbox failure. If a quota/capacity response provides a recovery time, use the established bounded watcher rather than asking the user to drive retries.

- [ ] **Step 3: Dispatch Gemini as independent adjudicator**

Create a Gemini packet that includes the frozen review packet and Claude findings, then run:

```bash
node ../scripts/review-with-gemini.mjs docs/reviews/2026-07-19-editorial-watch-loop-gemini-packet.md docs/reviews/2026-07-19-editorial-watch-loop-gemini-review.md -
```

Require `agree`, `upgrade`, `downgrade`, `reject`, or `already-fixed` for every Claude item, plus omissions and file-line evidence. The wrapper uses the verified REST lane and `~/.gemini/.env` without printing the key.

- [ ] **Step 4: Adjudicate every finding locally**

Create the decision matrix:

```markdown
| ID | Claude severity | Gemini verdict | Evidence verified | Decision | Package |
|---|---|---|---|---|---|
```

Verify every blocker against current source or a reproduction. An unavailable provider remains incomplete and contributes no findings.

- [ ] **Step 5: Implement accepted bounded fixes with regression tests**

For each accepted finding, add a failing regression test, reproduce it, patch the owning source, rerun affected and full validation, and record the result in adjudication. Do not apply editorial/taste suggestions that contradict the approved spec.

- [ ] **Step 6: Commit the review record and accepted fixes**

```bash
git add docs/reviews src scripts tests data content figma figma-export .agents/skills/portfolio-narrative-builder PROJECT_BIBLE.md
git commit -m "Adjudicate external review for editorial hybrid"
```

## Task 9: Sync The Reusable Skill And Publish A Preview Only

**Files:**

- Source: `.agents/skills/portfolio-narrative-builder/`
- Target installation: `/Users/hsin-hsinyuan/Documents/Claude/Projects/Moonie V/.agents/skills/portfolio-narrative-builder/`
- Modify: Git refs and Vercel preview state; production remains untouched.

- [ ] **Step 1: Forward-test the tracked skill with a fresh subagent**

Use this neutral prompt without leaking the expected plan:

```text
Use $portfolio-narrative-builder at /Users/hsin-hsinyuan/Documents/Claude/Projects/Moonie V/hsin-hsin-yuan-portfolio-hybrid/.agents/skills/portfolio-narrative-builder to propose a safe workflow for restyling an existing filmmaker portfolio while preserving its horizontal project preview and making all images replaceable. Return the first files and validation gates you would inspect. Do not edit files.
```

Verify that the answer selects the hybrid path, checkpoints before editing, separates data from CSS, names owner-level legacy removal, includes mobile/reduced-motion/no-JavaScript checks, and invokes the established multi-AI review skill rather than duplicating credential instructions.

- [ ] **Step 2: Sync the validated mirror into the discoverable parent skill**

Apply the tracked skill changes to `/Users/hsin-hsinyuan/Documents/Claude/Projects/Moonie V/.agents/skills/portfolio-narrative-builder/`, which is the already discovered project skill. Keep the hybrid-repo mirror as the version-controlled source of truth. Run `quick_validate.py` against both folders and `diff -qr` between them; both validation runs must pass and the diff must be empty.

- [ ] **Step 3: Run the release gate once more**

Run:

```bash
npm run media:validate
npm test
npm run build
git status --short
```

Expected: all validation PASS and only intentional review artifacts, if any, are present.

- [ ] **Step 4: Push the hybrid branch**

Run: `git push -u origin codex/editorial-watch-loop-hybrid`

Expected: the remote hybrid branch is created without changing `main` or the production deployment.

- [ ] **Step 5: Deploy a Vercel preview**

Use `vercel-deploy` to deploy this worktree as a preview, not production. Confirm the resulting URL serves both `/en/` and `/zh/`, uses the hybrid branch contents, and does not alias the production domain.

- [ ] **Step 6: Hand off the comparison and recovery points**

Report:

- hybrid preview URL;
- portrait checkpoint branch `checkpoint/portrait-scene-v1`;
- immutable tag `portrait-scene-v1` at `e05556c`;
- hybrid branch and final commit;
- test/build/visual-review results;
- Claude/Gemini completion or precise incomplete status;
- direct `$portfolio-narrative-builder` invocation for future iterations.

Do not promote the preview to production until Hsin-Hsin explicitly approves it.
