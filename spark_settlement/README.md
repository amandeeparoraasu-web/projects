# PySpark settlement reconciliation

This batch job reconciles two synthetic payment feeds. It uses explicit input schemas, integer cents, an outer join, and a one-row-per-event output contract. Duplicate IDs are classified before amount and currency checks. A currency mismatch takes precedence over an amount mismatch.

Use Python 3.12, Java 17, and PySpark 4.0. From the repository root:

```sh
python -m pip install -r spark_settlement/requirements.txt
spark-submit --master local[2] spark_settlement/job.py \
  spark_settlement/internal.jsonl spark_settlement/processor.jsonl /tmp/settlement-parquet
```

The job writes Parquet and fails if the output path already exists. The fixture covers all six outcomes. To verify the Spark output against the [regression suite](../parity_suite/README.md):

```sh
python spark_settlement/verify.py /tmp/settlement-actual.json
python -m parity_suite.check parity_suite/expected.json /tmp/settlement-actual.json
```
