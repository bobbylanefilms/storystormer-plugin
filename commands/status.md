---
description: Show the current state of the story project — what exists, what's next, how things stand
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Task", "mcp__*"]
---

# /storystormer:status

Resolve the store first per `references/store.md` if the session hasn't. `store.read` `state.md` and present its contents to the user in a scannable summary. Also surface any document the plugin manages (one `references/file-schemas.md` defines) that exists in the project but `state.md` doesn't mention (a drift check). Snapshot and history folders, `journal/`, the entries in `decisions/` and `questions/` (counted from their indexes, not listed one by one), `research/`, and the author's own folders aren't inventory; don't report them as drift.

What to report:

1. **Title, genre, project type, stage** — from `state.md` frontmatter.
2. **What exists** — primer/treatment/manifest versions, character bios with their types, worldbuilding elements by type, decisions/questions counts. Cross-check `state.md → What Exists` against the documents actually in the project (enumerate them with `store.list`; the decision and question counts come from `decisions/_index.md` and `questions/_index.md`); flag any drift.
3. **What's next** — `state.md → What's Next` verbatim.
4. **Last session** — `state.md → Last Session` verbatim.
5. **Open questions summary** — top 3 critical/important open questions, picked from `questions/_index.md` (titles from the index; read an entry only if the user asks for more).
6. **Unintegrated decisions count** — from the index's Integrated column, and if ≥ 5, mention that a `/storystormer:treatment-update` would be reasonable.
7. **Recent sessions** — only when the user asks for history (*"what have we done lately?"*, *"status with history"*): `store.list(journal/*.md)`, read the newest two or three entries, and give a line or two on each. The journal is never read by default.

This command does not modify any files. It's a read-only status report.

Format the output as a short, scannable summary — not a wall of text. The user wants to glance at it and know where things stand.
