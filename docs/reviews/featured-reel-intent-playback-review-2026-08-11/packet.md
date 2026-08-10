# Featured Reel Intent Playback — Read-only Review Packet

Date: 2026-08-11

## Role and boundary

Act only as an independent reviewer. Do not edit files, run deployments,
submit Contact, push, merge, or propose unrelated redesign. Review the current
uncommitted bounded package on branch `codex/featured-reel-intent-playback`
from baseline `6b7ffdd4da038512bae7b210832015539c92817b`.

## Objective

Preserve the approved Featured card visuals and passive 35% plus 700ms mobile
/ 1400ms desktop behavior while adding explicit preview intent:

- desktop panel hover and keyboard focus request the one intended preview
  immediately;
- on mobile linked media, the first stationary tap previews and suppresses
  only that navigation, while a second tap opens the canonical official URL;
- a touch movement must not start playback or accidentally navigate;
- Screening Strip pointerdown/click primes its exact matching Featured reel,
  keeps the internal jump, and bypasses the passive hold on arrival;
- after the canonical Hero image has loaded, mobile may metadata-warm only one
  nearby candidate within a two-viewport margin, excluding reduced motion,
  no-JavaScript, Save-Data, slow-2G, 2G, desktop, hidden pages, and concurrent
  active playback;
- a late initial `pageshow` must not yank the page to the top after scroll,
  pointer, or keyboard navigation;
- if an explicit mobile preview rejects or errors, the next tap must still
  reach the official destination.

## Target files

- `src/main.js`
- `tests/featured-reel-runtime.test.mjs`
- `tests/build-site.test.mjs`
- `docs/reviews/evidence/featured-reel-intent-playback/probe.py`
- `docs/reviews/evidence/featured-reel-intent-playback/qa.py`
- machine JSON evidence in the same evidence directory

## Preserve / non-goals

- No HTML/CSS geometry, poster, crop, copy, language, URL, canonical data,
  Figma, Contact, Archive, encoding, HLS, UI decoration, or media-file change.
- Keep one-owner arbitration, poster-until-`playing`, current-generation
  rejection guards, lifecycle reset, reduced-motion/no-JS static behavior,
  verified 960x540 mobile sources, and 720p fallback.
- No Preview, Production, deployment, alias, `main`, push, or protected-file
  action.

## Current validation evidence

- Test-driven checkpoints reproduced failure before every controller change;
  the focused runtime suite currently passes 19/19.
- Local browser QA passes 9/9: first/second linked tap, touch movement,
  exact Tech Dreamers Screening target, desktop hover/focus, automatic
  35%+700ms (observed 709.5ms), reduced motion, Save-Data, 2G, and no-JS.
  There are no console/page errors or Contact POSTs.
- Matched cold Chromium mobile conditions are 390x844 DPR3, disabled cache,
  150ms RTT, 1.6Mbps down, three runs with medians. Slow Steps immediate
  direct tap requests playback in 2.9ms but becomes visible in 5905.7ms.
  With 1500ms at the page top, the one-candidate warm starts roughly 1403ms
  before the tap and visible playback is 4389.9ms, versus the 6049.8ms
  baseline (about 1660ms improvement). TBT and CLS remain zero.
- Passive warm requests begin around 1.71s, after the measured Hero LCP around
  1.22s. Passive LCP median is 1216ms versus a 1172ms baseline with overlapping
  individual runs; because the MP4 request begins after the LCP timestamp,
  no causal Hero contention is observed. This is lab evidence, not CrUX.
- Exact Tech Dreamers Screening action requests only its mobile reel and
  reaches `playing` in all three throttled runs (median 6350.1ms). It primes
  immediately but cannot eliminate cold physical bandwidth delay.

## Review dimensions

1. Correctness of one-owner state, explicit intent, pending Screening target,
   warm handoff, and generation/rejection behavior.
2. Mobile gesture and link semantics, including failed preview, second tap,
   scroll movement, and potential timing races around click suppression.
3. Accessibility: hover/focus parity, keyboard behavior, linked media
   reachability, reduced motion, and no-JS fallback.
4. Lifecycle: visibility, mode/connection changes, pagehide/pageshow/BFCache,
   listener duplication, stale timers, and cleanup.
5. Performance interpretation: whether the evidence supports keeping the
   one-candidate post-Hero warm without claiming more than it proves.
6. Scope, privacy, Contact, canonical-data, Figma, and deployment boundaries.
7. Missing tests or P0/P1 regressions. Style-only opinions are P2 at most.

## Required response

Return one of `PASS` or `FINDINGS`, followed by a compact list. Every finding
must include severity (`P0`, `P1`, or `P2`), exact current file and line,
reproduction/state sequence, user impact, and smallest safe remediation.
State explicitly when there are no P0/P1 findings. Do not treat lab evidence
as real-user or CrUX proof, and do not make edits.
