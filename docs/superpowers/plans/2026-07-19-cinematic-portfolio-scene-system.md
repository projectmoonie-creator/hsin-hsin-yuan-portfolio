# Cinematic Portfolio Scene System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the old-site retrofit with a distinct portrait-carrier hero, scene-state interaction system, three-work theatre, aligned Figma outputs, and reusable validation gates.

**Architecture:** Keep the static Node generator and bilingual data model, but replace the active homepage markup, CSS, and browser controller rather than append overrides. Put deterministic progress-to-state mapping in a small pure module, render every content fallback server-side, and require a foreground asset whenever the selected portrait treatment needs one.

**Tech Stack:** Node.js, built-in `node:test`, static HTML/CSS/JavaScript, JSON/Markdown content, native CSS transforms, requestAnimationFrame, SVG Figma exports.

---

## File Responsibilities

- `data/media.json` — named hero layers, focal points, bilingual alt text, and practice-mode media.
- `scripts/build-site.mjs` — semantic homepage rendering and media-contract validation.
- `src/scene-state.js` — pure progress-to-scene calculations shared by tests and browser code.
- `src/main.js` — DOM wiring for scroll scenes, mode buttons, showreel, contact, and reduced motion.
- `src/styles.css` — the complete active visual system; no legacy override tail.
- `tests/build-site.test.mjs` — structural and legacy-fingerprint regression tests.
- `tests/scene-state.test.mjs` — deterministic scene-state unit tests.
- `scripts/build-figma-export.mjs` and `tests/figma-export.test.mjs` — aligned design-layer exports.
- `.agents/skills/build-cinematic-portfolio/` — reusable acceptance rules and manifest validation.

### Task 1: Lock The Distinct DOM And Legacy Removals

**Files:**
- Modify: `tests/build-site.test.mjs`

- [ ] Add a failing test that renders English and Chinese pages and asserts the new contract:

```js
assert.match(en, /data-portrait-carrier/);
assert.match(en, /class="portrait-foreground"/);
assert.match(en, /data-practice-mode="documentary"/);
assert.match(en, /data-practice-mode="cross-cultural"/);
assert.match(en, /data-practice-mode="editorial-systems"/);
assert.match(en, /data-work-theatre/);
assert.equal((en.match(/class="work-scene/g) || []).length, 3);
assert.doesNotMatch(en, /data-watch-loop|watch-loop-card|work-panel|light-beam-layer/);
assert.doesNotMatch(zh, /data-watch-loop|watch-loop-card|work-panel|light-beam-layer/);
```

- [ ] Replace assertions that require acid green, ambient canvas, pointer edge glow, hero-size pointer interaction, screening marquee, or an empty foreground with negative assertions for those fingerprints.
- [ ] Run `npm test -- --test-name-pattern='portrait|legacy|homepage'` and confirm failure is caused by missing portrait-carrier/work-theatre markup and surviving legacy markup.
- [ ] Commit the red tests separately.

### Task 2: Enforce The Portrait-Carrier Media Contract

**Files:**
- Modify: `data/media.json`
- Modify: `scripts/build-site.mjs`
- Modify: `.agents/skills/build-cinematic-portfolio/scripts/validate_media_manifest.mjs`
- Modify: `tests/build-site.test.mjs`
- Create: `public/assets/portfolio/hsin-portrait-foreground.webp`

- [ ] Add a failing unit case proving `validateMediaManifest()` rejects `treatment: "portrait-carrier"` when `foregroundCutout` is empty.
- [ ] Verify the test fails because the current validator accepts the empty layer.
- [ ] Expand the hero manifest to the exact stable keys:

```json
{
  "background": "/assets/portfolio/hsin-working-white-space.jpg",
  "foregroundCutout": "/assets/portfolio/hsin-portrait-foreground.webp",
  "abstractLayer": "/assets/portfolio/my-art-my-voice-performance-2.jpg",
  "alternatePortraits": [],
  "desktopFocalPoint": "38% 72%",
  "mobileFocalPoint": "34% 66%",
  "alt": {
    "en": "Hsin-Hsin Yuan developing a documentary project",
    "zh": "袁欣欣進行紀錄片創作工作"
  },
  "treatment": "portrait-carrier"
}
```

- [ ] Create the foreground only by removing the background from the approved local portrait; preserve identity and do not synthesize a replacement person. Inspect it against dark, Fog, and coral backgrounds.
- [ ] Make both validators require the cutout for `portrait-carrier`, validate desktop/mobile focal points, and verify all local paths exist.
- [ ] Run the focused manifest tests and the reusable validator; confirm green.
- [ ] Commit the contract, asset, validators, and tests.

### Task 3: Replace The Homepage Generator

**Files:**
- Modify: `scripts/build-site.mjs`
- Modify: `data/site.json`
- Modify: `content/works/slow-steps.md`
- Modify: `content/works/my-art-my-voice.md`
- Modify: `content/works/tech-dreamers.md`
- Test: `tests/build-site.test.mjs`

- [ ] Render one semantic portrait carrier with these explicit child roles:

```html
<section class="portrait-carrier" data-portrait-carrier>
  <div class="portrait-sticky">
    <div class="portrait-signal" aria-hidden="true"></div>
    <div class="portrait-frame"><video data-showreel-video poster="/assets/showreel/website-visual-reel-poster.png"></video></div>
    <img class="portrait-foreground" src="/assets/portfolio/hsin-portrait-foreground.webp" alt="">
    <div class="portrait-intro"><h1>Hsin-Hsin Yuan</h1><p>Documentary director, writer, and cross-cultural story partner.</p></div>
    <div class="practice-rail" role="group" aria-label="Areas of practice">
      <button data-practice-mode="documentary" aria-pressed="true">Documentary direction</button>
      <button data-practice-mode="cross-cultural" aria-pressed="false">Cross-cultural story</button>
      <button data-practice-mode="editorial-systems" aria-pressed="false">Editorial systems</button>
    </div>
    <div class="practice-scenes">
      <article data-practice-scene="documentary">Listen for the human turn inside complex material.</article>
      <article data-practice-scene="cross-cultural">Carry context across languages without flattening it.</article>
      <article data-practice-scene="editorial-systems">Build repeatable editorial judgment around new tools.</article>
    </div>
  </div>
</section>
```

- [ ] Remove `renderWatchLoop()`, `renderWatchLoopItem()`, `renderLab()`, `renderInfoCards()`, `renderTags()`, and their calls.
- [ ] Replace `renderWork()` with `renderWorkScene()` and render exactly three `.work-scene` children inside one `[data-work-theatre]` container. Use a text-led fallback when a work has no approved poster.
- [ ] Shorten the hero composition to mixed-case name, one role statement, one brief positioning paragraph, showreel action, and contact action. Do not render the old two-line uppercase name or role slash styling.
- [ ] Keep collaboration, history, and form semantics but give them new open-row wrapper classes rather than legacy grid/card classes.
- [ ] Run the focused build tests until the new DOM assertions pass and all legacy negative assertions pass.
- [ ] Commit the generator and content changes.

### Task 4: Implement Deterministic Scene States

**Files:**
- Create: `src/scene-state.js`
- Create: `tests/scene-state.test.mjs`
- Modify: `src/main.js`
- Modify: `scripts/build-site.mjs`

- [ ] Write failing tests for the pure state API:

```js
assert.deepEqual(portraitSceneAt(0), { phase: "opening", mode: 0 });
assert.deepEqual(portraitSceneAt(0.36), { phase: "release", mode: 0 });
assert.deepEqual(portraitSceneAt(0.56), { phase: "practice", mode: 0 });
assert.deepEqual(portraitSceneAt(0.66), { phase: "practice", mode: 1 });
assert.deepEqual(portraitSceneAt(0.76), { phase: "practice", mode: 2 });
assert.deepEqual(portraitSceneAt(0.94), { phase: "handoff", mode: 2 });
assert.equal(workSceneAt(0.05, 3), 0);
assert.equal(workSceneAt(0.5, 3), 1);
assert.equal(workSceneAt(0.95, 3), 2);
```

- [ ] Verify failure because `src/scene-state.js` does not exist.
- [ ] Implement clamped `portraitSceneAt(progress)` and `workSceneAt(progress, count)` with the exact phase boundaries above.
- [ ] Replace `src/main.js` wholesale. Wire one requestAnimationFrame loop that sets `--portrait-progress`, `data-phase`, active mode, `--work-progress`, and active work scene. Buttons set a manual mode until the next material scroll transition and update `aria-pressed`.
- [ ] Preserve showreel play/pause, contact form, page restore, and language navigation. Remove ambient import, pointermove effects, screening-loop cloning, guiding light, and old sticky-stack code.
- [ ] Copy `scene-state.js` to `dist` during build and import it from `main.js`.
- [ ] Run scene-state and build tests; confirm green.
- [ ] Commit the scene controller.

### Task 5: Replace The Visual System Instead Of Appending Overrides

**Files:**
- Replace: `src/styles.css`
- Test: `tests/build-site.test.mjs`

- [ ] Add failing source assertions that active CSS contains the six approved tokens and does not contain `#d8ff3e`, `.ambient-canvas`, `.watch-loop`, `.edge-light`, `.work-panel`, `.contact-card`, or the old override comment.
- [ ] Verify the source test fails on the current 1,825-line legacy stylesheet.
- [ ] Replace the stylesheet from the root tokens forward. Implement:

  - Stage/Fog/Paper and coral/cobalt/moss signal tokens;
  - mixed-case sans plus restrained italic serif accent;
  - compact fixed navigation without old acid treatment;
  - sticky portrait carrier with frame-to-page separation;
  - portrait blend/mask fallback and isolated foreground layer;
  - accessible practice rail and changing scene fields;
  - dark sticky work theatre on desktop and stacked work scenes on mobile;
  - open practice/history rows and a flat editorial contact form;
  - visible focus, no horizontal overflow, and full reduced-motion fallbacks.

- [ ] Confirm every selector in the new stylesheet maps to active generator markup and no dead legacy block remains.
- [ ] Run all tests and build; confirm green.
- [ ] Commit the visual system.

### Task 6: Add Reusable Failure Gates To The Skill

**Files:**
- Modify: `.agents/skills/build-cinematic-portfolio/SKILL.md`
- Modify: `.agents/skills/build-cinematic-portfolio/references/media-contract.md`
- Modify: `.agents/skills/build-cinematic-portfolio/references/quality-gates.md`
- Create: `.agents/skills/build-cinematic-portfolio/references/legacy-fingerprint-audit.md`

- [ ] Add a mandatory pre-redesign inventory of existing palette, typography, hero composition, components, motion, and screenshot fingerprints.
- [ ] Require an explicit keep/replace decision for every high-salience fingerprint.
- [ ] Prohibit claiming a material redesign when it is implemented primarily as end-of-file CSS overrides.
- [ ] Make a selected layered-person treatment fail validation when its foreground/equivalent layer is absent.
- [ ] Require old/new desktop and mobile screenshots before publish and ask: “Could an informed viewer plausibly call these the same design?” Any “yes” blocks publish.
- [ ] Run the media validator and the system `quick_validate.py`; confirm both pass.
- [ ] Forward-test the revised skill with a fresh agent that receives only the skill path, the old site source, and a generic redesign request.
- [ ] Commit the skill changes.

### Task 7: Rebuild The Figma Design Layer

**Files:**
- Modify: `scripts/build-figma-export.mjs`
- Modify: `figma/hsin-portfolio-importer/code.js`
- Modify: `docs/figma-design-layer.md`
- Modify: `tests/figma-export.test.mjs`
- Modify: `tests/figma-plugin.test.mjs`
- Regenerate: `figma-export/01-desktop-home.svg`
- Regenerate: `figma-export/02-desktop-works-logos.svg`
- Regenerate: `figma-export/03-mobile-home.svg`

- [ ] Write failing tests that require Stage/Fog/coral/cobalt/moss tokens, portrait-carrier labels, and work-theatre compositions while rejecting acid green, compact cards, the moving strip, and the old left-image/right-copy hero.
- [ ] Verify the current generator fails those expectations.
- [ ] Rebuild the desktop and mobile SVG generators around the new scene architecture and update the importer to the same tokens and section order.
- [ ] Regenerate all active SVG outputs and visually inspect them.
- [ ] Run Figma tests; confirm green.
- [ ] Commit design-layer alignment.

### Task 8: Visual Verification, Push, And Preview Audit

**Files:**
- Modify only files responsible for verified regressions.

- [ ] Run `npm test`, `npm run build`, and the media-manifest validator with zero failures.
- [ ] Serve `dist/` locally and capture English and Chinese at 1440×900, 768×1024, and 390×844.
- [ ] Test no-JavaScript and reduced-motion paths; verify the page remains readable and every action is available.
- [ ] Capture the old production hero and the new local hero side by side. Confirm palette, type composition, portrait layering, navigation, and interaction signatures are materially different.
- [ ] Scroll through the portrait release, all three practice modes, all three work scenes, history, and contact. Verify no horizontal overflow or sticky trap.
- [ ] Run the cross-review workflow only if Claude quota has recovered; record unavailable review as unavailable, not complete.
- [ ] Commit any verification fixes, push `codex/cinematic-portfolio-system`, wait for Vercel success, and inspect the authenticated preview URL itself.
- [ ] Report the exact commit, preview URL, test results, visual checks, and any remaining asset-replacement recommendations.
