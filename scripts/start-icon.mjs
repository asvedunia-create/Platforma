#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { existsSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const envPath = resolve(root, '.env');
const envExamplePath = resolve(root, '.env.example');

if (!existsSync(envPath) && existsSync(envExamplePath)) {
  copyFileSync(envExamplePath, envPath);
  console.log('Created .env from .env.example');
}

function run(command, args, options = {}) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: 'inherit',
      shell: process.platform === 'win32',
      ...options
    });

    child.on('exit', (code) => {
      if (code === 0) resolvePromise();
      else rejectPromise(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });
}

async function main() {
  const composeCmd = process.platform === 'win32' ? 'docker' : 'docker';

  console.log('Starting PostgreSQL container...');
  await run(composeCmd, ['compose', 'up', '-d', 'db']);

  console.log('Installing dependencies (if needed)...');
  await run('npm', ['install']);

  console.log('Generating Prisma client...');
  await run('npx', ['prisma', 'generate']);

  console.log('Applying schema (db push for MVP bootstrap)...');
  await run('npx', ['prisma', 'db', 'push']);

  console.log('Seeding demo data...');
  await run('npm', ['run', 'prisma:seed']);

  console.log('Starting app on http://localhost:3000 ...');
  await run('npm', ['run', 'dev']);
}

main().catch((error) => {
  console.error('\nStart failed:', error.message);
  process.exit(1);
});
