# Polish round 3 handoff

Release candidate `89ea1cff50c9b05bcd78a5e3729708e47a222dee` has been repaired against every finding in reviews 1–3. The implementation is commit `acca53b1925b88853c334d1baf690df683ea17fb`; the deployed site is <https://agent-cli-contract.sociobot.in>.

## What changed

- Reflowed the mobile fixture report so every fixture, mode, exit, and result value fits without a horizontal scroll region.
- Added a 390 × 844 Axe and cell-bounds regression test.
- Added `starter-contract` and `copy-install-command` to `.factory/claims.json` with end-to-end tests.
- Added keyboard clipboard success, a polite announcement, and actionable denied-access feedback.
- Made `npm test` provision Rust 1.85.0 when needed; the minimum-version claim now compiles the locked package with that exact toolchain.
- Kept all earlier demo isolation, copy, routing, metadata, focus, 404, mobile, privacy, network, and CLI fixes intact.
- Updated `.factory/catalog-description.txt`, `.factory/copy-audit.md`, `.factory/demo.md`, and `.factory/polish-3.md`.

## Verification

From clean clone `/tmp/agent-cli-contract-polish3-w2B2eX/repo` at `acca53b1925b88853c334d1baf690df683ea17fb`:

- Every one of the 30 `.factory/claims.json` commands passed independently in 336.3 s.
- `npm test` passed 3 Rust tests and 38 Playwright tests, including browser, keyboard, 390 px Axe, privacy, same-origin requests, and offline reload.
- `npm run build`, `cargo fmt --check`, strict Clippy, verified `cargo package`, and both npm audits passed.
- Output sizes: JS 18.95 kB raw / 5.99 kB gzip; CSS 15.19 kB raw / 4.32 kB gzip; hero WebP below 300 kB.

Deployment `82b731d8-0ed9-464f-a4a7-d606e8c55412` completed successfully. Cold live checks found:

- `/?demo=1` opens in one click with the banner, reset, exit, realistic populated report, and separate `demo:` storage.
- At 390 × 844 the report is 316 px wide with `scrollWidth=316`; all columns are visible and Axe has zero serious/critical findings.
- `/`, `/demo`, `/privacy`, and `/terms` return 200 with unique titles and metadata; `/missing-route` returns a styled HTTP 404.
- Route focus, skip focus, Back scroll restoration, legal links, reduced motion, same-origin requests, and offline demo reload pass.
- Factory URL verification reports zero console errors on home and demo.
- Lighthouse mobile: 99 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 2.0 s, CLS 0, TBT 30 ms.

Evidence is indexed in `.factory/polish-3.md`, with raw live results at `.factory/evidence/polish-3-live-audit.json` and `.factory/evidence/lighthouse-polish-3-live.json`.

## Run and release

```sh
npm ci
npm test
npm run build
cargo package
```

The static site is in `dist/site`. The verified CLI package is ready for the factory-owned registry release; it was not published from this worker.

## Known gaps

None in the reviewed scope. All 20 cumulative findings are closed.
