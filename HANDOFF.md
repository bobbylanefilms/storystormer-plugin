<!-- ABOUTME: Session handoff for long-running work in this repo; rewritten whole at each checkpoint -->
<!-- ABOUTME: Current thread: the storage-backend stage (SB1–SB5), SB1+SB2 sliced and baselined, 2026-10-15 -->

# HANDOFF — storystormer-plugin

**Date:** 2026-10-15 · **Branch:** `main` @ `ef1ef20` (v0.17.2-poc) · **Thread:** SB1+SB2 sliced; parity baseline capturing; implementation **not started** (waiting on ISSUE069 in the app repo to finish its build, review loop and merge, per Rob)

## Decisions this session (Rob, 2026-10-15)

1. `references/store/local.md` moves from SB3 into SB1 (SB1's success test and SB2's adversarial check both need a binding in hand).
2. SB1 and SB2 ship as **one release**: one branch, two committed phases, one version bump (→ `0.18.0-poc`), one landing on `main`.
3. Behavioral parity is judged **structurally** (files written, snapshot trees, index updates, `state.md` fields), never on generated prose.
4. The baseline runs now, before ISSUE069 lands (it changes nothing in this repo).

All four are recorded in the plans' Key decisions (`SB1` § 1, `SB2` § 1, `SB3` § A).

## Slicing for SB1+SB2

| # | Slice | Files | Tier |
|---|---|---|---|
| 0 | Baseline capture | `~/Git/storystormer-parity/` | headless runs (in progress) |
| 1 | Contract | `references/store.md`, `references/store/local.md`; check `mcp__*` in `allowed-tools` validates | Opus |
| 2 | Schema, references, docs | `file-schemas`, `plan-first`, `reading-discipline`, `subagent-pattern`, `prose-spec`, `blueprint-spec`, `series`, `kitbash-spec`; `CLAUDE.md`, `PLUGIN-GUIDE.md`, `README.md` | Sonnet |
| — | Review gate | fresh-context check of `store.md` against CW5 § 4–5 | fresh context |
| 3a | Skills, heavy half | `treatment-update`, `worldbuilding-entry`, `character-bio`, `canon-sync`, `blueprint`, `pre-outline-session`, `outline-chapters` | Sonnet (parallel with 3b) |
| 3b | Skills, light half | `storystormer-init`, `notes`, `manifest-sync`, `prose`, `brainstorm-session`, `decision-capture` | Sonnet |
| 4 | Commands | 7 files; `checkpoint`/`switch` non-local rules | Sonnet |
| 5 | Guides | 3 files | Haiku |
| 6 | Gate and release | both greps, validate, `run.py … after-sb2` + `compare.py`, adversarial cold read, bump, land on `main` | Opus |

SB1 is one committed phase (slices 1–2 plus the gate); SB2 is the second (slices 3–6).

## Parity harness

`~/Git/storystormer-parity/` (outside the repo so it never ships in the bundle; see its README). A frozen copy of `main` @ `ef1ef20`, a Good Dog fixture and a series brain-dump fixture, and a 20-step headless script (the dev loop, the chapter loop on ch 1–2, all seven commands, `init` and `switch` in series mode). Two baseline runs (`baseline-a`, `baseline-b`) measure run-to-run noise. Note: Rob's installed plugin is 0.16.1-poc; the harness uses `--plugin-dir` with the installed one disabled, so it is unaffected.

## Next

1. Confirm both baselines completed; run `compare.py baseline-a baseline-b` and note the noise floor.
2. When ISSUE069 has merged: branch `feat/sb1-sb2-store-contract` from `main`, then slices 1 → 6.
3. SB3 → SB4 → SB5, then AP4 and AP5 in the web-app repo.
4. Re-test the Google Drive and Microsoft 365 connectors around November 2026.

## Open items for Rob

- A private Notion page "StoryStormer Storage Test" from the research needs a manual delete.
- The ISSUE068 § A triage session after the first real plugin session against the MCP server.
