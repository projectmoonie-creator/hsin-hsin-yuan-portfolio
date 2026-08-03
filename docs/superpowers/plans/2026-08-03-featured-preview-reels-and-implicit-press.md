# Featured Preview Reels And Implicit Work Press Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three full-length, web-optimized Featured preview reels, standardize all five Featured reels on a poster-first 1.4-second hold, and remove the visible work-Press group heading without changing covers, links, card geometry, or Production.

**Architecture:** Canonical work records own reel URLs, posters, playback mode, and private provenance; the normalizer validates the public reel triplet while keeping provenance evidence-only. The renderer emits poster-backed, non-interactive videos inside the existing media-link wrapper, and one visibility controller owns hold timers, playback, and reset behavior. Work Press remains an optional normalized module whose group name is semantic-only while each entry keeps its visible type.

**Tech Stack:** Node.js ESM, dependency-free HTML generator, browser `IntersectionObserver`, ffmpeg/ffprobe, Node test runner, generated SVG/Figma handoff, static Vercel-compatible output.

---

## Baseline and boundaries

- Approved design: `docs/superpowers/specs/2026-08-03-featured-preview-reels-and-implicit-press-design.md`
- Rollback checkpoint: `be5ff4fe3d828a85c955764dedf9e0ce1200e0f6`
- Work branch: `codex/featured-preview-reels-implicit-press`
- Protected user file: `docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md`
- Do not change posters, work copy, tags, metrics, Press entries, destinations,
  geometry, breakpoints, global Press, contact behavior, Production, or the
  current Vercel Preview.
- Do not commit external-volume paths. Store source basenames and SHA-256 only.

## File responsibility map

- `tests/portfolio-contract.test.mjs`: source declarations, evidence boundary,
  and complete reel-triplet validation.
- `tests/media-assets.test.mjs`: executable media contract for the three
  derived MP4 files.
- `tests/build-site.test.mjs`: bilingual markup, link, semantic Press, CSS, and
  JavaScript regression contracts.
- `scripts/lib/portfolio-contract.mjs`: allowed Featured reel mode and
  source-to-public/evidence validation.
- `content/works/*.md`: canonical per-work reel role and private provenance.
- `public/assets/showreel/*.mp4`: public video-only 720p derivatives.
- `showreel/featured-preview-reels/README.md`: reproducible conversion record;
  its ignored `.media/` child owns the local media-use ledger.
- `scripts/build-site.mjs`: Featured video markup and implicit work-Press group.
- `src/main.js`: poster-hold timer and one-active-reel lifecycle.
- `src/styles.css`: existing poster/video fade; obsolete visible Press-title
  selector removed.
- `docs/design-contract.md` and `PROJECT_BIBLE.md`: current media and Press
  rules.
- `STATUS.md` and a dated review: resumable checkpoint and final evidence.

### Task 1: Lock canonical reel and media requirements with RED tests

**Files:**
- Modify: `tests/portfolio-contract.test.mjs`
- Create: `tests/media-assets.test.mjs`

- [x] **Step 1: Add failing contract tests for a complete after-hold reel**

Import `FEATURED_REEL_MODES` beside the existing contract exports, then add:

```js
test("featured reel contracts require one complete approved triplet and keep provenance private", () => {
  const source = featured({
    featuredReelMode: "after-hold",
    featuredReelUrl: "/assets/showreel/sample-card-reel.mp4",
    featuredReelPoster: "/assets/sample.webp",
    featuredReelSourceFilename: "sample-source.mp4",
    featuredReelSourceSha256: "a".repeat(64),
    featuredReelSourceDuration: 30.03,
    featuredReelSourceDimensions: { width: 1920, height: 1080 },
    featuredReelRightsStatus: "user-supplied-local-source",
  });
  const normalized = normalizeFeaturedWork(source);

  assert.deepEqual(FEATURED_REEL_MODES, ["after-hold"]);
  assert.equal(normalized.contract.public.featuredReelMode, "after-hold");
  assert.equal(normalized.contract.public.featuredReelSourceFilename, undefined);
  assert.equal(normalized.contract.evidence.featuredReelSourceFilename, "sample-source.mp4");
  assert.equal(normalized.contract.evidence.featuredReelSourceSha256, "a".repeat(64));

  assert.throws(
    () => normalizeFeaturedWork(featured({ featuredReelMode: "after-hold" })),
    /complete featured reel triplet/,
  );
  assert.throws(
    () => normalizeFeaturedWork(featured({
      featuredReelMode: "in-view",
      featuredReelUrl: "/assets/showreel/sample.mp4",
      featuredReelPoster: "/assets/sample.webp",
    })),
    /featuredReelMode must be one of: after-hold/,
  );
});
```

- [x] **Step 2: Add a failing exact source-declaration test**

```js
test("five Featured works declare the approved poster-first reel contract", () => {
  const works = readWorkSources();
  const expected = new Map([
    ["slow-steps", ["/assets/showreel/slow-steps-card-reel.mp4", 30.03]],
    ["tech-dreamers", ["/assets/showreel/tech-dreamers-card-reel.mp4", 30.03]],
    ["my-art-my-voice", ["/assets/showreel/my-art-my-voice-card-reel.mp4", 100.033267]],
    ["interior-spatial-brand-films", ["/assets/showreel/interior-spatial-card-reel.mp4", null]],
    ["pts-taigi-bus", ["/assets/showreel/nothing-by-bus-card-reel.mp4", null]],
  ]);

  const reels = works.filter((work) => work.featuredReelUrl);
  assert.deepEqual(reels.map((work) => work.slug), [...expected.keys()]);
  for (const work of reels) {
    const [url, sourceDuration] = expected.get(work.slug);
    assert.equal(work.featuredReelMode, "after-hold", work.slug);
    assert.equal(work.featuredReelUrl, url, work.slug);
    assert.equal(work.featuredReelPoster, work.posterImage, work.slug);
    if (sourceDuration !== null) {
      assert.equal(work.featuredReelSourceDuration, sourceDuration, work.slug);
      assert.equal(work.featuredReelRightsStatus, "user-supplied-local-source", work.slug);
      assert.match(work.featuredReelSourceSha256, /^[a-f0-9]{64}$/, work.slug);
    }
  }
});
```

- [x] **Step 3: Create the failing executable media test**

```js
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const expected = [
  ["slow-steps-card-reel.mp4", 30.03],
  ["tech-dreamers-card-reel.mp4", 30.03],
  ["my-art-my-voice-card-reel.mp4", 100.033267],
];

function probe(path) {
  return JSON.parse(execFileSync("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration:stream=codec_name,codec_type,width,height,pix_fmt,color_space,color_transfer,color_primaries",
    "-of", "json",
    path,
  ], { encoding: "utf8" }));
}

test("Featured preview derivatives are complete silent 720p H.264 BT.709 files", () => {
  for (const [filename, sourceDuration] of expected) {
    const path = join(root, "public/assets/showreel", filename);
    assert.equal(existsSync(path), true, filename);
    const metadata = probe(path);
    const video = metadata.streams.find((stream) => stream.codec_type === "video");
    assert.ok(video, `${filename} video stream`);
    assert.equal(metadata.streams.some((stream) => stream.codec_type === "audio"), false, filename);
    assert.equal(video.codec_name, "h264", filename);
    assert.equal(video.width, 1280, filename);
    assert.equal(video.height, 720, filename);
    assert.equal(video.pix_fmt, "yuv420p", filename);
    assert.equal(video.color_space, "bt709", filename);
    assert.equal(video.color_transfer, "bt709", filename);
    assert.equal(video.color_primaries, "bt709", filename);
    assert.ok(Math.abs(Number(metadata.format.duration) - sourceDuration) < 0.2, filename);
  }
});
```

- [x] **Step 4: Run the focused tests and verify RED**

Run:

```bash
node --test tests/portfolio-contract.test.mjs tests/media-assets.test.mjs
```

Expected: FAIL because `FEATURED_REEL_MODES`, the three source declarations,
and the three derived files do not exist yet. The protected untracked review
file must remain the only pre-existing untracked item.

### Task 2: Produce and register the full-length derivatives, then make the canonical contract GREEN

**Files:**
- Create: `public/assets/showreel/slow-steps-card-reel.mp4`
- Create: `public/assets/showreel/tech-dreamers-card-reel.mp4`
- Create: `public/assets/showreel/my-art-my-voice-card-reel.mp4`
- Create: `showreel/featured-preview-reels/README.md`
- Modify: `content/works/slow-steps.md`
- Modify: `content/works/tech-dreamers.md`
- Modify: `content/works/my-art-my-voice.md`
- Modify: `content/works/interior-spatial-brand-films.md`
- Modify: `content/works/pts-taigi-bus.md`
- Modify: `scripts/lib/portfolio-contract.mjs`
- Test: `tests/portfolio-contract.test.mjs`
- Test: `tests/media-assets.test.mjs`

- [x] **Step 1: Resolve source files by approved basename and re-check hashes**

Run in one shell session:

```bash
SLOW_SOURCE="$(find /Volumes -type f -name 'Slow Steps 30s系列網路平台宣傳片完成檔.mp4' -print -quit)"
TECH_SOURCE="$(find /Volumes -type f -name 'Promo Tech Dreamers Series 日期版 0705.mp4' -print -quit)"
ART_SOURCE="$(find /Volumes -type f -name 'My art  my voice  0214 預告完成檔.mp4' -print -quit)"
test -n "$SLOW_SOURCE" && test -n "$TECH_SOURCE" && test -n "$ART_SOURCE"
shasum -a 256 "$SLOW_SOURCE" "$TECH_SOURCE" "$ART_SOURCE"
```

Expected hashes, in order:

```text
0def72570da58eeb51af84b07d4cd880b666a3b8718702f7236af468b07f55ba
5a1eff80776aed305a0144f135ff9d433374f647fe0feca7a2e72ba708beeb0e
d7ab1b3c7e4a70b479af7ab28801a9c41993576502aaca87fa7032adef1e1bdd
```

- [x] **Step 2: Encode all three complete timelines deterministically**

In the same shell session, run:

```bash
ffmpeg -hide_banner -i "$SLOW_SOURCE" -map 0:v:0 -vf "scale=1280:720:flags=lanczos" -c:v libx264 -preset slow -crf 22 -maxrate 2800k -bufsize 5600k -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart -an -y public/assets/showreel/slow-steps-card-reel.mp4
ffmpeg -hide_banner -i "$TECH_SOURCE" -map 0:v:0 -vf "scale=1280:720:flags=lanczos" -c:v libx264 -preset slow -crf 22 -maxrate 2800k -bufsize 5600k -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart -an -y public/assets/showreel/tech-dreamers-card-reel.mp4
ffmpeg -hide_banner -i "$ART_SOURCE" -map 0:v:0 -vf "scale=1280:720:flags=lanczos" -c:v libx264 -preset slow -crf 22 -maxrate 2800k -bufsize 5600k -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -movflags +faststart -an -y public/assets/showreel/my-art-my-voice-card-reel.mp4
```

Expected: all commands exit 0; sources are unchanged; the outputs keep the
30.030 s, 30.030 s, and 100.033267 s timelines within 0.2 s.

- [x] **Step 3: Add the reproducible media record and local ledger**

Create `showreel/featured-preview-reels/README.md` with the approved source
basenames and hashes, the three complete ffmpeg commands from Task 2 Step 2,
output ffprobe metadata, output SHA-256 values, and this rule:

```markdown
External source paths are session-only evidence and must not be committed.
The public derivatives are video-only motion thumbnails; existing work posters
and external watch destinations remain canonical.
```

Register outputs without committing the ignored ledger:

```bash
node ~/.agents/skills/media-use/scripts/resolve.mjs --from public/assets/showreel/slow-steps-card-reel.mp4 --type video --project showreel/featured-preview-reels --json
node ~/.agents/skills/media-use/scripts/resolve.mjs --from public/assets/showreel/tech-dreamers-card-reel.mp4 --type video --project showreel/featured-preview-reels --json
node ~/.agents/skills/media-use/scripts/resolve.mjs --from public/assets/showreel/my-art-my-voice-card-reel.mp4 --type video --project showreel/featured-preview-reels --json
git check-ignore showreel/featured-preview-reels/.media/manifest.jsonl
```

Expected: three successful ingest records; `.media/manifest.jsonl` is ignored
by `showreel/**/.media/`.

- [x] **Step 4: Add canonical fields to the three new reel records**

For Slow Steps, use:

```json
"featuredReelMode": "after-hold",
"featuredReelUrl": "/assets/showreel/slow-steps-card-reel.mp4",
"featuredReelPoster": "/assets/portfolio/slow-steps-poster.webp",
"featuredReelSourceFilename": "Slow Steps 30s系列網路平台宣傳片完成檔.mp4",
"featuredReelSourceSha256": "0def72570da58eeb51af84b07d4cd880b666a3b8718702f7236af468b07f55ba",
"featuredReelSourceDuration": 30.03,
"featuredReelSourceDimensions": {"width": 1920, "height": 1080},
"featuredReelRightsStatus": "user-supplied-local-source"
```

For Tech Dreamers, add exactly:

```json
"featuredReelMode": "after-hold",
"featuredReelUrl": "/assets/showreel/tech-dreamers-card-reel.mp4",
"featuredReelPoster": "https://prod-img.taiwanplus.com/program/224be7ed-057b-400f-af63-a8582cd80cfb.webp",
"featuredReelSourceFilename": "Promo Tech Dreamers Series 日期版 0705.mp4",
"featuredReelSourceSha256": "5a1eff80776aed305a0144f135ff9d433374f647fe0feca7a2e72ba708beeb0e",
"featuredReelSourceDuration": 30.03,
"featuredReelSourceDimensions": {"width": 1920, "height": 1080},
"featuredReelRightsStatus": "user-supplied-local-source"
```

For My Art, My Voice, add exactly:

```json
"featuredReelMode": "after-hold",
"featuredReelUrl": "/assets/showreel/my-art-my-voice-card-reel.mp4",
"featuredReelPoster": "/assets/portfolio/my-art-my-voice-performance-2.jpg",
"featuredReelSourceFilename": "My art  my voice  0214 預告完成檔.mp4",
"featuredReelSourceSha256": "d7ab1b3c7e4a70b479af7ab28801a9c41993576502aaca87fa7032adef1e1bdd",
"featuredReelSourceDuration": 100.033267,
"featuredReelSourceDimensions": {"width": 1920, "height": 1080},
"featuredReelRightsStatus": "user-supplied-local-source"
```

Do not alter either `watchUrl`. In
`content/works/interior-spatial-brand-films.md` and
`content/works/pts-taigi-bus.md`, change only `featuredReelMode` from
`"in-view"` to `"after-hold"`.

- [x] **Step 5: Implement dependency-free reel validation and evidence classification**

Add these exports/constants to `scripts/lib/portfolio-contract.mjs`:

```js
export const FEATURED_REEL_MODES = Object.freeze(["after-hold"]);

const FEATURED_REEL_PUBLIC_FIELDS = Object.freeze([
  "featuredReelMode",
  "featuredReelUrl",
  "featuredReelPoster",
]);

const FEATURED_REEL_EVIDENCE_FIELDS = Object.freeze([
  "featuredReelSourceFilename",
  "featuredReelSourceSha256",
  "featuredReelSourceDuration",
  "featuredReelSourceDimensions",
  "featuredReelRightsStatus",
]);
```

Keep the public triplet in `optionalRendered`, add the five source fields to
`evidenceOnly`, and validate with:

```js
function validateFeaturedReel(source) {
  const publicCount = FEATURED_REEL_PUBLIC_FIELDS.filter((field) => Object.hasOwn(source, field)).length;
  if (publicCount && publicCount !== FEATURED_REEL_PUBLIC_FIELDS.length) {
    throw new Error(`Featured work ${source.slug} requires a complete featured reel triplet`);
  }
  if (publicCount) {
    requireOneOf(source, "featuredReelMode", FEATURED_REEL_MODES, `Featured work ${source.slug}`);
  }

  const evidenceCount = FEATURED_REEL_EVIDENCE_FIELDS.filter((field) => Object.hasOwn(source, field)).length;
  if (evidenceCount && evidenceCount !== FEATURED_REEL_EVIDENCE_FIELDS.length) {
    throw new Error(`Featured work ${source.slug} requires complete featured reel provenance`);
  }
  if (evidenceCount) {
    if (!/^[a-f0-9]{64}$/.test(source.featuredReelSourceSha256)) {
      throw new Error(`Featured work ${source.slug} featuredReelSourceSha256 must be SHA-256`);
    }
    if (!(source.featuredReelSourceDuration > 0)) {
      throw new Error(`Featured work ${source.slug} featuredReelSourceDuration must be positive`);
    }
    const dimensions = source.featuredReelSourceDimensions;
    if (!dimensions || !(dimensions.width > 0) || !(dimensions.height > 0)) {
      throw new Error(`Featured work ${source.slug} featuredReelSourceDimensions must be positive`);
    }
  }
}
```

Call `validateFeaturedReel(source)` in `normalizeFeaturedWork` immediately
after presentation validation.

- [x] **Step 6: Run focused and full tests to verify GREEN**

Run:

```bash
node --test tests/portfolio-contract.test.mjs tests/media-assets.test.mjs
npm test
```

Expected: all tests pass; no private external path is tracked.

- [x] **Step 7: Commit the media and canonical contract package**

```bash
git add public/assets/showreel/slow-steps-card-reel.mp4 public/assets/showreel/tech-dreamers-card-reel.mp4 public/assets/showreel/my-art-my-voice-card-reel.mp4 showreel/featured-preview-reels/README.md content/works/slow-steps.md content/works/tech-dreamers.md content/works/my-art-my-voice.md content/works/interior-spatial-brand-films.md content/works/pts-taigi-bus.md scripts/lib/portfolio-contract.mjs tests/portfolio-contract.test.mjs tests/media-assets.test.mjs
git commit -m "add full-length featured preview reels"
```

### Task 3: Make the work-Press group label semantic-only with TDD

**Files:**
- Modify: `tests/build-site.test.mjs`
- Modify: `scripts/build-site.mjs:149-187`
- Modify: `src/styles.css:750-764`

- [x] **Step 1: Write the failing bilingual semantic-Press test**

Add:

```js
test("work Press keeps entry labels but hides its group heading", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const css = readFileSync(join(root, "src/styles.css"), "utf8");
  const en = renderPage({ lang: "en", site, works });
  const zh = renderPage({ lang: "zh", site, works });

  assert.doesNotMatch(en, /<p class="press-preview-title"/);
  assert.doesNotMatch(zh, /<p class="press-preview-title"/);
  assert.match(en, /<div class="press-preview" role="group" aria-label="Press &amp; Interviews">/);
  assert.match(zh, /<div class="press-preview" role="group" aria-label="媒體報導與訪談">/);
  assert.match(en, /class="press-preview-type">Official page</);
  assert.match(en, /class="press-preview-type">Project press</);
  assert.match(css, /\.press-preview \{/);
  assert.doesNotMatch(css, /\.press-preview-title/);
});
```

Update older assertions that looked only for visible group-label text so they
assert the `aria-label` and the continuing entry types instead.

- [x] **Step 2: Run the test and verify RED**

```bash
node --test --test-name-pattern="work Press keeps entry labels" tests/build-site.test.mjs
```

Expected: FAIL because the wrapper has no semantic label and the visible
`press-preview-title` still exists.

- [x] **Step 3: Implement the smallest renderer and CSS change**

In `renderPress`, replace:

```js
<div class="press-preview">
  <p class="press-preview-title">${escapeHtml(label)}</p>
```

with:

```js
<div class="press-preview" role="group" aria-label="${escapeHtml(label)}">
```

Do not change lines that construct `image`, `body`, `auditAttrs`, linked cards,
muted cards, or the `.map(...).join("")` grid. Delete only the
`.press-preview-title` CSS block. Retain `.press-preview`, its divider/padding,
every card style, and all audit attributes.

- [x] **Step 4: Run focused and full tests to verify GREEN**

```bash
node --test --test-name-pattern="work Press keeps entry labels" tests/build-site.test.mjs
npm test
```

Expected: PASS; global `PRESS` and its title remain unchanged.

- [x] **Step 5: Commit the semantic Press package**

```bash
git add tests/build-site.test.mjs scripts/build-site.mjs src/styles.css
git commit -m "hide redundant work press heading"
```

### Task 4: Add the shared 1.4-second Featured reel lifecycle with TDD

**Files:**
- Modify: `tests/build-site.test.mjs`
- Modify: `scripts/build-site.mjs:208-232`
- Modify: `src/main.js:213-290`

- [x] **Step 1: Write failing markup and lifecycle assertions**

Assert five exact Featured videos, approved mode, poster, lazy preload, and
unchanged navigation:

```js
test("all approved Featured reels hold their existing poster before muted playback", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const html = renderPage({ lang: "en", site, works });
  const reels = html.match(/<video[\s\S]*?data-featured-reel-video[\s\S]*?<\/video>/g) || [];

  assert.equal(reels.length, 5);
  for (const reel of reels) {
    assert.match(reel, /data-featured-reel-mode="after-hold"/);
    assert.match(reel, /muted[\s\S]*loop[\s\S]*playsinline/);
    assert.match(reel, /preload="none"/);
    assert.match(reel, /poster="[^"]+"/);
  }
  assert.match(html, /id="tech-dreamers"[\s\S]*?href="https:\/\/www\.taiwanplus\.com\/shows\/documentary\/business-and-tech\/590\/tech-dreamers"/);
  assert.match(html, /id="my-art-my-voice"[\s\S]*?href="https:\/\/www\.taiwanplus\.com\/shows\/documentary\/arts\/410\/my-art-my-voice\/250220001\/whats-the-vibe-in-taiwan-my-art-my-voice"/);
  assert.match(html, /<article class="work-panel" id="slow-steps">[\s\S]*?<div class="media-frame media-frame-unlabeled"/);
});
```

In the existing source-structure test, require:

```js
assert.match(js, /const FEATURED_REEL_HOLD_MS = 1400;/);
assert.match(js, /const featuredReelTimers = new Map\(\);/);
assert.match(js, /function clearFeaturedReelTimer\(video\)/);
assert.match(js, /setTimeout\(\(\) => playFeaturedReel\(video\), FEATURED_REEL_HOLD_MS\)/);
assert.match(js, /video === activeFeaturedReel[\s\S]*?scheduleFeaturedReel\(video\)[\s\S]*?resetFeaturedReel\(video\)/);
assert.match(js, /function resetFeaturedReel\(video\) \{[\s\S]*?clearFeaturedReelTimer\(video\)/);
```

- [x] **Step 2: Run focused tests and verify RED**

```bash
node --test --test-name-pattern="all approved Featured reels|scroll-stack works" tests/build-site.test.mjs
```

Expected: FAIL because the renderer accepts only `in-view`, emits
`preload="metadata"`, and JavaScript plays immediately.

- [x] **Step 3: Update the Featured reel markup**

Change approval and attributes to:

```js
const hasApprovedFeaturedReel =
  work.featuredReelMode === "after-hold" &&
  work.featuredReelUrl &&
  work.featuredReelPoster;
```

The `<video>` must include:

```html
data-featured-reel-video
data-featured-reel-mode="after-hold"
muted loop playsinline webkit-playsinline preload="none"
```

Keep the existing poster, `aria-hidden`, `tabindex`, source, and
pointer-event ownership.

- [x] **Step 4: Add hold timers without changing one-active-reel selection**

Add beside the Featured controller:

```js
const FEATURED_REEL_HOLD_MS = 1400;
const featuredReelTimers = new Map();

function clearFeaturedReelTimer(video) {
  const timer = featuredReelTimers.get(video);
  if (timer) clearTimeout(timer);
  featuredReelTimers.delete(video);
}

function scheduleFeaturedReel(video) {
  if (featuredReelTimers.has(video) || !video.paused) return;
  if (document.visibilityState !== "visible") {
    resetFeaturedReel(video);
    return;
  }
  const timer = setTimeout(() => playFeaturedReel(video), FEATURED_REEL_HOLD_MS);
  featuredReelTimers.set(video, timer);
}
```

Call `clearFeaturedReelTimer(video)` first in both `resetFeaturedReel` and
`playFeaturedReel`. In `syncActiveFeaturedReel`, replace direct play with
`scheduleFeaturedReel(video)`. Preserve the 35% observer threshold, last-visible
selection, `playing`-class fade, error fallback, visibility reset, and
`pagehide` cleanup.

- [x] **Step 5: Run focused and full tests to verify GREEN**

```bash
node --test --test-name-pattern="all approved Featured reels|scroll-stack works" tests/build-site.test.mjs
npm test
```

Expected: PASS; exactly five Featured reels render and only the active one is
scheduled.

- [x] **Step 6: Commit the interaction package**

```bash
git add tests/build-site.test.mjs scripts/build-site.mjs src/main.js
git commit -m "hold featured posters before reel playback"
```

### Task 5: Align the current design contract and design handoff

**Files:**
- Modify: `docs/design-contract.md`
- Modify: `PROJECT_BIBLE.md`
- Modify only if generated: `figma-export/01-desktop-home.svg`
- Modify only if generated: `figma-export/02-desktop-works-logos.svg`
- Modify only if generated: `figma-export/03-mobile-home.svg`
- Modify only if generated: `figma-export/README.md`
- Test: `tests/figma-export.test.mjs`

- [x] **Step 1: Update current rules, not historical reviews**

Add to Featured Work:

```markdown
Approved Featured reels use `featuredReelMode: "after-hold"`. At 35% visibility,
only the last visible reel becomes active; its existing poster holds for 1.4
seconds and remains until `playing`. Leaving view, hiding the page, a media
error, reduced motion, or no JavaScript restores the poster.
```

Change Work Press to state:

```markdown
The group name is semantic-only. Each thumbnail card's type is its visible
classification; do not render a second `PRESS & INTERVIEWS` field heading.
```

Add the same operational rules to `PROJECT_BIBLE.md` under Work Navigation and
Press Cards. Do not rewrite dated review/spec files.

- [x] **Step 2: Rebuild Figma references and prove poster parity**

```bash
npm run figma:export
shasum -a 256 figma-export/01-desktop-home.svg figma-export/02-desktop-works-logos.svg figma-export/03-mobile-home.svg figma-export/README.md
```

Expected hashes remain:

```text
818a95fd1b41f5d84ac30842887f564c2f83d60ba3b7769255a3e0789373647e
8368e496d283f47a2fd73742f24dc46512275e251be6caf500c448a623a8a03f
43ecb8b502fe606505a5fa4a590a03d0b3da8091377acd9146bf8e65e8564e06
1a91858e1c323a7e76e7e1015b05cbc50f8005658628cf686ea4c4284668f625
```

If any hash differs, stop and inspect the generated diff; this package does
not approve a poster, geometry, copy, or Figma title-layer change.

- [x] **Step 3: Run contract and Figma gates**

```bash
npm run audit:design-contract
node --test tests/portfolio-contract.test.mjs tests/figma-export.test.mjs
git diff --check
```

Expected: PASS, no unclassified reel evidence, and no Figma drift.

- [x] **Step 4: Commit the current-rule alignment**

```bash
git add docs/design-contract.md PROJECT_BIBLE.md
git commit -m "document featured reel and implicit press rules"
```

### Task 6: Run deterministic, privacy, and browser validation

**Files:**
- Create temporary QA evidence outside the repository only.
- Do not modify Production or Vercel.

- [x] **Step 1: Run the complete deterministic gate**

```bash
npm test
npm run audit:design-contract
npm run build
npm run figma:export
git diff --check
private_home='/''Users/'
remote_attachment_root='/tmp/''codex-remote-attachments'
if git grep -n -I -E "${private_home}|${remote_attachment_root}"; then exit 1; fi
```

Expected: all tests pass; audit/build/export pass; privacy search returns no
tracked match. Generated `dist/` contains all three new reels.

- [x] **Step 2: Record exact derived-media evidence**

```bash
for reel in \
  public/assets/showreel/slow-steps-card-reel.mp4 \
  public/assets/showreel/tech-dreamers-card-reel.mp4 \
  public/assets/showreel/my-art-my-voice-card-reel.mp4; do
  ffprobe -v error \
    -show_entries format=filename,duration,size,bit_rate:stream=codec_name,codec_type,width,height,pix_fmt,color_space,color_transfer,color_primaries \
    -of json "$reel"
done
shasum -a 256 public/assets/showreel/slow-steps-card-reel.mp4 public/assets/showreel/tech-dreamers-card-reel.mp4 public/assets/showreel/my-art-my-voice-card-reel.mp4
```

Expected: video-only H.264/yuv420p/BT.709, 1280×720, full durations, and three
stable output hashes ready for the closeout report.

- [x] **Step 3: Start an identified local preview on a free port**

```bash
lsof -nP -iTCP:4873 -sTCP:LISTEN
python3 -m http.server 4873 -d dist
```

If the first command shows an unknown listener, leave it untouched and use
port `4874`. Verify the served English HTML contains
`slow-steps-card-reel.mp4` before browser capture.

- [x] **Step 4: Validate the bilingual viewport matrix**

Using the current browser-testing skill, inspect English and Chinese at:

- 1440×900
- 1200×900
- 834×1112
- 390×844
- 360×800

At each relevant Featured card, verify poster identity, unchanged geometry,
no visible work-Press group heading, visible entry type, and unchanged external
link. On a representative reel, assert the poster remains at 1.0 s, video fades
in only after playback starts following the 1.4 s hold, and leaving/re-entering
restarts from poster/time zero. Scroll so two cards cross the threshold and
confirm only the last visible reel plays.

- [x] **Step 5: Validate fallbacks and accessibility**

Check reduced motion, JavaScript disabled, keyboard-only focus, page visibility
reset, media-error poster fallback, horizontal overflow, and the semantic
`role="group"`/localized `aria-label`. Confirm Slow Steps remains non-linked;
Tech Dreamers and My Art, My Voice retain their TaiwanPlus destinations.

- [x] **Step 6: Attempt matched screenshot comparison; blocked by Vercel SSO and carried as the recorded open item**

Compare desktop and mobile Featured screenshots with the approved pre-package
baseline. Allowed differences are only reel motion after the hold and removal
of the visible work-Press group heading. Treat every poster, crop, panel size,
copy, item card, or external-link difference as a regression.

The required attempt was completed, but the historical Preview redirected all
unauthenticated cases through Vercel SSO. No portfolio DOM, matched Featured
screenshots, geometry/crop comparison, or pixel statistics were available.
This remains the accepted external open item recorded in
[`docs/reviews/featured-preview-reels-and-implicit-press-v1-2026-08-03.md`](../../reviews/featured-preview-reels-and-implicit-press-v1-2026-08-03.md).

### Task 7: Close the local package and hand it back for review

**Files:**
- Create: `docs/reviews/featured-preview-reels-and-implicit-press-v1-2026-08-03.md`
- Modify: `STATUS.md`
- Modify: `docs/superpowers/plans/2026-08-03-featured-preview-reels-and-implicit-press.md`

- [x] **Step 1: Write the dated local validation report**

Record:

- the base and final branch commit;
- three source filenames/hashes without external paths;
- a link to the exact durable ffmpeg recipe at
  [`showreel/featured-preview-reels/README.md`](../../../showreel/featured-preview-reels/README.md),
  plus three output hashes/sizes/durations;
- data/contract, Press, interaction, Figma, privacy, browser, reduced-motion,
  no-JS, keyboard, and link results;
- the unchanged local poster/link proof, and explicit classification of matched
  geometry/crop proof as unavailable/open rather than completed proof;
- the protected user file remaining untouched;
- no Preview/Production deployment and no contact submission.

Set `PASS` only if every required gate passed. Use `PASS_WITH_OPEN_ITEMS` if a
non-blocking review item remains, and `BLOCKED` for a missing source, failed
media contract, regression, or privacy failure.

- [x] **Step 2: Update the mutable status entry point**

Set the current package, branch, checkpoints, local validation state, latest
existing Vercel Preview metadata, accepted open items, protected file, and exact
next action. The exact next action is user review of the local build; do not
claim deployment or local-main integration.

- [x] **Step 3: Mark every completed plan checkbox and run final gates**

```bash
npm test
npm run audit:design-contract
npm run build
npm run figma:export
git diff --check
git status --short
```

Expected: all gates pass; only the protected user file remains untracked before
the closeout commit.

All package-execution checkboxes may be complete while the accepted external
matched-comparison open item remains explicitly recorded; checkbox completion
does not convert that unavailable evidence into a pass.

- [x] **Step 4: Commit the closeout package**

```bash
git add docs/reviews/featured-preview-reels-and-implicit-press-v1-2026-08-03.md STATUS.md docs/superpowers/plans/2026-08-03-featured-preview-reels-and-implicit-press.md
git commit -m "close featured preview reel package"
```

- [x] **Step 5: Stop before deployment or merge**

Report the local preview URL, final commit, validation results, three output
sizes, and the one known link state: Slow Steps has no public destination.
Wait for explicit approval before creating a new Vercel Preview, changing
Production, or merging this branch back to local `main`.
