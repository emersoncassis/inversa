export const PLAYER_RANKS = [
  { minXp: 0, title: 'Aprendiz de Reversa' },
  { minXp: 250, title: 'Explorador de Codigo' },
  { minXp: 600, title: 'Analista de Fluxos' },
  { minXp: 1000, title: 'Cacador de Regras' },
  { minXp: 1500, title: 'Arquiteto de Specs' },
  { minXp: 2200, title: 'Mestre de Sistemas Legados' },
];

export const BASIC_MISSION_ID = 'basic-reversa-journey';

export const BASIC_MISSION = {
  id: BASIC_MISSION_ID,
  title: 'Concluir primeiro projeto basico',
  description: 'Aprender o fluxo do Reversa em uma jornada visual, guiada e gamificada.',
  goal: 'Concluir setup, reconhecimento, escavacao, interpretacao, geracao e revisao em um projeto basico.',
  rewardXp: 300,
  requiredPhases: ['reconhecimento', 'escavacao', 'interpretacao', 'geracao', 'revisao'],
};

const PHASE_XP = {
  reconhecimento: 100,
  escavacao: 120,
  interpretacao: 140,
  geracao: 160,
  revisao: 180,
};

export function ensureLearningState(state) {
  state.player ??= {};
  state.player.name ??= state.user_name || 'Player';
  state.player.xp ??= 0;
  state.player.level ??= levelFromXp(state.player.xp);
  state.player.rank ??= rankFromXp(state.player.xp);
  state.player.badges ??= [];
  state.player.completed_missions ??= [];

  state.learning ??= {};
  state.learning.mode ??= 'basic';
  state.learning.current_mission ??= BASIC_MISSION_ID;

  state.missions ??= {};
  state.missions[BASIC_MISSION_ID] ??= {
    id: BASIC_MISSION_ID,
    status: 'active',
    started_at: new Date().toISOString(),
    completed_at: null,
    completed_phases: [],
  };

  state.telemetry ??= {};
  state.telemetry.events ??= [];
  state.telemetry.provider ??= 'local-json';

  return state;
}

export function completeLearningPhase(state, phaseId) {
  ensureLearningState(state);

  const mission = state.missions[BASIC_MISSION_ID];
  mission.completed_phases ??= [];

  const alreadyCompleted = mission.completed_phases.includes(phaseId);
  const xp = alreadyCompleted ? 0 : (PHASE_XP[phaseId] ?? 50);

  if (!alreadyCompleted) {
    mission.completed_phases.push(phaseId);
    addXp(state, xp);
    addEvent(state, 'phase_completed', {
      phase: phaseId,
      xp,
      mission: BASIC_MISSION_ID,
    });
  }

  const missionCompleted = BASIC_MISSION.requiredPhases.every(id => mission.completed_phases.includes(id));
  if (missionCompleted && mission.status !== 'completed') {
    mission.status = 'completed';
    mission.completed_at = new Date().toISOString();
    addXp(state, BASIC_MISSION.rewardXp);
    unlockBadge(state, 'first-basic-project');
    state.player.completed_missions.push(BASIC_MISSION_ID);
    addEvent(state, 'mission_completed', {
      mission: BASIC_MISSION_ID,
      xp: BASIC_MISSION.rewardXp,
    });
  }

  return state;
}

export function startLearningPhase(state, phaseId) {
  ensureLearningState(state);
  addEvent(state, 'phase_started', {
    phase: phaseId,
    mission: BASIC_MISSION_ID,
  });
  return state;
}

export function buildLearningDashboard(state, phases) {
  const ensured = ensureLearningState(structuredCloneSafe(state ?? {}));
  const missionState = ensured.missions[BASIC_MISSION_ID];
  const completedPhases = new Set(missionState.completed_phases ?? []);
  const total = BASIC_MISSION.requiredPhases.length;
  const completed = BASIC_MISSION.requiredPhases.filter(id => completedPhases.has(id)).length;

  return {
    player: ensured.player,
    mission: {
      ...BASIC_MISSION,
      status: missionState.status,
      startedAt: missionState.started_at,
      completedAt: missionState.completed_at,
      completedPhases: [...completedPhases],
      completedCount: completed,
      totalCount: total,
      progress: total === 0 ? 0 : Math.round((completed / total) * 100),
      nextPhase: phases.find(phase => !completedPhases.has(phase.id))?.id ?? null,
    },
    telemetry: {
      provider: ensured.telemetry.provider,
      eventsCount: ensured.telemetry.events.length,
      recentEvents: ensured.telemetry.events.slice(-10).reverse(),
    },
  };
}

function addXp(state, xp) {
  state.player.xp += xp;
  state.player.level = levelFromXp(state.player.xp);
  state.player.rank = rankFromXp(state.player.xp);
}

function unlockBadge(state, badgeId) {
  if (!state.player.badges.includes(badgeId)) {
    state.player.badges.push(badgeId);
  }
}

function addEvent(state, name, attributes = {}) {
  state.telemetry.events.push({
    name,
    attributes,
    timestamp: new Date().toISOString(),
  });

  if (state.telemetry.events.length > 200) {
    state.telemetry.events = state.telemetry.events.slice(-200);
  }
}

function rankFromXp(xp) {
  return PLAYER_RANKS
    .filter(rank => xp >= rank.minXp)
    .at(-1)?.title ?? PLAYER_RANKS[0].title;
}

function levelFromXp(xp) {
  return Math.max(1, Math.floor(xp / 250) + 1);
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value));
}
