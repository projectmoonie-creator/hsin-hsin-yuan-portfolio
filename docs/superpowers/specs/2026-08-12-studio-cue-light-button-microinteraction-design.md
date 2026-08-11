# Studio Cue Light And Contact Tally — Lo-fi Design Specification

Date: 2026-08-12 (Asia/Taipei)

Status: `PRODUCER-APPROVED_DIRECTION / IMPLEMENTATION_NOT_AUTHORIZED`

## Purpose

Give the portfolio one restrained, filmmaker-specific opening cue without
reviving the global glow system removed on 2026-07-29. The page should feel as
if a small studio has just brought up its lights: the Hero settles into view,
then two quiet softbox spills appear. The existing Contact indicator answers
with one compact tally-light interaction.

This is a lo-fi specification only. It authorizes no HTML, CSS, JavaScript,
Figma-current-reference, Preview, Production, alias, Contact, or Git-remote
change.

## Baseline And Package Ownership

- Branch: `codex/hero-portrait-refresh`.
- Visual and rollback baseline: Hero portrait F local closeout
  `f0c2f9cd48bad123dedc78e27820fa6c0987d0bc`.
- Closed public checkpoint remains the existing Production-aligned history;
  this proposal does not rewrite its tag or historical closeout reports.
- This docs-only package owns this specification, `STATUS.md`, and the new
  `docs/reviews/LOG.md` entry.
- A later approved implementation may own only `scripts/build-site.mjs`,
  `src/styles.css`, the smallest focused tests under `tests/`, and the normal
  current-state records. It must not touch Hero media, content data, Figma
  exports, reels, Contact delivery, or unrelated layout.

## Direction

Name the interaction family `studio-cue` and its control state
`contact-tally`.

The signature is one orchestrated moment, not scattered decoration:

```text
initial view                 content settled              studio cue
┌────────────────────┐       ┌────────────────────┐       ↘          ↙
│ photo      identity│  →    │ photo      identity│  →    │ quiet soft light │
└────────────────────┘       └────────────────────┘       └──────────────────┘

Contact rest:  [ • CONTACT ]
Contact intent:[ ━ CONTACT ]
```

The visual risk is the lights-on metaphor. Everything around it stays quiet.

## Preserved Visual System

- Typography, type scale, weights, capitalization, and line ownership remain
  unchanged.
- Keep the existing palette: stage black `#0b0b0c`, ink `#f7f2e8`, muted ink,
  and acid `#d8ff3e`. Add no blue, rainbow, heat, or second accent.
- Keep all existing Hero geometry, portrait crop, gradient image treatment,
  spacing, section order, breakpoints, pill shapes, and Contact wording.
- Keep the 18-second transform-only Hero portrait slow push and its static
  reduced-motion fallback.
- Current Figma exports remain the static starting state. Runtime timing does
  not create a second hand-authored Figma truth.

## Hero Entrance Choreography

Animate only the first Hero; do not apply a new stagger to every page section
or card. Existing non-Hero behavior is outside this package.

A later implementation replaces the current `.hero-content` `700ms` / `18px`
broad rise only for the Hero anatomy below. The other selectors that currently
share `rise` retain their existing behavior.

Use three beats on the first eligible view in a browser tab:

| Beat | Anatomy | Delay | Duration | Motion |
| --- | --- | ---: | ---: | --- |
| 1 | Hero portrait frame | `0ms` | `320ms` | opacity to 1; `translateY(8px)` to 0 |
| 2 | eyebrow plus name | `60ms` | `320ms` | opacity to 1; `translateY(8px)` to 0 |
| 3 | roles plus subcopy | `120ms` | `320ms` | opacity to 1; `translateY(8px)` to 0 |

- The full content entrance ends by `440ms`.
- Use one restrained ease-out curve; no spring, overshoot, scale, blur, or
  letter-by-letter animation.
- Essential content is visible by default. Animation is progressive
  enhancement and must never be the mechanism that makes content available.
- Hero links and navigation remain interactive throughout; the choreography
  cannot delay input readiness.

## Softbox Light Cue

- Start the light fade `500ms` after the final content beat ends: `940ms` from
  the entrance start.
- Fade to the resting light state over `480ms`, completing by `1420ms`.
- Render both desktop lights as two static gradients within one Hero-bounded
  `::before` pseudo-element. Animate only the element's opacity; do not replace
  or mutate the existing `.hero::after` bottom fade.
- The lights enter from the upper-left and upper-right corners and read as
  neutral softbox spill, not neon beams. Use warm ink at no more than `0.07`
  alpha, with an optional acid fringe no stronger than `0.02`.
- The light layer remains behind Hero media and copy, is pointer-transparent,
  and cannot change layout, crop, foreground color, or hit targets.
- The resting state is quiet and static. There is no loop, sweep, drift,
  flicker, cursor response, scroll response, or section tracking.
- Use no `filter: blur()`, `mix-blend-mode`, fixed full-page layer, Canvas,
  WebGL, anime.js, OGL, new asset, or new dependency.

## Responsive And Fallback Rules

### Desktop and tablet

- Above `820px`, keep the paired upper-corner softbox composition.
- At the existing stacked Hero breakpoint, the cue may occupy the full Hero
  frame but must remain behind both the image and text blocks.
- The light cannot create a visible seam at the existing bottom Hero fade.

### Mobile

- At `820px` and below, reduce the cue to one neutral upper-left spill with no
  acid fringe and maximum `0.045` alpha.
- Keep the same three entrance beats and timing; do not add extra delay for
  mobile.
- Coarse-pointer devices receive no hover-dependent light behavior.

### Reduced motion, no JavaScript, and repeat visits

- `prefers-reduced-motion: reduce`: show the complete Hero immediately; show no
  light entrance; keep the existing static portrait.
- No JavaScript or failed bootstrap: show the complete Hero immediately with
  no light cue. Navigation, content, image priority, and Contact remain normal.
- Play the sequence only once per browser tab. Reload, language switch,
  same-document anchor navigation, and BFCache return do not replay it.
- If the one-time state cannot be read or written safely, fail open to the
  complete static Hero rather than hiding content or replaying indefinitely.

## Contact Tally Microinteraction

Apply `contact-tally` only to the existing header Contact pill. Work actions,
media actions, language switching, and the Contact form submit retain their
current states.

- Rest: preserve the existing acid circular indicator, border, type, padding,
  and background.
- Desktop pointer hover and keyboard focus-visible: stretch the indicator
  horizontally from its existing dot into a short `12–14px` tally mark over
  `160ms`; return over `180ms` on exit.
- Animate only `transform` and, if needed, opacity. Do not add glow, shadow,
  moving gradient, label displacement, or button-width change.
- Keep the existing `2px` acid keyboard outline with `3px` offset. The tally
  never substitutes for visible focus.
- On coarse-pointer mobile, do not retain a sticky hover state. A tap follows
  the existing Contact anchor immediately.
- Under reduced motion, switch between dot and tally without interpolation;
  the focus outline remains unchanged.

## Explicit Retired Fingerprints

The following remain forbidden and must stay protected by negative tests:

- `.light-beam-layer`, `.light-beam`, `.ambient-canvas`, global `body::before`
  lighting, and fixed full-viewport overlays;
- `.edge-glow-card`, `.edge-light`, cursor-angle or edge-proximity tracking;
- `is-lit`, `is-guided`, scroll-selected section lighting, pointermove-driven
  glow, section reflections, and Hero-frame reflection sweeps;
- blue-and-acid beams, blurred halos, card shadows marketed as light, and
  infinite ambient animation;
- external animation or graphics libraries added for this package.

The new cue must use distinct `studio-cue` naming and cannot pass by reviving
or renaming the removed mechanism.

## Progressive Enhancement Contract

A later implementation may add one tiny head bootstrap that opts the document
into `studio-cue` only when all of these are true: JavaScript runs, reduced
motion is not requested, and the sequence has not played in the current tab.
The default document state remains fully rendered and visible.

- The bootstrap may use guarded `sessionStorage`; failure produces the static
  default.
- It must run before any animation class can hide content, so there is no
  visible flash from complete → hidden → complete.
- It adds no listener for scroll, resize, pointer movement, or animation
  frames.
- The stylesheet owns all choreography after the one-time opt-in class exists.

If a flash-free opt-in cannot be demonstrated at implementation time, omit the
Hero entrance and ship neither a delayed hide nor a partially hidden fallback.

## Performance And Accessibility Budgets

- Zero additional network requests, media bytes, font bytes, dependencies, or
  runtime assets.
- Do not change Hero preload, `fetchpriority`, responsive candidates, intrinsic
  dimensions, alt text, or LCP discovery.
- Animation work is limited to opacity and transform on bounded elements; no
  animated background position, size, filter, or paint-heavy fixed layer.
- Preserve zero horizontal overflow, keyboard order, Contact visibility, and
  bilingual readability at all current breakpoints.
- Light resting opacity must pass visual contrast review against both English
  and Chinese Hero copy and must not wash out portrait F.
- The sequence must not create an avoidable long task or a matched-condition
  Hero LCP regression beyond normal run variance.

## Required Validation For Any Later Implementation

1. TDD first: prove the current build lacks `studio-cue` and `contact-tally`,
   then add the smallest contracts for timing, progressive enhancement, and
   retired-fingerprint absence.
2. Run the full test suite, build, design-contract audit, Figma export parity,
   Hero delivery check, reel integrity check, privacy scan, protected-file
   hash check, and `git diff --check`.
3. Browser matrix: English and Chinese at `1440×900`, `1200×900`, `834×1112`,
   `390×844`, and `360×800`; include reduced motion, no JavaScript, keyboard,
   coarse pointer, BFCache, language switch, reload, and anchor navigation.
4. Capture matched cue phases at approximately `0ms`, `440ms`, `940ms`, and
   `1420ms`. Verify geometry is identical throughout and the light never
   crosses foreground stacking or hit targets.
5. Verify first-view-only behavior in one tab and normal cue eligibility in a
   fresh tab. Storage failure must remain static and complete.
6. Record zero extra requests, unchanged responsive Hero AVIF selection and
   high-priority preload, no console/page/request errors, and zero Contact
   submission during QA.
7. Visually inspect focus visibility, copy contrast, portrait skin tone, and
   the mobile one-light reduction. Automated CSS presence alone is not visual
   approval.

## Approval, Timebox, And Rollback

- Producer review of this written specification is the current gate.
- Written-spec approval permits an implementation plan, not implementation.
- Any later implementation requires a separate producer authorization and is
  limited to 90 minutes of active work under the Bible's lo-fi-first rule.
- A completed bounded package may receive one standing-authorized static
  `dist/`-only Preview only after all safety gates pass. This spec itself does
  not trigger that authorization because it changes no public output.
- Without final producer acceptance at the timebox boundary, keep the result
  isolated or restore only the future implementation-owned paths to baseline
  `f0c2f9c`; never touch the protected document or unrelated Hero work.
- Git push, `main`, Production, alias, Contact/functions, and destructive
  external actions remain separately prohibited without explicit approval.

## Exact Next Action

Producer reviews this specification. If approved, write a bounded
implementation plan; do not edit the active interface or deploy anything until
the producer separately authorizes implementation.
