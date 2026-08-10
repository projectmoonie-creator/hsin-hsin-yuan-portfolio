# Hero LCP Delivery Architecture — Frozen Brainstorm Packet

Decision owner: producer. The producer has already authorized a bounded local P0 implementation and fixed the visual/content/non-goal boundaries below. The remaining decision is the smallest maintainable delivery architecture that satisfies those boundaries; this brainstorm may identify risks and experiments but may not redesign the Hero or edit the repository.

## Current evidence

- Closed public-code baseline: `82893899dad3e4f393720e2efd71b1e1cb02a350`; working branch also contains one docs-only PageSpeed commit and no public-code difference.
- Production mobile PageSpeed reference: Performance 75, FCP 0.9s, LCP 6.7s, TBT 0ms, CLS 0, Speed Index 4.1s, about 3,197 KiB; insufficient CrUX field data.
- Local matched Lighthouse 13.4.1 mobile-simulated median of three: Performance 0.82, FCP 1202.7241ms, LCP 4877.485ms, TBT 0ms, CLS 0, Hero transfer 195,225 bytes.
- CDP records the current Hero request at initial priority `Low`. Lighthouse reports `priorityHinted=false` and the Hero request is discoverable/eager.
- Lighthouse reports one non-composited `heroStillPush` animation: `background-position-x`, `background-position-y`, and `background-size`.
- The current Hero source is a sanitized 1920x1440 owned JPEG. `data/site.json.heroMedia` is already the canonical website/Figma record with bilingual alt, intrinsic dimensions, three focal points, motion, and evidence-only rights status.
- The site renderer currently emits one preload plus an empty `DIV role=img`; CSS owns the source through a custom property. Figma consumes the normalized HeroMedia `src`, dimensions, focal point, and motion start scale.
- Available local encoders: `ffmpeg`, `ffprobe`, and `cwebp`; the project has no runtime dependencies.

## Required outcome

1. Preserve the approved photo, crop/focal behavior, frame ratio, text/geometry, gradients, and 18-second slow-push feel on desktop, stacked, and mobile.
2. Emit semantic initial-HTML `<picture>/<source>/<img>` with intrinsic dimensions, bilingual alt, eager/high priority, responsive mobile/desktop AVIF/WebP and JPEG fallback.
3. Responsive preload and the selected picture candidate must agree; no duplicate Hero download.
4. Only compositor-safe `transform` may animate. Reduced motion must be completely static.
5. Website, Figma export, future replacement, and derivative preparation must consume one normalized HeroMedia truth; no parallel hand arrays.
6. Derivatives must be produced by a repeatable prepare mechanism that verifies canonical source SHA-256, dimensions, formats, paths, and metadata safety.
7. Work test-first and prove request priority, non-composited warning removal, Hero byte reduction, LCP improvement, and no TBT/CLS regression with three matched runs.

## Constraints and non-goals

- No copy, Contact, other works, Archive behavior, third-party thumbnail hosting, P1 site-wide image pipeline, lighting/button effect, Preview, deployment, alias, `main` merge/push, or Contact submission.
- Do not add a second Hero manifest, renderer-specific source list, or Figma-only values.
- Do not rely on subjective screenshot approval: use frozen matched start/end/reduced screenshots, geometry, and pixel-difference statistics.
- Prefer a minimal extraction at the current Hero owners; avoid an unrelated site/media rewrite.

## Affected owners

- `data/site.json`
- `scripts/lib/portfolio-contract.mjs`
- a focused reusable Hero delivery/prepare module and CLI if justified
- `scripts/build-site.mjs`
- `src/styles.css`
- `scripts/build-figma-export.mjs` only if canonical consumption needs adaptation
- Hero contract, build-site, Figma parity, derivative integrity, and design-contract tests/docs

## Requested independent response schema

Return exactly these sections with concrete tradeoffs and falsifiable experiments:

1. `problem_reframe`
2. `pragmatic_path`
3. `alternative_architecture`
4. `low_cost_experiment`
5. `contrarian_challenge`
6. `unconstrained_possibility`
7. `overlooked_risks`
8. `assumptions_to_verify`
9. `recommended_next_decision`

Pay special attention to: canonical data shape versus derived URL generation; preload/picture candidate matching; transform math needed to preserve the current background crop at wide/stacked/mobile start/end/reduced states; whether checked-in derivatives plus an explicit prepare command are sufficient; and the narrowest tests that catch consumer drift. Do not edit files and do not provide generic agreement.
