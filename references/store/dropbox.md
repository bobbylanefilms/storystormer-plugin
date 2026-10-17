<!-- ABOUTME: The Dropbox binding for the store contract: a story folder under /StoryStormer/ in the author’s Dropbox, through the Dropbox connector -->
<!-- ABOUTME: Same tree as local mode; overwrite is delete then create, edits are read-modify-write, history is snapshot files -->

# Dropbox Binding

The store is a folder in the author’s Dropbox, reached through the Dropbox connector. The tree is the local tree, file for file and byte for byte, so the same folder synced to a machine is also a valid local project. Read `references/store.md` first; this document only says how each operation is realized here.

## Capabilities

```
identity: path · write: delete-create · edit: read-modify-write · list: folder-walk · history: snapshots · open: url · size: 5 MiB / 5 MB · confirm: batch
```

## Tools

The Dropbox connector’s `list_folder`, `fetch`, `create_file`, `create_folder`, `delete`, `move` and `check_job_status`. Resolution’s tool check passes when all seven are present. The connector also offers `get_file_metadata` and `search`; nothing here uses them (§ Locate lists `/StoryStormer/` and reads each project directly), so their absence fails nothing.

**Verified on:** 2026-10-16.

## Root

`/StoryStormer/<project-slug>/`, named by the config’s `storage.root` (`"/StoryStormer/<slug>"`). A contract path joins onto it: `treatment.md` is `/StoryStormer/<slug>/treatment.md`. Call the connector with that joined path (an fq_path); show the author `path_display`. Where a response carries only `path` (an ns_path, `ns:<id>//…`), pass it on exactly as returned and never strip the prefix to build a call.

When `storage.local_root` names a folder that exists on this machine, resolution picks the local binding instead (`store.md` § Resolve); nothing here applies.

## Stored and computed

Everything is **stored** as a real file; nothing is computed. That includes the snapshot folders (`history: snapshots`), `characters/_index.md`, `outline/_index.md`, `voice/README.md` and `.storystormer/config.json`, whose `storage` block reads `{"kind": "dropbox", "root": "/StoryStormer/<slug>"}`, plus `local_root` when the author syncs the folder to a machine. Every clause in `store.md` § Local-mode clauses that says “stored” applies.

## Operations

| Operation | Realization |
|---|---|
| `list(glob)` | One `list_folder` on the root with `recursive: true` and `max_results: 600`, then `list_folder` with only `cursor` until `has_more` is `false`. Pages may hold zero entries while `has_more` is `true`; keep going. Paginate to the end without asking (the walk is one operation, not a browse). Keep entries whose `object_type` is `file`; folders and mounts are not documents. Each entry’s `path` is an ns_path and its `path_display` is absent or empty in recursive mode, so: drop `ns:<id>//`, then drop the leading segments that match the root (`StoryStormer/<slug>`, compared case-insensitively); the rest is the contract path, in the casing Dropbox returns. Match the glob case-insensitively |
| `read(path)` | `fetch` with the joined path. `text` is the document plus **one extra trailing newline** that the connector’s extraction appends (the stored bytes are exact); remove exactly one `\n` from the end and return the rest. `.json` reads the same way. An error saying the file could not be found is the contract’s missing-path error; any other error (failed extraction) is an error too, never an empty document. *Frontmatter only:* no partial read; `fetch` whole and keep the frontmatter block |
| `write(path, content)` | Follow § Write, step by step. In short: full prior read, guard, no-op check, size check, then create (absent path) or delete-then-create (existing path) with the recovery below |
| `edit(path, edits, reason)` | `read(path)`. That read is the guard’s re-read: if it differs from the baseline (its `version`, or its whole content when it has none), stop per the guard. Apply the edits in order in the model under the contract’s grammar; a missing or ambiguous anchor fails the whole call with nothing written. Then `write` the result (its guard is already satisfied by this read). `reason` is not recorded; the snapshot is the history |
| `history(path)` | Book-level documents: `list('.storystormer/history/**')` and keep the paths that are exactly `.storystormer/history/<one folder>/<path>`, compared case-insensitively (each snapshot folder keeps root-relative paths, so `books/book-2/treatment.md` matches only book 2’s, and `treatment.md` never matches a book’s or a nested archive’s copy). Chapter artifacts: `list('<chapter folder>/.history/*')` filtered, case-insensitively, to `ch<NN>-<stage>-v*.md`. Return them newest first. Older versions may also sit in Dropbox’s own version history or Deleted files, which no connector tool reads; point the author to <https://help.dropbox.com/delete-restore/recover-older-versions> if they need something the snapshots lack |
| `open(path)` | Give the author the `url` from a `fetch` of the path, taken **after** the last write: `create_file` returns no url, and a delete-create makes a new file with a new url. The url is the owner’s Dropbox link; `fetch` creates no shared link, and `open` never calls a sharing tool |
| `move(from, to)` | `move` with `[{source_path, destination_path}]`, then `check_job_status` as for `delete`. Missing destination folders are created by the move. An existing destination fails the entry (`to/conflict`): don’t pass `autorename`; stop and report both paths |
| `delete(path)` | `delete` with one path, then `check_job_status` until `completed`; report the entry’s result. The file goes to Dropbox’s Deleted files, recoverable for the account’s retention period, never wiped |

## Write

1. **Prior content, in full.** Overwriting needs the whole current document in hand: the snapshot’s read, an `edit`’s read, or `read(path)` now. A frontmatter-only read (the guard’s) is never the prior content. A missing path means this is a create, with no prior content. The existence read may be skipped when the path is absent from a `list` taken in this run or its parent folder was created in this run; `create_file`’s `ALREADY_EXISTS` still guards it.
2. **Guard, then no-op.** On an existing path, run the concurrency guard (`store.md`) against that read; on a mismatch, stop with nothing written. Only then compare: content identical to what the read returned → no call.
3. **Size, before anything is removed.** The new content must fit `create_file`’s 5 MB, and so must the prior content (it is the rollback). If either doesn’t, stop and report it; never delete a document that couldn’t be written back.
4. **Absent path:** `create_file`. On `PARENT_NOT_FOUND`, `create_folder` each missing level from the highest down (one level per call; `ALREADY_EXISTS` on a folder means it is there, carry on), then `create_file` again.
5. **Existing path:** `delete` with `[{source_path}]`, one path per call (never batch the deletes of several writes, so two documents are never absent at once); it answers `in_progress` with an `operation_id`, so call `check_job_status` with that id and `wait_ms: 5000` until `completed`. Entry `failed` → stop: nothing changed; report it. Entry `success` → `create_file` the new content. If polling itself errors or times out, poll again; if it still can’t answer, `fetch` the path: present means the delete hasn’t happened (stop, nothing changed), missing means it has (go on to the create).
6. **Retry the create once** after about a second on `ALREADY_EXISTS` (the delete not yet landed) or on a transient error (rate limit, internal error).
7. **Recovery** if the create still fails:
   - **A create with no prior content:** nothing was removed; report the failure and hold the content in the conversation.
   - **An overwrite:** `create_file` the prior content at the path. If that create (or the retried new one) answers `ALREADY_EXISTS`, something now occupies the path (a lost response, another device): `fetch` it and report which content is there instead of assuming either.
   - **Both creates fail** (the connector is down): wait and retry the restore once more. If the path is still absent, that is the one case this call ends with it absent: say so plainly, say the prior version is in the snapshot (when the document has one) and in Dropbox’s Deleted files, hold the new content in the conversation, and stop the run before any further writes.

## Snapshots

`history: snapshots`, so every snapshot `store.md` calls for is written here as files, by `read` then `write`, before the overwrite begins and **after** the concurrency guard has passed on that read (a newer version is never snapshotted as the one being replaced). A snapshot path should be new, so its write is a create (plus `create_folder` for the timestamped folder); if the timestamped folder already exists (two runs in one minute), append `-2`, `-3`, … to its name rather than write into it, and on a retry of the same run reuse its own folder only for files whose content already matches. Where snapshots go and how they are named is defined once in `references/file-schemas.md`: § `.storystormer/history/` (book-level documents, one timestamped folder per operation, files that change together snapshotted as a set) and § `chapters/` folder → Per-chapter history (chapter artifacts, flat version-and-date-named files in the chapter’s `.history/`).

## Confirmation

The connector’s tool descriptions ask the model to summarize each create, delete and move and get explicit confirmation before calling it. Here **the plan-first approval (`references/plan-first.md`) is that confirmation** for every mutation in the run, snapshot files and the delete half of each overwrite included; don’t re-ask per file or per call. Work outside the approved plan still needs its own approval.

The descriptions also ask, after each mutation, for a note on how to revert it. Give it once per run, in the report, not per file: name the snapshot folder (or chapter `.history/` files) that holds what was replaced, and say that replaced and deleted files are also in Dropbox’s Deleted files (<https://help.dropbox.com/delete-restore/recover-deleted-files-folders>). For files the run created, say they can be deleted; for moves, name the original paths they can go back to.

## Locate

The well-known root is `/StoryStormer/`; each child folder holding `.storystormer/config.json` is a project.

1. **List** `/StoryStormer/` with `list_folder`, **not** recursive, following `cursor` until `has_more` is `false`, and keep the entries whose `object_type` is `folder`. Each child’s name is the last segment of its `path_display`, or of its `path` when that is absent (never the whole value, which already includes `/StoryStormer/`). A not-found error means no projects here, which is not a failure.
2. **Config:** `fetch` `/StoryStormer/<child>/.storystormer/config.json`, remove the trailing newline, and parse it. Not found → not a project; skip it. A pointer (a `storage` block and nothing else) isn’t a project here either; skip it. A config that doesn’t parse, or a fetch that errors → list the folder as unreadable, with the error. A config whose `storage.kind` is `local`, or that has no `storage` block, is a local project kept in this synced folder: list it as a synced local project (`store.md` § Resolve binds it here, through this binding).
3. **State:** `fetch` `/StoryStormer/<child>/state.md` and keep the frontmatter (§ Operations, `read`). Missing or unreadable → list the project with its stage and last session unknown.

**Returns**, per project: title (`state.md`’s `title`, else the config’s), slug (the folder name), root `/StoryStormer/<child>`, `stage`, `last_session`, a series’ `books`, and the config’s `local_root` when it has one (resolution checks it, `store.md` § Resolve). **Fails** when the listing itself errors. A child whose config or `state.md` can’t be read or parsed is reported against that child and marks this Locate **incomplete**, so the locator doesn’t auto-bind a lone project (`store.md` § Resolve). **Cost:** one `list_folder` (plus a page per `cursor`) and up to two `fetch`es per child folder, so about 21 calls for ten projects.

## Scaffolding a project (`init` on Dropbox)

1. **Slug check.** List `/StoryStormer/` as § Locate step 1 does (the raw folder listing, not Locate’s project list) and look for a child named the slug, compared case-insensitively. None → go on. One that holds `.storystormer/config.json` (§ Locate step 2’s read) is a project: stop and ask the author for another slug or whether they meant that project. One without a config is someone’s folder: ask before writing into it.
2. **Folders.** `create_folder` `/StoryStormer/` (when the listing found none; `ALREADY_EXISTS` means it is there), then `/StoryStormer/<slug>/`. `ALREADY_EXISTS` on the slug folder means it appeared since the check (another session): run step 1 again before writing anything.
3. **Project.** Continue `init` through the contract: the stored config with `storage` = `{"kind": "dropbox", "root": "/StoryStormer/<slug>"}`, `state.md` with `storage_kind: dropbox`, and the rest. Intake keeps this binding’s text-only rule (§ Quirks).
4. **Pointer.** With an open folder that is not this root’s synced copy, `init` writes the pointer there (`storystormer-init` § Where a new project lives).

## Quirks

- **Case-insensitive paths:** `TREATMENT.md` and `treatment.md` are the same file, and a folder’s stored casing wins (writing `characters/x.md` into an existing `Characters/` lands there). Create folders in the contract’s casing; return what Dropbox returns.
- **NFC:** paths must be Unicode NFC; a decomposed form (`e` plus a combining accent) is rejected. Normalize a slug before joining it.
- **Size:** `fetch` reads up to 5 MiB; `create_file` writes up to 5 MB (`CONTENT_TOO_LARGE`), so a file between the two can be read but not written back (§ Write step 3). No story document comes near either; if one does, stop and report it rather than split it.
- **Async jobs:** `delete` and `move` answer `in_progress` even for one file, and per-entry failures appear only in `check_job_status`’s result. Never treat the first response as the outcome.
- **The trailing newline:** `fetch` adds one `\n` to every file it reads; `create_file` stores content byte for byte. Remove the extra one on every read, or anchors, the no-op check and snapshots drift by a line each round trip.
- **Text only:** `create_file` writes UTF-8 text, so a binary file (a `.docx`, an image) can’t be stored; `init` leaves a binary intake original in the open folder and names it (`storystormer-init` § Prose Chapter Stashing). Text formats (`.txt`, `.fountain`, `.rtf`) store as they are.
- **New file, new id:** every overwrite deletes the file and creates another, so its `file_id` and `url` change. Never keep either across a write.

## Worked example: `treatment-update` replaces `treatment.md`

1. **Snapshot and guard** (`file-schemas.md` § `.storystormer/history/`: the primer and treatment snapshot as a pair). `fetch` `primer.md` and `treatment.md`, removing each trailing newline. Compare `treatment.md`’s `version` with the baseline, the read the new treatment was prepared from; if they differ, stop and show the author both. Otherwise `create_folder` `.storystormer/history/<timestamp>-treatment-update/` (and `.storystormer/history/` first if absent), and `create_file` each document, unchanged, into it.
2. **Write.** `delete` `treatment.md`, `check_job_status` until the entry reports `success`, then `create_file` the new `treatment.md`, whose frontmatter the skill has already set (`version` bumped). On `ALREADY_EXISTS` or a transient error, wait a second and retry once; if the create still fails, recover per § Write step 7 with the content read in step 1.
3. **No extra confirmation.** The plan-first approval covered the snapshot creates, the delete and the create. The report names the snapshot folder and Dropbox’s Deleted files as the way back, once.
4. **Open.** `fetch` `treatment.md` and give the author its `url`.
