# Chinese Interface Manager Workbook

Date: 2026-08-09

State: `READY_FOR_PRODUCER_EDIT`

## Artifact Decision

The producer requested one final Chinese-interface management workbook for a
small follow-up copy pass. The workbook is an offline editorial artifact only;
it does not automatically write to the website. Its stable contract is:

- edit only the `修改後中文` column;
- a blank Chinese cell means that locale's element should not render, while
  the field/key and layout contract remain available;
- Chinese and English are independent, and Chinese edits do not modify the
  English reference;
- returning the workbook starts a stable-key guarded dry-run and producer
  review before any repo change.

The final artifact is:

`../outputs/hsin-hsin-yuan-zh-manager-2026-08-09/Hsin-Hsin-Yuan-Portfolio-Chinese-Interface-Manager-2026-08-09.xlsx`

SHA-256:
`fceaaf17714ad6513d88c052b8e91b378553095f148455d3768ac8ef2d28326d`.

## Merge And Preservation

- The latest producer/ChatGPT management source `preview.xlsx` was used as the
  proposal layer because it contains the newer 75-difference Chinese revision
  set and its 87-row historical apply list. The original 169-key workbook
  remained the schema/provenance baseline.
- All 169 stable keys match between the two sources. The final workbook removes
  the stale `Codex 套用清單` sheet and retains seven focused management sheets.
- The 31 already-approved P0/P1 keys were rebased to the current repository;
  the later six approved Chinese-only blanks override their earlier filled
  values. The remaining 44 Chinese differences are preserved exactly as
  pending proposals.
- Eight proposal cells are intentionally blank: the six approved localized
  omissions plus the already-empty `site.worksHint` and
  `site.contactTitleBridge`. Every other editable Chinese cell is populated,
  making later blanks unambiguous producer intent.
- English is the current website reference only. The obsolete bilingual apply
  sheet was removed so later Chinese editing cannot be mistaken for permission
  to rewrite English.
- The original workbook and supplied preview remain unmodified at SHA-256
  `1d0210cf39a688e417c67edb3b0c2d3ccf9201c3485c055c2d6a541ed6ac9600`
  and `e0472235778da5bb19c2108e1fe57a293ca5462fd28430699ff1ad4a7acdd897`.

## Verification

- The final workbook opens as a valid XLSX archive with seven expected sheets,
  169 unique keys, exact review-dropdown ranges, freeze panes, filters, no
  external links, and no missing row ID/source identity.
- It contains 190 formulas: 169 live Chinese-length deltas plus 21 summary
  formulas. Formula references are exact and the literal error scan found zero
  `#REF!`, `#DIV/0!`, `#VALUE!`, `#N/A`, or `#NAME?` values.
- The packaged recalculation helper could not use its LibreOffice macro on this
  Mac. Formulas therefore remain dynamic with automatic recalculation enabled;
  they were not replaced by hardcoded values.
- An independent LibreOffice engine open/export calculated the summary as
  169 total / 44 pending / 125 confirmed-or-retained and rendered the workbook
  to nine A4 pages. All nine pages were visually inspected after supplying a
  temporary macOS font catalog; Chinese text, editable/status colors, table
  structure, and print-width fitting are intact.
- The workbook uses `Arial Unicode MS` consistently while preserving the
  template's sizes, weights, colors, fills, and alignment, avoiding the old
  Latin-only `Carlito` fallback risk.

## External-State Boundary

No website data, English copy, Figma output, `main`, Preview, Production,
alias, Contact, or protected untracked file changed. The workbook stays outside
Git as a producer-editable output. The exact next action is producer editing of
column G and return of the same workbook for a guarded Chinese-only dry-run.
