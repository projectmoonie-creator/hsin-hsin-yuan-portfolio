# Ghost Hand Archive Slideshow — Architecture Brainstorm Synthesis

Date: 2026-08-06
Status: awaiting producer decision before implementation

Frozen packet SHA-256:
`e7d366583f37c7600c5be7e536110c40d3495e175533f47aad3137ecde38e049`

## Consensus

- Keep this repo-local and recipe-driven; do not build a hosted CMS.
- Reuse the existing Archive website playback contract rather than introduce a
  Ghost Hand-specific public component.
- Raw stills and private locations stay outside Git and public output.
- Metadata stripping must be verified after normalization, not inferred from
  one encoder flag.
- Render and verify in staging before the four public targets are replaced.
- Do not claim crash-proof multi-file atomicity. Handled rollback and explicit
  partial-state detection are the bounded guarantee.
- The first rendered frame and poster must share one normalized crop, and the
  loop boundary needs a concrete visual/render experiment.

## Complementary Ideas

Codex separated the pure recipe/timeline unit from the HTML generator so each
can be tested without filesystem or browser work. Gemini emphasized a cheap
subpixel-jitter/loop experiment before the final public render. These are
compatible: keep the testable boundaries and add the experiment at the first
authoring render checkpoint.

Both lanes identified a direct ffmpeg filtergraph as the only credible bounded
fallback if HyperFrames cannot produce stable motion. Neither recommended a
second website renderer, database, upload service, or generalized UI now.

## Provider-Unique Ideas

- Codex: test genericity with a second valid fixture so a source scan alone
  cannot hide hard-coded focal values or timing.
- Gemini: compare a short synthetic-grid HyperFrames render against an ffmpeg
  filtergraph to expose subpixel shimmer. Its proposed 1.5% RMS threshold is
  not adopted as a gate because the packet provides no approved perceptual
  basis for that number; visual evidence and exact frame/crop assertions are
  the defensible first oracle.
- Gemini: merge validation and HTML output into one compiler to reduce file
  count. This is a source-layout preference, not a workflow-step reduction for
  the maintainer, who still edits one recipe and runs one command.

## Contradictions And Local Adjudication

### Separate recipe validator vs one compiler

Gemini prefers one compiler; Codex prefers a pure validator/timeline module
plus a generic HTML module. The approved design requires deterministic timeline
tests independent of rendering and a renderer-isolation assertion. Combining
the units couples schema errors to HTML output without reducing the producer's
maintenance steps. Local adjudication therefore favors the approved separate
units.

### `video-frame | still` discriminator vs no discriminator

Gemini argues origin should not enter the public schema. The proposal already
agrees: `posterSourceKind` is planner evidence and is not written to Archive
frontmatter. It prevents a still photo from carrying a false video timecode
while preserving existing video-frame callers. Removing it would force either
an ambiguous missing timecode or source inference from a file extension. Local
adjudication therefore favors the approved explicit discriminator.

### HyperFrames vs direct ffmpeg

Direct ffmpeg is smaller at runtime but introduces a second motion grammar and
known `zoompan` jitter risk. HyperFrames is already the portfolio's approved
custom-video workflow and gives seekable transition evidence. Keep HyperFrames
unless the low-cost render falsifies stable output; do not implement both.

## Experiments

1. Validate two distinct six-frame recipes and assert the shared renderer
   source contains no slug, basename, focal, or sequence special case.
2. At the first authoring checkpoint, render the approved composition and
   inspect transition/loop frames before any public writer runs.
3. Assert frame 0 and the public poster are the same normalized WebP pixels.
4. If visible shimmer or loop instability appears, timebox one temporary
   ffmpeg filtergraph comparison; discard it unless it materially improves the
   approved visual evidence.
5. Use failure injection in a temporary repository to prove handled rollback
   and partial-state refusal independently of the media render.

## Risks

- Error and receipt redaction can regress even when recipes contain no private
  paths.
- Metadata or unclassified WebP chunks can survive a nominal conversion.
- Abrupt termination between replacements can leave detectable partial state;
  the next run must refuse rather than complete opportunistically.
- Separate poster and first-frame crop math can create a visible activation
  jump even with identical focal data.
- HyperFrames scaffold/version drift can make future rebuilds non-deterministic
  unless the observed version is retained.
- A genericity test based only on prohibited words can miss hard-coded numeric
  values; a second valid recipe fixture is required.

## Options

### A — Retain the approved three-boundary architecture (recommended)

Keep the pure recipe/timeline unit, generic HyperFrames HTML generator, guarded
CLI/staged writer, and planner-only poster-source discriminator. Add the cheap
loop/jitter experiment and second-recipe genericity test. This preserves the
approved public contract and gives the cleanest TDD seams; it creates several
small internal files but no extra maintainer steps.

### B — Compress validator and HTML into one compiler

Keep HyperFrames, staging, and the discriminator, but combine recipe validation
and HTML output. This reduces file count, at the cost of coupled tests and a
larger unit that future non-HTML consumers cannot reuse.

### C — Replace HyperFrames with a recipe-generated ffmpeg filtergraph

Keep the recipe, discriminator, and writer, but compile motion directly to
ffmpeg. This removes browser authoring dependencies but adds filtergraph
complexity, makes interactive preview harder, and risks subtle `zoompan`
jitter. Choose only if a bounded comparison proves HyperFrames unsuitable.

## Recommendation

Choose A. It best matches the already approved repo-configured-backend goal,
does not change public schema or playback behavior, and absorbs the useful
Gemini experiment without redesigning the mechanism. Options B or C are
material architecture changes and require an explicit producer choice.

## Provider Status

| Lane | Requested | Observed | Completed | Status |
| --- | --- | --- | --- | --- |
| Codex | highest-capability available in current primary session | exact model ID not exposed | exact model ID not exposed | completed independent first round; no ID inferred |
| Gemini | `gemini-3.6-flash` selected by controlled GA router | `gemini-3.6-flash` | `gemini-3.6-flash` | completed; 1,351 input / 1,704 output / 4,565 total tokens |
| Claude | highest-capability generally released model at active-session submission | not observed | not completed | `handoff-to-active-session`; no model request sent and no billing fallback |

No dual- or three-lane consensus is claimed. The producer's choice closes this
brainstorm gate.
