---
description: Show where outlining stands — structure status, chapters drafted, unresolved markers, and the recommended next outline action
allowed-tools: ["Read", "Glob", "Grep"]
---

# /storystormer:outline

Read the outline layer and present a scannable summary of where outlining stands. This is a read-only inspection command, parallel to `/storystormer:status` but focused specifically on the outline.

What to report:

1. **Structure file** — if `outline/structure.md` exists, report version, framework choice, chapter count target, act split (e.g., `10/12/8/10`), and a count of any `[OPEN: Q-###]` or `[NEEDS DEVELOPMENT: ...]` markers in `structure.md`. If it doesn't exist, say so and recommend `pre-outline-session`.

2. **Chapter outlines** — count `chapters/*/ch*-outline.md` files (one per chapter folder) vs. spine target. Report `N/M drafted`. Show how it breaks down by act (`Act 1: 10/10`, `Act 2A: 8/12`, etc.). If any chapter outlines exist but `outline/_index.md` doesn't, flag the drift. If `outline/_index.md` is the chapter × stage matrix, its `Outline` column should agree with the file count — flag any mismatch.

3. **Open threads in chapter outlines** — scan the chapter outline bodies for `[OPEN: Q-###]` and `[NEEDS DEVELOPMENT: ...]` markers (grep-permitted; these are inline tags, not narrative content). Report totals by type and which chapters carry them. Three carrying `[OPEN: Q-019]` means Q-019 is blocking three chapters from being prose-ready.

4. **Staleness** — for each chapter outline, compare its frontmatter `structure_version` / `treatment_version` / `primer_version` against the current versions of those files. Report any chapter outlines built against superseded sources. Stale outlines are candidates for revision via `outline-chapters` single-chapter mode.

5. **Next outline action** — based on the above, recommend one of:
   - `pre-outline-session` if `structure.md` doesn't exist or has critical unresolved markers.
   - `outline-chapters` for the next un-drafted act if structure is current and chapters are in progress.
   - `outline-chapters` for chapters with stale source versions if structure recently bumped.
   - `brainstorm-session` for the highest-priority `Q-###` blocking the most chapter slots, if outlining is gated on a single unresolved question.
   - "Outline is complete" if every spine slot has a chapter file with zero unresolved markers and no staleness.

This command does not modify any files. It's a read-only outline-state report.

Format the output as a short, scannable summary — three or four lines of headline numbers up top, then the recommendation. The user wants to glance at it and know where outlining stands and what to do next.
