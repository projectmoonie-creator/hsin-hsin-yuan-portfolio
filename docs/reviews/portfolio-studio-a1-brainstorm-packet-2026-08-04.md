# Frozen Brainstorm Packet: Portfolio Studio A1 Safe Apply

Date: 2026-08-04

## Instruction

Brainstorm only. Do not edit files, deploy, contact anyone, or assume access to
private media. Treat this packet as frozen. Return materially different paths
and falsifiable experiments, not a disguised implementation plan or generic
agreement.

## Decision and owner

The producer chose `A1`: turn an approved A0 dry-run Archive media plan into a
safe repo-local apply operation. The remaining architecture decision is how to
validate approval, preserve hand-edited content formatting, prevent partial or
conflicting writes, and keep reruns predictable. The producer owns final scope;
Codex is the implementing lane.

## Current evidence

- Repository branch: `codex/portfolio-studio-a1`.
- A1 baseline: `9f2d9c81034099caccb9f755e1046816accc808c`.
- A0 provides:
  - `data/media-manifest.json`, one canonical exact-integrity ledger;
  - `scripts/lib/media-manifest.mjs`, which validates profiles, exact hashes,
    safe `/assets/` paths, owners, and content linkage;
  - `scripts/lib/media-package-plan.mjs`, which probes reel/poster inputs and
    returns a path-redacted JSON plan;
  - `npm run media:plan -- ...`, which writes nothing.
- A0's real Three-Minute steel thread passed 71 tests, build, Figma export,
  design audit, full decode, desktop/mobile browser QA, privacy scan, and one
  usable Gemini review lane.
- Archive records are Markdown files containing JSON frontmatter. Existing
  compact formatting and manually grouped field order should not be replaced by
  whole-file `JSON.stringify` output.

## Intended A1 experience

Given an explicitly approved plan JSON plus the same reel and poster inputs,
one command either:

1. re-probes and proves the inputs still generate the approved plan;
2. applies exactly two public derivatives, two manifest entries, and the plan's
   frontmatter patch; then prints a path-redacted receipt; or
3. changes nothing and explains the exact conflict.

A rerun against the exact completed state should be a verified no-op. The tool
must never stage, commit, push, merge, deploy, modify source masters, or touch
unrelated/untracked files.

## Constraints and reversible boundaries

- Node.js ESM and built-ins only; keep the current renderer and public output
  unchanged.
- Require an explicit confirmation tied to the plan slug; no implicit write
  mode and no interactive prompt.
- Recompute the plan from current inputs and compare it to the approved JSON;
  do not trust an edited plan or stale media bytes.
- Reject unsupported schema/mode, path traversal, wrong content slug, unknown
  patch keys, existing conflicting manifest IDs/paths, conflicting public
  targets, mixed partial state, and source/target aliasing.
- Preserve original content body and existing frontmatter bytes except for one
  deterministic inserted property block.
- Preflight every target before the first mutation. A handled write failure
  must restore original manifest/content and remove only A1-created targets.
- Do not add signing, a trust registry, a hosted CMS, a database, concurrency
  locking, or source-media custody in this steel-thread package.
- The protected untracked review file must remain byte-identical and outside
  Git.
- `origin/main`, Preview, aliases, Contact, and Production remain untouched.

## Affected files and systems

Likely new files: an apply library, CLI, and focused tests. Likely modified
files: `package.json`, the existing planner only if it needs exported
validation, an implementation plan, and bounded status/log entries. A real A1
smoke should use the already-applied Three-Minute plan as a verified no-op or a
temporary fixture; it must not publish a new work.

## Ideation questions

1. What is the smallest safe approval/confirmation contract?
2. Should apply mutate directly with rollback, stage a patch for a second
   command, or produce a separate transaction directory?
3. How can JSON frontmatter be patched without reformatting hand-edited data?
4. What exact state machine distinguishes fresh, already-applied, conflicting,
   and partial states?
5. Which failure-injection tests are worth their cost for A1, and which
   defenses should wait?
6. What low-cost experiment can falsify the recommended design before the full
   implementation?

## Required response schema

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
