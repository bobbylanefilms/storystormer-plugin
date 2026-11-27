# HANDOFF — ISSUE079E (plugin): per-scene outlines, scene structure, Found Documents

<!-- ABOUTME: Run ledger for ISSUE079E's /execute run (the plugin half of the app's ISSUE079 per-scene outlines). -->
<!-- ABOUTME: Rewritten whole at every checkpoint; git log plus this file are the record after a compaction. -->

1. **Run:** `/execute --gemini ISSUE079E` (Rob typed `--neon`; read as `--gemini`), orchestrator claude-opus-5-5, effort xhigh (Codex `model_reasoning_effort=xhigh`, Neon `gemini-4-neon-xhigh`). Started 2026-11-27, from the app repo session that merged ISSUE079D (PR #204, `83ba82c5`).
2. **Plan:** `~/Git/storystormer/.plans/ISSUE079E-plugin-per-scene-outlines.md` (umbrella `ISSUE079-per-scene-outlines.md`). App behavior is live on production: 079A + 079B (PR #201), 079C (PR #203), 079D (PR #204).
3. **Branch:** `feature/issue079e-per-scene-outlines` off `main` `fac2f86`. Pushed at checkpoints; landing on `main` and the marketplace Sync are Rob's release steps. The untracked `tools/package-lock.json` predates the run and is left alone.

## Slices

| # | Tasks | Tier | Status | Commits | Review |
|---|---|---|---|---|---|
| 1 | §3.A schema, markdown profile + fixture; §3.B store bindings | Opus | running | — | — |
| 2 | §3.C outline-chapters; §3.D blueprint, prose, notes, specs | Neon (eval) | pending | — | — |
| 3 | §3.E init, migrate, pre-outline, guides; §3.F README notes + version bump | Opus | pending | — | — |

## Current position

Slice 1 dispatched.

## Decisions

- Slicing: the schema and bindings first (every skill cites them), then the outline-reading skills (Neon's evaluation slice: the longest Opus-lane work), then onboarding, guides and the release.

## Open questions for Rob

- None yet.
