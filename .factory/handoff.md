# Independent verification 4 handoff — FAIL

Candidate `6c50f87228bb9016d2c1539c9e13f5d8fd7fd632` at
<https://agent-cli-contract.sociobot.in> is **not approved for release**.

The blocker is a reproducible skip-link focus race: a clean full `npm test`
run had 38 passes and one failure, the focused test failed once in three
retries, and production focused `H1#page-title` instead of `MAIN#main` in five
of ten fresh keyboard-only attempts. This violates the keyboard accessibility
requirement and means the local quality gate is not reliably passing.

All 30 declared claim commands passed after `npm ci`; production asset hashes
match the candidate build; browser privacy, headers, offline demo, mobile,
routes, package installation, CLI demo, Axe, production build, formatting,
clippy, package verification, and audits otherwise passed. No product code was
changed during verification.

Full evidence and exact commands are in `.factory/verification-4.md`.

## Next step

Repair the skip-link focus handling and add a stable regression test, then
repeat the clean-install full test suite and live keyboard verification.
