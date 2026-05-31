---
name: treatment-update
description: Regenerate the story primer (six standard sections) and treatment from current decisions, character bios, and worldbuilding. Use when the user says "update the treatment," "refresh the primer," "rewrite the treatment with what we've decided," "let's see where we are," or after a stretch of brainstorming has accumulated unintegrated decisions. Runs as a two-phase pipeline (primer → treatment) in substantive mode to prevent confabulation.
---

# StoryStormer · Treatment Update

You are running the two-phase treatment update pipeline — the workflow's most important generative skill. The output is the canonical view of the story: a fresh six-section `primer.md` (story craft dossier) and a fresh `treatment.md` (full prose treatment) that reflect all the decisions, character work, and worldbuilding done since the last update.

This skill mirrors the StoryStormer web app's `treatment_update` background job. The model is the orchestrator.

Always follow `references/plan-first.md` — propose the plan with file lists, confirm with the user, then execute the two phases.

## What you produce

- **`primer.md`** — bumped to the next version. The story craft dossier with six standard sections: Story Identity / Premise & Moral Argument / Structural Framework (incl. Treatment Word Budget) / Tone, Style & Writing Rules / Setup/Payoff Ledger / Character Dynamics. Total ~4,500–5,500 words. See `references/file-schemas.md` § `primer.md`.
- **`treatment.md`** — bumped to the next version. Full prose treatment written in propulsive treatment voice. `primer_version` set to the new primer's version. Length calibrated by the primer's Treatment Word Budget table. See `references/treatment-voice.md` and `references/file-schemas.md` § `treatment.md`.
- **`.storystormer/history/<timestamp>-treatment-update/`** — snapshots of the *current* primer and treatment **as a pair**, before overwriting. They round-trip together; never snapshot one without the other.
- Updated `decisions.md` — the decisions consumed by this update are marked `Integrated into treatment: yes (<date>)`.
- Updated `state.md` — version bumps, summary refresh, `What's Next` updated.

## Operating philosophy

### First-run vs update mode

Determine which mode you're in before applying any other rule:

- **Update mode (default).** A non-empty `primer.md` and `treatment.md` exist. Your job is to integrate pending decisions while preserving what already works. The rules below describe update-mode behavior.
- **First-run mode.** `primer.md` and/or `treatment.md` are empty or just-stubbed. Typical for newly initialized projects, or when intake-extracted content needs scaffolding into the canonical structure. In first-run mode, **construction** is the default — not preservation. Use project metadata + decisions + any existing materials to scaffold each primer section. Mark sections without source material as `**For Further Development**: …`. Scaffolding is not fabrication — don't invent story content to fill a blank.

When the primer exists but some sections are populated and others empty, you're still in update mode — apply update-mode behavior to the populated sections, first-run construction to the empty ones.

### Conservative by default (update mode)

The Story Primer is the story's intellectual foundation. Treat it carefully:

- **Preserve what's working.** If a primer section is well-developed and no decisions affect it, reproduce it verbatim. Don't churn prose that's already landed.
- **Change only what decisions require.** Every edit must trace to a specific pending decision. Don't change Story Primer content to match the old treatment — the treatment updates separately.
- **Don't embellish.** No adding comparable works, writing rules, or structural analysis the author didn't brainstorm. Integrate decisions; don't freelance.

### Decisions are authoritative

When a pending decision contradicts the existing primer or the old treatment, **trust the decision**. The Story Primer phase runs before the Treatment phase, so contradictions between decisions and the old treatment will be resolved when Phase 2 rewrites the treatment. Don't flag those as problems in Phase 1 — they're pending, not broken.

DO flag genuinely broken chains unrelated to pending decisions (pre-existing inconsistencies). DO flag setup/payoff chains in the old treatment that have no payoff written yet — those need tracking in primer Section 5.

### Framework attribution preservation

If the existing primer cites a framework by name (Save the Cat, Truby's 22 Blocks, Seven-Point, etc.), **preserve that attribution verbatim**. Do not relabel, re-route, or second-guess the author's framework commitment. If a pending decision *introduces* a new framework attribution, integrate it. For first-run mode with no existing attribution, you may hedge-attribute frameworks the materials clearly exhibit — write *"consistent with Save the Cat's 15-beat pattern"* rather than *"this is a Save the Cat story."* Do not impose a framework when the materials resist conventional structure — see `references/alt-structure.md`.

## What to do

### 1. Pre-flight read

Load:

- `primer.md` (full — all six sections if it exists)
- `treatment.md` (full)
- `manifest.md` (full)
- All major-tier character bios (full)
- `decisions.md` — full read, but focus on entries where `Integrated into treatment: no`
- `questions.md` — open entries (so unresolved questions can be marked `[OPEN: Q-###]`)
- `state.md` (full)
- `.storystormer/genre-reference.md` if it exists

This is the canonical heavy-context turn. **Operate in substantive mode** — list the files at the top of your next response, full-read each one with the Read tool from beginning to end, and quote at least one passage from each in your output. See `references/reading-discipline.md` § Substantive mode.

### 2. Propose the plan

> Here's the plan for the treatment update:
>
> - **Read** (substantive mode): I'll full-read `primer.md`, `treatment.md` (~6,800w), `manifest.md`, the 4 major bios (~4,800w combined), the 7 unintegrated decisions in `decisions.md`, and the 6 open questions — then quote at least one passage from each in my next response to prove the absorption.
> - **Phase 1 — Primer**: rewrite the six standard sections of `primer.md` to fold in the new decisions about Marlowe's father wound and the shift in the antagonist's motivation. Most sections preserved verbatim; the Premise & Moral Argument section and the Setup/Payoff Ledger get meaningful updates. Bump primer version 3 → 4.
> - **Phase 2 — Treatment**: regenerate `treatment.md` against the refreshed primer in treatment voice. I expect a meaningful rewrite of the Act 2 midpoint and a lighter pass on Acts 1 and 3. Bump treatment version 7 → 8.
> - **Snapshot**: current primer.md + treatment.md → `.storystormer/history/2026-05-11T14-33-treatment-update/`.
> - **Mark**: the 7 unintegrated decisions as `integrated: yes (2026-05-11)`.
> - **Open elements**: I'll keep `[OPEN: Q-019]` and `[OPEN: Q-021]` markers in the treatment for the two unresolved critical questions, and add a `[NEEDS DEVELOPMENT: …]` marker for Elena's Act-3 infiltration mechanics (no tracked question yet).
>
> About 5–8 minutes once we start. Anything to adjust?

### 3. Read in substantive mode

Once the user gives the go-ahead, read every file in the list — Read tool, beginning to end, no grep, no skim. As you read, take inventory of:

- **Characters and roles** — who does what, with quoted passages from the treatment.
- **Plot beats** — the major beats Act-by-Act.
- **Subplots** — what they are, who carries them, how they connect to the main arc.
- **Themes** — the central thematic question and how it's dramatized.
- **Structural framework** — act structure, turning points, POV strategy, pacing patterns the existing primer specifies.
- **Setup/payoff chains** — planted setups and their intended payoffs, foreshadowing threads.
- **Character dynamics** — relationship map, factions, power dynamics, secrets.
- **Tone, style & writing rules** — narrative voice, register, dialogue conventions, anti-patterns.
- **Open threads** — what the treatment marks as `[OPEN: …]` or `[NEEDS DEVELOPMENT: …]`.
- **Unintegrated decisions** — what they say, what they affect, how they should shift the primer/treatment.
- **Genre obligations** — from `genre-reference.md`, what obligatory scenes the treatment hits or misses.

In your first response after the reading pass, quote at least one verbatim passage from each source file (primer, treatment, manifest, each major bio, decisions.md). This proves you absorbed the source. If you find yourself wanting to assert something the source doesn't directly state, surface it as a question instead. The treatment is the source of truth; genre priors are not.

### 4. Phase 1 — Story Primer (six sections)

Rewrite `primer.md`. The Primer has **exactly six standard sections** (full section spec in `references/file-schemas.md` § `primer.md`):

1. **Story Identity** — logline, genre, comps, target length.
2. **Premise & Moral Argument** — central dramatic question, what the story proves, character thematic positions.
3. **Structural Framework** — act structure, turning points, POV strategy, pacing, **Treatment Word Budget table**.
4. **Tone, Style & Writing Rules** — narrative voice, register, dialogue conventions, anti-patterns.
5. **Setup/Payoff Ledger** — planted setups and intended payoffs, foreshadowing threads.
6. **Character Dynamics** — relationship map, factions, power dynamics, secrets (Truby's character web).

**Decision routing.** Each pending decision affects one or more primer sections. Use `decision_type` (or the decision content) as a hint:

| Decision category | Primer section(s) |
|---|---|
| `theme` | Section 2 (Premise & Moral Argument) |
| `structure` | Section 3 (Structural Framework) |
| `plot` | Section 5 (Setup/Payoff Ledger) if it creates/modifies a chain; may also update Section 3 act breakdown |
| `character` | Section 2 if it changes a thematic position; Section 5 if it creates a character-driven setup/payoff; Section 6 if it changes a relationship dynamic |
| `voice` | Section 4 (Tone, Style & Writing Rules) |
| `worldbuilding` | Rarely affects the primer directly — usually Manifest. May affect Section 3 if it changes structural elements. |

Some decisions don't affect the primer at all. Purely narrative decisions (plot events, scenes, dialogue) belong in the treatment, not the primer.

**Treatment Word Budget table.** When writing or updating Section 3, calculate the table from the project's target word count (in `state.md`):

- `treatment budget = target word count / 6`
- Standard three-act allocation: Act 1 = 25%, Act 2 = 50%, Act 3 = 25%
- Per-chapter density = `treatment budget / target chapter count`

For non-standard structures, distribute equally unless the author has specified weighted proportions. The full example table is in `references/file-schemas.md` § Section 3.

**Conflict resolution.** When two decisions contradict each other about the same story element, resolve using this priority:

1. **Recency** — more recent decisions take precedence.
2. **Thematic consistency** — prefer the resolution that serves the moral argument.
3. **Setup/payoff preservation** — prefer the resolution that maintains existing chains.
4. **Narrative coherence** — prefer what preserves more story options.

Document any conflicts you resolved and your reasoning in the section where they land.

**Section budget enforcement.** Targets (full table in `file-schemas.md`): Section 1 = 800–1,200w, Section 2 = 800–1,200w, Section 3 = 800–1,200w, Section 4 = 800–1,200w, Section 5 = 800–1,500w, Section 6 = 400–800w. Total ~4,500–5,500. If a section runs significantly over budget, condense before adding.

**Primer voice.** Structured, concise, reference-oriented. Declarative statements (*"The novel uses close third-person POV"*), present tense for specifications, specific concrete language. Avoid hedging unless genuinely uncertain. The Primer is a craft document, not a narrative.

Show the new primer to the user. If they want adjustments, fold them in. Don't move to Phase 2 until the primer is settled — Phase 2 depends on it (especially Section 3's Treatment Word Budget).

### 5. Phase 2 — Treatment

Rewrite `treatment.md` against the refreshed primer and the source files you full-read in Step 3. The treatment is a *prose document* written in **treatment voice** — see `references/treatment-voice.md` before writing anything in this phase. The before/after example in that file teaches the difference between dry summary and treatment voice; an agent that skips it drifts into Wikipedia plot summary.

#### Write the story, not the analysis

The treatment is *narrative*, not analysis. You do NOT:

- Create analytical subsections in the treatment (*"Tonal Architecture," "Structural Mechanism," "Character Positions," "Beat Sheet," "Staging Options," "Key Thematic Parallel"*).
- Write meta-commentary about the story's structure (*"This sequence serves as the thematic engine of the recruitment arc"*).
- Include design rationale (*"This staging was chosen over Option A because…"*).
- Reproduce brainstorm decision text as-is. Decisions are raw material; you integrate their *meaning* into narrative voice.

When a decision contains analytical material (e.g., *"The prologue should use a two-part structure — warm workplace register followed by sudden catastrophe"*), integrate the *result* into the treatment narrative — write the warm workplace register; write the sudden catastrophe. The analysis stays in primer Section 4.

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
- **Conflicting decisions** → same priority as Phase 1: Recency > Thematic consistency > Setup/payoff preservation > Narrative coherence.

#### Treatment Word Budget calibration

Read the **Treatment Word Budget** table from primer Section 3. Enforcement:

- **Act-level budget (hard constraint).** Each act's treatment content must stay within ±15% of the word count in the budget table. Scenes within an act can vary, but the act total is the constraint.
- **Scene sizing.** Use the per-chapter density average to gauge how much treatment each scene warrants. A scene covering ~3 chapters of novel material gets ~3× the per-chapter average; a brief transitional scene covering half a chapter gets ~half.
- **Early development.** When only part of the story is developed (e.g., just a prologue), size to the per-chapter average. A prologue covering ~2–3 chapters in a 40-chapter novel gets ~1,000–1,500w of treatment, not 5,000.
- **Discipline.** Never pad to hit a word count — density is a virtue.

#### Markers for unresolved elements

Two marker types:

- `[OPEN: Q-###]` — links to a tracked open question in `questions.md`. Use when a specific question has been logged.
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

- Write the snapshot to `.storystormer/history/<timestamp>-treatment-update/` — both the old primer and the old treatment, as a pair.
- Write the new `primer.md` and `treatment.md`.
- For each decision consumed by this update, edit its entry in `decisions.md` to set `Integrated into treatment: yes (<date>)`.
- Update `state.md`:
  - `What Exists → Primer` and `Treatment` lines bumped to new versions and the new `built_from_decisions` list.
  - `Summary` refreshed.
  - `unintegrated decisions` count reset.
  - `Last Session` updated.
  - `stage` advanced if appropriate (`brainstorming` → `treatment-drafted` after a first comprehensive treatment; `treatment-drafted` → `treatment-refined` after a polish-pass). `initial_maturity` never changes.
  - `What's Next` updated — typically: resolve the next critical/important questions; if the manifest hasn't been updated in a while, suggest `manifest-sync`.

### 7. Report

> Treatment updated. Primer v4 (six sections, ~4,800w), treatment v8. Snapshot saved. 7 decisions marked integrated. Two open questions still flagged in the treatment (Q-019, Q-021), plus one `[NEEDS DEVELOPMENT]` marker on Elena's Act-3 infiltration mechanics. Recommended next step: resolve Q-019 (Marlowe's relationship to the antagonist) in a brainstorm session — it's the highest-priority unresolved one.

#### Outline staleness flag

If `outline/structure.md` exists, check whether the treatment change invalidates the spine. Two cases:

- **Light treatment refresh** (Act 2 midpoint tightened, no scene additions, no character role shifts) → `structure.md` likely still valid; existing chapter outlines may still be valid; flag any chapter outlines whose `treatment_version` frontmatter is now stale and recommend `outline-chapters` single-chapter revisions for the affected slots.
- **Structural treatment change** (a new act break, a character renamed, a major plot event added or removed, the climax mechanism changed) → `structure.md` is likely stale; recommend `pre-outline-session` to re-derive the spine before any chapter outlines are refreshed.

Include the staleness call in the report so the user knows the downstream impact. Example: *"This treatment change shifts the midpoint from ch 18 to ch 20 in the spine — outline/structure.md is now stale. Recommend `pre-outline-session` to re-derive the Act 2A spine before refreshing chapter outlines 17–22."*

## Series Mode

If `state.md` shows `project_type: series`, read `references/series.md` first. Treatment updates in series mode operate on the **focused book's** primer and treatment (`books/<current_focus>/primer.md` and `books/<current_focus>/treatment.md`). The two-phase pipeline is unchanged — primer first, treatment second — but the file paths route through the focused book.

Three additions in series mode:

1. **Also load `series.md`** during the pre-flight read. The series arc, cross-book setups, and continuity concerns inform the focused book's treatment refresh — especially the Setup/Payoff Ledger in primer Section 5, which must respect cross-book chains that span beyond this book.
2. **Filter decisions by scope.** Only integrate decisions whose `Scope` is the focused book OR is `series` with the focused book in `Affects books`. Decisions scoped to other books are not consumed by this update — they stay pending for their book's treatment.
3. **Surface series-level impact in the report.** When the treatment refresh affects cross-book chains (a setup that pays off in a later book, a character state that book N+1 starts from), call it out explicitly: *"This treatment change moves Maya's confrontation with Senator Vance from ch 35 to ch 38. Book 2's opening currently assumes Maya leaves Washington after ch 35 — recommend a brainstorm session on book 2's opening, or a series.md patch to update the Continuity Concerns section."*

The `Integrated into` field on consumed decisions becomes book-aware. For a series-scoped decision integrated into the focused book's treatment, set the book's line to `yes (date)` and leave other books' lines untouched:

```markdown
**Integrated into**:
- book-1 treatment: yes (2026-05-24)
- book-2 treatment: pending
- book-3 treatment: no
```

If the treatment refresh structurally affects `series.md` (a cross-book chain changed, the book's arc summary needs updating in the Per-Book Synopses section), recommend a `series.md` patch as a follow-up in the report — don't auto-patch series.md from within `treatment-update`. Series.md updates are conversational; this skill stays focused on the per-book primer+treatment cycle.

## The two-phase rationale

Phase 1 (primer) first, then Phase 2 (treatment) — *not* both in one pass. The reasons:

- The primer is a **structural index** of the story. If we generate the treatment in the same pass, the model is doing too many things at once and the texture suffers.
- The primer informs the treatment's grounding. A clear primer (especially Section 3's structural framework and Treatment Word Budget) produces a tighter, better-calibrated treatment.
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
- The unintegrated decisions count is high (10+ entries), making decisions-extraction a heavy read in itself.

**Suggested subagent grouping for a heavy treatment-update:**

1. **Bios subagent** — full-reads every major (and supporting, in series mode) bio in scope. Returns per-bio summary with quoted excerpts focused on Voice Fingerprint, Lie/Ghost, Thematic Posture, and the per-book sub-arcs (series mode).
2. **Cross-book bios subagent** (series mode only) — reads each book's treatment to surface the focused-book character's actions across the series, for series-aware Setup/Payoff Ledger updates.
3. **Decisions filter subagent** — full-reads `decisions.md`, returns just the unintegrated entries scoped to the focused book or series-with-this-book-affected, plus quoted excerpts and the categorical mapping to primer sections.

The main session retains direct reads of `primer.md`, `treatment.md`, `manifest.md`, and `series.md`. These are *judgment-bearing* artifacts that the two-phase pipeline writes against — the main session must absorb them itself, not via summary, because both phases depend on their full texture.

The same anti-confabulation discipline applies: subagent returns must include verbatim excerpts. Reject and re-dispatch quote-free returns.

For incremental treatment updates against a small project (1 protagonist bio, short treatment, 2 unintegrated decisions), direct main-session reads are fine — subagent overhead would exceed benefit.

## What this skill does not do

- Generate or update character bios. That's `character-bio`. (If a treatment update reveals a bio gap, surface it in the report and recommend `character-bio` as next.)
- Refresh the manifest. That's `manifest-sync`. The treatment update may rename or reshape elements, but updating the inventory file is a separate operation. (Recommend `manifest-sync` in the report if the treatment changed meaningfully.)
- Generate or update worldbuilding entries. That's `worldbuilding-entry`. (If a treatment update reveals a worldbuilding gap, surface it in the report.)
- Generate or update the chapter spine. That's `pre-outline-session`. If a treatment update structurally invalidates `outline/structure.md`, surface it in the staleness flag above and recommend `pre-outline-session` — don't unilaterally edit the spine.
- Generate or revise per-chapter outlines. That's `outline-chapters`. Flag stale chapter outlines in the report.
- Generate prose. Not in this POC's scope.

## References

- `references/plan-first.md` — universal plan-first behavior
- `references/file-schemas.md` — `primer.md` (six sections, Treatment Word Budget), `treatment.md` (header conventions, markers, length), `series.md` schema, scope on decisions/questions
- `references/reading-discipline.md` — full-read rules, substantive mode, Zoom Selection
- `references/subagent-pattern.md` — **read when bios + treatment combined would consume substantial main context** (typically series mode or 3+ major bios)
- `references/series.md` — **read when `project_type: series`** (focused-book path resolution, series.md impact, scope filtering)
- `references/treatment-voice.md` — Treatment voice, before/after example, genre modulations, voice preservation drift patterns
- `references/philosophy.md` — what a good treatment privileges
- `references/frameworks.md` — vocabulary for shaping the primer (Section 2 + 3 + 6 framework attribution)
- `references/alt-structure.md` — when conventional structure resists the story
- `references/genres.md` — obligatory scenes check
