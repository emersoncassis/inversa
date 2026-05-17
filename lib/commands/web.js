import { spawn } from 'child_process';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { startWebServer } from '../web/server.js';
import { readJsonSafe } from '../utils/json-safe.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');

export default async function web(args) {
  const { default: chalk } = await import('chalk');
  const projectRoot = resolve(process.cwd());
  const options = parseArgs(args);
  const version = getVersion();
  const { url } = await startWebServer({
    projectRoot,
    host: options.host,
    port: options.port,
    version,
  });

  console.log(chalk.bold('\n  Reversa Web\n'));
  console.log(`  Project: ${chalk.cyan(projectRoot)}`);
  console.log(`  URL:     ${chalk.hex('#ffa203')(url)}\n`);
  console.log(chalk.gray('  Pressione Ctrl+C para encerrar.\n'));

  if (options.open) openBrowser(url);
}

function parseArgs(args) {
  const portArg = args.find(arg => arg.startsWith('--port='));
  const hostArg = args.find(arg => arg.startsWith('--host='));
  const port = portArg ? Number(portArg.split('=')[1]) : 17310;
  const host = hostArg ? hostArg.split('=')[1] : '127.0.0.1';

  return {
    host,
    port: Number.isInteger(port) && port > 0 && port < 65536 ? port : 17310,
    open: !args.includes('--no-open'),
  };
}

function getVersion() {
  try {
    return readJsonSafe(join(REPO_ROOT, 'package.json')).version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}

function openBrowser(url) {
  try {
    if (process.platform === 'win32') {
      spawn('cmd', ['/c', 'start', '', url], {
        detached: true,
        stdio: 'ignore',
        windowsHide: true,
      }).unref();
      return;
    }

    const command = process.platform === 'darwin' ? 'open' : 'xdg-open';
    spawn(command, [url], {
      detached: true,
      stdio: 'ignore',
    }).unref();
  } catch {
    // Browser opening is convenience only; the printed URL is the source of truth.
  }
}
