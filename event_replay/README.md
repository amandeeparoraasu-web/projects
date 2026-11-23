# Transaction event replay

This example materializes an append-only file into SQLite. The write transaction includes both the materialized records and the byte checkpoint, so a failed batch rolls back both. The transaction ID is the deduplication key. A repeated ID with a different amount is a conflict.

From the repository root, run:

```sh
python3 -m event_replay event_replay/sample.jsonl /tmp/portfolio-replay.sqlite3
python3 -m event_replay event_replay/sample.jsonl /tmp/portfolio-replay.sqlite3
```

Both runs return two transactions totaling 6,400 cents. A partial final line is left for the next replay. Use one database per immutable append-only source. The example detects truncation below the checkpoint and assumes earlier bytes are preserved. Production ingestion would also need log rotation, source identity, bounded transaction sizes, and retention policies.
