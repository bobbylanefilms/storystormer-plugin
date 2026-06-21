<!-- ABOUTME: Canonical schemas for every file the plugin reads or writes -->
<!-- ABOUTME: state.md, primer.md, treatment.md, manifest.md, decisions.md, questions.md, character bios -->

# File Schemas

Every file the plugin manages is human-readable markdown with optional YAML frontmatter. Files round-trip cleanly through both agent edits and manual user edits. When a user hand-edits a file, the agent must handle it gracefully on next read.

This document is the canonical spec. If a skill wants a field that isn't here, add it here first.

## `state.md` — living project dashboard

The agent's record of what the project is, where it stands, and what to work on next. Updated after every significant action. The user can read this any time to see the current state, and can hand-edit `Next Recommended Action` if they want to redirect.

```yaml
---
title: [working title]
genre: [primary]
genre_secondary: [optional, omit if not applicable]
project_type: novel | novella | short-story | screenplay | series
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

The `books` and `current_focus` fields are **only present in series-mode projects**. Standalone-novel projects omit them. See `references/series.md` for the full series workflow.

For a per-book `state.md` (at `books/<slug>/state.md` in series mode), the frontmatter looks like the standalone schema above plus one additional field:

```yaml
parent_series: Inauguration Day            # title of the parent series
```

Per-book `state.md` files omit `books` and `current_focus` (those live only on the series-level state.md).

### Sections (in order)

```markdown
## Summary
[3–5 sentences on where the project stands — what exists, what's strong, what's missing]

## What Exists
- **Primer** — v3 (2026-05-09), built from D-001..D-018
- **Treatment** — v7 (2026-05-10), built from D-001..D-018
- **Manifest** — v2 (2026-05-10), 4 characters, 2 locations, 1 organization
- **Character bios** — Marlowe (major, ~1700w), Alice (supporting, ~700w), Bob (minor, ~350w)
- **Worldbuilding** — Voss Industries (organization), the Heights (location)
- **Structure** — v1 (2026-05-12), based on Primer v3 + Treatment v7, 40 chapters planned, Save the Cat framework
- **Chapter outlines** — 12/40 drafted (Act 1 complete, Act 2A through ch 12), based on Structure v1
- **Prose chapters** — 6/40 written (ch 1–6), stashed in `chapters/` (prose-writing functionality pending)
- **Decisions** — 18 total, 14 integrated into current treatment
- **Open questions** — 6 (2 critical, 3 important, 1 nice_to_resolve)

## What's Next
- **Active focus**: Marlowe's relationship to the antagonist (Q-019, critical)
- **Recommended next action**: Resolve Q-019 in a brainstorm session, then refresh treatment
- **Unintegrated decisions**: 4 new since last treatment update — propose `/storystormer:treatment-update` once Q-019 is decided

## Last Session
[2–3 sentences on what was worked on most recently — fresh context for the agent on resume]
```

### Update rules

- Bumping a numbered version (primer / treatment / manifest / bio) → update the corresponding line in **What Exists** and bump `session_count` only if it's a new session.
- Resolving a question → update **What's Next** to point to the next priority question.
- Treating the user's `Next Recommended Action` as suggestion — the user can ignore or hand-edit it. Never overwrite a user's hand-edit silently; if it conflicts with what the agent would write, mention the conflict in the next response.

### Series-level state.md

In series mode, the **series-level state.md** at `<root>/state.md` has a `What Exists` section that summarizes the *series*, not any single book. Example:

```markdown
## Summary
A political thriller trilogy. Book 1 is in late outlining (40/50 chapters drafted) and early prose (ch 1–6 written). Books 2 and 3 are in brainstorming — the trilogy's arc is being mapped to inform book 1's final 10 chapters and the planted setups in books 1–2.

## What Exists
- **Series document** — `series.md` v2 (2026-05-24), 6 cross-book setup/payoff chains tracked.
- **Shared manifest** — v4 (2026-05-22), 12 characters and 8 worldbuilding entries across all books.
- **Shared character bios** — 4 major-tier, 5 supporting, 3 minor.
- **Shared decisions** — 47 total (32 series-scoped, 15 book-1-scoped, 0 book-2/3-scoped).
- **Book 1: Inauguration Day** — primer v6, treatment v9, outline 40/50 chapters drafted, prose ch 1–6 (post-POC).
- **Book 2: [TBD title]** — primer v1 (stub), treatment v0 (not yet drafted), brainstorming stage.
- **Book 3: [TBD title]** — primer v0 (not yet drafted), brainstorming stage.

## What's Next
- **Active focus**: book-2 (currently brainstorming the act-1 shape).
- **Recommended next action**: continue brainstorming book 2's premise; once Q-052 (book 2's central thematic question) is resolved, run `treatment-update` for book 2 in first-run mode.
- **Cross-book watch**: D-038 (Inauguration scene foreshadowing) is integrated into book 1 but pending for book 3 — revisit when book 3 brainstorming starts.
```

Per-book state.md files at `books/<slug>/state.md` carry the standalone-novel "What Exists" structure, scoped to that one book.

## `primer.md` — story craft dossier (six sections)

```yaml
---
version: 3
last_updated: 2026-05-11
built_from_decisions: [D-001, D-002, D-005, D-009, D-012, D-018]
---
```

The Story Primer is a structured craft reference. It defines *how* the story is told — its identity, moral argument, structural framework, writing rules, setup/payoff chains, and character dynamics. Downstream agents (treatment writer, prose generators) read it for craft decisions, structural plans, and voice guidance.

The Primer has **exactly six standard sections** — no more, no fewer. Every piece of primer content lives inside one of these sections. Total target length: **~4,500–5,500 words** across all six. The Primer is a reference document, not an essay; concise specific statements beat expansive analysis.

### Section 1 — Story Identity (800–1,200w)

Logline (1–3 sentences capturing the hook), primary genre and subgenre, 3–5 comparable works with brief explanations of the comparison, target word count and what that implies for pacing/structure.

**Does NOT contain**: premise or moral argument (Section 2), character descriptions (Manifest), plot summary (treatment).

### Section 2 — Premise & Moral Argument (800–1,200w)

The central dramatic question the story asks, the premise/moral argument (what the story proves through events), core conflict architecture (the levels of conflict operating simultaneously), character thematic positions (how each major character embodies a different answer to the central question), thematic parallels and structural echoes between characters.

**Does NOT contain**: detailed character bios (Manifest), scene-by-scene narrative (treatment), writing technique specifications (Section 4).

### Section 3 — Structural Framework (800–1,200w)

Act structure with approximate word counts and key turning points per act, POV strategy (which characters get POV, distribution, special rules), timeline structure (compressed present, flashback pattern, parallel timelines), pacing notes (where to accelerate, where to breathe, rhythm patterns), structural mechanisms (e.g., *"the recruitment sequence is the thematic engine"*).

**Required subsection — Treatment Word Budget.** Calculated as:

- `treatment budget = target novel word count / 6`
- Standard three-act allocation: Act 1 = 25%, Act 2 = 50%, Act 3 = 25%
- Per-chapter density = `treatment budget / target chapter count`

Example for a 120,000-word novel with ~40 chapters:

| Segment | Novel Share | Treatment Words |
|---|---|---|
| Act 1 (~10 chapters) | 25% | ~5,000 |
| Act 2 (~20 chapters) | 50% | ~10,000 |
| Act 3 (~10 chapters) | 25% | ~5,000 |
| Per-chapter density | — | ~500 |

For non-standard structures (five-act, etc.), distribute equally unless the author has specified weighted proportions. Per-chapter density is a *calibration signal* for the treatment writer, not a chapter assignment.

**Does NOT contain**: beat-by-beat scene breakdowns (treatment), detailed staging deliberations (state conclusions, not the analytical process), full scene choreography (treatment).

### Section 4 — Tone, Style & Writing Rules (800–1,200w)

Overall narrative voice description, tonal register (e.g., *"dark procedural realism with metaphysical unease"*), dialogue conventions for major characters, special narrative techniques unique to this story, standing writing rules and anti-patterns to avoid, genre-specific voice modulations.

**Does NOT contain**: character personality descriptions (Manifest), character-specific humor examples at scene level (summarize the register, don't write example scenes), full dramatic-irony analysis (state the approach in 1–2 sentences).

### Section 5 — Setup/Payoff Ledger (800–1,500w, scales with story complexity)

Planted setups with their intended payoffs (organized by plant location), foreshadowing threads spanning multiple acts, mystery/revelation sequences (what's hidden, when it's revealed, what the revelation means), open questions about payoff timing or mechanism.

This section scales with story complexity. A tightly plotted thriller may need the full 1,500w; a character-driven literary novel may need ~600w.

### Section 6 — Character Dynamics (400–800w)

Key relationship dynamics between major characters (alliances, conflicts, mentoring, mirroring), power dynamics (who has leverage over whom), faction/group structures and their internal fault lines, cross-faction tensions (character belongs to one group but loyal to another), secrets between characters that drive dramatic irony.

Use concise relationship descriptors — *"Marcus → Elena: professional rivalry masking mutual respect; he represents institutional loyalty, she represents reform"* — not prose paragraphs. This is a structural map of relationships (Truby's character web), not a narrative.

**Does NOT contain**: individual character descriptions (Manifest), character thematic positions (Section 2), full character backstory (`characters/*.md`).

### Header conventions

- `##` (H2) for each of the six standard sections: `## 1. Story Identity`, `## 2. Premise & Moral Argument`, etc.
- `###` (H3) for subsections within a section: `### Logline`, `### Central Dramatic Question`, etc.
- H1 (`#`) is reserved for the document title only.

Separate the six sections with `---` horizontal rules for visual clarity.

### Section budget summary

| Section | Target Words |
|---|---|
| 1. Story Identity | 800–1,200 |
| 2. Premise & Moral Argument | 800–1,200 |
| 3. Structural Framework (incl. Treatment Word Budget table) | 800–1,200 |
| 4. Tone, Style & Writing Rules | 800–1,200 |
| 5. Setup/Payoff Ledger | 800–1,500 (scales with story complexity) |
| 6. Character Dynamics | 400–800 |
| **Total** | **~4,500–5,500** |

If a section runs significantly over budget, condense before adding. Density matters more than coverage.

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

- `[OPEN: Q-###]` — links to a tracked open question in `questions.md`. Use when a specific question is logged and the treatment can't be written until it's resolved.

  ```markdown
  [OPEN: Q-014] — How does Marlowe discover the time loop? Possible: accidental activation by Voss's prototype; deliberate experiment by mentor; inherited device from her father.
  ```

- `[NEEDS DEVELOPMENT: …]` — for narrative gaps that don't yet have a tracked question. Use when story structure implies content that hasn't been brainstormed.

  ```markdown
  [NEEDS DEVELOPMENT: Elena's infiltration mechanics. We know she gets into Voss's compound by Act 3 — we don't yet know how. The treatment scaffolds the *what* but the *how* awaits brainstorming.]
  ```

### Length

The treatment's total length is calibrated by the **Treatment Word Budget** table in primer Section 3 (`Structural Framework`). The formula is `treatment budget = target novel word count / 6`, with per-act allocation and per-chapter density derived from there. Read that table during treatment generation; it governs.

Without a primer to reference (first-run or stub state), fallback by project type:

- Novel: ~5,000–7,000 words (≈ 15–20 pages)
- Novella: ~1,500–2,500 words (≈ 5–10 pages)
- Short story: ~600–1,200 words (≈ 2–4 pages)
- Screenplay: ~5,000 words (≈ 15–20 pages)

The treatment does **not** duplicate the primer — they're read together when full context is needed. The `primer_version` field records which primer this treatment was built against; a primer refresh that bumps `primer_version` past the treatment's recorded value means the treatment may need an update pass.

## `manifest.md` — lean inventory

A structural index. Not a deep document — it's a directory of what exists in the story, with one-line descriptors. The deep content lives in the character bios and worldbuilding files.

```yaml
---
version: 2
last_updated: 2026-05-10
treatment_version: 7
---
```

```markdown
## Characters

### Major
- **Marlowe Reyes** (`characters/marlowe.md`) — Disgraced forensic accountant; protagonist; sees patterns no one else can.
- **Voss** (`characters/voss.md`) — Tech-mogul antagonist; built his empire on a fraud Marlowe missed twelve years ago.

### Supporting
- **Alice Chen** (`characters/alice.md`) — Marlowe's former partner at the bureau; ambivalent ally.
- **Detective Park** (`characters/park.md`) — Local detective on the parallel investigation.

### Minor
- **Doris** (`characters/doris.md`) — The diner regular who passes information.
- **Hartwell** (`characters/hartwell.md`) — Voss's lawyer; appears once in Act 3.

## Worldbuilding

### Locations
- **The Heights** (`worldbuilding/locations/the-heights.md`) — Suburb where Voss's compound sits.
- **Mara's Diner** (`worldbuilding/locations/maras-diner.md`) — Marlowe's information-trading spot.

### Organizations
- **Voss Industries** (`worldbuilding/organizations/voss-industries.md`) — Public-facing tech firm; private fraud operation underneath.

### Objects
- **The Locket** (`worldbuilding/objects/the-locket.md`) — Marlowe's only memento from her father; surfaces three times.
```

Sections that have no entries can be omitted. Add new sections as needed (Cultures, Technology, Magic Systems, etc.) following the same one-line-descriptor pattern.

## `decisions.md` — append-only decision log

Entries are never deleted, only superseded. Each decision has a stable ID (`D-001`, `D-002`, …). When two decisions conflict, the later one wins; the earlier one stays in the file with a `Superseded by` field.

```markdown
## D-018 · 2026-05-11 · character

**Topic**: Marlowe's relationship to her father
**Summary**: Marlowe's father was an accountant murdered when she was 14; this is her unresolved Ghost.
**Details**: He had uncovered the early version of the Voss fraud and was killed for it. Marlowe was raised by her mother in the Heights, became a forensic accountant herself, and missed the same fraud years later when Voss had grown sophisticated enough to hide it. She doesn't yet know about her father's involvement at the start of the story.
**Affects**: Marlowe (protagonist), Voss (antagonist), the locket, Act 2 reveal
**Source**: brainstorm | intake | treatment-update | user-declared
**Integrated into treatment**: no
**Superseded by**: (only set if a later decision invalidates this one)
```

ID rules:
- Sequential, zero-padded to 3 digits (`D-001`, `D-099`, `D-100`). Pad to 4 if you cross 1000.
- Never reused. A superseded decision keeps its ID.

### Series-mode additions

In series mode, every decision entry gains a `Scope` field and `Affects books` field, and the `Integrated into` field becomes book-aware:

```markdown
## D-024 · 2026-05-24 · plot

**Scope**: series
**Affects books**: book-1 (ch 38), book-3 (ch 22)
**Topic**: Inauguration scene foreshadowing
**Summary**: The inauguration scene in book 1 chapter 38 plants visual elements that pay off as the assassination attempt in book 3 chapter 22.
**Details**: ...
**Source**: brainstorm
**Integrated into**:
- book-1 treatment: yes (2026-05-24)
- book-3 treatment: no (book 3 not yet drafted)
```

For book-scoped decisions, the format is simpler:

```markdown
## D-025 · 2026-05-24 · character

**Scope**: book-1
**Topic**: Maya's confrontation with her father
**Summary**: Maya confronts Senator Vance in book 1 chapter 35.
**Source**: brainstorm
**Integrated into**: book-1 treatment yes (2026-05-24)
```

`Scope` values: `series` (affects multiple books or the arc as a whole) or `book-<slug>` (affects one specific book). In standalone-novel projects, the `Scope` field is omitted — every decision is implicitly project-scoped. See `references/series.md` § Scoping decisions and questions.

## `questions.md` — open questions, status mutated in place

```markdown
## Q-014 · critical · plot

**Question**: How does Marlowe discover the time loop?
**Why it matters**: The inciting incident hinges on this. Without clarity, Act 1 beat 3 can't be written and the protagonist's agency in Act 1 is undefined.
**Possible approaches**:
  - Accidental activation by Voss's prototype during a break-in
  - Deliberate experiment by her mentor in the bureau
  - Inherited device from her father, activated when she opens the locket
**Dependencies**: Marlowe's background, the rules of the time loop (Q-007), setting constraints
**Status**: open | resolved (D-023) | invalidated (Marlowe doesn't actually time-loop, see D-031)
```

Priority levels:
- `critical` — blocks treatment progress; downstream work can't proceed without an answer.
- `important` — affects multiple downstream elements; should be answered before the next treatment update.
- `nice_to_resolve` — would improve the story but isn't blocking.

Question categories: `plot`, `character`, `theme`, `setting`, `structure`, `voice`, `genre`, `mechanics` (for stories with a speculative mechanism).

In series-mode projects, each question also carries a `Scope` field (`series` or `book-<slug>`), placed below the priority/category header:

```markdown
## Q-031 · critical · plot

**Scope**: series
**Affects books**: book-1 (ending), book-2 (opening)
**Question**: Does Maya leave Washington at the end of book 1, or stay?
**Why it matters**: The answer determines book 2's setting — a Washington-bound book 2 means Maya is the insider trying to reform from within; a depart-and-return arc means she comes back in book 2 with outsider's eyes. These produce very different book 2 treatments.
...
```

In standalone-novel projects, `Scope` is omitted.

## Character bio files (`characters/<slug>.md`)

```yaml
---
name: Marlowe Reyes
tier: major | supporting | minor
version: 2
last_updated: 2026-05-11
manifest_version: 2
treatment_version: 7
---
```

Body follows the StoryStormer canon bio structure. For the framework vocabulary (McKee, Truby, Egri, Weiland, Voice Fingerprint, Thematic Posture) see `references/frameworks.md`. For the per-section word budgets, sub-field guidance, writing rules, and a worked example, see `references/canon-schemas.md` § Character Bio Schemas. Tier targets:

- **Major** — ~1,400 words standard, up to ~1,900 words extended for POV protagonists, primary antagonists, and characters carrying the thematic load.
- **Supporting** — ~700 words.
- **Minor** — ~350 words.

Structure for major (abbreviated — full version in `references/frameworks.md`):

```markdown
# Marlowe Reyes

## Quick Reference
- **Name:** …
- **Age:** …
- **Occupation:** …
- **Story Role:** Protagonist
- **MBTI:** …
- **Enneagram:** … (with wing → integration/disintegration)
- **Clifton Strengths:** …
- **The Lie:** [one sentence]

## Essential Identity
[~60w prose]

## Physical Presence
[~150w including sensory anchors]

## Voice & Mannerisms
[~250–400w including Voice Fingerprint vectors]

## Psychology & Personality
[~250–350w, includes Lie/Ghost, and Thematic Posture if the story has one]

## Background & History
[~200–300w]

## Relationships
[~150–250w]

## Story Role & Arc
[~150–250w]
```

Supporting and minor bios collapse sections proportionally — they preserve Voice Fingerprint and Lie/Ghost but condense everything else.

A bio may also carry an optional **`## Revelation Log`** as its final section — a chapter-keyed, append-only list of state changes (injuries, deaths, allegiance shifts, reader-facing reveals) that make the character scene-current at a given chapter. See `references/canon-schemas.md` § Revelation Log. The `blueprint` skill reads it, filtered to `chapter ≤ N`, to fuse current state into a chapter's brief.

## Worldbuilding files (`worldbuilding/<category>/<slug>.md`)

Categories follow the 14-category taxonomy in `references/frameworks.md` § Worldbuilding (Organization / Location / Geography / Object / Vehicle / Weapon / Technology / Magic / Creature / Culture / History / Religion / Languages / Lore). Use the plural directory form for each (`locations/`, `organizations/`, `magic-systems/`, etc.). The manifest tracks whatever exists.

```yaml
---
name: The Heights
category: location
version: 1
last_updated: 2026-05-10
---
```

Body follows one of two formats — **Reference Note** (~200–300w) for real-world elements with story-specific modifications, or **Full Entry** (~300–1,000w depending on category) for invented elements. For section structures, length targets per category, category-specific guidance, and a worked example, see `references/canon-schemas.md` § Worldbuilding Entry Schemas. For the tier framework (Full Canon entry / Reference note / No entry needed) and character-vs-worldbuilding disambiguation, see `references/frameworks.md` § Worldbuilding.

Like character bios, a worldbuilding entry may carry an optional **`## Revelation Log`** as its final section — chapter-keyed state changes for the element (a location damaged in ch 20, a device that gains a new capability in ch 14). Same mechanism and rules as for characters; see `references/canon-schemas.md` § Revelation Log.

## Chapter content — folders, the spine, and the outline view

Chapter content is organized **entity-first**: one folder per chapter (`chapters/chapter-NN/`) holds *every* artifact for that chapter — its outline, blueprint, prose, and refinement notes — as the chapter moves through the pipeline. The cross-chapter **spine** lives one level up, in `outline/`. This is the contract every chapter-stage skill (outlining now; blueprint, prose, and refinement when they land) reads and writes against.

Two layers:

- **Book-level spine** (`outline/`) — the macro plan, shared across all chapters:
  - **`outline/structure.md`** — the structural commitment: framework choice, act boundaries, the chapter spine (one line per chapter slot).
  - **`outline/_index.md`** — the **outline view**: a chapter × stage status matrix, one row per chapter, regenerated as chapters advance. This is the horizontal scan surface.
- **Per-chapter content** (`chapters/chapter-NN/`) — the micro layer, one folder per chapter:
  - **`ch<NN>-outline.md`** — the per-chapter beat sheet (~600–1,000w). Relocated here from the old `outline/chapter-NN.md`.
  - **`ch<NN>-blueprint.md`**, **`ch<NN>-prose.md`**, **`ch<NN>-notes.md`** — pre-prose refinement, generated prose, and post-prose refinement. Written by future skills (see § `chapters/` folder).
  - **`.history/`** — co-located snapshots of this chapter's artifacts.

### Why entity-first, and the naming rule

The macro/micro split is deliberate. `outline/structure.md` is the contract a chapter's `ch<NN>-outline.md` fulfills — a stable spine the user agrees to once, then each chapter folder fills in against it. Keeping a chapter's outline next to its blueprint, prose, and notes means the dominant downstream workloads (prose generation, refinement) gather one chapter's full context from a single folder, and adding a new stage is a new *file*, never a new parallel top-level tree.

**Files inside a chapter folder are chapter-number-prefixed:** `ch<NN>-<stage>.md` — `ch` + the same zero-padded number as the folder + the stage. So `chapters/chapter-17/ch17-outline.md`, `chapters/chapter-08/ch08-prose.md`, `chapters/chapter-21/ch21-blueprint.md`. The prefix is what keeps files self-identifying when viewed flat or referenced via `@` in Claude Code — `outline.md` repeated across 40 folders is invisible; `ch17-outline.md` is not. The folder gives the hierarchy; the prefix gives flat-identifiability.

The horizontal scan that *outlining* needs (read every chapter's outline at once, check continuity seams) is preserved through `outline/_index.md` and recursive globs (`chapters/*/ch*-outline.md`).

### `outline/structure.md` — structural commitment

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

```markdown
## Framework Choice
[~150–300w: which framework, *why this story uses it* (drawing from primer Section 3 if it commits to one), and any deviations from the canonical beat positions. If the primer's Structural Framework section already commits to a framework, preserve that choice and explain how the spine implements it; don't second-guess the primer.]

## Act Structure

| Act | Chapter Range | Treatment Source | Target Words | Beat Anchors |
|---|---|---|---|---|
| 1 | 1–10 | Prologue + Act One | ~25,000 | Opening Image (ch1), Inciting Incident (ch3), Plot Point 1 (ch10) |
| 2A | 11–22 | Act Two (first half) | ~30,000 | Fun & Games (ch11–17), Midpoint shift (ch18) |
| 2B | 23–30 | Act Two (second half) | ~20,000 | Bad Guys Close In, All Is Lost (ch30) |
| 3 | 31–40 | Act Three | ~25,000 | Dark Night (ch31), Break into 3 (ch33), Climax (ch37–39), Final Image (ch40) |

Word counts are the per-act target from primer Section 3's Treatment Word Budget × 6 (treatment-to-novel ratio). Chapter ranges are inclusive on both ends.

## POV Strategy
[~100–200w: who has POV, how often, special rules. If the primer specifies POV strategy, mirror it. Note any chapter-level POV assignments that diverge from the default.]

## Pacing Notes
[~100–200w: where the story accelerates, where it breathes, rhythmic patterns. Anchor to specific chapter ranges.]

## Chapter Spine

A one-line concept for each chapter slot. This is the *contract* — when `outline-chapters` writes a chapter's `ch<NN>-outline.md`, it fulfills the concept on this line. Keep each entry to one sentence: what happens in this chapter, plus POV if multi-POV.

1. **The Auditing Room** — Marlowe at the courthouse, late for her own swearing-in; intro to her competence signature and the Heights. POV: Marlowe.
2. **The First Crack** — A receipt in the audit doesn't reconcile; Marlowe begins the pattern that defines her arc. POV: Marlowe.
3. **The Body in the River** — Inciting incident: Walsh found dead, the case opens. POV: Detective Park.
…
40. **Final Image** — [the closing image that answers the opening].

## Open Structural Questions
[Tracked questions in `questions.md` that block or affect the spine. Reference by ID. Resolve before generating chapter outlines for the affected range.]

- Q-014 unresolved — affects ch3 (inciting incident mechanism) and ch18 (midpoint payoff).
- Q-019 unresolved — affects all Act 3 chapter outlines.
```

The Chapter Spine is the load-bearing element. The pre-outline conversation produces it; chapter outlines hang off it.

### `chapters/chapter-NN/ch<NN>-outline.md` — per-chapter outline

Lives in the chapter's folder, prefixed with the chapter number: `chapters/chapter-17/ch17-outline.md`. Folder and prefix both use the two-digit zero-padded chapter number (`chapter-01/ch01-outline.md` through `chapter-99/ch99-outline.md`; pad to three digits if the story exceeds 99 chapters). ~600–1,000 words target. (This is the relocation of the former `outline/chapter-NN.md` — the schema is unchanged; only the path moved, to sit next to the chapter's blueprint/prose/notes.)

```yaml
---
chapter: 17
title: The Locket
version: 1
last_updated: 2026-05-12
structure_version: 1
treatment_version: 8
primer_version: 4
pov: Marlowe
act: 2A
target_words: 1000
---
```

```markdown
# Chapter 17 — The Locket

## Premise
[1–2 sentences: the dramatic beat this chapter occupies in the story. *"Marlowe finds her father's locket in the audit box and recognizes the engraving from Voss's office; the case becomes personal."* This line should resolve cleanly against the Chapter Spine entry in `structure.md`.]

## Setting & Time
[1–3 sentences: where, when, who's physically present. Concrete and specific — sensory anchors help downstream prose.]

## Scene Beats
A numbered sequence of dramatic beats within the chapter. Each beat is a 1–3 sentence summary of what happens and what shifts. Aim for 3–6 beats per chapter.

1. **[Beat name]** — [what happens; what changes].
2. **[Beat name]** — …

## Setups Planted
- **[setup]** — pays off in ch [N] ([what payoff]).

## Payoffs Delivered
- **[payoff]** — paid setup from ch [N] ([what setup]).

## Character Notes
- **[Character name]**: [what their arc does in this chapter — internal state, key choice, relational shift]. Reference Lie/Ghost when the chapter touches them.
- **[Next character if present]**: …

## Dialogue Anchors
[1–3 dialogue moments that must land. Beat-level or line-level — *"Marlowe to Voss: 'You knew his name.'"* — not a full draft of the conversation. These are the lines downstream prose generation should preserve in shape, not necessarily verbatim.]

## Connections
- **From ch [N-1]**: [the bridge from the previous chapter].
- **To ch [N+1]**: [the bridge to the next chapter].

## Open Threads
[Markers for unresolved elements, using the same conventions as the treatment.]
- [OPEN: Q-019] — [why this question affects this chapter].
- [NEEDS DEVELOPMENT: …] — [what's missing].
```

### Per-section guidance

- **Premise** (≤60w) — the chapter's reason to exist. If you can't write this in one or two sentences, the spine entry probably needs to be sharpened first.
- **Scene Beats** (200–400w) — the chapter's spine. Each beat names what happens *and what shifts*. A beat that doesn't shift something (status, knowledge, relationship, location, internal state) is filler.
- **Setups / Payoffs** — cross-reference primer Section 5 (Setup/Payoff Ledger). Each entry should map to a tracked chain in the ledger; if a chapter introduces a new chain, add it to the ledger during the next treatment-update.
- **Character Notes** (100–200w) — what *changes* for each character in this chapter. Not a status report ("Marlowe is angry"), a delta ("Marlowe stops trusting Park").
- **Dialogue Anchors** (50–150w) — only the lines that *must* land. Don't draft full dialogue at the outline stage; that's prose work.
- **Connections** (50–100w) — the chapter's seams. What's carried from the previous chapter; what's set up for the next. This is what makes the outline readable as a chain.

### Markers for unresolved elements

Both marker types from the treatment apply at the chapter level:

- `[OPEN: Q-###]` — links to a tracked open question.
- `[NEEDS DEVELOPMENT: …]` — for narrative gaps that don't yet have a tracked question.

If a chapter contains either marker, the chapter is still *drafted* (the file exists), not *complete*. The pre-prose readiness check is: zero unresolved markers across the chapter's body.

### Length

Per-chapter target is calibrated from primer Section 3's Treatment Word Budget table. Specifically: **per-chapter outline density ≈ 2× the per-chapter treatment density.** A 120,000-word novel with 40 chapters has ~500w of treatment per chapter, so ~1,000w of outline per chapter is right. For a 60,000-word novella with 20 chapters and ~500w of treatment per chapter, same target. For sparser projects (literary novel with long chapters at lower density), 600–800w is enough.

Don't pad to hit the target. A chapter that genuinely lands in 600w shouldn't be inflated to 1,000w.

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
---
```

```markdown
# Outline View

Generated from `outline/structure.md` and the chapter folders under `chapters/`. Each row shows a chapter's spine concept and its status at each pipeline stage. Status cells: `vN` (artifact exists, version N) · `—` (not started) · plus inline `[OPEN: Q-###]` / `[NEEDS DEVELOPMENT]` flags carried up from the artifact body.

## Act 1: Setup (chapters 1–10)

| Ch | Title / Spine concept | Outline | Blueprint | Prose | Notes |
|----|------------------------|---------|-----------|-------|-------|
| 01 | *The Auditing Room* — late for her swearing-in | [v1](../chapters/chapter-01/ch01-outline.md) | — | — | — |
| 02 | *The First Crack* — a receipt that doesn't reconcile | [v1](../chapters/chapter-02/ch02-outline.md) | — | — | — |
| 03 | *The Body in the River* — inciting incident | [v2](../chapters/chapter-03/ch03-outline.md) `[OPEN: Q-014]` | — | — | — |
| … |  |  |  |  |  |
| 10 | *Plot Point 1: She Commits* | — | — | — | — |

## Act 2A: Fun and Games (chapters 11–22)

| Ch | Title / Spine concept | Outline | Blueprint | Prose | Notes |
|----|------------------------|---------|-----------|-------|-------|
| 11 | *Surveillance Begins* | [v1](../chapters/chapter-11/ch11-outline.md) | — | — | — |
| … |  |  |  |  |  |

## Act 2B: Bad Guys Close In (chapters 23–30)
…

## Act 3: Resolution (chapters 31–40)
…
```

Each row shows:
- Chapter number and title (`title` from the chapter's `ch<NN>-outline.md` frontmatter, or the spine concept's bold phrase if no outline exists yet).
- A status cell per stage: a versioned link to the artifact if it exists (`[v2](../chapters/chapter-03/ch03-outline.md)`), or `—` if that stage hasn't started.
- Inline marker flags (`[OPEN: Q-###]` or `[NEEDS DEVELOPMENT]`) in the relevant stage cell when that artifact carries unresolved markers.

Links are relative from `outline/` into `chapters/` (`../chapters/chapter-NN/...`). The Blueprint, Prose, and Notes columns stay all-`—` until those skills land; they're in the matrix now so the view is stable as the pipeline fills out. The index is regenerated on every chapter-stage run. It is not hand-edited.

## `chapters/` folder — per-chapter content folders

The `chapters/` folder holds one **folder per chapter** (`chapters/chapter-NN/`), and each chapter folder holds *all* of that chapter's artifacts as it moves through the pipeline. This is the entity-first content layer that hangs off the `outline/` spine (see § Chapter content above).

**Folder location:**
- Standalone novel: `<root>/chapters/chapter-NN/`
- Series mode: `<root>/books/<slug>/chapters/chapter-NN/`

**Chapter folder naming:** `chapter-NN`, zero-padded to two digits (three if the story exceeds 99 chapters). **Files inside** are chapter-number-prefixed: `ch<NN>-<stage>.md`.

```
chapters/chapter-17/
  ch17-outline.md      # beat sheet — written by outline-chapters (schema above)
  ch17-blueprint.md    # pre-prose refinement layer ("Blueprint") — future skill
  ch17-prose.md        # the chapter's prose — future skill (or scenes/ when split)
  ch17-notes.md        # post-prose refinement / revision notes — future skill
  scenes/              # OPTIONAL — only when the chapter is genuinely scene-split
    ch17-scene-01.md
    ch17-scene-02.md
  .history/            # co-located snapshots of this chapter's artifacts
```

**Stages are filenames, not folders.** Adding a future pipeline stage means a new `ch<NN>-<stage>.md` file in each chapter folder — never a new parallel top-level tree. The stages, in pipeline order: `outline` → `blueprint` → `prose` → `notes`.

### Blueprint (`ch<NN>-blueprint.md`) — the pre-prose production brief

Lives in the chapter folder, chapter-number-prefixed: `chapters/chapter-17/ch17-blueprint.md`. A **Blueprint** is a single, self-contained context document handed to a prose-writing agent before it writes the chapter — *the prose agent should be able to write the chapter from the Blueprint alone.* It gathers every character and worldbuilding element that will *surface* in the chapter, at the right *resolution* for each (tiered POV → Major → Supporting → Minor → Referenced), with scene-current state fused in, and nothing dormant. Written by the `blueprint` skill. For the full content spec — the Scene-Surface Test, character tiering with word ceilings, worldbuilding selection, the eight required sections, and the quality checklist — see `references/blueprint-spec.md`. This section specifies only the *file shape*.

```yaml
---
chapter: 17
title: The Locket
version: 1
last_updated: 2026-05-12
# Provenance — the versions this Blueprint was built against (staleness detection):
outline_version: 1
treatment_version: 8
primer_version: 4
manifest_version: 2
pov: Marlowe
scene_split: false   # true when the chapter is scene-split and the Blueprint carries per-scene sections
---
```

Body — the eight Blueprint sections (full formats in `references/blueprint-spec.md`):

```markdown
# Chapter 17 Blueprint — The Locket

**Chapter:** 17 — The Locket
**Time:** [time of day / narrative date]
**POV:** Marlowe (third-person limited, past tense)

## 1. Scene Function
[single line, 3–6 words, standard story-structure terminology]

## 2. Characters
[tiered — POV → Major → Supporting → Minor → Referenced; each at its tier's resolution, current state fused in]

## 3. Setting
[single sensory-rich paragraph, 75–100w]

## 4. Main Source of Conflict
[single paragraph, 100–125w — the tension specific to THIS chapter]

## 5. Symbolism and Thematic Layer
[single paragraph, 100–125w]

## 6. Continuity Considerations
[single paragraph, 150–250w — links to prior chapters, foreshadowing, must-stay-consistent, canon-vs-scene resolutions]

## 7. Worldbuilding
[bullet list — each element names its scene trigger + only the dimensions the chapter uses]

## 8. Other Notes
[bullet list, 75–100w — structure, transitions, unresolved threads, tonal target, POV reminders]
```

**Granularity is chapter-level.** One `ch<NN>-blueprint.md` per chapter. The Scene-Surface Test (does this detail surface *in this chapter*?) governs what's included. When a chapter is genuinely **scene-split** (multi-POV, or long enough to warrant `scenes/`), set `scene_split: true` and repeat the Characters / Setting / Conflict / Worldbuilding sections per scene under `## Scene 1 — …`, `## Scene 2 — …` headers — because tiering, POV, and current state can differ scene-to-scene. The Symbolism, Continuity, and Other Notes sections stay chapter-level. Default to the single chapter-level form; reach for the scene-split form only when the chapter actually needs it (matching the prose stage's single-file-vs-`scenes/` rule).

**Scene-current state** comes from two sources, in this order: (1) the **Revelation Log** of each Canon entry, filtered to `chapter ≤ 17` (see `canon-schemas.md` § Revelation Log) — the crude, authoritative timeline of what's changed; and (2) reconstruction from the treatment's chronology and prior chapters' outlines/prose where the log is silent. A Blueprint for chapter 17 **never** writes toward a Revelation Log entry dated after chapter 17 — that's future state.

### Prose (`ch<NN>-prose.md`) and scenes

Prose is **one file per chapter by default** (`ch<NN>-prose.md`). Treatment scenes don't map 1:1 to chapters, so when a chapter is genuinely scene-split, the prose moves into a `scenes/` subfolder (`chapters/chapter-NN/scenes/ch<NN>-scene-MM.md`) and `ch<NN>-prose.md` is omitted or becomes a stitched-together read. Default to the single file; reach for `scenes/` only when the chapter actually needs it.

The `blueprint` schema is defined above. The full schemas for prose and notes — and the skills that write them — land when prose-writing functionality is added (post-POC). They are named here now so the folder contract is stable and future skills have a defined home. Prose-stage frontmatter will carry the version stamps that make staleness detection work (`outline_version`, `blueprint_version`, `treatment_version`, `primer_version`, `status`, `word_count`):

```yaml
---
chapter: 17
title: The Locket
version: 1
last_updated: 2026-05-12
# Populated by the prose-writing skill set:
outline_version: 1
treatment_version: 8
primer_version: 4
status: drafted | revising | approved
word_count: 4127
---
```

### Per-chapter history (`.history/`)

Chapter artifacts revise frequently and locally, so their snapshots are **co-located** in the chapter folder rather than in the central `.storystormer/history/`. Snapshots are flat, version+date-named files:

```
chapters/chapter-17/.history/
  ch17-prose-v2-2026-06-21.md     # the draft at v2, archived when a rewrite produced v3
  ch17-outline-v1-2026-06-18.md
```

Pattern: `ch<NN>-<stage>-v<version>-<YYYY-MM-DD>.md`. The `version` is the superseded draft's frontmatter version (each version is archived at most once, so it's always unique); the date is chronological context only. Flat files, **not** per-snapshot subfolders — chapter artifacts revise one at a time, so the central log's folder-grouping (which bundles the primer+treatment pair) would be empty ceremony here. The rule: *snapshot granularity matches what-changes-together.* See § `.storystormer/history/` for the book-level mechanism.

### Intake-stashed prose (`storystormer-init`)

The only chapter content created in the POC comes from `storystormer-init`'s intake, when the user brings in pre-existing prose. Init stashes each detected chapter as `chapters/chapter-NN/ch<NN>-prose.md` (markdown), or preserves the original extension (`ch<NN>-prose.docx`, etc.) when the source isn't markdown — flagged in the report, since prose-writing skills will require markdown.

For intake-stashed prose, init populates only `chapter`, `title` (from the file's H1 or filename if discoverable), `version: 1`, and `last_updated`. The remaining frontmatter fields are populated by future prose-writing skills. **Body**: raw user content — preserve verbatim, do not rewrite or normalize.

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

Series-scoped open questions from `questions.md`, surfaced here for quick reference. Linked by Q-ID.

- Q-031 (critical, plot) — Does Maya leave Washington at the end of book 1?
- Q-032 (important, character) — Does Reyes ally with Maya in book 3, or remain adversarial?
- Q-033 (important, theme) — Does the series end on hope (reform succeeds) or warning (reform fails)?
```

### Length and discipline

Target total length: **2,000–3,000w**. Series.md is a *lower-frequency, higher-leverage* document than per-book treatments. Don't pad it with content that belongs in per-book treatments or in character bios. The Cross-Book Setups and Payoffs section is the load-bearing element; everything else exists to give it context.

### When series.md is regenerated vs. patched

For light updates (a new cross-book chain identified, a continuity concern logged, an open question added), patch the relevant section in place. For structural shifts (the series arc changed, a book's role flipped from sequel to prequel, a major decision rippled across the arc), regenerate the whole document. Snapshot the old version to `.storystormer/history/<timestamp>-series-update/series.md` before any structural regeneration.

## `.storystormer/config.json`

```json
{
  "title": "The Pattern Recognition",
  "project_type": "novel",
  "genre": "literary thriller",
  "genre_secondary": null,
  "created": "2026-05-11",
  "surfacing_mode": "active"
}
```

Mirrors a subset of `state.md` frontmatter, in JSON for any tooling that wants to read it programmatically. Treat `state.md` as the source of truth; `config.json` is a convenience mirror.

For series-mode projects, `config.json` carries the series fields:

```json
{
  "title": "Inauguration Day",
  "project_type": "series",
  "genre": "political thriller",
  "genre_secondary": null,
  "created": "2026-05-24",
  "surfacing_mode": "active",
  "books": [
    { "slug": "book-1", "title": "Inauguration Day" },
    { "slug": "book-2", "title": "The Aftermath" },
    { "slug": "book-3", "title": "Reckoning" }
  ],
  "current_focus": "book-1"
}
```

The `books` array preserves both slug (for filesystem paths) and human-readable title (for display). Adding a book is a config + folder operation; renaming a book updates only the title (slug stays stable to avoid breaking paths).

## `.storystormer/history/` — book-level history

This is the **book-level** snapshot mechanism. Before any rewrite of `primer.md`, `treatment.md`, `manifest.md`, `outline/structure.md`, `series.md`, or a character bio, snapshot the current versions into a timestamped folder:

```
.storystormer/history/
└── 2026-05-11T14-33-treatment-update/
    ├── primer.md
    ├── treatment.md
    └── manifest.md
```

The folder name encodes both the timestamp and the operation. It uses **per-snapshot folders** because a single operation often archives several files **as a set** — primer and treatment are snapshotted as a pair during treatment updates, since the primer version that built a treatment is meaningless without the treatment it informed.

**Chapter-level artifacts use a different mechanism.** Per-chapter content (outline/blueprint/prose/notes) revises frequently and one file at a time, so its snapshots are co-located in the chapter folder as flat, version+date-named files (`chapters/chapter-NN/.history/ch<NN>-<stage>-v<version>-<date>.md`) — not here, and not in per-snapshot subfolders. See § `chapters/` folder → Per-chapter history. The split is by altitude: book-level docs (which change as a set) snapshot centrally in folders; chapter-level artifacts (which change individually) snapshot locally as flat files. Both key on the frontmatter `version` integer.

Since we are git-agnostic, this is the only versioning. Don't auto-prune; let the user clean up history manually if they want to.
