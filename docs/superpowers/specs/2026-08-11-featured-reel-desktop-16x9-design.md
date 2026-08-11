# Featured Reel Desktop 16:9 Design

## Goal

Make all six approved Featured Work preview reels use the same 16:9 media
surface on desktop. The already-approved Design & Brand Films and Nothing by
Bus cards are the reference implementation.

## Baseline diagnosis

At 1440 px, the four `fill-card` records render a 533.75 × 690.81 media frame
(0.7726:1), while the two `centered-16x9` records render a 533.75 × 300.23
frame (1.7778:1). All six source reels are 16:9; the mismatch comes from the
canonical Featured presentation variant, not the video files.

## Preserve

- Featured card order, 1180 × 720 desktop panel geometry, two-column split,
  copy, typography, spacing, tags, metrics, Press, actions, and destinations.
- Existing poster identities, reel files, `object-fit: cover`, focal behavior,
  poster-first reveal, mobile delivery sources, warming, interaction timing,
  keyboard behavior, and reduced-motion/no-JavaScript fallbacks.
- The current 16:9 mobile rule and every From Archive surface and controller.
- The Figma compact-card reference geometry; it is not the live large-card
  layout and continues to consume the same canonical Featured records.

## Change

- Every canonical Featured record with an approved reel declares
  `presentation.desktopMediaVariant: "centered-16x9"`.
- The existing renderer therefore gives all six large-card media surfaces the
  shared `media-frame-wide` class and vertically centers the 16:9 frame.
- The poster and video stay coextensive inside that one shared frame so the
  aspect ratio does not change when playback begins.

## Verification contract

- TDD must prove all approved Featured reels are canonical `centered-16x9`
  records and render through the shared wide class without slug exceptions.
- At 1440 px, English and Chinese must report a 1.7778 media aspect for all six
  cards while panel geometry remains 1180 × 720.
- Check desktop, tablet, mobile, reduced motion, no JavaScript, keyboard,
  overflow, poster-to-video geometry, Figma export, full tests, build,
  design-contract audit, and protected-file integrity.
- Stop if any reel is not 16:9, if text/card geometry drifts, or if interaction
  behavior changes.

## Out of scope

No media re-encoding, loading-policy change, new crop controls, copy change,
Archive change, Contact submission, Production/alias change, `main` merge, or
push.
