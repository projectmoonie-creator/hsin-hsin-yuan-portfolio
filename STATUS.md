# Portfolio Status

Updated: 2026-08-03

State: `PASS_WITH_OPEN_ITEMS`

## Current Work Package

- Package: `hsin-hsin-yuan-portfolio`
- Work package: `Archive Uniformity and English Copy v1`
- Outcome: `PASS_WITH_OPEN_ITEMS`
- Active branch: `codex/contact-archive-entrypoints`
- Closed baseline tag: `portfolio-phase-2026-07-29-closed`
- QA input commit: `47821ff6100a2484175dd3af8c8df45acfd66621`
- Deployment source reviewed commit:
  `6b63f5d086a1db4070105f9adc190154cb6f707c`
- Review:
  `docs/reviews/archive-uniformity-and-english-copy-v1-2026-08-03.md`
- Preview project:
  `projectmoonie-creators-projects/hsin-hsin-yuan-portfolio-preview`
- Preview URL:
  `https://hsin-hsin-yuan-portfolio-preview-ldm6qfz3d.vercel.app`
- Deployment ID: `dpl_4GW7xq4wuX5nf1v7VjtQ3JLAm3cW`
- Deployment target/status: `preview` / `Ready`
- Inspector:
  `https://vercel.com/projectmoonie-creators-projects/hsin-hsin-yuan-portfolio-preview/4GW7xq4wuX5nf1v7VjtQ3JLAm3cW`
- The original production website and domain were not changed. No `--prod`,
  alias, or domain promotion was used for the accepted Preview.

The deployed staging package contained exactly 22 files: the built public
pages, CSS, JavaScript, page-referenced public images and videos,
`api/contact.js`, and minimal package and Vercel configuration. It excluded
Git data, source scripts and content, tests, documentation and reviews,
original media, caches, unused assets, and the unused India group photograph.
Deployment used ephemeral Vercel CLI `58.4.4` under the existing
`projectmoonie-creator` account; it did not install a global CLI and produced
no claim URL.

Vercel unexpectedly assigned the first deployment in the new preview-named
project a production target even though the command omitted `--prod`. That
deployment (`dpl_Dd2eMsQ58YQUEMAijs4hHceZxggS`,
`hsin-hsin-yuan-portfolio-preview-ghlzgynyn.vercel.app`) was never accepted as
the deliverable and was permanently deleted after separate explicit user
approval; Vercel reported `Success! Removed 1 deployment`. The final listing
contains exactly one deployment in the project: the accepted URL above,
environment `Preview`, status `Ready`.

Verification:

- Local QA: `PASS` at input commit `47821ff6100a2484175dd3af8c8df45acfd66621`.
- `npm test`: 35 passed, 0 failed.
- `npm run build`: passed again at deployment source commit `6b63f5d...` before
  packaging.
- `npm run figma:export`: passed with no tracked output change during local QA.
- `git diff --check`: passed.
- English and Chinese responsive, reduced-motion, no-JavaScript, focus,
  overflow, archive-uniformity, contact-heading, and copy checks passed locally.
- `vercel inspect`: target `preview`, status `Ready`, created Mon Aug 03 2026
  06:12:41 GMT+0800; build includes `λ api/contact` (`2.56KB`) in `iad1`.
- Direct public URL, route, content, and API probing was not performed because
  the active `vercel-deploy` skill prohibits requesting the deployed URL. No
  form was submitted and no email was sent.

## Closed Baseline

- Reviewed implementation commit: `f4f4d0029c71a2f20f88fea5051a8726b0d0773d`
- Closed branch: `codex/work-card-video-links`
- Final closeout tag: `portfolio-phase-2026-07-29-closed`
- Annotated tag object:
  `68d99c13341f27ad388a8c9bc06df22b3d38bcf2`
- Peeled tag commit:
  `7e6200106fe9feb10331e6558981b0314de00597`
- Vercel Preview:
  `https://hsin-hsin-yuan-portfolio-rk6jdrkve.vercel.app/en/`
- The closeout did not replace the production deployment.
- The closeout redacted the direct Yahoo address and private absolute paths
  from the then-current public repository and replaced the burned-in address
  in the homepage showreel with the portfolio inquiry form.

The current branch preserves that baseline and the later screening-strip
contracts. Historical closeout descriptions record what was present at the
time of the tag; they do not override the current site structure.

## Accepted Open Items

One accepted item remains, and it is not a blocker to the completed local QA or
Ready deployment: optionally inspect Preview `/en/`, `/zh/`, and GET
`/api/contact` manually. Those public responses were not observed because the
active deployment skill prohibits the agent from requesting the deployed URL.
Do not submit the form or send email during that inspection.

Earlier future-work candidates remain documented in
`docs/reviews/archive-chronology-v1-2026-08-02.md`; they are not open items in
this deployment package.

## Residual Privacy Risk

The current branch, generated site, Figma importer, showreel source, and
replacement MP4 do not expose the direct Yahoo address or private absolute
paths. Earlier public Git commits and older Vercel Preview deployments may
still retain the previous address. Full erasure requires a separately approved
Git history rewrite and old-deployment cleanup; neither destructive action was
performed during this package.

## Exact Next Action

If desired, a human may open
`https://hsin-hsin-yuan-portfolio-preview-ldm6qfz3d.vercel.app/en/`, then
`/zh/`, and issue a non-submitting GET inspection of `/api/contact`. Record
only what is actually observed. Do not submit the contact form or send email,
and do not promote, alias, or replace production without separate explicit
approval.

## Cold Resume

1. Read `AGENTS.md`, `PROJECT_BIBLE.md`, and this file.
2. Verify the active branch, deployment source reviewed commit, remote tip,
   worktree state, final Preview metadata, and preserved closeout tag object
   and peeled commit.
3. Read
   `docs/reviews/archive-uniformity-and-english-copy-v1-2026-08-03.md` for the
   current package evidence. Read `docs/reviews/archive-chronology-v1-2026-08-02.md`
   for earlier future-work candidates. Read
   `docs/source-materials/collaboration-logo-wall.md` before resuming the logo
   package. Read `docs/reviews/english-featured-copy-closeout-2026-07-30.md`,
   `docs/reviews/gorgeous-space-localization-sunny-poster-2026-07-30.md`,
   `docs/reviews/slow-steps-no-title-poster-2026-07-30.md` and
   `docs/reviews/contact-archive-entrypoints-v1-2026-07-30.md` when the earlier
   poster or contact/archive rationale is needed.
4. Do not depend on old chat history or rewrite historical review files.
