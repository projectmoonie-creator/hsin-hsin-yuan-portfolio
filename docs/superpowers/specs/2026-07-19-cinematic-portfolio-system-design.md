# Cinematic Portfolio System Design

## Goal

Reshape Hsin-Hsin Yuan's portfolio into a restrained cinematic narrative with one high-impact portrait sequence, three scannable featured works, contextual proof, and a reusable media contract. Borrow the spatial confidence and scroll choreography of the Dream Machine reference without copying its product-demo surface or making motion compete with documentary work.

## Approved Direction

- Use direction A for the overall site: editorial, quiet, image-led, and professionally useful.
- Use direction B selectively for the person: a layered portrait, soft color field, silhouette-like depth, and scroll-linked separation between subject, copy, and background.
- Preserve the existing static Node generator, bilingual paths, showreel, contact flow, SEO generation, and rights boundaries.
- Make every public image replaceable through structured data. CSS and templates must consume named media roles rather than rely on project-specific filenames.

## Homepage Architecture

1. **Hero portrait scene** — name, concise positioning, primary contact action, and playable showreel. The portrait sits in a replaceable media stage with optional foreground cutout and fallback background image.
2. **Screening strip** — retain as a lightweight visual index, but reduce its visual competition with the hero.
3. **Featured works** — show three primary projects as full-width editorial chapters. Each chapter carries its own image, role, short description, contextual metrics, and one primary action.
4. **Practice statement** — replace repetitive service and lab grids with one concise split statement describing documentary, cross-cultural, and AI-language practice.
5. **Selected history** — compress archive work into a quiet proof list, not a second featured-work grid.
6. **Collaborations and contact** — show selected platform credibility without boxed-logo repetition, then end with the existing inquiry flow.

## Removal And Consolidation Rules

- Do not add a standalone impact section. Metrics stay attached to the relevant work.
- Remove homepage tag clouds and repeated card borders where they do not add meaning.
- Consolidate the service grid and AI/Language Lab into the practice statement and an optional small lab link.
- Limit featured works to three on the homepage. Remaining credible credits belong in selected history.
- Keep the screening strip only as navigation; it must not repeat full descriptions or CTAs.
- Use one visual emphasis per viewport. Avoid simultaneous glow, edge reflection, scale, parallax, and text animation on the same element.

## Replaceable Media Contract

Add `data/media.json` as the source of truth for swappable public media.

```json
{
  "hero": {
    "background": "/assets/portfolio/hsin-working-white-space.jpg",
    "foreground": "",
    "focalPoint": "38% 72%",
    "alt": { "en": "Hsin-Hsin Yuan at work", "zh": "袁欣欣工作現場" },
    "treatment": "portrait-layered"
  }
}
```

Work media remains in each work's frontmatter but follows the same vocabulary: `posterImage`, `posterAlt`, `focalPoint`, and optional `foregroundImage`. Empty optional layers must degrade to an ordinary image without broken layout.

Image replacement must require editing data and copying an approved asset only. It must not require CSS changes. Recommended source sizes, crop safety zones, rights classification, and file validation belong in the reusable skill.

## Motion System

- Use native CSS transforms and requestAnimationFrame-based scroll progress; do not add a heavy 3D dependency.
- Hero copy moves at a lower rate than the portrait stage. Optional foreground media moves independently by a restrained amount.
- Featured work chapters use sticky media on desktop and normal document flow on mobile.
- Background color fields transition by section using CSS custom properties.
- Pointer glow is removed or reduced where it duplicates the new scroll lighting.
- `prefers-reduced-motion` disables all scroll-linked transforms and leaves every element visible.
- Initial HTML and CSS must be fully visible before JavaScript executes.

## Responsive And Performance Behavior

- Desktop: layered hero and sticky work media.
- Tablet: reduced translation distances, no pointer-reactive glow.
- Mobile: normal vertical flow, portrait crop controlled by data focal point, no sticky traps, and contact navigation remains visible.
- Use existing local JPG/MP4 assets. Do not introduce remote runtime dependencies.
- Lazy-load non-hero images and preserve dimensions/aspect ratios to reduce layout shift.

## Reusable Skill

Create `.agents/skills/build-cinematic-portfolio/` with:

- `SKILL.md`: intake, evidence classification, design translation, implementation, and validation workflow.
- `references/intake-schema.md`: required and optional user inputs.
- `references/media-contract.md`: replaceable-image schema, crop guidance, rights rules, and fallback behavior.
- `references/quality-gates.md`: content, motion, responsive, accessibility, privacy, and publishability checks.
- `scripts/validate_media_manifest.mjs`: deterministic validation of media paths, required bilingual alt text, focal points, and missing files.

The skill extends the existing `portfolio-narrative-builder` rather than duplicating its evidence and positioning guidance. During this project, any repeated failure or hidden assumption discovered in implementation must be converted into a concise rule or validator.

## Validation

- Node tests cover the media manifest, three featured works, removed duplicate homepage sections, and semantic fallbacks.
- Build succeeds with and without an optional foreground portrait.
- Desktop and mobile screenshots verify the hero, one work chapter, practice statement, and contact path.
- Browser checks confirm no horizontal scroll trap, no invisible initial content, inline showreel playback, and reduced-motion readability.
- Repository search confirms removed classes and labels do not survive in active generators, CSS, JavaScript, Figma outputs, or tests.

## Non-Goals

- No literal clone of Dream Machine.
- No WebGL scene, AI-generated replacement portrait, analytics, deployment, or new work-detail pages in this package.
- No publication of media whose rights status is unknown.
