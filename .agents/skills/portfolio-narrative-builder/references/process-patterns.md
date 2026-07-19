# Portfolio Process Patterns

Use these patterns for both new builds and existing-site refactors. Keep the public site concise; keep the evidence trail complete but private where necessary.

## Evidence Before Narrative

Build an inventory before writing or designing:

- works, roles, dates, collaborators, platforms, public links, press, metrics, and media;
- current and old CVs, bios, applications, portfolios, and notes;
- the user's desired opportunities, audiences, languages, references, and constraints.

Classify facts as public, source-only, private raw evidence, private derived fact, or unverified. Classify media as owned, licensed, public-link-only, needs-permission, or do-not-use.

Private evidence may confirm a public fact, but never copy raw messages, inbox results, addresses, phone numbers, screenshots, recipient lists, or confidential detail into the repo. Store only a redacted derived fact and its confidence when appropriate.

## Consolidate Copy By Function

Do not transfer a CV line by line. Label each piece of text as identity, proof, role, service, warmth, metric, CTA, archive, or SEO. Merge duplicate statements unless they serve different scanning moments.

Use three passes:

1. **Truth:** role, date, platform, scope, metric, and link.
2. **Hiring:** what the evidence proves and which future work it supports.
3. **Human:** the creator's taste, texture, curiosity, and voice.

For bilingual sites, define what each language does instead of translating mechanically. Keep titles and press claims close to the source.

## Shape The Portfolio Hierarchy

Separate flagship proof from supporting history:

- Hero: shortest useful positioning and strongest approved media.
- Early credibility: collaborations, platforms, or concise proof.
- Featured works: a small ordered set with role, context, proof, and a truthful action.
- Archive: secondary but credible work.
- Collaboration fit: what the creator can be hired to do.
- Contact: a clear conversion route on every viewport.

Treat experimental or AI-assisted work as a distinct layer only when it strengthens the positioning. Do not add a section merely because source material exists.

## Media And Press

For press, inspect canonical URL, source title, description, preview image, and check date. A press card represents the publication, not the portfolio project.

Prefer links or embeds for public video and platform media. Do not download, crop, edit, or rehost link-only media. If no approved image exists, use a labelled placeholder or a deliberate text-first treatment.

Record canonical media roles, localized alt text, dimensions, focal points, status, and rights. The website generator and Figma/design generator must use the same content and media data. An importer must not maintain parallel hand-written `COPY`, `ASSETS`, or `WORKS` arrays.

## Translate References Into Rules

For each reference, record:

- what the user likes;
- what fits the portfolio's actual content;
- what must not be copied;
- type, color, spacing, shape, image treatment, motion, desktop behavior, and mobile behavior;
- accessibility and performance risks.

Use the resulting spec as the review target. A reference is evidence for a decision, not a surface to clone.

## Work In Reversible Packages

Useful packages include content, information architecture, visual system, media/showreel, interaction, conversion, SEO, deployment, and design handoff. Each package declares its goal, likely files, non-goals, validation, and rollback path.

When reshaping an existing site, establish a checkpoint before porting or retiring anything. Prefer a separate worktree for a substantial hybrid so the original version remains previewable and recoverable.

## Publishability Gate

Before preview or deployment, verify:

- every public claim is supported and approved;
- private-derived facts are redacted and publishable;
- no raw private evidence or credential appears in source or output;
- media use matches its rights status;
- unverified and source-only material is excluded;
- removed sections do not survive in active data, site output, tests, Figma exports, or importer code.

## External Review

When external or named AI review is requested, use `reviewing-with-multiple-ai`. Reviewers should normally inspect deterministic and visual QA evidence before proposing changes. Resolve disagreements against the user's goal, constraints, and stated taste; do not apply all suggestions automatically.
