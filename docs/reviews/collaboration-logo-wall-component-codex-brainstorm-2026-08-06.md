# Codex Independent Brainstorm — Collaboration Logo Wall Component

Date: 2026-08-06
Input: frozen packet only; no provider output was consulted

## problem_reframe

This is an asset-governance and layout-contract problem, not a logo-download
task. The wall currently has three kinds of drift: identity/source confidence,
different logo proportions, and two renderers that do not share presentation
semantics. A successful package makes adding one verified record boring while
making an unverified record visibly safe.

## pragmatic_path

Add a normalized `CollaborationMark` contract to the existing portfolio
normalizer. Keep `data/collaborations.json` as the only authored list. Each
record gets a stable `id`, localized name/label, optional official destination,
and an optional `mark` block with local public asset, source provenance,
intrinsic dimensions, source status, and a small named optical-size token such
as `compact`, `standard`, or `wide`.

Both website and Figma export consume the normalized records. The website uses
one `CollaborationMark` renderer inside a responsive CSS grid; Figma uses one
SVG group renderer and the same deterministic grid algorithm. Neither consumer
contains collaborator names or manual positions. Full-color/source originals
are preserved separately; deterministic monochrome public derivatives preserve
geometry and are referenced by the contract. Invalid or absent marks render the
localized text fallback. Contract, output, parity, accessibility, asset hash,
and responsive geometry tests cover the boundary. Rollback removes the `mark`
blocks and restores the current text output.

Tradeoff: a small amount of per-mark optical metadata is honest and
maintainable, but it still requires visual judgment when a new mark is added.

## alternative_architecture

Create an opt-in `collabs:prepare` asset compiler. An authored collaboration
record contains the official source URL, checked date, expected hash, and crop
policy. The command fetches or reads the verified source, sanitizes it, creates
a monochrome derivative, measures visible bounds, and writes a generated asset
manifest consumed by both renderers. The production build never fetches the
network.

This reduces manual metadata and can flag upstream changes, but raster visible
bounds and compound SVGs make automatic optical sizing unreliable. The tool
also enlarges the maintenance surface for seven marks and risks turning a rare
editorial action into a bespoke ingestion system. Rollback keeps the generated
assets but bypasses the compiler in favor of authored dimensions.

## low_cost_experiment

Prototype three slots without changing production: the widest verified mark,
the tallest/most compact verified mark, and the ScreenHouse text fallback.
Render them with one `standard` optical height at 1440 and 390 widths, then with
three named optical tokens. The experiment succeeds if the token version needs
no collaborator-specific CSS, all seven slots fit without truncation at both
widths, and two reviewers independently judge no mark to appear more than one
visual step louder than its neighbors. It fails if tokens merely hide arbitrary
per-logo tuning or if mobile needs a different item order.

## contrarian_challenge

Do not destructively recolor every source. CSS filters already create a
monochrome website treatment and preserve official artwork. If Figma can embed
the same original assets with a neutralizing filter or mask, generated
derivatives may be unnecessary. The challenge is parity: imported SVG/PNG
filter behavior is less deterministic than a prepared local derivative. The
producer's request is best interpreted as monochrome presentation, not loss of
the official original.

## unconstrained_possibility

Add a small local, offline collaboration catalog editor that previews desktop
and mobile slots, validates official-source evidence, generates derivatives,
and writes one canonical JSON patch. It could become a reusable portfolio-media
admin surface. This would be useful only after several more data families adopt
the same source/derivative/optical-token lifecycle; building it for seven marks
now would be disproportionate.

## overlooked_risks

- A logo can be official but represent the wrong year or organizational entity.
- Logos with internal white knockouts may disappear when naively flattened.
- PNG transparency, excess canvas, and hidden SVG bounds can defeat intrinsic
  dimension-based optical sizing.
- Visible fallback text plus hidden accessible names can create duplicate screen
  reader announcements.
- An error-only text fallback implemented with client-side JavaScript would fail
  in no-JavaScript output; fallback must remain in the static HTML contract.
- Fixed Figma frame height can clip a complete seven-item mobile wall even after
  the current `.slice(0, 4)` is removed.
- A live source URL in canonical public data can leak evidence fields into HTML
  or make builds depend on third parties.
- Marks can look like current clients unless surrounding semantics remain past
  collaboration rather than endorsement.

## assumptions_to_verify

- Confirm whether the producer means ScreenHouse as a Taiwan production entity
  and obtain its official domain or supplied mark.
- Confirm whether Dragon TV should use the channel mark from the collaboration
  period or the broadcaster's current mark.
- Inspect WMW's official page markup and downloadable publications for a clean
  standalone current or period-appropriate mark.
- Verify that the existing TaiwanPlus asset is byte-identical to the current
  official source and contains no unexpected external references or scripts.
- Verify whether source originals may be committed in an evidence-only folder
  or should remain outside the public tree with hashes and source URLs recorded.
- Decide whether optical classes are sufficient after rendering the widest,
  tallest, and raster-source marks.

## recommended_next_decision

Choose the pragmatic normalized-contract path, with one addition borrowed from
the compiler alternative: implement a guarded local preparation command only
for validation, sanitization, monochrome derivative generation, and measurement;
do not fetch during normal builds and do not infer final optical scale. Batch
all currently verified official marks in one package, keep Dragon TV and
ScreenHouse as explicit text fallbacks until confirmed, and require the same
seven-record order in website and Figma desktop/mobile output.
