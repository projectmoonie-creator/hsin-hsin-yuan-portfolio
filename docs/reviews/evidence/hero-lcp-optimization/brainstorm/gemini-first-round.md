### 1. problem_reframe

The Hero performance issue is not primarily an asset encoding problem; it is a critical-path discovery and rendering pipeline bottleneck:

*   **Late Resource Discovery:** The current Hero relies on a CSS custom property on a `<div role="img">`. The browser cannot discover the image URL until the CSS bundle is downloaded, parsed, and matched against the DOM node, forcing initial request priority to `Low`.
*   **Main-Thread Layout Thrashing:** Animating `background-position-x`, `background-position-y`, and `background-size` forces the browser to run layout and paint calculations on every frame of the 18-second push animation, triggering Lighthouse non-composited animation penalties.
*   **Payload Inefficiency:** Delivering a single 195 KiB JPEG across all viewports over-delivers bytes to mobile clients by ~4×.
*   **Architectural Sync Risk:** Coupling image delivery to CSS properties while keeping metadata in `data/site.json` risks drift between rendering (`build-site.mjs`), Figma export (`build-figma-export.mjs`), and validation contracts.

The reframed problem requires establishing a single canonical metadata contract that simultaneously generates semantic HTML, responsive preloads, GPU-composited CSS transforms, and deterministic image derivatives.

---

### 2. pragmatic_path

#### Canonical Data Extension (`data/site.json` + `portfolio-contract.mjs`)
Extend `data/site.json.heroMedia` to declaratively express generated derivatives while preserving original source dimensions and focal points:

```json
{
  "heroMedia": {
    "src": "assets/hero/hero-master.jpg",
    "sha256": "3a8f...",
    "dimensions": { "width": 1920, "height": 1440 },
    "focalPoints": { "desktop": [0.5, 0.4], "stacked": [0.5, 0.35], "mobile": [0.5, 0.3] },
    "derivatives": [
      { "format": "avif", "width": 640, "path": "assets/hero/hero-640.avif" },
      { "format": "webp", "width": 640, "path": "assets/hero/hero-640.webp" },
      { "format": "jpeg", "width": 640, "path": "assets/hero/hero-640.jpg" },
      { "format": "avif", "width": 1280, "path": "assets/hero/hero-1280.avif" },
      { "format": "webp", "width": 1280, "path": "assets/hero/hero-1280.webp" },
      { "format": "jpeg", "width": 1280, "path": "assets/hero/hero-1280.jpg" },
      { "format": "avif", "width": 1920, "path": "assets/hero/hero-1920.avif" },
      { "format": "webp", "width": 1920, "path": "assets/hero/hero-1920.webp" },
      { "format": "jpeg", "width": 1920, "path": "assets/hero/hero-1920.jpg" }
    ]
  }
}
```

#### Deterministic Derivative Pipeline (`scripts/prepare-hero.mjs`)
Create a CLI script that:
1. Asserts SHA-256 hash match on master `hero-master.jpg`.
2. Executes `cwebp` / `ffmpeg` conversions to produce AVIF, WebP, and fallback JPEGs at target widths (640, 1280, 1920).
3. Asserts output byte budgets (Mobile AVIF < 35 KiB, Mobile WebP < 45 KiB, Desktop AVIF < 90 KiB).

#### Preload & HTML Matching (`build-site.mjs`)
Emit preloads and `<picture>` markup with matching `imagesrcset` and `imagesizes`:

*   **Preload (`<head>`):**
    ```html
    <link rel="preload" as="image" type="image/avif"
          imagesrcset="assets/hero/hero-640.avif 640w, assets/hero/hero-1280.avif 1280w, assets/hero/hero-1920.avif 1920w"
          imagesizes="100vw" fetchpriority="high">
    ```
*   **Body Markup:**
    ```html
    <div class="hero-frame">
      <picture class="hero-picture">
        <source type="image/avif" srcset="assets/hero/hero-640.avif 640w, assets/hero/hero-1280.avif 1280w, assets/hero/hero-1920.avif 1920w" sizes="100vw">
        <source type="image/webp" srcset="assets/hero/hero-640.webp 640w, assets/hero/hero-1280.webp 1280w, assets/hero/hero-1920.webp 1920w" sizes="100vw">
        <img src="assets/hero/hero-1920.jpg" srcset="assets/hero/hero-640.jpg 640w, assets/hero/hero-1280.jpg 1280w, assets/hero/hero-1920.jpg 1920w" sizes="100vw"
             alt="..." width="1920" height="1440" loading="eager" fetchpriority="high" decoding="sync" class="hero-img">
      </picture>
    </div>
    ```

#### Compositor-Safe Animation (`src/styles.css`)
Replace CSS background properties with `object-fit: cover` and GPU hardware-accelerated transforms:

```css
.hero-frame {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100vh;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 40%; /* Derived from focalPoints */
  transform: scale(1.0) translate3d(0, 0, 0);
  will-change: transform;
  animation: heroPush 18s cubic-bezier(0.25, 1, 0.5, 1) infinite alternate;
}

@keyframes heroPush {
  from { transform: scale(1.00) translate3d(0, 0, 0); }
  to   { transform: scale(1.08) translate3d(-1%, -1%, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .hero-img {
    animation: none;
    transform: none;
  }
}
```

---

### 3. alternative_architecture

#### Pure CSS `image-set()` on Background
Keep the image on CSS `background-image` using CSS `image-set()` for WebP/AVIF selection, coupled with `<link rel="preload" as="image">`.

*   **Tradeoffs:**
    *   *Pro:* Avoids HTML structure changes in `build-site.mjs` and Figma generation scripts.
    *   *Con:* Preloader discovery remains tied to CSS execution timing; animating `background-position`/`background-size` cannot be composited on the GPU, leaving thread contention and non-composited animation warnings unresolved.
    *   *Decision:* Rejected due to failure on compositor constraint and priority optimization.

---

### 4. low_cost_experiment

#### Experiment: Preload & Priority Hints Validation
*   **Hypothesis:** Adding `<link rel="preload" as="image" fetchpriority="high">` with exact matching `imagesrcset` / `imagesizes` in initial HTML shifts Chrome CDP network discovery from `Low` at +800ms to `High`/`VeryHigh` at +0ms without triggering redundant dual fetches.
*   **Method:**
    1. Update static HTML shell locally with target `<link rel="preload">` and `<picture>` elements.
    2. Run Chrome DevTools CDP network log trace.
3. Verify `priorityHinted` flag becomes `true`, priority reads `High`/`VeryHigh`, and network request count for hero image remains exactly 1.
*   **Falsification Trigger:** If Chrome fetches both the preloaded AVIF asset and the WebP fallback (due to size/media query mismatch), the test fails.

---

### 5. contrarian_challenge

#### Challenge: Multi-resolution AVIF/WebP builds are over-engineered for a single LCP element.
*   **Argument:** Modern high-density mobile displays (3× dppx) frequently request 1280px assets even on 390px wide viewports. Creating 9 variants (3 widths × 3 formats) introduces complex build asset maintenance. A single 1080px WebP compressed at quality 75 produces an asset < 40 KiB that fulfills mobile and desktop LCP targets with single-file simplicity.
*   **Counter-defense:** Retaining explicit target dimensions in `data/site.json` allows automated build scripts to enforce tight byte budgets without manual tuning, keeping mobile payloads below 35 KiB on 1×/2× networks.

---

### 6. unconstrained_possibility

#### Inline Micro-LCP AVIF Data URI Shell
Inline a ultra-compressed 120x90 byte-budget AVIF asset (< 800 bytes) directly as a `src="data:image/avif;base64,..."` inside the baseline HTML `<img>` tag, overlaid by the responsive `<picture>` candidate via CSS once loaded.

*   **Impact:** Drops FCP-to-LCP time delta to < 50ms instantly across all mobile networks.
*   **Constraint Check:** Must be evaluated against pixel-difference visual tolerance bounds.

---

### 7. overlooked_risks

1.  **Preload Mismatch Double-Fetch:** If media query breakpoints or `sizes` descriptors in `<link rel="preload">` differ by even 1px from `<picture><source sizes="...">`, WebKit/Blink will treat them as different resources and download the hero twice.
2.  **Transform Overflow Clipping & Edge Bleed:** Moving from `background-size: cover` to CSS `transform: scale()` on an `<img>` with `object-fit: cover` can expose fractional pixel gaps or bleed outside container boundaries on dynamic mobile address bar resize events unless the parent container uses `overflow: hidden` and rigid aspect ratios.
3.  **Figma Exporter Contract Drift:** If `build-figma-export.mjs` expects `site.json.heroMedia.src` to point directly to a web-accessible single asset, restructuring `heroMedia` into a nested derivative tree could break Figma JSON schema exports.

---

### 8. assumptions_to_verify

| Assumption | Verification Method | Falsification Criteria |
| :--- | :--- | :--- |
| `cwebp` / `ffmpeg` generate visually imperceptible AVIF/WebP at target size budgets | Run `cwebp -q 80` / `ffmpeg -crf 28` and perform SSIM / PSNR comparison against original JPEG | SSIM < 0.95 or visible artifacting on dark gradient areas |
| CSS `transform: scale()` eliminates non-composited animation warnings in Lighthouse | Run `lighthouse --only-categories=performance` against local build | Presence of `non-composited-animations` diagnostic in report |
| `fetchpriority="high"` raises CDP network priority in mobile simulation | Inspect Chrome DevTools CDP trace log for resource initial priority | Initial priority recorded as `Low` or `Medium` |

---

### 9. recommended_next_decision

**Producer Action Request:**
1. Authorize the canonical schema update in `portfolio-contract.mjs` to validate derivative metadata under `site.json.heroMedia`.
2. Authorize creation of `scripts/prepare-hero.mjs` to execute asset generation and SHA-256 validation.
3. Authorize updating `build-site.mjs` and `styles.css` to implement `<picture>` HTML structure and GPU-composited transform keyframes.
4. Execute 3 matched Lighthouse verification runs to confirm zero TBT/CLS regression and LCP shift from ~4.8s to <1.5s.