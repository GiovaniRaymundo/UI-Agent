# Capa 1 · UX cognitivo

La interfaz no compite contra otra interfaz: compite contra la atención, la memoria de trabajo y las expectativas de quien la usa. Esta capa decide **qué mostrar, en qué orden y qué hacer cuando algo falla**.

## 1. Principio rector: diseño dirigido por objetivos

La persona no viene a “usar el panel”; viene a saber si el precio subió, a confirmar stock o a armar una PC que corra su trabajo. Cada pantalla se evalúa con una pregunta:

> ¿Esto acerca al objetivo o es trabajo administrativo (excise)?

**Excise** es todo lo que el usuario hace que no aporta a su meta: rellenar un campo que el sistema ya sabe, elegir de nuevo lo que ya eligió, esperar sin información, buscar en otra pestaña, recordar un código. Se elimina con defaults, persistencia, autocompletado, detección y resúmenes.

Cuatro tipos que conviene nombrar (Cooper, cap. 12):

| Tipo | Cómo se ve | Antídoto |
| --- | --- | --- |
| **Navegación** | Cambiar de pantalla, pestaña o panel para completar una sola tarea | Master-detail, paneles adyacentes, edición en línea, acciones contextuales |
| **Esqueuomorfismo** | Metáforas físicas que estorban (libreta, archivador, máquina de escribir) | Usa el idioma digital: búsqueda, filtros, atajos, estado |
| **Modal** | Diálogo que detiene todo para preguntar o reportar | Feedback modeless, undo, validación en contexto |
| **Estilístico** | Ruido visual que hay que decodificar para saber qué es clickeable | Jerarquía clara, menos adornos, affordances consistentes |

Regla de Cooper: **“no detengas el proceso con idiotez”**. Si el sistema puede resolverlo, que lo resuelva; si no, que explique y ofrezca la salida.

## 2. Leyes y reglas operativas

| Ley / principio | Regla operativa | Consecuencia en UI |
| --- | --- | --- |
| **Fitts** | El tiempo de acierto depende del tamaño y la distancia | Acción primaria grande y cerca del contenido que la motiva; acciones destructivas pequeñas, separadas y nunca junto a “Guardar” |
| **Hick** | Más opciones y complejidad = más tiempo para decidir | 5–7 opciones como guía, no como límite mágico; agrupa, ordena por uso y usa disclosure progresivo |
| **Jakob** | Se espera que tu UI funcione como las demás | Navegación, carrito, tablas, modales y atajos con el patrón conocido. Innovar en lo aburrido cuesta conversión |
| **Miller** | La memoria de trabajo maneja ~4–7 bloques | Chunking en formularios, pasos y resúmenes; no obligues a recordar valores entre pantallas |
| **Gestalt: proximidad** | Lo cercano se percibe como relacionado | El espacio es jerarquía: 8 px dentro de un grupo, 24–32 px entre grupos. No uses líneas para todo |
| **Gestalt: región común** | Un fondo compartido agrupa | Usa superficie/panel para agrupar; evita bordes anidados |
| **Gestalt: similitud** | Lo igual se percibe como del mismo tipo | Mismo rol = mismo estilo. Distinto comportamiento = distinto estilo |
| **Von Restorff** | Lo distinto se recuerda | Un solo acento por vista para lo que debe destacar |
| **Posición serial** | Se recuerda el primero y el último | Lo más importante arriba; resumen/confirmación al final |
| **Doherty** | < 400 ms mantiene el flujo | Optimistic UI, skeletons y transiciones; nunca bloquees sin feedback |
| **Tesler** | La complejidad no desaparece, se mueve | Decide qué complejidad absorbes tú (defaults, automatización) y cuál expones (modo avanzado) |
| **Peak-end** | Se recuerda el pico y el final | Cuida confirmación, éxito y recuperación de error; no solo el formulario |
| **Estética-usabilidad** | Lo bello se percibe más usable | Úsalo para dar confianza, no para ocultar fallos |
| **Postel** | Sé conservador al emitir, liberal al aceptar | Acepta teléfonos con espacios/guiones; normaliza y muestra el formato canónico |
| **Pareto** | 80 % del uso viene del 20 % de acciones | Esa minoría va visible y con atajo; el resto, en menús o avanzado |
| **Reconocer > recordar** | La opción debe verse, no memorizarse | Muestra unidades, precios, stock y selección actual junto a la decisión |
| **Disclosure progresivo** | La complejidad aparece cuando se necesita | Básico primero; “Opciones avanzadas”, detalles y configuración bajo demanda |

### Cómo se aplica en la práctica

- **Fitts:** en móvil, targets ≥ 44×44 px; en desktop denso, ≥ 32×32 px. La acción principal del configurador (“Agregar”) va fija y grande; “Vaciar bolsa” nunca al lado.
- **Hick:** un selector de 40 modelos de GPU no se resuelve con un `<select>` gigante: filtros + búsqueda + recomendados. Un menú de admin con 12 secciones se agrupa.
- **Jakob:** el carrito se llama “Bolsa” si el resto del sitio lo llama así; no mezcles “carrito”, “bolsa” y “canasta”.
- **Miller:** un wizard de 12 campos se parte en 3 pasos de 4, con resumen final.
- **Gestalt:** antes de agregar un borde, prueba separar con 24 px. Si sigue ambiguo, entonces sí: superficie o divisor.

### 2.1 Números que cambian decisiones

| Dato verificado | Fuente | Implicación práctica |
| --- | --- | --- |
| Índice de dificultad de Fitts: `ID = log2(2D/W)` | Laws of UX, cap. 2 | Duplicar el tamaño del target reduce la dificultad; acercarlo también. No es solo “hazlo grande” |
| Targets mínimos: 44×44 pt (Apple/WCAG), 48×48 dp (Material), 1×1 cm (NN/g) | Laws of UX, cap. 2 | Son mínimos: en táctil apunta a 44–48 px y deja ≥ 8 px entre controles |
| Hick: `RT = a + b log2(n)` | Laws of UX, cap. 4 | La decisión crece de forma logarítmica con las opciones; reducir de 20 a 7 ayuda, de 7 a 3 ayuda menos de lo que parece |
| Miller: 7 ± 2, y la investigación posterior ronda 4 chunks | Laws of UX, cap. 3 | No es una cuota de menú; es una razón para **agrupar** y no para cortar funcionalidad |
| Doherty: < 400 ms | Laws of UX, cap. 10 | 100 ms se siente instantáneo; 100–300 ms se nota; > 400 ms rompe la sensación de control |
| Percepción de latencia: 0.1 s / 1 s / 10 s | About Face, cap. 11 | < 0.1 s manipulación directa; < 1 s flujo; < 10 s progreso; > 10 s segundo plano + cancelar |
| Animaciones de interacción: < 1 s | About Face, cap. 11 | Si la animación dura más, estorba; 120–200 ms para microfeedback |
| Grid atómico: 4 px | About Face, cap. 17 | Toda separación en múltiplos de 4; proporciones exactas (1/2, 1/3, 1.61) |

### 2.2 Modelos mentales (Cooper)

Tres modelos que no hay que confundir:

| Modelo | Qué es | Ejemplo |
| --- | --- | --- |
| **Implementación** | Cómo está construido el sistema | Una tabla `orders` con estados `pending/paid` |
| **Mental** | Cómo el usuario cree que funciona | “Mi pedido está en revisión y luego me contactan” |
| **Representado** | Cómo el diseñador decide mostrarlo | “Confirmando stock → Te contactamos → Enviado” |

Regla: **el modelo representado debe acercarse al mental, no al de implementación.** Si el usuario piensa en “pedidos”, no le muestres “registros”; si piensa en “piezas”, no le muestres “SKUs”.

- **Objetivos vs tareas:** el objetivo es “comprar una PC que corra mi trabajo”; la tarea es “elegir GPU”. Diseña para el objetivo; la tarea es un medio.
- **Los cinco porqués:** ante un requerimiento (“quiero un filtro”), pregunta por qué hasta llegar al objetivo. A veces la solución es eliminar el paso, no agregar el filtro.
- **Usuarios inteligentes y ocupados:** no expliques de más ni asumas ignorancia; da el modelo mental mínimo para actuar.

## 3. Carga cognitiva

Tres tipos, tres respuestas:

| Tipo | Qué es | Qué hacer |
| --- | --- | --- |
| **Intrínseca** | Dificultad real de la tarea (elegir una GPU compatible) | No la escondas: ayúdala con datos, comparación y recomendación |
| **Extrajera** | Ruido del diseño (labels confusos, pasos de más, cromo) | Elimínala sin piedad |
| **Germana** | Esfuerzo útil de aprender el sistema | Redúcelo con consistencia y feedback, no con simplificación excesiva |

Señales de sobrecarga: el usuario pregunta “¿y ahora qué?”, vuelve atrás, abre dos pestañas para comparar, ignora un campo, comete el mismo error dos veces.

### 3.1 Comportamientos humanos que la UI debe soportar (Tidwell)

| Comportamiento | Lo que pide | Respuesta concreta |
| --- | --- | --- |
| **Safe Exploration** | Explorar sin perderse ni romper nada | Undo multinivel, back predecible, estados reversibles, sin pop-ups |
| **Instant Gratification** | Lograr algo ahora | Primer éxito en segundos; no pongas registro/instrucciones antes del valor |
| **Satisficing** | “Esto es suficiente” | CTA obvio, labels cortos, layout que se entienda de un vistazo |
| **Changes in Midstream** | Cambiar de opinión a mitad | Reentrance: conserva el estado y permite pausar/volver |
| **Deferred Choices** | No responder todo ahora | Pide lo mínimo, marca opcionales, buenos defaults, completa después |
| **Incremental Construction** | Probar y ajustar | Cambios pequeños, preview en vivo, feedback inmediato |
| **Habituation** | Que el gesto funcione igual | Consistencia intra e inter-app; no cambies el significado por modo |
| **Microbreaks** | Aprovechar dos minutos | Carga rápida, contenido útil primero, recordar posición |
| **Spatial Memory** | Encontrar por ubicación | No reordenes controles ni menús; posiciones estables |
| **Prospective Memory** | Dejar algo para recordar | Borradores, notas, bandejas, marcadores; no limpies lo del usuario |
| **Streamlined Repetition** | No repetir tanto | Atajos, duplicar, aplicar a todos, valores recordados |
| **Keyboard Only** | No depender del ratón | Tab lógico, flechas, Enter/Esc, atajos |
| **Other People's Advice** | Saber qué hicieron otros | Reseñas, actividad, ayuda comunitaria |
| **Personal Recommendations** | Compartir con alguien | Enlaces profundos y mensaje personal, no spam genérico |

Tres consecuencias que suelen olvidarse:

1. **Reentrance:** si el usuario empieza un formulario o configuración y se va, al volver debe encontrar lo que dejó. Un wizard que borra todo al cerrar es una trampa.
2. **Memoria espacial:** mover un botón “para que se vea mejor” rompe el mapa mental de quien ya lo usaba. Los cambios de layout se prueban, no se improvisan.
3. **Memoria prospectiva:** no “limpies” ventanas, borradores o filas que el usuario dejó a propósito. Lo que parece desorden puede ser un recordatorio.

## 4. Flujo y orquestación (Cooper)

- **Punto de entrada:** ¿cómo llega? (link, header, URL directa, recarga). Debe entender dónde está sin historial.
- **Orientación:** título de página + breadcrumb si hay profundidad + estado actual.
- **Acción:** una primaria; el resto subordinado.
- **Confirmación:** qué cambió, qué sigue, cómo deshacer.
- **Siguiente paso:** nunca dejes al usuario en un callejón sin salida.

**Inflection points (Cooper):** momentos donde el usuario cambia de novato a intermedio (por ejemplo, ya sabe qué GPU quiere) o donde el contexto cambia (de comprar a comparar). En ese punto ofrece atajos, presets, “usar la última configuración” o modo avanzado. No obligues a todos a pasar por el camino del novato.

**Perpetual intermediates (Cooper):** la mayoría no será experta ni principiante, y los principiantes no se quedan mucho tiempo ahí. Diseña para alguien que usa la herramienta con frecuencia intermitente: reconoce patrones, agradece atajos y recordatorios, y no tolera tutoriales obligatorios ni funciones escondidas.

Los tres objetivos de una interfaz sana:

1. Mover rápido y sin dolor al principiante a intermedio.
2. No poner obstáculos al intermedio que quiere ser experto.
3. Mantener contento al intermedio perpetuo, que es la mayoría.

**Inflectar la interfaz** significa organizar por tres criterios, no por estética:

| Criterio | Qué va primero | Qué va profundo |
| --- | --- | --- |
| **Frecuencia de uso** | Lo que se usa muchas veces al día, a un clic | Lo que se usa una vez al mes, en menú/avanzado |
| **Grado de dislocación** | Cambios locales y reversibles, cerca | Funciones que cambian el layout o el contexto, lejos |
| **Riesgo** | Acciones seguras y reversibles, visibles | Acciones irreversibles o peligrosas, escondidas y protegidas |

**Commensurate effort:** el usuario acepta complejidad si el beneficio lo justifica. Un flujo simple no puede ser complejo; un resultado complejo sí puede tener una interfaz compleja, siempre que no se use a diario.

**Disclosure progresivo:** lo avanzado vive en un panel expandible, y el estado abierto/cerrado se recuerda (“sticky”). Si el usuario lo abre una vez, no se lo cierres en la siguiente sesión.

**Postura de la app (Cooper):**

| Postura | Qué es | Implicación |
| --- | --- | --- |
| **Soberana** | Ocupa la pantalla y el flujo (admin, configurador, editor) | Densidad alta, atajos, herramientas cerca, pantalla completa, optimizar para intermedios |
| **Transitoria** | Aparece, hace una cosa y se va (carrito, checkout, diálogo) | Simple, explícita, una sola ventana/vista, botones grandes, recordar posición y valores |
| **Daemónica** | Corre en segundo plano (actualizar precios) | No interrumpe; avisa solo lo importante; progreso modeless |

No diseñes el admin como una app transitoria ni el checkout como una soberana. Un diálogo es una app transitoria: si necesita otra ventana, está mal diseñado.

## 5. Errores

### Taxonomía

- **Slip:** la intención era correcta, la ejecución falló (clic en el botón de al lado). Se previene con tamaño, separación, confirmación contextual y undo.
- **Mistake:** el modelo mental es incorrecto (eligió la opción equivocada porque la entendió mal). Se previene con copy, ejemplos y consecuencias visibles.

### Escalera de prevención

1. **Restringir** (no permitas combinaciones inválidas; usa controles acotados).
2. **Default inteligente** (la opción más probable, preseleccionada y visible).
3. **Validar en el momento correcto** (al salir del campo, no en cada tecla; nunca solo al enviar).
4. **Hacer reversible** (undo, papelera, historial, borrador). Esta es la protección principal.
5. **Confirmar** solo si la acción es irreversible y el usuario casi con seguridad pulsaría “Cancelar”; nombra el objeto y la consecuencia.
6. **Recuperar**: explicar qué pasó y ofrecer la salida.

### 5.1 Errores y confirmaciones (Cooper)

- **Haz el error imposible** antes de reportarlo: listas cerradas, valores derivados, formato tolerante, campos que no existen porque el sistema ya sabe el dato.
- **El diálogo de error es el último recurso.** Debe ser educado, iluminar el problema y ofrecer una solución; nunca culpar al usuario ni decir “error de validación”.
- **No detengas el proceso para reportar normalidad.** “Conexión establecida” o “registro guardado” van en feedback modeless, no en un modal.
- **Las confirmaciones rutinarias se vuelven invisibles.** Si preguntas “¿seguro?” 20 veces, el usuario aprende a decir que sí sin leer. Úsalas solo cuando casi siempre se cancelaría.
- **“Do, don't ask”:** actúa con un default razonable y ofrece deshacer. Preguntar todo el tiempo es transferirle tu indecisión al usuario.
- **Feedback positivo:** confirma lo que salió bien; el usuario aprende mejor con señales positivas que con regaños.
- **Permite entrada donde muestras salida:** si un dato se ve, se puede editar ahí mismo (con estado sucio/guardado), sin “pedir permiso” yendo a otra pantalla.
- **No empieces con un lienzo en blanco:** parte de una aproximación razonable (última configuración, plantilla, valores del pedido) y deja ajustar. “Ask for forgiveness, not permission”.

### Mensaje de error (fórmula)

> **Qué pasó** + **por qué** + **qué hacer ahora** + **dónde** (campo/sección).

Ejemplo malo: “Error de validación”.
Ejemplo bueno: “El teléfono debe tener 10 dígitos. Escríbelo sin espacios, por ejemplo 81 1234 5678.”

Reglas:

- El error va **junto al campo**, no solo en un toast.
- Usa `aria-invalid` y `aria-describedby`; el foco se mueve al primer campo inválido.
- No borres lo que el usuario escribió.
- Un error del sistema no se disfraza de error del usuario.
- Los errores de red ofrecen reintento y conservan el estado.

### Vacío, cero y error no son lo mismo

| Estado | Cuándo | Qué mostrar |
| --- | --- | --- |
| **Vacío inicial** | Nunca hubo datos | Qué es esta pantalla, qué hacer para empezar, un CTA |
| **Cero resultados** | Hay datos, el filtro no encontró | Qué filtro sobra, cuántos hay sin filtro, limpiar filtros |
| **Error** | Falló la carga | Qué falló, reintentar, alternativa; no un vacío engañoso |
| **Sin permiso** | No puede verlo | Qué necesita y a quién pedirlo |

## 6. Tiempo y feedback

| Latencia | Percepción | Qué hacer |
| --- | --- | --- |
| 0–100 ms | Instantáneo | Cambio de estado inmediato; no muestres spinner |
| 100–300 ms | Rápido | Feedback sutil (pressed, check, transición) |
| 300 ms–1 s | Se nota | Skeleton o spinner local, no bloquear toda la pantalla |
| 1–5 s | Espera | Progreso determinado o mensaje de qué está pasando |
| > 5 s | Paciencia | Progreso, tiempo estimado, permitir seguir en otra cosa, notificar al terminar |

- Nunca muestres un spinner que aparece y desaparece en 80 ms: produce parpadeo.
- **Optimistic UI** solo si el fallo es raro y reversible; si falla, revierte y explica.
- El skeleton debe imitar la forma del contenido real, no un rectángulo genérico.
- El botón que dispara una acción muestra su propio estado (`Guardando…`) y evita doble envío.

## 7. Usuarios de poder (sin castigar al resto)

- **Teclado:** `Tab` orden lógico, `Enter` acción primaria, `Esc` cerrar, `⌘/Ctrl+K` buscar o comandar, flechas en listas y menús.
- **Atajos visibles:** descúbrelos en tooltips, menús y una hoja de ayuda; no los escondas en documentación.
- **Acciones masivas:** selección con checkbox, “seleccionar todo”, acciones en barra contextual.
- **Densidad ajustable:** compacta por defecto en admin; cómoda si hay muchos usuarios ocasionales.
- **Defaults persistentes:** última configuración, último filtro, última tienda.
- **Undo > confirmación:** “Pedido archivado · Deshacer” vale más que un modal.
- **Nunca secuestres el teclado:** no bloquees copiar/pegar, no interceptes `Ctrl+F` sin ofrecer búsqueda interna equivalente, no atrapes el foco sin salida.

## 8. Confianza (especialmente en e-commerce)

- Precio, moneda, impuestos y envío se entienden sin calcular.
- “Sujeto a stock” se explica: qué pasa si no hay, cuándo se confirma, qué se cobra.
- No hay dark patterns: ni cuenta regresiva falsa, ni “solo quedan 2” sin dato, ni casillas premarcadas.
- Muestra el siguiente paso: “Te contactamos para confirmar stock antes de cobrar”.
- Un pedido guardado debe poder consultarse con su id, sin login sorpresa.
- La fecha y zona horaria de los precios son visibles cuando importan (admin).

### 8.1 Patrones oscuros y fricción intencional

Laws of UX (cap. 12) documenta mecanismos que retienen sin servir al usuario. Reconócelos y no los uses:

| Mecanismo | Cómo se manifiesta | Alternativa ética |
| --- | --- | --- |
| **Recompensas variables** | Notificaciones impredecibles que enganchan | Frecuencia predecible y control del usuario |
| **Bucles infinitos** | Autoplay, scroll infinito sin fondo | Fin claro, paginación, “ya viste todo” |
| **Afirmación social** | Likes/streaks que presionan | Reconocimiento sin obligación ni culpa |
| **Personalización** | Feed que encierra en un sesgo | Control y transparencia del criterio |
| **Defaults** | Opciones premarcadas que benefician al negocio | Defaults en favor del usuario |
| **Falta de fricción** | Suscripción en un clic, cancelación imposible | Misma fricción para entrar y salir |
| **Reciprocidad** | Regalos que generan deuda implícita | Beneficio sin contraprestación oculta |

Y el reverso: **no toda fricción es mala**. En decisiones caras o irreversibles (borrar, pagar, publicar), una pausa breve, un resumen o una confirmación específica protegen al usuario. La meta no es “cero fricción”, sino fricción donde aporta.

## 9. Pruebas rápidas antes de entregar

1. **5 segundos:** muestra la pantalla 5 s y pregunta qué es, qué dato destaca y qué haría.
2. **Primer clic:** dado un objetivo, ¿el primer clic va al lugar correcto?
3. **Trunk test:** tapa todo menos el header; ¿sabe dónde está y cómo volver?
4. **Recorrido cognitivo:** por cada paso, ¿el usuario sabe qué hacer, ve el resultado y puede corregir?
5. **Prueba del error:** rompe la red, envía un formulario vacío, elige una combinación inválida. ¿La UI se explica?
