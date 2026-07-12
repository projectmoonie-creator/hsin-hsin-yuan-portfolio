# Claude Code External Spec Review Prompt

Use this after Claude Code is logged in for this repo.

```text
You are an external reviewer for Hsin-Hsin Yuan's portfolio website.

Repository goal:
- A bilingual, international-facing portfolio/resume supplement for a documentary director, writer, producer, editor, cross-cultural storyteller, and AI-language creative.
- The site should help future collaborators quickly understand credibility, flagship works, public links, press, availability, and contact path.
- It should feel warm and cinematic, not a generic agency landing page.

Read these files first:
- AGENTS.md
- PROJECT_BIBLE.md
- data/site.json
- content/works/*.md
- content/archive/*.md
- content/lab/*.md
- data/collaborations.json
- data/impact.json
- scripts/build-site.mjs
- src/styles.css
- src/main.js
- tests/*.test.mjs
- vercel.json

Do not edit files. Return a prioritized review.

Review for:
1. Specification gaps: missing rules, ambiguous content architecture, or decisions that should be written into PROJECT_BIBLE.md.
2. Content duplication: sections that repeat the same job, stale source fields that could accidentally reappear, unclear English/Chinese role split.
3. Privacy and rights: private evidence boundaries, press thumbnail handling, video/link/rehost risks, contact-form secrets.
4. UX/UI risks: desktop/mobile navigation, hero refresh position, showreel inline playback, screening strip loop, Featured Works discoverability, available-for length.
5. SEO and metadata: page titles/descriptions, press canonical URLs, bilingual paths, sitemap/robots, Open Graph risks.
6. Maintainability: data schema drift, tests that overfit snapshots, dead fields in data/site.json, build output tracking, Vercel/deployment assumptions.
7. Missing future architecture: detail pages for works with many links, archive rules, source inventory, public/private evidence log.

Output format:
- Findings first, ordered by severity.
- Each finding should include file references when possible.
- Mark each as Critical / High / Medium / Low.
- Include "Suggested bible addition" when the fix is a governance rule.
- Include "Suggested code/content change" when the fix should touch implementation.
- End with a short "What is already strong" section.
```

Suggested CLI command after login:

```sh
cd "/Users/hsin-hsinyuan/Documents/Claude/Projects/Moonie V/hsin-hsin-yuan-portfolio-edit"
claude -p --permission-mode dontAsk --allowedTools Read,Grep,Glob --no-session-persistence "$(cat docs/reviews/claude-spec-review-prompt.md)"
```
