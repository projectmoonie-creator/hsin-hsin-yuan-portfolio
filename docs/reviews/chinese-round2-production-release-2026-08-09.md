# Chinese Interface Round 2 — Production Release

Date: 2026-08-09 (Asia/Taipei)

State: `RELEASED_PRODUCTION`

## Release Decision

The producer selected option A and explicitly authorized applying P0+P1,
retaining the narrow-mobile Contact heading spacing correction, and publishing
the result as the formal site. Reviewed implementation candidate
`c716849fb8b644ac6b8977887f201a97a148ac7a` contains nine guarded stable-key
changes. English and Chinese remain independent; an empty localized value keeps
its field while omitting its complete rendered element so later content moves
up without a gap.

This package does not introduce light effects, new button styling, media,
links, Contact API behavior, or other UI changes. Those remain a separate
lo-fi-first package after this release.

## Content And Mechanism

- P0 updates the Chinese Hero subcopy and changes the Chinese Contact accent
  from `做出來。` to `說出來。`; both English values are exact keeps.
- P1 updates four Chinese Featured descriptions, promotes Top Gear's shared
  platform into `China Dragon TV` / `東方衛視`, changes one global Press part
  label to `座談`, and changes the Ghost Hand English title to `The Mechanic`.
- The versioned work order records the original workbook SHA-256
  `7776b75a3e261404609f6f34588e177772785338fdbcf54f954de12b69e3106e`
  and corrected workbook SHA-256
  `e11149074243523b0276f5042831796d9c2737f3a80f4fea64603dbeed7bce3a`.
- The guarded importer now resolves global Press rows by exact ID and allows
  shared strings to become bilingual objects only for three explicit
  localizable key shapes. Non-localizable shared scalars fail closed.
- The existing mobile Contact heading contract remains `line-height: 1.02` at
  460px and below. No CSS changed in this release candidate.

## Validation And Review

- Tests: 144/144 passed after staging the complete candidate, including
  privacy checks over every tracked artifact.
- Build, Figma export, design-contract audit, and diff checks: passed.
- Browser QA: 14/14 English/Chinese scenarios passed at 1440×900, 1200×900,
  834×1112, 390×844, and 360×800, plus reduced-motion and no-JavaScript mobile.
  Exact copy, 1.02 mobile heading line height, two separated title lines, six
  Featured works, five Archive works, keyboard focus, zero horizontal overflow,
  zero empty optional nodes, and zero console/page/same-origin failures passed.
- Reduced motion hid reels and requested no MP4 files. No Contact form was
  submitted. Four representative desktop/mobile screenshots were visually
  inspected without clipping, overlap, unintended gaps, or bilingual fallback.
- Gemini requested, observed, and completed `gemini-3.6-flash`; its verdict is
  `PASS` with no findings. The Claude subscription lane stopped correctly at
  `handoff-to-active-session` with no model request or billing fallback. Local
  adjudication is `APPROVE_PRODUCTION`; no dual-review consensus is claimed.
- The reviewed packet SHA-256 is
  `acca559a56aad001d2888d714ba50771914714326b0c28ec9f8df92f2313a780`.
  The committed packet is the same wording with three Markdown hard-break
  spaces normalized and hashes
  `28442b62c052c7fcc9b44280b441203104ddb7d4ac64b087466e163a49ea798f`.

## Durability And Production

- Candidate backup
  `backup/2026-08-09/chinese-round2-production-c716849` was pushed and read back
  exactly at `c716849fb8b644ac6b8977887f201a97a148ac7a`.
- Remote main was first preserved at
  `backup/2026-08-09/pre-chinese-round2-main-d109bbd`, read back exactly at
  `d109bbdede94a00b58ae8b0b7de0d1875dd627e4`.
- `origin/main` then fast-forwarded without force to candidate `c716849`.
- Git-triggered Vercel deployment `dpl_4i1jTqt3Qq9FjchMnMXEGKrEYwkv` reached
  `Ready`, target `production`, and includes the existing `api/contact`
  function. The canonical public alias is
  `https://hsin-hsin-yuan-portfolio.vercel.app`.
- Per the active deployment policy, the deployed page itself was not fetched
  or curled after creation. No Contact POST, email, manual alias mutation,
  destructive Git action, or Preview/share-link replacement occurred.
- This closeout is committed after the implementation deployment. Its
  documentation-only main fast-forward preserves identical public output; the
  exact final docs-inclusive commit, backup ref, and any byte-equivalent Vercel
  deployment are reported externally rather than self-referenced here.

The protected untracked review document remains outside Git and byte-identical
at SHA-256
`945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.

## Next Package

The next bounded package may explore one restrained lighting treatment and/or
one improved button microinteraction. It should begin with a lo-fi visual
choice, preserve the portfolio's documentary tone and content hierarchy, and
include mobile performance, focus visibility, contrast, and reduced-motion
gates before implementation or deployment.
