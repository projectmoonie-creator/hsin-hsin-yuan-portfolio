# Google Search Discovery Production Closeout — 2026-08-22

Outcome: `PASS`

This outcome becomes operative after the docs-only commit containing this
report is non-force pushed to `codex/hero-cover-refresh` and the remote tip is
read back exactly. The final commit SHA is necessarily reported in the
external handoff rather than self-referenced inside its own contents.

## Declared package

The producer authorized one bounded package to make the bilingual Production
portfolio observable in Google: verify technical crawlability, create the
Search Console Domain property and one verification TXT, submit the sitemap,
inspect/request both language URLs, test-first correct the temporary apex
redirect, push the active branch and `main`, and allow exactly one Production
update after the gates passed.

The package did not authorize or perform Contact/email changes, copy, media,
layout, interaction, purchases, secret publication, force push, destructive
DNS/Vercel actions, or protected-file changes. It stops here rather than
expanding into a general SEO or performance rewrite.

## Reviewed identities

- Branch: `codex/hero-cover-refresh`.
- Runtime commit:
  `9f2473f8baebb3557e7a4872d9baf0cc955bdff6`.
- Runtime remote read-back: both `origin/main` and
  `origin/codex/hero-cover-refresh` equal `9f2473f`.
- Pre-review docs checkpoint:
  `05347439ce2cc144ada7eb6ebe333169837ec9f7`.
- Production:
  `6dAEBc8Dm4pv15Kjy6SYQYZRHCib`,
  `Ready`, source `main` / `9f2473f`.
- Canonical public origin: `https://hsinhsinyuan.com`.
- The old Vercel project alias is preserved as a fallback and historical
  PageSpeed-baseline identity.

The relevant `vercel.json:5-7` excerpt is:

```json
"redirects": [
  { "source": "/", "destination": "/en/", "permanent": true }
]
```

The frozen review packet's longer `vercel.json:1-22` label accompanied an
abridged block that omitted unchanged cache headers. This report corrects the
label without modifying the frozen review bytes or the technical conclusion.

## Verification

- Focused redirect test: 1/1 pass.
- Full `npm test`: 180/180 pass.
- Fresh build: pass.
- Design-contract audit: pass, no drift.
- Featured derivative integrity: six/six pass.
- `git diff --check`: pass.
- Public-output privacy scan: pass.
- Protected document: remains untracked and byte-identical at the recorded
  SHA-256; it was not staged, committed, moved, deployed, or sent to reviewers.
- Live apex: HTTP 308 to `/en/`, then HTTP 200.
- Live `/en/`, `/zh/`, `robots.txt`, and `sitemap.xml`: HTTP 200.
- Live/build SHA-256 equality: exact for both language pages, robots, and
  sitemap.
- Browser and Googlebot HTML equality: exact for both English and Chinese.
- Desktop 1440×900 and mobile 390×844 apex navigation: correct English
  canonical, visible H1, zero overflow, zero browser errors.
- No `noindex` or `X-Robots-Tag`; both pages have self-canonical and
  reciprocal `en`, `zh-Hant`, and `x-default` alternates.

The sitemap `lastmod` and therefore its whole-file hash are derived from the
UTC build date, not permanent content identity. That behavior predates this
package. A content-derived `lastmod` could be a future bounded improvement,
but no new runtime package is opened here.

## Google and Production read-back

- Search Console Domain property `hsinhsinyuan.com` is verified.
- Public DNS retains one Google verification TXT; the token itself was not
  printed, stored in Git, or sent to the final response.
- Sitemap status is `Success`, last read 2026-08-22, two discovered pages.
- English is already `URL is on Google`; Googlebot smartphone crawl, fetch,
  indexing permission, sitemap association, and canonical selection pass.
- Chinese is `Discovered - currently not indexed`. Its live eligibility test
  passed and Search Console accepted the request; the current control says
  `Indexing requested` / `Request again`.
- The Chinese wait is an asynchronous Google decision, not a product blocker
  or a promise of immediate ranking.
- Vercel still reports exactly one Ready Production for runtime commit
  `9f2473f`; no second manual Production was created.

## PageSpeed

One required routine mobile-English diagnostic targeted
`https://hsinhsinyuan.com/en/` on 2026-08-22. Google's official PageSpeed
Online API returned HTTP 429 `RESOURCE_EXHAUSTED` /
`RATE_LIMIT_EXCEEDED` and reported zero available daily queries. No score,
CrUX metric, transfer result, or regression is claimed.

`docs/performance/README.md` now names the apex as current Production,
retains the old Vercel alias explicitly, and states that the first successful
apex run creates a new baseline rather than a matched-URL comparison. Retry is
read-only only when the official API reports nonzero daily quota or the
official UI produces a completed report; it authorizes no remediation and
does not reopen the closed network-budget package.

## Independent review and adjudication

Frozen packet SHA-256:
`c6337892100f716412cfaae6141c9c2cd0ead54b9096eb46b9cf325961adacc6`.

- Gemini official API requested/observed/completed `gemini-3.7-flash`:
  `PASS`, no findings.
- Claude subscription lane requested dynamic `opus`, observed/completed
  `claude-opus-5`: `PASS`, no blocker or major, six minor and two nit
  findings.
- Both received the same packet bytes and neither edited the repository.
- The full finding-by-finding disposition is
  `google-search-discovery-production-closeout-adjudication-2026-08-22.md`.

The Chinese Googlebot parity gap was resolved by an exact read-only hash. The
active PageSpeed authority/comparison and retry records were corrected.
Build-date `lastmod` and `lang="zh"` specificity are accepted out-of-scope
candidates because changing either would reopen public runtime. The protected
digest is an existing intentional public integrity pin, not a credential or a
new disclosure.

## Durability and worktree isolation

The runtime is already durable on `main`, the active branch, and Production.
Formal closeout is complete only after the commit containing this report,
packet, both reviews/status ledgers, adjudication, PageSpeed guide correction,
and isolated current-package status/log updates is non-force pushed to
`codex/hero-cover-refresh` and read back exactly.

The pre-existing LinkedIn documentation paths and their tracked
`docs/reviews/LOG.md` hunk remain user work. This package may stage only its
own isolated log addition, never the LinkedIn hunk. `main`, Production, DNS,
Search Console, Contact, and the protected document remain untouched during
closeout durability.

No substantial new portfolio phase closes here, so no new Git tag is needed.
The already closed phase tag remains unchanged.

## Four plain-language closeout answers

1. Yesterday Google had no verified owner/sitemap workflow for this domain and
   the apex used temporary redirect semantics; today the domain is verified,
   the sitemap is accepted, English is indexed, Chinese is queued, and the
   apex permanently redirects.
2. Nothing is represented as a rehearsal Production. PageSpeed remains
   incomplete because Google supplied no quota, and Chinese ranking/indexing
   remains Google's pending external action.
3. Google holds the Chinese crawl and PageSpeed availability. The portfolio
   still separately carries its pre-existing Contact-routing blocker; this
   indexing package neither creates nor resolves it.
4. Next step: make no SEO/runtime change; on or after 2026-08-29, perform one
   read-only Search Console check for `/zh/` and retry PageSpeed only if a
   nonzero official quota or completed official report is available.

## What is not in a repository or remote ref?

Search Console, DNS, and Vercel are external systems rather than Git content;
their current read-backs are recorded above. The verification token itself is
intentionally absent from Git. No package source or closeout evidence remains
only in chat or temporary storage after the final active-branch read-back.
Unrelated LinkedIn work remains locally uncommitted by its own package and is
not claimed as part of this closeout.
