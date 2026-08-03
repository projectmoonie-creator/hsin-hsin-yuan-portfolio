# Portfolio Status

Updated: 2026-08-03

State: `PASS_WITH_OPEN_ITEMS`

## Current Work Package

- Package: `Annotated Content Trim v1`
- Active branch: `codex/contact-archive-entrypoints`
- Implementation and exact deployed checkout:
  `34b5d41bcc48d581c6d18167dbad024ddca18489`
- Review:
  `docs/reviews/annotated-content-trim-v1-2026-08-03.md`
- Latest Vercel Preview:
  `https://hsin-hsin-yuan-portfolio-preview-jfahkwa2x.vercel.app`
- Deployment ID: `dpl_EphnKSXpHtgnR8TCKod1BkEiX1QQ`
- Deployment target/status: `preview` / `Ready`
- Inspector:
  `https://vercel.com/projectmoonie-creators-projects/hsin-hsin-yuan-portfolio-preview/EphnKSXpHtgnR8TCKod1BkEiX1QQ`
- Original production website/domain: unchanged.

This package applies the user's six annotated mobile screenshots. It removes
the Hero's leading second-line slash; trims duplicate Design and Nothing by Bus
proof; gives Design one `Watch selected reel` action; contextualizes Top Gear's
four-number block; removes small external-arrow glyphs from Archive and Press;
and simplifies the bottom section to one verified, text-only `PRESS` record.
The established type, color, media, 40/60, and archive-card systems remain.

## Verification

- TDD: focused content/rendering/Figma assertions failed against the old
  implementation for the intended eight contract differences, then passed.
- `npm test`: 39 passed, 0 failed.
- `npm run build`: passed.
- `npm run figma:export`: passed; two tracked SVG parity files updated.
- `git diff --check`: passed.
- Local browser QA passed at `1440 × 900`, `1200 × 900`, `834 × 1112`,
  `390 × 844`, and `360 × 800`, plus English/Chinese, reduced-motion,
  no-JavaScript, and keyboard-focus states: one Press record, five Archive
  cards, the intended work proof/actions, clear Top Gear context, no horizontal
  overflow, and no console or page errors.
- Desktop and mobile element screenshots for Hero, Design, Nothing by Bus, Top
  Gear, Archive, and Press were visually inspected and passed.
- Preview payload: the same 22 approved public paths used by the previous safe
  package; sorted path-list SHA-256
  `1940a63b96e81606d82bb164be8f66b9d9292da10c45d79474adc41e05505388`.
- The temporary Vercel `.env.local` OIDC file created during project linking was
  deleted before deployment and was not committed or included in the approved
  payload.
- No direct request was made to the deployed Preview because the active
  `vercel-deploy` skill prohibits fetching it. The contact form was not
  submitted and no email was sent.

## Accepted Open Items

1. Manually open the latest Preview and inspect Top Gear's proof block, the
   trimmed featured-work cards, Archive, and the single Press row. Do not submit
   the contact form.
2. The active branch is retained locally and is ahead of its recorded origin.
   The user has not yet selected merge, PR/push, keep, or discard. Do not infer
   authorization to push, merge, tag, or delete it.
3. The remaining Facebook destination is a public third-party availability and
   logged-out access risk. The page does not depend on its images or metadata.
4. Top Gear's `0.81` value remains CV-sourced. The first-five-episode audience,
   weekly live average, and four-week national time-slot rank are publicly
   corroborated and recorded in the current review.

## Closed Baseline

- Closed baseline tag: `portfolio-phase-2026-07-29-closed`
- Annotated tag object: `68d99c13341f27ad388a8c9bc06df22b3d38bcf2`
- Peeled commit: `7e6200106fe9feb10331e6558981b0314de00597`
- The current branch preserves this baseline and all later approved work.

## Protected Worktree Item

The sole untracked file remains user-owned and untouched:

`docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md`

## Exact Next Action

Have the user inspect the latest full-site Preview. If approved, ask which
branch finish option they want: merge locally, push/create a PR, keep as-is, or
discard. Do not modify production routing without separate explicit approval.

## Cold Resume

1. Read `AGENTS.md`, `PROJECT_BIBLE.md`, and this file.
2. Verify the branch, implementation commit, latest Preview metadata, closed
   tag object/peeled commit, and protected untracked file.
3. Read `docs/reviews/annotated-content-trim-v1-2026-08-03.md`.
4. Do not rely on old chat history or rewrite historical review files.
