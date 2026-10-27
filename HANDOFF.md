# HANDOFF — /execute AP4 (plugin side)

<!-- ABOUTME: Run ledger for the AP4 plugin re-target, driven from the web-app repo's /execute AP4 AP6 run. -->
<!-- ABOUTME: Rewritten whole at every checkpoint; git log plus this file are the record after a compaction. -->

1. **Run:** `/execute AP4 and AP6` from `~/Git/storystormer` (orchestrator Fable 5.1, effort medium), 2026-10-26. The web-app repo's `HANDOFF.md` is the run's main ledger; the plan is `~/Git/storystormer/.plans/AP4-plugin-retarget.md` (as-built notes under § 5).
2. **Branch:** `feature/ap4-storystormer-binding` off `main` @ 19bb3e5. Version 0.23.0-poc in both manifests. Not yet on `main`; not yet synced to the claude.ai marketplace.

## Slices (both accepted)

| # | Slice | Tier | Commits | Review |
|---|---|---|---|---|
| P1 | `references/store/storystormer.md` binding, contract text (`store.md`, `file-schemas.md`), `checkpoint` on versions | Opus 5.5 | 67a3f61, 10e6732 | Sol: 21 findings, 15 confirmed, fixed |
| P2 | `init` (where a new project lives; picking up a project from the app), locator, `migrate` into/out of the app, `.mcp.json`, README, installing guide, CLAUDE.md, version | Opus 5.5 | d3f9b2c, 6db4303, c128b71 (migration request ids by truncation, not a hash) | Sol: 12 findings, all fixed |

## Current position
Code complete. `claude plugin validate .` passes (pre-existing warnings only); the skills/commands grep for connector tool names is clean; an MCP smoke against the dev server matched every rule the binding states (project `AP4 Smoke 2026-10-26`, id `ks7fwq9xkk8r7tmhbxtdhs9jsn8h3r0r`, for Rob to purge).

## Open for Rob
- Acceptance runs 1–10 (plan § 4): the live rings, `migrate upgrade` into the server, The Lighthouse Ledger move, both loops, the races, the four surfaces, the handoff, the back-and-forth story. Record timings and transcripts here or in the plan file.
- Review the branch, land it on `main`, Sync the claude.ai marketplace.
- Server gaps the binding works around: `~/Git/storystormer/.plans/ISSUE072-mcp-server-gaps-from-the-ap4-binding.md` (items 3, 5, 6 are design calls). Remove each binding rule as its gap closes.

## Last checks
c128b71: `claude plugin validate .` passes; grep clean; the markdown-profile probe (`tests/markdown-profile/`) untouched by this run.
