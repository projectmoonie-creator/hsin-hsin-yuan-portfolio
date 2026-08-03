# Featured Preview Reels And Implicit Work Press — Design

Date: 2026-08-03
Status: approved design awaiting implementation plan
Base checkpoint: `be5ff4fe3d828a85c955764dedf9e0ce1200e0f6`
Work branch: `codex/featured-preview-reels-implicit-press`

## Goal

Add the producer-supplied completed promos for Slow Steps, Tech Dreamers, and
My Art, My Voice as full-length Featured Work preview reels. Preserve the
current covers, card geometry, copy, and link destinations. Make every
Featured reel use one poster-first playback rule. Remove the visible
`PRESS & INTERVIEWS` / `媒體報導與訪談` field label from work cards while
retaining Press classification, per-entry labels, and accessible semantics.

## Approved decisions

- Use the completed promos in full. Do not make a new editorial selection or
  shorten their internal edits.
- Produce silent, web-optimized 720p derivatives; never modify the supplied
  source files.
- All five Featured reels—three new and the existing Design & Brand Films and
  Nothing by Bus reels—hold the current poster for 1.4 seconds before trying
  to play.
- The linked media surface keeps its current destination. Tech Dreamers and
  My Art, My Voice continue to open their existing TaiwanPlus pages. Slow
  Steps currently has no public `watchUrl`, so its media remains non-linked
  until a destination is separately supplied.
- Remove only the visible work-Press group label. Keep each entry's visible
  type, title, source, thumbnail, and destination.
- Do not deploy as part of this package. Preview deployment is a later explicit
  action after local review.

## Source inventory and publishability

The producer supplied and approved these local completed files for portfolio
use. Repository evidence records use filenames and fingerprints only; private
external-storage paths must not be committed.

| Work | Source filename | Duration | Source | SHA-256 |
| --- | --- | ---: | --- | --- |
| Slow Steps | `Slow Steps 30s系列網路平台宣傳片完成檔.mp4` | 30.030 s | 1920×1080, H.264 High, 29.97 fps, BT.709, AAC | `0def72570da58eeb51af84b07d4cd880b666a3b8718702f7236af468b07f55ba` |
| Tech Dreamers | `Promo Tech Dreamers Series 日期版 0705.mp4` | 30.030 s | 1920×1080, H.264 High, 29.97 fps, BT.709, AAC | `5a1eff80776aed305a0144f135ff9d433374f647fe0feca7a2e72ba708beeb0e` |
| My Art, My Voice | `My art  my voice  0214 預告完成檔.mp4` | 100.033267 s | 1920×1080, H.264 High, 29.97 fps, BT.709, AAC | `d7ab1b3c7e4a70b479af7ab28801a9c41993576502aaca87fa7032adef1e1bdd` |

Rights state for each derived reel: `user-supplied-local-source`.

## Media derivative contract

Create these public files:

- `/assets/showreel/slow-steps-card-reel.mp4`
- `/assets/showreel/tech-dreamers-card-reel.mp4`
- `/assets/showreel/my-art-my-voice-card-reel.mp4`

Each derivative must:

- retain the source's complete visual timeline;
- be 1280×720 H.264 with `yuv420p` pixel format and BT.709-compatible output;
- preserve the source frame cadence rather than retiming the edit;
- remove audio (`-an`) because the page reel is decorative, muted motion;
- use quality-based compression with a bounded web bitrate and `faststart`;
- contain no crop, reframe, grade, generated frame, overlay, or added title;
- remain loop-safe at the browser layer even when the source edit has a
  deliberate ending.

Use a deterministic ffmpeg recipe based on `libx264`, 720p scaling,
`-crf 22`, `-maxrate 2.8M`, `-bufsize 5.6M`, `-preset slow`, `-pix_fmt yuv420p`,
explicit BT.709 color-space/primaries/transfer tags, `-movflags +faststart`,
and `-an`. Register each derivative through the local `media-use` ingest path
and review its ledger entry for private-path leakage. Record the exact command
and output fingerprint in the implementation review.

The current poster remains the static and loading state:

- Slow Steps: current Slow Steps collage poster;
- Tech Dreamers: current official series artwork;
- My Art, My Voice: current performance still;
- Design & Brand Films and Nothing by Bus: their current reel posters.

## Canonical work-media contract

The three new work records gain:

- `featuredReelUrl` pointing to the derived local MP4;
- `featuredReelPoster` equal to the work's current poster role;
- `featuredReelMode: "after-hold"`;
- evidence-only source filename, source SHA-256, source duration, source
  dimensions, and reel rights state.

The two existing Featured reel records change only from
`featuredReelMode: "in-view"` to `featuredReelMode: "after-hold"`.

The normalizer and design-contract inventory must classify the new provenance
fields as evidence-only. They must not appear in public markup. The current
media presentation variants, source-artwork title ownership, focal behavior,
and poster fields do not change.

## Playback interaction

Use one Featured reel interaction contract:

1. A card becomes eligible when at least 35% of its reel surface is visible.
2. If several are eligible, only the last visible Featured reel is active.
3. The active reel holds its poster for `1400ms`.
4. After the hold, the browser starts the muted video. The poster remains
   visible until the video emits `playing`; only then does the reel fade in.
5. Leaving the active state clears its timer, pauses it, resets `currentTime`
   to zero, removes the playing class, and restores the poster.
6. Page visibility loss and `pagehide` reset every reel and timer.
7. A failed media load or rejected `play()` leaves the poster intact.

Use `preload="none"` so full-length reels are not downloaded before they are
eligible. Playback remains `muted`, `loop`, `playsinline`, and inaccessible to
pointer events. Reduced-motion and no-JavaScript output remain static posters.

The media wrapper continues to own navigation. A click opens the existing
external destination where one exists; it does not pause, expand, or operate
the decorative preview video. The play-circle remains an external-watch cue,
not a video-player control.

## Implicit work Press group

Keep `press` as an optional structured module inside a Featured Work. Rendering
changes as follows:

- remove the visible `press-preview-title` element and its CSS;
- keep the existing divider, spacing, Press card grid, thumbnails, and framed
  item treatment;
- add a localized accessible group name to the wrapper without visible text;
- retain every visible per-entry type such as `Official page`, `Project press`,
  or `Interview`;
- retain metadata audit attributes and all existing link destinations;
- do not change the separate global `PRESS` section.

The design contract should describe the group label as semantic-only and the
entry type as the visible classification. Figma current-reference output must
not invent or restore a visible work-Press heading.

## Files and ownership

Expected implementation surface:

- `public/assets/showreel/` — three derived videos;
- `content/works/*.md` — five playback modes, three reel roles, and three
  provenance records;
- `scripts/lib/portfolio-contract.mjs` — evidence classification and reel
  validation;
- `scripts/build-site.mjs` — approved reel mode and semantic Press wrapper;
- `src/main.js` — shared hold timers and reset behavior;
- `src/styles.css` — remove the obsolete visible Press-title style only;
- `docs/design-contract.md`, `PROJECT_BIBLE.md`, and `STATUS.md` — current
  interaction and handoff rules;
- `tests/` — data, media, markup, behavior, negative-label, and Figma parity
  coverage.

Do not edit poster assets, work copy, tags, metrics, Press entries, external
URLs, card geometry, responsive breakpoints, or global Press.

## Test-first implementation and validation

Before production changes, add focused failing tests for:

- exact new reel URLs and `after-hold` mode on all five Featured reels;
- current poster identity and external destinations remaining unchanged;
- evidence fields retained by the contract but excluded from public markup;
- the visible work-Press heading being absent in English and Chinese while the
  semantic group name and per-entry types remain;
- one 1400ms Featured timer per active reel, timer cancellation, reset, and
  poster-until-`playing` behavior;
- reduced-motion and no-JavaScript poster fallbacks;
- the three derived files being present, video-only, 1280×720, H.264/yuv420p,
  and full-duration within normal codec tolerance;
- generated Figma references retaining the same posters and no added media or
  work-Press title layer.

Then run:

- focused RED/GREEN tests and the full `npm test` suite;
- `npm run audit:design-contract`;
- `npm run build` and `npm run figma:export`;
- privacy scans proving no private absolute source paths entered tracked files
  or generated output;
- English and Chinese browser QA at 1440×900, 1200×900, 834×1112, 390×844,
  and 360×800;
- reduced-motion, no-JavaScript, keyboard, link-destination, visibility reset,
  poster-hold, one-active-reel, and horizontal-overflow checks;
- matched screenshots proving posters, card geometry, and Press card treatment
  remain unchanged except for the approved heading removal and reel motion.

## Rollback and completion

The rollback checkpoint is `be5ff4fe3d828a85c955764dedf9e0ce1200e0f6`.
The package is incomplete if a poster, link, card geometry, copy block, Press
entry, reduced-motion fallback, or Production deployment changes outside this
spec. A later Preview requires separate user approval after local review.
