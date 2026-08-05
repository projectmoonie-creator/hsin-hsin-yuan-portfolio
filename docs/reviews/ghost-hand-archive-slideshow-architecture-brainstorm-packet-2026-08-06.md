# Frozen Brainstorm Packet: Ghost Hand Archive Slideshow Architecture

Date: 2026-08-06

## Instruction

Brainstorm only. Do not edit files, render media, deploy, contact anyone, or
assume access to private source files. Treat this packet as frozen. Return
materially different paths and falsifiable experiments, not generic agreement
or a disguised implementation plan.

## Decision And Owner

The producer approved a repo-configured still-slideshow package for
`ghost-hand-divine-car`, using six user-supplied stills, with `4arUG0s6.jpg` as
the poster. The producer also approved the current design and chose inline TDD
execution. The remaining architecture gate is whether the proposed reusable
boundaries are the smallest safe continuation of the existing Archive media
pipeline. The producer owns any material change to schema, rights, public
behavior, or scope; Codex is the implementing lane.

## Why This Decision Is Needed Now

The current site already has a generic Archive reel player and a repo-local
manifest/planner steel thread. The new feature adds still-based authoring,
rendering, and safe application. The boundary must make future swaps easier
without turning one 10-second reel into a CMS or a bespoke Ghost Hand renderer.

## Current Evidence And Assumptions

- Branch: `codex/overclocking-static-poster`.
- Frozen implementation-plan parent: `4c4a0d6cad4ec655515d111ff10cb2df1eb4b823`.
- Privacy-safe plan correction: `ccbad15`.
- Baseline suite after that correction: 79 tests passed, zero failures.
- Existing `createArchiveMediaPackagePlan` validates exact reel/poster media,
  creates manifest entries, and returns canonical Archive frontmatter fields.
- Existing Archive rendering already consumes `posterImage`, `cardReelUrl`,
  `cardReelPoster`, `cardReelMode`, and related fields. No public website
  component change is intended.
- Prior A1 architecture established a rollback-capable four-target writer as
  the accepted repo-local apply boundary. OS-level crash-proof atomicity was
  explicitly not claimed.
- Approved output: six stills, 300 frames, 30 fps, 1280×720, 10 seconds,
  silent H.264 yuv420p BT.709 faststart, eight-frame dissolves, and a bounded
  1.000→1.035 push-in that returns to the poster crop at the loop boundary.

## Proposed Architecture

1. A pure `ArchiveStillSlideshow` recipe/timeline validator owns safe relative
   paths, source basenames/hashes/dimensions, rights, focal points, output
   profile, public paths, timing, and loop return.
2. One generic HyperFrames HTML generator consumes a validated recipe and has
   no slug, source basename, or per-image coordinate special cases.
3. One guarded CLI defaults to a redacted dry-run, optionally imports
   metadata-free normalized WebPs, renders and verifies staged public media,
   then delegates the four public replacements to the existing A1-style
   rollback writer.
4. The media planner gains a backward-compatible `video-frame | still`
   poster-source discriminator so a still poster omits false timecode evidence.

## Constraints, Non-Goals, And Reversible Boundaries

- Node.js ESM and built-ins for repo orchestration; HyperFrames `general-video`
  for the composition; existing ffmpeg/ffprobe and media manifest profiles.
- TDD for every behavior change. Default command mode writes nothing.
- Raw JPEGs and private source locations stay outside Git and outside output.
  Tracked authoring images must be normalized and metadata-free.
- Stable public paths remain under the declared Archive slug.
- Preserve the Markdown body and unrelated frontmatter/manifest entries.
- Handled failures must restore the four public targets; abrupt power loss is
  detectable but not promised globally atomic.
- No hosted CMS, database, upload service, authentication, deployment,
  website playback redesign, titles, sound, color grade, or AI retouch.
- The protected untracked review document stays byte-identical and outside
  Git. No push, merge, Preview, Contact submission, alias, or Production action.

## Affected Systems And Downstream Decisions

- Planner and CLI contracts under `scripts/`.
- Generic recipe, timeline, HTML, WebP privacy, and package-writer libraries.
- Focused Node tests and existing media/site contract tests.
- One authoring project under `showreel/ghost-hand-divine-car-card-reel/`.
- Canonical Archive frontmatter, media manifest, public MP4/WebP, Figma export,
  and bilingual browser QA.

## Ideation Questions

1. Is `recipe → generic HyperFrames composition → staged writer` the smallest
   reusable boundary, or does one layer add more maintenance than it removes?
2. Does `video-frame | still` preserve planner compatibility without creating
   misleading provenance or duplicated schema?
3. Is the existing rollback-capable staged replacement sufficient for the
   four-target public package, given that crash-proof multi-file atomicity is
   explicitly out of scope?
4. What is the cheapest experiment that could falsify this architecture before
   the public render?
5. Which defenses are required by the rights/privacy boundary, and which are
   premature for this already-proven Archive steel thread?

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
