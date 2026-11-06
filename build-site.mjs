import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, '_site');
execFileSync(process.execPath, [path.join(root, 'verify.mjs')], { stdio: 'inherit' });
execFileSync(process.execPath, [path.join(root, 'bundle.mjs')], { stdio: 'inherit' });

const standalone = fs.readFileSync(path.join(root, 'delivery', '充电业务经营汇报.html'), 'utf8');
if (/<script\b[^>]*\bsrc\s*=/i.test(standalone) || /<link\b[^>]*\brel=["']stylesheet["']/i.test(standalone)) {
  throw new Error('The bundle still contains external script or stylesheet dependencies.');
}
if (/assets\/(?:segmentation|pricing|configuration)\.jpg/.test(standalone)) {
  throw new Error('The bundle still contains unembedded case image paths.');
}

fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'index.html'), standalone);
fs.writeFileSync(path.join(output, '.nojekyll'), '');
const alternateCover = path.join(root, 'cover-avelon.html');
if (fs.existsSync(alternateCover)) fs.copyFileSync(alternateCover, path.join(output, 'cover-avelon.html'));
console.log(`GitHub Pages site ready: ${output}`);
