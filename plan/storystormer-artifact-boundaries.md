# StoryStormer — Artifact Boundaries Spec

**Status:** proposal, author-directed 2026-08-17. Hand-off for the plugin agent.
**Affects:** `outline-chapters`, `blueprint`, `prose`, `treatment-update` (primer §2 schema), `decision-capture`, `manifest-sync`, two new skills (`notes`, `canon-sync`), `references/file-schemas.md`, `references/blueprint-spec.md`, `references/prose-spec.md`.
**Version:** 3 (2026-08-17) — adds §7 the backflow (`notes` and `canon-sync`) and the prose `authorship` field.
**Derived from:** a live run of `outline → blueprint` on *The Good Dog* chapter 1, which surfaced ~85% duplication between the two artifacts and a missing knowledge-horizon rule.

---

## 1. The problem

Two problems, both structural rather than executional.

**Duplication.** On the reference run, the chapter outline came to 3,405 words, of which 1,391 was the author's prose account of the chapter and **2,006 was scaffolding** — premise, setting, setups planted, character notes, dialogue anchors, connections, open threads, craft constraints. Roughly **1,700 of those 2,006 words were then reproduced in the Blueprint**, at higher resolution, derived from raw canon. Section-level overlap:

| Outline section | Words | Duplicated in Blueprint |
|---|---|---|
| Setting & Time | 75 | total |
| Character Notes | 451 | ~95% |
| Dialogue Anchors | 124 | ~90% |
| Open Threads | 440 | 100% |
| Craft Constraints | 469 | 100% |
| Setups Planted | 310 | ~85% |
| Connections | 80 | ~60% |
| **Author's prose body** | **1,391** | **0%** |

The duplication is not accidental. The current contracts have the outline stage *stage* material that the blueprint stage then re-derives from canon at better resolution. The scaffolding's only function is to be read by the next stage, and it has no life after that stage runs — except as a second source of truth that silently drifts when either file is edited.

**No knowledge horizon.** The Blueprint spec has a spoiler firewall for the *treatment* (don't seed the whole plot) but no rule against the Blueprint's own forward references. The reference Blueprint told a chapter-1 prose agent that the jacket is recovered in chapter 3, that a character disintegrates once the site turns out to have been watched, and where several reveals land. None of that helps write chapter 1, and all of it risks a prose agent writing toward a future it should not know about.

---

## 2. The responsibility model

Four artifacts, split by **who reads them** rather than by content type. That is the load-bearing principle: everything else follows from it.

| Artifact | Answers | Read by | Scope | Authored by |
|---|---|---|---|---|
| **Style guide** (`voice/style-guide.md`) | *How do I write this book?* | prose agent | whole novel, stable | the author |
| **Outline** (`ch<NN>-outline.md`) | *What happens in this chapter?* | prose agent, and the blueprint stage | one chapter | the author, or AI, or both |
| **Blueprint** (`ch<NN>-blueprint.md`) | *What must I not get wrong?* | prose agent | one chapter, **backward only** | AI, derived from canon |
| **Prose** (`ch<NN>-prose.md`) | — | the author, and the notes stage | one chapter | the author, or AI, or both |
| **Notes** (`ch<NN>-notes.md`) | *What did the prose actually commit?* | blueprint, prose, canon-sync, brainstorm | one chapter, backward only | AI, derived from prose |

Three consequences worth stating explicitly:

- **Craft never appears in the outline or the blueprint** beyond chapter-specific placement. General rules live in the style guide, once, for the whole book.
- **The outline is the only artifact that carries the author's voice.** Protecting it is the point of this restructure.
- **The blueprint is a continuity instrument, not a second outline.** If a line in the blueprint tells the prose agent *what happens*, it is in the wrong file.

---

## 3. The outline contract (revised)

### What it is

The author's prose account of what happens in the chapter, to be expanded into full narrative prose. **Nothing else.**

Typical density: **500–1,500 words per 3,000-word chapter.** It may include specific action beats, interiority, direction, and dialogue — up to and including every line of dialogue in the chapter. It is written the way the author thinks, not to a schema.

### File shape

```
---
chapter: 1
title: Escape from the Yard
version: 3
last_updated: 2026-08-17
structure_version: 1
treatment_version: 11
primer_version: 9
pov: Muppy
tense: past
act: 1
target_words: null
authorship: author-written        # see modes below
word_count: 1213
source: author's treatment text
revision: >-
  free-text note on what changed and why
---

# Chapter N — Title

[the author's prose account, and nothing else]
```

### What is REMOVED from the current schema

All of it, into the Blueprint: **Premise · Setting & Time · Scene Beats (the numbered index — the prose body stays) · Setups Planted · Payoffs Delivered · Character Notes · Dialogue Anchors · Connections · Open Threads.**

### New frontmatter field: `authorship`

Three values, and they change how `outline-chapters` behaves:

- **`author-written`** — the author wrote it. **Correction-only mode.** See §5.
- **`ai-generated`** — the skill wrote it. Freely regenerable.
- **`ai-generated-author-revised`** — the skill wrote it, the author reworked it. **Correction-only mode**, same as `author-written`.

Default for a new AI outline is `ai-generated`. The skill must set it to `ai-generated-author-revised` when it detects that the body has changed outside a skill run (compare `word_count` and a body hash against the last skill-written version in `.history/`), and must never silently downgrade `author-written`.

**The same field, with the same three values, goes on `ch<NN>-prose.md`.** It does different work there: it is what §7.2's reconciliation reads to decide whether the manuscript or canon wins a contradiction. Without it, an unrevised AI draft's drift silently becomes canon. `prose` sets `ai-generated` on write; author-revision detection is identical to the outline case.

---

## 4. The blueprint contract (revised)

### What it is

Everything the prose agent needs in order to render this chapter correctly and stay true to canon — **and nothing about any chapter after it.**

### Sections

1. **Scene Function** — 3–6 words, standard structure terminology.
2. **Story Context** — the primer harvest, **filtered to what bears on this chapter.** Book-level furniture (comparables, word targets, full genre essays) is cut unless it governs this chapter specifically. Tone and voice rules move to the style guide; *this chapter's* tonal modulation stays.
3. **Chapter Shape** *(new — absorbs the outline's Premise, beat index and pacing)* — premise, the numbered beat sequence, structure and pacing, expansion target, opening and closing technique.
4. **Characters** — tiered POV → Major → Supporting → Minor → Referenced, as now, with all recorded frameworks carried and characterized to this chapter.
5. **Setting** — the chapter's opening sensory frame.
6. **Main Source of Conflict** — specific to this chapter.
7. **Symbolism and Thematic Layer** — anchored to the throughline in §2.
8. **Continuity** — backward links, state established here, canon-vs-scene resolutions, and plant instructions (see the imperative rule below).
9. **Worldbuilding** — prominence-tiered, each with its scene trigger.
10. **Dialogue Anchors** *(new — absorbed from the outline)* — the exchanges that must land, at beat level.
11. **Chapter-Specific Craft** *(new, replaces general craft)* — only placements unique to this chapter. Everything general is in the style guide.
12. **Other Notes** — what this chapter must not do, unresolved-at-last-line, tonal target, POV reminders.

### THE BACKWARD-ONLY RULE

> **A Blueprint's knowledge horizon is its own chapter. It may look backward without limit and forward not at all.**
>
> It may state anything true as of the end of chapter N. It may not name, describe, hint at, or explain any event, reveal, state change, character, or object condition belonging to chapter N+1 or later.

This is the rule most likely to be got wrong, because **planting is inherently forward-facing.** The resolution:

> **State the requirement imperatively. Never state the reason.**
>
> - ✅ "The jacket is thrown at the edge of the grave, shallow, under loose dirt. The edge and the shallowness are both load-bearing and must not soften into *buried*."
> - ❌ "The jacket is surface-tossed at the edge so Muppy can recover it in chapter 3 — a jacket in the grave could not be reached without exhuming the body."
>
> - ✅ "The matchbook must **be** the object it is from the moment it is dropped, branding included, though she cannot read it and the prose must not read it for her."
> - ❌ "The matchbook is from the Wagon Wheel, planted unspent against Q-020, which may give it a second life as real evidence."

The prose agent gets a precise instruction and no future. "Load-bearing" and "must not soften" carry all the weight the rationale used to.

**Corollaries the skill must enforce:**

- **Personality frameworks:** carry every recorded framework, but strip plot instances from the integration/disintegration arrows. Keep the behavioural signature ("under stress he corkscrews into paranoia"); cut the trigger ("once the site turns out to have been watched"). Then name which direction, if any, fires in *this* chapter — and say plainly when neither does.
- **Revelation Logs:** the `chapter ≤ N` filter already exists. Extend it — when an entry's *text* references a later chapter, carry the state and drop the reference.
- **Reveal Architecture:** the primer's §2 may be consulted to know *what this chapter must plant*, but nothing about where a reveal lands may reach the file. Convert every entry to an imperative plant instruction or drop it.
- **Cast:** a character who does not appear and is not thought about in this chapter is not named, even inside a verbatim canon quote. Genericize the quote.
- **Worldbuilding entries:** carry the element's current state and governing logic; cut the chain-of-custody narrative that runs past this chapter.
- **Open questions:** carry as frontmatter ID pointers only (`open_questions_touching_this_chapter: [Q-011, Q-015]`). Marker *prose* goes in the blueprint body only when the question creates a gap the prose agent must actively write around. Otherwise `questions.md` is the register.

### What the Blueprint no longer carries

- **General craft.** Sensory rules, POV permissions, typography, tense, vision specs, voice laws — all style guide. The blueprint carries only what is unique to this chapter, e.g. *these four terms attach to these referents in this order in this scene.*
- **Book-level primer furniture.** Comparables, target length, the full genre essay, the whole cast web. Keep what bears on this chapter's cast and this chapter's theme.
- **Forward chains.** Per the rule above.

### Reference-run effect

Chapter 1 of *The Good Dog*: Blueprint went **10,684 → 8,523 words** while *gaining* the outline's scaffolding — because it shed 1,754 words of general craft and roughly 1,900 words of forward-looking material. Outline went **3,405 → 1,327**.

---

## 5. Authorship preservation

The outline is where human authorship lives, and the skill must be adaptable to how much of it there is. Three modes.

### `ai-generated` — full generation

Current behaviour. Generate against the spine, the treatment and canon. Regenerate freely.

### `author-written` / `ai-generated-author-revised` — correction-only

**The skill may not regenerate. It may only correct.** Concretely:

**May change:**
1. **Factual contradictions with canon** — a decision, bio, or worldbuilding entry says otherwise. Prefer the smallest possible edit: a word or phrase swap, not a rewritten sentence.
2. **POV-capability breaches** — the narration asserts knowledge or perception the POV character cannot have. This is content, not style.
3. **Stale frontmatter and scaffolding** — version stamps, superseded editorial notes, resolved markers.
4. **Sequencing errors** where canon fixes an order the text gets wrong. This is the largest edit permitted and it must be surfaced explicitly before it is made.

**May not change:**
- Sentence rhythm, diction, or register.
- Prose-stage rendering choices — verbs of perception, grammatical mood, idiom, verdict words, dialogue phrasing. **Those belong to the prose agent working from the style guide. Fixing them in an outline is regenerating it.**
- Anything the author has explicitly ruled on, even where canon disagrees. Log the disagreement instead.

**Workflow, mandatory:**
1. Audit the outline against current canon in substantive mode.
2. **Triage into buckets** — canon contradictions, POV breaches, prose-stage items (declined), additive gaps, canon-internal conflicts — and present the full triage to the author before editing anything, with the smallest-possible fix quoted for each item.
3. Apply only what is approved.
4. Snapshot the prior version to `chapters/chapter-NN/.history/`.
5. Report what was declined and why, not just what was changed.

**When canon disagrees with itself:** surface it, apply the more recent and more specific entry, mark it reversible, and say plainly in the report that a choice was made. Do not block the pass on a single unresolved word.

### Style inheritance — mixed-authorship projects

A project will commonly have some chapters the author outlined by hand and later chapters generated. **The generated ones must borrow the house style from the author-written ones**, or the outline set becomes a patchwork and the seams show.

**Rule:** before generating any outline in `ai-generated` mode, `outline-chapters` reads the **2–3 most recent outlines whose `authorship` is `author-written` or `ai-generated-author-revised`**, preferring chapters near the target, and matches their style. `ai-generated-author-revised` files count as full-strength samples — arguably the best ones, since they show what the author corrected *toward*.

**What to match, concretely** — these are the dimensions that actually vary, and the reference project demonstrates every one of them:

- **Density** — words of outline per 1,000 words of target chapter.
- **Tense and person.** The reference outlines run **present tense, third person** ("Muppy escapes," "she wants nothing to do with him"). An AI outline defaulting to past tense clashes on the first sentence.
- **Dialogue treatment** — quoted in full, summarized indirectly, or mixed. The reference is mostly indirect with occasional direct lines; some authors specify nearly every line.
- **Interiority depth** — how much inner state the outline fixes versus leaves to the prose stage.
- **Narration versus direction** — does the author write events ("she picks up the matchbook") or bracketed instructions to the drafter ("[register the weight here]")? The reference narrates.
- **Paragraph granularity** — one paragraph per beat, or long flowing movements.
- **Voice leakage** — whether the outline already carries the book's POV voice or stays neutral. The reference is **partly voiced** ("naming correctly the things her nose splits that a human reads as single").
- **Authorial asides** — direct address, rhetorical questions, evaluative commentary. The reference permits them ("And did she mention that this dog has incredibly bad breath?").

**Do not build a derived style file.** A short `outline-style.md` describing observed conventions is tempting and wrong for the same reason the outline's scaffolding was wrong: it is a lossy copy of a ground truth that already exists, and it goes stale silently. **Read the samples directly, every run.** Re-derived style cannot drift from its source.

**Match form, never inherit canon errors.** Outlines are exempt from prose craft rules — an authorial aside or a verdict word is fine in an outline and would be a violation in prose, so the style match may reproduce those freely. It may **not** reproduce factual canon errors it finds in a sample. If a prior outline breed-reads a dog and the canon forbids it, that is a defect awaiting a correction pass, not house style.

**Cold start.** With no author-written sample, generate to the default and **flag the file as style-setting** in the report — the first AI outline in a project silently becomes the pattern every later one inherits, so the author should review it as a template rather than as one chapter.

**One consequence worth knowing.** Where outlines are partly voiced, a style-matched outline carries author voice into the prose agent's context as a second conditioning input after the style guide. That makes outline style fidelity load-bearing rather than cosmetic, and it is an additional argument for reading real samples rather than a description of them.

---

## 6. Setup and payoff chains

### Ownership

**Chains are a planning responsibility, not a drafting one.** The prose agent must never know it is planting or paying anything — an agent that knows it is planting will telegraph. This is the imperative-without-rationale rule from §4 applied one layer up: planning owns the chain, the Blueprint launders it into an imperative, prose sees only the instruction.

Concretely: the chain register is read by `pre-outline-session`, `brainstorm-session` and `outline-chapters`. It is **never** passed to `prose`.

### Two tiers, and conflating them is what makes ledgers rot

Dense setup/payoff webs are worth having — but most of that density in well-woven stories is a **revision artifact, not a planning artifact.** The famous throwaway details that pay off later are generally *found*, not foreseen: a writer notices a fact already committed on the page and reaches for it when a later scene needs one. Trying to pre-plan that class of chain is what produces the four-hundred-row ledger nobody maintains.

So there are two artifacts with two different shapes.

**Tier 1 — the load-bearing chains. Planned. Few. Already have a home.**

These are chains where the payoff *breaks* if the setup is missing. Five to fifteen in a novel. **They live in the primer's §2 Reveal Architecture, which already exists** — do not create `outline/chains.md`, which would reintroduce the dual-source-of-truth problem this whole spec removes.

§2 needs **one added field per entry: the plant chapter.** It currently records what is concealed and where it lands; adding where it plants turns it into the chain index at no cost and with no new file.

**Admission criteria — all three required.** These are what actually prevent accumulation:

1. **Load-bearing.** The payoff fails without the setup. Not "would be nice."
2. **Long-range.** Spans more than about two chapters.
3. **Not self-evident.** Would not be caught by reading adjacent chapters.

A chain failing any test is not registered. Worked example from the reference project: the cheatgrass awn plants in ch 1 and pays in ch 2, both visible in adjacent Blueprints — it fails criterion 2 and gets no row. The jacket plants in ch 1 and pays in ch 3 and the payoff is impossible without the exact plant — it qualifies.

**Chains close.** A chain that has been planted *and* paid is struck from the register, not archived in place. This is the piece most ledgers omit and it is why they grow monotonically. The register's entire value is that glancing at it shows what the book currently owes; at eight open rows that works, at two hundred it is furniture. **An unpaid chain at end of draft is a bug report, not a row.**

**Tier 2 — the harvest. Not planned. Derived after prose exists.**

A searchable record of the concrete particulars each finished chapter has committed: named objects, throwaway facts, minor characters, specific places and details. **Nouns, not themes.** When a later chapter needs a payoff, the author searches what is already on the page instead of inventing something new — which is how the density actually gets built.

**This is what the unbuilt `notes` stage is for.** The pipeline is already documented as `outline → blueprint → prose → notes` and no skill implements the last step. The harvest gives it a job: run after prose, extract the chapter's concrete particulars, append to the index.

### The principle that keeps this safe

> **Derived artifacts can be large. Maintained artifacts must be small.**

The harvest index is generated automatically and never curated, so it can run to hundreds of entries without rotting — nobody is responsible for it. The §2 register is maintained by hand, so it must stay short enough to read on one screen. Every ledger failure is a maintained artifact that was allowed to grow like a derived one.

### What the cross-chapter check becomes

`outline-chapters` batch mode currently runs a setup/payoff balance check against the outline's Setups section, which no longer exists. Replace it with a check against primer §2:

- Every registered chain's **plant chapter** and **payoff chapter** both exist in the spine.
- Where both chapters are outlined, the plant is actually present in the plant chapter's outline.
- **Orphans surface as report items, not as blocking errors** — an unplanted chain mid-draft is normal; an unplanted chain whose plant chapter is already written is not.

`blueprint` keeps its existing job of rendering the chain as an imperative plant instruction in Continuity, sourced from §2 and stripped of its rationale per §4.

---

## 7. The backflow — `notes` and `canon-sync`

Every other stage runs downhill: treatment feeds structure, structure feeds outline, outline and canon feed blueprint, blueprint feeds prose. **Nothing returns.** Which means canon begins going stale relative to the manuscript the moment prose exists, and by chapter fifteen the bios describe a book that has quietly diverged from the one on the page. These two skills are the return path. They are one mechanism in two stages: `notes` extracts per chapter, `canon-sync` integrates per span.

### 7.1 `notes` — per chapter

**Four things become true when prose exists**, and capturing them is the whole job:

1. **Intent becomes fact.** The outline said what should happen; the prose says what did. Nothing currently records the gap, and it is the highest-value item for the author's review.
2. **Canon gets created by accident.** The prose had to name a colour, describe a floor, give a walk-on a gesture. That is canon now because it is on the page, and it exists in no canon file. This is the largest continuity hazard in AI-assisted drafting, because the divergence is invisible until a later chapter contradicts it.
3. **The chapter's concrete particulars become searchable** — §6's Tier 2.
4. **End-state becomes statable** — what the next chapter inherits: wardrobe, injuries, objects carried, location, emotional residue, the hour.

**Writes `chapters/chapter-NN/ch<NN>-notes.md`:**

- **As-written synopsis** — what is on the page, distinct from the outline's intent.
- **Divergences from the outline**, each flagged deliberate or drift.
- **The harvest** — concrete particulars the chapter committed. Nouns, not themes.
- **Accidental canon** — details invented in the prose that no canon file holds.
- **End-state block** — structured, for the next chapter to inherit.

**Proposes, never writes:** Revelation Log lines, promotions of accidental canon into a bio or worldbuilding entry, manifest additions, and Tier 1 chain closures. Same contract as `blueprint` — canon is the author's, and the skill appends only on approval. **This is also how chains close**; without it, closure is manual and will not happen.

**The end-state block pays for the skill on its own.** `blueprint` currently reconstructs carried-forward state by full-reading the entire prior POV-matched prose chapter. With an explicit end-state block it reads a short structured section instead of 3,500 words of fiction, and gets a more reliable answer.

**No central harvest file.** The harvest lives inside each chapter's notes; searching it is a glob across `chapters/*/ch*-notes.md`, the same move `outline/_index.md` makes for the horizontal view. This keeps the harvest a derived artifact nobody maintains, per §6.

**Gate on prose status, not on prose existing.** Notes taken from a first draft describe a chapter about to be rewritten, and every revision pass would invalidate them. Run at `revised` or `approved`, not `drafted`. If it runs early, stamp that so a re-run is known to be owed. A batch mode is required for projects adopting this mid-stream.

**Synopsis ownership, settled:** `prose` keeps writing its frontmatter synopsis (cheap, always available, describes intent). `notes` writes the as-written synopsis. **Downstream consumers prefer the notes version when it exists and fall back to the frontmatter one when it does not.**

**The boundary, and the name invites violating it:** `notes` **records what the prose committed; it does not evaluate the prose.** Craft critique, pacing judgments, "this scene is flat" — different job, different skill. The moment notes has opinions it stops being a reliable extraction layer, because its factual claims can no longer be trusted not to be arguments.

### 7.2 `canon-sync` — per span

**Without this, `notes` is a queue with no consumer.** Notes proposes and writes nothing to canon; if nothing integrates the proposals they accumulate as a growing pile of shoulds, which is precisely the ledger failure §6 exists to prevent. Reconciliation is what makes running notes worth anything.

**Direction matters.** `treatment-update` already reconciles downhill — canon into the treatment. `canon-sync` runs uphill — prose facts into canon. The two are sequential, not alternatives:

> `notes` (per chapter) → `canon-sync` (per span) → `manifest-sync` (reindex) → `treatment-update` (canon → primer and treatment)

**Five categories accumulate, and they need different handling:**

| Category | What it is | Default handling |
|---|---|---|
| **Accretion** | Prose committed details canon does not have | Absorb |
| **Contradiction** | Prose says something canon denies | Adjudicate — see below |
| **Drift** | No single wrong line, but the character as written has diverged from the character as specified | Surface; author rules |
| **Promotion** | A minor element has grown into a real presence and needs an entry | Recommend |
| **Obsolescence** | Canon the manuscript quietly abandoned | Flag for removal |

**Drift is why this is a span pass rather than continuous integration.** A bio says a character never explains himself; by chapter 9 he has explained himself twice a chapter. No individual line is wrong. Only the aggregate is, and the aggregate is invisible at chapter scale.

**Triggers — event-driven, not calendar-driven.** The mandatory one: **`canon-sync` is a precondition of blueprinting a new act.** That is exactly when staleness does damage, and making it a gate means it cannot be forgotten. Secondary: before any `treatment-update` (or the treatment regenerates from stale canon), at act boundaries, and when the unintegrated proposal queue crosses a threshold.

**The adjudication rule, and it must be authorship-sensitive.** The instinct is "the manuscript wins." But if the manuscript always wins, an unrevised prose agent's drift becomes canon and model error is laundered into the story bible. So:

- **Author-written or author-revised prose → the manuscript wins by default.** The author made a choice on the page; canon follows.
- **Unrevised AI prose → canon wins by default.** The model deviated. That is a defect, not a decision.

This is what the prose `authorship` field in §3 exists for. Defaults are defaults; every contradiction is still surfaced, and the author can rule either way.

**Two outputs, not one.** Reconciliation produces **canon edits** *and* **a manuscript fix list**. If canon wins a contradiction in chapter 7, chapter 7's prose is now wrong and must be fixed. If the manuscript wins, canon changes and every Blueprint built against the prior version is stale — the version stamps make that detectable, so the run reports which Blueprints need rebuilding. A pass that edits only canon leaves the book inconsistent with its own bible in the other direction.

**It reads notes, not prose.** If `notes` did its job the divergences and accidental canon are already extracted, so a ten-chapter span reads ten notes files rather than 35,000 words of fiction, dropping into the prose only to adjudicate a specific disputed point. That is cheap enough to run often, and it is the concrete payoff for having built `notes`.

**Every adjudication is logged as a decision** via `decision-capture`. Otherwise the next pass re-litigates the same conflict and the whole thing becomes Sisyphean. A ruling that is not recorded is not a ruling.

**Snapshot everything it touches, first.** This is the only skill that edits many canon files in one run, which makes it the only one whose bad run is expensive. Snapshot the full canon set to `.storystormer/history/<date>-canon-sync/` before applying anything.

**The boundary, same species as §7.1:** `canon-sync` **reconciles facts; it does not improve canon.** Rewriting a thin bio, deepening a worldbuilding entry, tightening the primer — those are `character-bio`, `worldbuilding-entry` and `treatment-update`. If it starts making canon *better* rather than *accurate*, the author loses the ability to run it without reviewing everything it touched.

---

## 8. Concrete changes by file

### `skills/outline-chapters/SKILL.md`
- Rewrite § *What you produce* and § *Generate each chapter outline*: the outline is frontmatter plus prose body. Remove the nine-section schema.
- Add § *Authorship modes* implementing §5 above, with correction-only as a first-class mode rather than a variant of revision mode.
- **Rewrite the cross-chapter setup/payoff balance check per §6** — it now reads the primer's §2 Reveal Architecture rather than the outline's removed Setups section.
- **Add style inheritance per §5** — read 2–3 recent author-written or author-revised outlines as style samples before generating in `ai-generated` mode; never build a derived style file.
- Density guidance changes from "≈2× treatment density" to **"whatever the author writes; 500–1,500 words per 3,000-word chapter is typical."** Never pad an author-written outline to hit a target.

### `skills/blueprint/SKILL.md` and `references/blueprint-spec.md`
- Add the **backward-only rule** as a top-level Core Principle, above Prominence-Sets-Resolution. Include the imperative-without-rationale formulation and the ✅/❌ pairs verbatim — they are the operative test.
- Add the three new sections (Chapter Shape, Dialogue Anchors, Chapter-Specific Craft) to the required list; renumber.
- Add a **style-guide dependency**: if `voice/style-guide.md` exists, the Blueprint carries no general craft. If it does not, the Blueprint must transcribe the project's craft rules and **the skill must warn the author that this is a per-chapter workaround.**
- Add to the quality checklist: *no section names a chapter after this one; no framework arrow carries a future trigger; no worldbuilding entry carries chain-of-custody past this chapter; every plant is stated imperatively without its rationale.*
- The Blueprint reads the outline for **content**, not for scaffolding. Update the seed description.

### `skills/prose/SKILL.md` and `references/prose-spec.md`
- Context assembly order becomes: `voice/writing-sample.md` → `voice/style-guide.md` → prior chapter synopses → **Blueprint** → **outline** → prior POV-matched prose.
- The outline is now unambiguously *the task*: "expand this into full narrative prose." The Blueprint is *the constraint set*. Say so in the behavioural frame.
- **Add a hard instruction:** where the outline contains dialogue, treat it as the author's and preserve it in substance. Where it contains specific action beats, do not reorder them.
- Drop the fallback branch that reads raw bios and the primer when no Blueprint exists — or keep it, but warn loudly, because under this model a missing Blueprint means no canon at all.
- **Write `authorship: ai-generated` into `ch<NN>-prose.md` frontmatter**, and detect author revision the same way `outline-chapters` does. §7.2's adjudication rule depends on this field existing.
- **Prior-chapter backward context prefers `ch<NN>-notes.md`'s as-written synopsis**, falling back to the `ch<NN>-prose.md` frontmatter synopsis when no notes file exists.
- Keep writing the frontmatter synopsis. It is cheap, always available, and describes intent; the notes version describes the page.

### `references/file-schemas.md`
- Replace the `ch<NN>-outline.md` schema per §3.
- Replace the `ch<NN>-blueprint.md` section list per §4.
- Add `voice/` to the canonical folder layout: `voice/style-guide.md`, `voice/writing-sample.md`.
- Add the `ch<NN>-notes.md` schema per §7.1, alongside outline / blueprint / prose in the chapter folder.
- Add `authorship` to the `ch<NN>-prose.md` frontmatter schema.

### New: `skills/notes/SKILL.md`
Per §7.1. Single-chapter and batch modes. Gates on prose `status`. Writes `ch<NN>-notes.md`; proposes canon changes and appends none without approval. Reads the chapter's prose, its outline (to diff intent against page) and its Blueprint (to check what was to be planted) — roughly 12,000 words of input for a compact structured output, so it should run as a subagent returning a short report. Enforce the boundary rule: records, does not evaluate.

### New: `skills/canon-sync/SKILL.md`
Per §7.2. Span mode over a chapter range. Reads notes, not prose, dropping into prose only to adjudicate. Snapshots the full canon set before applying anything. Produces canon edits **and** a manuscript fix list, plus a list of Blueprints invalidated by the canon changes. Logs every adjudication through `decision-capture`. Enforce the boundary rule: reconciles facts, does not improve canon.

### `skills/blueprint/SKILL.md` — second change
- **Add a `canon-sync` precondition for batch mode.** Blueprinting a new act should check whether reconciliation is owed for the prior act and say so before proceeding.
- **Prefer the prior chapter's `ch<NN>-notes.md` end-state block** over reconstructing carried-forward state from the full prior POV-matched prose chapter. Fall back to the prose read when no notes file exists.

### New: `voice/` in `storystormer-init`
Scaffold the folder at init with stub files and a short README explaining what each does and that the prose skill reads them in that order. **A project can silently have no voice inputs today and nothing warns about it.**

---

## 9. Migration

Existing projects with schema-form outlines need a one-time pass per chapter:

1. Snapshot the outline to `.history/`.
2. Move Premise, Setting, Scene Beats index, Setups, Payoffs, Character Notes, Dialogue Anchors, Connections into the Blueprint (rebuild it rather than transplanting text — the Blueprint should derive from canon, not from the outline's summary of canon).
3. Move Craft Constraints into `voice/style-guide.md` if general, or into the Blueprint's §11 if chapter-specific.
4. Move Open Threads into `questions.md` if not already there; leave ID pointers in both frontmatters.
5. Reduce the outline to frontmatter plus body; set `authorship`.
6. Run the backward-only scan over the rebuilt Blueprint.

A grep for chapter references (`ch \d`, `chapter \d`, `Act [23]`, `pays off`, `later`, `back half`) over a finished Blueprint catches most firewall violations. It produces false positives on present-tense world facts, so it flags for review rather than failing the build.

---

## 10. Open items for the plugin agent

- **Primer §2 needs its plant-chapter field before §6's check can run.** One-line schema change, but `treatment-update` regenerates the primer, so the field must survive regeneration — it should be sourced from decisions rather than re-inferred each time.
- **Whether Story Context survives at all.** Once a style guide exists and notes-derived synopses are flowing, §4's Story Context shrinks to premise, moral argument, thematic throughline and this chapter's slice of the character web. It may compress to ~200 words. Revisit after two or three chapters of real use.
- **Harvest search at scale.** A glob across 24 chapters is fine. At 100+ chapters, or in series mode, it may want an index — which would be a derived file and therefore safe, but do not build it before it is needed.
- **`notes` naming.** The name invites the everything-bucket failure its own boundary rule forbids. Renaming (`chapter-record`, `extract`) has churn cost against a pipeline already documented as `outline → blueprint → prose → notes`. Left as-is with a tight description; flagged in case the plugin agent prefers to rename now rather than later.
- **Synopsis generation.** Under this model the prose agent gets prior-chapter synopses for backward context. Those are currently written into `ch<NN>-prose.md` frontmatter at prose time. That remains correct and becomes more load-bearing, since the Blueprint can no longer supply cross-chapter continuity in either direction.
- **Whether Story Context survives at all.** Once a style guide exists and prior synopses are flowing, §2's job shrinks to premise, moral argument, thematic throughline and this chapter's slice of the character web. It may compress to ~200 words. Worth revisiting after two or three chapters of real use.
