---
name: blueprint
description: Generate or revise a chapter Blueprint — the self-contained, prose-ready production brief that a prose-writing agent works from. It gathers every character and worldbuilding element that surfaces in the chapter, tiered to the right resolution with scene-current state fused in, so the prose agent can write from the Blueprint alone. Two modes — batch ("blueprint Act 1," "prep chapters 1–10 for prose," "build the briefs for the next act") and single-chapter ("blueprint chapter 17," "rebuild the chapter 23 brief," "the chapter 12 blueprint is missing Linda's grief"). Reads each chapter's `ch<NN>-outline.md` plus the Canon it needs and writes `chapters/chapter-NN/ch<NN>-blueprint.md`. Refuses if a chapter has no outline — run `outline-chapters` first. This is the pre-prose stage: `outline → blueprint → prose → notes`.
---

# StoryStormer · Blueprint

You are building the **Blueprint** for one or more chapters — the production-ready brief a prose-writing agent will work from. The chapter outline (`ch<NN>-outline.md`) says *what happens* in the chapter; the Blueprint assembles *everything the prose agent needs to render it well* into a single self-contained document. The standard the Blueprint must meet: **the prose agent could write the chapter from the Blueprint alone**, without opening the bios, the treatment, or the manifest.

The full craft spec — the Scene-Surface Test, character tiering with word ceilings, worldbuilding selection, the eight required sections, the quality checklist — lives in **`references/blueprint-spec.md`**. Read it before generating. This skill operates the *workflow*; the spec defines *what good looks like*.

Two operating modes:

- **Batch mode** — build Blueprints for a range of chapters, typically one act at a time. The natural cadence once an act's outlines are drafted and marker-free: blueprint Act 1, the user spot-checks, then Act 2A, etc.
- **Single-chapter mode** — build or rebuild one chapter's Blueprint. The user is about to write chapter 17, or a Blueprint is stale / thin / missing a beat.

Always follow `references/plan-first.md` — propose what you'll blueprint, get confirmation, then execute.

## Where the Blueprint sits

The Blueprint is the **pre-prose** stage of the chapter pipeline (`outline → blueprint → prose → notes`). It is the folder-native port of the web app's Blueprint refinement pass — but where the app runs a bounded agentic read-tool loop against a database, you run the same loop *natively*: you have `Read`/`Glob` over the story folder, so "gather the context this chapter needs" is just reading the right files. The discipline that makes it work is the same in both worlds: **read Canon in full, never grep it** (see Reading discipline below).

## What you produce

- **`chapters/chapter-NN/ch<NN>-blueprint.md`** — one file per chapter, in that chapter's folder, per the schema in `references/file-schemas.md` § Blueprint and the content spec in `references/blueprint-spec.md`. Chapter-number-prefixed, zero-padded.
- **`outline/_index.md`** — the outline view (chapter × stage matrix), regenerated so each chapter's **Blueprint** column reflects the new state (version link, or `—`).
- Snapshots any overwritten Blueprint to that chapter's co-located `chapters/chapter-NN/.history/` as a flat `ch<NN>-blueprint-v<version>-<date>.md` file (the superseded version). New Blueprints have nothing to snapshot.
- **Proposed Revelation Log additions** (not silent edits) — when gathering reveals a state change in a prior chapter that a Canon entry's `## Revelation Log` doesn't capture, surface it and offer to append the line. See Revelation Log handling below.
- Updates to `state.md`: `What Exists → Blueprints` line (`8/40 built` etc.), `Summary` refreshed, `Last Session` updated, `What's Next` updated. (Blueprinting does not advance `stage` — the POC's stage ladder tops out at `outline-drafted`; Blueprints are pre-prose prep, tracked in the matrix rather than the stage field.)

## Preconditions

- **`chapters/chapter-NN/ch<NN>-outline.md` must exist** for every chapter in scope. If it doesn't, refuse that chapter and recommend `outline-chapters`. You cannot blueprint a chapter you haven't outlined — you'd be inventing the chapter and its brief in one pass.
- **The outline should be marker-free.** A chapter outline carrying `[OPEN: Q-###]` or `[NEEDS DEVELOPMENT: …]` is not prose-ready (see `outline-chapters` § The pre-prose readiness check). You *can* blueprint it, but the Blueprint inherits the gap — surface the markers and let the user decide whether to resolve them first or blueprint around them with the gap carried forward.
- **`primer.md` and `treatment.md` exist.** The Blueprint draws story-level orientation (moral argument, setup/payoff chains, voice rules) from the primer and chapter chronology from the treatment.
- **Canon exists for the chapter's on-page cast.** If the outline names a character or element with no `characters/<slug>.md` or `worldbuilding/<cat>/<slug>.md`, surface the gap and recommend `character-bio` / `worldbuilding-entry` — don't fabricate a tier entry from genre priors.

## What to do

### 1. Determine the mode

- *"Blueprint Act 1," "prep chapters 1–10 for prose," "build the briefs for the next act"* → **batch mode**.
- *"Blueprint chapter 17," "rebuild the ch 23 brief," "the ch 12 blueprint is missing X"* → **single-chapter mode**.
- Ambiguous *"work on blueprints"* → propose batch mode for the next un-blueprinted, fully-outlined range, and confirm.

### 2. Read context — the deterministic seed

For each chapter in scope, the **seed** is the judgment-free context (read directly in the main session):

- The chapter's `ch<NN>-outline.md` (full) — the contract this Blueprint fulfills.
- `outline/structure.md` — the spine slot + POV strategy for the chapter.
- The **immediately-preceding chapter's outline** (`ch<N-1>-outline.md`), or its prose if it exists — the continuity handoff (clothing, injuries, emotional residue, open beats carried forward).
- `primer.md` Sections 2, 4, 5 (moral argument, voice rules, setup/payoff ledger) and `treatment.md` (the passage(s) for this chapter's spine slot — for chapter chronology and what's been revealed by now).

The seed tells you *what the chapter is*. The rest — *what Canon this chapter needs* — you assemble yourself. Deciding that is the core of the job.

### 3. Identify the surfacing cast and elements

From the chapter outline, identify **every on-page character and every worldbuilding element that surfaces** — in beats, dialogue anchors, setting, or character notes. The outline's Character Notes are a starting point, not an authoritative cast list; verify and expand against the beats. Resolve each to its Canon file (use `manifest.md` to map names → slugs; `Glob` `characters/` and `worldbuilding/**` when a name isn't in the manifest).

### 4. Propose the plan

**Batch mode example:**

> Plan for blueprinting Act 1 (chapters 1–10):
>
> - **Preconditions**: all 10 outlines exist and are marker-free except ch 3 (`[OPEN: Q-014]`, the inciting mechanism) — I'll blueprint ch 3 around the gap and carry the marker into its Continuity section, or we resolve Q-014 first. Your call.
> - **Gather**: for each chapter, full-read its on-page Canon (Act 1 surfaces 6 characters + 4 worldbuilding elements across the 10 chapters) and apply each entry's Revelation Log filtered to that chapter.
> - **Dispatch**: one Blueprint subagent per chapter, run in parallel (see `references/subagent-pattern.md`) — each gathers its chapter's Canon, writes `ch<NN>-blueprint.md`, and returns a structured summary. Keeps the 10× full-Canon reads out of our shared context.
> - **Write**: 10 `ch<NN>-blueprint.md` files; regenerate `outline/_index.md` (Blueprint column 0→10); update `state.md`.
> - **Snapshot**: nothing — these are new.
>
> About 6–10 minutes. Want me to resolve Q-014 first, or blueprint ch 3 around it?

**Single-chapter mode example:**

> Plan for the ch 17 Blueprint — *The Locket*:
>
> - **Seed**: `ch17-outline.md`, `ch16-outline.md` (continuity), structure spine slot, primer §2/§4/§5, treatment's *Audit Box* passage.
> - **Surfacing cast**: Marlowe (POV), Voss (Major), Park (Supporting), Doris (Minor) + 3 worldbuilding elements (the locket, Mara's Diner, Voss Industries). Full-read each bio + entry; apply Revelation Logs ≤ ch 17 (Marlowe's ch 14 injury is still active).
> - **Write**: `ch17-blueprint.md` v1; index Blueprint cell → v1; `state.md` updated.
>
> About 3–5 minutes. Sound right?

### 5. Gather and generate

For a **single chapter**, gather and write directly in the main session unless the Canon reads are large (then dispatch one subagent per `references/subagent-pattern.md` § When to dispatch). For a **batch**, dispatch **one Blueprint subagent per chapter, in parallel** — each is an execution subagent that also does substantive reads:

- **Reads** (substantive mode, full reads, no grep): its chapter outline, the prior chapter's outline, and the full Canon entry for each on-page character and element, plus each entry's `## Revelation Log`.
- **Applies the Revelation Log filter**: includes only log entries dated `≤` this chapter; treats anything later as future state and does not write toward it.
- **Writes** `chapters/chapter-NN/ch<NN>-blueprint.md` per `references/file-schemas.md` § Blueprint and `references/blueprint-spec.md`.
- **Returns** a structured summary: the surfacing cast and their assigned tiers, the worldbuilding elements, any Revelation Log gaps detected (state changes in prior chapters not yet logged in Canon), any Canon-vs-scene conflicts resolved, and any precondition gaps (missing bio, marker carried forward).

The seed is passed in the brief so subagents don't re-derive it. Continuity is safe to parallelize because each chapter reads the *prior chapter's outline* (already on disk), never the prior chapter's not-yet-written Blueprint.

### 6. The craft — follow `references/blueprint-spec.md`

Generate each Blueprint to the spec. The load-bearing rules:

- **The Scene-Surface Test** governs every sentence: will this detail surface in the prose of *this chapter*? If not, cut it.
- **Tier each character chapter-locally** (POV → Major → Supporting → Minor → Referenced), at the tier's resolution, sized to what surfaces — ceilings are ceilings, not targets. A character's Blueprint tier is *not* their manifest bio tier; the protagonist is POV in their chapters and Referenced (or absent) in others.
- **Fuse scene-current state** from the Revelation Log (≤ this chapter) and prior-chapter continuity into one clean image per element.
- **Emit only the worldbuilding dimensions the chapter touches**, each with its scene trigger.
- **Eight sections**: Scene Function, Characters, Setting, Conflict, Symbolism, Continuity, Worldbuilding, Other Notes.

For a **scene-split** chapter (multi-POV, or one with a `scenes/` subfolder), set `scene_split: true` and repeat Characters/Setting/Conflict/Worldbuilding per scene; keep Symbolism/Continuity/Other Notes chapter-level. Default to the single chapter-level form.

### 7. Content discipline — never write past chapter N, never confabulate

The two failure modes to guard against:

1. **Future state.** The base bio describes a character's *whole arc*; a Revelation Log entry dated after this chapter is a reveal or change that hasn't landed. Write the character *as of this chapter* — never toward how they end up. This is the whole point of the `chapter ≤ N` filter.
2. **Genre-prior confabulation.** Every detail in the Blueprint must trace to the Canon entry, the chapter outline, the treatment, the primer, or a logged decision. If a needed detail exists nowhere, do not invent it from genre priors — carry a `[NEEDS DEVELOPMENT: …]` marker into the Blueprint's Continuity or Other Notes and surface it. An honest gap beats a confident fabrication. (This is the grep-confabulation failure mode the whole architecture is built to prevent — see Reading discipline.)

### 8. Show the user

For a batch, show the Blueprints in reviewable chunks (a few at a time for a 10-chapter act). For a single chapter, show the full file. The user can approve, request per-chapter edits, or request a global adjustment ("the POV interiority sections are running long across the batch"). Fold in and re-show.

### 9. Write, wire, and report

After approval:

- Snapshot any overwritten Blueprint to its `chapters/chapter-NN/.history/` as `ch<NN>-blueprint-v<version>-<date>.md`.
- Write each `ch<NN>-blueprint.md` with full frontmatter — `outline_version`, `treatment_version`, `primer_version`, `manifest_version` stamp what this Blueprint was built against, so a later outline/treatment edit makes the staleness detectable.
- Regenerate `outline/_index.md` — Blueprint column updated for the affected chapters; bump `chapters_blueprinted` in its frontmatter.
- Update `state.md` (What Exists / Summary / Last Session / What's Next).
- Report: chapters blueprinted, surfacing-cast sizes, any markers carried forward, any proposed Revelation Log additions, any precondition gaps surfaced, and the recommended next step.

> Blueprint batch complete. Built 10 Blueprints (ch 01–10). ch 03 carries `[OPEN: Q-014]` forward (inciting mechanism still unresolved). Detected one un-logged state change — Marlowe's ch 9 limp from the warehouse fall isn't in her Revelation Log; proposed line below, append it? Index regenerated (Blueprint 0→10). Next: spot-check the briefs, then write prose for ch 1 — or resolve Q-014 so ch 3's Blueprint is clean.

## Revelation Log handling

The `## Revelation Log` at the end of a Canon entry (see `references/canon-schemas.md` § Revelation Log) is your source for scene-current state. Two responsibilities:

- **Consume it**, filtered to `chapter ≤ N`. A character injured in ch 12 is still favoring that arm in ch 17; a character whose spouse died in ch 14 carries that grief from ch 14 on. Fuse it into the Current State / Emotional State lines.
- **Surface gaps, don't silently fill them.** When you find a state change in a prior chapter's outline or prose that the Canon entry's log doesn't capture, propose the log line in your report (`- **Ch 9** — Falls during the warehouse chase; walks with a limp through ch 14.`) and offer to append it. Append only on the user's go-ahead — Canon is the user's, and the Blueprint skill consumes Canon rather than authoring it. If the user agrees, append the line to the entry's `## Revelation Log` (creating the section if absent) and note it in the report.

## Reading discipline

Substantive mode is mandatory: full reads of every Canon entry in the surfacing cast, quoted excerpts as proof the read happened (in subagent returns, per `references/subagent-pattern.md` § Quoted-excerpt discipline). **Never grep a Canon file to build a Blueprint.** Grep returns keyword matches stripped of causal and emotional framing, and the gaps get confabulated from genre priors — the single most damaging failure mode for story content, because a corrupt Blueprint silently poisons the prose written from it. See `references/reading-discipline.md` § Substantive mode.

The seed reads (outline, structure, primer slices, treatment slice) are smaller and read directly. The Canon reads are the heavy ones — dispatch them to subagents when scope warrants (batch mode almost always does; a single chapter with a large cast may).

## Series Mode

If `state.md` shows `project_type: series`, read `references/series.md` first. Blueprint operates on the **focused book's** chapters — reads `books/<current_focus>/chapters/chapter-NN/ch<NN>-outline.md` and the shared Canon (characters and worldbuilding are series-shared), and writes `books/<current_focus>/chapters/chapter-NN/ch<NN>-blueprint.md`.

Two additions in series mode:

1. **Shared Canon, book-local chapters.** Bios and worldbuilding live at the series root and are shared across books; a character's Revelation Log may span books. Filter by the **focused book's** chapter numbering, and treat cross-book reveals (logged with a book-qualified chapter, e.g. `Ch B2-07`) as future state if they land in a later book.
2. **Cross-book continuity.** When a chapter participates in a cross-book setup/payoff chain (per `series.md`), the Blueprint's Continuity section notes the chain — what's planted here that pays off in a later book, or what earlier-book setup this chapter pays off.

## What this skill does not do

- **Write prose.** That's the `prose` skill — the Blueprint is the brief it consumes (the Blueprint stands in for raw bios + worldbuilding + primer on the prose skill's lean path).
- **Author Canon.** It reads bios and worldbuilding; it does not create or rewrite them. Missing Canon → recommend `character-bio` / `worldbuilding-entry`. The one write-adjacent action is *proposing* Revelation Log lines, appended only on user approval.
- **Edit the outline, treatment, primer, or structure.** If blueprinting reveals an outline gap, a treatment contradiction, or a missing setup/payoff chain, surface it and recommend the owning skill (`outline-chapters`, `treatment-update`, `pre-outline-session`) — don't fix it inline.
- **Resolve open questions.** A chapter outline carrying `[OPEN: Q-###]` blueprints with the marker carried forward; resolving the question is `brainstorm-session` / `decision-capture` work.

## References

- `references/blueprint-spec.md` — **the craft spec**: Scene-Surface Test, tiering with ceilings, worldbuilding selection, the 8 sections, quality checklist
- `references/file-schemas.md` — `ch<NN>-blueprint.md` file shape, `outline/_index.md` matrix, per-chapter `.history/`
- `references/canon-schemas.md` — § Revelation Log (scene-current state mechanism), bio + worldbuilding content shape
- `references/plan-first.md` — universal plan-first behavior
- `references/reading-discipline.md` — substantive mode; the no-grep-on-Canon rule
- `references/subagent-pattern.md` — per-chapter Blueprint subagents for batch mode
- `references/frameworks.md` — Voice Fingerprint, Lie/Ghost, Thematic Posture vocabulary the Characters section distills from
- `references/series.md` — **read when `project_type: series`** (focused-book paths, shared Canon, cross-book continuity)
