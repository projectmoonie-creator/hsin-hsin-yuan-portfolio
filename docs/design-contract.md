# Portfolio Design Contract

Version: 1.0  
Approved: 2026-08-03  
Visual baseline: `90b5d1ae5e32126c78672df33c4c6f4eaa7f0642`

## Purpose

This is the current format contract for the Hsin-Hsin Yuan portfolio. It
records the presentation approved through iterative desktop and mobile review.
Governance work may make these rules explicit, validate them, or route data
through a compatibility adapter; it does not authorize a visual redesign.

When another active document conflicts with this file, use this file together
with `PROJECT_BIBLE.md`, `STATUS.md`, canonical data, and production code.
Dated specs and reviews remain history.

## Source and output ownership

| Layer | Owner | Rule |
| --- | --- | --- |
| Canonical content/evidence | `data/*.json`, `content/**/*.md` | May retain source and provenance detail that is not public. |
| Public view model | `scripts/lib/portfolio-contract.mjs` | Validates and normalizes source records into named public contracts. |
| Production rendering | `scripts/build-site.mjs`, `src/styles.css`, `src/main.js` | Owns live HTML, geometry, breakpoints, and interactions. |
| Design handoff | `scripts/build-figma-export.mjs`, `figma-export/` | Must consume the same content contracts; never overrides production. |
| Verification | `tests/`, `scripts/audit-design-contract.mjs` | Proves required presence, required absence, order, variants, and parity. |

The source layer may be heterogeneous because evidence differs by project. The
public view model must be predictable. Do not force an empty metric, Press
item, CTA, or image into a project merely to make its source record resemble
another record.

## Page contract

The public section order is fixed:

1. Hero
2. Platforms & Collaborations
3. Screening Strip
4. Available For
5. Featured Works
6. FROM THE ARCHIVE
7. PRESS
8. Contact

English and Chinese use the same structure and component order. Copy may wrap
differently. An approved exact-empty localized value retains its stable source
field but omits that value's complete rendered element, so the next sibling
flows upward without an empty spacer; this locale-specific omission does not
remove the owning public module.

## Field classes

Every field belongs to one class:

- `required-rendered`: public anatomy needed for every record in that family;
  a missing value is an error.
- `optional-rendered`: public capability shown only when source data supports
  it; omission is valid.
- `evidence-only`: provenance, rights, verification, source context, or a
  currently unpublished proof point; retained but excluded from public anatomy.
- `retired`: no current consumer may revive it. Remove it after compatibility
  evidence is complete.

Unknown fields are audit findings until they are classified. Presentation may
not be inferred from an absent field, record length, media availability, or a
slug-specific CSS exception.

## Platforms & Collaborations

`data/collaborations.json` is the only authored collaboration list. Each entry
has a stable `id`, localized accessible name/label, optional official
destination, and an optional complete `logo` record. The normalizer produces a
`collaboration-mark` contract with public presentation separated from
source/rights evidence; source URLs, source hashes, checked dates, and rights
status must never enter public HTML or generated Figma layers.

- The canonical seven-entry order is shared by English, Chinese, desktop,
  mobile, and `npm run figma:export`; no consumer may truncate or reorder it.
- A verified mark uses a repo-owned monochrome SVG derivative. An unresolved
  identity uses a visible text fallback; the renderer must not invent or
  imitate a logo.
- Verified originals live under `assets/collaboration-logos/sources/` and are
  never served directly. `npm run collabs:prepare` verifies their recorded
  SHA-256 values and deterministically regenerates only
  `public/assets/logos/*-mono.svg`; normal builds perform no network fetch.
- The three named optical tokens (`compact`, `standard`, `wide`) govern height
  and maximum width in both consumers. Layout code contains no collaborator-
  specific selectors or coordinates.
- The website wall has four centered slots per desktop row and two at `820px`
  and below. An incomplete final row remains centered. Figma exports use the
  same four/two component family and complete data order.
- Marks are nominative identifiers of past platforms and collaborators, not
  claims of endorsement or current representation.

To add, remove, or replace an entry, edit the canonical JSON; for a new mark,
preserve a verified official source, record its complete evidence and optical
token, run `npm run collabs:prepare`, then rebuild the website and Figma export.
No renderer or CSS change is needed unless the shared component contract
itself changes.

## Screening Strip

Purpose: a lightweight visual index, not a duplicate case study.

| Class | Fields |
| --- | --- |
| Required rendered | canonical work target, platform/year, title, role, tagline, static poster or explicit supported fallback |
| Optional rendered | none; external destinations belong to the matching Featured card |
| Evidence only | media rights/source/provenance |

- Cards are 16:10 with fixed outer edge fades.
- The strip contains no moving video.
- Every card action jumps to the matching Featured Work.
- External destinations never replace the small card's canonical Featured
  anchor; they remain available inside the matching large card.

## Featured Work

One public anatomy is used in this order:

1. year / role / platform
2. title
3. tagline
4. description
5. optional tags
6. optional contextual metrics
7. optional work-specific Press
8. optional exceptional text action

| Class | Fields |
| --- | --- |
| Required rendered | `slug`, `order`, `year`, bilingual `title`, bilingual `role`, `platform`, bilingual `tagline`, bilingual `description`, `presentation` |
| Optional rendered | poster/reel/embed, poster alt, tags, metrics plus context, work Press, status label, public watch destination, approved text action |
| Evidence only | rights status, source URL/timecode/hash, checked date, raw source notes, source dimensions/focal data not used by the renderer |
| Retired after compatibility | `hideMediaLabel`, `featuredMediaAspect` |

### Named media variants

| Variant | Works | Wider-screen behavior |
| --- | --- | --- |
| `fill-card` | None currently | Retained as an allowed non-reel presentation variant; media fills the approved Featured card media area. |
| `centered-16x9` | All six current Featured Works | A 16:9 poster/reel is vertically centered in its side of the card. |

Every approved Featured reel uses `centered-16x9` on wider screens so poster
and playback geometry stay identical. At `820px` and below, every Featured
media surface remains 16:9. The mobile rule is invariant; it is not a third
per-work exception.

Every work declares:

```json
{
  "presentation": {
    "desktopMediaVariant": "centered-16x9",
    "mobileMediaAspect": "16:9",
    "siteTitleOverlay": "none",
    "sourceArtworkTitle": "present"
  }
}
```

Allowed values are `fill-card | centered-16x9`, `16:9`, `none`, and
`present | absent` respectively.

### Media identity

One visible owner supplies a program identity on a media surface. A title or
logo already present in the source artwork is accepted. The site adds no
second Featured media-title overlay. Absence of a source title does not permit
the renderer to invent one without a new approved variant.

The linked media surface is the normal primary action. Text actions exist only
for the approved curated selection/full-series exceptions: Design & Brand
Films and Nothing by Bus.

### Featured reel behavior

- Only canonical `featuredReelMode: "after-hold"` approves a Featured reel;
  absence of that approval leaves the static poster.
- A reel becomes eligible at 35% visibility. At `820px` and below, only the
  eligible reel nearest the viewport center is active and ownership is
  recalculated during scroll and resize. Above `820px`, only the last eligible
  reel in DOM order is active.
- The canonical poster holds for 700ms at `820px` and below and 1.4 seconds
  above `820px`, then remains visible until the video actually emits `playing`.
- Explicit intent bypasses the passive hold without bypassing one-owner or
  lifecycle guards. Desktop panel hover and focus-within request that reel
  immediately and release it on exit. On mobile linked media, the first
  stationary tap previews and suppresses only that click; a second tap opens
  the canonical official destination. Movement over 12px remains scrolling,
  and a rejected or errored preview leaves the next tap available to navigate.
- Screening Strip pointerdown/click may metadata-prime only its canonical
  `#<featured-slug>` reel. The matching visible panel bypasses the passive
  hold; an interrupted offscreen prime expires after three seconds.
- Leaving eligibility, hiding the page, a media error, a rejected current
  `video.play()` promise, or `pagehide` safely resets the reel: cancel its hold,
  pause it, seek it to time zero, and restore its poster. A rejected promise
  does not schedule a retry, and a stale rejection cannot reset a newer
  activation. A persisted BFCache restore rebinds observation safely before
  reels may become eligible again.
- Reduced-motion and no-JavaScript states remain static posters.
- Reel videos are muted, looped, inline, `preload="none"`, pointer-transparent,
  and non-interactive. The existing media wrapper owns navigation.
- `data/media-manifest.json` owns one Featured delivery recipe and derives all
  six 960×540 silent H.264 BT.709 faststart mobile paths; generated hashes and
  source fingerprints must pass `npm run featured-reels:check`. Mobile HTML
  places that media-qualified source before the existing 720p fallback.
- Initial HTML never eagerly preloads video. Once the canonical Hero image has
  loaded, mobile may warm only the settled nearest reel within a two-viewport
  margin using native metadata preload. Concurrency is one;
  ownership/lifecycle changes cancel the old warm, active playback blocks
  another, and desktop, reduced motion, no-JavaScript, Save-Data, slow-2G, and
  2G remain conservative. A late initial `pageshow` cannot restore the top
  position after scroll, pointer, or keyboard navigation begins.
- Delivery changes must preserve the poster, crop/focal point, card and text
  geometry, 700ms/1.4s holds, 260ms reveal, navigation, copy, and Figma output.
- Existing posters and external watch destinations remain canonical. Slow
  Steps has no public destination and stays unlinked; no destination is
  invented for it.

## FROM THE ARCHIVE

Archive is one descending chronology controlled by canonical `order`.

| Class | Fields |
| --- | --- |
| Required rendered | `slug`, `order`, `year`, bilingual `title`, bilingual `role` |
| Optional rendered | poster or index fallback, image alt/fit, public watch action, credited-role action, approved card reel |
| Evidence only | platform, summary, metrics, source note, rights/provenance fields, official-source verification not shown in the card |

- Every entry uses the `standard` card family and the same internal copy/media
  split.
- Approved Archive reels select the eligible video nearest the viewport center
  and hold their poster for 1.4 seconds at every viewport. Featured's responsive
  timing and ownership policy does not apply to Archive.
- Poster absence changes capability, never card size or hierarchy.
- The fifth single desktop entry remains an ordinary half-row card; it does
  not span.
- Archive has no explanatory subcopy and no decorative external-link arrows.

## Press

Work Press and global Press are different schemas.

### Work Press

- Variant: `thumbnail-card`.
- Work Press is optional structured data. Its group name is semantic-only via
  a localized accessible label; it does not render a second visible field
  heading named `PRESS & INTERVIEWS`.
- Each thumbnail card's visible `type` is its classification. Preserve its
  type, title, source, thumbnail, link, and audit metadata.
- Required: bilingual type/title, source, canonical URL, title source, image
  source, and metadata checked date.
- A localized title may be an approved exact-empty string. The stable title
  field remains in canonical data, while that locale emits no `<strong>` title
  element and leaves no visual gap; the type, source, thumbnail, destination,
  and audit metadata remain intact.
- Optional: verified source thumbnail.
- It belongs inside its Featured Work and may use a verified image.

### Global Press

- Global Press remains a distinct page-level component with its visible
  section heading.
- Variant: `text-note`.
- Required: id, order, year, bilingual part label/title/source, canonical URL,
  title source, image source statement, and metadata checked date.
- It is text-only, low priority, and newest first.
- Participation descriptions that merely repeat ownership of the portfolio are
  evidence-only and are not rendered.

## Hero, Contact, and responsive invariants

- `data/site.json.heroMedia` is the single current-reference Hero image record.
  Its required-rendered fields are `id`, `src`, bilingual `alt`, intrinsic
  `dimensions`, named `focalPoint` values, `motion`, and one delivery recipe.
  Candidate filenames, `srcset`, and preload records are derived from that
  recipe and the canonical `src`; no parallel candidate array is allowed.
  `rightsStatus`, the canonical source SHA-256, and encoder qualities are
  mandatory evidence-only data and must not enter public HTML.
- The website and `npm run figma:export` consume the same normalized HeroMedia
  contract. The website renders a discoverable `<picture>/<img>` with explicit
  dimensions, localized alt, responsive AVIF/WebP/JPEG sources, media-matched
  high-priority AVIF preloads, and a `transform`-only slow push. Reduced-motion
  output is completely static. The Figma SVG continues to consume the same
  canonical source and shows its static starting crop. Hero has no Play
  control, video, hover action, or keyboard target.
- To replace the Hero, first prepare a local JPEG, then run
  `npm run hero:sanitize -- --input SOURCE_JPEG --output public/assets/portfolio/OUTPUT.jpg`.
  Update the one HeroMedia source path, source SHA-256, localized alt, intrinsic
  dimensions, and focal points, then run `npm run hero:prepare` before the
  website and Figma verification suites. The prepare command stages and
  validates every derivative's source hash, decoded dimensions, actual codec,
  metadata safety, and SHA-256/byte manifest. `npm run build` verifies that the
  checked-in source, recipe, manifest, and all derivative hashes still agree
  before replacing `dist`. Public JPEGs must contain no APP1, APP13, or COM
  metadata segments.
- Above `1280px`, Hero uses the approved two-column composition.
- At `1280px` and below, Hero stacks to one column.
- At `980px` and below, Archive becomes one column.
- At `820px` and below, mobile navigation is active, Featured sticky behavior
  becomes normal flow, all Featured media is 16:9, and Press/Contact become one
  column.
- At `460px` and below, Archive and global Press use compact spacing/type.
- Reduced motion suppresses ambient/reel motion while static posters, content,
  and links remain usable.
- No-JavaScript output retains readable content, navigation, posters, and
  public destinations.
- Hero's second role line has no leading decorative slash.
- The English Contact heading is exactly two visual lines; its existing line
  ownership is preserved.

## Omission, variant, and change rules

- Optional modules disappear deterministically when data is absent.
- A new variant must name its anatomy, responsive behavior, fallback,
  consumers, tests, and rollback before implementation.
- A new record is piloted against the smallest, largest, and exceptional
  existing records before scaling.
- Change the owning source or shared renderer. Do not append a tail CSS
  override to imitate a one-off exception.
- Public output changes require matched English/Chinese desktop/mobile
  evidence. Governance-only migrations additionally require exact generated
  HTML/CSS/JS parity with the recorded baseline.

## Figma parity

Current-reference exports must use canonical site copy and normalized
HeroMedia, CollaborationMark, and Featured records. Their map includes global
Press. They show the current Hero photograph and role treatment, the complete
collaboration wall, the current shared Featured 16:9 family and allowed
presentation variants, one equal Archive family, and the same optional-module
rules. Experimental Figma frames must be labeled as experiments and cannot be
mistaken for the current reference.

The hardcoded plugin under `figma/hsin-portfolio-importer/` is a retained
legacy experiment, not an active current-reference consumer and not a
bidirectional importer. Use `npm run figma:export` for current design handoff.
Do not reactivate the plugin until it is generated from or translated through
the normalized contracts and receives its own parity review.

## Regression map and rollback

- Contract/source validation: `tests/portfolio-contract.test.mjs`.
- Report-only inventory/drift: `tests/design-contract-audit.test.mjs` and
  `npm run audit:design-contract`.
- Production output/anatomy: `tests/build-site.test.mjs`.
- Design handoff parity: `tests/figma-export.test.mjs`.
- Baseline fingerprints:
  `docs/reviews/portfolio-design-contract-baseline-v1-2026-08-03.json`.

For this governance migration, any unapproved website output difference rolls
back to `90b5d1ae5e32126c78672df33c4c6f4eaa7f0642`. A later approved content or
visual package must record a new baseline instead of silently replacing this
one.
