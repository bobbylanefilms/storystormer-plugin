<!-- ABOUTME: The doctrine for series-mode (multi-book) workflows — folder structure, path resolution, scoping -->
<!-- ABOUTME: Read this when state.md says project_type: series. Defines what's shared vs per-book. -->

# Series Workflow

This document is the doctrine for **series-mode** projects — trilogies, longer series, or any multi-book work that shares a continuity layer (characters, worldbuilding, an overarching arc). Series mode is opt-in: standalone novel projects ignore everything in this file.

If `state.md` shows `project_type: series`, every skill that reads or writes files **must** read this doctrine first, then apply the path-resolution and scoping rules below.

If `state.md` shows `project_type: novel`, this doctrine does not apply. Standalone-novel behavior is the v0.2 baseline; series mode is additive.

## The core distinction

A series project has **three layers**:

1. **Series-level layer** — the overarching arc, themes, and cross-book setups/payoffs that span every book.
2. **Shared canon layer** — characters, worldbuilding, and decisions that exist *across* all books. Maya is one person regardless of which book she's in.
3. **Per-book layer** — each book's own primer, treatment, outline, and (future) prose. These are independent stories that happen to share a continuity universe.

The folder structure makes this explicit:

```
my-series/
├── state.md                     # Series-level dashboard
├── series.md                    # Arc-level document (cross-book overview, setup/payoff chains)
├── manifest.md                  # Shared cast + worldbuilding inventory (all books)
├── decisions.md                 # All decisions, each with scope: series | book-<slug>
├── questions.md                 # All questions, each with scope: series | book-<slug>
├── characters/                  # Shared bios — one bio per character, full series arc
│   ├── _index.md
│   ├── maya.md
│   └── senator-vance.md
├── worldbuilding/               # Shared worldbuilding
│   ├── locations/, organizations/, …
├── research/                    # Shared research
├── books/
│   ├── book-1/
│   │   ├── state.md             # Per-book dashboard
│   │   ├── primer.md            # Book 1's craft dossier
│   │   ├── treatment.md         # Book 1's treatment
│   │   ├── outline/            # Book-level spine
│   │   │   ├── structure.md
│   │   │   └── _index.md        # Outline view (chapter × stage matrix)
│   │   └── chapters/            # Per-chapter content folders
│   │       ├── chapter-01/
│   │       │   ├── ch01-outline.md
│   │       │   ├── ch01-prose.md   # (prose/blueprint/notes land post-POC)
│   │       │   └── .history/
│   │       └── chapter-02/ …
│   ├── book-2/
│   │   └── … (same shape)
│   └── book-3/
│       └── … (same shape)
└── .storystormer/
    ├── config.json              # project_type: series, books: [...], current_focus: book-2
    ├── genre-reference.md
    └── history/
```

A book inside `books/<slug>/` looks **identical** to a standalone-novel project — same primer.md / treatment.md / outline/ shape. That's intentional. The skills' per-book behavior is unchanged; only the **paths** they resolve to change.

## What's shared vs. per-book

| Artifact | Location | Why |
|---|---|---|
| `state.md` (series-level) | `<root>/state.md` | Series-level dashboard. Tracks all books' progress at a glance. |
| `series.md` | `<root>/series.md` | The arc-level document. Cross-book setups, series theme, per-book synopses. |
| `manifest.md` | `<root>/manifest.md` | One cast inventory across all books. Each entry has an `Appears in:` field. |
| `decisions.md` | `<root>/decisions.md` | All decisions in one log, scoped per entry. Avoids per-book duplication and makes cross-book chains traceable. |
| `questions.md` | `<root>/questions.md` | Same — one questions log, scoped per entry. |
| `characters/` | `<root>/characters/` | One bio per character. Bios reflect the full series arc with per-book sub-arcs. |
| `worldbuilding/` | `<root>/worldbuilding/` | Shared. The Senate is the Senate; doesn't fork per book. |
| `research/` | `<root>/research/` | Shared. |
| `.storystormer/` | `<root>/.storystormer/` | Shared config + genre reference + history. |
| `state.md` (per-book) | `books/<slug>/state.md` | Per-book dashboard. Tracks one book's stage, primer/treatment versions, outline status. |
| `primer.md` | `books/<slug>/primer.md` | Per-book. Each book has its own thematic / structural commitment. |
| `treatment.md` | `books/<slug>/treatment.md` | Per-book. Each book is its own story. |
| `outline/structure.md` + `outline/_index.md` | `books/<slug>/outline/` | Per-book. Each book has its own chapter spine and outline view. |
| `chapters/chapter-NN/` (per-chapter content) | `books/<slug>/chapters/chapter-NN/` | Per-book. Each book's chapter folders (outline/blueprint/prose/notes) live under its own `chapters/`; chapter content is intrinsically per-book. |

The principle: **shared at root, per-book in `books/<slug>/`**. If you're touching a story-specific artifact (one book's primer, treatment, outline), it lives in that book's folder. If you're touching a continuity artifact (a character, a location, a cross-book decision), it lives at root.

## Path resolution in series mode

Every skill that reads or writes per-book files must resolve paths through the current-focused book.

The **current focus** is recorded in two places (kept in sync):

- `state.md` frontmatter: `current_focus: book-2`
- `.storystormer/config.json`: `"current_focus": "book-2"`

Use `state.md` as the source of truth; `config.json` is the convenience mirror.

In series mode, when a skill instruction says *"read `primer.md`"*, the actual path is `books/<current_focus>/primer.md`. When it says *"read `treatment.md`"*, the actual path is `books/<current_focus>/treatment.md`. Same for every per-book artifact.

Shared artifacts (`manifest.md`, `characters/*.md`, `decisions.md`, `questions.md`, etc.) are always at root regardless of focus.

### When you need to read a different book's artifacts

Sometimes you need to read a non-focused book's files — e.g., when working on book 2's treatment, you may need to check book 1's ending. This is permitted and explicit:

- Read `books/book-1/treatment.md` directly (full path).
- Quote from it as you would any other source.
- Don't change `current_focus` for a read-only cross-book reference — focus only changes when the user is *working on* a different book.

### When the user signals a focus change

If the user says *"let's switch to book 2"*, *"I want to work on book 3 now"*, or otherwise signals a focus change, do one of:

1. **Suggest the slash command**: *"Use `/storystormer:switch book-2` to change focus."*
2. **Or inline as part of the next plan-first proposal**: *"Before I start, let me switch focus to book 2 — current_focus is currently book-1."* Then update `state.md` and `config.json` before doing anything else.

Both are fine. Pick based on the conversation's tempo — explicit command for a clear pivot, inline switch for a fluid conversation that's already in motion.

## Scoping decisions and questions

In series mode, every decision and every question carries a `scope` field. Values:

- `series` — applies to the series arc as a whole, or to more than one book.
- `book-<slug>` — applies to one specific book.

Examples:

```markdown
## D-024 · 2026-05-24 · plot

**Scope**: series
**Affects books**: book-1 (ch 38), book-3 (ch 22)
**Topic**: Inauguration scene foreshadowing
**Summary**: The inauguration scene in book 1 chapter 38 will plant visual elements (the missing aide, the deviation from protocol) that pay off as the assassination attempt in book 3 chapter 22.
**Details**: ...
**Source**: brainstorm
**Integrated into**: book-1 treatment yes (2026-05-24); book-3 treatment no
```

```markdown
## D-025 · 2026-05-24 · character

**Scope**: book-1
**Topic**: Maya's confrontation with her father
**Summary**: Maya confronts Senator Vance in book 1 chapter 35.
**Details**: ...
**Integrated into**: book-1 treatment yes (2026-05-24)
```

The `Integrated into` field becomes book-aware too — a series-scoped decision can be integrated into one book's treatment but pending in another's.

When in doubt about scope: **ask the user**. Don't default series-scope on a book-specific decision or vice versa; the scope determines which artifacts get refreshed when the decision is integrated.

### Status flow for series-scoped decisions

A series-scoped decision typically has integration pending across multiple books. Track each independently:

```markdown
**Integrated into**:
- book-1 treatment: yes (2026-05-24)
- book-2 treatment: pending (waiting on Q-031 to resolve)
- book-3 treatment: no
```

When a `treatment-update` runs for book 2 and folds in the series-scoped decision, that book's line flips to `yes (date)`. Other books' lines remain.

## Character bios in series mode

One bio per character. The bio reflects the character's **full series arc** with per-book sub-arcs.

The character bio schema gets one additional section in series mode:

```markdown
## Story Role & Arc

[Standalone arc section — written for the whole series.]

### Series Arc
[~150–250w on the character's full arc across all books — where they start in book 1, what they become by the end of book 3.]

### Per-Book Sub-Arcs

**Book 1**: [~80–150w on what the character does and how they change in book 1.]
**Book 2**: [~80–150w]
**Book 3**: [~80–150w]
```

The Quick Reference block also gains an `Appears in:` line in series mode:

```markdown
## Quick Reference
- **Name:** Maya Vance
- **Appears in:** books 1, 2, 3
- **Age:** 28 (book 1) → 32 (book 3)
- **Story Role:** Protagonist (all books)
- …
```

For characters that only appear in one or two books, `Appears in:` is the truth-teller — *"Senator Vance · Appears in: book 1"* tells `character-bio` to keep the bio scoped to one book's arc rather than fabricating roles in books 2 and 3.

### When character canon evolves dramatically

If a character changes so dramatically across books that one bio can't usefully cover them (e.g., they die in book 1 but appear as a ghost/memory in book 3 with a different function), use the **per-book sub-arc** sections to capture the transformation. Don't fork the bio into multiple files — the character's identity is continuous even when their function changes.

The web app's "canon states" concept (point-in-time bio snapshots) is the deeper solution to this problem, but it's out of POC scope. For v0.3, the per-book sub-arc sections are enough.

## Manifest in series mode

The manifest is shared. Each entry gets an `Appears in:` field:

```markdown
## Characters

### Major
- **Maya Vance** (`characters/maya.md`) — Congressional staffer; protagonist of all three books. *Appears in: books 1, 2, 3*
- **Senator Vance** (`characters/senator-vance.md`) — Maya's father; antagonist of book 1, dead by book 2. *Appears in: book 1*
- **Reyes** (`characters/reyes.md`) — FBI agent; surfaces in book 2, becomes major in book 3. *Appears in: books 2, 3*

### Supporting
- **Hartwell** (`characters/hartwell.md`) — Senator Vance's chief of staff. *Appears in: books 1, 2*
```

When `manifest-sync` runs in series mode, it cross-references each character's appearances against the treatments of all books to verify the `Appears in:` field is correct.

## The series.md document

`series.md` is the arc-level companion to per-book treatments. It captures what no single book's treatment can — the cross-book story.

See `references/file-schemas.md` § `series.md` for the schema. In short, it contains:

- **Series Arc** — the protagonist's full trajectory across all books.
- **Series Theme** — the central question the series asks (often distinct from any single book's premise).
- **Per-Book Synopses** — one paragraph per book, written so a reader of `series.md` understands the shape of the whole series in 5 minutes.
- **Cross-Book Setups and Payoffs** — a table of chains that span books. The single most useful section for ongoing series work.
- **Continuity Concerns** — ongoing concerns the author is tracking (character aging, technology changes, contradictions to resolve).

### When to update series.md

The series.md document refreshes when:

- A cross-book decision lands (`scope: series` with multiple books in `Affects books`).
- A book's treatment changes in a way that affects the series arc (e.g., book 1's ending shifts, which changes book 2's starting state).
- A new cross-book setup/payoff chain is identified.
- A book's role in the series shifts (e.g., the user decides book 2 is now a prequel rather than a sequel).

`series.md` does **not** refresh after every brainstorm session. It's a lower-frequency artifact than per-book treatments. Update it when the series-level view of the story has genuinely shifted.

### Who updates series.md

For v0.3, `series.md` updates are handled by:

- **`brainstorm-session`** — when a cross-book decision lands, offers to update series.md inline.
- **`treatment-update`** — when a book's treatment refresh affects the series arc, surfaces the implication and offers a follow-up series.md update.
- **Direct conversation** — the user can ask *"refresh series.md to reflect what we've decided"* and the relevant skill (typically brainstorm-session) handles it.

There is no dedicated `series-update` skill in v0.3. The series-level document is light enough that the existing skills can refresh it.

## Switching focus

The current focus changes via:

- **`/storystormer:switch <book-slug>`** — explicit slash command. Validates the slug exists in `books/`, updates `current_focus` in both `state.md` and `config.json`, reports the new book's state.
- **Inline in a skill's plan-first proposal** — if the user signals a focus change conversationally and a skill is about to fire, the skill switches focus as the first step of execution.

The switch is a small operation — two file edits and a state report. Don't ceremony it.

## Series-level state.md vs per-book state.md

**Series-level state.md** (at `<root>/state.md`):

- `project_type: series`
- `current_focus: book-2`
- `books: [book-1, book-2, book-3]`
- `What Exists` section: lists the **series-level** artifacts plus a one-line status per book.
- `What's Next`: usually points to the current-focused book's `What's Next`, or to a series-level next step (e.g., *"refresh series.md after book 2 treatment lands"*).

**Per-book state.md** (at `books/<slug>/state.md`):

- Mirrors a standalone novel's state.md — `stage`, `What Exists` for *this book's* artifacts, `What's Next` for *this book's* work.
- `parent_series: <series-title>` field in frontmatter, pointing back to the root.

A skill working on book 2 reads `books/book-2/state.md` for its primary state, and may also read `<root>/state.md` for series context. Updates to per-book state.md don't automatically update series-level state.md — the series-level dashboard is refreshed periodically (e.g., by `brainstorm-session`'s closing protocol) rather than on every per-book write.

## How the existing skills behave in series mode

All v0.2 skills work in series mode with **only path-resolution changes**. The skill bodies are unchanged in their core behavior:

- `storystormer-init` — recognizes series intent during intake, scaffolds the series folder structure, asks the user for book slugs and titles.
- `brainstorm-session` — reads the focused book's primer/treatment plus the shared `series.md`, `manifest.md`, and relevant character bios. Captures decisions with `scope` field. Watches for cross-book triggers (a decision that affects another book).
- `treatment-update` — operates on the focused book's primer and treatment. Surfaces series-level impact in the report (does this change affect book N+1's starting state?). Recommends a `series.md` update if cross-book effects are material.
- `character-bio` — reads from `characters/<slug>.md` at root (shared). Adds per-book sub-arc sections in series mode. Cross-references all books' treatments for the character's appearances.
- `manifest-sync` — operates on the shared `manifest.md`. Reads all books' treatments to build the `Appears in:` field per entry.
- `pre-outline-session` — operates on the focused book. Reads the focused book's primer/treatment plus `series.md` for cross-book setups that need spine slots.
- `outline-chapters` — operates on the focused book. Reads `books/<focus>/outline/structure.md` and writes `books/<focus>/chapters/chapter-NN/ch<NN>-outline.md`.
- `decision-capture` — captures decisions to the shared `decisions.md` with a `scope` field. Asks the user about scope when ambiguous.

In each case, the *what to read* and *what to write* sections of the skill body apply as written; the only change is that per-book paths get prefixed with `books/<current_focus>/`.

## When NOT to use series mode

Series mode is for genuinely connected multi-book projects with shared continuity. It is **not** the right shape for:

- **A collection of unrelated short stories** — each is a standalone project. Don't force them into a series workspace.
- **A standalone novel with a planned sequel that doesn't exist yet** — start as standalone. Convert to series when the second book actually starts development. (Conversion is straightforward: move existing files into `books/book-1/`, create the series-level scaffolding, add book 2.)
- **An anthology or themed collection** where the stories don't share continuity — each is its own thing.

The friction added by series mode (current_focus management, scope tracking, path resolution) pays off only when there's enough shared continuity to make it worth the overhead.
