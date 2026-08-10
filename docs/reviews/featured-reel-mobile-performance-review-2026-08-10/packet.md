# Frozen Independent Review Packet — Featured Reel Mobile Performance

Date: 2026-08-10

Read-only review. Do not edit files. Do not propose a redesign. Review only the
bounded local package described here and return findings in the requested
schema. Treat all earlier AI opinions as unavailable.

## Objective and boundary

Repository: `hsin-hsin-yuan-portfolio-remove-lights`

Branch: `codex/featured-reel-mobile-performance`

Baseline: `bb08d51d26d6a6c0e57bc6bc86ff8c4516245de3`

Goal: reduce mobile Featured reel first-frame delay and sustained stalls while
preserving posters, crop/focal point, card/text geometry, 700ms mobile and
1400ms desktop holds, reveal on `playing`, navigation, copy, desktop, Archive,
reduced motion, no-JavaScript, Contact, Hero priority, and Figma output.

Not authorized/in scope: Preview, deployment, Production, alias, `main`,
Contact POST, lighting, copy, Archive behavior, third-party media hosting, or
shorter editorial cuts.

## Implementation map

- `data/media-manifest.json`: one `silent-h264-540p-mobile-bt709` profile and
  one `featuredReelDelivery` recipe; individual assets do not store a mobile
  path.
- `scripts/lib/media-manifest.mjs:32-76,88-168`: validates recipe/profile/path,
  encoder numbers, and Featured source-profile ownership.
- `scripts/lib/featured-reel-delivery.mjs:1-215`: derives six output paths,
  hashes source+recipe, probes exact source/output properties, and verifies the
  generated evidence manifest.
- `scripts/prepare-featured-reels.mjs:1-115`: verifies sources, encodes all six
  in a staging directory, moves outputs, writes a generated manifest, then
  re-verifies the complete set. `--check` never encodes.
- `scripts/build-site.mjs:14-23,311-341,848-870`: loads the canonical manifest,
  fails build on derivative drift, and emits a mobile `<source>` before the
  existing 720p fallback inside `<video preload="none">`.
- `src/main.js:215-531`: existing one-active playback remains; new warm state
  begins only after `load`, is mobile-only, proximity/180ms-settle gated,
  concurrency one, and skips Save-Data/slow-2G/2G/reduced-motion/no-JS.
- Tests: `tests/featured-reel-delivery.test.mjs`,
  `tests/media-manifest.test.mjs`, `tests/build-site.test.mjs`, and
  `tests/featured-reel-runtime.test.mjs` cover source truth, delivery integrity,
  responsive HTML, warm ownership, cancellation, network gates, playback,
  error, visibility, and BFCache behavior.

## Canonical recipe

```json
{
  "mobileProfile": "silent-h264-540p-mobile-bt709",
  "directory": "/assets/showreel/mobile",
  "suffix": "-mobile",
  "media": "(max-width: 820px)",
  "encode": {
    "crf": 28,
    "maxRateKbps": 700,
    "bufferKbps": 1400,
    "preset": "slow",
    "keyframeIntervalSeconds": 2,
    "threads": 1
  }
}
```

Profile: H.264 960×540, yuv420p, BT.709, silent, one stream, faststart.
Encoder also removes metadata/chapters/audio/subtitles/data and forces one
keyframe every two seconds.

Generated total: 16,708,502 bytes versus retained fallbacks 60,135,762 bytes
(-72.2%). Two full prepare runs produced identical six file hashes and manifest
hash. Build and `featured-reels:check` fail on source, recipe, path, dimensions,
codec, color, duration, stream count, faststart, size, or hash drift.

## Runtime core excerpt

```js
function canWarmFeaturedReel() {
  const effectiveType = featuredReelConnection?.effectiveType;
  return featuredReelWarmReady
    && featuredReelMobileMedia.matches
    && document.visibilityState === "visible"
    && !featuredReelConnection?.saveData
    && effectiveType !== "slow-2g"
    && effectiveType !== "2g"
    && !(activeFeaturedReel && !activeFeaturedReel.paused);
}

function getFeaturedReelWarmCandidate() {
  if (activeFeaturedReel?.paused && nearbyFeaturedReels.has(activeFeaturedReel)) {
    return activeFeaturedReel;
  }
  return selectClosestVisibleReel(featuredReelVideos, nearbyFeaturedReels,
    { width: window.innerWidth, height: window.innerHeight });
}

function scheduleFeaturedReelWarm() {
  clearFeaturedReelWarmTimer();
  if (!canWarmFeaturedReel() || !nearbyFeaturedReels.size) {
    releaseWarmedFeaturedReel();
    return;
  }
  const candidate = getFeaturedReelWarmCandidate();
  if (!candidate?.paused) {
    releaseWarmedFeaturedReel();
    return;
  }
  if (candidate === warmedFeaturedReel) return;
  releaseWarmedFeaturedReel();
  featuredReelWarmTimer = setTimeout(() => {
    featuredReelWarmTimer = 0;
    if (!canWarmFeaturedReel()
      || getFeaturedReelWarmCandidate() !== candidate
      || !candidate.paused) return;
    candidate.preload = "metadata";
    candidate.load();
    warmedFeaturedReel = candidate;
  }, 180);
}

function playFeaturedReel(video, generation) {
  clearFeaturedReelTimer(video);
  if (!isCurrentFeaturedReelActivation(video, generation) || !video.paused) return;
  featuredReelPlayGenerations.set(video, generation);
  video.muted = true;
  if (warmedFeaturedReel === video) {
    releaseWarmedFeaturedReel({ preserveBuffer: true });
  }
  video.play().catch(() => {
    if (isCurrentFeaturedReelActivation(video, generation)
      && featuredReelPlayGenerations.get(video) === generation) {
      resetFeaturedReel(video);
    }
  });
}
```

Warm observer: `rootMargin: "100% 0px", threshold: 0.01`. Playback observer
remains 35%. `syncActiveFeaturedReel()` calls the unchanged mobile nearest-
center/desktop last-DOM playback selection, resets non-owners, then schedules
warm. Suspend clears timers/sets, releases the warmed preload, resets videos,
disconnects both observers/listeners; persisted `pageshow` rebinds and marks
warm ready. Reduced motion wraps the entire controller, so it creates neither
playback nor warm observers.

Chromium reports expected `net::ERR_ABORTED` range transitions when metadata
loading changes to playback. In the measured proximity arm, 130,500 bytes were
transferred before eligibility, then `playing` followed `play()` by ~1ms; no
unexpected HTTP failures, console/page errors, or stalls occurred. This abort
is recorded, not hidden.

## Validation evidence

- TDD RED observed missing delivery module, ignored recipe validation, one
  source instead of two, and no warm observer; GREEN is now focused and full.
- `npm test`: 155/155.
- `npm run build`; design audit; Figma export; delivery check; diff check: pass.
- Figma export: no tracked diff.
- Six-case English/Chinese desktop/tablet/mobile/reduced-motion/no-JS browser
  matrix: pass; responsive current source, exact video/frame geometry, poster,
  crop, keyboard, overflow, errors, and zero Contact POST checked.
- Static no-JS mobile screenshots before/after are byte-identical at SHA-256
  `636f55e91c6f61e1cd10843c178b7b6e84a648746d5a71e56ee542e20db50df9`.
- Profile gate on Slow Steps: 640/960 VMAF at DPR2 = 88.82/90.03; DPR3 =
  80.42/84.21. 960 selected; original crop/aspect is unchanged.
- Three cold runs per side, 390×844 DPR3, cache disabled, 150ms latency,
  1.6Mbps down: immediate `playing` median 3471→1791ms and ten-second waiting
  4 events/1239ms→0. With 1500ms proximity lead: `playing` 3469→708ms,
  130,500 pre-eligibility bytes, waiting 4/1239ms→0.
- Three Lighthouse 13.4.1 mobile-simulate runs per side: Performance 0.82→0.82,
  LCP 4951.662→4951.728ms, TBT 0→0, CLS 0→0; Hero priority High in all six,
  Featured MP4 requests during initial page load zero in all six.

These are synthetic Chromium lab results, not CrUX or a claim about every
visitor. Real iPhone Safari and Low Power Mode remain open before Production.
Native metadata preload is a hint; 130,500 bytes is observed, not guaranteed.

## Review dimensions

1. Find current P0/P1/P2 correctness risks in source derivation, integrity
   checking, prepare crash consistency, path safety, and build consumption.
2. Find runtime race/concurrency/leak risks across scroll churn, active play,
   visibility, mode changes, errors, regular unload, and BFCache restore.
3. Check whether Save-Data/network/no-JS/reduced-motion/page-load boundaries are
   genuinely upheld, and whether any claim overstates the evidence.
4. Check if tests/evidence miss a falsifier that should block local handoff.
5. Do not require real-device results for local handoff; instead decide whether
   keeping them as a pre-Production open item is proportionate.

## Required output schema

1. `verdict`: `PASS`, `PASS_WITH_FINDINGS`, or `BLOCK`.
2. `findings`: table with `severity` (`P0`/`P1`/`P2`), exact `file:line`,
   evidence, consequence, and smallest fix. No finding without current evidence.
3. `confirmed_invariants`.
4. `claim_corrections`.
5. `residual_pre_production_checks`.

If there are no findings, say so explicitly. Findings only; no file edits.
