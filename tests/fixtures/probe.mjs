import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

const mode = process.argv[2] ?? 'text';
if (mode === 'tty') {
  console.log(`isTTY=${Boolean(process.stdout.isTTY)}`);
} else if (mode === 'unstable') {
  console.log(JSON.stringify({ ok: true, meta: { run_id: randomUUID() } }));
} else if (mode === 'unstable-duration') {
  console.log(JSON.stringify({ ok: true, meta: { duration_ms: randomUUID() } }));
} else if (mode === 'mutate') {
  const count = existsSync('count.txt') ? Number(readFileSync('count.txt', 'utf8')) + 1 : 1;
  writeFileSync('count.txt', String(count));
  console.log(`count=${count}`);
} else if (mode === 'json') {
  console.log(JSON.stringify({ ok: true, cwd: process.cwd(), token: process.env.DEMO_TOKEN ?? '' }));
} else {
  writeFileSync('fixture-created.txt', 'inside fixture');
  const input = existsSync('input.txt') ? readFileSync('input.txt', 'utf8') : '';
  console.log(`cwd=${process.cwd()} token=${process.env.DEMO_TOKEN ?? ''} input=${input}`);
}
