VERDICT: PASS

### Findings

- **P0**: none
- **P1**: none
- **P2**: none

### Confirmation of Core Invariants

1. **Shared Renderer Ownership**: Confirmed. `renderWatchLoopItem()` in `scripts/build-site.mjs` now unconditionally emits `href="#${escapeHtml(work.slug)}"` and no longer branches on any external target fields, establishing single-source ownership of the in-page anchor invariant.
2. **Recreation of External Small-Card Links**: Confirmed no active consumer can recreate the direct small-card external action. `watchLoopTarget` has been formally retired in `scripts/lib/portfolio-contract.mjs` and is stripped during normalization (`delete normalized.watchLoopTarget`).
3. **Large-Card External Link Protection**: Confirmed. The large Featured media link (`watchUrl`) and the audited Official page link remain external, untamed by the Screening Strip change, matching browser and contract validation.

### Scope and Risk Assessment

This change is appropriately bounded as a low-risk user-visible repair. It strictly addresses the single-card navigation defect across locales without touching out-of-scope assets, visual geometries, or site lifecycle handlers.