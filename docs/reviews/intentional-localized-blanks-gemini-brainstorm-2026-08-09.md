### 1. problem_reframe

The core engineering challenge is not simply hiding empty copy in HTML, but cleanly decoupling **schema completeness** (preserving stable JSON keys, localized object shapes, and source array indices for translation workflows) from **DOM node emission** (eliminating empty HTML tags and visual spacing artifacts).

The system must differentiate three distinct content states:
1. **Missing key / Invalid shape** (Schema violation -> fail build).
2. **Populated localized string** (Normal state -> render node).
3. **Intentional zero-length string (`""`)** (Valid localized state -> suppress DOM node entirely so adjacent elements collapse).

Overloading `""` risks ambiguity if build tools or external translation importers treat empty strings as missing or untranslated fallback candidates. The solution must establish a durable contract between validation, template rendering, and locale refill tools.

---

### 2. pragmatic_path

**Architecture: Empty String (`""`) as Valid Localized Content + Complete Template Node Suppression**

* **Data Contract:** Keep exact key and array structures intact (`{ "en": "...", "zh-TW": "" }`). Source array lengths (e.g., `site.availability` length 6) remain unchanged.
* **Validator Contract (`scripts/lib/portfolio-contract.mjs`):**
  * Require the presence of all locale keys (`en`, `zh-TW`). Reject `undefined`, `null`, or non-string values.
  * Define explicit per-field validation rules:
    * *Strict non-empty fields:* `title`, `role` (must have `.trim().length > 0`).
    * *Blank-permissible fields:* `tagline`, `site.availability[]` (must be `typeof === 'string'`).
* **Renderer Behavior (`scripts/build-site.mjs`):**
  * Wrap element generation in strict truthy/non-empty string checks (e.g., `if (tagline && tagline.trim() !== '')`).
  * Emit **zero DOM nodes** when empty. Do not emit empty `<p>`, `<span>`, or wrapper containers that hold CSS margins or flex gaps.

#### Tradeoffs
* **Pros:** Zero structural changes to existing JSON formats; lowest diff surface area; full backward compatibility with content consumers expecting string properties; trivial refill workflow.
* **Cons:** Relies on string length checks; risks accidental approval if an author unintentionally leaves a string blank unless validation rules tightly restrict which specific fields allow `""`.

---

### 3. alternative_architecture

**Architecture: Explicit Nullable Localized Values (`null`)**

* **Data Contract:** Represent intentional blanks using `null` instead of `""` (`{ "en": "...", "zh-TW": null }`).
* **Validator Contract:**
  * Require key presence (`"zh-TW" in obj`).
  * Distinguish `null` (explicit blank intent) from `""` (potential unhandled/accidental empty string from CMS export) and `undefined` (missing schema key).
  * Allow `null` only on designated optional-display fields (`tagline`, `availability`).
* **Renderer Behavior:**
  * Branch explicitly: `if (val === null)` -> skip rendering node; `if (val === "")` -> throw template warning or fail build.

#### Tradeoffs
* **Pros:** Highly explicit and unambiguous intent in JSON source; eliminates ambiguity between "forgot to translate" (`""`) and "intentionally blank" (`null`).
* **Cons:** Breaks JSON contracts for tooling or scripts expecting `string` type everywhere; requires updating TypeScript definitions / contract guards across the entire codebase; potential breaking changes in downstream export tools (e.g., Figma scripts).

---

### 4. low_cost_experiment

**Falsification Experiment: DOM Emission & Layout Collapsibility Verification**

Before applying data changes or modifying contracts, run a dry-run test on a localized page build:

1. **Test Setup:** Temporarily mock a test fixture where `tagline` is `""` for `slow-steps` and `site.availability[5]` is `""` for `zh-TW`.
2. **Execution:** Pass the fixture through `scripts/build-site.mjs` to render static HTML artifacts in memory or test output.
3. **Assertions / Falsification Criteria:**
   * **Node Absence:** Query DOM output via JSDOM/Cheerio or regex string match. Fail if `<p class="...tagline...">` or `<span class="...availability...">` exists in the rendered `zh-TW` HTML string.
   * **Sibling Spacing / Collapse:** Verify that adjacent elements (e.g., project title to project description) become immediate DOM siblings without empty intermediary elements.
   * **Regression Check:** Assert that `en` output for the exact same record still renders non-empty DOM nodes.
   * **Validator Assertion:** Assert that removing the `zh-TW` key entirely triggers a validation error, while `zh-TW: ""` passes validation.

---

### 5. contrarian_challenge

**Premise under test:** "Suppressing DOM elements in JavaScript template renders is cleaner than rendering empty elements hidden via CSS."

**Contrarian Argument:**
If templates omit DOM elements conditionally based on content presence, CSS layouts relying on structural child indexes (`:nth-child`, `:first-child`, CSS Grid layout slot positioning) or flexbox wrappers can break or shift unexpectedly between locales.

If layout stability is paramount across localized views, rendering a structural element with a CSS state or using `:empty` / `:has()` pseudo-classes ensures DOM structural symmetry across `en` and `zh-TW`. However, because CSS gaps (`gap: 1rem`) still apply to `:empty` elements unless hidden via `display: none`, skipping DOM node generation in JavaScript is superior *provided* the parent container relies on standard flex/block flow and not fixed structural index selectors.

---

### 6. unconstrained_possibility

**AST-Driven Structural Layout Pruning**

Instead of ad-hoc `if (text)` guards scattered across template scripts, treat static HTML generation as an AST transformation pipeline:

1. Render templates into an intermediate UI tree where components declare content dependencies (`requires: tagline`).
2. An AST optimization pass inspects node content. Any layout leaf node evaluated as empty (`""`) is pruned along with its layout wrappers (e.g., parent flex item or margin-padding container).
3. The layout engine automatically re-calculates grid template areas or flex spacing based on remaining nodes, guaranteeing that layout rules morph dynamically per locale without manual template branching.

---

### 7. overlooked_risks

1. **Tooling & Re-export Overwrites:** Translation tools, CSV importers, or Figma export scripts might interpret `""` as an untranslated string and automatically populate it with English fallback text during future syncs, overriding producer intent.
2. **Residual Margin / Flex Gap Artifacts:** If a renderer suppresses an inner `<span>` or `<p>` tag but leaves a parent wrapper tag (e.g., `<div class="tagline-wrapper">`), layout margins or grid gaps will create visible layout gaps despite no visible text.
3. **Accessibility & Screen Reader Inconsistencies:** If an element is rendered as empty (`<p></p>`), screen readers may announce empty structural stops or blank lines. Omitting the node solves accessibility, but shifting DOM counts between locales must not mess up ARIA landmark references or sequential focus orders.

---

### 8. assumptions_to_verify

1. **CSS Collapsibility:** Confirm that all parent containers wrapping `tagline` and `availability` rely on block flow or flexbox where removing a child node completely collapses space, without relying on `:nth-child` styling.
2. **Figma Script Compatibility:** Verify that the Figma export script or sync tooling does not throw errors or strip keys when encountering empty strings (`""`) in localized JSON files.
3. **Contract Granularity:** Confirm that `portfolio-contract.mjs` can cleanly isolate `tagline` and `availability` for `""` permission without accidentally permitting empty strings on critical identifiers like `slug`, `title`, or `role`.

---

### 9. recommended_next_decision

**Decision:** Proceed with **Path 1 (Empty String `""` as Valid Intent + Complete Node Suppression)**.

**Concrete Immediate Steps:**
1. Update `scripts/lib/portfolio-contract.mjs` to explicitly allow empty strings (`""`) for `tagline` and `site.availability` while strictly enforcing string type and key presence for both `en` and `zh-TW`.
2. Update `scripts/build-site.mjs` to wrap `tagline` and `availability` element output in non-empty string guards (`if (val && val.trim() !== '')`), ensuring zero DOM nodes are emitted when empty.
3. Execute the low-cost DOM assertion test to confirm complete node removal and spatial collapse in `zh-TW` while confirming zero regression in `en`.
