# Hsin-Hsin Yuan Portfolio Website Implementation Plan

**Goal:** Build a Markdown-first bilingual static portfolio website with a cinematic landing page and horizontal featured works gallery.

**Architecture:** Use zero-dependency Node scripts to parse Markdown frontmatter and JSON data, then generate static HTML/CSS/JS into `dist/`. Keep content separate from presentation so works and text can be edited without touching layout code.

**Tech Stack:** Node.js, built-in `node:test`, Markdown frontmatter, static HTML/CSS/JS.

## Files

- `package.json`: scripts for build and test
- `scripts/build-site.mjs`: parses content and generates static site
- `tests/build-site.test.mjs`: verifies parser, bilingual output, works data, video fallback, and generated files
- `data/site.json`: bilingual site copy
- `data/collaborations.json`: collaboration list
- `content/works/*.md`: work entries
- `src/styles.css`: site styles
- `src/main.js`: horizontal scroll enhancement
- `dist/`: generated output

## Tasks

1. Add failing tests for content parsing and generated output.
2. Add Markdown and JSON content files.
3. Implement static site generator.
4. Add cinematic responsive CSS and horizontal works behavior.
5. Run tests and build.
6. Start a local server and verify desktop/mobile layout.

