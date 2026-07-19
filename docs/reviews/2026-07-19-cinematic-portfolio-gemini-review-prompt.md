# Gemini External Review Prompt — Cinematic Portfolio System

You are an external reviewer for Hsin-Hsin Yuan's bilingual cinematic portfolio. Work read-only. Do not edit files.

## Goal

Review the current uncommitted implementation on branch `codex/cinematic-portfolio-system`. It combines a restrained editorial portfolio with a higher-motion layered portrait hero, reduces the homepage to three featured works, introduces a replaceable media manifest, synchronizes Figma export, and adds a reusable `build-cinematic-portfolio` skill.

## Read first

- `AGENTS.md`
- `PROJECT_BIBLE.md`
- `docs/superpowers/specs/2026-07-19-cinematic-portfolio-system-design.md`
- `docs/superpowers/plans/2026-07-19-cinematic-portfolio-system.md`
- `.agents/skills/build-cinematic-portfolio/SKILL.md`
- `.agents/skills/build-cinematic-portfolio/references/*.md`
- `data/media.json`
- `data/site.json`
- `content/works/*.md`
- `scripts/build-site.mjs`
- `scripts/build-figma-export.mjs`
- `src/styles.css`
- `src/main.js`
- `tests/build-site.test.mjs`
- `tests/figma-export.test.mjs`

## Review scope

1. Verify the media manifest genuinely allows ordinary hero-image replacement without CSS changes and handles an empty optional foreground safely.
2. Check desktop/mobile/reduced-motion behavior from source, especially sticky traps, horizontal overflow, initial visibility, play-control placement, and excessive simultaneous effects.
3. Check whether the three-work homepage reduction is internally consistent with the screening strip, archive, links, metrics, press, navigation, Figma exporter/importer, tests, and current specs.
4. Audit remote-image behavior, rights boundaries, alt text, CSS URL escaping, Figma remote placeholders, and possible privacy/publication leaks.
5. Review test quality: identify semantic regressions that are unprotected and CSS/snapshot assertions that are now overfit or contradictory.
6. Review the reusable skill for intake completeness, deterministic validation, cross-review integrity, failure handling, and whether another agent could reproduce the workflow with new creator materials.
7. Identify scope drift or accidental changes unrelated to the cinematic redesign, including the pre-existing Tech Dreamers test/content work.

## Commands

```sh
git status --short
git diff --check
npm test
npm run build
node .agents/skills/build-cinematic-portfolio/scripts/validate_media_manifest.mjs data/media.json public
rg -n "services-grid|lab-section|impact-grid|data-horizontal-scroll|hero-portrait|media.json|foreground|posterImage|remote image" . --glob '!docs/reviews/**'
```

## Output in Traditional Chinese

- Findings first, ordered Critical / High / Medium / Low.
- Every finding needs `file:line` or exact generated-artifact evidence.
- Separate actual blockers from cleanup.
- For each finding: impact, evidence, recommended decision, smallest safe work package, validation, and rollback.
- Flag any finding that hides an editorial, privacy, rights, or architecture decision.
- Include a short section: `值得保留的部分`.
- End with a verdict: `可進入視覺細修`, `修正後再審`, or `不建議繼續`.
- Do not edit files.
