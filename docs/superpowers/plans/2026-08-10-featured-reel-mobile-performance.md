# Featured Reel Mobile Performance Implementation Plan
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
**Goal:** Reduce mobile Featured reel startup delay with verified mobile derivatives and one post-critical proximity warm, without changing approved visuals, copy, desktop/Archive behavior, or static fallbacks.
**Architecture:** Extend the canonical media manifest with one mobile delivery profile and recipe-derived Featured outputs; a prepare library/script validates source hashes and generated files. The site emits a mobile-first `<source>` inside each existing `<video>`, while the controller may metadata-warm only one mobile candidate after window load, subject to proximity, settled ownership, data-saver/network, reduced-motion, and lifecycle gates.
**Tech Stack:** Node.js ESM/test runner, ffmpeg/ffprobe, generated HTML/CSS, browser JavaScript, Playwright Chromium.
---
### Task 1: Freeze visual and delivery intent
**Files:** this plan; existing evaluation packet under `docs/reviews/featured-reel-mobile-performance-brainstorm-2026-08-10/`.
- [x] Preserve typography, copy, card geometry, 16:9 crop, poster/focal point, 700ms mobile hold, 260ms reveal, navigation, desktop, Archive, reduced-motion, and no-JS output.
- [x] Change only the selected mobile video bytes/source ordering and hidden pre-play request timing; no new visual treatment or Figma geometry.
- [x] Use the measured Option B boundary: no page-load preload-all or full-video preload; at most one metadata warm after critical page load, skipped for data saver/2G/reduced motion.
### Task 2: Establish derivative/source contracts in RED
**Files:** modify `tests/media-manifest.test.mjs`, `tests/build-site.test.mjs`; create `tests/featured-reel-delivery.test.mjs`.
- [x] Require one canonical mobile H.264 profile/recipe, derive output paths from existing Featured assets, and reject duplicate hand-authored source truth.
- [x] Require prepare/check scripts, exact source SHA verification, DPR3-evidence-selected 960×540 silent H.264 BT.709 faststart outputs, duration parity, output hashes, and no unplanned files.
- [x] Require each Featured `<video preload="none">` to contain a mobile media source before the existing desktop fallback; keep posters and initial HTML free of eager video preload.
- [x] Run focused tests and record expected failures before production edits.
### Task 3: Implement repeatable mobile derivatives
**Files:** modify `data/media-manifest.json`, `scripts/lib/media-manifest.mjs`, `package.json`; create `scripts/lib/featured-reel-delivery.mjs`, `scripts/prepare-featured-reels.mjs`; add generated manifest/assets.
- [x] Add the smallest validated profile/recipe to the canonical ledger and derive all six outputs mechanically from Featured owners.
- [x] Encode atomically with a bounded ~700 kbps ceiling, remove audio/metadata, add faststart, write generated evidence, and make `featured-reels:prepare --check` fail on drift.
- [x] Run prepare twice; require identical inventory/hashes and focused tests GREEN.
### Task 4: Establish and implement warm lifecycle in RED→GREEN
**Files:** modify `tests/featured-reel-runtime.test.mjs`, `src/main.js`, `docs/design-contract.md`, `PROJECT_BIBLE.md`.
- [x] First assert RED for: mobile-only; after `load`; one candidate; proximity/settle gating; `preload=metadata`; cancellation on ownership/lifecycle changes; data-saver/2G/reduced-motion/desktop skips; playback ownership unchanged.
- [x] Implement the minimum state machine using the existing Featured controller and BFCache lifecycle; never warm during active playback or issue concurrent Featured warm requests.
- [x] Run focused tests GREEN and confirm CSS/Figma output remains visually unchanged.
### Task 5: Verify evidence and close locally
**Files:** add bounded evidence under `docs/reviews/evidence/featured-reel-mobile-performance/`; update `STATUS.md` and the existing ≤10-line `docs/reviews/LOG.md` package entry.
- [x] Run `npm test`, `npm run build`, `npm run audit:design-contract`, `npm run figma:export`, delivery check, privacy/protected-path checks, and `git diff --check`.
- [x] Verify English/Chinese at desktop/tablet/mobile plus reduced-motion, no-JS, keyboard, overflow, BFCache, zero Contact POST, and exact poster/card geometry.
- [x] Repeat three identical throttled mobile before/after runs and report medians for request start/priority, first playing, media bytes, TBT, and CLS; stop if startup/bytes do not materially improve.
- [x] Freeze the diff/evidence for one independent `reviewing-with-multiple-ai` review, adjudicate locally, re-run final checks, and keep all work local pending producer approval.
**Rollback:** Revert only this bounded package; keep `bb08d51`, the phase-closeout tag/history, Production, aliases, Contact, and `main` untouched.
