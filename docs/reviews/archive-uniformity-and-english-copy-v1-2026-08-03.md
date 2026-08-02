# Archive uniformity and English copy QA — 2026-08-03

## Outcome

**PASS_WITH_OPEN_ITEMS**

- Branch: `codex/contact-archive-entrypoints`
- Local preview: `http://127.0.0.1:57888/` (port `57888` was free before this QA server started)
- Final Vercel Preview: `https://hsin-hsin-yuan-portfolio-preview-ldm6qfz3d.vercel.app`
- Deployment: `dpl_4GW7xq4wuX5nf1v7VjtQ3JLAm3cW`, target `preview`, status `Ready`.
- Contact form: not submitted. No email or other external side effect was triggered.
- Open item: direct public inspection of Preview `/en/`, `/zh/`, and GET `/api/contact` was not performed because the active `vercel-deploy` skill prohibits requesting the deployed URL. It remains optional manual verification if desired.

Local QA remains **PASS**. The overall record is `PASS_WITH_OPEN_ITEMS` only
because public route, content, and API behavior was not directly observed after
deployment; it does not weaken the completed local content, layout, behavior,
accessibility, or fallback evidence below.

## Commit roles

| Role | Exact commit | Meaning |
| --- | --- | --- |
| Implementation / product-source tip | `47821ff6100a2484175dd3af8c8df45acfd66621` | Last product-source change, including the Figma-sync/product tree used by local QA. |
| QA / review record | `6b63f5d086a1db4070105f9adc190154cb6f707c` | Adds or clarifies this dated local-QA review only. |
| Exact deployed checkout | `6b63f5d086a1db4070105f9adc190154cb6f707c` | Checkout built and staged for Vercel; its product source is unchanged from `47821ff6100a2484175dd3af8c8df45acfd66621` apart from review documentation. |
| Preview / status documentation | `f16c3029978c0392096faedda0fa56218a698283` | Records the completed Preview and status after deployment. |

The follow-up documentation change after `f16c302...` only clarifies this
provenance; its not-yet-known commit SHA is intentionally not self-referenced
in this file.

## Preview deployment provenance

`npm run build` passed at deployment source commit
`6b63f5d086a1db4070105f9adc190154cb6f707c` before packaging. The full-repository
fallback upload was rejected and did not create a deployment. A materially safer
staging package was then constructed. Before CLI linking it contained exactly
the following 22 approved payload paths, sorted bytewise:

```text
api/contact.js
assets/og-image.jpg
assets/portfolio/gorgeous-space-sunny-wang-frontal.webp
assets/portfolio/hsin-working-white-space.jpg
assets/portfolio/my-art-my-voice-performance-2.jpg
assets/portfolio/slow-steps-poster.webp
assets/portfolio/top-gear-uk-special-car.jpg
assets/showreel/interior-spatial-card-reel.mp4
assets/showreel/nothing-by-bus-card-reel.mp4
assets/showreel/overclocking-card-reel-poster.webp
assets/showreel/overclocking-card-reel.mp4
assets/showreel/website-visual-reel.mp4
en/index.html
favicon.svg
index.html
main.js
package.json
robots.txt
sitemap.xml
styles.css
vercel.json
zh/index.html
```

The sorted path-list SHA-256 is
`1940a63b96e81606d82bb164be8f66b9d9292da10c45d79474adc41e05505388`.
It was computed by finding staged files while excluding `.vercel/*` and
`.gitignore`, stripping the staging-directory prefix, sorting the relative
paths, and piping that list to `shasum -a 256`.

```sh
find "$preview_stage" -type f ! -path "$preview_stage/.vercel/*" ! -path "$preview_stage/.gitignore" \
  | sed "s#^$preview_stage/##" | LC_ALL=C sort | shasum -a 256
```

Vercel CLI subsequently created local control files `.vercel/project.json`,
`.vercel/README.txt`, and `.gitignore`. The remote build log reported
downloading 23 deployment files, so the remote transport manifest is not
claimed to contain exactly 22 files. The security boundary was the 22 approved
content payload paths above plus Vercel-owned local link metadata. Git data,
source scripts and source content, tests, documentation and reviews, original
media, caches, other unused assets, and the unused India group photograph were
not included.

### Reproducible staging construction

From the exact `6b63f5d086a1db4070105f9adc190154cb6f707c` checkout:

1. Run `npm run build`.
2. Create an isolated directory with `preview_stage=$(mktemp -d)`, then copy
   `dist/.` into `$preview_stage/`.
3. Create `$preview_stage/api/` and copy `api/contact.js` into it.
4. Retain only the 22 paths in the manifest above. This is the authoritative
   allowlist for copied public assets; the ten unused assets copied by the
   initial broad `dist` copy are removed rather than inferred from filename.
5. Replace the copied package configuration with this minimal
   `package.json`:

   ```json
   {
     "name": "hsin-hsin-yuan-portfolio",
     "version": "1.0.0",
     "private": true,
     "type": "module"
   }
   ```

6. Use a minimal `vercel.json` containing only `cleanUrls`, the `/` to `/en/`
   redirect, and the existing asset/static-file cache headers. It contains no
   `buildCommand` or `outputDirectory`:

   ```json
   {
     "cleanUrls": true,
     "redirects": [
       { "source": "/", "destination": "/en/", "permanent": false }
     ],
     "headers": [
       {
         "source": "/assets/(.*)",
         "headers": [
           { "key": "Cache-Control", "value": "public, max-age=604800, stale-while-revalidate=86400" }
         ]
       },
       {
         "source": "/(styles.css|main.js|favicon.svg)",
         "headers": [
           { "key": "Cache-Control", "value": "public, max-age=3600, stale-while-revalidate=86400" }
         ]
       }
     ]
   }
   ```

7. Verify every local page asset reference resolves inside the allowlisted
   stage; scan the stage for private paths, direct credentials, and other
   excluded material; then reproduce the sorted relative-path manifest and
   SHA-256 above.
8. Run the Vercel CLI from `$preview_stage`, allowing it to create only its
   local link metadata before the Preview command.

Deployment used ephemeral Vercel CLI `58.4.4` through `npx` under the existing
`projectmoonie-creator` account; no global CLI was installed and no claim URL
was produced. The final project is
`projectmoonie-creators-projects/hsin-hsin-yuan-portfolio-preview`.

The first new-project deployment, although invoked without `--prod`, was
unexpectedly assigned the production target by Vercel because it was the
project's first deployment. Its deployment ID was
`dpl_Dd2eMsQ58YQUEMAijs4hHceZxggS` and its URL was
`hsin-hsin-yuan-portfolio-preview-ghlzgynyn.vercel.app`. It was never accepted
as the deliverable. After the user separately and explicitly authorized
permanent deletion, the exact deployment was removed; Vercel CLI reported
`Success! Removed 1 deployment`.

The true Preview was created with
`npx --yes vercel deploy --yes --target=preview`: no `--prod`, alias, domain
promotion, or production routing was used. Exact final evidence:

- Preview URL: `https://hsin-hsin-yuan-portfolio-preview-ldm6qfz3d.vercel.app`
- Inspector: `https://vercel.com/projectmoonie-creators-projects/hsin-hsin-yuan-portfolio-preview/4GW7xq4wuX5nf1v7VjtQ3JLAm3cW`
- Deployment ID: `dpl_4GW7xq4wuX5nf1v7VjtQ3JLAm3cW`
- `vercel inspect`: target `preview`, status `Ready`, created Mon Aug 03 2026 06:12:41 GMT+0800; build includes `λ api/contact` (`2.56KB`) in `iad1`.
- `vercel ls hsin-hsin-yuan-portfolio-preview --yes`, observed at `2026-08-03T06:50:31+08:00`: exactly one deployment in the project at that time, the final URL above, status `Ready`, environment `Preview`, duration `7s`.

The original production website and domain were never changed. The isolated,
accidental production-target deployment in the new preview-named project was
deleted. No request was made to the final Preview URL, including `/en/`,
`/zh/`, or `/api/contact`; no form was submitted and no email was sent.

## Open-item closure criteria

Because the active `vercel-deploy` skill prohibited the agent from directly
requesting the deployed URL, these checks remain optional/manual unless a later
explicit workflow permits them. Use safe GET requests only and record the
observed evidence in this dated review:

- GET `/en/` must return HTTP `200`; contain `Design &amp; Brand Films`,
  `archive-card`, `contact-title-bridge`, and
  `/assets/showreel/overclocking-card-reel.mp4`; and omit
  `Interior Design &amp; Branded Films` and `contact-title-lead`.
- GET `/zh/` must return HTTP `200`; contain the Chinese Design title
  `幸福空間與室內設計影像`, `archive-card`, the Tech official card, and the
  exact two contact lines `一起把故事` and `做出來。`.
- GET `/api/contact` must return HTTP `405` with JSON
  `{ "ok": false, "error": "Method not allowed." }`. Do not use POST, submit
  the form, send email, or trigger a Resend call.

If all three checks pass, change the overall result from
`PASS_WITH_OPEN_ITEMS` to `PASS`. Any failure keeps
`PASS_WITH_OPEN_ITEMS` and triggers diagnosis. These GET-only checks cannot
validate mail delivery and must never be represented as doing so.

## Deterministic checks

All commands ran from the repository root at the QA input commit.

| Command | Exact result |
| --- | --- |
| `npm test` | exit `0`; `35` tests, `35` pass, `0` fail, `0` skipped, `0` todo; reported duration `288.65575 ms` |
| `npm run build` | exit `0`; `node scripts/build-site.mjs` completed |
| `npm run figma:export` | exit `0`; generated the Figma SVG export package in this checkout's `figma-export` directory |
| `git diff --check` | exit `0`; no output |

After both regeneration commands, `git status --short`, `git diff --stat`, and `git diff --name-only` showed no tracked changes. The tracked generated files therefore remained Git-identical. Because `dist` is ignored, the hashes below are post-build fingerprints, not proof of pre-build versus post-build Git identity for `dist`. The only worktree item was the protected untracked duplicate `docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md`; it was not edited, staged, deleted, or renamed.

Generated build fingerprints:

- `dist/en/index.html`: `74a536bff9aea0d63ee0bee40db9311969813bab7b748a4d782218f83769eee7`
- `dist/zh/index.html`: `3401106a965657fd0f68b6baee9cda9badb874d8780383544afb4ead02cf68c8`
- `dist/styles.css`: `95dc17a422ac38c7d86784ef1e80a7807d28bcf0168919cd2e85b93637f6a973`
- `dist/main.js`: `79831f5936f8e42846f6dc53e8f27e49fe6c079ceef2758fe49effcc4fbff1b7`

## Active fingerprint and media integrity

The required retired-fingerprint command was:

```text
rg -n "Interior Design & Branded Films|archive-media-card|archive-media-card-lead|archive-item|archiveFeature|contact-title-lead\">Let’s build a story" content data scripts src dist/en dist/zh figma-export
```

It exited `1` with no output: there were no matches in active content, source, build, or Figma-export surfaces. Historical specs and reviews were intentionally outside the search scope.

The localhost `/en/` response contained the current escaped `Design &amp; Brand Films` title, `class="archive-card"`, `class="contact-title-bridge"`, and the exact `/assets/showreel/overclocking-card-reel.mp4` path. The retired `Interior Design &amp; Branded Films` title and `contact-title-lead` class were absent.

Media hashes matched exactly:

| Asset | SHA-256 |
| --- | --- |
| `public/assets/showreel/overclocking-card-reel.mp4` | `c5b4a2d83454b00edcd24e5ab14f29056f1586d12b79d9aa8a9e58cf51f75a1f` |
| `public/assets/showreel/overclocking-card-reel-poster.webp` | `0cfcfff0e8967e518538d3489b882eb09152c040bd58e886e7036f46a9b97f66` |
| `public/assets/showreel/website-visual-reel.mp4` | `3825c6e76c1d26caecd9bbd0ea38b6b00c798c0dbbc5cdece3a436eb9190b405` |
| `public/assets/portfolio/tech-dreamers-official.webp` (local Figma asset) | `acdf4f1e1d5f8427143a7d4dd4c69f2b36b9991dd0f877af528613dad87f1e24` |

## Normal responsive browser QA

The in-app Browser-selected Chrome surface completed the normal-JavaScript checks. Each state used the explicit viewport capability, actual computed DOM geometry, and visual screenshots where needed. Full-page visual inspection covered English desktop (`1440x900`) and Chinese mobile (`360x800`); an English desktop archive viewport screenshot additionally confirmed the lazy-loaded media frames.

The expected Featured Work title order was observed at every state:

- English: `Slow Steps`; `Tech Dreamers`; `My Art, My Voice`; `Design & Brand Films`; `Nothing by Bus`; `Top Gear China: UK Special`.
- Chinese: `Slow Steps`; `Tech Dreamers`; `My Art, My Voice`; `幸福空間與室內設計影像`; `無事坐巴士`; `《巔峰拍檔》中國版：英國篇`.

For all six works in all ten states, the rendered title, tagline, and description matched active locale content, every `.work-copy` bottom remained within its work panel, and panel overflow was `0 px`. This directly covered the revised English copy without clipping and preserved the canonical Chinese copy. The screening-strip card showed `Design & Brand Films` in English and retained `幸福空間與室內設計影像` in Chinese. The deterministic tests independently included `English output uses Gorgeous Space while Chinese output preserves 幸福空間` and `Design title propagates to the English screening-strip card`.

| Locale | Viewport | Archive card size (each) | Equality delta W/H | Internal split copy/media | Fifth card | Overflow body/archive/panel | Contact | Result |
| --- | ---: | ---: | ---: | ---: | --- | ---: | --- | --- |
| EN | `1440x900` | `655.50x221.23` | `0.00/0.00 px` | `39.88%/59.82%` | left column, no span | `0/0/0 px` | 2 lines; only `together.` acid | PASS |
| EN | `1200x900` | `539.50x182.08` | `0.00/0.00 px` | `39.85%/59.78%` | left column, no span | `0/0/0 px` | 2 lines; only `together.` acid | PASS |
| EN | `834x1112` | `750.61x253.33` | `0.00/0.00 px` | `39.89%/59.84%` | ordinary one-column card | `0/0/0 px` | 2 lines; only `together.` acid | PASS |
| EN | `390x844` | `351.00x148.20` | `0.00/0.00 px` | `39.77%/59.66%` | ordinary one-column card | `0/0/0 px` | 2 lines; only `together.` acid | PASS |
| EN | `360x800` | `324.00x136.80` | `0.00/0.00 px` | `39.75%/59.63%` | ordinary one-column card | `0/0/0 px` | 2 lines; only `together.` acid | PASS |
| ZH | `1440x900` | `655.50x221.23` | `0.00/0.00 px` | `39.88%/59.82%` | left column, no span | `0/0/0 px` | 2 lines; `做出來。` acid on line 2 | PASS |
| ZH | `1200x900` | `539.50x182.08` | `0.00/0.00 px` | `39.85%/59.78%` | left column, no span | `0/0/0 px` | 2 lines; `做出來。` acid on line 2 | PASS |
| ZH | `834x1112` | `750.61x253.33` | `0.00/0.00 px` | `39.89%/59.84%` | ordinary one-column card | `0/0/0 px` | 2 lines; `做出來。` acid on line 2 | PASS |
| ZH | `390x844` | `351.00x148.20` | `0.00/0.00 px` | `39.77%/59.66%` | ordinary one-column card | `0/0/0 px` | 2 lines; `做出來。` acid on line 2 | PASS |
| ZH | `360x800` | `324.00x136.80` | `0.00/0.00 px` | `39.75%/59.63%` | ordinary one-column card | `0/0/0 px` | 2 lines; `做出來。` acid on line 2 | PASS |

The percentages exclude the one-pixel border and therefore sum just under 100%; every card within a given state had the same measured split. At desktop two-column archive states, cards 1/3/5 shared the same left coordinate and the fifth card width equalled every other card, proving it did not span. At all one-column states, all five widths and heights remained identical.

Desktop wide-media vertical centering stayed within the required `<=2 px` tolerance:

| Locale / viewport | Design frame to panel midpoint | Nothing by Bus frame to panel midpoint |
| --- | ---: | ---: |
| EN `1440x900` | `0.00 px` | `0.00 px` |
| EN `1200x900` | `0.00 px` | `0.00 px` |
| ZH `1440x900` | `0.00 px` | `0.00 px` |
| ZH `1200x900` | `0.00 px` | `0.00 px` |

Additional observed content evidence:

- Tech Dreamers' media frame and visible official-page card both used the exact canonical TaiwanPlus URL in both locales and all ten states.
- Text-only Archive cards displayed `01` and `02`.
- Heart of Steel and Lying Game lazy-loaded their canonical YouTube stills at natural width `480 px`; Overclocking loaded the approved local poster at natural width `1280 px`. All three were visibly rendered when the archive entered the viewport.
- The English contact line texts were exactly `Let’s build` and `a story together.`; lead/bridge color was `rgb(247, 242, 232)` and only `together.` was `rgb(216, 255, 62)`.
- The Chinese contact line texts were exactly `一起把故事` and `做出來。`; the second line accent was `rgb(216, 255, 62)`.

## Overclocking runtime behavior

This was observed in normal JavaScript mode on English Chrome at `1440x900` after bringing the card across its intersection threshold.

1. At approximately `800 ms` after entry, the approved poster was visible (`opacity: 1`); the video had no `is-playing` class, was paused, had `currentTime: 0`, `readyState: 0`, and `opacity: 0`.
2. At approximately `1550 ms` after entry (the `1400 ms` hold plus startup tolerance), the video had `archive-card-reel is-playing`, `paused: false`, `readyState: 4`, `opacity: 1`, and `currentTime: 2.263 s`.
3. After another `420 ms`, `currentTime` was `2.705 s`, a measured `+0.442 s` progression. Reveal was therefore confirmed only after actual playback.
4. After scrolling outside the threshold and waiting `300 ms`, the video class reset to `archive-card-reel`, `paused: true`, `currentTime: 0`, `opacity: 0`; the poster remained `opacity: 1`.

## Critical accessibility and fallback modes

Native headless Chromium `148.0.7778.96` completed the contexts that required capabilities beyond the normal Chrome surface.

| Mode | Exact surfaces | Observed result |
| --- | --- | --- |
| Reduced motion | EN `1440x900`, EN `390x844`, ZH `1200x900`, ZH `360x800` | In every real `reduced_motion="reduce"` context, `matchMedia('(prefers-reduced-motion: reduce)').matches` was `true`; body overflow was `0 px`; 2 featured reels and 1 archive reel were hidden and non-playing; all 6 featured poster frames, all 3 archive posters, Tech official card, archive links, and contact link remained visible. Archive poster natural widths were `480/480/1280 px`. |
| JavaScript disabled | EN `1440x900`, EN `390x844`, ZH `1200x900`, ZH `360x800` | In every context created with `java_script_enabled=False`, all 6 locale titles, all 5 archive cards, all 3 poster images with non-zero visible boxes, Tech official card, contact link, and static contact form were visible. Featured/archive `is-playing` class counts were `0`; overlays did not hide posters. |
| Keyboard only | EN `1440x900`, EN `390x844`, ZH `1200x900`, ZH `360x800` | Without mouse activation, Tab reached watch cards, Tech media and official links, all 3 Archive anchors, all 5 form fields, submit, and GitHub in `36-38` steps. Each Archive anchor computed `2px solid rgb(216, 255, 62)` with `3px` offset; media links computed the same `2px` acid outline with `4px` offset; contact fields showed a settled `1px solid rgba(216, 255, 62, 0.42)` focus-within border; submit changed to a high-contrast `rgb(247, 242, 232)` background. After GitHub, focus passed through `BODY` and the next Tab returned to the first visible navigation control, proving no keyboard trap. |

Representative reduced-motion English mobile and no-JavaScript Chinese mobile full-page screenshots were visually inspected. They confirmed posters and static content remained visible and the archive/contact layouts remained intact. No screenshots or temporary QA scripts were added to the repository.

## Scope and preservation

The intentional visible changes are present: the English Design title/copy and screening-strip label use the new `Design & Brand Films` wording, Archive uses five uniform 40/60 cards with the fifth kept ordinary, and the contact heading uses the explicit two-line bridge/accent treatment. Chinese canonical Featured Work, Design strip, Archive, and contact copy remained unchanged in all observed Chinese states.

No product source, content, generated SVG, media, status record, or deployment configuration was changed during QA. The closed baseline remained identified by annotated tag object SHA `68d99c13341f27ad388a8c9bc06df22b3d38bcf2` and peeled `portfolio-phase-2026-07-29-closed^{}` commit SHA `7e6200106fe9feb10331e6558981b0314de00597`.
