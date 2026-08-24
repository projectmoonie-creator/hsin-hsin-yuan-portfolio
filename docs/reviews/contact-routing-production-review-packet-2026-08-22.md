# Frozen Review Packet — Contact Routing Production Activation

Date: 2026-08-22

## Reviewer Contract

Act as an independent, read-only reviewer. Do not edit files, deploy, send
email, rotate credentials, or perform external actions. Review only the frozen
evidence below. Do not request or infer any secret or private email value.

Return:

1. verdict: `PASS`, `PASS_WITH_REVISIONS`, or `BLOCKED`;
2. findings ordered `BLOCKER`, `MAJOR`, `MINOR`, then `NIT`;
3. for each finding: exact evidence item or file:line, consequence,
   reproduction/check, and smallest required correction;
4. explicit assessment of credential/privacy handling, Production rollback,
   Contact correctness, error behavior, and mobile/desktop coverage;
5. any claim that cannot be established from the packet, clearly labelled as
   an open evidence limit rather than a defect.

A blocker or major must cite current evidence and be reproducible. Historical
failure by itself is not a current finding.

## Objective

Assess whether a previously deployed but unconfigured portfolio Contact route
has been safely activated in Production without changing runtime source,
public design, portfolio content, or Git state.

## Repository And Frozen Identity

- Repository: `hsin-hsin-yuan-portfolio-remove-lights`
- Active local branch/HEAD: `codex/hero-cover-refresh` /
  `3c5aba7ee0002432fe8af238f5b8c639b65984f2`
- Production source: `main` /
  `9f2473f8baebb3557e7a4872d9baf0cc955bdff6`
- Final Production deployment: `BUuq3DqjdDxpgdwuE7NkciJdpdCG`
- Deployment read-back: `Ready`, Production, custom apex assigned, source
  `9f2473f`
- `api/contact.js` SHA-256:
  `2b756da78d79418df890f2cdf2566f6069c90610a179af122e8a51f1be42eb06`
- `tests/contact-api.test.mjs` SHA-256:
  `b9e631d6feaa5a0959b373fae91ccc93c85e467f53e53d0ba3f7b89a9048fbc8`

## Authorized Scope

One producer-approved envelope covered:

- a restricted Resend sending key;
- three Vercel Production-only Sensitive variables;
- same-source Production redeployment;
- one provider-only diagnostic to Resend's official test sink;
- revocation of superseded keys;
- one clearly labelled live Contact inquiry;
- receipt, Reply-To, error, desktop/mobile, privacy, review, and read-back
  checks.

Excluded: source/design/copy/media changes, Git push, `main` changes, force
push, unrelated domain changes, protected-file changes, and disclosure of
secret/private destinations.

## Current Contact Implementation Contract

`api/contact.js`:

- accepts only `POST` (plus 204 `OPTIONS`); other methods return 405;
- parses form or object bodies;
- discards honeypot/too-fast submissions before sending;
- requires `name`, valid `email`, `projectType`, and `message`;
- rate limits by client IP plus normalized email for 60 seconds;
- requires `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL`;
- sends `POST https://api.resend.com/emails` with Bearer auth, JSON,
  environment-owned `from`/`to`, `reply_to` equal to the validated visitor
  email, a project-type subject, and plain-text structured body;
- maps missing configuration to 503 and provider/network failure to generic
  502 without exposing provider detail;
- returns 200 `{ "ok": true }` only after provider HTTP success.

No implementation code changed in this package.

## Test Contract

`tests/contact-api.test.mjs` covers:

- honeypot rejection without provider call;
- missing environment configuration;
- structured Resend payload and `reply_to` visitor email;
- invalid required data;
- provider failure and network failure;
- rate limiting.

Full suite: 180/180 pass. Fresh build, design-contract audit, six Featured reel
integrity checks, and `git diff --check` passed before closeout docs.

## Credential And Failure Timeline

1. v1: one-time value appeared in browser automation output; it was never
   saved to Vercel and was immediately revoked after explicit producer
   confirmation.
2. v2: restricted to Sending access and the verified custom domain; stored as
   Vercel Sensitive/Production. Two live form attempts returned 502. Vercel
   invoked the function, but Resend showed zero API logs and v2 showed no
   activity. Blind retry stopped.
3. v3: restricted to Sending access and `hsinhsinyuan.com`. Before Vercel
   replacement, one direct provider-only diagnostic to Resend's official test
   sink returned HTTP 200 and later `delivered`.
4. Vercel's dedicated Rotate dialog required an assertion that the old value
   had already been revoked. Because v2 needed to remain available until the
   replacement deployment, the maintainer did not make that false assertion;
   the Sensitive variable was edited in place instead. A new Production
   deployment applied v3, then v2 was revoked.
5. Final Resend read-back: v2 absent; v3 present, Sending access, restricted
   custom domain, with activity. The v3 secret was cleared from clipboard and
   memory after Vercel save.
6. For the one direct diagnostic only, a temporary mode-0600 curl config in a
   mode-0700 temporary directory carried the key because the sandboxed REPL
   could not access the network. The file was deleted immediately after the
   HTTP 200 response. It was outside the repository and never printed.

## Production Configuration Read-Back

Vercel displays exactly the required three names, all `Sensitive`, all scoped
to `Production`, with no plaintext value shown:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

The private destination is intentionally omitted from this packet. The sender
uses the verified custom domain. The public Reply-To alias is
`hello@hsinhsinyuan.com`.

## End-To-End Results

- Provider-only v3 diagnostic: HTTP 200, Resend `delivered`.
- Final live valid Contact POST: HTTP 200, `{ "ok": true }`.
- Resend API log: second `/emails` POST HTTP 200.
- Resend email status: final Contact email `delivered`.
- Actual receipt: producer explicitly confirmed receipt; authenticated Gmail
  search also located the exact subject in the configured private inbox.
- Reply-To: Gmail reply composer resolved to the public alias.
- Reply send: Gmail displayed `Message sent` and closed the composer.
- Expected failure behavior after final deployment: GET 405; invalid POST 400.

The reply originated from the same private mailbox to its own forwarding
alias. A separate Inbox duplicate was not used as an acceptance criterion
because same-account forwarding loops may be deduplicated or suppressed. The
public forwarding path had already been proven with a different-account test;
this package separately proves inbound delivery and the actual Reply-To target.

## Desktop/Mobile Matrix

Chrome checked both `/en/` and `/zh/` at 1440×900 and 390×844, with no further
submission. Each of four cases had:

- visible form;
- method `post`, action `/api/contact`;
- four named required controls;
- enabled submit button;
- form inside viewport and no page horizontal overflow;
- zero captured Console errors.

The viewport override was reset.

## Privacy And Repository Isolation

- No Resend token or private destination is present in this packet or the
  closeout report.
- Tracked-Git privacy scan found no plausible Resend token or private Gmail
  destination.
- Protected untracked file remained unmodified/untracked at SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.
- Existing unrelated LinkedIn docs and the user's `docs/reviews/LOG.md` edits
  were preserved.
- No Git ref, runtime source, design, copy, media, or public address changed.

## Operational Limit

The required official PageSpeed mobile-English attempt returned HTTP 429 /
`RESOURCE_EXHAUSTED` for the service's daily Queries quota. It produced no
metric. Because this deployment changes only server-side mail environment
values and uses the same source commit, no performance conclusion is inferred
from the unavailable run.

## Rollback

If live Contact delivery regresses, the bounded rollback is to disable the
three Contact Production variables or redeploy the previously known source
while preserving the public site. The now-revoked v1/v2 keys must not be
restored. A replacement key would require the same restricted-domain scope,
provider-only diagnostic, Sensitive Production storage, new deployment, and
read-back sequence.
