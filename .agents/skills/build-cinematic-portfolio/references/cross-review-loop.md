# Evidence-First Cross-Review Loop

Use this loop for consequential changes to positioning, homepage architecture, public claims, privacy, media rights, deployment, or the reusable skill itself. Skip external review for small mechanical fixes already covered by deterministic tests.

## 1. Prepare one review packet

Include:

- Repository goal and target audience.
- Exact change package and non-goals.
- Current bible/spec and relevant source files.
- Commands reviewers may run.
- Known constraints and decisions already approved by the user.
- Required output schema.

Do not include the desired verdict. Do not ask the reviewer to edit.

Reviewer prompt skeleton:

```text
Act as an external reviewer. Read the named files and inspect the implementation.
Do not edit files. Return prioritized findings with file:line evidence.
For each finding include severity, user impact, governing rule, and the smallest safe work package.
Separate blockers from cleanup. End with what is already strong.
```

## 2. Preflight the review surface

Before spending a review attempt, verify that the requested tool exists, is authenticated, can read the repo, and has usable quota/capacity. Follow repository-specific model-routing rules when a named provider is used.

If authentication, permissions, missing CLI, timeouts, or conversation limits block the reviewer:

- Record the requested reviewer, failure reason, and whether any usable findings were produced.
- Do not label the review complete.
- Do not downgrade merely to escape authentication, parsing, empty-output, timeout, or sandbox failures.
- Continue with local tests and audits when they can still produce evidence.

## 3. Independent first review

Ask Reviewer A to find problems from source evidence. Require:

- Critical / High / Medium / Low severity.
- `file:line` or exact artifact evidence.
- User-facing consequence.
- Suggested governance rule when the gap can recur.
- Suggested work package with goal, affected files, non-goals, validation, and rollback.

Reviewer A does not edit and does not receive the maintainer's preferred solution.

## 4. Adversarial adjudication

Give Reviewer B the code and Reviewer A's report. Ask B to adjudicate every item:

- `agree`
- `upgrade`
- `downgrade`
- `reject`
- `already fixed`

Every disagreement needs source evidence. B must also identify omissions and flag supposedly mechanical fixes that hide editorial, privacy, rights, or architecture decisions.

Use different reviewer families when available—for example Claude for a broad specification/UX audit and Codex or Gemini for evidence-based adjudication—but treat role separation as more important than provider count.

## 5. Maintainer decision matrix

The primary agent resolves findings against the user's goal, project bible, public/private boundary, and current scope.

```markdown
| ID | A severity | B verdict | Evidence verified | Decision | Package |
|---|---|---|---|---|---|
| R-01 | High | agree | yes | accept | navigation-access |
| R-02 | Medium | downgrade | yes | defer | detail-pages |
```

Only accepted findings enter implementation. Preserve rejected findings in the review artifact when their reasoning may be useful later.

## 6. Implement one bounded package

Each package states:

- Goal.
- Files likely touched.
- Explicit non-goals.
- Tests and visual checks.
- Cross-output search terms.
- Rollback path.

Write behavior/content tests before implementation. Avoid tests that pin exact CSS whitespace, entire generated pages, or incidental class order. Prefer semantic structure, public invariants, absence of retired content, and runtime measurements.

## 7. Close the loop

After implementation:

1. Run tests and build.
2. Search every active output layer: source data, generator, CSS/JS, tests, generated HTML, Figma/SVG exporter, importer, and current specs.
3. Verify desktop, mobile, reduced motion, primary CTA, and media fallbacks.
4. Convert recurring mistakes into a bible rule, negative regression test, validator, or skill reference.
5. Record deviations and the reason; never silently declare an unavailable review successful.

## Recurrent failures this loop prevents

- Removing a section from HTML while an importer can recreate it.
- Using an unrelated strong image as a silent placeholder.
- Publishing metrics without project context or source confidence.
- Letting a reviewer edit before taste, privacy, and scope decisions are adjudicated.
- Treating a failed login or exhausted conversation as review evidence.
- Accepting a long list of findings without verifying file evidence.
- Creating CSS-literal tests that block legitimate redesigns while missing behavioral regressions.
