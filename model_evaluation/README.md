# Cost-sensitive model evaluation

Evaluate how a decision threshold changes false alarms and missed detections. The threshold is selected on a validation CSV using explicit costs. A separate holdout CSV measures performance overall and by segment. The example uses synthetic scores rather than training a new model.

From the repository root:

```sh
python3 -m model_evaluation model_evaluation/validation.csv model_evaluation/holdout.csv
```

With default costs of 5 per miss and 1 per false alarm, validation selects 0.49. On the six holdout rows there are two true positives, one false positive, two true negatives, and one false negative. A metric with a zero denominator is reported as null. Try lowering the missed-detection cost and compare the resulting threshold. These fixtures demonstrate the evaluation procedure and are too small for statistical or operational claims.
