# Figma Design Layer

This document defines the Figma layer for Hsin-Hsin Yuan's portfolio site. It is the visual control layer above the codebase, not a replacement for the current GitHub + Vercel deployment.

## Purpose

Use Figma to make layout, typography, image crop, spacing, and mobile/desktop decisions visually. Keep the website code as the production source.

The workflow is:

1. Design or adjust sections in Figma.
2. Confirm desktop and mobile frames.
3. Translate approved changes back into `src/styles.css`, `data/site.json`, and content files.
4. Run `npm test` and `npm run build`.
5. Deploy through GitHub + Vercel.

## Figma File Structure

Create one Figma file named:

`Hsin-Hsin Yuan Portfolio - Design Layer`

Use these pages:

1. `00 Cover`
2. `01 Current Site Reference`
3. `02 Design System`
4. `03 Desktop Layouts`
5. `04 Mobile Layouts`
6. `05 Components`
7. `06 Content Map`
8. `07 Experiments`

## Frame Sizes

Use these core frames first:

- Desktop: `1440 x 1200`
- Laptop: `1200 x 1000`
- Tablet: `834 x 1112`
- Mobile: `390 x 844`
- Small mobile: `360 x 800`

Every major page decision should have at least:

- One desktop frame
- One mobile frame

## Current Site Sections

Map the Figma frames to the current site sections:

1. `Topbar`
2. `Hero`
3. `Platforms & Collaborations`
4. `Screening Strip`
5. `Available For`
6. `Featured Works`
7. `Who Should Contact Me`
8. `AI / Language Lab`
9. `Selected Archive`
10. `Contact`

## Design Tokens

Mirror the current CSS tokens in Figma variables.

### Colors

| Token | CSS | Figma variable | Value |
| --- | --- | --- | --- |
| Background | `--bg` | `color/bg` | `#0B0B0C` |
| Ink | `--ink` | `color/ink` | `#F7F2E8` |
| Muted | `--muted` | `color/muted` | `#B8B0A3` |
| Line | `--line` | `color/line` | `rgba(247, 242, 232, 0.18)` |
| Panel | `--panel` | `color/panel` | `rgba(255, 255, 255, 0.055)` |
| Panel strong | `--panel-strong` | `color/panel-strong` | `rgba(255, 255, 255, 0.095)` |
| Acid | `--acid` | `color/accent-acid` | `#D8FF3E` |
| Heat | `--heat` | `color/accent-heat` | `#FF4D1F` |
| Blue | `--blue` | `color/accent-blue` | `#7CC7FF` |

### Typography

Use:

- Primary Latin: `Inter`
- Traditional Chinese fallback: `Noto Sans TC` or `PingFang TC`

Core text styles:

- `Display/Hero`: uppercase, heavy weight, tight line height
- `Title/Section`: 12px, uppercase, bold, accent color
- `Body/Large`: 18-22px, medium line height
- `Body/Base`: 15-17px
- `Meta`: 12px, uppercase, bold
- `Card/Title`: 24-40px, bold

Important rule:

Do not rely on viewport-scaled typography alone. Check actual mobile frames for text overflow.

## Components

Create these Figma components:

### `Topbar`

Variants:

- Desktop
- Mobile
- English
- Chinese

Editable properties:

- Brand text
- Nav labels
- Language switch

### `Hero`

Variants:

- Desktop right-text
- Desktop alternate
- Mobile stacked
- Chinese copy

Required controls:

- Image crop position
- Hero title size
- Role line breaks
- Slash accent color
- CTA spacing

Current hero copy:

```text
HSIN-HSIN
YUAN
Documentary Director / Writer / Producer
/ Cross-Cultural Storyteller
```

Chinese role copy:

```text
紀錄片導演 / 編劇 / 製作人
/ 跨文化敘事者
```

### `Logo Wall`

Variants:

- Desktop strip
- Mobile wrap

Rules:

- No boxes
- No visible card backgrounds
- No heavy borders
- Logos follow page background
- Monochrome / muted treatment unless the specific logo needs color

### `Featured Work Card`

Variants:

- With image
- With video embed
- Coming soon
- Desktop compact card
- Mobile full-width card

Content fields:

- Year / role / platform
- Title
- Tagline
- Description
- Tags
- Metrics
- Case study: Challenge / What I shaped / Best for
- CTA

### `Info Card`

Used for:

- Who Should Contact Me
- Work With Me
- AI / Language Lab

Variants:

- 4-up desktop
- 2-up tablet
- 1-up mobile

### `Impact Metric`

Fields:

- Value
- Label
- Detail

### `Archive Row`

Fields:

- Year / role / platform
- Title
- Metrics

### `Contact Block`

Fields:

- Headline
- Subcopy
- CTA
- Email / links

## Content Sources

Figma should not become the source of truth for final text. Final content lives here:

- Site copy: `data/site.json`
- Metrics live with the work or archive item they explain. There is no standalone Selected Impact section.
- Collaborations: `data/collaborations.json`
- Featured works: `content/works/*.md`
- Archive: `content/archive/*.md`
- Lab: `content/lab/*.md`

Use Figma for layout and short copy experiments. Once approved, sync final text back to the repo.

## Handoff Rules

When a Figma change should be implemented, capture:

1. Figma frame name
2. Desktop frame screenshot
3. Mobile frame screenshot
4. Exact component/section affected
5. What changed:
   - spacing
   - font size
   - color
   - image crop
   - order
   - copy
6. Whether it affects English, Chinese, or both

Implementation should update the smallest possible set of files.

## Figma Setup Prompt

Paste this into Figma Make, Figma AI, or Claude Code if it has access to screenshots/assets:

```text
Create a Figma design layer for an international documentary director portfolio.

The site belongs to Hsin-Hsin Yuan, a documentary director / writer / producer / cross-cultural storyteller. The design should feel international, editorial, cinematic, and professional enough for cultural institutions, platforms, producers, artists, and brand/factual video clients.

Use a dark background, cream text, acid green accent, restrained orange/blue secondary accents, large editorial typography, strong image-led layouts, compact but premium work cards, and a borderless monochrome logo wall.

Create desktop and mobile frames for:
1. Hero
2. Logo wall
3. Screening strip
4. Available For
5. Featured Works
6. Who Should Contact Me
7. AI / Language Lab
8. Archive
9. Contact

Do not create a generic landing page. This is a real portfolio site for work inquiries.

Hero text:
HSIN-HSIN
YUAN
Documentary Director / Writer / Producer
/ Cross-Cultural Storyteller

The slash marks should use the acid green accent.

Prioritize:
- mobile readability
- professional first impression
- clear contact path
- easy scanning of work proof
- image crops that do not hide the subject
- enough control for later manual layout adjustment

Create reusable components and name layers clearly so the design can be translated back into HTML/CSS.
```

## Code Sync Checklist

Before implementing a Figma change:

- Confirm whether the change is visual, content, or structure.
- Confirm desktop and mobile frames both exist.
- Check whether Chinese copy needs a separate layout adjustment.
- Update source files, not only `dist/`.
- Run `npm test`.
- Run `npm run build`.
- Commit with a focused message.

## Migration Decision

Do not migrate to Framer, Webflow, or Figma Sites until the Figma design layer has stabilized.

Review migration only if:

- You want to edit production layout directly without code most of the time.
- Portfolio content will change weekly.
- You need a CMS interface for non-technical editing.
- You are willing to trade GitHub/Vercel control for platform convenience.

For now, Figma is the design control layer; GitHub + Vercel remains production.
