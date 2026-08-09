# Bilingual Copy Work Order — Architecture Brainstorm Synthesis

Date: 2026-08-09
Status: producer-approved for inline execution

Frozen packet SHA-256:
`cf2da33db31c9cd376b9c9125d80c9b64f82150dbe02259a43769c4fc6df2f4c`

## Consensus

- Keep Excel as the human editorial artifact and repository data as the only
  public-content source of truth.
- Preserve one versioned JSON work order between them for provenance,
  stable-key mapping, expected-current conflict checks, and explicit locale
  operations.
- Default the command to dry-run and reject the entire selected batch before
  writes if any stable key, source file, expected value, or token match is
  invalid.
- Support only `site.*` and `featured.<slug>.*` in this first steel thread;
  reject rather than guess at other workbook families.
- Preserve existing JSON/Markdown formatting and bodies. Do not serialize
  entire source files for text-only replacements.
- P0 and P1 remain separate application/verification checkpoints; Chinese and
  English stay paired.

## Complementary Ideas

Codex emphasized a unique-token gate after semantic path validation so a raw
string replacement can never choose between ambiguous occurrences. Gemini
emphasized handled rollback if a later filesystem error occurs after one of
the seven target files has already been replaced. Both are required: full
preflight prevents semantic conflicts, while sibling staging/backups restore a
handled partial write.

Both lanes recommended testing conflict refusal and formatting fidelity before
touching public copy. Codex additionally requires the real dry-run to report
exactly 13 P0 entries, 18 P1 entries, 57 replacements, five keeps, and zero
conflicts.

## Provider-Unique Ideas

- Codex: keep `clear` out of schema v1. Blank never means deletion; add an
  explicit clear operation later only after optional fields are classified.
- Codex: a work order becomes stale if treated as active content. Preserve it
  as frozen input evidence plus receipt, and generate a new file for each
  future batch.
- Gemini: test partial-file-write recovery, not only preflight conflicts.
- Gemini: a Git-native CMS is a possible unconstrained future direction, but
  it is outside this package and does not influence the steel thread.

## Contradictions And Adjudication

### Manual edit vs reusable importer

Gemini's contrarian path notes that 31 manual replacements would be faster.
The producer explicitly requested future-maintainable, replaceable originals,
and already approved Batch 0 before copy application. Manual-only editing does
not satisfy that decision. Keep the importer bounded rather than omit it.

### AST/full serialization vs targeted token replacement

Full serialization makes semantic updates simpler but creates broad formatting
diffs in current mixed compact/expanded JSON. Targeted replacement is accepted
only after parsed stable-key validation, exact expected-current comparison,
and a one-token-in-declared-file gate. Any ambiguous case fails closed.

### Preflight only vs rollback-capable writes

Preflight protects against stale content but not a later filesystem error.
Adopt Gemini's handled rollback for staged sibling replacements. Do not claim
power-loss-safe multi-file atomicity; the bounded promise is validate first,
restore on handled failure, and leave no staging residue.

## Experiments

1. Fixture dry-run leaves source bytes and fixture directory contents
   unchanged.
2. One stale expected value rejects the whole selected batch with zero writes.
3. A duplicate raw token is rejected even when the stable key resolves.
4. An injected failure after the first replacement restores every target and
   removes staging/backup siblings.
5. A valid fixture write changes only the intended JSON string token bytes.
6. The real 31-entry work order dry-run produces the exact approved counts and
   source-file set before P0 is applied.

## Options

### A — Narrow guarded work-order steel thread (selected)

Versioned JSON evidence, two stable-key families, full preflight, targeted
format-preserving replacement, handled rollback, explicit priority, and no
runtime consumer. This adds a small internal tool but no public-data schema or
maintainer workflow duplication.

### B — Manual one-off application

Lowest immediate effort, but no reusable conflict-aware maintenance path and
therefore inconsistent with the producer's componentization decision.

### C — Normalize all 169 keys or centralize all locale copy now

More general but expands the migration and regression surface before the 31
approved entries have completed the steel thread. Defer unless the remaining
44 actual workbook differences are approved.

## Decision

Select Option A. The producer approved the recommended Batch 0 → P0 → P1
sequence and bilingual scope with `好，照步驟執行` on 2026-08-09. The
brainstorm added handled rollback but did not change schema, rights, public
behavior, approved copy, or external-state scope, so the existing execution
authorization remains applicable. Options B and C are not authorized.

## Provider Status

| Lane | Requested | Observed | Completed | Status |
| --- | --- | --- | --- | --- |
| Codex | highest-capability current primary session | exact ID not exposed | exact ID not exposed | completed independent first round; no ID inferred |
| Gemini | `gemini-3.6-flash` selected by controlled GA router | `gemini-3.6-flash` | `gemini-3.6-flash` | completed; 2,079 input / 2,162 output / 5,964 total tokens |
| Claude | highest-capability generally released model at active-session submission | not observed | not completed | `handoff-to-active-session`; no model request sent and no billing fallback |

No dual- or three-lane consensus is claimed. The recorded producer decision,
not model agreement, closes this architecture gate.
