# Portfolio Studio A1 — Codex Independent Brainstorm

## problem_reframe

A1 is not mainly a file-copy command. It is a small state transition from an
approved, path-redacted intention to one exact Git-visible package. The useful
guarantee is: every input and target is classified before mutation; the only
successful terminal states are `applied` and `already-applied`; every other
state leaves the repo as it began.

## pragmatic_path

Add `media:apply` with `--plan`, `--reel`, `--poster`, and `--confirm <slug>`.
Load the approved JSON, recompute A0's plan from the current input bytes, compare
the two semantic objects, and preflight four targets: content record, manifest,
reel, and poster. Patch JSON frontmatter by inserting a generated property block
before the existing top-level `summary` property, then parse the result before
writing. Stage temporary siblings, install them in a fixed order, and keep the
original manifest/content bytes for handled rollback. Tradeoff: process crashes
cannot make four filesystem renames globally atomic, but normal exceptions are
recoverable without adding a journal system.

## alternative_architecture

Generate a Git-compatible patch plus a media-copy shell recipe, then require a
second manual command to apply it. This creates a strong inspection boundary
and delegates rollback to Git, but it leaves the original repetitive work in
place and makes binary copying awkward. It also risks users applying only half
the recipe, which is the exact partial-state problem A1 should remove.

## low_cost_experiment

Before the CLI, write one pure preflight/apply fixture test in a temporary repo:
start with one Archive record and the A0 manifest profiles, reuse existing small
approved media as source fixtures, assert the fresh state applies, rerun for an
exact no-op, alter one target byte for a conflict, and inject a failure after
the first installed asset to prove rollback. If the frontmatter byte diff
touches anything outside the inserted block, reject the splice design before
building the command wrapper.

## contrarian_challenge

The safest A1 may be no writer at all: A0 already reduces the work to a
reviewable packet, and a writer creates a larger blast radius than its saved
minutes justify. Counterpoint: the Three-Minute steel thread demonstrated that
manual copying and dual-ledger editing are exactly where the workflow remains
long and content-specific. A tightly scoped, default-deny writer is justified
only if it demonstrably refuses conflict and partial states.

## unconstrained_possibility

A future Portfolio Studio could show discovered local media, let the producer
set rights/alt/focal metadata, preview the generated card, and submit a signed
change request to a repository bot. That could cover images, Featured reels,
press, and Figma parity. It is intentionally outside A1: it adds identity,
hosting, secrets, queues, and deployment policy before the repo-local contract
has earned them.

## overlooked_risks

- Semantic plan equality can hide duplicate JSON keys unless parsing rejects or
  otherwise detects them before approval comparison.
- A source file resolving to its intended target can truncate itself during
  copy unless real paths are compared.
- An exact asset target with absent content/manifest is a mixed partial state,
  not permission to finish opportunistically.
- Whole-frontmatter serialization can erase hand formatting even when values
  remain semantically equal.
- Rollback code can overwrite a concurrent human edit; A1 should document that
  concurrent writers are unsupported rather than add a lock prematurely.
- Error text or receipts can reintroduce absolute source paths even if the plan
  is redacted.

## assumptions_to_verify

- Every target Archive file has a unique top-level `summary` anchor and valid
  JSON frontmatter.
- Planned patch keys are absent for a fresh record and exact for an applied
  record.
- Existing source media and public asset targets are distinct real paths.
- Temporary sibling writes and rename semantics work on the repository volume.
- The existing media probes are fast enough to run again during apply.

## recommended_next_decision

Choose the pragmatic direct apply with four explicit arguments, semantic
plan-recomputation, a four-state preflight (`fresh`, `already-applied`,
`conflict`, `partial`), formatting-preserving frontmatter insertion, staged
sibling files, and handled rollback. Defer locking, signing, UI, and generalized
collection support until this Archive-only transaction has been used on at
least one additional approved work.
