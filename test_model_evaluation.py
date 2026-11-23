from pathlib import Path
import unittest

from model_evaluation.__main__ import evaluate, load_scores, report


class EvaluationTests(unittest.TestCase):
    def test_tunes_on_validation_then_reports_on_holdout(self):
        validation = load_scores(Path("model_evaluation/validation.csv"))
        holdout = load_scores(Path("model_evaluation/holdout.csv"))
        result = report(validation, holdout, 5, 1)
        self.assertEqual(result["threshold"], .49)
        actual = result["holdout"]
        self.assertEqual((actual["tp"], actual["fp"], actual["tn"], actual["fn"]), (2, 1, 2, 1))
        self.assertEqual(result["holdout_by_segment"]["mobile"]["n"], 3)

    def test_undefined_precision_is_null(self):
        self.assertIsNone(evaluate([(.1, 1, "web")], .9)["precision"])
