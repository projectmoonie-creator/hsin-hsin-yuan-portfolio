# Hero Cover Production Release — 2026-08-13

State: `PASS_WITH_OPEN_ITEMS`

## Declared scope and producer decision

The producer accepted the wider working-space Hero and explicitly ruled:

`核准 Production、變更正式網站`

This release replaces the canonical Production site with the reviewed Hero
asset and composition package. It preserves all copy, links, Contact behavior,
media rights boundaries, Featured and Archive interaction, reduced motion,
no-JavaScript output, Figma canonical-data consumption, and the protected
user-owned document.

The decision authorized this Production deployment and canonical alias change.
It did not authorize Git push, `main` integration, Contact submission, force
push, tag rewrite, or destructive Vercel action.

## Release source and review

- Branch: `codex/hero-cover-refresh`.
- Release source commit: `ab570bb1c94090300bb2a9e348d5b27e3988485f`.
- Runtime composition commit: `daa781f`.
- Closed remote baseline: `origin/main` and
  `portfolio-phase-2026-08-12-closed` at
  `4193498208d74c01a4876f7550642c4cc8c7c3b4`.
- The release source remains six commits ahead of `origin/main`.
- Asset replacement review requested/observed/completed `gpt-5.6-sol` at
  `xhigh`: `PASS`, no P0/P1/P2.
- Separate composition review requested/observed/completed `gpt-5.6-sol`:
  `PASS`, no P0/P1/P2. It confirmed full frame coverage and one scale truth
  across animation, static, reduced-motion, no-JS, and Figma output.
- The process retrospective's redacted Gemini review
  requested/observed/completed `gemini-3.6-flash` and returned
  `PASS_WITH_REVISIONS`; its locally adjudicated process changes do not alter
  the released runtime.

## Final release gates

- `npm test`: 179/179 pass.
- Fresh build, Figma export, design-contract audit, and six Featured mobile
  derivative integrity check: pass.
- `npm audit --omit=dev --audit-level=high`: zero vulnerabilities.
- `git diff --check`, tracked-diff, generated-output privacy, and protected-file
  checks: pass.
- The source worktree contains only the protected untracked document.
- The protected document remains byte-identical at SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.

## Isolated Production package

A direct full-worktree deployment was not used. The isolated package contains:

- 57 exact current `dist/` files;
- unchanged `api/contact.js`; and
- one minimal Vercel configuration equivalent to the repository's public
  redirect, clean-URL, and cache-header rules.

The public `dist/` snapshot is 57 files / 96,779,288 bytes with sorted
newline-joined relative path-list SHA-256
`27c6f05298168d82827ce2ff130211dd16ec96174ab77b35aa6c3656a31e30a9`.

The deployable package, excluding local `.vercel` control metadata, is 59 files
/ 96,783,855 bytes with sorted newline-joined relative path-list SHA-256
`a39d6d3a19105ac481688592d1bd0f7546c9fae5730a9f45a70ba302d66d6a40`.
Source and packaged Contact copies both have SHA-256
`2b756da78d79418df890f2cdf2566f6069c90610a179af122e8a51f1be42eb06`.

The package contains no repository source, tests, internal reviews,
environment file, access-bearing Preview URL, or protected document.

## Production identity and rollback

- Previous Production rollback deployment:
  `dpl_7qt7gWyC42yTqStMZtHTKRSpu3vn`.
- New Production deployment:
  `dpl_5h1nsgGwCB5nDqFgkFEDHvYmG4XQ`.
- Direct deployment:
  `https://hsin-hsin-yuan-portfolio-2q7mf0w0w.vercel.app`.
- Canonical alias:
  `https://hsin-hsin-yuan-portfolio.vercel.app`.

Read-back by both deployment ID and canonical alias returned the same new ID,
target `production`, state `READY`, and `api/contact` function in `iad1`.
The release process did not directly fetch the deployed page and did not call
or submit Contact.

## Post-publish PageSpeed observation

- Checked at: 2026-08-13 19:10:59 +08:00.
- Tested URL: `https://hsin-hsin-yuan-portfolio.vercel.app/en/`.
- Report:
  `https://pagespeed.web.dev/analysis/https-hsin-hsin-yuan-portfolio-vercel-app-en/1v3ncv7ojy?form_factor=mobile`.
- CrUX: no field data.
- Mobile scores: Performance 73; Accessibility 100; Best Practices 100;
  SEO 100.
- Metrics: FCP 1.0s; LCP 9.4s; TBT 0ms; CLS 0; Speed Index 4.3s.
- Network transfer: 12,511 KiB.
- Environment: Lighthouse 13.4.1, simulated Moto G Power, slow 4G,
  first navigation, HeadlessChromium 150.0.7871.186.

Compared with the single 2026-08-10 matching mobile-English reference, the
score moved 75 → 73, FCP 0.9s → 1.0s, LCP 6.7s → 9.4s, TBT and CLS stayed at
zero, Speed Index moved 4.1s → 4.3s, and reported transfer moved from about
3,197 KiB to 12,511 KiB. These are two single-run lab observations rather than
a controlled median, so they do not by themselves prove a runtime regression.

Prioritized findings:

1. **Third-party image ownership:** Mirror Media transferred 1,648.7 KiB with
   an estimated 1,643.9 KiB saving; the TaiwanPlus poster transferred
   385.4 KiB with an estimated 352.7 KiB saving. Both remain link-first;
   Mirror Media must not be downloaded, cropped, remade, or rehosted without a
   new rights decision.
2. **First-party/tooling signal:** PageSpeed reported both the 7,254 KiB
   desktop Slow Steps reel and the 2,240 KiB mobile derivative. The already
   closed nine-run matched local diagnosis observed zero dual-source runs and
   therefore made no runtime change. This recurrence is retained as remote lab
   evidence, not silently promoted into a new performance package.
3. **First-party responsive delivery:** local posters account for an estimated
   563.1 KiB image-delivery opportunity. The stylesheet is only 7.2 KiB but is
   also reported as a 170ms render-blocking request. Either improvement would
   require a separately bounded, producer-approved package and must preserve
   approved image quality and interaction.

Decision: accept the Ready Production release. Do not change runtime from this
single PageSpeed result.

## Open item and exact next action

Production is current and recoverable through the previous deployment, but the
release source's six local commits plus this release record are not present on
any `origin` ref. The post-record local count is therefore seven. That
durability gap keeps the overall closeout at `PASS_WITH_OPEN_ITEMS`; it does not
invalidate the live release.

Exact next action: make no further Production change. Remain in maintenance
mode and wait for separate producer authorization before any non-force backup
push, active-branch push, `main` fast-forward/push, tag, new performance
package, Contact action, or protected-file action.

## Post-release correction — Contact is not operational

After the producer asked about the missing own domain and forwarding inbox, a
read-only Vercel Production environment inspection returned
`No Environment Variables found`. The deployed function requires
`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL`; a real form
submission would therefore return the handler's HTTP 503 configuration error.
No Contact request or email was sent during this check.

The original release evidence correctly proved the function was built and
present, but incorrectly stopped short of proving its mail route was configured.
The Hero/site deployment remains `READY`; the portfolio's overall launch status
is corrected to `BLOCKED` until a producer-approved domain/contact-routing
package configures and verifies end-to-end delivery. This addendum supersedes
the earlier overall `PASS_WITH_OPEN_ITEMS` conclusion without rewriting its
historical evidence.
