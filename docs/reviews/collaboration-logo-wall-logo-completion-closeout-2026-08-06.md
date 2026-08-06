# Collaboration Logo Wall — Logo Completion Closeout

Date: 2026-08-06

State: `PASS_WITH_OPEN_ITEMS`

Branch: `codex/collaboration-logo-wall`

Increment base: `7ba8a6215bd49714c3690e66b3a5ba74b44c3b1e`

Validated implementation: `f900e7b31321e7b702d4c659340c6b4c85e5f02e`

## Accepted Result

- Dragon TV now uses the producer-supplied transparent PNG as a preserved,
  SHA-locked source and a deterministic cream monochrome derivative.
- ScreenHouse now uses the exact inline SVG from its official homepage. The
  preserved source remains unchanged; an explicit evidence-only SVG treatment
  removes its two opaque background rectangles before monochrome mapping.
- The website and Figma export remain consumers of the same seven-entry data
  collection: six verified logos and one honest Women Make Waves fallback.
- The transformation is optional, allowlisted, SVG-only, hash-verified, and
  fails when it removes no rectangle. Public render data does not receive the
  source URL, hash, date, rights status, source file, or treatment field.

## Evidence

- TDD observed the new treatment/contract tests fail before implementation and
  pass afterward; focused suites passed 21/21 and 64/64.
- `npm test` passed 93/93. `npm run collabs:prepare` produced six derivatives;
  build, Figma export, and design-contract audit passed.
- English/Chinese Chromium QA passed at 1440×900 and 390×844: expected order,
  4+3 and 2+2+2+1 layouts, centered final rows, complete images, correct links,
  visible focus, no overflow, provenance leak, or runtime/request errors.
- Pixel inspection confirmed transparent ScreenHouse artwork and the complete
  Dragon TV silhouette. Website and generated Figma SVGs use both derivatives.
- Frozen review packet SHA-256:
  `531d94258ebb6c4ec3762cc336aaa07f873802a75323e53091ff475d4deba7e8`.
  Gemini requested/observed/completed `gemini-3.6-flash` and returned `PASS`
  with no findings. Claude remains `handoff-to-active-session`; no model
  request or billing fallback occurred, so no dual consensus is claimed.
- The protected untracked document remained outside Git at SHA-256
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.

## Integration And Open Items

- The producer authorized a local-only fast-forward merge. Local `main` is
  integrated to the closeout head containing implementation `f900e7b`, and the
  full test/build/Figma checks pass after integration.
- No branch/backup push, `origin/main` push, new Preview, Production deployment,
  alias change, or Contact submission occurred. The integrated work is not
  remotely backed up.
- Women Make Waves stays a text fallback until a trustworthy standalone mark
  is supplied. The Claude handoff may be completed later without reopening the
  locally validated result.
