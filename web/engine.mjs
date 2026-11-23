export function replay(events, delay) {
  let latest = -Infinity, late = 0, duplicate = 0;
  const windows = new Map();
  for (const [id, timestamp, cents] of events) {
    const start = Math.floor(timestamp / 60) * 60;
    if (start + 60 <= latest - delay) { late++; continue; }
    latest = Math.max(latest, timestamp);
    const bucket = windows.get(start) ?? new Map();
    if (bucket.has(id)) duplicate++;
    else bucket.set(id, cents);
    windows.set(start, bucket);
  }
  const rows = [...windows].sort(([a], [b]) => a-b).map(([start, bucket]) =>
    [start, bucket.size, [...bucket.values()].reduce((total, value) => total + value, 0)]);
  return { rows, late, duplicate };
}

export function reconcile(internal, settlement) {
  return [...new Set([...Object.keys(internal), ...Object.keys(settlement)])].sort().map(id => {
    const left = internal[id], right = settlement[id];
    const status = left === undefined ? "Missing internally" : right === undefined ? "Missing at settlement" :
      left === right ? "Matched" : "Amount mismatch";
    return [id, left ?? "—", right ?? "—", status];
  });
}

export function compareSchemas(previous, candidate) {
  return [...new Set([...Object.keys(previous), ...Object.keys(candidate)])].sort().map(name => {
    const before = previous[name], after = candidate[name];
    const status = before === undefined ? "Added" : after === undefined ? "Removed" :
      before === after ? "Unchanged" : "Type changed";
    return [name, before ?? "—", after ?? "—", status];
  });
}
