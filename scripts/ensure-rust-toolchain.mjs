import { execFileSync } from 'node:child_process';

const required = '1.85.0';
const installed = execFileSync('rustup', ['toolchain', 'list'], { encoding: 'utf8' });

if (!installed.split('\n').some((line) => line.startsWith(`${required}-`) || line === required)) {
  execFileSync('rustup', ['toolchain', 'install', required, '--profile', 'minimal'], { stdio: 'inherit' });
}
