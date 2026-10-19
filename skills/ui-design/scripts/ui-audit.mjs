#!/usr/bin/env node
/**
 * ui-audit.mjs — Auditoría estática de señales de diseño en JSX/TSX.
 *
 * Uso (desde cualquier carpeta del repo):
 *   node .opencode/skills/ui-design/scripts/ui-audit.mjs
 *   node .opencode/skills/ui-design/scripts/ui-audit.mjs src/components
 *   node .opencode/skills/ui-design/scripts/ui-audit.mjs --json
 *   node .opencode/skills/ui-design/scripts/ui-audit.mjs --strict   # sale 1 si hay hallazgos
 *
 * No reemplaza la revisión visual ni la de accesibilidad real: detecta señales
 * objetivas (hex sueltos, espaciado fuera de escala, divs clickeables, etc.).
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

function findRoot(start) {
  let dir = start;
  for (;;) {
    try {
      if (statSync(join(dir, "package.json")).isFile()) return dir;
    } catch {
      /* sigue subiendo */
    }
    const parent = dirname(dir);
    if (parent === dir) return process.cwd();
    dir = parent;
  }
}

const ROOT = findRoot(HERE);
const argv = process.argv.slice(2);
const JSON_OUT = argv.includes("--json");
const STRICT = argv.includes("--strict");
const targetArg = argv.find((a) => !a.startsWith("--"));
const TARGET = targetArg ? resolve(ROOT, targetArg) : join(ROOT, "src");

const EXTENSIONS = new Set([".tsx", ".jsx", ".ts", ".js"]);
const IGNORE_DIRS = new Set(["node_modules", ".next", ".git", ".opencode", ".claude", "public", "assets-src", "dist", "build"]);

const RULES = {
  "hardcoded-hex": {
    severity: "warn",
    message: "Color hex literal en JSX; usa tokens del tema (bg-card, text-muted-foreground, etc.).",
  },
  "odd-spacing": {
    severity: "warn",
    message: "Espaciado arbitrario fuera de la escala de 4 px; usa la escala (1,2,3,4,6,8,12,16).",
  },
  "tiny-text": {
    severity: "error",
    message: "Texto menor a 12 px; la información necesaria debe ser legible.",
  },
  "transition-all": {
    severity: "warn",
    message: "transition-all anima propiedades costosas; anima solo transform/opacity/color.",
  },
  "interactive-div": {
    severity: "error",
    message: "div/span clickeable sin role ni teclado; usa <button> o agrega role, tabIndex y manejo de teclas.",
  },
  "icon-button-label": {
    severity: "warn",
    message: "Botón solo-icono sin aria-label/title; el nombre accesible es obligatorio.",
  },
  "image-alt": {
    severity: "warn",
    message: "Imagen sin atributo alt (usa alt=\"\" si es decorativa).",
  },
  "outline-none": {
    severity: "warn",
    message: "outline-none sin foco visible alternativo; agrega focus-visible:ring o focus-visible:outline.",
  },
};

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".") && entry.name !== ".") continue;
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && EXTENSIONS.has(extname(entry.name))) out.push(full);
  }
  return out;
}

/** Lee una etiqueta JSX desde "<" respetando strings y llaves (evita cortar en "=>"). */
function readTag(text, start) {
  let i = start;
  let braces = 0;
  let quote = null;
  while (i < text.length) {
    const c = text[i];
    if (quote) {
      if (c === quote && text[i - 1] !== "\\") quote = null;
    } else if (c === '"' || c === "'" || c === "`") {
      quote = c;
    } else if (c === "{") {
      braces++;
    } else if (c === "}") {
      braces = Math.max(0, braces - 1);
    } else if (c === ">" && braces === 0) {
      return { end: i + 1, tag: text.slice(start, i + 1) };
    }
    i++;
  }
  return { end: text.length, tag: text.slice(start) };
}

function lineAt(text, index) {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i++) if (text[i] === "\n") line++;
  return line;
}

function snippet(value, max = 120) {
  const flat = value.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
}

function scanFile(file, findings) {
  const text = readFileSync(file, "utf8");
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  const push = (rule, index, extra) => {
    findings.push({
      rule,
      severity: RULES[rule].severity,
      file: rel,
      line: lineAt(text, index),
      message: RULES[rule].message,
      extra: extra ?? null,
    });
  };

  // 1. Colores hex dentro de clases/estilos.
  const hexRe = /#[0-9a-fA-F]{3,8}\b/g;
  for (let m; (m = hexRe.exec(text)); ) {
    const lineStart = text.lastIndexOf("\n", m.index) + 1;
    const lineEnd = text.indexOf("\n", m.index);
    const line = text.slice(lineStart, lineEnd === -1 ? text.length : lineEnd);
    if (/className|class=|style=|bg-\[|text-\[|border-\[/.test(line)) {
      push("hardcoded-hex", m.index, snippet(line));
    }
  }

  // 2. Espaciado arbitrario no múltiplo de 4.
  const spacingRe =
    /(?<![\w-])(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y)-\[(\d+(?:\.\d+)?)px\]/g;
  for (let m; (m = spacingRe.exec(text)); ) {
    const value = Number(m[1]);
    if (Number.isFinite(value) && value % 4 !== 0) push("odd-spacing", m.index, m[0]);
  }

  // 3. Texto menor a 12 px.
  const tinyRe = /(?<![\w-])text-\[(\d+(?:\.\d+)?)px\]/g;
  for (let m; (m = tinyRe.exec(text)); ) {
    if (Number(m[1]) < 12) push("tiny-text", m.index, m[0]);
  }

  // 4. transition-all.
  const transitionRe = /\btransition-all\b/g;
  for (let m; (m = transitionRe.exec(text)); ) {
    push("transition-all", m.index, snippet(m[0]));
  }

  // 5-8. Etiquetas JSX.
  const tagRe = /<(div|span|Button|Image|img|a|button)\b/g;
  for (let m; (m = tagRe.exec(text)); ) {
    const name = m[1];
    const { tag } = readTag(text, m.index);
    const tagIndex = m.index;

    if ((name === "div" || name === "span") && /\bonClick\b/.test(tag)) {
      if (!/\brole=/.test(tag) && !/\btabIndex=/.test(tag)) {
        push("interactive-div", tagIndex, snippet(tag));
      }
    }

    if (name === "Button" && /\bsize="icon/.test(tag)) {
      if (!/\baria-label=|\baria-labelledby=|\btitle=/.test(tag)) {
        push("icon-button-label", tagIndex, snippet(tag));
      }
    }

    if (name === "Image" || name === "img") {
      if (!/\balt=/.test(tag)) push("image-alt", tagIndex, snippet(tag));
    }

    if (/\boutline-none\b/.test(tag) && !/focus-visible:|focus:/.test(tag)) {
      push("outline-none", tagIndex, snippet(tag));
    }
  }
}

const files = [];
if (statSync(TARGET, { throwIfNoEntry: false })?.isDirectory()) walk(TARGET, files);
else if (statSync(TARGET, { throwIfNoEntry: false })?.isFile()) files.push(TARGET);

const findings = [];
for (const file of files) {
  try {
    scanFile(file, findings);
  } catch (error) {
    findings.push({
      rule: "read-error",
      severity: "info",
      file: relative(ROOT, file).replace(/\\/g, "/"),
      line: 0,
      message: `No se pudo leer: ${error.message}`,
      extra: null,
    });
  }
}

// Deduplica hallazgos idénticos (varios hex en la misma línea producen el mismo aviso).
const seen = new Set();
const unique = findings.filter((f) => {
  const key = `${f.rule}|${f.file}|${f.line}|${f.extra ?? ""}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});
findings.length = 0;
findings.push(...unique);

const order = { error: 0, warn: 1, info: 2 };
findings.sort((a, b) => order[a.severity] - order[b.severity] || a.file.localeCompare(b.file) || a.line - b.line);

const counts = findings.reduce(
  (acc, f) => {
    acc[f.severity]++;
    acc.byRule[f.rule] = (acc.byRule[f.rule] || 0) + 1;
    return acc;
  },
  { error: 0, warn: 0, info: 0, byRule: {} },
);

if (JSON_OUT) {
  console.log(JSON.stringify({ root: ROOT, target: relative(ROOT, TARGET) || ".", files: files.length, counts, findings }, null, 2));
} else {
  const icon = { error: "✖", warn: "⚠", info: "·" };
  console.log(`\nUI audit · ${files.length} archivo${files.length === 1 ? "" : "s"} en ${relative(ROOT, TARGET) || "."}`);
  console.log("─".repeat(64));
  if (findings.length === 0) {
    console.log("Sin hallazgos automáticos. Falta la revisión visual y de teclado.\n");
  } else {
    console.log(`${counts.error} error${counts.error === 1 ? "" : "es"} · ${counts.warn} advertencia${counts.warn === 1 ? "" : "s"} · ${findings.length} hallazgo${findings.length === 1 ? "" : "s"}\n`);

    const byRule = new Map();
    for (const f of findings) {
      if (!byRule.has(f.rule)) byRule.set(f.rule, []);
      byRule.get(f.rule).push(f);
    }
    const rules = [...byRule.entries()].sort((a, b) => {
      const sev = order[(RULES[a[0]] ?? { severity: "info" }).severity] - order[(RULES[b[0]] ?? { severity: "info" }).severity];
      return sev || b[1].length - a[1].length;
    });

    const MAX_PER_RULE = 12;
    for (const [rule, list] of rules) {
      const meta = RULES[rule] ?? { severity: "info", message: "" };
      console.log(`${icon[meta.severity]} ${rule} · ${list.length}`);
      if (meta.message) console.log(`  ${meta.message}`);
      for (const f of list.slice(0, MAX_PER_RULE)) {
        const extra = f.extra ? `  ${snippet(f.extra, 96)}` : "";
        console.log(`  ${f.file}:${f.line}${extra}`);
      }
      if (list.length > MAX_PER_RULE) console.log(`  … y ${list.length - MAX_PER_RULE} más (usa --json para ver todos)`);
      console.log();
    }
    console.log("Reglas: ver .opencode/skills/ui-design/references/06-review-checklist.md");
    console.log("Esto es una heurística: confirma cada hallazgo antes de corregir.\n");
  }
}

if (STRICT && findings.some((f) => f.severity !== "info")) process.exit(1);
