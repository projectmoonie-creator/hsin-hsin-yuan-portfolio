# Collaboration Logo Wall Component — Brainstorm Synthesis

Date: 2026-08-06
Frozen packet SHA-256:
`fcc9ab9d1224263f1c180f7c557dd2b4035115f223148908d02092e950217fe9`

## Consensus

- This is a shared content/asset/layout contract, not a batch of `<img>` edits.
- `data/collaborations.json` must remain the one authored list.
- A normalizer should separate public rendering fields from provenance evidence
  and feed both website and Figma export.
- Official source originals should remain identifiable; the public monochrome
  presentation must preserve the official mark's geometry.
- Unverified or missing marks must remain accessible text, not unofficial
  substitutes.
- Optical balance requires explicit visual verification; intrinsic width alone
  is insufficient.
- Website and Figma must render the complete canonical list in the same order,
  including mobile.

## Complementary Ideas

- Codex proposed named optical tokens and a small guarded preparation command
  that validates and derives assets without network access during normal builds.
- Gemini proposed recording aspect ratio and using a bounded mathematical
  starting estimate for optical scale.
- Both lanes proposed testing the widest mark, a compact mark, and a text
  fallback before scaling the system to the full list.

## Provider-Unique Ideas

- Codex identified static-HTML fallback semantics, duplicate accessible-name
  risk, source/evidence leakage, and fixed Figma frame clipping as specific
  failure modes.
- Gemini proposed a generated SVG sprite/path manifest and geometric visible
  bounds as a higher-automation alternative.
- Gemini's contrarian option preserves a typographic wall instead of introducing
  heterogeneous corporate identities.
- Codex's unconstrained option is a local preview/editor for collaboration
  records; it becomes worthwhile only if other portfolio media families adopt
  the same lifecycle.

## Contradictions and Local Adjudication

- Gemini recommends formula-derived optical scale, while Codex treats optical
  balance as an authored visual token. Aspect ratio cannot detect transparent
  padding, stroke density, or internal negative space. Use formula/measurement
  only as a diagnostic starting point; keep the approved optical token authored.
- Gemini describes Figma AutoLayout nodes, but the current-reference exporter
  writes importable SVG with absolute coordinates, not Figma API nodes. This
  package should share contract and layout tokens while keeping the approved
  SVG export boundary. Replacing it with an API-driven Figma tool is out of
  scope.
- Gemini's native vector/sprite proposal improves editability but requires a
  full SVG parser and does not handle the verified PTS raster source cheaply.
  It is disproportionate for seven records.
- The existing source note says CSS should create the monochrome treatment,
  while the producer's latest request says to download and convert marks to
  monochrome. Interpret this as preserving the official original plus a
  deterministic public monochrome derivative. This satisfies both intents and
  keeps rollback possible.

## Experiments

Before full asset ingestion, test three representative slots in a throwaway
fixture or test output:

1. a wide verified mark;
2. a compact verified mark;
3. an unverified text fallback.

Render desktop at 1440px and mobile at 390px. The selected architecture passes
only if all seven canonical positions can be represented without truncation,
the fallback remains intentional, no collaborator-specific CSS selector is
needed, and the same IDs/order appear in website and Figma output.

## Risks

- Current official marks may not match the mark used during the collaboration.
- Naive monochrome conversion can close counters or erase white knockout shapes.
- Transparent raster padding and SVG viewBox padding can defeat size formulas.
- External references, scripts, fonts, or embedded rasters may hide inside SVGs.
- Public HTML must not expose source URLs, hashes, rights notes, or checked dates.
- `ScreenHouse` remains identity-ambiguous; `Dragon TV` lacks a verified official
  asset source.
- Adding/removing records must not reintroduce manual Figma positions or mobile
  truncation.

## Options

### A — Normalized contract + optical tokens + guarded local preparation

Recommended.

- Authored owner: `data/collaborations.json`.
- Normalized `CollaborationMark` contract splits public fields from evidence.
- Official originals are preserved outside the public tree; a guarded local
  command validates/sanitizes and creates public monochrome derivatives.
- Each verified mark chooses a small named optical token; no per-brand CSS.
- One website component and one Figma SVG component consume the same records and
  shared slot tokens. Desktop uses four stable slots per row; mobile uses two,
  with the incomplete final row centered automatically.
- All presently verifiable marks are batched. Dragon TV and ScreenHouse stay as
  explicit text fallbacks until source identity is proven.

Tradeoff: retains a small, honest amount of visual judgment per new logo.

### B — Generated vector sprite/manifest + automatic optical measurement

- A compiler parses sources, emits a sprite/path manifest, computes bounds, and
  drives both outputs.
- Best vector editability and maximum automation.

Tradeoff: substantial SVG/raster tooling, fragile compound-mark conversion, and
excess complexity for seven records.

### C — Typography-first component, no public partner logos

- Fix the canonical component, responsive placement, Figma truncation, and
  add/remove workflow while keeping collaborator names as the visual language.

Tradeoff: lowest brand/provenance maintenance and the quietest visual result,
but it does not fulfill the producer's stated wish to show official marks.

## Recommendation

Choose **A**. It resolves the actual maintenance problem, fulfills the visual
request, preserves official originals, avoids speculative identities, and does
not build a miniature CMS or SVG engine. The implementation should be one TDD
package with a red contract/parity test first, followed by the representative
three-slot experiment, the shared renderer spine, the verified asset batch,
English/Chinese desktop/mobile visual review, and a repo-configured replacement
runbook.

## Provider Status

- Codex: completed independently; model `gpt-5.6-sol`.
- Gemini: completed independently through the controlled REST lane; requested,
  observed, and completed model `gemini-3.6-flash`.
- Claude: incomplete, `handoff-to-active-session`; no model request was sent and
  no billing fallback was used.

The producer's A/B/C decision closes brainstorming. No implementation is
authorized by model consensus alone.

## Producer Decision

On 2026-08-06, the producer selected **A — Normalized contract + optical
tokens + guarded local preparation** and authorized implementation as a
separate TDD package.
