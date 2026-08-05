# Architectural Brainstorm: Collaboration Logo Wall Component

**Date:** 2026-08-06
**Decision Owner:** Hsin-Hsin Yuan
**Mode:** Architecture Brainstorming & Tradeoff Analysis (Read-Only)

---

## 1. problem_reframe

The challenge in `Platforms & Collaborations` is not merely swapping text strings for `<img>` tags. It is a multi-target design-and-code synchronization problem operating under strict brand provenance and visual fidelity constraints:

1. **Contract Disconnect & Layout Drift:** The web build (`scripts/build-site.mjs`) and Figma exporter (`scripts/build-figma-export.mjs`) consume `data/collaborations.json` independently without a shared contract layer. The mobile Figma exporter silently truncates records to four, while the CSS renderer uses an unweighted global height limit that distorts optical relationships between wide horizontal logos (e.g., TaiwanPlus) and compact/square marks (e.g., PTS, Gorgeous Space).
2. **Identity & Provenance Boundary:** Sourcing collaborator marks carries nominative fair-use and visual trust bounds. Unverified identities (ScreenHouse) or missing official press assets (Dragon TV) must fail safely to accessible, intentional typography without breaking structural parity across web and Figma targets.
3. **Monochrome Optical Balance:** Displaying heterogeneous corporate marks in a "quiet" portfolio UI requires normalized optical surface area calculation, clean geometry extraction (avoiding raster artifacts or destructive flattening), and dark/light monochrome fill support via CSS variables and AutoLayout frames.

---

## 2. pragmatic_path

A single canonical contract script processes raw metadata and asset metrics, emitting normalized layout structures for both the website build pipeline and the Figma REST export engine.

```
data/collaborations.json (Canonical metadata)
       │
       ▼
scripts/lib/portfolio-contract.mjs (Validates schema, checks assets, computes optical scales)
       │
       ├──► scripts/build-site.mjs  ──► HTML + CSS Variables (--optical-scale)
       └──► scripts/build-figma-export.mjs ──► Figma AutoLayout Vectors/Nodes
```

### Schema & Data Boundary
Update `data/collaborations.json` to include optional logo metadata while keeping text fields intact:
```json
{
  "id": "taiwanplus",
  "name": "TaiwanPlus",
  "url": "https://www.taiwanplus.com",
  "logo": {
    "src": "assets/logos/derived/taiwanplus.svg",
    "aspectRatio": 3.82,
    "opticalScale": 0.90,
    "status": "verified"
  }
}
```
For unverified entries (`dragon-tv`, `screenhouse`), `"logo"` remains `null` or uses `"status": "unverified"`.

### Shared Normalization (`scripts/lib/portfolio-contract.mjs`)
- Validates asset existence on disk before passing asset paths downstream.
- Computes optical height multipliers based on aspect ratios using Area Area-Normalization ($H_{\text{optical}} = H_{\text{target}} \times \sqrt{\frac{1}{\text{aspectRatio}}}$ bounded within $[0.75, 1.25]$).
- Exposes a unified helper `getNormalizedCollaborations()` returning identical arrays to both web and Figma builders.

### Website & Figma Consumers
- **Website (`build-site.mjs` & `styles.css`):** Renders verified items as inline SVGs or clean `<img>` elements styled via CSS custom properties (`--optical-scale`). Unverified items render as inline semantic text.
- **Figma Export (`build-figma-export.mjs`):** Uses vector path nodes or scaled image fills inside a responsive AutoLayout row/grid container on both desktop and mobile frames, replacing the current 4-item truncation logic with responsive flex wrapping.

### Asset & Provenance Strategy
- Store untouched official downloads in `assets/logos/sources/` alongside a `provenance.json` tracking origin URL, fetch date, and brand guidelines.
- Store cleaned, single-color SVGs in `public/assets/logos/derived/` with standard `viewBox` coordinates and `fill="currentColor"`.

### Fallback & Rollback
- If an asset is missing or set to `unverified`, the contract loader seamlessly outputs a standard text link record. Setting `"status": "unverified"` in JSON instantly rolls back any mark to text without layout breakdown.

### Tradeoffs
- **Pros:** Zero runtime JS overhead; 100% parity between web production build and Figma export; resilient to broken asset paths.
- **Cons:** Requires manual initial measurement of optical scale values during asset onboarding.

---

## 3. alternative_architecture

An Asset Compilation Pipeline that generates a unified vector sprite/token JSON artifact (`public/assets/logos/logo-manifest.json`) prior to SSR and Figma exporting.

```
assets/logos/sources/*.svg
       │
       ▼ (npm run build:logos)
public/assets/logos/logo-manifest.json (SVG paths, bounds, optical metrics)
       │
       ├──► Web: Inline SVG symbols or CSS -webkit-mask-image
       └──► Figma: REST API Vector Path Builder
```

### Technical Workflow
1. A CLI script (`scripts/build-logo-assets.mjs`) reads vector SVGs from `assets/logos/sources/`.
2. It parses viewBox dimensions, normalizes path fills to `currentColor`, calculates geometric bounding boxes, and writes path data and aspect ratios into `logo-manifest.json`.
3. `build-site.mjs` injects SVG `<use>` references or CSS `-webkit-mask-image` rules using custom properties.
4. `build-figma-export.mjs` constructs native Figma `VECTOR` nodes directly from path coordinates in the manifest.

### Tradeoffs
- **Pros:** Figma exports native editable vector nodes rather than bitmap images; CSS mask approach allows uniform color control via `background-color`.
- **Cons:** High complexity in vector parsing scripts; multi-path SVGs or SVGs with clip-paths require heavy preprocessing; higher maintenance burden.

---

## 4. low_cost_experiment

A zero-risk, falsifiable experiment to test optical height formulas and text-to-logo alignment parity before committing code:

### Method
1. Create a isolated test script `scripts/test-logo-optical-contract.mjs`.
2. Load the 4 verified marks (TaiwanPlus, PTS, TICFF, Gorgeous Space) + 2 text fallbacks (Dragon TV, ScreenHouse).
3. Apply Area-Normalization formula ($H_{\text{optical}} = 32\text{px} \times \sqrt{\text{Aspect Ratio}^{-1}}$).
4. Output a temporary standalone HTML test harness (`tmp/logo-wall-test.html`) and log the calculated Figma node bounding dimensions.

### Falsification Metrics
- **Visual Area Imbalance:** Render test page and measure visual density. If any logo's visual pixel fill area deviates by $> 20\%$ from the mean pixel area of the 4 verified logos, the mathematical optical formula is falsified and requires explicit token overrides per logo.
- **Layout Parity:** Compare mobile Figma export node bounds vs. rendered HTML bounding rects. Any variance $> 2\text{px}$ in vertical rhythm invalidates the contract normalization logic.

---

## 5. contrarian_challenge

**Thesis:** *Replacing collaborator text with official logos degrades the portfolio's quiet typographic authority and introduces unnecessary brand maintenance.*

1. **Visual Distortion:** Co-locating distinct corporate visual identities (a broadcast TV mark, an indie film festival logo, a commercial studio) breaks visual harmony even when flattened to monochrome.
2. **Brand Dilution & Ambiguity:** Sourcing marks without explicit media kit approvals risks displaying outdated brand marks (e.g., PTS brand updates). Text labels in high-grade typography are timeless, unequivocal, and nominatively precise.
3. **Proposal:** Retain refined typographic text layout as the primary display state. Use tiny monochrome brand mark icons *only* as optional inline inline indicators or subtle hover cards, ensuring the main layout remains pure, robust typography.

---

## 6. unconstrained_possibility

Transform the collaboration section into a dynamic, responsive Vector Coordinate Wall:

- Convert all verified SVG paths into normalized SVG path strings embedded directly in design tokens.
- On the web, render logos inside an interactive SVG canvas where path weights and optical scales smoothly morph based on viewport scroll position, light/dark mode transitions, and ambient cursor proximity.
- Introduce an interactive **Provenance Inspector**: Clicking or focusing any logo reveals an explicit metadata overlay detailing project year, nominative use rationale, asset provenance verification timestamp, and official brand URL.

---

## 7. overlooked_risks

1. **SVG ViewBox Scaling Collapses in CSS Flexbox:** Modern browsers calculate dynamic height differently for SVGs in flex containers if `height: 100%` or `max-height` is set without an explicit `aspect-ratio` CSS property, causing logos to collapse to 0 width on Safari.
2. **Loss of Detail in Monochrome Flattening:** Multi-colored logos (e.g., PTS or festival marks with concentric fills) can become unreadable solid black blobs when flattened via `fill="currentColor"` or `filter: grayscale(100%)` without manual internal path adjustment (counter-shape extraction).
3. **Figma API Node Overlapping:** If `build-figma-export.mjs` uses hardcoded absolute X/Y coordinate math for logo rendering instead of dynamic Figma `FRAME` AutoLayout (`layoutMode = "HORIZONTAL"`, `itemSpacing`), varying logo widths will cause overlapping frames during export.

---

## 8. assumptions_to_verify

1. **Figma AutoLayout Compatibility:** Verify whether `scripts/build-figma-export.mjs` already constructs Figma frames using AutoLayout or relies on absolute coordinate calculation.
2. **Vector Integrity:** Inspect the raw official SVG sources for Gorgeous Space, TICFF, and TaiwanPlus to ensure they contain vector shapes (not embedded base64 raster PNGs).
3. **Contrast & Theme Rules:** Verify whether `src/styles.css` supports light/dark CSS variables (`var(--text-muted)`, `var(--bg-primary)`) that derived SVGs can inherit via `currentColor`.
4. **Text Baseline Alignment:** Verify that fallback text labels (e.g., Dragon TV) share the exact visual baseline and font size as adjacent SVG bounding boxes in flex rows.

---

## 9. recommended_next_decision

For Hsin-Hsin Yuan:

1. **Approve Schema & Contract Strategy:** Authorize the addition of optional `logo` metadata to `data/collaborations.json` and creation of `scripts/lib/portfolio-contract.mjs` using the **Pragmatic Path**.
2. **Maintain Strict Text Fallback Strategy:** Keep Dragon TV and ScreenHouse explicitly marked as `unverified` (text fallback) until trustworthy official vector assets are obtained.
3. **Execute Low-Cost Experiment:** Run `scripts/test-logo-optical-contract.mjs` to validate optical scaling formulas and verify web/Figma layout parity before making permanent asset changes.
