// ABOUTME: Tests for tools/upgrade-check.ts: a faithful upgrade passes clean, and each way an upgrade can lose or
// ABOUTME: invent words, entries, IDs or index rows is caught; fixtures are inline, shaped like real old-layout logs.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { checkUpgrade, compareEntry, indexIds, main, parseFrontmatter, parseLog } from './upgrade-check.ts';

const here = dirname(fileURLToPath(import.meta.url));

const DECISIONS_LOG = `---
version: 3
count: 3
---

# Decision Log

Append-only. Entries are never deleted, only superseded.

---

## D-001 · 2026-08-15 · premise
**Topic**: Core premise
**Summary**: A courier who reads maps by smell crosses a city that keeps rearranging itself.
**Affects**: everything
**Source**: intake
**Integrated into treatment**: yes

## D-002 · 2026-08-15 · voice
**Topic**: The narrator's register
**Summary**: Close third, past tense. Nothing the courier can't perceive is narrated.
**Details**: Supersedes the first-person draft.

**Why it works.** The reader gets the city as she does: *late*, and in pieces.
**Resolves**: Q-003
**Affects**: all prose
**Source**: user-declared (init session)
**Integrated into treatment**: yes — *Beats Awaiting Placement*

## D-004 · 2026-08-16 · process
**Topic**: Outline before prose
**Summary**: No chapter is drafted before its outline exists.
**Affects**: the chapter loop
**Source**: user-declared
`;

const D001 = `---
id: D-001
date: 2026-08-15
type: premise
topic: Core premise
source: intake
integrated: "yes"
storystormer_project: the-mapless-city
storystormer_kind: decision
---

**Summary**: A courier who reads maps by smell crosses a city that keeps rearranging itself.
**Affects**: everything
`;

const D002 = `---
id: D-002
date: 2026-08-15
type: voice
topic: The narrator's register
source: user-declared (init session)
integrated: "yes — *Beats Awaiting Placement*"
storystormer_project: the-mapless-city
storystormer_kind: decision
---

**Summary**: Close third, past tense. Nothing the courier can't perceive is narrated.
**Details**: Supersedes the first-person draft.

**Why it works.** The reader gets the city as she does: *late*, and in pieces.
**Resolves**: Q-003
**Affects**: all prose
`;

const D004 = `---
id: D-004
date: 2026-08-16
type: process
topic: Outline before prose
source: user-declared
storystormer_project: the-mapless-city
storystormer_kind: decision
---

**Summary**: No chapter is drafted before its outline exists.
**Affects**: the chapter loop
`;

const DECISIONS_INDEX = `# Decisions

| ID | Date | Type | Topic | Integrated | Superseded by |
|---|---|---|---|---|---|
| [D-001](./D-001.md) | 2026-08-15 | premise | Core premise | yes |  |
| [D-002](./D-002.md) | 2026-08-15 | voice | The narrator's register | yes |  |
| [D-004](./D-004.md) | 2026-08-16 | process | Outline before prose |  |  |
`;

const QUESTIONS_LOG = `# Open Questions

## Q-001 · critical · plot
**Question**: How does the courier learn the city moves at night?
**Why it matters**: Act 1 turns on it.
**Possible approaches**:
  - She wakes somewhere she didn't sleep.
  - A **rival** tells her, and lies about why.
**Dependencies**: Q-002, D-001
**Status**: open

## Q-002 · important · structure ✅ RESOLVED
**Question**: Where does the midpoint fall?
**Status**: **resolved (D-004)** — at the bridge. Everything after it is pursuit.

*Original reasoning retained below.*

**Question**: Where does the midpoint fall?
**Status**: open
`;

const Q001 = `---
id: Q-001
priority: critical
category: plot
title: How does the courier learn
status: open
storystormer_project: the-mapless-city
storystormer_kind: question
---

**Question**: How does the courier learn the city moves at night?
**Why it matters**: Act 1 turns on it.
**Possible approaches**:

- She wakes somewhere she didn't sleep.
- A **rival** tells her, and lies about why.

**Dependencies**: Q-002, D-001
`;

const Q002 = `---
id: Q-002
priority: important
category: structure
title: Where does the midpoint fall
status: resolved
resolved_by: D-004
storystormer_project: the-mapless-city
storystormer_kind: question
---

**Question**: Where does the midpoint fall?
**Status**: **resolved (D-004)** — at the bridge. Everything after it is pursuit.

*Original reasoning retained below.*

**Question**: Where does the midpoint fall?
**Status**: open
`;

const QUESTIONS_INDEX = `# Questions

| ID | Priority | Category | Title | Status | Resolved by |
|---|---|---|---|---|---|
| [Q-001](./Q-001.md) | critical | plot | How does the courier learn | open |  |
| [Q-002](./Q-002.md) | important | structure | Where does the midpoint fall | resolved | [D-004](../decisions/D-004.md) |
`;

/** Build a scratch project: the old log beside an entry folder holding the given files. */
function scratch(log: string, folder: string, files: Record<string, string>): { root: string; log: string; folder: string } {
  const root = mkdtempSync(join(tmpdir(), 'upgrade-check-'));
  const logPath = join(root, `${folder}.md`);
  writeFileSync(logPath, log);
  mkdirSync(join(root, folder));
  for (const [name, text] of Object.entries(files)) writeFileSync(join(root, folder, name), text);
  return { root, log: logPath, folder: join(root, folder) };
}

const decisions = (over: Record<string, string | null> = {}): Record<string, string> => {
  const files: Record<string, string | null> = { 'D-001.md': D001, 'D-002.md': D002, 'D-004.md': D004, '_index.md': DECISIONS_INDEX, ...over };
  return Object.fromEntries(Object.entries(files).filter((e): e is [string, string] => e[1] !== null));
};
const questions = (over: Record<string, string | null> = {}): Record<string, string> => {
  const files: Record<string, string | null> = { 'Q-001.md': Q001, 'Q-002.md': Q002, '_index.md': QUESTIONS_INDEX, ...over };
  return Object.fromEntries(Object.entries(files).filter((e): e is [string, string] => e[1] !== null));
};

/** Run checkUpgrade on a scratch project and return its findings as `rule message` lines. */
function run(log: string, folder: 'decisions' | 'questions', files: Record<string, string>): string[] {
  const s = scratch(log, folder, files);
  try {
    return checkUpgrade(s.log, s.folder).findings.map((f) => `${f.rule} ${f.message}`);
  } finally {
    rmSync(s.root, { recursive: true, force: true });
  }
}

test('parseLog splits entries at their headings and keeps the preamble apart', () => {
  const { entries, preamble: outside, strays } = parseLog(DECISIONS_LOG);
  assert.deepEqual(strays, []);
  assert.deepEqual(entries.map((e) => e.id), ['D-001', 'D-002', 'D-004']);
  assert.equal(entries[0].header, 'D-001 · 2026-08-15 · premise');
  assert.match(outside, /Append-only/);
  assert.doesNotMatch(entries[2].body, /Decision Log/);
});

test('parseLog ends an entry at a non-entry heading and ignores headings inside fences', () => {
  const src = '## D-001 · 2026-01-01 · plot\n**Topic**: A\n```\n## D-009 · not an entry\n```\n\n## Appendix\n\nLoose text.\n';
  const { entries, preamble, strays } = parseLog(src);
  assert.deepEqual(entries.map((e) => e.id), ['D-001']);
  assert.match(entries[0].body, /D-009/);
  assert.equal(preamble, '');
  assert.deepEqual(strays.map((x) => x.heading), ['## Appendix']);
  assert.match(strays[0].text, /Loose text/);
});

test('text under a non-entry heading after the first entry is a finding; the preamble is only counted', () => {
  const log = DECISIONS_LOG.replace('## D-004 ·', '## Superseded notes\n\nThe earlier ending is gone.\n\n## D-004 ·');
  assert.deepEqual(run(log, 'decisions', decisions()), ['outside-entry 7 words under “## Superseded notes”, after the first entry, in no entry']);
  // An empty non-entry heading carries no words, so nothing is lost.
  assert.deepEqual(run(DECISIONS_LOG.replace('## D-004 ·', '---\n\n## D-004 ·'), 'decisions', decisions()), []);
});

test('parseFrontmatter reads scalars, quoted values, flow lists and block lists', () => {
  const f = parseFrontmatter(['id: D-024', 'integrated: "yes — *Beats*"', 'decisions: [D-017, D-018]', 'integrated_books:', '  - book-1 treatment yes', "topic: 'It''s late'"]);
  assert.deepEqual(f.map((x) => [x.key, x.values]), [
    ['id', ['D-024']],
    ['integrated', ['yes — *Beats*']],
    ['decisions', ['D-017', 'D-018']],
    ['integrated_books', ['book-1 treatment yes']],
    ['topic', ["It's late"]],
  ]);
});

test('a faithful upgrade of both logs passes clean', () => {
  assert.deepEqual(run(DECISIONS_LOG, 'decisions', decisions()), []);
  assert.deepEqual(run(QUESTIONS_LOG, 'questions', questions()), []);
});

test('a dropped body sentence is a missing-words finding', () => {
  const lossy = D002.replace(' Nothing the courier can\'t perceive is narrated.', '');
  const out = run(DECISIONS_LOG, 'decisions', decisions({ 'D-002.md': lossy }));
  assert.equal(out.length, 1);
  assert.match(out[0], /^entry words missing: /);
  for (const w of ['Nothing', 'courier', 'perceive', 'narrated.']) assert.ok(out[0].includes(w), w);
});

test('a frontmatter value that lost words is caught, and its moved label is not', () => {
  const out = run(DECISIONS_LOG, 'decisions', decisions({ 'D-002.md': D002.replace('source: user-declared (init session)', 'source: user-declared') }));
  assert.deepEqual(out, ['entry words missing: (init session)']);
});

test('a field kept in the body and also copied to the frontmatter is added words', () => {
  const doubled = D004.replace('**Affects**: the chapter loop\n', '**Affects**: the chapter loop\n**Source**: user-declared\n');
  const out = run(DECISIONS_LOG, 'decisions', decisions({ 'D-004.md': doubled }));
  assert.deepEqual(out, ['entry words added: user-declared']);
});

test('words the entry never had are added words', () => {
  const out = run(DECISIONS_LOG, 'decisions', decisions({ 'D-001.md': D001.replace('**Affects**: everything', '**Affects**: everything and the ending') }));
  assert.deepEqual(out, ['entry words added: and the ending']);
});

test('a status suffix restated by status, and a status line kept beside status and resolved_by, are allowed', () => {
  // Q002 keeps both status lines and drops the header's ✅ RESOLVED into status: resolved.
  assert.deepEqual(run(QUESTIONS_LOG, 'questions', questions()), []);
  // Without status the suffix's word is lost.
  const out = run(QUESTIONS_LOG, 'questions', questions({ 'Q-002.md': Q002.replace('status: resolved\n', '') }));
  assert.deepEqual(out, ['entry words missing: RESOLVED']);
});

test('a restating field invented with no source in the old entry is added words', () => {
  // status: resolved on a question whose log says open.
  const resolved = run(QUESTIONS_LOG, 'questions', questions({ 'Q-001.md': Q001.replace('status: open', 'status: resolved\nresolved_by: D-004') }));
  assert.deepEqual(resolved, ['entry words added (not in the old entry): status: resolved, resolved_by: D-004', 'entry words missing: open']);
  // superseded_by invented on a decision that names no later one.
  const superseded = run(DECISIONS_LOG, 'decisions', decisions({ 'D-001.md': D001.replace('integrated: "yes"', 'integrated: "yes"\nsuperseded_by: D-009') }));
  assert.deepEqual(superseded, ['entry words added (not in the old entry): superseded_by: D-009']);
  // integrated: "yes" on a decision whose log has no integration line.
  const integrated = run(DECISIONS_LOG, 'decisions', decisions({ 'D-004.md': D004.replace('source: user-declared', 'source: user-declared\nintegrated: "yes"') }));
  assert.deepEqual(integrated, ['entry words added (not in the old entry): integrated: yes']);
  // resolved_by naming a decision the entry never cites.
  const by = run(QUESTIONS_LOG, 'questions', questions({ 'Q-002.md': Q002.replace('resolved_by: D-004', 'resolved_by: D-007') }));
  assert.deepEqual(by, ['entry words added (not in the old entry): resolved_by: D-007']);
});

test('status: open is composed only for a question that recorded no status', () => {
  const log = QUESTIONS_LOG.replace('**Dependencies**: Q-002, D-001\n**Status**: open\n', '**Dependencies**: Q-002, D-001\n');
  assert.deepEqual(run(log, 'questions', questions()), []);
  const suffixed = log.replace('## Q-001 · critical · plot', '## Q-001 · critical · plot ✅ RESOLVED');
  assert.deepEqual(run(suffixed, 'questions', questions()), ['entry words added (not in the old entry): status: open', 'entry words missing: RESOLVED']);
});

test('a composed title must use the question’s own words', () => {
  const out = run(QUESTIONS_LOG, 'questions', questions({ 'Q-001.md': Q001.replace('title: How does the courier learn', 'title: The courier discovers the shift') }));
  assert.deepEqual(out, ['entry composed title uses words the question doesn’t: discovers shift']);
  const none = run(QUESTIONS_LOG, 'questions', questions({ 'Q-001.md': Q001.replace('title: How does the courier learn\n', '') }));
  assert.deepEqual(none, ['entry title is missing (the old entry has none, so the upgrade composes one)']);
});

test('a title the old entry gave is compared like any other field', () => {
  const log = QUESTIONS_LOG.replace('**Question**: How does the courier learn', '**Title**: The night shift\n**Question**: How does the courier learn');
  const q = Q001.replace('title: How does the courier learn', 'title: The night shift');
  assert.deepEqual(run(log, 'questions', questions({ 'Q-001.md': q })), []);
  const changed = Q001.replace('title: How does the courier learn', 'title: The night shift and more');
  assert.deepEqual(run(log, 'questions', questions({ 'Q-001.md': changed })), ['entry words added: and more']);
});

test('the entry count, a missing entry and an extra entry are each findings', () => {
  const out = run(DECISIONS_LOG, 'decisions', decisions({ 'D-004.md': null, 'D-005.md': D004.replace('id: D-004', 'id: D-005') }));
  assert.ok(out.includes('missing-entry D-004 has no D-004.md'), out.join('\n'));
  assert.ok(out.includes('extra-entry D-005 isn\'t headed in the log'), out.join('\n'));
  assert.ok(out.includes('index row for D-004, which has no entry file'), out.join('\n'));
  assert.ok(out.includes('index no row for D-005'), out.join('\n'));
  const fewer = run(DECISIONS_LOG, 'decisions', decisions({ 'D-004.md': null }));
  assert.ok(fewer.includes('count 2 entry files, but the log heads 3 entries'), fewer.join('\n'));
});

test('an id that disagrees with its file, and missing storystormer fields, are findings (the id’s word moves too)', () => {
  const bad = D001.replace('id: D-001', 'id: D-010').replace('storystormer_project: the-mapless-city\n', '').replace('storystormer_kind: decision', 'storystormer_kind: question');
  const out = run(DECISIONS_LOG, 'decisions', decisions({ 'D-001.md': bad }));
  assert.deepEqual(out, [
    'entry id is D-010, expected D-001',
    'entry storystormer_kind is question, expected decision',
    'entry storystormer_project is missing',
    'entry words added: D-010',
    'entry words missing: D-001',
  ]);
});

test('a duplicate ID in the log is a finding and its entries are not compared', () => {
  const log = `${DECISIONS_LOG}\n## D-004 · 2026-08-17 · plot\n**Topic**: A second D-004\n**Summary**: Written by a second session.\n`;
  const out = run(log, 'decisions', decisions());
  assert.ok(out.includes('duplicate-id D-004 heads 2 entries; one file can\'t hold them'), out.join('\n'));
  assert.ok(!out.some((l) => l.startsWith('entry ')), out.join('\n'));
});

test('the index must exist, list every entry once, and sort numerically', () => {
  assert.deepEqual(run(DECISIONS_LOG, 'decisions', decisions({ '_index.md': null })), ['index missing']);
  const twice = DECISIONS_INDEX.replace('| [D-004]', '| [D-002](./D-002.md) | 2026-08-15 | voice | again | yes |  |\n| [D-004]');
  assert.deepEqual(run(DECISIONS_LOG, 'decisions', decisions({ '_index.md': twice })), ['index 2 rows for D-002']);
  const swapped = DECISIONS_INDEX.replace(/(\| \[D-001\][^\n]*\n)(\| \[D-002\][^\n]*\n)/, '$2$1');
  assert.deepEqual(run(DECISIONS_LOG, 'decisions', decisions({ '_index.md': swapped })), ['index rows aren’t sorted by ID numerically']);
});

test('indexIds reads the first cell of each row, past the header and separator', () => {
  assert.deepEqual(indexIds(DECISIONS_INDEX), ['D-001', 'D-002', 'D-004']);
  assert.deepEqual(indexIds('| ID | Title |\n|---|---|\n| Q-1000 | big |\n| [Q-999](./Q-999.md) | small |\n'), ['Q-1000', 'Q-999']);
});

test('compareEntry reports an entry with no frontmatter', () => {
  const [entry] = parseLog(DECISIONS_LOG).entries;
  assert.deepEqual(compareEntry(entry, 'D', '**Summary**: no frontmatter here.\n'), ['no frontmatter']);
});

test('an empty log means an empty folder and an index with no rows', () => {
  const empty = '---\ncount: 0\n---\n\n# Decisions\n\nNothing yet.\n';
  const header = '# Decisions\n\n| ID | Date | Type | Topic | Integrated | Superseded by |\n|---|---|---|---|---|---|\n';
  assert.deepEqual(run(empty, 'decisions', { '_index.md': header }), []);
  assert.deepEqual(run(empty, 'decisions', {}), ['index missing']);
  const stray = run(empty, 'decisions', { '_index.md': DECISIONS_INDEX, 'D-001.md': D001 });
  assert.ok(stray.includes('count 1 entry file, but the log heads 0 entries'), stray.join('\n'));
  assert.ok(stray.includes('extra-entry D-001 isn\'t headed in the log'), stray.join('\n'));
  assert.ok(stray.includes('index row for D-002, which has no entry file'), stray.join('\n'));
  // A questions log with no entries is known by its heading.
  const q = run('# Open Questions\n', 'questions', { '_index.md': '# Questions\n', 'D-001.md': D001 });
  assert.ok(q.includes('kind a decision file in a question folder'), q.join('\n'));
});

test('a log with both kinds is a log finding', () => {
  assert.deepEqual(run(`${DECISIONS_LOG}\n${QUESTIONS_LOG}`, 'decisions', decisions()), ['log holds both decision and question entries']);
});

test('main prints a clean summary and exits 0 on a faithful upgrade, 1 on findings, 2 on bad arguments', () => {
  const s = scratch(DECISIONS_LOG, 'decisions', decisions());
  try {
    const out: string[] = [];
    const err: string[] = [];
    assert.equal(main([s.log, s.folder], (l) => out.push(l), (l) => err.push(l)), 0);
    assert.deepEqual(out, ['decisions.md → decisions/: 3 entries in the log, 3 files; 0 findings (11 words of preamble, not carried)']);
    assert.deepEqual(err, []);
    writeFileSync(join(s.folder, 'D-001.md'), D001.replace('everything', 'nothing'));
    const out2: string[] = [];
    assert.equal(main([s.log, s.folder], (l) => out2.push(l), () => {}), 1);
    assert.equal(out2.length, 3);
    assert.match(out2[0], /D-001\.md: entry words added: nothing$/);
    assert.match(out2[1], /D-001\.md: entry words missing: everything$/);
    assert.match(out2[2], /; 2 findings /);
    const err3: string[] = [];
    assert.equal(main([s.log], () => {}, (l) => err3.push(l)), 2);
    assert.equal(main([s.folder, s.log], () => {}, (l) => err3.push(l)), 2);
    assert.equal(main(['--bogus', s.log, s.folder], () => {}, (l) => err3.push(l)), 2);
    assert.match(err3.at(-1) ?? '', /unknown option --bogus/);
  } finally {
    rmSync(s.root, { recursive: true, force: true });
  }
});

test('the CLI runs under node with clean output', () => {
  const s = scratch(QUESTIONS_LOG, 'questions', questions());
  try {
    const r = spawnSync(process.execPath, [join(here, 'upgrade-check.ts'), s.log, s.folder], { encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
    assert.equal(r.stderr, '');
    assert.equal(r.stdout, 'questions.md → questions/: 2 entries in the log, 2 files; 0 findings (2 words of preamble, not carried)\n');
  } finally {
    rmSync(s.root, { recursive: true, force: true });
  }
});
