# Validation Gates

Use these gates for any portfolio build or major refactor. Run the narrowest tests during development, then the full suite before review or preview.

## 1. Test-First Behavior

For a feature or regression:

1. write the smallest failing test that describes the user-visible contract;
2. confirm it fails for the expected reason;
3. implement the minimum coherent change;
4. run the focused test;
5. refactor while green;
6. run the full suite.

## 2. Content And Safety

Verify claims, roles, links, metrics, language parity, privacy classification, media rights, and publishability. Scan source and generated output for secrets and raw private evidence.

## 3. Active-Layer Regression Search

After removing or renaming something, search:

- canonical data and content;
- generator source;
- CSS and JavaScript;
- dependencies and build copy steps;
- generated HTML/assets;
- tests;
- SVG/Figma generator output;
- importer code and docs.

Distinguish allowed content motion from retired ambient motion. A moving work strip can be approved while glow canvases, pointer beams, sticky theatres, or unrelated animation dependencies must still be absent.

## 4. Functional And Accessibility Matrix

### Preview Identity Preflight

Before visual QA:

1. build from the intended worktree;
2. confirm the chosen port is free; if it is occupied, leave the unknown process alone and use a unique port;
3. start the preview with an explicit working directory and output directory;
4. verify a served content fingerprint against the current build, such as a known heading, selector, asset path, or embedded build marker;
5. record the worktree, build command, URL, and port with the QA evidence.

A `server-ready` signal proves only that a listener responded; it does not prove the current build or intended worktree is being served. Never capture screenshots until preview identity is verified.

### Viewport And Behavior Matrix

Inspect at minimum:

- desktop `1440 × 900`;
- compact desktop `1200 × 900`;
- tablet `834 × 1112`;
- mobile `390 × 844`;
- narrow mobile `360 × 800`;
- `prefers-reduced-motion: reduce`;
- JavaScript disabled;
- keyboard-only navigation and visible focus;
- body and component overflow.

Check section order, navigation, contact route, links, media fallback, loop pause/resume, manual mobile scrolling, readable no-JS markup, language switching, and inline video behavior when present.

## 5. Visual Fingerprints

Use both positive and negative evidence:

- desired tokens, type, frame geometry, spacing rhythm, media treatment, and section ownership are present;
- retired palette, glow, shadow, blend, sticky, autoplay, library, and source-field fingerprints are absent.

Compare matched baseline and candidate screenshots at identical sizes. Record intentional differences.

## 6. Site And Figma Parity

Verify page order, work order/count, localized copy, media roles, focal metadata, palette, and retired-section absence in both live site and design output. Mutate one canonical content/media field and confirm every generated layer changes without hand editing.

## 7. Recovery And Deployment

Confirm baseline and experiment checkpoint branches/tags resolve to the expected commits. Build a preview without modifying production routing. Production replacement requires explicit user approval after preview inspection.

## 8. External Review

When the user requests external, named, or multiple-AI review, **REQUIRED SUB-SKILL:** use `reviewing-with-multiple-ai` after deterministic and visual QA. Give reviewers the approved spec, relevant diff, test results, screenshots, and explicit review questions.

If the user requested two reviewers, both lanes must produce usable results before calling the review complete. Treat quota or availability recovery as workflow state, not a reason to silently substitute another provider or ask the user to repeat setup already recorded by the canonical review skill.
