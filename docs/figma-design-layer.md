# Figma Design Layer — Editorial Watch Loop Hybrid

## Role of this layer

Figma is the editable visual control layer for the active hybrid portfolio. The repository remains canonical for copy, media, work order, collaborations, and archive credits. GitHub and Vercel remain the production path; Figma does not publish or replace the website.

The active direction preserves the older site's useful split hero, content rhythm, and horizontal work preview, while applying the approved editorial palette, type hierarchy, rounded media frames, and restrained borders. The portrait-scene direction remains in its Git checkpoint and is not represented as the active homepage here.

## One canonical graph

```text
data/site.json ───────────────┐
data/media.json ──────────────┤
data/collaborations.json ─────┤
content/works/*.md ───────────┼─> scripts/build-figma-export.mjs
content/archive/*.md ─────────┘        ├─> figma-export/*.svg + manifest.json
                                      └─> importer code.js + manifest.json
```

The importer runtime lives in `figma/hsin-portfolio-importer/code.template.js`. The build inserts one generated `PORTFOLIO_MODEL` snapshot into that template. Do not add handwritten parallel `COPY`, `ASSETS`, `WORKS`, or logo lists.

The generated manifest carries a deterministic SHA-256 fingerprint of the canonical inputs. Two builds from unchanged sources must be byte-for-byte identical. Tests also mutate a canonical media role in an isolated fixture and require that the SVG, importer snapshot, and fingerprint all change together.

## Fixed information architecture

Desktop and mobile frames use this exact order:

1. Split Hero
2. Collaborations
3. Watch Loop
4. Availability
5. Selected Works
6. Collaboration Fit
7. Archive
8. Contact

Selected Works always contains these six rows in canonical order:

1. Slow Steps
2. Tech Dreamers
3. My Art, My Voice
4. Interior / Spatial Brand Films
5. PTS Taigi
6. Top Gear

The Watch Loop contains five previews. Slow Steps is an intentional text-first preview. Interior / Spatial Brand Films remains a Selected Works row but is not a Watch Loop preview.

## Active files and frames

Run:

```bash
npm run figma:export
```

The command writes:

- `figma-export/01-desktop-home.svg` — complete 1440-pixel desktop page
- `figma-export/02-desktop-works-logos.svg` — five preview and six work-row component inventory
- `figma-export/03-mobile-home.svg` — complete 390-pixel mobile page
- `figma-export/manifest.json` — sources, tokens, dimensions, counts, and fingerprint
- `figma/hsin-portfolio-importer/code.js` — generated runnable importer
- `figma/hsin-portfolio-importer/manifest.json` — generated media-domain permissions

Use the desktop plugin frame for 1440×900 and 1200×900 reviews. Use the mobile plugin frame for 390×844 and 360×800 reviews. Tablet review remains a website verification viewport; if a tablet-specific visual decision is needed, duplicate the desktop frame at 834×1112 and document the delta rather than creating another content source.

## Design tokens

| Role | Value | Use |
| --- | --- | --- |
| Stage | `#050807` | opening, Watch Loop, archive, footer-like surfaces |
| Fog | `#dddcd7` | muted field and quiet separation |
| Paper | `#f6f4ee` | primary editorial reading surface |
| Signal coral | `#f0645a` | documentary/directing markers |
| Signal cobalt | `#4867d9` | cross-cultural markers |
| Signal moss | `#4d9259` | editorial-system markers |

Display and interface text uses `Helvetica Neue`, with Arial/system fallbacks. Editorial accents use `Iowan Old Style` italic, with Baskerville/Times fallbacks. Signal colors stay small. Layout depends on spacing, crop, scale, flat borders, and rounded media frames rather than atmospheric effects.

## Media contract

Every replaceable media role should carry:

- semantic role and source path
- bilingual alt text
- desktop/mobile focal point when applicable
- intrinsic dimensions
- approved, text-first, or open-role status
- original remote reference when the source is remote

Local media is referenced through the configured site origin in the SVG/importer. Remote media remains its canonical remote URL. If Figma cannot load it, the importer creates a labeled reference; it must not silently substitute a local portrait, still, or another project's poster.

To replace an ordinary image:

1. add or replace the approved asset;
2. update only the canonical manifest/frontmatter role, alt, dimensions, and focal point;
3. run media validation and both builds;
4. confirm the site, SVG, and importer snapshot changed together;
5. review desktop and mobile crops.

## Figma-to-code handoff

For every approved Figma change, record:

1. frame name and review viewport;
2. affected section/component;
3. exact spacing, size, border, radius, crop, order, or copy change;
4. English, Chinese, or shared scope;
5. whether canonical data or only the visual owner changes.

Implement the smallest owning change. Do not repair generated SVG or `code.js` manually. Rebuild, run deterministic tests, then verify the website at desktop, tablet, mobile, reduced-motion, keyboard, and no-JavaScript paths.

## Guardrails

- No three-card work truncation: all six works remain visible.
- No active portrait carrier.
- No additional continuous movement beyond the Watch Loop.
- Mobile Watch Loop is always manual-scroll-only.
- No invented watch URL or poster for Slow Steps.
- No local replacement for canonical remote media.
- No generic service-card or standalone Lab section in the active homepage frame.
- No production deployment until the hybrid preview is explicitly approved.
