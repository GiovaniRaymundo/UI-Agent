# Capa 2 · Arquitectura y patrones de interfaces complejas

Esta capa responde: **¿qué estructura soporta estos datos y este trabajo?** Si la respuesta por defecto es “una cuadrícula de tarjetas”, todavía no hay arquitectura.

## 1. Atomic Design aplicado

| Nivel | Qué es | En este repo | Regla |
| --- | --- | --- | --- |
| **Tokens** | Decisiones primitivas: color, espacio, tipo, radio, sombra, tiempo | `globals.css`, utilidades (`brand-gradient`, `shop-card`) | Ningún valor nuevo si ya existe un token |
| **Átomos** | Un elemento con un trabajo: botón, input, badge, icono | `src/components/ui/*` | Sin lógica de negocio; estados completos |
| **Moléculas** | Combinación pequeña con propósito: campo con label y error, fila de precio, tarjeta de opción | `components/shop/*` | Una responsabilidad; props explícitas |
| **Organismos** | Sección autónoma: tabla de PCs, configurador, header | `pc-table`, `configurator`, `shop-header` | Puede conocer datos; no conoce la ruta completa |
| **Plantillas** | Estructura de página sin contenido real | layouts de `(admin)`, `(shop)` | Define ritmo, contenedores y navegación |
| **Páginas** | Plantilla + datos + estados | `app/**/page.tsx` | Orquesta; no inventa estilos nuevos |

Reglas de composición:

- Un organismo no debe importar una página ni una ruta.
- Si un componente necesita más de ~7 props para renderizar, probablemente son dos componentes.
- Los nombres describen el rol, no el aspecto: `PriceSummary`, no `BoxWithBorder`.
- La misma molécula se reutiliza en contextos distintos; si cambia de comportamiento según la página, pásale el comportamiento, no lo adivines con `usePathname`.

## 2. Elegir estructura según la forma de los datos

| Situación | Patrón correcto | Patrón equivocado |
| --- | --- | --- |
| 4–12 ítems con 2–3 atributos, comparación visual | Cuadrícula de tarjetas | Tabla de 10 columnas |
| Muchos ítems con 5+ atributos, escaneo y orden | Tabla | Tarjetas repetidas |
| Ítems que se exploran por categorías/atributos | Facetas + lista + detalle | Menú desplegable gigante |
| Un registro con mucho detalle y una lista para cambiar de registro | Master-detail | Modal sobre modal |
| Comparar 2–4 opciones atributo por atributo | Tabla comparativa | Cuatro tarjetas con párrafos |
| Configurar un producto con dependencias | Configurador con resumen persistente | Wizard de 15 pasos sin contexto |
| Monitorear el estado del sistema | Dashboard con KPIs + tendencia + excepciones | Landing con hero |
| Editar un registro pequeño | Edición en línea o panel lateral | Página nueva completa |
| Capturar datos guiados | Formulario de una columna o wizard corto | Formulario de 3 columnas |
| Navegar una jerarquía profunda | Árbol/sidebar + breadcrumb | Tabs anidados |
| Acción frecuente entre muchas | Barra de acciones contextual + atajos | Botón escondido en un menú |

### 2.1 Las cuatro funciones de una página (Tidwell)

Antes de elegir un patrón, decide cuál de estas cuatro es la función **primaria**:

| Función | Pregunta | Patrones base |
| --- | --- | --- |
| **Mostrar una sola cosa** | ¿La página existe para ver/leer/explorar un objeto? | Center Stage, Alternative Views, Deep-linked State, Many Workspaces |
| **Mostrar una lista** | ¿El usuario viene a encontrar, comparar o elegir entre varios? | Feature/Search/Browse, Sortable Table, Two-Panel Selector, Thumbnail Grid, Facets, Pagination |
| **Dar herramientas para crear** | ¿Va a construir o configurar algo? | Canvas Plus Palette, Wizard, Preview, Good Defaults, Multi-Level Undo |
| **Facilitar una tarea** | ¿Solo necesita completar un proceso corto? | Formularios, Wizard, Settings Editor, Progress Indicator, Same-Page Errors |

Si la pantalla intenta hacer las cuatro, no tiene arquitectura. El catálogo completo de patrones está en `07-tidwell-patterns.md`.

## 3. Navegación

- **Máximo 3 niveles** visibles. Si necesitas un cuarto, probablemente falta un patrón master-detail o una búsqueda.
- **Sidebar** para 5–7 secciones primarias del admin. Si hay más, agrupa con encabezados; no metas 15 links.
- **Tabs** para vistas pares del *mismo* registro (Resumen / Piezas / Historial), no para navegación global.
- **Breadcrumb** cuando hay depth real (`Admin / PCs / Nova / Piezas`). No en el nivel raíz.
- **Estado en la URL:** filtros, búsqueda, selección y paginación. Un admin que pierde el filtro al recargar está roto.
- **Volver** debe conservar scroll, filtros y selección.
- **Móvil:** sidebar → drawer o barra inferior; tabs → scroll horizontal con indicador; nunca una tabla de 12 columnas encogida.

### Item activo

Un solo item activo por navegación. Señálalo con al menos dos canales (fondo + barra/indicador o color + peso), no solo con color. En este repo ya se usa `bg-sidebar-accent` + `shadow-[inset_2px_0_0_var(--primary)]`; consérvalo.

### 3.1 Inflectar la navegación (Cooper)

Organiza por **frecuencia de uso**, **grado de dislocación** y **riesgo**, no por “todas las features merecen un link”:

- Lo que se usa muchas veces al día: a un clic, en sidebar o barra.
- Lo que se usa una vez al día: a uno o dos clics.
- Lo que se usa rara vez pero aporta: en menú, “avanzado” o ajustes; no lo borres, pero no ocupa el espacio diario.
- Lo que cambia el contexto o el layout: más profundo.
- Lo irreversible o peligroso: más profundo, separado y protegido.

El disclosure progresivo debe recordar su estado (“sticky”): si el usuario abrió “opciones avanzadas”, no se las cierres en la siguiente visita.

## 4. Encabezado de página (herramientas)

```
Título (20–24 px, semibold)        [Acción secundaria] [Acción primaria]
Descripción / metadatos (13–14 px, muted)
────────────────────────────────────────────────────────────
```

- El título dice **qué** es la página, no “Bienvenido”.
- Los metadatos responden: ¿de cuándo son los datos?, ¿cuántos hay?, ¿estoy filtrando?
- No pongas un hero, una ilustración grande ni un párrafo motivacional en admin.
- La acción primaria va a la derecha y no se repite al final de la página salvo en formularios largos.
- En móvil, el título no se parte; las acciones colapsan a iconos con `aria-label`.

## 5. Dashboards

Orden de lectura:

1. **3–5 KPIs** máximo, cada uno con valor, unidad, periodo y comparación. Un KPI sin contexto es decoración.
2. **Tendencia principal** (una gráfica) que responda la pregunta más importante.
3. **Desglose o excepciones** (tabla o lista) que permita actuar.
4. **Detalle secundario** bajo demanda.

Reglas:

- Números alineados a la derecha y `tabular-nums`.
- Formato local (`es-MX`, MXN) y periodo explícito (“últimos 30 días”, “precios del 12 oct, 18:40”).
- No uses pie charts para más de 3 categorías; usa barras.
- No uses una gráfica si el dato se responde mejor con un número grande.
- El estado vacío de un dashboard explica qué falta para que aparezca.
- Un dashboard operativo prioriza “qué requiere acción hoy”, no “cuánto hemos crecido”.

## 6. Tablas de datos

### Anatomía

```
Título / conteo            [Buscar] [Filtros] [Columnas] [Exportar]
┌─────────────────────────────────────────────────────────────┐
│ □  Columna A ↑   Columna B      Numérica →      Estado       │
│ □  ...                                                       │
└─────────────────────────────────────────────────────────────┘
[Seleccionados: 3]  [Acción masiva]        Paginación / rango
```

### Reglas

- **Alineación:** texto a la izquierda, números y fechas a la derecha, estado/badge a la izquierda o centrado consistente.
- **Ancho:** las columnas de texto largo truncan con tooltip o link al detalle; nunca rompen la fila.
- **Jerarquía:** una columna fuerte (nombre/ID) y el resto secundario. No todas en negrita.
- **Densidad:** filas de 36–44 px en admin; 44–56 px si hay interacción táctil. `tabular-nums` siempre en dinero.
- **Header sticky** si hay scroll; fondo opaco, no transparente sobre filas.
- **Hover** en toda la fila; la fila completa es clickeable si lleva a un detalle, pero los controles internos no deben disparar la navegación.
- **Ordenamiento:** indicador visible (`aria-sort`), ciclo claro (asc → desc → ninguno), y orden por defecto que tenga sentido.
- **Selección:** checkbox por fila + “seleccionar todo lo filtrado”, barra contextual con conteo y “limpiar”.
- **Paginación** si el usuario necesita saber cuántos hay o comparar; scroll infinito solo en feeds. Nunca infinite scroll en una tabla operativa.
- **Columnas configurables** cuando hay más de 7; recuerda la elección.
- **Estados:** loading con skeleton de filas, vacío inicial, cero resultados, error con reintento, sin permiso.
- **Responsive:** debajo de 768 px cambia a lista de tarjetas con 2–3 datos clave y el resto en el detalle; no ocultes columnas sin decirlo.

## 7. Master-detail

- Lista de 280–360 px, detalle flexible; en pantallas < 1024 px se apila o se navega a una vista dedicada.
- La selección es explícita y sobrevive a la recarga si el estado está en la URL (`?selected=`).
- Al cambiar de registro no pierdas el scroll de la lista.
- Navegación con flechas arriba/abajo y `Enter` para abrir.
- El detalle tiene su propio encabezado, acciones y estados; no es un panel “de relleno”.
- Si el detalle es editable, muestra estado sucio y guardado; no mezcles autosave con un botón “Guardar” ambiguo.

## 7.1 Edición en línea, comparación y comandos

### Edición en línea

- Úsala para cambiar **un campo** sin salir del contexto (precio, margen, stock, nombre). Para editar 3+ campos, abre un panel o una página.
- El affordance debe verse: lápiz, subrayado punteado o hover claro. No obligues a adivinar que el texto es editable.
- `Enter` guarda, `Esc` cancela, clic fuera guarda solo si el valor es válido. Nunca pierdas lo escrito.
- Muestra estado sucio y guardado (“Guardando…”, “Guardado”). Si falla, conserva el valor y permite reintentar.
- No uses edición en línea para acciones destructivas ni para campos con dependencias.
- En tablas, la celda editable no debe disparar la navegación de la fila.

### Comparación

- De 2 a 4 opciones; más de 4 deja de ser comparable.
- Primera columna fija con el atributo; columnas alineadas y unidades iguales.
- Destaca **solo las diferencias** (fondo sutil o marca), no toda la tabla.
- Ofrece “Mostrar solo diferencias” cuando hay más de ~10 filas.
- La opción recomendada se marca con una razón, no con un badge vacío.

### Paleta de comandos

- Atajo `⌘/Ctrl+K` visible en el header o en la ayuda.
- Búsqueda difusa por nombre, ruta y sinónimos; resultados agrupados (Ir a, Acciones, Recientes).
- Navegación con flechas, `Enter` ejecuta, `Esc` cierra y devuelve el foco.
- Muestra el atajo al lado de cada acción.
- Acciones destructivas piden confirmación o quedan excluidas.
- Debe funcionar sin ratón y anunciar el resultado con `aria-live` si no cambia de pantalla.

## 8. Facetas, búsqueda y filtros

- **Facetas con conteo** (“GPU: 12”, “Sin stock: 3”) y resultado de aplicar el filtro.
- **Chips** de filtros activos, cada uno removible, y “Limpiar todo”.
- **Cero resultados:** di cuántos hay sin filtros, cuál filtro probablemente sobra y ofrece limpiarlo.
- **Búsqueda:** placeholder que diga qué busca (“Nombre, slug o tienda”), resultados tolerantes a acentos y mayúsculas, y estado “buscando”.
- **Filtros y búsqueda se combinan**, no se pisan.
- En móvil, filtros en un drawer con botón “Ver N resultados” fijo.
- No apliques un filtro sin que el usuario lo vea: el conteo y los chips son la prueba.

## 9. Formularios

- **Una columna** de 480–640 px; dos columnas solo para pares cortos (ciudad/CP) y nunca para texto largo.
- **Label arriba**, visible, asociado con `htmlFor`. Placeholder no es label.
- Agrupa por significado con encabezados de sección y espacio, no con fieldsets de 12 bordes.
- **Obligatorio** se marca una vez (“* obligatorio”) o se infiere; no repitas el asterisco en cada campo sin leyenda.
- **Validación:** al salir del campo; resumen al enviar; foco al primer error; nunca borres valores.
- **Defaults** para lo que ya sabes (ciudad, última dirección, moneda).
- **Botón primario** al final del formulario, alineado al inicio de la columna de campos; “Cancelar” como texto.
- **Éxito:** confirma qué se guardó y qué sigue, no solo “Listo”.
- **Formularios largos:** guarda borrador local o advierte al salir con cambios sin guardar.

### Wizard

- 3–5 pasos; si son más, agrupa.
- Indicador de progreso con nombre de paso, no solo bolitas.
- Permite volver sin perder datos.
- Paso final de revisión con los datos clave y edición directa.
- Nunca bloquees “Atrás” por validación del paso actual.

### 9.1 Comando vs configuración (Cooper)

- **Invocar no es configurar.** El usuario ejecuta una acción muchas veces y la configura una vez; no le muestres el panel de configuración en cada ejecución.
- El comando usa el **último valor o un default razonable**; la configuración vive en un lugar aparte (menú, ajustes, “Avanzado”).
- Ejemplo: “Actualizar precios” ejecuta con la configuración guardada; “Configurar actualización” abre las opciones. No un modal de 8 campos cada vez.
- **No empieces con un lienzo en blanco:** precarga la última configuración, la plantilla o los datos del pedido. El usuario ajusta, no redacta desde cero.
- Si el usuario ya ve un dato, puede editarlo ahí (edición en línea) en lugar de “pedir permiso” y navegar a otra pantalla.

## 10. Configurador (caso PC Store)

El configurador es una herramienta de decisión, no una ficha de producto.

- **Layout:** preview 3D sticky (o fija al hacer scroll) + columna de opciones (560–680 px) + barra de compra persistente.
- **Secciones ancladas** por categoría, con el preview enfocando la pieza al entrar en pantalla. Ya existe `IntersectionObserver`; consérvalo y respeta `prefers-reduced-motion`.
- **Cada opción muestra:** nombre, miniatura, delta de precio, disponibilidad y por qué está deshabilitada. “Sin stock hoy” es información, no un botón muerto sin explicación.
- **Costo total siempre visible:** precio base, delta de la selección y total. Nunca obligues a sumar.
- **Dependencias visibles:** si una elección invalida otra, explica (“Este gabinete no admite GPU vertical”) y ofrece la alternativa.
- **Resumen** antes de agregar: qué se lleva, qué se mantiene, precio final.
- **Deshacer** la última elección, no solo “restablecer todo”.
- **Teclado:** cada grupo es un radiogroup; flechas cambian opción; el foco no se pierde al actualizar el precio.
- **Móvil:** preview arriba con altura acotada, resumen de precio fijo abajo, opciones en acordeón. Nunca un canvas de 100vh que impida llegar a las opciones.

## 11. Ajustes y configuración

- Secciones por tema, no una página de 40 switches.
- Decide el modelo de guardado y dilo: **inmediato** (con confirmación sutil) o **explícito** (botón Guardar). No mezcles.
- Los cambios con efecto costoso (recalcular precios, reindexar) muestran progreso y resultado.
- **Zona peligrosa** separada, con consecuencia escrita y confirmación por nombre.
- Los valores por defecto se pueden restaurar.

## 12. Responsive

| Breakpoint | Qué cambia |
| --- | --- |
| < 640 | Una columna; acciones en barra inferior; tablas → tarjetas; nav → drawer |
| 640–1023 | Dos columnas selectivas; sidebar colapsable; preview del configurador arriba |
| 1024–1279 | Layout completo de escritorio; sidebar visible; densidad normal |
| ≥ 1280 | Contenedor máximo (1120 tienda, fluido admin); no estirar texto a 1600 px |

- No ocultes funcionalidad crítica en móvil: reubícala.
- Targets táctiles ≥ 44 px y separación ≥ 8 px.
- Prueba zoom al 200 %: nada debe cortarse ni quedar inaccesible.
- Respeta safe areas y el teclado virtual en formularios.

## 13. Contenido y copy

- Español claro, sentence case (“Agregar a la bolsa”, no “AGREGAR A LA BOLSA”).
- Verbos de acción concretos: “Confirmar pedido”, no “Continuar” si ya sabes qué hace.
- Números con formato `es-MX` y moneda `MXN`; unidades explícitas (GB, TB, W, mm).
- Estados con voz activa y sin culpar: “No pudimos actualizar los precios. Reintentar”.
- Fechas relativas + absolutas cuando importan (“hace 2 h · 12 oct, 18:40”).
- No uses “OK” como única salida de un diálogo; di la acción (“Eliminar”, “Descartar”).
