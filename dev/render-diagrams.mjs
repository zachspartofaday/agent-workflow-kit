import { readdir, readFile, writeFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';
const directory = new URL('../assets/diagrams/', import.meta.url);
for (const name of (await readdir(directory)).filter(name => name.endsWith('.svg'))) {
  const svg = await readFile(new URL(name, directory));
  const renderer = new Resvg(svg, { font: { defaultFontFamily: 'Arial' } });
  await writeFile(new URL(name.replace(/\.svg$/, '.png'), directory), renderer.render().asPng());
  console.log(`Rendered ${name}`);
}
