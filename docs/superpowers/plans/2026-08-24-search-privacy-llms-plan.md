# Search, Privacy, and `llms.txt` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans task-by-task. Do not dispatch subagents; this package has one implementation owner.

**Goal:** Generate bilingual Privacy pages and a concise `llms.txt`, connect them to the current portfolio, and preserve all approved homepage behavior.

**Architecture:** `data/privacy.json` owns bilingual notice text. `scripts/build-site.mjs` renders two static pages, adds them to sitemap, inserts locale-matched Contact links, and emits `llms.txt`. Existing tokens in `src/styles.css` style the new pages without a new visual system.

**Tech Stack:** Node.js ESM, static HTML/CSS generation, `node:test`, Vercel static `dist/`.

---

### Task 1: Focused discovery contract
**Files:** Create `tests/privacy-agent-discovery.test.mjs`.
- [ ] Add a real-build test that requires `dist/en/privacy/index.html`, `dist/zh/privacy/index.html`, and `dist/llms.txt`.
- [ ] Assert same-language homepage links, privacy canonical/hreflang, all four sitemap URLs, actual form fields/providers/purposes/rights, and no private email or secret.
- [ ] Run `node --test tests/privacy-agent-discovery.test.mjs`.
- [ ] Expected RED: required Privacy/`llms.txt` artifacts do not exist.

### Task 2: Structured Privacy source
**Files:** Create `data/privacy.json`; modify `scripts/build-site.mjs`.
- [ ] Add bilingual copy for identity, collected fields, purpose, processors, retention, rights, optional/required effects, security, and updates.
- [ ] Load the JSON and render escaped headings, paragraphs, lists, and official Vercel/Resend policy links.
- [ ] Add self-canonical and reciprocal language alternates; emit both locale directories.

### Task 3: Discovery surfaces
**Files:** Modify `scripts/build-site.mjs` and `src/styles.css`.
- [ ] Render one locale-matched Privacy link inside existing Contact links without exposing an email address.
- [ ] Extend sitemap with `/en/privacy/` and `/zh/privacy/`, preserving canonical locale alternates.
- [ ] Emit concise `llms.txt` with canonical identity, when-to-use guidance, public URLs, Contact route, and no-inference boundary.
- [ ] Add only `.privacy-*` styles using existing tokens, topbar, type, and responsive rules; add no animation.

### Task 4: TDD GREEN and deterministic gates
**Files:** Modify only the files above if a focused assertion exposes an implementation defect.
- [ ] Run `node --test tests/privacy-agent-discovery.test.mjs`; expected PASS.
- [ ] Run `npm test`, `npm run build`, `npm run audit:design-contract`, `npm run featured-reels:check`, `git diff --check`.
- [ ] Scan tracked/generated output for credentials, private addresses, absolute private paths, and the protected filename.
- [ ] Verify protected SHA-256 remains `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.

### Task 5: Browser, review, and handoff
**Files:** Create one frozen packet/adjudication/closeout; update `STATUS.md` and `docs/reviews/LOG.md` without erasing existing dirty work.
- [ ] Serve the exact fresh build; inspect English/Chinese Privacy at desktop and mobile, keyboard focus, reduced motion, no overflow/errors, and zero Contact POST.
- [ ] Freeze one SHA-256 packet; send identical bytes through official Claude and Gemini review wrappers; adjudicate every usable finding locally.
- [ ] Build one standing-authorized static `dist/`-only Preview and replace the sole Shareable Link; keep the access token out of Git.
- [ ] Stop before Production, Git push, or Search Console mutation unless an explicit recorded authorization covers that final external step.
