import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(project, 'dist');
const output = path.join(project, 'delivery');
let html = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
const css = await fs.readFile(path.join(dist, 'style.css'), 'utf8');
const script = await fs.readFile(path.join(dist, 'main.js'), 'utf8');
const image = await fs.readFile(path.join(dist, 'assets', 'charging-editorial.png'));

const stylesheet = /<link\b[^>]*\bhref=["'](?:\.\/)?style\.css["'][^>]*>/i;
const scriptTag = /<script\b[^>]*\bsrc=["'](?:\.\/)?main\.js["'][^>]*>\s*<\/script>/i;
if (!stylesheet.test(html) || !scriptTag.test(html)) {
  throw new Error('Expected index.html to reference style.css and main.js.');
}
html = html.replace(stylesheet, () => '<style>' + css.replaceAll('</style', '<\\/style') + '</style>');
html = html.replace(scriptTag, tag => {
  const opening = tag.slice(0, tag.indexOf('>') + 1)
    .replace(/\s+src=["'](?:\.\/)?main\.js["']/i, '')
    .replace(/\s+defer\b/i, '');
  return opening + script.replaceAll('</script', '<\\/script') + '</script>';
});
html = html.replaceAll('./assets/charging-editorial.png', 'assets/charging-editorial.png')
  .replaceAll('assets/charging-editorial.png', 'data:image/png;base64,' + image.toString('base64'));

await fs.mkdir(output, { recursive: true });
for (const name of ['充电业务经营-独立封面.html', 'cover-avelon.html']) {
  await fs.writeFile(path.join(output, name), html);
}
console.log('Standalone covers written to ' + output);
