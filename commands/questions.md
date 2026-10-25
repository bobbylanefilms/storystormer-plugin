---
description: Triage open questions — list by priority, add new, resolve, or invalidate
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Task", "mcp__*"]
---

# /storystormer:questions

Operate on the questions collection: `questions/_index.md` and the `questions/Q-###.md` entries (`references/file-schemas.md` § `questions/`). Resolve the store first per `references/store.md` if the session hasn't; every read and write below goes through its operations (`store.list`, `store.read`, `store.edit`, `store.write`), including the binding's own realization where it computes the index. The command takes optional arguments to control behavior. If no argument is given, list open questions grouped by priority.

**The index answers listing and counting.** Read `questions/_index.md` first and read only the entries the answer needs (the open ones for the default listing, one for `show`). When a listing of `questions/` is in hand anyway and its IDs disagree with the index's, rebuild the index first (`references/file-schemas.md` § Who rebuilds an index).

## Sub-actions

### Default — list open questions

Show all `open` questions grouped by priority — `critical` first, then `important`, then `nice_to_resolve`. For each: ID, title, category, the question text, the why-it-matters line, possible approaches (compressed), and dependencies (if any), read from the open entries.

Also show counts at the top, from the index:
- Open: N (critical: C, important: I, nice_to_resolve: NR)
- Resolved: M
- Invalidated: K

### `/storystormer:questions add`

Walk the user through composing a new question. Fields (see `references/file-schemas.md` § `questions/`):

- **Title** — 3–7 words naming the question (required).
- **Question** — the actual question.
- **Why it matters** — what downstream work depends on this.
- **Priority** — `critical` / `important` / `nice_to_resolve`. Default to `important` if unclear.
- **Category** — one of the app's seven: `Story Structure` / `Character` / `Plot` / `Worldbuilding` / `Theme` / `Setting` / `Pacing`.
- **Possible approaches** — 2–4 plausible answers. (You may propose some based on what's in the materials; the user picks/edits.)
- **Dependencies** — other questions that need to be answered first, if any.
- **Source** — `manual` (the user is adding it here).
- **Scope** and **affects books** — in a series only, per `references/series.md` § Scoping decisions and questions.

Show the composed entry; confirm; create it with `store.write(questions/Q-###.md, content, new)`, proposing the next number after the index's highest (`Q-019`). That ID is provisional: the store assigns the number and reports it (`references/store.md` § New entries), and that reported ID is the one used in the confirmation, the index row, the session’s journal entry (`references/file-schemas.md` § `journal/`, IDs as the store reported them), and everywhere the question is referenced. Then add its row to `questions/_index.md`.

### `/storystormer:questions resolve Q-019`

Mark a question as resolved. Ask which decision resolves it (or invoke `decision-capture` first if the resolution hasn't been logged yet). In one edit of the entry, set `status: resolved` and `resolved_by: D-NNN`, add a `**Resolution**:` line with the answer, and update or remove any old `**Status**:` body line so the two agree; then replace its index row. Don't delete the question — the history matters.

### `/storystormer:questions invalidate Q-019`

Mark a question as no longer applicable (e.g., the story has shifted such that the question is moot). Ask for the reason. Set `status: invalidated` (with `resolved_by` when a decision is what invalidated it), put the reason in a `**Resolution**:` line, update or remove any old `**Status**:` body line, and replace its index row. Don't delete.

### `/storystormer:questions focus`

Pick the highest-priority open question and offer to work on it via `brainstorm-session`. Useful when the user says *"what should I work on?"* and isn't sure.

### `/storystormer:questions show Q-019`

Show the full text of a specific question: `store.read(questions/Q-019.md)`.

### `/storystormer:questions triage`

Re-triage all open questions: walk through each, ask if the priority is still right, ask if any are now resolved (and capture the decision) or invalidated. Useful periodically — questions tend to drift in importance as the story develops.

## Behavior

Default and `show` / `focus` are read-only. Other sub-actions change entries in place — they preserve question IDs (never reused), update statuses without deleting entries, and keep each changed entry's index row in step (and any old `**Status**:` body line it carries, so the two agree). The writes go in order: the journal entry (created with `new` if this is the session's first write, per `references/file-schemas.md` § `journal/`, otherwise extended; its line names each question by the ID the store reported) → the entry and its index row → `state.md`'s counts.

`add` and `triage` follow the plan-first protocol — show the user what will be written before locking it in.
