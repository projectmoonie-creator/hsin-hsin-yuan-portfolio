---
name: build-cinematic-portfolio
description: Use when building or materially reshaping a creator, filmmaker, artist, or director portfolio, especially when an existing site must become visibly different, a motion reference must be translated, media must remain replaceable, or a person must appear as an independent foreground layer.
---

# Build Cinematic Portfolio

Make media, narrative, and motion one system. Use `portfolio-narrative-builder` for positioning, evidence, rights, and public/private boundaries.

## Workflow

1. Read repository instructions and the existing portfolio skill.
2. Inventory content and media using [references/intake-schema.md](references/intake-schema.md).
3. For an existing site, capture desktop/mobile states and decide `keep` or `replace` for every high-salience fingerprint. Read [references/legacy-fingerprint-audit.md](references/legacy-fingerprint-audit.md).
4. Classify media rights before copying, cropping, rehosting, or editing assets.
5. Translate references into choreography, density, type, image, rhythm, and mobile rules; never copy surface styling literally.
6. Present 2–3 directions with fingerprint decisions and obtain approval.
7. Create the manifest from [references/media-contract.md](references/media-contract.md); keep CSS independent of filenames.
8. Consolidate the homepage around one identity, 3–4 flagship works, selected proof/history, and contact.
9. Write failing tests for the contract, public structure, and retired high-salience fingerprints.
10. Replace old visuals at their owning source and generator, never through a tail override architecture.
11. Make HTML/CSS complete first; add scroll choreography as progressive enhancement.
12. Run [references/cross-review-loop.md](references/cross-review-loop.md) for material architecture, claims, privacy, or visual-system changes.
13. Run [references/quality-gates.md](references/quality-gates.md), matched desktop/mobile before/after checks, and reduced-motion verification.

## Required Media Behavior

- Treat backgrounds, foreground cutouts, abstract layers, posters, and video as named roles.
- A layered-person or `portrait-carrier` treatment requires a transparent foreground asset; an empty slot fails the contract.
- Allow only genuinely optional layers to be empty without broken markup or layout.
- Store focal points and bilingual alt text in data.
- Keep subjects crop-safe on mobile and desktop.
- Never require a CSS edit for an ordinary image replacement.

Run:

```bash
node .agents/skills/build-cinematic-portfolio/scripts/validate_media_manifest.mjs data/media.json public
```

## Motion Rules

- Use one dominant motion idea to reveal hierarchy.
- Never make initial content depend on JavaScript-added visibility classes.
- Disable scroll transforms under `prefers-reduced-motion`.
- Remove sticky behavior and large translations on narrow screens.
- Do not stack glow, continuous animation, parallax, scale, and opacity on one element.

## Iteration Rule

When implementation exposes a repeated failure or hidden assumption, update the smallest relevant reference or validator with a reusable rule.

Do not treat an unavailable reviewer as a negative result or a completed review. Record the failed attempt and continue with local evidence-based checks; retry externally only after the specific authentication, access, capacity, or quota condition changes.
