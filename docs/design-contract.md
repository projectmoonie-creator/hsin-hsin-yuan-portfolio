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
differently, but a language must not silently gain or lose a public module.

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

## Screening Strip

Purpose: a lightweight visual index, not a duplicate case study.

| Class | Fields |
| --- | --- |
| Required rendered | canonical work target, platform/year, title, role, tagline, static poster or explicit supported fallback |
| Optional rendered | approved direct public destination through `watchLoopTarget: "watch"` |
| Evidence only | media rights/source/provenance |

- Cards are 16:10 with fixed outer edge fades.
- The strip contains no moving video.
- Default action jumps to the matching Featured Work.
- A direct external action is an explicit exception, never inferred from the
  presence of a URL.

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
| `fill-card` | Slow Steps; Tech Dreamers; My Art, My Voice; Top Gear China: UK Special | Media fills the approved Featured card media area. |
| `centered-16x9` | Design & Brand Films; Nothing by Bus | A 16:9 image/reel is vertically centered in its side of the card. |

At `820px` and below, every Featured media surface becomes 16:9. The mobile
rule is invariant; it is not a third per-work exception.

Every work declares:

```json
{
  "presentation": {
    "desktopMediaVariant": "fill-card",
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

## FROM THE ARCHIVE

Archive is one descending chronology controlled by canonical `order`.

| Class | Fields |
| --- | --- |
| Required rendered | `slug`, `order`, `year`, bilingual `title`, bilingual `role` |
| Optional rendered | poster or index fallback, image alt/fit, public watch action, credited-role action, approved card reel |
| Evidence only | platform, summary, metrics, source note, rights/provenance fields, official-source verification not shown in the card |

- Every entry uses the `standard` card family and the same internal copy/media
  split.
- Poster absence changes capability, never card size or hierarchy.
- The fifth single desktop entry remains an ordinary half-row card; it does
  not span.
- Archive has no explanatory subcopy and no decorative external-link arrows.

## Press

Work Press and global Press are different schemas.

### Work Press

- Variant: `thumbnail-card`.
- Required: bilingual type/title, source, canonical URL, title source, image
  source, and metadata checked date.
- Optional: verified source thumbnail.
- It belongs inside its Featured Work and may use a verified image.

### Global Press

- Variant: `text-note`.
- Required: id, order, year, bilingual part label/title/source, canonical URL,
  title source, image source statement, and metadata checked date.
- It is text-only, low priority, and newest first.
- Participation descriptions that merely repeat ownership of the portfolio are
  evidence-only and are not rendered.

## Hero, Contact, and responsive invariants

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
Featured records. Their map includes global Press. They show the current Hero
role treatment, the two named Featured variants, one equal Archive family, and
the same optional-module rules. Experimental Figma frames must be labeled as
experiments and cannot be mistaken for the current reference.

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
