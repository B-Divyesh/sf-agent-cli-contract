# Review 2 handoff — FAIL

Reviewer-only work order `agent-cli-contract-review-2` is complete. No product code was changed.

## Delivered

- Added `.factory/review-2.md`, a fresh cold-read, demo, claims, sandbox, history, structure, accessibility, and missed-leverage review.
- Reviewed the deployed site at desktop and 390 × 844, plus the current checkout at `3ec47269c9a627ade759d7646685acbdf065e033`.

## Verification

- All 25 listed claim commands passed independently from fresh clone `/tmp/agent-cli-contract-review2-aA5xLm/repo`.
- The same clone passed `npm test` (3 Rust and 32 Playwright tests), `npm run build`, `cargo fmt --check`, and `cargo clippy --all-targets -- -D warnings`.
- Browser checks confirmed demo storage isolation/reset, same-origin requests, offline reload after first visit, direct CLI demo isolation, route metadata, real 404, links, history focus/scroll restoration, and no serious/critical axe findings.

## Known gaps and next steps

The review verdict is **FAIL**. Resolve F-2-1 by making the actual sample report visible in the first 390 × 844 demo viewport. Resolve F-2-2 through F-2-5 by removing the internal release sentence and adding or removing the three unlisted README claims. Rerun the full fresh-clone claim sweep after repair.
