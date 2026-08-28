# Adversarial first-read review 1 — FAIL

Reviewed 28 August 2026 against `https://agent-cli-contract.sociobot.in` and the checkout at `3f279325c8386914ec8e21e6b43c170a682f31be`.

## Verdict

**FAIL.** The first read, real CLI demo, declared-claim suite, core structure, privacy isolation, and visual identity are strong. The product still has one misleading browser-demo action, loses a visitor's prior place on Back, and has the findings below. A pass requires zero findings.

## Cold first read

I used new browser contexts at 390 × 844 and 1366 × 768, with no scrolling before reading.

| Question | What the first screen communicated |
| --- | --- |
| What does it do? | It tests a CLI's output, exits, and errors before coding agents use it. |
| For whom? | CLI maintainers whose commands are used by coding agents and scripts. |
| What should I click first? | **Try it with sample data**, which says it opens a recorded four-check run. |

The exact copy that made this clear was: “**Test CLI contracts before agents depend on them**”, “**For CLI maintainers who need stable output, exits, and errors without changing the human interface.**”, and “**Try it with sample data** / **Opens a recorded run with four passing checks.**” The desktop action measured 275 × 51 px at y=675 and the facts ended at y=760; the mobile action measured 318 × 51 px at y=593 and the facts ended at y=785. The required first action is therefore visible without scrolling at both test sizes.

## Findings

### F-1-1 — BLOCKING — “Run sample contract” does not run the CLI

**Location / evidence:** On live `/demo`, the primary control is “**Run sample contract**” and then announces “**Running four fixtures in a fresh sample workspace.**” Source at `site/src/main.ts:296-307` only waits 450 ms, writes `localStorage['demo:report']`, and replaces the report with the fixed `demoReport(false)` HTML. There is no invocation of the Rust binary, no terminal recording asset, and no generated output tied to the button. The supposedly “self-hosted terminal recording” is also the same fixed DOM string at `site/src/main.ts:184-188`.

**Why this fails:** A first-time CLI maintainer is told that a sample contract ran, but the page only replays a hard-coded success state. For a CLI product, the required web evidence is an honest self-hosted recording of the real `agent-contract demo` output and the required runnable demo is the bundled command. This action blurs that boundary.

**Concrete fix:** Generate and ship a self-hosted SVG/asciinema-style recording from the real bundled sample, with a documented generation command and matching output. Rename the browser control to **“Replay recorded sample run”** (or remove it), and place an exact, copyable `agent-contract demo` command beside it. Do not describe a browser timer as a fresh workspace run. Add a test that asserts the recording artifact is present and that its fixture names, modes, exits, and report path wording match the actual CLI demo fixture.

### F-1-2 — BLOCKING — Back button discards the visitor’s scroll position

**Location / evidence:** In a live desktop context, I scrolled `/` to y=1200, followed **Demo**, then used Back. The resulting `/` scroll position was y=0, although focus correctly moved to `#page-title`. In `site/src/main.ts:247-261`, `popstate` calls `render({ focus: true })`; that render unconditionally calls `window.scrollTo(0, 0)` before focusing the h1.

**Why this fails:** Back returns to the right URL but not the visitor’s place in a long landing page. This fails the required history behavior: back/forward must restore scroll and focus.

**Concrete fix:** Save each route’s scroll coordinates in `history.state` before `pushState`; on `popstate`, restore them after rendering and focus the h1 with `{ preventScroll: true }`. Add an end-to-end test that scrolls the landing page, opens `/demo`, uses Back, and asserts both the saved scroll position and h1 focus.

### F-1-3 — Medium — The required demo banner is not persistent on a phone

**Location / evidence:** At 390 px, after scrolling `/demo` to y=900, the banner “**Demo — sample data, nothing is saved**” moved from y=69 to y=-831. `site/src/style.css:116` changes `.demo-banner` to `position: static` below 520 px.

**Why this fails:** The visitor can no longer see that they are in sample data or access **Reset demo** / **Start for real** while reviewing the lower report and terminal. That contradicts the required persistent demo status.

**Concrete fix:** Keep a compact sticky banner on mobile (it may wrap or use a second row while retaining 44 px controls). Add a 390 px test that scrolls the demo and confirms the banner, Reset, and exit action remain visible.

### F-1-4 — Medium — “Route” conflicts with the product’s documented term “command”

**Location / evidence:** The landing says “**One declared route.**” and has the heading “**Declare the route**”. The README defines the corresponding object as “**`command` is an executable plus fixed arguments.**” and uses `command` throughout the contract format.

**Why this fails:** A route is a navigation concept on this very website. Calling the executable a route makes the onboarding vocabulary inconsistent and forces a first-time visitor to translate a design metaphor into a schema field.

**Concrete fix:** Use **command** in the landing: “One declared command.” and “Declare the command.” Keep cartographic styling in visual labels, not in the name of the contract field.

### F-1-5 — Low — Two landing phrases are opaque outside their surrounding paragraph

**Location / evidence:** The first-screen audience sentence says “**without changing the human interface**”; the privacy heading is “**Keep generated commands outside the boundary**.”

**Why this fails:** “Human interface” does not say whether this means text output, a TTY, or a UI. “Generated commands” and “the boundary” are unexplained, and the product does not generate commands. These headings do not meet the requirement that headings make sense when heard alone.

**Concrete fix:** Rewrite the audience sentence as “For CLI maintainers who need stable output, exits, and errors while keeping human-readable output unchanged.” Rewrite the heading as **“Run only commands you declare.”**

### F-1-6 — Low — “Start for real” is not a result-naming action

**Location / evidence:** The demo banner control reads “**Start for real**”, while its handler clears demo state and opens `/#install` (`site/src/main.ts:315-318`).

**Why this fails:** The control does not name its result and could imply creating an account, beginning an execution, or keeping sample changes.

**Concrete fix:** Rename it **“Leave demo and view install steps”**. Keep the existing state-clearing behavior and assert it in the demo test.

### F-1-7 — Low — “Runs locally” is an unlisted claim

**Location / evidence:** Landing fact: “**Runs locally.**” `.factory/claims.json` has no claim with that statement or a test that proves this visitor-facing promise.

**Why this fails:** The claims contract requires each claim-like sentence to have a listed sandbox test. The existing `no-cli-telemetry` claim is not an entry for local execution.

**Concrete fix:** Add a `local-execution` entry and a tagged test that runs a declared fixture from a temporary directory while intercepting/denying all network access, then asserts local snapshots and reports are produced. Alternatively remove the fact.

### F-1-8 — Low — The documented default timeout is an unlisted claim

**Location / evidence:** README, Contract format: “**The default is 10 seconds.**” There is a `fixture-timeout` claim for an explicit 40 ms timeout, but no claim or test for the default.

**Why this fails:** A maintainer may rely on that execution limit when adding a contract. The current claim only proves that an explicitly supplied timeout is honored.

**Concrete fix:** Add a `default-timeout` claim and a tagged fixture whose command exceeds a short test-configured default, or remove the documented numeric default if it cannot be tested without a slow suite.

### F-1-9 — Low — The compatibility promise is untested and cannot be verified as written

**Location / evidence:** README, Project status: “**The contract format may add fields before 1.0, but existing version 1 fields will retain their meaning.**”

**Why this fails:** This is a future compatibility promise with no claim entry and no finite sandbox assertion. It asks users to rely on behavior that the project has not released yet.

**Concrete fix:** Remove the forward-looking promise. If a compatibility policy is needed, document only released schema-version guarantees and add versioned fixture tests for them.

### F-1-10 — Low — The “not generated commands” safety promise is unlisted

**Location / evidence:** README, Safety model: “**This tool runs maintainer-authored commands, not generated commands.**” No `.factory/claims.json` entry covers command provenance or confirms that no generation path exists.

**Why this fails:** This is a meaningful safety boundary for coding-agent users and should not rest on untested prose.

**Concrete fix:** Add a `declared-not-generated` claim that inspects the schema and runner path, supplies a contract with one literal executable, and confirms no other command source is consulted; otherwise reduce the sentence to the already-tested statement that the runner executes commands declared in the contract.

### F-1-11 — Low — The positive side of `allow_network` is not tested

**Location / evidence:** README, Contract format: “**`allow_network: true` permits URLs and known network commands.**” The listed `network-opt-in` test verifies blocking when the flag is absent, including a Node `fetch` bypass, but does not exercise an explicitly opted-in fixture.

**Why this fails:** The public statement promises both denial by default and permission after opt-in. Only the denial half is observable in the current test.

**Concrete fix:** Extend the `network-opt-in` test (or add a separate listed claim) with a local HTTP server and an opted-in fixture that reaches it successfully, while retaining the existing blocked cases.

## Demo and sandbox checks

- The landing action enters `/demo` in one click. Its initial screen already displays the sample YAML, four fixture rows, modes, exits, and a passing report. The sample is specific rather than lorem ipsum.
- The initial banner is present. In a fresh browser context, changing the sample created only `demo:report=failed`; a pre-existing `real:sentinel=keep` was untouched. Reset removed all `demo:` keys and preserved `real:sentinel`; leaving the demo also removed `demo:` keys.
- During the whole browser demo flow, every observed request origin was `https://agent-cli-contract.sociobot.in`. There were no console or page errors.
- From a fresh clone, `agent-contract --json demo` run with a sentinel project file produced `{"ok":true,"demo":"/tmp/agent-contract-demo-…"}`. The sentinel remained `keep`, and the reported demo path was outside the project.

The isolation and actual CLI command pass. F-1-1 and F-1-3 concern the honesty and persistence of the browser representation, not those proven isolation properties.

## Claims gate

I cloned the checkout into `/tmp/agent-cli-contract-review-qkVAH8/repo`, ran `npm ci`, then ran every command listed in `.factory/claims.json` separately. All 22 passed:

| Claim IDs with passing listed test |
| --- |
| `isolated-fixtures`, `mode-capture`, `snapshot-regression`, `nondeterminism`, `idempotency`, `inline-files`, `fixture-timeout` |
| `error-recovery`, `report-formats`, `secret-redaction`, `network-opt-in`, `demo-sandbox`, `no-third-party-data` |
| `free-mit`, `no-cli-telemetry`, `rust-version`, `direct-execution`, `declared-commands`, `environment-isolation` |
| `cli-demo-isolation`, `exit-codes`, `json-failure-document` |

`npm test` then passed all 27 tests from that clean clone. `npm run build`, `cargo fmt --check`, and `cargo clippy -- -D warnings` also passed. The unlisted/partial public claims in F-1-7 through F-1-11 remain findings despite this green gate.

## Copy audit

Words are whitespace-delimited; visible commands, terminal rows, coordinates, and version-only labels are excluded because they are code or labels rather than sentences. No audited sentence exceeds 22 words. No banned marketing adjective appeared. The flags refer to F-1-4 through F-1-11.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Contract survey / v0.1.0 | 4 | Label |
| Test CLI contracts before agents depend on them | 8 | Pass |
| For CLI maintainers who need stable output, exits, and errors without changing the human interface. | 15 | Flag F-1-5: opaque term |
| Try it with sample data | 5 | Pass |
| Opens a recorded run with four passing checks. | 8 | Pass |
| Free and open source. | 4 | Pass |
| Runs locally. | 2 | Flag F-1-7: unlisted claim |
| Network use is opt-in. | 4 | Pass (`network-opt-in`) |
| One declared route. | 3 | Flag F-1-4: inconsistent term |
| Four contract checkpoints. | 3 | Pass: sample label |
| The product, in use | 4 | Pass |
| See the contract before an agent does | 7 | Pass |
| Approve a baseline once. | 4 | Pass (`snapshot-regression`) |
| Each later run names the output, exit, or JSON field that moved. | 12 | Pass (`snapshot-regression`, `nondeterminism`) |
| Survey a command in three steps | 6 | Pass |
| Declare the route | 3 | Flag F-1-4: inconsistent term |
| List the executable, fixed arguments, modes, and expected exits in YAML. | 11 | Pass |
| Run isolated fixtures | 3 | Pass |
| Each fixture starts in a new temporary directory with a small environment. | 12 | Pass (`isolated-fixtures`, `environment-isolation`) |
| Review named changes | 3 | Pass |
| Read Markdown in a pull request or parse the same result as JSON. | 13 | Pass (`report-formats`) |
| Limits and privacy | 3 | Pass |
| Keep generated commands outside the boundary | 6 | Flag F-1-5: unclear heading |
| The runner executes only commands written in your contract. | 9 | Pass (`declared-commands`) |
| Temporary workspaces | 2 | Pass |
| Project files stay outside each fixture. | 6 | Pass (`isolated-fixtures`) |
| Secret redaction | 2 | Pass |
| Declared secret values become [REDACTED]. | 5 | Pass (`secret-redaction`) |
| Explicit network | 2 | Pass |
| Network use needs allow_network: true. | 5 | Pass (`network-opt-in`) |
| Install from source | 3 | Pass |
| Add the first contract in two commands | 7 | Pass |
| Copy install command | 3 | Pass |
| Requires Rust 1.85 or newer. | 5 | Pass (`rust-version`) |
| The binary has no telemetry. | 5 | Pass (`no-cli-telemetry`) |
| Test CLI contracts before agents depend on them. | 8 | Pass |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Test CLI output, exits, errors, and repeat runs before agents depend on them. | 13 | Pass |
| Agent CLI Contract is for maintainers whose commands run inside coding agents and scripts. | 14 | Pass |
| It executes declared fixtures in fresh temporary directories, records text, TTY, and JSON output, and writes Markdown and JSON reports. | 20 | Pass |
| It is free, open source, local, and has no telemetry. | 10 | Pass (`free-mit`, `no-cli-telemetry`) |
| Build the single binary with Rust 1.85 or newer: | 9 | Pass |
| The factory can publish the ready package with cargo package after release review. | 13 | Operational note, not a product claim |
| The demo copies the bundled contract into a new temporary directory, runs its fixtures, and prints the report path. | 19 | Pass (`cli-demo-isolation`, `report-formats`) |
| It never reads or writes project data. | 7 | Pass (`cli-demo-isolation`) |
| See examples/agent-contract.yml for the same suite in source form. | 9 | Pass |
| The website demo is available at https://agent-cli-contract.sociobot.in/demo. | 7 | Pass: live route checked |
| Create a starter file: | 4 | Pass |
| Then describe only commands you already trust: | 7 | Pass |
| Record the first approved snapshots and then check them: | 9 | Pass |
| Snapshots go into snapshots/. | 4 | Pass |
| Reports go into .agent-contract/report.md and .agent-contract/report.json. | 6 | Pass (`report-formats`) |
| The public format starts at version 1. | 7 | Pass: schema declaration |
| command is an executable plus fixed arguments. | 7 | Pass (`direct-execution`) |
| No shell parses it. | 4 | Pass (`direct-execution`) |
| modes adds declared arguments for text, tty, or json runs. | 10 | Pass (`mode-capture`) |
| fixtures[].args contains the fixture arguments. | 5 | Pass |
| fixtures[].files writes inline sample files inside the temporary directory. | 9 | Pass (`inline-files`) |
| expect.exit, stdout_contains, and stderr_contains check the result. | 7 | Pass |
| expect.error_code reads error.code or code from JSON output. | 8 | Pass (`error-recovery`) |
| recover_args runs after an expected failure and must exit zero. | 10 | Pass (`error-recovery`) |
| idempotent: true runs the same fixture twice in one clean directory. | 11 | Pass (`idempotency`) |
| detect_nondeterminism: true compares two fresh runs and names changed JSON fields. | 11 | Pass (`nondeterminism`) |
| allow_nondeterministic_fields accepts known JSON paths such as $.meta.duration_ms. | 8 | Pass |
| allow_network: true permits URLs and known network commands. | 8 | Flag F-1-11: positive behavior untested |
| Network-shaped commands are rejected by default. | 6 | Pass (`network-opt-in`) |
| timeout_ms stops a fixture that exceeds its limit. | 8 | Pass (`fixture-timeout`) |
| The default is 10 seconds. | 5 | Flag F-1-8: unlisted claim |
| redact_env lists extra environment variable names whose values must never appear in reports. | 13 | Pass (`secret-redaction`) |
| Run agent-contract schema for the complete JSON Schema. | 8 | Pass |
| Invalid or empty suites exit with code 2. | 8 | Pass (`exit-codes`) |
| Contract failures exit with code 1. | 6 | Pass (`exit-codes`) |
| Passing suites exit with code 0. | 6 | Pass (`exit-codes`) |
| Add --json before the command for a script-readable summary. | 9 | Pass (`json-failure-document`) |
| Each fixture receives a new temporary working directory. | 8 | Pass (`isolated-fixtures`) |
| Idempotency checks share only their own temporary directory. | 8 | Pass (`idempotency`) |
| The runner uses direct process arguments, never a shell. | 9 | Pass (`direct-execution`) |
| It passes a small environment allowlist plus values declared in the contract. | 12 | Pass (`environment-isolation`) |
| Secret-shaped host variables are not passed. | 6 | Pass (`environment-isolation`) |
| Declared secret values are replaced with [REDACTED] in snapshots and reports. | 11 | Pass (`secret-redaction`) |
| Network use must be enabled per fixture. | 7 | Pass (`network-opt-in`) |
| Without it, URL arguments and known network executables are rejected, and the target process plus its children cannot open or connect sockets. | 22 | Pass (`network-opt-in`) |
| AGENT_CONTRACT_NETWORK=disabled is also set for tools that report their policy. | 10 | Pass |
| This tool runs maintainer-authored commands, not generated commands. | 8 | Flag F-1-10: unlisted safety claim |
| npm run build:site writes the deployable site to dist/site. | 9 | Pass |
| npm run build also builds the release CLI. | 8 | Pass |
| No runtime service, account, tracking script, or network connection is used. | 11 | Pass (`no-cli-telemetry`) |
| Version 0.1.0. | 2 | Pass |
| See CHANGELOG.md for release notes. | 5 | Pass |
| The contract format may add fields before 1.0, but existing version 1 fields will retain their meaning. | 17 | Flag F-1-9: untestable future promise |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

`Start for real` is included in F-1-6 as a non-result-naming button. The technical terms `TTY`, `YAML`, `idempotent`, and the YAML keys are appropriate here because they name documented CLI modes and schema fields; their adjacent text explains their behavior.

## Structure, accessibility, and links

- `/`, `/demo`, `/privacy`, `/terms`, and an unknown route were opened directly. Each had one `main` and one h1. The unknown route returned HTTP 404 and showed the designed “This route leaves the map” recovery screen.
- Titles were `Agent CLI Contract — test stable command output`, `Demo — Agent CLI Contract`, `Privacy — Agent CLI Contract`, `Terms — Agent CLI Contract`, and `Page not found — Agent CLI Contract`. Canonicals updated per route; description, OG image, favicon, language, theme color, robots, sitemap, and Apple touch icon were present.
- Every internal link discovered across the routes resolved: `/`, `/demo`, `/#install`, `/privacy`, `/terms`, `/robots.txt`, `/sitemap.xml`, `/favicon.svg`, `/apple-touch-icon.png`, and `/social-card.webp`. No dead link was found. The header/footer stayed consistent and include Privacy and Terms.
- The skip link moves focus into `main`; route links move focus to the next h1 and announce it. F-1-2 is the remaining history defect.
- Clean-clone Playwright axe checks reported no serious or critical violations. At 390 px both `/` and `/demo` had `scrollWidth === 390`; Reset, exit, and demo buttons measured at least 44 px high. Reduced-motion coverage passed in the complete suite.
- The topographic field-map art, paper palette, contour rules, clipped controls, and survey labels match `.factory/design.md` and are distinct from a generic SaaS layout. The SVG favicon and WebP artwork are self-hosted. No third-party fonts, scripts, trackers, or requests were observed.
- Hashed JS/CSS and artwork have `Cache-Control: public, max-age=31536000, immutable`. Initial JS is 5.30 kB gzip.

## Earlier-review history

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. I read `.factory/verification.md`, `.factory/verification-2.md`, and the prior handoff. The first verification’s findings were checked again rather than accepted as resolved on paper.

| Earlier finding | Current confirmation |
| --- | --- |
| Clean-clone claim commands failed | Fixed: all 22 listed commands passed independently from a fresh clone. |
| Desktop first action/facts were below the fold | Fixed: action and facts finish at y=725 and y=760 at 1366 × 768. |
| Network bypass from an ordinary Node runtime | Fixed: the current `network-opt-in` claim includes that `fetch` shape and passed. |
| Failed `--json check` emitted two documents | Fixed: `json-failure-document` passed and parsed one document. |
| 390 px horizontal overflow | Fixed: both tested routes were exactly 390 px wide. |
| TypeScript validation failed | Fixed: `npm run typecheck` passed in the clean clone. |
| Controls were under 44 px | Fixed: live demo controls measured 44–51 px high. |
| Unknown route returned HTTP 200 | Fixed: `/missing-route` returned 404. |
| Skip link did not move focus | Fixed: the suite and live check moved focus to `main`. |
| Previously named public promises lacked claims | Fixed for the earlier examples: direct execution, declared commands, environment isolation, demo isolation, exit codes, and JSON failures now have entries/tests. New unlisted or partial promises are recorded in F-1-7 through F-1-11. |
| Immutable cache headers were absent | Fixed: current hashed assets are immutable for one year. |

## Missed leverage

No AI feature is expected by the brief: an AI-generated or AI-edited command contract would weaken the stated safety boundary. The product already supplies the most obvious implied exports, Markdown and JSON reports. No decorative AI, provider key, import, export, or sync finding is warranted.

## What would make this perfect

Ship an honest recorded CLI demo rather than a simulated run control; preserve scroll position on Back/Forward; keep the demo status visible on phones; use `command` consistently; make the three copy changes above; and either test or remove each remaining public promise. Then rerun every listed claim command from a fresh clone plus the browser history and mobile-banner tests.
