# Portfolio Status

Updated: 2026-08-06

State: `PASS_WITH_OPEN_ITEMS`

## Current Editorial Artifact — Chinese-copy Workbook

- The producer-edited workbook at
  `../outputs/hsin-hsin-yuan-zh-copy-2026-08-06/Hsin-Hsin-Yuan-Portfolio-Chinese-Copy-2026-08-06.xlsx`
  has been rebuilt on the current bilingual schema and verified at SHA-256
  `1d0210cf39a688e417c67edb3b0c2d3ccf9201c3485c055c2d6a541ed6ac9600`.
  It contains 169 stable fields: all 168 prior editable rows were preserved by
  stable key and the missing
  `archive.three-minute-micro-drama.watchLabel` row was added with
  `Watch the full series` / `觀看完整系列`.
- The exact pre-merge user-edited workbook is recoverable at
  `../outputs/hsin-hsin-yuan-zh-copy-2026-08-06/backups/Hsin-Hsin-Yuan-Portfolio-Chinese-Copy-2026-08-06.pre-schema-merge-user-edits.xlsx`,
  SHA-256
  `21b11eb53641987a33824fd4783fb5a8f245d30cd32a16ca3f3d67384693a73c`.
- Round-trip verification found no missing, duplicate, or stale mapped keys and
  no formula errors. All seven sheets passed rendered visual inspection. The
  workbook now contains 65 effective Chinese-copy differences; two preserved
  user values equal the latest canonical website text and therefore no longer
  count as differences.
- This is an editorial artifact only. None of the 65 revisions has been applied
  to website source, Figma output, Preview, Production, or `main`. Independent
  AI review was skipped because the package only merges an offline workbook
  schema without changing public output or project rules.
- Next action: create a separate guarded Excel-to-repo dry-run package, review
  the proposed 65 stable-key changes and bilingual layout effects, then apply
  only producer-approved copy. Do not auto-import the workbook. Lighting stays
  later, after bilingual content and geometry approval.

## Current Local Work Package — Three-Minute Full-Series Link

- Branch `codex/three-minute-watch-link` starts from local `main`
  `8b183320b7e96cdf065ef8d727e2049224eba097`. The exact pre-change state is
  preserved and read back at remote backup
  `backup/2026-08-06/pre-three-minute-watch-link-8b18332`.
- The Three-Minute Micro Drama Series Archive card now uses the existing
  repo-configured `watchUrl` / `watchLabel` contract to open the producer-
  supplied public playlist
  `https://www.youtube.com/playlist?list=PLDTnN3czXyG8`. Its localized actions
  are exactly `Watch the full series` and `觀看完整系列`; no renderer, CSS,
  JavaScript, media, Figma, card-order, or slideshow behavior changed.
- TDD observed the missing URL and one-link Archive count fail, then pass.
  Focused tests pass `2/2`, the build-site suite passes `38/38`, and the full
  suite passes `111/111`; build, Figma export, design audit, and diff checks
  pass with no tracked Figma delta.
- English desktop and Chinese mobile browser QA verify the exact destination,
  localized visible text and accessible name, dispatched click target, zero
  horizontal overflow, and zero console, same-origin-request, or Contact
  errors.
- Frozen review packet SHA-256 is
  `484262875809a7cfcc5602d8faa6f69bbfd67916313bc46796bf558eab859cd1`.
  Gemini requested/observed/completed `gemini-3.6-flash` and returned `PASS`
  with no findings. Local adjudication accepts the sole residual risk: future
  YouTube availability and playlist visibility remain external dependencies.
- This package is local only. It has not been merged into `main`, pushed to
  `origin/main`, deployed to Preview or Production, aliased, or used to submit
  Contact. The protected untracked review file remains user-owned, unmodified,
  and outside Git.

## Current Integrated Work Package — Ghost Hand Archive Slideshow

- Source branch `codex/ghost-hand-archive-slideshow` starts from local and remote
  baseline `03ad08ac4dd3a47d300cab99f2dd569353e13ec9`. Local `main` was
  fast-forwarded to reviewed package head
  `233abbceffec03c9c940f09c55f3b41e560563f7` on 2026-08-06. Validated behavior
  head is `9d84132e650027ad1dbfeb4211ead9a99f776e3c`; this documentation-only
  integration follow-up is reported externally after commit.
- The approved six-still `Gui Shou Shen Che` package is now one repo-configured
  vertical slice: `slideshow.json` owns order, source fingerprints, dimensions,
  focal points, 50-frame slots, 1→1.035 motion, eight-frame dissolves, poster,
  stable public paths, rights, and bilingual alt. The generic recipe validator,
  HyperFrames HTML generator, guarded CLI, WebP privacy parser, and rollback
  writer contain no Ghost Hand special case.
- Raw producer-approved originals remain ignored and outside Git. Six tracked
  1280×720 metadata-safe WebPs are authoring derivatives only. The public poster
  is 144,878 bytes, SHA-256
  `fadb961b9eed9ec4f4f4e77e0afa0a9ac25050a7a95398d2d19b407adcbca5f3`;
  the silent 10-second MP4 is 3,838,732 bytes, SHA-256
  `9a602f249559cbb613180e4c6eb173ea10060818a69a11b5907789cf16b62b52`.
- HyperFrames provenance: initial plan/scaffold pin requested `0.7.88`; the
  official upgrade check observed `0.7.94`; authoring check and completed render
  used pinned `0.7.94`. The output is H.264 1280×720 yuv420p BT.709, one video
  stream, zero audio, faststart, and full-decode clean.
- TDD covered still-vs-video poster provenance, recipe/timeline safety, generic
  composition reuse, redacted dry-run, metadata fail-closed behavior, atomic
  rollback, exact media integration, normalized focal CSS, and nearest-visible
  Archive reel arbitration. Full `npm test` passes `111/111`; build, Figma
  export, design audit, manifest/media integrity, HyperFrames strict check,
  privacy scan, and `git diff --check` pass.
- English desktop 1440×1000 and Chinese mobile 390×664 Playwright QA confirm
  poster hold, Ghost Hand playing after 1.4 seconds, exactly one active Archive
  reel, successful poster/MP4 requests, and mobile scroll handoff from Ghost
  Hand to Three-Minute. Reduced motion keeps the static poster. Console errors,
  same-origin request failures, and Contact POSTs are all zero.
- Formal closeout reviewed local-main checkpoint
  `4dab6d77c87ddddd5564bf709016ada99c6e0b57`. Frozen packet SHA-256 is
  `c075e4f486b66d272ac00b88ceba253faf6193a404dcfd0d536ca4d98ef4293f`.
  Gemini requested/observed/completed `gemini-3.6-flash` and returned `PASS`
  with no findings. Claude remains `handoff-to-active-session`; no model
  request was sent and no dual-review consensus is claimed. Local adjudication
  requires no remediation.
- The producer authorized a shareable Preview on 2026-08-06. Exact source
  commit `b7d3fe142b3c82fbcaeb384adc7209fc3089ab75` fixes the closeout artifact's
  private-path regression and passes `111/111` plus build. Vercel dry-run
  enumerated exactly 42 public `dist/` files / 80,016,741 bytes. Adopted
  deployment `dpl_Gy96AtLGzKzLyAwQEzVhwbtUw7Rz` is `READY`, target `preview`,
  with no serverless-function output:
  `https://hsin-hsin-yuan-portfolio-ku5d9znnk.vercel.app`. It excludes repo
  source, internal reviews, environments, `api/contact.js`, and the protected
  file; Contact delivery is intentionally unavailable. Project SSO still
  protects the direct URL. The producer explicitly authorized replacing the
  Hobby account's old shareable link; Vercel confirmed `Anyone with the link`,
  revoked the old link, and generated a new protected-bypass URL. Its full
  access parameter is delivered only in conversation, not Git; URL SHA-256 is
  `c262013b2f03a8485b29a42c45f8308f80700ee9d607dc571e778dd619b4f4f3`.
- The producer approved the local Preview and authorized the local-main merge
  on 2026-08-06. The merge is complete. Remote backup
  `backup/2026-08-06/ghost-hand-main-ae20130` read back at the pre-record
  checkpoint `ae201300c6925b46097fbfca57319495a0a5a4e5`; final backup ref
  `backup/2026-08-06/pre-shutdown-final` preserves this documentation follow-up.
  Separate legacy backup `backup/2026-08-06/cinematic-b29b745` read back at
  `b29b7459860844f462f1e1bb8a166bb4ba0e4a25`. `origin/main` remains
  `03ad08ac4dd3a47d300cab99f2dd569353e13ec9`. No Production promotion,
  Production deployment, alias change, or Contact submission occurred. The
  protected untracked review file remains user-owned, unmodified, and outside
  Git; its SHA-256 remains the required
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.
- Next action: send the generated shareable URL for outside Chinese-copy
  feedback, consolidate responses, then start a separate bounded Chinese-copy
  and bilingual-layout normalization package while preserving the approved
  English baseline. Revoke the shareable link after feedback closes. Lighting
  remains later, after bilingual geometry approval. Any further Preview,
  feature or `main` push, or Production action requires separate explicit
  authorization; a `main` push is Production-affecting. Backup refs and
  checkpoint tags are durability-only and are not releases.

## Prior Work Package — Collaboration Logo Wall Component

- Branch `codex/collaboration-logo-wall` starts from inherited package head
  `c33b2f810e95ba2a38146b2daf7ff1220b0d1712`; the logo-completion increment
  starts from `7ba8a6215bd49714c3690e66b3a5ba74b44c3b1e` and its validated
  implementation commit is `f900e7b31321e7b702d4c659340c6b4c85e5f02e`.
- `data/collaborations.json` now owns one normalized seven-entry collection
  consumed by both website and Figma export. Six entries use verified or
  producer-supplied SHA-locked sources plus deterministic local cream
  derivatives. Women Make Waves remains the sole visible text fallback pending
  a trustworthy standalone asset.
- The shared component provides strict public/evidence separation, three
  optical tokens, accessible logo/fallback semantics, four desktop slots, two
  mobile slots, centered incomplete rows, and no collaborator-specific layout
  code. Normal add/remove work is data-only; verified mark replacement uses the
  offline SHA-locked `npm run collabs:prepare` path. ScreenHouse exercises one
  allowlisted evidence-only SVG treatment that removes its two opaque
  background rectangles without editing the preserved official source.
- TDD passed for contract, asset safety/integrity, website, Figma parity, and
  fallback semantics. Full `npm test` passed `93/93`; asset prepare produced six
  derivatives; build, Figma export, and design audit passed. Implementation
  paths pass `git diff --check`; the immutable frozen packet retains four
  intentional Markdown hard-break spaces and is recorded by exact SHA-256.
- English/Chinese Chromium QA passed at 1440×900 and 390×844: complete images,
  canonical order, exact 4+3 / 2+2+2+1 rows, centered final rows, visible focus,
  no horizontal overflow or evidence leak, and no console/page/request errors.
- Frozen review packet SHA-256 is
  `531d94258ebb6c4ec3762cc336aaa07f873802a75323e53091ff475d4deba7e8`.
  Gemini requested/observed/completed `gemini-3.6-flash` and returned PASS with
  no actionable findings. Claude remains `handoff-to-active-session`; no model
  request was sent and no dual-review consensus is claimed.
- The producer authorized GitHub preservation and a temporary formal release on
  2026-08-06. Remote backup ref
  `backup/2026-08-06/pre-lighting-zh-refinement` and annotated tag
  `portfolio-baseline-2026-08-06-pre-lighting` were pushed and read back at
  checkpoint `4d4a27ae23fa6950000dedaeb3883da52c352b84`, which contains
  implementation `f900e7b`. `origin/main` first reached that checkpoint and
  then received only this deployment-record follow-up; public source output is
  unchanged by the follow-up.
- The `origin/main` push automatically triggered GitHub deployment
  `5774226594` for Production at exact checkpoint `4d4a27a`; GitHub reported
  `success` / `Deployment has completed` with environment URL
  `https://hsin-hsin-yuan-portfolio-vvbwab0q9.vercel.app`. No manual Vercel
  command, alias change, or Contact submission occurred. The protected
  untracked file remains outside Git at SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.
- Accepted next-phase direction: normalize Chinese copy and bilingual layout
  variants before reintroducing light effects. Preserve English copy as the
  approved baseline; move intentional language differences into canonical
  localized data and named component/layout variants, then add lighting as a
  separate visual package against the stabilized bilingual geometry.

## Prior Work Package — Overclocking Static Poster And Mobile Reel Diagnosis

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

Create a bounded Chinese-copy and bilingual-layout normalization branch from
local `main` at the integrated Ghost Hand checkpoint. Preserve the approved
English copy and current visual output; move intentional language differences
into canonical localized data and named variants. Do not combine lighting with
that package. Before any release, separately decide whether to push a feature
ref, create a Preview, or promote through `main`; any `main` push is
Production-affecting because the GitHub integration deploys it automatically.

## Cold Resume

1. Read `AGENTS.md`, `PROJECT_BIBLE.md`, this file, the Ghost Hand approved
   design/plan, and `docs/design-contract.md`.
2. Verify remote backup `backup/2026-08-06/pre-shutdown-final` matches local
   `main`, legacy backup `backup/2026-08-06/cinematic-b29b745` resolves to
   `b29b745`, and `origin/main` remains at checkpoint `03ad08a`; verify
   remote backup `backup/2026-08-06/pre-lighting-zh-refinement` and annotated
   tag `portfolio-baseline-2026-08-06-pre-lighting` still resolve exactly to
   `4d4a27a`; verify the protected untracked file/hash before changing anything.
3. Confirm local `main` contains behavior head `9d84132`, `npm test` is
   `111/111`, the six
   safe still derivatives and exact public Ghost Hand poster/MP4 match the
   manifest, and the ignored originals remain outside Git.
4. Treat Preview deployment `dpl_8vwDEtrbrG5vzqreik78rnqMH4Ax` as a prior
   build; it does not contain this Ghost Hand feature branch.
5. Do not push `main`, create a Preview, deploy Production, change an alias, or
   submit Contact without the corresponding explicit authorization; `main`
   pushes are now known to trigger Production automatically.
