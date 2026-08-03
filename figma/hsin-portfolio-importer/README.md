# Hsin Portfolio Importer

Status: `LEGACY_REFERENCE_DO_NOT_USE`

This local plugin is an early, hardcoded partial reconstruction. It predates
the current design contract and must not be used as the current site reference
or as a source for implementation. It is not a bidirectional content importer
and does not write Figma edits back into portfolio data.

Use `npm run figma:export` and the generated `figma-export/` package for the
current normalized design handoff. The legacy plugin is retained only so old
Figma experiments remain reproducible.

It does not upload anything automatically to a Figma account. Run it inside Figma from a blank design file.

## Install

1. Open Figma desktop or Figma in the browser.
2. Create a blank design file.
3. Go to `Plugins > Development > Import plugin from manifest...`.
4. Select:

   `figma/hsin-portfolio-importer/manifest.json`

5. Run `Plugins > Development > Hsin Portfolio Importer`.

## What It Creates

- Design token swatches
- Desktop frame: `Desktop / Portfolio`
- Mobile frame: `Mobile / Portfolio`
- Editable text layers
- Editable section frames
- Editable work cards
- Editable logo wall wordmarks
- Image rectangles using Figma image fills loaded from the live Vercel site

## Limitations

- Photos are bitmap image fills. They can be cropped, resized, moved, or replaced, but not split into person/background layers.
- The generated design is a clean editable reconstruction, not a pixel-perfect HTML-to-Figma conversion.
- If image loading fails, the plugin leaves a labeled placeholder instead of stopping.

## Historical Workflow — Do Not Use For Current Reference

1. Run the importer in a blank Figma file.
2. Rename the file to `Hsin-Hsin Yuan Portfolio - Design Layer`.
3. Edit layout visually in Figma.
4. For implementation, export screenshots or share exact frame names and changes.
5. Sync approved changes back to `src/styles.css`, `data/site.json`, and content files.
