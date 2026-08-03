# Women Make Waves press notes QA — 2026-08-03

## Outcome

**PASS_WITH_OPEN_ITEMS**

- Declared scope: preserve two user-supplied Women Make Waves Film Festival
  Facebook videos as a low-priority, bilingual portfolio record; distinguish
  verified participation from a companion event; keep the section text-only
  and outside Featured Works.
- Branch: `codex/contact-archive-entrypoints`
- Implementation and exact deployed checkout:
  `6908c70e48b9c3bfc9738fd71e286ce04c582c0e`
- Latest Preview:
  `https://hsin-hsin-yuan-portfolio-preview-7kgh2kg8o.vercel.app`
- Deployment: `dpl_A3pbY9xXZqSjbBh3NN11eS3C7QBv`; target `preview`;
  status `Ready`; created 2026-08-03 09:58:37 GMT+0800.
- Inspector:
  `https://vercel.com/projectmoonie-creators-projects/hsin-hsin-yuan-portfolio-preview/A3pbY9xXZqSjbBh3NN11eS3C7QBv`
- Production website/domain: unchanged.

## Source and claim decisions

The short Facebook URLs resolved to these canonical public destinations:

- Part 1: `https://www.facebook.com/watch/?v=257310076279164`
- Part 2: `https://www.facebook.com/watch/?v=412888580196820`

The official Women Make Waves records identify the videos as the upper and
lower halves of the 28th festival's selection guide event:

- Upper-half record: `https://www.wmw.org.tw/tw/title/733`
- Lower-half record: `https://www.wmw.org.tw/tw/title/734`

The upper-half record explicitly lists `袁欣欣` among the speakers and contains
passages attributed to her. The public card therefore says `Featuring
Hsin-Hsin Yuan` / `袁欣欣參與對談`. The lower-half record lists a different
speaker group and does not establish her participation in that half. Its card
therefore says only `Companion event archive` / `同場活動紀錄`.

Logged-out Facebook metadata was generic to Facebook Watch and provided no
reliable title or video-specific image. Both records are classified
`public-link-only`; no Facebook video or third-party image was downloaded,
edited, or rehosted. The section intentionally contains no image.

## User-visible contract

- `Press & Conversations` / `訪談與對談` appears after `FROM THE ARCHIVE` and
  before Contact, outside Featured Works.
- Desktop uses the established 40/60 page rhythm: a restrained section note at
  left and two equal program-style rows at right.
- Mobile becomes one column while retaining equal row geometry.
- Part 1 and Part 2 are direct public links with visible keyboard focus.
- Canonical records live in `data/press.json`, so future verified interviews
  can be added without duplicating renderer markup.

## Test-first and deterministic evidence

Three focused tests were added before production code. They failed for the
expected reasons: the canonical press collection, renderer, section placement,
and responsive CSS did not yet exist. The same tests passed after the coherent
data, generator, copy, and styling change.

| Check | Result |
| --- | --- |
| `node --test tests/build-site.test.mjs` | 29 passed, 0 failed |
| `npm test` | 39 passed, 0 failed |
| `npm run build` | passed |
| `npm run figma:export` | passed; no tracked generated diff |
| `git diff --check` | passed |

Generated English and Chinese HTML both contain the section, their respective
localized claims, and the two canonical Facebook destinations. Repository and
deployment-stage scans found no direct contact address, private absolute path,
or copied secret.

## Local visual and interaction QA

The exact build from the implementation commit was inspected with headless
Chromium at:

- desktop `1440 × 900`;
- compact desktop `1200 × 900`;
- tablet `834 × 1112`;
- mobile `390 × 844`;
- narrow mobile `360 × 800`;
- compact desktop with `prefers-reduced-motion: reduce`;
- compact desktop with JavaScript disabled.

Every state had two text-only cards, correct Archive → Press → Contact order,
visible acid keyboard focus, equal card heights, no body-level horizontal
overflow, and no console or page errors. Desktop list width remained larger
than the intro column; both columns became equal full width on mobile.

The English desktop and Chinese mobile screenshots and the Playwright script
were disposable `/private/tmp` QA artifacts, not portfolio assets.

## Deployment boundary

The reviewed Preview stage contained the same 22 approved public payload paths
as the preceding safe deployment. Its sorted relative path-list SHA-256 was:

`1940a63b96e81606d82bb164be8f66b9d9292da10c45d79474adc41e05505388`

The stage included only generated public pages, eleven referenced public media
assets, the contact endpoint, and minimal Vercel/package configuration. It
excluded Git history, source content, tests, reviews, original reel sources,
unused media, the India group photograph, and the protected duplicate review
file. The temporary `.env.local` OIDC file and generated staging `.gitignore`
were deleted before deployment and did not enter the payload.

Vercel inspection reported target `preview`, status `Ready`, and the
`api/contact` function (`2.51KB`, `iad1`). The Preview URL and contact endpoint
were not requested after deployment, in accordance with the active deployment
skill. No form submission or email side effect occurred.

## Review decision

External Claude/Gemini review was skipped. This is a narrow, reversible content
collection and responsive section with verified source distinctions,
test-first coverage, and a complete local browser matrix. It does not alter a
security mechanism, migration, production route, or broad media workflow.

## Accepted open items and next action

1. Manually inspect the latest Preview, especially the Press section and both
   outbound Facebook links. Do not submit the contact form.
2. Facebook remains a third-party availability and logged-out access risk. The
   page does not depend on Facebook images or metadata for its layout.
3. The branch remains local and 16 commits ahead of its recorded origin before
   this documentation commit. Ask the user to choose merge, push/PR, keep, or
   discard; do not infer the answer.
4. Add future interviews to `data/press.json` only after verifying the title,
   participation claim, public URL, and image rights independently.

Exact next action: have the user inspect the new full-site Preview, then choose
the branch finish option. Production promotion requires separate explicit
approval.
