const state = {
  dashboard: null,
  installOptions: null,
};

const els = {
  refreshButton: document.querySelector('#refreshButton'),
  menuItems: [...document.querySelectorAll('.menu-item')],
  screens: [...document.querySelectorAll('.screen')],
  installStatus: document.querySelector('#installStatus'),
  projectName: document.querySelector('#projectName'),
  projectRoot: document.querySelector('#projectRoot'),
  outputFolder: document.querySelector('#outputFolder'),
  playerRank: document.querySelector('#playerRank'),
  playerLevel: document.querySelector('#playerLevel'),
  xpFill: document.querySelector('#xpFill'),
  playerXp: document.querySelector('#playerXp'),
  scoreRing: document.querySelector('#scoreRing'),
  maturityScore: document.querySelector('#maturityScore'),
  maturityLabel: document.querySelector('#maturityLabel'),
  meterList: document.querySelector('#meterList'),
  nextTitle: document.querySelector('#nextTitle'),
  nextDescription: document.querySelector('#nextDescription'),
  phaseCount: document.querySelector('#phaseCount'),
  workflowTrack: document.querySelector('#workflowTrack'),
  badgeGrid: document.querySelector('#badgeGrid'),
  dependencyList: document.querySelector('#dependencyList'),
  dependencyBubble: document.querySelector('#dependencyBubble'),
  installForm: document.querySelector('#installForm'),
  setupCompatibility: document.querySelector('#setupCompatibility'),
  projectNameInput: document.querySelector('#projectNameInput'),
  userNameInput: document.querySelector('#userNameInput'),
  chatLanguageInput: document.querySelector('#chatLanguageInput'),
  docLanguageInput: document.querySelector('#docLanguageInput'),
  outputFolderInput: document.querySelector('#outputFolderInput'),
  gitStrategyInput: document.querySelector('#gitStrategyInput'),
  answerModeInput: document.querySelector('#answerModeInput'),
  engineChoices: document.querySelector('#engineChoices'),
  teamChoices: document.querySelector('#teamChoices'),
  actionList: document.querySelector('#actionList'),
  terminalForm: document.querySelector('#terminalForm'),
  terminalCommand: document.querySelector('#terminalCommand'),
  terminalOutput: document.querySelector('#terminalOutput'),
  artifactGrid: document.querySelector('#artifactGrid'),
  agentTeamGrid: document.querySelector('#agentTeamGrid'),
  systemGrid: document.querySelector('#systemGrid'),
  phaseStep: document.querySelector('#phaseStep'),
  phaseTitle: document.querySelector('#phaseTitle'),
  phaseFocus: document.querySelector('#phaseFocus'),
  phaseStatus: document.querySelector('#phaseStatus'),
  phaseAgent: document.querySelector('#phaseAgent'),
  phaseDescription: document.querySelector('#phaseDescription'),
  phaseInputs: document.querySelector('#phaseInputs'),
  phaseActions: document.querySelector('#phaseActions'),
  phaseOutputs: document.querySelector('#phaseOutputs'),
  phaseDoneCriteria: document.querySelector('#phaseDoneCriteria'),
  accessUrl: document.querySelector('#accessUrl'),
};

els.refreshButton.addEventListener('click', refresh);
els.installForm.addEventListener('submit', installReversa);
els.terminalForm.addEventListener('submit', runTerminalCommand);
els.menuItems.forEach(item => {
  item.addEventListener('click', () => {
    if (item.dataset.phaseId) {
      renderPhaseDetail(item.dataset.phaseId);
    }
    activateScreen(item.dataset.screen, item.dataset.phaseId);
  });
});

await bootstrap();

async function bootstrap() {
  const [dashboard, installOptions] = await Promise.all([
    getJson('/api/state'),
    getJson('/api/install-options'),
  ]);

  state.dashboard = dashboard;
  state.installOptions = installOptions;
  fillInstallDefaults();
  renderAccessUrl();
  render();
}

async function refresh() {
  els.refreshButton.disabled = true;
  try {
    state.dashboard = await getJson('/api/state');
    render();
  } finally {
    els.refreshButton.disabled = false;
  }
}

function activateScreen(screenId, phaseId = null) {
  els.menuItems.forEach(item => {
    const sameScreen = item.dataset.screen === screenId;
    const samePhase = !phaseId || item.dataset.phaseId === phaseId;
    item.classList.toggle('active', sameScreen && samePhase);
  });
  els.screens.forEach(screen => {
    screen.classList.toggle('active', screen.id === `screen-${screenId}`);
  });
}

function render() {
  const data = state.dashboard;
  els.installStatus.textContent = data.installed ? `Instalado v${data.version}` : 'Nao instalado';
  els.projectName.textContent = data.project;
  els.projectRoot.textContent = data.projectRoot;
  els.outputFolder.textContent = data.outputFolder;
  els.nextTitle.textContent = data.nextAction.title;
  els.nextDescription.textContent = data.nextAction.description;

  renderPlayer(data.gamification);
  renderMaturity(data.maturity);
  renderWorkflow(data.workflow);
  renderStepNavigation(data.workflow.phases);
  renderPhaseDetail(data.workflow.currentPhase || data.workflow.phases[0]?.id);
  renderDependencies(data.workflow.phases, data.workflow.phases[0]?.id);
  renderBadges(data.gamification.badges);
  renderActions(data.actions);
  renderArtifacts(data.artifactStats);
  renderAgentTeams(data.agents.teams);
  renderCompatibility(data.compatibility);
  renderSystem(data.compatibility);
  syncInstallState(data.installed);
}

function renderAccessUrl() {
  if (!els.accessUrl) return;
  els.accessUrl.href = window.location.href;
  els.accessUrl.textContent = window.location.href;
}

function renderStepNavigation(phases) {
  els.menuItems.forEach(item => {
    if (!item.dataset.phaseId) return;
    const phase = phases.find(candidate => candidate.id === item.dataset.phaseId);
    if (!phase) return;
    item.dataset.status = phase.status;
  });
}

function renderPlayer(gamification) {
  els.playerRank.textContent = gamification.title;
  els.playerLevel.textContent = `Nivel ${gamification.level}`;
  els.xpFill.style.setProperty('--fill', `${gamification.progress}%`);
  els.playerXp.textContent = `${gamification.xp} XP`;
}

function renderMaturity(maturity) {
  const angle = Math.round((maturity.score / 100) * 360);
  els.scoreRing.style.setProperty('--score-angle', `${angle}deg`);
  els.maturityScore.textContent = `${maturity.score}%`;
  els.maturityLabel.textContent = maturity.label;
  els.meterList.replaceChildren(...maturity.items.map(item => {
    const row = document.createElement('div');
    row.className = 'meter';
    row.innerHTML = `
      <span>${escapeHtml(item.label)}</span>
      <span class="meter-track"><span class="meter-fill" style="--meter-width:${item.score}%"></span></span>
      <span>${item.score}%</span>
    `;
    return row;
  }));
}

function renderWorkflow(workflow) {
  els.phaseCount.textContent = `${workflow.completedCount}/${workflow.totalCount}`;
  els.workflowTrack.replaceChildren(...workflow.phases.map((phase, index) => {
    const card = document.createElement('button');
    card.className = 'phase-card';
    card.type = 'button';
    card.dataset.status = phase.status;
    card.dataset.phaseId = phase.id;
    card.innerHTML = `
      <div class="phase-dot">${index + 1}</div>
      <h3>${escapeHtml(phase.title)}</h3>
      <strong>${escapeHtml(phase.agent)}</strong>
      <p>${escapeHtml(phase.description)}</p>
    `;
    card.addEventListener('click', () => openPhaseStep(phase.id));
    return card;
  }));
}

function renderPhaseDetail(phaseId) {
  const phase = state.dashboard?.workflow.phases.find(item => item.id === phaseId);
  if (!phase || !els.phaseTitle) return;

  els.phaseStep.textContent = `Passo ${phase.step}`;
  els.phaseTitle.textContent = phase.title;
  els.phaseFocus.textContent = phase.focus;
  els.phaseStatus.textContent = statusLabel(phase.status);
  els.phaseStatus.dataset.status = phase.status;
  els.phaseAgent.textContent = phase.agent;
  els.phaseDescription.textContent = phase.description;
  els.phaseInputs.replaceChildren(...phase.inputs.map(renderStepListItem));
  els.phaseActions.replaceChildren(...phase.actions.map(renderStepListItem));
  els.phaseOutputs.replaceChildren(...phase.outputs.map(renderStepListItem));
  els.phaseDoneCriteria.textContent = phase.doneCriteria;
}

function renderStepListItem(text) {
  const item = document.createElement('li');
  item.textContent = text;
  return item;
}

function renderDependencies(phases, selectedPhaseId) {
  const selected = phases.find(phase => phase.id === selectedPhaseId) || phases[0];
  if (!selected) return;

  els.dependencyList.replaceChildren(...phases.map((phase, index) => {
    const button = document.createElement('button');
    button.className = 'dependency-step';
    button.type = 'button';
    button.dataset.active = String(phase.id === selected.id);
    button.innerHTML = `
      <span>${index + 1}</span>
      <strong>${escapeHtml(phase.title)}</strong>
    `;
    button.addEventListener('click', () => renderDependencies(phases, phase.id));
    return button;
  }));

  const dependency = selected.dependency;
  els.dependencyBubble.innerHTML = `
    <p class="eyebrow">${escapeHtml(selected.title)}</p>
    <h2>${escapeHtml(dependency.title)}</h2>
    <div class="bubble-section">
      <strong>Por que e necessario</strong>
      <p>${escapeHtml(dependency.why)}</p>
    </div>
    <div class="bubble-section">
      <strong>Importancia</strong>
      <p>${escapeHtml(dependency.importance)}</p>
    </div>
    <div class="bubble-section">
      <strong>O que desbloqueia</strong>
      <p>${escapeHtml(dependency.unlocks)}</p>
    </div>
  `;
}

function openDependencyPhase(phaseId) {
  renderDependencies(state.dashboard.workflow.phases, phaseId);
  openPhaseStep(phaseId);
}

function openPhaseStep(phaseId) {
  renderPhaseDetail(phaseId);
  activateScreen('phase', phaseId);
}

function renderBadges(badges) {
  els.badgeGrid.replaceChildren(...badges.map((badge, index) => {
    const item = document.createElement('div');
    item.className = 'badge';
    item.dataset.unlocked = String(badge.unlocked);
    item.innerHTML = `
      <span class="badge-icon">${badge.unlocked ? 'OK' : String(index + 1).padStart(2, '0')}</span>
      <span>${escapeHtml(badge.title)}</span>
    `;
    return item;
  }));
}

function renderActions(actions) {
  els.actionList.replaceChildren(...actions.map(action => {
    const button = document.createElement('button');
    button.className = 'command-button';
    button.type = 'button';
    button.innerHTML = `
      <span>
        <strong>${escapeHtml(action.title)}</strong>
        <span>${escapeHtml(action.description)}</span>
      </span>
      <span class="command-chip">Run</span>
    `;
    button.addEventListener('click', () => runAction(action.id, action.title));
    return button;
  }));
}

function renderArtifacts(stats) {
  const items = [
    ['Arquivos', stats.totalFiles],
    ['Markdown', stats.markdownFiles],
    ['Diagramas', stats.mermaidBlocks],
    ['Lacunas', stats.filesWithGaps],
  ];

  els.artifactGrid.replaceChildren(...items.map(([label, value]) => {
    const card = document.createElement('div');
    card.className = 'artifact-item';
    card.innerHTML = `
      <strong>${value}</strong>
      <span>${escapeHtml(label)}</span>
    `;
    return card;
  }));
}

function renderAgentTeams(teams) {
  els.agentTeamGrid.replaceChildren(...teams.map(team => {
    const percent = team.totalCount === 0 ? 0 : Math.round((team.installedCount / team.totalCount) * 100);
    const card = document.createElement('article');
    card.className = 'team-card';
    card.innerHTML = `
      <strong>${escapeHtml(team.title)}</strong>
      <p>${escapeHtml(team.description || '')}</p>
      <div class="team-progress">
        <span class="meter-track"><span class="meter-fill" style="--meter-width:${percent}%"></span></span>
        <span>${team.installedCount}/${team.totalCount}</span>
      </div>
    `;
    return card;
  }));
}

function renderCompatibility(compatibility) {
  const status = compatibility.ok ? 'Compativel' : 'Incompativel';
  els.setupCompatibility.innerHTML = `
    <div>
      <strong>Reversa ${escapeHtml(compatibility.bundled.version)}</strong>
      <span>Range suportado: ${escapeHtml(compatibility.supportedRange)}</span>
    </div>
    <span class="compat-status" data-ok="${compatibility.ok}">${status}</span>
  `;
}

function renderSystem(compatibility) {
  els.systemGrid.replaceChildren(...compatibility.checks.map(check => {
    const card = document.createElement('article');
    card.className = 'system-card';
    card.dataset.ok = String(check.ok);
    card.innerHTML = `
      <strong>${escapeHtml(check.label)}</strong>
      <p>${escapeHtml(check.detail)}</p>
      <span>${check.ok ? 'OK' : 'Revisar'}</span>
    `;
    return card;
  }));
}

function fillInstallDefaults() {
  const options = state.installOptions;
  els.projectNameInput.value = options.projectName;
  els.chatLanguageInput.value = options.defaults.chatLanguage;
  els.docLanguageInput.value = options.defaults.docLanguage;
  els.outputFolderInput.value = options.defaults.outputFolder;
  els.gitStrategyInput.value = options.defaults.gitStrategy;
  els.answerModeInput.value = options.defaults.answerMode;

  els.engineChoices.replaceChildren(...options.engines.map(engine => {
    const label = document.createElement('label');
    const checked = engine.detected || engine.recommended;
    label.className = 'choice engine-choice';
    label.dataset.selected = String(checked);
    label.innerHTML = `
      <input type="checkbox" name="engines" value="${escapeAttribute(engine.id)}" ${checked ? 'checked' : ''}>
      <span>
        ${escapeHtml(engine.name)}
        <small>${engine.detected ? 'Detectada' : engine.recommended ? 'Recomendada' : 'Opcional'}</small>
      </span>
    `;
    label.querySelector('input').addEventListener('change', event => {
      label.dataset.selected = String(event.currentTarget.checked);
    });
    return label;
  }));

  els.teamChoices.replaceChildren(...options.teams.map(team => {
    const label = document.createElement('label');
    const checked = Boolean(team.required);
    label.className = 'choice selectable-choice';
    label.dataset.selected = String(checked);
    label.innerHTML = `
      <input type="checkbox" name="teams" value="${escapeAttribute(team.id)}" ${team.required ? 'checked disabled' : ''}>
      <span>
        ${escapeHtml(team.title)}
        <small>${escapeHtml(team.description)}</small>
      </span>
    `;
    label.querySelector('input').addEventListener('change', event => {
      label.dataset.selected = String(event.currentTarget.checked);
    });
    return label;
  }));
}

function syncInstallState(installed) {
  const button = els.installForm.querySelector('button[type="submit"]');
  if (!button) return;
  button.disabled = installed;
  button.textContent = installed ? 'Inversa acoplado' : 'Instalar Inversa';
}

function statusLabel(status) {
  if (status === 'completed') return 'Concluido';
  if (status === 'active') return 'Em andamento';
  if (status === 'pending') return 'Pendente';
  return 'Aguardando';
}

async function installReversa(event) {
  event.preventDefault();
  const submit = els.installForm.querySelector('button[type="submit"]');
  submit.disabled = true;
  setTerminal('Instalando Reversa...');

  try {
    const payload = {
      projectName: els.projectNameInput.value,
      userName: els.userNameInput.value,
      chatLanguage: els.chatLanguageInput.value,
      docLanguage: els.docLanguageInput.value,
      outputFolder: els.outputFolderInput.value,
      gitStrategy: els.gitStrategyInput.value,
      answerMode: els.answerModeInput.value,
      entryConflictStrategy: 'skip',
      engines: checkedValues('engines'),
      teams: checkedValues('teams'),
    };
    const result = await postJson('/api/install', payload);
    setTerminal(JSON.stringify(result, null, 2));
    await refresh();
    openPhaseStep('reconhecimento');
  } catch (error) {
    setTerminal(error.message);
  } finally {
    submit.disabled = false;
    syncInstallState(state.dashboard.installed);
  }
}

async function runAction(actionId, title) {
  setTerminal(`Executando: ${title}`);
  const buttons = [...els.actionList.querySelectorAll('button')];
  buttons.forEach(button => {
    button.disabled = true;
  });

  try {
    const result = await postJson(`/api/actions/${encodeURIComponent(actionId)}`, {});
    const output = [
      `exitCode: ${result.exitCode}`,
      '',
      result.stdout?.trim() || '(sem stdout)',
      result.stderr?.trim() ? `\nstderr:\n${result.stderr.trim()}` : '',
    ].join('\n');
    setTerminal(output);
    await refresh();
  } catch (error) {
    setTerminal(error.message);
  } finally {
    buttons.forEach(button => {
      button.disabled = false;
    });
  }
}

async function runTerminalCommand(event) {
  event.preventDefault();
  const command = els.terminalCommand.value.trim();

  if (command === 'clear') {
    setTerminal('');
    return;
  }

  setTerminal(`$ ${command}\n`);
  const submit = els.terminalForm.querySelector('button[type="submit"]');
  submit.disabled = true;

  try {
    const result = await postJson('/api/terminal', { command });
    const output = [
      `$ ${result.command}`,
      `exitCode: ${result.exitCode}`,
      '',
      result.stdout?.trim() || '(sem stdout)',
      result.stderr?.trim() ? `\nstderr:\n${result.stderr.trim()}` : '',
    ].join('\n');
    setTerminal(output);
    await refresh();
  } catch (error) {
    setTerminal(error.message);
  } finally {
    submit.disabled = false;
  }
}

function checkedValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(input => input.value);
}

async function getJson(url) {
  const response = await fetch(url);
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || `Falha HTTP ${response.status}`);
  return payload;
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || `Falha HTTP ${response.status}`);
  return payload;
}

function setTerminal(value) {
  els.terminalOutput.textContent = value;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('`', '&#096;');
}
