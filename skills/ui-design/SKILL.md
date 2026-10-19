---
name: ui-design
description: >-
  Diseña, audita o refactoriza interfaces con criterio profesional: leyes de UX,
  arquitectura de información, patrones para dashboards y herramientas densas,
  Atomic Design, jerarquía visual estricta, estados de componente y accesibilidad.
  Úsala al crear o rediseñar pantallas, componentes o design tokens, al elegir
  layout para datos complejos, o cuando una UI se sienta plana, genérica o
  inconsistente. Incluye reglas específicas de PC Store (tema oscuro, tienda
  .apple, admin y configurador 3D).
license: MIT
---

# Diseño de Interfaces

Una interfaz no es una colección de tarjetas. Es un sistema de decisión: la persona llega con un objetivo, la pantalla le dice qué puede hacer, en qué orden y qué pasó después. Esta skill evita el resultado genérico imponiendo **jerarquía, densidad, estados y convención** antes de permitir decoración.

## 1. Protocolo

1. **Contexto del proyecto.** Si trabajas en este repo, lee `references/05-project-pc-store.md` antes de tocar código (temas, tokens, rutas, componentes y convenciones).
2. **Clasifica la superficie.** No todas las pantallas se diseñan igual (tabla abajo).
3. **Carga una capa, no todas.** Elige según la duda real:
   - ¿Por qué el usuario se pierde, duda o abandona? → `references/01-ux-cognitive.md`
   - ¿Cómo organizo muchos datos, vistas o navegación? → `references/02-architecture.md`
   - ¿Se ve plano, amateur o inconsistente? → `references/03-visual-ui.md`
   - ¿Cómo construyo el componente, sus estados y su accesibilidad? → `references/04-components.md`
   - ¿Mi skeleton salta al cargar o no coincide con la UI real? → `references/09-skeleton-audit.md`
   - ¿Voy a entregar? → `references/06-review-checklist.md`
4. **Diseña en átomos.** Define tokens → átomos → moléculas → organismos → plantilla → página. No improvises un layout completo sin haber resuelto sus piezas.
5. **Estresa los estados.** Reposo, hover, activo, foco, seleccionado, deshabilitado, cargando, vacío, error, éxito, sin permiso, sin conexión.
6. **Pasa el checklist** de `references/06-review-checklist.md` antes de decir que terminaste.

## 2. Clasificador de superficie

| Superficie | Ejemplos en PC Store | Postura | Densidad | Prioridad #1 |
| --- | --- | --- | --- | --- |
| Editorial / marketing | `/`, `/[line]` | Narrativa, tipografía grande, una idea por bloque | Baja | Jerarquía y deseo |
| Transaccional | `/pc/[slug]`, `/bolsa`, `/pedido/[id]` | Confianza, precio claro, stock honesto | Media | Claridad y fricción cero |
| Operacional | `/admin/*` | Herramienta, no folleto; teclado y escaneo | Alta | Velocidad y precisión |
| Configurador | Configurador de `/pc/[slug]` | Decisión en vivo con consecuencias visibles | Media-alta | Feedback y costo total |
| Herramienta embebida | Forge Setup | Affordances de escritorio dentro del navegador | Media | Correspondencia y control |

Regla: **la densidad se decide por la tarea**, no por moda. Un admin con aire de landing es tan malo como una tienda con tabla de 12 columnas.

## 3. Reglas duras

1. **Jerarquía antes que decoración.** Si todo tiene el mismo peso, nada se lee. Una pantalla tiene una acción primaria, como máximo dos secundarias y el resto terciarias.
2. **Una sola acción primaria por vista.** Dos botones sólidos compitiendo es un error, no una elección.
3. **El color es información.** El acento se reserva para acción, selección o estado. Si decora todo, deja de significar.
4. **Espaciado en múltiplos de 4.** Escala: 4, 8, 12, 16, 24, 32, 48, 64, 96. Nada de `13px`, `18px` o `30px` porque “se veía bien”.
5. **Contraste no negociable.** Texto normal ≥ 4.5:1, texto grande ≥ 3:1, bordes e iconos funcionales ≥ 3:1. El foco visible es obligatorio.
6. **Todo estado está diseñado.** Un componente sin hover, focus, disabled, loading y error está a medias.
7. **Convención por defecto.** Sigue el patrón conocido (Jakob) salvo que el desvío compre algo medible. Si lo desvías, dilo.
8. **Reconocer > recordar.** Lo que el usuario necesita para decidir debe estar en pantalla, no en su memoria ni en otra pestaña.
9. **Feedback inmediato, resultados honestos.** < 100 ms se siente instantáneo; > 300 ms necesita un estado visible; > 1 s necesita progreso o explicación.
10. **Prevención > confirmación.** Restringe, pon buenos defaults y ofrece deshacer. No uses diálogos de “¿seguro?” para tapar un diseño malo.
11. **Menos cromo, más contenido.** Sin bordes, sombras y gradientes compitiendo. Un recurso de profundidad por superficie.
12. **La accesibilidad no es una capa final.** Teclado, foco, nombres accesibles y contraste se diseñan desde el átomo.

### 3.1 De dónde vienen estas reglas

- **Laws of UX (2.ª ed.):** las 10 leyes (Jakob, Fitts, Miller, Hick, Postel, Peak-End, Aesthetic-Usability, Von Restorff, Tesler, Doherty) y sus números verificados.
- **About Face (4.ª ed.):** objetivos vs tareas, modelos mentales, postura, intermedios perpetuos, flow, excise, errores/confirmaciones, undo y principios visuales.
- **Designing Interfaces (2.ª ed.):** 14 comportamientos humanos y el catálogo de ~90 patrones para estructurar pantallas complejas.
- **Refactoring UI + WCAG/ARIA:** jerarquía, color, profundidad, estados y accesibilidad verificable.

Cuando una decisión sea discutible, cita el principio y el contexto; no lo presentes como gusto personal.

## 4. Presupuesto de decisión

Antes de escribir JSX, responde en una línea:

- **Objetivo:** ¿qué viene a hacer la persona aquí?
- **Acción primaria:** ¿cuál es el único botón/enlace que debe ganar?
- **Dato crítico:** ¿qué número, estado o texto no puede fallar?
- **Error caro:** ¿qué pasa si se equivoca y cómo se recupera?
- **Usuario:** principiante, intermedio o de poder. La misma pantalla no se optimiza para los tres a la vez.

Si no puedes llenar esas cinco líneas, todavía no toca diseñar: toca entender.

## 5. Anti-patrones (slop visual)

Estas señales delatan una UI generada sin criterio. Si aparecen, justifícalas o elimínalas:

- Todo son tarjetas idénticas con icono + título + párrafo, incluso donde una tabla o una lista sería mejor.
- Tres CTAs con el mismo peso visual.
- Todo centrado, todo redondeado `rounded-3xl`, todo con sombra.
- Modo oscuro con negro puro y neón saturado en cada borde.
- Gradiente morado genérico como “moderno”.
- Glassmorphism aplicado a todo, incluidas tablas de datos.
- Texto gris claro sobre fondo de color.
- Un solo tamaño de tipografía con distintos colores.
- Placeholder con datos falsos que nunca se reemplazan.
- Emojis usados como iconografía de producto.
- Hero gigante en una herramienta operativa.
- Animación en todo, sin `prefers-reduced-motion`.
- Estados de carga resueltos con un spinner centrado en toda la pantalla.

## 6. Entregables

- **Propuesta:** wireframe textual o ASCII, jerarquía (1.º, 2.º, 3.º), y lista de estados. Sin código todavía.
- **Implementación:** tokens existentes, componentes existentes, estados completos, responsive y teclado. Nada de hex nuevos fuera de tokens.
- **Revisión:** hallazgos ordenados por impacto, con archivo:línea, qué viola y el arreglo concreto. No una lista de gustos.

## 7. Referencias

| Archivo | Cuándo leerlo |
| --- | --- |
| `references/00-fuentes.md` | De dónde sale cada regla y qué se toma de cada libro |
| `references/01-ux-cognitive.md` | Leyes de UX, carga cognitiva, flujos, errores, usuarios de poder |
| `references/02-architecture.md` | Patrones de interfaces complejas, Atomic Design, tablas, dashboards, navegación |
| `references/03-visual-ui.md` | Tokens, tipografía, color, espaciado, profundidad, estados, microinteracciones |
| `references/04-components.md` | Recetas de componentes, Base UI/shadcn, ARIA, WCAG |
| `references/05-project-pc-store.md` | Tokens, temas, rutas y componentes reales de este repo |
| `references/06-review-checklist.md` | Auditoría previa a entrega y formato de reporte |
| `references/07-tidwell-patterns.md` | Catálogo de ~90 patrones de Designing Interfaces para elegir estructura |
| `references/08-source-notes.md` | Qué se extrajo de cada libro, capítulos y páginas; límites |
| `references/09-skeleton-audit.md` | Medir la UI real con Playwright y dimensionar skeletons sin CLS |

Las reglas de esta skill están contrastadas con las fuentes de `00-fuentes.md` y `08-source-notes.md`, no solo con conocimiento general.

## 8. Definition of done

- [ ] Se entiende el objetivo y hay una sola acción primaria.
- [ ] La estructura corresponde a la forma de los datos (no “cards porque sí”).
- [ ] Jerarquía legible en 2 segundos: título → dato clave → acción.
- [ ] Espaciado y tipografía desde la escala; cero valores arbitrarios nuevos.
- [ ] Todos los estados existen, incluidos vacío, error y carga.
- [ ] Acciones reversibles con undo; confirmación solo donde de verdad protege.
- [ ] El usuario puede pausar y volver sin perder lo hecho (reentrance).
- [ ] Hay atajos, presets o defaults para el usuario intermedio.
- [ ] Teclado, foco visible y nombres accesibles.
- [ ] Contraste verificado en ambos temas.
- [ ] Responsive probado en 360, 768 y 1280 px como mínimo.
- [ ] Copy en español claro, con números y unidades correctos.
- [ ] Checklist de `06-review-checklist.md` aprobado.
