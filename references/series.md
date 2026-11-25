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
├── state.md                     # Series-level dashboard: books, current_focus, the default target, session_count
├── series.md                    # The Series Bible: what only the whole series can say
├── manifest.md                  # Shared cast + worldbuilding inventory (all books, one per series)
├── decisions/                   # All decisions, one entry each, scope: series | book-<slug>
│   ├── _index.md
│   └── D-001.md, D-002.md, …
├── questions/                   # All questions, one entry each, scope: series | book-<slug>
│   ├── _index.md
│   └── Q-001.md, …
├── journal/                     # One entry per session, for the whole series
│   └── 2026-05-24-s12.md, …
├── characters/                  # Shared bios — one bio per character, full series arc, tagged with its books
│   ├── _index.md
│   ├── maya-vance.md
│   └── senator-vance.md
├── worldbuilding/               # Shared worldbuilding
│   ├── locations/, organizations/, …
├── research/                    # Shared research
├── books/
│   ├── book-1/
│   │   ├── state.md             # Per-book dashboard: the book's title, its own target if it has one
│   │   ├── primer.md            # Book 1's craft dossier
│   │   ├── treatment.md         # Book 1's treatment
│   │   ├── handoff.md           # Book 1's end state, written when the book is closed out
│   │   ├── outline/            # Book-level spine
│   │   │   ├── structure.md
│   │   │   └── _index.md        # Outline view (chapter × stage matrix)
│   │   └── chapters/            # Per-chapter content folders
│   │       ├── chapter-01/
│   │       │   ├── ch01-outline.md
│   │       │   ├── ch01-prose.md   # (prose/blueprint/notes land post-POC)
│   │       │   └── .history/    # where the binding's history is snapshots
│   │       └── chapter-02/ …
│   ├── book-2/
│   │   └── … (same shape)
│   └── book-3/
│       └── … (same shape)
└── .storystormer/
    ├── config.json              # layout: 2 and storage, the same two keys as a standalone project
    ├── genre-reference.md
    └── history/                 # where the binding's history is snapshots
```

A book inside `books/<slug>/` looks **identical** to a standalone-novel project — same primer.md / treatment.md / outline/ shape. That's intentional. The skills' per-book behavior is unchanged; only the **paths** they resolve to change.

## What's shared vs. per-book

| Artifact | Location | Why |
|---|---|---|
| `state.md` (series-level) | `<root>/state.md` | Series-level dashboard. Tracks all books' progress at a glance. |
| `series.md` | `<root>/series.md` | The Series Bible: series arc, theme, structural conventions, cross-book setups and continuity, with each book’s synopsis. |
| `manifest.md` | `<root>/manifest.md` | One cast inventory across all books. Each entry’s `Appears in:` line comes from its book list. |
| `decisions/` | `<root>/decisions/` | All decisions in one collection, scoped per entry, with one `_index.md`. Avoids per-book duplication and makes cross-book chains traceable. |
| `questions/` | `<root>/questions/` | Same — one questions collection, scoped per entry. |
| `journal/` | `<root>/journal/` | One entry per session, whichever book it worked on. The root `state.md` counts the sessions. |
| `characters/` | `<root>/characters/` | One bio per character. Bios reflect the full series arc with per-book sub-arcs, and carry the books they appear in (`books:`). |
| `worldbuilding/` | `<root>/worldbuilding/` | Shared. The Senate is the Senate; doesn’t fork per book. Tagged with its books the same way. |
| `research/` | `<root>/research/` | Shared. |
| `.storystormer/` | `<root>/.storystormer/` | Shared config (`layout` and `storage` only) + genre reference + history. |
| `state.md` (per-book) | `books/<slug>/state.md` | Per-book dashboard. Tracks one book's stage, primer/treatment versions, outline status. |
| `primer.md` | `books/<slug>/primer.md` | Per-book. Each book has its own thematic / structural commitment. |
| `treatment.md` | `books/<slug>/treatment.md` | Per-book. Each book is its own story. |
| `handoff.md` | `books/<slug>/handoff.md` | Per-book. Where the book leaves the story, written when the author closes it out; the next book starts from it. |
| `outline/structure.md` + `outline/_index.md` | `books/<slug>/outline/` | Per-book. Each book has its own chapter spine and outline view. |
| `chapters/chapter-NN/` (per-chapter content) | `books/<slug>/chapters/chapter-NN/` | Per-book. Each book's chapter folders (outline/blueprint/prose/notes) live under its own `chapters/`; chapter content is intrinsically per-book. |

The principle: **shared at root, per-book in `books/<slug>/`**. If you’re touching a story-specific artifact (one book’s primer, treatment, handoff, outline), it lives in that book’s folder. If you’re touching a continuity artifact (a character, a location, a cross-book decision), it lives at root. **A canon file never lives under `books/`**: a character who appears only in book 2 is still `characters/<slug>.md`, tagged with book 2 (§ Book tags on canon). The StoryStormer app refuses a canon, research, Manifest, Bible or entry file written under a book and names the root path.

## Path resolution in series mode

Every skill that reads or writes per-book files must resolve paths through the current-focused book.

The **current focus** is recorded in one place, the root `state.md` frontmatter: `current_focus: book-2`. The config holds no focus and no book list. In the StoryStormer app it is the series’ current book, one value shared with the app: the book switcher there and `current_focus` here move together, so read it fresh from the root `state.md` each session.

**Word targets are per book.** `state.md` owns the targets: the root `state.md`'s `target_word_count` is the default, and a book's own `books/<slug>/state.md` may carry its own `target_word_count` (the app stores a target per novel); absent means the book uses the default. Budgets always use the focused book's effective target, and switching focus never rewrites the root value. See `references/file-schemas.md` § `state.md` and § Target word count and the derived budgets.

In series mode, when a skill instruction says *"read `primer.md`"*, the actual path is `books/<current_focus>/primer.md`. When it says *"read `treatment.md`"*, the actual path is `books/<current_focus>/treatment.md`. Same for every per-book artifact.

Shared artifacts (`manifest.md`, `characters/*.md`, `decisions/`, `questions/`, `journal/`, etc.) are always at root regardless of focus.

### When you need to read a different book's artifacts

Sometimes you need to read a non-focused book's files — e.g., when working on book 2's treatment, you may need to check book 1's ending. This is permitted and explicit:

- `store.read` `books/book-1/treatment.md` directly (full path).
- Quote from it as you would any other source.
- Don't change `current_focus` for a read-only cross-book reference — focus only changes when the user is *working on* a different book.

### When the user signals a focus change

If the user says *"let's switch to book 2"*, *"I want to work on book 3 now"*, or otherwise signals a focus change, do one of:

1. **Suggest the slash command**: *"Use `/storystormer:switch book-2` to change focus."*
2. **Or inline as part of the next plan-first proposal**: *"Before I start, let me switch focus to book 2 — current_focus is currently book-1."* Then update the root `state.md`'s `current_focus` before doing anything else.

Both are fine. Pick based on the conversation's tempo — explicit command for a clear pivot, inline switch for a fluid conversation that's already in motion.

## Scoping decisions and questions

In series mode, every decision and every question carries a `scope` field. Values:

- `series` — applies to the series arc as a whole, or to more than one book.
- `book-<slug>` — applies to one specific book.

In the StoryStormer app the same scope is the record's novel: `book-<slug>` is the novel that book is, and `series` is a record with no novel (series-wide).

**The rule for every new entry:** any skill or command that creates a decision or a question in a series sets `scope`, and `affects_books` naming the books it touches (for `book-<slug>`, that one book), defaulting to the focused book and asking when the reach is unclear. A decision’s `integrated` is then the per-book list, a one-item list for a `book-<slug>` scope. (The app reads an entry with no `scope` as series-wide, so leaving it out is never a safe default.)

The scope is entry frontmatter (`references/file-schemas.md` § `decisions/`), and both indexes gain a Scope column, so a skill picks out one book's decisions or questions from the index alone. Examples:

```markdown
---
id: D-024
date: 2026-05-24
type: plot
scope: series
affects_books: [book-1 (ch 38), book-3 (ch 22)]
topic: Inauguration scene foreshadowing
source: brainstorm
integrated:
  - book-1 treatment yes (2026-05-24)
  - book-3 treatment no
storystormer_project: inauguration-day
storystormer_kind: decision
---

**Summary**: The inauguration scene in book 1 chapter 38 will plant visual elements (the missing aide, the deviation from protocol) that pay off as the assassination attempt in book 3 chapter 22.
**Details**: ...
```

```markdown
---
id: D-025
date: 2026-05-24
type: character
scope: book-1
topic: Maya's confrontation with her father
source: brainstorm
integrated:
  - book-1 treatment yes (2026-05-24)
storystormer_project: inauguration-day
storystormer_kind: decision
---

**Summary**: Maya confronts Senator Vance in book 1 chapter 35.
**Details**: ...
```

The `integrated` field becomes book-aware too — a series-scoped decision can be integrated into one book's treatment but pending in another's.

When in doubt about scope: **ask the user**. Don't default series-scope on a book-specific decision or vice versa; the scope determines which artifacts get refreshed when the decision is integrated.

### Status flow for series-scoped decisions

A series-scoped decision typically has integration pending across multiple books. Track each independently, one `integrated` item per book:

```yaml
integrated:
  - book-1 treatment yes (2026-05-24)
  - book-2 treatment no (waiting on Q-031 to resolve)
  - book-3 treatment no
```

When a `treatment-update` runs for book 2 and folds in the series-scoped decision, that book's item flips to `yes (date)` and the index row's Integrated cell follows (`book-1 yes; book-2 yes; book-3 no`). Other books' items remain.

## Character bios in series mode

One bio per character. The bio reflects the character's **full series arc** with per-book sub-arcs.

The character bio schema gets one additional section in series mode:

```markdown
## Story Role & Relationships

[Section 7 of the bio schema (`references/canon-schemas.md`), written for the whole series.]

### Series Arc

[~150–250w on the character's full arc across all books — where they start in book 1, what they become by the end of book 3.]

### Per-Book Sub-Arcs

**Book 1**: [~80–150w on what the character does and how they change in book 1.]
**Book 2**: [~80–150w]
**Book 3**: [~80–150w]
```

Which books a character appears in is the bio’s **`books:`** frontmatter (§ Book tags on canon), not a Quick Reference line. A bio scoped to one book (*Senator Vance, `books: [book-1]`*) tells `character-bio` to keep its arc to that book rather than fabricating roles in books 2 and 3. A planned appearance not yet settled (*“may return in book 3”*) stays prose in the bio; it is never a tag.

### When character canon evolves dramatically

If a character changes so dramatically across books that one bio can't usefully cover them (e.g., they die in book 1 but appear as a ghost/memory in book 3 with a different function), use the **per-book sub-arc** sections to capture the transformation. Don't fork the bio into multiple files — the character's identity is continuous even when their function changes.

The web app's "canon states" concept (point-in-time bio snapshots) is the deeper solution to this problem, but it's out of POC scope. For v0.3, the per-book sub-arc sections are enough.

## Book tags on canon

Every bio and worldbuilding entry in a series carries the books it appears in as `books:` frontmatter, a list of book slugs in the series’ order (`references/file-schemas.md` § Book tags on canon entries). **No `books:` key means the whole series**, which is the right state for an entry that runs through every book and for one whose books nobody has settled yet; `books: []` written to the StoryStormer app returns an entry to the whole series.

- **Evidence before a tag.** Before setting or changing `books:`, look for the entry in the manuscript: `store.search` for its name and each other name the entry gives it (a nickname, a title, a former name) where the binding has one, else the books’ treatments and every chapter’s outline, notes and prose (a manuscript just brought in may have prose and nothing else). A search hit is a candidate, not evidence: a store that also searches by meaning returns related passages that never name the entry, so confirm each hit by reading the passage for the name before counting it. Report what was found by book and chapter (*“Book 1: ch 3, 7, 12; Book 2: ch 1”*), and propose the list from that and from what the author says.
- **Never narrow the whole series by inference.** An entry without `books:` is only given a list when the author says so. A skill that finds an entry in a book its list lacks adds that book (with the author’s go); it never removes one. Removing a book, or narrowing a whole-series entry, is the author’s call.
- **Undecided stays prose.** *“Book 3: TBD”* or *“may return in book 3”* belongs in the entry’s text. There is no undecided value in the tag.

The bio’s old Quick Reference **Appears in** line is retired: skills stop writing it. An existing one is the author’s text and is left alone, but `books:` is the truth when they disagree, and the report says so.

## Manifest in series mode

The manifest is shared: one `manifest.md` per series, never one per book. Every entry, characters and worldbuilding alike, gets an `*Appears in: …*` line directly under its Status line, written from the entry’s book list and naming books by their number in the series’ `books` list: `*Appears in: books 1, 3*`, `*Appears in: book 2*`, or `*Appears in: all books*` for an entry with no `books:` (the app’s Manifest format; see `references/file-schemas.md` § `manifest.md`):

```markdown
## Characters

### Major Characters

**Maya Vance** — Protagonist / Congressional Staffer
Hill staffer who learns her father's office brokered the deal she is investigating; wants the truth out, fears what it costs him.
*Status: Canon Asset Created*
*Appears in: all books*

**Senator Vance** — Antagonist
Maya's father; protects the deal at any cost, dead by book 2.
*Status: Canon Asset Created*
*Appears in: book 1*

---

### Supporting Characters

**Dale Hartwell** — Chief of Staff
Senator Vance's fixer; outlives his boss.
*Status: Partially Developed*
*Appears in: books 1, 2*
```

The line follows the tag, never the other way round: an inventory entry with no canon file yet takes the books its manifest line names. When `manifest-sync` finds an entry in a book’s treatment that its tag lacks, it proposes adding that book to the tag (§ Book tags on canon), and the line follows once the author agrees; it never drops a book on the strength of one book’s treatment.

## The Series Bible (`series.md`)

`series.md` is the **Series Bible**: one document per series that says what the series is. It is the arc-level companion to the per-book primers and treatments. See `references/file-schemas.md` § `series.md` for the schema. In short:

- **Series Arc** — the protagonist's full trajectory across all books.
- **Series Theme** — the central question the series asks (often distinct from any single book's premise).
- **Per-Book Synopses** — one paragraph per book. In the StoryStormer app each is the book’s own synopsis, stored on the book and shown here; writing the section sets them.
- **Structural Conventions** — the shape every book keeps (POV rules, how books open and close, recurring devices).
- **Cross-Book Setups and Payoffs** — the chains that span books. The single most useful section for ongoing series work.
- **Continuity Concerns** — what the author is watching across books (ages, timelines, names, the dead staying dead).
- **Open Cross-Book Questions** — the open series-scope questions, listed from `questions/`. It is computed, never written: the StoryStormer app renders it from the entries and refuses a write that changes it, and on every other store it is rebuilt from the entries whenever the document is written.

**The entry test: the Bible states only what takes more than one book to say.** A fact about one book belongs in that book’s primer or treatment; a fact about one character belongs in the bio; a plant and its payoff in one book belong in that book’s treatment. The Bible holds the arc, the theme, the conventions, the chains between books and the continuity concerns, and nothing a single book could hold.

**A question is filed, never written into the Bible.** An open cross-book question is a question entry with `scope: series` (`file-schemas.md` § `questions/`); it reaches the Bible’s last section through the entry, and it is resolved or invalidated there, never by editing `series.md`.

### The feed rule

The Bible is read by **brainstorm sessions** (and any other conversation about the series), by **`treatment-update`** (the primer and the treatment), by the **book handoff** (`treatment-update`’s close-out) and by its **own upkeep**. It is never read for chapter-level or canon work: `pre-outline-session`, `outline-chapters`, `blueprint`, `prose`, `notes`, `canon-sync`, `manifest-sync`, `character-bio` and `worldbuilding-entry` do not load it. A series fact those skills need lives where they already look: a continuity fact the prose must respect goes into the character’s or the place’s canon entry, and a cross-book plant goes into the treatment’s narrative, stated where it is planted, which is how it reaches the spine, the outline and the page. When chapter-level work turns up a gap there (a plant the Bible places in this book that the treatment never states), the fix is a `treatment-update`, not a read of the Bible. There is no section-only read, so these skills never open `series.md` at all, not even for a book’s synopsis; a book with no treatment yet is summarized from its own primer, or the gap is stated.

### When to update the Bible

The Bible refreshes when:

- A series-scope decision lands that changes the arc, the theme, the conventions or a cross-book chain.
- A book’s treatment changes in a way that moves the series arc (book 1’s ending shifts, which changes book 2’s starting state).
- A new cross-book setup/payoff chain is identified.
- A book is closed out and its handoff names continuity the series must keep.

It does **not** refresh after every brainstorm session. It is a lower-frequency artifact than a treatment; patch the section a change touches, and leave the rest as it stands.

### Who updates the Bible

- **`brainstorm-session`** — when series material lands, offers to patch the sections it touches at the end of the session.
- **`treatment-update`** — when a book’s treatment refresh affects the series arc, surfaces it and recommends a Bible patch; it never edits the Bible itself.
- **Direct conversation** — *“refresh series.md to reflect what we’ve decided”* runs as a brainstorm-session patch.

**Integration.** Whether the Bible reflects a series-wide premise, theme, structure or plot decision is the decision’s own `integrated` item `series bible <state>`, beside its `<slug> treatment <state>` items (`references/file-schemas.md` § `decisions/`). A Bible patch marks each decision it brought in with `series bible yes` once the patch has landed, and the report names them. In the StoryStormer app the author can mark them on the Bible’s card as well.

## The book handoff (`handoff.md`)

When a book is finished, the author can **close it out**: `treatment-update`’s close-out mode writes `books/<slug>/handoff.md`, what the writer of the next book must know that they would otherwise get wrong: where the story stands, where each major and supporting character is at the end, the state of the world, the open threads and promises, and what the next book inherits (`references/file-schemas.md` § `handoff.md`). Chapter notes beat the outline where both exist, since they record what the prose committed. Open questions are never written into it: they stay entries, and the StoryStormer app lists the book’s open ones under a computed `## Open Questions`.

After the handoff, the close-out offers two carry-forward lists, and nothing moves without the author’s tick: each of the book’s open questions (move to the next book, make series-wide, or leave), and each character tagged for this book but not the next (add the next book to their `books:`, with the handoff’s suggestion of who continues). It may also propose continuity lines for the Bible, which `brainstorm-session` patches in.

The next book’s `pre-outline-session` and `treatment-update` read the previous book’s `handoff.md` as their starting state.

## Bringing a book into a series

A book that already exists, as a manuscript (`init`’s intake: *“add this manuscript as Book 3”*) or as a standalone project (`migrate` into a book of an existing series), becomes the series’ next book by these rules. Both skills follow them; neither restates them.

1. **A new book.** The book is appended to the root `state.md`’s `books` and gets its `books/<slug>/state.md` with its title and target. Its slug is the next unused one: read the existing slugs first and take `book-<N>` with N one past the highest number they use (slugs are stable, not positions, so after a book is removed a later book may already hold the slug its position would suggest). The current focus doesn’t move unless the author asks.
2. **Book files under the book.** Its primer, treatment, outline and chapters land under `books/<slug>/`, chapters numbered from 1 in the book’s own order.
3. **Canon is matched before anything is written.** Each incoming character and worldbuilding entry is compared with the series’ canon by its name and every other name either side gives it (in its own namespace: people against people, places against places). An exact match is proposed as **the same entry**; a near match (a spelling variant, a first name alone, a title instead of a name) is put to the author with both entries’ one-line summaries, never matched on a guess. The author confirms every row before the plan runs.
4. **Tag, never duplicate.** A confirmed match writes no new entry: the series’ entry gains the new book in its `books:` (an entry with no `books:` stays the whole series, never narrowed), and the incoming text is shown to the author as a proposed revision of the series’ entry, never written over it. An unmatched entry is created at the root tagged with the new book only. **Its chapter references name the new book:** every Revelation Log line (and any other `Ch N` the store resolves against the current book) is qualified with the new book’s number and the chapter’s number there, `Ch 3` → `Ch B3-02` when the source’s chapter 3 is the new book’s second, spans included (`Ch 3–5` → `Ch B3-02–04`); unqualified, it would attach to whichever book is current. A proposed revision of a matched entry carries its log lines qualified the same way.
5. **Entries are new, and their old numbers are rewritten.** Decisions, questions and journal entries come in as new entries (`store.write(path, content, new)`), so the store gives them the series’ next numbers; decisions and questions are scoped to the new book (a journal entry has no scope: it stays the series’ record of a session, and the app keeps no book on one). Two passes, never interleaved. **Number everything first:** create every decision, then every question, then every journal entry, each without the keys that point at other entries (`superseded_by`, `resolved_by`, a journal entry’s `decisions` and `questions` lists), and record each old → new number the moment the store reports it. **Then rewrite, from the complete map:** every entry’s body and those keys, and every `D-###` and `Q-###` the copied documents cite (treatment, outlines, notes, prose, journal text). Rewriting before every number is known would leave a citation pointing at an unrelated entry of the series. The report shows the map.
6. **What stays behind.** The incoming project’s manifest (a series has one; offer `manifest-sync` from the new book afterwards), its `series.md` if it had one, and its snapshots. A standalone source is never changed.

## Switching focus

The current focus changes via:

- **`/storystormer:switch <book-slug>`** — explicit slash command. Validates the slug exists in `books/`, updates `current_focus` in the root `state.md`, records the session (below), reports the new book’s state. In the StoryStormer app, the author’s book switcher moves the same value.
- **Inline in a skill's plan-first proposal** — if the user signals a focus change conversationally and a skill is about to fire, the skill switches focus as the first step of execution.

The switch is a small operation — the focus edit, the session record, and a state report. It changes no other content. Don't ceremony it.

## Series-level `state.md` vs per-book `state.md`

**Series-level state.md** (at `<root>/state.md`):

- `project_type: series`
- `current_focus: book-2`
- `books: [book-1, book-2, book-3]`
- `target_word_count`: the default for every book
- `slug`, `session_count` and `last_session`: the project's name and the one session counter, which numbers the shared journal
- `What Exists` section: lists the **series-level** artifacts plus a one-line status per book.
- `What's Next`: usually points to the current-focused book's `What's Next`, or to a series-level next step (e.g., *"refresh series.md after book 2 treatment lands"*).
- `Last Session`: two or three sentences and the session's journal entry path.

**Per-book state.md** (at `books/<slug>/state.md`):

- The standalone schema for one book — the book's `title`, `stage`, `target_word_count` only when the book has its own (absent means the series default), `What Exists` for *this book's* artifacts, `What's Next` for *this book's* work, and a `Last Session` naming the same root journal entry. No `slug`, `session_count` or `last_session`: sessions are the series'.
- `parent_series: <series-title>` field in frontmatter, pointing back to the root.

A skill working on book 2 reads `books/book-2/state.md` for its primary state, and may also read `<root>/state.md` for series context.

**Session bookkeeping goes to the root.** Every skill or command that writes `state.md` in a series follows one rule. The book's `state.md` takes the book's Summary, What Exists, What's Next and Last Session, and never carries `session_count` or `last_session`. The root `state.md` takes the session: on the session's first write, after the journal entry is created, its `session_count` and `last_session` are set (`references/file-schemas.md` § `journal/`), and its Last Session names that entry. The root's Summary, What Exists and What's Next are the series view, refreshed when the series-level picture changes (a book's stage moves, a cross-book decision lands, a closing protocol such as `brainstorm-session`'s), not on every per-book write.

## How the existing skills behave in series mode

All v0.2 skills work in series mode with **only path-resolution changes**. The skill bodies are unchanged in their core behavior:

- `init` — recognizes series intent during intake, scaffolds the series folder structure, asks the user for book slugs and titles. Can bring a manuscript in as the series’ next book (§ Bringing a book into a series).
- `brainstorm-session` — reads the focused book’s primer/treatment plus the Bible (`series.md`), `manifest.md`, and relevant character bios. Captures decisions with `scope`. Watches for cross-book triggers (a decision that affects another book) and offers a Bible patch at the end.
- `treatment-update` — operates on the focused book’s primer and treatment, with the Bible and the previous book’s `handoff.md` as constraints. Surfaces series-level impact in the report. Its close-out mode writes the book’s `handoff.md`.
- `character-bio` and `worldbuilding-entry` — read and write at root (shared), searching the manuscript before setting `books:`. Bios add per-book sub-arc sections.
- `manifest-sync` — operates on the shared `manifest.md`. Reads all books’ treatments; writes each `Appears in:` line from the entry’s `books:`.
- `canon-sync` — adds the book to an entry it finds in this book’s manuscript (§ Book tags on canon); never narrows one.
- `pre-outline-session` — operates on the focused book. Reads the focused book’s primer/treatment and the previous book’s `handoff.md`; cross-book plants come from the treatment’s narrative, never from the Bible.
- `outline-chapters` — operates on the focused book. Reads `books/<focus>/outline/structure.md` and writes `books/<focus>/chapters/chapter-NN/ch<NN>-outline.md`. A spine change that moves a chapter to another book moves its folder with `store.move`.
- `decisions` — creates decision entries in the shared `decisions/` with a `scope` field. Asks the user about scope when ambiguous.
- `migrate` — can bring a standalone project in as the series’ next book (§ Bringing a book into a series).

In each case, the *what to read* and *what to write* sections of the skill body apply as written; the only change is that per-book paths get prefixed with `books/<current_focus>/`.

## When NOT to use series mode

Series mode is for genuinely connected multi-book projects with shared continuity. It is **not** the right shape for:

- **A collection of unrelated short stories** — each is a standalone project. Don't force them into a series workspace.
- **A standalone novel with a planned sequel that doesn't exist yet** — start as standalone. Convert to series when the second book actually starts development. (Conversion is straightforward: move existing files into `books/book-1/`, create the series-level scaffolding, add book 2.)
- **An anthology or themed collection** where the stories don't share continuity — each is its own thing.

The friction added by series mode (current_focus management, scope tracking, path resolution) pays off only when there's enough shared continuity to make it worth the overhead.
