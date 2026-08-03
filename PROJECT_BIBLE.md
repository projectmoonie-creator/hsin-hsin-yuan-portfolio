# Hsin-Hsin Yuan Portfolio Bible

## Content Rules

- Do not move CV text directly into the site. First classify each line by function: identity, proof, role, service, warmth, metric, CTA, archive, or SEO.
- Remove content repetition when two sections do the same job. Keep repetition only when it serves a different scanning moment.
- Homepage copy should be scannable. Put detailed context in work cards, press cards, archive entries, or future detail pages.
- If a section is removed from the public layout, also remove or clearly mark its unused source fields. Do not leave old copy in data files where a future edit might accidentally revive it.
- If a section is removed from the website, check every parallel output layer too: generated HTML, source data, CSS/JS, tests, Figma export SVGs, Figma importer plugin code, docs that act as current specs, and review prompts. Historical review/spec files may mention old sections, but active generators must not recreate them.
- Before adding new copy, run a text consolidation pass: identify what the text proves, who it helps, whether it repeats an existing section, and where it belongs.

## Bilingual Voice

- English can carry the international positioning and fast hiring scan. Chinese should preserve precision, cultural nuance, and warmth.
- Partner, publisher, and platform labels must be localizable at the data source. English pages and English design handoffs should use the English label without leaking a Chinese wordmark; Chinese pages may preserve the official Chinese name. Historical source titles are exempt when the title itself is evidence.
- Do not translate press headlines or source titles too freely. If an English title is editorially translated from a Chinese source, keep it factual and close to the source.
- Keep homepage language concise. Move richer, warmer explanation into work details, press, archive, or future case-study pages.
- Treat the screening-strip tagline and Featured Work description as two
  different reading moments. The tagline should be one memorable invitation;
  the description should name the recognizable program type, subject, and
  contribution without reading like a production inventory.
- For English portfolio-grouping titles, use natural, searchable industry
  language. Do not publish literal internal category labels that an
  English-speaking viewer would not know to search.
- Elegance must remain evidence-led. Prefer concrete images, places, materials,
  and human stakes over adjective stacking, and do not introduce unsupported
  facts merely to make a work sound more cinematic.
- When only one language has been approved, change only that language and list
  the other language as an explicit follow-up rather than silently translating
  the new copy.

## Press Cards

- Press cards must represent the press source, not the portfolio project.
- Work Press remains optional structured data inside its Featured Work. Use a
  localized accessible label for the semantic group name; do not render a
  second visible field heading named `PRESS & INTERVIEWS`.
- A Work Press thumbnail card's visible `type` is its classification. Preserve
  card types, titles, sources, thumbnails, links, and audit metadata.
- Global Press is a separate page-level component and keeps its visible section
  heading; the hidden Work Press group name does not change that hierarchy.
- For any press/interview/news URL, first inspect source-page metadata: `og:title`, `og:image`, `og:description`, canonical URL, and JSON-LD when available.
- Use the source page's headline/title for the card title unless it is unusable or misleading.
- Use the source page's `og:image` or main article image for the thumbnail. Do not substitute a portfolio still or project photo by default.
- If the source page has no usable image, leave the card text-only or ask for a screenshot/local image. Do not silently invent or reuse unrelated artwork.
- Prefer linking to the canonical non-AMP URL when both AMP and canonical URLs exist.
- When adding press, record enough metadata to audit later: canonical URL, source name, title source, image source, and the date the metadata was checked.
- Every public press entry must include `canonicalUrl`, `titleSource`, `imageSource`, and `metadataCheckedAt`. Do not add a press card without those audit fields.

## Media Rights

- Public press thumbnails may be referenced by URL when the source page exposes them as public metadata.
- Do not download, crop, edit, or rehost third-party press images unless the user explicitly asks and rights are clear.
- Local portfolio images are for owned/project visuals, not replacements for press-source thumbnails.
- For a work card, an official broadcaster, platform, or production page image may be used as a remote thumbnail only when it clearly represents that work and is link-first, not rehosted.
- Treat public platform videos, YouTube, TaiwanPlus, broadcaster pages, and press pages as link/embed-first sources. Do not upload or rehost video unless music, image, and platform rights are clear.
- When the user approves a local portfolio still derived from a public video of her confirmed work, record the canonical source URL, exact timecode, output dimensions, focal point, and rights status. Keep the public watch destination attached to the work, and use only editorial crop/resize unless a generative edit is separately approved.
- If a remote image breaks, blocks hotlinking, or creates mixed-content issues, use a text-only press card or ask the user for a replacement image. Do not silently swap in an unrelated still.
- The showreel may use local footage only when the rights status is acceptable. If rights are uncertain, prefer a link-based or still-based reel until the user confirms.

## Private Evidence Boundary

- Private email, inbox search results, client messages, raw screenshots, phone numbers, addresses, and recipient lists must not be committed to this repo or included in generated output.
- Private evidence may confirm a publishable fact, but store only a redacted derived fact such as role, approximate date range, client/company name, and confidence.
- Do not publish a client, company, or credit reconstructed from private evidence until the user has approved the public wording.
- Treat the repository as public-risk even when it is currently private. Source-material docs and `sourceNote` fields must be redacted enough that an accidental public repo would not expose private messages, addresses, phone numbers, or unapproved credits.

## Work Navigation

- The screening strip is a visual index. It should stay lightweight: no explanatory heading unless needed and no duplicate action labels. Cards jump to the matching Featured Work by default. Use `watchLoopTarget: "watch"` only when the user explicitly wants that small card to open the public work page directly.
- Works enter the screening strip when they have a public `watchUrl`, an approved local `cardReelUrl`, or an explicitly supported external-only state.
- Keep one canonical public `watchUrl` per work whenever the small card, Featured Work image, and text CTA should share a destination. Add a separate media URL only when the destinations are intentionally different and that difference is covered by a regression test.
- Use `cardReelUrl` only for a silent, work-specific moving thumbnail, `cardReelPoster` for its static fallback, and `cardReelMode: "after-hold"` for explicit motion approval. A reel URL without the approved mode fails closed to the static poster. Approved reels begin only after the shared poster hold, play only while visible, and reset to the poster when they leave view. Cloned loop cards use `preload="none"`, and reduced-motion or no-JavaScript states remain usable as static cards.
- Keep each work-specific reel separate. Do not combine unrelated credits or program identities inside one thumbnail. The retained `showreel/interior-pts-reel/` assembly is an editorial spine for a future homepage showreel, not a source for either work card.
- Featured Works carries detail. The strip should preview; Featured Works should explain.
- Each work belongs to one public tier at a time: Featured Work, Archive, or unpublished source material. If a work is removed from Featured Works, move it deliberately to Archive or keep it out of the public site.
- `FROM THE ARCHIVE` is one descending chronology. Canonical `order` controls
  both DOM and visual reading order; `lead`, `supporting`, and text-only
  treatments may change card size but must not move an older work ahead of a
  newer one.
- On homepage Featured Work cards, the linked media image is the primary watch action. Do not normally repeat that destination with a text CTA.
- Approved Featured reels opt in only with canonical
  `featuredReelMode: "after-hold"`. Eligibility begins at 35% visibility; if
  multiple reels qualify, only the last visible reel in DOM order is active.
- Hold the canonical poster for 1.4 seconds after activation and keep it visible
  until the video actually emits `playing`. Leaving eligibility, hiding the
  page, a media error, or `pagehide` must cancel the hold, pause, seek to time
  zero, and restore the poster. A persisted BFCache restore must safely rebind
  observation.
- Featured reel videos are muted, looped, inline, `preload="none"`,
  pointer-transparent, and non-interactive. The existing media wrapper owns
  navigation. Reduced-motion and no-JavaScript states remain static posters.
- Existing Featured posters and external watch destinations are canonical.
  Slow Steps has no public destination and stays unlinked; do not invent one.
- A deliberate exception is allowed for a user-curated full-series playlist that gathers fragmented episodes or a substantial body of related work. Mark it with `watchMode: "series"` and `showWatchCta: true`, use "Watch the full series" / "觀看完整系列", and protect the exact count and destinations with regression tests. Do not enable this exception for a single episode, trailer, representative segment, or ordinary program page.
- Do not use the global coming-soon label for every work without a `watchUrl`. Completed or in-progress collections need their own truthful `statusLabel`, such as "Selected reel" / "精選短片" once a public card reel exists.
- Keep the homepage clean. If a work has trailers, press, full episodes, metrics, and many related links, move deeper material into a future detail page.

## Proof And Metrics

- Treat metrics as canonical proof points. When adding views, reach, screenings, awards, or press, record the source and confidence in the content file or source-material note.
- Do not create a standalone homepage "Selected Impact" section. Metrics should travel with the work, archive item, press item, or detail page that gives them context.
- Metrics must have context. A number without the project, platform, date range, or role it belongs to reads as loose self-promotion and should not stand alone.
- Do not inflate or round metrics beyond the source. If a number is approximate, label it as approximate in the publishable copy.
- Work cards may use concise proof; longer evidence, uncertain credits, and source trails belong in source-material docs or future detail pages.

## Visual Direction

- The canonical current layout and component-format rules live in
  `docs/design-contract.md`. Intentional differences require a named variant,
  responsive behavior, fallback, regression evidence, and rollback. Historical
  concepts and dated reviews do not override that contract.
- Governance/refactor packages for an approved layout must first freeze a
  public-output baseline. A compatibility migration is not complete while it
  changes generated HTML, CSS, JavaScript, or matched browser geometry without
  separate visual approval.
- Before implementing a design reference, translate it into project-specific rules: what to borrow, what to avoid, which parts serve the portfolio goal, and how it should behave on desktop and mobile.
- Do not copy a reference site's surface style literally when the user's content needs another rhythm. Use references to derive decisions about typography, spacing, motion, image treatment, logo treatment, and section order.
- Motion should guide attention without becoming a second product. Subtle ambient light is acceptable only when it preserves readability, keeps the site fast, and is verified on mobile.
- The moving work strip may use subtle black edge gradients, but they must stay fixed on a non-scrolling outer frame. Never attach edge-fade pseudo-elements to the scrollable viewport or moving track.
- If a work has no approved image, use an explicit placeholder or text-first layout. Do not borrow an unrelated project still just to fill a card or design export.
- Design-layer artifacts must follow the same content rules as the live site. Figma SVG exports and importer plugins are not allowed to reintroduce removed sections, old metrics, or borrowed images.

## Detail Pages

- Future detail pages should use `/en/works/<slug>/` and `/zh/works/<slug>/` with canonical and hreflang generated from `SITE_ORIGIN`.
- A work earns a detail page when it has more than two press items, more than one public watch/source link, or enough case-study detail that the homepage card becomes dense.
- Homepage work cards should keep the role, short description, key metrics, press preview, and at most one primary media link or no-watch status. Trailers, full episode lists, source trails, extended notes, and dense proof belong on detail pages.

## Contact And Deployment

- Contact form secrets, email provider keys, Vercel tokens, and domain verification values must stay in environment variables, never in source files.
- Until a custom domain is confirmed, Vercel's project domain is acceptable. Do not assume a domain purchase is required.
- Contact copy should invite real work inquiries without exposing a direct email address by default.
- Mobile navigation must keep a path to Contact visible at 820px and below. The portfolio is a hiring supplement, so the conversion route cannot disappear on phones.
- Canonical URLs, Open Graph URLs, `robots.txt`, and `sitemap.xml` must come from the same `SITE_ORIGIN` build value. Do not keep a second hardcoded sitemap or robots file in `public/`.
- `dist/` is generated build output for Vercel and must stay ignored by git. Commit source files, not generated pages or copied assets.

## Roadmap Discipline

- Separate the fast prototype from the refined portfolio. A strong first version is allowed to be rough, but every later iteration should declare which layer it is changing: content, IA, visual system, media/showreel, interaction, SEO, contact, deployment, or design handoff.
- Use work packages instead of open-ended polishing. Each package should have a short goal, affected files, non-goals, validation steps, and a rollback path.
- Suggested roadmap order for this site: stabilize content and public claims; refine visual system and motion; add work detail pages for dense projects; replace temporary media with approved images/video; improve SEO/social previews; add analytics only when the user wants behavior data; then package the workflow as a reusable skill/service.
- External reviewers such as Claude Code or Gemini should first produce findings, not edit the repo directly, unless the change scope is mechanical and approved.

## Phase Closeout And Cold Resume

- `STATUS.md` is the only mutable entry point for the current project state. A new session reads it after `AGENTS.md` and this Bible instead of depending on chat history.
- A phase closeout reviews one declared baseline; it does not claim that the portfolio can never be revised again.
- Use `PASS`, `PASS_WITH_OPEN_ITEMS`, or `BLOCKED`. Known aesthetic refinements may move to the next phase, but truth, privacy, rights, functional, deployment, and unpushed-work blockers may not.
- Every formal closeout records the reviewed branch and commit, preview/production state, deterministic and visual evidence, external-review use or skip reason, accepted open items, and one exact next action in a dated file under `docs/reviews/`.
- A substantial closed phase receives a named Git tag after the closeout package is committed. Push the branch and tag, then read back the remote tips.
- Before declaring closeout complete, answer: "What changed in this phase that is not in a repository, durably backed up, or pushed?" Any remaining item must be listed as a risk.
- Begin the next phase as a bounded work package from the recorded checkpoint. Do not rewrite historical closeout reports.

## QA Checklist

- After content or layout changes, run `npm test`.
- After removing or renaming a public section, run a repo search for the old label, CSS classes, data file names, generator functions, Figma importer code, Figma export files, and tests. Confirm remaining hits are only historical docs or negative regression tests.
- For visual changes, inspect desktop and mobile widths before pushing.
- Check that the hero starts at the top on refresh, the showreel plays inline, the screening strip loops without a visible blank gap, and Featured Works remains reachable.
- Check that press thumbnails come from press metadata or approved replacements.
- Check that no private source material appears in generated output.
