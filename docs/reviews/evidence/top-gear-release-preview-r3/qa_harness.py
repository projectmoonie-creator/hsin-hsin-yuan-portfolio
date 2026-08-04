#!/usr/bin/env python3
"""Run the durable r2 browser contract against the six-reel Top Gear release.

This adapter preserves the reviewed r2 harness as historical evidence while
updating only the current reel count, exact poster set, and Top Gear browser
contract. Evidence remains sanitized and contains no cookies, headers, query
strings, form values, or absolute source-media paths.
"""

import importlib.util
import shutil
import sys
from pathlib import Path


HERE = Path(__file__).resolve().parent
R2_DIR = HERE.parent / "featured-preview-reels-browser-qa-r2"
R2_HARNESS = R2_DIR / "qa_harness.py"

if not R2_HARNESS.is_file():
    raise SystemExit(f"missing durable r2 harness: {R2_HARNESS}")

sys.path.insert(0, str(R2_DIR))
SPEC = importlib.util.spec_from_file_location("featured_preview_reels_browser_qa_r2", R2_HARNESS)
if SPEC is None or SPEC.loader is None:
    raise SystemExit("unable to load durable r2 harness")
qa = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(qa)


qa.EXPECTED_POSTERS = {
    "slow-steps": "/assets/portfolio/slow-steps-poster.webp",
    "tech-dreamers": "https://prod-img.taiwanplus.com/program/224be7ed-057b-400f-af63-a8582cd80cfb.webp",
    "my-art-my-voice": "/assets/portfolio/my-art-my-voice-performance-2.jpg",
    "interior-spatial-brand-films": "/assets/portfolio/gorgeous-space-sunny-wang-frontal.webp",
    "pts-taigi-bus": "https://i.ytimg.com/vi/q4TMcoOpzKA/hqdefault.jpg",
    "top-gear-china-uk-special": "/assets/portfolio/top-gear-uk-special-car.jpg",
}

TOP_GEAR_REEL = "/assets/showreel/top-gear-china-uk-special-card-reel.mp4"
TOP_GEAR_POSTER = "/assets/portfolio/top-gear-uk-special-car.jpg"
TOP_GEAR_WATCH = "https://youtu.be/M_eXe9HRD9Y?si=YZ_3JZ7FJY4vVcZv"


def six_wrapper_states(page):
    return page.evaluate(
        """() => [...document.querySelectorAll('.works-stack .work-panel')]
          .filter(panel => panel.querySelector('[data-featured-reel-video]'))
          .map(panel => {
            const wrapper=panel.querySelector('.media-frame');
            const video=panel.querySelector('[data-featured-reel-video]');
            const style=getComputedStyle(wrapper), rect=wrapper.getBoundingClientRect();
            return {id:panel.id,
              visible:style.display!=='none'&&style.visibility!=='hidden'&&rect.width>0&&rect.height>0,
              background:style.backgroundImage!=='none',poster:video?.getAttribute('poster')||null,
              videoDisplay:video?getComputedStyle(video).display:null,paused:video?.paused??true,
              currentTime:video?.currentTime??0,playing:video?.classList.contains('is-playing')??false};
          })"""
    )


qa.wrapper_states = six_wrapper_states


original_run_matrix = qa.run_matrix


def run_matrix(browser, base_url, evidence_dir, screenshots):
    rows = original_run_matrix(browser, base_url, evidence_dir, screenshots)
    for row in rows:
        width, height = (int(value) for value in row["viewport"].split("x"))
        context = browser.new_context(viewport={"width": width, "height": height})
        page = context.new_page()
        qa.navigate(page, qa.join_url(base_url, qa.LANGUAGES[row["language"]]["path"]))
        contract = page.evaluate(
            """({reel, poster, watch}) => {
              const videos=[...document.querySelectorAll('[data-featured-reel-video]')];
              const panel=document.querySelector('#top-gear-china-uk-special');
              const video=panel?.querySelector('[data-featured-reel-video]');
              const wrapper=panel?.querySelector('.media-frame-link');
              const wrapperRect=wrapper?.getBoundingClientRect();
              const videoRect=video?.getBoundingClientRect();
              const style=video ? getComputedStyle(video) : null;
              const exactGeometry=Boolean(wrapperRect&&videoRect
                && Math.abs(wrapperRect.x-videoRect.x)<0.1
                && Math.abs(wrapperRect.y-videoRect.y)<0.1
                && Math.abs(wrapperRect.width-videoRect.width)<0.1
                && Math.abs(wrapperRect.height-videoRect.height)<0.1);
              const checks={
                sixReels:videos.length===6,
                exactSource:video?.querySelector('source')?.getAttribute('src')===reel,
                exactPoster:video?.getAttribute('poster')===poster,
                exactDestination:wrapper?.getAttribute('href')===watch,
                mediaOwnership:Boolean(video&&video.muted&&video.loop&&video.playsInline
                  &&video.getAttribute('preload')==='none'&&!video.controls
                  &&video.tabIndex===-1&&style?.pointerEvents==='none'),
                wrapperOwnsGeometry:exactGeometry,
                centeredObjectPosition:style?.objectPosition==='50% 50%',
                noSiteTitleOverlay:panel?.querySelectorAll('.media-label').length===0,
              };
              return {pass:Object.values(checks).every(Boolean),checks};
            }""",
            {"reel": TOP_GEAR_REEL, "poster": TOP_GEAR_POSTER, "watch": TOP_GEAR_WATCH},
        )
        context.close()
        row["topGearContract"] = contract
        row["checks"]["featuredContract"] = (
            row["posters"] == qa.EXPECTED_POSTERS and contract["pass"]
        )
        row["pass"] = all(row["checks"].values())
    return rows


qa.run_matrix = run_matrix


original_run_reduced_motion = qa.run_reduced_motion


def run_reduced_motion(browser, base_url):
    result = original_run_reduced_motion(browser, base_url)
    wrappers = result["wrappers"]
    result["checks"].pop("fivePosters", None)
    result["checks"]["sixPosters"] = len(wrappers) == 6 and all(
        row["visible"] and row["background"] and row["poster"] for row in wrappers
    )
    result["checks"]["motionStatic"] = len(wrappers) == 6 and all(
        row["videoDisplay"] == "none"
        and row["paused"]
        and row["currentTime"] == 0
        and not row["playing"]
        for row in wrappers
    )
    result["pass"] = all(result["checks"].values())
    return result


qa.run_reduced_motion = run_reduced_motion


original_run_no_javascript = qa.run_no_javascript


def run_no_javascript(browser, base_url):
    result = original_run_no_javascript(browser, base_url)
    result["checks"].pop("fiveStaticPosters", None)
    result["checks"]["sixStaticPosters"] = (
        len(result["wrappers"]) == 6
        and result["posters"] == qa.EXPECTED_POSTERS
        and all(
            row["visible"] and row["paused"] and row["currentTime"] == 0
            for row in result["wrappers"]
        )
    )
    result["pass"] = all(result["checks"].values())
    return result


qa.run_no_javascript = run_no_javascript


original_run_keyboard = qa.run_keyboard


def run_keyboard(browser, base_url):
    result = original_run_keyboard(browser, base_url)
    expected = {"tabIndex": -1, "controls": False, "pointerEvents": "none"}
    result["checks"]["videoOwnership"] = (
        len(result["videoMeta"]) == 6 and all(row == expected for row in result["videoMeta"])
    )
    result["pass"] = all(result["checks"].values())
    return result


qa.run_keyboard = run_keyboard


def option_value(name):
    if name not in sys.argv:
        return None
    index = sys.argv.index(name)
    if index + 1 >= len(sys.argv):
        raise SystemExit(f"{name} requires a value")
    return sys.argv[index + 1]


def main():
    if "--baseline-url" in sys.argv:
        raise SystemExit("r3 release adapter validates the accepted current build only")

    tracked_summary = option_value("--tracked-summary")
    if tracked_summary:
        index = sys.argv.index("--tracked-summary")
        del sys.argv[index:index + 2]
    evidence_dir = option_value("--evidence-dir")
    qa.main()

    if tracked_summary:
        source = Path(evidence_dir).resolve() / "qa-results.json"
        target = Path(tracked_summary).resolve()
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)


if __name__ == "__main__":
    main()
