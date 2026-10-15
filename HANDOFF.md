<!-- ABOUTME: Session handoff for long-running work in this repo; rewritten whole at each checkpoint -->
<!-- ABOUTME: Current thread: /implement run of SB1+SB2 (store contract + skill rewrite), 2026-10-15 -->

# HANDOFF — storystormer-plugin

## Run

- **Skill:** `/implement` · no flags · orchestrator Opus 5.5 · effort high · started 2026-10-15
- **Branch:** `feat/sb1-sb2-store-contract` from `main` @ `fa6e048`
- **Plans:** `.plans/SB1-store-contract.md`, `.plans/SB2-skill-rewrite.md` (one release, `0.18.0-poc`)
- **Reviewer:** GPT-6.1 Sol via Codex CLI 0.162.1, per slice

## Slices

| # | Slice | Tier | Status | Commit | Review |
|---|---|---|---|---|---|
| 1 | Contract: `references/store.md` + `references/store/local.md` + `mcp__*` validate check | Opus | accepted | `b769cf5`, fix `3f054f1` | Sol: 10 confirmed, fixed inline |
| 2 | Schema, references, docs (SB1 §3B–C + SB2 §3C refs) | Sonnet | accepted | `bd4769e` + fix | Sol running (gate) |
| — | Review gate: `store.md` vs CW5 §4–5; SB1 phase commit | Sol | pending | — | — |
| 3 | Skills: all 13 `skills/*/SKILL.md` | Sonnet (parallel with 4) | pending | — | — |
| 4 | Commands + guides (incl. checkpoint capture-list fix) | Sonnet (parallel with 3) | pending | — | — |
| 6 | Gate + release: greps, validate, parity run, adversarial read, bump, land on `main` | inline | pending | — | — |

## Current position

SB1 phase committed. Gate review (Sol on Slice 2; the CW5 §4–5 comparison was already done in Slice 1's review) runs alongside Slices 3 and 4 in parallel worktrees.

## Decisions and deviations

- Rob 2026-10-15: `store/local.md` in SB1; SB1+SB2 one release; structural parity; baseline before ISSUE069 (done).
- 3a/3b merged into one skills slice: the measured surface is ~90 hits across skills/commands/guides, far below the plan's estimate; skills and commands+guides run in parallel worktrees (disjoint files).
- Slice 2 extras: 3 non-history lines in file-schemas.md also moved to "per store.md"; prose-spec/blueprint-spec had no hits; kitbash's external `codex exec` prompt left as is.
- Guides (planned slice 5) folded into Slice 4: guides land in the repo, so Haiku is out; one Sonnet slice is cheaper than two.
- Slice 1 open calls taken: no `storage` block → local; local `delete` unavailable (report names the file for the author to remove; no shell); local edits all-or-nothing by pre-checking anchors; edit grammar is old/new pairs + `replace_all` (AP4 must map single edits to the app's `replace_range`).
- Sol review of Slice 1 (all confirmed, fixed in `3f054f1`): concurrency baseline pinned to the preparing read and guard fires on any version change (CW5 "moved", wider than SB1's "higher"); non-atomic write recovery; subagent briefs carry triggered clauses; computed config changes route to a writable realization; `local_root` roots local; series chapter `.history/` and root-relative snapshot paths; resolve bootstraps via local; re-resolve on project change.
- `mcp__*` in `allowed-tools`: validator accepts it but only type-checks the field; runtime pre-approval unverified (SB5).
- `checkpoint` capture list fix is the one deliberate behavior change (baseline finding).
- No TypeScript here: the check per slice is `claude plugin validate .` plus the SB2 greps.

## Parity harness

`~/Git/storystormer-parity/` (README § Baseline findings). Baselines `baseline-a`, `baseline-b` on frozen `main` @ `ef1ef20`. After Slice 4: `python3 run.py ~/Git/storystormer-plugin after-sb2 opus`, then `compare.py` and `invariants.py` against both baselines.

## Open items

- Rob: delete the private Notion page "StoryStormer Storage Test"; ISSUE068 § A triage after the first real MCP session.
- Log entries owed at the end: model-picks lines for every slice.

## Last check

`claude plugin validate .` — not yet run on this branch.
