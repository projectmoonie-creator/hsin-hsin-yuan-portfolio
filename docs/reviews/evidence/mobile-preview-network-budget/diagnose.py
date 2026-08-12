#!/usr/bin/env python3
"""Matched cold-cache mobile diagnosis for the bounded network-budget package."""

import argparse
import copy
import hashlib
import json
import statistics
import subprocess
from pathlib import Path

from playwright.sync_api import sync_playwright


NETWORK = {
    "offline": False,
    "latency": 150,
    "downloadThroughput": int(1.6 * 1024 * 1024 / 8),
    "uploadThroughput": int(750 * 1024 / 8),
    "connectionType": "cellular4g",
}
VIEWPORT = {"width": 390, "height": 844}
DEVICE_SCALE_FACTOR = 3
CPU_THROTTLE_RATE = 4
TARGET_ID = "slow-steps"
TARGET_MOBILE = "/assets/showreel/mobile/slow-steps-card-reel-mobile.mp4"
TARGET_FALLBACK = "/assets/showreel/slow-steps-card-reel.mp4"


INIT_SCRIPT = r"""
(() => {
  const state = window.__mobilePreviewBudget = {
    lcp: null,
    cls: 0,
    longTaskBlocking: 0,
    loadCalls: [],
    playCalls: [],
    pauseCalls: [],
    videoEvents: [],
    attributeChanges: [],
    revealEvents: [],
    inputEvents: [],
    harnessIntents: [],
    initialVideos: [],
  };
  const reelId = (video) => video?.closest?.('.work-panel')?.id || '';
  const videoState = (video) => ({
    at: performance.now(),
    id: reelId(video),
    preload: video.preload,
    currentSrc: video.currentSrc,
    paused: video.paused,
    readyState: video.readyState,
    networkState: video.networkState,
    currentTime: video.currentTime,
  });
  const originalLoad = HTMLMediaElement.prototype.load;
  HTMLMediaElement.prototype.load = function (...args) {
    if (this.matches?.('[data-featured-reel-video]')) {
      state.loadCalls.push({ ...videoState(this), stack: new Error().stack || '' });
    }
    return originalLoad.apply(this, args);
  };
  const originalPlay = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function (...args) {
    if (this.matches?.('[data-featured-reel-video]')) {
      state.playCalls.push({ ...videoState(this), stack: new Error().stack || '' });
    }
    return originalPlay.apply(this, args);
  };
  const originalPause = HTMLMediaElement.prototype.pause;
  HTMLMediaElement.prototype.pause = function (...args) {
    if (this.matches?.('[data-featured-reel-video]')) {
      state.pauseCalls.push({ ...videoState(this), stack: new Error().stack || '' });
    }
    return originalPause.apply(this, args);
  };

  for (const type of ['loadedmetadata', 'loadeddata', 'canplay', 'playing', 'pause', 'waiting', 'stalled', 'abort', 'emptied', 'error']) {
    document.addEventListener(type, (event) => {
      const video = event.target;
      if (!video?.matches?.('[data-featured-reel-video]')) return;
      state.videoEvents.push({ type, ...videoState(video) });
    }, true);
  }
  for (const type of ['pointerdown', 'pointerup', 'touchstart', 'wheel', 'keydown', 'focusin', 'scroll']) {
    const target = type === 'scroll' ? window : document;
    target.addEventListener(type, (event) => {
      state.inputEvents.push({
        type,
        at: performance.now(),
        trusted: event.isTrusted,
        pointerType: event.pointerType || null,
        target: event.target?.closest?.('[id]')?.id || event.target?.tagName || '',
        scrollY: window.scrollY,
      });
    }, true);
  }
  try {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length) state.lcp = entries.at(-1).startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) state.cls += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        state.longTaskBlocking += Math.max(0, entry.duration - 50);
      }
    }).observe({ type: 'longtask', buffered: true });
  } catch (error) {
    state.observerError = String(error);
  }

  addEventListener('DOMContentLoaded', () => {
    const videos = Array.from(document.querySelectorAll('[data-featured-reel-video]'));
    state.initialVideos = videos.map((video) => ({
      ...videoState(video),
      poster: video.poster,
      sources: Array.from(video.querySelectorAll('source')).map((source) => ({
        src: source.getAttribute('src'),
        media: source.media || '',
        mediaMatches: source.media ? matchMedia(source.media).matches : true,
        type: source.type,
      })),
    }));
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        const target = record.target;
        if (target.matches?.('[data-featured-reel-video]')) {
          state.attributeChanges.push({
            at: performance.now(),
            id: reelId(target),
            attribute: record.attributeName,
            oldValue: record.oldValue,
            value: target.getAttribute(record.attributeName),
            preload: target.preload,
            currentSrc: target.currentSrc,
          });
          if (record.attributeName === 'class' && target.classList.contains('is-playing')) {
            state.revealEvents.push({ at: performance.now(), id: reelId(target), via: 'video-class' });
          }
        } else if (target.matches?.('.media-frame')) {
          if (record.attributeName === 'class' && target.classList.contains('is-reel-playing')) {
            state.revealEvents.push({
              at: performance.now(),
              id: target.closest('.work-panel')?.id || '',
              via: 'frame-class',
            });
          }
        }
      }
    });
    for (const video of videos) {
      observer.observe(video, { attributes: true, attributeOldValue: true, attributeFilter: ['class', 'preload', 'src'] });
      const frame = video.closest('.media-frame');
      if (frame) observer.observe(frame, { attributes: true, attributeOldValue: true, attributeFilter: ['class'] });
    }
  }, { once: true });
})();
"""


def sha256(path):
    digest = hashlib.sha256()
    with open(path, "rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def git(*args):
    return subprocess.run(
        ["git", *args], check=True, text=True, capture_output=True
    ).stdout.strip()


def rounded(value):
    return round(value, 1) if isinstance(value, (int, float)) else None


def median(rows, key):
    values = [row.get(key) for row in rows if isinstance(row.get(key), (int, float))]
    return round(statistics.median(values), 1) if values else None


def header_value(headers, name):
    lowered = name.lower()
    for key, value in (headers or {}).items():
        if key.lower() == lowered:
            return value
    return None


def relative_time(record, timestamp, time_origin):
    if timestamp is None or record.get("timestamp") is None or record.get("wall_time") is None:
        return None
    request_at = record["wall_time"] * 1000 - time_origin
    return request_at + (timestamp - record["timestamp"]) * 1000


def request_rows(requests, time_origin, snapshot=None):
    rows = []
    if snapshot is None:
        snapshot = requests
    for request_id, record in snapshot.items():
        request_at = record.get("wall_time", 0) * 1000 - time_origin
        first_data_at = relative_time(record, record.get("first_data_timestamp"), time_origin)
        response_at = relative_time(record, record.get("response_timestamp"), time_origin)
        loading_finished_at = relative_time(record, record.get("loading_finished_timestamp"), time_origin)
        request_headers = record.get("request_headers", {})
        response_headers = record.get("response_headers", {})
        rows.append({
            "request_id": request_id,
            "url": record.get("url"),
            "resource_type": record.get("resource_type"),
            "request_at": rounded(request_at),
            "response_headers_at": rounded(response_at),
            "first_data_at": rounded(first_data_at),
            "request_to_first_data_ms": rounded(first_data_at - request_at) if first_data_at is not None else None,
            "loading_finished_at": rounded(loading_finished_at),
            "request_range": header_value(request_headers, "range"),
            "status": record.get("status"),
            "content_range": header_value(response_headers, "content-range"),
            "content_length": header_value(response_headers, "content-length"),
            "data_received_bytes": record.get("data_received_bytes", 0),
            "encoded_data_received_bytes": record.get("encoded_data_received_bytes", 0),
            "loading_finished_encoded_bytes": record.get("loading_finished_encoded_bytes"),
            "from_disk_cache": record.get("from_disk_cache", False),
            "from_service_worker": record.get("from_service_worker", False),
            "failed": record.get("failed"),
            "canceled": record.get("canceled", False),
            "initiator": record.get("initiator"),
        })
    return sorted(rows, key=lambda row: row["request_at"] if row["request_at"] is not None else float("inf"))


def target_requests(rows):
    return [row for row in rows if TARGET_MOBILE in row["url"] or TARGET_FALLBACK in row["url"]]


def total_encoded(rows):
    return sum(row.get("encoded_data_received_bytes") or 0 for row in rows)


def sample_video(page):
    return page.evaluate(
        r"""
        (targetId) => {
          const panel = document.getElementById(targetId);
          const frame = panel?.querySelector('.media-frame');
          const video = panel?.querySelector('[data-featured-reel-video]');
          const rect = frame?.getBoundingClientRect();
          const frameStyle = frame ? getComputedStyle(frame) : null;
          const videoStyle = video ? getComputedStyle(video) : null;
          return {
            at: performance.now(),
            scrollY: window.scrollY,
            frameVisible: Boolean(rect && rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth),
            frameRect: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null,
            backgroundImage: frameStyle?.backgroundImage || '',
            videoOpacity: videoStyle?.opacity || '',
            videoClass: video?.className || '',
            frameClass: frame?.className || '',
            poster: video?.poster || '',
            preload: video?.preload || '',
            currentSrc: video?.currentSrc || '',
            paused: video?.paused,
            readyState: video?.readyState,
            networkState: video?.networkState,
            sources: Array.from(video?.querySelectorAll('source') || []).map((source) => ({
              src: source.getAttribute('src'),
              media: source.media || '',
              mediaMatches: source.media ? matchMedia(source.media).matches : true,
            })),
          };
        }
        """,
        TARGET_ID,
    )


def run_once(browser, url, run_index, pre_intent_ms, after_playing_ms):
    context = browser.new_context(
        viewport=VIEWPORT,
        device_scale_factor=DEVICE_SCALE_FACTOR,
        is_mobile=True,
        has_touch=True,
        locale="en-US",
    )
    context.add_init_script(INIT_SCRIPT)
    page = context.new_page()
    cdp = context.new_cdp_session(page)
    cdp.send("Network.enable")
    cdp.send("Network.setCacheDisabled", {"cacheDisabled": True})
    cdp.send("Network.setBypassServiceWorker", {"bypass": True})
    cdp.send("Network.emulateNetworkConditions", NETWORK)
    cdp.send("Emulation.setCPUThrottlingRate", {"rate": CPU_THROTTLE_RATE})
    cdp.send("Storage.clearDataForOrigin", {"origin": url.split("/en/")[0], "storageTypes": "all"})

    requests = {}

    def on_request(event):
        request = event.get("request", {})
        request_url = request.get("url", "")
        if "/assets/showreel/" not in request_url or ".mp4" not in request_url:
            return
        requests[event["requestId"]] = {
            "url": request_url,
            "timestamp": event.get("timestamp"),
            "wall_time": event.get("wallTime"),
            "resource_type": event.get("type"),
            "request_headers": request.get("headers", {}),
            "initiator": event.get("initiator"),
            "data_received_bytes": 0,
            "encoded_data_received_bytes": 0,
        }

    def on_response(event):
        record = requests.get(event.get("requestId"))
        if not record:
            return
        response = event.get("response", {})
        record.update({
            "response_timestamp": event.get("timestamp"),
            "status": response.get("status"),
            "response_headers": response.get("headers", {}),
            "from_disk_cache": response.get("fromDiskCache", False),
            "from_service_worker": response.get("fromServiceWorker", False),
        })

    def on_data(event):
        record = requests.get(event.get("requestId"))
        if not record:
            return
        if record.get("first_data_timestamp") is None:
            record["first_data_timestamp"] = event.get("timestamp")
        record["data_received_bytes"] += event.get("dataLength", 0)
        record["encoded_data_received_bytes"] += event.get("encodedDataLength", 0)

    def on_finished(event):
        record = requests.get(event.get("requestId"))
        if record:
            record["loading_finished_timestamp"] = event.get("timestamp")
            record["loading_finished_encoded_bytes"] = event.get("encodedDataLength")

    def on_failed(event):
        record = requests.get(event.get("requestId"))
        if record:
            record["failed"] = event.get("errorText")
            record["canceled"] = event.get("canceled", False)

    cdp.on("Network.requestWillBeSent", on_request)
    cdp.on("Network.responseReceived", on_response)
    cdp.on("Network.dataReceived", on_data)
    cdp.on("Network.loadingFinished", on_finished)
    cdp.on("Network.loadingFailed", on_failed)

    console_errors = []
    page_errors = []
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
    page.on("pageerror", lambda error: page_errors.append(str(error)))

    page.goto(url, wait_until="domcontentloaded", timeout=60000)
    page.wait_for_selector(f"#{TARGET_ID} [data-featured-reel-video]", timeout=30000)
    time_origin = page.evaluate("performance.timeOrigin")
    load_complete_at = page.evaluate("performance.now()")
    initial_state = sample_video(page)
    page.wait_for_timeout(pre_intent_ms)
    pre_intent_at = page.evaluate("performance.now()")
    pre_intent_requests = copy.deepcopy(requests)
    pre_intent_state = sample_video(page)
    pre_intent_probe = page.evaluate("JSON.parse(JSON.stringify(window.__mobilePreviewBudget))")

    page.evaluate(
        "window.__mobilePreviewBudget.harnessIntents.push({type:'scroll-to-target', at:performance.now()})"
    )
    page.evaluate(
        "targetId => document.getElementById(targetId).scrollIntoView({block:'center', behavior:'instant'})",
        TARGET_ID,
    )
    page.wait_for_timeout(50)
    poster_state = sample_video(page)
    poster_visible_at = poster_state["at"] if poster_state["frameVisible"] and poster_state["backgroundImage"] != "none" else None
    tap_at = page.evaluate(
        "window.__mobilePreviewBudget.harnessIntents.push({type:'stationary-touch', at:performance.now()}); performance.now()"
    )
    box = page.locator(f"#{TARGET_ID} .media-frame").bounding_box()
    if not box:
        raise RuntimeError("Slow Steps media frame has no touchable bounding box")
    page.touchscreen.tap(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)

    timed_out = False
    try:
        page.wait_for_function(
            "targetId => document.querySelector(`#${targetId} [data-featured-reel-video]`).classList.contains('is-playing')",
            arg=TARGET_ID,
            timeout=30000,
        )
    except Exception as error:
        if "Timeout" not in type(error).__name__:
            raise
        timed_out = True
    playing_observed_at = page.evaluate("performance.now()")
    requests_at_playing = copy.deepcopy(requests)
    state_at_playing = sample_video(page)
    page.wait_for_timeout(after_playing_ms)
    final_state = sample_video(page)
    probe = page.evaluate("JSON.parse(JSON.stringify(window.__mobilePreviewBudget))")
    final_requests = request_rows(requests, time_origin)
    pre_rows = request_rows(requests, time_origin, pre_intent_requests)
    playing_rows = request_rows(requests, time_origin, requests_at_playing)
    if any(row["request_at"] > pre_intent_at + 5 for row in pre_rows):
        raise AssertionError("pre-intent request snapshot contains a later request")

    target_events = [event for event in probe["videoEvents"] if event["id"] == TARGET_ID]
    event_times = {}
    for event_type in ["loadedmetadata", "canplay", "playing"]:
        event = next((row for row in target_events if row["type"] == event_type), None)
        event_times[event_type] = event["at"] if event else None
    reveal = next((row for row in probe["revealEvents"] if row["id"] == TARGET_ID), None)
    reveal_at = reveal["at"] if reveal else None
    pre_target = target_requests(pre_rows)
    playing_target = target_requests(playing_rows)
    final_target = target_requests(final_requests)
    first_target_request = final_target[0] if final_target else None
    first_post_intent_request = next((row for row in final_target if row["request_at"] >= tap_at), None)
    pre_play_calls = [row for row in pre_intent_probe["playCalls"] if row["id"] == TARGET_ID]
    pre_load_calls = [row for row in pre_intent_probe["loadCalls"] if row["id"] == TARGET_ID]
    pre_mobile = [row for row in pre_target if TARGET_MOBILE in row["url"]]
    pre_fallback = [row for row in pre_target if TARGET_FALLBACK in row["url"] and TARGET_MOBILE not in row["url"]]

    if pre_play_calls:
        classification = "passive-ownership-before-intent"
    elif pre_mobile and pre_fallback:
        classification = "dual-source-before-intent"
    elif pre_target and any(call["preload"] == "metadata" for call in pre_load_calls):
        classification = "single-source-proximity-warm-before-intent"
    elif pre_target:
        classification = "premature-request-without-observed-play-or-metadata-load"
    else:
        classification = "no-mp4-before-intent"

    result = {
        "run": run_index,
        "load_complete_at": rounded(load_complete_at),
        "pre_intent_at": rounded(pre_intent_at),
        "tap_at": rounded(tap_at),
        "poster_visible_at": rounded(poster_visible_at),
        "loadedmetadata_at": rounded(event_times["loadedmetadata"]),
        "canplay_at": rounded(event_times["canplay"]),
        "playing_at": rounded(event_times["playing"]),
        "reveal_at": rounded(reveal_at),
        "tap_to_playing_ms": rounded(event_times["playing"] - tap_at) if event_times["playing"] is not None else None,
        "tap_to_reveal_ms": rounded(reveal_at - tap_at) if reveal_at is not None else None,
        "poster_to_reveal_ms": rounded(reveal_at - poster_visible_at) if reveal_at is not None and poster_visible_at is not None else None,
        "first_target_request_to_playing_ms": rounded(event_times["playing"] - first_target_request["request_at"]) if event_times["playing"] is not None and first_target_request else None,
        "post_intent_request_to_playing_ms": rounded(event_times["playing"] - first_post_intent_request["request_at"])
        if event_times["playing"] is not None
        and first_post_intent_request
        and first_post_intent_request["request_at"] <= event_times["playing"]
        else None,
        "lcp_ms": rounded(probe["lcp"]),
        "tbt_ms": rounded(probe["longTaskBlocking"]),
        "cls": probe["cls"],
        "timed_out": timed_out,
        "classification": classification,
        "dual_source_before_intent": bool(pre_mobile and pre_fallback),
        "fallback_requested_before_intent": bool(pre_fallback),
        "mobile_requested_before_intent": bool(pre_mobile),
        "any_mp4_requested_before_intent": bool(pre_rows),
        "play_calls_before_intent": len(pre_play_calls),
        "load_calls_before_intent": len(pre_load_calls),
        "all_mp4_bytes_before_intent": total_encoded(pre_rows),
        "target_bytes_before_intent": total_encoded(pre_target),
        "target_bytes_at_playing": total_encoded(playing_target),
        "target_bytes_final": total_encoded(final_target),
        "initial_state": initial_state,
        "pre_intent_state": pre_intent_state,
        "poster_state": poster_state,
        "state_at_playing": state_at_playing,
        "final_state": final_state,
        "requests_before_intent": pre_rows,
        "requests_at_playing": playing_rows,
        "requests_final": final_requests,
        "probe": probe,
        "console_errors": console_errors,
        "page_errors": page_errors,
        "playing_observed_at": rounded(playing_observed_at),
    }
    context.close()
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True)
    parser.add_argument("--runs", type=int, default=3)
    parser.add_argument("--pre-intent-ms", type=int, default=3000)
    parser.add_argument("--after-playing-ms", type=int, default=1200)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    build_files = [
        Path("dist/en/index.html"),
        Path("dist/main.js"),
        Path("dist/styles.css"),
        Path("dist/assets/showreel/slow-steps-card-reel.mp4"),
        Path("dist/assets/showreel/mobile/slow-steps-card-reel-mobile.mp4"),
    ]
    provenance = {
        "head": git("rev-parse", "HEAD"),
        "head_parent": git("rev-parse", "HEAD^"),
        "branch": git("branch", "--show-current"),
        "origin_main": git("rev-parse", "origin/main"),
        "closed_tag": git("rev-parse", "portfolio-phase-2026-08-12-closed^{}"),
        "build_files": {
            str(path): {"bytes": path.stat().st_size, "sha256": sha256(path)}
            for path in build_files
        },
        "protected_file_sha256": sha256(Path("docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md")),
    }

    results = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        browser_version = browser.version
        for run_index in range(1, args.runs + 1):
            result = run_once(
                browser,
                args.url,
                run_index,
                args.pre_intent_ms,
                args.after_playing_ms,
            )
            results.append(result)
            print(json.dumps({
                "run": run_index,
                "classification": result["classification"],
                "pre_intent_target_bytes": result["target_bytes_before_intent"],
                "tap_to_playing_ms": result["tap_to_playing_ms"],
                "lcp_ms": result["lcp_ms"],
                "tbt_ms": result["tbt_ms"],
                "cls": result["cls"],
            }, ensure_ascii=False), flush=True)
        browser.close()

    summary = {
        "runs": args.runs,
        "all_conditions_matched": True,
        "dual_source_before_intent_runs": sum(row["dual_source_before_intent"] for row in results),
        "fallback_before_intent_runs": sum(row["fallback_requested_before_intent"] for row in results),
        "mobile_before_intent_runs": sum(row["mobile_requested_before_intent"] for row in results),
        "any_mp4_before_intent_runs": sum(row["any_mp4_requested_before_intent"] for row in results),
        "classifications": [row["classification"] for row in results],
        "target_bytes_before_intent_median": median(results, "target_bytes_before_intent"),
        "target_bytes_at_playing_median": median(results, "target_bytes_at_playing"),
        "tap_to_playing_median_ms": median(results, "tap_to_playing_ms"),
        "tap_to_reveal_median_ms": median(results, "tap_to_reveal_ms"),
        "poster_to_reveal_median_ms": median(results, "poster_to_reveal_ms"),
        "first_target_request_to_playing_median_ms": median(results, "first_target_request_to_playing_ms"),
        "post_intent_request_to_playing_median_ms": median(results, "post_intent_request_to_playing_ms"),
        "lcp_median_ms": median(results, "lcp_ms"),
        "tbt_median_ms": median(results, "tbt_ms"),
        "cls_median": median(results, "cls"),
        "timeouts": sum(row["timed_out"] for row in results),
    }
    payload = {
        "schema_version": 1,
        "provenance": provenance,
        "conditions": {
            "browser": f"Playwright Chromium {browser_version}",
            "viewport": VIEWPORT,
            "device_scale_factor": DEVICE_SCALE_FACTOR,
            "is_mobile": True,
            "has_touch": True,
            "cache_disabled": True,
            "new_context_and_storage_clear_per_run": True,
            "network": NETWORK,
            "network_enforcement": "Chrome DevTools Protocol Network.emulateNetworkConditions",
            "cpu_throttle_rate": CPU_THROTTLE_RATE,
            "pre_intent_ms_after_domcontentloaded": args.pre_intent_ms,
            "navigation_wait_until": "domcontentloaded",
            "intent": "programmatic instant scroll followed 50ms later by trusted stationary touchscreen tap",
            "after_playing_ms": args.after_playing_ms,
        },
        "summary": summary,
        "results": results,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"summary": summary}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
