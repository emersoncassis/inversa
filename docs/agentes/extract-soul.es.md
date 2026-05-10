# Soul Extractor

**Comando:** `/reversa-extract-soul`
**Fase:** 1 (Reconocimiento), corre después del Scout

---

## 🧬 El biógrafo exprés

El biógrafo exprés visita al personaje, lee las anotaciones del agente inmobiliario (Scout), hojea rápidamente algunos álbumes familiares y el histórico de cartas (git log), y produce una biografía de una página: quién es, qué hace, y las decisiones fundadoras que moldearon toda una vida. No es la historia completa, es el alma destilada.

---

## Qué hace

El Soul Extractor es deliberadamente liviano. NO excava módulo por módulo (eso lo hace el Archaeologist), NO reconstruye reglas de negocio (eso lo hace el Detective), NO dibuja C4 completo (eso lo hace el Architect). La entrega es UNA única Spec, ejecutiva, que da al lector la comprensión esencial del proyecto en una lectura.

La síntesis cubre tres cosas:

1. **Propósito y problema resuelto**, en un párrafo: qué hace el software, para quién, y qué dolor resuelve.
2. **Entidades centrales y relaciones**, las 5 a 10 entidades que sostienen el esqueleto de datos, más un diagrama mínimo de relaciones.
3. **Decisiones fundadoras**, las 3 a 7 elecciones estructurales que moldean todo el sistema (stack, patrón arquitectónico, base de datos, paradigma). Diferentes de los ADRs puntuales del Detective.

---

## Prerrequisito

`.reversa/context/surface.json` debe existir. El agente depende del mapeo de superficie del Scout. Si el archivo no existe, el agente se detiene e indica ejecutar `/reversa-scout` primero (o `/reversa` para el pipeline completo).

---

## Qué produce

Un único archivo:

| Archivo | Contenido |
|---------|-----------|
| `_reversa_sdd/soul.md` | El alma del proyecto: propósito, entidades centrales, decisiones fundadoras, brechas |

El nombre del archivo permanece en inglés (siguiendo la convención de `architecture.md`, `domain.md`, `inventory.md`), pero el contenido respeta el `doc_language` del `state.json`.

---

## Cómo escala con `doc_level`

Siempre un archivo. El `doc_level` solo cambia la profundidad, nunca el número de archivos.

| Aspecto | esencial | completo | detallado |
|---------|----------|----------|-----------|
| Entidades centrales | 5 | 7 a 8 | hasta 10 |
| Decisiones fundadoras | 3 | 4 a 5 | 5 a 7 |
| Diagrama de relaciones | lista en texto | Mermaid simplificado | Mermaid expandido con cardinalidades |
| Justificación por decisión | 1 frase | 2 a 3 frases | párrafo + evidencia citada |

---

## Non-destructive

Si `_reversa_sdd/soul.md` ya existe, el agente NO sobrescribe. Ofrece dos opciones: mantener el original y abortar, o generar un hermano fechado como `_reversa_sdd/soul.20260509-1430.md`.

---

## Cuándo usarlo manualmente

Justo después del Scout, cuando quieras una síntesis ejecutiva del sistema antes de ejecutar el pipeline de extracción completo:

```
/reversa-extract-soul
```

También puedes ejecutarlo en cualquier momento después de que Scout haya corrido, incluso si Archaeologist, Detective y los demás ya produjeron sus artefactos. El Soul Extractor permanece consistente con el mapeo de superficie actual.
