# Portfolio Status

Updated: 2026-07-30

State: `PASS_WITH_OPEN_ITEMS`

## Current Work Package

- Package: `Contact & Archive Entry Points v1`
- Outcome: `PASS`
- Active branch: `codex/contact-archive-entrypoints`
- Closed baseline tag: `portfolio-phase-2026-07-29-closed`
- Immediate parent commit:
  `6d2b44af7d9ef47264bde16de91b46a36157ddbd`
- Reviewed implementation commit:
  `dfec4330b02536f47ba97829e243ab393ea46725`
- Review:
  `docs/reviews/contact-archive-entrypoints-v1-2026-07-30.md`
- No Preview or production deployment was created or replaced.
- No Git history rewrite or old-deployment deletion was performed.

The active site no longer renders `Who Should Contact Me` or
`AI / Language Lab`. Contact is now a persistent navigation entry and a
focused invitation built around `Let’s build a story together.` The homepage
visual reel closes on the same invitation and points viewers to the Contact
section.

`FROM THE ARCHIVE` now uses one lead visual card for `Overclocking`, two
supporting visual cards for `Heart of Steel` and `Lying Game`, and a text
ledger for the remaining early works. Public video remains at its original
source; no third-party video was downloaded, re-edited, or rehosted.

Verification:

- `npm test`: 21 passed, 0 failed.
- `npm run build`: passed.
- `git diff --check`: passed.
- HyperFrames lint: 0 errors; one accepted existing dense-track warning.
- HyperFrames validate: 0 errors; five accepted low-contrast warnings for
  intentionally decorative ghost words.
- HyperFrames inspect: 0 layout issues across 9 samples.
- English desktop `1440x900`, English mobile `390x844`, and Chinese mobile
  `390x844` browser QA passed with no body overflow or console/page errors.
- The replacement homepage showreel is 30 seconds, 1920x1080, and was visually
  checked at the final Contact frame.
- Disposable screenshots and QA files remain outside the repository.

## Closed Baseline

- Reviewed implementation commit: `f4f4d0029c71a2f20f88fea5051a8726b0d0773d`
- Closed branch: `codex/work-card-video-links`
- Final closeout tag: `portfolio-phase-2026-07-29-closed`
- Vercel Preview:
  `https://hsin-hsin-yuan-portfolio-rk6jdrkve.vercel.app/en/`
- The closeout did not replace the production deployment.
- The closeout redacted the direct Yahoo address and private absolute paths
  from the then-current public repository and replaced the burned-in address
  in the homepage showreel with the portfolio inquiry form.

The current branch preserves that baseline and the later screening-strip
contracts. Historical closeout descriptions record what was present at the
time of the tag; they do not override the current site structure.

## Accepted Open Items

These are next-phase decisions, not blockers:

1. Build a 35-45 second Three-Minute Micro Drama reel only from approved local
   source material, then decide whether it becomes a visual archive card.
2. Add user-approved stills for `鬼手神車`; public release materials remain
   incomplete.
3. Curate or replace playlist destinations for Gorgeous Space and Nothing by
   Bus as the source lists become more complete.
4. Review whether `AI-Language Creative` should remain in SEO metadata now
   that the standalone lab section and public service taxonomy are retired.
5. Replace remote archive thumbnails or make a custom archive reel only when
   local source or explicit picture-and-music reuse permission exists.
6. Create a new Preview or promote production only after an explicit
   deployment decision.

## Residual Privacy Risk

The current branch, generated site, Figma importer, showreel source, and
replacement MP4 do not expose the direct Yahoo address or private absolute
paths. Earlier public Git commits and older Vercel Preview deployments may
still retain the previous address. Full erasure requires a separately approved
Git history rewrite and old-deployment cleanup; neither destructive action was
performed during this package.

## Exact Next Action

Review the current branch visually, then decide whether to create a new Vercel
Preview. Keep the Three-Minute Micro Drama reel as the next separate media
package and do not download or rehost archive videos to create it.

## Cold Resume

1. Read `AGENTS.md`, `PROJECT_BIBLE.md`, and this file.
2. Verify the active branch, reviewed implementation commit, remote tip,
   worktree state, and preserved closeout tag.
3. Read `docs/reviews/contact-archive-entrypoints-v1-2026-07-30.md` for the
   current package evidence. Read `docs/reviews/phase-closeout-2026-07-29.md`
   only when the earlier closeout rationale is needed.
4. Do not depend on old chat history or rewrite historical review files.
