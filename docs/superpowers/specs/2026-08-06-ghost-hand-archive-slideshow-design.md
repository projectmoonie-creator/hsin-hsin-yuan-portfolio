# Ghost Hand Divine Car Archive Slideshow — Design

Date: 2026-08-06  
Status: producer-approved design; implementation not started  
Scope: Repo-configured Archive still-slideshow authoring and the first
`ghost-hand-divine-car` package

## Goal

Turn the six user-supplied production stills for `Gui Shou Shen Che / 鬼手神車`
into a maintainable 10-second Archive reel. The website must keep using its
existing generic Archive reel component. Future still swaps must be possible
through a versioned recipe and one guarded command, without editing the site
renderer, CSS, playback JavaScript, or Figma-specific media arrays.

“Repo-configured backend” means a validated recipe, tracked safe authoring
derivatives, and deterministic CLI output. It does not include a login,
database, upload service, or browser CMS.

## Approved Creative Direction

- Poster: `4arUG0s6.jpg`.
- Reel: all six supplied stills.
- Motion: soft dissolves plus a restrained 3.5% push-in.
- Output: exactly 10 seconds, 1280×720, 30 fps, silent H.264, yuv420p,
  BT.709, faststart.
- No titles, logos, captions, music, sound effects, decorative overlays, or
  unrelated generated imagery.
- The first reel frame and public poster use the same normalized crop so the
  existing 1.4-second poster hold does not jump when playback starts.
- The final dissolve returns to the poster crop before the loop boundary.

Approved sequence:

1. `4arUG0s6` — two lead characters in the racing workshop; poster and opener.
2. `HDHnSa6p` — racing-suited character on the production monitor.
3. `tDISn7O1` — action scene on the production monitor.
4. `gCBfY42A` — four-person night portrait.
5. `LJMe3s4e` — night production-team portrait.
6. `UQZej4eu` — full cast-and-crew photograph; closing proof of production
   scale before dissolving back to the opener.

Each still owns 50 frames of the 300-frame timeline. Adjacent shots overlap by
an eight-frame dissolve within those slots. The push-in is linear and bounded
from 1.000 to 1.035. Focal positions belong to the recipe, not the shared
component.

## Source Evidence And Rights

The producer explicitly instructed the portfolio to use the supplied folder
and named `4arUG0s6` as the cover. The package classifies all six sources as
`user-supplied-local-source` for this public portfolio use.

The recipe records source basenames, pixel dimensions, and SHA-256 values but
never records the private Downloads path:

| Basename | Dimensions | Source SHA-256 |
| --- | --- | --- |
| `4arUG0s6.jpg` | 4240×2832 | `173a68ec11ef9ad5e5c73a52d724961aabcaa19896595d0aea42d9d12ff12243` |
| `HDHnSa6p.jpg` | 4032×3024 | `af2a489f66ce17e34cd21b404fe1284fc76c71cddbf9fc69081517fec72c9bbe` |
| `tDISn7O1.jpg` | 4032×3024 | `522ef38033b5b3eeeafc36ee6338af566a5d982a2e66ab56fe24fb5b703766c8` |
| `gCBfY42A.jpg` | 4032×3024 | `ee96d988a8a84b1c046ecfee3c78167f6cbb60c543f33fd9a00b3c4e0a961f4f` |
| `LJMe3s4e.jpg` | 4032×3024 | `d230908d93c9666b7a6a4212f37e6ff86d4b467ece5ebd421b3b29da97241282` |
| `UQZej4eu.jpg` | 3959×2548 | `191d61a36851fd69067b7d97808606f7cb6ba03d13f857a093c5fa6d87c0218c` |

Raw JPEGs stay outside Git. The repository may retain only metadata-stripped,
normalized authoring derivatives needed to rebuild the public reel.

## Component Architecture

### 1. ArchiveStillSlideshow recipe

Each still-based Archive reel owns one `slideshow.json`. The validated schema
contains:

- schema version, Archive slug, rights status, duration, frame rate, output
  profile, and poster frame id;
- ordered frame ids with safe relative source paths, source SHA-256, focal
  point, crop mode, scale start/end, and transition kind/duration;
- bilingual poster alt text;
- stable public poster and reel destinations.

The first package lives under
`showreel/ghost-hand-divine-car-card-reel/`. Its configuration contains no
absolute path and no public-site markup.

Initial focal intent is:

| Frame | Focal x | Focal y |
| --- | ---: | ---: |
| `4arUG0s6` | 0.56 | 0.42 |
| `HDHnSa6p` | 0.58 | 0.44 |
| `tDISn7O1` | 0.49 | 0.44 |
| `gCBfY42A` | 0.55 | 0.45 |
| `LJMe3s4e` | 0.52 | 0.49 |
| `UQZej4eu` | 0.53 | 0.50 |

These values remain editable data and must be confirmed from rendered contact
sheets before final output.

### 2. Shared ArchiveStillSlideshow renderer

A single shared, data-driven HyperFrames composition owns the still layers,
dissolves, push-in, timing, and loop-safe final transition. The generic runner
loads one recipe and produces the requested composition without slug checks.
The work routes through the existing custom-video/general-video HyperFrames
workflow rather than a presentation-deck workflow.

The shared renderer must not contain `ghost-hand-divine-car`, any source
basename, or per-image coordinates. Those values belong only to the recipe.

### 3. Guarded Repo command

Expose one package command for maintainers. Its default mode is read-only and
prints a deterministic plan. An explicit `--write` mode performs one coherent
package:

1. verify sources against the recipe and rights declaration;
2. import metadata-stripped normalized authoring stills when an explicit
   source directory is supplied;
3. validate the recipe and construct the HyperFrames composition;
4. render the MP4 and derive the WebP poster;
5. verify media profiles and full decode;
6. update `data/media-manifest.json` with exact size and SHA-256;
7. patch only the canonical `content/archive/<slug>.md` media fields;
8. print the changed-file and validation summary.

An interrupted or failed render must not leave a half-updated public package.
Generate and validate in a temporary directory, then replace the public
poster, reel, manifest entry, and frontmatter together only after all checks
pass.

### 4. Existing website component

The generated content uses the existing fields:

- `posterImage`
- `imageAlt`
- `posterRightsStatus`
- `posterDimensions`
- `posterFocalPoint`
- `cardReelUrl`
- `cardReelPoster`
- `cardReelMode: after-hold`
- `cardReelDuration`
- `cardReelRightsStatus`

No new website component is required. The current Archive card continues to
own the poster hold, muted inline playback, one-visible-reel arbitration,
reset behavior, and reduced-motion static fallback. Figma export and design
audit continue to consume canonical site data rather than a parallel asset
list.

## Canonical Ghost Hand Media Fields

The public paths are stable:

- `/assets/showreel/ghost-hand-divine-car-card-reel-poster.webp`
- `/assets/showreel/ghost-hand-divine-car-card-reel.mp4`

Poster alt text:

- English: `Two lead characters pose in a racing workshop, one holding a white helmet`
- Chinese: `賽車工作室裡，兩位主要角色合影，其中一人手持白色安全帽`

The still-based poster has no video source timecode. Source hashes and
provenance remain in the private/evidence recipe; the public renderer receives
only normalized media fields.

## Failure Handling

The command fails closed before public writes when any of these conditions is
present:

- missing, duplicate, unsupported, or hash-mismatched source;
- absolute path or traversal in the recipe;
- focal point outside 0–1;
- poster id not present in the ordered frame list;
- unapproved or unsupported rights status;
- duration, frame rate, dimensions, codec, pixel format, color profile, audio
  count, or faststart mismatch;
- retained private image metadata in an imported authoring derivative;
- generated asset path or manifest owner outside the declared Archive slug;
- frontmatter conflict with another manifest owner;
- render, decode, build, or contract-test failure.

Validation errors identify the recipe field or asset basename without printing
private absolute paths.

## TDD And Validation

Implementation begins with failing tests for:

1. recipe parsing, normalization, path redaction, focal bounds, exact timing,
   and required rights evidence;
2. deterministic render planning for six 50-frame slots, eight-frame
   dissolves, bounded push-in, and loop-safe return to frame one;
3. dry-run no-write behavior and atomic write staging;
4. generic renderer isolation, including an assertion that it contains no
   Ghost Hand slug or source basename;
5. Ghost Hand Archive frontmatter, bilingual alt, poster/reel linkage, and
   still-source omission of `posterSourceTimecode`;
6. exact media-manifest owner, size, SHA-256, duration, stream count, codec,
   dimensions, pixel format, BT.709, no audio, faststart, and full decode.

Final gates:

- focused tests and full `npm test`;
- media profile and manifest integrity checks;
- `npm run build`, `npm run figma:export`, and design-contract audit;
- `git diff --check`, private-path scan, and protected-file SHA recheck;
- rendered early/middle/late contact sheet plus the full 10-second loop;
- English and Chinese desktop/mobile browser QA;
- normal-motion poster hold/play/reset and reduced-motion static poster QA;
- no Contact submission, push, Preview, alias, or Production change without a
  later explicit authorization.

## Non-Goals

- No production CMS, authentication, database, uploads API, or drag-and-drop
  browser editor.
- No redesign of Archive cards or change to existing playback policy.
- No forced autoplay for reduced-motion users.
- No color grade or AI retouch unless a later review identifies a concrete
  source problem and the producer separately approves that treatment.
- No modification, staging, or publication of the protected untracked review
  document.

## Acceptance Criteria

The design is complete when a maintainer can replace or reorder stills by
editing one recipe and running one guarded command; the resulting generic
Archive reel passes all exact media, privacy, accessibility, bilingual,
website, and Figma gates; and the user can review it locally before any merge
or deployment.
