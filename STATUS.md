# Portfolio Status

Updated: 2026-08-03

State: `IN_PROGRESS`

## Current Work Package

- Package: `Top Gear Featured Preview Reel v1` — visual direction approved;
  written design specification awaiting user confirmation before planning or
  implementation.
- Branch: `codex/top-gear-featured-preview-reel`.
- Base and rollback checkpoint:
  `0e79852f7552af42b25d0e1adc9f746f98828fb6` (also current local `main`).
- Approved direction: approximately 30 seconds, `B · Cross-border story` plus
  `A · Action-led`, with an aircraft shot explicitly included.
- Design specification:
  `docs/superpowers/specs/2026-08-03-top-gear-featured-preview-reel-design.md`.
- The user-supplied source is a 3195.042540-second H.264 1920×1080 BT.709
  episode file. Its basename and SHA-256 are recorded in the design
  specification; its absolute Downloads path remains session-only evidence.
- No reel derivative, canonical work-data change, test change, deployment,
  push, main merge, contact submission, or external message has occurred in
  this package.

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

## Verification

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

The user reviews
`docs/superpowers/specs/2026-08-03-top-gear-featured-preview-reel-design.md`.
After explicit confirmation, invoke the current canonical `writing-plans`
skill, write and commit a test-first implementation plan, then begin source
shot selection and reel implementation. Do not encode or change canonical
work data before that confirmation.

## Cold Resume

1. Read `AGENTS.md`, `PROJECT_BIBLE.md`, this file, and the Top Gear design
   specification.
2. Verify branch `codex/top-gear-featured-preview-reel`, base
   `0e79852f7552af42b25d0e1adc9f746f98828fb6`, and the protected untracked
   file.
3. Confirm whether the written design specification has received explicit
   user approval. If not, remain at the review gate.
4. After approval, use `writing-plans` before implementation and follow the
   design's test, media-evidence, browser-QA, and rollback contracts.
5. Do not deploy, push, change Production, submit Contact, or merge implicitly.
