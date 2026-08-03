# Final content cleanup design

Date: 2026-08-03  
Branch: `codex/final-content-cleanup`  
Base: local `main` at `da91e25f9f306f526ede45a53c5d542be93088ba`

## Goal

Apply the user's seven annotated mobile refinements as one narrow closing
package. Remove duplicate visual and textual information while preserving the
approved portfolio hierarchy, media, links, evidence, card proportions, and
desktop/mobile behavior.

## Approved interpretation

The user accepts titles or logos already embedded in an original image or
video frame. The site must stop adding a second HTML title layer over the large
Featured Works media. This distinction is especially important for Tech
Dreamers: its official TaiwanPlus artwork already contains the series title,
and that source artwork remains unchanged.

## Featured Works media labels

Use the existing canonical `hideMediaLabel` field rather than card-specific
CSS. Set it for:

- Tech Dreamers;
- My Art, My Voice;
- Nothing by Bus;
- Top Gear China: UK Special.

Slow Steps and Design & Brand Films already use this field. After the change,
all six Featured Works cards follow the same rule: the media contains only its
source bitmap or reel plus the existing play control. The accessible media-link
label and the card title below the image remain.

Remove Top Gear's now-unused `mediaTitleLines` data so the retired overlay
cannot be recreated later. Do not edit, crop, inpaint, download, or replace any
source image or reel in this package. Titles already embedded by TaiwanPlus or
inside a source video are accepted.

## Press hierarchy

Move only the Very Mulan director interview out of the My Art, My Voice card
and into the global `PRESS` section. The My Art card keeps its TaiwanPlus
official page and Mirror Media project coverage.

The global Press order is newest first:

1. Very Mulan director interview — `2025`;
2. Women Make Waves Film Festival Selection Guide `PART 1` — `2021`.

The left label remains meaningful to each source:

- `INTERVIEW` / `訪談` for Very Mulan;
- `PART 1` / `上半場` for Women Make Waves.

The right column uses one concise pattern for both records:

1. year only;
2. source title;
3. publication or event source.

Retire the global Press `type` and `context` presentation. Specifically, remove
`Festival conversation` / `影展對談` and `Featuring Hsin-Hsin Yuan` /
`袁欣欣參與對談`. Preserve the verified public destinations, metadata audit
fields, and source-page links. The Women Make Waves record retains its verified
speaker status; both records are classified as public-link-only. Press remains
text-only and stays between Archive and Contact.

## Archive and Design trims

- Keep the `FROM THE ARCHIVE` heading and chronology, but remove the English
  and Chinese archive explanatory paragraphs from canonical site copy and
  generated pages.
- Remove the shared `editing` tag from Design & Brand Films. Its role line
  continues to state `Director / Editor`, so no credit is lost.

## Rendering and design-system boundaries

This is a content-ownership cleanup, not a redesign.

- Do not change the approved mobile `16:9` media ratio.
- Do not change desktop Featured Works geometry.
- Do not change typography, color, spacing, card borders, play controls,
  metrics, Press 40/60 layout, Archive cards, or Contact.
- The renderer should conditionally omit the archive paragraph when no
  subcopy exists; it must not emit an empty paragraph.
- Global Press rendering must not create empty separators when context is
  absent.
- Website and Figma exports continue to consume canonical work data. The
  Design tag removal must propagate to the Figma work card; Figma currently
  does not add Featured Works media-title overlays or render global Press.

## Validation contract

Use test-first implementation. Before production edits, add focused assertions
that fail against the current site and prove:

- the four newly approved works render no `.media-label` while retaining their
  media links and accessible play labels;
- no Top Gear `mediaTitleLines` overlay survives;
- the Very Mulan interview appears once, in global Press, above the 2021 Women
  Make Waves record;
- global Press shows `2025` and `2021` without `Festival conversation`,
  `Featuring Hsin-Hsin Yuan`, or their Chinese equivalents;
- global Press remains text-only and both destinations retain audit metadata;
- archive explanatory copy and empty archive paragraphs are absent in both
  languages;
- the Design `editing` tag is absent from canonical work data, generated HTML,
  and Figma export while the Editor role remains.

Then run the full unit suite, site build, Figma export, private-path scan, and
`git diff --check`. Browser QA must cover English and Chinese at desktop,
tablet, and both approved mobile widths, plus reduced motion, JavaScript
disabled, keyboard focus, horizontal overflow, and console/page errors.
Visually inspect the four affected media frames and the reordered global Press
section.

## Rights, publishing, and non-goals

- Preserve all current media rights and source metadata.
- Do not publish or copy the user's annotation screenshots into the repository.
- Do not touch the protected untracked duplicate review file.
- Do not rewrite unrelated featured copy, Press titles, Archive cards, metrics,
  links, or the contact form.
- Do not deploy a Preview, push, merge, delete a branch, or promote Production
  without a separate request after local validation.

## Rollback

The package is isolated on `codex/final-content-cleanup`. Its content and
renderer changes can be reverted as one work package without changing the
previous local-main checkpoint or the last approved Preview.
