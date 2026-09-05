import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { once } from 'node:events';
import { prepareDemo } from './demo-environment.mjs';
const demo = prepareDemo();
let child;
let seq = 0;
let respond = true;
let events = [];
const pending = new Map();
let stderr = '';
function start() {
  child = spawn(process.execPath, [...demo.args, '--mode', 'rpc'], { cwd: demo.cwd, env: demo.env, stdio: ['pipe', 'pipe', 'pipe'] });
  let buffer = '';
  child.stderr.on('data', data => { stderr = (stderr + data).slice(-4000); });
  child.stdout.on('data', data => {
    buffer += data;
    let newline;
    while ((newline = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, newline); buffer = buffer.slice(newline + 1);
      if (!line.trim()) continue;
      let event;
      try { event = JSON.parse(line); } catch { continue; }
      events.push(event);
      if (event.type === 'extension_ui_request' && event.method === 'confirm') child.stdin.write(JSON.stringify({ type: 'extension_ui_response', id: event.id, confirmed: respond }) + '\n');
      if (event.type === 'response' && pending.has(event.id)) {
        const task = pending.get(event.id); pending.delete(event.id); clearTimeout(task.timer);
        if (event.success) task.resolve(event); else task.reject(new Error(event.error || 'RPC refusal'));
      }
    }
  });
  child.on('exit', () => { for (const task of pending.values()) { clearTimeout(task.timer); task.reject(new Error(`Pi exited before its RPC response: ${stderr}`)); } pending.clear(); });
  child.on('error', error => { for (const task of pending.values()) { clearTimeout(task.timer); task.reject(error); } pending.clear(); });
}
function send(type, fields = {}) {
  const id = `smoke-${++seq}`;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timeout waiting for ${type}: ${stderr}`)); }, 15000);
    pending.set(id, { resolve, reject, timer });
    child.stdin.write(JSON.stringify({ id, type, ...fields }) + '\n');
  });
}
async function command(action, expected) {
  events = [];
  await send('prompt', { message: `/workflow-demo ${action}` });
  const notices = events.filter(e => e.type === 'extension_ui_request' && e.method === 'notify');
  assert.ok(notices.length, `No extension notification for ${action}`);
  assert.match(notices.at(-1).message, expected);
  assert.equal(events.some(e => e.type === 'agent_start'), false, 'A demo command unexpectedly invoked the model');
}
async function stop() {
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  const exited = once(child, 'exit'); child.stdin.end();
  const timer = setTimeout(() => child.kill('SIGTERM'), 3000);
  const force = setTimeout(() => child.kill('SIGKILL'), 6000);
  await exited; clearTimeout(timer); clearTimeout(force);
}
try {
  start();
  const commands = await send('get_commands');
  assert.ok(commands.data.commands.some(c => c.name === 'workflow-demo'), 'Extension failed to register');
  await command('status', /inactive/);
  await command('check', /confirmation/);
  await command('propose Verify fixture', /proposed/);
  respond = false; await command('confirm', /cancelled/);
  respond = true; await command('confirm', /confirmed/);
  await command('check', /checked; check=passed/);
  await command('close', /complete/);
  await stop();
  const persisted = readFileSync(demo.sessionFile, 'utf8').split('\n').filter(Boolean).map(s => JSON.parse(s));
  assert.equal(persisted.filter(e => e.customType === 'workflow-kit.demo.v1').length, 4);
  start(); await send('get_state'); await command('status', /complete/);
  writeFileSync(join(demo.cwd, 'examples/pi-workflow/fixture.json'), '{"schema":1,"lesson":"evidence","ready":false}');
  await command('status', /stale/);
  await command('close', /inputs changed/);
  await command('propose Diagnose fixture', /proposed/); await command('confirm', /confirmed/);
  await command('check', /checked; check=failed/); await command('close', /passing fixture check/);
  await command('reset', /inactive/);
  console.log('Pi 0.85.0 RPC walkthrough passed: registration, refusal, cancellation, approval, actual check, disk restoration, stale inputs, failed check, reset. No model calls.');
} finally {
  await stop();
  for (const task of pending.values()) clearTimeout(task.timer);
  rmSync(demo.temp, { recursive: true, force: true });
}
