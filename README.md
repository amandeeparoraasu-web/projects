# Engineering portfolio

Three runnable demonstrations of financial data engineering and legacy modernization. The examples use synthetic transactions and original decision rules. They are portfolio demonstrations, separate from employer systems and published research implementations.

| Project | What it demonstrates | Run from the repository root |
| --- | --- | --- |
| Transaction stream | Event-time windows, a 15-second watermark delay, duplicate suppression within each window, and integer-cent totals | `python3 transaction_stream.py < transactions.jsonl` |
| Federated fraud model | Three simulated clients with different transaction distributions. The coordinator aggregates local logistic-regression updates, weighted by sample count. The demo compares held-out log loss before and after training. | `python3 federated_fraud.py` |
| Legacy credit-rule verification | A sample COBOL rule, a Python port, and golden cases covering threshold boundaries and rule precedence | `python3 credit_rule_parity.py` |

## Expected results

| Demo | Result with the included sample |
| --- | --- |
| Transaction stream | Two windows totaling 1,750 and 980 cents. One duplicate, one late event, and one invalid record. |
| Federated fraud model | Holdout log loss drops from 0.6931 to about 0.3950 after 30 rounds over three clients. |
| Legacy credit-rule verification | Eight golden cases pass, including delinquency taking precedence over utilization thresholds. |

## Run the checks

Python 3.10 or later. The Python demos use only the standard library.

```sh
python3 -m unittest -v
```

The stream demo expects JSON Lines with a transaction ID, a nonnegative integer timestamp in seconds, and a nonnegative integer amount in cents. Once a window closes, later events for it go into the late-event count. Its output is a finite-run summary.

The federated model runs locally in one process. It illustrates exchanging model updates and does not implement secure aggregation or differential privacy. The validation data is generated independently from the same simulated client distributions.

The parity runner checks a Python reference that expresses the COBOL rules and a separate Python port against fixed expected outcomes. To run the optional COBOL example with GnuCOBOL:

```sh
cobc -x legacy_credit_rule.cob -o /tmp/portfolio-credit-rule
printf '000\n090\n' | /tmp/portfolio-credit-rule
```

Expected decision: `HOLD`. The credit rules are synthetic and intended for software testing demonstrations.

[Professional portfolio](https://amandeeparora.com/)

Run `python3 verify_cobol.py /tmp/portfolio-credit-rule` to check the compiled program against all eight fixtures. The GitHub Actions workflow runs the Python tests and compiles the COBOL example on Ubuntu.

## More projects

### Ledger reconciliation

```sh
python3 ledger_reconciliation.py internal-ledger.csv settlement-ledger.csv
```

The example produces two matches, one amount mismatch, and one missing record on each side. A repeated transaction reference stops the run so it cannot silently overwrite another row.

### Schema compatibility

```sh
python3 schema_contract.py schema-v1.json schema-v2.json
```

The example adds a field and passes. A removed field or a changed type produces a readable difference and a nonzero exit status, so this checker can be used as a pre-deploy check.

### Engineering Lab

```sh
python3 -m http.server 8080 --bind 127.0.0.1 --directory web
```

Open http://127.0.0.1:8080 and try both scenarios in each demo. The web app runs without a backend or any external JavaScript dependencies. Cloudflare Pages can serve the contents of the `web/` directory directly.
