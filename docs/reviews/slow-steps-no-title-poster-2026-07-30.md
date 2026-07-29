# Slow Steps No-Title Poster Review

Date: 2026-07-30

Outcome: `PASS`

## Scope

Replace the `Slow Steps` artwork with the user-provided no-title image while
keeping the site's canonical media path, Figma output, responsive composition,
and build behavior synchronized.

This package does not change production, create a Preview, alter other work
images, or implement the proposed public-link validation system.

## Reviewed Version

- Branch: `codex/contact-archive-entrypoints`
- Immediate parent:
  `ed40089bc1f3ac22b1151401b8bc486c24973740`
- Reviewed implementation commit:
  `9bc45bc601b07d159457c49aae205a83e8a5d62f`

## Media Decision

- Source: user-provided Google Drive image approved for this portfolio use.
- Source format: PNG, 3840x2160.
- Source SHA-256:
  `3a6f37deee03aab1836fecaee547685f8b79a23106e5b540cac94094a193c78a`.
- Delivered format: WebP, 1920x1080, 162,060 bytes.
- Delivered SHA-256:
  `f733046cd1de822ecee43de08461c34e8990f1644c4f449a9d2268da5656da3d`.
- Canonical path remains:
  `/assets/portfolio/slow-steps-poster.webp`.
- The original downloaded PNG remains outside the repository.

The Featured Work image is intentionally unlabeled because the work title is
already adjacent in the copy column on desktop and directly below the image on
mobile. The screening-strip title remains because it is required to identify
the navigation card.

## Deterministic Evidence

- The canonical media metadata test failed first because the no-title variant,
  source hash, and user-approved-local status did not exist.
- The no-overlay render test failed first because the Featured Work image still
  emitted a `SLOW STEPS` label.
- The mobile visual check then exposed that an empty media frame collapsed to
  zero height. A dedicated unlabeled-frame class and 16:9 mobile rule were
  added after a failing markup assertion.
- `npm test`: 21 passed, 0 failed.
- `npm run build`: passed.
- `git diff --check`: passed.
- Generated desktop and mobile Figma SVGs were rebuilt from canonical content.

## Browser Evidence

Fresh local checks covered English desktop `1440x900` and mobile `390x844`,
with reduced motion enabled to freeze the screening strip for deterministic
capture.

Observed:

- the screening-strip card uses the new image and retains its navigation title;
- the desktop Featured Work image centers the rider and has no text overlay;
- the mobile Featured Work image holds a 16:9 frame and retains all three
  torn-paper portraits;
- the adjacent/below work title remains readable;
- no body-level horizontal overflow occurred;
- no browser console or page errors occurred.

Screenshots and the Playwright script are disposable `/private/tmp` QA
artifacts and are not portfolio assets.

## Deployment

No Preview or production deployment was created or promoted. Existing public
URLs remain unchanged.

## Exact Next Action

Approve the proposed `PUBLIC LINKS` rule before implementing the unified
watch/official/press/credit-proof contract.
