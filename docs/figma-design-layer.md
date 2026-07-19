# Figma Design Layer

This Figma layer is a storyboard for the active portrait-carrier portfolio, not a second source of production truth. It exists to review the opening frame, portrait release, practice-mode changes, work-theatre scenes, image crops, and the static mobile reading path before translating approved decisions back into the website.

## Source Of Truth

Final content and media remain in the repository:

- Portrait and practice media: `data/media.json`
- English and Chinese site copy: `data/site.json`
- Selected work: `content/works/*.md`
- Layout and scene styling: `src/styles.css`
- Scroll-state mapping: `src/scene-state.js`

Figma may hold visual experiments and annotations, but approved copy or media changes must be synced back to those files.

## Active Scene Architecture

### Portrait carrier

The portrait is a real foreground layer, independent from the opening image frame.

1. `Opening · 0–25%`: Stage surface, rounded background frame, foreground person, name, role, and navigation.
2. `Release · 25–48%`: the background frame shrinks, the surface changes to Fog, and the person remains anchored outside the frame.
3. `Practice · 48–78%`: the foreground person remains stable while signal color, copy, and two project stills change.
4. `Handoff · 78–100%`: the portrait scene recedes before the dark work theatre takes over.

Keep these media layers separately named and replaceable:

- `Opening frame / Background media`
- `Replaceable abstract layer`
- `Foreground portrait / Opening`
- `Foreground portrait / Release`

Do not merge the portrait into the background image. That would remove the selected B treatment and make later image replacement brittle.

### Practice modes

Practice modes describe real areas of work, not decorative product states:

- `Documentary direction` — coral signal
- `Cross-cultural story` — cobalt signal
- `Editorial systems` — moss signal

Each mode must show one primary still, one supporting still, a short verb, a title, and concise body copy. The person remains in the same visual anchor while the other layers change.

### Work theatre

The work theatre contains three full scenes:

1. `Slow Steps` — deliberate text-led field until approved project imagery exists.
2. `Tech Dreamers` — one dominant production image plus one supporting still.
3. `My Art, My Voice` — one dominant performance still plus one supporting still.

Each scene has one dominant proof, concise role/context, and one action. Do not reduce the three scenes to a grid of small browsing cards.

### Mobile

Mobile is an ordinary stacked reading path. It contains the portrait opening, release copy, three practice chapters, three work chapters, and contact. It does not simulate the desktop sticky duration.

## Design Tokens

Mirror these values in Figma variables and generated SVGs:

| Role | CSS token | Figma variable | Value |
| --- | --- | --- | --- |
| Opening and theatre | `--stage` | `color/stage` | `#050807` |
| Light scene | `--fog` | `color/fog` | `#dddcd7` |
| Reading surface | `--paper` | `color/paper` | `#f6f4ee` |
| Documentary signal | `--signal-coral` | `color/signal-coral` | `#f0645a` |
| Cross-cultural signal | `--signal-cobalt` | `color/signal-cobalt` | `#4867d9` |
| Editorial-systems signal | `--signal-moss` | `color/signal-moss` | `#4d9259` |

Signal colors belong to local glows, active markers, and small metadata. They are not persistent headline decoration.

## Typography

- Interface and display: `Helvetica Neue`, then `Arial` or a local sans-serif fallback.
- Editorial accent: `Iowan Old Style`, `Baskerville`, or `Times New Roman` italic.
- Traditional Chinese: `PingFang TC`, `Noto Serif TC`, and system fallbacks, preserving the sans/serif role split.
- Metadata: small sans-serif text in ordinary case with restrained spacing.

Use mixed case. Reserve the italic serif for one meaningful phrase or verb in a scene. The design should not depend on global uppercase or extreme letter spacing.

## Generated SVG Package

Run:

```bash
npm run figma:export
```

The command recreates `figma-export/` with:

- `01-desktop-portrait-carrier.svg`
- `02-desktop-practice-modes.svg`
- `03-desktop-work-theatre.svg`
- `04-mobile-static-flow.svg`
- `manifest.json`
- `README.md`

Drag the SVG files into Figma and ungroup them. Text, shapes, signal fields, rules, and media layers remain named and editable. Local photos are embedded so the package can travel without separate asset uploads.

The manifest records frame dimensions, tokens, and the portrait requirement. If the treatment is `portrait-carrier`, a missing `foregroundCutout` must stop generation rather than silently falling back to a flat hero.

## Local Importer Plugin

Install `figma/hsin-portfolio-importer/manifest.json` as a Figma development plugin, then run `Hsin Portfolio Importer` in a blank design file.

It creates these pages:

1. `02 Scene Tokens`
2. `03 Portrait Carrier`
3. `04 Practice Modes`
4. `05 Work Theatre`
5. `06 Mobile Static`

The importer loads image fills from the deployed portfolio URL. If an image request fails, it leaves the media path visible on the layer so the image can be replaced without blocking the rest of the import.

## Image Replacement Workflow

For a durable website change:

1. Put the approved asset in `public/assets/portfolio/`.
2. Change only the corresponding named path in `data/media.json` or the relevant work frontmatter.
3. Preserve bilingual alt text and review focal points.
4. Run the media validator and site tests.
5. Run `npm run figma:export` again.
6. Check the portrait, background frame, practice stills, and mobile crop independently.

For a Figma-only experiment, select the named image rectangle and replace its fill. Record the final source path when handing the decision back to code.

The foreground portrait should use a transparent image and a fit-style crop. Backgrounds and project stills usually use a fill-style crop. Never flatten those roles into one bitmap merely to match a single desktop screenshot.

## Frame Sizes

Core production review sizes:

- Desktop scene state: `1440 × 900`
- Laptop spot check: `1200 × 900`
- Tablet flow: `834 × 1112`
- Mobile flow: `390 × 844` viewport, documented in one tall stacked frame
- Small mobile spot check: `360 × 800`

Review at least one desktop state from every phase and the complete mobile reading path.

## Handoff Contract

For every approved Figma change, record:

1. Exact page and frame name
2. Scene state or mobile chapter
3. Screenshot at the relevant viewport
4. Layer names affected
5. Exact change to spacing, type, color, image crop, order, or copy
6. Whether English, Chinese, or both require adjustment
7. Source file that should receive the change

After implementation, run:

```bash
npm test
npm run build
npm run figma:export
```

## Visual Acceptance Gate

Before approving or publishing a Figma pass:

- The foreground portrait is visibly independent from the opening frame.
- Opening and release are materially different compositions.
- All three practice modes have distinct signal/media states while retaining the same person anchor.
- The work theatre reads as three immersive scenes, not the previous dense card system.
- Slow Steps has an intentional text-led state rather than a generic missing-image placeholder.
- Mobile remains readable without sticky interactions.
- No legacy neon accent, ambient shader language, carousel strip, glass contact panel, or old left-image/right-copy hero survives.
- A side-by-side comparison cannot plausibly be mistaken for the old site.

## Reusable Figma Brief

```text
Build an editable Figma scene layer for Hsin-Hsin Yuan, a documentary director, writer, producer, and cross-cultural story partner.

The signature is a portrait carrier. A real transparent foreground portrait begins inside a rounded black media frame, separates from that frame as the surface becomes light, remains anchored through three professional practice states, then hands off to a dark three-scene work theatre.

Use Stage #050807, Fog #dddcd7, Paper #f6f4ee, documentary coral #f0645a, cross-cultural cobalt #4867d9, and editorial-systems moss #4d9259. Use mixed-case sans-serif display text and one restrained italic serif accent per scene.

Create editable frames for:
1. Portrait carrier / Opening
2. Portrait carrier / Release
3. Practice mode / Documentary direction
4. Practice mode / Cross-cultural story
5. Practice mode / Editorial systems
6. Work theatre / Slow Steps
7. Work theatre / Tech Dreamers
8. Work theatre / My Art, My Voice
9. Mobile / Static stacked flow

Keep foreground portrait, background frame, abstract layer, primary still, and supporting still as separately named media layers. Make later image replacement possible without changing layout code. Avoid generic landing-page cards and scattered decorative effects.
```
