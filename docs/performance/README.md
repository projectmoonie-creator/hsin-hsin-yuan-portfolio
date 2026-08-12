# Post-Publish PageSpeed Review

This is the reusable, read-only performance check for Hsin-Hsin Yuan Portfolio.
It runs only after a separately authorized deployment has been read back as
Ready. It does not authorize deployment or remediation.

## URL Authority

- Production: use the current canonical alias recorded in `STATUS.md` and
  generated from `SITE_ORIGIN`.
- Current Production alias:
  `https://hsin-hsin-yuan-portfolio.vercel.app`
- Preview: use the exact accessible deployment or producer-approved share URL.
- Never bypass Vercel protection. Record the check as inaccessible when the
  public PageSpeed service cannot reach the Preview.

## Run Contract

1. Record deployment ID, target, source commit, tested URL, and language path.
2. Confirm the deployment is Ready before starting the read-only check.
3. Use PageSpeed Insights mobile against the exact published URL.
4. A routine release records one diagnostic run.
5. A performance work package records three fresh runs under matching
   conditions and compares medians; do not select only the best result.
6. Do not submit Contact or trigger any other site action during this check.
7. Recommendations are findings only. Open a separate bounded, producer-gated
   package before changing code, media, deployment, or aliases.

## Required Record

- checked-at timestamp and PageSpeed report URL;
- deployment ID/target/source commit and tested URL/language;
- CrUX field-data availability and scope (URL or origin);
- mobile Performance, Accessibility, Best Practices, and SEO scores;
- FCP, LCP, TBT, CLS, Speed Index, and transferred bytes;
- Lighthouse version, emulated device, and throttling when the report exposes
  them;
- three prioritized findings, separated into first-party and third-party
  ownership;
- comparison with the preceding matching baseline;
- decision: accept, investigate locally, or propose a new bounded package.

## Interpretation

- A single Lighthouse/PageSpeed score is variable laboratory evidence, not a
  universal measurement of real visitors.
- CrUX field data, when available, is reported separately from lab data.
- A lower score alone is not `BLOCKED`; truth, privacy, rights, functional,
  accessibility, or reproducible performance regressions still require normal
  adjudication.
- Do not claim improvement from mismatched URL, language, device, throttling,
  or single-best-run comparisons.

## Reference Baseline — 2026-08-10 Mobile English

- URL: `https://hsin-hsin-yuan-portfolio.vercel.app/en/`
- Report: `https://pagespeed.web.dev/analysis/https-hsin-hsin-yuan-portfolio-vercel-app-en/39xad34dkj?form_factor=mobile`
- CrUX: insufficient field data.
- Scores: Performance 75; Accessibility 100; Best Practices 100; SEO 100.
- Metrics: FCP 0.9s; LCP 6.7s; TBT 0ms; CLS 0; Speed Index 4.1s.
- Transfer: about 3,197 KiB.
- Primary diagnosis: Hero still is the LCP element; image priority, responsive
  delivery, and the non-composited background-position/background-size slow
  push are the first-party P0 path.

## Closed Diagnosis — 2026-08-12 Mobile Preview Network Budget

The bounded follow-up to the later 12,510 KiB PageSpeed signal is closed with
`NO_RUNTIME_CHANGE`. Nine valid matched local runs did not reproduce a Slow
Steps desktop-fallback request or dual-source transfer. They observed only the
existing one-candidate mobile metadata warm. Exact machine evidence and the
stop decision are recorded in
`mobile-preview-network-budget-diagnosis-2026-08-12.md` and
`../reviews/evidence/mobile-preview-network-budget/summary.md`.
