# Archive drama posters and credit links QA — 2026-08-03

## Outcome

**PASS_WITH_OPEN_ITEMS**

- Declared scope: replace the `Heart of Steel` and `Lying Game` Archive
  thumbnails with attractive series posters; preserve the official trailer or
  promo; add public evidence of Hsin-Hsin Yuan's screenwriting credit; keep the
  uniform 40/60 Archive system unchanged.
- Branch: `codex/contact-archive-entrypoints`
- Implementation and exact deployed checkout:
  `f79d9a07b21ae9b4b382b0dde918b395da6572e6`
- Latest Preview:
  `https://hsin-hsin-yuan-portfolio-preview-bjxhmtfey.vercel.app`
- Deployment: `dpl_81WdpDZGBr53ujW9EMyVJVDaWZRG`; target `preview`;
  status `Ready`; created 2026-08-03 09:33:28 GMT+0800.
- Production website/domain: unchanged.
- Open items: manual public Preview inspection and user selection of the local
  branch finish option.

## Evidence and media decisions

### Heart of Steel / 鋼鐵之心

- Public credit link:
  `https://zh.wikipedia.org/zh-tw/%E9%8B%BC%E9%90%B5%E4%B9%8B%E5%BF%83`
- Verified public entry: the infobox lists `袁欣欣` as a screenwriter; the
  production-team section also lists the screenwriting team.
- Production-company evidence:
  `http://www.dds.com.tw/portfolio-item/heart-of-steel/`
- The production-company page also lists `袁欣欣` under `編劇`, but it is kept
  as source evidence rather than a public action because only HTTP is currently
  usable.
- Poster: remote Wikimedia-hosted series artwork, classified
  `public-link-only`; it is referenced in place and not downloaded, edited, or
  rehosted.

### Lying Game / 謊言遊戲

- Public credit link:
  `https://zh.wikipedia.org/zh-tw/%E8%AC%8A%E8%A8%80%E9%81%8A%E6%88%B2`
- Verified public entry: the infobox and production-team section list `袁欣欣`
  as a screenwriter.
- Production-company evidence:
  `http://www.dds.com.tw/portfolio-item/the-lying-game/`
- The production-company page is live over HTTP and explicitly lists
  `編劇 ▎胡學林 孫景 劉蕊瑄 袁欣欣`. Its HTTPS endpoint has an invalid
  certificate, so it is recorded but not exposed as the user-facing button.
- Poster: remote Wikimedia-hosted series artwork, classified
  `public-link-only`; it is referenced in place and not downloaded, edited, or
  rehosted.

## User-visible contract

- The two drama cards retain the same aspect ratio, 40/60 copy/media columns,
  ordering, type, color, and spacing as the other Archive cards.
- Posters use `object-fit: contain` on the existing dark media field so the
  complete artwork remains visible instead of being cropped into a random
  trailer still.
- The poster and `Watch official trailer/promo` action open the existing public
  YouTube destination.
- A separate `View credited role` / `查看編劇署名` action opens the relevant
  HTTPS Wikipedia entry.
- Cards with multiple destinations render as articles with separate anchors;
  no nested anchors are emitted.

## Test-first evidence

The focused test was written before the production change and failed for the
expected reasons: the old YouTube image URLs remained, the cards had only one
destination, and the new poster/credit fields and markup were absent. After the
minimal canonical-data, renderer, and CSS changes, the focused suite passed.

Final deterministic checks:

| Check | Result |
| --- | --- |
| `npm test` | 36 passed, 0 failed |
| `npm run build` | passed |
| `npm run figma:export` | passed; no tracked generated diff |
| `git diff --check` | passed |

One earlier full-suite run encountered a transient macOS `ENOTEMPTY` while the
build test removed `dist`. Root-cause investigation found no persistent writer
or repeatable content failure. Three immediate full-suite reproductions and the
final full suite all passed. No build-script change was made because the issue
could not be reproduced reliably and was outside this media/link package.

## Local visual and interaction QA

English and Chinese were inspected at `1440 × 1000` and `390 × 844` against the
exact current build.

- Five Archive cards at each state.
- Equal card heights: `221.22px` desktop and `148.19px` mobile.
- Both remote posters loaded in all four states.
- Four text action links and two linked poster frames.
- No nested links, horizontal overflow, or console errors.
- Desktop and mobile screenshots confirmed the posters remained legible and
  the English/Chinese dual actions fit the existing copy column.

Reduced-motion, no-JavaScript, and reel behavior were unchanged by this narrow
package and remain covered by the existing automated and prior visual QA.

## Deployment boundary

The exact deployed stage contained the same 22 approved public payload paths
as the preceding safe Preview package. The sorted relative path-list SHA-256
was unchanged:

`1940a63b96e81606d82bb164be8f66b9d9292da10c45d79474adc41e05505388`

The stage excluded repository history, source content, tests, reviews,
original media, unused assets, the unused India group photograph, and the
protected duplicate review file. Vercel control metadata was local-only. A
temporary `.env.local` OIDC file created by `vercel link` was deleted before
deployment and did not enter the approved payload or Git.

Vercel inspection reported:

- target: `preview`;
- status: `Ready`;
- function: `api/contact` (`2.55KB`, `iad1`).

No public Preview URL, route, image, or API request was made after deployment,
because the active `vercel-deploy` skill prohibits fetching the deployment.
No form submission or email side effect occurred.

## Review decision

External Claude/Gemini review was skipped. This was a narrow, reversible media
and evidence-link change with deterministic tests and matched visual checks;
it did not alter information architecture, privacy/security mechanisms,
migrations, production routing, or broad media processing.

## Open items and next action

1. Manually open the latest Preview and inspect the two poster cards and four
   text actions. Do not submit the contact form.
2. The branch remains local and unpushed. Ask the user to choose merge, PR/push,
   keep, or discard; do not infer the answer.
3. The remote Wikimedia poster URLs remain a third-party availability risk.
   The current `onerror` fallback removes a failed image without breaking the
   card.
