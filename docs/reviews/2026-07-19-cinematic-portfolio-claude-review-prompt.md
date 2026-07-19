# Claude Code cold review — cinematic portfolio integration

Act as an independent, read-only external reviewer. Do not edit files, run formatters, commit, or change git state.

Target repository: `/Users/hsin-hsinyuan/Documents/Claude/Projects/Moonie V/hsin-hsin-yuan-portfolio-edit`
Target branch: `codex/cinematic-portfolio-system`

## Objective

Review the complete current uncommitted cinematic portfolio integration: an editorial/cinematic bilingual homepage, an optional layered portrait foreground, three featured works, replaceable media manifest, Figma export synchronization, and a reusable portfolio-building skill. Determine whether it is coherent, maintainable, safe to merge, and faithful to Hsin-Hsin Yuan's positioning.

## Read first

- `AGENTS.md` if present, then `PROJECT_BIBLE.md`
- `docs/superpowers/specs/2026-07-19-cinematic-portfolio-system-design.md`
- `docs/superpowers/plans/2026-07-19-cinematic-portfolio-system.md`
- `docs/portfolio-site-spec.md`
- `docs/figma-design-layer.md`
- `data/media.json`, `data/site.json`
- `content/works/*.md`
- `scripts/build-site.mjs`, `scripts/build-figma-export.mjs`
- `src/styles.css`, `src/main.js`
- `tests/*.test.mjs`
- `.agents/skills/build-cinematic-portfolio/SKILL.md` and all directly referenced files
- `docs/reviews/2026-07-19-cinematic-portfolio-gemini-review.md`
- `docs/reviews/2026-07-19-cinematic-portfolio-external-review-status.md`
- current `git diff` and `git status`

## Review dimensions

1. Narrative and positioning: does the page communicate documentary director/writer/producer/cross-cultural storyteller without generic agency clutter?
2. Visual system: cinematic hero, hierarchy, density, three-work pacing, mobile/desktop behavior, reduced motion, overflow, and image replacement headroom.
3. Implementation truth: optional foreground behavior, media validation, escaping, Figma synchronization, bilingual parity, archive/detail preservation, and generated output assumptions.
4. Content and rights: Tech Dreamers changes, public/private evidence, remote media, attribution, privacy, and editorial scope drift.
5. Tests: meaningful behavior coverage, brittle literal snapshots, missing negative cases, and whether stated validation is supported by source.
6. Reusable skill: can a cold future agent reproduce the result from sufficient inputs without rediscovering this session? Identify missing contracts or unsafe authority.
7. Cross-review: independently verify or reject every Gemini claim; look for important omissions Gemini missed.

## Evidence rules

- Findings first, ordered Critical / High / Medium / Low.
- Every blocker or high finding needs current `file:line` evidence and a reproducible failure or exact violated contract.
- Label each Gemini item `agree`, `upgrade`, `downgrade`, `reject`, or `already-fixed`.
- Separate confirmed defects from optional improvements and editorial choices.
- For each confirmed defect include impact, smallest safe work package, and verification.
- End with `What is already strong` and one verdict: `approve`, `approve with non-blocking follow-up`, or `review again after fixes`.
- Write in Traditional Chinese.

Known local evidence: the implementation previously passed 20/20 tests, build, media-manifest validation, skill validation, and desktop/mobile visual checks. Do not trust this statement blindly; compare it with current source and tests.
