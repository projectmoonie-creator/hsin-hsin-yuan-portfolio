# Featured Reel Mobile Performance Evidence

Baseline: detached local `bb08d51`; candidate: local
`codex/featured-reel-mobile-performance`. No Preview or deployment was used.

Under identical 390×844, DPR3, cache-disabled, 150ms/1.6Mbps conditions, three
cold runs per side show the immediate first `playing` median fall from 3471ms
to 1791ms. With a 1500ms proximity lead, it falls from 3469ms to 708ms—within
measurement noise of the approved 700ms hold. Ten-second playback changes from
four `waiting` events / 1239ms stalled to zero in both candidate modes.

The six mobile derivatives total 16,708,502 bytes versus 60,135,762 bytes for
the retained desktop fallbacks, a 72.2% reduction. Slow Steps 640×360 and
960×540 candidates were compared at DPR2/DPR3; 960×540 was selected because
its DPR3 VMAF was 84.21 versus 80.42 while its measured average bitrate remained
about 611kbps.

Three Lighthouse 13.4.1 mobile-simulate runs per side stayed at Performance
0.82, TBT 0, CLS 0, and LCP 4951.662→4951.728ms. Hero priority was `High` in
all six runs and initial page load requested zero Featured MP4s. The added HTML
and JavaScript increased page-load transfer median by 4,739 bytes.

The no-JavaScript mobile screenshot is byte-identical before/after. Six-case
English/Chinese desktop/tablet/mobile/reduced-motion/no-JavaScript QA passed
geometry, responsive source selection, keyboard, overflow, error, and zero
Contact POST checks. Figma export has no tracked drift.

These are Chromium laboratory results, not CrUX. Real Mobile Safari, Low Power
Mode, and the producer's target iPhone remain open before Production. Native
metadata preload is a hint: the observed 130,500-byte warm is not promised by
the platform on every browser.
