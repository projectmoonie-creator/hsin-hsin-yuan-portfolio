# Annotated Content Trim v1 — Design

Date: 2026-08-03  
Approved reference: the creator's six annotated mobile screenshots and written
instructions supplied on 2026-08-03.

## Goal

Reduce repeated or contextless information without changing the portfolio's
established visual identity. Keep evidence only where it helps a hiring reader
understand the work.

## Content contract

### Hero

- Keep the two role lines.
- Remove the leading slash before `Cross-Cultural Storyteller` and the matching
  Chinese line because the line break already supplies the hierarchy.

### Design & Brand Films

- Remove the `20+ / public links archived` metric.
- Keep `LG / Samsung / brand contexts`.
- Remove the passive `Selected reel` status badge.
- Keep the playlist destination and rename the primary action to `Watch
  selected reel` / `觀看精選短片`.

### Nothing by Bus

- Keep only `travel factual`, `Taiwanese`, and `local culture` tags.
- Remove the `3+` and `PTS` metric tiles.
- Preserve the full-series playlist action.

### Top Gear China: UK Special

- Keep the four-number proof block.
- Add one quiet context line identifying the numbers as Season 2 audience data,
  not the UK Special episode alone.
- Clarify the labels using the public contemporary report: the first five
  Season 2 episodes accumulated more than 200M viewers across television and
  online; the weekly live average was 9M; the show ranked first nationally in
  its time slot for four weeks. Keep `0.81` explicitly labelled as a reported
  TV rating because that value remains sourced from the creator's résumé.

### Archive

- Remove the decorative external-link arrow glyphs from all Archive actions.
- Keep every action label, destination, link boundary, and visible focus state.

### Press

- Keep only the verified upper-half Women Make Waves record.
- Remove the lower-half companion link completely from active data and output.
- Use `PRESS` as the section heading in both language versions.
- Remove the section description and the decorative arrow glyph.
- Preserve the text-first treatment, source metadata, public link, and keyboard
  focus.

## Visual contract

- Preserve the current `#0b0b0c` background, `#f7f2e8` ink, `#b8b0a3` muted
  text, `#d8ff3e` accent, Inter/Noto Sans TC type system, hairlines, card shape,
  spacing, and responsive breakpoints.
- The work is subtractive: no new color, typeface, animation, icon, shadow, or
  component.
- Render the Top Gear metric context as muted utility text immediately above
  the four metrics.
- A one-item Press section retains the 40/60 desktop rhythm and one-column
  mobile layout.

## Data and rendering

- Canonical content stays in `data/site.json`, `data/press.json`, and the three
  affected work Markdown files.
- `scripts/build-site.mjs` reads an optional localized `watchLabel` and optional
  localized `metricsContext` instead of hardcoding the requested exceptions.
- Figma exports continue to derive hero role lines and work tags from the same
  canonical data.

## Validation

- Add regression tests before changing production data or renderer code.
- Prove removed labels, metrics, Press entry, and arrow glyphs are absent.
- Prove retained links, the `LG / Samsung` metric, the Nothing by Bus playlist,
  all four Top Gear values, and Tech Dreamers' official entry remain present.
- Run the full test/build/Figma suite and the portfolio viewport matrix before
  replacing the current Vercel Preview. Production remains untouched.

## Non-goals

- No rewrite of other Featured Works or Chinese descriptions.
- No Archive reorder or media change.
- No new interview image.
- No production deployment, branch push, merge, tag, or deletion of the
  protected untracked review file.
