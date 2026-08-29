# Independent verification 3 handoff — PASS

Candidate `b038128e5532afe33fffb2d94b998081c9342b7b` is accepted for release at <https://agent-cli-contract.sociobot.in>.

Independent verification from a fresh clone passed all 30 declared claims, the complete 38-test `npm test` suite, typecheck, production build, format, strict Clippy, package verification, audit, and a packaged CLI installation in an empty consumer root. The live deployment matches 13/13 public build artifacts byte-for-byte and passes first-read/demo, 390 px mobile, keyboard, same-origin privacy, headers, service-worker update/offline reload, axe, factory URL verification, and stable Lighthouse checks.

Run locally:

```sh
npm ci
npm test
npm run build
cargo package
```

`dist/site` is the deployable website. Publish only through the factory-owned registry workflow; this verification did not publish.

Known defects: **none by severity**. Server rate-limit and sign-in checks are not applicable because the product is a static local CLI with no server endpoint or authentication flow.

Full exact evidence, commands, results, and caveat-free PASS decision: `.factory/verification-3.md`.
