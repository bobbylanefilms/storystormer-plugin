<!-- ABOUTME: The local binding for the store contract: a story folder on this machine, read and written with the host’s file tools -->
<!-- ABOUTME: The plugin’s original behavior written as a binding; identical in Claude Code and Cowork, with no shell -->

# Local Binding

The store is the open working folder: a folder on this machine in Claude Code, or the folder the host’s folder connection exposes in Cowork. This is how the plugin has always worked, written as a binding for `references/store.md`. Read that contract first; this document only says how each operation is realized here.

## Capabilities

```
identity: path · write: native · edit: native · list: glob · history: snapshots · open: pane · size: unbounded · confirm: none
```

## Tools

The host’s file tools **Read**, **Write**, **Edit** and **Glob**, and, optionally, a way to remove a file (`delete`). No connector, and no shell required. Claude Code and Cowork both provide these four under these names, so the binding behaves the same on both; resolution’s tool check passes when all four are present.

**Verified on:** 2026-10-15.

## Root

The open folder that holds `.storystormer/config.json`, or the config’s `local_root` when it names a folder that exists on this machine (`store.md` § Resolve). A contract path joins onto it: `treatment.md` is `<root>/treatment.md`, `chapters/chapter-07/ch07-prose.md` is `<root>/chapters/chapter-07/ch07-prose.md`.

## Stored and computed

Everything is **stored** as a real file; nothing is computed. That includes the snapshot folders (`history: snapshots`), `characters/_index.md`, `outline/_index.md`, `voice/README.md` and `.storystormer/config.json`, so every clause in `store.md` § Local-mode clauses that says “stored” applies.

## Operations

| Operation | Realization |
|---|---|
| `list(glob)` | Glob with the pattern from the root; return root-relative paths |
| `read(path)` | Read the file from beginning to end; if the tool returns only part of it, keep reading from where it stopped until the end. *Frontmatter only:* Read the first lines (a limit of about 60), extending until the closing `---` |
| `write(path, content)` | Write the full content to the path, which creates the file and any missing folders. Skip the call when the content is identical to what is there. Write refuses to overwrite a file this conversation has not read: the snapshot step’s read satisfies that, and otherwise read the file first |
| `edit(path, edits, reason)` | Edit, one call per item in order: `old` → `old_string`, `new` → `new_string`, `replace_all` → `replace_all`. All or nothing: before the first call, check every anchor against the text the earlier items would leave; if any is missing or ambiguous, stop with nothing written. If a call still fails partway, write back the content read before the first call. `reason` is not recorded; the snapshot is the history |
| `history(path)` | Book-level documents: Glob `.storystormer/history/*/<path>` (each snapshot folder keeps root-relative paths, so `books/book-2/treatment.md` matches only book 2’s). Chapter artifacts: Glob `<chapter folder>/.history/ch<NN>-<stage>-v*.md`, where the chapter folder is the document’s own (`books/<slug>/chapters/chapter-NN/` in a series). Return them newest first |
| `open(path)` | Present the file itself in the host’s reading pane (Cowork’s file preview; a send-file or render tool in Claude Code) so the author reads it beside the chat; never paste its contents into the conversation. Where the host has no pane, name the path |
| `move(from, to)` | Read `from`, Write it to `to`, then `delete(from)` |
| `delete(path)` | Remove the file with whatever the host offers for it (a shell’s `rm` in Claude Code, a file-delete tool where the host has one). Where the host offers none (Cowork’s folder connection today), don’t fail: name the path in the report for the author to remove, and say until then that two copies exist. Never required for the binding to work, so the no-shell rule holds |

## Snapshots

`history: snapshots`, so every snapshot `store.md` calls for is written here as files, by `read` then `write`, before the overwrite begins. Where they go and how they are named is defined once in `references/file-schemas.md`: § `.storystormer/history/` (book-level documents, one timestamped folder per operation, files that change together snapshotted as a set) and § `chapters/` folder → Per-chapter history (chapter artifacts, flat version-and-date-named files in the chapter’s `.history/`).

## Worked example: `treatment-update` replaces `treatment.md`

1. **Snapshot** (`file-schemas.md` § `.storystormer/history/`: the primer and treatment snapshot as a pair). Read `primer.md` and `treatment.md` in full, then Write each, unchanged, into one new folder, `.storystormer/history/<timestamp>-treatment-update/`.
2. **Write.** Write the new `treatment.md` over the old one; the read in step 1 satisfies Write’s read-first rule. The skill has already set its frontmatter (`version` bumped) in the content.
3. **No guard, no extra confirmation.** The concurrency guard does not apply to local, and `confirm: none` means the plan-first approval was the only confirmation.
4. **Open.** Present `treatment.md` in the host’s pane if the skill shows the result.
