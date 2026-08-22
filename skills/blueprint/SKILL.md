---
name: blueprint
description: Generate or revise a chapter Blueprint — the self-contained continuity brief a prose-writing agent works from. It answers "what must I not get wrong?" for one chapter: every surfacing character and worldbuilding element tiered to the right resolution with scene-current state fused in, the chapter's shape and dialogue anchors, the plants stated as imperatives, and nothing about any chapter after it. Two modes — batch ("blueprint Act 1," "prep chapters 1–10 for prose," "build the briefs for the next act") and single-chapter ("blueprint chapter 17," "rebuild the chapter 23 brief," "the chapter 12 blueprint is missing Linda's grief"). Reads each chapter's `ch<NN>-outline.md` for content plus the Canon it needs and writes `chapters/chapter-NN/ch<NN>-blueprint.md`. Refuses if a chapter has no outline — run `outline-chapters` first. This is the pre-prose stage: `outline → blueprint → prose → notes`.
---

# StoryStormer · Blueprint

You are building the **Blueprint** for one or more chapters: the brief a prose-writing agent reads alongside the style guide and the outline. The three divide the prose agent's inputs cleanly. The style guide says *how to write this book*. The outline says *what happens*, in the author's voice. The Blueprint says ***what must I not get wrong***: who is on the page and in what state, what the chapter's shape and conflict are, which exchanges must land, what must be planted and exactly how, and every canon fact the chapter touches, **with nothing from any chapter after it.**

At prose time the Blueprint **replaces the raw Canon layer entirely**: bios, worldbuilding, and the primer are omitted from the prose agent's context. It is a **fidelity-preserving consolidation, not a summary and not a second outline.** If a line tells the prose agent what happens, it belongs in the outline. If it tells the prose agent how to write in general, it belongs in the style guide. The standard: **the prose agent could write the chapter from the style guide, the outline, and the Blueprint alone.**

The full craft spec lives in **`references/blueprint-spec.md`**: the backward-only rule, the synthesis rule, tiering, frameworks, worldbuilding selection, the twelve required sections, the quality checklist. Read it before generating. This skill operates the *workflow*; the spec defines *what good looks like*.

Two operating modes:

- **Batch mode**: Blueprints for a range of chapters, typically one act at a time, once that act's outlines are drafted.
- **Single-chapter mode**: build or rebuild one chapter's Blueprint. The user is about to write chapter 17, or a Blueprint is stale, thin, or missing a beat.

Always follow `references/plan-first.md`: propose, confirm, execute.

## What you produce

- **`chapters/chapter-NN/ch<NN>-blueprint.md`**: one file per chapter, per the file shape in `references/file-schemas.md` § Blueprint and the content spec in `references/blueprint-spec.md`.
- **`outline/_index.md`**: regenerated so each chapter's Blueprint column reflects the new state.
- Snapshots of any overwritten Blueprint to `chapters/chapter-NN/.history/` as `ch<NN>-blueprint-v<version>-<date>.md`.
- **Proposed Revelation Log additions**, never silent edits. See § Revelation Log handling.
- **A style-guide warning** when `voice/style-guide.md` is absent (see § Style-guide dependency).
- Updates to `state.md`: `What Exists → Blueprints` line, `Summary`, `Last Session`, `What's Next`. Blueprinting does not advance `stage`.

## Preconditions

- **`chapters/chapter-NN/ch<NN>-outline.md` must exist** for every chapter in scope. Otherwise refuse that chapter and recommend `outline-chapters`.
- **The outline should be marker-free.** One carrying `[OPEN: Q-###]` or `[NEEDS DEVELOPMENT: …]` can be blueprinted, but the Blueprint inherits the gap. Surface the markers and let the user decide.
- **`primer.md` and `treatment.md` exist.** Story Context and the chain register come from the primer; chapter chronology from the treatment's spine-slot passage.
- **Canon exists for the chapter's on-page cast.** If the outline names a character or element with no canon file, surface the gap and recommend `character-bio` / `worldbuilding-entry`. Never fabricate a tier entry.
- **Canon-sync owed (batch mode).** Blueprinting a new act is the moment stale canon does damage. Before a batch, glob `chapters/*/ch*-notes.md` for chapters before the range and count unchecked items in § Proposals; if any exist, say so in the plan and recommend `canon-sync` first. Proceed only if the user says so, and note in the report that the Blueprints were built against unreconciled canon.
- **Schema-form outlines.** If the outline still carries the older nine-section scaffolding (Premise, Scene Beats, Setups Planted, Character Notes, and so on), recommend the `outline-chapters` migration pass first. You can proceed, but read the outline for **content** only and derive the scaffolding from canon yourself; never transplant the outline's summary of canon into the Blueprint.

## What to do

### 1. Determine the mode

- *"Blueprint Act 1," "prep chapters 1–10 for prose"* → **batch mode**.
- *"Blueprint chapter 17," "rebuild the ch 23 brief"* → **single-chapter mode**.
- Ambiguous *"work on blueprints"* → propose batch mode for the next un-blueprinted, fully-outlined range and confirm.

### 2. Read the seed

For each chapter, the judgment-free context, read directly:

- **The chapter's `ch<NN>-outline.md`, read for content.** It is the author's prose account of what happens; it is not a cast list or a scaffolding source. Note its `word_count` and `authorship` (an author-written outline's dialogue is the author's, and the Dialogue Anchors section will say so).
- **`outline/structure.md`**: the spine slot, the POV strategy, and the Chapter Spine so you know where this chapter sits without reading future chapters' plot.
- **Carried-forward state.** Prefer the **prior chapter's `ch<NN>-notes.md` end-state block** when it exists: a short structured statement of wardrobe, injuries, objects, location, residue, and the hour as the chapter actually left them. When no notes file exists, walk back from chapter N to the most recent prior chapter with the **same `pov`** and read its prose if written, else its outline; fall back to the immediately preceding chapter of any POV. Chapter 1, and a POV debut, have no anchor and lean on the treatment slot and the Revelation Log. (Glob `chapters/*/ch*-{notes,prose,outline}.md`, read `pov` and `chapter` frontmatter, filter `< N`.)
- **The primer**, harvested for § 2 Story Context and **filtered to this chapter**, plus its **§2 Reveal Architecture**, consulted only to learn *what this chapter must plant*. Nothing about where a reveal lands may reach the file.
- **`treatment.md`, the spine-slot passage for this chapter only.** Never seed the full treatment.
- **`voice/style-guide.md`** if it exists: not to copy from, but to know what general craft the Blueprint may omit.
- **`questions.md`**: the IDs of open questions touching this chapter, for the frontmatter pointer list.

### 3. Identify the surfacing cast and elements

From the outline's narrative, identify **every character and worldbuilding element that surfaces**: on the page, in dialogue, in the POV's thoughts, in the setting. Resolve each to its canon file via `manifest.md`; `Glob` `characters/` and `worldbuilding/**` when a name isn't in the manifest. A character who neither appears nor is thought about in this chapter is not in the Blueprint at all, even inside canon wording about someone else.

### 4. Propose the plan

**Batch mode example:**

> Plan for blueprinting Act 1 (chapters 1–10):
>
> - **Preconditions**: all 10 outlines exist and are marker-free except ch 3 (`[OPEN: Q-014]`). I'll carry Q-014 as a frontmatter pointer and write the Continuity gap the prose agent must work around, or we resolve it first. `voice/style-guide.md` exists, so the Blueprints carry no general craft.
> - **Carried state**: ch 1 has no anchor; ch 2–10 read the prior chapter's notes end-state where written (none yet), else the prior same-POV outline.
> - **Gather**: per chapter, full-read its on-page canon (Act 1 surfaces 6 characters and 4 elements) with Revelation Logs filtered to the chapter.
> - **Dispatch**: one Blueprint subagent per chapter, in parallel (`references/subagent-pattern.md`).
> - **Write**: 10 files; index Blueprint column 0→10; `state.md` updated.

**Single-chapter mode example:**

> Plan for the ch 17 Blueprint, *The Locket*:
>
> - **Seed**: `ch17-outline.md` (1,140w, `author-written`, so its dialogue is yours and gets preserved); ch 16 notes end-state block; spine slot + Chapter Spine; primer filtered to this chapter + §2 for what ch 17 must plant; treatment's *Audit Box* passage only; `voice/style-guide.md` present.
> - **Surfacing cast**: Marlowe (POV), Voss (Major), Park (Supporting), Doris (Minor) + 3 elements (the locket, Mara's Diner, Voss Industries). Full-read each; carry all frameworks; Revelation Logs ≤ ch 17.
> - **Write**: `ch17-blueprint.md` v1; index cell → v1; `state.md` updated.

### 5. Gather and generate

For a **single chapter**, gather and write in the main session unless the canon reads are large (then dispatch one subagent per `references/subagent-pattern.md`). For a **batch**, dispatch **one subagent per chapter, in parallel**. Each subagent:

- **Reads** (substantive mode, full reads, no grep): the outline, the carried-state source, the filtered primer harvest and §2, the style guide's existence, and the full canon entry for each surfacing character and element, including each `## Revelation Log`.
- **Applies the Revelation Log filter** to `chapter ≤ N`, and strips later-chapter references from the text of entries it carries.
- **Writes** `ch<NN>-blueprint.md` to the spec: twelve sections, synthesized, backward-only.
- **Runs the backward-only scan** over its own output before returning (the grep in the spec's Core Principles), and fixes what it finds.
- **Returns** a structured summary: cast and tiers, elements, Revelation Log gaps detected, canon-vs-scene conflicts resolved, precondition gaps, and the backward-only scan's remaining flags for the main session to review.

Continuity is safe to parallelize because each chapter reads carried state from what is *already on disk*, never from a Blueprint being written in the same batch.

### 6. The craft — follow `references/blueprint-spec.md`

The load-bearing rules:

- **Backward only.** Nothing from chapter N+1 or later. Plants are stated imperatively and never explained. Framework arrows keep the behavioural signature and lose the plot trigger. Worldbuilding loses chain-of-custody that runs past this chapter.
- **Synthesize; don't cite.** One document in its own voice. Canon phrasing absorbed unquoted where it is sharper than paraphrase; never a specific downgraded to a generic; no blockquotes or attributions in the body; specification lists (word inventories, lexicon bars, locked term sets) kept exact.
- **Sole carrier.** A detail omitted is a detail the prose agent invents. Inclusion generous; resolution tiered.
- **Prominence sets resolution**, chapter-locally, for characters (POV → Major → Supporting → Minor → Referenced) and elements (Foreground → Background → Dormant).
- **Carry all recorded frameworks** for POV and Major, characterized to this chapter; say plainly when no direction fires; never invent typology.
- **Fuse scene-current state** from the Revelation Log, the prior notes end-state, and prior chapters, under the clothing-continuity rule.
- **Craft lives in the style guide.** Only this chapter's placements go in § 11.
- **Twelve sections**: Scene Function · Story Context · Chapter Shape · Characters · Setting · Main Source of Conflict · Symbolism and Thematic Layer · Continuity · Worldbuilding · Dialogue Anchors · Chapter-Specific Craft · Other Notes.

For a **scene-split** chapter set `scene_split: true` and repeat Characters / Setting / Conflict / Worldbuilding per scene; the rest stays chapter-level.

### 7. Content discipline

Three failure modes to guard against:

1. **Future state.** A Revelation Log entry after this chapter, a reveal that hasn't landed, a framework trigger from a later act, a worldbuilding entry's later custody, a rationale for a plant. None of it may reach the file. The Blueprint's output *is* the prose agent's context.
2. **Confabulation.** Every detail traces to a canon entry, the outline, the treatment slot, the filtered primer, or a logged decision. A needed detail that exists nowhere becomes a `[NEEDS DEVELOPMENT: …]` marker in Continuity, surfaced in the report, never filled from genre priors.
3. **Restating the outline.** The Chapter Shape's beat index paces the expansion; it does not retell the chapter. If a Characters entry or the Continuity section narrates events, it has crossed into the outline's job.

### 8. Show the user

For a batch, show the Blueprints in reviewable chunks. For a single chapter, show the full file. Fold in per-chapter edits or global adjustments (*"the POV interiority is running long across the batch"*) and re-show.

### 9. Write, wire, report

After approval: snapshot overwritten Blueprints; write each file with full frontmatter (`outline_version`, `treatment_version`, `primer_version`, `manifest_version`, `outline_words`, `expansion_target`, `knowledge_horizon`, `open_questions_touching_this_chapter`, `depends_on`); regenerate `outline/_index.md`; update `state.md`. Report: chapters blueprinted, cast sizes, markers carried, proposed Revelation Log lines, precondition gaps, any backward-only scan flags left for the user's eye, the style-guide warning if it applies, and the next step.

> Blueprint batch complete. Built 10 Blueprints (ch 01–10), 4,200–8,100w each. ch 03 carries Q-014 as a pointer with a Continuity gap note. Backward-only scan: 2 flags reviewed and cleared, 1 left for you (ch 6 Worldbuilding mentions *the later fire*; I rewrote it to present state but check the wording). One un-logged state change: Marlowe's ch 9 limp isn't in her Revelation Log; proposed line below, append it? Index regenerated. Next: write prose for ch 1.

## Style-guide dependency

If `voice/style-guide.md` exists, the Blueprint carries no general craft; § 11 opens with a pointer to it. If it does **not** exist, the Blueprint must transcribe the project's craft rules (from the primer's §4 and any craft decisions) into § 11 so the prose agent still has them, and **the report must warn the author** that this is a per-chapter workaround that will repeat in every Blueprint until a style guide is written. Recommend writing one.

## Revelation Log handling

The `## Revelation Log` at the end of a canon entry (see `references/canon-schemas.md` § Revelation Log) is the authoritative source for scene-current state.

- **Consume it**, filtered to `chapter ≤ N`, with later-chapter references stripped from the text of entries carried.
- **Surface gaps, don't fill them.** When a prior chapter's outline, notes, or prose shows a state change the log doesn't capture, propose the line in the report (`- **Ch 9** — Falls during the warehouse chase; walks with a limp.`) and append only on the user's go-ahead. Canon is the user's; this skill consumes it.

## Reading discipline

Substantive mode is mandatory: full reads of every canon entry in the surfacing cast, with quoted excerpts in subagent returns as proof (the excerpts live in the *return*, never in the Blueprint body). **Never grep a canon file to build a Blueprint.** Grep strips causal and emotional framing and the gaps get confabulated; a corrupt Blueprint silently poisons the prose. See `references/reading-discipline.md`.

## Series Mode

If `state.md` shows `project_type: series`, read `references/series.md` first. Operate on the **focused book's** chapters with the shared canon at the series root. Filter Revelation Logs by the focused book's numbering; a cross-book entry (`Ch B2-07`) in a later book is future state. A cross-book chain that plants here is rendered, like every plant, as an imperative without rationale; the chain itself lives in `series.md`.

## What this skill does not do

- **Write prose.** That's `prose`.
- **Author canon.** Missing canon → recommend `character-bio` / `worldbuilding-entry`. The one write-adjacent action is *proposing* Revelation Log lines.
- **Edit the outline, treatment, primer, or structure.** Surface and recommend the owning skill.
- **Resolve open questions.** Carry the pointer; `brainstorm-session` / `decision-capture` resolve.
- **Carry general craft** when a style guide exists, or **anything about a later chapter**, ever.

## References

- `references/blueprint-spec.md`: **the craft spec**
- `references/file-schemas.md`: `ch<NN>-blueprint.md` file shape, `ch<NN>-outline.md` (prose body), `ch<NN>-notes.md` end-state block, `outline/_index.md`, per-chapter `.history/`
- `references/canon-schemas.md`: § Revelation Log
- `references/plan-first.md`, `references/reading-discipline.md`, `references/subagent-pattern.md`
- `references/frameworks.md`: Voice Fingerprint, Lie / Ghost vocabulary
- `references/series.md`: read when `project_type: series`
