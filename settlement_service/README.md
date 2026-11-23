# Settlement reconciliation service

Compare an internal ledger with a processor's settlement ledger. The service records immutable batch reports in SQLite so callers can retry a batch after a network interruption without creating a second report.

## Start the service

From the repository root, run:

```sh
python3 -m settlement_service --db settlement.sqlite3
```

In another terminal, submit the synthetic example and retrieve the report:

```sh
curl -i -X PUT http://127.0.0.1:8080/v1/batches/demo-001 \
  -H 'Content-Type: application/json' \
  -d '{"internal":{"TX-1":8500,"TX-2":12750},"settlement":{"TX-1":8500,"TX-2":12400}}'
curl -i http://127.0.0.1:8080/v1/batches/demo-001
```

The first request returns HTTP 201 with one match and one amount mismatch. An identical retry returns HTTP 200 with the stored report. A retry that changes the input returns HTTP 409. The report also distinguishes records missing from either ledger.

## Architecture and trade-offs

The flow is **HTTP → input validation → reconciliation → SQLite transaction → report**. Integer cents avoid floating-point rounding. Each batch ID is unique, and its normalized payload hash distinguishes duplicate delivery from conflicting input. SQLite serializes writers while WAL permits concurrent readers. Matching is by transaction reference, with a deterministic sort for results. The service caps payload size and records per ledger.

This reference implementation is scoped to one service instance with a persistent disk. It defaults to loopback. An externally exposed deployment would require authentication, TLS, monitoring, backup and retention policies. The public Engineering Lab uses synthetic in-browser examples.

## Container and verification

```sh
docker build -f settlement_service/Dockerfile -t settlement-demo .
docker run --rm -p 127.0.0.1:8080:8080 -v settlement-demo-data:/data settlement-demo
python3 -m unittest -v test_settlement_service
```

The integration tests use an ephemeral port and disposable database. They exercise first delivery, repeat delivery, changed payloads, concurrent retries, validation, and persistence.
