# Portfolio Status

Updated: 2026-07-30

State: `PASS_WITH_OPEN_ITEMS`

## Current Work Package

- Package: `Slow Steps No-Title Poster`
- Outcome: `PASS`
- Active branch: `codex/contact-archive-entrypoints`
- Closed baseline tag: `portfolio-phase-2026-07-29-closed`
- Immediate parent commit:
  `ed40089bc1f3ac22b1151401b8bc486c24973740`
- Reviewed implementation commit:
  `9bc45bc601b07d159457c49aae205a83e8a5d62f`
- Review:
  `docs/reviews/slow-steps-no-title-poster-2026-07-30.md`
- No Preview or production deployment was created or replaced.
- No Git history rewrite or old-deployment deletion was performed.

The user-provided 3840x2160 no-title `Slow Steps` artwork is now the canonical
poster. The web copy is a 1920x1080 WebP and keeps the same stable asset path,
so the live site and generated Figma SVGs update together. The Featured Work
image no longer adds a duplicate `SLOW STEPS` overlay; the screening-strip
card keeps its title because it functions as navigation.

Verification:

- `npm test`: 21 passed, 0 failed.
- `npm run build`: passed.
- `git diff --check`: passed.
- English desktop `1440x900` and mobile `390x844` checks passed for both the
  screening-strip card and Featured Work image.
- Desktop keeps the central rider as the focal subject. Mobile uses a 16:9
  frame that retains all three torn-paper portraits.
- No tested viewport has body-level horizontal overflow or console/page errors.
- Source PNG SHA-256:
  `3a6f37deee03aab1836fecaee547685f8b79a23106e5b540cac94094a193c78a`.
- Delivered WebP SHA-256:
  `f733046cd1de822ecee43de08461c34e8990f1644c4f449a9d2268da5656da3d`.
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
3. Read `docs/reviews/slow-steps-no-title-poster-2026-07-30.md` for the current
   package evidence. Read
   `docs/reviews/contact-archive-entrypoints-v1-2026-07-30.md` when the earlier
   contact/archive rationale is needed.
4. Do not depend on old chat history or rewrite historical review files.
