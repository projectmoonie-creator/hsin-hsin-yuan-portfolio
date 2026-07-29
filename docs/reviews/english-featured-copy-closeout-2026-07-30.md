# English Featured Work Copy Closeout

Date: 2026-07-30

Verdict: `PASS_WITH_OPEN_ITEMS`

## Reviewed Baseline

- Branch: `codex/contact-archive-entrypoints`
- Immediate parent:
  `9e395cfd68d88fa3beec437dc88a153949974354`
- Reviewed implementation commit:
  `d45787888ef0e68cdbfb68b071edee9bd6aed522`
- Closed baseline tag: `portfolio-phase-2026-07-29-closed`

## Scope

This package revises the English small-card and Featured Work copy for
`Nothing by Bus` and the Gorgeous Space collection. It does not change Chinese
copy, layout, media, archive order, logos, deployment, or public destinations.

## Copy Decisions

### Nothing by Bus

- Keep the official English title.
- Small-card line: `Taiwan, one bus route at a time.`
- Featured description:
  `A Taiwanese-language travel series that follows local bus routes beyond the
  timetable—to markets, coastlines, kitchens, and the people who give each
  place its character.`

The new copy presents the bus journey as a way of seeing Taiwan while retaining
searchable terms such as `Taiwanese-language travel series` and `local bus
routes`.

### Gorgeous Space

- Replace the internal-sounding grouping title `Interior / Spatial Brand
  Films` with `Interior Design & Branded Films`.
- Small-card line: `Rooms reveal how people want to live.`
- Featured description:
  `For Gorgeous Space, I directed and edited films across residential
  interiors, renovations, designer profiles, and home-brand
  collaborations—using materials, light, and everyday rituals to show how
  people choose to live.`

The title now uses recognizable English production categories. The description
keeps the actual work range and contribution while giving the collection a
human point of view.

## Verification

- A copy-contract test failed first against the previous wording.
- `npm test`: 23 passed, 0 failed.
- `npm run build`: passed.
- `npm run figma:export`: passed.
- `git diff --check`: passed.
- English output contains `Gorgeous Space` and no visible `幸福空間`.
- Chinese source copy was intentionally left unchanged for the user's later
  review.
- External AI review was skipped because this was a bounded, user-directed
  copy refinement with deterministic output coverage and no new mechanism.

## Preserved Next Package

### From the Archive

- Present verified works in descending chronology:
  `鬼手神車` (2018), Three-Minute Micro Drama (2017-2018), `Heart of Steel`
  (2014-2015), `Lying Game` (2013-2014), then `Overclocking` (2011-2013).
- Preserve the existing large/supporting-card visual language in the first
  pass, but do not let card size override chronology.
- Give professional work visual proof where a truthful public screenshot,
  trailer frame, or user-owned still exists.
- Do not promote Three-Minute Micro Drama into Featured Work merely to fill a
  date gap; decide its tier from narrative weight and available material.
- Verify exact titles, years, and roles before publishing the very early CV
  entries. The current CV says `e4kids`, not the remembered `D4Kids`; `Explore
  the Unknown World` and `Digital Archives` also need year/role checks.

### Public Evidence And Preservation

- Apply one repeatable public-link pattern to official pages, watch links,
  press, trailers, and credit/proof sources.
- Keep public URLs distinct from locally preserved evidence. Build the private
  evidence vault and link-health record outside the public-risk site repo.
- The reusable workflow is captured in the parent Moonie V branch
  `codex/website-production-skills`, including
  `portfolio-narrative-builder` evidence-vault guidance and the generic
  `website-production-builder`.

### Platforms & Collaborations

- Replace visible names with official logos, presented as a restrained
  monochrome wall with optical size balancing and accessible names.
- Continue only from verified official assets. The source checkpoint is
  `docs/source-materials/collaboration-logo-wall.md`.
- Keep website data and Figma output synchronized.

### Ghost Hand Divine Car

- Wait for the disconnected user-owned still archive before rendering a reel.
- Design target: a restrained 12-15 second still-led piece using five to seven
  real production images, controlled crops, subtle parallax, and a
  metal/velocity rhythm.
- End on title, year, and confirmed roles. Do not invent race footage, vehicles,
  locations, or music.

### Language Follow-up

- Review and rewrite the Chinese work copy only after the English direction is
  accepted.

## Deployment And Rollback

- No Preview or production deployment was created or replaced.
- Revert `d457878` to restore the preceding English title and descriptions.
