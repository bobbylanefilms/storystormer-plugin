<!-- ABOUTME: The store contract: the file operations every skill and command uses instead of host or connector tools -->
<!-- ABOUTME: Operations (new entries and their numbers included), the capabilities line, resolution, the locator and the layout check, local-mode clauses, concurrency guard, confirmation posture, bindings -->

# Store Contract

A story lives in a **store**: a local folder, a Dropbox folder, a Notion workspace, or the StoryStormer server. Skills and commands never touch a store directly. They call the operations below on the paths `references/file-schemas.md` defines, and a **binding** document (§ Bindings) says how each operation is realized on one backend. Skills may read the binding’s capabilities line and follow the clauses here that key on it; **they never special-case a backend by name and never name a host or connector tool.** Only bindings do.

Resolve first (§ Resolve), once per session. After that, the work is the same on every backend.

---

## Operations

Paths are relative to the project root, in `file-schemas.md`’s grammar (`treatment.md`, `characters/<slug>.md`, `chapters/chapter-NN/ch<NN>-prose.md`, `books/<slug>/…` in a series). Where a binding’s identity is `id`, the binding maps paths to objects; skills still pass paths.

| Operation | Does |
|---|---|
| `store.list(glob)` | returns the paths under the root that match `glob` (`**` crosses folders, `*` stays within one) |
| `store.read(path)` | returns the whole document as markdown, frontmatter first; a missing path is an error, never an empty document. `store.read(path, frontmatter only)` returns just the frontmatter block, for steps that only need a field (a `pov`, a `version`, a `synopsis`); a binding that can’t read partially reads the whole document and keeps only the frontmatter. Full reads (reading discipline) never use it |
| `store.write(path, content)` | replaces the whole document with `content`, creating it (and its parent folders) when absent; writing identical content is a no-op. `store.write(path, content, new)` only creates: it fails, writing nothing, when the path exists (§ New entries) |
| `store.edit(path, edits, reason)` | applies anchored string edits, all or nothing (below) |
| `store.history(path)` | returns the document’s prior versions, or says where the author can find them when the backend keeps them out of reach |
| `store.open(path)` | presents the document to the author (§ Local-mode clauses) |
| `store.move(from, to)` | *optional.* Where the binding has none: `read(from)`, `write(to, …)`, then `delete(from)`; a binding that cannot delete says what it does instead |
| `store.delete(path)` | *optional.* Bindings use it inside `write` and `move`; skills call it directly only to clear an intake original they have just archived or re-filed (`storystormer-init`). A binding that can’t delete names the path for the author to remove |

**The edit grammar.** `edits` is an ordered list; each item gives an exact `old` string, its `new` replacement, and optionally `replace_all`. Edits apply in order, each against the result of the one before, and anchors match the document exactly as `read` returns it, frontmatter included. Without `replace_all`, `old` must occur exactly once; with it, at least once. An anchor that is missing, or that occurs more than once without `replace_all`, **fails the whole call**: nothing is written, and the error names the anchor. Quote more surrounding text and call again. `reason` is a short note of why; bindings with native history or versions record it, others drop it.

**New entries.** The `new` mode is how a document that must not replace another comes into being: a decision (`decisions/D-###.md`), a question (`questions/Q-###.md`), a session’s journal entry (`journal/<date>-s<NN>.md`). It never overwrites, deletes or snapshots anything, so the concurrency guard and the `write` capability’s overwrite mechanics (`delete-create`, `create-trash`) don’t apply to it. When the path exists, the call fails and says so; for a journal entry, the skill then takes the next session number (`file-schemas.md` § `journal/`). A backend that can’t refuse a create atomically may realize “fails, writing nothing” as create, check, and withdraw its own losing duplicate: it takes the duplicate out of every selector and listing without deleting it, and reports where it is, so the author can delete it (the binding says when and how it does this). The plugin never deletes it itself: a deletion is the author’s. A migration’s copy is not a new entry: it writes each entry at its existing number with a plain `write` (`file-schemas.md` § Entry collections, Numbers come from the store).

For a **numbered entry** the store assigns the number and **reports it**, and the skill uses the reported number from then on (the index row, the journal entry, a question’s `resolved_by`, prose that cites it), never the one it proposed:

- **File stores:** one more than the highest number in the collection’s listing, compared numerically (`D-1000` above `D-999`), or `001` when the collection is empty, written with `new`; when that path turns out to exist (another session took the number between the listing and the create), take the next number and try again.
- **Notion:** the binding’s own numbering (its § IDs), which renumbers on a collision the same way.
- **The StoryStormer app:** display numbers by creation order, assigned by the server.

The skill proposes a number in the path and in the entry (`id`, and any citation of it inside the content of the same call); when the store assigns another, the binding writes the assigned number in all of them before the content lands, and the report names both.

**The final newline.** A document’s final newline is not content: `read` returns every document ending in exactly one newline, and the no-op check and the concurrency guard ignore a missing or extra final newline.

---

## Capabilities

Every binding publishes one line, in this order:

```
identity: path | id
write:    native | delete-create | create-trash
edit:     native | read-modify-write
list:     glob | folder-walk | query
history:  snapshots | native | versions
open:     pane | url
size:     <read cap> / <write cap>
confirm:  none | batch
```

- **`identity`:** `path` means the store addresses documents by path; `id` means it addresses objects by id and the binding keeps the path-to-object map.
- **`write`:** `native` overwrites in place; `delete-create` overwrites by deleting the old document and then creating the new one; `create-trash` creates a new object and trashes the old, so the id changes on every write. Neither is atomic, so a binding with either value states its recovery: keep the new content in hand, retry the create, and if it still fails write back the prior content (the snapshot or the read that preceded the write). **No call may end with the path absent**, and the report says what happened.
- **`edit`:** `native` applies the edit grammar in the store; `read-modify-write` reads, applies the edits in the model under the same failure rule, then writes through the binding’s `write`.
- **`list`:** `glob` matches the glob in the store; `folder-walk` walks the tree from the root and filters by the glob in the model; `query` answers from a query over the project’s rows.
- **`history`:** `snapshots` means prior versions exist only as the snapshot files skills write (§ Local-mode clauses); `native` means the backend keeps its own history, which the binding may not be able to read; `versions` means the backend keeps versions that `store.history` returns.
- **`open`:** `pane` presents the document in the host’s reading pane; `url` hands the author a link the binding supplies.
- **`size`:** the largest document one read and one write can carry (`unbounded` when there is no practical cap); the binding says how it handles anything larger.
- **`confirm`:** `none` means the backend’s tools ask nothing of the author for ordinary writes. A binding may still have a confirmation-gated call, such as a delete; it names the call and says what satisfies the gate, which is never assumed to be the plan-first approval (a connector may demand the author’s explicit ask for that specific item, as Notion’s trash does); `batch` means the connector asks for confirmation per mutation and the plan-first approval answers it (§ Confirmation posture).

---

## Resolve

Every skill and command runs this before its first store operation. It happens **once per project per session**: when the conversation already holds a binding for the project the author is working on, skip it; when the author points at a different folder or project, resolve again and replace the remembered binding.

Resolution reads the open folder’s config through the local binding (`references/store/local.md`), whatever `kind` it turns out to name; that read is the one store operation that precedes resolution.

1. **An open working folder holds `.storystormer/config.json`.** Its `storage` block decides the binding:

   ```json
   "storage": {
     "kind": "local | dropbox | notion | storystormer",
     "root": "<dropbox folder path | notion project page id | storystormer project id>",
     "local_root": "<optional absolute path of the synced folder on this machine>"
   }
   ```

   - No `storage` block, or `kind: local` → the **local** binding, rooted at the open folder. (A project created before this contract has no block and is local.)
   - A `local_root` that exists on this machine → the **local** binding, rooted at `local_root` (the synced copy of the connector’s folder), even when the config was opened from somewhere else.
   - Otherwise → the binding for `kind`, rooted at `root`, if its connector is present. If it is not, tell the author which connector to connect, and stop.

   The config lives in the store: a real file where the binding stores it, computed from the project’s record where it does not. Nothing mirrors `storage` (`file-schemas.md` § `.storystormer/config.json`).

   `local_root` only ever names the synced copy of a Dropbox `root` on this machine (`<Dropbox sync root>/StoryStormer/<slug>`): in the full config inside that folder, or in the config of a folder `migrate` moved there (`migrate` § The hybrid), so opening the old folder reaches the new copy. Nothing writes a `local_root` naming any other folder: resolution would bind it locally and bypass the connector.
2. **No open folder holds a config.** Run the **locator**. `init` starting a new project is the exception: it chooses the store itself (`storystormer-init` § Where a new project lives).
   - **Search:** every binding in § Bindings that is not pending and whose tool check passes (step 3) runs its § Locate, which lists the projects at that backend’s well-known root. Each project comes back with its backend, root, slug, the `title`, `stage` and `last_session` of its `state.md` frontmatter as that binding reads it, and the time its `state.md` was last modified where the backend reports one. A series is one entry, the series, with its `books` named under it.
   - **Present** them grouped by backend, most recent `last_session` first, each with its last-modified time, and a project whose config’s `local_root` exists on this machine labeled as synced here (choosing it binds that folder, below); the author picks one, and its root becomes the binding’s root. That project’s stored config then decides as in step 1 (a Dropbox project whose `local_root` exists on this machine binds local, rooted there), with one exception: a located config whose `kind` is `local`, or that has no `storage` block (a local project sitting in a synced folder), binds the backend that found it, at that root, since it is the same files; the listing says it is a synced local project. Go on to step 3.
   - **Exactly one project** across every backend, with no Locate failed or incomplete: bind it and say so.
   - **None:** say which backends were searched (and which weren’t, for want of their connector), that a local project is reached by opening its folder, and offer `init`.
   - **A Locate that fails** (a connector error, a partial Notion hub) is reported with what is missing, beside the other backends’ results; it never hides them.
   - **The same slug on two backends** (a copy `migrate` left behind, since it never modifies its source): list both, marked as sharing the slug, with their `last_session` and last-modified times side by side so the author can tell them apart, and let the author pick; don’t guess which is current.
   - **After binding,** the first response opens with the bound backend, root and capabilities line, so the author can see where the session is working.
3. **Load the binding** named in § Bindings. Confirm every tool its tool list requires is present (a tool it marks optional or preferred, with a fallback, never fails the check); if one is missing, name it and stop before any operation.
4. **The layout.** Read `layout` from the project’s own config through the bound store (a pointer carries none, so it is never the one read; a config the binding computes from the project’s record is the project’s own, never a pointer, even when it renders as `storage` alone). `2` → go on. **Absent** → the project is in the old layout (`file-schemas.md` § The old layout): before any other work, tell the author, and offer the in-place upgrade that `migrate` performs, whose preflight is the plan. Until it runs, the session may read the old documents and answer from them. A skill that would write any layout-dependent document (the logs, `state.md`, the journal, an index) stops before writing anything at all, explains, and offers the upgrade; it never does its other writes and skips the recording. A cross-backend `migrate` from an old-layout source writes the target in layout 2 and leaves the source as it is. `init` creating a project has no config yet; it writes `2` and skips this step.

**What the session remembers:** the binding (its `kind` and document path), the root, the capabilities line, and the layout. They stay in the conversation for the rest of the session; later skills use them without resolving again.

**Subagents never resolve.** Every subagent brief carries all four, and because a subagent cannot reach the plugin bundle, it also carries the binding’s realization of each operation the subagent will use **and the clauses below that its work triggers**: the snapshot clause with the snapshot paths it must write, the concurrency guard with the baseline each target was read at (its `version`, or its whole content when it has none), and the documents it must not write because they are computed. The subagent reaches the store only through that binding.

---

## Local-mode clauses

Behaviors the plugin has always had on a local folder are clauses keyed on the capabilities line. Skills say “snapshot per `store.md`” or “regenerate the index per `store.md`” and follow the clause here; they do not restate it.

- **Snapshot**, before a write or edit replaces a document `file-schemas.md` says to snapshot:
  - `history: snapshots` → write the current version to its snapshot path, and finish that before the overwrite begins. Where the binding names a `copy` realization (a copy made by the store itself, so the content never passes through the model), use it, for the whole set in as few calls as it allows; otherwise `read` the current version and `write` it. Book-level documents go to `.storystormer/history/<timestamp>-<operation>/` as `file-schemas.md` § `.storystormer/history/` describes (including which files snapshot together as a set); chapter artifacts go to the `.history/` folder inside their own chapter folder (`chapters/chapter-NN/.history/`, or `books/<slug>/chapters/chapter-NN/.history/` in a series) as § `chapters/` folder → Per-chapter history describes. Inside a book-level snapshot folder each file keeps its root-relative path (`books/book-2/treatment.md` in a series), so `history` can tell two books’ documents apart.
  - `history: native` or `versions` → write no snapshot; the backend keeps the prior version, and the report says so instead of naming a snapshot folder.
- **Indexes and config:** `characters/_index.md`, `decisions/_index.md`, `questions/_index.md`, `outline/_index.md`, `voice/README.md` and `.storystormer/config.json`. The binding lists each as **stored** or **computed**. Stored → skills regenerate and `write` it as `file-schemas.md` describes; the two entry indexes are kept one row at a time instead (`file-schemas.md` § Who rebuilds an index). Computed → `read` returns the backend’s rendering and skills never write it. A step that only regenerates it is skipped. A step that changes a value the author owns (a `state.md` field such as `current_focus` or `target_word_count` where the binding computes `state.md`) goes through the writable realization the binding names for it; a binding that computes a document lists every such realization, and where it names none for a value the author asked to change, say so rather than skip it silently. A binding may compute other documents too (for example `state.md`) under the same rule.
- **`open`:** `pane` → present the document itself in the host’s reading pane so the author reads it beside the chat; never paste a stored document’s contents into the conversation to show it. (Showing a draft for approval before it is written is ordinary conversation, not `open`.) `url` → give the author the binding’s link for the document. Where the host offers neither, name the path.

---

## Concurrency guard

Applies on every binding except local, because a connector store can change between calls (another device, the app). The **baseline** is the read the new content was prepared from; later reads (the snapshot’s included) never move it. Before a `write` or `edit` that replaces an existing document, re-read it and compare: its frontmatter `version` with the baseline’s, or, for a document without one (`state.md`, a decision, question or journal entry), the whole re-read with the whole baseline read, where any difference means it changed (a binding that computes a document names the parts it compares instead). A `new` write replaces nothing and needs no guard (§ New entries). If it **differs from the baseline**, stop: show the author both versions (what the store holds now and what this session was about to write) and write nothing until they choose; don’t snapshot the newer version as if it were the one being replaced. After that, last write wins; the backend’s history keeps the losing version.

A binding may name an **equivalent check** that doesn’t re-read the whole document: a revision or modification stamp recorded at the baseline (from the baseline read’s response, or from this session’s own last write of the path) and compared through the store’s metadata. A matching stamp passes the guard. A stamp that differs, a missing stamp, or a check that can’t answer falls back to the full re-read, which decides as above (a stamp can move without the content changing), so a real change is still stopped and shown to the author the same way.

---

## Confirmation posture

The plan-first approval (`references/plan-first.md`) is the confirmation for every write, edit, move and delete in that run; don’t ask again per file. A binding whose connector asks for confirmation before each mutation (`confirm: batch`) says so, states that the plan-first approval satisfies that request, and tells the model not to re-ask per file. Work outside the approved plan still needs its own approval.

---

## Bindings

| Backend (`kind`) | Binding document | Tier | Verified on |
|---|---|---|---|
| `local` | `references/store/local.md` | 1 | 2026-10-15 |
| `dropbox` | `references/store/dropbox.md` | 2 | 2026-10-16 |
| `notion` | `references/store/notion.md` | 1 | 2026-10-16 |
| `storystormer` | `references/store/storystormer.md` | 1 | pending |

Tier 1 realizes every operation directly; tier 2 needs a load-bearing workaround (Dropbox overwrites by delete and create). A **pending** binding is not written yet: a project whose `kind` names one cannot resolve, and the author is told so.

Every binding opens with its capabilities line; the tools it expects, with connector tools named as “the <Connector> connector’s `<short name>`” and never by prefixed id (ids differ per user and per surface); which documents it stores and which it computes; and its verified-on date. Then it gives one realization per operation, its § Locate (what it lists at its well-known root, how it reads each project’s fields, what it returns, how it fails and roughly what it costs), and its quirks.
