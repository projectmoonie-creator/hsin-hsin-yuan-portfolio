# Portfolio Design Contract Governance v1 — Project Validation

Date: 2026-08-03  
State: `PASS_WITH_OPEN_ITEMS`  
Branch: `codex/portfolio-design-contract-governance`  
Visual/output baseline: `90b5d1ae5e32126c78672df33c4c6f4eaa7f0642`  
Validated project checkpoint: `5639fa7314a47e64d08e13f0fc44433d8b0d6648`

## Outcome

The project-level part of Option A is complete and passes its visual-freeze
gate. The approved portfolio layout was not redesigned or reset. Instead, its
existing behavior is now represented by one canonical design contract, a
read-only inspector, explicit per-work presentation metadata, a shared
source-to-view-model normalizer, and aligned Figma current references.

The public website output remains byte-for-byte identical to the pre-migration
baseline. The shared `portfolio-narrative-builder` method update and final
independent review remain separate open steps before local-main integration.

## Checkpoints

- `d12a98f` — contract, baseline manifest, active-doc alignment, report-only
  inspector, and Package 1 parity proof.
- `977d8a3` — dependency-free normalization, explicit Featured variants/title
  ownership, unified focal evidence, and renderer compatibility.
- `5639fa7` — Figma exporter routed through the shared loader; current mobile
  role, tokens, Press map, Archive family, and Featured variants aligned.

## Public website freeze proof

After every package, `npm run build` reproduced the exact baseline hashes:

| Artifact | SHA-256 |
| --- | --- |
| `dist/index.html` | `57991f78d70a6b5e78a1dab9bcec2a06957cbec38164059aec60f24acb3f7d00` |
| `dist/en/index.html` | `c02fba348f90d7aabccf044dfff71b0bbb921040301b0eb47da7f189d59ae315` |
| `dist/zh/index.html` | `d7e2ff8110dd985f2ff6f0d9f04842ae348b8c1165d39e24209bafb266b1cb4d` |
| `dist/styles.css` | `82ef5295b2b1218bc3ad1fb2fa88b983c884b624e533ef1561a1ad835536afe0` |
| `dist/main.js` | `79831f5936f8e42846f6dc53e8f27e49fe6c079ceef2758fe49effcc4fbff1b7` |

Because the English/Chinese HTML, CSS, and JavaScript are identical, the
normalizer cannot have silently restored an older card layout, copy layer,
breakpoint, or interaction.

## Deterministic validation

- TDD RED states were observed for the absent inspector, absent normalizer,
  absent presentation declarations, mixed focal shape, and stale Figma
  current-reference behavior.
- `npm test`: 50 passed, 0 failed.
- `npm run audit:design-contract`: `PASS`; 6 Featured, 5 Archive, 2 global
  Press, 3 work Press; no active contract drift.
- `npm run build`: passed.
- `npm run figma:export`: passed.
- `git diff --check`: passed.

## Browser geometry and accessibility evidence

Native Chromium passed 10 bilingual states:

- `1440 × 900`
- `1200 × 900`
- `834 × 1112`
- `390 × 844`
- `360 × 800`

The checks proved:

- exact section order from Hero through Contact;
- no horizontal overflow in any state;
- 6 Featured, 5 Archive, and 2 global Press records in both languages;
- Hero two columns above 1280 and one column at/below 1280;
- four `fill-card` and two `centered-16x9` desktop Featured variants;
- both centered variants at 16:9 on wider screens;
- all six Featured media surfaces at 16:9 at/below 820;
- two-column global Press above 820 and one column at/below 820;
- equal Archive widths, including the ordinary half-row fifth desktop card;
- keyboard first focus on `Available for` above 820 and the retained `Contact`
  path at/below 820, where the other two nav links are intentionally hidden;
- reduced-motion preference active, every video paused, and static posters
  present;
- no-JavaScript Chinese output retains every work/archive/Press item, Contact
  form, five linked media surfaces, and zero overflow.

Desktop and mobile Works screenshots were visually inspected. The existing
desktop sticky-card overlap and mobile fixed topbar were retained as approved
behavior, not treated as migration differences.

## Intentional Figma-only changes

Figma exports are allowed to differ from the baseline only to correct known
current-reference drift. Their new fingerprints are:

| Artifact | SHA-256 |
| --- | --- |
| `figma-export/01-desktop-home.svg` | `818a95fd1b41f5d84ac30842887f564c2f83d60ba3b7769255a3e0789373647e` |
| `figma-export/02-desktop-works-logos.svg` | `8368e496d283f47a2fd73742f24dc46512275e251be6caf500c448a623a8a03f` |
| `figma-export/03-mobile-home.svg` | `43ecb8b502fe606505a5fa4a590a03d0b3da8091377acd9146bf8e65e8564e06` |
| `figma-export/README.md` | `1a91858e1c323a7e76e7e1015b05cbc50f8005658628cf686ea4c4284668f625` |

These changes do not flow into the live website.

## Evidence and safety boundaries

- Evidence/provenance remains available under the normalized contract and is
  not confused with public anatomy.
- No media, copy, URL, section, CSS rule, JavaScript interaction, or contact
  endpoint was changed by this governance package.
- No deployment, push, Production promotion, contact-form submission, or email
  occurred.
- The latest Vercel Preview remains the older external preview and does not
  contain this local package.
- The protected untracked duplicate review file remained untouched.

## Rollback

- Public visual/output rollback baseline:
  `90b5d1ae5e32126c78672df33c4c6f4eaa7f0642`.
- Package checkpoints are independent commits and can be reviewed separately.
- Do not use a destructive reset in the shared worktree; revert or abandon the
  isolated branch if rollback is required.

## Open items

1. Generalize only the proven method into `portfolio-narrative-builder` and
   validate the skill package.
2. Run the required independent convergent review and resolve valid findings.
3. Re-run all gates, then fast-forward local `main` only if its recorded base
   is unchanged. Do not deploy or push as part of that integration.
