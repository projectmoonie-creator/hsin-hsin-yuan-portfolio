# Archive Uniformity And English Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the approved English copy, Tech Dreamers official entry, two-line contact heading, vertically centered 16:9 Featured Work reels, and uniform 40/60 Archive cards in a verified non-production Vercel Preview.

**Architecture:** Keep `content/works/*.md`, `content/archive/*.md`, and `data/site.json` as the canonical content sources. Update the existing static-site generator so one Archive renderer handles media and text-first records, while CSS owns geometry and the existing JavaScript owns reel playback. Regenerate the Figma SVG handoff from the same canonical Featured Work records rather than adding another title list.

**Tech Stack:** Node.js ESM, Node test runner, generated HTML/CSS/vanilla JavaScript, Markdown files with JSON frontmatter, SVG Figma export, HyperFrames-produced MP4 assets, Python static preview server, Vercel Preview deployment.

---

## Execution Guardrails

- Work in the existing `codex/contact-archive-entrypoints` checkout. Do not
  create a clean worktree because the approved Overclocking assets and source
  package currently exist only in this working tree.
- Preserve `portfolio-phase-2026-07-29-closed` unchanged.
- Do not edit, stage, delete, or rename
  `docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md`.
- Do not add ignored original source clips, selects, snapshots, thumbnails, or
  local media-cache copies to Git.
- Use `apply_patch` for text-file edits. Stage exact paths; never use
  `git add .` or `git add -A`.
- Before Task 4 changes active layout rules, read `frontend-design/SKILL.md`
  from the current skill catalog. Preserve the existing ink/acid palette,
  typography, border language, and motion timing.
- Apply behavior changes test-first. Run the named failing test before the
  implementation step and confirm the failure is for the intended reason.
- Deployment authority covers a non-production Vercel Preview only. Do not
  promote, alias, or replace the production deployment.

## File Responsibility Map

- `content/works/interior-spatial-brand-films.md`: canonical English title,
  program-led copy, and 16:9 Featured Work media opt-in.
- `content/works/pts-taigi-bus.md`: canonical English program copy and 16:9
  Featured Work media opt-in.
- `content/works/top-gear-china-uk-special.md`: canonical English program copy.
- `content/works/tech-dreamers.md`: audited TaiwanPlus official-page entry.
- `content/archive/*.md`: canonical Archive chronology and optional media/link
  fields; no visual hierarchy flag.
- `data/site.json`: localized contact-title segments.
- `scripts/build-site.mjs`: semantic Featured Work, contact, and unified Archive
  HTML generation.
- `src/styles.css`: Featured Work frame centering, explicit contact lines, and
  uniform Archive geometry.
- `src/main.js`: existing Featured and Archive reel state machines; retain
  behavior unless a focused regression requires a correction.
- `scripts/build-figma-export.mjs`: generated SVG handoff sourced from all
  canonical Featured Work files.
- `tests/build-site.test.mjs`: content, markup, CSS, motion, and build contracts.
- `tests/figma-export.test.mjs`: generated-design parity.
- `figma-export/*`: regenerated, tracked SVG handoff artifacts.
- `public/assets/showreel/*` and `showreel/overclocking-card-reel/*`: approved
  public reels and reproducible Overclocking composition source.
- `.gitignore`: local brainstorming and ingested-media caches.
- `STATUS.md` and a dated review document: observed QA and Preview provenance.

### Task 1: Checkpoint The Approved Reel Work Without Staging Local Caches

**Files:**
- Modify: `.gitignore`
- Modify: `content/archive/overclocking.md`
- Modify: `public/assets/showreel/website-visual-reel.mp4`
- Create: `public/assets/showreel/overclocking-card-reel-poster.webp`
- Create: `public/assets/showreel/overclocking-card-reel.mp4`
- Modify: `scripts/build-site.mjs`
- Modify: `src/main.js`
- Modify: `src/styles.css`
- Modify: `tests/build-site.test.mjs`
- Create: `showreel/overclocking-card-reel/AGENTS.md`
- Create: `showreel/overclocking-card-reel/BRIEF.md`
- Create: `showreel/overclocking-card-reel/CLAUDE.md`
- Create: `showreel/overclocking-card-reel/README.md`
- Create: `showreel/overclocking-card-reel/STORYBOARD.md`
- Create: `showreel/overclocking-card-reel/.hyperframes/anim-map/animation-map.json`
- Create: `showreel/overclocking-card-reel/compositions/frames/01-mechanism.html`
- Create: `showreel/overclocking-card-reel/compositions/frames/02-build.html`
- Create: `showreel/overclocking-card-reel/compositions/frames/03-propeller.html`
- Create: `showreel/overclocking-card-reel/compositions/frames/04-assembly.html`
- Create: `showreel/overclocking-card-reel/compositions/frames/05-water-test.html`
- Create: `showreel/overclocking-card-reel/compositions/frames/06-bottle-detail.html`
- Create: `showreel/overclocking-card-reel/frame.md`
- Create: `showreel/overclocking-card-reel/hyperframes.json`
- Create: `showreel/overclocking-card-reel/index.html`
- Create: `showreel/overclocking-card-reel/meta.json`
- Create: `showreel/overclocking-card-reel/package.json`
- Create: `showreel/overclocking-card-reel/scripts/make-selects.sh`

- [ ] **Step 1: Ignore tool-owned local state**

Append these exact rules to `.gitignore`:

```gitignore
.superpowers/
showreel/**/.media/
```

- [ ] **Step 2: Verify the ignore boundary**

Run:

```bash
git check-ignore -v .superpowers/brainstorm/54187-1785690830/content/archive-layout-options.html
git check-ignore -v showreel/overclocking-card-reel/.media/video/video_001.mp4
git check-ignore -v showreel/overclocking-card-reel/assets/source-clips/originals/overclocking_2013_eng_0218_v1\ \(720p\).mp4
```

Expected: all three paths report a matching `.gitignore` rule. The original
source clip remains stored under the project but is not staged.

- [ ] **Step 3: Run the existing Overclocking contract tests**

Run:

```bash
node --test --test-name-pattern="Overclocking|archive reel" tests/build-site.test.mjs
```

Expected: all selected tests pass with zero failures.

- [ ] **Step 4: Verify the approved public media exactly**

Run:

```bash
shasum -a 256 public/assets/showreel/overclocking-card-reel.mp4 public/assets/showreel/overclocking-card-reel-poster.webp public/assets/showreel/website-visual-reel.mp4
ffprobe -v error -show_entries format=duration,size:stream=index,codec_name,codec_type,width,height,r_frame_rate -of json public/assets/showreel/overclocking-card-reel.mp4
ffprobe -v error -show_entries format=duration,size:stream=index,codec_name,codec_type,width,height,r_frame_rate -of json public/assets/showreel/website-visual-reel.mp4
```

Expected SHA-256 values:

```text
c5b4a2d83454b00edcd24e5ab14f29056f1586d12b79d9aa8a9e58cf51f75a1f  public/assets/showreel/overclocking-card-reel.mp4
0cfcfff0e8967e518538d3489b882eb09152c040bd58e886e7036f46a9b97f66  public/assets/showreel/overclocking-card-reel-poster.webp
3825c6e76c1d26caecd9bbd0ea38b6b00c798c0dbbc5cdece3a436eb9190b405  public/assets/showreel/website-visual-reel.mp4
```

Expected media facts: Overclocking is H.264, 1280×720, 30 fps, 10 seconds,
has one video stream and no audio stream; the website reel is H.264,
1920×1080, 30 fps, 30 seconds, and 4,346,384 bytes.

- [ ] **Step 5: Stage only the approved reel checkpoint**

Run:

```bash
git add .gitignore content/archive/overclocking.md public/assets/showreel/overclocking-card-reel-poster.webp public/assets/showreel/overclocking-card-reel.mp4 public/assets/showreel/website-visual-reel.mp4 scripts/build-site.mjs src/main.js src/styles.css tests/build-site.test.mjs showreel/overclocking-card-reel
git diff --cached --check
git diff --cached --name-only
```

Expected: the staged list contains only the paths named above and the
non-ignored Overclocking composition source. It does not contain
`.superpowers`, `.media`, `assets/source-clips`, `snapshots`, `.thumbnails`, or
the duplicate review file.

- [ ] **Step 6: Commit the checkpoint**

```bash
git commit -m "feat: checkpoint approved portfolio reels"
```

### Task 2: Lock The Featured English Copy And Tech Dreamers Official Entry

**Files:**
- Modify: `tests/build-site.test.mjs`
- Modify: `content/works/interior-spatial-brand-films.md`
- Modify: `content/works/pts-taigi-bus.md`
- Modify: `content/works/top-gear-china-uk-special.md`
- Modify: `content/works/tech-dreamers.md`

- [ ] **Step 1: Write the failing canonical-copy and official-entry tests**

Replace the old English assertions in `loadWorks returns ordered bilingual
portfolio works` with these exact assertions, and add the Tech Dreamers audit
assertions:

```js
assert.equal(works[3].title.en, "Design & Brand Films");
assert.equal(
  works[3].tagline.en,
  "How design becomes part of everyday life.",
);
assert.equal(
  works[3].description.en,
  "Films about residential design and brand collaborations, following how homes are planned, renovated, and lived in—from a designer’s choices to the routines that fill the finished space.",
);
assert.equal(works[3].title.zh, "幸福空間與室內設計影像");
assert.equal(
  works[3].description.zh,
  "我為住宅設計、老屋翻新、設計師作品、居家品牌與廚電業配內容擔任導演 / 剪輯。",
);

assert.equal(works[4].tagline.en, "Taiwan, one bus route at a time.");
assert.equal(
  works[4].description.en,
  "A Taiwanese-language travel series following local buses off the main road and into the food, work, and daily life of each stop.",
);
assert.equal(
  works[4].description.zh,
  "公視台語台行腳節目的單集企劃 / 企編工作，節目以公車路線串起地方記憶、飲食、市集與路上的人。",
);

assert.equal(
  works[5].tagline.en,
  "A world-renowned car show, reimagined for China.",
);
assert.equal(
  works[5].description.en,
  "For the UK Special, the Chinese production travelled to Britain to work with the original Top Gear team on a cross-border factual-entertainment shoot.",
);
assert.equal(
  works[5].description.zh,
  "擔任《巔峰拍檔》中國版第二季第五期英國篇導演，負責英國拍攝內容，協調播出端、中國製作端與英國原版 Top Gear 團隊之間的製作需求。",
);

const techOfficialEntry = works[1].press[0];
assert.deepEqual(techOfficialEntry.type, {
  en: "Official page",
  zh: "官方節目頁",
});
assert.deepEqual(techOfficialEntry.title, {
  en: "Official program page",
  zh: "官方節目頁",
});
assert.equal(techOfficialEntry.source, "TaiwanPlus");
assert.equal(techOfficialEntry.url, works[1].watchUrl);
assert.equal(techOfficialEntry.canonicalUrl, works[1].watchUrl);
assert.equal(techOfficialEntry.image, works[1].posterImage);
assert.equal(techOfficialEntry.titleSource, "official platform page");
assert.equal(techOfficialEntry.imageSource, "official platform series artwork");
assert.equal(techOfficialEntry.metadataCheckedAt, "2026-08-03");
```

Add a renderer assertion that scopes the link to the Tech Dreamers panel:

```js
test("Tech Dreamers repeats its canonical TaiwanPlus destination as an audited official entry", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const html = renderPage({ lang: "en", site, works });
  const techPanel = html.match(
    /<article class="work-panel" id="tech-dreamers">[\s\S]*?<\/article>/,
  )?.[0];

  assert.ok(techPanel);
  assert.match(techPanel, /Official program page/);
  assert.match(techPanel, /data-metadata-checked-at="2026-08-03"/);
  assert.match(
    techPanel,
    /href="https:\/\/www\.taiwanplus\.com\/shows\/documentary\/business-and-tech\/590\/tech-dreamers"/,
  );
});
```

Add an assertion for the localized screening-strip label:

```js
test("Design title propagates to the English screening-strip card", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const html = renderPage({ lang: "en", site, works });
  const designStripCard = html.match(
    /<a class="watch-loop-card" href="#interior-spatial-brand-films"[\s\S]*?<\/a>/,
  )?.[0];

  assert.ok(designStripCard);
  assert.match(designStripCard, /<strong>Design &amp; Brand Films<\/strong>/);
  assert.doesNotMatch(designStripCard, /Interior Design &amp; Branded Films/);
});
```

- [ ] **Step 2: Run the tests and verify the intended failure**

Run:

```bash
node --test --test-name-pattern="loadWorks returns|Tech Dreamers repeats|Design title propagates" tests/build-site.test.mjs
```

Expected: failure shows the old Design/Bus/Top Gear English copy and a missing
Tech Dreamers `press` entry.

- [ ] **Step 3: Replace the three English copy records**

Set the English fields in
`content/works/interior-spatial-brand-films.md` to:

```json
"title": {
  "en": "Design & Brand Films",
  "zh": "幸福空間與室內設計影像"
},
"tagline": {
  "en": "How design becomes part of everyday life.",
  "zh": "把設計、產品與家的故事，整理成觀眾願意停留的短影音。"
},
"description": {
  "en": "Films about residential design and brand collaborations, following how homes are planned, renovated, and lived in—from a designer’s choices to the routines that fill the finished space.",
  "zh": "我為住宅設計、老屋翻新、設計師作品、居家品牌與廚電業配內容擔任導演 / 剪輯。"
},
```

Set the English fields in `content/works/pts-taigi-bus.md` to:

```json
"tagline": {
  "en": "Taiwan, one bus route at a time.",
  "zh": "地方行旅、公共媒體，以及台語語境裡的紀實節目敘事。"
},
"description": {
  "en": "A Taiwanese-language travel series following local buses off the main road and into the food, work, and daily life of each stop.",
  "zh": "公視台語台行腳節目的單集企劃 / 企編工作，節目以公車路線串起地方記憶、飲食、市集與路上的人。"
},
```

Set the English fields in
`content/works/top-gear-china-uk-special.md` to:

```json
"tagline": {
  "en": "A world-renowned car show, reimagined for China.",
  "zh": "與英國原版 Top Gear 團隊合作的汽車節目與紀實娛樂製作。"
},
"description": {
  "en": "For the UK Special, the Chinese production travelled to Britain to work with the original Top Gear team on a cross-border factual-entertainment shoot.",
  "zh": "擔任《巔峰拍檔》中國版第二季第五期英國篇導演，負責英國拍攝內容，協調播出端、中國製作端與英國原版 Top Gear 團隊之間的製作需求。"
},
```

- [ ] **Step 4: Add the audited Tech Dreamers entry**

Add this `press` array to `content/works/tech-dreamers.md` after the poster
metadata:

```json
"press": [
  {
    "type": {"en": "Official page", "zh": "官方節目頁"},
    "title": {
      "en": "Official program page",
      "zh": "官方節目頁"
    },
    "source": "TaiwanPlus",
    "url": "https://www.taiwanplus.com/shows/documentary/business-and-tech/590/tech-dreamers",
    "canonicalUrl": "https://www.taiwanplus.com/shows/documentary/business-and-tech/590/tech-dreamers",
    "image": "https://prod-img.taiwanplus.com/program/224be7ed-057b-400f-af63-a8582cd80cfb.webp",
    "titleSource": "official platform page",
    "imageSource": "official platform series artwork",
    "metadataCheckedAt": "2026-08-03"
  }
],
```

- [ ] **Step 5: Run focused and audit tests**

Run:

```bash
node --test --test-name-pattern="loadWorks returns|Tech Dreamers repeats|Design title propagates|featured press entries" tests/build-site.test.mjs
```

Expected: all selected tests pass.

- [ ] **Step 6: Commit the canonical content change**

```bash
git add content/works/interior-spatial-brand-films.md content/works/pts-taigi-bus.md content/works/top-gear-china-uk-special.md content/works/tech-dreamers.md tests/build-site.test.mjs
git diff --cached --check
git commit -m "content: refine featured work copy and official entry"
```

### Task 3: Render The Contact Heading As Two Explicit Lines

**Files:**
- Modify: `tests/build-site.test.mjs`
- Modify: `data/site.json`
- Modify: `scripts/build-site.mjs`
- Modify: `src/styles.css`

- [ ] **Step 1: Write the failing structural test**

Add:

```js
test("contact heading uses two explicit English lines with only together accented", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const en = renderPage({ lang: "en", site, works });
  const zh = renderPage({ lang: "zh", site, works });

  assert.match(
    en,
    /<h2 class="contact-title"><span class="contact-title-line">Let’s build<\/span><span class="contact-title-line"><span class="contact-title-bridge">a story <\/span><span class="contact-title-accent">together\.<\/span><\/span><\/h2>/,
  );
  assert.doesNotMatch(en, /contact-title-lead">Let’s build a story/);
  assert.match(
    zh,
    /<h2 class="contact-title"><span class="contact-title-line">一起把故事<\/span><span class="contact-title-line"><span class="contact-title-accent">做出來。<\/span><\/span><\/h2>/,
  );
});
```

Extend the CSS source contract:

```js
assert.match(css, /\.contact-title-line \{[\s\S]*?display: block;[\s\S]*?white-space: nowrap;/);
assert.match(css, /\.contact-title-accent \{[\s\S]*?color: var\(--acid\);/);
assert.match(
  css,
  /@media \(max-width: 460px\) \{[\s\S]*?\.contact h2 \{[\s\S]*?font-size: clamp\(2\.25rem, 11vw, 3\.2rem\);/,
);
```

Replace the two old Chinese contact assertions in the build test with:

```js
assert.match(
  zh,
  /<h2 class="contact-title"><span class="contact-title-line">一起把故事<\/span><span class="contact-title-line"><span class="contact-title-accent">做出來。<\/span><\/span><\/h2>/,
);
```

- [ ] **Step 2: Run the test and verify the old markup fails**

```bash
node --test --test-name-pattern="contact heading|build generates" tests/build-site.test.mjs
```

Expected: failure shows the old two-span structure and missing bridge field.

- [ ] **Step 3: Split the canonical localized data**

Change the English fields in `data/site.json` to:

```json
"contactTitleLead": "Let’s build",
"contactTitleBridge": "a story",
"contactTitleAccent": "together.",
```

Keep the Chinese wording and add an empty bridge:

```json
"contactTitleLead": "一起把故事",
"contactTitleBridge": "",
"contactTitleAccent": "做出來。",
```

- [ ] **Step 4: Add one heading renderer and use it**

Add this complete helper near the contact renderers in
`scripts/build-site.mjs`:

```js
function renderContactHeading(copy) {
  const bridge = copy.contactTitleBridge
    ? `<span class="contact-title-bridge">${escapeHtml(copy.contactTitleBridge)} </span>`
    : "";

  return `<h2 class="contact-title"><span class="contact-title-line">${escapeHtml(copy.contactTitleLead)}</span><span class="contact-title-line">${bridge}<span class="contact-title-accent">${escapeHtml(copy.contactTitleAccent)}</span></span></h2>`;
}
```

Replace the inline contact `<h2>` expression with:

```js
${renderContactHeading(copy)}
```

- [ ] **Step 5: Replace the old title-span CSS**

Use:

```css
.contact-title-line {
  display: block;
  white-space: nowrap;
}

.contact-title-accent {
  color: var(--acid);
}
```

Inside the existing `@media (max-width: 460px)` block add:

```css
.contact h2 {
  font-size: clamp(2.25rem, 11vw, 3.2rem);
  max-width: none;
}
```

- [ ] **Step 6: Run the focused tests**

```bash
node --test --test-name-pattern="contact heading|build generates" tests/build-site.test.mjs
```

Expected: both English and Chinese markup and CSS contracts pass.

- [ ] **Step 7: Commit the contact contract**

```bash
git add data/site.json scripts/build-site.mjs src/styles.css tests/build-site.test.mjs
git diff --cached --check
git commit -m "feat: lock contact heading to two lines"
```

### Task 4: Center Near-16:9 Featured Work Reels Inside Large Cards

**Required at task start:** Read `frontend-design/SKILL.md` from the current
catalog before editing the active CSS system. Record the translation in the
work log: preserve current color, typography, shape, poster/reel transition,
desktop card height, mobile stacking, reduced-motion poster, and no-JavaScript
poster.

**Files:**
- Modify: `tests/build-site.test.mjs`
- Modify: `content/works/interior-spatial-brand-films.md`
- Modify: `content/works/pts-taigi-bus.md`
- Modify: `scripts/build-site.mjs`
- Modify: `src/styles.css`

- [ ] **Step 1: Write the failing data, markup, and CSS tests**

Add to the canonical work test:

```js
assert.equal(works[3].featuredMediaAspect, "16:9");
assert.equal(works[4].featuredMediaAspect, "16:9");
```

Update the Featured Work markup assertions to require the new semantic
classes:

```js
assert.match(
  html,
  /<article class="work-panel work-panel-wide-media" id="interior-spatial-brand-films">[\s\S]*?class="media-frame media-frame-wide media-frame-unlabeled media-frame-link"/,
);
assert.match(
  html,
  /<article class="work-panel work-panel-wide-media" id="pts-taigi-bus">[\s\S]*?class="media-frame media-frame-wide media-frame-link"/,
);
```

Replace the old `align-self: start` CSS assertion with:

```js
assert.match(
  css,
  /\.media-frame-wide \{[\s\S]*?align-self: center;[\s\S]*?aspect-ratio: 16 \/ 9;[\s\S]*?min-height: 0;[\s\S]*?width: 100%;/,
);
assert.match(
  css,
  /\.featured-reel-video \{[\s\S]*?object-fit: cover;[\s\S]*?object-position: center;/,
);
assert.doesNotMatch(css, /\.media-frame-contain|align-self: start;/);
assert.doesNotMatch(css, /\.work-panel-compact-media/);
```

- [ ] **Step 2: Run the focused tests and verify they fail**

```bash
node --test --test-name-pattern="loadWorks returns|screening strip stays|renderPage creates|build generates" tests/build-site.test.mjs
```

Expected: failure reports missing `featuredMediaAspect`, old compact-media
classes, and `align-self: start`.

- [ ] **Step 3: Opt the two canonical records into wide media**

Add this field beside the Featured reel fields in both
`content/works/interior-spatial-brand-films.md` and
`content/works/pts-taigi-bus.md`:

```json
"featuredMediaAspect": "16:9",
```

- [ ] **Step 4: Generate the new semantic classes**

In `mediaFrame`, build the class list before calling
`mediaFrameContainer`:

```js
const mediaClasses = ["media-frame"];
if (work.featuredMediaAspect === "16:9") {
  mediaClasses.push("media-frame-wide");
}
if (work.hideMediaLabel) {
  mediaClasses.push("media-frame-unlabeled");
}
```

Pass this exact class expression:

```js
className: mediaClasses.join(" "),
```

Replace `panelClass` in `renderWork` with:

```js
const panelClass = work.featuredMediaAspect === "16:9"
  ? "work-panel work-panel-wide-media"
  : "work-panel";
```

- [ ] **Step 5: Center the whole frame, not only the video crop**

Remove `.work-panel-compact-media` and `.media-frame-contain`. Add:

```css
.media-frame-wide {
  align-self: center;
  aspect-ratio: 16 / 9;
  min-height: 0;
  width: 100%;
}
```

Keep the existing `.featured-reel-video` `object-fit: cover` and
`object-position: center`. Do not change the `260ms` reveal or playback
runtime.

- [ ] **Step 6: Run the focused tests**

```bash
node --test --test-name-pattern="loadWorks returns|screening strip stays|renderPage creates|build generates" tests/build-site.test.mjs
```

Expected: all selected tests pass and the large work panels retain their
normal desktop minimum height.

- [ ] **Step 7: Commit the centered-media contract**

```bash
git add content/works/interior-spatial-brand-films.md content/works/pts-taigi-bus.md scripts/build-site.mjs src/styles.css tests/build-site.test.mjs
git diff --cached --check
git commit -m "feat: center wide featured reels"
```

### Task 5: Replace Mixed Archive Treatments With One Uniform 40/60 Card

**Files:**
- Modify: `tests/build-site.test.mjs`
- Modify: `content/archive/heart-of-steel.md`
- Modify: `content/archive/lying-game.md`
- Modify: `content/archive/overclocking.md`
- Modify: `scripts/build-site.mjs`
- Modify: `src/styles.css`

- [ ] **Step 1: Write the failing uniform-renderer tests**

Add:

```js
test("archive renders five equal cards with one 40/60 contract", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const html = renderPage({ lang: "en", site, works });
  const archiveMarkup = html.match(
    /<div class="archive-chronology">[\s\S]*?<\/div>\s*<\/section>/,
  )?.[0];

  assert.ok(archiveMarkup);
  assert.equal(
    (archiveMarkup.match(/class="archive-card(?: |")/g) || []).length,
    5,
  );
  assert.equal((archiveMarkup.match(/<a class="archive-card"/g) || []).length, 3);
  assert.equal(
    (archiveMarkup.match(/<article class="archive-card"/g) || []).length,
    2,
  );
  assert.match(archiveMarkup, /class="archive-card-copy"/);
  assert.match(archiveMarkup, /class="archive-card-media archive-card-media-placeholder"/);
  assert.match(archiveMarkup, /class="archive-card-index"[^>]*>01</);
  assert.match(archiveMarkup, /class="archive-card-index"[^>]*>02</);
  assert.match(archiveMarkup, /data-archive-reel-video/);
  assert.doesNotMatch(
    archiveMarkup,
    /archive-media-card|archive-media-card-lead|archive-item|archive-media-summary|mini-metrics/,
  );
  assert.doesNotMatch(archiveMarkup, /200M|250M|NT\$6M|600K|66%/);
});
```

Add a canonical negative assertion:

```js
assert.ok(
  archive.every((item) => !Object.hasOwn(item, "archiveFeature")),
  "visual hierarchy must not live in Archive content",
);
```

Replace the old Overclocking reel markup assertion with:

```js
assert.match(
  html,
  /class="archive-card"[\s\S]*?data-archive-reel-video[\s\S]*?data-archive-reel-mode="after-hold"[\s\S]*?poster="\/assets\/showreel\/overclocking-card-reel-poster\.webp"[\s\S]*?<source src="\/assets\/showreel\/overclocking-card-reel\.mp4" type="video\/mp4">/,
);
assert.doesNotMatch(html, /archive-media-card-lead/);
```

Replace the old general render-page assertion for the lead card with:

```js
assert.match(html, /class="archive-card"/);
assert.doesNotMatch(html, /archive-media-card|archive-media-card-lead|archive-item/);
```

Replace the old Archive CSS assertions with:

```js
assert.match(
  css,
  /\.archive-card \{[\s\S]*?aspect-ratio: 80 \/ 27;[\s\S]*?grid-template-columns: minmax\(0, 2fr\) minmax\(0, 3fr\);/,
);
assert.match(css, /\.archive-card-copy \{/);
assert.match(css, /\.archive-card-media \{/);
assert.match(css, /\.archive-card-index \{/);
assert.doesNotMatch(
  css,
  /\.archive-media-card|\.archive-media-card-lead|\.archive-item|\.archive-media-summary/,
);
```

- [ ] **Step 2: Run the focused tests and verify mixed treatments fail**

```bash
node --test --test-name-pattern="archive renders five|archive renders as one|archive reel markup|build generates" tests/build-site.test.mjs
```

Expected: failure reports `archiveFeature`, the lead class, ledger items, and
the old CSS families.

- [ ] **Step 3: Remove the visual hierarchy field from canonical records**

Delete these keys without changing order, media, rights, or link data:

```json
"archiveFeature": "supporting",
```

from `heart-of-steel.md` and `lying-game.md`, and:

```json
"archiveFeature": "lead",
```

from `overclocking.md`.

- [ ] **Step 4: Replace both Archive renderers with one complete renderer**

Replace `renderArchiveMediaCard`, `renderArchiveLedgerItem`, and the conditional
inside `renderArchive` with:

```js
function renderArchiveCard(item, lang) {
  const title = localize(item.title, lang);
  const role = localize(item.role, lang);
  const watchLabel = localize(item.watchLabel, lang);
  const hasWatch = Boolean(item.watchUrl && watchLabel);
  const hasPoster = Boolean(item.posterImage);
  const indexLabel = String(item.order).padStart(2, "0");
  const focalPoint = item.posterFocalPoint;
  const focalStyle = focalPoint
    ? ` style="object-position: ${Number(focalPoint.x) * 100}% ${Number(focalPoint.y) * 100}%"`
    : "";
  const hasApprovedCardReel =
    item.cardReelMode === "after-hold" &&
    item.cardReelUrl &&
    item.cardReelPoster;
  const image = hasPoster
    ? `<img class="archive-card-image" src="${escapeHtml(item.posterImage)}" alt="${escapeHtml(localize(item.imageAlt, lang))}" loading="lazy" decoding="async" onerror="this.remove()"${focalStyle}>`
    : "";
  const reel = hasApprovedCardReel
    ? `<video class="archive-card-reel" data-archive-reel-video data-archive-reel-mode="after-hold" muted loop playsinline webkit-playsinline preload="none" poster="${escapeHtml(item.cardReelPoster)}" aria-hidden="true" tabindex="-1"${focalStyle}><source src="${escapeHtml(item.cardReelUrl)}" type="video/mp4"></video>`
    : "";
  const action = hasWatch
    ? `<span class="archive-card-action">${escapeHtml(watchLabel)} <span aria-hidden="true">↗</span></span>`
    : "";
  const tag = hasWatch ? "a" : "article";
  const linkAttrs = hasWatch
    ? ` href="${escapeHtml(item.watchUrl)}" target="_blank" rel="noreferrer" aria-label="${escapeHtml(`${watchLabel}: ${title}`)}"`
    : "";
  const mediaClass = hasPoster
    ? "archive-card-media"
    : "archive-card-media archive-card-media-placeholder";

  return `
    <${tag} class="archive-card"${linkAttrs}>
      <span class="archive-card-copy">
        <span class="work-meta">${escapeHtml(item.year)} / ${escapeHtml(role)}</span>
        <strong>${escapeHtml(title)}</strong>
        ${action}
      </span>
      <span class="${mediaClass}">
        <span class="archive-card-index" aria-hidden="true">${indexLabel}</span>
        ${image}
        ${reel}
      </span>
    </${tag}>
  `;
}

function renderArchive(archive, lang) {
  return `
    <div class="archive-chronology">
      ${archive.map((item) => renderArchiveCard(item, lang)).join("")}
    </div>
  `;
}
```

Keep the existing `data-archive-reel-video` runtime in `src/main.js` unchanged.

- [ ] **Step 5: Replace the old Archive CSS component family**

Remove `.archive-item`, `.archive-media-card`,
`.archive-media-card-lead`, and their descendant rules. Use this component
contract:

```css
.archive-chronology {
  display: grid;
  gap: 1px;
  grid-auto-rows: 1fr;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.archive-card {
  aspect-ratio: 80 / 27;
  background: var(--panel);
  border: 1px solid var(--line);
  color: var(--ink);
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  min-width: 0;
  overflow: hidden;
  text-decoration: none;
}

.archive-card-copy {
  align-content: space-between;
  display: grid;
  gap: clamp(0.35rem, 0.8vw, 0.7rem);
  min-width: 0;
  padding: clamp(0.7rem, 1.4vw, 1.1rem);
}

.archive-card-copy > strong {
  font-size: clamp(1rem, 1.65vw, 1.55rem);
  letter-spacing: -0.02em;
  line-height: 0.96;
  overflow-wrap: anywhere;
}

.archive-card-copy .work-meta {
  font-size: clamp(0.56rem, 0.75vw, 0.72rem);
  line-height: 1.25;
}

.archive-card-action {
  align-items: center;
  display: inline-flex;
  font-size: clamp(0.56rem, 0.68vw, 0.66rem);
  font-weight: 900;
  gap: 0.35rem;
  letter-spacing: 0.08em;
  line-height: 1.2;
  text-transform: uppercase;
  width: fit-content;
}

.archive-card-media {
  background: #111113;
  display: grid;
  min-width: 0;
  overflow: hidden;
  place-items: center;
  position: relative;
}

.archive-card-index {
  color: rgba(247, 242, 232, 0.28);
  font-size: clamp(2.2rem, 5vw, 4.8rem);
  font-weight: 900;
  letter-spacing: -0.06em;
  line-height: 1;
}

.archive-card-image,
.archive-card-reel {
  height: 100%;
  inset: 0;
  object-fit: cover;
  object-position: center;
  position: absolute;
  width: 100%;
}

.archive-card-image {
  transition: transform 500ms cubic-bezier(0.2, 0.75, 0.2, 1);
}

.archive-card-reel {
  opacity: 0;
  pointer-events: none;
  transition: opacity 180ms ease;
}

.archive-card-reel.is-playing {
  opacity: 1;
}

a.archive-card:hover .archive-card-image {
  transform: scale(1.025);
}

a.archive-card:focus-visible {
  outline: 2px solid var(--acid);
  outline-offset: 3px;
}
```

Keep the current single-column breakpoint, but delete all lead-card overrides:

```css
@media (max-width: 980px) {
  .archive-chronology {
    grid-template-columns: 1fr;
  }
}
```

Inside `@media (max-width: 460px)`, add:

```css
.archive-card-copy {
  gap: 0.3rem;
  padding: 0.58rem;
}

.archive-card-copy > strong {
  font-size: clamp(0.86rem, 4vw, 1rem);
}

.archive-card-action {
  letter-spacing: 0.04em;
}
```

Inside `@media (prefers-reduced-motion: reduce)`, add:

```css
.archive-card-reel {
  display: none;
}
```

- [ ] **Step 6: Update the existing reel-style test to the new class name**

Use:

```js
assert.match(
  css,
  /\.archive-card-image,\s*\.archive-card-reel \{[\s\S]*?height: 100%;[\s\S]*?object-fit: cover;[\s\S]*?object-position: center;[\s\S]*?position: absolute;[\s\S]*?width: 100%;/,
);
assert.match(
  css,
  /\.archive-card-reel \{[\s\S]*?opacity: 0;[\s\S]*?pointer-events: none;[\s\S]*?transition: opacity/,
);
assert.match(css, /\.archive-card-reel\.is-playing \{\s*opacity: 1;/);
assert.match(
  css,
  /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.archive-card-reel \{[\s\S]*?display: none;/,
);
```

- [ ] **Step 7: Run focused Archive tests**

```bash
node --test --test-name-pattern="archive renders five|archive renders as one|Overclocking|archive reel|build generates" tests/build-site.test.mjs
```

Expected: all five works use the same renderer, Overclocking retains its
after-hold reel, and all old hierarchy fingerprints are absent.

- [ ] **Step 8: Commit the unified Archive**

```bash
git add content/archive/heart-of-steel.md content/archive/lying-game.md content/archive/overclocking.md scripts/build-site.mjs src/styles.css tests/build-site.test.mjs
git diff --cached --check
git commit -m "feat: unify archive cards"
```

### Task 6: Propagate Canonical Copy Into The Generated Figma SVG Handoff

**Files:**
- Modify: `tests/figma-export.test.mjs`
- Modify: `scripts/build-figma-export.mjs`
- Modify: `figma-export/01-desktop-home.svg`
- Modify: `figma-export/02-desktop-works-logos.svg`
- Modify: `figma-export/03-mobile-home.svg`
- Modify: `figma-export/README.md`

- [ ] **Step 1: Write the failing export-parity test**

Extend `Figma SVG export keeps portfolio layers editable and named`:

```js
for (const slug of [
  "slow-steps",
  "tech-dreamers",
  "my-art-my-voice",
  "interior-spatial-brand-films",
  "pts-taigi-bus",
  "top-gear-china-uk-special",
]) {
  assert.match(worksLogos, new RegExp(`id="component-work-card-${slug}"`));
}
assert.match(worksLogos, /Design &amp; Brand Films/);
assert.doesNotMatch(worksLogos, /Interior Design &amp; Branded Films/);
assert.match(desktopHome, /id="layer-contact-heading"/);
assert.match(desktopHome, /Let’s build/);
assert.match(desktopHome, /a story/);
assert.match(desktopHome, /together\./);
assert.match(worksLogos, /data:image\/webp;base64,/);
```

- [ ] **Step 2: Run the Figma export test and verify missing canonical works**

```bash
node --test tests/figma-export.test.mjs
```

Expected: failure reports that the three later Featured Works and the explicit
contact heading are absent from the current SVG output.

- [ ] **Step 3: Load every canonical Featured Work**

Change the `node:fs` import to include `readdirSync`:

```js
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
```

Replace the hard-coded three-file `works` array in `main()` with:

```js
const works = readdirSync(join(root, "content/works"))
  .filter((file) => file.endsWith(".md"))
  .map((file) => parseFrontmatter(`content/works/${file}`))
  .filter((work) => work.featured)
  .sort((a, b) => a.order - b.order);
```

Update `imageData` so canonical WebP files retain their real MIME type:

```js
function imageData(path) {
  if (/^https?:\/\//.test(path)) return path;
  const fullPath = join(root, "public", path.replace(/^\//, ""));
  const ext = extname(fullPath).toLowerCase();
  const mime = ext === ".png"
    ? "image/png"
    : ext === ".svg"
      ? "image/svg+xml"
      : ext === ".webp"
        ? "image/webp"
        : "image/jpeg";
  return `data:${mime};base64,${readFileSync(fullPath).toString("base64")}`;
}
```

- [ ] **Step 4: Render all six work cards in two rows**

Replace the card mapping in `buildDesktopWorksLogos` with:

```js
const cards = works
  .map((work, index) =>
    workCard({
      work,
      x: 72 + (index % 3) * 430,
      y: 290 + Math.floor(index / 3) * 440,
      width: 390,
    }),
  )
  .join("\n");
```

Set that SVG frame to `height: 1660`. Move the logo-wall section below the
second card row using these exact coordinates:

```js
const logos = collaborations
  .map((item, index) =>
    logoWordmark({
      item,
      x: 72 + (index % 4) * 330,
      y: 1370 + Math.floor(index / 4) * 92,
      width: 220,
    }),
  )
  .join("\n");
```

Use `y="1280"` for the logo-wall kicker and `y="1326"` for its descriptive
line.

- [ ] **Step 5: Add canonical contact lines to the desktop home SVG**

Set the desktop home SVG height to `1420` and add this group after the
availability group:

```js
<g id="layer-contact-heading">
  <text x="72" y="1080" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="72" font-weight="900">${escapeXml(hero.contactTitleLead)}</text>
  <text x="72" y="1152" fill="${tokens.ink}" font-family="Inter, Arial, sans-serif" font-size="72" font-weight="900">${escapeXml(hero.contactTitleBridge ? `${hero.contactTitleBridge} ` : "")}<tspan fill="${tokens.acid}">${escapeXml(hero.contactTitleAccent)}</tspan></text>
</g>
```

- [ ] **Step 6: Regenerate and test the design output**

```bash
npm run figma:export
node --test tests/figma-export.test.mjs
git diff --check -- scripts/build-figma-export.mjs tests/figma-export.test.mjs figma-export
```

Expected: all six canonical work IDs, `Design & Brand Films`, and the two
contact lines appear in the generated SVG files; no old Design title appears.

- [ ] **Step 7: Commit generator and generated output together**

```bash
git add scripts/build-figma-export.mjs tests/figma-export.test.mjs figma-export/01-desktop-home.svg figma-export/02-desktop-works-logos.svg figma-export/03-mobile-home.svg figma-export/README.md
git diff --cached --check
git commit -m "feat: sync featured copy to design export"
```

### Task 7: Run Deterministic And Responsive QA

**Files:**
- Verify: all in-scope source, generated output, media, and tests
- Create: `docs/reviews/archive-uniformity-and-english-copy-v1-2026-08-03.md`

- [ ] **Step 1: Run the complete deterministic suite**

```bash
npm test
npm run build
npm run figma:export
git diff --check
```

Expected: every test passes, both language builds succeed, the Figma export
succeeds, and the whitespace check produces no output.

- [ ] **Step 2: Prove retired fingerprints are absent from active output**

```bash
rg -n "Interior Design & Branded Films|archive-media-card|archive-media-card-lead|archive-item|archiveFeature|contact-title-lead\">Let’s build a story" content data scripts src dist/en dist/zh figma-export
```

Expected: no matches. Historical specs and reviews are outside this active
layer search and remain untouched.

- [ ] **Step 3: Re-verify the final media files**

```bash
shasum -a 256 public/assets/showreel/overclocking-card-reel.mp4 public/assets/showreel/overclocking-card-reel-poster.webp public/assets/showreel/website-visual-reel.mp4
```

Expected: the three SHA-256 values from Task 1 are unchanged.

- [ ] **Step 4: Start an identity-checked local preview**

First run:

```bash
lsof -nP -iTCP:57888 -sTCP:LISTEN
```

Expected: no output. If a process already owns `57888`, leave it alone and use
`57889` for every command and record in this task. Otherwise run:

```bash
python3 -m http.server 57888 -d dist
```

In another command session verify the intended build fingerprint:

```bash
curl -s http://localhost:57888/en/
```

Expected response contains `Design &amp; Brand Films`, `archive-card`,
`contact-title-bridge`, and the Overclocking reel asset path, and does not
contain the old Design title or Archive lead class.

- [ ] **Step 5: Run browser QA with the current webapp-testing skill**

Before browser automation, read `webapp-testing/SKILL.md` from the current
catalog. Inspect English and Chinese at:

```text
1440 × 900
1200 × 900
834 × 1112
390 × 844
360 × 800
```

For each state verify:

- six Featured Work titles and the updated English copy render without
  clipping;
- the Design & Brand Films screening-strip thumbnail uses the new title;
- Tech Dreamers shows its media link and the visible official-page card;
- near-16:9 Featured media frames share the vertical midpoint of their desktop
  media column within a two-pixel tolerance;
- Archive cards are equal within each responsive state, use a 40/60 internal
  split, and the fifth card stays in the left half of the final desktop row;
- text-only Archive cards show `01` and `02`, while Heart of Steel, Lying Game,
  and Overclocking show canonical media;
- Overclocking waits about 1400 ms, reveals only after playback, and resets to
  the poster after leaving the threshold;
- the contact heading has exactly two rendered lines and only `together.` is
  acid green;
- no horizontal body or component overflow occurs.

Repeat the critical states with reduced motion, JavaScript disabled, and
keyboard-only navigation. Reduced motion and no-JavaScript must retain posters
and links. Focus outlines must remain visible.

- [ ] **Step 6: Record observed QA evidence**

Create
`docs/reviews/archive-uniformity-and-english-copy-v1-2026-08-03.md`. Record the
exact branch and commit, local preview port, commands and pass/fail outputs,
media hashes, five viewport results, reduced-motion/no-JavaScript/keyboard
results, intentional visual changes, unchanged Chinese copy, preserved
duplicate review file, and deployment status. Use `PASS`,
`PASS_WITH_OPEN_ITEMS`, or `BLOCKED` only after the evidence supports it; do
not include unobserved claims or placeholder values.

- [ ] **Step 7: Commit the QA record**

```bash
git add docs/reviews/archive-uniformity-and-english-copy-v1-2026-08-03.md
git diff --cached --check
git commit -m "docs: record archive and copy QA"
```

### Task 8: Publish And Verify A Non-Production Vercel Preview

**Files:**
- Modify: `STATUS.md`
- Modify: `docs/reviews/archive-uniformity-and-english-copy-v1-2026-08-03.md`

- [ ] **Step 1: Load the deployment contract**

Read `vercel-deploy/SKILL.md` from the current catalog. Confirm the command is
a Preview deployment and does not include `--prod`, production aliasing, or
domain promotion.

- [ ] **Step 2: Deploy from the verified repository root**

```bash
npm run build
PORTFOLIO_PREVIEW_URL="$(vercel deploy --yes)"
printf '%s\n' "$PORTFOLIO_PREVIEW_URL"
vercel inspect "$PORTFOLIO_PREVIEW_URL"
curl -I "$PORTFOLIO_PREVIEW_URL/en/"
curl -I "$PORTFOLIO_PREVIEW_URL/zh/"
curl -i "$PORTFOLIO_PREVIEW_URL/api/contact"
```

Expected: Vercel returns a new immutable Preview URL and `vercel inspect`
reports its deployment ID. Record both exact values. Do not modify production
routing.

- [ ] **Step 3: Verify the public Preview and endpoint without sending email**

Review the three HTTP responses produced in Step 2 and record their exact
status codes and the `/api/contact` JSON body in the dated review document.

Expected: English and Chinese pages return a successful response. A GET request
to `/api/contact` returns HTTP 405 with JSON `Method not allowed.` This proves
the endpoint is deployed without submitting a form or invoking Resend.

- [ ] **Step 4: Inspect the deployed build in the browser**

Open the English and Chinese Preview pages and repeat the 1440×900 and 390×844
critical checks: the English page uses the new Design title in both Featured
Work and small screening card, the Chinese title remains unchanged, and both
languages show the Tech Dreamers official card, centered large 16:9 media,
uniform Archive, Overclocking poster/reel, and exact two-line contact heading.

- [ ] **Step 5: Finalize review and resume state with observed values**

Update the dated review document with the exact Preview URL, deployment ID,
public verification results, and final outcome. Update `STATUS.md` with the
current package name, final reviewed commit, Preview URL, preserved closed
baseline tag, accepted open items, and the next exact action. Keep production
deployment explicitly unchanged. Do not alter historical review files.

- [ ] **Step 6: Commit the Preview provenance**

```bash
git add STATUS.md docs/reviews/archive-uniformity-and-english-copy-v1-2026-08-03.md
git diff --cached --check
git commit -m "docs: record portfolio preview"
```

- [ ] **Step 7: Final handoff**

Report the English and Chinese Preview links, final outcome, completed tests,
large-card centering result, uniform Archive result, production-untouched
status, exact final commit, and any genuinely open item. This final response is
the completion notification; do not claim that phone-level push notifications
are guaranteed by the coding session.
