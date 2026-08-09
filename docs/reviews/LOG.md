# Package Log

One entry per normal work package, max 10 lines each (see Bible, Roadmap
Discipline). Dated reports are reserved for phase closeouts and high-risk
packages.

## 2026-08-09 — Mobile Featured reel trigger
- Branch/base: `codex/three-minute-watch-link` from Production-aligned `d109bbd`; approved spec `2c5c6ca`, implementation `a20997a`.
- Behavior: at ≤820px, 35%-eligible Featured reels use nearest-viewport-center ownership and a 700ms poster hold; desktop keeps last-DOM/1.4s and Archive keeps nearest-center/1.4s.
- Mechanism: one generic center selector serves Featured and Archive; rAF-throttled scroll/resize updates ownership; breakpoint changes invalidate the previous timer; existing poster/error/visibility/BFCache guards remain.
- TDD/validation: four RED checkpoints then focused 13/13 and full 132/132 GREEN; build, design audit, Figma export, and diff checks pass with no content, CSS, media, or Figma delta.
- Browser: bilingual 390×844/360×800 plus 1440×900, 1200×900, and 834×1112 pass; mobile play events arrive in 821–994ms, only the center reel plays/advances, and scroll handoff resets the prior reel.
- Accessibility/safety: reduced-motion and no-JS make zero MP4 requests; served-build identity, keyboard focus, overflow, console/page errors, same-origin failures, and Contact POST checks pass.
- Durability/external state: backup `backup/2026-08-09/mobile-featured-reel-trigger-local-b103409` read back at `b103409`; no `main`, Preview, Production, alias, Contact, or protected-file change. Public release still requires separate authorization and review.

## 2026-08-09 — Intentional localized blanks
- Branch/base: `codex/three-minute-watch-link` from reviewed bilingual-copy closeout `d9f93b9`; six producer-approved Chinese blanks only.
- Contract: fields/locale keys/array positions remain; exact empty string suppresses only that locale's DOM element; English stays independent; no CSS/layout variant was added.
- Mechanism/data: guarded work order adds explicit `blank` and refill from `expected: ""`; P0 = one availability slot, P1 = five Featured taglines, with six English keeps and zero conflicts.
- TDD/validation: RED then focused 69/69 and full 128/128 GREEN; build, Figma export, design audit, and diff checks pass.
- Browser: English/Chinese at 1440×1100 and 390×844 have zero empty tagline/pill nodes, console errors, or page errors; twelve section screenshots show Chinese content collapsing upward without a hole.
- Review: packet `95ca9c4…46d9a`; Gemini requested/observed/completed `gemini-3.6-flash`, PASS/no findings, 1,823 in / 130 out / 2,997 total; local adjudication needs no remediation.
- Preview: 42-file / 80,017,465-byte dist-only `dpl_7FFRu6…M4WX` is READY/Preview with no functions; direct URL keeps project SSO, and the prior Hobby shareable link was not revoked.
- Production: pre-main backup `backup/2026-08-09/pre-bilingual-main-03ad08a` read back at `03ad08a`; authorized fast-forward to source `332d9ed` created READY Production `dpl_5C2gcf…s1E4` on the canonical alias.
- Online QA: Preview passed both locales at five viewports plus keyboard/console checks; Production passed 14 locale/mode cases including reduced motion and no JavaScript, with HTTP 200, zero overflow/same-origin/console/page errors, and no Contact submission.
- Durability/open: formal record is `intentional-localized-blanks-production-release-2026-08-09.md`; final docs-inclusive backup is reported externally after commit; the broader 44 copy items, taxonomy/JSON-LD, lighting, share-link replacement, and protected file remain untouched/producer-gated.

## 2026-08-09 — Guarded bilingual copy work order
- Branch/base/commits: `codex/three-minute-watch-link` from frozen `2f56352`; reusable mechanism `6fb3501`, P0 site copy `e0c5e35`, reviewed P1 Featured copy `d5942d1`.
- Mechanism: versioned schema-v1 work order with source hashes, stable semantic keys, paired `en`/`zh`, exact-current guards, replace/keep, dry-run default, P0-before-P1, handled rollback, and replay rejection.
- Application: P0 = 13 keys / 26 replacements in `data/site.json`; P1 = 18 keys / 31 replacements + 5 English keeps across six works; Figma editable text handoff regenerated without geometry changes.
- TDD/validation: final `123/123`, build, Figma export, design audit, old-copy/privacy/diff checks, and remote backup read-backs pass.
- Browser: English/Chinese 1440×900 and 390×844 show no horizontal overflow or hidden copy clipping; Contact has seven visible fields; console/page/request errors and submissions are zero.
- Review: packet `7049638…246e`; Gemini requested/observed/completed `gemini-3.6-flash`, PASS/no findings, usage 2,191 in / 162 out / 3,614 total; Claude brainstorm handoff stayed incomplete with no request/fallback/dual consensus; local adjudication needs no remediation.
- External state: P0/P1 backups read back at `e0c5e35` / `d5942d1`; no main merge/push, Preview, Production, alias, deployment, Contact, or protected-file change.
- Open: 44 broader Chinese differences plus role-taxonomy/JSON-LD unification remain producer-gated follow-ups; neither is authorized by this package.

## 2026-08-06 — Chinese-copy workbook schema merge
- Artifact: rebuilt the producer-edited Excel on the current 169-field bilingual schema; final SHA-256 `1d0210c…c9600`.
- Preservation: all 168 prior editable rows mapped exactly by stable key; added only `archive.three-minute-micro-drama.watchLabel` with `Watch the full series` / `觀看完整系列`.
- Recovery: exact pre-merge workbook is retained under `outputs/.../backups/`, SHA-256 `21b11eb…a73c`.
- Verification: no missing/duplicate/stale mapped keys, no formula errors, and all seven rendered sheets passed visual inspection; 65 effective Chinese-copy differences remain.
- Review: external AI review skipped because this is an offline editorial schema merge with no public-output or governance change.
- External state/next: no website/Figma change, `main` merge/push, Preview, Production, alias, or Contact action; next package must dry-run and review the 65 stable-key revisions before any import.

## 2026-08-06 — Three-Minute full-series link
- Branch/base: `codex/three-minute-watch-link` from local `main` `8b18332`; pre-change backup `backup/2026-08-06/pre-three-minute-watch-link-8b18332` read back exactly.
- Change: the Three-Minute Archive card now uses the existing data contract to open producer-supplied playlist `PLDTnN3czXyG8`, with exact actions `Watch the full series` / `觀看完整系列`.
- Scope: data and regression tests only; no renderer, CSS, JavaScript, media, Figma, ordering, slideshow, or reel behavior changed.
- TDD/validation: RED for missing URL/count, then GREEN; focused `2/2`, build-site `38/38`, full `111/111`, build, Figma export, design audit, diff check, and bilingual desktop/mobile browser QA passed.
- Review: frozen packet `4842628…9cd1`; Gemini requested/observed/completed `gemini-3.6-flash`, `PASS`/no findings; external YouTube availability is the only residual risk and needs no remediation.
- External state: local only; no `main` merge, `origin/main` push, Preview, Production, alias, Contact action, or protected-file change.

## 2026-08-06 — Ghost Hand Archive slideshow
- Branch/base/behavior: `codex/ghost-hand-archive-slideshow` from `03ad08a`; validated behavior `9d84132`; docs follow-up reported externally.
- Change: six approved production stills now drive a generic 10-second recipe/HyperFrames slideshow, stable poster/MP4 paths, manifest/frontmatter integration, and nearest-visible one-reel arbitration.
- Safety: dry-run by default, SHA/dimension gates, metadata-safe authoring WebPs, no raw originals in Git, and four-target rollback writer; protected file remains untouched.
- Media: poster 144,878 bytes / `fadb961…ca5f3`; MP4 3,838,732 bytes / `9a602f2…2b52`, H.264 1280×720 yuv420p BT.709, silent, faststart, full decode.
- HyperFrames: requested plan pin `0.7.88`; upgrade check observed `0.7.94`; strict check and completed render used pinned `0.7.94`.
- Validation: TDD RED/GREEN, `111/111`, build, Figma export, design audit, exact manifest/media, privacy, strict HyperFrames, and diff checks pass.
- Browser: English desktop and Chinese 390×664 play Ghost Hand after 1.4s; mobile scroll hands off to Three-Minute; reduced motion stays static; zero console/local-request/Contact errors.
- Review: frozen packet `c075e4f…293f`; Gemini requested/observed/completed `gemini-3.6-flash`, PASS/no findings; Claude handoff incomplete, so no dual consensus; local adjudication requires no remediation.
- Integration/Preview: local `main` reaches deploy source `b7d3fe1`; adopted dist-only deployment `dpl_Gy96AtLGzKzLyAwQEzVhwbtUw7Rz` is `READY` / Preview; producer-authorized `Anyone with the link` replaced the Hobby account's old shareable link, while project SSO remains; access URL stays out of Git (`c262013…b4f4f3` SHA-256); no Production, alias, `origin/main`, or Contact action.
- Durability: pre-record backup `backup/2026-08-06/ghost-hand-main-ae20130` read back at `ae20130`; final docs-inclusive backup is `backup/2026-08-06/pre-shutdown-final`. Legacy unbacked commit `b29b745` was separately preserved at `backup/2026-08-06/cinematic-b29b745`.

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
