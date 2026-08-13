# Package Log

One entry per normal work package, max 10 lines each (see Bible, Roadmap
Discipline). Dated reports are reserved for phase closeouts and high-risk
packages.

## 2026-08-12 — Mobile preview network-budget diagnosis
- Scope: producer-approved diagnosis only on `codex/mobile-preview-network-budget`; exact runtime stays at closed `4193498`, with no public-output, media, manifest, interaction, Contact, or deployment change.
- Method: nine retained matched cold mobile runs at 390×844/DPR3, 150ms/1.6Mbps, 4× CPU, new context/storage clear/cache disabled; direct ledgers record every MP4 request, media event, reveal, LCP/TBT/CLS, and user intent.
- Finding: all nine select the mobile derivative; desktop-fallback and dual-source runs are 0, pre-intent `play()` is 0, and the only early behavior is the approved one-candidate proximity metadata warm.
- Budget/feel: pre-intent body median is 0B at 3s and 130,500B at 12s; cold intent→`playing`/reveal is 5.49s, 3s lead is 2.07s, settled metadata is 20.7ms; Hero LCP 1.38s, TBT 36–38ms, CLS 0.
- Decision: PageSpeed's ~7.43MB fallback + ~2.29MB derivative signal is not reproducible in the required median; handoff stop rule applies, so no runtime RED/test/fix or after-run phase is opened.
- Evidence: raw valid/invalidated ledgers, range server, probe, generator, build fingerprints, and machine summary live under `docs/reviews/evidence/mobile-preview-network-budget/`; dated diagnosis is under `docs/performance/`.
- Review: external review skipped because this closeout is diagnostic/docs-only, changes no rule/public output, and executes the producer-approved mandatory stop; package verdict `PASS` / `NO_RUNTIME_CHANGE`.
- External state/next: no Preview, Shareable-Link replacement, Git push, `main`, Production, alias, Contact, destructive action, or protected-file change; wait for new public/CrUX evidence or a separately producer-approved package.

## 2026-08-12 — Hero F / Studio Cue / Featured geometry phase closeout
- Producer ruling: accessible cumulative Preview accepted as `預覽 OK`; producer explicitly authorized non-force backup, closeout, active-branch push, `main`, annotated tag, and Production.
- Scope: closes the linear phase above `origin/main` `7d76b89` containing Hero F, bounded first-view Studio Cue + Contact-dot tally, proactive Shareable-Link governance, and four-card full-poster/16:9-playing geometry; no Contact logic/submission, copy, unrelated media, or protected-file change.
- Gates: final 179/179, fresh build, six-reel integrity, design audit, privacy/diff/protected checks, and production dependency audit with zero vulnerabilities pass; prior full bilingual/device/fallback/browser and matched performance evidence remains current because only closeout docs changed afterward.
- Review: Hero F and Featured geometry independently requested/observed/completed Codex `gpt-5.6-sol` `xhigh`, both PASS/no actionable finding; Studio Cue has deterministic, 8-case visual, matched performance, cumulative Preview, and explicit producer acceptance. Failed Claude/Gemini lanes remain incomplete, not findings.
- Preview: cumulative static `dpl_Diifu…g76t` is Ready/Preview, 57 files / path-list `739aa47d…a5af`, no functions/private payload; its Shareable URL remains outside Git and PageSpeed report `0gzingp9bc` remains invalid because it measured Vercel login.
- Durability/release: final commit is pushed non-force to unique dated backup, `codex/hero-portrait-refresh`, `main`, and annotated `portfolio-phase-2026-08-12-closed`; exact remote SHAs and Git Production ID are post-commit readback evidence reported externally to avoid another docs-only Production cycle.
- Verdict/next: `PASS`; optional public PageSpeed and future Chinese-source authority selection are non-blocking. After readback, wait for the producer to name the next bounded package; no implicit implementation or Contact action.

## 2026-08-12 — Featured poster-to-reel geometry
- Authorization/scope: producer approved Option 1, its written spec, implementation plan, and test-first execution; local branch remains `codex/hero-portrait-refresh` over `origin/main` `7d76b89`, while push/`main`/Production/alias/Contact/tag/protected-file actions remain gated.
- TDD/commits: spec `35b87a6`, plan `dfeb66e`, data contract `77d0a65`, runtime/CSS `f74696f`, design truth `caff12b`, lifecycle coverage `3fd7fa4`, and frozen review record `ded2d6c`; expected contract and renderer/runtime REDs preceded GREEN.
- Geometry: four named works use one data-derived `fill-poster-16x9-reel` variant—full-height poster above 820px, centered 16:9 only after current valid `playing`, reset/error back to poster. The reference pair stays 16:9; mobile keeps all six 16:9; panels/copy/links/media remain unchanged.
- Gates/browser: 179/179, build, reel integrity, design audit, Figma/no tracked drift, diff/privacy/protected checks pass. Ten EN/ZH viewport cases plus reduced/no-JS pass; desktop switching frames measure 533.75×618.81 poster → 533.75×300.23 playing inside unchanged 1180×648 panels, with zero Contact/error/overflow.
- Performance: matched 3× local medians remain mobile 0.81 / LCP 5027.10→5027.59ms and desktop 0.99 / 922.32→922.21ms, with TBT/CLS zero. PageSpeed `0gzingp9bc` measured `vercel.com/login`, so its 59/85 scores are invalid portfolio evidence; no share token was disclosed to PageSpeed.
- Review: frozen packet `fdafc6d…cc2a`; Codex requested/observed/completed `gpt-5.6-sol` `xhigh`, PASS/no findings. Claude dynamic `opus` timed out after preflight and Gemini `gemini-3.6-flash` returned empty candidates; neither incomplete lane is claimed complete.
- Preview/access: `dpl_Diifu…g76t` reads Ready/Preview; exact static package is 57 files / 96,765,750 bytes / matching local+remote path-list `739aa47d…a5af`, with no functions or private/source payload. New API-created Shareable Link replaces the prior sole Hobby link; its URL stays outside Git at `aaaa9f3e…c85de` and was not fetched.
- Verdict/next: `PASS_WITH_OPEN_ITEMS` only for producer target-device inspection of the new Shareable Link. Protected hash remains `945d4df9…d28fc`; Production, alias, push, `main`, Contact, and every other external boundary remain untouched.

## 2026-08-12 — Studio Cue + Contact tally implementation
- Authorization/boundary: producer said `核准實作，選 2` at 2026-08-12 08:02:37 +08:00, authorizing inline execution only; local branch stays `codex/hero-portrait-refresh`, `origin/main` stays `7d76b89`, and push/`main`/Production/alias/Contact/tag/protected-file actions remain gated.
- TDD/commits: RED `c6d85ac2bdf1391ac4acb03f87fcb18afb5eb7a1`; smallest GREEN `57acb905ab8bd9bb2662fab4c7064c1312bf8b10`; plan portability fix `4fba180`. Runtime scope is exactly renderer + CSS, with one contract-test file from Hero F.
- Interaction: first eligible tab visit runs three 320ms opacity/8px Hero beats, then a neutral Hero-only 480ms softbox cue after 940ms; Contact's existing dot becomes a transform-only 1.9× tally on focus/fine hover without geometry change. Repeat/reduced/no-JS/storage-failure states stay static.
- Gates: focused 2/2, full 179/179, build, design audit, Figma/no drift, six-reel integrity, Hero 7/7, diff/privacy, and zero-vulnerability dependency audit pass. Protected untracked hash remains exact at `945d4df9…d28fc`.
- Browser: 8/8 EN/ZH desktop/tablet/mobile/narrow/reduced/no-JS/storage-failure cases and four phase captures pass with zero Contact requests, errors, overflow, or light resources. Reload/language/history return do not replay; headless history used fresh-document restore and remained unopted/static.
- Performance/visual: matched 3× LCP desktop 88→84ms, mobile 84→80ms; long task 63→62ms and 62→64ms; resources remain 20/21. Visual inspection accepts quiet neutral paired spill, single mobile spill, natural portrait F, seamless fade, stable tally, and no neon beam.
- Preview/access: static `dist/`-only package = 58 files / 96,765,625 bytes / path-list `2654e4dc…cc23`; `dpl_4554G…HNbr` reads Ready/Preview, static `.` root/no functions. Vercel Share reads anyone-with-link view/comment, old sole Hobby link revoked; new access URL stays outside Git at `303e978b…50ed` and was not fetched or sent to PageSpeed.
- Governance/verdict: producer permanently authorizes proactive sole-Shareable-Link generation/replacement for every standing-authorized portfolio Preview before handoff; never try/deliver the protected direct origin first, wait for failure, or ask again, but disclose revocation afterward. `PASS_WITH_OPEN_ITEMS` only for producer visual inspection; no Production, alias, push, `main`, Contact/function, tag, or protected-file action.

## 2026-08-12 — Hero portrait refresh (selected F)
- Branch/base: local-only `codex/hero-portrait-refresh` from Production-aligned `origin/main` `7d76b891…3273`; no Preview, push, Production, alias, `main`, Contact, or tag action.
- Source: producer-selected F becomes the metadata-safe 1448×1086 canonical JPEG at the stable path, SHA `d775b50d…7ee`; raw selected PNG SHA is `e5d87d13…7eb3`.
- Contract: `heroMedia` remains the only truth; bilingual alt, focal points, 4:3 crop, typography/layout, and transform-only slow push/reduced-motion behavior are unchanged.
- Delivery: repeatable prepare produces nine 640/960/1440 AVIF/WebP/JPEG derivatives; obsolete 1920 upscales are removed, with 960 mobile and 1440 desktop preloads.
- Figma: desktop/mobile Hero payloads regenerate from the canonical source; geometry, labels, and non-payload bytes remain identical.
- Validation: TDD RED→GREEN, focused 54/54, full 177/177, build, design audit, Figma, six-reel integrity, diff, and browser 6/6 pass with zero Contact POST/error/overflow.
- Review: Codex requested/observed/completed `gpt-5.6-sol`/`xhigh`, PASS/no P0/P1/P2; Gemini requested `gemini-3.6-flash` but returned empty candidates and is not claimed complete.
- Open/next: producer visually approves F locally or requests the standing-authorized static Preview; protected file remains the only protected untracked item at `945d4df9…d28fc`.

## 2026-08-11 — Git durability and portable Vercel build remediation
- Authorization: producer approved both a non-force dated backup and `main`; `790f834` was first read back on both intended refs, and Git integration auto-triggered Preview/Production builds as documented.
- Discovery: both initial source builds failed `spawnSync ffprobe ENOENT`; their errors never replaced the existing Ready canonical Production alias.
- Fix: pin project-owned `ffmpeg-static@5.3.0`, share one Hero/video inspector, preserve exact ISO-BMFF duration plus existing hash/format/color/faststart validation, and ignore Linux stream-mapping lines.
- TDD/validation: empty-PATH and Linux-order RED→GREEN contracts; final 177/177, build, reel integrity, design audit, Figma/no drift, zero install vulnerabilities, and diff checks pass.
- Durability: runtime `7c2d8b6…d2343` reads back exactly at `backup/2026-08-11/7c2d8b6` and `main`; no force, tag move, Contact POST, or protected-file action.
- Deployments: backup Preview `dpl_8RBr…XXUv` and Production `dpl_Gbgq…c863` are Ready; Linux logs show dependency install, build completion, and deployment.
- Canonical: runtime checkpoint Production `dpl_Gbgq…c863` is Ready; later docs-only Git builds keep the alias on the newest Ready deployment with identical runtime bytes. Prior manual Production stayed live until the first successful replacement.
- Verdict/next: `PASS`; protected file remains `945d4df9…d28fc`. Next bounded package is the approved-baseline lo-fi light/button specification, before implementation.

## 2026-08-11 — Production release through Featured Reel desktop 16:9
- Producer ruling: Preview modifications accepted as `OK`; Production and canonical alias explicitly authorized. Git push/`main` remained outside the stated action and no Contact POST was authorized or made.
- Gates: 174/174, build, six-reel integrity, design audit, Figma/no drift, privacy/diff, prior browser geometry 8/8 and interactions 9/9, plus producer device acceptance pass.
- Package: isolated 60-file `dist/` + unchanged Contact function + config; 62 files / 96,953,254 bytes / path-list `d6d28e0…ecb9`; protected untracked document excluded.
- Production: `dpl_Dkver…bLLw` reads Ready/production by ID and canonical alias; `https://hsin-hsin-yuan-portfolio.vercel.app` now resolves to it, replacing `dpl_14E9…ypXq`; Vercel lists `api/contact` on Node 24.
- Review: Codex `gpt-5.6-sol`/`xhigh` PASS/no findings; Gemini/Claude attempts remained unusable, and the producer's inspected-Preview acceptance is the explicit release ruling rather than a false dual-review claim.
- PageSpeed: new mobile-English report `euy5bzixwx` was created, but API quota 429 and a persistently loading UI yielded no completed scores/CrUX/baseline comparison; record as external observation incomplete, not as a deployment failure.
- Durability/open: 18 pre-record commits plus this release record make an expected final 19 unreachable from every origin ref; verdict `PASS_WITH_OPEN_ITEMS` until a separately authorized non-force backup push and optional `main` integration are read back.
- Next: after durability authorization, open the lo-fi-first light/button microinteraction specification from `df77f1c`; protected file remains `945d4df9…d28fc`.

## 2026-08-11 — Featured Reel desktop 16:9
- Branch/base/commit: `codex/featured-reel-16x9` from accepted `059cc8c`; implementation/review handoff `09c1d78`; Production/`origin/main` stays `eb444a6`, with no push, Production, alias, Contact, `main`, or tag action.
- Root/fix: four canonical records used `fill-card`; all six approved Featured reels now share `centered-16x9` through the existing normalized data → renderer → CSS path, with no slug exception or second truth.
- Preservation: outer panels remain 1180×720; copy, columns, order, links, interaction/loading behavior, source videos, mobile 16:9, Archive, Figma compact cards, Hero, and Contact are unchanged.
- Geometry: English/Chinese desktop changes the four tall media surfaces from 533.75×690.81 to 533.75×300.23; all six now measure 1.7778:1, posters/videos are coextensive, and screenshots pass visual inspection.
- Validation: TDD RED→GREEN, full 174/174, build, six-reel check, design audit, Figma/no tracked drift, privacy/diff, browser geometry 8/8, and existing interactions 9/9 pass with zero Contact POST/error/overflow.
- Review: Codex requested/observed/completed `gpt-5.6-sol` at `xhigh`, PASS/no findings; Gemini `gemini-3.6-flash` and Claude dynamic `opus` attempts produced no usable result and are not claimed complete.
- Preview/access: static dist-only 61 files / 96,949,164 bytes / path-list `75b92a3…1533`; `dpl_7Lpcy…i8jC` reads Ready/Preview. Vercel Share reads anyone-with-link view, comment login only; URL stays outside Git at `4df9dc3…8a81`, and the old Archive share is revoked.
- Open: producer checks all six large Featured surfaces on desktop/phone for 16:9 composition, playback, taps, scroll, and destinations; protected file remains `945d4df9…d28fc`.

## 2026-08-11 — Archive Reel intent playback
- Branch/base/commits: `codex/archive-reel-intent-playback` from `02fee43`; spec/plan/RED/implementation/remediation are `486a7f2`/`e4dafff`/`0b6a153`/`e328ea8`/`1042461`; Production/`origin/main` stays `eb444a6`, with no push, Production, alias, Contact, `main`, or tag action.
- Interaction: the shared intent binder gives all three Archive videos desktop hover/focus and mobile first stationary tap preview; a second linked tap navigates, Mechanic stays unlinked, and >12px movement/pointer cancellation remains scroll.
- Loading/safety: Archive keeps its separate one-owner, lifecycle, nearest-center 35% + 1.4s passive system; only selected media metadata-primes, stale play/error generations cannot affect the active owner, and reduced-motion/no-JS stay static.
- Preservation: posters, crops, copy, geometry, canonical URLs/data, Featured warm/screening behavior, Hero, Figma, and Contact do not change; frozen reduced-motion desktop/mobile geometry and screenshot hashes are exact.
- Validation: focused 74/74 and full 173/173, build, six-reel check, design audit, Figma/no tracked drift, privacy/diff, and browser 13/13 pass; passive observed 1405.6ms with zero Contact POST/error/overflow.
- Review: Codex requested/observed/completed `gpt-5.6-sol` at `xhigh`; its initial BLOCK findings were all fixed in `1042461`. Gemini `gemini-3.6-flash` and Claude dynamic `opus` attempts produced no usable result; final local verdict is `PASS_WITH_OPEN_ITEMS` for real-phone checks.
- Preview/access: static dist-only 60 files / 96,948,359 bytes / path-list `0c55a541…861f`; `dpl_5Jtano…zsU2V` reads Ready/Preview. Official API recovered from the dashboard's stuck Loading state; logged-out browser access passes, the new URL stays outside Git at `c9930cba…cb86`, and the old Featured link is revoked.
- Open: producer checks the three Archive reels on real iPhone/Safari, including linked second tap, Mechanic retry, scroll handoff, first-load wait, Low Power Mode, and network switching; protected file remains `945d4df9…d28fc`.

## 2026-08-11 — Featured Reel intent playback
- Branch/base/commit: `codex/featured-reel-intent-playback` from `6b7ffdd`; implementation `d890c58`; Production/`origin/main` stays `eb444a6`, with no push, Production, alias, Contact, `main`, or tag action.
- Interaction: hybrid B makes desktop panel hover/focus immediate; mobile first stationary linked-media tap previews, second tap navigates, movement remains scroll, and failed preview leaves the next tap reachable.
- Screening: every small card primes only its canonical reel, bypasses the passive hold on arrival, and releases an interrupted offscreen prime after three seconds; late `pageshow` cannot override scroll/pointer/keyboard navigation.
- Warm/performance: one two-viewport candidate may metadata-warm only after Hero load; with 1500ms lead, matched cold median visible `playing` is 6049.8→4389.9ms. MP4 starts after measured LCP; TBT/CLS stay zero. Lab data is not CrUX.
- Preservation: passive 35% + 700ms/1.4s, one owner, posters, geometry, copy, canonical data/URLs, encodes, Figma, Archive, reduced/no-JS, conservative network gates, and Contact remain.
- Validation: TDD/full 163/163, build, design audit, Figma/no tracked drift, reel integrity, privacy/diff, and final browser 9/9 pass; observed fallback 710.9ms, zero Contact POST/error/overflow.
- Review: Gemini requested `gemini-3.6-flash` but returned empty candidates; Claude requested dynamic `opus` but helper failed with request state unknown. No observed/completed model or completed external review; local adjudication has no P0/P1.
- Preview/open: static dist-only 61 files / 96,942,772 bytes / path-list `75b92a3…1533`; `dpl_8VzU9…1bxM3` reads Ready/Preview, no functions/unfetched. Sole Shareable Link refresh grants anyone-with-link view access, revokes the prior review link, and keeps the URL outside Git at `1d3876c…c0e1`; PageSpeed is access-blocked because that token was not disclosed to Google. Producer phone inspection, real Safari, Low Power Mode, and network switching remain before Production; protected file stays `945d4df9…d28fc`.

## 2026-08-11 — Routine Preview standing authorization
- Ruling: one fresh static `dist/`-only Preview per completed bounded package is now the normal standing-authorized producer-review handoff after build, tests, privacy, protected-file, and manifest gates pass; no repeated package-specific approval is required.
- Access: when protection blocks requested phone review, refreshing the Hobby account's sole Shareable Link for that exact Preview is included after disclosing that the previous review link will be revoked; access URLs remain outside Git.
- Boundary: Git pushes, source/full-repo deploys, functions/Contact, Production, aliases/domains, `main`, destructive Vercel actions, broader access changes, and failed privacy/rights/security gates still require a stop or explicit producer authorization.
- PageSpeed: access-bearing Shareable Links are never sent to the measurement service; a protected direct URL is recorded as access-blocked unless the producer separately approves that disclosure.
- Rule verdict: **merge/supersede** repeated per-package Preview/share approvals into the deployment-cadence rule; **keep** separate Production/alias/`main`/Contact gates because they affect public state, code integration, or user data.
- Review: external review skipped by direct producer ruling for a docs/governance clarification; the same turn's Preview is independently read back Ready and changes no Production content.

## 2026-08-11 — Screening Strip navigation repair
- Branch/base: `codex/screening-strip-navigation` from `cad590e`; source handoff `66a40cd`; Production/`origin/main` stays `eb444a6`; no push, Production, alias, Contact, `main`, or tag action.
- Root cause: Tech Dreamers alone carried `watchLoopTarget: "watch"`; the shared renderer and old tests turned that data exception into an external small-card action.
- Fix: the common card renderer now always derives `#<featured-slug>`; the source field is removed and retired/stripped by normalization, with no visual or media change.
- Preservation: the large Tech Dreamers media action and audited Official page still use the same TaiwanPlus URL; English/Chinese generated output differs only at the small-card anchor line.
- TDD/validation: five expected RED assertions, focused 62/62, full 156/156, build, design audit, Figma/no-diff, reel integrity, privacy, protected hash, and diff pass.
- Browser: desktop pointer, mobile touch, and mobile no-JS keyboard pass; `#tech-dreamers` is visible, no new window, no errors, zero Contact POST, and two official external links retained.
- Review: Gemini requested/observed/completed `gemini-3.6-flash`, PASS/no P0/P1/P2.
- Preview/access/open: authorized dist-only 61 files / 96,933,972 bytes / path-list `267394e…78b0`; `dpl_3zjGj…Tq9iZ` reads Ready/Preview, static/no functions/unfetched. Producer-authorized Hobby Shareable Link replacement grants anyone-with-link view access; URL stays outside Git at `9a29fc3…83b1`. Lesson generalized in website skill `a1033f4`; producer mobile inspection remains before closeout, while Production/alias/Contact/push/integration stay gated.

## 2026-08-10 — Featured Reel mobile performance Option B
- Branch/base: local-only `codex/featured-reel-mobile-performance` from `bb08d51`; Production/`origin/main` stays `eb444a6`; no push, Preview, deploy, alias, Contact, `main`, or tag action.
- Delivery: one canonical recipe derives six verified 960×540 H.264 mobile reels (16,708,502 bytes vs 60,135,762; -72.2%) and retains 720p fallback; two prepares are hash-identical.
- Runtime: HTML stays `preload="none"`; post-load mobile warms one settled proximity candidate, with ownership/lifecycle cancellation and desktop/reduced/no-JS/detectable Save-Data/2G skips.
- Performance: three matched cold runs show immediate `playing` 3471→1791ms and 10s waiting 4/1239ms→0; 1500ms lead reaches 708ms with 130,500 warm bytes. Lab Chromium, not CrUX.
- Regression: Lighthouse ×3 stays 0.82, TBT/CLS 0, LCP effectively flat, Hero High, and page-load MP4 zero; static no-JS screenshot is byte-identical and Figma has no diff.
- Validation/review: TDD, 155/155, build, design audit, Figma, media check, diff, 6/6 browser matrix, and zero Contact pass; Gemini requested/observed/completed `gemini-3.6-flash`, PASS/no findings.
- Open: real iPhone Safari, Low Power Mode, and network switching before Production; protected file remains `945d4df9…d28fc`; producer reviews local handoff before any external action.

## 2026-08-10 — P0 Hero LCP / image component originalization
- Branch/commit/base: `codex/hero-lcp-optimization`, implementation `e45a596`, handoff `2b25f3d`, from docs-only `5483bfa`; both dated backups read back exactly, closed tag/backup stay at `8289389`, and `origin/main` stays at public `eb444a6`.
- Change: canonical HeroMedia now derives semantic responsive AVIF/WebP/JPEG picture/preloads and transform-only motion; reduced motion is static and Figma retains the same source/crop.
- Pipeline: repeatable prepare validates source/codec/dimensions/metadata and a non-public manifest binds recipe plus 12 derivative hashes; build fails closed on drift.
- TDD/validation: RED contracts then 148/148, build, prepare check, design audit, byte-identical Figma SVGs, diff/privacy/protected-file checks, and 7/7 bilingual/device/fallback browser cases pass.
- Visual: five frozen comparisons pass at 0px geometry drift and RGB MAE 0.442–0.717/255; no copy, Contact, other work, Archive, or decorative-light change.
- Performance: matching three-run direct-throttled median LCP 6733.564→2017.077ms and Hero 195225→4410 bytes; Low→High, non-composited 1→0, TBT/CLS 0; simulated LCP is transparently flat.
- Review/open: Gemini requested `gemini-3.6-flash` and Claude requested dynamic `opus`; both incomplete with no observed/completed model, while local adjudication has no current finding. Producer inspection and any authorized online measurement remain open.
- Preview/incident: authorized 47-file dist-only `dpl_7syJAs…48jx2` is Ready/Preview, unfetched, and function-free. Build logs proved backup refs `e45a596`, `2b25f3d`, and `bfe7df0` auto-created Ready full-repo Previews; the first two predated authorization and correct the earlier no-Preview claim. No Contact request/Production/alias/`main`/tag/protected-file action; deployments remain because deletion is unauthorized. Canonical Production-ID drift `dpl_4i1…`→`dpl_14E…` is metadata-only evidence, not a content-equivalence claim.

## 2026-08-10 — Post-publish PageSpeed review workflow
- Scope: docs/governance-only; records one reusable read-only performance check after an explicitly authorized Preview or Production deployment is read back as Ready, with no public-output or deployment change.
- Canonical memory: Production uses the current `STATUS.md`/`SITE_ORIGIN` alias (`https://hsin-hsin-yuan-portfolio.vercel.app`); Preview uses its exact accessible deployment/share URL and never bypasses protection.
- Record: deployment ID/target/commit, tested URL/language, timestamp/report URL, CrUX availability, mobile category scores, FCP/LCP/TBT/CLS/Speed Index, transfer size, three prioritized findings, and the producer-gated next decision.
- Comparison: routine releases use one diagnostic run; performance packages use three fresh matching-condition runs and compare medians. A fluctuating lab score is not a release blocker or remediation authorization.
- Current reference: 2026-08-10 mobile = Performance 75, other core categories 100, FCP 0.9s, LCP 6.7s, TBT 0ms, CLS 0, Speed Index 4.1s, about 3,197 KiB, no sufficient CrUX data; Hero LCP is the approved P0 next package.
- Rule retirement verdict: **keep** the existing deployment-cadence rule because it governs producer authorization/timing; the new rule begins only after a separately authorized deployment is Ready and governs read-only observation.
- Review: producer directly authorized this narrow workflow; external review skipped as a producer ruling for a reversible docs-only process addition with no public output, runtime, privacy, rights, security, or external-state mutation.
- Boundary: no `main`, Preview, Production, alias, Contact, website/Figma, media, copy, or protected-file action; future recommendations open a separate bounded work package.

## 2026-08-10 — Portfolio phase closeout formalization
- Scope: docs-only closeout of public baseline `eb444a6`; removes stale STATUS tail and records one current cold-resume path, with no public-source or deployment change.
- Review: formal Claude subscription review requested dynamic `opus`, completed `claude-opus-5`, and returned `PASS_WITH_OPEN_ITEMS`; local adjudication confirms no public-product blocker.
- Validation: 144/144, build, design-contract audit, Figma export, privacy/private-path/protected-file, and diff checks pass; prior 14/14 browser and four-screenshot evidence remains the released baseline.
- Durability: final commit is preserved at `backup/2026-08-10/portfolio-phase-closeout` and annotated tag `portfolio-phase-2026-08-10-closed`; both are read back after commit, while `main` remains at `eb444a6`.
- Boundary/next: protected document remains `945d4df9…d28fc` outside Git; next package is one lo-fi light/button interaction specification before any implementation, Preview, or deployment.

## 2026-08-09 — Chinese copy round 2 + mobile Contact spacing
- Scope: producer-approved P0+P1 = nine stable-key changes; English and Chinese stay independent, including `The Mechanic`, `東方衛視`, `座談`, and six Chinese copy revisions.
- Mechanism: guarded global Press-by-ID targeting plus allowlisted shared-scalar promotion; exact-current, structural-token, replay, rollback, path, and non-localizable-scalar rejection contracts remain fail-closed.
- Layout: inherited mobile Contact fix remains `line-height: 1.02` at ≤460px; no new CSS, media, link, Contact API, light effect, or button change.
- Validation: 144/144, build, Figma export, design audit, privacy/protected-file/diff checks, and 14/14 bilingual viewport/reduced-motion/no-JS browser cases pass; no overflow, empty optional node, error, or Contact POST.
- Review: packet `acca559a…3a780` (committed whitespace-clean `28442b6…a798f`); Gemini requested/observed/completed `gemini-3.6-flash`, PASS/no findings; Claude handoff incomplete/no request; local `APPROVE_PRODUCTION` without dual consensus.
- Durability: candidate `c716849` and pre-main `d109bbd` read back at dated candidate/pre-main backups before a non-force main fast-forward.
- Production: `dpl_4i1jTq…EYwkv` is Ready/Production with `api/contact`; canonical alias is `https://hsin-hsin-yuan-portfolio.vercel.app`; deployed page was not fetched under policy.
- Boundary/next: protected untracked doc remains `945d4df…d28fc`; next package is lo-fi-first lighting/button microinteraction with mobile and reduced-motion gates.

## 2026-08-09 — Final Chinese interface Preview
- Source: candidate `0ad90f2`; final workbook `ebc35ed…c2f4`; guarded work order = 54 keys / 50 Chinese replacements / 4 Chinese blanks / 54 English keeps / 108 final matches.
- Contract: exact-empty locale values retain stable fields but omit complete Hero/Work Press/tagline elements; no empty DOM or spacer; whitespace-only fails; English remains independent and byte-identical at `84e7933…d7b3`.
- TDD/validation: 139/139, build, Figma export, design audit, and diff checks pass; Chinese Hero is one `袁欣欣` line and both official cards retain type/source/link without empty titles.
- Browser: 16/16 bilingual five-viewport, reduced-motion, no-JS, keyboard, overflow, empty-element, error, and zero-Contact-POST cases pass; mobile playback begins about 740ms after the 700ms hold.
- Review: local `APPROVE_PREVIEW`, no findings; Gemini external-payload escalation denied before execution and Claude handoff incomplete, so no model/spend/consensus claim.
- Package: privacy-scanned dist-only 42 files / 80,018,591 bytes / path-list `bc6f8e2…f143`; repo, tests, reviews, environments, Contact API, and protected document excluded.
- Preview: `dpl_H2i7G…6Rx9r2` read back `Ready` / `preview` at `https://hsin-hsin-yuan-portfolio-lujpvjbpo.vercel.app`; deployed page not fetched under deployment policy.
- Access/durability: producer-authorized Hobby share replacement succeeded (`Anyone with the link`), old link revoked, access URL delivered but excluded from Git at `ef3b854…02dff`; exact backup `backup/2026-08-09/final-chinese-portfolio-0ad90f2` read back.
- Boundary/next: no main, Production, alias, Contact, or protected-file change; producer must inspect Preview before explicit Production approval.

## 2026-08-09 — Chinese interface manager workbook
- Artifact: final producer-editable XLSX at `outputs/hsin-hsin-yuan-zh-manager-2026-08-09/`, SHA-256 `fceaaf1…28326d`; source repo checkpoint `8627640`.
- Contract: edit only column G; blank Chinese suppresses only that locale's element while the stable field remains; English is read-only and never follows a Chinese edit.
- Merge: 169-key schema plus latest proposal workbook; 31 applied P0/P1 keys rebased, six approved blanks retained, stale bilingual apply sheet removed, and 44 pending Chinese differences preserved.
- State: eight blank proposals total—the six approved localized omissions plus already-empty `site.worksHint` and `site.contactTitleBridge`; all other Chinese intentions are prefilled.
- Verification: seven sheets, 169 unique keys, 190 formulas, exact validations/filters/freeze panes, zero external links/error strings; LibreOffice calculated 169/44/125 and all nine rendered pages passed visual inspection.
- Typography/safety: consistent `Arial Unicode MS` restores cross-machine Chinese coverage while retaining template styling; original source workbook/preview hashes remain unchanged.
- External state/next: workbook stays offline/outside Git; no website, English, Figma, main, deployment, Contact, or protected-file change; producer returns the edited XLSX for guarded Chinese-only dry-run.

## 2026-08-09 — Mobile Featured reel trigger
- Branch/base: `codex/three-minute-watch-link` from Production-aligned `d109bbd`; approved spec `2c5c6ca`, implementation `a20997a`.
- Behavior: at ≤820px, 35%-eligible Featured reels use nearest-viewport-center ownership and a 700ms poster hold; desktop keeps last-DOM/1.4s and Archive keeps nearest-center/1.4s.
- Mechanism: one generic center selector serves Featured and Archive; rAF-throttled scroll/resize updates ownership; breakpoint changes invalidate the previous timer; existing poster/error/visibility/BFCache guards remain.
- TDD/validation: four RED checkpoints then focused 13/13 and full 132/132 GREEN; build, design audit, Figma export, and diff checks pass with no content, CSS, media, or Figma delta.
- Browser: bilingual 390×844/360×800 plus 1440×900, 1200×900, and 834×1112 pass; mobile play events arrive in 821–994ms, only the center reel plays/advances, and scroll handoff resets the prior reel.
- Accessibility/safety: reduced-motion and no-JS make zero MP4 requests; served-build identity, keyboard focus, overflow, console/page errors, same-origin failures, and Contact POST checks pass.
- Review: external AI was skipped as a narrow reversible regression already covered by four RED→GREEN checkpoints, 132 tests, and bilingual browser QA; required parent `docs/TOOLING.md` was absent, so no model request or review claim was made.
- Preview: authorized dist-only package = 42 files / 80,019,103 bytes / path-list `0f37772…51c05`; `dpl_BJ35n2…R1Xia` read back `Ready` / `preview` at `https://hsin-hsin-yuan-portfolio-bj2vc0fqq.vercel.app`; URL not fetched under deploy policy.
- Durability/external state: local/final backups read back at `b103409` / `3a5bf52`; authorized Hobby share-link replacement now grants anyone-with-link access, revokes the old link, and keeps the new URL outside Git at `6ad616e…5e440`; formal records cover Preview plus shareable access; no `main`, Production, alias, Contact, or protected-file change.

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
# 2026-08-13 — Hero cover refresh
- Branch/base: `codex/hero-cover-refresh` from local docs-only checkpoint `bf09433`; producer supplied a retouched replacement of the same Hero photo.
- Change: stable-path canonical JPEG is now metadata-safe 1280×960 / 85,752 bytes / `dadc009a…f5ba2`; 640/960/1280 AVIF/WebP/JPEG derivatives replace 640/960/1440 so the source is not upscaled.
- Preserved: 4:3 ratio, bilingual alt, focal points, frame/crop, copy, links, slow push, reduced motion, no-JS, and all non-Hero behavior; website and Figma share the same canonical record.
- TDD/validation: old source/hash/1440 expectations failed first; focused 50/50 and full 179/179 pass, plus build, Figma export, Hero 9/9, Featured 6/6, design audit, privacy/path and diff checks.
- Browser: English desktop, Chinese mobile, mobile reduced-motion, and desktop no-JS pass with new Hero visible, zero overflow, and no relevant image/page/console failures; existing intentional MP4 warm aborts were classified separately.
- Review: independent requested/observed/completed `gpt-5.6-sol` at `xhigh` returned `PASS`, no P0/P1/P2; reviewer confirmed Figma non-payload bytes unchanged.
- Boundary: protected document remains untracked at `945d4df9…d28fc`; no push, `main`, Production, alias, Contact, video, copy, layout, or unrelated media change.
