---
description: Triage open questions — list by priority, add new, resolve, or invalidate
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Task", "mcp__*"]
---

# /storystormer:questions

Operate on `questions.md`. Resolve the store first per `references/store.md` if the session hasn't; every read and write below goes through its operations (`store.read`, `store.edit`, `store.write`), including the binding's own realization where it computes this document. The command takes optional arguments to control behavior. If no argument is given, list open questions grouped by priority.

## Sub-actions

### Default — list open questions

Show all `open` questions grouped by priority — `critical` first, then `important`, then `nice_to_resolve`. For each: ID, title, category, the question text, the why-it-matters line, possible approaches (compressed), and dependencies (if any).

Also show counts at the top:
- Open: N (critical: C, important: I, nice_to_resolve: NR)
- Resolved: M
- Invalidated: K

### `/storystormer:questions add`

Walk the user through composing a new question. Fields (see `references/file-schemas.md`):

- **Title** — 3–7 words naming the question (required).
- **Question** — the actual question.
- **Why it matters** — what downstream work depends on this.
- **Priority** — `critical` / `important` / `nice_to_resolve`. Default to `important` if unclear.
- **Category** — one of the app's seven: `Story Structure` / `Character` / `Plot` / `Worldbuilding` / `Theme` / `Setting` / `Pacing`.
- **Possible approaches** — 2–4 plausible answers. (You may propose some based on what's in the materials; the user picks/edits.)
- **Dependencies** — other questions that need to be answered first, if any.
- **Source** — `manual` (the user is adding it here).

Show the composed entry; confirm; append to `questions.md` with the next sequential ID from the read (`Q-019`). That ID is provisional: if the store reports a different one, use it in the confirmation and everywhere the question is referenced.

### `/storystormer:questions resolve Q-019`

Mark a question as resolved. Ask which decision resolves it (or invoke `decision-capture` first if the resolution hasn't been logged yet). Set status to `resolved (D-NNN)`. Don't delete the question — the history matters.

### `/storystormer:questions invalidate Q-019`

Mark a question as no longer applicable (e.g., the story has shifted such that the question is moot). Ask for the reason. Set status to `invalidated (<reason>)`. Don't delete.

### `/storystormer:questions focus`

Pick the highest-priority open question and offer to work on it via `brainstorm-session`. Useful when the user says *"what should I work on?"* and isn't sure.

### `/storystormer:questions show Q-019`

Show the full text of a specific question.

### `/storystormer:questions triage`

Re-triage all open questions: walk through each, ask if the priority is still right, ask if any are now resolved (and capture the decision) or invalidated. Useful periodically — questions tend to drift in importance as the story develops.

## Behavior

Default and `show` / `focus` are read-only. Other sub-actions mutate the file in place — they preserve question IDs (never reused), update statuses without deleting entries, and bump `state.md` counts after any change.

`add` and `triage` follow the plan-first protocol — show the user what will be written before locking it in.
