# Polish round 4 — PASS

Repaired release candidate `b038128e5532afe33fffb2d94b998081c9342b7b` from review commit `bf96fc8424929f4eb873b9dd76f180a338e7dbcf`. Implementation commit: `527fc745b70dc89468239ade7da9e4370a03ff0b`. Production URL: <https://agent-cli-contract.sociobot.in>.

I read `review-1.md` through `review-4.md` and `polish-1.md` through `polish-3.md`. Earlier functional repairs remain in the current product. Round 4 removes the final eleven decorative labels without changing the cartographic visual system.

| Finding | Change made or confirmed | Evidence: test, screenshot, live check |
| --- | --- | --- |
| F-1-1 | The browser action stays an honest replay of the self-hosted recording generated from the real CLI demo. | `@claim:recorded-demo`; `evidence/polish-4-live-demo-mobile.png`; <https://agent-cli-contract.sociobot.in/?demo=1>. |
| F-1-2 | History saves scroll coordinates and focuses the restored route heading without moving the page. | `Back restores landing scroll while focusing its heading`; `evidence/polish-4-live-home-desktop.png`; <https://agent-cli-contract.sociobot.in/>. |
| F-1-3 | The 390 px demo banner remains sticky and retains both touch-size controls. | `390px routes do not create horizontal overflow and utility targets are touch sized`; `evidence/polish-4-live-demo-mobile.png`; live audit confirms the banner remains in viewport. |
| F-1-4 | The executable plus fixed arguments are consistently named **command**. | `plain product language names the landing, demo, and missing-page states`; `evidence/polish-4-live-home-desktop.png`; <https://agent-cli-contract.sociobot.in/>. |
| F-1-5 | The audience and safety copy uses plain terms for human-readable output and declared commands. | `plain product language names the landing, demo, and missing-page states`; `evidence/polish-4-live-home-desktop.png`; <https://agent-cli-contract.sociobot.in/>. |
| F-1-6 | Leaving the demo clears only `demo:` data and opens the install section. | `@claim:demo-sandbox`; `evidence/polish-4-live-demo-state.json`; live `/?demo=1` reset and exit both passed. |
| F-1-7 | The local-execution promise remains listed and proves local snapshots and reports with fixture networking denied. | `@claim:local-execution`; `evidence/polish-4-clean-claim-results.tsv`; <https://agent-cli-contract.sociobot.in/>. |
| F-1-8 | The documented default 10-second timeout remains measured as a claim. | `@claim:default-timeout`; `evidence/polish-4-clean-claim-results.tsv`; live install page checked at <https://agent-cli-contract.sociobot.in/#install>. |
| F-1-9 | The untestable future-compatibility statement remains absent. | `plain product language names the landing, demo, and missing-page states`; `copy-audit.md`; cold live home check. |
| F-1-10 | Safety language remains limited to literal declared-command behavior. | `@claim:declared-commands` and `@claim:direct-execution`; clean claim evidence; <https://agent-cli-contract.sociobot.in/privacy>. |
| F-1-11 | Network opt-in still tests denied curl, denied runtime fetch, and an explicitly allowed local request. | `@claim:network-opt-in`; clean claim evidence; live home fact checked. |
| F-2-1 | The 390 px demo places a real result before the fixture sheet. | `mobile demo shows a sample result in the initial viewport and links resolve`; `evidence/polish-4-live-demo-mobile.png`; <https://agent-cli-contract.sociobot.in/?demo=1>. |
| F-2-2 | Internal factory-release wording remains absent from README. | Full clean-clone `npm test`; `copy-audit.md`; live install section checked. |
| F-2-3 | The JSON-path allowlist remains a listed and exercised claim. | `@claim:nondeterministic-field-allowlist`; clean claim evidence; README route verified from the live home. |
| F-2-4 | The schema command remains a listed claim that checks every documented v1 field. | `@claim:schema-output`; clean claim evidence; live link/metadata audit passed. |
| F-2-5 | Version 1 acceptance and unsupported-version guidance remain listed and tested. | `@claim:contract-format-version`; clean claim evidence; live install section checked. |
| F-3-1 | The mobile report reflows every result cell instead of relying on a keyboard-inaccessible horizontal scroller. | `390px demo exposes every result column without a scroll region or Axe violations`; `evidence/polish-4-live-demo-mobile.png`; live audit records `scrollWidth <= clientWidth` and zero mobile serious/critical Axe findings. |
| F-3-2 | The starter-contract action remains listed and proves that `init` creates a runnable v1 contract. | `@claim:starter-contract`; clean claim evidence; <https://agent-cli-contract.sociobot.in/#install>. |
| F-3-3 | Copy-install remains keyboard-operable and announces both success and recovery guidance. | `@claim:copy-install-command`; `evidence/polish-4-live-home-desktop.png`; live home verifier passed. |
| F-3-4 | The Rust 1.85 claim still compiles the locked package with Rust 1.85.0. | `@claim:rust-version`; clean claim evidence (32 seconds); live install note checked. |
| F-4-1 | Replaced “Contract survey / v0.1.0” with **“Version 0.1.0.”** | `plain product language names the landing, demo, and missing-page states`; `evidence/polish-4-live-home-desktop.png`; live audit `F-4-1`. |
| F-4-2 | Removed the unexplained coordinate text and retained only the visual rail. | Same regression test; `evidence/polish-4-live-home-desktop.png`; live audit `F-4-2`. |
| F-4-3 | Replaced “Four contract checkpoints” with **“Four sample checks.”** | Same regression test; home screenshot; live audit `F-4-3`. |
| F-4-4 | Replaced “FIELD LOG / 01” with **“Sample report.”** | Same regression test; home screenshot; live audit `F-4-4`. |
| F-4-5 | Replaced the preview slogan with **“Review a sample contract report.”** | Same regression test; home screenshot; live audit `F-4-5`. |
| F-4-6 | Replaced “ROUTE / 02” with **“How it works.”** | Same regression test; home screenshot; live audit `F-4-6`. |
| F-4-7 | Replaced “Survey a command” with **“Test a CLI contract in three steps.”** | Same regression test; home screenshot; live audit `F-4-7`. |
| F-4-8 | Replaced “BOUNDARY / 03” and “START / 04” with **“Safety and privacy”** and **“Install.”** | Same regression test; home screenshot; live audit `F-4-8`. |
| F-4-9 | Replaced “Isolated field test” with **“Sample data.”** | Same regression test; `evidence/polish-4-live-demo-mobile.png`; live audit `F-4-9` at `/?demo=1`. |
| F-4-10 | Rewrote the 404 as **“404 / Page not found / Return home.”** | Same regression test; `evidence/polish-4-live-404.png`; <https://agent-cli-contract.sociobot.in/missing-route> returns HTTP 404. |
| F-4-11 | Replaced terminal “contract survey · local” with **“local sample.”** | Same regression test; home screenshot; live audit `F-4-11`. |

## Verification

- Fresh clone: `/tmp/agent-cli-contract-polish4-pSRbxZ/repo` at `527fc745b70dc89468239ade7da9e4370a03ff0b`.
- Every one of the 30 commands in `claims.json` passed separately in 334 seconds: `evidence/polish-4-clean-claim-results.tsv`.
- Full clean-clone `npm test` passed: 3 Rust unit tests and 39 Playwright unit, integration, browser, accessibility, privacy, mobile, and offline tests. `npm run build`, `cargo fmt --all -- --check`, strict Clippy, verified `cargo package`, and both audits passed: `evidence/polish-4-clean-quality.txt`.
- Production was deployed with `swa deploy dist/site --env production` using the factory Static Web Apps configuration. The live asset is `main-osEVYU_0.js`.
- The factory URL verifier passed cold on `/` and `?demo=1`: `evidence/polish-4-live-home-verify/verify.json` and `evidence/polish-4-live-demo-verify/verify.json`.
- Live route, metadata, one-click demo, isolation/reset/exit, same-origin privacy, mobile Axe, real 404, and offline checks passed: `evidence/polish-4-live-audit.json` and `evidence/polish-4-live-demo-state.json`.
- Live Lighthouse mobile: Performance 98, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 2.0 s, CLS 0, TBT 110 ms: `evidence/lighthouse-polish-4-live.json`.

No finding from reviews 1–4 remains unresolved.
