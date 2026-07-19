# Cinematic Portfolio External Review Status

Date: 2026-07-19
Branch: `codex/cinematic-portfolio-system`

## Claude

- Intended role: narrative, positioning, visual-system, and homepage-density review.
- Highest configured model requested by project routing: `claude-fable-5`.
- Preflight result: a newly spawned standalone Claude Code `2.1.214` process returned `loggedIn: false`. This does **not** establish that the user's already-running interactive Claude Code session is logged out.
- Historical workflow check: Moonie-V provenance shows successful cold-review agents inherited authentication and `claude-fable-5` from an active interactive Claude Code session. The standalone CLI check used the wrong entry point for that workflow.
- Authentication recovery: `claude auth login` persisted the Claude Max login in macOS Keychain. Codex must run the CLI outside its sandbox to read that Keychain entry.
- Requested model: `claude-fable-5` through the automated read-only wrapper.
- Observed model usage: `claude-fable-5` (21 input tokens, 6,441 output tokens, 1,301,201 cache-read tokens, 202,528 cache-creation tokens) plus an ancillary `claude-haiku-4-5-20251001` call (1,390 input, 17 output tokens).
- CLI session id: `c0592e33-83bb-4ee5-80ef-fa985d797418`; duration 109,471 ms; 21 turns; reported cost USD 5.675496.
- Result: the model completed its read-only investigation but the final result was replaced by `You've hit your monthly spend limit`. The run used `--no-session-persistence`, and no recoverable intermediate findings were stored locally.
- Completed model: none. A lower model must not be represented as completing this review.
- Usable findings: none.
- Raw artifact: `docs/reviews/2026-07-19-cinematic-portfolio-claude-review.json`.
- Status: incomplete due to account monthly spend limit. Do not count as a completed Claude review and do not retry or downgrade unless project routing explicitly permits this failure class.

## Gemini

- Intended role: implementation, responsive behavior, media contract, Figma synchronization, test quality, and skill reproducibility review.
- Official model catalog checked: 2026-07-16 update lists `gemini-3.1-pro-preview` for advanced reasoning and complex agentic/coding work.
- Initial requested model: `gemini-3.1-pro-preview`; the CLI attempt stopped before model execution because its process did not receive `GEMINI_API_KEY`.
- Recovery source: the original Moonie-V tooling record identified the paid-project `AQ.` key in `~/.gemini/.env` and the repository's controlled REST reviewer. The key was consumed in place and was not printed or copied into this repository.
- Completed request: `gemini-3.5-flash`, temperature `0`, via `Moonie-V/collab/tools/gemini-rest-vote.mjs`.
- Observed model: `gemini-3.5-flash`.
- Result: success on attempt 1; usage `in=791`, `out=3541`, `total=7502` tokens.
- Output: `docs/reviews/2026-07-19-cinematic-portfolio-gemini-review.md`.
- Status: completed, read-only. Findings require maintainer adjudication before edits.

## Gemini first-pass adjudication

- Finding 1, empty foreground: **already fixed / reject as blocker**. `scripts/build-site.mjs:495-497` conditionally omits the image, and the manifest currently exercises an empty foreground.
- Finding 2, reduced motion: **already fixed / reject as stated**. `src/main.js:29-46` does not attach the cinematic scroll listener under reduced motion; CSS also contains reduced-motion rules. The claimed WCAG failures and mobile sticky trap were not supported with a reproduction.
- Finding 3, three-work tests: **factually incorrect / reject**. `tests/build-site.test.mjs:140-159` explicitly asserts three panels, and the complete local suite previously passed 20/20.
- Finding 4, remote Unsplash defaults: **factually incorrect for the current manifest**. `data/media.json` uses a local `/assets/portfolio/` image. The broader escaping/remote-media policy suggestion remains a worthwhile hardening item, not a merge blocker.
- Finding 5, validator diagnostics: **accept as low-priority hardening**. Invalid JSON already exits nonzero through an uncaught exception, but a concise contextual message would improve reuse by agents.
- Finding 6, Tech Dreamers: **reject pending editorial evidence**. It is an intentional project record covered by explicit tests, not demonstrated test residue.

Claude review remains incomplete, so the requested two-reviewer cross-validation is not yet complete. Gemini's report is advisory and contains several stale or inferred claims that local source inspection disproves.
