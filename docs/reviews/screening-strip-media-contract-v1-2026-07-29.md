# Screening Strip Media Contract v1 Review

Date: 2026-07-29

Outcome: `PASS`

## Scope

This review covers the bounded screening-strip media package branched from
`portfolio-phase-2026-07-29-closed`. It establishes static-first cards,
explicit reel approval, a 1400 ms poster hold, confirmed-play reveal, and
offscreen reset behavior.

It does not create the Three-Minute Micro Drama reel, add `鬼手神車` media,
change playlists or SEO, deploy a new Preview, replace production, rewrite Git
history, or delete old Vercel deployments.

## Reviewed Version

- Branch: `codex/screening-strip-media-contract-v1`
- Closed baseline: `portfolio-phase-2026-07-29-closed`
- Reviewed implementation commit:
  `056106ebaba8f8074cafd73ba6dcf2e0ea4d78d9`

## Contract

- `cardReelMode: "after-hold"` is required for motion.
- A reel URL without that explicit mode fails closed to its poster.
- Interior / Spatial Brand Films and Nothing by Bus are the two approved
  moving-thumbnail works.
- The poster remains visible for 1400 ms after the strip actually enters the
  browser viewport.
- Video opacity changes only after the browser fires `playing`.
- Leaving the viewport, hiding the document, or leaving the page cancels
  pending playback, pauses the reel, resets it to zero, and restores the
  poster.
- Reduced-motion and no-JavaScript states remain static.

## Deterministic Evidence

- The new render tests failed first because the opt-in field and fail-closed
  markup did not exist, then passed after implementation.
- The new motion-source tests failed first because hold/reset/reveal behavior
  did not exist, then passed after implementation.
- Browser QA exposed that the previous `20%` observer root margin could start
  reels while the strip was still below the viewport. A regression test was
  added before the observer was tightened to the actual viewport.
- `npm test`: 20 tests passed, 0 failed.
- `npm run build`: passed.
- English and Chinese output, Figma generation/importer tests, contact tests,
  direct-address scan, and private-path scan all passed.
- `git diff --check`: passed.

## Visual And Interaction Evidence

Fresh local build checks:

- English desktop: `1440x900`
- English mobile: `390x844`
- Chinese mobile: `390x844`
- reduced-motion mobile: `390x844`
- JavaScript-disabled mobile: `390x844`

Observed:

- no reel played before the strip entered the viewport;
- the desktop poster remained visible during the hold;
- a reel entered confirmed playback approximately 1442 ms after strip entry;
- leaving the viewport paused and reset all reels;
- reduced motion hid and paused videos and left the track untransformed;
- no-JavaScript output retained source cards, posters, and links;
- no tested viewport had body-level horizontal overflow;
- no browser console or page errors occurred;
- before/after screenshots showed no black flash, missing copy, or broken card
  hierarchy.

Screenshots and the Playwright script are disposable `/private/tmp` QA
artifacts and are not portfolio assets.

## Content, Privacy, Rights, And Deployment

No new public claim, external media, or third-party rights state was added.
The package uses the two already-retained work-specific local reels and their
canonical posters. Repository privacy scans remain green.

No Claude/Gemini review was dispatched because this is a narrow, reversible
interaction refinement with deterministic and browser coverage; it does not
change information architecture, a shared content generator contract beyond
one fail-closed field, security, migration, or production deployment.

No deployment was created or promoted. The previous production and Preview
states remain unchanged.

## Remaining Open Items

- The residual direct-address exposure in older public Git history and older
  Vercel Previews remains outside this non-destructive package.
- The next recommended media package is the 35-45 second Three-Minute Micro
  Drama reel and its Archive media-card decision.
- `鬼手神車` still needs user-approved media.
- Playlist curation and the `AI-Language Creative` SEO decision remain open.

## Exact Next Action

Start a new bounded Three-Minute Micro Drama media package from the reviewed
screening-strip branch, keeping reel editing and Archive presentation together
while leaving production untouched.
