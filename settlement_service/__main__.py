"""HTTP entry point for the settlement reference service."""
import argparse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import re
from urllib.parse import urlsplit

from .store import BatchConflict, BatchStore

BATCH_PATH = re.compile(r"/v1/batches/([A-Za-z0-9_-]{1,64})")
MAX_BODY = 2 * 1024 * 1024


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError("Duplicate JSON key.")
        result[key] = value
    return result


class Handler(BaseHTTPRequestHandler):
    def respond(self, status, payload, location=None):
        body = json.dumps(payload).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        if location:
            self.send_header("Location", location)
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = urlsplit(self.path).path
        if path == "/healthz":
            self.respond(200, {"status": "ok"})
            return
        match = BATCH_PATH.fullmatch(path)
        report = self.server.store.get(match[1]) if match else None
        self.respond(200, report) if report is not None else self.respond(404, {"error": "Batch not found."})

    def do_PUT(self):
        path = urlsplit(self.path).path
        match = BATCH_PATH.fullmatch(path)
        if not match:
            self.respond(404, {"error": "Unknown batch route."})
            return
        if self.headers.get_content_type() != "application/json":
            self.respond(415, {"error": "Use Content-Type: application/json."})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if not 0 < length <= MAX_BODY:
                self.respond(413, {"error": "Provide a JSON body no larger than 2 MiB."})
                return
            payload = json.loads(self.rfile.read(length), object_pairs_hook=unique_object)
            created, report = self.server.store.submit(match[1], payload)
        except BatchConflict as exc:
            self.respond(409, {"error": str(exc)})
            return
        except (ValueError, RecursionError) as exc:
            self.respond(400, {"error": str(exc)})
            return
        self.respond(201 if created else 200, report, path if created else None)


def make_server(host, port, db):
    server = ThreadingHTTPServer((host, port), Handler)
    server.store = BatchStore(db)
    return server


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8080)
    parser.add_argument("--db", default="settlement.sqlite3")
    args = parser.parse_args()
    with make_server(args.host, args.port, args.db) as server:
        server.serve_forever()
