---
description: Set up a StoryStormer story workspace in the current folder, with any starting materials
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "WebSearch", "Task"]
---

# /storystormer:init

Invoke the `storystormer-init` skill on the user's current folder. The skill will:

1. Read whatever is in the folder (or note that it's empty).
2. Triage the project's maturity (`concept` / `brain-dump` / `brainstorming` / `treatment-drafted` / `treatment-refined`).
3. Ask 2–4 questions to fill in what the materials don't tell it.
4. Propose a plan for what it will scaffold and what it will defer.
5. Wait for the user's go-ahead before writing anything.
6. Scaffold the canonical structure (`state.md`, `.storystormer/`, `decisions.md`, `questions.md`, and only the deeper files appropriate to the maturity stage).

This is the marquee skill — designed to accept any starting state, from an empty folder to a tangled mid-project mess, and produce a coherent workspace.

Always follows `references/plan-first.md` — propose, confirm, execute, report.
