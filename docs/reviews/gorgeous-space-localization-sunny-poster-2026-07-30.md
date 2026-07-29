# Gorgeous Space Localization + Sunny Wang Poster Review

Date: 2026-07-30

Verdict: `PASS`

## Reviewed Baseline

- Branch: `codex/contact-archive-entrypoints`
- Immediate parent: `5ff4470fbe222a3a724fd15617ebeb69cf50090d`
- Reviewed implementation commit:
  `213dc8a0e6d3f2e05c100fecdeaff45b42a85965`
- Closed baseline tag: `portfolio-phase-2026-07-29-closed`

## Scope

- Localize the Gorgeous Space publisher and collaboration labels at the data
  source.
- Remove visible `幸福空間` labels from the English site and English Figma
  handoff while preserving the official Chinese name on the Chinese site.
- Replace the old side-profile two-person still with a larger, frontal Sunny
  Wang frame from the same confirmed public work.
- Keep deployment, playlist curation, archive expansion, and the proposed
  `PUBLIC LINKS` rule out of scope.

## Media Decision

- Canonical public source:
  `https://www.youtube.com/watch?v=me4KutyUoT4&t=28s`
- Source timecode: `00:00:28`
- Delivered asset:
  `/assets/portfolio/gorgeous-space-sunny-wang-frontal.webp`
- Output: 1280x720 WebP.
- Treatment: editorial crop and resize only. Sunny Wang is larger and placed
  on the right, leaving the left side available for screening-strip copy. The
  crop excludes the subtitle and publisher watermark; neither was retouched.
- Rights status: `public-source-user-confirmed-work`.
- SHA-256:
  `db41763c6846b186a0bfcc5e9b45d4765917fed99a48c038d61693135d78a666`.

The previous poster remains in the repository as a rollback asset but is no
longer referenced by active site content.

## Verification

- `npm test`: 23 passed, 0 failed.
- `npm run build`: passed.
- `npm run figma:export`: passed.
- `git diff --check`: passed before the implementation commit.
- English generated HTML, English Figma SVG exports, and the Figma importer
  contain no `幸福空間`.
- Chinese generated HTML retains the official `幸福空間` label and Chinese work
  title.
- Headless Chromium checks passed at desktop 1440x1100 and mobile 390x844.
- Both viewports loaded the new poster, kept the subject legible in the
  screening strip, and rendered the Featured Work panel without console
  errors.
- Disposable screenshots and browser QA scripts remain outside the repository.

External AI review was skipped because this was a bounded localization and
media-crop package with deterministic regression coverage and direct visual
inspection; it did not introduce a new information architecture or major
mechanism.

## Deployment

- No Vercel Preview or production deployment was created or replaced.
- No Git history rewrite or old-deployment deletion was performed.

## Accepted Open Items

- Curate or replace the Gorgeous Space playlist as the public source list
  becomes more complete.
- Decide and implement the proposed `PUBLIC LINKS` evidence pattern as a
  separate package.
- Create a Preview or promote production only after an explicit deployment
  decision.

## Rollback

Revert implementation commit `213dc8a` to restore the prior labels and poster,
or point `posterImage` and `featuredReelPoster` back to
`/assets/portfolio/gorgeous-space-lg-sunny-wang.webp`.

