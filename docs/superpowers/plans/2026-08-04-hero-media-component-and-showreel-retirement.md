# Hero Media Component and Showreel Retirement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing subtly animated Hero still a single replaceable media record shared by the website and Figma export, remove Hero Play/showreel, and publish a metadata-safe image without changing the approved layout or motion.

**Architecture:** `data/site.json.heroMedia` is the language-independent source of truth; `scripts/lib/portfolio-contract.mjs` validates it; build-time `renderHeroMedia` output and Figma export both consume the normalized record. Work lands as two separable commits: parity-preserving extraction, then approved retirement/sync/privacy changes.

**Tech Stack:** Node.js ESM, static HTML/CSS/JS, `node:test`, current Figma export generator, dependency-free JPEG segment sanitization.

---

## Task 0: Freeze guardrails and baseline

**Inspect:** `AGENTS.md`, `PROJECT_BIBLE.md`, `STATUS.md`, `docs/superpowers/specs/2026-08-04-hero-media-component-and-showreel-retirement-design.md`

- [ ] Read `frontend-design`, `anthropic-skills:test-driven-development`, and `anthropic-skills:executing-plans` before implementation; do not alter the approved visual system.
- [ ] Require branch `codex/hero-media-component` at `0095bad4ba05468aacc6a5413b1a0a6d43f0e8df`; confirm `origin/main` is untouched and the sole untracked protected review file still hashes to `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.
- [ ] Run `npm test`, `npm run build`, and `npm run figma:export`; save ignored baseline HTML/export/screenshots under a `mktemp -d` directory outside the repo.
- [ ] Record the current public Hero dimensions and pixel-decoded comparison baseline without printing EXIF or GPS values.

## Task 1: Extract HeroMedia with exact behavioral parity

**Modify:** `data/site.json`, `scripts/lib/portfolio-contract.mjs`, `scripts/build-site.mjs`, `src/styles.css`, `tests/portfolio-contract.test.mjs`, `tests/build-site.test.mjs`

- [ ] RED: add strict `normalizeHeroMedia` tests for id, localized alt, dimensions, three focal points, motion, rights, invalid ranges, and missing fields; run `node --test tests/portfolio-contract.test.mjs` and confirm the new assertions fail for the intended reason.
- [ ] RED: add build assertions that preload, accessible label, source, dimensions, focal CSS variables, existing video/Play, and exact `heroStillPush`/reduced-motion behavior derive from the record; confirm `node --test tests/build-site.test.mjs` fails.
- [ ] GREEN: add the approved top-level `heroMedia` record with id `site.hero`, normalize/freeze it, and introduce a build-time `renderHeroMedia` component used by preload and Hero markup while keeping the current showreel active.
- [ ] GREEN: replace the hardcoded Hero URL/positions with generated CSS variables; preserve current gradient, crop, breakpoints, radius, 18-second push endpoints, and reduced-motion fallback byte-for-byte in rendered behavior.
- [ ] Run the two focused suites, `npm test`, `npm run build`, and desktop/mobile visual plus Play parity checks against Task 0; then commit only this extraction as `refactor: extract canonical hero media component`.

## Task 2: Retire showreel, sanitize media, and synchronize Figma

**Modify:** `scripts/build-site.mjs`, `src/main.js`, `src/styles.css`, `data/site.json`, `scripts/build-figma-export.mjs`, `scripts/lib/portfolio-contract.mjs`, `package.json`, `tests/build-site.test.mjs`, `tests/figma-export.test.mjs`, `tests/portfolio-contract.test.mjs`, `docs/design-contract.md`, `PROJECT_BIBLE.md`, `STATUS.md`

**Create:** `scripts/sanitize-public-hero-image.mjs`, `scripts/lib/jpeg-metadata.mjs`, `tests/hero-media.test.mjs`, `docs/reviews/hero-media-component-and-showreel-retirement-v1-2026-08-04.md`, `showreel/website-visual-reel/RETIRED.md`

**Remove:** `public/assets/showreel/website-visual-reel.mp4`, `public/assets/showreel/website-visual-reel-poster.png`

- [ ] RED: replace positive showreel tests with negative HTML/JS/CSS/build assertions; add a `heroMedia.src` mutation fixture proving the same new value reaches website and both Figma frames, focal crops honor each layout, and the old source/retired showreel paths are absent.
- [ ] RED: add dependency-free JPEG tests rejecting APP1 EXIF/XMP, APP13 IPTC/Photoshop, COM, GPS/device/creator/comment/location payloads while retaining image-data segments; confirm the focused tests fail before implementation.
- [ ] GREEN: remove video, Play markup/logic/styles/copy and public derivatives; keep the authoring folder with a clear retired-evidence note and no active build reference.
- [ ] GREEN: implement safe input/output JPEG sanitization, strip metadata from the canonical public Hero losslessly, verify 1920×1440 and decoded pixel equality, and document the repeatable `npm run hero:sanitize -- --input SOURCE_JPEG --output PUBLIC_JPEG` replacement syntax.
- [ ] GREEN: add a focal-aware object-cover geometry helper to the current `scripts/build-figma-export.mjs`; desktop and mobile must consume the same normalized Hero record. Do not touch `figma/hsin-portfolio-importer/`.
- [ ] Update the design contract, stale Bible showreel check, project status, and concise review evidence; identify the correct Hero photo as the only intentional Figma visual delta.
- [ ] Run `node --test tests/portfolio-contract.test.mjs tests/build-site.test.mjs tests/figma-export.test.mjs tests/hero-media.test.mjs`, then `npm test`, `npm run audit:design-contract`, `npm run build`, `npm run figma:export`, and `git diff --check`.
- [ ] Verify `/en/` and `/zh/` at desktop/mobile: no Play/video/MP4 request, unchanged initial crop and slow push, static reduced-motion state, localized accessible name, no console error; compare Figma export against baseline except Hero imagery.
- [ ] Recheck the protected untracked file hash and staging list, commit the complete behavior change as `feat: retire hero showreel and sync hero media`, push the feature branch, and verify exact remote SHA readback. Do not merge, create Preview, deploy Production, or touch `origin/main`.

## Execution handoff

- [ ] Execute inline in this task with review gates after each commit; use subagent-driven execution only if the user explicitly requests delegation.
