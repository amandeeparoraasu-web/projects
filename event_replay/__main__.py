"""Replay an append-only JSONL transaction log from a durable checkpoint."""
import argparse
from contextlib import closing
import json
from pathlib import Path
import sqlite3


def replay(source, database):
    """Apply complete lines atomically. Malformed records leave the checkpoint intact."""
    with source.open("rb") as feed, closing(sqlite3.connect(database)) as db, db:
        db.execute("CREATE TABLE IF NOT EXISTS checkpoint (position INTEGER NOT NULL)")
        db.execute("CREATE TABLE IF NOT EXISTS transactions (id TEXT PRIMARY KEY, cents INTEGER NOT NULL)")
        db.execute("BEGIN IMMEDIATE")
        checkpoint = db.execute("SELECT position FROM checkpoint").fetchone()
        offset = checkpoint[0] if checkpoint else 0
        if source.stat().st_size < offset:
            raise ValueError("Source is shorter than the saved checkpoint.")
        feed.seek(offset)
        while line := feed.readline():
            if not line.endswith(b"\n"):
                break
            record = json.loads(line)
            if (not isinstance(record, dict) or not isinstance(record.get("id"), str)
                    or not record["id"] or type(record.get("cents")) is not int
                    or not 0 <= record["cents"] <= 10**12):
                raise ValueError(f"Invalid transaction at byte {offset}.")
            prior = db.execute("SELECT cents FROM transactions WHERE id = ?", (record["id"],)).fetchone()
            if prior and prior[0] != record["cents"]:
                raise ValueError(f"Conflicting duplicate at byte {offset}.")
            if prior is None:
                db.execute("INSERT INTO transactions VALUES (?, ?)", (record["id"], record["cents"]))
            offset = feed.tell()
        db.execute("DELETE FROM checkpoint")
        db.execute("INSERT INTO checkpoint VALUES (?)", (offset,))
        count, total = db.execute("SELECT COUNT(*), COALESCE(SUM(cents), 0) FROM transactions").fetchone()
    return {"checkpoint_bytes": offset, "transactions": count, "total_cents": total}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("database", type=Path)
    args = parser.parse_args()
    try:
        result = replay(args.source, args.database)
    except (OSError, ValueError, sqlite3.Error) as error:
        parser.exit(1, f"{error}\n")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
