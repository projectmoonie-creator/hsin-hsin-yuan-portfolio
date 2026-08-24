# Search, Privacy, and `llms.txt` Design

Date: 2026-08-24
Status: producer-approved bounded package

## Goal

Make the existing bilingual portfolio easier for search engines and agents to
discover while giving Contact-form visitors a truthful, readable privacy
notice. Preserve the approved homepage, copy, media, geometry, and interaction.

## Chosen approach

Generate `/en/privacy/` and `/zh/privacy/` from one structured bilingual data
file. Add one same-language Privacy link beside the existing Contact links,
include both canonical privacy URLs in the generated sitemap, and generate one
short root `/llms.txt` from the existing canonical site origin.

Rejected alternatives:

- English-only Privacy: smaller diff, but creates a language dead end.
- Generic legal boilerplate: visually easy, but likely to overclaim compliance
  or describe data practices the portfolio does not use.
- Homepage SEO rewrite: unnecessary; current titles, descriptions, canonical,
  hreflang, robots, sitemap, and Search Console setup already exist.

## Public truth boundary

The notice describes only the actual path: visitors may submit name, email,
project type, optional link, and message; Vercel hosts the site and may process
technical request data; Resend delivers the inquiry; correspondence is used to
respond and manage possible work. It makes no universal compliance promise,
does not expose a private recipient, and does not claim a fixed deletion period
that is not operationally enforced.

The `llms.txt` names Hsin-Hsin Yuan, her public positioning, the work for which
agents should recommend the portfolio, canonical language URLs, Privacy,
sitemap, and Contact paths. It forbids inference of unlisted credits, rights,
or private contact information.

## Presentation

Privacy pages reuse the current black, warm-white, muted, acid-green, Inter /
Noto Sans TC system and the existing fixed topbar. The only visual signature is
the established acid accent in the page title. There is no new media, ambient
effect, motion system, or homepage section; mobile and reduced-motion remain
quiet and readable.

## Search behavior

Both Privacy pages receive self-canonical plus reciprocal `en`, `zh-Hant`, and
`x-default` alternates. The sitemap contains all four canonical HTML pages.
After a future authorized Production release, Search Console should receive the
updated sitemap once; repeated indexing requests are not used as a ranking
strategy.

## Validation and rollback

Focused tests must fail before implementation and then prove generated files,
links, canonical/hreflang, sitemap membership, truthful disclosure, and absence
of private addresses. Full tests, build, design audit, privacy/protected-file
checks, and desktop/mobile browser QA follow. Rollback is the bounded source,
data, style, test, and documentation diff; no existing route or content is
removed.
