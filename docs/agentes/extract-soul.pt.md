# Soul Extractor

**Comando:** `/reversa-extract-soul`
**Fase:** 1 (Reconhecimento), roda após o Scout

---

## 🧬 O biógrafo expresso

O biógrafo expresso visita o personagem, lê as anotações do corretor (Scout), folheia rapidamente alguns álbuns de família e o histórico de cartas (git log), e produz uma biografia de uma página: quem é, o que faz, e as decisões fundadoras que moldaram a vida toda. Não é a história completa, é a alma destilada.

---

## O que faz

O Soul Extractor é deliberadamente leve. Ele NÃO escava módulo a módulo (isso é do Archaeologist), NÃO reconstrói regras de negócio (isso é do Detective), NÃO desenha C4 completo (isso é do Architect). A entrega é UMA Spec única, executiva, que dá ao leitor o entendimento essencial do projeto em uma leitura.

A síntese cobre três coisas:

1. **Propósito e problema resolvido**, em um parágrafo: o que o software faz, para quem, e qual dor ele resolve.
2. **Entidades centrais e relações**, as 5 a 10 entidades que sustentam o esqueleto de dados, mais um diagrama mínimo de relações.
3. **Decisões fundadoras**, as 3 a 7 escolhas estruturantes que moldam o sistema inteiro (stack, padrão arquitetural, banco, paradigma). Diferentes dos ADRs pontuais do Detective.

---

## Pré-requisito

`.reversa/context/surface.json` precisa existir. O agente depende do mapeamento de superfície do Scout. Se o arquivo não existir, o agente para e instrui você a rodar `/reversa-scout` antes (ou `/reversa` para o pipeline completo).

---

## O que ele produz

Um único arquivo:

| Arquivo | Conteúdo |
|---------|----------|
| `_reversa_sdd/soul.md` | A alma do projeto: propósito, entidades centrais, decisões fundadoras, lacunas |

O nome do arquivo permanece em inglês (seguindo a convenção de `architecture.md`, `domain.md`, `inventory.md`), mas o conteúdo respeita o `doc_language` do `state.json`.

---

## Como escala com `doc_level`

Sempre um arquivo. O `doc_level` só muda a profundidade, nunca o número de arquivos.

| Aspecto | essencial | completo | detalhado |
|---------|-----------|----------|-----------|
| Entidades centrais | 5 | 7 a 8 | até 10 |
| Decisões fundadoras | 3 | 4 a 5 | 5 a 7 |
| Diagrama de relações | lista em texto | Mermaid simplificado | Mermaid expandido com cardinalidades |
| Justificativa por decisão | 1 frase | 2 a 3 frases | parágrafo + evidência citada |

---

## Non-destructive

Se `_reversa_sdd/soul.md` já existir, o agente NÃO sobrescreve. Ele oferece duas opções: manter o original e abortar, ou gerar um irmão datado como `_reversa_sdd/soul.20260509-1430.md`.

---

## Quando usar manualmente

Logo após o Scout, quando quiser uma síntese executiva do sistema antes de rodar o pipeline de extração completo:

```
/reversa-extract-soul
```

Você também pode rodar em qualquer momento depois que o Scout já tiver rodado, mesmo que Archaeologist, Detective e os demais já tenham produzido seus artefatos. O Soul Extractor permanece consistente com o mapeamento de superfície atual.
