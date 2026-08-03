# Portfolio Design Contract Governance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Do not use subagents unless the current user or system instructions explicitly authorize them.

**Goal:** Turn the approved, finely tuned portfolio into an explicit and testable design/content contract without changing the public website's current layout, copy, media, motion, or responsive behavior.

**Architecture:** Freeze commit `90b5d1ae5e32126c78672df33c4c6f4eaa7f0642` and its generated public artifacts as the compatibility baseline. Package 1 adds only documentation, a read-only inspector, and tests. Package 2 adds a dependency-free normalization adapter and explicit named presentation metadata while retaining compatibility aliases until byte-identical website output is proven. Figma current-reference drift is corrected separately and is never used as permission to alter the live site.

**Tech Stack:** Node.js ES modules, JSON frontmatter, Node test runner, generated static HTML/CSS/JS, SVG Figma export, local browser QA.

---

## Safety boundary

- Public website freeze: no intended change to `src/styles.css`, `src/main.js`, rendered English/Chinese HTML, media URLs, copy, section order, breakpoints, or interaction behavior.
- Baseline website hashes:
  - `dist/index.html`: `57991f78d70a6b5e78a1dab9bcec2a06957cbec38164059aec60f24acb3f7d00`
  - `dist/en/index.html`: `c02fba348f90d7aabccf044dfff71b0bbb921040301b0eb47da7f189d59ae315`
  - `dist/zh/index.html`: `d7e2ff8110dd985f2ff6f0d9f04842ae348b8c1165d39e24209bafb266b1cb4d`
  - `dist/styles.css`: `82ef5295b2b1218bc3ad1fb2fa88b983c884b624e533ef1561a1ad835536afe0`
  - `dist/main.js`: `79831f5936f8e42846f6dc53e8f27e49fe6c079ceef2758fe49effcc4fbff1b7`
- Figma baseline hashes are evidence, not a freeze, because Package 2 intentionally removes known current-reference drift:
  - `01-desktop-home.svg`: `88cf6381da379d3d082576323e7cc92d2626eca1cdd0d41eb9b17edd9dc4759f`
  - `02-desktop-works-logos.svg`: `26825c1241d8150e357f2b8d6bff008d98ab5b218a54c5001d07d54a8d4670d2`
  - `03-mobile-home.svg`: `60084a22c4dc34b6e2efd2bd1f43d0ca22142a4ea3f20679da24b556a7cdbd73`
  - `README.md`: `faeaae8f01ef396541f5a80a073f9cb53a7122f0b5454c535bc4c69ee6529a0e`
- Any website hash difference during Packages 1–2 is a blocker: stop, inspect, and restore semantic/output parity before continuing.
- The protected untracked file `docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md` is never staged or edited.

## File map

- `docs/design-contract.md`: canonical current project design/content contract.
- `docs/reviews/portfolio-design-contract-baseline-v1-2026-08-03.json`: immutable migration baseline and output fingerprints.
- `scripts/audit-design-contract.mjs`: read-only source/contract inspector; it never writes files.
- `scripts/lib/portfolio-contract.mjs`: validation, normalization, field classifications, and compatibility projection.
- `tests/design-contract-audit.test.mjs`: TDD coverage for the inspector and current findings.
- `tests/portfolio-contract.test.mjs`: TDD coverage for strict normalized contracts and compatibility.
- `content/works/*.md`: explicit per-work presentation ownership/variant metadata; remove legacy inferred presentation fields only after parity.
- `scripts/build-site.mjs`: consume normalized records without changing generated output.
- `scripts/build-figma-export.mjs`: consume the same normalized records and remove current-reference-only drift.
- `docs/figma-design-layer.md`: update active Figma rules to the current section map and component variants.
- `docs/portfolio-site-spec.md`: mark the old v1 concept as historical and point to the current contract.
- `PROJECT_BIBLE.md`: point current design-governance decisions to the contract without duplicating project values.
- `STATUS.md`: record Option A approval, checkpoints, validation, and exact next action.
- `package.json`: add read-only audit commands.
- `.agents/skills/portfolio-narrative-builder/SKILL.md` and one new reference: generalize only the proven method after project verification.

### Task 0: Verify isolated baseline

**Files:** Read-only repository state.

- [x] **Step 1: Confirm isolation**

The repository is already a linked worktree and now uses branch `codex/portfolio-design-contract-governance`; no nested worktree is created.

- [x] **Step 2: Establish green deterministic baseline**

Run `npm test`, `npm run build`, and `npm run figma:export`. Expected: 42 tests pass and the hashes in the Safety boundary match.

### Task 1: Add the canonical contract and immutable migration baseline

**Files:**
- Create: `docs/design-contract.md`
- Create: `docs/reviews/portfolio-design-contract-baseline-v1-2026-08-03.json`
- Modify: `docs/portfolio-site-spec.md`
- Modify: `docs/figma-design-layer.md`
- Modify: `PROJECT_BIBLE.md`

- [x] **Step 1: Write the current contract from approved behavior**

Document: source-of-truth order; section order; required/optional/evidence/retired field classes; Screening Strip, Featured, Archive, work Press, global Press, and Contact anatomy; exact breakpoint invariants; title ownership; two desktop Featured variants; mobile 16:9 invariant; omission rules; Figma parity; test mapping; and rollback baseline.

- [x] **Step 2: Store the baseline manifest**

Write a JSON record containing baseline commit, branch, generation commands, website hashes, Figma hashes, current work order, current section order, and the explicit statement that only Figma current-reference artifacts may intentionally change in Package 2.

- [x] **Step 3: Remove active-document drift without changing code**

In `docs/portfolio-site-spec.md`, identify the old horizontal-gallery text as historical and link to `docs/design-contract.md`. In `docs/figma-design-layer.md`, add global Press to the section map, replace the retired hero slash instruction, replace Archive lead/supporting variants with one equal-card family, remove Lab as an active source, and name the two Featured desktop media variants.

- [x] **Step 4: Add the Bible pointer**

Add a short `Design Contract Governance` rule: the canonical current layout lives in `docs/design-contract.md`; intentional differences require a named variant and matched evidence; historical specs do not override it.

### Task 2: Build Package 1's read-only inspector with TDD

**Files:**
- Create: `tests/design-contract-audit.test.mjs`
- Create: `scripts/audit-design-contract.mjs`
- Modify: `package.json`

- [x] **Step 1: Write a failing audit API test**

Import `auditDesignContract` from the absent script and assert that the current project reports collections, orders, field inventories, named Featured variants, title ownership, Archive capability, Press scopes, and active-document drift. Run:

```bash
node --test tests/design-contract-audit.test.mjs
```

Expected RED: `ERR_MODULE_NOT_FOUND`.

- [x] **Step 2: Implement the smallest read-only inspector**

Export `auditDesignContract({ rootDir })` and `formatAuditReport(report)`. It may use only `readFileSync`, `readdirSync`, and parsing helpers; it must not call a writer or mutate source. Return deterministic JSON with `status`, `summary`, `collections`, `fieldInventory`, `variants`, and `findings`.

- [x] **Step 3: Prove GREEN and CLI behavior**

Run the focused test, then add `audit:design-contract` and `audit:design-contract:json` scripts. The default command prints a human-readable report and exits zero for expected migration warnings; JSON mode prints parseable JSON.

- [x] **Step 4: Prove Package 1 website byte parity**

Run `npm run build` and compare the five frozen website hashes. Expected: all match. Run `git diff -- src public content data scripts/build-site.mjs src/styles.css src/main.js`; expected: no public-site change.

- [x] **Step 5: Commit Package 1**

Stage only Package 1 files and commit `add portfolio design contract audit`.

### Task 3: Add the normalization contract with TDD

**Files:**
- Create: `tests/portfolio-contract.test.mjs`
- Create: `scripts/lib/portfolio-contract.mjs`

- [x] **Step 1: Write failing normalization tests**

Import the absent module and assert:

- Featured required fields reject missing `slug`, `order`, bilingual `title`, bilingual `role`, `year`, or presentation metadata.
- presentation variants are only `fill-card` or `centered-16x9` on desktop and `16:9` on mobile.
- site title overlay is explicitly `none`; source artwork title state is `present` or `absent`.
- Archive normalizes to one `standard` card family while preserving poster/index capability.
- Work Press normalizes to `thumbnail-card`; global Press to `text-note`.
- evidence/provenance is retained but is not confused with the public anatomy.

Run `node --test tests/portfolio-contract.test.mjs`; expected RED: module absent.

- [x] **Step 2: Implement the dependency-free normalizer**

Export:

```js
normalizeFeaturedWork(source)
normalizeArchiveItem(source)
normalizeWorkPressItem(source)
normalizeGlobalPressItem(source)
validatePortfolioCollections({ works, archive, press })
FIELD_CLASSIFICATION
PRESENTATION_VARIANTS
```

Return a normalized record with explicit `presentation` plus a compatibility projection for the current renderer. Do not touch CSS or copy.

- [x] **Step 3: Prove GREEN**

Run the focused tests. Expected: all normalization and rejection cases pass.

### Task 4: Migrate Featured presentation metadata without output change

**Files:**
- Modify: `content/works/*.md`
- Modify: `scripts/build-site.mjs`
- Modify: `tests/build-site.test.mjs`
- Modify: `tests/design-contract-audit.test.mjs`

- [x] **Step 1: Write failing source-contract assertions**

Require every Featured source record to contain:

```json
"presentation": {
  "desktopMediaVariant": "fill-card | centered-16x9",
  "mobileMediaAspect": "16:9",
  "siteTitleOverlay": "none",
  "sourceArtworkTitle": "present | absent"
}
```

Require absence of top-level `hideMediaLabel` and `featuredMediaAspect` after migration. Expected RED against current frontmatter.

- [x] **Step 2: Add exact approved values**

- `fill-card`: Slow Steps, Tech Dreamers, My Art, My Voice, Top Gear China: UK Special.
- `centered-16x9`: Design & Brand Films, Nothing by Bus.
- `sourceArtworkTitle: present`: Tech Dreamers, My Art, My Voice, Nothing by Bus, Top Gear.
- `sourceArtworkTitle: absent`: Slow Steps, Design & Brand Films.
- all six: mobile `16:9`, site overlay `none`.

Remove the two legacy presentation fields only after the normalizer supplies renderer-compatible values.

- [x] **Step 3: Route the site loader through normalization**

Call `normalizeFeaturedWork` in `loadWorks`, `normalizeArchiveItem` in the archive loader, and `normalizeGlobalPressItem` for global Press. Nested work Press is normalized by `normalizeFeaturedWork`. Keep rendered HTML class names and order unchanged.

- [x] **Step 4: Prove website byte parity**

Run `npm test` and `npm run build`; compare all five frozen website hashes. Any mismatch blocks continuation. Commit `normalize portfolio presentation contracts` only after exact parity.

### Task 5: Synchronize Figma current references to the proven contract

**Files:**
- Modify: `scripts/build-figma-export.mjs`
- Modify: `tests/figma-export.test.mjs`
- Regenerate: `figma-export/*.svg`

- [x] **Step 1: Write failing Figma parity assertions**

Require the exporter to consume normalized Featured records, source mobile hero role lines from canonical data, omit the retired slash before `Cross-Cultural Storyteller`, include global Press in its current-reference map/README, and describe equal Archive cards plus named Featured variants.

- [x] **Step 2: Implement only current-reference fixes**

Import the shared loader/normalizer instead of reparsing Featured content independently. Preserve all existing frame geometry except the retired mobile slash text. Update README/current-reference metadata; do not change live CSS or site HTML.

- [x] **Step 3: Regenerate and inspect the bounded Figma diff**

Run `npm run figma:export` and `git diff -- figma-export scripts/build-figma-export.mjs tests/figma-export.test.mjs`. Confirm differences correspond only to the declared Figma drift corrections.

- [x] **Step 4: Re-prove website byte parity and commit**

Run `npm run build` and compare all five website hashes again. Commit `align figma references with design contract`.

### Task 6: Full project validation and browser geometry gate

**Files:**
- Create: `docs/reviews/portfolio-design-contract-governance-v1-2026-08-03.md`
- Modify: `STATUS.md`

- [x] **Step 1: Run deterministic validation**

Run:

```bash
npm test
npm run audit:design-contract
npm run build
npm run figma:export
git diff --check
```

Expected: all tests pass, audit has no unclassified active presentation fields, build/export succeed, and website hashes remain frozen.

- [x] **Step 2: Run matched browser QA**

Use local production output at 1440×900, 1200×900, 834×1112, 390×844, and 360×800 for English and Chinese, plus reduced-motion and no-JavaScript checks. Record section order, card widths/heights, media aspect ratios, overflow, first keyboard focus, and the two desktop Featured variants. Compare against the approved baseline behavior; no unauthorized visual delta is allowed.

- [x] **Step 3: Write closeout evidence**

Record baseline/implementation commits, exact website hashes, intentional Figma changes, tests, browser states, protected file, no-deploy status, and rollback command/commit. Update `STATUS.md` from decision-pending to locally verified governance implementation.

### Task 7: Generalize only the proven method into the skill

**Files:**
- Modify: `.agents/skills/portfolio-narrative-builder/SKILL.md`
- Create: `.agents/skills/portfolio-narrative-builder/references/format-contract-and-variant-governance.md`

- [ ] **Step 1: Load the skill-authoring instructions**

Read the available official skill-creation/writing instructions completely before editing the project-owned skill.

- [ ] **Step 2: Add reusable, project-agnostic guidance**

Cover required/optional/evidence/retired fields, source-to-view-model normalization, named variants, media identity ownership, responsive invariants, minimum/maximum/exception pilots, report-only inspection before enforcement, compatibility adapters, output/geometry parity, and rollback. Do not copy this portfolio's colors, breakpoints, ratios, section names, titles, or values into the shared method.

- [ ] **Step 3: Validate the skill package**

Run the validator required by the loaded skill-authoring instructions and inspect the diff for project-specific leakage.

### Task 8: Independent review, finish, and local-main integration gate

**Files:**
- Modify review/status evidence only if findings require documentation.

- [ ] **Step 1: Run convergent review**

Use `reviewing-with-multiple-ai` according to repository collaboration rules after deterministic and browser QA. Review scope: visual-freeze proof, contract completeness, normalizer correctness, Figma boundary, skill generalization, and evidence preservation.

- [ ] **Step 2: Resolve valid findings with TDD and re-run all gates**

Any code correction begins with a failing test. Re-run deterministic, output-hash, browser, and skill validation after changes.

- [ ] **Step 3: Finish the development branch**

Load and follow `superpowers:finishing-a-development-branch`. Do not deploy, push, or modify Production. Because the user has already requested local integration after successful completion, fast-forward local `main` only if its tip is still the recorded base and the protected user file remains untouched; otherwise stop and report the exact divergence.
