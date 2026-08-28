# Review handoff — FAIL

## What was done

Performed adversarial first-read review 1 without modifying product code. The complete report is in `.factory/review-1.md`.

## Verification performed

- Opened the deployed site in fresh 390 × 844 and 1366 × 768 contexts before scrolling.
- Ran every one of the 22 `.factory/claims.json` commands separately from a fresh clone at `/tmp/agent-cli-contract-review-qkVAH8/repo`; all passed.
- Ran `npm test` (27 passing tests), `npm run build`, `cargo fmt --check`, and `cargo clippy -- -D warnings` from that clone.
- Exercised browser demo storage/reset/exit and same-origin network behavior; ran `agent-contract --json demo` in a temporary sentinel project.
- Checked routes, HTTP 404 behavior, titles, metadata, links, cache/security headers, focus, 390 px dimensions, target sizes, and the earlier verification findings.

## Decision and gaps

**FAIL.** Do not treat the prior PASS handoff as current acceptance.

Release blockers:

- The live browser control labelled “Run sample contract” is a timer-driven hard-coded report, not a real or honestly replayed CLI run.
- Back/Forward loses the previous landing-page scroll position.

Further medium/low gaps: the mobile demo banner is not persistent; landing vocabulary mixes `route` and `command`; several phrases/actions need plain-language rewrites; and the review identifies unlisted or only partially tested claims.

## Next steps

Implement every fix in `.factory/review-1.md`, add the specified tests, then repeat the entire cold-read, clean-clone claim, demo isolation, and structure checklist.
