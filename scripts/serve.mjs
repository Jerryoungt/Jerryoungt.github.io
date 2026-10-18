import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

const sendFile = async (request, response, requestedPath, status = 200) => {
  const fileStat = await stat(requestedPath);
  const headers = {
    'Content-Type': types[path.extname(requestedPath).toLowerCase()] || 'application/octet-stream',
    'Content-Length': fileStat.size,
    'Cache-Control': 'no-store'
  };
  response.writeHead(status, headers);
  if (request.method === 'HEAD') {
    response.end();
    return;
  }
  createReadStream(requestedPath).pipe(response);
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
    const pathname = decodeURIComponent(url.pathname);
    let filePath = path.resolve(root, pathname.replace(/^\/+/, '') || 'index.html');

    if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
      response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Forbidden');
      return;
    }

    let fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      fileStat = await stat(filePath);
    }

    if (!fileStat.isFile()) throw new Error('Not a file');
    await sendFile(request, response, filePath);
  } catch (_) {
    try {
      await sendFile(request, response, path.join(root, '404.html'), 404);
    } catch (_) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
    }
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Jerryoungt is running at http://127.0.0.1:${port}`);
});
