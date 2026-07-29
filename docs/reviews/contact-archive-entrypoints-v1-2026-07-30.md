# Contact & Archive Entry Points v1 Review

Date: 2026-07-30

Outcome: `PASS`

## Scope

This review covers the bounded contact and early-work presentation package on
top of the closed portfolio baseline and the later screening-strip packages.

It removes the standalone `Who Should Contact Me` and `AI / Language Lab`
sections, strengthens the Contact path, aligns the homepage showreel ending,
and gives three verified early works visual, source-linked archive entries.

It does not download or rehost third-party video, create a custom archive reel,
add unverified credits, deploy a new Preview, replace production, rewrite Git
history, or delete old Vercel deployments.

## Reviewed Version

- Branch: `codex/contact-archive-entrypoints`
- Closed baseline: `portfolio-phase-2026-07-29-closed`
- Immediate parent:
  `6d2b44af7d9ef47264bde16de91b46a36157ddbd`
- Reviewed implementation commit:
  `dfec4330b02536f47ba97829e243ab393ea46725`

## Contact Decision

- Contact remains visible in desktop and mobile navigation as a compact pill
  with an acid-green signal dot.
- The closing invitation is split into a primary line and acid-green accent:
  `Let’s build a story` / `together.`
- The Chinese mobile brand is shortened to `袁欣欣` so Contact and language
  controls do not collide at 390px.
- The contact copy asks for story, timing, and the role needed instead of
  classifying the viewer into service categories.
- The Figma importer and design-layer documentation carry the same current
  structure.

## Homepage Visual Reel

- The 30-second source and rendered MP4 now close with:
  `LET’S BUILD A / STORY / TOGETHER.`
- The four audience/service boxes were removed.
- The end frame says `Open Contact` and tells viewers to provide the story,
  timing, and role needed.
- The source and output contain no direct email address.
- Final output: 1920x1080, 30fps, 30 seconds, 17,467,431 bytes.
- SHA-256:
  `379bba6b2d1dae15272d4822c3ed24e37a49ba2a96493a84a26de77848ecdb15`

HyperFrames verification:

- lint: 0 errors; one accepted dense-track warning inherited from the
  six-scene single-file composition;
- validate: 0 errors; five accepted contrast warnings for decorative ghost
  words that are not informational text;
- inspect: 0 layout issues across 9 timeline samples;
- the final Contact frame was extracted from the replacement MP4 and visually
  checked after rendering.

## Archive Decision

`FROM THE ARCHIVE` uses:

- `Overclocking` as the large lead card, with an approved local production
  still and the public program on the long-running collaborator's channel;
- `Heart of Steel` as a supporting card linked to the official DDS trailer;
- `Lying Game` as a supporting card linked to the official CTi TV promo;
- the remaining early works as a text ledger, without duplicate cards or an
  undifferentiated `and others` bucket.

The local CV identifies Hsin-Hsin Yuan as a screenwriter on the 13-episode
series `Heart of Steel` and `Lying Game`. Public credit listings and the
production-company catalogue were used as secondary cross-checks. The role on
older works from the collaborator's channel remains title-specific and is not
inflated into a directing credit.

The source and rights inventory is:
`docs/source-materials/early-works-public-video-inventory.md`.

## Deterministic Evidence

- New contact/archive tests failed first against the previous public model and
  markup, then passed after implementation.
- A mobile Chinese navigation regression test failed against the full
  bilingual brand, then passed after the mobile-specific brand was introduced.
- The showreel contract test failed against the old `with signal` ending and
  four service boxes, then passed after the focused Contact ending.
- `npm test`: 21 tests passed, 0 failed.
- `npm run build`: passed.
- `git diff --check`: passed.
- Direct-address and private-path scans passed.

## Browser Evidence

Fresh local checks covered:

- English desktop: `1440x900`
- English mobile: `390x844`
- Chinese mobile: `390x844`

Observed:

- three archive media cards render and load;
- the large/small card composition becomes a clean single column on mobile;
- the remaining two archive works stay in the text ledger;
- Contact is visible and reachable from the fixed navigation;
- the English and Chinese contact invitations remain within the viewport;
- no tested viewport has body-level horizontal overflow;
- no browser console or page errors occurred.

Existing local featured-work MP4 requests may be aborted when navigation or
test teardown resets the page. They produced no console or page error and are
not a blocker for this package.

## Rights, Privacy, And Deployment

Archive video opens at its original public source. The site uses a local owned
still for `Overclocking` and source-hosted YouTube thumbnails for the two drama
links. No third-party program, trailer, episode, picture track, or music was
downloaded, cut, or rehosted.

Current privacy scans remain green. The historical direct-address exposure in
older Git history and older Preview deployments remains a separately
authorized cleanup.

No deployment was created or promoted. Existing production and Preview URLs
remain unchanged.

## Remaining Open Items

- A custom `FROM THE ARCHIVE` reel still requires approved local source or
  explicit reuse permission covering picture and music.
- The Three-Minute Micro Drama reel remains a separate future media package.
- `鬼手神車` still needs user-approved media.
- Playlist curation and the `AI-Language Creative` SEO decision remain open.
- A new Preview requires an explicit deployment decision.

## Exact Next Action

Review the branch visually and decide whether to create a new Vercel Preview.
Keep the Three-Minute Micro Drama reel as the next separate package.
