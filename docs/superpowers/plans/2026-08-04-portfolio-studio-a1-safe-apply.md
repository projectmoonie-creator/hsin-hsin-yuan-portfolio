# Portfolio Studio A1-1 Safe Apply Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` task-by-task; do not dispatch subagents for this package.

**Goal:** Apply one canonically approved A0 Archive media plan locally with fail-closed preflight, byte-preserving edits, handled-error recovery, and exact-rerun idempotence.

**Architecture:** Add a dependency-free apply library behind one strict CLI. Recompute the A0 plan from probed sources, classify the entire target package before mutation, stage target-adjacent candidates, and install assets → manifest → content while retaining originals for recovery.

**Tech Stack:** Node.js ESM, built-in test runner, `ffprobe`, existing media manifest/planner libraries, Git.

---

### Task 1: Approval and state-machine contract

**Files:** Create `tests/media-package-apply.test.mjs` and `scripts/lib/media-package-apply.mjs`.

- [x] RED: test fresh apply, exact rerun, canonical-byte approval, strict schema/patch allowlist, confirm mismatch, partial/conflict refusal, source-target aliasing, redacted output, and injected recovery; observe the missing-module failure.
- [x] GREEN: implement canonical plan parsing, exact A0 recomputation, deterministic target resolution, full-package state classification, and sanitized receipts/errors without writing.
- [x] GREEN: implement targeted manifest/content candidate generation, target-adjacent staging, exact asset verification, ordered installation, and handled-error recovery.
- [x] REFACTOR: keep exported surface narrow and prove exact rerun makes zero writes through test hooks and byte/mtime assertions.

### Task 2: Strict local CLI

**Files:** Create `scripts/apply-archive-media-package.mjs`; modify `package.json` and `tests/media-package-apply.test.mjs`.

- [x] RED: test that `media:apply` exists, requires each option once, rejects unknown/duplicate/positional input, emits one redacted JSON receipt, and never prompts or performs Git/network/deploy actions.
- [x] GREEN: add the thin CLI and `media:apply` package script; pass only approved plan bytes and the three explicit values to the library.
- [ ] Run the focused tests and `npm test`; commit and push the coherent implementation, then read back the exact remote branch tip.

### Task 3: Repository validation and closeout

**Files:** Modify `STATUS.md` and `docs/reviews/LOG.md`; add a dated A1 recovery/security review only if required by the review tier.

- [ ] Capture a pre-implementation `dist` baseline; run `npm run audit:design-contract`, `npm run build`, `npm run figma:export`, `git diff --check`, and prove public output parity.
- [ ] If approved private Three-Minute sources remain, run the CLI against the preserved A0 plan and prove `already-applied` plus zero tracked changes.
- [ ] Run the required write/recovery review; record provider/model status honestly and do not claim unavailable reviewers.
- [ ] Update bounded status/log records, verify the protected untracked file hash, commit/push A1, and read back the exact branch tip.

### Rollback and non-goals

- Roll back A1-1 to `fb6517591e34b9cb20d814891c0177cf2ac9ba2c`; retain A0 and current public media/content.
- No CMS/database, lock/signature/trust registry, general collection support, power-loss atomicity claim, content redesign, source-master move, Git staging, `origin/main` update, Preview, Production deployment, or Contact submission.
