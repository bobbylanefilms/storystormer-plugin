---
description: List, filter, or add to the story's decisions
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Task", "mcp__*"]
---

# /storystormer:decisions

Operate on the decisions collection: `decisions/_index.md` and the `decisions/D-###.md` entries (`references/file-schemas.md` § `decisions/`). Resolve the store first per `references/store.md` if the session hasn't; every read and write below goes through its operations (`store.list`, `store.read`, `store.edit`, `store.write`), including the binding's own realization where it computes the index. The command takes optional arguments to control behavior. If no argument is given, list a recent summary.

**The index answers listing and filtering.** Read `decisions/_index.md` first and read an entry only when the answer needs its text (a summary, a `show`). When a listing of `decisions/` is in hand anyway and its IDs disagree with the index's, rebuild the index first (`references/file-schemas.md` § Who rebuilds an index).

## Sub-actions

### Default — list recent decisions

If invoked without arguments: show the 10 most recent decisions, with their ID, date, type, topic, and integration status from the index, and each one's one-sentence summary from its entry. Short, scannable.

Also show summary counts at the top, from the index:
- Total decisions.
- Unintegrated (the Integrated column isn't `yes`).
- Superseded and retracted.

### `/storystormer:decisions add` — capture a new decision

Invoke the `decision-capture` skill. The user can also just say *"capture a decision: …"* in chat and `decision-capture` will load on its own.

### `/storystormer:decisions filter [type]`

List all decisions matching a type (`plot`, `character`, `worldbuilding`, `structure`, `theme`, `premise`, `process`), from the index's Type column. Recent first. Older entries with a retired type count under the type it maps to (`setting` and `mechanics` → `worldbuilding`, `voice` and `genre` → `theme`, `methodology` → `process`).

### `/storystormer:decisions show D-019`

Show the full text of a specific decision: `store.read(decisions/D-019.md)`.

### `/storystormer:decisions unintegrated`

List all decisions whose Integrated column isn't `yes`. If the count is ≥ 5, suggest a `/storystormer:treatment-update`.

## Behavior

Read-only by default. Adding a decision goes through `decision-capture` (which has its own plan-first behavior). Filtering / showing / listing modify nothing.

If the user wants to edit a decision in place (rare — decisions are normally settled once), `store.edit` that entry, note the edit in its `Details` with the date, and replace its index row if a listed field changed.

If the user wants to supersede a decision (a new decision invalidates an earlier one), invoke `decision-capture` for the new entry, then set the old entry's `superseded_by` to the new entry’s ID as the store reported it and update its index row. If the user withdraws a decision with nothing replacing it, set `retracted` to today instead and update its index row so the Superseded by column reads `retracted` (`references/file-schemas.md` § `decisions/_index.md`). Never delete an entry. Any change here is noted in the session's journal entry (created first if this is the session's first write; `references/file-schemas.md` § `journal/`).
