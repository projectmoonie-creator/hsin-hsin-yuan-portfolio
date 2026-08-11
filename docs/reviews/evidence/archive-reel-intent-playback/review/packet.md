# Read-only review packet: Archive reel intent playback

## Objective and authorization

Review the completed bounded package on branch `codex/archive-reel-intent-playback`, based on accepted Featured handoff commit `02fee43edb5cdc200483a277b28353301d3de4ff`. The package applies the already producer-approved Featured Reel intent interaction to the three Archive cards that already have canonical reel media, while preserving Archive's separate passive loading lifecycle.

This is read-only review. Do not edit files, deploy, create or change Preview access, submit Contact, merge, push, or operate on `main`.

## Intended behavior

- Desktop: pointer entry on an Archive card, or focus on an existing linked card, previews immediately; leaving releases it.
- Mobile at 820px and below: a stationary touch on `.archive-card-media` starts the selected preview immediately.
- Linked Archive cards consume the first tap for preview and let the second tap follow their existing canonical YouTube destination.
- The unlinked Mechanic card previews and retries but never gains an artificial link or focus stop.
- Movement beyond 12px and pointer cancellation remain scrolling/cancellation: no play and no accidental navigation.
- Passive behavior remains 35% visibility plus 1400ms. Explicit intent may prime only its selected reel; Archive gains no proactive warm path.
- One Archive reel owns playback. Stale play/rejection events cannot reveal or reset a newer owner.
- Initial HTML stays `preload="none"`; resets restore poster and no-preload state.
- Reduced-motion and no-JavaScript remain static poster experiences.

## Architecture and change set

- `src/main.js`: adds shared `bindReelIntentSurface()` gesture binding; refactors Featured to use it without changing Featured-only warm, Screening Strip, observer, or timing logic; adds Archive explicit-owner, generation, failure, lifecycle, and selected-reel priming logic.
- `tests/featured-reel-runtime.test.mjs`: extends the existing VM harness and adds Archive intent/runtime cases.
- `tests/build-site.test.mjs`: protects 1400ms passive scheduling, shared binder presence, destination derivation, reset-to-none, and absence of an Archive warm path.
- Test-only RED commit: `0b6a153`.
- GREEN implementation commit: `e328ea8`.

Intent and limits are frozen in:

- `docs/superpowers/specs/2026-08-11-archive-reel-intent-playback-design.md`
- `docs/superpowers/plans/2026-08-11-archive-reel-intent-playback.md`

## Non-goals and unchanged sources

No canonical data, generator, CSS, Figma, reel media, card order, crop, copy, destination, Hero, Featured warming policy, light effect, Contact behavior, Production, alias, `main`, or Git push change is authorized or included.

## Validation evidence

- RED: six new Archive intent tests failed while passive Archive and all existing Featured tests passed; a later pointer-cancellation assertion also failed before its bounded fix.
- Focused GREEN: `node --test tests/featured-reel-runtime.test.mjs tests/build-site.test.mjs` passed 71/71.
- Full `npm test`: 170/170 passed.
- `npm run build`, `npm run featured-reels:check` (six derivatives), `npm run audit:design-contract`, `npm run figma:export`, and `git diff --check`: passed. Figma export introduced no tracked drift.
- Local browser matrix: 13/13 passed. It covered English 390px linked first/second tap; Chinese 360px linked first/second tap; unlinked Mechanic touch; movement and pointer cancellation; desktop hover and existing-link focus; measured passive start at 1404ms; reduced motion; no-JS; and static English/Chinese desktop, tablet, and mobile cases.
- All 13 browser cases had zero Contact POST, console error, page error, and horizontal overflow.
- Reduced-motion matched baseline/current Archive geometry and screenshot bytes exactly at 1440x900 and 390x844. Screenshot SHA-256 values were `4b8f8895f1063326f30dc844f6bb033e6eac9d1f3389a35cfa6822aaa0b8a8c2` and `61de5352cccdd4ba6b0df738047bf523e7496071b5e85bb968ebc1ce793d48de`.
- The protected untracked document remained the sole untracked file and retained SHA-256 `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc` before evidence files were intentionally added. It must remain untracked and unstaged.

The browser evidence establishes local Chromium behavior, not every real mobile browser. Producer inspection on the static Preview remains the real-device check.

## Requested review dimensions

1. Audit the shared gesture binder for first-tap suppression, second-tap navigation, >12px movement, pointer cancellation, focus/hover release, timer ordering, and linked failure release.
2. Confirm the Featured refactor preserves its warm/Screening/passive behavior and does not couple those mechanisms into Archive.
3. Audit Archive owner arbitration, activation/play generations, stale events, visibility/page lifecycle, preload restoration, failure retry, and one-reel-only behavior.
4. Confirm that destination awareness derives from existing markup, Archive has no new canonical media truth or proactive warm path, and reduced-motion/no-JS remain static.
5. Check that the tests meaningfully cover the behavior and flag any false-positive harness assumption that could diverge from browser event ordering.
6. Check authorization boundaries and identify any unrelated change, Contact behavior, deployment action, private-path leak, or protected-file inclusion.

## Required output

Return Markdown with:

- `Verdict`: `PASS`, `PASS_WITH_FINDINGS`, or `BLOCK`.
- `Findings`: ordered by severity. Every blocker or major finding must cite a current file and line, explain a reproducible failure, and propose bounded remediation. Write `None` if none.
- `Evidence assessment`: what the results prove and do not prove.
- `Authorization audit`: whether the package stayed inside the stated boundary.
- `Review provenance`: requested, observed, and completed model IDs if available.

Do not modify the repository.
