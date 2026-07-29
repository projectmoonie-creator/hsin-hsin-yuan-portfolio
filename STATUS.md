# Portfolio Status

Updated: 2026-07-30

State: `PASS_WITH_OPEN_ITEMS`

## Current Work Package

- Package: `English Featured Work Copy Closeout`
- Outcome: `PASS_WITH_OPEN_ITEMS`
- Active branch: `codex/contact-archive-entrypoints`
- Closed baseline tag: `portfolio-phase-2026-07-29-closed`
- Immediate parent commit:
  `9e395cfd68d88fa3beec437dc88a153949974354`
- Reviewed implementation commit:
  `d45787888ef0e68cdbfb68b071edee9bd6aed522`
- Review:
  `docs/reviews/english-featured-copy-closeout-2026-07-30.md`
- No Preview or production deployment was created or replaced.
- No Git history rewrite or old-deployment deletion was performed.

The English screening-strip and Featured Work copy for `Nothing by Bus` and
the Gorgeous Space collection now uses an evocative first line followed by
clear, searchable program language. `Interior / Spatial Brand Films` has been
renamed `Interior Design & Branded Films`. Chinese copy remains unchanged for
the user's next review.

Verification:

- `npm test`: 23 passed, 0 failed.
- `npm run build`: passed.
- `npm run figma:export`: passed.
- `git diff --check`: passed.
- A regression test failed first against the previous wording, then passed
  with the approved English copy.
- English output retains `Gorgeous Space` with no visible `幸福空間`.

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

1. Rebuild `FROM THE ARCHIVE` as one descending chronological stream while
   preserving the current large/supporting visual vocabulary. Add truthful
   screenshots or stills where sources permit.
2. Verify the very early CV credits before publishing them: current source says
   `e4kids`, while the remembered name was `D4Kids`; dates and roles for that
   credit, `Explore the Unknown World`, and `Digital Archives` remain open.
3. Approve and implement one public-links contract for official, watch, press,
   trailer, and credit/proof destinations.
4. Build a 35-45 second Three-Minute Micro Drama reel only from approved local
   source material, then decide whether it becomes a visual Archive card.
5. Add user-approved stills for `鬼手神車` and render its restrained 12-15
   second still-led reel; public release materials remain incomplete.
6. Replace the collaboration names with locally preserved official logos.
   Continue from `docs/source-materials/collaboration-logo-wall.md`; Dragon TV
   and ScreenHouse still require exact source verification.
7. Review and rewrite the Chinese copy for `Nothing by Bus` and `Interior
   Design & Branded Films`.
8. Curate or replace playlist destinations for Gorgeous Space and Nothing by
   Bus as the source lists become more complete.
9. Review whether `AI-Language Creative` should remain in SEO metadata now
   that the standalone lab section and public service taxonomy are retired.
10. Replace remote archive thumbnails or make a custom archive reel only when
   local source or explicit picture-and-music reuse permission exists.
11. Create a new Preview or promote production only after an explicit
   deployment decision.

## Residual Privacy Risk

The current branch, generated site, Figma importer, showreel source, and
replacement MP4 do not expose the direct Yahoo address or private absolute
paths. Earlier public Git commits and older Vercel Preview deployments may
still retain the previous address. Full erasure requires a separately approved
Git history rewrite and old-deployment cleanup; neither destructive action was
performed during this package.

## Exact Next Action

Start the Archive chronology and collaboration-logo package from the reviewed
implementation commit. First make chronology independent of card size; then
complete official logo source verification before downloading or publishing
marks. Do not deploy production without explicit approval.

## Cold Resume

1. Read `AGENTS.md`, `PROJECT_BIBLE.md`, and this file.
2. Verify the active branch, reviewed implementation commit, remote tip,
   worktree state, and preserved closeout tag.
3. Read
   `docs/reviews/english-featured-copy-closeout-2026-07-30.md` for the current
   package evidence and preserved next requirements. Read
   `docs/source-materials/collaboration-logo-wall.md` before resuming the logo
   package. Read
   `docs/reviews/gorgeous-space-localization-sunny-poster-2026-07-30.md`,
   `docs/reviews/slow-steps-no-title-poster-2026-07-30.md` and
   `docs/reviews/contact-archive-entrypoints-v1-2026-07-30.md` when the earlier
   poster or contact/archive rationale is needed.
4. Do not depend on old chat history or rewrite historical review files.
