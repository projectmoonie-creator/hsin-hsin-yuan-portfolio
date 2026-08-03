# Portfolio Status

Updated: 2026-08-03

State: `PASS_WITH_OPEN_ITEMS`

## Current Work Package

- Package: `Portfolio Design Contract Governance v1` — decision pending
- Active branch: `codex/final-content-cleanup`
- Base local `main`: `da91e25f9f306f526ede45a53c5d542be93088ba`
- Final content implementation checkpoint: `dfdffa2`
- Final content closeout checkpoint: `cbed4a9`
- Current audit: `docs/reviews/portfolio-design-contract-audit-v1-2026-08-03.md`
- Final content review: `docs/reviews/final-content-cleanup-v1-2026-08-03.md`
- Latest Vercel Preview:
  `https://hsin-hsin-yuan-portfolio-preview-2qb5bbn2s.vercel.app`
- Deployment ID: `dpl_BQ4CziQ9G9q2Xj27uffnLff4AYtb`
- Deployment target/status: `preview` / `READY`
- Inspector:
  `https://vercel.com/projectmoonie-creators-projects/hsin-hsin-yuan-portfolio-preview/BQ4CziQ9G9q2Xj27uffnLff4AYtb`
- Original production website/domain: unchanged.

The final content cleanup is complete and verified locally. The current
follow-up is a read-only design/content-contract governance audit prompted by
the repeated effort needed to make card fields, media treatment, Archive,
Press, Figma, and responsive rules consistent. The audit recommends a hybrid
source-record → normalized public view-model → named component-variant
architecture. No governance implementation or shared-skill edit has begun;
producer selection is required first.

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
2. The design-contract audit is complete. The producer must choose between:
   Option A hybrid/two-package governance (recommended), Option B documentation
   only, or Option C full strict migration now.
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

Ask the producer to choose the design-governance option. If Option A is
approved, write the project contract and report-only inspector first with no
visual change. Only after that project contract proves useful should the
general principles be added to `portfolio-narrative-builder`. Do not deploy or
modify Production.

## Cold Resume

1. Read `AGENTS.md`, `PROJECT_BIBLE.md`, and this file.
2. Verify the branch, implementation/closeout commits, latest Preview metadata, closed
   tag object/peeled commit, and protected untracked file.
3. Read `docs/reviews/portfolio-design-contract-audit-v1-2026-08-03.md` and
   `docs/reviews/final-content-cleanup-v1-2026-08-03.md`.
4. Do not rely on old chat history or rewrite historical review files.
