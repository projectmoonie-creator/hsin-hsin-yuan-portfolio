# Frozen read-only closeout review packet — Ghost Hand Archive slideshow

Date: 2026-08-06  
Repository: `hsin-hsin-yuan-portfolio-remove-lights`  
Target branch: local `main`  
Target commit: `4dab6d77c87ddddd5564bf709016ada99c6e0b57`  
Public-behavior head: `9d84132e650027ad1dbfeb4211ead9a99f776e3c`  
Package base: `03ad08ac4dd3a47d300cab99f2dd569353e13ec9`

## Objective

Review the completed `Gui Shou Shen Che / 鬼手神車` Archive slideshow vertical
slice and its reusable repo-configured authoring pipeline before formal local
closeout. Determine whether any reproducible P0/P1 defect prevents treating the
local baseline as trustworthy and ready for a later, separately authorized
Vercel Preview.

The package converts six producer-approved local production stills into one
silent 10-second Archive reel. A versioned recipe owns the order, source
fingerprints, focal points, timings, motion, public paths, rights status, and
bilingual alt. The live site continues to use the existing Archive card reel
fields and playback policy.

## No-edit instruction

Review only. Do not edit files, push, merge, deploy, submit Contact, request
credentials, or recommend publishing private source paths. Findings must be
grounded in this frozen packet. Do not treat subjective crop preference or the
planned later Chinese-copy package as a blocker.

## In scope

- safe still-sourced poster support in the Archive media planner;
- generic six-still recipe and timeline validation;
- generic HyperFrames HTML generation;
- dry-run-by-default guarded CLI and write-mode public-package staging;
- WebP metadata fail-closed policy;
- rollback-capable four-target public write;
- Ghost Hand recipe, authoring derivatives, public poster/MP4, content record,
  and media manifest;
- closest-visible Archive reel arbitration when several reels share a row;
- website/Figma/data parity, reduced motion, no-JS, privacy, and durability.

## Out of scope

- Chinese copy refinement and bilingual named-layout variants;
- lighting effects;
- a browser CMS, uploads API, database, authentication, or public editor;
- a new Archive layout or a different autoplay policy;
- Vercel Preview or Production deployment.

## Rights and private-source boundary

The producer supplied the six stills, named `4arUG0s6.jpg` as the cover, and
explicitly confirmed that the final selected stills may be used in the public
portfolio. Canonical status is `user-supplied-local-source`.

The recipe records only approved basenames, dimensions, and SHA-256 values.
Raw JPEGs and their Downloads directory remain outside Git. Six normalized
1280×720 metadata-safe WebPs are tracked as authoring derivatives. A tracked
private-path scan across `content`, `data`, `public`, `scripts`, the authoring
package, and tests returns no hit for `Downloads/` or `/Users/`.

The protected user-owned untracked review file remains outside Git and retains
SHA-256
`945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.

## Recipe and timeline contract

`scripts/lib/archive-still-slideshow.mjs` requires:

- schema 1, lowercase kebab-case slug, and exactly six unique frame ids;
- rights exactly `user-supplied-local-source`;
- 1280×720, 30 fps, 300 frames;
- profiles `silent-h264-720p-bt709` and `webp-1280x720`;
- public paths derived exactly from the declared slug;
- bilingual alt and focal coordinates constrained to 0–1;
- safe relative `assets/stills/*.webp` paths and basenames without separators;
- lowercase 64-character source SHA-256 plus positive source dimensions;
- six 50-frame slots, `cover`, scale 1→1.035, and eight-frame dissolves;
- a poster id present in the frame list and a duration sum of 300.

The deterministic timeline assigns starts `[0, 50, 100, 150, 200, 250]` and
returns to the poster during frames 292–300.

## Generic composition boundary

`scripts/lib/archive-still-slideshow-html.mjs` consumes only the validated
recipe/timeline. It escapes image attributes, creates six absolute `object-fit:
cover` still layers, registers one paused GSAP timeline under
`window.__timelines["archive-still-slideshow"]`, applies linear scale motion,
uses sine dissolves, and adds a final poster-return layer. The generic renderer
contains no Ghost Hand slug, basename, or hard-coded focal coordinate; tests
also render a second sample recipe without code changes.

The authoring project pins HyperFrames `0.7.94`. Strict check passes.

## Guarded CLI and public write

`npm run media:slideshow` requires `--config`, rejects unknown/repeated options,
and defaults to a redacted `writesFiles: false` plan. `--authoring-only` and
`--write` are mutually exclusive and both require an explicit source directory.

Before authoring, each raw source must match the recipe SHA and dimensions.
FFmpeg strips metadata and produces one 1280×720 WebP. The WebP parser accepts
only `VP8 `, `VP8L`, `VP8X`, and `ALPH`; rejects unclassified chunks, truncated
containers, length/alignment errors, private/animation VP8X flags, and anything
other than one static image chunk.

Write mode renders in a temporary directory, transcodes one silent 10-second
H.264 yuv420p BT.709 faststart MP4, copies the validated poster still, verifies
the exact media profile/full decode, and only then invokes the public writer.
The temporary render directory is always removed.

`scripts/lib/archive-media-package-writer.mjs` validates the next manifest and
prepares stage files beside four targets: public reel, public poster, manifest,
and Archive frontmatter. For each target it moves an existing target to a
unique backup, renames the stage into place, and deletes backups only after all
four succeed. An exception reverses committed targets, restores backups in
reverse order, and removes all stage/backup artifacts. Tests inject a rename
failure and verify byte-for-byte rollback of all targets.

## Public media and canonical integration

Public poster:

- path: `/assets/showreel/ghost-hand-divine-car-card-reel-poster.webp`
- bytes: `144878`
- SHA-256:
  `fadb961b9eed9ec4f4f4e77e0afa0a9ac25050a7a95398d2d19b407adcbca5f3`

Public reel:

- path: `/assets/showreel/ghost-hand-divine-car-card-reel.mp4`
- bytes: `3838732`
- SHA-256:
  `9a602f249559cbb613180e4c6eb173ea10060818a69a11b5907789cf16b62b52`
- probe: 10.000000 seconds; one H.264 1280×720 yuv420p stream; BT.709 color
  space/transfer/primaries; zero audio; faststart; full decode clean.

`content/archive/ghost-hand-divine-car.md` and `data/media-manifest.json` own
the public poster/reel linkage, exact profiles, rights status, focal point, and
bilingual alt. The still-sourced poster deliberately has no false video
timecode. Website and current-reference Figma export consume canonical site
data; no parallel Ghost Hand media array was added.

## Archive playback arbitration

The existing Archive policy remains: 35% visibility, 1.4-second poster hold,
muted looped inline playback, reset on exit/error/hidden state, and a static
reduced-motion/no-JS fallback.

Because several Archive reels can be simultaneously visible, the package adds
`selectClosestVisibleArchiveReel(videos, visibleVideos, viewport)`. It iterates
in DOM order and chooses the qualifying video with the smallest squared
distance between video center and viewport center; exact ties keep the earlier
DOM video. Scroll/resize recompute on one animation frame, and every non-active
video is reset to poster/time zero. Unit tests cover desktop, mobile, no
qualifier, and exact ties.

## Current deterministic evidence

- Full `npm test`: `111/111` pass at target `4dab6d7`.
- `npm run build`: pass.
- `npm run figma:export`: pass.
- `npm run audit:design-contract`: pass; 6 Featured, 5 Archive, 2 global
  Press, 3 work Press; no drift.
- HyperFrames `npm run check -- --strict`: pass on pinned `0.7.94`.
- FFprobe profile, exact size/SHA, faststart test, and full FFmpeg decode: pass.
- Private-path scan: no hits.
- `git diff --check`: pass.
- Protected-file SHA: exact.
- Current committed HEAD is reachable from
  `origin/backup/2026-08-06/pre-shutdown-final`; unbacked commit count is zero.

## Current browser evidence

The exact current `dist/` was served locally on a unique port and tested with
headless Chromium:

- English 1440×1000 normal motion: Ghost Hand request succeeds, plays after
  poster hold (`currentTime 0.335`, opacity 1), exactly one Archive reel active,
  no horizontal overflow.
- Chinese 390×664 normal motion: Ghost Hand plays (`currentTime 0.324`), then
  scrolling to Three-Minute resets Ghost Hand to paused/time zero/poster and
  starts Three-Minute; exactly one reel remains active; Contact is visible.
- Chinese 390×664 reduced motion: reel display none, paused/time zero, poster
  visible.
- English 390×664 no JavaScript: Ghost Hand title/poster and Contact remain
  present and usable.
- Across all cases: HTTP 200, zero console errors, page errors, same-origin
  request failures, horizontal overflow, Contact POSTs, or submissions.

The first automated pass used a fixed wait beginning before the site's smooth
scroll completed and therefore sampled the poster before the 1.4-second hold
could finish. Geometry instrumentation showed the scroll settled after about
one second and Ghost Hand then played normally (`currentTime 4.03`). The final
matrix waits for the reel to be at least 95% intersecting before measuring the
hold; no product change was made.

## External and deployment state

- `origin/main` remains
  `03ad08ac4dd3a47d300cab99f2dd569353e13ec9`.
- The final local checkpoint is backed up at
  `origin/backup/2026-08-06/pre-shutdown-final` = target `4dab6d7`.
- No new Vercel Preview, Production deployment, alias change, or Contact
  submission occurred for this package.
- A future shareable Preview requires separate explicit producer authorization.

## Requested review dimensions

1. P0/P1 correctness, data-loss, or public-package consistency defect in the
   recipe, CLI, staging, or rollback boundary.
2. Privacy or rights mismatch that makes the public poster/reel unsafe to use.
3. Reproducible media/profile, accessibility, or Archive playback defect.
4. Ghost Hand special-casing or a website/Figma/data divergence that defeats
   the reusable backend goal.
5. Missing regression test that could realistically let a P0/P1 defect in this
   exact package pass.

Do not block on hypothetical process termination between filesystem rename
operations unless the packet claims an OS-level multi-file transaction; it
claims exception-safe rollback for the four-target writer. Do report any
current code evidence that contradicts that narrower claim.

## Required output schema

Return exactly:

```text
VERDICT: PASS | PASS_WITH_FINDINGS | BLOCK
MODEL: <observed model ID if available, otherwise unknown>
FINDINGS:
- [P0|P1|P2] <file/area>: <reproducible issue and evidence>
  Recommendation: <bounded correction>
or
- None.
RESIDUAL_RISK:
- <short item or None>
```

Only a reproducible P0/P1 finding grounded in the frozen packet may block local
closeout. A reviewer may record bounded P2 follow-ups without reopening the
accepted visual package.
