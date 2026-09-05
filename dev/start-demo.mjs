import { spawn } from 'node:child_process';
import { prepareDemo } from './demo-environment.mjs';
const demo = prepareDemo();
console.log(`Prepared a disposable teaching repository and synthetic session at ${demo.temp}`);
console.log('No credentials or global extensions loaded. Use /workflow-demo propose, confirm, check, close, status, reset.');
console.log('The temporary workspace is retained when you exit so you can inspect it.');
const child = spawn(process.execPath, demo.args, { cwd: demo.cwd, env: demo.env, stdio: 'inherit' });
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
