# Read-only review packet: P0 Hero LCP optimization

## Objective and authorization

Review the local bounded package on branch `codex/hero-lcp-optimization`, based on frozen pre-change commit `5483bfa02d2586d981e241d7903b8a857aace530`. The package replaces the approved Hero's CSS-background delivery with a canonical-data-driven responsive `<picture>/<img>`, verified AVIF/WebP/JPEG derivatives, high-priority discovery, and transform-only slow push while preserving the exact approved photo, crop, text, layout, and reduced-motion appearance.

This is read-only review. Do not edit files, run deployment, create Preview, change aliases, submit Contact, merge, or push `main`.

## Non-goals

- No third-party thumbnail rehosting, global image/cache pipeline, light effects, copy changes, Contact changes, Archive/Featured behavior changes, deployment, or `main` operation.
- Do not require a production PageSpeed rerun: deployment is not authorized and the supplied production result is one lab run without sufficient CrUX data.

## Primary implementation paths

- `data/site.json`
- `scripts/lib/hero-image-delivery.mjs`
- `scripts/prepare-hero-images.mjs`
- `scripts/lib/portfolio-contract.mjs`
- `scripts/build-site.mjs`
- `src/styles.css`
- `package.json`
- `public/assets/portfolio/hero/`
- `tests/hero-image-delivery.test.mjs`
- `tests/portfolio-contract.test.mjs`
- `tests/build-site.test.mjs`
- `tests/figma-export.test.mjs`
- `tests/hero-media.test.mjs`
- `docs/design-contract.md`
- `scripts/build-figma-export.mjs`
- `figma-export/README.md`

## Intent and evidence paths

- `docs/superpowers/specs/2026-08-10-hero-lcp-visual-equivalence.md`
- `docs/superpowers/plans/2026-08-10-hero-lcp-optimization.md`
- `docs/reviews/evidence/hero-lcp-optimization/after/visual-comparison.json`
- `docs/reviews/evidence/hero-lcp-optimization/after/interaction-summary.json`
- `docs/reviews/evidence/hero-lcp-optimization/after/performance-comparison.json`
- `docs/reviews/evidence/hero-lcp-optimization/before/lighthouse-devtools-summary.json`
- `docs/reviews/evidence/hero-lcp-optimization/after/lighthouse-devtools-summary.json`
- `docs/reviews/evidence/hero-lcp-optimization/before/lighthouse-stable-summary.json`
- `docs/reviews/evidence/hero-lcp-optimization/after/lighthouse-sync-summary.json`

## Current validation

- RED phase: 64/73 passed; nine expected failures covered missing schema/helper/derivatives/CLI/markup and forbidden legacy CSS.
- Final `npm test`: 147/147 pass.
- `npm run build`, `npm run audit:design-contract`, `npm run figma:export`, `npm run hero:prepare -- --check`, and `git diff --check`: pass.
- Figma SVGs: byte-identical; only generated README workflow text changed.
- Prepare executed twice: the same 12 output SHA-256 values; all source SHA, codec, decoded dimension, and JPEG metadata checks pass.
- Visual equivalence: five matched desktop/mobile start/end/reduced screenshots; geometry max drift 0 px; RGB MAE 0.442–0.717/255; at least 99.8815% channel samples within absolute 16.
- Browser matrix: seven bilingual desktop/compact/tablet/mobile/narrow/reduced/no-JS cases pass; one selected responsive Hero request per case, High initial priority, no overflow, page errors, local request failure, or Contact POST.
- Direct DevTools-throttled Lighthouse 13.4.1 mobile medians, three runs per side: Performance 0.73→0.97; FCP 2143.462→2017.077 ms; LCP 6733.564→2017.077 ms; Hero transfer 195225→4410 B; Speed Index 4013→2966 ms; TBT 0→0; CLS 0→0.
- Simulated medians are disclosed rather than hidden: total modeled LCP 4878.116→4877.315 ms (effectively flat), while modeled LCP load duration 1379→1018 ms. Direct throttling is the primary local outcome.
- LCP discovery score 0→1; non-composited animation items 1→0.
- Protected untracked document remains unstaged and unchanged at SHA-256 `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.

## Requested review dimensions

1. Confirm that `heroMedia` remains the only authored Hero source of truth and that candidate URLs are recipe-derived, not a second manual list.
2. Audit schema/path/hash/quality/profile validation, derivative generation, staging, metadata checks, determinism, and failure behavior.
3. Audit preload/picture candidate parity, media ordering, fallback behavior, intrinsic/localized accessibility fields, eager/high priority, and duplicate-request risk.
4. Audit the focal-point/scale transform math, compositor-only animation, breakpoint selection, and completely static reduced-motion behavior against the declared visual contract.
5. Audit the performance methodology, especially the transparent difference between simulate and direct DevTools throttling; flag any overclaim or invalid comparison.
6. Check scope/authorization boundaries and identify any Contact, unrelated behavior, deployment, private-path, or protected-file leakage.

## Required output

Return Markdown with:

- `Verdict`: `PASS`, `PASS_WITH_FINDINGS`, or `BLOCK`.
- `Findings`: ordered by severity. Every blocker or major finding must cite current file and line, explain a reproducible failure, and propose bounded remediation. Write `None` if none.
- `Evidence assessment`: what the local results prove and do not prove.
- `Authorization audit`: confirm whether the package stayed within the stated boundary.
- `Review provenance`: requested, observed, and completed model IDs if available.

Do not modify the repository.
