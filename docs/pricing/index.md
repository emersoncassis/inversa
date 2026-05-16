# Pricing and Size Agents

The **Pricing and Size Agents** Team estimates effort, size and price for each feature, on top of the artifacts produced by the Code Forward pipeline.

Pre-checked in the installer.

---

## Pipeline

```
/reversa-pricing-profile        (one-time setup: billing profile)
        │
        ▼
/reversa-pricing-size           (per feature: structural T-shirt sizing)
        │
        ▼
/reversa-pricing-estimate       (per feature: 3 scenarios side by side)
```

`profile` runs once and is reused. `size` and `estimate` run for each feature, after `/reversa-to-do`.

---

## Agents

| Agent | Stage | Role |
|-------|-------|------|
| `reversa-pricing-profile` | profile | Guided interview (up to ten questions) that produces the user's billing profile: country, currency, normalized seniority, hourly rate, project markup, tax regime, billing model, client profile. |
| `reversa-pricing-size` | size | Reads requirements, doubts, plan and tasks of the active feature and produces deterministic structural metrics in `size.json` and `size.md` (T-shirt sizing based on tasks plus risk adjustment). |
| `reversa-pricing-estimate` | estimate | Combines `profile.json` and `size.json` of the active feature to produce three educational scenarios side by side: Effort, Value, Market Range. Never delivers a single number as the final answer. |

---

## Where artifacts land

```
_reversa_sdd/_pricing/
├── profile.json               (one-time, from /reversa-pricing-profile)
├── profile.md
└── <feature>/
    ├── size.json              (per feature, from /reversa-pricing-size)
    ├── size.md
    ├── estimate.json          (per feature, from /reversa-pricing-estimate)
    └── estimate.md
```

The Pricing and Size Agents never modify legacy code, Discovery artifacts or Forward artifacts. They only read those and write inside `_pricing/`.
