# Frozen read-only review packet — Collaboration Logo Wall logo completion

Date: 2026-08-06  
Repository: `hsin-hsin-yuan-portfolio-remove-lights`  
Branch: `codex/collaboration-logo-wall`  
Baseline HEAD: `7ba8a6215bd49714c3690e66b3a5ba74b44c3b1e`  
Scope state: uncommitted implementation diff; review before commit and local fast-forward merge

## Objective

Complete two previously honest text fallbacks in the existing seven-entry
`CollaborationMark` wall:

1. Dragon TV / 東方衛視: use the producer-supplied transparent PNG.
2. ScreenHouse: use the official inline SVG from the public company homepage.

Keep the repo-configured component contract, offline deterministic monochrome
derivatives, website/Figma parity, private provenance boundary, and the one
remaining Women Make Waves text fallback. The requested final state is six
verified logos and one fallback.

## No-edit instruction

Review only. Do not edit files, run deployment, push, merge, or suggest access
to credentials. Report findings only against this frozen packet.

## Non-goals

- No change to collaboration order, layout, copy, Hero, reels, deployment, or
  production state.
- No remote push or Preview/Production deployment.
- No claim that the marks imply endorsement; use is nominative identification
  of past collaborators.
- No fabricated WMW asset. It intentionally remains a text fallback.

## Source and rights evidence

### Dragon TV

- Producer supplied local file: transparent PNG, 170 × 122 RGBA.
- Source SHA-256:
  `0d56ec84ea9c29768628e71b7fb2c41332a25154f4f995940944a701cb6b35ff`
- Alpha bounding box observed locally: `(42, 13, 129, 110)`.
- Canonical site/link recorded as `https://www.dragontv.cn/`.
- Evidence status: `official-mark-nominative-use`; checked 2026-08-06.

### ScreenHouse

- Public source: `https://www.screenhouse.co.uk/`.
- The homepage header contains an inline official SVG with
  `viewBox="0 0 559.38 279.63" width="126" height="63"`.
- The exact inline SVG plus repository newline is retained as the source.
- Source SHA-256:
  `0aba4f30ef39a812a903f48a1c9d7a5f9cb4ad9ecb975993662b602e8a20940d`
- The SVG contains two opaque background rectangles followed by the actual
  `SCREEN 30 HOUSE` path artwork. The source remains unchanged; an explicit
  evidence-only treatment removes those rectangles before monochrome mapping.
- Evidence status: `official-mark-nominative-use`; checked 2026-08-06.

## Canonical data delta

```json
{
  "id": "dragon-tv",
  "name": "Dragon TV",
  "label": "DRAGON TV",
  "url": "https://www.dragontv.cn/",
  "logo": {
    "src": "/assets/logos/dragon-tv-mono.svg",
    "sourceFile": "assets/collaboration-logos/sources/dragon-tv.png",
    "dimensions": { "width": 170, "height": 122 },
    "opticalSize": "compact",
    "sourceUrl": "https://www.dragontv.cn/",
    "sourceSha256": "0d56ec84ea9c29768628e71b7fb2c41332a25154f4f995940944a701cb6b35ff",
    "sourceCheckedAt": "2026-08-06",
    "rightsStatus": "official-mark-nominative-use"
  }
}
```

```json
{
  "id": "screenhouse",
  "name": "ScreenHouse",
  "label": "ScreenHouse",
  "url": "https://www.screenhouse.co.uk/",
  "logo": {
    "src": "/assets/logos/screenhouse-mono.svg",
    "sourceFile": "assets/collaboration-logos/sources/screenhouse.svg",
    "dimensions": { "width": 126, "height": 63 },
    "opticalSize": "compact",
    "sourceUrl": "https://www.screenhouse.co.uk/",
    "sourceSha256": "0aba4f30ef39a812a903f48a1c9d7a5f9cb4ad9ecb975993662b602e8a20940d",
    "sourceCheckedAt": "2026-08-06",
    "rightsStatus": "official-mark-nominative-use",
    "sourceTreatment": "remove-background-rects"
  }
}
```

## Contract delta

`scripts/lib/portfolio-contract.mjs` adds one allowed evidence-only value:

```js
export const COLLABORATION_LOGO_SOURCE_TREATMENTS = Object.freeze([
  "remove-background-rects",
]);
```

The normalizer accepts the optional field, rejects values outside this list,
rejects use with non-SVG sources, keeps it out of `contract.public.logo`, and
copies it only to `contract.evidence.logo`.

## Derivative implementation delta

`scripts/prepare-collaboration-logos.mjs` now applies the opt-in treatment only
after the original SVG safety check and runs the safety check again afterward:

```js
function applySourceTreatment(source, mime, sourceTreatment) {
  if (!sourceTreatment) return source;
  if (sourceTreatment !== "remove-background-rects") {
    throw new Error(`unsupported collaboration logo source treatment: ${sourceTreatment}`);
  }
  if (mime !== "image/svg+xml") {
    throw new Error("remove-background-rects requires an SVG source");
  }
  const value = source.toString("utf8");
  const treated = value.replace(
    /<rect\b[^>]*\/\s*>|<rect\b[^>]*>[\s\S]*?<\/rect\s*>/gi,
    "",
  );
  if (treated === value) {
    throw new Error("remove-background-rects found no SVG rect elements");
  }
  return Buffer.from(treated);
}
```

The prepared bytes are then embedded as a local `data:` image inside the
existing deterministic wrapper SVG. The existing `feColorMatrix` maps every
nontransparent pixel to the portfolio cream color while preserving alpha.
The checked-in source files are never modified.

Existing SVG safety policy rejects scripts, `foreignObject`, iframe/object/
embed, event attributes, remote or data href/src, CSS imports/remote URLs,
doctype, and XML stylesheets. Source SHA-256 is verified before preparation.

## Tests added or changed

- Contract tests prove the treatment is evidence-only, allowlisted, and SVG-only.
- Derivative tests decode the embedded SVG and prove background `<rect>` nodes
  are removed while a path remains; PNG use is rejected.
- Canonical asset tests verify six sources, one fallback, source hashes, Dragon
  dimensions, and ScreenHouse URL.
- Website tests require six `<img class="partner-logo">` elements, one text
  fallback, both new derivatives, and the ScreenHouse official link.
- Figma tests require the same six-logo/one-fallback modes and both new sources.

## Validation already completed

- RED observed before implementation: three focused failures for the new
  treatment contract and derivative behavior.
- GREEN focused treatment/contract suite: 21/21.
- Focused website/Figma/asset/contract suite: 64/64.
- Full test suite: 93/93.
- `npm run collabs:prepare`: six deterministic derivatives prepared.
- `npm run build`: pass.
- `npm run figma:export`: pass.
- English/Chinese Chromium QA at 1440 × 900 and 390 × 844: pass.
  Six loaded logos, one fallback, expected canonical order, desktop 4+3,
  mobile 2+2+2+1, centered final row, zero horizontal overflow, links correct,
  focus outline present, no console/page/request errors, no provenance leak.
- Pixel inspection confirms ScreenHouse is transparent path artwork instead of
  a solid rectangle and Dragon TV retains its mark/text silhouette.

## Requested review dimensions

1. P0/P1 correctness or security defect in the optional SVG treatment.
2. Truth/rights/provenance mismatch in either source record.
3. Public/private contract leak or unsafe asset behavior.
4. Website/Figma synchronization or fallback-count mismatch.
5. Missing regression test that can realistically fail this exact package.

Do not block on subjective size preference unless there is concrete clipping,
overflow, invisibility, or brand-identity loss. Do not request a WMW logo.

## Required output schema

Return exactly:

```text
VERDICT: PASS | PASS_WITH_FINDINGS | BLOCK
MODEL: <observed model ID if available, otherwise unknown>
FINDINGS:
- [P0|P1|P2] <file/area>: <reproducible issue and evidence>
  Recommendation: <bounded correction>
or
- None.
RESIDUAL_RISK:
- <short item or None>
```

Only P0/P1 findings with current code/packet evidence may block the local merge.
