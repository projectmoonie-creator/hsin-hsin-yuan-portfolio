# Mobile Featured Reel Trigger Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make mobile Featured reels select the eligible video nearest the viewport center and request playback after a 700ms poster hold, without changing desktop, Archive, or reduced-motion behavior.

**Architecture:** Keep selection geometry dependency-free in the existing `src/archive-reel-selection.js` module by adding a generic nearest-center export and retaining the Archive compatibility name. Keep responsive policy and lifecycle in `src/main.js`: the existing 820px breakpoint chooses mobile center-selection/700ms or desktop DOM-order/1400ms, while a throttled viewport listener updates mobile ownership between IntersectionObserver threshold events.

**Tech Stack:** Browser JavaScript ES modules, IntersectionObserver, matchMedia, requestAnimationFrame, Node test runner, static-site build, native Playwright Chromium.

---

## File responsibility map

- `src/archive-reel-selection.js`: reusable nearest-center geometry and Archive
  compatibility export.
- `src/main.js`: responsive Featured policy, hold timing, viewport refresh, and
  existing playback lifecycle.
- `tests/archive-reel-selection.test.mjs`: pure shared-selector contract.
- `tests/featured-reel-runtime.test.mjs`: real controller timing, ownership,
  scroll, reset, and BFCache behavior.
- `tests/build-site.test.mjs`: built-source policy and asset contract.
- `PROJECT_BIBLE.md`, `docs/design-contract.md`: canonical behavior rules.
- `STATUS.md`, `docs/reviews/LOG.md`: resumable package result and boundary.

### Task 1: Lock the responsive selection and timing contract with RED tests

**Files:**
- Modify: `tests/archive-reel-selection.test.mjs`
- Modify: `tests/featured-reel-runtime.test.mjs`
- Modify: `tests/build-site.test.mjs`

- [x] **Step 1: Add a failing generic-selector test**

Import `selectClosestVisibleReel` and assert it chooses the viewport-center
candidate while `selectClosestVisibleArchiveReel` returns the same result for
compatibility.

- [x] **Step 2: Add failing mobile runtime tests**

Extend the runtime fixture with configurable viewport width, video rectangles,
matchMedia results, and a flushable animation-frame queue. Assert:

```js
runtime.intersect([[first, 0.8], [second, 0.8]]);
runtime.clock.advance(699);
assert.equal(first.playRequests.length, 0);
runtime.clock.advance(1);
assert.equal(first.playRequests.length, 1);
```

Use rectangles where the first DOM item is nearer the mobile viewport center,
then change rectangles, dispatch `scroll`, flush animation frames, and prove
ownership transfers to the second item without another intersection callback.

- [x] **Step 3: Update structural expectations before production code**

Require separate `FEATURED_REEL_MOBILE_HOLD_MS = 700` and
`FEATURED_REEL_DESKTOP_HOLD_MS = 1400` constants, a responsive hold selector,
the shared nearest-center selector, and throttled scroll/resize lifecycle.

- [x] **Step 4: Run focused tests and verify RED**

Run:

```bash
node --test tests/archive-reel-selection.test.mjs tests/featured-reel-runtime.test.mjs
node --test --test-name-pattern="generated site keeps the chosen visual system" tests/build-site.test.mjs
```

Expected: failures because the generic export, mobile `700ms` policy, and
viewport-refresh ownership do not exist yet.

### Task 2: Implement the minimal responsive controller and verify GREEN

**Files:**
- Modify: `src/archive-reel-selection.js`
- Modify: `src/main.js`
- Test: `tests/archive-reel-selection.test.mjs`
- Test: `tests/featured-reel-runtime.test.mjs`
- Test: `tests/build-site.test.mjs`

- [x] **Step 1: Add the generic selector with compatibility alias**

Rename the function body to `selectClosestVisibleReel` and export:

```js
export const selectClosestVisibleArchiveReel = selectClosestVisibleReel;
```

- [x] **Step 2: Add responsive Featured policy**

Use the existing 820px breakpoint. Mobile selects via
`selectClosestVisibleReel(...)` and uses `700ms`; desktop keeps last eligible
DOM order and `1400ms`.

- [x] **Step 3: Add viewport and breakpoint lifecycle**

Add a requestAnimationFrame-throttled scroll/resize refresh. Bind and remove
its listeners with the existing Featured lifecycle; on breakpoint change,
reset current activations and reselect under the new policy.

- [x] **Step 4: Run focused tests and verify GREEN**

Run:

```bash
node --test tests/archive-reel-selection.test.mjs tests/featured-reel-runtime.test.mjs
node --test --test-name-pattern="generated site keeps the chosen visual system" tests/build-site.test.mjs
```

Expected: all focused tests pass without warnings.

- [x] **Step 5: Run the full deterministic suite**

Run:

```bash
npm test
npm run audit:design-contract
npm run build
npm run figma:export
git diff --check
```

Expected: every command exits zero; Figma output has no tracked delta because
content and geometry are unchanged.

### Task 3: Verify browser behavior and record the local package

**Files:**
- Modify: `PROJECT_BIBLE.md`
- Modify: `docs/design-contract.md`
- Modify: `STATUS.md`
- Modify: `docs/reviews/LOG.md`
- Generated locally: `dist/` (ignored)
- Disposable: `/private/tmp/portfolio_mobile_featured_reel_qa.py`

- [x] **Step 1: Update canonical documentation**

Record mobile nearest-center/700ms and desktop last-DOM/1400ms separately;
state that Archive remains nearest-center/1400ms and reduced-motion remains
static.

- [x] **Step 2: Run the browser matrix**

Serve `dist/` locally and verify `/en/` and `/zh/` at `390 × 844` and
`360 × 800`: the nearest-center Featured reel alone plays after at least 700ms,
ownership follows normal scrolling, and poster reset occurs on handoff. Verify
desktop at `1440 × 900` and `1200 × 900`, plus reduced-motion and no-JavaScript.
Across all cases assert zero horizontal overflow, console errors, page errors,
same-origin request failures, and Contact submissions.

- [x] **Step 3: Inspect mobile screenshots**

Capture representative Featured sections in both languages, confirm motion
does not alter layout or poster geometry, and check that the card visually
nearest the center is the active one.

- [x] **Step 4: Re-run final checks and protect the user file**

Run:

```bash
npm test
npm run build
git diff --check
shasum -a 256 "docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md"
git status --short
```

Expected: all checks pass; the protected file remains untracked at
`945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.

- [x] **Step 5: Commit and back up only the feature branch**

Commit the reviewed implementation and local closeout, push a dated backup ref,
and read it back exactly. Do not push `main`, create a Preview, deploy, change
an alias, or submit Contact.

## Plan self-review

- Spec coverage: mobile ownership, hold timing, scroll refresh, desktop and
  Archive preservation, accessibility fallbacks, lifecycle, browser QA,
  documentation, and external-state boundaries each have a concrete step.
- Placeholder scan: no deferred implementation choices or incomplete test
  instructions remain.
- Type consistency: selector names, breakpoint, timing constants, lifecycle
  events, commands, and protected-file hash match the current repository.
