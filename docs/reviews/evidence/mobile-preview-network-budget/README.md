# Mobile Preview Network Budget Evidence

Date: 2026-08-12

This directory contains the retained browser evidence for the bounded Slow
Steps mobile network-budget diagnosis. It changes no website runtime.

## Retained evidence

- `before/immediate-tap-3x.json`: three cold contexts with no passive lead.
- `before/passive-3s-then-tap-3x.json`: three cold contexts with three seconds
  of no interaction before scroll plus stationary touch intent.
- `before/passive-12s-then-tap-3x.json`: three cold contexts with twelve
  seconds of no interaction before the same intent.
- `summary.json` and `summary.md`: machine-generated medians, request ledgers,
  hashes, and the decision gate.
- `diagnose.py`: browser/network/event probe.
- `range_server.py`: local static server with HTTP 206 range support.
- `summarize.py`: compact summary generator. `summary.json` and `summary.md`
  must be regenerated rather than hand-edited.

Each valid run uses Playwright Chromium at 390×844, DPR 3, a new mobile/touch
context, cache disabled, all origin storage cleared, 150ms latency, 1.6Mbps
download, 750Kbps upload, and 4× CPU throttling. The raw ledgers retain every
MP4 request event, request start, first body byte, response range, encoded body
bytes, media event, poster/reveal state, input event, LCP, long-task blocking,
CLS, source candidate, `currentSrc`, and runtime `load()`/`play()` stack.

## Reproduction

From the repository root:

```sh
npm run build
python3 docs/reviews/evidence/mobile-preview-network-budget/range_server.py --directory dist --port 4194
```

In a second shell, run each retained scenario:

```sh
python3 docs/reviews/evidence/mobile-preview-network-budget/diagnose.py --url http://127.0.0.1:4194/en/ --runs 3 --pre-intent-ms 0 --after-playing-ms 1200 --output docs/reviews/evidence/mobile-preview-network-budget/before/immediate-tap-3x.json
python3 docs/reviews/evidence/mobile-preview-network-budget/diagnose.py --url http://127.0.0.1:4194/en/ --runs 3 --pre-intent-ms 3000 --after-playing-ms 1200 --output docs/reviews/evidence/mobile-preview-network-budget/before/passive-3s-then-tap-3x.json
python3 docs/reviews/evidence/mobile-preview-network-budget/diagnose.py --url http://127.0.0.1:4194/en/ --runs 3 --pre-intent-ms 12000 --after-playing-ms 1200 --output docs/reviews/evidence/mobile-preview-network-budget/before/passive-12s-then-tap-3x.json
python3 docs/reviews/evidence/mobile-preview-network-budget/summarize.py
```

The recorded execution used the Web Application Testing server-lifecycle
helper so the local listener was stopped after every batch.

## Invalidated harness smokes

`invalidated/` preserves four development smokes that are excluded from all
medians and decisions: one omitted network emulation, one anchored passive
time after full `load`, and two exposed an empty-snapshot fallback bug. Their
exact hashes are generated into `summary.json` and `summary.md`.

These invalidated results are audit evidence for the harness corrections, not
product evidence.
