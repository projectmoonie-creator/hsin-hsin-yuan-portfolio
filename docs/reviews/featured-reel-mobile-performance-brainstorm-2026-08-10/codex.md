# Codex Independent Brainstorm

## problem_reframe

The defect is not that the approved 700ms poster hold is too long. The browser
waits until that hold expires before it requests any MP4 bytes, so the first
frame inherits the full cold media startup cost. The decision is how to move a
small, low-priority portion of that request earlier without turning six
decorative previews into competing page-load downloads.

## pragmatic_path

Add one mobile-only warm-ahead state before the existing active/play state.
After the Hero's critical load has settled, observe Featured media surfaces
with a positive vertical root margin. Select only the nearest upcoming reel,
set that video to `preload="metadata"`, and call `load()`. Keep the existing
35% active ownership, 700ms hold, `playing` reveal, cancellation, and fallback
logic unchanged. Disable warming for reduced motion, Save-Data, and likely 2G;
cap warm concurrency at one and record a maximum observed pre-eligibility byte
budget. The cold fallback remains current behavior if warming has not finished.

## alternative_architecture

Generate canonical mobile derivatives, for example 640×360 H.264 at a tested
lower bitrate, and emit mobile/desktop `<source media>` choices from the media
manifest. This attacks sustained transfer and buffering as well as startup,
especially for the 32.7MB/100s reel. It is more durable but larger in scope:
encoder recipes, source hashes, derivative integrity, browser source
selection, Figma/site parity rules, and visual comparison all need gates. It
can later be combined with the same single-reel warm-ahead policy.

## low_cost_experiment

Prototype the warm-ahead state without changing checked-in media. Compare
current behavior against one-reel metadata warming at two root margins under
the existing mobile throttle. Three fresh runs per variant must record Hero
completion, warm request start, bytes before 35% eligibility, `play()` time,
`playing` time, and any stalled/waiting event. Reject a variant if it begins
before Hero settles, warms more than one reel, exceeds a declared byte cap, or
does not materially lower the median cold first frame.

## contrarian_challenge

Do not ship based only on a throttled Chromium proxy. The observation could be
a one-time cold browser/CDN condition, and the current design intentionally
protects mobile data. Capture three real-device cold runs on the producer's
target phone. If median first frame is already close to the 700ms contract and
only one outlier is slow, retain `preload="none"` and document the outlier
instead of adding background transfer.

## unconstrained_possibility

Replace passive MP4 previews with a tiny, purpose-built moving-preview format
or sequence per work, each 3–6 seconds and under a strict byte budget, while
the full program destination remains separate. This would make preview motion
a designed asset class rather than repurposed 10–100 second trailers. It would
require editorial approval and is outside the minimal package.

## overlooked_risks

- Mobile Safari may interpret preload hints differently from Chromium.
- A root-margin observer can oscillate during fast scroll unless warm ownership
  is generation-safe like playback ownership.
- Calling `load()` can cancel existing fetch/play promises and interact with
  the current reset and BFCache lifecycle.
- `preload="metadata"` is a hint, not a byte guarantee; measurement needs a
  budget assertion rather than assuming 117KB everywhere.
- Page-load metadata on all six videos could compete with Hero and remote
  posters, while `auto` may download much more than startup needs.
- Network Information APIs are incomplete on Safari, so unsupported browsers
  need the conservative no-warm fallback.

## assumptions_to_verify

- Warming one video six seconds ahead remains sufficient on target Mobile
  Safari and does not trigger autoplay-policy differences.
- The first Featured card is normally at least one reading interval below the
  Hero, giving a safe post-Hero warm window.
- The current reset code can preserve a completed metadata buffer without
  violating pause/seek/poster behavior.
- A 117KB-style initial range is representative across all six MP4s.
- Visual output is identical because the video still becomes visible only on
  `playing` after the 700ms minimum.

## recommended_next_decision

Choose a test-first, mobile-only, single-reel proximity warm-ahead experiment
using `metadata`, guarded until after Hero and disabled for reduced motion and
data-saving conditions. Explicitly reject page-load metadata for all reels and
full-video preload. Keep mobile derivatives as a separately measured second
stage if warm-ahead fixes first-frame delay but sustained transfer or stalling
remains unacceptable.
