import { existsSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { ENGINES } from '../installer/detector.js';
import { Writer } from '../installer/writer.js';
import { buildManifest, loadManifest, saveManifest } from '../installer/manifest.js';
import { checkExistingInstallation } from '../installer/validator.js';
import { readJsonSafe } from '../utils/json-safe.js';
import { resolveSelectedAgents } from './catalog.js';
import { assertCompatibleForInstall } from './compatibility.js';

const ENGINE_IDS = new Set(ENGINES.map(engine => engine.id));
const GIT_STRATEGIES = new Set(['commit', 'gitignore']);
const ANSWER_MODES = new Set(['chat', 'file']);
const OUTPUT_FOLDER_PATTERN = /^[a-zA-Z0-9._-]+$/;

export async function installFromWeb(projectRoot, payload, version) {
  const root = resolve(projectRoot);
  const existing = checkExistingInstallation(root);
  let compatibility;

  try {
    compatibility = assertCompatibleForInstall(root, version);
  } catch (error) {
    return {
      ok: false,
      status: 409,
      error: error.message,
    };
  }

  if (existing.installed && !payload.reinstall) {
    return {
      ok: true,
      status: 200,
      data: {
        attached: true,
        project: existing.state?.project || root.split(/[\\/]/).pop(),
        version: existing.version,
        compatibility,
      },
    };
  }

  const answers = normalizeInstallPayload(root, payload);
  const selectedEngines = ENGINES.filter(engine => answers.engines.includes(engine.id));
  const writer = new Writer(root);

  for (const agent of answers.agents) {
    for (const engine of selectedEngines) {
      await writer.installSkill(agent, engine.skillsDir);
      if (engine.universalSkillsDir && engine.universalSkillsDir !== engine.skillsDir) {
        await writer.installSkill(agent, engine.universalSkillsDir);
      }
    }
  }

  const seenEntryFiles = new Set();
  for (const engine of selectedEngines) {
    if (!engine.entryFile || seenEntryFiles.has(engine.entryFile)) continue;
    seenEntryFiles.add(engine.entryFile);
    await writer.installEntryFile(engine, {
      conflictStrategy: answers.entry_conflict_strategy,
    });
  }

  writer.createReversaDir(answers, version);
  activateInitialPhase(root);

  if (existing.installed) {
    updateExistingState(root, answers);
  }

  if (answers.git_strategy === 'gitignore') {
    writer.updateGitignore(answers.output_folder);
  }

  writer.saveCreatedFiles();

  const existingManifest = existing.installed ? loadManifest(root) : {};
  const newManifest = buildManifest(root, writer.manifestPaths);
  saveManifest(root, { ...existingManifest, ...newManifest });

  return {
    ok: true,
    status: 200,
    data: {
      project: answers.project_name,
      engines: selectedEngines.map(engine => engine.name),
      agents: answers.agents.length,
      outputFolder: answers.output_folder,
      compatibility,
    },
  };
}

function normalizeInstallPayload(projectRoot, payload) {
  const engines = Array.isArray(payload.engines)
    ? payload.engines.filter(engineId => ENGINE_IDS.has(engineId))
    : [];

  if (engines.length === 0) {
    throw new Error('Selecione pelo menos uma engine.');
  }

  const projectName = cleanRequired(payload.projectName, 'Nome do projeto');
  const userName = cleanRequired(payload.userName, 'Nome do usuario');
  const outputFolder = String(payload.outputFolder || '_reversa_sdd').trim();

  if (!OUTPUT_FOLDER_PATTERN.test(outputFolder)) {
    throw new Error('Pasta de saida invalida. Use apenas letras, numeros, ponto, hifen e underline.');
  }

  const gitStrategy = GIT_STRATEGIES.has(payload.gitStrategy) ? payload.gitStrategy : 'commit';
  const answerMode = ANSWER_MODES.has(payload.answerMode) ? payload.answerMode : 'chat';
  const selectedTeams = Array.isArray(payload.teams) ? payload.teams : [];

  return {
    engines,
    teams: ['discovery', ...selectedTeams.filter(team => team !== 'discovery')],
    agents: resolveSelectedAgents(selectedTeams),
    project_name: projectName || projectRoot.split(/[\\/]/).pop(),
    user_name: userName,
    chat_language: String(payload.chatLanguage || 'pt-br').trim() || 'pt-br',
    doc_language: String(payload.docLanguage || 'Portugues').trim() || 'Portugues',
    output_folder: outputFolder,
    git_strategy: gitStrategy,
    answer_mode: answerMode,
    entry_conflict_strategy: payload.entryConflictStrategy === 'merge' ? 'merge' : 'skip',
  };
}

function cleanRequired(value, label) {
  const clean = String(value ?? '').trim();
  if (!clean) throw new Error(`${label} e obrigatorio.`);
  return clean;
}

function updateExistingState(projectRoot, answers) {
  const statePath = join(projectRoot, '.reversa', 'state.json');
  if (!existsSync(statePath)) return;

  const state = readJsonSafe(statePath);
  state.engines = answers.engines;
  state.agents = answers.agents;
  state.answer_mode = answers.answer_mode;
  state.output_folder = answers.output_folder;
  if (!state.phase) state.phase = 'reconhecimento';
  writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');
}

function activateInitialPhase(projectRoot) {
  const statePath = join(projectRoot, '.reversa', 'state.json');
  if (!existsSync(statePath)) return;

  const state = readJsonSafe(statePath);
  if (state.phase) return;

  state.phase = 'reconhecimento';
  writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');
}
