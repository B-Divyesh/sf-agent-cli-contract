# Independent verification — FAIL

Verified 28 August 2026 for work order `agent-cli-contract-verify-1`.

- Candidate: `ebd27071e057aae82e04856af73c830a4850c229`
- Repository: `https://github.com/B-Divyesh/sf-agent-cli-contract.git`, branch `main`
- Live URL: `https://agent-cli-contract.sociobot.in`
- Decision: **FAIL — do not release this candidate**

This result comes from fresh evidence. The live static product matches the candidate, and much of the CLI works after an extra build step, but mandatory claims fail from a clean clone. The first action is also below the fold on common desktop viewports. Independent functional testing found that failed `--json` output is not valid JSON and that network access is possible without `allow_network: true`.

## Release-blocking findings

### 1. Critical — 13 of 16 declared claims fail from a clean clone

I ran every command in `.factory/claims.json` after dependency installation. Thirteen claim IDs fail and three pass. A separate clean clone at the exact candidate reproduced the failure with:

```text
npm ci       PASS
npm test     FAIL: 12 failed, 6 passed
```

The shared cause is `tests/product.spec.ts:10`, which launches `target/debug/agent-contract`. The `npm test` script runs `cargo test`, but that does not create this executable at that path in a clean tree. The affected tests receive `ENOENT`. A prior build or `cargo clippy --all-targets` masks the defect; after clippy created the debug binary, `npm test` passed all 18 tests. The public clean-clone command remains broken and the claim contract says any failing claim test blocks release.

| Claim ID | Clean result | Evidence |
| --- | --- | --- |
| `isolated-fixtures` | Fail | expected exit 0; received `ENOENT` |
| `mode-capture` | Fail | expected exit 0; received `ENOENT` |
| `snapshot-regression` | Fail | baseline command received `ENOENT` |
| `nondeterminism` | Fail | expected exit 1; received `ENOENT` |
| `idempotency` | Fail | expected exit 1; received `ENOENT` |
| `inline-files` | Fail | shares the isolated-fixtures test; received `ENOENT` |
| `fixture-timeout` | Fail | expected exit 1; received `ENOENT` |
| `error-recovery` | Fail | demo command received `ENOENT` |
| `report-formats` | Fail | empty stdout could not be parsed as JSON |
| `secret-redaction` | Fail | expected exit 0; received `ENOENT` |
| `network-opt-in` | Fail | expected exit 1; received `ENOENT` |
| `demo-sandbox` | Pass | demo-prefixed state cleared on reset |
| `no-third-party-data` | Pass | all browser demo requests remained same-origin |
| `free-mit` | Pass | LICENSE and Cargo manifest declare MIT |
| `no-cli-telemetry` | Fail | demo command received `ENOENT` |
| `rust-version` | Fail | version stdout was empty because the binary was absent |

Evidence: `verification-artifacts/claim-tests-after-install.log`, `verification-artifacts/claims-fresh/`, and `verification-artifacts/clean-gates.log`.

### 2. High — the cold desktop first screen hides the required first action

Cold-read interpretation:

- What it does: tests CLI output, exits, errors, and repeat runs before agents depend on them.
- Who it is for: CLI maintainers.
- First action: “Try it with sample data,” which opens a recorded four-check run.

The words are clear, and the mobile 390 × 844 view shows the action and all three facts. Desktop layout fails the first-screen requirement:

| Viewport | Demo action position | Result |
| --- | ---: | --- |
| 1440 × 900 | top 855.7 px; bottom 906.5 px | Partly clipped |
| 1366 × 768 | top 844.4 px | Entirely below fold |
| 1280 × 720 | top 798.6 px | Entirely below fold |
| 390 × 844 | top 613.3 px; bottom 664.1 px | Fully visible |

At 1366 × 768 and 1280 × 720 a cold visitor cannot see what to click first without scrolling. The three plain facts are also below the fold on all tested desktop sizes. The acceptance contract explicitly makes this an automatic failure.

Evidence: `verification-artifacts/viewport-overflow.json`, `verification-artifacts/live-cold-desktop.png`, and `verification-artifacts/live-mobile-home.png`.

### 3. High — network access is not opt-in

I ran an ordinary Node fixture with `allow_network: false`. Its fixed script called `fetch('https://example.com')`. The network guard did not recognize the embedded URL, Node reached the site and printed `status=200`, and Agent CLI Contract returned exit 0 with a passing report.

```text
{"passed":true,"summary":{"passed":1,"failed":0,"snapshots_written":2},...}
status=200
```

This violates the researched constraint that network use be opt-in and falsifies the live statements “Network use is opt-in” and “A fixture may use the network only when its contract allows it.” The current claim test checks only a direct `curl https://...` shape and does not prove the broader public claim.

Evidence: `verification-artifacts/network-bypass.yml`, `verification-artifacts/network-bypass.log`, and `verification-artifacts/snapshots/undeclared-network-from-ordinary-runtime.text.stdout`.

### 4. High — failure output from `--json check` is not one JSON document

Checking a valid starter contract before snapshots exist correctly exits 1, but stdout contains a report object followed by a second error object. `JSON.parse(stdout)` fails with:

```text
Unexpected non-whitespace character after JSON at position 344
```

This breaks the documented script-readable interface on the failure path, exactly where an agent needs structured diagnostics. Success and invalid-contract JSON paths did parse correctly.

Evidence: `verification-artifacts/cli-json-failure.log`.

## Other findings

### High — 390 px layouts overflow horizontally

At a 390 px viewport, the home page has a 730 px document scroll width and `/demo` has a 656 px document scroll width. The home install block and demo fixture/report panels force the overflow. This violates the required mobile and text-reflow behavior even though the first mobile screen itself looks polished.

### Medium — TypeScript validation fails

`npx tsc --noEmit` exits 2. Errors include missing Node type declarations, missing Vite `ImportMeta.env` typing, implicit `any` values, and incompatible Playwright `Page` types. There is no repository typecheck script, despite TypeScript and `tsconfig.json` being present.

### Medium — required 44 px targets are undersized

On `/demo`, “Reset demo” and “Start for real” are 36 px high. Footer Privacy and Terms links are about 21 px high across routes. The required minimum is 44 × 44 CSS px.

### Medium — unknown routes return HTTP 200

`GET /does-not-exist` renders the styled not-found screen but returns HTTP 200. `staticwebapp.config.json` has a navigation fallback and no `responseOverrides.404`, so this is not a real 404 response.

### Medium — the skip link does not move keyboard focus into main content

The skip link is first in the tab order and has a clear 3 px focus outline. Activating it scrolls to the main content, but `document.activeElement` remains `BODY` because `<main>` is not focusable. Screen-reader and keyboard focus therefore do not move to the skipped content.

### Medium — public claims are missing claim entries

The landing page, README, privacy page, and demo documentation make additional observable promises with no matching `.factory/claims.json` entry. Examples include direct execution without a shell, only declared commands being started, a small environment allowlist, host secret variables not being passed, the CLI demo never touching project data, and invalid/empty suites exiting 2. The claims contract requires each such promise to have one tagged sandbox test.

### Low — immutable asset caching is absent

Hashed JS/CSS and image responses use `Cache-Control: public, must-revalidate, max-age=30`; they do not receive long-lived immutable caching as required by the performance contract.

## Passing evidence

### Clean build, lint, package, and consumer install

- `npm ci`: pass; 23 packages audited, zero vulnerabilities.
- `npm run build`: pass; produced `dist/site` and `target/release/agent-contract`.
- `cargo test`: 3/3 unit tests pass as the first stage of `npm test`.
- `cargo clippy --all-targets -- -D warnings`: pass.
- `cargo fmt --all -- --check`: pass.
- `npm audit --audit-level=high`: pass, zero vulnerabilities.
- `cargo package --allow-dirty`: pass; 10 files, 59.3 KiB unpacked and 16.9 KiB compressed.
- Packaged crate installed into a new Cargo root: pass; installed `agent-contract 0.1.0`.
- Installed CLI: `--help`, `--version`, `schema`, `demo`, `init`, baseline approval, stable recheck, Markdown/JSON report creation, duplicate-init recovery, empty input, and missing input behaved as documented apart from the failed-check JSON defect above.

### Live deployment identity and browser behavior

- Remote `main` and the local candidate both resolve to `ebd27071e057aae82e04856af73c830a4850c229`.
- Ten deployed runtime files—including HTML, hashed JS/CSS, service worker, images, icons, robots, and sitemap—match candidate build bytes by SHA-256. `staticwebapp.config.json` is consumed by the host and is not exposed as a file.
- `/`, `/demo`, `/privacy`, and `/terms` return 200 over HTTPS.
- No console errors, page errors, failed requests, third-party origins, external fonts, trackers, or analytics were observed across the routes.
- Security headers include HSTS, CSP, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`.
- Browser demo: one click enters `/demo`; the sample report is immediately populated; blocked state, reset, and start-for-real clear demo-prefixed storage; only `demo:report` is written.
- Service worker registration, update call, and offline reload of `/demo` pass after an online visit.
- No server API or sign-in exists. Rate-limit and Entra tenant checks are not applicable.

### Accessibility and performance

- Factory `verify-url.sh`: pass; HTTPS 200, title, `lang=en`, one H1, main landmark, alt text, and no console errors.
- Playwright axe across home, demo, privacy, terms, and not-found views: zero serious or critical findings.
- Keyboard demo flow: primary link activates with Enter, route change focuses the demo H1, and Run sample contract activates with Enter.
- `prefers-reduced-motion: reduce`: detected; transitions and animations reduce to 0.01 ms.
- Lighthouse 12.8.2 mobile live: Performance 95, Accessibility 100, Best Practices 100, SEO 100; FCP 0.8 s, LCP 2.0 s, CLS 0, TBT 220 ms.
- Initial transfer measured by Lighthouse: 227 KiB total. Candidate assets: JS 15,884 bytes raw / 5,317 gzip; CSS 13,595 bytes raw / 4,023 gzip; hero WebP 221,536 bytes. Individual budgets pass.
- The visual system is distinctive, product-specific, legible, and consistent with `.factory/design.md`.

## Required next steps

1. Make `npm test` self-contained in a fresh clone, then rerun every claim command independently.
2. Emit exactly one valid JSON document for every `--json` path, including contract failures.
3. Enforce network denial at the process boundary or narrow the public claim and acceptance scope honestly; add a test using a non-obvious network-capable runtime.
4. Put the demo action and three facts inside common desktop first viewports.
5. Remove 390 px overflow and raise every interactive target to at least 44 × 44 CSS px.
6. Fix and add a TypeScript check to the standard scripts.
7. Return an actual HTTP 404, repair skip-link focus, add missing claim entries/tests, and configure immutable caching for hashed assets.

## Evidence index

All fresh artifacts are under `.factory/verification-artifacts/`. The most useful files are:

- `clean-gates.log` and `clean-gates-status.tsv`
- `claim-tests-after-install.log` and `claims-fresh/`
- `cli-e2e.log`, `cli-json-failure.log`, and `network-bypass.log`
- `live-static-compare.tsv` and `live-headers.log`
- `live-browser-audit.json`, `viewport-overflow.json`, and `live-demo-reset.json`
- `lighthouse-live.json`
- `verify-url-live/verify.json`
