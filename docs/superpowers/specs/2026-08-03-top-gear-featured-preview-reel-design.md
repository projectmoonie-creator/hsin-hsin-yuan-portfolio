# Top Gear China Featured Preview Reel Design

Date: 2026-08-03

Status: implemented and reviewed locally on 2026-08-03 (`PASS_WITH_OPEN_ITEMS`)

Work package branch: `codex/top-gear-featured-preview-reel`

Base / rollback checkpoint: `0e79852f7552af42b25d0e1adc9f746f98828fb6`

Validated implementation head: `c4c284707edd1f6560081ef9df3b56b0ba5f9bc5`

Closeout record:
`docs/reviews/top-gear-featured-preview-reel-v1-2026-08-03.md`

## Goal

Create a concise silent moving preview for the existing Featured Work card
`Top Gear China: UK Special`. The reel should show the value already stated by
the card: a Chinese production working in Britain with the original Top Gear
team on a cross-border factual-entertainment shoot.

The user approved a hybrid of the visual-companion directions
`B · Cross-border story` and `A · Action-led`, with an explicit request to
include aircraft footage.

## Source And Evidence Boundary

- Approved local source basename:
  `巅峰拍挡第2季第5期20151116 巅峰拍挡之开着自行火炮闯英国 Top Gear China II EP.5东方卫视官方超清.mp4`
- Source SHA-256:
  `4ba65130c3c172ffff40851ee83e05db494be261b1e50527576f5b9fcda2c955`
- Source duration: `3195.042540` seconds.
- Source video: H.264, 1920×1080, yuv420p, BT.709.
- Source audio: AAC; it will not be present in the public derivative.
- Rights status: `user-supplied-local-source` for a publicly credited work;
  the user explicitly requested a portfolio reel derived from this file.

The source basename, checksum, duration, dimensions, and rights status may be
stored as private build evidence in canonical work data. The absolute local
source path must not be committed or emitted into public HTML, design exports,
or browser QA evidence. The original source file is not a repository artifact
and will not be moved or deleted in this package.

## Editorial Structure

Target duration: approximately 30 seconds. Use clean hard cuts and select the
strongest continuous movement within the approved source neighborhoods. The
final media ledger must record the exact in/out timecodes used.

1. `0–3s` — London and the Chinese hosts establish arrival in Britain.
2. `3–6s` — people and an unusual British microcar establish the Top Gear tone.
3. `6–10s` — the microcar moves through London traffic.
4. `10–13s` — architecture or city-scale movement keeps the British location
   legible and creates a visual breath.
5. `13–17s` — an on-location vehicle exchange at a British estate makes the
   production journey visible rather than relying on copy.
6. `17–22s` — road or sports-car action increases pace.
7. `22–26s` — an aircraft exterior followed by the Chinese host with its
   British pilot provides the explicitly requested aircraft image and makes
   the cross-border encounter visible.
8. `26–30s` — return to road or vehicle movement for a clean loop into the
   opening London image.

Avoid a studio-summary ending, long dialogue-only shots, editorial title
cards, or a montage that reads as a whole-episode synopsis. Existing broadcast
logos, subtitles, and graphics that are part of the approved source image may
remain. Do not add a new title, portfolio label, graphic overlay, transition,
music, sound effect, color treatment, or generative edit.

## Output Contract

- Public URL: `/assets/showreel/top-gear-china-uk-special-card-reel.mp4`.
- Container / video: MP4, H.264, 1280×720, square-pixel 16:9, yuv420p,
  BT.709 color space/transfer/primaries.
- Audio: none; the derivative must contain exactly one video stream.
- Web delivery: `moov` atom before `mdat` (`+faststart`).
- Duration: 30 seconds within normal frame-boundary tolerance.
- Cadence: preserve or cleanly normalize the source cadence without frame
  interpolation.
- Framing: retain the full 16:9 source frame; do not crop or reframe.
- Loop: the closing road/vehicle movement should cut naturally back to the
  London opening without a dissolve.

The final output receives an exact SHA-256, byte size, duration, stream probe,
faststart check, and full decode pass. The reproducible trim/concat/encode
recipe and exact source timecodes belong in
`showreel/featured-preview-reels/README.md` without an absolute source path.

## Website Integration

Update only the canonical Top Gear work record with the complete Featured reel
contract:

- `featuredReelMode: "after-hold"`
- `featuredReelUrl`
- `featuredReelPoster`
- the complete source provenance fields

The current poster remains canonical:
`/assets/portfolio/top-gear-uk-special-car.jpg`. The existing YouTube
`watchUrl` remains the linked destination. The current title, copy, metrics,
tags, card size, 16:9 presentation, and source-artwork treatment remain
unchanged. No renderer, JavaScript, CSS, Archive, Press, Contact, or Figma
layout change is authorized.

The existing Featured lifecycle remains authoritative: 35% visibility,
last-eligible DOM ownership, 1.4-second poster hold, reveal only on the current
`playing` event, reset on exit/error/visibility/pagehide, BFCache recovery,
and static reduced-motion/no-JavaScript fallbacks.

## Test And Review Contract

Work test-first:

1. Add a failing canonical-data/render test proving Top Gear has the complete
   reel triplet and provenance while retaining its exact poster and YouTube
   destination.
2. Add the output to the exact media manifest test after the derivative is
   encoded and its evidence is known.
3. Run focused contract, renderer, and media tests, followed by `npm test`,
   `npm run audit:design-contract`, `npm run build`, and
   `npm run figma:export`.
4. Confirm the Figma hashes remain unchanged because the canonical poster and
   layout remain unchanged.
5. Run local browser QA in English and Chinese at 1440×900, 1200×900,
   834×1112, 390×844, and 360×800. Verify poster hold, actual playing, reset,
   re-entry, keyboard navigation, no-JavaScript, reduced motion, overflow, and
   last-eligible arbitration now that Top Gear is the final Featured reel.
6. Confirm the linked media wrapper still opens the exact existing YouTube
   destination and that QA sends no Contact submission.

## Boundaries And Rollback

- No new Vercel Preview, Production deployment, push, main merge, contact
  submission, or external message is part of this package.
- Do not modify, stage, rename, or delete the protected user-owned untracked
  file `docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md`.
- Do not touch the three previously approved Featured derivatives.
- Rollback is the base commit
  `0e79852f7552af42b25d0e1adc9f746f98828fb6`; removing the Top Gear reel
  fields and derivative must restore the prior static-poster behavior without
  layout changes.
