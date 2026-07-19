# Editorial Watch Loop Hybrid — Multi-AI Review Adjudication

Date: 2026-07-19  
Reviewed commit: `f54887b`  
Baseline: `5cdb842`

## Review packet and safety boundary

The first proposed packet contained internal Bible, review-history, workflow, and source-diff material. The local safety layer rejected it before either provider received it. The completed review instead used a sanitized bundle containing only the deployable public `dist` HTML, CSS, JavaScript, robots/sitemap files, the approved public behavior summary, and the clean public Hero screenshot. It contained no credentials, private evidence, internal review history, or workflow documents.

Sanitized packet SHA-256: `4224d8c4819c5e39e9b95a3e879577a1acd7c01e447f6d0d59d469c14cfd3984`

## Attempt ledger

| Provider | Requested model | Observed model | Completed model | Lane | Result | Usage | Artifact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Claude | `claude-fable-5` | `claude-fable-5`; payload also records a `claude-haiku-4-5-20251001` helper entry | `claude-fable-5` | authenticated standalone CLI, read-only public-artifact directory | success; no downgrade | Fable: 1 direct input, 46,753 cache creation, 2,804 cache read, 17,834 output; helper: 36,374 input, 19 output; total cost USD 1.866043 | `docs/reviews/claude-editorial-watch-loop-hybrid-2026-07-19.json` |
| Gemini | `gemini-3.5-flash` | `gemini-3.5-flash` | `gemini-3.5-flash` | controlled REST reviewer, temperature 0 | success on attempt 1 | input 33,939; output 622; total 50,211 | `docs/reviews/gemini-editorial-watch-loop-hybrid-2026-07-19.md` |

The locally rejected internal packet was not a provider attempt and produced no findings.

## Maintainer adjudication

### 1. Autoplay transform plus manual desktop scrolling

Claude: High. Gemini: Medium.  
Decision: **agree (High)**.

The active controller left `overflow-x: auto`, while translating the track independently. Manual `scrollLeft` could therefore combine with the transform, and a touch-only tablet wider than 820px could enter autoplay without a hover pause path.

Resolution: autoplay now also requires `(hover: hover) and (pointer: fine)`. Enabling the controller resets `scrollLeft` and owns horizontal movement with `overflow-x: hidden`; disabling it restores the original inline overflow and the one-sequence manual rail. Unit coverage includes touch-only mode, overflow ownership, and dynamic pointer-policy changes.

### 2. Small coral/moss labels on light surfaces

Claude: Medium.  
Decision: **agree (Medium)**.

The small `section-title`, `work-meta`, and case-study labels did not reach 4.5:1 on paper/fog. The approved signal tokens remain in the palette, but small light-surface text now uses `--ink-soft`; the moss signal remains as a non-text rule on case-study labels. Dark-surface context overrides remain explicit.

### 3. Native/no-JavaScript contact form response

Claude: Medium.  
Decision: **downgrade in part, otherwise agree (Medium)**.

The raw-JSON navigation was reproducible. The claim that a missing `startedAt` was automatically classified as spam was not: the existing numeric check already let an empty value through. The API now makes that guard explicit and negotiates localized, no-store HTML success/error pages for native posts while preserving the existing JSON fetch contract, honeypot, validation, rate limit, and Resend flow.

### 4. No-JavaScript showreel button

Claude: Medium.  
Decision: **agree (Medium)**.

The public button required JavaScript and the video shipped without a native fallback. The generated page now exposes a poster-backed, controlled video to no-JavaScript visitors and hides the inert custom button in that mode while preserving the enhanced JavaScript experience.

### 5. Press-image failure and external media policy

Claude: Medium. Gemini: High.  
Decision: **agree on layout failure (Medium); reject the proposed rehosting direction**.

Removing the image parent left the copy in the fixed 4rem grid track. The fallback now hides only the failed image, retaining the reserved frame and readable copy column. The suggestion to download and self-host third-party press/platform images conflicts with the project's explicit rights rules: public metadata and official platform images remain link-first/remote unless the user approves a rights-clear replacement. No unrelated local still is substituted.

### 6. Traditional Chinese document language and archive copy

Claude: Medium.  
Decision: **agree (Medium)**.

The Chinese output declared bare `zh`, and four archive descriptions remained English. The page now declares `zh-Hant`; canonical archive frontmatter carries localized descriptions/platform copy and both site/design generators consume the localized values.

## Final validation

Integrated validation after all adjudicated fixes:

- `npm test`: 60/60 PASS;
- media manifest validation: PASS;
- bilingual build and Figma export: PASS;
- generated importer syntax: PASS;
- browser QA: PASS across nine scenarios, including fine-pointer desktop autoplay, touch-only 1024px manual mode, reduced motion, no JavaScript, `zh-Hant`, small-label contrast, simulated press-image failure, native no-JS showreel controls/poster, fixed-header anchors, and media completeness;
- `git diff --check`: PASS.

No requested reviewer lane remains incomplete, and production remains untouched.
