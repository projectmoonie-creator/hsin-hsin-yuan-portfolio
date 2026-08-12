# Featured Poster-to-Reel Geometry Design

Status: producer-approved direction on 2026-08-12; implementation pending.

## Goal

Restore the original full-height desktop/tablet poster treatment for Top Gear,
My Art, My Voice, Tech Dreamers, and Slow Steps while keeping their playing
Preview reels at 16:9. Design & Brand Films / Gorgeous Space and Nothing by Bus
remain centered 16:9 in both states. At `820px` and below, all six Featured
Works remain 16:9 in both states.

## Root cause and approved baseline

Commit `09c1d787812d4dc8a4ed825e7719a4e0ec550269` changed exactly the four
named records from `fill-card` to `centered-16x9`. The current renderer derives
one frame geometry from that single desktop variant, so the static poster and
playing video cannot differ. The media files, poster identities, playback
controller, and mobile delivery are not the cause.

The approved correction keeps the panel and copy geometry fixed while making
poster geometry and playing-reel geometry explicit states. It does not restore
a cropped tall video.

## Named presentation variant

Add one supported Featured desktop variant:

`fill-poster-16x9-reel`

It means:

- desktop/tablet static, waiting, reduced-motion, no-JavaScript, rejected,
  errored, and reset states use the full-height `fill-card` poster surface;
- only a current, valid `playing` event changes the media surface to the same
  centered 16:9 geometry already used by the reference pair;
- leaving ownership, leaving eligibility, hiding the page, changing responsive
  mode, `pagehide`, or any playback failure restores the full-height poster;
- at `820px` and below the existing 16:9 mobile rule wins in every state, so
  playing creates no geometry change.

The four records using this variant are:

1. `slow-steps`
2. `tech-dreamers`
3. `my-art-my-voice`
4. `top-gear-china-uk-special`

`interior-spatial-brand-films` and `pts-taigi-bus` retain
`centered-16x9` and must not receive the state-switch class.

## Rendering and state flow

The canonical `presentation.desktopMediaVariant` remains the single source of
truth. The normalizer accepts the new named value. The renderer adds one shared
state-switch class only for that variant; it must not infer behavior from a
slug, poster path, missing field, or reel availability.

The existing Featured controller already validates activation generations and
adds `is-playing` only after the current owner emits `playing`. Extend that
same transition so the owning media frame enters its playing geometry in the
same validated branch. Every existing reset path removes both the video reveal
state and the frame geometry state. Do not create a second controller or a CSS
`:has()` dependency.

On wider screens, the static frame fills its existing media column. In the
playing state it keeps the same width, becomes 16:9, and centers vertically.
The outer `work-panel`, column split, copy position, and scroll-stack geometry
do not change. The current 260ms video opacity reveal remains; no additional
decorative motion or timing is introduced.

## Preserved behavior

- Featured order, bilingual copy, typography, tags, metrics, Press, actions,
  destinations, posters, focal treatment, reel files, and encodes.
- The 700ms mobile and 1.4s desktop passive holds, explicit hover/focus/tap
  intent, one-owner arbitration, Screening Strip priming, warming policy,
  playback generation guards, and 260ms reveal.
- Mobile 16:9 geometry, touch scrolling, first-tap Preview / second-tap
  destination behavior, reduced motion, no JavaScript, BFCache, and failure
  recovery.
- Design & Brand Films / Gorgeous Space and Nothing by Bus geometry in every
  state.
- Archive, Hero, Studio Cue, Contact, public copy, media bytes, media manifest,
  Figma poster content, Production, aliases, `main`, and Git remotes.

## Verification contract

Implementation is test-first.

1. RED contract tests require the four named records to use
   `fill-poster-16x9-reel`, the reference pair to remain `centered-16x9`, and
   unknown variants to fail closed.
2. RED renderer/runtime tests require the shared state-switch class only on
   the four named records, activation only after a valid `playing` event, and
   removal through the existing reset path.
3. Focused GREEN tests prove no slug-specific renderer or CSS selector exists.
4. Full tests, build, design-contract audit, Featured reel integrity, Figma
   export/no-drift, privacy scan, diff check, and protected-file hash pass.
5. Matched English/Chinese browser QA covers desktop, tablet, mobile, reduced
   motion, no JavaScript, hover, focus, stationary tap, touch scroll, playback
   rejection/error, ownership handoff, Screening Strip jump, reset, overflow,
   console/page errors, and zero Contact submission.
6. Geometry evidence proves on desktop/tablet that the four static posters fill
   their media columns, their current playing videos are 16:9 and centered, the
   reference pair remains 16:9, and every outer panel stays fixed. On mobile,
   all six are 16:9 before and during playback.

## Completion and deployment boundary

This is a bounded remediation of the current Studio Cue Preview. After local
gates and independent review pass, one fresh static `dist/`-only Preview is
standing-authorized. Its handoff must proactively use a new Shareable Link,
which stays outside Git; replacing the Hobby account's sole link requires no
additional question and revokes the prior link.

No Git push, `main`, Production, alias, Contact/function, tag, protected-file,
or destructive Vercel action is authorized. Producer inspection of the new
Shareable Preview remains required before any Production decision.

## Rollback

Revert the bounded implementation and documentation commits. That restores the
current all-six centered-16x9 desktop behavior without changing media assets,
copy, or deployment state.
