---
description: Snapshot the current state of all story files to .storystormer/history/ as a manual checkpoint
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Task", "mcp__*"]
---

# /storystormer:checkpoint

Snapshot the current state of every plugin-managed file to a timestamped checkpoint folder under `.storystormer/history/`. Since the plugin is git-agnostic, this is the only way to manually preserve a known-good state before a risky operation or at a meaningful milestone.

What to capture: **every document `references/file-schemas.md` defines for the project**, wherever it exists:

- the book-level documents (`state.md`, `primer.md`, `treatment.md`, `manifest.md`, `decisions.md`, `questions.md`, and `series.md` in a series);
- canon (`characters/`, `worldbuilding/`, recursive);
- the outline (`outline/`) and every file in each chapter folder (`chapters/chapter-NN/`, recursive: outlines, blueprints, prose, scenes, notes, `kitbash/` drafts, generation packets), except its `.history/`;
- voice (`voice/`, recursive, including `voice/samples/`);
- notes and records (canon-sync run records);
- config and the genre reference (`.storystormer/config.json`, `.storystormer/genre-reference.md`; the reference is defined in `references/genres.md` and is costly to regenerate).

In a series, that is the series-level documents plus the same set under each `books/<slug>/`.

Do **not** capture:

- the history folders themselves (`.storystormer/history/` and each chapter's `.history/`), so there are no recursive snapshots;
- `research/` (research files are generally append-only and don't need versioning);
- anything not listed above, such as an author's own folders (`pipeline/`, scripts, exports). They aren't the plugin's to copy.

Only text documents are copied. A non-text file inside a captured folder (an intake-stashed `.docx`, an image) can't round-trip through `store.read`/`store.write`; list it in the report as not captured rather than writing a broken copy.

Follow `references/store.md`, resolving the binding first if the session hasn't.

## What to do

1. **Check the backend keeps no history of its own.** Where the binding's `history` capability is `native` or `versions`, refuse in one line and write nothing: the backend already keeps every prior version of each document, so a copy would only duplicate it. Point the author at the backend's own history (`store.history` shows what the binding can reach). Stop.
2. Ask the user for an optional label for the checkpoint — *"Want to name this checkpoint? (Optional — defaults to 'manual')"*. Names like `pre-act-3-rework` or `before-genre-pivot` make later browsing easier.
3. Compose the target folder name: `.storystormer/history/<YYYY-MM-DD>T<HH-MM>-<label>/`. If that folder already exists (two checkpoints in one minute), append `-2`, `-3`, … until the name is new; never write into an existing checkpoint folder. Enumerate what exists with `store.list` over the patterns above (`**` for the recursive folders), then drop anything the exclusions rule out.
4. Copy each document into the target folder: `store.read` it, then `store.write` it to the target path, keeping its root-relative path (`characters/marlowe.md` becomes `<target>/characters/marlowe.md`; `chapters/chapter-07/ch07-prose.md` becomes `<target>/chapters/chapter-07/ch07-prose.md`). Don't assume a shell is available; the copy must work whether you're in Claude Code or Cowork.
5. Report what was captured, grouped by kind with counts (e.g. "6 book-level documents, 9 characters, 12 chapters' artifacts"), and the folder path. Short summary.

This is a no-question-asked safe operation. It only writes new files; it never overwrites or deletes anything. No plan needed beyond confirming the label.
