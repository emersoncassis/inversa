import { existsSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { readJsonSafe } from '../utils/json-safe.js';
import { workflowPhases } from './catalog.js';

const PHASE_IDS = workflowPhases.map(phase => phase.id);
const PHASE_SET = new Set(PHASE_IDS);

export function startWorkflowPhase(projectRoot, phaseId) {
  const { state, statePath } = readWorkflowState(projectRoot);
  assertPhase(phaseId);

  if (state.completed.includes(phaseId)) {
    return writeWorkflowState(statePath, state);
  }

  state.phase = phaseId;
  state.pending = PHASE_IDS.filter(id => !state.completed.includes(id) && id !== phaseId);
  ensureCheckpoint(state, phaseId).started_at = new Date().toISOString();
  ensureCheckpoint(state, phaseId).source = 'web';

  return writeWorkflowState(statePath, state);
}

export function completeWorkflowPhase(projectRoot, phaseId) {
  const { state, statePath } = readWorkflowState(projectRoot);
  assertPhase(phaseId);

  if (!state.completed.includes(phaseId)) {
    state.completed.push(phaseId);
  }

  const nextPhaseId = PHASE_IDS.find(id => !state.completed.includes(id));
  state.phase = nextPhaseId ?? null;
  state.pending = PHASE_IDS.filter(id => !state.completed.includes(id) && id !== nextPhaseId);

  const checkpoint = ensureCheckpoint(state, phaseId);
  checkpoint.completed_at = new Date().toISOString();
  checkpoint.source = 'web';
  if (nextPhaseId) {
    ensureCheckpoint(state, nextPhaseId).started_at ??= new Date().toISOString();
    ensureCheckpoint(state, nextPhaseId).source = 'web';
  }

  return writeWorkflowState(statePath, state);
}

export function activateFirstWorkflowPhase(projectRoot) {
  const { state, statePath } = readWorkflowState(projectRoot);

  if (!state.phase && state.completed.length === 0) {
    state.phase = PHASE_IDS[0];
    state.pending = PHASE_IDS.slice(1);
    ensureCheckpoint(state, PHASE_IDS[0]).started_at = new Date().toISOString();
    ensureCheckpoint(state, PHASE_IDS[0]).source = 'web';
    return writeWorkflowState(statePath, state);
  }

  return state;
}

function readWorkflowState(projectRoot) {
  const statePath = join(resolve(projectRoot), '.reversa', 'state.json');
  if (!existsSync(statePath)) {
    throw new Error('Instale o Inversa antes de avancar no fluxo.');
  }

  const state = readJsonSafe(statePath);
  state.completed = Array.isArray(state.completed)
    ? state.completed.filter(id => PHASE_SET.has(id))
    : [];
  state.pending = Array.isArray(state.pending)
    ? state.pending.filter(id => PHASE_SET.has(id))
    : PHASE_IDS.filter(id => !state.completed.includes(id));
  state.checkpoints = state.checkpoints && typeof state.checkpoints === 'object'
    ? state.checkpoints
    : {};

  return { state, statePath };
}

function writeWorkflowState(statePath, state) {
  writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');
  return state;
}

function assertPhase(phaseId) {
  if (!PHASE_SET.has(phaseId)) {
    throw new Error(`Fase invalida: ${phaseId}`);
  }
}

function ensureCheckpoint(state, phaseId) {
  state.checkpoints[phaseId] ??= {};
  return state.checkpoints[phaseId];
}
