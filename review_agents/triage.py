"""Run local, rule-based agents over a settlement parity report."""
import argparse
import json
from pathlib import Path

PLAYBOOK = {
    "missing": ("data-ingestion", "Check the feed manifest and join-key mapping."),
    "unexpected": ("data-ingestion", "Check replay boundaries and upstream routing."),
    "changed": ("reconciliation", "Compare normalization and status rules for the affected IDs."),
}


def inspect(report):
    """Evidence agent validates the report and emits findings."""
    findings = []
    for kind in PLAYBOOK:
        entries = report[kind]
        if not isinstance(entries, list):
            raise ValueError(f"Expected a list for {kind}")
        for entry in entries:
            event_id = entry["event_id"] if kind == "changed" else entry
            if not isinstance(event_id, str) or not event_id.strip():
                raise ValueError("Invalid event identifier")
            findings.append({"kind": kind, "event_id": event_id})
    return findings


def route(findings):
    """Routing agent creates a review queue backed by a fixed playbook."""
    queue = []
    for kind, (owner, action) in PLAYBOOK.items():
        ids = sorted({item["event_id"] for item in findings if item["kind"] == kind})
        if ids:
            queue.append({"owner": owner, "finding": kind, "event_ids": ids, "next_step": action})
    return {"state": "needs_review" if queue else "clear", "queue": queue}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("report", type=Path)
    args = parser.parse_args()
    try:
        result = route(inspect(json.loads(args.report.read_text())))
    except (OSError, ValueError, KeyError, TypeError) as exc:
        parser.error(str(exc))
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
