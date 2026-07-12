# Hsin-Hsin Yuan Portfolio Bible

## Content Rules

- Do not move CV text directly into the site. First classify each line by function: identity, proof, role, service, warmth, metric, CTA, archive, or SEO.
- Remove content repetition when two sections do the same job. Keep repetition only when it serves a different scanning moment.
- Homepage copy should be scannable. Put detailed context in work cards, press cards, archive entries, or future detail pages.
- If a section is removed from the public layout, also remove or clearly mark its unused source fields. Do not leave old copy in data files where a future edit might accidentally revive it.
- Before adding new copy, run a text consolidation pass: identify what the text proves, who it helps, whether it repeats an existing section, and where it belongs.

## Bilingual Voice

- English can carry the international positioning and fast hiring scan. Chinese should preserve precision, cultural nuance, and warmth.
- Do not translate press headlines or source titles too freely. If an English title is editorially translated from a Chinese source, keep it factual and close to the source.
- Keep homepage language concise. Move richer, warmer explanation into work details, press, archive, or future case-study pages.

## Press Cards

- Press cards must represent the press source, not the portfolio project.
- For any press/interview/news URL, first inspect source-page metadata: `og:title`, `og:image`, `og:description`, canonical URL, and JSON-LD when available.
- Use the source page's headline/title for the card title unless it is unusable or misleading.
- Use the source page's `og:image` or main article image for the thumbnail. Do not substitute a portfolio still or project photo by default.
- If the source page has no usable image, leave the card text-only or ask for a screenshot/local image. Do not silently invent or reuse unrelated artwork.
- Prefer linking to the canonical non-AMP URL when both AMP and canonical URLs exist.
- When adding press, record enough metadata to audit later: canonical URL, source name, title source, image source, and the date the metadata was checked.

## Media Rights

- Public press thumbnails may be referenced by URL when the source page exposes them as public metadata.
- Do not download, crop, edit, or rehost third-party press images unless the user explicitly asks and rights are clear.
- Local portfolio images are for owned/project visuals, not replacements for press-source thumbnails.
- Treat public platform videos, YouTube, TaiwanPlus, broadcaster pages, and press pages as link/embed-first sources. Do not upload or rehost video unless music, image, and platform rights are clear.
- If a remote image breaks, blocks hotlinking, or creates mixed-content issues, use a text-only press card or ask the user for a replacement image. Do not silently swap in an unrelated still.
- The showreel may use local footage only when the rights status is acceptable. If rights are uncertain, prefer a link-based or still-based reel until the user confirms.

## Private Evidence Boundary

- Private email, inbox search results, client messages, raw screenshots, phone numbers, addresses, and recipient lists must not be committed to this repo or included in `dist/`.
- Private evidence may confirm a publishable fact, but store only a redacted derived fact such as role, approximate date range, client/company name, and confidence.
- Do not publish a client, company, or credit reconstructed from private evidence until the user has approved the public wording.

## Work Navigation

- The screening strip is a visual index. It should stay lightweight: no explanatory heading unless needed, no duplicate action labels, and cards jump to the matching Featured Work.
- Works enter the screening strip only when they have a public `watchUrl`.
- Featured Works carries detail. The strip should preview; Featured Works should explain.
- For single films or episodes, use "Watch the full episode" / "觀看完整單集". For multi-episode series, use "Watch the series" / "觀看完整系列". For a curated group, use "Watch selected films" / "觀看精選影片".
- Keep the homepage clean. If a work has trailers, press, full episodes, metrics, and many related links, move deeper material into a future detail page.

## Contact And Deployment

- Contact form secrets, email provider keys, Vercel tokens, and domain verification values must stay in environment variables, never in source files.
- Until a custom domain is confirmed, Vercel's project domain is acceptable. Do not assume a domain purchase is required.
- Contact copy should invite real work inquiries without exposing a direct email address by default.

## QA Checklist

- After content or layout changes, run `npm test`.
- For visual changes, inspect desktop and mobile widths before pushing.
- Check that the hero starts at the top on refresh, the showreel plays inline, the screening strip loops without a visible blank gap, and Featured Works remains reachable.
- Check that press thumbnails come from press metadata or approved replacements.
- Check that no private source material appears in `dist/`.
