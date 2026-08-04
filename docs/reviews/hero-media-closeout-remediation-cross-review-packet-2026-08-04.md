# HeroMedia Closeout Remediation — Frozen Review Packet

Date: 2026-08-04

Target branch: `codex/hero-media-closeout-remediation`

Base and rollback checkpoint:
`e2d75f0e57ff0d6f0d64ff5381a04a3314b35481`

Remote rollback ref: `backup/2026-08-04/e2d75f0`, read back at the exact base
commit before implementation.

## Reviewer Contract

This is a read-only review. Do not edit files, run deployment, contact anyone,
or infer access to the repository beyond this packet. Review only the bounded
remediation described here. Do not request or reproduce metadata payloads,
credentials, private paths, or the protected user-owned untracked document.

Return:

1. `VERDICT: PASS` or `VERDICT: CHANGES_REQUESTED`;
2. findings ordered by `P0`, `P1`, then `P2`, each with file/line evidence,
   consequence, and the smallest correction;
3. an explicit closure decision for each of the four original findings;
4. residual risks or `none`;
5. model provenance and token usage when available.

Do not report style preferences as findings. A blocker requires a concrete
counterexample against the supplied code or contract.

## Objective And Non-goals

Close four review findings without redesigning the approved Hero:

1. fail closed on unclassified JPEG APP metadata;
2. make current-reference Figma Hero frames match the live `slow-push` starting
   crop, not ordinary object-cover;
3. honor stacked/mobile focal points while animation keyframes run;
4. replace the stale A0 cold-resume action in `STATUS.md`.

Non-goals: no Hero image replacement, Play/showreel restoration, layout or copy
redesign, Featured/Archive media change, `origin/main` push, Preview,
Production, Contact action, or protected-file change.

## Original Findings

- P1 `scripts/lib/jpeg-metadata.mjs`: only APP1, APP13, and COM were classified;
  a valid APP12 passed the public safety assertion.
- P1 `scripts/build-figma-export.mjs`: Figma used ordinary object-cover while
  live motion begins with image height at 140% of the frame.
- P2 `src/styles.css`: animation keyframes always referenced wide focal
  variables, overriding narrow declarations during normal motion.
- P2 `STATUS.md`: the final resume section still instructed a future session to
  review A0 and decide whether to merge that old branch.

## Implemented Contract

### 1. JPEG APP classification

`scripts/lib/jpeg-metadata.mjs` now treats every APP0–APP15 marker and COM as
private unless the segment is the first fully structured APP0/JFIF segment.
The retained segment must have:

- exact `JFIF\0` identifier;
- version major 1 and minor 0–2;
- density unit 0–2 and positive X/Y densities;
- an exact payload length of `14 + 3 * thumbnailWidth * thumbnailHeight`.

The relevant classification is:

```js
function isApplicationMarker(marker) {
  return marker >= 0xe0 && marker <= 0xef;
}

function isJfifApp0(bytes, marker, payloadStart, segmentEnd, sawJfifApp0) {
  if (marker !== 0xe0) return false;
  if (sawJfifApp0 || segmentEnd - payloadStart < 14) return false;
  if (bytes[payloadStart] !== 0x4a
    || bytes[payloadStart + 1] !== 0x46
    || bytes[payloadStart + 2] !== 0x49
    || bytes[payloadStart + 3] !== 0x46
    || bytes[payloadStart + 4] !== 0x00) return false;

  const versionMajor = bytes[payloadStart + 5];
  const versionMinor = bytes[payloadStart + 6];
  const densityUnits = bytes[payloadStart + 7];
  const xDensity = bytes.readUInt16BE(payloadStart + 8);
  const yDensity = bytes.readUInt16BE(payloadStart + 10);
  const thumbnailWidth = bytes[payloadStart + 12];
  const thumbnailHeight = bytes[payloadStart + 13];
  const expectedPayloadLength = 14 + (3 * thumbnailWidth * thumbnailHeight);

  return versionMajor === 1
    && versionMinor <= 2
    && densityUnits <= 2
    && xDensity > 0
    && yDensity > 0
    && segmentEnd - payloadStart === expectedPayloadLength;
}

const approvedJfif = isJfifApp0(
  bytes, marker, payloadStart, segmentEnd, sawJfifApp0,
);
if (approvedJfif) sawJfifApp0 = true;
const isPrivate = marker === 0xfe
  || (isApplicationMarker(marker) && !approvedJfif);
```

`stripJpegMetadata` omits private segments; `assertPublicJpegMetadataSafe`
throws when any are present. Regression fixtures cover a custom APP0, APP12,
APP1, APP13, COM, and a `JFIF\0`-prefixed APP0 with an illegal trailing payload.
The public Hero still passes and its bytes were not rewritten in this package.

### 2. One named motion profile for website and Figma

`scripts/lib/portfolio-contract.mjs` derives and freezes:

```js
export const HERO_MEDIA_MOTION_PROFILES = Object.freeze({
  "slow-push": Object.freeze({ startScale: 1.4, endScale: 1.48 }),
});
```

The normalized public Hero contract includes a copied, deeply frozen
`motionProfile`. If an already-normalized public contract is reused as input,
an optional supplied profile must exactly match the named motion or validation
throws. `data/site.json` continues to author only `motion: "slow-push"`, so
there is no second editable scale source.

`scripts/build-site.mjs` emits the derived scales as
`--hero-motion-start-scale: 140%` and `--hero-motion-end-scale: 148%`.

`scripts/build-figma-export.mjs` now computes:

```js
const scale = Math.max(
  frameWidth / sourceWidth,
  (frameHeight * heightScale) / sourceHeight,
);
```

Only the Hero calls pass `heroMedia.motionProfile.startScale`; the helper keeps
`heightScale = 1` as its ordinary-image default. With the current 1920×1440
source and declared focal points, generated clipped-image geometry is:

- desktop frame 610×520: image `x=-65.0533`, `y=-58.24`,
  `width=970.6667`, `height=728`;
- mobile frame 342×252: image `x=-24.792`, `y=-2.624`, `width=470.4`,
  `height=352.8`.

These values implement CSS background-position percentage semantics:
`frameOrigin - (scaledImage - frame) * focalPoint`.

### 3. Responsive focal selection during motion

`src/styles.css` maps active focal variables at the existing breakpoints:

```css
.hero-media {
  --hero-active-x: var(--hero-wide-x);
  --hero-active-y: var(--hero-wide-y);
}

@media (max-width: 1280px) {
  .hero-media {
    --hero-active-x: var(--hero-stacked-x);
    --hero-active-y: var(--hero-stacked-y);
  }
}

@media (max-width: 820px) {
  .hero-media {
    --hero-active-x: var(--hero-mobile-x);
    --hero-active-y: var(--hero-mobile-y);
  }
}

@keyframes heroStillPush {
  from {
    background-position: center,
      var(--hero-active-x) var(--hero-active-y);
    background-size: cover, auto var(--hero-motion-start-scale);
  }
  to {
    background-position: center,
      calc(var(--hero-active-x) + 4%) calc(var(--hero-active-y) - 4%);
    background-size: cover, auto var(--hero-motion-end-scale);
  }
}
```

The existing 18-second animation, aspect ratios, gradients, radius, and
reduced-motion behavior are unchanged.

### 4. Cold resume

`STATUS.md` now names this remediation branch and the verified backup ref. Its
exact next action is: complete validation/review, push this feature branch with
remote readback, then ask whether to create a feature Preview or merge into
local `main`. It explicitly keeps Production separate and forbids implicit
merge, `main` push, Contact, or Production.

## TDD And Validation Evidence

- Baseline before test edits: focused suites `53/53` pass.
- First RED after four regression groups: `47/54` pass, `7/54` fail only at
  the intended four findings.
- First GREEN: focused suites `54/54` pass.
- Additional APP0 structural-tail RED: `3/4` pass, one intended failure.
- Structural APP0 GREEN: `4/4` pass.
- Full suite after remediation: `79/79` pass.
- Design-contract audit: pass; `6 Featured / 5 Archive / 2 global Press /
  3 work Press`; no active drift.
- `npm run build`: pass.
- `npm run figma:export`: pass; desktop/mobile generated Hero SVG geometry
  updated to the exact values above.
- `git diff --check`: pass.
- Public Hero SHA-256 unchanged:
  `756c072edb8f760718d903b8bd5cfc9e53a343efec69bc2821b78e3043f67bac`.
- Protected untracked file SHA-256 unchanged:
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.
- No private absolute path appears in the tracked diff.
- No `origin/main` push, Preview, Production, alias, Contact, or protected-file
  mutation occurred.

## Review Questions

1. Does the JPEG policy fail closed for all APP/COM segments while retaining
   only a structurally complete first JFIF APP0?
2. Can a malformed length, duplicate APP0, APP12, or JFIF-prefixed tail still
   pass the safety assertion?
3. Is the Figma geometry mathematically equivalent to the live 140% starting
   crop under CSS background-position percentage semantics?
4. Does the named motion profile avoid a parallel maintenance source and reject
   conflicting reused input?
5. Can CSS cascade or animation rules still cause stacked/mobile layouts to use
   wide focal values during motion?
6. Is the cold-resume action current, bounded, and explicit about external-state
   prohibitions?
