// ABOUTME: Dev-only check of migrate's layout upgrade: compares an old decisions.md or questions.md with the entry
// ABOUTME: folder it became (counts, IDs, the index, and every entry's words as a multiset). Node 24, no dependencies.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { frontmatterOf, markdownWords } from './md-profile-check.ts';

export interface UpgradeFinding { path: string; rule: string; message: string }

export interface UpgradeResult {
  findings: UpgradeFinding[];
  kind: 'D' | 'Q' | null;
  /** Entries headed in the old log. */
  logEntries: number;
  /** Entry files in the folder. */
  folderEntries: number;
  /** Words in the old log before its first entry (its frontmatter values, heading and preamble), which no entry carries. */
  preamble: number;
}

interface OldEntry { id: string; header: string; body: string }
interface Field { key: string; values: string[] }

const ENTRY_HEAD = /^## ([DQ])-(\d+)(?![\w-])(.*)$/;
const ANY_HEAD = /^#{1,2}(?:[ \t]|$)/;
const FENCE = /^ {0,3}(`{3,}|~{3,})/;
const ENTRY_FILE = /^([DQ])-(\d+)\.md$/;
/** A field label line in either form authors write: `**Label**:` or `**Label:**`. */
const LABEL = /^\*\*([^*\n]+?)(?:\*\*:|:\*\*)/;

/** Fields that may restate a body line the entry keeps, so their words may appear twice. */
const RESTATING = new Set(['status', 'resolved_by', 'superseded_by', 'integrated', 'retracted']);

/** A word for this comparison: a token holding at least one letter or digit (separators like `·`, `—`, `✅` don't count). */
const isWord = (t: string): boolean => /[\p{L}\p{N}]/u.test(t);

/** The words of a markdown fragment with markup stripped, the way md-profile-check --words counts them. */
const wordsOf = (src: string): string[] => markdownWords(`${src}\n`).filter(isWord);

/** A non-entry section after the first entry: its heading and the text under it, which no entry carries. */
export interface Stray { heading: string; text: string }

/**
 * Split an old log into its entries. Everything before the first entry (frontmatter, heading, preamble) is the
 * preamble; a non-entry heading after it, with the text under it up to the next entry, is a stray section.
 */
export function parseLog(src: string): { entries: OldEntry[]; preamble: string; strays: Stray[] } {
  const lines = src.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').split('\n');
  const fm = frontmatterOf(lines);
  const preamble: string[] = lines.slice(0, fm.body);
  const strays: Array<{ heading: string; text: string[] }> = [];
  const entries: OldEntry[] = [];
  let cur: { id: string; header: string; body: string[] } | null = null;
  let fence: string | null = null;
  const close = (): void => { if (cur) entries.push({ id: cur.id, header: cur.header, body: cur.body.join('\n') }); cur = null; };
  for (let i = fm.body; i < lines.length; i++) {
    const line = lines[i];
    const f = FENCE.exec(line);
    if (fence) { if (f && f[1][0] === fence[0] && f[1].length >= fence.length) fence = null; }
    else if (f) fence = f[1];
    else {
      const m = ENTRY_HEAD.exec(line);
      if (m) { close(); cur = { id: `${m[1]}-${m[2]}`, header: line.slice(3), body: [] }; continue; }
      if (ANY_HEAD.test(line)) {
        close();
        if (entries.length > 0) { strays.push({ heading: line, text: [] }); continue; }
      }
    }
    if (cur) cur.body.push(line);
    else if (strays.length > 0) strays[strays.length - 1].text.push(line);
    else preamble.push(line);
  }
  close();
  return { entries, preamble: preamble.join('\n'), strays: strays.map((x) => ({ heading: x.heading, text: x.text.join('\n') })) };
}

/** Strip one layer of YAML quoting from a scalar. */
function unquote(v: string): string {
  const s = v.trim();
  if (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) return s.slice(1, -1).replace(/\\(["\\])/g, '$1');
  if (s.length >= 2 && s.startsWith("'") && s.endsWith("'")) return s.slice(1, -1).replace(/''/g, "'");
  return s;
}

/** The frontmatter as fields: scalars, flow lists, block lists and block scalars, each value unquoted. */
export function parseFrontmatter(lines: readonly string[]): Field[] {
  const fields: Field[] = [];
  let cur: Field | null = null;
  let scalar = false;
  for (const line of lines) {
    if (line.trim() === '' || /^\s*#/.test(line)) continue;
    if (scalar && /^[ \t]/.test(line)) { cur?.values.push(line.trim()); continue; }
    scalar = false;
    const item = /^[ \t]+-[ \t]+(.*)$/.exec(line);
    if (item && cur) { cur.values.push(unquote(item[1])); continue; }
    const kv = /^([A-Za-z_][\w.-]*)[ \t]*:(?:[ \t]+(.*))?$/.exec(line);
    if (!kv) continue;
    cur = { key: kv[1], values: [] };
    fields.push(cur);
    const raw = (kv[2] ?? '').replace(/[ \t]+#.*$/, '').trim();
    if (/^[|>][+-]?\d*$/.test(raw)) { scalar = true; continue; }
    if (raw.startsWith('[') && raw.endsWith(']')) {
      for (const part of raw.slice(1, -1).split(',')) if (part.trim() !== '') cur.values.push(unquote(part));
    } else if (raw !== '') cur.values.push(unquote(raw));
  }
  return fields;
}

/** Count of each label's occurrences in a body. */
function labelCounts(body: string): Map<string, number> {
  const m = new Map<string, number>();
  let fence: string | null = null;
  for (const line of body.split('\n')) {
    const f = FENCE.exec(line);
    if (fence) { if (f && f[1][0] === fence[0]) fence = null; continue; }
    if (f) { fence = f[1]; continue; }
    const l = LABEL.exec(line.trimStart());
    if (l) m.set(l[1].trim(), (m.get(l[1].trim()) ?? 0) + 1);
  }
  return m;
}

const bag = (words: readonly string[]): Map<string, number> => {
  const m = new Map<string, number>();
  for (const w of words) m.set(w, (m.get(w) ?? 0) + 1);
  return m;
};
const take = (m: Map<string, number>, w: string): boolean => {
  const n = m.get(w) ?? 0;
  if (n === 0) return false;
  if (n === 1) m.delete(w); else m.set(w, n - 1);
  return true;
};
/** a minus b, as a multiset. */
const minus = (a: Map<string, number>, b: Map<string, number>): Map<string, number> => {
  const out = new Map<string, number>();
  for (const [w, n] of a) { const k = n - (b.get(w) ?? 0); if (k > 0) out.set(w, k); }
  return out;
};
const listOf = (m: Map<string, number>): string[] => [...m].flatMap(([w, n]) => Array<string>(n).fill(w));
/** The text of an entry's first `**<label>**:` field, up to the next field label line (empty when it has none). */
function fieldText(body: string, label: string): string {
  const out: string[] = [];
  let on = false;
  for (const line of body.split('\n')) {
    const l = LABEL.exec(line.trimStart());
    if (l) { if (on) break; if (l[1].trim() === label) { on = true; out.push(line); } continue; }
    if (on) out.push(line);
  }
  return out.join('\n');
}
const show = (ws: readonly string[]): string => (ws.length > 12 ? `${ws.slice(0, 12).join(' ')} … (${ws.length} in all)` : ws.join(' '));
/** Lowercased, with surrounding punctuation and a possessive ’s removed: how a composed title’s word is matched. */
const bare = (w: string): string => w.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '').replace(/['’]s$/u, '');

/** Compare one old entry with its entry file; returns findings messages. */
export function compareEntry(old: OldEntry, kind: 'D' | 'Q', entrySrc: string): string[] {
  const problems: string[] = [];
  const lines = entrySrc.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').split('\n');
  const fm = frontmatterOf(lines);
  if (fm.body === 0) return ['no frontmatter'];
  const fields = parseFrontmatter(lines.slice(1, fm.body - 1));
  const body = lines.slice(fm.body).join('\n');
  const get = (k: string): Field | undefined => fields.find((f) => f.key === k);

  const id = get('id')?.values[0];
  if (id !== old.id) problems.push(`id is ${id ?? 'missing'}, expected ${old.id}`);
  const wantKind = kind === 'D' ? 'decision' : 'question';
  const sk = get('storystormer_kind')?.values[0];
  if (sk !== wantKind) problems.push(`storystormer_kind is ${sk ?? 'missing'}, expected ${wantKind}`);
  if (!get('storystormer_project')?.values[0]) problems.push('storystormer_project is missing');

  // The old entry's words: the header's (its `##` dropped) and the body's.
  const oldBag = bag([...wordsOf(old.header), ...wordsOf(old.body)]);
  // The new entry's words: the body's and every frontmatter value except the storystormer_* fields. Values of fields
  // that may restate a kept body line, and a composed title, are allowances, not words the old entry must hold.
  const oldLabels = labelCounts(old.body);
  const composedTitle = kind === 'Q' && !oldLabels.has('Title');
  const fixed: string[] = [...wordsOf(body)];
  const restated: string[] = [];
  // Every word a restating field holds must come from the old entry: its header (` ✅ RESOLVED` gives `resolved`)
  // or a body line. Matched ignoring case, also inside a longer word (`RESOLVED`, `half-resolved`). The one value
  // the conversion composes is `status: open` for a question that recorded no status at all.
  const oldText = `${old.header}\n${old.body}`.toLowerCase();
  const noStatus = kind === 'Q' && !oldLabels.has('Status') && !/✅|resolved|invalidated/i.test(old.header);
  const invented: string[] = [];
  for (const f of fields) {
    if (f.key.startsWith('storystormer_')) continue;
    const ws = f.values.flatMap((v) => wordsOf(v));
    if (RESTATING.has(f.key)) {
      restated.push(...ws);
      for (const w of ws) {
        const b = bare(w);
        if (b !== '' && !oldText.includes(b) && !(f.key === 'status' && b === 'open' && noStatus)) invented.push(`${f.key}: ${w}`);
      }
    } else if (composedTitle && f.key === 'title') restated.push(...ws);
    else fixed.push(...ws);
  }
  if (invented.length) problems.push(`words added (not in the old entry): ${invented.join(', ')}`);
  const newBag = bag(fixed);

  const added = minus(newBag, oldBag);
  if (added.size) problems.push(`words added: ${show(listOf(added))}`);

  const missing = minus(oldBag, newBag);
  const allowance = bag(restated);
  const lower = new Map<string, number>();
  for (const [w, n] of allowance) lower.set(w.toLowerCase(), (lower.get(w.toLowerCase()) ?? 0) + n);
  // A label whose line moved into the frontmatter leaves its own words behind: those may be missing.
  const newLabels = labelCounts(body);
  const labelWords = bag([...oldLabels].flatMap(([label, n]) => {
    const gone = n - (newLabels.get(label) ?? 0);
    return gone > 0 ? Array<string[]>(gone).fill(wordsOf(`**${label}**:`)).flat() : [];
  }));
  const lost: string[] = [];
  for (const w of listOf(missing)) {
    if (take(allowance, w)) { take(lower, w.toLowerCase()); continue; }
    if (take(lower, w.toLowerCase())) continue;
    if (take(labelWords, w)) continue;
    lost.push(w);
  }
  if (lost.length) problems.push(`words missing: ${show(lost)}`);

  if (composedTitle) {
    const title = get('title')?.values[0] ?? '';
    if (title === '') problems.push('title is missing (the old entry has none, so the upgrade composes one)');
    else {
      const question = fieldText(old.body, 'Question');
      const pool = new Set(wordsOf(question === '' ? old.body : question).map(bare));
      const foreign = wordsOf(title).filter((w) => !pool.has(bare(w)));
      if (foreign.length) problems.push(`composed title uses words the question doesn’t: ${foreign.join(' ')}`);
    }
  }
  return problems;
}

/** IDs the index's table rows name in their first cell. */
export function indexIds(src: string): string[] {
  const ids: string[] = [];
  for (const line of src.split('\n')) {
    if (!/^\s*\|/.test(line)) continue;
    const cell = line.replace(/^\s*\|/, '').split('|')[0] ?? '';
    const m = /\b([DQ]-\d+)\b/.exec(cell);
    if (m) ids.push(m[1]);
  }
  return ids;
}

const num = (id: string): number => Number(id.slice(2));

/** Check an old log against the entry folder it was upgraded into. */
export function checkUpgrade(logPath: string, folder: string): UpgradeResult {
  const findings: UpgradeFinding[] = [];
  const add = (path: string, rule: string, message: string): void => { findings.push({ path, rule, message }); };
  const { entries, preamble, strays } = parseLog(readFileSync(logPath, 'utf8'));
  const kinds = new Set(entries.map((e) => e.id[0] as 'D' | 'Q'));
  // An empty log (a header and no entries) is zero entries: its kind comes from its name or heading, and the folder
  // and index must then be empty too.
  const named = /question/i.test(`${basename(logPath)} ${preamble}`) ? 'Q' : /decision/i.test(`${basename(logPath)} ${preamble}`) ? 'D' : null;
  const kind: 'D' | 'Q' | null = kinds.size === 1 ? [...kinds][0] : kinds.size === 0 ? named : null;
  const result = (folderEntries: number): UpgradeResult => ({ findings, kind, logEntries: entries.length, folderEntries, preamble: wordsOf(preamble).length });
  if (kinds.size > 1) { add(logPath, 'log', 'holds both decision and question entries'); return result(0); }
  for (const s of strays) {
    const n = wordsOf(s.text).length + wordsOf(s.heading.replace(/^#+/, '')).length;
    if (n > 0) add(logPath, 'outside-entry', `${n} word${n === 1 ? '' : 's'} under “${s.heading.trim()}”, after the first entry, in no entry`);
  }

  const seen = new Map<string, number>();
  for (const e of entries) seen.set(e.id, (seen.get(e.id) ?? 0) + 1);
  for (const [id, n] of seen) if (n > 1) add(logPath, 'duplicate-id', `${id} heads ${n} entries; one file can't hold them`);

  const files = readdirSync(folder).filter((n) => ENTRY_FILE.test(n) && statSync(join(folder, n)).isFile());
  if (kind === null) {
    // An empty log whose kind can't be told: every entry file is extra.
    for (const n of files) add(join(folder, n), 'extra-entry', `${n.slice(0, -3)} isn't headed in the log`);
  }
  const byId = new Map(files.map((n) => [n.slice(0, -3), n]));
  if (files.length !== entries.length) add(folder, 'count', `${files.length} entry file${files.length === 1 ? '' : 's'}, but the log heads ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}`);
  for (const n of files) if (kind !== null && n[0] !== kind) add(join(folder, n), 'kind', `a ${n[0] === 'D' ? 'decision' : 'question'} file in a ${kind === 'D' ? 'decision' : 'question'} folder`);
  for (const id of seen.keys()) if (!byId.has(id)) add(folder, 'missing-entry', `${id} has no ${id}.md`);
  for (const id of byId.keys()) if (!seen.has(id)) add(join(folder, `${id}.md`), 'extra-entry', `${id} isn't headed in the log`);

  for (const e of entries) {
    if (kind === null || (seen.get(e.id) ?? 0) > 1) continue;
    const file = byId.get(e.id);
    if (!file) continue;
    for (const p of compareEntry(e, kind as 'D' | 'Q', readFileSync(join(folder, file), 'utf8'))) add(join(folder, file), 'entry', p);
  }

  const indexPath = join(folder, '_index.md');
  if (!existsSync(indexPath)) add(indexPath, 'index', 'missing');
  else {
    const listed = indexIds(readFileSync(indexPath, 'utf8'));
    const counts = bag(listed);
    for (const id of byId.keys()) if (!counts.has(id)) add(indexPath, 'index', `no row for ${id}`);
    for (const [id, n] of counts) {
      if (!byId.has(id)) add(indexPath, 'index', `row for ${id}, which has no entry file`);
      if (n > 1) add(indexPath, 'index', `${n} rows for ${id}`);
    }
    const order = listed.map(num);
    if (order.some((v, k) => k > 0 && v < order[k - 1])) add(indexPath, 'index', 'rows aren’t sorted by ID numerically');
  }
  findings.sort((a, b) => a.path.localeCompare(b.path, 'en', { numeric: true }));
  return result(files.length);
}

const USAGE = `upgrade-check: compare an old-layout log with the entry folder migrate's layout upgrade made from it.

  node tools/upgrade-check.ts <old decisions.md | questions.md> <decisions/ | questions/>

Checks the entry count against the log's ## D-### / ## Q-### headings (an empty log means an empty folder and index), that every ID has its file (and no file is
extra), each entry's id and storystormer_* fields, that each entry keeps every word of its old entry (a multiset,
markup stripped; label words whose line moved into the frontmatter, and words a status, resolved_by, superseded_by,
integrated or retracted restates, are allowed, but every one of them must come from the old entry), that a composed
title uses the question's own words, that no text sits under a non-entry heading after the first entry, and that
_index.md lists every entry once, in order. It reads files only: work on a local copy of the project. Prints path: rule message per finding and a summary; exits 1 on findings.`;

export function main(argv: readonly string[], out: (s: string) => void = (s) => process.stdout.write(`${s}\n`), err: (s: string) => void = (s) => process.stderr.write(`${s}\n`)): number {
  if (argv.includes('--help') || argv.includes('-h')) { out(USAGE); return 0; }
  const bad = argv.find((a) => a.startsWith('-'));
  if (bad) { err(`unknown option ${bad}; see --help`); return 2; }
  if (argv.length !== 2) { err(USAGE); return 2; }
  const [log, folder] = argv;
  let okLog = false;
  let okDir = false;
  try { okLog = statSync(log).isFile(); } catch { okLog = false; }
  try { okDir = statSync(folder).isDirectory(); } catch { okDir = false; }
  if (!okLog) { err(`not a file: ${log}`); return 2; }
  if (!okDir) { err(`not a directory: ${folder}`); return 2; }
  const r = checkUpgrade(log, folder);
  for (const f of r.findings) out(`${f.path}: ${f.rule} ${f.message}`);
  const n = r.findings.length;
  out(`${basename(log)} → ${basename(folder)}/: ${r.logEntries} entries in the log, ${r.folderEntries} files; ${n} finding${n === 1 ? '' : 's'} (${r.preamble} words of preamble, not carried)`);
  return n > 0 ? 1 : 0;
}

if (process.argv[1] !== undefined && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = main(process.argv.slice(2));
}
