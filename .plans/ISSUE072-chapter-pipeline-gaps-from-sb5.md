<!-- ABOUTME: Handoff note: smaller skill gaps the SB5 local-baseline live run found in init re-runs and the chapter pipeline -->
<!-- ABOUTME: Found 2026-10-17 on The Good Dog; none is storage-specific, each is a wording or precondition fix -->

# ISSUE072: Chapter-pipeline and init gaps from the SB5 live run

**Status:** open · **Needs Rob:** no
**Found by:** SB5 local baseline on The Good Dog, 2026-10-17 (local run log findings F2, F21, F29, F33 and the Blueprint brief note; items 8–12 from the Notion and Dropbox loops). Each is small; together they’re one fresh session’s work.

1. **`storystormer-init` has no explicit re-run path.** On a mature project (62 files) a literal re-run trips the survey dispatch threshold and re-surveys everything with subagents to propose three schema fixes. Add a short “Re-running on an existing project” paragraph: read `state.md`, the config and the tree; propose only schema gaps (voice README, `storage_kind`, missing config fields such as `target_word_count`); skip the intake survey.
2. **`blueprint` writes before approval.** In subagent mode the subagent `store.write`s the Blueprint (§ 5) before the author sees it (§ 8), while § 9 says to write after approval. On a snapshots backend a rejected Blueprint has already replaced the old one. Fix: the approval governs the wiring (index, `state.md`), and a rejection restores from the snapshot; or the subagent writes to a draft path the main session promotes.
3. **`blueprint`’s subagent brief doesn’t carry `blueprint-spec.md`.** The subagent can’t reach the bundle; the run pasted the spec in by judgment. Add a brief template that names it, as `prose` does for `prose-spec.md`.
4. **Blueprint length.** The run produced ~10,200 words against `blueprint-spec.md`’s typical 4,000–8,000 for a chapter with a heavy canon load. Decide whether the spec’s range is a ceiling or typical, and say so.
5. **`notes` first-draft gate keys on `revising`.** Prose revise mode sets `revising` on the first surgical edit, so one eight-word tweak clears the gate and the first-draft warning never fires. Gate on `revised` (author sign-off), or warn at `revising` while only one revision exists.
6. **Revelation Log keying.** `canon-schemas.md` § Revelation Log wants chapter-keyed lines (`- **Ch NN** —`); The Good Dog’s bios key planned beats under “To be maintained as prose locks.” Name beat-keyed plan lines as distinct from chapter lines, and say whether `canon-sync` may append for prose that isn’t `revised`.
7. **“Drift” means two things.** `notes` uses it for “wandered from the outline”; `canon-sync` for a character drifting from the bio. Rename one (`notes` → “divergence”, which its own section heading already uses).

8. **Blueprints don’t record which canon versions they read.** After canon-sync edits an entry, which Blueprints are stale can only be inferred from their linked entries (Notion loop N15). Add a `canon_versions` map (entry → version read) to the Blueprint frontmatter so canon-sync’s “Blueprints invalidated” list is exact.
9. **canon-sync’s run record has no schema.** `.storystormer/canon-sync/<date>-<span>.md` came out with different section names and fields on Notion and Dropbox (N19, F-D24). Define it in `file-schemas.md`.
10. **The manifest carries no file paths.** v6 of The Good Dog’s manifest lists elements without paths, so `notes` can’t name targets from it (F-D18). Either add the path to each manifest line or have `notes` resolve names through the indexes.
11. **Entries without a Revelation Log.** `jon-hartley.md` and the location entries have none, so canon-sync proposals aimed there had to create one or be declined (F-D23). Say in `canon-schemas.md` that canon-sync creates the section on first use (it did, inconsistently).
12. **canon-sync reader subagents double reads on delete-create stores** (F-D19): one reader per entry, then the main session re-reads to edit. On a `write: delete-create` binding, let the main session read the entries itself when the span is small.

Items 13–18 come from SB6's lint run (a fresh synthetic project taken through init → notes on local, 2026-10-24; scratchpad log `sb6/live/lint/log.md`):

13. **A spine shorter than its Chapter Count.** The structure schema wants one block per chapter “with no gaps” and a Chapter Count header, but doesn't say whether a spine may commit only the first act (24 declared, 6 written). Say whether a partial spine is allowed and how it's marked.
14. **Reading a binary intake source.** The local binding's `read` can't open a `.docx`, and nothing says how init gets its text (the run used `textutil`, a Bash route). Name the route, keeping the no-Bash constraint: the host's document reader, or ask the author to export.
15. **`notes` section order.** § 4 lists Proposals before End State; `file-schemas.md` § Notes has the opposite order, and the skill says never to reorder. Make them agree.
16. **Multi-paragraph decision fields.** A `**Details**:` value that runs to several paragraphs pulls the next `**Affects**:` line into its last paragraph unless an empty line separates them. Say in `file-schemas.md` § `decisions.md` that a multi-paragraph field ends with an empty line.
17. **Bio heading levels.** `canon-schemas.md` gives no heading levels for a bio file.
18. **“Integrated into structure”** is used but not in the decisions schema's field list; `treatment-update` and `pre-outline-session` both write it.

## Files

`skills/storystormer-init/SKILL.md` · `skills/blueprint/SKILL.md` § 5, § 8, § 9 · `references/blueprint-spec.md` · `skills/notes/SKILL.md` § Preconditions · `references/canon-schemas.md` § Revelation Log · `skills/canon-sync/SKILL.md`
