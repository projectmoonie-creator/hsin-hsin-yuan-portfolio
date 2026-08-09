# Codex Brainstorm: Intentional Localized Blanks

## problem_reframe

This is a content-state contract, not a layout variant. A required field may
exist structurally while one locale intentionally supplies no renderable text.
The system must preserve that distinction across data, guarded edits,
validation, rendering, testing, and future refill.

## pragmatic_path

Keep the source representation as an exact empty string at the existing
localized key or array position. Add an explicit `blank` operation to the
guarded work order so the editorial intent is auditable rather than confused
with accidental truncation. Validation continues to require every field,
locale key, and string type, but allows empty strings only for classified
optional-output values: Featured `tagline` and individual availability items.
The renderer emits the corresponding element only when the selected locale's
trimmed value is non-empty. No CSS change is necessary, so the next sibling
occupies the normal flow position.

Tradeoff: this is a small schema/validator extension, but it makes the
intentional state replayable and keeps the public data simple.

## alternative_architecture

Use a localized object such as `{ text: "", render: false }` or a companion
visibility map. It states intent explicitly at runtime and could support
scheduled or role-based visibility later. It also multiplies schema and
renderer complexity, turns ordinary strings into unions, and encourages
layout control to leak into editorial data. That cost is not justified by six
producer-approved blanks.

## low_cost_experiment

Before implementation, add one focused failing test fixture containing a
blank Chinese tagline and blank sixth availability item while English remains
populated. Require: validation succeeds; source keys/array length remain;
Chinese output contains no empty tagline or pill element; English output still
contains both values. The current validator/renderer should fail this test,
proving the test observes the intended seam.

## contrarian_challenge

Do nothing to the validator and filter all falsy strings only at render time.
That is fastest, but it silently accepts accidental blanks in fields such as
titles and descriptions and leaves the guarded work order unable to distinguish
an approved blank from a malformed replacement. It is unsuitable as the
durable contract.

## unconstrained_possibility

A future typed content registry could classify every localized field as
`required-output`, `optional-output`, or `structural-only`, generate validators
and render helpers, and expose the same semantics to spreadsheet import and a
content editor. That may be worthwhile after more optional fields emerge, but
would be disproportionate now.

## overlooked_risks

- Generic filters may reindex arrays if applied to source data rather than to
  render output.
- Trimming only during rendering can make whitespace-only values pass source
  validation; validation should reject whitespace-only accidental content.
- Screening-strip clones and detail views use different renderer paths; both
  need assertions.
- A future serializer may omit empty-string keys; regression tests must read
  source structure as well as built HTML.
- CSS selectors using `:nth-child` could change behavior when an element is
  omitted; current affected containers need visual verification.

## assumptions_to_verify

- Work-detail and screening-strip spacing is carried by the tagline element,
  not by a fixed parent gap.
- Availability has no selector requiring six rendered children.
- Figma export consumes English only, so Chinese empty values do not alter its
  output while validation still accepts them.
- No unrelated code treats `tagline.zh === ""` as an error.

## recommended_next_decision

Adopt the pragmatic path: explicit `blank` work-order operation, empty string
at the stable source location, narrow optional-output validation, and
conditional element omission. Prove it test-first, then inspect Chinese and
English at desktop and mobile widths. The producer's existing decision already
selects this path unless an independent lane identifies a material conflict.
