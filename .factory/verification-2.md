# Independent verification 2 — PASS

Verified 28 August 2026 for work order `agent-cli-contract-verify-2`.

- Candidate: `f8a2422a0867a2f4609fecc37dc1bb8ff03ef75f`
- Repository: `https://github.com/B-Divyesh/sf-agent-cli-contract.git` (`main`)
- Live URL: `https://agent-cli-contract.sociobot.in`
- Decision: **PASS — release candidate accepted**

This is a fresh verification from the supplied checkout. It supersedes the failed report for the earlier candidate. The deployed HTML, JavaScript, and CSS match a fresh production site build byte-for-byte.

## First read (cold live visit)

At 1366 × 768 the first screen plainly says: “Test CLI contracts before agents depend on them.” It names the audience as CLI maintainers who need stable output, exits, and errors. The visible primary action is **“Try it with sample data”**, with the adjacent explanation “Opens a recorded run with four passing checks.” It therefore answers what it does, who it is for, and what to click first without scrolling. The action opens `/demo` in one click.

## Mandatory claim gate

`.factory/claims.json` is present and has 22 entries. After `npm ci`, every declared command was run separately and passed from the clean candidate checkout. Each command invokes the product test flow, which builds the Rust CLI and runs the appropriate CLI or browser-demo assertion.

| Claim IDs | Result |
| --- | --- |
| `isolated-fixtures`, `inline-files`, `mode-capture`, `snapshot-regression`, `nondeterminism`, `idempotency`, `fixture-timeout` | Pass |
| `error-recovery`, `report-formats`, `secret-redaction`, `network-opt-in` | Pass |
| `demo-sandbox`, `no-third-party-data`, `free-mit`, `no-cli-telemetry`, `rust-version` | Pass |
| `direct-execution`, `declared-commands`, `environment-isolation`, `cli-demo-isolation`, `exit-codes`, `json-failure-document` | Pass |

The full, unfiltered test run also passed: **27 Playwright/unit/integration checks passed**.

## Local build, quality gates, and CLI consumer test

- `npm ci`: pass (23 packages; audit reported no vulnerabilities).
- `npm run build`: pass; built `dist/site` and the release Rust CLI.
- `npm test`: pass; 27/27 tests, including claims, route accessibility, mobile layout, keyboard focus, service-worker update/offline reload, 404, and asset budgets.
- `npm run typecheck`: pass (as part of `npm test`).
- `cargo fmt --check`: pass.
- `cargo clippy -- -D warnings`: pass.
- `cargo package --allow-dirty`: pass; package verification compiled the published crate (12 files, 63.9 KiB unpacked / 18.4 KiB compressed).
- Clean consumer: installed the packaged source into a new Cargo root; `agent-contract --version`, `--help`, and `--json demo` passed. The demo returned `ok: true` and a temporary report path.

Representative end-to-end cases were covered by the claims and full suite: accepted snapshots; changed snapshots; TTY/JSON/text capture; structured expected error/recovery; timeout; repeated-run/idempotency change; JSON nondeterminism path reporting; inline files; secret redaction; host-environment isolation; socket/network denial without opt-in; documented exits 0/1/2; and single-document JSON failure output.

## Live deployment, privacy, and browser QA

- Cold live page: HTTPS 200, title `Agent CLI Contract — test stable command output`, one H1, `lang=en`, one main landmark, no console or page errors, and only same-origin requests for HTML, JS, CSS, and the self-hosted WebP.
- Live `/`, `/demo`, `/privacy`, and `/terms`: 200, route-specific titles, exactly one H1/main, and zero axe serious/critical violations. `/missing-route` returns a real HTTP 404 with its styled not-found page.
- Demo: the Run action completed with “Four checks passed. The sample workspace was discarded.” Blocked-state storage used only `demo:report`; Reset removed all `demo:` keys. Normal demo requests remained same-origin.
- Keyboard: the skip link is first, Enter moves focus to `<main>`, and the focused action has a 3 px solid outline plus visible shadow. At 390 × 844, home and demo widths were exactly 390 px; primary/demo controls measured at least 44 px high.
- Reduced motion: `scroll-behavior: auto`; animation and transition duration reduce to `0.01ms`.
- Browser service-worker update and offline reload are covered and passed in the local full suite.
- No API or sign-in endpoint exists (`/api/health` is 404), so rate limiting and Entra tenant checks are not applicable.
- Response policies: HSTS, CSP restricted to self, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and restrictive Permissions-Policy are present. Hashed JS/CSS and artwork use `Cache-Control: public, max-age=31536000, immutable`.

## Deployment identity and performance

Fresh SHA-256 comparisons show the live `index.html`, `assets/index-DMsPZgcl.js`, and `assets/index-CWJTBH9q.css` equal the fresh local production build exactly. Live asset headers reference the same deployed fingerprints.

- Initial JS: 15,998 bytes raw / 5.30 kB gzip (under 200 kB).
- Initial CSS: 13,918 bytes raw / 4.08 kB gzip (under 50 kB).
- Hero WebP: 221,536 bytes (under 300 kB).

The attempted fresh Lighthouse CLI run could not complete because its runner crashed against the provided Chromium executable (`Browser tab has unexpectedly crashed`). This is an environment-tool incompatibility, not a page error: Playwright loaded and exercised the same live browser successfully. Bundle budgets, rendering behavior, and axe checks above were independently measured and pass.

## Defects

No critical, high, medium, or low product defects found for this candidate.

## Verification notes

The earlier verification report concerns predecessor `ebd2707` and correctly described its clean-test/deployment defects. This candidate’s self-contained test script now builds the debug binary before browser claims; the fresh independent 22-command claim sweep and full 27-test run demonstrate that the prior failure no longer applies.
