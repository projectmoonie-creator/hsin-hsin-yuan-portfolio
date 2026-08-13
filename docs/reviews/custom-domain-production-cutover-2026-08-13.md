# Custom Domain Production Cutover — 2026-08-13

State: `PASS`

## Scope and authorization

The producer purchased `hsinhsinyuan.com`, approved connecting it to the
formal portfolio, and approved sending the frozen review packet to the Gemini
official API. The canonical public origin is the apex
`https://hsinhsinyuan.com`; `www` is a permanent redirect to the apex.

This package did not authorize or perform Git push, `main`, tag, Contact
submission, mail-provider/environment setup, force push, or destructive Vercel
action. The prior Vercel project alias and earlier deployments were preserved.

## Source candidate and test-first proof

- Branch: `codex/hero-cover-refresh`.
- Actual candidate commit:
  `55658db0284aa9f295ecb88da1320f26a9bccf1c`.
- Parent: `3e412c5d7e5399ccfc01faf8c66c5b69e13db763`.
- Closed `origin/main` baseline:
  `4193498208d74c01a4876f7550642c4cc8c7c3b4`.
- The candidate remained local only throughout the cutover.

Tests were changed first. Focused RED produced the three expected failures
while the old project origin remained; focused GREEN passed 49/49 after the
smallest source change. The candidate changes only:

- the default website `SITE_ORIGIN`;
- the Figma importer `SITE_URL`; and
- the Figma importer `allowedDomains` entry.

No copy, layout, image, video, interaction, accessibility, timing, or Contact
logic changed.

## Local gates

- Full tests: 179/179 pass.
- Fresh build, Figma export, design-contract audit, and six Featured derivative
  integrity: pass.
- Production dependency audit: zero vulnerabilities.
- `git diff --check` and generated-output privacy scan: pass.
- Protected document remains untracked and byte-identical at SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.
- Clean old-origin/new-origin builds have identical paths and identical bytes
  except exactly `en/index.html`, `zh/index.html`, `robots.txt`, and
  `sitemap.xml`.
- English/Chinese × desktop/mobile × normal/reduced-motion/no-JavaScript:
  12/12 pass, with correct canonical and Open Graph URLs, visible Hero and
  Contact, zero overflow, zero Contact POST, and no page or console errors.

## Independent review

Packet sent for review:
`docs/reviews/evidence/custom-domain-production-cutover/round-1/review-packet.md`
at SHA-256
`6c3b0fa0e8128f52a335a78f5263de9a560b54e7805d883f394241ffebc0aaf5`.

- Gemini official API requested/observed/completed `gemini-3.6-flash` and
  returned `PASS`, no BLOCKER/MAJOR/MINOR/NIT, with explicit approval to
  proceed.
- Claude subscription-only attempt
  `45ef1139-941e-4b3b-abec-2b01990e6500` failed after preflight; requested
  dynamic `opus`, observed/completed model `null`. It is incomplete and is not
  represented as a review result.
- No dual-review consensus is claimed. One usable independent PASS plus local
  reproduction closes the gate under the project review contract.
- The post-review full-suite privacy gate found the packet's private absolute
  checkout path. The tracked archival packet replaces that path with a
  repo-relative label and replaces its provisional full candidate SHA with the
  actual content-equivalent commit. Current packet SHA-256 is
  `b1fa4f1afa275d4ac0cba74e2a4509996344509fecbc4adad731397cc02d902e`.
  The reviewed and current hashes, unchanged technical content, and disposition
  are recorded in `round-1/local-adjudication.md`.

## Isolated Production package

The deployment did not use the repository worktree. The isolated package at
`/private/tmp/portfolio-domain-production.G0HKI7` contained:

- 57 exact current `dist/` files;
- unchanged `api/contact.js`; and
- minimal equivalent static Vercel routing/cache configuration.

Package identity, excluding local Vercel control metadata:

- 59 files;
- 96,783,418 bytes;
- sorted newline-joined path-list SHA-256
  `4a35f046c94f524bba31eb39be2526791922ea0860b95126cd7dcbf48a6dd8c7`;
- Contact source/staged SHA-256
  `2b756da78d79418df890f2cdf2566f6069c90610a179af122e8a51f1be42eb06`.

Dry-run saw all 59 files, zero ignored files, framework `Other`, and the
Contact function. Privacy scanning found no protected filename/hash, private
path/email, environment-value syntax, or Shareable token.

## Production and domain read-back

- Previous Production rollback identity:
  `dpl_5h1nsgGwCB5nDqFgkFEDHvYmG4XQ`.
- New Production:
  `dpl_BZJ7LdJZ9a3xXXku48KvdPu1Fz9y`.
- Direct deployment:
  `https://hsin-hsin-yuan-portfolio-aqlg7x2uv.vercel.app`.
- Preserved project alias:
  `https://hsin-hsin-yuan-portfolio.vercel.app`.
- Canonical apex: `https://hsinhsinyuan.com`.
- Redirect: `https://www.hsinhsinyuan.com` → apex, Vercel 308.

Read-back of the direct deployment, old alias, apex, and `www` all resolves by
Vercel metadata to the same deployment ID, target `production`, state `READY`,
with `api/contact` built in `iad1`. Both custom domains are attached to the
intended project, verified, configured correctly, and report no issues or
conflicts. Vercel nameservers match the intended nameservers.

Vercel Dashboard read-back shows the apex connected to Production and `www`
configured as `308 hsinhsinyuan.com`. Auto-renewing certificate
`cert_bJmcugPGdiM9e6DYlBRGURwO` covers `hsinhsinyuan.com` and
`*.hsinhsinyuan.com`, with renewal enabled.

No deployed page or Contact endpoint was directly fetched during this Vercel
read-back.

## Post-publish PageSpeed attempt

- Attempted: 2026-08-13 21:19 +08:00.
- Target: `https://hsinhsinyuan.com/en/`.
- Service: Google PageSpeed Online API, mobile performance category.
- Result: HTTP 429 `RESOURCE_EXHAUSTED`; the reported consumer had zero
  available daily queries.

No Lighthouse score or metric was produced. This is recorded as measurement
service unavailability, not a site-performance failure, and it does not reopen
the closed network-budget package.

## Verdict, rollback, and exact next action

Verdict: `PASS`. The own-domain Production cutover is complete and verified.
If domain rollback becomes necessary, detach only under new authorization and
retain reachability through the preserved Vercel alias and previous Production
identity; no rollback action is currently needed.

The overall portfolio state remains `BLOCKED` because Contact has no configured
delivery environment. Exact next action: open one separately approved
Contact-routing package to decide the public alias, private forwarding
destination, authenticated sender, mail provider and DNS ownership, Vercel
environment variables, failure fallback, and an end-to-end receive/reply test.
Make no further Production, domain, Git, or Contact change in this package.
