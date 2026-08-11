# Archive Reel Intent Playback Design

Date/status: 2026-08-11 / producer-approved behavior, awaiting written-spec review  
Branch/base: `codex/archive-reel-intent-playback` / `02fee43`

## Goal

Apply the approved Featured Reel intent interaction to the three Archive cards
that already declare canonical `cardReelMode`, `cardReelUrl`, and
`cardReelPoster`, without redesigning Archive or adding another media truth.

## Selected Approach

Share the input/intent contract while keeping Featured and Archive playback
controllers separate. A small common binder may own pointer movement,
first-click suppression, and destination awareness; Archive continues to own
its observer, active-reel arbitration, hold timer, reset, and error lifecycle.

Rejected alternatives:

- Duplicate Featured touch code inside Archive: smallest initial diff but
  creates two versions of the same gesture and failure rules.
- Merge Featured and Archive into one complete controller: superficially
  uniform but wrongly couples Featured-only warming and Screening Strip logic
  to the lower Archive section.

## Preserve

- Existing Archive card geometry, media crop, poster crossfade, copy, links,
  order, responsive layout, CSS appearance, and Figma output.
- Canonical Archive records and current three approved reels only: The
  Mechanic, Three-Minute Micro Drama Series, and Overclocking.
- Passive Archive fallback remains 35% visibility plus 1400ms on every size.
- One active Archive owner selected by the existing closest-visible rule.
- `preload="none"` in initial HTML; no Hero-triggered or proximity Archive warm.
- Reduced-motion and no-JavaScript remain static poster experiences.

## Change

- Desktop pointer entry on an Archive card starts its reel immediately and
  pointer exit releases it. Existing focusable linked cards do the same on
  focus in/out; The Mechanic gains no artificial link or new focus stop.
- At 820px and below, a stationary touch on `.archive-card-media` starts that
  reel immediately. Copy outside the media surface keeps its existing action.
- For Three-Minute Micro Drama Series and Overclocking, the first media tap is
  consumed for preview and the second tap follows the existing YouTube link.
- The Mechanic has no destination, so touch starts/retries preview only.
- More than 12px pointer movement or pointer cancellation remains scrolling:
  it neither starts playback nor follows a linked card accidentally.
- An explicit intent may set metadata preload and call `load()` only for that
  selected reel; reset restores the initial no-preload state when appropriate.

## Failure And Lifecycle Rules

- Intent resets every other Archive reel; no parallel Archive playback.
- Leaving the viewport, visibility loss, resize/scroll ownership change,
  media error, and page lifecycle reset the reel to its poster.
- A linked reel whose `play()` rejects releases the next stationary tap to its
  destination. An unlinked reel resets and remains retryable.
- Late `playing` or rejected promises must not reveal or reset a newer owner.
- Featured-only warming, Screening Strip priming, and its 700ms mobile passive
  fallback remain untouched.

## Test-First Contract

Before implementation, add failing runtime assertions for linked first/second
tap, unlinked tap/retry, movement and cancellation, desktop hover/focus,
failure release, single ownership, stale events, and unchanged 1400ms passive
fallback. Then validate build markup, reduced motion, no-JS, keyboard, overflow,
bilingual desktop/mobile behavior, Figma no-drift, zero Contact POST, privacy,
protected-file hash, full tests, build, design audit, and `git diff --check`.

## Non-Goals

No new reel encodes, Archive prewarming, card/link/content changes, controls,
decorative motion, light effects, Contact work, Production, alias, `main`, or
Git push. Preview follows the standing dist-only review authorization only
after all local gates pass.
