# Ghost Hand Archive Slideshow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable Repo-configured Archive still-slideshow pipeline and use it to publish the approved six-still, 10-second `Gui Shou Shen Che / 鬼手神車` reel and poster locally.

**Architecture:** A pure recipe/timeline unit validates safe relative still sources and produces a deterministic 300-frame plan. A generic HTML unit turns that plan into a HyperFrames composition; a guarded CLI imports metadata-stripped authoring stills, renders and verifies public media in staging, and applies the existing Archive media contract through a rollback-capable package writer. The site keeps using the current generic `cardReel*` fields and playback component.

**Tech Stack:** Node.js ESM and `node:test`; HyperFrames `general-video`; GSAP; ffmpeg/ffprobe and WebP; the existing media manifest, portfolio contract, static generator, Figma export, and Playwright QA.

---

## Baseline And Guardrails

- Begin on `codex/overclocking-static-poster` at or descended only from design
  commit `cc6bc1a`; do not silently rebase or merge.
- The protected untracked file is
  `docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md`, expected
  SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.
  Never modify or stage it.
- Raw Downloads JPEGs remain outside Git. Never print their metadata or private
  absolute paths in committed files, CLI output, errors, or review evidence.
- Do not push, merge `main`, create a Preview, submit Contact, or deploy
  Production without later explicit producer authorization.
- Before render-affecting work, load `hyperframes`, route to `general-video`,
  follow its current CLI/domain instructions, and run its version probe.
- Use `anthropic-skills:test-driven-development` for every behavior change.

## File Map

Create:

- `scripts/lib/archive-still-slideshow.mjs` — recipe and timeline.
- `scripts/lib/archive-still-slideshow-html.mjs` — generic HyperFrames HTML.
- `scripts/lib/webp-metadata.mjs` — fail-closed authoring-image privacy check.
- `scripts/lib/archive-media-package-writer.mjs` — staged write and rollback.
- `scripts/build-archive-still-slideshow.mjs` — strict CLI orchestration.
- `tests/archive-still-slideshow.test.mjs`.
- `tests/archive-media-package-writer.test.mjs`.
- `showreel/ghost-hand-divine-car-card-reel/` authoring package.
- Public Ghost Hand MP4 and WebP.

Modify:

- `.gitignore`, `package.json`.
- `scripts/lib/media-package-plan.mjs`.
- `scripts/plan-archive-media-package.mjs`.
- `tests/media-package-plan.test.mjs`.
- `tests/build-site.test.mjs`.
- `content/archive/ghost-hand-divine-car.md`.
- `data/media-manifest.json`.
- `STATUS.md`, `docs/reviews/LOG.md` after product gates pass.

### Task 0: Required Multi-AI Architecture Gate

**Files:**
- Read: `AGENTS.md`
- Read: `PROJECT_BIBLE.md`
- Read: `docs/TOOLING.md`
- Read: `docs/COLLABORATION.md`
- Read: `docs/superpowers/specs/2026-08-06-ghost-hand-archive-slideshow-design.md`

- [ ] **Step 1: Verify baseline**

```bash
git status -sb
git rev-parse HEAD
shasum -a 256 "docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md"
```

Expected: current feature branch, approved design present, protected SHA exact.

- [ ] **Step 2: Consult through `brainstorming-with-multiple-ai`**

Freeze the approved design and ask:

1. Is `recipe → generic HyperFrames composition → staged writer` the smallest
   reusable boundary?
2. Does a `video-frame | still` poster-source discriminator preserve existing
   planner compatibility?
3. Is rollback-capable staged replacement sufficient for the four-target
   public package?

Use current highest-capability generally released models through approved
lanes and record requested/observed/completed IDs. A finding that changes
schema, rights, public behavior, or scope requires producer approval before
implementation.

- [ ] **Step 3: Record the decision**

No-change goes into Task 8's package log. An approved material correction is a
design-only commit before Task 1:

```bash
git add docs/superpowers/specs/2026-08-06-ghost-hand-archive-slideshow-design.md
git commit -m "docs: refine Archive slideshow architecture"
```

### Task 1: Support Still-Sourced Posters In The Existing Planner

**Files:**
- Modify: `scripts/lib/media-package-plan.mjs`
- Modify: `scripts/plan-archive-media-package.mjs`
- Modify: `tests/media-package-plan.test.mjs`

- [ ] **Step 1: Write RED tests**

```js
test("Archive media planner supports still-sourced posters without a false timecode", () => {
  const plan = createArchiveMediaPackagePlan({
    ...baseInput,
    posterSourceKind: "still",
    posterSourceTimecode: undefined,
  });
  assert.equal(plan.posterSourceKind, "still");
  assert.equal(Object.hasOwn(plan.frontmatterPatch, "posterSourceTimecode"), false);
  assert.equal(JSON.stringify(plan).includes(root), false);
});

test("Archive media planner keeps video-frame timecodes mandatory", () => {
  assert.throws(() => createArchiveMediaPackagePlan({
    ...baseInput,
    posterSourceKind: "video-frame",
    posterSourceTimecode: undefined,
  }), /timecode/);
});
```

- [ ] **Step 2: Observe RED**

```bash
node --test --test-name-pattern "still-sourced|video-frame timecodes" tests/media-package-plan.test.mjs
```

Expected: FAIL because the planner always requires a timecode.

- [ ] **Step 3: Implement the discriminator**

```js
const POSTER_SOURCE_KINDS = new Set(["video-frame", "still"]);

function normalizePosterSource(input) {
  const kind = input.posterSourceKind || "video-frame";
  if (!POSTER_SOURCE_KINDS.has(kind)) {
    throw new Error("poster source kind must be video-frame or still");
  }
  if (kind === "video-frame") {
    if (!/^\d{2}:\d{2}:\d{2}(?:\.\d{3})?$/.test(input.posterSourceTimecode || "")) {
      throw new Error("timecode must use HH:MM:SS or HH:MM:SS.mmm");
    }
    return { kind, timecode: input.posterSourceTimecode };
  }
  if (input.posterSourceTimecode != null && input.posterSourceTimecode !== "") {
    throw new Error("still poster source must not declare a timecode");
  }
  return { kind };
}
```

Call this once. Return `posterSourceKind: posterSource.kind`. Build the patch
with:

```js
const frontmatterPatch = {
  posterImage: posterPublicPath,
  imageAlt: { ...input.imageAlt },
  posterRightsStatus: input.rightsStatus,
  posterDimensions: { width: posterProbe.video.width, height: posterProbe.video.height },
  posterFocalPoint: { ...focal },
  ...(posterSource.kind === "video-frame"
    ? { posterSourceTimecode: posterSource.timecode }
    : {}),
  cardReelUrl: reelPublicPath,
  cardReelPoster: posterPublicPath,
  cardReelMode: "after-hold",
  cardReelDuration: normalizeDuration(reelProbe.duration),
  cardReelRightsStatus: input.rightsStatus,
};
```

- [ ] **Step 4: Expose the CLI option**

Allow `--poster-source-kind`, default it to `video-frame`, and let the library
validate missing `--timecode`.

- [ ] **Step 5: Observe GREEN**

```bash
node --test tests/media-package-plan.test.mjs
```

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/media-package-plan.mjs scripts/plan-archive-media-package.mjs tests/media-package-plan.test.mjs
git commit -m "feat: support still-sourced Archive posters"
```

### Task 2: Build The Recipe And Timeline Unit

**Files:**
- Create: `scripts/lib/archive-still-slideshow.mjs`
- Create: `tests/archive-still-slideshow.test.mjs`

- [ ] **Step 1: Write RED tests**

```js
import assert from "node:assert/strict";
import test from "node:test";

import {
  createArchiveStillSlideshowTimeline,
  validateArchiveStillSlideshowRecipe,
} from "../scripts/lib/archive-still-slideshow.mjs";

const frame = (id) => ({
  id,
  source: `assets/stills/${id}.webp`,
  sourceBasename: `${id}.jpg`,
  sourceSha256: "a".repeat(64),
  sourceDimensions: { width: 4032, height: 3024 },
  cropMode: "cover",
  durationFrames: 50,
  focalPoint: { x: 0.5, y: 0.5 },
  scale: { from: 1, to: 1.035 },
  transition: { kind: "dissolve", frames: 8 },
});

const recipe = {
  schemaVersion: 1,
  slug: "sample-archive",
  rightsStatus: "user-supplied-local-source",
  width: 1280,
  height: 720,
  fps: 30,
  durationFrames: 300,
  outputProfiles: {
    reel: "silent-h264-720p-bt709",
    poster: "webp-1280x720",
  },
  publicPaths: {
    reel: "/assets/showreel/sample-archive-card-reel.mp4",
    poster: "/assets/showreel/sample-archive-card-reel-poster.webp",
  },
  posterFrameId: "frame-01",
  posterFocalPoint: { x: 0.5, y: 0.5 },
  alt: { en: "Sample still", zh: "範例劇照" },
  frames: Array.from({ length: 6 }, (_, index) => frame(`frame-0${index + 1}`)),
};

test("recipe validates one safe six-still contract", () => {
  const result = validateArchiveStillSlideshowRecipe(recipe);
  assert.equal(result.frames.length, 6);
  assert.equal(result.frames.reduce((sum, item) => sum + item.durationFrames, 0), 300);
});

test("timeline uses six slots and an eight-frame loop return", () => {
  const timeline = createArchiveStillSlideshowTimeline(recipe);
  assert.deepEqual(timeline.frames.map((item) => item.startFrame), [0, 50, 100, 150, 200, 250]);
  assert.deepEqual(timeline.frames.map((item) => item.fadeOutStartFrame), [50, 100, 150, 200, 250, 292]);
  assert.deepEqual(timeline.loopReturn, {
    frameId: "frame-01",
    startFrame: 292,
    endFrame: 300,
  });
});

test("recipe fails closed on unsafe input", () => {
  const cases = [
    [{ ...recipe, frames: [{ ...recipe.frames[0], source: ["/Us", "ers/person/source.jpg"].join("") }, ...recipe.frames.slice(1)] }, /relative/],
    [{ ...recipe, frames: [{ ...recipe.frames[0], focalPoint: { x: 2, y: 0.5 } }, ...recipe.frames.slice(1)] }, /focal/],
    [{ ...recipe, frames: [recipe.frames[0], recipe.frames[0], ...recipe.frames.slice(2)] }, /unique/],
    [{ ...recipe, durationFrames: 301 }, /duration/],
    [{ ...recipe, publicPaths: { ...recipe.publicPaths, reel: "/assets/showreel/another-card-reel.mp4" } }, /public path/],
    [{ ...recipe, frames: [{ ...recipe.frames[0], sourceDimensions: { width: 0, height: 3024 } }, ...recipe.frames.slice(1)] }, /dimensions/],
  ];
  for (const [input, pattern] of cases) {
    assert.throws(() => validateArchiveStillSlideshowRecipe(input), pattern);
  }
});
```

- [ ] **Step 2: Observe RED**

```bash
node --test tests/archive-still-slideshow.test.mjs
```

Expected: module-not-found.

- [ ] **Step 3: Implement validation**

Create exports:

```js
export function validateArchiveStillSlideshowRecipe(input) {
  // Validate one object only; do not read disk.
}
export function createArchiveStillSlideshowTimeline(input) {
  // Return deterministic frame numbers only; do not render.
}
```

The validator must enforce:

- schema 1; kebab-case slug and unique frame ids;
- rights exactly `user-supplied-local-source`;
- 1280×720, 30 fps, 300 frames;
- output profiles exactly `silent-h264-720p-bt709` and `webp-1280x720`;
- stable public reel/poster paths exactly matching the declared slug;
- bilingual alt and top-level poster focal point;
- safe normalized relative paths under `assets/stills/`;
- basename without separators, positive integer source dimensions, and
  lowercase SHA-256;
- crop mode exactly `cover`;
- focal x/y within 0–1;
- 50-frame slots, scale 1→1.035, eight-frame dissolve;
- poster id present and frame-duration sum equal 300.

The timeline implementation must use:

```js
let startFrame = 0;
const frames = recipe.frames.map((item, index) => {
  const endFrame = startFrame + item.durationFrames;
  const fadeOutStartFrame = index === recipe.frames.length - 1
    ? recipe.durationFrames - item.transition.frames
    : endFrame;
  const planned = {
    ...item,
    startFrame,
    endFrame,
    fadeInEndFrame: index === 0 ? 0 : startFrame + item.transition.frames,
    fadeOutStartFrame,
    fadeOutEndFrame: Math.min(recipe.durationFrames, fadeOutStartFrame + item.transition.frames),
  };
  startFrame = endFrame;
  return planned;
});
```

Return `fps`, `durationFrames`, `durationSeconds`, `frames`, and:

```js
loopReturn: {
  frameId: recipe.posterFrameId,
  startFrame: 292,
  endFrame: 300,
}
```

- [ ] **Step 4: Observe GREEN**

```bash
node --test tests/archive-still-slideshow.test.mjs
```

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/archive-still-slideshow.mjs tests/archive-still-slideshow.test.mjs
git commit -m "feat: add Archive still slideshow recipe"
```

### Task 3: Generate Generic HyperFrames HTML

**Files:**
- Create: `scripts/lib/archive-still-slideshow-html.mjs`
- Modify: `tests/archive-still-slideshow.test.mjs`

- [ ] **Step 1: Add RED tests**

```js
test("generic composition renders six stills plus loop return", () => {
  const html = renderArchiveStillSlideshowHtml(recipe);
  assert.match(html, /data-composition-id="archive-still-slideshow"/);
  assert.match(html, /data-duration="10"/);
  assert.match(html, /data-fps="30"/);
  assert.equal((html.match(/class="still-frame"/g) || []).length, 7);
  assert.match(html, /loop-return-frame/);
  assert.match(html, /scale: 1\.035/);
});

test("generic renderer has no Ghost Hand special case", () => {
  const source = readFileSync(join(root, "scripts/lib/archive-still-slideshow-html.mjs"), "utf8");
  assert.doesNotMatch(source, /ghost-hand-divine-car|4arUG0s6|HDHnSa6p/);
});
```

- [ ] **Step 2: Observe RED**

```bash
node --test --test-name-pattern "generic composition|generic renderer" tests/archive-still-slideshow.test.mjs
```

- [ ] **Step 3: Implement the HTML unit**

`renderArchiveStillSlideshowHtml(recipe)` must validate, build the timeline,
HTML-escape attributes, and emit:

- one 1280×720 root, duration 10, fps 30;
- six root-owned `<img class="still-frame">` layers;
- one duplicate poster layer from frames 292–300;
- object-cover with focal percentages;
- first opacity 1 and later opacity 0;
- one paused GSAP timeline;
- scale 1→1.035 for each active layer;
- five eight-frame adjacent dissolves;
- one eight-frame final-to-poster dissolve;
- `window.__timelines["archive-still-slideshow"] = tl`.

Selectors derive only from validated ids. The source file must not contain a
slug or source basename.

- [ ] **Step 4: Observe GREEN**

```bash
node --test tests/archive-still-slideshow.test.mjs
```

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/archive-still-slideshow-html.mjs tests/archive-still-slideshow.test.mjs
git commit -m "feat: render generic Archive still compositions"
```

### Task 4: Add The Guarded CLI

**Files:**
- Create: `scripts/build-archive-still-slideshow.mjs`
- Create: `scripts/lib/webp-metadata.mjs`
- Modify: `package.json`
- Modify: `.gitignore`
- Modify: `tests/archive-still-slideshow.test.mjs`

- [ ] **Step 1: Write RED tests**

```js
test("media:slideshow defaults to a redacted no-write plan", () => {
  const output = execFileSync(process.execPath, [
    join(root, "scripts/build-archive-still-slideshow.mjs"),
    "--config", fixtureConfig,
  ], { cwd: emptyWorkingDirectory, encoding: "utf8" });
  const plan = JSON.parse(output);
  assert.equal(plan.mode, "dry-run");
  assert.equal(plan.writesFiles, false);
  assert.equal(output.includes(dirname(fixtureConfig)), false);
  assert.deepEqual(readdirSync(emptyWorkingDirectory), []);
});

test("package exposes the stable slideshow command", () => {
  const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  assert.equal(packageJson.scripts["media:slideshow"], "node scripts/build-archive-still-slideshow.mjs");
});

test("authoring WebP privacy check fails closed on metadata and unknown chunks", () => {
  assert.doesNotThrow(() => assertPublicWebpMetadataSafe(webpWithChunks(["VP8 "])));
  for (const chunk of ["EXIF", "XMP ", "ICCP", "JUNK"]) {
    assert.throws(() => assertPublicWebpMetadataSafe(webpWithChunks(["VP8 ", chunk])), /metadata/);
  }
});
```

- [ ] **Step 2: Observe RED**

```bash
node --test --test-name-pattern "media:slideshow|stable slideshow" tests/archive-still-slideshow.test.mjs
```

- [ ] **Step 3: Implement strict parsing and dry-run**

Support only:

```text
--config <path> [--source-dir <path>] [--authoring-only] [--write]
```

Reject unknown/repeated/missing options. The two write flags are mutually
exclusive. Dry-run prints only:

```js
{
  schemaVersion: 1,
  mode: "dry-run",
  writesFiles: false,
  slug: recipe.slug,
  sourceBasenames: recipe.frames.map((frame) => frame.sourceBasename),
  authoringProject: `showreel/${recipe.slug}-card-reel`,
  publicReel: recipe.publicPaths.reel,
  publicPoster: recipe.publicPaths.poster,
  timeline,
}
```

- [ ] **Step 4: Implement injected write orchestration**

Export `runArchiveStillSlideshow(options, dependencies)` so tests inject
filesystem/process/writer dependencies. Write mode:

1. verifies each source basename, SHA, and pixel dimensions;
2. stages outside public targets;
3. normalizes 1280×720 metadata-free WebPs;
4. writes generated `index.html`;
5. renders HyperFrames to staging;
6. post-encodes exact H.264 profile;
7. takes poster from normalized poster frame;
8. calls Task 5 writer after verification;
9. cleans staging in `finally`.

Use validated focal values in:

```text
scale=1280:720:force_original_aspect_ratio=increase,
crop=1280:720:
x='min(max(iw*FOCAL_X-640,0),iw-1280)':
y='min(max(ih*FOCAL_Y-360,0),ih-720)',
setsar=1
```

Still encoding: `-map_metadata -1 -frames:v 1 -c:v libwebp -q:v 88`.
After each encode, `assertPublicWebpMetadataSafe` must parse the RIFF container,
allow only the static structural chunks emitted by this pipeline (`VP8 `,
`VP8L`, `VP8X`, `ALPH`), reject metadata/animation/unclassified chunks, and
reject a `VP8X` feature flag that declares ICC, EXIF, XMP, or animation.

Final video encoding:

```text
-an -r 30 -t 10 -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p
-colorspace bt709 -color_trc bt709 -color_primaries bt709
-movflags +faststart
```

- [ ] **Step 5: Add entry point and ignore rule**

Root `package.json`:

```json
"media:slideshow": "node scripts/build-archive-still-slideshow.mjs"
```

`.gitignore`:

```gitignore
showreel/**/assets/source-stills/originals/
```

- [ ] **Step 6: Observe GREEN**

```bash
node --test tests/archive-still-slideshow.test.mjs
```

Expected: no render or write during dry-run tests.

- [ ] **Step 7: Commit**

```bash
git add .gitignore package.json scripts/build-archive-still-slideshow.mjs scripts/lib/webp-metadata.mjs tests/archive-still-slideshow.test.mjs
git commit -m "feat: add guarded Archive slideshow command"
```

### Task 5: Add Rollback-Capable Package Writes

**Files:**
- Create: `scripts/lib/archive-media-package-writer.mjs`
- Create: `tests/archive-media-package-writer.test.mjs`
- Modify: `scripts/build-archive-still-slideshow.mjs`

- [ ] **Step 1: Write RED tests**

```js
test("writer commits reel poster manifest and frontmatter", () => {
  const result = writeArchiveMediaPackage(fixtureInput);
  assert.equal(result.writesFiles, true);
  assert.equal(readArchive(root).posterImage, "/assets/showreel/sample-card-reel-poster.webp");
  assert.equal(loadMediaManifest(root).assets.filter((entry) => entry.owner.slug === "sample").length, 2);
});

test("writer rolls all targets back after an injected failure", () => {
  const before = snapshotTargets(root);
  assert.throws(() => writeArchiveMediaPackage({
    ...fixtureInput,
    beforeRename: ({ index }) => {
      if (index === 2) throw new Error("injected commit failure");
    },
  }), /injected commit failure/);
  assert.deepEqual(snapshotTargets(root), before);
});

test("writer errors redact private directories", () => {
  assert.throws(
    () => writeArchiveMediaPackage({ ...fixtureInput, stagedReelPath: privateMissingPath }),
    (error) => !error.message.includes(dirname(privateMissingPath)),
  );
});
```

- [ ] **Step 2: Observe RED**

```bash
node --test tests/archive-media-package-writer.test.mjs
```

- [ ] **Step 3: Implement the writer**

Export:

```js
export function writeArchiveMediaPackage({
  repoRoot,
  slug,
  stagedReelPath,
  stagedPosterPath,
  publication,
  beforeRename = () => {},
})
```

The function must:

- use `createArchiveMediaPackagePlan` with `posterSourceKind: "still"`;
- merge only `frontmatterPatch` and preserve Markdown body bytes;
- replace same-id manifest entries or append new entries;
- call `validateMediaManifest`;
- stage four sibling targets with `{ flag: "wx" }`;
- back up existing targets;
- call `beforeRename({ index, target })` before each replacement;
- restore backups/remove created targets on any failure;
- remove backups only after all four replacements;
- return relative paths and exact probes, never absolute paths.

Replacement order: public reel, public poster, manifest, frontmatter.

- [ ] **Step 4: Connect CLI write mode**

Pass:

```js
publication: {
  rightsStatus: recipe.rightsStatus,
  imageAlt: recipe.alt,
  posterFocalPoint: recipe.posterFocalPoint,
}
```

Task 2 must validate top-level `posterFocalPoint`.

- [ ] **Step 5: Observe GREEN**

```bash
node --test tests/archive-media-package-writer.test.mjs tests/archive-still-slideshow.test.mjs tests/media-package-plan.test.mjs
```

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/archive-media-package-writer.mjs scripts/build-archive-still-slideshow.mjs tests/archive-media-package-writer.test.mjs tests/archive-still-slideshow.test.mjs
git commit -m "feat: write Archive media packages safely"
```

### Task 6: Add The Approved Ghost Hand Recipe

**Files:**
- Create the Ghost Hand authoring directory, config, docs, HTML, and six safe
  WebPs listed in the File Map.

- [ ] **Step 1: Scaffold and probe HyperFrames before adding project files**

The target directory must not exist before `init`; fail closed if it does.

```bash
test ! -e showreel/ghost-hand-divine-car-card-reel
cd showreel
npx --yes hyperframes@latest init ghost-hand-divine-car-card-reel --example blank --non-interactive --skill general-video
cd ..
npx --yes hyperframes@latest upgrade --project showreel/ghost-hand-divine-car-card-reel --check
```

Retain the verified pin. Configure 1280×720, `media.autoProxy: true`, and
`authoringSkill: "general-video"`.

- [ ] **Step 2: Copy inputs into the ignored local archive**

```bash
mkdir -p showreel/ghost-hand-divine-car-card-reel/assets/source-stills/originals
: "${GHOST_HAND_SOURCE_DIR:?Set GHOST_HAND_SOURCE_DIR to the producer-approved source folder without printing it}"
cp "$GHOST_HAND_SOURCE_DIR/4arUG0s6.jpg" \
   "$GHOST_HAND_SOURCE_DIR/HDHnSa6p.jpg" \
   "$GHOST_HAND_SOURCE_DIR/tDISn7O1.jpg" \
   "$GHOST_HAND_SOURCE_DIR/gCBfY42A.jpg" \
   "$GHOST_HAND_SOURCE_DIR/LJMe3s4e.jpg" \
   "$GHOST_HAND_SOURCE_DIR/UQZej4eu.jpg" \
   showreel/ghost-hand-divine-car-card-reel/assets/source-stills/originals/
```

Verify Git does not list originals.

- [ ] **Step 3: Create exact `slideshow.json`**

Top level:

```json
{
  "schemaVersion": 1,
  "slug": "ghost-hand-divine-car",
  "rightsStatus": "user-supplied-local-source",
  "width": 1280,
  "height": 720,
  "fps": 30,
  "durationFrames": 300,
  "outputProfiles": {
    "reel": "silent-h264-720p-bt709",
    "poster": "webp-1280x720"
  },
  "publicPaths": {
    "reel": "/assets/showreel/ghost-hand-divine-car-card-reel.mp4",
    "poster": "/assets/showreel/ghost-hand-divine-car-card-reel-poster.webp"
  },
  "posterFrameId": "lead-portrait",
  "posterFocalPoint": {"x": 0.56, "y": 0.42},
  "alt": {
    "en": "Two lead characters pose in a racing workshop, one holding a white helmet",
    "zh": "賽車工作室裡，兩位主要角色合影，其中一人手持白色安全帽"
  }
}
```

Frames in order (`id`, basename, safe path, source dimensions, crop, focal x/y):

```text
lead-portrait       4arUG0s6.jpg  assets/stills/01-lead-portrait.webp       4240x2832 cover 0.56 0.42
racer-monitor       HDHnSa6p.jpg  assets/stills/02-racer-monitor.webp       4032x3024 cover 0.58 0.44
action-monitor      tDISn7O1.jpg  assets/stills/03-action-monitor.webp      4032x3024 cover 0.49 0.44
four-person-night   gCBfY42A.jpg  assets/stills/04-four-person-night.webp   4032x3024 cover 0.55 0.45
night-team          LJMe3s4e.jpg  assets/stills/05-night-team.webp          4032x3024 cover 0.52 0.49
full-cast-crew      UQZej4eu.jpg  assets/stills/06-full-cast-crew.webp      3959x2548 cover 0.53 0.50
```

Use exact source hashes from the design. Every frame: 50 frames, scale 1→1.035,
eight-frame dissolve.

- [ ] **Step 4: Inspect dry-run**

```bash
npm run media:slideshow -- \
  --config showreel/ghost-hand-divine-car-card-reel/slideshow.json \
  --source-dir showreel/ghost-hand-divine-car-card-reel/assets/source-stills/originals
```

Expected: six basenames, 300 frames, stable paths, and no private absolute path.

- [ ] **Step 5: Generate authoring files**

```bash
npm run media:slideshow -- \
  --config showreel/ghost-hand-divine-car-card-reel/slideshow.json \
  --source-dir showreel/ghost-hand-divine-car-card-reel/assets/source-stills/originals \
  --authoring-only
cd showreel/ghost-hand-divine-car-card-reel
npm run check -- --at-transitions --strict
```

Expected: six safe WebPs, generated HTML, check PASS.

- [ ] **Step 6: Document and privacy-scan**

`STORYBOARD.md` records order/timing/focals/motion. `README.md` records
dry-run/write commands, stable outputs, pin, rights, and private source rule.

```bash
node --test --test-name-pattern "private absolute paths" tests/build-site.test.mjs
rg -n "Downloads/" showreel/ghost-hand-divine-car-card-reel scripts tests \
  -g '!assets/source-stills/originals/**'
```

Expected: empty.

- [ ] **Step 7: Commit safe authoring files**

```bash
git add .gitignore showreel/ghost-hand-divine-car-card-reel
git status --short
git commit -m "feat: add Ghost Hand slideshow recipe"
```

Confirm ignored originals are not staged before committing.

### Task 7: Render And Integrate Public Media

**Files:**
- Modify: `tests/build-site.test.mjs`
- Modify via writer: `content/archive/ghost-hand-divine-car.md`
- Modify via writer: `data/media-manifest.json`
- Create via writer: public Ghost Hand MP4 and WebP.

- [ ] **Step 1: Write public RED test**

```js
test("Ghost Hand archive data uses the approved still slideshow package", () => {
  const archive = loadMarkdownCollection(join(root, "content/archive"));
  const item = archive.find((record) => record.slug === "ghost-hand-divine-car");

  assert.equal(item.posterImage, "/assets/showreel/ghost-hand-divine-car-card-reel-poster.webp");
  assert.equal(item.cardReelUrl, "/assets/showreel/ghost-hand-divine-car-card-reel.mp4");
  assert.equal(item.cardReelPoster, item.posterImage);
  assert.equal(item.cardReelMode, "after-hold");
  assert.equal(item.cardReelDuration, 10);
  assert.equal(item.posterRightsStatus, "user-supplied-local-source");
  assert.equal(item.cardReelRightsStatus, "user-supplied-local-source");
  assert.deepEqual(item.posterDimensions, { width: 1280, height: 720 });
  assert.equal(item.posterSourceTimecode, undefined);
  assert.match(item.imageAlt.en, /two lead characters/i);
  assert.match(item.imageAlt.zh, /兩位主要角色/);
});
```

- [ ] **Step 2: Observe RED**

```bash
node --test --test-name-pattern "Ghost Hand archive data" tests/build-site.test.mjs
```

- [ ] **Step 3: Render and write**

```bash
npm run media:slideshow -- \
  --config showreel/ghost-hand-divine-car-card-reel/slideshow.json \
  --source-dir showreel/ghost-hand-divine-car-card-reel/assets/source-stills/originals \
  --write
```

Expected: render, exact encode, poster, two manifest entries, patched
frontmatter, redacted summary.

- [ ] **Step 4: Verify exact media**

```bash
ffprobe -v error -show_entries \
  format=duration:stream=codec_name,codec_type,width,height,pix_fmt,color_space,color_transfer,color_primaries \
  -of json public/assets/showreel/ghost-hand-divine-car-card-reel.mp4
ffmpeg -v error -i public/assets/showreel/ghost-hand-divine-car-card-reel.mp4 -f null -
node --test tests/media-assets.test.mjs tests/media-manifest.test.mjs
```

Expected: 10s, one H.264 1280×720 yuv420p BT.709 stream, zero audio, full
decode and manifest PASS.

- [ ] **Step 5: Observe GREEN**

```bash
node --test --test-name-pattern "Ghost Hand archive data|archive reel markup" tests/build-site.test.mjs
```

- [ ] **Step 6: Commit**

```bash
git add tests/build-site.test.mjs \
  content/archive/ghost-hand-divine-car.md \
  data/media-manifest.json \
  public/assets/showreel/ghost-hand-divine-car-card-reel.mp4 \
  public/assets/showreel/ghost-hand-divine-car-card-reel-poster.webp
git commit -m "feat: add Ghost Hand Archive slideshow"
```

### Task 8: Full QA And Handoff

**Files:**
- Modify: `STATUS.md`
- Modify: `docs/reviews/LOG.md`

- [ ] **Step 1: Run all gates**

```bash
npm test
npm run build
npm run figma:export
npm run audit:design-contract
git diff --check
```

- [ ] **Step 2: Inspect visual evidence**

Capture `0`, `1.667`, `5`, `8.333`, `9.733`, and `9.967` seconds plus an
early/middle/late contact sheet. Verify poster match, face-safe crops, no black
flash, eight-frame dissolves, scale ≤1.035, and loop return. Focal fixes change
recipe data only and trigger re-render/media tests.

- [ ] **Step 3: Run bilingual browser QA**

Use browser-testing on a unique port. Check English/Chinese desktop and
390×664 mobile: poster hold, play/reset/re-entry, one-reel arbitration,
reduced-motion poster, overflow, console/request errors, and zero Contact POST.

- [ ] **Step 4: Recheck privacy/protection**

```bash
node --test --test-name-pattern "private absolute paths" tests/build-site.test.mjs
rg -n "Downloads/" content data public scripts \
  showreel/ghost-hand-divine-car-card-reel tests \
  -g '!assets/source-stills/originals/**'
shasum -a 256 "docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md"
git status --short
```

Expected: no private tracked path and protected SHA exact.

- [ ] **Step 5: Update durable records**

Record branch/base/commits, media sizes/hashes, HyperFrames
requested/observed/completed version, RED/GREEN/full gates, multi-AI
provenance, protected file, untouched external state, and next action: local
approval followed by separately authorized merge and/or Preview.

- [ ] **Step 6: Commit documentation**

```bash
git add STATUS.md docs/reviews/LOG.md
git commit -m "docs: record Ghost Hand slideshow package"
```

- [ ] **Step 7: Audit final state**

```bash
git status -sb
git log --oneline --decorate -12
git branch -r --contains HEAD
```

Expected: feature branch only, no remote contains HEAD, protected file sole
untracked item.

## Completion Definition

Completion requires the generic recipe, HTML generator, guarded CLI, rollback
writer, Ghost Hand authoring package, public media, Archive record, manifest,
all gates, browser behavior, privacy checks, and durable handoff. A rendered
reel without the reusable component, or a component without the integrated
Ghost Hand vertical slice, is incomplete.
