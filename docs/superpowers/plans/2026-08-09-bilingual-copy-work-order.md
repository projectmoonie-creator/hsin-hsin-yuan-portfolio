# Bilingual Copy Work Order Implementation Plan
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans inline. Steps use checkbox (`- [ ]`) syntax for tracking.
**Goal:** Add a guarded, reusable editorial work-order path, then apply the approved 13 P0 and 18 P1 bilingual copy entries without changing layout or external state.
**Architecture:** Excel remains the review artifact; a frozen JSON work order carries provenance and exact preconditions; repository data remains canonical. A dependency-free Node CLI preflights every selected entry, performs format-preserving scalar replacements, and rolls back handled multi-file failures.
**Tech Stack:** Node.js ESM, `node:test`, JSON frontmatter, existing static-site/Figma generators and browser QA.
---
### Task 1: Work-order contract and dry-run
**Files:** create `tests/copy-work-order.test.mjs`, `scripts/lib/copy-work-order.mjs`; modify `package.json`.
- [x] Write RED tests importing `validateCopyWorkOrder`, `planCopyWorkOrder`, and `applyCopyWorkOrder`; require schema v1, paired locales, `replace|keep`, exact `site.*`/`featured.<slug>.*` resolution, dry-run byte identity, stale-value refusal, duplicate-token refusal, and exact summary counts.
- [x] Run `node --test tests/copy-work-order.test.mjs`; expect module-not-found RED.
- [x] Implement the minimum pure validator/resolver and plan result `{mode, priority, entries, replacements, keeps, conflicts, files, writesFiles:false}`; add `copy:apply` mapped to `node scripts/apply-copy-work-order.mjs` only after the focused test demands it.
- [x] Run the focused test; expect GREEN.
### Task 2: Guarded CLI and handled rollback
**Files:** create `scripts/apply-copy-work-order.mjs`; modify `scripts/lib/copy-work-order.mjs`, `tests/copy-work-order.test.mjs`, `package.json`.
- [x] Add RED tests for default dry-run, strict `--work-order PATH [--priority P0|P1] [--write]`, preflight-before-write, byte-preserving replacement, injected second-target failure rollback, and zero staging residue.
- [x] Run `node --test tests/copy-work-order.test.mjs`; expect focused failures for missing CLI/write behavior.
- [x] Implement staging beside targets, backup/rename replacement, reverse-order restoration in `catch`, and cleanup in `finally`; do not claim power-loss atomicity.
- [x] Run the focused test; expect GREEN, then `npm test`; expect 111 existing tests plus new focused tests all green.
### Task 3: Freeze the real 31-entry transport and Batch 0 checkpoint
**Files:** create `editorial/copy-work-orders/2026-08-09-priority-bilingual.json`; modify `tests/copy-work-order.test.mjs`.
- [x] Add a RED integration assertion for baseline/source hashes, 31 entries, P0=13, P1=18, replacements=57, keeps=5, seven declared source files, and zero conflicts against HEAD `2f56352…99f`.
- [x] Run the focused test; expect missing-work-order RED.
- [x] Add the work order with exact expected/current values and approved next values; run `npm run copy:apply -- --work-order editorial/copy-work-orders/2026-08-09-priority-bilingual.json`; expect dry-run and zero writes.
- [x] Run focused/full tests and `git diff --check`; commit Batch 0 and preserve it only to a unique `backup/2026-08-09/*` ref with exact remote readback.
### Task 4: Apply P0 bilingual positioning
**Files:** modify `tests/build-site.test.mjs`, `tests/figma-export.test.mjs`, then `data/site.json`; regenerate tracked `figma-export/*.svg`.
- [x] Change only P0 copy-contract expectations to approved values and run their focused tests; expect RED against old canonical copy.
- [x] Run `npm run copy:apply -- --work-order editorial/copy-work-orders/2026-08-09-priority-bilingual.json --priority P0 --write`; expect 13 entries and the approved paired-locale replacements.
- [x] Run focused tests, `npm run build`, `npm run figma:export`, design audit, and diff check; inspect the diff for copy/test/generated-only scope.
- [x] Commit P0 and preserve the checkpoint to a unique backup ref with exact readback.
### Task 5: Apply P1 Featured Work copy
**Files:** modify `tests/build-site.test.mjs`, then six `content/works/*.md`; regenerate tracked Figma SVGs.
- [x] Change only P1 copy-contract expectations and run focused tests; expect RED against old Featured copy.
- [x] Run the guarded CLI with `--priority P1 --write`; require P0 precondition already satisfied and expect 18 entries.
- [x] Run focused/full tests, build, Figma export, design audit, and diff check; inspect exactly six canonical work files plus approved tests/generated artifacts.
- [x] Commit P1 and preserve the checkpoint to a unique backup ref with exact readback.
### Task 6: Responsive QA and durable handoff
**Files:** modify `STATUS.md`, `docs/reviews/LOG.md` only after product gates pass.
- [x] Serve the exact local `dist/` on a free port; verify its fingerprint, then inspect English/Chinese at 1440×900 and 390×844 plus tablet only if a failure appears; check overflow, clipping, console/request errors, Contact non-submission, and the denser English P1 cards.
- [x] Re-run `npm test`, build, Figma export, design audit, `git diff --check`, protected-file SHA, `git status -sb`, and remote-backup reachability.
- [x] Record branch/commits, source hashes, RED/GREEN evidence, Gemini provenance, incomplete Claude handoff, browser result, no main/Preview/deploy action, and the remaining 44-copy backlog in STATUS/LOG (≤10 LOG lines).
- [x] Commit the handoff, create/read back one final unique backup ref, and verify the protected document is still the sole untracked item.
