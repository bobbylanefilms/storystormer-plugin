// ABOUTME: Tests for tools/md-profile-check.ts: a passing and failing case per lint rule, skipped regions,
// ABOUTME: the --words tree comparison, the CLI, and the real probe files under tests/markdown-profile/.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { RULES, compareTrees, globToRegExp, lintBuffer, lintText, main, markdownWords } from './md-profile-check.ts';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..');
const probeDir = join(repo, 'tests', 'markdown-profile');

const rulesOf = (src: string): string[] => lintText(src).map((f) => f.rule);

// One passing and one failing document per rule. Every `pass` must lint fully clean.
const CASES: Array<{ rule: string; pass: string; fail: string }> = [
  { rule: 'frontmatter-unclosed', pass: '---\ntitle: X\n---\n\nText.\n', fail: '---\ntitle: X\n\nText.\n' },
  { rule: 'line-ending', pass: 'One.\nTwo.\n', fail: 'One.\r\nTwo.\r\n' },
  { rule: 'final-newline', pass: 'Text.\n', fail: 'Text.' },
  { rule: 'trailing-whitespace', pass: 'Text.\n', fail: 'Text.   \n' },
  { rule: 'whitespace-only-line', pass: 'One.\n\nTwo.\n', fail: 'One.\n  \nTwo.\n' },
  { rule: 'blank-lines', pass: 'One.\n\nTwo.\n', fail: 'One.\n\n\nTwo.\n' },
  { rule: 'block-separation', pass: '## Head\n\nText.\n', fail: '## Head\nText.\n' },
  { rule: 'leading-whitespace', pass: 'Text.\n', fail: '  Text.\n' },
  { rule: 'indented-code', pass: 'Para.\n\n```\ncode\n```\n', fail: 'Para.\n\n    code\n' },
  { rule: 'heading-depth', pass: '#### Four\n', fail: '##### Five\n' },
  { rule: 'heading-closing', pass: '### Issue #12\n', fail: '### Closed ###\n' },
  { rule: 'heading-setext', pass: '# Title\n', fail: 'Title\n=====\n' },
  { rule: 'heading-form', pass: '## Two\n', fail: '##  Two spaces\n' },
  { rule: 'list-marker', pass: '- alpha\n- beta\n', fail: '* alpha\n* beta\n' },
  { rule: 'todo-case', pass: '- [x] done\n- [ ] open\n', fail: '- [X] done\n' },
  { rule: 'list-indent', pass: '- one\n  - two\n\n1. three\n   - four\n', fail: '- one\n    - two\n' },
  { rule: 'list-under-text', pass: '**Label:**\n\n- one\n', fail: '**Label**:\n  - one\n  - two\n' },
  { rule: 'list-numbering', pass: '3. three\n4. four\n', fail: '1. one\n1. two\n' },
  { rule: 'list-loose', pass: '- a\n- b\n', fail: '- a\n\n- b\n' },
  { rule: 'list-continuation', pass: '- an item that\nwraps onto a lazy line\n', fail: '- an item that\n  wraps onto an indented line\n' },
  { rule: 'list-fence-gap', pass: '- item\n  ```\n  code\n  ```\n', fail: '- item\n\n  ```\n  code\n  ```\n' },
  { rule: 'list-empty-item', pass: '- a\n- c\n', fail: '- a\n-\n- c\n' },
  { rule: 'list-item-block', pass: '- item\n\n> quoted\n', fail: '- item\n  > quoted\n' },
  { rule: 'quote-marker', pass: '> One.\n> Two.\n', fail: '>No space.\n' },
  { rule: 'quote-content', pass: '> One.\n>\n> Two.\n', fail: '> - item\n' },
  { rule: 'table-form', pass: '| a | b |\n|---|---|\n| c |  |\n', fail: '| a | b |\n| --- | --- |\n| c | d |\n' },
  { rule: 'fence-form', pass: '```\ncode\n```\n', fail: '~~~\ncode\n~~~\n' },
  { rule: 'fence-language', pass: '```javascript\nx\n```\n', fail: '```js\nx\n```\n' },
  { rule: 'rule-form', pass: 'A.\n\n---\n\nB.\n\n* * *\n\nC.\n', fail: 'A.\n\n***\n\nB.\n' },
  { rule: 'emphasis-underscore', pass: 'Some *x* and a snake_case_name.\n', fail: 'Some _x_ text.\n' },
  { rule: 'emphasis-nested', pass: 'Some **a** ***b*** **c** and ***d*** and ~~*e*~~.\n', fail: 'Some **a *b* c** text.\n' },
  { rule: 'emphasis-strike-order', pass: 'Some ~~**x**~~ text.\n', fail: 'Some **~~x~~** text.\n' },
  { rule: 'frontmatter-separation', pass: '---\ntitle: X\n---\n\nText.\n', fail: '---\ntitle: X\n---\nText.\n' },
  { rule: 'emphasis-link', pass: 'Some **see** [x](./x.md) **here** and [*y*](https://example.com).\n', fail: 'Some **see [x](./x.md) here** text.\n' },
  { rule: 'emphasis-adjacent', pass: 'Some **a** *b* text.\n', fail: 'Some **a***b* text.\n' },
  { rule: 'literal-star', pass: 'Five*three.\n\nAnd 5 * 3 * 2.\n', fail: 'Five*three and 5 *3.\n' },
  { rule: 'code-span-padding', pass: 'Use ``a`b`` and ` x` and ` ` here.\n', fail: 'Use `` a`b `` here.\n' },
  { rule: 'link-title', pass: 'See [s](https://example.com).\n', fail: 'See [s](https://example.com "T").\n' },
  { rule: 'link-reference', pass: 'See [s](https://example.com) and [OPEN: Q-001].\n', fail: 'See [s][r].\n\n[r]: https://example.com\n' },
  { rule: 'link-target', pass: 'See [Ada](./ada-vale.md), [v2](../ch/x.md), [top](#top), [me](mailto:a@example.com).\n', fail: 'See [Ada](ada-vale.md).\n' },
  { rule: 'image-target', pass: '![alt](https://example.com/a.png)\n', fail: '![alt](image.png)\n' },
  { rule: 'bare-url', pass: 'See [https://example.com/p](https://example.com/p) now.\n', fail: 'See https://example.com/path now.\n' },
  { rule: 'bare-email', pass: 'Write [a@example.com](mailto:a@example.com) or ping @ada.\n', fail: 'Write a@example.com today.\n' },
  { rule: 'footnote', pass: 'A claim.[1]\n\n[1] The note.\n', fail: 'A claim.[^1]\n\n[^1]: The note.\n' },
  { rule: 'bare-path', pass: 'See `characters/ada_vale.md`, example.com and e.g. ada_vale_profile.\n', fail: 'See characters/ada_vale.md now.\n' },
  { rule: 'obsidian-syntax', pass: 'See the page, and a == b.\n', fail: 'See [[Some Page]] and ==this==.\n' },
  { rule: 'nbsp', pass: 'Two words.\n', fail: 'Two\u00A0words.\n' },
  { rule: 'html-entity', pass: 'Salt & pepper — and a < b.\n', fail: 'A &mdash; dash.\n' },
  { rule: 'backslash-escape', pass: '| a \\| b | c |\n|---|---|\n| d | C:\\Users |\n', fail: 'A \\[bracket\\].\n' },
  { rule: 'html', pass: 'If a < b and b > c.\n\n| a | b |\n|---|---|\n| one<br>two | c |\n', fail: 'Some <b>bold</b>.\n' },
  { rule: 'line-break', pass: 'Line one\nline two.\n', fail: 'Line one<br>line two.\n' },
];

test('every rule has a case, and every case names a real rule', () => {
  const covered = new Set(CASES.map((c) => c.rule));
  covered.add('encoding'); // covered by its own buffer test below
  assert.deepEqual([...covered].sort(), Object.keys(RULES).sort());
});

for (const c of CASES) {
  test(`lint ${c.rule}: passing example is clean, failing example is flagged`, () => {
    assert.deepEqual(lintText(c.pass), [], `pass case for ${c.rule}`);
    assert.ok(rulesOf(c.fail).includes(c.rule), `fail case for ${c.rule} gave ${JSON.stringify(rulesOf(c.fail))}`);
  });
}

test('lint encoding: valid UTF-8 passes; invalid bytes and a BOM are flagged', () => {
  assert.deepEqual(lintBuffer(new TextEncoder().encode('Café.\n')), []);
  assert.deepEqual(lintBuffer(Uint8Array.from([0x54, 0xff, 0x0a])).map((f) => f.rule), ['encoding']);
  assert.deepEqual(rulesOf('\uFEFFText.\n'), ['encoding']);
});

test('lint findings carry the line number', () => {
  const f = lintText('# Title\n\nFine.\n\nSome _x_ text.\n');
  assert.deepEqual(f.map((x) => [x.line, x.rule]), [[5, 'emphasis-underscore']]);
});

test('lint skips frontmatter', () => {
  const src = '---\ntitle: _x_  \nnote: **a *b* c** <b>\n\n\n---\n\n# Title\n';
  assert.deepEqual(lintText(src), []);
});

test('lint skips fenced code contents and code spans', () => {
  const src = '```\n**a *b* c**   \n_x_ <b> &amp;\n\n\n```\n\nUse `**a *b* c**`, `_x_` and `<b>&amp;`.\n';
  assert.deepEqual(lintText(src), []);
});

test('lint lists: a second paragraph may belong to an outer item; a quote after a gap is one finding', () => {
  assert.deepEqual(rulesOf('1. Step\n   - sub\n\n   More about the step.\n'), ['list-continuation']);
  assert.deepEqual(rulesOf('1. Step\n   - sub\n   ```\n   code\n   ```\n'), []);
  assert.deepEqual(rulesOf('1. Step\n\n   > A quote.\n'), ['list-item-block']);
});

test('lint final newline and empty files', () => {
  assert.deepEqual(rulesOf(''), ['final-newline']);
  assert.deepEqual(rulesOf('\n\n'), ['final-newline']);
  assert.deepEqual(rulesOf('Text.\n\n\n'), ['final-newline']);
  assert.deepEqual(rulesOf('Text.\n  \n'), ['whitespace-only-line']);
});

test('lint emphasis nesting: in order (strikethrough, italic, bold, code) is in profile; out of order or repeated is not', () => {
  for (const ok of ['*italic with **bold** inside*.\n', '***bold first** then italic*.\n', '~~a **b** c~~ and ~~a *b* c~~.\n',
    '~~*a **b** c*~~.\n', '**bold with `code` inside** and ~~a `x` b~~.\n', '> ~~*“Do you want a **TREAT**?”* Muppy ran.~~\n']) {
    assert.deepEqual(rulesOf(ok), [], ok);
  }
  assert.deepEqual(rulesOf('**a *b* c**.\n'), ['emphasis-nested'], 'italic inside bold');
  assert.deepEqual(rulesOf('***a* b**.\n'), ['emphasis-nested'], 'italic inside bold, at its start');
  assert.deepEqual(rulesOf('> ~~*“Do you want a ***TREAT***?”* Muppy ran.~~\n'), ['emphasis-nested'], 'italic inside italic (the ring’s style guide)');
  assert.deepEqual(rulesOf('*a ~~b~~ c*.\n'), ['emphasis-strike-order']);
});

test('lint frontmatter separation: exactly one empty line between the closing --- and the body', () => {
  assert.deepEqual(rulesOf('---\ntitle: X\n---\n\nText.\n'), []);
  assert.deepEqual(rulesOf('---\ntitle: X\n---\nText.\n'), ['frontmatter-separation']);
  assert.deepEqual(rulesOf('---\ntitle: X\n---\n\n\nText.\n'), ['frontmatter-separation']);
  assert.deepEqual(rulesOf('---\ntitle: X\n---\n'), [], 'frontmatter alone has no body to separate');
});

test('non-breaking spaces: lint flags each (the rewrite table turns it into a space); --words reads it as a space', () => {
  const found = lintText('Two\u00A0words and\u00A0two.\n');
  assert.deepEqual(found.map((f) => f.rule), ['nbsp', 'nbsp']);
  assert.ok(same('Two\u00A0words.\n', 'Two words.\n'), 'nbsp → space is not a word change');
  assert.ok(!same('Two\u00A0words.\n', 'Two other words.\n'));
});

test('lint frontmatter boundary: a rule is not frontmatter; a bad close is one finding', () => {
  // A body that opens with a rule and has another later: both rules are linted as body.
  assert.deepEqual(rulesOf('---\n\nSome _x_ text.\n\n---\n'), ['emphasis-underscore']);
  assert.deepEqual(lintText('---\ntitle: X\n**a *b* c**\n'), [{ line: 1, rule: 'frontmatter-unclosed', message: 'frontmatter never closes: no closing --- line, so nothing after it was linted' }]);
  assert.deepEqual(rulesOf('---\ntitle: X\n---  \n\nText.\n'), ['frontmatter-unclosed']);
});

test('lint CommonMark paragraph continuations are not new blocks', () => {
  assert.deepEqual(rulesOf('She counted to ten.\n2. Then she left.\n'), []);
  assert.deepEqual(rulesOf('It began in\n1984. Everything changed.\n'), []);
  assert.deepEqual(rulesOf('Right\n| and left.\n'), []);
  assert.deepEqual(rulesOf('[Ada]: She waits at the dock.\n'), []);
  assert.deepEqual(rulesOf('Text.\n1. one\n'), ['block-separation']);
  assert.deepEqual(rulesOf('- a\n2. b\n'), []);
});

test('lint profile rules the first version missed', () => {
  assert.ok(rulesOf('Some *a * b* text.\n').includes('emphasis-nested'));
  assert.ok(rulesOf('See [**x** y](./x.md).\n').includes('emphasis-link'));
  for (const target of ['ftp://example.com/a', 'file:///tmp/a.md', '/abs/a.md', 'tel:5551234']) {
    assert.deepEqual(rulesOf(`See [x](${target}).\n`), ['link-target'], target);
  }
  assert.match(lintText('Call [me](tel:5551234).\n')[0].message, /only https:\/\/, http:\/\/ and mailto:/);
  assert.deepEqual(rulesOf('- [ ]\n- [x] done\n'), ['list-empty-item']);
  assert.deepEqual(rulesOf('| a | b |\n|---|---|\n| c |\n'), ['table-form']);
  assert.deepEqual(rulesOf('- a\n1. b\n'), ['block-separation']);
  assert.deepEqual(rulesOf('A.\n\n * * *\n\nB.\n'), ['leading-whitespace']);
  assert.deepEqual(rulesOf('> ```\n> - code\n> ```\n'), ['quote-content']);
  assert.deepEqual(rulesOf('Para.\n\n    ```\n    code\n    ```\n'), ['indented-code']);
});

test('lint a list under a field label with the colon inside the bold: the next label line is not a continuation', () => {
  assert.deepEqual(rulesOf('**Possible approaches:**\n\n- one\n\n**Dependencies:** Q-007\n'), []);
  assert.ok(rulesOf('**Possible approaches:**\n\n- one\n**Dependencies:** Q-007\n').includes('block-separation'));
});

test('lint a list under a field label: the next field label line is not a continuation', () => {
  assert.deepEqual(lintText('**Possible approaches**:\n\n- one\n- two\n**Dependencies**: Q-007\n').map((f) => [f.line, f.rule]), [[5, 'block-separation']]);
  assert.deepEqual(lintText('**Possible approaches**:\n- one\n').map((f) => [f.line, f.rule]), [[2, 'block-separation']]);
  assert.deepEqual(rulesOf('**Possible approaches**:\n\n- one\n- two\n\n**Dependencies**: Q-007\n'), []);
});

test('lint CRLF files report the right line numbers', () => {
  assert.deepEqual(lintText('# T\r\n\r\nSome _x_.\r\n').map((f) => [f.line, f.rule]), [[1, 'line-ending'], [3, 'emphasis-underscore']]);
});

test('lint --rule limits the run', () => {
  const src = 'Some _x_ text.   \n';
  assert.deepEqual(lintText(src, new Set(['trailing-whitespace'])).map((f) => f.rule), ['trailing-whitespace']);
});

// ---- probe files ---------------------------------------------------------

/** Split a probe file into `## P…` sections: id → body (the lines under the heading). */
function sections(file: string, heading: RegExp): Map<string, { ids: string[]; body: string; whole: string }> {
  const lines = readFileSync(file, 'utf8').split('\n');
  const out = new Map<string, { ids: string[]; body: string; whole: string }>();
  let cur: { id: string; ids: string[]; start: number } | undefined;
  const close = (end: number): void => {
    if (!cur) return;
    const chunk = lines.slice(cur.start, end);
    while (chunk.length > 0 && chunk[chunk.length - 1] === '') chunk.pop();
    out.set(cur.id, { ids: cur.ids, body: `${chunk.slice(1).join('\n')}\n`, whole: `${chunk.join('\n')}\n` });
  };
  lines.forEach((line, k) => {
    const m = heading.exec(line);
    if (!m) return;
    close(k);
    cur = { id: m[1], ids: m[2] ? m[2].split('+') : [], start: k };
  });
  close(lines.length);
  return out;
}

function verdicts(): Map<string, string> {
  const out = new Map<string, string>();
  for (const line of readFileSync(join(probeDir, 'probe-results.md'), 'utf8').split('\n')) {
    const cells = line.split('|').map((c) => c.trim());
    if (/^P[A-Z]\d\d$/.test(cells[1] ?? '') && /^[KCLSXUW]$/.test(cells[4] ?? '')) out.set(cells[1], cells[4]);
  }
  return out;
}

// Kept (K) constructs the profile still leaves out, and changed constructs a linter can't tell from in-profile text.
const K_EXCEPTIONS: Record<string, string> = {
  PI07: 'x<y: Notion keeps it, but the profile says a < is never directly followed by a letter',
};
const FLAG_EXCEPTIONS: Record<string, string> = {
  PI04: 'U: unverifiable (it is flagged as nbsp, but the verdict is not a change)',
  PK05: '#tag: indistinguishable from in-profile text like “#hashtag” (PI13, kept)',
  PK07: '^block-id: indistinguishable from in-profile text like “x^2” (PI17, kept)',
};

test('probe.md: every kept (K) section lints clean, as its own document', () => {
  const v = verdicts();
  const secs = sections(join(probeDir, 'probe.md'), /^## (P[A-Z]\d\d) /);
  assert.ok(secs.size > 200, `found ${secs.size} sections`);
  const failures: string[] = [];
  let checked = 0;
  for (const [id, s] of secs) {
    if (v.get(id) !== 'K' || K_EXCEPTIONS[id]) continue;
    checked++;
    for (const f of lintText(s.whole)) failures.push(`${id}: line ${f.line} ${f.rule} ${f.message}`);
  }
  assert.ok(checked > 110, `checked ${checked} kept sections`);
  assert.deepEqual(failures, []);
});

// The rule each changed or literal probe section must be flagged by.
const EXPECTED_RULE: Record<string, string> = Object.fromEntries(`
PA02 block-separation · PA04 blank-lines · PA05 trailing-whitespace · PA06 whitespace-only-line · PA07 block-separation
PA09 block-separation · PA11 leading-whitespace · PB05 heading-depth · PB06 heading-depth · PB07 heading-closing
PB08 heading-setext · PB09 heading-setext · PB13 heading-closing · PC02 emphasis-underscore · PC04 emphasis-underscore
PC07 emphasis-nested · PC09 emphasis-nested · PC11 emphasis-underscore
PC12 emphasis-underscore · PC21 emphasis-strike-order · PC26 emphasis-underscore
PC31 emphasis-strike-order · PC33 emphasis-nested · PD02 list-marker · PD03 list-marker · PD04 list-marker
PD06 list-indent · PD11 list-marker · PD12 list-numbering · PD14 list-marker · PD15 list-loose · PD16 list-continuation
PD17 list-continuation · PD20 todo-case · PD22 list-indent · PD26 list-empty-item · PD29 list-fence-gap
PE04 quote-marker · PE05 quote-content · PE06 quote-content · PE09 quote-content · PE10 quote-marker · PE11 quote-content
PF02 trailing-whitespace · PF03 line-break · PF04 line-break · PG02 table-form · PG03 table-form · PG05 table-form
PG08 emphasis-nested · PG10 table-form · PG12 html · PG15 table-form · PG16 html-entity · PH02 rule-form · PH03 rule-form
PH04 rule-form · PH06 rule-form · PH07 rule-form · PH08 rule-form · PI06 html-entity · PI08 html · PI09 backslash-escape
PI20 backslash-escape · PI24 html-entity · PI25 html-entity · PI26 html-entity · PI27 html-entity · PI28 html-entity
PJ02 bare-url · PJ03 bare-url · PJ04 bare-path · PJ05 link-title · PJ06 link-reference · PJ08 bare-email · PJ09 link-target
PJ11 footnote · PJ12 emphasis-link · PJ14 emphasis-link · PJ16 image-target · PJ17 image-target · PK01 obsidian-syntax
PK02 obsidian-syntax · PK03 obsidian-syntax · PK04 obsidian-syntax · PK06 obsidian-syntax · PL02 code-span-padding
PL05 fence-language · PL06 fence-form · PL07 indented-code · PL10 fence-form · PL11 fence-language · PL13 fence-language
PL15 fence-language · PL16 fence-language · PL23 fence-form · PL25 code-span-padding · PM01 html · PM02 html · PM03 html
PM04 html · PM05 html · PM06 html · PM07 html · PM08 html · PM09 html · PM10 html · PM11 html · PM12 html · PM13 html
PN02 bare-path · PN03 bare-path · PN05 bare-path · PO02 block-separation · PO04 link-target · PO15 list-under-text
`.trim().split(/\s*[·\n]\s*/).map((pair) => pair.split(' ') as [string, string]));

test('probe.md: every changed or literal (C, L, S, X, W) section is flagged by its expected rule', () => {
  const v = verdicts();
  const secs = sections(join(probeDir, 'probe.md'), /^## (P[A-Z]\d\d) /);
  const wrong: string[] = [];
  for (const [id, s] of secs) {
    const verdict = v.get(id);
    if (verdict === undefined || verdict === 'K' || FLAG_EXCEPTIONS[id]) continue;
    const want = EXPECTED_RULE[id];
    const got = [...new Set(lintText(s.whole).map((f) => f.rule))];
    if (want === undefined || !got.includes(want)) wrong.push(`${id} (${verdict}): want ${want ?? '(no expectation)'}, got ${got.join(', ') || 'nothing'}`);
  }
  assert.deepEqual(wrong, []);
});

test('probe.md: every K exception is actually flagged (so the list stays honest)', () => {
  const secs = sections(join(probeDir, 'probe.md'), /^## (P[A-Z]\d\d) /);
  for (const id of Object.keys(K_EXCEPTIONS)) {
    const s = secs.get(id);
    assert.ok(s && lintText(s.whole).length > 0, `${id} is listed as an exception but lints clean`);
  }
});

const REWRITE_HEADING = /^## (PR\d\d) ((?:P[A-Z]\d\d\+?)+) /;
// PR51 keeps <u> as written; PR57 is the candidate Notion changed (the profile uses PR58 instead).
const REWRITES_OUT_OF_PROFILE: Record<string, string> = { PR51: 'keeps <u> as written', PR57: 'failed in Notion' };

test('probe-rewrites.md: every adopted rewrite lints clean', () => {
  const secs = sections(join(probeDir, 'probe-rewrites.md'), REWRITE_HEADING);
  assert.ok(secs.size >= 60, `found ${secs.size} rewrite sections`);
  const failures: string[] = [];
  for (const [id, s] of secs) {
    if (REWRITES_OUT_OF_PROFILE[id]) continue;
    for (const f of lintText(s.whole)) failures.push(`${id}: line ${f.line} ${f.rule} ${f.message}`);
  }
  assert.deepEqual(failures, []);
});

test('--words: each rewrite has the same words as a construct it rewrites', () => {
  const probe = sections(join(probeDir, 'probe.md'), /^## (P[A-Z]\d\d) /);
  const rewrites = sections(join(probeDir, 'probe-rewrites.md'), REWRITE_HEADING);
  const mismatched: string[] = [];
  for (const [id, r] of rewrites) {
    if (id === 'PR53') continue; // the numbering alternative: moves "3." from list marker into the text
    if (id === 'PR38') continue; // rewrites only PG08's nested row; PG08's second row (***both***) is already in profile
    const want = markdownWords(r.body).join(' ');
    const matches = r.ids.some((cid) => {
      const p = probe.get(cid);
      return p !== undefined && markdownWords(p.body).join(' ') === want;
    });
    if (!matches) mismatched.push(`${id} (${r.ids.join('+')}): ${want}`);
  }
  assert.deepEqual(mismatched, []);
});

// ---- words ---------------------------------------------------------------

function tree(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'md-profile-check-'));
  for (const [rel, content] of Object.entries(files)) {
    const full = join(root, rel);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content);
  }
  return root;
}

const ORIGINAL = `---
title: The Harbor
tags: [one, two]
---

Setext title
============

Some __bold__ and _italic_ text, a **bold with *italic* inside** run, and ***a** b*.
Line one<br>line two
See https://example.com/path and someone@example.com and [Ada](ada-vale.md "Title").
Ampersand &amp; entity, &mdash; and a&nbsp;space.
A claim.[^1]

* alpha

* beta
    * nested

1) one
1) two

| Name | Role |
| :--- | ---: |
| Ada ||

<table><tr><th>Key</th></tr><tr><td>Val</td></tr></table>

>No space
lazy line

~~~js
const x = 1;
~~~

![alt text](image.png)

[^1]: The note.
`;

const NORMALIZED = `---
title: The Harbor
tags: [one, two]
---

# Setext title

Some **bold** and *italic* text, a **bold with** ***italic*** **inside** run, and ***a*** *b*.
Line one
line two
See [https://example.com/path](https://example.com/path) and [someone@example.com](mailto:someone@example.com) and [Ada](./ada-vale.md).
Ampersand & entity, — and a space.
A claim.[1]

- alpha
- beta
  - nested

1. one
2. two

| Name | Role |
|---|---|
| Ada |  |

| Key |
|---|
| Val |

> No space
> lazy line

\`\`\`javascript
const x = 1;
\`\`\`

[alt text](./image.png)

[1] The note.
`;

test('--words: identical trees compare clean', () => {
  const a = tree({ 'a.md': ORIGINAL, 'sub/b.md': 'Hello there.\n' });
  const b = tree({ 'a.md': ORIGINAL, 'sub/b.md': 'Hello there.\n' });
  try {
    const r = compareTrees(a, b);
    assert.equal(r.compared, 2);
    assert.equal(r.differing, 0);
    assert.deepEqual(r.lines, []);
  } finally { rmSync(a, { recursive: true }); rmSync(b, { recursive: true }); }
});

test('--words: a markup-only change passes, and the normalized side lints clean', () => {
  assert.deepEqual(markdownWords(ORIGINAL), markdownWords(NORMALIZED));
  assert.deepEqual(lintText(NORMALIZED), []);
  const a = tree({ 'a.md': ORIGINAL });
  const b = tree({ 'a.md': NORMALIZED });
  try {
    assert.equal(compareTrees(a, b).differing, 0);
  } finally { rmSync(a, { recursive: true }); rmSync(b, { recursive: true }); }
});

test('--words: a one-word change fails, naming the path and position', () => {
  const a = tree({ 'notes/a.md': ORIGINAL });
  const b = tree({ 'notes/a.md': NORMALIZED.replace('Ampersand & entity', 'Ampersand & entities') });
  try {
    const r = compareTrees(a, b);
    assert.equal(r.differing, 1);
    assert.match(r.lines[0], /^notes\/a\.md: words differ at word \d+/);
    assert.match(r.lines[1], /A: .*«entity,»/);
    assert.match(r.lines[2], /B: .*«entities,»/);
  } finally { rmSync(a, { recursive: true }); rmSync(b, { recursive: true }); }
});

test('--words: frontmatter values count as words', () => {
  assert.notDeepEqual(markdownWords('---\ntitle: One\n---\n\nText.\n'), markdownWords('---\ntitle: Two\n---\n\nText.\n'));
});

const same = (a: string, b: string): boolean => markdownWords(a).join(' ') === markdownWords(b).join(' ');

test('--words: changes it must catch', () => {
  assert.ok(!same('Ada met Ben.\n', 'Ben met Ada.\n'), 'word order');
  assert.ok(!same('```\none\ntwo\n```\n', '```\none\n```\n'), 'a dropped fence line');
  assert.ok(!same('| a |\n|---|\n| b |\n| c |\n', '| a |\n|---|\n| b |\n'), 'a dropped table row');
  assert.ok(!same('Use `&amp;` here.\n', 'Use `&` here.\n'), 'code-span contents are verbatim');
  assert.ok(!same('Call `__init__` now.\n', 'Call `init` now.\n'), 'code-span underscores are verbatim');
  assert.ok(!same('[D-001]: Ada is the lead.\n', '[D-001]: Ada is the star.\n'), 'a line that only looks like a reference definition');
  assert.ok(!same('It began in\n1984. Everything changed.\n', 'It began in\n1985. Everything changed.\n'), 'a number continuing a paragraph');
  assert.ok(!same('Two plus two\n+\n', 'Two plus two\n*\n'), 'a lone + or * continuing a paragraph');
  assert.ok(!same('---\nsummary: |\n  word: one\n---\n\nX.\n', '---\nsummary: |\n  word: two\n---\n\nX.\n'), 'a block scalar holding a colon');
  assert.ok(!same('---\nsummary: |\n  word: one\n---\n\nX.\n', '---\nsummary: |\n  other: one\n---\n\nX.\n'), 'a word before a colon in a block scalar');
  assert.ok(!same('| a |\n|---|\n| - |\n', '| a |\n|---|\n| -- |\n'), 'a body row of dashes');
  assert.ok(!same('A <tag> here.\n', 'A here.\n'), 'tag-like text is kept as written');
  assert.ok(!same('Some <mark>x</mark> and <sup>2</sup>.\n', 'Some x and 2.\n'), 'kept-as-written HTML');
  assert.ok(!same('It is 5 * 3.\n', 'It is 5 3.\n'), 'a literal spaced star');
  assert.ok(!same('---\ntitle: X\nBody text.\n', '---\ntitle: X\nBody words.\n'), 'a malformed (unclosed) frontmatter still counts');
  assert.ok(!same('---\n\nNote: the harbor.\n\n---\n', '---\n\nNotes: the harbor.\n\n---\n'), 'a rule mistaken for frontmatter');
});

test('--words: correct rewrites it must accept', () => {
  assert.ok(same('Para.\n\n    a **b** _c_\n', 'Para.\n\n```\na **b** _c_\n```\n'), 'PR50: an indented code block is verbatim, like its fence');
  assert.ok(same('| `a|b` | c |\n|---|---|\n', '| `a\\|b` | c |\n|---|---|\n'), 'a pipe in a code span in a cell');
  assert.ok(same('See [x](./my file.md).\n', 'See [x](./my%20file.md).\n'), 'an encoded link target');
  assert.ok(same('**Possible approaches**:\n- one\n**Dependencies**: Q-007\n', '**Possible approaches**:\n\n- one\n\n**Dependencies**: Q-007\n'), 'the field-label row');
  assert.ok(same('Text.', 'Text.\n'), 'the final-newline row');
  assert.ok(same('Text.\n\n\n', 'Text.\n'), 'the final-newline row, extra empty lines');
});

// The mini round trip's HTML table (Story_Primer.md), trimmed to two rows.
const HTML_TABLE = '<table style="min-width: 50px;"><colgroup><col style="min-width: 25px;"><col style="min-width: 25px;"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p>Segment</p></th><th colspan="1" rowspan="1"><p>Novel Share</p></th></tr><tr><td colspan="1" rowspan="1"><p>Act 1 (~6 chapters)</p></td><td colspan="1" rowspan="1"><p>25%</p></td></tr></tbody></table>\n';

test('--words: an HTML table and its pipe-table rewrite have the same words (structure tags stripped)', () => {
  assert.ok(same(HTML_TABLE, '| Segment | Novel Share |\n|---|---|\n| Act 1 (~6 chapters) | 25% |\n'));
  assert.ok(!same(HTML_TABLE, '| Segment | Novel Share |\n|---|---|\n| Act 2 (~6 chapters) | 25% |\n'), 'a changed cell still differs');
  assert.ok(!same('Some <p>kept</p> text.\n', 'Some kept text.\n'), 'a <p> outside an HTML table is kept as written');
});

const FILE_ROW = '| The_Good_Dog_-_Brainstorming_&amp;_Future_Plot_Points.md | `notes/brainstorming.md` |\n|---|---|\n';

test('bare filenames are kept as written: no emphasis or link rewrite applies inside one, in lint or --words', () => {
  // The mini round trip's rewrite of `_x_` inside a filename is a word change.
  assert.ok(!same(FILE_ROW, FILE_ROW.replace('-_Brainstorming_&amp;_', '-*Brainstorming*&_')));
  // The entity row still applies inside one (Notion decodes it anyway), so decoding it is not.
  assert.ok(same(FILE_ROW, FILE_ROW.replace('&amp;', '&')));
  assert.ok(!same('See Miles_Corwin_-_Character_Profile_(Investigative_Journalist).md now.\n', 'See Miles_Corwin_-*Character_Profile*(Investigative_Journalist).md now.\n'));
  // Lint sees one bare path and its entity, not underscore emphasis.
  assert.deepEqual(rulesOf(FILE_ROW).sort(), ['bare-path', 'html-entity']);
  assert.deepEqual(rulesOf('See Miles_Corwin_-_Character_Profile_(Investigative_Journalist).md now.\n'), ['bare-path']);
  // Emphasis around a filename is still emphasis, and its rewrite still passes.
  assert.deepEqual(rulesOf('See _Story_Primer.md_ now.\n'), ['emphasis-underscore', 'bare-path']);
  assert.ok(same('See _Story_Primer.md_ now.\n', 'See *Story_Primer.md* now.\n'));
  assert.ok(same('See (notes_a.md), then **b_c.md**.\n', 'See (notes_a.md), then **b_c.md**.\n'));
  // A URL inside a run is not a filename token: the bare-URL rule still applies.
  assert.ok(rulesOf('See https://example.com/a_b.md now.\n').includes('bare-url'));
  // Commas and symbols end a token; a doubled leading underscore keeps the token.
  assert.equal(rulesOf('See a_b.md,c_d.md now.\n').filter((r) => r === 'bare-path').length, 2);
  assert.equal(rulesOf('See x.md→y.md now.\n').filter((r) => r === 'bare-path').length, 2);
  assert.ok(rulesOf('See __notes.md_ now.\n').includes('bare-path'));
  // `&`, `(` and a matched `)` stay inside a token; an unmatched `)` ends it (`Chapter 1 (Opus 4).docx` has spaces: no token).
  assert.deepEqual(rulesOf('See Chapter 1 (Opus 4).docx now.\n'), []);
  assert.deepEqual(rulesOf('See Q&A_(draft).md now.\n'), ['bare-path']);
  // Link targets, tags and wikilinks are not tokens in --words either.
  assert.ok(same('See [x](./a_b.md) now.\n', 'See [x](./a*b.md) now.\n'), 'a link target is dropped, not compared');
  assert.ok(!same('See [[Page_one_.md]] now.\n', 'See [[Page*one*.md]] now.\n'), 'a wikilink is kept as written');
});

test('--words: an HTML table indented after an empty line is a table, not indented code', () => {
  const indented = `Para.\n\n    ${HTML_TABLE}`;
  assert.ok(same(indented, 'Para.\n\n| Segment | Novel Share |\n|---|---|\n| Act 1 (~6 chapters) | 25% |\n'));
  assert.ok(!rulesOf(indented).includes('indented-code'));
});

test('--words and lint never crash on symlinks: dangling and looping links are skipped', () => {
  const a = tree({ 'a.md': 'Same.\n', 'sub/b.md': 'B.\n' });
  const b = tree({ 'a.md': 'Same.\n', 'sub/b.md': 'B.\n' });
  try {
    symlinkSync(join(a, 'missing.md'), join(a, 'dangling.md'));
    symlinkSync(a, join(a, 'sub', 'up'));
    symlinkSync(join(a, 'a.md'), join(b, 'link.md'));
    const r = compareTrees(a, b);
    assert.equal(r.compared, 2);
    assert.equal(r.differing, 0);
    assert.deepEqual([...r.onlyA, ...r.onlyB], []);
    const lint = run(a);
    assert.equal(lint.status, 0);
    assert.equal(lint.stdout, '0 findings in 0 of 2 files\n');
  } finally { rmSync(a, { recursive: true }); rmSync(b, { recursive: true }); }
});

test('--words: paths match across NFC and NFD spellings', () => {
  const nfc = 'café.md';
  const nfd = 'café.md';
  const a = tree({ [nfc]: 'Same.\n' });
  const b = tree({ [nfd]: 'Same.\n' });
  try {
    const r = compareTrees(a, b);
    assert.equal(r.compared, 1);
    assert.deepEqual([...r.onlyA, ...r.onlyB], []);
  } finally { rmSync(a, { recursive: true }); rmSync(b, { recursive: true }); }
});

test('--words: a path missing from one side is reported; --ignore skips paths', () => {
  const a = tree({ 'a.md': 'Same.\n', 'only-a.md': 'X.\n', 'x/_index.md': 'One.\n', 'b.docx': 'not markdown' });
  const b = tree({ 'a.md': 'Same.\n', 'x/_index.md': 'Two.\n' });
  try {
    const r = compareTrees(a, b);
    assert.deepEqual(r.onlyA, ['only-a.md']);
    assert.deepEqual(r.onlyB, []);
    assert.equal(r.differing, 1);
    const ignored = compareTrees(a, b, ['**/_index.md', 'only-a.md']);
    assert.equal(ignored.differing, 0);
    assert.deepEqual(ignored.onlyA, []);
  } finally { rmSync(a, { recursive: true }); rmSync(b, { recursive: true }); }
});

test('globToRegExp handles *, ** and ?', () => {
  assert.ok(globToRegExp('**/_index.md').test('_index.md'));
  assert.ok(globToRegExp('**/_index.md').test('a/b/_index.md'));
  assert.ok(!globToRegExp('*.md').test('a/b.md'));
  assert.ok(globToRegExp('ch??/*.md').test('ch01/x.md'));
});

// ---- CLI -----------------------------------------------------------------

const tool = join(here, 'md-profile-check.ts');
const run = (...args: string[]): { status: number | null; stdout: string; stderr: string } => {
  const r = spawnSync(process.execPath, [tool, ...args], { encoding: 'utf8' });
  return { status: r.status, stdout: r.stdout, stderr: r.stderr };
};

test('CLI lint: prints path:line: rule message, a summary, and exits 1 on findings', () => {
  const root = tree({ 'good.md': '# Good\n\nFine.\n', 'sub/bad.md': '# Bad\n\nSome _x_ text.\n', 'skip.docx': 'binary' });
  try {
    const r = run(root);
    assert.equal(r.status, 1);
    assert.equal(r.stderr, '');
    const lines = r.stdout.trimEnd().split('\n');
    assert.deepEqual(lines, [`${join(root, 'sub/bad.md')}:3: emphasis-underscore underscore emphasis; use asterisks`, '1 finding in 1 of 2 files']);
    const clean = run(join(root, 'good.md'));
    assert.equal(clean.status, 0);
    assert.equal(clean.stdout, '0 findings in 0 of 1 file\n');
    const limited = run('--rule', 'trailing-whitespace', root);
    assert.equal(limited.status, 0);
  } finally { rmSync(root, { recursive: true }); }
});

test('CLI words: exits 1 on a difference and 0 when the words match', () => {
  const a = tree({ 'a.md': ORIGINAL });
  const b = tree({ 'a.md': NORMALIZED });
  const c = tree({ 'a.md': `${NORMALIZED}Extra.\n` });
  try {
    const same = run('--words', a, b);
    assert.equal(same.status, 0);
    assert.equal(same.stdout, '1 path compared: 0 differ, 0 in only one tree\n');
    const diff = run('--words', a, c);
    assert.equal(diff.status, 1);
    assert.match(diff.stdout, /^a\.md: words differ at word/);
  } finally { rmSync(a, { recursive: true }); rmSync(b, { recursive: true }); rmSync(c, { recursive: true }); }
});

test('CLI lint: .MD files count, --ignore applies, a lone non-.md file is reported and exits 2', () => {
  const root = tree({ 'UPPER.MD': 'Some _x_ text.\n', 'skip/_index.md': 'Some _y_ text.\n', 'notes.txt': 'x' });
  try {
    const all = run(root);
    assert.equal(all.status, 1);
    assert.match(all.stdout, /2 findings in 2 of 2 files\n$/);
    const ignored = run('--ignore', '**/_index.md', root);
    assert.match(ignored.stdout, /UPPER\.MD:1: emphasis-underscore/);
    assert.match(ignored.stdout, /1 finding in 1 of 1 file\n$/);
    const txt = run(join(root, 'notes.txt'));
    assert.equal(txt.status, 2);
    assert.equal(txt.stderr, `skipped ${join(root, 'notes.txt')}: not a .md file\nnothing to check: no .md files\n`);
  } finally { rmSync(root, { recursive: true }); }
});

test('CLI: --help prints usage; bad input exits 2 with a message', () => {
  const out: string[] = [];
  const err: string[] = [];
  assert.equal(main(['--help'], (s) => out.push(s), (s) => err.push(s)), 0);
  assert.match(out.join('\n'), /Usage:/);
  assert.match(out.join('\n'), /emphasis-nested: /);
  assert.equal(main(['--rule', 'no-such-rule', '.'], (s) => out.push(s), (s) => err.push(s)), 2);
  assert.equal(main(['--rule=', '.'], (s) => out.push(s), (s) => err.push(s)), 2);
  assert.equal(main(['--words', 'only-one'], (s) => out.push(s), (s) => err.push(s)), 2);
  assert.equal(main(['/no/such/path.md'], (s) => out.push(s), (s) => err.push(s)), 2);
  assert.equal(main([], (s) => out.push(s), (s) => err.push(s)), 2);
  assert.deepEqual(err.map((e) => e.split('\n')[0]), [
    'unknown rule id: no-such-rule; see --help',
    '--rule needs a rule id; see --help',
    '--words takes exactly two directories',
    'no such file or directory: /no/such/path.md',
    'md-profile-check: lint markdown against references/markdown-profile.md, or compare the words of two trees.',
  ]);
});
