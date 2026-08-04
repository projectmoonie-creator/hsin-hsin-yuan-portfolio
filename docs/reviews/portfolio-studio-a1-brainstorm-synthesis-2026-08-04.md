# Portfolio Studio A1 — Brainstorm Synthesis

Frozen packet SHA-256:
`1a848246b0cb9a9fbebf64bdb7e629050f117b2cbccb694e69f40a5a437f063e`

## Consensus

- A1 should remain one repo-local Archive writer, not become a hosted CMS.
- Approval must bind the plan slug and exact recomputed plan to the current
  reel/poster bytes.
- Every target must be classified before mutation; conflicts and mixed partial
  states fail closed.
- Existing manifest/frontmatter bytes should be preserved outside localized
  inserted blocks.
- New file bytes should be staged beside their targets and installed by rename;
  handled failures should roll back A1-created targets and restore originals.
- A verified rerun should return `already-applied` without rewriting.

## Complementary and provider-unique ideas

Codex emphasized an explicit four-state model (`fresh`, `already-applied`,
`conflict`, `partial`), real-path source/target alias checks, and a failure-
injection fixture before the CLI. Gemini added target-adjacent staging to avoid
cross-device rename errors, line-ending preservation, and the risk of abrupt
process termination between individual filesystem renames.

Gemini's contrarian option would stop writing Archive frontmatter and join the
manifest dynamically at build time. That removes the splice problem but changes
the canonical content contract and renderer boundary, so it is a larger A2+
architecture rather than a safe A1 continuation.

## Contradictions

The lanes differ mainly on workflow shape. Codex favors one direct apply command
because a two-stage patch recipe preserves manual work. Gemini keeps a staged
transaction directory as a viable alternative for human inspection. Both agree
that OS-level global atomicity across four paths is unavailable; A1 must promise
handled rollback and detectable partial state, not power-loss-proof atomicity.

## Options

### A1-1 — One-command validated apply (recommended)

`media:apply` receives an approved plan, current reel/poster paths, and a slug
confirmation. It requires canonical plan bytes, recomputes the plan, preflights
all targets, stages four sibling files, then installs assets → manifest →
content. It rolls back handled failures and treats a complete exact rerun as a
no-op. Lowest daily friction; abrupt termination can still leave a detectable
partial state that the next run refuses.

### A1-2 — Two-command stage and commit

The first command builds a reviewable transaction directory; the second
revalidates and installs it. Easier to inspect before mutation, but creates
stale scratch-state cleanup and keeps two steps in the workflow.

### A1-3 — Manifest-only media join

Stop patching content and make the renderer derive Archive media from the
manifest. Simplifies writes but changes the canonical content/view-model
architecture and touches public consumer behavior. Too broad for A1.

## Low-cost experiment

In a temporary repo, use existing approved test media to prove: localized
frontmatter/manifest insertion changes no pre-existing byte; a fresh state
applies; a rerun is byte-identical; a conflicting or mixed state writes
nothing; an injected exception after asset installation restores the original
manifest/content and removes only created targets.

## Risks retained for the spec

- Reject noncanonical or duplicate-key plan JSON by requiring the raw plan file
  to equal its canonical serialization before semantic recomputation.
- Detect source/target aliasing through resolved real paths.
- Use exact allowlisted patch keys and one validated top-level `summary` anchor.
- Never claim crash-proof atomicity or add concurrency locking in A1.
- Receipts and errors must not print absolute source paths.

## Recommendation and producer status

Adopt A1-1. The producer already chose the overall A1 safe-apply scope; the
remaining approval is the one-command transaction shape above.

- Codex: completed independent first round; exact runtime model ID not exposed.
- Gemini: completed on `gemini-3.6-flash`; 1,158 input / 2,308 output / 4,593
  total tokens.
- Claude: `incomplete`, `handoff-to-active-session`; no model request or billing
  fallback was used.
