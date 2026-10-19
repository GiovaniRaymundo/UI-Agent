# Catálogo de patrones · Designing Interfaces (Tidwell, 2.ª ed.)

Índice de patrones extraído del libro adjunto (preview de 58 páginas con el índice completo y los capítulos 1–2). Úsalo para **elegir estructura antes de dibujar**. No es una lista de componentes: es un mapa de decisiones.

## Cómo elegir

Toda página hace una de cuatro cosas (Tidwell, cap. 2):

1. **Mostrar una sola cosa** (mapa, libro, video, ficha).
2. **Mostrar una lista o conjunto** (resultados, productos, mensajes).
3. **Dar herramientas para crear** (editor, configurador, lienzo).
4. **Facilitar una tarea** (registro, compra, ajuste, formulario).

Si tu pantalla intenta hacer las cuatro, no tiene arquitectura. Elige una primaria y subordina el resto.

## Capítulo 1 · Lo que hacen los usuarios

| Patrón | Qué pide el usuario | Respuesta de diseño |
| --- | --- | --- |
| **Safe Exploration** | “Déjame explorar sin perderme ni meterme en problemas” | Undo multinivel, back predecible, estados reversibles, sin pop-ups |
| **Instant Gratification** | “Quiero lograr algo ahora, no después” | Primer éxito en segundos; quita registro, instrucciones y esperas del primer paso |
| **Satisficing** | “Esto es suficiente; no quiero aprender más” | CTA claros, labels cortos, layout que comunique, escape hatch |
| **Changes in Midstream** | “Cambié de opinión” | Reentrance: conserva estado, permite pausar y volver; no encierres en wizards |
| **Deferred Choices** | “No quiero responder eso ahora” | Pide lo mínimo, marca opcionales, buenos defaults, permite completar después |
| **Incremental Construction** | “Déjame cambiar esto y verlo” | Cambios pequeños, feedback inmediato, preview en vivo, sin recargas |
| **Habituation** | “Ese gesto funciona en todos lados” | Consistencia intra e inter-app; no cambies el significado de un gesto por modo |
| **Microbreaks** | “Tengo dos minutos” | Carga rápida, contenido útil primero, recordar posición, autenticación persistente |
| **Spatial Memory** | “Ese botón estaba aquí” | Posiciones estables; no reordenes controles ni menús; áreas personalizables |
| **Prospective Memory** | “Lo dejo aquí para acordarme” | Notas, borradores, bandejas, marcadores; no limpies lo que el usuario dejó |
| **Streamlined Repetition** | “¿Otra vez lo mismo?” | Atajos, macros, duplicar, aplicar a todos, valores recordados |
| **Keyboard Only** | “No me obligues a usar el ratón” | Tabulación lógica, atajos, flechas, Enter/Esc, accesibilidad |
| **Other People's Advice** | “¿Qué dijeron los demás?” | Reseñas, comentarios, actividad de pares, ayuda comunitaria |
| **Personal Recommendations** | “Me lo recomendó alguien” | Compartir con contexto, enlaces profundos, mensaje personal |

## Capítulo 2 · Arquitectura de información

| Patrón | Para qué |
| --- | --- |
| **Feature, Search, and Browse** | Portada con un destacado + búsqueda + navegación por categorías (tienda, catálogo) |
| **News Stream** | Contenido reciente primero, actualización continua, orden cronológico |
| **Picture Manager** | Gestionar imágenes: miniaturas, jerarquías, arrastrar, operar en lote |
| **Dashboard** | Estado del sistema de un vistazo: KPIs, tendencia, excepciones |
| **Canvas Plus Palette** | Editor: lienzo central + paleta de herramientas y propiedades |
| **Wizard** | Tarea larga o ramificada en pasos; solo cuando el usuario necesita ser guiado |
| **Settings Editor** | Preferencias dispersas que el usuario cambia sin un orden fijo |
| **Alternative Views** | Mismo contenido, distintas lentes (tabla/mapa/calendario) |
| **Many Workspaces** | Varios documentos o contextos en paralelo (pestañas, paneles) |
| **Multi-Level Help** | Ayuda contextual, referencia, tutorial y comunidad en capas |

## Capítulo 3 · Navegación y orientación

| Patrón | Para qué |
| --- | --- |
| **Clear Entry Points** | La portada dice qué se puede hacer y por dónde empezar |
| **Menu Page** | Página índice que organiza destinos antes de entrar |
| **Pyramid** | De lo general a lo específico en niveles; el usuario siempre sabe en cuál está |
| **Modal Panel** | Tarea corta y enfocada que interrumpe; no para navegación |
| **Deep-linked State** | URL/estado que reproduce filtros, selección y vista |
| **Escape Hatch** | Salida clara de un flujo o callejón (cancelar, volver, cerrar) |
| **Fat Menus** | Menú amplio con contexto y subtexto, no solo etiquetas |
| **Sitemap Footer** | Mapa completo en el pie para orientación y descubrimiento |
| **Sign-in Tools** | Acceso y cuenta sin convertir el login en un muro |
| **Sequence Map** | Mapa de pasos de un proceso largo con posición actual |
| **Breadcrumbs** | Ruta jerárquica y retorno a ancestros |
| **Annotated Scrollbar** | Barra con marcas de estructura, resultados o progreso |
| **Animated Transition** | Transición que explica el cambio de vista/estado |

## Capítulo 4 · Layout de página

| Patrón | Para qué |
| --- | --- |
| **Visual Framework** | Esqueleto repetido (header, nav, contenido, aside) que da identidad y orientación |
| **Center Stage** | Un contenido domina; el resto se subordina |
| **Grid of Equals** | Ítems homogéneos sin jerarquía interna (catálogo corto) |
| **Titled Sections** | Secciones con título y reglas claras de agrupación |
| **Module Tabs** | Vistas pares dentro de una misma área |
| **Accordion** | Secciones colapsables; una o varias abiertas |
| **Collapsible Panels** | Paneles secundarios que se ocultan para ganar espacio |
| **Movable Panels** | El usuario reordena/redimensiona paneles; recuerda posiciones |
| **Right/Left Alignment** | Etiquetas y controles alineados para escaneo |
| **Diagonal Balance** | Peso visual compensado sin simetría rígida |
| **Responsive Disclosure** | Revela complejidad conforme el usuario avanza |
| **Responsive Enabling** | Habilita el siguiente paso cuando el anterior es válido |
| **Liquid Layout** | El contenido se adapta al ancho sin romper jerarquía |

## Capítulo 5 · Listas

| Patrón | Para qué |
| --- | --- |
| **Two-Panel Selector** | Lista + detalle en la misma vista (master-detail) |
| **One-Window Drilldown** | Lista → detalle → volver, en una sola ventana |
| **List Inlay** | Detalle expandido dentro de la lista, sin salir |
| **Thumbnail Grid** | Ítems visuales homogéneos (productos, fotos) |
| **Carousel** | Exploración horizontal de pocos ítems destacados |
| **Row Striping** | Filas alternas para escanear tablas largas |
| **Pagination** | Conjuntos grandes con control de posición y total |
| **Jump to Item** | Ir directo a un ítem por nombre/ID |
| **Alphabet Scroller** | Salto por letra en listas alfabéticas largas |
| **Cascading Lists** | Columnas sucesivas que refinan la selección |
| **Tree Table** | Jerarquía + columnas de datos |
| **New-Item Row** | Fila “+ Agregar” al final de una lista editable |

## Capítulo 6 · Acciones y comandos

| Patrón | Para qué |
| --- | --- |
| **Button Groups** | Agrupar acciones relacionadas y separar las destructivas |
| **Hover Tools** | Herramientas contextuales al pasar el cursor (con alternativa táctil) |
| **Action Panel** | Panel con las acciones principales del objeto seleccionado |
| **Prominent “Done” Button** | Cerrar un flujo largo con una acción inequívoca |
| **Smart Menu Items** | Ítems que cambian según contexto, sin romper expectativas |
| **Preview** | Ver el resultado antes de confirmar |
| **Progress Indicator** | Progreso determinado o estimado en tareas lentas |
| **Cancelability** | Cancelar una operación larga sin perder lo hecho |
| **Multi-Level Undo** | Deshacer varios pasos, no solo el último |
| **Command History** | Ver y reejecutar acciones pasadas |
| **Macros** | Grabar y repetir una secuencia |

## Capítulo 7 · Datos complejos

| Patrón | Para qué |
| --- | --- |
| **Overview Plus Detail** | Contexto global + detalle seleccionado |
| **Datatips** | Tooltip con el valor exacto al pasar sobre un punto |
| **Data Spotlight** | Resaltar un subconjunto y atenuar el resto |
| **Dynamic Queries** | Filtros que actualizan resultados en vivo |
| **Data Brushing** | Seleccionar en una vista y resaltar en las demás |
| **Local Zooming** | Acercar una región sin perder el contexto |
| **Sortable Table** | Ordenar por columnas con indicador y tipo correcto |
| **Radial Table** | Comparar muchas series/relaciones en disposición radial |
| **Multi-Y Graph** | Varias métricas con escalas distintas en una gráfica |
| **Small Multiples** | Repetir la misma gráfica por categoría para comparar |
| **Treemap** | Jerarquía y proporción en áreas anidadas |

## Capítulo 8 · Formularios y controles

| Patrón | Para qué |
| --- | --- |
| **Forgiving Format** | Aceptar teléfonos, fechas y códigos con espacios, guiones o formatos variables |
| **Structured Format** | Campos segmentados cuando el formato es rígido (fecha, tarjeta) |
| **Fill-in-the-Blanks** | Frase con campos embebidos para tareas simples |
| **Input Hints** | Ejemplos y ayuda junto al campo |
| **Input Prompt** | Valor de ejemplo dentro del campo (no sustituye label) |
| **Password Strength Meter** | Feedback de fortaleza sin bloquear contraseñas válidas |
| **Autocompletion** | Sugerir mientras se escribe, sin imponer |
| **Dropdown Chooser** | Elegir de un conjunto conocido y acotado |
| **List Builder** | Mover ítems entre disponibles y seleccionados |
| **Good Defaults** | Preseleccionar lo más probable y permitir cambiarlo |
| **Same-Page Error Messages** | Error junto al campo, sin perder el contexto |

## Capítulo 9 · Social

| Patrón | Para qué |
| --- | --- |
| **Editorial Mix** | Combinar contenido propio y de la comunidad con jerarquía |
| **Personal Voices** | Identidad y tono humano en el contenido |
| **Repost and Comment** | Compartir y responder sin salir del flujo |
| **Conversation Starters** | Provocar participación con preguntas o prompts |
| **Inverted Nano-pyramid** | Conclusión primero, detalle después (microcontenido) |
| **Timing Strategy** | Publicar/actualizar según el ritmo de la audiencia |
| **Specialized Streams** | Canales por tema o interés |
| **Social Links** | Conectar perfiles y contenido |
| **Sharing Widget** | Compartir con contexto y enlace profundo |
| **News Box** | Bloque compacto de novedades |
| **Content Leaderboard** | Ranking de lo más visto/valorado |
| **Recent Chatter** | Actividad reciente de la comunidad |

## Capítulo 10 · Móvil

| Patrón | Para qué |
| --- | --- |
| **Vertical Stack** | Apilar contenido en una columna |
| **Filmstrip** | Carrusel horizontal de ítems relacionados |
| **Touch Tools** | Herramientas con targets táctiles grandes |
| **Bottom Navigation** | 3–5 destinos primarios al alcance del pulgar |
| **Thumbnail-and-Text List** | Lista con imagen + título + metadato |
| **Infinite List** | Carga continua en feeds, no en tablas operativas |
| **Generous Borders** | Separación táctil clara entre grupos |
| **Text Clear Button** | Borrar un campo con un toque |
| **Loading Indicators** | Feedback inmediato en redes lentas |
| **Richly Connected Apps** | Integración con otras apps/servicios |
| **Streamlined Branding** | Marca discreta que no roba espacio al contenido |

## Capítulo 11 · Estilo visual

| Patrón | Para qué |
| --- | --- |
| **Deep Background** | Fondo con profundidad que hace resaltar el contenido |
| **Few Hues, Many Values** | Pocos matices, muchos valores para jerarquizar sin ruido |
| **Corner Treatments** | Radios consistentes como firma del sistema |
| **Borders That Echo Fonts** | Bordes/reglas alineados al carácter tipográfico |
| **Hairlines** | Líneas de 1 px para separar sin peso visual |
| **Contrasting Font Weights** | Jerarquía por peso, no solo por tamaño |
| **Skins and Themes** | Variantes visuales sobre la misma estructura |

## Uso en PC Store

- **Tienda:** Feature/Search/Browse + Thumbnail Grid + Carousel + Center Stage.
- **Admin:** Dashboard + Sortable Table + Two-Panel Selector + Faceted/Dynamic Queries + Action Panel.
- **Configurador:** Canvas Plus Palette (preview + opciones) + Wizard solo si hay pasos reales + Good Defaults + Preview + Prominent Done.
- **Pedido:** Wizard corto o formulario de una columna + Same-Page Error Messages + Progress Indicator en el envío.
- **Forge Setup:** Transient/daemonic posture + Touch Tools + Loading Indicators, sin convertirlo en dashboard.
