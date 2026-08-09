# Frozen Brainstorm Packet: Intentional Localized Blanks

Date: 2026-08-09

## Instruction

Brainstorm only. Do not edit files, deploy, push, contact anyone, or assume
access to private artifacts. Treat this packet as frozen. Return materially
different paths and falsifiable experiments, not generic agreement or a
disguised implementation plan.

## Decision and owner

The producer has decided that an intentionally blank localized field must keep
its stable field/key and formatting contract, but must not render an empty DOM
element or visual gap. The next section moves up. English and Chinese values
may independently be blank or populated. The remaining architecture decision
is the smallest durable representation and renderer/validator contract that
preserves this choice for future refill and replacement. The producer owns the
decision; Codex is the implementing lane.

## Why now

The approved Chinese-copy workbook contains six deliberately blank Chinese
values that a later generated workbook refilled. Applying those refills would
override producer intent; deleting the fields would destroy the reusable
format. The repo must encode the difference between a missing field and an
intentional empty localized value before these six changes are applied.

## Current evidence and assumptions

- Branch: `codex/three-minute-watch-link`; baseline HEAD:
  `d9f93b9b1751156ddb8a66c4f9ccf0950cc1dcb7`.
- `data/site.json` has six availability slots per locale.
- Five Featured work records have required localized `tagline` objects.
- `scripts/build-site.mjs` always emits availability spans, work-detail
  tagline paragraphs, and screening-strip tagline spans.
- `scripts/lib/portfolio-contract.mjs` currently requires non-empty localized
  strings for title, role, tagline, and description.
- English remains populated. Only the six Chinese values become `""`.
- CSS/component classes, order, stable keys, and source fields must remain.

## Exact producer-approved data changes

1. `site.availability[5]` in Chinese becomes `""`; the source array remains
   length six.
2. Chinese `tagline` becomes `""` for `slow-steps`, `tech-dreamers`,
   `my-art-my-voice`, `interior-spatial-brand-films`, and `pts-taigi-bus`.
3. English values do not change.

## Constraints and non-goals

- A blank value is not a missing key, deleted array slot, hidden variant, null,
  whitespace placeholder, or CSS-hidden empty box.
- The renderer must omit only the empty localized element so adjacent content
  collapses naturally; it must not emit empty pills, paragraphs, or spans.
- Missing locale keys and non-string values must still fail validation.
- Do not reindex source arrays or remove localized objects.
- Do not introduce a CMS, database, generic layout engine, broad content
  migration, or changes to the remaining unapproved Chinese differences.
- No main merge/push, hosted Preview, or deployment.
- Protected untracked documents remain byte-identical and outside Git.

## Affected users, systems, and files

Public Chinese desktop/mobile pages, English regression behavior, site JSON,
five work records, the site renderer, the content validator, focused tests,
and the guarded copy-work-order evidence. Figma export must continue to build;
its present English output must remain unchanged.

## Ideation dimensions

1. Compare empty string, explicit operation/metadata, and optional-null
   representations for durability and ambiguity.
2. Define which validation remains structural and which localized values may
   be intentionally empty.
3. Define renderer behavior that guarantees no empty DOM node or spacing.
4. Identify the smallest tests proving field preservation, bilingual
   independence, and desktop/mobile layout collapse.
5. Identify one low-cost falsification experiment before implementation.
6. State future risks if another importer or renderer treats empty as absent.

## Required response schema

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
