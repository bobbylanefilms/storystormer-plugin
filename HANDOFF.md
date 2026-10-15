<!-- ABOUTME: Session handoff for long-running work in this repo; rewritten whole at each checkpoint -->
<!-- ABOUTME: Current thread: the storage-backend stage (SB1–SB5), ready to start, 2026-10-14 -->

# HANDOFF — storystormer-plugin

**Date:** 2026-10-14 · **Branch:** `main` @ `74bdda7` (v0.17.2-poc) · **Thread:** storage-backend stage SB1–SB5, no implementation started

## What changed since the 2026-10-12 handoff

- **AP0 B1–B12 landed on `main`** (`df63313`, `bcc603e`, `74bdda7`, v0.17.2-poc): the plugin's file formats now match the app's MCP virtual filesystem (decision `Source` vocabulary, quoting-rule whitespace, tag hyphens and the three-tag rule, never-demote stage, provenance stamps, bio file slugs, chapter padding past 99, series `Scope` slug, short-outline wording). The feature branch is deleted locally and on origin; `feat/artifact-boundaries` and `feat/blueprint-v3-fidelity` remain on origin, merged and untouched.
- **The app side shipped and is live.** AP0–AP3 merged into the web-app repo's `main` on 2026-10-14 ([PR #170](https://github.com/bobbylanefilms/storystormer/pull/170), four-round review loop). The MCP server answers at `https://storystormer.vercel.app/api/mcp` with Clerk OAuth (CIMD + PKCE, opaque tokens); Rob's Claude Code has it registered at user scope as `storystormer` and signed in; `whoami` and `list_projects` return live data. Branch previews sit behind Vercel SSO, so only production is reachable by MCP clients.
- **Round-trip gap inventory.** Two independent reviews of the plugin's contract against the app's virtual filesystem (37 + 24 findings) are triaged in the web-app repo at `.plans/ISSUE068-mcp-plugin-roundtrip-gaps.md`: § A tool-surface gaps for AP5, § B model decisions (§ B 21 decided: the path map translates book-local chapter numbers, option a), § C binding behaviors for AP4. Read § C before writing `store/storystormer.md` in AP4; nothing in it blocks SB1–SB5.
- **ISSUE069** (app repo, in progress on `fix/issue069-sweep-novel-scope` as of this handoff): the app's decision sweep now scopes each decision to a book (`novel_id`, a Convex novel id, `""` = series-wide), the same vocabulary `record_decision` uses. If a plugin skill ever reads decisions through the MCP, expect a book on each row.

## Where things stand

- Research into Dropbox, Google Drive, Notion and the Microsoft 365 connectors is done and recorded in the web-app repo at `plan/_cowork/CW5-storage-backends-brainstorm.md` (decisions by Rob, 2026-10-12: tiers, five Notion databases, plan split).
- Five execution plans here: `.plans/SB1-store-contract.md`, `SB2-skill-rewrite.md`, `SB3-backend-bindings.md`, `SB4-onboarding-and-migrate.md`, `SB5-backend-test-matrix.md`. Run them in order with `/implement`.
- The web-app repo's `AP4` plan assumes SB1, SB2 and SB4 are done first; `AP5` takes the ISSUE068 § A backlog.

## Next

1. `/implement .plans/SB1-store-contract.md` in a fresh session (this repo). Start from `main` @ `74bdda7`.
2. SB2 → SB3 → SB4 → SB5, each a release (version bump in both `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`, `claude plugin validate .`, land on `main`, re-sync Cowork).
3. Then back to the web-app repo for AP4 (plugin re-target) and AP5.
4. Re-test the Google Drive and Microsoft 365 connectors around November 2026 (Tier 3 today: sync-folder only).

## Open items for Rob

- A private Notion page "StoryStormer Storage Test" from the research needs a manual delete (the connector has no page-delete tool; its database is already trashed).
- The ISSUE068 § A triage session (sort the tool-surface gaps into AP5, AP4 or drop) after the first real plugin session against the MCP server.
