"""Choose a decision threshold on validation data and evaluate it on a holdout."""
import argparse
import csv
import json
import math
from pathlib import Path


def load_scores(path):
    with path.open(newline="", encoding="utf-8") as source:
        rows = [(float(r["score"]), int(r["label"]), r["segment"]) for r in csv.DictReader(source)]
    if not rows or any(not 0 <= score <= 1 or label not in (0, 1) or not segment
                       for score, label, segment in rows):
        raise ValueError("Expected scores in [0, 1], binary labels, and nonempty segments.")
    return rows


def evaluate(rows, threshold):
    tp = fp = tn = fn = 0
    for score, label, _ in rows:
        if score >= threshold:
            tp += label
            fp += 1 - label
        else:
            fn += label
            tn += 1 - label
    return {
        "n": tp + fp + tn + fn, "tp": tp, "fp": fp, "tn": tn, "fn": fn,
        "precision": tp / (tp + fp) if tp + fp else None,
        "recall": tp / (tp + fn) if tp + fn else None,
    }


def report(validation, holdout, missed_cost, false_alarm_cost):
    if any(not math.isfinite(x) or x < 0 for x in (missed_cost, false_alarm_cost)):
        raise ValueError("Costs must be finite and nonnegative.")
    thresholds = sorted({score for score, _, _ in validation} | {math.nextafter(1.0, math.inf)})
    def cost(threshold):
        m = evaluate(validation, threshold)
        return m["fn"] * missed_cost + m["fp"] * false_alarm_cost
    threshold = min(thresholds, key=lambda t: (cost(t), -t))
    segments = sorted({segment for _, _, segment in holdout})
    return {
        "threshold": threshold, "validation_cost": cost(threshold),
        "holdout": evaluate(holdout, threshold),
        "holdout_by_segment": {s: evaluate([r for r in holdout if r[2] == s], threshold)
                               for s in segments},
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("validation", type=Path)
    parser.add_argument("holdout", type=Path)
    parser.add_argument("--missed-cost", type=float, default=5)
    parser.add_argument("--false-alarm-cost", type=float, default=1)
    args = parser.parse_args()
    if args.validation.resolve() == args.holdout.resolve():
        parser.error("Provide separate validation and holdout files.")
    print(json.dumps(report(load_scores(args.validation), load_scores(args.holdout),
                            args.missed_cost, args.false_alarm_cost), indent=2))
