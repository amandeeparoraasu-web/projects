"""Identify required fields removed and incompatible type changes."""
import argparse
import json
from pathlib import Path


def breaking_changes(previous, candidate):
    return [
        f"{name}: removed required field" if name not in candidate
        else f"{name}: {kind} changed to {candidate[name]}"
        for name, kind in sorted(previous.items())
        if candidate.get(name) != kind
    ]


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("previous", type=Path)
    parser.add_argument("candidate", type=Path)
    args = parser.parse_args()
    changes = breaking_changes(json.loads(args.previous.read_text()), json.loads(args.candidate.read_text()))
    print(json.dumps({"compatible": not changes, "breaking_changes": changes}, indent=2))
    raise SystemExit(bool(changes))
