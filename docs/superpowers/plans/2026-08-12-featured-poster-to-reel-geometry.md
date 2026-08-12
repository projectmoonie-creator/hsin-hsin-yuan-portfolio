# Featured Poster-to-Reel Geometry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore full-height desktop/tablet posters for four Featured Works while switching only their current playing reels to centered 16:9; preserve the reference pair and all mobile geometry.

**Architecture:** Extend the canonical Featured presentation contract with one explicit `fill-poster-16x9-reel` variant. The renderer emits one shared class from that variant, and the existing generation-guarded Featured controller toggles one frame-state class in the same validated `playing`/reset branches that already own video visibility. CSS owns only the wider-screen geometry; the existing `max-width: 820px` rule keeps all mobile states 16:9.

**Tech Stack:** Node.js ESM, `node:test`, static HTML generator, vanilla JavaScript, CSS, Playwright-based local browser probes, Vercel static `dist/` Preview.

---

## File map

- `content/works/{slow-steps,tech-dreamers,my-art-my-voice,top-gear-china-uk-special}.md` — canonical variant declarations for the four state-switch cards.
- `scripts/lib/portfolio-contract.mjs` — allowed variant validation and transitional renderer projection.
- `scripts/build-site.mjs` — shared HTML class derived from the named variant.
- `src/main.js` — current-owner `playing` activation and universal reset removal.
- `src/styles.css` — desktop/tablet fill-poster and current-playing centered-16:9 geometry; existing mobile override remains authoritative.
- `tests/portfolio-contract.test.mjs` — canonical data, validation, and negative contract assertions.
- `tests/build-site.test.mjs` — HTML, CSS, and runtime state contract assertions.
- `tests/design-contract-audit.test.mjs`, `scripts/audit-design-contract.mjs`, `docs/design-contract.md` — audit inventory and current design truth.
- `STATUS.md`, `docs/reviews/LOG.md` — final package evidence, Preview identity, and exact next action.

### Task 1: Lock the canonical named variant

**Files:**
- Modify: `tests/portfolio-contract.test.mjs`
- Modify: `content/works/slow-steps.md`
- Modify: `content/works/tech-dreamers.md`
- Modify: `content/works/my-art-my-voice.md`
- Modify: `content/works/top-gear-china-uk-special.md`
- Modify: `scripts/lib/portfolio-contract.mjs`

- [ ] **Step 1: Write the failing contract tests**

Change the expected source variants so the four named records require
`fill-poster-16x9-reel`, while Design & Brand Films and Nothing by Bus remain
`centered-16x9`. Extend the allowed-values assertion to expect:

```js
assert.deepEqual(PRESENTATION_VARIANTS.featured.desktopMediaVariant, [
  "fill-card",
  "centered-16x9",
  "fill-poster-16x9-reel",
]);
```

Add a normalization assertion proving the new variant does not project the
legacy `featuredMediaAspect: "16:9"` alias, because its static wider-screen
state is fill-card. Retain the existing invalid-variant rejection test so
unknown values still fail closed.

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```bash
node --test --test-name-pattern='field classes and allowed presentation variants|Featured source records declare approved variants|normalizes explicit Featured presentation variants' tests/portfolio-contract.test.mjs
```

Expected: FAIL because the new variant is not allowed and the four records
still declare `centered-16x9`.

- [ ] **Step 3: Implement the smallest contract/data change**

Add `fill-poster-16x9-reel` to
`PRESENTATION_VARIANTS.featured.desktopMediaVariant`. Change only
`presentation.desktopMediaVariant` in the four named work files. Keep the
compatibility adapter's `featuredMediaAspect` projection limited to
`centered-16x9`.

- [ ] **Step 4: Run the focused tests and verify GREEN**

Run the same command. Expected: all selected tests PASS.

- [ ] **Step 5: Commit the canonical contract**

```bash
git add tests/portfolio-contract.test.mjs scripts/lib/portfolio-contract.mjs content/works/slow-steps.md content/works/tech-dreamers.md content/works/my-art-my-voice.md content/works/top-gear-china-uk-special.md
git commit -m "feat: define Featured poster-to-reel variant"
```

### Task 2: Render and toggle one shared playing geometry state

**Files:**
- Modify: `tests/build-site.test.mjs`
- Modify: `scripts/build-site.mjs`
- Modify: `src/main.js`
- Modify: `src/styles.css`

- [ ] **Step 1: Write the failing renderer/runtime tests**

Replace the all-six-wide assertion with a two-family assertion:

```js
const switching = new Set([
  "slow-steps",
  "tech-dreamers",
  "my-art-my-voice",
  "top-gear-china-uk-special",
]);

for (const work of approved) {
  const panel = extractPanel(html, work.slug);
  if (switching.has(work.slug)) {
    assert.match(panel, /media-frame-reel-switch/);
    assert.doesNotMatch(panel, /media-frame-wide/);
  } else {
    assert.match(panel, /media-frame-wide/);
    assert.doesNotMatch(panel, /media-frame-reel-switch/);
  }
}
```

Add source assertions requiring:

```js
video.closest(".media-frame")?.classList.add("is-reel-playing");
video.closest(".media-frame")?.classList.remove("is-reel-playing");
```

inside the existing validated `playing` and `resetFeaturedReel` paths. Add CSS
assertions for `.media-frame-reel-switch.is-reel-playing` becoming centered
16:9 above the mobile breakpoint, and for the existing mobile `.media-frame`
16:9 rule to remain later and authoritative. Assert there are no slug-specific
selectors and no `:has(`.

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```bash
node --test --test-name-pattern='Featured reels keep approved poster and playing geometries|renderPage creates bilingual page with scroll-stack works and video fallbacks' tests/build-site.test.mjs
```

Expected: FAIL because all six render `media-frame-wide`, and no frame-state
class is toggled.

- [ ] **Step 3: Implement the minimal renderer, controller, and CSS**

In `mediaFrame`, add `media-frame-reel-switch` only when
`work.presentation.desktopMediaVariant === "fill-poster-16x9-reel"`; retain
`media-frame-wide` only for canonical `centered-16x9` projection. In the
current validated `playing` listener, add `is-reel-playing` to the closest
media frame immediately before revealing the video. In
`resetFeaturedReel`, remove that frame class alongside `is-playing` before
pause/seek. Do not add another event listener or controller.

Add wider-screen CSS:

```css
.media-frame-reel-switch.is-reel-playing {
  align-self: center;
  aspect-ratio: 16 / 9;
  min-height: 0;
  width: 100%;
}
```

The base `.media-frame` continues to fill the media column while static. The
existing `@media (max-width: 820px) { .media-frame { aspect-ratio: 16 / 9;
min-height: 0; } }` continues to make all mobile states 16:9.

- [ ] **Step 4: Run the focused tests and verify GREEN**

Run the same command. Expected: selected tests PASS.

- [ ] **Step 5: Run interaction-focused regressions**

```bash
node --test --test-name-pattern='current active playing|play rejection|media errors|mobile first stationary media tap|touch movement|desktop pointer hover|Screening Strip' tests/build-site.test.mjs
```

Expected: all selected lifecycle and intent tests PASS.

- [ ] **Step 6: Commit the stateful geometry**

```bash
git add tests/build-site.test.mjs scripts/build-site.mjs src/main.js src/styles.css
git commit -m "feat: switch Featured reel geometry on playback"
```

### Task 3: Align the design contract and audit

**Files:**
- Modify: `tests/design-contract-audit.test.mjs`
- Modify: `scripts/audit-design-contract.mjs`
- Modify: `docs/design-contract.md`

- [ ] **Step 1: Write the failing audit expectation**

Require the audit to report:

```js
assert.deepEqual(report.variants.featured, {
  "fill-card": [],
  "centered-16x9": [
    "interior-spatial-brand-films",
    "pts-taigi-bus",
  ],
  "fill-poster-16x9-reel": [
    "slow-steps",
    "tech-dreamers",
    "my-art-my-voice",
    "top-gear-china-uk-special",
  ],
  source: "explicit",
});
```

- [ ] **Step 2: Run the audit test and verify RED**

```bash
node --test tests/design-contract-audit.test.mjs
```

Expected: FAIL because the audit currently has only two buckets.

- [ ] **Step 3: Implement the three-bucket audit and update current truth**

Add a `fillPoster16x9Reel` bucket selected only by the exact canonical variant.
Update `docs/design-contract.md` so the named-media table lists the four state
switch works, the two unchanged reference works, and the invariant mobile
16:9 rule. Replace the statement that poster and playing geometry always match
with the approved state transition and failure/reset behavior.

- [ ] **Step 4: Verify GREEN and commit**

```bash
node --test tests/design-contract-audit.test.mjs
npm run audit:design-contract
git add tests/design-contract-audit.test.mjs scripts/audit-design-contract.mjs docs/design-contract.md
git commit -m "docs: align Featured geometry contract"
```

Expected: test PASS and audit reports no active drift.

### Task 4: Complete local verification and visual evidence

**Files:**
- Modify only if needed by a proven failure in the files already listed above.

- [ ] **Step 1: Run deterministic gates**

```bash
npm test
npm run build
npm run featured-reels:check
npm run audit:design-contract
npm run figma:export
git diff --check
```

Expected: 179+ tests PASS, build PASS, all six reel derivatives verified,
audit PASS, Figma export produces no unauthorized tracked drift, and diff check
is clean.

- [ ] **Step 2: Run matched browser geometry and lifecycle QA**

Serve `dist/` locally and inspect English/Chinese at 1440×900, 1024×768,
834×1112, 390×844, and 360×800. Prove:

- four static wider-screen frames fill their media columns;
- their current playing frames measure 16:9 and center vertically;
- the reference pair stays 16:9 before/during playback;
- all six mobile frames stay 16:9 before/during playback;
- panel dimensions, copy, links, hover/focus/tap/scroll/Screening Strip,
  reduced-motion, no-JavaScript, reset/error, overflow, console/page errors,
  and zero Contact POST pass.

- [ ] **Step 3: Run a matched local performance guard**

Run three cold mobile and three cold desktop Lighthouse measurements against
the local build, compare medians with the unchanged pre-change build under the
same settings, and reject the geometry implementation if Hero LCP, TBT, or CLS
materially regresses. Do not treat the Vercel-login PageSpeed report as a
portfolio measurement.

- [ ] **Step 4: Verify privacy and protected-file integrity**

```bash
rg -n '/Users/|_vercel_share=|screening-strip-media-contract-v1-2026-07-29 2.md' dist || true
shasum -a 256 'docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md'
git ls-files --error-unmatch 'docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md'
```

Expected: no private path/share token/protected filename in `dist`; protected
SHA-256 remains `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`;
`git ls-files` exits nonzero.

### Task 5: Review, record, and hand off one accessible Preview

**Files:**
- Modify: `STATUS.md`
- Modify: `docs/reviews/LOG.md`
- Create only bounded review evidence required by the current review workflow.

- [ ] **Step 1: Freeze and independently review the completed implementation**

Use the repository review contract against the frozen diff. Record exact
requested, observed, and completed model IDs. Adjudicate findings locally;
never claim a reviewer completed when it did not.

- [ ] **Step 2: Update current state and package log**

Record implementation commits, RED/GREEN evidence, exact geometry matrix,
performance medians, all verification results, review outcome, protected hash,
deployment boundary, and exact next action. Also record that report
`0gzingp9bc` measured `vercel.com/login`, not the portfolio, so its 59/85 scores
are invalid for regression comparison.

- [ ] **Step 3: Build and inspect the static deployment package**

Create a fresh `dist/`, inspect its exact file list/bytes/path hash, and prove
no function, environment, source, review, or protected file enters the package.

- [ ] **Step 4: Deploy and create the Shareable handoff**

Use the standing authorization for one static `dist/`-only Preview. Verify it
is Ready/Preview/static/no-functions. Proactively replace the Hobby account's
sole Shareable Link without asking again, report that the prior link is
revoked, keep the access-bearing URL outside Git, and deliver the new link for
producer inspection.

- [ ] **Step 5: Final verification after documentation commit**

```bash
npm test
git diff --check
git status --short --branch --untracked-files=all
shasum -a 256 'docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md'
```

Expected: full tests PASS, tracked tree clean, only the protected file remains
untracked, and its hash is exact. No push, `main`, Production, alias, Contact,
tag, or protected-file action occurs.
