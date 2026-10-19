# Capa 4 · Componentes y accesibilidad

## 1. Base técnica de este repo

- **shadcn/ui estilo `base-nova`** con **Base UI** (`@base-ui/react/*`), no Radix.
- Componentes en `src/components/ui/*`, con `data-slot` en cada parte y `cn` (paquete `cn`, re-exportado en `@/lib/utils`).
- Variantes con `class-variance-authority` (`cva`); tamaños y variantes como props, no clases sueltas en la página.
- Tailwind v4 CSS-first: tokens en `src/app/globals.css` (`@theme inline` y variables `:root` / `.dark` / `.apple`). No hay `tailwind.config`.
- Iconos: `lucide-react`, tamaño 16 (`size-4`) por defecto, `strokeWidth` 1.75–2.
- Server Components por defecto; `"use client"` solo cuando hay estado, efectos o APIs del navegador.

Reglas al crear un componente:

1. Vive en `components/ui` si es genérico; en `components/shop` o `components/admin` si es del dominio.
2. Acepta `className` y lo combina al final con `cn`, para permitir ajustes sin romper el diseño base.
3. Expone `data-slot` y estados (`data-state`, `aria-*`) para estilos condicionales.
4. No incrusta colores hex; usa tokens.
5. Documenta en el nombre la intención (`DestructiveConfirm`, no `RedButton`).

Antes de crear uno nuevo, revisa si ya existe: `badge`, `button`, `card`, `input`, `progress`, `scroll-area`, `select`, `separator`, `skeleton`, `slider`, `switch`, `table`, `tabs`, `tooltip`.

## 2. Diálogos, errores y confirmaciones (leer antes de las recetas)

Un diálogo es **otra habitación**: solo entras si hay una razón. No es el lugar para reportar normalidad, para pedir permiso por rutina ni para preguntar lo que puedes resolver con un default.

### Cuándo sí

- Tarea corta y enfocada que sale del flujo principal.
- Información de un solo sujeto que necesita concentración.
- Decisión irreversible que de verdad requiere atención (raro).

### Cuándo no

- Formularios largos o contenido navegable → página o panel.
- Mensajes informativos → feedback modeless.
- Errores de campo → inline, junto al campo.
- “¿Seguro?” de acciones reversibles → undo.
- Reportar que algo salió bien → toast/estado, no modal.

### Alertas y confirmaciones

- **“Do, don't ask”:** actúa con un default razonable y ofrece deshacer. Preguntar todo es transferirle la indecisión al usuario.
- **Haz todo reversible:** papelera, historial, borrador, versiones. Es mejor que cualquier confirmación.
- Una confirmación solo funciona si el usuario **casi siempre cancelaría**; si suele aceptar, se vuelve rutina y deja de proteger.
- Si confirmas: nombra el objeto, la consecuencia y las opciones concretas (“Eliminar pedido #128 · Esta acción no se puede deshacer”), no “OK/Cancelar”.
- Diálogo de error = **último recurso**: educado, iluminador, útil; conserva lo escrito, explica el alcance y ofrece una solución. Nunca culpes al usuario.

### Superficies transitorias (diálogos, popovers, sheets)

- Una sola ventana/vista; si necesitas otra, el diseño está mal.
- Etiquetas explícitas: “Configurar preferencias”, no “Setup”.
- Targets grandes y texto legible; se usan de vez en cuando.
- Recuerda posición, tamaño y valores entre invocaciones.
- Nada de scrollbars minúsculos ni interacciones de precisión.

## 2.1 Recetas

### Button

**Anatomía:** contenedor (`button` o Base UI) → icono opcional → label.

- Una sola variante `default` (sólida) por vista. `outline`, `secondary`, `ghost`, `link` para el resto. `destructive` es para confirmar destrucción, no para “cancelar”.
- Tamaños: `sm` 28 px, `default` 32 px, `lg` 36 px, `icon` 32×32. En táctil, usa al menos 44 px de área (puede ser padding invisible).
- Icono solo: `aria-label` obligatorio y tooltip.
- Estado de carga: mantén el ancho, deshabilita, muestra spinner + texto (“Guardando…”).
- `type="button"` explícito dentro de formularios; `type="submit"` solo en el submit real.
- No uses `div` con `onClick` como botón.

### Campo de texto (Input + Field)

**Anatomía:** label → control → ayuda → error.

```
<label for="email">Correo</label>
<input id="email" aria-describedby="email-help email-error" aria-invalid="true" />
<p id="email-help">Lo usamos para confirmar tu pedido.</p>
<p id="email-error" role="alert">Falta el dominio del correo.</p>
```

- Label visible siempre; el placeholder es un ejemplo, no el nombre del campo.
- `autocomplete` correcto (`email`, `tel`, `name`, `postal-code`).
- Error después de blur, no en cada tecla; al enviar, foco al primer error.
- No deshabilites el campo para “proteger” un valor: usa `readOnly` y explica.
- Ancho proporcional al contenido esperado; no todos a 100 %.

### Formularios: patrones que evitan errores (Tidwell)

| Patrón | Cuándo usarlo | Regla |
| --- | --- | --- |
| **Forgiving Format** | Teléfono, fecha, código, tarjeta | Acepta espacios, guiones y formatos variables; normaliza al guardar y muestra el formato canónico |
| **Structured Format** | Formato rígido por naturaleza | Segmenta el campo (fecha, tarjeta) y avanza el foco automáticamente |
| **Input Hints** | El formato no es obvio | Ejemplo + requisito junto al campo, no solo en placeholder |
| **Good Defaults** | La opción más probable se puede predecir | Preselecciona, muestra la elección y permite cambiarla |
| **Same-Page Error Messages** | Validación | Error junto al campo, con el valor conservado y `aria-describedby` |
| **Autocompletion** | Conjunto grande o texto repetido | Sugiere mientras escribe; no impone ni bloquea valores nuevos |
| **Dropdown Chooser** | Conjunto conocido y acotado | Si supera ~15, usa combobox con búsqueda |
| **List Builder** | Selección múltiple de un conjunto | Dos columnas disponibles/seleccionados + mover; no “ctrl+clic” oculto |
| **Password Strength Meter** | Contraseña nueva | Mide y explica; no bloquea una contraseña válida |
| **Input Prompt** | Ayuda visual | Es un ejemplo dentro del campo; **nunca sustituye el label** |

No apliques estos patrones por moda: cada uno responde a un tipo de dato y a un error concreto.

### Select / Combobox

- **Select** para 5–15 opciones conocidas. **Combobox con búsqueda** para más de 15 o valores con texto.
- Muestra la opción seleccionada completa; trunca solo si hay tooltip.
- Teclado: `Enter`/`Space` abre, flechas navegan, `Esc` cierra, escribir busca si es combobox.
- `aria-expanded`, `aria-controls`, `aria-activedescendant` los maneja el primitivo; no los sobrescribas.
- Estado vacío: “Sin resultados para ‘X’” + opción para limpiar.
- En formularios, incluye una opción “Selecciona…” solo si el valor puede quedar vacío.

### Dialog / Modal

- Usa modal solo para: tarea corta y enfocada, información de un solo sujeto, o una decisión irreversible que no se puede resolver con undo. Para formularios largos o contenido navegable, usa página o panel lateral.
- **No uses el modal como confirmación rutinaria.** Si la acción es reversible, hazla y ofrece “Deshacer”. Si es irreversible y de alto impacto, confirma con el objeto y la consecuencia; nunca con un “¿Seguro?” genérico.
- No reportes normalidad en un modal (“guardado”, “conexión establecida”): eso va en feedback modeless.
- Anatomía: título obligatorio, descripción opcional, cuerpo, acciones (secundaria izquierda, primaria derecha).
- Comportamiento: focus trap, `Esc` cierra, clic en backdrop cierra salvo cambios sin guardar, foco vuelve al disparador.
- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` al título.
- No apiles modales. Si necesitas otro, es señal de que el primero debía ser una página.
- En móvil, considera sheet a pantalla completa.
- Nunca uses un modal para un mensaje informativo que cabe en la página.

### Popover, Menu y Context menu

- **Popover:** contenido interactivo anclado (filtros, detalle breve). **Menu:** lista de acciones. No mezcles navegación y acciones sin separadores.
- Teclado: flechas, `Home`/`End`, `Esc` cierra y devuelve foco, `Tab` sale del menú.
- `role="menu"`/`menuitem` para acciones; `role="dialog"` para popover con formulario.
- Cierra al hacer clic fuera o al elegir una acción (salvo selección múltiple).
- Coloca el ítem destructivo al final, separado, con color `destructive`.
- En filas de tabla, el menú “⋯” necesita `aria-label` que incluya el registro (“Acciones para Nova”).

### Tabs

- Para vistas pares del mismo objeto; no para pasos (usa wizard) ni navegación global.
- Una pestaña activa, visible con color + indicador, no solo color.
- Teclado: flechas mueven entre tabs, `Tab` entra al panel.
- El panel mantiene el estado al cambiar si el usuario espera volver.
- Si hay más de 6 tabs, reconsidera la arquitectura (sidebar o segmentos).

### Tabla

- Usa `<table>` real con `<thead>`, `<th scope="col">`, `<caption>` (puede ser visualmente oculta).
- Ordenamiento: `aria-sort="ascending|descending|none"` en el `th` correspondiente y botón dentro.
- Filas seleccionables: checkbox con `aria-label` (“Seleccionar Nova”), estado indeterminado en “todo”.
- Números a la derecha, `tabular-nums`; texto a la izquierda.
- No uses tabla para layout.
- En móvil, transforma a lista de tarjetas o permite scroll horizontal con la primera columna fija; no ocultes datos críticos.
- Paginación: indica rango y total (“1–25 de 348”), deshabilita bordes correctamente.

### Toast / Notificación

- Para confirmaciones efímeras y errores no bloqueantes. No para errores de campo ni decisiones.
- `aria-live="polite"` para éxito, `assertive` para error crítico (con moderación).
- 4–6 s de duración; pausa al hover/focus; botón de cerrar.
- No dupliques el mismo mensaje; agrupa.
- La acción importante debe seguir visible en la página, no solo en el toast.

### Tooltip

- Solo para aclarar iconos o texto truncado; no para información esencial ni para instrucciones largas.
- Aparece con hover **y** focus; `Esc` lo cierra.
- No lo pongas en elementos deshabilitados (no reciben foco): explica el deshabilitado en texto visible.

### Skeleton y carga

- El skeleton imita la forma y el tamaño del contenido final, no un bloque genérico.
- **Mídelo, no lo dibujes a ojo:** marca el contenido real con `data-skeleton-target="<id>"` y el skeleton con `data-skeleton="<id>"`, y corre `scripts/skeleton-audit.mjs` (ver `09-skeleton-audit.md`). Compara alto en 360/768/1280 y ajusta hasta que `Δ ≤ 2 px`.
- Un skeleton que mide distinto provoca layout shift; en ese caso es más honesto un spinner o un estado de carga con la estructura correcta.
- No muestres skeleton para cargas < 300 ms.
- Respeta `prefers-reduced-motion` en el pulso.
- Si la carga falla, reemplaza el skeleton por error con reintento.
- Para refrescar datos, mantén el contenido anterior con opacidad y un indicador local.
- El estado vacío y el error no muestran skeleton.

### Empty state

- Icono o ilustración discreta + título + una frase que explique + CTA.
- Distingue: nunca hubo datos / filtro sin resultados / error / sin permiso.
- No uses una ilustración gigante en admin; ocupa 1/3 y deja ver la acción.

### Badge / estado

- Texto + color + (icono si aporta). No uses solo un punto de color.
- Variantes semánticas consistentes: neutral, info, éxito, advertencia, peligro.
- Para stock: “Sujeto a stock” (ámbar) y “Sin stock completo” (destructivo) ya existen; no inventes un tercer tono para lo mismo.
- Los badges no son botones; si se pueden quitar (chips de filtro), usa un botón con `aria-label`.

### Switch, checkbox, radio

- Switch = efecto inmediato; checkbox = selección que se confirma; radio = una opción de un conjunto visible.
- Label clickeable, área de 44 px en táctil.
- No uses switch para algo que requiere “Guardar”.
- Grupo de radios con `fieldset`/`legend` o `role="radiogroup"` + `aria-labelledby`.

### Slider (configurador)

- Valor visible siempre, con unidad y rango.
- Teclado: flechas ±1, `PageUp/Down` ±10, `Home`/`End` extremos.
- No lo uses para valores que necesitan precisión exacta sin input numérico complementario.
- En móvil, thumb ≥ 24 px visibles con área táctil ≥ 44 px.

## 3. Manejo de foco

1. Al abrir un overlay, el foco entra al primer elemento lógico (título o primer campo), no al botón de cerrar.
2. Al cerrar, vuelve exactamente al disparador.
3. El foco nunca queda atrapado fuera de la vista ni se pierde al actualizar datos.
4. `tabindex="0"` solo en regiones desplazables o elementos interactivos no nativos; nunca positivo.
5. Skip link (“Saltar al contenido”) en layouts con navegación larga.
6. El foco visible usa `:focus-visible`, no `:focus` para todo.
7. Al mover foco por código, usa `preventScroll` si el salto molesta y asegúrate de que el elemento sea enfocable.

## 4. ARIA: mínimo necesario

| Patrón | Roles/estados clave |
| --- | --- |
| Diálogo | `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby` |
| Menú | `role="menu"`, `menuitem`, `aria-haspopup`, `aria-expanded` |
| Listbox/combobox | `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, `aria-selected` |
| Tabs | `role="tablist"`, `tab`, `tabpanel`, `aria-selected`, `aria-controls` |
| Tabla ordenable | `aria-sort`, botón en el header |
| Acordeón | `button` con `aria-expanded` + `aria-controls`, región con `role="region"` |
| Estado | `aria-live="polite"` / `assertive`, `role="status"` / `alert` |
| Carga | `aria-busy="true"`, texto “Cargando…” para lectores |
| Error | `aria-invalid`, `aria-describedby`, `role="alert"` en el mensaje |

Primera regla de ARIA: usa el elemento nativo correcto. `button`, `a`, `input`, `select`, `table`, `dialog`. ARIA solo cuando no hay nativo.

## 5. WCAG 2.2 AA: checklist

- [ ] Contraste 4.5:1 / 3:1 en ambos temas.
- [ ] Todo funciona con teclado, sin trampas y en orden lógico.
- [ ] Foco visible y no oculto por headers sticky.
- [ ] Nombres accesibles en iconos, imágenes y campos.
- [ ] Errores identificados por texto, no solo color.
- [ ] Targets ≥ 24×24 px (recomendado 44 en táctil).
- [ ] Zoom 200 % sin pérdida de contenido.
- [ ] `prefers-reduced-motion` respetado.
- [ ] Idioma declarado (`<html lang="es">`, ya presente).
- [ ] Títulos jerárquicos (`h1` → `h2` → `h3`, sin saltos).
- [ ] No hay contenido que parpadee > 3 veces por segundo.
- [ ] Enlaces con texto descriptivo (no “clic aquí”).
- [ ] Formularios con label, ayuda y error asociados.
- [ ] Contenido nuevo anunciado con `aria-live` cuando no hay cambio de foco.

## 6. Texto alternativo

- **Informativa:** describe la información (“Gabinete panorámico con panel lateral de vidrio”).
- **Decorativa:** `alt=""` (no omitas el atributo).
- **Funcional (icono dentro de botón):** el `aria-label` del botón describe la acción; la imagen es decorativa.
- **Render 3D:** describe el objeto y su función, no la cámara (“Vista frontal de la PC Nova”).
- No empieces con “Imagen de…”; el lector ya lo anuncia.

## 7. Patrones de carga y error por componente

| Componente | Carga | Error |
| --- | --- | --- |
| Tabla | Filas skeleton con mismas columnas | Fila de error con reintento, conserva header |
| Card | Skeleton con la forma de la card | Mensaje dentro de la card + reintento |
| Botón | Spinner + texto, deshabilitado | Vuelve a habilitar + toast/inline |
| Página | Suspense con skeleton del layout | `error.tsx` con explicación y reintento |
| Imagen | Fondo con proporción reservada | Placeholder con icono, no layout shift |
| 3D | Estado “Cargando modelo” + porcentaje si es posible | Fallback estático + mensaje |

## 8. Reglas de implementación

- No bloquees el scroll del body sin restaurarlo al cerrar un overlay.
- No uses `window.confirm`/`alert` en producto; usa el patrón del sistema.
- No pongas `onClick` en `div`/`span`; usa `button`.
- No deshabilites el zoom (`user-scalable=no`).
- No uses `autoFocus` en móvil (abre teclado inesperado); enfoca solo en desktop o tras una acción.
- No anides interactivos (`button` dentro de `a`, `input` dentro de `label` con botón).
- Los formularios deben funcionar con `Enter` y no enviarse dos veces.
- Todo cambio de datos debe tener confirmación visual y, si es destructivo, undo.
