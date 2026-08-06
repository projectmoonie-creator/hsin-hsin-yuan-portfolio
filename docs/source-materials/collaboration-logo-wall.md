# Collaboration Logo Wall Source Notes

Updated: 2026-08-06

## Presentation Decision To Implement

- Use verified official marks in `Platforms & Collaborations`; keep visible
  text fallbacks for identities without a trustworthy standalone mark.
- Preserve verified SVG/PNG downloads under
  `assets/collaboration-logos/sources/`. They are private build inputs, not
  public website files.
- Generate deterministic cream monochrome derivatives with
  `npm run collabs:prepare`. The command verifies the recorded source hash,
  rejects unsafe SVG structures, and performs no network access.
- Normalize logos by optical height, not identical width. Keep their accessible
  names and official destinations even when visible text is removed.
- Use a text fallback when no trustworthy mark has been verified. A verified
  derivative that fails to load is a build/QA failure, not permission to hide
  a second hand-maintained name in the component.
- `data/collaborations.json` remains the canonical owner for website and Figma
  output. Do not create a second hand-maintained logo list.
- The wall identifies past platforms and collaborators; it must not imply
  endorsement or current representation.

## Source Checkpoint

| Entry | Status | Source |
| --- | --- | --- |
| TaiwanPlus | Complete: official SVG preserved and monochrome derivative generated | `https://www.taiwanplus.com/imgs/header/logo-light.svg` |
| PTS | Complete: official PNG preserved and monochrome derivative generated | `https://www.pts.org.tw/uploads/site/site_logo/67a324283673761a67eaedf8/logo__4_-01.png` |
| Dragon TV | Complete: producer-supplied transparent PNG preserved and monochrome derivative generated | Official identity/destination: `https://www.dragontv.cn/`; exact supplied bytes are SHA-locked in the canonical record. |
| TICFF | Complete: official SVG preserved and monochrome derivative generated | `https://www.ticff.org.tw/uploads/asset/data/6740190236737693d3c91a52/logo-ticff-d.svg` |
| ScreenHouse | Complete: official homepage inline SVG preserved and monochrome derivative generated | `https://www.screenhouse.co.uk/` |
| Gorgeous Space | Complete: official SVG preserved and monochrome derivative generated | `https://hhh.com.tw/images/logo-color.svg` |
| Women Make Waves | Text fallback | Official site confirmed, but no clean standalone asset was verified. |

Exact source hashes, checked dates, intrinsic dimensions, rights status, and
optical tokens live with each complete logo record in
`data/collaborations.json`. Public renderers receive only normalized
presentation data.

## Maintenance Workflow

1. Add, remove, rename, or reorder the stable record in
   `data/collaborations.json`.
2. For a verified mark, preserve the official original in
   `assets/collaboration-logos/sources/` and add the complete source evidence,
   public derivative path, dimensions, and optical token to that record.
   Producer-supplied bytes must remain distinguishable from a downloaded
   official asset in this source note.
3. When an official SVG has opaque presentation backgrounds, use the optional
   evidence-only `sourceTreatment` field rather than editing the preserved
   source. `remove-background-rects` is SVG-only, allowlisted, and must remove
   at least one rectangle or fail; inspect the derivative because it is an
   explicit source-specific decision, not a default transformation.
4. Run `npm run collabs:prepare`, `npm test`, `npm run build`, and
   `npm run figma:export`.
5. Review English and Chinese at desktop/mobile widths. No component or CSS
   edit should be necessary for an ordinary data-only addition or removal.

## Rights Boundary

Use official marks only as nominative identification inside the collaboration
wall. Do not redraw, distort, combine, or generatively imitate them. If an
official asset cannot be verified, keep the current accessible wordmark until
the user supplies or confirms the correct logo.
