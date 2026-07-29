# Portfolio Status

Updated: 2026-07-29

State: `PASS_WITH_OPEN_ITEMS`

## Current Work Package

- Package: `Screening Strip Media Contract v1`
- Outcome: `PASS`
- Active branch: `codex/screening-strip-media-contract-v1`
- Base tag: `portfolio-phase-2026-07-29-closed`
- Reviewed implementation commit:
  `056106ebaba8f8074cafd73ba6dcf2e0ea4d78d9`
- Review:
  `docs/reviews/screening-strip-media-contract-v1-2026-07-29.md`
- No Preview or production deployment was created or replaced.
- No Git history rewrite or old-deployment deletion was performed.

The screening strip is now static-first. Only a work with an approved
work-specific `cardReelUrl`, canonical poster, and
`cardReelMode: "after-hold"` may move. Approved reels wait 1400 ms after the
strip actually enters the browser viewport, reveal only after confirmed
playback, and reset to the poster when they leave view.

Verification:

- `npm test`: 20 passed, 0 failed.
- `npm run build`: passed.
- Browser QA passed at English `1440x900` and `390x844`, Chinese `390x844`,
  reduced-motion `390x844`, and JavaScript-disabled `390x844`.
- Confirmed playback began about 1442 ms after viewport entry.
- Offscreen reset, static fallback, card links, body overflow, and browser
  console checks passed.
- Disposable screenshots and the QA script remain outside the repository.

## Closed Baseline

- Reviewed implementation commit: `f4f4d0029c71a2f20f88fea5051a8726b0d0773d`
- Closed branch: `codex/work-card-video-links`
- Final closeout tag: `portfolio-phase-2026-07-29-closed`
- Vercel Preview:
  `https://hsin-hsin-yuan-portfolio-rk6jdrkve.vercel.app/en/`
- The closeout did not replace the production deployment.
- The final closeout also redacts the direct Yahoo address and private absolute
  paths from the public repository, and replaces the burned-in address in the
  homepage showreel with the portfolio inquiry form.

This baseline is a trustworthy bilingual resume-supplement portfolio. It
includes the hero/showreel entry, platform proof, continuous screening strip,
Available For section, Featured Works, work-specific media links and reels,
AI-language lab, selected archive, press, GitHub link, and contact form.

## Accepted Open Items

These are next-phase decisions, not blockers:

1. Build a 35-45 second Three-Minute Micro Drama reel and decide whether its
   archive item becomes a media card.
2. Add user-approved stills for `鬼手神車`; public release materials remain
   incomplete.
3. Curate or replace playlist destinations for Gorgeous Space and Nothing by
   Bus as the source lists become more complete.
4. Review whether `AI-Language Creative` should remain in SEO metadata after
   being removed from the hero role line.
5. Continue the user's known visual/content refinements as a new bounded work
   package rather than reopening the whole site at once.

## Residual Privacy Risk

The current branch, generated site, Figma importer, showreel source, and
replacement MP4 no longer expose the direct Yahoo address or private absolute
paths. Earlier public Git commits and older Vercel Preview deployments may
still retain the previous address. Full erasure requires a separately approved
Git history rewrite and old-deployment cleanup; neither destructive action was
performed during this closeout.

## Exact Next Action

Start a bounded Three-Minute Micro Drama media package from the reviewed
screening-strip branch. Keep the 35-45 second reel edit and Archive media-card
decision in the same package; do not change production. The destructive
public-history and old-deployment purge remains a separate action that still
requires explicit authorization.

## Cold Resume

1. Read `AGENTS.md`, `PROJECT_BIBLE.md`, and this file.
2. Verify the active branch, reviewed implementation commit, remote tip,
   worktree state, and preserved closeout tag.
3. Read `docs/reviews/screening-strip-media-contract-v1-2026-07-29.md` for the
   current package evidence. Read `docs/reviews/phase-closeout-2026-07-29.md`
   only when the earlier closeout rationale is needed.
4. Do not depend on old chat history or rewrite the historical closeout report.
