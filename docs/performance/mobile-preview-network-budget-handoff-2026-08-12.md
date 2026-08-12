# Mobile Preview Network Budget Handoff — 2026-08-12

## Authority And Baseline

- Producer accepted the proposed bounded package with `好` and requested this durable cold-start handoff.
- Local package branch: `codex/mobile-preview-network-budget`, created from closed commit `4193498208d74c01a4876f7550642c4cc8c7c3b4`.
- Closed tag, `origin/main`, `origin/codex/hero-portrait-refresh`, and `origin/backup/2026-08-12/4193498` resolved to that commit before branch creation.
- Ready Production is `dpl_7qt7gWyC42yTqStMZtHTKRSpu3vn` at `https://hsin-hsin-yuan-portfolio.vercel.app`, sourced from that commit.
- This authorizes read-only diagnosis and, only after reproduction, the smallest test-first local fix. It does not authorize Git push, `main`, Production, aliases, Contact, destructive Vercel actions, or protected-file changes.

## Matching PageSpeed Evidence

- Baseline report: `https://pagespeed.web.dev/analysis/https-hsin-hsin-yuan-portfolio-vercel-app-en/39xad34dkj?form_factor=mobile`, 2026-08-10 mobile `/en/`, Lighthouse 13.4.1, Performance 75, FCP 0.9s, LCP 6.7s, TBT 0ms, CLS 0, Speed Index 4.1s, 3,197 KiB.
- Current report: `https://pagespeed.web.dev/analysis/https-hsin-hsin-yuan-portfolio-vercel-app-en/4v5f0jwlil?form_factor=mobile`, 2026-08-12 mobile `/en/`, same Lighthouse/device/network/CPU settings, Performance 78, FCP 1.0s, LCP 6.3s, TBT 0ms, CLS 0, Speed Index 1.7s, 12,510 KiB; Accessibility, Best Practices, and SEO remain 100.
- CrUX has insufficient real-user data. Treat these as matching single-run lab observations, not visitor-wide evidence.
- Current audit names the brand text as the LCP node; the responsive Hero AVIF request is about 5.3 KiB. The prior audit named the Hero image.
- Current network evidence includes HTTP 206 requests for both Slow Steps sources: desktop fallback about 7.43 MB and mobile derivative about 2.29 MB. These audit transfer figures are a diagnostic signal, not yet proof of exact bytes received by a normal visitor.
- Current audit also finds a 1.69 MB remote Mirror Media PNG. It is third-party/link-first and must not be downloaded, edited, or rehosted without separate rights approval.

## Frozen Experience Contract

- Preserve approved posters, crops, card ratios and geometry, copy, links, first-tap preview/second-tap navigation, touch scrolling, hover/focus behavior, one playback owner, poster-until-`playing`, reduced motion, no-JavaScript, and lifecycle/reset behavior.
- Keep initial video markup `preload="none"`; never preload every reel. Keep canonical responsive sources derived from `data/media-manifest.json`.
- Do not trade visual fidelity or interaction quality merely to chase a PageSpeed score.

## Execution Plan

1. Run read-only preflight and protected-file verification before any edit.
2. Freeze the closed build, then collect at least three matched cold-cache mobile runs with identical viewport, network, CPU, and storage reset.
3. Record poster visibility, each MP4 request start/first byte/transferred bytes, `loadedmetadata`, `canplay`, `playing`, reveal time, Hero LCP, TBT, CLS, and the selecting user intent.
4. Prove whether both Slow Steps sources load before scroll/tap/focus and attribute the trigger to source selection, proximity warm, passive ownership, reset, or the measurement harness.
5. If not reproducible in the three-run median, do not change runtime; record the PageSpeed observation as non-reproducible and stop.
6. If reproducible, write failing focused tests first, then make the smallest fix that prevents unintended dual-source or premature media transfer while preserving intentional first-play latency.
7. Run focused tests, full `npm test`, build, media-manifest/integrity checks, `git diff --check`, privacy/protected-file checks, and matched desktop/mobile interaction QA.
8. Compare at least three matched after-runs by median. Use the standing-authorized static `dist/`-only Preview plus proactive Shareable Link only after all local gates pass; do not push Git or deploy Production.

## Acceptance And Stop Conditions

- Accept a fix only if unintended initial MP4 transfer is removed or materially reduced, only one evidence-backed candidate can warm, and cold request-to-`playing` remains materially acceptable.
- Hero LCP, TBT, CLS, accessibility, visual equivalence, touch scrolling, navigation, reduced motion, no-JS, ownership, stale-event, and error/reset behavior must not regress.
- Reject and remove an experiment if its improvement is immaterial or it worsens data use, first-play feel, Hero LCP, TBT, CLS, accessibility, or approved visuals.
- Stop after this bounded network-budget finding is accepted or rejected. Do not continue toward an arbitrary score such as 100; after a clean result, wait for CrUX or a separately approved package.

## Exact Next Action

Start with three matched cold-cache diagnostic runs on the exact closed baseline. Do not edit runtime until the dual-source/premature-transfer observation is reproducible and classified.
