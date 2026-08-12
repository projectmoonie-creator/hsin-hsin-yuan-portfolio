# Hsin-Hsin Yuan Portfolio Bible

## Content Rules

- Do not move CV text directly into the site. First classify each line by function: identity, proof, role, service, warmth, metric, CTA, archive, or SEO.
- Remove content repetition when two sections do the same job; keep it only when it serves a different scanning moment. Before adding new copy, identify what it proves, who it helps, whether it repeats an existing section, and where it belongs.
- Homepage copy should be scannable. Put detailed context in work cards, press cards, archive entries, or future detail pages.
- If a section is removed, also remove or clearly mark its unused source fields and check every parallel output layer: generated HTML, source data, CSS/JS, tests, Figma export SVGs, Figma importer plugin code, docs that act as current specs, and review prompts. Historical review/spec files may mention old sections, but active generators must not recreate them; do not leave old copy where a future edit might revive it.

## Bilingual Voice

- English can carry the international positioning and fast hiring scan. Chinese should preserve precision, cultural nuance, and warmth.
- Partner, publisher, and platform labels must be localizable at the data source. English pages and English design handoffs should use the English label without leaking a Chinese wordmark; Chinese pages may preserve the official Chinese name. Historical source titles are exempt when the title itself is evidence.
- Do not translate press headlines or source titles too freely. If an English title is editorially translated from a Chinese source, keep it factual and close to the source.
- Keep homepage language concise. Move richer, warmer explanation into work details, press, archive, or future case-study pages.
- Treat the screening-strip tagline and Featured Work description as two different reading moments: the tagline is one memorable invitation; the description names the recognizable program type, subject, and contribution without reading like a production inventory.
- For English portfolio-grouping titles, use natural, searchable industry language. Do not publish literal internal category labels that an English-speaking viewer would not know to search.
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
- When adding press, record enough metadata to audit later: every public press entry must include `source`, `canonicalUrl`, `titleSource`, `imageSource`, and `metadataCheckedAt`. Do not add a press card without those audit fields.

## Media Rights

- Public press thumbnails may be referenced by URL when the source page exposes them as public metadata.
- Do not download, crop, edit, or rehost third-party press images unless the user explicitly asks and rights are clear.
- Local portfolio images are for owned/project visuals, not replacements for press-source thumbnails.
- For a work card, an official broadcaster, platform, or production page image may be used as a remote thumbnail only when it clearly represents that work and is link-first, not rehosted.
- Treat public platform videos, YouTube, TaiwanPlus, broadcaster pages, and press pages as link/embed-first sources. Do not upload or rehost video unless music, image, and platform rights are clear.
- When the user approves a local portfolio still derived from a public video of her confirmed work, record the canonical source URL, exact timecode, output dimensions, focal point, and rights status. Keep the public watch destination attached to the work, and use only editorial crop/resize unless a generative edit is separately approved.
- If a remote image breaks, blocks hotlinking, or creates mixed-content issues, use a text-only press card or ask the user for a replacement image. Do not silently swap in an unrelated still.
- The showreel may use local footage only when the rights status is acceptable. If rights are uncertain, prefer a link-based or still-based reel until the user confirms.
- Rights ledger vs integrity ledger: third-party or rights-sensitive media record canonical source and rights basis/status, plus SHA-256 only when localized or re-encoded; owned or user-provided assets record approved basename/source, rights basis, and duration. Integrity regressions that already protect checked-in runtime assets by size/hash/codec stay in the tests and are not removed in the name of rights-ledger dieting.

## Private Evidence Boundary

- Private email, inbox search results, client messages, raw screenshots, phone numbers, addresses, and recipient lists must not be committed to this repo or included in generated output.
- Private evidence may confirm a publishable fact, but store only a redacted derived fact such as role, approximate date range, client/company name, and confidence.
- Do not publish a client, company, or credit reconstructed from private evidence until the user has approved the public wording.
- Treat the repository as public-risk even when it is currently private. Source-material docs and `sourceNote` fields must be redacted enough that an accidental public repo would not expose private messages, addresses, phone numbers, or unapproved credits.

## Work Navigation

- The screening strip is a visual index. It should stay lightweight: no explanatory heading unless needed and no duplicate action labels. Every card jumps to its matching Featured Work; external watch destinations remain inside the large work card or its audited Press entry, never on the small screening card.
- Works enter the screening strip when they have a public `watchUrl`, an approved local `cardReelUrl`, or an explicitly supported external-only state.
- Keep one canonical public `watchUrl` per work whenever the Featured Work image, text CTA, or audited Press entry should share an external destination. The small screening card owns only the matching Featured anchor. Add a separate media URL only when the large-card destinations are intentionally different and that difference is covered by a regression test.
- Use `cardReelUrl` only for a silent, work-specific moving thumbnail, `cardReelPoster` for its static fallback, and `cardReelMode: "after-hold"` for explicit motion approval. A reel URL without the approved mode fails closed to the static poster. Approved reels begin only after the shared poster hold, play only while visible, and reset to the poster when they leave view. Cloned loop cards use `preload="none"`, and reduced-motion or no-JavaScript states remain usable as static cards.
- Keep each work-specific reel separate. Do not combine unrelated credits or program identities inside one thumbnail. The retained `showreel/interior-pts-reel/` assembly is an editorial spine for a future homepage showreel, not a source for either work card.
- Featured Works carries detail. The strip should preview; Featured Works should explain.
- Each work belongs to one public tier at a time: Featured Work, Archive, or unpublished source material. If a work is removed from Featured Works, move it deliberately to Archive or keep it out of the public site.
- `FROM THE ARCHIVE` is one descending chronology. Canonical `order` controls
  both DOM and visual reading order; `lead`, `supporting`, and text-only
  treatments may change card size but must not move an older work ahead of a
  newer one.
- Approved Archive reels retain nearest-viewport-center ownership and a
  1.4-second poster hold at every viewport; the responsive Featured policy does
  not change Archive timing or arbitration.
- On homepage Featured Work cards, the linked media image is the primary watch action. Do not normally repeat that destination with a text CTA.
- Approved Featured reels opt in only with canonical
  `featuredReelMode: "after-hold"`. Eligibility begins at 35% visibility. At
  `820px` and below, only the eligible reel nearest the viewport center is
  active, with ownership recalculated during scroll and resize; above `820px`,
  preserve last-eligible-in-DOM-order ownership.
- Hold the canonical poster for 700ms on mobile and 1.4 seconds above `820px`,
  and keep it visible until the video actually emits `playing`. Leaving
  eligibility, hiding the
  page, a media error, a rejected current `video.play()` promise, or `pagehide`
  must cancel the hold, pause, seek to time zero, and restore the poster. A
  rejected promise does not schedule a retry, and a stale rejection must not
  reset a newer activation. A persisted BFCache restore must safely rebind
  observation.
- Explicit intent bypasses only the passive hold and still obeys one-owner and
  lifecycle guards. Desktop pointer hover over a Featured panel and keyboard
  focus within it request that reel immediately; pointer/focus exit releases
  it. On mobile linked media, the first stationary tap previews and suppresses
  only that click, while a second tap opens the canonical official destination.
  A movement over 12px stays a scroll gesture and cannot accidentally navigate.
  If the explicit preview rejects or errors, the next tap must still reach the
  official destination. Reduced-motion and no-JavaScript keep normal static
  link behavior.
- A Screening Strip pointerdown may metadata-prime only the exact reel named by
  its canonical `#<featured-slug>` target. Arrival at that Featured panel
  bypasses the passive hold; an interrupted jump releases its offscreen prime
  after three seconds. The small card remains an internal jump, never an
  external watch link.
- Featured reel markup stays muted, looped, inline, `preload="none"`, pointer-transparent, and non-interactive. `data/media-manifest.json` is the single source/recipe ledger: builds emit its verified 960×540 mobile H.264 source before the existing 720p fallback; the existing wrapper still owns navigation.
- Initial HTML never eagerly preloads video. After the canonical Hero image has
  loaded, mobile may metadata-warm one settled proximity candidate within a
  two-viewport margin; cancel on ownership/lifecycle change, never warm beside
  active playback, and skip desktop, reduced motion, no JavaScript, Save-Data,
  slow-2G, and 2G. A late initial `pageshow` must yield once scroll, pointer, or
  keyboard navigation has begun. Static posters and the cold fallback remain
  valid.
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
- Before implementing a design reference, translate it into project-specific rules — what to borrow, what to avoid, which parts serve the portfolio goal, and how it behaves on desktop and mobile; never copy a reference site's surface style literally when the user's content needs another rhythm. Use references to derive typography, spacing, motion, image, logo, and section-order decisions.
- Motion should guide attention without becoming a second product. Subtle ambient light is acceptable only when it preserves readability, keeps the site fast, and is verified on mobile.
- The moving work strip may use subtle black edge gradients, but they must stay fixed on a non-scrolling outer frame. Never attach edge-fade pseudo-elements to the scrollable viewport or moving track.
- If a work has no approved image, use an explicit placeholder or text-first layout. Do not borrow an unrelated project still just to fill a card or design export.
- Design-layer artifacts must follow the same content rules as the live site. Figma SVG exports and importer plugins are not allowed to reintroduce removed sections, old metrics, or borrowed images.
- New visual-direction experiments (new layout, motion, effect, or style; not defect repair, responsive parity, or implementation of an approved contract) run lo-fi first: record a text/wireframe or plain structural mock, the baseline commit, and owned paths; obtain producer approval for the proposal, then timebox detailed implementation to 90 minutes of active work. At expiry, stop; without final producer acceptance, keep the result isolated or restore only the owned paths to the recorded baseline, never unrelated work. Log scope, baseline, active minutes, producer decision, and disposition in `docs/reviews/LOG.md`; waiting time does not consume the box and momentum does not extend it.

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
- Deployment cadence: when a changed `main` HEAD is releasable under the applicable QA and review gates, surface a Production decision to the producer within seven calendar days; every Production deployment still requires separate explicit producer authorization, and a missed target or silence is never authorization. Unfinished or unapproved work stays off the release candidate (an existing tested default-off flag may be used). One fresh, static `dist/`-only Preview per completed bounded package is standing-authorized as the normal producer-review handoff after its build, tests, privacy scan, protected-file check, and deployment-manifest inspection pass; it requires no new package-specific approval. Every such Vercel Preview must proactively generate or replace the Hobby account's sole Shareable Link before handoff, without first trying or delivering the login-protected direct Preview origin and without asking the producer for another authorization. The direct origin remains deployment identity and inspection evidence only. The Preview is incomplete until the producer receives an actually openable Shareable Link. After replacement, promptly disclose that the previous sole Shareable Link was revoked. The access-bearing URL stays outside Git. This standing authorization does not include any Git push, source/full-repo deployment, function or Contact activation/submission, Production deployment, alias/custom-domain change, `main` merge/push, destructive Vercel action, or a different access model; stop when a privacy, rights, or security gate fails. In this project, every GitHub `origin` branch push—including `backup/*`—can trigger a Vercel Preview through Git integration, so never describe a backup push as non-deploying. After 14 days without a recorded Production decision, raise a closeout open item to the producer; calendar age alone is not `BLOCKED`.
- After a standing-authorized Preview or explicitly authorized Production deployment is read back as
  Ready, run the read-only post-publish PageSpeed review in
  `docs/performance/README.md` against the exact accessible URL. Record the
  deployment identity, tested URL, report time/link, CrUX availability, mobile
  scores/metrics, transfer size, and three prioritized findings. A routine
  release uses one diagnostic run; a performance package compares the median
  of three fresh runs under matching conditions. One fluctuating lab score is
  neither a release blocker nor permission to change code, deploy, bypass
  Preview protection, or submit Contact. Never send an access-bearing Shareable
  Link to PageSpeed; when protection makes the direct URL untestable, record the
  online measurement as access-blocked unless the producer separately approves
  disclosing that link to the measurement service.

## Roadmap Discipline

- Separate the fast prototype from the refined portfolio. A strong first version is allowed to be rough, but every later iteration should declare which layer it is changing: content, IA, visual system, media/showreel, interaction, SEO, contact, deployment, or design handoff.
- A normal work package's implementation plan is capped at 60 nonblank logical lines (goal, affected files, non-goals, validation, rollback); if it does not fit, split the package — exceptions need explicit producer approval, and estimated diff size is never a pass/fail. After a normal package, append at most 10 lines to `docs/reviews/LOG.md` (date, branch/commit, validation, external-review use or skip reason, open items); dated reports are reserved for phase closeouts and packages touching production deployment, privacy/rights/security, destructive migration, or frozen external-review evidence.
- Suggested roadmap order: stabilize content and public claims → visual system and motion → detail pages for dense projects → approved media → SEO/social previews → analytics only on request → reusable skill/service packaging.
- External reviewers such as Claude Code or Gemini should first produce findings, not edit the repo directly, unless the change scope is mechanical and approved.
- External-review tiering (per Work Charter §4-23 as amended 2026-08-04): packages touching truth/rights/privacy claims, production deployment, or large phase scope use the full rotation review; low-risk user-visible packages use one independent reviewer; only docs-only packages that change no current rules and no public output may skip external review, with the skip reason recorded in LOG.md. The implementer never self-selects a lower tier — downgrades need the independent reviewer's concurrence or a producer ruling.
- When adding a Bible rule, the same change records in `docs/reviews/LOG.md` a retire/downgrade/keep-with-reason verdict for one existing rule; superseded active instructions are deleted or merged (Git history is the archive), `docs/archive/` is only for material with ongoing reference value that is not a dated review, and dated reviews are never relocated to fake reduction.
- Subtractive instructions (delete/trim/simplify) follow Work Charter §3-9: work as a diff against the existing base; re-architecture requires explicit producer approval.
- Sub-agent tasking follows Work Charter §3-10: pass a scoped task summary, never the full conversation history (Codex concrete form: `fork_turns: none`).
- Extract on touch applies only to an explicitly named feature whose implementation is entangled with unrelated behavior in a shared generator or stylesheet: within the same package, make one smallest-applicable, behavior-preserving extraction in a separate commit, with relevant tests green at baseline and after extraction, then apply the requested change and test again. Use data, template/module, style, and focused-test boundaries only as the feature needs; do not extract untouched features. A subtractive or fix-only task remains a diff against the existing base, and any extraction that materially expands its scope requires explicit producer approval for that package under Work Charter §3-9.

## Phase Closeout And Cold Resume

- `STATUS.md` is the only mutable entry point for the current project state. A new session reads it after `AGENTS.md` and this Bible instead of depending on chat history.
- A phase closeout reviews one declared baseline; it does not claim that the portfolio can never be revised again.
- Use `PASS`, `PASS_WITH_OPEN_ITEMS`, or `BLOCKED`. Known aesthetic refinements may move to the next phase, but truth, privacy, rights, functional, deployment, and unpushed-work blockers may not.
- Every formal closeout records the reviewed branch and commit, preview/production state, deterministic and visual evidence, external-review use or skip reason, accepted open items, and one exact next action in a dated file under `docs/reviews/`.
- A substantial closed phase receives a named Git tag after the closeout package is committed. Push the branch and tag, then read back the remote tips.
- Before declaring closeout complete, answer: "What changed in this phase that is not in a repository, durably backed up, or pushed?" Any remaining item must be listed as a risk.
- After each coherent commit and again before closeout: record `git status --short`, then run `git rev-list --count HEAD --not --remotes=origin`; a value above 0 means commits are unreachable from every origin ref and must be non-force pushed to a uniquely named `backup/YYYY-MM-DD/<shortsha>`, read back with `git ls-remote`, and the remote tip compared verbatim to `HEAD` — mismatch is `BLOCKED`. `git rev-list --count origin/main..HEAD` is main divergence only and must not pose as a backup count.
- Begin the next phase as a bounded work package from the recorded checkpoint. Do not rewrite historical closeout reports.

## QA Checklist

- Packages affecting runtime or public output run `npm test` plus an eyeball pass at one relevant desktop width and one mobile width; docs/governance-only packages run targeted validation and `git diff --check` with no browser; changes directly touching bilingual output, reduced-motion, no-JS, BFCache, or media lifecycle add that focused scenario in the same package; the full bilingual × viewport × fallback matrix runs only at phase closeout and before production deployment.
- After removing or renaming a public section, run a repo search for the old label, CSS classes, data file names, generator functions, Figma importer code, Figma export files, and tests. Confirm remaining hits are only historical docs or negative regression tests.
- Check that the hero starts at the top on refresh, keeps its approved slow push when motion is allowed and stays static for reduced motion, has no Play/video affordance, the screening strip loops without a visible blank gap, and Featured Works remains reachable.
- Check that press thumbnails come from press metadata or approved replacements.
- Check that no private source material appears in generated output.
