# Publicar la skill en skills.sh

## 1. Nombre del repositorio

Recomendado: **`ui-design-atlas`**

- Es único y descriptivo: un atlas de principios, patrones y reglas de UI.
- No compite con los muchos repositorios llamados `ui-design` o `interface-craft` que ya existen en skills.sh.
- El ID de la skill sigue siendo `ui-design`, así que la instalación queda:
  ```bash
  npx skills add <owner>/ui-design-atlas --skill ui-design
  ```

Alternativas:

| Nombre | Cuándo elegirlo |
| --- | --- |
| `ui-design-atlas` | Recomendado: general, memorable, sin colisión evidente |
| `forge-ui-design` | Si quieres que quede atada a Forge HW / PC Store |
| `ui-design-skill` | Simple, pero genérico y fácil de confundir |
| `agent-skills` + `skills/ui-design/` | Si vas a publicar más skills en el mismo repo |

No uses `interface-craft` ni `interface-design`: ya hay skills públicas con esos nombres y una página de skills.sh los desambigua por `owner/repo`, pero el tuyo se perdería entre resultados.

## 2. Estructura

### Opción A — un solo skill (recomendada para empezar)

```
ui-design-atlas/
├── SKILL.md
├── README.md
├── PUBLISHING.md
├── references/
│   ├── 00-fuentes.md
│   ├── …
│   └── 09-skeleton-audit.md
├── scripts/
│   ├── ui-audit.mjs
│   ├── skeleton-audit.mjs
│   ├── skeleton-audit.config.json
│   └── ocr-pdf.py
└── .gitignore
```

El CLI descubre el `SKILL.md` en la raíz del repo.

### Opción B — varios skills en un repo

```
agent-skills/
├── README.md
└── skills/
    └── ui-design/
        ├── SKILL.md
        ├── references/
        └── scripts/
```

El CLI busca en `skills/`, `skills/<categoría>/` y `skills/<categoría>/<categoría>/` hasta 3 niveles. Para instalar solo esta:

```bash
npx skills add <owner>/agent-skills --skill ui-design
```

## 3. Preparar el repo

Copia la carpeta fuera del repo de PC Store para no crear un repositorio anidado:

```powershell
Copy-Item -Recurse .opencode\skills\ui-design C:\ruta\ui-design-atlas
cd C:\ruta\ui-design-atlas
```

Comprueba el frontmatter: `name` y `description` son obligatorios, y `name` debe ser un identificador en minúsculas con guiones.

```yaml
---
name: ui-design
description: >-
  …
---
```

Luego:

```bash
git init
git add .
git commit -m "feat: ui design skill"
git branch -M main
git remote add origin https://github.com/<owner>/ui-design-atlas.git
git push -u origin main
```

En GitHub, haz el repositorio **público** y agrega topics: `agent-skills`, `ui-design`, `design-system`, `playwright`.

## 4. Verificar antes de publicar

```bash
# Lista las skills del repo sin instalar
npx skills add <owner>/ui-design-atlas --list

# Instala solo esta en OpenCode, en el proyecto actual
npx skills add <owner>/ui-design-atlas --skill ui-design -a opencode -y

# Prueba local antes del push
npx skills add ./ui-design-atlas --list
```

Comprueba también:

```bash
node scripts/ui-audit.mjs --help
node scripts/skeleton-audit.mjs --help
python scripts/ocr-pdf.py --help
```

## 5. Publicar en skills.sh

skills.sh indexa repositorios públicos de GitHub; no aloja una copia central. Después del push:

1. Abre `https://skills.sh` y busca `<owner>/ui-design-atlas`.
2. Si no aparece, usa el flujo de publicación/contacto de skills.sh con la URL del repo.
3. Confirma que la página muestra el `SKILL.md`, la descripción y el comando de instalación.
4. Verifica la instalación desde otro directorio con `npx skills add <owner>/ui-design-atlas --skill ui-design`.

## 6. Seguridad y transparencia

El repo incluye scripts que:

- Lanzan Chrome/Edge o Playwright y navegan a URLs locales.
- Leen archivos del proyecto (`ui-audit.mjs` escanea `src/`).
- Opcionalmente convierten PDFs a imágenes y ejecutan un modelo OCR (solo con GPU).

Declara esto en el README y mantén los scripts sin telemetría ni envío de datos. Si publicas en skills.sh, sus audits de seguridad revisan el repo; no agregues dependencias innecesarias.

## 7. Mantener

- Cambia la versión del skill cuando cambies referencias o scripts.
- Prueba `npx skills add … --list` después de cada cambio de estructura.
- Si renombras `ui-design` a `ui-design-atlas`, actualiza:
  - el nombre del frontmatter,
  - el nombre del directorio,
  - el comando de instalación del README,
  - la tabla de referencias de `SKILL.md` si cambia alguna ruta.
