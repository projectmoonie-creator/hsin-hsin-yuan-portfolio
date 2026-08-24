# Search / Privacy / llms.txt Production Release — Frozen Review Packet

Frozen: 2026-08-24T14:51:18+08:00

## Review contract

Review this bounded release read-only. Return findings only; do not edit files,
deploy, push, submit forms, change Search Console, or contact anyone. Classify
each finding as `BLOCKER`, `MAJOR`, `MINOR`, or `NIT`, cite packet evidence, and
end with a release verdict of `PASS`, `PASS_WITH_OPEN_ITEMS`, or `BLOCKED`.
Absence of findings must be stated explicitly. Treat public-service results as
observations rather than promises about future crawling or indexing.

## Decision requested

Decide whether the completed 8/24 Privacy and agent-discovery candidate, plus
the one test-first Content Signal delta below, is safe to fast-forward to
`main` and Git-integrated Production. The release is followed only by public
readback, authenticated Search Console read-only inspection, and one anonymous
canonical-public Is Agentic scan.

## Candidate identity and branch relation

- Repository: Hsin-Hsin Yuan Portfolio.
- Active branch: `codex/hero-cover-refresh`.
- Frozen tracked base HEAD:
  `6be439696464bf55d3736c1131b02242d329a662`.
- Frozen `origin/main`:
  `9f2473f8baebb3557e7a4872d9baf0cc955bdff6`.
- Relation: active HEAD is four commits ahead of `origin/main`, with no
  divergence and no commit unreachable from all `origin` refs.
- The only unrelated worktree item is one protected untracked document. It is
  excluded from the diff, scans, commits, deployment, prompts, and all actions;
  its current digest matches the previously recorded baseline.

The four already-durable candidate commits are:

1. `0534743` — Google indexing closeout records.
2. `3c5aba7` — Google search discovery closeout records.
3. `9ccf75d` — bilingual Privacy pages, locale links, four-URL sitemap, and
   concise root `llms.txt`.
4. `6be4396` — durability and governance closeout records.

## Integrated authorization envelope

The producer authorized one package covering bounded local source/tests/docs,
necessary official research, full gates, Claude and Gemini review, coherent
commits, a non-force active-branch push, fast-forward-only `main`,
Git-integrated Production, exact remote/deployment readback, Search Console
read-only inspection, and one canonical-public Is Agentic observation.

Hard exclusions are Contact or email submission/configuration/reset; duplicate
sitemap submission or a new indexing request; domain/alias changes; purchases;
analytics; homepage copy, works, media, or interaction changes; force/history
rewrite; destructive actions; the protected document; and sending a Preview
token or private URL to Is Agentic.

## Completed 8/24 candidate

Implementation commit `9ccf75d` already supplies:

- `/en/privacy/` and `/zh/privacy/`, rendered statically with canonical and
  reciprocal locale alternates.
- Locale-matched Privacy links beside the existing Contact links.
- Four sitemap URLs: English and Chinese homepage plus English and Chinese
  Privacy.
- A concise 1,182-byte root `/llms.txt` naming canonical pages, appropriate
  portfolio uses, Contact anchors, and explicit inference boundaries.

That package retained homepage copy, work/media content, geometry,
interactions, Contact runtime, and responsive media sources. Its final
bilingual rights clause covers inquiry/review, copy, supplement/correction,
cessation of collection/processing/use, and deletion. Prior Preview validation
was 181/181 tests, build, design and media gates, output privacy scan, and
desktop/mobile browser QA. Gemini reviewed the parent and narrow corrected
delta with no BLOCKER, MAJOR, or MINOR. The prior Claude attempt was unusable
and recorded as incomplete; this Production package therefore runs a fresh
full rotation rather than claiming earlier dual consensus.

## New test-first Content Signal delta

The signal belongs in the `User-agent: *` group of generated `robots.txt`:

```diff
 function renderRobots() {
   return `User-agent: *
+Content-Signal: search=yes, ai-input=yes, ai-train=no
 Allow: /

 Sitemap: ${SITE_ORIGIN}/sitemap.xml
 `;
 }
```

The focused test now reads generated `robots.txt`, requires the exact adjacent
directive, and includes robots in the existing private-output checks:

```diff
+  const robots = readDist("robots.txt");
+  assert.match(
+    robots,
+    /^User-agent: \*\nContent-Signal: search=yes, ai-input=yes, ai-train=no\nAllow: \/$/m,
+  );
-  for (const artifact of [enPrivacy, zhPrivacy, llms, sitemap]) {
+  for (const artifact of [enPrivacy, zhPrivacy, robots, llms, sitemap]) {
```

The first syntactically valid RED run failed because the generated file lacked
the directive and showed only `User-agent`, `Allow`, and `Sitemap`. After the
one-line generator change, the same test passed 1/1.

## Current official-source basis

- Cloudflare's current bot documentation defines Content Signals as
  machine-readable `robots.txt` directives. It defines `search` as building a
  search index and returning links/short excerpts, `ai-input` as query-time AI
  input such as retrieval/grounding, and `ai-train` as training/fine-tuning.
  Source: <https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/>.
- Cloudflare's current crawler documentation reads `Content-Signal` from
  `robots.txt`, recognizes exactly `search`, `ai-input`, and `ai-train`, and
  describes signals as trust-based preferences. Source:
  <https://developers.cloudflare.com/browser-run/quick-actions/crawl-endpoint/#content-signals>.
- Vercel documents global custom response headers separately through
  `vercel.json`; that is not the published consumption point used by the
  Content Signals crawler contract above. Source:
  <https://vercel.com/docs/project-configuration/vercel-json#headers>.

Accordingly, the package does not add a similarly named HTTP response header.
It also does not describe `ai-train=no` as technical enforcement, and it does
not use Content Signals as a substitute for the Privacy notice or copyright
rights.

## Deterministic verification

- Focused test: 1/1 pass after the valid RED described above.
- Full suite: 181/181 pass.
- Fresh build: pass.
- Design-contract audit: pass; 6 Featured / 5 Archive / 2 global Press / 3
  work Press; no drift.
- Featured derivative integrity: six pass.
- Production dependency audit: zero vulnerabilities.
- `git diff --check`: pass.
- Generated-output scan: zero credential variable names, email addresses,
  private absolute paths, protected filename, test/source/status/Bible files.
- `dist/` remains ignored; generated pages are not committed.
- Protected untracked document: digest matches the recorded baseline and is
  absent from the tracked diff.

Generated artifact identities from the fresh build:

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `dist/robots.txt` | 124 | `6ab98b32fa33c44da72e5d766aee53a15d0841fd2ec8a413d627ca0e9a6a2715` |
| `dist/llms.txt` | 1,182 | `8a0bf8a960b837018612eea39570b5723104c9a6c42f5bcf86f148031c1bc5ce` |
| `dist/sitemap.xml` | 1,653 | `62a7ff1a96b4e3cd646ab105e3c7be213f93dfe6430921fbf74ac9954f64ab83` |
| `dist/en/privacy/index.html` | 5,809 | `297979ceaf9f2555db8506fa69b526585b234a0ebb44af838330dd7367e85ead` |
| `dist/zh/privacy/index.html` | 5,405 | `46b5786b3100a1461b51684593067398386e4e01cb9f592bc7fde394fc8d0936` |

## Browser matrix

A fresh local static build was inspected in headless Google Chrome across all
12 combinations of English/Chinese, 1440x900/390x844, and
normal/reduced-motion/no-JavaScript. Every case returned 200, displayed the H1
and visible Contact route, contained exactly one locale Privacy link, had zero
horizontal overflow, and produced no console or page error.

Normal mobile produced two same-origin mobile-MP4 `net::ERR_ABORTED` events per
locale. These are expected lifecycle cancellations: the established runtime
restores a warmed video to `preload="none"` and calls `load()` to cancel the old
request, and the existing unit contract requires that handoff. Reduced-motion,
no-JavaScript, and desktop cases produced zero such events. No runtime file was
changed in response to this observation.

## Public pre-release baseline

Read-only canonical fetches immediately before release found:

- `/robots.txt`: 200, 70 bytes, no Content Signal, two homepage sitemap URLs.
- `/sitemap.xml`: 200, 871 bytes, only `/en/` and `/zh/`.
- `/llms.txt`: 404.
- `/en/privacy/`: 404.
- `/zh/privacy/`: 404.

This makes the producer's priority observable: Privacy and concise `llms.txt`
are not public until this candidate reaches Production.

## Planned release and readback

If and only if this review and local adjudication leave no blocking finding:

1. Commit and non-force push the bounded delta to the active branch; verify the
   exact remote tip.
2. Fast-forward local `main` to the reviewed candidate and non-force push
   `main`; verify exact remote ancestry and tip.
3. Let the existing Vercel Git integration create Production. Require `Ready`,
   Production target, and the intended source commit before accepting it.
4. Read back canonical `/robots.txt`, `/sitemap.xml`, `/llms.txt`, both Privacy
   pages, `/en/`, `/zh/`, and the apex redirect. Compare public artifacts with
   the generated candidate and check browser/Googlebot canonical parity.
5. Inspect the existing Search Console domain property and sitemap read-only.
   Do not resubmit the sitemap or request indexing again.
6. Submit only `https://hsinhsinyuan.com/` to Is Agentic, record the observation
   and locally adjudicate it against the site's actual scope. Never submit the
   protected Preview or its access token.
7. Run the required read-only post-Ready PageSpeed diagnostic; a quota/service
   failure is recorded without authorizing performance changes.

## Questions for the reviewer

1. Is `robots.txt` the correct and sufficient layer for the producer's exact
   three Content Signal preferences, given the cited current contract?
2. Does the signal wording accidentally overclaim enforcement, permission, or
   legal effect anywhere in the package?
3. Is the test strict enough to prevent a misplaced or silently altered signal
   while preserving the existing `Allow` and canonical sitemap declaration?
4. Do the completed local gates and prior reviewed candidate evidence support
   a fast-forward-only `main`/Production release without reopening copy, media,
   design, Contact, or interaction work?
5. Is the post-release plan correctly limited to readback and one anonymous
   public scan, with no duplicate Search Console mutation?
6. Identify any release blocker or material missing evidence strictly inside
   this authorization envelope.
