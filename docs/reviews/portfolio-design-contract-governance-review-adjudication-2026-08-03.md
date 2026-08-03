# Portfolio Design Contract Governance — Cross-Review Adjudication

Date: 2026-08-03  
Reviewed portfolio head: `03a5aee2622811c1085b618aa332225b2b3dbd44`  
Reviewed shared-skill commit: `9985f06`

## Review lane ledger

| Lane | Requested | Observed | Completed | Result |
| --- | --- | --- | --- | --- |
| Gemini | highest eligible generally released model | `gemini-3.6-flash` | `gemini-3.6-flash` | usable `PASS_WITH_FINDINGS`; 2 minor findings; 2,493 input / 1,246 output / 6,537 total tokens |
| Codex maintainer | current root runtime | exact model ID not exposed | exact model ID not exposed | local source/test adjudication completed; no model ID fabricated |
| Claude | not sent | not applicable | incomplete / not requested | no subscription request, API/PAYG fallback, or two-reviewer-completion claim |

Gemini artifact:
`docs/reviews/portfolio-design-contract-governance-gemini-review-2026-08-03.md`.

Frozen packet:
`docs/reviews/portfolio-design-contract-governance-cross-review-packet-2026-08-03.md`.

## Adjudication

### FINDING-01 — `agree`

Gemini correctly identified that `contract.public` is strict while the current
renderer still consumes a flattened compatibility projection. This is safe for
the visual-freeze package because it reproduced exact public hashes, but it is
transitional rather than the final renderer API.

Resolution:

- `scripts/lib/portfolio-contract.mjs` now labels the projection as a
  transitional compatibility adapter.
- Its removal condition is explicit: route the renderer through
  `contract.public`, then reproduce the frozen public-output hashes.
- The source files remain clean; legacy inference fields are not canonical
  again merely because aliases exist inside the adapter.

The future renderer cleanup is non-blocking and must be a separate bounded
package. Removing the aliases in this governance package would add risk without
changing public value.

### FINDING-02 — `agree` with corrected mechanism

The underlying risk is valid: the hardcoded editable Figma plugin could be
mistaken for the current design reference. The review's description of it as a
bidirectional importer that writes back to frontmatter is not accurate; the
plugin only creates hardcoded Figma layers.

Resolution:

- `figma/hsin-portfolio-importer/README.md` now carries
  `LEGACY_REFERENCE_DO_NOT_USE`, states that it is not bidirectional, and routes
  current handoff to `npm run figma:export`.
- `docs/design-contract.md` and `docs/figma-design-layer.md` define the plugin as
  a retained legacy experiment, not an active consumer.
- `scripts/audit-design-contract.mjs` reports drift if that legacy boundary is
  no longer marked.
- `tests/figma-plugin.test.mjs` protects the marker and current-export route.

Rewriting the old plugin is not required for this package because it is no
longer an active current-reference consumer. Reactivation requires normalized
contract generation/translation and a new parity review.

## Maintainer conclusion

Both usable findings were valid, minor, and resolved without changing website
output. Gemini recommended merge after logging them. No blocker or major
finding remains. Final integration still requires the complete deterministic,
browser, skill, and local-main safety gates.
