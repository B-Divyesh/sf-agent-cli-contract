# First-read review 6 — PASS

Reviewed 29 August 2026 against `https://agent-cli-contract.sociobot.in` and a fresh clone of `8d2d7d89c3e758d9dda866e522b40a4ea6c3df7f`.

## Verdict

**PASS.** This review found zero blocking or minor findings. The product states the job, audience, and first action immediately; the sample route is clear; and the declared checks pass from a clean clone.

## Cold first read

Fresh browser contexts were opened without scrolling at 390 × 844 and 1366 × 768.

| Check | Result |
| --- | --- |
| What does it do? | It checks a CLI contract before coding agents depend on its output, exits, errors, and repeat runs. |
| Who is it for? | CLI maintainers whose commands run in coding agents and scripts. |
| What should a visitor select first? | **Try it with sample data**, which says it opens a recorded run with four passing checks. |

The exact first-screen text is “Test CLI contracts before agents depend on them”, “For CLI maintainers who need stable output, exits, and errors while keeping human-readable output unchanged.”, and “Try it with sample data”. The action was visible at y=593–644 on mobile and y=675–726 on desktop. Both pages loaded with no page or console error.

## Copy audit

Word counts use whitespace-delimited words. Commands, YAML, report cells, and terminal output are code or sample output rather than prose. All prose sentences are 22 words or fewer. No jargon, marketing adjective, inconsistent product term, empty heading, metaphor heading, or non-result-naming control remains. Every claim-like sentence maps to one or more declared checks noted below.

### Landing page

| Copy | Words | Check |
| --- | ---: | --- |
| Version 0.1.0 | 2 | Version label |
| Test CLI contracts before agents depend on them | 8 | Clear h1 |
| For CLI maintainers who need stable output, exits, and errors while keeping human-readable output unchanged. | 15 | Clear audience and result |
| Try it with sample data | 5 | Result-naming action |
| Opens a recorded run with four passing checks. | 8 | `recorded-demo` |
| Free and open source. | 4 | `free-mit` |
| Runs locally. | 2 | `local-execution` |
| Network use is opt-in. | 4 | `network-opt-in` |
| One declared command. | 3 | `declared-commands` |
| Four sample checks. | 3 | Sample label |
| Sample report | 2 | Section label |
| The product, in use | 4 | Preview label |
| Review a sample contract report | 5 | Clear section heading |
| Approve a baseline once. | 4 | `snapshot-regression` |
| Each later run names the output, exit, or JSON field that moved. | 12 | `snapshot-regression`, `nondeterminism` |
| local sample | 2 | Sample-output label |
| How it works | 3 | Section label and heading |
| Test a CLI contract in three steps | 7 | Clear section heading |
| Declare the command | 3 | Step heading |
| List the executable, fixed arguments, modes, and expected exits in YAML. | 11 | `schema-output`, `direct-execution` |
| Run isolated fixtures | 3 | Step heading |
| Each fixture starts in a new temporary directory with a small environment. | 12 | `isolated-fixtures`, `environment-isolation` |
| Review named changes | 3 | Step heading |
| Read Markdown in a pull request or parse the same result as JSON. | 13 | `report-formats` |
| Safety and privacy | 3 | Clear section label |
| Limits and privacy | 3 | Clear section label |
| Run only commands you declare | 5 | Clear section heading |
| The runner executes only commands written in your contract. | 9 | `declared-commands` |
| Temporary workspaces | 2 | List label |
| Project files stay outside each fixture. | 6 | `isolated-fixtures` |
| Secret redaction | 2 | List label |
| Declared secret values become [REDACTED]. | 5 | `secret-redaction` |
| Explicit network | 2 | List label |
| Network use needs allow_network: true. | 5 | `network-opt-in` |
| Install | 1 | Section label |
| Install from source | 3 | Clear section label |
| Add the first contract in two commands | 7 | Clear section heading |
| Copy install command | 3 | Result-naming action; `copy-install-command` |
| Requires Rust 1.85 or newer. | 5 | `rust-version` |
| The binary has no telemetry. | 5 | `no-cli-telemetry` |
| Test CLI contracts before agents depend on them. | 8 | Footer product statement |
| Privacy | 1 | Navigation label |
| Terms | 1 | Navigation label |

### README

| Copy | Words | Check |
| --- | ---: | --- |
| Test CLI output, exits, errors, and repeat runs before agents depend on them. | 13 | Product summary |
| Agent CLI Contract is for maintainers whose commands run inside coding agents and scripts. | 14 | Audience |
| It executes declared fixtures in fresh temporary directories, records text, TTY, and JSON output, and writes Markdown and JSON reports. | 20 | `isolated-fixtures`, `mode-capture`, `report-formats` |
| It is free, open source, local, and has no telemetry. | 10 | `free-mit`, `local-execution`, `no-cli-telemetry` |
| Build the single binary with Rust 1.85 or newer: | 9 | `rust-version` |
| The demo copies the bundled contract into a new temporary directory, runs its fixtures, and prints the report path. | 19 | `cli-demo-isolation`, `report-formats` |
| It never reads or writes project data. | 7 | `cli-demo-isolation` |
| See examples/agent-contract.yml for the same suite in source form. | 8 | Source reference |
| The one-click website demo is available at the stated demo URL. | 9 | Live route checked |
| Its terminal recording is generated by running the bundled CLI: | 9 | `recorded-demo` |
| Create a starter file: | 4 | `starter-contract` |
| Then describe only commands you already trust: | 7 | Instruction |
| Record the first approved snapshots and then check them: | 10 | `snapshot-regression` |
| Snapshots go into snapshots/. | 4 | `isolated-fixtures` |
| Reports go into .agent-contract/report.md and .agent-contract/report.json. | 6 | `report-formats` |
| The public format starts at version 1. | 7 | `contract-format-version` |
| command is an executable plus fixed arguments. | 7 | `direct-execution` |
| No shell parses it. | 4 | `direct-execution` |
| modes adds declared arguments for text, tty, or json runs. | 10 | `mode-capture` |
| fixtures[].args contains the fixture arguments. | 5 | `schema-output` |
| fixtures[].files writes inline sample files inside the temporary directory. | 9 | `inline-files` |
| expect.exit, stdout_contains, and stderr_contains check the result. | 7 | `schema-output` |
| expect.error_code reads error.code or code from JSON output. | 8 | `error-recovery` |
| recover_args runs after an expected failure and must exit zero. | 10 | `error-recovery` |
| idempotent: true runs the same fixture twice in one clean directory. | 11 | `idempotency` |
| detect_nondeterminism: true compares two fresh runs and names changed JSON fields. | 11 | `nondeterminism` |
| allow_nondeterministic_fields accepts known JSON paths such as $.meta.duration_ms. | 8 | `nondeterministic-field-allowlist` |
| allow_network: true permits URLs and known network commands. | 8 | `network-opt-in` |
| Network-shaped commands are rejected by default. | 6 | `network-opt-in` |
| timeout_ms stops a fixture that exceeds its limit. | 8 | `fixture-timeout` |
| The default is 10 seconds. | 5 | `default-timeout` |
| redact_env lists extra environment variable names whose values must never appear in reports. | 13 | `secret-redaction` |
| Run agent-contract schema for the complete JSON Schema. | 8 | `schema-output` |
| Invalid or empty suites exit with code 2. | 8 | `exit-codes` |
| Contract failures exit with code 1. | 6 | `exit-codes` |
| Passing suites exit with code 0. | 6 | `exit-codes` |
| Add --json before the command for a script-readable summary. | 9 | `json-failure-document` |
| Each fixture receives a new temporary working directory. | 8 | `isolated-fixtures` |
| Idempotency checks share only their own temporary directory. | 8 | `idempotency` |
| The runner uses direct process arguments, never a shell. | 9 | `direct-execution` |
| It passes a small environment allowlist plus values declared in the contract. | 12 | `environment-isolation` |
| Secret-shaped host variables are not passed. | 6 | `environment-isolation` |
| Declared secret values are replaced with [REDACTED] in snapshots and reports. | 11 | `secret-redaction` |
| Network use must be enabled per fixture. | 7 | `network-opt-in` |
| Without it, URL arguments and known network executables are rejected, and the target process plus its children cannot open or connect sockets. | 22 | `network-opt-in` |
| AGENT_CONTRACT_NETWORK=disabled is also set for tools that report their policy. | 10 | `network-opt-in` |
| The runner executes only the literal command declared in the contract. | 9 | `declared-commands`, `direct-execution` |
| npm run build:site writes the deployable site to dist/site. | 9 | Build checked |
| npm run build also builds the release CLI. | 8 | Build checked |
| No runtime service, account, tracking script, or network connection is used. | 11 | `no-cli-telemetry` |
| Version 0.1.0. | 2 | Version label |
| See CHANGELOG.md for released behavior. | 5 | Source reference |
| MIT. | 1 | `free-mit` |
| See LICENSE. | 2 | Source reference |

README headings all name their sections: Install, Try the bundled demo, Add a contract, Contract format, runtime behavior, Develop and verify, Project status, and License.

## Demo and local behavior

- One selection from the landing page opened `/demo` with a populated four-check report, sample fixture, fixture modes, exits, and results already visible.
- The persistent banner states “Demo — sample data, nothing is saved” and exposes **Reset demo** and **Leave demo and view install steps**.
- Changing the sample wrote only `demo:report=failed`. Reset removed that key. Leaving the demo also removed it and opened `/#install`.
- The complete browser demo request log used only `https://agent-cli-contract.sociobot.in`.
- `agent-contract --json demo` is covered by the clean-suite `cli-demo-isolation` check: it writes beneath a new operating-system temporary directory and leaves a project sentinel unchanged.

## Claims gate

`.factory/claims.json` contains 30 entries. In a new clone, after `npm ci`, `npm test` passed all 40 tests, including every tagged test identified by the manifest:

`isolated-fixtures`, `mode-capture`, `snapshot-regression`, `nondeterminism`, `nondeterministic-field-allowlist`, `idempotency`, `inline-files`, `fixture-timeout`, `default-timeout`, `error-recovery`, `report-formats`, `secret-redaction`, `network-opt-in`, `demo-sandbox`, `no-third-party-data`, `recorded-demo`, `free-mit`, `no-cli-telemetry`, `local-execution`, `rust-version`, `starter-contract`, `copy-install-command`, `schema-output`, `contract-format-version`, `direct-execution`, `declared-commands`, `environment-isolation`, `cli-demo-isolation`, `exit-codes`, and `json-failure-document`.

The same clean clone passed `npm run build`, producing `dist/site` and the release CLI. A manual page-and-README comparison found no claim-like statement without a matching manifest entry.

## Earlier review confirmation

Every earlier review, polish record, verification record, and handoff was read. The table records a fresh code and live-product confirmation rather than relying on a prior status label.

| Earlier item | Current confirmation |
| --- | --- |
| F-1-1 | The page accurately says it replays a recorded CLI run; the self-hosted recording and transcript match the bundled demo through `recorded-demo`. |
| F-1-2 | After reaching y=1200, opening Demo, and returning, the live page restored y=1198 and focused the landing h1. |
| F-1-3 | At 390 px after scroll, the sample banner and both actions remain visible and touch sized. |
| F-1-4 to F-1-6 | The product consistently says command, uses direct audience and section text, and labels the demo exit with its result. |
| F-1-7 to F-1-11 | Local behavior, default timeout, network allowance, and declared-command behavior have matching checks; the forward-looking text is absent. |
| F-2-1 | At 390 px, the populated report begins in the initial demo view. |
| F-2-2 to F-2-5 | Internal release language is absent; allowlist, schema, and format-version statements have matching checks. |
| F-3-1 | The 390 px report has no horizontal scroll area; all result cells fit within its width. |
| F-3-2 to F-3-4 | Starter, clipboard, and Rust-version statements have matching checks. |
| F-4-1 to F-4-11 | First-screen, report, steps, sample, and 404 labels now state their purpose directly. Current map styling is visual rather than explanatory copy. |
| Verification 4 keyboard finding | First Tab exposes the skip link; Enter leaves `main#main` as the active element. The current full suite includes the corresponding stable check. |

## Structure, accessibility, and visual identity

- `/`, `/demo`, `/privacy`, and `/terms` returned 200. An unknown URL returned the designed 404 with status 404. All live navigation URLs returned 200.
- Each route has one h1, one main landmark, a route-specific title, description, canonical URL, social metadata, favicon, shared header, shared footer, and legal links.
- A 390 px Axe WCAG 2 A/AA scan found zero violations on home, demo, privacy, terms, and the designed 404. Each checked route had `scrollWidth == clientWidth == 390`.
- The skip link, route focus change, browser history restoration, 44 px utility controls, and reduced-motion rule were checked. Under reduced motion, the sampled transition duration was `0.01ms`.
- `robots.txt`, `sitemap.xml`, self-only content policy, strict referrer policy, type protection header, and restrictive permissions policy are present. The live demo has no third-party requests.
- The paper map, contour artwork, clipped orange controls, and report-sheet layout follow `.factory/design.md` and are clearly distinct from a generic software template.

## Missed leverage

No omitted feature is indicated by the brief. The product already supplies the directly useful outputs: Markdown and JSON reports. A model-assisted command-writing step would not improve this local contract-checking workflow, and there is no decorative model feature or embedded provider credential.

## What would make this perfect

Keep the present direct copy, sample route, claim coverage, browser checks, and local CLI demo aligned as the next release changes. No product change is required by this review.
