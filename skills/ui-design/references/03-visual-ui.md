# Capa 3 · UI visual estricto

Esta capa evita el aspecto plano, amateur o inconsistente. No es un catálogo de gustos: son decisiones medibles (escala, contraste, peso, espacio, estados) que se pueden revisar.

## 1. Tokens mínimos

Todo valor visual sale de aquí. Si necesitas uno nuevo, agrégalo al token set y explica por qué; no lo escribas suelto en un componente.

### Espaciado (base 4 px)

| Token | px | Uso |
| --- | --- | --- |
| `1` | 4 | Separación icono/texto, ajuste óptico |
| `2` | 8 | Gap interno de chips, padding vertical de inputs compactos |
| `3` | 12 | Gap entre label y control, padding de botón compacto |
| `4` | 16 | Padding de celda, gap de lista |
| `6` | 24 | Padding de tarjeta, separación entre grupos |
| `8` | 32 | Separación entre secciones internas |
| `12` | 48 | Separación entre bloques |
| `16` | 64 | Ritmo de página |
| `24` | 96 | Aire editorial / hero |

Regla: dentro de un grupo 8–12 px; entre grupos 24–32 px; entre secciones 48–64 px. Si dudas, sube un nivel.

### Radios

| Nivel | Valor | Uso |
| --- | --- | --- |
| Control | 8–10 px | Botones, inputs, selects |
| Contenedor | 12–16 px | Paneles, tablas, menús |
| Tarjeta | 16–20 px | Cards de admin |
| Editorial | 24–28 px | Tiles de tienda `.apple` |
| Pill | 999 px | Badges, filtros, avatares |

No mezcles 6, 8, 11 y 13 px en la misma vista.

### Tipografía

| Rol | Tamaño / línea | Peso | Tracking | Dónde |
| --- | --- | --- | --- | --- |
| Display | 40–64 / 1.05 | 600 | -0.03em | Hero de tienda |
| H1 | 32 / 1.15 | 600 | -0.02em | Título de página |
| H2 | 24–28 / 1.2 | 600 | -0.02em | Sección |
| H3 | 18–20 / 1.3 | 600 | -0.01em | Subsección, card title |
| Body L | 17 / 1.5 | 400 | 0 | Tienda, lectura |
| Body | 15 / 1.5 | 400 | 0 | General |
| Body S | 14 / 1.45 | 400 | 0 | Admin denso |
| Small | 13 / 1.4 | 400–500 | 0 | Metadatos, ayudas |
| Caption | 12 / 1.35 | 500 | 0.01em | Labels, badges |
| Micro | 11 / 1.2 | 600 | 0.06em uppercase | Eyebrow, tabla densa |

Reglas:

- Máximo **3 pesos** por pantalla (400, 500, 600). El 700 se reserva para display.
- Ancho de línea 60–75 caracteres en lectura; 45–65 en columnas estrechas.
- No uses texto menor a 12 px para información necesaria.
- Números en tablas y precios: `tabular-nums`.
- No justifiques texto. No uses mayúsculas sostenidas en párrafos.
- El título no se centra en herramientas; sí en hero editorial.

### 1.1 Grid atómico y proporciones (Cooper)

- Unidad atómica de **4 px**; todo el espaciado y muchos tamaños son múltiplos. Si la unidad es demasiado pequeña, el grid se vuelve invisible; si es demasiado grande, no cabe la variación.
- Alinea todo lo que se pueda al mismo grid, horizontal y verticalmente. La excepción se justifica, no se improvisa.
- Proporciones **exactas**: mitad, tercio, quinto o 1.61. “Casi un cuadrado” o “casi un tercio” se percibe inestable aunque no se sepa por qué. Ajusta a la fracción exacta.
- Etiquetas apiladas: alineadas a la izquierda; a la derecha solo cuando el escaneo lo justifique.
- Un cambio de 4 px entre grupos (8 vs 12) comunica relación; un cambio de 1–2 px no comunica nada y ensucia.

## 2. Jerarquía

Tres palancas, en este orden:

1. **Tamaño** (diferencia mínima perceptible: ~1.25×).
2. **Peso** (400 vs 600 ya crea jerarquía).
3. **Color/contraste** (foreground vs muted vs acento).

Una pantalla debe leerse en este orden: **título → dato/estado clave → acción → detalle**. Si el ojo va primero a un borde decorativo, hay un error.

- Máximo un elemento “gritando” por vista (color sólido, tamaño display o animación).
- El énfasis se gana, no se reparte: si tres cosas son importantes, ninguna lo es.
- En una card: título 15–16/600, metadato 13/muted, acción 13/500. No pongas todo en 14/400.
- En una tabla: la columna identificadora en 500; el resto 400; el número principal 600.

### 2.1 Baja lo secundario, no subas lo importante

Cuando dos elementos compiten, es más fácil **atenuar el menos importante** que seguir subiendo el más importante. Si todo está en negrita y color, no queda “headroom” para destacar nada.

- Baja peso, saturación, tamaño o contraste del secundario; deja el acento para lo que debe ganar.
- **Squint test:** entrecierra los ojos. Debe quedar claro qué es título, qué es dato y qué es acción. Si todo se ve como una masa, la jerarquía no existe.
- Si necesitas tres niveles, que sean tres, no cinco casi iguales.

## 3. Color

### Roles

| Rol | Token en este repo | Uso |
| --- | --- | --- |
| Fondo | `background` | Lienzo |
| Superficie | `card` / `popover` | Paneles elevados |
| Texto | `foreground` | Contenido |
| Texto secundario | `muted-foreground` | Metadatos, ayudas |
| Acento | `primary` | Acción, selección, foco |
| Peligro | `destructive` | Destruir, error |
| Advertencia | ámbar puntual | Stock limitado, atención |
| Éxito | verde puntual | Confirmación |
| Borde | `border` | Separación funcional |

Reglas:

- **60/30/10:** 60 % fondo, 30 % superficies/texto, 10 % acento. El acento no decora superficies completas.
- Un solo acento por tema. En admin es magenta/violeta; en tienda `.apple` es azul. **No mezcles ambos en la misma vista.**
- El color nunca es el único portador de significado: acompaña con icono, texto o forma (daltonismo).
- No uses gris sobre fondo de color para texto; usa el color de texto con opacidad o una variante más clara/oscura.
- No uses negro puro (`#000`) ni blanco puro (`#fff`) como texto/fondo en áreas grandes; el repo ya usa `oklch(0.135 …)` y `0.975`.
- Estados semánticos: fondo al 10–15 %, borde al 40–50 %, texto al 100 %. No un bloque saturado con texto blanco salvo que el contraste lo permita.

### Contraste

| Elemento | Mínimo |
| --- | --- |
| Texto normal | 4.5:1 |
| Texto grande (≥ 24 px o ≥ 18.66 px bold) | 3:1 |
| Iconos y bordes funcionales | 3:1 |
| Foco | 3:1 contra el fondo adyacente |
| Texto deshabilitado | Exento, pero apunta a 3:1 |

Verifica en **ambos temas**. Un muted que funciona en claro puede desaparecer en oscuro.

## 4. Layout y espacio

- Grid de 4/8 px; contenedores: tienda 1120 px (`SHOP_MAX`), contenido editorial 880–1080 px, admin fluido con padding 24 px.
- **Proximidad = relación.** No pongas la misma distancia entre label/input y entre campos distintos.
- Alineación: izquierda dominante; centrado solo para hero, estados vacíos y mensajes cortos.
- Empieza con más aire del que crees y quita hasta que la relación sea clara.
- Alineación óptica: iconos y texto no siempre comparten línea base; ajusta 1 px cuando haga falta.
- Asimetría intencional > simetría automática: un panel 2/3 + 1/3 se lee mejor que dos mitades iguales sin motivo.
- No uses bordes para separar lo que el espacio ya separa.
- En desktop, evita líneas de texto a todo el ancho; limita a `max-w-[65ch]`.

### 4.1 Ruido visual (lo que hay que quitar)

Cooper enumera las fuentes típicas de ruido:

- Adorno decorativo sin función.
- Render 3D o sombra que no aporta información.
- Cajas, reglas y bordes “pesados” para separar lo que el espacio ya separa.
- Amontonamiento de elementos.
- Colores, texturas y contrastes intensos sin jerarquía.
- Demasiados colores.
- Jerarquía débil (todo compite).

Regla: **quita cosas hasta que el diseño se rompa y devuelve la última**. Si un elemento no puede justificar su presencia, sobra.

## 5. Profundidad y superficie

Elige **un** sistema por superficie:

1. **Borde** (1 px, 8–12 % de contraste).
2. **Sombra** (difusa, con tinte del fondo, no negra pura).
3. **Cambio de superficie** (elevación por lightness).

No apiles borde + sombra + glow + gradiente en la misma card. El repo ya tiene `glow-card` y `shop-card`; úsalos donde corresponda, no en todo.

Recetas:

- Sombra suave: `0 1px 2px oklch(0 0 0 / .06), 0 8px 24px -12px oklch(0 0 0 / .18)`.
- Sombra de marca (una por vista): `0 18px 50px -24px oklch(0.6 0.27 335 / .45)`.
- En oscuro, la elevación se logra **subiendo la lightness** de la superficie (0.135 → 0.185 → 0.21) más que con sombra.
- Bordes interiores de 1 px con blanco al 6–10 % en oscuro; `#d2d2d7` en `.apple`.

## 6. Estados de componente (matriz obligatoria)

| Estado | Cambio visual | Regla |
| --- | --- | --- |
| Reposo | Base | Debe verse claramente interactivo |
| Hover | Fondo +4–8 % o borde más visible | 120 ms; solo en dispositivos con puntero |
| Activo/pressed | `translate-y-px` o escala 0.98 | Feedback inmediato, sin layout shift |
| Focus visible | Anillo 2–3 px + offset 2 px | Nunca `outline: none` sin reemplazo |
| Seleccionado | Fondo acento suave + borde/indicador + check | No solo color |
| Deshabilitado | Opacidad 0.5, `cursor-not-allowed` | Sin hover; explica por qué si no es obvio |
| Cargando | Spinner local o texto “Guardando…”, ancho estable | Bloquea doble envío |
| Inválido | Borde `destructive` + mensaje + `aria-invalid` | No solo rojo |
| Éxito | Icono + texto, no solo verde | Persistente, no toast efímero si es importante |
| Vacío | Ilustración/icono + explicación + CTA | Distinto de error |

El foco visible es **siempre** visible. En Tailwind: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background` (o el patrón existente con `ring-3`).

## 7. Microinteracciones y movimiento

| Uso | Duración | Easing |
| --- | --- | --- |
| Hover, pressed, check | 100–150 ms | ease-out |
| Aparición de menú/popover | 150–200 ms | cubic-bezier(0.2, 0, 0, 1) |
| Drawer/modal | 200–300 ms | ease-out al entrar, ease-in al salir |
| Cambio de layout | 200–300 ms | ease-in-out |
| Página/hero | 300–500 ms | suave, una sola vez |

Reglas:

- Anima `transform` y `opacity`; evita `width`, `height`, `top`, `left` y `box-shadow` en bucles.
- El feedback debe empezar en < 100 ms aunque la animación dure más.
- No animes para decorar: anima para explicar de dónde viene algo o confirmar una acción.
- `@media (prefers-reduced-motion: reduce)` obligatorio: elimina desplazamientos y parallax; deja opacidad.
- Nunca bloquees la interacción durante una animación decorativa.
- Nada de rebotes ni elasticidad en herramientas profesionales.

### 7.1 Presupuesto de respuesta (Cooper)

| Tiempo | Lo que percibe el usuario | Qué diseñar |
| --- | --- | --- |
| ≤ 0.1 s | Manipulación directa; instantáneo | Cambio inmediato, sin spinner |
| ≤ 1 s | Responsive; nota la espera pero no pierde el hilo | Feedback sutil, mantener el contexto |
| ≤ 10 s | Sabe que es lento; puede distraerse | Progreso determinado, tiempo estimado, cancelar |
| > 10 s | Pierde la atención | Segundo plano, notificación al terminar, permitir seguir trabajando |

Una animación de interacción debe durar **menos de 1 s**; si dura más, compite con la tarea. El feedback puede empezar a los 100 ms aunque el resultado tarde.

## 8. Datos y legibilidad

- Dinero y métricas: `tabular-nums`, alineación derecha, mismo número de decimales.
- Unidades visibles y separadas (“$24,900 MXN”, “850 W”, “2 TB”).
- Truncado con tooltip o acceso al valor completo; nunca cortes un precio.
- Diferencias (+/−) con signo y color semántico acompañado de texto.
- En gráficas: ejes legibles, sin 3D, sin sombras, una serie destacada; tooltip con valor exacto.
- No uses una gráfica para 2 valores; usa un número y una comparación.

## 9. Herramientas anti-planitud

Cuando una UI se siente plana, aplica **una o dos** de estas, no todas:

1. **Contraste de escala:** un título claramente más grande y uno secundario claramente más pequeño.
2. **Aire asimétrico:** 64 px arriba, 24 px abajo; el ojo entiende jerarquía.
3. **Superficie con tinte:** no un gris muerto; un gris con el matiz del tema (el repo usa hue 300).
4. **Borde de luz:** 1 px interior más claro en la parte superior de una card oscura.
5. **Acento escaso:** un solo punto de color en el dato o la acción.
6. **Tipografía con carácter:** `font-display` (Unbounded) solo en display/hero, nunca en párrafos.
7. **Imagen real:** una foto o render 3D vale más que un icono genérico.
8. **Solapamiento controlado:** un badge o avatar que cruza el borde de una card, con propósito.
9. **Detalle de datos:** una mini-sparkline, un timestamp, un conteo; señal de que alguien diseñó para el contenido real.
10. **Microcopy específico:** “Precios del 12 oct, 18:40” en lugar de “Actualizado”.
11. **Radios variados por rol:** control 8, card 16, tile 28.
12. **Textura sutil:** gradiente radial de fondo en el hero, no en toda la app.

Nunca: gradiente en cada card, glass en tablas, sombra+glow+borde en todo, iconos de colores al azar.

## 10. Tema oscuro (admin)

- Fondo `oklch(0.135 0.012 300)`, superficie `0.185`, elevada `0.2–0.21`. No negro puro.
- Texto principal `0.975`; secundario `0.72`; nunca bajes de ~0.6 para texto necesario.
- Bordes con blanco al 8–12 %. Si necesitas más separación, sube la superficie antes que el borde.
- El acento magenta `0.7 0.24 335` se usa en acción/foco/selección; el glow, una vez por vista.
- Las sombras casi no se leen: usa elevación por lightness + borde de luz.
- Cuidado con el texto gris sobre superficies de color: sube el contraste o usa el color de texto del tema.
- Las imágenes y renders 3D necesitan un fondo de estudio (`stage`) para no flotar en el vacío.

## 11. Tema claro `.apple` (tienda)

- Fondo `#f5f5f7`, superficie `#fff`, texto `#1d1d1f`, secundario `#6e6e73`, borde `#d2d2d7`.
- Un solo acento azul `#0071e3`; enlaces `#0066cc`. Nada de magenta en la tienda.
- Tipografía grande y apretada (`tracking-tight`, display 28–32 px en secciones; hero aún mayor).
- Mucho aire: secciones de 64–96 px, líneas de 60–70 caracteres.
- Tiles de 28 px de radio, sin sombras fuertes; borde casi invisible.
- Botones pill (`rounded-full`, `btn-blue`) para la acción principal; enlaces de texto para la secundaria.
- Imágenes sobre fondo claro (`stage-light`), sin marcos.
- El lujo aquí es la restricción: no agregues gradientes, neones ni bordes decorativos.

## 12. Revisión visual en 60 segundos

1. Entrecerrar los ojos: ¿se distinguen título, dato y acción?
2. ¿Hay más de un acento compitiendo?
3. ¿Todo está en la escala de 4 px?
4. ¿Los bordes son necesarios?
5. ¿El foco se ve en teclado?
6. ¿Los estados deshabilitados explican por qué?
7. ¿El texto secundario tiene contraste suficiente en ambos temas?
8. ¿La densidad corresponde a la tarea?
9. ¿Hay algún valor arbitrario (`13px`, `#3b3b3b`, `rounded-[7px]`)?
10. ¿Se ve como una plantilla o como esta app?
