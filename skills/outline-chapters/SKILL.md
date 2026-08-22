---
name: outline-chapters
description: Generate, correct, or revise per-chapter outlines against the chapter spine. A chapter outline is the author's prose account of what happens in the chapter — frontmatter plus a flowing narrative body, nothing else — and it is the only artifact in the pipeline that carries the author's voice. Three modes — batch generation ("outline Act 1," "draft the outlines for chapters 1 through 10," "fill in the next act"); single-chapter revision of an AI-generated outline ("expand chapter 17," "tighten chapter 23," "this chapter's tension feels low"); and correction-only passes over author-written outlines ("check chapter 1 against canon," "audit my outline"), which may fix facts but never regenerate. Reads `outline/structure.md` as the contract and writes `chapters/chapter-NN/ch<NN>-outline.md`. Refuses if no `outline/structure.md` exists — run `pre-outline-session` first.
---

# StoryStormer · Outline Chapters

You are writing, correcting, or revising the per-chapter outlines that hang off the chapter spine. The spine in `outline/structure.md` says *what each chapter is*; a chapter outline says *what happens inside it*, written the way the author thinks.

The outline is one of four chapter artifacts, and the four are split by **who reads them**:

| Artifact | Answers | Read by |
|---|---|---|
| `voice/style-guide.md` | *How do I write this book?* | the prose agent |
| **`ch<NN>-outline.md`** | ***What happens in this chapter?*** | the prose agent, and the `blueprint` stage |
| `ch<NN>-blueprint.md` | *What must I not get wrong?* | the prose agent |
| `ch<NN>-prose.md` | — | the author |

Two consequences govern everything this skill does. **The outline is the only artifact that carries the author's voice**, so protecting it is the point. And **the outline carries no scaffolding**: no premise block, no beat index, no setups-and-payoffs ledger, no character notes, no dialogue-anchor list, no craft rules, no open-threads section. All of that is derived from canon by the `blueprint` stage at better resolution than an outline could stage it, and anything the outline staged would only become a second source of truth that drifts.

Always follow `references/plan-first.md` — propose what you'll do, get confirmation, then execute.

## What an outline is

**The author's prose account of what happens in the chapter, to be expanded into full narrative prose. Nothing else.**

Typical density is **500–1,500 words per 3,000-word chapter**, but the real rule is *whatever the author writes*. It may include specific action beats, interiority, direction, and dialogue, up to and including every line of dialogue in the chapter. It is not written to a schema. The file shape is in `references/file-schemas.md` § `ch<NN>-outline.md`: frontmatter, an H1, and a body of flowing prose.

What the outline is **not**: a beat sheet, a brief, or a place for craft rules. If you find yourself writing a heading inside the body, stop; that content belongs in the Blueprint or the style guide.

### The `authorship` field

Every outline's frontmatter carries `authorship`, and it changes how this skill behaves:

- **`author-written`**: the author wrote it. **Correction-only mode.**
- **`ai-generated`**: this skill wrote it. Freely regenerable.
- **`ai-generated-author-revised`**: this skill wrote it and the author reworked it. **Correction-only mode**, identical to `author-written`.

A new AI outline is written as `ai-generated`. Before touching any existing outline, **detect author revision**: compare the file's `word_count` and body against the most recent skill-written snapshot in `chapters/chapter-NN/.history/`. If the body has changed outside a skill run, set `authorship: ai-generated-author-revised` before doing anything else. **Never downgrade `author-written`**, whatever the history folder says.

## What you produce

- **`chapters/chapter-NN/ch<NN>-outline.md`**: one file per chapter, in that chapter's folder, chapter-number-prefixed and zero-padded (`ch17-outline.md`).
- **`outline/_index.md`**: the outline view (chapter × stage matrix), regenerated so each chapter's Outline column reflects the new state (version link, or `—`, plus any inline markers).
- Snapshots of any overwritten outline to that chapter's `chapters/chapter-NN/.history/` as a flat `ch<NN>-outline-v<version>-<date>.md` file. New outlines have nothing to snapshot.
- Updates to `state.md`: `What Exists → Chapter outlines` line (`12/40 drafted`), `Summary`, `Last Session`, `What's Next`; `stage` advances to `outline-drafted` only when every spine chapter is outlined and zero unresolved markers remain across the bodies, otherwise `outlining`.

## Preconditions

- **`outline/structure.md` must exist.** If it doesn't, refuse and recommend `pre-outline-session`. Outlining without a spine means inventing the spine and the chapters in one pass, which is the failure mode `pre-outline-session` exists to prevent.
- **The relevant Chapter Spine entries must exist.** "Outline chapter 41" against a 40-chapter spine is a gap to surface, not a chapter to invent.

## What to do

### 1. Determine the mode

- *"Outline Act 1"*, *"draft chapters 1–10"*, *"fill in the next act"* → **batch generation**.
- *"Expand chapter 17"*, *"tighten chapter 23"*, *"this chapter's beats are off"* on an `ai-generated` outline → **single-chapter revision**.
- Any request to change an outline whose `authorship` is `author-written` or `ai-generated-author-revised`, and any *"check chapter N against canon"*, *"audit my outline"* → **correction-only**.
- Ambiguous *"work on the outline"* → propose batch generation for the next un-outlined act and confirm.

Read the target file's `authorship` (after the revision-detection step above) *before* choosing between revision and correction-only. A user asking to "expand" an author-written outline gets the correction-only triage and an explanation of why the skill will not regenerate it.

### 2. Read context

**Batch generation** (say, chapters 1–10), in substantive mode:

- `outline/structure.md` (full)
- `primer.md` (full; §2 Reveal Architecture and §3 especially)
- `treatment.md` (full; you will map specific treatment passages onto specific chapter slots)
- `manifest.md` (full)
- Major bios for any POV character in the batch (full); supporting bios for major non-POV characters in the batch (full)
- `decisions.md` (full; `plot`, `character`, `voice` decisions affecting the range)
- `questions.md` (open entries mapping to spine slots in the range)
- `.storystormer/genre-reference.md` if it exists (obligatory scenes that should land in this range)
- Existing outlines adjacent to the batch (the chapter before and after) for continuity
- **Style samples**: the 2–3 most recent outlines whose `authorship` is `author-written` or `ai-generated-author-revised`, preferring chapters near the target range. See § Style inheritance.

**Single-chapter revision** (chapter N, `ai-generated`): `structure.md` (full), the existing outline (full), N-2 through N+2 if they exist, primer §2 and §3, the treatment passages for this spine slot (targeted read, permitted because the spine and the existing outline provide grounding), bios for the chapter's cast (full for major-tier, frontmatter + Quick Reference otherwise), `decisions.md` and `questions.md` entries affecting the chapter, and the style samples.

**Correction-only** (chapter N): the outline (full), every canon file it touches (full bios and worldbuilding entries for anyone and anything named or implied in the body), `decisions.md` (full), `questions.md`, and `structure.md`. This is a canon audit; it reads more canon than a generation pass does, because the job is to find where the text and canon disagree.

List the files at the top of your next response, full-read each, and quote at least one passage from each. See `references/reading-discipline.md` § Substantive mode.

### 3. Propose the plan

**Batch generation example:**

> Plan for outlining Act 1 (chapters 1–10):
>
> - **Read** (substantive mode): `structure.md`, `primer.md`, `treatment.md` (~6,800w), `manifest.md`, the 3 major-tier bios for POV / heavy characters in Act 1, the 4 supporting bios, and the 5 open questions touching ch 1–10.
> - **Style samples**: none yet. This batch is **style-setting**; review ch 1 as a template, not just a chapter.
> - **Generate**: 10 outline files, each a prose account of its chapter at roughly 600–1,200w. Shown in two halves (ch 1–5, then 6–10).
> - **Markers**: 2 spine slots carry `[OPEN: Q-014]` (the ch 3 inciting mechanism); I'll carry the marker inline rather than invent the mechanism.
> - **Chain check**: primer §2 registers 4 load-bearing chains; 2 plant in this range. I'll confirm each plant is present in its chapter's body.
> - **Update**: `outline/_index.md` regenerated; `state.md` updated.

**Correction-only example:**

> Chapter 1 is `author-written`, so this is a correction pass, not a rewrite. I'll audit it against every canon file it touches (Muppy, Pickle, Vinnie, Tommy, the burial site, the jacket, Golden Valley, the BLM land, the decision log), then show you a triage: canon contradictions, POV-capability breaches, stale scaffolding, and sequencing errors, each with the smallest fix quoted. I'll also list the prose-stage items I'm declining to touch. Nothing changes until you approve specific items.

### 4. Generate (`ai-generated` mode)

For each chapter in the batch, write the prose account. Anchor it on:

- **The spine slot**: the exact line from `structure.md`. This is the contract.
- **The treatment source**: the treatment scene(s) that map to this slot.
- **The chains**: which primer §2 Reveal Architecture entries plant or pay in this chapter. The plant must be *present in the body as an event*; it is never labeled as a plant, and the rationale for it never appears. The chain register is planning-side knowledge; the outline shows the event and the Blueprint later launders it into an imperative for the prose agent.
- **The cast's arcs**: what each appearing character's arc does here, anchored to the bio's Lie / Ghost where the chapter touches them. Render that as what they *do and feel* in the narrative, not as a note about them.
- **POV**: from the spine entry or the act's POV strategy.

Write in the house style the samples establish (§ Style inheritance). With no samples, write in **present tense, third person**, mostly indirect dialogue with occasional direct lines, one paragraph per movement, partly voiced toward the POV character, and flag the batch as style-setting.

Content must trace to the spine, a treatment passage, a logged decision, a bio, a primer §2 reveal, or an honest `[NEEDS DEVELOPMENT: …]` / `[OPEN: Q-###]` marker carried inline in the body. You do not invent plot events, character actions, settings, or dramatic moments beyond these sources. The biggest failure mode is AI-default scene mechanics: a chase the treatment never called for, a confrontation the bios don't justify, a setup invented at outline time that fights the primer's Reveal Architecture. *Outline = render the existing decisions at chapter resolution, not author new ones.*

If a chapter slot's treatment source is thin or absent, surface it before generating.

### 5. Correct (`author-written` / `ai-generated-author-revised` mode)

**The skill may not regenerate. It may only correct.**

**May change:**
1. **Factual contradictions with canon**: a decision, bio, or worldbuilding entry says otherwise. Smallest possible edit: a word or phrase swap, not a rewritten sentence.
2. **POV-capability breaches**: the narration asserts knowledge or perception the POV character cannot have. This is content, not style.
3. **Stale frontmatter and scaffolding**: version stamps, superseded editorial notes, resolved markers, leftover schema sections from the old outline shape (which move to the Blueprint or the style guide, never get deleted silently; see § Migration).
4. **Sequencing errors** where canon fixes an order the text gets wrong. This is the largest edit permitted and **must be surfaced explicitly before it is made**.

**May not change:**
- Sentence rhythm, diction, or register.
- Prose-stage rendering choices: verbs of perception, grammatical mood, idiom, verdict words, dialogue phrasing. Those belong to the prose agent working from the style guide. Fixing them in an outline is regenerating it.
- Anything the author has explicitly ruled on, even where canon disagrees. Log the disagreement instead.

**Workflow, mandatory:**
1. Audit the outline against current canon in substantive mode.
2. **Triage into buckets** and present the full triage before editing anything: canon contradictions, POV breaches, prose-stage items (declined, listed anyway), additive gaps (things canon says should happen here that the text omits, offered, never inserted unasked), and canon-internal conflicts. Quote the smallest possible fix for each item.
3. Apply only what is approved.
4. Snapshot the prior version to `chapters/chapter-NN/.history/`.
5. Report what was declined and why, not just what was changed.

**When canon disagrees with itself**, surface it, apply the more recent and more specific entry, mark it reversible in the report, and say plainly that a choice was made. Do not block the pass on a single unresolved word.

### 6. Revise (`ai-generated` mode, single chapter)

The existing outline is the starting point, not a clean rewrite. If the user's complaint is vague (*"this feels low-energy"*), diagnose before rewriting: propose what you think is off (under-specified movement, a chain that doesn't land, interiority too thin, a continuity seam with the neighbor) and let the user confirm. Then write the targeted revision, snapshot the prior version, and show the diff.

When a structural change ripples (the midpoint moved from ch 18 to ch 20), re-outline the affected range as a batch so the cross-chapter checks run again.

### 7. Density

Whatever the author writes. 500–1,500 words per 3,000-word chapter is typical. For generated outlines, match the samples' density (words of outline per 1,000 words of target chapter); with no samples, aim for the middle of that band. **Never pad an outline to hit a target, and never pad an author-written outline at all.**

### 8. Cross-chapter checks (batch mode)

Before finalizing a batch:

- **Continuity seams**: chapter N's closing state should be what chapter N+1 opens on. Mismatches mean a missed transition; flag and resolve.
- **Chain check against primer §2**: for every registered load-bearing chain, the **plant chapter** and **payoff chapter** both exist in the spine; where both are outlined, the plant is actually present in the plant chapter's body. **Orphans surface as report items, not blocking errors.** An unplanted chain mid-draft is normal; an unplanted chain whose plant chapter is already written is not.
- **POV consistency**: each chapter's POV matches the act's POV strategy in `structure.md`. Unexpected shifts should be the author's choice, noted in the spine slot, never introduced at outline time.

Surface failures to the user before writing. Don't fix them silently.

### 9. Show, write, wire, report

Show batches in halves and let the user approve, request per-chapter edits, or request a global adjustment (then re-show). After approval: snapshot superseded versions, write the files with full frontmatter (`authorship` set; `structure_version`, `treatment_version`, `primer_version` stamped; `word_count` recorded), regenerate `outline/_index.md`, update `state.md`.

> Outline-chapters batch complete. Wrote 10 outlines (ch 01–10), ~9,100w total, all `ai-generated`, matched to the style of your ch 1 and ch 2 (`author-written`). ch 3 carries `[OPEN: Q-014]` inline (the inciting mechanism). Chain check: both §2 chains that plant in Act 1 are present (the locket, ch 2; the ledger page, ch 7). Index regenerated. Next: review Act 1, then Act 2A.

## Style inheritance

A project will commonly have some chapters the author outlined by hand and later chapters generated. **Generated outlines must borrow the house style from the author's**, or the set becomes a patchwork and the seams show. Before generating in `ai-generated` mode, read the **2–3 most recent outlines whose `authorship` is `author-written` or `ai-generated-author-revised`**, preferring chapters near the target, and match them. Author-revised files are full-strength samples, arguably the best ones, since they show what the author corrected *toward*.

What to match, concretely:

- **Density**: words of outline per 1,000 words of target chapter.
- **Tense and person**: present-tense third person is common ("Muppy escapes," "she wants nothing to do with him"); a past-tense AI outline clashes on the first sentence.
- **Dialogue treatment**: quoted in full, summarized indirectly, or mixed.
- **Interiority depth**: how much inner state the outline fixes versus leaves to the prose stage.
- **Narration versus direction**: events written as events ("she picks up the matchbook") or as bracketed instructions to the drafter ("[register the weight here]").
- **Paragraph granularity**: one paragraph per beat, or long flowing movements.
- **Voice leakage**: whether the outline already carries the book's POV voice or stays neutral.
- **Authorial asides**: direct address, rhetorical questions, evaluative commentary ("And did she mention that this dog has incredibly bad breath?").

**Do not build a derived style file.** An `outline-style.md` describing observed conventions is a lossy copy of a ground truth that already exists, and it goes stale silently. Read the samples directly, every run.

**Match form, never inherit canon errors.** Outlines are exempt from prose craft rules, so an aside or a verdict word in a sample is house style and may be reproduced. A factual canon error in a sample is a defect awaiting a correction pass, not house style.

**Cold start.** With no sample, generate to the default and **flag the batch as style-setting** in the report. The first AI outline in a project silently becomes the pattern every later one inherits; the author should review it as a template.

Where outlines are partly voiced, a style-matched outline carries author voice into the prose agent's context as a second conditioning input after the style guide. That makes outline style fidelity load-bearing rather than cosmetic.

## Migration of schema-form outlines

Projects outlined under the older nine-section schema (Premise / Setting & Time / Scene Beats / Setups Planted / Payoffs Delivered / Character Notes / Dialogue Anchors / Connections / Open Threads) need a one-time pass per chapter, which this skill runs when it encounters one:

1. Snapshot the outline to `.history/`.
2. Reduce the body to the prose account. If the old file had no prose body (beats only), the beats *are* the content: expand them into a prose account in `ai-generated` mode, or, if the author wrote the beats, leave them and set `author-written` so the Blueprint stage reads them as content.
3. Open Threads: confirm each `[OPEN: Q-###]` is registered in `questions.md`; leave the marker inline in the body only where it marks a real gap in the narrative.
4. Set `authorship`. Default `ai-generated` if the history shows a skill wrote it; otherwise ask.
5. Recommend rebuilding the chapter's Blueprint, since the Blueprint derives the removed scaffolding from canon rather than transplanting it.

Craft Constraints that were general belong in `voice/style-guide.md`; chapter-specific placements belong in the Blueprint's Chapter-Specific Craft section. Surface both in the report rather than moving them silently.

## Series Mode

If `state.md` shows `project_type: series`, read `references/series.md` first. Operate on the **focused book's** chapters: read `books/<current_focus>/outline/structure.md`, write `books/<current_focus>/chapters/chapter-NN/ch<NN>-outline.md`.

Two additions:

1. **Cross-book chains.** When a spine entry references a cross-book setup or payoff (*"Ch 38 · protocol deviation planted (pays off book 3 ch 22)"*), the planted or paid event must be present in the outline body as narrative. The chain itself is registered in `series.md`; the outline shows the event, never the chain. If the receiving book is not yet drafted, note it in the report, not in the outline.
2. **Light read of `series.md`** for the Cross-Book Setups and Payoffs section and the Per-Book Synopses relevant to the focused book. Don't full-read other books' treatments unless a specific slot demands it.

## What this skill does not do

- Generate prose. That's `prose`.
- Refresh `outline/structure.md`. That's `pre-outline-session`. If outlining reveals a structural problem, surface it and recommend a structural revision.
- Refresh the treatment or the primer. If an outline reveals the treatment is wrong, capture the implication as a decision and recommend `treatment-update`.
- Generate or refresh bios. Surface the gap and recommend `character-bio`.
- Sync the manifest. Flag and recommend.
- Build the Blueprint. Everything the old schema staged (premise, beat index, setups, character notes, dialogue anchors, connections) is now derived from canon by `blueprint`.
- Regenerate an author's outline. Ever.

## References

- `references/plan-first.md`: universal plan-first behavior
- `references/file-schemas.md`: `ch<NN>-outline.md` shape (frontmatter + prose body), `outline/_index.md`, per-chapter `.history/`, marker conventions, primer §2 Reveal Architecture (the chain register, with plant chapters)
- `references/reading-discipline.md`: substantive mode
- `references/series.md`: read when `project_type: series`
- `references/frameworks.md`: character vocabulary (Lie / Ghost) the outline renders as action
- `references/philosophy.md`: character pressure drives chapter movement
- `references/genres.md`: obligatory scenes that should land in specific slots
