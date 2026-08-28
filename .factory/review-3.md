# Adversarial first-read review 3 — FAIL

Reviewed 28 August 2026 against `https://agent-cli-contract.sociobot.in` and checkout `89ea1cff50c9b05bcd78a5e3729708e47a222dee`.

## Verdict

**FAIL.** The first read, demo entry, sandbox isolation, CLI behavior, route structure, and all 28 listed claim commands pass. The 390 px demo still has a serious keyboard-accessibility failure, two public onboarding actions are absent from the claims manifest, and the minimum-Rust claim test does not run the claimed toolchain. A pass requires zero findings.

## Cold first read

I opened fresh browser contexts at 390 × 844 and 1366 × 768. I recorded this before scrolling:

| Question | First-read answer |
| --- | --- |
| What does this do? | It tests a CLI contract for stable output, exits, and errors before coding agents depend on it. |
| For whom? | CLI maintainers whose commands run inside coding agents and scripts. |
| What should I click first? | **Try it with sample data**, which says it opens a recorded four-check run. |

The exact first-screen copy was “**Test CLI contracts before agents depend on them**,” “**For CLI maintainers who need stable output, exits, and errors while keeping human-readable output unchanged**,” and “**Try it with sample data** / **Opens a recorded run with four passing checks.**” At 390 px, the action ended at y=644 and all three facts ended at y=785. At 1366 × 768, they ended at y=726 and y=760. All required information was visible without scrolling. This part passes.

## Findings

### F-3-1 — BLOCKING — The mobile result table cannot be scrolled with a keyboard

**Exact location:** Live `/demo` and `/?demo=1` at 390 px; `<div class="report-table" role="table" aria-label="Fixture results">`; `site/src/style.css:126`.

**Evidence:** The mobile rule makes `.report-table` horizontally scrollable and gives every row a 540 px minimum width, while the visible report is about 316 px wide. Playwright Axe reports `scrollable-region-focusable` at serious impact, tagged WCAG 2.1.1 and 2.1.3. The region has neither `tabindex` nor a focusable descendant, so keyboard users cannot reach the off-screen Exit and Result columns. The existing Axe test runs at the desktop viewport; the 390 px test checks visibility and touch sizes but does not run Axe or exercise horizontal keyboard scrolling.

**Why this fails:** The first sample result is the product’s proof. A keyboard user on the requested phone layout cannot inspect the complete result. This violates the non-negotiable keyboard baseline.

**Concrete fix:** Prefer a responsive stacked row that exposes all four fields without horizontal scrolling. If horizontal scrolling remains, add `tabindex="0"`, a visible focus style, and an accessible instruction/name on the scroll region. Add a 390 × 844 Playwright Axe assertion and a keyboard test that focuses the region, scrolls it, and confirms Exit and Result are reachable.

### F-3-2 — Low — The starter-contract action is an unlisted claim

**Exact quote/location:** Landing heading “**Add the first contract in two commands**” at `site/src/main.ts:126`; README “**Create a starter file:**” followed by `agent-contract init --command my-cli` at `README.md:34-37`.

**Evidence:** `.factory/claims.json` has no `init` or starter-contract entry, and `tests/product.spec.ts` never executes `agent-contract init`. I ran it manually in a fresh temporary directory and it wrote a version-1 `agent-contract.yml`, but that behavior is outside the declared claim gate.

**Why this fails:** This is the real first-use path after installation. A visitor is asked to rely on an onboarding capability that can regress while every listed claim still passes.

**Concrete fix:** Add a `starter-contract` claim and one `@claim:starter-contract` test. In a fresh directory, run `agent-contract init --command <built agent-contract binary>`, parse the generated YAML, assert the version and literal command, then run the generated suite with `check --accept` and assert exit 0.

### F-3-3 — Low — “Copy install command” is an unlisted action claim

**Exact quote/location:** Landing button “**Copy install command**” at `site/src/main.ts:129`.

**Evidence:** No claim entry or automated test mentions clipboard behavior. A live manual check with clipboard permission copied the expected GitHub install command and changed the label to “Copied install command,” so the current behavior works; it is still absent from the required claims contract.

**Why this fails:** The primary installation convenience can break without any listed claim failing.

**Concrete fix:** Add a `copy-install-command` claim and tagged browser test. Grant clipboard permission, activate the button by keyboard, assert the clipboard equals the displayed command, and assert the success label is announced. Also test the existing copy-failure message with clipboard access denied.

### F-3-4 — Low — The Rust 1.85 claim test does not use Rust 1.85

**Exact quote/location:** “**Requires Rust 1.85 or newer.**” on the landing page and “**Build the single binary with Rust 1.85 or newer:**” in README. Claim `rust-version`; test at `tests/product.spec.ts:339-343`.

**Evidence:** The listed test only checks that `Cargo.toml` contains `rust-version = "1.85"` and runs `--version` on a binary built by the ambient toolchain. The clean claim run used Rust 1.98.0, so that test would still pass if new source syntax or a dependency stopped compiling on 1.85. I separately installed Rust 1.85.0 and confirmed `cargo +1.85.0 build --locked` succeeds today.

**Why this fails:** The public compatibility claim is currently true, but its required regression test does not prove the claimed minimum version.

**Concrete fix:** Provision Rust 1.85.0 in the claim environment and make `@claim:rust-version` run `cargo +1.85.0 build --locked` before checking the binary version. Keep the manifest assertion as a secondary check.

## Copy audit

Words are whitespace-delimited. Commands, YAML, URLs, terminal rows, and version-only labels are executable syntax or labels, not prose sentences. No sentence exceeds 22 words. No banned marketing adjective appears. `TTY`, YAML, JSON, fixture, snapshot, idempotent, and nondeterministic are appropriate documented CLI terms. The product consistently uses **command**, **contract**, **fixture**, **snapshot**, and **report**.

### Landing page sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Test CLI contracts before agents depend on them | 8 | Pass |
| For CLI maintainers who need stable output, exits, and errors while keeping human-readable output unchanged. | 15 | Pass |
| Try it with sample data | 5 | Pass |
| Opens a recorded run with four passing checks. | 8 | Pass (`recorded-demo`) |
| Free and open source. | 4 | Pass (`free-mit`) |
| Runs locally. | 2 | Pass (`local-execution`) |
| Network use is opt-in. | 4 | Pass (`network-opt-in`) |
| One declared command. | 3 | Pass (`declared-commands`) |
| Four contract checkpoints. | 3 | Pass (`recorded-demo`) |
| Approve a baseline once. | 4 | Pass (`snapshot-regression`) |
| Each later run names the output, exit, or JSON field that moved. | 12 | Pass (`snapshot-regression`, `nondeterminism`) |
| List the executable, fixed arguments, modes, and expected exits in YAML. | 11 | Pass (`contract-format-version`, `mode-capture`, `exit-codes`) |
| Each fixture starts in a new temporary directory with a small environment. | 12 | Pass (`isolated-fixtures`, `environment-isolation`) |
| Read Markdown in a pull request or parse the same result as JSON. | 13 | Pass (`report-formats`) |
| The runner executes only commands written in your contract. | 9 | Pass (`declared-commands`) |
| Project files stay outside each fixture. | 6 | Pass (`isolated-fixtures`) |
| Declared secret values become `[REDACTED]`. | 5 | Pass (`secret-redaction`) |
| Network use needs `allow_network: true`. | 5 | Pass (`network-opt-in`) |
| Requires Rust 1.85 or newer. | 5 | Flag F-3-4 |
| The binary has no telemetry. | 5 | Pass (`no-cli-telemetry`) |
| Test CLI contracts before agents depend on them. | 8 | Pass |

### Landing headings, labels, and controls

| Copy | Words | Result |
| --- | ---: | --- |
| Agent CLI Contract | 3 | Wordmark |
| Demo | 1 | Clear navigation label |
| Install | 1 | Clear navigation label |
| Privacy | 1 | Clear navigation label |
| The product, in use | 4 | Clear section label |
| See the contract before an agent does | 7 | Clear heading |
| Survey a command in three steps | 6 | Clear heading |
| Declare the command | 3 | Clear heading |
| Run isolated fixtures | 3 | Clear heading |
| Review named changes | 3 | Clear heading |
| Limits and privacy | 3 | Clear section label |
| Run only commands you declare | 5 | Clear heading |
| Temporary workspaces | 2 | Clear label |
| Secret redaction | 2 | Clear label |
| Explicit network | 2 | Clear label |
| Install from source | 3 | Clear section label |
| Add the first contract in two commands | 7 | Flag F-3-2 |
| Copy install command | 3 | Result-naming verb; flag F-3-3 |

The demo controls are also result-naming verbs: “Reset demo” (2), “Leave demo and view install steps” (7), “Replay recorded sample run” (4), “Show a blocked change” (4), and “Copy demo command” (3).

### README sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Test CLI output, exits, errors, and repeat runs before agents depend on them. | 13 | Pass |
| Agent CLI Contract is for maintainers whose commands run inside coding agents and scripts. | 14 | Pass |
| It executes declared fixtures in fresh temporary directories, records text, TTY, and JSON output, and writes Markdown and JSON reports. | 20 | Pass |
| It is free, open source, local, and has no telemetry. | 10 | Pass (`free-mit`, `local-execution`, `no-cli-telemetry`) |
| Build the single binary with Rust 1.85 or newer: | 9 | Flag F-3-4 |
| The demo copies the bundled contract into a new temporary directory, runs its fixtures, and prints the report path. | 19 | Pass (`cli-demo-isolation`, `report-formats`, `recorded-demo`) |
| It never reads or writes project data. | 7 | Pass (`cli-demo-isolation`) |
| See `examples/agent-contract.yml` for the same suite in source form. | 9 | Pass |
| The one-click website demo is available at `https://agent-cli-contract.sociobot.in/?demo=1`. | 8 | Pass (`demo-sandbox`) |
| Its terminal recording is generated by running the bundled CLI: | 10 | Pass (`recorded-demo`) |
| Create a starter file: | 4 | Flag F-3-2 |
| Then describe only commands you already trust: | 7 | Clear instruction |
| Record the first approved snapshots and then check them: | 9 | Pass (`snapshot-regression`) |
| Snapshots go into `snapshots/`. | 4 | Pass (`isolated-fixtures`) |
| Reports go into `.agent-contract/report.md` and `.agent-contract/report.json`. | 6 | Pass (`report-formats`) |
| The public format starts at version `1`. | 7 | Pass (`contract-format-version`) |
| `command` is an executable plus fixed arguments. | 7 | Pass (`direct-execution`) |
| No shell parses it. | 4 | Pass (`direct-execution`) |
| `modes` adds declared arguments for `text`, `tty`, or `json` runs. | 10 | Pass (`mode-capture`) |
| `fixtures[].args` contains the fixture arguments. | 5 | Pass (`schema-output`) |
| `fixtures[].files` writes inline sample files inside the temporary directory. | 9 | Pass (`inline-files`) |
| `expect.exit`, `stdout_contains`, and `stderr_contains` check the result. | 7 | Pass (`schema-output`, `exit-codes`) |
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
| `AGENT_CONTRACT_NETWORK=disabled` is also set for tools that report their policy. | 10 | Pass (`local-execution`) |
| The runner executes only the literal command declared in the contract. | 11 | Pass (`declared-commands`, `direct-execution`) |
| `npm run build:site` writes the deployable site to `dist/site`. | 9 | Pass in clean build |
| `npm run build` also builds the release CLI. | 8 | Pass in clean build |
| No runtime service, account, tracking script, or network connection is used. | 11 | Pass (`no-cli-telemetry`) |
| Version `0.1.0`. | 2 | Version label |
| See `CHANGELOG.md` for released behavior. | 5 | Pass |
| MIT. | 1 | Pass (`free-mit`) |
| See `LICENSE`. | 2 | Pass |

README headings are “Agent CLI Contract” (3), “Install” (1), “Try the bundled demo” (4), “Add a contract” (3), “Contract format” (2), “Safety model” (2), “Develop and verify” (3), “Project status” (2), and “License” (1). Each makes sense out of context.

## Demo and sandbox checks

- The landing action enters `/?demo=1` in one click. Before interaction, the 390 px screen shows the populated report heading “All four contract checks pass”; the first realistic fixture text ends at y=835 inside the 844 px viewport. The page also shows the specific `ridge-cli` YAML, not placeholder text.
- The persistent banner reads “Demo — sample data, nothing is saved” and exposes Reset and exit controls. After scrolling to y=1000, the mobile banner remained at y=0 with both controls at least 56 px high.
- With `real:sentinel=keep`, “Show a blocked change” added only `demo:report=failed`. Reset removed that demo key, kept the real sentinel, restored the four-pass report, and returned focus to Reset.
- All browser requests during the sample flow stayed on `https://agent-cli-contract.sociobot.in`; no console or page errors appeared. A loaded `/demo` reloaded offline with its h1 and sample intact.
- From an empty temporary project, `agent-contract --json demo` wrote its sample, snapshots, and reports under `/tmp/agent-contract-demo-…`, outside the project. The JSON report contained four passes and zero failures; the project directory stayed empty.

F-3-1 concerns keyboard access to the mobile report, not demo data isolation.

## Claims gate

I cloned the committed checkout to `/tmp/agent-cli-contract-review3-4ExBsQ/repo`, ran `npm ci`, and executed each of the 28 commands in `.factory/claims.json` independently. Every listed command passed:

| Claim IDs | Result |
| --- | --- |
| `isolated-fixtures`, `mode-capture`, `snapshot-regression`, `nondeterminism`, `nondeterministic-field-allowlist`, `idempotency`, `inline-files` | Pass |
| `fixture-timeout`, `default-timeout`, `error-recovery`, `report-formats`, `secret-redaction`, `network-opt-in`, `demo-sandbox` | Pass |
| `no-third-party-data`, `recorded-demo`, `free-mit`, `no-cli-telemetry`, `local-execution`, `rust-version`, `schema-output` | Pass |
| `contract-format-version`, `direct-execution`, `declared-commands`, `environment-isolation`, `cli-demo-isolation`, `exit-codes`, `json-failure-document` | Pass |

The same clean clone passed `npm test` (3 Rust tests and 35 Playwright tests), `npm run build`, `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `cargo package --allow-dirty`, and `npm audit --omit=dev`. The build produced 18.42 kB JS (5.87 kB gzip) and 14.97 kB CSS (4.25 kB gzip). F-3-2 and F-3-3 are unlisted claims; F-3-4 is a weak listed test, so the green manifest is not a zero-finding result.

## Earlier finding history

I read both earlier reviews, both polish reports, and the prior handoff. Each finding was checked on the live site and in current code rather than accepted from its status text.

| Earlier finding | Review-3 confirmation |
| --- | --- |
| F-1-1 fake browser run | Fixed. The control says “Replay recorded sample run,” the page ships a self-hosted animated SVG and transcript, and `recorded-demo` matched a fresh four-check CLI report. |
| F-1-2 Back lost scroll | Fixed. From y=1200, an in-app navigation to Demo followed by Back restored y=1200 and focused the landing h1. The source stores coordinates in `history.state`. |
| F-1-3 mobile banner not persistent | Fixed. At 390 px after scrolling, the live banner remained at y=0 with both controls visible. |
| F-1-4 route/command terminology | Fixed. Product schema language uses **command**; “route” is limited to website/map navigation. |
| F-1-5 opaque landing phrases | Fixed. The audience sentence names human-readable output and the heading says “Run only commands you declare.” |
| F-1-6 vague “Start for real” action | Fixed. It now says “Leave demo and view install steps,” clears demo state, and opens `/#install`. |
| F-1-7 local execution unlisted | Fixed. `local-execution` exists and passed. |
| F-1-8 default timeout unlisted | Fixed. `default-timeout` exists, runs for the measured interval, and passed. |
| F-1-9 future compatibility promise | Fixed. The untestable promise is absent. |
| F-1-10 generated-command promise | Fixed. Copy is limited to the tested literal declared-command behavior. |
| F-1-11 allowed network path untested | Fixed. `network-opt-in` proves blocked and allowed cases against a local server. |
| F-2-1 mobile demo result below viewport | Fixed. At 390 × 844 the pass heading ends at y=677 and the first fixture text ends at y=835. |
| F-2-2 internal factory release copy | Fixed. The sentence is absent from README. |
| F-2-3 nondeterministic-field allowlist unlisted | Fixed. The claim exists and passed with `$.meta.duration_ms`. |
| F-2-4 schema command unlisted | Fixed. The claim exists and validates every documented field. |
| F-2-5 contract version unlisted | Fixed. The claim accepts version 1 and rejects version 2 with guidance. |

No earlier finding is being reopened. F-3-1 is a mobile accessibility case the existing desktop Axe check misses.

## Structure, accessibility, and links

- `/`, `/demo`, `/privacy`, and `/terms` returned 200. `/missing-route` returned a designed HTTP 404 with a home action. Each route had `lang="en"`, one `main`, one h1, an ordered heading outline, a route-specific title, description, canonical, Open Graph title/image, favicon, and Apple icon.
- Live titles follow the required pattern: `Agent CLI Contract — test stable command output`, `Demo — Agent CLI Contract`, `Privacy — Agent CLI Contract`, `Terms — Agent CLI Contract`, and `Page not found — Agent CLI Contract`.
- All discovered navigational links and assets resolved. The only 404 response was the deliberately tested missing route; its `#main` skip target exists on that same 404 page. Header and footer remain consistent, with Privacy and Terms.
- In-app navigation focused and announced the new h1. Back restored the saved scroll position and h1 focus. The skip link moved focus to `main`.
- The live CSP, referrer policy, nosniff, permissions policy, and HSTS headers were present. The fleet URL verifier passed with no console errors, one h1, one main landmark, language, and complete image alt attributes.
- Playwright Axe found no serious or critical violations on desktop routes. At 390 px it found F-3-1 on the demo. There was no horizontal page overflow, but the intentionally overflowing result subregion is not keyboard-accessible.
- The paper map, contour lines, survey rail, signal-orange markers, clipped controls, terminal surface, and contour 404 follow `.factory/design.md`. The identity is recognisable and is not a generic centered-hero/three-card SaaS template. Assets and fonts are original or system-hosted; no third-party script or font loaded.

## Missed leverage

No additional AI feature is implied. Generating maintainer commands would conflict with the declared-command safety boundary. Markdown and JSON already provide the obvious export paths, and a sync service would conflict with the local CLI scope. No decorative AI, embedded provider key, missing import, missing export, or missing sync finding is warranted.

## What would make this perfect

Make the 390 px result fully keyboard-accessible and cover that viewport with Axe plus a keyboard scroll test. Add claim entries and tagged tests for starter generation and clipboard copy. Make the Rust compatibility test compile with Rust 1.85.0. Then rerun every manifest command and the full clean-clone suite; only a zero-violation, zero-unlisted-claim result should pass.
