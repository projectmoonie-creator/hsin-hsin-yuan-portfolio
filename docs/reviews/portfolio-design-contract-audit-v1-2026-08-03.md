# Portfolio Design Contract Audit v1

Date: 2026-08-03

State: `PROPOSED_FOR_APPROVAL`

## Outcome

The current site is visually coherent, but its rules are not yet represented
by one coherent contract. The repeated cleanup work came from three layers
being mixed together:

1. source/evidence records;
2. public component anatomy;
3. responsive presentation variants.

The recommended architecture preserves varied source evidence, normalizes it
into strict public view models, and lets the live site, Figma current-reference
exports, and tests consume the same named component contracts.

## Current Approved Design Rules

### Source of truth

- Canonical content: `data/*.json` and `content/**/*.md`.
- Production presentation: `scripts/build-site.mjs`, `src/styles.css`, and
  `src/main.js`.
- Figma is a design/handoff layer, not the production source of truth.
- Dated specs and reviews are decision history. They are not current rules when
  they conflict with the Bible, Status, canonical data, or production code.

### Section order

1. Hero
2. Platforms & Collaborations
3. Screening Strip
4. Available For
5. Featured Works
6. FROM THE ARCHIVE
7. PRESS
8. Contact

### Responsive states

| Range | Current contract |
| --- | --- |
| Above 1280 px | Hero uses its desktop two-column composition. |
| 1280 px and below | Hero becomes one column. |
| 980 px and below | Archive chronology becomes one column. |
| 820 px and below | Mobile navigation; Featured sticky stack becomes normal flow; every Featured media frame is 16:9; global Press and Contact become one column. |
| 460 px and below | Archive and global Press use their compact small-mobile spacing/type rules. |
| Reduced motion | Hero ambient motion and work/archive reels are suppressed; static posters and all links remain usable. |

### Screening Strip

- Purpose: lightweight visual index, not the detailed case-study surface.
- Card anatomy: platform/year, title, role, tagline.
- Default action: jump to the matching Featured Work.
- Explicit exception: open the canonical work destination when
  `watchLoopTarget` is approved.
- Visual geometry: 16:10 cards with a fixed outer edge fade; no moving media in
  the strip.

### Featured Work

- One public anatomy and order: year/role/platform, title, tagline,
  description, tags, optional metrics, optional work-specific Press, optional
  exceptional text action.
- Wider screens use the existing two-column card. Current production computes
  `0.9fr / 1fr`; previous “40/60” wording is treated as visual shorthand, not
  an exact ratio, unless a later visual package changes it deliberately.
- Desktop media has two intentional treatments:
  - `fill-card`: Slow Steps, Tech Dreamers, My Art, My Voice, and Top Gear.
  - `centered-16x9`: Design & Brand Films and Nothing by Bus.
- At 820 px and below, all six use one 16:9 media rule.
- Source-embedded program names/logos are allowed. The current site adds no
  separate title overlay to any Featured media.
- The image/play surface is the normal primary watch action.
- Text actions remain only for approved playlist/selection exceptions:
  Design's selected reel and Nothing by Bus's full series.

### Archive

- One descending chronology controlled by canonical `order`.
- All entries use one equal-card family and one internal copy/media split.
- The fifth single desktop card remains an ordinary half-row card; it does not
  span.
- Required visible anatomy: year/role, title, media or index placeholder, and
  optional watch/credit actions.
- Poster absence changes capability, not card size or hierarchy.
- Archive explanations and decorative external-link arrows are absent.

### Press

- Work Press and global Press are two deliberate component families.
- Work Press may use a verified source thumbnail and belongs to its project.
- Global Press is low-priority, text-only, and ordered newest first. Its visible
  anatomy is part label, year, title, and source.
- Global Press does not repeat participation/featuring descriptions already
  implied by ownership of the portfolio.

### Media and field ownership

- One visible identity owner per media surface: source artwork or site overlay,
  never both.
- Public media remains link/embed-first unless rights authorize local use.
- Rendered fields, evidence/provenance fields, and retired fields must not be
  indistinguishable in the same contract.
- Optional modules are omitted deterministically; works are not required to
  invent empty metrics, tags, links, or Press merely to satisfy visual symmetry.

## Drift Found

1. Featured desktop variants are inferred through `featuredMediaAspect` or
   field absence, rather than an explicit variant name.
2. `hideMediaLabel` is a negative boolean and does not distinguish source title
   presence from site overlay behavior.
3. Media metadata uses mixed shapes/names (`focalPoint` and
   `posterFocalPoint`); several fields are validated only by tests and not
   consumed by the renderer.
4. Archive retains active `platform`, `summary`, and `metrics` fields that the
   public renderer does not use, without declaring them evidence-only or
   retired.
5. Content loaders do not validate one project-wide schema; Figma validation
   checks only slug/order uniqueness.
6. CSS, Figma export, and design documents independently repeat tokens and
   component assumptions.
7. Current Figma/design drift includes the retired mobile hero slash, obsolete
   Archive lead/supporting variants, missing global Press in the section map,
   an obsolete horizontal-Featured site spec, and differing token sets.
8. Many regression rules are accurate but expressed as scattered exact
   CSS/HTML substring checks added after changes, rather than as one prior
   contract.

## Options

### A. Hybrid contract, two packages — recommended

First create the contract and a report-only inspector with no visual change.
Then add dependency-free source-to-view-model normalization and update site,
Figma current references, and tests incrementally behind parity checks.

### B. Documentation only

Update the Bible/design-system/Figma documents but leave flat records and
renderers unchanged. This is fast but future drift remains mechanically easy.

### C. Full strict migration now

Reshape every record, renderer, token, and design artifact at once. This is the
cleanest endpoint but the worst fit for a nearly finished site because it has
the largest regression and evidence-loss surface.

## Reusable Skill Principles Proposed

If Option A is approved and the project contract proves useful, add only these
general principles to `portfolio-narrative-builder`:

1. Define the format contract before populating many records.
2. Classify fields as required rendered, optional rendered, evidence-only, or
   retired.
3. Normalize heterogeneous source records into strict public view models.
4. Name intentional variants; do not infer major presentation from missing
   fields or one-off CSS.
5. Assign media identity to one visible owner.
6. Define responsive invariants separately from per-item content.
7. Map every canonical rule to bilingual output, design handoff, tests, and
   generated artifacts.
8. Pilot minimum, maximum, and exceptional records before scaling.
9. Require every new variant to declare anatomy, responsive behavior,
   fallback, and regression evidence.

Exact colors, breakpoints, ratios, component names, section order, and copy
remain project-specific.

## Multi-AI Provenance

- Frozen problem frame SHA-256:
  `c0088ddc50fe45f275d82569b7a49cbb6329c1068d6461d6fbe1a9652fb38611`.
- Codex: completed; exact root runtime model ID was not exposed and was not
  invented.
- Gemini: requested / observed / completed `gemini-3.6-flash`.
- Claude: incomplete `handoff-to-active-session`; no model request or paid
  fallback was used.

## Decision Gate

No design-contract implementation or skill edit begins until the producer
chooses Option A, B, C, or another boundary.
