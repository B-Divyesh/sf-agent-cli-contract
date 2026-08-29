# Verification handoff 5 — PASS

Independent QA accepts candidate `5aab55a8ca0aaedcc13694f1295db5cf61248d7b`
for <https://agent-cli-contract.sociobot.in>.

The live `main-C8SpsoR6.js` is byte-identical to the candidate production build:

```text
50fa6c8755af670fa15ba03b5c0dc548a3e5c1581256eb921af69c5272e4b338
```

This fresh result confirms the prior deployment-only concern is not present.

## What was verified

- Clean `npm ci`; both npm audits reported 0 vulnerabilities.
- Every one of the 30 commands declared in `.factory/claims.json`, independently,
  passed from the candidate checkout.
- `npm test` passed (3 Rust unit tests and 40 Playwright tests).
- `npm run build`, formatting, Clippy, and `cargo package --allow-dirty --no-verify`
  passed.
- A packed crate was unpacked, installed to a new temporary Cargo root, and its
  installed CLI passed help/version, init, accept/check, and JSON demo flows.
- Cold live first read clearly names the job, audience, and one-click sample demo.
- Live home/demo/privacy/terms, desktop and 390px mobile, keyboard skip focus,
  reduced motion, demo state/reset, request destinations, headers/caching, Axe,
  service-worker update, and offline demo reload all passed.

## Evidence

- Candidate and live URL: `5aab55a8ca0aaedcc13694f1295db5cf61248d7b`,
  <https://agent-cli-contract.sociobot.in>
- Production assets: 18,909-byte JS (5,934 gzip), 15,192-byte CSS (4,329 gzip),
  and 221,536-byte hero WebP.
- Live CSP is self-only with `connect-src 'self'` and `frame-ancestors 'none'`;
  HSTS, nosniff, restrictive referrer/permissions headers, and immutable hashing
  cache are present.
- Axe has zero serious/critical findings across home, demo, privacy, terms, and
  designed 404. Normal routes have no console/page errors; the deliberate 404
  naturally logs its failed document resource.

The complete claim-by-claim table and browser/CLI evidence are in
`.factory/verification-5.md`.

## Run and deploy

```sh
npm ci
npm test
npm run build
cargo fmt --all -- --check
cargo clippy --all-targets -- -D warnings
cargo package --allow-dirty --no-verify
```

Deploy `dist/site` with the factory deployment workflow.

## Defects and known gaps

No product defects found. Lighthouse 13.4.1 could not attach to the supplied
preinstalled Chromium, so fresh Lighthouse scores were not collected; equivalent
bundle, live-browser, Axe, mobile, console, header, and offline checks passed.
