---
name: treatment-update
description: Regenerate the treatment, and the primer when a premise, theme or structure decision calls for it. Use for “update the treatment,” “refresh the primer,” “let’s see where we are,” or when decisions pile up.
---

# StoryStormer · Treatment Update

You are running the two-phase treatment update pipeline — the workflow's most important generative skill. The output is the canonical view of the story: a four-section `primer.md` (story craft dossier, rewritten only when a premise, theme or structure decision or the author asks) and a fresh `treatment.md` (full prose treatment) that reflect all the decisions, character work, and worldbuilding done since the last update.

This skill mirrors the StoryStormer web app's `treatment_update` background job. The model is the orchestrator.

Always follow `references/plan-first.md` — propose the plan with file lists, confirm with the user, then execute the two phases.

## What you produce

- **`primer.md`** — bumped to the next version. The story craft dossier — **50,000-foot front-matter** — with four standard sections: Story Identity / Premise & Moral Argument / Structural Framework / Tone, Style & Writing Rules, at the depth the story has earned (a guide of about 5,000 words, never a trimming target). It is written only when a premise, theme or structure decision (or the author) asks, plus on a first run. See `references/file-schemas.md` § `primer.md`.
- **`treatment.md`** — bumped to the next version. Full prose treatment written in propulsive treatment voice. `primer_version` set to the new primer's version. Length calibrated by the budgets computed from `target_word_count` (`references/file-schemas.md` § Target word count and the derived budgets). See `references/treatment-voice.md` and `references/file-schemas.md` § `treatment.md`.
- **Snapshots** (per `store.md`) of the *current* primer and treatment **as a pair**, before overwriting. They round-trip together; never snapshot one without the other.
- Updated decision entries — each decision consumed by this update gets `integrated: "yes (<date>)"`, and its row in `decisions/_index.md` follows. So does each **settled carried-over decision**: one with no `integrated` at all (carried over by the layout upgrade from a log that never marked it), which is checked against the current treatment rather than integrated blindly. Already reflected there → `integrated: "yes (<date>)"` with no prose rewritten; not reflected → it is pending like any other.
- Updated `state.md` — version bumps, summary refresh, `What's Next` updated, a short Last Session.
- The session's journal entry (`journal/<date>-s<NN>.md`) — what this update integrated and changed, and why.

## Operating philosophy

### First-run vs update mode

Determine which mode you're in before applying any other rule:

- **Update mode (default).** A non-empty `primer.md` and `treatment.md` exist. Your job is to integrate pending decisions while preserving what already works. The rules below describe update-mode behavior.
- **First-run mode.** `primer.md` and/or `treatment.md` are empty or just-stubbed. Typical for newly initialized projects, or when intake-extracted content needs scaffolding into the canonical structure. In first-run mode, **construction** is the default — not preservation. Use project metadata + decisions + any existing materials to scaffold each primer section. Mark sections without source material as `**For Further Development**: …`. Scaffolding is not fabrication — don't invent story content to fill a blank.

When the primer exists but some sections are populated and others empty, you're still in update mode — apply update-mode behavior to the populated sections, first-run construction to the empty ones.

### Conservative by default (update mode)

The Story Primer is the story's intellectual foundation. Treat it carefully:

- **Preserve what's working.** When the primer is rewritten, every section is reproduced exactly as it stands unless a pending decision or the author's instructions require a change. Never reword, condense or reorganize for its own sake, and never trim to a word budget. Don't churn prose that's already landed.
- **Change only what decisions require.** Every edit must trace to a specific pending decision. Don't change Story Primer content to match the old treatment — the treatment updates separately.
- **Don't embellish.** No adding comparable works, writing rules, or structural analysis the author didn't brainstorm. Integrate decisions; don't freelance.

### Decisions are authoritative

When a pending decision contradicts the existing primer or the old treatment, **trust the decision**. The Story Primer phase runs before the Treatment phase, so contradictions between decisions and the old treatment will be resolved when Phase 2 rewrites the treatment. Don't flag those as problems in Phase 1 — they're pending, not broken.

DO flag genuinely broken chains unrelated to pending decisions (pre-existing inconsistencies). DO flag setup/payoff chains in the old treatment that have no payoff written yet — a settled chain is stated in the treatment's narrative where it is planted (Phase 2); if the payoff is genuinely undecided, log it as an open question, a new entry in `questions/` (`source: treatment_update`). Don't reintroduce a running ledger, and never put one in the primer.

### Framework attribution preservation

If the existing primer cites a framework by name (Save the Cat, Truby's 22 Blocks, Seven-Point, etc.), **preserve that attribution verbatim**. Do not relabel, re-route, or second-guess the author's framework commitment. If a pending decision *introduces* a new framework attribution, integrate it. For first-run mode with no existing attribution, you may hedge-attribute frameworks the materials clearly exhibit — write *"consistent with Save the Cat's 15-beat pattern"* rather than *"this is a Save the Cat story."* Do not impose a framework when the materials resist conventional structure — see `references/alt-structure.md`.

## What to do

### 1. Pre-flight read

Load:

- `primer.md` (full — all four sections if it exists)
- `treatment.md` (full)
- `manifest.md` (full)
- All major-tier character bios (full)
- `decisions/_index.md`, then every **pending** decision entry: one whose `integrated` starts with neither `yes` nor `n/a` (`no`, `partially`, or missing; `n/a` is settled, never pending) — full reads of those entries; the integrated ones stay unread unless a pending decision cites or supersedes one. The ones with no `integrated` key are checked against the treatment first: those it already reflects are settled (marked `yes`, nothing rewritten), and only the rest join the pending set
- `questions/_index.md`, then the open question entries (so unresolved questions can be marked `[OPEN: Q-###]`)
- `state.md` (full), including `target_word_count` (in a series, the focused book's own target from `books/<slug>/state.md` when it has one, else the series-level value; unset means the project type's default)
- `.storystormer/genre-reference.md` if it exists

This is the canonical heavy-context turn. **Operate in substantive mode** — list the files at the top of your next response, read each one with `store.read` (full read, beginning to end), and quote at least one passage from each in your output. See `references/reading-discipline.md` § Substantive mode.

### 2. Propose the plan

> Here's the plan for the treatment update:
>
> - **Read** (substantive mode): I'll full-read `primer.md`, `treatment.md` (~6,800w), `manifest.md`, the 4 major bios (~4,800w combined), the 7 pending decision entries, and the 6 open question entries — then quote at least one passage from each in my next response to prove the absorption.
> - **Phase 1 — Primer**: only if a premise, theme or structure decision is pending (or you ask), so I'd rewrite `primer.md` to fold in the decision about the antagonist's motivation shifting the moral argument. Every section is reproduced exactly except the Premise & Moral Argument section. Bump primer version 3 → 4. (With only plot and character decisions pending, I'd skip this phase and say so.)
> - **Phase 2 — Treatment**: regenerate `treatment.md` against the primer in treatment voice. I expect a meaningful rewrite of the Act 2 midpoint and a lighter pass on Acts 1 and 3. Bump treatment version 7 → 8.
> - **Snapshot**: current primer.md + treatment.md, as a pair, per `store.md`.
> - **Mark**: the 7 pending decisions as `integrated: yes (2026-05-11)`. Of the 22 carried-over decisions with no `integrated` line, 18 are already in the treatment and are marked `yes` with nothing rewritten; the other 4 are among the 7.
> - **Open elements**: I'll keep `[OPEN: Q-019]` and `[OPEN: Q-021]` markers in the treatment for the two unresolved critical questions, and add a `[NEEDS DEVELOPMENT: …]` marker for Elena's Act-3 infiltration mechanics (no tracked question yet).
>
> About 5–8 minutes once we start. Anything to adjust?

### 3. Read in substantive mode

Once the user gives the go-ahead, read every file in the list — `store.read` (full read, beginning to end), no grep, no skim. As you read, take inventory of:

- **Characters and roles** — who does what, with quoted passages from the treatment.
- **Plot beats** — the major beats Act-by-Act.
- **Subplots** — what they are, who carries them, how they connect to the main arc.
- **Themes** — the central thematic question and how it's dramatized.
- **Structural framework** — act structure, turning points, POV strategy, pacing patterns the existing primer specifies.
- **Setup/payoff chains** — planted setups and their intended payoffs, foreshadowing threads (these live in the treatment's narrative, never the primer).
- **Character dynamics** — relationship map, factions, power dynamics, secrets (these live in the manifest's Character Map, never the primer).
- **Tone, style & writing rules** — narrative voice, register, rendering rules, anti-patterns.
- **Open threads** — what the treatment marks as `[OPEN: …]` or `[NEEDS DEVELOPMENT: …]`.
- **Unintegrated decisions** — what they say, what they affect, how they should shift the primer/treatment.
- **Genre obligations** — from `genre-reference.md`, what obligatory scenes the treatment hits or misses.

In your first response after the reading pass, quote at least one verbatim passage from each source file (primer, treatment, manifest, each major bio, the pending decision entries). This proves you absorbed the source. If you find yourself wanting to assert something the source doesn't directly state, surface it as a question instead. The treatment is the source of truth; genre priors are not.

### 4. Phase 1 — Story Primer (four sections)

**The gate.** Write the primer only when (a) no primer exists (first run), (b) a pending decision has `decision_type` premise, theme or structure, or (c) the author explicitly asks to update it. Plot, character and worldbuilding decisions never reopen it. When the gate is closed, skip this phase, say so in the plan ("Primer skipped: no premise, theme or structure decision"), and go straight to the treatment.

Rewrite `primer.md`. The Primer is **50,000-foot front-matter** with **exactly four standard sections** (full section spec in `references/file-schemas.md` § `primer.md`):

1. **Story Identity** — logline, genre and subgenre, comparable works, target length.
2. **Premise & Moral Argument** — central dramatic question, moral argument, core conflict architecture.
3. **Structural Framework** — the broad act design (the model and what each act does; never chapter or scene beats), escalation logic, POV strategy, timeline structure, pacing, and a slot for **the project's own structural rules** (e.g. a story that holds one character's POV throughout except one scene). Subsection names follow the project, not a fixed list. No word-budget table: budgets are computed, not stored.
4. **Tone, Style & Writing Rules** — narrative voice, tonal register, rendering rules for the story's systems, dramatic irony, anti-patterns.

There is no Character Dynamics section, no thematic positions, no want/need, no Reveal Architecture or Setup/Payoff Ledger, and no dialogue conventions in the Primer.

**Editing posture — the whole primer is rewritten, but only what a decision requires changes.** The primer is the story's intellectual foundation. You return the complete document, and you reproduce every section exactly as it stands unless a pending decision or the author's instructions require a change. Within a section a decision touches, change only what the decision requires; never reword, condense or reorganize for its own sake, and never trim untouched material. There is no word budget to land: if the primer runs past about 5,000 words, say so in your report and nothing else.

**One home per decision type.** Premise, theme and structure live in the primer. Plot lives in the treatment (narrative only; each plant or setup is stated in the narrative where it is planted, so the outline can seed it into the right chapter). A character's ghost, lie, want, need and voice live in that character's bio, and thematic positions, parallels, dialogue conventions and character dynamics in the manifest's Character Map. Rules of the story's world live in the canon entry and the manifest inventory.

**The razor — eject, don't absorb.** If the existing primer carries content with another home (a "Setup/Payoff Ledger," Reveal Architecture, Character Dynamics, thematic positions, dialogue conventions, an "Open Questions" list, a beat sheet), do not carry it into a standard section. Open questions → entries in `questions/`; reveals and plants → the treatment's narrative; character material → bios and the manifest's Character Map; invented systems → canon; beat sheets / scene-level narrative → `treatment.md`. Ejected content is preserved in the snapshot. Say what you ejected and where it should land; don't silently drop it.

**Decision routing.** Use `decision_type` (or the decision content) as a hint:

| Decision type | Home |
|---|---|
| `premise` | Section 1 (identity), Section 2 (premise, moral argument) |
| `theme` | Section 2 (moral argument); Section 4 when it settles tone or voice; the manifest's Character Map if a character's position moves |
| `structure` | Section 3 (Structural Framework) |
| `plot` | **The treatment**, not the primer. The primer never reopens for it |
| `character` | The character's bio and the manifest's Character Map, not the primer |
| `worldbuilding` | Canon entries and the manifest inventory, not the primer |
| `process` | None. It governs the author's working method, never the story: set `integrated: n/a` and keep it out of the primer and treatment. |

A decision that surfaces an unresolved story problem is an **open question** (an entry in `questions/`), not primer content.

**No word-budget table in Section 3.** An existing primer that still carries a "Treatment Word Budget" table loses it on this pass (the razor: the numbers are computed from `target_word_count` every run, so a stored copy only goes stale). If the author wants weighted act proportions, Section 3 states them in prose and the budget calculation honors them.

**Conflict resolution.** When two decisions contradict each other about the same story element, resolve using this priority:

1. **Recency** — more recent decisions take precedence.
2. **Thematic consistency** — prefer the resolution that serves the moral argument.
3. **Reveal preservation** — prefer the resolution that keeps the story's load-bearing reveals intact.
4. **Narrative coherence** — prefer what preserves more story options.

Document any conflicts you resolved and your reasoning in the section where they land.

**Primer voice.** Structured, concise, reference-oriented. Declarative statements (*"The novel uses close third-person POV"*), present tense for specifications, specific concrete language. Avoid hedging unless genuinely uncertain. The Primer is a craft document, not a narrative.

Show the new primer to the user. If they want adjustments, fold them in. Don't move to Phase 2 until the primer is settled — Phase 2 depends on it (especially Section 3's act structure).

### 5. Phase 2 — Treatment

Rewrite `treatment.md` against the primer and the source files you full-read in Step 3. The treatment is a *prose document* written in **treatment voice** — see `references/treatment-voice.md` before writing anything in this phase. The before/after example in that file teaches the difference between dry summary and treatment voice; an agent that skips it drifts into Wikipedia plot summary.

#### Write the story, not the analysis

The treatment is *narrative*, not analysis. You do NOT:

- Create analytical subsections in the treatment (*"Tonal Architecture," "Structural Mechanism," "Character Positions," "Beat Sheet," "Staging Options," "Key Thematic Parallel"*).
- Write meta-commentary about the story's structure (*"This sequence serves as the thematic engine of the recruitment arc"*).
- Include design rationale (*"This staging was chosen over Option A because…"*).
- Reproduce brainstorm decision text as-is. Decisions are raw material; you integrate their *meaning* into narrative voice.

When a decision contains analytical material (e.g., *"The prologue should use a two-part structure — warm workplace register followed by sudden catastrophe"*), integrate the *result* into the treatment narrative — write the warm workplace register; write the sudden catastrophe. The analysis stays in primer Section 4.

**Plants are stated where they are planted.** The treatment is narrative only: no non-narrative sections. When a clue or setup is planted, the narrative says what it really is and where it pays off (*"the round in the doorframe is a tell Nolan can't name yet; Andrew explains it in Act One"*). This is load-bearing: the outline can only seed a plant into the right chapter if the treatment states it.

#### What you write comes ONLY from these four sources

Treatment content must trace to one of:

1. **The existing treatment** — preserved verbatim where unaffected by decisions.
2. **A pending decision** — integrated at the correct chronological location.
3. **A ripple effect from a decision** — updating a downstream passage for consistency.
4. **Connective tissue** — brief transitional sentences needed to make the above read smoothly.

You do **not** invent new scenes, plot events, character actions, or dramatic details beyond what the decisions and existing treatment provide. If the story has a narrative gap — a place where structure implies content that hasn't been brainstormed — insert a `[NEEDS DEVELOPMENT: …]` marker (see Markers below). Do not fill gaps with invented material, no matter how plausible it seems. The author develops those gaps through future brainstorming sessions.

#### Preserve existing prose verbatim where unaffected

Your primary obligation is to **reproduce passages that aren't touched by decisions verbatim**. Do not rewrite passages that are already good. Do not rephrase for variety. Do not "improve" prose that wasn't touched by decisions. The author built the treatment over multiple sessions — each passage was written with care. Your job is to integrate, not to rewrite the document from scratch.

For voice preservation when integrating new material into existing prose, see `references/treatment-voice.md` § Voice preservation — including the six common drift patterns to catch and avoid.

#### Decision integration mechanics

- **Plot decisions** → integrate at the correct chronological location. Capture the decision's *meaning* — character actions, emotional stakes, cause-and-effect chain — in treatment voice at treatment density. Condense supporting details (visual descriptions, dialogue notes, choreography) into efficient prose. You are writing a *condensed treatment*, not transcribing the decision.
- **Decisions affecting only the primer** → skip in Phase 2 (Phase 1 already handled them).
- **Decisions with both analytical and narrative components** → integrate the narrative component; leave the analytical component to the primer.
- **Ripple effects** → when an upstream decision changes something, check downstream for inconsistencies. Common patterns:
  - **Character motivation change** → scenes driven by that motivation may need updating.
  - **Plot event added/removed/moved** → setup/payoff chains that depend on it may break.
  - **Setting change** → scenes using that setting may need updating.
  - **Character relationship change** → interactions between those characters may need adjustment.
  Be conservative — only update passages where the inconsistency is *material*, not tangential.
- **Conflicting decisions** → same priority as Phase 1: Recency > Thematic consistency > Reveal preservation > Narrative coherence.

#### Treatment word budget

Compute the budget from `target_word_count` per `references/file-schemas.md` § Target word count and the derived budgets: the treatment total is a sixth of the target, split across acts 25/50/25 for three acts (evenly otherwise, or by the weights Section 3 states), with a per-chapter density for sizing scenes. Enforcement:

- **Act-level ceiling (hard constraint).** No act's treatment content may run more than 15% over its computed share. The share is a ceiling, not a target: an act whose material is fully decided lands near it; an act with thin or no decided material is sized by what the decisions support (Early development, below), with its gaps marked, and can sit far under. Never expand a developed act toward near-prose to make up for an undeveloped one. Scenes within an act can vary, but the act total is the constraint.
- **Scene sizing.** Use the per-chapter density average to gauge how much treatment each scene warrants. A scene covering ~3 chapters of novel material gets ~3× the per-chapter average; a brief transitional scene covering half a chapter gets ~half.
- **Early development.** When only part of the story is developed (e.g., just a prologue), size to the per-chapter average. A prologue covering ~2–3 chapters in a 40-chapter novel gets ~1,000–1,500w of treatment, not 5,000.
- **Discipline.** Never pad to hit a word count — density is a virtue.

#### Markers for unresolved elements

Two marker types:

- `[OPEN: Q-###]` — links to a tracked open question, `questions/Q-###.md`. Use when a specific question has been logged. An ID you propose for a new question is provisional: the store assigns the number when the entry is created with `new` and reports it (`references/store.md` § New entries), and from then on that reported ID is the question's ID, so create the entry before writing any marker that cites it.
  > *`[OPEN: Q-014] — How does Marlowe discover the time loop? Three plausible directions: A, B, C.`*
- `[NEEDS DEVELOPMENT: …]` — for narrative gaps that don't yet have a tracked question. Use when story structure implies content that hasn't been brainstormed.
  > *`[NEEDS DEVELOPMENT: Elena's infiltration mechanics. We know she gets into Voss's compound by Act 3 — we don't yet know how.]`*

Both make downstream consumers see what's not yet decided. Don't fake it; an honest marker is better than a confabulated answer.

When pending decisions address a gap that was previously marked, **replace the marker with developed treatment content**. Look for existing markers in the treatment you're updating — if the assigned decisions fill the gap, write the new content in treatment voice and remove the marker.

#### Header conventions (see `references/file-schemas.md` § `treatment.md`)

- `##` for act-level divisions (`## Prologue`, `## Act One: The Impossible Threat`).
- `###` for scenes or sequences within acts (`### The Walsh Assassination`).
- Scenes are NOT chapters — use evocative names, not chapter numbers.

#### Targeted edits vs full rewrite

If `treatment.md` exists and the change is narrow (e.g., only Act 2 shifted), prefer **targeted section edits** — preserve voice and prose that's already working. If the change is sweeping (premise shifted, major character renamed, structural rework), a full rewrite is right.

Always bump `version` and set `primer_version` to match the primer that was used.

Show the new treatment to the user. For long treatments, summarize what changed before pasting the whole thing — *"the Act 2 midpoint is reworked (now Marlowe finds the locket, not the audit trail); Act 1 has a one-paragraph adjustment to set up the new midpoint; Act 3 is unchanged."* Then show the full text or just the changed sections, as the user prefers.

### 6. Post-update bookkeeping

After the user approves the new treatment:

- Create or extend the session's journal entry first (created with `new` if this is the session's first write; `references/file-schemas.md` § `journal/`).
- Create any new question entries (`new`, each with its row in `questions/_index.md`; in a series, with `scope` and `affects_books` per `references/series.md` § Scoping decisions and questions), so every `[OPEN: Q-###]` in the new treatment carries the ID the store reported.
- Write the snapshot per `store.md` — both the old primer and the old treatment, as a pair.
- `store.write` the new `treatment.md`, and the new `primer.md` only when Phase 1 ran (a skipped primer keeps its version, and the snapshot then covers the treatment alone).
- For each decision consumed by this update, and each carried-over one the pre-flight found already reflected, edit its entry to set `integrated: "yes (<date>)"` (removing or updating an old `**Integrated into treatment**:` body line it carries, so the two agree), and replace its row in `decisions/_index.md`.
- Extend the journal entry with the update, using the IDs the store reported (and correcting any proposed number it already names: `references/file-schemas.md` § `journal/`, IDs as the store reported them): the decisions integrated, the questions opened, what changed in the primer and the treatment and why.
- Update `state.md`:
  - `What Exists → Primer` and `Treatment` lines bumped to new versions and the new `built_from_decisions` list.
  - `Summary` refreshed.
  - `unintegrated decisions` count reset.
  - `Last Session` set to two or three sentences and the journal entry's path; the detail lives in the journal.
  - `stage` advanced if appropriate (`brainstorming` → `treatment-drafted` after a first comprehensive treatment; `treatment-drafted` → `treatment-refined` after a polish-pass). `initial_maturity` never changes.
  - `What's Next` updated, forward items only — typically: resolve the next critical/important questions; if the manifest hasn't been updated in a while, suggest `manifest-sync`.

### 7. Report

> Treatment updated. Primer v4 (four sections, rewritten for the premise decision), treatment v8. Snapshot saved. 7 decisions marked integrated. Two open questions still flagged in the treatment (Q-019, Q-021), plus one `[NEEDS DEVELOPMENT]` marker on Elena's Act-3 infiltration mechanics. Act 3 is ~1,900 of its ~5,000w share: its back half isn't decided yet. Recommended next step: resolve Q-019 (Marlowe's relationship to the antagonist) in a brainstorm session — it's the highest-priority unresolved one.

#### Outline staleness flag

If `outline/structure.md` exists, check whether the treatment change invalidates the spine. Two cases:

- **Light treatment refresh** (Act 2 midpoint tightened, no scene additions, no character role shifts) → `structure.md` likely still valid; existing chapter outlines may still be valid; flag any chapter outlines whose `treatment_version` frontmatter is now stale and recommend `outline-chapters` single-chapter revisions for the affected slots.
- **Structural treatment change** (a new act break, a character renamed, a major plot event added or removed, the climax mechanism changed) → `structure.md` is likely stale; recommend `pre-outline-session` to re-derive the spine before any chapter outlines are refreshed.

Include the staleness call in the report so the user knows the downstream impact. Example: *"This treatment change shifts the midpoint from ch 18 to ch 20 in the spine — outline/structure.md is now stale. Recommend `pre-outline-session` to re-derive the first half of the Act 2 spine before refreshing chapter outlines 17–22."*

## Series Mode

If `state.md` shows `project_type: series`, read `references/series.md` first. Treatment updates in series mode operate on the **focused book's** primer and treatment (`books/<current_focus>/primer.md` and `books/<current_focus>/treatment.md`). The two-phase pipeline is unchanged — primer first, treatment second — but the file paths route through the focused book.

Session bookkeeping goes to the root: the book's `state.md` takes its Summary, What Exists, What's Next and Last Session, and the root `state.md` takes `session_count` and `last_session` (`references/series.md` § Series-level `state.md` vs per-book `state.md`).

Three additions in series mode:

1. **Also load `series.md`** during the pre-flight read. The series arc, cross-book setups, and continuity concerns inform the focused book's treatment refresh — especially the treatment's planted setups, whose load-bearing reveals must respect cross-book chains (tracked in `series.md`) that span beyond this book.
2. **Filter decisions by scope.** Only integrate decisions whose `scope` is the focused book OR is `series` with the focused book in `affects_books`; the index's Scope column narrows the candidates, and each `series`-scoped candidate still needs its `affects_books` checked: read that entry's frontmatter (or parse its Integrated cell, which names each book it touches) before counting it in. Decisions scoped to other books are not consumed by this update — they stay pending for their book's treatment.
3. **Surface series-level impact in the report.** When the treatment refresh affects cross-book chains (a setup that pays off in a later book, a character state that book N+1 starts from), call it out explicitly: *"This treatment change moves Maya's confrontation with Senator Vance from ch 35 to ch 38. Book 2's opening currently assumes Maya leaves Washington after ch 35 — recommend a brainstorm session on book 2's opening, or a series.md patch to update the Continuity Concerns section."*

The `integrated` field on consumed decisions becomes book-aware. For a series-scoped decision integrated into the focused book's treatment, set the book's item to `yes (date)` and leave other books' items untouched:

```yaml
integrated:
  - book-1 treatment yes (2026-05-24)
  - book-2 treatment no
  - book-3 treatment no
```

If the treatment refresh structurally affects `series.md` (a cross-book chain changed, the book's arc summary needs updating in the Per-Book Synopses section), recommend a `series.md` patch as a follow-up in the report — don't auto-patch series.md from within `treatment-update`. Series.md updates are conversational; this skill stays focused on the per-book primer+treatment cycle.

## The two-phase rationale

Phase 1 (primer) first, then Phase 2 (treatment) — *not* both in one pass. The reasons:

- The primer is a **structural index** of the story. If we generate the treatment in the same pass, the model is doing too many things at once and the texture suffers.
- The primer informs the treatment's grounding. A clear primer (especially Section 3's structural framework) produces a tighter, better-calibrated treatment.
- The user can intervene between phases. If the primer is off, the treatment based on it would be worse — better to catch the issue at the primer step.

This mirrors the StoryStormer web app's `treatment_update` job design (which itself was the RF1–RF3 split from the earlier single-prospectus design). The two-phase approach consistently produces better output than single-pass.

## Reading discipline

This is the canonical heavy-context turn. **Always** operate in substantive mode (see `references/reading-discipline.md` § Substantive mode). **Never** grep the treatment when generating the primer. **Always** quote from each source file in your output — the quotes are the proof that you read.

Every claim about story content in the new primer or treatment must trace to a source — a decision, a bio, the prior treatment, or the manifest. If you find yourself reaching for genre priors instead of source material, stop. Re-read the relevant file. The source has the answer.

## Subagent Dispatch

A treatment-update reads the primer, the treatment, the manifest, decisions, questions, *and every major-tier character bio*. For a project with 4+ major bios totaling 6,000+ words plus a 6,000-word treatment, that's already substantial context, and series mode amplifies the cost (cross-book bios reach into all three books' arcs).

Dispatch read subagents per `references/subagent-pattern.md` when:

- The combined bio reads exceed ~10,000 words (3+ major-tier bios in a single-novel project, or any series-mode bio set).
- A book's treatment exceeds ~6,000 words.
- The pending decisions count is high (10+ entries), making decisions-extraction a heavy read in itself.

**Suggested subagent grouping for a heavy treatment-update:**

1. **Bios subagent** — full-reads every major (and supporting, in series mode) bio in scope. Returns per-bio summary with quoted excerpts focused on Voice Fingerprint, Lie/Ghost, Thematic Posture, and the per-book sub-arcs (series mode).
2. **Cross-book bios subagent** (series mode only) — reads each book's treatment to surface the focused-book character's actions across the series, for series-aware plant statements in the treatment and cross-book chain fidelity.
3. **Decisions filter subagent** — reads `decisions/_index.md` and the pending entries it lists (not `yes`, not `n/a`), returns just those scoped to the focused book or series-with-this-book-affected, plus quoted excerpts and the categorical mapping to primer sections.

The main session retains direct reads of `primer.md`, `treatment.md`, `manifest.md`, and `series.md`. These are *judgment-bearing* artifacts that the two-phase pipeline writes against — the main session must absorb them itself, not via summary, because both phases depend on their full texture.

The same anti-confabulation discipline applies: subagent returns must include verbatim excerpts. Reject and re-dispatch quote-free returns. Every brief carries the store block from `references/subagent-pattern.md` § Mandatory brief fields.

For incremental treatment updates against a small project (1 protagonist bio, short treatment, 2 pending decisions), direct main-session reads are fine — subagent overhead would exceed benefit.

## What this skill does not do

- Generate or update character bios. That's `character-bio`. (If a treatment update reveals a bio gap, surface it in the report and recommend `character-bio` as next.)
- Refresh the manifest. That's `manifest-sync`. The treatment update may rename or reshape elements, but updating the inventory file is a separate operation. (Recommend `manifest-sync` in the report if the treatment changed meaningfully.)
- Generate or update worldbuilding entries. That's `worldbuilding-entry`. (If a treatment update reveals a worldbuilding gap, surface it in the report.)
- Generate or update the chapter spine. That's `pre-outline-session`. If a treatment update structurally invalidates `outline/structure.md`, surface it in the staleness flag above and recommend `pre-outline-session` — don't unilaterally edit the spine.
- Generate or revise per-chapter outlines. That's `outline-chapters`. Flag stale chapter outlines in the report.
- Generate prose. Not in this POC's scope.

## References

- `references/plan-first.md` — universal plan-first behavior
- `references/file-schemas.md` — `primer.md` (four sections), `treatment.md` (header conventions, markers, length), § Target word count and the derived budgets, `series.md` schema, scope on decisions/questions
- `references/reading-discipline.md` — full-read rules, substantive mode, Zoom Selection
- `references/subagent-pattern.md` — **read when bios + treatment combined would consume substantial main context** (typically series mode or 3+ major bios)
- `references/series.md` — **read when `project_type: series`** (focused-book path resolution, series.md impact, scope filtering)
- `references/treatment-voice.md` — Treatment voice, before/after example, genre modulations, voice preservation drift patterns
- `references/philosophy.md` — what a good treatment privileges
- `references/frameworks.md` — vocabulary for shaping the primer (Section 2 + 3 + 6 framework attribution)
- `references/alt-structure.md` — when conventional structure resists the story
- `references/genres.md` — obligatory scenes check
