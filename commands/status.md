---
description: Show where the story project stands; with `outline`, where outlining stands
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Task", "mcp__*"]
---

# /storystormer:status

Resolve the store first per `references/store.md` if the session hasn't. Two forms, both read-only: with no argument, the project report below; with `outline` (`/storystormer:status outline`), the outline report (§ Outline report).

## Project report

`store.read` `state.md` and present its contents to the user in a scannable summary. Also surface any document the plugin manages (one `references/file-schemas.md` defines) that exists in the project but `state.md` doesn't mention (a drift check). A `decisions.md` or `questions.md` at the root of a layout-2 project is a layout upgrade’s leftover (a host that couldn’t delete it): name it as safe to remove when the latest `.storystormer/history/*-layout-upgrade/` folder holds an identical copy, and say plainly when it doesn’t. Snapshot and history folders, `journal/`, the entries in `decisions/` and `questions/` (counted from their indexes, not listed one by one), `research/`, and the author's own folders aren't inventory; don't report them as drift.

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

## Outline report

Read the outline layer through the store and present a scannable summary of where outlining stands. This is a read-only inspection command, the project report's counterpart, focused on the outline.

What to report:

1. **Structure file** — if `outline/structure.md` exists, report version, framework choice, chapter count target, act split from the chapter blocks' `**Act:**` lines (e.g., `10/20/10`), how many blocks are `new` vs `existing`, and a count of any `[OPEN: Q-###]` or `[NEEDS DEVELOPMENT: ...]` markers in `structure.md`. If it doesn't exist, say so and recommend `pre-outline-session`.

2. **Chapter outlines** — count `chapters/*/ch*-outline.md` files (`store.list`; one per chapter folder) vs. spine target. Report `N/M drafted`. Show how it breaks down by act (`Act 1: 10/10`, `Act 2: 8/20`, etc.). If any chapter outlines exist but `outline/_index.md` doesn't, flag the drift. If `outline/_index.md` is the chapter × stage matrix, its `Outline` column should agree with the file count — flag any mismatch.

3. **Open threads in chapter outlines** — scan the chapter outline bodies for `[OPEN: Q-###]` and `[NEEDS DEVELOPMENT: ...]` markers (`store.read` each outline and scan for the tags; no full-read discipline needed, since these are inline tags, not narrative content). Report totals by type and which chapters carry them. Three carrying `[OPEN: Q-019]` means Q-019 is blocking three chapters from being prose-ready.

4. **Staleness** — for each chapter outline, compare its frontmatter `structure_version` / `treatment_version` / `primer_version` against the current versions of those files. Report any chapter outlines built against superseded sources. Stale outlines are candidates for revision via `outline-chapters` single-chapter mode (or a correction pass, for an `author_written` or `ai_generated_author_revised` outline).

5. **Next outline action** — based on the above, recommend one of:
   - `pre-outline-session` if `structure.md` doesn't exist or has critical unresolved markers.
   - `outline-chapters` for the next un-drafted act if structure is current and chapters are in progress.
   - `outline-chapters` for chapters with stale source versions if structure recently bumped.
   - `brainstorm-session` for the highest-priority `Q-###` blocking the most chapter slots, if outlining is gated on a single unresolved question.
   - "Outline is complete" if every spine slot has a chapter file with zero unresolved markers and no staleness.

This command does not modify any files. It's a read-only outline-state report.

Format the output as a short, scannable summary — three or four lines of headline numbers up top, then the recommendation. The user wants to glance at it and know where outlining stands and what to do next.
