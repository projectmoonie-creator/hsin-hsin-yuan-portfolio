# Codex Independent Brainstorm: Bilingual Copy Work Order

## problem_reframe

The hard problem is not moving 31 strings. It is preserving three different
jobs without letting them become three competing sources: Excel for human
review, a work order for an auditable change request, and repository data for
public truth. The mechanism succeeds only if a stale work order cannot silently
overwrite newer canonical copy and ordinary copy changes do not reformat whole
files.

## pragmatic_path

Use the proposed narrow steel thread. Commit one self-contained JSON work
order with exact source hashes, baseline provenance, per-entry `sourceFile`
and `stableKey`, and explicit per-locale `replace`/`keep` operations. A
dependency-free CLI performs a full semantic preflight, reports planned counts
by priority and locale, and writes only with `--write --priority P0|P1`.

Resolve each stable key against parsed canonical data first. Then replace the
single exact JSON string token for the expected value in the declared source
file. Refuse zero or multiple token matches. This preserves formatting for the
current text-only scope. The tradeoff is intentional narrowness: keys whose
old text appears twice in one source file must wait for a stronger token-span
locator rather than being guessed.

## alternative_architecture

Generate a complete canonical content snapshot from all 169 workbook rows,
then compare and serialize entire repository data documents. This would make
future whole-workbook imports simpler and could validate every key family at
once. Its costs are larger scope, formatting churn, a second full-schema
mapping, and a greater chance that status-only or stale workbook rows alter
unapproved content. It is the wrong first move for an approved 31-entry slice.

## low_cost_experiment

Before implementing writes, create a fixture with one JSON source and one
Markdown-frontmatter source. Prove four things in RED/GREEN order: dry-run
leaves bytes unchanged; one stale expected value blocks the whole batch; a
duplicate raw token is rejected even when the semantic path resolves; and a
valid P0 write changes only the intended string bytes. Then run the real
31-entry work order in dry-run and require 13 P0 entries, 18 P1 entries, 57
replacements, five keeps, and zero conflicts.

## contrarian_challenge

The committed work order may be unnecessary after application: Git already
records old and new canonical values. If it survives indefinitely without a
clear role, it becomes a stale parallel copy. Retain it only as frozen input
evidence tied to hashes and a completed receipt; never let build or Figma read
it. Future batches should generate a new work order rather than edit this one.

## unconstrained_possibility

A later editorial console could render canonical repository copy as a table,
accept producer edits, and export the same guarded work-order schema with live
conflict detection. That would remove manual Excel-to-JSON preparation while
keeping Git-backed canonical data. It is explicitly beyond this package and
should not influence the steel-thread implementation.

## overlooked_risks

- A raw expected string may occur more than once in one file; uniqueness must
  be a hard gate, not a best-effort choice.
- Unicode punctuation may be visually identical but byte-different; expected
  values must compare exactly and reports should identify the stable key.
- A successful source write with stale copy-contract tests can leave the
  package red; tests and generated Figma output belong to the same P0/P1
  package, not Batch 0.
- P0 and P1 share source-file machinery but not review risk. The CLI must not
  treat `--priority P1` as permission to skip an unapplied P0 precondition.
- Staging temporary siblings can pollute Git after interruption. Names must be
  deterministic or cleaned in `finally`, and tests should assert no residue.

## assumptions_to_verify

- Every replacement's expected string is unique within its declared source
  file at the baseline.
- All P0 and P1 stable keys resolve to scalar strings in current `site` or
  Featured frontmatter data.
- The five English no-ops are exactly the intended `keep` operations, not
  missing edits.
- Applying P0 does not alter the expected-current values required by P1.
- Existing build and Figma generators read only canonical source files.

## recommended_next_decision

Proceed with the narrow work-order contract and two-family resolver. Require a
full preflight before writes, byte-preserving targeted replacement, an explicit
priority flag, and fail-closed handling for duplicate tokens. Use staged
replacement with handled rollback only if the first fixture proves direct
writes can leave a partial package under an injected error; do not build a
general transaction framework speculatively. Keep the work order as frozen
evidence, never as an active public-content source.
