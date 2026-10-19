# Checklist de revisión

Úsalo antes de entregar o cuando te pidan auditar una pantalla. No es una lista de gustos: cada puerta tiene un criterio observable.

## 1. Puertas (0–2 cada una)

| # | Puerta | 0 | 1 | 2 |
| --- | --- | --- | --- | --- |
| 1 | **Objetivo y acción primaria** | No se entiende qué hace la pantalla o hay 3+ CTAs compitiendo | Se entiende, pero la acción no destaca | Un objetivo claro y una sola acción primaria |
| 2 | **Estructura** | Tarjetas genéricas para datos que piden tabla/detalle | Estructura aceptable pero no óptima | El patrón corresponde a la forma de los datos |
| 3 | **Navegación y orientación** | No se sabe dónde estás ni cómo volver | Hay nav, pero el estado activo o el contexto falla | Ubicación, profundidad y retorno evidentes |
| 4 | **Jerarquía** | Todo pesa igual | Hay jerarquía, pero el ojo va a un elemento decorativo | Lectura en 2 s: título → dato → acción |
| 5 | **Densidad** | Aire de landing en una herramienta o tabla apretada en tienda | Aceptable pero irregular | La densidad corresponde a la tarea |
| 6 | **Tipografía** | Tamaños arbitrarios, < 12 px necesario, todo bold | Escala casi consistente | Escala, pesos y línea consistentes |
| 7 | **Color y contraste** | Falla contraste o hay 3+ acentos | Contraste ok, acento decorativo de más | Un acento informativo y contraste AA |
| 8 | **Espaciado y alineación** | Valores arbitrarios y desalineación visible | Casi todo alineado | Escala de 4/8, proximidad intencional |
| 9 | **Estados** | Faltan hover/focus/disabled/loading | Algunos estados, inconsistentes | Matriz completa, incluido foco visible |
| 10 | **Vacío / error / carga** | Se muestra `null`, tabla vacía o spinner eterno | Hay algo, pero no distingue casos | Los cuatro estados están diseñados y explican |
| 11 | **Accesibilidad** | `div` clickeable, sin labels, foco invisible | Teclado parcial | Teclado, nombres, ARIA y contraste correctos |
| 12 | **Responsive** | Se rompe a 360 px | Funciona, pero oculta algo crítico | 360/768/1280 probados sin pérdida |
| 13 | **Copy y datos** | Texto genérico, moneda/fecha mal | Correcto con detalles | Claro, específico, es-MX y con unidades |
| 14 | **Consistencia con el repo** | Hex nuevos, otro patrón de botón/tema | Reutiliza parcialmente | Usa tokens, componentes y shells existentes |

**Total: 28.** Interpretación:

- **25–28:** listo.
- **20–24:** entregable con deuda menor; anota los puntos.
- **14–19:** no entregar sin corregir bloqueantes.
- **< 14:** replantear la pantalla, no pulirla.

## 2. Bloqueantes absolutos

Si cualquiera falla, no importa el resto:

- [ ] No se puede completar la tarea principal con teclado.
- [ ] El foco es invisible o queda atrapado.
- [ ] Texto normal por debajo de 4.5:1.
- [ ] Un botón que cobra, elimina o envía no se puede deshacer ni confirmar con claridad.
- [ ] Se muestra un total/precio calculado en el cliente distinto al del servidor.
- [ ] El estado de error no existe o miente (dice “vacío” cuando falló).
- [ ] La acción principal desaparece en móvil sin alternativa.
- [ ] Un modal apila otro modal.
- [ ] Hay `div`/`span` con `onClick` sin rol ni teclado.

## 3. Auditoría rápida por comandos

Desde la raíz del repo (PowerShell / bash con `rg`):

```bash
# Colores hex fuera de globals.css
rg -n "#[0-9a-fA-F]{3,8}" src --glob "*.tsx"

# Valores de espaciado arbitrarios
rg -n "\b(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|space-[xy])-\[[0-9]+px\]" src

# Tamaños de texto arbitrarios
rg -n "text-\[[0-9]+px\]" src

# transition-all (síntoma de animación sin criterio)
rg -n "transition-all" src

# div/span con onClick
rg -n "<(div|span)[^>]*onClick" src

# outline-none sin focus-visible en la misma clase (revisar manual)
rg -n "outline-none" src --glob "*.tsx"

# Placeholders y deuda
rg -n "TODO|FIXME|lorem|placeholder" src
```

El script `scripts/ui-audit.mjs` automatiza varias de estas comprobaciones:

```bash
node .opencode/skills/ui-design/scripts/ui-audit.mjs
node .opencode/skills/ui-design/scripts/ui-audit.mjs --json
```

## 4. Revisión visual en 60 segundos

1. Entrecerrar los ojos: ¿se distinguen título, dato y acción?
2. ¿Cuántos acentos compiten? (debe ser uno).
3. ¿Hay bordes que podrían ser espacio?
4. ¿El foco se ve al tabular?
5. ¿Los deshabilitados explican por qué?
6. ¿La tabla tiene números a la derecha y `tabular-nums`?
7. ¿El vacío se distingue del error?
8. ¿El precio/stock se entiende sin calcular?
9. ¿La densidad corresponde a la tarea?
10. ¿Se ve como esta app o como una plantilla?

### 4.1 Chequeos derivados de las fuentes

- [ ] **Reversibilidad:** ¿deshacer es más fácil que confirmar? (Cooper)
- [ ] **Errores:** ¿el sistema hace imposible el error o solo lo reporta? (Cooper)
- [ ] **Feedback modeless:** ¿hay algún diálogo reportando normalidad? (Cooper)
- [ ] **Satisficing:** ¿el primer CTA visible es el correcto? (Tidwell)
- [ ] **Reentrance:** ¿se pierde el formulario/configuración al volver? (Tidwell)
- [ ] **Memoria espacial:** ¿se movió un control sin motivo? (Tidwell)
- [ ] **Intermedios:** ¿hay atajos o presets para quien ya sabe? (Cooper)
- [ ] **Peak-end:** ¿el final del flujo (éxito/confirmación) está cuidado? (Laws of UX)
- [ ] **Squint test:** ¿se distinguen tres niveles sin esfuerzo? (Cooper)
- [ ] **Grid:** ¿todo cae en múltiplos de 4 y las proporciones son exactas? (Cooper)
- [ ] **Dark patterns:** ¿defaults, urgencia o cancelación difícil? (Laws of UX)
- [ ] **Copy de error:** ¿ilumina y ofrece salida, sin culpar? (Cooper)
- [ ] **Timing:** ¿hay feedback antes de 400 ms? (Doherty)
- [ ] **Aesthetic mask:** ¿la UI sigue funcionando sin estilos? Si no, la estética está tapando un problema.
- [ ] **Skeleton:** ¿se midió contra la UI real y Δ ≤ 2 px? (`09-skeleton-audit.md`)

### 4.2 Pruebas de 10 minutos

1. **5 segundos:** qué es, qué destaca, qué haría.
2. **Primer clic:** ¿va al lugar correcto?
3. **Trunk test:** tapa todo menos el header; ¿sabe dónde está?
4. **Prueba del error:** red caída, formulario vacío, combinación inválida.
5. **Teclado:** completa la tarea sin ratón.
6. **Zoom 200 %:** nada se corta ni desaparece.
7. **Reduced motion:** la UI sigue siendo comprensible.
8. **Red lenta:** ¿hay estados de carga honestos?

## 5. Formato de reporte

```markdown
## Veredicto
[Una frase: listo / deuda menor / no entregar, con la razón principal.]

Puntaje: XX/28

## Bloqueantes
1. `src/app/(admin)/admin/pcs/page.tsx:42` — La tabla no tiene estado vacío; con 0 filas
   se ve el header y nada más. Agregar empty state con CTA “Actualizar precios”.

## Importantes
1. `src/components/shop/configurator.tsx:216` — El botón “Agregar” no muestra estado
   de carga y permite doble envío. Deshabilitar + “Agregando…”.

## Menores
1. `src/components/admin/pc-table.tsx:44` — Usar `tabular-nums` también en la columna
   de ahorro para alinear decimales.

## Lo que funciona
- La jerarquía del hero y el uso de un solo acento azul en la tienda.
```

Reglas del reporte:

- Ordenar por impacto, no por archivo.
- Cada hallazgo: ubicación + qué viola + arreglo concreto.
- No reportar gustos sin principio; si es preferencia, dilo.
- No reescribir toda la pantalla si el problema es local.
- Si algo no se puede verificar (contraste real, lector de pantalla), decirlo.

## 6. Prioridad de arreglo

1. **Bloqueantes de tarea** (no puedo completar, no entiendo, perdí datos).
2. **Accesibilidad** (teclado, foco, contraste, labels).
3. **Estados faltantes** (vacío, error, carga).
4. **Jerarquía y estructura** (lo que hace que se lea).
5. **Consistencia** (tokens, componentes, patrones).
6. **Pulido** (microinteracciones, sombras, radios).

No empieces por el pulido. Una sombra perfecta sobre una tabla sin estado vacío sigue siendo una tabla rota.
