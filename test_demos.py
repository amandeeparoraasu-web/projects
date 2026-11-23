import unittest
from pathlib import Path

from credit_rule_parity import verify
from federated_fraud import run
from transaction_stream import parse_lines, summarize


class DemoTests(unittest.TestCase):
    def test_stream_sample(self):
        with Path("transactions.jsonl").open() as source:
            result = summarize(parse_lines(source))
        self.assertEqual(result, {
            "windows": [
                {"start": 0, "transactions": 2, "total_cents": 1750},
                {"start": 60, "transactions": 1, "total_cents": 980},
            ],
            "duplicates": 1,
            "late": 1,
            "invalid": 1,
        })

    def test_stream_invalid_json_and_exact_watermark(self):
        events = parse_lines([
            '{"id":"a","timestamp":75,"cents":200}',
            '{bad',
            '{"id":"b","timestamp":59,"cents":100}',
        ])
        result = summarize(events)
        self.assertEqual(result["late"], 1)
        self.assertEqual(result["invalid"], 1)

    def test_federated_training_improves_holdout_loss(self):
        for seed in (42, 99):
            result = run(seed)
            self.assertLess(result["federated_log_loss"], result["baseline_log_loss"])
            self.assertEqual(result, run(seed))

    def test_legacy_rules_match_golden_fixtures(self):
        self.assertEqual(verify(), {"cases": 8, "failures": []})


if __name__ == "__main__":
    unittest.main()
