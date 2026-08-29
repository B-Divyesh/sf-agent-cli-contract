# Landing copy audit

Audited 29 August 2026 against the rendered `/` route. Words split on spaces; code tokens count as one word.

## First screen

| Copy | Words | Result |
| --- | ---: | --- |
| Test CLI contracts before agents depend on them | 8 | Pass |
| For CLI maintainers who need stable output, exits, and errors while keeping human-readable output unchanged. | 15 | Pass |
| Try it with sample data | 5 | Pass |
| Opens a recorded run with four passing checks. | 8 | Pass |
| Free and open source. | 4 | Pass |
| Runs locally. | 2 | Pass (`local-execution`) |
| Network use is opt-in. | 4 | Pass (`network-opt-in`) |
| One declared command. | 3 | Pass |
| Four sample checks. | 3 | Pass |

The headline states the job in eight words. The next sentence names CLI maintainers and the changed situation. The action and outcome fit one spoken breath.

## Remaining landing sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Approve a baseline once. | 4 | Pass |
| Each later run names the output, exit, or JSON field that moved. | 12 | Pass |
| List the executable, fixed arguments, modes, and expected exits in YAML. | 11 | Pass |
| Each fixture starts in a new temporary directory with a small environment. | 12 | Pass |
| Read Markdown in a pull request or parse the same result as JSON. | 13 | Pass |
| The runner executes only commands written in your contract. | 9 | Pass |
| Project files stay outside each fixture. | 6 | Pass |
| Declared secret values become `[REDACTED]`. | 5 | Pass |
| Network use needs `allow_network: true`. | 5 | Pass |
| Requires Rust 1.85 or newer. | 5 | Pass |
| The binary has no telemetry. | 5 | Pass |
| Test CLI contracts before agents depend on them. | 8 | Pass |

## Headings, labels, and buttons

All fragments are under 10 words. They include “Version 0.1.0,” “Sample report,” “Review a sample contract report,” “How it works,” “Test a CLI contract in three steps,” “Safety and privacy,” “Install,” “Run only commands you declare,” “Add the first contract in two commands,” “Copy install command,” “Declare the command,” “Run isolated fixtures,” and “Review named changes.”

## Plain-language label check

| Location | Copy | Result |
| --- | --- | --- |
| First-screen version label | Version 0.1.0 | Pass |
| Hero caption | One declared command. Four sample checks. | Pass |
| Sample preview | Sample report / Review a sample contract report | Pass |
| Steps | How it works / Test a CLI contract in three steps | Pass |
| Safety section | Safety and privacy | Pass |
| Install section | Install | Pass |
| Demo eyebrow | Sample data | Pass |
| Missing-page state | 404 / Page not found / Return home | Pass |
| Terminal preview | local sample | Pass |

The coordinate rail has no text. Map language remains visual only in the original art and its layout treatment.

## Banned-word scan

No landing sentence, heading, label, or button contains: leverage, seamless, effortless, robust, powerful, intuitive, reimagine, supercharge, unlock, delightful, journey, ecosystem, or AI-powered.

No sentence exceeds 22 words. The average audited sentence length is below 10 words.

## Terminology table

| Concept | One term used |
| --- | --- |
| Executable plus fixed arguments | command |
| Declarative test unit | fixture |
| YAML definition | contract |
| Approved output | snapshot |
| Human-readable result | Markdown report |
| Script-readable result | JSON report |
| Captured terminal presentation | TTY mode |
| Known changing value | nondeterministic field |
| Isolated run location | temporary directory |
| Browser try-out | demo |

## Interaction feedback

| Copy | Words | Result |
| --- | ---: | --- |
| Copied install command. | 3 | Pass (`copy-install-command`) |
| Copy failed. | 2 | Pass (`copy-install-command`) |
| Select the displayed command and copy it manually. | 8 | Pass (`copy-install-command`) |
| Copied demo command. | 3 | Pass |

Each clipboard outcome is exposed through a polite status region. The failure says what happened and gives one manual next step.

## Catalog description

"Test a CLI's output, exit codes, errors, and repeat runs before agents depend on it."

The description begins with a verb, contains 15 words, uses 84 characters, and contains no banned word.

## README claim audit

| Copy | Words | Result |
| --- | ---: | --- |
| The public format starts at version `1`. | 7 | Pass (`contract-format-version`) |
| `allow_nondeterministic_fields` accepts known JSON paths such as `$.meta.duration_ms`. | 8 | Pass (`nondeterministic-field-allowlist`) |
| Run `agent-contract schema` for the complete JSON Schema. | 8 | Pass (`schema-output`) |
| Create a starter file. | 4 | Pass (`starter-contract`) |
| Build the single binary with Rust 1.85 or newer. | 9 | Pass (`rust-version`, compiled with Rust 1.85.0) |

The internal release-process sentence remains removed. Every README sentence that describes a result a maintainer can rely on maps to a claim in `.factory/claims.json`.
