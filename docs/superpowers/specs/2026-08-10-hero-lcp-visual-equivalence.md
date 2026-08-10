# Hero LCP visual-equivalence specification

Subject: Hsin-Hsin Yuan's bilingual documentary-director portfolio. Audience: international commissioners, producers, and Taiwan-based collaborators. Page job: establish identity and proof quickly without changing the already approved visual thesis.

## Design pass 1 — explicit keep/change rules

| Axis | Keep | Change |
| --- | --- | --- |
| Type | Every font, weight, size, line break, role slash, and bilingual omission | Nothing |
| Color | Existing black/white/acid palette and both Hero gradient overlays | Only move the image out of the CSS background layer |
| Spacing | Hero padding, grid gap, media/text rectangles, section height, and breakpoints | Nothing |
| Shape | Existing 8px frame radius and wide/stacked/mobile aspect ratios | Nothing |
| Image | Exact approved source, localized alt, focal points, start/end/reduced crop, and contrast | Semantic `<picture>/<img>` plus format/width delivery candidates |
| Motion | Existing 18s ease-in-out infinite alternate slow-push feel and pan direction | Implement the same endpoints with compositor-only image `transform` |
| Desktop | Two columns above 1280px; current media/text geometry | Responsive candidate selection sized to the existing media column |
| Mobile | Stack, 1/0.94 frame, current crop, copy order, fixed navigation | Mobile candidate profile; no layout or interaction change |
| Reduced motion | Completely static approved crop | Ensure the image transform is static rather than merely pausing animation |

The existing signature remains the bright white-studio portrait slowly pushing under restrained dark gradients. No new aesthetic risk is introduced; the implementation risk is crop drift, so all available freedom is spent on faithful delivery and motion math.

## Design pass 2 — self-critique

A generic responsive-image refactor would use `object-fit: cover; transform: scale(1.4)` at every breakpoint. That is not specific enough here: the stacked frame is width-constrained while wide/mobile frames are height-constrained, and the current CSS defines absolute image-height percentages. The candidate must therefore derive breakpoint-specific transform scales and translations from the approved frame/image geometry instead of copying generic motion values.

## Objective equivalence gates

- Frozen before evidence: desktop 1440×900 start/end, mobile 390×844 start/end, and mobile reduced-motion static.
- Hero, media, and text rectangles may differ by at most 0.5 CSS px on any recorded edge or dimension.
- Matched Hero screenshot RGB mean absolute error must be ≤5/255, with at least 98% of channel samples within an absolute difference of 16; geometry is evaluated separately so codec noise cannot excuse crop drift.
- Start/end/reduced focal composition must pass the same thresholds; matching only one still is insufficient.
- Normal motion may animate only the `<img>` transform; reduced motion must report `animation-name: none` and one static transform.
- No new focus target, control, Play affordance, copy, overflow, or Contact request is allowed.
