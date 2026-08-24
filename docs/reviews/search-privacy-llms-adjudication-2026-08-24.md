# Search / Privacy / llms.txt adjudication

Date: 2026-08-24 (Asia/Taipei)

## Review provenance

- Parent packet SHA-256: `c1eafc62833c066aec99cf3afb15acc2496f774a41c870c5aa7b859cf1db186b`.
- Gemini parent review requested / observed / completed `gemini-3.7-flash`; result completed with no BLOCKER, MAJOR, or MINOR.
- Claude parent review requested dynamic `opus`; observed and completed model are null. Attempt `73399628-2126-4e26-a061-0779f8e37660` ended after 382,584 ms as `claude-process-failed`; `modelRequestSent` is ambiguous. It was not retried, downgraded, or replaced with an API/PAYG lane and supplies no review evidence.
- R2 delta packet SHA-256: `105bd7b8ec7b29acb97d9bb8e370779e3bf489ba042a837c6ace4ba072a78de4`.
- Gemini r2 requested / observed / completed `gemini-3.7-flash`; result completed with no BLOCKER, MAJOR, or MINOR and explicitly preserved static-Preview readiness.

No dual-review consensus is claimed.

## Maintainer adjudication

### Parent Gemini NOTE 1 — PDPA Article 8 alignment

Verdict: `downgrade` for the reviewed wording, then `already-fixed` in the final candidate.

The parent review said the reviewed text precisely covered Article 3 rights. A direct check of the current official Personal Data Protection Act showed that the reviewed sentence omitted the explicit right to supplement data and narrowed cessation to use rather than collection, processing, or use. The focused test was strengthened first and failed against the reviewed output. The only implementation correction replaced the two bilingual rights sentences with the complete list. The focused test then passed, and the r2 independent review confirmed the corrected mapping.

### Parent Gemini NOTES 2–5

Verdict: `agree`.

The provider/cross-border description matches the stated Vercel and Resend architecture; static output contains no provider secret, private recipient address, or local path. Canonical, hreflang, and sitemap pairs are grouped correctly. `llms.txt` is concise discovery metadata and makes no indexing-control claim. The package is ready for a static Preview while Production and Search Console remain separate actions.

### Gemini r2 NOTE — corrected Article 3 wording

Verdict: `agree`.

The final bilingual wording now covers inquiry/review, copy, supplement/correction, cessation of collection/processing/use, and deletion without changing the site's data practices, routes, or visual contract.

## Final package decision before Preview

- Local implementation: `PASS`.
- Independent review: one completed provider (`Gemini`) across parent and narrow r2; Claude attempt incomplete and non-evidentiary.
- Remaining operational boundary: static `dist/`-only Preview is standing-authorized after final gates. Git push, `main`, Production, alias/domain changes, Contact changes or submissions, and Search Console mutations are not authorized by this package.
