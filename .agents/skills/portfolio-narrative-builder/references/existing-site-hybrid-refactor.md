# Existing-Site Hybrid Refactor

Use this workflow when the user wants the structure or interaction of one version combined with the visual language or content system of another.

## 1. Establish The Baseline

Record:

- exact baseline commit;
- desktop and mobile screenshots at named viewport sizes;
- page order, content order, and interaction inventory;
- current build, test, preview, Figma, and deployment commands;
- known good behavior and known failures.

Do not rely on memory or a browser tab as the baseline.

## 2. Create Recoverable Checkpoints

For every version the user may want to revisit:

1. create a descriptive branch;
2. add an annotated tag at the exact commit;
3. push both when remote recovery matters;
4. note what the checkpoint contains and omits.

Start a substantial hybrid in a separate branch or worktree from the chosen structural baseline. A Finder copy is not the primary recovery mechanism.

## 3. Build A Keep/Port/Rewrite/Retire Matrix

Classify every high-level element:

| Decision | Meaning |
| --- | --- |
| `keep` | Preserve the baseline behavior and structure. |
| `port` | Bring a verified asset, content record, or isolated capability from another version. |
| `rewrite` | Preserve the user-facing purpose but replace its owner implementation. |
| `retire` | Remove from all active output layers. |

Include sections, order, typography, palette, motion, media, navigation, generator logic, dependencies, data fields, tests, design exports, and deployment behavior.

Do not merge whole source trees when the desired result is selective.

## 4. Maintain A Fingerprint Ledger

For each important design or behavior fingerprint, record:

- human-visible outcome;
- owning source file/function/data field;
- positive assertion;
- negative assertion;
- desktop, mobile, reduced-motion, and no-JS state;
- Figma/design-output counterpart;
- rollback checkpoint.

Examples include hero geometry, work order, loop direction, border treatment, ambient effects, sticky panels, and mobile autoplay.

## 5. Port Data Before Shell Changes

Port verified content, URLs, rights notes, localized alt text, dimensions, focal points, and media status first. Make the data contract pass before changing the page generator.

Bring isolated capabilities, not obsolete dependency stacks. If the old version's useful behavior depends on retired ambient or animation systems, extract the minimum state machine and test it independently.

## 6. Change The Owner

Replace a visual fingerprint where it originates:

- markup in the generator;
- palette and geometry in tokens/components;
- media in the manifest/frontmatter;
- motion in its controller;
- design output in the canonical exporter/importer.

Avoid runtime theme flags, append-only CSS overrides, duplicated components, and late cascade patches. Those approaches preserve hidden old behavior and make future changes unpredictable.

## 7. Prove Presence And Absence

Add positive tests for approved page order, content order, anchors, media roles, palette, semantics, and interaction states. Add negative tests and source searches for retired fields, classes, effects, dependencies, labels, and generated artifacts.

Historical specs may mention retired systems; active generators and generated output may not recreate them.

## 8. Compare Matched States

Capture and compare at minimum:

- desktop and mobile at the same baseline sizes;
- tablet or the critical intermediate breakpoint;
- reduced motion;
- no JavaScript;
- keyboard focus and interaction pause states.

Verify behavior, not only a single hero screenshot.

## 9. Keep Deployment Reversible

Build and publish a preview first. Do not replace the production project or domain until the user approves the preview. Keep checkpoint URLs or commit references so visual feedback can compare specific versions.

## Failure Patterns

- Copying a folder and losing provenance.
- Merging an entire experimental branch to recover one useful behavior.
- Hiding the old design under a tail-end CSS patch.
- Keeping retired data fields that can silently regenerate old sections.
- Declaring success from a desktop screenshot while mobile still autoplays or overflows.
- Updating the website but leaving Figma, SVG export, or importer on an old content model.
