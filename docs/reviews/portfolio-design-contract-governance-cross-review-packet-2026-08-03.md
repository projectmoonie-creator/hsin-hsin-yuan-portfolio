# Read-Only Cross-Review Packet: Portfolio Design Contract Governance v1

Date: 2026-08-03

## Reviewer instruction

Review only. Do not edit files, propose deployment, contact external parties,
or assume access to private evidence. Treat this packet as frozen. Findings
must be supported by a current path and line/range or by a reproduced result
included below. Do not block on style preference.

## Objective

Assess whether a governance/normalization package safely formalizes an
iteratively tuned bilingual portfolio without visually resetting it, and
whether the resulting reusable skill guidance is genuinely project-agnostic.

## Targets

### Portfolio repository

- Repository: portfolio repository root
- Branch: `codex/portfolio-design-contract-governance`
- Baseline: `90b5d1ae5e32126c78672df33c4c6f4eaa7f0642`
- Reviewed head: `03a5aee2622811c1085b618aa332225b2b3dbd44`
- Commits:
  - `d12a98f` contract and report-only audit
  - `977d8a3` normalizer and explicit presentation metadata
  - `5639fa7` Figma current-reference alignment
  - `03a5aee` project validation evidence

### Shared skill repository

- Repository: Moonie V workspace root
- Branch: `main`
- Skill commit: `9985f06`
- Skill:
  `.agents/skills/portfolio-narrative-builder/SKILL.md`
- New reference:
  `.agents/skills/portfolio-narrative-builder/references/format-contract-and-variant-governance.md`

## Non-goals and hard boundaries

- No redesign, copy rewrite, media replacement, responsive retuning, or new
  component family.
- No Production or Preview deployment, push, contact submission, or email.
- The public website must remain byte-identical to the baseline.
- Figma current-reference artifacts may change only for the documented stale
  slash, duplicated loader, missing Press/variant map, and token drift.
- Evidence/provenance must be retained without becoming public anatomy.
- Project values such as names, colors, dimensions, ratios, breakpoints, and
  specific component names must not leak into the reusable skill method.

## Architecture implemented

1. `docs/design-contract.md` records current approved section order, anatomy,
   field classes, variants, responsive invariants, title ownership, omission,
   consumer parity, regression, and rollback.
2. `scripts/audit-design-contract.mjs` is read-only and reports collection
   order, field inventory, variants, unknown fields, and Figma drift.
3. `scripts/lib/portfolio-contract.mjs` exports field classifications,
   supported variants, Featured/Archive/work-Press/global-Press normalizers,
   and collection uniqueness validation.
4. Six Featured sources now declare `presentation`; raw
   `hideMediaLabel`/`featuredMediaAspect` fields are gone.
5. `scripts/build-site.mjs:34-74` routes Featured, Archive, and global Press
   through normalization.
6. `scripts/build-figma-export.mjs:1-20,344-357` reuses the site loader and
   normalized works rather than reparsing a parallel collection.

## Important implementation details for scrutiny

### Field classes

`scripts/lib/portfolio-contract.mjs:18-70` classifies active fields into
required rendered, optional rendered, evidence only, and retired. The audit
uses the same classification to reject unknown active source fields.

Questions:

- Are any fields misclassified in a way that undermines the public/evidence
  boundary?
- Does the inspector miss a runtime field because it inventories raw
  frontmatter rather than normalized records?

### Compatibility projection

`scripts/lib/portfolio-contract.mjs:202-235` validates explicit presentation,
normalizes nested work Press, constructs `contract.public` and
`contract.evidence`, then temporarily projects renderer-compatible
`hideMediaLabel` and `featuredMediaAspect` values onto the normalized object.
The source fields themselves are retired and absent.

Questions:

- Is this safe as an adapter-first migration, or should continued consumption
  of the flattened compatibility object remain an open item rather than a
  project-level `PASS`?
- Is the evidence boundary meaningful while the normalized top-level object
  still spreads the source record, even though `contract.public` is strict?

### Variant and identity contract

`content/works/*.md` now declares:

- one of two desktop media variants;
- a shared mobile aspect;
- no interface title overlay;
- source artwork title presence/absence.

The normalizer validates allowed values at
`scripts/lib/portfolio-contract.mjs:132-160`. Tests cover every exact source
assignment and the absence of legacy inference fields.

### Figma boundary

The Figma SVG exporter now consumes `loadSiteData`/`loadWorks`, sources mobile
role lines from canonical data, uses production panel/work-panel tokens, and
documents Press, Archive, and Featured variants. This intentionally changed
only Figma artifacts. The older editable importer plugin remains tested for
presence but was not rewritten in this package.

Question: Does that unchanged importer make the claim of Figma/design-handoff
alignment too broad or create a material risk that should be resolved before
local-main integration?

## Validation evidence

### Deterministic

- TDD RED states were observed before inspector, normalizer, source-variant,
  focal-field, and Figma changes.
- `npm test`: 50 passed, 0 failed.
- `npm run audit:design-contract`: `PASS`; 6 Featured, 5 Archive, 2 global
  Press, 3 work Press; no active contract drift.
- `npm run build`: passed.
- `npm run figma:export`: passed.
- `git diff --check`: passed.
- Skill quick validation: `Skill is valid!`
- Skill reference-link/content check: six references resolve; required generic
  governance concepts are present.
- Reusable-skill leakage search found none of the portfolio's names,
  breakpoints, ratios, variant names, titles, or accent values.

### Exact public-output parity

The following hashes match baseline `90b5d1a` after every package:

- `dist/index.html`
  `57991f78d70a6b5e78a1dab9bcec2a06957cbec38164059aec60f24acb3f7d00`
- `dist/en/index.html`
  `c02fba348f90d7aabccf044dfff71b0bbb921040301b0eb47da7f189d59ae315`
- `dist/zh/index.html`
  `d7e2ff8110dd985f2ff6f0d9f04842ae348b8c1165d39e24209bafb266b1cb4d`
- `dist/styles.css`
  `82ef5295b2b1218bc3ad1fb2fa88b983c884b624e533ef1561a1ad835536afe0`
- `dist/main.js`
  `79831f5936f8e42846f6dc53e8f27e49fe6c079ceef2758fe49effcc4fbff1b7`

### Browser

Native Chromium passed English and Chinese at 1440×900, 1200×900, 834×1112,
390×844, and 360×800, plus reduced motion and no JavaScript. Assertions cover
section order, no overflow, counts, Hero breakpoint, four/two desktop variant
assignments, centered and mobile 16:9 geometry, Press columns, equal Archive
widths including the fifth half-row card, keyboard focus, paused motion/static
posters, links, and Contact presence. Desktop/mobile screenshots were visually
inspected.

## Skill change

The new generic reference teaches:

- source/evidence → strict public view model → named variants → shared
  consumers;
- required/optional/evidence/retired classification;
- minimum, maximum, and exceptional record pilots;
- one media identity owner;
- freeze → report-only inventory → contract → test-first adapter → incremental
  source migration → shared consumers → enforcement;
- exact output/matched geometry equivalence and separate diff allowlists;
- compatibility ownership/removal conditions and rollback.

It intentionally omits every portfolio-specific value.

## Requested review dimensions

1. Visual-freeze proof: is byte parity plus matched browser geometry sufficient
   for the stated no-redesign boundary?
2. Contract completeness: are anatomy, optional omission, evidence, responsive,
   identity, consumer, and rollback rules adequately separated?
3. Normalizer correctness: identify validation gaps, misleading field classes,
   compatibility hazards, or data-loss risks.
4. Audit correctness: could `PASS` hide a meaningful active drift?
5. Site/Figma boundary: is the unchanged editable importer a blocker, major,
   minor, or explicitly acceptable open item?
6. Skill generalization: find project leakage, overfitting, missing safety
   conditions, or advice likely to cause unnecessary work in other portfolios.
7. Closeout readiness: may this safely proceed to final gates and local-main
   fast-forward without deployment?

## Required response schema

Return:

1. `VERDICT`: `PASS`, `PASS_WITH_FINDINGS`, or `BLOCK`.
2. `FINDINGS`: ordered by severity. For each:
   - ID
   - severity: `blocker`, `major`, or `minor`
   - exact current path and line/range or reproduced evidence
   - why it matters within the stated boundary
   - smallest safe recommendation
3. `CONFIRMED_STRENGTHS`: claims directly supported by packet evidence.
4. `EVIDENCE_GAPS`: claims that cannot be confirmed from the packet.
5. `MERGE_RECOMMENDATION`: yes/no, with conditions.

Do not turn optional polish into a blocker. Do not claim two-reviewer
completion; this response represents only your own review lane.
