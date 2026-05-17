import { execFileSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import semver from 'semver';
import { checkExistingInstallation } from '../installer/validator.js';
import { readJsonSafe } from '../utils/json-safe.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const PACKAGE_PATH = join(REPO_ROOT, 'package.json');
const MIN_SUPPORTED_REVERSA = '1.2.0';
const MAX_SUPPORTED_REVERSA = '2.0.0';
export const SUPPORTED_REVERSA_RANGE = `>=${MIN_SUPPORTED_REVERSA} <${MAX_SUPPORTED_REVERSA}`;

export function getCompatibilityReport(projectRoot, bundledVersion = readBundledVersion()) {
  const root = resolve(projectRoot);
  const installation = checkExistingInstallation(root);
  const installedVersion = installation.version ?? null;
  const cliVersion = detectSystemReversaVersion();
  const projectCompatible = !installation.installed || isCompatibleVersion(installedVersion);
  const bundledCompatible = isCompatibleVersion(bundledVersion);
  const cliCompatible = !cliVersion || isCompatibleVersion(cliVersion);
  const ok = projectCompatible && bundledCompatible && cliCompatible;

  return {
    ok,
    supportedRange: SUPPORTED_REVERSA_RANGE,
    bundled: {
      version: bundledVersion,
      compatible: bundledCompatible,
      source: 'inversa-package',
    },
    project: {
      installed: installation.installed,
      version: installedVersion,
      compatible: projectCompatible,
      statePath: join(root, '.reversa', 'state.json'),
    },
    systemCli: {
      installed: Boolean(cliVersion),
      version: cliVersion,
      compatible: cliCompatible,
    },
    node: {
      version: process.version,
      compatible: isNodeCompatible(),
    },
    checks: [
      buildCheck('Pacote Inversa/Reversa', bundledCompatible, bundledVersion || 'versao nao detectada'),
      buildCheck(
        'Projeto local',
        projectCompatible,
        installation.installed ? `Reversa ${installedVersion}` : 'sem instalacao local'
      ),
      buildCheck('CLI do sistema', cliCompatible, cliVersion ? `reversa ${cliVersion}` : 'nao encontrado no PATH'),
      buildCheck('Node.js', isNodeCompatible(), process.version),
    ],
  };
}

export function assertCompatibleForInstall(projectRoot, bundledVersion) {
  const report = getCompatibilityReport(projectRoot, bundledVersion);
  if (!report.ok) {
    const failed = report.checks
      .filter(check => !check.ok)
      .map(check => `${check.label}: ${check.detail}`)
      .join('; ');
    throw new Error(`Compatibilidade Reversa invalida. ${failed}`);
  }
  return report;
}

function isCompatibleVersion(version) {
  if (!version || !semver.valid(version)) return false;
  return semver.satisfies(version, SUPPORTED_REVERSA_RANGE);
}

function isNodeCompatible() {
  const pkg = readJsonSafe(PACKAGE_PATH);
  const range = pkg.engines?.node;
  if (!range) return true;
  return semver.satisfies(process.version, range);
}

function detectSystemReversaVersion() {
  const candidates = process.platform === 'win32'
    ? ['reversa.cmd', 'reversa']
    : ['reversa'];

  for (const command of candidates) {
    try {
      const output = execFileSync(command, ['--version'], {
        cwd: REPO_ROOT,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
        timeout: 5000,
        windowsHide: true,
      }).trim();
      if (semver.valid(output)) return output;
    } catch {
      // Missing global CLI is not a failure; the bundled CLI remains available.
    }
  }

  return null;
}

function readBundledVersion() {
  if (!existsSync(PACKAGE_PATH)) return '0.0.0';
  return JSON.parse(readFileSync(PACKAGE_PATH, 'utf8')).version ?? '0.0.0';
}

function buildCheck(label, ok, detail) {
  return {
    label,
    ok,
    detail,
  };
}
