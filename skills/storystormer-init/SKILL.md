---
name: storystormer-init
description: Scaffold a StoryStormer story workspace in the current folder. Use when the user starts a new story project, drops materials into a folder and wants to set up a structured workspace, or says things like "set up StoryStormer here," "start a new novel," "I have a brain dump / partial treatment / mess of materials — help me organize," or "init this project." Handles any starting state — empty folder, single logline, freeform brain dump, half-finished treatment, or a tangled mid-project mess with some characters bios written and the third act undefined.
---

# StoryStormer · Init

You are setting up a StoryStormer story workspace in the user's current folder. This may be the first thing the user has done in this folder, or they may already have materials in flight. Your job is to triage what's there, figure out where the project actually is, propose a plan for how to proceed, and then build out the canonical file structure once they say go.

This is the marquee skill of the plugin. **The user can drop in with anything — empty folder, one-line concept, freeform notes, a near-complete treatment, or a messy mid-project state — and you reorganize it into the canonical structure.** Lean on the model's reasoning here. Triage is a judgment task; trust yourself.

Always follow `references/plan-first.md` — load context, propose a plan in plain language, wait for the user's go before executing.

## What you produce

When the user gives you the go-ahead, you create or update:

- `state.md` — living dashboard (see `references/file-schemas.md`)
- `.storystormer/config.json` — project metadata
- `.storystormer/` — supporting subfolder structure
- `decisions.md` and `questions.md` — seeded from any materials you found
- `treatment.md` — only when the user brings in an existing treatment-like document and explicitly agrees to a copy-and-clean-up step. **Never generate a new treatment at init.**
- `primer.md` — **never at init.** The primer is a six-section structured craft dossier (~4,500–5,500w) that's always built by `treatment-update`'s Phase 1 (first-run mode handles construction from intake materials). Init leaves `primer.md` absent so the first `treatment-update` run populates it.
- `manifest.md` — only if there's enough character/world content to seed it
- `characters/_index.md` and per-character bios — only if the user has named characters
- The `worldbuilding/` subfolders as appropriate
- `outline/` and its files — **never at init.** The outline directory (the book-level spine: `structure.md` + the `_index.md` outline view) is created lazily by `pre-outline-session`, and the per-chapter outlines (`chapters/chapter-NN/ch<NN>-outline.md`) by `outline-chapters`, when the project is ready for outlining (typically `treatment-refined` or `canon-development` stage). If the user brings in pre-existing outline-shaped materials (chapter outlines, beat sheets, scene lists), note them in the intake survey but **do not migrate them into `outline/` here** — flag them and recommend `pre-outline-session` as the next step, which knows how to integrate them.
- `chapters/` — **created at init only when prose chapters are detected in the user's intake materials.** Init stashes incoming prose into per-chapter folders with canonical naming (`chapters/chapter-NN/ch<NN>-prose.md`); see § Prose Chapter Stashing below. If no prose is brought in, leave `chapters/` absent — it appears later when prose-writing functionality is added (post-POC) or when a future intake brings prose.

Don't pre-create empty files. Only create files that have meaningful content. Empty placeholders create the illusion of progress that isn't there.

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
- **Project type** — novel / novella / short story / screenplay / **series** (affects target lengths in `references/file-schemas.md`, and series triggers the multi-book folder structure in `references/series.md`).
- **Genre** — confirm or ask. If hybrid, capture both.
- **The user's intent for this session** — *"what would you like to focus on first?"* lets them redirect from your default plan.

For a mid-project mess (decisions made elsewhere, partial files), also ask:
- **Sources of truth** — *"if the brain dump and the treatment disagree on Marlowe's backstory, which should I trust?"*
- **Carryover decisions** — *"are there decisions you've made that aren't in any of these files yet? Tell me, and I'll log them."*

If the project is a **series**, ask additional intake questions:
- **How many books** — confirm the planned count (typical: trilogy = 3; longer series may be open-ended).
- **Book slugs and titles** — `book-1`, `book-2`, `book-3` are the conventional slugs; titles can be working titles or TBD. Slugs are stable (used in file paths); titles can change.
- **Which book is the current focus** — the user names which book they're actively working on; that becomes `current_focus` in `state.md` and `config.json`.
- **Shared-vs-per-book intake materials** — if the user brought in materials, ask which apply to which book (or to the series as a whole). Brain dumps and decisions get sorted into their right scope.

### 4. Propose a plan, in plain language

Tell the user what you're going to do based on the stage and what you found. Examples:

> **Stage: `brain-dump`.** Here's what I'm planning:
>
> - Set up `state.md`, `decisions.md`, `questions.md`, and the `.storystormer/` folder.
> - Extract about 8–10 decisions from your `notes.md` (things like "protagonist is a forensic accountant" and "set in the present day") and seed them into `decisions.md` — I'll show you the list for confirmation before locking it in.
> - Extract the implicit open questions (the things you wrote as "???" or "maybe X or Y") into `questions.md` with priorities.
> - Skip generating a primer or treatment for now — we don't have enough decided yet. We'll work through the questions in priority order and build the primer once the shape is clearer.
> - Synthesize a genre reference for literary thrillers on the side, so I can surface obligatory scenes and pitfalls as we go.
>
> Sound right?

> **Stage: `treatment-drafted`.** What I'm seeing: the treatment is in good shape for Acts 1 and 2 but Act 3 is mostly bullet sketches; you've named four characters but only one has a bio. My plan:
>
> - Set up `state.md` showing where things are (treatment v1 imported, 1 bio exists, manifest needs seeding).
> - Read the treatment carefully and extract ~15 decisions into `decisions.md` so they're a first-class log.
> - Surface 5–8 open questions from the Act 3 gaps as triaged entries in `questions.md`.
> - Seed `manifest.md` from the characters and locations the treatment names — lean inventory entries, no bios yet.
> - **Not** regenerate the primer or treatment in this init pass — the treatment is solid; we'll refine it once Act 3 is decided.
>
> Anything you want to adjust before I start?

### 5. Execute once the user agrees

For non-trivial migrations (more than a handful of files to move, write, or stamp), **dispatch execution subagents in parallel** per the doctrine in `references/subagent-pattern.md`. One subagent per category, all dispatched in a single message so they run concurrently:

- **Bios migration subagent** — reads each bio in the intake scope, normalizes to the canonical character bio schema (`references/file-schemas.md` § Character bio files), writes to `characters/<slug>.md`, stamps frontmatter (name, tier, version: 1, last_updated). Returns completion log per file.
- **Worldbuilding migration subagent** — categorizes each file per the 14-category taxonomy in `references/frameworks.md` § Worldbuilding, writes to `worldbuilding/<category>/<slug>.md`, stamps frontmatter. Returns completion log per file.
- **Decisions extraction subagent** — reads brain dumps and legacy decision-style files, produces *proposals* for `decisions.md` entries (D-### IDs, summaries, details, source, scope in series mode). The subagent **does not write** — it returns proposed entries; the main session reviews them and decides what gets written. This is judgment work that stays in main.
- **Questions extraction subagent** — same pattern as decisions: returns proposed Q-### entries; main session reviews before writing to `questions.md`.
- **History snapshot subagent** — copies superseded folders to `.storystormer/history/<timestamp>-init/`, writes the `intake-original-names.md` mapping table. Returns the snapshot inventory.
- **Prose chapter stash subagent** (if applicable, see § Prose Chapter Stashing) — moves detected prose into `chapters/` with canonical naming, preserves content verbatim, adds minimal frontmatter, returns the original-to-canonical mapping.

The main session aggregates the completion logs from each subagent for the final § Report step.

**Sequential after aggregation.** After all parallel subagents complete, the main session does the writes that depend on aggregated state: `state.md` (the dashboard reflects everything the subagents did), `series.md` stub (in series mode), `manifest.md` (depends on what bios and worldbuilding subagents migrated), `decisions.md` and `questions.md` (only after the main session has reviewed and approved the proposed entries from the extraction subagents).

**Direct execution in main session** when the migration is trivial — a fresh empty folder with 2–3 files of intake material. The subagent dispatch overhead isn't worth it for tiny operations.

For decision and question extraction in either mode (subagent-dispatched or main-session-direct), lean on the model — it's a judgment task, not a regex match. The user reviews the proposed entries before they're written. Never auto-write decisions or questions from intake without user review; the user's voice in those logs matters.

### 6. Report

Short summary:

- What you created.
- What you extracted (N decisions, M questions).
- What you stashed — if prose chapters were detected and moved into `chapters/`, list the chapter numbers stashed and any rename/format flags (see § Prose Chapter Stashing).
- What you deliberately did *not* create — always including `primer.md` (that's `treatment-update`'s job). Name the absent files and the skill that produces them.
- The recommended next step. Typical recommendations by stage:
  - **`concept` / `brain-dump`**: `brainstorm-session` to work through the highest-priority question and accumulate more decisions before the first `treatment-update` run.
  - **`brainstorming` and above** (enough decided that primer construction is meaningful): `treatment-update` in first-run mode — it will scaffold the six-section primer from your extracted decisions, plus any treatment-like document the user brought in, and produce/refine `treatment.md`.
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

The dispatch decision is conditional on intake complexity. Trivial folders (empty, single brain dump, fewer than 4 files) read and execute directly in the main session — subagent overhead exceeds benefit at that scale. The thresholds and decision rule are in `references/subagent-pattern.md` § When to dispatch vs. when to read directly.

**Required behavior in subagent returns:** every read subagent's return must include 3–5 verbatim quoted excerpts per file. This is the same anti-confabulation defense as substantive mode applied to the subagent layer. Returns without quotes get rejected and re-dispatched. Silent acceptance of quote-free returns defeats the entire reading-discipline architecture.

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
   - **Which version** if there are duplicates (`ch3.md` + `chapter3-rewrite.md`). Ask the user which is canonical; stash the canonical one, snapshot the superseded version to `.storystormer/history/<timestamp>-init/superseded-prose/`.

3. **Normalize to the chapter-folder convention**: each chapter gets its own folder `chapters/chapter-NN/` (zero-padded to two digits), and the prose lands inside as `ch<NN>-prose.md`. So `ch1.md` becomes `chapters/chapter-01/ch01-prose.md`, `Chapter 17 - The Locket.md` becomes `chapters/chapter-17/ch17-prose.md`. Tell the user about the renames in the report.

4. **Preserve the prose content verbatim**. Do not edit, normalize whitespace, fix typos, or restructure the prose. The intake-stashed file is the user's content, untouched. The only init-applied changes are:
   - Filename normalization.
   - Adding minimal YAML frontmatter (`chapter`, `title`, `version: 1`, `last_updated`) if the file doesn't already have frontmatter. Title is extracted from an H1 heading if present, or from the filename's slug portion if discoverable, or left as `TBD` if neither.

5. **Handle non-markdown formats** (`.docx`, `.txt`, `.rtf`, `.scrivx`, `.fountain`):
   - Stash as-is in the chapter folder with the original extension preserved on the prefixed name. Do NOT auto-convert.
   - Flag in the report: *"`chapters/chapter-03/ch03-prose.docx` was preserved in its original format. Prose-writing skills (when added) will require markdown — you can convert it now using a tool of your choice, or convert later when prose-writing functionality is built."*
   - Don't block init on format issues; stash and move on.

6. **Create the chapter folders** — one `chapters/chapter-NN/` per detected chapter (standalone: under the workspace-root `chapters/`; series: under `books/<current_focus>/chapters/`). If series intake is happening at the same time and prose belongs to specific books, sort each chapter folder into the right book's `chapters/` based on user confirmation. Ask if you're unsure which book a given chapter belongs to.

7. **Update `state.md → What Exists`** with a Prose chapters line:

   ```markdown
   - **Prose chapters** — 6/40 written (ch 1–6), stashed in `chapters/` (prose-writing functionality pending)
   ```

   The denominator (`/40`) is from the outline structure if it exists, or just `6 written` if no structure has been committed yet.

8. **Snapshot a mapping** of original filenames to canonical filenames in `.storystormer/history/<timestamp>-init/intake-original-names.md`. Example:

   ```markdown
   # Intake — Original Filename Mapping
   2026-05-24

   | Original | Canonical | Notes |
   |---|---|---|
   | ch1.md | chapters/chapter-01/ch01-prose.md | Renamed for convention. |
   | Chapter 3 - The Locket.docx | chapters/chapter-03/ch03-prose.docx | Format preserved (not markdown); rename only. |
   | chapter3-rewrite.md | chapters/chapter-03/ch03-prose.md (canonical) | User confirmed this is the canonical v2; original `ch3.md` snapshotted to superseded-prose/. |
   | ch6.md | chapters/chapter-06/ch06-prose.md | Renamed. |
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

In series mode:

- `state.md` and `.storystormer/config.json` at root carry `project_type: series`, the `books: [...]` list, and `current_focus`.
- `series.md` is scaffolded at root with stub sections (Series Arc, Series Theme, Per-Book Synopses, Cross-Book Setups, Continuity Concerns). Real content lands when the user actually develops the arc — at init, it's a stub like primer is for standalone projects.
- `manifest.md`, `decisions.md`, `questions.md`, `characters/`, `worldbuilding/`, `research/` all live at root (shared across books).
- A `books/<slug>/` folder is created **for each book named in intake**. Inside each, a `state.md` is created with `parent_series: <title>` in its frontmatter and `stage: concept` (or whatever stage the user reports for that specific book). Per-book primer.md, treatment.md, outline/ are NOT created at init — they appear lazily via the relevant skills, same as standalone projects.

For intake of an existing standalone project that the user wants to convert to series:
- Confirm with the user before restructuring — this is a non-trivial move.
- Snapshot the current standalone folder to `.storystormer/history/<timestamp>-convert-to-series/` before any file moves.
- Move existing `primer.md`, `treatment.md`, `outline/` into `books/book-1/`.
- Keep `manifest.md`, `decisions.md`, `questions.md`, `characters/`, `worldbuilding/` at root (they were already shared in spirit).
- Update each existing decision and question to add `Scope: book-1` (since pre-series, they were all about the one book).
- Create stubs for book 2 and book 3 (or however many the user is planning).
- Scaffold `series.md` from the existing book-1 content plus any new series-arc decisions the user volunteers.

For first-time series intake (the user starts fresh), the flow is the same as standalone init except the questions in Step 3 include the series-specific items, and Step 5 builds the series folder structure.

## What this skill does not do

- **Generate a primer at any maturity stage.** The primer is always built by `treatment-update`'s Phase 1, which has first-run mode for scaffolding the six standard sections from available materials. Init leaves `primer.md` absent. The typical next step after init is to invoke `treatment-update` — its first-run mode will scaffold the primer from the decisions you extracted plus any treatment-like documents the user brought in.
- **Generate a treatment from scratch.** If the user brings in an existing treatment-like document, you can copy-and-clean-up to `treatment.md` with the user's explicit agreement. Otherwise, leave `treatment.md` absent — `treatment-update`'s Phase 2 first-run mode handles construction.
- **Generate `series.md` content beyond a stub.** Just like primer, the real content of `series.md` is developed through brainstorming. At init, scaffold the sections with `[To be developed]` markers and the book list; don't invent series arc content.
- Run any other heavy generation. This is a scaffolding and triage skill.
- Modify materials the user brought in (the brain dump, the existing treatment). Read them; reference them in `decisions.md`; do not rewrite them. The exception is the explicit copy-and-clean-up step above.

## References

- `references/plan-first.md` — universal plan-first behavior
- `references/file-schemas.md` — exact file formats (including `series.md` schema and series-mode state.md fields)
- `references/reading-discipline.md` — read in full, don't grep; Zoom Selection for choosing artifact tier
- `references/subagent-pattern.md` — **read on every non-trivial intake** (survey + execute dispatch, parallel subagents, return schema)
- `references/series.md` — **read when scaffolding a series project** (multi-book folder structure, shared-vs-per-book artifacts, scoping)
- `references/philosophy.md` — what makes StoryStormer's workflow distinctive
- `references/frameworks.md` — craft vocabulary (use only as needed in this skill)
- `references/genres.md` — genre handling and surfacing
