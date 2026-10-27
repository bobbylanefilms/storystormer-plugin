---
description: Snapshot the current state of all story files to .storystormer/history/ as a manual checkpoint, or, where the store keeps versions itself, report what changed since a point in time
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Task", "mcp__*"]
---

# /storystormer:checkpoint

Snapshot the current state of every plugin-managed file to a timestamped checkpoint folder under `.storystormer/history/`. Since the plugin is git-agnostic, this is the only way to manually preserve a known-good state before a risky operation or at a meaningful milestone.

What to capture: **every document `references/file-schemas.md` defines for the project**, wherever it exists:

- the book-level documents (`state.md`, `primer.md`, `treatment.md`, `manifest.md`, and `series.md` in a series);
- the entry collections (`decisions/`, `questions/`, `journal/`: every entry and both indexes);
- canon (`characters/`, `worldbuilding/`, recursive);
- the outline (`outline/`) and every file in each chapter folder (`chapters/chapter-NN/`, recursive: outlines, blueprints, prose, scenes, notes, `kitbash/` drafts, generation packets), except its `.history/`;
- voice (`voice/`, recursive, including `voice/samples/`);
- notes and records (canon-sync run records);
- config and the genre reference (`.storystormer/config.json`, its `layout` and `storage`; `.storystormer/genre-reference.md`, defined in `references/genres.md` and costly to regenerate).

In a series, that is the series-level documents and the collections (which live only at the root) plus the per-book set under each `books/<slug>/`.

Do **not** capture:

- the history folders themselves (`.storystormer/history/` and each chapter's `.history/`), so there are no recursive snapshots;
- `research/` (research files are generally append-only and don't need versioning);
- anything not listed above, such as an author's own folders (`pipeline/`, scripts, exports). They aren't the plugin's to copy.

Only text documents are copied. A non-text file inside a captured folder (an intake-stashed `.docx`, an image) can't round-trip through `store.read`/`store.write`; list it in the report as not captured rather than writing a broken copy.

Follow `references/store.md`, resolving the binding first if the session hasn't.

## What to do

1. **Check the backend keeps no history of its own.** Where the binding's `history` capability is `native`, refuse and write nothing. If the binding documents a `checkpoint` refusal, give that message word for word. Otherwise refuse in one line: the backend already keeps every prior version of each document, so a copy would only duplicate it; point the author at the backend's own history (`store.history` shows what the binding can reach). Stop. Where it is `versions`, write nothing either: report what changed instead (§ On a store that keeps versions), and stop.
2. Enumerate what exists with `store.list` over the patterns above (`**` for the recursive folders), then drop anything the exclusions rule out.
3. Ask the user for an optional label for the checkpoint, naming the folder and the count — *"I'll copy 31 files to `.storystormer/history/2026-10-16T09-12-manual/`. Want to name this checkpoint? (Optional — defaults to 'manual')"*. Names like `pre-act-3-rework` or `before-genre-pivot` make later browsing easier. The target folder is `.storystormer/history/<YYYY-MM-DD>T<HH-MM>-<label>/` in the session's local time. If that folder already exists (two checkpoints in one minute), append `-2`, `-3`, … until the name is new; never write into an existing checkpoint folder.
4. Copy each document into the target folder per `references/store.md` § Local-mode clauses → Snapshot: through the binding's `copy` realization when it names one (the store copies the files itself, as few calls as it allows), otherwise `store.read` it, then `store.write` it to the target path. Either way each keeps its root-relative path (`characters/marlowe.md` becomes `<target>/characters/marlowe.md`; `chapters/chapter-07/ch07-prose.md` becomes `<target>/chapters/chapter-07/ch07-prose.md`). Don't assume a shell is available; the copy must work whether you're in Claude Code or Cowork.
5. Report what was captured, grouped by kind with counts (e.g. "6 book-level documents, 9 characters, 12 chapters' artifacts"), and the folder path. Short summary.

This is a no-question-asked safe operation. It only writes new files; it never overwrites or deletes anything. No plan needed beyond step 3: the author’s answer there, given with the target folder and file count in view, is the approval for the whole run (`references/store.md` § Confirmation posture). On a binding with `confirm: batch`, don’t ask again per file.

## On a store that keeps versions

`history: versions` means the store keeps every document's versions and `store.history` returns them, so a copy would only duplicate them. Instead, report **what changed since** a point:

1. **The point.** Take it from the request, or ask: a date or time, a session (its journal entry's date), or a label, such as an earlier checkpoint's folder name from before the project moved here, or words matching a version's description. Turn it into a time and say which time you used.
2. **What changed.** Enumerate the documents with `store.list` over the patterns above, then call `store.history` for each through the binding's realization (a binding may name a cheaper one over a whole project; use it). A document changed if it has versions after the point; one the binding reports with no versions of its own counts as changed when its last change is after the point.
3. **Report** the changed documents grouped by kind, each with how many versions it gained since the point (none for the documents without versions; where the binding can return only a bounded number, say it as a lower bound, such as “50+”, never as an exact count), and the count of documents unchanged. Computed documents carry neither versions nor a last-change time, so leave them out and say so in one line. Name where the author can see or restore a version (`store.open`). Write nothing.

This is read-only, so it needs no plan and no approval.
