<!-- ABOUTME: User-facing how-to guide for installing StoryStormer from the marketplace in Claude Cowork and Claude Code -->
<!-- ABOUTME: Third of the help-guide series; covers install, folder connection, updating, and user-side troubleshooting -->

# How-To: Installing StoryStormer

This guide gets the plugin installed and pointed at your story. StoryStormer ships as a **one-entry marketplace** — the GitHub repo *is* the marketplace, and it holds a single plugin. You add the marketplace once, install the plugin from it, and updates flow through the same channel.

Both surfaces install from the same bundle:

| | **Claude Cowork** (desktop app) | **Claude Code** (CLI / IDE) |
|---|---|---|
| Best for | Writing — the polished conversational surface | Terminal users; also the surface for hacking on the plugin itself |
| Installs from | The public GitHub repo | The GitHub repo, or a local clone |
| Reaches your files via | A **connected folder** (Settings) | Whatever folder you launched it in |

You only need one of them. Most authors want Cowork.

---

## Installing in Claude Cowork

1. **Add the marketplace.** Open **Customize → Plugins → Personal Plugins → Add Marketplace**, enter:

   ```
   bobbylanefilms/storystormer-plugin
   ```

   and hit **Sync**. Cowork reads the repo's marketplace catalog from GitHub — no clone, no git setup on your end.

2. **Install the plugin.** From the synced marketplace, install **`storystormer`** (its full id is `storystormer@storystormer-marketplace`).

3. **Connect your story folder.** Open **Settings → connect a folder** and point it at the directory where your story lives (or an empty one where it will). This folder connection is how the skills read and write your files — there's nothing else to configure.

4. **Verify.** In a session with the folder connected, run `/storystormer:init` (for a new project) or just ask *"status"* on an existing one. If the slash commands autocomplete with the `storystormer:` prefix, the install worked.

> Installing for a whole team instead? An org admin can publish the same marketplace under **Organization settings → Plugins**, and members install from there — the steps after that are identical.

## Installing in Claude Code

Add the marketplace, install, then launch from your story folder:

```bash
claude
```

Then inside the session:

```text
/plugin marketplace add bobbylanefilms/storystormer-plugin
/plugin install storystormer@storystormer-marketplace
```

Now `cd` into your **story folder** and start a session there — that's where the skills operate. The `/plugin` command (no arguments) opens a menu where you can inspect, disable, or uninstall it later.

---

## Point it at a story, not at the plugin

One thing trips people up: **the skills act on whatever folder the session is open in.** Install once, then *use* the plugin from a story folder — empty, or holding your brain dump, draft treatment, whatever you have. Don't run `/storystormer:init` inside a clone of the plugin repo itself; there's no story there to develop.

One folder = one project (a standalone novel, or a whole series in series mode). Writing two unrelated novels? Two folders — connect whichever you're working on.

---

## Updating

New versions are published to the same marketplace, and an update only appears when the plugin's version number changes.

**In Cowork:** re-sync the marketplace (same Plugins screen), update the plugin when it shows one, then **restart your session** — a running session keeps the old skill bodies loaded until you start fresh.

**In Claude Code:**

```text
/plugin marketplace update storystormer-marketplace
```

then start a new session.

Updates never touch your story files. The plugin is skills and reference docs; your project is plain markdown in your own folder, and it stays put across any number of plugin updates (or a full uninstall).

---

## Troubleshooting

| Symptom | What's going on | Fix |
|---|---|---|
| **"Marketplace sync failed"** in Cowork | Cowork's cloud sync can only read **public** repos, or the repo name was mistyped | Check the spelling (`bobbylanefilms/storystormer-plugin`); if you're hosting your own copy, make the repo public |
| **Installed, but nothing happens** when you talk about your story | The session isn't in (or connected to) a story folder | Cowork: connect the folder in Settings. Claude Code: launch from the story directory |
| **Slash commands don't autocomplete** | Plugin not actually installed, or the session predates the install | Re-check the install, then start a new session |
| **An update isn't showing up** | Marketplace not re-synced, or the session is stale | Re-sync the marketplace, update the plugin, restart the session |
| **Skills don't auto-trigger** from natural phrasing | Intent didn't match — rare, but possible with unusual phrasing | Use the slash command (`/storystormer:init`, etc.) or name what you want plainly: *"set up StoryStormer here"* |

---

## Hosting your own copy

Forked the repo, or building on it? Two constraints matter: the marketplace root must be the **repo root** (it can't live as a subfolder of another repo), and for Cowork the repo must be **public** — Cowork's cloud sync has no way to use your git credentials. Point the marketplace-add step at your own `user/repo` and everything else works the same. The full maintainer playbook — local iteration, validation, the release loop — is [PLUGIN-GUIDE.md](../PLUGIN-GUIDE.md).

---

## You're installed — now what?

Head to **[Developing Your Story — From Idea to Outline](developing-your-story.md)**. It starts exactly where you are now: a connected folder and `/storystormer:init`.
