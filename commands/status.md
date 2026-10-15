---
description: Show the current state of the story project — what exists, what's next, how things stand
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Task", "mcp__*"]
---

# /storystormer:status

`store.read` `state.md` and present its contents to the user in a scannable summary. Also surface anything that the file-system says exists but `state.md` doesn't mention (a drift check).

What to report:

1. **Title, genre, project type, stage** — from `state.md` frontmatter.
2. **What exists** — primer/treatment/manifest versions, character bios with their types, worldbuilding elements by type, decisions/questions counts. Cross-check `state.md → What Exists` against the documents actually in the project (enumerate them with `store.list`); flag any drift.
3. **What's next** — `state.md → What's Next` verbatim.
4. **Last session** — `state.md → Last Session` verbatim.
5. **Open questions summary** — top 3 critical/important questions from `questions.md`.
6. **Unintegrated decisions count** — and if ≥ 5, mention that a `/storystormer:treatment-update` would be reasonable.

This command does not modify any files. It's a read-only status report.

Format the output as a short, scannable summary — not a wall of text. The user wants to glance at it and know where things stand.
