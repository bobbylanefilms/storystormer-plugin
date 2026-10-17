<!-- ABOUTME: Session handoff for long-running work in this repo; rewritten whole at each checkpoint -->
<!-- ABOUTME: Current thread: SB3 (Dropbox + Notion bindings) released as 0.19.0-poc on main; SB4 next -->

# HANDOFF — storystormer-plugin

**Run:** `/implement SB3` · orchestrator Opus 5.5 · effort high · 2026-10-16 · **complete**
**Branch:** `main` @ `6c7c7ce` (fast-forwarded from `feature/sb3-backend-bindings`, now deleted) · **Plan:** `.plans/SB3-backend-bindings.md` (as-built notes at the end)
**Version:** `0.19.0-poc`

## Slices

| # | Tasks | Tier | Status | Commits | Review |
|---|---|---|---|---|---|
| 1 | `references/store/dropbox.md`, live-probed | Opus | accepted | `d607bb9`, fix `8544ba2` | Sol: 14 found, 13 fixed inline |
| 2 | `references/store/notion.md`, live-probed | Opus | accepted after send-back | `945f863`, fix `be59a10` | Sol: 40 found, 39 fixed by a fresh Opus fix slice |
| 3 | skill wiring, store.md table, README/guides, version bump | Opus | accepted | `7a43dcd`, fix `ac7aa6b` | Sol: 12, plus 26 from E2E, fixed in one slice |

E2E (fresh-context Opus following the docs cold): Dropbox D1–D7 all pass (tree matches a local run path for path); Notion N1–N7 five pass, two partial (dropped leading H1, bio property mapping), both fixed in `ac7aa6b`.

## Current position

Released on `main`. Next for Rob: re-sync Cowork (update marketplace → update plugin → restart session); local Claude Code is still on 0.16.1-poc (`claude plugin marketplace update storystormer-plugin`, then update the plugin). Then SB4.

## Decisions and deviations

- Notion deviations forced by the connector are in the plan's as-built notes (per-project `Number`, text instead of selects, decision/question fields as properties, three writable `state.md` sections, `notion-delete-pages` with `user_confirmed`).
- Dropbox: `fetch` appends one trailing newline (stripped); the write waits on `check_job_status` before the create.
- Contract changes: `confirm: none` allows per-call confirmation flags; the concurrency guard now covers un-versioned documents by content compare; subagent briefs for remote-store intake carry a source and a destination block.
- Sol findings not taken: chapter `history` doesn't surface checkpoint copies (same as local.md); `create-pages` does accept `teamspace_id`.

## Open for Rob

- Test projects left for inspection: Dropbox `/StoryStormer/lighthouse-ledger/`; Notion hub "StoryStormer" with "The Lighthouse Ledger". Rob chose: keep the Notion hub (init reuses it), trash only the project, once he has looked.
- ISSUE070 decided (budget is a ceiling) and released in the plugin; app prompt alignment pending (handoff in `.plans/ISSUE070-treatment-first-run-budget.md`).
- Older: delete the private Notion page "StoryStormer Storage Test"; ISSUE068 § A triage (web-app repo).

## Follow-ups noted

- `pre-outline-session`'s `Integrated into structure` line has no entry in `file-schemas.md` § `decisions.md`.
- Notion Assets `Authorship` column is unused (no Assets kind carries `authorship`).
- `genre-reference.md` has no named owning skill (init's plan offers it; `genres.md` says research on confirmation).
- README lacks a v0.18.0 changelog entry.
- SB5: truncation recovery on a very long Notion page; Dropbox version history across delete-create; 50× overwrite loop.

## Checks

- `claude plugin validate .`: pass (expected CLAUDE.md warning) at the final commit.
- Tool-name grep over skills/commands: clean apart from the SB2 `allowed-tools: mcp__*` wildcard.
