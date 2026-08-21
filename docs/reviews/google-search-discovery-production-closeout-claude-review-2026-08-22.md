# Review — Google Search Discovery Production Closeout

**Verdict: `PASS`** (no blockers, no majors). Six `MINOR` and two `NIT` findings below. Closeout is not yet complete — see §Durability.

**Verification basis.** I re-read the cited artifacts read-only (`vercel.json`, `tests/build-site.test.mjs`, `scripts/build-site.mjs`, `dist/sitemap.xml`, `dist/robots.txt`, `dist/zh/index.html`, `docs/performance/README.md`, `STATUS.md`). I have no shell or network in this session, so live HTTP status, live hashes, Search Console state, DNS, and Vercel state are accepted as packet testimony, not independently confirmed. Every finding below is anchored to something I read or to an internal inconsistency in the packet.

## Findings

### MINOR 1 — The `vercel.json` excerpt is abridged but presented as the cited line range
§Runtime change cites `vercel.json:1-22` and prints a JSON block that closes after `redirects`. The real lines 8–20 contain a `headers` block setting `Cache-Control` for `/assets/(.*)` and `/(styles.css|main.js|favicon.svg)` (`vercel.json:8-20`). A reviewer held to "review only the evidence in this packet" would conclude the deployed config has no caching headers. The redirect object itself matches the file verbatim at `vercel.json:6`, so the substantive claim holds. **Remediation:** cite `vercel.json:5-7`, or label the block as abridged.

### MINOR 2 — Sitemap `lastmod` is build-time derived, which time-boxes one determinism claim and weakens a crawl signal
`scripts/build-site.mjs:728` defaults `lastmod` to `new Date().toISOString().slice(0,10)`. Two consequences:

- The recorded `dist/sitemap.xml` digest `0582…` is reproducible only while the UTC date is 2026-08-21; the other three digests are content-derived and stable. §Deterministic local verification presents all four as equivalent. (No date contradiction: `dist/sitemap.xml:5,12` read `2026-08-21`, which is correct for a build at 2026-08-22 00:22 +0800 = 2026-08-21 UTC.)
- Every future deploy re-advertises a new `lastmod` for both URLs with no content change. Google discounts `lastmod` it finds unreliable — mildly counterproductive for the `/zh/` recrawl this package exists to earn.

**Remediation:** record the caveat in the closeout report; content-derived `lastmod` belongs to a separate bounded package, not this one.

### MINOR 3 — No Googlebot-UA parity check for `/zh/`
§Live public read-back establishes browser/Googlebot byte-identity for English only (`6927…`). `/zh/` is the sole unindexed URL, so the one page where UA-conditional serving would matter is the one page lacking the check. Risk is low — static build, single deployment, and `/zh/` live content already matched `2aa8…` for a normal UA. **Remediation:** one read-only Googlebot-UA fetch of `/zh/`, compared against `2aa8…`.

### MINOR 4 — The URL-authority correction leaves a baseline-comparability gap
`docs/performance/README.md:11-12` now makes the apex authoritative, but the only stored reference baseline was captured at `https://hsin-hsin-yuan-portfolio.vercel.app/en/` (`README:56-66`), while `README:42` requires "comparison with the preceding matching baseline" and `README:53-54` forbids claiming improvement from a mismatched URL. The next apex diagnostic therefore has no compliant comparison target. **Remediation:** one sentence marking the 2026-08-10 baseline as alias-captured and the first apex run as a new baseline rather than a comparison.

### MINOR 5 — The protected document's SHA-256 is printed in an artifact slated for commit
§Deterministic local verification prints `945d4df9…` while the same section treats "protected hash" as a marker to keep out of published output. The scan covers `dist/`; §Worktree isolation then authorizes committing this packet. A bare SHA-256 is a confirmation oracle, not content, so exposure is limited — but if the `origin` remote is public, the fingerprint becomes public. **Remediation:** confirm remote visibility, or state "matches the recorded baseline digest" in the committed packet and keep the literal digest in an untracked ledger.

### MINOR 6 — The deferred PageSpeed obligation has no retry trigger
§Post-publish performance observation correctly refuses to claim a score after HTTP 429 / quota zero, but names no condition under which the required post-Ready diagnostic actually runs. Without one, a mandatory check lapses silently. **Remediation:** record it in `STATUS.md` as a dated open item with a retry condition (quota reset), explicitly not authorizing remediation.

### NIT 1 — `lang` / `hreflang` / `og:locale` specificity mismatch on `/zh/`
`dist/zh/index.html:2` declares `<html lang="zh">` while `dist/zh/index.html:10` declares `hreflang="zh-Hant"` and `og:locale` is `zh_TW` (`scripts/build-site.mjs:780`). Google uses hreflang, not the `lang` attribute, for language targeting, so this is **not** a cause of the non-indexing. Out of scope for a package that must stop after this finding. **Remediation:** log as a follow-up candidate only.

### NIT 2 — Packet slightly overstates the README wording
§Post-publish performance observation says the old alias is retained "as the preserved fallback and historical baseline URL"; `README:13-14` labels it only "Preserved Vercel project alias." Folds into MINOR 4's remediation.

## Answers to the review questions

1. **Smallest correct runtime change — yes.** One boolean at `vercel.json:6`, no public HTML/CSS/JS/copy/media/handler touched. `permanent: true` yields Vercel's 308, which matches the observed status in §Live public read-back and which Google treats as equivalent to 301 for canonicalization. A `statusCode: 301` variant would be a stylistic preference, not a correctness gap.
2. **Yes, with MINOR 2/3 noted.** The focused test is genuinely strict — `tests/build-site.test.mjs:1` imports `node:assert/strict`, so the `deepEqual` at line 21 is a strict deep comparison and a truthy non-boolean would fail it. Test-first ordering (red on `permanent: false`, green after) is stated. Three of four artifact hashes are content-derived and stable; the fourth is date-bound.
3. **Yes.** §Search Console records `/zh/` as `Discovered - currently not indexed` with an accepted request and explicitly disclaims immediate indexing. One precision note: the `/en/` crawl timestamp (2026-08-16) predates this deployment, so `URL is on Google` is evidence about `/en/`, not yet about the new 308. The packet does not claim otherwise.
4. **Yes.** No score, metric, CrUX result, or regression is claimed; the failure is attributed to the service and correctly does not authorize changes or reopen the closed network-budget package. Only the retry trigger is missing (MINOR 6).
5. **Yes.** `README:9-14` now names the apex as the active target, and the surviving alias URL at `README:58` sits inside a clearly historical "Reference Baseline — 2026-08-10" section, so no active instruction still points at the old alias. Documentation-only; no runtime effect. Residual gap is comparability (MINOR 4).
6. **Adequate, with MINOR 5.** The protected document stays untracked; the LinkedIn package and its `docs/reviews/LOG.md` hunk are excluded from the runtime commit; the verification TXT token was never printed or committed; the public-output scan covers the relevant marker classes. The one loose thread is the protected digest in a to-be-committed file.

## `/zh/` crawl status

The pending Google crawl of `/zh/` is an **external open item — not a product blocker.** Everything under producer control is correct and verified: `/zh/` returns 200 with no `X-Robots-Tag`, carries a self-referential canonical (`dist/zh/index.html:8`), reciprocal `en` / `zh-Hant` / `x-default` alternates (`:9-11`), appears in the sitemap with matching alternates (`dist/sitemap.xml:10-16`), `x-default` resolves to a 200 page rather than the redirecting apex, and `robots.txt` allows all crawlers and names the canonical sitemap. Scheduling is Google's to decide; a valid, accepted indexing request is the complete deliverable here.

## Durability

**Off-device durability is not complete at the reviewed checkpoint.** Two distinct states:

- **Runtime durability: complete.** `9f2473f` is the runtime commit and is the tip of both `origin/main` and `origin/codex/hero-cover-refresh`, matching the Ready Production source commit.
- **Closeout durability: incomplete.** Per §Reviewed Git identities, `0534743` is reachable from no `origin` ref, and the closeout commit does not exist yet.

To complete formal closeout: commit this packet, reviewer outputs/status ledgers, one adjudication, one dated closeout report, the `README` correction, the bounded `STATUS.md` update, and a single isolated `docs/reviews/LOG.md` entry as one coherent docs-only commit; non-force push it to `codex/hero-cover-refresh`; read the remote tip back and confirm it equals the local tip with nothing unreachable. Do not push `main`, trigger another Production, touch DNS/Search Console, or touch the protected document. Only after that read-back may the closeout claim complete durability.
