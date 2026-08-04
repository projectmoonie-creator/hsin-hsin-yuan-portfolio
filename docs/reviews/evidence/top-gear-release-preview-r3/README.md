# Top Gear release Preview browser QA r3

Date: 2026-08-04

Status: `PASS`

This text-only package closes the Top Gear closeout's ephemeral-browser-
evidence risk before integration to `origin/main` and a new Vercel Preview.
It preserves the reviewed r2 harness unchanged and adapts only the current
six-reel count, exact poster set, and Top Gear browser contract.

## Reviewed identity

- Product closeout baseline:
  `6692aeec335d7fc114294ed6e126dfef53d8315f`.
- QA source head before this evidence-only package:
  `829b428cf3313e23fb52922256fae1c43b562663`.
- The Top Gear product, manifest, content, and media-test paths have no diff
  between those commits.
- Local build origin: `http://127.0.0.1:4173`; the server was stopped after
  the run and the port returned to no-listener state.
- Python `3.9.6`; Playwright `1.60.0`; Chromium `148.0.7778.96`.

## Result

- All `10/10` English/Chinese cases passed at `1440x900`, `1200x900`,
  `834x1112`, `390x844`, and `360x800`.
- Every case proved six exact Featured posters, no horizontal overflow,
  localized Work Press semantics, visible global Press, the existing Contact
  structure, and clean local page/network ledgers.
- Every case proved the Top Gear exact local `<source>`, poster, external watch
  wrapper, muted/looped/inline/preload-none ownership, matching wrapper/video
  geometry, centered media, and absence of a site-added title overlay.
- The lifecycle run passed the poster hold, actual playing, advancing time,
  exit/reset/re-entry, natural last-eligible arbitration, media error,
  persisted BFCache, and controlled visibility checks.
- Reduced-motion, no-JavaScript, and keyboard-only checks passed with all six
  reels static or non-focusable as required.
- The matrix recorded `118` requests, zero Contact POSTs, zero console
  warning/error events, zero page errors, zero request failures, and zero HTTP
  errors. The measured poster state was `1016.3 ms`; actual playing was
  `1439.4 ms`; playback advanced by `0.606614` seconds.
- No matched historical Preview claim is made. This release run validates the
  accepted current build only.

The complete machine-written evidence is in
[`results-summary.json`](./results-summary.json).

## Reproduction

Build and serve the repository on an unused local port, then run:

```sh
python3 docs/reviews/evidence/top-gear-release-preview-r3/qa_harness.py \
  --repo-root . \
  --base-url http://127.0.0.1:4173 \
  --evidence-dir /private/tmp/top-gear-release-qa \
  --tracked-summary docs/reviews/evidence/top-gear-release-preview-r3/results-summary.json
```

The evidence directory must remain outside the repository. Do not add
`--screenshots` for the tracked text-only package, and do not submit Contact.
