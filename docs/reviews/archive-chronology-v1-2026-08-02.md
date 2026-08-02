# Archive Chronology v1 Closeout

Date: 2026-08-02

Outcome: `PASS_WITH_OPEN_ITEMS`

## Reviewed Baseline

- Branch: `codex/contact-archive-entrypoints`
- Immediate parent: `e4338006c3b88835b8b50c964d66bd34a35003b5`
- Reviewed implementation commit:
  `e5d7aa680a2f6a2c8df14d4ccf007d0fdfdfcaa0`
- Preserved phase baseline tag: `portfolio-phase-2026-07-29-closed`
- No Preview or production deployment was created or replaced.

## Scope

This package makes `FROM THE ARCHIVE` one descending chronological stream:

1. `Gui Shou Shen Che / 鬼手神車` (2018)
2. Three-Minute Micro Drama (2017-2018)
3. `Heart of Steel / 鋼鐵之心` (2014-2015)
4. `Lying Game / 謊言遊戲` (2013-2014)
5. `Overclocking` (2011-2013)

It preserves the existing text-only, supporting-media, and lead-media visual
treatments. Card size no longer owns or overrides chronology.

This package does not add or verify early CV credits, change copy or public
links, create reels, download collaboration logos, alter media rights, deploy a
Preview, promote production, rewrite Git history, or delete old deployments.

## Findings And Decisions

### Resolved

- The previous generator split media cards from text-only entries, moved the
  `lead` media card ahead of supporting cards, and then rendered the text-only
  ledger afterward. This made the 2011-2013 `Overclocking` card appear before
  all newer Archive entries.
- Archive items now render once, directly from canonical `order`, inside one
  `archive-chronology` container.
- On desktop, the two supporting media cards share a row. Text-only entries
  and the lead card span the full chronology. At tablet and mobile widths the
  chronology becomes one column without changing DOM order.

### Accepted Open Items

- The existing Figma SVG export does not materialize Archive item content, so
  it has no parallel Archive ordering array to update. `npm run figma:export`
  produced no tracked change. A future editable Archive design layer should be
  generated from the same canonical collection rather than added by hand.
- The pre-existing untracked file
  `docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md` remains
  untouched. It differs from the tracked review in the recorded implementation
  SHA and must be identified before another package edits or removes it.
- The previously accepted content, evidence, media, logo, privacy-history, and
  deployment decisions remain open in `STATUS.md`.

## Test-First Evidence

- A new regression test first failed with the observed order
  `ghost-hand-divine-car`, `three-minute-micro-drama`, `overclocking`,
  `heart-of-steel`, `lying-game`.
- After the minimal implementation, the focused test passed with the required
  descending order and a single `archive-chronology` container.
- `npm test`: 24 passed, 0 failed.
- `npm run build`: passed.
- `npm run figma:export`: passed with no tracked output change.
- `git diff --check`: passed.
- Generated English and Chinese HTML contain the same five-item chronology.
- Active-layer search found `archive-chronology` in the generator, CSS, tests,
  and both generated languages; retired `archive-media-grid` and
  `archive-list` output is absent.
- Existing privacy regression tests for the direct contact address and private
  absolute paths passed. No public claim, destination, metric, media source, or
  contact behavior changed.

## Visual And Interaction Evidence

The current build was served from this exact worktree on local port `4187`.
The `.archive-chronology` selector was verified before capture.

- English: `1440x900`, `1200x900`, `834x1112`, `390x844`, `360x800`
- Chinese: `1440x900`, `390x844`
- `prefers-reduced-motion: reduce`
- JavaScript disabled at `390x844`
- keyboard focus on the first public Archive link
- body and document overflow checks

Matched English desktop and mobile captures were also produced from detached
baseline worktree `e433800`. They confirmed that the old layout placed
`Overclocking` first, while the candidate preserves the same visual vocabulary
in descending chronology. The detached worktree was removed afterward.

All checked layouts had the required order, no horizontal overflow, visible
link focus, and no browser console or page errors. The screenshots and QA
script under `/private/tmp` are disposable evidence and are not portfolio
assets.

## External Review Decision

No Claude or Gemini review was dispatched. The change is a narrow, reversible
single-section ordering correction with no new public facts, privacy/security
mechanism, migration, deployment, or shared media contract. It is covered by a
test-first regression, full deterministic checks, matched visual comparison,
responsive bilingual QA, reduced-motion, no-JavaScript, focus, and overflow
checks.

## Deployment And Recovery

- No Preview was created.
- Production was not changed.
- Revert reviewed implementation commit `e5d7aa6` to restore the immediately
  preceding layout and ordering behavior.
- No new tag was created because this is a bounded refinement after the
  preserved substantial-phase tag.

## Durability Question

What changed in this package that is not in a repository, durably backed up,
or pushed?

- Matched screenshots and the Playwright QA script are disposable files under
  `/private/tmp`; they do not need retention.
- The pre-existing untracked duplicate review remains an explicitly recorded
  risk and was not created or modified by this package.
- Implementation, contract test, active project rule, closeout, and resume
  state are retained in this repository package.

## Exact Next Action

First identify whether the pre-existing untracked duplicate review is valid
evidence or an accidental copy without deleting it. Then start a separate
`Collaboration Logo Wall Source Verification` package: confirm the exact
Dragon TV and ScreenHouse identities and official domains before downloading
or publishing any mark.
