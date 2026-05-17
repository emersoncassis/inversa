import { spawn } from 'child_process';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const CLI_PATH = join(REPO_ROOT, 'bin', 'reversa.js');
const ACTION_TIMEOUT_MS = 120_000;

const ACTIONS = {
  status: ['status'],
  'export-diagrams-svg': ['export-diagrams', '--format=svg'],
  'export-diagrams-png': ['export-diagrams', '--format=png'],
};

export function canRunAction(actionId) {
  return Object.hasOwn(ACTIONS, actionId);
}

export function runWebAction(projectRoot, actionId) {
  if (!canRunAction(actionId)) {
    return Promise.resolve({
      ok: false,
      exitCode: 1,
      stdout: '',
      stderr: `Acao nao permitida: ${actionId}`,
    });
  }

  const args = [CLI_PATH, ...ACTIONS[actionId]];

  return new Promise(resolveResult => {
    const child = spawn(process.execPath, args, {
      cwd: resolve(projectRoot),
      env: { ...process.env, NO_COLOR: '1' },
      windowsHide: true,
    });

    let stdout = '';
    let stderr = '';
    let completed = false;

    const timer = setTimeout(() => {
      if (completed) return;
      child.kill();
      completed = true;
      resolveResult({
        ok: false,
        exitCode: 124,
        stdout,
        stderr: `${stderr}\nTempo limite excedido.`,
      });
    }, ACTION_TIMEOUT_MS);

    child.stdout.on('data', chunk => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', chunk => {
      stderr += chunk.toString();
    });

    child.on('error', error => {
      if (completed) return;
      clearTimeout(timer);
      completed = true;
      resolveResult({
        ok: false,
        exitCode: 1,
        stdout,
        stderr: error.message,
      });
    });

    child.on('close', exitCode => {
      if (completed) return;
      clearTimeout(timer);
      completed = true;
      resolveResult({
        ok: exitCode === 0,
        exitCode,
        stdout,
        stderr,
      });
    });
  });
}
