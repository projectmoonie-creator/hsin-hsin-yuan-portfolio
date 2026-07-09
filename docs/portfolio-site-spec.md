# Hsin-Hsin Yuan Portfolio Website Spec

## Goal

Build a concise, modern, bilingual portfolio website for Hsin-Hsin Yuan as a creator/director and production collaborator. The site should feel like a quiet, cinematic advertisement: strong opening copy, minimal text, embedded or linked video spaces, and a horizontal featured works section inside an otherwise vertical page.

## Audience

Potential clients, platforms, brands, cultural institutions, collaborators, and international production partners.

## Positioning

This is not a CV site. It introduces Hsin-Hsin Yuan and her creative work as a documentary director, writer, producer, and cross-cultural storyteller.

Core line:

- EN: "See the person. Hear the moment. Film the world in motion."
- ZH: "看見人。聽見時代。拍下正在改變的世界。"

## Page Structure

1. Hero
2. Horizontal featured works gallery
3. What we create
4. Approach
5. Platforms and collaborations
6. Contact

## Visual Direction

- Dark cinematic background
- White and muted gray text
- One restrained accent color
- Large typography and short copy
- Slow fade/slide motion
- Works section scrolls horizontally
- Mobile remains vertical overall, with horizontally swipeable works

## Content Management

Markdown-first. Works live in `content/works/*.md`. Site copy lives in `data/site.json`. Collaborations live in `data/collaborations.json`. No backend for v1.

## Video Behavior

Each work reserves a 16:9 media area.

- `available`: show iframe embed if `videoEmbedUrl` exists
- `external-only`: show poster/placeholder with watch link
- `coming-soon`: show cinematic coming-soon frame

## Deployment

Static site output in `dist/`. Can be deployed to Netlify, Vercel, or Cloudflare Pages using `npm run build` and publish directory `dist`.

