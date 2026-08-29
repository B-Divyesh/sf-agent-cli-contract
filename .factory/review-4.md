# Adversarial first-read review 4 — FAIL

Reviewed 29 August 2026 against `https://agent-cli-contract.sociobot.in` and a fresh clone at `/tmp/agent-cli-contract-review-4-rxhuXc/repo`.

## Verdict

**FAIL.** The product is clear, tryable, private by default, and technically verified. Eleven cartographic labels and headings still use metaphor or decorative text where the plain-words contract requires useful section names. A pass requires zero findings.

## Cold first read

Fresh, empty 390 × 844 and 1366 × 768 contexts were opened without scrolling.

| Question | Answer |
| --- | --- |
| What does it do? | It tests a CLI’s output, exit codes, errors, and repeat runs before coding agents depend on it. |
| For whom? | CLI maintainers whose commands are used by coding agents and scripts. |
| What first? | **Try it with sample data**, which says it opens a recorded run with four passing checks. |

The exact text was “**Test CLI contracts before agents depend on them**”, “**For CLI maintainers who need stable output, exits, and errors while keeping human-readable output unchanged.**”, and “**Try it with sample data** / **Opens a recorded run with four passing checks.**” The action measured 318 × 51 px at y=593 on mobile and 275 × 51 px at y=675 on desktop. No first-read blocking finding applies.

## Findings

### F-4-1 — Low — Decorative “Contract survey” first-screen label

**Location / quote:** Landing eyebrow, “**CONTRACT SURVEY / V0.1.0**”.

**Why:** It is a visual metaphor, not a version or product fact a cold reader can use.

**Fix:** Write “**Version 0.1.0**” or remove it.

### F-4-2 — Low — Unexplained coordinate rail

**Location / quote:** Hero rail, “**40° 46′ N**” and “**073° 59′ W**”.

**Why:** The coordinates have no CLI-contract meaning and consume first-screen attention.

**Fix:** Remove the text and retain the map artwork/line treatment only.

### F-4-3 — Low — “Checkpoints” conflicts with the product’s term “checks”

**Location / quote:** Hero caption, “**One declared command. Four contract checkpoints.**”

**Why:** The product calls the results checks and fixtures; “checkpoints” is a cartographic metaphor requiring translation.

**Fix:** “**One declared command. Four sample checks.**”

### F-4-4 — Low — “FIELD LOG / 01” does not name its section

**Location / quote:** Landing preview label, “**FIELD LOG / 01**”.

**Why:** It is invented field-note lore, not a useful section name in a heading list.

**Fix:** “**Sample report**” or remove it.

### F-4-5 — Low — Preview heading is a slogan

**Location / quote:** Landing `<h2>`, “**See the contract before an agent does**”.

**Why:** It does not name the shown report or say what result the visitor will review.

**Fix:** “**Review a sample contract report**”.

### F-4-6 — Low — “ROUTE / 02” is a metaphor label

**Location / quote:** Landing steps label, “**ROUTE / 02**”.

**Why:** It adds only visual-theme language and “route” also means web navigation.

**Fix:** “**How it works**” or remove it.

### F-4-7 — Low — “Survey a command” uses a metaphor instead of the task

**Location / quote:** Landing steps `<h2>`, “**Survey a command in three steps**”.

**Why:** The section is about testing a CLI contract; “survey” makes the reader infer that from the art.

**Fix:** “**Test a CLI contract in three steps**”.

### F-4-8 — Low — “BOUNDARY / 03” and “START / 04” are decorative labels

**Location / quote:** Landing labels, “**BOUNDARY / 03**” and “**START / 04**”.

**Why:** Neither names its section out of context; “Start” says less than “Install”.

**Fix:** “**Safety and privacy**” and “**Install**”, or remove the labels.

### F-4-9 — Low — Demo eyebrow uses unexplained field-test branding

**Location / quote:** Demo eyebrow, “**ISOLATED FIELD TEST**”.

**Why:** The useful fact is that the page is isolated sample data, not that it is a “field test”.

**Fix:** “**Sample data**”.

### F-4-10 — Low — The 404 uses map metaphors instead of a direct recovery path

**Location / quote:** `/missing-route`: “**Coordinate not found / 404**”, “**This route leaves the map**”, “**Return to the contract survey**”, and “**Return to the home route**”.

**Why:** A missing-page state needs direct recovery language, not a design-theme puzzle.

**Fix:** “**404**”, “**Page not found**”, “**This page may have moved. Return to the home page.**”, and “**Return home**”.

### F-4-11 — Low — Static terminal preview uses undocumented “contract survey” wording

**Location / quote:** Landing terminal bar, “**contract survey · local**”.

**Why:** It is copy in a terminal representation but not a CLI status or documented term.

**Fix:** “**local sample**” or omit the label.

## Copy audit

Words are whitespace-delimited. Commands, YAML, URLs, terminal output, version-only labels, and product names are code/labels, not prose sentences. No sentence exceeds 22 words or contains a banned marketing adjective. Headings and labels are listed because they must make sense out of context.

### Landing sentences and controls

| Copy | Words | Result |
| --- | ---: | --- |
| Test CLI contracts before agents depend on them | 8 | Pass |
| For CLI maintainers who need stable output, exits, and errors while keeping human-readable output unchanged. | 15 | Pass |
| Try it with sample data | 5 | Pass, result-naming action |
| Opens a recorded run with four passing checks. | 8 | Pass (`recorded-demo`) |
| Free and open source. | 4 | Pass (`free-mit`) |
| Runs locally. | 2 | Pass (`local-execution`) |
| Network use is opt-in. | 4 | Pass (`network-opt-in`) |
| One declared command. | 3 | Pass (`declared-commands`) |
| Four contract checkpoints. | 3 | F-4-3 |
| Approve a baseline once. | 4 | Pass (`snapshot-regression`) |
| Each later run names the output, exit, or JSON field that moved. | 12 | Pass (`snapshot-regression`, `nondeterminism`) |
| List the executable, fixed arguments, modes, and expected exits in YAML. | 11 | Pass |
| Each fixture starts in a new temporary directory with a small environment. | 12 | Pass (`isolated-fixtures`, `environment-isolation`) |
| Read Markdown in a pull request or parse the same result as JSON. | 13 | Pass (`report-formats`) |
| The runner executes only commands written in your contract. | 9 | Pass (`declared-commands`) |
| Project files stay outside each fixture. | 6 | Pass (`isolated-fixtures`) |
| Declared secret values become `[REDACTED]`. | 5 | Pass (`secret-redaction`) |
| Network use needs `allow_network: true`. | 5 | Pass (`network-opt-in`) |
| Requires Rust 1.85 or newer. | 5 | Pass (`rust-version`) |
| The binary has no telemetry. | 5 | Pass (`no-cli-telemetry`) |
| Test CLI contracts before agents depend on them. | 8 | Pass |

### Landing headings and labels

| Copy | Words | Result |
| --- | ---: | --- |
| Contract survey / v0.1.0 | 4 | F-4-1 |
| 40° 46′ N / 073° 59′ W | 6 | F-4-2 |
| The product, in use | 4 | Pass |
| FIELD LOG / 01 | 3 | F-4-4 |
| See the contract before an agent does | 7 | F-4-5 |
| ROUTE / 02 | 3 | F-4-6 |
| How it works | 3 | Pass |
| Survey a command in three steps | 6 | F-4-7 |
| Declare the command | 3 | Pass |
| Run isolated fixtures | 3 | Pass |
| Review named changes | 3 | Pass |
| BOUNDARY / 03 | 3 | F-4-8 |
| Limits and privacy | 3 | Pass |
| Run only commands you declare | 5 | Pass |
| START / 04 | 3 | F-4-8 |
| Install from source | 3 | Pass |
| Add the first contract in two commands | 7 | Pass |
| Copy install command | 3 | Pass, result-naming action |
| contract survey · local | 3 | F-4-11 |

### README sentences and instructions

| Copy | Words | Result |
| --- | ---: | --- |
| Test CLI output, exits, errors, and repeat runs before agents depend on them. | 13 | Pass |
| Agent CLI Contract is for maintainers whose commands run inside coding agents and scripts. | 14 | Pass |
| It executes declared fixtures in fresh temporary directories, records text, TTY, and JSON output, and writes Markdown and JSON reports. | 20 | Pass (`isolated-fixtures`, `mode-capture`, `report-formats`) |
| It is free, open source, local, and has no telemetry. | 10 | Pass (`free-mit`, `local-execution`, `no-cli-telemetry`) |
| Build the single binary with Rust 1.85 or newer: | 9 | Pass (`rust-version`) |
| The demo copies the bundled contract into a new temporary directory, runs its fixtures, and prints the report path. | 19 | Pass (`cli-demo-isolation`, `report-formats`) |
| It never reads or writes project data. | 7 | Pass (`cli-demo-isolation`) |
| See examples/agent-contract.yml for the same suite in source form. | 8 | Pass |
| The one-click website demo is available at the stated demo URL. | 9 | Pass, live route checked |
| Its terminal recording is generated by running the bundled CLI: | 9 | Pass (`recorded-demo`) |
| Create a starter file: | 4 | Pass (`starter-contract`) |
| Then describe only commands you already trust: | 7 | Pass |
| Record the first approved snapshots and then check them: | 10 | Pass (`snapshot-regression`) |
| Snapshots go into `snapshots/`. | 4 | Pass (`isolated-fixtures`) |
| Reports go into `.agent-contract/report.md` and `.agent-contract/report.json`. | 6 | Pass (`report-formats`) |
| The public format starts at version `1`. | 7 | Pass (`contract-format-version`) |
| `command` is an executable plus fixed arguments. | 7 | Pass (`direct-execution`) |
| No shell parses it. | 4 | Pass (`direct-execution`) |
| `modes` adds declared arguments for `text`, `tty`, or `json` runs. | 10 | Pass (`mode-capture`) |
| `fixtures[].args` contains the fixture arguments. | 5 | Pass |
| `fixtures[].files` writes inline sample files inside the temporary directory. | 9 | Pass (`inline-files`) |
| `expect.exit`, `stdout_contains`, and `stderr_contains` check the result. | 7 | Pass |
| `expect.error_code` reads `error.code` or `code` from JSON output. | 8 | Pass (`error-recovery`) |
| `recover_args` runs after an expected failure and must exit zero. | 10 | Pass (`error-recovery`) |
| `idempotent: true` runs the same fixture twice in one clean directory. | 11 | Pass (`idempotency`) |
| `detect_nondeterminism: true` compares two fresh runs and names changed JSON fields. | 11 | Pass (`nondeterminism`) |
| `allow_nondeterministic_fields` accepts known JSON paths such as `$.meta.duration_ms`. | 8 | Pass (`nondeterministic-field-allowlist`) |
| `allow_network: true` permits URLs and known network commands. | 8 | Pass (`network-opt-in`) |
| Network-shaped commands are rejected by default. | 6 | Pass (`network-opt-in`) |
| `timeout_ms` stops a fixture that exceeds its limit. | 8 | Pass (`fixture-timeout`) |
| The default is 10 seconds. | 5 | Pass (`default-timeout`) |
| `redact_env` lists extra environment variable names whose values must never appear in reports. | 13 | Pass (`secret-redaction`) |
| Run `agent-contract schema` for the complete JSON Schema. | 8 | Pass (`schema-output`) |
| Invalid or empty suites exit with code `2`. | 8 | Pass (`exit-codes`) |
| Contract failures exit with code `1`. | 6 | Pass (`exit-codes`) |
| Passing suites exit with code `0`. | 6 | Pass (`exit-codes`) |
| Add `--json` before the command for a script-readable summary. | 9 | Pass (`json-failure-document`) |
| Each fixture receives a new temporary working directory. | 8 | Pass (`isolated-fixtures`) |
| Idempotency checks share only their own temporary directory. | 8 | Pass (`idempotency`) |
| The runner uses direct process arguments, never a shell. | 9 | Pass (`direct-execution`) |
| It passes a small environment allowlist plus values declared in the contract. | 12 | Pass (`environment-isolation`) |
| Secret-shaped host variables are not passed. | 6 | Pass (`environment-isolation`) |
| Declared secret values are replaced with `[REDACTED]` in snapshots and reports. | 11 | Pass (`secret-redaction`) |
| Network use must be enabled per fixture. | 7 | Pass (`network-opt-in`) |
| Without it, URL arguments and known network executables are rejected, and the target process plus its children cannot open or connect sockets. | 22 | Pass (`network-opt-in`) |
| `AGENT_CONTRACT_NETWORK=disabled` is also set for tools that report their policy. | 10 | Pass (`network-opt-in`) |
| The runner executes only the literal command declared in the contract. | 9 | Pass (`declared-commands`, `direct-execution`) |
| `npm run build:site` writes the deployable site to `dist/site`. | 9 | Pass, build checked |
| `npm run build` also builds the release CLI. | 8 | Pass, build checked |
| No runtime service, account, tracking script, or network connection is used. | 11 | Pass (`no-cli-telemetry`) |
| Version `0.1.0`. | 2 | Pass (`rust-version`) |
| See `CHANGELOG.md` for released behavior. | 5 | Pass |
| MIT. | 1 | Pass (`free-mit`) |
| See `LICENSE`. | 2 | Pass |

README has no remaining copy finding or unlisted observable claim. Demo controls name their results; only its “Isolated field test” eyebrow is F-4-9.

## Demo, sandbox, and claims

- The one-click action opened `/?demo=1`; at 390 px the report heading began at y=578 and its first fixture row was visible. The sample is specific (`ridge-cli`; text, TTY, and JSON modes).
- “Replay recorded sample run” reloads self-hosted `terminal-recording.svg`; `agent-contract demo` and a transcript are adjacent. `recorded-demo` passed against a real fresh CLI demo.
- Changing the sample created only `localStorage['demo:report']`; Reset removed it. The banner remained sticky at y=69 after mobile scroll and included Reset plus exit.
- From a temporary project containing `sentinel=keep`, `agent-contract --json demo` reported a new `/tmp/agent-contract-demo-…` path and left the sentinel unchanged.
- Whole-demo request logging recorded only `https://agent-cli-contract.sociobot.in`; there were no page or console errors.
- All 30 manifest commands passed independently: `isolated-fixtures`, `mode-capture`, `snapshot-regression`, `nondeterminism`, `nondeterministic-field-allowlist`, `idempotency`, `inline-files`, `fixture-timeout`, `default-timeout`, `error-recovery`, `report-formats`, `secret-redaction`, `network-opt-in`, `demo-sandbox`, `no-third-party-data`, `recorded-demo`, `free-mit`, `no-cli-telemetry`, `local-execution`, `rust-version`, `starter-contract`, `copy-install-command`, `schema-output`, `contract-format-version`, `direct-execution`, `declared-commands`, `environment-isolation`, `cli-demo-isolation`, `exit-codes`, and `json-failure-document`.

## Earlier-review confirmation

I read every prior review, polish report, and handoff, and checked the repairs in current source/live behavior.

| Earlier IDs | Current confirmation |
| --- | --- |
| F-1-1 | Fixed: self-hosted recording, transcript, runnable demo command, accurate label, and `recorded-demo` pass. |
| F-1-2 | Fixed: source persists scroll; internal history test restores y=1200 and focuses `#page-title`. |
| F-1-3 | Fixed: the 390 px banner is sticky with both touch-size actions visible. |
| F-1-4 | Fixed: declared executable/arguments are consistently called **command**. |
| F-1-5 | Fixed: audience names human-readable output; safety heading names declared commands. |
| F-1-6 | Fixed: exit says “Leave demo and view install steps” and clears demo state. |
| F-1-7, F-1-8 | Fixed: `local-execution` and `default-timeout` both exist and pass. |
| F-1-9, F-1-10 | Fixed: future-compatibility and generated-command promises are absent/reduced to tested behavior. |
| F-1-11 | Fixed: `network-opt-in` tests both denied and explicitly allowed local access. |
| F-2-1 | Fixed: report begins at y=578 with a result row in the 844 px mobile viewport. |
| F-2-2 | Fixed: internal factory-release copy is absent. |
| F-2-3, F-2-4, F-2-5 | Fixed: allowlist, schema, and format-version claims exist and pass. |
| F-3-1 | Fixed: 390 px report has no horizontal overflow; browser suite covers every cell. |
| F-3-2, F-3-3, F-3-4 | Fixed: starter, clipboard, and minimum-Rust claims exist and pass. |

## Structure, quality, and missed leverage

- Direct `/`, `/demo`, `/privacy`, and `/terms` loads returned 200. `/missing-route` returned a styled HTTP 404. Every route had one h1/main, unique title/description/canonical, and the header/footer legal links. The only 404 `#main` crawl response is a same-document skip fragment on the intentional 404, not a dead link.
- Favicon, Apple icon, social card, robots, sitemap, CSP, and response headers are present. `npm test` (3 Rust + 38 Playwright), `npm run build`, `cargo fmt --check`, and strict Clippy passed in the clean clone. Built JS is 18.95 kB raw / 5.99 kB gzip.
- The cartographic artwork, paper palette, clipped signal-orange controls, and field-sheet layout match `.factory/design.md` and are distinct from a generic SaaS template. Only the text metaphors are at issue.
- No AI, import, export, or sync feature is missing: the brief implies report output and the product already writes Markdown and JSON. AI command generation would conflict with its declared-command safety boundary; no provider key or decorative AI feature exists.

## What would make this perfect

Replace or remove the decorative map language in F-4-1 through F-4-11 while keeping the visual identity in the artwork and layout. Then rerun the copy audit, clean-clone claim sweep, and browser suite. Only zero findings warrants PASS.
