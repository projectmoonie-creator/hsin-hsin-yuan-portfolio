#!/usr/bin/env python3
import argparse
import json
import statistics
from pathlib import Path

from playwright.sync_api import sync_playwright


NETWORK = {
    "offline": False,
    "latency": 150,
    "downloadThroughput": int(1.6 * 1024 * 1024 / 8),
    "uploadThroughput": int(750 * 1024 / 8),
    "connectionType": "cellular4g",
}


INIT_SCRIPT = r"""
window.__intentProbe = {
  cls: 0,
  longTaskBlocking: 0,
  lcp: null,
  playCalls: [],
};
const originalPlay = HTMLMediaElement.prototype.play;
HTMLMediaElement.prototype.play = function (...args) {
  if (this.matches?.('[data-featured-reel-video]')) {
    window.__intentProbe.playCalls.push({
      at: performance.now(),
      id: this.closest('.work-panel')?.id || '',
    });
  }
  return originalPlay.apply(this, args);
};
new PerformanceObserver((list) => {
  const entries = list.getEntries();
  if (entries.length) window.__intentProbe.lcp = entries.at(-1).startTime;
}).observe({ type: 'largest-contentful-paint', buffered: true });
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) window.__intentProbe.cls += entry.value;
  }
}).observe({ type: 'layout-shift', buffered: true });
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    window.__intentProbe.longTaskBlocking += Math.max(0, entry.duration - 50);
  }
}).observe({ type: 'longtask', buffered: true });
"""


def rounded_median(values):
    usable = [value for value in values if isinstance(value, (int, float))]
    return round(statistics.median(usable), 1) if usable else None


def run_once(browser, url, scenario, target_id, run_index, lead_ms, observe_ms):
    context = browser.new_context(
        viewport={"width": 390, "height": 844},
        device_scale_factor=3,
        is_mobile=True,
        has_touch=True,
        locale="en-US",
        user_agent=(
            "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) "
            "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 "
            "Mobile/15E148 Safari/604.1"
        ),
    )
    context.add_init_script(INIT_SCRIPT)
    page = context.new_page()
    cdp = context.new_cdp_session(page)
    cdp.send("Network.enable")
    cdp.send("Network.setCacheDisabled", {"cacheDisabled": True})
    cdp.send("Network.emulateNetworkConditions", NETWORK)

    requests = {}

    def on_request(event):
        request = event.get("request", {})
        request_url = request.get("url", "")
        if "/assets/showreel/" not in request_url or not request_url.endswith(".mp4"):
            return
        requests[event["requestId"]] = {
            "url": request_url,
            "timestamp": event.get("timestamp"),
            "wall_time": event.get("wallTime"),
            "bytes": 0,
        }

    def on_response(event):
        record = requests.get(event.get("requestId"))
        if not record:
            return
        response = event.get("response", {})
        record.update(
            {
                "response_timestamp": event.get("timestamp"),
                "status": response.get("status"),
                "mime": response.get("mimeType"),
                "from_disk_cache": response.get("fromDiskCache", False),
            }
        )

    def on_data(event):
        record = requests.get(event.get("requestId"))
        if record:
            record["bytes"] += event.get("encodedDataLength", 0)

    cdp.on("Network.requestWillBeSent", on_request)
    cdp.on("Network.responseReceived", on_response)
    cdp.on("Network.dataReceived", on_data)

    console_errors = []
    page_errors = []
    page.on(
        "console",
        lambda message: console_errors.append(message.text)
        if message.type == "error"
        else None,
    )
    page.on("pageerror", lambda error: page_errors.append(str(error)))

    page.goto(url, wait_until="domcontentloaded", timeout=60000)
    page.wait_for_selector(f"#{target_id} [data-featured-reel-video]", timeout=30000)
    time_origin = page.evaluate("performance.timeOrigin")
    page.evaluate(
        r"""
        (targetId) => {
          const video = document.querySelector(`#${targetId} [data-featured-reel-video]`);
          window.__intentProbe.videoEvents = [];
          for (const type of ['loadedmetadata', 'loadeddata', 'canplay', 'playing', 'pause', 'ended', 'waiting', 'stalled', 'abort', 'emptied']) {
            video.addEventListener(type, () => window.__intentProbe.videoEvents.push({
              type,
              at: performance.now(),
              currentTime: video.currentTime,
              readyState: video.readyState,
            }));
          }
        }
        """,
        target_id,
    )

    activation_start = None
    timed_out = False
    if scenario == "passive":
        page.wait_for_timeout(observe_ms)
    else:
        if lead_ms:
            page.wait_for_timeout(lead_ms)
        if scenario == "screening":
            activation_start = page.evaluate("performance.now()")
            page.evaluate(
                r"""
                (targetId) => {
                  const card = document.querySelector(
                    `.watch-loop-sequence:not([aria-hidden="true"]) .watch-loop-card[href="#${targetId}"]`
                  );
                  card.dispatchEvent(new PointerEvent('pointerdown', {
                    bubbles: true, pointerType: 'touch', pointerId: 41,
                    clientX: 120, clientY: 300,
                  }));
                  card.dispatchEvent(new PointerEvent('pointerup', {
                    bubbles: true, pointerType: 'touch', pointerId: 41,
                    clientX: 120, clientY: 300,
                  }));
                  card.click();
                }
                """,
                target_id,
            )
        elif scenario == "media-tap":
            page.evaluate(
                "targetId => document.querySelector(`#${targetId} .media-frame`).scrollIntoView({block:'center', behavior:'instant'})",
                target_id,
            )
            page.wait_for_timeout(50)
            activation_start = page.evaluate("performance.now()")
            page.evaluate(
                r"""
                (targetId) => {
                  const media = document.querySelector(`#${targetId} .media-frame`);
                  media.dispatchEvent(new PointerEvent('pointerdown', {
                    bubbles: true, pointerType: 'touch', pointerId: 42,
                    clientX: 120, clientY: 300,
                  }));
                  media.dispatchEvent(new PointerEvent('pointerup', {
                    bubbles: true, pointerType: 'touch', pointerId: 42,
                    clientX: 121, clientY: 302,
                  }));
                  media.click();
                }
                """,
                target_id,
            )
        else:
            raise ValueError(f"unknown scenario: {scenario}")

        try:
            page.wait_for_function(
                "targetId => document.querySelector(`#${targetId} [data-featured-reel-video]`).classList.contains('is-playing')",
                arg=target_id,
                timeout=30000,
            )
            page.wait_for_timeout(observe_ms)
        except Exception as error:
            if "Timeout" not in type(error).__name__:
                raise
            timed_out = True

    browser_metrics = page.evaluate(
        r"""
        (targetId) => {
          const video = document.querySelector(`#${targetId} [data-featured-reel-video]`);
          const hero = document.querySelector('.hero-media-image');
          const heroEntry = performance.getEntriesByName(hero?.currentSrc || '')[0];
          return {
            cls: window.__intentProbe.cls,
            lcp: window.__intentProbe.lcp,
            tbt: window.__intentProbe.longTaskBlocking,
            playCalls: window.__intentProbe.playCalls,
            videoEvents: window.__intentProbe.videoEvents || [],
            currentTime: video.currentTime,
            heroResponseEnd: heroEntry?.responseEnd ?? null,
          };
        }
        """,
        target_id,
    )

    request_rows = []
    for record in requests.values():
        request_at = (
            record["wall_time"] * 1000 - time_origin
            if record.get("wall_time") is not None
            else None
        )
        response_at = None
        if request_at is not None and record.get("response_timestamp") is not None:
            response_at = request_at + (
                record["response_timestamp"] - record["timestamp"]
            ) * 1000
        request_rows.append(
            {
                "url": record["url"],
                "request_at": round(request_at, 1) if request_at is not None else None,
                "response_at": round(response_at, 1) if response_at is not None else None,
                "bytes": record["bytes"],
                "status": record.get("status"),
                "mime": record.get("mime"),
                "from_disk_cache": record.get("from_disk_cache", False),
            }
        )

    slow_events = browser_metrics["videoEvents"]
    playing = next((event for event in slow_events if event["type"] == "playing"), None)
    play_call = next(
        (
            call
            for call in browser_metrics["playCalls"]
            if call["id"] == target_id
            and (activation_start is None or call["at"] >= activation_start)
        ),
        None,
    )
    first_request = min(request_rows, key=lambda row: row["request_at"] or float("inf"), default=None)
    first_response = min(
        (row for row in request_rows if row["response_at"] is not None),
        key=lambda row: row["response_at"],
        default=None,
    )

    result = {
        "run": run_index,
        "scenario": scenario,
        "target": target_id,
        "lead_ms": lead_ms,
        "network": NETWORK,
        "activation_start": round(activation_start, 1) if activation_start is not None else None,
        "play_call_ms": round(play_call["at"] - activation_start, 1)
        if play_call and activation_start is not None
        else None,
        "playing_ms": round(playing["at"] - activation_start, 1)
        if playing and activation_start is not None
        else None,
        "first_video_request_ms": round(first_request["request_at"] - activation_start, 1)
        if first_request and activation_start is not None
        else None,
        "first_video_response_ms": round(first_response["response_at"] - activation_start, 1)
        if first_response and activation_start is not None
        else None,
        "video_bytes": sum(row["bytes"] for row in request_rows),
        "waiting_events": len([event for event in slow_events if event["type"] == "waiting"]),
        "pause_events": len([event for event in slow_events if event["type"] == "pause"]),
        "video_events": slow_events,
        "current_time": round(browser_metrics["currentTime"], 3),
        "hero_response_end": browser_metrics["heroResponseEnd"],
        "lcp": browser_metrics["lcp"],
        "tbt": browser_metrics["tbt"],
        "cls": browser_metrics["cls"],
        "timed_out": timed_out,
        "requests": request_rows,
        "console_errors": console_errors,
        "page_errors": page_errors,
    }
    context.close()
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True)
    parser.add_argument(
        "--scenario",
        choices=["screening", "media-tap", "passive"],
        required=True,
    )
    parser.add_argument("--target", default="slow-steps")
    parser.add_argument("--runs", type=int, default=3)
    parser.add_argument("--lead-ms", type=int, default=0)
    parser.add_argument("--observe-ms", type=int, default=3000)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    results = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        for run_index in range(1, args.runs + 1):
            result = run_once(
                browser,
                args.url,
                args.scenario,
                args.target,
                run_index,
                args.lead_ms,
                args.observe_ms,
            )
            results.append(result)
            print(json.dumps(result, ensure_ascii=False), flush=True)
        browser.close()

    summary = {
        "scenario": args.scenario,
        "target": args.target,
        "runs": args.runs,
        "lead_ms": args.lead_ms,
        "play_call_median_ms": rounded_median([row["play_call_ms"] for row in results]),
        "playing_median_ms": rounded_median([row["playing_ms"] for row in results]),
        "first_video_request_median_ms": rounded_median(
            [row["first_video_request_ms"] for row in results]
        ),
        "first_video_response_median_ms": rounded_median(
            [row["first_video_response_ms"] for row in results]
        ),
        "video_bytes_median": rounded_median([row["video_bytes"] for row in results]),
        "lcp_median_ms": rounded_median([row["lcp"] for row in results]),
        "tbt_median_ms": rounded_median([row["tbt"] for row in results]),
        "cls_median": rounded_median([row["cls"] for row in results]),
        "timeouts": len([row for row in results if row["timed_out"]]),
    }
    payload = {"summary": summary, "results": results}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"summary": summary}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
