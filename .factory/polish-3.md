# Polish round 3 — PASS

Repaired release candidate `89ea1cff50c9b05bcd78a5e3729708e47a222dee` from review base `71d7777bee6a6a1653f1427b309e2e89794a5172`. Implementation commit: `acca53b1925b88853c334d1baf690df683ea17fb`. Production URL: <https://agent-cli-contract.sociobot.in>.

Every finding from reviews 1–3 was checked in the current source and again on the deployed site. No severity was deferred.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | The browser action remains an honest replay of the self-hosted recording generated from the real bundled CLI demo. The runnable command and transcript are adjacent. | `@claim:recorded-demo matches a fresh bundled CLI demo report`; [live demo screenshot](evidence/polish-3-live-mobile-demo.png); cold live `/?demo=1` check in `evidence/polish-3-live-audit.json`. |
| F-1-2 | History entries retain scroll coordinates; Back restores within two pixels and focuses the landing h1 without moving it. | `Back restores landing scroll while focusing its heading`; live audit restored 1198 → 1199 with `#page-title` focused; [live home screenshot](evidence/polish-3-live-home-desktop.png). |
| F-1-3 | The demo banner remains sticky at 390 px with both actions visible and at least 44 px high. | `390px routes do not create horizontal overflow and utility targets are touch sized`; [scrolled live demo](evidence/polish-3-live-mobile-sticky.png); live banner y=0 in `polish-3-live-audit.json`. |
| F-1-4 | Product copy consistently calls the executable and fixed arguments a **command**. | `desktop first screen keeps the primary action and all facts above a 768px fold`; `.factory/copy-audit.md`; [live home screenshot](evidence/polish-3-live-home-desktop.png). |
| F-1-5 | The audience sentence names human-readable output; the privacy heading says “Run only commands you declare.” | `routes have one focused-capable h1 and no serious accessibility issues`; `.factory/copy-audit.md`; cold live `/` check and [home screenshot](evidence/polish-3-live-home-mobile.png). |
| F-1-6 | The exit action says “Leave demo and view install steps,” clears only `demo:` keys, and opens `/#install`. | `@claim:demo-sandbox keeps demo state separate and reset removes it`; live audit recorded no demo keys and preserved `real:sentinel`; [live demo screenshot](evidence/polish-3-live-mobile-demo.png). |
| F-1-7 | `local-execution` remains listed and proves local snapshots and reports while fixture networking is denied. | `@claim:local-execution writes local outputs with fixture networking denied`; all 30 clean-clone claim commands passed; live “Runs locally” fact in [home screenshot](evidence/polish-3-live-home-desktop.png). |
| F-1-8 | `default-timeout` remains listed and measures the implicit 10,000 ms limit. | `@claim:default-timeout applies the documented 10 second limit`; clean-clone claim passed in 19.3 s; live install/docs path checked from `/`. |
| F-1-9 | The untestable forward-compatibility promise remains absent. Project status describes only released behavior. | Clean-clone `npm test` passed; `.factory/copy-audit.md` has no future compatibility promise; cold live `/` and [home screenshot](evidence/polish-3-live-home-desktop.png). |
| F-1-10 | Safety copy remains limited to the literal executable and arguments declared in the contract. | `@claim:declared-commands` and `@claim:direct-execution`; both clean-clone commands passed; cold live privacy section checked at `/`. |
| F-1-11 | The network test covers blocked curl, a blocked Node fetch, and an opted-in request to a local server. | `@claim:network-opt-in blocks direct and runtime network access by default`; clean-clone command passed; cold live network fact checked at `/`. |
| F-2-1 | The mobile report stays before the fixture sheet; its heading and first complete result remain in the initial 844 px viewport. | `mobile demo shows a sample result in the initial viewport and links resolve`; live bottoms 676.7 px and 833.0 px; [live demo screenshot](evidence/polish-3-live-mobile-demo.png). |
| F-2-2 | The unexplained internal factory release sentence remains removed from README. | Clean-clone `npm test`; `.factory/copy-audit.md`; cold live install section in [live install screenshot](evidence/polish-3-live-install.png). |
| F-2-3 | The JSON-path allowlist remains a declared, tested claim. | `@claim:nondeterministic-field-allowlist accepts an explicitly allowlisted changing JSON field`; clean-clone claim passed; cold live install/docs route check at `/`. |
| F-2-4 | The schema command remains a declared claim that checks all documented root and fixture fields. | `@claim:schema-output prints the complete version 1 schema for documented contract fields`; clean-clone claim passed; live site link crawl passed. |
| F-2-5 | Contract version 1 acceptance and unsupported-version guidance remain tested. | `@claim:contract-format-version accepts version 1 and rejects another contract version`; clean-clone claim passed; [live install screenshot](evidence/polish-3-live-install.png). |
| F-3-1 | Removed the 540 px mobile row minimum and horizontal scroll region. All four columns now reflow inside the 316 px report width. Added a 390 px cell-bounds assertion and Axe scan. | `390px demo exposes every result column without a scroll region or Axe violations`; live `clientWidth=316`, `scrollWidth=316`, every cell in bounds, zero serious/critical Axe findings; [live demo screenshot](evidence/polish-3-live-mobile-demo.png). |
| F-3-2 | Added `starter-contract`. It runs `init` in a fresh directory, parses the generated YAML, checks version and literal command, then accepts and runs the generated suite. | `@claim:starter-contract creates a runnable version 1 contract`; clean-clone claim passed; generated commands are visible in [live install screenshot](evidence/polish-3-live-install.png). |
| F-3-3 | Added `copy-install-command`, keyboard activation, command equality, a polite success announcement, and actionable denied-access feedback. Demo copying now also uses the correct label. | `@claim:copy-install-command copies by keyboard and announces success or failure`; clean-clone claim passed; live clipboard text matched and [live install screenshot](evidence/polish-3-live-install.png) shows “Copied install command.” |
| F-3-4 | The test bootstrap provisions Rust 1.85.0 when absent. The claim compiles the locked package in a clean target with `cargo +1.85.0 build --locked` and runs that binary. | `@claim:rust-version builds with the declared minimum Rust version`; clean-clone claim passed after a real 1.85.0 compile in 32.1 s; Rust requirement is visible in [live install screenshot](evidence/polish-3-live-install.png). |

## Clean-clone verification

Clean clone: `/tmp/agent-cli-contract-polish3-w2B2eX/repo` at `acca53b1925b88853c334d1baf690df683ea17fb`.

- All 30 commands from `.factory/claims.json` passed independently; sweep time: 336.3 s.
- `npm test`: 3 Rust unit tests and 38 Playwright unit/integration/browser/accessibility/privacy/offline tests passed.
- `npm run build`: passed; `dist/site` plus the release CLI were produced.
- `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, and verified `cargo package`: passed.
- `npm audit` and `npm audit --omit=dev`: zero vulnerabilities.
- Built site: 18.95 kB JS raw / 5.99 kB gzip; 15.19 kB CSS raw / 4.32 kB gzip; hero art remains below 300 kB.

## Deployment and cold live verification

- Azure Static Web Apps deployment: `82b731d8-0ed9-464f-a4a7-d606e8c55412`.
- Both factory URL verifier runs passed with zero console errors: `evidence/polish-3-live-home-verify/verify.json` and `evidence/polish-3-live-demo-verify/verify.json`.
- `evidence/polish-3-live-audit.json` records `passed: true` for the one-click `?demo=1` path, isolated reset/exit, same-origin requests, mobile Axe, metadata, 200 legal routes, real 404, focus, Back restoration, link crawl, reduced motion, clipboard, and offline reload.
- Live Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 0.8 s, LCP 2.0 s, CLS 0, TBT 30 ms. Raw report: `evidence/lighthouse-polish-3-live.json`.
- Security headers include CSP with response-header-only `frame-ancestors`, HSTS, nosniff, referrer policy, and permissions policy. `/missing-route` returns HTTP 404.

No finding remains unresolved.
