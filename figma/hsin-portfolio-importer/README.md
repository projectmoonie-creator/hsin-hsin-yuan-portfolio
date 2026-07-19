# Hsin Portfolio Importer

This local Figma plugin creates editable desktop, mobile, and token pages for the active **Editorial Watch Loop Hybrid** portfolio direction.

The plugin is generated from repository data. It does not contain a second handwritten set of site copy, assets, logos, or works.

## Rebuild before importing

```bash
npm run figma:export
```

That command reads:

- `data/site.json`
- `data/media.json`
- `data/collaborations.json`
- all six `content/works/*.md` files
- `content/archive/*.md`

It inserts one canonical snapshot into `code.template.js` and writes the runnable `code.js`. Edit the template for importer behavior; never edit generated `code.js` by hand.

## Install and run

1. Open a blank Figma design file.
2. Choose `Plugins > Development > Import plugin from manifest...`.
3. Select `figma/hsin-portfolio-importer/manifest.json`.
4. Run `Plugins > Development > Hsin Portfolio Importer`.

The plugin creates:

- `02 Design System / Hybrid`
- `03 Desktop Layouts / Hybrid`
- `04 Mobile Layouts / Hybrid`
- the split showreel hero
- seven collaboration names
- five Watch Loop previews
- six full Selected Works rows
- Availability, Collaboration Fit, Archive, and Contact sections

Mobile uses a clipped manual-scroll reference for the Watch Loop. Desktop labels the same content as the calm loop reference.

## Media behavior

- Local paths are loaded from the configured production preview origin.
- Remote paths are passed to Figma unchanged from canonical work data.
- If a remote image cannot load, the plugin leaves a labeled remote-reference layer.
- Empty roles remain explicit `text-first` or `media role open` layers.
- The importer never borrows another project's image as a fallback.
- Every media rectangle stores canonical source, status, and focal-point values as plugin data.

## Round trip

Figma is the visual decision layer, not the content database. After a visual decision is approved, record the frame, viewport, affected section, exact spacing/type/crop change, and language scope. Apply the change to the smallest canonical source or website owner, rebuild both site and Figma outputs, then run the complete test suite.

Ordinary image replacement should change only the asset and canonical media fields. Rebuilding must update the site, SVG export, and importer snapshot together.
