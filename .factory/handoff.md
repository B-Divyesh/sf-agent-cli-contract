# Polish 2 handoff

Repair commit `1d1f36658153632ef1e93abb135a33cc9b840c9b` fixes every finding in `.factory/review-1.md` and `.factory/review-2.md`, including the new phone-first demo layout and three previously unlisted README contract claims. It is pushed to `origin/main`.

## What changed

- At 390 px, the real four-check sample report precedes the YAML fixture sheet. Its PASS heading and first fixture result are visible in the first 844 px viewport.
- README no longer contains the internal factory release sentence. Its allowlist, schema, and version-1 promises now have executable claims and tests.
- Added `nondeterministic-field-allowlist`, `schema-output`, and `contract-format-version` to `.factory/claims.json`; catalog description is a verb-first, 62-character sentence.
- Preserved the cartographic paper, contour, route-marker visual system and the existing honest recorded CLI demo, isolation, routes, legal pages, offline support, and accessibility behavior.

## Verify

From a clean clone:

```sh
npm install
npm test
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo package
```

Every one of the 28 manifest claim commands was also run separately from `/tmp/agent-cli-contract-polish-2-FI9Nk8/repo`; all passed. The full clean-clone `npm test` passed 3 Rust tests and 35 Playwright tests. That suite includes the Axe serious/critical scan, privacy/network interception, offline reload, metadata/404, keyboard, history, and mobile demo first-viewport checks. `npm audit --omit=dev` reported zero vulnerabilities.

Build with `npm run build`; deployment output is `dist/site`. The ready package is verified by `cargo package` and is not published by this work order.

## Evidence and status

- Finding-to-evidence map: `.factory/polish-2.md`.
- Built-site screenshots: `.factory/evidence/polish-2-home-desktop.png` and `.factory/evidence/polish-2-mobile-demo.png`.
- Local size output: JS 18.42 kB / 5.87 kB gzip; CSS 14.97 kB / 4.25 kB gzip.
- Live URL: <https://agent-cli-contract.sociobot.in/?demo=1>. Deployment through `/opt/fleet/lib/deploy-static.sh agent-cli-contract dist/site` completed as Azure deployment `2df3f06e-d4be-4836-a5fa-51bd0edb050c`. A cold 390 × 844 visit confirmed the Demo title, visible PASS heading at 676.7 px, visible first fixture row at 834.5 px, sticky demo banner, blocked-change/reset interaction, and no console errors on normal routes. `/privacy`, `/terms`, and the designed HTTP 404 route were also rechecked.

Known product gaps: none.
