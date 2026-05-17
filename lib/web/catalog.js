import {
  DISCOVERY_AGENT_IDS,
  FORWARD_AGENT_IDS,
  MIGRATION_AGENT_IDS,
  PRICING_AGENT_IDS,
  TRANSLATOR_AGENT_IDS,
} from '../installer/prompts.js';

export const workflowPhases = [
  {
    id: 'reconhecimento',
    step: 1,
    title: 'Reconhecimento',
    menuTitle: 'Reconhecimento',
    agent: 'Scout',
    focus: 'Descobrir a superficie real do projeto antes de aprofundar qualquer area.',
    description: 'Mapeia estrutura, linguagens, dependencias e pontos de entrada.',
    inputs: [
      'Raiz do projeto instalada com Reversa',
      'Arquivos de codigo, configuracao e dependencias',
      'Engines e agentes selecionados no setup',
    ],
    actions: [
      'Identificar linguagens, frameworks e gerenciadores',
      'Mapear pontos de entrada, scripts e modulos principais',
      'Separar areas relevantes, perifericas e desconhecidas',
    ],
    outputs: [
      'Inventario inicial do sistema',
      'Mapa de superficies e pontos de entrada',
      'Plano de escavacao orientado por risco',
    ],
    doneCriteria: 'A fase esta pronta quando o agente consegue dizer onde analisar primeiro e por que.',
    dependency: {
      title: 'Base de orientacao',
      why: 'Antes de aprofundar qualquer codigo, o Inversa precisa saber onde estao os modulos, entradas, linguagens e limites do projeto.',
      importance: 'Essa fase reduz exploracao cega e evita que os agentes analisem partes irrelevantes ou deixem pontos criticos fora do plano.',
      unlocks: 'Desbloqueia escavacao dirigida por areas reais do sistema.',
    },
  },
  {
    id: 'escavacao',
    step: 2,
    title: 'Escavacao',
    menuTitle: 'Escavacao',
    agent: 'Archaeologist',
    focus: 'Aprofundar os modulos mais importantes encontrados no reconhecimento.',
    description: 'Aprofunda modulos, algoritmos, fluxos e estruturas de dados.',
    inputs: [
      'Inventario e mapa de superficies',
      'Modulos priorizados',
      'Dependencias e fluxos tecnicos detectados',
    ],
    actions: [
      'Ler modulos por responsabilidade',
      'Extrair fluxos, algoritmos e estruturas de dados',
      'Registrar acoplamentos, efeitos colaterais e pontos frageis',
    ],
    outputs: [
      'Analise tecnica por modulo',
      'Fluxos de execucao relevantes',
      'Riscos tecnicos e lacunas de codigo',
    ],
    doneCriteria: 'A fase esta pronta quando os principais comportamentos tecnicos foram explicados com rastreabilidade.',
    dependency: {
      title: 'Conhecimento tecnico profundo',
      why: 'Depois do mapa inicial, o Inversa precisa entender como os componentes realmente funcionam por dentro.',
      importance: 'Essa fase encontra regras escondidas em algoritmos, estruturas de dados e fluxos que nao aparecem em documentacao superficial.',
      unlocks: 'Desbloqueia interpretacao confiavel das regras e decisoes do software.',
    },
  },
  {
    id: 'interpretacao',
    step: 3,
    title: 'Interpretacao',
    menuTitle: 'Interpretacao',
    agent: 'Detective + Architect',
    focus: 'Transformar codigo analisado em sentido de negocio, arquitetura e decisoes.',
    description: 'Extrai regras implicitas e sintetiza decisoes arquiteturais.',
    inputs: [
      'Analise tecnica por modulo',
      'Fluxos e algoritmos relevantes',
      'Riscos e lacunas encontrados na escavacao',
    ],
    actions: [
      'Separar fatos confirmados, inferencias e lacunas',
      'Extrair regras de negocio e excecoes',
      'Sintetizar arquitetura, integracoes e responsabilidades',
    ],
    outputs: [
      'Modelo de dominio e regras de negocio',
      'Resumo arquitetural com decisoes e riscos',
      'Lista de perguntas para validacao humana',
    ],
    doneCriteria: 'A fase esta pronta quando regras e arquitetura estao claras sem misturar fato com suposicao.',
    dependency: {
      title: 'Sentido de negocio e arquitetura',
      why: 'Codigo analisado ainda precisa virar entendimento: regras, responsabilidades, acoplamentos, riscos e decisoes arquiteturais.',
      importance: 'Essa fase separa fato, inferencia e lacuna, impedindo que a IA trate suposicoes como verdade operacional.',
      unlocks: 'Desbloqueia geracao de especificacoes com rastreabilidade e contexto.',
    },
  },
  {
    id: 'geracao',
    step: 4,
    title: 'Geracao',
    menuTitle: 'Geracao',
    agent: 'Writer',
    focus: 'Converter descobertas em artefatos operacionais para humanos e agentes.',
    description: 'Transforma descobertas em especificacoes rastreaveis.',
    inputs: [
      'Regras, arquitetura e lacunas classificadas',
      'Evidencias rastreaveis no codigo',
      'Padroes de saida do SDD',
    ],
    actions: [
      'Gerar documentos tecnicos e especificacoes',
      'Criar diagramas, historias, ADRs e rastreabilidade',
      'Manter marcadores de confianca em cada decisao',
    ],
    outputs: [
      'Pasta _reversa_sdd preenchida',
      'Especificacoes, diagramas e contratos tecnicos',
      'Rastreabilidade entre comportamento e codigo',
    ],
    doneCriteria: 'A fase esta pronta quando o SDD pode orientar manutencao ou evolucao por agente.',
    dependency: {
      title: 'Contratos executaveis',
      why: 'O conhecimento extraido precisa ser convertido em artefatos que humanos e agentes consigam usar para evoluir o sistema.',
      importance: 'Essa fase cria especificacoes, diagramas e documentos rastreaveis que reduzem risco em manutencao e novas features.',
      unlocks: 'Desbloqueia revisao tecnica e uso do SDD por agentes de codificacao.',
    },
  },
  {
    id: 'revisao',
    step: 5,
    title: 'Revisao',
    menuTitle: 'Revisao',
    agent: 'Reviewer',
    focus: 'Verificar consistencia, completude e pontos que ainda exigem decisao humana.',
    description: 'Valida consistencia, lacunas e pontos de decisao humana.',
    inputs: [
      'Artefatos gerados no SDD',
      'Relatorio de confianca',
      'Perguntas, lacunas e inferencias pendentes',
    ],
    actions: [
      'Conferir contradicoes entre documentos',
      'Priorizar lacunas criticas',
      'Separar ajustes tecnicos de validacoes humanas',
    ],
    outputs: [
      'Relatorio de confianca revisado',
      'Lista de lacunas e perguntas priorizadas',
      'Base pronta para evolucao assistida por IA',
    ],
    doneCriteria: 'A fase esta pronta quando os artefatos estao consistentes e as incertezas estao explicitas.',
    dependency: {
      title: 'Controle de qualidade',
      why: 'Antes de confiar nos artefatos, o Inversa precisa verificar consistencia, lacunas e pontos que exigem decisao humana.',
      importance: 'Essa fase protege o projeto contra documentacao imprecisa, inferencias fracas e entregas que parecem completas mas nao sao confiaveis.',
      unlocks: 'Desbloqueia evolucao segura do software com base em especificacoes revisadas.',
    },
  },
];

export const agentTeams = [
  {
    id: 'discovery',
    title: 'Discovery Core',
    description: 'Fluxo principal de engenharia reversa e geracao de SDD.',
    agents: DISCOVERY_AGENT_IDS,
    required: true,
  },
  {
    id: 'migration',
    title: 'Migration',
    description: 'Planejamento de migracao, curadoria e estrategia de reconstrucao.',
    agents: MIGRATION_AGENT_IDS,
  },
  {
    id: 'forward',
    title: 'Code Forward',
    description: 'Ciclo de evolucao do software a partir das especificacoes.',
    agents: FORWARD_AGENT_IDS,
  },
  {
    id: 'pricing',
    title: 'Pricing',
    description: 'Perfil, tamanho e estimativas de preco por valor, esforco e mercado.',
    agents: PRICING_AGENT_IDS,
  },
  {
    id: 'translators',
    title: 'Translators',
    description: 'Traducao de workflows N8N e outros formatos para especificacoes.',
    agents: TRANSLATOR_AGENT_IDS,
  },
];

export const webActions = [
  {
    id: 'status',
    title: 'Atualizar status',
    description: 'Le o estado local do Reversa e mostra o resumo operacional.',
    executable: true,
  },
  {
    id: 'export-diagrams-svg',
    title: 'Exportar diagramas SVG',
    description: 'Gera imagens SVG a partir dos blocos Mermaid encontrados no SDD.',
    executable: true,
  },
  {
    id: 'export-diagrams-png',
    title: 'Exportar diagramas PNG',
    description: 'Gera imagens PNG a partir dos blocos Mermaid encontrados no SDD.',
    executable: true,
  },
];

export function resolveSelectedAgents(teamIds) {
  const selected = new Set(['discovery', ...(teamIds ?? [])]);
  const agents = [];

  for (const team of agentTeams) {
    if (!selected.has(team.id)) continue;
    agents.push(...team.agents);
  }

  return [...new Set(agents)];
}
