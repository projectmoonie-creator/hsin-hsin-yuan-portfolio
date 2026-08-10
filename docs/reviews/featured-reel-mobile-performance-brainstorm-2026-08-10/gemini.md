```markdown
# Independent Analysis: Mobile Featured Reel Startup Optimization

## 1. problem_reframe

The observable 7.5-second delay on mobile startup is not merely a client-side JavaScript trigger flaw (`preload="none"` vs. `play()` timing); it is a structural mismatch between **network bitrate budget** and **late request discovery**.

1. **Bitrate vs. Connection Capacity**: The canonical MP4 payloads range from 1.44 Mbps to 2.61 Mbps (e.g., *My Art, My Voice* at 32.6 MB / 2.61 Mbps). On a standard mobile profile (1.6 Mbps download), the network bandwidth is *lower* than the video playback bitrate. Even if decoding starts immediately, steady-state playback will buffer unless payload sizes are reduced.
2. **Late Request Discovery**: With `preload="none"`, the browser waits through the 35% viewport intersection *and* the 700ms poster hold before making the first HTTP Range request. On a 150ms RTT link with HTTP setup and thread contention, initial byte arrival and hardware decoder buffer fill take multiple seconds.

The problem must be reframed from *"How do we trigger `play()` faster?"* to *"How do we warm the single incoming video buffer post-LCP without competing for network bandwidth or exceeding mobile bitrate limits?"*

---

## 2. pragmatic_path

Implement **Proximity-Based Single-Reel Warm-Ahead** deferred strictly until after the page Hero LCP event finishes.

* **Trigger**: A secondary `IntersectionObserver` with a expanded vertical root margin (e.g., `200px 0px`) targets Featured reel cards at `<= 820px`.
* **Execution**:
  1. Warm-ahead remains completely disarmed until `Hero LCP` has completed (or `window.onload` + idle delay).
  2. When an eligible reel enters the 200px margin, check `navigator.connection.saveData` and `navigator.connection.effectiveType` (bypass if `saveData === true` or connection is `2g`).
  3. If passed, set `video.preload = "metadata"` and execute `video.load()` on that **single reel only**.
  4. Once `loadedmetadata` fires (transferring ~117 KiB for fast-start `moov` header), stop network activity until the reel reaches 35% visibility and completes its 700ms hold.
* **Concurrency Policy**: At most **one** reel may hold a warm-ahead buffer at any time. Moving away clears the non-active reel back to `preload = "none"`.

---

## 3. alternative_architecture

Introduce an automated **Mobile Video Derivative Pipeline** in the canonical build/prepare system.

* **Root Cause Addressed**: Preloading headers fixes initial frame render, but playing a 2.61 Mbps file over a 1.6 Mbps mobile connection guarantees mid-stream buffering stalls.
* **Pipeline Mechanism**:
  * Extend the existing prepare/build script to read the canonical media manifest and generate mobile-specific MP4 derivatives (`-crf 28`, maximum resolution 540p or 720p, capped target bitrate at ~500–700 Kbps, muted audio track removed).
  * Output target payload for *My Art, My Voice* drops from 32.6 MB to ~6.2 MB (~500 Kbps), fitting easily inside 1.6 Mbps bandwidth.
* **Markup**: Use responsive `<source>` selection or dynamic JS manifest loading based on `window.innerWidth <= 820`.

---

## 4. low_cost_experiment

### Falsifiable Test Setup
* **Environment**: Synthetic WebPageTest / Lighthouse / Playwright run matching baseline conditions (390×844, 150ms latency, 1.6Mbps down, 750Kbps up, cold cache).
* **Variant A**: Baseline (`preload="none"`).
* **Variant B**: Post-LCP Proximity Single-Reel Warm-Ahead (200px margin, `preload="metadata"` + `load()`).
* **Success Criteria**:
  1. Median time from 35% visibility + 700ms hold to visual `playing` event drops from **7535ms to <800ms** (delta <= 100ms post-hold).
  2. Pre-eligibility transfer strictly bounded to **<= 120 KiB**.
  3. **Zero regression** in Hero LCP timestamp, Total Blocking Time (TBT), or Cumulative Layout Shift (CLS).

---

## 5. contrarian_challenge

**Is inline video autoplay on mobile scroll actually worth the engineering and bandwidth overhead?**

* **The Reality**: The lab data demonstrates that preloading 117 KB of `moov` metadata gets the first frame playing at ~727ms. However, because the bitrate of 4 out of 6 reels exceeds the 1.6 Mbps mobile network speed, the video will freeze after ~1.5 seconds of play.
* **Alternative**: If mobile derivatives are deferred, static poster cards with a lightweight CSS/Canvas micro-indicator or an explicit tap-to-play interaction deliver a vastly superior user experience compared to a video that starts in 700ms and immediately stalls due to network starvation.

---

## 6. unconstrained_possibility

If free from single-file HTTP Range request constraints:

* **Fragmented MP4 (fMP4) / Low-Latency HLS**: Deliver short 1-second segment chunks. The client fetches chunk 0 (less than 40 KB) instantly upon scroll proximity.
* **WebCodecs + Canvas Pre-decode**: Fetch the first keyframe (I-frame) as a ultra-compressed AVIF/WebP image or sub-10KB micro-chunk, decode it via WebCodecs, and render to a `<canvas>` context during the 700ms hold. The video element smoothly swaps in seamlessly once playback starts.

---

## 7. overlooked_risks

1. **Mid-Stream Buffering Stalls**: Lab test verified 6-second metadata lead time yields a 727ms playing event. It did **not** test continuous playback stability. On a 1.6 Mbps link, 2.0+ Mbps videos *will* stall after consuming the initial buffer.
2. **Network Stream Contention**: If proximity warm-ahead triggers before Hero image/fonts finish downloading, TCP connection multiplexing on HTTP/2 will degrade Hero LCP performance.
3. **Scroll Thrashing & Socket Exhaustion**: Rapid scrolling past 6 reels could trigger 6 consecutive `video.load()` calls. Without strict single-reel active cancellation, byte-range requests will saturate mobile radio queues and waste user data.
4. **iOS Safari Power/Memory Caps**: Keeping hardware video decoders warm across multiple video tags on Mobile Safari can lead to silent canvas drops or unhandled `play()` promise rejections.

---

## 8. assumptions_to_verify

| Assumption | Verification Method | Pass Threshold |
| --- | --- | --- |
| 117 KiB metadata buffer prevents playback stalling | Run full 10-second playback test under 1.6 Mbps throttling | Zero `waiting` or `stalled` events during 10s run |
| Post-LCP warm-ahead does not impact LCP metric | Compare WPT LCP timestamps across 10 cold runs | Baseline LCP vs Variant LCP delta < ±25ms |
| iOS Safari honors `preload="metadata"` + `load()` without explicit gesture | Execute test script on real iOS 18/19 device in Low Power Mode | `loadedmetadata` fires without DOM Exception |

---

## 9. recommended_next_decision

Based on the evidence, constraints, and bandwidth realities:

1. **Page-load `preload="metadata"` across all reels**: **UNJUSTIFIED**. Will compete with critical Hero asset requests and regress mobile LCP.
2. **Full-video preload**: **UNJUSTIFIED**. Transfers up to 32.6 MB per reel, wasting user mobile data.
3. **Proximity-based single-reel warm-ahead**: **JUSTIFIED (Short-Term / Phase 1)**. Gated strictly post-LCP, limited to 1 concurrent reel within a 200px margin, transferring only metadata (~117 KiB).
4. **Mobile derivatives**: **JUSTIFIED (Mandatory Phase 2)**. Warm-ahead solves startup delay (reducing 7.5s -> 727ms), but mobile derivatives (~500 Kbps 540p) are mandatory to prevent mid-stream buffering stalls on cellular networks.
5. **No change**: **UNJUSTIFIED**. The 7.5s cold startup latency violates core mobile performance goals.
```