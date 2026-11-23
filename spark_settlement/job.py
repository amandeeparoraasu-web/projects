"""Reconcile two synthetic payment feeds in Spark."""
import argparse

from pyspark.sql import SparkSession, functions as F

SCHEMA = "event_id STRING, amount_cents LONG, currency STRING"


def reconcile(spark, internal_path, processor_path):
    def read_feed(path, side):
        events = spark.read.schema(SCHEMA).option("mode", "FAILFAST").json(path)
        invalid = events.where(
            F.col("event_id").isNull()
            | (F.trim("event_id") == "")
            | F.col("amount_cents").isNull()
            | F.col("currency").isNull()
            | ~F.col("currency").rlike("^[A-Z]{3}$")
        )
        if invalid.limit(1).count():
            raise ValueError(f"{side} feed contains an invalid payment event")
        return events.groupBy("event_id").agg(
            F.count("*").alias(f"{side}_count"),
            F.first("amount_cents").alias(f"{side}_amount"),
            F.first("currency").alias(f"{side}_currency"),
        )

    internal = read_feed(internal_path, "internal")
    processor = read_feed(processor_path, "processor")
    joined = internal.join(processor, "event_id", "full_outer")
    status = (
        F.when((F.col("internal_count") > 1) | (F.col("processor_count") > 1), "duplicate")
        .when(F.col("internal_count").isNull(), "missing_internal")
        .when(F.col("processor_count").isNull(), "missing_processor")
        .when(F.col("internal_currency") != F.col("processor_currency"), "currency_mismatch")
        .when(F.col("internal_amount") != F.col("processor_amount"), "amount_mismatch")
        .otherwise("matched")
    )
    return joined.withColumn("status", status).select(
        "event_id", "internal_count", "processor_count", "status"
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("internal")
    parser.add_argument("processor")
    parser.add_argument("output", help="New output directory")
    args = parser.parse_args()
    spark = SparkSession.builder.appName("settlement-reconciliation").getOrCreate()
    try:
        reconcile(spark, args.internal, args.processor).write.mode("errorifexists").parquet(args.output)
    finally:
        spark.stop()


if __name__ == "__main__":
    main()
