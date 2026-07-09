# International Portfolio Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first, English-led bilingual international portfolio site for Hsin-Hsin Yuan with featured works, proof-point metrics, archive credits, and an AI / Language Lab section.

**Architecture:** Extend the existing zero-dependency static generator instead of introducing a frontend framework. Keep content in JSON and Markdown, generate `/en/`, `/zh/`, and `/` into `dist/`, and copy curated image assets into `public/assets/portfolio/`.

**Tech Stack:** Node.js ESM, built-in `node:test`, JSON data files, Markdown frontmatter, static HTML/CSS/JS, Vercel static deployment.

---

## File Structure

- Modify `scripts/build-site.mjs`: add loaders for impact items, archive credits, lab cards, richer site copy, and asset-aware render functions.
- Modify `tests/build-site.test.mjs`: add tests for new loaders, English default route, bilingual sections, archive metrics, and lab content.
- Modify `data/site.json`: replace current concise site copy with English-led international positioning and full Traditional Chinese copy.
- Create `data/impact.json`: bilingual proof-point metrics sourced from recent and old CV materials.
- Create `content/archive/*.md`: older credits with roles, metrics, platform, and source notes.
- Create `content/lab/*.md`: AI / Language Lab cards, including the Codex + Claude fact-checked series script workflow.
- Modify `content/works/*.md`: add poster images, tags, metrics, and expanded descriptions.
- Create `public/assets/portfolio/`: copied image assets from `/Users/hsin-hsinyuan/Downloads/其他/非常木蘭/`.
- Replace `src/styles.css`: international editorial visual system with mobile-first layouts.
- Modify `src/main.js`: keep horizontal scroll enhancement and add lightweight mobile-safe UI behavior if needed.
- Create `.gitignore`: exclude generated and system files before pushing to GitHub.
- Create `vercel.json`: document Vercel static deployment output behavior.

---

### Task 1: Add Data Loader Tests

**Files:**
- Modify: `tests/build-site.test.mjs`
- Later implementation target: `scripts/build-site.mjs`

- [ ] **Step 1: Add failing tests for new data loaders**

Append these tests to `tests/build-site.test.mjs`:

```js
test("loadImpact returns ordered bilingual proof points", () => {
  const impact = loadImpact(join(root, "data/impact.json"));

  assert.deepEqual(
    impact.map((item) => item.id),
    ["top-gear-reach", "top-gear-rating", "overclocking-audience", "public-funding", "paris-cultural-olympiad"],
  );
  assert.equal(impact[0].value, "200M");
  assert.match(impact[0].label.en, /viewers/i);
  assert.match(impact[1].detail.zh, /0.81/);
});

test("loadMarkdownCollection returns ordered archive and lab entries", () => {
  const archive = loadMarkdownCollection(join(root, "content/archive"));
  const lab = loadMarkdownCollection(join(root, "content/lab"));

  assert.equal(archive[0].slug, "top-gear-china-uk-special");
  assert.equal(archive[0].metrics[0].value, "200M");
  assert.equal(lab[0].slug, "verified-series-script-workflow");
  assert.match(lab[0].title.en, /Script/i);
});
```

Update the import at the top of `tests/build-site.test.mjs`:

```js
import {
  loadImpact,
  loadMarkdownCollection,
  loadSiteData,
  loadWorks,
  parseFrontmatter,
  renderPage,
} from "../scripts/build-site.mjs";
```

- [ ] **Step 2: Run tests and verify the new tests fail**

Run:

```bash
npm test
```

Expected: FAIL because `loadImpact` and `loadMarkdownCollection` are not exported yet.

- [ ] **Step 3: Commit the failing tests after repo setup is complete**

After Task 10 initializes git, commit with:

```bash
git add tests/build-site.test.mjs
git commit -m "test: cover portfolio redesign data loaders"
```

---

### Task 2: Add Portfolio Content Data

**Files:**
- Create: `data/impact.json`
- Create: `content/archive/top-gear-china-uk-special.md`
- Create: `content/archive/three-minute-micro-drama.md`
- Create: `content/archive/overclocking.md`
- Create: `content/archive/heart-of-steel.md`
- Create: `content/archive/lying-game.md`
- Create: `content/lab/verified-series-script-workflow.md`
- Create: `content/lab/documentary-listening-for-ai.md`

- [ ] **Step 1: Create `data/impact.json`**

```json
[
  {
    "id": "top-gear-reach",
    "order": 1,
    "value": "200M",
    "label": {
      "en": "viewers for Top Gear China S02E05",
      "zh": "《巔峰拍檔》中國版第二季第五集觀眾"
    },
    "detail": {
      "en": "Old English CV notes the series had previously averaged 9M viewers.",
      "zh": "舊英文履歷記載該系列過往平均約 900 萬觀眾。"
    },
    "sourceNote": "Hsin hsin Yuan CV.docx"
  },
  {
    "id": "top-gear-rating",
    "order": 2,
    "value": "#1",
    "label": {
      "en": "variety rating slot",
      "zh": "同時段綜藝類收視冠軍"
    },
    "detail": {
      "en": "The UK special set a 0.81 series rating record.",
      "zh": "英國篇創下系列收視紀錄 0.81。"
    },
    "sourceNote": "袁欣欣 简历.docx"
  },
  {
    "id": "overclocking-audience",
    "order": 3,
    "value": "600K",
    "label": {
      "en": "viewers in South India",
      "zh": "印度南部觀眾"
    },
    "detail": {
      "en": "Tamil-language version of Overclocking was broadcast in South India.",
      "zh": "《Overclocking》印度語版本於印度南部播出，舊中文履歷記載收視率 66%。"
    },
    "sourceNote": "袁欣欣 简历.docx and Hsin hsin Yuan CV.docx"
  },
  {
    "id": "public-funding",
    "order": 4,
    "value": "NT$6M",
    "label": {
      "en": "public funding secured",
      "zh": "公共補助與國際合作資金"
    },
    "detail": {
      "en": "Funding records include Lying Game and Overclocking.",
      "zh": "包含《謊言遊戲》高畫質電視節目補助與《Overclocking》國科會節目補助。"
    },
    "sourceNote": "袁欣欣 简历.docx"
  },
  {
    "id": "paris-cultural-olympiad",
    "order": 5,
    "value": "24",
    "label": {
      "en": "artist groups documented",
      "zh": "巴黎文化奧運表演團隊與藝術家"
    },
    "detail": {
      "en": "My Art, My Voice and Taiwan in Motion documented Taiwan at the 2024 Paris Cultural Olympiad.",
      "zh": "《My Art, My Voice》與《Taiwan in Motion》記錄台灣參與 2024 巴黎文化奧運。"
    },
    "sourceNote": "xAI_AI_Tutor_Chinese_CV.md"
  }
]
```

- [ ] **Step 2: Create archive entries**

Create `content/archive/top-gear-china-uk-special.md`:

```md
---
{
  "slug": "top-gear-china-uk-special",
  "order": 1,
  "year": "2015",
  "title": {
    "en": "Top Gear China S02E05: UK Special",
    "zh": "東方衛視《巔峰拍檔》第二季第五集：英國篇"
  },
  "role": {
    "en": "China-side Director",
    "zh": "中方導演"
  },
  "platform": "Dragon TV / Oriental Satellite TV",
  "metrics": [
    {"value": "200M", "label": {"en": "viewers", "zh": "觀眾"}},
    {"value": "0.81", "label": {"en": "series rating record", "zh": "系列收視紀錄"}},
    {"value": "#1", "label": {"en": "variety slot", "zh": "同時段綜藝類冠軍"}}
  ],
  "sourceNote": "袁欣欣 简历.docx; Hsin hsin Yuan CV.docx"
}
---
Directed the China-side production for the UK special, coordinating across Chinese production needs and UK-facing material.
```

Create `content/archive/three-minute-micro-drama.md`, `content/archive/overclocking.md`, `content/archive/heart-of-steel.md`, and `content/archive/lying-game.md` using the same JSON frontmatter shape with `slug`, `order`, `year`, `title`, `role`, `platform`, `metrics`, and `sourceNote`.

- [ ] **Step 3: Create lab entries**

Create `content/lab/verified-series-script-workflow.md`:

```md
---
{
  "slug": "verified-series-script-workflow",
  "order": 1,
  "title": {
    "en": "Verified Series Script Workflow",
    "zh": "資料驗證型系列短影音劇本流程"
  },
  "kicker": {
    "en": "Codex x Claude writing room",
    "zh": "Codex x Claude 協作寫作室"
  },
  "summary": {
    "en": "A vibe-coding workflow for co-writing fact-checked short-form series scripts, originally developed for English teaching content and expandable to branded explainers.",
    "zh": "用 Codex 與 Claude 協作撰寫需要資料驗證的系列短影音劇本，原始場景是英語教學，也適合工商與知識型短影音。"
  }
}
---
This lab entry is the working home for the future skill name and workflow documentation.
```

Create `content/lab/documentary-listening-for-ai.md`:

```md
---
{
  "slug": "documentary-listening-for-ai",
  "order": 2,
  "title": {
    "en": "Documentary Listening for AI",
    "zh": "給 AI 的紀錄片式聆聽"
  },
  "kicker": {
    "en": "Language, tone, culture",
    "zh": "語言、語氣、文化"
  },
  "summary": {
    "en": "A practice of judging speech by rhythm, intent, context, and whether a voice sounds human rather than generic.",
    "zh": "用節奏、意圖、脈絡與真實感判斷語言，而不只判斷字面是否正確。"
  }
}
---
Connects documentary interview practice to AI-language evaluation.
```

- [ ] **Step 4: Run tests and verify loader tests still fail**

Run:

```bash
npm test
```

Expected: FAIL only because loader functions are not implemented yet.

---

### Task 3: Implement Data Loaders

**Files:**
- Modify: `scripts/build-site.mjs`
- Test: `tests/build-site.test.mjs`

- [ ] **Step 1: Export `loadMarkdownCollection` and `loadImpact`**

Add these functions below `loadWorks` in `scripts/build-site.mjs`:

```js
export function loadMarkdownCollection(dir) {
  if (!existsSync(dir)) return [];

  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const source = readFileSync(join(dir, file), "utf8");
      const parsed = parseFrontmatter(source);
      return {
        ...parsed.data,
        body: parsed.body.trim(),
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function loadImpact(file) {
  return JSON.parse(readFileSync(file, "utf8")).sort((a, b) => a.order - b.order);
}
```

- [ ] **Step 2: Extend `loadSiteData`**

Replace `loadSiteData` with:

```js
export function loadSiteData(baseDir = root) {
  return {
    site: JSON.parse(readFileSync(join(baseDir, "data/site.json"), "utf8")),
    collaborations: JSON.parse(readFileSync(join(baseDir, "data/collaborations.json"), "utf8")),
    impact: loadImpact(join(baseDir, "data/impact.json")),
    archive: loadMarkdownCollection(join(baseDir, "content/archive")),
    lab: loadMarkdownCollection(join(baseDir, "content/lab")),
  };
}
```

- [ ] **Step 3: Run tests**

Run:

```bash
npm test
```

Expected: existing render tests may still fail until the renderer is updated, but loader tests pass.

- [ ] **Step 4: Commit**

```bash
git add scripts/build-site.mjs data/impact.json content/archive content/lab tests/build-site.test.mjs
git commit -m "feat: add portfolio impact archive and lab data"
```

---

### Task 4: Copy Portfolio Image Assets

**Files:**
- Create: `public/assets/portfolio/`
- Modify later: `content/works/*.md`

- [ ] **Step 1: Create asset directory**

Run:

```bash
mkdir -p public/assets/portfolio
```

- [ ] **Step 2: Copy selected images**

Run:

```bash
cp "/Users/hsin-hsinyuan/Downloads/其他/非常木蘭/Shanghai00006.jpg" public/assets/portfolio/hsin-working-white-space.jpg
cp "/Users/hsin-hsinyuan/Downloads/其他/非常木蘭/Paris 00002.JPG" public/assets/portfolio/paris-cultural-olympiad-team.jpg
cp "/Users/hsin-hsinyuan/Downloads/其他/非常木蘭/My art my voice-1.png" public/assets/portfolio/my-art-my-voice-performance-1.png
cp "/Users/hsin-hsinyuan/Downloads/其他/非常木蘭/My art my voice-2.png" public/assets/portfolio/my-art-my-voice-performance-2.png
cp "/Users/hsin-hsinyuan/Downloads/其他/非常木蘭/My art my voice-7.png" public/assets/portfolio/my-art-my-voice-interview.png
cp "/Users/hsin-hsinyuan/Downloads/其他/非常木蘭/England 00003.jpg" public/assets/portfolio/top-gear-uk-special-car.jpg
cp "/Users/hsin-hsinyuan/Downloads/其他/非常木蘭/india 0003 (在印度被邀請去陌生人的婚禮).jpg" public/assets/portfolio/india-overclocking-production.jpg
```

- [ ] **Step 3: Verify assets**

Run:

```bash
find public/assets/portfolio -maxdepth 1 -type f
```

Expected: seven copied image files are listed.

- [ ] **Step 4: Commit**

```bash
git add public/assets/portfolio
git commit -m "feat: add portfolio visual assets"
```

---

### Task 5: Update Site Copy And Work Entries

**Files:**
- Modify: `data/site.json`
- Modify: `content/works/my-art-my-voice.md`
- Modify: `content/works/tech-dreamers.md`
- Modify: `content/works/slow-steps.md`
- Test: `tests/build-site.test.mjs`

- [ ] **Step 1: Update render test expectations**

In `tests/build-site.test.mjs`, change the render test assertions to:

```js
assert.match(html, /Documentary Director/);
assert.match(html, /AI-Language Creative/);
assert.match(html, /impact-grid/);
assert.match(html, /AI \/ Language Lab/);
assert.match(html, /Selected Archive/);
assert.match(html, /My Art, My Voice/);
assert.match(html, /Tech Dreamers/);
```

Change the build test Chinese assertions to:

```js
assert.match(zh, /紀錄片導演/);
assert.match(zh, /AI \/ Language Lab/);
assert.match(zh, /精選舊作/);
```

- [ ] **Step 2: Replace `data/site.json` with expanded bilingual copy**

Use this shape:

```json
{
  "en": {
    "metaTitle": "Hsin-Hsin Yuan | Documentary Director & AI-Language Creative",
    "metaDescription": "International portfolio of Hsin-Hsin Yuan, a documentary director, cross-cultural storyteller, and AI-language creative.",
    "name": "Hsin-Hsin Yuan",
    "navName": "HSIN-HSIN YUAN",
    "heroEyebrow": "Documentary / Language / Creative Systems",
    "heroTitle": "Hsin-Hsin Yuan",
    "heroRoles": ["Documentary Director", "Cross-Cultural Storyteller", "AI-Language Creative"],
    "heroSubcopy": "I build human stories across documentary, culture, technology, and language. My work moves between film sets, interviews, platforms, and AI-assisted creative workflows.",
    "impactLabel": "Selected Impact",
    "worksLabel": "Featured Works",
    "worksHint": "Swipe or scroll",
    "watchLabel": "Watch",
    "learnLabel": "Learn more",
    "comingLabel": "Coming 2026",
    "labTitle": "AI / Language Lab",
    "labSubcopy": "A living space for vibe coding, fact-checked short-form scripts, language judgment, and AI-assisted production workflows.",
    "archiveTitle": "Selected Archive",
    "archiveSubcopy": "Earlier television, scripted, factual, and international collaboration work with platform performance and funding context.",
    "createTitle": "What I Build",
    "services": [
      {"title": "Documentary films", "line": "Human stories with cultural and emotional precision."},
      {"title": "Cross-cultural production", "line": "Taiwan, Shanghai, Europe, and international teams."},
      {"title": "Technology stories", "line": "Founders, AI, deep tech, and the people behind systems."},
      {"title": "AI-language workflows", "line": "Scripts, prompts, skills, and judgment systems."}
    ],
    "collabTitle": "Platforms & Collaborations",
    "contactTitle": "Let’s build a story with signal.",
    "contactSubcopy": "For documentary, cultural, branded, AI-language, and cross-cultural production collaborations.",
    "contactCta": "Contact Hsin-Hsin",
    "email": "hsin54@yahoo.com"
  },
  "zh": {
    "metaTitle": "袁欣欣 | 紀錄片導演與 AI 語言創作者",
    "metaDescription": "袁欣欣的國際作品集：紀錄片導演、跨文化創作者、AI 語言與創作流程實驗者。",
    "name": "袁欣欣",
    "navName": "袁欣欣 / HSIN-HSIN YUAN",
    "heroEyebrow": "Documentary / Language / Creative Systems",
    "heroTitle": "Hsin-Hsin Yuan",
    "heroRoles": ["紀錄片導演", "跨文化敘事者", "AI-Language Creative"],
    "heroSubcopy": "我創作關於人、文化、科技與語言的故事。工作現場從紀錄片拍攝、訪談、平台內容，到 AI 輔助的創作流程。",
    "impactLabel": "代表成績",
    "worksLabel": "近年代表作",
    "worksHint": "滑動或捲動瀏覽",
    "watchLabel": "觀看作品",
    "learnLabel": "了解更多",
    "comingLabel": "2026 待播",
    "labTitle": "AI / Language Lab",
    "labSubcopy": "放置 vibe coding、資料驗證型短影音劇本、語言判斷與 AI 輔助製作流程的空間。",
    "archiveTitle": "精選舊作",
    "archiveSubcopy": "整理早期電視、戲劇、科學節目、國際合作與具平台成績的作品。",
    "createTitle": "我創造什麼",
    "services": [
      {"title": "紀錄片", "line": "以人為核心，處理文化與情感的細節。"},
      {"title": "跨文化製作", "line": "台灣、上海、歐洲與國際團隊合作經驗。"},
      {"title": "科技故事", "line": "創業者、AI、深科技，以及系統背後的人。"},
      {"title": "AI 語言工作流", "line": "劇本、prompt、skill 與判斷系統。"}
    ],
    "collabTitle": "合作與平台",
    "contactTitle": "一起做一個有訊號的故事。",
    "contactSubcopy": "紀錄片、文化內容、品牌短影音、AI 語言與跨文化製作合作洽詢。",
    "contactCta": "聯絡袁欣欣",
    "email": "hsin54@yahoo.com"
  }
}
```

- [ ] **Step 3: Add image and tags to work Markdown frontmatter**

For `my-art-my-voice.md`, add:

```json
"posterImage": "/assets/portfolio/my-art-my-voice-performance-2.png",
"tags": ["documentary", "arts", "identity", "Paris Cultural Olympiad"],
"metrics": [{"value": "24", "label": {"en": "artist groups", "zh": "表演團隊與藝術家"}}]
```

For `tech-dreamers.md`, add:

```json
"posterImage": "/assets/portfolio/hsin-working-white-space.jpg",
"tags": ["technology", "founders", "AI", "interview"],
"metrics": []
```

For `slow-steps.md`, add:

```json
"posterImage": "/assets/portfolio/paris-cultural-olympiad-team.jpg",
"tags": ["documentary", "upcoming", "movement"],
"metrics": []
```

- [ ] **Step 4: Run tests**

Run:

```bash
npm test
```

Expected: renderer assertions fail until Task 6 updates HTML output.

- [ ] **Step 5: Commit**

```bash
git add data/site.json content/works tests/build-site.test.mjs
git commit -m "feat: refresh bilingual portfolio content"
```

---

### Task 6: Update HTML Renderer

**Files:**
- Modify: `scripts/build-site.mjs`
- Test: `tests/build-site.test.mjs`

- [ ] **Step 1: Add localized helper functions**

Add below `otherLang`:

```js
function localize(value, lang) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[lang] ?? value.en ?? "";
  }
  return value ?? "";
}

function renderTags(tags = []) {
  return tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
}

function renderMetrics(metrics = [], lang) {
  if (!metrics.length) return "";

  return `
    <div class="mini-metrics">
      ${metrics
        .map(
          (metric) => `
            <div class="mini-metric">
              <strong>${escapeHtml(metric.value)}</strong>
              <span>${escapeHtml(localize(metric.label, lang))}</span>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}
```

- [ ] **Step 2: Add section render functions**

Add below `renderWork`:

```js
function renderImpact(impact, lang) {
  return impact
    .map(
      (item) => `
        <article class="impact-item">
          <strong>${escapeHtml(item.value)}</strong>
          <span>${escapeHtml(localize(item.label, lang))}</span>
          <p>${escapeHtml(localize(item.detail, lang))}</p>
        </article>
      `,
    )
    .join("");
}

function renderLab(lab, lang) {
  return lab
    .map(
      (item) => `
        <article class="lab-card">
          <p class="card-kicker">${escapeHtml(localize(item.kicker, lang))}</p>
          <h3>${escapeHtml(localize(item.title, lang))}</h3>
          <p>${escapeHtml(localize(item.summary, lang))}</p>
        </article>
      `,
    )
    .join("");
}

function renderArchive(archive, lang) {
  return archive
    .map(
      (item) => `
        <article class="archive-item">
          <div>
            <p class="work-meta">${escapeHtml(item.year)} / ${escapeHtml(localize(item.role, lang))} / ${escapeHtml(item.platform)}</p>
            <h3>${escapeHtml(localize(item.title, lang))}</h3>
          </div>
          ${renderMetrics(item.metrics, lang)}
        </article>
      `,
    )
    .join("");
}
```

- [ ] **Step 3: Update `renderWork`**

Inside `renderWork`, after the description paragraph, render tags and metrics:

```js
        <p class="work-description">${escapeHtml(description)}</p>
        ${renderTags(work.tags)}
        ${renderMetrics(work.metrics, lang)}
        ${action}
```

- [ ] **Step 4: Replace hero and add sections in `renderPage`**

In `renderPage`, replace the current hero line logic with:

```js
  const heroRoles = copy.heroRoles.map((role) => `<span>${escapeHtml(role)}</span>`).join("<span class=\"slash\">/</span>");
```

Replace the hero section with:

```html
        <section class="hero">
          <div class="hero-media" aria-hidden="true"></div>
          <div class="hero-content">
            <p class="eyebrow">${escapeHtml(copy.heroEyebrow)}</p>
            <h1>${escapeHtml(copy.heroTitle)}</h1>
            <div class="hero-roles">${heroRoles}</div>
            <p class="hero-subcopy">${escapeHtml(copy.heroSubcopy)}</p>
          </div>
        </section>
```

Insert after hero:

```html
        <section class="section impact-section">
          <h2 class="section-title">${escapeHtml(copy.impactLabel)}</h2>
          <div class="impact-grid">${renderImpact(site.impact, lang)}</div>
        </section>
```

Insert after services:

```html
        <section class="section lab-section">
          <div class="section-intro">
            <h2 class="section-title">${escapeHtml(copy.labTitle)}</h2>
            <p>${escapeHtml(copy.labSubcopy)}</p>
          </div>
          <div class="lab-grid">${renderLab(site.lab, lang)}</div>
        </section>

        <section class="section archive-section">
          <div class="section-intro">
            <h2 class="section-title">${escapeHtml(copy.archiveTitle)}</h2>
            <p>${escapeHtml(copy.archiveSubcopy)}</p>
          </div>
          <div class="archive-list">${renderArchive(site.archive, lang)}</div>
        </section>
```

- [ ] **Step 5: Change root redirect to English**

In `build()`, replace the root redirect write with:

```js
  writeFileSync(join(dist, "index.html"), '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=/en/">');
```

- [ ] **Step 6: Run tests**

Run:

```bash
npm test
```

Expected: PASS after renderer and data changes are complete.

- [ ] **Step 7: Commit**

```bash
git add scripts/build-site.mjs tests/build-site.test.mjs
git commit -m "feat: render redesigned portfolio sections"
```

---

### Task 7: Replace CSS With International Mobile-First Design

**Files:**
- Modify: `src/styles.css`
- Test: generated `dist/styles.css`

- [ ] **Step 1: Replace visual tokens and hero styles**

Replace the top of `src/styles.css` through `.hero-subcopy` with a mobile-first design using:

```css
:root {
  --bg: #0b0b0c;
  --ink: #f7f2e8;
  --muted: #b8b0a3;
  --line: rgba(247, 242, 232, 0.18);
  --panel: rgba(255, 255, 255, 0.055);
  --acid: #d8ff3e;
  --heat: #ff4d1f;
  --blue: #7cc7ff;
}

* {
  box-sizing: border-box;
}

html {
  background: var(--bg);
  color: var(--ink);
  font-family: Inter, "Noto Sans TC", "PingFang TC", "Helvetica Neue", Arial, sans-serif;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-width: 320px;
  background: var(--bg);
}

a {
  color: inherit;
}

.site-shell {
  overflow: hidden;
}

.topbar {
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  left: 0;
  padding: 1rem clamp(1rem, 4vw, 3rem);
  position: fixed;
  right: 0;
  top: 0;
  z-index: 20;
}

.brand,
.language-switch,
.eyebrow,
.section-title,
.work-meta,
.card-kicker {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.language-switch {
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--ink);
  padding: 0.5rem 0.78rem;
  text-decoration: none;
}

.hero {
  display: grid;
  min-height: 100svh;
  overflow: hidden;
  padding: 6rem clamp(1rem, 5vw, 4rem) 2rem;
  position: relative;
}

.hero-media {
  background:
    linear-gradient(90deg, rgba(11, 11, 12, 0.2), rgba(11, 11, 12, 0.72)),
    url("/assets/portfolio/hsin-working-white-space.jpg") center / cover;
  inset: 0;
  opacity: 0.62;
  position: absolute;
}

.hero-content {
  align-self: end;
  max-width: 1180px;
  position: relative;
  z-index: 1;
}

.hero h1 {
  font-size: clamp(4.4rem, 15vw, 14rem);
  letter-spacing: 0;
  line-height: 0.82;
  margin: 0;
  max-width: 8ch;
  text-transform: uppercase;
}

.hero-roles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0.7rem;
  margin-top: 1.2rem;
  max-width: 860px;
}

.hero-roles span {
  color: var(--acid);
  font-size: clamp(1rem, 2vw, 1.6rem);
  font-weight: 800;
}

.hero-roles .slash {
  color: var(--muted);
}

.hero-subcopy {
  color: var(--ink);
  font-size: clamp(1rem, 2vw, 1.35rem);
  line-height: 1.45;
  max-width: 680px;
}
```

- [ ] **Step 2: Add section, impact, lab, archive, and mobile styles**

Add styles for:

```css
.section { padding: clamp(3.5rem, 9vw, 7rem) clamp(1rem, 5vw, 4rem); }
.section-intro { max-width: 720px; margin-bottom: 1.5rem; }
.section-intro p { color: var(--muted); font-size: 1.1rem; line-height: 1.5; }
.impact-grid { display: grid; gap: 1px; grid-template-columns: repeat(5, minmax(0, 1fr)); }
.impact-item { background: var(--panel); border: 1px solid var(--line); min-height: 220px; padding: 1.2rem; }
.impact-item strong { color: var(--acid); display: block; font-size: clamp(2.5rem, 6vw, 5rem); line-height: 0.9; }
.impact-item span { display: block; font-size: 1rem; font-weight: 800; line-height: 1.1; margin-top: 0.8rem; }
.impact-item p { color: var(--muted); line-height: 1.45; }
.tag { border: 1px solid var(--line); border-radius: 999px; color: var(--muted); display: inline-block; font-size: 0.72rem; margin: 0 0.35rem 0.6rem 0; padding: 0.35rem 0.55rem; }
.mini-metrics { display: flex; flex-wrap: wrap; gap: 0.75rem; margin: 1rem 0 1.2rem; }
.mini-metric { border-top: 1px solid var(--line); min-width: 110px; padding-top: 0.5rem; }
.mini-metric strong { color: var(--acid); display: block; font-size: 1.5rem; }
.mini-metric span { color: var(--muted); font-size: 0.82rem; }
.lab-grid { display: grid; gap: 1px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.lab-card { background: var(--panel); border: 1px solid var(--line); min-height: 250px; padding: clamp(1rem, 3vw, 1.8rem); }
.lab-card h3 { font-size: clamp(2rem, 4vw, 4rem); letter-spacing: 0; line-height: 0.95; margin: 0 0 1rem; }
.lab-card p { color: var(--muted); line-height: 1.5; }
.archive-list { display: grid; gap: 1px; }
.archive-item { align-items: start; background: var(--panel); border: 1px solid var(--line); display: grid; gap: 1rem; grid-template-columns: minmax(0, 1fr) auto; padding: 1.2rem; }
.archive-item h3 { font-size: clamp(1.5rem, 3vw, 3rem); letter-spacing: 0; line-height: 1; margin: 0; }
```

Update the mobile media query:

```css
@media (max-width: 820px) {
  .topbar { position: absolute; }
  .brand { max-width: 14rem; }
  .hero { min-height: 92svh; }
  .hero h1 { font-size: clamp(3.4rem, 18vw, 6.5rem); max-width: 7ch; }
  .hero-media { background-position: 32% center; }
  .impact-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .impact-item { min-height: 170px; }
  .works-head { display: block; }
  .works-track { grid-auto-columns: minmax(88vw, 1fr); }
  .work-panel { display: block; min-height: auto; }
  .services-grid,
  .collab-grid,
  .lab-grid,
  .approach { grid-template-columns: 1fr; }
  .archive-item { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Run build and inspect generated CSS**

Run:

```bash
npm run build
```

Expected: `dist/styles.css` exists and contains `.impact-grid`, `.lab-grid`, and `.archive-list`.

- [ ] **Step 4: Commit**

```bash
git add src/styles.css dist/styles.css
git commit -m "style: redesign portfolio visual system"
```

---

### Task 8: Build And Browser Verify

**Files:**
- Generated: `dist/`

- [ ] **Step 1: Run tests and build**

Run:

```bash
npm test
npm run build
```

Expected: both commands pass.

- [ ] **Step 2: Start local server**

Run:

```bash
npm run serve
```

Expected: server runs at `http://localhost:4173`.

- [ ] **Step 3: Verify desktop**

Open:

```text
http://localhost:4173/en/
```

Check:

- Hero uses English-led typography.
- Impact appears near the top.
- Featured works show images.
- AI / Language Lab appears.
- Selected Archive appears.
- Language switch links to `/zh/`.

- [ ] **Step 4: Verify mobile**

Use a mobile viewport around 390px wide.

Check:

- Hero text does not clip.
- Impact grid fits in two columns.
- Work cards do not overflow.
- Archive entries stack cleanly.
- Language switch remains tappable.

- [ ] **Step 5: Commit generated output**

If this repo intentionally tracks `dist/`, run:

```bash
git add dist
git commit -m "build: generate redesigned portfolio site"
```

If Vercel builds from source and `dist/` is ignored, skip this commit.

---

### Task 9: Add Deployment Files

**Files:**
- Create: `.gitignore`
- Create: `vercel.json`
- Modify: `package.json` only if build scripts are missing

- [ ] **Step 1: Create `.gitignore`**

```gitignore
.DS_Store
node_modules/
.vercel/
npm-debug.log*
```

Do not ignore `dist/` if the user wants generated output committed. Ignore `dist/` only if Vercel is confirmed to build from source.

- [ ] **Step 2: Create `vercel.json`**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true
}
```

- [ ] **Step 3: Verify scripts**

Run:

```bash
npm run build
```

Expected: PASS and `dist/en/index.html` exists.

- [ ] **Step 4: Commit**

```bash
git add .gitignore vercel.json package.json
git commit -m "chore: configure vercel deployment"
```

---

### Task 10: Initialize Git And Connect Remote

**Files:**
- Git metadata only

- [ ] **Step 1: Initialize git if needed**

Run:

```bash
git init
```

Expected: `.git/` is created.

- [ ] **Step 2: Add GitHub remote**

Run:

```bash
git remote add origin git@github.com:projectmoonie-creator/hsin-hsin-yuan-portfolio.git
```

Expected: `origin` points to the user-provided repo.

- [ ] **Step 3: Confirm remote**

Run:

```bash
git remote -v
```

Expected output includes:

```text
origin	git@github.com:projectmoonie-creator/hsin-hsin-yuan-portfolio.git (fetch)
origin	git@github.com:projectmoonie-creator/hsin-hsin-yuan-portfolio.git (push)
```

- [ ] **Step 4: Make initial commit if no commits exist**

Run:

```bash
git add .
git commit -m "feat: redesign international portfolio site"
```

Expected: initial commit is created.

- [ ] **Step 5: Push**

Run:

```bash
git branch -M main
git push -u origin main
```

Expected: branch `main` is pushed to GitHub.

---

### Task 11: Connect Vercel

**Files:**
- Vercel project settings

- [ ] **Step 1: Import GitHub repo in Vercel**

Use Vercel dashboard and import:

```text
projectmoonie-creator/hsin-hsin-yuan-portfolio
```

- [ ] **Step 2: Use build settings**

Set:

```text
Framework Preset: Other
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

- [ ] **Step 3: Deploy**

Expected: Vercel deploys the static site and gives a preview URL.

- [ ] **Step 4: Verify deployed site**

Check:

- `/` opens English-led home.
- `/en/` opens English version.
- `/zh/` opens Traditional Chinese version.
- Images load from `/assets/portfolio/`.
- Mobile layout is usable.

---

## Self-Review

Spec coverage:

- English-led first impression: Task 5 and Task 6.
- Complete bilingual routes: Task 5 and Task 6.
- Mobile-first interface: Task 7 and Task 8.
- Mode Festival-inspired editorial energy: Task 7.
- Old CV proof points: Task 2 and Task 6.
- Featured recent works: Task 5 and Task 6.
- AI / vibe coding skill space: Task 2 and Task 6.
- GitHub + Vercel deployment: Task 9, Task 10, and Task 11.

Placeholder scan:

- No unresolved placeholder instructions are present.

Type consistency:

- `loadImpact(file)` returns array items with `id`, `order`, `value`, `label`, `detail`, and `sourceNote`.
- `loadMarkdownCollection(dir)` returns markdown items with JSON frontmatter plus `body`.
- `renderMetrics(metrics, lang)` expects `metrics[].value` and localized `metrics[].label`.
