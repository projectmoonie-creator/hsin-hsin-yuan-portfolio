# Mobile Featured Reel Trigger Design

Date: 2026-08-09
Status: Approved in conversation
Base checkpoint: `d109bbdede94a00b58ae8b0b7de0d1875dd627e4`
Work branch: `codex/three-minute-watch-link`

## Goal

Make Featured preview reels reliably start during normal mobile scrolling while
preserving the portfolio's poster-first treatment, one-video ownership, and
static accessibility fallbacks.

## Observed cause

Featured reels currently become eligible at 35% visibility, wait 1.4 seconds,
and give playback to the last eligible reel in DOM order. At `390 × 844`, two
adjacent reels can both qualify, so the later card may play while the card a
visitor is actually reading stays static. Normal scrolling can also leave each
card eligible for less than 1.4 seconds, resulting in no playback at all.

## Approved behavior

- Keep the existing 35% eligibility threshold and poster-until-`playing`
  transition.
- At `820px` and below, the eligible Featured reel nearest the viewport center
  is the sole active reel.
- Re-evaluate that nearest-center owner during scrolling and resizing, even
  when no IntersectionObserver threshold changes.
- On mobile, hold the active poster for `700ms` before requesting playback.
- Above `820px`, preserve the current last-eligible-in-DOM-order selection and
  `1400ms` hold.
- Archive retains its current nearest-center selection and `1400ms` hold.
- Reduced-motion and no-JavaScript states remain static posters and must not
  request video playback.
- Preserve videos, posters, copy, links, card geometry, colors, type, spacing,
  and all other motion.

## Maintainable mechanism

The existing Archive selection module becomes a neutral reel-selection module
in place: it exports a generic nearest-center selector and retains the existing
Archive-named export as a backward-compatible alias. Featured and Archive both
consume the shared geometry rule so the center-distance calculation cannot
drift into two implementations.

`src/main.js` owns only policy:

- a `(max-width: 820px)` media query chooses mobile or desktop Featured policy;
- separate named constants own the `700ms` mobile and `1400ms` desktop holds;
- a requestAnimationFrame-throttled viewport listener refreshes ownership;
- the existing generation guards, timer cancellation, error handling,
  visibility reset, and BFCache lifecycle remain authoritative.

Breakpoint changes reset the current Featured activation before reselecting,
so an in-flight desktop timer cannot survive into mobile policy or vice versa.

## Validation contract

- Pure selection tests prove the generic nearest-center rule, stable ties, and
  compatibility alias.
- Runtime tests prove mobile `700ms`, center ownership independent of DOM
  order, scroll handoff without a new intersection event, unchanged desktop
  `1400ms`/DOM-order behavior, cancellation, visibility, errors, and BFCache.
- Structural build tests lock both breakpoint policies and lifecycle wiring.
- Browser QA covers English and Chinese at `390 × 844` and `360 × 800`, plus
  desktop, reduced-motion, no-JavaScript, console/page errors, and overflow.
- The protected untracked review file remains byte-identical and outside Git.
- This package does not push `main`, create a Preview, or deploy Production.

## Self-review

- The mobile symptom maps directly to two bounded causes: ownership and hold
  duration.
- Mobile and desktop policies are explicit, so the fix cannot silently change
  desktop behavior.
- Geometry is shared without renaming files or broad restructuring.
- All new behavior is testable without changing content or layout.
- No deployment authority is implied by the implementation approval.
