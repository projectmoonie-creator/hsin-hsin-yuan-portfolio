# Editorial Watch Loop Hybrid — Design Specification

## Status

Approved for implementation on 2026-07-19.

This is the selected **third / hybrid direction**: preserve the old portfolio's familiar reading order, split hero, and horizontally moving series preview, then apply the newer editorial typography, palette, rounded framing, and simplified visual language. Unnecessary glow, ambient decoration, and competing motion are removed.

The goal is not to merge two entire implementations. It is to rebuild from the known-good old shell and selectively port the parts of the newer system that improve clarity, maintainability, and future image replacement.

## Decision Summary

- **Structural baseline:** commit `5cdb842`, the old stable site.
- **Preserved alternate direction:** commit `e05556c`, the completed portrait-scene version.
- **Selected architecture:** old split hero, old content rhythm, and old watch-loop concept.
- **Selected visual treatment:** new type, palette, thin borders, rounded media frames, and restrained editorial accents.
- **Selected motion policy:** one meaningful horizontal watch loop; no ambient glow system or decorative continuous motion elsewhere.
- **Release policy:** build and review the hybrid separately. Production remains unchanged until Hsin-Hsin explicitly approves the preview.

## Git And Recovery Strategy

After this specification is approved:

1. Preserve `e05556c` with branch `checkpoint/portrait-scene-v1` and annotated tag `portrait-scene-v1`.
2. Create branch `codex/editorial-watch-loop-hybrid` from `5cdb842`.
3. Check that branch out as a separate Git worktree at `hsin-hsin-yuan-portfolio-hybrid`.
4. Port current content, media metadata, validation, and reusable workflow improvements selectively.

A Git worktree is preferred to a copied Finder folder because both versions remain independently runnable while commits, history, and rollback stay explicit. The checkpoint is a recoverable version, not a runtime feature flag and not a second production site.

## Audience And Page Job

The site introduces Hsin-Hsin Yuan as a documentary director, writer, producer, and cross-cultural story partner. Its primary reader is an international producer, cultural institution, artist, or technology team evaluating whether to initiate a collaboration.

The homepage must do four things in order:

1. establish identity and point of view;
2. let the reader sample the body of work quickly;
3. provide enough context to understand roles and collaboration fit;
4. make contact easy without burying the work beneath service cards or effects.

## Information Architecture

The page order is fixed:

1. **Topbar** — compact, mixed-case navigation and language control.
2. **Split hero** — the existing showreel entry on the left; name, role, statement, and primary actions on the right.
3. **Collaborations** — a concise credibility band.
4. **Watch loop** — the prominent horizontally moving series preview inherited from the old site.
5. **Availability / practice summary** — a short statement of current availability and working modes.
6. **Selected works** — six anchored editorial work rows in the established order.
7. **Collaboration fit** — one concise block explaining who should contact Hsin-Hsin and for what kinds of work.
8. **History / archive** — selected credits and earlier work.
9. **Contact and footer** — direct contact action and quiet closing information.

The homepage does **not** restore the old generic services-card grid or the standalone AI / Language Lab section. Their underlying source material may remain in content files for future detail pages, but it does not compete with the portfolio narrative on this page.

## Work Order And Anchors

The canonical work order remains unchanged:

1. Slow Steps
2. Tech Dreamers
3. My Art, My Voice
4. Interior / Spatial Brand Films
5. PTS Taigi
6. Top Gear

All six works render as simplified editorial rows with stable section anchors. The watch loop contains five moving-image work previews: Slow Steps, Tech Dreamers, My Art, My Voice, PTS Taigi, and Top Gear. Each preview links to its corresponding internal work anchor; the work row then exposes an external watch or project link only when one is already public. Slow Steps currently remains a deliberate text-first preview because it has neither an approved poster nor a public watch URL. Interior / Spatial Brand Films remains in Selected Works but is omitted from the watch loop because it is an in-progress collection without a canonical watch URL.

## Visual System

### Palette

- `--stage: #050807` — dark opening, selected dark surfaces, and footer.
- `--fog: #dddcd7` — muted neutral field.
- `--paper: #f6f4ee` — primary editorial reading surface.
- `--signal-coral: #f0645a` — small documentary/directing markers.
- `--signal-cobalt: #4867d9` — small cross-cultural markers.
- `--signal-moss: #4d9259` — small editorial-system markers.

Signal colors are limited to short rules, indexes, focus states, and small markers. They never become ambient washes, large blurred fields, text shadows, or glowing edges.

### Typography

- Display and interface: `Helvetica Neue`, `Arial`, and system sans-serif fallbacks.
- Editorial accent: `Iowan Old Style`, `Baskerville`, or `Times New Roman` italic.
- Chinese: system Chinese sans and serif fallbacks preserving the same functional roles.
- Mixed case is the default. Display copy uses light or regular weight, not global uppercase or exaggerated tracking.
- Italic accents appear only where they add narrative emphasis; they do not decorate every heading.

### Shape And Surface

- Hero media, watch-loop previews, and major work media use rounded frames.
- Containers use flat 1px borders where separation is needed.
- Layout is created with spacing, scale, crop, and typographic contrast rather than glass panels or drop shadows.
- Navigation uses predictable foreground/background colors; `mix-blend-mode` is not used.

## Hero

The hero returns to the old split composition because it makes the showreel and the identity readable at the same time.

On desktop, the existing showreel cover and play action occupy the left field; the name, role, concise statement, and actions occupy the right. The two fields may enter once with a short opacity-and-translate transition of no more than 450ms. They do not continuously pulse, float, glow, or react to the pointer, and the entrance is removed under reduced motion. On mobile, the content stacks in narrative order without a sticky scene or clipped text.

The current portrait-carrier effect is not included in this hybrid. It remains fully recoverable through the portrait-scene checkpoint.

## Horizontal Watch Loop

The watch loop is the site's one signature movement. It restores the old native JavaScript auto-loop behavior while tightening its accessibility and visual treatment.

- It moves at a calm, constant rate rather than using a dramatic carousel snap.
- It pauses on pointer hover, keyboard focus within the loop, and touch interaction.
- Keyboard users can reach every preview and link.
- Preview media uses semantic `<img>` elements with manifest-provided alt text, focal position, width, and height metadata when an approved poster exists. A work without approved media renders as a deliberate text-first preview. Filenames are never hardcoded in CSS.
- The loop may duplicate its visual sequence for seamless movement, but duplicated items are hidden from assistive technology and removed from the tab order.
- With `prefers-reduced-motion: reduce`, auto-movement is disabled. The same items remain manually scrollable and fully readable.
- Without JavaScript, the previews render as an ordinary horizontal overflow row.

No wheel interception or forced page-level horizontal scrolling is introduced.

## Selected Works

Selected Works preserves the old sequence while adopting a quieter editorial layout. Each work is a full-width anchored row or chapter, not a dense card. A row contains:

- title and year;
- one concise description;
- role and relevant proof or credit;
- one dominant replaceable image and any supporting media already assigned to that work in canonical data;
- the relevant watch or project action.

The entire set of six works is present in the generated homepage. The generator must not truncate the list to the first three items.

## Effects Removed

The hybrid must not restore or introduce:

- Anime.js or OGL runtime dependencies;
- WebGL or ambient canvas backgrounds;
- light-beam, edge-glow, pointer-glow, or reflection-sweep layers;
- body-level radial glows or colored atmospheric washes;
- heavy box shadows or glassmorphism;
- the continuously animated `heroStillPush` treatment;
- `mix-blend-mode` navigation;
- multiple simultaneous marquees, parallax systems, or sticky story scenes.

The watch loop is deliberate content motion. Small hover, focus, and entrance transitions may clarify state, but must be short, bounded, and disabled or simplified under reduced motion.

## Content And Media Contract

The current content schema is canonical. The hybrid generator adapts the old shell to current fields; it does not revive retired site fields such as `heroTitleLines`, `heroEyebrow`, `services`, `labTitle`, or other obsolete homepage-only structures.

Retain and reuse:

- the current `content/works` order and improved bilingual copy;
- `data/media.json` and its validator;
- media alt text, focal points, dimensions, treatment, and supporting-media metadata;
- press data and verified external links;
- data-driven content generation rather than handwritten duplicated markup.

If the site-level schema lacks an accessible bilingual name for the preview region, add only a localized `watchLoopAria` field. No larger legacy-schema restoration is necessary.

## Future Image Replacement

Ordinary image replacement must be data-only:

1. add or replace the media asset;
2. update its path and role in the media manifest;
3. adjust desktop/mobile focal point and localized alt text if needed;
4. run media validation and rebuild.

Layout CSS must not reference content filenames. Hero, watch-loop, and work media should each have an explicit replaceable role, predictable aspect-ratio container, and mobile crop. The implementation workflow and reusable portfolio skill will document this replacement path.

## Figma And Generator Alignment

The Figma export/import workflow must represent the hybrid page order, palette, type hierarchy, split hero, watch loop, and six work rows. It must no longer treat portrait-carrier frames as the active homepage design; those remain in the checkpoint branch.

Generated Figma frames and generated site markup draw from the same canonical content and media roles. A changed image path or focal point should not require manual repair in both systems.

## Accessibility And Responsive Behavior

- Semantic headings preserve a logical outline in both languages.
- All interactive elements have visible keyboard focus.
- The language switch preserves the corresponding page and remains understandable without visual effects.
- Media has localized alt text; decorative duplicates have empty alt text and appropriate accessibility hiding.
- Desktop and tablet retain the moving watch loop.
- Mobile always uses a manually scrollable preview row with no automatic movement.
- No horizontal overflow appears outside the intentional watch-loop viewport.
- No mobile sticky trap, clipped action, or unreachable work link is permitted.
- The page remains meaningfully readable with JavaScript disabled.

## Verification Strategy

Implementation follows test-driven development. Before changing the generator, update or add failing tests for the approved behavior; then implement the minimum code needed to pass them.

Automated checks must cover:

- section order: Hero → Collaborations → Watch Loop → Availability → Selected Works;
- canonical order and anchors for all six works;
- five watch-loop previews, correct order, and internal links;
- pause and reduced-motion behavior, including a readable no-JavaScript fallback;
- absence of legacy effect classes, tokens, imports, and dependencies;
- presence of the new palette, type stack, rounded frames, and flat border fingerprints;
- compatibility with the current media manifest and validator;
- generator and Figma-sync output;
- mobile overflow and sticky-trap regressions.

Visual review must include:

- desktop at 1440×900 and 1200×900;
- tablet at 834×1112;
- mobile at 390×844 and 360×800;
- reduced-motion mode;
- a side-by-side comparison between the `portrait-scene-v1` checkpoint and the hybrid preview.

## Acceptance Criteria

- The result is unmistakably the old site's useful layout rhythm with the newer editorial visual system.
- The split hero, content order, and horizontal series preview are restored and prominent.
- The typography, palette, rounded framing, and restrained borders match the newly preferred direction.
- Unnecessary glow and ambient effects are absent in code and rendered output.
- All six selected works remain visible, correctly ordered, and replaceable through data.
- The site is readable and operable on desktop, mobile, keyboard, reduced-motion, and no-JavaScript paths.
- The portrait-scene version remains reachable through its checkpoint branch and tag.
- The hybrid preview does not replace production until explicit approval.

## Non-Goals

- No literal reproduction of the reference video's product interface or scenery.
- No portrait-carrier scene in the hybrid version.
- No generic services grid, standalone AI / Language Lab homepage section, or decorative feature clutter.
- No CMS, analytics expansion, remote font dependency, or unrelated copy rewrite.
- No parallel runtime themes or feature flags for switching between the two versions.
- No production deployment as part of initial implementation and preview verification.
