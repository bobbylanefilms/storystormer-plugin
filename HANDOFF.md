<!-- ABOUTME: Session handoff for long-running work in this repo; rewritten whole at each checkpoint -->
<!-- ABOUTME: Current thread: /implement SB4 + SB5 (onboarding, migrate, backend test matrix), complete -->

# HANDOFF: storystormer-plugin

**Run:** `/implement SB4 and SB5` · orchestrator Opus 5.5 · effort high · deep review Sol · 2026-10-17 · **complete**
**Branch:** `feature/sb4-sb5-onboarding-migrate`, fast-forwarded onto `main` · **Plans:** `.plans/SB4-onboarding-and-migrate.md`, `.plans/SB5-backend-test-matrix.md` (both have as-built notes)
**Version:** `0.20.1-poc` on `main`

## What landed

| # | Work | Tier | Result |
|---|---|---|---|
| 1 | SB4 A+B: init storage question, locator | Opus | accepted; Sol 13 found, 10 confirmed, fixed |
| 2 | SB4 C: `migrate` skill and command | Opus | accepted; Sol 17 found, all fixed |
| 3 | SB4 D: guides, README, 0.20.0-poc release | Opus | accepted; Sol 9 found, all fixed |
| 4 | SB4 live criteria C1–C5 | Opus runner | all pass |
| 5 | SB5 loops on local, Notion, Dropbox; 50× overwrite; migration ring | Opus/Sonnet runners | loops pass everywhere; ring dirty on the Notion legs |
| 6a | Fix A: Notion round-trip preservation | Opus | `4fd8c31`, `8bb776b`, `8de6491`; re-verified: no data loss |
| 6b | Fix B: store, Dropbox, migrate findings | Opus | `3fb9523`, `91df354` |
| 6c | Fix C: ISSUE071 authorship signals | Opus | `0889a8d`, `5d78507` |
| 7 | CW5 § 13 (web-app repo, uncommitted), README tiers, as-built notes, 0.20.1-poc | inline | done |

## Key decisions

- Notion: fix data loss now, document markdown normalization; a **portable markdown profile** (skills write a Notion-safe subset everywhere, migrate-into-Notion normalizes intake once with approval) is its own future plan (Rob, 2026-10-17).
- canon-sync: author-written upstream → canon against canon, no default (Rob).
- Notion pointer config is `{"storage": {"kind", "root"}}` only; `local_root` only in the Dropbox hybrid (plan wording was wrong).
- `migrate` never deletes the source.

## Open for Rob

- Cowork checks on 0.20.1-poc: subagents see connectors; widened `allowed-tools` honored; Dropbox per-file confirmation nagging in Cowork’s UI. Then fill CW5 § 13’s “pending” cells.
- ISSUE073 (whole-file log rewrites; needs Rob): archive `## Previous Session` out of `state.md` now, decide log sharding later?
- ISSUE072 (12 chapter-pipeline gaps) open, no decision needed.
- Test leftovers to trash (Rob): Notion projects Bottle Weather, The Good Dog (two rows), good-dog-mini; Dropbox `/StoryStormer/{sb4-c1-notion,sync-demo,sync-a,sb5-overwrite,the-good-dog}`, `/SB4-tests/`, and their synced local copies. SB3 fixtures (`/StoryStormer/lighthouse-ledger/`, Notion “The Lighthouse Ledger”) were kept.
- The Notion hub got five schema-upgrade columns from the re-verify (expected).

## Checks

- `claude plugin validate .` pass (expected CLAUDE.md warning); tool-name grep clean (only the `mcp__*` frontmatter wildcard) at release.
