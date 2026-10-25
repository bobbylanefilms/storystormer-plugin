# HANDOFF — /implement SB7

<!-- ABOUTME: Run ledger for the /implement SB7 run (entry collections, slim state.md). -->
<!-- ABOUTME: Rewritten whole at every checkpoint; git log plus this file are the record after a compaction. -->

1. **Run:** `/anthropic-skills:implement SB7`, no flags. Local (desktop). Orchestrator Opus 5.5 (authoring ceiling), effort medium. Started 2026-10-25.
2. **Branch:** `feature/sb6-sb7-markdown-profile-entry-collections` (base `main` at b7bdb7b = 0.21.1-poc). Plan: `.plans/SB7-entry-collections-and-slim-state.md`.

## Slices

| # | Slice | Tier | Status | Commits | Review |
|---|---|---|---|---|---|
| 1 | Schema + store contract | Opus | accepted | 4f4b66c, fad453a | Fable: 16 confirmed, fixed by author |
| 2 | Bindings local/dropbox/notion | Opus (worktree) | accepted | 35b0f18, 55f3657 | Fable: 14 confirmed, fixed by author |
| 3 | Skills, commands, references | Opus (worktree) | accepted | e023b48, f8a8a4c | Fable: 14 confirmed, fixed by author |
| 4 | migrate layout upgrade + `tools/upgrade-check.ts` | Opus | accepted | 40f7ec1, ff61100 | Fable: 13 confirmed, fixed by author |
| 5 | Guides + README (v0.22.0 changelog) | Sonnet | accepted | 45db7ff, cb2fe4a | Opus: 11 confirmed, fixed by author |
| 6 | Live verification + release | Opus runners + inline | in progress | | |

Inline contract fixes: d2c20fb, 91905a7, 0edade8, 4a2d820, dfe206a.

## Current position
Phase A live runners (local, Dropbox, Notion) running in parallel from ff61100; briefs in scratchpad/sb7/ (live-common.md, runner-{local,dropbox,notion}.md). Phase B: runner-ring.md after the local runner's `upgraded/` copy exists and Notion's hub upgrade is done. Then fixes, version bump to 0.22.0-poc, land on main.

## Decisions and deviations
- Worktrees in this app are cut from `main`, not the feature branch: parallel agents had to fast-forward first (ad702f2).
- Config is `layout` + `storage` only; `state.md` owns title, target, genre, series fields; `slug` added to root `state.md`; `storage_kind` dropped.
- Old-layout projects are read-only until `/storystormer:migrate upgrade` (needs Rob's nod; recommended keep).
- Imports (migrate copy, upgrade) keep entry numbers with plain `write`, never `new`.
- Notion: rows converted in place with an `_entry: 2` Meta marker; `Layout` column set last after entry verification; new Journal database; no extra snapshot (row histories).
- Index upkeep is one row per write; full rebuild only when listing and index IDs disagree.
- canon-sync rulings use topic `Canon ruling: <subject>`.

## Open questions for Rob
- Old-layout read-only until upgrade: keep? (recommended yes)

## Last checks
ff61100: tests 116/116, `claude plugin validate .` passes.
