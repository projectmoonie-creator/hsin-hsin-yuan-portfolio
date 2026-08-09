# Mobile Featured Reel Preview — Shareable Access

Date: 2026-08-09

State: `READY_PUBLIC_SHARE`

## Access Decision

After the direct Preview required Vercel login, the producer explicitly
authorized creation of a new public Shareable Link and acknowledged that the
Hobby plan would revoke the previously retained share link. This is an access
follow-up to deployment `dpl_BJ35n23AjLaDfevrDpmEJy6R1Xia`; it does not change
the deployed files or source commit
`3a5bf52fe38d6f9a4558b3b074b46d39183504c6`.

Read-only diagnosis first confirmed that Vercel CLI and the producer's Chrome
session both resolve to `projectmoonie-creator`, the owner of
`projectmoonie-creator's projects`, and can access project
`hsin-hsin-yuan-portfolio`. The lock was therefore not missing membership.
Project settings showed `Vercel Authentication` with `Require Log In` checked
under `Standard Protection`; an app-embedded, private, or differently signed-in
browser session does not inherit the owner's Vercel session.

## Shareable-Link Evidence

- The Share dialog was opened on the exact Preview deployment and initially
  showed `Only people with access can view and comment`.
- `Anyone with the link` triggered Vercel's Hobby warning that only one
  Shareable Link may exist and continuing would revoke the existing link.
- The producer's explicit replacement authorization covered that warning. The
  confirmation succeeded, Vercel reported that a shareable link was generated
  and copied, and the dialog changed to
  `Anyone with the link can view and comment`; login remains required only to
  comment.
- The access-bearing URL is intentionally excluded from Git and repository
  documentation. Its SHA-256 fingerprint is
  `6ad616ea8e08a003db1556245196d46c969afada15d838d3d106b3534c75e440`.
- The active deployment skill prohibits fetching the deployed URL after
  creation. No curl, browser visit to the site, Contact request, or public-page
  content retrieval was performed as part of this access mutation.

## Boundary And Next Action

The prior Hobby Shareable Link is revoked and replaced. Project-level Vercel
Authentication remains enabled; the new access-bearing URL bypasses that
protection for viewers who possess it. No `main`, Production, canonical alias,
deployment content, source, Contact, or protected untracked document changed.

The exact next action is producer inspection of the new share URL on the target
mobile browser, including the 700ms Featured-reel hold and scroll handoff. Any
`main` or Production integration remains a separate explicit authorization.
