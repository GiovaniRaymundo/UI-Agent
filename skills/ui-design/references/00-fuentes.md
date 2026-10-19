# Fuentes y qué se toma de cada una

Esta skill sintetiza principios de diseño, no reproduce capítulos ni texto de los libros. Si necesitas profundizar, consulta la fuente original.

| Fuente | Qué aporta a la skill | Dónde se aplica |
| --- | --- | --- |
| **Laws of UX** — Jon Yablonski | Leyes de psicología aplicadas a interfaces: Fitts, Hick, Jakob, Miller, Gestalt, Doherty, Tesler, Peak-End | `01-ux-cognitive.md` |
| **Designing Interfaces** — Jenifer Tidwell | Catálogo de patrones para interfaces complejas: master-detail, facetas, tablas, dashboards, wizards, edición en línea, disclosure progresivo | `02-architecture.md` |
| **About Face** — Alan Cooper | Diseño dirigido por objetivos, eliminación de *excise*, orquestación y flujo, *inflection points*, usuarios de poder, postura de la app | `01-ux-cognitive.md`, `02-architecture.md` |
| **Atomic Design** — Brad Frost | Composición en tokens, átomos, moléculas, organismos, plantillas y páginas; reutilización y escalabilidad | `02-architecture.md` |
| **Refactoring UI** — Adam Wathan y Steve Schoger | Jerarquía con tamaño/peso/color, escala de espaciado, contraste, profundidad, límites, estados y anti-planitud | `03-visual-ui.md` |
| **Documentación de shadcn/ui, Base UI y Tailwind CSS** | Restricciones técnicas reales: composición de primitivas, `data-slot`, variantes con `cva`, tokens CSS-first | `04-components.md`, `05-project-pc-store.md` |
| **WCAG 2.2 AA y patrones ARIA** | Accesibilidad verificable: contraste, teclado, foco, nombres accesibles, formularios, tablas, diálogos | `04-components.md`, `06-review-checklist.md` |
| **Heurísticas de usabilidad de Nielsen** | Evaluación rápida: visibilidad del estado, control y libertad, consistencia, prevención de errores, reconocimiento | `01-ux-cognitive.md`, `06-review-checklist.md` |

## Ediciones y verificación

Las siguientes ediciones se extrajeron de los PDF adjuntos y se resumieron en `08-source-notes.md`:

| Obra | Edición | Cobertura real |
| --- | --- | --- |
| **Laws of UX** | 2.ª ed., O'Reilly (186 pp) | Libro completo: 10 leyes + aplicación + ética |
| **Designing Interfaces** | 2.ª ed., O'Reilly 2011 (58 pp de preview) | Índice completo de patrones + capítulos 1–2 |
| **About Face** | 4.ª ed., Wiley 2014 (722 pp) | Completo; se extrajeron caps. 1, 8–13, 15–17 y 21 |

Los PDF tienen capa de texto, así que se usó extracción directa con PyMuPDF (el mismo motor PDF→imagen del pipeline de Unlimited-OCR). No se ejecutó el modelo OCR porque requiere GPU NVIDIA/CUDA y esta máquina no la tiene; en un PDF escaneado sí sería necesario. Detalles y páginas en `08-source-notes.md`.

Script reproducible: `scripts/ocr-pdf.py --pdf <archivo> --mode text` (capa de texto) o `--mode ocr` (Unlimited-OCR, requiere GPU).

## Cómo se combinaron

1. **Por qué** el usuario decide, duda o falla → leyes y psicología (capa 1).
2. **Qué estructura** soporta el trabajo y los datos → patrones y Atomic Design (capa 2).
3. **Cómo se ve y se siente** → jerarquía visual, tokens, estados y movimiento (capa 3).
4. **Cómo se construye** sin romper accesibilidad ni el sistema → componentes y WCAG (capa 4).
5. **Cómo se verifica** → checklist con criterios observables (capa 5).

## Límites

- Las leyes son heurísticas, no dogmas: se aplican al contexto, se prueban y se ajustan.
- Los patrones no son plantillas: si el patrón no encaja con los datos, se adapta o se descarta con razón.
- Las modas visuales caducan; la jerarquía, el contraste y la claridad no.
- Ninguna skill sustituye probar con personas reales o revisar con lector de pantalla.
