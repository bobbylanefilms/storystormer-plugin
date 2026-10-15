<!-- ABOUTME: Session handoff for long-running work in this repo; rewritten whole at each checkpoint -->
<!-- ABOUTME: Current thread: SB1+SB2 released as 0.18.0-poc on main; SB3 (Dropbox + Notion bindings) next -->

# HANDOFF — storystormer-plugin

**Date:** 2026-10-15 · **Branch:** `main` @ `9f71785` (SB1+SB2 fast-forwarded from `feat/sb1-sb2-store-contract`) · **Version:** `0.18.0-poc`

## What landed

The store contract (SB1) and the skill rewrite onto it (SB2), as one release:
- `references/store.md`: six operations plus optional `move`/`delete`, a declared capabilities line per backend, once-per-project resolution, local-mode clauses (snapshots, indexes, config), concurrency guard, confirmation posture, bindings table.
- `references/store/local.md`: the first binding; today's behavior, with `delete` working where the host can remove a file.
- Every skill, command, reference and guide now addresses the contract; no skill names a host tool. `checkpoint` captures every document `file-schemas.md` defines.
- Plans carry full as-built notes: `.plans/SB1-store-contract.md`, `.plans/SB2-skill-rewrite.md`.

## Verification

- Sol (GPT-6.1) reviewed every slice: 42 findings confirmed and fixed. An Opus cold read added 8 more fixes.
- `claude plugin validate .` passes (one pre-existing warning: CLAUDE.md at the plugin root).
- Parity harness (`~/Git/storystormer-parity`, README § After SB2): zero missed snapshots versus 1–2 in each baseline; per-step writes inside baseline variance; only intended differences.

## Next

1. Rob: re-sync in Cowork (update marketplace → update plugin → restart session). Rob's local Claude Code install is still `0.16.1-poc`: `claude plugin marketplace update storystormer-plugin`, then update the plugin.
2. SB3: Dropbox and Notion bindings (`references/store/dropbox.md`, `notion.md`). `local.md` already exists. Reuse the parity harness for regressions.
3. SB4 (onboarding, locator, migrate) → SB5 (backend test matrix, incl. whether `mcp__*` in `allowed-tools` pre-approves connector tools, and Cowork's `delete`).
4. Then AP4 and AP5 in the web-app repo. AP4's binding must map single edits to the app's `replace_range` (not `find_replace`) to keep the contract's ambiguous-anchor failure rule.

## Open items for Rob

- Delete the private Notion page "StoryStormer Storage Test".
- ISSUE068 § A triage after the first real plugin session against the MCP server.
- `feat/sb1-sb2-store-contract` is fully merged into `main` (fast-forward); delete it when you're ready.
