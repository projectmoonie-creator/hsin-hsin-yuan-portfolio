# Final Chinese Interface — Frozen Release Review Packet

Date: 2026-08-09

Repository: Hsin-Hsin Yuan Portfolio

Branch: `codex/three-minute-watch-link`

Frozen candidate: `0ad90f2a2e6e244f986ae52e05ad657f6d605cd5`

Mechanism baseline: `eaab7c49acc949989b21a584d13b38d56960d334`

Review mode: read-only; do not implement changes

## Producer mandate

Publish the final Chinese workbook edits while keeping English unchanged.
An exact-empty Chinese cell must retain its stable canonical field but omit the
complete corresponding rendered element, so following content flows upward
without a visual hole. English and Chinese may make this decision separately.
The format must stay replaceable through stable keys rather than raw-text
search. The protected untracked document must remain unmodified and outside
Git. Preview must precede Production.

## Frozen source evidence

- Workbook:
  `Hsin-Hsin-Yuan-Portfolio-Chinese-Interface-Manager-2026-08-09-reconciled-v3.xlsx`
- Workbook SHA-256:
  `ebc35ed3ec878e6a9f4eaafcf9e1a04529eb4fc7bc436b44a31a7fb64959c2f4`
- Canonical work order:
  `editorial/copy-work-orders/2026-08-09-final-chinese-interface.json`
- The work order has 54 stable-key entries: 19 P0 and 35 P1.
- All 54 English operations are `keep`.
- Chinese has 50 `replace` operations and four `blank` operations.
- The four exact-empty Chinese fields are:
  - `site.heroTitleLines[1]`
  - `featured.tech-dreamers.press[0].title`
  - `featured.my-art-my-voice.press[0].title`
  - `featured.top-gear-china-uk-special.tagline`
- Eleven canonical source files are touched: `data/site.json`, five Featured
  Markdown records, and five Archive Markdown records.
- The repository postcondition verifier resolved all 108 final locale values:
  `entries=54`, `fields=108`, `matches=108`, `conflicts=0`, `writesFiles=false`.

Representative approved Chinese changes include the Hero title `袁欣欣`, Hero
subcopy beginning `我從小就是個愛聽故事的人`, `幸福空間與品牌影像`,
`觀看精選影片`, `歷年作品`, `媒體報導`, `官方頁面`, `報導`, and Archive
title `土炮特攻隊`. The review must treat these as producer-authored copy; only
report factual encoding, contract, accessibility, or rendering defects.

## Mechanism under review

The renderer filters exact-empty Hero title lines before producing spans:

```js
const heroTitleLines = (copy.heroTitleLines || [copy.heroTitle])
  .filter(hasRenderableText)
  .map((line) => `<span>${escapeHtml(line)}</span>`)
  .join("");
```

Work Press keeps its bilingual title field but allows an exact-empty locale.
Whitespace-only remains invalid. The renderer omits the entire title element:

```js
const title = localize(item.title, lang);
const titleElement = hasRenderableText(title)
  ? `<strong>${escapeHtml(title)}</strong>`
  : "";
```

The work-order engine resolves stable site, Featured, Archive, shared
HeroMedia, and system-navigation keys. `verifyCopyWorkOrderResult()` rereads
canonical files and fails if any final keep/replace/blank value differs from
the work-order postcondition.

The design contract now states that an approved exact-empty localized value
retains its source field but omits its complete rendered element. The owning
module remains structurally present. Work Press type, source, thumbnail,
destination, and audit metadata remain visible/preserved when its localized
title is empty.

## Deterministic validation

- Full unit/contract suite: `139/139` passing.
- Build: passing.
- Figma export: passing.
- Design-contract audit: passing; `6 Featured / 5 Archive / 2 global Press /
  3 work Press`; no active drift.
- `git diff --check`: passing.
- Built English HTML SHA-256 is exactly unchanged from the pre-copy baseline:
  `84e7933a7c41fa5a867c0f6fd8423dbd57e1afeb41576eb97280ea74e548d7b3`.
- Built Chinese HTML SHA-256:
  `ec342d39f7eaed08c6c41de0372d37eb4a01df774a8c5028ccc5adeadc65d73b`.
- No empty Hero spans, Work taglines, or Work Press title elements are emitted.
- Chinese Hero has one title span; English retains two title spans.
- Both Chinese official-page cards retain type/source/link and emit no
  `<strong>` title; English retains both `Official program page` titles.

## Native Chromium validation

Sixteen of sixteen read-only cases passed:

- English and Chinese at `1440×900`, `1200×900`, `834×1112`, `390×844`, and
  `360×800`.
- English and Chinese reduced-motion at `390×844`.
- English and Chinese with JavaScript disabled at `390×844`.
- Chinese keyboard focus.
- Chinese mobile Featured reel playback.

Across the matrix: HTTP 200, zero horizontal overflow, zero empty rendered
copy elements, zero console/page/same-origin request errors, and zero Contact
POSTs. Chinese exact copy was present and retired Chinese tokens were absent.
The Hero stayed within the viewport at every size. Reduced motion and no-JS
made zero MP4 requests. On mobile the Featured reel stayed on its poster at
about 420ms, began muted inline playback at about 740ms (the contract is a
700ms hold), and advanced afterward.

Visual inspection confirmed the Chinese desktop/mobile Hero uses one `袁欣欣`
line without an empty second line. Both official-page cards collapse naturally:
Tech Dreamers shows image + `官方頁面` + `TaiwanPlus`; My Art, My Voice does the
same, while its separate `報導` card retains its title.

## Safety and durability

- Protected untracked file:
  `docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md`
- Its SHA-256 remains:
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.
- It is not part of candidate commit `0ad90f2`.
- Exact remote recovery ref read back successfully:
  `backup/2026-08-09/final-chinese-portfolio-0ad90f2` →
  `0ad90f2a2e6e244f986ae52e05ad657f6d605cd5`.
- No Preview or Production deployment is part of this frozen candidate yet.

## Requested adjudication

Return a concise release review with:

1. `Decision: APPROVE` or `Decision: BLOCK`.
2. Findings ordered by severity (`P0`, `P1`, `P2`) with exact evidence from
   this packet; do not invent inaccessible repository facts.
3. Explicit checks of locale-specific blank semantics, English preservation,
   accessible/valid HTML behavior, stable-key/postcondition safeguards,
   responsive/mobile risk, and protected-file/deployment boundaries.
4. If blocking, identify the smallest bounded remediation and the validation
   that would prove it. If there are no release blockers, say so directly.
