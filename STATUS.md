# Portfolio Status

Updated: 2026-07-30

State: `PASS_WITH_OPEN_ITEMS`

## Current Work Package

- Package: `Gorgeous Space English Localization + Sunny Wang Poster`
- Outcome: `PASS`
- Active branch: `codex/contact-archive-entrypoints`
- Closed baseline tag: `portfolio-phase-2026-07-29-closed`
- Immediate parent commit:
  `5ff4470fbe222a3a724fd15617ebeb69cf50090d`
- Reviewed implementation commit:
  `213dc8a0e6d3f2e05c100fecdeaff45b42a85965`
- Review:
  `docs/reviews/gorgeous-space-localization-sunny-poster-2026-07-30.md`
- No Preview or production deployment was created or replaced.
- No Git history rewrite or old-deployment deletion was performed.

Gorgeous Space is now a bilingual data value instead of one mixed-language
string. The English site and English Figma handoff use `Gorgeous Space` with no
visible `幸福空間`; the Chinese site preserves the official Chinese label. The
work poster now uses a larger frontal Sunny Wang frame, positioned on the right
so the screening-strip copy remains readable on the left.

Verification:

- `npm test`: 23 passed, 0 failed.
- `npm run build`: passed.
- `npm run figma:export`: passed.
- `git diff --check`: passed.
- English generated HTML, English Figma exports, and the Figma importer contain
  no `幸福空間`; Chinese generated HTML retains it.
- Desktop `1440x1100` and mobile `390x844` checks passed for the
  screening-strip card and Featured Work image.
- No tested viewport reported console errors.
- Delivered WebP SHA-256:
  `db41763c6846b186a0bfcc5e9b45d4765917fed99a48c038d61693135d78a666`.
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

1. Approve and implement the proposed `PUBLIC LINKS` rule so public watch,
   official, press, and credit/proof destinations use one repeatable contract.
2. Build a 35-45 second Three-Minute Micro Drama reel only from approved local
   source material, then decide whether it becomes a visual archive card.
3. Add user-approved stills for `鬼手神車`; public release materials remain
   incomplete.
4. Curate or replace playlist destinations for Gorgeous Space and Nothing by
   Bus as the source lists become more complete.
5. Review whether `AI-Language Creative` should remain in SEO metadata now
   that the standalone lab section and public service taxonomy are retired.
6. Replace remote archive thumbnails or make a custom archive reel only when
   local source or explicit picture-and-music reuse permission exists.
7. Create a new Preview or promote production only after an explicit
   deployment decision.

## Residual Privacy Risk

The current branch, generated site, Figma importer, showreel source, and
replacement MP4 do not expose the direct Yahoo address or private absolute
paths. Earlier public Git commits and older Vercel Preview deployments may
still retain the previous address. Full erasure requires a separately approved
Git history rewrite and old-deployment cleanup; neither destructive action was
performed during this package.

## Exact Next Action

Obtain the user's approval on the proposed `PUBLIC LINKS` layout and data
contract, then implement it as a separate bounded package. Do not deploy
production without explicit approval.

## Cold Resume

1. Read `AGENTS.md`, `PROJECT_BIBLE.md`, and this file.
2. Verify the active branch, reviewed implementation commit, remote tip,
   worktree state, and preserved closeout tag.
3. Read
   `docs/reviews/gorgeous-space-localization-sunny-poster-2026-07-30.md` for
   the current package evidence. Read
   `docs/reviews/slow-steps-no-title-poster-2026-07-30.md` and
   `docs/reviews/contact-archive-entrypoints-v1-2026-07-30.md` when the earlier
   poster or contact/archive rationale is needed.
4. Do not depend on old chat history or rewrite historical review files.
