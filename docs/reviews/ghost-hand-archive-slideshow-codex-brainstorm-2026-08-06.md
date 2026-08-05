# Ghost Hand Archive Slideshow — Codex Independent Brainstorm

## problem_reframe

The feature is not mainly a slideshow. It is a proof that one Archive media
recipe can replace future images without reopening website code, while the
published result remains exactly as auditable as the existing video-based
reels. The smallest useful guarantee is therefore data-driven authoring plus
one existing public playback contract, not a new UI or generalized media CMS.

## pragmatic_path

Keep the proposed three boundaries, but treat the rollback writer as reused A1
infrastructure rather than a new slideshow concern. Add one pure recipe and
timeline module, one generic HTML generator, and one guarded orchestration
command. Extend the current planner with an explicit poster-source kind so a
still omits timecode while existing video-frame callers keep their current
default. Tradeoff: the CLI remains a substantial vertical slice, but each
library has one testable responsibility and future swaps touch recipe data
only.

## alternative_architecture

Skip HyperFrames and render the six images directly with an ffmpeg filtergraph
generated from the recipe. That removes an authoring project and HTML/GSAP
layer, and may be simpler for fixed dissolves plus zoom. The tradeoff is two
motion systems inside the portfolio: current custom reels use HyperFrames,
while still reels would use a separate filtergraph grammar that is harder to
preview and extend consistently.

## low_cost_experiment

Before the guarded writer, validate one sample recipe and generate a temporary
HTML composition. Render only a short low-cost proxy, then inspect frames at
the first transition and loop return. The architecture is falsified if focal
data cannot produce a poster-identical first frame, if the final dissolve
flashes, or if changing one recipe source requires editing the HTML generator.
Use existing writer fixtures separately to prove handled rollback; do not wait
for the final public render to discover either class of failure.

## contrarian_challenge

The maintainable solution may be a versioned recipe plus a documented one-line
ffmpeg command, with no new generic CLI. A guarded command can become another
system that needs maintenance after a single use. This objection wins if the
second still-reel swap still requires code changes despite the abstractions;
it loses if the command demonstrably accepts a new validated recipe and emits
the same public contract without renderer edits.

## unconstrained_possibility

A future local Portfolio Studio could discover an approved source folder,
display contact sheets, let the producer adjust focal points and sequence, and
write only the reviewed recipe. The same deterministic command would remain
the publication backend. This should wait until at least two distinct
still-reel recipes prove the schema; otherwise the UI would fossilize first-use
assumptions.

## overlooked_risks

- A `still` discriminator can remove false timecode but still leak private
  provenance if errors or receipts print resolved source locations.
- Metadata stripping needs verification after encoding; an encoder flag alone
  is not proof that every WebP chunk is safe.
- A generic renderer test that searches only for the Ghost Hand slug can miss
  hard-coded focal points or frame counts; recipe-driven substitution should
  also be tested with a different valid fixture.
- Four-file handled rollback does not cover abrupt process termination. The
  next run must detect partial state instead of silently completing it.
- The first poster and first video frame can differ through separate crop math
  even when they share a focal point. Both must use the same normalized WebP.
- HyperFrames version drift can change generated scaffolding. Resolve once,
  record the observed pin, and retain it in the authoring project.

## assumptions_to_verify

- The current A1 writer can be reused without relaxing its conflict and
  redaction behavior.
- Existing manifest profiles fully express the required video and poster
  checks, including faststart and zero audio.
- HyperFrames can render a seven-layer composition with deterministic seeking
  at the six required evidence times.
- The six source hashes and dimensions still match the approved evidence.
- Existing Archive playback and Figma export need only canonical data changes.

## recommended_next_decision

Retain the approved architecture. Prove it in three checkpoints: pure recipe
and planner compatibility, generic render with poster/loop evidence, then
rollback-capable public integration. Do not add a CMS, a second website
component, concurrency locking, or crash-recovery journal. If the temporary
render shows that HyperFrames adds friction without observable value, the only
bounded fallback worth producer review is a recipe-generated ffmpeg
filtergraph; it should not be introduced preemptively.

Provider provenance: Codex primary interactive lane; requested policy is the
highest-capability available Codex model for the current session. The exact
observed/completed model ID is not exposed by this runtime and is not inferred.
