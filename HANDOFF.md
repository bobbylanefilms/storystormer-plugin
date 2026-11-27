# HANDOFF — ISSUE079E (plugin): per-scene outlines, scene structure, Found Documents

<!-- ABOUTME: Run ledger for ISSUE079E's /execute run (the plugin half of the app's ISSUE079 per-scene outlines). -->
<!-- ABOUTME: Rewritten whole at every checkpoint; git log plus this file are the record after a compaction. -->

1. **Run:** `/execute --gemini ISSUE079E` (Rob typed `--neon`; read as `--gemini`), orchestrator claude-opus-5-5, effort xhigh (Codex `model_reasoning_effort=xhigh`, Neon `gemini-4-neon-xhigh`). Started 2026-11-27, from the app repo session that merged ISSUE079D (PR #204, `83ba82c5`).
2. **Plan:** `~/Git/storystormer/.plans/ISSUE079E-plugin-per-scene-outlines.md` (umbrella `ISSUE079-per-scene-outlines.md`). App behavior is live on production: 079A + 079B (PR #201), 079C (PR #203), 079D (PR #204).
3. **Branch:** `feature/issue079e-per-scene-outlines` off `main` `fac2f86`. Pushed at checkpoints; landing on `main` and the marketplace Sync are Rob's release steps. The untracked `tools/package-lock.json` predates the run and is left alone.

## Slices

| # | Tasks | Tier | Status | Commits | Review |
|---|---|---|---|---|---|
| 1 | §3.A schema, markdown profile + fixture; §3.B store bindings | Opus | accepted | `6698aad`, fixes `b2607df` | Sol: 22 findings; 10 fixed by the author, 9 parked (`.plans/PARKING.md`), 1 declined, 2 later slices' work |
| 2 | §3.C outline-chapters; §3.D blueprint, prose, notes, specs | Neon (eval) | verified, in review | `42aaf57` (+ orchestrator fix `5b5b6d5`) | Sol: running |
| 3 | §3.E init, migrate, pre-outline, guides; §3.F README notes + version bump | Opus | pending | — | — |

## Current position

Slice 2 (Neon, conversation `535878eb-40f2-471d-bbde-02029e0a0b97`, 7.7 min, 0 denied, 291k tokens) verified: validate passes, gate grep 61, no `mcp__`, 120/120 tool tests, descriptions 187–209 chars. Its report caught a real defect from slice 1's fix round (two binding sub-bullets joined on one line; fixed `5b5b6d5`); one claim slightly off (a description length). Sol review running; slice 3 (Opus) waits for it.

## Decisions

- Slicing: the schema and bindings first (every skill cites them), then the outline-reading skills (Neon's evaluation slice: the longest Opus-lane work), then onboarding, guides and the release.

- **As built ≠ plan (slice 1, documented, not papered over):** (1) the app's section parser reads only `pov`/`kind`/`summary`; a section `authorship:` line is stored as outline text, so on the StoryStormer store per-scene authorship lives on `scenes/chNN-scene-MM-outline.md` and the chapter file carries none (file-backed stores keep the section line; migrate moves it both ways); (2) an unknown `kind` is ignored with a note, not refused; (3) in a sectioned outline the frontmatter `pov`/`summary` are Scene 1's (no separate chapter summary; `## Synopsis` is the chapter's), overriding plan §3.C's "chapter summary stays chapter-level".

## Open questions for Rob

- None blocking. Report-time recommendation: teach the app's section parser an `authorship:` key line so one chapter-file format serves every store.
