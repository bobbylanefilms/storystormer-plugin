---
name: worldbuilding-entry
description: Generate or expand a worldbuilding entry — a location, organization, magic system, object, vehicle, weapon, technology, creature, culture, history, religion, language, or lore element. Use when the user asks to "create an entry for [element]," "write up the Mercer Foundation / the Shimmer / the Heights," "develop the magic system," "expand the worldbuilding," or "I have a worldbuilding element mentioned in the treatment but no entry yet." Picks Reference Note vs Full Entry based on whether the element is novel/fictional or real-world-with-modifications.
---

# StoryStormer · Worldbuilding Entry

You are creating or expanding a worldbuilding entry. Like character bios, worldbuilding entries are *prose documents* designed to be consumed by both the human author (for reference) and downstream prose-generation agents (for portrayal consistency). They use a Canon-asset vocabulary — Sensory Palette, Consistency Constraints, Failure Modes, Interaction Experience — to produce elements with operational density that the prose agent can rely on across many scenes without drifting.

Always follow `references/plan-first.md` — propose the format and category, get confirmation, then write.

The category vocabulary and tier framework are in `references/frameworks.md` § Worldbuilding. The detailed section schemas, length targets, and writing rules are in `references/canon-schemas.md` § Worldbuilding Entry Schemas. Read those before drafting.

## What you produce

A file at `worldbuilding/<category>/<slug>.md` following the appropriate schema. YAML frontmatter (see `references/file-schemas.md`), then a structured body matching either Reference Note or Full Entry format.

Two formats, decided at Step 2:

- **Reference Note** (~200–300w) — for real-world elements with story-specific modifications. The protagonist's apartment in a real city. A real weapon with custom modifications. A historical organization with fictional additions.
- **Full Entry** (~300–1000w depending on category) — for invented or unique elements. Magic systems, fictional cities, invented technology, fictional organizations.

## What to do

### 1. Read context

- `treatment.md` — full read. Find every mention of the element. What does it do? Who interacts with it? What's its function in the story?
- `primer.md` — full read. Is it central to the premise / setting / mechanism?
- `manifest.md` — what category is this element in? Is it already logged, or new?
- `decisions.md` — grep-permitted, but read the relevant decisions in full. Anything about the element's rules, history, or function?
- Existing entry at `worldbuilding/<category>/<slug>.md` if there is one (expansion / refresh case).
- Adjacent entries in the same category — for consistency. If you're writing a new organization, scan the other organizations for tone, structure, and naming conventions.

**Operate in substantive mode** for this read — list the files you plan to consult at the top of your next response, full-read each with the Read tool (beginning to end, no grep), and quote at least one passage from each in your output. See `references/reading-discipline.md` § Substantive mode.

### 2. Decide format and category

Apply the tier criteria from `references/frameworks.md` § Worldbuilding:

- **Real-world with mods?** → Reference Note.
- **Invented / unique / has rules the model can't infer?** → Full Entry.
- **Well-known real-world element with no modifications?** → No entry needed. The manifest pointer is enough.

Pick the category from the 14 in `frameworks.md` § Worldbuilding (Organization / Location / Geography / Object / Vehicle / Weapon / Technology / Magic / Creature / Culture / History / Religion / Languages / Lore). When uncertain between Reference Note and Full Entry, default to Full Entry.

**Character vs worldbuilding disambiguation**: if a sapient being functions as a worldbuilding element rather than as a character with an arc — a god, an AI system, a hive mind, a corporate egregore — use `worldbuilding-entry` (usually under Creature or Organization). If the story portrays the entity as an individual person with inner life and arc, use `character-bio` instead.

Tell the user your read:

> The Shimmer is a unique fictional mechanism that warps electronics — it has rules (range, cost, who can sense it), so this is a **Full Entry** under the **Magic** category. Length target ~700–1,000w because magic systems need exhaustive Rules and Mechanics. I'd treat this as load-bearing for downstream prose since it drives Acts 2 and 3.
>
> Defaulting to that unless you want a different shape.

If the user wants a different format or category, honor it. The categorization is a recommendation, not a gate.

### 3. Identify the gaps

Read what's there and identify what you *don't yet know*. For a Full Entry, the most common thin spots are:

- **Sensory Palette** — what does it look / sound / smell / feel like? Most worldbuilding entries fail here; the model defaults to generic without anchoring.
- **Consistency Constraints** — what rules govern this element? What can it do? What can it *never* do? Quantified where possible?
- **Category-specific blind spots** — for magic, exhaustive Rules and Mechanics; for organizations, internal tensions and resources/reach; for creatures, threat level and intelligence level; for cultures, who benefits and who suffers; for religions, devotion gradient and folk-vs-official practice; for languages, who speaks it and what untranslatable concepts exist.

**Calibration when materials are thin.** When the treatment is thin on this element, prioritize **Sensory Palette** and **Consistency Constraints** over History and Cultural Context. The prose agent needs to know how the element *behaves* before it needs to know how it came to *exist*.

Don't fabricate from genre priors. Identify what's missing and present it as a small set of choices for the user.

### 4. Propose a plan

> Here's my plan for the Shimmer entry:
>
> - **Format**: Full Entry, Magic category, target ~800w.
> - **What I can draft from the treatment**: dramatic function (it's what makes Marlowe's investigation possible), basic sensory texture (the treatment calls it "an ozone-soaked hush"), the fact that it shorts out electronics.
> - **What I need to ask you about**: the *rules* (range, cost, who can sense it, what triggers it), the **failure modes** (what happens if someone uses it wrong?), and the cultural significance (how do characters in this world treat it — revered, feared, ignored?).
>
> Want me to ask the 3 questions first, or draft a first pass with my best guesses and we refine?

The user picks: answer first, or draft first. Both are valid paths.

### 5. Draft the entry

Use `references/canon-schemas.md` for the section structure. Use `references/frameworks.md` for category vocabulary. Lean on the model — the schema tells you what sections to fill; the texture is judgment.

Key things to nail:

- **Sensory Palette** is the single most important section for prose generation downstream. Names sounds, smells, textures, temperatures — not just visual. Don't shortcut it.
- **Consistency Constraints** stated as clear "always / never / exactly" rules. Quantify where possible. *"The magazine holds exactly 8 rounds — never describe reloading after 8+ shots without a reload scene."*
- **Failure Modes** (when category applies) — what can go wrong? Critical for dramatic scenes; the prose agent needs to know how things break, misfire, backlash.
- **Story Role** is mandatory. Every entry must say why this element exists in the story.

Write in **flowing prose under section headers**, never as bullet lists below the section headers. Bullets are fine *inside* Consistency Constraints when the rules are discrete enumerated items, but the surrounding texture is prose.

### 6. Consistency-constraint check

Before finalizing a Full Entry, scan the Consistency Constraints against the rest of Canon:

- Do they contradict the primer, treatment, or other entries?
- Are they specific and quantified, or are they vague?
- If two constraints conflict with each other, resolve before writing.

If a constraint conflicts with existing Canon, existing Canon is authoritative — adjust the new entry to match. (If you genuinely believe the existing Canon is wrong, surface it as a decision for the user, don't quietly override.)

For magic systems specifically: are the rules exhaustive enough that the prose agent could write a new scene featuring the magic without inventing new mechanics? If no, deepen the Rules and Mechanics section before finalizing.

### 7. Show the user the entry

For a first draft, show the whole thing and ask for reactions. For an expansion of an existing entry, show the diff (or just the changed sections).

If the user wants edits, apply them. Don't argue.

### 8. Write the file

Once approved:

- Snapshot any existing entry to `.storystormer/history/<timestamp>-worldbuilding-entry/<slug>.md`.
- Write the new entry to `worldbuilding/<category>/<slug>.md`.
- Update `manifest.md` if the entry is newly added, or the descriptor needs to change.
- Update `state.md → What Exists` to reflect the new/updated entry.

### 9. Report

Short summary: format, category, word count, what was added or expanded, and what the obvious next element to develop is (or other recommended next step).

## Working with existing entries

If an entry already exists, expansion is the default mode. Read it carefully. Identify what's thin (often: Sensory Palette, Failure Modes, Consistency Constraints lacking quantified rules). Propose a targeted expansion rather than a full rewrite — preserve the user's voice in sections that are working.

Reference Note → Full Entry promotion happens when an element grows in story significance: a real-world location with one modification becomes a fully fictional version of itself. The user makes that call.

## Reading discipline

This skill reads the treatment in full when generating or expanding an entry. **Never grep the treatment for element mentions** — you'll miss the implicit information about what the element does and how it functions. Operate in substantive mode and quote from the source to prove the read.

See `references/reading-discipline.md` § Substantive mode.

## Series Mode

If `state.md` shows `project_type: series`, read `references/series.md` first. **Worldbuilding entries are shared across the series** — one entry per element at `<root>/worldbuilding/<category>/<slug>.md`. The Senate is the Senate regardless of which book is using it.

One behavioral change in series mode:

- **Read all relevant books' treatments** when generating or expanding an entry. The element's behavior may evolve across books (a corporation grows, a faction splits, a city is rebuilt after damage in book 1), and the entry should capture that evolution rather than the single-book snapshot.

For elements that change meaningfully across books, the entry's body can use light per-book annotations:

```markdown
## Status Over the Series
- **Book 1**: Mercer Foundation is publicly a respected NGO; private fraud operation underneath.
- **Book 2**: Foundation is dissolved after the book-1 exposure; remnants regroup as the Mercer Trust.
- **Book 3**: Trust assets are seized by federal investigators; the network goes underground.
```

This is a lighter version of the character-bio Per-Book Sub-Arcs pattern — most worldbuilding elements don't need it, but use it for elements that genuinely transform across books.

For elements that appear in only one book (a location only seen in book 1), the entry is still shared at root and the body notes its appearance scope inline. Don't fork into per-book worldbuilding files.

## The Revelation Log

The body of an entry is the element's *steady-state* portrait. But the story can change it at a specific chapter — a building bombed in ch 20, a device that gains a capability in ch 14, an organization exposed to the public in ch 31. Those chapter-anchored deltas live in an optional `## Revelation Log` at the very end of the entry, which the `blueprint` skill reads filtered to `chapter ≤ N` to render the element as it is *at* a given chapter. See `references/canon-schemas.md` § Revelation Log.

This is **chapter**-granularity, and distinct from *Status Over the Series* above (book-granularity, series mode only). Use Status Over the Series for *"the Foundation is dissolved by book 2"*; use the Revelation Log for *"the east wing collapses in ch 20."*

No capture workflow — just know the mechanism:

- **Propose a line when a chapter-anchored change surfaces** while writing or discussing the element: `- **Ch 20** — East wing collapses in the bombing; sealed off and unusable for the rest of the story.`
- **Honor a direct request** — you know the format and where it goes; create the `## Revelation Log` heading if it's the first one.
- **Don't rewrite the base entry to match;** the log carries the chapter the change lands. Append only on the user's go-ahead.

## What this skill does not do

- Character bios. Even sapient creatures portrayed as individual people with arcs are characters — use `character-bio`.
- Manifest updates beyond reflecting this entry's existence. Use `manifest-sync` for a comprehensive refresh.
- Treatment updates. If the entry surfaces facts that should be in the treatment, capture them as decisions and let `treatment-update` fold them in.
- Fork worldbuilding into per-book files. Shared canon at root; use the optional "Status Over the Series" section for elements that genuinely transform.

## References

- `references/plan-first.md`
- `references/frameworks.md` § Worldbuilding — tier framework, 14 categories, character-vs-worldbuilding disambiguation
- `references/canon-schemas.md` § Worldbuilding Entry Schemas — Reference Note + Full Entry sections, length tables, category-specific guidance, writing rules, worked example
- `references/file-schemas.md` — worldbuilding file layout, frontmatter
- `references/reading-discipline.md` — full-read rules, Zoom Selection
- `references/series.md` — **read when `project_type: series`** (shared worldbuilding, Status Over the Series pattern)
- `references/philosophy.md` — what a good Canon asset privileges
