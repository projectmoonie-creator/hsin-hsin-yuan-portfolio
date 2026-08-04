# Portfolio Studio A1-1 Safe Apply — Implementation Checkpoint

Date: 2026-08-04

State: `PASS_WITH_OPEN_ITEMS`

## Outcome

A1-1 now provides the producer-approved local command:

```sh
npm run media:apply -- \
  --plan <approved-plan.json> \
  --reel <reel.mp4> \
  --poster <poster.webp> \
  --confirm <slug>
```

It canonically validates and re-probes one A0 Archive plan, classifies the
complete package as `fresh`, `already-applied`, `conflict`, or `partial`, and
mutates only `fresh`. It stages exact assets and targeted metadata candidates,
installs assets → manifest → content, and restores original metadata/removes
only invocation-created assets on handled failures. Exact reruns are read-only.

This is an implementation checkpoint, not an external-review closeout. The
required independent lane is still open, so A1-1 must not be merged to `main`
or treated as release-ready yet.

## Repository state

- Branch: `codex/portfolio-studio-a1`.
- Base / rollback checkpoint:
  `fb6517591e34b9cb20d814891c0177cf2ac9ba2c`.
- Approved design commit:
  `4c26acbeafe91185850ecd073dd8bf0365a87897`.
- Validated implementation commit:
  `fc90e53a4580fd3b6c26ac9d63bfa02ceabead9e`.
- Frozen review-packet commit:
  `02ad0a0` (full commit readback is recorded outside this self-referencing
  report after the documentation commit).
- Frozen packet SHA-256:
  `6010b94cb914b6c856644444909ff0a1fd13ca39baa89debf2b054809afdc965`.
- The pushed feature remote exactly matched each coherent checkpoint when read
  back. `origin/main` remains
  `382e02a21fbcf6ffef68881b7e497235eaf8a7a8`.

## TDD and deterministic validation

- RED was observed as `ERR_MODULE_NOT_FOUND` before the apply library existed.
- Focused apply suite: 19 passed, 0 failed.
- Full repository suite: 90 passed, 0 failed.
- `npm run audit:design-contract`: pass; no active drift.
- `npm run build`: pass.
- `npm run figma:export`: pass with no tracked output change.
- `git diff --check` and both source syntax checks: pass.
- Post-A1 `dist` is byte-for-byte identical to the saved pre-implementation
  baseline, so no browser claim is required for this tool-only package.
- The protected untracked review file stayed unmodified and unstaged at
  SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.

Tests prove exact fresh installation, preservation of unrelated content and
manifest bytes, zero-mutation exact rerun, strict canonical/schema/confirm
gates, recomputed media identity, path alias rejection, partial/conflict
refusal, strict non-interactive CLI behavior, path-redacted errors, and
recovery after reel, poster, manifest, and content installation failures.

## Real package smoke

The original preserved A0 Three-Minute plan is valid JSON but not canonical
A1 JSON because several nested objects were compacted. A1 correctly rejected
it before preflight and wrote nothing. The original evidence was not changed.

A separate canonical serialization was proven semantically identical to that
preserved plan, then passed to the real CLI with the same producer-approved
private sources. The receipt returned `already-applied`. The registered
manifest, content, reel, and poster hashes stayed exact; Git showed no tracked
change and no temporary sibling remained.

## External-review attempt and adjudication

The same frozen packet was prepared for both provider lanes.

- Gemini: `incomplete`. The sandboxed controlled REST wrapper could not resolve
  the official endpoint; the necessary unsandboxed retry was then denied by
  the environment approval gate because the packet contains repository
  implementation details. No model was selected, no generation request was
  sent, no usage was incurred, and no workaround was attempted.
- Claude: `incomplete / handoff-to-active-session`. The compatibility wrapper
  made no model request. No standalone Claude process, API key, pay-as-you-go,
  extra usage, or provider fallback was used.

There are therefore no external findings to accept, reject, or downgrade, and
no independent `PASS` is claimed. Local evidence supports the implementation,
but it cannot satisfy the Bible's independent-review gate by itself.

## Explicit limits

- Canonical JSON proves exact bytes, not approver identity; custody of the
  approved file is the operator trust boundary.
- No lock or concurrent-writer guarantee.
- No atomicity claim for `SIGKILL`, kernel failure, or power loss; a later run
  detects partial state and refuses it.
- No signature registry, CMS, database, general collection support, Git
  staging, source-master move, Preview, alias, Contact submission, or deploy.

## Open items and exact next action

1. Obtain one independent findings-only review of the exact frozen packet.
   The producer may explicitly authorize sending that packet through the
   controlled Gemini lane, or submit it in the already-running Claude
   subscription session.
2. Locally adjudicate any finding and rerun the deterministic gates.
3. Only after the independent review gate passes, ask for a separate A1 merge
   decision. Production remains a later explicit decision.

Nothing implemented in A1-1 is outside the repository or feature-branch
remote. The only session-local artifacts are the canonical smoke copy and the
raw Claude handoff status; neither is required to reproduce the committed code
or test suite.
