# Independent verification 5 — PASS

Verified 29 August 2026 for work order `agent-cli-contract-verify-5`.

- Candidate: `5aab55a8ca0aaedcc13694f1295db5cf61248d7b`
- Live URL: <https://agent-cli-contract.sociobot.in>
- Result: **PASS — release candidate accepted**

## Cold first read

Fresh uncached home at 1440 x 900 plainly states that it tests CLI contracts,
names CLI maintainers as the audience, and presents **Try it with sample data**
with “Opens a recorded run with four passing checks.” The action is visible at
1366 x 768 and 390 x 844 and opens the populated `/demo` in one click.

## Clean gates and claims

Started from a source-clean checkout at the candidate commit.

- `npm ci`: passed. `npm audit` and `npm audit --omit=dev`: 0 vulnerabilities.
- Each exact command from `.factory/claims.json` was independently run as
  `npm test -- --grep @claim:<id>`: all passed.
- `npm test`: passed (3 Rust unit tests and all 40 Playwright tests).
- `npm run build`: passed, producing `dist/site` and `target/release/agent-contract`.
- `cargo fmt --all -- --check`, `cargo clippy --all-targets -- -D warnings`,
  and `cargo package --allow-dirty --no-verify`: passed. Package size was
  64.9 KiB unpacked / 18.6 KiB compressed.

| Claim | Result | Observable assertion exercised |
| --- | --- | --- |
| `isolated-fixtures` | PASS | Fresh fixture workdir is isolated. |
| `mode-capture` | PASS | Text, real TTY, and JSON modes are captured. |
| `snapshot-regression` | PASS | Changed approved stdout is reported. |
| `nondeterminism` | PASS | Changed JSON path is named. |
| `nondeterministic-field-allowlist` | PASS | Declared JSON path is allowed. |
| `idempotency` | PASS | Second-run output change is reported. |
| `inline-files` | PASS | Inline file remains inside fixture space. |
| `fixture-timeout` | PASS | 40 ms fixture is stopped. |
| `default-timeout` | PASS | 10000 ms default is enforced and reported. |
| `error-recovery` | PASS | Expected exit 4 plus recovery passes. |
| `report-formats` | PASS | Matching Markdown and JSON reports are written. |
| `secret-redaction` | PASS | Declared secret is absent from artifacts. |
| `network-opt-in` | PASS | Undeclared curl and runtime fetch are blocked. |
| `demo-sandbox` | PASS | Reset removes only `demo:` sample state. |
| `no-third-party-data` | PASS | Browser demo flow remains same-origin. |
| `recorded-demo` | PASS | Recording matches a fresh CLI demo report. |
| `free-mit` | PASS | MIT license and manifest are confirmed. |
| `no-cli-telemetry` | PASS | Source/lock/demo check finds no telemetry path. |
| `local-execution` | PASS | Local artifacts are written with networking denied. |
| `rust-version` | PASS | Locked package builds with Rust 1.85.0. |
| `starter-contract` | PASS | v1 starter initializes, accepts, and checks. |
| `copy-install-command` | PASS | Keyboard clipboard success/recovery are announced. |
| `schema-output` | PASS | Complete v1 schema parses. |
| `contract-format-version` | PASS | v1 accepted; v2 rejects with guidance. |
| `direct-execution` | PASS | Shell metacharacters remain a literal argument. |
| `declared-commands` | PASS | Only nonempty declared executable is accepted. |
| `environment-isolation` | PASS | Host-only secret is unavailable to fixture. |
| `cli-demo-isolation` | PASS | Project sentinel is left untouched. |
| `exit-codes` | PASS | Invalid/fail/pass produce 2/1/0. |
| `json-failure-document` | PASS | Failure output is one parsable JSON document. |

Reviewed landing/README claims all have the corresponding claim entry above.

## Packed consumer and CLI exercise

The generated crate was unpacked and installed into a new temporary Cargo prefix.
The installed binary returned `agent-contract 0.1.0`, rendered `--help`, created a
starter contract using `init --command <installed binary>`, accepted it, then
rechecked it successfully. Its `--json demo` returned `ok: true` and a temporary
report. The resulting report declared PASS and contained both snapshots and JSON
report files. Full tests additionally cover invalid format, changed snapshot,
recoverable JSON error, timeouts, redaction, network allowance, and JSON failure
recovery paths.

## Live product QA

- Live `main-C8SpsoR6.js` SHA-256 exactly matches candidate build:
  `50fa6c8755af670fa15ba03b5c0dc548a3e5c1581256eb921af69c5272e4b338`.
- Bundles: 18,909-byte JS (5,934 gzip), 15,192-byte CSS (4,329 gzip), and
  221,536-byte hero WebP: within stated JS/CSS/hero budgets.
- `/`, `/demo`, `/privacy`, `/terms` return 200; unknown route returns designed
  HTTP 404. Every live landing link returns 200.
- Cold and full demo request logs contain only the site origin. Replay/change/reset
  causes no third-party request. Reset leaves no localStorage keys.
- The demo visibly changes to a one-failure report (`error.code changed`) then
  resets to four passes. Normal routes have no console or page errors.
- CSP is self-only, including `connect-src 'self'` and `frame-ancestors 'none'`;
  HSTS, `nosniff`, strict referrer/permissions policies, and immutable one-year
  caching on the hashed JS asset are present.
- Axe scans on home, demo, privacy, terms, and 404 found zero serious/critical
  findings. The expected failed-document console message appears only for the
  intentional HTTP 404.
- Keyboard: first Tab exposes the 3px-outlined skip link; Enter leaves
  `MAIN#main` active. Its focus target is 198.6 x 44.8 CSS px.
- At 390 x 844, home/demo/privacy/terms all have `scrollWidth == clientWidth == 390`.
- Reduced motion changes animation/transition duration to 0.01ms and scrolling to
  `auto`.
- A live service worker controlled `/demo`; after `registration.update()`, an
  offline reload returned 200 and retained its H1.

No product server API, account flow, product-unlock call, or sign-in exists; the
429/request-allowance and Entra tenant checks are not applicable.

Fresh Lighthouse CLI scoring could not run because Lighthouse 13.4.1 could not
attach to the supplied preinstalled Chromium. This is an environment limitation;
independent bundle-budget, live-browser, Axe, mobile, console, and offline checks
all pass.

## Defects by severity

None found.

## Re-run

```sh
npm ci
npm test
npm run build
cargo fmt --all -- --check
cargo clippy --all-targets -- -D warnings
cargo package --allow-dirty --no-verify
```
