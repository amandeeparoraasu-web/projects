# Settlement regression suite

This suite compares an independent golden fixture with candidate output from the [PySpark job](../spark_settlement/README.md) or another implementation of the same output contract. It compares rows by event ID, validates counts and statuses, and reports missing, unexpected, and changed rows as JSON.

Run with Python 3.12 or newer from the repository root:

```sh
python -m unittest -v parity_suite.test_parity
python -m parity_suite.check parity_suite/expected.json parity_suite/expected.json
```

The CLI exits 0 for parity, 1 for a difference, and 2 for invalid input. Save a report and feed it to the [triage agents](../review_agents/README.md) to produce an evidence-linked review queue.
