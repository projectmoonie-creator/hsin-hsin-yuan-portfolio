# Featured preview reels browser QA r2 — durable sanitized evidence

Date: 2026-08-03
Status: `PASS_WITH_OPEN_ITEMS`

This text-only package is the durable evidence authority for the Featured
preview reels and implicit Work Press browser QA. It is self-contained and
contains no cookies, credentials, raw SSO query strings, form values, external
source paths, or user-specific filesystem paths.

## Identity and environment

- Branch: `codex/featured-preview-reels-implicit-press`
- Validated implementation head:
  `f264f471e7c69acc2a2573e4d18fc2145c3ef5bd`
- Base/rollback checkpoint:
  `be5ff4fe3d828a85c955764dedf9e0ce1200e0f6`
- Python `3.9.6`; Playwright `1.60.0`; Chromium `148.0.7778.96`.

The original disposable r2 packet manifest verified `98/98` entries and had
SHA-256
`418ece08fd3b13ec2a2f8f8d5e20794f82fc1fdcf9333f9a070d108394d6d1d6`.
Representative raster captures remained session-only and are not committed.
The historical matched baseline was unavailable, so no matched screenshot,
geometry/crop, pixel-statistic, or pixel-equality claim is made.

## Deterministic and media result

- `npm test`: `61/61`; Featured lifecycle: `6/6`.
- Design-contract audit, build, Figma export, diff check, and privacy gates
  passed.
- All three public derivatives matched their exact size, duration, SHA-256,
  single silent H.264 1280×720 yuv420p BT.709 stream, faststart ordering, and
  full decode exit `0`. They preserve complete timelines.
- The four Figma current-reference fingerprints remained exact and output was
  unchanged.
- The authoritative encoding recipe and source/output ledger is
  [showreel/featured-preview-reels/README.md](../../../../showreel/featured-preview-reels/README.md).

Exact machine-readable evidence is in [results-summary.json](./results-summary.json).

## Browser matrix and interaction result

All `10/10` English/Chinese cases passed at:

- 1440×900
- 1200×900
- 834×1112
- 390×844
- 360×800

Every case passed HTTP 200 and bounded network-idle, horizontal-overflow,
exact five-poster identity plus preload/control/tab/pointer/media, localized
semantic Work Press, absent `.press-preview-title`, absent direct group-label
text nodes, exact localized per-card type multiset, visible global Press, exact
Slow/Tech/Art destination, five contact-field, and empty local error
predicates. English types were `Official page`, `Official page`, and
`Project press`; Chinese types were `官方節目頁`, `官方節目頁`, and `專案報導`.

The original r2 request ledger records 118 matrix requests, 308 total
local-context requests (including the local sides of the comparison attempts),
and 1,155 historical baseline requests. It records zero `/api/contact` POSTs
and zero submit events. The local console/page/request/HTTP error arrays were
empty. The SSO/login page produced 47 console warning/error events and 13 HTTP
errors; those are retained as authentication-gate evidence and are not
portfolio errors.

Real timing proved the 1.4-second poster hold, reveal only after `playing`,
continuing playback, exit reset, and re-entry. Natural sticky geometry proved
two eligible reels with only the later DOM reel playing. Synthetic media-error
and persisted BFCache cases, plus controlled reversible visibility, reset and
replayed successfully.

Reduced motion kept five visible posters and five hidden paused videos. The
no-JavaScript keyboard path moved from `#available` to `#works` without a
second document request and retained five paused posters. Keyboard QA reached
the visible Tech wrapper with the exact 2 px focus outline, then reached the
contact fields; videos remained unfocusable, control-free, and
pointer-transparent.

## Tracked-harness conformance run

The final tracked harness was run end-to-end with a managed server on port
4173 and output in an external temporary directory. It returned
`PASS_WITH_OPEN_ITEMS`, passed all `10/10` local matrix cases, and the helper
stopped the server. The temporary output was summarized into this package and
removed; no repository output directory or ignore workaround was used.

The conformance run recorded:

- all five exact poster identities in every matrix case;
- the exact English and Chinese Work Press type multisets and zero
  `.press-preview-title`/direct group-label text nodes;
- poster state at `1015.6000000238419` ms from measured eligibility, with the
  video paused at time `0` and opacity `0`;
- the actual `playing` event at `1432.9000000357628` ms from eligibility,
  followed by current time `0.615163`, delta `0.60741`, and opacity `1`;
- natural arbitration at scroll Y `1880`, with indexes `0` and `1` eligible
  and only later index `1` playing;
- no-JavaScript fragment `#works`, an intersecting Works rect, exact posters,
  and one document request before and after Enter;
- reduced-motion and keyboard checks passed, including the exact Tech wrapper
  focus outline and contact reachability;
- ten baseline attempts, ten auth-gated cases, zero portfolio-DOM cases, 1,139
  baseline requests, and zero contact POSTs.

Every baseline case persisted the same sanitized evidence chain: final
navigation `200` at hostname `vercel.com`, pathname `/login`, classified
`vercel_login`; response `307` at `/sso-api`, classified
`vercel_sso_endpoint`; and response `200` at `/login`. Query strings,
fragments, tokens, cookies, and headers are absent. The classifier now treats
simultaneous auth-gate evidence and portfolio DOM as a distinct hard failure.

## Server and repository state

- Port 4873 had no listener before the helper, the helper stopped its server,
  and no listener remained afterward.
- The tracked worktree returned to protected-file-only status: there were no
  tracked or staged changes; ignored `dist/` may exist.
- The protected file remained untouched:
  `docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md`.
- No deployment command or contact submission ran.

## Sole open item

> Matched pre-package browser comparison remains unavailable because the recorded historical Vercel Preview redirects unauthenticated QA contexts through Vercel SSO to the login page; no portfolio DOM, matched Featured screenshots, geometry/crop comparison, or pixel statistics could be obtained.

This is not evidence of a local product defect. Unchanged Figma hashes support
the local result but do not replace the unavailable baseline comparison.

## Reproduction assets

- [qa_harness.py](./qa_harness.py) reruns the 10-case local matrix,
  interaction, reduced-motion, no-JavaScript, keyboard, and fail-closed
  baseline classification. It parameterizes repository, local origin,
  historical baseline, and output directory. If Playwright is unavailable it
  exits honestly with an installation message.
- [baseline_classifier.py](./baseline_classifier.py) owns four fail-closed
  baseline branches; [baseline_classifier_self_test.py](./baseline_classifier_self_test.py)
  covers six focused rows, including contradictory auth-plus-DOM evidence.
- [reproduce.md](./reproduce.md) records repo-root commands.
- [evidence-manifest.sha256](./evidence-manifest.sha256) fingerprints every
  other tracked file in this directory.
