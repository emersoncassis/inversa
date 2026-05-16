# Pricing and Size Agents

O Team **Pricing and Size Agents** estima esforço, tamanho e preço de cada feature, sobre os artefatos produzidos pelo pipeline Code Forward.

Marcado por padrão no instalador.

---

## Pipeline

```
/reversa-pricing-profile        (uma vez: perfil de cobrança)
        │
        ▼
/reversa-pricing-size           (por feature: T-shirt sizing estrutural)
        │
        ▼
/reversa-pricing-estimate       (por feature: 3 cenários lado a lado)
```

O `profile` roda uma única vez e é reutilizado. Já o `size` e o `estimate` rodam por feature, depois de `/reversa-to-do`.

---

## Agentes

| Agente | Stage | Função |
|--------|-------|--------|
| `reversa-pricing-profile` | profile | Entrevista guiada (até dez perguntas) que produz o perfil de cobrança do usuário: país, moeda, senioridade normalizada, taxa hora, markup de projeto, regime tributário, modelo de cobrança, perfil de cliente. |
| `reversa-pricing-size` | size | Lê requirements, dúvidas, plan e tasks da feature ativa e produz métricas estruturais determinísticas em `size.json` e `size.md` (T-shirt sizing baseado em tasks com ajuste de risco). |
| `reversa-pricing-estimate` | estimate | Cruza `profile.json` e `size.json` da feature ativa e produz três cenários educativos lado a lado: Esforço, Valor, Faixa de Mercado. Jamais entrega número único como resposta final. |

---

## Onde os artefatos vão parar

```
_reversa_sdd/_pricing/
├── profile.json               (uma vez, vindo de /reversa-pricing-profile)
├── profile.md
└── <feature>/
    ├── size.json              (por feature, de /reversa-pricing-size)
    ├── size.md
    ├── estimate.json          (por feature, de /reversa-pricing-estimate)
    └── estimate.md
```

Os Pricing and Size Agents jamais modificam código legado, artefatos do Discovery ou do Forward. Apenas leem esses e escrevem dentro de `_pricing/`.
