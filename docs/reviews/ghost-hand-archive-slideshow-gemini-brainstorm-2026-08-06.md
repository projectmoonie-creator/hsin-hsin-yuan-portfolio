# Ghost Hand Archive Slideshow Architecture Brainstorm Packet

**Date:** 2026-08-06
**Context:** Architecture gate for `ghost-hand-divine-car` static slideshow card reel pipeline.

---

### 1. problem_reframe

The core architectural issue is not merely rendering six stills into an MP4 video; it is maintaining a zero-drift, privacy-enforced contract between local local-only assets and public static site artifacts without introducing a monolithic CMS-style framework.

The existing site relies on a rigid schema and flat static assets. Adding still-slideshow capabilities threatens to leak authoring metadata (EXIF/GPS/paths), break loop continuity against static posters, or over-abstract simple media generation into an unmaintainable multi-tier framework. The architecture must guarantee that the authoring toolchain remains local, metadata-scrubbed, and transactional while keeping public manifests completely neutral to asset origin.

---

### 2. pragmatic_path

**Compressed Two-Boundary Pipeline (Minimal Safe Layering)**

Collapse the four proposed layers into two distinct, well-tested functional boundaries:

1. **Pure Composition & Timeline Generator (`slideshow-compiler.js`)**:
   - Takes a minimal recipe object (source asset paths, focal points, durations, transition lengths).
   - Validates asset dimensions, aspect ratios, and EXIF cleanliness in-memory.
   - Outputs both the HyperFrames HTML composition string and the manifest metadata payload in a single deterministic pass.
   - **Tradeoff:** Combines recipe validation and HTML composition into one functional unit. Reduces total repo file count and interface overhead, though unit tests must cover both JSON validation and DOM output structure together.

2. **Transaction-Guarded Staging Apply (`slideshow-writer.js`)**:
   - Uses the existing A1 four-target rollback writer pattern.
   - Imports private stills, strips/normalizes them to WebP in a temporary build directory, runs HyperFrames/FFmpeg headless render, and verifies output stream metrics (`yuv420p`, BT.709, exactly 300 frames at 30 fps).
   - Swaps public files only after all verification checks pass.
   - **Tradeoff:** Relies on intermediate disk staging, but maintains safe rollback without requiring OS-level atomic folder swaps.

---

### 3. alternative_architecture

**Zero-Browser Native FFmpeg Complex-Filtergraph Pipeline**

Bypass HyperFrames (and headless browser dependencies) entirely by compiling the recipe directly into a pure FFmpeg filtergraph string (`zoompan` + `xfade`).

- **Mechanism:** A pure Node utility reads the six WebP stills, computes frame offsets for the 8-frame dissolves and 1.000→1.035 zoom-in, and invokes `ffmpeg` directly using a calculated `-filter_complex` script.
- **Tradeoff (Pros):**
  - Eliminates HTML generator, DOM rendering overhead, and browser automation dependencies.
  - Significantly faster execution time and zero risk of DOM/CSS rendering jitter.
- **Tradeoff (Cons):**
  - Precise subpixel Ken Burns (`zoompan`) in FFmpeg filtergraphs can suffer from micro-shutter jitter unless calculated with strict mathematical precision in filter expressions.
  - Harder to visually preview transitions locally without building custom preview tooling.

---

### 4. low_cost_experiment

**Loop Boundary & Subpixel Jitter Test (Falsification Gate)**

* **Objective:** Verify whether a 1.000→1.035 push-in over 300 frames creates subpixel rendering artifacts or a visible jump when looping to frame 0 (`4arUG0s6.jpg` crop).
* **Execution:**
  1. Generate a mock 60-frame (2-second) slideshow using two dummy synthetic images with sharp geometric grids.
  2. Apply the exact zoom expression ($1.000 \rightarrow 1.035$) and crossfade logic.
  3. Render to H.264 using both HyperFrames canvas rendering and native FFmpeg filtergraph.
  4. Compare Frame 0 and Frame 300 crop coordinates using `ffprobe` / image diff script.
* **Pass/Fail Criteria:**
  - **Pass:** Pixel difference delta between frame 300 end-state and frame 0 poster crop within the dissolve window is $< 1.5\%$ RMS error; frame count is exactly 300.0 frames (no fractional frame drop).
  - **Fail:** Visible edge shifting or micro-stutter on frame 0 loop reset.

---

### 5. contrarian_challenge

1. **Why use HyperFrames for simple static crossfades?**
   HyperFrames introduces a heavy DOM engine dependency for what is fundamentally a sequence of linear crossfades and a uniform zoom. Using an HTML generator for static media adds browser-version variance and non-deterministic rendering risks to a static pipeline.
2. **Is `video-frame | still` discriminator leaky?**
   Adding `still` to the planner schema introduces redundant provenance tracking. If the poster target is standard high-res image format (`.jpg`/`.webp`), the manifest should not care whether it originated from a video timestamp or a raw photograph. The public schema should remain unified; origin tracking belongs strictly in private authoring recipes.

---

### 6. unconstrained_possibility

**CSS Motion Matrix Direct-to-Video Engine**

Instead of rasterizing frames via standard canvas or video filter graphs, transform the six stills into an inline SVG/CSS hardware-accelerated animation script, then record the layout viewport directly via a headless WebCodecs pipeline. This would allow infinite-resolution previews in local dev environments at 60fps before baking down to the final target H.264 file, making previewing instant and pixel-exact across desktop and mobile layout tests.

---

### 7. overlooked_risks

- **Subpixel Resampling Jitter:** Pushing in from 1.000 to 1.035 across 300 frames yields a movement of only ~0.000116 scale increment per frame. In 1280×720 H.264 yuv420p encoding, fractional pixel quantization can cause noticeable "shimmer" or line crawling on fine detail.
- **EXIF Metadata Residuals:** Simply converting JPEGs to WebP does not automatically guarantee all EXIF tags (e.g., location, camera serial numbers, custom maker notes) are stripped unless explicit flags (`-metadata clear` / libwebp parameters) are enforced in the Node pipeline.
- **FS Lock Errors during Target Rollback:** On certain operating systems or watched directory setups, replacing four active static assets simultaneously can fail mid-write if dev server processes hold read-locks on media files.

---

### 8. assumptions_to_verify

1. **Poster Frame Alignment:** Assume `4arUG0s6.jpg` at 1.000 scale matches the exact visual alignment of Frame 0 in the rendered slideshow.
2. **Color Space Consistency:** Assume WebP source normalization preserves BT.709 color matrix values without shift when encoded via FFmpeg to `yuv420p` video.
3. **Rollback Writer Safety:** Assume the existing A1 four-target replacement script cleans up staging directories on process termination or unhandled exceptions.

---

### 9. recommended_next_decision

Proceed with **Option 2 (Pragmatic Path: Compressed Two-Boundary Pipeline)** under TDD:

1. Keep the public schema clean without adding redundant poster discriminators.
2. Run the **Low-Cost Experiment (Section 4)** to confirm subpixel zoom stability before writing final rendering code.
3. Keep raw stills isolated outside the repository tree, using strict in-memory/staged metadata stripping.
