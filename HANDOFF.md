<!-- ABOUTME: Session handoff for long-running work in this repo; rewritten whole at each checkpoint -->
<!-- ABOUTME: Current thread: /implement SB3 (Dropbox + Notion bindings) on feature/sb3-backend-bindings -->

# HANDOFF — storystormer-plugin

**Run:** `/implement SB3` · no flags · orchestrator Opus 5.5 · effort high · started 2026-10-16
**Branch:** `feature/sb3-backend-bindings` off `main` @ `05227d4` · **Plan:** `.plans/SB3-backend-bindings.md`
**Version on main:** `0.18.0-poc`

## Slices

| # | Tasks | Tier | Status | Commit | Review |
|---|---|---|---|---|---|
| 1 | B: `references/store/dropbox.md`, live-probed | Opus | accepted (verified; cherry-picked) | `d607bb9`, fix `8544ba2` | Sol: 14 found, 13 confirmed, fixed inline |
| 2 | C: `references/store/notion.md`, live-probed | Opus | accepted (cherry-picked) | `945f863` | Sol running |
| 3 | D+E: skill touch-points, store.md table, README/guides, version bump | Opus | pending | — | — |

## Current position

Slice 1 done (review fixes `8544ba2`). Slice 2 cherry-picked (`945f863`), Sol review running in scratchpad worktree `review-sb3-s2`. Next: triage review, then slice 3. Phase 6 = live success-criteria runs on Dropbox and Notion.

## Decisions and deviations

- Parallel 1 ∥ 2: disjoint files, no shared interfaces.
- Facts newer than the plan, passed to the slices: Notion has `notion-delete-pages` now (CW5 said no delete); Notion SQL mode is quota-limited on non-Business plans and can't join data sources there, and rows mode (limit 100) has no cursor; Dropbox recursive `list_folder` returns ns_path only (no path_display); Dropbox `create_file` needs the parent folder to exist; Dropbox `delete` can return `in_progress` (needs `check_job_status`).
- Dropbox probe: `fetch` appends one trailing `\n` (binding strips it); delete/move always async, wait on `check_job_status` before create; `create_folder` one level per call. Rob's question from the slice: keep `search`/`get_file_metadata` in the required tool list (recommend keep).
- Sol finding not taken (slice 1): chapter `history` doesn't surface checkpoint copies; local.md behaves the same, kept consistent.
- Notion slice deviations (forced by the live connector): per-project `Number` instead of UNIQUE_ID (prefix needs 2+ chars, counts per database); Type/Category/Tags are text not select (selects reject unknown values); decision/question fields are properties; state.md has three writable sections; Questions Status open/resolved/invalidated; added Logline, Type, Body Words, Markers, decision/question entry fields. AP0 Part B has landed, so the app's enums are used. Truncation recovery is written but unobserved (12.7k words came back whole). A second "StoryStormer" page exists in Rob's workspace (Software Hub), so the locator checks title + root + five databases.
- Release lands on `main` only with Rob's go-ahead (global rule: never push main; project rule: Cowork reads main).

## Open questions for Rob

- (none yet)

## Checks

- `claude plugin validate .`: not yet run on this branch.
