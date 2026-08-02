# Archive Uniformity And English Copy

Date: 2026-08-03

Status: Approved for implementation

Closed baseline: `portfolio-phase-2026-07-29-closed`

Working branch at approval: `codex/contact-archive-entrypoints`

Working commit at approval: `718fb6a839f5cd1ec4dbfdb7738d16c1346b3ce5`

## Goal And Scope

Refine the current bilingual portfolio without changing its overall visual
identity. This package has five connected outcomes:

1. replace three English Featured Work descriptions with concise,
   program-led copy;
2. expose the existing Tech Dreamers official TaiwanPlus page in the same
   visible pattern used by My Art, My Voice;
3. replace the mixed Archive hierarchy with equal half-grid cards;
4. enforce a deliberate two-line English contact heading; and
5. vertically center near-16:9 preview reels inside large Featured Work media
   columns instead of leaving the media frame aligned to the top.

English copy changes are English-only. Existing Chinese work titles,
descriptions, and taglines remain unchanged. Shared layout improvements apply
to both languages.

## Decisions And Alternatives

### Featured Work copy

Three directions were considered: CV-led summaries, program-led summaries,
and more poetic positioning. The selected program-led approach matches the
approved TaiwanPlus work cards: identify the program, then say what the viewer
actually encounters. It avoids agency language and unsupported promotional
claims.

### Archive structure

Three layouts were compared:

1. retain the large Overclocking lead card;
2. use equal cards with media stacked above text; or
3. use equal half-grid cards with text and media split inside each card.

The selected third option keeps the Archive chronological and consistent while
giving the Overclocking reel enough room to play. The selected internal ratio
is 40% text and 60% media.

### Contact heading

Two two-line breaks were considered. The selected break is `Let’s build` on
line one and `a story together.` on line two because it remains intentional on
narrow screens and keeps the emphasized word at the end of the thought.

## Locked English Copy

### Design & Brand Films

Title:

> Design & Brand Films

Tagline:

> How design becomes part of everyday life.

Description:

> Films about residential design and brand collaborations, following how
> homes are planned, renovated, and lived in—from a designer’s choices to the
> routines that fill the finished space.

The canonical English title replaces `Interior Design & Branded Films`.
Because the screening-strip thumbnail, Featured Work card, generated site, and
editable design output consume the same work record, all of those surfaces
must show `Design & Brand Films`. No hand-written thumbnail-only label is
allowed.

### Nothing by Bus

Tagline:

> Taiwan, one bus route at a time.

Description:

> A Taiwanese-language travel series following local buses off the main road
> and into the food, work, and daily life of each stop.

### Top Gear China: UK Special

Tagline:

> A world-renowned car show, reimagined for China.

Description:

> For the UK Special, the Chinese production travelled to Britain to work with
> the original Top Gear team on a cross-border factual-entertainment shoot.

The copy does not claim a role, collaboration scope, or production fact beyond
the verified project record.

## Tech Dreamers Official Entry

Keep the current canonical TaiwanPlus destination:

`https://www.taiwanplus.com/shows/documentary/business-and-tech/590/tech-dreamers`

The official page remains the destination of the Tech Dreamers Featured Work
image and the screening-strip card. Add a visible official-page card beneath
the Featured Work copy using the same Press & Interviews card structure as the
first My Art, My Voice entry:

- type: `Official page` / `官方節目頁`;
- title: `Official program page` / `官方節目頁`;
- source: `TaiwanPlus`;
- canonical URL: the series URL above;
- image: the existing canonical Tech Dreamers official series artwork;
- title source: official platform page;
- image source: official platform series artwork;
- metadata checked date: `2026-08-03`.

This creates a visible entry point without introducing a second destination.
The official page was re-verified during design closure and still presents the
Tech Dreamers series and episodes.

## Archive Visual And Content Contract

### Collection and order

Keep the current descending chronology and its five canonical records:

1. Ghost Hand, Divine Car / 鬼手神車 — 2018;
2. Three-Minute Micro Drama — 2017–2018;
3. Heart of Steel — 2014–2015;
4. Lying Game — 2013–2014;
5. Overclocking — 2011–2013.

All five records use one Archive card renderer and one visual class family.
Retire the active lead-card branch and the full-row Overclocking sizing. The
fifth card follows normal grid flow in the left half of the last desktop row;
it is not centered, enlarged, or stretched across the empty half.

### Desktop card geometry

- Use a two-column grid with equal column widths and consistent gaps.
- Every Archive card has the same outer dimensions within the responsive
  state.
- Split every card internally into 40% text and 60% media.
- Keep the media surface close to 16:9 and use `object-fit: cover` with a
  centered focal position unless canonical media data specifies a different
  approved focal point.
- Do not add letterbox bars merely to preserve the entire source frame.

### Card contents

The text side uses one stable order:

1. year and role;
2. work title; and
3. one truthful action when a verified destination exists.

Long summaries and metrics are not rendered inside Archive cards. A record
without a verified public destination does not receive a fake action or an
empty link.

The media side uses the canonical poster or reel when available. Text-only
works receive the same neutral numbered surface seen in the approved visual
direction; they never borrow an unrelated photograph. Alt text, link
destination, and rights status remain owned by canonical content data.

### Overclocking behavior

Overclocking uses the approved local poster and silent card reel inside the
same 60% media area as every other Archive work. Preserve the current
after-hold behavior:

1. show the poster immediately;
2. request playback only after the existing 1400 ms qualifying in-view hold;
3. reveal the reel only after playback starts;
4. reset to the beginning and restore the poster when it leaves the qualifying
   state or the document becomes inactive; and
5. fail closed to the poster when playback is unavailable.

At `prefers-reduced-motion: reduce`, do not play the reel. With JavaScript
disabled, the poster, metadata, and verified destination remain usable.

### Responsive behavior

At the approved desktop and compact-desktop ranges, the Archive remains two
columns. At tablet and mobile ranges it becomes one column. The internal 40/60
text/media split remains intact rather than stacking the media above the text.
Type and spacing may compact responsively, but titles must wrap without
clipping or truncation and cards remain equal in size within each responsive
state.

## Large Featured Work Reel Alignment

For a large Featured Work preview whose media frame is near 16:9, center the
entire media frame vertically within its media column. The current top-aligned
state is retired. This is a container-alignment requirement, not only an
`object-position` change: the frame itself sits at the middle of the available
upper/middle/lower space, and the reel content is also centered within that
frame.

The change applies consistently to qualifying large Featured Work preview
reels, including Design & Brand Films and Nothing by Bus. Poster, playing,
reduced-motion, loading-failure, and no-JavaScript states must occupy the same
centered geometry so the card does not jump when playback begins.

## Contact Heading Contract

The English contact heading renders as exactly two explicit lines:

> Let’s build<br>
> a story together.

Only `together.` uses the acid accent. The line break is structural and does
not depend on incidental browser wrapping. Represent the three semantic text
parts in canonical localized data so the generator, site, and design output do
not maintain separate copies:

- line-one lead: `Let’s build`;
- line-two bridge: `a story`;
- line-two accent: `together.`.

Keep the existing Chinese wording. Its current lead and accent remain the
localized source; an empty bridge is valid.

## Architecture And Data Flow

The canonical flow remains:

`content/data records → site generator → bilingual HTML/assets → design export`

Implementation must change the owning layer instead of adding late CSS or
runtime patches:

- Featured Work English copy and Tech Dreamers entry live in their canonical
  work records.
- Contact title segments live in localized site copy.
- One Archive renderer handles media and text-first records through optional
  canonical media fields.
- Archive geometry and large-card centering are owned by their existing CSS
  component rules.
- Existing reel controllers keep playback state; the layout package does not
  create a second video runtime.

The retired Archive lead marker or lead-only class must not remain capable of
recreating a full-row card.

## Accessibility And Failure Handling

- Existing keyboard destinations remain visible and receive a clear focus
  state.
- A single canonical destination must not become duplicated, contradictory
  links with different labels.
- Missing media renders the neutral text-first surface without broken-image
  chrome.
- Remote Tech Dreamers image failure leaves readable official-page text.
- Video rejection, slow loading, reduced motion, or disabled JavaScript leaves
  a stable poster and does not move the large Featured Work frame back to the
  top.
- Card titles and actions remain readable at 360 px without horizontal body or
  component overflow.

## Test And Review Contract

Implementation is test-first. Automated tests must prove:

- the three locked English copy records render exactly and their Chinese copy
  remains unchanged;
- `Design & Brand Films` propagates to the Featured Work card,
  screening-strip thumbnail, and existing generated design payload/output;
- Tech Dreamers renders the audited official-page card with the canonical URL
  and bilingual labels;
- all five Archive records use the uniform renderer in canonical order;
- no active lead class or full-row Archive behavior is generated;
- Archive text-only fallbacks, verified actions, Overclocking poster/reel, and
  reduced-motion/no-JavaScript states remain truthful;
- the two-line English contact structure and accent placement are exact; and
- qualifying large 16:9 Featured Work media frames are vertically centered in
  poster and reel states.

Run the complete existing test and build suite after focused tests. Visual QA
must cover English and Chinese at 1440×900, 1200×900, 834×1112, 390×844, and
360×800, plus reduced motion, JavaScript disabled, keyboard-only navigation,
and overflow checks. Verify the intended worktree and built fingerprint before
capturing screenshots.

After QA, create or update only a non-production Vercel Preview. Production
routing and the production domain remain untouched until separately approved.

## Non-Goals

- No Chinese copy rewrite for Design & Brand Films, Nothing by Bus, or Top
  Gear China in this package.
- No new Archive stills or new reels beyond the already approved Overclocking
  assets.
- No new detail pages, collaboration-logo work, SEO taxonomy change, or
  production deployment.
- No Git history rewrite, deletion of older deployments, or change to the
  closed baseline tag.
- No independently maintained Archive ordering list or second copy source in
  design-import code.

## Rollback And Worktree Safety

The closed baseline tag `portfolio-phase-2026-07-29-closed` remains untouched.
Implementation continues on the existing review branch and must preserve all
pre-existing tracked and untracked work. The design-spec commit stages only
this file; later implementation commits must stage explicit in-scope paths and
must not modify or delete the pre-existing duplicate review file.
