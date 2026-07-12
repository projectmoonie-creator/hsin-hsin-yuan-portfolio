# Portfolio Retrospective And Claude Review Prompt

Date: 2026-07-12

## What Changed Today

- Removed the standalone `Selected Impact` section from the live site.
- Moved the rule into the project bible: metrics must travel with the work, archive item, press card, or future detail page that gives them context.
- Removed `data/impact.json` and retired `impactLabel`.
- Removed `dist/` from git tracking and added it to `.gitignore`.
- Added content-hash cache busting for CSS/JS.
- Fixed Slow Steps so it no longer borrows the Paris Cultural Olympiad image as a placeholder.
- Confirmed archive/lab body text renders.
- Cleaned the Figma importer plugin so it cannot recreate `Selected Impact` or reuse the wrong Slow Steps image.
- Added negative regression tests for the removed impact section and borrowed placeholder image.

## Mistakes And Lessons

1. **Removing a section from the website is not enough.**
   The first pass removed `Selected Impact` from the live generator, but the Figma importer still had an active `Selected Impact` block. Future removals must check every active output layer: content, generator, CSS/JS, tests, generated HTML, Figma exports, Figma importer code, and current specs.

2. **Metrics need context.**
   Standalone proof numbers can feel impressive but become unclear without the project, platform, date range, and role. For this portfolio, metrics should sit inside the relevant project card, archive entry, press card, or detail page.

3. **Placeholder media can become misinformation.**
   Borrowing a strong image from another project makes the layout look finished, but it creates a false association. If a work has no approved image, use an explicit placeholder or text-first treatment.

4. **Design references need translation before implementation.**
   The user may like an atmosphere, motion behavior, logo treatment, or editorial feeling, not the whole reference layout. Convert references into implementation rules before coding.

5. **Fast prototype and refined product are different phases.**
   A CV-to-site draft can be useful very quickly. The later phase needs a roadmap: content consolidation, IA, visual direction, media rights, interaction, SEO, contact, analytics, design handoff, and maintenance.

6. **External AI reviewers should review before editing.**
   Claude/Gemini/Codex reviewers are valuable for blind spots, but they should first produce findings and scoped work packages. Letting another agent edit directly can flatten taste or introduce unrelated churn.

## Roadmap Recommendation

Use work packages instead of open-ended polishing:

1. **Content stabilization**
   Confirm public claims, roles, dates, metrics, and language. Remove duplication. Decide which works need detail pages.

2. **Visual system refinement**
   Translate references into typography, spacing, image, logo, and motion rules. Verify desktop and mobile separately.

3. **Media/showreel package**
   Replace temporary assets, collect approved stills, decide which public videos are embed/link-only, and prepare showreel entry points.

4. **Work detail pages**
   Add detail pages for projects with multiple episodes, trailers, press, metrics, or complex context.

5. **SEO/social/contact**
   Validate metadata, Open Graph previews, contact form behavior, spam control, and optional analytics.

6. **Design handoff**
   Keep Figma/SVG/importer outputs aligned with the live site. Add design-layer checks whenever content architecture changes.

7. **Skill/productization**
   Turn the repeatable method into an intake-driven service: evidence graph, positioning memo, content map, visual direction, prototype, refinement packages, external review, and handoff.

## Paste This To Claude Code

```text
You are Claude Code acting as an external reviewer for Hsin-Hsin Yuan's portfolio repo.
Do not edit files unless explicitly asked. First produce findings and a suggested work package.

Run from this repo:

cd "/Users/hsin-hsinyuan/Documents/Claude/Projects/Moonie V/hsin-hsin-yuan-portfolio-edit"

Read first:
- PROJECT_BIBLE.md
- docs/reviews/portfolio-retrospective-and-claude-prompt-2026-07-12.md
- docs/figma-design-layer.md
- data/site.json
- scripts/build-site.mjs
- scripts/build-figma-export.mjs
- figma/hsin-portfolio-importer/code.js
- tests/build-site.test.mjs
- tests/figma-plugin.test.mjs
- content/works/*.md
- content/archive/*.md
- content/lab/*.md

Review goals:
1. Check whether the lessons from today's retrospective are fully reflected in the code, tests, docs, and active design handoff tools.
2. Verify that `Selected Impact`, `impact-grid`, `data/impact.json`, `loadImpact`, and standalone metric-proof UI cannot return through any active generator or Figma importer.
3. Verify that metrics appear only with contextual works/archive/press/detail-ready content.
4. Verify that Slow Steps does not borrow unrelated Paris Cultural Olympiad imagery in live site output, Figma SVG export, or Figma importer code.
5. Check whether PROJECT_BIBLE.md and the portfolio-narrative-builder skill updates are specific enough to prevent repetition, placeholder-media mistakes, and uncontrolled external-agent edits.
6. Evaluate whether the roadmap is realistic for a portfolio that may become a commercializable CV-to-site skill/service.
7. Identify any missing tests or search checks that should be added.

Suggested commands:

npm test
npm run build
rg -n "Selected Impact|impact-grid|impact-section|data/impact|loadImpact|impactLabel|paris-cultural-olympiad-team" .
rg -n "metric|metrics|sourceNote|posterImage|watchUrl|metadataCheckedAt" content data scripts tests PROJECT_BIBLE.md docs
git status --short

Output in Traditional Chinese:
- High/Medium/Low findings with file:line evidence.
- Which findings are actual blockers versus cleanup.
- Whether you recommend any code edits now.
- A suggested next work package, with goal, files, non-goals, validation steps, and rollback path.
- Do not modify the repo unless I explicitly approve a specific package.
```

