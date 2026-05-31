---
description: Show the current state of the story project — what exists, what's next, how things stand
allowed-tools: ["Read", "Glob", "Grep"]
---

# /storystormer:status

Read `state.md` and present its contents to the user in a scannable summary. Also surface anything that the file-system says exists but `state.md` doesn't mention (a drift check).

What to report:

1. **Title, genre, project type, stage** — from `state.md` frontmatter.
2. **What exists** — primer/treatment/manifest versions, character bios with tiers, worldbuilding elements, decisions/questions counts. Cross-check `state.md → What Exists` against the actual files in the folder; flag any drift.
3. **What's next** — `state.md → What's Next` verbatim.
4. **Last session** — `state.md → Last Session` verbatim.
5. **Open questions summary** — top 3 critical/important questions from `questions.md`.
6. **Unintegrated decisions count** — and if ≥ 5, mention that a `/storystormer:treatment-update` would be reasonable.

This command does not modify any files. It's a read-only status report.

Format the output as a short, scannable summary — not a wall of text. The user wants to glance at it and know where things stand.
