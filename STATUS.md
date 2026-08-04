# Portfolio Status

Updated: 2026-08-04

State: `PASS_WITH_OPEN_ITEMS`

## 2026-08-04 Process Diet Finalized

- `PROJECT_BIBLE.md` and `AGENTS.md` amended per
  `docs/reviews/2026-08-04-process-diet-proposal.md` (v2, Codex-audited);
  Bible stays at 165 lines; `npm test` 61/61; `git diff --check` clean.
- Backup refs read back verbatim: `backup/main-2026-08-04`,
  `backup/2026-08-04/f13a70c`, `backup/2026-08-04/d04e7f1`.
- `origin/main`, merges, Preview, and Production unchanged; those still
  require separate explicit producer authorization.

## Current Work Package

- Package: `Top Gear Featured Preview Reel v1` — implemented and reviewed
  locally with deterministic, media, bilingual browser, fallback, privacy, and
  repository-hygiene evidence complete.
- Branch: `codex/top-gear-featured-preview-reel`.
- Base and rollback checkpoint:
  `0e79852f7552af42b25d0e1adc9f746f98828fb6` (also current local `main`).
- Validated implementation head:
  `c4c284707edd1f6560081ef9df3b56b0ba5f9bc5`.
- Closeout record:
  `docs/reviews/top-gear-featured-preview-reel-v1-2026-08-03.md`.
- Design, plan, contract, draft, refined-cut, and exact-evidence commits are
  `cfea3cdd1ceec22dcb892077282ad3c3082d0e24`,
  `9d1da19a042d2ff8031735da8f6296e5c583add5`,
  `17f40857bbfb6c02c790d1b0a2fc2377f56d5b89`,
  `8c3b66aa5806a34866cd616aa915b238a70c0a9a`,
  `36305c8d86c4d3541358798491a2c0a1eaeaa903`, and
  `c4c284707edd1f6560081ef9df3b56b0ba5f9bc5` respectively.
- Initial documentation-only closeout commit:
  `e5a34db485a36952a5f83334e75092a14bee22d0`.
- The subsequent browser-evidence clarification commit is reported externally
  after commit and intentionally is not self-referenced in committed files.
- Approved direction: approximately 30 seconds, `B · Cross-border story` plus
  `A · Action-led`, with an aircraft shot explicitly included.
- Design specification:
  `docs/superpowers/specs/2026-08-03-top-gear-featured-preview-reel-design.md`.
- Implementation plan:
  `docs/superpowers/plans/2026-08-03-top-gear-featured-preview-reel.md`.
- The exact public derivative is 8,651,457 bytes, 29.960000 seconds, one
  silent H.264 1280×720 yuv420p BT.709 stream, SHA-256
  `4d57e75a81e2ebf0e398a08b57c8e99ddcb0973bc1562db8036221b9a014db72`;
  faststart and full decode passed.
- The user-supplied source remains outside the repository. Its approved
  basename, `3195.042540`-second duration, 1920×1080 dimensions, and SHA-256
  are recorded without its absolute path.
- The local preview served exactly ignored `dist/` on port `4873` during QA.
  It was stopped after evidence capture; no listener remains and
  `http://127.0.0.1:4873/en/` and `/zh/` are inactive. This was not a
  deployment.
- No Vercel Preview or Production deployment, push, main merge, Contact
  submission, external message, or source-file move/deletion occurred.

## Current Package Verification

- `npm test`: `61/61` passed; Featured lifecycle: `6/6` passed.
- Design audit passed with `6` Featured, `5` Archive, `2` global Press, and
  `3` Work Press entries. Build, Figma export, exact generated markup, Figma
  diff, media manifest, faststart, stream probe, and full decode passed.
- All four current Figma hashes remained exact and unchanged; the closeout
  record contains the fingerprints.
- Session-only connected-browser QA covered `10/10` English/Chinese cases at
  1440×900, 1200×900, 834×1112, 390×844, and 360×800. It observed poster-first,
  one-second hold, actual playing, last-eligible ownership, exact
  wrapper/source, no overflow, no extra title overlay, and approved responsive
  geometry in-session; its per-case tool output was not durably retained.
- The session-only adapted six-reel harness returned `PASS`. Its ten-row matrix
  recorded structural, geometry, destination, network/error, and Contact
  predicates in its session-only `/private/tmp` packet, not per-case temporal
  lifecycle evidence.
- A dedicated English 1440×900 interaction run measured the poster at
  `1018.4` ms and actual playing at `1434.6` ms, plus exit/reset/re-entry,
  natural last-eligible arbitration, media error, BFCache, and controlled
  visibility. Separate reduced-motion and no-JavaScript checks ran at 1200×900;
  keyboard ownership ran at 1440×900. Their local page/console/request/HTTP
  error ledgers were empty.
- The aircraft exterior and cockpit exchange were visibly captured in-session
  at reel times `22.44` and `24.61` seconds.
- Browser evidence recorded zero `/api/contact` POSTs and zero submit events.
  The protected untracked file retained SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.

## Current Package Open Risks

- The Top Gear-specific adapted harness, JSON results, and screenshots existed
  only under `/private/tmp/top-gear-browser-qa.9Ab009`; they are not durably
  retained in Git or another recorded backup. A future audit must adapt and
  rerun the durable preceding harness under
  `docs/reviews/evidence/featured-preview-reels-browser-qa-r2/`.
- Matched pre-package browser comparison remains unavailable because the
  recorded historical Vercel Preview redirects unauthenticated QA through
  Vercel SSO. No matched portfolio DOM, screenshot, geometry/crop comparison,
  or pixel statistic is claimed. This is inherited external-state evidence,
  not a local product defect; unchanged Figma hashes support but do not replace
  the unavailable comparison.

The branch remains local and unpushed by explicit scope. The next user decision
is whether to accept the retained feature branch and separately authorize any
push, deployment, or merge.

## Prior Accepted Work Package

- Package: `Featured Preview Reels and Implicit Press v1` — locally complete
  with one external comparison open item.
- Branch: `codex/featured-preview-reels-implicit-press`
- Base and rollback checkpoint:
  `be5ff4fe3d828a85c955764dedf9e0ce1200e0f6`
- Validated implementation head:
  `f264f471e7c69acc2a2573e4d18fc2145c3ef5bd`
- Closeout record:
  `docs/reviews/featured-preview-reels-and-implicit-press-v1-2026-08-03.md`
- Initial closeout commit, which first added the dated report:
  `8a52d8506ee155b0450508430583416e08cb008b`; its parent is the validated
  implementation head `f264f471e7c69acc2a2573e4d18fc2145c3ef5bd`.
- The subsequent evidence-hardening commit adds the tracked sanitized QA
  package and corrected closeout wording. Its exact SHA is reported externally
  after commit and is not self-referenced in committed files.
- Durable QA evidence:
  `docs/reviews/evidence/featured-preview-reels-browser-qa-r2/README.md` and
  `results-summary.json`; reproduction harness/commands and a manifest are in
  the same directory.
- Exact encoding recipe and source/output ledger:
  `showreel/featured-preview-reels/README.md`.
- This branch has no configured upstream and no local remote-tracking ref. No
  push or remote metadata readback was performed for this package.
- Every delegated role requested `gpt-5.6-sol`. Task 1 spec review and the
  media/lifecycle implementation explicitly exposed requested/observed/
  completed `gpt-5.6-sol`; other delegated runtimes did not expose independent
  IDs, so none are inferred. No Claude or Gemini collaboration request was
  made in this package.

Three complete silent optimized reels now cover Slow Steps, Tech Dreamers, and
My Art, My Voice. All five Featured reels use canonical `after-hold` behavior:
35% eligibility, last eligible DOM reel, 1.4-second poster hold until `playing`,
and safe reset/generation/visibility/error/BFCache handling. Existing posters
and destinations remain canonical; Slow Steps remains unlinked. Work Press no
longer renders the redundant visible group heading, while its localized
semantic group and visible per-card types remain. Global Press is unchanged.
Current design/Figma rules are aligned and Figma output is unchanged.

## Prior Package Verification

- `npm test`: `61/61` passed; Featured runtime lifecycle `6/6` passed.
- Focused contract, media, renderer, audit, and Figma checks passed.
- `npm run audit:design-contract`, `npm run build`,
  `npm run figma:export`, `git diff --check`, and privacy checks passed.
- The three complete public timelines passed exact byte/hash/duration,
  H.264 1280×720 yuv420p BT.709, video-only, faststart, and full-decode checks.
- All four current Figma fingerprints remained exact and unchanged.
- Local browser QA passed `10/10` English/Chinese viewport cases with no
  overflow or local errors. Real hold/playing/reset/re-entry and natural
  two-reel arbitration passed; synthetic media-error/BFCache, controlled
  visibility, reduced motion, no JavaScript, keyboard, semantic, and
  contact-without-submit checks also passed.
- The browser request ledger contains zero `/api/contact` POSTs. No deployment
  command ran, and the identified local port was stopped. The tracked worktree
  returned to protected-file-only status: no tracked or staged changes
  remained; ignored `dist/` may exist.
- r2 evidence manifest: `98/98`, SHA-256
  `418ece08fd3b13ec2a2f8f8d5e20794f82fc1fdcf9333f9a070d108394d6d1d6`.
- No baseline pixel-diff claim is made.

## Sole Open Item

> Matched pre-package browser comparison remains unavailable because the recorded historical Vercel Preview redirects unauthenticated QA contexts through Vercel SSO to the login page; no portfolio DOM, matched Featured screenshots, geometry/crop comparison, or pixel statistics could be obtained.

This does not indicate a local product defect. Unchanged Figma hashes are
supporting evidence, not a substitute for the unavailable comparison.

## Existing External State

- Latest existing Vercel Preview:
  `https://hsin-hsin-yuan-portfolio-preview-5s4u5ncf6.vercel.app`
- Recorded deployment ID: `dpl_HDN2GMNaGKxu6HLP91uZQ3vJBgK2`.
- Unauthenticated QA sees Vercel SSO. This package made no deployment and
  claims no current platform-metadata readback beyond the recorded state.
- Production is unchanged. The contact form was not submitted and no email was
  sent.

## Accepted Prior History

- Portfolio Design Contract Governance v1 is accepted on local `main` at
  `8f4e19063f5e6bcfbd3a47b9840ee36518dfdb4e`; its source branch is retained.
- The governance package's existing Preview metadata above is unchanged.
- Original production website/domain remains unchanged.
- Transitional renderer aliases may be removed only in a later bounded package
  that reproduces the normalized public contract and frozen output.
- The hardcoded Figma plugin remains a marked legacy experiment;
  `npm run figma:export` is the current design-handoff path.
- Top Gear's `0.81` remains CV-sourced; its other recorded audience context is
  publicly corroborated in the preceding annotated-content review.
- Preview mail configuration remains a separate authorized task.

## Closed Baseline

- Closed baseline tag: `portfolio-phase-2026-07-29-closed`
- Annotated tag object: `68d99c13341f27ad388a8c9bc06df22b3d38bcf2`
- Peeled commit: `7e6200106fe9feb10331e6558981b0314de00597`
- The current branch preserves this baseline and all later approved work.

## Protected Worktree Item

The sole untracked file remains user-owned and untouched:

`docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md`

## Exact Next Action

Review and accept the retained local branch
`codex/top-gear-featured-preview-reel` at its externally reported closeout
commit. Any push, deployment, or merge requires a separate explicit user
instruction.

## Cold Resume

1. Read `AGENTS.md`, `PROJECT_BIBLE.md`, this file, and the Top Gear design
   specification.
2. Verify branch `codex/top-gear-featured-preview-reel`, validated
   implementation head `c4c284707edd1f6560081ef9df3b56b0ba5f9bc5`, the
   externally reported closeout commit, and the protected untracked file.
3. Read the dated Top Gear closeout record for exact media and browser
   evidence; the port `4873` preview is stopped and inactive.
4. Ask whether the user accepts the retained local package and wants a
   separately authorized push, deployment, or merge.
5. Do not deploy, push, change Production, submit Contact, or merge implicitly.
