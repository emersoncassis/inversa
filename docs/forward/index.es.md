# Code Forward Agents

El Team **Code Forward Agents** toma las specs producidas por el descubrimiento y conduce la evolución: desde una idea libre hasta código corriendo, siempre anclado a los artefactos del legado ya extraídos por Reversa.

Marcado por defecto en el instalador.

---

## Pipeline

```
/reversa-requirements
        │
        ▼
/reversa-clarify           (opcional, aclara ambigüedad)
        │
        ▼
/reversa-plan            (enfoque técnico como delta sobre el legado)
        │
        ▼
/reversa-to-do           (tareas atómicas, IDs, dependencias, paralelismo)
        │
        ▼
/reversa-audit           (opcional, cross-check requirements x roadmap x actions)
/reversa-quality         (opcional, calidad textual del requirements)
        │
        ▼
/reversa-coding          (ejecuta actions.md como código)
```

`/reversa-principles` corre separado, gestiona principios duraderos del proyecto.
`/reversa-resume` intercambia la feature activa por una pausada.

---

## Agentes

| Agente | Stage | Función |
|--------|-------|---------|
| `reversa-requirements` | requirements | Convierte una idea libre en un `requirements.md` completo, anclado a los artefactos de la pipeline reversa. |
| `reversa-clarify` | clarify | Hasta cinco preguntas dirigidas para resolver puntos abiertos del `requirements.md` e integrar las respuestas. |
| `reversa-plan` | plan | Esboza el enfoque técnico como delta sobre el legado: roadmap, investigation, data-delta, onboarding, interfaces. |
| `reversa-to-do` | to-do | Descompone el roadmap en acciones atómicas con IDs estables, dependencias y marcador de paralelismo. |
| `reversa-audit` | audit | Auditor estrictamente lector: contradicciones y lagunas entre requirements, roadmap y actions, con severidad reportada. |
| `reversa-quality` | quality | Revisa la claridad de la escritura del `requirements.md`. No verifica tests de implementación. |
| `reversa-coding` | coding | Ejecuta `actions.md` como código real, actualiza checkboxes y deja `legacy-impact.md` y `regression-watch.md`. |
| `reversa-principles` | principles | Crea y mantiene principios duraderos del proyecto, separados de los requisitos de cada feature. |
| `reversa-resume` | resume | Retoma una feature pausada listada en `paused-features` de `active-requirements.json`. |

---

## Dónde caen los artefactos

Cada feature vive en su propia carpeta bajo `_reversa_forward/`. La ruta exacta se lee del campo `forward_folder` en `.reversa/state.json`.

Los Code Forward Agents nunca tocan el código legado ni los artefactos del Discovery Team. Consumen las salidas de Discovery y escriben solo dentro de la carpeta forward.
