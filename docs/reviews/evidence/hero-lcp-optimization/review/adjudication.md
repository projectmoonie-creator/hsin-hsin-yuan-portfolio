# Local adjudication

Verdict: `PASS_WITH_OPEN_ITEMS` for producer inspection on the bounded local branch.

The implementation and evidence were reviewed against the approved P0 scope. No current P0, P1, or P2 correctness, accessibility, visual-equivalence, source-of-truth, privacy, or performance-contract finding remains. A late maintenance review found that dimension/codec checks alone could not detect a stale same-size derivative after a future source or recipe change; this was closed with a generated source/recipe/output hash manifest, a failing regression test, and a build-time fail-closed check.

The direct-throttled three-run median demonstrates the intended network/LCP effect, while the matching simulated median remains effectively flat and is retained as contrary evidence. These are local laboratory results only; they do not establish Production or CrUX behavior.

Formal review packet SHA-256: `ea298cb26f9a32b7e650cec5f1338d3763932343ee086086f55b9c1693c18194`. Gemini requested `gemini-3.6-flash` but failed with `empty-candidates`; Claude requested dynamic `opus` but remained `claude-process-failed`. Neither lane exposed an observed or completed model, so no independent-review completion or cross-model consensus is claimed.

Open items are producer inspection and any later separately authorized Preview/Production measurement. No external-state action is authorized by this adjudication.
