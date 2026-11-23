"""Compare an original example of a COBOL decision rule with its Python port."""
import json
from pathlib import Path


def legacy_rule(days_past_due, utilization_pct):
    if days_past_due > 0:
        return "REVIEW"
    if utilization_pct >= 90:
        return "HOLD"
    if utilization_pct <= 30:
        return "ELIGIBLE"
    return "UNCHANGED"


def migrated_rule(days_past_due, utilization_pct):
    outcome = "UNCHANGED"
    if utilization_pct <= 30:
        outcome = "ELIGIBLE"
    elif utilization_pct >= 90:
        outcome = "HOLD"
    return "REVIEW" if days_past_due else outcome


def verify():
    cases = json.loads(Path(__file__).with_name("credit_fixtures.json").read_text())
    failures = []
    for case in cases:
        args = case["days_past_due"], case["utilization_pct"]
        legacy, migrated = legacy_rule(*args), migrated_rule(*args)
        if legacy != case["expected"] or migrated != case["expected"]:
            failures.append({"case": case, "legacy": legacy, "migrated": migrated})
    return {"cases": len(cases), "failures": failures}


if __name__ == "__main__":
    result = verify()
    print(json.dumps(result, indent=2))
    raise SystemExit(bool(result["failures"]))
