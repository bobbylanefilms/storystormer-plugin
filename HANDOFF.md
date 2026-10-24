<!-- ABOUTME: Session handoff for long-running work in this repo; rewritten whole at each checkpoint -->
<!-- ABOUTME: Current thread: /implement SB6 (portable markdown profile) -->

# HANDOFF: storystormer-plugin

**Run:** `/implement SB6` (anthropic-skills, Anthropic-only) · local · orchestrator Opus 5.5 · effort high · deep review on (Fable reviews Opus) · started 2026-10-24
**Branch:** `feature/sb6-sb7-markdown-profile-entry-collections` (from `main` @ `9497274`) · **Plan:** `.plans/SB6-portable-markdown-profile.md`
**Scratch:** session scratchpad `sb6/` (fixtures rebuilt from Rob's The Good Dog source, skipping `experiments/`; never committed)

## Slices

| # | Tasks | Tier | Status | Commits | Review |
|---|---|---|---|---|---|
| 1 | Probe through Notion (`sb6-probe`) + `references/markdown-profile.md` | Opus | accepted | `8fa54d9`, fix `e02b09d` | Fable: 26 found, all confirmed, fixed by author in one round (re-probe: 243 constructs) |
| 2 | `tools/md-profile-check.ts` + tests (lint, `--words`) | Opus | done, under review | `5315dc4` (worktree `6043497`) | Fable: running (worktree `scratchpad/review-sb6-s2`) |
| 3 | Citations, output-spec fixes, Notion write-side normalization, migrate preflight + exact matching, init intake, Cowork child-page gap, new Notion read rules | Opus | accepted | `784b67c`, fix `1dfb173` (+ inline `5103283`) | Fable: 14 found, all confirmed, fixed by author in one round |
| 4 | Verify: plugin-output lint run; `sb6-mini` idempotence, words, round trip; full Good Dog ring (`sb6-ring`) | Opus runners | pending | | |
| 5 | Release 0.21.0-poc: README, guide, manifests, validate, `main` | inline | pending | | |

## Current position

Slices 1 and 3 accepted; slice 2 on the branch, Fable review running. Next: the slice 4 runners (briefs `sb6/runner-{lint,mini,ring}.md`, rules `sb6/live-common.md`); lint and mini in parallel, then the ring. Fixtures locked under scratchpad `sb6/fixtures/` (recipe `RECIPE.md`).

## Decisions and deviations

- **Probe headline:** Notion's fetch now returns inline HTML tags (`<b>`, `<i>`, `<s>`, `<code>`, `<br />`) and `txt` fences; the binding needs read rules E1–E4 regardless of the profile (slice 3, task 7). Bold italic, continued ordered lists and `~~**x**~~` now round-trip, so `blueprint-spec.md`'s POV labels stay.
- **Rob's Cowork tests (2026-10-24):** all pass (CW5 § 13). Test B found the Notion `list` missing child pages (the init archive) with verification balancing on the short list: folded into slice 3, task 6.
- **App side:** the web app's MCP renderers emit out-of-profile text (questions' indented approaches, bare-filename index links): recorded in AP5 § 5 (web-app `b6b09414`).
- **migrate cites the profile directly** (its briefs paste the rewrite table): a deliberate exception to the plan's "no skill gains a citation".
- Release checklist (project CLAUDE.md) overrides the skill's "never push main": the release lands on `main`.

## Open for Rob

- Test leftovers to trash: Notion Bottle Weather, The Good Dog (2 rows), good-dog-mini; Dropbox `/StoryStormer/{sb4-c1-notion,sync-demo,sync-a,sb5-overwrite,the-good-dog,cowork-test}`, `/SB4-tests/`, plus synced copies. Keep the SB3 Lighthouse Ledger fixtures. SB6 adds `sb6-probe`, `sb6-mini`, `sb6-ring` (listed at the end).

## Checks

- `claude plugin validate .` pass at `9497274` (expected CLAUDE.md warning).
