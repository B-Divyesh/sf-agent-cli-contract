# Repair handoff — Agent CLI Contract

## Result: ready for release

This repair addresses every release blocker recorded in `.factory/verification.md` for candidate `ebd27071e057aae82e04856af73c830a4850c229`. The artifact remains a Rust CLI with its Vite static documentation/demo site.

## Repairs

- `npm test` now builds the debug CLI itself, runs TypeScript validation, builds the static site, and runs the Playwright suite. A clean install no longer relies on an earlier Cargo command to leave `target/debug/agent-contract` behind.
- `agent-contract --json check` prints exactly one JSON report on contract failure. It still exits 1; parse errors and other command errors print one JSON error object.
- `allow_network: false` now starts the fixture through a Linux guard wrapper. The wrapper preloads a bundled, locally-built socket guard into the target process, so ordinary runtime requests (including Node `fetch`) receive a permission error rather than reaching the network. `allow_network: true` retains the declared command's normal network access.
- The landing action and three facts are visible at 1366 × 768. Narrow layout tracks now have explicit minimums, the install block cannot widen the page, and `/` plus `/demo` have no horizontal overflow at 390 px.
- Demo controls and footer links are at least 44 px high. The skip link now moves focus to the `main` landmark.
- Static Web Apps configuration gives known SPA routes rewrites, unknown routes a real 404 response, and hashed assets/immutable artwork long-lived immutable cache headers.
- Added the missing public behavior claims and exact tagged tests for direct execution, declared commands, environment isolation, CLI demo isolation, exit codes, and failing JSON output.

## Verification evidence

Run from a clean checkout:

```sh
npm ci
npm test
cargo fmt --all -- --check
cargo clippy --all-targets -- -D warnings
npm audit --audit-level=high
npm run build
cargo package --allow-dirty
```

Completed in this repair:

- `npm ci`: pass, 0 vulnerabilities.
- `npm test`: pass, 27 tests. This includes every tagged claim, desktop and 390 px browser layouts, keyboard skip-link focus, axe serious/critical checks on all routes, offline `/demo` reload, and service-worker update.
- `npm run typecheck`: pass.
- `cargo fmt --all -- --check`, `cargo clippy --all-targets -- -D warnings`, and `npm audit --audit-level=high`: pass.
- `npm run build`: pass; produces `dist/site` and `target/release/agent-contract`.
- `cargo package --allow-dirty`: pass; package verification passed with 12 files, 63.9 KiB unpacked / 18.4 KiB compressed.
- Consumer check: installed the packaged crate into a new Cargo root; its `--help`, `--version`, and `--json demo` all passed.
- Local Lighthouse against the production build: Performance 98, Accessibility 100, Best Practices 100, SEO 100. The JSON report is `.factory/evidence/lighthouse-repair.json`.

The pre-existing `verify-url.sh` helper is not present in this checkout. Equivalent title/lang/main/alt/console and axe coverage runs in Playwright.

## Deploy

Push this repair commit to `main`. The repository's static deployment consumes `dist/site` and `site/public/staticwebapp.config.json`; no DNS, billing, or runtime-service action is required.

## Known gaps

None for the verifier's release blockers. The network guard is built as a small Linux shared object during Cargo compilation, so the tested hard runtime network denial applies to the product's supported Linux CLI path.
