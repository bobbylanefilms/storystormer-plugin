<!-- ABOUTME: Session handoff for long-running work in this repo; rewritten whole at each checkpoint -->
<!-- ABOUTME: Current thread: /implement SB4 + SB5 (onboarding, migrate, backend test matrix) -->

# HANDOFF — storystormer-plugin

**Run:** `/implement SB4 and SB5` · orchestrator Opus 5.5 · effort high · deep review Sol · started 2026-10-17
**Branch:** `feature/sb4-sb5-onboarding-migrate` (from `main` @ `00546cd`) · **Plans:** `.plans/SB4-onboarding-and-migrate.md`, `.plans/SB5-backend-test-matrix.md`
**Version:** `0.20.0-poc` (bumped in `05c0d90`; not yet on `main`)

## Slices

| # | Tasks | Tier | Status | Commits | Review |
|---|---|---|---|---|---|
| 1 | SB4 A+B: init storage question, locator (store.md § Resolve + Locate per binding) | Opus | accepted | `854ab2a`, fix `0226758` | Sol: 13 found, 10 confirmed, fixed by author |
| 2 | SB4 C: `skills/migrate/`, `commands/migrate.md` | Opus | accepted | `b4b3536`, fix `9dbec49` | Sol: 17 found, all confirmed, fixed by author; Haiku cold-read passed |
| 3 | SB4 D: guides, README, version bump, land on `main` | Opus | accepted | `05c0d90`, fix `3194140` | Sol: 9 found, all confirmed, fixed by author |
| 4a | SB4 live criteria C1, C2, C2a, C3, C5 (`live-s4a-prompt.md`) | Opus | running | | |
| 4b | Migration ring, one agent per leg (`live-s4b-prompt.md`) | Opus | leg 1 running | | |
| 5 | SB5 loops (`live-s5-loops-prompt.md`): local running; Notion, Dropbox after ring. 50× overwrite (`live-s5-overwrite-prompt.md`, Sonnet) running | Opus ×3, Sonnet | partly running | | |
| 6 | CW5 § 12 verdicts (web-app repo), README tiers, small fixes | inline | pending | | |

## Current position

Running in parallel: Sol review of slice 3 (worktree `scratchpad/review-sb4-s3`), live-s4a, live-ring-leg1, live-s5-local, live-s5-overwrite. All live briefs and the common rules (`live-common.md`) are in the scratchpad; logs land in `scratchpad/live/<run>/log.md`. Next: confirm slice 3 review, fast-forward `main` and push (project release checklist), ring legs 2 and 3, then S5 Notion and Dropbox loops on the ring's copies, then fixes, CW5 § 12 addendum (uncommitted in the web-app repo), README tiers.

Scripted author inputs for the S5 loops (same on every backend): Q-016 Pickle origin, Chester minor bio, chapter 3 loop.

## Decisions and deviations

- Slice 1 review not taken: Notion >100 Projects rows pagination; hub search beyond 25 results; single-option shortcut (plan approval is where the author objects).
- Notion pointer config is `{"storage": {"kind", "root"}}` only; `local_root` only when the open folder is the synced copy of the chosen Dropbox root. The plan's "connector backend with an open folder gets `local_root` too" would bind local and bypass the connector.
- `migrate` never deletes the source (plan default).
- StoryStormer backend not offered (binding pending; AP4 out of scope), though a `storystormer` MCP server is now connected in this session.

## Open for Rob

- SB5 test project: **The Good Dog** (Rob), source `~/Markdown/Bobby's Vault/Claude/creative/the-good-dog`, skip `experiments/`. CW5 edits: leave uncommitted in the web-app repo (Rob).
- Cowork-only SB5 unknowns (subagents see connectors; widened `allowed-tools` honored) need a Cowork session.
- SB3 test projects kept as fixtures: Dropbox `/StoryStormer/lighthouse-ledger/`; Notion hub "StoryStormer" → "The Lighthouse Ledger".

## Checks

- `claude plugin validate .` pass (expected CLAUDE.md warning) and tool-name grep clean at `0226758`.
