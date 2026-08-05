# Collaboration Logo Wall Component Plan

Date: 2026-08-06

Goal: make `Platforms & Collaborations` a repo-configured component family
shared by the website and Figma export, with verified official monochrome marks
and honest text fallbacks.

Base: `c33b2f810e95ba2a38146b2daf7ff1220b0d1712`

Branch: `codex/collaboration-logo-wall`

## Affected Files

- Canonical contract: `data/collaborations.json`,
  `scripts/lib/portfolio-contract.mjs`
- Offline assets: `assets/collaboration-logos/sources/`,
  `scripts/prepare-collaboration-logos.mjs`, `public/assets/logos/*-mono.svg`
- Consumers: `scripts/build-site.mjs`, `src/styles.css`,
  `scripts/build-figma-export.mjs`, `figma-export/`
- Tests/docs: focused contract, asset, website, Figma, design, source, review,
  and status files

## Non-goals

- Do not invent Dragon TV, Women Make Waves, or ScreenHouse marks.
- Do not fetch during builds, expose provenance, add brand-specific CSS, or
  change unrelated site sections.
- Do not push, merge, create Preview, or deploy Production in this package.
- Do not touch the protected user-owned untracked review file.

## Completed Steps

- [x] TDD a strict `CollaborationMark` public/evidence contract and unique IDs.
- [x] Preserve four verified official sources and generate deterministic,
  self-contained monochrome SVG derivatives through an offline command.
- [x] Render all seven website entries with four logo images, three visible
  fallbacks, four desktop slots, two mobile slots, and centered final rows.
- [x] Give the unlinked ScreenHouse fallback explicit accessible semantics.
- [x] Make desktop/mobile Figma exports consume the same complete normalized
  list, assets, tokens, modes, order, and centered layout.
- [x] Document data-only maintenance, rights boundary, and Figma parity.
- [x] Run 92/92 tests, build, Figma export, design audit, diff check, and
  English/Chinese desktop/mobile Chromium QA.
- [x] Freeze one review packet; Gemini returned PASS/no actionable findings.
- [x] Prepare the same packet for Claude subscription handoff without sending
  a model request or using a paid fallback.

## Rollback

Revert commits `87e55b8`, `f32dff6`, `a8b3d1e`, `7f79204`, and `90e713c` in
reverse order. This restores the prior wordmark strip without touching the
Overclocking/Ghost Hand base history.

## Open External Actions

Remote backup, local-main integration, Preview, and Production each require
separate producer authorization. Claude review remains
`handoff-to-active-session`; Dragon TV, Women Make Waves, and ScreenHouse remain
intentional text fallbacks.
