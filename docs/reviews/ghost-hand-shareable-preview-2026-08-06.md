# Ghost Hand Shareable Preview Record

Date: 2026-08-06

State: `READY_PREVIEW`

## Adopted Preview

- Producer authorization: create a Vercel Preview only.
- Source commit:
  `b7d3fe142b3c82fbcaeb384adc7209fc3089ab75` on local `main`.
- Public package: a fresh `npm run build` output from that commit.
- Vercel dry-run: `42` files, `80,016,741` bytes, framework `Other`, zero
  ignored files.
- Deployment ID: `dpl_Gy96AtLGzKzLyAwQEzVhwbtUw7Rz`.
- Preview URL:
  `https://hsin-hsin-yuan-portfolio-ku5d9znnk.vercel.app`.
- Metadata readback: target `preview`, state `READY`, output directory `dist`,
  and no serverless-function output.
- Deployment command recorded the exact source commit plus package class
  `dist-only` in custom deployment metadata.

The uploaded package contains only generated public HTML, CSS, JavaScript,
images, logos, and showreel media. It excludes repository source, internal
review documents, environment files, `api/contact.js`, and the protected
user-owned untracked review document. Contact delivery is therefore
intentionally unavailable in this Preview.

## Validation And Boundaries

- Before deployment, `npm test` passed `111/111` and `npm run build` passed.
- The tracked-path privacy gate initially found three absolute paths in the new
  Claude handoff status. Commit `b7d3fe1` replaced them with repo-relative
  paths and tightened the test to require a complete user-directory path; the
  focused test and full suite then passed.
- Frozen review packet SHA-256 remains
  `c075e4f486b66d272ac00b88ceba253faf6193a404dcfd0d536ca4d98ef4293f`.
- Protected-file SHA-256 remains
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.
- `origin/main` remains
  `03ad08ac4dd3a47d300cab99f2dd569353e13ec9`.
- No Production deployment, Production promotion, alias change, Contact
  submission, or `origin/main` push occurred.

The Vercel deployment skill prohibits fetching the new public URL as a
post-deploy check. Verification is therefore the CLI deployment result plus
the independent Vercel metadata readback; both report `READY` and `preview`.

## Non-Adopted Deployment Attempts

- The unauthenticated deployment helper completed packaging but exited during
  upload without returning an attributable deployment ID or URL.
- Pushing the durability backup branch caused a separate Git-integrated
  Preview to appear. It was not selected because its build included the
  repository's Contact function rather than the audited static-only package.
- An initial explicit static Preview completed successfully, but its custom
  full-SHA metadata was not exact. It was not selected. The adopted Preview
  above was forced from the same 42-file package with the exact commit read
  directly from Git.

## Next Action

Share the adopted Preview for Chinese-copy feedback. Consolidate that feedback
into the separate Chinese-copy and named bilingual-layout package. Lighting
remains a later visual package after bilingual geometry approval.
