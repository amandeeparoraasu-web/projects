from pathlib import Path
from tempfile import TemporaryDirectory
import unittest

from event_replay.__main__ import replay


class EventReplayTests(unittest.TestCase):
    def test_partial_line_and_restart(self):
        with TemporaryDirectory() as directory:
            source = Path(directory, "log.jsonl")
            db = Path(directory, "test.sqlite3")
            source.write_bytes(b'{"id":"a","cents":7}\n{"id":"b","cents":')
            before = replay(source, db)
            self.assertEqual(before["transactions"], 1)
            self.assertEqual(replay(source, db), before)
            with source.open("ab") as output:
                output.write(b'8}\n{"id":"a","cents":7}\n')
            self.assertEqual(replay(source, db)["total_cents"], 15)

    def test_conflicting_batch_rolls_back(self):
        with TemporaryDirectory() as directory:
            source = Path(directory, "log.jsonl")
            db = Path(directory, "test.sqlite3")
            first = b'{"id":"a","cents":7}\n'
            source.write_bytes(first)
            before = replay(source, db)
            with source.open("ab") as output:
                output.write(b'{"id":"b","cents":3}\n{"id":"a","cents":8}\n')
            with self.assertRaisesRegex(ValueError, "Conflicting duplicate"):
                replay(source, db)
            source.write_bytes(first)
            self.assertEqual(replay(source, db), before)
