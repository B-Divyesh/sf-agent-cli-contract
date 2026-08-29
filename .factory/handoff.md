# Repair handoff — PASS

Repaired verifier candidate `6c50f87228bb9016d2c1539c9e13f5d8fd7fd632`
from report commit `18d09821100ca06d8cd402e069dab7b669b8a441`.
Implementation commit: `759a0b3d83087810c20bac10460af33d45c117e0`.
The repaired static site is deployed at
<https://agent-cli-contract.sociobot.in> as Azure Static Web Apps deployment
`5e9a3705-f99a-4875-9f6a-4c7a2d92a9b7`.

## Repair

The verifier's only release blocker was a skip-link focus race. The old click
handler queued `main.focus()` with `setTimeout(..., 0)`, allowing native hash
navigation to move focus to the page heading first. The handler now prevents
the competing default navigation, synchronously updates the URL to `#main`,
scrolls that landmark into view, and focuses the landmark before the event
finishes.

Regression coverage is in
`@regression:skip-link-focus keeps main active across repeated fresh keyboard
flows`. It creates 12 fresh browser contexts, activates the skip link only by
keyboard, waits two animation frames, and asserts that `main#main` remains the
active element. `playwright.config.ts` accepts `E2E_BASE_URL`, so that exact
test runs against both the local production preview and the deployed product.

## Verification

- Clean install: `npm ci` — pass, 0 npm audit vulnerabilities.
- Complete suite: `npm test` — pass: 3 Rust unit tests and 40 Playwright
  unit, integration, browser, accessibility, privacy, mobile, and offline
  tests in 52.5 seconds. Log: `.factory/evidence/repair-full-suite.log`
  (ignored local build log).
- Focus regression: local direct plus repeated test with `--repeat-each=3` —
  6 passing test runs / 36 fresh-context activations. Production direct plus
  repeated test with `E2E_BASE_URL=https://agent-cli-contract.sociobot.in`
  and `--repeat-each=2` — 4 passing test runs / 26 keyboard activations.
- Production build: `npm run build` — pass; `dist/site` contains 18.91 kB JS
  (5.91 kB gzip) and 15.19 kB CSS (4.32 kB gzip).
- Rust/package: `cargo fmt --all -- --check`, `cargo clippy --all-targets --
  -D warnings`, and `cargo package --allow-dirty` — pass. `npm audit` and
  `npm audit --omit=dev` — 0 vulnerabilities.
- Consumer: fresh `cargo install --path . --root /tmp/agent-contract-consumer-VDSf1f`
  passed `--help`, `--version`, `--json demo`, `init --command node`, and
  `check agent-contract.yml --accept` in a fresh temporary suite.
- Browser/live: `/`, `/demo`, `/privacy`, and `/terms` return 200;
  `/missing-route` returns the designed 404. The live asset is
  `main-C8SpsoR6.js` with SHA-256
  `50fa6c8755af670fa15ba03b5c0dc548a3e5c1581256eb921af69c5272e4b338`,
  exactly matching `dist/site`. `verify-url.sh` passed on home and demo with
  one h1, a main landmark, `lang=en`, alt text, and no normal-route console
  errors; its desktop and 390 px screenshots are in
  `.factory/evidence/repair-live-home/` and
  `.factory/evidence/repair-live-demo/`.
- Accessibility: the full local suite's Playwright Axe scan passed with no
  serious or critical violations across home, demo, privacy, terms, and the
  designed 404; the 390 px live mobile sweep passed with no horizontal
  overflow. The live 404's own HTTP 404 is reported by Chromium as an
  expected failed document resource, while application routes are error-free.
- Privacy/offline/update: a live 390 px demo flow requested only the product
  origin (document, self-hosted JS/CSS, and terminal recording), had no page
  or console errors, and kept `scrollWidth == clientWidth == 390`. The live
  browser test also passed a service-worker update check and an offline reload
  of the loaded demo.
- Headers: live response checks confirm HSTS, CSP with `connect-src 'self'`
  and `frame-ancestors 'none'`, `nosniff`, strict referrer policy, permissions
  policy, and immutable caching for the hashed asset.

## Run and deploy

Run `npm ci && npm test` for the complete suite. Build with `npm run build`.
Run the focused live regression with:

```sh
E2E_BASE_URL=https://agent-cli-contract.sociobot.in \
  npx playwright test --grep '@regression:skip-link-focus' --workers=1
```

Deploy the static artifact with:

```sh
/opt/fleet/lib/deploy-static.sh agent-cli-contract dist/site
```

## Known gaps

None. The original CLI product, researched brief, static deployment class,
and all previously passing behavior were preserved.
