# Hero LCP Optimization Implementation Plan
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
**Goal:** Replace the canonical Hero's CSS-background delivery with source-verified responsive semantic images and compositor-only slow push while preserving approved output.
**Architecture:** Extend `data/site.json.heroMedia` with one recipe-derived delivery contract; one focused library serves normalization, preparation, HTML/preload candidates, and integrity probes. Keep the existing frame/Figma source owner and replace only the website image/motion layer.
**Tech Stack:** Node.js ESM/test runner, generated HTML/CSS, ffmpeg/ffprobe/cwebp, Python Playwright, Lighthouse 13.4.1.
---
### Task 1: Freeze intent and baselines
**Files:** `docs/superpowers/specs/2026-08-10-hero-lcp-visual-equivalence.md`; `docs/reviews/evidence/hero-lcp-optimization/before/*`.
- [x] Record keep/change rules, tag/remote/protected-file state, five matched screenshots/geometry, CDP priority, and three Lighthouse mobile runs.
- [x] Verify baseline commands: `npm test` = 144/144; `npm run build`; `npm run audit:design-contract`; `npm run figma:export`; `git diff --check`.
### Task 2: Establish complete RED contracts before production code
**Files:** modify `tests/portfolio-contract.test.mjs`, `tests/build-site.test.mjs`, `tests/figma-export.test.mjs`, `tests/hero-media.test.mjs`; create `tests/hero-image-delivery.test.mjs`.
- [x] Assert one canonical recipe derives mobile/desktop AVIF/WebP/JPEG candidates, safe paths/sizes, source fingerprint, and immutable public/evidence boundaries.
- [x] Assert initial HTML has media-matched responsive preloads with `fetchpriority="high"` and semantic `<picture>/<img>` with width/height, bilingual alt, eager/high priority, and no CSS source variable.
- [x] Assert reduced motion is static, normal motion targets only `.hero-media-image` transform, and `heroStillPush` contains no background position/size.
- [x] Assert one canonical source mutation reaches website/Figma and old source/candidate URLs disappear; assert prepare/integrity command exists.
- [x] Run `node --test tests/portfolio-contract.test.mjs tests/build-site.test.mjs tests/figma-export.test.mjs tests/hero-media.test.mjs tests/hero-image-delivery.test.mjs`; 64/73 passed and nine expected RED failures proved missing delivery/markup/CLI plus forbidden legacy CSS.
### Task 3: Implement canonical recipe and repeatable derivatives
**Files:** modify `data/site.json`, `scripts/lib/portfolio-contract.mjs`, `package.json`; create `scripts/lib/hero-image-delivery.mjs`, `scripts/prepare-hero-images.mjs`; add generated files under `public/assets/portfolio/hero/`.
- [x] Implement the smallest validated recipe: canonical source SHA/dimensions, output basename, formats/qualities, named mobile/desktop widths and sizes; derive candidate URLs rather than storing a hand array.
- [x] Implement atomic staged encoding and verify source SHA, decoded dimensions, actual format, metadata safety, and expected outputs; expose `npm run hero:prepare`.
- [x] Run the focused delivery/contract tests until GREEN (24/24); run prepare twice and require the same 12 SHA-256 values with no unplanned writes.
### Task 4: Implement semantic LCP markup and transform-only motion
**Files:** modify `scripts/build-site.mjs`, `src/styles.css`, `docs/design-contract.md`; modify Figma source only if tests prove adaptation is required.
- [ ] Emit two media-qualified AVIF preloads whose `imagesrcset`/`imagesizes` exactly reuse normalized picture profiles; add `fetchpriority="high"`.
- [ ] Render `<picture>` sources and `<img>` from canonical candidates with intrinsic dimensions/localized alt; keep frame/overlay DOM ownership unchanged.
- [ ] Derive wide/stacked/mobile start/end/reduced transform variables matching the frozen absolute crop and animate only transform; reduced motion uses the approved static endpoint.
- [ ] Run focused tests and `npm run build`; inspect generated English/Chinese HTML for one discoverable Hero request contract and no legacy background source.
### Task 5: Prove visual and performance outcomes
**Files:** add `docs/reviews/evidence/hero-lcp-optimization/after/*` and machine-written comparison summaries.
- [ ] Repeat matched screenshots/geometry and calculate declared pixel thresholds; fail on any unauthorized Hero/text/layout drift.
- [ ] Repeat CDP: exactly one selected Hero request, initial priority High, no duplicate fallback; test English/Chinese desktop 1440, compact 1200, tablet 834, mobile 390, narrow 360, reduced motion, no-JS, keyboard, overflow, and zero Contact POST.
- [ ] Repeat Lighthouse 13.4.1 three times under identical mobile simulate conditions; compare medians for discovery, non-composited items, Hero bytes, LCP, TBT, and CLS; stop if evidence does not hold.
### Task 6: Full verification, independent review, and handoff
**Files:** update `STATUS.md`, append ≤10 lines to `docs/reviews/LOG.md`; no new dated closeout report.
- [ ] Run `npm test`, `npm run build`, `npm run audit:design-contract`, `npm run figma:export`, Figma diff/parity, privacy/private-path/protected-file checks, and `git diff --check`.
- [ ] Freeze the reviewed diff/evidence packet; use `reviewing-with-multiple-ai` at the applicable tier and locally adjudicate findings without letting reviewers edit.
- [ ] Recheck the protected file is the sole protected untracked path at exact SHA-256; commit only explicit package paths, preserve branch locally, and stop before Preview/deploy/alias/Contact/main operations.
**Rollback:** Revert the bounded package commits to `5483bfa`; closed tag `portfolio-phase-2026-08-10-closed` remains immovable at peeled `8289389`.
