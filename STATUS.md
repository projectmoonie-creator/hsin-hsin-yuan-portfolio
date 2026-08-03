# Portfolio Status

Updated: 2026-08-03

State: `PASS_WITH_OPEN_ITEMS`

## Current Work Package

- Package: `Archive Drama Posters and Credit Links v1`
- Active branch: `codex/contact-archive-entrypoints`
- Implementation and exact deployed checkout:
  `f79d9a07b21ae9b4b382b0dde918b395da6572e6`
- Review:
  `docs/reviews/archive-drama-posters-and-credit-links-v1-2026-08-03.md`
- Latest Vercel Preview:
  `https://hsin-hsin-yuan-portfolio-preview-bjxhmtfey.vercel.app`
- Deployment ID: `dpl_81WdpDZGBr53ujW9EMyVJVDaWZRG`
- Deployment target/status: `preview` / `Ready`
- Inspector:
  `https://vercel.com/projectmoonie-creators-projects/hsin-hsin-yuan-portfolio-preview/81WdpDZGBr53ujW9EMyVJVDaWZRG`
- Original production website/domain: unchanged.

This package replaces the generic YouTube thumbnails for `Heart of Steel` and
`Lying Game` with public-link-only series posters. Each card keeps the official
trailer/promo action and adds a separate HTTPS credit link. The public Wikipedia
entries and the production-company pages both list `袁欣欣` as a screenwriter.
The production-company pages are recorded as source evidence but are not public
buttons because they are currently HTTP-only and their HTTPS certificate is
invalid.

## Verification

- TDD: the poster, credit-link, and dual-action tests failed against the old
  implementation before the production change, then passed.
- `npm test`: 36 passed, 0 failed.
- `npm run build`: passed.
- `npm run figma:export`: passed with no generated tracked diff.
- `git diff --check`: passed.
- Local browser QA passed in English and Chinese at `1440 × 1000` and
  `390 × 844`: five equal-height Archive cards, two loaded posters, four text
  action links, two linked media frames, no nested links, no horizontal
  overflow, and no console errors.
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

1. Manually open the latest Preview and confirm the two Archive posters and
   both `View credited role` / `查看編劇署名` links. This is the sole deployment
   inspection item; do not submit the contact form.
2. The active branch is retained locally and is ahead of its recorded origin.
   The user has not yet selected merge, PR/push, keep, or discard. Do not infer
   authorization to push, merge, tag, or delete it.
3. Wikimedia poster URLs are public-link-only third-party dependencies. They
   are not rehosted; the page removes a poster cleanly if the remote image later
   fails.

## Closed Baseline

- Closed baseline tag: `portfolio-phase-2026-07-29-closed`
- Annotated tag object: `68d99c13341f27ad388a8c9bc06df22b3d38bcf2`
- Peeled commit: `7e6200106fe9feb10331e6558981b0314de00597`
- The current branch preserves this baseline and all later approved work.

## Protected Worktree Item

The sole untracked file remains user-owned and untouched:

`docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md`

## Exact Next Action

Have the user inspect the latest Preview. If approved, ask which branch finish
option they want: merge locally, push/create a PR, keep as-is, or discard. Do
not modify production routing without separate explicit approval.

## Cold Resume

1. Read `AGENTS.md`, `PROJECT_BIBLE.md`, and this file.
2. Verify the branch, implementation commit, latest Preview metadata, closed
   tag object/peeled commit, and protected untracked file.
3. Read
   `docs/reviews/archive-drama-posters-and-credit-links-v1-2026-08-03.md`.
4. Do not rely on old chat history or rewrite historical review files.
