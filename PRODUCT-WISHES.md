# Product Wishes

This file records producer expectations that are not yet approved implementation
packages. It is a cold-start input, not authorization to purchase, configure,
deploy, publish, or expose private data.

## 2026-08-13 — Own domain and professional contact routing

- Select and register an own-domain identity for the portfolio; map it to the
  canonical Vercel Production site and update `SITE_ORIGIN`, canonical URLs,
  Open Graph URLs, `robots.txt`, and `sitemap.xml` through the existing single
  source.
- Design a professional contact address and mail flow before calling the
  portfolio launch-complete: public alias, private forwarding destination,
  authenticated sender identity, reply handling, spam/failure behavior, and a
  recoverable provider/DNS setup.
- Keep the private destination address and every credential outside Git and
  public output. Do not purchase a domain, change DNS, expose an address, add
  Vercel environment values, submit Contact, or send a test email without the
  applicable producer decisions and action-time authorization.
- Current urgency: the deployed Contact function requires `RESEND_API_KEY`,
  `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL`, while Vercel Production reports
  no environment variables. The visible form is therefore not operational and
  must be resolved as a bounded launch-blocker package.
