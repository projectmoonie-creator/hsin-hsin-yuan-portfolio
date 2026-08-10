# Featured Reel intent playback — review adjudication

Date: 2026-08-11
Frozen packet SHA-256:
`d16b4d7b960ac9d0e662ec0e71f6cdc78239bd37d36cf507c3ca475a29aef0bb`

## External attempts

- Gemini routing requested `gemini-3.6-flash`; observed/completed model are
  null. The wrapper failed with `empty-candidates` after one attempt. No
  downgrade is allowed for an empty result, no usage was completed, and no
  Gemini finding or review completion is claimed.
- Claude requested the dynamic `opus` capability alias through the approved
  subscription-only wrapper; observed/completed model are null,
  `modelRequestSent` is null, and the helper exited 90 with
  `claude-process-failed`. No billing fallback, Claude finding, or completion
  is claimed.
- The required parent `docs/TOOLING.md` locator was absent at review startup.
  Existing wrappers and `docs/COLLABORATION.md` were used without inventing a
  replacement route. The stale locator remains a parent-workspace governance
  issue, not a portfolio runtime change.

## Local adjudication

There are no external findings to accept or reject. A fresh local state-machine
review identified and fixed two edge cases after the frozen packet:

1. `already-fixed` — a rejected/errored first mobile preview could otherwise
   keep suppressing every later link tap. The controller now consumes that
   failure state so the next tap reaches the official destination; a failing
   contract preceded the implementation.
2. `already-fixed` — an interrupted Screening Strip jump could retain an
   offscreen metadata prime indefinitely. Pending exact-target ownership now
   expires after three seconds and releases the warm; arrival clears the timer.

The earlier browser race in which a late initial `pageshow` restored the top
after the user had activated a Screening card is also covered by two failed-
then-passing contracts (scroll and pointer/keyboard engagement) plus the final
9/9 browser matrix. No current local P0 or P1 finding remains.

## Review boundary

The external attempts do not cover the two post-packet hardening changes and
cannot be called a completed independent review. Final confidence rests on the
local TDD, matched performance evidence, browser matrix, full repository
validation, and producer inspection. Real iPhone Safari/Low Power Mode remains
an explicit pre-Production check.
