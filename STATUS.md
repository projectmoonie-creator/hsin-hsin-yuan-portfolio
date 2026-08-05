# Portfolio Status

Updated: 2026-08-06

State: `PASS_WITH_OPEN_ITEMS`

## Current Work Package — Overclocking Static Poster And Mobile Reel Diagnosis

- Branch `codex/overclocking-static-poster` starts from backed-up local `main`
  `58a57511825fb54edd53f7883483abb2bfa8b50e`; implementation commit is
  `7dddff985727840afd796ddccfa6d41a9c4b8b5c`.
- The user-approved local production photo `P1070715.jpg` is now the canonical
  Overclocking poster derivative. The public WebP remains on the stable
  1280×720 path, is 68,144 bytes, and has SHA-256
  `d892d7a8c8375c6097952551b121cfa2ba98c410816b4430b69b1a0e6d38490c`.
  The source basename and SHA are retained as evidence without storing its
  private absolute path; the obsolete video timecode was removed.
- TDD observed the replacement contract fail against the old poster evidence,
  then pass. Full `npm test` passed `79/79`; build, Figma export, design audit,
  manifest integrity, `git diff --check`, and a 390×664 mobile poster-load
  probe passed.
- Three-Minute Micro Drama was diagnosed without changing playback code. At
  mobile size with normal motion preference, the existing 1.4-second hold
  resolves `video.play()` and advances the 10-second muted inline reel. With
  `prefers-reduced-motion: reduce`, the current accessibility contract hides
  the reel and keeps the poster static, so no autoplay request is made.
- The recorded Vercel Preview remains protected by Vercel login for automated
  QA. It was not replaced or redeployed in this package and therefore does not
  contain the new Overclocking poster. `origin/main`, Production, aliases,
  Contact, and the protected untracked file remain untouched.

## Current Integrated Baseline — HeroMedia Closeout Remediation

- Local `main` was fast-forwarded from
  `e2d75f0e57ff0d6f0d64ff5381a04a3314b35481` to reviewed closeout head
  `bba4ea0d32b60121ada26ae1b2dfaf20af4dedc1` on 2026-08-04. This
  documentation-only integration status follow-up is reported externally after
  commit.
- Source branch `codex/hero-media-closeout-remediation` was pushed and read
  back exactly at `bba4ea0d32b60121ada26ae1b2dfaf20af4dedc1` before the local
  merge.
- Remote backup ref `backup/2026-08-04/e2d75f0` was created before remediation
  and read back at the exact pre-remediation commit above.
- Validated implementation head is
  `63e51bf0f93cc8b4da3894dac091dd0ad5e2978b`; the later commits add durable
  handoff, reviewer provenance, and adjudication only.
- The bounded TDD package closes four review findings: fail-closed JPEG APP
  metadata, Figma/live Hero starting-crop parity, responsive focal points during
  motion, and this cold-resume record.
- Focused tests passed `54/54`; the full suite passed `79/79`. Design audit,
  build, Figma export, `git diff --check`, public-Hero integrity, and protected
  file integrity passed. Local browser QA passed English desktop, Chinese
  stacked, and English mobile reduced-motion cases with no Play/video,
  overflow, console, page, or request errors.
- Frozen review packet SHA-256:
  `368e0fe6909791c854f217c80dcdc9499b66b30a3e2a664626ec2ff74ca113fd`.
  Gemini completed `PASS` with no findings on requested/observed/completed
  `gemini-3.6-flash`; local adjudication closes all four original findings as
  `already-fixed`. The raw response's conflicting self-label was rejected in
  favor of the wrapper's machine provenance. Claude remains
  `handoff-to-active-session` with no model request sent, so no dual-review
  consensus is claimed.
- A mobile-ready feature Preview was created from the committed public `dist/`
  generated at local `main` commit
  `e9f09afdd8de220c4c4455dfc4e9a3dccd584164`:
  `https://hsin-hsin-yuan-portfolio-mve5a1pl9.vercel.app`. Vercel deployment
  `dpl_8vwDEtrbrG5vzqreik78rnqMH4Ax` was read back as target `preview`, status
  `Ready`, on 2026-08-05. The upload contained only 33 public build files; repo
  sources, internal review docs, the protected file, and `api/contact.js` were
  not uploaded.
- `origin/main`, aliases, Contact submission, and Production remain untouched.
  The protected untracked review file remains unmodified and outside Git.

## Prior Accepted Work Package — HeroMedia Component And Showreel Retirement

- Reviewed feature branch: `codex/hero-media-component`; package base and full
  rollback point: `fb6517591e34b9cb20d814891c0177cf2ac9ba2c`.
- Local `main` was fast-forwarded to validated behavior head
  `0d110353a9b0133878271f5eebc1ab69bcc9d6cd` on 2026-08-04. This local
  integration has not been pushed; `origin/main` remains
  `382e02a21fbcf6ffef68881b7e497235eaf8a7a8`. The documentation-only status
  commit is reported externally after commit.
- The parity-preserving extraction commit is
  `5539c43373ac6d024d51b8f27c8aa8e1577991b3`; reverting the subsequent
  behavior commit reported externally after commit restores Play/showreel
  while keeping the canonical HeroMedia component.
- Hero is now one validated, localized, non-interactive image component shared
  by the website and authoritative Figma SVG export. The exact approved
  18-second slow push remains; reduced motion is static.
- The active Hero Play/video path, bilingual showreel copy, playback JS/CSS,
  and public website reel MP4/poster are retired. Authoring evidence remains
  recoverable under `showreel/website-visual-reel/` with an explicit note.
- The public 1920×1440 JPEG now has SHA-256
  `756c072edb8f760718d903b8bd5cfc9e53a343efec69bc2821b78e3043f67bac`.
  Removing 5,848 metadata bytes did not change decoded pixels; before/after
  frame MD5 is `374cfe5ba6ee18ea0a402016f8a160aa`.
- Focused suites passed 53/53; full `npm test` passed 78/78. Design audit,
  build, Figma export, diff check, English/Chinese desktop/mobile browser QA,
  reduced-motion, no-JS, console/request checks, and protected-file recheck
  passed.
- Frozen review packet SHA-256:
  `fed9a94679092b2f5f0f0c13640d02574d21c186cbfd81591290c6330188e959`.
  Gemini completed `PASS` with no findings on `gemini-3.6-flash`; Claude is
  honestly `incomplete` at subscription-session handoff, so no dual-review
  consensus is claimed.
- Vercel Preview, aliases, Contact, and Production are untouched. The protected
  untracked review file remains unmodified and outside Git.

## Prior HeroMedia Open Item

Submit the same frozen packet to the active Claude subscription lane when it is
available. The usable Gemini lane plus local gates close this producer-gated
feature package; the missing lane remains a recorded review follow-up.

## 2026-08-04 Process Diet Finalized

- `PROJECT_BIBLE.md` and `AGENTS.md` amended per
  `docs/reviews/2026-08-04-process-diet-proposal.md` (v2, Codex-audited);
  Bible stays at 165 lines; `npm test` 61/61; `git diff --check` clean.
- Backup refs read back verbatim: `backup/main-2026-08-04`,
  `backup/2026-08-04/f13a70c`, `backup/2026-08-04/d04e7f1`.
- `origin/main`, merges, Preview, and Production unchanged; those still
  require separate explicit producer authorization.

## Prior Work Package — Portfolio Studio A0

- Package: repo-backed Archive media manifest + dry-run planner, carried
  end-to-end by the approved Three-Minute Micro Drama reel and poster.
- Branch: `codex/portfolio-studio-a0`; baseline and rollback checkpoint:
  `382e02a21fbcf6ffef68881b7e497235eaf8a7a8`.
- Validated implementation head and pushed remote readback:
  `9fb0f2c929ad497100baba11cade6fd618d3ac08`.
- Coherent commits: `d82c0ba` manifest foundation, `c0b33d5` dry-run planner,
  and `9fb0f2c` Three-Minute steel-thread integration. The documentation-only
  closeout commit is reported externally after commit.
- The exact 10-second silent H.264 1280×720 reel and 1280×720 WebP poster are
  protected by size, SHA-256, profile, owner, and content-link checks. Source
  masters and absolute source paths remain outside Git.
- `npm test` 71/71, design audit, build, Figma export, diff check, full decode,
  manifest verification, and desktop/mobile browser QA passed.
- Frozen review packet SHA-256:
  `2e1780988bc43b0972ff1fc82e57fc2012cfdb50af2a4a78187b0f0fc6bec88b`.
  Gemini completed `PASS` with no findings on `gemini-3.6-flash`; Claude is
  honestly `incomplete` at subscription-session handoff, so no dual-review
  consensus is claimed.
- `origin/main`, Vercel Preview, aliases, Contact, and Production are untouched.
  The protected untracked review file remains unmodified and outside Git.

## A0 Open Item

Submit the same frozen packet to the active Claude subscription lane when it is
available. Under the Work Charter, the usable Gemini lane plus local gates may
close this producer-gated feature package, but the missing lane must be recorded
and later supplemented without regenerating the packet.

## Prior Accepted Work Package — Top Gear

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

## Prior Top Gear Verification

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

## Prior Top Gear Open Risks

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

This historical section is superseded by the current A0 baseline and retained
only as prior verification evidence.

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

Review the new Overclocking poster locally on `/en/` and `/zh/`, then decide
whether to keep the current reduced-motion static fallback (recommended) or
request a separate accessible manual-play affordance. If the poster is
accepted, explicitly authorize local-main integration and/or a new Preview.
Do not push `origin/main`; Production remains separate and requires another
explicit instruction.

## Cold Resume

1. Read `AGENTS.md`, `PROJECT_BIBLE.md`, this file, and the HeroMedia design
   contract.
2. Verify `codex/overclocking-static-poster` at `7dddff9` from local `main`
   `58a5751`, then verify `origin/main`, backup ref
   `backup/2026-08-05/58a5751`, and the protected untracked file.
3. Confirm the local bilingual Overclocking poster decision and ask whether the
   existing reduced-motion static fallback should remain unchanged.
4. Treat Preview deployment `dpl_8vwDEtrbrG5vzqreik78rnqMH4Ax` as the prior
   build until a new Preview is explicitly authorized.
5. Do not deploy Production, submit Contact, push `main`, or merge locally
   without explicit producer authorization.
