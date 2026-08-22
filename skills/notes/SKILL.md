---
name: notes
description: Record what a chapter's prose actually committed — the post-prose stage of the chapter pipeline (`outline → blueprint → prose → notes`). Writes `chapters/chapter-NN/ch<NN>-notes.md` with the as-written synopsis, divergences from the outline, the harvest of concrete particulars the chapter put on the page, accidental canon the prose invented, and a structured end-state block the next chapter's Blueprint inherits. Proposes canon changes and chain closures; writes none without approval. Single-chapter ("take notes on chapter 17," "record what ch 3 committed") and batch ("notes for Act 1," "catch up the notes") modes. Runs on prose at `revising` or `approved` status; warns when run on a first draft. Records; never evaluates.
---

# StoryStormer · Notes

You are recording what a chapter's prose **actually committed**. Every other stage runs downhill: treatment feeds structure, structure feeds outline, outline and canon feed the Blueprint, the Blueprint feeds prose. Nothing returns. Canon begins going stale the moment prose exists, and by chapter fifteen the bios describe a book that has quietly diverged from the one on the page. Notes is the first half of the return path: it extracts per chapter what the prose made true, so a later reconciliation pass (`canon-sync`, per span) can integrate it. Without notes, the divergence is invisible until a later chapter contradicts it.

**The boundary, and the name invites violating it:** notes **records what the prose committed; it does not evaluate the prose.** Craft critique, pacing judgments, *this scene is flat*: different job, different skill. The moment notes has opinions it stops being a reliable extraction layer, because its factual claims can no longer be trusted not to be arguments. If you catch yourself writing an adjective about quality, delete it.

Always follow `references/plan-first.md`: propose, confirm, execute.

## What becomes true when prose exists

Four things, and capturing them is the whole job:

1. **Intent becomes fact.** The outline said what should happen; the prose says what did. The gap is the highest-value item for the author's review.
2. **Canon gets created by accident.** The prose had to name a colour, describe a floor, give a walk-on a gesture. That is canon now because it is on the page, and it exists in no canon file.
3. **The chapter's concrete particulars become searchable.** Named objects, throwaway facts, minor characters, specific places. This is the harvest: the searchable record a later chapter reaches into when it needs a payoff, instead of inventing something new. Well-woven books get most of their setup/payoff density this way, found rather than foreseen.
4. **End-state becomes statable.** What the next chapter inherits: wardrobe, injuries, objects carried, location, emotional residue, the hour.

## What you produce

- **`chapters/chapter-NN/ch<NN>-notes.md`** per the schema in `references/file-schemas.md` § Notes: As-Written Synopsis · Divergences from the Outline · Harvest · Accidental Canon · End State · Proposals.
- **Proposals, never writes**, written to the notes file's § Proposals as unchecked items and repeated in the report: Revelation Log lines for state changes the prose established; promotions of accidental canon into a bio or worldbuilding entry; manifest additions for new named elements; **closures of Tier 1 chains** in primer §2 whose payoff this chapter delivered. Same contract as `blueprint`: canon is the author's, and the skill appends only on approval. This is also how chains close; without it, closure is manual and will not happen.
- **`outline/_index.md`** regenerated so the chapter's **Notes** column reflects the new state; bump `chapters_noted` in its frontmatter.
- Snapshots of any overwritten notes file to `chapters/chapter-NN/.history/` as `ch<NN>-notes-v<version>-<date>.md`.
- Updates to `state.md`: `What Exists → Notes` line, `Summary`, `Last Session`, `What's Next` (including the count of unintegrated proposals, which is what tells the author a `canon-sync` is owed).

## Preconditions

- **`ch<NN>-prose.md` must exist.** Otherwise refuse and recommend `prose`.
- **Gate on prose `status`, not on prose existing.** Notes taken from a first draft describe a chapter about to be rewritten, and every revision pass would invalidate them. Run at `revising` or `approved`. If the user asks for notes on a `drafted` chapter, say so, run if they insist, and stamp `prose_status_at_run: drafted` so the re-run is known to be owed.
- **The outline and Blueprint should exist.** Notes diffs intent (outline) against page (prose) and checks plants (Blueprint) against what landed. Missing either, run with what exists and say which section is thinner for it.
- **Staleness.** If the notes file's `prose_version` is older than the prose's current `version`, the notes are stale; offer to re-run before anything downstream reads them.

## What to do

### 1. Determine the mode

- *"Take notes on chapter 17," "record what ch 3 committed"* → **single-chapter**.
- *"Notes for Act 1," "catch up the notes," "run notes on everything approved"* → **batch**. Required for projects adopting the stage mid-stream.
- Ambiguous *"run notes"* → propose a batch over every chapter with prose at `revising`/`approved` and no current notes file, and confirm.

### 2. Read context

Per chapter, in substantive mode (full reads, never grep; see `references/reading-discipline.md`):

- `ch<NN>-prose.md` (full). The page is the source of truth here.
- `ch<NN>-outline.md` (full), to diff intent against page. Read its `authorship`: divergence from an author-written outline is more likely deliberate; divergence from an `ai-generated` outline in `ai-generated` prose is more likely drift. That informs the flag; it doesn't decide it.
- `ch<NN>-blueprint.md` (full), to check what was to be planted and what state it set. Its § 8 Continuity is the list of things to verify landed.
- The prior chapter's `ch<NN>-notes.md` End State, if it exists, so this chapter's inherited state can be checked against what the prose actually did with it.
- `primer.md` § 2 Reveal Architecture, to see whether this chapter was a registered plant or payoff chapter.
- `manifest.md`, to know which named things already have entries.

This is roughly 12,000 words of input for a compact structured output, so **dispatch it as a subagent** (`references/subagent-pattern.md`) returning a short report; in batch mode, one subagent per chapter, in parallel. Notes never reads a later chapter.

### 3. Propose the plan

> Notes for ch 1–6 (all `approved`, none noted yet):
>
> - **Read** per chapter: prose, outline, Blueprint, prior notes end-state, primer §2, manifest. One subagent per chapter, parallel.
> - **Write** six `ch<NN>-notes.md` files.
> - **Propose** (nothing written to canon): Revelation Log lines, accidental-canon promotions, manifest additions, and any §2 chain closures, written to each file's § Proposals and summarized for you. `canon-sync` applies them per span.
> - **Update** the index Notes column and `state.md`.

### 4. Extract

Each subagent writes the six sections. The discipline per section:

- **As-Written Synopsis** (~150–250w): what is on the page, as its author, causal and specific: who did what, what was revealed, how the story's state changed by the last line. Not a teaser, not the outline's intent restated. Downstream consumers (`blueprint`, `prose`, `canon-sync`, `brainstorm-session`) prefer this over the prose frontmatter synopsis when it exists.
- **Divergences from the Outline**: each place the page departs from the outline, one line each, flagged **deliberate** (the author wrote or revised it, or the change is clearly a choice) or **drift** (the model wandered). When in doubt, flag drift and say so; the author rules.
- **Harvest**: concrete particulars the chapter committed. **Nouns, not themes.** The half-eaten apple, the matchbook branding, the rooster three properties over, the skate shoes on the dig site. One line each, enough context to find it again. This is searched across `chapters/*/ch*-notes.md` by later stages; write for that reader.
- **Accidental Canon**: details the prose invented that no canon file holds. The mudroom floor's material, a walk-on's name, a route through the house. Each with where in canon it would belong if promoted.
- **Proposals**: one unchecked item per proposal, typed (Revelation Log · Promote · Manifest · Chain closure), specific enough for `canon-sync` to act on without re-reading the prose. `canon-sync` checks them off with their outcome; `notes` never touches a checked item on re-run.
- **End State**: the structured block: hour, location, wardrobe, injuries, objects carried, emotional residue, plus anything else the next chapter inherits (a character's last known position, an open beat). This is what the next Blueprint reads instead of 3,500 words of prose; be exact.

Then the subagent checks the Blueprint's plants and established state against the page and reports what did and did not land, and checks primer §2 for a chain this chapter was to plant or pay.

### 5. Show, write, wire, report

Show the notes file (or the batch in chunks). After approval: snapshot, write, regenerate the index, update `state.md`. The report carries the proposals as a single approve-or-decline list:

> Notes complete for ch 1–6. Proposals (nothing written yet):
> - **Revelation Log**: Muppy · Ch 1 — cheatgrass awn in the webbing of a forepaw, still in at chapter's end. Append to `characters/muppy.md`?
> - **Promote**: the Hartleys' mudroom (floor, doggy-door flap, where found objects go) appears in ch 1, 4, 6 with consistent detail and no entry. Recommend `worldbuilding-entry`.
> - **Manifest**: the rooster three properties over (ch 1, 5). Add as a minor element?
> - **Chain closure**: §2's jacket chain (plant ch 1, pay ch 3) paid in ch 3 as registered. Strike it?
> - **Did not land**: the Blueprint for ch 4 required Pickle's household trace; the prose has no scent-as-event for it. Flagged for the author, not fixed.
>
> 5 unintegrated proposals now outstanding (in each file's § Proposals); a `canon-sync` pass is owed before blueprinting Act 2.

Proposals are not applied here; they wait in § Proposals for `canon-sync`, which reads notes per span, classifies what has accumulated, adjudicates contradictions by authorship, and applies on approval. (If the user wants a single obvious Revelation Log line appended immediately, do it, mark the item `applied`, and say so.) The owning mechanisms are: Revelation Log lines appended directly (as `blueprint` does); promotions routed to `character-bio` / `worldbuilding-entry`; manifest additions to `manifest-sync`; chain closures as a logged decision via `decision-capture` so the strike survives primer regeneration.

## Series Mode

If `state.md` shows `project_type: series`, read `references/series.md` first. Operate on the focused book's chapters; the harvest and end-state are book-local, but accidental canon and proposed Revelation Log lines target the shared canon at the series root and are book-qualified (`Ch B2-07`). A cross-book chain paid in this book proposes its closure in `series.md` as well as primer §2.

## What this skill does not do

- **Evaluate the prose.** No craft judgments, no pacing opinions, no quality adjectives.
- **Edit the prose.** A divergence flagged drift is the author's to resolve through `prose` revise mode.
- **Write canon.** It proposes; `canon-sync`, `character-bio`, `worldbuilding-entry`, `manifest-sync`, and `decision-capture` apply on approval.
- **Maintain a central harvest file.** The harvest lives inside each chapter's notes; searching it is a glob across `chapters/*/ch*-notes.md`. Derived artifacts can be large; maintained artifacts must be small.
- **Read a later chapter.** Ever.

## References

- `references/file-schemas.md`: § Notes (`ch<NN>-notes.md` schema), § Blueprint, § Prose, `outline/_index.md`, per-chapter `.history/`, primer §2 Reveal Architecture (the chain register)
- `references/canon-schemas.md`: § Revelation Log
- `references/plan-first.md`, `references/reading-discipline.md`, `references/subagent-pattern.md`
- `references/series.md`: read when `project_type: series`
