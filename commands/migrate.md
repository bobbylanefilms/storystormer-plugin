---
description: Move the story to another home (this folder, Dropbox, or Notion), leaving the original untouched; or, with `upgrade`, convert an old-layout project in place
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Task", "mcp__*"]
---

<!-- ABOUTME: The /storystormer:migrate command: moves a project between storage backends by invoking the migrate skill -->
<!-- ABOUTME: With no argument, lists the targets this session can reach and why any backend is missing; `upgrade` runs the in-place layout upgrade -->

# /storystormer:migrate

Invoke the `migrate` skill to move the current project to another backend: `/storystormer:migrate notion`, `/storystormer:migrate dropbox`, or `/storystormer:migrate local` (this open folder; `folder` means the same).

Resolve the store first per `references/store.md` if the session hasn’t; the resolved binding is the source.

## `upgrade`

`/storystormer:migrate upgrade` runs the skill’s layout upgrade (§ The layout upgrade): an old-layout project, one whose config has no `layout`, converted to the current layout in place, in the store it already lives in. Resolution offers the same thing when it finds the old layout, and accepting that offer is the same as running this. The skill’s preflight is the plan: entry counts per log, what moves into the journal, the question titles it will compose, what leaves `state.md`, the slug, the snapshot path (or, on Notion, the version-history note), and the new config. It waits for the author’s go before writing anything. On a layout-2 project, say there is nothing to upgrade, unless an earlier upgrade left the old logs at the root, in which case offer to finish removing them, or, on Notion, any Decisions or Questions row of the project still lacks its entry mark (`_entry`), in which case the upgrade may run again to convert those rows.

## With an argument

Hand the target to the skill (`upgrade` is not a target: see above). If it isn’t one the session can reach (the source’s own kind, a pending binding, a connector that isn’t present, `local` with no open folder), say which and why, list the targets that are available, and stop. Otherwise the skill runs its preflight, which is the plan: what will be copied, mapped, computed or skipped, the estimated call volume, the same-slug check, and the config change in the open folder. It waits for the author’s go before writing anything.

## With no argument

List the targets this session can reach, each in the author’s terms (this folder; a folder at `/StoryStormer/<slug>/` in Dropbox, noting when this folder already syncs through Dropbox and the move would make it a hybrid; a row in the Notion `StoryStormer` hub), and every backend in `store.md` § Bindings that isn’t listed, with the reason: it is where the story lives now, its binding is pending, its connector isn’t connected (name it), or there is no open folder. When the project is in the old layout, say so too: a move writes the target in the current layout and leaves this copy as it is, and `/storystormer:migrate upgrade` converts it in place instead. Ask which one; write nothing.

A move’s source is never deleted, and no source document changes: the one write outside the target repoints the open folder’s config. The report says where the source is and how to go back.
