<!-- ABOUTME: Handoff note: smaller skill gaps the SB5 local-baseline live run found in init re-runs and the chapter pipeline -->
<!-- ABOUTME: Found 2026-10-17 on The Good Dog; none is storage-specific, each is a wording or precondition fix -->

# ISSUE072: Chapter-pipeline and init gaps from the SB5 live run

**Status:** open · **Needs Rob:** no
**Found by:** SB5 local baseline on The Good Dog, 2026-10-17 (run log findings F2, F21, F29, F33 and the Blueprint brief note). Each is small; together they’re one fresh session’s work.

1. **`storystormer-init` has no explicit re-run path.** On a mature project (62 files) a literal re-run trips the survey dispatch threshold and re-surveys everything with subagents to propose three schema fixes. Add a short “Re-running on an existing project” paragraph: read `state.md`, the config and the tree; propose only schema gaps (voice README, `storage_kind`, missing config fields such as `target_word_count`); skip the intake survey.
2. **`blueprint` writes before approval.** In subagent mode the subagent `store.write`s the Blueprint (§ 5) before the author sees it (§ 8), while § 9 says to write after approval. On a snapshots backend a rejected Blueprint has already replaced the old one. Fix: the approval governs the wiring (index, `state.md`), and a rejection restores from the snapshot; or the subagent writes to a draft path the main session promotes.
3. **`blueprint`’s subagent brief doesn’t carry `blueprint-spec.md`.** The subagent can’t reach the bundle; the run pasted the spec in by judgment. Add a brief template that names it, as `prose` does for `prose-spec.md`.
4. **Blueprint length.** The run produced ~10,200 words against `blueprint-spec.md`’s typical 4,000–8,000 for a chapter with a heavy canon load. Decide whether the spec’s range is a ceiling or typical, and say so.
5. **`notes` first-draft gate keys on `revising`.** Prose revise mode sets `revising` on the first surgical edit, so one eight-word tweak clears the gate and the first-draft warning never fires. Gate on `revised` (author sign-off), or warn at `revising` while only one revision exists.
6. **Revelation Log keying.** `canon-schemas.md` § Revelation Log wants chapter-keyed lines (`- **Ch NN** —`); The Good Dog’s bios key planned beats under “To be maintained as prose locks.” Name beat-keyed plan lines as distinct from chapter lines, and say whether `canon-sync` may append for prose that isn’t `revised`.
7. **“Drift” means two things.** `notes` uses it for “wandered from the outline”; `canon-sync` for a character drifting from the bio. Rename one (`notes` → “divergence”, which its own section heading already uses).

## Files

`skills/storystormer-init/SKILL.md` · `skills/blueprint/SKILL.md` § 5, § 8, § 9 · `references/blueprint-spec.md` · `skills/notes/SKILL.md` § Preconditions · `references/canon-schemas.md` § Revelation Log · `skills/canon-sync/SKILL.md`
