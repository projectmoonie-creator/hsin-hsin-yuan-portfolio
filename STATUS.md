# Portfolio Status

Updated: 2026-08-11

State: `PASS_WITH_OPEN_ITEMS`

## Current Work Package — Screening Strip Navigation Repair

- Local branch `codex/screening-strip-navigation` starts from Featured Reel
  handoff `cad590e`; formal Production/`origin/main` remains `eb444a6`. No
  push, Production, alias, Contact, `main`, or tag action occurred. The
  producer separately authorized one dist-only Preview from source `66a40cd`.
- Root cause: Tech Dreamers alone declared `watchLoopTarget: "watch"`, and the
  already-shared `renderWatchLoopItem()` honored it as an external link while
  existing tests explicitly protected that exception.
- The source exception and renderer branch are removed. Every small Screening
  Strip card now derives the same `#<featured-slug>` target from the shared
  component; `watchLoopTarget` is retired and stripped during normalization.
- Tech Dreamers still owns the same canonical TaiwanPlus `watchUrl`. Its large
  Featured media action and audited Official page remain external; copy,
  visuals, media, reel lifecycle, CSS, Figma geometry, and Contact are unchanged.
- TDD reproduced five expected contract/render failures, then focused suites
  passed 62/62. Full `npm test` passes 156/156 plus build, design audit, Figma
  export/no-diff, mobile reel integrity, privacy, and `git diff --check`.
- Generated English and Chinese HTML each change exactly one line: the Tech
  Dreamers small-card href becomes `#tech-dreamers` and loses small-card
  `target`/`rel`; no other generated-page difference exists.
- Browser QA passes English desktop pointer, Chinese 390×844 touch, and English
  360×800 no-JavaScript keyboard. All six hrefs are internal, Tech Dreamers is
  visible after activation, new windows and Contact POSTs are zero, and both
  intended large-card external links remain.
- Independent review requested/observed/completed `gemini-3.6-flash`: `PASS`,
  no P0/P1/P2.
- The audited Preview package contains 61 public files / 96,933,972 bytes;
  sorted path-list SHA-256 is
  `267394ea78521b69969304608b7c4d6a69e3386ce716679f085bc9be7dd678b0`.
  It excludes source, tests, internal docs, environments, Contact API, and the
  protected document. Vercel deployment
  `dpl_3zjGjz9fkpNnXiJjyBQ3MVJTq9iZ` independently reads `Ready`, target
  `preview`, at `https://hsin-hsin-yuan-portfolio-6rwcoi6j9.vercel.app`; its
  build is a static root with no functions, and the URL was not fetched.
- After the direct URL required login, the producer authorized a directly
  accessible check link. Vercel replaced the Hobby account's sole prior
  Shareable Link and now confirms `Anyone with the link can view and comment`;
  login is required only to comment. The access-bearing URL stays outside Git
  at SHA-256
  `9a29fc38348ef93ec9a72ad9eeb26d973d2bac07c2b089354729775eac2b83b1`.
- Exact next action: producer opens the delivered Shareable Link and confirms
  the Tech Dreamers small card scrolls to its large Featured card while both
  large-card official links still open TaiwanPlus. Production, alias, Contact,
  push, or integration requires a separate decision.

## Prior Open Work Package — Featured Reel Mobile Performance Option B

- Local-only branch `codex/featured-reel-mobile-performance` starts at reviewed
  decision head `bb08d51`; formal Production/`origin/main` remains `eb444a6`.
  This package has made no push, Preview, Production, alias, Contact, `main`,
  deployment, or closed-tag/history change.
- `data/media-manifest.json` is the only authored delivery truth. It derives six
  source-verified 960×540 silent H.264 BT.709 faststart mobile reels while
  retaining the 720p desktop fallbacks; `featured-reels:prepare` is staged and
  repeatable, and build/check fail on source, recipe, media, or hash drift.
- The six mobile files total 16,708,502 bytes versus 60,135,762 bytes (-72.2%).
  A 640/960 Slow Steps gate selected 960 because DPR3 VMAF improved 80.42→84.21
  while measured average bitrate stayed about 611kbps.
- Initial HTML remains `preload="none"` and emits one media-qualified mobile
  source before the desktop fallback. After page `load`, mobile may metadata-
  warm one settled nearby reel; it cancels on ownership/lifecycle changes,
  never warms beside active playback, and skips detectable Save-Data/2G plus
  desktop/reduced-motion/no-JavaScript states.
- Three matched 390×844 DPR3 cold runs at 150ms/1.6Mbps show immediate
  `playing` 3471→1791ms and ten-second waiting 4 events/1239ms→0. With 1500ms
  proximity lead, `playing` is 3469→708ms with 130,500 pre-eligibility bytes;
  native metadata byte volume remains a browser hint, not a universal budget.
- Three Lighthouse 13.4.1 mobile-simulate runs per side remain Performance
  0.82, TBT 0, CLS 0, and LCP 4951.662→4951.728ms. Hero priority is High and
  initial Featured MP4 requests are zero in all six runs.
- TDD RED/GREEN completes; full `npm test` passes 155/155 plus build, design
  audit, Figma export/no-diff, delivery check, diff, and six-case bilingual
  desktop/tablet/mobile/reduced-motion/no-JavaScript/keyboard/overflow/zero-
  Contact browser QA. Static no-JS mobile output is byte-identical before/after.
- Frozen implementation review completed requested/observed/completed
  `gemini-3.6-flash`: `PASS`, no P0/P1/P2. Synthetic Chromium evidence is not
  CrUX; unsupported Safari cannot expose Save-Data/2G signals.
- Open/exact next action: producer inspects this local handoff. Real iPhone
  Safari, Low Power Mode, and Wi-Fi/cellular switching are pre-Production
  checks; any Preview, push, integration, or deployment requires a new explicit
  decision for this package.

## Prior Open Work Package — P0 Hero LCP / Image Component Originalization

- Local package branch `codex/hero-lcp-optimization` starts from docs-only
  checkpoint `5483bfa02d2586d981e241d7903b8a857aace530`; the closed phase tag
  remains peeled to `82893899dad3e4f393720e2efd71b1e1cb02a350`, its remote
  backup remains aligned, and public `origin/main` remains `eb444a6`.
- Reviewed implementation commit `e45a5969f22b6300206e85ea3bd90374ce4c5b10`
  and final local handoff head `2b25f3de9db0884f626a92bf32c2676d9a3205ca`
  are read back exactly at `backup/2026-08-10/hero-lcp-e45a596` and
  `backup/2026-08-10/hero-lcp-2b25f3d`; both refs are backup only, not `main`.
- `data/site.json.heroMedia` remains the sole authored Hero truth. Its source,
  bilingual alt, dimensions, focal points, motion recipe, responsive profiles,
  encoder settings, and source hash now derive website candidates/preloads and
  continue feeding the unchanged Figma crop.
- The website now emits an initial-HTML `<picture>/<img>` with explicit size,
  bilingual alt, media-matched AVIF/WebP/JPEG candidates, eager synchronous
  decode, and high-priority image/preloads. The slow push animates only
  `transform`; reduced motion is fully static.
- `npm run hero:prepare` reproducibly creates and probes 12 derivatives. A
  generated non-public manifest binds source and recipe to every derivative
  hash/byte count; `npm run build` fails closed on stale or mixed output.
- Five frozen before/after visual cases pass with 0px geometry drift; RGB MAE is
  0.442–0.717/255 and at least 99.8815% of channel samples stay within 16.
  English/Chinese desktop, compact, tablet, mobile, no-JS, reduced-motion,
  keyboard, overflow, and zero-Contact-POST QA passes 7/7.
- Matching-condition local mobile medians use three runs per side. Direct
  DevTools throttling records LCP 6733.564→2017.077ms, Hero transfer
  195225→4410 bytes, initial priority Low→High, and non-composited animation
  items 1→0; TBT and CLS remain zero. Lighthouse simulation is disclosed as
  effectively flat at 4878.116→4877.315ms, so no production/CrUX claim is made.
- Full validation passes 148/148 plus build, Hero manifest check, design audit,
  Figma export with byte-identical SVGs, privacy, diff, and protected-file
  checks. Formal Gemini (`gemini-3.6-flash`) and Claude (`opus`) attempts both
  remained incomplete with no observed/completed model; local adjudication
  found no current P0/P1/P2 implementation finding.
- The producer separately authorized a Preview from final handoff head
  `2b25f3d`. A fresh allowlisted dist-only package contains 47 public files /
  78,555,125 bytes; sorted path-list SHA-256 is
  `f7da8543915f997eb951dd8ad05e7075d50960e433ea03562d64525515aa8262`.
  It excludes nine unreferenced copied assets, repo source, tests, internal
  documents, environments, the Contact API, and the protected document.
- Vercel deployment `dpl_7syJAsyC85BncuAh9JD2WLw48jx2` independently reads
  back `Ready`, target `preview`, with a static root and no functions:
  `https://hsin-hsin-yuan-portfolio-5v98ywoxl.vercel.app`. The URL was not
  fetched under the active deployment policy, and no Contact request ran.
- Vercel build logs later proved that GitHub backup pushes also auto-deployed
  three Ready Git-integrated Previews with the full repo build and Contact
  function: `e45a596` → `dpl_9mPj5S2ShHoo2V3qydXgTfVcwAz4`, `2b25f3d` →
  `dpl_ADzMGirbpbPP1UD6xV6sjw3nijpo`, and `bfe7df0` →
  `dpl_y6jjYWwhcC1aZbbiG1NXeowZ63b7`. The first two occurred before the
  producer's Preview authorization, correcting the earlier false claim that
  no Preview occurred; the third followed the authorized Preview record.
  None targeted Production or received a Contact request. They remain intact
  because deployment deletion was not authorized.
- Preview-time metadata inspection found a pre-existing Production identity
  drift: the canonical alias resolves to Ready/Production
  `dpl_14E9G3amzXj2iL6xKvQZQWadypXq`, created three minutes after the recorded
  `dpl_4i1jTqt3Qq9FjchMnMXEGKrEYwkv`. Both expose the same build configuration
  and Contact-function digest; Vercel inspect does not expose their source
  commit, so no content-equivalence claim is made. This Preview did not change
  Production or its aliases, and `origin/main` remains `eb444a6`.
- Open items: producer inspection of the direct Preview and any later
  accessible online/PageSpeed measurement. Optional lighting/button work
  remains deferred. The producer must also decide whether to retain/delete the
  three Git-integrated Previews and how future backup pushes avoid deployment.
  No shareable-link replacement, Production deployment, alias change, Contact,
  `main` merge, or `main` push occurred.

## Prior Work Package — Portfolio Phase Closeout

- Public-output baseline `eb444a6dade9a721d97adf239468bf22d3360bf8`
  contains the producer-approved Chinese Copy Round 2 Production release.
  `origin/main` remains exactly at that commit. The docs-only closeout evidence
  is retained on `codex/three-minute-watch-link`; it changes no website source,
  public build, deployment configuration, alias, media, or Contact behavior.
- Full `npm test` passes 144/144. Build, Figma export, design-contract audit,
  privacy, protected-file, and diff checks pass. The released package retains
  its 14/14 bilingual desktop/tablet/mobile, reduced-motion, and no-JavaScript
  browser evidence plus four visually inspected screenshots.
- Gemini requested/observed/completed `gemini-3.6-flash` for the production
  package and returned `PASS` with no findings. The formal phase-closeout
  review later requested dynamic `opus`, observed/completed `claude-opus-5`,
  and returned `PASS_WITH_OPEN_ITEMS`; its public-product assessment found no
  truth, privacy, rights, accessibility, functional, or deployment blocker.
  An earlier Chinese-package Claude timeout remains historical incomplete
  evidence and is not counted as review coverage.
- Production deployment `dpl_4i1jTqt3Qq9FjchMnMXEGKrEYwkv` remains the
  closeout's recorded release identity. Later Preview-time metadata readback
  found the canonical alias on `dpl_14E9G3amzXj2iL6xKvQZQWadypXq`; see the
  current-package section above. The historical closeout itself created no
  Preview or Production deployment and submitted no Contact request.
- Formal recovery names are
  `backup/2026-08-10/portfolio-phase-closeout` and annotated tag
  `portfolio-phase-2026-08-10-closed`, both pointing to the final docs-only
  closeout commit after push/readback. `main` is not moved by this closeout.
- The protected user-owned document remains outside Git and byte-identical at
  SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.
  It is the only untracked file that must never be staged or committed.

## Prior Work Package — Final Chinese Interface Preview

- Frozen release candidate `0ad90f2a2e6e244f986ae52e05ad657f6d605cd5`
  applies the final producer workbook through 54 stable-key entries: 19 P0,
  35 P1, 50 Chinese replacements, four Chinese blanks, and 54 English keeps.
  The workbook SHA-256 is
  `ebc35ed3ec878e6a9f4eaafcf9e1a04529eb4fc7bc436b44a31a7fb64959c2f4`.
- All 108 final locale postconditions match. The four exact-empty Chinese
  fields remain canonical but omit their complete rendered elements: the
  second Hero title line, two official-page card titles, and the Top Gear
  tagline. Whitespace-only remains invalid; later refill uses the same keys.
- Chinese Hero now renders one `袁欣欣` line. Both official cards retain image,
  `官方頁面`, source, destination, and audit metadata without an empty title
  gap. English remains independently populated; built English HTML is exactly
  unchanged at SHA-256
  `84e7933a7c41fa5a867c0f6fd8423dbd57e1afeb41576eb97280ea74e548d7b3`.
- Full `npm test` passes 139/139; build, Figma export, design-contract audit,
  and diff checks pass. Native Chromium passes 16/16 bilingual desktop,
  compact, tablet, mobile, reduced-motion, no-JavaScript, keyboard, overflow,
  empty-element, error, and Contact-submission cases. Mobile Featured playback
  began at about 740ms after the 700ms poster-hold contract.
- Local adjudication is `APPROVE_PREVIEW` with no P0/P1/P2 findings. Gemini
  remained incomplete because external-payload escalation was denied before
  execution; Claude remained `handoff-to-active-session` with no request.
  No external model, spend, or cross-model consensus is claimed.
- Exact recovery ref
  `backup/2026-08-09/final-chinese-portfolio-0ad90f2` was pushed and read back
  at `0ad90f2a2e6e244f986ae52e05ad657f6d605cd5`.
- The privacy-scanned dist-only package contains exactly 42 public files /
  80,018,591 bytes; sorted path-list SHA-256 is
  `bc6f8e208fd2ed414bd75212bc156c98cffe397d76374b49ea45a05e3b30f143`.
  Repo source, tests, internal reviews, environments, Contact API, and the
  protected document were not uploaded.
- Vercel deployment `dpl_H2i7G3DdyWeqSfFLFLEubq6Rx9r2` was independently
  read back as `Ready`, target `preview`:
  `https://hsin-hsin-yuan-portfolio-lujpvjbpo.vercel.app`. Per deployment
  policy, the deployed page itself was not fetched after creation.
- The producer-authorized Hobby share-link replacement succeeded. Vercel now
  displays `Anyone with the link can view and comment` and confirmed that a
  new shareable link was generated/copied; the prior shareable link is revoked.
  The access-bearing clipboard value was read once for producer delivery and
  remains outside Git; its SHA-256 is
  `ef3b854bba5653caf6402fc35261254f98f464a13ac83dd22e6cb39c02902dff`.
- No `main`, Production, alias, Contact POST, or protected-file mutation
  occurred. The protected untracked review remains outside Git and
  byte-identical at SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.
  Exact next action: producer inspects this Preview; only an explicit approval
  after inspection permits fast-forwarding `main` and Production.

## Prior Work Package — Mobile Featured Reel Trigger

- Approved design checkpoint `2c5c6ca` scopes the change to Featured reels at
  `820px` and below: among 35%-eligible videos, the viewport-center reel owns
  playback and holds its poster for 700ms. Desktop retains last-DOM ownership
  and 1.4 seconds; Archive retains nearest-center ownership and 1.4 seconds.
- Implementation `a20997a` reuses one generic center-distance selector for
  Featured and Archive, keeps the Archive compatibility export, refreshes
  Featured ownership through a requestAnimationFrame-throttled scroll/resize
  listener, and safely replaces in-flight timers when crossing the breakpoint.
  Content, media, links, card geometry, CSS, Figma output, and reduced-motion
  behavior are unchanged.
- TDD observed three initial contract failures plus a separate breakpoint-timer
  failure, then passed 13/13 focused runtime/selection tests. Full `npm test`
  passes 132/132; build, design-contract audit, Figma export, and diff checks
  pass with no tracked Figma delta.
- Native Chromium QA passed English and Chinese at 390×844 and 360×800,
  desktop at 1440×900 and 1200×900, and tablet at 834×1112. Mobile `play`
  events arrived in 821–994ms including browser/media startup; the selected
  center reel alone gained `is-playing` and advanced past 0.1s, then reset and
  handed off correctly on scroll. Desktop remained on the 1.4-second policy.
- Reduced-motion hid all six Featured videos and made zero MP4 requests;
  no-JavaScript also made zero MP4 requests. Served-build identity, ten-step
  keyboard focus, horizontal overflow, console/page errors, same-origin request
  failures, and Contact POST checks all passed. Two bilingual mobile screenshots
  were visually inspected; the existing poster-to-video crossfade and layout
  remain intact.
- Dated backup
  `backup/2026-08-09/mobile-featured-reel-trigger-local-b103409` was pushed and
  read back exactly at `b103409ed2264ffc39b830501313c5dcd496cc74`. This
  local validation package was closed at `3a5bf52` and read back from
  `backup/2026-08-09/mobile-featured-reel-trigger-final-3a5bf52` before the
  later Preview authorization.
- The authorized fresh dist-only package contained exactly 42 public files /
  80,019,103 bytes, with sorted public path-list SHA-256
  `0f377720c89e087b1898e84045b34fdc4f4b1a0243ce622a028556de6f351c05`.
  Repo source, internal docs, environments, Contact API, and the protected file
  were excluded; Vercel CLI 58.9's unsupported `--dry-run` flag failed before
  any upload, so the local file-level privacy audit served as the release gate.
- Deployment `dpl_BJ35n23AjLaDfevrDpmEJy6R1Xia` was read back by Vercel CLI as
  `Ready`, target `preview`:
  `https://hsin-hsin-yuan-portfolio-bj2vc0fqq.vercel.app`. The URL was not
  fetched after deployment under the active deployment skill; no browser or
  Contact request was made against it.
- A later producer authorization replaced the Hobby account's sole prior
  Shareable Link for this exact Preview. Vercel confirmed
  `Anyone with the link can view and comment`; login remains required only to
  comment. The access-bearing URL stays outside Git at SHA-256
  `6ad616ea8e08a003db1556245196d46c969afada15d838d3d106b3534c75e440`.
  Project-level `Require Log In` remains enabled for direct Preview URLs.
- No `main`, Production, alias, deployment-content, or Contact action occurred.
  External AI review was skipped as a narrow, reversible, fully tested
  regression; the required parent `docs/TOOLING.md` reviewer source was absent,
  no model request was sent, and no external-review claim is made. The formal
  records are `docs/reviews/mobile-featured-reel-trigger-preview-2026-08-09.md`
  and `docs/reviews/mobile-featured-reel-shareable-access-2026-08-09.md`.
  The protected untracked review remains byte-identical at SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.
- Exact next action: the producer should open the new share URL on the target
  mobile browser and manually check the 700ms autoplay/scroll handoff. Any
  `main` or Production integration remains a separate explicit authorization.

## Prior Work Package — Intentional Localized Blanks

- The producer approved six Chinese values as intentionally blank while
  retaining every field/key and allowing English to remain populated. Source
  data now keeps `zh.availability[5]` as the sixth array slot and five
  `tagline.zh` properties as exact empty strings; no field was deleted or
  reindexed.
- `editorial/copy-work-orders/2026-08-09-intentional-zh-blanks.json` records
  six English keeps and six explicit Chinese blanks with exact-current guards.
  The reusable mechanism now supports named `blank` operations and guarded
  refill from `expected: ""`.
- Featured taglines remain structurally bilingual but may be empty per locale;
  titles, roles, and descriptions remain non-empty. Site availability retains
  matching bilingual array shape and accepts only populated or exact-empty
  string slots. Missing, null, non-string, and whitespace-only values fail.
- The renderer omits the complete empty tagline/pill element, not merely its
  text. CSS and component geometry are unchanged, so the next sibling moves up
  in normal flow and no empty DOM/spacer remains.
- TDD reproduced the three old assumptions before implementation. Focused
  tests pass 69/69; full `npm test` passes 128/128; build, Figma export,
  design-contract audit, and diff checks pass.
- Chromium QA passed `/en/` and `/zh/` at 1440×1100 and 390×844. English keeps
  six availability/tagline outputs; Chinese renders five availability pills
  and only the one still-populated Top Gear tagline. Empty elements, console
  errors, and page errors are zero. Twelve section screenshots were inspected.
- Final review packet SHA-256 is
  `95ca9c4475824b33dd476c918e38c2174419fc9f7325eaa54030b075b7c46d9a`.
  Gemini requested/observed/completed `gemini-3.6-flash`, returned PASS with no
  findings, and used 1,823 input / 130 output / 2,997 total tokens. Local
  adjudication requires no remediation.
- The producer authorized an online Preview and `main` on 2026-08-09. The
  privacy-audited dist-only Preview dry-run contained exactly 42 public files /
  80,017,465 bytes. Deployment `dpl_7FFRu6wKnygpKymrCHHcquwqM4WX` is `READY`,
  target `preview`, with no serverless output:
  `https://hsin-hsin-yuan-portfolio-2bxarvj4o.vercel.app`. Project SSO remains;
  the Hobby account's existing shareable link was not revoked or replaced.
- Preview browser QA passed English and Chinese at 1440×900, 1200×900,
  834×1112, 390×844, and 360×800: six Featured and five Archive records remain,
  localized optional counts are exact, empty DOM nodes and horizontal overflow
  are zero, keyboard order is usable, and console/page errors are zero.
- Remote `main` was backed up first at
  `backup/2026-08-09/pre-bilingual-main-03ad08a`, read back exactly at
  `03ad08ac4dd3a47d300cab99f2dd569353e13ec9`, then fast-forwarded to reviewed
  release source `332d9ed853516a9c192f0e5596fc6b2311a6e8ee`.
- The Git integration created Production
  `dpl_5C2gcfoRqjEmVb3DbZ1Kh57Hs1E4`, which is `READY` and owns canonical alias
  `https://hsin-hsin-yuan-portfolio.vercel.app`. Production browser QA passed
  14 English/Chinese cases: the same five viewport sizes plus reduced motion
  and no JavaScript, with HTTP 200, no overflow, no same-origin failures, and
  no console/page errors. Contact remained unsubmitted.
- Reviewed implementation `e13c5d512ee8a942bbe895d040c320e911f38b11`
  remains recoverable at the feature branch and implementation backup; the
  source-plus-documentation checkpoint is preserved by the final dated backup
  reported externally after this record commits. The protected untracked file
  remains outside Git and byte-identical at SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.
- Exact next action: producer review may use the direct Preview while logged in
  to Vercel or the public Production alias. The remaining 44 Chinese
  differences, role-taxonomy/JSON-LD alignment, lighting, or replacement of the
  existing Hobby shareable link each requires a separate bounded approval.

## Prior Work Package — Guarded Bilingual Copy Work Order

- Branch `codex/three-minute-watch-link` resumed at frozen baseline
  `2f56352cb3049ab8fb535c0ae3c1d0fa57cb599f`. Batch 0 mechanism is
  `6fb3501cdce17902691d41c8aeaaf66c8cff5e36`; P0 site copy is
  `e0c5e3566dc66c6556817d715de41df7f73bf695`; reviewed P1 Featured copy is
  `d5942d13c7af212db8e63ff9fd5e180bae737198`.
- The producer-approved Excel/JSON selection is preserved as schema-v1 work
  order `editorial/copy-work-orders/2026-08-09-priority-bilingual.json` with
  source SHA-256 records. Stable `site.*` and `featured.<slug>.*` keys,
  paired `en`/`zh`, exact expected-current preconditions, explicit
  replace/keep operations, dry-run default, P0-before-P1, sibling staging,
  handled rollback, and replay rejection make later replacement repeatable.
- P0 changed exactly 13 site keys / 26 bilingual values in `data/site.json`.
  P1 changed exactly 18 Featured keys / 31 values, with five explicit English
  keeps, across six canonical work files. Generated Figma handoff updated only
  the corresponding editable text layers; layout/component geometry did not
  change.
- TDD covered schema, safe CLI, structural duplicate-token targeting,
  P0/P1 preconditions, rollback cleanup, final bilingual postconditions, and
  replay rejection. Full `npm test` passes `123/123`; build, Figma export,
  design-contract audit, old-copy search, privacy, and diff checks pass.
- English/Chinese Chromium QA passed at 1440×900 and 390×844. Hero,
  collaboration copy, all six Featured works, and Contact remain within the
  viewport; long English mobile copy wraps without clipping. Contact exposes
  seven fields. Horizontal overflow, console errors, page errors, and failed
  requests are all zero; no form was submitted.
- Frozen final review packet SHA-256 is
  `7049638fa070980def02e4b52b746d348766fe95833e3ab8f77073168b87246e`.
  Gemini requested/observed/completed `gemini-3.6-flash` and returned `PASS`
  with no findings (input 2,191 / output 162 / total 3,614 tokens). Local
  adjudication requires no remediation. The architecture brainstorm's Claude
  lane remains `handoff-to-active-session`; no Claude model request was sent,
  no paid fallback was used, and no dual-review consensus is claimed.
- Remote durability refs read back exactly: P0
  `backup/2026-08-09/bilingual-copy-p0-e0c5e35` at `e0c5e35`, and P1
  `backup/2026-08-09/bilingual-copy-p1-d5942d1` at `d5942d1`. Earlier Batch 0
  is preserved at `backup/2026-08-09/bilingual-copy-work-order-6fb3501`.
- This branch was not merged or pushed to `main`; no Preview, Production,
  alias, deployment, or Contact action occurred. The protected untracked file
  remains outside Git and byte-identical at SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.
- Open producer decisions: the broader revised workbook retains 44 actual
  Chinese differences outside this package; `site.heroRoles` and static
  JSON-LD `jobTitle` retain the older taxonomy because they were not among the
  31 approved keys. Either follow-up requires a new bounded approval.

## Prior Editorial Artifact — Chinese Interface Manager

- The originally delivered XLSX was recorded as
  `../outputs/hsin-hsin-yuan-zh-manager-2026-08-09/Hsin-Hsin-Yuan-Portfolio-Chinese-Interface-Manager-2026-08-09.xlsx`,
  SHA-256
  `fceaaf17714ad6513d88c052b8e91b378553095f148455d3768ac8ef2d28326d`.
  That exact path is no longer present. The producer-owned offline directory
  currently contains a Numbers file (SHA-256
  `adf3e0dd5acc9dc34ac2bff901c193efc958565730e7b37e258b71ad1dac3ea0`)
  and `Hsin-Hsin-Yuan-Portfolio-Chinese-Interface-Manager-2026-08-09-recovered.xlsx`
  (SHA-256
  `5efb3d319c1b0cc78778c3776edb1ddf55f85df8d742db2dda05b05a78cf17e5`).
  This closeout does not modify or declare either file authoritative.
- It merges the newer producer/ChatGPT proposal layer with the 169-key schema
  and current repo at `8627640`. The 31 already-applied P0/P1 keys are rebased;
  the remaining 44 actual Chinese differences are preserved as pending
  proposals. The stale bilingual `Codex 套用清單` was removed.
- Column G is the only Chinese edit surface. A blank means that locale's element
  does not render while its stable key/field remains; English is a separate
  read-only reference and does not move with Chinese. All nonblank intentions
  are prefilled, so later producer-cleared cells are unambiguous.
- Exactly eight Chinese proposal cells are blank: the six approved localized
  omissions plus already-empty `site.worksHint` and
  `site.contactTitleBridge`. Status totals are 44 `需修改`, 88 `已確認`, and
  37 `保留原文`.
- Verification passes seven sheets, 169 unique keys, 190 formulas, exact data
  validations, filters/freeze panes, zero external links, zero formula-error
  strings, and a valid XLSX package. LibreOffice calculated 169 / 44 / 125 and
  rendered nine pages; every page passed visual inspection with Chinese text
  and layout intact. The workbook uses `Arial Unicode MS` for cross-machine
  CJK coverage while preserving the existing template styling.
- Original sources remain unchanged at SHA-256 `1d0210c…c9600` and
  `e047223…dd897`. Formal record:
  `docs/reviews/chinese-interface-manager-workbook-2026-08-09.md`.
- The manager files remain offline and outside Git; no website, English,
  Figma, deployment, Contact, or protected-file action occurred. Before a
  future Chinese-copy package, the producer must select the authoritative
  manager file and export one explicit XLSX for a guarded Chinese-only dry-run.

## Prior Local Work Package — Three-Minute Full-Series Link

- Branch `codex/three-minute-watch-link` starts from local `main`
  `8b183320b7e96cdf065ef8d727e2049224eba097`. The exact pre-change state is
  preserved and read back at remote backup
  `backup/2026-08-06/pre-three-minute-watch-link-8b18332`.
- The Three-Minute Micro Drama Series Archive card now uses the existing
  repo-configured `watchUrl` / `watchLabel` contract to open the producer-
  supplied public playlist
  `https://www.youtube.com/playlist?list=PLDTnN3czXyG8`. Its localized actions
  are exactly `Watch the full series` and `觀看完整系列`; no renderer, CSS,
  JavaScript, media, Figma, card-order, or slideshow behavior changed.
- TDD observed the missing URL and one-link Archive count fail, then pass.
  Focused tests pass `2/2`, the build-site suite passes `38/38`, and the full
  suite passes `111/111`; build, Figma export, design audit, and diff checks
  pass with no tracked Figma delta.
- English desktop and Chinese mobile browser QA verify the exact destination,
  localized visible text and accessible name, dispatched click target, zero
  horizontal overflow, and zero console, same-origin-request, or Contact
  errors.
- Frozen review packet SHA-256 is
  `484262875809a7cfcc5602d8faa6f69bbfd67916313bc46796bf558eab859cd1`.
  Gemini requested/observed/completed `gemini-3.6-flash` and returned `PASS`
  with no findings. Local adjudication accepts the sole residual risk: future
  YouTube availability and playlist visibility remain external dependencies.
- This package is local only. It has not been merged into `main`, pushed to
  `origin/main`, deployed to Preview or Production, aliased, or used to submit
  Contact. The protected untracked review file remains user-owned, unmodified,
  and outside Git.

## Prior Integrated Work Package — Ghost Hand Archive Slideshow

- Source branch `codex/ghost-hand-archive-slideshow` starts from local and remote
  baseline `03ad08ac4dd3a47d300cab99f2dd569353e13ec9`. Local `main` was
  fast-forwarded to reviewed package head
  `233abbceffec03c9c940f09c55f3b41e560563f7` on 2026-08-06. Validated behavior
  head is `9d84132e650027ad1dbfeb4211ead9a99f776e3c`; this documentation-only
  integration follow-up is reported externally after commit.
- The approved six-still `Gui Shou Shen Che` package is now one repo-configured
  vertical slice: `slideshow.json` owns order, source fingerprints, dimensions,
  focal points, 50-frame slots, 1→1.035 motion, eight-frame dissolves, poster,
  stable public paths, rights, and bilingual alt. The generic recipe validator,
  HyperFrames HTML generator, guarded CLI, WebP privacy parser, and rollback
  writer contain no Ghost Hand special case.
- Raw producer-approved originals remain ignored and outside Git. Six tracked
  1280×720 metadata-safe WebPs are authoring derivatives only. The public poster
  is 144,878 bytes, SHA-256
  `fadb961b9eed9ec4f4f4e77e0afa0a9ac25050a7a95398d2d19b407adcbca5f3`;
  the silent 10-second MP4 is 3,838,732 bytes, SHA-256
  `9a602f249559cbb613180e4c6eb173ea10060818a69a11b5907789cf16b62b52`.
- HyperFrames provenance: initial plan/scaffold pin requested `0.7.88`; the
  official upgrade check observed `0.7.94`; authoring check and completed render
  used pinned `0.7.94`. The output is H.264 1280×720 yuv420p BT.709, one video
  stream, zero audio, faststart, and full-decode clean.
- TDD covered still-vs-video poster provenance, recipe/timeline safety, generic
  composition reuse, redacted dry-run, metadata fail-closed behavior, atomic
  rollback, exact media integration, normalized focal CSS, and nearest-visible
  Archive reel arbitration. Full `npm test` passes `111/111`; build, Figma
  export, design audit, manifest/media integrity, HyperFrames strict check,
  privacy scan, and `git diff --check` pass.
- English desktop 1440×1000 and Chinese mobile 390×664 Playwright QA confirm
  poster hold, Ghost Hand playing after 1.4 seconds, exactly one active Archive
  reel, successful poster/MP4 requests, and mobile scroll handoff from Ghost
  Hand to Three-Minute. Reduced motion keeps the static poster. Console errors,
  same-origin request failures, and Contact POSTs are all zero.
- Formal closeout reviewed local-main checkpoint
  `4dab6d77c87ddddd5564bf709016ada99c6e0b57`. Frozen packet SHA-256 is
  `c075e4f486b66d272ac00b88ceba253faf6193a404dcfd0d536ca4d98ef4293f`.
  Gemini requested/observed/completed `gemini-3.6-flash` and returned `PASS`
  with no findings. Claude remains `handoff-to-active-session`; no model
  request was sent and no dual-review consensus is claimed. Local adjudication
  requires no remediation.
- The producer authorized a shareable Preview on 2026-08-06. Exact source
  commit `b7d3fe142b3c82fbcaeb384adc7209fc3089ab75` fixes the closeout artifact's
  private-path regression and passes `111/111` plus build. Vercel dry-run
  enumerated exactly 42 public `dist/` files / 80,016,741 bytes. Adopted
  deployment `dpl_Gy96AtLGzKzLyAwQEzVhwbtUw7Rz` is `READY`, target `preview`,
  with no serverless-function output:
  `https://hsin-hsin-yuan-portfolio-ku5d9znnk.vercel.app`. It excludes repo
  source, internal reviews, environments, `api/contact.js`, and the protected
  file; Contact delivery is intentionally unavailable. Project SSO still
  protects the direct URL. The producer explicitly authorized replacing the
  Hobby account's old shareable link; Vercel confirmed `Anyone with the link`,
  revoked the old link, and generated a new protected-bypass URL. Its full
  access parameter is delivered only in conversation, not Git; URL SHA-256 is
  `c262013b2f03a8485b29a42c45f8308f80700ee9d607dc571e778dd619b4f4f3`.
- The producer approved the local Preview and authorized the local-main merge
  on 2026-08-06. The merge is complete. Remote backup
  `backup/2026-08-06/ghost-hand-main-ae20130` read back at the pre-record
  checkpoint `ae201300c6925b46097fbfca57319495a0a5a4e5`; final backup ref
  `backup/2026-08-06/pre-shutdown-final` preserves this documentation follow-up.
  Separate legacy backup `backup/2026-08-06/cinematic-b29b745` read back at
  `b29b7459860844f462f1e1bb8a166bb4ba0e4a25`. `origin/main` remains
  `03ad08ac4dd3a47d300cab99f2dd569353e13ec9`. No Production promotion,
  Production deployment, alias change, or Contact submission occurred. The
  protected untracked review file remains user-owned, unmodified, and outside
  Git; its SHA-256 remains the required
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.
- Next action: send the generated shareable URL for outside Chinese-copy
  feedback, consolidate responses, then start a separate bounded Chinese-copy
  and bilingual-layout normalization package while preserving the approved
  English baseline. Revoke the shareable link after feedback closes. Lighting
  remains later, after bilingual geometry approval. Any further Preview,
  feature or `main` push, or Production action requires separate explicit
  authorization; a `main` push is Production-affecting. Backup refs and
  checkpoint tags are durability-only and are not releases.

## Prior Work Package — Collaboration Logo Wall Component

- Branch `codex/collaboration-logo-wall` starts from inherited package head
  `c33b2f810e95ba2a38146b2daf7ff1220b0d1712`; the logo-completion increment
  starts from `7ba8a6215bd49714c3690e66b3a5ba74b44c3b1e` and its validated
  implementation commit is `f900e7b31321e7b702d4c659340c6b4c85e5f02e`.
- `data/collaborations.json` now owns one normalized seven-entry collection
  consumed by both website and Figma export. Six entries use verified or
  producer-supplied SHA-locked sources plus deterministic local cream
  derivatives. Women Make Waves remains the sole visible text fallback pending
  a trustworthy standalone asset.
- The shared component provides strict public/evidence separation, three
  optical tokens, accessible logo/fallback semantics, four desktop slots, two
  mobile slots, centered incomplete rows, and no collaborator-specific layout
  code. Normal add/remove work is data-only; verified mark replacement uses the
  offline SHA-locked `npm run collabs:prepare` path. ScreenHouse exercises one
  allowlisted evidence-only SVG treatment that removes its two opaque
  background rectangles without editing the preserved official source.
- TDD passed for contract, asset safety/integrity, website, Figma parity, and
  fallback semantics. Full `npm test` passed `93/93`; asset prepare produced six
  derivatives; build, Figma export, and design audit passed. Implementation
  paths pass `git diff --check`; the immutable frozen packet retains four
  intentional Markdown hard-break spaces and is recorded by exact SHA-256.
- English/Chinese Chromium QA passed at 1440×900 and 390×844: complete images,
  canonical order, exact 4+3 / 2+2+2+1 rows, centered final rows, visible focus,
  no horizontal overflow or evidence leak, and no console/page/request errors.
- Frozen review packet SHA-256 is
  `531d94258ebb6c4ec3762cc336aaa07f873802a75323e53091ff475d4deba7e8`.
  Gemini requested/observed/completed `gemini-3.6-flash` and returned PASS with
  no actionable findings. Claude remains `handoff-to-active-session`; no model
  request was sent and no dual-review consensus is claimed.
- The producer authorized GitHub preservation and a temporary formal release on
  2026-08-06. Remote backup ref
  `backup/2026-08-06/pre-lighting-zh-refinement` and annotated tag
  `portfolio-baseline-2026-08-06-pre-lighting` were pushed and read back at
  checkpoint `4d4a27ae23fa6950000dedaeb3883da52c352b84`, which contains
  implementation `f900e7b`. `origin/main` first reached that checkpoint and
  then received only this deployment-record follow-up; public source output is
  unchanged by the follow-up.
- The `origin/main` push automatically triggered GitHub deployment
  `5774226594` for Production at exact checkpoint `4d4a27a`; GitHub reported
  `success` / `Deployment has completed` with environment URL
  `https://hsin-hsin-yuan-portfolio-vvbwab0q9.vercel.app`. No manual Vercel
  command, alias change, or Contact submission occurred. The protected
  untracked file remains outside Git at SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.
- Accepted next-phase direction: normalize Chinese copy and bilingual layout
  variants before reintroducing light effects. Preserve English copy as the
  approved baseline; move intentional language differences into canonical
  localized data and named component/layout variants, then add lighting as a
  separate visual package against the stabilized bilingual geometry.

## Prior Work Package — Overclocking Static Poster And Mobile Reel Diagnosis

- Branch `codex/overclocking-static-poster` starts from backed-up local `main`
  `58a57511825fb54edd53f7883483abb2bfa8b50e`; implementation commit is
  `7dddff985727840afd796ddccfa6d41a9c4b8b5c`.
- The user-approved local production photo `P1070715.jpg` is now the canonical
  Overclocking poster derivative. The public WebP remains on the stable
  1280×720 path, is 68,144 bytes, and has SHA-256
  `d892d7a8c8375c6097952551b121cfa2ba98c410816b4430b69b1a0e6d38490c`.
  The source basename and SHA are retained as evidence without storing its
  private absolute path; the obsolete video timecode was removed.
- TDD observed the replacement contract fail against the old poster evidence,
  then pass. Full `npm test` passed `79/79`; build, Figma export, design audit,
  manifest integrity, `git diff --check`, and a 390×664 mobile poster-load
  probe passed.
- Three-Minute Micro Drama was diagnosed without changing playback code. At
  mobile size with normal motion preference, the existing 1.4-second hold
  resolves `video.play()` and advances the 10-second muted inline reel. With
  `prefers-reduced-motion: reduce`, the current accessibility contract hides
  the reel and keeps the poster static, so no autoplay request is made.
- The recorded Vercel Preview remains protected by Vercel login for automated
  QA. It was not replaced or redeployed in this package and therefore does not
  contain the new Overclocking poster. `origin/main`, Production, aliases,
  Contact, and the protected untracked file remain untouched.

## Prior Integrated Baseline — HeroMedia Closeout Remediation

- Local `main` was fast-forwarded from
  `e2d75f0e57ff0d6f0d64ff5381a04a3314b35481` to reviewed closeout head
  `bba4ea0d32b60121ada26ae1b2dfaf20af4dedc1` on 2026-08-04. This
  documentation-only integration status follow-up is reported externally after
  commit.
- Source branch `codex/hero-media-closeout-remediation` was pushed and read
  back exactly at `bba4ea0d32b60121ada26ae1b2dfaf20af4dedc1` before the local
  merge.
- Remote backup ref `backup/2026-08-04/e2d75f0` was created before remediation
  and read back at the exact pre-remediation commit above.
- Validated implementation head is
  `63e51bf0f93cc8b4da3894dac091dd0ad5e2978b`; the later commits add durable
  handoff, reviewer provenance, and adjudication only.
- The bounded TDD package closes four review findings: fail-closed JPEG APP
  metadata, Figma/live Hero starting-crop parity, responsive focal points during
  motion, and this cold-resume record.
- Focused tests passed `54/54`; the full suite passed `79/79`. Design audit,
  build, Figma export, `git diff --check`, public-Hero integrity, and protected
  file integrity passed. Local browser QA passed English desktop, Chinese
  stacked, and English mobile reduced-motion cases with no Play/video,
  overflow, console, page, or request errors.
- Frozen review packet SHA-256:
  `368e0fe6909791c854f217c80dcdc9499b66b30a3e2a664626ec2ff74ca113fd`.
  Gemini completed `PASS` with no findings on requested/observed/completed
  `gemini-3.6-flash`; local adjudication closes all four original findings as
  `already-fixed`. The raw response's conflicting self-label was rejected in
  favor of the wrapper's machine provenance. Claude remains
  `handoff-to-active-session` with no model request sent, so no dual-review
  consensus is claimed.
- A mobile-ready feature Preview was created from the committed public `dist/`
  generated at local `main` commit
  `e9f09afdd8de220c4c4455dfc4e9a3dccd584164`:
  `https://hsin-hsin-yuan-portfolio-mve5a1pl9.vercel.app`. Vercel deployment
  `dpl_8vwDEtrbrG5vzqreik78rnqMH4Ax` was read back as target `preview`, status
  `Ready`, on 2026-08-05. The upload contained only 33 public build files; repo
  sources, internal review docs, the protected file, and `api/contact.js` were
  not uploaded.
- `origin/main`, aliases, Contact submission, and Production remain untouched.
  The protected untracked review file remains unmodified and outside Git.

## Prior Accepted Work Package — HeroMedia Component And Showreel Retirement

- Reviewed feature branch: `codex/hero-media-component`; package base and full
  rollback point: `fb6517591e34b9cb20d814891c0177cf2ac9ba2c`.
- Local `main` was fast-forwarded to validated behavior head
  `0d110353a9b0133878271f5eebc1ab69bcc9d6cd` on 2026-08-04. This local
  integration has not been pushed; `origin/main` remains
  `382e02a21fbcf6ffef68881b7e497235eaf8a7a8`. The documentation-only status
  commit is reported externally after commit.
- The parity-preserving extraction commit is
  `5539c43373ac6d024d51b8f27c8aa8e1577991b3`; reverting the subsequent
  behavior commit reported externally after commit restores Play/showreel
  while keeping the canonical HeroMedia component.
- Hero is now one validated, localized, non-interactive image component shared
  by the website and authoritative Figma SVG export. The exact approved
  18-second slow push remains; reduced motion is static.
- The active Hero Play/video path, bilingual showreel copy, playback JS/CSS,
  and public website reel MP4/poster are retired. Authoring evidence remains
  recoverable under `showreel/website-visual-reel/` with an explicit note.
- The public 1920×1440 JPEG now has SHA-256
  `756c072edb8f760718d903b8bd5cfc9e53a343efec69bc2821b78e3043f67bac`.
  Removing 5,848 metadata bytes did not change decoded pixels; before/after
  frame MD5 is `374cfe5ba6ee18ea0a402016f8a160aa`.
- Focused suites passed 53/53; full `npm test` passed 78/78. Design audit,
  build, Figma export, diff check, English/Chinese desktop/mobile browser QA,
  reduced-motion, no-JS, console/request checks, and protected-file recheck
  passed.
- Frozen review packet SHA-256:
  `fed9a94679092b2f5f0f0c13640d02574d21c186cbfd81591290c6330188e959`.
  Gemini completed `PASS` with no findings on `gemini-3.6-flash`; Claude is
  honestly `incomplete` at subscription-session handoff, so no dual-review
  consensus is claimed.
- Vercel Preview, aliases, Contact, and Production are untouched. The protected
  untracked review file remains unmodified and outside Git.

## Prior HeroMedia Open Item

Submit the same frozen packet to the active Claude subscription lane when it is
available. The usable Gemini lane plus local gates close this producer-gated
feature package; the missing lane remains a recorded review follow-up.

## 2026-08-04 Process Diet Finalized

- `PROJECT_BIBLE.md` and `AGENTS.md` amended per
  `docs/reviews/2026-08-04-process-diet-proposal.md` (v2, Codex-audited);
  Bible stays at 165 lines; `npm test` 61/61; `git diff --check` clean.
- Backup refs read back verbatim: `backup/main-2026-08-04`,
  `backup/2026-08-04/f13a70c`, `backup/2026-08-04/d04e7f1`.
- `origin/main`, merges, Preview, and Production unchanged; those still
  require separate explicit producer authorization.

## Prior Work Package — Portfolio Studio A0

- Package: repo-backed Archive media manifest + dry-run planner, carried
  end-to-end by the approved Three-Minute Micro Drama reel and poster.
- Branch: `codex/portfolio-studio-a0`; baseline and rollback checkpoint:
  `382e02a21fbcf6ffef68881b7e497235eaf8a7a8`.
- Validated implementation head and pushed remote readback:
  `9fb0f2c929ad497100baba11cade6fd618d3ac08`.
- Coherent commits: `d82c0ba` manifest foundation, `c0b33d5` dry-run planner,
  and `9fb0f2c` Three-Minute steel-thread integration. The documentation-only
  closeout commit is reported externally after commit.
- The exact 10-second silent H.264 1280×720 reel and 1280×720 WebP poster are
  protected by size, SHA-256, profile, owner, and content-link checks. Source
  masters and absolute source paths remain outside Git.
- `npm test` 71/71, design audit, build, Figma export, diff check, full decode,
  manifest verification, and desktop/mobile browser QA passed.
- Frozen review packet SHA-256:
  `2e1780988bc43b0972ff1fc82e57fc2012cfdb50af2a4a78187b0f0fc6bec88b`.
  Gemini completed `PASS` with no findings on `gemini-3.6-flash`; Claude is
  honestly `incomplete` at subscription-session handoff, so no dual-review
  consensus is claimed.
- `origin/main`, Vercel Preview, aliases, Contact, and Production are untouched.
  The protected untracked review file remains unmodified and outside Git.

## A0 Open Item

Submit the same frozen packet to the active Claude subscription lane when it is
available. Under the Work Charter, the usable Gemini lane plus local gates may
close this producer-gated feature package, but the missing lane must be recorded
and later supplemented without regenerating the packet.

## Prior Accepted Work Package — Top Gear

- Package: `Top Gear Featured Preview Reel v1` — implemented and reviewed
  locally with deterministic, media, bilingual browser, fallback, privacy, and
  repository-hygiene evidence complete.
- Branch: `codex/top-gear-featured-preview-reel`.
- Base and rollback checkpoint:
  `0e79852f7552af42b25d0e1adc9f746f98828fb6` (also current local `main`).
- Validated implementation head:
  `c4c284707edd1f6560081ef9df3b56b0ba5f9bc5`.
- Closeout record:
  `docs/reviews/top-gear-featured-preview-reel-v1-2026-08-03.md`.
- Design, plan, contract, draft, refined-cut, and exact-evidence commits are
  `cfea3cdd1ceec22dcb892077282ad3c3082d0e24`,
  `9d1da19a042d2ff8031735da8f6296e5c583add5`,
  `17f40857bbfb6c02c790d1b0a2fc2377f56d5b89`,
  `8c3b66aa5806a34866cd616aa915b238a70c0a9a`,
  `36305c8d86c4d3541358798491a2c0a1eaeaa903`, and
  `c4c284707edd1f6560081ef9df3b56b0ba5f9bc5` respectively.
- Initial documentation-only closeout commit:
  `e5a34db485a36952a5f83334e75092a14bee22d0`.
- The subsequent browser-evidence clarification commit is reported externally
  after commit and intentionally is not self-referenced in committed files.
- Approved direction: approximately 30 seconds, `B · Cross-border story` plus
  `A · Action-led`, with an aircraft shot explicitly included.
- Design specification:
  `docs/superpowers/specs/2026-08-03-top-gear-featured-preview-reel-design.md`.
- Implementation plan:
  `docs/superpowers/plans/2026-08-03-top-gear-featured-preview-reel.md`.
- The exact public derivative is 8,651,457 bytes, 29.960000 seconds, one
  silent H.264 1280×720 yuv420p BT.709 stream, SHA-256
  `4d57e75a81e2ebf0e398a08b57c8e99ddcb0973bc1562db8036221b9a014db72`;
  faststart and full decode passed.
- The user-supplied source remains outside the repository. Its approved
  basename, `3195.042540`-second duration, 1920×1080 dimensions, and SHA-256
  are recorded without its absolute path.
- The local preview served exactly ignored `dist/` on port `4873` during QA.
  It was stopped after evidence capture; no listener remains and
  `http://127.0.0.1:4873/en/` and `/zh/` are inactive. This was not a
  deployment.
- No Vercel Preview or Production deployment, push, main merge, Contact
  submission, external message, or source-file move/deletion occurred.

## Prior Top Gear Verification

- `npm test`: `61/61` passed; Featured lifecycle: `6/6` passed.
- Design audit passed with `6` Featured, `5` Archive, `2` global Press, and
  `3` Work Press entries. Build, Figma export, exact generated markup, Figma
  diff, media manifest, faststart, stream probe, and full decode passed.
- All four current Figma hashes remained exact and unchanged; the closeout
  record contains the fingerprints.
- Session-only connected-browser QA covered `10/10` English/Chinese cases at
  1440×900, 1200×900, 834×1112, 390×844, and 360×800. It observed poster-first,
  one-second hold, actual playing, last-eligible ownership, exact
  wrapper/source, no overflow, no extra title overlay, and approved responsive
  geometry in-session; its per-case tool output was not durably retained.
- The session-only adapted six-reel harness returned `PASS`. Its ten-row matrix
  recorded structural, geometry, destination, network/error, and Contact
  predicates in its session-only `/private/tmp` packet, not per-case temporal
  lifecycle evidence.
- A dedicated English 1440×900 interaction run measured the poster at
  `1018.4` ms and actual playing at `1434.6` ms, plus exit/reset/re-entry,
  natural last-eligible arbitration, media error, BFCache, and controlled
  visibility. Separate reduced-motion and no-JavaScript checks ran at 1200×900;
  keyboard ownership ran at 1440×900. Their local page/console/request/HTTP
  error ledgers were empty.
- The aircraft exterior and cockpit exchange were visibly captured in-session
  at reel times `22.44` and `24.61` seconds.
- Browser evidence recorded zero `/api/contact` POSTs and zero submit events.
  The protected untracked file retained SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.

## Prior Top Gear Open Risks

- The Top Gear-specific adapted harness, JSON results, and screenshots existed
  only under `/private/tmp/top-gear-browser-qa.9Ab009`; they are not durably
  retained in Git or another recorded backup. A future audit must adapt and
  rerun the durable preceding harness under
  `docs/reviews/evidence/featured-preview-reels-browser-qa-r2/`.
- Matched pre-package browser comparison remains unavailable because the
  recorded historical Vercel Preview redirects unauthenticated QA through
  Vercel SSO. No matched portfolio DOM, screenshot, geometry/crop comparison,
  or pixel statistic is claimed. This is inherited external-state evidence,
  not a local product defect; unchanged Figma hashes support but do not replace
  the unavailable comparison.

This historical section is superseded by the current A0 baseline and retained
only as prior verification evidence.

## Prior Accepted Work Package

- Package: `Featured Preview Reels and Implicit Press v1` — locally complete
  with one external comparison open item.
- Branch: `codex/featured-preview-reels-implicit-press`
- Base and rollback checkpoint:
  `be5ff4fe3d828a85c955764dedf9e0ce1200e0f6`
- Validated implementation head:
  `f264f471e7c69acc2a2573e4d18fc2145c3ef5bd`
- Closeout record:
  `docs/reviews/featured-preview-reels-and-implicit-press-v1-2026-08-03.md`
- Initial closeout commit, which first added the dated report:
  `8a52d8506ee155b0450508430583416e08cb008b`; its parent is the validated
  implementation head `f264f471e7c69acc2a2573e4d18fc2145c3ef5bd`.
- The subsequent evidence-hardening commit adds the tracked sanitized QA
  package and corrected closeout wording. Its exact SHA is reported externally
  after commit and is not self-referenced in committed files.
- Durable QA evidence:
  `docs/reviews/evidence/featured-preview-reels-browser-qa-r2/README.md` and
  `results-summary.json`; reproduction harness/commands and a manifest are in
  the same directory.
- Exact encoding recipe and source/output ledger:
  `showreel/featured-preview-reels/README.md`.
- This branch has no configured upstream and no local remote-tracking ref. No
  push or remote metadata readback was performed for this package.
- Every delegated role requested `gpt-5.6-sol`. Task 1 spec review and the
  media/lifecycle implementation explicitly exposed requested/observed/
  completed `gpt-5.6-sol`; other delegated runtimes did not expose independent
  IDs, so none are inferred. No Claude or Gemini collaboration request was
  made in this package.

Three complete silent optimized reels now cover Slow Steps, Tech Dreamers, and
My Art, My Voice. All five Featured reels use canonical `after-hold` behavior:
35% eligibility, last eligible DOM reel, 1.4-second poster hold until `playing`,
and safe reset/generation/visibility/error/BFCache handling. Existing posters
and destinations remain canonical; Slow Steps remains unlinked. Work Press no
longer renders the redundant visible group heading, while its localized
semantic group and visible per-card types remain. Global Press is unchanged.
Current design/Figma rules are aligned and Figma output is unchanged.

## Prior Package Verification

- `npm test`: `61/61` passed; Featured runtime lifecycle `6/6` passed.
- Focused contract, media, renderer, audit, and Figma checks passed.
- `npm run audit:design-contract`, `npm run build`,
  `npm run figma:export`, `git diff --check`, and privacy checks passed.
- The three complete public timelines passed exact byte/hash/duration,
  H.264 1280×720 yuv420p BT.709, video-only, faststart, and full-decode checks.
- All four current Figma fingerprints remained exact and unchanged.
- Local browser QA passed `10/10` English/Chinese viewport cases with no
  overflow or local errors. Real hold/playing/reset/re-entry and natural
  two-reel arbitration passed; synthetic media-error/BFCache, controlled
  visibility, reduced motion, no JavaScript, keyboard, semantic, and
  contact-without-submit checks also passed.
- The browser request ledger contains zero `/api/contact` POSTs. No deployment
  command ran, and the identified local port was stopped. The tracked worktree
  returned to protected-file-only status: no tracked or staged changes
  remained; ignored `dist/` may exist.
- r2 evidence manifest: `98/98`, SHA-256
  `418ece08fd3b13ec2a2f8f8d5e20794f82fc1fdcf9333f9a070d108394d6d1d6`.
- No baseline pixel-diff claim is made.

## Accepted Open Items

- P0 Hero LCP/originalization is locally implemented, validated, and available
  in a Ready Preview. Producer inspection and an accessible online/PageSpeed
  measurement remain open; local evidence cannot establish production or CrUX
  behavior.
- One restrained lighting treatment and/or one button microinteraction remains
  deferred until after the Hero performance package. It is optional refinement,
  not missing behavior in the closed public baseline.
- Any visual experiment begins lo-fi-first and separately defines desktop,
  mobile performance, focus visibility, contrast, and reduced-motion behavior.
  It remains off the website until the producer approves implementation and a
  later Preview/Production decision.
- The offline Chinese manager directory contains a Numbers file and a recovered
  XLSX rather than the originally recorded XLSX path. Before any future
  Chinese-copy import, the producer selects one authority and exports a fresh
  explicit XLSX; this does not block the current public baseline.

## Protected Worktree Item

The following user-owned file remains outside Git, byte-identical, and must
never be staged or committed:

`docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md`

SHA-256:
`945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`

## Exact Next Action

Producer opens the Ready Preview
`https://hsin-hsin-yuan-portfolio-5v98ywoxl.vercel.app` while logged in to
Vercel and inspects Hero desktop/mobile behavior. If direct Preview protection
blocks the intended review device, replacing the account's shareable link
requires separate explicit authorization. Production, alias, merge, and
`main` actions remain separately gated.

## Cold Resume

1. Read `AGENTS.md`, `PROJECT_BIBLE.md`, this file, and
   `docs/reviews/portfolio-phase-closeout-2026-08-10.md`.
2. Verify annotated tag `portfolio-phase-2026-08-10-closed` and remote backup
   `backup/2026-08-10/portfolio-phase-closeout` resolve to the same docs-only
   closeout commit; verify `origin/main` remains at public baseline
   `eb444a6dade9a721d97adf239468bf22d3360bf8` unless a later producer-approved
   Production package records otherwise.
3. Verify the protected file above remains untracked and matches its exact
   SHA-256 before changing anything.
4. Treat the canonical public alias as Production and leave it unchanged. The
   closeout recorded `dpl_4i1jTqt3Qq9FjchMnMXEGKrEYwkv`; Preview-time metadata
   later resolved the alias to `dpl_14E9G3amzXj2iL6xKvQZQWadypXq`. Both are
   Ready/Production, but source/content equivalence remains unproven.
5. Treat Hero Preview `dpl_7syJAsyC85BncuAh9JD2WLw48jx2` as Ready and awaiting
   producer inspection. Treat every `origin` branch push as a potential Vercel
   Preview; do not push even a backup ref while Preview is unauthorized. Do not
   replace the shareable link, push `main`, create/delete another Preview,
   deploy Production, change an alias, or submit Contact without the
   corresponding explicit producer authorization.
   `main` pushes are now known to trigger Production automatically.
