import json
from pathlib import Path
import unittest

from parity_suite.check import compare
from review_agents import triage

ROOT = Path(__file__).resolve().parents[1]


class SettlementParityTests(unittest.TestCase):
    def setUp(self):
        self.golden = json.loads((ROOT / "parity_suite" / "expected.json").read_text())

    def test_row_order_does_not_matter(self):
        report = compare(self.golden, reversed(self.golden))
        self.assertEqual(triage.route(triage.inspect(report)), {"state": "clear", "queue": []})

    def test_missing_unexpected_and_changed_rows_are_routed(self):
        candidate = [
            {**self.golden[0], "status": "amount_mismatch"},
            {**self.golden[1], "event_id": "extra"},
            *self.golden[2:],
        ]
        report = compare(self.golden, candidate)
        self.assertEqual(report["missing"], ["amount"])
        self.assertEqual(report["unexpected"], ["extra"])
        self.assertEqual([item["event_id"] for item in report["changed"]], ["match"])
        result = triage.route(triage.inspect(report))
        self.assertEqual(result["state"], "needs_review")
        self.assertEqual([item["owner"] for item in result["queue"]],
                         ["data-ingestion", "data-ingestion", "reconciliation"])

    def test_duplicate_output_is_rejected(self):
        with self.assertRaisesRegex(ValueError, "duplicate"):
            compare(self.golden, self.golden + self.golden[:1])

    def test_invalid_count_is_rejected(self):
        with self.assertRaisesRegex(ValueError, "internal_count"):
            compare(self.golden, [{**self.golden[0], "internal_count": True}])
