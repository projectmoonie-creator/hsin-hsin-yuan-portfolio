# Portfolio Production Release — 2026-08-11

Outcome: `PASS_WITH_OPEN_ITEMS`

## Declared Scope

- Release the producer-accepted Hero LCP, Featured mobile reel delivery and
  intent behavior, Screening Strip navigation repair, Archive reel intent, and
  Featured desktop 16:9 packages to the canonical Production URL.
- Preserve all approved copy, media rights boundaries, Contact behavior,
  reduced-motion/no-JavaScript fallbacks, Figma canonical-data consumption,
  and the historical closed tag.
- This authorization covered Production and the formal alias. It did not cover
  a Git push, `main` integration, Contact submission, tag rewrite, or the next
  light-effect implementation package.

## Reviewed Baseline And Producer Decision

- Branch: `codex/featured-reel-16x9`
- Release source/checkpoint: `df77f1cec8b8def0001eaed789dcad20b4d9fb17`
- Runtime implementation: `09c1d78`
- `origin/main`: `eb444a6dade9a721d97adf239468bf22d3360bf8`
- Historical closed tag: `portfolio-phase-2026-08-10-closed` →
  `82893899dad3e4f393720e2efd71b1e1cb02a350`
- The producer inspected the direct Shareable Link on the target device,
  reported the modifications `OK`, and explicitly authorized Production and
  the formal URL on 2026-08-11.

## Deterministic And Visual Evidence

- `npm test`: 174/174 pass.
- `npm run build`, `npm run audit:design-contract`,
  `npm run featured-reels:check`, `npm run figma:export`, and
  `git diff --check`: pass; Figma has no tracked drift.
- Previously frozen browser evidence remains current: bilingual
  desktop/tablet/mobile/reduced-motion/no-JavaScript geometry 8/8 and Featured
  interaction regression 9/9, with all six large media surfaces 16:9, no
  overflow, no page/console error, and zero Contact POST.
- Independent Codex review requested/observed/completed `gpt-5.6-sol` at
  `xhigh`: PASS with no BLOCKER/MAJOR/MINOR. Gemini requested
  `gemini-3.6-flash` but returned empty candidates; Claude requested dynamic
  `opus` but the subscription helper exited 90. The producer acceptance above
  is the explicit release ruling; no two-reviewer completion is claimed.

## Privacy, Rights, And Deployment Package

- The root checkout had no `.vercelignore`; a direct full-worktree deployment
  could have transmitted the protected untracked review document. Production
  therefore used an isolated package instead of the working tree.
- Package contents: 60 exact current `dist/` files, unchanged
  `api/contact.js`, and minimal equivalent Vercel config; 62 files / 96,953,254
  bytes. Sorted relative path-list SHA-256:
  `d6d28e0912470d98514abe6a236992b735f4f5c199d87837215b4145c94decb9`.
- Contact source and packaged copy share SHA-256
  `2b756da78d79418df890f2cdf2566f6069c90610a179af122e8a51f1be42eb06`.
- Package privacy scan found no private absolute path, protected filename/hash,
  environment file, credential value, or protected document. No Contact POST
  occurred.
- Protected untracked document remains the only untracked file at SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.

## Production Identity

- Previous Production: `dpl_14E9G3amzXj2iL6xKvQZQWadypXq`.
- New Production: `dpl_DkverSo4XRigmsw9ksJCHKUCbLLw`.
- Direct deployment: `https://hsin-hsin-yuan-portfolio-eo5thkcxt.vercel.app`.
- Canonical alias: `https://hsin-hsin-yuan-portfolio.vercel.app`.
- Vercel read-back by deployment ID and canonical alias both return the new ID,
  target `production`, state `READY`, and `api/contact` on Node.js 24.
- Per deployment policy, no deployed URL was fetched by the release process.

## Post-Publish Performance Observation

- Target: canonical English Production `/en/`, mobile.
- Report created 2026-08-11 23:17:54 +08:00:
  `https://pagespeed.web.dev/analysis/https-hsin-hsin-yuan-portfolio-vercel-app-en/euy5bzixwx?form_factor=mobile`.
- The public API returned quota 429; the official report UI remained loading
  through the final wait window. Therefore there is no completed new score,
  metric, transfer total, CrUX statement, or matching baseline comparison.
- Decision: accept the Ready release and retry the read-only diagnostic later;
  do not infer a regression or open a remediation package from missing Google
  data.

## Open Items And Exact Next Action

- At release checkpoint `df77f1c`,
  `git rev-list --count HEAD --not --remotes=origin` returned 18. This release
  record adds one more commit, so the post-record final count must be 19. Those
  commits are only local and therefore prevent a formal `PASS` phase closeout.
- Nothing else in the released runtime is known to be unreviewed or missing
  from the repository; the deployment itself is Ready and the protected file
  remains intentionally outside Git.
- Exact next action: obtain explicit producer authorization to non-force push a
  uniquely named dated backup ref and, separately if desired, fast-forward and
  push `main`; read back the exact remote tip. Then start the next bounded
  package as a lo-fi light/button microinteraction specification from the
  accepted checkpoint. Do not implement the visual effect before its proposal
  receives producer approval.

## Post-Release Durability And Git-Build Addendum

The producer subsequently approved both pending Git actions. Release record
`790f83418d0e00a174cd88fc2399be7db27b71c0` was read back exactly at
`backup/2026-08-11/790f834` and `main`. As documented in the project deployment
contract, each push triggered Vercel through Git integration.

Both first source builds failed before deployment with
`spawnSync ffprobe ENOENT`: the Vercel Node 24 build image did not contain the
system executable used by the repository's strict media verification. The
failed Preview and Production candidates did not replace the existing Ready
canonical Production alias, so the formal site remained available.

The fail-closed remediation pins `ffmpeg-static@5.3.0` and routes Hero image
and video verification through one project-owned inspector. It preserves exact
size and SHA-256 checks, codecs, dimensions, pixel and color profiles, stream
counts, faststart, metadata rejection, and exact ISO-BMFF video duration. A
second platform fixture excludes FFmpeg's Linux stream-mapping line from true
media-stream counts. Runtime output, copy, visuals, media, Figma, interaction,
and Contact behavior are unchanged.

Final local evidence is 177/177 tests plus successful build, six-reel
integrity, design-contract audit, Figma export without tracked drift, dependency
install audit with zero vulnerabilities, and `git diff --check`. Runtime
checkpoint `7c2d8b62c72a4786914948cadf995226190d2343` is read back exactly from
`backup/2026-08-11/7c2d8b6` and `main`; the historical closed tag remains at
`82893899dad3e4f393720e2efd71b1e1cb02a350`.

Vercel read-back records:

- Backup Preview `dpl_8RBrgmGb4fzs1ZG6YXHoXmEQXXUv`: `READY`.
- Git Production `dpl_Gbgq19daqHoafQKHGW8najWGc863`: `READY`.
- Direct Production:
  `https://hsin-hsin-yuan-portfolio-et8wq5yku.vercel.app`.
- Canonical alias:
  `https://hsin-hsin-yuan-portfolio.vercel.app`, resolving to that exact
  Production ID with `api/contact` on Node 24.

Production logs prove that the Linux checkout installed the pinned dependency,
ran `npm run build`, completed the build, and deployed its output. No deployed
page or Contact endpoint was fetched or submitted. The protected document
remains outside Git and deployment output at
`945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.

This addendum closes the prior durability open item. Final package verdict is
`PASS`; the optional PageSpeed retry remains a read-only observation rather
than a release blocker. Exact next action is a new bounded lo-fi light/button
microinteraction specification before any implementation or deployment.
