# HANDOFF — ISSUE079E (plugin): per-scene outlines, scene structure, Found Documents

<!-- ABOUTME: Run ledger for ISSUE079E's /execute run (the plugin half of the app's ISSUE079 per-scene outlines). -->
<!-- ABOUTME: Rewritten whole at every checkpoint; git log plus this file are the record after a compaction. -->

1. **Run:** `/execute --gemini ISSUE079E` (Rob typed `--neon`; read as `--gemini`), orchestrator claude-opus-5-5, effort xhigh (Codex `model_reasoning_effort=xhigh`, Neon `gemini-4-neon-xhigh`). Started and finished 2026-11-27, from the app repo session that merged ISSUE079D (PR #204, `83ba82c5`).
2. **Plan:** `~/Git/storystormer/.plans/ISSUE079E-plugin-per-scene-outlines.md` (umbrella `ISSUE079-per-scene-outlines.md`). App behavior is live on production: 079A + 079B (PR #201), 079C (PR #203), 079D (PR #204).
3. **Branch:** `feature/issue079e-per-scene-outlines` off `main` `fac2f86`, pushed. **Release is Rob's:** land it on `main`, then Sync the marketplace. Version `0.28.0-poc` in both manifests. The untracked `tools/package-lock.json` predates the run and is left alone.

## Slices

| # | Tasks | Tier | Status | Commits | Review |
|---|---|---|---|---|---|
| 1 | §3.A schema, markdown profile + fixture; §3.B store bindings | Opus | accepted | `6698aad`, fixes `b2607df` | Sol: 22 findings; 10 fixed by the author, 9 parked, 1 declined, 2 later slices' work |
| 2 | §3.C outline-chapters; §3.D blueprint, prose, notes, specs | Neon (eval) | accepted | `42aaf57`, fixes `7ae614d` (Neon resumed), orchestrator `5b5b6d5` | Sol: 28 findings; 14 fixed by Neon (one P0 from the orchestrator's brief), 13 parked, 1 pre-existing parked |
| 3 | §3.E init, migrate, pre-outline, guides; §3.F README notes + version bump | Opus | accepted | `abf1144`, fixes `5863d26` | Sol: 18 findings; 13 fixed by the author, 5 parked (3 pre-existing) |

## Current position

Done. All three slices accepted; `claude plugin validate .` passes (known warnings only), SB2 gate grep 61 (unchanged from `main`), no `mcp__` in skills/references/guides, `node --test tools/*.test.ts` 120 of 120.

**Live checks (2026-11-27):**
- **Store, against dev Convex:** `scratchpad/issue079e-live-check.ts` drove the MCP tool functions as the owner (minted JWT) on a scratch project, then trashed it: 33 of 33 binding claims held (scene_structure set/refused/cleared; sectioned write for a new chapter; Found Document kind; a section `authorship:` line stored as text; scene outline files listed; byte-equal rewrite unchanged; a Scene 2-only revision moves only Scene 2's version; unknown kind ignored with a note; protected scene refused without `force`; a section added; a left-out scene kept; prose `kind` sets the scene's kind; `kind: narrative` turns it back; a bumped file version moves Scene 1's).
- **Skills, headless on a local folder** (a scratch copy of the Good Dog fixture, the plugin loaded with `--plugin-dir`, Sonnet 5.5, edits only): under `multiple`, `outline-chapters` divided chapter 3 into two app-format sections with Scene 1's `pov`/`summary` in the frontmatter and the version bumped; a "revise only Scene 2" run left Scene 1's section byte-identical.
- **Not verified live:** the skills on the StoryStormer store (dev MCP OAuth is Rob's), `init`'s question, `single`, batch prose skipping a Found Document, `migrate`.

## Decisions

- Orchestrator error caught by review: slice 2's brief stated the StoryStormer-only "send `version` as read" rule generally; on file stores it would have collided snapshots (fixed in Neon's fix round).
- Slicing: the schema and bindings first (every skill cites them), then the outline-reading skills (Neon's evaluation slice: the longest Opus-lane work), then onboarding, guides and the release.
- **As built ≠ plan (slice 1, documented, not papered over):** (1) the app's section parser reads only `pov`/`kind`/`summary`; a section `authorship:` line is stored as outline text (confirmed live), so on the StoryStormer store per-scene authorship lives on `scenes/chNN-scene-MM-outline.md` and the chapter file carries none (file-backed stores keep the section line; migrate moves it both ways); (2) an unknown `kind` is ignored with a note, not refused; (3) in a sectioned outline the frontmatter `pov`/`summary` are Scene 1's (no separate chapter summary; `## Synopsis` is the chapter's), overriding plan §3.C's "chapter summary stays chapter-level".
- Slice 3's review round: a pre-079 scene-split chapter (undivided outline, `scene_split: true` Blueprint) is divided before a move INTO the app, with no carry-anyway option, because the app would read it as partly outlined and the legacy fallback would stop applying; dividing an outline at the author's breaks with no word changed is a correction (allowed on a protected outline).

## Open questions for Rob

- None blocking. Recommendations: teach the app's section parser an `authorship:` key line so one chapter-file format serves every store; render `kind` for a one-scene Found Document chapter so the known limit goes away.
