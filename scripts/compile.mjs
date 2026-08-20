#!/usr/bin/env node
/**
 * compile.mjs — concatenate checkpoint cards into a single chronological log.
 *
 *   node scripts/compile.mjs <input-dir> [output-file]
 *
 * Reads every *.html in <input-dir> that contains a checkpoint card, sorts by
 * checkpoint ID (part, then task, then sequence), and writes one standalone file.
 *
 * Card content is copied verbatim. This script never rewrites a card's text —
 * that is the whole reason it exists.
 *
 * No dependencies. Node 16+.
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const TEMPLATE = join(HERE, "..", "templates", "compiled_view.html");

const inputDir = process.argv[2];
const outputFile = process.argv[3] || "compiled-checkpoints.html";

if (!inputDir) {
  console.error("Usage: node scripts/compile.mjs <input-dir> [output-file]");
  process.exit(1);
}

/** Extract the first <div class="card"> ... </div> block, with depth matching. */
function extractCard(html) {
  const open = html.indexOf('<div class="card">');
  if (open === -1) return null;
  let depth = 0;
  let i = open;
  while (i < html.length) {
    const nextOpen = html.indexOf("<div", i);
    const nextClose = html.indexOf("</div>", i);
    if (nextClose === -1) return null;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + 4;
    } else {
      depth--;
      if (depth === 0) return html.slice(open, nextClose + 6);
      i = nextClose + 6;
    }
  }
  return null;
}

const ID_RE = /<div class="id">([^<]+)<\/div>/;
const PARSE_RE = /^([A-Za-z0-9]+)-P(\d+)-T(\d+)-C(\d+)$/;

const files = readdirSync(inputDir).filter((f) => f.endsWith(".html"));
const cards = [];

for (const file of files) {
  const html = readFileSync(join(inputDir, file), "utf8");
  // Skip previously compiled logs — otherwise re-running double-counts them.
  if (html.includes('class="cover"')) continue;
  const card = extractCard(html);
  if (!card) continue;
  const idMatch = card.match(ID_RE);
  if (!idMatch) continue;

  const id = idMatch[1].trim();
  const parts = id.match(PARSE_RE);
  if (!parts) {
    console.warn(`  ! ${file}: id "${id}" does not match PREFIX-P#-T#-C# — sorted last`);
  }
  cards.push({
    file,
    id,
    prefix: parts ? parts[1] : "",
    part: parts ? Number(parts[2]) : Infinity,
    task: parts ? Number(parts[3]) : Infinity,
    seq: parts ? Number(parts[4]) : Infinity,
    html: card,
  });
}

if (cards.length === 0) {
  console.error(`No checkpoint cards found in ${resolve(inputDir)}`);
  process.exit(1);
}

cards.sort(
  (a, b) => a.part - b.part || a.task - b.task || a.seq - b.seq || a.id.localeCompare(b.id)
);

// Duplicate check — two cards with the same ID means one silently overwrites the other.
const seen = new Set();
for (const c of cards) {
  if (seen.has(c.id)) console.warn(`  ! duplicate checkpoint id: ${c.id} (${c.file})`);
  seen.add(c.id);
}

const prefixes = [...new Set(cards.map((c) => c.prefix).filter(Boolean))];
if (prefixes.length > 1) {
  console.warn(`  ! mixed prefixes: ${prefixes.join(", ")} — is this one project?`);
}

const partNums = [...new Set(cards.map((c) => c.part).filter((p) => Number.isFinite(p)))].sort(
  (a, b) => a - b
);
const partsCovered =
  partNums.length === 0
    ? "—"
    : partNums.length === 1
      ? `P${partNums[0]}`
      : `P${partNums[0]}\u2013P${partNums[partNums.length - 1]}`;

const body = cards.map((c) => c.html).join('\n\n  <div class="divider"></div>\n\n  ');

/**
 * Escape a replacement value. String.replace treats $&, $1, $` and $' in the
 * replacement as substitution patterns, so card prose containing a dollar sign
 * would be silently rewritten.
 */
const lit = (s) => s.replaceAll("$", "$$$$");

let template = readFileSync(TEMPLATE, "utf8");

// Strip the guide comment, anchored to the pre-<html> preamble. An unanchored
// "first comment" match consumes the CARDS:START marker instead whenever the
// guide comment has already been deleted, as the template tells you to do.
template = template.replace(/(<!DOCTYPE html>\s*)<!--[\s\S]*?-->\s*/i, "$1");

if (!/<!-- CARDS:START[\s\S]*?<!-- CARDS:END -->/.test(template)) {
  console.error(`Template is missing its CARDS:START / CARDS:END markers: ${TEMPLATE}`);
  process.exit(1);
}

const compiled = template
  .replace(/ *<!-- CARDS:START[\s\S]*?<!-- CARDS:END -->/, `  ${lit(body)}`)
  .replaceAll("{{PREFIX}}", lit(prefixes[0] || "CP"))
  .replace("{{COMPILATION_TITLE}}", lit(process.env.CHECKPOINT_TITLE || "Process documentation"))
  .replace("{{TOTAL_COUNT}}", String(cards.length))
  .replace("{{PARTS_COVERED}}", partsCovered)
  .replace("{{COMPILED_DATE}}", new Date().toISOString().slice(0, 10));

// A compiled log that still carries template tokens is broken output. Fail loudly
// rather than writing a file that reports success and contains no cards.
const leftover = [...new Set(compiled.match(/\{\{[A-Z_]+\}\}/g) || [])];
if (leftover.length > 0) {
  console.error(`Refusing to write: unfilled template tokens remain (${leftover.join(", ")})`);
  process.exit(1);
}

writeFileSync(outputFile, compiled);

console.log(`Compiled ${cards.length} checkpoints (${partsCovered}) \u2192 ${outputFile}`);
for (const c of cards) console.log(`  ${c.id}`);
