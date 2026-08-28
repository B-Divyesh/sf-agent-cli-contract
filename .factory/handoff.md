# Handoff — Agent CLI Contract v0.1.0

Completed 28 August 2026 for work order `agent-cli-contract-build-1`.

## What shipped

- A Rust single binary named `agent-contract`.
- Version 1 YAML contracts with direct argument execution and inline fixture files.
- Fresh temporary directories for normal, repeat, and recovery runs.
- Text, real pseudo-TTY, and JSON snapshots.
- Exit, substring, structured error-code, recovery, idempotency, timeout, and nondeterminism checks.
- Exact JSON paths for nondeterministic structured fields.
- Secret-shaped environment removal plus declared-value redaction.
- Per-fixture network opt-in, URL and network-tool rejection, and closed proxy defaults.
- Markdown and JSON reports with script-readable CLI output.
- `init`, `check`, `schema`, `demo`, `--json`, useful help, and stable exit codes.
- Bundled sample data in `examples/` and a CLI demo that leaves reports in a temporary directory.
- A Vite documentation site at `/`, `/demo`, `/privacy`, `/terms`, and a styled 404 route.
- A one-click browser demo with reset, start-for-real, loading, passing, and blocked-change states.
- An original topographic visual system, optimized hero art, social card, favicon, and touch icon.
- CSP, security headers, service-worker caching, metadata, robots, sitemap, keyboard focus, reduced motion, and 390 px layouts.

## Build and release

```sh
npm install
npm run build:site   # exact deploy build -> dist/site
npm run build        # site plus release CLI
cargo package        # ready-to-publish crate
```

`cargo package --allow-dirty` packaged and verified 47 files. The compressed crate was 71.5 KiB. Publishing was not attempted because the factory owns registry credentials.

## Verification

- `npm test`: passed, 3 Rust unit tests and 18 Playwright tests.
- Claim tests: all 15 tagged tests covering 16 claim IDs in `.factory/claims.json` passed from fresh temporary or browser sandboxes.
- `cargo clippy --all-targets -- -D warnings`: passed.
- `npm audit --audit-level=high`: passed with zero known vulnerabilities.
- `npm run build`: passed and produced `dist/site/index.html` plus `target/release/agent-contract`.
- `/opt/fleet/lib/verify-url.sh`: passed with one H1, `lang=en`, a main landmark, no missing alt text, and zero console errors.
- Axe checks: zero serious or critical findings across home, demo, privacy, terms, and 404 routes.
- Mobile browser check: passed at 390 × 844 with keyboard activation of the primary demo action.
- Link crawl: home, demo, privacy, terms, robots, sitemap, and favicon returned success.

Lighthouse 12.8.2 mobile results from the production build:

| Category | Score |
| --- | ---: |
| Performance | 99 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

Measured FCP was 0.9 s, LCP was 2.1 s, CLS was 0, and total blocking time was 60 ms. The initial JavaScript is 15.9 KiB raw, CSS is 13.6 KiB raw, and the hero WebP is 221.5 KiB. Evidence is in `.factory/evidence/`.

## Demo

- Browser: `/demo`.
- CLI: `agent-contract demo`.
- Browser state uses only the `demo:` localStorage namespace and clears on reset or start-for-real.
- The CLI demo creates `agent-contract-demo-<pid>-<time>` under the operating-system temporary directory.
- Full reset and verification details are in `.factory/demo.md`.

## Visual asset provenance

The required image was generated with `/opt/fleet/lib/gen-image.sh` and the factory image deployment. The exact prompt is in `.factory/design.md`; generation metadata and the original PNG are in `.factory/assets/`. The shipped hero is `site/public/topographic-run.webp` at 221.5 KiB. The 1200 × 630 social card is derived from that art.

## Known gaps and next steps

- Registry publishing and downloadable release binaries remain factory release steps.
- The cross-platform network guard rejects network-shaped commands and sets closed proxies. A target that opens raw sockets can bypass those process-level controls. Use an operating-system sandbox for hostile binaries.
- The website demo is a recorded run because a native Rust binary cannot execute directly in the static browser build. The CLI demo runs the real binary and the same bundled contract.
