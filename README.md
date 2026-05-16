<div align="center">

  <img src="https://capsule-render.vercel.app/api?type=venom&height=220&color=0:1B1715,50:8B5E3C,100:D28B45&text=Inversa%20%7C%20Reversa%20Fork&fontSize=38&fontColor=F7F1E8&animation=twinkling&fontAlignY=43&desc=Engenharia%20Reversa%20%7C%20Experi%C3%AAncia%20Visual%20%7C%20Agentes%20de%20IA&descSize=16&descAlignY=62" alt="Inversa | Reversa Fork" />

  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=700&size=23&pause=1000&color=D28B45&center=true&vCenter=true&width=900&lines=Reversa+mais+visual+e+acess%C3%ADvel;Bot%C3%B5es.+Menus.+Guias.+Autoexplica%C3%A7%C3%B5es.;M%C3%A9tricas+para+evoluir+software+com+clareza;Engenharia+de+Software+para+todos" alt="Typing SVG" />

  <br><br>

  <a href="https://github.com/sandeco/reversa">
    <img src="https://img.shields.io/badge/Projeto%20Original-sandeco%2Freversa-8B5E3C?style=for-the-badge&logo=github&logoColor=white" alt="Projeto original" />
  </a>
  <a href="https://github.com/emersoncassis/aieng">
    <img src="https://img.shields.io/badge/Jornada%20de%20Estudo-aieng-1B1715?style=for-the-badge&logo=github&logoColor=D28B45" alt="Jornada de estudo aieng" />
  </a>
  <a href="https://physia.com.br/aieng/">
    <img src="https://img.shields.io/badge/Curso-AI%20Engineering-D28B45?style=for-the-badge&logo=openai&logoColor=1B1715" alt="AI Engineering" />
  </a>

</div>

---

## 📌 Sobre este fork

Este repositório é o meu fork de estudo do projeto **Reversa**, criado pelo professor **Sandeco Macedo**.

O objetivo deste fork, chamado aqui de **Inversa**, é acompanhar meus estudos em **Engenharia de Software e Agentes Inteligentes**, entendendo como o Reversa pode ser usado como ferramenta de aprendizagem para analisar sistemas, extrair conhecimento técnico e transformar código existente em especificações executáveis para agentes de IA.

Além do estudo técnico, meu objetivo é evoluir este fork para tornar o Reversa **mais fácil, visual e guiado para usuários com pouco conhecimento em engenharia de software**, criando uma experiência com botões, menus, seleções, autoexplicações e indicadores de progresso.

> Este fork não substitui o projeto original. Ele é usado como ambiente de estudo, experimentação, documentação e aprendizado prático.

---

## 🧭 Visão do Inversa

A ideia do **Inversa** é transformar o Reversa em uma experiência mais acessível para quem quer aprender, analisar ou melhorar um software, mesmo sem dominar todos os conceitos técnicos.

Em vez de depender apenas de comandos e leitura extensa de documentação, a proposta é estudar uma camada mais visual e orientada, com:

- **botões de ação** para instalar, iniciar análise, continuar análise e gerar relatórios;
- **menus de seleção** para escolher tipo de projeto, linguagem, engine de IA e nível de profundidade;
- **autoexplicações** mostrando o que cada etapa faz e por que ela é importante;
- **guias passo a passo** para usuários iniciantes;
- **indicadores de progresso** para mostrar em qual fase da análise o projeto está;
- **percentuais de maturidade** para indicar o quão próximo o projeto está de um software ideal;
- **relatórios visuais** com pontos fortes, riscos, lacunas e próximos passos.

---

## 📊 Ideia de indicadores de qualidade

Uma das metas deste fork é explorar uma forma simples de responder perguntas como:

> “O quanto este projeto está próximo de um software bem especificado, organizado e preparado para evoluir com IA?”

Possíveis indicadores estudados:

| Indicador | O que mede |
|---|---|
| **Cobertura de especificação** | Quanto do sistema possui documentação ou SDD gerado |
| **Clareza arquitetural** | Se módulos, camadas e responsabilidades estão bem identificados |
| **Rastreabilidade** | Se regras e especificações conseguem apontar para arquivos/código |
| **Lacunas críticas** | Quantidade de pontos que ainda precisam de validação humana |
| **Prontidão para IA** | O quanto o projeto está preparado para ser evoluído por agentes |
| **Maturidade geral** | Percentual aproximado de proximidade com um software ideal |

Exemplo conceitual:

```txt
Maturidade do projeto: 68%
Especificação:        72%
Arquitetura:          61%
Rastreabilidade:      70%
Lacunas críticas:     35%
Prontidão para IA:    64%
```

Esses percentuais não devem ser tratados como verdade absoluta. Eles servem como orientação visual para aprendizado, diagnóstico e melhoria contínua.

---

## 🧠 O que é o Reversa?

O **Reversa** é um framework de engenharia reversa de especificações.

Ele é instalado dentro de um projeto legado e coordena uma equipe de agentes de IA especializados para analisar o código existente e gerar especificações completas, rastreáveis e prontas para serem usadas por agentes de programação.

Em vez de apenas gerar documentação para humanos, o Reversa busca produzir **contratos operacionais** que ajudam agentes de IA a evoluir um sistema sem quebrar regras, fluxos e comportamentos já existentes.

---

## 🎯 Meu objetivo de estudo

Estou estudando este projeto para desenvolver uma mentalidade mais sólida de **engenheiro de software**, aprendendo na prática sobre:

- análise de sistemas legados;
- extração de regras de negócio a partir do código;
- documentação técnica rastreável;
- arquitetura de software;
- especificações executáveis;
- agentes de IA aplicados ao desenvolvimento;
- SDD, TDD, ADRs e documentação orientada a engenharia;
- uso de IA com método, processo e responsabilidade;
- criação de interfaces mais amigáveis para ferramentas técnicas;
- métricas visuais para diagnóstico e evolução de software.

---

## 🚀 Como instalar

Na raiz de um projeto legado:

```bash
npx reversa install
```

O instalador irá:

1. detectar engines de IA presentes no ambiente;
2. perguntar quais agentes serão instalados;
3. coletar nome do projeto, linguagem e preferências;
4. criar estrutura `.reversa/`;
5. copiar agentes para `.agents/skills/`;
6. criar arquivos de entrada para engines como Claude Code, Codex, Cursor e outros;
7. gerar manifestos de segurança para atualizações.

**Requisito:** Node.js 18+

---

## ▶️ Como usar

Depois da instalação, abra o projeto no agente de IA compatível e execute:

```txt
/reversa
```

Para engines sem suporte a slash command, use:

```txt
reversa
```

O Reversa inicia uma análise guiada, cria um plano de exploração e salva o progresso em:

```txt
.reversa/state.json
```

Se a sessão for interrompida, basta executar novamente `reversa` para continuar.

---

## 🧩 Pipeline de análise

O Reversa trabalha em fases coordenadas por agentes especializados:

```txt
Reconhecimento → Escavação → Interpretação → Geração → Revisão
    Scout       Archaeologist   Detective       Writer   Reviewer
                                  Architect
```

### Agentes principais

| Agente | Função |
|---|---|
| **Reversa** | Orquestrador central da análise |
| **Scout** | Mapeia estrutura, linguagens, dependências e pontos de entrada |
| **Archaeologist** | Analisa módulos, algoritmos, fluxos e estruturas de dados |
| **Detective** | Extrai regras de negócio implícitas e decisões arquiteturais |
| **Architect** | Sintetiza arquitetura, diagramas C4, integrações e dívida técnica |
| **Writer** | Gera especificações rastreáveis e operacionais |
| **Reviewer** | Revisa inconsistências, lacunas e pontos que precisam de validação humana |

---

## 📦 O que é gerado

O Reversa gera uma pasta de saída com artefatos de engenharia:

```txt
_reversa_sdd/
├── inventory.md
├── dependencies.md
├── code-analysis.md
├── data-dictionary.md
├── domain.md
├── architecture.md
├── c4-context.md
├── c4-containers.md
├── c4-components.md
├── erd-complete.md
├── confidence-report.md
├── gaps.md
├── questions.md
├── sdd/
├── openapi/
├── user-stories/
├── adrs/
├── flowcharts/
├── sequences/
├── ui/
├── database/
├── design-system/
└── traceability/
```

---

## 🟢 Escala de confiança

Cada informação gerada pode receber um nível de confiança:

| Marca | Significado |
|---|---|
| 🟢 **CONFIRMED** | Extraído diretamente do código |
| 🟡 **INFERRED** | Inferido por padrões encontrados |
| 🔴 **GAP** | Lacuna que precisa de validação humana |

Essa abordagem é importante porque evita que a IA trate suposições como verdade absoluta.

---

## 🛠️ Engines suportadas

O Reversa foi pensado para funcionar com diferentes ambientes e agentes de IA:

| Engine | Ativação |
|---|---|
| Claude Code | `/reversa` |
| Codex | `reversa` |
| Cursor | `/reversa` |
| Gemini CLI | `/reversa` |
| Windsurf | `/reversa` |
| GitHub Copilot | `/reversa` |
| Aider | `reversa` |
| Cline / Roo Code | `/reversa` |

---

## 🧪 Comandos úteis

```bash
npx reversa install      # Instala o Reversa no projeto
npx reversa status       # Mostra o estado atual da análise
npx reversa update       # Atualiza os agentes
npx reversa add-agent    # Adiciona um agente
npx reversa add-engine   # Adiciona suporte a uma nova engine
npx reversa uninstall    # Remove arquivos criados pelo Reversa
```

---

## 🗺️ Roadmap de estudo deste fork

| Etapa | Ideia | Status |
|---|---|---|
| 1 | README em português e organizado | ✅ Iniciado |
| 2 | Mapear funcionamento do Reversa original | 🔄 Em estudo |
| 3 | Planejar camada visual com botões e menus | 🧭 Planejado |
| 4 | Criar protótipo de fluxo guiado para iniciantes | 🧭 Planejado |
| 5 | Explorar dashboard de progresso e maturidade | 🧭 Planejado |
| 6 | Documentar aprendizados na jornada AI Engineering | 🔄 Contínuo |

---

## 🔒 Segurança e boas práticas

Antes de usar em um projeto real:

- versionar tudo com Git;
- fazer commit antes da análise;
- manter uma cópia de backup;
- revisar os arquivos gerados;
- validar informações inferidas;
- não usar saídas de IA sem revisão técnica.

O Reversa trabalha com uma diretiva importante: os agentes devem escrever apenas em `.reversa/` e na pasta de saída `_reversa_sdd/`.

---

## 📚 Links importantes

- Projeto original: [sandeco/reversa](https://github.com/sandeco/reversa)
- Meu fork de estudo: [emersoncassis/inversa](https://github.com/emersoncassis/inversa)
- Minha jornada AI Engineering: [emersoncassis/aieng](https://github.com/emersoncassis/aieng)
- Curso/livro: [Engenharia de Software e Agentes Inteligentes](https://physia.com.br/aieng/)

---

## 🙏 Créditos

Este projeto é baseado no repositório original **Reversa**, criado pelo professor **Sandeco Macedo**.

Agradecimento especial ao professor Sandeco pela oportunidade de aprendizado e pela criação de ferramentas que ajudam estudantes e profissionais a compreender melhor engenharia de software, inteligência artificial e agentes inteligentes.

---

## 📄 Licença

MIT — consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
