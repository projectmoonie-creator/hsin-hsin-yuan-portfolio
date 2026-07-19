# Figma SVG Export — Editorial Watch Loop Hybrid

This package is generated from the portfolio's canonical site copy, media manifest, six work files, collaborations, and archive files.

## Files

- `01-desktop-home.svg` — complete desktop page in the approved hybrid order.
- `02-desktop-works-logos.svg` — five Watch Loop previews and all six editable work-row components.
- `03-mobile-home.svg` — complete mobile page; the Watch Loop is marked manual-scroll-only.
- `manifest.json` — canonical inputs, tokens, frame inventory, and item counts.

## Import

Drag the SVG files into Figma and ungroup them to edit text, shapes, borders, and image layers. For a richer editable reconstruction, run the local plugin in `figma/hsin-portfolio-importer`.

## Round trip

Do not edit generated copy or image paths as a second source of truth. Update `data/site.json`, `data/media.json`, `content/works/*.md`, `data/collaborations.json`, or `content/archive/*.md`, then run `npm run figma:export`.

Remote media stays a remote reference. A failed remote load is labeled in the importer; it is never silently replaced by a local image.
