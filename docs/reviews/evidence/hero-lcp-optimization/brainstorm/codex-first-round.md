# Codex independent first round

## problem_reframe

This is not a new Hero component from scratch. The site already has a canonical HeroMedia contract and Figma propagation test; the defect is that its delivery sub-contract stops at one source URL and the live renderer hands image semantics and motion to CSS. The safest change is therefore to extend the existing contract with one deterministic delivery recipe and change only the website presentation owner.

## pragmatic_path

Add a `delivery` record under canonical HeroMedia containing one source-integrity fingerprint, one output basename, named `mobile`/`desktop` width profiles, format order, `sizes`, encoder settings, and the existing full JPEG fallback. Normalize it into derived immutable source candidates. A prepare CLI reads this same normalized contract, verifies the input SHA/dimensions, generates unique widths in AVIF/WebP/JPEG, strips metadata, stages atomically, and probes every output. The renderer uses the normalized candidates for matched media-qualified preloads and picture sources; Figma continues to use canonical source/dimensions/focal data.

Keep `.hero-media` as the frame and overlay owner. Put `<picture>` and `<img>` inside it. Use `object-fit: cover`, data-driven `object-position`, and breakpoint-specific transform variables derived from the current absolute background-height percentages. Animate only the `<img>` transform. Treat the current normal start/end and reduced static crops as three separate frozen states; matching them is a required experiment before generalizing the transform formula.

## alternative_architecture

Store every generated source candidate explicitly in `data/site.json`. This makes HTML generation simple and fully declarative, but it creates a long error-prone table, duplicates information derivable from one basename/width recipe, and raises replacement cost. It is justified only if encoders later produce non-patterned filenames or art-directed crops rather than same-source resizes.

## low_cost_experiment

Generate only mobile 960px AVIF/WebP/JPEG files in `/private/tmp`; render a throwaway picture layer over the frozen mobile frame; pause the old and candidate motion at start/end/reduced states; calculate geometry plus pixel MAE. In parallel, inspect CDP request priority and duplicate downloads. If transform math or picture/preload selection fails at this smallest case, stop before creating the full derivative family.

## contrarian_challenge

The current sanitized JPEG is already only about 190 KiB, while most of the reported 3.2 MiB belongs elsewhere. A large derivative system can cost more maintenance than the Hero bytes it saves. The package should prove Hero-specific transfer and LCP gains; it must not claim the PageSpeed image-savings total or all-site performance. Keep widths minimal and do not build a generic P1 image service in P0.

## unconstrained_possibility

A future general media compiler could ingest canonical role recipes, create content-addressed variants, and emit an importable site/Figma asset snapshot. That is deliberately out of scope; this package should shape the Hero recipe so it can later be absorbed without exposing renderer-specific arrays.

## overlooked_risks

- Two media-qualified preloads can still duplicate if the `media` boundary and picture sources are not byte-for-byte aligned.
- `transform: scale(1.4)` is not equivalent at stacked widths where `object-fit: cover` is width-constrained; start/end scale must be derived by geometry.
- `transform-origin` plus translation may not reproduce background-position math; visual proof must include both endpoints, not only a still.
- AVIF encoding can be slow and color/chroma changes can inflate screenshot diffs; record color-space/codec settings and compare crop geometry separately from compression error.
- A semantic image may become the LCP immediately but an overlay/pseudo-element stacking mistake can alter contrast or accessibility.
- A source mutation test must prove old URLs disappear from site and Figma outputs while derivative paths change deterministically.

## assumptions_to_verify

- Chrome honors `imagesrcset`/`imagesizes`, `media`, `type=image/avif`, and `fetchpriority=high` on the chosen preload without a duplicate request.
- Available `ffmpeg` has a usable AVIF encoder and produces metadata-safe files.
- Figma should embed the full canonical JPEG rather than a delivery derivative, preserving existing editable export pixels.
- Three or four unique widths cover the actual rendered/resolution requirements once the slow-push overscan is included.

## recommended_next_decision

Choose recipe-derived candidates, checked-in derivatives, and a Hero-specific prepare CLI. Run the mobile single-width experiment first. Only after its request and visual-equivalence gates pass should the contract expand to the final mobile/desktop width set.
