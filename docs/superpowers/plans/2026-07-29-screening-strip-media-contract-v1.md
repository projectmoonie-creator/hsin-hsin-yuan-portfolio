# Screening Strip Media Contract v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make screening-strip cards static-first and play only explicitly approved work-specific reels after a 1400 ms poster hold.

**Architecture:** Keep the existing canonical work frontmatter, build generator, continuous-loop runtime, and CSS structure. Add one fail-closed `cardReelMode` data field, render videos only for the approved mode, and give the existing intersection observer a cancellable poster-hold lifecycle that reveals video only after confirmed playback.

**Tech Stack:** Node.js ESM, built-in `node:test`, generated static HTML, vanilla browser JavaScript, CSS, Python Playwright for visual and interaction QA.

---

## File Map

- `content/works/interior-spatial-brand-films.md`: explicitly approve its existing work-specific reel.
- `content/works/pts-taigi-bus.md`: explicitly approve its existing work-specific reel.
- `scripts/build-site.mjs`: enforce the fail-closed render contract.
- `src/main.js`: own the 1400 ms hold, cancellation, reset, and confirmed-play reveal.
- `src/styles.css`: keep posters visible until playback is confirmed.
- `tests/build-site.test.mjs`: deterministic data, markup, CSS, JavaScript, and build regressions.
- `PROJECT_BIBLE.md`: record the canonical screening-strip media rule.
- `STATUS.md`: record the active package result and remaining next action.

### Task 1: Explicit Reel Opt-In And Fail-Closed Rendering

**Files:**
- Modify: `tests/build-site.test.mjs`
- Modify: `content/works/interior-spatial-brand-films.md`
- Modify: `content/works/pts-taigi-bus.md`
- Modify: `scripts/build-site.mjs`

- [x] **Step 1: Write the failing data assertions**

Add these assertions to `loadWorks returns ordered bilingual portfolio works`:

```js
assert.equal(works[3].cardReelMode, "after-hold");
assert.equal(works[4].cardReelMode, "after-hold");
```

- [x] **Step 2: Write the failing render-contract test**

Add:

```js
test("screening strip renders reels only for explicit after-hold opt-in", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const html = renderPage({ lang: "en", site, works });

  assert.match(html, /data-card-reel-mode="after-hold"/);

  const staticWorks = works.map((work) => {
    const staticWork = { ...work };
    delete staticWork.cardReelMode;
    return staticWork;
  });
  const staticHtml = renderPage({ lang: "en", site, works: staticWorks });

  assert.doesNotMatch(
    staticHtml,
    /src="\/assets\/showreel\/interior-spatial-card-reel\.mp4"/,
  );
  assert.doesNotMatch(
    staticHtml,
    /src="\/assets\/showreel\/nothing-by-bus-card-reel\.mp4"/,
  );
  assert.match(
    staticHtml,
    /href="#interior-spatial-brand-films" style="background-image:[\s\S]*?gorgeous-space-lg-sunny-wang\.webp/,
  );
});
```

- [x] **Step 3: Run the focused tests and verify RED**

Run:

```bash
node --test --test-name-pattern "loadWorks|screening strip renders" tests/build-site.test.mjs
```

Expected: FAIL because `cardReelMode` and the rendered
`data-card-reel-mode="after-hold"` contract do not exist.

- [x] **Step 4: Add explicit approval to the two canonical work files**

Place this field beside each existing `cardReelUrl`:

```json
"cardReelMode": "after-hold",
```

- [x] **Step 5: Implement fail-closed rendering**

In `renderWatchLoopItem`, derive:

```js
const hasApprovedCardReel =
  work.cardReelMode === "after-hold" &&
  work.cardReelUrl &&
  poster;
```

Render `<video>` only when `hasApprovedCardReel` is truthy and add:

```html
data-card-reel-mode="after-hold"
```

Keep `poster`, `muted`, `loop`, `playsinline`, `preload="metadata"`,
`aria-hidden="true"`, and `tabindex="-1"` unchanged.

- [x] **Step 6: Re-run the focused tests and verify GREEN**

Run the command from Step 3.

Expected: both focused tests PASS.

- [x] **Step 7: Commit the data and render contract**

```bash
git add tests/build-site.test.mjs content/works/interior-spatial-brand-films.md content/works/pts-taigi-bus.md scripts/build-site.mjs
git commit -m "Gate screening strip reels behind explicit approval"
```

### Task 2: Poster Hold And Playback Lifecycle

**Files:**
- Modify: `tests/build-site.test.mjs`
- Modify: `src/main.js`
- Modify: `src/styles.css`

- [x] **Step 1: Write failing CSS and JavaScript source-contract assertions**

In `build generates English, Chinese, CSS, and JS assets`, add:

```js
assert.match(
  css,
  /\.watch-loop-video \{[\s\S]*?opacity: 0;[\s\S]*?transition: opacity 260ms ease;/,
);
assert.match(
  css,
  /\.watch-loop-video\.is-playing \{[\s\S]*?opacity: 1;/,
);
assert.match(js, /const WATCH_LOOP_REEL_HOLD_MS = 1400;/);
assert.match(js, /const watchLoopVideoTimers = new WeakMap\(\);/);
assert.match(js, /window\.setTimeout/);
assert.match(js, /window\.clearTimeout/);
assert.match(js, /video\.currentTime = 0;/);
assert.match(js, /video\.classList\.add\("is-playing"\)/);
assert.match(js, /video\.classList\.remove\("is-playing"\)/);
assert.match(js, /video\.addEventListener\("playing"/);
```

- [x] **Step 2: Run the focused build test and verify RED**

Run:

```bash
node --test --test-name-pattern "build generates" tests/build-site.test.mjs
```

Expected: FAIL because the hold timer and opacity lifecycle do not exist.

- [x] **Step 3: Add the static-first CSS state**

Extend `.watch-loop-video` with:

```css
opacity: 0;
transition: opacity 260ms ease;
```

Add:

```css
.watch-loop-video.is-playing {
  opacity: 1;
}
```

Keep the existing reduced-motion `display: none` rule.

- [x] **Step 4: Add cancellable hold helpers**

Near the watch-loop setup in `src/main.js`, add:

```js
const WATCH_LOOP_REEL_HOLD_MS = 1400;
const watchLoopVideoTimers = new WeakMap();
```

Inside each watch-loop initialization, add helpers with these responsibilities:

```js
function clearWatchLoopVideoHold(video) {
  const timer = watchLoopVideoTimers.get(video);
  if (!timer) return;
  window.clearTimeout(timer);
  watchLoopVideoTimers.delete(video);
}

function resetWatchLoopVideo(video) {
  clearWatchLoopVideoHold(video);
  video.dataset.watchLoopVisible = "false";
  video.classList.remove("is-playing");
  video.pause();
  try {
    video.currentTime = 0;
  } catch {
    // The poster remains visible if media metadata is not ready.
  }
}

function scheduleWatchLoopVideo(video) {
  clearWatchLoopVideoHold(video);
  video.dataset.watchLoopVisible = "true";
  video.classList.remove("is-playing");
  const timer = window.setTimeout(() => {
    watchLoopVideoTimers.delete(video);
    if (
      video.dataset.watchLoopVisible !== "true" ||
      document.visibilityState !== "visible"
    ) {
      return;
    }
    video.play().catch(() => resetWatchLoopVideo(video));
  }, WATCH_LOOP_REEL_HOLD_MS);
  watchLoopVideoTimers.set(video, timer);
}
```

- [x] **Step 5: Route observer and lifecycle events through the helpers**

Change the video intersection observer so qualifying entries call
`scheduleWatchLoopVideo(video)` and non-qualifying entries call
`resetWatchLoopVideo(video)`.

When a video is first observed, add:

```js
video.addEventListener("playing", () => {
  if (video.dataset.watchLoopVisible === "true") {
    video.classList.add("is-playing");
  } else {
    resetWatchLoopVideo(video);
  }
});
video.addEventListener("error", () => resetWatchLoopVideo(video));
```

Use `resetWatchLoopVideo` for document hiding, loop cleanup, page hiding, and
removed clone sequences. Do not introduce autoplay when
`IntersectionObserver` is unavailable.

- [x] **Step 6: Re-run the focused build test and verify GREEN**

Run the command from Step 2.

Expected: PASS with generated CSS and JavaScript containing the complete
poster-hold lifecycle.

- [x] **Step 7: Commit the motion lifecycle**

```bash
git add tests/build-site.test.mjs src/main.js src/styles.css
git commit -m "Delay screening strip reels behind poster hold"
```

### Task 3: Canonical Documentation And Resume State

**Files:**
- Modify: `PROJECT_BIBLE.md`
- Modify: `STATUS.md`

- [x] **Step 1: Update the canonical media rule**

Revise the Work Navigation rule to state:

```md
Use `cardReelUrl` only for a silent, work-specific moving thumbnail,
`cardReelPoster` for its static fallback, and
`cardReelMode: "after-hold"` for explicit motion approval. A reel URL without
the approved mode fails closed to the static poster. Approved reels begin only
after the shared poster hold, play only while visible, and reset to the poster
when they leave view.
```

Retain the clone preload, reduced-motion, and no-JavaScript requirements.

- [x] **Step 2: Update the mutable resume state**

Record in `STATUS.md`:

- active package branch `codex/screening-strip-media-contract-v1`;
- the selected static-first, after-hold contract;
- package verification once complete;
- screening-strip contract removed from Accepted Open Items;
- Three-Minute Micro Drama reel remains the exact next bounded media package;
- no production replacement and no destructive history cleanup occurred.

Read `git rev-parse HEAD` after the implementation commit and record the exact
observed commit rather than an abbreviation or guessed value.

- [x] **Step 3: Run documentation and privacy checks**

Run:

```bash
git diff --check
npm test
```

Expected: no whitespace errors; all tests PASS; privacy scans remain empty.

- [x] **Step 4: Commit the project-state update**

```bash
git add PROJECT_BIBLE.md STATUS.md
git commit -m "Record screening strip media contract"
```

### Task 4: Build And Visual Interaction QA

**Files:**
- Create temporarily outside the repository:
  `/private/tmp/portfolio-screening-strip-v1-qa.py`
- Verify: `dist/en/index.html`
- Verify: `dist/zh/index.html`

- [x] **Step 1: Run the complete deterministic gate**

Run:

```bash
npm test
npm run build
git diff --check
git status --short
```

Expected: all tests PASS, build succeeds, no whitespace errors, and only
intentional status/documentation changes remain.

- [x] **Step 2: Inspect the local-server helper interface**

Run:

```bash
python3 "$PORTFOLIO_WEBAPP_TESTING_SKILL/scripts/with_server.py" --help
```

Expected: usage for a managed server command, port, and trailing Playwright
command. Resolve `PORTFOLIO_WEBAPP_TESTING_SKILL` from the current session's
skills catalog; do not record its user-specific absolute path in the repo.

- [x] **Step 3: Create and run native Playwright QA**

The temporary Playwright script must:

- open `/en/` at `1440x900` and `390x844`;
- wait for network idle;
- capture console errors;
- assert the original approved video starts without `is-playing`;
- assert it gains `is-playing` only after at least 1400 ms while visible;
- assert leaving the visibility threshold removes `is-playing`, pauses, and
  resets it;
- assert reduced-motion hides card videos and freezes the track;
- assert JavaScript-disabled mobile retains poster cards and valid links;
- capture disposable before/after desktop and mobile screenshots under
  `/private/tmp`.

Run it through:

```bash
python3 "$PORTFOLIO_WEBAPP_TESTING_SKILL/scripts/with_server.py" \
  --server "npm run serve" --port 4173 -- \
  python3 /private/tmp/portfolio-screening-strip-v1-qa.py
```

Expected: all assertions PASS and browser console error list is empty.

Execution note: the helper's port poll could not observe a sandboxed listening
socket. After confirming the bind restriction, the same temporary Playwright
script ran an in-process static server under approved local escalation. No
server or QA script was retained in the repository.

- [x] **Step 4: Review the screenshots**

Verify that:

- poster content is legible before motion begins;
- the reel reveal has no blank or black flash;
- the strip remains the dominant ambient gesture;
- card copy and destinations remain unchanged;
- desktop and mobile have no horizontal body overflow.

- [x] **Step 5: Record exact verification evidence**

Update `STATUS.md` with the observed test count, build result, viewport matrix,
reduced-motion/no-JavaScript results, and note that screenshots are disposable
QA artifacts rather than portfolio assets.

- [x] **Step 6: Commit and push the completed package**

```bash
git add STATUS.md
git commit -m "Verify screening strip media contract"
git push -u origin codex/screening-strip-media-contract-v1
git ls-remote origin refs/heads/codex/screening-strip-media-contract-v1
```

Expected: the remote branch tip equals local `git rev-parse HEAD`. Do not deploy
or replace production.
