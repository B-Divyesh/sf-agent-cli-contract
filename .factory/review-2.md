# Adversarial first-read review 2 — FAIL

Reviewed 28 August 2026 against `https://agent-cli-contract.sociobot.in` and checkout `3ec47269c9a627ade759d7646685acbdf065e033`.

## Verdict

**FAIL.** The declared-claim gate passed, but the mobile demo does not show its result in the first viewport and four README claims have no matching claim entry. A pass requires zero findings.

## Cold first read

Fresh browser contexts were opened without scrolling at 390 × 844 and 1366 × 768.

| Question | First-read answer |
| --- | --- |
| What does it do? | It tests a CLI's output, exits, errors, and repeat runs before coding agents use it. |
| For whom? | CLI maintainers whose commands are used by coding agents and scripts. |
| What should I click first? | **Try it with sample data**. The adjacent text says it opens a recorded four-check run. |

The text that made this clear was: “**Test CLI contracts before agents depend on them**”, “**For CLI maintainers who need stable output, exits, and errors while keeping human-readable output unchanged.**”, and “**Try it with sample data** / **Opens a recorded run with four passing checks.**” The action was visible at y=593–644 on 390 px and y=675–726 on desktop. All three facts were visible before the desktop 768 px fold; the mobile facts were also visible. No first-read blocking finding applies to the landing page.

## Findings

### F-2-1 — BLOCKING — The mobile demo result is below the first viewport

**Location / evidence:** Open `/?demo=1` cold at 390 × 844. The demo report containing “**All four contract checks pass**” starts at y=922.6, below the 844 px viewport. The fixture sheet starts at y=644.8, so only part of the YAML is visible after the heading and controls. `site/src/main.ts` renders `.fixture-sheet` before `[data-report-host]`; `site/src/style.css` stacks those panels at the mobile breakpoint.

**Why this fails:** The one-click path reaches a page called “Review a complete CLI contract run”, but a phone visitor cannot see the actual sample run, its four fixture rows, or its PASS result without another scroll. The required first screen after entering a demo must already show the product being used with realistic sample data. A partial contract definition is not the promised result.

**Concrete fix:** At widths up to 520 px, put a compact visible report summary (PASS 4, the four fixture names/modes, and one changed-state affordance) above or alongside the fixture sheet, or reduce the intro so the report begins within 844 px. Add a 390 × 844 test that follows **Try it with sample data** and asserts both the report heading and at least one result row are inside the initial viewport.

### F-2-2 — Low — Internal “factory” release language is unexplained and unlisted

**Location / quote:** README line 18: “**The factory can publish the ready package with `cargo package` after release review.**”

**Why this fails:** “The factory” is not defined for a CLI maintainer and the sentence describes an internal future release process rather than an action the reader can take. It also makes a delivery promise with no `.factory/claims.json` entry.

**Concrete fix:** Delete the sentence. If release availability must be documented, add a verified release-status statement with a matching claim test.

### F-2-3 — Low — Allowlisted nondeterministic fields are an unlisted claim

**Location / quote:** README line 83: “**`allow_nondeterministic_fields` accepts known JSON paths such as `$.meta.duration_ms`.**”

**Why this fails:** `nondeterminism` proves that a changing field is named; it does not prove that listing a field allows a run to pass. A maintainer could rely on the documented escape hatch without a claim entry that describes and tests it.

**Concrete fix:** Add a `nondeterministic-field-allowlist` claim and tagged clean-fixture test that changes only `$.meta.duration_ms`, lists that path, and verifies the check passes. Alternatively remove the sentence.

### F-2-4 — Low — The JSON Schema command is an unlisted claim

**Location / quote:** README line 88: “**Run `agent-contract schema` for the complete JSON Schema.**”

**Why this fails:** This is a result a reader can rely on, but there is no claim entry or tagged test for the command and its schema output.

**Concrete fix:** Add a `schema-output` claim and tagged test that runs the command, parses JSON, and verifies version 1 plus every documented contract field. Do not describe the output as complete until that test exists.

### F-2-5 — Low — The documented contract version is an unlisted claim

**Location / quote:** README line 72: “**The public format starts at version `1`.**”

**Why this fails:** This protocol promise has no specific claim entry. The current exit-code and Rust-version tests do not assert that version 1 is accepted and another version is rejected with the documented guidance.

**Concrete fix:** Add a `contract-format-version` claim and tagged test that accepts a version-1 fixture, rejects version 2, and checks the `schema` output declares version 1.

## Copy audit

Words are whitespace-delimited. Commands, YAML, terminal rows, URLs, and version-only labels are executable syntax or labels rather than sentences; they are noted separately. All displayed sentences are at or below 22 words. No banned marketing adjective appeared. Technical terms (`TTY`, YAML, JSON, fixture, snapshot, and idempotent) identify documented CLI concepts and are explained by adjacent copy.

### Landing page sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Test CLI contracts before agents depend on them | 8 | Pass |
| For CLI maintainers who need stable output, exits, and errors while keeping human-readable output unchanged. | 15 | Pass |
| Try it with sample data | 5 | Pass |
| Opens a recorded run with four passing checks. | 8 | Pass |
| Free and open source. | 4 | Pass (`free-mit`) |
| Runs locally. | 2 | Pass (`local-execution`) |
| Network use is opt-in. | 4 | Pass (`network-opt-in`) |
| One declared command. | 3 | Pass |
| Four contract checkpoints. | 3 | Sample label |
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

Landing headings, labels, and button labels were also checked: “The product, in use” (4), “See the contract before an agent does” (7), “Survey a command in three steps” (6), “Declare the command” (3), “Run isolated fixtures” (3), “Review named changes” (3), “Limits and privacy” (3), “Run only commands you declare” (5), “Temporary workspaces” (2), “Secret redaction” (2), “Explicit network” (2), “Install from source” (3), “Add the first contract in two commands” (7), and “Copy install command” (3). They are meaningful out of context, use `command` consistently, and the buttons name their results. “Contract survey / v0.1.0”, field labels, the terminal transcript, and “Built by Param Factory · v0.1.0” are non-sentence labels.

### README sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Test CLI output, exits, errors, and repeat runs before agents depend on them. | 13 | Pass |
| Agent CLI Contract is for maintainers whose commands run inside coding agents and scripts. | 14 | Pass |
| It executes declared fixtures in fresh temporary directories, records text, TTY, and JSON output, and writes Markdown and JSON reports. | 20 | Pass |
| It is free, open source, local, and has no telemetry. | 10 | Pass |
| Build the single binary with Rust 1.85 or newer: | 9 | Pass (`rust-version`) |
| The factory can publish the ready package with `cargo package` after release review. | 13 | Flag F-2-2 |
| The demo copies the bundled contract into a new temporary directory, runs its fixtures, and prints the report path. | 19 | Pass (`cli-demo-isolation`, `report-formats`) |
| It never reads or writes project data. | 7 | Pass (`cli-demo-isolation`) |
| See `examples/agent-contract.yml` for the same suite in source form. | 8 | Pass |
| The one-click website demo is available at `https://agent-cli-contract.sociobot.in/?demo=1`. | 7 | Pass |
| Its terminal recording is generated by running the bundled CLI: | 9 | Pass (`recorded-demo`) |
| Create a starter file: | 4 | Instruction heading |
| Then describe only commands you already trust: | 7 | Instruction |
| Record the first approved snapshots and then check them: | 10 | Pass (`snapshot-regression`) |
| Snapshots go into `snapshots/`. | 4 | Pass (`isolated-fixtures`) |
| Reports go into `.agent-contract/report.md` and `.agent-contract/report.json`. | 6 | Pass (`report-formats`) |
| The public format starts at version `1`. | 7 | Flag F-2-5 |
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
| `allow_nondeterministic_fields` accepts known JSON paths such as `$.meta.duration_ms`. | 8 | Flag F-2-3 |
| `allow_network: true` permits URLs and known network commands. | 8 | Pass (`network-opt-in`) |
| Network-shaped commands are rejected by default. | 6 | Pass (`network-opt-in`) |
| `timeout_ms` stops a fixture that exceeds its limit. | 8 | Pass (`fixture-timeout`) |
| The default is 10 seconds. | 5 | Pass (`default-timeout`) |
| `redact_env` lists extra environment variable names whose values must never appear in reports. | 13 | Pass (`secret-redaction`) |
| Run `agent-contract schema` for the complete JSON Schema. | 8 | Flag F-2-4 |
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
| `AGENT_CONTRACT_NETWORK=disabled` is also set for tools that report their policy. | 10 | Covered by `local-execution` fixture output |
| The runner executes only the literal command declared in the contract. | 9 | Pass (`declared-commands`, `direct-execution`) |
| `npm run build:site` writes the deployable site to `dist/site`. | 9 | Build verified |
| `npm run build` also builds the release CLI. | 8 | Build verified |
| No runtime service, account, tracking script, or network connection is used. | 11 | Pass (`no-cli-telemetry`) |
| Version `0.1.0`. | 2 | Version label |
| See `CHANGELOG.md` for released behavior. | 5 | Pass |
| MIT. | 1 | Pass (`free-mit`) |
| See `LICENSE`. | 2 | Pass |

The README’s headings, commands, YAML, and shell snippets are labels or executable syntax, not additional prose sentences. No landing or README sentence exceeds the 22-word cap. The only terminology/copy flag is F-2-2.

## Demo and sandbox checks

- The landing action opens `/?demo=1` in one click. The page uses a specific `ridge-cli` fixture rather than placeholder data. F-2-1 applies because the report is below the phone viewport.
- The banner reads “Demo — sample data, nothing is saved” and contains **Reset demo** plus **Leave demo and view install steps**. At 390 px it remains sticky after scrolling; its controls measured 175 × 56 px.
- A fresh context with `real:sentinel=keep` changed only `demo:report=failed`. Reset removed every `demo:` key and preserved the real sentinel. Leaving the demo removed every `demo:` key and navigated to `/#install`.
- Browser request interception observed only `https://agent-cli-contract.sociobot.in` requests throughout the sample flow. After the initial service-worker visit, an offline reload still displayed “Review a complete CLI contract run”.
- From a temporary project with a sentinel, `agent-contract --json demo` reported `/tmp/agent-contract-demo-…` and left the sentinel unchanged. The bundled source is `examples/agent-contract.yml`.

## Claims gate

From fresh clone `/tmp/agent-cli-contract-review2-aA5xLm/repo`, all 25 `.factory/claims.json` commands passed independently. The final clean-clone checks also passed: `npm test` (3 Rust tests and 32 Playwright tests), `npm run build`, `cargo fmt --check`, and `cargo clippy --all-targets -- -D warnings`.

| Claim IDs | Result |
| --- | --- |
| `isolated-fixtures`, `mode-capture`, `snapshot-regression`, `nondeterminism`, `idempotency`, `inline-files`, `fixture-timeout`, `default-timeout` | Pass |
| `error-recovery`, `report-formats`, `secret-redaction`, `network-opt-in`, `demo-sandbox`, `no-third-party-data`, `recorded-demo` | Pass |
| `free-mit`, `no-cli-telemetry`, `local-execution`, `rust-version`, `direct-execution`, `declared-commands` | Pass |
| `environment-isolation`, `cli-demo-isolation`, `exit-codes`, `json-failure-document` | Pass |

F-2-2 through F-2-5 remain unlisted-claim findings even though the current listed commands pass.

## Earlier-review and handoff confirmation

I read `review-1.md`, `polish-1.md`, the prior handoff, and both verification reports. The previous fixes were checked in the live deployment and current source, not accepted from their status text.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 fake browser run | Fixed: the demo calls the control “Replay recorded sample run”, ships `terminal-recording.svg`, offers `agent-contract demo`, and `recorded-demo` passed against a fresh real demo. |
| F-1-2 Back lost scroll | Fixed: the live test restored y=1200 after Back and focused `#page-title`; source persists scroll coordinates in history state. |
| F-1-3 mobile banner was not persistent | Fixed: the live 390 px banner stayed at y=0 after scroll with both controls visible. |
| F-1-4 route/command terminology | Fixed: landing source and live copy use “command”. |
| F-1-5 opaque landing phrases | Fixed: the audience text names human-readable output and the boundary heading is “Run only commands you declare”. |
| F-1-6 vague exit action | Fixed: the control is “Leave demo and view install steps”. |
| F-1-7 local execution unlisted | Fixed: `local-execution` exists and passed. |
| F-1-8 default timeout unlisted | Fixed: `default-timeout` exists and passed. |
| F-1-9 future compatibility promise | Fixed: it is absent from the README. |
| F-1-10 generated-command promise | Fixed: it was reduced to the tested declared-command statement. |
| F-1-11 positive network opt-in untested | Fixed: `network-opt-in` tests both blocked and allowed local network use. |

The earlier verification failures for clean-clone tests, Node network bypass, JSON failure output, 390 px overflow, typechecking, touch targets, 404 status, skip-link focus, and immutable caching were also checked again. The current fresh-clone suite, network claim, 390 px width, route checks, keyboard behavior, and live headers confirm those repairs. F-2-1 is a new mobile first-viewport condition, not a regression of the sticky-banner fix.

## Structure, accessibility, and links

- `/`, `/demo`, `/privacy`, `/terms`, and `/missing-route` were opened directly. The first four returned 200; the last returned a styled real HTTP 404. Each had one `main`, one `h1`, a route-specific title, description, canonical URL, and Open Graph title. Axe found no serious or critical violations on those routes.
- The live titles are `Agent CLI Contract — test stable command output`, `Demo — Agent CLI Contract`, `Privacy — Agent CLI Contract`, `Terms — Agent CLI Contract`, and `Page not found — Agent CLI Contract`. The pages provide language, theme color, SVG favicon, Apple icon, social image, robots file, and sitemap.
- All discovered links resolved: `/`, `/demo`, `/?demo=1`, `/#install`, `/privacy`, and `/terms`. The header/footer remain consistent and include Privacy and Terms. The skip link moves focus to `main`; route changes announce and focus the next h1.
- The topographic map, ruled survey layout, clipped controls, paper palette, and 404 contours follow `.factory/design.md` and are distinct from a generic SaaS template. Assets, scripts, fonts, and recording are self-hosted. No decorative AI feature or provider key was found.

## Missed leverage

No extra AI feature is implied by the brief. Generating or editing declared commands with AI would weaken the stated safety model. The obvious report exports already exist as Markdown and JSON. No import, sync, or AI finding is warranted.

## What would make this perfect

Put a real sample result in the initial mobile demo viewport, remove the internal factory sentence, and add or remove the three remaining unlisted protocol/schema claims. Then rerun every clean-clone claim command plus the new 390 px initial-report test. Only then is a PASS available.
