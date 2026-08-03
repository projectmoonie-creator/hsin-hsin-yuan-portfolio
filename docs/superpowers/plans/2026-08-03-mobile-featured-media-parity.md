# Mobile Featured Media Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give all six Featured Works cards the same full 16:9 image prominence on mobile without changing desktop composition or content.

**Architecture:** Express the invariant once in the existing `max-width: 820px` CSS breakpoint so media size does not depend on a work's label visibility or per-work data. Protect the rule with a CSS regression test, then verify actual bounding-box ratios in Chromium before producing a new Preview and merging the approved branch into local `main`.

**Tech Stack:** Static HTML generator, CSS, Node test runner, native Playwright Chromium, Figma SVG exporter, Vercel Preview, Git worktrees.

---

### Task 1: Lock the mobile media invariant with TDD

**Files:**
- Modify: `tests/build-site.test.mjs`
- Modify: `src/styles.css`

- [ ] **Step 1: Write the failing regression test**

Add this test beside the existing wide-media tests in
`tests/build-site.test.mjs`:

```js
test("all featured media keeps 16:9 prominence at the mobile breakpoint", () => {
  const css = readFileSync(join(root, "src/styles.css"), "utf8");

  assert.match(
    css,
    /@media \(max-width: 820px\) \{[\s\S]*?\.media-frame \{[^}]*aspect-ratio: 16 \/ 9;[^}]*min-height: 0;[^}]*\}/,
  );
  assert.doesNotMatch(
    css,
    /@media \(max-width: 820px\) \{[\s\S]*?\.media-frame-unlabeled \{[^}]*aspect-ratio: 16 \/ 9;/,
  );
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test --test-name-pattern="all featured media keeps 16:9" tests/build-site.test.mjs
```

Expected: one assertion failure because only `.media-frame-unlabeled`, not the
shared mobile `.media-frame`, owns the 16:9 rule.

- [ ] **Step 3: Implement the minimal shared CSS rule**

Replace the two mobile blocks:

```css
.media-frame {
  min-height: auto;
}

.media-frame-unlabeled {
  aspect-ratio: 16 / 9;
  min-height: 0;
}
```

with:

```css
.media-frame {
  aspect-ratio: 16 / 9;
  min-height: 0;
}
```

- [ ] **Step 4: Run focused and full tests and verify GREEN**

Run:

```bash
node --test --test-name-pattern="all featured media keeps 16:9" tests/build-site.test.mjs
npm test
```

Expected: focused test passes; full suite passes with 40 tests and no warnings.

- [ ] **Step 5: Commit the tested implementation**

```bash
git add tests/build-site.test.mjs src/styles.css
git commit -m "fix: unify mobile featured media size"
```

### Task 2: Verify generated, design, and browser behavior

**Files:**
- Generated locally: `dist/` (ignored)
- Verify unchanged: `figma-export/*.svg`
- Disposable: `/private/tmp/hsin_mobile_featured_media_qa.py`

- [ ] **Step 1: Run deterministic build and design checks**

```bash
npm run build
npm run figma:export
git diff --check
git status --short
```

Expected: build and Figma export succeed; Figma has no tracked change because
content and desktop card geometry are unchanged; only the protected duplicate
review remains untracked.

- [ ] **Step 2: Run the browser matrix**

Use native Playwright to inspect English and Chinese pages at `1440 × 900`,
`1200 × 900`, `834 × 1112`, `390 × 844`, and `360 × 800`, plus reduced-motion,
no-JavaScript, and keyboard-focus states. For every mobile Featured Works slug:

```python
for slug in [
    "slow-steps",
    "tech-dreamers",
    "my-art-my-voice",
    "interior-spatial-brand-films",
    "pts-taigi-bus",
    "top-gear-china-uk-special",
]:
    box = page.locator(f"#{slug} .media-frame").bounding_box()
    ratio = box["width"] / box["height"]
    assert 1.76 <= ratio <= 1.79
```

Also assert no body-level horizontal overflow, console errors, or page errors.
Capture and visually inspect mobile screenshots for Tech Dreamers, My Art, and
Top Gear, plus a desktop comparison proving the layout remains unchanged.

- [ ] **Step 3: Re-run final deterministic checks after browser QA**

```bash
npm test
npm run build
git diff --check
```

Expected: 40 tests pass; build and diff checks pass.

### Task 3: Preview, closeout, and approved local-main integration

**Files:**
- Create: `docs/reviews/mobile-featured-media-parity-v1-2026-08-03.md`
- Modify: `STATUS.md`
- Deploy: the existing 22-path public Preview payload only

- [ ] **Step 1: Create a new non-production Preview**

Stage only the existing 22 approved public files: generated English/Chinese
pages, eleven referenced media assets, `api/contact.js`, and minimal package /
Vercel configuration. Confirm the sorted path-list SHA-256 remains:

```text
1940a63b96e81606d82bb164be8f66b9d9292da10c45d79474adc41e05505388
```

Deploy with `--target=preview`, record the Preview URL, deployment ID, inspector
URL, and `READY` state, and do not request the deployed URL or submit the form.

- [ ] **Step 2: Record the closeout**

Create the dated review with the approved scope, exact implementation commit,
RED/GREEN evidence, browser ratio evidence, Preview metadata, deployment
boundary, protected untracked file, and merge authorization. Update `STATUS.md`
to point to that review and Preview, then commit:

```bash
git add STATUS.md docs/reviews/mobile-featured-media-parity-v1-2026-08-03.md
git commit -m "docs: record mobile featured media preview"
```

- [ ] **Step 3: Preflight the local main worktree**

Run:

```bash
git worktree list --porcelain
git -C "/Users/hsin-hsinyuan/Documents/Claude/Projects/Moonie V/hsin-hsin-yuan-portfolio-edit" branch --show-current
git -C "/Users/hsin-hsinyuan/Documents/Claude/Projects/Moonie V/hsin-hsin-yuan-portfolio-edit" status --short
git -C "/Users/hsin-hsinyuan/Documents/Claude/Projects/Moonie V/hsin-hsin-yuan-portfolio-edit" merge-base main codex/contact-archive-entrypoints
```

Expected: the registered main worktree is on `main`; stop rather than overwrite
if it contains overlapping changes or if the feature branch cannot be
fast-forwarded safely.

- [ ] **Step 4: Merge the approved work into local main and verify**

From the registered main worktree:

```bash
git merge --ff-only codex/contact-archive-entrypoints
npm test
npm run build
```

Expected: fast-forward succeeds; 40 tests and the build pass on `main`. Do not
push, promote production, remove the host-owned worktree, or delete the checked
out feature branch.

## Plan self-review

- Spec coverage: shared mobile 16:9 geometry, unchanged desktop, regression
  test, full browser matrix, Preview isolation, and local-main merge are each
  assigned to an explicit step.
- Placeholder scan: no incomplete steps or deferred implementation choices.
- Type consistency: selectors, breakpoint, slugs, commands, expected test count,
  payload hash, branch, and main-worktree path match the current repository.
