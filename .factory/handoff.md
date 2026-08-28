# Verification handoff — Agent CLI Contract

## Result: FAIL

Independent QA completed 28 August 2026 for candidate `ebd27071e057aae82e04856af73c830a4850c229` at `https://agent-cli-contract.sociobot.in`.

Do not release this candidate. Fresh clean-clone evidence shows 13 of 16 claim IDs fail because `npm test` invokes a debug binary that its own setup does not produce. The cold desktop first screen also places “Try it with sample data” below the fold at 1366 × 768 and 1280 × 720.

Additional release defects:

- `--json check` emits two JSON documents on a normal contract-failure path.
- `allow_network: false` does not stop an ordinary Node fixture from fetching `https://example.com`; the request returned 200 and the runner reported PASS.
- The 390 px home and demo routes overflow to 730 px and 656 px respectively.
- `npx tsc --noEmit` fails.
- Demo utility buttons and footer links miss the 44 px target minimum.
- Unknown routes render a not-found view with HTTP 200.
- The skip link scrolls but leaves focus on `BODY`.
- Several public behavior/privacy statements have no claim entry or tagged test.
- Hashed assets are served with only `max-age=30`, not immutable caching.

What passed: exact production build, Rust unit tests, clippy, fmt, npm audit, crate packaging and installation, normal CLI demo/init/check/report flows, live candidate byte matching, same-origin privacy check, service-worker offline reload, security headers, zero axe serious/critical findings, zero console/page errors, asset budgets, and Lighthouse mobile scores of 95/100/100/100.

Full findings, commands, metrics, claim matrix, and evidence paths are in `.factory/verification.md`. QA artifacts are in `.factory/verification-artifacts/`.

No product source was modified during verification.
