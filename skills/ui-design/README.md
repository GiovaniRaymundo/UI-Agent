# ui-design

Skill de diseño de interfaces para agentes de código. Convierte principios de UX, patrones de interfaces complejas y reglas visuales en decisiones verificables: jerarquía, densidad, estados, accesibilidad y medición real con navegador.

## Instalar

```bash
npx skills add <owner>/ui-design-atlas --skill ui-design
```

Sustituye `<owner>` por tu usuario u organización de GitHub. También puedes instalarla desde una ruta local:

```bash
npx skills add ./ruta/a/esta/carpeta --skill ui-design
```

## Qué incluye

| Archivo | Contenido |
| --- | --- |
| `SKILL.md` | Protocolo, reglas duras, clasificador de superficies y anti-patrones |
| `references/00-fuentes.md` | Fuentes, ediciones y qué se tomó de cada obra |
| `references/01-ux-cognitive.md` | Leyes de UX, modelos mentales, postura, excise, errores, comportamientos |
| `references/02-architecture.md` | Atomic Design, navegación, tablas, dashboards, configurador |
| `references/03-visual-ui.md` | Tokens, tipografía, color, grid, profundidad, estados, movimiento |
| `references/04-components.md` | Recetas Base UI/shadcn, diálogos, formularios, ARIA y WCAG |
| `references/05-project-pc-store.md` | Tokens y convenciones del proyecto PC Store / Forge HW |
| `references/06-review-checklist.md` | Auditoría en 14 puertas y formato de reporte |
| `references/07-tidwell-patterns.md` | Catálogo de ~90 patrones de *Designing Interfaces* |
| `references/08-source-notes.md` | Capítulos y páginas extraídos de los libros |
| `references/09-skeleton-audit.md` | Medir la UI real y dimensionar skeletons con Playwright |

## Scripts

### Auditoría estática

```bash
node scripts/ui-audit.mjs
node scripts/ui-audit.mjs --json
node scripts/ui-audit.mjs --strict
```

Detecta hex sueltos, espaciado fuera de escala, texto menor a 12 px, `transition-all`, `div` clickeables, botones solo-icono sin `aria-label`, imágenes sin `alt` y `outline-none` sin foco visible.

### Skeleton audit

Mide la UI cargada en 360/768/1280 con un navegador real y genera tamaños CSS para que el skeleton no provoque layout shift.

```bash
node scripts/skeleton-audit.mjs \
  --config scripts/skeleton-audit.config.json \
  --base-url http://localhost:3000
```

Convención:

```tsx
<Card data-skeleton-target="admin-pcs">…</Card>
<Skeleton data-skeleton="admin-pcs" className="h-[var(--sk-admin-pcs-h)] w-full" />
```

Salidas: `.skeleton-audit/skeleton-audit.md`, `.css` y `.json`.

Motor: Playwright si está instalado; si no, `playwright-core` o `puppeteer-core` con Chrome/Edge.

```bash
npm i -D playwright
npx playwright install chromium
```

### OCR / extracción de PDF

```bash
python scripts/ocr-pdf.py --pdf libro.pdf --mode text --out libro.txt
python scripts/ocr-pdf.py --pdf libro.pdf --mode ocr --out salida/
```

`--mode text` usa la capa de texto del PDF (rápido, sin GPU). `--mode ocr` usa [baidu/Unlimited-OCR](https://github.com/baidu/Unlimited-OCR) y requiere GPU NVIDIA + CUDA.

## Requisitos

- Node.js 22+ para los scripts.
- Chrome o Edge para el skeleton audit (o Playwright con su Chromium).
- Python 3.10+ y `pymupdf` para `ocr-pdf.py`.
- GPU NVIDIA + CUDA solo si usas `--mode ocr`.

## Fuentes

Las reglas están contrastadas con:

- *Laws of UX* (2.ª ed.), Jon Yablonski.
- *Designing Interfaces* (2.ª ed.), Jenifer Tidwell.
- *About Face* (4.ª ed.), Alan Cooper, Robert Reimann, David Cronin y Christopher Noessel.
- Principios de *Refactoring UI* y WCAG 2.2 / patrones ARIA.

Las referencias son síntesis operativas; no reproducen capítulos ni figuras de los libros. Si necesitas el detalle de un patrón, consulta la obra original.

## Licencia

MIT. Si publicas una copia, conserva la atribución de las fuentes y no presentes el contenido de los libros como propio.
