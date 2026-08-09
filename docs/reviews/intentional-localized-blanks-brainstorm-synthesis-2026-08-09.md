# Intentional Localized Blanks — Brainstorm Synthesis

Date: 2026-08-09
Status: producer-approved for inline execution

Frozen packet SHA-256:
`f119e4369fac7a30492ed2e752dfa15267191faeb611acd7e1446eb60ec9aff3`

## Consensus

- Treat this as a content-state contract, not a presentation variant.
- Preserve every stable key, locale key, localized object, and availability
  array position in source data.
- Represent intentional absence as the exact empty string `""` at the existing
  locale position.
- Keep missing keys, nulls, non-string values, and whitespace-only values
  invalid.
- Omit the complete empty localized element from built HTML; do not rely on
  CSS hiding, an empty wrapper, or a spacer.
- Keep English and Chinese decisions independent.

## Complementary Ideas

Codex added an explicit guarded-work-order `blank` operation so audit evidence
distinguishes producer intent from an accidental empty replacement. The same
contract must also permit a later `replace` operation whose expected value is
empty, making refill a guarded, ordinary edit.

Gemini emphasized checking that no parent wrapper or structural selector
retains spacing after the child is omitted. Both detail cards and the screening
strip require assertions, plus desktop/mobile visual inspection.

## Contradictions And Adjudication

### Empty string vs null

`null` would make blank intent explicit in runtime data but breaks the current
all-string localized contract and adds union handling to every consumer. The
producer explicitly described the field as present and empty. Select empty
string plus explicit work-order intent.

### Conditional DOM vs CSS-hidden empty nodes

CSS hiding preserves symmetric child counts but violates the producer's
no-hole requirement unless every wrapper and gap is also neutralized. Current
affected layouts use ordinary block/flex flow; omit the element and verify no
relevant child-index dependency.

### Renderer-only filtering vs classified validation

Renderer-only filtering is smaller but would silently accept accidental empty
titles, roles, and descriptions. Permit blanks only for Featured `tagline` and
availability items while retaining structural validation.

## Low-Cost Experiment

Add a focused failing fixture/test before implementation. It must prove that a
blank Chinese tagline and sixth availability slot preserve source structure,
pass classified validation, emit no Chinese DOM node, and leave populated
English output unchanged. The current implementation should fail at the
validator and renderer seams.

## Decision

Use exact empty strings in stable source positions, a named `blank` work-order
operation, refill from `expected: ""`, classified validator permission, and
complete element omission. No new visual tokens, components, or spacing rules.
The producer selected these semantics in the current conversation, so no
additional choice is required before implementation.

## Provider Status

| Lane | Requested | Observed | Completed | Status |
| --- | --- | --- | --- | --- |
| Codex | current primary session | exact ID not exposed | exact ID not exposed | completed independent first round; no ID inferred |
| Gemini | `gemini-3.6-flash` selected by controlled GA router | `gemini-3.6-flash` | `gemini-3.6-flash` | completed; 1,007 input / 1,938 output / 4,857 total tokens |
| Claude | highest-capability generally released model at active-session submission | not observed | not completed | `handoff-to-active-session`; no model request sent and no billing fallback |

No three-lane consensus is claimed. The producer's decision, not model
agreement, closes the mechanism gate.
