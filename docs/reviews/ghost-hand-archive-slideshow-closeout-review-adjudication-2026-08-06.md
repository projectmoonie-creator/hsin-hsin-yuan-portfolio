# Ghost Hand Archive Slideshow — Closeout Review Adjudication

Date: 2026-08-06

Reviewed local-main checkpoint:
`4dab6d77c87ddddd5564bf709016ada99c6e0b57`

Public-behavior head:
`9d84132e650027ad1dbfeb4211ead9a99f776e3c`

Frozen packet SHA-256:
`c075e4f486b66d272ac00b88ceba253faf6193a404dcfd0d536ca4d98ef4293f`

## Outcome

`PASS_WITH_OPEN_ITEMS`. Gemini returned `PASS` with no findings. Local source,
test, media, browser, privacy, and repository-state adjudication reproduces
that result. No remediation is required before treating the local baseline as
trustworthy and ready for a later, separately authorized Vercel Preview.

The Claude subscription lane remains `incomplete` at
`handoff-to-active-session`; no Claude model request was sent. The usable
Gemini lane plus completed local gates close this producer-gated package under
the Work Charter. This record does not claim dual-review consensus. The exact
frozen packet remains available for later Claude submission without
regeneration.

## Review Lane Ledger

| Lane | Requested | Observed | Completed | Result |
| --- | --- | --- | --- | --- |
| Gemini | highest eligible generally released model | `gemini-3.6-flash` | `gemini-3.6-flash` | usable `PASS`; no findings; 3,115 input / 48 output / 4,126 total tokens |
| Claude | highest generally released model at active-session submission | not observed | incomplete | `handoff-to-active-session`; no model request sent and no billing fallback used |
| Codex maintainer | current root runtime | exact ID not exposed | exact ID not exposed | local source, test, media, browser, privacy, Git-state, and provider-output adjudication completed; no model ID fabricated |

Artifacts:

- frozen packet:
  `docs/reviews/ghost-hand-archive-slideshow-closeout-review-packet-2026-08-06.md`;
- raw Gemini response:
  `docs/reviews/ghost-hand-archive-slideshow-closeout-gemini-review-2026-08-06.md`;
- authoritative Gemini routing provenance:
  `docs/reviews/ghost-hand-archive-slideshow-closeout-gemini-review-2026-08-06.md.status.json`;
- Claude handoff state:
  `docs/reviews/ghost-hand-archive-slideshow-closeout-claude-review-2026-08-06.json.status.json`.

## Maintainer Adjudication

### Gemini verdict and finding set — `agree`

The `PASS` verdict and empty finding set reproduce locally. The review did not
identify a counterexample, missing P0/P1 regression case, privacy mismatch, or
public-package inconsistency.

### Raw response model field — `supersede with machine provenance`

The raw response reports `MODEL: unknown`. The wrapper status records the
requested, observed, and completed model as `gemini-3.6-flash`; that
machine-generated status is authoritative. The raw response remains unchanged
for auditability.

### Recipe, renderer, and guarded writer — `upheld`

The generic recipe validator, deterministic timeline, HTML generator, guarded
CLI, metadata-fail-closed WebP parser, and exception-safe four-target rollback
writer meet the bounded claims in the frozen packet. Tests cover invalid
recipes, a second non-Ghost-Hand recipe, redacted dry-run behavior, malformed
metadata, and injected rename rollback. No Ghost Hand special case is present
in the generic modules.

### Public media, rights, and privacy — `upheld`

The producer approved the selected stills for public portfolio use. Raw JPEGs
and private absolute paths remain outside Git. The tracked 1280×720 WebP
derivatives, poster, and silent ten-second MP4 match their manifest hashes,
dimensions, profiles, faststart, and full-decode checks. The protected
user-owned untracked review file remains unmodified and outside Git.

### Website behavior and fallback — `upheld`

Exact-current-build browser QA covers English desktop, Chinese mobile, mobile
scroll handoff, reduced motion, and no JavaScript. Ghost Hand plays only after
the existing poster hold, the closest eligible Archive reel owns playback,
non-active reels reset, and static fallbacks remain usable. The initial fixed
wait false negative was traced to smooth-scroll timing; a geometry-based wait
reproduced the intended behavior without a product change.

## External State And Open Items

- `origin/main` remains
  `03ad08ac4dd3a47d300cab99f2dd569353e13ec9`.
- The reviewed checkpoint is reachable from
  `origin/backup/2026-08-06/pre-shutdown-final`; no reviewed commit was
  unbacked when the packet was frozen.
- No new Vercel Preview, Production deployment, alias change, or Contact
  submission occurred.
- `localhost` is not a shareable review URL. A new Vercel Preview is the next
  bounded action if the producer explicitly authorizes it.
- Chinese copy refinement and named bilingual layout variants remain a
  separate package. Lighting remains later, after bilingual geometry is
  approved.
