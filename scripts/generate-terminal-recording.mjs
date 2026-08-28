import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const binary = resolve('target/debug/agent-contract');
const outputDirectory = resolve('site/public');

const { stdout } = await exec(binary, ['demo'], { timeout: 30_000 });
const transcript = `$ agent-contract demo\n${stdout.trim()}`
  .replace(/\/tmp\/agent-contract-demo-[^/\s]+/g, '/tmp/agent-contract-demo-<id>');
const lines = transcript.split('\n');
const escapeXml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');
const textRows = lines.map((line, index) => {
  const fill = line.startsWith('✓') || line.startsWith('PASS') ? '#7ee2a8' : line.startsWith('$') ? '#ef8a6d' : '#e7f0dd';
  return `<text x="40" y="${88 + index * 36}" fill="${fill}" class="row row-${index}">${escapeXml(line)}</text>`;
}).join('\n    ');
const height = 116 + lines.length * 36;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1040" height="${height}" viewBox="0 0 1040 ${height}" role="img" aria-labelledby="title description">
  <title id="title">Recorded agent-contract demo terminal run</title>
  <desc id="description">The real bundled demo passes four checks and writes its report to an isolated temporary directory.</desc>
  <style>
    text { font: 20px ui-monospace, SFMono-Regular, Consolas, monospace; }
    .label { font-size: 15px; font-weight: 600; }
    .row { opacity: 0; animation: reveal 180ms ease forwards; }
    ${lines.map((_, index) => `.row-${index} { animation-delay: ${index * 160}ms; }`).join('\n    ')}
    @keyframes reveal { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: translateX(0); } }
    @media (prefers-reduced-motion: reduce) { .row { opacity: 1; animation: none; } }
  </style>
  <rect width="1040" height="${height}" rx="8" fill="#10221f"/>
  <rect width="1040" height="48" rx="8" fill="#17312c"/>
  <circle cx="25" cy="24" r="5" fill="#c94224"/><circle cx="43" cy="24" r="5" fill="none" stroke="#8da69b"/><circle cx="61" cy="24" r="5" fill="none" stroke="#8da69b"/>
  <text x="1000" y="30" fill="#b7c9bf" text-anchor="end" class="label">recorded from the bundled CLI · local</text>
  <g>
    ${textRows}
  </g>
</svg>\n`;

await mkdir(outputDirectory, { recursive: true });
await writeFile(resolve(outputDirectory, 'terminal-recording.svg'), svg);
await writeFile(resolve(outputDirectory, 'terminal-recording.txt'), `${transcript}\n`);
console.log(`Generated terminal recording from ${lines.length - 1} lines of real demo output.`);
