# Collaboration Logo Wall Source Notes

Updated: 2026-07-30

## Presentation Decision To Implement

- Replace normal-state text labels in `Platforms & Collaborations` with the
  collaborators' official marks.
- Preserve the original downloaded SVG or PNG locally. Apply grayscale,
  opacity, and hover treatment in CSS rather than destructively recoloring the
  source file.
- Normalize logos by optical height, not identical width. Keep their accessible
  names and official destinations even when visible text is removed.
- Use a text fallback only when an asset fails to load or no trustworthy mark
  has been verified.
- `data/collaborations.json` remains the canonical owner for website and Figma
  output. Do not create a second hand-maintained logo list.
- The wall identifies past platforms and collaborators; it must not imply
  endorsement or current representation.

## Source Checkpoint

| Entry | Status | Source |
| --- | --- | --- |
| TaiwanPlus | Official asset verified | `https://www.taiwanplus.com/imgs/header/logo-light.svg` |
| PTS | Official asset verified | `https://www.pts.org.tw/uploads/site/site_logo/67a324283673761a67eaedf8/logo__4_-01.png` |
| Gorgeous Space | Official inline SVG verified; extraction pending | `https://www.hhh.com.tw/` |
| TICFF | Official site verified; asset extraction pending | `https://www.ticff.org.tw/` |
| Women Make Waves | Official site verified; no standalone downloadable mark confirmed in the first pass | `https://www.wmw.org.tw/` |
| Dragon TV | Pending | The previously recorded domain failed DNS during this pass; do not use an unverified download. |
| ScreenHouse | Pending identity check | Confirm the exact collaborator and official domain before selecting a mark. |

## Rights Boundary

Use official marks only as nominative identification inside the collaboration
wall. Do not redraw, distort, combine, or generatively imitate them. If an
official asset cannot be verified, keep the current accessible wordmark until
the user supplies or confirms the correct logo.
