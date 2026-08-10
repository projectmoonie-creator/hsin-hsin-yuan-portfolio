# Featured Reel Intent Playback — Frozen Brainstorm Packet

Date: 2026-08-11  
Role: independent mechanism brainstorming only; do not edit the repository  
Baseline branch: `codex/featured-reel-intent-playback`  
Baseline commit: `6b7ffdd4da038512bae7b210832015539c92817b`

## Producer report and desired outcome

The producer confirms that the Tech Dreamers Screening Strip card now jumps to
its matching large Featured card. On a phone, however, the large-card video
preview currently feels slower than it did earlier in the day. The producer
wants an additional high-intent path: desktop hover and a light mobile touch
should be able to start a large-card muted preview, alongside the existing 35%
visibility plus dwell behavior. The interaction should feel as immediate as
high-throughput video-preview sites without turning this portfolio into a
video application.

## Current product and code facts

- The Screening Strip navigation repair changed its small-card target and
  related data/tests only. It did not change `src/main.js`, `src/styles.css`,
  Featured video files, sources, timing, or playback logic.
- Each approved large Featured reel is a pointer-transparent, muted, looping,
  inline `<video preload="none">` inside the large media surface.
- Large media surfaces with public destinations are anchors that open the
  canonical official destination in a new tab. The video is non-interactive;
  the wrapper owns navigation.
- Automatic eligibility begins at 35% visibility. Mobile selects the nearest
  eligible reel and waits 700ms; desktop uses its existing ownership rule and
  waits 1400ms. The poster remains until `playing`.
- Only one Featured reel owns playback. Exit, visibility loss, error,
  current-play rejection, pagehide, and ownership changes reset safely.
- Reduced motion and no JavaScript remain static. Detectable Save-Data,
  slow-2G, and 2G skip proactive warm-up.
- The current mobile delivery uses a source-verified 960x540 silent H.264
  BT.709 faststart derivative before a 1280x720 fallback. For Slow Steps the
  mobile file is 2,293,379 bytes versus the prior 7,427,742-byte source. Both
  have an initial keyframe at time zero; the mobile initial I-frame is smaller.
- Existing passive warm-up starts only after the complete window `load` event,
  then waits 180ms and changes one nearby mobile candidate to metadata preload.
  It does not start during the useful early cold-load interval reproduced here.
- The small Screening Strip cards now have a canonical internal target, so a
  pointer/touch on one can identify the exact forthcoming large-card reel.

## Reproduced performance evidence

Matched synthetic conditions: local range-capable server, Chromium mobile
emulation at 390x844/DPR3, cache disabled, 150ms latency, 1.6Mbps download,
three cold runs unless explicitly noted.

- Immediate jump to Slow Steps: median `video.play()` call 728.6ms after
  activation; median visible `playing` 6,112.8ms; zero video bytes before the
  jump.
- Waiting 1,500ms before the same jump: median visible `playing` 4,612.8ms;
  still zero video bytes before the jump.
- Waiting 7,000ms before the same jump: median visible `playing` 1,805.7ms;
  still zero video bytes before the jump.
- Therefore the improved later attempt is explained by other page transfers
  settling and connections becoming available, not by the present passive
  warm-up.
- A first matched run of the old Production-sized 7.4MB source did not reach
  `playing` within the probe's 30-second limit. This is one timeout, not a
  median, and must not be used to claim every new build is faster for every
  visitor.
- These are synthetic measurements, not CrUX or real-device guarantees.

## Preserve / change / non-goals

Preserve exactly:

- card geometry, posters, crops, focal points, text, languages, media sources,
  canonical official links, current visual style, and Figma output;
- one-owner arbitration, poster-until-playing, lifecycle cancellation,
  reduced-motion/no-JavaScript static fallback, and safe data/2G behavior;
- the Screening Strip's internal jump behavior.

May change:

- how explicit user intent outranks the 35%/hold fallback;
- when one targeted reel begins loading, if Hero LCP remains protected;
- the current media-wrapper DOM only if necessary to keep link and preview
  semantics valid and visually byte/geometry equivalent.

Non-goals:

- changing the 960x540 encodes, adding HLS, autoplaying multiple videos,
  broad image/CSS optimization, redesigning cards, changing copy or external
  destinations, Contact, Archive reels, deployment, or Production.

## Hard interaction constraints

- A mobile scroll gesture must not accidentally open the official site.
- A preview gesture must not make the official destination unreachable or
  ambiguous.
- Do not place a button inside an anchor or create another invalid nested
  interactive structure.
- Keyboard and assistive-technology users need predictable semantics.
- Desktop hover must have a focus-equivalent path.
- Explicit intent should be able to bypass the decorative hold, but only the
  intended visible/targeted reel may play.
- A second tap, cancellation, rejected play promise, and touch-to-scroll must
  have defined behavior.
- Proactive loading must not regress Hero LCP, TBT, CLS, initial Featured MP4
  request count, or Save-Data/2G safeguards.

## Questions for independent analysis

1. What is the root-cause model for the current cold-start perception, and
   which part can an intent mechanism actually improve?
2. Propose two to four implementable interaction/loading mechanisms. Include
   desktop hover/focus, mobile touch, official-link semantics, scroll safety,
   ownership arbitration, warm-up timing, cancellation, reduced motion, and
   accessibility.
3. Identify the smallest pragmatic option, the strongest long-term option,
   one low-cost experiment, one contrarian interpretation, and one
   unconstrained alternative.
4. Recommend one option and explain why. State what evidence would falsify the
   recommendation.
5. List concrete test contracts and matched before/after measurements.
6. Name any P0/P1 risks. Do not implement or claim producer approval.

Use this response structure:

- Root-cause model
- Options (mechanism, benefits, costs, risks)
- Pragmatic recommendation
- Alternative and unconstrained views
- Low-cost falsification experiment
- Test and measurement contract
- P0/P1 risks
