<!-- ABOUTME: User-facing how-to guide for installing StoryStormer from the marketplace in Claude Cowork and Claude Code -->
<!-- ABOUTME: Third of the help-guide series; covers install, folder connection, choosing where a story lives, upgrading an older project, updating, and user-side troubleshooting -->

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

2. **Install the plugin.** From the synced marketplace, install **`storystormer`** (its full id is `storystormer@storystormer-plugin`).

3. **Connect your story project.** Open **Settings → connect a folder** and point it at the directory where your story lives (or an empty one where it will). This folder connection is how the skills read and write your files — there's nothing else to configure. (A Dropbox, Drive or OneDrive folder synced to your computer counts as a folder.)

   **Keeping the story in Dropbox or Notion instead?** Connect that connector too (in Cowork, from its connector settings; in Claude Code, `/mcp` shows whether the session has it). When init asks where the story should live, it will offer it; [Choosing where your story lives](#choosing-where-your-story-lives) below explains the options. Connecting a folder as well is worth it: init leaves a small pointer file there (or, in the Dropbox hybrid below, the project itself), so opening that folder next time finds the project.

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
/plugin install storystormer@storystormer-plugin
```

Now `cd` into your **story folder** and start a session there — that's where the skills operate. The `/plugin` command (no arguments) opens a menu where you can inspect, disable, or uninstall it later.

---

## Point it at a story, not at the plugin

One thing trips people up: **the skills act on whatever folder the session is open in.** Install once, then *use* the plugin from a story folder — empty, or holding your brain dump, draft treatment, whatever you have. Don't run `/storystormer:init` inside a clone of the plugin repo itself; there's no story there to develop.

One story project = one standalone novel, or a whole series in series mode. Writing two unrelated novels? Two projects (two folders, or two projects in Dropbox or Notion) — connect whichever you're working on.

---

## Choosing where your story lives

A story can live in one of four homes. Every skill works the same in each; only where the files sit changes.

| Home | What it is | Good for |
|---|---|---|
| **This folder** | The folder your session is open in: Cowork’s connected folder, or wherever you launched Claude Code | The simplest setup. Plain markdown files on your computer that you can open in any editor, back up, or keep under version control |
| **Dropbox** | A folder at `/StoryStormer/<your-project>/` in your Dropbox, reached through the Dropbox connector | Reaching the story from anywhere, including a Cowork session with no folder connected. It’s the same folder tree a local project has, file for file, and snapshots and `/storystormer:checkpoint` work as they do locally |
| **Notion** | A project in a `StoryStormer` page in your Notion workspace, which holds six databases (Projects, Assets, Chapters, Decisions, Questions, Journal), reached through the Notion connector | Browsing and editing the story in Notion itself: characters, chapters, decisions, questions and session journal entries are rows you can open, sort and filter. Notion keeps every page’s version history, so there are no snapshot folders and checkpoints aren’t needed. Moving an existing project in tidies its markdown once; the plan shows what changes, and your words don’t |
| **The StoryStormer app** | A project in the StoryStormer web app, reached through the StoryStormer connector | Working on the story in Claude and in the app’s browser alike: every document the plugin writes shows up in the app at once, and your edits there are what the next session reads. The app keeps every version, so there are no snapshot folders, and `/storystormer:checkpoint` tells you what changed since a point in time. Each report links the documents it wrote |

**How init asks.** When you set up a new project, init asks once: *“Where should this story live?”* It offers only what this session can reach: this folder when one is open, and Dropbox, Notion or the StoryStormer app when their connectors are connected. This folder is the default whenever there is one (Claude Code always has one); in a session with no folder, Notion is the default when it’s connected, and the app when it is the only connector. With only one possibility, init doesn’t ask, and its plan simply says where the story will go; with none (no folder and no connector), it tells you to open a folder or connect Dropbox, Notion or StoryStormer. Running init again on an existing project never asks: the project stays where it is. Moving it later is `/storystormer:migrate` ([Moving a story between homes](developing-your-story.md#moving-a-story-between-homes)).

**A folder and a connector together.** Choose Dropbox, Notion or the app while a folder is open and init leaves a small pointer file in the folder (`.storystormer/config.json`, holding nothing but the story’s address). Open that folder next time and the session goes straight to the project. The one exception is the Dropbox hybrid (next): there the open folder *is* the project’s synced copy, so it holds the whole project, settings file included, rather than a pointer.

**The Dropbox hybrid.** If Dropbox syncs to your computer, one project can be both local and in Dropbox. Keep it at `StoryStormer/<your-project>` inside your Dropbox folder (`~/Dropbox/StoryStormer/the-good-dog`, say): open that folder and the session works on the files locally, at full speed; start a session with no folder and it reaches the very same files through the Dropbox connector. It’s one copy of the story seen two ways, not two copies kept in step, and the Dropbox app does the syncing. Init sets this up when you choose Dropbox with that folder open. A story that sits elsewhere in your Dropbox (`~/Dropbox/Novels/the-good-dog`) starts out as an ordinary local project; init notes that the folder syncs and, when Dropbox is connected, suggests `/storystormer:migrate dropbox`, which copies it into `StoryStormer/` and points the old folder at the new copy.

**Google Drive and OneDrive** work as synced folders. To the plugin they’re just folders on your computer: choose “this folder,” and the service keeps the story backed up and on your other devices. There’s no Drive or OneDrive connection behind it, though, so a session with no folder open can’t reach those stories; open the folder instead.

**A session with no folder open.** Ask about your story in a session with no story folder, and StoryStormer goes looking: it lists the projects it finds in your Dropbox (under `/StoryStormer/`), in your Notion `StoryStormer` page and in your StoryStormer app account, grouped by service, most recently worked on first, each with its stage and last session. A local project kept in the synced Dropbox `StoryStormer/` folder is found too, listed as a synced local project. Pick one and the session works on it. When there’s exactly one and every search went through, it opens that one and tells you so; if a service couldn’t be searched or a project couldn’t be read, it shows what it found, says what went wrong, and asks. Either way, its first reply says where it’s working. Local projects anywhere else can’t be found this way, since there’s nowhere to search for them: open the story’s folder instead.

**Picking up where the app left off.** In the StoryStormer app, **Continue in Claude** gives you a prompt to paste into Claude Code, claude.ai or Cowork. It names your project, so the session goes straight to it, with no list to choose from, and opens with your last session’s summary and what’s next. The wording doesn’t matter: any message that names the project’s id works.

**Connecting the StoryStormer app.** The connector’s address is `https://storystormer.vercel.app/api/mcp` (for now it serves the app’s development deployment). The first time a session uses it, a StoryStormer sign-in opens; sign in with your app account.

1. **Claude Code:** nothing to add. The plugin brings the connector with it, so installing (or updating to v0.23.0) connects it, and the first call opens the sign-in.
2. **claude.ai and Cowork:** open **Settings → Connectors**, choose **Add custom connector**, name it StoryStormer, paste the address, then **Connect** and sign in.
3. **ChatGPT:** where your plan allows custom connectors, turn on developer mode, open **Settings → Connectors**, add a custom MCP connector with the address, and sign in. ChatGPT has no StoryStormer skills, but it reads and writes the same project through the connector.

**Upgrading a project from an older version.** Projects started before v0.22.0 keep decisions and questions in two long files (`decisions.md`, `questions.md`). StoryStormer can read such a project but won’t write to it until you upgrade: each session offers the upgrade, or say ‘upgrade this project,’ or run `/storystormer:migrate upgrade`. It shows you a plan first (how many entries, the question titles it will write, what moves out of `state.md`) and waits for your go. The upgrade then converts the project in place, in the same home it already lives in: every decision and question becomes its own file or row with its number unchanged, each session’s history goes into the journal, and `state.md` shrinks to the short dashboard. Nothing is lost. The old files are kept under `.storystormer/history/<timestamp>-layout-upgrade/` (for example `2026-10-25T14-33-layout-upgrade/`), and in Notion each converted row keeps its page history. If the run is interrupted, nothing is removed; run it again and it picks up where it stopped.

---

## Updating

New versions are published to the same marketplace, and an update only appears when the plugin's version number changes.

**In Cowork:** re-sync the marketplace (same Plugins screen), update the plugin when it shows one, then **restart your session** — a running session keeps the old skill bodies loaded until you start fresh.

**In Claude Code:**

```text
/plugin marketplace update storystormer-plugin
```

then start a new session.

Updates never touch your story files. The plugin is skills and reference docs; your story project is plain markdown that you own, and it stays put across any number of plugin updates (or a full uninstall).

---

## Troubleshooting

| Symptom | What's going on | Fix |
|---|---|---|
| **"Marketplace sync failed"** in Cowork | Cowork's cloud sync can only read **public** repos, or the repo name was mistyped | Check the spelling (`bobbylanefilms/storystormer-plugin`); if you're hosting your own copy, make the repo public |
| **“Connect the Dropbox (or Notion) connector”** when you open a project | The project lives in that service, and this session can’t reach it | Connect the connector named, then start a new session |
| **“No projects found”** in a session with no folder open | StoryStormer searched Dropbox and Notion (whichever are connected) and found nothing there; a story in a local folder can’t be searched for unless it sits in Dropbox’s `StoryStormer/` folder | Open the story’s folder, or connect the connector where the story lives and start a new session. See [Choosing where your story lives](#choosing-where-your-story-lives) |
| **The same story is listed twice** | `/storystormer:migrate` copied it to a new home and left the original where it was (it never deletes) | Pick the copy you moved to. Once you’re happy with it, delete the original by hand and the list shows one |
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
