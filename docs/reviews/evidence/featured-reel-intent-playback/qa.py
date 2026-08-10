#!/usr/bin/env python3
import argparse
import json
from pathlib import Path

from playwright.sync_api import sync_playwright


PLAY_PROBE = r"""
window.__featuredQa = { plays: [] };
const originalPlay = HTMLMediaElement.prototype.play;
HTMLMediaElement.prototype.play = function (...args) {
  if (this.matches?.('[data-featured-reel-video]')) {
    window.__featuredQa.plays.push({
      at: performance.now(),
      id: this.closest('.work-panel')?.id || '',
    });
  }
  return originalPlay.apply(this, args);
};
"""


def mobile_context(browser, **overrides):
    options = {
        "viewport": {"width": 390, "height": 844},
        "device_scale_factor": 3,
        "is_mobile": True,
        "has_touch": True,
        "locale": "en-US",
        "user_agent": (
            "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) "
            "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 "
            "Mobile/15E148 Safari/604.1"
        ),
    }
    options.update(overrides)
    return browser.new_context(**options)


def track_page(page, record):
    page.on("console", lambda message: record["console_errors"].append(message.text)
            if message.type == "error" else None)
    page.on("pageerror", lambda error: record["page_errors"].append(str(error)))
    page.on("request", lambda request: record["contact_posts"].append(request.url)
            if request.method == "POST" and "/api/contact" in request.url else None)
    page.on("request", lambda request: record["mp4_requests"].append(request.url)
            if "/assets/showreel/" in request.url and request.url.endswith(".mp4") else None)


def base_record(name):
    return {
        "name": name,
        "passed": False,
        "contact_posts": [],
        "mp4_requests": [],
        "console_errors": [],
        "page_errors": [],
    }


def assert_clean(record):
    assert not record["contact_posts"], record["contact_posts"]
    assert not record["console_errors"], record["console_errors"]
    assert not record["page_errors"], record["page_errors"]


def linked_mobile_two_tap(browser, base_url):
    record = base_record("mobile linked media previews on first tap and opens on second")
    context = mobile_context(browser)
    context.add_init_script(PLAY_PROBE)
    page = context.new_page()
    track_page(page, record)
    popups = []
    page.on("popup", lambda popup: popups.append(popup))
    page.goto(f"{base_url}/en/", wait_until="domcontentloaded")
    media = page.locator("#tech-dreamers .media-frame-link")
    media.scroll_into_view_if_needed()
    media.tap()
    page.wait_for_function(
        "document.querySelector('#tech-dreamers [data-featured-reel-video]').classList.contains('is-playing')",
        timeout=15000,
    )
    assert not popups, "first preview tap opened the external destination"
    assert page.url.startswith(f"{base_url}/en/"), page.url
    with page.expect_popup(timeout=5000) as popup_info:
        media.tap()
    popup = popup_info.value
    record["second_tap_url"] = popup.url
    assert popup.url.startswith("https://www.taiwanplus.com/shows/documentary/business-and-tech/590/tech-dreamers")
    popup.close()
    record["play_calls"] = page.evaluate("window.__featuredQa.plays")
    record["overflow"] = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
    assert record["overflow"] <= 1, record["overflow"]
    assert_clean(record)
    record["passed"] = True
    context.close()
    return record


def mobile_touch_move(browser, base_url):
    record = base_record("mobile touch movement preserves scroll and suppresses navigation")
    context = mobile_context(browser)
    context.add_init_script(PLAY_PROBE)
    page = context.new_page()
    track_page(page, record)
    popups = []
    page.on("popup", lambda popup: popups.append(popup))
    page.goto(f"{base_url}/en/", wait_until="domcontentloaded")
    page.evaluate(
        r"""
        () => {
          const media = document.querySelector('#tech-dreamers .media-frame-link');
          media.scrollIntoView({ block: 'center', behavior: 'instant' });
          media.dispatchEvent(new PointerEvent('pointerdown', {
            bubbles: true, pointerType: 'touch', pointerId: 71,
            clientX: 120, clientY: 300,
          }));
          media.dispatchEvent(new PointerEvent('pointermove', {
            bubbles: true, pointerType: 'touch', pointerId: 71,
            clientX: 121, clientY: 340,
          }));
          media.dispatchEvent(new PointerEvent('pointerup', {
            bubbles: true, pointerType: 'touch', pointerId: 71,
            clientX: 121, clientY: 340,
          }));
          media.click();
        }
        """
    )
    page.wait_for_timeout(500)
    assert not popups
    assert not page.evaluate("window.__featuredQa.plays.filter(({id}) => id === 'tech-dreamers').length")
    assert page.url.startswith(f"{base_url}/en/")
    assert_clean(record)
    record["passed"] = True
    context.close()
    return record


def screening_exact_target(browser, base_url):
    record = base_record("Screening Strip primes and opens the exact Tech Dreamers large card")
    context = mobile_context(browser)
    context.add_init_script(PLAY_PROBE)
    page = context.new_page()
    track_page(page, record)
    page.goto(f"{base_url}/en/", wait_until="domcontentloaded")
    page.evaluate(
        r"""
        () => {
          const card = document.querySelector(
            '.watch-loop-sequence:not([aria-hidden="true"]) .watch-loop-card[href="#tech-dreamers"]'
          );
          card.dispatchEvent(new PointerEvent('pointerdown', {
            bubbles: true, pointerType: 'touch', pointerId: 72,
            clientX: 120, clientY: 300,
          }));
          card.dispatchEvent(new PointerEvent('pointerup', {
            bubbles: true, pointerType: 'touch', pointerId: 72,
            clientX: 120, clientY: 300,
          }));
          card.click();
        }
        """
    )
    try:
        page.wait_for_function(
            "document.querySelector('#tech-dreamers [data-featured-reel-video]').classList.contains('is-playing')",
            timeout=15000,
        )
    except Exception:
        diagnostic = page.evaluate(
            r"""
            () => {
              const video = document.querySelector('#tech-dreamers [data-featured-reel-video]');
              const rect = video.getBoundingClientRect();
              return {
                url: location.href,
                rect: { top: rect.top, bottom: rect.bottom },
                paused: video.paused,
                readyState: video.readyState,
                currentTime: video.currentTime,
                isPlaying: video.classList.contains('is-playing'),
                plays: window.__featuredQa.plays,
              };
            }
            """
        )
        raise AssertionError({"diagnostic": diagnostic, "requests": record["mp4_requests"]})
    rect = page.locator("#tech-dreamers .media-frame").bounding_box()
    assert rect and rect["y"] < 844 and rect["y"] + rect["height"] > 0, rect
    target_requests = [url for url in record["mp4_requests"] if "tech-dreamers" in url]
    wrong_requests = [url for url in record["mp4_requests"] if "slow-steps" in url]
    assert target_requests, record["mp4_requests"]
    assert not wrong_requests, record["mp4_requests"]
    record["target_request_count"] = len(target_requests)
    record["play_calls"] = page.evaluate("window.__featuredQa.plays")
    assert_clean(record)
    record["passed"] = True
    context.close()
    return record


def desktop_intent(browser, base_url):
    record = base_record("desktop hover and keyboard focus immediately request preview")
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    context.add_init_script(PLAY_PROBE)
    page = context.new_page()
    track_page(page, record)
    page.goto(f"{base_url}/en/", wait_until="domcontentloaded")
    panel = page.locator("#tech-dreamers")
    panel.hover()
    page.wait_for_function("window.__featuredQa.plays.some(({id}) => id === 'tech-dreamers')")
    hover_count = page.evaluate("window.__featuredQa.plays.filter(({id}) => id === 'tech-dreamers').length")
    page.locator("#tech-dreamers .media-frame-link").focus()
    focus_count = page.evaluate("window.__featuredQa.plays.filter(({id}) => id === 'tech-dreamers').length")
    record["hover_play_calls"] = hover_count
    record["focus_kept_or_started_preview"] = focus_count >= hover_count
    assert hover_count >= 1 and focus_count >= hover_count
    assert_clean(record)
    record["passed"] = True
    context.close()
    return record


def automatic_mobile_fallback(browser, base_url):
    record = base_record("mobile 35 percent plus 700ms automatic fallback remains")
    context = mobile_context(browser)
    context.add_init_script(PLAY_PROBE)
    page = context.new_page()
    track_page(page, record)
    page.goto(f"{base_url}/en/", wait_until="domcontentloaded")
    start = page.evaluate("performance.now()")
    page.evaluate(
        "document.querySelector('#slow-steps .media-frame').scrollIntoView({block:'center', behavior:'instant'})"
    )
    page.wait_for_function("window.__featuredQa.plays.some(({id}) => id === 'slow-steps')", timeout=5000)
    play_at = page.evaluate("window.__featuredQa.plays.find(({id}) => id === 'slow-steps').at")
    record["play_after_scroll_ms"] = round(play_at - start, 1)
    assert record["play_after_scroll_ms"] >= 650, record["play_after_scroll_ms"]
    assert_clean(record)
    record["passed"] = True
    context.close()
    return record


def conservative_mode(browser, base_url, name, connection_script=None, **context_options):
    record = base_record(name)
    context = mobile_context(browser, **context_options)
    if connection_script:
        context.add_init_script(connection_script)
    page = context.new_page()
    track_page(page, record)
    page.goto(f"{base_url}/en/", wait_until="domcontentloaded")
    page.wait_for_timeout(3000)
    assert not record["mp4_requests"], record["mp4_requests"]
    assert_clean(record)
    record["passed"] = True
    context.close()
    return record


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--case", choices=["all", "screening"], default="all")
    args = parser.parse_args()
    base_url = args.url.rstrip("/")
    save_data = """
    Object.defineProperty(navigator, 'connection', { configurable: true, value: {
      saveData: true, effectiveType: '4g', addEventListener() {}, removeEventListener() {}
    }});
    """
    two_g = """
    Object.defineProperty(navigator, 'connection', { configurable: true, value: {
      saveData: false, effectiveType: '2g', addEventListener() {}, removeEventListener() {}
    }});
    """

    results = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        if args.case == "screening":
            results.append(screening_exact_target(browser, base_url))
        else:
            results.append(linked_mobile_two_tap(browser, base_url))
            results.append(mobile_touch_move(browser, base_url))
            results.append(screening_exact_target(browser, base_url))
            results.append(desktop_intent(browser, base_url))
            results.append(automatic_mobile_fallback(browser, base_url))
            results.append(conservative_mode(browser, base_url, "reduced motion remains static", reduced_motion="reduce"))
            results.append(conservative_mode(browser, base_url, "Save-Data skips passive warm", save_data))
            results.append(conservative_mode(browser, base_url, "2G skips passive warm", two_g))
            results.append(conservative_mode(browser, base_url, "no JavaScript remains static", java_script_enabled=False))
        browser.close()

    payload = {
        "summary": {"passed": all(row["passed"] for row in results), "cases": len(results)},
        "results": results,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(payload, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
