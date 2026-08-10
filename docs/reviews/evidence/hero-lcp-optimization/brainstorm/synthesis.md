# Hero LCP architecture synthesis

Frozen packet SHA-256: `c1595d8b959fa03cf5b180afc83d10a605c422bf6f940e8bdf874f27cf96d181`

## consensus

Codex and Gemini independently converge on extending the existing HeroMedia contract, producing semantic initial-HTML picture markup, pairing responsive preload data exactly with picture candidates, generating checked-in derivatives through a source-verified CLI, and moving the slow push to an image-layer transform. Both require CDP/Lighthouse proof for request priority, duplicate-fetch absence, non-composited-animation removal, Hero bytes, LCP, TBT, and CLS.

## complementary_ideas

Codex separates crop geometry from compression error and insists that wide/stacked/mobile transform scale be derived from the existing absolute background-height behavior. Gemini adds explicit byte-budget and SSIM experiments plus a clear preload mismatch falsification test. Together these become a mobile-first experiment before the final width set is frozen.

## provider_unique_ideas

- Codex: derive candidate URLs from one canonical output basename/recipe instead of storing a long renderer-facing table; preserve Figma on the full canonical source.
- Gemini: evaluate concrete output byte budgets and SSIM; treat a single moderate-width WebP as a contrarian maintenance baseline.
- Gemini's inline micro-placeholder is preserved as an unconstrained future idea, not adopted because it adds a second visible loading state and is outside the approved visual-equivalence scope.

## contradictions

- Gemini proposes explicit derivative entries; Codex proposes recipe-derived candidates. Explicit entries are easier to inspect but create the parallel hand-maintained table this package is meant to avoid. The recipe is selected, with generated normalized candidates exposed to consumers and tests.
- Gemini sketches one shared three-width srcset and `sizes=100vw`; the producer requires mobile/desktop responsive sources and the current Hero is not full viewport width on desktop. Named mobile/desktop profiles with measured `sizes` are selected.
- Gemini's example uses generic `scale(1→1.08)` and `object-position`; that cannot preserve the existing 140→148% absolute image-height crop at every frame ratio. The final transforms must be derived and proven at start/end/reduced states.

## experiments

1. Encode a 960px mobile candidate in AVIF/WebP/JPEG from the canonical sanitized source; verify format/dimensions/metadata, byte size, and objective image similarity.
2. Render a temporary semantic picture with matched preload; require one Hero request, `High` priority, `priorityHinted=true`, and no fallback double fetch.
3. Pause baseline and candidate at animation start/end plus reduced static; require unchanged frame/text geometry and predeclared pixel-difference limits before expanding the derivative family.

## risks

- Preload and picture `media`/`sizes` drift can create duplicate downloads.
- Width-constrained stacked frames need different transform scale math from height-constrained wide/mobile frames.
- Transform origin/translation may not reproduce background-position endpoints; endpoint proof is mandatory.
- AVIF/WebP chroma and color-space differences must not be confused with crop drift.
- The current 195 KiB Hero is only a minority of total transfer; claims must stay Hero-specific and may not appropriate the 2.4 MiB all-image opportunity.
- Overlay stacking and semantic alt must survive the switch from background DIV to img.

## options

1. **Recipe-derived responsive delivery (selected):** one canonical source/fingerprint/output recipe; normalized candidates serve renderer and prepare CLI. Lowest ongoing replacement cost and no hand array.
2. **Explicit derivative table:** simpler renderer, but higher drift/replacement cost and rejected as a parallel candidate list.
3. **Single 1080px WebP:** minimal maintenance but fails the approved AVIF/WebP/JPEG responsive contract and cannot be the package result.

## recommendation

Implement option 1 behind the current HeroMedia normalizer. Keep the full canonical JPEG as Figma/source authority, generate only widths justified by actual mobile/desktop rendered size plus slow-push overscan, and use one prepare command with atomic staging/probes. Begin with the mobile 960px experiment; stop if matched request or visual gates fail.

## provider_status

- Codex: completed local independent first round; current primary implementer, not counted as independent final review.
- Gemini: requested/observed/completed `gemini-3.6-flash`; usable independent first round.
- Claude: requested dynamic `opus`; observed/completed model unavailable; wrapper result `incomplete`, `claude-process-failed`, and whether a request started is ambiguous. No fallback and no three-provider consensus claim.

## producer_decision

The producer's 2026-08-10 instruction already selects the bounded semantic picture, responsive formats, canonical HeroMedia, transform-only motion, repeatable preparation, and local validation path. This synthesis narrows implementation details within that authorization; it does not reopen the visual or scope decision.
