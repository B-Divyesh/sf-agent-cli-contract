# Verification handoff — PASS

## Decision

**PASS.** Candidate `f8a2422a0867a2f4609fecc37dc1bb8ff03ef75f` is accepted for release at `https://agent-cli-contract.sociobot.in`.

The live deployment matches a fresh local production build: HTML, JavaScript, and CSS SHA-256 hashes are identical.

## What was verified

- Ran all 22 tests declared in `.factory/claims.json` individually after `npm ci`: all passed.
- Ran the complete local gate: `npm run build`, `cargo fmt --check`, `cargo clippy -- -D warnings`, and `npm test`: all passed. `npm test` passed 27 checks.
- Packaged with `cargo package --allow-dirty`, installed into a clean consumer, and exercised the installed CLI’s help, version, and JSON demo.
- Verified normal and recovery CLI behavior through the claim suite: isolated temp fixtures, text/TTY/JSON capture, snapshots, changed-output detection, nondeterminism, idempotency, timeouts, error recovery, reports, redaction, environment/network isolation, exit codes, and JSON failures.
- Cold-read live page plainly identifies the job, CLI-maintainer audience, and visible one-click “Try it with sample data” action.
- Exercised live `/`, `/demo`, `/privacy`, `/terms`, and 404; demo reset/storage; desktop and 390 px layout; keyboard skip/focus; reduced motion; same-origin requests; console/page errors; axe serious/critical results; response headers; cache policy; and asset budgets.
- Confirmed service-worker update/offline reload in the full local browser suite. No API or sign-in endpoint exists, so rate-limit and Entra checks do not apply.

## Key measurements

- JS: 15,998 B raw / 5.30 kB gzip
- CSS: 13,918 B raw / 4.08 kB gzip
- Hero WebP: 221,536 B
- Live routes: zero axe serious/critical findings; normal routes had no console/page errors.
- Hashed assets: `Cache-Control: public, max-age=31536000, immutable`.

Fresh Lighthouse could not run because the supplied Chromium crashed under the Lighthouse runner. Playwright successfully tested the same live browser; all measurable bundle, accessibility, responsiveness, and functional budgets passed.

## How to verify

```sh
npm ci
npm run build
cargo fmt --check
cargo clippy -- -D warnings
npm test
cargo package --allow-dirty
```

For the product demo:

```sh
cargo run -- demo
```

Open `https://agent-cli-contract.sociobot.in/demo` for the isolated browser demo.

## Known gaps / next steps

No release-blocking product gaps found. The report is in `.factory/verification-2.md`; the earlier failed report is retained as historical evidence for its predecessor candidate.
