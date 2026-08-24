# Search / Privacy / llms.txt Production Release — Adjudication

Date: 2026-08-24

## Frozen basis

- Packet: `search-privacy-llms-production-review-packet-2026-08-24.md`.
- Packet SHA-256:
  `e1c662651829639effc5a2738b3661e9a63c02c4e5e07fdcb79b5b4cc9f33915`.
- Both provider wrappers received the same frozen packet path and bytes.
- The packet contains no credential, private recipient, protected Preview URL,
  access token, or protected document content/name.

## Provider outcomes

### Gemini

- Routing policy: highest-capability generally released at execution.
- Requested / observed / completed: `gemini-3.7-flash` /
  `gemini-3.7-flash` / `gemini-3.7-flash`.
- Status: completed.
- Verdict: `PASS`.
- Findings: zero BLOCKER, MAJOR, MINOR, or NIT.
- The review affirmatively accepted `robots.txt` as the current consumption
  layer, the exact three values, the strict adjacency test, the deterministic
  and browser gates, the fast-forward release, and the read-only post-release
  boundaries.

### Claude

- Attempt: `4b1aa2df-9f1a-4cf5-abdb-d39538e623de`.
- Requested: dynamic capability alias `opus`.
- Observed / completed: `null` / `null`.
- Status: incomplete, `claude-process-failed` after 203,951 ms.
- `modelRequestSent` is `null`; dispatch is ambiguous.
- No review text, usage, raw result, or finding exists. The attempt was not
  retried, downgraded, replaced by an API key, or relabelled as completed.

The rotation was executed but did not produce dual-review consensus. The
Claude infrastructure outcome is preserved as incomplete evidence; it is not a
negative product finding and supplies no basis for a code change.

## Local adjudication

Gemini supplied no finding to reproduce. The maintainer independently checked
the release questions against current source and fresh output:

1. Current Cloudflare documentation consumes Content Signals from
   `robots.txt` under a user-agent group and defines `search`, `ai-input`, and
   `ai-train` with the meanings used in the packet. The implementation does not
   invent an HTTP-header channel.
2. `STATUS.md` explicitly calls the signal a preference declaration rather
   than crawler enforcement or a replacement for legal/privacy terms.
3. The valid RED failed only because generated robots lacked the directive;
   the same test then passed after the one-line generator change. The regex
   fixes exact key/value spelling and placement between `User-agent: *` and
   `Allow: /`, while the pre-existing build test still fixes the sitemap URL.
4. The changed public-output surface is only 54 added bytes in generated
   `robots.txt`. No HTML, CSS, JavaScript, copy, media manifest, Contact handler,
   alias, or domain configuration changed.
5. Fresh local evidence remains green: focused 1/1, full 181/181, build,
   design audit, six Featured derivatives, zero production dependency
   vulnerabilities, output privacy scan, protected-file baseline, and all 12
   browser matrix cases.
6. The two expected mobile MP4 aborts per normal locale were traced to the
   existing tested warm-handoff cancellation contract. No non-media request,
   desktop, reduced-motion, or no-JavaScript failure occurred, and no runtime
   change was made.
7. The public baseline proves the release priority: Privacy and `llms.txt` are
   404, while the current sitemap has only the two homepages and robots has no
   signal.
8. Search Console work is read-only after release; no duplicate sitemap
   submission or indexing request is authorized. Is Agentic receives only the
   anonymous canonical apex.

## Decision

`PASS` for the bounded fast-forward-only `main` and Git-integrated Production
sequence, followed by the enumerated readbacks.

This decision does not claim Claude concurrence. A stopped release is still
required if the active-branch remote readback, `main` ancestry, Vercel source
identity/Ready state, canonical public artifacts, privacy boundary, or
protected-file baseline fails. No review result authorizes Contact/email,
Search Console mutation, alias/domain work, analytics, copy/media/interaction
changes, force/history rewrite, or destructive action.
