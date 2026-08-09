# Intentional Localized Blanks — Implementation Plan

Goal: preserve six producer-approved Chinese blanks as stable refillable
fields while emitting no empty DOM node or visual gap. English remains
independent and unchanged.

Constraints:

- Keep every stable key, locale key, object, and array position.
- Exact empty string means intentional no-output; whitespace, null, missing,
  and non-string values remain invalid.
- No CSS redesign, `main` change, hosted Preview, deployment, Contact action,
  or broader Chinese-copy import.
- Keep the protected untracked review file byte-identical and outside Git.

Completed sequence:

1. Freeze and review the content-state contract; record the producer choice.
2. Add failing tests for validator, renderer, work-order blank/refill, source
   shape, bilingual independence, and no-empty-DOM behavior.
3. Add guarded `blank` plus refill-from-empty support.
4. Permit blank only for Featured taglines and availability items.
5. Omit empty tagline/pill elements without changing source structure or CSS.
6. Apply P0 site blank, verify, then apply five P1 Featured blanks.
7. Run focused/full tests, build, Figma export, design audit, and diff checks.
8. Inspect English/Chinese desktop/mobile screening strip, availability, and
   Featured detail screenshots with browser DOM assertions.
9. Obtain one independent low-risk final review and adjudicate every finding.
10. Commit, push the feature branch plus a dated backup, and read both refs
    back exactly; do not touch `main` or deploy.
