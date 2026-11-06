import http from 'node:http';
import fs from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = path.dirname(fileURLToPath(import.meta.url));
const root = await realpath(path.join(project, 'dist'));
const withinRoot = candidate => candidate === root || candidate.startsWith(root + path.sep);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

const server = http.createServer(async (request, response) => {
  const fail = (status, message) => {
    response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(request.method === 'HEAD' ? '' : message);
  };
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    return fail(405, 'Method not allowed');
  }

  try {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    } catch {
      return fail(400, 'Invalid request path');
    }
    if (pathname.includes('\0') || pathname.includes('\\')) return fail(400, 'Invalid request path');
    if (pathname.endsWith('/')) pathname += 'index.html';
    const requested = path.resolve(root, '.' + pathname);
    if (!withinRoot(requested)) return fail(403, 'Path is outside the preview directory');

    // Resolve symbolic links before serving so only this project's dist is exposed.
    const resolved = await realpath(requested);
    if (!withinRoot(resolved)) return fail(403, 'Path is outside the preview directory');
    const info = await stat(resolved);
    if (!info.isFile()) return fail(404, 'Not found');
    response.writeHead(200, {
      'Content-Type': types[path.extname(resolved).toLowerCase()] || 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    });
    if (request.method === 'HEAD') return response.end();
    fs.createReadStream(resolved).on('error', () => response.destroy()).pipe(response);
  } catch (error) {
    fail(error.code === 'ENOENT' || error.code === 'ENOTDIR' ? 404 : 500,
      error.code === 'ENOENT' || error.code === 'ENOTDIR' ? 'Not found' : 'Unable to read file');
  }
});

server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? 'Port 4174 is already in use.' : error.message);
  process.exitCode = 1;
});
server.listen(4174, '127.0.0.1', () => {
  console.log('Independent cover preview: http://127.0.0.1:4174');
});
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
