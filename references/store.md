<!-- ABOUTME: The store contract: the file operations every skill and command uses instead of host or connector tools -->
<!-- ABOUTME: Operations, the capabilities line, once-per-session resolution and the locator, local-mode clauses, concurrency guard, confirmation posture, bindings -->

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
| `store.write(path, content)` | replaces the whole document with `content`, creating it (and its parent folders) when absent; writing identical content is a no-op |
| `store.edit(path, edits, reason)` | applies anchored string edits, all or nothing (below) |
| `store.history(path)` | returns the document’s prior versions, or says where the author can find them when the backend keeps them out of reach |
| `store.open(path)` | presents the document to the author (§ Local-mode clauses) |
| `store.move(from, to)` | *optional.* Where the binding has none: `read(from)`, `write(to, …)`, then `delete(from)`; a binding that cannot delete says what it does instead |
| `store.delete(path)` | *optional.* Bindings use it inside `write` and `move`; skills call it directly only to clear an intake original they have just archived or re-filed (`storystormer-init`). A binding that can’t delete names the path for the author to remove |

**The edit grammar.** `edits` is an ordered list; each item gives an exact `old` string, its `new` replacement, and optionally `replace_all`. Edits apply in order, each against the result of the one before, and anchors match the document exactly as `read` returns it, frontmatter included. Without `replace_all`, `old` must occur exactly once; with it, at least once. An anchor that is missing, or that occurs more than once without `replace_all`, **fails the whole call**: nothing is written, and the error names the anchor. Quote more surrounding text and call again. `reason` is a short note of why; bindings with native history or versions record it, others drop it.

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
- **`confirm`:** `none` means the backend’s tools ask nothing of the author (a binding may still pass a confirmation flag on a call, such as a delete, which the plan-first approval supplies; the binding names it); `batch` means the connector asks for confirmation per mutation and the plan-first approval answers it (§ Confirmation posture).

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

   The config lives in the store: a real file where the binding stores it, computed from the project’s record where it does not. `state.md` frontmatter mirrors `kind` as `storage_kind`.

   `local_root` only ever names the synced copy of a Dropbox `root` on this machine (`<Dropbox sync root>/StoryStormer/<slug>`): in the full config inside that folder, or in the config of a folder `migrate` moved there (`migrate` § The hybrid), so opening the old folder reaches the new copy. Nothing writes a `local_root` naming any other folder: resolution would bind it locally and bypass the connector.
2. **No open folder holds a config.** Run the **locator**. `init` starting a new project is the exception: it chooses the store itself (`storystormer-init` § Where a new project lives).
   - **Search:** every binding in § Bindings that is not pending and whose tool check passes (step 3) runs its § Locate, which lists the projects at that backend’s well-known root. Each project comes back with its backend, root, slug, and the `title`, `stage` and `last_session` of its `state.md` frontmatter as that binding reads it. A series is one entry, the series, with its `books` named under it.
   - **Present** them grouped by backend, most recent `last_session` first; the author picks one, and its root becomes the binding’s root. That project’s stored config then decides as in step 1 (a Dropbox project whose `local_root` exists on this machine binds local, rooted there), with one exception: a located config whose `kind` is `local`, or that has no `storage` block (a local project sitting in a synced folder), binds the backend that found it, at that root, since it is the same files; the listing says it is a synced local project. Go on to step 3.
   - **Exactly one project** across every backend, with no Locate failed or incomplete: bind it and say so.
   - **None:** say which backends were searched (and which weren’t, for want of their connector), that a local project is reached by opening its folder, and offer `init`.
   - **A Locate that fails** (a connector error, a partial Notion hub) is reported with what is missing, beside the other backends’ results; it never hides them.
   - **The same slug on two backends** (a copy `migrate` left behind, since it never modifies its source): list both, marked as sharing the slug, and let the author pick; don’t guess which is current.
   - **After binding,** the first response opens with the bound backend, root and capabilities line, so the author can see where the session is working.
3. **Load the binding** named in § Bindings. Confirm every tool in its tool list is present; if one is missing, name it and stop before any operation.

**What the session remembers:** the binding (its `kind` and document path), the root, and the capabilities line. They stay in the conversation for the rest of the session; later skills use them without resolving again.

**Subagents never resolve.** Every subagent brief carries all three, and because a subagent cannot reach the plugin bundle, it also carries the binding’s realization of each operation the subagent will use **and the clauses below that its work triggers**: the snapshot clause with the snapshot paths it must write, the concurrency guard with the baseline each target was read at (its `version`, or its whole content when it has none), and the documents it must not write because they are computed. The subagent reaches the store only through that binding.

---

## Local-mode clauses

Behaviors the plugin has always had on a local folder are clauses keyed on the capabilities line. Skills say “snapshot per `store.md`” or “regenerate the index per `store.md`” and follow the clause here; they do not restate it.

- **Snapshot**, before a write or edit replaces a document `file-schemas.md` says to snapshot:
  - `history: snapshots` → `read` the current version and `write` it to its snapshot path, and finish that before the overwrite begins. Book-level documents go to `.storystormer/history/<timestamp>-<operation>/` as `file-schemas.md` § `.storystormer/history/` describes (including which files snapshot together as a set); chapter artifacts go to the `.history/` folder inside their own chapter folder (`chapters/chapter-NN/.history/`, or `books/<slug>/chapters/chapter-NN/.history/` in a series) as § `chapters/` folder → Per-chapter history describes. Inside a book-level snapshot folder each file keeps its root-relative path (`books/book-2/treatment.md` in a series), so `history` can tell two books’ documents apart.
  - `history: native` or `versions` → write no snapshot; the backend keeps the prior version, and the report says so instead of naming a snapshot folder.
- **Indexes and config:** `characters/_index.md`, `outline/_index.md`, `voice/README.md` and `.storystormer/config.json`. The binding lists each as **stored** or **computed**. Stored → skills regenerate and `write` it as `file-schemas.md` describes. Computed → `read` returns the backend’s rendering and skills never write it. A step that only regenerates it is skipped. A step that changes a value the author owns (a config field such as `current_focus` or `target_word_count`, a new decision) goes through the writable realization the binding names for it; a binding that computes a document lists every such realization, and where it names none for a value the author asked to change, say so rather than skip it silently. A binding may compute other documents too (for example `decisions.md`) under the same rule.
- **`open`:** `pane` → present the document itself in the host’s reading pane so the author reads it beside the chat; never paste a stored document’s contents into the conversation to show it. (Showing a draft for approval before it is written is ordinary conversation, not `open`.) `url` → give the author the binding’s link for the document. Where the host offers neither, name the path.

---

## Concurrency guard

Applies on every binding except local, because a connector store can change between calls (another device, the app). The **baseline** is the read the new content was prepared from; later reads (the snapshot’s included) never move it. Before a `write` or `edit` that replaces an existing document, re-read it and compare: its frontmatter `version` with the baseline’s, or, for a document without one (`decisions.md`, `questions.md`, `state.md`), the whole re-read with the whole baseline read, where any difference means it changed (a binding that computes a document names the parts it compares instead). If it **differs from the baseline**, stop: show the author both versions (what the store holds now and what this session was about to write) and write nothing until they choose; don’t snapshot the newer version as if it were the one being replaced. After that, last write wins; the backend’s history keeps the losing version.

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
