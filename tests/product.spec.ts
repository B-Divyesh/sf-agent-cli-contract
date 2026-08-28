import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { execFile } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdtemp, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const binary = resolve('target/debug/agent-contract');
const probe = resolve('tests/fixtures/probe.mjs');

async function contractDir(source: string) {
  const directory = await mkdtemp(join(tmpdir(), 'agent-contract-test-'));
  const path = join(directory, 'agent-contract.yml');
  await writeFile(path, source);
  return { directory, path };
}

async function run(args: string[]) {
  try {
    const result = await exec(binary, args, { timeout: 20_000 });
    return { ...result, code: 0 };
  } catch (error) {
    const failed = error as { stdout: string; stderr: string; code: number };
    return { stdout: failed.stdout, stderr: failed.stderr, code: failed.code };
  }
}

test('@claim:isolated-fixtures @claim:inline-files runs fixtures outside the project', async () => {
  const { directory, path } = await contractDir(`version: 1
command: [${JSON.stringify(process.execPath)}, ${JSON.stringify(probe)}]
fixtures:
  - name: writes only in fixture
    args: [text]
    files:
      input.txt: ridge-7
    expect:
      exit: 0
      stdout_contains: ["cwd="]
    detect_nondeterminism: true
    idempotent: true
`);
  const result = await run(['check', path, '--accept']);
  expect(result.code).toBe(0);
  await expect(stat(join(directory, 'fixture-created.txt'))).rejects.toThrow();
  expect(await readFile(join(directory, 'snapshots/writes-only-in-fixture.text.stdout'), 'utf8')).toContain('cwd=<WORKDIR>');
  expect(await readFile(join(directory, 'snapshots/writes-only-in-fixture.text.stdout'), 'utf8')).toContain('input=ridge-7');
});

test('@claim:fixture-timeout stops a command that exceeds its limit', async () => {
  const { path } = await contractDir(`version: 1
command: [${JSON.stringify(process.execPath)}, "-e", "setTimeout(() => {}, 5000)"]
fixtures:
  - name: bounded command
    timeout_ms: 40
    expect:
      exit: 0
`);
  const result = await run(['--json', 'check', path, '--accept']);
  expect(result.code).toBe(1);
  expect(result.stdout).toContain('command timed out after 40 ms');
});

test('@claim:default-timeout applies the documented 10 second limit', async () => {
  const { path } = await contractDir(`version: 1
command: [${JSON.stringify(process.execPath)}, "-e", "setTimeout(() => {}, 20000)"]
fixtures:
  - name: uses default timeout
    expect:
      exit: 0
`);
  const started = Date.now();
  const result = await run(['--json', 'check', path, '--accept']);
  const elapsed = Date.now() - started;
  expect(result.code).toBe(1);
  expect(result.stdout).toContain('command timed out after 10000 ms');
  expect(elapsed).toBeGreaterThanOrEqual(9_500);
  expect(elapsed).toBeLessThan(13_000);
});

test('@claim:snapshot-regression reports changed command output', async () => {
  const fixture = (argument: string) => `version: 1
command: [${JSON.stringify(process.execPath)}, ${JSON.stringify(probe)}]
fixtures:
  - name: stable interface
    args: [${argument}]
    expect:
      exit: 0
`;
  const { path } = await contractDir(fixture('text'));
  expect((await run(['check', path, '--accept'])).code).toBe(0);
  await writeFile(path, fixture('json'));
  const changed = await run(['--json', 'check', path]);
  expect(changed.code).toBe(1);
  const report = JSON.parse(changed.stdout);
  expect(report.passed).toBe(false);
  expect(report.checks[0].findings).toContain('stdout snapshot changed; run with --accept after review');
});

test('@claim:nondeterminism names a changing JSON field', async () => {
  const { path } = await contractDir(`version: 1
command: [${JSON.stringify(process.execPath)}, ${JSON.stringify(probe)}]
modes:
  json: [unstable]
fixtures:
  - name: changing run id
    modes: [json]
    detect_nondeterminism: true
    expect:
      exit: 0
`);
  const result = await run(['--json', 'check', path, '--accept']);
  expect(result.code).toBe(1);
  expect(result.stdout).toContain('nondeterministic JSON fields: $.meta.run_id');
});

test('@claim:idempotency reports a changed repeat run', async () => {
  const { path } = await contractDir(`version: 1
command: [${JSON.stringify(process.execPath)}, ${JSON.stringify(probe)}]
fixtures:
  - name: mutating command
    args: [mutate]
    idempotent: true
    expect:
      exit: 0
`);
  const result = await run(['--json', 'check', path, '--accept']);
  expect(result.code).toBe(1);
  expect(result.stdout).toContain('idempotency check changed output or exit');
});

test('@claim:mode-capture records real TTY and valid JSON modes', async () => {
  const { directory, path } = await contractDir(`version: 1
command: [${JSON.stringify(process.execPath)}, ${JSON.stringify(probe)}]
modes:
  tty: [tty]
  json: [json]
fixtures:
  - name: captures modes
    modes: [tty, json]
    expect:
      exit: 0
`);
  const result = await run(['check', path, '--accept']);
  expect(result.code).toBe(0);
  expect(await readFile(join(directory, 'snapshots/captures-modes.tty.stdout'), 'utf8')).toContain('isTTY=true');
  const json = JSON.parse(await readFile(join(directory, 'snapshots/captures-modes.json.stdout'), 'utf8'));
  expect(json.ok).toBe(true);
});

test('@claim:error-recovery validates a stable JSON error and recovery', async () => {
  const result = await run(['--json', 'demo']);
  expect(result.code).toBe(0);
  const summary = JSON.parse(result.stdout.trim());
  expect(summary.ok).toBe(true);
  const report = JSON.parse(await readFile(join(summary.demo, '.agent-contract/report.json'), 'utf8'));
  const recovery = report.checks.find((check: { fixture: string }) => check.fixture.includes('recoverable'));
  expect(recovery).toMatchObject({ passed: true, exit: 4, mode: 'json' });
});

test('@claim:report-formats writes equivalent Markdown and JSON reports', async () => {
  const result = await run(['--json', 'demo']);
  const summary = JSON.parse(result.stdout.trim());
  const markdown = await readFile(join(summary.demo, '.agent-contract/report.md'), 'utf8');
  const json = JSON.parse(await readFile(join(summary.demo, '.agent-contract/report.json'), 'utf8'));
  expect(markdown).toContain('**Result:** PASS');
  expect(markdown).toContain('invalid input stays recoverable');
  expect(json.summary).toMatchObject({ passed: 4, failed: 0 });
});

test('@claim:secret-redaction removes declared secrets from snapshots and reports', async () => {
  const secret = 'sample-secret-741';
  const { directory, path } = await contractDir(`version: 1
command: [${JSON.stringify(process.execPath)}, ${JSON.stringify(probe)}]
env:
  DEMO_TOKEN: ${secret}
redact_env: [DEMO_TOKEN]
fixtures:
  - name: hides token
    args: [text]
    expect:
      exit: 0
`);
  const result = await run(['check', path, '--accept']);
  expect(result.code).toBe(0);
  const snapshotFiles = await readdir(join(directory, 'snapshots'));
  const snapshots = await Promise.all(snapshotFiles.map((name) => readFile(join(directory, 'snapshots', name), 'utf8')));
  const report = await readFile(join(directory, '.agent-contract/report.json'), 'utf8');
  expect(`${snapshots.join('\n')}\n${report}`).not.toContain(secret);
  expect(snapshots.join('\n')).toContain('[REDACTED]');
});

test('@claim:network-opt-in blocks direct and runtime network access by default', async () => {
  const { path } = await contractDir(`version: 1
command: [curl]
fixtures:
  - name: network is not declared
    args: [https://example.com]
    expect:
      exit: 0
`);
  const result = await run(['--json', 'check', path, '--accept']);
  expect(result.code).toBe(1);
  expect(result.stdout).toContain('network-shaped command was blocked');

  const bypass = await contractDir(`version: 1
command: [${JSON.stringify(process.execPath)}, "-e", "fetch('https://example.com').then((response) => console.log('status=' + response.status))"]
fixtures:
  - name: undeclared runtime network
    expect:
      exit: 0
`);
  const blocked = await run(['--json', 'check', bypass.path, '--accept']);
  expect(blocked.code).toBe(1);
  const report = JSON.parse(blocked.stdout);
  expect(report.passed).toBe(false);
  expect(JSON.stringify(report)).not.toContain('status=200');
  expect(report.checks[0].findings).toContain('exit was 1; expected 0');

  const server = createServer((_request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('local-opt-in-ok');
  });
  await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
  try {
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('local test server has no port');
    const allowed = await contractDir(`version: 1
command: [${JSON.stringify(process.execPath)}, "-e", "fetch(process.argv[1]).then((response) => response.text()).then(console.log)"]
fixtures:
  - name: declared local network
    args: ["http://127.0.0.1:${address.port}/fixture"]
    allow_network: true
    expect:
      exit: 0
      stdout_contains: [local-opt-in-ok]
`);
    const permitted = await run(['check', allowed.path, '--accept']);
    expect(permitted.code).toBe(0);
    expect(await readFile(join(allowed.directory, 'snapshots/declared-local-network.text.stdout'), 'utf8')).toContain('local-opt-in-ok');
  } finally {
    await new Promise<void>((done, reject) => server.close((error) => error ? reject(error) : done()));
  }
});

test('@claim:local-execution writes local outputs with fixture networking denied', async () => {
  const { directory, path } = await contractDir(`version: 1
command: [${JSON.stringify(process.execPath)}, "-e", "console.log('network=' + process.env.AGENT_CONTRACT_NETWORK)"]
fixtures:
  - name: local report
    expect:
      exit: 0
      stdout_contains: [network=disabled]
`);
  expect((await run(['check', path, '--accept'])).code).toBe(0);
  expect(await readFile(join(directory, 'snapshots/local-report.text.stdout'), 'utf8')).toContain('network=disabled');
  expect(JSON.parse(await readFile(join(directory, '.agent-contract/report.json'), 'utf8'))).toMatchObject({ passed: true });
});

test('@claim:demo-sandbox keeps demo state separate and reset removes it', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Review a complete CLI contract run');
  await page.getByRole('button', { name: 'Show a blocked change' }).click();
  expect(await page.evaluate(() => localStorage.getItem('demo:report'))).toBe('failed');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('demo:')))).toEqual([]);
  await expect(page.getByText('All four contract checks pass')).toBeVisible();
  await page.evaluate(() => localStorage.setItem('real:sentinel', 'keep'));
  await page.getByRole('button', { name: 'Show a blocked change' }).click();
  await page.getByRole('button', { name: 'Leave demo and view install steps' }).click();
  await expect(page).toHaveURL('/#install');
  expect(await page.evaluate(() => localStorage.getItem('real:sentinel'))).toBe('keep');
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('demo:')))).toEqual([]);
});

test('@claim:no-third-party-data sends no demo data to other origins', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/?demo=1');
  await page.getByRole('button', { name: 'Replay recorded sample run' }).click();
  await expect(page.getByText('Replaying the recorded output from the bundled CLI demo.')).toBeVisible();
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:recorded-demo matches a fresh bundled CLI demo report', async ({ page }) => {
  const result = await run(['--json', 'demo']);
  expect(result.code).toBe(0);
  const summary = JSON.parse(result.stdout.trim());
  const report = JSON.parse(await readFile(join(summary.demo, '.agent-contract/report.json'), 'utf8'));
  const transcript = await readFile(resolve('site/public/terminal-recording.txt'), 'utf8');
  const recording = await readFile(resolve('site/public/terminal-recording.svg'), 'utf8');
  expect(report.summary).toMatchObject({ passed: 4, failed: 0 });
  for (const check of report.checks) {
    const line = `✓ ${check.fixture} [${check.mode}] exit ${check.exit}`;
    expect(transcript).toContain(line);
    expect(recording).toContain(line);
  }
  expect(transcript).toContain('Report: /tmp/agent-contract-demo-<id>/.agent-contract/report.md');
  await page.goto('/?demo=1');
  await expect(page.locator('img[src="/terminal-recording.svg"]')).toBeVisible();
  await expect(page.getByText('agent-contract demo', { exact: true }).first()).toBeVisible();
});

test('@claim:free-mit ships as free MIT-licensed source', async () => {
  const license = await readFile(resolve('LICENSE'), 'utf8');
  const manifest = await readFile(resolve('Cargo.toml'), 'utf8');
  expect(license).toContain('Permission is hereby granted, free of charge');
  expect(manifest).toContain('license = "MIT"');
});

test('@claim:no-cli-telemetry has no telemetry or network client path', async () => {
  const source = await readFile(resolve('src/main.rs'), 'utf8');
  const lock = await readFile(resolve('Cargo.lock'), 'utf8');
  expect(source).not.toMatch(/std::net|TcpStream|UdpSocket|telemetry|analytics/i);
  expect(lock).not.toMatch(/name = "(reqwest|ureq|hyper|opentelemetry|sentry)"/);
  expect((await run(['--json', 'demo'])).code).toBe(0);
});

test('@claim:rust-version declares the tested minimum Rust version', async () => {
  const manifest = await readFile(resolve('Cargo.toml'), 'utf8');
  expect(manifest).toContain('rust-version = "1.85"');
  expect((await run(['--version'])).stdout).toContain('0.1.0');
});

test('@claim:direct-execution @claim:declared-commands keeps command arguments literal', async () => {
  const source = await readFile(resolve('src/main.rs'), 'utf8');
  expect(source).toContain('Command::new(program)');
  expect(source).not.toContain('Command::new("sh")');
  const { path } = await contractDir(`version: 1
command: [${JSON.stringify(process.execPath)}, "-e", "console.log(process.argv[1])"]
fixtures:
  - name: literal argument
    args: ["ridge; echo injected"]
    expect:
      exit: 0
      stdout_contains: ["ridge; echo injected"]
`);
  expect((await run(['check', path, '--accept'])).code).toBe(0);
  const empty = await contractDir('version: 1\ncommand: []\nfixtures: []\n');
  expect((await run(['--json', 'check', empty.path])).code).toBe(2);
});

test('@claim:environment-isolation does not pass host-only secrets to a fixture', async () => {
  const previous = process.env.HOST_ONLY_SECRET;
  process.env.HOST_ONLY_SECRET = 'host-secret-921';
  try {
    const { path } = await contractDir(`version: 1
command: [${JSON.stringify(process.execPath)}, "-e", "console.log(process.env.HOST_ONLY_SECRET || 'absent')"]
fixtures:
  - name: isolated environment
    expect:
      exit: 0
      stdout_contains: [absent]
`);
    expect((await run(['check', path, '--accept'])).code).toBe(0);
  } finally {
    if (previous === undefined) delete process.env.HOST_ONLY_SECRET;
    else process.env.HOST_ONLY_SECRET = previous;
  }
});

test('@claim:cli-demo-isolation leaves a project sentinel untouched', async () => {
  const project = await mkdtemp(join(tmpdir(), 'agent-contract-project-'));
  const sentinel = join(project, 'project.txt');
  await writeFile(sentinel, 'keep this project file');
  const result = await exec(binary, ['--json', 'demo'], { cwd: project, timeout: 20_000 });
  const summary = JSON.parse(result.stdout);
  expect(summary.demo).not.toContain(project);
  expect(await readFile(sentinel, 'utf8')).toBe('keep this project file');
});

test('@claim:exit-codes @claim:json-failure-document reports documented outcomes', async () => {
  const invalid = await contractDir('version: 1\ncommand: []\nfixtures: []\n');
  expect((await run(['--json', 'check', invalid.path])).code).toBe(2);
  const failing = await contractDir(`version: 1
command: [${JSON.stringify(process.execPath)}, "-e", "process.exit(4)"]
fixtures:
  - name: expected zero
    expect:
      exit: 0
`);
  const failed = await run(['--json', 'check', failing.path, '--accept']);
  expect(failed.code).toBe(1);
  expect(JSON.parse(failed.stdout)).toMatchObject({ passed: false });
  const passing = await contractDir(`version: 1
command: [${JSON.stringify(process.execPath)}, "-e", "process.exit(0)"]
fixtures:
  - name: expected zero
    expect:
      exit: 0
`);
  expect((await run(['check', passing.path, '--accept'])).code).toBe(0);
});

test('routes have one focused-capable h1 and no serious accessibility issues', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  for (const route of ['/', '/demo', '/privacy', '/terms', '/missing-route']) {
    await page.goto(route);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page).toHaveTitle(/Agent CLI Contract/);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  }
  expect(consoleErrors).toEqual([]);
});

test('mobile demo keeps primary actions visible and links resolve', async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await page.getByRole('link', { name: 'Try it with sample data' }).press('Enter');
  await expect(page).toHaveURL('/?demo=1');
  await expect(page.getByRole('button', { name: 'Replay recorded sample run' })).toBeVisible();
  for (const path of ['/', '/demo', '/privacy', '/terms', '/robots.txt', '/sitemap.xml', '/favicon.svg']) {
    expect((await request.get(path)).ok()).toBe(true);
  }
});

test('desktop first screen keeps the primary action and all facts above a 768px fold', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('/');
  const action = await page.getByRole('link', { name: 'Try it with sample data' }).boundingBox();
  const facts = await page.locator('.plain-facts').boundingBox();
  expect(action).not.toBeNull();
  expect(facts).not.toBeNull();
  expect(action!.y + action!.height).toBeLessThanOrEqual(768);
  expect(facts!.y + facts!.height).toBeLessThanOrEqual(768);
});

test('390px routes do not create horizontal overflow and utility targets are touch sized', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/', '/demo']) {
    await page.goto(route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  }
  await page.goto('/?demo=1');
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
  const banner = await page.locator('.demo-banner').boundingBox();
  expect(banner).not.toBeNull();
  expect(banner!.y).toBeGreaterThanOrEqual(0);
  expect(banner!.y + banner!.height).toBeLessThanOrEqual(844);
  for (const name of ['Reset demo', 'Leave demo and view install steps']) {
    const box = await page.getByRole('button', { name }).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
  for (const name of ['Privacy', 'Terms']) {
    const box = await page.locator('footer').getByRole('link', { name }).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});

test('Back restores landing scroll while focusing its heading', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
  const saved = await page.evaluate(() => window.scrollY);
  await page.evaluate(() => document.querySelector<HTMLAnchorElement>('a[href="/demo"]')?.click());
  await page.goBack();
  await expect(page.locator('h1')).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(saved - 24);
  expect(await page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(saved + 24);
});

test('each route updates its title, description, canonical, and social metadata', async ({ page }) => {
  const expected = [
    ['/', 'Agent CLI Contract — test stable command output', 'https://agent-cli-contract.sociobot.in/'],
    ['/demo', 'Demo — Agent CLI Contract', 'https://agent-cli-contract.sociobot.in/demo'],
    ['/privacy', 'Privacy — Agent CLI Contract', 'https://agent-cli-contract.sociobot.in/privacy'],
    ['/terms', 'Terms — Agent CLI Contract', 'https://agent-cli-contract.sociobot.in/terms'],
    ['/not-here', 'Page not found — Agent CLI Contract', 'https://agent-cli-contract.sociobot.in/404']
  ];
  for (const [path, title, canonical] of expected) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe(canonical);
    expect(await page.locator('meta[property="og:title"]').getAttribute('content')).toBe(title);
    expect(await page.locator('meta[property="og:url"]').getAttribute('content')).toBe(canonical);
  }
});

test('skip link moves keyboard focus into the main landmark', async ({ page }) => {
  await page.goto('/demo');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('the loaded demo reloads offline and its service worker accepts an update check', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.evaluate(async () => { await navigator.serviceWorker.getRegistration().then((registration) => registration?.update()); });
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Review a complete CLI contract run');
  await context.setOffline(false);
});

test('deployment configuration sends unknown routes through a real 404 and caches versioned assets', async () => {
  const config = JSON.parse(await readFile(resolve('site/public/staticwebapp.config.json'), 'utf8'));
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
  expect((await stat(resolve('dist/site/404.html'))).size).toBeGreaterThan(0);
  const immutable = config.routes.find((route: { route: string }) => route.route === '/assets/*');
  expect(immutable.headers['Cache-Control']).toContain('immutable');
});

test('built assets stay inside the initial performance budgets', async () => {
  const files = await readdir(resolve('dist/site/assets'));
  const js = files.filter((name) => name.endsWith('.js'));
  const css = files.filter((name) => name.endsWith('.css'));
  const sizes = async (names: string[]) => (await Promise.all(names.map((name) => stat(resolve('dist/site/assets', name))))).reduce((sum, item) => sum + item.size, 0);
  expect(await sizes(js)).toBeLessThanOrEqual(200 * 1024);
  expect(await sizes(css)).toBeLessThanOrEqual(50 * 1024);
  expect((await stat(resolve('dist/site/topographic-run.webp'))).size).toBeLessThanOrEqual(300 * 1024);
});
