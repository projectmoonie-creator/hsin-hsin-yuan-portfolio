# Independent Codex Brainstorm

## Root-cause model

The 700ms hold is visible but is not the main cold delay. The controller calls
`play()` on schedule, then the media request competes with unfinished page
transfers. The present metadata warm does not help this path because it waits
for full window `load`, which occurred too late to issue any pre-jump bytes in
the reproduced runs. Waiting on the page improves later playback because the
network queue clears, matching the producer's report that previews become
normal after a while.

An explicit gesture can remove the fixed hold and target one reel earlier. It
cannot by itself guarantee instant playback on a congested cold connection.
The strongest bounded solution combines a precise intent lane with a passive
warm trigger that begins after the Hero has had priority but before full page
load.

## Options

### 1. Minimal first-touch interception

Desktop `pointerenter`/`focusin` and mobile `pointerdown` immediately claim and
play the reel. On linked media, the first touch prevents that click from
opening the official site; the next tap opens it. Automatic 35% plus hold
remains fallback.

Benefits: small runtime diff, removes the 700/1400ms hold on intent, no new
visual element. Costs/risks: an anchor no longer activates on the first tap,
the change is not self-explanatory, touch-to-scroll and assistive semantics are
harder to make predictable, and a slow first preview may feel like a dead tap.

### 2. Separate preview control plus hover/focus intent

Refactor only the media wrapper into valid sibling actions: keep the full
media official link and turn the existing circular play affordance into a real
preview button with a localized accessible name. Desktop hovering the media
or focusing the preview control immediately claims/plays; mobile tapping the
preview control immediately claims/plays. Tapping the rest of linked media
still opens the official destination on the first tap. Unlinked reel media can
make the same control available without inventing a destination.

Benefits: predictable link semantics, explicit mobile choice, no nested
interactive content, keyboard-equivalent, visually can remain identical.
Costs/risks: renderer/DOM/CSS refactor must prove geometry equivalence; the
existing circle's meaning changes from decorative external-play cue to local
preview, so accessible labels and click areas need exact tests.

### 3. Intent-targeted warm plus post-LCP passive warm

Combine either interaction option with two load changes: a Screening Strip
pointer/focus intent primes the exact target reel before the internal jump, and
the existing one-candidate mobile metadata warm becomes eligible after the
Hero LCP observation settles (with an idle/timeout fallback) instead of waiting
for full window `load`. Explicit touch/hover bypasses the poster hold; passive
35% behavior keeps it.

Benefits: attacks both the fixed wait and the network-queue timing, makes the
new internal small-card target useful, retains concurrency one and a cold
fallback. Costs/risks: LCP observation/fallback logic and request priority need
matched testing; warming too early could compete with Hero or spend bytes on a
reel the user never watches.

### 4. Dedicated micro-preview delivery

Create very short, lower-resolution preview segments or sprite/animated-image
assets for instant interaction, leaving full reels and official links
separate.

Benefits: strongest latency ceiling and smallest first interaction payload.
Costs/risks: new canonical media recipe, additional derived files and quality
review, more storage/build complexity, and a larger work package than the
current diagnosis justifies.

## Pragmatic recommendation

Use Option 2's explicit preview control and desktop hover/focus semantics,
combined with the bounded loading portion of Option 3. Preserve the existing
35%/hold controller as fallback. Explicit intent becomes a higher-priority
owner state, cancels its hold, requests play immediately, and resets under the
same lifecycle rules. The exact Screening Strip target may prime one reel, but
passive warm should move only from full `load` to a post-Hero/idle gate after
matched Hero tests prove no regression.

This is slightly more structure than intercepting the first anchor tap, but it
avoids a dead first tap and keeps the official site one-tap reachable. It also
uses the current circular affordance rather than adding decoration.

Falsify this recommendation if a prototype cannot keep media/card geometry
identical, if users do not understand the preview control, if intent-to-playing
does not materially improve in three matched cold runs, or if Hero LCP/initial
video requests regress.

## Alternative and unconstrained views

The pragmatic alternative is Option 1 if the producer strongly prefers
touch-anywhere and accepts first-tap interception. The unconstrained option is
a dedicated micro-preview pipeline with short segments and an interaction
scheduler, but it should be a separate package.

A contrarian reading is that no new touch behavior is required: the observed
delay may be almost entirely cold network contention, so moving passive warm
earlier could solve the complaint. That would not satisfy the producer's
explicit request for direct touch/hover control and would leave no recovery
path when passive prediction selects the wrong reel.

## Low-cost falsification experiment

Without changing production markup, prototype three local-only triggers under
the same throttle: current auto path, immediate `play()` on an injected intent
event, and immediate intent plus a targeted metadata request begun from the
Screening Strip. Measure request start, response start, `playing`, bytes before
interaction, and Hero LCP across three cold runs. If intent removes only the
hold while response queuing remains dominant, the passive post-Hero warm is
necessary; if targeted warm regresses Hero, keep it gesture-only.

## Test and measurement contract

- RED tests: hover/focus and preview-button touch outrank the hold; only one
  reel owns playback; official link remains one-tap outside the preview
  control; touch scrolling never opens a link; second preview tap behavior is
  defined; lifecycle/error/stale-promise cancellation still wins.
- Reduced motion: no play, preload, or new active control behavior.
- Save-Data/2G: no passive warm; an explicit user preview may load only the
  selected reel and must be documented as user-requested transfer.
- no-JavaScript: poster and official link remain fully usable.
- Geometry: bilingual desktop/mobile screenshots and bounding boxes match the
  baseline; Figma export is byte-identical.
- Performance: at least three cache-disabled mobile runs per side, same DPR,
  latency, throughput, target card, and navigation path; report medians for
  intent-to-request, response, `playing`, video bytes, Hero LCP, TBT, and CLS.

## P0/P1 risks

- P0: invalid/nested interactive markup or making the official destination
  unreachable; Hero LCP regression from early passive media transfer; multiple
  reels playing; reduced-motion transfer/play regression.
- P1: touch-scroll accidental activation, inaccessible control naming/focus,
  Save-Data policy ambiguity for explicit intent, or a visual shift from the
  wrapper refactor.
