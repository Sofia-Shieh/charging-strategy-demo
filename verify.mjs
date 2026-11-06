import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.dirname(fileURLToPath(import.meta.url));
const source = path.join(root, 'dist');
const html = fs.readFileSync(path.join(source, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)].map(match => match[1]);
const styles = [...html.matchAll(/<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref=["']([^"']+)["']/gi)].map(match => match[1]);

if (!scripts.length || !styles.length) throw new Error('The source entry must load the presentation modules and styles.');
for (const relative of [...scripts, ...styles]) {
  const file = path.resolve(source, relative);
  if (!file.startsWith(source + path.sep) || !fs.statSync(file).isFile()) {
    throw new Error(`Missing or invalid source dependency: ${relative}`);
  }
}
for (const relative of scripts) {
  execFileSync(process.execPath, ['--check', path.join(source, relative)], { stdio: 'inherit' });
}
for (const relative of ['assets/segmentation.jpg', 'assets/pricing.jpg', 'assets/configuration.jpg']) {
  if (!fs.statSync(path.join(source, relative)).isFile()) throw new Error(`Missing case image: ${relative}`);
}
console.log(`Source verified: ${scripts.length} scripts, ${styles.length} styles, 3 case images.`);
