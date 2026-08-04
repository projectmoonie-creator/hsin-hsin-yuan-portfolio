# Portfolio Studio A0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` task-by-task; do not dispatch subagents for this package.

**Goal:** Make an approved Archive reel package require only public derivatives, one canonical manifest entry set, and one content-record edit.

**Architecture:** Preserve the current renderer and public contract. Move exact media integrity facts from test code to `data/media-manifest.json`; make tests and a dry-run planner consume one dependency-free library, then use that path for Three-Minute Micro Drama.

**Tech Stack:** Node.js ESM, built-in test runner, `ffprobe`, Git, current static-site generator.

---

### Task 1: Canonical media manifest with output parity

**Files:** Create `data/media-manifest.json`, `scripts/lib/media-manifest.mjs`, `tests/media-manifest.test.mjs`; modify `tests/media-assets.test.mjs`.

- [x] RED: test schema/profile validation, unique IDs/paths, safe `/assets/` resolution, owner-field linkage, and rejection of source absolute paths; run `node --test tests/media-manifest.test.mjs` and observe the missing-module failure.
- [x] GREEN: implement `loadMediaManifest`, `validateMediaManifest`, `resolvePublicAssetPath`, `probeMediaAsset`, and `verifyMediaAsset`; seed all six current Featured reels plus Overclocking reel/poster without weakening any exact size/hash/codec check.
- [x] Refactor `tests/media-assets.test.mjs` to iterate the manifest; run both focused tests and `npm test`.
- [x] Run `npm run build`; `diff -rq /private/tmp/portfolio-studio-a0-baseline.xxp1Ee/dist dist` must print nothing.
- [x] Commit and push the coherent foundation; read back the exact remote branch tip.

### Task 2: Dry-run Archive media-package planner

**Files:** Create `scripts/lib/media-package-plan.mjs`, `scripts/plan-archive-media-package.mjs`, `tests/media-package-plan.test.mjs`; modify `package.json`.

- [x] RED: test that an absolute reel/poster input produces a deterministic JSON plan containing only basenames/public targets, bilingual alt text, rights, timecode, manifest entries, and a frontmatter patch; assert missing rights/alt/timecode fails and no file is written.
- [x] Run `node --test tests/media-package-plan.test.mjs`; observe the missing-module failure.
- [x] GREEN: implement pure plan assembly plus real `ffprobe`/SHA probing through the Task 1 library; expose `npm run media:plan -- ...` as dry-run only.
- [x] Run the focused test, `npm test`, `npm run build`, and the unchanged-output diff.
- [ ] Commit and push the coherent planner; read back the exact remote branch tip.

### Task 3: Three-Minute Micro Drama steel thread

**Files:** Modify `data/media-manifest.json`, `content/archive/three-minute-micro-drama.md`; add `public/assets/showreel/three-minute-micro-drama-card-reel.mp4` and `public/assets/showreel/three-minute-micro-drama-card-reel-poster.webp`.

- [ ] Run `npm run media:plan` against the approved private MP4/WebP with slug, rights, bilingual alt, and `00:10:00.750`; preserve the dry-run output outside Git and verify it contains no absolute source path.
- [ ] RED: apply only the generated Three-Minute frontmatter patch, then run the Task 1 coverage test and observe missing manifest/assets failures.
- [ ] Copy the exact approved derivatives and add only the generated manifest entries; do not modify source masters or the protected untracked review file.
- [ ] Run focused manifest/package tests, `npm test`, `npm run audit:design-contract`, `npm run build`, `npm run figma:export`, `git diff --check`, full decode, and desktop/mobile local visual checks.
- [ ] Run privacy/rights review under the project review tier; record provider status honestly and keep Preview/Production untouched.
- [ ] Add the bounded rights closeout/status entry, commit, push the branch, read back the exact tip, and report the producer's next Preview/merge decision.

### Rollback and non-goals

- Roll back Task 3 to retain the reusable A0 foundation without publishing Three-Minute; roll back Tasks 1–2 to return to `382e02a21fbcf6ffef68881b7e497235eaf8a7a8`.
- No hosted CMS, write-mode UI, renderer/CSS redesign, source-master move, `origin/main` update, Preview, merge, alias, Contact submission, or Production deployment.
