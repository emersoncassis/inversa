import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { detectEngines } from '../installer/detector.js';
import { checkExistingInstallation } from '../installer/validator.js';
import { agentTeams, webActions, workflowPhases } from './catalog.js';
import { getCompatibilityReport } from './compatibility.js';

const DEFAULT_OUTPUT_FOLDER = '_reversa_sdd';

export function getDashboardState(projectRoot) {
  const root = resolve(projectRoot);
  const installation = checkExistingInstallation(root);
  const state = installation.installed ? installation.state : null;
  const outputFolder = state?.output_folder || DEFAULT_OUTPUT_FOLDER;
  const outputPath = join(root, outputFolder);
  const outputExists = existsSync(outputPath);
  const compatibility = getCompatibilityReport(root);
  const artifactStats = outputExists ? collectArtifactStats(outputPath) : emptyArtifactStats();
  const detectedEngines = detectEngines(root);
  const installedEngineIds = new Set(state?.engines ?? []);
  const installedAgents = state?.agents ?? [];
  const phases = resolvePhases(state);
  const maturity = calculateMaturity({
    installed: installation.installed,
    installedEngines: installedEngineIds.size,
    installedAgents: installedAgents.length,
    artifactStats,
    phases,
  });
  const gamification = calculateGamification({
    installed: installation.installed,
    installedEngines: installedEngineIds.size,
    installedAgents: installedAgents.length,
    artifactStats,
    phases,
  });

  return {
    projectRoot: root,
    installed: installation.installed,
    version: installation.version ?? null,
    project: state?.project || root.split(/[\\/]/).pop(),
    userName: state?.user_name || null,
    outputFolder,
    outputExists,
    compatibility,
    artifactStats,
    engines: detectedEngines.map(engine => ({
      id: engine.id,
      name: engine.name,
      detected: engine.detected,
      installed: installedEngineIds.has(engine.id),
      recommended: Boolean(engine.star),
    })),
    agents: {
      installed: installedAgents,
      count: installedAgents.length,
      teams: agentTeams.map(team => ({
        id: team.id,
        title: team.title,
        description: team.description,
        required: Boolean(team.required),
        installed: team.agents.some(agent => installedAgents.includes(agent)),
        installedCount: team.agents.filter(agent => installedAgents.includes(agent)).length,
        totalCount: team.agents.length,
      })),
    },
    workflow: {
      currentPhase: state?.phase ?? null,
      phases,
      completedCount: phases.filter(phase => phase.status === 'completed').length,
      totalCount: phases.length,
    },
    maturity,
    gamification,
    nextAction: resolveNextAction({ installation, state, outputExists, artifactStats, phases }),
    actions: webActions,
  };
}

export function getInstallOptions(projectRoot) {
  const root = resolve(projectRoot);
  return {
    projectRoot: root,
    projectName: root.split(/[\\/]/).pop(),
    compatibility: getCompatibilityReport(root),
    engines: detectEngines(root).map(engine => ({
      id: engine.id,
      name: engine.name,
      detected: engine.detected,
      recommended: Boolean(engine.star),
    })),
    teams: agentTeams,
    defaults: {
      chatLanguage: 'pt-br',
      docLanguage: 'Portugues',
      outputFolder: DEFAULT_OUTPUT_FOLDER,
      gitStrategy: 'commit',
      answerMode: 'chat',
    },
  };
}

function resolvePhases(state) {
  const completed = new Set(state?.completed ?? []);
  const pending = new Set(state?.pending ?? workflowPhases.map(phase => phase.id));
  const currentPhase = state?.phase ?? null;

  return workflowPhases.map(phase => {
    let status = 'idle';

    if (completed.has(phase.id)) {
      status = 'completed';
    } else if (currentPhase === phase.id) {
      status = 'active';
    } else if (pending.has(phase.id)) {
      status = 'pending';
    }

    return { ...phase, status };
  });
}

function calculateMaturity({ installed, installedEngines, installedAgents, artifactStats, phases }) {
  if (!installed) {
    return {
      score: 0,
      label: 'Nao instalado',
      items: [
        { label: 'Instalacao', score: 0 },
        { label: 'Engines', score: 0 },
        { label: 'Agentes', score: 0 },
        { label: 'Artefatos', score: 0 },
        { label: 'Workflow', score: 0 },
      ],
    };
  }

  const workflowScore = Math.round((phases.filter(phase => phase.status === 'completed').length / phases.length) * 100);
  const items = [
    { label: 'Instalacao', score: 100 },
    { label: 'Engines', score: Math.min(100, installedEngines * 50) },
    { label: 'Agentes', score: Math.min(100, Math.round((installedAgents / 8) * 100)) },
    { label: 'Artefatos', score: Math.min(100, artifactStats.markdownFiles * 10 + artifactStats.mermaidBlocks * 5) },
    { label: 'Workflow', score: workflowScore },
  ];
  const score = Math.round(items.reduce((sum, item) => sum + item.score, 0) / items.length);

  return {
    score,
    label: score >= 75 ? 'Avancado' : score >= 45 ? 'Em evolucao' : 'Inicial',
    items,
  };
}

function resolveNextAction({ installation, state, outputExists, artifactStats, phases }) {
  if (!installation.installed) {
    return {
      title: 'Instalar Inversa neste projeto',
      description: 'Verifique compatibilidade, acople ao Reversa e configure engines, times e saida.',
      action: 'install',
    };
  }

  const activePhase = phases.find(phase => phase.status === 'active');
  if (activePhase) {
    return {
      title: `Continuar ${activePhase.title}`,
      description: `Abra o agente configurado e execute o fluxo ${state?.phase}.`,
      action: 'continue-agent',
    };
  }

  if (!outputExists || artifactStats.markdownFiles === 0) {
    return {
      title: 'Executar analise com agente',
      description: 'Use o comando reversa no agente de IA configurado para gerar os artefatos.',
      action: 'run-agent',
    };
  }

  return {
    title: 'Revisar resultados',
    description: 'Explore artefatos, lacunas e diagramas gerados no SDD.',
    action: 'review',
  };
}

function calculateGamification({ installed, installedEngines, installedAgents, artifactStats, phases }) {
  const completedPhases = phases.filter(phase => phase.status === 'completed').length;
  const xp =
    (installed ? 100 : 0) +
    installedEngines * 40 +
    installedAgents * 12 +
    completedPhases * 120 +
    artifactStats.markdownFiles * 6 +
    artifactStats.mermaidBlocks * 10;
  const level = Math.max(1, Math.floor(xp / 250) + 1);
  const currentLevelXp = (level - 1) * 250;
  const nextLevelXp = level * 250;

  return {
    xp,
    level,
    currentLevelXp,
    nextLevelXp,
    progress: Math.min(100, Math.round(((xp - currentLevelXp) / 250) * 100)),
    title: resolveRank(level),
    badges: [
      {
        id: 'first-setup',
        title: 'Base montada',
        unlocked: installed,
      },
      {
        id: 'engine-ready',
        title: 'Engine ativa',
        unlocked: installedEngines > 0,
      },
      {
        id: 'squad-ready',
        title: 'Squad instalado',
        unlocked: installedAgents >= 5,
      },
      {
        id: 'first-artifacts',
        title: 'Primeiros artefatos',
        unlocked: artifactStats.markdownFiles > 0,
      },
      {
        id: 'diagram-maker',
        title: 'Diagramador',
        unlocked: artifactStats.mermaidBlocks > 0,
      },
      {
        id: 'review-cycle',
        title: 'Ciclo revisado',
        unlocked: completedPhases >= phases.length,
      },
    ],
  };
}

function resolveRank(level) {
  if (level >= 8) return 'Arquiteto de Specs';
  if (level >= 5) return 'Explorador Senior';
  if (level >= 3) return 'Analista de Fluxos';
  return 'Aprendiz de Reversa';
}

function collectArtifactStats(root) {
  const stats = emptyArtifactStats();
  walk(root, filePath => {
    stats.totalFiles += 1;
    if (filePath.endsWith('.md')) {
      stats.markdownFiles += 1;
      const content = readFileSync(filePath, 'utf8');
      stats.mermaidBlocks += (content.match(/```mermaid/g) ?? []).length;
      if (/GAP|lacuna|pendente/i.test(content)) stats.filesWithGaps += 1;
    }
  });
  return stats;
}

function emptyArtifactStats() {
  return {
    totalFiles: 0,
    markdownFiles: 0,
    mermaidBlocks: 0,
    filesWithGaps: 0,
  };
}

function walk(dir, onFile) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath, onFile);
    } else {
      onFile(fullPath);
    }
  }
}
