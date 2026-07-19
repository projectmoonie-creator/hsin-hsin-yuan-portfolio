---
name: build-cinematic-portfolio
description: Build or reshape a creator, filmmaker, artist, or director portfolio into a restrained cinematic website with replaceable media, bilingual content, scroll-led storytelling, responsive motion, and publishability checks. Use when the user supplies career materials, work links, portraits, project images, a visual reference, or an existing portfolio and wants a reusable image-led website rather than a CV-style card grid.
---

# Build Cinematic Portfolio

Create a portfolio whose media, narrative, and motion form one system. Extend `portfolio-narrative-builder` for evidence classification, positioning, rights, and public/private boundaries; do not duplicate those decisions here.

## Workflow

1. Read the target repository instructions and existing portfolio skill.
2. Inventory supplied text, works, links, portraits, stills, video, and references. Read [references/intake-schema.md](references/intake-schema.md).
3. Classify media rights before copying, cropping, rehosting, or editing assets.
4. Translate each reference into rules for density, type, image treatment, section rhythm, motion, and mobile behavior. Never copy surface styling literally.
5. Present 2–3 directions and receive approval before implementation.
6. Create a structured media manifest using [references/media-contract.md](references/media-contract.md). Keep CSS independent of asset filenames.
7. Consolidate the homepage to one identity, 3–4 flagship works, contextual proof, one practice statement, selected history, and contact. Put depth in detail pages or private source archives.
8. Write tests first for the media contract and public structure. Watch them fail before implementation.
9. Implement progressive enhancement: fully visible HTML/CSS first, optional scroll choreography second.
10. For material architecture, public-claim, privacy, or visual-system changes, run the evidence-first review loop in [references/cross-review-loop.md](references/cross-review-loop.md). Reviewers produce findings before anyone edits.
11. Run the manifest validator and all gates in [references/quality-gates.md](references/quality-gates.md). Verify desktop, mobile, and reduced motion.

## Required Media Behavior

- Treat hero background, optional foreground cutout, work poster, and video as named roles.
- Allow optional layers to be empty without broken markup or layout.
- Store focal points and bilingual alt text in data.
- Keep the subject inside a crop-safe zone on mobile and desktop.
- Never require a CSS edit for an ordinary image replacement.

Run:

```bash
node .agents/skills/build-cinematic-portfolio/scripts/validate_media_manifest.mjs data/media.json public
```

## Motion Rules

- Use motion to reveal hierarchy, not to decorate every surface.
- Prefer sticky media, restrained parallax, section color fields, and mask reveals.
- Never make initial content depend on JavaScript-added visibility classes.
- Disable scroll transforms under `prefers-reduced-motion`.
- Remove sticky behavior and large translations on narrow screens.
- Avoid stacking pointer glow, continuous animation, parallax, scale, and opacity on one element.

## Iteration Rule

When implementation exposes a repeated failure, hidden asset assumption, or verification gap, update the smallest relevant reference or validator in this skill before finishing. Keep rules general enough to apply to the next creator portfolio.

Do not treat an unavailable reviewer as a negative result or a completed review. Record the failed attempt and continue with local evidence-based checks; retry externally only after the specific authentication, access, capacity, or quota condition changes.
