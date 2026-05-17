# GDD - Reversa Web

## 1. Visao geral

Reversa Web e a camada visual e gamificada do Reversa. Ela transforma o fluxo tecnico de engenharia reversa em uma jornada guiada, com passos claros, progresso persistido, niveis, XP, badges e criterios de conclusao.

O objetivo principal nao e criar um jogo separado. A gamificacao existe para reduzir friccao cognitiva, orientar usuarios iniciantes e tornar visivel o avanco real da analise.

## 2. Pilar de design

| Pilar | Decisao |
| --- | --- |
| Clareza operacional | Cada tela representa uma etapa real do Reversa |
| Progressao guiada | O usuario sabe o que fazer, o que entregar e quando avancar |
| Baixa ansiedade tecnica | A interface explica entradas, acoes e saidas sem exigir leitura previa da documentacao |
| Confianca | O sistema separa fase pendente, ativa e concluida |
| Aprendizado | O usuario aprende engenharia reversa enquanto executa o processo |

## 3. Publico-alvo

### Primario

Usuarios que querem analisar um projeto legado com apoio de IA, mas nao dominam totalmente engenharia de software, SDD, agentes ou fluxos de documentacao tecnica.

### Secundario

Engenheiros que ja conhecem o Reversa, mas querem uma camada visual para acompanhar estado, maturidade, agentes instalados e artefatos gerados.

## 4. Fantasia de usuario

"Estou conduzindo uma expedicao tecnica dentro de um sistema legado. Cada passo revela uma camada do software ate transformar codigo desconhecido em especificacoes confiaveis."

## 5. Loop principal

```txt
Preparar projeto
  -> iniciar fase
  -> executar trabalho com agente
  -> validar saida esperada
  -> concluir fase
  -> ganhar XP
  -> desbloquear proxima fase
  -> revisar resultados
```

## 6. Fluxo macro

```txt
Setup -> Reconhecimento -> Escavacao -> Interpretacao -> Geracao -> Revisao -> Resultados
```

| Passo | Tela | Agente | Objetivo |
| --- | --- | --- | --- |
| 0 | Setup | Sistema | Instalar o Reversa, configurar engines, times e saida |
| 1 | Reconhecimento | Scout | Mapear superficie, linguagens, dependencias e pontos de entrada |
| 2 | Escavacao | Archaeologist | Aprofundar modulos, algoritmos, fluxos e estruturas de dados |
| 3 | Interpretacao | Detective + Architect | Extrair regras, arquitetura, riscos e lacunas |
| 4 | Geracao | Writer | Criar especificacoes rastreaveis e contratos tecnicos |
| 5 | Revisao | Reviewer | Validar consistencia, confianca e perguntas pendentes |
| 6 | Resultados | Sistema | Mostrar artefatos, maturidade e proximos passos |

## 7. Estados de fase

| Estado | Significado | Comportamento esperado |
| --- | --- | --- |
| `pending` | Fase ainda nao iniciada | Menu visivel, botao de iniciar habilitado se instalado |
| `active` | Fase atual | Destaque visual, botao de concluir habilitado |
| `completed` | Fase concluida | Marcador de progresso, XP aplicado, checkpoint gravado |
| `idle` | Fora do fluxo atual | Sem prioridade visual |

## 8. Regras de progressao

### Setup

Ao instalar pelo Reversa Web:

- cria `.reversa/state.json`;
- salva engines, agentes, idioma e pasta de saida;
- inicia a primeira fase em `reconhecimento`;
- registra checkpoint de inicio via web;
- atualiza XP de base.

### Avanco de fase

Ao clicar em `Concluir e avancar`:

1. a fase atual entra em `completed`;
2. o checkpoint recebe `completed_at`;
3. a proxima fase pendente vira `active`;
4. `pending` e recalculado;
5. XP, nivel, badges e maturidade sao atualizados;
6. a UI navega para a fase ativa.

## 9. Sistema de XP

O XP mede progresso operacional, nao habilidade real do usuario.

| Evento | XP |
| --- | ---: |
| Inversa instalado | 100 |
| Engine configurada | 40 por engine |
| Agente instalado | 12 por agente |
| Fase concluida | 120 por fase |
| Arquivo Markdown gerado | 6 por arquivo |
| Bloco Mermaid gerado | 10 por bloco |

### Formula de nivel

```txt
nivel = floor(xp / 250) + 1
```

O nivel minimo e 1.

## 10. Ranks

| Condicao | Rank |
| --- | --- |
| Nivel 1-2 | Aprendiz de Reversa |
| Nivel 3-4 | Analista de Fluxos |
| Nivel 5-7 | Explorador Senior |
| Nivel 8+ | Arquiteto de Specs |

## 11. Badges

| Badge | Desbloqueio |
| --- | --- |
| Base montada | Reversa instalado |
| Engine ativa | Pelo menos uma engine configurada |
| Squad instalado | Cinco ou mais agentes instalados |
| Primeiros artefatos | Pelo menos um Markdown no SDD |
| Diagramador | Pelo menos um bloco Mermaid encontrado |
| Ciclo revisado | Todas as fases concluidas |

## 12. Maturidade

A maturidade resume o estado do projeto em cinco dimensoes:

| Dimensao | Como pontua |
| --- | --- |
| Instalacao | 100 se instalado |
| Engines | Ate 100 conforme engines configuradas |
| Agentes | Ate 100 conforme agentes instalados |
| Artefatos | Pontua por Markdown e Mermaid gerados |
| Workflow | Percentual de fases concluidas |

### Labels

| Score | Label |
| --- | --- |
| 0-44 | Inicial |
| 45-74 | Em evolucao |
| 75-100 | Avancado |

## 13. Telas

### Setup

Funcao: preparar o projeto.

Elementos:

- compatibilidade do Reversa;
- nome do projeto;
- nome do usuario;
- idioma do chat;
- idioma dos docs;
- pasta de saida;
- engines;
- times de agentes;
- estrategia Git;
- modo de resposta.

### Fase

Funcao: representar uma etapa real do Reversa.

Elementos:

- numero do passo;
- titulo;
- foco;
- status;
- agente responsavel;
- entradas;
- acoes esperadas;
- saidas esperadas;
- criterio de conclusao;
- controles `Iniciar passo` e `Concluir e avancar`.

### Resultados

Funcao: apresentar a producao da analise.

Elementos:

- total de arquivos;
- total de Markdown;
- total de diagramas;
- total de lacunas;
- leitura rapida da saida `_reversa_sdd`.

## 14. Criterios de conclusao por fase

| Fase | Criterio |
| --- | --- |
| Reconhecimento | O agente consegue dizer onde analisar primeiro e por que |
| Escavacao | Os principais comportamentos tecnicos foram explicados com rastreabilidade |
| Interpretacao | Regras e arquitetura estao claras sem misturar fato com suposicao |
| Geracao | O SDD pode orientar manutencao ou evolucao por agente |
| Revisao | Artefatos consistentes e incertezas explicitas |

## 15. Feedback ao usuario

| Acao | Feedback |
| --- | --- |
| Instalar | Estado muda para fase `Reconhecimento` ativa |
| Iniciar passo | Fase recebe status ativo |
| Concluir passo | XP, nivel, fase atual e badges recalculados |
| Erro | Mensagem direta no hint da fase ou terminal |
| Atualizar | Dashboard recarrega a partir do estado local |

## 16. Persistencia

O estado fica em:

```txt
.reversa/state.json
```

Campos usados pelo Reversa Web:

| Campo | Uso |
| --- | --- |
| `phase` | Fase ativa |
| `completed` | Fases concluidas |
| `pending` | Fases pendentes |
| `checkpoints` | Inicio/conclusao por fase |
| `engines` | Engines configuradas |
| `agents` | Agentes instalados |
| `output_folder` | Pasta de artefatos |

## 17. Principios de UI

- O menu deve seguir a ordem real do Reversa.
- Cada fase deve ter uma unica responsabilidade.
- O usuario nao deve precisar adivinhar o proximo passo.
- Os controles de fase devem ficar perto do criterio de conclusao.
- O painel deve ser util mesmo quando ainda nao existem artefatos.
- Indicadores visuais devem refletir estado persistido, nao apenas clique local.

## 18. Fora de escopo atual

- Ranking entre usuarios.
- Multiplayer.
- Loja, moedas ou recompensas cosmeticas.
- Missoes aleatorias.
- Simulacao artificial de progresso sem estado real.
- Alterar arquivos do projeto legado fora das areas controladas.

## 19. Roadmap de gameplay

| Entrega | Prioridade | Status |
| --- | --- | --- |
| Menu por passos reais do Reversa | Alta | Concluido |
| XP e nivel por progresso real | Alta | Concluido |
| Persistencia de fase via web | Alta | Concluido |
| Badges basicos | Media | Concluido |
| Tela de resultados | Media | Em andamento |
| Checklist por fase | Alta | Planejado |
| Validacao de artefatos por fase | Alta | Planejado |
| Historico visual de checkpoints | Media | Planejado |
| Recomendacao automatica de proxima acao | Media | Planejado |
| Modo iniciante com textos mais guiados | Media | Planejado |

## 20. Metricas de sucesso

| Metrica | Sinal esperado |
| --- | --- |
| Tempo ate instalar | Usuario consegue instalar sem sair da interface |
| Avanco de fase | Usuario passa do nivel 2 concluindo fases |
| Clareza | Usuario entende entrada, acao e saida de cada passo |
| Confianca | Estado visual bate com `.reversa/state.json` |
| Utilidade | Resultados apontam para artefatos reais do SDD |
