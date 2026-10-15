---
description: List, filter, or add to the decision log
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Task", "mcp__*"]
---

# /storystormer:decisions

Operate on `decisions.md`. Resolve the store first per `references/store.md` if the session hasn't; every read and write below goes through its operations (`store.read`, `store.edit`, `store.write`), including the binding's own realization where it computes this document. The command takes optional arguments to control behavior. If no argument is given, list a recent summary.

## Sub-actions

### Default — list recent decisions

If invoked without arguments: show the 10 most recent decisions in `decisions.md`, with their ID, date, type, summary, and integration status. Short, scannable.

Also show summary counts at the top:
- Total decisions.
- Unintegrated (i.e., `Integrated into treatment: no`).
- Superseded.

### `/storystormer:decisions add` — capture a new decision

Invoke the `decision-capture` skill. The user can also just say *"capture a decision: …"* in chat and `decision-capture` will load on its own.

### `/storystormer:decisions filter [type]`

List all decisions matching a type (`plot`, `character`, `worldbuilding`, `structure`, `theme`). Recent first. Older entries with a retired type count under the type it maps to (`setting` and `mechanics` → `worldbuilding`, `voice` and `genre` → `theme`).

### `/storystormer:decisions show D-019`

Show the full text of a specific decision by ID.

### `/storystormer:decisions unintegrated`

List all decisions with `Integrated into treatment: no`. If the count is ≥ 5, suggest a `/storystormer:treatment-update`.

## Behavior

Read-only by default. Adding a decision goes through `decision-capture` (which has its own plan-first behavior). Filtering / showing / listing do not modify the file.

If the user wants to edit a decision in place (rare — decisions are normally append-only), do so but explicitly note the edit in the decision's `Details` field with the date of the edit.

If the user wants to supersede a decision (a new decision invalidates an earlier one), invoke `decision-capture` for the new entry and update the old entry's `Superseded by` field.
