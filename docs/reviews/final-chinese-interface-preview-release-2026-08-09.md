# Final Chinese Interface — Preview Release

Date: 2026-08-09

State: `READY_PRODUCER_INSPECTION`

Frozen source: `0ad90f2a2e6e244f986ae52e05ad657f6d605cd5`

## Release decision

The producer approved publishing the final Chinese workbook update. This
package is intentionally stopped at a public-share Preview because the active
portfolio release contract requires inspection of an actual Preview before
Production replacement. No `main`, Production, alias, or Contact action is
authorized by this record.

The final work order contains 54 stable-key entries and preserves 54 exact
English keeps. Chinese has 50 replacements and four approved exact-empty
values. All 108 final locale postconditions match canonical source. Exact-empty
fields remain available for later refill while their complete localized DOM
elements are omitted, allowing following content to move upward naturally.

## Validation evidence

- Full tests: 139/139.
- Build, Figma export, design-contract audit, and diff check: pass.
- Built English HTML is byte-identical to the pre-copy baseline at SHA-256
  `84e7933a7c41fa5a867c0f6fd8423dbd57e1afeb41576eb97280ea74e548d7b3`.
- Native Chromium: 16/16 cases across both locales, five viewport sizes,
  reduced motion, no JavaScript, keyboard focus, and real mobile reel playback.
- Matrix result: HTTP 200, zero overflow, zero empty rendered copy elements,
  zero console/page/same-origin failures, and zero Contact POSTs.
- Visual inspection confirmed one-line Chinese Hero name and both localized
  official-page cards collapsing without a blank title gap.

Local adjudication is `APPROVE_PREVIEW` with no P0/P1/P2 findings. Gemini
review is incomplete because approval to export the internal packet was denied
before execution; Claude is an incomplete active-session handoff. No external
model, cost, review result, or cross-model consensus is claimed.

## Public package and Preview

The fresh dist-only staging package contains exactly 42 public files /
80,018,591 bytes. Its sorted path-list SHA-256 is
`bc6f8e208fd2ed414bd75212bc156c98cffe397d76374b49ea45a05e3b30f143`.
It excludes repository source, tests, internal documents, environments,
`api/contact.js`, and the protected untracked review.

Vercel CLI 58.9.0 created deployment
`dpl_H2i7G3DdyWeqSfFLFLEubq6Rx9r2`. Independent CLI inspection read back:

- status: `Ready`;
- target: `preview`;
- URL: `https://hsin-hsin-yuan-portfolio-lujpvjbpo.vercel.app`;
- build: static root from the 42 uploaded deployment files.

Per the active deployment skill, the deployed URL was not fetched or curled
after creation. No online form or Contact endpoint was invoked.

## Shareable access and durability

The Vercel Share dialog initially showed access-only protection. The producer's
public-release authorization covered replacing the Hobby account's one prior
shareable link. After the explicit Vercel warning, confirmation succeeded and
the authoritative dialog changed to `Anyone with the link can view and
comment`; Vercel also confirmed that a new shareable link was generated and
copied. The old Hobby shareable link is revoked. The access-bearing clipboard
value was not readable by the automation surface and was not persisted in Git.

The source is recoverable at
`backup/2026-08-09/final-chinese-portfolio-0ad90f2`, read back exactly at the
frozen source commit. The protected untracked file remains outside Git and
byte-identical at SHA-256
`945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.

The next decision is producer inspection of this Preview. A separate explicit
approval is required before fast-forwarding `main` or allowing the canonical
Production deployment to change.
