# HANDOFF — Stage AS plugin half (series workspace)

<!-- ABOUTME: Run ledger for the plugin half of the web app's Stage AS (Series Workspace, AS0–AS8), slice 17 of that run. -->
<!-- ABOUTME: Rewritten whole at every checkpoint; git log plus this file are the record after a compaction. -->

1. **Run:** the web app's Stage AS batch (`~/Git/storystormer`, branch `batch/2026-11-23-series-workspace-as0-as3`), slice 17 of 17: the plugin changes each AS plan names under “Plugin repo:”. Plans: `~/Git/storystormer/.plans/AS0-*.md` … `AS8-*.md`.
2. **Branch:** `series-workspace` off `main` @ 08dd86b, pushed. Version 0.27.0-poc in both manifests. **Not merged to `main` and not synced:** the plugin’s `main` is what Cowork installs and it points at production, so it lands only after the app’s series-workspace branch is merged and deployed (Rob’s step), then the claude.ai marketplace Sync.

## What changed
- **References:** `series.md` (current book shared with the app; canon never under `books/`; book tags and the never-narrow rule; the Manifest’s Appears-in lines from the tags; the Series Bible with its entry test, computed sections and feed rule; the book handoff; bringing a book into a series), `file-schemas.md` (§ Book tags on canon entries, canon `books:`, the Bible schema with Structural Conventions and the two computed sections, § `handoff.md`, scope and `integrated` notes), `store.md` (optional `store.search`; a chapter folder moves whole), the bindings (StoryStormer: `move` and `search` realizations, the Bible and handoff as partly computed documents, quirks for the current book, `wrong_scope`, `books:` write semantics, the entry scope default, `integrated` covering treatments only, Convert to Series in the app; local, Dropbox, Notion: chapter-folder moves).
- **Skills and commands:** `character-bio`, `worldbuilding-entry` (search before `books:`, no Quick Reference Appears in), `canon-sync`, `manifest-sync`, `decisions`, `brainstorm-session` (Bible patch rules), `pre-outline-session`, `outline-chapters`, `blueprint` (feed rule, chapter moves, previous handoff), `treatment-update` (Bible first, previous handoff and primer, close-out mode writing `handoff.md`), `init` (convert in the app; add a manuscript to a series), `migrate` (canon `type:`/`books:`; `migrate book`), `/storystormer:status` (series view), `/storystormer:switch`, `/storystormer:checkpoint`.
- **Guides and README** synced; README release notes for 0.27.0.

## Decisions taken
- The book handoff is a mode of `treatment-update` (“close out Book 1”), not a new skill: the shared listing budget is already overflowing (two of this plugin’s skills show no description in a session’s listing).
- The feed rule is applied as the app states it: the canon and chapter-level skills stop reading `series.md`; a book’s Per-Book Synopses paragraph alone may stand in for a book with no treatment.
- `store.search` is a new optional contract operation, so skills never name the connector’s `search`.

## Open for Rob
- **Closed server gap:** the Bible target in `integrated` landed in the app (c9d71a8f); the plugin now marks a patched decision with `series bible yes`.
- Merge after the app’s stage deploys, then Sync the marketplace.
- Nothing here was run live against the AS server.
