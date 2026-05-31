<!-- ABOUTME: Maintainer guide for developing, testing, and releasing the StoryStormer plugin -->
<!-- ABOUTME: Covers both surfaces (Claude Cowork desktop + Claude Code CLI), the edit/test/release loop, and the gotchas -->

# StoryStormer Cowork/Code Plugin Guide

The maintainer's playbook for this repo. How the plugin is structured, how to install it on both surfaces, how to iterate, and how to release — plus the gotchas that cost real time to discover.

If you just want the short version, read **[CLAUDE.md](CLAUDE.md)** — it's the non-negotiable checklist. This guide is the full picture.

---

## 1. What this repo is

This single repo is **both the plugin and a one-entry marketplace**, and it is the **single source of truth** — there is no copy in the web-app repo anymore (the `bobbylanefilms/storystormer` repo keeps only the `plan/_cowork/CW0–CW3` design notes).

```
storystormer-plugin/                 (repo root = marketplace root = plugin root)
├── .claude-plugin/
│   ├── plugin.json                  # the plugin manifest (name: storystormer)
│   └── marketplace.json             # one-entry catalog (name: storystormer-marketplace)
│                                    #   the single plugin's "source" is "./"
├── skills/                          # 9 progressive-disclosure skills
│   ├── storystormer-init/  brainstorm-session/  decision-capture/
│   ├── character-bio/  worldbuilding-entry/  treatment-update/
│   ├── manifest-sync/  pre-outline-session/  outline-chapters/
├── commands/                        # 7 slash commands (/storystormer:*)
│   ├── init  status  checkpoint  decisions  questions  outline  switch
├── references/                      # 12 shared docs the skills cite by relative path
├── README.md                        # user-facing
├── PLUGIN-GUIDE.md                  # this file (maintainer)
└── CLAUDE.md                        # operating contract for Claude Code sessions in this repo
```

Three names, three roles — don't confuse them:

| Role | Name | Where it shows up |
|---|---|---|
| Repo (the distributable) | `storystormer-plugin` | `/plugin marketplace add bobbylanefilms/storystormer-plugin` |
| Marketplace (the catalog) | `storystormer-marketplace` | `/plugin install storystormer@storystormer-marketplace` |
| Plugin (the installed thing) | `storystormer` | `/storystormer:init`, `/storystormer:status`, … |

It runs on **both** surfaces from the same bundle — Cowork and Claude Code share the skill/command/sub-agent engine.

---

## 2. The two surfaces

| Concern | Claude Cowork (desktop app) | Claude Code (CLI/IDE) |
|---|---|---|
| **What it's for** | The polished, conversational surface — the place you actually write stories | Authoring the plugin; fast local iteration |
| **Install source** | **Must be the public GitHub repo** (cloud sync, no local auth) | GitHub repo **or** a local path (`~/Git/storystormer-plugin`) |
| **Private repo?** | ❌ Not supported — Cowork's sync runs on Anthropic's cloud and can't use your git creds | ✅ Works (uses local `gh`/Keychain creds) |
| **Filesystem** | "Folder connection" (Settings → connect a folder) — native read/write, no MCP needed | Native Read/Write/Edit on the cwd |
| **Where you EDIT the plugin** | (not here) | A session rooted in `~/Git/storystormer-plugin` |
| **Where you RUN the plugin** | A connected story folder | A session rooted in a **story folder** (not the plugin repo) |

**The edit-vs-run distinction matters:** the skills operate on whatever folder is open. You *edit* the plugin in the plugin repo; you *exercise* it from a story folder that holds the `.md` files. Same on both surfaces.

---

## 3. Installing

### Cowork (desktop) — the writing surface
1. **Customize → Plugins → Personal Plugins → Add Marketplace** → enter `bobbylanefilms/storystormer-plugin` → **Sync**.
2. Install the plugin (`storystormer@storystormer-marketplace`).
3. **Settings → connect a folder** → point at your story directory.
4. Talk to it, or run `/storystormer:init` in an empty/seed folder.

### Claude Code (CLI) — the dev surface
```bash
# from GitHub (auto-updates on marketplace update):
/plugin marketplace add bobbylanefilms/storystormer-plugin
# …or from your local clone (reads your working copy — best for iteration):
/plugin marketplace add ~/Git/storystormer-plugin

/plugin install storystormer@storystormer-marketplace
```
Then `cd` into a story folder to actually use the skills.

---

## 4. The edit → test → release loop

Two loops. Keep them separate — most iteration is the inner loop, and it needs no push and no version bump.

### Inner loop — iterate + test locally (fast, free)
1. Open Claude Code in `~/Git/storystormer-plugin`. Edit skills/commands/references.
2. **`claude plugin validate .`** — must pass before you trust anything.
3. Pick up the edits in your local Claude Code install: `/plugin marketplace update storystormer-marketplace` (re-reads the local folder), then re-run the skill.
4. Exercise it from a **story folder** (a throwaway test project, or `Twelve to Zero`). Repeat.

No GitHub round-trip, no version bump — you're testing your working copy directly.

### Outer loop — publish to Cowork (the release)
Only when you're happy with a change and want it live in Cowork:
1. **Bump `version`** in **both** `.claude-plugin/plugin.json` **and** the `marketplace.json` plugin entry (they must agree).
2. **`claude plugin validate .`** — must pass.
3. **Commit + push** to GitHub.
4. **In Cowork:** re-sync the marketplace, update the plugin, and refresh/restart the session so the new skill bodies load.

> Doc-only or meta changes (editing this guide, the README, CLAUDE.md) **don't** need a version bump — they aren't shipped plugin components, so Cowork doesn't need to re-pull them.

---

## 5. The non-negotiables (the stuff that bites)

1. **Bump `version` in BOTH manifests on every functional release.** Cowork only pulls an update when `version` changes. Edit a skill, forget the bump, and `/plugin marketplace update` says "up to date" while you stare at stale behavior. `claude plugin tag` validates that `plugin.json` and the marketplace entry agree.
2. **`claude plugin validate .` before every push.** It reproduces Cowork's resolver offline. This is the tool that caught `source: "."` being invalid — two seconds in the terminal vs. debugging a failed sync in the UI.
3. **Cowork requires the repo to be PUBLIC.** No cloud-side git auth, no token field. If you ever need privacy, that work happens in Claude Code (local/private), not Cowork. Re-privatizing the repo silently breaks Cowork.
4. **`source` in marketplace.json must be `"./"`, not `"."`.** Bare `.` fails validation (`plugins.0.source: Invalid input`). The plugin sits at the repo root; the trailing slash is required.
5. **Nothing may reach outside the plugin folder.** On install the bundle is copied to a cache, so `../` paths break. Skills cite `references/*.md` by in-bundle relative path — keep references inside the repo. (This is why the old `../../../../CLAUDE.md` link had to go.)
6. **Don't assume a shell.** Cowork's file primitive is the folder connection, not `Bash`. File operations use `Read`/`Write`/`Glob`. Don't add a command/skill that depends on `Bash` to function.
7. **One source of truth.** This repo. Do not recreate a copy in the web-app repo — that was deleted on purpose to stop drift.

---

## 6. Versioning convention

Current: `0.4.0-poc`. While it's a POC, keep the `-poc` suffix.

- **Patch** (`0.4.0 → 0.4.1`): prompt/texture tweaks, bug fixes, reference edits that change behavior.
- **Minor** (`0.4.x → 0.5.0`): a new skill or command, or a meaningful capability.
- **Major** (`0.x → 1.0.0`): drop `-poc` when it graduates from proof-of-concept.

Bump both manifest copies together. Consider `git tag` (or `claude plugin tag`) at each release so you can diff "what changed since the last Cowork sync."

---

## 7. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| **"Marketplace sync failed"** in Cowork | Repo is private, or `marketplace.json` is invalid | Make the repo public; run `claude plugin validate .`; confirm `source: "./"` |
| Sync fails even though repo is public | Invalid manifest (`source`, missing required field, bad JSON) | `claude plugin validate .` — it names the offending field |
| **My change didn't show up in Cowork** | `version` not bumped, or didn't re-sync/restart | Bump version in both files, push, re-sync the marketplace, restart the session |
| Change didn't show up in **Claude Code** | Local install cached the old copy | `/plugin marketplace update storystormer-marketplace`, then re-run |
| A skill can't find a `references/…` file | A `../` escape, or a reference left outside the bundle | Keep all cited files inside the repo; no `../` |
| A command silently does nothing in Cowork | It depends on `Bash` | Rewrite with `Read`/`Write`/`Glob` |
| Skills aren't auto-triggering | Skill `description` doesn't match the user's phrasing | Tune the description (it's the progressive-disclosure trigger) |

**First move for almost any plugin problem:** `claude plugin validate .` in the repo, and `claude plugin details storystormer` to see what components actually loaded.

---

## 8. Relationship to the StoryStormer web app

This plugin is a **parallel offering** to the [StoryStormer web app](https://storystormer.io), not synced with it. They share the philosophy (brainstorm → canon → treatment → outline), the framework vocabulary, the decision-log + question-triage model, and the two-phase treatment pipeline. They diverge on surface (conversation vs. web UI), persistence (local markdown vs. Convex), and orchestration (model-as-orchestrator + sub-agents vs. a job dispatcher). Design history lives in the web-app repo at `plan/_cowork/CW0–CW3`.
