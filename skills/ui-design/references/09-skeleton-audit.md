# Skeleton audit · medir la UI real antes de dibujar el esqueleto

Un skeleton no es una tarjeta gris decorativa: es el **wireframe del contenido real** y su trabajo es reservar el espacio exacto para que nada salte cuando llegan los datos. Si mide distinto, el usuario ve un layout shift; en ese caso es más honesto un spinner.

Este flujo mide la UI cargada con un navegador real y ajusta los skeletons a esas medidas.

## 1. Flujo

1. **Identifica superficies y estados** que verá el usuario: tabla de PCs, lista de pedidos, ficha de producto, configurador, bolsa.
2. **Instrumenta** el contenido real y su skeleton con un id compartido:
   ```tsx
   <Card data-skeleton-target="admin-pcs">…</Card>
   <Skeleton data-skeleton="admin-pcs" className="h-96 w-full" />
   ```
   Si no quieres tocar el código, declara `selector` y `skeleton` en el config.
3. **Configura** viewports, páginas y estados (`skeleton-audit.config.json`).
4. **Mide** con Playwright (o el fallback con puppeteer-core):
   ```bash
   node .opencode/skills/ui-design/scripts/skeleton-audit.mjs \
     --config .opencode/skills/ui-design/scripts/skeleton-audit.config.json \
     --base-url http://localhost:3001
   ```
5. **Lee** `.skeleton-audit/skeleton-audit.md` y `.skeleton-audit/skeleton-audit.css`.
6. **Aplica** las variables al skeleton y vuelve a medir hasta que `Δ ≤ 2 px`.
7. **Verifica** que no haya layout shift, que se respete `prefers-reduced-motion` y que el skeleton desaparezca cuando llegan los datos.

## 2. Qué mide

- Caja de hasta 6 elementos por target (`getBoundingClientRect`), con mediana, mínimo y máximo.
- Alto, ancho, padding, margen, gap, radio, tipografía y línea.
- Compara **alto** por defecto; el ancho solo si `compareWidth: true` (una card puede ser fluida y no coincidir con el contenido).
- Genera variables CSS por breakpoint:
  ```css
  :root { --sk-admin-pcs-h: 384px; }
  @media (min-width: 768px) { :root { --sk-admin-pcs-h: 512px; } }
  ```
  Uso:
  ```tsx
  <Skeleton data-skeleton="admin-pcs" className="h-[var(--sk-admin-pcs-h)] w-full" />
  ```

## 3. Estados

Un skeleton honesto distingue estados:

| Estado | Qué se mide | Regla |
| --- | --- | --- |
| **Loaded** | La UI con datos reales | Es la referencia de tamaño; mide la forma típica, no el caso extremo |
| **Loading** | El skeleton visible | Debe coincidir en alto con la UI típica; el número de filas/bloques debe ser el esperado |
| **Empty** | Estado vacío | No uses skeleton: muestra el mensaje y el CTA |
| **Error** | Error con reintento | No uses skeleton: muestra qué falló y la salida |
| **Slow network** | Loading prolongado | El skeleton debe seguir siendo creíble; no lo reemplaces por un spinner genérico |

Para capturar el estado de carga, configura `states[].hold` con los patrones de red que quieras retrasar y `waitFor` el selector del skeleton. Si tu app no expone ese estado, crea una ruta de depuración (`?skeleton=1`) o un `loading.tsx` que renderice el skeleton; es más fiable que esperar por timing.

## 4. Config

```json
{
  "baseUrl": "http://localhost:3000",
  "tolerance": 2,
  "viewports": [
    { "name": "mobile", "width": 360, "height": 800 },
    { "name": "tablet", "width": 768, "height": 1024 },
    { "name": "desktop", "width": 1280, "height": 900 }
  ],
  "pages": [
    {
      "name": "admin-pcs",
      "path": "/admin/pcs",
      "compareWidth": false,
      "states": [
        { "name": "loaded", "waitFor": "[data-skeleton-target='admin-pcs']" },
        {
          "name": "loading",
          "hold": ["**/*?_rsc=*"],
          "holdMs": 1500,
          "waitFor": "[data-skeleton='admin-pcs']",
          "settle": 0
        }
      ]
    }
  ]
}
```

Campos:

| Campo | Para qué |
| --- | --- |
| `targets` | `[{ id, selector, skeleton }]` si no usas `data-skeleton-*` |
| `states[].path` | URL alternativa para forzar un estado (`?empty=1`, `?skeleton=1`) |
| `states[].initScript` | JS antes de cargar (localStorage, cookies, flags) |
| `states[].before` | JS después de cargar (clic, filtro, cambio de estado) |
| `states[].hold` | Patrones de URL a retrasar (glob) para ver el loading |
| `states[].waitFor` | Selector que debe existir antes de medir |
| `states[].settle` | Espera extra en ms (0 para loading, 500 por defecto) |
| `compareWidth` | Compara ancho además de alto |
| `tolerance` | Diferencia aceptable en px (2 por defecto) |

## 5. Instalación

Playwright es el motor recomendado:

```bash
npm i -D playwright
npx playwright install chromium
```

Si no está, el script usa `playwright-core` o `puppeteer-core` con Chrome/Edge instalado. En este repo ya está `puppeteer-core`:

```bash
node .opencode/skills/ui-design/scripts/skeleton-audit.mjs \
  --engine puppeteer \
  --browser "C:/Program Files/Google/Chrome/Application/chrome.exe" \
  --base-url http://localhost:3001
```

## 6. Cómo aplicar el resultado

1. Copia el bloque CSS generado a `globals.css` o al CSS del componente.
2. Usa `h-[var(--sk-ID-h)]` en el skeleton (sustituye `ID` por el id del target); no repitas px por breakpoint.
3. Si el contenido varía de alto (filas), reserva el **número típico de filas** y usa `min-height` para no colapsar; el skeleton no debe prometer el máximo.
4. Mantén el mismo radio, padding, gap y color de superficie que el contenido real.
5. Para texto, replica líneas y `line-height`: una barra de 16 px no representa un párrafo de 4 líneas.
6. Vuelve a correr el audit; no confíes en la primera medición.

## 7. Anti-patrones

- Un solo skeleton genérico para todas las páginas.
- Skeleton más chico o más grande que el contenido → CLS.
- Spinner centrado en una pantalla cuya estructura ya se conoce.
- Skeleton que nunca termina o que aparece después de 2 s.
- Animar `width`/`height` en bucle; anima opacidad o un gradiente sutil.
- Ocultar el error con un skeleton eterno.
- Medir con datos de demo irreales (siempre 3 filas, siempre el título más corto).
- Ignorar móvil: el skeleton de escritorio casi nunca sirve en 360 px.

## 8. Verificación

- `Δ` de alto ≤ 2 px en 360, 768 y 1280.
- Ningún salto visible al llegar los datos (prueba con red lenta).
- El skeleton tiene el mismo número de bloques que el contenido típico.
- `prefers-reduced-motion`: sin pulso ni desplazamiento.
- El estado vacío y el error no muestran skeleton.
- El skeleton desaparece aunque la petición falle (y aparece el error).

## 9. Relación con el resto de la skill

- **Capa 3 (UI):** el skeleton es parte de la matriz de estados; no es decoración.
- **Capa 4 (componentes):** el skeleton es un componente con estados, no un `div` suelto.
- **Checklist:** úsalo en la puerta de “estados” y en la de “responsive”.
- **Medición:** este script mide; la decisión de cuántas filas reservar sigue siendo de diseño.
