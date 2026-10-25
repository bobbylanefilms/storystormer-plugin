<!-- ABOUTME: Developer tools for this repo; dev-only, never cited by a skill or command -->
<!-- ABOUTME: Explains md-profile-check (the markdown-profile linter and words comparer), upgrade-check (the layout upgrade’s fidelity check), and their tests -->

# Tools

Dev-only tools for working on the plugin. No skill or command cites them, and the plugin never runs them: at runtime the plugin has no Bash dependency. They need Node 24 or later (it runs TypeScript directly) and nothing else.

## md-profile-check

Checks markdown against `references/markdown-profile.md`.

**Lint:** checks every `.md` file under the paths given, printing `path:line: <rule-id> <message>` per finding and a count; exits 1 when there are findings. Each rule id names the profile line that explains it (`--help` lists them). `--rule <id>[,<id>]` limits the run.

```bash
node tools/md-profile-check.ts path/to/story-folder
```

**Words:** compares two trees, path by path, with markup stripped, and reports where the word sequences first differ and which paths are in only one tree; exits 1 on any difference. It is how a normalization or a round trip is checked for keeping every word. `--ignore <glob>` skips paths.

```bash
node tools/md-profile-check.ts --words before/ after/ --ignore '**/_index.md'
```

What the comparison can't see, by design: frontmatter keys (only values count as words, so a renamed key compares equal) and anything that is only markup. Code contents, in fences, indented blocks and code spans, compare verbatim.

Both modes walk directories skipping `.git`, `node_modules` and symlinks (a link is never followed, so a dangling or looping one can’t stop a run). Paths are matched after Unicode NFC normalization, so a file named in NFD on one side still pairs with its NFC twin.

## upgrade-check

Checks `migrate`’s layout upgrade (`skills/migrate/SKILL.md` § Converting the old layout) after the fact: compares an old-layout log with the entry folder it became.

```bash
node tools/upgrade-check.ts snapshot/decisions.md project/decisions/
node tools/upgrade-check.ts snapshot/questions.md project/questions/
```

The old log is the snapshot copy once the upgrade has removed it from the root (`.storystormer/history/<timestamp>-layout-upgrade/`). It prints `path: <rule> <message>` per finding and a one-line summary; exits 1 when there are findings, 2 on bad arguments.

- **`count`, `missing-entry`, `extra-entry`, `duplicate-id`:** the folder holds one `D-###.md` or `Q-###.md` per `## D-###` or `## Q-###` heading in the log, at the same number, and nothing else.
- **`entry`:** each entry’s `id` matches its file, it carries `storystormer_project` and the right `storystormer_kind`, and it keeps every word of its old entry. Words are compared as a multiset, with markup stripped as `--words` strips it, so moving a field into the frontmatter or reflowing a list doesn’t count. Allowed: a field label whose line moved into the frontmatter (`Topic`, `Integrated into treatment`) may be missing; words that `status`, `resolved_by`, `superseded_by`, `integrated` or `retracted` restate from a body line the entry keeps may appear twice (and stand in for the header’s ` ✅ RESOLVED`, case aside); a composed `title` (a question whose old entry had no `**Title**:`) may add words, but only the question’s own. Tokens with no letter or digit (`·`, `—`, `✅`) aren’t words here.
- **`index`:** `_index.md` exists and lists every entry once, sorted by ID numerically.

What it can’t see, by design: the log’s frontmatter, heading and preamble (the summary counts their words, since no entry carries them), the journal and `state.md` (the history the upgrade moves is judgment, not a split), and whether a kept line says the same as its key.

## Tests

Both tools’ tests: `node --test 'tools/*.test.ts'`. (`node --test tools/` doesn’t work on Node 24: a directory argument is read as a module, not searched.) `tools/package.json` only marks the folder as ES modules, so `tsc` type-checks it the way Node runs it.
