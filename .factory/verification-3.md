# Independent verification 3 — PASS

Verified 29 August 2026 for work order `agent-cli-contract-verify-3`.

- Candidate and GitHub `main`: `b038128e5532afe33fffb2d94b998081c9342b7b`
- Repository: <https://github.com/B-Divyesh/sf-agent-cli-contract.git>
- Live product: <https://agent-cli-contract.sociobot.in>
- Decision: **PASS — release candidate accepted**

## First read and demo

A cold 1440 × 900 visit answered all three required questions in plain words:

- **What:** “Test CLI contracts before agents depend on them.”
- **For whom:** CLI maintainers who need stable output, exits, and errors.
- **First click:** the visible “Try it with sample data” link, explicitly described as opening a recorded run with four passing checks.

The link was fully visible at y=680–730 and opened `/?demo=1` in one keyboard-operable action. The live demo showed the persistent “Demo — sample data, nothing is saved” banner, populated four-check report, blocked-change state, Reset demo, and exit to install steps. Reset left no browser keys; all sampled demo requests were same-origin.

## Clean-clone claims gate

Created a new clone at the candidate, ran `npm ci`, then executed every command in `.factory/claims.json` separately through the product test/demo entry point. **30/30 passed**; no claims file was missing and no claim command failed.

`isolated-fixtures`, `mode-capture`, `snapshot-regression`, `nondeterminism`, `nondeterministic-field-allowlist`, `idempotency`, `inline-files`, `fixture-timeout`, `default-timeout`, `error-recovery`, `report-formats`, `secret-redaction`, `network-opt-in`, `demo-sandbox`, `no-third-party-data`, `recorded-demo`, `free-mit`, `no-cli-telemetry`, `local-execution`, `rust-version`, `starter-contract`, `copy-install-command`, `schema-output`, `contract-format-version`, `direct-execution`, `declared-commands`, `environment-isolation`, `cli-demo-isolation`, `exit-codes`, and `json-failure-document` all returned exit 0.

This directly verifies the previously reported clean-clone issue is resolved: the self-contained `npm test` script builds the debug CLI before its Playwright tests.

## Local build and installed-consumer checks

All checks ran in the fresh clone:

| Check | Result |
| --- | --- |
| `npm test` | Pass: 3 Rust unit tests and 38 Playwright tests |
| `npm run typecheck` | Pass |
| `npm run build` | Pass; created `dist/site` and release CLI |
| `cargo fmt --all -- --check` | Pass |
| `cargo clippy --all-targets -- -D warnings` | Pass |
| `cargo package --allow-dirty` | Pass; verified package, 12 files, 64.9 KiB unpacked / 18.6 KiB compressed |
| `npm audit --audit-level=high` | Pass; zero vulnerabilities |

The packaged crate was installed into a new consumer root. Its installed `agent-contract` binary passed `--help`, `--version` (`0.1.0`), `schema` (version-1 schema), `demo` from a project containing a sentinel file, starter `init`, baseline acceptance, stable recheck, and missing-contract recovery (exit 2). The demo wrote its report under a new OS temporary directory and did not change the sentinel project file.

## Live deployment, privacy, accessibility, and performance

- GitHub `main` resolves to the tested candidate. A fresh local production build matched **13/13** publicly served runtime files byte-for-byte (HTML, JS, CSS, service worker, images, icons, robots, sitemap, and recording). `staticwebapp.config.json` is deployment configuration and correctly is not public.
- `/`, `/demo`, `/privacy`, and `/terms` returned 200; an unknown route returned the styled HTTP 404. Each checked page had `lang=en`, one `<h1>`, one `<main>`, route-specific title, and no load-time page or console errors on valid routes.
- Playwright Axe found zero serious or critical findings on desktop and 390 × 844 mobile home/demo views. Mobile document width equalled its 390 px viewport. Keyboard testing confirmed a visible 3 px focus ring, skip-link focus transfer to `main`, and Enter activation of the demo link with route focus moved to its h1. Reduced-motion styles reduced animation/transition durations to `0.01ms`.
- `/opt/fleet/lib/verify-url.sh` passed: HTTPS 200, title, `lang`, h1, main landmark, complete image alt attributes, and zero console errors.
- Demo traffic was exclusively `https://agent-cli-contract.sociobot.in`; no third-party scripts, fonts, trackers, or API calls were observed. Headers include HSTS, CSP with `connect-src 'self'`, `X-Content-Type-Options`, Referrer-Policy, and Permissions-Policy. Hashed JS uses `Cache-Control: public, max-age=31536000, immutable`.
- The service worker registered, accepted `registration.update()`, and `/demo` reloaded with its sample while offline after an online visit.
- Stable Lighthouse mobile live run: **Performance 98, Accessibility 100, Best Practices 100, SEO 100**; FCP 0.8 s, LCP 2.0 s, TBT 120 ms, CLS 0. Initial JS was 18,945 bytes raw / 5,990 gzip; CSS was 15,192 bytes raw / 4,320 gzip; the 221,536-byte WebP hero is within the 300 KB image budget.

This static, local CLI product exposes no server-side API or sign-in flow. Rate-limit and Entra tenant checks are therefore not applicable.

## Defects by severity

| Severity | Findings |
| --- | --- |
| Critical | None |
| High | None |
| Medium | None |
| Low | None |

## Evidence

Fresh, disposable verification evidence was generated under `/tmp/agent-cli-contract-verify-3.QbsBKq/`, including `claim-results-final.tsv`, per-claim logs, `npm-test-full-final.log`, package/consumer logs, `live-browser-qa.json`, `live-static-compare-final.tsv`, response headers, `verify-url-live-final/verify.json`, `sw-update.json`, and `lighthouse-live-stable.json`.

The first two Lighthouse attempts emitted a Chromium tab-crash while capturing a screenshot after gathering data. Re-running with `--disable-dev-shm-usage --disable-gpu` completed without a runtime error and produced the recorded 98/100/100/100 result above.
