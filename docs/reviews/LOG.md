# Package Log

One entry per normal work package, max 10 lines each (see Bible, Roadmap
Discipline). Dated reports are reserved for phase closeouts and high-risk
packages.

## 2026-08-04 — HeroMedia closeout remediation
- Branch/base: `codex/hero-media-closeout-remediation` from local `main` `e2d75f0`; remote rollback ref `backup/2026-08-04/e2d75f0` verified first.
- Change: fail-closed JPEG APP/COM policy, one derived slow-push profile for website/Figma, breakpoint-active focal variables, and current cold resume.
- TDD: original four-finding RED `47/54`; GREEN `54/54`; malformed-JFIF-tail RED `3/4`; GREEN `4/4`.
- Validation: full `79/79`, design audit, build, Figma export, diff/SHA checks, and three-case responsive/reduced-motion browser QA passed.
- Review packet: `368e0fe…13fd`; Gemini incomplete (DNS then external-transmission authorization denied, no model call); Claude handoff incomplete, no model request.
- External state: backup ref only; no `origin/main`, Preview, Production, alias, Contact, or protected-file change.

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
