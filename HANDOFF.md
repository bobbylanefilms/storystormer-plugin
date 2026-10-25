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

## Current position (PAUSED 2026-10-25 by Rob: weekly usage limit)

- **Live runners L, D, N finished** (reports' logs: scratchpad/sb7/live/{local,dropbox,notion}/log.md). All passed except N step 4 partial (journal-loser trash refused by connector).
- **Ring runner stopped mid leg 2** (Notion → Dropbox, `sb7-ring`): it was writing `state.md` to Dropbox `/StoryStormer/sb7-ring/`; config not yet written, so the target is an unfinished run that `migrate` should offer to resume. Leg 1 passed (4532 s, ~471 Notion calls, 0 renumbered; named mismatches s12 autolink + craft-document:241). Log: scratchpad/sb7/live/ring/log.md. **Resume:** a new ring runner continues leg 2 (resume), then leg 3 and the diff, from the same brief.
- **Then:** one Opus fix slice with the list below, a review, bump 0.22.0-poc, validate, land on main.

## Fix list from the live runs (not yet applied)
1. **local `new` (L F18, severe):** Write overwrote a file that appeared after the listing. Glob the exact path immediately before Write, never Write onto an existing path, verify after; document the residual window (no exclusive create without Bash).
2. **Notion journal loser (N 1):** the connector refuses trash without the user's ask. Retitle the losing row and clear its `Project` relation instead (no delete). Test leftover: duplicate s15 row `404e980b9c7481818e8ff763ab9634d5` in `sb6-ring2`.
3. **Dropbox speed (D 1–2):** treatment-update 669 s vs local 446 s (1.5×; target 1.3×; SB5 2.2×). Allow batched deletes for small entry/index rewrites once all prior contents are in hand.
4. **Notion H1 (ring N1):** 17/17 canon etc. sync creates dropped the H1; the "sync/child creates keep it" note is wrong as a rule; keep the conditional check, fix the note.
5. **Notion autolink (ring N2):** a bare `state.md` inside bold autolinked; profile/binding needs a rule (code-span file names, or escape the dot).
6. **questions index example link:** `../decisions/D-###.md`, not `./D-###.md` (L F5, D 3).
7. **canon-sync order:** log rulings first, then the canon edits that cite them (D 4).
8. **decision-capture/journal:** extend the journal with the reported number (N 9).
9. **init slug:** let the author name it; default kebab title (L F6, D 8, N 11).
10. **migrate conversion briefs:** subagents stage, never write before the fidelity check (L F1); stress the nesting rows (L F2); Notion resume word check needs a per-row word count in `Meta` (N 2); `Layout` already set at scaffolding vs "last write" (ring).
11. **Notion async:** split-part `old_str` in stored form (N 3); "run" = the session (N 6).
12. **treatment-update:** an entry without `integrated` is checked against the treatment, not integrated blindly (N 5).
13. **journal date:** an entry is dated by the day it was created (L F4).
14. **To ISSUE072 (not SB7):** prose no-italics vs style guide; blueprint wording; notes "Tier 1 chains"; outline-chapters restamp; canon-sync accretion D-###; treatment-update not reading outlines.

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
- Trash the duplicate Notion journal row in `sb6-ring2`, or leave it for Rob?

## Last checks
ff61100: tests 116/116, `claude plugin validate .` passes.
