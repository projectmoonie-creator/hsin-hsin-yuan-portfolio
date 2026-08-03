"""Pure fail-closed classifier for historical matched-baseline cases."""


def classify_baseline_case(
    *,
    auth_gated,
    baseline_dom_available,
    local_case_pass,
    remote_contact_clear,
    fingerprint_matches=None,
    remote_events_clean=None,
    comparison_pass=None,
    pixel_pass=None,
):
    """Classify one baseline case without treating missing evidence as success."""
    if auth_gated:
        return {
            "branch": "auth_gated",
            "status": "PASS_WITH_OPEN_ITEMS",
            "pass": bool(local_case_pass and remote_contact_clear),
            "authGatedIncrement": 1,
            "concernType": "vercel_sso_auth_gate",
            "reason": (
                "Preserved SSO/login redirect evidence proves the historical "
                "Preview is auth-gated."
            ),
        }

    if not baseline_dom_available:
        return {
            "branch": "missing_dom_without_auth_evidence",
            "status": "FAIL",
            "pass": False,
            "authGatedIncrement": 0,
            "concernType": "unexplained_missing_portfolio_dom",
            "reason": (
                "Portfolio DOM is missing without SSO/auth evidence; fail closed "
                "instead of labeling the case auth-gated."
            ),
        }

    if fingerprint_matches is False:
        return {
            "branch": "dom_available",
            "status": "FAIL",
            "pass": False,
            "authGatedIncrement": 0,
            "concernType": "baseline_fingerprint_mismatch",
            "reason": (
                "Portfolio DOM is available but does not match the recorded "
                "pre-package fingerprint; this is a hard baseline mismatch."
            ),
        }

    required = (
        remote_events_clean,
        comparison_pass,
        pixel_pass,
        fingerprint_matches,
    )
    comparison_complete = all(value is not None for value in required)
    passed = bool(
        comparison_complete
        and local_case_pass
        and remote_contact_clear
        and remote_events_clean
        and comparison_pass
        and pixel_pass
        and fingerprint_matches
    )
    return {
        "branch": "dom_available",
        "status": "PASS" if passed else "FAIL",
        "pass": passed,
        "authGatedIncrement": 0,
        "concernType": None if passed else "matched_comparison_failure",
        "reason": (
            "All matched comparisons passed."
            if passed
            else (
                "DOM was available, so complete fingerprint/event/geometry/"
                "pixel comparison was required and did not pass."
            )
        ),
    }
