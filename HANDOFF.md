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
| 2 | `tools/md-profile-check.ts` + tests (lint, `--words`) | Opus | in progress (worktree) | | |
| 3 | Citations, output-spec fixes, Notion write-side normalization, migrate preflight + exact matching, init intake | Opus | in progress (worktree) | | |
| 4 | Verify: plugin-output lint run; `sb6-mini` idempotence, words, round trip; full Good Dog ring (`sb6-ring`) | Opus runners | pending | | |
| 5 | Release 0.21.0-poc: README, guide, manifests, validate, `main` | inline | pending | | |

## Current position

Slices 2 and 3 running in parallel worktrees (prompts in scratchpad `sb6/slice2-prompt.md`, `slice3-prompt.md`); cherry-pick each onto the branch after verification. Then the slice 4 runners (briefs `sb6/runner-{lint,mini,ring}.md`, rules `sb6/live-common.md`). Fixtures rebuilt and locked: `sb6/fixtures/{the-good-dog (148), notion-mini (30)}`, recipe `sb6/fixtures/RECIPE.md`.

## Decisions and deviations

- **Probe headline:** Notion's fetch now returns inline HTML tags (`<b>`, `<i>`, `<s>`, `<code>`, `<br />`) and `txt` fences; the binding needs read rules E1–E4 regardless of the profile (slice 3, task 7). Bold italic, continued ordered lists and `~~**x**~~` now round-trip, so `blueprint-spec.md`'s POV labels stay.
- **Rob's Cowork tests (2026-10-24):** all pass (CW5 § 13). Test B found the Notion `list` missing child pages (the init archive) with verification balancing on the short list: folded into slice 3, task 6.
- Release checklist (project CLAUDE.md) overrides the skill's "never push main": the release lands on `main`.

## Open for Rob

- Test leftovers to trash: Notion Bottle Weather, The Good Dog (2 rows), good-dog-mini; Dropbox `/StoryStormer/{sb4-c1-notion,sync-demo,sync-a,sb5-overwrite,the-good-dog,cowork-test}`, `/SB4-tests/`, plus synced copies. Keep the SB3 Lighthouse Ledger fixtures. SB6 adds `sb6-probe`, `sb6-mini`, `sb6-ring` (listed at the end).

## Checks

- `claude plugin validate .` pass at `9497274` (expected CLAUDE.md warning).
