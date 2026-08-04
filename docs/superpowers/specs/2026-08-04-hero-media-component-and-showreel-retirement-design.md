# HeroMedia Component And Showreel Retirement Design

Date: 2026-08-04

Status: producer-approved; implemented and locally validated on the feature branch

Work package branch: `codex/hero-media-component`

Base / rollback checkpoint: `fb6517591e34b9cb20d814891c0177cf2ac9ba2c`

## Goal

Remove the Hero Play interaction and active website showreel while preserving
the current gently moving Hero photograph. Extract the photograph into one
validated `HeroMedia` contract consumed by the live website and the current
Figma export so a future replacement is asset-plus-data work rather than
renderer, CSS, JavaScript, and design-export surgery.

This package also removes private EXIF/GPS/device metadata from the public Hero
JPEG without changing its visible pixels or dimensions. It does not redesign
the Hero, add a new call to action, create a new reel, introduce a CMS, or
change any Featured/Archive reel.

## Current Approved Behavior

The current Hero uses
`/assets/portfolio/hsin-working-white-space.jpg`, a 1920×1440 JPEG. CSS applies
the named `heroStillPush` animation for users who do not request reduced
motion: an 18-second alternating slow push from the present starting crop to a
slightly tighter crop. Reduced motion leaves the photograph static.

The image path is currently duplicated in the stylesheet and HTML preload.
The Play path is spread across bilingual site copy, generated video/button
markup, JavaScript playback state, CSS `is-playing` rules, public MP4/poster
assets, and tests. The current-reference Figma export does not use the actual
Hero photograph; it borrows the first Featured poster. The hardcoded Figma
importer also contains old Hero paths, but the current design contract already
classifies that importer as a retained legacy experiment rather than an active
consumer.

## Canonical HeroMedia Contract

Add one language-independent top-level `heroMedia` record to `data/site.json`:

```json
{
  "heroMedia": {
    "id": "site.hero",
    "src": "/assets/portfolio/hsin-working-white-space.jpg",
    "alt": {
      "en": "Hsin-Hsin Yuan working on a laptop in a bright white studio",
      "zh": "袁欣欣在明亮的白色工作空間使用筆記型電腦"
    },
    "dimensions": {"width": 1920, "height": 1440},
    "focalPoint": {
      "wide": {"x": 0.38, "y": 0.78},
      "stacked": {"x": 0.38, "y": 0.77},
      "mobile": {"x": 0.38, "y": 0.78}
    },
    "motion": "slow-push",
    "rightsStatus": "user-supplied-local-source"
  }
}
```

Field classification:

- required rendered: `id`, `src`, localized `alt`, intrinsic `dimensions`,
  named `focalPoint` values, and `motion`;
- mandatory evidence-only: `rightsStatus`;
- retired after compatibility: bilingual `showreelTitle` and `showreelCta`.

Add `normalizeHeroMedia` to the existing dependency-free portfolio contract
module. It must reject:

- unknown or missing top-level/nested fields;
- an ID other than `site.hero`;
- sources outside normalized local `/assets/portfolio/` paths;
- empty English or Chinese alt text;
- non-positive integer width/height;
- missing, non-finite, or out-of-range focal coordinates;
- motion values other than the named `slow-push` variant;
- unsupported or empty rights status.

The normalized public contract includes the rendered fields plus a derived,
frozen `motionProfile`. `slow-push` resolves to `startScale: 1.4` and
`endScale: 1.48`; callers do not maintain a second free-form scale map. The
contract does not emit rights evidence into public HTML.

## Website Consumer

The site loader exposes the normalized Hero contract to `renderPage`. The
generated preload and Hero media surface both consume its `src`; no active CSS
or renderer contains the literal filename.

To preserve the approved crop and motion exactly, retain the background-media
implementation for this package. Render the Hero as a non-interactive image
surface with a localized accessible name and data-driven CSS custom properties
for the source, three focal points, and derived motion scales. An active focal
pair maps to `wide`, `stacked`, or `mobile` at the same layout breakpoints, so
the animation keyframes never bypass the declared narrow crop. Apply a named
`hero-media--slow-push` class. The existing animation duration, scale range,
gradient, radius, aspect ratios, layout breakpoints, and focal positions remain
the baseline. Reduced motion continues to suppress the animation.

Do not add a scroll hint, CTA, caption, link, hover action, keyboard focus, or
new animation. Hero copy, roles, section order, and responsive composition
remain unchanged.

## Figma Export Consumer

The current `npm run figma:export` path consumes the same normalized
`heroMedia` record for English/Chinese desktop and mobile Hero frames. Replace
the existing first-Featured-poster substitution with the actual Hero source.

Extend the export image helper to compute a clipped rectangle from the
intrinsic dimensions, frame dimensions, applicable focal point, and the named
motion profile's `1.4` starting scale. Ordinary object-cover geometry is not
the live starting crop and is therefore not sufficient for a Hero frame.
Desktop uses `wide`; stacked/mobile reference frames use the declared narrow
focal value appropriate to their layout. The Figma Hero is a static view of the
live animation's starting crop; it does not attempt to simulate motion.

The Hero image is the only approved intentional Figma visual difference. All
copy, frame geometry, ordering, Featured variants, Archive, Press, and Contact
layers remain unchanged. The legacy importer is not modified or reactivated;
current documentation continues to identify it as non-authoritative.

## Retire The Active Showreel

After the behavior-preserving HeroMedia extraction is committed, remove:

- the generated Hero `<video>` and Play `<button>`;
- the entire Hero playback block in `src/main.js`;
- `is-playing`, video, Play-button, icon, hover, and focus-only CSS that exists
  solely for the retired interaction;
- English and Chinese `showreelTitle`/`showreelCta` fields;
- public website-showreel MP4/poster derivatives from the active public asset
  tree and generated build;
- positive tests requiring the video, CTA, controls, and playback source.

Add negative assertions so current generators cannot recreate a Hero Play
button, Hero video, showreel CTA, or website-showreel public derivative.

Keep `showreel/website-visual-reel/` as recoverable retired authoring evidence.
Mark it clearly as retired and non-generated so it cannot be mistaken for an
active build source. Git history remains the recovery path for deleted public
derivatives and active interaction code.

## Metadata Privacy Boundary

The current JPEG carries EXIF device metadata and a GPS metadata block. Do not
extract, print, commit, or reproduce location coordinates. Create a
metadata-free public derivative at the canonical Hero path while preserving
the exact 1920×1440 visible image and orientation. Do not modify the
user-supplied HEIC or another private source master.

Add a dependency-free regression check that the referenced public Hero bytes
contain no EXIF, GPS, XMP, IPTC, device, creator, comment, or location metadata
payload. The sanitizer fails closed on every APP0–APP15 segment except the
first structurally identified APP0/JFIF segment, and on every COM segment;
unclassified application metadata is never implicitly allowed. Record the
sanitized public derivative's exact SHA-256 after it is created.

Future replacements must start from an approved local asset, produce a public
metadata-free derivative, update the single HeroMedia record, and pass the
same privacy check.

## Extract-On-Touch Sequence

Commit 1 is a behavior-preserving extraction:

1. freeze current generated output, current-reference Figma output, matched
   Hero screenshots/geometry, reduced motion, and the protected untracked file;
2. add the HeroMedia contract, validation, site normalization, preload, and
   data-driven website styling;
3. retain Play/showreel temporarily;
4. prove the live Hero crop, motion, layout, and interaction remain equivalent.

Commit 2 applies the approved behavior change:

1. retire Play/showreel across active data, renderer, JavaScript, CSS, public
   assets, and tests;
2. route current Figma Hero frames through HeroMedia;
3. replace the public JPEG with its metadata-free visual equivalent;
4. document the three-step replacement workflow.

This temporary within-package sequencing is not a permanent compatibility
layer. The work package is complete only when both live site and current Figma
export consume HeroMedia and the retired showreel cannot be recreated by an
active consumer.

## TDD And Validation

Tests must first fail for the missing normalizer/data record and later for the
still-present showreel. Cover:

1. strict HeroMedia validation and evidence/public-field separation;
2. normalized local asset resolution and metadata privacy;
3. website propagation for source, localized alt, focal points, preload, and
   named motion;
4. Figma desktop/mobile propagation using the same source/focal record;
5. a mutation fixture changing only `heroMedia.src`, proving the new value
   reaches website and Figma output and the old value is absent;
6. negative absence of active Play/video/showreel copy/assets/JavaScript/CSS;
7. retained slow-push and reduced-motion static fallback;
8. unchanged bilingual Hero copy, section order, layout breakpoints, and
   non-Hero Figma content.

Run focused tests, the full suite, design-contract audit, build, Figma export,
source/privacy searches, and `git diff --check`. Browser review covers English
and Chinese at representative desktop/mobile widths, reduced motion, no
JavaScript, initial top-of-page position, overflow, and the absence of any
click/play affordance. Compare matched geometry/crops with the frozen baseline;
the only approved visual differences are the missing Play control and Figma's
correct canonical Hero photograph.

## Replacement Workflow

After this package, an ordinary Hero replacement requires only:

1. create an approved metadata-free local derivative under
   `public/assets/portfolio/`;
2. update the one `data/site.json` HeroMedia record, including dimensions,
   bilingual alt, focal points, motion, and rights status;
3. run tests, build, and Figma export.

No ordinary replacement edits the HTML renderer, CSS selectors, JavaScript,
Figma export source, or hand-maintained parallel asset map.

## Boundaries And Rollback

- Branch from local `main` at
  `fb6517591e34b9cb20d814891c0177cf2ac9ba2c`; do not stack the open A1-1
  implementation into this user-visible package.
- Do not modify, stage, rename, or delete the protected user-owned untracked
  review file.
- Do not change Featured/Archive reels, Contact, public claims, section order,
  current site copy, Vercel configuration, Preview, alias, or Production.
- Reverting Commit 2 restores Play/showreel while retaining the maintainable
  HeroMedia extraction. Reverting both commits restores the exact current Hero
  architecture and behavior.
- No push to `origin/main`, merge, Preview, or Production occurs without a
  separate producer instruction.
