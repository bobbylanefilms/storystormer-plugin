<!-- ABOUTME: Session handoff for long-running work in this repo; rewritten whole at each checkpoint -->
<!-- ABOUTME: Current thread: /implement SB3 (Dropbox + Notion bindings) on feature/sb3-backend-bindings -->

# HANDOFF — storystormer-plugin

**Run:** `/implement SB3` · no flags · orchestrator Opus 5.5 · effort high · started 2026-10-16
**Branch:** `feature/sb3-backend-bindings` off `main` @ `05227d4` · **Plan:** `.plans/SB3-backend-bindings.md`
**Version on main:** `0.18.0-poc`

## Slices

| # | Tasks | Tier | Status | Commit | Review |
|---|---|---|---|---|---|
| 1 | B: `references/store/dropbox.md`, live-probed | Opus | in progress (worktree) | — | — |
| 2 | C: `references/store/notion.md`, live-probed | Opus | in progress (worktree) | — | — |
| 3 | D+E: skill touch-points, store.md table, README/guides, version bump | Opus | pending | — | — |

## Current position

Slices 1 and 2 running in parallel worktrees. Next: verify each, cherry-pick onto the branch, Sol review, then slice 3. Phase 6 = live success-criteria runs on Dropbox and Notion.

## Decisions and deviations

- Parallel 1 ∥ 2: disjoint files, no shared interfaces.
- Facts newer than the plan, passed to the slices: Notion has `notion-delete-pages` now (CW5 said no delete); Notion SQL mode is quota-limited on non-Business plans and can't join data sources there, and rows mode (limit 100) has no cursor; Dropbox recursive `list_folder` returns ns_path only (no path_display); Dropbox `create_file` needs the parent folder to exist; Dropbox `delete` can return `in_progress` (needs `check_job_status`).
- Release lands on `main` only with Rob's go-ahead (global rule: never push main; project rule: Cowork reads main).

## Open questions for Rob

- (none yet)

## Checks

- `claude plugin validate .`: not yet run on this branch.
