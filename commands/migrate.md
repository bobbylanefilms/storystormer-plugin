---
description: Move the story to another home (this folder, Dropbox, or Notion), leaving the original untouched
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Task", "mcp__*"]
---

<!-- ABOUTME: The /storystormer:migrate command: moves a project between storage backends by invoking the migrate skill -->
<!-- ABOUTME: With no argument, lists the targets this session can reach and why any backend is missing -->

# /storystormer:migrate

Invoke the `migrate` skill to move the current project to another backend: `/storystormer:migrate notion`, `/storystormer:migrate dropbox`, or `/storystormer:migrate local` (this open folder; `folder` means the same).

Resolve the store first per `references/store.md` if the session hasn’t; the resolved binding is the source.

## With an argument

Hand the target to the skill. If it isn’t one the session can reach (the source’s own kind, a pending binding, a connector that isn’t present, `local` with no open folder), say which and why, list the targets that are available, and stop. Otherwise the skill runs its preflight, which is the plan: what will be copied, mapped, computed or skipped, the estimated call volume, the same-slug check, and the config change in the open folder. It waits for the author’s go before writing anything.

## With no argument

List the targets this session can reach, each in the author’s terms (this folder; a folder at `/StoryStormer/<slug>/` in Dropbox, noting when this folder already syncs through Dropbox and the move would make it a hybrid; a row in the Notion `StoryStormer` hub), and every backend in `store.md` § Bindings that isn’t listed, with the reason: it is where the story lives now, its binding is pending, its connector isn’t connected (name it), or there is no open folder. Ask which one; write nothing.

The source is never deleted, and no source document changes: the one write outside the target repoints the open folder’s config. The report says where the source is and how to go back.
