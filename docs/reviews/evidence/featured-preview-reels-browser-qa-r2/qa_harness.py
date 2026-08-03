#!/usr/bin/env python3
"""Sanitized fail-closed browser QA for Featured reels and implicit Work Press.

Playwright is imported only after argument parsing so ``--help`` works in an
environment where Playwright is not installed. The output omits cookies,
headers, query strings, form values, and absolute filesystem paths.
"""

import argparse
import json
import platform
import time
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

from baseline_classifier import classify_baseline_case


VIEWPORTS = [(1440, 900), (1200, 900), (834, 1112), (390, 844), (360, 800)]
LANGUAGES = {
    "en": {"path": "/en/", "pressLabel": "Press & Interviews"},
    "zh": {"path": "/zh/", "pressLabel": "媒體報導與訪談"},
}
TECH_URL = "https://www.taiwanplus.com/shows/documentary/business-and-tech/590/tech-dreamers"
ART_URL = (
    "https://www.taiwanplus.com/shows/documentary/arts/410/my-art-my-voice/"
    "250220001/whats-the-vibe-in-taiwan-my-art-my-voice"
)


def parse_args():
    parser = argparse.ArgumentParser(
        description="Run sanitized Featured-reel browser QA against an active local build."
    )
    parser.add_argument("--repo-root", default=".", help="repository root (default: current directory)")
    parser.add_argument("--base-url", required=True, help="active local origin, for example http://127.0.0.1:4173")
    parser.add_argument("--baseline-url", help="optional historical Preview origin")
    parser.add_argument("--evidence-dir", default="qa-evidence", help="directory for sanitized JSON output")
    parser.add_argument("--screenshots", action="store_true", help="write optional local/session screenshots")
    return parser.parse_args()


def sanitized_url(value):
    if not value:
        return None
    parts = urlsplit(value)
    return urlunsplit((parts.scheme, parts.netloc, parts.path, "", ""))


def join_url(origin, path):
    return origin.rstrip("/") + path


def capture_events(page):
    data = {
        "requestCount": 0,
        "responseCount": 0,
        "contactPosts": 0,
        "consoleWarningsErrors": 0,
        "pageErrors": 0,
        "requestFailures": [],
        "httpErrors": [],
        "responsePaths": [],
    }

    def on_request(request):
        data["requestCount"] += 1
        if request.method.upper() == "POST" and urlsplit(request.url).path == "/api/contact":
            data["contactPosts"] += 1

    def on_response(response):
        data["responseCount"] += 1
        record = {"url": sanitized_url(response.url), "status": response.status}
        data["responsePaths"].append(record)
        if response.status >= 400:
            data["httpErrors"].append(record)

    def on_console(message):
        if message.type in ("warning", "error"):
            data["consoleWarningsErrors"] += 1

    def on_page_error(_error):
        data["pageErrors"] += 1

    page.on("request", on_request)
    page.on("response", on_response)
    page.on("console", on_console)
    page.on("pageerror", on_page_error)
    page.on("requestfailed", lambda request: data["requestFailures"].append(sanitized_url(request.url)))
    return data


def clean_local_events(events):
    return (
        events["contactPosts"] == 0
        and not events["consoleWarningsErrors"]
        and not events["pageErrors"]
        and not events["requestFailures"]
        and not events["httpErrors"]
    )


def navigate(page, url, allow_error=False):
    result = {"status": None, "networkIdle": False, "finalUrl": None, "error": None}
    try:
        response = page.goto(url, wait_until="load", timeout=30000)
        result["status"] = response.status if response else None
        result["finalUrl"] = sanitized_url(page.url)
        page.wait_for_load_state("networkidle", timeout=15000)
        result["networkIdle"] = True
    except Exception as error:
        result["finalUrl"] = sanitized_url(page.url)
        result["error"] = f"navigation_error:{type(error).__name__}"
        if not allow_error:
            return result
    return result


def install_submit_counter(context):
    context.add_init_script(
        """(() => {
          window.__qaSubmitEvents = 0;
          addEventListener('submit', () => { window.__qaSubmitEvents += 1; }, true);
        })();"""
    )


def matrix_snapshot(page, press_label):
    return page.evaluate(
        """({pressLabel, techUrl, artUrl}) => {
          const visible = el => {
            if (!el) return false;
            const style = getComputedStyle(el), rect = el.getBoundingClientRect();
            return style.display !== 'none' && style.visibility !== 'hidden'
              && rect.width > 0 && rect.height > 0;
          };
          const videos = [...document.querySelectorAll('[data-featured-reel-video]')];
          const groups = [...document.querySelectorAll('.press-preview')];
          const types = [...document.querySelectorAll('.press-preview-type')];
          const slow = document.querySelector('#slow-steps .media-frame');
          const tech = document.querySelector('#tech-dreamers .media-frame');
          const art = document.querySelector('#my-art-my-voice .media-frame');
          const fields = [...document.querySelectorAll(
            '.contact-field:not(.contact-field-hidden) input, '
            + '.contact-field:not(.contact-field-hidden) textarea'
          )];
          return {
            noOverflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth
              && document.body.scrollWidth <= document.body.clientWidth,
            videos: videos.map(video => ({
              poster: video.getAttribute('poster'), preload: video.getAttribute('preload'),
              controls: video.controls, tabIndex: video.tabIndex,
              pointerEvents: getComputedStyle(video).pointerEvents,
              muted: video.muted, loop: video.loop, playsInline: video.playsInline,
            })),
            groupCount: groups.length,
            groupLabels: groups.map(group => group.getAttribute('aria-label')),
            groupRoles: groups.map(group => group.getAttribute('role')),
            visibleGroupHeadings: groups.flatMap(group => [...group.querySelectorAll('h1,h2,h3,h4,h5,h6')]
              .filter(visible).map(heading => heading.textContent.trim())),
            visibleTypes: types.filter(visible).map(type => type.textContent.trim()),
            globalPressVisible: visible(document.querySelector('.press-notes-section')),
            globalPressCount: document.querySelectorAll('.press-note-card').length,
            slowUnlinked: slow?.tagName === 'DIV' && !slow.closest('a'),
            techExact: tech?.href === techUrl,
            artExact: art?.href === artUrl,
            contact: {
              form: visible(document.querySelector('[data-contact-form]')),
              fields: fields.filter(visible).length,
              submit: visible(document.querySelector('.contact-submit')),
              submitEvents: window.__qaSubmitEvents || 0,
            },
            expectedPressLabel: pressLabel,
          };
        }""",
        {"pressLabel": press_label, "techUrl": TECH_URL, "artUrl": ART_URL},
    )


def run_matrix(browser, base_url, evidence_dir, screenshots):
    results = []
    for language, spec in LANGUAGES.items():
        for width, height in VIEWPORTS:
            context = browser.new_context(viewport={"width": width, "height": height})
            install_submit_counter(context)
            page = context.new_page()
            events = capture_events(page)
            nav = navigate(page, join_url(base_url, spec["path"]))
            page.wait_for_timeout(850)
            dom = matrix_snapshot(page, spec["pressLabel"])
            videos_ok = len(dom["videos"]) == 5 and all(
                video["poster"]
                and video["preload"] == "none"
                and not video["controls"]
                and video["tabIndex"] == -1
                and video["pointerEvents"] == "none"
                and video["muted"]
                and video["loop"]
                and video["playsInline"]
                for video in dom["videos"]
            )
            checks = {
                "navigation": nav["status"] == 200 and nav["networkIdle"] and nav["error"] is None,
                "noOverflow": dom["noOverflow"],
                "featuredContract": videos_ok,
                "semanticWorkPress": dom["groupCount"] == 2
                and dom["groupLabels"] == [spec["pressLabel"], spec["pressLabel"]]
                and dom["groupRoles"] == ["group", "group"],
                "visibleWorkPressHeadingAbsent": dom["visibleGroupHeadings"] == [],
                "visibleEntryTypes": len(dom["visibleTypes"]) == 3 and all(dom["visibleTypes"]),
                "globalPress": dom["globalPressVisible"] and dom["globalPressCount"] == 2,
                "destinations": dom["slowUnlinked"] and dom["techExact"] and dom["artExact"],
                "contactNeverSubmitted": dom["contact"] == {
                    "form": True, "fields": 5, "submit": True, "submitEvents": 0
                }
                and events["contactPosts"] == 0,
                "cleanEvents": clean_local_events(events),
            }
            if screenshots:
                page.screenshot(path=str(evidence_dir / f"local-{language}-{width}x{height}.png"), full_page=True)
            results.append(
                {
                    "language": language,
                    "viewport": f"{width}x{height}",
                    "pass": all(checks.values()),
                    "checks": checks,
                    "navigation": nav,
                    "events": {key: value for key, value in events.items() if key != "responsePaths"},
                }
            )
            context.close()
    return results


def video_state(page, selector):
    return page.locator(selector).evaluate(
        """video => ({
          playing: video.classList.contains('is-playing'), paused: video.paused,
          currentTime: video.currentTime, opacity: getComputedStyle(video).opacity,
          muted: video.muted, loop: video.loop, playsInline: video.playsInline,
        })"""
    )


def run_interaction(browser, base_url):
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    install_submit_counter(context)
    page = context.new_page()
    events = capture_events(page)
    nav = navigate(page, join_url(base_url, "/en/"))
    selector = "#slow-steps [data-featured-reel-video]"
    video = page.locator(selector)
    page.evaluate("scrollTo(0, 0)")
    video.evaluate("node => node.scrollIntoView({block:'center'})")
    started = time.perf_counter()
    page.wait_for_timeout(1000)
    hold = video_state(page, selector)
    hold["elapsedMs"] = round((time.perf_counter() - started) * 1000)
    page.wait_for_function("s => document.querySelector(s)?.classList.contains('is-playing')", arg=selector, timeout=7000)
    playing = video_state(page, selector)
    playing["elapsedMs"] = round((time.perf_counter() - started) * 1000)
    initial_time = playing["currentTime"]
    page.wait_for_timeout(600)
    advanced = video_state(page, selector)
    advanced["deltaCurrentTime"] = advanced["currentTime"] - initial_time

    page.evaluate("scrollTo(0, 0)")
    page.wait_for_timeout(500)
    exited = video_state(page, selector)
    video.evaluate("node => node.scrollIntoView({block:'center'})")
    page.wait_for_timeout(1000)
    rehold = video_state(page, selector)
    page.wait_for_function("s => document.querySelector(s)?.classList.contains('is-playing')", arg=selector, timeout=7000)
    replay = video_state(page, selector)

    scan = page.evaluate(
        """() => {
          const videos = [...document.querySelectorAll('[data-featured-reel-video]')];
          const maxY = document.documentElement.scrollHeight - innerHeight;
          const ratioAt = (video, y) => {
            const rect = video.getBoundingClientRect(), top = rect.top + scrollY - y;
            const bottom = top + rect.height;
            const height = Math.max(0, Math.min(innerHeight, bottom) - Math.max(0, top));
            const width = Math.max(0, Math.min(innerWidth, rect.right) - Math.max(0, rect.left));
            return rect.width * rect.height ? height * width / (rect.width * rect.height) : 0;
          };
          for (let y = 0; y <= maxY; y += 40) {
            const ratios = videos.map(video => ratioAt(video, y));
            const eligible = ratios.map((value, index) => ({value, index})).filter(item => item.value >= .35);
            if (eligible.length >= 2) return {found:true, y, ratios, eligible};
          }
          return {found:false};
        }"""
    )
    arbitration = {"scan": scan, "pass": False}
    if scan["found"]:
        page.evaluate("y => scrollTo(0, y)", scan["y"])
        page.wait_for_timeout(2200)
        snapshot = page.evaluate(
            """() => [...document.querySelectorAll('[data-featured-reel-video]')].map((video,index) => {
              const rect=video.getBoundingClientRect(), top=Math.max(0,rect.top), bottom=Math.min(innerHeight,rect.bottom);
              const left=Math.max(0,rect.left), right=Math.min(innerWidth,rect.right);
              const ratio=rect.width*rect.height ? Math.max(0,right-left)*Math.max(0,bottom-top)/(rect.width*rect.height) : 0;
              return {index, ratio, playing:video.classList.contains('is-playing'), paused:video.paused};
            })"""
        )
        eligible = [item for item in snapshot if item["ratio"] >= 0.35]
        active = [item for item in snapshot if item["playing"] and not item["paused"]]
        arbitration = {
            "scan": scan,
            "snapshot": snapshot,
            "pass": len(eligible) >= 2 and len(active) == 1 and active[0]["index"] == eligible[-1]["index"],
        }

    video.evaluate("node => node.scrollIntoView({block:'center'})")
    page.wait_for_function("s => document.querySelector(s)?.classList.contains('is-playing')", arg=selector, timeout=7000)
    before_error = video_state(page, selector)
    video.dispatch_event("error")
    page.wait_for_timeout(250)
    after_error = video_state(page, selector)

    page.evaluate("dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}))")
    page.wait_for_timeout(200)
    after_hide = video_state(page, selector)
    page.evaluate("dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))")
    page.wait_for_function("s => document.querySelector(s)?.classList.contains('is-playing')", arg=selector, timeout=7000)
    after_show = video_state(page, selector)

    visibility = page.evaluate(
        """async selector => {
          const original=Object.getOwnPropertyDescriptor(document,'visibilityState');
          let state='hidden';
          Object.defineProperty(document,'visibilityState',{configurable:true,get:()=>state});
          document.dispatchEvent(new Event('visibilitychange'));
          await new Promise(resolve=>setTimeout(resolve,150));
          const video=document.querySelector(selector);
          const reset={playing:video.classList.contains('is-playing'),paused:video.paused,currentTime:video.currentTime};
          state='visible'; document.dispatchEvent(new Event('visibilitychange'));
          if(original) Object.defineProperty(document,'visibilityState',original); else delete document.visibilityState;
          return {reset,restored:document.visibilityState};
        }""",
        selector,
    )
    page.wait_for_function("s => document.querySelector(s)?.classList.contains('is-playing')", arg=selector, timeout=7000)
    visibility["replayed"] = video_state(page, selector)

    checks = {
        "navigation": nav["status"] == 200 and nav["networkIdle"],
        "hold": not hold["playing"] and hold["paused"] and hold["currentTime"] == 0 and hold["opacity"] == "0",
        "playingAndAdvance": playing["playing"] and not playing["paused"] and advanced["opacity"] == "1" and advanced["deltaCurrentTime"] > 0.3,
        "exitReset": not exited["playing"] and exited["paused"] and exited["currentTime"] <= 0.01,
        "reentry": not rehold["playing"] and rehold["paused"] and replay["playing"] and not replay["paused"],
        "naturalArbitration": arbitration["pass"],
        "syntheticMediaError": before_error["playing"] and not after_error["playing"] and after_error["paused"],
        "syntheticPersistedBFCache": after_hide["paused"] and not after_hide["playing"] and after_show["playing"],
        "controlledVisibility": visibility["reset"]["paused"] and visibility["restored"] == "visible" and visibility["replayed"]["playing"],
        "cleanEventsAndNoSubmit": clean_local_events(events) and page.evaluate("window.__qaSubmitEvents || 0") == 0,
    }
    context.close()
    return {
        "pass": all(checks.values()), "checks": checks,
        "timing": {"hold": hold, "playing": playing, "advanced": advanced},
        "exit": exited, "reentry": {"hold": rehold, "playing": replay},
        "arbitration": arbitration,
        "mediaError": {"method": "synthetic error event", "before": before_error, "after": after_error},
        "pageLifecycle": {"method": "synthetic persisted PageTransitionEvent", "afterHide": after_hide, "afterShow": after_show},
        "visibility": {"method": "controlled reversible visibilityState", **visibility},
        "events": {key: value for key, value in events.items() if key != "responsePaths"},
    }


def wrapper_states(page):
    return page.evaluate(
        """() => [...document.querySelectorAll('.works-stack .work-panel')].slice(0,5).map(panel => {
          const wrapper=panel.querySelector('.media-frame'), video=panel.querySelector('[data-featured-reel-video]');
          const style=getComputedStyle(wrapper), rect=wrapper.getBoundingClientRect();
          return {id:panel.id,visible:style.display!=='none'&&style.visibility!=='hidden'&&rect.width>0&&rect.height>0,
            background:style.backgroundImage!=='none',poster:video?.getAttribute('poster')||null,
            videoDisplay:video?getComputedStyle(video).display:null,paused:video?.paused??true,
            currentTime:video?.currentTime??0,playing:video?.classList.contains('is-playing')??false};
        })"""
    )


def run_reduced_motion(browser, base_url):
    context = browser.new_context(viewport={"width": 1200, "height": 900}, reduced_motion="reduce")
    install_submit_counter(context)
    page = context.new_page(); events = capture_events(page); nav = navigate(page, join_url(base_url, "/en/"))
    page.wait_for_timeout(2200)
    wrappers = wrapper_states(page)
    checks = {
        "navigation": nav["status"] == 200 and nav["networkIdle"],
        "fivePosters": len(wrappers) == 5 and all(row["visible"] and row["background"] and row["poster"] for row in wrappers),
        "motionStatic": len(wrappers) == 5 and all(row["videoDisplay"] == "none" and row["paused"] and row["currentTime"] == 0 and not row["playing"] for row in wrappers),
        "cleanEventsAndNoSubmit": clean_local_events(events) and page.evaluate("window.__qaSubmitEvents || 0") == 0,
    }
    context.close()
    return {"pass": all(checks.values()), "checks": checks, "wrappers": wrappers}


def run_no_javascript(browser, base_url):
    context = browser.new_context(viewport={"width": 1200, "height": 900}, java_script_enabled=False)
    page = context.new_page(); events = capture_events(page); nav = navigate(page, join_url(base_url, "/en/"))
    before = events["requestCount"]
    focused = False
    for _ in range(12):
        page.keyboard.press("Tab")
        if page.locator(":focus").get_attribute("href") == "#works":
            focused = True
            break
    if focused:
        page.keyboard.press("Enter"); page.wait_for_timeout(1000)
    wrappers = wrapper_states(page)
    checks = {
        "navigation": nav["status"] == 200 and nav["networkIdle"],
        "keyboardToWorks": focused and sanitized_url(page.url).endswith("/en/") and page.locator("#works").is_visible(),
        "fiveStaticPosters": len(wrappers) == 5 and all(row["visible"] and row["paused"] and row["currentTime"] == 0 for row in wrappers),
        "noNavigationOrContactPost": events["requestCount"] == before and events["contactPosts"] == 0,
        "cleanEvents": clean_local_events(events),
    }
    context.close()
    return {"pass": all(checks.values()), "checks": checks, "wrappers": wrappers}


def active_state(page):
    return page.evaluate(
        """() => { const el=document.activeElement, style=getComputedStyle(el), rect=el.getBoundingClientRect();
          return {tag:el?.tagName||null,href:el?.getAttribute?.('href')||null,name:el?.getAttribute?.('name')||null,
            className:typeof el?.className==='string'?el.className:null,isVideo:el?.matches?.('video')||false,
            rect:{x:rect.x,y:rect.y,width:rect.width,height:rect.height},
            intersects:rect.width>0&&rect.height>0&&rect.bottom>0&&rect.right>0&&rect.top<innerHeight&&rect.left<innerWidth,
            outline:{style:style.outlineStyle,width:style.outlineWidth,color:style.outlineColor,offset:style.outlineOffset}}; }"""
    )


def run_keyboard(browser, base_url):
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    install_submit_counter(context)
    page = context.new_page(); events = capture_events(page); nav = navigate(page, join_url(base_url, "/en/"))
    page.locator("#tech-dreamers .media-frame-link").evaluate("node => node.scrollIntoView({block:'center'})")
    page.wait_for_timeout(350)
    tech = None; sequence = []
    for _ in range(50):
        page.keyboard.press("Tab"); state = active_state(page); sequence.append(state)
        if state["tag"] == "A" and state["href"] == TECH_URL:
            tech = state; break
    contact_reached = False
    for _ in range(70):
        page.keyboard.press("Tab"); state = active_state(page); sequence.append(state)
        if state["tag"] in ("INPUT", "TEXTAREA"):
            contact_reached = True
            if state["tag"] == "TEXTAREA": break
    videos = page.locator("[data-featured-reel-video]").evaluate_all(
        "nodes => nodes.map(video => ({tabIndex:video.tabIndex,controls:video.controls,pointerEvents:getComputedStyle(video).pointerEvents}))"
    )
    exact_outline = tech and tech["intersects"] and tech["outline"] == {
        "style": "solid", "width": "2px", "color": "rgb(216, 255, 62)", "offset": "4px"
    }
    checks = {
        "navigation": nav["status"] == 200 and nav["networkIdle"],
        "techFocusedWithExactOutline": bool(exact_outline),
        "contactReached": contact_reached,
        "videosNeverFocused": not any(row["isVideo"] for row in sequence),
        "videoOwnership": len(videos) == 5 and all(row == {"tabIndex": -1, "controls": False, "pointerEvents": "none"} for row in videos),
        "cleanEventsAndNoSubmit": clean_local_events(events) and page.evaluate("window.__qaSubmitEvents || 0") == 0,
    }
    context.close()
    return {"pass": all(checks.values()), "checks": checks, "techFocus": tech, "videoMeta": videos}


def run_baseline(browser, baseline_url, matrix):
    cases = []
    matrix_by_key = {(row["language"], row["viewport"]): row for row in matrix}
    for language, spec in LANGUAGES.items():
        for width, height in VIEWPORTS:
            key = f"{width}x{height}"
            context = browser.new_context(viewport={"width": width, "height": height}, reduced_motion="reduce")
            page = context.new_page(); events = capture_events(page)
            nav = navigate(page, join_url(baseline_url, spec["path"]), allow_error=True)
            final_url = nav["finalUrl"] or ""
            auth_gated = "/login" in urlsplit(final_url).path or any(
                "/sso-api" in urlsplit(row["url"]).path for row in events["responsePaths"]
            )
            baseline_dom = page.locator(".works-stack").count() > 0 and page.locator("[data-featured-reel-video]").count() == 5
            classification = classify_baseline_case(
                auth_gated=auth_gated,
                baseline_dom_available=baseline_dom,
                local_case_pass=matrix_by_key[(language, key)]["pass"],
                remote_contact_clear=events["contactPosts"] == 0,
            )
            cases.append(
                {
                    "language": language, "viewport": key,
                    "authGated": auth_gated, "baselineDomAvailable": baseline_dom,
                    "navigation": nav, "classification": classification,
                    "events": {key: value for key, value in events.items() if key != "responsePaths"},
                }
            )
            context.close()
    return cases


def main():
    args = parse_args()
    repo_root = Path(args.repo_root).resolve()
    evidence_dir = Path(args.evidence_dir)
    if not (repo_root / "package.json").is_file() or not (repo_root / "dist" / "en" / "index.html").is_file():
        raise SystemExit("repo root must contain package.json and a built dist/en/index.html")
    evidence_dir.mkdir(parents=True, exist_ok=True)

    try:
        import importlib.metadata
        from playwright.sync_api import sync_playwright
    except (ImportError, ModuleNotFoundError) as error:
        raise SystemExit("Playwright is unavailable; install it before running browser QA") from error

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        matrix = run_matrix(browser, args.base_url, evidence_dir, args.screenshots)
        interaction = run_interaction(browser, args.base_url)
        reduced_motion = run_reduced_motion(browser, args.base_url)
        no_javascript = run_no_javascript(browser, args.base_url)
        keyboard = run_keyboard(browser, args.base_url)
        baseline = run_baseline(browser, args.baseline_url, matrix) if args.baseline_url else []
        chromium_version = browser.version
        browser.close()

    local_pass = all(row["pass"] for row in matrix) and all(
        row["pass"] for row in (interaction, reduced_motion, no_javascript, keyboard)
    )
    baseline_pass = all(row["classification"]["pass"] for row in baseline)
    auth_open = bool(baseline) and all(row["classification"]["branch"] == "auth_gated" for row in baseline)
    overall_pass = local_pass and (not baseline or baseline_pass)
    status = "PASS_WITH_OPEN_ITEMS" if overall_pass and auth_open else ("PASS" if overall_pass else "FAIL")
    output = {
        "status": status,
        "pass": overall_pass,
        "environment": {
            "python": platform.python_version(),
            "playwright": importlib.metadata.version("playwright"),
            "chromium": chromium_version,
        },
        "inputs": {
            "repo": repo_root.name,
            "baseUrl": sanitized_url(args.base_url),
            "baselineUrl": sanitized_url(args.baseline_url),
        },
        "matrix": matrix,
        "interaction": interaction,
        "fallbacks": {"reducedMotion": reduced_motion, "noJavaScript": no_javascript, "keyboard": keyboard},
        "baseline": baseline,
        "matchedBaselineClaim": False,
    }
    output_path = evidence_dir / "qa-results.json"
    output_path.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": status, "pass": overall_pass, "output": str(output_path)}, indent=2))
    if not overall_pass:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
