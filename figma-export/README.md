# Figma Scene Export

This package translates the active Hsin-Hsin Yuan portfolio into editable scene storyboards. Its signature is the portrait carrier: the person separates from the opening frame, stays anchored through three practice modes, then hands the page to the work theatre.

## Files

- `01-desktop-portrait-carrier.svg` — opening and release states with independent background, abstract, and foreground portrait layers.
- `02-desktop-practice-modes.svg` — Documentary direction, Cross-cultural story, and Editorial systems states.
- `03-desktop-work-theatre.svg` — three full-viewport work scenes, including the text-led Slow Steps treatment.
- `04-mobile-static-flow.svg` — the static stacked mobile reading path; mobile does not use sticky scene traps.
- `manifest.json` — scene inventory, active tokens, dimensions, and portrait media contract.

## Use In Figma

1. Drag the SVG files into Figma or choose `File > Place image/video`.
2. Ungroup each imported SVG to reach editable text layers, image layers, signal fields, rules, and scene labels.
3. Replace imagery by selecting its named media layer. Keep the foreground portrait separate from the background frame.
4. Review desktop scene states and the static stacked mobile frame together.
5. Sync approved decisions back to `data/media.json`, `data/site.json`, `content/works/*.md`, and `src/styles.css`.

## Boundaries

- The SVGs describe composition states; the website remains the production source of truth.
- Signal colors identify real practice modes and should stay local to their scene.
- Re-run `npm run figma:export` after changing portfolio media or copy.
- Photos are embedded for portability. Remote sources use a labeled replace-in-Figma media field.
