# Replaceable Media And Design Sync

Use a canonical media contract so future replacements remain data work, not layout surgery.

## Canonical Media Record

For every visual role, store as applicable:

- stable role or work identifier;
- source URL/path;
- bilingual or localized alt text;
- intrinsic width and height;
- desktop focal point;
- mobile focal point;
- rights/status such as owned, licensed, public-link-only, needs-permission, or do-not-use;
- optional/required status;
- treatment such as image, video-poster, logo, or text-first;
- source/audit note for remote media.

Use a manifest for global roles and structured work frontmatter/data for project media. Validate both with one reusable module when possible.

## Data-Only Replacement Rule

An ordinary media replacement should require only:

1. add or select the approved asset;
2. update its canonical record;
3. rebuild and validate outputs.

Do not require edits to page markup, CSS selectors, SVG source, importer code, or manually duplicated asset lists. If a replacement does, the contract is incomplete.

## Semantic Site Output

- Use semantic `<img>` or `<video>` elements for meaningful media.
- Emit intrinsic dimensions to limit layout shift.
- Localize alt text; use empty alt only for genuinely decorative output.
- Apply focal points through data-driven `object-position`.
- Keep a deliberate text-first state when no approved image exists.
- Never borrow an unrelated still to satisfy a visual slot.

## One Source For Site And Design Layer

The website generator, SVG/Figma export, and editable importer must use the same canonical content and media snapshot. Generate an importer payload when direct file loading is unavailable.

Do not hand-maintain parallel constants such as `COPY`, `ASSETS`, or `WORKS` inside the importer. Do not truncate work lists independently. Stable IDs and order must propagate from canonical data.

For remote link-only media, either reference the source with proper attribution/rights status or render a labelled placeholder in design output. Do not silently download or rehost it.

## Propagation Test

Add a mutation test or fixture that changes one canonical media field and proves the change reaches:

- generated live markup;
- generated design/export output;
- importer payload or code path;
- localized alt/crop metadata where applicable.

Also prove an old value is absent. This catches parallel-copy drift that ordinary snapshot tests miss.

## Handoff Notes

Document:

- which file owns each media role;
- how to replace local and remote media;
- allowed formats and dimensions;
- how focal points behave on desktop/mobile;
- how to rebuild site and design outputs;
- how to validate rights and fallbacks.
