<!-- ABOUTME: The store contract: the file operations every skill and command uses instead of host or connector tools -->
<!-- ABOUTME: Operations, the capabilities line, once-per-session resolution, local-mode clauses, concurrency guard, confirmation posture, bindings -->

# Store Contract

A story lives in a **store**: a local folder, a Dropbox folder, a Notion workspace, or the StoryStormer server. Skills and commands never touch a store directly. They call the operations below on the paths `references/file-schemas.md` defines, and a **binding** document (§ Bindings) says how each operation is realized on one backend. Skills may read the binding’s capabilities line and follow the clauses here that key on it; **they never special-case a backend by name and never name a host or connector tool.** Only bindings do.

Resolve first (§ Resolve), once per session. After that, the work is the same on every backend.

---

## Operations

Paths are relative to the project root, in `file-schemas.md`’s grammar (`treatment.md`, `characters/<slug>.md`, `chapters/chapter-NN/ch<NN>-prose.md`, `books/<slug>/…` in a series). Where a binding’s identity is `id`, the binding maps paths to objects; skills still pass paths.

| Operation | Does |
|---|---|
| `store.list(glob)` | returns the paths under the root that match `glob` (`**` crosses folders, `*` stays within one) |
| `store.read(path)` | returns the whole document as markdown, frontmatter first; a missing path is an error, never an empty document |
| `store.write(path, content)` | replaces the whole document with `content`, creating it (and its parent folders) when absent; writing identical content is a no-op |
| `store.edit(path, edits, reason)` | applies anchored string edits, all or nothing (below) |
| `store.history(path)` | returns the document’s prior versions, or says where the author can find them when the backend keeps them out of reach |
| `store.open(path)` | presents the document to the author (§ Local-mode clauses) |
| `store.move(from, to)` | *optional.* Where the binding has none: `read(from)`, `write(to, …)`, then `delete(from)`; a binding that cannot delete says what it does instead |
| `store.delete(path)` | *optional.* Bindings use it inside `write` and `move`; skills reach it only through `move` |

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
- **`write`:** `native` overwrites in place; `delete-create` overwrites by deleting the old document and then creating the new one; `create-trash` creates a new object and trashes the old, so the id changes on every write.
- **`edit`:** `native` applies the edit grammar in the store; `read-modify-write` reads, applies the edits in the model under the same failure rule, then writes through the binding’s `write`.
- **`list`:** `glob` matches the glob in the store; `folder-walk` walks the tree from the root and filters by the glob in the model; `query` answers from a query over the project’s rows.
- **`history`:** `snapshots` means prior versions exist only as the snapshot files skills write (§ Local-mode clauses); `native` means the backend keeps its own history, which the binding may not be able to read; `versions` means the backend keeps versions that `store.history` returns.
- **`open`:** `pane` presents the document in the host’s reading pane; `url` hands the author a link the binding supplies.
- **`size`:** the largest document one read and one write can carry (`unbounded` when there is no practical cap); the binding says how it handles anything larger.
- **`confirm`:** `none` means the backend’s tools ask nothing; `batch` means the connector asks for confirmation per mutation and the plan-first approval answers it (§ Confirmation posture).

---

## Resolve

Every skill and command runs this before its first store operation. It happens **once per session**: when the conversation already holds a binding, skip it.

1. **An open working folder holds `.storystormer/config.json`.** Its `storage` block decides the binding:

   ```json
   "storage": {
     "kind": "local | dropbox | notion | storystormer",
     "root": "<dropbox folder path | notion project page id | storystormer project id>",
     "local_root": "<optional absolute path of the synced folder on this machine>"
   }
   ```

   - No `storage` block, `kind: local`, or a `local_root` that exists on this machine → the **local** binding, rooted at the open folder. (A project created before this contract has no block and is local.)
   - Otherwise → the binding for `kind`, rooted at `root`, if its connector is present. If it is not, tell the author which connector to connect, and stop.

   The config lives in the store: a real file where the binding stores it, computed from the project’s record where it does not. `state.md` frontmatter mirrors `kind` as `storage_kind`.
2. **No open folder holds a config.** The **locator** looks for projects at each present connector’s well-known root, lists them, and binds the one the author picks. The locator’s behavior is specified separately and is not part of this contract. `init` starting a new project is the exception: it chooses the store itself.
3. **Load the binding** named in § Bindings. Confirm every tool in its tool list is present; if one is missing, name it and stop before any operation.

**What the session remembers:** the binding (its `kind` and document path), the root, and the capabilities line. They stay in the conversation for the rest of the session; later skills use them without resolving again.

**Subagents never resolve.** Every subagent brief carries all three, and because a subagent cannot reach the plugin bundle, it also carries the binding’s realization of each operation the subagent will use. The subagent reaches the store only through that binding.

---

## Local-mode clauses

Behaviors the plugin has always had on a local folder are clauses keyed on the capabilities line. Skills say “snapshot per `store.md`” or “regenerate the index per `store.md`” and follow the clause here; they do not restate it.

- **Snapshot**, before a write or edit replaces a document `file-schemas.md` says to snapshot:
  - `history: snapshots` → `read` the current version and `write` it to its snapshot path, and finish that before the overwrite begins. Book-level documents go to `.storystormer/history/<timestamp>-<operation>/` as `file-schemas.md` § `.storystormer/history/` describes (including which files snapshot together as a set); chapter artifacts go to `chapters/chapter-NN/.history/` as § `chapters/` folder → Per-chapter history describes.
  - `history: native` or `versions` → write no snapshot; the backend keeps the prior version, and the report says so instead of naming a snapshot folder.
- **Indexes and config:** `characters/_index.md`, `outline/_index.md`, `voice/README.md` and `.storystormer/config.json`. The binding lists each as **stored** or **computed**. Stored → skills regenerate and `write` it as `file-schemas.md` describes. Computed → `read` returns the backend’s rendering, skills never write it, and a step that would update it is skipped. A binding may compute other documents too; it lists them and names any writable realization they have (for example, how a new decision is recorded).
- **`open`:** `pane` → present the document itself in the host’s reading pane so the author reads it beside the chat; never paste its contents into the conversation. `url` → give the author the binding’s link for the document. Where the host offers neither, name the path.

---

## Concurrency guard

Applies on every binding except local, because a connector store can change between calls (another device, the app). Before a `write` or `edit` that replaces an existing document, re-read its frontmatter `version` (a document without one is not guarded). If it is **higher than the version this session read**, stop: show the author both versions (what the store holds now and what this session was about to write) and write nothing until they choose. After that, last write wins; the backend’s history keeps the losing version.

---

## Confirmation posture

The plan-first approval (`references/plan-first.md`) is the confirmation for every write, edit, move and delete in that run; don’t ask again per file. A binding whose connector asks for confirmation before each mutation (`confirm: batch`) says so, states that the plan-first approval satisfies that request, and tells the model not to re-ask per file. Work outside the approved plan still needs its own approval.

---

## Bindings

| Backend (`kind`) | Binding document | Tier | Verified on |
|---|---|---|---|
| `local` | `references/store/local.md` | 1 | 2026-10-15 |
| `dropbox` | `references/store/dropbox.md` | 2 | pending |
| `notion` | `references/store/notion.md` | 1 | pending |
| `storystormer` | `references/store/storystormer.md` | 1 | pending |

Tier 1 realizes every operation directly; tier 2 needs a load-bearing workaround (Dropbox overwrites by delete and create). A **pending** binding is not written yet: a project whose `kind` names one cannot resolve, and the author is told so.

Every binding opens with its capabilities line; the tools it expects, with connector tools named as “the <Connector> connector’s `<short name>`” and never by prefixed id (ids differ per user and per surface); which documents it stores and which it computes; and its verified-on date. Then it gives one realization per operation, and its quirks.
