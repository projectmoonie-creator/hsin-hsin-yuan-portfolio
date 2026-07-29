# Screening Strip Media Contract v1

Date: 2026-07-29  
Status: Approved for implementation  
Baseline: `portfolio-phase-2026-07-29-closed`

## Subject, Audience, And Job

The subject is Hsin-Hsin Yuan's bilingual documentary and factual-media
portfolio. The audience is international commissioners, producers, cultural
organizations, and creative collaborators. The screening strip has one job:
provide a quick visual index into Featured Works without competing with the
hero showreel or the deeper work panels.

## Approaches Considered

1. **Static cards in a moving strip.** This is the quietest and cheapest
   option, but it removes approved motion evidence from the two works that
   already have purpose-built silent reels.
2. **Poster hold followed by an approved silent reel.** This keeps the strip
   readable on arrival, lets the moving strip remain the primary gesture, and
   reveals motion only for works that explicitly opt in. This is the selected
   approach.
3. **Immediate autoplay for every available reel.** This is the current
   behavior. It surfaces motion quickly but creates two simultaneous motion
   systems and makes the strip feel busier than its visual-index role.

## Visual Contract

- **Color:** Keep the current ink, background, acid accent, borders, and scrim.
  No palette changes are part of this package.
- **Typography:** Keep the current display, body, utility roles, sizes, and
  hierarchy. No copy changes or additional labels are introduced.
- **Spacing and shape:** Keep the 16:10 cards, existing responsive widths,
  eight-pixel radius, strip gap, and fixed outer edge gradients.
- **Image treatment:** Every card begins on its canonical poster. A motion
  layer may replace the poster only after the hold and only for an explicitly
  approved work-specific reel.
- **Signature:** The continuous contact-sheet-like strip remains the single
  ambient movement. Reel playback is a delayed reveal inside selected frames,
  not a second competing animation system.

## Media Data Contract

- `cardReelUrl` continues to identify an approved, silent, work-specific MP4.
- `cardReelPoster` remains the required static fallback for that reel.
- `cardReelMode: "after-hold"` explicitly opts a work into moving-thumbnail
  playback.
- A `cardReelUrl` without the approved mode renders as a static poster card.
- The hold duration is owned by the strip runtime, not repeated in every work
  file. Version 1 uses a 1400 ms hold.
- Unsupported mode values fail closed to a static card.

The initially approved moving-thumbnail works are:

- Interior / Spatial Brand Films
- Nothing by Bus

## Runtime Behavior

1. The poster is visible immediately.
2. When the strip intersects the actual browser viewport and at least 35% of
   an opted-in reel is visible within the strip, start a 1400 ms hold. Do not
   use a pre-roll root margin for media playback.
3. If the reel remains visible and the document remains active, request silent
   playback.
4. Reveal the video only after the browser confirms playback.
5. When the reel leaves the visibility threshold, the document is hidden, or
   the page is left, cancel the pending hold, pause the reel, reset it to the
   beginning, and return to the poster.
6. Original sequence videos may preload metadata. Cloned loop videos use
   `preload="none"`.
7. If `IntersectionObserver` or scripted playback is unavailable, keep the
   poster visible. Do not force a fallback autoplay path.

Desktop and mobile use the same hold so the editorial rhythm stays consistent.
At `prefers-reduced-motion: reduce`, card videos remain hidden and the strip
stays static. With JavaScript disabled, poster cards and links remain usable.

## Accessibility And Failure Handling

- Motion adds no new control, copy, or focus stop.
- Cards retain their current link destinations and keyboard behavior.
- Playback rejection, a missing video, or a slow network leaves the poster in
  place without exposing a blank frame.
- Cloned links stay outside the tab order.
- Video remains muted, inline, decorative, and hidden from assistive
  technology.

## Test Contract

Automated regression tests must prove:

- only `cardReelMode: "after-hold"` renders a strip video;
- approved source data contains the explicit opt-in;
- rendered videos carry the hold-mode contract;
- CSS keeps videos hidden until confirmed playback and under reduced motion;
- JavaScript waits 1400 ms, cancels pending playback, resets the video, and
  reveals it only after the `playing` event;
- offscreen strips cannot begin a hold or play a reel through observer
  pre-roll;
- clone videos retain `preload="none"`;
- existing links, strip continuity, bilingual pages, privacy scans, and build
  output continue to pass.

Visual checks cover English desktop and mobile plus reduced-motion and
JavaScript-disabled mobile states.

## Non-Goals

- No Three-Minute Micro Drama reel edit or archive-card promotion.
- No new stills for `鬼手神車`.
- No playlist, SEO, hero, typography, color, or production-deployment change.
- No Git history rewrite or old Vercel deployment deletion.
- No Figma layout redesign; the visual shape and canonical work content stay
  unchanged.

## Rollback

All implementation work happens on
`codex/screening-strip-media-contract-v1`, branched from
`portfolio-phase-2026-07-29-closed`. The closed tag remains untouched, so the
entire package can be abandoned without rewriting the reviewed baseline.
