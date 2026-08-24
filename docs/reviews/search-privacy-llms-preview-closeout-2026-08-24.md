# Search / Privacy / llms.txt — Preview closeout

Date: 2026-08-24 (Asia/Taipei)
State: `READY_PRODUCER_INSPECTION`

## Bounded outcome

- Added static bilingual Privacy pages at `/en/privacy/` and `/zh/privacy/`.
- Added locale-matched Privacy links to the existing Contact link row.
- Added both Privacy URLs to the sitemap with correct page-family alternates.
- Added a concise root `llms.txt` that identifies canonical pages, public capabilities, inquiry routes, and non-inference boundaries without claiming to control indexing.
- Preserved the homepage's approved copy, works, media, geometry, interactions, Contact form behavior, and responsive-source contract.
- Production, Git push, `main`, formal domain aliases, Contact configuration/submission, and Search Console mutation were not performed.

## Privacy basis and post-review correction

The notice identifies the operator, form fields, purpose, reasonable retention basis, Taiwan/cross-border territory, Vercel and Resend recipients, required-field consequence, security limits, and data-subject request route. It exposes no private destination address or provider credential.

After the parent review, the maintainer's direct official-law check found that the rights sentence omitted supplementation and narrowed cessation to use. A focused test first failed against the reviewed wording. The final bilingual sentence now includes inquiry/review, copy, supplement/correction, cessation of collection/processing/use, and deletion. Gemini's r2 delta review confirmed the corrected mapping with no BLOCKER, MAJOR, or MINOR.

## Validation

- Focused Privacy/agent-discovery test: 1/1.
- Full `npm test`: 181/181.
- Fresh build: pass.
- Design-contract audit: pass; 6 Featured / 5 Archive / 2 global Press / 3 work Press unchanged.
- Featured mobile derivatives: 6/6.
- Production dependency audit: zero vulnerabilities.
- `git diff --check`: pass.
- Static-output scan: no mail environment names, email address, private filesystem path, or protected filename in Privacy pages, sitemap, or `llms.txt`.
- English desktop 1440×900 and Chinese mobile 390×844 Chromium QA: HTTP 200, expected title/H1/canonical/hreflang/provider links, no overflow, console/page error, failed request, or POST; focus and reduced-motion checks pass. Final screenshots were visually inspected.
- Protected user-owned file remains untracked and byte-identical at SHA-256 `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.

## Independent review

- Parent packet SHA-256: `c1eafc62833c066aec99cf3afb15acc2496f774a41c870c5aa7b859cf1db186b`.
- Gemini parent review requested / observed / completed `gemini-3.7-flash`, with no BLOCKER, MAJOR, or MINOR.
- R2 delta packet SHA-256: `105bd7b8ec7b29acb97d9bb8e370779e3bf489ba042a837c6ace4ba072a78de4`.
- Gemini r2 requested / observed / completed `gemini-3.7-flash`, with no BLOCKER, MAJOR, or MINOR; final static-Preview readiness preserved.
- Claude requested dynamic `opus`, but observed/completed stayed null. Attempt `73399628-2126-4e26-a061-0779f8e37660` ended `claude-process-failed` after 382,584 ms with ambiguous dispatch. It was not retried, downgraded, or replaced, so no dual-review consensus is claimed.

## Search status

The existing public `/en/` and `/zh/` remain unchanged in this Preview-only package. Earlier Search Console evidence already had the English URL indexed, the Chinese URL accepted into the priority crawl queue, and the sitemap accepted. Current public `site:` and name-oriented searches still do not surface the portfolio. Google documents that sitemap and recrawl submissions are hints and that repeated requests do not accelerate crawling, so this package sent no duplicate request. The two Privacy URLs can only enter the public sitemap after a separately authorized Production release.

## Static Preview and access

- Deployment: `dpl_C37Hjv1zWnhWT4vCKENpKUaC5hfu`.
- State: `Ready`, target `preview`, one static root build (`.`), no functions.
- Direct protected identity: `https://hsin-hsin-yuan-portfolio-lzhm9gf3s.vercel.app`.
- Local public package: 61 files / 96,794,779 bytes / sorted path-list SHA-256 `34018a3c0dfabe74f98e8cfe57d6c7c9e05a3fc11039bfce79e84125261d35b6`.
- Vercel's file tree contains the same 61 files and no forbidden file. Three iCloud-resurrected empty directories (`assets 2`, `en 2`, `zh 2`) are present as directory records only; they contain no file, do not create a function or route payload, and carry no private data.
- Vercel linking temporarily created `.env.local`; it was never read and was removed from staging before deployment. `.vercel` project metadata was not uploaded as a public file.
- The authenticated official API created a `shareable-link` bypass for this exact deployment. Under the Hobby one-link limit it replaces the prior sole Shareable Link. The access-bearing URL remains outside Git and is recorded only by SHA-256 `30a77076ad6854041408bfa532e56d9e376332d52c7d4ce533d9f11aa1fbc9fa`; it was not fetched or sent to PageSpeed.

## Verdict and next decision

`PASS_WITH_OPEN_ITEMS` only for producer inspection of the Shareable Preview. A Production release would need one new consolidated authorization envelope covering the package commit/push, Production deployment, and subsequent sitemap/Search Console readback or request. No additional SEO, analytics, design, Contact, or performance work is implied.
