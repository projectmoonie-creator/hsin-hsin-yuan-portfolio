"""Focused self-test for every fail-closed baseline-classifier branch."""

import json

from baseline_classifier import classify_baseline_case


CASES = [
    {
        "name": "auth gate plus portfolio DOM is contradictory and fails closed",
        "input": {
            "auth_gated": True,
            "baseline_dom_available": True,
            "local_case_pass": True,
            "remote_contact_clear": True,
        },
        "expected": {
            "branch": "contradictory_auth_and_dom",
            "status": "FAIL",
            "pass": False,
            "authGatedIncrement": 0,
            "concernType": "contradictory_auth_and_portfolio_dom",
        },
    },
    {
        "name": "auth gate with preserved SSO evidence",
        "input": {
            "auth_gated": True,
            "baseline_dom_available": False,
            "local_case_pass": True,
            "remote_contact_clear": True,
        },
        "expected": {
            "branch": "auth_gated",
            "status": "PASS_WITH_OPEN_ITEMS",
            "pass": True,
            "authGatedIncrement": 1,
            "concernType": "vercel_sso_auth_gate",
        },
    },
    {
        "name": "missing DOM without auth evidence fails closed",
        "input": {
            "auth_gated": False,
            "baseline_dom_available": False,
            "local_case_pass": True,
            "remote_contact_clear": True,
        },
        "expected": {
            "branch": "missing_dom_without_auth_evidence",
            "status": "FAIL",
            "pass": False,
            "authGatedIncrement": 0,
            "concernType": "unexplained_missing_portfolio_dom",
        },
    },
    {
        "name": "DOM available full comparison passes",
        "input": {
            "auth_gated": False,
            "baseline_dom_available": True,
            "local_case_pass": True,
            "remote_contact_clear": True,
            "fingerprint_matches": True,
            "remote_events_clean": True,
            "comparison_pass": True,
            "pixel_pass": True,
        },
        "expected": {
            "branch": "dom_available",
            "status": "PASS",
            "pass": True,
            "authGatedIncrement": 0,
            "concernType": None,
        },
    },
    {
        "name": "DOM available fingerprint mismatch fails closed",
        "input": {
            "auth_gated": False,
            "baseline_dom_available": True,
            "local_case_pass": True,
            "remote_contact_clear": True,
            "fingerprint_matches": False,
        },
        "expected": {
            "branch": "dom_available",
            "status": "FAIL",
            "pass": False,
            "authGatedIncrement": 0,
            "concernType": "baseline_fingerprint_mismatch",
        },
    },
    {
        "name": "DOM available incomplete comparison fails closed",
        "input": {
            "auth_gated": False,
            "baseline_dom_available": True,
            "local_case_pass": True,
            "remote_contact_clear": True,
            "fingerprint_matches": True,
            "remote_events_clean": True,
            "comparison_pass": False,
            "pixel_pass": True,
        },
        "expected": {
            "branch": "dom_available",
            "status": "FAIL",
            "pass": False,
            "authGatedIncrement": 0,
            "concernType": "matched_comparison_failure",
        },
    },
]


def main():
    results = []
    for case in CASES:
        actual = classify_baseline_case(**case["input"])
        passed = all(actual.get(key) == value for key, value in case["expected"].items())
        results.append(
            {
                "name": case["name"],
                "pass": passed,
                "status": actual["status"],
                "branch": actual["branch"],
                "concernType": actual["concernType"],
            }
        )

    covered_branches = {row["branch"] for row in results}
    required_branches = {
        "contradictory_auth_and_dom",
        "auth_gated",
        "missing_dom_without_auth_evidence",
        "dom_available",
    }
    output = {
        "overallPass": all(row["pass"] for row in results)
        and required_branches.issubset(covered_branches),
        "requiredBranchesCovered": sorted(required_branches),
        "cases": results,
    }
    print(json.dumps(output, indent=2))
    if not output["overallPass"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
