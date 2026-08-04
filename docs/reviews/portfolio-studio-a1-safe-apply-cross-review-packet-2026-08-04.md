# Read-Only Cross-Review Packet: Portfolio Studio A1-1 Safe Apply

Date: 2026-08-04

## Reviewer instruction

Review only. Do not edit files, execute the writer, deploy, contact anyone, or
request credentials/private media. Treat this packet as frozen. Findings must
cite a current path and line/range named below or a reproducible contradiction
in the packet. Evaluate the bounded single-operator local workflow that was
approved; do not turn a hosted CMS, database, signature system, lock service,
or power-loss transaction manager into a blocker.

## Objective and target

- Repository: Hsin-Hsin Yuan Portfolio
- Branch: `codex/portfolio-studio-a1`
- A1 base: `fb6517591e34b9cb20d814891c0177cf2ac9ba2c`
- Reviewed head: `fc90e53a4580fd3b6c26ac9d63bfa02ceabead9e`
- Design commit: `4c26acbeafe91185850ecd073dd8bf0365a87897`
- Implementation commit: `fc90e53a4580fd3b6c26ac9d63bfa02ceabead9e`
- The feature head was pushed and read back exactly. `origin/main` remains
  `382e02a21fbcf6ffef68881b7e497235eaf8a7a8`; no Preview or Production
  deployment was created.

The objective is one narrow local command that applies an approved A0 Archive
reel plan:

```sh
npm run media:apply -- \
  --plan <approved-plan.json> \
  --reel <reel.mp4> \
  --poster <poster.webp> \
  --confirm <slug>
```

It may install exactly two public derivatives, append exactly two canonical
manifest entries, and insert one allowlisted content block. It must never run
Git, push, use a network, create a Preview, deploy, or write source paths to
tracked/public artifacts.

## Frozen source identities

- `scripts/lib/media-package-apply.mjs`, 434 lines,
  SHA-256 `3e81cf9ce8ef29ce2e689ff88c504248559aadaa4538972ce2de3815b35a4414`.
- `scripts/apply-archive-media-package.mjs`, 48 lines,
  SHA-256 `84c3b42076176886309ebb15000e464f10f5b40ed59ee54bf286c9e25e407a0f`.
- `tests/media-package-apply.test.mjs`, 296 lines,
  SHA-256 `73422fdd46d6cb8d00618815e2b316107488f7a8b023764220f01d49a6523a07`.
- `docs/superpowers/specs/2026-08-04-portfolio-studio-a1-safe-apply-design.md`,
  SHA-256 `df45ce53e0e300a017ed35aada538666b814ce96585fd247befa1dad89810663`.

## Approval and target validation

`scripts/lib/media-package-apply.mjs:23-98` declares the only plan and patch
keys. `parseApprovedPlan` requires valid JSON whose raw bytes equal
`JSON.stringify(plan, null, 2) + "\n"`, then requires schema 1, `dry-run`,
Archive, `writesFiles: false`, kebab-case slug, and exactly reel then poster.
This is a canonical-byte/evidence boundary, not a cryptographic signature.

`:101-139` derives public paths, manifest IDs, profiles, and owner fields only
from the confirmed slug and rejects additional/missing asset or manifest-entry
keys. The only targets are:

- `/assets/showreel/<slug>-card-reel.mp4`;
- `/assets/showreel/<slug>-card-reel-poster.webp`;
- `content/archive/<slug>.md`;
- `data/media-manifest.json`.

`:141-151` rejects lexical and existing real-path source/target aliasing.
`:153-171` re-probes both sources through the existing A0 planner and requires
deep identity between the approved and recomputed plans. This binds basename,
size, SHA-256, duration/profile facts, rights strings, bilingual alt, focal
point, source timecode, and every derived target to the current source bytes.

The inherited A0 planner uses `ffprobe` and SHA-256. Its profile verification
requires silent H.264 1280×720 BT.709 yuv420p faststart video and WebP
1280×720 poster. Public paths are normalized below `/assets/` before resolution.

## Four-state preflight

`scripts/lib/media-package-apply.mjs:173-231` parses the exact JSON
frontmatter, then classifies each target asset, each manifest entry, and every
allowlisted content property as absent, exact, or conflicting. The aggregate
result is:

- `fresh`: every component absent;
- `already-applied`: every component exact;
- `conflict`: any claimed component differs;
- `partial`: otherwise, meaning only part of the exact package exists.

`:388-429` performs all plan/source validation first, reads current manifest
and content, classifies the complete package, returns a read-only success for
`already-applied`, rejects `conflict`/`partial`, and calls the writer only for
`fresh`.

## Byte-preserving candidates

`scripts/lib/media-package-apply.mjs:233-265` serializes only the two new
manifest entries and inserts them before the current `assets` closing tail.
Every preceding manifest byte is retained, including existing compact owner
objects. The candidate is parsed and passed through `validateMediaManifest`.

`:267-284` requires one top-level two-space-indented `"summary"` anchor. It
orders the 11 approved fields, inserts only that JSON block before `summary`,
and preserves all existing frontmatter/body bytes. It parses the candidate and
deeply checks every inserted value.

This deliberately supports the repository's current canonical layouts only;
ambiguous or reformatted anchors fail closed instead of causing whole-file
reserialization.

## Staging, install, and handled-error recovery

`scripts/lib/media-package-apply.mjs:286-309` creates UUID-based
target-adjacent temporary siblings, has removal helpers, restores metadata via
a temporary sibling plus rename, and returns receipts containing only public
targets.

`:311-386` builds candidates before mutation; stages both assets and both
metadata candidates; re-verifies staged media, manifest, and content; then
installs in this exact order:

1. reel;
2. poster;
3. manifest;
4. content.

The function tracks only final assets created by this invocation and whether
manifest/content were installed. Any handled exception restores original
content and manifest bytes, removes only invocation-created final assets, and
removes all temporary siblings. If recovery itself fails it stops with
`recovery requires inspection` rather than claiming success.

This is a single-operator local workflow with no lock. It claims recovery for
handled process errors only, not atomicity under `SIGKILL`, kernel failure,
power loss, or concurrent writers. A later run detects an abrupt partial state
and refuses it.

## CLI and privacy boundary

`scripts/apply-archive-media-package.mjs:9-28` allows exactly four named
option/value pairs, each once, with no positional arguments. `:30-48` reads the
plan, calls the library, writes one compact JSON success receipt, and reports a
sanitized error. File-read failures do not echo paths. Library expected errors
contain no repository/source path, while unexpected errors collapse to
`media package apply failed` at `scripts/lib/media-package-apply.mjs:430-433`.

The implementation imports only Node filesystem/path/crypto/util APIs and the
existing local A0 manifest/planner modules. It has no Git, network, deployment,
process-spawn, shell, credential, or interactive-prompt capability. `ffprobe`
is inherited inside the read/probe A0 media library.

## TDD and validation evidence

The first focused run failed with `ERR_MODULE_NOT_FOUND` for the not-yet-created
apply library. After implementation:

- focused apply suite: 19 passed, 0 failed;
- full repository suite: 90 passed, 0 failed;
- design contract audit: pass, no active drift;
- build: pass;
- Figma export: pass with no tracked change;
- `git diff --check`: pass;
- regenerated `dist` is byte-for-byte identical to the saved pre-A1 baseline;
- source syntax checks pass;
- feature remote readback equals reviewed head.

`tests/media-package-apply.test.mjs:95-295` covers fresh exact installation,
preservation of all unrelated manifest/content prefix and suffix bytes, exact
asset copies, zero-mutation exact rerun with byte/mtime checks, noncanonical
plan, confirm mismatch, unknown patch key, recomputed hash mismatch, exact-one-
asset partial state, exact-one-manifest-entry partial state, conflicting asset,
conflicting content field, real-path alias, injected failures after reel,
poster, manifest, and content installation, leftover-temp absence, strict CLI,
no stdin prompt, and path-redacted failures.

A real CLI smoke used the producer-approved Three-Minute sources and a
canonical serialization of its unchanged A0 plan. It returned
`already-applied`; the manifest, content, reel, and poster retained their exact
registered hashes and no tracked file changed. The older preserved plan was
left untouched after the gate correctly rejected its semantically valid but
noncanonical compact-object formatting.

## Explicit boundaries

- No lock, signature/trust registry, CMS, database, general collection
  adapter, source-master move, Git staging, push-to-main, Preview, or deploy.
- Canonical JSON proves exact representation, not the identity of the person
  who approved it. Producer/operator custody of the approved file remains the
  trust boundary.
- No claim of crash consistency after uncatchable termination. Partial state
  must be inspected or rolled back manually before a new apply.
- The protected user-owned untracked review file remains unmodified and
  unstaged with SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.

## Requested review dimensions

1. Find any case where a malformed or changed plan/source can cross the
   approval boundary or redirect a target outside the exact Archive contract.
2. Find false `fresh`/`already-applied` classifications, destructive
   conflict/partial behavior, or a handled-error path that can delete/overwrite
   a pre-existing file.
3. Find recovery ordering or candidate-validation gaps that make the stated
   single-operator handled-error guarantee false.
4. Find absolute-path/private-data exposure in receipts, handled errors, or
   tracked/public output.
5. Evaluate whether tests establish the claimed properties without weakening
   existing A0 media integrity or public behavior.
6. Separate blockers/majors inside A1-1 from explicit future hardening such as
   locks, signatures, multi-collection support, or power-loss transactions.

## Required response schema

Return:

1. `VERDICT`: `PASS`, `PASS_WITH_FINDINGS`, or `BLOCK`.
2. `FINDINGS`: ordered by severity. For each, give ID, severity (`blocker`,
   `major`, or `minor`), exact path/line or packet evidence, why it matters in
   the approved scope, and the smallest safe recommendation.
3. `CONFIRMED_STRENGTHS`: only claims directly supported by this packet.
4. `EVIDENCE_GAPS`: what the frozen packet cannot establish.
5. `MERGE_RECOMMENDATION`: yes/no with conditions; Production remains a
   separate explicit producer decision.

Do not claim dual-review consensus. This response represents only its own
provider lane.
