<!-- ABOUTME: Canonical schemas for every file the plugin reads or writes -->
<!-- ABOUTME: state.md, primer.md, treatment.md, manifest.md, the decisions/questions/journal entry collections, character bios, config -->

# File Schemas

Every file the plugin manages is human-readable markdown with optional YAML frontmatter. Files round-trip cleanly through both agent edits and manual user edits. When a user hand-edits a file, the agent must handle it gracefully on next read.

This document is the canonical spec. If a skill wants a field that isn't here, add it here first.

**The formats match the StoryStormer web app's.** Enum values, frontmatter keys, and section headings below are the app's own, so a project can move between the plugin and the app without translation. Where a key is plugin-only (version stamps, provenance), the app ignores it. When this file and the app disagree, the app's format wins and this file is the one to fix.

**Markup.** Every document the plugin writes is in the markdown profile, `references/markdown-profile.md`, on every backend (its body; frontmatter follows § Frontmatter values below), while text an author wrote stays as written except where it enters Notion, which normalizes it once on the way in (the profile’s § Scope).

## Frontmatter values (every file)

One quoting rule for every YAML frontmatter value the plugin writes: outlines, notes, prose, bios, worldbuilding entries, and the rest. A single-line value is written bare unless a YAML reader would misread it, in which case it is wrapped in double quotes, with `"` written `\"` and `\` written `\\`. Quote a value when it:

- contains `:` or `#` anywhere;
- starts or ends with a quote (`"` or `'`);
- starts with a YAML-special character: `-`, `?`, `[`, `]`, `{`, `}`, `*`, `&`, `!`, `|`, `>`, `%`, `@`, or a backtick;
- or would read as something other than text: `null`, `~`, `true`, `false`, `yes`, `no`, `on`, `off` (any case), or a number (`1984`, `3.5`, `1e3`, `0x1F`, `.inf`).

So *Ten: Countdown* is `title: "Ten: Countdown"`, *The Answer #7* is `title: "The Answer #7"`, and *1984* is `title: "1984"`. Values that are meant as numbers (`chapter: 17`, `version: 2`, `word_count: 1140`) and lists (`tags: [the bureau]`) are written as such; a text value that reads as a number is written quoted, so an outline's `act` alone is `act: "2"`, never `act: 2`. Read a double-quoted value by undoing exactly those two escapes. The app writes and reads its chapter notes with this rule and parses outline frontmatter the same way. Leading and trailing spaces are not part of a value: the app trims them on read and never quotes a value to keep them, so a value that needs edge whitespace cannot round-trip and is not written.

## `state.md` — living project dashboard

The agent’s dashboard of what the project is, where it stands, and what to work on next: now, just did, next. It is not a history. What happened in a session goes to that session’s journal entry (§ `journal/`), so `state.md` stays small enough to read whole at the start of every session. Updated after every significant action. The user can read this any time to see the current state, and can hand-edit What’s Next if they want to redirect.

`state.md` owns every project field the author sees (§ `.storystormer/config.json` keeps only what resolution needs).

```yaml
---
title: [working title]
genre: [primary]
genre_secondary: [optional, omit if not applicable]
project_type: novel | novella | short_story | screenplay | series
target_word_count: 120000                   # see § Target word count
logline: [one sentence, or null if not yet written]
stage: concept | brain-dump | brainstorming | treatment-drafted | treatment-refined | canon-development | outlining | outline-drafted
initial_maturity: concept | brain-dump | brainstorming | treatment-drafted | treatment-refined  # set once on intake, never changed
created: 2026-05-11
last_session: 2026-05-11
session_count: 1
surfacing_mode: active | on-request
# Series-mode only — present when project_type: series
books: [book-1, book-2, book-3]            # ordered list of book slugs
current_focus: book-1                       # which book the user is currently working on
---
```

`project_type` is one of the app's values: `novel`, `novella`, `short_story`, `screenplay`, or `series` (an older `short-story` reads as `short_story`).

The `books` and `current_focus` fields are **only present in series-mode projects**, on the series-level `state.md`. Standalone-novel projects omit them. See `references/series.md` for the full series workflow.

For a per-book `state.md` (at `books/<slug>/state.md` in series mode), the frontmatter is the standalone schema above, without `books` and `current_focus`, plus one field:

```yaml
parent_series: Inauguration Day            # title of the parent series
```

A per-book `title` is that book’s title. A per-book `target_word_count` is present only when the book has a target of its own; without one, the book uses the series-level `state.md`’s value (§ Target word count).

### Sections (in order)

Frontmatter, then exactly these four sections, and nothing else: no `## Previous Session`, no session log, no narrative that a journal entry or a document already holds. The whole file stays under about **4 KB**.

```markdown
## Summary

[3–5 sentences on where the project stands — what exists, what's strong, what's missing]

## What Exists

- **Primer** — v3 (2026-05-09), built from D-001..D-018
- **Treatment** — v7 (2026-05-10), built from D-001..D-018
- **Manifest** — v2 (2026-05-10), 4 characters, 2 locations, 1 organization
- **Character bios** — Marlowe (Protagonist, ~1700w), Alice (Supporting, ~700w), Bob (Minor, ~350w)
- **Worldbuilding** — Voss Industries (Organizations), the Heights (Locations)
- **Voice** — sample + style guide (or `README only` — the prose stage has no voice anchor until a sample exists)
- **Structure** — v1 (2026-05-12), based on Primer v3 + Treatment v7, 40 chapters planned, Save the Cat framework
- **Chapter outlines** — 12/40 drafted (Act 1 complete, Act 2 through ch 12), based on Structure v1
- **Prose chapters** — 6/40 written (ch 1–6); prose at `status: retired` is not counted
- **Decisions** — 18 total, 14 integrated into current treatment
- **Open questions** — 6 (2 critical, 3 important, 1 nice_to_resolve)
- **Storage** — this folder syncs through Dropbox (`~/Library/CloudStorage/Dropbox/Novels/the-good-dog`)

## What's Next

- **Active focus**: Marlowe's relationship to the antagonist (Q-019, critical)
- **Recommended next action**: Resolve Q-019 in a brainstorm session, then refresh treatment
- **Unintegrated decisions**: 4 new since last treatment update — propose `/storystormer:treatment-update` once Q-019 is decided

## Last Session

[2–3 sentences on what was worked on most recently — fresh context for the agent on resume.] Journal: `journal/2026-05-11-s07.md`.
```

- **What Exists** is one line per artifact: its version, date and counts, and nothing more. A line never explains what changed or why; that is the journal’s job.
- **What’s Next** holds forward items only, at most about five. An item that is done leaves the section; what was done goes into that session’s journal entry.
- **Last Session** is two or three sentences and the path of the session’s journal entry.

### Update rules

- **Carried lines:** a `- **<Label>** — …` line in What Exists whose label isn’t one of those above but names documents the project holds (`**Research**`, `**Handoff**`, `**Methodology**`) is the author’s: it is kept as written, after the computed lines, whenever What Exists is rewritten. A free paragraph or a sub-bullet in What Exists is not carried: a store or skill that recomputes the section (`migrate`, the Notion binding) drops it.
- The counts in **What Exists** are computed from the store (bios in `characters/`, entries under `worldbuilding/`, chapter files under `chapters/`, decisions and questions from `decisions/_index.md` and `questions/_index.md`), never carried forward from the last write. Recount whenever the line is rewritten.
- **Storage** appears in two cases, as the last line of What Exists (the root `state.md` in a series): a local project whose folder sits inside a sync service (`storystormer-init` § Where a new project lives), where it names the service and the folder; and the Dropbox hybrid, a Dropbox project with a `local_root` (`migrate` § The hybrid), where it says the folder is the synced copy of the Dropbox root (**Storage** — this folder is the synced copy of `/StoryStormer/the-good-dog` in Dropbox, at `~/Dropbox/StoryStormer/the-good-dog`). Whenever What Exists is rewritten in a session bound to the folder, recompute it from the folder’s current absolute path with the same check, so a folder moved out of a sync service drops the line; a session bound through the connector keeps the line as it stands; `migrate` sets it. Every other project omits it.
- **A new session** is the first write of a conversation: it bumps `session_count`, sets `last_session`, and creates that session’s journal entry (§ `journal/`). Every later write in the same session that changes Last Session also extends the same journal entry, so the two never disagree.
- Bumping a numbered version (primer / treatment / manifest / bio) → update the corresponding line in **What Exists**.
- Resolving a question → update **What's Next** to point to the next priority question.
- **Size:** when a write would take `state.md` past about 4 KB, the excess is history: move it to the session’s journal entry rather than trimming What Exists.
- Treating the user's What’s Next as suggestion — the user can ignore or hand-edit it. Never overwrite a user's hand-edit silently; if it conflicts with what the agent would write, mention the conflict in the next response.

### Series-level state.md

In series mode, the **series-level state.md** at `<root>/state.md` has the same four sections and the same budget, and its `What Exists` summarizes the *series*, not any single book. Example:

```markdown
## Summary

A political thriller trilogy. Book 1 is in late outlining (40/50 chapters drafted) and early prose (ch 1–6 written). Books 2 and 3 are in brainstorming — the trilogy's arc is being mapped to inform book 1's final 10 chapters and the planted setups in books 1–2.

## What Exists

- **Series document** — `series.md` v2 (2026-05-24), 6 cross-book setup/payoff chains
- **Shared manifest** — v4 (2026-05-22), 12 characters, 8 worldbuilding entries
- **Shared character bios** — 4 major-tier, 5 supporting, 3 minor
- **Shared decisions** — 47 total (32 series-scoped, 15 book-1-scoped, 0 book-2/3-scoped)
- **Book 1: Inauguration Day** — primer v6, treatment v9, outline 40/50 chapters, prose ch 1–6
- **Book 2: [TBD title]** — primer v1 (stub), no treatment, brainstorming
- **Book 3: [TBD title]** — no primer, brainstorming

## What's Next

- **Active focus**: book-2 (currently brainstorming the act-1 shape).
- **Recommended next action**: continue brainstorming book 2's premise; once Q-052 (book 2's central thematic question) is resolved, run `treatment-update` for book 2 in first-run mode.
- **Cross-book watch**: D-038 (Inauguration scene foreshadowing) is integrated into book 1 but pending for book 3 — revisit when book 3 brainstorming starts.

## Last Session

Brainstormed book 2's opening and logged D-046–D-048. Journal: `journal/2026-05-24-s12.md`.
```

Per-book state.md files at `books/<slug>/state.md` carry the standalone-novel sections, scoped to that one book; their Last Session names the same journal entry, since the journal is the series’ (§ `journal/`).

### Target word count and the derived budgets

`target_word_count` is the book's target length in words, owned by `state.md`. Set at init from the author's answer, or from the type's default below; change it whenever the author does. Every word budget in the workspace is computed from it. In a series the series-level value is the default for every book, and a book's own `state.md` may carry its own.

The one place the plugin's word budgets come from, matching the app's treatment pipeline:

| Project type | Default `target_word_count` | Default acts | Default chapters |
|---|---|---|---|
| `novel` | 120,000 | 3 | 40 |
| `novella` | 40,000 | 3 | 15 |
| `short_story` | 8,000 | 1 | 1 |
| `screenplay` | 30,000 | 3 | — |
| `series` (per book) | 120,000 | 3 | 40 |

- **Act budgets (the book):** a three-act structure splits the target **25 / 50 / 25**. Any other act count splits it evenly, unless primer §3's Structural Framework states weighted proportions, which then govern. For 120,000 words in three acts: 30,000 / 60,000 / 30,000.
- **Treatment budget:** `target_word_count / 6` in total (20,000 for 120,000), split across acts in the same proportions. No act's treatment runs more than 15% over its share; the share is a ceiling, not a target, so an act with thin decided material sits under it with its gaps marked.
- **Per-chapter treatment density:** `treatment budget / chapter count` (500 words for a 40-chapter, 120,000-word novel). The chapter count is read, in order, from `outline/structure.md`'s `**Chapter Count:**` header line (the app writes it; its leading number is the count), then the plugin's `target_chapter_count` frontmatter key, then the project type's default above. When the count is zero or unknown (a screenplay with no chapter count), density is `n/a`, as the app shows it; never divide by a missing count. It is a calibration signal for sizing treatment scenes, not a chapter assignment.

These numbers are computed whenever a skill needs them and never stored as a table in the primer. In a series they use the **focused book's** target (`current_focus`): that book's own `target_word_count` when its `books/<slug>/state.md` carries one, else the series-level value. Switching focus changes which book's target the budgets use and never rewrites the series-level value.

## `primer.md` — story craft dossier (five sections)

```yaml
---
version: 3
last_updated: 2026-05-11
built_from_decisions: [D-001, D-002, D-005, D-009, D-012, D-018]
---
```

The Story Primer is **50,000-foot front-matter** — the smallest set of load-bearing decisions that define what the story *is*. It defines *how* the story is told: its identity, moral argument, load-bearing reveal architecture, structural framework, writing rules, and character dynamics. Downstream agents (treatment writer, prose generators) read it for craft decisions, structural plans, and voice guidance. It is a short reference document, not a treatment and not an encyclopedia.

The Primer has **exactly five standard sections** — no more, no fewer. Every piece of primer content lives inside one of these sections. Total target length: **~4,500 words** across all five, with a hard ceiling of **5,000**. The Primer is a reference document, not an essay; concise specific statements beat expansive analysis. Keeping it small and stable is a feature — every downstream consumer that loads it whole pays as little as possible.

### The razor — content with another home is ejected, never absorbed

The primer holds only material with **no other home** in the workspace. Content that belongs elsewhere is dropped from the primer, not folded into a section:

- **Open questions** (unresolved story problems, "needs deciding" items) → an entry in `questions/`, not the primer.
- **Project-specific plot machinery** (named operations, invented technologies, faction charters, worldbuilding apparatus) → canon (`characters/`, `worldbuilding/`), not the primer.
- **Scene-level detail** (beat sheets, choreography, what-happens-next narrative) → `treatment.md`, not the primer.

Every primer rewrite is snapshotted (per `references/store.md`), so ejected content is never destroyed — it just stops riding along in the front-matter. Do not carry ejected content forward "just in case."

### Section 1 — Story Identity (800–1,200w)

Logline (1–3 sentences capturing the hook), primary genre and subgenre, 3–5 comparable works with brief explanations of the comparison (one bullet each, title in italics and no bold around it: `- *Olive Kitteridge* (Elizabeth Strout): linked lives in one small town`), target word count and what that implies for pacing/structure.

**Does NOT contain**: premise or moral argument (Section 2), character descriptions (Manifest), plot summary (treatment).

### Section 2 — Premise & Moral Argument (800–1,400w)

The central dramatic question the story asks, the premise/moral argument (what the story proves through events), core conflict architecture (the levels of conflict operating simultaneously), character thematic positions (how each major character embodies a different answer to the central question), thematic parallels and structural echoes between characters, and the load-bearing **Reveal Architecture** (subsection below).

**Reveal Architecture (subsection).** The story's *load-bearing* reveals — the central mysteries, secrets, and revelations whose timing is structural, the ones that reframe the story when they land. For each, state four things tightly: **what is hidden**, **where it plants** (the chapter, once a spine exists; `plant: TBD` before that), **when it is revealed** (which act / turning point, and the chapter once known), and **why it matters** (what the revelation reframes or proves). The plant chapter is what turns this subsection into the book's **chain register**: `outline-chapters` checks that every registered plant is present in its chapter's outline, and `blueprint` renders it as an imperative instruction. Admission requires all three of: **load-bearing** (the payoff fails without the setup), **long-range** (spans more than about two chapters), and **not self-evident** (would not be caught by reading adjacent chapters). A chain that has been planted *and* paid is **struck**, not archived; an unpaid chain at end of draft is a bug report, not a row. This is deliberately **not** a ledger of every planted setup and payoff — capture only the handful of reveals the architecture depends on; a story usually has **two to five**, and rarely more than fifteen. Ordinary foreshadowing and minor callbacks are the treatment's and the prose stage's job, and the per-chapter harvest in `ch<NN>-notes.md` is where found-not-foreseen payoffs get searched for. If a reveal's payoff is genuinely undecided, that is an **open question** — route it to `questions/`, do not park an unresolved item here. Plant chapters should be sourced from decisions and the spine, not re-inferred on each `treatment-update`, so they survive primer regeneration.

**Does NOT contain**: detailed character bios (Manifest), scene-by-scene narrative (treatment), writing technique specifications (Section 4), a running ledger of every setup and payoff (retired — capture only load-bearing reveals, above).

### Section 3 — Structural Framework (800–1,200w)

Act structure with approximate word counts and key turning points per act, POV strategy (which characters get POV, distribution, special rules), timeline structure (compressed present, flashback pattern, parallel timelines), pacing notes (where to accelerate, where to breathe, rhythm patterns), structural mechanisms (e.g., *"the recruitment sequence is the thematic engine"*).

Section 3 carries **no word-budget table.** The treatment's budget is computed on each run from `target_word_count` (see § Target word count and the derived budgets), exactly as the app does, so a stored table could only go stale. If the story wants weighted act proportions rather than the defaults, say so in prose here (*"Act 2 runs long: 60% of the book"*); the budget calculation honors it.

**Does NOT contain**: a word-budget table (computed, not stored), beat-by-beat scene breakdowns (treatment), detailed staging deliberations (state conclusions, not the analytical process), full scene choreography (treatment).

### Section 4 — Tone, Style & Writing Rules (800–1,200w)

Overall narrative voice description, tonal register (e.g., *"dark procedural realism with metaphysical unease"*), dialogue conventions for major characters, special narrative techniques unique to this story, standing writing rules and anti-patterns to avoid, genre-specific voice modulations.

**Does NOT contain**: character personality descriptions (Manifest), character-specific humor examples at scene level (summarize the register, don't write example scenes), full dramatic-irony analysis (state the approach in 1–2 sentences).

### Section 5 — Character Dynamics (400–800w)

Key relationship dynamics between major characters (alliances, conflicts, mentoring, mirroring), power dynamics (who has leverage over whom), faction/group structures and their internal fault lines, cross-faction tensions (character belongs to one group but loyal to another), secrets between characters that drive dramatic irony.

Use concise relationship descriptors — *"Marcus → Elena: professional rivalry masking mutual respect; he represents institutional loyalty, she represents reform"* — not prose paragraphs. This is a structural map of relationships (Truby's character web), not a narrative.

**Does NOT contain**: individual character descriptions (Manifest), character thematic positions (Section 2), full character backstory (`characters/*.md`).

### Header conventions

- `##` (H2) for each of the five standard sections: `## 1. Story Identity`, `## 2. Premise & Moral Argument`, etc.
- `###` (H3) for subsections within a section: `### Logline`, `### Central Dramatic Question`, `### Reveal Architecture`, etc.
- H1 (`#`) is reserved for the document title only.

Separate the five sections with `---` horizontal rules for visual clarity.

### Section budget summary

| Section | Target Words |
|---|---|
| 1. Story Identity | 800–1,200 |
| 2. Premise & Moral Argument (incl. Reveal Architecture) | 800–1,400 |
| 3. Structural Framework | 800–1,200 |
| 4. Tone, Style & Writing Rules | 800–1,200 |
| 5. Character Dynamics | 400–800 |
| **Total** | **~4,500 (hard ceiling 5,000)** |

If a section runs at or over budget, condensing is part of the pass — every section you touch is an opportunity to trim. Density matters more than coverage.

## `treatment.md` — full story treatment

```yaml
---
version: 7
last_updated: 2026-05-11
primer_version: 3
built_from_decisions: [D-001..D-018]
---
```

Body: prose treatment told in propulsive, present-tense **treatment voice** — see `references/treatment-voice.md`. Chronological structure organized by act → scene/sequence.

### Header conventions

- `##` (H2) for act-level divisions: `## Prologue`, `## Act One: The Impossible Threat`, `## Act Two: Escalation and Loss`, `## Act Three: Final Stand`.
- `###` (H3) for scenes or sequences within acts: `### The Walsh Assassination`, `### Nolan Investigates`, `### Team Formation`.
- H1 (`#`) is reserved for the document title only.

This hierarchy places act divisions at the same heading level as Story Primer sections (both H2), creating a consistent document structure across the project's canonical artifacts.

### Scenes are NOT chapters

Treatment scenes and sequences are *creative narrative units* — dramatic beats, set pieces, story movements. They are NOT chapter assignments. Do not assign chapter numbers, suggest chapter breaks, or constrain scene boundaries to chapter-sized units. A single treatment scene may span multiple future chapters; multiple short scenes may combine into one chapter.

Use descriptive, evocative scene headings:

- ✅ `### The Walsh Assassination`, `### Nolan Investigates On His Own`, `### Team Formation`
- ❌ `### Chapter 1: Walsh`, `### Chapters 3-5: Investigation`, `### Ch. 10`

### Markers for unresolved elements

Two marker types — both signal pending work and are replaced with developed content when subsequent decisions address the gap. Don't fake material to fill them.

- `[OPEN: Q-###]` — links to a tracked open question, `questions/Q-###.md`. Use when a specific question is logged and the treatment can't be written until it's resolved.

  ```markdown
  [OPEN: Q-014] — How does Marlowe discover the time loop? Possible: accidental activation by Voss's prototype; deliberate experiment by mentor; inherited device from her father.
  ```

- `[NEEDS DEVELOPMENT: …]` — for narrative gaps that don't yet have a tracked question. Use when story structure implies content that hasn't been brainstormed.

  ```markdown
  [NEEDS DEVELOPMENT: Elena's infiltration mechanics. We know she gets into Voss's compound by Act 3 — we don't yet know how. The treatment scaffolds the *what* but the *how* awaits brainstorming.]
  ```

### Length

The treatment's total length, its per-act split, and its per-chapter density are computed from `target_word_count`; see § Target word count and the derived budgets. They govern every treatment generation, first-run included (an unset target falls back to the project type's default).

The treatment does **not** duplicate the primer — they're read together when full context is needed. The `primer_version` field records which primer this treatment was built against; a primer refresh that bumps `primer_version` past the treatment's recorded value means the treatment may need an update pass.

## `manifest.md` — lean inventory

A structural index of every character and worldbuilding element, in the app's Manifest format (the Manifest Sync prompt's "Manifest Document Format", v1.4.0). Not a deep document: each entry is a name, a capped description, and a development status. The depth lives in the bios and worldbuilding entries; the manifest carries no file paths.

```yaml
---
version: 2
last_updated: 2026-05-10
treatment_version: 7
---
```

The frontmatter is plugin bookkeeping. The body below it is the app's document, verbatim in shape:

```markdown
# Manifest — The Pattern Recognition

*Last synced: 2026-05-10 · Source: Treatment Update*

---

## Characters

### Major Characters

**Marlowe Reyes** — Protagonist / Disgraced Forensic Accountant
Forensic accountant who missed Voss's fraud twelve years ago; wants it proven; her own guilt keeps her from asking for help.
*Status: Canon Asset Created*

---

### Supporting Characters

**Alice Chen** — Ally
Marlowe's former bureau partner; ambivalent, owes Voss a favor she hasn't disclosed.
*Status: Partially Developed*

---

### Minor Characters

**Doris Pruitt** — Informant
Diner regular who trades gossip for pie.
*Status: Mentioned*

---

## Worldbuilding

### Locations

**The Heights**
Gated suburb where Voss's compound sits; private security, one road in.
*Status: Canon Asset Created*

### Organizations

**Voss Industries**
Public-facing tech firm with a private fraud operation run from its compliance office.
*Status: Ready for Asset*

---

## Open Questions

1. **Does Alice know about the fraud before Act 2?** Determines whether her betrayal is a choice or a discovery; blocks Alice's bio.

---

*Manifest entries: 5 (3 characters, 2 worldbuilding) · 1 open questions*
```

**Entries.** A character is `**Full Name** — Role Label / Brief Archetype or Title` for major characters and `**Full Name** — Role Label` for supporting and minor; a worldbuilding entry is `**Entry Name**` alone. The description is one line under hard word caps: **major ≤30 words** (who they are, what they want, what blocks them), **supporting ≤20**, **minor ≤10**, **worldbuilding ≤20**. Every character is named (no "The CFO"); major and supporting characters carry first and last names.

**Status.** Every entry ends with `*Status: …*`, one of:

| Status | Meaning |
|---|---|
| **Mentioned** | Named, minimal detail; not enough for an entry yet |
| **Partially Developed** | Some details established, gaps remain |
| **Ready for Asset** | Rich enough, with a clear story function, for a full bio or worldbuilding entry |
| **Canon Asset Created** | A bio or worldbuilding entry exists (in the plugin: the file exists under `characters/` or `worldbuilding/`) |

The status replaces the old file pointers and "(no bio yet)" notes: "Canon Asset Created" says the file exists, anything lower says it doesn't.

**Sections.** Characters are grouped under `### Major Characters`, `### Supporting Characters`, `### Minor Characters` (the manifest's own roles, not the bios' `type`). Worldbuilding is grouped under `### <Type>` using the project's worldbuilding types, spelled as in the entries' `category`; the app's defaults are the fourteen in `references/frameworks.md` § Worldbuilding (Organizations · Locations · Geography · Objects · Vehicles · Weapons · Technology · Magic · Creatures · Culture · History · Religion · Languages · Lore), and a project's custom types are allowed. No sections outside the project's list. Omit any section with no entries, and omit `## Open Questions` when nothing is unresolved.

**Open Questions** are decisions the author hasn't made that block downstream canon or outline work (including uncertain merges and role reclassifications): flagged as a blockquote under the affected entry and collected in the numbered `## Open Questions` list. They are not brainstorming prompts.

**Footer.** The last line counts the document: `*Manifest entries: {total} ({X} characters, {Y} worldbuilding) · {Z} open questions*`.

**Series projects** add one line under every entry's Status line, characters and worldbuilding alike: `*Appears in: books 1, 2*`, naming books by their number in the series' `books` list. Standalone novels never carry it. See `references/series.md`.

## Entry collections — `decisions/`, `questions/`, `journal/`

Three records grow for the life of a project: the decisions, the open questions, and the history of sessions. Each is a **collection**: a folder holding one small document per **entry**. On a file store an entry is a file and its frontmatter is the columns; on Notion it is a row; in the app, a record. Every backend serves the same paths.

```
decisions/
  _index.md          # one table row per decision
  D-001.md
  D-002.md
questions/
  _index.md          # one table row per question
  Q-001.md
journal/
  2026-05-11-s01.md  # one entry per session; no index
```

Rules for all three:

- **Frontmatter is the structured part; the body is everything else.** The fields below are the frontmatter, quoted per § Frontmatter values. The body is in the markdown profile. Real logs carry more than any template (status prose, extra bold fields such as `**Resolves**:` or `**Note**:`, run-in bold paragraphs, free paragraphs, sub-lists, a second copy of a field): all of it stays in the body as written, in the order written. Nothing about an entry needs to fit the template to be kept.
- **Every entry carries two fields for views across the project**, such as an Obsidian Bases table: `storystormer_project`, the project’s slug (its Dropbox root folder name or Notion `Slug`; on a local folder, the kebab-case of the root `state.md` `title`), set when the entry is created and not rewritten if the title changes; and `storystormer_kind`, one of `decision`, `question`, `journal`.
- **Entries are never deleted.** A decision is superseded or retracted; a question is resolved or invalidated. Its file stays, its number stays reserved, and citations to it keep resolving (the app numbers entries by creation order and depends on this).
- **Numbers come from the store.** A new decision or question is written with `store.write(path, content, new)`, and the store reports the number it assigned, which may not be the one the skill proposed (`references/store.md` § Operations, New entries). The skill uses the reported number everywhere after: the index row, the journal entry, a question’s `resolved_by`, prose that cites it.
- **One small read per need.** Skills read an index to find entries and then read only the entries they need (the last ten decisions, the open questions, the IDs a document cites). Reading every entry is for `migrate` and audits, fanned out to subagents.

### `decisions/` — one decision per entry

`decisions/D-###.md`, one per settled choice. When two decisions conflict, the later one wins; the earlier one stays, with `superseded_by` naming the later one.

```markdown
---
id: D-018
date: 2026-05-11
type: character
topic: Marlowe's relationship to her father
source: brainstorm
integrated: no
storystormer_project: the-pattern-recognition
storystormer_kind: decision
---

**Summary**: Marlowe's father was an accountant murdered when she was 14; this is her unresolved Ghost.
**Details**: He had uncovered the early version of the Voss fraud and was killed for it. Marlowe was raised by her mother in the Heights, became a forensic accountant herself, and missed the same fraud years later when Voss had grown sophisticated enough to hide it. She doesn't yet know about her father's involvement at the start of the story.
**Affects**: Marlowe (protagonist), Voss (antagonist), the locket, Act 2 reveal
```

**Frontmatter:**

- **`id`:** `D-` and the number, zero-padded to 3 digits (`D-001`, `D-099`, `D-100`; 4 past 999). It matches the filename. Never reused. It is the plugin’s **display number**: the app and Notion keep their own record ids, and the number is the label.
- **`date`:** the day it was decided.
- **`type`:** one of the app's five: `plot`, `character`, `worldbuilding`, `structure`, `theme`. New entries write only these. An entry carried over from an older log keeps the word it was written with; readers take a retired word as its mapped type (the table after this list), and any other word (`premise`, `process`, `methodology`) as the closest of the five.
- **`topic`:** a short name for the decision, the label the index lists it under.
- **`source`:** what produced it. The plugin writes its workflow (`brainstorm`, `intake`, `treatment-update`, `user-declared`, `canon-sync`); the app writes its own values (`agent_tool`, `manual`, `decision_capture`, `sweep`, `canon_sync`), and a decision the plugin added to a connected project reads back as `plugin` because the app records the channel, not the workflow. Read every value in this list as valid, and keep any value an entry already has, qualifier included (`user-declared (init session)`). `canon-sync` (plugin) and `canon_sync` (app) are the same provenance.
- **`integrated`:** whether the current treatment reflects it. It starts with `yes`, `no`, `partially` or `n/a`, and may go on with a date or a short qualifier as written (`yes (2026-05-24)`, `n/a — governs future work`). Integration into anything else (`Integrated into structure: yes`) is a body field. In a series it is a list, one item per book the decision touches, in the form `<slug> treatment <state>` (below).
- **`superseded_by`:** the `D-###` of the later decision that replaces this one; omitted until one does. Prose about the supersession (`narrowed by D-052 for Act 3 only`) goes in the body.
- **`retracted`:** the date the author withdrew the decision with nothing replacing it; omitted otherwise. A retracted entry keeps its file and number (the app’s tombstone).

| Retired type | Read it as | Note |
|---|---|---|
| `setting` | `worldbuilding` | also retired in the app |
| `mechanics` | `worldbuilding` | the rules of a speculative mechanism are worldbuilding |
| `voice` | `theme` | voice, POV and tone choices; primer §4 still owns them (see `treatment-update`'s routing) |
| `genre` | `theme` | |

**Body:** `**Summary**:`, `**Details**:` (optional) and `**Affects**:` as bold-label fields, then anything else the entry carries, as written.

**Series mode** adds two fields, and `integrated` becomes book-aware:

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
  - book-3 treatment no (book 3 not yet drafted)
storystormer_project: inauguration-day
storystormer_kind: decision
---

**Summary**: The inauguration scene in book 1 chapter 38 plants visual elements that pay off as the assassination attempt in book 3 chapter 22.
```

`scope` is `series` (affects multiple books or the arc as a whole) or `book-<slug>` (one book; `integrated` then has the one item for that book). `affects_books` names the books, each optionally with where. In standalone-novel projects both are omitted and every decision is project-scoped. In the app, `book-<slug>` is the record's novel and `series` is a record with no novel. See `references/series.md` § Scoping decisions and questions.

### `decisions/_index.md` — the decision index

One table row per decision, every entry included (superseded and retracted ones too), sorted by ID. No frontmatter.

```markdown
# Decisions

| ID | Date | Type | Topic | Integrated | Superseded by |
|---|---|---|---|---|---|
| [D-017](./D-017.md) | 2026-05-10 | plot | The locket's origin | yes | [D-018](./D-018.md) |
| [D-018](./D-018.md) | 2026-05-11 | character | Marlowe's relationship to her father | no |  |
```

- **Integrated** shows the leading word of `integrated` (`yes`, `no`, `partially`, `n/a`); in a series, each book’s state as `book-1 yes; book-3 no`.
- **Superseded by** links the later decision, `retracted` for a retracted one, or is empty.
- **Series mode** adds a **Scope** column after **Type**.
- A topic holding a `|` writes it `\|` (the profile’s table cell rule).

### `questions/` — one question per entry

`questions/Q-###.md`, one per unresolved story problem. Its status changes in place; the entry is never removed.

```markdown
---
id: Q-014
date: 2026-05-11
priority: critical
category: Plot
title: How Marlowe finds the loop
status: open
source: plugin
storystormer_project: the-pattern-recognition
storystormer_kind: question
---

**Question**: How does Marlowe discover the time loop?
**Why it matters**: The inciting incident hinges on this. Without clarity, Act 1 beat 3 can't be written and the protagonist's agency in Act 1 is undefined.
**Possible approaches**:

- Accidental activation by Voss's prototype during a break-in
- Deliberate experiment by her mentor in the bureau
- Inherited device from her father, activated when she opens the locket

**Dependencies**: Marlowe's background, the rules of the time loop (Q-007), setting constraints
```

**Frontmatter:**

- **`id`:** `Q-` and the number, under the same rules as a decision’s.
- **`date`:** the day it was opened. An entry carried over from a log that never recorded one omits it rather than guessing.
- **`priority`:**
  - `critical`: blocks treatment progress; downstream work can't proceed without an answer.
  - `important`: affects multiple downstream elements; should be answered before the next treatment update.
  - `nice_to_resolve`: would improve the story but isn't blocking.
- **`category`:** one of the app's seven, in Title Case: `Story Structure`, `Character`, `Plot`, `Worldbuilding`, `Theme`, `Setting`, `Pacing`. Older plugin categories read as theirs: `structure` → `Story Structure`, `voice` and `genre` → `Theme`, `mechanics` → `Worldbuilding`, the rest the same word capitalized; any other word (`process`) as the closest. New entries write only the seven.
- **`title`:** required, 3–7 words naming the question, the label the app and the index list it under.
- **`status`:** `open`, `resolved` or `invalidated`. Any other wording an older log used (`half-resolved`, `open, but no longer unmechanised`) is read as the closest of the three, and its words stay in the body as written.
- **`resolved_by`:** the `D-###` that resolved it, set with `status: resolved`; also allowed on an invalidated question when a decision is what invalidated it. Omitted while it is open. This field is the one link between a question and the decision that settled it; a decision’s `**Resolves**:` line, where an older entry has one, stays in its body as written.
- **`source`:** one of the app's values (`decision_capture`, `treatment_update`, `manual`, `ai_marker`, `question_triage`, `agent_tool`, `ingestion`) or `plugin`. The plugin writes `treatment_update` for a question `treatment-update` logs, `ingestion` for one `storystormer-init` extracts from intake materials, `manual` for one the user dictates through `/storystormer:questions add`, and `plugin` for any other skill (`brainstorm-session`, `pre-outline-session`, `outline-chapters`, and so on). A question that came from the app keeps its value.

**Body:** `**Question**:`, `**Why it matters**:`, `**Possible approaches**:` (a list), `**Dependencies**:`, and, once there is something to say about where it stands, `**Resolution**:`: the answer (for a resolved question), the reason (invalidated), or the progress so far (`midpoint candidate identified, act climax undecided`). Then anything else the entry carries, as written.

**Series mode** adds `scope` (`series` or `book-<slug>`) and `affects_books` to the frontmatter, as for decisions:

```yaml
scope: series
affects_books: [book-1 (ending), book-2 (opening)]
```

In standalone-novel projects both are omitted. As with decisions, `book-<slug>` is the app record's novel and `series` is a record with no novel.

### `questions/_index.md` — the question index

One table row per question, every status included, sorted by ID. No frontmatter. A skill looking for open questions filters this table and reads only those entries.

```markdown
# Open Questions

| ID | Priority | Category | Title | Status | Resolved by |
|---|---|---|---|---|---|
| [Q-007](./Q-007.md) | important | Worldbuilding | The rules of the loop | resolved | [D-023](./D-023.md) |
| [Q-014](./Q-014.md) | critical | Plot | How Marlowe finds the loop | open |  |
```

**Series mode** adds a **Scope** column after **Category**.

### Who rebuilds an index

`decisions/_index.md` and `questions/_index.md` are **stored** on file stores and **computed** where the binding says so (`references/store.md` § Local-mode clauses). A stored index is regenerated whole from the entries, never patched by hand:

- **By the writing skill,** after every entry it creates or changes, in the same run.
- **By any skill that finds the index behind its entries:** a listing that shows an entry the index lacks, or an entry whose frontmatter disagrees with its row. An author editing entries directly (in Obsidian, in a Bases view) changes the entry and not the index, so the entry is always the truth and the index is rebuilt from it.

### `journal/` — one entry per session

`journal/<YYYY-MM-DD>-s<NN>.md`: the session’s date and its number (`session_count` in `state.md` after this session’s bump), zero-padded to 2 digits (3 past 99). It records what a session did and why, so `state.md` doesn’t have to.

```markdown
---
date: 2026-05-11
session: 7
skills: [brainstorm-session, decision-capture, treatment-update]
decisions: [D-017, D-018]
questions: [Q-014, Q-019]
source: plugin
storystormer_project: the-pattern-recognition
storystormer_kind: journal
---

Worked through Marlowe's backstory. The author settled that her father was murdered for uncovering the early Voss fraud (D-018), which superseded the locket's origin in D-017 and opened Q-019, how much Marlowe knows at the start.

Refreshed the treatment to v7 with D-001..D-018. Act 2's reveal now turns on the father; Q-014 is still open and blocks Act 1 beat 3.
```

- **Frontmatter:** `date`; `session` (the number in the filename); `skills`, the skills that wrote during the session; `decisions`, the IDs logged or changed; `questions`, the IDs opened, resolved or invalidated; `source`, `plugin` for an entry the plugin writes and `app` for one the app writes from its own chat sessions; and the two `storystormer_*` fields. Lists are empty (`[]`) when nothing applies.
- **Body:** a short narrative, in the profile, of what was done and why: the choices made and the reasons, what changed in which documents, what was left open. It is where a finished What’s Next item goes, and where the detail that `state.md` no longer carries lives.
- **Created by the session’s first write,** with `store.write(path, content, new)`. If the path already exists (another surface already holds that session number), re-read `state.md` and take the next number.
- **Extended, never rewritten whole,** by every later step in the same session: `store.edit` adds the step’s paragraph after the last one and adds its IDs and skill to the frontmatter lists. An entry from an earlier session is never changed.
- **No index.** Filenames sort by date and session, so the listing is the index. A skill wanting recent history lists `journal/` and reads the newest few entries. Nothing reads the journal by default, and it is never pruned.
- **Series mode:** one journal at the root, like the decisions; a per-book `state.md`’s Last Session names the root entry.

### The old layout

A project whose config has no `layout` key (§ `.storystormer/config.json`) predates the collections. It keeps the decisions in one `decisions.md` and the questions in one `questions.md` at the root (in a series, the root too): each opens with a heading (`# Decisions`, `# Open Questions`; optional frontmatter and preamble), then entries headed `## D-### · <date> · <type>` or `## Q-### · <priority> · <category>`, sometimes with a suffix (` ✅ RESOLVED`), each followed by `**<Label>**:` fields (`Topic`, `Summary`, `Details`, `Affects`, `Source`, `Integrated into treatment`, `Superseded by`; `Title`, `Question`, `Why it matters`, `Possible approaches`, `Dependencies`, `Source`, `Status`) and whatever else its author wrote. Its `state.md` may carry session history (a `## Previous Session`, narrative in What Exists and What’s Next), and its config mirrors `state.md` fields. `migrate`’s layout upgrade converts it in place (`references/store.md` § Resolve, The layout).

## Character bio files (`characters/<slug>.md`)

The file's slug is the kebab-case of the character's full `name` (`marlowe-reyes.md` for Marlowe Reyes, never a short form such as `marlowe.md`); the app derives the file name from the title the same way and renames the file when the title changes, so a reference to a bio by path is only as stable as the name.

```yaml
---
name: Marlowe Reyes
type: Protagonist
tags: [POV character, the bureau]
version: 2
last_updated: 2026-05-11
manifest_version: 2
treatment_version: 7
---
```

- **`name`** is the character's display name. The app calls this field `title`; the value is the same.
- **`type`** is one of the project's **People types**. The app's default list is `Protagonist`, `Antagonist`, `Major`, `Supporting`, `Minor`; a project may rename or extend it (the app's settings can swap in other lists), so use the project's list when it has one. It replaces the retired `tier:` key; read an old `tier: major | supporting | minor` as `type: Major | Supporting | Minor`.
- **`tags`** is optional; see § Tags on canon entries.
- Values are quoted per § Frontmatter values.

**The body contract lives in one place:** `references/canon-schemas.md` § Character Bio Schemas, sections 0–7 (Quick Reference, Essential Identity, Physical Presence, Voice & Mannerisms, Psychology & Personality, Background & Family, Social Context & Lifestyle, Story Role & Relationships), with the per-section budgets, the Supporting and Minor variants, writing rules, and a worked example. For the framework vocabulary (McKee, Truby, Egri, Weiland, Voice Fingerprint, Thematic Posture) see `references/frameworks.md`.

**Bio depth is a writing choice, not a field.** `canon-schemas.md` defines three depths: **Major** (~1,400 words standard, up to ~1,900 Extended for POV protagonists, primary antagonists, and characters carrying the thematic load), **Supporting** (~700), **Minor** (~350). By default the type picks the depth: Protagonist, Antagonist, and Major get the Major schema; Supporting and Minor get theirs. A custom type takes the depth its prominence in the story earns. The skills still say "tier" for this depth; it is never written to the frontmatter.

A bio may also carry an optional **`## Revelation Log`** as its final section — a chapter-keyed, append-only list of state changes (injuries, deaths, allegiance shifts, reader-facing reveals) that make the character scene-current at a given chapter. See `references/canon-schemas.md` § Revelation Log. The `blueprint` skill reads it, filtered to `chapter ≤ N`, to fuse current state into a chapter's brief.

## `characters/_index.md` — bio index

A one-line-per-bio list of `characters/`, regenerated whenever a bio is written (where the binding computes it, it is rendered instead). No frontmatter. Sorted by `name`:

```markdown
# Characters

- [Marlowe Reyes](./marlowe-reyes.md) — Protagonist · POV character, the bureau
- [Ada Voss](./ada-voss.md) — Antagonist
```

Each line is the bio's `name` linked to its file as `./<slug>.md` (a bare filename target reads as a web domain in Notion), ` — ` and its `type`, then ` · ` and its `tags` comma-separated when it has any.

## Worldbuilding files (`worldbuilding/<type-slug>/<slug>.md`)

Each entry has a **worldbuilding type** from the project's list. The app's fourteen defaults are in `references/frameworks.md` § Worldbuilding: Organizations, Locations, Geography, Objects, Vehicles, Weapons, Technology, Magic, Creatures, Culture, History, Religion, Languages, Lore. The list is editable per project, so a project may use others.

- **Folder:** the kebab-case slug of the type name: `locations/`, `organizations/`, `magic/`, `languages/`, and for a custom type such as "Star Systems", `star-systems/`. Never an invented plural (`magic-systems/`, `cultures/`).
- **`category`:** the type name verbatim, as the app spells it (`Locations`, not `location`). The app stores the type in a field of the same name.
- **Entries in an old folder.** Workspaces from 0.16.x and earlier may hold entries under folder names the rule no longer produces (`magic-systems/`, `cultures/`, singular `location/`). Before creating an entry, look for it by slug and `name` under **every** folder in `worldbuilding/`, not just the one the rule points at, so an old entry is never duplicated. An entry found in an old folder stays readable where it is; on its next write, move it to the rule's folder (snapshot first), set `category` to the type name, and say so in the report. Remove an old folder only once it is empty.

```yaml
---
name: The Heights
category: Locations
tags: [Voss holdings]
version: 1
last_updated: 2026-05-10
---
```

`name` is the app's `title`, as for bios. `tags` is optional; see § Tags on canon entries. Values are quoted per § Frontmatter values.

Body follows one of two formats — **Reference Note** (~200–300w) for real-world elements with story-specific modifications, or **Full Entry** (~300–1,000w depending on type) for invented elements. For section structures, length targets per type, type-specific guidance, and a worked example, see `references/canon-schemas.md` § Worldbuilding Entry Schemas. For the tier framework (Full Canon entry / Reference note / No entry needed) and character-vs-worldbuilding disambiguation, see `references/frameworks.md` § Worldbuilding.

Like character bios, a worldbuilding entry may carry an optional **`## Revelation Log`** as its final section — chapter-keyed state changes for the element (a location damaged in ch 20, a device that gains a new capability in ch 14). Same mechanism and rules as for characters; see `references/canon-schemas.md` § Revelation Log.

## Tags on canon entries

Bios and worldbuilding entries may carry an optional `tags:` list in their frontmatter, under the app's tag rule:

- **Lowercase, with spaces** (`the bureau`, not `The_Bureau`). A hyphen inside a tag is kept (`sci-fi`, `FBI-agent`); an underscore becomes a space. A short all-caps word of two to four letters keeps its capitals (`POV character`, `FBI informant`, each hyphen-separated part judged on its own).
- **Reuse the project's tags first.** Before inventing one, scan the tags already on bios and entries and take the existing spelling.
- **At most 40 characters** per tag; the app drops a longer one rather than truncating it.
- **At most three per entry when the plugin chooses them**, and only tags that **group more than one entry**; this is the generation rule, not a storage limit. An entry that already carries more tags (the author's, or the app's, whose own list can be longer) keeps them: never drop or respell an existing tag to fit this rule. an affiliation (`the bureau`), a story role or archetype (`mentor`), an era (`before the war`), a story status (`dead by act 2`).
- **Never** the entry's own type (`Protagonist`, `Locations`), a name, a relationship (`Marlowe's sister`), or provenance (`ai generated`, `from intake`).

Tags are optional; no tags is better than a tag that groups nothing. The app normalizes every tag on write in any case.

## Voice assets (`voice/`)

The `voice/` folder holds the two **project-owned voice inputs** the `prose` skill reads to condition output toward the author's voice (the third input, the operational prose prompt, is plugin-owned — `references/prose-spec.md`). Both are plain markdown, both optional, both user/author-authored. The folder and its `README.md` are scaffolded by `storystormer-init` (the README explains both files and the read order; it is the warning that a project has no voice inputs yet). The two input files are created by the author, or placed by init when intake materials clearly contain them; never stubbed, because downstream skills key on their existence; never auto-generated from AI prose.

```
voice/
  README.md           # scaffolded at init — what the two files are and the read order
  style-guide.md      # user-authored craft preferences — "how it should read"
  writing-sample.md   # the author's own non-AI prose — "what the voice is, by example"
```

- **`voice/style-guide.md`** — a list of stylistic preferences: sentence construction, vocabulary/register, dialogue craft, interiority, atmosphere, and **anti-patterns** ("never write 'a breath he didn't know he was holding'"). No fixed schema — prose, bullets, whatever the author keeps. Different projects carry different guides. Optional; when absent, craft rules fall to the prose spec.
- **`voice/writing-sample.md`** — a representative passage of the author's **own, non-AI** writing — the aspirational target voice. Plain prose (optionally a one-line note on what it exemplifies). **Strongly recommended**: it is the voice north-star and the *only* anchor on a POV character's debut chapter (where there is no prior POV prose). The author may keep more than one; `voice/samples/*.md` is a fine alternative when several are kept.

These are **not** part of the spoiler firewall — they're craft inputs, not story chronology — so they load on every generation regardless of which chapter is being written. See `references/prose-spec.md` § The three-input voice model.

## Chapter content — folders, the spine, and the outline view

Chapter content is organized **entity-first**: one folder per chapter (`chapters/chapter-NN/`) holds *every* artifact for that chapter — its outline, blueprint, prose, and refinement notes — as the chapter moves through the pipeline. The cross-chapter **spine** lives one level up, in `outline/`. This is the contract every chapter-stage skill (outlining now; blueprint, prose, and refinement when they land) reads and writes against.

Two layers:

- **Book-level spine** (`outline/`) — the macro plan, shared across all chapters:
  - **`outline/structure.md`** — the structural commitment, in the app's pre-outline format: structure notes (framework, act table, POV, pacing), then the chapter spine, one short block per chapter.
  - **`outline/_index.md`** — the **outline view**: a chapter × stage status matrix, one row per chapter, regenerated as chapters advance. This is the horizontal scan surface.
- **Per-chapter content** (`chapters/chapter-NN/`) — the micro layer, one folder per chapter:
  - **`ch<NN>-outline.md`** — the author's prose account of what happens in the chapter (typically 500–1,500w per 3,000-word chapter). Frontmatter plus a flowing body; no scaffolding.
  - **`ch<NN>-blueprint.md`**, **`ch<NN>-prose.md`**, **`ch<NN>-notes.md`** — the continuity brief, the prose, and the post-prose record (see § `chapters/` folder).
  - **`.history/`** — co-located snapshots of this chapter's artifacts, where the binding's `history` is `snapshots` (`references/store.md`).

### Why entity-first, and the naming rule

The macro/micro split is deliberate. `outline/structure.md` is the contract a chapter's `ch<NN>-outline.md` fulfills — a stable spine the user agrees to once, then each chapter folder fills in against it. Keeping a chapter's outline next to its blueprint, prose, and notes means the dominant downstream workloads (prose generation, refinement) gather one chapter's full context from a single folder, and adding a new stage is a new *file*, never a new parallel top-level tree.

**Files inside a chapter folder are chapter-number-prefixed:** `ch<NN>-<stage>.md` — `ch` + the same zero-padded number as the folder + the stage. So `chapters/chapter-17/ch17-outline.md`, `chapters/chapter-08/ch08-prose.md`, `chapters/chapter-21/ch21-blueprint.md`. The prefix is what keeps files self-identifying when viewed flat or referenced via `@` in Claude Code — `outline.md` repeated across 40 folders is invisible; `ch17-outline.md` is not. The folder gives the hierarchy; the prefix gives flat-identifiability.

The horizontal scan that *outlining* needs (read every chapter's outline at once, check continuity seams) is preserved through `outline/_index.md` and recursive globs (`chapters/*/ch*-outline.md`).

### `outline/structure.md` — structural commitment

`structure.md` **is the app's pre-outline document**: the same header lines and the same `### Chapter N: Title` blocks the app's Story Architect writes and its pre-outline parser reads, so the file and the app's Pre-Outline asset are one document. The plugin's structural reasoning (framework, act table, POV strategy, pacing, open questions) rides along as a leading `## Structure Notes` section that the app's parser skips.

```yaml
---
version: 1
last_updated: 2026-05-12
primer_version: 4
treatment_version: 8
target_chapter_count: 40
framework: save-the-cat | seven-point | truby-22 | three-act | story-circle | freytag | custom
---
```

The frontmatter is plugin bookkeeping. The body:

```markdown
# Pre-Outline: The Pattern Recognition

**Structural Approach:** Save the Cat, fifteen beats over three acts
**Chapter Count:** 40 chapters (40 new, 0 existing)
**POV Mode:** single · **POV Characters:** Marlowe Reyes · **Narrative Person:** close third, past tense
**Generated:** 2026-05-12

---

## Structure Notes

### Framework Choice

[~150–300w: which framework, *why this story uses it* (drawing from primer Section 3 if it commits to one), and any deviations from the canonical beat positions. If the primer's Structural Framework section already commits to a framework, preserve that choice and explain how the spine implements it; don't second-guess the primer.]

### Act Structure

| Act | Chapter Range | Treatment Source | Target Words | Beat Anchors |
|---|---|---|---|---|
| 1 — Setup | 1–10 | Prologue + Act One | ~30,000 | Opening Image (ch1), Inciting Incident (ch3), Plot Point 1 (ch10) |
| 2 — Fun and Games | 11–30 | Act Two | ~60,000 | Fun & Games (ch11–17), Midpoint shift (ch18), Bad Guys Close In (ch19–29), All Is Lost (ch30) |
| 3 — Resolution | 31–40 | Act Three | ~30,000 | Dark Night (ch31), Break into 3 (ch33), Climax (ch37–39), Final Image (ch40) |

[Target Words come from § Target word count and the derived budgets: the act's share of `target_word_count`. Chapter ranges are inclusive on both ends. A two-half middle act (the old 2A / 2B) is described in Beat Anchors, not given its own act number.]

### POV Strategy

[~100–200w: who has POV, how often, special rules. If the primer specifies POV strategy, mirror it. Note any chapter-level POV assignments that diverge from the default.]

### Pacing Notes

[~100–200w: where the story accelerates, where it breathes, rhythmic patterns. Anchor to specific chapter ranges.]

### Open Structural Questions

- Q-014 unresolved — affects ch3 (inciting incident mechanism) and ch18 (midpoint payoff).
- Q-019 unresolved — affects all Act 3 chapter outlines.

---

### Chapter 1: The Auditing Room

**Status:** new
**POV:** Marlowe Reyes
**Act:** 1 — Setup
Marlowe arrives late to her own swearing-in at the county courthouse, and the reader meets her competence signature: she reconciles a vending-machine receipt in her head while the judge waits. She catches the bailiff's watch running four minutes fast and says so. The Heights sits on the ridge above town, and she does not look at it. (Hook)

---

### Chapter 2: The First Crack

**Status:** new
**POV:** Marlowe Reyes
**Act:** 1 — Setup
…

---

### Chapter 40: Final Image

…
```

**The chapter blocks are the chapter spine** (skills call each block a *spine slot*). One block per chapter number, ascending, no gaps, each with exactly these lines, in this order:

- **`### Chapter N: Title`** — this exact heading form, with `N` a whole number from 1 to 1000 (the app's bound). The title is a creative mnemonic (*The Locket*, not *Midpoint*).
- **`**Status:**`** — exactly one of `new`, `existing (outlined)`, `existing (drafted)`, `re-outline`. It records each chapter's state when this document was written, on the first write and on every revision alike: `existing (drafted)` for a chapter that already has a prose file, `existing (outlined)` for one with an outline file but no prose, `new` only for a chapter with neither, and `re-outline` only for a chapter the author asked to have re-outlined. This matters to the app: its outline planner skips a `new` block whose chapter already has prose, and derives an outline from prose only for an `existing (drafted)` block. `pre-outline-session` sets it on every write; no other skill edits it.
- **`**POV:**`** — the POV character's name.
- **`**Act:**`** — the act **number**, optionally followed by a dash and the act's title: `2 — Fun and Games`, or just `2`. The app reads the number and title from this (it also accepts `Act II: Fun and Games` and `Act Two`, which is how the app writes it). Never `2A` or `2B`: those read as a title with no act number.
- **The entry** — a new or re-outline chapter gets 60–100 words: two to four sentences on what happens and what changes, with optional tags such as `(Foreshadow → Ch 30)`, `(Payoff ← Ch 2)`, `(Hook)`, `(Theme)`, and any `[OPEN: Q-###]` or `[NEEDS DEVELOPMENT: …]` marker the slot carries. An existing chapter gets one or two sentences drawn from what is already written.

**Parser rules the plugin must keep** (the app reads this file with them): the `## Structure Notes` section must come **before** the first chapter block, because any `##` heading after the chapters begin ends the chapter list; and no heading inside Structure Notes may start with `### Chapter`, which the parser takes for a malformed chapter block. The app's own optional closing sections (`## Story Architecture Notes`, `## Commentary`) may follow the last block; the plugin doesn't write them, and keeps them if present.

The chapter spine is the load-bearing element. The pre-outline conversation produces it; chapter outlines hang off it.

### `chapters/chapter-NN/ch<NN>-outline.md` — per-chapter outline

Lives in the chapter's folder, prefixed with the chapter number: `chapters/chapter-17/ch17-outline.md`. Folder and prefix both use the two-digit zero-padded chapter number; a number past 99 is written as it is (`chapter-100`, `ch100-outline.md`), which is how the app names them, so a long book mixes two-digit and three-digit names.

**What it is:** the author's prose account of what happens in the chapter, to be expanded into full narrative prose. **Nothing else.** It is the only artifact in the pipeline that carries the author's voice, and it is read by the prose agent as *the task* and by the `blueprint` stage as *the content*. It may include specific action beats, interiority, direction, and dialogue, up to and including every line of dialogue in the chapter. It is written the way the author thinks, not to a schema.

```yaml
---
chapter: 17
title: The Locket
pov: Marlowe Reyes
act: 2 — Fun and Games
summary: Marlowe finds her father's locket in the audit box and recognizes the engraving from Voss's office.
authorship: ai_generated        # author_written | ai_generated | ai_generated_author_revised
version: 1
last_updated: 2026-05-12
word_count: 1140
source: treatment §Audit Box + D-031
revision: >-
  free-text note on what changed and why
structure_version: 1
treatment_version: 8
primer_version: 4
---
```

```markdown
[the author's prose account, and nothing else]

## Synopsis

[150–250 words, generated outlines only: see below]
```

**The first five keys are the app's outline contract**, in its order: `chapter` (a whole number), `title`, `pov` (the POV character's name, blank for a book without one), `act` (text, in the same form as the structure document's `**Act:**` line: `act: 2 — Fun and Games`, or the number alone written quoted, `act: "2"`, per § Frontmatter values; never `2A`), and `summary` (one or two sentences: the chapter's core event and turning point). All five are present on every write; `chapter`, `title`, and `summary` must have values, and `chapter` is a whole number from 1 to 1000 (the app's outline parser rejects anything outside that range). Values are quoted per § Frontmatter values.

The rest are plugin keys the app ignores:

- **`authorship`** (the app's three values, which the app also stores): `author_written`, `ai_generated`, `ai_generated_author_revised`. It drives how `outline-chapters` treats the file. `author_written` and `ai_generated_author_revised` put the skill in **correction-only mode** (facts, POV breaches, stale scaffolding, surfaced sequencing errors; never rhythm, diction, or regeneration). `ai_generated` is freely regenerable. The skill sets `ai_generated_author_revised` when it detects the body changed outside a skill run (the body's actual word count against the `word_count` the last skill write recorded, and where it helps the body against the newest version `store.history` returns; a mismatch is author revision, since correction-only is the safe side) and never downgrades `author_written`. Older files spell these with hyphens (`author-written`); read them as the same values and write the underscore form.
- **`version`**, **`last_updated`**: the file's version and date, as on every plugin artifact.
- **`word_count`** is the body's count (frontmatter and `## Synopsis` excluded), recorded on every write; it is the cheap half of author-revision detection.
- **`source`** names what the outline was built from (a treatment scene, a decision, the author).
- **`revision`**: a free-text note on what changed and why.
- **`structure_version`**, **`treatment_version`**, **`primer_version`**: the provenance stamps `/storystormer:outline` uses to flag stale outlines. An outline the app wrote has none; a missing stamp means the freshness is unknown, which is reported as unverified, never as stale or current.

POV type and tense are not outline keys; they live on the prose (`pov_type`, `tense`), as they do on the app's scene.

**Body.** The author's prose account, with no H1 (the title lives in the frontmatter, and the app's outline has none; an H1 already in an author's file is left alone). Present tense is the recommended register for generated outlines, not a rule: an author-written outline in past tense stays in past tense and is never rewritten for tense. The app's own outline jobs refuse an outline body under 150 words, and a connected write warns about one, so a stub outline is not ready to move to the app.

**`## Synopsis`** is the one heading an outline may carry, and only at the very end. Generated outlines end with it (the app's chapter writer produces the same shape): 150–250 words on the chapter's causal events, reveals, who learns what, and how the story's state has changed by the chapter's end, written as a record for later chapters, not a teaser. It replaces repeating that material in `summary`, which stays one or two sentences. An author-written outline gets a synopsis section only if the author asks for one.

The section is the **writer shape**, not how the app stores it. The app keeps the synopsis separately, on the chapter (`chapters.synopsis`): on write it strips the trailing `## Synopsis` from the outline body and saves the text there, and when it hands the outline back as a file it renders the section at the end again. The plugin's file keeps the section either way; nothing about the format changes.

**What the outline does not carry**, because the Blueprint derives it from canon at better resolution: premise blocks, a beat index, setups and payoffs, character notes, dialogue-anchor lists, chapter connections, open-thread sections, craft rules. Any heading in the body other than the closing `## Synopsis` is the tell that something is in the wrong file.

### Markers for unresolved elements

Both treatment marker types apply, carried **inline in the prose** where the gap actually is:

- `[OPEN: Q-###]` — links to a tracked open question.
- `[NEEDS DEVELOPMENT: …]` — a narrative gap that doesn't yet have a tracked question.

A chapter carrying either marker is *drafted* (the file exists), not *complete*. Pre-prose readiness is zero unresolved markers in the body.

### Length

Whatever the author writes. **500–1,500 words per 3,000-word chapter is typical.** Generated outlines match the density of the author's samples (see the skill's § Style inheritance); with no samples, the middle of that band. Never pad, and never pad an author-written outline at all.

### `outline/_index.md` — the outline view (chapter × stage matrix)

The horizontal scan surface. Mirrors the Chapter Spine from `structure.md`, but tracks each chapter's status across **every stage** of the chapter pipeline — outline, blueprint, prose, refinement — in one row. This is the folder-world equivalent of the web app's outline view: physical storage is entity-first (one folder per chapter), but this index projects the type-first horizontal view so "which chapters have prose?" or "which are still un-blueprinted?" is one read. Re-generated whenever a chapter-stage skill runs.

```yaml
---
version: 3
last_updated: 2026-05-12
structure_version: 1
total_chapters: 40
chapters_outlined: 12
chapters_blueprinted: 0
chapters_drafted: 0
chapters_noted: 0
---
```

```markdown
# Outline View

Generated from `outline/structure.md` and the chapter folders under `chapters/`. Act sections follow the chapter blocks' `**Act:**` lines. Each row shows a chapter's spine concept and its status at each pipeline stage. Status cells: `vN` (artifact exists, version N) · `—` (not started) · plus inline `[OPEN: Q-###]` / `[NEEDS DEVELOPMENT]` flags carried up from the artifact body.

## Act 1: Setup (chapters 1–10)

| Ch | Title / Spine concept | Outline | Blueprint | Prose | Notes |
|---|---|---|---|---|---|
| 01 | *The Auditing Room* — late for her swearing-in | [v1](../chapters/chapter-01/ch01-outline.md) | — | — | — |
| 02 | *The First Crack* — a receipt that doesn't reconcile | [v1](../chapters/chapter-02/ch02-outline.md) | — | — | — |
| 03 | *The Body in the River* — inciting incident | [v2](../chapters/chapter-03/ch03-outline.md) `[OPEN: Q-014]` | — | — | — |
| … |  |  |  |  |  |
| 10 | *Plot Point 1: She Commits* | — | — | — | — |

## Act 2: Fun and Games (chapters 11–30)

| Ch | Title / Spine concept | Outline | Blueprint | Prose | Notes |
|---|---|---|---|---|---|
| 11 | *Surveillance Begins* | [v1](../chapters/chapter-11/ch11-outline.md) | — | — | — |
| … |  |  |  |  |  |

## Act 3: Resolution (chapters 31–40)

…
```

Each row shows:
- Chapter number and title (`title` from the chapter's `ch<NN>-outline.md` frontmatter, or the chapter block's heading in `structure.md` if no outline exists yet).
- A status cell per stage: a versioned link to the artifact if it exists (`[v2](../chapters/chapter-03/ch03-outline.md)`), or `—` if that stage hasn't started. Prose at `status: retired` shows `[retired](../chapters/chapter-02/ch02-prose.md)` and is left out of `chapters_drafted` (§ Prose).
- Inline marker flags (`[OPEN: Q-###]` or `[NEEDS DEVELOPMENT]`) in the relevant stage cell when that artifact carries unresolved markers.

Links are relative from `outline/` into `chapters/` (`../chapters/chapter-NN/...`). Each column fills as its skill runs (`outline-chapters`, `blueprint`, `prose`, `notes`). The index is regenerated on every chapter-stage run. It is not hand-edited.

## `chapters/` folder — per-chapter content folders

The `chapters/` folder holds one **folder per chapter** (`chapters/chapter-NN/`), and each chapter folder holds *all* of that chapter's artifacts as it moves through the pipeline. This is the entity-first content layer that hangs off the `outline/` spine (see § Chapter content above).

**Folder location:**
- Standalone novel: `<root>/chapters/chapter-NN/`
- Series mode: `<root>/books/<slug>/chapters/chapter-NN/`

**Chapter folder naming:** `chapter-NN`, zero-padded to two digits (a number past 99 is written as it is: `chapter-100`). **Files inside** are chapter-number-prefixed: `ch<NN>-<stage>.md`.

```
chapters/chapter-17/
  ch17-outline.md      # the author's prose account of the chapter — outline-chapters
  ch17-blueprint.md    # the continuity brief ("Blueprint") — blueprint
  ch17-prose.md        # the chapter's prose — prose (or scenes/ when split)
  ch17-notes.md        # what the prose actually committed — notes
  scenes/              # OPTIONAL — only when the chapter is genuinely scene-split
    ch17-scene-01.md
    ch17-scene-02.md
  .history/            # co-located snapshots (only where the binding's history is `snapshots`)
```

**Stages are filenames, not folders.** Adding a future pipeline stage means a new `ch<NN>-<stage>.md` file in each chapter folder — never a new parallel top-level tree. The stages, in pipeline order: `outline` → `blueprint` → `prose` → `notes`.

### Blueprint (`ch<NN>-blueprint.md`) — the pre-prose continuity brief

Lives in the chapter folder, chapter-number-prefixed: `chapters/chapter-17/ch17-blueprint.md`. A **Blueprint** is the single, self-contained brief a prose-writing agent reads alongside the style guide and the outline. It answers *what must I not get wrong?* for one chapter: every character and worldbuilding element that surfaces, at the resolution its prominence earns (Foreground → Background → Dormant; POV → Major → Supporting → Minor → Referenced), with scene-current state fused in; the chapter's shape, conflict, and dialogue anchors; the plants stated as imperatives; and the slice of the story frame that bears on this chapter. **Its knowledge horizon is its own chapter: backward without limit, forward not at all.** At prose time it **replaces the raw Canon layer entirely** (bios + worldbuilding + primer). Written by the `blueprint` skill. For the content spec (the backward-only rule, synthesis over citation, tiering, frameworks, the twelve sections, the checklist) see `references/blueprint-spec.md`. This section specifies only the *file shape*.

```yaml
---
chapter: 17
title: The Locket
version: 1
last_updated: 2026-05-12
# Provenance — the versions this Blueprint was built against (staleness detection):
outline_version: 1
structure_version: 1
treatment_version: 8
primer_version: 4
manifest_version: 2
pov: Marlowe
tense: past
narrative_style: close third, past tense
act: 2 — Fun and Games
scene_split: false        # true when the Blueprint carries per-scene sections
outline_words: 1140
expansion_target: ~2.5–3× the outline
knowledge_horizon: chapter 17
open_questions_touching_this_chapter: [Q-011, Q-015]
depends_on: voice/style-guide.md   # or `none` — then § 11 carries transcribed craft and the author was warned
revision: >-
  free-text note on what changed and why
---
```

Body — the twelve sections (full formats in `references/blueprint-spec.md`):

```markdown
# Chapter 17 Blueprint — *The Locket*

[the header block: the five bold-labeled lines in `references/blueprint-spec.md` § Header]

## 1. Scene Function

## 2. Story Context

## 3. Chapter Shape

## 4. Characters

## 5. Setting

## 6. Main Source of Conflict

## 7. Symbolism and Thematic Layer

## 8. Continuity

## 9. Worldbuilding

## 10. Dialogue Anchors

## 11. Chapter-Specific Craft

## 12. Other Notes
```

**Granularity is chapter-level.** When a chapter is genuinely **scene-split**, set `scene_split: true` and repeat Characters / Setting / Conflict / Worldbuilding per scene under `## Scene 1 — …` headers; the other sections stay chapter-level. Default to the single form.

**Scene-current state** comes from, in order: (1) each canon entry's **Revelation Log** filtered to `chapter ≤ 17`; (2) the prior chapter's **`ch<NN>-notes.md` end-state block** when it exists; (3) reconstruction from prior chapters' prose or outlines. A Blueprint for chapter 17 **never** writes toward anything from chapter 18 on.

### Prose (`ch<NN>-prose.md`) and scenes

Prose is **one file per chapter by default** (`ch<NN>-prose.md`). Treatment scenes don't map 1:1 to chapters, so when a chapter is genuinely scene-split, the prose moves into a `scenes/` subfolder (`chapters/chapter-NN/scenes/ch<NN>-scene-MM.md`) and `ch<NN>-prose.md` is omitted or becomes a stitched-together read. Default to the single file; reach for `scenes/` only when the chapter actually needs it.

The `blueprint` schema is defined above; the `ch<NN>-prose.md` schema is defined here; the `ch<NN>-notes.md` schema follows it. Prose is written by the `prose` skill, which works from `references/prose-spec.md` (the assembly order, voice model, POV/tense rules, output rules, spoiler firewall).

```yaml
---
chapter: 17
title: The Locket
version: 1
last_updated: 2026-05-12
pov: Marlowe Reyes
pov_type: 3rd_limited       # 3rd_limited | 3rd_objective | 3rd_omniscient | 1st_person | 2nd_person
tense: past                 # past | present | future
# Provenance — the versions this prose was generated against (staleness detection):
outline_version: 1
blueprint_version: 1        # null on the fallback (no-Blueprint) path
treatment_version: 8
primer_version: 4
status: drafted             # drafted | revising | revised | retired
authorship: ai_generated     # author_written | ai_generated | ai_generated_author_revised
word_count: 4127
synopsis: |
  ~150–250w summary of THIS chapter, written as its author — causal events, the
  reveals, who learned what, how the story's state changed by chapter's end. Names
  characters, locations, events; not a teaser, not vibes. This is what later
  chapters read as their story-so-far, so its accuracy compounds across the book.
---
```

Values (the `title`, a `pov` name) are quoted per § Frontmatter values; the multi-line `synopsis` stays a `|` block.

**Body: prose only.** No markdown headers, no frontmatter-style labels, no meta-commentary — just the chapter's fiction, paragraphs separated by single blank lines, scene breaks as a single blank line. (The `synopsis` lives in frontmatter precisely so the body stays pure prose.) See `references/prose-spec.md` § Output rules.

- **`pov`** mirrors the chapter outline's `pov`: a character's name. The `prose` skill uses it to find the POV-matched prior prose chapter (the voice anchor).
- **`pov_type`** and **`tense`** are the app's scene enums, verbatim: `pov_type` is `3rd_limited`, `3rd_objective`, `3rd_omniscient`, `1st_person`, or `2nd_person`; `tense` is `past`, `present`, or `future`. The `prose` skill resolves them before generating (see `references/prose-spec.md` § POV rules and § Tense) and records them here, so the POV-mode rule it asserted is on the file.
- **`blueprint_version`** records which Blueprint this prose was built against, or `null` if generated on the fallback (no-Blueprint) path. A Blueprint regenerated past this value means the prose may be stale w.r.t. current canon.
- **`synopsis`** is written at generation time and is the chapter's contribution to every later chapter's story-so-far. Regenerate it whenever the prose is rewritten (it must track the prose's actual events).
- **`status`**: `drafted` (generated, unreviewed) → `revising` (surgical edits in progress) → `revised` (the author has signed off on the revision). `notes` runs at `revising` or `revised`. The app has two of these stages: `revised` is the app's `revised`, and `revising` is still the app's `drafted` (the revision isn't finished). The retired `approved` reads as `revised`. The app never lowers a scene's stage: a `drafted` or `revising` file written over a scene the app holds at `revised` reads back `revised`, so a regeneration of signed-off prose is reported as such rather than relied on to reset the stage.
- **`status: retired`** marks prose the author has set aside: it stays on disk (nothing deletes it) but is no longer the book. A chapter becomes retired only when the author says so. A skill may **propose** it, and sets it on approval with a frontmatter-only edit that leaves the body untouched: `outline-chapters` when a regenerated outline no longer describes the chapter's existing prose (intake prose a new outline supersedes, as D-067 did), or any skill that finds the author has said a draft is thrown out. Retired prose is skipped everywhere prose stands for the book: the `prose` voice-anchor lookup and story-so-far (and that chapter's notes, which describe the retired text), Blueprint reconstruction from prior prose, and `notes` (it records no notes for it). It is not counted as drafted: `state.md` What Exists → Prose chapters and `outline/_index.md`'s `chapters_drafted` leave it out, and its Prose cell reads `retired` (linked to the file) instead of a version. Unchecked items in its notes' § Proposals stop counting: they are left out of the unintegrated-proposal count and of `blueprint`'s canon-sync-owed check. Retiring a chapter also makes later chapters' existing Blueprints suspect where they drew on it: the next chapter's and the next same-POV chapter's carried-forward state read its notes or prose, so the retiring skill lists those Blueprints for review or rebuild in its report and `state.md` What's Next. **Scene-split chapters** retire as a whole: set `status: retired` on every scene file (and on a stitched `ch<NN>-prose.md` when one exists); a chapter counts as drafted while any of its prose or scene files is not retired. Generating prose for the chapter again replaces it (snapshot first) with a normal `drafted` file. `retired` is a plugin value; the app has no such stage.
- **`word_count`**: the body's word count (body only; a word is a whitespace-separated token holding at least one letter or digit). After every prose write the plugin makes, the main session reads the result back, measures it, and records the measured count with a frontmatter-only edit (that bookkeeping edit needs no snapshot: it changes only the count the write just set, and the as-written copy holds everything else). It is exact where the host can count and approximate where it can't, so it is informational, the length reports and What Exists show, and **never evidence of an edit**: a count that disagrees with the body says nothing about who changed it.
- **`authorship`**: `ai_generated` on generation; `author_written` for intake-stashed prose; `ai_generated_author_revised` when the body has changed since the plugin last wrote it (below). Older files' hyphenated spellings read as the same values. Never downgrade `author_written` or `ai_generated_author_revised`. `canon-sync` reads it to adjudicate contradictions (its § 4): a page fact that traces to author-written upstream material is ruled canon against canon with no default; otherwise author-written or author-revised prose wins by default, and AI-generated prose (or prose with no `authorship`) yields to canon by default.
- **Detecting an author revision.** Before a skill relies on `authorship: ai_generated` (`prose` revise mode before it edits; `canon-sync` before it defaults a contradiction against that prose), it asks one question of the store: has the body changed since the plugin last wrote it? The answer depends on the binding's `history` capability:
  - `snapshots`: every prose write the plugin makes to `ch<NN>-prose.md` or a scene file (generate, surgical edit, Kit Bash consolidation; never a Kit Bash draft file) is followed by an **as-written copy**, the identical content, at `chapters/chapter-NN/.history/ch<NN>-prose-v<version>-as-written.md` (§ Per-chapter history). Compare the current body with the as-written copy for the file's current `version`, bodies only (the frontmatter carries bookkeeping edits). Compare exactly where the host can compare text; otherwise a clean-window subagent reads both and reports whether and where they differ, so the main session never holds two chapters. No as-written copy for that version (prose written before this rule) → ask.
  - `versions`: compare with the newest version `store.history` returns that the plugin wrote, where the binding says who wrote each version; where it doesn't → ask.
  - `native`: the backend keeps history the binding can't read, so there is nothing to compare with → ask.
  - **Ask** means one plain question naming the chapter and the version and date the plugin last wrote (*"Have you edited chapter 8 since StoryStormer wrote v2 on 2026-10-12?"*); the author's answer is the signal. Never infer an edit from `word_count`, file dates, or style.

  Changed → set `authorship: ai_generated_author_revised` (a frontmatter-only edit) before anything else. Unchanged → keep `ai_generated`.
- **Kit Bash provenance** (only on consolidated chapters): `kitbash_base: <draft label>` and `kitbash_drafts: [<labels>]` record which competing drafts produced this chapter. Draft files live in `chapters/chapter-NN/kitbash/` (`ch<NN>-draft-<label>.md`, plus the `ch<NN>-packet.md` generation packet) — see `references/kitbash-spec.md`.

**Scene-split prose.** When the Blueprint is `scene_split: true`, prose moves into `scenes/` (`chapters/chapter-NN/scenes/ch<NN>-scene-MM.md`); each scene file carries the same frontmatter scoped to that scene (the chapter-level `synopsis` lives on a stitched `ch<NN>-prose.md` or the first scene — keep one synopsis per chapter for story-so-far). Default to the single `ch<NN>-prose.md`.

### Notes (`ch<NN>-notes.md`) — what the prose actually committed

Lives in the chapter folder: `chapters/chapter-17/ch17-notes.md`. Written by the `notes` skill. Notes **records what the prose committed; it does not evaluate the prose.** Run at prose `status: revising` or `revised`, not `drafted`.

**This is the app's chapter notes document**, byte for byte in its shape: the same four frontmatter keys first, then the same six `##` sections in the same order and wording, because the app's canon-sync and this plugin's find each section by its exact heading.

```yaml
---
chapter: 17
title: The Locket
prose_draft: Chapter 17 prose v2
prose_status: revised
prose_version: 2
version: 1
last_updated: 2026-06-21
---
```

- **`chapter`**, **`title`**: the chapter's number and title.
- **`prose_draft`**: a **display label** for the prose draft the notes were read from (the app writes the draft's title, such as `Chapter 17 — Draft 2`; the plugin writes `Chapter 17 prose v2`). It is for reading, never for comparison.
- **`prose_status`**: the app's two-value stage, `drafted` or `revised`. Write `revised` when the prose's `status` is `revised`, otherwise `drafted` (a `revising` chapter is still a draft to the app). Notes taken on a `drafted` chapter owe a re-run once it is revised.
- **`prose_version`** (plugin key, the app ignores it): the prose file's `version` the notes were taken from. **This is the freshness check:** notes are current when `prose_version` equals the prose file's `version`, stale when it is lower.
- **`version`**, **`last_updated`**: plugin keys the app ignores.

**Notes written by 0.16.x** carry only `prose_version` and `prose_status_at_run` (`drafted | revising | approved`). Read them the same way: `prose_version` is the freshness stamp, and `prose_status_at_run` maps to `prose_status` (`approved` → `revised`, `drafted` and `revising` → `drafted`). Add `title`, `prose_draft` and `prose_status` on the next write.

**When the project is connected to the app** (AP3), the server marks each notes record `status: current | stale` itself against the chapter's canonical draft; when that field is present, trust it over the local `prose_version` comparison.

**Quoting** follows § Frontmatter values (the app's notes writer is where that rule comes from).

The body is exactly these six sections, in this order. A section with nothing to record reads `None.`, so all six headings are always present; **As-Written Synopsis** and **End State** always have content. No H1.

```markdown
## As-Written Synopsis

[what is on the page, distinct from the outline's intent; downstream consumers prefer this over the prose frontmatter synopsis when it exists]

## Divergences from the Outline

- [each, flagged deliberate or drift]

## Harvest

[concrete particulars the chapter committed — named objects, throwaway facts, minor characters, specific places. Nouns, not themes. Searchable across chapters via `chapters/*/ch*-notes.md`.]

## Accidental Canon

[details invented in the prose that no canon file holds — proposed for promotion, never promoted silently]

## End State

- **Hour:** …
- **Location:** …
- **Wardrobe:** …
- **Injuries:** …
- **Objects carried:** …
- **Emotional residue:** …

## Proposals

- [ ] **Revelation Log** · `characters/muppy.md` · Ch 1 — awn in the webbing of a forepaw, still in at chapter's end.
- [ ] **Promote** · the Hartleys' mudroom → `worldbuilding-entry` (appears ch 1, 4, 6 with consistent detail, no entry).
- [ ] **Manifest** · the rooster three properties over (minor element).
- [ ] **Chain closure** · §2 jacket chain (plant ch 1, pay ch 3) — paid here as registered.
- [x] **Revelation Log** · … — applied (D-041)
- [x] **Promote** · … — routed (worldbuilding-entry)
- [x] **Manifest** · … — declined (already covered by `golden-valley.md`)
```

The **End State** block is what the next chapter's Blueprint reads for carried-forward state instead of re-reading 3,500 words of prior prose. The **Proposals** section is the queue `canon-sync` consumes: `notes` writes each item unchecked; `canon-sync` checks it off with its outcome (`applied (D-###)`, `routed (<skill>)`, `declined (<reason>)`). The count of unchecked items across `chapters/*/ch*-notes.md` is the project's unintegrated-proposal count in `state.md`, leaving out chapters whose prose is `status: retired`.

### Canon-sync run records (`.storystormer/canon-sync/`)

Each `canon-sync` run writes `.storystormer/canon-sync/<YYYY-MM-DD>-ch<NN>-<MM>.md`: findings by category (accretion, contradiction, drift, promotion, obsolescence) with outcomes and decision IDs; the **manuscript fix list** (chapter · passage · required change) for every contradiction canon won; the **invalidated Blueprints** list (chapter · entry that changed · stamp it was built against) for every contradiction the manuscript won; promotions routed; chain closures struck. The run's pre-edit canon snapshot is taken per `references/store.md`. Run records are never deleted by the plugin.

### Per-chapter history (`.history/`)

These snapshots apply where the binding's `history` capability is `snapshots` (`references/store.md` § Local-mode clauses). In a series the chapter folder is `books/<slug>/chapters/chapter-NN/`.

Chapter artifacts revise frequently and locally, so their snapshots are **co-located** in the chapter folder rather than in the central `.storystormer/history/`. Snapshots are flat, version+date-named files:

```
chapters/chapter-17/.history/
  ch17-prose-v2-2026-06-21.md     # the draft at v2, archived when a rewrite produced v3
  ch17-prose-v3-as-written.md     # what the plugin wrote at v3 (the author-revision baseline)
  ch17-outline-v1-2026-06-18.md
```

Pattern: `ch<NN>-<stage>-v<version>-<YYYY-MM-DD>.md`. The `version` is the superseded draft's frontmatter version (each version is archived at most once, so it's always unique); the date is chronological context only. Flat files, **not** per-snapshot subfolders — chapter artifacts revise one at a time, so the central log's folder-grouping (which bundles the primer+treatment pair) would be empty ceremony here. The rule: *snapshot granularity matches what-changes-together.* See § `.storystormer/history/` for the book-level mechanism.

**Prose as-written copies.** Prose also keeps `ch<NN>-prose-v<version>-as-written.md`: the content exactly as the plugin wrote that version, written right after the prose write itself by whoever made it (the generation, surgical-edit or consolidation subagent, whose brief carries the path). Kit Bash draft files under `kitbash/` never get one; only the consolidated prose write does. It is the baseline § Prose → Detecting an author revision compares against, since the replace-time snapshot captures whatever the file holds by then, author edits included. It does not replace that snapshot: the copy lacks the frontmatter set after the write (`word_count`, `status`, `authorship`), so the replace-time snapshot is always taken. Scene-split prose keeps one per scene file (`ch<NN>-scene-MM-v<version>-as-written.md`).

### Intake-stashed prose (`storystormer-init`)

The only chapter content created in the POC comes from `storystormer-init`'s intake, when the user brings in pre-existing prose. Init stashes each detected chapter as `chapters/chapter-NN/ch<NN>-prose.md` (markdown), or preserves the original extension (`ch<NN>-prose.docx`, etc.) when the source isn't markdown — flagged in the report, since prose-writing skills will require markdown.

For intake-stashed prose, init populates only `chapter`, `title` (from the file's H1 or filename if discoverable), `version: 1`, `last_updated`, and `authorship: author_written`. The remaining frontmatter fields (`pov`, version stamps, `status`, `synopsis`) are populated by the `prose` skill when it next touches the chapter — e.g. it can synopsize stashed prose into the `synopsis` field so the chapter joins the story-so-far. **Body**: raw user content — preserve verbatim, do not rewrite or normalize.

**Init's responsibility ends at stashing.** Init does not generate or rewrite prose, generate summaries, cross-check against the treatment or outline, or verify continuity. All of that is downstream prose-writing work. The intake job is purely "find the chapters the user already has, put them in the canonical chapter folder with canonical naming, and report what was stashed."

## `series.md` — series arc document (series mode only)

`series.md` lives at `<root>/series.md` and exists only in series-mode projects. It is the arc-level companion to per-book treatments — it captures what no single book's treatment can. See `references/series.md` for the full series doctrine.

```yaml
---
title: Inauguration Day
project_type: series
book_count: 3
version: 2
last_updated: 2026-05-24
---
```

### Sections (in order)

```markdown
## Series Arc

[~400–600w on the protagonist's full trajectory across all books, framed at the series scale. Names major thematic shifts, identity transformations, and the series-level dramatic question. The series equivalent of primer Section 2 (Premise & Moral Argument), scaled to the full series.]

## Series Theme

[~200–400w on the central thematic question the series asks. This is often distinct from any single book's premise — a series may ask "what does power cost?" while book 1 asks "can integrity survive complicity?" and book 3 asks "is reform from within possible at all?" Both Egri's premise format ("[Quality] leads to [consequence]") and McKee's controlling idea format ("[Value] is achieved/lost when [cause]") apply here, scaled to the series.]

## Per-Book Synopses

### Book 1: [Title]

[~150–300w paragraph summary of book 1's arc, integrated into the series flow. Read all three synopses together and the shape of the series should be clear.]

### Book 2: [Title]

[~150–300w]

### Book 3: [Title]

[~150–300w]

## Cross-Book Setups and Payoffs

A table of chains that span books. The single most useful section for ongoing series work.

| Chain | Setup Location | Payoff Location | Notes |
|---|---|---|---|
| Maya's locket (mother's) | Book 1, ch 2 | Book 3, ch 14 (reveals mother was an FBI informant) | Setup integrated; payoff pending book 3 treatment. |
| The protocol deviation | Book 1, ch 38 (Inauguration) | Book 3, ch 22 (assassination attempt) | Setup integrated; payoff scheduled. |
| Senator Vance's letter | Book 1, ch 12 | Book 2, ch 7 | Both integrated. |
| Reyes's loyalty test | Book 2, ch 18 | Book 3, ch 28 (climax) | Both pending — book 3 not yet drafted. |

Each chain references decision IDs where applicable. When a payoff lands, mark it integrated; orphan payoffs (no setup tracked) and orphan setups (no payoff identified) are flagged and resolved at the next series-level update.

## Continuity Concerns

Ongoing concerns the author is tracking across books — items that need vigilance but aren't yet decisions or open questions. Use this as the agent's running memory for cross-book consistency.

- Maya's age progression: book 1 = 28, book 2 = 30, book 3 = 32. Verify aging-related details across treatments.
- Technology timeline: books 1–3 span 2026–2028. Any speculative technology must respect the timeline.
- Senator Vance dies in book 1 ch 39. Verify he is not referenced as alive in books 2–3.
- The Mercer Foundation's public name: confirmed as "Mercer Foundation" in book 1 ch 7; verify books 2–3 don't accidentally introduce alternative names.

## Open Cross-Book Questions

Series-scoped open questions from `questions/`, surfaced here for quick reference. Linked by Q-ID.

- Q-031 (critical, plot) — Does Maya leave Washington at the end of book 1?
- Q-032 (important, character) — Does Reyes ally with Maya in book 3, or remain adversarial?
- Q-033 (important, theme) — Does the series end on hope (reform succeeds) or warning (reform fails)?
```

### Length and discipline

Target total length: **2,000–3,000w**. Series.md is a *lower-frequency, higher-leverage* document than per-book treatments. Don't pad it with content that belongs in per-book treatments or in character bios. The Cross-Book Setups and Payoffs section is the load-bearing element; everything else exists to give it context.

### When series.md is regenerated vs. patched

For light updates (a new cross-book chain identified, a continuity concern logged, an open question added), patch the relevant section in place. For structural shifts (the series arc changed, a book's role flipped from sequel to prequel, a major decision rippled across the arc), regenerate the whole document. Snapshot the old version per `references/store.md` before any structural regeneration.

## `.storystormer/config.json`

```json
{
  "layout": 2,
  "storage": { "kind": "local" }
}
```

The config holds only what has to be known before the store is bound or before `state.md` can be read: where the project lives and which layout its documents are in. Every field the author sees (title, genre, type, target, the series’ `books` and `current_focus`) is owned by `state.md`, and the config never mirrors one; a series has the same two keys.

- **`storage`**: where the story lives, resolved once per session (`references/store.md` § Resolve). Full shape: `"storage": { "kind": "dropbox", "root": "<backend root>", "local_root": "<absolute path of the synced folder on this machine>" }`. `kind` is `local | dropbox | notion | storystormer`; `root` is the backend's project root (a Dropbox folder path, a Notion project page id, a StoryStormer project id); `local_root` is optional. A config without `storage` is local. Never repair it from anything else: resolution reads it before any other document.
- **`layout`**: the version of the project’s file layout. `2` is the layout this document describes: decisions, questions and the journal as entry collections (§ Entry collections) and a slim `state.md`. **Absent means the old layout** (§ The old layout), which resolution finds and offers to upgrade. Only `init` (writing `2` for a new project) and `migrate`’s layout upgrade set it.
- **A pointer** is a config holding `storage` and nothing else (no `layout`): what `init` and `migrate` leave in an open folder whose project lives on a connector backend. Resolution reads it only for `storage`; the layout is read from the project’s own config in the bound store.
- **An old-layout config** also carries the fields it used to mirror (`title`, `project_type`, `target_word_count`, `genre`, `genre_secondary`, `created`, `surfacing_mode`, and in a series `books` with titles and per-book targets, and `current_focus`). Nothing reads them once `state.md` exists; the layout upgrade moves any value `state.md` lacks (a book’s own target, a book’s title) into the `state.md` that owns it, then removes them.

## `.storystormer/history/` — book-level history

These snapshots apply where the binding's `history` capability is `snapshots` (`references/store.md` § Local-mode clauses).

This is the **book-level** snapshot mechanism. Before any rewrite of `primer.md`, `treatment.md`, `manifest.md`, `outline/structure.md`, `series.md`, a character bio, or a worldbuilding entry (`worldbuilding/<type>/<slug>.md`; `worldbuilding-entry` and `canon-sync` already snapshot these), snapshot the current versions into a timestamped folder:

```
.storystormer/history/
└── 2026-05-11T14-33-treatment-update/
    ├── primer.md
    ├── treatment.md
    └── manifest.md
```

Inside a snapshot folder each file keeps its root-relative path (`books/book-2/treatment.md` in a series), so two books' documents stay distinct.

The folder name encodes both the timestamp and the operation: `<YYYY-MM-DD>T<HH-MM>-<operation>`, the timestamp in the session's local time and `<operation>` the name of the skill or command that wrote it (`treatment-update`, `init`; `/storystormer:checkpoint` uses its label). A store operation such as `edit` is never the operation name. It uses **per-snapshot folders** because a single operation often archives several files **as a set** — primer and treatment are snapshotted as a pair during treatment updates, since the primer version that built a treatment is meaningless without the treatment it informed.

**Chapter-level artifacts use a different mechanism.** Per-chapter content (outline/blueprint/prose/notes) revises frequently and one file at a time, so its snapshots are co-located in the chapter folder as flat, version+date-named files (`chapters/chapter-NN/.history/ch<NN>-<stage>-v<version>-<date>.md`) — not here, and not in per-snapshot subfolders. See § `chapters/` folder → Per-chapter history. The split is by altitude: book-level docs (which change as a set) snapshot centrally in folders; chapter-level artifacts (which change individually) snapshot locally as flat files. Both key on the frontmatter `version` integer.

Since we are git-agnostic, this is the only versioning. Don't auto-prune; let the user clean up history manually if they want to.
