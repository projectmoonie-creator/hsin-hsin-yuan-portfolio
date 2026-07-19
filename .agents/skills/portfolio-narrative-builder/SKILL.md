---
name: portfolio-narrative-builder
description: Build a public-facing portfolio or resume-supplement website from scattered creative evidence, including materially reshaping an existing portfolio without losing its strongest structure. Use for bilingual or international creator sites, case-study archives, showreel planning, replaceable media systems, design-reference translation, and synchronized website/Figma handoff.
---

# Portfolio Narrative Builder

Turn scattered work evidence—or an uneven existing site—into a coherent, maintainable portfolio that helps the creator receive the right work. Preserve the creator's voice and proven interaction patterns; avoid turning the site into a generic agency landing page.

For the general evidence, narrative, privacy, rights, and publishability method, read `references/process-patterns.md`.

## Route The Task

Choose the smallest workflow that fits:

- For a portfolio created from scattered source material, follow **Build From Evidence**.
- For a materially reshaped existing site, read all of:
  - `references/existing-site-hybrid-refactor.md`
  - `references/replaceable-media-and-design-sync.md`
  - `references/validation-gates.md`
- For a site plus editable design handoff, also apply the canonical-data rules in `references/replaceable-media-and-design-sync.md`.

**REQUIRED SUB-SKILL:** Use `frontend-design` before changing an active visual system. Translate reference material into explicit choices for type, color, spacing, shape, image treatment, motion, desktop behavior, and mobile behavior before editing the interface.

When the user asks Claude, Gemini, Codex, another named reviewer, or two AI reviewers to inspect the work, **REQUIRED SUB-SKILL:** use `reviewing-with-multiple-ai`. Keep provider authentication, model routing, quota recovery, and reviewer completion rules in that canonical skill; do not duplicate them here.

## Build From Evidence

1. Inventory current CVs, old portfolios, public work links, press, media, metrics, design references, and any private evidence the user explicitly offers.
2. Classify each fact as public, source-only, private raw evidence, private derived fact, or unverified.
3. Classify every asset as owned, licensed, public-link-only, needs-permission, or do-not-use.
4. Consolidate text by function: identity, proof, role, service, warmth, metric, CTA, archive, or SEO. Remove repetition that does not serve a different scanning moment.
5. Define the audience, desired opportunities, flagship works, archive, language roles, and publishing constraints.
6. Map a concise information architecture. Keep homepage proof scannable and move dense material to detail pages or the private source archive.
7. Define a visual system from the creator's strongest approved media and the translated reference rules.
8. Implement in small, reversible packages backed by structured data and tests.
9. Run the privacy, rights, accessibility, visual, and deployment gates before publishing.

## Existing-Site Hybrid Refactor

Treat the old site as evidence, not as a tree to overwrite wholesale.

1. Record a structural baseline and matched screenshots.
2. Protect every version the user may want to revisit with a named branch and annotated tag.
3. Build the hybrid in a separate branch or worktree from the chosen structural baseline.
4. Classify each section and behavior as `keep`, `port`, `rewrite`, or `retire`.
5. Port verified content and media metadata before changing the generator.
6. Replace high-salience visual fingerprints at their owning source instead of masking them with tail-end CSS.
7. Keep the user's approved structure and interaction while translating the new visual language.
8. Prove both presence of the new system and absence of retired behavior.
9. Keep deployment at preview status until the user approves production replacement.

Use the full procedure and failure patterns in `references/existing-site-hybrid-refactor.md`.

## Replaceable Media And Design Handoff

Store every replaceable media role in canonical structured data. A routine image replacement should require only the asset plus manifest/frontmatter edit—not generator, CSS, SVG, or plugin surgery.

The live site, generated design exports, and editable importer must consume the same canonical content and media snapshot. Do not maintain parallel `COPY`, `ASSETS`, or `WORKS` arrays by hand.

Use semantic media, bilingual alt text, dimensions, desktop/mobile focal points, rights status, and explicit text-first fallbacks. See `references/replaceable-media-and-design-sync.md`.

## Validation

Work test-first for behavior changes and regressions. Validate:

- content truth, privacy, rights, and publishability;
- section order, anchors, links, and bilingual output;
- desktop, tablet, mobile, reduced motion, no-JS, keyboard, and overflow states;
- desired design fingerprints and retired-effect absence;
- site/Figma content and media parity;
- rollback checkpoints and preview isolation.

Use `references/validation-gates.md` for the complete gates.

## Expected Artifacts

Create only what the task needs. Prefer stable names when useful:

- `source-inventory.json`
- `public-content.json`
- `open-questions.md`
- `site-map.md`
- `privacy-review.md`
- `data/media.json` or an equivalent media manifest
- an approved design spec and implementation plan
- named checkpoint branch/tag for recoverable versions
- generated site and design-layer outputs derived from canonical data

## Non-Negotiables

- Never publish raw private evidence, secrets, addresses, recipient lists, or unapproved client details.
- Never rehost link-only third-party media without clear rights.
- Never fill an empty media role with an unrelated image.
- Never let active generators recreate a section the user retired.
- Never claim two-reviewer completion when only one reviewer completed.
- Never replace the production portfolio before explicit approval of the preview.
