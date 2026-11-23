"""Event-time aggregation with bounded deduplication and late-event tracking."""
import json
import sys

WINDOW_SECONDS = 60
ALLOWED_LATENESS_SECONDS = 15


def summarize(events):
    latest = -1
    open_windows = {}
    emitted = []
    rejected = 0
    duplicates = 0
    late = 0
    for event in events:
        if (
            not isinstance(event, dict)
            or not isinstance(event.get("id"), str)
            or not event["id"]
            or type(event.get("timestamp")) is not int
            or event["timestamp"] < 0
            or type(event.get("cents")) is not int
            or event["cents"] < 0
        ):
            rejected += 1
            continue
        timestamp = event["timestamp"]
        start = timestamp // WINDOW_SECONDS * WINDOW_SECONDS
        if start + WINDOW_SECONDS <= latest - ALLOWED_LATENESS_SECONDS:
            late += 1
            continue
        latest = max(latest, timestamp)
        bucket = open_windows.setdefault(start, {})
        if event["id"] in bucket:
            duplicates += 1
        else:
            bucket[event["id"]] = event["cents"]
        closed = [
            key for key in open_windows
            if key + WINDOW_SECONDS <= latest - ALLOWED_LATENESS_SECONDS
        ]
        for key in sorted(closed):
            emitted.append(window_result(key, open_windows.pop(key)))
    for key, bucket in sorted(open_windows.items()):
        emitted.append(window_result(key, bucket))
    return {"windows": emitted, "duplicates": duplicates, "late": late, "invalid": rejected}


def window_result(start, bucket):
    return {"start": start, "transactions": len(bucket), "total_cents": sum(bucket.values())}


def parse_lines(lines):
    for line in lines:
        try:
            yield json.loads(line)
        except ValueError:
            yield None


if __name__ == "__main__":
    print(json.dumps(summarize(parse_lines(sys.stdin)), indent=2))
