# Featured Reel Mobile Performance — Brainstorm Synthesis

Date: 2026-08-10

Frozen packet SHA-256: `92256abbbd00c9c95639fad0b0d9ec007f8e1102bb7aad23dc3c52e1320bf9d1`

## Consensus

- Reject page-load metadata for all reels and reject full-video preload.
- The approved 700ms hold is not the main cold-start delay.
- Existing 1.44–2.61Mbps 720p files are too costly for the tested 1.6Mbps link;
  five of six exceed the available downlink before other page traffic.
- Preserve one-active-reel ownership, posters, `playing` reveal, reduced motion,
  no-JavaScript, desktop, Archive, copy, layout, navigation, and Contact.
- Any warming must begin after Hero's critical window, target one reel, unwind
  safely, respect data-saving conditions where detectable, and retain the
  current cold fallback.
- Real Mobile Safari remains a required validation target; Chromium lab data is
  not a universal visitor claim.

## Complementary ideas

- Codex and Gemini prioritize a mobile-only single-reel metadata warm-ahead,
  with mobile derivatives as the next transfer/stall stage.
- Claude prioritizes canonical mobile derivatives first, then a byte-capped
  warm-ahead only if derivatives miss the startup target.
- Together they separate two problems: derivative size/bitrate determines
  sustained feasibility; warm-ahead determines whether startup cost is visible
  after a card becomes eligible.

## Provider-unique ideas

- Claude proposed a 128KiB `Range` fetch for an enforceable byte ceiling, but
  also identified unproven fetch-to-video cache reuse in WebKit.
- Gemini proposed a 200px proximity margin and treated mobile derivatives as a
  mandatory second phase under the synthetic 1.6Mbps profile.
- Codex proposed generation-safe warm ownership and a conservative no-warm
  fallback where device/network signals make warming unsafe.

## Contradictions and local adjudication

Claude correctly challenged the original table's coordinate system: the
six-second lead hides work before eligibility but does not make the network
request six seconds faster. A new no-video control waited six seconds before
scrolling and then measured three cold runs:

| Case | Median `play()` after eligibility | Median `playing` after eligibility |
| --- | ---: | ---: |
| Immediate current baseline | 724.8ms | 7535.2ms |
| Six-second page wait, no video request | 729.7ms | 2244.5ms |
| Six-second single-reel metadata warm | 727.2ms | 727.8ms |

Therefore initial page contention explains about 5.29 seconds of the immediate
baseline, while a completed single-reel warm still hides about 1.52 seconds
after the card becomes visible. Warm-ahead is useful but is not the primary
bandwidth fix.

A temporary, uncommitted Slow Steps derivative made from the current runtime
file at 640×360 / ~446Kbps reduced 7,427,742 bytes to 1,672,731 bytes (-77.5%).
Under the same local Range server and throttle, three current-policy runs
started in a 5641.3ms median instead of the ~7.35–7.54 second current baseline.
It materially helps but does not reach the 700ms visual contract alone. This is
an architectural spike, not an approved recipe or visual-equivalence result.

The ten-second 720p warm-arm observation emitted repeated `waiting` events
almost immediately under 1.6Mbps. The browser/site lifecycle later reset the
video, so this is evidence of insufficient initial/sustained buffer under that
synthetic profile, not a complete ten-second stall-duration measurement.

## Experiments still required for implementation

1. Test-first canonical mobile-derivative recipe and manifest integrity.
2. Compare at least two mobile profiles for visual equivalence at 390px CSS
   width and DPR 2/3; choose resolution/bitrate by evidence, not the 640px spike.
3. Three cold runs per side measuring eligibility-relative and
   navigation-relative first frame, first ten seconds' `waiting` count/duration,
   bytes, Hero LCP, TBT, and CLS.
4. If warm-ahead is retained, compare `metadata` against a bounded Range fetch
   and prove whether Mobile Safari reuses the warmed bytes.
5. Real-device iPhone/Safari cold and warm checks, including Low Power Mode and
   rapid scroll ownership changes.

## Risks

- All-reel preload can consume hundreds of KiB or more inside Hero's window.
- `preload="metadata"` is a browser hint, not a byte contract.
- A manual Range fetch may duplicate the video's own fetch, especially WebKit.
- Fast scrolling can create request churn without generation safety,
  concurrency one, cancellation, and a session budget.
- Smaller files can soften artwork on high-DPR phones unless visual equivalence
  is verified.
- My Art, My Voice remains 100 seconds; a shorter edit is a separate editorial
  decision and is not inferred here.

## Options

### Option A — Mobile derivatives only

Build reproducible responsive H.264 derivatives from canonical media data and
keep `preload="none"`. Lowest runtime risk and best data/stall improvement, but
the spike shows cold first frame can still remain around five to six seconds
when the user reaches Featured quickly.

### Option B — Two-stage delivery plus bounded warm-ahead (recommended)

First add canonical mobile derivatives and validate visual/data/stall results.
Then add a post-Hero, mobile-only, single-reel proximity warm only because the
measured derivative still misses the visible startup target. Keep the 720p
master as desktop/fallback. This addresses both sustained bandwidth and the
remaining visible startup cost, with a gate between the two stages.

### Option C — Warm-ahead only

Fastest code change and can make the first frame land after the 700ms hold when
enough lead exists, but leaves 2.4–32.7MB payloads and above-link bitrates. It
can produce start-then-stall behavior and is not recommended as the final fix.

### Rejected — all-reel metadata or full-video preload

No evidence justifies starting six metadata requests at page load or fetching
entire 2.4–32.7MB videos before intent. Both violate the Hero/data boundary.

## Recommendation

Producer chooses Option B. Treat it as one bounded branch with two explicit
gates: derivatives first; warm-ahead second only after matched measurements
confirm the residual delay. Do not change Production, `main`, Preview, Contact,
copy, lighting, desktop, or Archive in this package.

## Provider status

- Codex: completed locally before external outputs were read.
- Gemini: requested/observed/completed `gemini-3.6-flash`; 1,394 input, 1,951
  output, 6,151 total tokens.
- Claude: requested dynamic `opus`, observed/completed `claude-opus-5` with
  `claude-haiku-4-5-20251001` auxiliary routing; subscription lane completed.
  Reported `apiEquivalentCostUsd` is `0.673282`; actual spend is not claimed.
