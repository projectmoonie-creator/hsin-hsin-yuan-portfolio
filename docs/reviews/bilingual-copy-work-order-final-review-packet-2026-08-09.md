# Independent review packet — bilingual copy work order

## Review contract

Read-only review. Do not edit files, run deployment, create a Preview, push, merge, or recommend changes outside the bounded work package without labeling them follow-up.

Return valid JSON only:

```json
{
  "decision": "pass|needs-fix|incomplete",
  "summary": "string",
  "findings": [
    {
      "severity": "P0|P1|P2",
      "category": "correctness|safety|maintainability|bilingual-copy|layout|privacy",
      "file": "repo-relative path",
      "line": "line or null",
      "evidence": "specific current evidence",
      "recommendation": "bounded action"
    }
  ],
  "followUps": ["non-blocking item"]
}
```

A P0/P1 blocker must name a current repo-relative file and line or a reproducible failed check. Do not treat an explicit non-goal as a blocker.

## Objective and baseline

- Repository: `hsin-hsin-yuan-portfolio-remove-lights`
- Branch: `codex/three-minute-watch-link`
- Frozen baseline: `2f56352cb3049ab8fb535c0ae3c1d0fa57cb599f`
- Reviewed HEAD: `d5942d13c7af212db8e63ff9fd5e180bae737198`
- Work: convert the producer-approved Excel/JSON bilingual copy selections into a reusable, guarded work-order mechanism, then apply the 13 P0 site entries and 18 P1 Featured entries.
- No main merge/push, Preview, or deployment is authorized.
- Protected untracked file `docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md` must remain untracked and byte-identical; observed SHA-256 is `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.

## Source evidence

- Original workbook SHA-256: `1d0210cf39a688e417c67edb3b0c2d3ccf9201c3485c055c2d6a541ed6ac9600`
- Incoming `preview.xlsx`: `e0472235778da5bb19c2108e1fe57a293ca5462fd28430699ff1ad4a7acdd897`
- Incoming `preview.json`: `b93e9abfa2589a25d0998c42af5fd14c03753d77f003827c5de2e40b878ebba3`
- Incoming `preview.md`: `10f1a9fb511cc79de088f9b41b251e14ca2fbfedf5dc92e8de4455fbfa69933a`
- Versioned transport: `editorial/copy-work-orders/2026-08-09-priority-bilingual.json`

## Mechanism under review

- `scripts/lib/copy-work-order.mjs`
  - Schema v1 permits only paired `en`/`zh`, priorities `P0`/`P1`, and explicit `replace` or `keep` operations.
  - Every replace carries an exact expected-current precondition and a nonblank replacement.
  - Stable-key families are limited to `site.*` and `featured.<slug>.*`; semantic keys must agree with the declared source file.
  - It locates the scalar through the structural property path and replaces only that JSON string token, preserving surrounding formatting.
  - Writes are staged as sibling files; later-target failure restores earlier targets and removes stage/backup residue.
  - It does not claim crash/power-loss atomicity.
- `scripts/apply-copy-work-order.mjs`
  - Default is dry-run.
  - `--write` requires one explicit priority.
  - P1 refuses unless P0 final values are already present.
  - Replaying an already applied work order fails because expected-current values are stale.
- `package.json`: stable entry point `npm run copy:apply`.
- Tests: `tests/copy-work-order.test.mjs`, `tests/build-site.test.mjs`, `tests/figma-export.test.mjs`.

## Applied scope

P0 wrote exactly 13 stable keys / 26 replacements / 0 keeps / 0 conflicts to `data/site.json`:

- `site.metaTitle`, `site.metaDescription`, `site.heroEyebrow`
- `site.heroRoleLines[0]`, `site.heroRoleLines[1]`, `site.heroSubcopy`
- `site.availabilityLabel`, `site.availabilityIntro`
- `site.availability[0]`, `[3]`, `[4]`, `[5]`
- `site.contactSubcopy`

P1 wrote exactly 18 stable keys / 31 replacements / 5 explicit English keeps / 0 conflicts across six files:

- `featured.slow-steps.{role,tagline,description}`
- `featured.tech-dreamers.{role,tagline,description}`
- `featured.my-art-my-voice.{role,tagline,description}`
- `featured.interior-spatial-brand-films.{title,role,tagline,description}`
- `featured.pts-taigi-bus.{role,tagline,description}`
- `featured.top-gear-china-uk-special.{tagline,description}`

The final tests pin all 18 P1 bilingual pairs and the complete P0 bilingual positioning. Source diffs are scalar copy changes only; media contracts, URLs, layout tokens, and component anatomy did not change.

## Generated synchronization

- P0 regenerated `figma-export/01-desktop-home.svg` and `figma-export/03-mobile-home.svg`.
- P1 regenerated `figma-export/02-desktop-works-logos.svg`.
- SVG diffs change editable text/tspan content only; frame coordinates and component structure remain unchanged.

## Validation evidence

- TDD red/green was recorded for mechanism, writes/rollback/CLI, P0, and P1.
- `npm test`: 123/123 pass at reviewed HEAD.
- `npm run build`: pass.
- `npm run figma:export`: pass.
- `npm run audit:design-contract`: pass; 6 Featured / 5 Archive / 2 global Press / 3 work Press; no contract drift.
- `git diff --check`: pass.
- Search across `content/works`, `dist`, and `figma-export` found no retired P1 strings.
- Headless Chromium local-build QA at 1440×900 and 390×844 for `/en/` and `/zh/`:
  - document and body scroll width exactly equal viewport in all four cases;
  - Hero, availability, six Featured copies, and Contact remain within viewport;
  - no horizontal overflow or hidden text clipping observed;
  - Contact anchor works and seven fields are visible;
  - console errors 0, page errors 0, failed requests 0;
  - screenshots were visually inspected for both locales and sizes.
- P0 remote checkpoint read-back: `e0c5e3566dc66c6556817d715de41df7f73bf695` at `backup/2026-08-09/bilingual-copy-p0-e0c5e35`.
- P1 remote checkpoint read-back: `d5942d13c7af212db8e63ff9fd5e180bae737198` at `backup/2026-08-09/bilingual-copy-p1-d5942d1`.

## Explicit boundaries / known follow-up

- The approved 31-entry workbook scope did not include `site.heroRoles` or the static JSON-LD `jobTitle` array in `scripts/build-site.mjs`; both therefore retain the older role taxonomy. They are not visible Hero copy. Treat taxonomy unification as a follow-up requiring producer approval, not as permission to expand this work package.
- The remaining non-priority workbook rows were not applied in this package.
- No clear/delete operation exists in schema v1.
- No Preview/deployment evidence exists because deployment was expressly forbidden.

## Requested review dimensions

1. Does the mechanism fail closed and remain reusable/replaceable without silently widening scope?
2. Do the applied counts, target files, paired locale rules, and generated handoff files form a coherent bounded package?
3. Is any current P0/P1 correctness, privacy, bilingual-copy, layout, or maintainability blocker supported by the supplied evidence?
4. Are any observations better classified as non-blocking follow-up rather than defects in this approved package?
