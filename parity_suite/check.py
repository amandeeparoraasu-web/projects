"""Compare candidate output against a golden settlement result."""
import argparse
import json
from pathlib import Path

COUNTS = ("internal_count", "processor_count")
STATUSES = {
    "matched", "amount_mismatch", "currency_mismatch",
    "duplicate", "missing_internal", "missing_processor",
}


def index(rows):
    by_id = {}
    for row in rows:
        event_id = row["event_id"]
        if not isinstance(event_id, str) or not event_id.strip() or event_id in by_id:
            raise ValueError(f"Invalid or duplicate event_id: {event_id!r}")
        if row["status"] not in STATUSES:
            raise ValueError(f"Unknown status for {event_id}")
        for field in COUNTS:
            count = row[field]
            if count is not None and (type(count) is not int or count < 1):
                raise ValueError(f"Invalid {field} for {event_id}")
        by_id[event_id] = {field: row[field] for field in (*COUNTS, "status")}
    return by_id


def compare(expected_rows, actual_rows):
    expected, actual = index(expected_rows), index(actual_rows)
    return {
        "missing": sorted(expected.keys() - actual.keys()),
        "unexpected": sorted(actual.keys() - expected.keys()),
        "changed": [
            {"event_id": key, "expected": expected[key], "actual": actual[key]}
            for key in sorted(expected.keys() & actual.keys())
            if expected[key] != actual[key]
        ],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("expected", type=Path)
    parser.add_argument("actual", type=Path)
    args = parser.parse_args()
    try:
        report = compare(json.loads(args.expected.read_text()), json.loads(args.actual.read_text()))
    except (OSError, ValueError, KeyError, TypeError) as exc:
        parser.error(str(exc))
    print(json.dumps(report, indent=2))
    return int(any(report.values()))


if __name__ == "__main__":
    raise SystemExit(main())
