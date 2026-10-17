---
name: migrate
description: Move a story project to a different home (this folder, Dropbox, or Notion), copying everything through the store and pointing the project at its new location while leaving the original untouched. Use when the author says "move this story to Notion," "migrate to Dropbox," "put this project in Dropbox so I can reach it without the folder," "make this a Dropbox hybrid," "copy my Notion project into this folder," "change where my story lives," or runs `/storystormer:migrate`. Works for any pair of backends, standalone or series; re-running resumes an interrupted move.
---

<!-- ABOUTME: Copies a project from its current store to another backend through the store contract, then repoints the session’s config -->
<!-- ABOUTME: Preflight as the plan, same-slug refusal and merge, per-category copy subagents, verification before the flip, the Dropbox hybrid -->

# StoryStormer · Migrate

You are moving a story from the store it lives in now (the **source**) to another backend the author chooses (the **target**). Everything goes through `references/store.md`: the source is read through its binding, the target is written through its binding, and nothing here names a backend’s tools. The source is never modified, and this skill never offers to delete it; the author deletes it by hand once they are satisfied, and the report says where it is.

Always follow `references/plan-first.md`. The **preflight is the plan**: nothing is created on the target until the author has seen it and said go.

## What you produce

- The project on the target: every document the target can hold, written through its binding in canonical order, with the target’s own `storage` block in its config and `storage_kind` in its `state.md`.
- The **flip**: the one write outside the target, the open folder’s `.storystormer/config.json` `storage` block, so the next session resolves to the new home (§ Verify, then flip).
- A report: counts by category, anything stored as unmapped on the target, anything skipped and why, where the untouched source is, and how to go back.

## Source and target

**Source** is the session’s binding, resolved per `store.md` § Resolve. In a hybrid session (a Dropbox project bound locally through `local_root`), the source is that Dropbox project, read through the local binding, which is the fast path to the same files.

**Target** options are init’s (`storystormer-init` § Where a new project lives): this folder, when there is an open folder; and each backend in `store.md` § Bindings that is not pending and whose binding’s tool check passes. Leave out the source’s own kind (both `local` and `dropbox` in a hybrid session, since they are the same files). With one option left, name it and confirm; with none, say why each backend is unavailable (pending, connector missing, it is the source, no open folder) and stop. After a completed move the session resolves to the new home, so the old kind is an ordinary target again (a move back, copied afresh under § Same slug); a completed move is never re-copied to the home it already reached.

**The slug** is the source’s: the Dropbox folder name, the Notion row’s `Slug`, or for a local project the folder’s name in kebab case, NFC (the title’s kebab case when the folder name won’t serve). The preflight names it; the author can change it. Validate it, whoever chose it (a Notion source’s `Slug` included): kebab case, `[a-z0-9-]` only, NFC, no `/`, no `..`, no leading dot. Anything else, ask for a slug that passes rather than repair it silently.

**A local target** is the open folder. It may hold nothing but the pointer config that sends the session to the source (and OS clutter); anything else is named, and the author is asked before anything is written into it. A folder holding a full config is an existing project (§ Same slug), and another slug can’t help, since the destination is the folder itself: offer to merge into it, or to open or choose another folder and run `migrate` there.

## The preflight (the plan)

`store.list('**')` on the source, then work out, without writing anything:

- **Counts by category:** canon (`characters/`, `worldbuilding/`), story documents (`primer.md`, `treatment.md`, `manifest.md`, `series.md`, `voice/`, `research/`), `outline/`, chapters (folders and artifacts), the logs (decision and question **entries**, not just two files), snapshots (`.storystormer/history/` folders and each chapter’s `.history/`), and everything else. A series counts the shared root, then each book.
- **What happens to each**, by the table below: copied, mapped to the target’s realization, computed by the target, stored as unmapped, or skipped (with the reason and the paths).
- **Same slug** on the target (§ Same slug): clear, or the refusal and its merge prompt, or a recognized unfinished or flip-pending earlier run.
- **Names the target can’t keep apart.** On a target whose paths are case-insensitive or must be NFC (Dropbox, `references/store/dropbox.md` § Quirks), list any source paths that differ only by case, and any names not in NFC, and stop for the author’s call (rename in the source, or skip one) rather than collide mid-run.
- **Where it will live** (the Dropbox path, the Notion hub and whether a new hub and tables are created, or this folder) and **what the flip will write** into the open folder, or that there is no open folder to flip.
- **Call volume**, estimated from the counts and the target’s capabilities line, roughly: on a local target, one write per document; on Dropbox (`write: delete-create`), one create per document plus one per new folder, and about four for each document an overwrite replaces (read, delete, poll, create); on Notion, two to three per document (create, the async poll, a second content call when the body opens with a `#` heading) and two to three per **log entry** (each decision and question is its own row, plus the numbering check), plus about ten for a new hub. Add the source’s reads: one per document, two on Notion. A 150-document project with 200 decisions is on the order of a thousand calls into Notion, a few hundred into Dropbox. Say plainly that a big project takes a while, that an interrupted run resumes by running `migrate` again (identical writes are no-ops), and that edits made elsewhere during the move land only in the source.

Then wait for the author’s go. That approval is the confirmation for every mutation in the run (`store.md` § Confirmation posture), on every binding.

### What happens to each item

| Item | Target with `history: snapshots` (local, Dropbox) | Target that computes documents (Notion) |
|---|---|---|
| Canon, story documents, outline, chapter artifacts and scenes (`.md`) | copied, path for path | rows per the binding’s path map |
| `decisions.md`, `questions.md` | copied, one write each | one row per entry through the binding’s writable realizations, each keeping its own number (`references/store/notion.md` § IDs, imports: the number is set to the entry’s own when free, so a gap such as D-001, D-003 stays a gap and chapters citing D-003 still point at it); decisions before questions, so a `resolved (D-###)` can link its row; `Superseded by` links set once both rows exist. From then on the document is the rendering of those rows |
| `state.md` (root, and each book’s) | written last by the main session: `storage_kind` = the target’s kind, What Exists recomputed from what the target holds, the Storage line per `file-schemas.md` § `state.md` (a source’s line is dropped where it no longer applies) | frontmatter → the Projects row (created first, at scaffolding, since every other row relates to it, **with no page content**); `## Summary`, `## What's Next`, `## Last Session` → the row’s content, last; What Exists is not copied (the binding computes it) |
| `.storystormer/config.json` | written last, the source’s fields with the target’s `storage` block; on a merge into a series, `books` is merged (target-only books kept, the source’s added or updated), never replaced wholesale | root fields → Projects properties (a series’ `books` → book rows, set at scaffolding; on a merge, the same merged `books`, so the realization never sees a book removed); `storage` is never written (the row is Notion’s) |
| `characters/_index.md`, `outline/_index.md`, `voice/README.md` | copied | not copied: the target computes them |
| `.storystormer/history/**`, `chapters/*/.history/**` (snapshots) | copied as they are | **skipped**, counted, and left in the source. Notion keeps its own page history from the moment each row is created, so those snapshot files stay the only record of versions before the move; the report says so |
| `.storystormer/history/<timestamp>-init/` (init’s intake archive on a snapshots store) | copied with the snapshots | its markdown re-filed to `.storystormer/intake/<timestamp>/`, where init files the archive on such a store; child pages, reported as unmapped |
| `.storystormer/intake/**`, `.storystormer/canon-sync/*.md`, `kitbash/`, other `.md` outside the path map | copied | child pages titled with the path (the binding’s unmapped-path rule), listed in the report as stored as unmapped |
| `.storystormer/genre-reference.md` | copied | its Assets row |
| Text that isn’t markdown (`.txt`, `.fountain`, `.py`, a `.json` other than the config) | copied as is | **skipped** and named: the binding holds markdown only and normalizes it, so the file would not come back as it went in |
| Binary files (`.docx`, images, PDFs) | **skipped** and named on every target: the store operations carry text, so no binding can copy one. They stay in the source; the author can carry them over by hand where the target is a folder |
| OS and tool clutter (`.DS_Store`, `Thumbs.db`, `desktop.ini`, `._*`, `.git/`) | never copied, never listed one by one; the report gives a count |

**From a store that computes documents** (Notion → a folder or Dropbox), each rendered read is written as a stored file: `decisions.md` and `questions.md` as the rendered logs, the indexes and `voice/README.md` as rendered, child pages as files at their path titles, `.storystormer/intake/**` as ordinary files. The rendered config is written with its `storage` block replaced by the target’s, and `state.md` with `storage_kind` replaced. Documents that passed through Notion carry its markdown normalization (`references/store/notion.md` § Rendering); the report says so once.

## Same slug

Use the target binding’s own § Locate and § Scaffolding checks: on Dropbox, a `/StoryStormer/<slug>` folder holding a config (the raw listing, compared case-insensitively); on Notion, a Projects row with that `Slug` in the chosen hub; on a local target, a full config in the open folder.

- **Clear:** go on. On Notion, after the go, run the binding’s § Scaffolding steps 1–2 only as needed (a hub and tables when there is no hub) and step 3 always (the Projects row, and every book row in a series), created from the frontmatter and config fields with no page content; Dropbox runs its steps 1–2 (slug check, folders).
- **Taken:** refuse, say what is there (its title, stage and last session from that project’s `state.md`), and ask whether the author meant to **merge** into it or to pick another slug. Don’t guess.
- **An unfinished earlier run of this migration:** the target holds the slug but no config (a stored target) or a Projects row with no content (Notion), and every document it holds matches the source’s, compared through the target binding’s rendered read against what the source would render as there (Notion normalizes markdown, so raw bytes never match). Say so and offer to **resume**: a merge into that folder or row with nothing to conflict, where every identical write is a no-op. A configless folder whose documents don’t match is someone else’s; ask before writing into it, as the binding does.
- **Complete, flip pending:** the same, but the target’s config and `state.md` were written (the run stopped between them and the flip). It is not taken: say so and offer to finish, which re-runs verification (§ Verify, then flip) and does the flip.

**Merge** means: write the source over the target path by path through the target binding, with its concurrency guard (the baseline is the target’s read at preflight) and, where its `history` is `snapshots`, a snapshot of each document replaced (operation `migrate`, per `store.md`). Never delete a target-only document. The logs merge by entry, never by file: a source entry the target lacks is added under its own number; one whose number the target holds with different content is a **conflict**, not copied, and listed. Anything that references a held-back entry is held back too and listed beside it (a question `resolved (D-###)` by it, a `Superseded by` naming it, a chapter or other document citing it), so nothing attaches to the target’s different entry under that number. A guard mismatch is a conflict too: stop that document, show the author both versions, write nothing until they choose. The report lists every conflict and every document replaced.

## Copy

**Order.** The canonical order (canon; story documents; outline; chapters; the logs; everything else; snapshots) has only these real barriers: **canon first**, alone, because a target that indexes cross-references needs it in place (Notion links each chapter row to the characters and places it names); **decisions before questions** inside the logs category (a `resolved (D-###)` links a row); **chapters in chapter order** inside the chapters category; and in a series, **shared root first, then each book in `books` order** inside every category. After canon the categories don’t depend on each other, so they run in parallel. `state.md` and the config come last, from the main session, after verification (§ Verify, then flip), so a half-finished stored target has no config and is recognizable as unfinished.

**Subagents.** Past `references/subagent-pattern.md` § When to dispatch’s threshold, dispatch one execution subagent per category: canon first and alone, then the others in a single message so they run in parallel, each keeping the order its own category needs (above). Below it, copy directly in the main session. Every brief carries two store blocks, as `storystormer-init`’s intake briefs do: a **source** block (binding, root, capabilities line, its `read` and `list` realizations; read-only) and a **target** block (binding, root, capabilities line, the realization of every operation used, and the triggered clauses pasted as text: write recovery where `write` is not `native`, the confirmation posture, the documents the target computes and must not be written except through the realizations named for them, and on a merge or resume each target’s baseline and snapshot path), **plus every binding section those realizations cite, pasted as text**, since a subagent can’t open the bundle. On Notion that is the hub’s five data-source URLs, the Projects row id (and book row ids in a series), the path map, frontmatter ↔ properties, rendering, § IDs (with the import rule), async creates and query pagination; the logs subagent also gets the decisions and questions realizations and the entry formats verbatim. On Dropbox it is § Write, its recovery and the quirks the writes depend on (case, NFC, the trailing newline). The rule for any binding: whatever a pasted realization refers to travels with it. Each brief lists its paths with source path → target path and the action (copy, or skip and why), and asks for a per-path log: written, identical (no-op), stored as unmapped, skipped (only a skip the approved plan named, with its reason), conflict, or **failed** (an error the binding’s recovery couldn’t clear, with the error), with counts. A path the plan didn’t skip is never logged as skipped. Reject a log that names a local filesystem path for a non-local target (`subagent-pattern.md` § Mandatory brief fields) and re-dispatch.

The main session aggregates the logs. Any renumbered log entry (a Notion race, which a new project shouldn’t meet) is reported with both IDs.

## Verify, then flip

**Verify.** Before writing the target’s `state.md` and config, `store.list('**')` on the target and check, leaving out the written-last documents (every `state.md` and the config, which don’t exist yet on a fresh target):

- **Paths:** every path the logs call written, identical or stored as unmapped appears in the listing. Checking the path set, not just a count, also catches a merge where pre-existing target files would mask a missing one.
- **Balance, per category:** the source’s count equals written + identical + stored as unmapped + skipped + computed by the target + conflict, so nothing fell through unaccounted.
- **No failures:** any `failed` path blocks the flip.
- On Notion, the Decisions and Questions row counts match the entries sent.

No re-reads: it is cheap, and it catches a lost write, not a corrupted one. Anything wrong stops the run before the target’s config and before the flip: report the category, the paths missing or failed, and that re-running resumes.

**Then** the main session writes the target’s `state.md` and `.storystormer/config.json` (§ What happens to each item), lists the target once more to see they are there (on Notion, that the Projects row now has its sections), and only then **the flip**:

- **A local source:** in the open folder’s config, replace the `storage` block whole with the target’s (`{"kind": "notion", "root": "<row id>"}`, `{"kind": "dropbox", "root": "/StoryStormer/<slug>"}`, with `local_root` only in the hybrid) and keep every other field. No source document changes; going back is restoring `"storage": {"kind": "local"}`, which returns to the project as it was when it moved, without anything done since. The source’s `state.md` keeps `storage_kind: local`; nothing reads it while the config points elsewhere.
- **A connector source with an open folder** (the folder holds its pointer): rewrite the pointer as exactly `{"storage": {…the target’s block…}}`, the wrapper and nothing else, or, when the target is this folder, the target’s full config has already replaced it.
- **A hybrid source:** the open folder’s config is also the Dropbox project’s config, so the flip changes that one file’s `storage` block; it is the one exception to the untouched source, and restoring the old block undoes it.
- **No open folder:** there is nothing to flip. The report gives the new location and says the locator will now list the project on both backends under the same slug until the author deletes the source.
- **Never** a source store’s own config: a Dropbox project’s stored config stays as it was, and a Notion source’s config is computed, so its `storage` is never written.

**After the flip the session moves too.** Replace the binding, root and capabilities line the session remembers (`store.md` § Resolve, “What the session remembers”) with the target’s, by resolving again (with no open folder, bind the target directly, since its root is known, rather than run the locator), so that a decision captured or a document written next lands in the new home and not in the source. The report says the session is now working there.

## The hybrid (local → its own Dropbox)

A local source whose folder syncs through Dropbox, migrated to Dropbox, becomes one store seen two ways: a session with the folder open resolves local, one with no folder resolves Dropbox, and both see the same files. The sync root is the Dropbox folder itself (`~/Dropbox`, `~/Library/CloudStorage/Dropbox`), as in `storystormer-init` § Where a new project lives.

- **The folder already is `<Dropbox sync root>/StoryStormer/<slug>`.** No copy at all. The same-slug check finds this folder’s own config, which is not a conflict. The plan is two writes through the local binding: the config’s `storage` becomes `{"kind": "dropbox", "root": "/StoryStormer/<slug>", "local_root": "<this folder’s absolute path>"}`, and `state.md` gets `storage_kind: dropbox` and the hybrid Storage line (`file-schemas.md` § `state.md`).
- **The folder syncs through Dropbox but sits elsewhere** (`~/Dropbox/Novels/the-good-dog`). Copy to `/StoryStormer/<slug>`. When the local binding can reach the sync-root path (Claude Code can; a Cowork folder connection that exposes only the project folder can’t), write through the **local binding rooted at `<Dropbox sync root>/StoryStormer/<slug>`** on this machine: the Dropbox binding’s tree is the local tree byte for byte, so these are the files it would hold, written in one native call each instead of delete-create through the connector, and the Dropbox app syncs them up. The same-slug check still runs through the Dropbox binding, which sees the cloud even when this machine’s sync is behind or selective, and the local folder is checked too, through the local binding: it must be absent, or match the approved merge baseline. A folder the cloud doesn’t show but this machine holds (not yet synced) is named and asked about, never overwritten. Verification lists through the local binding; the report says the copy reaches other devices as the Dropbox app syncs it. The new folder gets the full config with `local_root` = its own path and the hybrid Storage line. The old folder’s config is flipped to the same `storage` block, `local_root` included, so opening the old folder resolves to the new synced copy: that `local_root` names the synced copy of the block’s own Dropbox root, the one case where a config outside that folder may carry one (`store.md` § Resolve). When the local binding can’t reach the sync-root path, copy through the Dropbox binding instead, and set `local_root` (in the new config and the flipped one) only if the synced path exists on this machine.
- **A folder outside Dropbox** goes through the Dropbox binding with no `local_root`, unless the author names their Dropbox folder on this machine and it exists (ask; don’t guess), in which case it is the second case.

## Report

- **Where it lives now:** the backend, its root, and the way in (the Dropbox path, the Notion row’s link, the folder), that this session now works there, and how the next session finds it: the open folder resolves there; with no folder, the locator lists it.
- **Counts** by category: written, identical (no-op), computed by the target, stored as unmapped (with the paths), skipped (with paths and reasons: snapshots on a target without them, non-markdown on Notion, binaries, and the clutter count).
- **Failures** (each path and its error; any blocks the flip, and re-running resumes), **conflicts** and the entries held back with them, **replacements** on a merge, and any log entry renumbered.
- **The source:** where it is, that it is untouched (or, in a hybrid source, that only its config’s `storage` block changed), that `migrate` never deletes it, and that deleting it by hand stops the locator listing two copies. Any snapshots or files that stayed behind are there.
- **Going back:** the `storage` block to restore, and that it returns to the source as it was at the move.
- The binding’s own once-per-run notes (Dropbox’s way to revert, Notion’s normalization and visible HTML comments).

Update the target’s `state.md` → What's Next only if the move changes what the author should do next (it usually doesn’t).

## What this skill does not do

- **Delete or edit the source**, or offer to. The single write outside the target is the flip.
- **Sync two stores.** After the flip the target is the project; the hybrid is one store seen two ways, not two stores kept in step.
- **Convert files.** A binary or non-markdown file the target can’t hold stays where it is and is named.
- **Improve content on the way.** Documents cross as they are, apart from the `storage` fields and the What Exists recount.

## References

- `references/store.md`: operations, capabilities, § Resolve (pointers and `local_root`), local-mode clauses, concurrency guard, confirmation posture
- `references/store/local.md`, `references/store/dropbox.md`, `references/store/notion.md`: each binding’s realizations, § Stored and computed, § Locate, § Scaffolding a project, and Notion’s path map, § Rendering and § IDs
- `references/plan-first.md`: the preflight is the plan
- `references/subagent-pattern.md`: execution subagents and the mandatory store blocks
- `references/file-schemas.md`: `state.md` (What Exists, the Storage line), `.storystormer/config.json`, the history sections
- `references/series.md`: the shared and per-book layout the order follows
- `storystormer-init` § Where a new project lives: the option list, sync-folder detection, the intake archive
