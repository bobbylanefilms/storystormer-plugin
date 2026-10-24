<!-- ABOUTME: Developer tools for this repo; dev-only, never cited by a skill or command -->
<!-- ABOUTME: Explains md-profile-check, the markdown-profile linter and words comparer, and how to run its tests -->

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

Tests: `node --test 'tools/*.test.ts'`. (`node --test tools/` doesn’t work on Node 24: a directory argument is read as a module, not searched.) `tools/package.json` only marks the folder as ES modules, so `tsc` type-checks it the way Node runs it.
