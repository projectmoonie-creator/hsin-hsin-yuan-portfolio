# Independent Review Packet — Intentional Localized Blanks

## Review contract

Read-only review. Do not edit files, run deployment, create a hosted Preview,
push, merge, or expand the six-field scope. Return valid JSON only:

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

A P0/P1 blocker must name a current repo-relative file/line or reproducible
failed check. Explicit non-goals are not blockers.

## Objective and producer decision

- Repository: `hsin-hsin-yuan-portfolio-remove-lights`.
- Branch: `codex/three-minute-watch-link`.
- Baseline HEAD: `d9f93b9b1751156ddb8a66c4f9ccf0950cc1dcb7`.
- The producer decided that an intentionally blank localized field remains in
  source at its stable key/array position but emits no DOM element or visual
  gap; the next section moves up. English and Chinese decisions are independent.
- Apply exactly six Chinese blanks: `site.availability[5]` and five Featured
  `tagline.zh` values for `slow-steps`, `tech-dreamers`, `my-art-my-voice`,
  `interior-spatial-brand-films`, and `pts-taigi-bus`.
- English must remain unchanged. No CSS/token/component redesign is intended.

## Guarded source evidence

`editorial/copy-work-orders/2026-08-09-intentional-zh-blanks.json` records:

- baseline commit `d9f93b9b1751156ddb8a66c4f9ccf0950cc1dcb7`;
- exact SHA-256 for the original Chinese workbook, incoming preview workbook,
  and prior guarded work order;
- six stable entries, six English `keep` operations, and six Chinese `blank`
  operations with exact expected-current guards;
- P0 site change followed by P1 Featured changes.

The all-scope dry-run reported six entries, six replacements, six keeps, zero
conflicts, six target files, and `writesFiles: false`. P0 wrote one field;
P1 dry-run then wrote five fields, all with zero conflicts.

## Mechanism changes

### `scripts/lib/copy-work-order.mjs`

- Adds explicit `blank` alongside `replace` and `keep`.
- `blank` requires a non-empty current value, declares no replacement value,
  and writes the exact JSON token `""`.
- `replace` may now guard against `expected: ""`, so a future refill is an
  ordinary guarded replacement with a non-empty new value.
- P1 predecessor checks recognize a completed blank as `""`.
- Focused tests prove blank, keep, refill, stable-path replacement, preflight,
  rollback, and replay rejection.

### `scripts/lib/portfolio-contract.mjs`

- Localized fields remain structurally required with both `en` and `zh` string
  keys.
- Only Featured `tagline` permits exact empty strings. Missing keys, null,
  non-string values, and whitespace-only strings still fail.
- Titles, roles, and descriptions remain non-empty in both languages.
- New `validateSiteCopy` requires non-empty, same-length `en`/`zh`
  availability arrays. Each item must be populated or the exact empty string;
  whitespace-only and non-string values fail.

### `scripts/build-site.mjs`

- `loadSiteData` invokes the site-copy validator.
- One reusable `renderOptionalText` helper emits a complete `p` or `span` only
  for non-whitespace text.
- Work-detail and screening-strip tagline render paths both use the helper.
- Availability filters only render output; it does not mutate or reindex the
  source array.
- No CSS changed. Existing margins live on the omitted tagline elements, so
  standard block/flex flow collapses the gap.

## Data outcome

- `data/site.json`: `zh.availability` remains length six; index 5 is `""`.
- Five work files retain `tagline: { en: <unchanged>, zh: "" }`.
- `top-gear-china-uk-special.tagline.zh` remains populated, proving the
  behavior is field- and locale-specific rather than global hiding.

## Test and browser evidence

- TDD red reproduced all three former assumptions: validator rejected blank,
  renderer always emitted elements, and work order rejected `blank`.
- Focused red-to-green suite: 69/69.
- Full `npm test`: 128/128 pass.
- `npm run build`: pass.
- `npm run figma:export`: pass; current Figma export is English and remains
  unchanged in behavior.
- `npm run audit:design-contract`: pass; 6 Featured / 5 Archive / 2 global
  Press / 3 work Press; no active drift.
- `git diff --check`: pass.
- Headless Chromium QA at 1440×1100 and 390×844 for `/en/` and `/zh/`:
  - English: six availability pills, six detail taglines, twelve runtime
    screening-strip taglines including the cloned sequence.
  - Chinese: five availability pills, one detail tagline, two runtime
    screening-strip taglines including the clone.
  - Empty availability/detail/strip elements: zero in all four scenarios.
  - For each of the five blank Chinese Featured items, `.work-description` has
    `h3` as its immediate previous element; no tagline node remains between.
  - The blank Slow Steps screening card's role is its final content child.
  - Console errors and page errors: zero.
- Twelve section screenshots were generated and visually inspected. Chinese
  desktop/mobile availability, screening strip, and Slow Steps detail retain
  the existing rhythm with no visible hole; English desktop/mobile retains the
  populated tagline.

## Safety and boundaries

- Protected untracked file
  `docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md` remains
  untracked and byte-identical at SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.
- No `main` change, hosted Preview, alias change, or deployment is authorized.
- The remaining 44 broader Chinese differences stay unapproved and untouched.
- The prior decision workbook's “visibility variant” wording is superseded;
  this package intentionally does not add layout variants.

## Requested review dimensions

1. Does the source/validator/renderer/work-order contract preserve a durable
   intentional blank without conflating it with missing data?
2. Can the same stable field be safely refilled later without schema or layout
   surgery?
3. Does either renderer path leave a DOM node, wrapper, or spacing risk not
   covered by the evidence?
4. Is any current P0/P1 correctness, privacy, bilingual, layout, or
   maintainability blocker supported by the supplied evidence?
5. Which observations, if any, are non-blocking follow-up rather than defects
   in this producer-approved package?
