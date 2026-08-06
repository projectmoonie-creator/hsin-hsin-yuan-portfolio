# Package Log

One entry per normal work package, max 10 lines each (see Bible, Roadmap
Discipline). Dated reports are reserved for phase closeouts and high-risk
packages.

## 2026-08-06 — Ghost Hand Archive slideshow
- Branch/base/behavior: `codex/ghost-hand-archive-slideshow` from `03ad08a`; validated behavior `9d84132`; docs follow-up reported externally.
- Change: six approved production stills now drive a generic 10-second recipe/HyperFrames slideshow, stable poster/MP4 paths, manifest/frontmatter integration, and nearest-visible one-reel arbitration.
- Safety: dry-run by default, SHA/dimension gates, metadata-safe authoring WebPs, no raw originals in Git, and four-target rollback writer; protected file remains untouched.
- Media: poster 144,878 bytes / `fadb961…ca5f3`; MP4 3,838,732 bytes / `9a602f2…2b52`, H.264 1280×720 yuv420p BT.709, silent, faststart, full decode.
- HyperFrames: requested plan pin `0.7.88`; upgrade check observed `0.7.94`; strict check and completed render used pinned `0.7.94`.
- Validation: TDD RED/GREEN, `111/111`, build, Figma export, design audit, exact manifest/media, privacy, strict HyperFrames, and diff checks pass.
- Browser: English desktop and Chinese 390×664 play Ghost Hand after 1.4s; mobile scroll hands off to Three-Minute; reduced motion stays static; zero console/local-request/Contact errors.
- External state: no local-main merge, push, Preview, Production, alias, or Contact action; next action is local producer approval and a separately authorized release decision.

## 2026-08-06 — pre-lighting GitHub checkpoint
- Release: checkpoint `4d4a27a` containing logo completion `f900e7b` is preserved by remote `backup/2026-08-06/pre-lighting-zh-refinement` and annotated tag `portfolio-baseline-2026-08-06-pre-lighting`; `origin/main` contains it plus the docs-only deployment record.
- Validation: post-integration `93/93`, six-asset prepare, build, Figma export, design audit, clean tracked worktree, and protected-file SHA check passed.
- Review: inherits the frozen logo-completion Gemini PASS and incomplete Claude handoff; this promotion record is docs/ref-only and changes no public output, so no new external review was run.
- Deployment: `main` push auto-created GitHub Production deployment `5774226594` for `4d4a27a`; verified `success` at `https://hsin-hsin-yuan-portfolio-vvbwab0q9.vercel.app`; no manual Vercel command, alias, or Contact action.
- Next: Chinese copy plus bilingual named-variant normalization first; lighting follows as a separate lo-fi-first package after geometry approval.

## 2026-08-06 — Overclocking static poster and mobile reel diagnosis
- Branch/base/implementation: `codex/overclocking-static-poster` from backed-up local main `58a5751`; implementation `7dddff9`.
- Change: user-approved `P1070715.jpg` became the stable-path 1280×720 Overclocking WebP poster; alt/evidence/manifest updated and obsolete video timecode removed.
- TDD: replacement contract RED against old evidence, then GREEN; exact public derivative is 68,144 bytes, SHA-256 `d892d7a…8490c`.
- Validation: full `79/79`, manifest checks, build, Figma export, design audit, diff check, and mobile poster-load/crop probe passed.
- Diagnosis: Three-Minute plays after the normal 1.4-second mobile hold; `prefers-reduced-motion: reduce` intentionally keeps the static poster and makes no play request.
- External state: prior Preview remains login-protected and unchanged; no push, merge, new Preview, Production, alias, Contact, or protected-file change.

## 2026-08-06 — Collaboration Logo Wall component
- Branch/base/implementation: `codex/collaboration-logo-wall`; component `90e713c`; logo completion from `7ba8a62` at `f900e7b`.
- Change: one normalized seven-entry website/Figma component now has six SHA-locked monochrome marks and one honest WMW text fallback; Dragon TV is producer-supplied and ScreenHouse is the official homepage SVG.
- TDD/validation: source-treatment RED then GREEN; full `93/93`, six-asset prepare, build, Figma export, design audit, and English/Chinese desktop/mobile Chromium QA passed.
- Review: frozen increment packet `531d942…ba7e8`; Gemini requested/observed/completed `gemini-3.6-flash`, PASS/no findings; Claude handoff incomplete, so no dual consensus.
- Local integration: producer authorized fast-forward of local `main` to this closeout head; post-merge tests and generators passed.
- Open/external: WMW remains a fallback; no remote backup, `origin/main` push, Preview, Production, alias, Contact, or protected-file change.

## 2026-08-04 — HeroMedia closeout remediation
- Branch/base: `codex/hero-media-closeout-remediation` from `e2d75f0`; implementation `63e51bf`, reviewed closeout `bba4ea0`, and backup `backup/2026-08-04/e2d75f0` pushed/read back.
- Change: fail-closed JPEG APP/COM policy, one derived slow-push profile for website/Figma, breakpoint-active focal variables, and current cold resume.
- TDD: original four-finding RED `47/54`; GREEN `54/54`; malformed-JFIF-tail RED `3/4`; GREEN `4/4`.
- Validation: full `79/79`, design audit, build, Figma export, diff/SHA checks, and three-case responsive/reduced-motion browser QA passed.
- Review: packet `368e0fe…13fd`; Gemini `gemini-3.6-flash` PASS/no findings; all four closures locally upheld; raw provenance self-label rejected; Claude handoff incomplete, so no dual consensus.
- Local integration: producer authorized fast-forward of local `main` to `bba4ea0`; focused `4/4`, full `79/79`, audit, build, and Figma export passed; this docs-only status follow-up skips external review because it changes no current rule or public output.
- Mobile Preview: public `dist/` from local main `e9f09af`, 33 files, deployment `dpl_8vwDEtrbrG5vzqreik78rnqMH4Ax`, target Preview, `Ready`; repo sources/internal docs/API were excluded, so Contact delivery is intentionally unavailable.
- External state: Preview only; no `origin/main`, Production, alias, Contact submission, or protected-file change.

## 2026-08-04 — HeroMedia component and showreel retirement
- Branch/commit: `codex/hero-media-component`; extraction `5539c43`; behavior commit reported externally after commit.
- Change: canonical website/Figma HeroMedia; Play/showreel retired; lossless JPEG metadata sanitization and repeatable replacement command.
- Validation: focused 53/53; full 78/78; audit/build/Figma/diff/browser/reduced-motion/no-JS passed; decoded Hero pixels unchanged.
- Review: frozen packet `fed9a946…`; Gemini `gemini-3.6-flash` PASS/no findings; Claude handoff incomplete, so no dual consensus.
- Rule retirement: replaced the stale inline-showreel QA rule with slow-push, reduced-motion, and no-Play/video checks.
- External state: no main merge, Preview, Production, Contact, or protected-file change; Claude frozen-packet follow-up remains open.

## 2026-08-04 — visual-lofi / deploy-cadence / extract-on-touch rules (docs/governance-only)

- Branch/commit: `main` (this commit); proposal `2026-08-04-visual-lofi-deploy-cadence-proposal.md` v2, producer-approved.
- Change: Bible adds three rules — Visual Direction lo-fi-first 90-min timebox, Contact And Deployment seven-day cadence, Roadmap Discipline extract-on-touch (Codex wording verbatim).
- Validation: Bible 164 lines (net −1), `npm test` 61/61, `git diff --check` clean, target-string search 5/5.
- External review: low-risk single-review downgrade with independent reviewer concurrence (`2026-08-04-visual-lofi-deploy-cadence-codex-audit.md`, verdict "修文後定版"); not a rotation consensus.
- Rule-retirement verdicts (R5): **retire/merge ×2** — design-reference two bullets → one (adds back "which parts serve the portfolio goal"); press-metadata two bullets → one (adds back `source`). **keep** — "Until a custom domain is confirmed…" does not conflict with the cadence rule.
- Open items: any actual Production deployment is a separate package with full QA/review and per-deploy authorization.

## 2026-08-04 — process-diet finalization (docs/governance-only)

- Branch/commit: `main` (this commit); backups `backup/2026-08-04/*` read back.
- Validation: `npm test` 61/61, `git diff --check` clean, Bible ≤165 lines.
- External review: Codex read-only audit (`2026-08-04-process-diet-codex-audit.md`), verdict "修文後定版" applied.
- Rule-retirement verdict (per new retire/downgrade rule): **downgrade** — per-package dated closeout reports → LOG entries; **retire** — duplicate removed-section bullets in Content Rules merged into one.
- Open items: R3 charter amendment recorded in WORK-CHARTER v1.17; next subtractive task doubles as Charter §3-9 live test.
