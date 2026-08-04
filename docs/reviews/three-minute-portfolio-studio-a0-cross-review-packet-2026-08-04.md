# Read-Only Cross-Review Packet: Portfolio Studio A0 + Three-Minute Reel

Date: 2026-08-04

## Reviewer instruction

Review only. Do not edit files, deploy, contact anyone, or request private source
media. Treat this packet and the attached poster as frozen. Findings need a
current path and line/range named below, or a reproduced contradiction in the
packet. Do not claim legal certainty; assess whether the recorded publication
authority, privacy boundary, integrity controls, and rollback are sufficient
for this portfolio work package.

## Objective and target

- Repository: Hsin-Hsin Yuan Portfolio
- Branch: `codex/portfolio-studio-a0`
- Baseline: `382e02a21fbcf6ffef68881b7e497235eaf8a7a8`
- Reviewed head: `9fb0f2c929ad497100baba11cade6fd618d3ac08`
- Commits:
  - `d82c0ba` canonical media manifest
  - `c0b33d5` dry-run Archive media planner
  - `9fb0f2c` Three-Minute Micro Drama reel/poster integration
- The reviewed head is pushed only to the feature branch. `origin/main`,
  Preview, aliases, and Production are untouched.

The package reduces future Archive reel changes to: validate two approved
public derivatives, generate one deterministic dry-run plan, copy the exact
derivatives, add its manifest entries, and apply one content-record patch.

## Authority and hard boundaries

- The producer explicitly stated in this task that the final selected clips in
  `Downloads/三分超微劇` may be used in the public portfolio.
- Only final silent public derivatives are in Git. Source masters and absolute
  local source paths are absent from the repository manifest and content.
- Recorded rights status for both outputs is
  `user-supplied-local-source`; this is provenance, not a claim of third-party
  legal adjudication.
- The attached WebP is the exact public poster derivative. It shows one actor
  in a scene from the producer-approved work footage; no private metadata,
  filenames, account data, or contact information is overlaid.
- One pre-existing untracked review file is protected and was neither modified
  nor staged.
- Non-goals: hosted CMS, write-mode admin UI, renderer/CSS redesign, source
  moves, `main` integration, Preview, or Production.

## Canonical media contract

`data/media-manifest.json:1-116` contains schema version 1, two named profiles,
unique public assets, content ownership, exact byte size, SHA-256, and video
duration. The new entries are:

- reel, `data/media-manifest.json:99-107`: 8,833,199 bytes,
  SHA-256 `7a98ab3ff0d8c840c35e160f434cf6cb7fe1fe1f1547ba30e68a12b5216afc6f`,
  10 seconds, profile `silent-h264-720p-bt709`;
- poster, `data/media-manifest.json:108-115`: 32,828 bytes,
  SHA-256 `d3cb8e2dc7ab913a43532558e8a21dbb6aa6e9353f742a0d14de8fe8a88fe035`,
  profile `webp-1280x720`.

The video profile requires H.264, 1280×720, yuv420p, BT.709 color space,
transfer, and primaries, one stream, no audio, and faststart. The poster profile
requires WebP, 1280×720, yuv420p, one stream, and no audio.

`scripts/lib/media-manifest.mjs` enforces:

- `:23-35`: normalized `/assets/` paths only, resolved under `public/`;
- `:42-103`: schema, profile, unique ID/path, supported owner, exact-size/hash,
  positive video-duration validation, and explicit rejection of `sourcePath`;
- `:106-160`: SHA/size/ffprobe facts and top-level MP4 atom order;
- `:163-188`: exact byte/hash/profile verification with a 0.2-second duration
  tolerance;
- `:190-215`: bidirectional linkage between every registered local reel field
  and the canonical content owner.

## Dry-run planner contract

`scripts/lib/media-package-plan.mjs:37-120` requires a lowercase slug, reel,
poster, one supported rights status, English and Chinese alt text, strict
timecode, and normalized focal point. It probes and verifies both inputs before
returning JSON with `mode: "dry-run"` and `writesFiles: false`. The output keeps
only source basenames, public target paths, manifest entries, and the content
patch; it never returns absolute source paths.

`scripts/plan-archive-media-package.mjs:8-46` accepts only nine named
option/value pairs and prints the JSON plan to stdout. It imports no filesystem
write API.

`tests/media-package-plan.test.mjs:24-105` checks the deterministic packet,
required publication metadata, absence of the repo absolute path, an empty
working directory after CLI execution, and the package script. The approved
Three-Minute dry-run artifact was kept outside Git; its SHA-256 is
`6ebd73676f2e049d735433a6d382a53e2a9b5ed534abdbabd8eaaee9097caab8`,
and a local scan found no `/Users`, `/private`, or `Downloads` string in it.

## Public content integration

`content/archive/three-minute-micro-drama.md:15-28` records:

- public poster and reel paths;
- bilingual descriptive alt text;
- rights provenance for both outputs;
- 1280×720 poster dimensions, focal point `(0.45, 0.34)`, and source timecode
  `00:10:00.750`;
- explicit `after-hold` reel mode and 10-second duration.

The existing renderer is unchanged. It shows the poster first, then permits a
muted looping reel after a 1.4-second visibility hold, and resets it when no
longer active. The poster and reel are decorative equivalents for this card;
the image retains meaningful bilingual alt text while the video is
`aria-hidden`.

Two content-dependent tests were generalized without weakening fixed order:

- `tests/build-site.test.mjs:790-813` counts every explicit approved Archive
  reel and removes every `cardReelMode` in its static fallback fixture;
- `tests/design-contract-audit.test.mjs:29-35,58-69` keeps the exact Archive
  order and requires poster/index-fallback sets to be a complete, disjoint
  partition instead of hardcoding which record owns a poster.

## Validation evidence

- TDD RED states were observed for the missing manifest module/exports/data,
  planner module/CLI/package script, and the Three-Minute content record before
  its manifest/assets existed.
- `npm test`: 71 passed, 0 failed.
- `npm run audit:design-contract`: PASS; 6 Featured, 5 Archive, 2 global Press,
  3 work Press; no active drift.
- `npm run build`: passed.
- `npm run figma:export`: passed with no tracked Figma change.
- `git diff --check`: passed.
- Full ffmpeg decode of the committed MP4: passed with no error output.
- The manifest suite re-probed exact size/hash/profile/faststart for every
  registered local media asset.
- Before public content integration, the manifest/planner refactor reproduced
  byte-identical `dist` output against the baseline build.
- Native headless Chrome passed 1440×900 and 390×844. At both widths the new
  card began with poster opacity, played the 1280×720 reel after the hold,
  reset to time zero offscreen, stayed within the viewport, and produced no
  horizontal overflow, console/page error, or failed request. Screenshots were
  visually inspected.
- Feature-branch remote readback exactly matched reviewed head
  `9fb0f2c929ad497100baba11cade6fd618d3ac08`.

## Requested review dimensions

1. Public/private boundary: can any absolute source path, source master, or
   private-only evidence leak through the manifest, planner JSON, content, or
   public build?
2. Rights/privacy readiness: given the producer's explicit publication
   authority, is the provenance record sufficient and accurately limited?
3. Integrity: find traversal, duplicate ownership, stale content linkage,
   weak media verification, or dry-run write hazards.
4. Maintenance: does A0 actually remove content-specific repeated work, and
   did either generalized test lose a meaningful regression guarantee?
5. Public behavior: are poster-first, muted playback, accessibility, mobile,
   rollback, and no-deployment boundaries adequately covered?
6. Closeout: may this branch proceed to a producer-approved Preview or merge,
   while keeping Production as a separate explicit decision?

## Required response schema

Return:

1. `VERDICT`: `PASS`, `PASS_WITH_FINDINGS`, or `BLOCK`.
2. `FINDINGS`: ordered by severity. For each, give ID, severity (`blocker`,
   `major`, or `minor`), exact path/line or packet evidence, why it matters
   within this package, and the smallest safe recommendation.
3. `CONFIRMED_STRENGTHS`: only claims supported by this packet/image.
4. `EVIDENCE_GAPS`: what cannot be established, especially legal facts beyond
   producer authority.
5. `PREVIEW_OR_MERGE_RECOMMENDATION`: yes/no with conditions.

Do not convert optional polish or a hosted CMS into a blocker. Do not claim
two-reviewer completion; this response represents only your own review lane.
