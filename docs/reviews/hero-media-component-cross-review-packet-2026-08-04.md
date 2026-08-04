# HeroMedia Component And Showreel Retirement — Frozen Review Packet

Date: 2026-08-04

Repository: Hsin-Hsin Yuan portfolio

Branch: `codex/hero-media-component`

Review base: `5539c43373ac6d024d51b8f27c8aa8e1577991b3`

## Reviewer instructions

Perform a read-only implementation review. Do not edit files and do not infer
facts that are not in this packet. Focus on correctness, regressions,
accessibility, privacy, maintainability, and whether the tests prove the stated
contract. Do not request or reproduce EXIF/GPS/device/creator values.

Return exactly:

1. `VERDICT: PASS | PASS_WITH_FINDINGS | BLOCK`
2. A findings table with `ID`, `severity`, `file:line`, `evidence`, and
   `recommended bounded fix`; write `none` when there are no findings.
3. A short statement of residual risk and evidence limits.

A blocker requires current file-and-line evidence or a reproducible failure.

## Objective and boundaries

- Remove the Hero Play control, inline showreel, bilingual showreel copy,
  playback JavaScript, active-only CSS, and public MP4/poster derivatives.
- Preserve the approved Hero photograph geometry and exact 18-second
  `heroStillPush` animation for normal motion; reduced motion stays static.
- Make `data/site.json.heroMedia` the validated source shared by website and
  authoritative `npm run figma:export` output.
- Publish a losslessly metadata-stripped 1920×1440 JPEG.
- Preserve the legacy Figma importer unchanged.
- No merge, Preview, Production, Contact submission, or `origin/main` change.
- A protected user-owned untracked review file remains excluded from Git.

## Changed implementation

`data/site.json.heroMedia` now contains one `site.hero` record with a normalized
local `/assets/portfolio/` source, bilingual alt, 1920×1440 dimensions, `wide`,
`stacked`, and `mobile` focal points, `motion: "slow-push"`, and evidence-only
`rightsStatus: "user-supplied-local-source"`. The normalizer rejects unknown or
missing fields, unsafe paths, empty alt, invalid dimensions/focal coordinates,
unsupported motion/rights, deep-freezes the result, and emits rights only under
the evidence contract.

The website component is:

```js
export function renderHeroMedia({ heroMedia, lang }) {
  const media = heroMedia.contract.public;
  const focal = media.focalPoint;
  const style = [
    `--hero-image: ${cssUrl(media.src)}`,
    `--hero-wide-x: ${focalPercent(focal.wide.x)}`,
    `--hero-wide-y: ${focalPercent(focal.wide.y)}`,
    `--hero-stacked-x: ${focalPercent(focal.stacked.x)}`,
    `--hero-stacked-y: ${focalPercent(focal.stacked.y)}`,
    `--hero-mobile-x: ${focalPercent(focal.mobile.x)}`,
    `--hero-mobile-y: ${focalPercent(focal.mobile.y)}`,
  ].join("; ");

  return `<div class="hero-media hero-media--${escapeHtml(media.motion)}" data-hero-media-id="${escapeHtml(media.id)}" data-hero-width="${media.dimensions.width}" data-hero-height="${media.dimensions.height}" data-hero-motion="${escapeHtml(media.motion)}" role="img" aria-label="${escapeHtml(media.alt[lang])}" style="${style}"></div>`;
}
```

The same normalized source drives the image preload. Generated HTML contains no
Hero button or video. `src/main.js` contains no Hero playback block, and the
Hero-only video/Play/`is-playing` CSS was removed. The retained motion contract
is:

```css
@media (prefers-reduced-motion: no-preference) {
  .hero-media--slow-push {
    animation: heroStillPush 18s ease-in-out infinite alternate;
  }
  @keyframes heroStillPush {
    from {
      background-position: center, var(--hero-wide-x) var(--hero-wide-y);
      background-size: cover, auto 140%;
    }
    to {
      background-position: center,
        calc(var(--hero-wide-x) + 4%) calc(var(--hero-wide-y) - 4%);
      background-size: cover, auto 148%;
    }
  }
}
@media (prefers-reduced-motion: reduce) {
  .hero-media--slow-push { animation: none; }
}
```

Figma uses this object-cover helper and clipped image geometry:

```js
export function objectCoverGeometry({
  sourceWidth, sourceHeight, frameX, frameY, frameWidth, frameHeight, focalPoint,
}) {
  const scale = Math.max(frameWidth / sourceWidth, frameHeight / sourceHeight);
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;
  return {
    x: Number((frameX - (width - frameWidth) * focalPoint.x).toFixed(4)),
    y: Number((frameY - (height - frameHeight) * focalPoint.y).toFixed(4)),
    width: Number(width.toFixed(4)),
    height: Number(height.toFixed(4)),
  };
}
```

Desktop consumes `focalPoint.wide`; mobile consumes `focalPoint.mobile`.
The image is clipped to the unchanged Hero frame and embeds the same local
canonical JPEG. `figma/hsin-portfolio-importer/` has no diff.

## JPEG sanitizer implementation

The dependency-free parser requires SOI/EOI, parses length-bearing JPEG
segments, handles fill bytes, stuffed scan bytes and restart markers, rejects
truncation or non-zero payload after EOI, and removes APP1 (`0xe1`), APP13
(`0xed`), and COM (`0xfe`) segments. It copies all other segment and entropy
bytes without re-encoding.

```js
const PRIVATE_METADATA_MARKERS = new Set([0xe1, 0xed, 0xfe]);

export function stripJpegMetadata(input) {
  return processJpeg(input, { stripPrivateMetadata: true }).bytes;
}

export function assertPublicJpegMetadataSafe(input) {
  const { privateMarkers } = processJpeg(input, { stripPrivateMetadata: false });
  if (privateMarkers.length) {
    throw new Error("Hero asset contains private JPEG metadata");
  }
}
```

The CLI accepts required `--input` and `--output` JPEG paths, reads the source
fully, sanitizes and validates it, writes an adjacent exclusive temporary file,
atomically renames that file over the output, and deletes the temporary file in
`finally`. It reports only the output path, removed byte count, and sanitized
SHA-256; it never prints metadata contents or the input path.

The public JPEG changed from SHA-256
`2f75817ba7e36fbca929e7abb7a9fb580389f530822c88754611f6a9f5b2eac6`
to `756c072edb8f760718d903b8bd5cfc9e53a343efec69bc2821b78e3043f67bac`.
Exactly 5,848 metadata bytes were removed. Before and after are 1920×1440,
orientation is absent, and ffmpeg decoded-frame MD5 is unchanged at
`374cfe5ba6ee18ea0a402016f8a160aa`.

The sanitizer unit fixture contains APP0, APP1 EXIF/GPS/device text, APP13
Photoshop/IPTC/creator text, COM text, DQT, SOS, stuffed entropy bytes, and EOI.
It proves that APP1/APP13/COM are removed while APP0, DQT, SOS, entropy data,
and EOI remain byte-identical; malformed non-JPEG input is rejected. A second
test validates the actual public JPEG has none of the private markers.

## Deterministic and browser evidence

- Focused contract/build/Figma/JPEG suites: 53/53 passed.
- Full `npm test`: 78/78 passed.
- Design-contract audit, site build, Figma export, and `git diff --check` pass.
- English and Chinese at 1440×900 and 390×844: no Play/video/focus target,
  localized `role="img"` accessible name, zero horizontal overflow, exact
  baseline Hero rectangles, and normal motion remains `heroStillPush`, 18s,
  ease-in-out, infinite, alternate.
- Reduced motion at 1200×900: animation name `none`, duration `0s`, no retired
  reel request, no console/page error.
- No-JS at 1200×900: readable body, Hero present, no Play/video or retired reel
  request, no console/page error.
- Figma baseline diff: only `01-desktop-home.svg` and `03-mobile-home.svg` change
  visually to the canonical Hero image/crop; `02-desktop-works-logos.svg` keeps
  exact SHA-256
  `8368e496d283f47a2fd73742f24dc46512275e251be6caf500c448a623a8a03f`.
  README adds maintenance notes only.
- Active-source residual search finds retired names only in negative regression
  tests and retained authoring evidence. Public/build reel derivatives are absent.

## Evidence limits

No metadata values were printed or included. Browser checks used the ignored
local `dist/` build and are not deployment evidence. The Figma check validates
the generated authoritative SVG package; it does not update or claim parity for
the retained legacy importer. The final behavior commit SHA and remote readback
do not exist yet and are therefore not claimed.
