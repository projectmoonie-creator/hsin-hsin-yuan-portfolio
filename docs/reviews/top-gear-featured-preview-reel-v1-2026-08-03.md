# Top Gear Featured Preview Reel v1 Closeout

Date: 2026-08-03

Status: `PASS_WITH_OPEN_ITEMS`

## Review Boundary

- Branch: `codex/top-gear-featured-preview-reel`.
- Base and rollback checkpoint:
  `0e79852f7552af42b25d0e1adc9f746f98828fb6`.
- Validated implementation head:
  `c4c284707edd1f6560081ef9df3b56b0ba5f9bc5`.
- Design commit: `cfea3cdd1ceec22dcb892077282ad3c3082d0e24`.
- Plan commit: `9d1da19a042d2ff8031735da8f6296e5c583add5`.
- Canonical-contract commit:
  `17f40857bbfb6c02c790d1b0a2fc2377f56d5b89`.
- Draft-media commit: `8c3b66aa5806a34866cd616aa915b238a70c0a9a`.
- Refined-cuts commit: `36305c8d86c4d3541358798491a2c0a1eaeaa903`.
- Exact-media-evidence commit:
  `c4c284707edd1f6560081ef9df3b56b0ba5f9bc5`.
- Initial documentation-only closeout commit:
  `e5a34db485a36952a5f83334e75092a14bee22d0`.
- The subsequent browser-evidence clarification commit is reported externally
  after commit; it is intentionally not self-referenced in committed files.

This closeout reviews the approved local Top Gear derivative, its one-record
website integration, deterministic evidence, and English/Chinese browser
behavior. It does not authorize or claim a deployment, push, merge, Contact
submission, external message, or change to unrelated content or layout.

## Source And Edit Evidence

- Approved source basename:
  `巅峰拍挡第2季第5期20151116 巅峰拍挡之开着自行火炮闯英国 Top Gear China II EP.5东方卫视官方超清.mp4`.
- Source SHA-256:
  `4ba65130c3c172ffff40851ee83e05db494be261b1e50527576f5b9fcda2c955`.
- Source duration: `3195.042540` seconds; dimensions: `1920×1080`.
- Source video: H.264, yuv420p, BT.709; source audio: AAC.
- Rights status: `user-supplied-local-source`.
- No absolute source path is recorded in the repository or public output.

The final hard-cut ledger, in editorial order, is `52–55.5`, `221.5–225`,
`576–580`, `957.60–960.60`, `1678–1682`, `2014–2018`,
`2399.28–2403.28`, and `2035–2039` seconds. These eight ranges total 30
seconds before frame-boundary output tolerance and cover London/hosts,
microcar reveal, London driving, architecture, the estate exchange,
sports-car action, aircraft exterior plus cockpit exchange, and a road-action
loop close. The fourth and seventh selections are the corrected ranges that
remove brief embedded source-shot flashes.

## Exact Public Output

- URL: `/assets/showreel/top-gear-china-uk-special-card-reel.mp4`.
- Size: `8,651,457` bytes.
- SHA-256:
  `4d57e75a81e2ebf0e398a08b57c8e99ddcb0973bc1562db8036221b9a014db72`.
- Duration: `29.960000` seconds; `749` frames at `25/1` fps.
- One H.264 High video stream, `1280×720`, yuv420p, progressive, BT.709
  space/transfer/primaries; no audio or other streams.
- `moov` precedes `mdat`; the full video-stream decode exited `0` with no
  errors.

The canonical poster remains
`/assets/portfolio/top-gear-uk-special-car.jpg`, and the linked wrapper remains
`https://youtu.be/M_eXe9HRD9Y?si=YZ_3JZ7FJY4vVcZv`.

## Deterministic Verification

- `npm test`: `61/61` passed, including Featured lifecycle `6/6`.
- `npm run audit:design-contract`: passed with `6` Featured works, `5`
  Archive entries, `2` global Press entries, and `3` Work Press entries.
- `npm run build` and `npm run figma:export`: passed.
- English and Chinese generated HTML each contain exactly the Top Gear local
  source with the canonical poster, muted/looped/inline/preload-none video,
  pointer-transparent non-focusable ownership, and the unchanged YouTube
  wrapper. No source evidence or absolute path is emitted and no new site
  title overlay exists.
- Exact Figma fingerprints remained unchanged and `git diff -- figma-export`
  was empty:
  - `01-desktop-home.svg`:
    `818a95fd1b41f5d84ac30842887f564c2f83d60ba3b7769255a3e0789373647e`
  - `02-desktop-works-logos.svg`:
    `8368e496d283f47a2fd73742f24dc46512275e251be6caf500c448a623a8a03f`
  - `03-mobile-home.svg`:
    `43ecb8b502fe606505a5fa4a590a03d0b3da8091377acd9146bf8e65e8564e06`
  - `README.md`:
    `1a91858e1c323a7e76e7e1015b05cbc50f8005658628cf686ea4c4284668f625`
- Task 5's final `node --test tests/build-site.test.mjs` rerun passed `34/34`.
  `git diff --check`, the targeted private-path search, protected-file
  checksum, authorized-path status audit, and post-preview listener check also
  passed immediately before commit.

## Browser Verification

Port `4873` had no listener before QA. The managed local command served
exactly the current worktree's ignored `dist/` directory. Before browser use,
both `/en/` and `/zh/` contained the Top Gear MP4 path; its served GET returned
HTTP `200`, `8,651,457` bytes, and the exact public-output checksum.

The session-only connected-browser responsive sweep covered all `10/10`
language/viewport cases:

| Language | Viewport | Result |
| --- | --- | --- |
| English | 1440×900 | PASS |
| English | 1200×900 | PASS |
| English | 834×1112 | PASS |
| English | 390×844 | PASS |
| English | 360×800 | PASS |
| Chinese | 1440×900 | PASS |
| Chinese | 1200×900 | PASS |
| Chinese | 834×1112 | PASS |
| Chinese | 390×844 | PASS |
| Chinese | 360×800 | PASS |

The connected-browser session observed poster-first state, the one-second
poster hold, actual playing, and last-eligible ownership in each of those ten
cases. It also observed the exact source/destination, matching wrapper/video
rects, centered object position, no horizontal overflow, and zero added title
overlays. Desktop retained the approved `fill-card` variant at 1440, 1200,
and 834 pixels; the 390- and 360-pixel media measured approximately `1.7778`,
satisfying the mobile 16:9 contract. These per-case temporal observations were
session-only browser-tool output and are not presented as durable per-case
evidence.

The separate session-only adapted harness ran against the isolated server with
Python `3.9.6`, Playwright `1.60.0`, and Chromium `148.0.7778.96`. It returned
`PASS`. Its ten-row English/Chinese matrix recorded HTTP/navigation state,
exact six-reel poster/media ownership, Top Gear geometry and destination,
responsive overflow and title-overlay predicates, localized Press structure,
Contact structure, request/error predicates, and zero Contact POSTs. That
matrix did not run or retain the complete temporal lifecycle independently in
each viewport.

The full temporal lifecycle was a dedicated English 1440×900 Top Gear
interaction run. It measured:

- poster retained at `1018.4` ms from eligibility, paused at time `0` with
  opacity `0`;
- actual `playing` at `1434.6` ms from eligibility, advancing by `0.608921`
  seconds during the following observation;
- exit reset to paused/time `0`/poster, followed by a fresh re-entry hold and
  a new playing activation;
- a natural arbitration scan with indexes `1`, `2`, and `5` eligible at scroll
  Y `5697`, where only the last DOM reel, Top Gear index `5`, played;
- synthetic media-error, persisted BFCache, and controlled visibility reset
  and replay behavior.

Separate English fallback/ownership checks ran at their recorded viewports:

- reduced motion at 1200×900 showed six static posters with hidden paused
  videos;
- no-JavaScript at 1200×900 showed six static posters and keyboard navigation
  to `#works` without a second document request;
- keyboard QA at 1440×900 focused the existing Top Gear `<a>` wrapper with the
  exact destination and existing 2 px acid outline; videos remained
  non-focusable, control-free, and pointer-transparent;
- a connected-browser Enter activation opened the canonical short URL's
  YouTube watch resolution while focus remained on the original linked
  wrapper. This activation observation was also session-only.

The adapted harness, JSON results, and screenshots existed only in the
ephemeral session directory `/private/tmp/top-gear-browser-qa.9Ab009`; they
were not committed or durably backed up. The durable base workflow is the
preceding package's
[`qa_harness.py`](./evidence/featured-preview-reels-browser-qa-r2/qa_harness.py)
and its surrounding evidence package. A future Top Gear audit must copy and
adapt that canonical base for the six-reel contract, then rerun it against a
fresh build.

The live loop visibly showed the aircraft exterior at reel time `22.44`
seconds and the cockpit exchange at `24.61` seconds. These screenshots were
session-only visual evidence and were not added to the repository.

The session-only harness recorded `118` matrix requests and zero Contact POSTs.
Its local console-warning/error, page-error, request-failure, and HTTP-error
arrays were empty. The persistent Chrome control surface separately emitted
message-channel closure messages from its browser extension; those were
tooling noise and did not reproduce in the page-level Chromium event ledger.
No form was submitted.

The preview was stopped only after this evidence was recorded. No listener
remained on port `4873`; `http://127.0.0.1:4873/en/` and `/zh/` are inactive.
This was a local preview, not a deployment.

## Privacy, Scope, And Repository Hygiene

- Targeted privacy search found no committed Downloads path or absolute source
  location in the package.
- The protected user-owned untracked file remained untouched and unstaged:
  `docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md`.
- Its SHA-256 remained
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.
- Final closeout changes are restricted to this review, the design status,
  and `STATUS.md`; ignored `dist/` and disposable `/private/tmp` evidence are
  not tracked.
- No product code, content, media, tests, Figma artifact, CSS, JavaScript, or
  layout changed during Task 5.
- No Vercel Preview or Production deployment, push, main merge, Contact
  submission, external message, or source-file move/deletion occurred.

## Rollback And Open Items

Rollback remains
`0e79852f7552af42b25d0e1adc9f746f98828fb6`; removing the Top Gear canonical
reel fields and derivative restores its earlier static-poster behavior.

Two evidence-retention open risks remain; neither indicates incomplete product
behavior:

- The Top Gear-specific adapted harness, JSON results, and screenshots are
  session-only and are not durably retained in Git or another recorded backup.
  A future audit must adapt and rerun the durable preceding harness before it
  can reproduce or independently inspect the Top Gear-specific browser packet.
- The recorded historical Vercel Preview redirects unauthenticated QA through
  Vercel SSO, so no matched pre-package portfolio DOM, screenshot,
  geometry/crop comparison, or pixel statistics are available. This closeout
  makes no baseline pixel-diff claim. Unchanged Figma fingerprints and the
  approved responsive geometry are supporting local evidence, not a substitute
  for that unavailable comparison.

The branch remains local and unpushed by explicit scope. The next user decision
is whether to review and accept this retained feature branch, then separately
authorize any push, deployment, or merge.

## Model Provenance

The delegated Task 5 runtime requested `gpt-5.6-sol`. This runtime did not
expose an independent observed or completed model ID, so none is inferred.
