# HeroMedia Component And Showreel Retirement v1 — Closeout

Date: 2026-08-04

Branch: `codex/hero-media-component`

Package base: `fb6517591e34b9cb20d814891c0177cf2ac9ba2c`

Parity extraction commit: `5539c43373ac6d024d51b8f27c8aa8e1577991b3`

## Outcome

`PASS_WITH_OPEN_ITEMS`. The approved Hero photograph remains the same gently
moving image, but it is now one replaceable validated record shared by the
website and current Figma export. Hero Play, inline showreel, related copy,
runtime logic, styles, and public MP4/poster derivatives are retired. The
public JPEG is metadata-safe without a visible or decoded-pixel change.

The implementation and one independent review lane are complete. Gemini
returned `PASS` with no findings. Claude remains `incomplete` at
`handoff-to-active-session`; no model request or billing fallback was used, so
this report does not claim dual-review consensus.

## Canonical maintenance contract

- `data/site.json.heroMedia` owns the local asset path, bilingual alt,
  intrinsic dimensions, `wide`/`stacked`/`mobile` focal points, named motion,
  and evidence-only rights status.
- `normalizeHeroMedia` rejects unknown, missing, unsafe, out-of-range, or
  unsupported data and keeps rights evidence out of public HTML.
- Website preload/markup and `npm run figma:export` consume the same normalized
  record. The hardcoded legacy importer under `figma/hsin-portfolio-importer/`
  is unchanged and remains non-authoritative.
- A future JPEG replacement uses
  `npm run hero:sanitize -- --input SOURCE_JPEG --output public/assets/portfolio/OUTPUT.jpg`,
  followed by asset/alt/dimension/focal updates and the website/Figma suites.

## Media privacy evidence

- Original public JPEG SHA-256:
  `2f75817ba7e36fbca929e7abb7a9fb580389f530822c88754611f6a9f5b2eac6`.
- Sanitized public JPEG SHA-256:
  `756c072edb8f760718d903b8bd5cfc9e53a343efec69bc2821b78e3043f67bac`.
- Dependency-free segment sanitization removed 5,848 bytes from APP1, APP13,
  and COM metadata without re-encoding image data.
- Before and after are 1920×1440 with absent orientation. Decoded-frame MD5 is
  unchanged at `374cfe5ba6ee18ea0a402016f8a160aa`.
- No EXIF, GPS, device, creator, comment, or location values were printed,
  retained in this report, or sent to an external reviewer.

## Validation

- Focused contract/build/Figma/JPEG suites: 53/53 passed.
- Full `npm test`: 78/78 passed.
- `npm run audit:design-contract`, `npm run build`,
  `npm run figma:export`, and `git diff --check`: passed.
- English and Chinese at 1440×900 and 390×844: Hero rectangles match the
  recorded baseline exactly; localized `role="img"` names are present; Play,
  video, focus target, and horizontal overflow are absent. Normal motion is
  still `heroStillPush 18s ease-in-out infinite alternate`.
- At 1200×900 reduced motion reports `animation-name: none` and `0s`. The no-JS
  page retains its readable body and Hero. Neither case requests the retired
  website reel or reports console/page errors.
- Figma desktop/mobile home SVGs intentionally change only the Hero image and
  focal crop. `02-desktop-works-logos.svg` is byte-identical to baseline at
  SHA-256 `8368e496d283f47a2fd73742f24dc46512275e251be6caf500c448a623a8a03f`;
  README changes are documentation only.
- Residual name searches classify all active-area hits as negative regression
  tests or retained authoring evidence. Public/build showreel derivatives are
  absent.

## Independent review and adjudication

Frozen packet SHA-256:
`fed9a94679092b2f5f0f0c13640d02574d21c186cbfd81591290c6330188e959`.

| Lane | Requested | Observed / completed | Result |
| --- | --- | --- | --- |
| Gemini | highest eligible generally released model | `gemini-3.6-flash` | usable `PASS`; no findings; 2,447 input / 174 output / 4,687 total tokens |
| Claude | highest generally released model at active-session submission | not observed / incomplete | `handoff-to-active-session`; no request sent and no billing fallback |
| Codex maintainer | current root runtime | exact ID not exposed | local source, test, media, browser, and provider-output adjudication complete |

Artifacts:

- `docs/reviews/hero-media-component-cross-review-packet-2026-08-04.md`;
- `docs/reviews/hero-media-component-gemini-review-2026-08-04.md` and its
  machine-readable `.status.json`;
- Claude handoff status is summarized here without committing machine-local
  absolute paths; its raw status remains outside Git.

Gemini reported no findings, so no reviewer-driven code change was applied.
Its residual risk is limited to deployment/CDN behavior, which is explicitly
outside this local package and requires separate producer authorization.

## Rollback and external state

- Revert the behavior commit reported externally after commit to restore the
  old Play/showreel while keeping the canonical HeroMedia extraction.
- Revert `5539c43` to return to the pre-component package base.
- `origin/main`, merge state, Vercel Preview, aliases, Contact, and Production
  remain untouched.
- The protected untracked review file retains SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`
  and remains outside Git.
