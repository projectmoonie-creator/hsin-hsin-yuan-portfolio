# International Portfolio Site Redesign

## Goal

Redesign Hsin-Hsin Yuan's personal website into an international creative portfolio that presents her as a documentary director, cross-cultural storyteller, and AI-language creative. The site should feel polished enough for global platforms, brands, cultural institutions, AI/tech collaborators, and production partners, while keeping enough depth to show the scale of her older work and the direction of her newer work.

The site is not a traditional CV. It is a public creative identity system with selected proof, works, archive credits, and a living space for AI / vibe coding / skill experiments.

## Design Reference

Reference: https://www.modefestival.com

Use the reference for broad design language only:

- Large, confident hero typography
- Editorial poster-like sections
- Strong section naming
- Energetic scroll rhythm
- Image-forward layout
- International festival / creative platform feeling

Do not copy MODE's brand, ticketing structure, exact layouts, colors, wording, or visual assets. Translate the energy into a cinematic director portfolio with a more mature, personal tone.

Design phrase:

> International cinematic portfolio with editorial festival energy.

## Deployment Direction

Preferred deployment: Vercel.

Reason:

- The current site builds static files into `dist/`.
- Vercel works well with GitHub-backed automatic deploys and preview URLs.
- The user already has GitHub and Vercel accounts.
- GitHub repo: `https://github.com/projectmoonie-creator/hsin-hsin-yuan-portfolio`
- Recommended settings: framework preset `Other`, build command `npm run build`, output directory `dist`.

Cloudflare Pages and Netlify remain valid alternatives, but Vercel is the default recommendation for this project.

## Audience

- International streaming and documentary platforms
- Cultural institutions and festival collaborators
- Brands and production companies
- AI, language, and creative technology teams
- Cross-cultural media partners
- Mandarin / English production and storytelling collaborators

## Positioning

Primary identity:

- Documentary Director
- Cross-Cultural Storyteller
- AI-Language Creative

Expanded identity:

Hsin-Hsin works across documentary, television, scripted and factual production, multilingual interviews, language judgment, and AI-assisted creative workflows. The site should show that she can lead human stories, understand platform performance, work internationally, and experiment with new AI production methods.

## Language Strategy

Use full bilingual routes:

- `/zh/`: complete Traditional Chinese version
- `/en/`: complete English version
- `/`: default entry should lead with the English version or redirect to `/en/`

The two versions should feel equally intentional, not like one is a partial translation of the other. English can lead with international positioning. Chinese can preserve more warmth, specificity, and the lived texture of her career.

First impression should be English-led because the large English typography supports the international editorial feeling better. Chinese remains complete and easy to reach through a visible language switch.

Allow selective mixed-language usage where natural:

- Keep original work titles such as `My Art, My Voice`, `Tech Dreamers`, and `Slow Steps`.
- Keep terms such as `vibe coding`, `skills`, `AI workflows`, and `language lab` when they are clearer than forced translation.
- Use bilingual micro-labels sparingly in high-impact areas if it increases international texture.

Avoid dense sentence-by-sentence bilingual mixing inside body copy. Readers should be able to choose one language and scan comfortably.

## Information Architecture

### 1. Hero

Purpose: Establish Hsin-Hsin's current identity quickly.

Content:

- Name
- Role line: Documentary Director / Cross-Cultural Storyteller / AI-Language Creative
- Short one- or two-sentence intro
- Language switch
- Optional primary contact CTA

Visual behavior:

- Big name and strong editorial scale
- Cinematic image or poster-like background treatment if usable assets exist
- Clear first-viewport signal that this is a personal creative portfolio, not only a CV page

### 2. Impact

Purpose: Make older high-performing work count immediately.

Use an impact strip or grid near the top of the page. This should feel like proof points, not resume clutter.

Candidate proof points:

- `200M viewers` for Top Gear China S02E05, with old English CV noting the series previously averaged 9 million
- `#1 variety rating slot` for Top Gear China S02E05 UK Special
- `0.81 rating` from the old Chinese CV for Top Gear China S02E05
- `$180,000US grant` / `NT$6M public funding` for Lying Game, depending on language and public wording
- `NT$6M science program funding` for Overclocking
- `600K viewers` for the Tamil-language version of Overclocking in South India
- `66% rating` for Overclocking, sourced from old Chinese CV wording
- `24 artist groups` documented through My Art, My Voice / Taiwan in Motion

Data handling:

- Keep a `sourceNote` or internal content field for statistics whose wording comes from old CV files.
- Avoid overclaiming when old files use slightly different wording. Prefer phrases such as "reported in earlier CV materials" internally, and use polished public wording on the page.

### 3. Featured Works

Purpose: Present current and near-current work first.

Featured works:

- My Art, My Voice / Taiwan in Motion
- Tech Dreamers
- Slow Steps

Each work should include:

- Title
- Year
- Role
- Platform / status
- Short editorial description
- Link when public
- Optional image / poster / placeholder
- Selected relevance tags such as documentary, arts, technology, AI, identity, cross-cultural, interview

Design:

- Large image/video panels
- Horizontal or poster-grid rhythm inspired by the current site and Mode's event energy
- Mobile should remain easy to swipe or scroll

### 4. AI / Language Lab

Purpose: Create space for vibe coding, skills, AI workflows, and language judgment without making the whole site feel like an engineering blog.

Possible section title:

- AI / Language Lab
- Vibe Coding & Language Lab
- Creative Systems Lab

Content types:

- AI Tutor / Chinese language judgment positioning
- Mandarin / English voice sample links
- AI-assisted production workflows
- Skills and prompt-driven creative systems
- Future writeups or project cards for personal tools

Initial cards:

- Chinese Language Judgment
- Documentary Listening for AI
- Vibe Coding / Skills: a Codex + Claude workflow for co-writing fact-checked short-form series scripts
- AI-Assisted Production Workflows

Known skill concept:

- Working purpose: help Codex and Claude co-write series scripts for short-form videos that require source verification.
- Original use case: English teaching content.
- Likely expansion: branded content, sponsored short-form series, explainers, social video production, and other information-heavy formats where accuracy and narrative structure both matter.
- Naming is not final. Temporary labels for planning: `Verified Script Lab`, `Series Script Engine`, `Fact-Checked Vibe Studio`, or `Codex x Claude Script Room`.

Tone:

Experimental, intelligent, and human. It should connect AI to listening, language, culture, and production judgment, not only tools.

### 5. Selected Archive

Purpose: Preserve older credits and performance data in a complete but elegant way.

Include:

- Top Gear China S02E05 UK Special
- Three-Minute Micro Drama series
- Overclocking
- Heart of Steel
- Lying Game
- Taiwan International Children's Film Festival
- Women Make Waves Film Festival selection jury
- Team Geek Production / Public Television Service Taiwan work
- Selected branded and online series credits when useful

Design:

- Editorial archive list, timeline, or accordion-like grouped credits
- Each archive item should support optional metrics, role, platform, year, and links
- Avoid a dense wall of resume bullets

### 6. Collaborations

Purpose: Show platform credibility.

Include existing and newly relevant collaborators:

- TaiwanPlus
- Public Television Service Taiwan
- Dragon TV / Oriental Satellite TV
- Women Make Waves Film Festival
- Taiwan International Children's Film Festival
- ScreenHouse
- Taiwan Ministry of Science and Technology / National Science Council reference where appropriate

### 7. Contact

Purpose: Make collaboration easy.

Include:

- Email
- Optional location / remote collaboration note
- Short CTA that covers documentary, cultural, brand, AI-language, and cross-cultural production work

## Content Sources

Primary recent source files:

- `xAI_AI_Tutor_Chinese_CV.md`
- `xAI_AI_Tutor_Chinese_Cover_Letter.md`
- `xAI_Portfolio_Voice_Sample_Links.md`
- `xAI_Voice_Sample_Scripts.md`

Older impact/stat sources:

- `/Users/hsin-hsinyuan/Work/2026/CV/袁欣欣purple cv 繁體.key`
- `/Users/hsin-hsinyuan/Work/2026/CV/袁欣欣 简历.docx`
- `/Users/hsin-hsinyuan/Work/2026/CV/Hsin hsin Yuan CV.docx`
- `/Users/hsin-hsinyuan/Work/2026/CV/袁欣欣2019.pdf`
- `/Users/hsin-hsinyuan/Work/2026/CV/Xin xin Yuan CV 1024.pdf`
- `/Users/hsin-hsinyuan/Work/2026/CV/袁欣欣CV 影片链结版.pdf`
- `/Users/hsin-hsinyuan/Work/2026/CV/袁欣欣 影片作品链结.pdf`

Word versions are preferred for extraction when available because old Chinese PDF text extraction is noisy.

Existing website sources:

- `data/site.json`
- `data/collaborations.json`
- `content/works/*.md`
- `scripts/build-site.mjs`
- `src/styles.css`
- `src/main.js`

## Data Model Direction

Keep the site Markdown-first and static.

Likely content additions:

- `data/impact.json` for homepage proof points
- `content/archive/*.md` for older credits
- extend `content/works/*.md` with tags, metrics, source notes, and richer poster/image fields
- optional `content/lab/*.md` for AI / language / vibe coding entries

The public page should not expose internal source notes unless they are useful to readers. Source notes are mainly for maintaining confidence in old statistics.

## Visual Direction

Use a mature, international palette with enough energy to avoid a conventional CV look.

Guidelines:

- Large typography
- Strong contrast
- Editorial spacing
- Image-led sections
- Short text blocks
- Impact numbers as design objects
- Avoid one-note dark slate or purple-only palettes
- Avoid decorative gradient blobs
- Cards only for repeated work/lab/archive items
- Make all text fit cleanly on mobile and desktop

The AI / Language Lab section may have a slightly more structured, system-like visual treatment, but it should still belong to the same site.

## Mobile Experience

Mobile is a first-class target because many viewers will arrive from email, Line, Instagram, WhatsApp, or mobile browser links.

Requirements:

- Hero typography must feel bold without clipping or overflowing.
- Language switching must stay visible and easy to tap.
- Impact numbers should become swipeable cards or a compact two-column grid.
- Featured works should become vertical image-led cards or a controlled horizontal swipe area.
- Archive credits should be grouped so the page does not feel like an endless resume.
- AI / Language Lab cards should be concise, tappable, and easy to scan.
- Contact CTA must be reachable without excessive scrolling.
- Test desktop and mobile before considering the redesign done.

## Implementation Approach

Use the existing static generator rather than switching frameworks unless the current generator blocks the design.

The current architecture is suitable:

- Node build script
- JSON site copy
- Markdown work entries
- generated `dist/`
- no backend

The redesign can extend this architecture with new data loaders and templates.

## Testing And Verification

Automated checks:

- Existing `node --test` suite should pass
- Add tests for new data loaders, impact items, archive entries, and lab entries
- Ensure both `/zh/` and `/en/` render key sections

Manual / visual checks:

- Build output in `dist/`
- Desktop and mobile browser review
- Hero first viewport has clear identity
- Impact strip is legible and not overcrowded
- Featured works render with media or graceful placeholders
- Archive stays readable
- AI / Language Lab feels integrated, not bolted on
- Language switch works

## Open Decision

The remaining design choice before implementation is how prominent the impact numbers should be:

- Strong and visible near the top
- More restrained as professional proof

Default recommendation: strong and visible near the top, because the old numbers help international viewers quickly understand scale.
