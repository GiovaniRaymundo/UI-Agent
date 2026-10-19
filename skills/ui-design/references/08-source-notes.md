# Notas de fuentes verificadas

Este archivo documenta **qué se extrajo realmente** de los PDF adjuntos y en qué parte de la skill se usa. Sirve para auditar la skill y para no atribuirle a un libro algo que no dice.

## Método

- Los tres PDF tienen **capa de texto** (no son escaneos). Se extrajeron con **PyMuPDF 1.28**, el mismo motor de conversión PDF→imagen que usa el pipeline de Unlimited-OCR.
- **Unlimited-OCR no se ejecutó**: su README exige GPU NVIDIA con CUDA (`model.eval().cuda()`, transformers/vLLM/SGLang); esta máquina no tiene GPU NVIDIA ni CUDA. Forzar CPU con un modelo de este tamaño y 700+ páginas no es viable, y OCR sobre texto digital solo añadiría ruido. El script `scripts/ocr-pdf.py` deja ambos caminos listos (`--mode text` y `--mode ocr`) para cuando haya GPU o un PDF escaneado.
- Cifras de extracción: Laws of UX 186 pp / ~261k caracteres; Designing Interfaces 58 pp / ~117k; About Face 722 pp / ~1.56M.
- Se citan **páginas del PDF** (no del libro impreso) y capítulos, para que puedas localizarlas en los archivos adjuntos.

## 1. Laws of UX — Jon Yablonski (2.ª edición, O'Reilly)

Estructura: 10 leyes + aplicación + ética. Cada capítulo trae “Key Takeaways”, “Overview”, “Origins”, “Examples” y “Conclusion”.

| Capítulo | Ley y takeaway verificado | Uso en la skill |
| --- | --- | --- |
| 1 (pp. 21–34) | **Jakob**: la gente transfiere expectativas y modelos mentales; empezar por convenciones y desviarse solo con argumento y prueba | `01`, `03` |
| 2 (pp. 35–48) | **Fitts**: el tiempo de adquisición depende de distancia y tamaño; `ID = log2(2D/W)`; targets mínimos 44×44 pt (Apple/WCAG), 48×48 dp (Material), 1×1 cm (NN/g); espaciado amplio | `01`, `03` |
| 3 (pp. 49–58) | **Miller**: 7 ± 2 en memoria de trabajo; el valor real es el **chunking**, no el número mágico; capacidad varía por persona y contexto | `01`, `02` |
| 4 (pp. 59–72) | **Hick**: `RT = a + b log2(n)`; más opciones y complejidad aumentan la decisión; el exceso de simplificación abstrae de más | `01`, `02` |
| 5 (pp. 73–84) | **Postel**: ser conservador al emitir y liberal al aceptar; traducir la entrada variable a una salida estructurada; anticipar fallos | `01`, `04` |
| 6 (pp. 85–98) | **Peak-End**: se recuerda el pico emocional y el final, no el promedio; lo negativo se recuerda más vívido | `01`, `06` |
| 7 (pp. 99–112) | **Aesthetic-Usability**: lo bello se percibe como más usable y tolera fallos menores; también **enmascara** problemas en pruebas | `01`, `03`, `06` |
| 8 (pp. 113–126) | **Von Restorff**: lo distinto se recuerda; usar contraste con restricción, no solo color, y cuidar sensibilidad al movimiento | `03`, `06` |
| 9 (pp. 127–138) | **Tesler**: la complejidad no se elimina, se transfiere; simplificar hasta la abstracción es un error | `01`, `02` |
| 10 (pp. 139–150) | **Doherty**: feedback en < 400 ms; 100 ms se siente instantáneo, 100–300 ms se nota; barras de progreso y perceived performance | `01`, `03`, `04` |
| 11 (pp. 151–158) | Cómo aplicar: principios de diseño → ley psicológica → regla concreta; principios directos, opinados, memorables y no truismos | `00`, `SKILL` |
| 12 (pp. 159–174) | Ética: recompensas variables, bucles infinitos, afirmación social, personalización, defaults, falta de fricción, reciprocidad y dark patterns | `01`, `06` |

Frases clave verificadas (síntesis, no citas largas): “no uses el número siete para justificar limitaciones innecesarias”; “la estética puede enmascarar problemas de usabilidad”; “no simplifiques hasta la abstracción”.

## 2. Designing Interfaces — Jenifer Tidwell (2.ª ed., 2011)

El adjunto es un **preview**: incluye el índice completo (todos los capítulos y patrones) y los capítulos 1–2 hasta la introducción de patrones.

| Parte | Contenido verificado | Uso |
| --- | --- | --- |
| Cap. 1 (pp. 29–51) | 14 patrones de comportamiento humano: Safe Exploration, Instant Gratification, Satisficing, Changes in Midstream, Deferred Choices, Incremental Construction, Habituation, Microbreaks, Spatial Memory, Prospective Memory, Streamlined Repetition, Keyboard Only, Other People's Advice, Personal Recommendations | `01`, `07` |
| Cap. 2 (pp. 53–58) | Toda página hace una de cuatro cosas: mostrar una cosa, mostrar una lista, dar herramientas para crear, facilitar una tarea. IA = presentar, buscar, navegar, etiquetar, categorizar, ordenar, manipular y ocultar estratégicamente | `02`, `07` |
| Índice (pp. 7–12) | Catálogo completo de patrones de navegación, layout, listas, acciones, datos, formularios, social, móvil y estilo | `07` |
| Cap. 6 (índice) | Multi-Level Undo, Command History, Macros, Cancelability, Progress Indicator, Preview | `04`, `07` |
| Cap. 8 (índice) | Forgiving Format, Structured Format, Input Hints, Good Defaults, Same-Page Error Messages, Autocompletion | `04` |

Conceptos que se incorporaron: **satisficing** (el usuario elige lo primero que parece funcionar), **reentrance** (pausar y volver sin perder estado), **memoria espacial/prospectiva** (no reordenar controles ni limpiar recordatorios), **habituación** (consistencia de gestos y atajos), **microbreaks** (carga rápida y contenido útil primero).

## 3. About Face — Alan Cooper et al. (4.ª ed., Wiley 2014)

720 páginas; se extrajeron los capítulos relevantes para UI.

| Capítulo | Ideas verificadas | Uso |
| --- | --- | --- |
| 1 (pp. 33–60) | Diferencia entre **modelo de implementación**, **modelo mental** y **modelo representado**; los objetivos no son tareas; “los usuarios son muy inteligentes y muy ocupados” | `01` |
| 8 (pp. 197–234) | Valores de diseño: solución completa más simple, coherencia interna, acomodar cognición y emoción; principios conceptuales, de comportamiento y de interfaz | `03` |
| 9 (pp. 235–266) | **Postura**: soberana, transitoria y daemónica; la postura dicta densidad, cromo y comportamiento; las apps transitorias deben ser simples, explícitas, de una sola ventana y recordar posición | `01`, `02`, `05` |
| 10 (pp. 267–278) | **Perpetual intermediates**: la mayoría no es principiante ni experta; optimizar para ellos. **Inflectar** por frecuencia de uso, grado de dislocación y riesgo; **commensurate effort**; disclosure progresivo con estado “sticky” | `01`, `02` |
| 11 (pp. 279–300) | **Flow y transparencia**; “no importa lo cool que sea tu interfaz, menos sería mejor”; 15 estrategias de interacción armoniosa; feedback modeless; evitar reportar normalidad; evitar blank slates; separar comando de configuración; esconder “ejector seat levers”; latencia 0.1 s / 1 s / 10 s; animaciones < 1 s | `01`, `02`, `03`, `04` |
| 12 (pp. 301–328) | **Excise**: navegación, esqueuomorfismo, modal, estilístico; “no detengas el proceso con idiotez”; “no hagas que el usuario pida permiso”; “permite entrada donde muestras salida” | `01`, `02` |
| 15 (pp. 387–408) | **Feedback visual modeless rico** (RVMF); undo como herramienta de exploración, no de castigo; undo global; compare/preview | `01`, `04` |
| 16 (pp. 409–434) | Learnability, ayuda, personalización, localización, accesibilidad | `04` |
| 17 (pp. 435–462) | Principios visuales: jerarquía, “bajar” lo secundario en vez de “subir” lo importante; **squint test**; grid con unidad atómica de 4 px; proporciones exactas (1/2, 1/3, 1.61); ruido visual; “quita hasta que se rompa”; 1–2 tipografías y pocos tamaños | `03` |
| 21 (pp. 619–684) | Diálogos como “otra habitación”; modal vs modeless; errores: hacerlos imposibles, no solo reportarlos; el diálogo de error es último recurso; confirmaciones “el niño que gritó lobo”; “do, don't ask”; hacer todo reversible; feedback positivo | `04`, `06` |

## 4. Qué NO se usó

- No se copiaron capítulos ni pasajes extensos: las referencias son síntesis y reglas operativas.
- No se usaron los ejemplos visuales de los libros (capturas, figuras); las reglas se adaptaron a los tokens y componentes de este repo.
- El preview de Designing Interfaces no incluye el desarrollo de cada patrón; el catálogo se basa en el índice completo y en los capítulos 1–2, y se contrastó con conocimiento general de patrones. Si necesitas el detalle de un patrón concreto, consulta el libro.
- No se ejecutó OCR sobre las páginas; se usó la capa de texto. Si en el futuro llega un PDF escaneado, el pipeline de Unlimited-OCR sería el camino, pero requiere GPU.

## 5. Cómo citar en una revisión

Formato sugerido:

> `[Laws of UX, cap. 2]` El botón principal mide 28 px y está separado 4 px del secundario; Fitts pide ≥ 44 px y espacio amplio.
>
> `[About Face, cap. 21]` Este flujo pide confirmación rutinaria para borrar; mejor undo + feedback modeless.
>
> `[Designing Interfaces, cap. 1]` El formulario pierde datos al volver; falta reentrance.

Cita el principio, no la página, salvo que estés auditando una decisión concreta.
