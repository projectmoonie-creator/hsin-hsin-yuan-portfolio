# Annotated Content Trim v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the creator's six annotated content reductions while preserving verified links, useful proof, bilingual parity, and the existing visual system.

**Architecture:** Keep all work-specific decisions in canonical JSON frontmatter and global copy in `data/site.json`. Extend the static renderer only with optional `watchLabel` and `metricsContext` fields, then regenerate the site and Figma handoff from those sources.

**Tech Stack:** Node.js ESM static generator, JSON frontmatter Markdown, Node test runner, CSS, SVG Figma export, Playwright visual QA, Vercel Preview.

---

### Task 1: Lock the annotated content contract

**Files:**
- Modify: `tests/build-site.test.mjs`
- Test: `tests/build-site.test.mjs`

- [ ] **Step 1: Write failing canonical-data tests**

Add assertions that the Design work has only the `LG / Samsung` metric, no
status badge, and an explicit selected-reel label; Nothing by Bus has the three
approved tags and no metrics; Top Gear has a localized metric context and the
four retained values; Press has exactly one verified entry; both hero role-line
arrays have no leading slash.

- [ ] **Step 2: Write failing generated-markup tests**

Assert that generated English and Chinese pages contain `PRESS`, `Watch
selected reel`, the Top Gear context, and the retained destinations. Assert
that the retired Press subcopy, lower-half Facebook ID, removed metrics/tags,
`Selected reel` badge, and `↗` glyph are absent from active output.

- [ ] **Step 3: Run the focused suite and verify RED**

Run: `node --test tests/build-site.test.mjs`  
Expected: the new assertions fail because the current canonical data and
renderer still expose the annotated items.

### Task 2: Implement the canonical reductions

**Files:**
- Modify: `data/site.json`
- Modify: `data/press.json`
- Modify: `content/works/interior-spatial-brand-films.md`
- Modify: `content/works/pts-taigi-bus.md`
- Modify: `content/works/top-gear-china-uk-special.md`
- Modify: `scripts/build-site.mjs`
- Modify: `src/styles.css`
- Test: `tests/build-site.test.mjs`

- [ ] **Step 1: Update canonical global and Press data**

Remove the leading role slashes, set both Press headings to `PRESS`, delete the
Press subcopy fields, and delete the lower-half record from `data/press.json`.

- [ ] **Step 2: Update the three affected work records**

Remove the Design status badge and `20+` metric; add a localized `watchLabel`.
Trim Nothing by Bus tags and metrics. Add the localized Top Gear
`metricsContext`, correct the public metric labels, and retain the résumé-only
rating as explicitly reported.

- [ ] **Step 3: Update renderer and CSS**

Render optional work-specific watch labels and metric context. Remove arrow
glyph markup from Archive and Press. Omit the Press description entirely and
delete the now-unused arrow and intro-paragraph CSS.

- [ ] **Step 4: Run the focused suite and verify GREEN**

Run: `node --test tests/build-site.test.mjs`  
Expected: all focused tests pass.

- [ ] **Step 5: Commit the implementation**

Run:

```bash
git add data/site.json data/press.json content/works/interior-spatial-brand-films.md content/works/pts-taigi-bus.md content/works/top-gear-china-uk-special.md scripts/build-site.mjs src/styles.css tests/build-site.test.mjs
git commit -m "refine portfolio proof and labels"
```

### Task 3: Regenerate and validate every active layer

**Files:**
- Modify: `figma-export/01-desktop-home.svg`
- Modify when generated: `figma-export/03-mobile-home.svg`
- Test: `tests/*.test.mjs`

- [ ] **Step 1: Run deterministic checks**

Run `npm test`, `npm run build`, `npm run figma:export`, and `git diff --check`.
Expected: every command passes; Figma output contains the slash-free hero role
line and no retired active copy.

- [ ] **Step 2: Run active-layer retirement searches**

Search canonical data, renderer, CSS/JS, generated HTML, tests, and Figma output
for the removed lower-half ID, Press subcopy, arrow glyph, `20+`, `3+`, `public
media`, `Taiwanese language`, and passive `Selected reel` badge. Remaining hits
must be historical documentation or explicit negative tests only.

- [ ] **Step 3: Run visual and interaction QA**

Inspect `1440 × 900`, `1200 × 900`, `834 × 1112`, `390 × 844`, `360 × 800`,
reduced-motion, no-JavaScript, and keyboard-focus states. Verify no overflow,
console errors, broken links, lost official entry, or empty spacing from removed
content.

- [ ] **Step 4: Commit generated design parity**

Run:

```bash
git add figma-export/01-desktop-home.svg figma-export/03-mobile-home.svg
git commit -m "sync annotated content trim to Figma export"
```

Skip unchanged generated files rather than forcing a no-op commit.

### Task 4: Replace only the non-production Preview and record the checkpoint

**Files:**
- Create: `docs/reviews/annotated-content-trim-v1-2026-08-03.md`
- Modify: `STATUS.md`

- [ ] **Step 1: Build the approved public payload**

Stage only generated public pages, referenced assets, the contact endpoint, and
minimal Vercel configuration. Verify the path allowlist and remove temporary
OIDC files before upload.

- [ ] **Step 2: Deploy and inspect metadata**

Deploy with target `preview`; inspect only Vercel deployment metadata. Do not
fetch the public Preview URL or submit the contact form.

- [ ] **Step 3: Write the review and update STATUS**

Record the implementation commit, checks, browser evidence, deployment ID and
URL, source decisions, accepted open items, protected untracked file, and exact
next action.

- [ ] **Step 4: Commit the checkpoint documentation**

Run:

```bash
git add STATUS.md docs/reviews/annotated-content-trim-v1-2026-08-03.md
git commit -m "docs: record annotated content trim preview"
```
