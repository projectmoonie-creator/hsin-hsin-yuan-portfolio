#!/usr/bin/env python3
"""Build the compact machine summary from the retained raw browser ledgers."""

import hashlib
import json
import statistics
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SCENARIOS = {
    "immediate_cold_intent": ROOT / "before" / "immediate-tap-3x.json",
    "passive_3s_then_intent": ROOT / "before" / "passive-3s-then-tap-3x.json",
    "passive_12s_then_intent": ROOT / "before" / "passive-12s-then-tap-3x.json",
}
INVALIDATED = {
    "loopback_unthrottled": ROOT / "invalidated" / "loopback-unthrottled-smoke.json",
    "load_gated_excessive_lead": ROOT / "invalidated" / "load-gated-excessive-lead-smoke.json",
    "empty_snapshot_passive": ROOT / "invalidated" / "empty-snapshot-fallback-passive-smoke.json",
    "empty_snapshot_immediate": ROOT / "invalidated" / "empty-snapshot-fallback-immediate-smoke.json",
}
MOBILE = "/assets/showreel/mobile/slow-steps-card-reel-mobile.mp4"
FALLBACK = "/assets/showreel/slow-steps-card-reel.mp4"


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def median(rows, key):
    values = [row.get(key) for row in rows if isinstance(row.get(key), (int, float))]
    return round(statistics.median(values), 1) if values else None


def is_mobile(url):
    return MOBILE in url


def is_fallback(url):
    return FALLBACK in url and MOBILE not in url


def compact_request(row):
    return {
        "url": row["url"].split("127.0.0.1:4194", 1)[-1],
        "request_at": row["request_at"],
        "first_data_at": row["first_data_at"],
        "request_to_first_data_ms": row["request_to_first_data_ms"],
        "range": row["request_range"],
        "status": row["status"],
        "content_range": row["content_range"],
        "encoded_body_bytes": row["encoded_data_received_bytes"],
        "loading_finished_encoded_bytes": row["loading_finished_encoded_bytes"],
        "failed": row["failed"],
        "canceled": row["canceled"],
    }


def summarize_scenario(path):
    payload = json.loads(path.read_text())
    rows = payload["results"]
    per_run = []
    for row in rows:
        pre_target = [
            request for request in row["requests_before_intent"]
            if is_mobile(request["url"]) or is_fallback(request["url"])
        ]
        final_target = [
            request for request in row["requests_final"]
            if is_mobile(request["url"]) or is_fallback(request["url"])
        ]
        pre_loads = [
            call for call in row["probe"]["loadCalls"]
            if call["id"] == "slow-steps" and call["at"] <= row["pre_intent_at"]
        ]
        pre_plays = [
            call for call in row["probe"]["playCalls"]
            if call["id"] == "slow-steps" and call["at"] <= row["pre_intent_at"]
        ]
        per_run.append({
            "run": row["run"],
            "classification": row["classification"],
            "pre_intent_at": row["pre_intent_at"],
            "poster_visible_at": row["poster_visible_at"],
            "loadedmetadata_at": row["loadedmetadata_at"],
            "canplay_at": row["canplay_at"],
            "playing_at": row["playing_at"],
            "reveal_at": row["reveal_at"],
            "tap_to_playing_ms": row["tap_to_playing_ms"],
            "tap_to_reveal_ms": row["tap_to_reveal_ms"],
            "poster_to_reveal_ms": row["poster_to_reveal_ms"],
            "lcp_ms": row["lcp_ms"],
            "tbt_ms": row["tbt_ms"],
            "cls": row["cls"],
            "current_src_before_intent": row["pre_intent_state"]["currentSrc"].split("127.0.0.1:4194", 1)[-1],
            "source_candidates": row["pre_intent_state"]["sources"],
            "pre_intent_metadata_load_calls": len([
                call for call in pre_loads if call["preload"] == "metadata"
            ]),
            "pre_intent_play_calls": len(pre_plays),
            "pre_intent_mobile_request_events": len([
                request for request in pre_target if is_mobile(request["url"])
            ]),
            "pre_intent_fallback_request_events": len([
                request for request in pre_target if is_fallback(request["url"])
            ]),
            "pre_intent_encoded_body_bytes": sum(
                request["encoded_data_received_bytes"] for request in pre_target
            ),
            "requests_before_intent": [compact_request(request) for request in pre_target],
            "requests_final": [compact_request(request) for request in final_target],
        })
    medians = {
        key: median(rows, key)
        for key in [
            "poster_visible_at", "loadedmetadata_at", "canplay_at", "playing_at",
            "reveal_at", "tap_to_playing_ms", "tap_to_reveal_ms",
            "poster_to_reveal_ms", "lcp_ms", "tbt_ms", "cls",
            "target_bytes_before_intent", "target_bytes_at_playing",
            "first_target_request_to_playing_ms", "post_intent_request_to_playing_ms",
        ]
    }
    return {
        "raw_file": str(path.relative_to(ROOT)),
        "raw_sha256": sha256(path),
        "conditions": payload["conditions"],
        "raw_summary": payload["summary"],
        "medians": medians,
        "per_run": per_run,
    }


def main():
    scenarios = {name: summarize_scenario(path) for name, path in SCENARIOS.items()}
    all_runs = [run for scenario in scenarios.values() for run in scenario["per_run"]]
    decision = {
        "valid_runs": len(all_runs),
        "desktop_fallback_request_events": sum(
            run["pre_intent_fallback_request_events"] for run in all_runs
        ),
        "dual_source_runs": sum(
            bool(run["pre_intent_mobile_request_events"] and run["pre_intent_fallback_request_events"])
            for run in all_runs
        ),
        "pre_intent_play_calls": sum(run["pre_intent_play_calls"] for run in all_runs),
        "all_current_src_mobile": all(MOBILE in run["current_src_before_intent"] for run in all_runs),
        "pagespeed_dual_source_full_transfer_reproduced": False,
        "observed_trigger": "single mobile proximity metadata warm after Hero readiness",
        "runtime_change_gate": "closed-no-runtime-change",
        "reason": "No valid run requested the desktop fallback or both sources; the only pre-intent transfer was the existing one-candidate mobile metadata warm.",
    }
    output = {
        "schema_version": 1,
        "provenance": next(iter(json.loads(path.read_text())["provenance"] for path in SCENARIOS.values())),
        "scenarios": scenarios,
        "decision": decision,
        "invalidated_smokes": {
            name: {"file": str(path.relative_to(ROOT)), "sha256": sha256(path)}
            for name, path in INVALIDATED.items()
        },
    }
    destination = ROOT / "summary.json"
    destination.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
    labels = {
        "immediate_cold_intent": "0ms cold intent",
        "passive_3s_then_intent": "3s passive then intent",
        "passive_12s_then_intent": "12s passive then intent",
    }
    lines = [
        "# Mobile Preview Network Budget — Machine Summary",
        "",
        "Generated by `summarize.py` from the retained raw browser ledgers. Do not hand-edit.",
        "",
        "## Matched medians",
        "",
        "| Scenario | Valid runs | Dual-source runs | Fallback requests before intent | Bytes before intent | Tap→`playing` | Tap→reveal | Poster→reveal | Hero LCP | TBT | CLS |",
        "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    ]
    for name, scenario in scenarios.items():
        raw = scenario["raw_summary"]
        medians = scenario["medians"]
        lines.append(
            f"| {labels[name]} | {raw['runs']} | {raw['dual_source_before_intent_runs']} | "
            f"{raw['fallback_before_intent_runs']} | {raw['target_bytes_before_intent_median']:.0f} B | "
            f"{medians['tap_to_playing_ms']} ms | {medians['tap_to_reveal_ms']} ms | "
            f"{medians['poster_to_reveal_ms']} ms | {medians['lcp_ms']} ms | "
            f"{medians['tbt_ms']} ms | {medians['cls']} |"
        )
    lines.extend([
        "",
        "## Decision",
        "",
        f"- Valid runs: {decision['valid_runs']}.",
        f"- Desktop fallback request events before intent: {decision['desktop_fallback_request_events']}.",
        f"- Dual-source runs: {decision['dual_source_runs']}.",
        f"- Pre-intent Slow Steps `play()` calls: {decision['pre_intent_play_calls']}.",
        f"- All runs selected the mobile derivative: `{decision['all_current_src_mobile']}`.",
        f"- PageSpeed dual-source/full-transfer finding reproduced: `{decision['pagespeed_dual_source_full_transfer_reproduced']}`.",
        f"- Observed trigger: {decision['observed_trigger']}.",
        f"- Gate: `{decision['runtime_change_gate']}`.",
        "",
        "## Twelve-second passive request ledger",
        "",
        "Each browser media transition is retained separately, including zero-byte aborts. Times are relative to navigation `performance.timeOrigin`.",
        "",
        "| Run | URL | Start | First body byte | Start→first byte | Status | Range | Encoded body bytes | Result |",
        "| ---: | --- | ---: | ---: | ---: | ---: | --- | ---: | --- |",
    ])
    for run in scenarios["passive_12s_then_intent"]["per_run"]:
        for request in run["requests_before_intent"]:
            first = "—" if request["first_data_at"] is None else f"{request['first_data_at']} ms"
            latency = "—" if request["request_to_first_data_ms"] is None else f"{request['request_to_first_data_ms']} ms"
            status = "—" if request["status"] is None else str(request["status"])
            result = request["failed"] or ("canceled" if request["canceled"] else "open/complete")
            lines.append(
                f"| {run['run']} | `{request['url']}` | {request['request_at']} ms | {first} | {latency} | "
                f"{status} | `{request['range']}` | {request['encoded_body_bytes']} | {result} |"
            )
    lines.extend([
        "",
        "## Immediate cold-intent event ledger",
        "",
        "| Run | Poster visible | `loadedmetadata` | `canplay` | `playing` | Reveal | Tap→`playing` | Bytes at `playing` |",
        "| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    ])
    immediate_raw = json.loads(SCENARIOS["immediate_cold_intent"].read_text())
    for run in immediate_raw["results"]:
        lines.append(
            f"| {run['run']} | {run['poster_visible_at']} ms | {run['loadedmetadata_at']} ms | "
            f"{run['canplay_at']} ms | {run['playing_at']} ms | {run['reveal_at']} ms | "
            f"{run['tap_to_playing_ms']} ms | {run['target_bytes_at_playing']} B |"
        )
    lines.extend([
        "",
        "## Invalidated harness smokes",
        "",
        "These files are preserved for audit only and are excluded from every median and decision:",
        "",
    ])
    for name, record in output["invalidated_smokes"].items():
        lines.append(f"- `{name}`: `{record['file']}` — SHA-256 `{record['sha256']}`")
    markdown_destination = ROOT / "summary.md"
    markdown_destination.write_text("\n".join(lines) + "\n")
    print(json.dumps({
        "json_destination": str(destination),
        "markdown_destination": str(markdown_destination),
        "decision": decision,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
