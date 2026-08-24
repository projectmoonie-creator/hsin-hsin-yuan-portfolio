# Frozen r2 delta review — Privacy Article 3 rights wording

Date: 2026-08-24 (Asia/Taipei)
Repository: `hsin-hsin-yuan-portfolio-remove-lights`
Review mode: read-only findings only; do not edit files.

## Parent review

The complete bounded package was frozen in packet SHA-256 `c1eafc62833c066aec99cf3afb15acc2496f774a41c870c5aa7b859cf1db186b`. Gemini completed that review with no BLOCKER, MAJOR, or MINOR. Claude's one subscription-lane attempt ended `claude-process-failed`; dispatch was ambiguous, so it was not retried and provides no evidence.

## Why this delta exists

After review, the maintainer checked the current official English text of Taiwan's Personal Data Protection Act. Article 3 lists rights to inquire/review, obtain a copy, supplement/correct, demand cessation of collection/processing/use, and erase. The reviewed copy compressed those rights to access, correct, stop using, delete, and request a copy. That omitted the explicit supplement right and the collection/processing parts of cessation.

## Exact change

English before:

> Subject to applicable law, you may ask to access, correct, stop using, or delete personal information connected to your inquiry. You may also ask for a copy. Submit the request through the Contact form and include enough detail to identify the correspondence.

English after:

> Subject to applicable law, you may ask to access or review personal information connected to your inquiry, obtain a copy, supplement or correct it, stop its collection, processing, or use, or delete it. Submit the request through the Contact form and include enough detail to identify the correspondence.

Traditional Chinese before:

> 依適用法律，你可以請求查詢、閱覽、複製、更正、停止使用或刪除與洽詢相關的個人資料。請透過聯絡表單提出，並提供足以辨識該筆往來的資訊。

Traditional Chinese after:

> 依適用法律，你可以請求查詢或閱覽與洽詢相關的個人資料、取得複製本、補充或更正資料、停止資料的蒐集、處理或利用，以及刪除資料。請透過聯絡表單提出，並提供足以辨識該筆往來的資訊。

No other public copy, data practice, provider, route, layout, style, sitemap entry, canonical/hreflang value, or llms.txt line changed.

## Test and browser evidence after the delta

- A focused test was first changed to require all Article 3 rights and failed against the reviewed wording.
- After the exact two-sentence data change, focused test passes 1/1 and full `npm test` passes 181/181.
- The focused test now also asserts the Article 8 identity, purpose, data categories, retention period, territory/provider recipients, Article 3 rights, and required-field consequence in both languages.
- Fresh build, design-contract audit, six Featured-reel integrity checks, zero-vulnerability production dependency audit, `git diff --check`, static-output privacy scan, and protected-file hash all pass.
- Headless Chromium desktop English and mobile Chinese rerun passes with zero overflow, console errors, failed requests, or POST requests; updated screenshots were visually inspected.

## Requested review

Review only the two revised sentences and their consistency with the official Article 3 rights list. Return findings sorted BLOCKER, MAJOR, MINOR, NOTE. State whether this narrow delta preserves the parent package's static-Preview readiness. Do not broaden into legal services, a general site rewrite, analytics, cookies, search work, Production, or deployment.
