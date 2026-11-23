"""Run a local Spark integration check and export parity-suite input."""
import argparse
import json
from pathlib import Path

from pyspark.sql import SparkSession

from job import reconcile

HERE = Path(__file__).resolve().parent


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    spark = (
        SparkSession.builder.master("local[2]")
        .appName("settlement-regression")
        .config("spark.sql.shuffle.partitions", "2")
        .getOrCreate()
    )
    try:
        frame = reconcile(spark, str(HERE / "internal.jsonl"), str(HERE / "processor.jsonl"))
        results = [row.asDict() for row in frame.orderBy("event_id").collect()]
    finally:
        spark.stop()
    args.output.write_text(json.dumps(results, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
