# Mobile Featured Media Parity Design

Date: 2026-08-03
Status: Approved in conversation

## Goal

Make every Featured Works card treat its image as a full-size primary visual on
mobile. `Tech Dreamers`, `My Art, My Voice`, and `Top Gear China: UK Special`
must have the same 16:9 image geometry already visible on `Slow Steps`,
`Design & Brand Films`, and `Nothing by Bus`.

## Cause

At the mobile breakpoint, only `.media-frame-unlabeled` receives an explicit
16:9 aspect ratio. The labelled media frames used by Tech Dreamers, My Art, and
Top Gear lose the desktop grid's full-height constraint and collapse around
their overlay title, producing a shallow image strip.

## Approved design

- At `820px` and below, every Featured Works `.media-frame` uses `aspect-ratio:
  16 / 9` and `min-height: 0`.
- Preserve the existing overlay titles and play affordances; image size must
  not depend on whether a card hides its media label.
- Preserve the existing desktop layout, including the 40/60 cards and the
  current tall media treatment for standard desktop cards.
- Do not change image files, focal points, work copy, metrics, links, order,
  motion, colors, type, or card spacing.
- Do not change the screening strip or Archive.

## Implementation boundary

The rule belongs in the existing mobile media CSS, not in per-work data. Adding
`featuredMediaAspect` to only three works would also change their desktop card
treatment, and hiding media labels would remove useful program identity. A
single breakpoint rule expresses the actual invariant: all mobile Featured
Works media is equally prominent.

## Verification

- Add a test that fails while the mobile `.media-frame` lacks a universal 16:9
  rule and rejects reliance on `.media-frame-unlabeled` alone.
- Confirm all six Featured Works cards have matching 16:9 media geometry at
  `390 × 844` and `360 × 800`.
- Confirm desktop cards remain unchanged at `1440 × 900` and `1200 × 900`.
- Re-run the full test suite, build, Figma export, reduced-motion, no-JavaScript,
  keyboard, overflow, and console-error checks.
- Create a new non-production Vercel Preview, update the current review/status,
  and then merge the completed branch into local `main` as explicitly approved.

## Self-review

- No placeholders or unresolved choices.
- Mobile and desktop behavior are explicitly separated.
- Scope is limited to Featured Works image geometry.
- The rule is testable without introducing a new content field or parallel
  design source.
