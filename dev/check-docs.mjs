import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, dirname, relative, isAbsolute, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const ignored = new Set(['node_modules', '.git', 'dist', '.pi', '.artifacts']);
const errors = [];
async function walk(dir) {
  const files = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    if (ignored.has(item.name)) continue;
    const file = resolve(dir, item.name);
    if (item.isDirectory()) files.push(...await walk(file)); else files.push(file);
  }
  return files;
}
const files = await walk(root);
for (const file of files.filter(f => f.endsWith('.md'))) {
  const text = await readFile(file, 'utf8');
  const label = relative(root, file);
  const prose = text.replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, '');
  for (const match of prose.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    const link = match[1].replace(/^<|>$/g, '').split('#')[0];
    if (!link || /^(https?:|mailto:)/.test(link)) continue;
    const target = resolve(dirname(file), decodeURIComponent(link));
    const rel = relative(root, target);
    if (isAbsolute(rel) || rel === '..' || rel.startsWith('../')) { errors.push(`${label}: link escapes kit: ${link}`); continue; }
    try { await stat(target); } catch { errors.push(`${label}: missing link: ${link}`); }
    if (label.startsWith('skills/') && basename(file) === 'SKILL.md') {
      const skillRel = relative(dirname(file), target);
      if (skillRel === '..' || skillRel.startsWith('../')) errors.push(`${label}: skill is not self-contained: ${link}`);
    }
  }
  if (basename(file) === 'SKILL.md') {
    const front = text.match(/^---\n([\s\S]*?)\n---\n/);
    const name = front?.[1].match(/^name: ([a-z0-9-]+)$/m)?.[1];
    const description = front?.[1].match(/^description: (.+)$/m)?.[1];
    if (name !== basename(dirname(file)) || !description || name.length >= 64) errors.push(`${label}: invalid skill metadata`);
    if (front && /\bTODO\b|\[insert|\[TODO/i.test(text.slice(front[0].length))) errors.push(`${label}: unfinished skill scaffold`);
  }
  if (/^(<{7}|={7}|>{7})/m.test(text)) errors.push(`${label}: conflict marker`);
}
if (files.filter(f => basename(f) === 'SKILL.md').length !== 9) errors.push('Expected the nine documented skills');
for (const svg of files.filter(f => f.endsWith('.svg'))) {
  const data = await readFile(svg, 'utf8');
  if (!data.includes('<title') || !data.includes('<desc')) errors.push(`${relative(root,svg)}: missing accessible description`);
  try { await stat(svg.replace(/\.svg$/, '.png')); } catch { errors.push(`${relative(root,svg)}: missing PNG export`); }
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Documentation checks passed: ${files.filter(f => f.endsWith('.md')).length} Markdown files, nine standalone skills, local links and ${files.filter(f => f.endsWith('.svg')).length} accessible diagram sources.`);
