# Contexto del proyecto · PC Store (Forge HW)

Este archivo evita que la skill proponga un diseño ajeno al repo. Léelo antes de tocar UI.

## 1. Stack real

- **Next.js 16.4.2** (App Router, Turbopack). Antes de escribir código, revisa la guía relevante en `node_modules/next/dist/docs/`; esta versión tiene cambios respecto a versiones anteriores.
- **React 19.3**, **TypeScript**, **Tailwind CSS v4** (CSS-first, sin `tailwind.config`).
- **shadcn/ui** estilo `base-nova` sobre **Base UI** (`@base-ui/react`), no Radix.
- **lucide-react** para iconos, **cva** para variantes, **cn** desde el paquete `cn` (re-exportado en `@/lib/utils`).
- **react-three-fiber / drei** para los visores 3D.
- Datos desde SQLite local vía `node:sqlite`; no hay login ni pagos.

## 2. Temas y cuándo usar cada uno

| Zona | Layout raíz | Clase | Paleta |
| --- | --- | --- | --- |
| Tienda pública | `src/app/(shop)/layout.tsx` | `apple` | Clara: `#f5f5f7`, `#fff`, `#1d1d1f`, azul `#0071e3` |
| Panel | `src/app/(admin)/layout.tsx` | `dark` | Oscura: fondo `oklch(0.135 0.012 300)`, acento magenta `oklch(0.7 0.24 335)` |
| Miniaturas | `src/app/(bare)/layout.tsx` | — | Fondo neutro para renders |

**No mezcles los dos temas en una misma vista.** Un componente compartido debe usar tokens (`bg-background`, `text-foreground`, `border-border`, `bg-primary`), nunca hex fijos, para funcionar en ambos.

### Tokens oscuros (admin)

| Token | Valor |
| --- | --- |
| `--background` | `oklch(0.135 0.012 300)` |
| `--card` | `oklch(0.185 0.018 300)` |
| `--popover` | `oklch(0.2 0.02 300)` |
| `--foreground` | `oklch(0.975 0.005 300)` |
| `--muted-foreground` | `oklch(0.72 0.03 300)` |
| `--primary` / `--ring` | `oklch(0.7 0.24 335)` |
| `--border` | `oklch(1 0 0 / 9%)` |
| Charts | magenta, violeta, azul, ámbar, verde |

### Tokens `.apple` (tienda)

| Token | Valor |
| --- | --- |
| `--background` / `--card` | `#ffffff` |
| `--foreground` | `#1d1d1f` |
| `--muted` / `--secondary` | `#f5f5f7` |
| `--muted-foreground` | `#6e6e73` |
| `--border` / `--input` | `#d2d2d7` |
| `--primary` / `--ring` | `#0071e3` |
| Enlaces | `#0066cc` |

### Utilidades existentes (no las reinventes)

| Clase | Para qué |
| --- | --- |
| `.brand-gradient` | Fondo degradado magenta/violeta (logo, acentos) |
| `.brand-text` | Texto con degradado de marca |
| `.glow-card` | Card con borde y glow magenta |
| `.stage` | Fondo radial oscuro para renders 3D |
| `.hero-glow` | Resplandor del hero |
| `.shop-card` | Card de tienda oscura (legacy) |
| `.font-display` | Unbounded, solo display/hero |
| `.task-pop` | Animación de aparición de tareas |
| `.rail-inset` | Alineación del carril con el contenedor de 1120 px |
| `.apple .btn-blue` | Botón pill azul de tienda |
| `.apple .tile` / `.tile-gray` | Tiles de 28 px de radio |
| `.apple .opt` | Opción seleccionable de tienda (borde azul al elegir) |
| `.apple .stage-light` | Fondo claro de renders |

## 3. Tipografía

- **Geist Sans** (`--font-geist-sans`): UI y texto.
- **Geist Mono** (`--font-geist-mono`): datos técnicos, atajos, readouts 3D.
- **Unbounded** (`--font-display`): solo títulos display y hero, vía `.font-display`.
- El body ya declara Geist Sans explícitamente; no lo sobrescribas sin razón.

Escala observada en tienda: títulos de sección 28–32 px, body 17 px, header 12–15 px, captions 10–12 px. En admin: `text-sm` (14 px) dominante, títulos 20–24 px, metadatos 12–13 px.

## 4. Shells y medidas

- **Tienda:** `SHOP_MAX = "mx-auto w-full max-w-[1120px]"`, `SHOP_PAD = "px-5 sm:px-6"` (`src/lib/shop-shell.ts`). Header de 48 px (`h-12`), translúcido; footer 1080 px.
- **Admin:** sidebar fija de 240 px (`w-60`), sticky, `px-6`; header sticky de `py-3` con `backdrop-blur`; `main` con `p-6`.
- **Ancho de lectura:** 880–1080 px; formularios 480–640 px; configurador 560–680 px.
- **Breakpoints:** `sm` 640, `md` 768, `lg` 1024, `xl` 1280.

## 5. Rutas y postura

| Ruta | Superficie | Notas de diseño |
| --- | --- | --- |
| `/` | Editorial | Hero con PC 3D, título grande, carril de productos, Forge Setup |
| `/[line]` | Editorial | Página de línea/uso; narrativa y especificaciones |
| `/pc/[slug]` | Transaccional + configurador | Ficha con visor 3D, precio, stock, configuración en vivo |
| `/bolsa` | Transaccional | Carrito y formulario corto (nombre, contacto) |
| `/pedido/[id]` | Confirmación | Qué sigue, sin cobro; debe dar tranquilidad |
| `/admin` | Operacional | Resumen: KPIs, último scrape, accesos |
| `/admin/orders`, `/admin/orders/[id]` | Operacional | Pedidos y detalle |
| `/admin/pcs`, `/admin/pcs/[slug]` | Operacional | Tabla de PCs y detalle editable |
| `/admin/offers` | Operacional | Ofertas y stock (alta densidad) |
| `/admin/models` | Operacional | Modelos 3D y miniaturas |
| `/admin/pricing` | Operacional | Precios y margen (números, tablas) |
| `/bare/thumb/[id]` | Utilidad | Render para generar miniaturas; sin cromo |

### 5.1 Postura y comportamiento esperado

| Zona | Postura (Cooper) | Implicaciones |
| --- | --- | --- |
| `/admin/*` | **Soberana** | Densidad alta, atajos, optimizar para intermedios perpetuos; no héroes ni tutoriales |
| Configurador | **Soberana de creación** | Preview + herramientas cerca, defaults, preview del resultado, undo de la última elección |
| `/` y `/[line]` | **Editorial** | Mostrar una cosa/lista con narrativa; no densidad de herramienta |
| `/pc/[slug]` | **Transaccional** | Precio, stock y acción visibles; fricción mínima |
| `/bolsa`, `/pedido/[id]` | **Transitoria** | Una sola ventana/vista, etiquetas explícitas, targets grandes, sin sub-diálogos |
| Forge Setup | **Daemónica/transitoria** | No interrumpe; progreso y estado claros; se puede cerrar y volver |

Consecuencias concretas:

- **Admin:** las acciones reversibles se hacen y ofrecen undo; las irreversibles se confirman con nombre y consecuencia. Filtros y selección sobreviven a la recarga. Lo frecuente a un clic; lo riesgoso, escondido.
- **Configurador:** no preguntes lo que puedes preseleccionar. Muestra el total y el delta siempre. Si una opción invalida otra, explica y ofrece alternativa. “Restablecer todo” no sustituye a “deshacer último cambio”.
- **Tienda:** el usuario debe poder explorar sin miedo (volver conserva posición y bolsa). El primer éxito (ver precio, agregar) no puede quedar detrás de un registro.
- **Checkout:** una sola columna, errores junto al campo, progreso del envío, sin ventanas anidadas. El final (confirmación) es lo que más se recuerda: cuídalo (peak-end).
- **Datos:** muestra el modelo mental (“pedido”, “pieza”, “precio de hoy”), no el de implementación (“row”, “SKU”, “quote”).

## 6. Inventario de componentes

**UI base (`src/components/ui`):** `badge`, `button`, `card`, `input`, `progress`, `scroll-area`, `select`, `separator`, `skeleton`, `slider`, `switch`, `table`, `tabs`, `tooltip`.

**Admin:** `nav`, `pc-table`, `refresh-button`.

**Tienda:** `add-to-cart`, `cart-view`, `case-stage`, `clear-cart`, `configurator`, `forge-setup-app`, `hero-viewer`, `pc-stage`, `product-rail`, `shop-header`, `terra-hero`.

**3D:** `components/three/*` (viewer, escena, materiales, focus, explode, fan, layout).

Si necesitas `dialog`, `dropdown-menu`, `command`, `checkbox`, `radio-group`, `accordion`, `breadcrumb`, `pagination`, `sonner`, `form`, `alert` o `field`, agrégalos con el CLI de shadcn respetando el estilo `base-nova`; no importes Radix.

## 7. Convenciones de producto

- **Idioma:** español de México. Sentence case. Sin “OK”, sin “hacer clic aquí”.
- **Moneda:** `mxn()` de `@/lib/pricing`; siempre MXN y `tabular-nums` en tablas.
- **Fechas:** `es-MX`, zona `America/Monterrey`; incluye hora cuando el dato caduca (precios).
- **Stock:** “Sujeto a stock” es ámbar; “Sin stock completo” es destructivo. No prometas disponibilidad.
- **Precios:** los recalcula el servidor; la UI nunca inventa totales ni descuenta por su cuenta.
- **Pedido:** no se cobra nada; el copy debe dejar claro qué sigue y que se confirma stock.
- **Admin:** densidad alta, teclado, datos reales; nada de héroes ni ilustraciones decorativas.
- **Tienda:** una idea por sección, mucho aire, un solo acento azul, imágenes grandes.
- **3D:** el canvas necesita fondo (`stage`), controls accesibles, fallback estático y `prefers-reduced-motion` para animaciones automáticas.
- **Skeletons:** `admin/pcs` ya usa `data-skeleton-target="admin-pcs"` y `data-skeleton="admin-pcs"`. Para medirlo: `node .opencode/skills/ui-design/scripts/skeleton-audit.mjs --base-url http://localhost:3001`. Ver `09-skeleton-audit.md`.

## 8. Do / Don't del repo

| Do | Don't |
| --- | --- |
| Usar `Button`, `Input`, `Badge`, `Table` existentes | Crear un botón con `div` y clases sueltas |
| Usar tokens (`bg-card`, `text-muted-foreground`) | Hex nuevos en componentes (`#2a2a2a`) |
| Reutilizar `SHOP_MAX` / `SHOP_PAD` | Repetir `max-w-[1120px]` a mano |
| Mantener el patrón de item activo del admin | Introducir otro color de selección |
| Formatear con `mxn()` | Concatenar `$` + número |
| Iconos lucide de 16 px | Emojis como iconos |
| `"use client"` solo donde hace falta | Convertir una página entera en client por un botón |
| Estados vacío/error/carga | Mostrar `null` o una tabla vacía sin explicación |
| Respetar el tema de cada layout | Mezclar azul Apple y magenta admin |

## 9. Riesgos visuales actuales (a vigilar)

- **Duplicación de estilos:** hay clases hex de la tienda (`#0071e3`, `#6e6e73`, `#d2d2d7`) repetidas en JSX. Al tocar esos archivos, prefiere tokens o utilidades `.apple` antes que añadir otro hex.
- **Dos sistemas de card:** `shop-card` (oscuro legacy) y `.apple .tile` (claro). No los mezcles en la misma página.
- **Tipografía:** no uses `.font-display` en párrafos ni en admin; está pensada para display.
- **Contraste:** el texto secundario de tienda (`#6e6e73` sobre `#f5f5f7`) cumple para texto normal, pero no lo aclares más.
- **Densidad del admin:** el sidebar de 240 px y `p-6` son el ritmo establecido; no metas una segunda sidebar ni dupliques headers.
- **3D:** el canvas no debe capturar el scroll de la página; los controles deben tener alternativa de teclado o botones.
