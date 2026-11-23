"""Run all golden cases against a compiled copy of the sample COBOL rule."""
import argparse
import json
from pathlib import Path
import subprocess


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("executable", type=Path)
    executable = parser.parse_args().executable.resolve()
    cases = json.loads(Path(__file__).with_name("credit_fixtures.json").read_text())
    for case in cases:
        inputs = "{days_past_due:03d}\n{utilization_pct:03d}\n".format(**case)
        result = subprocess.run(
            [str(executable)], input=inputs, capture_output=True, text=True,
            timeout=5, check=True,
        )
        actual = result.stdout.strip()
        if actual != case["expected"]:
            raise SystemExit(f"COBOL mismatch for {case}: received {actual!r}")
    print(f"Passed {len(cases)} COBOL fixtures.")


if __name__ == "__main__":
    main()
