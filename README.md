<div align="center">

  <img src="https://capsule-render.vercel.app/api?type=blur&height=240&color=0:1B1715,35:5C4033,70:8B5E3C,100:D28B45&text=Inversa&fontSize=52&fontColor=F7F1E8&animation=fadeIn&fontAlignY=38&desc=Rever%20%7C%20Revisar%20%7C%20Compreender%20%7C%20Aprender&descSize=18&descAlignY=58" alt="Inversa" />

  <br>

  <a href="https://github.com/sandeco/reversa">
    <img src="https://img.shields.io/badge/Projeto%20original-sandeco%2Freversa-8B5E3C?style=for-the-badge&logo=github&logoColor=white" alt="Projeto original" />
  </a>
  <a href="https://github.com/emersoncassis/inversa">
    <img src="https://img.shields.io/badge/Fork-emersoncassis%2Finversa-1B1715?style=for-the-badge&logo=github&logoColor=D28B45" alt="Fork Inversa" />
  </a>
  <a href="https://physia.com.br/aieng/">
    <img src="https://img.shields.io/badge/Curso-AI%20Engineering-D28B45?style=for-the-badge&logo=openai&logoColor=1B1715" alt="AI Engineering" />
  </a>

</div>

# Inversa

Fork de estudo do projeto Reversa, criado por Sandeco Macedo.

O Inversa usa engenharia reversa assistida por agentes de IA para transformar sistemas legados em especificacoes tecnicas, rastreaveis e uteis para manutencao, modernizacao e evolucao com agentes codificadores.

Este fork tambem explora uma camada mais visual e guiada para tornar o Reversa mais simples para usuarios iniciantes, com instalacao assistida, painel local, acoes rapidas e leitura mais clara do estado do projeto.

## Objetivo

- Estudar engenharia de software aplicada a sistemas legados.
- Entender como agentes podem extrair conhecimento tecnico a partir de codigo existente.
- Gerar especificacoes operacionais para apoiar manutencao e evolucao.
- Criar uma experiencia mais acessivel para instalacao, analise e acompanhamento.
- Evoluir o Reversa com foco em clareza, seguranca e aprendizado pratico.

## O que e o Reversa

O Reversa e um framework de engenharia reversa de especificacoes. Ele e instalado dentro de um projeto legado e coordena agentes especializados para analisar codigo, dependencias, regras de negocio, arquitetura, telas, dados e riscos.

A saida esperada nao e apenas documentacao para leitura humana. O objetivo e produzir contratos tecnicos que agentes de IA consigam usar para evoluir um sistema com mais contexto e menor risco.

## Requisitos

- Node.js 18.20.2 ou superior.
- Git recomendado antes de iniciar qualquer analise.
- Um agente compativel, como Codex, Claude Code, Cursor, Gemini CLI, Windsurf, Copilot, Aider, Cline ou Roo Code.

## Instalacao rapida

Na raiz do projeto legado:

```bash
npx reversa install
```

O instalador detecta engines disponiveis, pergunta quais agentes devem ser instalados, coleta informacoes basicas do projeto e cria a estrutura necessaria.

## Interface web local

Para abrir a experiencia visual local:

```bash
npx reversa web
```

Opcoes disponiveis:

```bash
npx reversa web --port=17310
npx reversa web --host=127.0.0.1
npx reversa web --no-open
```

A interface web permite acompanhar o estado do projeto, executar a instalacao guiada e acionar comandos comuns sem depender apenas do terminal.

## Uso com agente de IA

Depois da instalacao, abra o projeto no agente de IA compativel e execute:

```txt
/reversa
```

Em engines sem suporte a slash command, use:

```txt
reversa
```

O Reversa cria ou atualiza o estado da analise em:

```txt
.reversa/state.json
```

Se a sessao for interrompida, execute `reversa` novamente para continuar.

## Pipeline

```txt
Reconhecimento -> Escavacao -> Interpretacao -> Geracao -> Revisao
    Scout       Archaeologist   Detective       Writer   Reviewer
                                  Architect
```

| Agente | Responsabilidade |
| --- | --- |
| Reversa | Orquestra a analise e controla checkpoints |
| Scout | Mapeia estrutura, linguagens, dependencias e pontos de entrada |
| Archaeologist | Analisa modulos, fluxos, algoritmos e estruturas de dados |
| Detective | Extrai regras de negocio, excecoes e comportamentos implicitos |
| Architect | Sintetiza arquitetura, integracoes, riscos e decisoes tecnicas |
| Writer | Gera especificacoes rastreaveis e prontas para uso |
| Reviewer | Revisa lacunas, inconsistencias e pontos de validacao humana |

## Artefatos gerados

O Reversa escreve apenas nas pastas controladas pela ferramenta:

```txt
.reversa/
_reversa_sdd/
```

Exemplo de saida esperada:

```txt
_reversa_sdd/
|-- inventory.md
|-- dependencies.md
|-- code-analysis.md
|-- data-dictionary.md
|-- domain.md
|-- architecture.md
|-- confidence-report.md
|-- gaps.md
|-- questions.md
|-- sdd/
|-- openapi/
|-- user-stories/
|-- adrs/
|-- flowcharts/
|-- sequences/
|-- ui/
|-- database/
|-- design-system/
`-- traceability/
```

## Escala de confianca

| Marca | Significado |
| --- | --- |
| CONFIRMED | Extraido diretamente do codigo |
| INFERRED | Inferido por padroes encontrados |
| GAP | Lacuna que precisa de validacao humana |

Essa separacao evita que suposicoes sejam tratadas como fatos.

## Comandos

```bash
npx reversa install          # Instala o Reversa no projeto atual
npx reversa web              # Abre a interface visual local
npx reversa status           # Mostra o estado atual da analise
npx reversa update           # Atualiza agentes instalados
npx reversa add-agent        # Adiciona um agente
npx reversa add-engine       # Adiciona suporte a uma engine
npx reversa export-diagrams  # Exporta diagramas Mermaid
npx reversa uninstall        # Remove arquivos criados pelo Reversa
```

## Engines suportadas

| Engine | Ativacao |
| --- | --- |
| Claude Code | `/reversa` |
| Codex | `reversa` |
| Cursor | `/reversa` |
| Gemini CLI | `/reversa` |
| Windsurf | `/reversa` |
| GitHub Copilot | `/reversa` |
| Aider | `reversa` |
| Cline / Roo Code | `/reversa` |

## Seguranca

Antes de usar em um projeto real:

- confirme que o projeto esta versionado no Git;
- faca commit antes da analise;
- mantenha uma copia de backup quando necessario;
- revise os artefatos gerados;
- valide tudo que estiver marcado como inferido ou lacuna.

O Reversa deve escrever somente em `.reversa/` e `_reversa_sdd/`.

## Roadmap deste fork

| Etapa | Status |
| --- | --- |
| README em portugues, limpo e atualizado | Em andamento |
| Documentar fluxo CLI e interface web local | Em andamento |
| Mapear funcionamento do Reversa original | Em estudo |
| Criar experiencia guiada com botoes e menus | Planejado |
| Explorar indicadores de progresso e maturidade | Planejado |
| Registrar aprendizados da jornada AI Engineering | Continuo |

## Links

- Projeto original: [sandeco/reversa](https://github.com/sandeco/reversa)
- Fork de estudo: [emersoncassis/inversa](https://github.com/emersoncassis/inversa)
- Jornada AI Engineering: [emersoncassis/aieng](https://github.com/emersoncassis/aieng)
- Curso/livro: [Engenharia de Software e Agentes Inteligentes](https://physia.com.br/aieng/)

## Licenca

MIT. Consulte [LICENSE](LICENSE).
