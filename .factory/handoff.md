# Review 3 handoff

Adversarial review 3 is recorded in `.factory/review-3.md` against live deployment `https://agent-cli-contract.sociobot.in` and commit `89ea1cff50c9b05bcd78a5e3729708e47a222dee`.

## Result

**FAIL** with four findings:

- F-3-1 blocking: the 390 px demo result table is horizontally scrollable but cannot receive keyboard focus; Playwright Axe reports serious `scrollable-region-focusable`.
- F-3-2 low: the advertised `agent-contract init` starter flow has no claims entry or automated test.
- F-3-3 low: “Copy install command” has no claims entry or automated clipboard test.
- F-3-4 low: the Rust 1.85 claim test checks manifest text and an ambient-toolchain binary, rather than building with Rust 1.85.

No product code was modified.

## Verification performed

- Cold live reads at 390 × 844 and 1366 × 768.
- Live one-click demo, realistic initial state, sticky banner, blocked-change interaction, reset, namespace isolation, same-origin request log, offline reload, and CLI demo from an empty temporary directory.
- Direct-route metadata, real 404, link crawl, skip link, h1 focus, Back scroll restoration, security headers, console errors, mobile overflow, and desktop/mobile Playwright Axe checks.
- All 28 `.factory/claims.json` commands independently from clean clone `/tmp/agent-cli-contract-review3-4ExBsQ/repo`; all passed.
- Clean-clone `npm test`, `npm run build`, `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, `cargo package --allow-dirty`, and `npm audit --omit=dev`; all passed.
- Independent `cargo +1.85.0 build --locked`; passed, confirming the compatibility claim today while exposing the claim test’s regression gap.
- `/opt/fleet/lib/verify-url.sh`; passed. Accessibility verification used the repository’s pinned Playwright/Axe integration because the standalone Axe CLI driver did not match the preinstalled Chromium.

## Next steps

Repair F-3-1 first, then add the three missing or stronger claim tests. Rerun the complete review checklist from scratch; do not treat the green existing suite as sufficient because it does not exercise Axe at 390 px or the two unlisted onboarding actions.
