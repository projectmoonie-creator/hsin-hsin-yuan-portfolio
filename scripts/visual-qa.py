#!/usr/bin/env python3
"""Repeatable browser QA for the Editorial Watch Loop Hybrid."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from playwright.sync_api import Browser, Page, TimeoutError as PlaywrightTimeoutError, sync_playwright


VIEWPORTS = [
    ("desktop-1440", 1440, 900),
    ("desktop-1200", 1200, 900),
    ("tablet-834", 834, 1112),
    ("mobile-390", 390, 844),
    ("mobile-360", 360, 800),
]
WORK_ORDER = [
    "slow-steps",
    "tech-dreamers",
    "my-art-my-voice",
    "interior-spatial-brand-films",
    "pts-taigi-bus",
    "top-gear-china-uk-special",
]


def transform_of(page: Page) -> str:
    return page.locator("[data-watch-loop-track]").evaluate(
        "element => getComputedStyle(element).transform",
    )


def collect_structure(page: Page) -> dict:
    return page.evaluate(
        """() => ({
          workIds: [...document.querySelectorAll('.work-row')].map((node) => node.id),
          previews: document.querySelectorAll(
            '[data-watch-loop-sequence]:not([aria-hidden="true"]) .watch-loop-card'
          ).length,
          originalSequences: document.querySelectorAll(
            '[data-watch-loop-sequence]:not([aria-hidden="true"])'
          ).length,
          hiddenCopies: document.querySelectorAll(
            '[data-watch-loop-sequence][aria-hidden="true"]'
          ).length,
          bodyOverflow: document.documentElement.scrollWidth - window.innerWidth,
          heroVisible: Boolean(document.querySelector('.hero')),
          showreelVisible: Boolean(document.querySelector('[data-showreel-play]')),
          contactVisible: Boolean(document.querySelector('#contact')),
          languageVisible: Boolean(document.querySelector('.language-switch')),
          brokenImages: [...document.images]
            .filter((image) => image.complete && image.naturalWidth === 0)
            .map((image) => image.currentSrc || image.src),
        })""",
    )


def add_check(result: dict, condition: bool, label: str, detail: object = None) -> None:
    result["checks"].append({"label": label, "passed": bool(condition), "detail": detail})
    if not condition:
        result["failures"].append(label)


def open_page(
    browser: Browser,
    base_url: str,
    lang: str,
    width: int,
    height: int,
    *,
    reduced_motion: str = "no-preference",
    java_script_enabled: bool = True,
    touch_only: bool = False,
) -> tuple[Page, list[str], list[str]]:
    context = browser.new_context(
        viewport={"width": width, "height": height},
        reduced_motion=reduced_motion,
        java_script_enabled=java_script_enabled,
        has_touch=touch_only,
        is_mobile=touch_only,
    )
    page = context.new_page()
    console_errors: list[str] = []
    page_errors: list[str] = []
    page.on(
        "console",
        lambda message: console_errors.append(message.text) if message.type == "error" else None,
    )
    page.on("pageerror", lambda error: page_errors.append(str(error)))
    page.goto(f"{base_url}/{lang}/", wait_until="networkidle", timeout=30_000)
    return page, console_errors, page_errors


def run_scenario(
    browser: Browser,
    base_url: str,
    output_dir: Path,
    name: str,
    width: int,
    height: int,
    *,
    lang: str = "en",
    reduced_motion: str = "no-preference",
    java_script_enabled: bool = True,
    touch_only: bool = False,
) -> dict:
    result = {
        "name": name,
        "lang": lang,
        "viewport": [width, height],
        "reducedMotion": reduced_motion,
        "javaScript": java_script_enabled,
        "touchOnly": touch_only,
        "checks": [],
        "failures": [],
    }
    page, console_errors, page_errors = open_page(
        browser,
        base_url,
        lang,
        width,
        height,
        reduced_motion=reduced_motion,
        java_script_enabled=java_script_enabled,
        touch_only=touch_only,
    )
    try:
        result["url"] = page.url
        result["title"] = page.title()
        structure = collect_structure(page)
        result["structure"] = structure
        add_check(result, structure["workIds"] == WORK_ORDER, "six canonical work anchors", structure["workIds"])
        add_check(result, structure["previews"] == 5, "five original Watch previews", structure["previews"])
        add_check(result, structure["originalSequences"] == 1, "one readable original sequence", structure["originalSequences"])
        add_check(result, structure["bodyOverflow"] <= 1, "no page-level horizontal overflow", structure["bodyOverflow"])
        add_check(result, structure["heroVisible"], "hero rendered")
        add_check(result, structure["showreelVisible"], "showreel action rendered")
        add_check(result, structure["contactVisible"], "contact rendered")
        add_check(result, structure["languageVisible"], "language switch rendered")
        add_check(result, not page_errors, "no uncaught page errors", page_errors)
        add_check(result, not console_errors, "no console errors", console_errors)

        mobile = width <= 820
        should_be_manual = mobile or reduced_motion == "reduce" or not java_script_enabled or touch_only

        visual_contract = page.evaluate(
            """() => {
              const worksLink = document.querySelector('.nav-links a[href="#works"]');
              const submit = document.querySelector('.contact-submit');
              const submitStyle = getComputedStyle(submit);
              const heroMedia = document.querySelector('.hero-media').getBoundingClientRect();
              const watchViewport = document.querySelector('.watch-loop-viewport');
              const showreelVideo = document.querySelector('[data-showreel-video]');
              const showreelPlay = document.querySelector('[data-showreel-play]');
              const parseRgb = (value) => (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
              const luminance = (rgb) => {
                const values = rgb.map((value) => {
                  const channel = value / 255;
                  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
                });
                return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
              };
              const contrast = (foreground, background) => {
                const a = luminance(parseRgb(foreground));
                const b = luminance(parseRgb(background));
                return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
              };
              const effectiveBackground = (node) => {
                for (let current = node; current; current = current.parentElement) {
                  const value = getComputedStyle(current).backgroundColor;
                  if (value && value !== 'rgba(0, 0, 0, 0)' && value !== 'transparent') return value;
                }
                return getComputedStyle(document.body).backgroundColor;
              };
              const labelContrasts = [...document.querySelectorAll(
                '.section-title, .work-meta, .case-study-item span'
              )].map((node) => ({
                selector: node.className,
                text: node.textContent.trim().slice(0, 60),
                ratio: contrast(getComputedStyle(node).color, effectiveBackground(node)),
              }));
              return {
                worksLinkVisible: Boolean(
                  worksLink && getComputedStyle(worksLink).display !== 'none' && worksLink.getClientRects().length
                ),
                submitText: submit.textContent.trim(),
                submitColor: submitStyle.color,
                submitBackground: submitStyle.backgroundColor,
                heroRatio: heroMedia.width / heroMedia.height,
                htmlLang: document.documentElement.lang,
                labelContrasts,
                showreelPlayDisplay: getComputedStyle(showreelPlay).display,
                showreelVideoControls: showreelVideo.controls,
                showreelVideoOpacity: Number(getComputedStyle(showreelVideo).opacity),
                showreelVideoPoster: showreelVideo.poster,
                watchOverflowX: getComputedStyle(watchViewport).overflowX,
              };
            }""",
        )
        result["visualContract"] = visual_contract
        add_check(result, visual_contract["worksLinkVisible"], "Works navigation remains visible", visual_contract)
        add_check(
            result,
            bool(visual_contract["submitText"])
            and visual_contract["submitColor"] != visual_contract["submitBackground"],
            "contact submit text has visible contrast",
            visual_contract,
        )
        add_check(
            result,
            abs(visual_contract["heroRatio"] - (16 / 9)) < 0.03,
            "showreel poster keeps a 16:9 frame",
            visual_contract["heroRatio"],
        )
        add_check(
            result,
            visual_contract["htmlLang"] == ("zh-Hant" if lang == "zh" else "en"),
            "document language matches localized output",
            visual_contract["htmlLang"],
        )
        low_contrast_labels = [
            item for item in visual_contract["labelContrasts"] if item["ratio"] < 4.5
        ]
        add_check(
            result,
            not low_contrast_labels,
            "small text labels meet 4.5:1 contrast",
            low_contrast_labels,
        )
        add_check(
            result,
            visual_contract["watchOverflowX"] == ("auto" if should_be_manual else "hidden"),
            "Watch overflow matches motion policy",
            visual_contract["watchOverflowX"],
        )
        if not java_script_enabled:
            add_check(
                result,
                visual_contract["showreelPlayDisplay"] == "none"
                and visual_contract["showreelVideoControls"]
                and visual_contract["showreelVideoOpacity"] >= 0.99
                and bool(visual_contract["showreelVideoPoster"]),
                "no-JavaScript showreel exposes native playback",
                visual_contract,
            )

        if java_script_enabled:
            press_fallback = page.evaluate(
                """() => {
                  const source = document.querySelector('.press-preview-card:has(img)');
                  if (!source) return { available: false };
                  const clone = source.cloneNode(true);
                  clone.style.position = 'fixed';
                  clone.style.left = '0';
                  clone.style.top = '0';
                  clone.style.visibility = 'hidden';
                  clone.style.width = 'min(44rem, 90vw)';
                  document.body.append(clone);
                  clone.querySelector('img').dispatchEvent(new Event('error'));
                  const frame = clone.querySelector('.press-preview-image');
                  const copy = clone.querySelector('.press-preview-copy');
                  const result = {
                    available: true,
                    framePreserved: Boolean(frame),
                    imageRemoved: !clone.querySelector('img'),
                    cardWidth: clone.getBoundingClientRect().width,
                    copyWidth: copy.getBoundingClientRect().width,
                  };
                  clone.remove();
                  return result;
                }""",
            )
            result["pressFallback"] = press_fallback
            add_check(
                result,
                press_fallback["available"]
                and press_fallback["framePreserved"]
                and press_fallback["imageRemoved"]
                and press_fallback["copyWidth"] > press_fallback["cardWidth"] * 0.6,
                "press image failure preserves readable card layout",
                press_fallback,
            )

        watch = page.locator("[data-watch-loop]")
        if watch.count() == 0:
            add_check(result, False, "Watch Loop exists in rendered DOM", page.content()[:500])
            screenshot = output_dir / f"{name}-{lang}-diagnostic.png"
            page.screenshot(path=str(screenshot), full_page=True)
            result["screenshot"] = str(screenshot)
            (output_dir / f"{name}-{lang}-diagnostic.html").write_text(page.content())
            return result
        watch.scroll_into_view_if_needed()
        page.wait_for_timeout(250)
        before = transform_of(page)
        page.wait_for_timeout(650)
        after = transform_of(page)
        if should_be_manual:
            add_check(result, before == after, "Watch Loop remains manually positioned", [before, after])
            viewport = page.locator(".watch-loop-viewport")
            viewport.evaluate("element => { element.scrollLeft = 90; }")
            page.wait_for_timeout(100)
            scroll_left = viewport.evaluate("element => element.scrollLeft")
            add_check(result, scroll_left > 0, "manual horizontal scroll remains available", scroll_left)
        else:
            add_check(result, before != after, "desktop Watch Loop advances", [before, after])
            watch.hover()
            paused_before = transform_of(page)
            page.wait_for_timeout(450)
            paused_after = transform_of(page)
            add_check(result, paused_before == paused_after, "hover pauses Watch Loop", [paused_before, paused_after])
            page.locator(".watch-loop-card").first.focus()
            focus_before = transform_of(page)
            page.wait_for_timeout(450)
            focus_after = transform_of(page)
            add_check(result, focus_before == focus_after, "keyboard focus pauses Watch Loop", [focus_before, focus_after])
            add_check(result, structure["hiddenCopies"] > 0, "desktop clones are accessibility-hidden", structure["hiddenCopies"])

        page.locator("body").click(position={"x": 1, "y": 1})
        page.locator("#top").scroll_into_view_if_needed()
        page.keyboard.press("Tab")
        focus_state = page.evaluate(
            """() => {
              const node = document.activeElement;
              const style = getComputedStyle(node);
              return { tag: node?.tagName, outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
            }""",
        )
        add_check(
            result,
            focus_state["tag"] not in (None, "BODY") and focus_state["outlineStyle"] != "none",
            "keyboard focus is visible",
            focus_state,
        )

        page.evaluate(
            """() => {
              document.documentElement.style.scrollBehavior = 'auto';
              document.querySelectorAll('img').forEach((image) => { image.loading = 'eager'; });
            }""",
        )
        scroll_height = page.evaluate("document.documentElement.scrollHeight")
        for y in range(0, scroll_height, max(height - 120, 320)):
            page.evaluate("value => window.scrollTo(0, value)", y)
            page.wait_for_timeout(80)
        page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
        try:
            page.wait_for_function(
                "[...document.images].every((image) => image.complete)",
                timeout=10_000,
            )
        except PlaywrightTimeoutError:
            result["imageWaitTimedOut"] = True
        image_state = page.evaluate(
            """() => ({
              pending: [...document.images]
                .filter((image) => !image.complete)
                .map((image) => image.currentSrc || image.src),
              broken: [...document.images]
                .filter((image) => image.complete && image.naturalWidth === 0)
                .map((image) => image.currentSrc || image.src),
            })""",
        )
        result["imageStateAfterScroll"] = image_state
        result["supportingImageState"] = page.evaluate(
            """() => [...document.querySelectorAll('.work-supporting-image')].map((image) => {
              const rect = image.getBoundingClientRect();
              const frame = image.parentElement.getBoundingClientRect();
              const style = getComputedStyle(image);
              return {
                src: image.currentSrc || image.src,
                complete: image.complete,
                naturalWidth: image.naturalWidth,
                naturalHeight: image.naturalHeight,
                rect: [rect.width, rect.height],
                frame: [frame.width, frame.height],
                display: style.display,
                opacity: style.opacity,
                visibility: style.visibility,
              };
            })""",
        )
        add_check(result, not image_state["pending"], "all lazy images finish loading", image_state["pending"])
        add_check(result, not image_state["broken"], "no broken images after full-page scroll", image_state["broken"])

        anchor_clearance = {}
        page.evaluate("document.documentElement.style.scrollBehavior = 'auto'")
        for selector in ["#my-art-my-voice", "#contact"]:
            page.locator(selector).evaluate(
                "node => node.scrollIntoView({ block: 'start', behavior: 'instant' })",
            )
            page.wait_for_timeout(30)
            clearance = page.evaluate(
                """value => {
                  const target = document.querySelector(value);
                  const header = document.querySelector('.topbar');
                  return {
                    targetTop: target.getBoundingClientRect().top,
                    headerBottom: header.getBoundingClientRect().bottom,
                  };
                }""",
                selector,
            )
            anchor_clearance[selector] = clearance
            add_check(
                result,
                clearance["targetTop"] >= clearance["headerBottom"] - 1,
                f"{selector} anchor clears fixed navigation",
                clearance,
            )
        result["anchorClearance"] = anchor_clearance

        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(150)

        if lang == "en" and name in {"desktop-1440", "mobile-390"}:
            section_screenshots = {}
            page.evaluate("document.activeElement?.blur()")
            page.evaluate("window.scrollTo(0, 0)")
            page.wait_for_timeout(80)
            hero_path = output_dir / f"{name}-{lang}-hero.png"
            page.screenshot(path=str(hero_path))
            section_screenshots["hero"] = str(hero_path)

            page.locator("[data-watch-loop]").scroll_into_view_if_needed()
            page.wait_for_timeout(80)
            watch_path = output_dir / f"{name}-{lang}-watch.png"
            page.screenshot(path=str(watch_path))
            section_screenshots["watch"] = str(watch_path)

            for label, selector in [("my-art", "#my-art-my-voice"), ("contact", "#contact")]:
                page.locator(selector).evaluate(
                    "node => node.scrollIntoView({ block: 'start', behavior: 'instant' })",
                )
                page.wait_for_timeout(30)
                section_path = output_dir / f"{name}-{lang}-{label}.png"
                page.screenshot(path=str(section_path))
                section_screenshots[label] = str(section_path)

            page.locator(".work-supporting-media").scroll_into_view_if_needed()
            page.wait_for_timeout(80)
            for index, image in enumerate(page.locator(".work-supporting-image").all()):
                image.evaluate("node => node.decode()")
                supporting_path = output_dir / f"{name}-{lang}-supporting-{index + 1}.png"
                image.screenshot(path=str(supporting_path))
                section_screenshots[f"supporting-{index + 1}"] = str(supporting_path)
            result["sectionScreenshots"] = section_screenshots

        screenshot = output_dir / f"{name}-{lang}.png"
        page.screenshot(path=str(screenshot), full_page=True)
        result["screenshot"] = str(screenshot)
    finally:
        page.context.close()
    return result


def write_report(output_dir: Path, scenarios: list[dict]) -> None:
    report = {
        "passed": all(not scenario["failures"] for scenario in scenarios),
        "scenarios": scenarios,
    }
    (output_dir / "report.json").write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n")
    lines = ["# Editorial Watch Loop Hybrid — Browser QA", ""]
    lines.append(f"Overall: {'PASS' if report['passed'] else 'FAIL'}")
    lines.append("")
    for scenario in scenarios:
        lines.append(f"## {scenario['name']} / {scenario['lang']}")
        lines.append("")
        for check in scenario["checks"]:
            lines.append(f"- {'PASS' if check['passed'] else 'FAIL'} — {check['label']}")
        lines.append(f"- Screenshot: `{scenario.get('screenshot', 'not captured')}`")
        lines.append("")
    (output_dir / "report.md").write_text("\n".join(lines) + "\n")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:4173")
    parser.add_argument("--output", default="/tmp/hybrid-visual-qa")
    args = parser.parse_args()

    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)
    for existing in output_dir.iterdir():
        if existing.is_file():
            existing.unlink()
    scenarios: list[dict] = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        try:
            for name, width, height in VIEWPORTS:
                scenarios.append(run_scenario(browser, args.base_url, output_dir, name, width, height))
            scenarios.append(
                run_scenario(
                    browser,
                    args.base_url,
                    output_dir,
                    "reduced-1440",
                    1440,
                    900,
                    reduced_motion="reduce",
                ),
            )
            scenarios.append(
                run_scenario(
                    browser,
                    args.base_url,
                    output_dir,
                    "no-js-1440",
                    1440,
                    900,
                    java_script_enabled=False,
                ),
            )
            scenarios.append(
                run_scenario(browser, args.base_url, output_dir, "mobile-390", 390, 844, lang="zh"),
            )
            scenarios.append(
                run_scenario(
                    browser,
                    args.base_url,
                    output_dir,
                    "touch-tablet-1024",
                    1024,
                    1366,
                    touch_only=True,
                ),
            )
        finally:
            browser.close()

    write_report(output_dir, scenarios)
    failures = [f"{scenario['name']}/{scenario['lang']}: {', '.join(scenario['failures'])}" for scenario in scenarios if scenario["failures"]]
    if failures:
        print("\n".join(failures), file=sys.stderr)
        return 1
    print(f"Browser QA passed. Report: {output_dir / 'report.md'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
