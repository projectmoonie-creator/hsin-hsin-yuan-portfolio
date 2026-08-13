# Frozen Review Packet — Portfolio Custom-Domain Production Cutover R1

## Role and boundary

You are an independent convergence reviewer. Produce findings only; do not edit
the repository, deploy, change DNS, submit Contact, or use credentials.

## Objective

Review the smallest candidate that changes the Hsin-Hsin Yuan portfolio's
canonical public origin from
`https://hsin-hsin-yuan-portfolio.vercel.app` to
`https://hsinhsinyuan.com`, while preserving every visual, media, interaction,
privacy, accessibility, and Contact behavior.

## Repository identity

- Repository: `.` (current portfolio checkout)
- Branch: `codex/hero-cover-refresh`
- Candidate commit: `55658db0284aa9f295ecb88da1320f26a9bccf1c`
- Parent commit: `3e412c5d7e5399ccfc01faf8c66c5b69e13db763`
- Origin main: `4193498208d74c01a4876f7550642c4cc8c7c3b4`
- The candidate is local only. No Git push or main integration is authorized.

## External state already verified read-only

- `hsinhsinyuan.com` is owned by `projectmoonie-creator` under Vercel team
  `projectmoonie-creators-projects`, registrar Vercel, expiry 2027-08-13.
- Target Vercel project: `hsin-hsin-yuan-portfolio`, ID
  `prj_0D4H7m6XOI7QlM1pR0yra9dnyJj6`.
- Current Ready Production deployment:
  `dpl_5h1nsgGwCB5nDqFgkFEDHvYmG4XQ`.
- The custom domain is not yet attached to any project.
- Producer explicitly authorized the Production custom-domain connection.

## Exact source change

```diff
diff --git a/scripts/build-site.mjs b/scripts/build-site.mjs
-const SITE_ORIGIN = (process.env.SITE_ORIGIN || "https://hsin-hsin-yuan-portfolio.vercel.app").replace(/\/+$/, "");
+const SITE_ORIGIN = (process.env.SITE_ORIGIN || "https://hsinhsinyuan.com").replace(/\/+$/, "");

diff --git a/figma/hsin-portfolio-importer/manifest.json b/figma/hsin-portfolio-importer/manifest.json
-    "allowedDomains": ["https://hsin-hsin-yuan-portfolio.vercel.app"],
+    "allowedDomains": ["https://hsinhsinyuan.com"],

diff --git a/figma/hsin-portfolio-importer/code.js b/figma/hsin-portfolio-importer/code.js
-const SITE_URL = "https://hsin-hsin-yuan-portfolio.vercel.app";
+const SITE_URL = "https://hsinhsinyuan.com";
```

Tests changed first and were observed failing for the old origin. They now
assert the new robots sitemap URL, sitemap locale URL, English canonical,
Chinese Open Graph URL, absence of the old origin from generated public
artifacts, and the exact Figma importer origin/allowlist.

## Generated-output contract

`SITE_ORIGIN` remains the single source for:

- English and Chinese canonical links;
- hreflang links;
- Open Graph page and image URLs;
- Person JSON-LD `url`;
- `robots.txt` sitemap URL; and
- both locale entries in `sitemap.xml`.

The environment override remains supported. The old Vercel project URL may
remain reachable as a platform alias, but must not appear as the canonical
origin in the new generated output.

## Validation evidence

- Focused RED: 3 expected failures because the old origin was still present.
- Focused GREEN: 49/49.
- Full test suite: 179/179.
- Fresh build: pass.
- Figma SVG export: pass, no tracked drift.
- Design-contract audit: pass; 6 Featured / 5 Archive / 2 global Press /
  3 work Press; no drift.
- Featured derivative integrity: 6/6.
- Production dependency audit: 0 vulnerabilities.
- `git diff --check`: pass.
- Privacy scan: no private absolute path, protected filename, or direct private
  email in `dist/`.
- Protected untracked document remains byte-identical at SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`
  and is outside the commit.
- Old-origin versus new-origin clean builds have identical file lists and
  identical bytes for every file except exactly:
  `en/index.html`, `zh/index.html`, `robots.txt`, `sitemap.xml`.
- Local browser matrix: English/Chinese × 1440×900/390×844 ×
  normal/reduced-motion/no-JavaScript = 12/12 pass. Every case has the expected
  new canonical and OG URL, zero horizontal overflow, visible Hero and Contact,
  zero Contact POST, zero page error, and zero console error.

## Planned post-review cutover

If the candidate is approved:

1. Build a privacy-audited isolated Production package containing exact
   `dist/`, unchanged `api/contact.js`, and minimal equivalent Vercel config.
2. Deploy that package to the existing project as Production and read back
   Ready state by deployment ID.
3. Attach `hsinhsinyuan.com` to that project.
4. Attach `www.hsinhsinyuan.com` as a permanent redirect to the apex.
5. Read back project-domain configuration, apex/www DNS, TLS/Ready state, and
   deployment alias ownership using official Vercel tooling. The deployment
   skill forbids fetching the deployed pages, so use metadata readback rather
   than HTTP page fetch.
6. Keep the old Vercel project alias as a rollback/reachability path. Do not
   delete deployments, domains, or aliases.

## Non-goals

- No copy, layout, image, video, interaction, accessibility, runtime timing,
  Contact logic, email provider, environment variable, Git push, main, tag,
  or destructive Vercel change.
- The separate showreel authoring compositions that display the old URL are
  not deployed website output and stay outside this bounded package.
- Contact remains non-operational and remains a launch blocker after this
  domain package.

## Requested review dimensions

1. Is the canonical-origin change complete and single-sourced for deployed
   website and active design handoff consumers?
2. Is any required active source or generated-output assertion missing?
3. Does the proposed apex/www cutover preserve rollback and avoid accidental
   project/domain ownership changes?
4. Could this candidate change public presentation, media behavior, Contact,
   privacy, or accessibility beyond the stated URL substitution?
5. Are any blocker claims supported by current file-and-line evidence?

## Required response

Return:

- `VERDICT: PASS` or `VERDICT: NEEDS_REVISION`;
- findings grouped as `BLOCKER`, `MAJOR`, `MINOR`, `NIT`;
- each actionable finding with current `file:line`, evidence, consequence, and
  smallest fix;
- explicit confirmation of whether the Production cutover may proceed;
- no edits and no invented evidence.
