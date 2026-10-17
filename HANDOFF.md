<!-- ABOUTME: Session handoff for long-running work in this repo; rewritten whole at each checkpoint -->
<!-- ABOUTME: Current thread: /implement SB4 + SB5 (onboarding, migrate, backend test matrix) -->

# HANDOFF — storystormer-plugin

**Run:** `/implement SB4 and SB5` · orchestrator Opus 5.5 · effort high · deep review Sol · started 2026-10-17
**Branch:** `feature/sb4-sb5-onboarding-migrate` (from `main` @ `00546cd`) · **Plans:** `.plans/SB4-onboarding-and-migrate.md`, `.plans/SB5-backend-test-matrix.md`
**Version:** `0.20.0-poc` on `main` @ `2968790`; fixes after that go out as `0.20.1-poc`

## Slices

| # | Tasks | Tier | Status | Commits | Review |
|---|---|---|---|---|---|
| 1 | SB4 A+B: init storage question, locator (store.md § Resolve + Locate per binding) | Opus | accepted | `854ab2a`, fix `0226758` | Sol: 13 found, 10 confirmed, fixed by author |
| 2 | SB4 C: `skills/migrate/`, `commands/migrate.md` | Opus | accepted | `b4b3536`, fix `9dbec49` | Sol: 17 found, all confirmed, fixed by author; Haiku cold-read passed |
| 3 | SB4 D: guides, README, version bump, land on `main` | Opus | accepted | `05c0d90`, fix `3194140` | Sol: 9 found, all confirmed, fixed by author |
| 4a | SB4 live criteria C1, C2, C2a, C3, C5 | Opus | **all pass** | | 10 findings; F1 (Notion relation filter) fixed `d6d4b35` |
| 4b | Migration ring local → Notion → Dropbox → local (3 agents) | Opus | done: **ring not clean** (86/96 differ, all from Notion legs; Dropbox + local byte-clean) | | ledger `live-findings.md` |
| 5 | SB5 loops local / Notion / Dropbox + 50× overwrite | Opus ×3, Sonnet | **all 11 steps pass on all 3**; overwrite 50/50 no race | | ISSUE071, ISSUE072 filed `c70e19f` |
| 6a | Fix A: Notion binding data loss (`fix-a-notion-prompt.md`) | Opus | running (worktree) | | |
| 6c | Fix C: ISSUE071 authorship signals (`fix-c-issue071-prompt.md`) | Opus | running (worktree) | | |
| 6b | Fix B: Dropbox/store/migrate/init small findings | Opus | pending (after A, C) | | |
| 7 | Notion mini round-trip re-verify; CW5 § 12 verdicts (uncommitted, web-app repo); README tiers; as-built notes; 0.20.1-poc to `main` | inline + runner | pending | | |

## Current position

All live runs done. Findings ledger: scratchpad `live-findings.md`; per-run logs under scratchpad `live/<run>/log.md`. Fix A and Fix C running in isolated worktrees (cherry-pick onto the branch when they return); Fix B next. Then a small Notion round-trip re-verify, CW5 addendum, README tiers, as-built notes, release 0.20.1-poc.

Rob decisions 2026-10-17: Notion → fix data loss now, document markdown normalization; discuss a **portable markdown profile** (skills write a Notion-safe subset everywhere; migrate-into-Notion normalizes intake once with approval) as its own plan. ISSUE071 item 2 → canon-sync "no default, ask" for author-written upstream.

## Decisions and deviations

- Slice 1 review not taken: Notion >100 Projects rows pagination; hub search beyond 25 results; single-option shortcut (plan approval is where the author objects).
- Notion pointer config is `{"storage": {"kind", "root"}}` only; `local_root` only when the open folder is the synced copy of the chosen Dropbox root. The plan's "connector backend with an open folder gets `local_root` too" would bind local and bypass the connector.
- `migrate` never deletes the source (plan default).
- StoryStormer backend not offered (binding pending; AP4 out of scope), though a `storystormer` MCP server is now connected in this session.

## Open for Rob

- SB5 test project: **The Good Dog** (Rob), source `~/Markdown/Bobby's Vault/Claude/creative/the-good-dog`, skip `experiments/`. CW5 edits: leave uncommitted in the web-app repo (Rob).
- Cowork-only SB5 unknowns (subagents see connectors; widened `allowed-tools` honored; Dropbox confirmation nagging in Cowork's UI) need a Cowork session on 0.20.0-poc.
- Test leftovers to trash after SB5: Notion rows Bottle Weather, The Good Dog (+ The Lighthouse Ledger per SB3 note); Dropbox `/StoryStormer/{sb4-c1-notion,sync-demo,sync-a,sb5-overwrite,the-good-dog}`, `/SB4-tests/`, plus `/StoryStormer/lighthouse-ledger/`.
- SB3 test projects kept as fixtures: Dropbox `/StoryStormer/lighthouse-ledger/`; Notion hub "StoryStormer" → "The Lighthouse Ledger".

## Checks

- `claude plugin validate .` pass (expected CLAUDE.md warning) and tool-name grep clean at `0226758`.
