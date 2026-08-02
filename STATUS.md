# Portfolio Status

Updated: 2026-08-02

State: `PASS_WITH_OPEN_ITEMS`

## Current Work Package

- Package: `Archive Chronology v1`
- Outcome: `PASS_WITH_OPEN_ITEMS`
- Active branch: `codex/contact-archive-entrypoints`
- Closed baseline tag: `portfolio-phase-2026-07-29-closed`
- Immediate parent commit:
  `e4338006c3b88835b8b50c964d66bd34a35003b5`
- Reviewed implementation commit:
  `e5d7aa680a2f6a2c8df14d4ccf007d0fdfdfcaa0`
- Review:
  `docs/reviews/archive-chronology-v1-2026-08-02.md`
- No Preview or production deployment was created or replaced.
- No Git history rewrite or old-deployment deletion was performed.

`FROM THE ARCHIVE` is now one descending chronology: `鬼手神車` (2018),
Three-Minute Micro Drama (2017-2018), `Heart of Steel` (2014-2015), `Lying
Game` (2013-2014), then `Overclocking` (2011-2013). Text-only, supporting, and
lead card treatments remain, but card size no longer changes reading order.

Verification:

- A chronology regression test failed first against the previous ordering,
  then passed with the new canonical stream.
- `npm test`: 24 passed, 0 failed.
- `npm run build`: passed.
- `npm run figma:export`: passed with no tracked output change.
- `git diff --check`: passed.
- English and Chinese output share the same five-item chronology.
- Matched desktop and mobile captures against detached baseline `e433800`,
  plus the full responsive, reduced-motion, no-JavaScript, focus, and overflow
  matrix, passed.

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

1. Verify the very early CV credits before publishing them: current source says
   `e4kids`, while the remembered name was `D4Kids`; dates and roles for that
   credit, `Explore the Unknown World`, and `Digital Archives` remain open.
2. Approve and implement one public-links contract for official, watch, press,
   trailer, and credit/proof destinations.
3. Build a 35-45 second Three-Minute Micro Drama reel only from approved local
   source material, then decide whether it becomes a visual Archive card.
4. Add user-approved stills for `鬼手神車` and render its restrained 12-15
   second still-led reel; public release materials remain incomplete.
5. Replace the collaboration names with locally preserved official logos.
   Continue from `docs/source-materials/collaboration-logo-wall.md`; Dragon TV
   and ScreenHouse still require exact source verification.
6. Review and rewrite the Chinese copy for `Nothing by Bus` and `Interior
   Design & Branded Films`.
7. Curate or replace playlist destinations for Gorgeous Space and Nothing by
   Bus as the source lists become more complete.
8. Review whether `AI-Language Creative` should remain in SEO metadata now
   that the standalone lab section and public service taxonomy are retired.
9. Replace remote archive thumbnails or make a custom archive reel only when
   local source or explicit picture-and-music reuse permission exists.
10. Generate an editable Archive design layer from the canonical collection if
    Figma Archive parity becomes part of a future package; do not add a second
    hand-maintained ordering list.
11. Identify the pre-existing untracked duplicate review file before another
    package edits or removes it. This package left it untouched.
12. Create a new Preview or promote production only after an explicit
   deployment decision.

## Residual Privacy Risk

The current branch, generated site, Figma importer, showreel source, and
replacement MP4 do not expose the direct Yahoo address or private absolute
paths. Earlier public Git commits and older Vercel Preview deployments may
still retain the previous address. Full erasure requires a separately approved
Git history rewrite and old-deployment cleanup; neither destructive action was
performed during this package.

## Exact Next Action

First identify whether
`docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md` is valid
evidence or an accidental copy without deleting it. Then start a separate
`Collaboration Logo Wall Source Verification` package from
`e5d7aa680a2f6a2c8df14d4ccf007d0fdfdfcaa0`: confirm
the exact Dragon TV and ScreenHouse identities and official domains before
downloading or publishing marks. Do not deploy production without explicit
approval.

## Cold Resume

1. Read `AGENTS.md`, `PROJECT_BIBLE.md`, and this file.
2. Verify the active branch, reviewed implementation commit, remote tip,
   worktree state, and preserved closeout tag.
3. Read
   `docs/reviews/archive-chronology-v1-2026-08-02.md` for the current package
   evidence and preserved next requirements. Read
   `docs/source-materials/collaboration-logo-wall.md` before resuming the logo
   package. Read `docs/reviews/english-featured-copy-closeout-2026-07-30.md`,
   `docs/reviews/gorgeous-space-localization-sunny-poster-2026-07-30.md`,
   `docs/reviews/slow-steps-no-title-poster-2026-07-30.md` and
   `docs/reviews/contact-archive-entrypoints-v1-2026-07-30.md` when the earlier
   poster or contact/archive rationale is needed.
4. Do not depend on old chat history or rewrite historical review files.
