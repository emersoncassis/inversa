# Instalação

## Requisitos

- **Node.js 18+** instalado na máquina

Se você não tem Node.js, instale em [nodejs.org](https://nodejs.org) e volte aqui.

---

## Um comando, isso é tudo

Na raiz do projeto legado que você quer analisar:

```bash
npx reversa install
```

O instalador faz tudo isso pra você:

1. Detecta as engines de IA presentes no ambiente (Claude Code, Codex, Cursor, Gemini CLI, Windsurf)
2. Pergunta quais **Teams** de agentes instalar. `Reversa Agents Core` está sempre incluído; `Migration Agents`, `Code Forward Agents` e `Pricing and Size Agents` já vêm marcados; `Translators N8N->Specs->Python` fica desmarcado por padrão. O CLI expande cada Team escolhido nos seus agentes
3. Coleta nome do projeto, idioma e preferências
4. Copia os agentes para `.agents/skills/` e `.claude/skills/` (para Claude Code)
5. Cria o arquivo de entrada da engine escolhida (`CLAUDE.md`, `AGENTS.md`, etc.)
6. Cria a estrutura `.reversa/` com estado, configuração e plano
7. Gera o manifesto SHA-256 para atualizações seguras no futuro

É tipo um `npm install`, mas para o seu time de agentes de engenharia reversa.

---

## O que é criado no projeto

```
projeto-legado/
├── .reversa/               ← estado, config e contexto da análise
├── .agents/skills/         ← agentes universais (todas as engines)
├── .claude/skills/         ← mirror para Claude Code
├── CLAUDE.md               ← ponto de entrada para Claude Code (se detectado)
├── AGENTS.md               ← ponto de entrada para Codex (se detectado)
└── _reversa_sdd/           ← onde as especificações serão geradas (vazio inicialmente)
```

!!! success "Seus arquivos ficam intactos"
    O instalador **só cria arquivos novos**. Jamais modifica ou apaga qualquer arquivo já existente no seu projeto.

---

## Backup antes de começar

!!! warning "Recomendação forte: faça um backup"
    Embora o Reversa nunca modifique seus arquivos, agentes de IA podem cometer erros. Antes de iniciar a análise:

    1. Certifique-se de que todos os arquivos estão commitados no Git
    2. Tenha o repositório no GitHub, GitLab ou Bitbucket
    3. Faça uma cópia local da pasta como segurança extra: `cp -r meu-projeto meu-projeto-backup`

    Se algo inesperado acontecer, `git restore .` resolve.

---

## Instalando em outra engine depois

Se depois quiser adicionar suporte a mais uma engine (por exemplo, você instalou só para Claude Code e agora quer Codex também):

```bash
npx reversa add-engine
```

O instalador detecta o que já existe e adiciona só o que falta.
