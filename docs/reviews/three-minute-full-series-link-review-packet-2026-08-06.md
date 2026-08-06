# Frozen read-only review packet — Three-Minute full-series link

Date: 2026-08-06  
Repository: `hsin-hsin-yuan-portfolio-remove-lights`  
Branch: `codex/three-minute-watch-link`  
Baseline HEAD: `8b183320b7e96cdf065ef8d727e2049224eba097`  
Scope state: uncommitted implementation diff; review before commit

## Objective

Expose the producer-supplied public YouTube playlist from the existing
Three-Minute Micro Drama Series Archive card in both site languages:

- Destination: `https://www.youtube.com/playlist?list=PLDTnN3czXyG8`
- English action: `Watch the full series`
- Chinese action: `觀看完整系列`

Use the existing Archive-card `watchUrl` / `watchLabel` contract so the card
itself is the action. Keep the current card order, visual design, slideshow,
reel behavior, Figma export, and all other content unchanged.

## No-edit instruction

Review only. Do not edit files, run deployment, push, merge, or request access
to credentials. Report findings only against this frozen packet.

## Non-goals

- No renderer, CSS, JavaScript, media, slideshow, reel, or Figma change.
- No claim about playlist ownership beyond the producer's public-use approval.
- No change to `main`, Preview, Production, alias, or Contact behavior.
- No modification or Git addition of protected untracked review files.

## Canonical content delta

`content/archive/three-minute-micro-drama.md` adds:

```json
"watchUrl": "https://www.youtube.com/playlist?list=PLDTnN3czXyG8",
"watchLabel": {
  "en": "Watch the full series",
  "zh": "觀看完整系列"
}
```

The existing generic Archive renderer already turns an item with `watchUrl`
into an anchor, carries the localized label into its accessible name, and
renders the label in the card action slot.

## Regression-test delta

`tests/build-site.test.mjs` now proves:

1. The Three-Minute canonical data contains the exact URL and bilingual label.
2. Archive output remains five cards, now with two anchors and three articles.
3. English markup contains the exact playlist, accessible name
   `Watch the full series: Three-Minute Micro Drama Series`, and visible action.
4. English page output contains exactly two full-series actions and the new
   exact playlist destination.
5. Chinese output contains exactly two `觀看完整系列` actions and the exact
   accessible name `觀看完整系列: 三分超微劇系列`.

## Validation already completed

- RED: focused tests failed because the Three-Minute `watchUrl` was undefined
  and Archive still rendered one link instead of two.
- GREEN focused data/render suite: 2/2.
- Full `tests/build-site.test.mjs`: 38/38.
- Full project suite: 111/111.
- Build: pass.
- Figma export: pass, with no tracked Figma delta.
- Design-contract audit: pass (`6 Featured / 5 Archive / 2 global Press /
  3 work Press`; no active drift).
- `git diff --check`: pass.
- Browser QA: English 1440×900 and Chinese 390×844 each expose exactly one
  Three-Minute link; exact `href`, localized text, localized accessible name,
  and captured click destination all pass. No horizontal overflow, console
  errors, same-origin request failures, or Contact submissions were observed.

## Requested review dimensions

1. Incorrect or unsafe destination, label, or accessible-name behavior.
2. Contract mismatch between the canonical frontmatter and existing renderer.
3. English/Chinese output divergence or incorrect action counts.
4. A realistic missing regression test for this exact data-only package.
5. Any evidence that this change could affect unrelated Archive cards.

Do not block on subjective wording or capitalization without a concrete
contract, accessibility, or rendering defect.

## Required output schema

Return exactly:

```text
VERDICT: PASS | PASS_WITH_FINDINGS | BLOCK
MODEL: <observed model ID if available, otherwise unknown>
FINDINGS:
- [P0|P1|P2] <file/area>: <reproducible issue and evidence>
  Recommendation: <bounded correction>
or
- None.
RESIDUAL_RISK:
- <short item or None>
```

Only P0/P1 findings with current packet evidence may block this package.
