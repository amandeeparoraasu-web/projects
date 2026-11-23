FROM python:3.12-slim
WORKDIR /app
COPY ledger_reconciliation.py .
COPY settlement_service/*.py settlement_service/
RUN mkdir /data && chown 10001:10001 /data
USER 10001:10001
EXPOSE 8080
ENTRYPOINT ["python", "-m", "settlement_service", "--host", "0.0.0.0", "--db", "/data/settlement.sqlite3"]
