# Figma SVG Export

This folder is a free Figma import package for the Hsin-Hsin Yuan portfolio design layer.

## Files

- `01-desktop-home.svg` - desktop hero, logo strip, availability, and contact heading.
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
- Hero imagery comes from the same normalized `data/site.json.heroMedia` record as the website. Replace its source asset, source SHA-256, localized alt, intrinsic dimensions, and focal points there; sanitize the public JPEG, run `npm run hero:prepare`, then regenerate this package.
- Photos are embedded as image layers to keep the package portable.
- Text, rectangles, collaboration marks, cards, and color token swatches remain editable SVG layers, including editable text layers for fallbacks after import.
- This is a design control layer, not the production source of truth.

## Current Contract Map

The public order is Hero, Platforms & Collaborations, Screening Strip,
Available For, Featured Works, FROM THE ARCHIVE, Global Press, and Contact.

- Featured Works uses the named desktop variants `fill-card` and
  `centered-16x9`; every mobile media frame is 16:9.
- Hero is one non-interactive image component. The SVG records the approved
  animation's static starting crop; it has no Play or video layer.
- Platforms & Collaborations uses the complete canonical data order. Verified
  monochrome marks and visible text fallbacks share one named component family,
  with four desktop slots, two mobile slots, and a centered incomplete row.
- Source artwork may contain its own title, but the site adds no second title
  overlay.
- FROM THE ARCHIVE uses one standard Archive card family; missing media changes
  capability, not card size.
- Global Press is a separate text-only note family. Work Press may retain a
  verified thumbnail inside its project card.
