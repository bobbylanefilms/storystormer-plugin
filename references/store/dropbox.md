<!-- ABOUTME: The Dropbox binding for the store contract: a story folder under /StoryStormer/ in the author’s Dropbox, through the Dropbox connector -->
<!-- ABOUTME: Same tree as local mode; overwrite is delete then create, edits are read-modify-write, history is snapshot files -->

# Dropbox Binding

The store is a folder in the author’s Dropbox, reached through the Dropbox connector. The tree is the local tree, file for file and byte for byte, so the same folder synced to a machine is also a valid local project. Read `references/store.md` first; this document only says how each operation is realized here.

## Capabilities

```
identity: path · write: delete-create · edit: read-modify-write · list: folder-walk · history: snapshots · open: url · size: 5 MiB / 5 MB · confirm: batch
```

## Tools

The Dropbox connector’s `list_folder`, `fetch`, `create_file`, `create_folder`, `delete`, `move`, `check_job_status`, `get_file_metadata` and `search`. The operations below use the first seven; `get_file_metadata` and `search` are part of the expected set, kept for the locator (SB4), but no operation depends on them. Resolution’s tool check passes when all nine are present.

**Verified on:** 2026-10-16.

## Root

`/StoryStormer/<project-slug>/`, named by the config’s `storage.root` (`"/StoryStormer/<slug>"`). A contract path joins onto it: `treatment.md` is `/StoryStormer/<slug>/treatment.md`. Call the connector with that joined path (an fq_path); show the author `path_display`. Where a response carries only `path` (an ns_path, `ns:<id>//…`), pass it on exactly as returned and never strip the prefix to build a call.

When `storage.local_root` names a folder that exists on this machine, resolution picks the local binding instead (`store.md` § Resolve); nothing here applies.

**Locator root** (SB4): `/StoryStormer/`; each child folder holding `.storystormer/config.json` is a project.

## Stored and computed

Everything is **stored** as a real file; nothing is computed. That includes the snapshot folders (`history: snapshots`), `characters/_index.md`, `outline/_index.md`, `voice/README.md` and `.storystormer/config.json`, whose `storage` block reads `{"kind": "dropbox", "root": "/StoryStormer/<slug>"}`, plus `local_root` when the author syncs the folder to a machine. Every clause in `store.md` § Local-mode clauses that says “stored” applies.

## Operations

| Operation | Realization |
|---|---|
| `list(glob)` | One `list_folder` on the root with `recursive: true` and `max_results: 600`, then `list_folder` with only `cursor` until `has_more` is `false`. Pages may hold zero entries while `has_more` is `true`; keep going. Paginate to the end without asking (the walk is one operation, not a browse). Keep entries whose `object_type` is `file`; folders and mounts are not documents. Each entry’s `path` is an ns_path and its `path_display` is empty, so: drop `ns:<id>//`, then drop the leading segments that match the root (`StoryStormer/<slug>`, compared case-insensitively); the rest is the contract path, in the casing Dropbox returns. Match the glob case-insensitively |
| `read(path)` | `fetch` with the joined path. `text` is the document plus **one extra trailing newline** that the connector’s extraction appends (the stored bytes are exact); remove exactly one `\n` from the end and return the rest. `.json` reads the same way. An error saying the file could not be found is the contract’s missing-path error; any other error (failed extraction) is an error too, never an empty document. *Frontmatter only:* no partial read; `fetch` whole and keep the frontmatter block |
| `write(path, content)` | Have the prior content in hand: the snapshot’s or the guard’s read, otherwise `read(path)` now (missing means this is a create). Identical content → no call. Run the concurrency guard (`store.md`) before anything is removed. **Absent path:** `create_file`; on `PARENT_NOT_FOUND`, `create_folder` each missing level from the highest down (one level per call; `ALREADY_EXISTS` on a folder means it is there, carry on), then `create_file` again. **Existing path:** `delete` with `[{source_path}]`; it answers `in_progress` with an `operation_id`, so call `check_job_status` with that id and `wait_ms: 5000` until `completed`. Entry `success` → `create_file` with the new content; entry `failed` → stop, nothing changed, report it. On `ALREADY_EXISTS`, wait about a second and retry the create once. **Recovery:** if the create still fails, `create_file` the prior content at the path; if that fails too, tell the author the path is absent, that the prior version is in the snapshot and in Dropbox’s Deleted files, and hold the new content in the conversation. Never end the call without saying which of these happened |
| `edit(path, edits, reason)` | `read(path)`. That read is the guard’s re-read: if its `version` differs from the baseline, stop per the guard. Apply the edits in order in the model under the contract’s grammar; a missing or ambiguous anchor fails the whole call with nothing written. Then `write` the result (its guard is already satisfied by this read). `reason` is not recorded; the snapshot is the history |
| `history(path)` | Book-level documents: `list('.storystormer/history/**')` and keep the paths that end `/<path>` (each snapshot folder keeps root-relative paths, so `books/book-2/treatment.md` matches only book 2’s). Chapter artifacts: `list('<chapter folder>/.history/*')` filtered to `ch<NN>-<stage>-v*.md`. Return them newest first. Older versions may also sit in Dropbox’s own version history or Deleted files, which no connector tool reads; point the author to <https://help.dropbox.com/delete-restore/recover-older-versions> if they need something the snapshots lack |
| `open(path)` | Give the author the `url` from a `fetch` of the path, taken **after** the last write: `create_file` returns no url, and a delete-create makes a new file with a new url. The url is the owner’s Dropbox link; `fetch` creates no shared link, and `open` never calls a sharing tool |
| `move(from, to)` | `move` with `[{source_path, destination_path}]`, then `check_job_status` as for `delete`. Missing destination folders are created by the move. An existing destination fails the entry (`to/conflict`): don’t pass `autorename`; stop and report both paths |
| `delete(path)` | `delete`, then `check_job_status` until `completed`; report the entry’s result. The file goes to Dropbox’s Deleted files, recoverable for the account’s retention period, never wiped |

## Snapshots

`history: snapshots`, so every snapshot `store.md` calls for is written here as files, by `read` then `write`, before the overwrite begins. A snapshot path is always new, so its write is a create (plus `create_folder` for the timestamped folder). Where snapshots go and how they are named is defined once in `references/file-schemas.md`: § `.storystormer/history/` (book-level documents, one timestamped folder per operation, files that change together snapshotted as a set) and § `chapters/` folder → Per-chapter history (chapter artifacts, flat version-and-date-named files in the chapter’s `.history/`).

## Confirmation

The connector’s tool descriptions ask the model to summarize each create, delete and move and get explicit confirmation before calling it. Here **the plan-first approval (`references/plan-first.md`) is that confirmation** for every mutation in the run, snapshot files and the delete half of each overwrite included; don’t re-ask per file or per call. Work outside the approved plan still needs its own approval.

The descriptions also ask, after each mutation, for a note on how to revert it. Give it once per run, in the report, not per file: name the snapshot folder (or chapter `.history/` files) that holds what was replaced, and say that replaced and deleted files are also in Dropbox’s Deleted files (<https://help.dropbox.com/delete-restore/recover-deleted-files-folders>).

## Quirks

- **Case-insensitive paths:** `TREATMENT.md` and `treatment.md` are the same file, and a folder’s stored casing wins (writing `characters/x.md` into an existing `Characters/` lands there). Create folders in the contract’s casing; return what Dropbox returns.
- **NFC:** paths must be Unicode NFC; a decomposed form (`e` plus a combining accent) is rejected. Normalize a slug before joining it.
- **Size:** `fetch` reads up to 5 MiB; `create_file` writes up to 5 MB (`CONTENT_TOO_LARGE`). No story document comes near either; if one does, stop and report it rather than split it.
- **Async jobs:** `delete` and `move` answer `in_progress` even for one file, and per-entry failures appear only in `check_job_status`’s result. Never treat the first response as the outcome.
- **The trailing newline:** `fetch` adds one `\n` to every file it reads; `create_file` stores content byte for byte. Remove the extra one on every read, or anchors, the no-op check and snapshots drift by a line each round trip.
- **New file, new id:** every overwrite deletes the file and creates another, so its `file_id` and `url` change. Never keep either across a write.

## Worked example: `treatment-update` replaces `treatment.md`

1. **Snapshot and guard** (`file-schemas.md` § `.storystormer/history/`: the primer and treatment snapshot as a pair). `fetch` `primer.md` and `treatment.md`, removing each trailing newline. Compare `treatment.md`’s `version` with the baseline, the read the new treatment was prepared from; if they differ, stop and show the author both. Otherwise `create_folder` `.storystormer/history/<timestamp>-treatment-update/` (and `.storystormer/history/` first if absent), and `create_file` each document, unchanged, into it.
2. **Write.** `delete` `treatment.md`, `check_job_status` until the entry reports `success`, then `create_file` the new `treatment.md`, whose frontmatter the skill has already set (`version` bumped). On `ALREADY_EXISTS`, wait a second and retry once; if the create still fails, `create_file` the content read in step 1.
3. **No extra confirmation.** The plan-first approval covered the snapshot creates, the delete and the create. The report names the snapshot folder and Dropbox’s Deleted files as the way back, once.
4. **Open.** `fetch` `treatment.md` and give the author its `url`.
