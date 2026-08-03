# Portfolio Status

Updated: 2026-08-03

State: `PASS_WITH_OPEN_ITEMS`

## Current Work Package

- Package: `Portfolio Design Contract Governance v1` — project layer verified; skill/review pending
- Active branch: `codex/portfolio-design-contract-governance`
- Base local `main`: `da91e25f9f306f526ede45a53c5d542be93088ba`
- Final content implementation checkpoint: `dfdffa2`
- Final content closeout checkpoint: `cbed4a9`
- Governance baseline: `90b5d1a`
- Contract/audit checkpoint: `d12a98f`
- Normalization checkpoint: `977d8a3`
- Figma-alignment checkpoint: `5639fa7`
- Current audit: `docs/reviews/portfolio-design-contract-audit-v1-2026-08-03.md`
- Governance validation: `docs/reviews/portfolio-design-contract-governance-v1-2026-08-03.md`
- Final content review: `docs/reviews/final-content-cleanup-v1-2026-08-03.md`
- Latest Vercel Preview:
  `https://hsin-hsin-yuan-portfolio-preview-2qb5bbn2s.vercel.app`
- Deployment ID: `dpl_BQ4CziQ9G9q2Xj27uffnLff4AYtb`
- Deployment target/status: `preview` / `READY`
- Inspector:
  `https://vercel.com/projectmoonie-creators-projects/hsin-hsin-yuan-portfolio-preview/BQ4CziQ9G9q2Xj27uffnLff4AYtb`
- Original production website/domain: unchanged.

The producer approved Option A with a hard requirement that governance must not
reset the iteratively tuned layout. The project-level implementation is now
verified: canonical contract, read-only audit, explicit presentation variants,
normalization, and Figma current-reference alignment. Generated English/Chinese
HTML, CSS, and JavaScript remain byte-identical to baseline `90b5d1a`. The next
bounded step is the project-agnostic skill update, followed by independent
review and final local-main integration.

## Verification

- TDD: focused RED states were observed for the inspector, normalizer,
  presentation declarations, focal-field normalization, and Figma drift.
- `npm test`: 50 passed, 0 failed.
- `npm run audit:design-contract`: `PASS`, no active contract drift.
- `npm run build`: passed; the five frozen public-output hashes exactly match
  baseline `90b5d1a`.
- `npm run figma:export`: passed; only declared current-reference corrections
  changed Figma artifacts.
- `git diff --check`: passed.
- Local browser QA passed at `1440 × 900`, `1200 × 900`, `834 × 1112`,
  `390 × 844`, and `360 × 800`, in English and Chinese, plus reduced-motion,
  no-JavaScript, horizontal-overflow, section-order, media-ratio,
  Archive-width, Press-column, and keyboard-focus checks. Four fill cards and
  two centered 16:9 desktop variants were preserved; all six become 16:9
  at/below 820px.
- Desktop and mobile Works screenshots were visually inspected.
- No deployment was created. The contact form was not submitted and no email
  was sent.

## Accepted Open Items

1. The governance implementation remains local on
   `codex/portfolio-design-contract-governance`; the latest Preview does not
   contain it. Nothing was merged, pushed, or promoted.
2. The project layer passes. The general method still needs to be added to
   `portfolio-narrative-builder`, then independently reviewed before local-main
   integration.
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

Add the proven, project-agnostic format-contract and variant-governance method
to `portfolio-narrative-builder`, validate it, then run independent convergent
review. Re-run every gate before local-main integration. Do not deploy or
modify Production.

## Cold Resume

1. Read `AGENTS.md`, `PROJECT_BIBLE.md`, and this file.
2. Verify the branch, implementation/closeout commits, latest Preview metadata, closed
   tag object/peeled commit, and protected untracked file.
3. Read `docs/reviews/portfolio-design-contract-governance-v1-2026-08-03.md`,
   the underlying design-contract audit, and the final-content review.
4. Do not rely on old chat history or rewrite historical review files.
