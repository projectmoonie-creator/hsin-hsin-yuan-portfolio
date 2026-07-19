# Cinematic Portfolio System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a restrained cinematic portfolio with a layered, replaceable portrait hero and reusable generation workflow.

**Architecture:** Keep the zero-dependency static generator and introduce a validated media manifest consumed by render functions and CSS custom properties. Reduce the homepage to a small number of narrative sections, drive desktop scroll choreography with progressive enhancement, and make mobile/reduced-motion behavior ordinary document flow.

**Tech Stack:** Node.js, built-in `node:test`, static HTML/CSS/JavaScript, JSON and JSON frontmatter.

---

### Task 1: Lock The Public Structure With Tests

**Files:**
- Modify: `tests/build-site.test.mjs`

- [ ] Add assertions that the page renders a media-driven hero, exactly three featured work chapters, one practice statement, selected history, collaborations, and contact.
- [ ] Add negative assertions for the removed service grid, standalone lab grid, homepage tags, and horizontal wheel interception.
- [ ] Run `npm test` and confirm the new assertions fail before generator changes.
- [ ] Preserve the user's existing uncommitted test edits and integrate rather than replace them.

### Task 2: Add And Validate The Replaceable Media Contract

**Files:**
- Create: `data/media.json`
- Modify: `scripts/build-site.mjs`
- Modify: `tests/build-site.test.mjs`

- [ ] Define hero background, optional foreground, focal point, bilingual alt, and treatment fields.
- [ ] Load the manifest through `loadSiteData()` and reject missing required keys.
- [ ] Render media values as escaped CSS custom properties and semantic image attributes.
- [ ] Add tests for an empty optional foreground and invalid required media.
- [ ] Run `npm test` and confirm all media-contract tests pass.

### Task 3: Simplify The Homepage Generator

**Files:**
- Modify: `scripts/build-site.mjs`
- Modify: `data/site.json`
- Modify: `content/works/*.md`
- Modify: `tests/build-site.test.mjs`

- [ ] Limit homepage Featured Works to the first three approved entries without deleting source content.
- [ ] Remove `renderTags()` from the homepage work output.
- [ ] Replace the service and lab grids with one bilingual practice statement and optional lab link.
- [ ] Render archive items as selected-history rows with contextual metrics.
- [ ] Keep screening-strip cards lightweight and linked to matching work chapters.
- [ ] Run `npm test` and confirm the simplified structure passes.

### Task 4: Implement The Cinematic Visual System

**Files:**
- Modify: `src/styles.css`
- Modify: `src/main.js`
- Modify: `src/ambient-background.js`

- [ ] Replace the boxed hero with a full-viewport media stage and readable editorial copy layer.
- [ ] Add optional foreground portrait styling with a stable fallback when absent.
- [ ] Convert Featured Works into full-width narrative chapters with sticky desktop media.
- [ ] Replace repetitive grids with border-light practice, history, and collaboration layouts.
- [ ] Reduce competing pointer glow and keep one section-guided ambient field.
- [ ] Add requestAnimationFrame scroll progress for hero and work chapters.
- [ ] Disable scroll transforms for reduced motion and mobile; ensure elements are visible without JavaScript.

### Task 5: Create The Reusable Skill

**Files:**
- Create: `.agents/skills/build-cinematic-portfolio/SKILL.md`
- Create: `.agents/skills/build-cinematic-portfolio/agents/openai.yaml`
- Create: `.agents/skills/build-cinematic-portfolio/references/intake-schema.md`
- Create: `.agents/skills/build-cinematic-portfolio/references/media-contract.md`
- Create: `.agents/skills/build-cinematic-portfolio/references/quality-gates.md`
- Create: `.agents/skills/build-cinematic-portfolio/scripts/validate_media_manifest.mjs`

- [ ] Initialize the skill with the system `init_skill.py` script and project-local output path.
- [ ] Make the skill explicitly invoke `portfolio-narrative-builder` for evidence and positioning work.
- [ ] Document minimum viable inputs, optional enhancement inputs, media rights, and replacement workflow.
- [ ] Implement a validator that checks schema, focal-point syntax, alt text, path existence, and optional layers.
- [ ] Run the validator against `data/media.json` and run the system `quick_validate.py` against the skill.
- [ ] Incorporate any project-specific failure discovered during Tasks 1–4 into the relevant reference.

### Task 6: Synchronize Active Design And Documentation Layers

**Files:**
- Modify: `scripts/build-figma-export.mjs`
- Modify: `figma/hsin-portfolio-importer/code.js`
- Modify: `docs/portfolio-site-spec.md`
- Modify: `docs/figma-design-layer.md`
- Test: `tests/figma-export.test.mjs`
- Test: `tests/figma-plugin.test.mjs`

- [ ] Remove active references to deleted homepage grids and old card geometry.
- [ ] Update Figma export labels and section order to match the cinematic architecture.
- [ ] Keep historical review documents unchanged.
- [ ] Run targeted Figma tests and confirm active generators cannot recreate removed sections.

### Task 7: Verify Desktop, Mobile, And Reduced Motion

**Files:**
- Modify: `tests/build-site.test.mjs` only if a regression is found
- Modify: source files responsible for any verified regression

- [ ] Run `npm test` and `npm run build`.
- [ ] Serve `dist/` locally and inspect 1440×900, 768×1024, and 390×844.
- [ ] Verify initial content visibility, hero crop, portrait fallback, sticky work release, contact navigation, and lack of horizontal overflow.
- [ ] Emulate reduced motion and verify ordinary readable document flow.
- [ ] Run a repository search for removed labels and classes; allow hits only in historical documents and negative tests.
- [ ] Record final deviations from the reference and the reason in the reusable skill quality gates.

