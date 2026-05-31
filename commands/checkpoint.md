---
description: Snapshot the current state of all story files to .storystormer/history/ as a manual checkpoint
allowed-tools: ["Read", "Write", "Glob"]
---

# /storystormer:checkpoint

Snapshot the current state of every plugin-managed file to a timestamped folder under `.storystormer/history/`. Since the plugin is git-agnostic, this is the only way to manually preserve a known-good state before a risky operation or at a meaningful milestone.

What to capture:

- `state.md`
- `primer.md` (if it exists)
- `treatment.md` (if it exists)
- `manifest.md` (if it exists)
- `decisions.md` (if it exists)
- `questions.md` (if it exists)
- `characters/` (all files in the directory)
- `worldbuilding/` (all files, recursive)
- `.storystormer/config.json`
- `.storystormer/genre-reference.md` (if it exists)

Do **not** capture `.storystormer/history/` itself (no recursive snapshots) or `research/` (research files are generally append-only and don't need versioning).

## What to do

1. Ask the user for an optional label for the checkpoint — *"Want to name this checkpoint? (Optional — defaults to 'manual')"*. Names like `pre-act-3-rework` or `before-genre-pivot` make later browsing easier.
2. Compose the target folder name: `.storystormer/history/<YYYY-MM-DD>T<HH-MM>-<label>/`. Use `Glob` to enumerate the contents of `characters/` and `worldbuilding/` so the recursive captures are complete.
3. Copy every named file into the target folder, preserving subfolder structure (`characters/marlowe.md` becomes `<target>/characters/marlowe.md`). Do this with the file tools — `Read` each source file and `Write` its contents to the target path. Don't assume a shell is available; the copy must work whether you're in Claude Code or Cowork.
4. Report what was captured and the folder path. Short summary.

This is a no-question-asked safe operation. It only writes new files; it never overwrites or deletes anything. No plan needed beyond confirming the label.
