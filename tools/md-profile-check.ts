// ABOUTME: Dev-only checker for references/markdown-profile.md: lints .md files against the profile's rules,
// ABOUTME: or (--words) compares the word sequences of two trees with markup stripped. Node 24, no dependencies.

import { lstatSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface Finding {
  line: number;
  rule: string;
  message: string;
}

/** Every rule id, with the profile section or rewrite-table row that explains it. */
export const RULES: Readonly<Record<string, string>> = {
  'encoding': '§ Document: UTF-8',
  'frontmatter-unclosed': '§ Scope: What the profile covers (the body is everything after the frontmatter)',
  'line-ending': '§ Rewrite table: CRLF line endings',
  'final-newline': '§ Document: exactly one newline at the end',
  'trailing-whitespace': '§ Rewrite table: spaces or tabs at the end of a line',
  'whitespace-only-line': '§ Rewrite table: a whitespace-only line',
  'blank-lines': '§ Rewrite table: two or more empty lines between blocks',
  'block-separation': '§ Rewrite table: a heading, table, quote or paragraph run into the block above or below it',
  'leading-whitespace': '§ Rewrite table: spaces at the start of a paragraph line',
  'indented-code': '§ Rewrite table: an indented code block',
  'heading-depth': '§ Rewrite table: #####, ######',
  'heading-closing': '§ Rewrite table: a heading’s closing sequence',
  'heading-setext': '§ Rewrite table: an underlined heading',
  'heading-form': '§ Blocks: Heading (one to four #, one space, inline text)',
  'list-marker': '§ Rewrite table: * or + bullets, padded markers, 1)',
  'todo-case': '§ Rewrite table: - [X]',
  'list-indent': '§ Rewrite table: nesting with tabs, or not at the parent’s marker width',
  'list-under-text': '§ Rewrite table: a list indented under a non-list line',
  'list-numbering': '§ Rewrite table: ordered numbers that don’t go up by one',
  'list-loose': '§ Rewrite table: empty lines between list items',
  'list-continuation': '§ Rewrite table: a second paragraph or an indented continuation line in a list item',
  'list-fence-gap': '§ Rewrite table: an empty line between an item and a fenced code block inside it',
  'list-empty-item': '§ Rewrite table: an empty list item',
  'list-item-block': '§ Kept as written (no in-profile form): a quote, table or heading inside a list item',
  'quote-marker': '§ Rewrite table: a quote line without > (lazy continuation), or > with no space',
  'quote-content': '§ Blocks: Quote (no list, heading, fenced code block, nested quote or callout marker)',
  'table-form': '§ Rewrite table: any other pipe-table spelling',
  'fence-form': '§ Blocks: Fenced code block; § Rewrite table: a tilde fence',
  'fence-language': '§ Rewrite table: a fence language of text, txt or plain text; js, sh, python, md',
  'rule-form': '§ Rewrite table: ------, ***, ___, * * * *, - - -, _ _ _ as a rule',
  'emphasis-underscore': '§ Rewrite table: _x_ · __x__ · ___x___',
  'emphasis-nested': '§ Rewrite table: emphasis nested inside emphasis, or sharing a delimiter with it',
  'emphasis-strike-order': '§ Rewrite table: *~~x~~* and **~~x~~**',
  'emphasis-code': '§ Rewrite table: emphasis around a code span and other text',
  'emphasis-link': '§ Rewrite table: emphasis around a link or part of one',
  'emphasis-adjacent': '§ Inline: two emphasis spans never touch',
  'literal-star': '§ Inline: Characters (a literal * has a space on both sides, or is the only * in its paragraph)',
  'code-span-padding': '§ Rewrite table: a code span padded with spaces it doesn’t need',
  'link-title': '§ Rewrite table: a link title',
  'link-reference': '§ Rewrite table: a reference-style link',
  'link-target': '§ Inline: Link (target); § Rewrite table: a link target that is a bare filename',
  'image-target': '§ Rewrite table: an image with a relative target',
  'bare-url': '§ Rewrite table: a bare URL or <url>',
  'bare-email': '§ Rewrite table: a bare email address',
  'footnote': '§ Rewrite table: a footnote',
  'bare-path': '§ Inline: Paths and filenames (in code spans)',
  'obsidian-syntax': '§ Kept as written: Obsidian syntax',
  'nbsp': '§ Inline: Characters (never a non-breaking space)',
  'html-entity': '§ Inline: Characters (never an HTML entity)',
  'backslash-escape': '§ Inline: Characters (no backslash escape, apart from \\| in a table cell)',
  'html': '§ Inline: Characters (no HTML tag or comment, apart from <br> in a table cell)',
  'line-break': '§ Rewrite table: a line break written as a trailing \\ or <br> outside a table cell',
};

// ---------------------------------------------------------------------------
// Shared character classes and patterns

const ASCII_PUNCT = /[!-/:-@[-`{-~]/;
const UNI_PUNCT = /[\p{P}\p{S}]/u;
const isWs = (c: string | undefined): boolean => c === undefined || /\s/u.test(c);
const isPunct = (c: string | undefined): boolean => c !== undefined && UNI_PUNCT.test(c);

/** Named entities the linter recognizes (and --words decodes). Numeric entities are always recognized. */
const ENTITIES: Readonly<Record<string, string>> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ensp: ' ', emsp: ' ',
  thinsp: ' ', zwj: '‍', zwnj: '‌', shy: '­', mdash: '—', ndash: '–', hellip: '…',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', laquo: '«', raquo: '»', bull: '•', middot: '·',
  copy: '©', reg: '®', trade: '™', deg: '°', sect: '§', para: '¶', times: '×', divide: '÷',
  minus: '−', plusmn: '±', frac12: '½', frac14: '¼', frac34: '¾', euro: '€', pound: '£', yen: '¥',
  cent: '¢', curren: '¤', dagger: '†', Dagger: '‡', prime: '′', Prime: '″', larr: '←', rarr: '→',
  uarr: '↑', darr: '↓', harr: '↔', lArr: '⇐', rArr: '⇒', iexcl: '¡', iquest: '¿', not: '¬',
  micro: 'µ', ordf: 'ª', ordm: 'º', sup1: '¹', sup2: '²', sup3: '³', szlig: 'ß', eacute: 'é',
  egrave: 'è', ecirc: 'ê', aacute: 'á', agrave: 'à', acirc: 'â', auml: 'ä', aring: 'å', ccedil: 'ç',
  iacute: 'í', iuml: 'ï', ntilde: 'ñ', oacute: 'ó', ouml: 'ö', oslash: 'ø', uacute: 'ú', uuml: 'ü',
  vert: '|', verbar: '|', ast: '*', num: '#', dollar: '$', percnt: '%', lpar: '(', rpar: ')',
  lsqb: '[', rsqb: ']', lowbar: '_', grave: '`', excl: '!', quest: '?', commat: '@', colon: ':',
  semi: ';', comma: ',', period: '.', sol: '/', bsol: '\\', equals: '=', plus: '+', hyphen: '‐',
};
const ENTITY_RE = /&(?:#[0-9]{1,7}|#[xX][0-9a-fA-F]{1,6}|[A-Za-z][A-Za-z0-9]{1,31});/y;
const ENTITY_ALL = /&(?:#[0-9]{1,7}|#[xX][0-9a-fA-F]{1,6}|[A-Za-z][A-Za-z0-9]{1,31});/g;

function entityChar(e: string): string | undefined {
  if (e.startsWith('&#x') || e.startsWith('&#X')) return safeCodePoint(parseInt(e.slice(3, -1), 16));
  if (e.startsWith('&#')) return safeCodePoint(parseInt(e.slice(2, -1), 10));
  return ENTITIES[e.slice(1, -1)];
}
function safeCodePoint(n: number): string | undefined {
  return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : undefined;
}

const FENCE_OPEN = /^([ \t]*)(`{3,}|~{3,})(.*)$/;
interface FenceInfo { indent: number; ch: string; len: number; info: string }
/** A fence opener indented at most `maxIndent` (CommonMark reads 4+ at the margin as an indented code block). */
function fenceOpen(line: string, maxIndent = 3): FenceInfo | null {
  const m = FENCE_OPEN.exec(line);
  if (!m || leadWidth(m[1]) > maxIndent) return null;
  if (m[2][0] === '`' && m[3].includes('`')) return null;
  return { indent: m[1].length, ch: m[2][0], len: m[2].length, info: m[3] };
}
function fenceCloses(line: string, f: FenceInfo): boolean {
  const m = /^[ \t]*(`+|~+)[ \t]*$/.exec(line);
  return m !== null && m[1][0] === f.ch && m[1].length >= f.len;
}

const THEMATIC = /^ {0,3}([-*_])(?:[ \t]*\1){2,}[ \t]*$/;
const SETEXT = /^ {0,3}(?:=+|-+)[ \t]*$/;
const ITEM = /^([ \t]*)([-*+]|\d{1,9}[.)])(?=[ \t]|$)/;
const ITEM_PARTS = /^([ \t]*)([-*+]|\d{1,9}[.)])([ \t]*)(.*)$/;
const GFM_SEP = /^ {0,3}\|?[ \t]*:?-+:?[ \t]*(?:\|[ \t]*:?-+:?[ \t]*)*\|?[ \t]*$/;
// A CommonMark link reference definition: a label, a destination, an optional title, and nothing else.
const REFDEF = /^ {0,3}\[([^\]^\n][^\]\n]*)\]:[ \t]*(?:<[^>\n]*>|[^\s<>]+)(?:[ \t]+(?:"[^"\n]*"|'[^'\n]*'|\([^)\n]*\)))?[ \t]*$/;
const FIELD_LABEL = /^\*\*[^*\n]+\*\*:/;
const FOOTDEF = /^ {0,3}\[\^[^\]]+\]:/;

type Kind = 'fence' | 'heading' | 'rule' | 'quote' | 'item' | 'table' | 'footdef' | 'refdef' | 'para';
function classify(line: string): Kind {
  if (fenceOpen(line)) return 'fence';
  if (/^ {0,3}#{1,6}(?:[ \t]|$)/.test(line)) return 'heading';
  if (THEMATIC.test(line)) return 'rule';
  if (/^ {0,3}>/.test(line)) return 'quote';
  if (ITEM.test(line)) return 'item';
  if (/^ {0,3}\|/.test(line)) return 'table';
  if (FOOTDEF.test(line)) return 'footdef';
  if (REFDEF.test(line)) return 'refdef';
  return 'para';
}

/** List family: a new list starts when the bullet character or the ordered delimiter changes. */
const family = (marker: string): string => (/\d/.test(marker) ? `o${marker[marker.length - 1]}` : `b${marker}`);

/** Can this item start a list directly under a paragraph line? CommonMark: not empty, and an ordered one starts at 1. */
function canInterrupt(marker: string, rest: string): boolean {
  return rest.trim() !== '' && (!/\d/.test(marker) || parseInt(marker, 10) === 1);
}

const FM_KEY = /^(?:[A-Za-z_][\w.-]*|"[^"\n]*"|'[^'\n]*')[ \t]*:(?:[ \t]|$)/;
export interface Frontmatter { body: number; issue?: { line: number; message: string } }
/**
 * Where the body starts. A first line of `---` opens frontmatter only when YAML follows it directly (a `key:`
 * line, a comment, or an immediate close); otherwise it is a rule. A close with trailing whitespace, or none, is an issue.
 */
export function frontmatterOf(L: readonly string[]): Frontmatter {
  if (L[0] !== '---') return { body: 0 };
  const next = L[1];
  if (next === undefined || (next !== '---' && !FM_KEY.test(next) && !next.startsWith('#'))) return { body: 0 };
  for (let j = 1; j < L.length; j++) {
    if (L[j] === '---') return { body: j + 1 };
    if (L[j].trimEnd() === '---') return { body: j + 1, issue: { line: j + 1, message: 'the frontmatter’s closing --- has trailing whitespace' } };
  }
  return { body: L.length, issue: { line: 1, message: 'frontmatter never closes: no closing --- line, so nothing after it was linted' } };
}

/** Leading indentation width, with tabs to the next multiple of four. */
function leadWidth(line: string): number {
  let w = 0;
  for (const c of line) {
    if (c === ' ') w++;
    else if (c === '\t') w += 4 - (w % 4);
    else break;
  }
  return w;
}

function matchAt(re: RegExp, s: string, i: number): RegExpExecArray | null {
  re.lastIndex = i;
  return re.exec(s);
}

const normLabel = (s: string): string => s.trim().replace(/\s+/g, ' ').toLowerCase();

// ---------------------------------------------------------------------------
// Inline tree

type NodeKind = 'text' | 'delim' | 'code' | 'emph' | 'link' | 'url' | 'email' | 'path' | 'html';
interface INode {
  k: NodeKind;
  pos: number;
  s: string;
  ch: string;
  count: number;
  orig: number;
  canOpen: boolean;
  canClose: boolean;
  strong: boolean;
  image: boolean;
  children: INode[];
}
function mk(k: NodeKind, pos: number, s = ''): INode {
  return { k, pos, s, ch: '', count: 0, orig: 0, canOpen: false, canClose: false, strong: false, image: false, children: [] };
}

/** CommonMark's "process emphasis" over one sequence of inline nodes, with GFM `~~` strikethrough. */
function processEmphasis(arr: INode[]): void {
  let ci = 0;
  while (ci < arr.length) {
    const c = arr[ci];
    if (c.k !== 'delim' || !c.canClose || c.count === 0) { ci++; continue; }
    let found = -1;
    for (let oi = ci - 1; oi >= 0; oi--) {
      const o = arr[oi];
      if (o.k !== 'delim' || o.ch !== c.ch || !o.canOpen || o.count === 0) continue;
      if (c.ch !== '~' && (o.canClose || c.canOpen) && (o.orig + c.orig) % 3 === 0 && !(o.orig % 3 === 0 && c.orig % 3 === 0)) continue;
      found = oi;
      break;
    }
    if (found < 0) { ci++; continue; }
    const o = arr[found];
    const use = c.ch === '~' ? 2 : o.count >= 2 && c.count >= 2 ? 2 : 1;
    o.count -= use;
    c.count -= use;
    const emph = mk('emph', o.pos + o.count);
    emph.ch = c.ch;
    emph.strong = use === 2;
    emph.children = arr.slice(found + 1, ci);
    c.pos += use;
    const repl: INode[] = [];
    if (o.count > 0) repl.push(o);
    repl.push(emph);
    if (c.count > 0) repl.push(c);
    arr.splice(found, ci - found + 1, ...repl);
    ci = found + repl.length - (c.count > 0 ? 1 : 0);
  }
}

interface LinkTail { end: number; dest: string; title: string | undefined; angle: boolean }
function parseLinkTail(T: string, p: number): LinkTail | null {
  if (T[p] !== '(') return null;
  let q = p + 1;
  const skip = (): void => { while (q < T.length && /[ \t\n]/.test(T[q])) q++; };
  skip();
  let dest = '';
  let angle = false;
  if (T[q] === '<') {
    const close = T.indexOf('>', q);
    if (close < 0 || T.slice(q, close).includes('\n')) return null;
    dest = T.slice(q + 1, close);
    angle = true;
    q = close + 1;
  } else {
    const st = q;
    let depth = 0;
    while (q < T.length) {
      const c = T[q];
      if (c === '\\' && ASCII_PUNCT.test(T[q + 1] ?? '')) { q += 2; continue; }
      if (/\s/.test(c)) break;
      if (c === '(') depth++;
      else if (c === ')') { if (depth === 0) break; depth--; }
      q++;
    }
    dest = T.slice(st, q);
  }
  const beforeTitle = q;
  skip();
  let title: string | undefined;
  const open = T[q];
  if ((open === '"' || open === "'" || open === '(') && q > beforeTitle) {
    const close = open === '(' ? ')' : open;
    let r = q + 1;
    while (r < T.length && T[r] !== close) { if (T[r] === '\\') r++; r++; }
    if (r >= T.length) return null;
    title = T.slice(q + 1, r);
    q = r + 1;
    skip();
  }
  if (T[q] !== ')') return null;
  return { end: q + 1, dest, title, angle };
}

function findTicks(T: string, from: number, n: number): number {
  let i = from;
  while (i < T.length) {
    if (T[i] !== '`') { i++; continue; }
    let m = 1;
    while (T[i + m] === '`') m++;
    if (m === n) return i;
    i += m;
  }
  return -1;
}

function trimUrl(u: string): string {
  let s = u;
  for (;;) {
    const last = s[s.length - 1];
    if (/[.,:;!?*_~'"’”]/.test(last)) { s = s.slice(0, -1); continue; }
    if (last === ')' && (s.match(/\(/g) ?? []).length < (s.match(/\)/g) ?? []).length) { s = s.slice(0, -1); continue; }
    return s;
  }
}

const AUTOLINK_URI = /<[A-Za-z][A-Za-z0-9.+-]{1,31}:[^\s<>]*>/y;
const AUTOLINK_EMAIL = /<[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*>/y;
const BR_TAG = /<br\s*\/?>/iy;
const HTML_COMMENT = /<!--[\s\S]*?-->/y;
const HTML_TAG = /<\/?[A-Za-z][A-Za-z0-9-]*(?:\s[^<>]*)?\/?>/y;
const BARE_URL = /(?:https?:\/\/|mailto:)[^\s<>[\]]+/iy;
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}(?![A-Za-z0-9-])/y;
const EMAIL_CH = /[A-Za-z0-9._%+-]/;
const PATH = /(?:\.{1,2}\/)*(?:[A-Za-z0-9_][A-Za-z0-9_.-]*\/)*[A-Za-z0-9_][A-Za-z0-9_.-]*\.[A-Za-z0-9]{1,8}(?![A-Za-z0-9_/-])/y;
const PATH_START = /[A-Za-z0-9_.]/;
const PATH_PREV = /[A-Za-z0-9_./@-]/;
const FILE_EXTS = new Set(['md', 'markdown', 'docx', 'doc', 'txt', 'json', 'yaml', 'yml', 'csv', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'svg']);
const WIKILINK = /!?\[\[[^\]\n]+\]\]/y;
const HIGHLIGHT = /==[^=\s](?:[^=\n]*[^=\s])?==/y;
const OBS_COMMENT = /%%[\s\S]*?%%/y;
const FOOTNOTE_REF = /\[\^[^\]\s]+\]/y;

/**
 * Heuristic: is this token a path or filename the profile wants in a code span? A model call could judge
 * "is this a path?" better; a linter needs determinism, so it takes the narrow reading: a token holding a
 * `/` and ending in a letter extension, or a bare filename with a common document or data extension.
 */
function isPathLike(s: string): boolean {
  const ext = /\.([A-Za-z0-9]{1,8})$/.exec(s);
  if (!ext) return false;
  if (s.includes('/')) return /^[A-Za-z]/.test(ext[1]);
  return FILE_EXTS.has(ext[1].toLowerCase());
}

const TOKEN_CH = /[^\s,\\\u0000[\]\p{S}]/u;
const TOKEN_TRAIL = /[.,;:!?)\]}"'”’*_~]/;
/**
 * A bare path or filename token starting at i (markdown-profile.md § Kept as written: the emphasis, underscore,
 * link and URL rows don't apply inside one; the entity row still does, since Notion decodes entities anyway):
 * the run of characters up to whitespace, a comma, a backslash, [, ] or any symbol (`<`, `>`, `|`, a backtick,
 * `~`, `→`, …), less trailing sentence punctuation, closing brackets, quotes and emphasis markers, when isPathLike
 * accepts it and it holds no `://` (`The_Good_Dog_-_Brainstorming_&amp;_Future.md` is one token; `a.md,b.md` and
 * `x.md→y.md` are two). Leading `_`s that trimmed trailing `_`s close are emphasis, not part of the name
 * (`_notes.md_`). Falls back to the narrow PATH match. Lint's bare-path nodes and --words' verbatim spans both come
 * from it (protectPaths skips what lint consumes first: tags, autolinks, wikilinks, entities, link targets).
 */
function bareToken(T: string, i: number): { start: number; end: number } | null {
  if (!PATH_START.test(T[i] ?? '') || PATH_PREV.test(T[i - 1] ?? '')) return null;
  let e = i;
  while (e < T.length && TOKEN_CH.test(T[e])) e++;
  let end = e;
  while (end > i && TOKEN_TRAIL.test(T[end - 1])) end--;
  let start = i;
  let closing = (/_+/.exec(T.slice(end, e))?.[0] ?? '').length;
  while (closing > 0 && T[start] === '_') { start++; closing--; }
  const tok = T.slice(start, end);
  if (start < end && !tok.includes('://') && isPathLike(tok)) return { start, end };
  const m = matchAt(PATH, T, i);
  return m && isPathLike(m[0]) ? { start: i, end: i + m[0].length } : null;
}

// ---------------------------------------------------------------------------
// Lint

type Emit = (line: number, rule: string, message: string) => void;
interface Line { i: number; text: string }

const RENAMED: Readonly<Record<string, string>> = { js: 'javascript', sh: 'bash', python: 'py', md: 'markdown' };

/** Lint a file's bytes: checks UTF-8, then everything lintText checks. */
export function lintBuffer(buf: Uint8Array, only?: ReadonlySet<string>): Finding[] {
  const pre: Finding[] = [];
  let text: string;
  try {
    text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(buf);
  } catch {
    text = new TextDecoder('utf-8', { ignoreBOM: true }).decode(buf);
    const at = text.indexOf('�');
    if (!only || only.has('encoding')) pre.push({ line: text.slice(0, Math.max(at, 0)).split('\n').length, rule: 'encoding', message: 'not valid UTF-8' });
  }
  return [...pre, ...lintText(text, only)].sort((a, b) => a.line - b.line);
}

/** Lint markdown text against the profile. `only` limits the run to those rule ids. */
export function lintText(src: string, only?: ReadonlySet<string>): Finding[] {
  const findings: Finding[] = [];
  const emit: Emit = (line, rule, message) => {
    if (!only || only.has(rule)) findings.push({ line, rule, message });
  };
  const done = (): Finding[] => findings.sort((a, b) => a.line - b.line);
  let text = src;
  if (text.startsWith('﻿')) {
    emit(1, 'encoding', 'byte-order mark at the start of the file');
    text = text.slice(1);
  }
  const cr = text.search(/\r/);
  if (cr >= 0) {
    const count = (text.match(/\r\n?/g) ?? []).length;
    emit(text.slice(0, cr).split('\n').length, 'line-ending', `${count} line ending${count === 1 ? ' is' : 's are'} CR or CRLF; use \\n`);
    text = text.replace(/\r\n?/g, '\n');
  }
  if (text === '') {
    emit(1, 'final-newline', 'an empty file; a document ends with exactly one newline');
    return done();
  }
  const L = text.split('\n');
  if (!text.endsWith('\n')) {
    emit(L.length, 'final-newline', 'no newline at the end of the file');
  } else {
    L.pop();
    let extra = 0;
    while (L.length > 0 && L[L.length - 1] === '') { L.pop(); extra++; }
    if (L.length === 0) {
      emit(1, 'final-newline', 'the file holds only empty lines');
      return done();
    }
    if (extra > 0) emit(L.length + 1, 'final-newline', 'empty lines after the last block; end with exactly one newline');
  }
  const N = L.length;
  const ln = (i: number): number => i + 1;

  // Frontmatter: skipped entirely; a malformed boundary is one finding, not body noise.
  const fm = frontmatterOf(L);
  if (fm.issue) emit(fm.issue.line, 'frontmatter-unclosed', fm.issue.message);
  const start = fm.body;
  if (start >= N) return done();

  // Reference definitions, for shortcut and full reference links.
  const defs = new Set<string>();
  for (let j = start, fence: FenceInfo | null = null; j < N; j++) {
    if (fence) { if (fenceCloses(L[j], fence)) fence = null; continue; }
    fence = fenceOpen(L[j]);
    if (fence) continue;
    const d = REFDEF.exec(L[j]);
    if (d) defs.add(normLabel(d[1]));
  }
  // Fenced code contents, marked as blocks are parsed, so the whitespace rules skip them.
  const fenceContent: boolean[] = new Array<boolean>(N).fill(false);

  // ---- inline -------------------------------------------------------------
  const lintInline = (unit: Line[], inCell: boolean): void => {
    if (unit.length === 0) return;
    const T = unit.map((u) => u.text).join('\n');
    const starts: number[] = [];
    let acc = 0;
    for (const u of unit) { starts.push(acc); acc += u.text.length + 1; }
    const lineAt = (p: number): number => {
      let k = 0;
      while (k + 1 < starts.length && starts[k + 1] <= p) k++;
      return unit[k].i + 1;
    };
    const at = (p: number, rule: string, msg: string): void => emit(lineAt(p), rule, msg);
    const codeRanges: Array<[number, number]> = [];
    const htmlTags = new Map<number, string[]>();
    const nodes: INode[] = [];
    const brackets: Array<{ idx: number; image: boolean; active: boolean; pos: number }> = [];
    let buf = '';
    let bufPos = 0;
    const flush = (): void => { if (buf) { nodes.push(mk('text', bufPos, buf)); buf = ''; } };
    const add = (s: string, p: number): void => { if (!buf) bufPos = p; buf += s; };
    const push = (n: INode): void => { flush(); nodes.push(n); };

    const checkCode = (raw: string, n: number, pos: number): void => {
      const r = raw.replace(/\n/g, ' ');
      let content = r;
      let padded = false;
      if (!/^ +$/.test(r) && r.length >= 2 && r.startsWith(' ') && r.endsWith(' ')) { content = r.slice(1, -1); padded = true; }
      const needPad = content.startsWith('`') || content.endsWith('`');
      if (padded && !needPad) at(pos, 'code-span-padding', 'code span padded with spaces it doesn’t need');
      const maxRun = Math.max(0, ...(content.match(/`+/g) ?? []).map((x) => x.length));
      if (n !== maxRun + 1) at(pos, 'code-span-padding', `code span delimited by ${n} backticks; ${maxRun + 1} is the profile’s form`);
    };

    const checkLink = (tail: LinkTail, image: boolean, pos: number): void => {
      if (tail.title !== undefined) at(pos, 'link-title', 'a link title; the profile’s link has none');
      const d = tail.dest;
      if (image) {
        if (!/^https?:\/\//i.test(d)) at(pos, 'image-target', `image target “${d}” isn’t an absolute URL (Notion drops it); make it a link`);
        return;
      }
      if (tail.angle) at(pos, 'link-target', 'angle-bracket link target; write the target bare');
      if (d === '') at(pos, 'link-target', 'empty link target');
      else if (/^https?:\/\//i.test(d) || /^mailto:/i.test(d) || d.startsWith('#')) return;
      else if (/^[A-Za-z][A-Za-z0-9+.-]*:/.test(d)) at(pos, 'link-target', `link target “${d}”: the profile allows only https://, http:// and mailto: schemes`);
      else if (d.startsWith('/')) at(pos, 'link-target', `link target “${d}” is an absolute path; write a relative path (./… or ../…)`);
      else if (!d.includes('/')) at(pos, 'link-target', `link target “${d}” has no / (Notion reads it as a domain); write ./${d}`);
    };

    let i = 0;
    let pendingPath: { start: number; end: number } | null = null;
    while (i < T.length) {
      const c = T[i];
      let m: RegExpExecArray | null;
      if (pendingPath && i > pendingPath.start) pendingPath = null;
      if (c === '\\') {
        const nx = T[i + 1];
        if (nx === '\n') { at(i, 'line-break', 'a line break written as a trailing backslash; use a bare newline'); add(c, i); i++; continue; }
        if (nx !== undefined && ASCII_PUNCT.test(nx)) {
          if (!(inCell && nx === '|')) at(i, 'backslash-escape', `backslash escape \\${nx}`);
          add(nx, i);
          i += 2;
          continue;
        }
        add(c, i); i++; continue;
      }
      if (c === '`') {
        let n = 1;
        while (T[i + n] === '`') n++;
        const close = findTicks(T, i + n, n);
        if (close >= 0) {
          const code = mk('code', i, T.slice(i + n, close));
          code.count = n;
          push(code);
          codeRanges.push([i, close + n]);
          checkCode(code.s, n, i);
          i = close + n;
          continue;
        }
        add('`'.repeat(n), i); i += n; continue;
      }
      if (c === '<') {
        if ((m = matchAt(AUTOLINK_URI, T, i))) { at(i, 'bare-url', `autolink ${m[0]}; write [url](url)`); push(mk('html', i, m[0])); i += m[0].length; continue; }
        if ((m = matchAt(AUTOLINK_EMAIL, T, i))) { at(i, 'bare-email', `autolink ${m[0]}; write [address](mailto:address)`); push(mk('html', i, m[0])); i += m[0].length; continue; }
        if ((m = matchAt(BR_TAG, T, i))) {
          if (!inCell) at(i, 'line-break', `${m[0]} outside a table cell; use a bare newline`);
          else if (m[0] !== '<br>') at(i, 'html', `${m[0]} in a table cell; write <br>`);
          push(mk('html', i, m[0])); i += m[0].length; continue;
        }
        if ((m = matchAt(HTML_COMMENT, T, i))) { at(i, 'html', 'an HTML comment'); push(mk('html', i, m[0])); i += m[0].length; continue; }
        if ((m = matchAt(HTML_TAG, T, i))) {
          const line = lineAt(i);
          const tags = htmlTags.get(line) ?? [];
          tags.push(m[0].length > 40 ? `${m[0].slice(0, 40)}…` : m[0]);
          htmlTags.set(line, tags);
          push(mk('html', i, m[0])); i += m[0].length; continue;
        }
        if (/[A-Za-z/!]/.test(T[i + 1] ?? '')) at(i, 'html', 'a < directly followed by a letter, / or !');
        add(c, i); i++; continue;
      }
      if (c === '&' && (m = matchAt(ENTITY_RE, T, i)) && entityChar(m[0]) !== undefined) {
        at(i, 'html-entity', `HTML entity ${m[0]}`);
        add(m[0], i); i += m[0].length; continue;
      }
      if (c === ' ') { at(i, 'nbsp', 'a non-breaking space (U+00A0)'); add(c, i); i++; continue; }
      if ((c === '[' || (c === '!' && T[i + 1] === '[')) && (m = matchAt(WIKILINK, T, i))) {
        at(i, 'obsidian-syntax', `Obsidian wikilink ${m[0]}`); add(m[0], i); i += m[0].length; continue;
      }
      if (c === '=' && (m = matchAt(HIGHLIGHT, T, i))) { at(i, 'obsidian-syntax', `Obsidian highlight ${m[0]}`); add(m[0], i); i += m[0].length; continue; }
      if (c === '%' && (m = matchAt(OBS_COMMENT, T, i))) { at(i, 'obsidian-syntax', 'an Obsidian %%comment%%'); add(m[0], i); i += m[0].length; continue; }
      if (c === '!' && T[i + 1] === '[') {
        push(mk('text', i, '!['));
        brackets.push({ idx: nodes.length - 1, image: true, active: true, pos: i });
        i += 2; continue;
      }
      if (c === '[') {
        if ((m = matchAt(FOOTNOTE_REF, T, i)) && T[i + m[0].length] !== '(') {
          at(i, 'footnote', `footnote reference ${m[0]}; write ${m[0].replace('^', '')}`);
          add(m[0], i); i += m[0].length; continue;
        }
        push(mk('text', i, '['));
        brackets.push({ idx: nodes.length - 1, image: false, active: true, pos: i });
        i++; continue;
      }
      if (c === ']') {
        const b = brackets.pop();
        if (!b || !b.active) { add(c, i); i++; continue; }
        const tail = parseLinkTail(T, i + 1);
        let end = -1;
        let isRef = false;
        if (tail) end = tail.end;
        else {
          const label = T.slice(b.pos + (b.image ? 2 : 1), i);
          const rm = matchAt(/\[([^\]\n]*)\]/y, T, i + 1);
          if (rm && defs.has(normLabel(rm[1] === '' ? label : rm[1]))) { end = i + 1 + rm[0].length; isRef = true; }
          else if (defs.has(normLabel(label))) { end = i + 1; isRef = true; }
        }
        if (end < 0) { add(c, i); i++; continue; }
        flush();
        const children = nodes.splice(b.idx + 1);
        nodes.pop();
        processEmphasis(children);
        const link = mk('link', b.pos, tail ? tail.dest : '');
        link.image = b.image;
        link.children = children;
        nodes.push(link);
        if (isRef) at(b.pos, 'link-reference', 'a reference-style link; write an inline link');
        else if (tail) checkLink(tail, b.image, b.pos);
        if (!b.image) for (const o of brackets) if (!o.image) o.active = false;
        i = end;
        continue;
      }
      if (/[hHmM]/.test(c) && (i === 0 || /[\s*_~(["'“‘]/.test(T[i - 1])) && (m = matchAt(BARE_URL, T, i))) {
        const s = trimUrl(m[0]);
        push(mk('url', i, s)); i += s.length; continue;
      }
      if (EMAIL_CH.test(c) && !EMAIL_CH.test(T[i - 1] ?? '') && (m = matchAt(EMAIL, T, i))) {
        push(mk('email', i, m[0])); i += m[0].length; continue;
      }
      const pushPath = (end: number): void => {
        const text = T.slice(i, end);
        // The entity row applies inside a token (Notion decodes entities regardless): still report them.
        for (const e of text.matchAll(ENTITY_ALL)) if (entityChar(e[0]) !== undefined) at(i + (e.index ?? 0), 'html-entity', `HTML entity ${e[0]}`);
        push(mk('path', i, text));
        i = end;
      };
      if (pendingPath && i === pendingPath.start) { const end = pendingPath.end; pendingPath = null; pushPath(end); continue; }
      const tok = pendingPath ? null : bareToken(T, i);
      if (tok && tok.start === i) { pushPath(tok.end); continue; }
      if (tok) pendingPath = tok; // a leading emphasis `_`: handled below as a delimiter, the path after it
      if (c === '*' || c === '_' || c === '~') {
        let n = 1;
        while (T[i + n] === c) n++;
        if (pendingPath && pendingPath.start > i) n = Math.min(n, pendingPath.start - i); // `__notes.md_`: the path keeps its `_`
        if (c === '~' && n !== 2) { add(c.repeat(n), i); i += n; continue; }
        const before = T[i - 1];
        const after = T[i + n];
        const left = !isWs(after) && (!isPunct(after) || isWs(before) || isPunct(before));
        const right = !isWs(before) && (!isPunct(before) || isWs(after) || isPunct(after));
        const d = mk('delim', i, c.repeat(n));
        d.ch = c;
        d.count = n;
        d.orig = n;
        if (c === '_') {
          d.canOpen = left && (!right || isPunct(before));
          d.canClose = right && (!left || isPunct(after));
        } else {
          d.canOpen = left;
          d.canClose = right;
        }
        push(d);
        i += n;
        continue;
      }
      add(c, i);
      i++;
    }
    flush();
    processEmphasis(nodes);
    for (const [line, tags] of htmlTags) {
      emit(line, 'html', `HTML tag ${tags[0]}${tags.length > 1 ? ` (and ${tags.length - 1} more on the line)` : ''}`);
    }

    // Emphasis shapes: the profile's six forms, nothing nested beyond them.
    const kindOf = (n: INode): 'strike' | 'strong' | 'em' => (n.ch === '~' ? 'strike' : n.strong ? 'strong' : 'em');
    const nonEmpty = (list: INode[]): INode[] => list.filter((x) => !(x.k === 'text' && x.s === ''));
    const checkEmph = (n: INode, nested: boolean, parentCh: string): void => {
      const kind = kindOf(n);
      if (n.ch === '_' && parentCh !== '_') at(n.pos, 'emphasis-underscore', 'underscore emphasis; use asterisks');
      const kids = nonEmpty(n.children);
      if (kids.some((x) => x.k === 'link')) at(n.pos, 'emphasis-link', 'emphasis wraps a link; close it around the link, or move it inside the link text');
      if (kids.some((x) => x.k === 'code') && !(kids.length === 1 && kind !== 'strike')) {
        at(n.pos, 'emphasis-code', 'emphasis wraps a code span and other text; close it before the code and reopen after');
      }
      if (!kids.some((x) => x.k === 'emph')) return;
      if (!nested && kids.length === 1) {
        const ik = kindOf(kids[0]);
        if (kind === 'strike' && ik !== 'strike') return; // ~~*x*~~, ~~**x**~~
        if ((kind === 'em' && ik === 'strong') || (kind === 'strong' && ik === 'em')) return; // ***x***
        if (kind !== 'strike' && ik === 'strike') {
          at(n.pos, 'emphasis-strike-order', kind === 'em' ? '*~~x~~*; write ~~*x*~~' : '**~~x~~**; write ~~**x**~~');
          return;
        }
      }
      at(n.pos, 'emphasis-nested', 'emphasis nested inside emphasis, or sharing a delimiter with it, beyond the six forms');
    };
    const leftovers: INode[] = [];
    const walk = (list: INode[], inLink: boolean, parent: INode | undefined): void => {
      const inEmph = parent !== undefined;
      for (let k = 0; k < list.length; k++) {
        const n = list[k];
        const nx = list[k + 1];
        if (n.k === 'emph' && nx !== undefined && nx.k === 'emph') at(nx.pos, 'emphasis-adjacent', 'two emphasis spans touch; put a space or text between them');
        if (!inLink) {
          if (n.k === 'url') at(n.pos, 'bare-url', `bare URL ${n.s}; write [url](url)`);
          if (n.k === 'email') at(n.pos, 'bare-email', `bare email address ${n.s}; write [address](mailto:address)`);
          if (n.k === 'path') at(n.pos, 'bare-path', `bare path or filename ${n.s}; put it in a code span`);
        }
        if (n.k === 'delim' && n.ch === '*' && n.count > 0) {
          if (inEmph) at(n.pos, 'emphasis-nested', 'a literal * inside an emphasis span; a span holds no other delimiter');
          else leftovers.push(n);
        }
        if (n.k === 'emph') { checkEmph(n, inEmph, parent?.ch ?? ''); walk(n.children, inLink, n); }
        if (n.k === 'link') {
          const kids = nonEmpty(n.children);
          if (!n.image && kids.some((x) => x.k === 'emph') && kids.length > 1) {
            at(n.pos, 'emphasis-link', 'link text holds partial emphasis; make the emphasis the whole link text, or move it outside the link');
          }
          walk(n.children, true, undefined);
        }
      }
    };
    walk(nodes, false, undefined);

    // Literal stars: spaced on both sides, or the only * in the paragraph.
    if (leftovers.length > 0) {
      const inCode = (p: number): boolean => codeRanges.some(([a, b]) => p >= a && p < b);
      let stars = 0;
      for (let p = 0; p < T.length; p++) if (T[p] === '*' && !inCode(p)) stars++;
      for (const d of leftovers) {
        if (isWs(T[d.pos - 1]) && isWs(T[d.pos + d.count])) continue;
        if (stars === 1) continue;
        at(d.pos, 'literal-star', 'a literal * without a space on both sides, in a paragraph with other *s');
      }
    }
  };

  // ---- blocks -------------------------------------------------------------
  let nextUnderText = false;

  /** Parse a fenced block opening at i; returns the index after it. `maxIndent` admits fences inside list items. */
  const parseFence = (i: number, inList: boolean, maxIndent = 3): number => {
    const f = fenceOpen(L[i], maxIndent);
    if (!f) return i + 1;
    if (!inList && f.indent > 0) emit(ln(i), 'leading-whitespace', 'fenced code block indented from the margin');
    if (f.ch === '~') emit(ln(i), 'fence-form', 'a tilde fence; use three backticks');
    else if (f.len !== 3) emit(ln(i), 'fence-form', `${f.len}-backtick fence; a fence is exactly three`);
    const info = f.info.trim();
    if (info) {
      const lower = info.toLowerCase();
      if (lower === 'text' || lower === 'txt' || lower === 'plain text') emit(ln(i), 'fence-language', `fence language “${info}”: Notion returns a bare fence; leave it bare`);
      else if (RENAMED[lower] !== undefined) emit(ln(i), 'fence-language', `fence language “${info}”: Notion renames it; write ${RENAMED[lower]}`);
      else if (/\s/.test(info)) emit(ln(i), 'fence-form', 'the fence’s info string holds more than a language name');
    }
    let close = i + 1;
    while (close < N && !fenceCloses(L[close], f)) { fenceContent[close] = true; close++; }
    if (close >= N) {
      emit(ln(i), 'fence-form', 'fenced code block never closes');
      return N;
    }
    const inner = new RegExp(`^[ \\t]{0,${f.indent + 3}}(\`{3,}|~{3,})`);
    for (let j = i + 1; j < close; j++) {
      if (inner.test(L[j])) emit(ln(j), 'fence-form', 'a content line starts with a fence marker (fence lines inside a fence: PL10)');
    }
    const run = /^[ \t]*(`+|~+)/.exec(L[close]);
    if (f.ch === '`' && f.len === 3 && run && run[1].length !== 3) emit(ln(close), 'fence-form', 'closing fence is not three backticks');
    return close + 1;
  };

  const parseHeading = (i: number): void => {
    const m = /^( {0,3})(#{1,6})(.*)$/.exec(L[i]);
    if (!m) return;
    if (m[1]) emit(ln(i), 'leading-whitespace', 'heading indented from the margin');
    if (m[2].length > 4) emit(ln(i), 'heading-depth', `${m[2].length}-level heading; the profile stops at ####`);
    const rest = m[3];
    if (rest.trim() === '') { emit(ln(i), 'heading-form', 'empty heading'); return; }
    if (!/^ \S/.test(rest)) emit(ln(i), 'heading-form', 'exactly one space goes between the #s and the text');
    let content = rest.replace(/^[ \t]+/, '');
    const close = /(?:^|[ \t]+)#+[ \t]*$/.exec(content);
    if (close) {
      emit(ln(i), 'heading-closing', 'a closing # sequence; drop it');
      content = content.slice(0, close.index);
    }
    lintInline([{ i, text: content.replace(/[ \t]+$/, '') }], false);
  };

  const parseQuote = (i: number): number => {
    const paras: Array<{ lines: Line[]; skip: boolean }> = [{ lines: [], skip: false }];
    let j = i;
    let qfence: FenceInfo | null = null;
    for (; j < N; j++) {
      const t = L[j];
      if (t.trim() === '') break;
      const cur = paras[paras.length - 1];
      const m = /^( {0,3})>(.*)$/.exec(t);
      if (!m) {
        if (qfence || classify(t) !== 'para') break;
        emit(ln(j), 'quote-marker', 'a quote line without > (lazy continuation); start every line with > ');
        cur.lines.push({ i: j, text: t.replace(/^[ \t]+/, '') });
        continue;
      }
      if (m[1]) emit(ln(j), 'leading-whitespace', 'quote marker indented from the margin');
      let body = m[2];
      if (qfence) {
        // Inside a fence in the quote: reported once at its opener; its lines aren't checked.
        if (fenceCloses(body.replace(/^ /, ''), qfence)) qfence = null;
        continue;
      }
      if (body.trim() === '') { paras.push({ lines: [], skip: false }); continue; }
      if (body[0] !== ' ') emit(ln(j), 'quote-marker', 'no space after >');
      else body = body.slice(1);
      const f = fenceOpen(body);
      if (f) {
        emit(ln(j), 'quote-content', 'a fenced code block inside a quote');
        qfence = f;
        cur.skip = true;
        continue;
      }
      if (/^>/.test(body)) emit(ln(j), 'quote-content', 'a nested quote');
      else if (/^([-*+]|\d{1,9}[.)])(?:[ \t]|$)/.test(body)) emit(ln(j), 'quote-content', 'a list inside a quote');
      else if (/^#{1,6}(?:[ \t]|$)/.test(body)) emit(ln(j), 'quote-content', 'a heading inside a quote');
      else if (j === i && /^\[![A-Za-z]/.test(body)) emit(ln(j), 'quote-content', 'a callout marker');
      cur.lines.push({ i: j, text: body });
    }
    for (const p of paras) if (!p.skip) lintInline(p.lines, false);
    return j;
  };

  interface Cell { text: string; ok: boolean }
  const splitRow = (t: string): { cells: Cell[]; problem: string | undefined } => {
    let problem: string | undefined;
    if (/^[ \t]/.test(t)) problem = 'table row indented from the margin';
    const s = t.trimStart();
    const pipes: number[] = [];
    for (let k = 0; k < s.length; k++) {
      if (s[k] === '\\') { k++; continue; }
      if (s[k] === '|') pipes.push(k);
    }
    if (pipes[0] !== 0 || pipes[pipes.length - 1] !== s.length - 1 || pipes.length < 2) {
      problem ??= 'a table row starts and ends with |';
    }
    const cells: Cell[] = [];
    for (let k = 0; k + 1 < pipes.length; k++) {
      const c = s.slice(pipes[k] + 1, pipes[k + 1]);
      let ok = true;
      if (c === '  ') { cells.push({ text: '', ok }); continue; }
      if (c === '') { problem ??= 'an empty cell is two spaces: |  |'; ok = false; }
      else if (!(c.length >= 3 && c[0] === ' ' && !/\s/.test(c[1]) && c.endsWith(' ') && !/\s/.test(c[c.length - 2]))) {
        problem ??= 'a cell is one space, the text, one space';
        ok = false;
      }
      cells.push({ text: c.trim(), ok });
    }
    return { cells, problem };
  };

  const parseTable = (i: number): number => {
    let j = i;
    while (j < N && /^ {0,3}\|/.test(L[j])) j++;
    if (j - i < 2 || !GFM_SEP.test(L[i + 1])) {
      emit(ln(i), 'table-form', 'a pipe row with no separator row under it');
      lintInline(L.slice(i, j).map((text, k) => ({ i: i + k, text: text.trimStart() })), false);
      return j;
    }
    const header = splitRow(L[i]);
    const cols = header.cells.length;
    if (L[i + 1] !== `|${'---|'.repeat(cols)}`) emit(ln(i + 1), 'table-form', 'the separator is |---| per column, nothing else');
    for (let k = i; k < j; k++) {
      if (k === i + 1) continue;
      const row = k === i ? header : splitRow(L[k]);
      if (row.problem) emit(ln(k), 'table-form', row.problem);
      else if (row.cells.length !== cols) emit(ln(k), 'table-form', `${row.cells.length} cell${row.cells.length === 1 ? '' : 's'} in a ${cols}-column table`);
      for (const cell of row.cells) if (cell.text) lintInline([{ i: k, text: cell.text }], true);
    }
    return j;
  };

  const CHILD_BLOCK = /^(>|\||#{1,6}(?:[ \t]|$))/;
  interface Level { indent: number; width: number; ordered: boolean; num: number; marker: string }

  const parseList = (i: number, underText: boolean): number => {
    const stack: Level[] = [];
    let unit: Line[] = [];
    const flushUnit = (): void => { lintInline(unit, false); unit = []; };
    let j = i;
    let first = true;
    let afterGap = false;
    /** The deepest open item whose content column the indentation reaches, or -1. */
    const owner = (w: number): number => {
      let lvl = stack.length - 1;
      while (lvl >= 0 && w < stack[lvl].indent + stack[lvl].width) lvl--;
      return lvl;
    };
    const fenceIn = (t: string): { f: FenceInfo; lvl: number } | null => {
      const w = leadWidth(t);
      const lvl = owner(w);
      if (w === 0 || lvl < 0) return null;
      const f = fenceOpen(t, stack[lvl].indent + stack[lvl].width + 3);
      return f ? { f, lvl } : null;
    };
    /** A non-item line inside the list: continuation text, a fence, or a block that doesn't belong. */
    const continuation = (t: string, w: number): void => {
      if (w === 0) { unit.push({ i: j, text: t }); return; } // lazy continuation line: in the profile
      if (CHILD_BLOCK.test(t.trimStart())) {
        emit(ln(j), 'list-item-block', 'a quote, table or heading inside a list item');
        return;
      }
      if (!afterGap) emit(ln(j), 'list-continuation', 'an indented continuation line; start it at the left margin');
      unit.push({ i: j, text: t.trimStart() });
    };
    while (j < N) {
      const t = L[j];
      if (t.trim() === '') {
        let k = j;
        while (k < N && L[k].trim() === '') k++;
        if (k >= N || stack.length === 0) break;
        const nt = L[k];
        const nk = classify(nt);
        const nw = leadWidth(nt);
        const im = ITEM.exec(nt);
        if (nk === 'item' && im && (nw > 0 || family(im[2]) === family(stack[0].marker))) {
          emit(ln(j), 'list-loose', 'empty line between list items');
          j = k;
          continue;
        }
        const lvl = owner(nw);
        if (nw > 0 && lvl >= 0) {
          stack.length = lvl + 1;
          flushUnit();
          if (fenceIn(nt)) emit(ln(j), 'list-fence-gap', 'empty line between the item and its fenced code block');
          else if (!CHILD_BLOCK.test(nt.trimStart())) emit(ln(k), 'list-continuation', 'a second paragraph inside a list item; use a bare newline and an unindented line');
          afterGap = true;
          j = k;
          continue;
        }
        break;
      }
      const w = leadWidth(t);
      const fin = fenceIn(t);
      if (fin) {
        stack.length = fin.lvl + 1;
        const col = stack[fin.lvl].indent + stack[fin.lvl].width;
        if (w !== col) emit(ln(j), 'list-indent', `fenced code block at column ${w}; the item’s content starts at ${col}`);
        flushUnit();
        afterGap = false;
        j = parseFence(j, true, col + 3);
        continue;
      }
      const kind = classify(t);
      if (kind === 'item') {
        const m = ITEM_PARTS.exec(t);
        if (!m) break;
        const [, lead, marker, pad] = m;
        let rest = m[4];
        const ind = leadWidth(t);
        const ordered = /\d/.test(marker);
        const level: Level = { indent: ind, width: marker.length + 1, ordered, num: ordered ? parseInt(marker, 10) : 0, marker };
        const prevBlank = j > i && L[j - 1].trim() === '';
        let depth = stack.length;
        while (depth > 0 && ind < stack[depth - 1].indent) depth--;
        const peer = depth > 0 && stack[depth - 1].indent === ind ? stack[depth - 1] : undefined;
        const sibling = peer !== undefined && family(peer.marker) === family(marker);
        // An item that can't interrupt a paragraph (an ordered number other than 1, or an empty item) and
        // isn't a sibling in its list is continuation text, as CommonMark reads it.
        if (j > i && !prevBlank && !sibling && !canInterrupt(marker, rest)) {
          continuation(t, w);
          afterGap = false;
          j++;
          continue;
        }
        flushUnit();
        stack.length = depth;
        if (lead.includes('\t')) emit(ln(j), 'list-indent', 'tab in the list indentation; use spaces');
        if (marker === '*' || marker === '+') emit(ln(j), 'list-marker', `“${marker}” bullet; use “-”`);
        if (marker.endsWith(')')) emit(ln(j), 'list-marker', `“${marker}”; use “${marker.slice(0, -1)}.”`);
        const todo = /^\[([ xX])\](?=[ \t]|$)/.exec(rest);
        if (rest === '' || (todo && rest.slice(3).trim() === '')) emit(ln(j), 'list-empty-item', 'an empty list item');
        else if (pad !== ' ') emit(ln(j), 'list-marker', 'one space goes after the list marker');
        if (todo && todo[1] === 'X') emit(ln(j), 'todo-case', '- [X]; write - [x]');
        const top = stack[stack.length - 1];
        if (top && ind === top.indent) {
          if (!sibling) {
            if (!prevBlank) emit(ln(j), 'block-separation', 'two lists touch (a different marker starts a new list); put an empty line between them');
          } else if (top.ordered && ordered && level.num !== top.num + 1) {
            emit(ln(j), 'list-numbering', `${level.num} after ${top.num}; number consecutively`);
          }
          stack[stack.length - 1] = level;
        } else if (top) {
          const expected = top.indent + top.width;
          if (ind !== expected) emit(ln(j), 'list-indent', `nested ${ind} spaces in; a child of “${top.marker}” sits at ${expected}`);
          stack.push(level);
        } else {
          if (ind > 0 && !(first && underText)) emit(ln(j), 'list-indent', 'list indented from the margin');
          stack.push(level);
        }
        first = false;
        afterGap = false;
        if (todo) rest = rest.slice(3).replace(/^[ \t]/, '');
        if (rest.trim() !== '') unit = [{ i: j, text: rest.replace(/[ \t]+$/, '') }];
        j++;
        continue;
      }
      if (w === 0) {
        if (kind !== 'para' && kind !== 'footdef' && kind !== 'refdef') break;
        // A field label line under a list is the next field, not the last item's continuation.
        if (FIELD_LABEL.test(t)) break;
      }
      continuation(t, w);
      afterGap = false;
      j++;
    }
    flushUnit();
    return j;
  };

  const parsePara = (i: number, afterBlank: boolean): { end: number; suppress: boolean } => {
    const firstLine = L[i];
    if (afterBlank && leadWidth(firstLine) >= 4 && !/^\s*<table\b/i.test(firstLine)) {
      emit(ln(i), 'indented-code', 'an indented code block; use a bare fenced block');
      let j = i;
      while (j < N && L[j].trim() !== '') j++;
      return { end: j, suppress: false };
    }
    if (i + 1 < N && firstLine.includes('|') && L[i + 1].includes('|') && GFM_SEP.test(L[i + 1])) {
      emit(ln(i), 'table-form', 'a table without outer pipes; start and end every row with |');
      let j = i;
      while (j < N && L[j].trim() !== '') j++;
      return { end: j, suppress: false };
    }
    const unit: Line[] = [];
    let j = i;
    let suppress = false;
    for (; j < N; j++) {
      const t = L[j];
      if (t.trim() === '') break;
      if (j > i) {
        if (SETEXT.test(t)) { emit(ln(j), 'heading-setext', 'an underlined heading; write it with #s'); j++; break; }
        const k = classify(t);
        if (k === 'item') {
          const m = ITEM_PARTS.exec(t);
          if (m && canInterrupt(m[2], m[4])) {
            if (leadWidth(t) > 0) {
              emit(ln(j), 'list-under-text', 'a list indented under a non-list line; unindent it and set it off with an empty line');
              nextUnderText = true;
              suppress = true;
            }
            break;
          }
        } else if (k === 'table') {
          if (j + 1 < N && L[j + 1].includes('|') && GFM_SEP.test(L[j + 1])) break;
        } else if (k !== 'para' && k !== 'footdef' && k !== 'refdef') break;
      }
      if (/^[ \t]/.test(t)) emit(ln(j), 'leading-whitespace', 'space or tab at the start of a paragraph line');
      unit.push({ i: j, text: t.replace(/^[ \t]+/, '') });
    }
    lintInline(unit, false);
    return { end: j, suppress };
  };

  const parseBlock = (i: number, afterBlank: boolean): { end: number; suppress: boolean } => {
    const kind = classify(L[i]);
    switch (kind) {
      case 'fence': return { end: parseFence(i, false), suppress: false };
      case 'heading': parseHeading(i); return { end: i + 1, suppress: false };
      case 'rule': {
        const t = L[i].trimEnd();
        if (/^[ \t]/.test(t)) emit(ln(i), 'leading-whitespace', `“${t.trim()}” indented from the margin`);
        const spelled = t.trim();
        if (spelled !== '---' && spelled !== '* * *') emit(ln(i), 'rule-form', `rule written “${spelled}”; write --- (or * * * for a scene break)`);
        return { end: i + 1, suppress: false };
      }
      case 'quote': return { end: parseQuote(i), suppress: false };
      case 'item': {
        const under = nextUnderText;
        nextUnderText = false;
        return { end: parseList(i, under), suppress: false };
      }
      case 'table': return { end: parseTable(i), suppress: false };
      case 'refdef':
        emit(ln(i), 'link-reference', 'a reference link definition; write the link inline');
        return { end: i + 1, suppress: false };
      case 'footdef':
        emit(ln(i), 'footnote', 'a footnote definition; write [1] text where it stands');
        lintInline([{ i, text: L[i].replace(FOOTDEF, '').trim() }], false);
        return { end: i + 1, suppress: false };
      default: return parsePara(i, afterBlank);
    }
  };

  let i = start;
  let blank = 0;
  while (i < N && L[i].trim() === '') { blank++; i++; }
  if (blank > 1) emit(ln(start + 1), 'blank-lines', 'more than one empty line before the first block');
  blank = 0;
  let hadBlock = false;
  let suppress = false;
  while (i < N) {
    if (L[i].trim() === '') {
      blank++;
      if (blank === 2) emit(ln(i), 'blank-lines', 'more than one empty line between blocks');
      i++;
      continue;
    }
    if (hadBlock && blank === 0 && !suppress) emit(ln(i), 'block-separation', 'no empty line between this block and the one above');
    const r = parseBlock(i, blank > 0 || !hadBlock);
    i = Math.max(r.end, i + 1);
    suppress = r.suppress;
    hadBlock = true;
    blank = 0;
  }

  for (let j = start; j < N; j++) {
    if (fenceContent[j]) continue;
    const t = L[j];
    if (t.trim() === '') {
      if (t !== '') emit(ln(j), 'whitespace-only-line', 'a line holding only whitespace');
    } else if (/[ \t]$/.test(t)) {
      emit(ln(j), 'trailing-whitespace', 'space or tab at the end of the line');
    }
  }
  return done();
}

// ---------------------------------------------------------------------------
// Words

/** Values of frontmatter lines: keys stripped on key lines only, block-scalar lines kept whole. */
function frontmatterWords(lines: readonly string[]): string[] {
  const out: string[] = [];
  let scalar = -1;
  for (const line of lines) {
    if (line.trim() === '') continue;
    const w = leadWidth(line);
    if (scalar >= 0 && w > scalar) { out.push(line); continue; }
    scalar = -1;
    const m = /^[ \t]*(?:-[ \t]+)?(?:[A-Za-z_][\w.-]*|"[^"\n]*"|'[^'\n]*')[ \t]*:(?:[ \t]+|$)(.*)$/.exec(line);
    if (m) {
      if (/^[|>][+-]?\d*[ \t]*(?:#.*)?$/.test(m[1])) { scalar = w; continue; }
      out.push(m[1]);
      continue;
    }
    out.push(line.replace(/^[ \t]*-[ \t]+/, ''));
  }
  return out;
}

/**
 * Replace each code span on a line with a placeholder, keeping its contents verbatim (CommonMark's one
 * padding space each side removed; in a table row, `\|` read as `|`), so markup stripping never touches them.
 */
function protectCode(line: string, tableRow: boolean, codes: string[]): string {
  let out = '';
  let i = 0;
  while (i < line.length) {
    const c = line[i];
    if (c === '\\') { out += line.slice(i, i + 2); i += 2; continue; }
    if (c !== '`') { out += c; i++; continue; }
    let n = 1;
    while (line[i + n] === '`') n++;
    const close = findTicks(line, i + n, n);
    if (close < 0) { out += '`'.repeat(n); i += n; continue; }
    let content = line.slice(i + n, close);
    if (tableRow) content = content.replace(/\\\|/g, '|');
    if (!/^ +$/.test(content) && content.length >= 2 && content.startsWith(' ') && content.endsWith(' ')) content = content.slice(1, -1);
    out += `\u0000${codes.length}\u0000`;
    codes.push(content);
    i = close + n;
  }
  return out;
}

/**
 * Replace each bare path or filename token (bareToken) with a placeholder holding its text with entities decoded
 * (the entity row applies inside a token), so no other markup stripping reaches inside it. What lint consumes before
 * it looks for a token (an HTML tag, comment or autolink, a wikilink, an entity, a link's target) is copied as it
 * stands, so the spans are lint's bare-path spans, plus the tokens inside link text, which lint parses without
 * reporting.
 */
function protectPaths(line: string, codes: string[]): string {
  let out = '';
  let i = 0;
  while (i < line.length) {
    let m: RegExpExecArray | null = null;
    if (line[i] === '<') m = matchAt(HTML_COMMENT, line, i) ?? matchAt(AUTOLINK_URI, line, i) ?? matchAt(AUTOLINK_EMAIL, line, i) ?? matchAt(HTML_TAG, line, i);
    else if (line[i] === '[' || (line[i] === '!' && line[i + 1] === '[')) m = matchAt(WIKILINK, line, i);
    else if (line[i] === '&') m = matchAt(ENTITY_RE, line, i);
    if (m) { out += m[0]; i += m[0].length; continue; }
    if (line[i] === ']' && line[i + 1] === '(') {
      const tail = parseLinkTail(line, i + 1);
      if (tail) { out += line.slice(i, tail.end); i = tail.end; continue; }
    }
    const tok = bareToken(line, i);
    if (!tok) { out += line[i]; i++; continue; }
    out += line.slice(i, tok.start);
    out += `\u0000${codes.length}\u0000`;
    codes.push(line.slice(tok.start, tok.end).replace(ENTITY_ALL, (e) => entityChar(e) ?? e));
    i = tok.end;
  }
  return out;
}

const LINK_RE = /!?\[((?:[^[\]]|\[[^[\]]*\])*)\]\((?:[^()\n]|\([^()\n]*\))*\)/g;

/** Strip inline markup from a run of non-code markdown text, keeping the words. */
function stripInline(src: string): string {
  let s = src;
  s = s.replace(/<((?:https?|mailto):[^\s<>]*)>/gi, ' $1 ');
  s = s.replace(/<([^\s@<>]+@[^\s<>]+)>/g, ' $1 ');
  s = s.replace(/<img\b[^<>]*?\balt\s*=\s*"([^"]*)"[^<>]*>/gi, ' $1 ');
  // An HTML table becomes a pipe table: every tag inside it is structure (colgroup, col, p, thead, …), not words.
  s = s.replace(/<table\b[\s\S]*?<\/table\s*>/gi, (t) => t.replace(/<\/?[A-Za-z][A-Za-z0-9-]*(?:\s[^<>]*)?\/?>/g, ' '));
  s = s.replace(LINK_RE, '$1').replace(LINK_RE, '$1');
  s = s.replace(/\[([^[\]]+)\]\[[^[\]]*\]/g, '$1');
  s = s.replace(/\[\^([^\]\s]+)\]/g, '[$1]');
  // Only the HTML the rewrite table turns into markdown is markup; other tags are kept as written, so are words.
  s = s.replace(/<\/?(?:b|strong|em|code|a)\b[^<>]*>/gi, '');
  s = s.replace(/<\/?(?:br|table|thead|tbody|tfoot|tr|td|th|details|summary)\b[^<>]*>/gi, ' ');
  s = s.replace(/\\\n/g, '\n');
  s = s.replace(/\\([!-/:-@[-`{-~])/g, '$1');
  s = s.replace(ENTITY_ALL, (e) => entityChar(e) ?? e);
  // A run of * or _ with space on both sides is a literal character, so a word.
  s = s.replace(/(^|\s)([*_]+)(?=\s|$)/g, (_m: string, pre: string, run: string) => pre + run.replace(/\*/g, '\u0002').replace(/_/g, '\u0003'));
  s = s.replace(/\*/g, '').replace(/~~/g, '');
  s = s.replace(/(?<![\p{L}\p{N}])_+|_+(?![\p{L}\p{N}])/gu, '');
  s = s.replace(/`/g, '');
  return s.replace(/\u0002/g, '*').replace(/\u0003/g, '_');
}

/** The word sequence of a markdown document with markup stripped (frontmatter values count as words). */
export function markdownWords(src: string): string[] {
  const lines = src.replace(/^﻿/, '').replace(/\r\n?/g, '\n').replace(/ /g, ' ').split('\n');
  const out: string[] = [];
  const fm = frontmatterOf(lines);
  if (fm.body > 0) out.push(...frontmatterWords(lines.slice(1, fm.body >= lines.length && fm.issue ? lines.length : fm.body - 1)));
  const codes: string[] = [];
  let md: string[] = [];
  const flushMd = (): void => { if (md.length) { out.push(stripInline(md.join('\n'))); md = []; } };
  let fence: FenceInfo | null = null;
  let tableRow = -1;
  let listOpen = false;
  let prevBlank = true;
  let prevText = false;
  const items: Array<{ indent: number; fam: string }> = [];
  for (let i = fm.body; i < lines.length; i++) {
    const line = lines[i];
    if (fence) {
      if (fenceCloses(line, fence)) fence = null;
      else out.push(line);
      prevBlank = false;
      prevText = false;
      continue;
    }
    if (line.trim() === '') { md.push(''); tableRow = -1; prevBlank = true; prevText = false; continue; }
    const w = leadWidth(line);
    if (prevBlank && w >= 4 && !listOpen && !/^\s*<table\b/i.test(line)) {
      // An indented code block: verbatim, like a fenced one. (An indented HTML table is a table: lint and the
      // rewrite table treat it as one, so its tags are stripped below.)
      flushMd();
      let j = i;
      for (; j < lines.length; j++) {
        if (lines[j].trim() === '') {
          let k = j;
          while (k < lines.length && lines[k].trim() === '') k++;
          if (k < lines.length && leadWidth(lines[k]) >= 4) { j = k - 1; continue; }
          break;
        }
        if (leadWidth(lines[j]) < 4) break;
        out.push(lines[j]);
      }
      i = j - 1;
      prevBlank = false;
      prevText = false;
      continue;
    }
    const f = fenceOpen(line, listOpen ? Number.MAX_SAFE_INTEGER : 3);
    if (f) { flushMd(); fence = f; tableRow = -1; continue; }
    if (tableRow >= 0) tableRow++;
    else if (line.includes('|') && i + 1 < lines.length && lines[i + 1].includes('|') && lines[i + 1].includes('-') && GFM_SEP.test(lines[i + 1])) tableRow = 0;
    if (tableRow === 1) continue; // the separator row, and only that row
    const pipeRow = tableRow >= 0 || /^[ \t]*\|/.test(line);
    let s = protectPaths(protectCode(line, pipeRow, codes), codes);
    if (THEMATIC.test(s) || (prevText && /^ {0,3}=+[ \t]*$/.test(s))) {
      if (w === 0) listOpen = false;
      prevBlank = false;
      prevText = false;
      continue;
    }
    if (!prevText && REFDEF.test(s)) { prevBlank = false; continue; }
    s = s.replace(/^[ \t]*(?:>[ \t]?)+/, '');
    let isText = true;
    if (/^[ \t]*#{1,6}(?:[ \t]|$)/.test(s)) {
      s = s.replace(/^[ \t]*#{1,6}(?:[ \t]+|$)/, '').replace(/(?:^|[ \t]+)#+[ \t]*$/, '');
      isText = false;
      if (w === 0) listOpen = false;
    } else {
      const m = ITEM_PARTS.exec(s);
      const ind = m ? leadWidth(m[1]) : 0;
      const isItem = m !== null && (prevBlank || !prevText || canInterrupt(m[2], m[4]) || (listOpen && items.some((x) => x.indent === ind && x.fam === family(m[2]))));
      if (m && isItem) {
        if (!listOpen) items.length = 0;
        listOpen = true;
        items.push({ indent: ind, fam: family(m[2]) });
        s = s.replace(/^[ \t]*(?:[-*+]|\d{1,9}[.)])(?:[ \t]+|$)/, '').replace(/^\[[ xX]\](?:[ \t]+|$)/, '');
      } else if (w === 0 && prevBlank) {
        listOpen = false;
      }
    }
    s = s.replace(/^[ \t]*\[\^([^\]]+)\]:[ \t]*/, '[$1] ');
    if (pipeRow) s = s.replace(/(?<!\\)\|/g, ' ');
    md.push(s);
    prevBlank = false;
    prevText = isText;
  }
  flushMd();
  return out
    .join('\n')
    .replace(/\u0000(\d+)\u0000/g, (_m: string, k: string) => codes[Number(k)] ?? '')
    .split(/\s+/)
    .filter((w) => w !== '');
}

/** Turn a glob (`*`, `**`, `?`) into a RegExp over a /-separated relative path. */
export function globToRegExp(glob: string): RegExp {
  let re = '';
  for (let k = 0; k < glob.length; k++) {
    const c = glob[k];
    if (c === '*') {
      if (glob[k + 1] === '*') {
        k++;
        if (glob[k + 1] === '/') { k++; re += '(?:.*/)?'; } else re += '.*';
      } else re += '[^/]*';
    } else if (c === '?') re += '[^/]';
    else re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^${re}$`);
}

function ignored(rel: string, globs: RegExp[], bare: RegExp[]): boolean {
  const base = rel.slice(rel.lastIndexOf('/') + 1);
  return globs.some((g) => g.test(rel)) || bare.some((g) => g.test(base));
}
const compileIgnores = (ignores: readonly string[]): { globs: RegExp[]; bare: RegExp[] } => ({
  globs: ignores.filter((g) => g.includes('/')).map((g) => globToRegExp(g.normalize('NFC'))),
  bare: ignores.filter((g) => !g.includes('/')).map((g) => globToRegExp(g.normalize('NFC'))),
});

const SKIP_DIRS = new Set(['.git', 'node_modules']);

/** Relative (/-separated) paths of every .md file under root, sorted. Symlinks are skipped, never followed. */
export function listMarkdown(root: string): string[] {
  const out: string[] = [];
  const walk = (dir: string): void => {
    for (const name of readdirSync(dir).sort()) {
      const full = join(dir, name);
      const st = lstatSync(full);
      if (st.isSymbolicLink()) continue;
      if (st.isDirectory()) { if (!SKIP_DIRS.has(name)) walk(full); }
      else if (st.isFile() && name.toLowerCase().endsWith('.md')) out.push(relative(root, full).split(sep).join('/'));
    }
  };
  walk(root);
  return out;
}

export interface WordsResult { lines: string[]; compared: number; differing: number; onlyA: string[]; onlyB: string[] }

/** Compare the word sequences of every .md path in two trees. Paths match after Unicode NFC normalization. */
export function compareTrees(dirA: string, dirB: string, ignoreGlobs: readonly string[] = []): WordsResult {
  const { globs, bare } = compileIgnores(ignoreGlobs);
  const index = (root: string): Map<string, string> => {
    const m = new Map<string, string>();
    for (const p of listMarkdown(root)) {
      const key = p.normalize('NFC');
      if (!ignored(key, globs, bare)) m.set(key, p);
    }
    return m;
  };
  const a = index(dirA);
  const b = index(dirB);
  const lines: string[] = [];
  let compared = 0;
  let differing = 0;
  const ctx = (w: string[], k: number): string => {
    const before = w.slice(Math.max(0, k - 10), k).join(' ');
    const here = k < w.length ? `«${w[k]}»` : '«(end)»';
    const after = w.slice(k + 1, k + 11).join(' ');
    return [k > 10 ? '…' : '', before, here, after, k + 11 < w.length ? '…' : ''].filter((x) => x !== '').join(' ');
  };
  for (const key of [...a.keys()].sort()) {
    const pb = b.get(key);
    const pa = a.get(key);
    if (pb === undefined || pa === undefined) continue;
    compared++;
    const wa = markdownWords(readFileSync(join(dirA, pa), 'utf8'));
    const wb = markdownWords(readFileSync(join(dirB, pb), 'utf8'));
    let k = 0;
    while (k < wa.length && k < wb.length && wa[k] === wb[k]) k++;
    if (k === wa.length && k === wb.length) continue;
    differing++;
    lines.push(`${key}: words differ at word ${k + 1} (A has ${wa.length}, B has ${wb.length})`);
    lines.push(`  A: ${ctx(wa, k)}`);
    lines.push(`  B: ${ctx(wb, k)}`);
  }
  const onlyA = [...a.keys()].filter((p) => !b.has(p)).sort();
  const onlyB = [...b.keys()].filter((p) => !a.has(p)).sort();
  for (const p of onlyA) lines.push(`${p}: only in A (${dirA})`);
  for (const p of onlyB) lines.push(`${p}: only in B (${dirB})`);
  return { lines, compared, differing, onlyA, onlyB };
}

// ---------------------------------------------------------------------------
// CLI

const USAGE = `md-profile-check: lint markdown against references/markdown-profile.md, or compare the words of two trees.

Usage:
  node tools/md-profile-check.ts [--rule <id>[,<id>...]]... [--ignore <glob>]... <file-or-dir>...
  node tools/md-profile-check.ts --words [--ignore <glob>]... <dirA> <dirB>
  node tools/md-profile-check.ts --help

Lint checks every .md file (directories recurse, skipping .git, node_modules and symlinks; other
files are skipped) and prints "path:line: <rule-id> <message>" per finding, then a count. Frontmatter,
fenced code and code spans are not linted. Exit 1 when there are findings, 0 when clean, 2 on a usage
error or when nothing was checked.

--words strips markup (emphasis, list and quote markers, heading hashes, table pipes and separator
rows, fence lines, link syntax keeping link text, the HTML the profile rewrites, every tag inside an
HTML table, escaping backslashes, entities; nbsp becomes a space) from every .md path present in both
trees and compares the word sequences; code contents and bare path or filename tokens (the ones lint
reports as bare-path) compare verbatim, and frontmatter values count as words (keys don't). It reports the first differing word with context, and paths present in only one tree. Exit 1
on any difference.

--rule     limit lint to these rule ids (repeatable, or comma-separated)
--ignore   skip paths matching this glob, e.g. "**/_index.md" (repeatable; a glob without / matches
           the file name)

Rules (id: where the profile explains it):
${Object.entries(RULES).map(([id, ref]) => `  ${id}: ${ref}`).join('\n')}
`;

export function main(argv: readonly string[], out: (s: string) => void = (s) => process.stdout.write(`${s}\n`), err: (s: string) => void = (s) => process.stderr.write(`${s}\n`)): number {
  if (argv.includes('--help') || argv.includes('-h')) { out(USAGE); return 0; }
  let words = false;
  const rules: string[] = [];
  const ignores: string[] = [];
  const paths: string[] = [];
  for (let k = 0; k < argv.length; k++) {
    const a = argv[k];
    if (a === '--words') words = true;
    else if (a === '--rule' || a === '--ignore') {
      const v = argv[++k];
      if (v === undefined) { err(`${a} needs a value`); return 2; }
      if (a === '--rule') rules.push(...v.split(',')); else ignores.push(v);
    } else if (a.startsWith('--rule=')) rules.push(...a.slice(7).split(','));
    else if (a.startsWith('--ignore=')) ignores.push(a.slice(9));
    else if (a.startsWith('-')) { err(`unknown option ${a}; see --help`); return 2; }
    else paths.push(a);
  }
  if (rules.some((r) => r.trim() === '')) { err('--rule needs a rule id; see --help'); return 2; }
  if (ignores.some((g) => g === '')) { err('--ignore needs a glob'); return 2; }
  const unknown = rules.filter((r) => RULES[r] === undefined);
  if (unknown.length) { err(`unknown rule id${unknown.length > 1 ? 's' : ''}: ${unknown.join(', ')}; see --help`); return 2; }

  if (words) {
    if (rules.length) { err('--rule applies to lint, not --words'); return 2; }
    if (paths.length !== 2) { err('--words takes exactly two directories'); return 2; }
    for (const p of paths) {
      let ok = false;
      try { ok = statSync(p).isDirectory(); } catch { ok = false; }
      if (!ok) { err(`not a directory: ${p}`); return 2; }
    }
    const r = compareTrees(paths[0], paths[1], ignores);
    for (const l of r.lines) out(l);
    const only = r.onlyA.length + r.onlyB.length;
    out(`${r.compared} path${r.compared === 1 ? '' : 's'} compared: ${r.differing} differ${r.differing === 1 ? 's' : ''}, ${only} in only one tree`);
    return r.differing + only > 0 ? 1 : 0;
  }

  if (paths.length === 0) { err(USAGE); return 2; }
  const only = rules.length ? new Set(rules) : undefined;
  const { globs, bare } = compileIgnores(ignores);
  const files: string[] = [];
  for (const p of paths) {
    let st;
    try { st = statSync(p); } catch { err(`no such file or directory: ${p}`); return 2; }
    if (st.isDirectory()) {
      for (const rel of listMarkdown(p)) if (!ignored(rel.normalize('NFC'), globs, bare)) files.push(join(p, rel));
    } else if (p.toLowerCase().endsWith('.md')) files.push(p);
    else err(`skipped ${p}: not a .md file`);
  }
  if (files.length === 0) { err('nothing to check: no .md files'); return 2; }
  let total = 0;
  let withFindings = 0;
  for (const f of files) {
    const found = lintBuffer(readFileSync(f), only);
    if (found.length) withFindings++;
    total += found.length;
    for (const x of found) out(`${f}:${x.line}: ${x.rule} ${x.message}`);
  }
  out(`${total} finding${total === 1 ? '' : 's'} in ${withFindings} of ${files.length} file${files.length === 1 ? '' : 's'}${only ? ` (rules: ${[...only].join(', ')})` : ''}`);
  return total > 0 ? 1 : 0;
}

if (process.argv[1] !== undefined && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = main(process.argv.slice(2));
}
