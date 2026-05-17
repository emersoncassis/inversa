import { createServer } from 'http';
import { readFileSync } from 'fs';
import { dirname, extname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { installFromWeb } from './install.js';
import { canRunAction, runWebAction } from './actions.js';
import { getDashboardState, getInstallOptions } from './state.js';
import { runReversaTerminalCommand } from './terminal.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATIC_DIR = join(__dirname, 'static');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

export function startWebServer({ projectRoot, host, port, version }) {
  const root = resolve(projectRoot);

  const server = createServer(async (req, res) => {
    try {
      await routeRequest({ req, res, projectRoot: root, version });
    } catch (error) {
      sendJson(res, 500, {
        error: error.message || 'Erro interno.',
      });
    }
  });

  return new Promise((resolveServer, rejectServer) => {
    server.once('error', rejectServer);
    server.listen(port, host, () => {
      server.off('error', rejectServer);
      const address = server.address();
      const actualHost = address.address === '::' ? 'localhost' : address.address;
      resolveServer({
        server,
        url: `http://${actualHost}:${address.port}`,
      });
    });
  });
}

async function routeRequest({ req, res, projectRoot, version }) {
  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'GET' && url.pathname === '/') {
    return sendStatic(res, 'index.html');
  }

  if (req.method === 'GET' && url.pathname.startsWith('/assets/')) {
    return sendStatic(res, url.pathname.replace('/assets/', ''));
  }

  if (req.method === 'GET' && url.pathname === '/api/state') {
    return sendJson(res, 200, getDashboardState(projectRoot));
  }

  if (req.method === 'GET' && url.pathname === '/api/install-options') {
    return sendJson(res, 200, getInstallOptions(projectRoot));
  }

  if (req.method === 'POST' && url.pathname === '/api/install') {
    const payload = await readJsonBody(req);
    const result = await installFromWeb(projectRoot, payload, version);
    if (!result.ok) return sendJson(res, result.status, { error: result.error });
    return sendJson(res, result.status, result.data);
  }

  if (req.method === 'POST' && url.pathname.startsWith('/api/actions/')) {
    const actionId = decodeURIComponent(url.pathname.replace('/api/actions/', ''));
    if (!canRunAction(actionId)) {
      return sendJson(res, 404, { error: 'Acao nao encontrada.' });
    }
    return sendJson(res, 200, await runWebAction(projectRoot, actionId));
  }

  if (req.method === 'POST' && url.pathname === '/api/terminal') {
    const payload = await readJsonBody(req);
    return sendJson(res, 200, await runReversaTerminalCommand(projectRoot, payload.command));
  }

  return sendJson(res, 404, { error: 'Rota nao encontrada.' });
}

function sendStatic(res, fileName) {
  if (!/^[a-zA-Z0-9._-]+$/.test(fileName)) {
    return sendJson(res, 400, { error: 'Arquivo invalido.' });
  }

  const filePath = join(STATIC_DIR, fileName);
  const content = readFileSync(filePath);
  const contentType = MIME_TYPES[extname(filePath)] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
  });
  res.end(content);
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': MIME_TYPES['.json'],
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
