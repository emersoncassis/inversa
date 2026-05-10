# Soul Extractor

**Command:** `/reversa-extract-soul`
**Phase:** 1 (Reconnaissance), runs after Scout

---

## 🧬 The express biographer

The express biographer visits the subject, reads the real estate agent's notes (Scout), quickly flips through a few family albums and the letter archive (git log), and produces a one-page biography: who they are, what they do, and the founding decisions that shaped a whole life. Not the full story, just the distilled soul.

---

## What it does

The Soul Extractor is deliberately light. It does NOT excavate module by module (that's the Archaeologist), it does NOT reconstruct business rules (that's the Detective), it does NOT draw a full C4 (that's the Architect). It produces ONE single executive Spec that gives the reader the essential understanding of the project in one read.

The synthesis covers three things:

1. **Purpose and problem solved**, in one paragraph: what the software does, for whom, and what pain it removes.
2. **Core entities and relationships**, the 5 to 10 entities that hold the data backbone, plus a minimal relationship diagram.
3. **Founding decisions**, the 3 to 7 structural choices that shape the whole system (stack, architectural pattern, database, paradigm). Different from the Detective's pointwise ADRs.

---

## Prerequisite

`.reversa/context/surface.json` must exist. The agent depends on the Scout's surface map. If it doesn't exist, the agent stops and tells you to run `/reversa-scout` first (or `/reversa` for the full pipeline).

---

## What it produces

A single file:

| File | Content |
|------|---------|
| `_reversa_sdd/soul.md` | The project's soul: purpose, core entities, founding decisions, gaps |

The file name stays in English (following the convention of `architecture.md`, `domain.md`, `inventory.md`), but the content respects `doc_language` from `state.json`.

---

## How it scales with `doc_level`

Always one file. `doc_level` only changes the depth, never the number of files.

| Aspect | essential | complete | detailed |
|--------|-----------|----------|----------|
| Core entities | 5 | 7 to 8 | up to 10 |
| Founding decisions | 3 | 4 to 5 | 5 to 7 |
| Relationship diagram | text list | simplified Mermaid | expanded Mermaid with cardinalities |
| Justification per decision | 1 sentence | 2 to 3 sentences | paragraph + cited evidence |

---

## Non-destructive

If `_reversa_sdd/soul.md` already exists, the agent does NOT overwrite. It offers two options: keep the original and abort, or generate a dated sibling like `_reversa_sdd/soul.20260509-1430.md`.

---

## When to use manually

Right after Scout, when you want an executive synthesis of the system before committing to the full extraction pipeline:

```
/reversa-extract-soul
```

You can also run it any time after Scout has run, even if Archaeologist, Detective and the others already produced their artifacts. The Soul Extractor stays consistent with whatever surface map is current.
