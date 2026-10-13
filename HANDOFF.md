<!-- ABOUTME: Session handoff for long-running work in this repo; rewritten whole at each checkpoint -->
<!-- ABOUTME: Current thread: the storage-backend stage (SB1–SB5) planning, 2026-10-12 -->

# HANDOFF — storystormer-plugin

**Date:** 2026-10-12 · **Branch:** `main` · **Thread:** storage-backend stage planning (no implementation started)

## Where things stand

- Research into Dropbox, Google Drive, Notion and the Microsoft 365 connectors is done and recorded in the web-app repo at `plan/_cowork/CW5-storage-backends-brainstorm.md` (decisions by Rob, 2026-10-12: tiers, five Notion databases, plan split).
- Five execution plans written here: `.plans/SB1-store-contract.md`, `SB2-skill-rewrite.md`, `SB3-backend-bindings.md`, `SB4-onboarding-and-migrate.md`, `SB5-backend-test-matrix.md`. Run them in order with `/implement`.
- The web-app repo's `AP0–AP5` plans carry CW5 cross-references; `AP4` was re-scoped to the StoryStormer binding (it now assumes SB1, SB2 and SB4 are done first).

## Next

1. `/implement .plans/SB1-store-contract.md` in a fresh session (plugin repo).
2. SB2 → SB3 → SB4 → SB5, each a release (version bump both manifests, `claude plugin validate .`, land on `main`, re-sync Cowork).
3. Re-test the Google Drive and Microsoft 365 connectors around November 2026 (Tier 3 today: sync-folder only).

## Open items for Rob

- A private Notion page "StoryStormer Storage Test" from the research needs a manual delete (the connector has no page-delete tool; its database is already trashed).
