import concurrent.futures
import json
from pathlib import Path
import tempfile
import threading
import unittest
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from settlement_service.__main__ import make_server


class SettlementAPITests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.db = Path(self.temp.name, "settlement.db")
        self.server = make_server("127.0.0.1", 0, self.db)
        self.addCleanup(self.server.server_close)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.addCleanup(self.stop)
        self.url = f"http://127.0.0.1:{self.server.server_port}/v1/batches/test"
        self.payload = {"internal": {"A": 100, "B": 200}, "settlement": {"A": 100, "B": 250}}

    def stop(self):
        self.server.shutdown()
        self.thread.join(timeout=5)

    def request(self, payload=None):
        req = (
            Request(self.url, data=json.dumps(payload).encode(), method="PUT",
                    headers={"Content-Type": "application/json"})
            if payload is not None else Request(self.url)
        )
        try:
            response = urlopen(req, timeout=5)
        except HTTPError as error:
            response = error
        with response:
            return response.code, json.load(response)

    def test_report_persists_and_retries_are_idempotent(self):
        self.assertEqual(self.request()[0], 404)
        status, result = self.request(self.payload)
        self.assertEqual(status, 201)
        self.assertEqual(result["counts"], {"matched": 1, "amount_mismatch": 1})
        self.assertEqual(self.request(self.payload), (200, result))
        self.assertEqual(self.request({"internal": {}, "settlement": {}})[0], 409)
        from settlement_service.store import BatchStore
        self.assertEqual(BatchStore(self.db).get("test"), result)
        self.assertEqual(self.request(), (200, result))

    def test_concurrent_retries_only_create_once(self):
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
            results = list(pool.map(self.request, [self.payload] * 4))
        self.assertEqual(sorted(code for code, _ in results), [200, 200, 200, 201])
        self.assertTrue(all(report == results[0][1] for _, report in results))

    def test_invalid_payload_cannot_create_a_batch(self):
        self.assertEqual(self.request({"internal": {"A": 1.5}, "settlement": {}})[0], 400)
        self.assertEqual(self.request()[0], 404)
