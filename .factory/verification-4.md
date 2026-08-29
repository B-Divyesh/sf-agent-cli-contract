# Independent verification 4 — FAIL

**Candidate:** `6c50f87228bb9016d2c1539c9e13f5d8fd7fd632`  
**Live URL:** <https://agent-cli-contract.sociobot.in>  
**Verified:** 2026-08-29 UTC  
**Decision:** **FAIL — release blocked**

## Blocking finding

### High — skip link has a focus race

The required keyboard skip link does not reliably leave focus on the `main`
landmark. This fails the accessibility contract and makes the required local
quality gate flaky.

- A clean `npm test` run: **38 passed, 1 failed**. The failure was
  `skip link moves keyboard focus into the main landmark`, where Playwright
  observed `main` as inactive after Enter.
- Re-running that one test three times produced **2 passes and 1 failure**.
- On production, ten fresh keyboard-only `/demo` runs produced five outcomes
  focused on `MAIN#main` and five focused on `H1#page-title`, rather than a
  stable `MAIN#main` outcome.
- The implementation schedules `main.focus()` with `setTimeout(..., 0)` in
  `site/src/main.ts:374-376`; the observed competing focus explains the race.

This is release-blocking even though retries sometimes pass: the definition of
done requires keyboard operation and a passing local test suite.

## First-read result

**PASS.** On a cold live load, the first screen plainly says “Test CLI
contracts before agents depend on them,” names “CLI maintainers,” and explains
that stable output, exits, and errors are the goal. The visible primary action
is **“Try it with sample data”** and directly says it opens a recorded run with
four passing checks. It is one click to `/?demo=1`.

## Claims

`.factory/claims.json` exists and contains 30 declared claims. From the clean
checkout, invoking a claim before `npm ci` fails at `tsc: not found`; after the
required clean-install step (`npm ci`), every exact declared command
`npm test -- --grep @claim:<id>` passed from the shipped demo entry point.

| Claim IDs | Result |
| --- | --- |
| isolated-fixtures; mode-capture; snapshot-regression; nondeterminism; nondeterministic-field-allowlist; idempotency | PASS |
| inline-files; fixture-timeout; default-timeout; error-recovery; report-formats; secret-redaction | PASS |
| network-opt-in; demo-sandbox; no-third-party-data; recorded-demo; free-mit; no-cli-telemetry | PASS |
| local-execution; rust-version; starter-contract; copy-install-command; schema-output; contract-format-version | PASS |
| direct-execution; declared-commands; environment-isolation; cli-demo-isolation; exit-codes; json-failure-document | PASS |

The claim runs also passed their Rust tests, type check, site build, and the
targeted Playwright assertion. The final claim was invoked separately because a
newline-less shell pipeline did not consume its final record; it passed.

## Local build, package, and CLI evidence

- `npm run build`: **PASS**. It produced `dist/site` and the release CLI.
  Built initial assets are 18.79 kB JS (5.88 kB gzip) and 15.19 kB CSS
  (4.32 kB gzip), below the 200 kB/50 kB budgets.
- `cargo fmt --all -- --check`, `cargo clippy --all-targets -- -D warnings`,
  `cargo package`, `npm audit --omit=dev`, and `npm audit`: **PASS**.
- Clean consumer exercise: installed the binary to a fresh temporary
  `CARGO_INSTALL_ROOT`, then successfully ran `--help`, `schema` (version 1),
  `--json demo` (four-check report), and `init --command node` followed by
  `check --accept`. Invalid/missing suites exited **2** and `--json` returned
  one parseable document with `ok`, `exit`, and `error`.

## Live deployment and browser evidence

- Deployment matches the candidate build: production
  `assets/main-osEVYU_0.js` SHA-256 is
  `95865530be9754316e0d2928f4009a41b563bd538945ddd41d66a30298910e41`
  and production `assets/main-D8sVLijJ.css` SHA-256 is
  `0e2ade2c97c214558cf43c1b415c1c613034c8ddace2ad6a6864f00b84c7548e`;
  both exactly match locally built `dist/site`.
- Cold desktop and 390 px mobile checks: **PASS** for layout, visible focus
  styling, 44 px controls, and no mobile horizontal overflow (390 px scroll
  width == client width). Screenshots were inspected during verification.
- Axe WCAG 2 A/AA scan on home, demo, and 390 px demo: **0 violations**
  (including 0 serious/critical). This does not override the keyboard finding.
- Demo behavior: direct `/demo` provides the persistent sample-data banner,
  reset, exit, replay, and blocked-change recovery state. Demo keys use the
  `demo:` namespace and reset removes them. Service-worker offline reload of a
  previously loaded `/demo` succeeded.
- Privacy: a fresh live demo made only same-origin document, JS, CSS, and
  self-hosted recording requests. No third-party request, console error, or
  page error occurred. There is no sign-in flow.
- Headers: HSTS, CSP (`connect-src 'self'`, `frame-ancestors 'none'`),
  `nosniff`, referrer policy, and restrictive permissions policy are present.
  Hashed JS/CSS and images are `max-age=31536000, immutable`; `sw.js` and HTML
  are short revalidated. `/`, `/demo`, `/privacy`, and `/terms` return 200;
  an unknown route returns the designed 404 with status 404. All crawled live
  navigation links returned 200.
- The product is static and exposes no application server-side endpoint, so no
  request allowance or 429/`Retry-After` behavior is applicable.

## Required remediation

Make skip-link focus deterministic (the final active element must remain
`main#main` after keyboard activation), add a non-flaky regression test, and
re-run the complete suite from a clean install before resubmission.
