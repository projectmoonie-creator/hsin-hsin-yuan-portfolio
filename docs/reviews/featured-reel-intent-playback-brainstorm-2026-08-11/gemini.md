# Featured Reel Intent Playback — Frozen Brainstorm Packet

## 1. Root-cause model

The perceived performance degradation on mobile stems from a compounding latency stack between explicit user action and visible video playback:

```
[User Action: Jump/Tap/Hover]
         │
         ▼
[35% Visibility + Dwell Delay (700ms mobile / 1400ms desktop)] ──> Artificial Wait Time
         │
         ▼
[video.play() Called]
         │
         ▼
[Network RTT + MOOV Atom Fetch + Keyframe Decode]             ──> Cold Connection Latency
         │
         ▼
[visible `playing` Event]
```

### Key Contributing Factors

1. **Passive Warm-up Window Disconnect**:
   The current passive warm-up runs only after window `load` + 180ms, targeting a single candidate. When a visitor immediately clicks a Screening Strip card during initial page load, zero video bytes have been fetched (`preload="none"`), and no connection to the media host is warm.
2. **Artificial Dwell Latency on High-Intent Signals**:
   The 700ms (mobile) / 1400ms (desktop) hold timers were engineered for passive scroll-by discovery to prevent thrashing. When a user explicitly taps a Screening Strip card or directly hovers/focuses a Featured card, forcing them to wait through the passive dwell timer introduces unnecessary perception delay.
3. **Network Pipeline Contention on 1.6Mbps / 150ms RTT**:
   Cold range requests for H.264 MP4 headers require an initial TLS/TCP handshake plus MOOV atom / first I-frame download. On constrained connections, this transfer alone takes 3.5s–5.5s. Adding a 700ms dwell delay pushes visible playback past 6 seconds.
4. **Touch Surface & Navigation Ambiguity**:
   The large media surface is currently wrapped in a canonical destination `<a>` tag. Mobile visitors attempting to tap the media surface to initiate a preview risk triggering external link navigation or interfering with natural vertical touch scrolling.

### What an Intent Mechanism Can (and Cannot) Fix
* **Can Fix**: Eliminates the 700ms/1400ms artificial dwell delay upon high-intent signals; initiates `preload="metadata"` at the exact moment of pointer/touch/jump intent (saving 1–2 RTTs before `play()`); provides clear distinction between preview and navigation on mobile.
* **Cannot Fix**: Physical network bandwidth limits (1.6Mbps download speed), browser MP4 decode setup overhead, or cold TCP/TLS handshakes if invoked prior to initial network idle.

---

## 2. Options

### Option A: Immediate Intent Bypass & Dual-Target Touch Surface (Minimal DOM Change)

* **Mechanism**:
  * **Desktop**: `pointerenter` or `focusin` on the large card or its matching Screening Strip item marks the card with `intent="explicit"`. Bypasses the 1400ms dwell, sets `preload="metadata"` immediately, and calls `play()`. `pointerleave` / `focusout` releases ownership.
  * **Mobile Jump**: Tapping a Screening Strip card triggers smooth-scroll, immediately assigns intent ownership to the target large reel, sets `preload="metadata"`, and calls `play()` without waiting 700ms.
  * **Mobile Touch on Large Card**: `touchstart` preloads metadata (`preload="metadata"`). If a vertical scroll (`touchmove` > 10px) is detected, intent is cancelled. If a stationary tap occurs on the video surface, it toggles muted preview play/pause (`e.preventDefault()`). Tapping the explicit title/CTA anchor below the media navigates to the external canonical link.
* **Benefits**:
  * Zero change to card DOM structure; uses event delegation on existing anchor wrappers.
  * Completely removes artificial delay for explicit jumps and hovers.
* **Costs**:
  * Mobile tap behavior on the image requires careful event handling to prevent accidental external navigation while keeping CTA text navigable.
* **Risks**:
  * Touch movement threshold edge cases on older mobile devices could cause intermittent preview cancellations.

### Option B: Decoupled Card Surface with Intent Engine (Strongest Structural Isolation)

* **Mechanism**:
  * Restructures the card media container into a sibling non-anchor element (`<div class="featured-media-surface">`), separating it from the canonical link anchor (`<a class="featured-title-link">` covering text/CTA).
  * Desktop hover/focus on the media surface triggers instant playback ownership.
  * Mobile tap on the media surface toggles preview playback without any risk of opening external links. External navigation is restricted to explicit CTA/text links.
  * Screening Strip jump handler immediately passes ownership to the decoupled media surface and begins playback.
* **Benefits**:
  * Perfect semantic isolation between preview control and external link navigation.
  * Eliminates complex `preventDefault()` / touch-state tracking on external link anchors.
  * Fully accessible; clean ARIA roles for media surface (`role="region"`, `aria-label`).
* **Costs**:
  * Requires DOM restructuring of large Featured cards and CSS regression testing.
* **Risks**:
  * Potential layout/geometry regression if CSS flex/grid rules rely on wrapper anchor hierarchy.

### Option C: Micro-Dwell Fast-Path with Intent-Based Preload (Low-Cost Refinement)

* **Mechanism**:
  * Retains 100% existing DOM hierarchy and anchor wrappers.
  * **Screening Strip Jump**: Instantly promotes target reel to owner, sets `preload="metadata"`, and initiates `play()`.
  * **Desktop Hover/Focus**: Replaces 1400ms dwell with a 50ms micro-dwell upon `pointerenter`/`focusin` to filter out accidental mouse pass-throughs, then initiates `preload="metadata"` and `play()`.
  * **Mobile Surface**: `touchstart` initiates `preload="metadata"`. If touch releases without movement, `play()` is called. Direct external navigation occurs if the user double-taps or taps the card text area.
* **Benefits**:
  * Extremely low implementation risk; logic resides entirely in interaction event listeners.
  * 50ms micro-dwell prevents stream thrashing from fast mouse sweeps across the page.
* **Costs**:
  * Mobile tap on video surface still carries slight ambiguity between preview play and external link navigation.
* **Risks**:
  * Mobile browsers may occasionally register rapid preview taps as navigation clicks if touch event cancellation is incomplete.

### Option D: Vector-Based Velocity Tracking & Multi-Candidate Stream Warm-up (Unconstrained Alternative)

* **Mechanism**:
  * Tracks cursor velocity vectors on desktop and scroll velocity/direction on mobile.
  * Predictively preloads video metadata for the next 2 candidate reels ahead of scroll trajectory.
  * Allows active video preloading across multiple elements before visibility threshold is reached.
* **Benefits**:
  * Achieves absolute lowest latency for predictive scroll arrivals.
* **Costs**:
  * High CPU and thread consumption due to constant pointer/scroll vector calculation.
* **Risks**:
  * **Violates core constraints**: Regresses TBT/LCP, increases mobile network data usage, violates Save-Data/2G safeguards, and risks concurrent video stream conflicts.

---

## 3. Categorized Options Summary

| Category | Option |
| :--- | :--- |
| **Smallest Pragmatic Option** | **Option C**: Micro-Dwell Fast-Path with Intent-Based Preload (Zero DOM changes). |
| **Strongest Long-Term Option** | **Option B**: Decoupled Card Surface with Intent Engine (Clean semantic split). |
| **Low-Cost Experiment** | **Option C**: Fast-path jump handler test targeting Screening Strip interactions. |
| **Contrarian Interpretation** | The perceived "slowness" is 90% driven by the artificial 700ms/1400ms dwell timer following an explicit user action. Bypassing this timer on explicit intent solves user perception without requiring complex structural changes or network prefetching. |
| **Unconstrained Alternative** | **Option D**: Vector-Based Velocity Tracking & Multi-Candidate Stream Warm-up. |

---

## 4. Recommendation and Falsification

### Recommendation: Option C / A Hybrid (Intent Fast-Path with Touch Guardrails)

Implement explicit intent short-circuiting while retaining the baseline DOM structure:

1. **Screening Strip Activation**:
   When a user clicks/taps a Screening Strip card, the target large card is immediately assigned playback ownership, bypassing the 700ms dwell. `preload="metadata"` is set instantly, followed by `play()`.
2. **Desktop Hover & Focus**:
   `pointerenter` and `focusin` on a large card trigger a 50ms micro-dwell (to filter fast pointer traversal). Upon completion, `preload="metadata"` is set and `play()` is called. `pointerleave` / `focusout` releases ownership and pauses playback.
3. **Mobile Touch & Scroll Safety**:
   `touchstart` on a large card sets `preload="metadata"`. If a `touchmove` delta exceeds 10px in any direction, intent is cancelled (scroll gesture preserved). If `touchend` occurs without scroll delta on the media canvas, `preventDefault()` stops external navigation and toggles preview playback. Taps on card text/CTA preserve default anchor navigation.
4. **Safety & Policy Guardrails**:
   * Single-owner arbitration remains 100% enforced across all triggers.
   * Hero LCP Protection: Intent preloads are suppressed until `document.readyState === 'complete'` or initial Hero LCP image finishes loading.
   * `Save-Data`, slow 2G/3G, and `prefers-reduced-motion` settings unconditionally disable intent preloading/playback.

### Falsification Criteria

This recommendation shall be deemed invalid and discarded if:

1. Synthetic testing shows that calling `preload="metadata"` on explicit intent degrades Hero image LCP by > 50ms on 1.6Mbps connections.
2. Mobile user testing reveals > 1% accidental external link navigations during normal vertical scroll gestures across Featured cards.
3. Browser auto-play policy blocks muted `play()` calls initiated from `pointerenter` or `touchstart` events on target mobile webviews.

---

## 5. Test and Measurement Contract

### Synthetic Test Bench Baseline
* **Environment**: Chromium Mobile Emulation (390x844, DPR 3.0).
* **Network Throttling**: Range-capable server, 1.6Mbps Download, 150ms RTT, cache disabled.

### Contract Metrics Matrix

| Evaluation Scenario | Baseline Measurement | Target Metric | Hard Limit / Constraint |
| :--- | :--- | :--- | :--- |
| **Screening Strip Jump -> `playing` (Cold)** | 6,112.8 ms | **< 2,200.0 ms** | Zero playback failure/hang |
| **Screening Strip Jump -> `playing` (Warm)** | 1,805.7 ms | **< 1,100.0 ms** | Must non-blocking smooth scroll |
| **Desktop Hover -> `playing`** | 1,400.0 ms + fetch (~3.2s) | **< 1,200.0 ms** total | Single owner enforced |
| **Initial Page Load Video Requests** | 0 requests | **0 requests** | Must remain 0 prior to intent |
| **Hero Image LCP Impact** | Baseline | **0 ms regression** | Max +0 ms delta |
| **Total Blocking Time (TBT)** | Baseline | **< +10 ms delta** | No main-thread scroll jank |
| **Accidental Navigation on Scroll** | 0 | **0** | Absolute 0 on `touchmove` |

### Automated Test Suite Contracts

1. **Strip Jump Contract**:
   * *Trigger*: Simulated tap on Screening Strip Card 2.
   * *Assert*: Target large card `video.preload` changes to `'metadata'` within 16ms.
   * *Assert*: Target large card `video.play()` called within 32ms.
   * *Assert*: Previous playing reel enters `paused` state immediately.
2. **Desktop Hover/Focus Contract**:
   * *Trigger*: `pointerenter` on large card media surface.
   * *Assert*: Playback initiates after 50ms micro-dwell.
   * *Trigger*: `pointerleave`.
   * *Assert*: Playback pauses and video resets to frame 0 within 16ms.
3. **Mobile Touch Scroll Safety Contract**:
   * *Trigger*: `touchstart` at `(y=500)` -> `touchmove` at `(y=480)` -> `touchend`.
   * *Assert*: Anchor navigation does NOT trigger (`location.href` unchanged).
   * *Assert*: Video does NOT enter forced playing state; intent state cancels cleanly.
4. **Save-Data Guardrail Contract**:
   * *Trigger*: Emulate `Save-Data: on` header or `prefers-reduced-motion: reduce`.
   * *Action*: Fire Screening Strip tap and card hover events.
   * *Assert*: Video `preload` remains `'none'`; no network video requests emitted.

---

## 6. P0 / P1 Risks

### P0 Risks (Critical Product / UX Failure)

* **P0-1: Accidental External Navigation during Mobile Scroll**
  * *Risk*: Intercepting touch events on media surface anchors can accidentally trigger `window.open` / anchor navigation when users intend to scroll vertically.
  * *Mitigation*: Strictly track touch displacement. Any touch movement exceeding 10px instantly disarms the preview tap handler and allows natural browser touch scrolling without triggering navigation.
* **P0-2: Hero LCP Bandwidth Starvation**
  * *Risk*: Triggering early video metadata/header fetches during cold page load can compete with critical Hero image assets on 1.6Mbps connections.
  * *Mitigation*: Enforce a strict network gate: explicit intent preloads are queue-deferred until `window.load` fires or Hero image load completes.

### P1 Risks (Performance & State Stability)

* **P1-1: Async Play Promise Collision (`AbortError`)**
  * *Risk*: Rapidly hovering over multiple desktop cards or switching Screening Strip tabs causes overlapping `play()` and `pause()` promises, leading to unhandled browser promise rejections.
  * *Mitigation*: Wrap all `video.play()` invocations in a promise-aware state manager that chains `.then()` / `.catch()` rejections safely and guarantees `.pause()` is invoked only after the play promise resolves.
* **P1-2: Keyboard Accessibility & Focus Indication**
  * *Risk*: Short-circuiting hover/focus events might confuse screen readers or interrupt natural keyboard tab order across card links.
  * *Mitigation*: Retain standard native focus outlines. Ensure keyboard `Tab` navigation triggers preview visual feedback without stealing key focus from the canonical link anchor.