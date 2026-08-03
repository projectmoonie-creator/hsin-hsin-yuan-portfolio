# Final Content Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove duplicate Featured Works title overlays and redundant copy, move the Very Mulan interview into chronological global Press, and preserve every approved image, link, credit, and layout.

**Architecture:** Keep content ownership in existing JSON/frontmatter and use the existing `hideMediaLabel` renderer contract. Global Press remains a text-only canonical collection rendered by one shared template; retired Archive and Press copy is removed at its data source and guarded by absence tests. No new component, asset, dependency, or media edit is introduced.

**Tech Stack:** Node.js ES modules, JSON frontmatter, generated static HTML/CSS/JS, Node test runner, SVG Figma export, native Playwright Chromium for local browser QA.

---

## File map

- `content/works/tech-dreamers.md`: opt out of the second HTML media title.
- `content/works/my-art-my-voice.md`: opt out of the media title and remove the Very Mulan interview from work-level Press.
- `content/works/pts-taigi-bus.md`: opt out of the media title while preserving the reel.
- `content/works/top-gear-china-uk-special.md`: opt out of the media title and retire `mediaTitleLines`.
- `content/works/interior-spatial-brand-films.md`: remove the redundant `editing` tag.
- `data/press.json`: own both global Press records in newest-first order and remove retired festival/context fields.
- `data/site.json`: remove bilingual Archive explanatory copy.
- `scripts/build-site.mjs`: simplify global Press metadata and omit empty Archive subcopy.
- `tests/build-site.test.mjs`: add RED/GREEN coverage for all requested output and absence contracts.
- `figma-export/*.svg`: regenerate from canonical data and retain only changes actually produced by the exporter.
- `STATUS.md` and `docs/reviews/final-content-cleanup-v1-2026-08-03.md`: record the verified local checkpoint without claiming deployment.

### Task 0: Execution preflight

**Files:**
- Read: `AGENTS.md`
- Read: `PROJECT_BIBLE.md`
- Read: `STATUS.md`
- Verify: repository state only

- [ ] **Step 1: Load the required execution skills**

Read `frontend-design`, `test-driven-development`, and the execution skill
selected by the user completely before editing production files. Use the
approved design spec as the visual contract; this package preserves all type,
color, spacing, image geometry, motion, desktop, and mobile rules while
removing only duplicate content layers.

- [ ] **Step 2: Verify branch and protected-file state**

```bash
git branch --show-current
git status --short
git rev-parse HEAD
git rev-parse main
```

Expected: branch `codex/final-content-cleanup`; the plan/spec commits are ahead
of local `main`; the protected duplicate review is the only unrelated
untracked file.

- [ ] **Step 3: Establish the green baseline**

```bash
npm test
```

Expected: the existing 40 tests pass before any new RED assertion is added.

### Task 1: Remove the second Featured Works media-title layer

**Files:**
- Modify: `tests/build-site.test.mjs`
- Modify: `content/works/tech-dreamers.md`
- Modify: `content/works/my-art-my-voice.md`
- Modify: `content/works/pts-taigi-bus.md`
- Modify: `content/works/top-gear-china-uk-special.md`

- [ ] **Step 1: Write the failing media-label regression test**

Add a focused test after the existing mobile featured-media test:

```js
test("featured media keeps source artwork without a second HTML title layer", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const html = renderPage({ lang: "en", site, works });
  const expected = new Map([
    ["tech-dreamers", "Play video: Tech Dreamers"],
    ["my-art-my-voice", "Play video: My Art, My Voice"],
    ["pts-taigi-bus", "Play video: Nothing by Bus"],
    ["top-gear-china-uk-special", "Play video: Top Gear China: UK Special"],
  ]);

  for (const [slug, ariaLabel] of expected) {
    const work = works.find((item) => item.slug === slug);
    const panel = html.match(
      new RegExp(`<article class="[^"]*work-panel[^"]*" id="${slug}">[\\s\\S]*?<\\/article>`),
    )?.[0];

    assert.equal(work.hideMediaLabel, true, slug);
    assert.ok(panel, slug);
    assert.match(panel, /class="media-frame[^"]*media-frame-unlabeled[^"]*media-frame-link"/);
    assert.match(panel, new RegExp(`aria-label="${ariaLabel}"`));
    assert.doesNotMatch(panel, /class="media-label(?: |")/);
  }

  const topGear = works.find((item) => item.slug === "top-gear-china-uk-special");
  assert.equal("mediaTitleLines" in topGear, false);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test --test-name-pattern="featured media keeps source artwork" tests/build-site.test.mjs
```

Expected: FAIL because the four works do not yet set `hideMediaLabel`, and Top
Gear still contains `mediaTitleLines`.

- [ ] **Step 3: Apply the minimal canonical-data change**

Add this field beside each work's poster/reel metadata in the four work files:

```json
"hideMediaLabel": true,
```

Delete this Top Gear-only field:

```json
"mediaTitleLines": ["Top Gear China", "UK Special"],
```

Do not change `posterImage`, `figmaPosterImage`, `featuredReelUrl`,
`featuredReelPoster`, `watchUrl`, or any source asset.

- [ ] **Step 4: Verify GREEN and the existing mobile ratio contract**

Run:

```bash
node --test --test-name-pattern="featured media keeps source artwork|all featured media keeps 16:9" tests/build-site.test.mjs
```

Expected: 2 passed, 0 failed.

- [ ] **Step 5: Commit the media-label package**

```bash
git add tests/build-site.test.mjs content/works/tech-dreamers.md content/works/my-art-my-voice.md content/works/pts-taigi-bus.md content/works/top-gear-china-uk-special.md
git commit -m "refine featured media title treatment"
```

### Task 2: Move the Very Mulan interview into chronological global Press

**Files:**
- Modify: `tests/build-site.test.mjs`
- Modify: `content/works/my-art-my-voice.md`
- Modify: `data/press.json`
- Modify: `scripts/build-site.mjs`

- [ ] **Step 1: Replace the one-record Press assertions with the approved two-record contract**

Update the Press audit and rendering tests so they assert real canonical data:

```js
test("global press notes keep audited sources in newest-first order", () => {
  const site = loadSiteData(root);
  const myArt = loadWorks(join(root, "content/works"))
    .find((work) => work.slug === "my-art-my-voice");

  assert.deepEqual(
    site.press.map((item) => [item.id, item.year, item.part.en]),
    [
      ["very-mulan-director-interview", "2025", "INTERVIEW"],
      ["wmw-28-selection-guide-part-1", "2021", "PART 1"],
    ],
  );
  assert.equal(
    myArt.press.some((item) => item.canonicalUrl.includes("verymulan.com")),
    false,
  );
  assert.equal(site.press[0].rightsStatus, "public-link-only");
  assert.equal(site.press[1].rightsStatus, "public-link-only");
  assert.equal(site.press[1].participationStatus, "verified-speaker");
  for (const item of site.press) {
    assert.match(item.canonicalUrl, /^https:\/\//);
    assert.match(item.sourcePageUrl, /^https:\/\//);
    assert.match(item.metadataCheckedAt, /^2026-/);
    assert.equal("image" in item, false);
    assert.equal("type" in item, false);
    assert.equal("context" in item, false);
  }
});
```

Update the rendering test with these assertions:

```js
assert.equal((pressSection.match(/class="press-note-card"/g) || []).length, 2);
assert.ok(pressSection.indexOf("Director interview: walking into the sea of creation") < pressSection.indexOf("28th Women Make Waves Film Festival Selection Guide"));
assert.match(pressSection, /<span class="press-note-part">INTERVIEW<\/span>/);
assert.match(pressSection, /<span class="press-note-kicker">2025<\/span>/);
assert.match(pressSection, /<span class="press-note-meta">Very Mulan<\/span>/);
assert.match(pressSection, /<span class="press-note-part">PART 1<\/span>/);
assert.match(pressSection, /<span class="press-note-kicker">2021<\/span>/);
assert.match(pressSection, /<span class="press-note-meta">Women Make Waves Film Festival<\/span>/);
assert.doesNotMatch(pressSection, /Festival conversation|Featuring Hsin-Hsin Yuan/);
assert.doesNotMatch(zh, /影展對談|袁欣欣參與對談/);
```

- [ ] **Step 2: Run the focused Press tests and verify RED**

Run:

```bash
node --test --test-name-pattern="global press notes" tests/build-site.test.mjs
```

Expected: FAIL because global Press has one record, the interview remains under
My Art, and the renderer still combines type/context with the year/source.

- [ ] **Step 3: Move the interview into `data/press.json`**

Remove the Very Mulan object from `content/works/my-art-my-voice.md`. Make the
new first global record:

```json
{
  "id": "very-mulan-director-interview",
  "order": 1,
  "year": "2025",
  "title": {
    "en": "Director interview: walking into the sea of creation",
    "zh": "真誠地往前走，走進創作的大海"
  },
  "part": {
    "en": "INTERVIEW",
    "zh": "訪談"
  },
  "source": {
    "en": "Very Mulan",
    "zh": "非常木蘭"
  },
  "url": "https://www.verymulan.com/story/真誠地往前走，走進創作的大海：專訪巴黎文化奧運紀錄片導演袁欣欣-15241.html",
  "canonicalUrl": "https://www.verymulan.com/story/真誠地往前走，走進創作的大海：專訪巴黎文化奧運紀錄片導演袁欣欣-15241.html",
  "sourcePageUrl": "https://www.verymulan.com/story/真誠地往前走，走進創作的大海：專訪巴黎文化奧運紀錄片導演袁欣欣-15241.html",
  "rightsStatus": "public-link-only",
  "titleSource": "source page headline",
  "imageSource": "source page article image; intentionally not rendered in global text-only Press",
  "metadataCheckedAt": "2026-07-12"
}
```

Change the Women Make Waves record to `order: 2`, retain its source/audit and
speaker fields, and delete its `type` and `context` properties.

- [ ] **Step 4: Simplify global Press rendering**

In `renderPressNotes`, replace the kicker and meta lines with:

```js
<span class="press-note-kicker">${escapeHtml(item.year)}</span>
<strong>${escapeHtml(localize(item.title, lang))}</strong>
<span class="press-note-meta">${escapeHtml(localize(item.source, lang))}</span>
```

Keep the left `part`, destination selection, text-only structure, audit data
attributes, section location, and focus behavior unchanged.

- [ ] **Step 5: Verify GREEN**

Run:

```bash
node --test --test-name-pattern="global press notes" tests/build-site.test.mjs
```

Expected: all focused global Press tests pass.

- [ ] **Step 6: Commit the Press package**

```bash
git add tests/build-site.test.mjs content/works/my-art-my-voice.md data/press.json scripts/build-site.mjs
git commit -m "reorder and simplify global press"
```

### Task 3: Remove Archive subcopy and the redundant Design tag

**Files:**
- Modify: `tests/build-site.test.mjs`
- Modify: `data/site.json`
- Modify: `content/works/interior-spatial-brand-films.md`
- Modify: `scripts/build-site.mjs`

- [ ] **Step 1: Add the failing absence and credit-preservation test**

Add:

```js
test("archive and Design remove redundant copy without losing credit", () => {
  const loaded = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const design = works.find((work) => work.slug === "interior-spatial-brand-films");
  const en = renderPage({ lang: "en", site: loaded, works });
  const zh = renderPage({ lang: "zh", site: loaded, works });
  const designPanel = en.match(
    /<article class="work-panel work-panel-wide-media" id="interior-spatial-brand-films">[\s\S]*?<\/article>/,
  )?.[0];
  const archiveSection = en.match(
    /<section class="section archive-section">[\s\S]*?<\/section>/,
  )?.[0];

  assert.equal("archiveSubcopy" in loaded.site.en, false);
  assert.equal("archiveSubcopy" in loaded.site.zh, false);
  assert.doesNotMatch(en, /Earlier scripted, factual, and international work/);
  assert.doesNotMatch(zh, /早期戲劇、科學節目與國際合作/);
  assert.doesNotMatch(archiveSection, /<p><\/p>/);
  assert.deepEqual(design.tags, ["interior design", "branded content", "lifestyle"]);
  assert.match(designPanel, /Director \/ Editor/);
  assert.doesNotMatch(designPanel, /<span class="tag">editing<\/span>/);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test --test-name-pattern="archive and Design remove redundant copy" tests/build-site.test.mjs
```

Expected: FAIL because Archive subcopy and the `editing` tag still exist.

- [ ] **Step 3: Remove retired canonical fields**

Delete `archiveSubcopy` from both language objects in `data/site.json`. Change
the Design tags to:

```json
"tags": ["interior design", "branded content", "lifestyle"],
```

- [ ] **Step 4: Make Archive subcopy optional without emitting empty markup**

Change the Archive intro rendering to:

```js
<div class="section-intro">
  <h2 class="section-title">${escapeHtml(copy.archiveTitle)}</h2>
  ${copy.archiveSubcopy ? `<p>${escapeHtml(copy.archiveSubcopy)}</p>` : ""}
</div>
```

- [ ] **Step 5: Verify GREEN**

Run:

```bash
node --test --test-name-pattern="archive and Design remove redundant copy" tests/build-site.test.mjs
```

Expected: 1 passed, 0 failed.

- [ ] **Step 6: Commit the Archive/Design package**

```bash
git add tests/build-site.test.mjs data/site.json content/works/interior-spatial-brand-films.md scripts/build-site.mjs
git commit -m "trim archive and Design repetition"
```

### Task 4: Regenerate and run deterministic validation

**Files:**
- Regenerate: `figma-export/*.svg`
- Verify: repository and generated `dist/`

- [ ] **Step 1: Run the complete unit suite**

```bash
npm test
```

Expected: all tests pass; the total is the current 40 plus the newly added
focused regressions, with no skipped or failed tests.

- [ ] **Step 2: Build the public site**

```bash
npm run build
```

Expected: exit 0 and regenerated English/Chinese HTML, CSS, JS, and public
assets under ignored `dist/`.

- [ ] **Step 3: Regenerate Figma parity output**

```bash
npm run figma:export
```

Expected: exit 0. Retain only exporter-produced tracked changes. Because the
removed Design tag was already outside the three-tag SVG limit and the other
trimmed sections are not drawn in Figma, no tracked SVG change is expected.

- [ ] **Step 4: Run repository hygiene checks**

```bash
git diff --check
git status --short
```

Expected: no whitespace errors; only intended tracked changes are present, and
the protected duplicate review remains the sole unrelated untracked file.

- [ ] **Step 5: Verify retired content is absent from generated output**

```bash
rg -n "Festival conversation|Featuring Hsin-Hsin Yuan|影展對談|袁欣欣參與對談|Earlier scripted, factual, and international work|早期戲劇、科學節目與國際合作|media-label-lines" dist/en/index.html dist/zh/index.html
```

Expected: no matches. Then verify the preserved records:

```bash
rg -n "Very Mulan|非常木蘭|Women Make Waves Film Festival|女性影展|Director / Editor|導演 / 剪輯" dist/en/index.html dist/zh/index.html
```

Expected: all preserved source and credit strings are present.

### Task 5: Run browser QA and record the local checkpoint

**Files:**
- Create temporarily: `/private/tmp/portfolio-final-content-qa.py`
- Create temporarily: `/private/tmp/portfolio-final-content-qa/`
- Create: `docs/reviews/final-content-cleanup-v1-2026-08-03.md`
- Modify: `STATUS.md`

- [ ] **Step 1: Load the browser-testing instructions and helper interface**

Read the active `webapp-testing` skill completely, then run its
`scripts/with_server.py --help` before invoking it. Use native synchronous
Playwright Chromium in headless mode.

- [ ] **Step 2: Create a disposable Playwright check**

The script must visit `/en/index.html` and `/zh/index.html`, collect console and
page errors, and assert at `1440 × 900`, `1200 × 900`, `834 × 1112`,
`390 × 844`, and `360 × 800`:

```python
for slug in (
    "tech-dreamers",
    "my-art-my-voice",
    "pts-taigi-bus",
    "top-gear-china-uk-special",
):
    panel = page.locator(f"#{slug}")
    assert panel.locator(".media-label").count() == 0
    assert panel.locator(".media-frame-link").count() == 1

press = page.locator(".press-note-card")
assert press.count() == 2
assert "2025" in press.nth(0).inner_text()
assert "Very Mulan" in press.nth(0).inner_text() or "非常木蘭" in press.nth(0).inner_text()
assert "2021" in press.nth(1).inner_text()
assert "Women Make Waves" in press.nth(1).inner_text() or "女性影展" in press.nth(1).inner_text()
assert "Festival conversation" not in page.locator(".press-notes-section").inner_text()
assert "Featuring Hsin-Hsin Yuan" not in page.locator(".press-notes-section").inner_text()
assert page.locator(".archive-section .section-intro p").count() == 0
assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")
```

Also run mobile contexts with `reduced_motion="reduce"` and
`java_script_enabled=False`, tab to the Tech Dreamers media link and assert its
focus outline is visible, and fail on any application console/page error.
Capture element screenshots for the four affected cards, Archive, and global
Press at `390 × 844`, plus one desktop Featured Works and Press comparison.

- [ ] **Step 3: Run local browser QA**

Use the helper with the existing server command:

```bash
python3 <webapp-testing-skill>/scripts/with_server.py --server "npm run serve" --port 4173 --timeout 30 -- python3 /private/tmp/portfolio-final-content-qa.py
```

Expected: all assertions pass, no horizontal overflow, and no application
console/page error. If sandboxed Chromium or local port binding fails, rerun
the exact command with the required local-browser escalation rather than
loosening assertions.

- [ ] **Step 4: Visually inspect screenshots**

Confirm:

- source-embedded Tech Dreamers artwork text remains, but the second centered
  site label is absent;
- My Art, Nothing by Bus, and Top Gear frames contain no site-added title;
- play controls and `16:9` mobile media remain;
- global Press is newest first and visually balanced with two text-only rows;
- Archive starts directly with cards after its heading;
- no sticky navigation overlap is mistaken for a card-layout defect.

- [ ] **Step 5: Create the local review and update current status**

`docs/reviews/final-content-cleanup-v1-2026-08-03.md` must record:

- approved scope and exact implementation commits;
- RED/GREEN evidence and final test total;
- Figma outcome;
- browser matrix and inspected screenshots;
- rights decision that source-embedded titles remain and no media was edited;
- the protected untracked file remained untouched;
- no Preview was created, no remote was pushed, and Production was unchanged;
- exact next action is user review followed by an optional separately approved
  Preview.

Update `STATUS.md` to point to this package and review while retaining the
closed baseline and protected-file record.

- [ ] **Step 6: Verify docs and commit the checkpoint**

```bash
node --test --test-name-pattern="public tracked artifacts do not expose private absolute paths" tests/build-site.test.mjs
git diff --check
git add STATUS.md docs/reviews/final-content-cleanup-v1-2026-08-03.md
git commit -m "docs: record final content cleanup"
```

Expected: privacy test and diff check pass; only the two intended closeout
documents enter the commit.

- [ ] **Step 7: Remove disposable QA artifacts and report**

Delete only `/private/tmp/portfolio-final-content-qa.py` and
`/private/tmp/portfolio-final-content-qa/`. Confirm the working tree contains
only the protected user-owned untracked duplicate. Report the local branch and
commit, verification results, unchanged Production status, and that a new
Preview requires the user's separate approval.
