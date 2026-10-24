<!-- ABOUTME: Handoff note: appending one decision or marking one integrated rewrites the whole 115 KB log on Dropbox, and state.md edits cost a full re-read and re-create -->
<!-- ABOUTME: Found by the SB5 Dropbox live loop on The Good Dog (2026-10-17); a real fork between schema change and binding realizations -->

# ISSUE073: Whole-file write amplification on connector stores

**Status:** superseded by SB7 (`.plans/SB7-entry-collections-and-slim-state.md`; Rob chose one file per entry, 2026-10-24) · **Needs Rob:** no
**Found by:** SB5 live loops, 2026-10-17. The Dropbox loop took 1,190 s for `treatment-update` against 539 s on local, and re-emitted about 315 KB to change about 4 KB of prose.

## Problem

Three documents are append-mostly but stored as single files:

- **`decisions.md`** (115–121 KB on The Good Dog, 68–77 entries). Every `decision-capture` append and every “mark D-### integrated” in `treatment-update` is a whole-document write. On Dropbox (`write: delete-create`) that is a full fetch for the guard, a delete, a job poll and a 115 KB create, per change. On Notion it is cheap per row, but 16 integrated marks cost 16 property calls (no multi-row update).
- **`state.md`** (45–53 KB, mostly the `## Previous Session` history). Each one-line dashboard update is a full guard fetch plus a full create; about nine per development loop on Dropbox. On Notion each guard fetches the 67–71 KB Projects row.
- **`questions.md`** (37–47 KB): the same shape, smaller.

Local mode hides all of it (native edit), so nothing in the skills notices.

## Options

1. **Shard the logs** (schema change): `decisions/D-001.md` … one file per entry, with `decisions.md` as a computed index on every backend. Appends become small creates everywhere; Notion already works this way. Costs: a migration for existing projects, every skill that reads the log reads a folder, and the author loses the single readable file on local (keep it as a generated view?).
2. **Archive old sessions out of `state.md`:** move `## Previous Session` history into `.storystormer/sessions.md` (append-only, rarely read), keeping `state.md` a few KB. Cheap and probably right regardless.
3. **Binding realizations:** a binding could name an `append` realization where the backend has one (Dropbox has none; the local binding’s native edit already is one). Doesn’t help Dropbox.
4. **Accept it:** document the cost per backend in the README tier notes.

**Suggested:** 2 now (small, no reader changes beyond `state.md`’s schema); decide 1 when a project’s log passes ~200 entries or when Dropbox is promoted, since it is the only real fix for delete-create stores.

## Files

`references/file-schemas.md` § `decisions.md`, § `questions.md`, § `state.md` · `skills/decision-capture/SKILL.md` · `skills/treatment-update/SKILL.md` (integration marks) · every binding’s § Stored and computed · `skills/migrate/SKILL.md` (a sharded layout changes its table).
