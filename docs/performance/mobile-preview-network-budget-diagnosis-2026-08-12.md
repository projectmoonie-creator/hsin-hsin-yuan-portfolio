# Mobile Preview Network Budget Diagnosis — 2026-08-12

Outcome: `PASS` — `NO_RUNTIME_CHANGE`

## Scope and authority

This closes the producer-approved bounded package from
`docs/performance/mobile-preview-network-budget-handoff-2026-08-12.md`.
The runtime baseline is closed commit
`4193498208d74c01a4876f7550642c4cc8c7c3b4`; local package HEAD began at its
docs-only child `3a97171913801149550543274b5370eda767276f` on
`codex/mobile-preview-network-budget`.

The package asked whether the PageSpeed observation of both Slow Steps MP4
sources and about 9.7MB of combined video transfer represented normal mobile
runtime behavior before scroll, tap, or focus. The acceptance contract required
three matched cold runs and prohibited runtime work if that finding did not
reproduce in the median.

## Method

Three retained scenarios each ran three fresh cold contexts under identical
mobile viewport, DPR, network, CPU, cache, and storage conditions. Every run
began at the exact frozen build, recorded all MP4 request and media-event
timings, and ended with the same scroll plus trusted stationary touch intent.
The no-lead scenario separately measured an intentional cold start.

The exact conditions, per-request ledger, event ledger, medians, build hashes,
and invalidated harness-attempt hashes are generated directly from raw browser
output in:

- `docs/reviews/evidence/mobile-preview-network-budget/summary.md`
- `docs/reviews/evidence/mobile-preview-network-budget/summary.json`

## Finding and classification

The PageSpeed dual-source/full-transfer signal did not reproduce in any valid
run. Every context selected the manifest-derived mobile derivative as
`currentSrc`; no valid pre-intent request targeted the desktop fallback, and no
run requested both source URLs.

The only stable pre-intent behavior was the already-approved one-candidate
proximity metadata warm. Its `load()` stack reaches the warm timer in generated
`main.js`; it changes Slow Steps to `preload="metadata"` after Hero readiness.
There was no pre-intent Slow Steps `play()` call. The initial zero-byte abort
and the following HTTP 206 request are two transitions for the same mobile URL,
not two responsive sources. Reset/pause activity did not select or request the
fallback.

The three-second ledger proves request start can precede intent while body
transfer remains at zero at that checkpoint. The twelve-second ledger proves
the settled warm is bounded to the observed metadata range. The immediate
cold-intent ledger preserves the approved poster until the current owner emits
`playing`; reveal follows the same event without CLS.

Classification:

- source selection: mobile derivative only;
- proximity warm: yes, one candidate, metadata only;
- passive ownership before intent: no;
- reset-triggered fallback: no;
- dual-source request: no;
- PageSpeed audit/full-transfer observation: not reproduced by the matched
  normal-browser harness.

## Decision

Per the handoff stop condition, the observed dual-source and multi-megabyte
initial-transfer finding is rejected as non-reproducible. The existing bounded
mobile metadata warm remains inside its approved interaction and data-use
contract. No failing runtime test is warranted, no systematic-debugging or
test-first implementation phase is opened, and no website source, media,
manifest, test, generated public output, or interaction behavior is changed.

No Preview is needed because there is no public-output candidate to inspect.
Git push, `main`, Production, aliases, Contact, destructive Vercel actions, and
the protected document remain untouched and unauthorized.

## Review tier and exact next action

External review is skipped because the retained package is diagnostic/docs-only,
changes no current rule or public output, and follows the handoff's mandatory
stop rather than making a user-visible judgment. The raw ledgers, compact
machine summary, harness corrections, and protected-file readback are the
reviewable evidence.

Exact next action: stop this package. Do not reopen mobile preview runtime work
from the retired PageSpeed signal; wait for new public/CrUX evidence or a
separately producer-approved bounded package.
