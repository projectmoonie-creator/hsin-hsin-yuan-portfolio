# Google Search Discovery Production Closeout — Local Adjudication

Date: 2026-08-22

Outcome: `PASS` after the docs-only closeout commit is non-force pushed to
`codex/hero-cover-refresh` and the remote tip is read back exactly. Before
that mechanical durability step, the checkpoint remains
`PASS_WITH_OPEN_ITEMS`.

## Frozen review provenance

- Packet:
  `google-search-discovery-production-closeout-review-packet-2026-08-22.md`
- Packet SHA-256:
  `c6337892100f716412cfaae6141c9c2cd0ead54b9096eb46b9cf325961adacc6`
- Both reviewers received those exact packet bytes.
- Gemini official API requested, observed, and completed
  `gemini-3.7-flash`; verdict `PASS`, no findings. Usage: 2,949 input /
  639 output / 4,212 total tokens.
- Claude subscription lane requested dynamic `opus`, observed and completed
  `claude-opus-5`; auxiliary routing also observed
  `claude-haiku-4-5-20251001`. Verdict `PASS`, no blocker or major;
  six minor and two nit findings. No paid API fallback was used; actual spend
  is null in the status ledger.
- Claude review SHA-256:
  `a63af520d8ecd9e0837729815f9d3ea11b35223e038230927ea840de6ac377c5`.
- Gemini review SHA-256:
  `56cef4ceb8df6e7af645f01979e1d00222b3e02369169d6c568b22f090e55103`.

Gemini's phrase that the LinkedIn work was “untracked/uncommitted” is read as
“outside this commit.” The packet itself correctly states that its
`docs/reviews/LOG.md` hunk is a tracked but uncommitted modification.

## Claude findings

### MINOR 1 — abridged `vercel.json` excerpt

Disposition: `AGREE / RECORD CORRECTION`.

The frozen packet labels an excerpt as `vercel.json:1-22` while omitting the
unchanged headers block. The redirect object is exact and the omission changes
no technical conclusion. The frozen packet remains byte-identical for review
provenance; the dated closeout report calls the block an abridged excerpt.

### MINOR 2 — build-date-derived sitemap `lastmod`

Disposition: `AGREE / ACCEPTED OPEN ITEM`.

`scripts/build-site.mjs` derives `lastmod` from the UTC build date. The
recorded sitemap hash is therefore exact for this build, not timeless. A
content-derived date could make Google's signal more trustworthy, but it is a
new runtime/generator decision and is outside this stop-after-indexing package.
No runtime change is opened.

### MINOR 3 — missing Chinese Googlebot parity

Disposition: `AGREE / RESOLVED BY READ-ONLY EVIDENCE`.

A fresh Googlebot-UA fetch of `/zh/` returned SHA-256
`2aa8819599348b4e14d9ade95378019732d7eb8260f0a35fff4377e1809588cc`,
exactly matching the normal-UA live page and fresh local build.

### MINOR 4 — PageSpeed baseline comparability

Disposition: `AGREE / FIXED`.

`docs/performance/README.md` now states that the 2026-08-10 reference was
captured on the preserved Vercel alias and that the first successful apex run
creates a new baseline rather than a matched-URL comparison.

### MINOR 5 — protected-file digest in committed evidence

Disposition: `REJECT AS A DEFECT`.

The GitHub repository is public, and the same producer-supplied digest is
already an intentional public integrity pin throughout tracked
`STATUS.md` and historical closeout records. It discloses no document bytes,
path outside the repo, or credential. Replacing it here would weaken the
required byte-identity check without removing an existing exposure.

### MINOR 6 — no PageSpeed retry trigger

Disposition: `AGREE / FIXED`.

`STATUS.md` now records a read-only retry after Google's daily quota is
nonzero. The retry does not authorize runtime, media, deployment, Contact, or
alias changes and cannot reopen the closed network-budget package.

### NIT 1 — Chinese language-code specificity

Disposition: `AGREE / ACCEPTED OUT-OF-SCOPE CANDIDATE`.

`lang="zh"`, `hreflang="zh-Hant"`, and `og:locale="zh_TW"` are not the
cause of the current indexing wait. Normalizing the HTML language code would
change public output and needs a separate bounded package; it is not opened.

### NIT 2 — packet wording for the old alias

Disposition: `AGREE / FIXED WITH MINOR 4`.

The active PageSpeed guide now distinguishes canonical apex, preserved Vercel
alias, and alias-captured historical baseline precisely.

## Final ruling

Both independent lanes return `PASS`. The runtime is the smallest correct
change, the live build matches Production byte-for-byte, the verification TXT
is retained without its token entering Git, and `/zh/` has a valid accepted
indexing request. The Google crawl wait and PageSpeed quota exhaustion are
external open items, not product defects.

Formal closeout becomes durable only when the commit containing this
adjudication, the dated closeout, both review records, their status ledgers,
the URL-authority correction, and the isolated package log/status updates is
non-force pushed to the active branch and read back exactly. `main`,
Production, DNS, Search Console, Contact, unrelated LinkedIn paths, and the
protected document remain untouched.
