---
name: storystormer-init
description: Scaffold a StoryStormer story workspace in the open folder, or in Dropbox, Notion or the StoryStormer app when the author chooses one; or pick up a project the StoryStormer app hands off (a pasted prompt such as "Continue my StoryStormer project … (project id …)", in any wording). Use when the user starts a new story project, drops materials into a folder and wants to set up a structured workspace, or says things like "set up StoryStormer here," "start a new novel," "I have a brain dump / partial treatment / mess of materials — help me organize," or "init this project." Handles any starting state — empty folder, single logline, freeform brain dump, half-finished treatment, or a tangled mid-project mess with some characters bios written and the third act undefined.
---

# StoryStormer · Init

You are setting up a StoryStormer story workspace from the user's open folder, or from the conversation when there is none. This may be the first thing the user has done in this folder, or they may already have materials in flight. Your job is to triage what's there, figure out where the project actually is, ask where it should live, propose a plan for how to proceed, and then build out the canonical file structure once they say go.

This is the marquee skill of the plugin. **The user can drop in with anything — empty folder, one-line concept, freeform notes, a near-complete treatment, or a messy mid-project state — and you reorganize it into the canonical structure.** Lean on the model's reasoning here. Triage is a judgment task; trust yourself.

Always follow `references/plan-first.md` — load context, propose a plan in plain language, wait for the user's go before executing.

## What you produce

When the user gives you the go-ahead, you create or update:

- `state.md` — the slim dashboard (`references/file-schemas.md` § `state.md`): its four sections, and the frontmatter that owns every field the author sees: `title`, `slug` (the author’s choice when they name one, else the kebab-case of the title; kebab case, `[a-z0-9-]` only; set now and never changed), `project_type`, `target_word_count`, `genre`, `logline`, `stage`, `initial_maturity`, `created`, `last_session`, `session_count` (the journal entry's number: `1` for a brand-new project), `surfacing_mode`
- `.storystormer/config.json` — exactly two keys, `layout: 2` and `storage` (`references/file-schemas.md` § `.storystormer/config.json`): a new project gets the store the author chose (§ Where a new project lives), `"storage": { "kind": "local" }` for the open folder; an existing project keeps the `storage` block it has. Nothing in it mirrors `state.md`. Where the binding computes the config (the StoryStormer app), init writes none
- `.storystormer/` — supporting subfolders, each created with its first file (no empty folders)
- `decisions/_index.md` and `questions/_index.md` — always for a new project (a re-run keeps the ones it has), with their heading and table header and no rows (`references/file-schemas.md` § `decisions/_index.md`, § `questions/_index.md`), so every layout-2 project has them; where the binding computes them, they are skipped
- Decision and question entries — `decisions/D-###.md` and `questions/Q-###.md`, one per item the author approved from the intake, each created with `new` and given its index row
- `journal/<date>-s<NN>.md` — the session's journal entry: what init found, how it triaged, what it created and extracted, and why. Its number follows `references/file-schemas.md` § `journal/` (one more than the higher of `session_count` and the highest `sNN` listed), which gives `s01` only for a brand-new project; a re-run continues the existing count
- `treatment.md` — only when the user brings in an existing treatment-like document and explicitly agrees to a copy-and-clean-up step. **Never generate a new treatment at init.**
- `primer.md` — **never at init.** The primer is a five-section structured craft dossier (~4,500w, hard ceiling 5,000) that's always built by `treatment-update`'s Phase 1 (first-run mode handles construction from intake materials). Init leaves `primer.md` absent so the first `treatment-update` run populates it.
- `manifest.md` — only if there's enough character/world content to seed it
- Per-character bios and `characters/_index.md` — only for characters the intake already has bio material for, migrated rather than generated; a character the intake only names goes in the manifest
- The `worldbuilding/` subfolders as appropriate
- **`voice/README.md`** — always, at every init. The `voice/` folder holds the two author-owned voice inputs the prose stage reads first (`writing-sample.md`, the author's own non-AI prose; `style-guide.md`, the author's craft rules), and a project can otherwise have no voice inputs and nothing warns about it. The README is the warning and the instructions; see § Voice scaffolding. **No stub `style-guide.md` or `writing-sample.md`**: downstream skills key on those files' *existence* (`blueprint` drops general craft when a style guide exists; `prose` skips the craft rulebook), so an empty stub would silently disable behaviour the author hasn't replaced. If intake materials include something that is clearly a style guide or a writing sample, place it (see § Voice scaffolding).
- `outline/` and its files — **never at init.** The outline directory (the book-level spine: `structure.md` + the `_index.md` outline view) is created lazily by `pre-outline-session`, and the per-chapter outlines (`chapters/chapter-NN/ch<NN>-outline.md`) by `outline-chapters`, when the project is ready for outlining (typically `treatment-refined` or `canon-development` stage). If the user brings in pre-existing outline-shaped materials (chapter outlines, beat sheets, scene lists), note them in the intake survey but **do not migrate them into `outline/` here** — flag them and recommend `pre-outline-session` as the next step, which knows how to integrate them.
- `chapters/` — **created at init only when prose chapters are detected in the user's intake materials.** Init stashes incoming prose into per-chapter folders with canonical naming (`chapters/chapter-NN/ch<NN>-prose.md`); see § Prose Chapter Stashing below. If no prose is brought in, leave `chapters/` absent — it appears later when prose-writing functionality is added (post-POC) or when a future intake brings prose.

Don't pre-create empty files. Only create files that have meaningful content. Empty placeholders create the illusion of progress that isn't there.

## Where a new project lives

The author chooses, once, at init. This is the one place a store is chosen rather than resolved (`references/store.md` § Resolve, step 2).

**The question.** After triage (§ 2), alongside the § 3 questions and before the § 4 plan, ask *“Where should this story live?”* Offer only what this session can reach:

- **This folder**, when there is an open folder (the local binding). When the folder syncs (below), label it as also the laptop half of a sync: *“this folder (it syncs through Dropbox, so it’s on your other devices too)”*.
- **Each other backend in `store.md` § Bindings that is not pending and whose binding’s tool check passes** (§ Resolve, step 3), described in the author’s terms: today Dropbox (a folder at `/StoryStormer/<slug>/` in their Dropbox), Notion (a row in a `StoryStormer` hub in their workspace) and the StoryStormer app (*“in the StoryStormer app, where you can also work on it in the browser”*), the app offered only when its binding’s `create_project` realization is present too (`references/store/storystormer.md` § Tools). A pending binding is never offered; once it is verified, this rule adds it.

**Defaults:** this folder when there is one (Claude Code always has one); with no open folder, Notion when it is offered, and the StoryStormer app when it is the only connector offered; otherwise ask with no default. With only one option, don’t ask; the plan says where the story will live. With none (no folder and no connector), stop and tell the author to open a folder or connect Dropbox, Notion or StoryStormer.

**Re-running init on an existing project** never asks: the project keeps the store it has (a config with no `storage` block is local). Moving it is `/storystormer:migrate`. **A project in the old layout** (its config has no `layout`, `references/file-schemas.md` § The old layout) stops init before it writes anything: say the project is in the old layout and offer `migrate`’s in-place upgrade (`references/store.md` § Resolve, step 4). Init never stamps `layout: 2` over old logs.

**Sync folders.** Check the open folder’s absolute path: a segment that is or begins with `Dropbox`, `Google Drive`, `GoogleDrive` or `OneDrive` (`~/Dropbox/`, `~/Dropbox (Personal)/`, `OneDrive-Personal`), or anything under `/Library/CloudStorage/`, where macOS keeps all of them (`~/Library/CloudStorage/Dropbox/`; the segment after it names the service). It is a path check, nothing more. Choosing a syncing folder still yields `kind: local`, plus the **Storage** line in `state.md` → What Exists naming the service (`references/file-schemas.md` § `state.md`). When the service is Dropbox and Dropbox is among the offered backends, the report adds that `/storystormer:migrate dropbox` would make it a true hybrid, reachable from sessions with no folder. Google Drive and OneDrive stay local: they work as synced folders, and no binding reaches them otherwise.

**Scaffolding the chosen store.** Load its binding from § Bindings and say in the plan where the story will live. Intake materials are still read, and cleared after they are re-filed, through the local binding that holds them; everything init creates goes through the chosen binding, and documents that binding computes are written through its realizations or skipped (`store.md` § Local-mode clauses). The backend’s own setup is its binding’s § Scaffolding a project:

- **Dropbox:** the same tree, rooted at `/StoryStormer/<slug>/`, with the stored config’s `storage` = `{"kind": "dropbox", "root": "/StoryStormer/<slug>"}`. The binding’s steps check the slug (a folder there that already holds a project stops init with a question) and create the folders. `local_root` is added only when the open folder **is** the synced copy of that root: exactly `<Dropbox sync root>/StoryStormer/<slug>`, where the sync root is the Dropbox folder itself (`~/Dropbox`, `~/Library/CloudStorage/Dropbox`), so `~/Dropbox/Archive/StoryStormer/<slug>` doesn’t qualify; or the author names the synced path and it exists here (ask; don’t guess). In that case init writes through the local binding rooted there (`store.md` § Resolve), and that folder holds the full config.
- **Notion:** the binding’s steps (hub, tables for a new hub, the Projects row, the pointer), then the rest of init through the contract; its step 5 governs intake.
- **The StoryStormer app:** the binding’s `create_project` realization makes the project, from the § 3 answers: the title, the project type, the genre, the target length, and in a series the books’ titles in order, with a request id per the binding’s § Request ids, so a retry never makes a second project. Its result gives the project id, which is the root (the binding’s § Root), and the project’s open link, which the report gives. Before the plan, the binding’s § Locate lists the account’s projects; one with the same title is named in the plan, so the author doesn’t start a second copy by accident. There is no folder to create and no slug to check (the id is the address); the slug, the logline, the stage and the rest of the frontmatter go into `state.md`. The binding computes the config (with `layout: 2` from the create), both entry indexes, `characters/_index.md` and `voice/README.md`, so init writes none of them; it keeps no snapshots, so the intake archive is `.storystormer/intake/<timestamp>/`; and it stores text only, so a binary original stays in the open folder (§ Prose Chapter Stashing, step 5). `state.md` is the last write, prepared from a read taken after every other write, with its computed keys (`session_count`, `last_session`, What Exists’ counted lines) as that read shows them (the binding’s § Quirks).
- **The pointer:** for a connector backend with an open folder that is not its synced copy, write `.storystormer/config.json` there through the local binding as exactly `{"storage": {"kind": …, "root": …}}` and nothing else (for the app, `{"storage": {"kind": "storystormer", "root": "<project id>"}}`), so the next session’s resolution finds the project (`store.md` § Resolve, step 1). Init never puts `local_root` in a pointer: resolution binds the local binding wherever `local_root` exists, so it may name only the synced copy of the block’s own Dropbox root, which a pointer has only after `/storystormer:migrate` moves a synced folder there (`store.md` § Resolve). The full config lives in the store. With no open folder there is no pointer, and the report gives the way back.
- **The intake archive** is where init files what it keeps of the intake: this run’s `init` snapshot folder where the binding’s `history` is `snapshots`, else `.storystormer/intake/<timestamp>/` (the snapshot-folder timestamp, so a re-run never overwrites an earlier record). It holds `superseded-prose/<original filename>`, `intake-original-names.md`, and, when the store is not the folder the intake came from, `sources/<original filename>` for each text source init read but didn’t re-file (a brain dump, a deferred legacy outline), so a session that reaches only the store still has the originals.
- **Markup.** Markdown init produces itself (a document built from intake, a `.docx` source’s text carried into one, a brain dump turned into decisions and questions) is plugin text, in profile form on every backend (`references/file-schemas.md`). Author files it stashes verbatim (prose, a placed writing sample or style guide, the archive’s originals) keep the author’s text and markup exactly on a folder or Dropbox, with only init’s documented frontmatter (§ Prose Chapter Stashing, step 4) and a final newline added; a binding that normalizes author markup on the way in rewrites their markup, never their words, in flight, and the report carries its one line.
- **A normalizing binding:** when the chosen binding says it normalizes author markup on write, keep the local intake originals (never `store.delete` them) and say so in the report.

## Picking up a project from the app

The StoryStormer app’s “Continue in Claude” hands the author a prompt to paste into a session. Its wording varies and will change; what matters is that it names a **StoryStormer project id** (it usually reads something like *“Continue my StoryStormer project The Good Dog (project id …). Last session … What’s Next …”*). Any message that names a project id the StoryStormer connector accepts is a handoff, whatever else it says, and this is not a new project: nothing is scaffolded and no plan is needed, since the session only reads.

- **Bind it directly.** Resolve with the StoryStormer binding rooted at that id, **without running the locator** (`references/store.md` § Resolve, steps 3 and 4 still run: the tool check, then the layout). The session’s first read, `state.md`, is the check that the id is real: an id the connector refuses (unknown, or another account’s) is said plainly, with the offer to list the author’s projects instead. A connector that isn’t connected is named, with how to connect it, and the session stops there. When the title in the prompt differs from the project’s, say so and go by the id.
- **An open folder** doesn’t change the binding: the handoff names the project, so this session works there even when the folder’s config points elsewhere, and that config is left alone. Write a pointer (§ Where a new project lives, the pointer) only when the folder holds no config and the author says they want this folder to reach the project next time; offer it once, in a line.
- **Open where they left off.** The first reply names the bound backend, the project and the capabilities line (`store.md` § Resolve, after binding), then gives the last session’s summary and What’s Next as `state.md` holds them (an unfinished batch among them is offered, finish or leave, per `store.md` § Operations, Batches) and the gist of the newest journal entry (the highest session listed under `journal/`), then asks what the author wants to do. Treat the prompt’s own summary as a hint; the store is the record.

## What to do

### 1. Survey the folder

**Dispatch survey subagents** for non-trivial folders per the doctrine in `references/subagent-pattern.md`. Each subagent walks one top-level folder, operates in substantive mode against its assigned scope, and returns a structured summary with quoted excerpts. The main session aggregates the per-folder reports.

**Dispatch threshold.** Subagent the survey when:

- The folder contains more than 3 top-level subfolders or 8+ files of substantial size, OR
- Any single file is large (≥ 5,000 words — a legacy treatment, long brain dump), OR
- The aggregate read would otherwise consume ~50,000+ words of main session context.

For empty folders, one-line concepts, or a single small brain dump, read directly in the main session — subagent overhead exceeds the benefit at trivial scale.

**Parallel dispatch.** When dispatching multiple subagents (one per top-level folder, typically), send them in a single message with multiple Agent tool calls. The subagents run concurrently; the main session waits for all returns and aggregates.

**What each survey subagent returns.** Per the subagent-pattern brief schema: a structured per-file summary including `type_inference`, `content_shape`, `word_count_approx`, 3–5 `quoted_excerpts`, `anomalies_or_concerns`, and `suggested_canonical_destination`. Plus cross-file observations the subagent noticed across its scope.

**Verify the returns include quotes.** A subagent return without verbatim quoted passages is not a substantive-mode read. Reject and re-dispatch with a stricter brief. Silent acceptance of quote-free returns reintroduces the confabulation risk substantive mode was designed to prevent.

For trivial folders that read directly in main session: lean on the model — don't grep, don't sample. For each file you find, identify what it likely is: a brain dump, a draft treatment, character notes, research, a partial outline, prose drafts, something else.

Whether dispatched or main-session-read, **be explicit with the user about what you found**. *"I see a 3-page document called `notes.md` that reads like a brain dump for a literary thriller, plus a file `marlowe.md` that looks like a sketch of a protagonist."* The user gets the aggregated picture, not the subagent mechanics — the dispatch happens invisibly.

### 2. Triage to a stage

Based on what's there, pick one of the following stages for `state.md`:

- **`concept`** — nothing of substance, or 1–2 sentences of idea only.
- **`brain-dump`** — unstructured fragments (scenes, characters, ideas) without a consolidated narrative.
- **`brainstorming`** — partial treatment or consolidated document with meaningful gaps.
- **`treatment-drafted`** — comprehensive treatment with minor gaps or polish issues.
- **`treatment-refined`** — comprehensive, mostly-polished treatment ready for refinement work.
- **`canon-development`** — treatment is solid and the user is now building out characters and worldbuilding.
- **`outlining`** / **`outline-drafted`** — *rare at intake.* Only if the user has brought in pre-existing chapter outlines, beat sheets, or a partial chapter plan alongside the upstream materials. If you see this, set `stage` to `outlining` (or `outline-drafted` if all chapters are sketched) but set `initial_maturity` to the upstream stage (typically `treatment-refined`) since the schema reserves `initial_maturity` for pre-outline maturity levels.

Set `initial_maturity` to the same value as `stage` **except for the two outline stages above**, which require the explanation just given. `initial_maturity` is immutable once written, so this is your one chance to record where the project started.

### 3. Talk to the user

Before doing anything else, ask 2–4 questions to fill in what the materials don't tell you:

- **Working title** — confirm or ask.
- **Slug** — the project’s stable short name (§ What you produce, `state.md`), shown in the plan as a default the author may change: the kebab-case of the title (`the-keepers-log`). On Dropbox and Notion it is also the project’s folder (`/StoryStormer/<slug>/`) or its row’s `Slug`, so it is fixed before anything is written there; in the StoryStormer app it is `state.md`’s alone, set by its one write. No need to ask about it separately; the plan shows it.
- **Project type** — novel / novella / short story / screenplay / **series**, written as `novel`, `novella`, `short_story`, `screenplay`, `series` (series triggers the multi-book folder structure in `references/series.md`).
- **Target length** — the book's target word count (for a series, a default for every book, written to the root `state.md`, plus any book that differs, written to that book's `books/<slug>/state.md`). If the author has no number, use the type's default from `references/file-schemas.md` § Target word count and the derived budgets (120,000 for a novel) and say so; it becomes `target_word_count`, which every word budget is computed from.
- **Genre** — confirm or ask. If hybrid, capture both.
- **The user's intent for this session** — *"what would you like to focus on first?"* lets them redirect from your default plan.
- **Where the story lives** — a new project only, and only when there is a choice (§ Where a new project lives).

For a mid-project mess (decisions made elsewhere, partial files), also ask:
- **Sources of truth** — *"if the brain dump and the treatment disagree on Marlowe's backstory, which should I trust?"*
- **Carryover decisions** — *"are there decisions you've made that aren't in any of these files yet? Tell me, and I'll log them."*

If the project is a **series**, ask additional intake questions:
- **How many books** — confirm the planned count (typical: trilogy = 3; longer series may be open-ended).
- **Book slugs and titles** — `book-1`, `book-2`, `book-3` are the conventional slugs; titles can be working titles or TBD. Slugs are stable (used in file paths); titles can change.
- **Which book is the current focus** — the user names which book they're actively working on; that becomes `current_focus` in the root `state.md`.
- **Shared-vs-per-book intake materials** — if the user brought in materials, ask which apply to which book (or to the series as a whole). Brain dumps and decisions get sorted into their right scope.

### 4. Propose a plan, in plain language

Tell the user what you're going to do based on the stage and what you found, and where the story will live: this folder, `/StoryStormer/<slug>/` in Dropbox, the Notion hub, or a new project in the StoryStormer app, plus the pointer config a connector backend leaves in the open folder. The plan names the slug (`Slug: the-keepers-log, from the title; say if you want another`), and the author's change, validated as kebab case, is the one used. Examples:

> **Stage: `brain-dump`.** Here's what I'm planning:
>
> - Set up `state.md`, the `decisions/` and `questions/` folders, the session journal, and the `.storystormer/` folder.
> - Extract about 8–10 decisions from your `notes.md` (things like "protagonist is a forensic accountant" and "set in the present day") and record each as a decision — I'll show you the list for confirmation before locking it in.
> - Extract the implicit open questions (the things you wrote as "???" or "maybe X or Y") as triaged questions with priorities.
> - Skip generating a primer or treatment for now — we don't have enough decided yet. We'll work through the questions in priority order and build the primer once the shape is clearer.
> - Synthesize a genre reference for literary thrillers on the side, so I can surface obligatory scenes and pitfalls as we go.
>
> Sound right?

> **Stage: `treatment-drafted`.** What I'm seeing: the treatment is in good shape for Acts 1 and 2 but Act 3 is mostly bullet sketches; you've named four characters but only one has a bio. My plan:
>
> - Set up `state.md` showing where things are (treatment v1 imported, 1 bio exists, manifest needs seeding).
> - Read the treatment carefully and extract ~15 decisions so they're first-class records.
> - Surface 5–8 open questions from the Act 3 gaps as triaged question entries.
> - Seed `manifest.md` from the characters and locations the treatment names — lean inventory entries, no bios yet.
> - **Not** regenerate the primer or treatment in this init pass — the treatment is solid; we'll refine it once Act 3 is decided.
>
> Anything you want to adjust before I start?

### 5. Execute once the user agrees

For non-trivial migrations (more than a handful of files to move, write, or stamp), **dispatch execution subagents in parallel** per the doctrine in `references/subagent-pattern.md`. One subagent per category, all dispatched in a single message so they run concurrently:

- **Bios migration subagent** — reads each bio in the intake scope, normalizes to the canonical character bio schema (`references/file-schemas.md` § Character bio files), writes to `characters/<slug>.md`, stamps frontmatter (name, `type` from the project's People types, version: 1, last_updated; an old `tier:` becomes the matching `type`). Returns completion log per file.
- **Worldbuilding migration subagent** — assigns each file a worldbuilding type (the fourteen defaults in `references/frameworks.md` § Worldbuilding), writes to `worldbuilding/<type-slug>/<slug>.md` (the type's kebab-case slug: `locations/`, `magic/`), stamps frontmatter (`category` = the type name verbatim). When the workspace already has a `worldbuilding/` folder (re-running init on an existing project), it applies the old-folder rule in `references/file-schemas.md` § Worldbuilding files: it finds existing entries under any folder, old plural forms included, and proposes moving them to the new folders rather than writing duplicates. Returns completion log per file.
- **Decisions extraction subagent** — reads brain dumps and legacy decision-style files, produces *proposals* for decision entries (D-### IDs, topics, summaries, details, `source: intake`, scope in series mode). The subagent **does not write** — it returns proposed entries; the main session reviews them and decides what gets written. This is judgment work that stays in main.
- **Questions extraction subagent** — same pattern as decisions: returns proposed Q-### entries (each with a 3–7 word title, one of the seven categories, `source: ingestion`); main session reviews before writing any question entry.
- **History snapshot subagent** — snapshots superseded folders per `store.md` (where the binding’s `history` is `native` or `versions`, nothing is snapshotted and it writes only the intake archives and the mapping), writes the `intake-original-names.md` mapping table. Returns the snapshot inventory.
- **Prose chapter stash subagent** (if applicable, see § Prose Chapter Stashing) — moves detected prose into `chapters/` with canonical naming, preserves content verbatim, adds minimal frontmatter, returns the original-to-canonical mapping.

The main session aggregates the completion logs from each subagent for the final § Report step.

**First, before any subagent writes:** the config (`layout: 2`, `storage`), the two header-only indexes, and the session's journal entry (where the binding computes the config and the indexes, the journal entry alone), created with `new` (`journal/<date>-s01.md` for a brand-new project; on a re-run, the next number per `references/file-schemas.md` § `journal/`). The journal entry starts with what init found and how it triaged it, and each later step extends it.

**Sequential after aggregation.** After all parallel subagents complete, the main session does the writes that depend on aggregated state: the decision and question entries (only after the main session has reviewed and approved the proposed entries from the extraction subagents; each a `new` write, then its index row), `manifest.md` (depends on what bios and worldbuilding subagents migrated), `series.md` stub (in series mode), the journal entry extended with what was created and the IDs logged, and `state.md` last (the dashboard reflects everything the subagents did; Last Session is two or three sentences and the journal entry's path).

**Direct execution in main session** when the migration is trivial — a fresh empty folder with 2–3 files of intake material. The subagent dispatch overhead isn't worth it for tiny operations.

For decision and question extraction in either mode (subagent-dispatched or main-session-direct), lean on the model — it's a judgment task, not a regex match. The user reviews the proposed entries before they're written. Never auto-write decisions or questions from intake without user review; the user's voice in those entries matters.

The proposed IDs are provisional: the collections start empty at `D-001` and `Q-001`, and the store assigns each number when the entry is created with `new` and reports it (`references/store.md` § New entries). From then on that reported ID is the entry's ID. Adopt it before writing any marker or cross-reference (a question's `**Dependencies**`, a `resolved_by`, the journal, the report); the journal entry, created first, names the entries only once their numbers are reported (`references/file-schemas.md` § `journal/`, IDs as the store reported them).

### 6. Report

Short summary:

- **Where it lives:** the bound backend, its root, and the way back (the folder’s path, the Dropbox path, the Notion row’s link, or the app project’s link), plus the sync note or the `migrate dropbox` hint when § Where a new project lives calls for them.
- What you created.
- **Normalized on the way in**, where the binding normalizes author markup: its one line naming each document normalized and what changed (from the subagents’ returns), plus any construct with no in-profile form.
- What you extracted (N decisions, M questions).
- What you stashed — if prose chapters were detected and moved into `chapters/`, list the chapter numbers stashed and any rename/format flags (see § Prose Chapter Stashing).
- **Voice inputs**: what `voice/` holds after init, and the explicit warning when it is README-only (see § Voice scaffolding).
- What you deliberately did *not* create — always including `primer.md` (that's `treatment-update`'s job). Name the absent files and the skill that produces them.
- The recommended next step. Typical recommendations by stage:
  - **`concept` / `brain-dump`**: `brainstorm-session` to work through the highest-priority question and accumulate more decisions before the first `treatment-update` run.
  - **`brainstorming` and above** (enough decided that primer construction is meaningful): `treatment-update` in first-run mode — it will scaffold the five-section primer from your extracted decisions, plus any treatment-like document the user brought in, and produce/refine `treatment.md`.
  - **`canon-development`**: `treatment-update` first (to crystallize the primer), then `character-bio` or `worldbuilding-entry` for the highest-priority gap. Once major bios are in place and the treatment is refined, `pre-outline-session` is the natural next step — it commits the project to a chapter structure.
  - **`outlining` / `outline-drafted`** (rare at intake — would only appear if the user brought in pre-existing outline materials): recommend `pre-outline-session` to map any imported outline materials into the canonical `outline/structure.md` shape, then `outline-chapters` to fill in or refine per-chapter outlines.

Update `state.md → What's Next` with the recommendation.

## Triage texture (lean on the model)

The hard cases are the messy mid-project intakes. A user might drop in with:

- Three brain dump files written months apart that contradict each other.
- A treatment that's clearly v2 in the user's head but the file on disk is v1.
- Five character sketches in mixed formats (some bullet lists, some prose).
- A "themes.md" that names abstractions ("loss", "redemption") but doesn't dramatize them.

Your job is to *read it all, form a coherent view of what the project is, and propose the canonical structure that makes sense of it.* This is exactly the kind of judgment work Sonnet and Opus excel at. You don't need a decision tree from this skill — you need to think.

Tell the user what you concluded and why. *"I'm reading `notes-v1.md` and `notes-v2.md` as superseded drafts of the same brain dump, with `notes-v2.md` as the current view. The names in v1 (Alex, Sara) appear to have been renamed in v2 (Marlowe, Alice). I'll treat v2 as canonical. Confirm?"*

When in doubt, ask. The user knows things about their project that the files don't say.

## Reading discipline

This skill reads everything in the folder, including potentially long brain dumps and treatments. **Full reads only.** Do not grep. The whole point of this skill is to *understand* what's there, and grep + confabulate is exactly the failure mode `references/reading-discipline.md` is designed to prevent.

If a treatment is genuinely too long to fit in your context window in one pass (>~30k words), say so explicitly to the user and propose a strategy — paginated full reads, or focused full reads of the sections most relevant to intake. Don't fall back to grep; don't fake having read it.

## Subagent Dispatch

Init is the most context-heavy skill in the plugin — it can encounter projects with dozens of bios, lengthy treatments, multiple brain dumps, and legacy folders all at once. Real-world intakes (e.g., a partially-drafted trilogy with shared canon) can consume 30–60% of a 1M context window on reads alone, which makes init **incompatible with Cowork's 200K window** when run directly in the main session.

The fix is to **dispatch reads and executions to subagents**, keeping the main session lean for the conversation, triage, and judgment work. Read `references/subagent-pattern.md` for the full doctrine; this skill applies it in two specific places:

- **Step 1 (Survey)** — survey subagents per top-level folder, all dispatched in parallel.
- **Step 5 (Execute)** — execution subagents per category (bios, worldbuilding, decisions extraction, questions extraction, history snapshot, prose stash), all dispatched in parallel.

**Steps 2, 3, 4 (Triage, Talk, Propose) stay in the main session.** Subagents provide the evidence; the main session decides what to do with it.

The dispatch decision is conditional on intake complexity. Trivial folders (empty, single brain dump, fewer than 4 files) read and execute directly in the main session — subagent overhead exceeds benefit at that scale. The thresholds and decision rule are in `references/subagent-pattern.md` § When to dispatch vs. when to read directly. Every brief carries the store block from `references/subagent-pattern.md` § Mandatory brief fields; on a store other than the open folder, intake briefs carry two, a source block (the local binding, for reading the intake) and a destination block (the chosen binding, for everything written). When the destination binding normalizes author markup on the way in, every brief that writes also carries `references/markdown-profile.md` § Rewrite table, § Kept as written and § No in-profile form, pasted as text since a subagent can’t open the bundle, and returns which documents it normalized and what changed in each.

**Required behavior in subagent returns:** every read subagent's return must include 3–5 verbatim quoted excerpts per file. This is the same anti-confabulation defense as substantive mode applied to the subagent layer. Returns without quotes get rejected and re-dispatched. Silent acceptance of quote-free returns defeats the entire reading-discipline architecture.

## Voice scaffolding

Every init writes `voice/README.md` (if absent) with exactly this content (it names no project, so it is the same in every project):

```markdown
# Voice inputs

The prose stage reads this folder **first**, before anything else, to write in your voice rather than the model's. Two files, both yours to write, both optional, both strongly recommended:

- **`writing-sample.md`** — a representative passage of your own, non-AI prose. The voice north star. It is the *only* voice anchor on a POV character's first chapter, where there is no prior prose to match. One passage is enough; `samples/*.md` works if you keep several.
- **`style-guide.md`** — your craft rules: sentence construction, register, dialogue habits, interiority, what you never write ("never 'a breath he didn't know he was holding'"). No fixed shape; bullets or prose. This is where **general** craft lives for the whole book. Chapter Blueprints carry only chapter-specific placements when this file exists; without it, every Blueprint has to transcribe craft rules as a per-chapter workaround, and the prose stage falls back to a generic genre rulebook.

Read order at prose time: writing sample → style guide → story so far → Blueprint → outline → your prior chapter in the same POV. Neither file is ever generated from AI prose.
```

Then detect voice material in the intake. A file that reads as the author's own finished prose and is not a chapter of this story (a short story, an excerpt from another book, a passage explicitly labelled as a sample) is a candidate `voice/writing-sample.md`; a file of craft rules or stylistic preferences is a candidate `voice/style-guide.md`. Propose the placement in the plan; never place silently, and never promote a chapter of *this* story to the sample (that is prose, stashed under `chapters/`).

**Report it.** If after init `voice/` holds only the README, the report says so in its own line: *No voice inputs yet. The prose stage will write in a generic register until `voice/writing-sample.md` exists; add one before the first chapter.* `state.md → What Exists` gets a `Voice` line (`README only` / `sample` / `sample + style guide`).

## Prose Chapter Stashing

If the user's intake materials include prose chapters — files that look like written prose for specific chapters of the novel — init detects them, stashes them in `chapters/`, and reports them in `state.md → What Exists`. Prose-writing functionality is not yet built; init's job is purely to **find existing prose and put it in the canonical location with canonical naming** so future skills can pick it up.

### Detecting prose chapters

Common signals (any one is enough; lean on the model rather than pattern-matching mechanically):

- **Filename patterns** — `chapter-01.md`, `ch01.md`, `Chapter 1.md`, `01-chapter.md`, `Ch1-The-Beginning.md`, etc. Sequential numbering across multiple files (`ch1.md`, `ch2.md`, `ch3.md`) is a strong signal.
- **Content shape** — opens with a "Chapter 1" / "Chapter One" heading or similar; reads as narrative prose (scene-level action and dialogue) rather than as analysis, outline, or summary; typically 2,000–6,000 words per file.
- **User declaration** — the user says *"I have prose for chapters 1–6"* during the conversation, or the brain dump mentions it explicitly.

If a file is genuinely ambiguous (a single "chapter.md" with story-like content but no number, a "draft.md" that *might* be a chapter), ask the user: *"`draft.md` reads like chapter prose but isn't numbered — is this a chapter, and which one?"*

### What to do when prose is detected

1. **List what you found** to the user during the intake conversation, before doing anything else:

   > I see prose for what looks like chapters 1, 2, 3, 4, 5, and 6 — filenames `ch1.md`, `ch2.md`, …, `ch6.md`. Plus a `chapter3-rewrite.md` that I'm reading as a v2 of chapter 3 (please confirm). About 22,000 words of prose total.

2. **Confirm the chapter assignments**. For each file, verify:
   - **Which chapter number** it represents. If the filename is ambiguous, ask.
   - **Which version** if there are duplicates (`ch3.md` + `chapter3-rewrite.md`). Ask the user which is canonical; stash the canonical one, copy the superseded file as is to `superseded-prose/<original filename>` in the intake archive (§ Where a new project lives; not a per-document snapshot), then `store.delete` the original per the binding. A superseded original the binding can't store (step 5's fallback) stays in the open folder, never deleted, and the report names it with the archive path it would have had.

3. **Normalize to the chapter-folder convention**: each chapter gets its own folder `chapters/chapter-NN/` (zero-padded to two digits), and the prose lands inside as `ch<NN>-prose.md`. So `ch1.md` becomes `chapters/chapter-01/ch01-prose.md`, `Chapter 17 - The Locket.md` becomes `chapters/chapter-17/ch17-prose.md`. Tell the user about the renames in the report.

4. **Preserve the prose content verbatim**. Do not edit, normalize whitespace, fix typos, or restructure the prose. The intake-stashed file is the user's content, untouched (on a binding that normalizes author markup on the way in, its write does that and reports it, and the local original is kept: § Where a new project lives). The only init-applied changes are:
   - Filename normalization.
   - Adding minimal YAML frontmatter (`chapter`, `title`, `version: 1`, `last_updated`, `authorship: author_written`) if the file doesn't already have frontmatter. Title is extracted from an H1 heading if present, or from the filename's slug portion if discoverable, or left as `TBD` if neither.

5. **Handle non-markdown formats** (`.docx`, `.txt`, `.rtf`, `.scrivx`, `.fountain`):
   - Stash as-is in the chapter folder with the original extension preserved on the prefixed name. Do NOT auto-convert.
   - Flag in the report: *"`chapters/chapter-03/ch03-prose.docx` was preserved in its original format. Prose-writing skills (when added) will require markdown — you can convert it now using a tool of your choice, or convert later when prose-writing functionality is built."*
   - Don't block init on format issues; stash and move on.
   - A binding that stores only markdown, or only text when the original is binary (a `.docx`), leaves these originals in the open folder, never deleted, and names them in the report with the canonical path they would have had instead of stashing them. The same holds for a superseded copy (step 2).

6. **Create the chapter folders** — one `chapters/chapter-NN/` per detected chapter (standalone: under the workspace-root `chapters/`; series: under `books/<current_focus>/chapters/`). If series intake is happening at the same time and prose belongs to specific books, sort each chapter folder into the right book's `chapters/` based on user confirmation. Ask if you're unsure which book a given chapter belongs to.

7. **Update `state.md → What Exists`** with a Prose chapters line:

   ```markdown
   - **Prose chapters** — 6/40 written (ch 1–6), stashed in `chapters/` (prose-writing functionality pending)
   ```

   The denominator (`/40`) is from the outline structure if it exists, or just `6 written` if no structure has been committed yet.

8. **Snapshot a mapping** of original filenames to canonical filenames as `intake-original-names.md` in the intake archive. Example:

   ```markdown
   # Intake — Original Filename Mapping

   2026-05-24

   | Original | Canonical | Notes |
   |---|---|---|
   | `ch1.md` | `chapters/chapter-01/ch01-prose.md` | Renamed for convention. |
   | `Chapter 3 - The Locket.docx` | `chapters/chapter-03/ch03-prose.docx` | Format preserved (not markdown); rename only. |
   | `chapter3-rewrite.md` | `chapters/chapter-03/ch03-prose.md` (canonical) | User confirmed this is the canonical v2; original `ch3.md` snapshotted to `superseded-prose/`. |
   | `ch6.md` | `chapters/chapter-06/ch06-prose.md` | Renamed. |
   ```

   This mapping is the audit trail — the user can always see what init did with their files.

### What init does NOT do with stashed prose

- **No content edits** — no typo fixes, no whitespace normalization, no prose rewrites.
- **No generation** of new prose, summaries, or outlines from the stashed prose.
- **No cross-check** of prose against treatment / outline / canon for continuity drift. (When prose-writing skills land, they'll do this. Until then, the user's prose is trusted as-is.)
- **No staleness flagging** — even if the stashed prose contradicts the treatment, init doesn't surface it. The user will discover and reconcile when prose-writing functionality is built.
- **No "Prose drafted" stage**. The stage in `state.md` is set based on upstream artifacts (treatment refinement, outline status); prose presence is reported in `What Exists` but doesn't shift the stage value. The existing stage enum doesn't include a prose-stage value yet — that will be added when prose-writing skills land.

### Recommended next step after prose stash

In the init report, note prose presence and recommend a next step that's *aware of* the prose but doesn't try to use it yet:

> Stashed 6 chapter prose files in `chapters/`. Prose-writing functionality is not built yet, so I'm leaving the prose untouched — it's reference material until those skills land. For now, the recommended next step depends on where else your project is: if you're still developing the treatment, `treatment-update` first; if your outline isn't complete, `pre-outline-session` to commit to a structure that covers the prose you already have. The prose chapters can inform both — `treatment-update` and `pre-outline-session` will read your existing prose alongside the treatment when working out the next moves.

## Series Mode

If the user is starting (or has) a multi-book series, init builds the **series folder structure** instead of the standalone-novel one. The two structures coexist — the standalone shape is unchanged for standalone projects, series adds folders without breaking anything. See `references/series.md` for the full doctrine.

Session bookkeeping goes to the root: the book's `state.md` takes its Summary, What Exists, What's Next and Last Session, and the root `state.md` takes `session_count` and `last_session` (`references/series.md` § Series-level `state.md` vs per-book `state.md`).

In series mode:

- The root `state.md` carries `project_type: series`, the `books: [...]` list, `current_focus`, and the series-level `target_word_count`. The config is the same two keys as a standalone project's.
- `series.md` is scaffolded at root with stub sections (Series Arc, Series Theme, Per-Book Synopses, Cross-Book Setups, Continuity Concerns). Real content lands when the user actually develops the arc — at init, it's a stub like primer is for standalone projects.
- `manifest.md`, `decisions/`, `questions/`, `journal/`, `characters/`, `worldbuilding/`, `research/` all live at root (shared across books).
- A `books/<slug>/` folder is created **for each book named in intake**. Inside each, a `state.md` is created with the book's `title`, `parent_series: <title>` in its frontmatter, its own `target_word_count` only when the book differs from the series default, and `stage: concept` (or whatever stage the user reports for that specific book). Per-book primer.md, treatment.md, outline/ are NOT created at init — they appear lazily via the relevant skills, same as standalone projects.

For intake of an existing standalone project that the user wants to convert to series:
- Confirm with the user before restructuring — this is a non-trivial move.
- Snapshot the current standalone folder per `store.md` before any file moves.
- `store.move` existing `primer.md`, `treatment.md`, and each document under `outline/` and `chapters/` (enumerate with `store.list(outline/**)` and `store.list(chapters/**)`; chapter content is per-book, `references/series.md`) into `books/book-1/`, keeping their relative paths. A document the binding computes is skipped by `move` and follows its rows.
- Keep `manifest.md`, `decisions/`, `questions/`, `journal/`, `characters/`, `worldbuilding/` at root (they were already shared in spirit).
- Update each existing decision and question entry to add `scope: book-1` (since pre-series, they were all about the one book), turning a decision's `integrated` into its one-item list (`- book-1 treatment <state>`), then give both indexes their Scope column. This touches every entry, so it fans out to subagents doing frontmatter-only edits (the whole-collection rule, `references/file-schemas.md` § Entry collections), never through the main window; each brief carries the store block and layout (`references/subagent-pattern.md` § Mandatory brief fields).
- The project's `target_word_count` becomes the series default in the root `state.md`, whose `title` becomes the series' title; book 1's own title goes in `books/book-1/state.md`. The `slug` never changes.
- Create stubs for book 2 and book 3 (or however many the user is planning).
- Scaffold `series.md` from the existing book-1 content plus any new series-arc decisions the user volunteers.

For first-time series intake (the user starts fresh), the flow is the same as standalone init except the questions in Step 3 include the series-specific items, and Step 5 builds the series folder structure.

## What this skill does not do

- **Generate a primer at any maturity stage.** The primer is always built by `treatment-update`'s Phase 1, which has first-run mode for scaffolding the five standard sections from available materials. Init leaves `primer.md` absent. The typical next step after init is to invoke `treatment-update` — its first-run mode will scaffold the primer from the decisions you extracted plus any treatment-like documents the user brought in.
- **Generate a treatment from scratch.** If the user brings in an existing treatment-like document, you can copy-and-clean-up to `treatment.md` with the user's explicit agreement. Otherwise, leave `treatment.md` absent — `treatment-update`'s Phase 2 first-run mode handles construction.
- **Generate `series.md` content beyond a stub.** Just like primer, the real content of `series.md` is developed through brainstorming. At init, scaffold the sections with `[To be developed]` markers and the book list; don't invent series arc content.
- Run any other heavy generation. This is a scaffolding and triage skill.
- Modify materials the user brought in (the brain dump, the existing treatment). Read them; reference them in the decision entries; do not rewrite them. The exception is the explicit copy-and-clean-up step above.

## References

- `references/plan-first.md` — universal plan-first behavior
- `references/file-schemas.md` — exact file formats (including § Entry collections, § `journal/`, § `.storystormer/config.json`, `series.md` schema and series-mode state.md fields)
- `references/store.md` — § New entries (the store assigns and reports each entry's number)
- `references/reading-discipline.md` — read in full, don't grep; Zoom Selection for choosing artifact tier
- `references/subagent-pattern.md` — **read on every non-trivial intake** (survey + execute dispatch, parallel subagents, return schema)
- `references/series.md` — **read when scaffolding a series project** (multi-book folder structure, shared-vs-per-book artifacts, scoping)
- `references/philosophy.md` — what makes StoryStormer's workflow distinctive
- `references/frameworks.md` — craft vocabulary (use only as needed in this skill)
- `references/genres.md` — genre handling and surfacing
