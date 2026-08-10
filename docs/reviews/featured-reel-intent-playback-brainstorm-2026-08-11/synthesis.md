# Featured Reel Intent Playback — Synthesis

Date: 2026-08-11
Frozen packet SHA-256: `97bb860110d5d4247dad08e63d65847f6a7d32b66de93d160866951a059bae75`

## Provenance

- Codex completed an independent local mechanism analysis before external
  responses were read.
- Gemini dynamically requested, observed, and completed
  `gemini-3.6-flash`; usage was 1,597 input / 3,337 output / 8,734 total
  tokens.
- Claude requested the dynamic `opus` capability alias but completed no
  model. The subscription-only helper exited 90 after preflight;
  `modelRequestSent` is unknown, no observed/completed model exists, and no
  billing fallback was allowed. No Claude opinion or dual-AI consensus is
  claimed.

## Convergence

The local and Gemini analyses agree on the useful mechanism boundary:

1. The new Screening Strip anchor repair did not cause the media delay.
2. The fixed 700ms/1400ms hold should apply to passive viewing, not explicit
   user intent.
3. One explicit target should immediately outrank passive 35% ownership while
   retaining the same lifecycle, stale-promise, reduced-motion, and one-owner
   guards.
4. A Screening Strip action can prime its exact target before the internal
   jump.
5. The current post-`load` metadata warm misses the early interval in which it
   would be most useful. Any earlier warm must be proven not to compete with
   Hero LCP.
6. A gesture cannot remove physical bandwidth/connection contention; matched
   `playing` evidence is required, not merely a faster `play()` call.

## Decision that remains with the producer

### A — Separate preview control (recommended)

Keep the full media surface as the one-tap official link. Reuse the existing
circular play affordance as a real, sibling preview button with no visual
redesign. Desktop hover over the media and keyboard focus start the preview;
mobile taps the circle to start it immediately. The button and link remain
valid separate controls, including for works without an official destination.

This requires a small DOM/CSS wrapper refactor plus geometry evidence, but it
keeps the first-tap meaning honest and avoids touch-scroll interception.

### B — Touch anywhere, then tap again to leave

Keep the present visual/DOM shape. Desktop hover/focus starts immediately.
On mobile, the first stationary tap anywhere on linked media starts the local
preview and suppresses external navigation; a second tap opens the official
site. A touch movement cancels the preview tap so vertical scrolling remains
native.

This is the smallest implementation and most closely matches aggressive video
preview sites, but the first tap on an ordinary-looking link no longer opens
it. A slow cold preview can look like a dead first tap, and accessibility/touch
state is more fragile.

### C — Preserve mobile one-tap external navigation

Add only desktop hover/focus, exact Screening Strip target priming, and an
earlier one-candidate warm after the Hero is safe. Mobile tapping the large
media still opens the official site immediately.

This is the lowest semantic risk but does not deliver the producer's requested
large-card mobile touch-to-preview behavior.

## Loading experiment shared by A or B

The chosen interaction should be tested with three cold variants before the
final controller is selected:

1. explicit intent bypass only;
2. explicit intent plus exact target metadata load;
3. the above plus one passive candidate allowed only after the canonical Hero
   image is loaded/settled, not after the whole window load.

Keep the smallest variant whose three-run median materially improves visible
`playing`. Reject any variant that adds an initial Featured MP4 request,
regresses Hero LCP/TBT/CLS, violates Save-Data/2G/reduced-motion, or merely
makes `play()` earlier while visible playback remains slow.

## Implementation gate

No runtime implementation is authorized by this brainstorm. The producer must
choose A, B, or C. After that choice, implementation starts with failing
structure, priority, gesture, navigation, ownership, reduced-motion, and
lifecycle tests.
