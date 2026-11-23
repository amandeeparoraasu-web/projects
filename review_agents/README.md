# Settlement review agents

An evidence agent parses a parity report and extracts event IDs. A routing agent turns findings into a review queue using a fixed playbook. An optional local LLM agent drafts an advisory incident brief from the queue. The structured evidence remains available alongside the draft for human verification.

From the repository root, using Python 3.12 or newer:

```sh
python -m parity_suite.check parity_suite/expected.json /tmp/settlement-actual.json > /tmp/parity-report.json
python review_agents/triage.py /tmp/parity-report.json
```

A parity exit code of 1 still produces a valid report. For the LLM mode, start a local Ollama server, install a model of your choice, then run:

```sh
python review_agents/brief.py /tmp/parity-report.json --model YOUR_LOCAL_MODEL
```

The model call is skipped when the evidence queue is empty. Both examples use synthetic data. The agents produce local JSON and have no tools for modifying source systems or contacting reviewers.
