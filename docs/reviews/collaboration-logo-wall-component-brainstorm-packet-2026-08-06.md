# Collaboration Logo Wall Component — Frozen Brainstorm Packet

Date: 2026-08-06
Decision owner: Hsin-Hsin Yuan
Mode: read-only architecture brainstorming; do not edit the project

## Decision

Choose the smallest maintainable architecture that can:

1. replace verified text labels in `Platforms & Collaborations` with official
   collaborator marks;
2. present the marks as a quiet monochrome wall with intentional optical
   sizing and responsive placement;
3. let a future collaborator be added or removed through one canonical record
   and its local asset, without editing website and Figma layouts separately;
4. keep unresolved identities as honest accessible text fallbacks.

The producer has explicitly requested that this unfinished work be completed
as a reusable, repo-configured component rather than another group of manual
one-off changes.

## Why This Decision Is Needed Now

The public website has a partial logo renderer, but the current data contains
no logo records. The current Figma export independently draws text labels and
its mobile frame silently truncates the list. Adding files alone would preserve
this drift and would not solve the producer's maintenance concern.

## Current Evidence

- `data/collaborations.json` is the canonical list and currently contains seven
  records: TaiwanPlus, Public Television Service Taiwan, Dragon TV, Women Make
  Waves Film Festival, Taiwan International Children's Film Festival,
  ScreenHouse, and Gorgeous Space.
- None of those seven records currently declares a logo contract.
- `public/assets/logos/taiwanplus.svg` is the only tracked collaboration logo.
- `scripts/build-site.mjs` conditionally renders `item.logo`, otherwise visible
  text. It has no normalized collaboration contract or per-mark optical data.
- `src/styles.css` uses a wrapping flex row and one global `max-height` /
  `max-width`, so differently proportioned marks cannot be optically balanced.
- `scripts/build-figma-export.mjs` renders all marks as text. Its desktop home
  frame uses a fixed one-row position; its mobile home frame uses only the first
  four records.
- `figma/hsin-portfolio-importer/` has a hardcoded logo-name list, but the
  approved design contract classifies that importer as a legacy experiment,
  not a current-reference consumer.
- Existing source notes require one canonical data list, optical-height
  normalization, accessible names, official destinations, and text fallback
  when a trustworthy mark is unavailable.

## Official-Source Checkpoint

- TaiwanPlus: official SVG asset URL verified.
- Public Television Service Taiwan: official PNG asset URL and official visual
  identity documentation verified.
- Taiwan International Children's Film Festival: official site and current
  site-logo assets identified.
- Gorgeous Space: official site and a current official SVG logo URL identified.
- Women Make Waves Film Festival: official site verified; a standalone mark
  still needs exact extraction and visual verification.
- Dragon TV: no trustworthy official asset URL has yet been verified. Do not use
  a third-party logo library as a substitute.
- ScreenHouse: the exact collaborator identity and official domain remain
  ambiguous. Do not borrow a similarly named US or UK organization's mark.

## Constraints

- Official marks are used only for nominative identification of past work; the
  wall must not imply endorsement or current representation.
- Do not redraw, distort, combine, or generatively imitate a mark.
- Preserve the downloaded official source asset and provenance. A public
  monochrome derivative may be generated only without changing its geometry.
- The website and `npm run figma:export` must consume one normalized contract
  derived from `data/collaborations.json`.
- English and Chinese render the same records in the same order.
- No production build may depend on a live third-party URL.
- A missing, unverified, or invalid asset fails safely to accessible text.
- The current visual language remains: no logo boxes, card backgrounds, or
  heavy borders; marks sit quietly on the page background.
- The legacy Figma importer must not become a second canonical list.
- The protected untracked review file is out of scope and must not be modified,
  staged, or committed.
- The paused Ghost Hand Archive slideshow package remains separate.
- Do not push, merge, create a Preview, or deploy Production in this package
  without later explicit authorization.

## Non-goals

- Building a networked CMS or database-backed administration panel.
- Inventing additional collaborators not already confirmed by the producer.
- Obtaining marks from unofficial logo aggregation sites.
- Redesigning the surrounding page or changing section order.
- Reworking the retained legacy Figma importer.

## Reversible Boundaries

- A collaboration may stay as text until its identity and official source are
  verified.
- Optical scale tokens may be adjusted after desktop/mobile review without
  changing component anatomy.
- Original official assets and generated public derivatives remain separately
  identifiable so monochrome presentation can be rolled back.

## Affected Users, Systems, and Files

- Producer: future add/remove/replace workflow.
- Visitors: readable, balanced, accessible trust wall on desktop and mobile.
- Canonical data and normalization: `data/collaborations.json`,
  `scripts/lib/portfolio-contract.mjs`.
- Website: `scripts/build-site.mjs`, `src/styles.css`.
- Design handoff: `scripts/build-figma-export.mjs`, `figma-export/`.
- Asset workflow: `public/assets/logos/` plus an evidence-safe source location
  selected by the implementation plan.
- Verification: contract, website, Figma parity, asset safety, and responsive
  visual tests.

## Requested Independent Response Schema

Return these nine headings and do not edit the project:

1. `problem_reframe`
2. `pragmatic_path`
3. `alternative_architecture`
4. `low_cost_experiment`
5. `contrarian_challenge`
6. `unconstrained_possibility`
7. `overlooked_risks`
8. `assumptions_to_verify`
9. `recommended_next_decision`

For each architecture, name the canonical schema boundary, website/Figma
consumers, asset/provenance strategy, responsive placement model, fallback,
maintenance workflow, tests, rollback, and concrete tradeoffs. Experiments
must be falsifiable. Preserve disagreements rather than forcing consensus.
