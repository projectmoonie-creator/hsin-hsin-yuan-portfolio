
# External Spec Review — Hsin-Hsin Yuan Portfolio (2026-07-12)

No Critical findings. The governance layer (PROJECT_BIBLE.md) is unusually mature for a project this size; most issues below are places where the implementation has drifted from the bible's own rules, or where a rule exists in spirit but not in writing.

## Findings

### 1. High — Mobile navigation hides all in-page links with no replacement
`src/styles.css:1376` — at ≤820px, every nav link except the language switch is `display: none`. Mobile visitors get no路径 to Works or Contact except scrolling the entire page, and the bible's QA checklist (`PROJECT_BIBLE.md:60`) checks strip/hero/showreel behavior but never nav reachability. For a portfolio whose primary conversion is the contact form at the very bottom of a long page, this is the biggest UX risk on the site.
- **Suggested bible addition:** "On mobile widths, Works and Contact must remain reachable within one tap from the top of the page (compact menu, persistent CTA, or equivalent)."
- **Suggested code change:** add a minimal mobile affordance — even just keeping the Contact link visible next to the language switch.

### 2. High — `data/site.json` violates the bible's own dead-field rule
`PROJECT_BIBLE.md:8` requires removed sections to have their source fields removed or marked. Verified against `scripts/build-site.mjs`, these fields are never rendered in either language: `heroPrimaryCta`, `heroSecondaryCta`, `aboutTitle`, `aboutLead`, `aboutBody`, `aboutNotes`, `availabilityDetails`, `workWithMeTitle`, `workModes`, `showreelEyebrow`, `showreelSubcopy`, `watchShelfKicker/Title/Hint/Action` (`data/site.json:13-14, 16-17, 20-27, 30-36, 40-43, 59-66`). The drift is already visible: `availability` has six pills including "Editing" but `availabilityDetails` has only five entries with no Editing — exactly the "stale copy revived by a future edit" failure the bible predicts. Note also `workWithMeSubcopy` *is* still rendered (`build-site.mjs:485`) under the "Available for" heading, so deleting the workWithMe block wholesale would break the page — this coupling is undocumented.
- **Suggested code/content change:** delete the dead fields (or move them to a clearly named `_retired` file), and rename `workWithMeSubcopy` to something like `availabilityIntro` to match its actual use.

### 3. High — Press thumbnails are hotlinked with no fallback, and the required audit metadata was never added
`content/works/my-art-my-voice.md` hotlinks thumbnails from `v3-statics.mirrormedia.mg` and `www.verymulan.com`. The bible permits this (`PROJECT_BIBLE.md:29`) and forbids silent substitution, but nothing detects breakage: if either CDN blocks hotlinking or rotates the URL, the card renders an empty image span forever, and the tests still pass because they only assert the filename appears in the HTML string (`tests/build-site.test.mjs:155,158`). Separately, `PROJECT_BIBLE.md:25` requires recording "canonical URL, source name, title source, image source, and the date the metadata was checked" — no press entry has `metadataCheckedAt`, `titleSource`, or `imageSource` fields. The rule exists; the schema never implemented it.
- **Suggested code/content change:** add the audit fields to the press schema, and add a periodic check (even a manual QA line) for remote image 200s; give `.press-preview-image` a graceful text-only degradation.

### 4. High — The bible's press-image rule is already being violated by the site's own data
`content/works/my-art-my-voice.md` press[0] ("Official program page", TaiwanPlus) uses `/assets/portfolio/my-art-my-voice-performance-2.jpg` — a local portfolio still — as the press thumbnail. `PROJECT_BIBLE.md:22` says "Do not substitute a portfolio still or project photo by default." For an official page of one's own program this is arguably fine, but the rule as written forbids it, so either the data or the rule is wrong.
- **Suggested bible addition:** "Exception: for official platform pages of the director's own works, an owned project still may be used as the card image."

### 5. Medium — Featured Work metrics and Selected Impact duplicate the same numbers with no canonical source
Top Gear's 200M / 0.81 / #1 live in both `content/works/top-gear-china-uk-special.md:73-78` and `data/impact.json:3-29`; the "24 artist groups" figure lives in both `my-art-my-voice.md` and `impact.json:59-71`. Both render on the same homepage. If one is corrected, nothing forces the other to follow. There are also *two different* "200M" claims on the site (Top Gear viewers; micro-drama cumulative views in `content/archive/three-minute-micro-drama.md`) — an attentive producer will notice and wonder.
- **Suggested bible addition:** "Each metric has one canonical record. `data/impact.json` is the homepage proof layer; work-card metrics may repeat an impact metric only verbatim, and any correction must update both. When two different works claim similar-looking numbers, the labels must make the difference unmistakable."

### 6. Medium — Big audience claims have no verifiability rule
"200M viewers," "600K viewers," "66% reported rating" (`content/archive/overclocking.md` — 66% as a *rating* is an extraordinary number that will read as a typo or exaggeration internationally) all trace only to `sourceNote` fields pointing at CV files, one of which (`xAI_AI_Tutor_Chinese_CV.md`, `data/impact.json:70`) doesn't exist anywhere in the repo. For an international-facing credibility site, unverifiable superlatives are a reputational risk.
- **Suggested bible addition:** "Every public metric needs a sourceNote that resolves to something in the source inventory, plus a confidence tag (public-source / broadcaster-reported / self-reported). Prefer wording that matches the confidence level."

### 7. Medium — `dist/` is committed to git (85 files, including an .mp4)
`dist/` is fully tracked while `vercel.json` rebuilds from source on deploy, so the committed copy is dead weight that can silently go stale, doubles every asset in history (the showreel video is stored twice per revision), and enlarges the surface for the bible's own "no private material in dist" concern (`PROJECT_BIBLE.md:62`) — a leaked file would persist in git history even after a rebuild removes it.
- **Suggested code change:** add `dist/` to `.gitignore` and `git rm -r --cached dist`. If a committed build is intentional (e.g., for inspection), write that rationale into the bible.

### 8. Medium — Snapshot-overfit tests will fight every design change
`tests/build-site.test.mjs:213-253` asserts exact CSS text including whitespace (`\.hero h1 \{\n  font-size: clamp\(3\.5rem…`), vendor file paths, and dozens of `doesNotMatch` checks for long-removed markup (`about-tabs`, `showreel-modal`, `hero-actions`). These pin the site to its current pixel state: any legitimate restyle breaks ~20 assertions that verify nothing behavioral, while real regressions (broken remote thumbnail, missing section) pass. The removed-copy regression checks are genuinely good; the CSS-literal checks are the problem.
- **Suggested code change:** keep structural/content assertions, replace CSS-literal matches with existence-level checks (selector present, file copied). 
- **Suggested bible addition:** "Tests protect content rules and page structure, not exact styling text."

### 9. Medium — SITE_ORIGIN is hardcoded in three unlinked places
`scripts/build-site.mjs:8`, `public/robots.txt`, and `public/sitemap.xml` each hardcode `hsin-hsin-yuan-portfolio.vercel.app`. When the custom domain the bible anticipates (`PROJECT_BIBLE.md:53`) arrives, all three must change in lockstep or canonicals/sitemap will disagree — the kind of drift that quietly hurts SEO.
- **Suggested code change:** generate robots.txt and sitemap.xml in the build script from the same `SITE_ORIGIN` constant. Bonus: sitemap gains `lastmod` for free.

### 10. Medium — Non-featured works have no defined destination
`loadWorks` drops any work with `featured: false` (`scripts/build-site.mjs:34`) — it doesn't fall back to the archive; it vanishes. There is no written rule for what happens when a work rotates out of Featured Works, and no defined home for the interior/spatial films already inventoried in `docs/source-materials/interior-spatial-films.md` ("experience item rather than standalone featured work" is noted there but no such section exists).
- **Suggested bible addition:** "A work is always in exactly one tier: Featured / Archive / unpublished inventory. Un-featuring a work means moving its file to `content/archive/` in the same change."

### 11. Medium — Detail-page architecture is referenced but unspecified
The bible twice defers to "a future detail page" (`PROJECT_BIBLE.md:7,48`), and My Art, My Voice already carries three press links plus case study plus metrics on one homepage card. Nothing specifies URL scheme (`/en/works/<slug>/`?), which fields migrate off the homepage card, how bilingual paths and canonicals work for detail pages, or how the sitemap grows. Deciding this before the next work is added is cheaper than after.
- **Suggested bible addition:** a "Detail Pages" section fixing the URL pattern, the homepage-card vs. detail-page field split, and the rule for when a work earns a detail page (e.g., >2 press items or >1 public link).

### 12. Medium — Repo visibility vs. what's committed needs an explicit decision
The remote is `github.com/projectmoonie-creator/hsin-hsin-yuan-portfolio`. If that repo is (or ever becomes) public, then `docs/source-materials/interior-spatial-films.md` — a detailed inventory of client work, design firms, talent, and rights notes — plus every `sourceNote` naming personal CV files becomes public too. None of it crosses the bible's private-evidence line (`PROJECT_BIBLE.md:36-40`) outright, but the bible only governs "this repo or dist/" without stating whether the repo itself is a public artifact.
- **Suggested bible addition:** "The repo is private / public (pick one). If public, `docs/source-materials/` and sourceNotes must meet the same redaction standard as published pages."

### 13. Low — Slow Steps reuses a Paris Cultural Olympiad photo as its poster
`content/works/slow-steps.md` uses `/assets/portfolio/paris-cultural-olympiad-team.jpg` for an unrelated 2026 work. It's an owned image so no rights issue, but it visually implies the new work is connected to the Olympiad project. A neutral placeholder or the accent-color frame (already supported by `mediaFrame`, `scripts/build-site.mjs:193-198`) would be more honest.

### 14. Low — Archive and lab markdown bodies are written but never rendered
`renderArchive`/`renderLab` (`scripts/build-site.mjs:290-318`) ignore the markdown body, so lines like "Thirteen-episode Taiwanese drama series starring Ella Chen and Chris Wu" exist only in source. Either render them (they're good credibility copy) or note in the bible that bodies are internal context — otherwise a future editor will polish text no one can see.

### 15. Low — Contact endpoint has no rate limiting and one unhandled failure path
`api/contact.js` — the honeypot + `startedAt` timing check is sensible, but `startedAt` is client-supplied and trivially spoofed, and nothing limits request volume, so a determined script can burn Resend quota and flood the inbox. Also, if the Resend `fetch` itself throws (network error), the handler rejects and Vercel returns a raw 500 instead of the friendly JSON error. Wrap the fetch in try/catch; consider Vercel's per-IP rate limiting or a simple in-memory throttle. Secrets handling itself is correct — env vars only, matching `PROJECT_BIBLE.md:52`.

### 16. Low — URL injection into inline `style` uses an escape function that doesn't cover the context
`escapeHtml` doesn't escape single quotes, but poster and press image URLs are inlined as `url('...')` inside style attributes (`scripts/build-site.mjs:153,187,246`). All current data is trusted, but a future press URL containing `'` or `)` would silently corrupt the card's CSS. Escaping quotes/parens for the CSS-url context (or moving images to `<img>`) removes the trap.

### 17. Low — Manual `ASSET_VERSION` cache-busting will be forgotten
`scripts/build-site.mjs:9` (`"20260712-strip-first"`) must be hand-bumped for every CSS/JS change; the Vercel header allows 1h caching plus a day of stale-while-revalidate. Derive the version from a content hash or the git SHA at build time.

### 18. Low — No structured data for the person or works
Pages have solid hreflang, canonical, and OG tags, but no JSON-LD `Person` (with `sameAs` → TaiwanPlus, GitHub, press) or `CreativeWork`/`VideoObject` entries. For a name-search-driven portfolio, a `Person` block is the cheapest meaningful SEO upgrade. Note the bible's press rules already require collecting JSON-LD from sources (`PROJECT_BIBLE.md:20`) — the site just doesn't emit its own.

## What is already strong

- **The bible itself.** Press-card sourcing rules, the private-evidence boundary, media-rights defaults, and the "classify CV lines by function" content rule are the kind of governance most solo portfolios never write down — and the tests genuinely enforce several of them (no `mailto:`, no stale CV copy, no revived sections).
- **Build architecture.** A dependency-light static generator with JSON-frontmatter content files, clean bilingual rendering via `localize`, and consistent HTML escaping is easy to maintain and easy to audit.
- **The screening strip / Featured Works split** ("strip previews, Featured Works explains") is a clear, written division of labor, correctly implemented — strip membership is gated on public `watchUrl`, watch-label wording follows the single/series/collection rule, and cloned strip links are properly removed from tab order.
- **Contact flow hygiene.** Honeypot + timing check, no email address in markup, secrets in env vars, graceful 503 when unconfigured — all consistent with the bible.
- **Accessibility instincts.** `prefers-reduced-motion` gates all ambient animation, the strip pauses on hover/focus, `aria-live` on form status, and the strip viewport still scrolls natively (`overflow-x: auto`) when the auto-loop is off.

The highest-leverage next steps, in order: fix mobile nav reachability (#1), purge the dead `site.json` fields (#2), and implement the press audit-metadata schema the bible already mandates (#3).
