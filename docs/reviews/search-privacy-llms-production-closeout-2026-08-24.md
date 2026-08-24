# Search / Privacy / llms.txt Production Closeout — 2026-08-24

Outcome: `PASS`

## Released result

The completed 8/24 bilingual Privacy and concise agent-discovery candidate is
now public on the canonical Production domain. The release also adds the
producer-approved machine-readable preference:

```text
Content-Signal: search=yes, ai-input=yes, ai-train=no
```

Current Content Signals documentation defines this as a `robots.txt`
directive, so the release places it inside `User-agent: *` immediately before
`Allow: /`. No similarly named HTTP response header was invented. The signal
is recorded as a trust-based preference rather than technical enforcement or a
replacement for Privacy/copyright terms.

## Authorization and exclusions

One producer envelope covered local tests/source/docs, official research,
full gates, Claude and Gemini review, coherent commits, non-force active-branch
push, fast-forward-only `main`, Git-integrated Production, exact remote and
deployment readback, authenticated Search Console read-only inspection, one
canonical-public Is Agentic scan, and required post-Ready PageSpeed diagnosis.

The package did not change or submit Contact/email; resubmit a sitemap or ask
for indexing; alter domains/aliases, analytics, homepage copy, works, media, or
interactions; force/rewrite history; delete anything; touch the protected
document; or expose a Preview access URL.

## Git and Production identity

- Reviewed release commit:
  `39e18219faaebff70a3e64daa12b1030a8e0d0d3`.
- `origin/main` after fast-forward: exact release commit.
- `origin/codex/hero-cover-refresh` after release push: exact release commit.
- No merge commit, force push, or diverged ancestry was used.
- GitHub Production deployment record: `6057989697`, source/ref exact release
  commit, state `success`.
- Vercel deployment: `dpl_C4EN9CZj7kinLQGVyGkSQ9Y4mUtS`, target
  `production`, state `READY`.
- Direct deployment identity:
  `https://hsin-hsin-yuan-portfolio-8gvs3efca.vercel.app`.
- Existing canonical apex and aliases were assigned by the established Git
  integration; no alias/domain mutation was performed.

The docs-only closeout commit is intentionally pushed only to the active
branch after this report. `main` remains at the reviewed release commit so a
documentation update does not create a second Production deployment. Its
final active-branch SHA is reported externally after exact remote readback to
avoid a self-referential commit cycle.

## Pre-release gates and review

- Content Signal TDD: one valid RED on the missing directive, then focused 1/1
  GREEN after the one-line generator change.
- Full suite: 181/181.
- Fresh build, design-contract audit, six Featured derivatives, production
  dependency audit, diff check, public-output privacy scan, and protected-file
  baseline: pass.
- Browser: all 12 English/Chinese × desktop/mobile ×
  normal/reduced-motion/no-JavaScript cases passed with zero overflow,
  console/page error, or unexpected request failure. The two normal-mobile
  same-origin MP4 aborts per locale are the pre-existing tested warm-handoff
  cancellation contract; video runtime was not changed.
- Frozen packet SHA-256:
  `e1c662651829639effc5a2738b3661e9a63c02c4e5e07fdcb79b5b4cc9f33915`.
- Gemini requested/observed/completed `gemini-3.7-flash`, returned `PASS`, and
  found no BLOCKER, MAJOR, MINOR, or NIT.
- Claude dynamic-`opus` attempt
  `4b1aa2df-9f1a-4cf5-abdb-d39538e623de` ended
  `claude-process-failed` after 203,951 ms. Dispatch is ambiguous and
  observed/completed models are null. It was not retried, downgraded, or
  rerouted, so no dual-review consensus is claimed.
- Local adjudication: `PASS` for the bounded release.

## Canonical public readback

Before release, `/llms.txt` and both Privacy routes were 404; robots had no
Content Signal and sitemap contained only two homepage URLs. After the Ready
Production deployment:

| URL | HTTP | Bytes | Candidate/public identity |
|---|---:|---:|---|
| `/robots.txt` | 200 | 124 | SHA-256 `6ab98b32…a2715`, exact |
| `/llms.txt` | 200 | 1,182 | SHA-256 `8a0bf8a9…bc5ce`, exact |
| `/sitemap.xml` | 200 | 1,653 | SHA-256 `62a7ff1a…ab83`, exact |
| `/en/` | 200 | 39,602 | SHA-256 `960f6b77…d2381`, exact |
| `/zh/` | 200 | 37,308 | SHA-256 `920a0eb2…e587c`, exact |
| `/en/privacy/` | 200 | 5,809 | SHA-256 `297979ce…5ead`, exact |
| `/zh/privacy/` | 200 | 5,405 | SHA-256 `46b5786b…0936`, exact |

The apex returns 308 with `Location: /en/`. Sitemap lists exactly all four
canonical homepage/Privacy URLs. Public responses expose no `X-Robots-Tag`.
Normal and Googlebot fetches of both homepages and both Privacy pages are
byte-identical.

## Search Console readback

Authenticated read-only inspection of the existing Domain property showed:

- Overview: 3 indexed pages and 3 not indexed pages; 0 total web-search clicks.
- Submitted sitemap: `https://hsinhsinyuan.com/sitemap.xml`.
- Status: `Success`.
- Submitted / last read: 2026-08-22 / 2026-08-22.
- Discovered pages / videos: 2 / 0.

This is expected asynchronous state: Production already serves the new
four-URL bytes, but Google has not read the updated sitemap yet. No duplicate
sitemap submission or indexing request was made, and no indexing promise is
claimed.

## Is Agentic observation and adjudication

- Target: `https://hsinhsinyuan.com/` only.
- Stable report: <https://is-agentic.com/scan/hsinhsinyuan.com>.
- Completed snapshot: `2026-08-24T07-04-51-794Z`.
- Score: 82/100, up from the pre-release 77/100 snapshot.
- Essential: 5/7, 62.9/80.
- Recommended: 7/8, 17.5/20.
- Bonus: 9 positive signals, +2.

The prior `Agent instruction / when-to-use` and `Trust anchor pages` gaps no
longer appear after concise `llms.txt` and Privacy reached Production. The
three remaining recommendations were reproduced locally:

1. **Agent-friendly 404:** a unique nonexistent path returns a real HTTP 404,
   so this is not a soft-404 defect. Vercel's short default body does not link
   back to sitemap/`llms.txt`; a custom recoverable body is a legitimate future
   improvement, not a release blocker.
2. **Markdown negotiation:** not applicable to the current static portfolio.
   `Accept: text/markdown` returns declared HTML and bytes identical to the
   normal homepage; the site does not advertise an HTML-to-Markdown variant
   whose cache would require `Vary: Accept`.
3. **Brand discoverability:** consistent with Search Console's still-pending
   crawl/search state. It is an external discovery open item, not permission
   for paid promotion, copy changes, duplicate submissions, or score chasing.

The scan remains diagnostic only and does not supersede the deterministic,
privacy, accessibility, browser, Search Console, performance, or Contact
evidence.

## PageSpeed

The required one-shot mobile-English PageSpeed Online API attempt targeted
`https://hsinhsinyuan.com/en/`. Google returned HTTP 429
`RESOURCE_EXHAUSTED` / `RATE_LIMIT_EXCEEDED`, with the available daily query
limit reported as zero. No score, CrUX metric, transfer result, regression, or
performance claim is made, and the closed video-network package remains closed.

## Worktree isolation and exact next action

The release commit and `main` were clean except for the known protected
untracked document. During branch switching after Production, iCloud created
108 additional untracked ` 2` conflict copies of tracked repository files,
leaving 109 such untracked entries including the protected document. This is
the repository's recorded iCloud conflict-copy failure mode. None is staged,
committed, uploaded, or deleted; the protected document still matches its
recorded baseline. Cleanup is destructive and remains outside this envelope.

Exact next action: make no further Production, Search Console, Is Agentic,
PageSpeed, Contact, domain, copy, media, or interaction change. Wait for Google
to reread the public sitemap. If desired, open a separate explicit package for
the recoverable 404 body or producer-authorized iCloud conflict cleanup.
