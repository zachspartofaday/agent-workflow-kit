import { mkdtempSync, mkdirSync, copyFileSync, realpathSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { randomUUID } from "node:crypto";
export const kitRoot = fileURLToPath(new URL('../', import.meta.url));
export function prepareDemo() {
  const temp = realpathSync(mkdtempSync(join(tmpdir(), 'workflow-kit-demo-')));
  const cwd = join(temp, 'repository');
  const config = join(temp, 'pi-config');
  mkdirSync(join(cwd, 'examples/pi-workflow'), { recursive: true });
  mkdirSync(config);
  copyFileSync(join(kitRoot, 'examples/pi-workflow/fixture.json'), join(cwd, 'examples/pi-workflow/fixture.json'));
  const git = (...args) => execFileSync('git', args, { cwd, stdio: 'ignore' });
  git('init', '-q'); git('add', '.');
  git('-c', 'user.name=Workflow Kit Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'Seed teaching fixture');
  const sessionFile = join(temp, 'demo-session.jsonl');
  const timestamp = new Date().toISOString();
  const header = { type: 'session', version: 3, id: randomUUID(), timestamp, cwd };
  // Pi defers first disk persistence until an assistant entry. This is explicitly synthetic test data.
  const greeting = { type: 'message', id: 'seed0001', parentId: null, timestamp, message: { role: 'assistant', content: [{ type: 'text', text: 'SYNTHETIC TEACHING FIXTURE: no model was called. This greeting initializes Pi session persistence. Use /workflow-demo commands; this session has no provider credentials.' }], api: 'openai-responses', provider: 'openai', model: 'gpt-4o', usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, totalTokens: 0, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } }, stopReason: 'stop', timestamp: Date.now() } };
  writeFileSync(sessionFile, [header, greeting].map(e => JSON.stringify(e)).join('\n') + '\n');
  // Deliberately omit API keys, OAuth state and the user's Pi configuration.
  const env = { PATH: process.env.PATH, HOME: process.env.HOME, TMPDIR: process.env.TMPDIR, TERM: process.env.TERM || 'xterm-256color', LANG: process.env.LANG || 'en_US.UTF-8', PI_CODING_AGENT_DIR: config, PI_OFFLINE: '1', PI_TELEMETRY: '0' };
  const packageRoot = resolve(kitRoot, 'node_modules/@earendil-works/pi-coding-agent');
  const manifest = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'));
  const cli = resolve(packageRoot, manifest.bin.pi);
  const args = [cli, '--offline', '--no-extensions', '-e', join(kitRoot, 'examples/pi-workflow/index.ts'), '--no-skills', '--no-prompt-templates', '--no-themes', '--no-context-files', '--no-builtin-tools', '--provider', 'openai', '--model', 'gpt-4o', '--session', sessionFile];
  return { temp, cwd, env, args, sessionFile: sessionFile };
}
