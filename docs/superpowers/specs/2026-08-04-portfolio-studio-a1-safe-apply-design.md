# Portfolio Studio A1-1 Safe Apply Design

Date: 2026-08-04

Status: approved for TDD implementation by the producer on 2026-08-04

Work package branch: `codex/portfolio-studio-a1`

Base / rollback checkpoint: `fb6517591e34b9cb20d814891c0177cf2ac9ba2c`

## Goal

Turn an approved A0 Archive media plan into one narrow, fail-closed local apply
command. The command installs the two public derivatives, appends their exact
manifest records, and inserts the approved frontmatter fields while preserving
all unrelated bytes. A complete exact rerun is a read-only success.

The command is intentionally not a CMS, database, general collection editor,
trust registry, or publishing system. It never stages, commits, pushes,
previews, deploys, or contacts an external service.

## Command Contract

```sh
npm run media:apply -- \
  --plan <approved-plan.json> \
  --reel <reel.mp4> \
  --poster <poster.webp> \
  --confirm <slug>
```

All four options are required exactly once. Unknown options, positional
arguments, duplicate options, or missing values fail before mutation. Standard
output is one JSON receipt. Handled errors use a concise message and must not
emit absolute repository or source paths.

## Approval Boundary

The approved plan file is evidence, not merely input. Its bytes must equal
`JSON.stringify(JSON.parse(bytes), null, 2) + "\n"`. This canonical-byte rule
rejects reformatting, duplicate JSON keys detectable through byte mismatch,
trailing data, and manual edits that were not re-approved.

After canonical parsing, validate all of these invariants:

- `schemaVersion: 1`, `mode: "dry-run"`, `writesFiles: false`, and
  `collection: "archive"`;
- `--confirm` equals the plan slug and the slug uses lowercase kebab-case;
- the two assets are exactly reel then poster, with exact derived IDs, public
  paths, profiles, owners, and source basenames;
- `frontmatterPatch` contains exactly the A0 Archive allowlist, with no missing
  or additional keys;
- the target content file is `content/archive/<slug>.md` and the target public
  assets stay below `public/assets/showreel/`;
- source and target real paths do not alias.

The command then re-probes the supplied media and regenerates the A0 plan from
the approved plan's publication metadata. The canonical approved object and
the recomputed object must be deeply identical. File names, hashes, sizes,
duration, codec/profile facts, rights metadata, alt text, timecode, focal point,
and all derived targets therefore remain inside the approval boundary.

## Preflight State Machine

Preflight reads content, manifest, and both target assets without writing and
classifies the package:

- `fresh`: neither target asset exists, neither manifest entry exists, and no
  allowlisted patch key exists in the content record;
- `already-applied`: both assets exactly match, both manifest entries deeply
  match, and every patch value deeply matches;
- `conflict`: at least one claimed target is present but differs from the plan;
- `partial`: only part of the exact package is present.

Only `fresh` may mutate. `already-applied` returns a success receipt and writes
nothing. `conflict` and `partial` fail closed and write nothing. Existing
unrelated manifest assets, content fields, and body text never count as a
conflict.

## Byte-Preserving Mutation

The manifest edit is a targeted append to the existing top-level `assets`
array. It serializes only the two planned entries and preserves every existing
byte, including the current compact `owner` objects. The candidate is parsed
and passed through `validateMediaManifest` before installation.

The Archive record uses JSON frontmatter between `---` delimiters. Insert one
deterministically serialized allowlisted block immediately before the existing
top-level `"summary"` property. Preserve every prior frontmatter byte and all
body bytes. Parse the candidate and verify the resulting fields before
installation. Missing or ambiguous anchors fail closed.

## Installation And Recovery

Create target-adjacent temporary siblings so rename does not cross filesystems.
Fully write and verify all candidates before installing anything. Install in
this order:

1. reel and poster assets;
2. media manifest;
3. content record.

For every handled exception, restore the original manifest and content bytes,
then delete only temporary files and final assets created by this invocation.
Never delete a pre-existing path. A test-only hook may inject failures between
install steps to prove recovery.

This provides coherent recovery for handled process errors. It does not claim
global atomicity under power loss, kernel failure, or `SIGKILL`; if abrupt
termination leaves a partial state, the next invocation detects it and refuses
to continue.

## Receipt And Privacy

Success receipts contain only `schemaVersion`, `operation`, `state`,
`collection`, `slug`, and public target paths. Error messages may name a plan
field or public target but must not include the repository root, the approved
plan's absolute path, or either source absolute path.

## TDD And Validation

Tests must first fail for the missing apply module and command, then cover:

1. fresh exact application with byte-preserved unrelated content;
2. exact rerun as a zero-write `already-applied` success;
3. noncanonical/tampered plans, unknown patch keys, confirm mismatch, and
   source-target alias rejection before writes;
4. conflicting and partial state refusal with inputs unchanged;
5. injected failures after asset and metadata installation with restoration;
6. redacted receipts/errors and strict CLI parsing.

After focused tests, run the full repository test, design audit, build, Figma
export, diff check, and a real `already-applied` Three-Minute Micro Drama
smoke test when its private approved sources are still available. The tool-only
package must leave the generated public site byte-identical to its baseline.

## Boundaries And Rollback

Do not modify, stage, rename, or delete the protected user-owned untracked file
`docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md`. Do not update
`origin/main`, create a Preview, deploy Production, or alter public portfolio
content in this package. Roll back to
`fb6517591e34b9cb20d814891c0177cf2ac9ba2c` to remove A1-1 while retaining A0
and its completed Three-Minute package.
