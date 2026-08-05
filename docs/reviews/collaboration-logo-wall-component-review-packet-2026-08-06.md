# Collaboration Logo Wall Component — Frozen Read-only Review Packet

Frozen: 2026-08-06

## Objective

Review the completed low-risk public-output package that replaces a hardcoded
collaboration wordmark strip with one repo-configured `CollaborationMark`
family shared by the static website and generated Figma SVG handoff.

Repository branch: `codex/collaboration-logo-wall`

Package base: `c33b2f810e95ba2a38146b2daf7ff1220b0d1712`

Reviewed implementation head: `90e713cd1431a7dba5fc05150fd7698e71206709`

This is findings-only. Do not edit files, propose a redesign, request secrets,
push, merge, deploy, or treat unresolved identities as permission to invent a
mark.

## Intended Contract

- `data/collaborations.json` is the only authored list and has seven stable
  records in canonical order.
- Four records use verified official source files preserved outside the public
  tree: TaiwanPlus, PTS, TICFF, Gorgeous Space.
- Dragon TV, Women Make Waves, and ScreenHouse intentionally remain visible
  text fallbacks until a trustworthy standalone mark/identity is proven.
- A strict normalizer separates public fields from source URL/hash/date/rights
  evidence. Evidence must not enter HTML or Figma output.
- `npm run collabs:prepare` is offline: it verifies each recorded SHA-256,
  rejects unsafe SVG structures, and writes deterministic cream monochrome SVG
  derivatives under `public/assets/logos/`.
- Website layout is four centered slots per desktop row and two at `820px` and
  below; an incomplete last row centers without brand-specific CSS.
- Figma export consumes the same complete normalized list, token sizes, local
  derivatives, fallbacks, order, and four/two layout.

## Relevant Implementation

### Normalization and path boundaries

`scripts/lib/portfolio-contract.mjs` declares optical tokens:

```js
export const COLLABORATION_LOGO_OPTICAL_TOKENS = Object.freeze({
  compact: Object.freeze({ height: 40, maxWidth: 116 }),
  standard: Object.freeze({ height: 34, maxWidth: 142 }),
  wide: Object.freeze({ height: 28, maxWidth: 164 }),
});
```

`normalizeCollaboration()` rejects unknown top-level/logo/dimension fields,
requires kebab-case stable IDs and localizable name/label values, permits only
HTTPS destinations/evidence URLs, and accepts a logo only when every field is
present. Public and source paths are constrained by:

```js
/^\/assets\/logos\/[a-z0-9-]+-mono\.svg$/
/^assets\/collaboration-logos\/sources\/[a-z0-9-]+\.(?:png|svg)$/
```

Dimensions must be positive integers; the optical token must exist; SHA-256 is
exactly 64 lowercase hex characters; checked date is `YYYY-MM-DD`; rights must
equal `official-mark-nominative-use`. The normalized contract is deeply frozen:

```js
const publicFields = {
  id: source.id,
  name: typeof source.name === "object" ? { ...source.name } : source.name,
  label: typeof source.label === "object" ? { ...source.label } : source.label,
  ...(source.url ? { url: source.url } : {}),
  logo: logo ? { src, dimensions, opticalSize, opticalToken } : null,
};
return freezeDeep({
  ...publicFields,
  contract: {
    kind: "collaboration-mark",
    public: publicFields,
    evidence: { logo: logoEvidence },
  },
});
```

`normalizeCollaborations()` rejects a non-array and duplicate IDs.
`scripts/build-site.mjs::loadSiteData()` normalizes the collection before any
website or Figma consumer receives it.

### Offline asset preparation

`scripts/prepare-collaboration-logos.mjs` accepts only PNG or SVG. SVG source is
rejected on any of these patterns:

```js
/<\s*(?:script|foreignObject|iframe|object|embed)\b/i
/\son[a-z]+\s*=/i
/(?:href|src)\s*=\s*["']\s*(?:https?:|\/\/|data:)/i
/@import\b/i
/url\(\s*["']?\s*(?:https?:|\/\/|data:)/i
/<!DOCTYPE\b/i
/<\?xml-stylesheet\b/i
```

For each normalized logo it joins the repo base with the already constrained
evidence source path, reads bytes, verifies SHA-256 before conversion, maps all
nontransparent pixels to `#F7F2E8` with a fixed `feColorMatrix`, embeds the
original bytes as a data URI, and writes only the already constrained public
logo path. The command never fetches `sourceUrl`.

### Website renderer and layout

`scripts/build-site.mjs::renderCollaborations()` uses only
`item.contract.public`. A verified logo is decorative inside a named wrapper:

```html
<a class="collab-item" data-collaboration-id="..."
   data-logo-size="..."
   style="--partner-logo-height: ...; --partner-logo-max-width: ..."
   href="https://..." target="_blank" rel="noreferrer" aria-label="Localized name">
  <img class="partner-logo" src="/assets/logos/...-mono.svg"
       width="..." height="..." alt="" aria-hidden="true" loading="lazy">
</a>
```

A fallback uses visible `<span class="partner-wordmark" aria-hidden="true">`
inside the same named link. ScreenHouse has no destination, so its wrapper is
`<div role="img" aria-label="ScreenHouse">`.

The shared CSS is:

```css
.collab-grid { display:flex; flex-wrap:wrap; justify-content:center;
  gap:clamp(1.1rem,2.4vw,2rem) var(--collab-slot-gap); }
.collab-item { display:inline-flex; flex:0 1 calc(25% - var(--collab-slot-gap));
  justify-content:center; min-height:4.75rem; }
.partner-logo { height:var(--partner-logo-height);
  max-width:min(100%,var(--partner-logo-max-width)); object-fit:contain; width:auto; }
@media (max-width:820px) {
  .collab-item { flex-basis:calc(50% - var(--collab-slot-gap)); min-height:4rem; }
}
```

Focus-visible uses a 2px acid outline. No collaborator name appears in CSS.

### Figma renderer

`collaborationMark()` uses `contract.public`. A logo's height is its optical
token capped by the slot; width derives from intrinsic aspect ratio and is
capped by the token/slot, then the image is centered. A fallback is centered
editable text. `collaborationWall()` computes row count and offsets each
incomplete row by `(fullRowWidth - rowWidth) / 2` without name-specific logic.
Desktop exports use four columns; the 390px mobile export uses two columns and
was extended to 1040px so all seven entries and Availability remain visible.

## Verification Already Completed

- TDD red/green was recorded for contract, asset, website, Figma, and unlinked
  fallback semantics.
- `npm run collabs:prepare`: four derivatives prepared.
- `npm test`: 92/92 pass.
- `npm run build`: pass.
- `npm run figma:export`: pass.
- `npm run audit:design-contract`: pass, no active drift.
- `git diff --check`: pass.
- Headless Chromium: English/Chinese at 1440×900 and 390×844 all pass; seven
  IDs in order, four loaded logos, three fallbacks, correct 4+3 / 2+2+2+1
  rows, centered incomplete rows, no horizontal overflow, visible keyboard
  focus, no evidence leak, and no console/page/request errors.
- Protected user-owned untracked review file retained exact SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`
  and is outside this package.
- No push, merge, Preview, or Production deployment occurred.

## Requested Review

Find only actionable defects introduced by this package. Prioritize:

1. correctness and fail-closed behavior of the data/evidence boundary;
2. asset-preparation path containment, source verification, and SVG safety;
3. accessibility of logo and text-fallback semantics;
4. responsive completeness/centering and absence of one-off brand logic;
5. website/Figma parity and maintenance regressions.

For each finding return `P0`, `P1`, or `P2`, a short title, exact repo-relative
file and line/function, the concrete failure mode, and the smallest fix. Do not
report preference-only design changes or pre-existing unrelated issues. If no
actionable finding exists, return exactly `PASS — no actionable findings` plus
one short residual-risk note.
