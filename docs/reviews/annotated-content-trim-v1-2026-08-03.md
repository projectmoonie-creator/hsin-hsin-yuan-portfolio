# Annotated content trim QA — 2026-08-03

## Outcome

**PASS_WITH_OPEN_ITEMS**

- Declared scope: apply the user's six annotated mobile screenshots without
  redesigning the established portfolio system.
- Branch: `codex/contact-archive-entrypoints`
- Implementation and exact deployed checkout:
  `34b5d41bcc48d581c6d18167dbad024ddca18489`
- Design contract and implementation plan:
  `docs/superpowers/specs/2026-08-03-annotated-content-trim-design.md` and
  `docs/superpowers/plans/2026-08-03-annotated-content-trim.md`
- Latest Preview:
  `https://hsin-hsin-yuan-portfolio-preview-jfahkwa2x.vercel.app`
- Deployment: `dpl_EphnKSXpHtgnR8TCKod1BkEiX1QQ`; target `preview`;
  status `Ready`; created 2026-08-03 at approximately 10:30 GMT+0800.
- Inspector:
  `https://vercel.com/projectmoonie-creators-projects/hsin-hsin-yuan-portfolio-preview/EphnKSXpHtgnR8TCKod1BkEiX1QQ`
- Production website/domain: unchanged.

## User-visible contract

- The second Hero role line is plain `Cross-Cultural Storyteller` / `跨文化敘事者`;
  the green slash remains only as a separator within the first role line.
- `Design & Brand Films` keeps only the `LG / Samsung` proof point, removes the
  passive `Selected reel` badge, and uses one active `Watch selected reel` /
  `觀看精選短片` action.
- `Nothing by Bus` keeps only `travel factual`, `Taiwanese`, and `local culture`;
  the duplicate `public media`, `3+`, and `PTS` proof items are removed.
- `Top Gear China: UK Special` keeps the four-number block and adds a clear
  season/audience heading plus explicit labels for the first five episodes,
  weekly live audience, reported TV rating, and four-week national time-slot
  rank.
- All small external-arrow glyphs are removed from Archive and Press while
  their link text, destinations, focus states, and media behavior remain.
- The bottom section is simply `PRESS`, with no descriptive subcopy and only
  the upper-half Women Make Waves record that verifies Hsin-Hsin Yuan's
  participation. The lower-half companion link is removed.

## Top Gear evidence decision

The existing `200M` display value is retained as the user's preferred rounded
portfolio figure, but it is no longer presented without context. A
contemporaneous Advanced Television report records 217 million combined
television and online viewers across the first five Season 2 episodes, a 9
million weekly live average, and four weeks at number one nationally in the
time slot:

`https://www.advanced-television.com/2015/11/20/top-gear-china-draws-217m-viewers/`

The report also identifies the UK episode separately. The `0.81` TV-rating
figure remains sourced only to the user-provided CV and is labelled as a
reported rating rather than independently verified public evidence. The work
frontmatter records the public source URL, check date, and this distinction.

## Test-first and deterministic evidence

Focused regression assertions were written before production changes. After
fixing two escaped slashes in the new regular expressions, the old site failed
for the intended eight contract differences: two Press items and arrows,
outdated work metrics/tags/actions, missing Top Gear context, and the Hero slash
in both generated HTML and Figma parity. All focused tests passed after the
coherent data, renderer, CSS, and Figma update.

| Check | Result |
| --- | --- |
| `node --test tests/build-site.test.mjs tests/figma-export.test.mjs` | 32 passed, 0 failed |
| `npm test` | 39 passed, 0 failed |
| `npm run build` | passed |
| `npm run figma:export` | passed; two tracked SVG parity files updated |
| `git diff --check` | passed |

Repository and generated-output scans confirmed that active content contains
none of the removed Press companion ID, arrow glyph, retired Press subcopy,
`20+`, `episode leads archived`, `public media`, or `Taiwanese language`
strings. The protected duplicate review file remains untracked and untouched.

## Local visual and interaction QA

The exact build from implementation commit `34b5d41` passed native Playwright
Chromium checks at:

- desktop `1440 × 900`;
- compact desktop `1200 × 900`;
- tablet `834 × 1112`;
- mobile `390 × 844`;
- narrow mobile `360 × 800`;
- English and Chinese mobile content;
- mobile `prefers-reduced-motion: reduce`;
- mobile with JavaScript disabled;
- keyboard focus on the remaining Press link.

Every state had one Press record, five equal Archive cards, the intended work
tags/metrics/actions, four contextualized Top Gear metrics, no body-level
horizontal overflow, and no console or page errors. Element screenshots for
Hero, Design, Nothing by Bus, Top Gear, Archive, and Press were visually
inspected at desktop and mobile sizes. The single Press row remains balanced in
the established 40/60 desktop layout and collapses cleanly to one mobile
column.

The Playwright script and screenshots were disposable `/private/tmp` QA
artifacts, not portfolio assets.

## Deployment boundary

The Preview stage contained the same 22 approved public payload paths as the
preceding safe deployment. Its sorted relative path-list SHA-256 was:

`1940a63b96e81606d82bb164be8f66b9d9292da10c45d79474adc41e05505388`

The stage included only generated public pages, eleven referenced public media
assets, the contact endpoint, and minimal Vercel/package configuration. It
excluded Git history, source content, tests, reviews, original reel sources,
unused media, the India group photograph, and the protected duplicate review
file. The temporary `.env.local` OIDC file and generated staging `.gitignore`
were deleted before deployment and did not enter the payload.

Vercel reported deployment `dpl_EphnKSXpHtgnR8TCKod1BkEiX1QQ` as `READY`.
The Preview URL and contact endpoint were not requested after deployment, in
accordance with the active deployment skill. No form submission or email side
effect occurred.

## Review decision

External Claude/Gemini review was skipped. This package applies an already
annotated, narrow, reversible content trim with deterministic tests, Figma
parity, and a complete local browser matrix. It does not alter a security
mechanism, migration, production route, or media workflow.

## Accepted open items and next action

1. Manually inspect the latest Preview, especially Top Gear's clarified proof
   block and the single Press row. Do not submit the contact form.
2. The remaining Women Make Waves destination is a public Facebook link and
   retains third-party availability and logged-out access risk.
3. The `0.81` Top Gear value remains CV-sourced; the other audience context is
   publicly corroborated as described above.
4. The branch remains local and will be 20 commits ahead of its recorded origin
   after the documentation commit. Ask the user to choose merge, push/PR, keep,
   or discard; do not infer the answer.

Exact next action: have the user inspect the new full-site Preview, then choose
the branch finish option. Production promotion requires separate explicit
approval.
