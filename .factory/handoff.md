# Polish 4 handoff — PASS

Agent CLI Contract is repaired, committed, pushed, and deployed at <https://agent-cli-contract.sociobot.in>.

## Delivered

- Implementation commit: `527fc745b70dc89468239ade7da9e4370a03ff0b` (`fix: use direct product language`), pushed to `main`.
- Replaced every decorative cartographic label identified in review 4 with direct product language. The map artwork, paper palette, clipped controls, contour styling, and field-sheet layout remain intact.
- Preserved and rechecked all earlier repairs: the isolated `?demo=1` path, persistent banner/reset/exit, recorded real CLI demo, claim manifest, legal routes, per-route metadata, focus/history behavior, real 404, mobile report reflow, clipboard feedback, offline reload, and CLI safety boundaries.
- Updated the catalog sentence to a verb-first, 84-character description: “Test a CLI's output, exit codes, errors, and repeat runs before agents depend on it.”

## Exact verification evidence

- Clean clone: `/tmp/agent-cli-contract-polish4-pSRbxZ/repo` at `527fc745b70dc89468239ade7da9e4370a03ff0b`.
- Every `claims.json` command was executed separately from that clone: 30/30 passed in 334 seconds. Raw results: `evidence/polish-4-clean-claim-results.tsv`.
- Full clean-clone suite passed: 3 Rust unit tests and 39 Playwright tests in 48.0 seconds. `npm run build`, `cargo fmt --all -- --check`, `cargo clippy --all-targets -- -D warnings`, verified `cargo package`, and both `npm audit` variants passed. Details: `evidence/polish-4-clean-quality.txt`.
- Deployed `dist/site` to production with the Static Web Apps work-order configuration. The live custom domain serves `assets/main-osEVYU_0.js`.
- Cold live verifier passed on home and direct demo: `evidence/polish-4-live-home-verify/verify.json`, `evidence/polish-4-live-demo-verify/verify.json`.
- Live browser audit passed for copy, direct demo, isolation, reset, mobile layout, all routes, metadata, Axe, privacy, real 404, and offline reload: `evidence/polish-4-live-audit.json`. Demo reset/exit evidence: `evidence/polish-4-live-demo-state.json`.
- Live screenshots: `evidence/polish-4-live-home-desktop.png`, `evidence/polish-4-live-demo-mobile.png`, and `evidence/polish-4-live-404.png`.
- Live Lighthouse: Performance 98, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 2.0 s, CLS 0, TBT 110 ms: `evidence/lighthouse-polish-4-live.json`.

## Run locally

```sh
npm ci
npm test
npm run build
cargo fmt --all -- --check
cargo clippy --all-targets -- -D warnings
cargo package
```

Use `agent-contract demo` for the CLI sample, or open `/?demo=1` for the isolated browser demo.

## Known gaps and next steps

None. All findings from reviews 1–4 are resolved and production has been cold-checked after deployment.
