#!/usr/bin/env node
/**
 * skeleton-audit.mjs — Mide la UI cargada y el skeleton, y sugiere tamaños reales.
 *
 * Flujo:
 *   1. Abre cada página/estado en varios viewports.
 *   2. Mide los elementos marcados con [data-skeleton-target] (o selectores del config).
 *   3. Mide los skeletons marcados con [data-skeleton] o el selector configurado.
 *   4. Compara medianas y genera reporte + CSS.
 *
 * Uso:
 *   node .opencode/skills/ui-design/scripts/skeleton-audit.mjs
 *   node .opencode/skills/ui-design/scripts/skeleton-audit.mjs --config skeleton-audit.config.json
 *   node .opencode/skills/ui-design/scripts/skeleton-audit.mjs --engine puppeteer --browser "C:/.../chrome.exe"
 *
 * Motor:
 *   - Playwright si está instalado (`npm i -D playwright` + `npx playwright install chromium`).
 *   - Si no, usa `playwright-core` o `puppeteer-core` (este repo ya tiene puppeteer-core + Chrome).
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DEFAULT_VIEWPORTS = [
  { name: "mobile", width: 360, height: 800 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 900 },
];

function sleep(ms) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

function parseArgs(argv) {
  const args = { engine: "auto", headed: false, screenshots: false, failOnMismatch: false, timeout: 30000 };
  for (let index = 0; index < argv.length; index++) {
    const value = argv[index];
    const next = () => argv[++index];
    if (value === "--config") args.config = next();
    else if (value === "--base-url") args.baseUrl = next();
    else if (value === "--out") args.out = next();
    else if (value === "--engine") args.engine = next();
    else if (value === "--browser") args.browser = next();
    else if (value === "--timeout") args.timeout = Number(next());
    else if (value === "--headed") args.headed = true;
    else if (value === "--screenshots") args.screenshots = true;
    else if (value === "--fail-on-mismatch") args.failOnMismatch = true;
    else if (value === "--help" || value === "-h") args.help = true;
    else if (!value.startsWith("-")) args.positional = value;
  }
  return args;
}

function printHelp() {
  console.log(`
skeleton-audit · mide la UI real y ajusta tus skeletons

  node skeleton-audit.mjs [opciones]

Opciones:
  --config <archivo>       JSON de configuración (default: ./skeleton-audit.config.json)
  --base-url <url>         URL base (default: config.baseUrl o http://localhost:3000)
  --out <carpeta>          Salida (default: .skeleton-audit)
  --engine <auto|playwright|playwright-core|puppeteer>
  --browser <ruta>         Chrome/Edge ejecutable (para puppeteer o playwright-core)
  --timeout <ms>           Timeout por navegación (default: 30000)
  --headed                 Muestra el navegador
  --screenshots            Guarda screenshots por página/estado/viewport
  --fail-on-mismatch       Sale con código 1 si hay diferencias o skeletons faltantes

Convención recomendada:
  <div data-skeleton-target="admin-pcs">…contenido real…</div>
  <Skeleton data-skeleton="admin-pcs" … />

También puedes declarar targets/selectores en el JSON.
`);
}

function detectBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];
  return candidates.find((candidate) => candidate && existsSync(candidate));
}

function globToRegExp(pattern) {
  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "\u0000")
    .replace(/\*/g, "[^/]*")
    .replace(/\u0000/g, ".*");
  return new RegExp(`^${escaped}$`);
}

async function launchBrowser(engine, headed, executablePath) {
  const errors = [];

  for (const candidate of ["playwright", "playwright-core"]) {
    if (engine !== "auto" && engine !== candidate) continue;
    try {
      const { chromium } = await import(candidate);
      const browser = await chromium.launch({
        headless: !headed,
        executablePath: executablePath || (candidate === "playwright-core" ? detectBrowser() : undefined),
      });
      return { engine: candidate, kind: "playwright", browser };
    } catch (error) {
      errors.push(`${candidate}: ${error.message}`);
      if (engine === candidate) throw error;
    }
  }

  if (engine === "auto" || engine === "puppeteer") {
    try {
      const puppeteer = (await import("puppeteer-core")).default;
      const path = executablePath || detectBrowser();
      if (!path) throw new Error("No encontré Chrome ni Edge. Pasa --browser <ruta>.");
      const browser = await puppeteer.launch({ executablePath: path, headless: !headed, args: ["--no-sandbox"] });
      return { engine: "puppeteer", kind: "puppeteer", browser };
    } catch (error) {
      errors.push(`puppeteer-core: ${error.message}`);
      if (engine === "puppeteer") throw error;
    }
  }

  throw new Error(
    `No pude lanzar un navegador.\n${errors.map((line) => `  - ${line}`).join("\n")}\n` +
      "Instala Playwright: npm i -D playwright && npx playwright install chromium\n" +
      "O usa Chrome/Edge con: --engine puppeteer --browser <ruta>",
  );
}

async function createSession(launched, viewport, timeout) {
  if (launched.kind === "playwright") {
    const context = await launched.browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    page.setDefaultTimeout(timeout);
    return { kind: "playwright", page, context, timeout };
  }

  const page = await launched.browser.newPage();
  await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: 1 });
  page.setDefaultTimeout(timeout);
  return { kind: "puppeteer", page, context: null, timeout, rules: [], interception: false };
}

async function addInitScript(session, script) {
  if (!script) return;
  if (session.kind === "playwright") await session.page.addInitScript({ content: script });
  else await session.page.evaluateOnNewDocument(script);
}

async function addHold(session, pattern, delay) {
  if (!pattern || delay <= 0) return;
  if (session.kind === "playwright") {
    await session.page.route(pattern, async (route) => {
      await sleep(delay);
      await route.continue().catch(() => {});
    });
    return;
  }

  if (!session.interception) {
    await session.page.setRequestInterception(true);
    session.page.on("request", (request) => {
      const rule = session.rules.find((item) => item.regex.test(request.url()));
      if (!rule) {
        request.continue().catch(() => {});
        return;
      }
      setTimeout(() => request.continue().catch(() => {}), rule.delay);
    });
    session.interception = true;
  }
  session.rules.push({ pattern, delay, regex: globToRegExp(pattern) });
}

async function goto(session, url, waitUntil) {
  await session.page.goto(url, { waitUntil, timeout: session.timeout });
}

async function waitFor(session, selector, timeout) {
  if (!selector) return true;
  const selectors = Array.isArray(selector) ? selector : [selector];
  for (const item of selectors) {
    if (!item) continue;
    try {
      if (session.kind === "playwright") await session.page.waitForSelector(item, { timeout, state: "attached" });
      else await session.page.waitForSelector(item, { timeout });
    } catch {
      return false;
    }
  }
  return true;
}

/**
 * Espera a que los targets tengan tamaño real. En Next con streaming, el root
 * puede existir antes de que lleguen las filas y medir 0×0.
 */
async function waitForStableSize(session, targets, timeout) {
  const selectors = targets.length
    ? targets.map((target) => target.selector).filter(Boolean)
    : ["[data-skeleton-target]"];
  if (!selectors.length) return;

  const script = (items) => {
    const elements = items.flatMap((selector) => [...document.querySelectorAll(selector)]);
    if (!elements.length) return false;
    return elements.every((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 1 && rect.height > 1;
    });
  };

  try {
    if (session.kind === "playwright") {
      await session.page.waitForFunction(script, selectors, { timeout: Math.min(timeout, 8000) });
    } else {
      await session.page.waitForFunction(script, { timeout: Math.min(timeout, 8000) }, selectors);
    }
  } catch {
    /* si no estabiliza, se mide igual y el reporte lo mostrará */
  }
}

async function runBefore(session, code) {
  if (!code) return;
  await session.page.evaluate((source) => {
    // eslint-disable-next-line no-eval
    return eval(source);
  }, code);
}

/**
 * Se ejecuta dentro del navegador. Debe ser autocontenida.
 */
function measureInPage({ targets, maxSamples }) {
  const round = (value) => Math.round(value * 100) / 100;
  const median = (values) => {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  };

  const describe = (element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      tag: element.tagName.toLowerCase(),
      width: round(rect.width),
      height: round(rect.height),
      scrollHeight: element.scrollHeight,
      x: round(rect.left + window.scrollX),
      y: round(rect.top + window.scrollY),
      padding: style.padding,
      margin: style.margin,
      gap: style.gap,
      borderRadius: style.borderRadius,
      fontSize: style.fontSize,
      lineHeight: style.lineHeight,
      display: style.display,
    };
  };

  const summarize = (elements) => {
    const items = elements.slice(0, maxSamples).map(describe);
    const heights = items.map((item) => item.height).filter(Number.isFinite);
    const widths = items.map((item) => item.width).filter(Number.isFinite);
    return {
      count: elements.length,
      samples: items,
      median: { width: round(median(widths)), height: round(median(heights)) },
      min: { width: round(Math.min(...widths)), height: round(Math.min(...heights)) },
      max: { width: round(Math.max(...widths)), height: round(Math.max(...heights)) },
    };
  };

  const autoTargets = [
    ...new Set(
      [...document.querySelectorAll("[data-skeleton-target]")]
        .map((element) => element.getAttribute("data-skeleton-target"))
        .filter(Boolean),
    ),
  ];

  const resolved = targets.length
    ? targets
    : autoTargets.map((id) => ({ id, selector: null, skeleton: null }));

  if (!resolved.length) {
    return {
      __warning:
        "No hay targets. Agrega data-skeleton-target=\"<id>\" al contenido real o define targets en el config.",
    };
  }

  const output = {};
  for (const target of resolved) {
    const targetElements = target.selector
      ? [...document.querySelectorAll(target.selector)]
      : [...document.querySelectorAll("[data-skeleton-target]")].filter(
          (element) => element.getAttribute("data-skeleton-target") === target.id,
        );

    const skeletonElements = target.skeleton
      ? [...document.querySelectorAll(target.skeleton)]
      : [...document.querySelectorAll("[data-skeleton]")].filter(
          (element) => element.getAttribute("data-skeleton") === target.id,
        );

    output[target.id] = {
      selector: target.selector || `[data-skeleton-target="${target.id}"]`,
      skeletonSelector: target.skeleton || `[data-skeleton="${target.id}"]`,
      target: targetElements.length ? summarize(targetElements) : null,
      skeleton: skeletonElements.length ? summarize(skeletonElements) : null,
    };
  }
  return output;
}

function sanitizeId(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function pickMeasurement(results, pageName, viewportName, id, kind) {
  const preferred = kind === "target" ? ["loaded", "default"] : ["loading", "skeleton", "default"];
  const candidates = results.filter(
    (result) =>
      result.page === pageName &&
      result.viewport === viewportName &&
      result.data?.[id]?.[kind] &&
      !result.error,
  );
  if (!candidates.length) return null;
  candidates.sort((a, b) => {
    const aIndex = preferred.indexOf(a.state);
    const bIndex = preferred.indexOf(b.state);
    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
  });
  return { state: candidates[0].state, summary: candidates[0].data[id][kind] };
}

function compareResults(results, pages, viewports, tolerance) {
  const comparisons = [];
  for (const page of pages) {
    const ids = new Set((page.targets || []).map((target) => target.id));
    for (const result of results) {
      if (result.page !== page.name) continue;
      for (const id of Object.keys(result.data || {})) ids.add(id);
    }

    for (const viewport of viewports) {
      for (const id of ids) {
        const target = pickMeasurement(results, page.name, viewport.name, id, "target");
        const skeleton = pickMeasurement(results, page.name, viewport.name, id, "skeleton");
        const deltaHeight =
          target && skeleton ? round(skeleton.summary.median.height - target.summary.median.height) : null;
        const deltaWidth =
          target && skeleton ? round(skeleton.summary.median.width - target.summary.median.width) : null;

        let status = "ok";
        if (!target && !skeleton) status = "missing-both";
        else if (!target) status = "missing-target";
        else if (!skeleton) status = "missing-skeleton";
        else if (
          Math.abs(deltaHeight) > tolerance ||
          (page.compareWidth && deltaWidth != null && Math.abs(deltaWidth) > tolerance)
        ) {
          status = "mismatch";
        }

        comparisons.push({
          page: page.name,
          id,
          viewport: viewport.name,
          viewportWidth: viewport.width,
          targetState: target?.state ?? null,
          skeletonState: skeleton?.state ?? null,
          target: target?.summary ?? null,
          skeleton: skeleton?.summary ?? null,
          delta: { height: deltaHeight, width: deltaWidth },
          status,
        });
      }
    }
  }
  return comparisons;
}

function buildCss(comparisons) {
  const withTarget = comparisons.filter((comparison) => comparison.target);
  if (!withTarget.length) return "/* Sin mediciones de UI real: no hay CSS que generar. */\n";

  const widths = [...new Set(withTarget.map((comparison) => comparison.viewportWidth))].sort((a, b) => a - b);
  const baseWidth = widths[0];
  const byWidth = new Map();
  for (const comparison of withTarget) {
    if (!byWidth.has(comparison.viewportWidth)) byWidth.set(comparison.viewportWidth, new Map());
    byWidth.get(comparison.viewportWidth).set(comparison.id, comparison.target.median.height);
  }

  const blocks = [];
  let previous = null;
  for (const width of widths) {
    const entries = [...byWidth.get(width).entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([id, height]) => `  --sk-${sanitizeId(id)}-h: ${Math.round(height)}px;`);
    const signature = entries.join("|");
    if (signature === previous) continue;
    previous = signature;
    const body = `:root {\n${entries.join("\n")}\n}`;
    blocks.push(width === baseWidth ? body : `@media (min-width: ${width}px) {\n${body.replace(/^/gm, "  ")}\n}`);
  }

  return `/* Generado por ui-design/scripts/skeleton-audit.mjs */\n${blocks.join("\n\n")}\n`;
}

function buildMarkdown({ baseUrl, engine, results, comparisons, css, generatedAt }) {
  const rows = comparisons.map((comparison) => {
    const target = comparison.target ? `${comparison.target.median.height}px` : "—";
    const skeleton = comparison.skeleton ? `${comparison.skeleton.median.height}px` : "—";
    const delta = comparison.delta.height == null ? "—" : `${comparison.delta.height > 0 ? "+" : ""}${comparison.delta.height}px`;
    return `| ${comparison.page} | ${comparison.id} | ${comparison.viewport} | ${target} | ${skeleton} | ${delta} | ${comparison.status} |`;
  });

  const missing = comparisons.filter((comparison) => comparison.status.startsWith("missing"));
  const mismatches = comparisons.filter((comparison) => comparison.status === "mismatch");

  return `# Skeleton audit

- **Generado:** ${generatedAt}
- **Base URL:** ${baseUrl}
- **Motor:** ${engine}
- **Mediciones:** ${results.length} (páginas × estados × viewports)

## Comparaciones

| Página | Target | Viewport | UI real (alto) | Skeleton (alto) | Δ | Estado |
| --- | --- | --- | ---: | ---: | ---: | --- |
${rows.join("\n") || "| — | — | — | — | — | — | sin datos |"}

## Resumen

- Diferencias: **${mismatches.length}**
- Sin skeleton: **${missing.filter((item) => item.status === "missing-skeleton").length}**
- Sin UI medida: **${missing.filter((item) => item.status === "missing-target" || item.status === "missing-both").length}**

## CSS sugerido

\`\`\`css
${css.trim()}
\`\`\`

## Cómo aplicar

1. Copia las variables a \`globals.css\` (o al CSS del componente).
2. Usa el alto en el skeleton: \`h-[var(--sk-ID-h)]\` (sustituye ID por el id del target).
3. Vuelve a correr el audit hasta que \`Δ\` sea ≤ la tolerancia (2 px por defecto).
4. Verifica que no haya layout shift al llegar el contenido y que se respete \`prefers-reduced-motion\`.

## Estados medidos

${[...new Set(results.map((result) => `${result.page} · ${result.state} · ${result.viewport}`))].map((line) => `- ${line}`).join("\n") || "- Sin resultados"}
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const configCandidates = [
    args.config && resolve(args.config),
    join(process.cwd(), "skeleton-audit.config.json"),
    join(HERE, "skeleton-audit.config.json"),
  ].filter(Boolean);

  const configPath = configCandidates.find((candidate) => existsSync(candidate));
  if (!configPath) {
    console.error(
      "No encontré configuración. Crea skeleton-audit.config.json o pasa --config.\n" +
        "Ejemplo: .opencode/skills/ui-design/scripts/skeleton-audit.config.json",
    );
    process.exit(1);
  }

  const config = JSON.parse(readFileSync(configPath, "utf8"));
  const baseUrl = args.baseUrl || process.env.SKELETON_BASE_URL || config.baseUrl || "http://localhost:3000";
  const outDir = resolve(args.out || config.out || ".skeleton-audit");
  const viewports = config.viewports?.length ? config.viewports : DEFAULT_VIEWPORTS;
  const tolerance = Number(config.tolerance ?? 2);
  const timeout = Number(args.timeout || config.timeout || 30000);
  const pages = (config.pages || []).map((page) => ({
    name: page.name || page.path || "page",
    path: page.path || "/",
    waitFor: page.waitFor,
    targets: page.targets || [],
    compareWidth: Boolean(page.compareWidth ?? config.compareWidth),
    states: page.states?.length ? page.states : [{ name: "loaded" }],
  }));

  if (!pages.length) {
    console.error("El config no define pages.");
    process.exit(1);
  }

  mkdirSync(outDir, { recursive: true });
  if (args.screenshots) mkdirSync(join(outDir, "screenshots"), { recursive: true });

  const launched = await launchBrowser(args.engine, args.headed, args.browser);
  console.log(`Motor: ${launched.engine} · ${pages.length} página(s) × ${viewports.length} viewport(s)`);

  const results = [];
  try {
    for (const viewport of viewports) {
      for (const page of pages) {
        for (const state of page.states) {
          const session = await createSession(launched, viewport, timeout);
          const url = new URL(state.path || page.path, baseUrl).toString();
          const stateName = state.name || "default";
          let data = {};
          let error = null;

          try {
            await addInitScript(session, state.initScript);
            const holds = (state.hold || []).map((hold) =>
              typeof hold === "string" ? { pattern: hold, ms: state.holdMs ?? 1200 } : { pattern: hold.pattern, ms: hold.ms ?? state.holdMs ?? 1200 },
            );
            for (const hold of holds) await addHold(session, hold.pattern, hold.ms);

            const waitUntil = session.kind === "puppeteer" && state.waitUntil === "commit" ? "domcontentloaded" : state.waitUntil || "domcontentloaded";
            await goto(session, url, waitUntil);
            await runBefore(session, state.before);
            await waitFor(session, state.waitFor || page.waitFor, timeout);
            if (state.waitForStable ?? stateName !== "loading") {
              await waitForStableSize(session, page.targets, timeout);
            }
            await sleep(state.settle ?? (stateName === "loading" ? 0 : 500));
            data = await session.page.evaluate(measureInPage, {
              targets: page.targets,
              maxSamples: config.maxSamples ?? 6,
            });
            if (args.screenshots) {
              const file = join(outDir, "screenshots", `${sanitizeId(page.name)}-${sanitizeId(stateName)}-${viewport.name}.png`);
              await session.page.screenshot({ path: file, fullPage: true });
            }
          } catch (caught) {
            error = caught.message;
          } finally {
            if (session.context) await session.context.close();
            else await session.page.close();
          }

          results.push({
            page: page.name,
            state: stateName,
            viewport: viewport.name,
            viewportWidth: viewport.width,
            url,
            error,
            data,
          });
          const status = error ? `error: ${error}` : `${Object.keys(data).length} target(s)`;
          console.log(`  ${page.name} · ${stateName} · ${viewport.name} → ${status}`);
        }
      }
    }
  } finally {
    await launched.browser.close();
  }

  const comparisons = compareResults(results, pages, viewports, tolerance);
  const css = buildCss(comparisons);
  const generatedAt = new Date().toISOString();
  const payload = { generatedAt, baseUrl, engine: launched.engine, viewports, results, comparisons, css };
  writeFileSync(join(outDir, "skeleton-audit.json"), JSON.stringify(payload, null, 2), "utf8");
  writeFileSync(join(outDir, "skeleton-audit.md"), buildMarkdown({ baseUrl, engine: launched.engine, results, comparisons, css, generatedAt }), "utf8");
  writeFileSync(join(outDir, "skeleton-audit.css"), css, "utf8");

  const mismatches = comparisons.filter((comparison) => comparison.status === "mismatch");
  const missing = comparisons.filter((comparison) => comparison.status.startsWith("missing"));
  console.log(`\nReporte: ${join(outDir, "skeleton-audit.md")}`);
  console.log(`CSS:     ${join(outDir, "skeleton-audit.css")}`);
  console.log(`Diferencias: ${mismatches.length} · Faltantes: ${missing.length}`);

  if (args.failOnMismatch && (mismatches.length || missing.length)) process.exit(1);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
