---
description: Set up a StoryStormer story workspace, with any starting materials, asking where the story should live
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "WebSearch", "Task", "mcp__*"]
---

# /storystormer:init

Invoke the `storystormer-init` skill on the user's open folder (or, with none, on what the user brings into the conversation). The skill will:

1. Read whatever is in the project (or note that it's empty).
2. Triage the project's maturity (`concept` / `brain-dump` / `brainstorming` / `treatment-drafted` / `treatment-refined`).
3. Ask 2–4 questions to fill in what the materials don't tell it, and, for a new project, where the story should live: this folder, or Dropbox or Notion when the session can reach them (the skill’s § Where a new project lives). A re-run on an existing project keeps its store; moving one is `/storystormer:migrate`.
4. Propose a plan for what it will scaffold, what it will defer, and where the story will live.
5. Wait for the user's go-ahead before writing anything.
6. Scaffold the canonical structure (`state.md`, `.storystormer/`, the `decisions/` and `questions/` collections with their indexes and any approved intake entries, the session's first journal entry, and only the deeper files appropriate to the maturity stage) in the store the user chose, then report where it lives and how to get back to it.

This is the marquee skill — designed to accept any starting state, from an empty folder to a tangled mid-project mess, and produce a coherent workspace.

Always follows `references/plan-first.md` — propose, confirm, execute, report.
