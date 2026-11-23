"""Persist immutable reconciliation batches and reject conflicting retries."""
from contextlib import closing
import hashlib
import json
import sqlite3

from ledger_reconciliation import reconcile

MAX_ROWS = 10_000
MAX_CENTS = 10**12


class BatchConflict(ValueError):
    """An existing batch ID was submitted with different input."""


def normalize(payload):
    if not isinstance(payload, dict) or set(payload) != {"internal", "settlement"}:
        raise ValueError("Provide internal and settlement as objects keyed by transaction reference.")
    for name, ledger in payload.items():
        if not isinstance(ledger, dict) or len(ledger) > MAX_ROWS:
            raise ValueError(f"{name} must be an object with at most {MAX_ROWS} entries.")
        for ref, amount in ledger.items():
            if not ref.strip() or len(ref) > 64 or type(amount) is not int or abs(amount) > MAX_CENTS:
                raise ValueError(f"{name} requires nonempty references and integer cent amounts.")
    return payload


class BatchStore:
    def __init__(self, path):
        self.path = path
        with closing(self.connect()) as db, db:
            db.execute("PRAGMA journal_mode=WAL")
            db.execute("""
                CREATE TABLE IF NOT EXISTS batches (
                    id TEXT PRIMARY KEY,
                    request_hash TEXT NOT NULL,
                    report TEXT NOT NULL
                )
            """)

    def connect(self):
        return sqlite3.connect(self.path, timeout=10)

    def submit(self, batch_id, payload):
        inputs = normalize(payload)
        digest = hashlib.sha256(json.dumps(inputs, sort_keys=True).encode()).hexdigest()
        rows = reconcile(inputs["internal"], inputs["settlement"])
        totals = {}
        for row in rows:
            totals[row["status"]] = totals.get(row["status"], 0) + 1
        report = {
            "batch_id": batch_id,
            "counts": totals,
            "matched": totals.get("matched", 0),
            "exceptions": [row for row in rows if row["status"] != "matched"],
        }
        with closing(self.connect()) as db, db:
            db.execute("BEGIN IMMEDIATE")
            prior = db.execute(
                "SELECT request_hash, report FROM batches WHERE id = ?", (batch_id,)
            ).fetchone()
            if prior:
                if prior[0] != digest:
                    raise BatchConflict("This batch ID is already associated with different input.")
                return False, json.loads(prior[1])
            db.execute(
                "INSERT INTO batches VALUES (?, ?, ?)", (batch_id, digest, json.dumps(report))
            )
        return True, report

    def get(self, batch_id):
        with closing(self.connect()) as db:
            row = db.execute("SELECT report FROM batches WHERE id = ?", (batch_id,)).fetchone()
        return json.loads(row[0]) if row else None
