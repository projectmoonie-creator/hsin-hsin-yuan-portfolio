# Featured Reel Desktop 16:9 — Independent Review Packet

## Role and output

Act as a read-only independent reviewer. Do not edit files. Return:

1. `VERDICT: PASS` or `VERDICT: FAIL`.
2. Findings ordered by `BLOCKER`, `MAJOR`, `MINOR`, each with current
   file-and-line evidence and a concrete failure mode.
3. Explicit confirmation whether the change is the smallest coherent fix and
   whether the validation evidence is sufficient.

If there are no findings, say so directly. Do not invent requirements outside
this packet.

## Repository and frozen target

- Repository: `/Users/hsin-hsinyuan/Documents/Claude/Projects/Moonie V/hsin-hsin-yuan-portfolio-remove-lights`
- Branch: `codex/featured-reel-16x9`
- Base HEAD: `059cc8cc67472aac3c43b9783b1e9c112149a6a7`
- Review the current unstaged tracked diff plus the new design spec.
- Protected untracked file
  `docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md` is outside
  scope and must not be opened, changed, staged, or referenced in output.

## Objective

The producer observed that Design & Brand Films and Nothing by Bus already
show 16:9 preview reels in Featured large cards, while Slow Steps, Tech
Dreamers, My Art, My Voice, and Top Gear China use a tall fill-card surface.
Make all six approved Featured reel surfaces 16:9 on desktop by reusing the
existing canonical `centered-16x9` presentation variant.

## Preserve

- Featured card order, 1180 × 720 desktop panel geometry, column split, copy,
  typography, spacing, posters, links, video files, and interaction/loading
  behavior.
- Existing mobile 16:9 behavior.
- Archive, Contact, Figma compact-card geometry, Production, aliases, and
  `main`.

## Intended implementation

- Four canonical files change only
  `presentation.desktopMediaVariant: "fill-card"` to `"centered-16x9"`.
- Existing normalization derives `featuredMediaAspect: "16:9"`; the existing
  renderer adds `work-panel-wide-media` and `media-frame-wide`; existing CSS
  vertically centers the 16:9 frame.
- No renderer, CSS, JavaScript, media, or Figma generator code changes.
- Tests and `docs/design-contract.md` update the current-family expectations.

## Primary files

- `content/works/slow-steps.md`
- `content/works/tech-dreamers.md`
- `content/works/my-art-my-voice.md`
- `content/works/top-gear-china-uk-special.md`
- `scripts/lib/portfolio-contract.mjs`
- `scripts/build-site.mjs`
- `src/styles.css`
- `tests/portfolio-contract.test.mjs`
- `tests/build-site.test.mjs`
- `tests/design-contract-audit.test.mjs`
- `docs/design-contract.md`
- `docs/superpowers/specs/2026-08-11-featured-reel-desktop-16x9-design.md`

## Validation already completed

- TDD RED: two focused tests failed on Slow Steps actual `fill-card` versus
  expected `centered-16x9`.
- Focused GREEN: 6/6 relevant tests passed.
- Full `npm test`: 174/174 passed.
- `npm run build`: passed.
- `npm run featured-reels:check`: six derivatives passed.
- `npm run audit:design-contract`: passed with no active drift.
- `npm run figma:export`: passed and introduced no tracked Figma drift.
- `git diff --check`: passed.
- Before desktop geometry at 1440 px: four media frames 533.75 × 690.81
  (0.7726), reference pair 533.75 × 300.23 (1.7778); panels 1180 × 720.
- After desktop geometry in English and Chinese: all six media frames
  533.75 × 300.23 (1.7778); every panel remains 1180 × 720.
- Browser layout matrix: 8/8 English/Chinese desktop/tablet/mobile,
  reduced-motion/no-JavaScript cases passed with zero overflow, Contact POST,
  console error, or page error. Poster and video boxes are coextensive.
- Existing Featured interaction browser regression: 9/9 passed, covering
  first/second mobile tap, scrolling gesture, Screening Strip exact target,
  desktop hover/focus, 709.7 ms passive fallback, reduced motion, Save-Data,
  2G, and no JavaScript.

## Review questions

1. Does canonical presentation data remain the single source of truth, with
   no slug-specific or parallel 16:9 mechanism?
2. Do all approved Featured reels now render through one shared 16:9 desktop
   path while posters and videos remain geometrically identical?
3. Are any tests weakened, overfit to raw HTML, or missing a material
   regression relevant to this bounded geometry change?
4. Does the diff accidentally change copy, interactions, loading, Archive,
   Contact, Figma geometry, or public/private boundaries?
5. Do the design contract and design spec accurately describe the implemented
   current state without falsely retiring a still-allowed `fill-card` variant?
