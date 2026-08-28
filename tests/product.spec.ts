import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { execFile } from 'node:child_process';
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
  expect(changed.stdout).toContain('stdout snapshot changed');
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

test('@claim:network-opt-in blocks network-shaped commands by default', async () => {
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
});

test('@claim:demo-sandbox keeps demo state separate and reset removes it', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Review a complete CLI contract run');
  await page.getByRole('button', { name: 'Show a blocked change' }).click();
  expect(await page.evaluate(() => localStorage.getItem('demo:report'))).toBe('failed');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('demo:')))).toEqual([]);
  await expect(page.getByText('All four contract checks pass')).toBeVisible();
});

test('@claim:no-third-party-data sends no demo data to other origins', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Run sample contract' }).click();
  await expect(page.getByText('Four checks passed. The sample workspace was discarded.')).toBeVisible();
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
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
  await expect(page.getByRole('button', { name: 'Run sample contract' })).toBeVisible();
  for (const path of ['/', '/demo', '/privacy', '/terms', '/robots.txt', '/sitemap.xml', '/favicon.svg']) {
    expect((await request.get(path)).ok()).toBe(true);
  }
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
