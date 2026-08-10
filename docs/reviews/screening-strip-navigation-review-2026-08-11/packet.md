# Screening Strip Navigation — Independent Review Packet

Date: 2026-08-11

## Objective and boundary

Review one low-risk user-visible defect repair on local branch
`codex/screening-strip-navigation`, based on `cad590e683092f917e622ca16b704b10b9eb3b5a`.
All six small Screening Strip cards must navigate in-page to the matching
Featured Work. Tech Dreamers was the lone exception and incorrectly opened its
TaiwanPlus URL. Its large Featured media link and audited Official page must
remain external. Do not edit files.

Non-goals: no visual, copy, media, reel lifecycle, Figma geometry, Contact,
Preview, deployment, alias, `main`, or Production change.

## Root cause

`content/works/tech-dreamers.md` alone declared
`watchLoopTarget: "watch"`. Shared `renderWatchLoopItem()` branched on that
field and emitted the external `watchUrl` plus `target="_blank"`. Existing
tests explicitly approved the exception.

## Candidate changes

- Delete Tech Dreamers `watchLoopTarget` source field.
- Make shared `renderWatchLoopItem()` always emit `href="#${work.slug}"`.
- Retire `watchLoopTarget` from the Featured public field classification and
  strip any legacy value in normalization.
- Update the Bible/design contract so external links stay in the large card.
- Replace the former exception assertions with a six-card invariant.

Relevant production snippets after change:

```js
// scripts/build-site.mjs
<a class="${cardClass}" href="#${escapeHtml(work.slug)}" ${image}>
```

```js
// scripts/lib/portfolio-contract.mjs
retired: Object.freeze(["hideMediaLabel", "featuredMediaAspect", "watchLoopTarget"])
// ...
delete normalized.watchLoopTarget;
```

```js
// tests/build-site.test.mjs
assert.deepEqual(
  links.map(([, href]) => href),
  works.map((work) => `#${work.slug}`),
);
for (const [, , attributes] of links) {
  assert.doesNotMatch(attributes, /target=|rel=/);
}
```

## TDD and validation evidence

- RED: focused suites failed five assertions: source still owned the field,
  Tech Dreamers resolved to the external URL, and the field remained optional.
- GREEN: focused suites passed 62/62.
- Full suite passed 156/156 after Figma export completed. An earlier parallel
  run raced the exporter rebuilding `figma-export/` and produced one transient
  SVG `ENOENT`; the required sequential rerun passed.
- Build, design-contract audit, Figma export, mobile reel integrity,
  `git diff --check`, public/evidence privacy scan, and protected-file hash
  check passed.
- Exact before/after generated HTML differs by one line per locale: only the
  Tech Dreamers small-card href changes from the TaiwanPlus URL to
  `#tech-dreamers`, and its small-card `target`/`rel` disappear.
- Browser evidence: English desktop pointer, Chinese 390×844 touch, and English
  360×800 no-JavaScript keyboard all end at `#tech-dreamers`, keep the large
  card visible, open zero new windows, retain two official external links,
  submit zero Contact POSTs, and report no console/page errors.

## Review request

Return exactly:

1. `VERDICT: PASS` or `VERDICT: NEEDS_REVISION`.
2. Findings grouped as P0, P1, P2. Each finding must cite a current file and
   line or the reproduced behavior; write `none` when empty.
3. Confirm whether the shared renderer now owns the invariant, whether any
   active consumer can still recreate the direct small-card external action,
   and whether the two intended large-card external links remain protected.
4. State whether this is appropriately bounded as a low-risk user-visible
   package.

Do not suggest unrelated refactors and do not modify the repository.
