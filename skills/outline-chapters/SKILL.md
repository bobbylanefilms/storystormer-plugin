---
name: outline-chapters
description: Write, revise or fact-check per-chapter outlines against the chapter spine. Use for “outline Act 1,” “expand chapter 17,” “tighten chapter 23,” “check my chapter 1 outline against canon.”
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

Typical density is **500–1,500 words per 3,000-word chapter**, but the real rule is *whatever the author writes*. It may include specific action beats, interiority, direction, and dialogue, up to and including every line of dialogue in the chapter. It is not written to a schema. The file shape is in `references/file-schemas.md` § `ch<NN>-outline.md`: the app's five frontmatter keys (`chapter`, `title`, `pov`, `act`, `summary`) plus the plugin's, a body of flowing prose with no H1 (divided into scene sections when the chapter has more than one scene, § Scene sections and Found Documents below), and, on a generated outline, a closing `## Synopsis`.

What the outline is **not**: a beat sheet, a prose brief, or a place for craft rules (the one exception is a Found Document scene, whose section body is a brief for what the document is and must reveal). Any heading in the body other than `## Scene <n>` scene headings and the closing `## Synopsis` belongs in the Blueprint or the style guide.

### The `authorship` field

Every outline carries `authorship`, and it changes how this skill behaves (`references/file-schemas.md` § `ch<NN>-outline.md` → `authorship` and § Scene sections → Authorship per scene):

- **`author_written`**: the author wrote it. **Correction-only mode.**
- **`ai_generated`**: this skill wrote it. Freely regenerable.
- **`ai_generated_author_revised`**: this skill wrote it and the author reworked it. **Correction-only mode**, identical to `author_written`.

These are the app's values, and the app enforces the same protection: its re-outline refuses an author-written or author-revised outline unless told to. Older files spell them with hyphens; read those as the same values and write the underscore form on the next write. A new AI outline is written as `ai_generated`.

In a sectioned outline, protection is **per scene**: the frontmatter's `authorship` is Scene 1's and the default for later sections; a later scene whose authorship differs carries a section `authorship:` line on file-backed stores, whereas on a store that keeps per-scene outline files (`references/store/storystormer.md` § Quirks → Scene sections) the chapter file carries no section `authorship:` line — read each later scene's protection from `scenes/ch<NN>-scene-MM-outline.md` and set it there. Any scene (or whole file) at `author_written` or `ai_generated_author_revised` is **protected**: name it in the plan and exclude it (leaving its section byte-identical) unless the author explicitly asks to change it. Where a write modifies a protected scene with the author's approval, pass `force`: because `force` covers every section of that write, send it **only** when the author asked for every protected scene the write changes — and remember that changing the chapter `title` or `## Synopsis` with any protected scene needs `force` too (`references/store/storystormer.md` § Quirks → Scene sections).

Before touching any existing outline, **detect author revision**:

- **File-backed stores:** compare the body's actual word count (excluding frontmatter, `## Synopsis`, and in a sectioned outline the section headings and key lines) against `word_count`, and where it helps against the newest version `store.history` returns. A mismatch means the author changed it: in a sectioned outline, mark the section that changed when the comparison can tell which one, or the file when it can't (`references/file-schemas.md` § `ch<NN>-outline.md` → `authorship`).
- **On the StoryStormer store:** rely on the app's per-scene `authorship` (read from the chapter file for Scene 1 and `scenes/ch<NN>-scene-MM-outline.md` for later scenes) instead of word-count detection — an edit in the app to a later scene leaves Scene 1's stored plugin keys fresh, so word-count detection there would wrongly mark Scene 1 (`references/store/storystormer.md` § Quirks → The app edits outlines too).

Set `ai_generated_author_revised` before doing anything else when revision is detected. **Never downgrade `author_written`**, whatever history says.

### Scene sections and Found Documents

The full format and rules live in `references/file-schemas.md` § `state.md` → `scene_structure`, § `ch<NN>-outline.md` → Scene sections, and § `chapters/` folder → Scenes (with StoryStormer store specifics in `references/store/storystormer.md` § Quirks):

- **When to divide into scenes (`scene_structure`).** Read `scene_structure` from the root `state.md` (absent means `as_needed`):
  - `single`: never write scene headings — every chapter this skill outlines is a plain outline.
  - `multiple`: divide every undrafted chapter this skill outlines into two or more scene sections.
  - `as_needed`: write one scene (plain outline) unless the time, the place, or the point of view changes within the chapter, and divide it there.
- **Drafted chapters keep their scene list.** A chapter that already has prose keeps its existing scene count under any `scene_structure` (the app enforces this; never propose adding, removing, or flattening scenes on a drafted chapter).
- **Section format and key lines.** Each section opens with `## Scene <n>: <title>` (or `## Scene <n>`), numbered 1, 2, 3… in order, followed directly (no blank line) by optional key lines — `pov:`, `kind:`, one- or two-sentence `summary:` (and on file-backed stores `authorship:` on a later scene whose authorship differs) — then one blank line and the section body. **Write key values unquoted** (a quote there is part of the value). No sections means one scene; a file is sectioned only when the chapter has more than one scene.
- **Frontmatter, `version`, and complete writes.** `chapter`, `title`, `act`, and the closing `## Synopsis` stay chapter-level. Frontmatter `pov` and `summary` are Scene 1's: keep each equal to Scene 1's key line **only when Scene 1's key line is written**; when Scene 1's section omits `pov:` or `summary:`, leave that frontmatter key as read (so a store fallback isn't written onto Scene 1). The chapter file's `version` is Scene 1's: a write that changes only later scenes sends `version` as read with no bump (and on the StoryStormer store, send `version` as read — the app advances Scene 1's version itself when Scene 1 changes). **Every write carries every section of the chapter**, leaving unchanged sections byte-identical: on a file-backed store a section left out is a scene removed, while on the StoryStormer store leaving one out removes nothing (scenes are removed or merged in the app).
- **Found Documents.** Plan a Found Document scene (`kind: found_document`) **only** where the treatment or the author calls for one — never invent one. Its section body is a **brief** (what the document is and what it must reveal), not beats. Turning a Found Document back into a narrative scene writes `kind: narrative` once, since leaving `kind:` out keeps the scene's kind on the StoryStormer store; narrative scenes otherwise omit `kind:`. A chapter that is a **single Found Document scene** has a plain outline with no outline marker (`kind` doesn't appear on a plain chapter outline): the author names it, and its prose file's `kind` marks it once written.

## What you produce

- **`chapters/chapter-NN/ch<NN>-outline.md`**: one file per chapter, in that chapter's folder, chapter-number-prefixed and zero-padded (`ch17-outline.md`).
- **`outline/_index.md`**: the outline view (chapter × stage matrix), regenerated per `store.md` so each chapter's Outline column reflects the new state (version link, or `—`, plus any inline markers).
- Snapshots of any overwritten outline, per `store.md`. New outlines have nothing to snapshot.
- The session's journal entry, extended (or created, when this is the session's first write; `references/file-schemas.md` § `journal/`): the chapters outlined or corrected, the markers carried, and the chain-check results.
- Updates to `state.md`: `What Exists → Chapter outlines` line (`12/40 drafted`), `Summary`, `Last Session` (two or three sentences and the journal entry's path), `What's Next`; `stage` advances to `outline-drafted` only when every spine chapter is outlined and zero unresolved markers remain across the bodies, otherwise `outlining`.

## Preconditions

- **`outline/structure.md` must exist.** If it doesn't, refuse and recommend `pre-outline-session`. Outlining without a spine means inventing the spine and the chapters in one pass, which is the failure mode `pre-outline-session` exists to prevent.
- **The relevant Chapter Spine entries must exist.** "Outline chapter 41" against a 40-chapter spine is a gap to surface, not a chapter to invent.

## What to do

### 1. Determine the mode

- *"Outline Act 1"*, *"draft chapters 1–10"*, *"fill in the next act"* → **batch generation**.
- *"Expand chapter 17"*, *"tighten chapter 23"*, *"this chapter's beats are off"* on an `ai_generated` outline → **single-chapter revision**.
- Any request to change an outline whose `authorship` is `author_written` or `ai_generated_author_revised`, and any *"check chapter N against canon"*, *"audit my outline"* → **correction-only**.
- Ambiguous *"work on the outline"* → propose batch generation for the next un-outlined act and confirm.

Read the target file's `authorship` — and, in a sectioned outline, each scene's `authorship` (from its section key line on file-backed stores, or from `scenes/ch<NN>-scene-MM-outline.md` where the binding keeps per-scene outline files), after revision detection — *before* choosing between revision and correction-only. A user asking to "expand" an author-written outline or scene gets the correction-only triage and an explanation of why the skill will not regenerate it. In a sectioned outline, revision and correction-only work per section: one chapter can hold a protected scene (left byte-identical or corrected on approval) beside an `ai_generated` scene that is freely revised.

### 2. Read context

**Batch generation** (say, chapters 1–10), in substantive mode:

- Root `state.md` for `scene_structure` (`single`, `multiple`, or `as_needed`; absent = `as_needed`), plus `store.list(chapters/*/ch*-prose.md)` and `store.list(chapters/*/scenes/ch*-scene-*.md)` so any drafted chapter in range keeps its scene count
- `outline/structure.md` (full)
- `primer.md` (full; §3 Structural Framework especially)
- `treatment.md` (full; you will map specific treatment passages onto specific chapter slots)
- `manifest.md` (full)
- Major bios for any POV character in the batch (full); supporting bios for major non-POV characters in the batch (full)
- `decisions/_index.md`, then the `plot`, `character` and `theme` decision entries affecting the range (full), skipping superseded and retracted ones
- `questions/_index.md`, then the open question entries mapping to spine slots in the range
- `.storystormer/genre-reference.md` if it exists (obligatory scenes that should land in this range)
- Existing outlines adjacent to the batch (the chapter before and after) for continuity, plus any existing outlines in the target range (and their `scenes/ch<NN>-scene-MM-outline.md` files where the binding keeps them, for per-scene protection)
- **Style samples**: the 2–3 most recent outlines whose `authorship` is `author_written` or `ai_generated_author_revised`, preferring chapters near the target range. See § Style inheritance.

**Single-chapter revision** (chapter N, `ai_generated` or containing `ai_generated` sections): root `state.md` (`scene_structure`), whether chapter N already has prose (fixes its scene count), `structure.md` (full), the existing outline (full, plus `scenes/ch<NN>-scene-MM-outline.md` for later scenes' authorship where the binding keeps them), N-2 through N+2 if they exist, primer §3, the treatment passages for this spine slot and any passage that states a plant or payoff for this chapter (targeted read, permitted because the spine and the existing outline provide grounding), bios for the chapter’s cast (full for major-tier, frontmatter + Quick Reference otherwise), the decision and question entries affecting the chapter (found through the two indexes), and the style samples.

**Correction-only** (chapter N): the outline (full, plus `scenes/ch<NN>-scene-MM-outline.md` for later scenes' authorship where the binding keeps them), every canon file it touches (full bios and worldbuilding entries for anyone and anything named or implied in the body), `decisions/_index.md` and every live decision entry touching what the body names (full), `questions/_index.md` and the open entries it cites, and `structure.md`. This is a canon audit; it reads more canon than a generation pass does, because the job is to find where the text and canon disagree.

List the files at the top of your next response, full-read each, and quote at least one passage from each. See `references/reading-discipline.md` § Substantive mode.

### 3. Propose the plan

Always state the project's `scene_structure` (from root `state.md`) and the proposed scene breakdown per chapter: either one scene, or the proposed scene list with a one-line summary for each scene (marking any Found Document scene, and noting any drafted chapter whose scene count stays fixed). Name every protected scene (file-level or section-level) and state that it is excluded unless the author asks to change it (and note when changing the chapter `title` or `## Synopsis` alongside a protected scene would require `force`).

**Batch generation example:**

> Plan for outlining Act 1 (chapters 1–10):
>
> - **Read** (substantive mode): `state.md`, `structure.md`, `primer.md`, `treatment.md` (~6,800w), `manifest.md`, the 3 major-tier bios for POV / heavy characters in Act 1, the 4 supporting bios, and the 5 open questions touching ch 1–10.
> - **Scene structure** (`as_needed`): ch 1, 2, 4–6, 8–10 are one scene each; ch 3 splits into two scenes (Scene 1: *The Ferry Dock* — Ada boards and spots the harbor official; Scene 2: *The Manifest* `[found_document]` — the cargo manifest she photographs); ch 7 splits on a POV shift (Scene 1: Marlowe's audit; Scene 2: Voss's call). Ch 1 is `author_written` (protected) and excluded unless you ask to touch it.
> - **Style samples**: ch 1 (`author_written`).
> - **Generate**: 9 outline files (ch 2–10), each a prose account at roughly 600–1,200w. Shown in two halves (ch 2–5, then 6–10).
> - **Markers**: 2 spine slots carry `[OPEN: Q-014]` (the ch 3 inciting mechanism); I'll carry the marker inline rather than invent the mechanism.
> - **Chain check**: the treatment states 4 load-bearing chains; 2 plant in this range. I'll confirm each plant is present in its chapter's body.
> - **Update**: `outline/_index.md` regenerated per `store.md`; `state.md` updated.

**Correction-only example:**

> Chapter 1 is `author_written`, so this is a correction pass, not a rewrite. I'll audit it against every canon file it touches (Muppy, Pickle, Vinnie, Tommy, the burial site, the jacket, Golden Valley, the BLM land, the decisions touching them), then show you a triage: canon contradictions, POV-capability breaches, stale scaffolding, and sequencing errors, each with the smallest fix quoted. I'll also list the prose-stage items I'm declining to touch. Nothing changes until you approve specific items.

### 4. Generate (`ai_generated` mode)

For each chapter in the batch, write the prose account. Anchor it on:

- **The spine slot**: the chapter's block in `structure.md` (heading, Status, POV, Act, entry). This is the contract.
- **The treatment source**: the treatment scene(s) that map to this slot.
- **The plants**: which setups the treatment's narrative states as planted or paid in this chapter's slot (the treatment says what a clue really is and where it pays off). The plant must be *present in the body as an event*; it is never labeled as a plant, and the rationale for it never appears. The outline is where plants are seeded into chapters; the Blueprint later turns the setups the outline carries into imperatives for the prose agent.
- **The cast's arcs**: what each appearing character's arc does here, anchored to the bio's Lie / Ghost where the chapter touches them. Render that as what they *do and feel* in the narrative, not as a note about them.
- **POV**: from the spine entry or the act's POV strategy.

Write in the house style the samples establish (§ Style inheritance). With no samples, write in **present tense, third person** (the recommended register, and the app's), mostly indirect dialogue with occasional direct lines, one paragraph per movement, partly voiced toward the POV character, and flag the batch as style-setting. Present tense is a default for generated outlines only; an author's outline keeps the tense the author wrote it in.

Fill the frontmatter from the spine slot: `chapter`, `title` (the block's heading), `pov` (its `**POV:**` line), `act` (its `**Act:**` line, as written), and a one- or two-sentence `summary`. When the chapter is divided into scene sections per `scene_structure` (§ Scene sections and Found Documents; keeping any drafted chapter's existing scene count), write each section with its `## Scene <n>: <title>` heading, unquoted key lines (`pov:`, `kind: found_document` only where the treatment or author calls for a Found Document, and a one- or two-sentence `summary:`), one blank line, and the scene's body (a prose account for narrative scenes; a brief — what the document is and what it must reveal, not beats — for a Found Document). In a sectioned outline, frontmatter `pov` and `summary` are Scene 1's (keep each equal to Scene 1's key line when written, and leave it as read when Scene 1 omits that line). End the outline with `## Synopsis` (chapter-level, after the last scene section): 150–250 words recording the chapter's causal events, reveals, who learns what, and how things stand at its end, so later chapters can build on it without rereading the body (the app's chapter writer produces the same closing section).

Content must trace to the spine, a treatment passage, a logged decision, a bio, or an honest `[NEEDS DEVELOPMENT: …]` / `[OPEN: Q-###]` marker carried inline in the body. You do not invent plot events, character actions, settings, or dramatic moments beyond these sources. The biggest failure mode is AI-default scene mechanics: a chase the treatment never called for, a confrontation the bios don't justify, a setup invented at outline time that fights what the treatment states. *Outline = render the existing decisions at chapter resolution, not author new ones.*

If a chapter slot's treatment source is thin or absent, surface it before generating.

### 5. Correct (`author_written` / `ai_generated_author_revised` mode)

**The skill may not regenerate. It may only correct.**

**May change:**
1. **Factual contradictions with canon**: a decision, bio, or worldbuilding entry says otherwise. Smallest possible edit: a word or phrase swap, not a rewritten sentence.
2. **POV-capability breaches**: the narration asserts knowledge or perception the POV character cannot have. This is content, not style.
3. **Stale frontmatter and scaffolding**: version stamps, missing app keys (an author's file without `summary` or `act` gets them filled from the spine slot; the body is untouched), retired values (`act: 2A`, hyphenated `authorship`), superseded editorial notes, resolved markers, leftover schema sections from the old outline shape (which move to the Blueprint or the style guide, never get deleted silently; see § Migration).
4. **Sequencing errors** where canon fixes an order the text gets wrong. This is the largest edit permitted and **must be surfaced explicitly before it is made**.

**May not change:**
- Sentence rhythm, diction, or register.
- Prose-stage rendering choices: verbs of perception, grammatical mood, idiom, verdict words, dialogue phrasing. Those belong to the prose agent working from the style guide. Fixing them in an outline is regenerating it.
- Anything the author has explicitly ruled on, even where canon disagrees. Log the disagreement instead.

**Workflow, mandatory:**
1. Audit the outline against current canon in substantive mode.
2. **Triage into buckets** and present the full triage before editing anything: canon contradictions, POV breaches, prose-stage items (declined, listed anyway), additive gaps (things canon says should happen here that the text omits, offered, never inserted unasked), and canon-internal conflicts. Quote the smallest possible fix for each item.
3. Apply only what is approved. In a sectioned outline, edit only the approved section(s), leave every other section byte-identical, carry every section in the write, keep `version` as read when Scene 1 is unchanged, and pass `force` only when the author approved every protected scene the write touches (including a chapter `title` or `## Synopsis` change with any protected scene).
4. Snapshot the prior version per `store.md`.
5. Report what was declined and why, not just what was changed.

**When canon disagrees with itself**, surface it, apply the more recent and more specific entry, mark it reversible in the report, and say plainly that a choice was made. Do not block the pass on a single unresolved word.

### 6. Revise (`ai_generated` mode, single chapter)

The existing outline is the starting point, not a clean rewrite. If the user's complaint is vague (*"this feels low-energy"*), diagnose before rewriting: propose what you think is off (under-specified movement, a chain that doesn't land, interiority too thin, a continuity seam with the neighbor) and let the user confirm. Then write the targeted revision, snapshot the prior version, and show the diff.

In a sectioned outline, revise **per section**: rewrite only the section(s) being revised, leave every other section byte-identical (heading, key lines, body), and always carry every section in the write (on a file-backed store an omitted section removes a scene). Protected scenes in the same chapter are named in the plan and left untouched unless the author explicitly asks to change them — and pass `force` only when the author approved every protected scene the write changes (a changed chapter `title` or `## Synopsis` with any protected scene needs `force` too). When Scene 1 is unchanged, send `version` as read (no bump) and keep frontmatter `pov`/`summary` as read if Scene 1 omits those key lines. Never change the scene count of a chapter that already has prose; use `kind: narrative` once if turning a Found Document scene back to narrative.

When a structural change ripples (the midpoint moved from ch 18 to ch 20), re-outline the affected range as a batch so the cross-chapter checks run again.

### 7. Density

Whatever the author writes. 500–1,500 words per 3,000-word chapter is typical. For generated outlines, match the samples' density (words of outline per 1,000 words of target chapter); with no samples, aim for the middle of that band. **Never pad an outline to hit a target, and never pad an author-written outline at all.**

### 8. Cross-chapter checks (batch mode)

Before finalizing a batch:

- **Continuity seams**: chapter N's closing state should be what chapter N+1 opens on. Mismatches mean a missed transition; flag and resolve.
- **Chain check against the treatment**: for every load-bearing chain the treatment's narrative states, the **plant chapter** and **payoff chapter** both exist in the spine; where both are outlined, the plant is actually present in the plant chapter's body. **Orphans surface as report items, not blocking errors.** An unplanted chain mid-draft is normal; an unplanted chain whose plant chapter is already written is not.
- **POV consistency**: each chapter's (and in a sectioned outline, each narrative scene's) POV matches the act's POV strategy in `structure.md` (Found Document scenes carry no POV). Unexpected shifts should be the author's choice, noted in the spine slot, never introduced at outline time.

Surface failures to the user before writing. Don't fix them silently.

### 9. Show, write, wire, report

Show batches in halves and let the user approve, request per-chapter edits, or request a global adjustment (then re-show). After approval: snapshot superseded versions per `store.md`, `store.write` the files with full frontmatter (the five app keys filled, with frontmatter `pov`/`summary` matching Scene 1's written key lines — or left as read where Scene 1 omits them — in a sectioned outline; `authorship` set; `version` sent as read when only later scenes changed; `structure_version`, `treatment_version`, `primer_version` stamped; `word_count` recorded), carrying every section with unchanged sections byte-identical and passing `force` only when the author approved every protected scene the write changes, regenerate `outline/_index.md` per `store.md`, extend the session's journal entry, update `state.md`.

When a chapter you just outlined already has prose the new outline no longer describes (typically intake prose from before StoryStormer, which the author's newer plan replaced), **propose retiring that prose** in the report; don't retire it yourself. On the author's yes, set its `status: retired` with a frontmatter-only edit, body untouched (`references/file-schemas.md` § Prose → `status: retired`), so it stops anchoring the voice and feeding the story-so-far.

> Outline-chapters batch complete. Wrote 10 outlines (ch 01–10), ~9,100w total, all `ai_generated`, matched to the style of your ch 1 and ch 2 (`author_written`). ch 3 carries `[OPEN: Q-014]` inline (the inciting mechanism). Chain check: both treatment chains that plant in Act 1 are present (the locket, ch 2; the ledger page, ch 7). Index regenerated. Next: review Act 1, then the first half of Act 2.

## Style inheritance

A project will commonly have some chapters the author outlined by hand and later chapters generated. **Generated outlines must borrow the house style from the author's**, or the set becomes a patchwork and the seams show. Before generating in `ai_generated` mode, read the **2–3 most recent outlines whose `authorship` is `author_written` or `ai_generated_author_revised`**, preferring chapters near the target, and match them. Author-revised files are full-strength samples, arguably the best ones, since they show what the author corrected *toward*.

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

1. Snapshot the outline per `store.md`.
2. Reduce the body to the prose account. If the old file had no prose body (beats only), the beats *are* the content: expand them into a prose account in `ai_generated` mode, or, if the author wrote the beats, leave them and set `author_written` so the Blueprint stage reads them as content.
3. Open Threads: confirm each `[OPEN: Q-###]` has its entry in `questions/` (the index answers it); leave the marker inline in the body only where it marks a real gap in the narrative.
4. Set `authorship`. Default `ai_generated` if the history shows a skill wrote it; otherwise ask. Fill the five app keys (`chapter`, `title`, `pov`, `act`, `summary`) from the spine slot.
5. Recommend rebuilding the chapter's Blueprint, since the Blueprint derives the removed scaffolding from canon rather than transplanting it.

Craft Constraints that were general belong in `voice/style-guide.md`; chapter-specific placements belong in the Blueprint's Chapter-Specific Craft section. Surface both in the report rather than moving them silently.

## Series Mode

If `state.md` shows `project_type: series`, read `references/series.md` first. Operate on the **focused book's** chapters: read `books/<current_focus>/outline/structure.md`, write `books/<current_focus>/chapters/chapter-NN/ch<NN>-outline.md`. `scene_structure` is a project setting and is always read from the root `state.md`, not the book's.

Session bookkeeping goes to the root: the book's `state.md` takes its Summary, What Exists, What's Next and Last Session, and the root `state.md` takes `session_count` and `last_session` (`references/series.md` § Series-level `state.md` vs per-book `state.md`).

Three additions:

1. **Cross-book chains.** When a spine entry references a cross-book setup or payoff (*“Ch 38 · protocol deviation planted (pays off book 3 ch 22)”*), the planted or paid event must be present in the outline body as narrative. The chain lives in the Bible and reaches this book through its treatment; the outline shows the event, never the chain. If the receiving book is not yet drafted, note it in the report, not in the outline.
2. **No Bible read.** This skill reads the spine, the treatment and canon, never `series.md` (the feed rule, `references/series.md` § The Series Bible). A cross-book plant the slot needs that the treatment doesn’t state is a `treatment-update` gap: flag it in the report. Don’t full-read other books’ treatments unless a specific slot demands it.
3. **Chapters that move between books.** When the spine moves an existing chapter to another book, or to another place in its own book, move its folder with `store.move` (`references/store.md` § Operations) rather than writing a new outline there and deleting the old one: the move keeps its outline, drafts, Blueprint and notes. A move to another book appends the chapter; a place other than last is a second move within that book. Re-read every changed path before writing to it, and run the cross-chapter checks again on both books’ neighboring chapters.

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
- `references/file-schemas.md`: `ch<NN>-outline.md` shape (frontmatter, prose body, Scene sections), `state.md` (`scene_structure`), § `chapters/` folder → Scenes (Found Documents), `outline/_index.md`, per-chapter `.history/`, marker conventions
- `references/store/storystormer.md` § Quirks: per-scene outline files, `force`, `version` as Scene 1's, and app-tracked per-scene authorship
- `references/reading-discipline.md`: substantive mode
- `references/series.md`: read when `project_type: series`
- `references/frameworks.md`: character vocabulary (Lie / Ghost) the outline renders as action
- `references/philosophy.md`: character pressure drives chapter movement
- `references/genres.md`: obligatory scenes that should land in specific slots
