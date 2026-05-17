#!/usr/bin/env node

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';
import { clearTerminalForLogo, renderReversaLogo } from '../lib/utils/banner.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

const [,, command, ...args] = process.argv;

const commands = {
  install:            () => import('../lib/commands/install.js'),
  update:             () => import('../lib/commands/update.js'),
  status:             () => import('../lib/commands/status.js'),
  uninstall:          () => import('../lib/commands/uninstall.js'),
  'add-agent':        () => import('../lib/commands/add-agent.js'),
  'add-engine':       () => import('../lib/commands/add-engine.js'),
  'export-diagrams':  () => import('../lib/commands/export-diagrams.js'),
  web:                () => import('../lib/commands/web.js'),
};

if (!command || command === '--help' || command === '-h') {
  clearTerminalForLogo();
  console.log(renderReversaLogo(chalk) + `

  inversa v${pkg.version}

  Front-end gamificado para aprender Reversa com missoes, progresso e interface visual.
  O comando reversa continua disponivel por compatibilidade.

  Uso: npx inversa <comando>
       npx reversa <comando>

  Comandos:
    install            Instala o Inversa/Reversa no projeto atual
    update             Atualiza os agentes para a ultima versao
    status             Mostra o estado atual da analise
    uninstall          Remove arquivos criados pela ferramenta
    add-agent          Adiciona um agente ao projeto
    add-engine         Adiciona suporte a uma engine
    export-diagrams    Exporta diagramas Mermaid como imagens SVG/PNG
                       Opcoes: --format=svg|png  --output=<pasta>
                       Requer: npm install -g @mermaid-js/mermaid-cli
    web                Abre a experiencia visual gamificada
                       Opcoes: --port=17310 --host=127.0.0.1 --no-open

  Documentacao: https://github.com/emersoncassis/inversa
  Backend tecnico: https://github.com/sandeco/reversa
  `);
  process.exit(0);
}

if (command === '--version' || command === '-v') {
  console.log(pkg.version);
  process.exit(0);
}

if (!commands[command]) {
  console.error(`\n  Comando desconhecido: "${command}"`);
  console.error('  Execute "npx inversa --help" para ver os comandos disponiveis.\n');
  process.exit(1);
}

const mod = await commands[command]();
await mod.default(args);
