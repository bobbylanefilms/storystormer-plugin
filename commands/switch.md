---
description: Switch the current focus to a different book in a series project. Series mode only.
allowed-tools: ["Read", "Edit", "Glob"]
---

# /storystormer:switch

Change the **current focus** in a series project. The slash command takes a book slug as its argument: `/storystormer:switch book-2`.

## Preconditions

- `state.md` must show `project_type: series`. If the project is standalone (`project_type: novel`), refuse the command and explain: *"This project is a single-novel workspace. The `/storystormer:switch` command only applies to series projects. If you meant to convert this project to a series, ask me to run `/storystormer:init` in convert-to-series mode."*
- The book slug argument must match one of the slugs in `books:` in `state.md` (or in `.storystormer/config.json`). If it doesn't match, list the available slugs and ask the user to pick.

## What to do

1. **Validate the book slug.** Read `state.md` frontmatter and `.storystormer/config.json`'s `books` array. If the slug isn't listed, surface the valid options and stop.

2. **Verify the book folder exists.** Check that `books/<slug>/` exists. If it doesn't (e.g., user added the book to the list but never scaffolded the folder), offer to scaffold it via a recommended `/storystormer:init` re-run rather than silently creating an empty folder.

3. **Update both stores.**
   - Edit `state.md` frontmatter: set `current_focus: <slug>`. Update the `last_session` date.
   - Edit `.storystormer/config.json`: set `"current_focus": "<slug>"`.

4. **Read the newly-focused book's `state.md`.** Load `books/<slug>/state.md` and pull out its `Summary`, `What Exists`, `What's Next`, and `Last Session` sections.

5. **Report the new focus.** Format the report so the user can immediately see where they are in the new book:

   > Switched focus to **<title>** (`<slug>`).
   >
   > **Stage**: <stage>
   > **What exists**: <one-line summary>
   > **What's next**: <one-line from per-book state.md>
   > **Last session**: <one-line>
   >
   > [Optional: 1–2 series-level notes if there are pending cross-book decisions or open questions that affect this book — pull from the series-level state.md and `series.md`'s Open Cross-Book Questions section.]

## Behavior notes

- The switch is **non-destructive**. It changes only the focus pointer; no per-book files are modified.
- The previously-focused book's state remains exactly as it was — work in progress is preserved. Switching is cheap and reversible.
- If the user invokes `/storystormer:switch` without an argument, list the available books with their slugs and titles and ask which one to switch to.
- If `current_focus` already matches the argument (user switched to the book they're already on), report the current state without making any edits.

## Edge cases

- **The user just ran init with multiple books and hasn't worked on any yet.** All books are at `concept` stage. The switch still works; report the empty state honestly.
- **The user wants to switch but is mid-conversation in another skill.** Surface the request to the user: *"You're mid-`brainstorm-session` for book 1. Switch focus to book 2 now, or finish this thread first?"* Don't switch silently if a skill is actively running.
- **The user adds a book name that isn't in the list yet.** Don't auto-create — refuse and explain that adding books to a series is an `/storystormer:init` operation (or future `add-book` skill, post-POC).

This command does not generate or modify any content. It only flips the focus pointer and reports the new state.
