# Demo sandbox

## Browser

- URL: `https://agent-cli-contract.sociobot.in/demo` or `/demo` in local preview.
- Sample: a `ridge-cli` contract with text, real TTY, JSON, expected-error, recovery, repeat-run, and no-network checks.
- Entry state: the four-check passing report is already visible.
- Interaction: “Show a blocked change” swaps one JSON error code. “Run sample contract” restores the passing recorded result.
- Reset: “Reset demo” removes every browser key beginning with `demo:` and restores the original sample.
- Exit: “Start for real” removes the demo namespace and opens installation instructions.
- Storage namespace: `localStorage` keys beginning with `demo:`. No other browser storage is used.

## CLI

- Command: `agent-contract demo`.
- Sample source: `examples/agent-contract.yml`.
- Sandbox: a new directory named `agent-contract-demo-<pid>-<time>` below the operating-system temporary directory.
- Output: approved snapshots plus `.agent-contract/report.md` and `.agent-contract/report.json` inside that directory.
- Project data: the demo does not read or write the current project.
