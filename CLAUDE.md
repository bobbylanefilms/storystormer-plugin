# CLAUDE.md — StoryStormer Plugin Repo

Operating contract for any Claude Code session working in this repo. Full playbook: **[PLUGIN-GUIDE.md](PLUGIN-GUIDE.md)**.

## What this repo is

The **single source of truth** for the StoryStormer plugin — a conversational story-development workspace (brainstorm → canon → treatment → outline) that runs in **Claude Cowork (desktop)** and **Claude Code (CLI)** from the same bundle.

This repo is simultaneously the **plugin** and a **one-entry marketplace**: `.claude-plugin/` holds both `plugin.json` (plugin `storystormer`) and `marketplace.json` (marketplace `storystormer-marketplace`, the single plugin's `source` is `"./"`). Install id: `storystormer@storystormer-marketplace`.

There is **no copy elsewhere**. The web-app repo (`bobbylanefilms/storystormer`) keeps only design notes at `plan/_cowork/CW0–CW3`. Do not recreate a mirror.

## Release checklist — DO THIS on every functional change

1. **Bump `version` in BOTH** `.claude-plugin/plugin.json` **and** the `marketplace.json` plugin entry (they must agree). **Cowork only pulls updates when `version` changes** — skip this and your change silently won't appear.
2. **Run `claude plugin validate .`** — must pass before commit. (This is what catches schema breaks like an invalid `source`.)
3. **Commit + push.**
4. **Land it on `main`.** Cowork installs from the repo's **default branch (`main`)** — it does *not* see feature branches. If you developed on a branch, merge it to `main` and push `main` (a fast-forward when the branch is strictly ahead). **Skip this and Cowork stays on whatever `main` last had, no matter how many times you re-sync** — this is the most common "why is it still showing the old version" cause.
5. **Re-sync in Cowork** (update marketplace → update plugin → restart session).

Doc-only changes (README, this file, PLUGIN-GUIDE.md) do **not** need a version bump — they aren't shipped plugin components.

## Hard constraints (don't violate)

- **`source` in marketplace.json must be `"./"`** — bare `"."` fails validation.
- **Repo must stay PUBLIC** — Cowork's cloud sync has no git auth; a private repo breaks Cowork install.
- **No paths escape the bundle** — on install the folder is copied to a cache, so `../` links break. Keep everything skills cite (e.g. `references/*.md`) inside this repo.
- **No `Bash` dependency** — Cowork's file primitive is the folder connection, not a shell. File ops use `Read`/`Write`/`Glob`/`Edit`. Don't add a skill/command that *requires* `Bash` to function.
- **Skills define texture and outputs, not step-by-step procedure** — trust the model; keep descriptions intent-shaped (they're the progressive-disclosure triggers).

## Layout

- `skills/<name>/SKILL.md` — 11 progressive-disclosure skills.
- `commands/<name>.md` — 7 `/storystormer:*` slash commands.
- `references/*.md` — shared docs cited by skills (single-edit-propagates; don't inline-duplicate into skills).
- Edit the plugin **here**; *run/test* it from a **story folder** (the skills act on the open folder, not this repo).

## Quick commands

```bash
claude plugin validate .                              # before every push
claude plugin details storystormer                    # see what components load
claude plugin marketplace update storystormer-marketplace   # re-read after a local edit (Claude Code)
```
