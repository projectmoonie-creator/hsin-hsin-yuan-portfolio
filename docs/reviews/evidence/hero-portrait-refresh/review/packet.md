# Read-only review packet — Hero portrait refresh

## Objective

Review a low-risk, user-visible replacement of the canonical homepage Hero
portrait. The producer selected candidate F and explicitly approved using it.
The implementation must preserve the existing Hero composition, bilingual
copy/alt, focal points, 18-second transform-only slow push, reduced-motion
fallback, priority behavior, and shared website/Figma data path.

## Target

- Repository: `hsin-hsin-yuan-portfolio-remove-lights`
- Branch: `codex/hero-portrait-refresh`
- Base: `7d76b891240d2a0850b14d4159052ef5bbca3273` (`origin/main` at package start)
- Worktree intentionally contains one protected untracked review document;
  it is outside this packet and must not be read, staged, changed, or cited.

## Change summary

- `data/site.json.heroMedia` remains the sole authored Hero record.
- The stable public source path is unchanged, while the approved source JPEG
  changes from 1920×1440 to 1448×1086 and SHA-256
  `d775b50dfe3efb9e675e923600043f69b8fab547bf2b2acd1c852f7c029ea7ee`.
- Existing bilingual alt, wide/stacked/mobile focal points, motion name,
  encoder qualities, markup, CSS, and JavaScript are unchanged.
- Mobile delivery remains 640/960. Desktop delivery becomes 960/1440 and
  preloads 1440 instead of upscaling the 1448-wide source to 1920.
- `npm run hero:prepare` regenerated and verified nine AVIF/WebP/JPEG files
  plus their source/recipe/hash/byte manifest. Three obsolete 1920 files are
  removed.
- Website and Figma export continue consuming the same canonical source.
  Figma geometry remains exactly the prior 4:3 crop; only embedded image bytes
  change in the desktop and mobile Hero SVG layers.

## Relevant files

- `data/site.json`
- `data/generated/hero-delivery-manifest.json`
- `public/assets/portfolio/hsin-working-white-space.jpg`
- `public/assets/portfolio/hero/hsin-working-white-space-*`
- `figma-export/01-desktop-home.svg`
- `figma-export/03-mobile-home.svg`
- `tests/hero-image-delivery.test.mjs`
- `tests/build-site.test.mjs`
- `tests/figma-export.test.mjs`
- Existing unchanged pipeline: `scripts/prepare-hero-images.mjs`,
  `scripts/lib/hero-image-delivery.mjs`, `scripts/build-site.mjs`, and
  `scripts/build-figma-export.mjs`.

## TDD and validation evidence

- RED: focused Hero/build tests failed on the old SHA, 1920 dimensions,
  1920 candidate/preload, and 12-derivative manifest.
- GREEN: focused Hero/build/Figma tests passed 54/54.
- Full `npm test`: 177/177 passed.
- `npm run build`: passed.
- `npm run audit:design-contract`: passed, no active drift.
- `npm run figma:export`: passed; only the two intended Hero SVG image payloads
  changed, with unchanged source label and geometry.
- `npm run featured-reels:check`: six derivatives passed, confirming unrelated
  video delivery remains intact.
- `git diff --check`: passed.
- Local Chromium: 6/6 English/Chinese desktop, tablet, mobile, narrow mobile,
  reduced-motion, and no-JavaScript cases passed. Observed responsive AVIF,
  `fetchpriority=high`, high-priority media preloads, no background image,
  transform-only slow push, static reduced motion, zero horizontal overflow,
  zero browser errors/local failures, and zero Contact POST.
- Source JPEG is metadata-safe. Its one-time high-quality preparation from the
  producer-selected image measured PSNR 50.67 dB and SSIM 0.9925.
- Protected document SHA-256 before and after implementation remains
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.

## Non-goals and boundaries

- No copy, alt, focal point, layout, CSS, motion timing, Contact, Featured,
  Archive, third-party media, lighting, or button change.
- No Preview, Production, alias, Git push, `main` merge, or Contact submission.
- Aesthetic identity selection is the producer's decision; review technical
  coherence, regression risk, privacy/rights handling, and evidence quality.

## Requested output

Return `PASS` or `NEEDS_REVISION`. List only actionable findings as P0, P1, or
P2, each with current file-and-line evidence and the minimum remediation.
Check specifically: single-source Hero data, non-upscaled responsive delivery,
initial-HTML priority/LCP preservation, Figma parity, test adequacy, unintended
scope, and privacy/rights leakage. This is a read-only review: do not edit files
and do not propose a redesign.
