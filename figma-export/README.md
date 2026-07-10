# Figma SVG Export

This folder is a free Figma import package for the Hsin-Hsin Yuan portfolio design layer.

## Files

- `01-desktop-home.svg` - desktop hero, logo strip, and about section.
- `02-desktop-works-logos.svg` - compact work cards and logo wall.
- `03-mobile-home.svg` - mobile home reference frame.

## How To Use

1. Open your Figma file.
2. Drag the SVG files into Figma, or use `File > Place image/video`.
3. Select an imported SVG and ungroup if needed.
4. Edit text layers, move sections, tune spacing, and annotate decisions.
5. Send approved changes back into the website repo, especially `src/styles.css`, `data/site.json`, and `content/works/*.md`.

## Notes

- The SVGs are generated from current site content, so re-run `npm run figma:export` after major content changes.
- Photos are embedded as image layers to keep the package portable.
- Text, rectangles, logo wordmarks, cards, and color token swatches remain editable SVG layers, including editable text layers after import.
- This is a design control layer, not the production source of truth.
