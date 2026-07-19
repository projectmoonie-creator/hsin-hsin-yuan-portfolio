# Legacy Fingerprint Audit

Read this before reshaping an existing site. The goal is not novelty for its own sake; it is to separate intentional continuity from visual residue that makes a claimed redesign look like the old site with a new skin.

## 1. Establish the baseline

Capture the current production site before editing:

- desktop opening, primary transition, and work state at a fixed viewport;
- mobile opening and work state at a fixed viewport;
- reduced-motion state when motion carries hierarchy;
- active design exports or generators that could recreate the old system.

Record the URL, viewport, scroll state, branch or commit, and date. Do not use memory as the baseline.

## 2. Inventory fingerprints

Audit source, generated output, and screenshots. Search for:

- palette tokens and distinctive hard-coded colors;
- font families, case, italics, tracking, and scale ratios;
- navigation silhouette and CTA treatment;
- hero composition, crop, layer order, and first transition;
- section rhythm, card geometry, borders, shadows, and corner radii;
- marquee, glow, WebGL, pointer, parallax, sticky, or reveal behaviors;
- repeated class names, component structures, and generator templates;
- Figma or other design exports that still encode the retired architecture.

Use this ledger:

| Fingerprint | Evidence | Salience | Decision | Replacement or reason to keep | Owning source | Regression proof |
|---|---|---:|---|---|---|---|
| Acid accent | CSS token + hero screenshot | High | Replace | Restrained scene signals | tokens/source CSS | source test + screenshots |

Every high-salience fingerprint needs an explicit `keep` or `replace` decision before implementation. Keep accessible semantics, approved content, and useful data infrastructure when appropriate; do not keep a distinctive visual convention merely because it already works.

## 3. Replace at the owner

- Edit the original token, component, controller, or generator that owns the behavior.
- Remove retired imports and generated assets after confirming they have no active references.
- Update design generators and exports in the same change when they are active deliverables.
- Add negative tests for retired colors, selectors, DOM structures, libraries, or effects when their return would materially change the site.

Do not claim a material redesign when the old stylesheet or scene controller remains intact beneath a tail override. A late override may be used for a local exception, not as the architecture of a new visual system.

## 4. Verify matched before/after states

Compare old and candidate screenshots side by side at identical viewports and equivalent narrative states. Include at least desktop and mobile.

Ask:

1. Could an informed viewer reasonably call this the same site with a new skin?
2. Do hero composition, navigation silhouette, typography, section grammar, and dominant motion now express the approved direction?
3. Does the mobile layout preserve the new identity rather than falling back to the old card stack?
4. Are intentional keeps documented, and are all planned replacements visible in source and build output?
5. Can ordinary media replacements still be made through data rather than CSS?

Block publication when the answer to question 1 is yes, when any high-salience fingerprint is undecided, or when the new look exists only in overrides rather than the owning sources.
