<!-- ABOUTME: User-facing README for the StoryStormer Cowork plugin POC -->
<!-- ABOUTME: Explains what the plugin is, how to install it, and what to expect -->

# StoryStormer (Cowork plugin · POC)

A conversational story development workspace inside Claude Cowork (or Claude Code). Drop into any folder — empty, a one-line concept, a brain dump, a half-finished treatment, a tangled mid-project mess — and Claude triages what's there, proposes a plan, and develops the story with you.

This is a proof of concept that ports the **brainstorm → canon → treatment → outline** kernel of [StoryStormer](https://storystormer.io)'s web app into the plugin format. It runs locally against markdown files, leans on the model for judgment (with future models making it better), and asks before it acts. Supports both **standalone novels** and **multi-book series** (trilogies, longer series).

## What it gives you

Eight skills that load via progressive disclosure when your intent matches:

| Skill | Loads when you… |
|---|---|
| `storystormer-init` | start a new story, drop materials into a folder, or want to "set up StoryStormer here" |
| `brainstorm-session` | want to talk through the story, develop characters/themes/structure, work open questions |
| `decision-capture` | settle something the story now treats as true — captured to the decision log |
| `character-bio` | create or expand a character bio (auto-tiered: major / supporting / minor) |
| `treatment-update` | regenerate the primer and treatment after a stretch of brainstorming |
| `manifest-sync` | refresh the inventory of characters and worldbuilding elements |
| `pre-outline-session` | commit the story to a chapter structure — pick the framework, lock the act breaks, build the chapter spine |
| `outline-chapters` | generate or revise per-chapter outlines against the spine — batch a whole act or rewrite one chapter |

Plus seven slash commands for direct control: `/storystormer:init`, `/storystormer:status`, `/storystormer:checkpoint`, `/storystormer:decisions`, `/storystormer:questions`, `/storystormer:outline`, and `/storystormer:switch` (series mode only).

## The shape of a project on disk

A fully-developed project's folder looks like this (files appear as the corresponding skill runs — `outline/` doesn't exist until `pre-outline-session`, `characters/<slug>.md` files appear as you build bios, etc.):

```
my-story/
├── state.md                     # living dashboard — what exists, what's next
├── primer.md                    # story craft dossier (6 sections, ~4,500–5,500w)
├── treatment.md                 # full prose treatment of the story
├── manifest.md                  # lean inventory of characters & worldbuilding
├── decisions.md                 # append-only decision log
├── questions.md                 # open questions triaged by priority
├── characters/
│   ├── _index.md                # mirror of the manifest's character list
│   └── alice.md, bob.md, …      # per-character bios (tiered)
├── worldbuilding/
│   ├── locations/, organizations/, objects/, …
├── outline/                     # book-level spine (the cross-chapter plan)
│   ├── structure.md             # framework, act table, chapter spine (the contract)
│   └── _index.md                # outline view: chapter × stage status matrix
├── chapters/                    # one folder per chapter, holding all its artifacts
│   ├── chapter-01/
│   │   ├── ch01-outline.md      # per-chapter beat sheet (~600–1,000w)
│   │   ├── ch01-prose.md        # prose (and blueprint/notes) land post-POC
│   │   └── .history/            # co-located version snapshots
│   └── chapter-02/ …
├── research/
│   └── 2026-05-11-genre-conventions.md
└── .storystormer/
    ├── config.json              # project metadata (genre, current_focus, surfacing_mode)
    ├── genre-reference.md       # synthesized genre research (obligatory scenes, tropes, pitfalls)
    └── history/                 # paired snapshots before any treatment/manifest rewrite
```

All markdown. All human-editable. The agent reads and writes; you can edit any of it by hand at any time.

## Series mode (multi-book projects)

For trilogies and longer series, the plugin supports a **series workspace** with shared canon (characters, worldbuilding) at root and per-book stories inside `books/<slug>/`. The series structure looks like:

```
my-series/
├── state.md                     # Series-level dashboard
├── series.md                    # Arc-level document — cross-book setups/payoffs, series theme
├── manifest.md                  # Shared cast + worldbuilding inventory (all books)
├── decisions.md                 # All decisions, each scoped: series | book-<slug>
├── questions.md                 # Same — scoped per entry
├── characters/                  # Shared bios; one per character across the whole series
│   └── maya.md, senator-vance.md, …
├── worldbuilding/               # Shared worldbuilding
├── research/                    # Shared research
├── books/
│   ├── book-1/
│   │   ├── state.md             # Per-book dashboard
│   │   ├── primer.md
│   │   ├── treatment.md
│   │   ├── outline/
│   │   └── chapters/            # Prose chapters for book 1 (reserved)
│   ├── book-2/
│   └── book-3/
└── .storystormer/
    └── config.json              # project_type: series, books: [...], current_focus: book-1
```

The eight skills work the same way in series mode — they just resolve per-book file paths through `books/<current_focus>/` instead of the workspace root. Series mode adds:

- **Shared character bios** with per-book sub-arcs (Maya grows across all three books; one bio captures the full arc).
- **A `series.md` arc document** that tracks cross-book setups and payoffs (the locket planted in book 1 ch 2 pays off in book 3 ch 14).
- **Scoping** on decisions and questions (`scope: series | book-<slug>`).
- **`/storystormer:switch book-2`** to change current focus between books.

To start a series, run `/storystormer:init` and answer "series" when asked about project type. The init skill scaffolds the multi-book folder structure and asks how many books and their working titles. To convert an existing standalone novel into a series, ask the agent — init has a convert-to-series mode that moves existing files into `books/book-1/` and scaffolds the series-level structure.

See [references/series.md](references/series.md) for the full series doctrine — folder structure, what's shared vs per-book, path resolution, scoping rules, and bio handling.

## Install

This folder is **both a plugin and a one-entry marketplace** — `.claude-plugin/` holds the plugin manifest (`plugin.json`) and the marketplace catalog (`marketplace.json`) side by side, and the catalog's single plugin points at the repo root (`"source": "."`). The same bundle installs in Claude Cowork (desktop) and Claude Code; only the install entry point differs.

### Claude Cowork (desktop app)

Cowork installs plugins from a **git-hosted marketplace**, so push this folder to its own GitHub repo first (it can't be a subfolder of another repo — the marketplace root must be the repo root).

```text
/plugin marketplace add <your-github-user>/storystormer-plugin
/plugin install storystormer@storystormer-marketplace
```

Then give Cowork access to the folder your story lives in: open **Settings → connect a folder** (Cowork's "folder connection") and point it at your story directory. That's how the skills read and write your `.md` files — no filesystem MCP server required. The plugin's skills use the standard file tools, so they work the moment the folder is connected.

> Org-wide distribution instead of personal install? An admin can publish the same marketplace under **Organization settings → Plugins**.

### Claude Code (CLI / IDE)

No GitHub round-trip needed — add the marketplace straight from the local path:

```text
/plugin marketplace add ./plan/_cowork/storystormer-plugin
/plugin install storystormer@storystormer-marketplace
```

In both surfaces, plugin skills are namespaced (`/storystormer:init`, `/storystormer:status`, …) and the eight workflow skills load automatically via progressive disclosure when your intent matches their descriptions.

## Use it

1. `cd` into a folder where your story will live. (It can be empty, or already contain a brain dump, a draft treatment, anything.)
2. Run `/storystormer:init`.
3. The agent reads what's there, asks a few questions to get its bearings, **proposes a plan** for how to proceed, and waits for your "go." 
4. From there, just talk. Say things like *"let's develop a character for the second act,"* *"update the treatment,"* *"what open questions matter most right now?"* — the right skill loads and proposes its own plan before doing anything.

## Conversational, plan-first

Every skill follows the same pattern:

1. **Load context** — read whatever files matter for what you're asking.
2. **Propose a plan** — what it intends to do, what it will produce, what it needs from you.
3. **Wait for your go** — adjust based on feedback before executing.
4. **Execute** — do the work, write the files, snapshot what it overwrote.
5. **Report** — short summary of what changed and what's worth doing next.

You can interrupt at any step. The plan is always negotiable.

## What this POC does not do

By design, the v0.3 POC stops at brainstorm + canon + treatment + outline (across single or multi-book projects). The following are **not** included:

- Prose generation or refinement passes
- Image generation
- Canon states (point-in-time bio snapshots — across-book character evolution is handled lightly via per-book sub-arc sections)
- Git integration / auto-commit

These may follow in later versions once the kernel proves out.

### What v0.5.0 added over v0.4.0

- **Chapter content is now organized entity-first.** Each chapter gets its own folder (`chapters/chapter-NN/`) holding *all* of its artifacts — outline, and (post-POC) blueprint, prose, and refinement notes — with chapter-number-prefixed filenames (`ch17-outline.md`) so files stay identifiable when viewed flat or referenced via `@`. This replaces the split where outlines lived type-first in `outline/` and prose lived in a flat `chapters/`. Per-chapter outlines moved from `outline/chapter-NN.md` to `chapters/chapter-NN/ch<NN>-outline.md`; intake-stashed prose moved from `chapters/chapter-NN.md` to `chapters/chapter-NN/ch<NN>-prose.md`. Sets the contract for the upcoming blueprint → prose → refinement pipeline.
- **`outline/` is now the book-level spine only** — `structure.md` plus `_index.md`, which became a **chapter × stage status matrix** (the "outline view"): one row per chapter, a column per pipeline stage. The horizontal scan outlining relies on is preserved here while content lives chapter-first.
- **Per-chapter history is co-located.** Chapter artifacts snapshot to `chapters/chapter-NN/.history/` as flat version+date-named files (`ch17-outline-v1-2026-06-18.md`); the central `.storystormer/history/` keeps the book-level docs (primer/treatment/manifest/structure/series).

### What v0.4.0 added over v0.3.1

- **Cowork-importable packaging.** Added `.claude-plugin/marketplace.json` so the folder is a self-contained single-plugin marketplace (`"source": "."`) — installable in the Claude desktop app's Cowork surface, not just Claude Code. Same bundle, both surfaces. See the rewritten **Install** section above.
- **Portability hardening for the Cowork cache.** On install, the plugin directory is copied to a cache, so anything that reaches outside the folder breaks. Removed the one offending link (`manifest-sync` pointed four levels up at the web app's `CLAUDE.md`; the terminology note is now inlined).
- **Shell-free file operations.** Cowork's file primitive is the folder connection, not a guaranteed `Bash` tool. `/storystormer:checkpoint` now copies via `Read` + `Write` instead of assuming a shell, and `Bash` was dropped from the `status`, `outline`, `init`, and `checkpoint` allow-lists (none of their bodies needed it). Skills are unchanged — they already used the standard file tools.

### What v0.3.1 added over v0.3.0

- **Subagent dispatch pattern** in `references/subagent-pattern.md` — codifies the architecture for keeping the main session's context lean during heavy-read operations. Read subagents absorb source material and return structured summaries with quoted excerpts; execution subagents perform parallel file operations and report completion. Main session does the judgment.
- **`storystormer-init`** updated to dispatch survey subagents (Step 1) per top-level folder and execution subagents (Step 5) per migration category (bios, worldbuilding, decisions/questions extraction, history snapshot, prose stash). Resolves the context-pressure problem that made init incompatible with Cowork's 200K window on large intakes.
- **`treatment-update`, `manifest-sync`, `character-bio`** gained Subagent Dispatch subsections, applying the pattern to their heavy-read paths — especially in series mode where cross-book treatment reads multiply context cost.
- **First-test feedback driven** — the v0.3.0 intake of the Inauguration Day trilogy consumed 45% of Opus 4.7 1M; the subagent pattern targets that bottleneck so the plugin can run in Cowork's 200K window.

### What v0.3 added over v0.2

- **Series support** — `project_type: series` enables multi-book workspaces with shared canon (characters, worldbuilding) at root and per-book stories in `books/<slug>/`.
- **`series.md` arc document** — the cross-book overview, with Series Arc, Per-Book Synopses, and a Cross-Book Setups and Payoffs table.
- **Scoped decisions and questions** — `scope: series | book-<slug>` field on entries in series mode; book-aware `Integrated into` tracking.
- **Shared character bios with per-book sub-arcs** — one bio per character, with Per-Book Sub-Arcs sections capturing within-character evolution across books.
- **`/storystormer:switch <book-slug>`** — change focus between books in a series.
- **Zoom Selection doctrine** in `references/reading-discipline.md` — codifies "load the densest file that answers your question" as an explicit reading rule.
- **All eight skills** updated with a Series Mode subsection that delegates path resolution and scoping to `references/series.md`.
- **`storystormer-init`** gains a convert-to-series intake mode for migrating existing standalone projects.
- **Prose chapter stashing at intake** — init detects pre-existing prose in the user's folder, normalizes filenames to `chapter-NN.md`, and stashes into `chapters/` (or `books/<slug>/chapters/` in series mode). Prose-writing functionality is not yet built; the stash is a reserved location until those skills land.

### What v0.2 added over v0.1

- `pre-outline-session` skill — chat-driven structural conversation that produces `outline/structure.md` (framework choice, act table, numbered chapter spine).
- `outline-chapters` skill — generates or revises per-chapter outlines in batch (whole-act) or single-chapter modes; never invents the spine.
- `outline/` folder structure with three file types: `structure.md`, `_index.md`, and per-chapter `chapter-NN.md` files.
- `/storystormer:outline` slash command — read-only outline status.
- Two new `state.md` stage values: `outlining` (in progress) and `outline-drafted` (all chapters covered with zero unresolved markers).

## Status

POC — parallel offering to the [StoryStormer web app](https://storystormer.io). The two are not synchronized; they're independent experiments in the same workflow. The plugin runs against local markdown; the web app runs against Convex. Both share the brainstorm → canon → treatment philosophy and the framework vocabulary.

For design rationale, read the per-skill `SKILL.md` files and the docs in `references/` — each skill cites the references it leans on. (The full design history lives in the StoryStormer web-app repo's `plan/_cowork/` notes.)
