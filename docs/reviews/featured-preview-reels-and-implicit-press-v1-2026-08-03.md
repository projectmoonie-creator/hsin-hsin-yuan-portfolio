# Featured Preview Reels and Implicit Press v1 — Local Closeout

Date: 2026-08-03
Final status: `PASS_WITH_OPEN_ITEMS`

## Identity and closeout boundary

- Branch: `codex/featured-preview-reels-implicit-press`
- Base and rollback checkpoint:
  `be5ff4fe3d828a85c955764dedf9e0ce1200e0f6`
- Validated implementation head:
  `f264f471e7c69acc2a2573e4d18fc2145c3ef5bd`
- This report and the mutable status/plan updates belong to the subsequent
  closeout commit. Its exact commit SHA is reported externally after that
  commit exists; it is intentionally not self-referenced here.
- This is a local closeout only. It did not deploy, change Production, merge
  local `main`, or submit the contact form.

## Scope and outcome

- Three complete, silent, optimized Featured reels were added for Slow Steps,
  Tech Dreamers, and My Art, My Voice.
- All five Featured reels now use the canonical `after-hold` contract: 35%
  eligibility, the last eligible reel in DOM order, a 1.4-second poster hold,
  and poster retention until `playing`. Exit, visibility, media-error,
  generation/rejected-play, `pagehide`, and persisted BFCache paths reset or
  rebind safely.
- Existing posters and destinations remain canonical. Slow Steps remains
  unlinked.
- The visible Work Press group heading was removed. Its localized semantic
  group label and visible per-card types remain; global Press is unchanged.
- Current design, Figma, and project-governance documentation is aligned. No
  Figma output changed.

## Approved local sources

The durable record intentionally contains basenames and evidence only, never
external source paths. Rights for every row are
`user-supplied-local-source`.

| Work | Approved basename | Source SHA-256 | Duration (s) | Dimensions | Rights |
| --- | --- | --- | ---: | ---: | --- |
| Slow Steps | `Slow Steps 30s系列網路平台宣傳片完成檔.mp4` | `0def72570da58eeb51af84b07d4cd880b666a3b8718702f7236af468b07f55ba` | 30.03 | 1920×1080 | `user-supplied-local-source` |
| Tech Dreamers | `Promo Tech Dreamers Series 日期版 0705.mp4` | `5a1eff80776aed305a0144f135ff9d433374f647fe0feca7a2e72ba708beeb0e` | 30.03 | 1920×1080 | `user-supplied-local-source` |
| My Art, My Voice | `My art  my voice  0214 預告完成檔.mp4` | `d7ab1b3c7e4a70b479af7ab28801a9c41993576502aaca87fa7032adef1e1bdd` | 100.033267 | 1920×1080 | `user-supplied-local-source` |

## Exact public derivatives

Each derivative preserves its complete source timeline and is H.264
1280×720, yuv420p, BT.709 space/transfer/primaries, video-only, and faststart
(`moov` before `mdat`). Full decode-to-null completed with exit `0` for all
three files.

| Public derivative | Bytes | Duration (s) | SHA-256 |
| --- | ---: | ---: | --- |
| `public/assets/showreel/slow-steps-card-reel.mp4` | 7,427,742 | 30.03 | `6061dceb6e583a5fc20d695b6cb555f4e02a80970b41bda8ec787acb3f3f1174` |
| `public/assets/showreel/tech-dreamers-card-reel.mp4` | 6,441,958 | 30.03 | `4c6c1070902b9d6dd8b170c8021c3bca303a9e2c9a1abca05a7911264f23835c` |
| `public/assets/showreel/my-art-my-voice-card-reel.mp4` | 32,662,721 | 100.033267 | `f5e79c8e8e13b62b337b75190f25b7d034d6059e297f8044da56d6e00a682e93` |

## Deterministic validation

- Full suite: `npm test` passed `61/61`.
- Focused runtime lifecycle suite passed `6/6`; focused contract, media,
  renderer, audit, and Figma coverage also passed.
- `npm run audit:design-contract`, `npm run build`,
  `npm run figma:export`, `git diff --check`, and the privacy scan passed.
- Exact Figma current-reference hashes remained unchanged:

| Artifact | SHA-256 |
| --- | --- |
| `figma-export/01-desktop-home.svg` | `818a95fd1b41f5d84ac30842887f564c2f83d60ba3b7769255a3e0789373647e` |
| `figma-export/02-desktop-works-logos.svg` | `8368e496d283f47a2fd73742f24dc46512275e251be6caf500c448a623a8a03f` |
| `figma-export/03-mobile-home.svg` | `43ecb8b502fe606505a5fa4a590a03d0b3da8091377acd9146bf8e65e8564e06` |
| `figma-export/README.md` | `1a91858e1c323a7e76e7e1015b05cbc50f8005658628cf686ea4c4284668f625` |

## Browser evidence

- Local Chromium QA passed all `10/10` English/Chinese viewport cases at
  1440×900, 1200×900, 834×1112, 390×844, and 360×800. There was no horizontal
  overflow, console warning/error, page error, failed request, or HTTP error.
- Real timing proved the poster hold, reveal only after `playing`, continuing
  playback, exit reset, and re-entry. Natural two-reel eligibility proved that
  the later eligible DOM reel owns playback. Media-error and persisted BFCache
  cases were explicitly synthetic; visibility used a reversible controlled
  state. Reset, re-entry, and replay all passed.
- Reduced motion, no JavaScript, real keyboard navigation/focus visibility,
  semantic Work Press/global Press separation, and contact-without-submit all
  passed.
- The request ledger contains zero `/api/contact` POST requests. No contact
  submit action or deployment command ran.
- The identified local port was stopped, and the repository returned to its
  pre-QA state.
- Browser tool versions: Python `3.9.6`, Playwright `1.60.0`, Chromium
  `148.0.7778.96`.
- Disposable r2 session evidence was stored at
  `/private/tmp/featured-browser-qa-r2.fKm9Mi`. Its manifest verified `98/98`
  entries; the manifest SHA-256 is
  `418ece08fd3b13ec2a2f8f8d5e20794f82fc1fdcf9333f9a070d108394d6d1d6`.
  This review contains the necessary durable summary and does not depend on
  that disposable location.
- No baseline pixel-diff claim is made.

## Sole open item

> Matched pre-package browser comparison remains unavailable because the recorded historical Vercel Preview redirects unauthenticated QA contexts through Vercel SSO to the login page; no portfolio DOM, matched Featured screenshots, geometry/crop comparison, or pixel statistics could be obtained.

This does not indicate a local product defect. The unchanged Figma hashes are
supporting evidence, not a substitute for the unavailable comparison.

## Existing external state, unchanged

- Latest existing Vercel Preview:
  `https://hsin-hsin-yuan-portfolio-preview-5s4u5ncf6.vercel.app`
- Recorded deployment ID: `dpl_HDN2GMNaGKxu6HLP91uZQ3vJBgK2`.
- Unauthenticated QA reaches Vercel SSO. This package made no deployment and
  did not change Production. No current platform-metadata readback beyond this
  recorded existing state is claimed.
- No contact submission was made.

## Protected worktree item

The user-owned file
`docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md` remained
untouched and is the sole untracked worktree item.

## Model provenance

Every delegated role requested `gpt-5.6-sol`.

| Role | Requested | Observed | Completed |
| --- | --- | --- | --- |
| Task 1 spec reviewer | `gpt-5.6-sol` | `gpt-5.6-sol` | `gpt-5.6-sol` |
| Media/lifecycle implementer | `gpt-5.6-sol` | `gpt-5.6-sol` | `gpt-5.6-sol` |
| Other delegated runtimes, including browser QA and closeout | `gpt-5.6-sol` | Not independently exposed | Not independently exposed |

Unexposed model IDs are not inferred or labeled. No Claude or Gemini
collaboration request was made in this package.

## Exact next action

The user reviews the local build. A new Vercel Preview, any Production change,
or a merge to local `main` requires explicit later authorization. No local
server is claimed active.
