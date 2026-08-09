# Mobile Featured Reel Trigger — Preview Release

Date: 2026-08-09

State: `READY_PREVIEW`

## Release Decision

The producer explicitly authorized a new online Preview after reviewing the
local mobile trigger package. Source commit
`3a5bf52fe38d6f9a4558b3b074b46d39183504c6` changes Featured reel behavior at
`820px` and below only: the 35%-eligible reel nearest the viewport center owns
playback after a 700ms poster hold. Desktop remains last-DOM / 1400ms, Archive
remains nearest-center / 1400ms, and reduced-motion plus no-JavaScript remain
static.

This authorization did not include `main`, Production, an alias, Contact, or a
replacement shareable link. None of those actions occurred.

## Validation And Package Evidence

- Fresh gates passed before packaging: `git diff --check`, full `npm test`
  132/132, `npm run build`, and `npm run audit:design-contract`.
- Prior native Chromium validation covers English and Chinese mobile at
  390×844 and 360×800, desktop at 1440×900 and 1200×900, tablet at 834×1112,
  reduced motion, no JavaScript, keyboard order, overflow, real playback, and
  scroll handoff.
- A fresh dist-only staging directory contained exactly 42 public files /
  80,019,103 bytes. Its sorted public path-list SHA-256 is
  `0f377720c89e087b1898e84045b34fdc4f4b1a0243ce622a028556de6f351c05`.
  Repo source, internal docs, tests, environments, `api/contact.js`, and the
  protected document were excluded.
- The package scan found no environment/private-key file, local absolute user
  path, or common API/token marker. Built `main.js` contains the reviewed
  `FEATURED_REEL_MOBILE_HOLD_MS = 700` and shared
  `selectClosestVisibleReel` path.
- Vercel CLI 58.9.0 rejects the former `--dry-run` option as unknown; that
  rejected command uploaded nothing. The same file-level privacy and manifest
  checks were therefore used as the fail-closed pre-deployment gate.

## Preview Evidence

- Deployment `dpl_BJ35n23AjLaDfevrDpmEJy6R1Xia` is `Ready`, target `preview`:
  `https://hsin-hsin-yuan-portfolio-bj2vc0fqq.vercel.app`.
- Vercel retrieved the expected 42 deployment files and reported a static root
  build. The dist-only package contains no Contact serverless function.
- CLI `inspect --wait` independently read back the exact deployment ID, URL,
  target `preview`, and `Ready` state.
- Per the active deployment skill, the deployed URL was not fetched or curled
  after creation. Online rendering and playback are therefore awaiting the
  producer's logged-in manual Preview inspection; no Contact request was sent.

## Review And Durability Boundary

External AI review was skipped for this narrow, reversible interaction
regression under the portfolio closeout policy: four RED→GREEN checkpoints,
132 deterministic tests, and the bilingual browser matrix already exercise the
changed behavior. The parent workspace's required `docs/TOOLING.md` reviewer
source was also absent, so no reviewer model request was sent and no external
review claim is made.

The source remains recoverable at dated backups
`backup/2026-08-09/mobile-featured-reel-trigger-local-b103409` and
`backup/2026-08-09/mobile-featured-reel-trigger-final-3a5bf52`. A final
Preview-record backup is pushed and read back after this report commits; its
exact ref is reported externally rather than self-referenced here.

The protected untracked document remains outside Git and byte-identical at
SHA-256
`945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.
