# Chinese Interface Round 2 — Production Review Packet

Date: 2026-08-09 (Asia/Taipei)

Repository: `hsin-hsin-yuan-portfolio-remove-lights`

Branch: `codex/three-minute-watch-link`

Package baseline: `40413dba3e9e2b850a8803fb9add4c8635374353`

## Review objective

Review this frozen release candidate for production blockers. The producer has approved the P0 and P1 copy changes below, the existing mobile contact-heading spacing correction, and a Production release. Do not edit files. Return only evidence-backed findings that could make this release incorrect, unsafe, structurally fragile, or inconsistent between English and Chinese.

## Approved product scope

The workbook-to-repository work order contains nine stable-key entries and treats English and Chinese as independent fields. A `keep` operation must preserve that locale exactly. A `replace` operation must match the recorded old value before writing. A blank locale remains a modeled field but renders no empty content block; this package does not introduce any new blanks.

| Priority | Stable key | Approved result |
| --- | --- | --- |
| P0 | `site.heroSubcopy` | Chinese removes `，用我的方式`; English unchanged. |
| P0 | `site.contactTitleAccent` | Chinese changes `做出來。` to `說出來。`; English unchanged. |
| P1 | `featured.tech-dreamers.description` | Chinese becomes `從 AI 到深科技，鏡頭走進矽谷新創現場，訪談創始人的創業歷程。`; English unchanged. |
| P1 | `featured.my-art-my-voice.description` | Chinese becomes `巴黎文化奧運台灣館的演出與幕後，聽巴黎與台灣藝術家暢談創作、自由與身分。`; English unchanged. |
| P1 | `featured.interior-spatial-brand-films.description` | Chinese becomes `為幸福空間與居家品牌執導、看空間設計如何影響我們生活的每一處。`; English unchanged. |
| P1 | `featured.pts-taigi-bus.description` | Chinese becomes `以公車路線串起的地方記憶、飲食、市集，以及一路上遇見的人。`; English unchanged. |
| P1 | `featured.top-gear-china-uk-special.platform` | Shared scalar `China Dragon TV` is promoted to `{ en: "China Dragon TV", zh: "東方衛視" }`. |
| P1 | `press.wmw-28-selection-guide-part-1.part` | Chinese changes `上半場` to `座談`; English `PART 1` unchanged. |
| P1 | `archive.ghost-hand-divine-car.title` | English changes `Gui Shou Shen Che` to `The Mechanic`; Chinese `鬼手神車` unchanged. |

Source workbook provenance:

- `Hsin-Hsin-Yuan-Portfolio-Chinese-Interface-Manager-2026-08-09-round-2.xlsx`: SHA-256 `7776b75a3e261404609f6f34588e177772785338fdbcf54f954de12b69e3106e`
- `Hsin-Hsin-Yuan-Portfolio-Chinese-Interface-Manager-2026-08-09-round-2-corrected.xlsx`: SHA-256 `e11149074243523b0276f5042831796d9c2737f3a80f4fea64603dbeed7bce3a`
- Canonical guarded work order: `editorial/copy-work-orders/2026-08-09-chinese-interface-round-2.json`

## Importer changes under review

The guarded importer was extended in `scripts/lib/copy-work-order.mjs` so future workbooks can target global Press rows by stable ID and safely promote a small set of intentionally localizable shared scalar fields.

1. `press.<id>.<property>` is accepted only when `sourceFile` is `data/press.json`.
2. Press resolution searches the JSON array for an exact `record.id` and fails unless exactly one row matches.
3. Pure JSON structural-token editing now supports both `data/site.json` and `data/press.json` without serializing the full document.
4. A shared string can be promoted to `{ en, zh }` only for this explicit allowlist:
   - `featured.<slug>.platform`
   - `featured.<slug>.press[<index>].source`
   - `press.<id>.source`
5. When promotion is allowed, both locale changes must first match the same recorded current scalar. `keep` copies the scalar into that locale; `replace` or `blank` supplies the other final value. The importer replaces exactly one structural JSON string token with the paired object.
6. All ordinary bilingual objects still resolve to their locale leaf. Non-allowlisted shared scalars fail closed.
7. Stable keys remain unique; source paths are normalized and repository-relative; exact-key schema validation rejects undeclared fields; structural token lookup and expected-current-value guards must each match exactly once.

Representative algorithm excerpts:

```js
function supportsSharedScalarPromotion(stableKey) {
  return [
    /^featured\.[a-z0-9-]+\.platform$/,
    /^featured\.[a-z0-9-]+\.press\[\d+\]\.source$/,
    /^press\.[a-z0-9-]+\.source$/,
  ].some((pattern) => pattern.test(stableKey));
}

const matches = parsed
  .map((record, index) => ({ record, index }))
  .filter(({ record }) => record?.id === id);
if (matches.length !== 1) fail(`${entry.stableKey} must match one Press id`);
```

For an allowed shared scalar, planning first resolves the one current string, checks that value against both locale `expected` values, derives final `en` and `zh` values, locates exactly one structural string token, and records a single source replacement. The existing writer applies replacements back-to-front, verifies the final source bytes, and restores original files if any write fails.

## Rendering and layout contract

- The site build reads bilingual values through the existing locale projection; the newly promoted Top Gear platform is expected to render `China Dragon TV` in English and `東方衛視` in Chinese.
- Empty optional copy remains omitted from the DOM, so later blank workbook cells do not leave layout holes and the following block moves upward independently per locale.
- The approved mobile contact-heading correction already exists in the release baseline: at widths up to 460 px, `.contact h2` uses `line-height: 1.02`. No additional styling or global typography change is introduced in this package.

## Validation evidence

The release candidate was validated locally before freezing this packet:

- Repository tests: 144/144 passed, including the nine-field final-state assertion, Press ID resolution, allowed shared-scalar promotion, rejection of non-localizable scalar promotion, replay rejection, rollback, and exact-current-value conflict tests.
- Production build: passed.
- Figma export parity: passed.
- Design-contract audit: passed with 6 Featured works, 5 Archive works, 2 global Press entries, and 3 work-level Press entries; no drift.
- Whitespace/error-marker check: passed.
- Browser matrix: 14/14 scenarios passed across English and Chinese, desktop/tablet/mobile widths, reduced-motion mobile, and JavaScript-disabled mobile.
- Browser assertions included exact approved copy, `1.02` mobile contact line height at 390 px and 360 px, two visibly separated heading lines, zero horizontal overflow, zero empty optional content nodes, 6 Featured cards, 5 Archive rows, visible keyboard focus, and no console, page, or same-origin request failures.
- Reduced-motion scenarios hid video reels and made no MP4 requests.
- No contact-form POST was made during QA.
- English desktop/mobile and Chinese desktop/mobile screenshots were visually inspected; no clipping, overlap, unintended blank gap, or bilingual fallback error was observed.

## Privacy, rights, and non-goals

- No credentials, contact submissions, personal workbook paths, private environment values, or machine-specific absolute paths are included in the release files.
- Workbook files remain outside the repository; only their basenames and hashes are recorded.
- No media, URLs, contact API behavior, deployment configuration, or English copy beyond `The Mechanic` is changed.
- A separate future package may explore restrained light effects, improved buttons, and other small UI changes. Those ideas are explicitly outside this release candidate.
- The protected untracked review document `docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md` is outside scope and must remain untouched and uncommitted.

## Requested review dimensions

1. Does the stable-key work order preserve bilingual independence and exact-value conflict detection?
2. Is global Press ID resolution deterministic and fail-closed?
3. Is shared-scalar promotion restricted to a defensible localizable allowlist, with correct paired-locale semantics?
4. Could structural token replacement, rollback, or replay behavior corrupt unrelated source content?
5. Do any approved copy or rendering changes introduce a release-blocking content, layout, privacy, or accessibility issue?

## Required response format

Begin with exactly one verdict:

- `VERDICT: PASS`
- `VERDICT: NEEDS_REVISION`

Then list findings, if any, in this format:

`[severity: blocker|major|minor] location — evidence — required remediation`

Use `PASS` when there is no blocker or major issue. Minor observations may be reported but must not expand the approved scope. Do not edit the repository.
