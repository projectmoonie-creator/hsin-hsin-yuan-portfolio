# Frozen Review Packet — Google Search Discovery Production Closeout

Frozen: 2026-08-22 00:22:35 +0800

## Reviewer contract

Act as an independent findings-only reviewer. Do not edit files, mutate Git,
DNS, Search Console, Vercel, or the public website. Review only the evidence in
this packet. Return:

1. verdict: `PASS` or `NEEDS_REVISION`;
2. findings ordered by `BLOCKER`, `MAJOR`, `MINOR`, then `NIT`;
3. for every finding, cite a packet section and the affected file/line or
   external fact, explain impact, and name the smallest remediation;
4. explicitly state whether the pending Google crawl of `/zh/` is a product
   blocker, an external open item, or neither;
5. explicitly state whether off-device durability is complete at the reviewed
   checkpoint;
6. if there are no findings, say so directly.

Do not treat naming, stylistic preference, speculative edge cases, or the
absence of an immediate Google crawl as blockers. A blocker requires a
credible truth, privacy, rights, security, functional, deployment, or
durability failure.

## Package and authorization

- Package: Google Search discovery and indexing for the existing bilingual
  Production portfolio.
- Goal: make both canonical language pages discoverable and observable in
  Google without changing approved copy, media, layout, or interaction.
- Producer authorization covers local tests/source/docs, the Search Console
  Domain property, one Google verification TXT, sitemap submission, URL
  inspection/indexing requests for `/en/` and `/zh/`, coherent local commits,
  non-force active-branch and `main` pushes, and one Production update after
  gates pass.
- Excluded: Contact/email work, copy, media, layout, interaction, purchases,
  secrets in Git/output, force push, destructive DNS/Vercel actions, unrelated
  aliases, and the protected untracked review document.
- The package must stop after this one indexing finding is accepted or
  rejected. It is not a general performance or SEO rewrite.

## Reviewed Git and deployment identities

- Branch: `codex/hero-cover-refresh`.
- Runtime commit:
  `9f2473f8baebb3557e7a4872d9baf0cc955bdff6`.
- Runtime parent:
  `0855287` (`docs: resolve governance durability blocker`).
- `origin/main`:
  `9f2473f8baebb3557e7a4872d9baf0cc955bdff6`.
- `origin/codex/hero-cover-refresh`:
  `9f2473f8baebb3557e7a4872d9baf0cc955bdff6`.
- Local docs-only status checkpoint:
  `05347439ce2cc144ada7eb6ebe333169837ec9f7`.
- Before formal closeout documentation is committed, exactly one local commit
  is unreachable from every `origin` ref: `0534743`. Project rules therefore
  require the final coherent closeout checkpoint to be non-force pushed to an
  authorized remote branch and read back before the final verdict can claim
  complete durability.
- Vercel Production deployment:
  `6dAEBc8Dm4pv15Kjy6SYQYZRHCib`.
- Vercel deployment URL:
  `https://hsin-hsin-yuan-portfolio-q9gcvnxd6.vercel.app`.
- Canonical Production origin: `https://hsinhsinyuan.com`.
- Vercel Dashboard read-back on 2026-08-22 shows `Ready`, source branch
  `main`, source commit `9f2473f`, and the canonical domain attached.
- Git integration produced one branch Preview and exactly one Production for
  the runtime commit. There was no second manual Production deployment.

## Runtime change and focused test

`vercel.json:1-22` contains one relevant change:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "redirects": [
    { "source": "/", "destination": "/en/", "permanent": true }
  ]
}
```

The prior value was `permanent: false`. No public HTML, CSS, JavaScript,
copy, media, Contact handler, domain name, or interaction code changed.

`tests/build-site.test.mjs:17-26`:

```js
test("root permanently redirects to the canonical English homepage", () => {
  const vercel = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
  const rootRedirect = vercel.redirects.find((redirect) => redirect.source === "/");

  assert.deepEqual(rootRedirect, {
    source: "/",
    destination: "/en/",
    permanent: true,
  });
});
```

Test-first evidence: this focused test failed against the former
`permanent: false` config, then passed after the one-line correction.

## Deterministic local verification

Fresh closeout rerun on 2026-08-22:

- focused redirect test: 1/1 pass;
- full `npm test`: 180/180 pass;
- fresh `npm run build`: pass;
- `npm run audit:design-contract`: pass, no active contract drift;
- `npm run featured-reels:check`: pass, six derivatives;
- `git diff --check`: pass;
- public-output privacy scan: no private checkout path, direct private email,
  Shareable token marker, protected filename, or protected hash;
- protected document remains untracked and byte-identical at SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.

Generated file SHA-256:

- `dist/en/index.html`:
  `69272dd184c25fad1f0ec9464e306b2368e54f52f0c8cae42c981fd24397189d`;
- `dist/zh/index.html`:
  `2aa8819599348b4e14d9ade95378019732d7eb8260f0a35fff4377e1809588cc`;
- `dist/robots.txt`:
  `9ddb1036ffeed65fdc8c0c748c537c26dcea153fab00d716ff7cf4b6198d7bf4`;
- `dist/sitemap.xml`:
  `05825142bb946bd1d39ec9342e6a85cf0e17c4197762aae42ca62915f431d1dc`.

Each live public resource produced the identical corresponding hash.

## Live public read-back

Read-only checks on 2026-08-22:

- `https://hsinhsinyuan.com/` returns HTTP 308 with
  `Location: /en/`, then `/en/` returns 200.
- `/en/` and `/zh/` return 200 with no `X-Robots-Tag`.
- `robots.txt` allows all crawlers and names the canonical sitemap.
- `sitemap.xml` contains exactly `/en/` and `/zh/`, each with reciprocal
  `en`, `zh-Hant`, and `x-default` alternates.
- English canonical:
  `https://hsinhsinyuan.com/en/`.
- Chinese canonical:
  `https://hsinhsinyuan.com/zh/`.
- Browser and Googlebot user agents received byte-identical English HTML at
  SHA-256
  `69272dd184c25fad1f0ec9464e306b2368e54f52f0c8cae42c981fd24397189d`.
- Desktop 1440×900 and mobile 390×844 navigation to the apex both landed on
  `/en/`, exposed `lang="en"`, the correct canonical, the visible
  `HSIN-HSINYUAN` heading, zero horizontal overflow, and zero browser error
  logs.

## Google Search Console and DNS read-back

- Search Console Domain property: `hsinhsinyuan.com`, accessible and verified.
- Public DNS retains exactly one TXT record matching the Google site
  verification record class. The token value was intentionally not printed,
  copied into this packet, or stored in Git.
- Submitted sitemap:
  `https://hsinhsinyuan.com/sitemap.xml`.
- Search Console sitemap status: `Success`, last read 2026-08-22, two
  discovered pages.
- `/en/`: `URL is on Google`; sitemap recognized; last crawl
  2026-08-16 05:29:33; Googlebot smartphone; crawl allowed, fetch successful,
  indexing allowed; user canonical and Google-selected canonical both resolve
  to the inspected URL. A duplicate request was not sent because Search
  Console offered `Request again`.
- `/zh/`: `URL is not on Google`; reason
  `Discovered - currently not indexed`; sitemap and referring English page
  recognized. A live eligibility check passed, the indexing request was
  accepted, and current read-back says `Indexing requested` / `Request again`.
  This is an accepted crawl request, not a promise of immediate indexing.

## Post-publish performance observation

Project rules require one routine mobile PageSpeed diagnostic after a Ready
Production. The closeout attempt targeted
`https://hsinhsinyuan.com/en/` through Google's official PageSpeed Online API
on 2026-08-22. It returned HTTP 429 `RESOURCE_EXHAUSTED`,
`RATE_LIMIT_EXCEEDED`, with available daily query quota reported as zero.

No score, metric, CrUX result, or performance regression is claimed. The
service failure does not authorize code or media changes and does not reopen
the closed mobile preview network-budget package.

During closeout, `docs/performance/README.md:9-14` was corrected so the
current Production alias is `https://hsinhsinyuan.com`; the old Vercel
project alias is retained explicitly as the preserved fallback and historical
baseline URL. This is a documentation-only authority correction.

## Worktree isolation

The worktree also contains a pre-existing LinkedIn documentation package and
its own `docs/reviews/LOG.md` addition. Those paths are unrelated user work,
were not staged into the runtime commit, and must remain untouched by this
closeout. The protected untracked review document is likewise excluded from
every commit and deployment.

The formal closeout may add only:

- this frozen packet and reviewer outputs/status ledgers;
- one local adjudication and one dated closeout report;
- the PageSpeed URL-authority correction above;
- a bounded current-package update to `STATUS.md`;
- at most one package entry in `docs/reviews/LOG.md`, isolated from the
  pre-existing LinkedIn hunk;
- a coherent docs-only closeout commit and its non-force active-branch
  read-back.

It must not push `main`, trigger another Production, alter DNS/Search Console,
submit Contact, reveal credentials, or touch the protected document.

## Review questions

1. Is the one-line permanent root redirect the smallest correct runtime change?
2. Do the focused test, 180-test suite, exact live/build hashes, crawler
   artifacts, and desktop/mobile redirect checks support Production correctness?
3. Are the Search Console records stated accurately without promising
   immediate Chinese indexing?
4. Does the PageSpeed 429 treatment preserve evidence without falsely passing
   or failing performance?
5. Does the PageSpeed URL-authority correction remove the active-doc
   contradiction without changing runtime?
6. Is privacy/protected-file isolation adequate?
7. What must still happen for off-device durability and formal closeout to be
   complete?
