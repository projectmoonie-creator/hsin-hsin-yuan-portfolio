# Portfolio Status

Updated: 2026-08-03

State: `PASS_WITH_OPEN_ITEMS`

## Current Work Package

- Package: `Final Content Cleanup v1`
- Active branch: `codex/final-content-cleanup`
- Base local `main`: `da91e25f9f306f526ede45a53c5d542be93088ba`
- Current implementation checkpoint: `dfdffa2`
- Review: `docs/reviews/final-content-cleanup-v1-2026-08-03.md`
- Latest Vercel Preview:
  `https://hsin-hsin-yuan-portfolio-preview-2qb5bbn2s.vercel.app`
- Deployment ID: `dpl_BQ4CziQ9G9q2Xj27uffnLff4AYtb`
- Deployment target/status: `preview` / `READY`
- Inspector:
  `https://vercel.com/projectmoonie-creators-projects/hsin-hsin-yuan-portfolio-preview/BQ4CziQ9G9q2Xj27uffnLff4AYtb`
- Original production website/domain: unchanged.

This local package removes the second site-owned title layer from the four
requested Featured Works cards while preserving text embedded in source
artwork. It moves the 2025 Very Mulan interview to the global text-only Press
section above the 2021 Women Make Waves Part 1 row, removes redundant Press and
Archive descriptions, and removes the Design `editing` tag without removing the
credited `Director / Editor` role. No media asset changed.

## Verification

- TDD: focused assertions failed first for the media-label contract, global
  Press ownership/order, and Archive/Design repetition, then passed after each
  bounded implementation.
- `npm test`: 42 passed, 0 failed.
- `npm run build`: passed.
- `npm run figma:export`: passed; no tracked parity-file changes.
- `git diff --check`: passed.
- Local browser QA passed at `1440 × 900`, `1200 × 900`, `834 × 1112`,
  `390 × 844`, and `360 × 800`, in English and Chinese, plus reduced-motion,
  no-JavaScript, horizontal-overflow, and keyboard-focus checks. The mobile
  media contract was evaluated at the actual `820px` breakpoint; wider cards
  retained the approved 40/60 layout.
- Desktop and mobile screenshots of Tech Dreamers, Top Gear, Archive, and Press
  were visually inspected.
- No deployment was created. The contact form was not submitted and no email
  was sent.

## Accepted Open Items

1. The current cleanup remains local on `codex/final-content-cleanup`; the
   latest Preview does not contain it. Nothing was merged, pushed, or promoted.
2. The next requested phase is a project-wide design-contract audit followed by
   evaluation of reusable additions to `portfolio-narrative-builder`.
3. The remaining Facebook destination is a public third-party availability and
   logged-out access risk. The page does not depend on its images or metadata.
4. Top Gear's `0.81` value remains CV-sourced. The first-five-episode audience,
   weekly live average, and four-week national time-slot rank are publicly
   corroborated and recorded in the preceding annotated-content review.

## Closed Baseline

- Closed baseline tag: `portfolio-phase-2026-07-29-closed`
- Annotated tag object: `68d99c13341f27ad388a8c9bc06df22b3d38bcf2`
- Peeled commit: `7e6200106fe9feb10331e6558981b0314de00597`
- The current branch preserves this baseline and all later approved work.

## Protected Worktree Item

The sole untracked file remains user-owned and untouched:

`docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md`

## Exact Next Action

Complete the design and content contract audit. Use multi-AI brainstorming for
the governance/skill architecture decision, present the proposed split between
project-specific rules and reusable skill principles, and wait for approval
before implementing that architecture. Do not deploy or modify Production.

## Cold Resume

1. Read `AGENTS.md`, `PROJECT_BIBLE.md`, and this file.
2. Verify the branch, implementation commit, latest Preview metadata, closed
   tag object/peeled commit, and protected untracked file.
3. Read `docs/reviews/final-content-cleanup-v1-2026-08-03.md`.
4. Do not rely on old chat history or rewrite historical review files.
