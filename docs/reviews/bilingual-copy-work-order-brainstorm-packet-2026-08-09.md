# Frozen Brainstorm Packet: Bilingual Copy Work Order

Date: 2026-08-09

## Instruction

Brainstorm only. Do not edit the repository, workbook, website, Figma output,
tests, deployment state, or protected untracked document. Treat this packet as
frozen. Return materially different paths and falsifiable experiments, not
generic agreement or a disguised implementation plan.

## Decision And Owner

The producer approved the previously recommended sequence: first create a
guarded, maintainable copy-import mechanism with no public-copy change; then
apply the approved P0 and P1 copy as paired Chinese/English batches. Codex is
the implementing lane. The producer owns any material expansion of scope,
public layout change, data migration, deployment, or change to the approved
copy.

The remaining architecture decision is the smallest reusable boundary for
moving an editorial Excel review into the repository without making Excel a
second public-content source of truth.

## Why This Decision Is Needed Now

The current site already keeps public copy in canonical repository sources:
`data/site.json` and JSON frontmatter in `content/works/*.md`. The website and
Figma export consume those sources. A producer-reviewed workbook and its
machine-readable priority export now contain 31 approved stable-key entries:
13 P0 site/positioning entries and 18 P1 Featured Work entries. A one-off
manual replacement would apply this package but would not create the
replaceable, conflict-aware maintenance path the producer requested.

## Frozen Baseline And Source Evidence

- Branch: `codex/three-minute-watch-link`.
- Baseline commit: `2f56352cb3049ab8fb535c0ae3c1d0fa57cb599f`.
- Remote backup `backup/2026-08-06/chinese-copy-workbook-2f56352` was read back
  at the exact same commit on 2026-08-09.
- Protected untracked document:
  `docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md`, SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.
- Original local editorial workbook SHA-256:
  `1d0210cf39a688e417c67edb3b0c2d3ccf9201c3485c055c2d6a541ed6ac9600`.
- Producer-supplied revised `preview.xlsx` SHA-256:
  `e0472235778da5bb19c2108e1fe57a293ca5462fd28430699ff1ad4a7acdd897`.
- Producer-supplied priority `preview.json` SHA-256:
  `b93e9abfa2589a25d0998c42af5fd14c03753d77f003827c5de2e40b878ebba3`.
- Producer-supplied instructions `preview.md` SHA-256:
  `10f1a9fb511cc79de088f9b41b251e14ca2fbfedf5dc92e8de4455fbfa69933a`.

## Current Evidence And Assumptions

- All 31 priority entries have exact `stableKey` and `sourceFile` matches at
  the baseline commit.
- All 31 Chinese values are real changes. Twenty-six English values are real
  changes; five English values already equal the proposal.
- The P0 set changes bilingual positioning and SEO, so Chinese-only
  application would create a positioning mismatch.
- The 31-entry package repairs all six blank proposals from the older local
  workbook and fixes its malformed Chinese meta description.
- The broader revised workbook contains 75 actual Chinese cell differences,
  but its status metadata and narrative counts do not exactly equal the cell
  diff count. The remaining 44 actual differences are not approved for this
  work package.
- A temporary application of the 31 entries built successfully and showed no
  clipping or horizontal overflow at desktop, tablet, and mobile sizes. English
  mobile becomes substantially denser, so P1 still needs final browser review.
- Existing full tests pass 111/111 at the baseline. Four copy-contract tests
  intentionally pin old values and must change with the approved public copy.

## Proposed Architecture

1. Keep Excel as the producer-facing editorial review artifact, not as a
   runtime or canonical public-content source.
2. Preserve one versioned JSON work order as the machine-readable transport.
   It records a batch id, baseline commit, source-artifact hashes, locale scope,
   stable key, exact source file, priority, and per-locale operation.
3. Each locale operation is explicit: `replace` or `keep` in this first steel
   thread. Blank text never means deletion. A future `clear` operation requires
   a separately classified optional-field contract.
4. Every `replace` carries both the expected current value and approved next
   value. The tool refuses stale or mismatched sources before writing anything.
5. One dependency-free Node CLI defaults to report-only dry-run. Explicit
   `--write` plus one priority applies only the selected batch after validating
   the entire selected set. It preserves source formatting through targeted
   string-token replacement after semantic path validation.
6. The CLI supports the current `site.*` and `featured.<slug>.*` stable-key
   families. Additional workbook families are added only when their batch is
   approved and test-driven.
7. Canonical repository data remains the sole source for website and Figma.
   The work order is an auditable transport/receipt, not a parallel renderer
   input.

## Constraints, Non-Goals, And Reversible Boundaries

- P0 must apply before P1. Chinese and English apply as one paired scope.
- No layout, CSS, component, work order, URL, array length, or unrelated data
  change.
- No Excel parser or spreadsheet dependency is added to the website repo.
- No blank-as-delete behavior and no inference from missing fields.
- The default command writes nothing. All conflicts are detected before the
  first write; a failed write must not be reported as complete.
- Preserve JSON/Markdown formatting and Markdown bodies; avoid full-file
  serialization churn.
- Work test-first. The approved copy and generated outputs become the new
  explicit regression baseline only in the P0/P1 packages.
- No merge or push to `main`, Preview, Production, alias change, Contact
  submission, or deployment.
- The protected untracked document remains byte-identical and outside Git.

## Affected Systems And Downstream Decisions

- A versioned editorial work order under a non-runtime repository path.
- One copy-work-order library/CLI and focused Node tests.
- `package.json` command surface.
- P0 canonical source: `data/site.json`.
- P1 canonical sources: six `content/works/*.md` files.
- Existing copy-contract expectations in tests and generated Figma SVGs.
- `STATUS.md` and `docs/reviews/LOG.md` after product gates pass.

## Ideation Questions

1. Is `Excel review → versioned JSON work order → guarded repo apply` the
   smallest maintainable boundary, or does the committed work order add more
   maintenance than it removes?
2. Is an expected-current-value precondition plus preflight-all-before-write
   sufficient for this low-risk text-only package, or is a rollback-capable
   multi-file writer necessary now?
3. Is targeted JSON-string-token replacement, preceded by semantic stable-key
   validation and uniqueness checks, a sound way to preserve formatting?
4. Should the first steel thread support only `site` and `featured` families,
   or normalize all 169 workbook key families before applying these 31?
5. What is the cheapest experiment that can falsify the mechanism before any
   public copy is changed?
6. Which provenance fields materially prevent drift, and which would be
   premature workflow bureaucracy?

## Required Response Schema

Return these exact sections:

1. `problem_reframe`
2. `pragmatic_path`
3. `alternative_architecture`
4. `low_cost_experiment`
5. `contrarian_challenge`
6. `unconstrained_possibility`
7. `overlooked_risks`
8. `assumptions_to_verify`
9. `recommended_next_decision`

For each path, state concrete tradeoffs. Do not claim another reviewer agrees;
this is one independent first-round lane.
