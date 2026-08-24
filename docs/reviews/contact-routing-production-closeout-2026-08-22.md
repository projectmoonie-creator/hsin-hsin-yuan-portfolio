# Contact Routing Production Closeout — 2026-08-22

## Verdict

`PASS` for the operational package, with formal dual-review completion still
open. The public
Contact route now accepts a valid inquiry, Resend reports it delivered, the
producer confirmed receipt, and Gmail generated a reply to the public alias.
No website source, design, portfolio content, or Git ref changed in this
package.

## Authorization And Boundaries

The producer authorized one bounded envelope covering a restricted Resend
sending key, three Vercel Production settings, same-version Production
redeployment, one clearly labelled live inquiry, receive and Reply-To testing,
desktop/mobile verification, privacy checks, independent review, and final
read-back. The later confirmation also covered one safe key-repair sequence:
provider-only v3 diagnosis, Vercel key replacement, same-commit redeployment,
v2 revocation, and the final real Contact test.

Hard exclusions remained in force: no design, work, copy, media, Contact source,
Git push, `main`, force push, unrelated domain change, or protected-file change.
Private recipient values and API-key material were never written to Git or this
report.

## Baseline And Deployment Identity

- Active local branch/HEAD: `codex/hero-cover-refresh` /
  `3c5aba7ee0002432fe8af238f5b8c639b65984f2`.
- Production source: `main` /
  `9f2473f8baebb3557e7a4872d9baf0cc955bdff6`.
- Final same-source deployment:
  `BUuq3DqjdDxpgdwuE7NkciJdpdCG`, `Ready`, Production, with
  `hsinhsinyuan.com` assigned.
- Contact implementation SHA-256:
  `2b756da78d79418df890f2cdf2566f6069c90610a179af122e8a51f1be42eb06`.
- Contact test SHA-256:
  `b9e631d6feaa5a0959b373fae91ccc93c85e467f53e53d0ba3f7b89a9048fbc8`.

## Credential And Provider Diagnosis

1. The first newly created key was revoked after its one-time value appeared in
   browser automation output. It was never saved to Vercel.
2. A second restricted sending key was stored in Vercel, but two live Contact
   attempts returned 502. Resend showed no logs and no activity for that key,
   isolating the failure before provider acceptance.
3. `Portfolio Production Contact v3` was created with `Sending access` limited
   to `hsinhsinyuan.com`. A provider-only test to Resend's official test sink
   returned HTTP 200 and was later reported `delivered`.
4. Vercel `RESEND_API_KEY` was replaced without falsely asserting that v2 had
   already been revoked. A new Production deployment applied the setting, then
   v2 was revoked. Final Resend read-back showed v2 absent and only v3 retained
   with sending activity.
5. The one-time v3 value was cleared from browser clipboard and in-memory
   variables after Vercel save. The only temporary curl configuration was mode
   `0600` in a mode `0700` temporary directory and was deleted immediately after
   the provider diagnostic.

## Final Production Configuration Read-Back

Vercel shows all three required names present as `Sensitive` and scoped only to
`Production`:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

No value was read back or recorded. The authenticated sender uses the verified
custom domain. The private destination remains environment-only and is not
published in source, generated output, or review evidence.

## End-To-End Evidence

| Check | Result |
|---|---|
| Provider-only v3 request | HTTP 200; Resend `delivered` |
| Live valid `POST /api/contact` | HTTP 200, `{ "ok": true }` |
| Resend live Contact record | HTTP 200 log; email `delivered` |
| Actual inbox receipt | Producer confirmed receipt; authenticated inbox also located the exact subject |
| Reply-To | Gmail reply composer resolved to `hello@hsinhsinyuan.com` |
| Reply send | Gmail displayed `Message sent`; composer closed |
| Invalid POST | HTTP 400, no send |
| GET | HTTP 405 |

The reply was sent from the same private mailbox to its own forwarding alias.
No separate Inbox duplicate appeared; that loop is not used as a forwarding
pass/fail signal because Gmail may deduplicate or suppress same-account loops.
The public alias forwarding path was already proven by a different-account
test, and the current package independently proved initial delivery plus the
actual Reply-To target and outgoing reply.

## Desktop And Mobile QA

Chrome tested `/en/` and `/zh/` at 1440×900 and 390×844 without submitting a
second inquiry. All four cases passed:

- form present and visible;
- `POST /api/contact` action intact;
- four named required fields and enabled submit control;
- form fully inside the viewport;
- no horizontal page overflow;
- zero captured Console errors.

The temporary viewport override was reset after testing.

## Deterministic Gates

- `npm test`: 180/180 pass.
- `npm run build`: pass.
- `npm run audit:design-contract`: pass.
- `npm run featured-reels:check`: six derivatives pass.
- `git diff --check`: pass before closeout documentation.
- Privacy scan: no plausible Resend secret or private Gmail destination in
  tracked Git.
- Protected untracked document stayed unmodified and untracked at SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.
- The unrelated LinkedIn documentation work remains untouched.

The required post-publish PageSpeed mobile-English attempt reached the official
API but returned HTTP 429 / `RESOURCE_EXHAUSTED` for the daily Queries quota.
No score was produced and no regression is inferred.

## Review

The frozen full-rotation packet is
`docs/reviews/contact-routing-production-review-packet-2026-08-22.md`. Claude
and Gemini were each dispatched once through the controlled lanes. Reviewers
were read-only and received no secret, private destination, Inbox content, or
access token.

- Packet SHA-256:
  `a5976a67e5262e74f6a1aeb259d2104fa7abc11b8fbfca2f6cbd8922cb745070`.
- Gemini requested/observed/completed `gemini-3.7-flash`, returned `PASS`, and
  reported no findings. Usage: input 2,241, output 739, total 3,751 tokens.
- Claude requested dynamic `opus`; observed/completed remained null. Attempt
  `dd28558c-131a-4481-ae0c-b33d472cea0a` ended
  `claude-process-failed` with `modelRequestSent=null`, so it is incomplete and
  produced no usable findings. No retry, downgrade, API/PAYG, or provider
  fallback occurred.
- Helper protocol, managed-settings preflight, token mode, and CLI availability
  passed. A separate read-only usage meter showed the current Claude session at
  0%, consistent with the rapid failure, but the formal ledger did not preserve
  the provider error and therefore remains ambiguous.

Maintainer adjudication is recorded in
`docs/reviews/contact-routing-production-adjudication-2026-08-22.md`. Gemini's
no-finding `PASS` is accepted. Claude's incomplete attempt is not treated as a
finding or dual-review consensus.

## Exact Next Action

After the producer's Claude subscription window resets, begin a new explicitly
authorized formal-review attempt through the shared wrapper. Do not
automatically resend this ambiguous attempt, downgrade or substitute providers,
or change runtime/Production while waiting. The operational Contact package is
complete and requires no further website action.
