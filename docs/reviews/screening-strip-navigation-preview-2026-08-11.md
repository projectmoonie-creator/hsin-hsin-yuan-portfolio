# Screening Strip Navigation — Preview Release

Date: 2026-08-11

State: `READY_PREVIEW`

## Authorization And Source

The producer explicitly authorized a Preview after reviewing the local
Screening Strip navigation handoff. The deployed website source is commit
`66a40cd56c926442ebf2f1bb72697485439890e4` on
`codex/screening-strip-navigation`; formal Production/`origin/main` remains
`eb444a6dade9a721d97adf239468bf22d3360bf8`.

The authorization covered one Preview only. It did not include Production,
alias or share-link changes, Contact submission, a branch push, `main`
integration, tag movement, or deployment deletion. None of those actions
occurred.

## Package Evidence

- A fresh `npm run build` passed immediately before packaging.
- The isolated dist-only package contained exactly 61 public files and
  96,933,972 bytes, including the minimal static Vercel configuration. Its
  sorted relative path-list SHA-256 is
  `267394ea78521b69969304608b7c4d6a69e3386ce716679f085bc9be7dd678b0`.
- Repo source, tests, internal documents, package manifests, environment files,
  `api/contact.js`, and the protected user-owned document were absent.
- The package scan found no local absolute user path, protected filename/hash,
  or private environment file. English and Chinese built pages each contain
  the internal `href="#tech-dreamers"`; the large Tech Dreamers card retains
  its two intended TaiwanPlus links.
- Vercel linking created a temporary `.env.local` and `.gitignore`; both were
  removed from the isolated staging directory before the final manifest check
  and deployment. Only `.vercel/project.json` remained as local CLI link
  metadata and was not part of the 61-file deployment package.

## Preview Evidence

- Vercel CLI 58.9.0 linked the staging directory to the existing
  `projectmoonie-creators-projects/hsin-hsin-yuan-portfolio` project.
- Deployment `dpl_3zjGjz9fkpNnXiJjyBQ3MVJTq9iZ` is independently read back as
  `Ready`, target `preview`, at
  `https://hsin-hsin-yuan-portfolio-6rwcoi6j9.vercel.app`.
- Vercel retrieved 61 deployment files. Inspection reports a static root build
  (`.`) and no functions; the dist-only package contains no Contact endpoint.
- Per the active deployment policy, the deployed URL was not fetched or curled.
  Online interaction remains awaiting the producer's manual inspection, and no
  Contact request was sent.

## Exact Next Action

The producer opens the Preview and confirms that selecting the Tech Dreamers
small Screening Strip card moves to its large Featured card without opening a
new site, while the large card's media action and Official page still open
TaiwanPlus. Any access/share-link change, Production release, alias change,
Contact action, push, or integration requires a separate explicit decision.

The protected untracked document remains outside Git and is rechecked at
closeout against SHA-256
`945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.
