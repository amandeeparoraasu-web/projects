"""Match two ledgers by reference and report missing or mismatched amounts."""
import argparse
import csv
import json
from pathlib import Path


def load_ledger(path):
    ledger = {}
    with path.open(newline="", encoding="utf-8") as source:
        for row in csv.DictReader(source):
            ref = row["reference"]
            if not ref or ref in ledger:
                raise ValueError(f"Missing or repeated reference in {path.name}: {ref!r}")
            ledger[ref] = int(row["cents"])
    return ledger


def reconcile(internal, settlement):
    return [
        {
            "reference": ref,
            "status": (
                "missing_internal" if ref not in internal else
                "missing_settlement" if ref not in settlement else
                "matched" if internal[ref] == settlement[ref] else "amount_mismatch"
            ),
            "internal_cents": internal.get(ref),
            "settlement_cents": settlement.get(ref),
        }
        for ref in sorted(internal.keys() | settlement.keys())
    ]


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("internal", type=Path)
    parser.add_argument("settlement", type=Path)
    args = parser.parse_args()
    print(json.dumps(reconcile(load_ledger(args.internal), load_ledger(args.settlement)), indent=2))
