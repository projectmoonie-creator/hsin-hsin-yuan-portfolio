# Quality Gates

## Narrative

- The first viewport answers who, what, and why this person.
- The homepage has no repeated self-introduction or duplicate proof grid.
- Metrics stay attached to the work they prove.
- Experimental practice does not overpower the primary professional identity.

## Media

- All public images have rights status and bilingual alt text.
- Missing optional layers degrade cleanly.
- Image replacement requires no CSS change.
- Hero and flagship crops work at desktop and mobile widths.

## Motion and accessibility

- Initial content is visible before JavaScript runs.
- One dominant motion idea appears per viewport.
- Reduced motion is fully readable and disables scroll transforms.
- Mobile has no sticky traps, wheel interception, or horizontal overflow.
- Full-stage media transforms are clipped at the root as well as the component boundary; verify `scrollWidth === clientWidth`.
- A hero play control remains visually separate from the name and positioning copy at desktop and mobile widths.
- Keyboard focus and the contact path remain visible.

## Engineering and public safety

- Tests and build pass.
- Active Figma/design outputs match the public architecture.
- Private evidence, secrets, raw messages, and unapproved claims are absent from source and build output.
- Remote links fail safely; third-party media is not silently substituted.

## Cross-review integrity

- External reviewers produced findings before edits and were given the same scoped packet.
- Every accepted finding has source evidence and a maintainer decision; reviewer severity is not accepted automatically.
- Unavailable, unauthenticated, timed-out, empty, or quota-blocked reviewers are recorded as failed attempts, not completed reviews.
- Review packages include goal, affected files, non-goals, validation, and rollback.
- Tests protect semantic behavior, public content rules, and important removals; they do not pin CSS whitespace or incidental generated markup.
- Accepted recurring lessons are reflected in the project bible, a negative regression test, a deterministic validator, or this skill.
