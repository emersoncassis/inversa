import { spawn } from 'child_process';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const CLI_PATH = join(REPO_ROOT, 'bin', 'reversa.js');
const TERMINAL_TIMEOUT_MS = 120_000;
const MAX_OUTPUT_LENGTH = 60_000;

export function runReversaTerminalCommand(projectRoot, rawCommand) {
  const parsed = parseReversaCommand(rawCommand);
  if (!parsed.ok) {
    return Promise.resolve({
      ok: false,
      exitCode: 2,
      stdout: '',
      stderr: parsed.error,
      command: rawCommand,
    });
  }

  return runCli(projectRoot, parsed.args, rawCommand);
}

function parseReversaCommand(rawCommand) {
  const command = String(rawCommand ?? '').trim();

  if (!command) {
    return { ok: false, error: 'Digite um comando reversa.' };
  }

  if (/[\0\r\n]/.test(command)) {
    return { ok: false, error: 'Comando invalido.' };
  }

  if (command.length > 240) {
    return { ok: false, error: 'Comando muito longo.' };
  }

  let tokens;
  try {
    tokens = tokenize(command);
  } catch (error) {
    return { ok: false, error: error.message };
  }

  if (tokens[0] === 'npx' && tokens[1] === 'reversa') {
    tokens = tokens.slice(1);
  }

  if (tokens[0] !== 'reversa') {
    return { ok: false, error: 'Apenas comandos reversa sao permitidos.' };
  }

  return { ok: true, args: tokens.slice(1) };
}

function tokenize(command) {
  const tokens = [];
  let current = '';
  let quote = null;

  for (let index = 0; index < command.length; index++) {
    const char = command[index];

    if (quote) {
      if (char === quote) {
        quote = null;
      } else {
        current += char;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (/\s/.test(char)) {
      if (current) {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    current += char;
  }

  if (quote) throw new Error('Aspas nao fechadas.');
  if (current) tokens.push(current);
  return tokens;
}

function runCli(projectRoot, args, command) {
  return new Promise(resolveResult => {
    const child = spawn(process.execPath, [CLI_PATH, ...args], {
      cwd: resolve(projectRoot),
      env: {
        ...process.env,
        NO_COLOR: '1',
        CI: '1',
      },
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
        stdout: trimOutput(stdout),
        stderr: trimOutput(`${stderr}\nTempo limite excedido.`),
        command,
      });
    }, TERMINAL_TIMEOUT_MS);

    child.stdout.on('data', chunk => {
      stdout = trimOutput(stdout + chunk.toString());
    });

    child.stderr.on('data', chunk => {
      stderr = trimOutput(stderr + chunk.toString());
    });

    child.on('error', error => {
      if (completed) return;
      clearTimeout(timer);
      completed = true;
      resolveResult({
        ok: false,
        exitCode: 1,
        stdout: trimOutput(stdout),
        stderr: error.message,
        command,
      });
    });

    child.on('close', exitCode => {
      if (completed) return;
      clearTimeout(timer);
      completed = true;
      resolveResult({
        ok: exitCode === 0,
        exitCode,
        stdout: trimOutput(stdout),
        stderr: trimOutput(stderr),
        command,
      });
    });
  });
}

function trimOutput(output) {
  if (output.length <= MAX_OUTPUT_LENGTH) return output;
  return output.slice(output.length - MAX_OUTPUT_LENGTH);
}
