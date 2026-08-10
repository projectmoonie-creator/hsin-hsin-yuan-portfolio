# Frozen Brainstorm Packet — Featured Reel Mobile Startup

Date: 2026-08-10

## Decision and owner

The producer must choose the next bounded implementation for mobile Featured
reel startup. The immediate question is whether any video should be downloaded
before its approved 700ms playback trigger, and if so, how much and when.

Do not edit the project. Return independent analysis only.

## Why this decision is needed now

The producer observed that a program trailer on the public mobile site took a
long time to appear, while playback became normal after waiting. The current
Hero LCP package does not change Featured reels and is not on Production.

## Current mechanism

- Six Featured reels use muted inline H.264 MP4 files.
- Every video renders with `preload="none"`.
- At 820px and below, a reel becomes eligible at 35% visibility. Only the
  eligible reel nearest the viewport center owns playback.
- The poster holds for 700ms. Only then does JavaScript call `video.play()`.
- The video remains transparent until the real `playing` event.
- Leaving eligibility resets playback to time zero and restores the poster.
- Reduced-motion and no-JavaScript states are static and make no MP4 request.
- Desktop keeps a 1400ms hold; Archive uses a separate approved policy.

## Reproduced evidence

The public `/en/` page was measured with fresh Chromium 148 contexts at
390×844, cache disabled, 150ms latency, 1.6Mbps download, and 750Kbps upload.
Each comparison uses the first Featured reel (Slow Steps) and three cold runs.

| Strategy | Lead before eligibility | Median play() call | Median playing event |
| --- | ---: | ---: | ---: |
| Current `preload=none` | 0ms | 724.8ms | 7535.2ms |
| Single-reel `metadata` + `load()` | 1200ms | 731.1ms | 6232.5ms |
| Single-reel `auto` + `load()` | 1200ms | 727.7ms | 6192.7ms |
| Single-reel `metadata` + `load()` | 6000ms | 727.2ms | 727.8ms |

The six-second metadata experiment transferred about 117,072 bytes before
eligibility and then played immediately after the existing hold. `auto` did
not materially outperform `metadata` at the same lead time. These are lab
results, not CrUX and not a claim about every visitor or Mobile Safari.

All checked MP4s are fast-start: `ftyp` then `moov` at byte 36, before `mdat`.
Vercel serves exact byte ranges, showed a cache HIT during the check, and began
a 64KiB range in about 97ms. The evidence does not support a broken CDN or a
trailing `moov` atom as the root cause.

Featured reel payloads:

| Reel | Duration | Bytes | Approx. bitrate |
| --- | ---: | ---: | ---: |
| Slow Steps | 30.03s | 7,427,742 | 1.98Mbps |
| Tech Dreamers | 30.03s | 6,441,958 | 1.72Mbps |
| My Art, My Voice | 100.03s | 32,662,721 | 2.61Mbps |
| Design & Brand Films | 14s | 2,527,829 | 1.44Mbps |
| Nothing by Bus | 10s | 2,424,055 | 1.94Mbps |
| Top Gear China | 29.96s | 8,651,457 | 2.31Mbps |

## Working hypothesis

The cold delay is primarily caused by waiting until `play()` to request the
first decodable media bytes while other page traffic is still contending for a
mobile connection. A bounded lead can hide this startup cost. Downloading all
or all of any full MP4 is not shown to be necessary and may compete with Hero
LCP or waste mobile data.

## Constraints

- Preserve the approved posters, crop, card geometry, 700ms mobile hold,
  poster-to-video transition, active-reel ownership, navigation, copy, and
  bilingual output unless the producer later chooses otherwise.
- Do not regress Hero LCP or begin competing video traffic during its critical
  request window.
- Reduced-motion, no-JavaScript, data-saver, and slow-network behavior must
  remain usable and conservative.
- At most one mobile Featured reel may actively play. Any warm-ahead behavior
  needs an explicit concurrency and byte policy.
- A mobile derivative, if proposed, must come from a reproducible prepare/build
  mechanism and the existing canonical media manifest; no hand-made second
  truth.
- No change to Archive, desktop, Contact, lighting, copy, third-party hosting,
  Production, aliases, `main`, or deployment in this decision.
- Implementation must be test-first and must prove matched visual behavior,
  lower cold startup median over at least three runs, bounded transfer before
  eligibility, and no Hero/TBT/CLS regression.

## Requested independent response schema

Return exactly these sections with concrete tradeoffs and falsifiable tests:

1. `problem_reframe`
2. `pragmatic_path`
3. `alternative_architecture`
4. `low_cost_experiment`
5. `contrarian_challenge`
6. `unconstrained_possibility`
7. `overlooked_risks`
8. `assumptions_to_verify`
9. `recommended_next_decision`

Explicitly state whether page-load `preload="metadata"`, full-video preload,
proximity-based single-reel warm-ahead, mobile derivatives, or no change is
justified by the evidence.
