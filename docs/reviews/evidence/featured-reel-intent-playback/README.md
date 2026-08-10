# Featured Reel intent playback evidence

Date: 2026-08-11

## Conditions

`probe.py` runs local built output through a range-capable server in headless
Chromium at 390x844/DPR3, disabled cache, 150ms RTT, and 1.6Mbps download.
Every reported comparison uses three cold runs and the median. These are lab
measurements, not CrUX or a claim about every visitor.

## Retained result

| Scenario | Before visible `playing` | After visible `playing` | Playback request | LCP | TBT / CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| Immediate Slow Steps tap | 6049.8ms | 5905.7ms | 656.4ms → 2.9ms | 1220ms → 1220ms | 0 / 0 |
| Slow Steps tap after 1500ms at top | 6049.8ms baseline | 4389.9ms | warm begins 1403.1ms before tap | 1216ms | 0 / 0 |
| Tech Dreamers Screening action | baseline did not preserve exact target ownership | 6350.1ms, 0/3 timeouts | exact request in 1.8ms | 1228ms | 0 / 0 |

The explicit gesture removes the software hold but cannot remove physical
bandwidth delay. The two-viewport passive experiment is retained because it
loads only one 130,500-byte metadata range after the Hero. Its MP4 request
starts around 1.71s, after the measured Hero LCP around 1.22s; no causal Hero
contention is observed. Passive LCP medians are 1172ms before and 1216ms after,
with overlapping individual runs; this 44ms lab variation is not attributed
to the later MP4 request. The rejected one-viewport experiment requested zero
MP4 bytes and provided no benefit.

Continuous after-play observation transfers more bytes than the former reset
path, so total probe bytes are not presented as a delivery-size reduction.
The verified mobile derivative package remains unchanged.

## Functional matrix

`qa.py` and `browser-qa.json` cover nine local browser cases:

- mobile linked media first tap previews and second tap opens the canonical
  TaiwanPlus destination;
- touch movement starts no playback and opens no destination;
- the Tech Dreamers Screening card requests only its exact Featured reel;
- desktop hover and keyboard focus request preview;
- passive mobile playback still begins after the 35% plus 700ms contract
  (710.9ms observed);
- reduced motion, Save-Data, 2G, and no-JavaScript make zero MP4 requests.

All cases have zero Contact POST, console error, page error, or horizontal
overflow finding. Real iPhone Safari, Low Power Mode, and changing networks
remain producer-device checks before any Production decision.

## Files

- `before-*.json`: frozen baseline measurements.
- `after-*-final.json`: retained implementation measurements.
- `after-passive-100pct.json`: rejected one-viewport warm experiment.
- `browser-qa.json`: functional browser matrix.
- `probe.py`, `qa.py`: repeatable measurement and interaction harnesses.
