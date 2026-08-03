# Mobile featured media parity QA — 2026-08-03

## Outcome

**PASS_WITH_OPEN_ITEMS**

- Declared scope: give all six Featured Works cards the same fixed `16:9`
  image area on mobile while preserving the existing desktop layouts.
- Branch: `codex/contact-archive-entrypoints`
- Implementation and exact deployed checkout:
  `533347ba9d369e1f7695d29b9ee86c91c192191c`
- Design contract and implementation plan:
  `docs/superpowers/specs/2026-08-03-mobile-featured-media-parity-design.md`
  and
  `docs/superpowers/plans/2026-08-03-mobile-featured-media-parity.md`
- Latest Preview:
  `https://hsin-hsin-yuan-portfolio-preview-2qb5bbn2s.vercel.app`
- Deployment: `dpl_BQ4CziQ9G9q2Xj27uffnLff4AYtb`; target `preview`;
  status `READY`.
- Inspector:
  `https://vercel.com/projectmoonie-creators-projects/hsin-hsin-yuan-portfolio-preview/BQ4CziQ9G9q2Xj27uffnLff4AYtb`
- Production website/domain: unchanged.
- The user explicitly authorized a local merge to `main` after completion.
  No push, pull request, branch deletion, or production promotion was
  authorized.

## User-visible contract

At viewports up to `820px`, the media area of Slow Steps, Tech Dreamers,
My Art, My Voice, Design & Brand Films, Nothing by Bus, and Top Gear China:
UK Special now uses one shared `16:9` rule. This enlarges the previously
shallow Tech Dreamers, My Art, My Voice, and Top Gear imagery to the same
mobile scale as the other featured cards.

The desktop ownership rules remain unchanged: Slow Steps, Tech Dreamers,
My Art, My Voice, and Top Gear retain their full-height left-column media;
Design and Nothing by Bus retain their centered `16:9` media treatment.
Labels, images, reels, links, copy, press entries, and metrics are unchanged.

## Test-first and deterministic evidence

A focused regression test was written first. It failed against the prior CSS
because only `.media-frame-unlabeled` received the mobile `16:9` rule. The
smallest production change moved that rule to the shared `.media-frame`
selector and removed the redundant unlabeled-only exception.

The first complete test run also detected that the newly committed plan
contained a private absolute path. The failure reproduced consistently and
was isolated to the plan; replacing that path with the documented
`<registered-main-worktree>` placeholder restored the privacy contract without
changing the test. The focused privacy test and complete suite then passed.

| Check | Result |
| --- | --- |
| focused mobile media regression | RED before CSS change; GREEN after change |
| focused private-path regression | GREEN after plan correction |
| `npm test` | 40 passed, 0 failed |
| `npm run build` | passed |
| `npm run figma:export` | passed; no tracked parity-file changes |
| `git diff --check` | passed |

The protected duplicate review file remained untracked and untouched.

## Local visual and interaction QA

Native Playwright Chromium checks passed for:

- English mobile at `390 × 844`;
- Chinese mobile at `360 × 800`;
- desktop at `1440 × 900` and `1200 × 900`;
- tablet at `834 × 1112`;
- mobile `prefers-reduced-motion: reduce`;
- mobile with JavaScript disabled;
- keyboard navigation and visible focus on the Tech Dreamers media link.

At both mobile widths, all six media frames measured `1.7778`. There was no
horizontal overflow and no application console or page error. At the three
larger widths, the non-wide cards still reported computed `aspect-ratio: auto`
and a two-column grid, confirming that the desktop treatment was not changed.
Reduced motion suppressed the Hero animation and featured reels; all six
mobile media frames remained visible and `16:9` without JavaScript.

Element screenshots for Tech Dreamers, My Art, My Voice, Top Gear, and the
desktop Tech Dreamers card were visually inspected. External images were
replaced with successful empty responses during deterministic local QA, so the
Tech Dreamers screenshot verified layout and label placement rather than the
third-party bitmap. The Playwright script and screenshots were disposable
`/private/tmp` QA artifacts, not portfolio assets.

## Deployment boundary

The Preview stage contained the same 22 approved public payload paths as the
preceding safe deployment. Its sorted relative path-list SHA-256 was:

`1940a63b96e81606d82bb164be8f66b9d9292da10c45d79474adc41e05505388`

The stage included only generated public pages, eleven referenced public media
assets, the contact endpoint, and minimal Vercel/package configuration. It
excluded Git history, source content, tests, reviews, original reel sources,
unused media, the India group photograph, and the protected duplicate review
file. The temporary `.env.local` OIDC file and generated staging `.gitignore`
were deleted before deployment and did not enter the payload.

Vercel reported deployment `dpl_BQ4CziQ9G9q2Xj27uffnLff4AYtb` as `READY`.
The Preview URL and contact endpoint were not requested after deployment, in
accordance with the active deployment skill. No form submission or email side
effect occurred.

## Review decision

External Claude/Gemini review was skipped. This package is one narrow,
reversible responsive-CSS ownership correction backed by a focused regression
test and a full browser matrix. It does not change data, media, APIs, security,
or production routing.

## Local main integration

The user selected local merge. After the Preview and closeout records were
committed at `4e42e9b9595e7cf7d9e41166ba538a8b34bfa3db`, local `main` was
fast-forwarded from `5cdb8420b3abc05404c7613f462d8cdffd939284` to that completed
feature tip. The merged `main` checkout then passed all 40 tests and
`npm run build`.

The pre-existing primary worktree was on a different branch and contained two
uncommitted user document edits. It was not switched or modified. Integration
instead used an isolated, disposable `main` worktree. The host-owned portfolio
worktree and source feature branch were retained. No remote fetch, pull, push,
PR, branch deletion, tag, or Production promotion occurred.

## Accepted open items and next action

1. Manually inspect the new Preview on a phone, especially Tech Dreamers,
   My Art, My Voice, and Top Gear. Do not submit the contact form.
2. The remaining Facebook destination is a public third-party availability and
   logged-out access risk.
3. Top Gear's `0.81` value remains CV-sourced; the other audience context is
   recorded in the preceding annotated-content review.
4. The completed package is integrated into local `main`; keep Production
   unchanged until the user gives separate explicit approval.
