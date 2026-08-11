# Archive Reel Intent Playback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `anthropic-skills:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the three canonical Archive reels the approved Featured-style intent interaction while preserving Archive's 35% + 1400ms passive fallback.

**Architecture:** Keep the Featured and Archive playback controllers separate, but extract their pointer/focus gesture into one `bindReelIntentSurface()` helper in `src/main.js`. Archive adds explicit-owner generations and intent failure state; canonical data, renderer, CSS, Figma, media files, and proactive warming do not change.

**Tech Stack:** Static ESM JavaScript, Node test runner/VM harness, generated HTML/CSS, Playwright browser QA.

---

## File Map
- Modify `tests/featured-reel-runtime.test.mjs`: add Archive fake surfaces/videos and user-visible RED contracts.
- Modify `src/main.js`: shared intent binder plus Archive explicit-intent lifecycle; retain separate section controllers.
- Modify `tests/build-site.test.mjs`: protect initial `preload="none"`, three canonical reels, 1400ms fallback, and no Archive warm path.
- Modify `STATUS.md` and `docs/reviews/LOG.md` only after runtime validation; no generator, data, CSS, Figma, media, Contact, or Production file changes.

### Task 1: Lock The Missing Archive Behavior RED
- [ ] Extend the existing VM harness with `archiveCount`, `.archive-card`, `.archive-card-media`, linked/unlinked surfaces, and `[data-archive-reel-video]` query results; do not change production code.
- [ ] Add linked mobile assertions for first stationary tap consumed + one immediate play, second tap unsuppressed, and movement/cancel producing zero play and no accidental navigation.
```js
assert.equal(media.dispatch("click").defaultPrevented, true); assert.equal(video.playRequests.length, 1);
video.dispatch("playing"); assert.equal(media.dispatch("click").defaultPrevented, false);
```
- [ ] Add The Mechanic unlinked retry, desktop hover/existing-focus, rejected-play release, single owner, stale `playing`, preload restoration, and unchanged 1399/1400ms passive assertions.
```js
clock.advance(1399); assert.equal(video.playRequests.length, 0); clock.advance(1); assert.equal(video.playRequests.length, 1);
```
- [ ] Run `node --test tests/featured-reel-runtime.test.mjs`; expect the new Archive intent assertions to FAIL because Archive currently binds no pointer/focus intent.
- [ ] Commit test-only RED evidence: `test: specify archive reel intent playback`.

### Task 2: Implement The Shared Intent Contract GREEN
- [ ] Add `bindReelIntentSurface({ video, surface, hoverTarget, mobileMedia, hasDestination, activate, release, isPreviewing, consumeFailure })` with the existing 12px pointer threshold, click suppression timer, pointer cancellation, desktop pointer/focus, and linked-failure release.
- [ ] Replace Featured's inline gesture listeners with that helper without changing its warm, Screening Strip, 700/1400ms, observer, or generation behavior; run the existing Featured intent tests and expect PASS.
- [ ] Add Archive `active`/`explicit` owner state, activation/play generations, viewport validation, one-video metadata prime on explicit intent, failure tracking, and reset-to-`preload="none"` behavior.
- [ ] Bind each Archive reel to its `.archive-card-media` surface and `.archive-card` hover/focus target; derive destination presence from the existing ancestor link, never from a new data field.
- [ ] Keep passive selection closest-visible at 35% + 1400ms, and keep Archive out of Hero/proximity warming; run `node --test tests/featured-reel-runtime.test.mjs tests/build-site.test.mjs` and expect PASS.
- [ ] Refactor names/cleanup only while focused tests stay green; commit `feat: add archive reel intent playback`.

### Task 3: Prove Preservation And Prepare Review
- [ ] Run `npm test`, `npm run build`, `npm run featured-reels:check`, `npm run audit:design-contract`, `npm run figma:export`, and `git diff --check`; expect all green and no tracked Figma drift.
- [ ] Browser-test English/Chinese at 1440×900, 834×1112, 390×844, and 360×800: linked first/second tap, The Mechanic touch, movement, desktop hover/focus, 1400ms fallback, single owner, reduced motion, no-JS, keyboard, overflow, errors, and zero Contact POST.
- [ ] Compare matched screenshots/geometry against `02fee43`; allowed visual difference is video visibility only after newly approved intent, with no layout/copy/crop/style delta.
- [ ] Confirm the protected document is the sole untracked file at SHA-256 `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`, and scan `dist/` for private paths/internal docs.
- [ ] Update `STATUS.md` current package and append at most ten LOG lines with branch/commits, RED/GREEN, QA, review choice, open real-device checks, and exact next action; commit `docs: record archive reel intent playback`.
- [ ] After every local gate passes, create one standing-authorized static dist-only Preview, refresh the sole Shareable Link only if protection blocks phone review, and stop for producer inspection; no Git push, Production, alias, `main`, Contact, or destructive Vercel action.

## Rollback
Return to design checkpoint `486a7f2`; Preview deletion or access changes outside the established sole-link refresh remain producer-gated.
