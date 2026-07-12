# Spec Gap Review - 2026-07-12

## External Review Status

Claude Code CLI is installed, but the external review could not run because the CLI is not logged in:

```text
Not logged in · Please run /login
```

Gemini CLI was not used for this pass because the existing session appears to have exceeded its practical conversation limit.

## Local Spec Findings

### High - Private evidence needs a stricter boundary

The portfolio workflow may use Yahoo Mail search results to reconstruct older client work. The repo needed an explicit rule that private email contents, screenshots, addresses, and raw messages must not be committed or published. `PROJECT_BIBLE.md` now defines a private evidence boundary and requires user approval for public wording derived from private evidence.

### High - Press and remote media need auditable metadata

Press thumbnails are intentionally sourced from source-page metadata, but the content schema does not yet store fields like `metadataCheckedAt`, `imageSource`, or `titleSource`. The bible now requires recording enough metadata to audit later. A future schema cleanup should add those fields to press entries.

### High - Video rights and hosting choice need a rule

The site mixes local showreel assets with external watch links. The bible now states that public platform videos should be link/embed-first unless music, image, and platform rights are clear.

### Medium - `data/site.json` contains stale public-copy fields

Several fields appear to be no longer rendered, including earlier About/Work With Me details and old CTA labels. This is maintenance risk because future agents may reuse stale copy. The bible now requires removed public sections to have their unused source fields removed or explicitly marked.

### Medium - Bilingual editorial policy was implicit

English and Chinese are not just translations; they serve different reader jobs. The bible now defines English as the fast international scan and Chinese as precision, warmth, and nuance.

### Medium - QA checklist was spread across memory

The project already has tests, but the human QA expectations were not centralized. The bible now adds a checklist for tests, visual inspection, hero refresh, showreel playback, screening strip looping, press thumbnails, and private source leakage.

## Recommended Follow-Up

- Log in to Claude Code and run `docs/reviews/claude-spec-review-prompt.md`.
- Add explicit press metadata fields in `content/works/*.md` when the next press card is added.
- Clean or mark unused fields in `data/site.json`.
- Consider a private `source-inventory.json` or `source-materials/` note for reconstructed work history, kept out of deployable public output unless approved.
