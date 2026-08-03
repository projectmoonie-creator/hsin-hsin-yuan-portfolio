# Top Gear China Featured Preview Reel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce and integrate a silent 30-second Top Gear China Featured preview reel that follows the approved cross-border-story plus action structure and includes aircraft footage.

**Architecture:** Keep the existing Featured renderer, poster-first lifecycle, card layout, and external YouTube destination unchanged. Add one deterministic H.264 derivative and one complete canonical reel/provenance record; use the existing content loader and media tests rather than introducing a second media registry or runtime path.

**Tech Stack:** Node.js test runner, Markdown JSON frontmatter, FFmpeg/ffprobe, H.264 MP4, existing static-site generator, existing Featured reel lifecycle, media-use ledger, local browser QA.

---

## File Map

- Modify `content/works/top-gear-china-uk-special.md` — canonical public reel
  triplet and evidence-only source provenance.
- Modify `tests/portfolio-contract.test.mjs` — six-work reel contract and exact
  Top Gear canonical record.
- Modify `tests/build-site.test.mjs` — Top Gear renderer fields, canonical
  poster, and unchanged YouTube destination.
- Create `public/assets/showreel/top-gear-china-uk-special-card-reel.mp4` —
  silent public derivative only.
- Modify `tests/media-assets.test.mjs` — exact derivative checksum, byte size,
  duration, faststart order, stream count, codec, dimensions, pixel format, and
  BT.709 assertions.
- Modify `showreel/featured-preview-reels/README.md` — source evidence, exact
  eight-cut edit, reproducible environment-based command, and output evidence.
- Modify `docs/superpowers/specs/2026-08-03-top-gear-featured-preview-reel-design.md`
  — record written approval and final implementation head at closeout.
- Modify `STATUS.md` — current task state, verification, open items, and exact
  next action.
- Create `docs/reviews/top-gear-featured-preview-reel-v1-2026-08-03.md` — dated
  closeout and review boundary.

The protected untracked file
`docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md` is excluded
from every command and commit.

### Task 1: Lock The Canonical Top Gear Reel Contract

**Files:**
- Modify: `tests/portfolio-contract.test.mjs`
- Modify: `tests/build-site.test.mjs`
- Modify: `content/works/top-gear-china-uk-special.md`

- [ ] **Step 1: Write the failing canonical-data tests**

Rename the portfolio-contract test to `six Featured works declare the approved
poster-first reel contract`, then add this exact record after
`pts-taigi-bus`:

```js
["top-gear-china-uk-special", {
  featuredReelMode: "after-hold",
  featuredReelUrl: "/assets/showreel/top-gear-china-uk-special-card-reel.mp4",
  featuredReelPoster: "/assets/portfolio/top-gear-uk-special-car.jpg",
  featuredReelSourceFilename: "巅峰拍挡第2季第5期20151116 巅峰拍挡之开着自行火炮闯英国 Top Gear China II EP.5东方卫视官方超清.mp4",
  featuredReelSourceSha256: "4ba65130c3c172ffff40851ee83e05db494be261b1e50527576f5b9fcda2c955",
  featuredReelSourceDuration: 3195.04254,
  featuredReelSourceDimensions: { width: 1920, height: 1080 },
  featuredReelRightsStatus: "user-supplied-local-source",
}],
```

Add these assertions to the existing `loadWorks` test immediately after the
Top Gear description assertions:

```js
assert.equal(works[5].featuredReelMode, "after-hold");
assert.equal(
  works[5].featuredReelUrl,
  "/assets/showreel/top-gear-china-uk-special-card-reel.mp4",
);
assert.equal(works[5].featuredReelPoster, works[5].posterImage);
assert.equal(
  works[5].watchUrl,
  "https://youtu.be/M_eXe9HRD9Y?si=YZ_3JZ7FJY4vVcZv",
);
```

- [ ] **Step 2: Run the focused tests and confirm the intended failure**

Run:

```bash
node --test tests/portfolio-contract.test.mjs tests/build-site.test.mjs
```

Expected: FAIL because Top Gear does not yet declare `featuredReelUrl` and the
reel-work slug list still contains only five items.

- [ ] **Step 3: Add the complete canonical record**

Insert these fields after `posterImage` in
`content/works/top-gear-china-uk-special.md`:

```json
"featuredReelMode": "after-hold",
"featuredReelUrl": "/assets/showreel/top-gear-china-uk-special-card-reel.mp4",
"featuredReelPoster": "/assets/portfolio/top-gear-uk-special-car.jpg",
"featuredReelSourceFilename": "巅峰拍挡第2季第5期20151116 巅峰拍挡之开着自行火炮闯英国 Top Gear China II EP.5东方卫视官方超清.mp4",
"featuredReelSourceSha256": "4ba65130c3c172ffff40851ee83e05db494be261b1e50527576f5b9fcda2c955",
"featuredReelSourceDuration": 3195.04254,
"featuredReelSourceDimensions": {"width": 1920, "height": 1080},
"featuredReelRightsStatus": "user-supplied-local-source",
```

Do not change `posterImage`, `watchUrl`, `presentation`, title, copy, metrics,
tags, order, or card layout.

- [ ] **Step 4: Run the focused tests and confirm they pass**

Run:

```bash
node --test tests/portfolio-contract.test.mjs tests/build-site.test.mjs
```

Expected: all focused tests PASS.

- [ ] **Step 5: Commit the canonical contract**

```bash
git add content/works/top-gear-china-uk-special.md tests/portfolio-contract.test.mjs tests/build-site.test.mjs
git commit -m "add top gear featured reel contract"
```

### Task 2: Build The Approved Eight-Cut Derivative

**Files:**
- Modify: `tests/media-assets.test.mjs`
- Create: `public/assets/showreel/top-gear-china-uk-special-card-reel.mp4`

- [ ] **Step 1: Add a failing derivative-presence test**

Append this temporary test to `tests/media-assets.test.mjs`; it is folded into
the exact manifest test in Task 3 rather than committed as duplicate coverage:

```js
test("Top Gear Featured derivative satisfies the provisional web contract", () => {
  const filePath = join(
    process.cwd(),
    "public/assets/showreel/top-gear-china-uk-special-card-reel.mp4",
  );
  assert.equal(existsSync(filePath), true);
  const probe = JSON.parse(execFileSync("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration:stream=codec_name,codec_type,width,height,pix_fmt,color_space,color_transfer,color_primaries",
    "-of", "json",
    filePath,
  ], { encoding: "utf8" }));
  assert.equal(probe.streams.length, 1);
  assert.deepEqual(
    probe.streams.map((stream) => stream.codec_type),
    ["video"],
  );
  assert.equal(probe.streams[0].codec_name, "h264");
  assert.equal(probe.streams[0].width, 1280);
  assert.equal(probe.streams[0].height, 720);
  assert.equal(probe.streams[0].pix_fmt, "yuv420p");
  assert.equal(probe.streams[0].color_space, "bt709");
  assert.equal(probe.streams[0].color_transfer, "bt709");
  assert.equal(probe.streams[0].color_primaries, "bt709");
  assert.ok(Math.abs(Number(probe.format.duration) - 30) < 0.2);
});
```

- [ ] **Step 2: Run the test and confirm the file-missing failure**

Run:

```bash
node --test tests/media-assets.test.mjs
```

Expected: FAIL at `existsSync(filePath)` for the new Top Gear derivative.

- [ ] **Step 3: Verify the exact local source before encoding**

Resolve the current source directory into the session-only variable
`TOP_GEAR_SOURCE_DIR`, then run:

```bash
TOP_GEAR_SOURCE="${TOP_GEAR_SOURCE_DIR}/巅峰拍挡第2季第5期20151116 巅峰拍挡之开着自行火炮闯英国 Top Gear China II EP.5东方卫视官方超清.mp4"
shasum -a 256 "$TOP_GEAR_SOURCE"
ffprobe -v error -show_entries format=duration:stream=codec_name,codec_type,width,height,pix_fmt,color_space,color_transfer,color_primaries -of json "$TOP_GEAR_SOURCE"
```

Expected SHA-256:
`4ba65130c3c172ffff40851ee83e05db494be261b1e50527576f5b9fcda2c955`.
Expected source video: H.264, 1920×1080, yuv420p, BT.709; one AAC audio
stream; duration `3195.042540` seconds.

- [ ] **Step 4: Encode the exact approved 30-second sequence**

Run from the repository root with the same session variable:

```bash
ffmpeg -hide_banner -i "$TOP_GEAR_SOURCE" \
  -filter_complex "[0:v]trim=start=52:end=55.5,setpts=PTS-STARTPTS[v0];[0:v]trim=start=221.5:end=225,setpts=PTS-STARTPTS[v1];[0:v]trim=start=576:end=580,setpts=PTS-STARTPTS[v2];[0:v]trim=start=957.60:end=960.60,setpts=PTS-STARTPTS[v3];[0:v]trim=start=1678:end=1682,setpts=PTS-STARTPTS[v4];[0:v]trim=start=2014:end=2018,setpts=PTS-STARTPTS[v5];[0:v]trim=start=2399.28:end=2403.28,setpts=PTS-STARTPTS[v6];[0:v]trim=start=2035:end=2039,setpts=PTS-STARTPTS[v7];[v0][v1][v2][v3][v4][v5][v6][v7]concat=n=8:v=1:a=0,scale=1280:720:flags=lanczos,fps=25,format=yuv420p[v]" \
  -map "[v]" \
  -c:v libx264 -preset slow -crf 22 -maxrate 2800k -bufsize 5600k \
  -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -movflags +faststart -an -y \
  public/assets/showreel/top-gear-china-uk-special-card-reel.mp4
```

The cuts total exactly 30 seconds: `3.5 + 3.5 + 4 + 3 + 4 + 4 + 4 + 4`.
The editorial order is London/hosts, microcar reveal, London driving,
architectural movement, a British-estate vehicle exchange, sports-car action,
an aircraft exterior and cockpit exchange, and a road-action loop close.
After quality review, the fourth range was advanced from `957.5–960.5` to
`957.60–960.60` and the seventh from `2399–2403` to `2399.28–2403.28` to
exclude brief embedded source-shot flashes while preserving each cut's length.

- [ ] **Step 5: Inspect the actual moving draft and contact sheet**

Generate one labeled early/middle/late contact sheet in `/private/tmp` and play
the complete derivative locally. Confirm all eight roles are present, the
aircraft is clearly visible, there is no studio-summary ending, source graphics
are intact, hard cuts do not expose black frames, and the final road movement
loops acceptably into the London opening. Do not add transitions or extra
graphics during this inspection.

- [ ] **Step 6: Run the provisional media test**

```bash
node --test tests/media-assets.test.mjs
```

Expected: both the existing exact Featured derivative test and the provisional
Top Gear test PASS.

### Task 3: Lock Exact Media Evidence And Reproducibility

**Files:**
- Modify: `tests/media-assets.test.mjs`
- Modify: `showreel/featured-preview-reels/README.md`
- Verify: `public/assets/showreel/top-gear-china-uk-special-card-reel.mp4`

- [ ] **Step 1: Capture exact output evidence**

Run:

```bash
stat -f '%z' public/assets/showreel/top-gear-china-uk-special-card-reel.mp4
shasum -a 256 public/assets/showreel/top-gear-china-uk-special-card-reel.mp4
ffprobe -v error -show_entries format=duration,size:stream=codec_name,codec_type,width,height,pix_fmt,color_space,color_transfer,color_primaries,avg_frame_rate -of json public/assets/showreel/top-gear-china-uk-special-card-reel.mp4
ffmpeg -v error -i public/assets/showreel/top-gear-china-uk-special-card-reel.mp4 -map 0:v:0 -f null -
```

Expected: full decode exits 0; one video stream, no audio, H.264, 1280×720,
yuv420p, BT.709; duration within 0.2 seconds of 30.

- [ ] **Step 2: Replace provisional coverage with exact manifest coverage**

Delete the temporary provisional Top Gear test. Add
`top-gear-china-uk-special-card-reel.mp4` to the existing `expected` Map in
`Featured preview derivatives are complete silent 720p H.264 BT.709 files`.
Use the literal decimal byte size, lowercase 64-character SHA-256, and numeric
duration emitted by Step 1. The committed Map entry must contain those exact
literals; it must not compute its own expected values from the file or an
environment variable.

Run:

```bash
node --test tests/media-assets.test.mjs
```

Expected: PASS, including exact size, exact SHA-256, faststart atom order,
single-stream, codec, dimensions, pixel format, color tags, and duration.

- [ ] **Step 3: Extend the reproducible media ledger**

In `showreel/featured-preview-reels/README.md`:

1. Add the approved basename, source SHA-256, source duration, and dimensions.
2. Add the exact eight in/out ranges from Task 2 in editorial order.
3. Add the exact environment-based FFmpeg command from Task 2.
4. Add the exact output duration, byte size, SHA-256, stream metadata, and
   successful full-decode result from Step 1.

Do not record the absolute Downloads path.

- [ ] **Step 4: Register the derivative in the ignored media-use ledger**

Resolve the current `media-use` skill directory from the active catalog into
the session-only variable `MEDIA_USE_SKILL_DIR`, then run:

```bash
node "$MEDIA_USE_SKILL_DIR/scripts/resolve.mjs" \
  --from public/assets/showreel/top-gear-china-uk-special-card-reel.mp4 \
  --type video \
  --project showreel/featured-preview-reels
```

Expected: one `resolved video_*` record. Confirm the resulting `.media/` ledger
remains ignored and is absent from `git status`.

- [ ] **Step 5: Commit the derivative and exact evidence**

```bash
git add public/assets/showreel/top-gear-china-uk-special-card-reel.mp4 tests/media-assets.test.mjs showreel/featured-preview-reels/README.md
git commit -m "add top gear featured preview reel"
```

### Task 4: Verify Generated Output And Existing Design Contracts

**Files:**
- Verify: generated `dist/en/index.html`
- Verify: generated `dist/zh/index.html`
- Verify: `figma/*.svg` and Figma README fingerprints

- [ ] **Step 1: Run all deterministic gates**

```bash
npm test
npm run audit:design-contract
npm run build
npm run figma:export
git diff --check
```

Expected: all tests pass; the design audit reports 6 Featured works; build and
Figma export exit 0; diff check is clean.

- [ ] **Step 2: Verify exact generated Top Gear markup**

Search both generated languages and confirm:

- one Top Gear `<video>` uses the new local MP4;
- poster remains `/assets/portfolio/top-gear-uk-special-car.jpg`;
- video remains muted, looped, inline, `preload="none"`, and non-interactive;
- wrapper destination remains the exact existing YouTube URL;
- no new site title overlay is rendered;
- no source filename, checksum, absolute path, or rights evidence leaks into
  public HTML.

- [ ] **Step 3: Confirm Figma remains poster-based and unchanged**

Run SHA-256 on the four current Figma handoff artifacts and compare them with
the accepted hashes in the preceding package. Expected: all four hashes remain
exact because the Top Gear poster, focal treatment, content copy, and layout
are unchanged. `git diff -- figma` must be empty.

### Task 5: Run Browser QA And Close The Local Package

**Files:**
- Create: `docs/reviews/top-gear-featured-preview-reel-v1-2026-08-03.md`
- Modify: `docs/superpowers/specs/2026-08-03-top-gear-featured-preview-reel-design.md`
- Modify: `STATUS.md`

- [ ] **Step 1: Start an isolated local preview**

Confirm port 4873 is free, then serve the intended worktree's `dist` directory:

```bash
python3 -m http.server 4873 -d dist
```

Verify the served English and Chinese HTML contain the Top Gear reel asset
before browser inspection. If port 4873 is occupied by an unknown process,
leave it alone and choose another unused high port.

- [ ] **Step 2: Run the functional and visual matrix**

Use the current canonical web-app testing/browser workflow on English and
Chinese pages at 1440×900, 1200×900, 834×1112, 390×844, and 360×800. Confirm:

- current poster appears first;
- it remains visible before the 1.4-second hold completes;
- the actual current `playing` event reveals the Top Gear reel;
- leaving and re-entering resets to time zero and permits a new activation;
- only the last eligible Featured reel in DOM order plays;
- reduced-motion and no-JavaScript remain static posters;
- keyboard activation and focus stay on the existing linked wrapper;
- the exact YouTube destination is retained;
- 16:9 media remains centered without overflow;
- no request posts to `/api/contact`.

- [ ] **Step 3: Record closeout evidence and boundaries**

Create the dated review with branch, base, implementation commits, exact media
source/output evidence, deterministic results, browser matrix, Figma hashes,
privacy checks, protected-file hash, open items, rollback, and explicit
non-actions. State that no Vercel Preview, Production deployment, push, main
merge, Contact submission, or external message occurred.

Update the design spec status to implemented and reviewed. Update `STATUS.md`
with the exact implementation head, current local-preview URL if still active,
verification results, open items, and the next user decision.

- [ ] **Step 4: Run final hygiene checks**

```bash
git diff --check
git status -sb
rg -n 'Downloads/' content scripts src tests showreel docs/reviews/top-gear-featured-preview-reel-v1-2026-08-03.md docs/superpowers/specs/2026-08-03-top-gear-featured-preview-reel-design.md STATUS.md
node --test tests/build-site.test.mjs
```

Expected: no private absolute source path in tracked package files; only
intentional historical or negative-test matches elsewhere; the protected
untracked review file remains untouched and unstaged.

- [ ] **Step 5: Commit closeout documentation**

```bash
git add STATUS.md docs/superpowers/specs/2026-08-03-top-gear-featured-preview-reel-design.md docs/reviews/top-gear-featured-preview-reel-v1-2026-08-03.md
git commit -m "close top gear featured reel package"
```

Stop the managed preview server only after QA is recorded. Preserve the
feature branch and worktree for user review; do not deploy, push, merge, or
delete the branch without a later explicit instruction.
