<!-- ABOUTME: The craft spec for a chapter Blueprint — the pre-prose continuity brief -->
<!-- ABOUTME: Backward-only rule, synthesis-over-quotation, character tiering, frameworks, worldbuilding, the 12 required sections, quality checklist -->

# Blueprint Spec

A **Blueprint** is a single, self-contained document handed to a prose-writing agent before it writes a chapter. It answers one question: ***what must I not get wrong?*** Everything the prose agent needs in order to render this chapter correctly and stay true to canon, **and nothing about any chapter after it.**

It sits beside three other artifacts, split by who reads them. `voice/style-guide.md` answers *how do I write this book?* (whole novel, stable). The chapter outline answers *what happens?* (the author's prose account, the only artifact carrying the author's voice). The Blueprint answers *what must I not get wrong?* (one chapter, derived from canon, backward-looking only). The prose agent reads all three. **If a line in the Blueprint tells the prose agent what happens, it is in the wrong file. If it tells the prose agent how to write in general, it is in the wrong file.**

At prose time the Blueprint **replaces the raw Canon layer entirely**: bios, worldbuilding entries, and the primer are omitted from the prose agent's context when a Blueprint exists. Whatever the Blueprint drops, the prose agent never sees. That makes it a **fidelity-preserving consolidation, not a summary, and not a second outline.** It routinely stands in for 20–30k tokens of scattered canon; a finished Blueprint of roughly 4,000–8,000 words is money well spent for a heavy chapter, and a simple chapter lands shorter. Do not compress for its own sake, and do not pad.

The `blueprint` skill operates the workflow (when to run, how to gather, propose/confirm/write). This file specifies the **content shape**. For the file layout (frontmatter, scene-split form, history) see `references/file-schemas.md` § Blueprint.

---

## Core Principles

### The Backward-Only Rule

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

The prose agent gets a precise instruction and no future. *Load-bearing* and *must not soften* carry all the weight the rationale used to. An agent that knows it is planting will telegraph; an agent that has been told exactly what to render will render it.

**Corollaries to enforce:**

- **Personality frameworks.** Carry every recorded framework, but strip plot instances from the integration and disintegration arrows. Keep the behavioural signature (*under stress he corkscrews into paranoia*); cut the trigger (*once the site turns out to have been watched*). Then name which direction, if any, fires in *this* chapter, and say plainly when neither does.
- **Revelation Logs.** The `chapter ≤ N` filter already exists. When an entry's *text* references a later chapter, carry the state and drop the reference.
- **Reveal Architecture.** Consult primer §2 to know *what this chapter must plant*; nothing about where a reveal lands may reach the file. Convert every entry to an imperative plant instruction or drop it.
- **Cast.** A character who does not appear and is not thought about in this chapter is not named, even inside canon wording you are carrying. Genericize it.
- **Worldbuilding.** Carry the element's current state and governing logic; cut any chain-of-custody narrative that runs past this chapter.
- **Open questions.** Carry as frontmatter ID pointers only (`open_questions_touching_this_chapter: [Q-011, Q-015]`). Marker prose goes in the body only when the question creates a gap the prose agent must actively write around. Otherwise `questions.md` is the register.

A grep over a finished Blueprint for `ch \d`, `chapter \d`, `Act [23]`, `pays off`, `later`, `back half` catches most violations. It false-positives on present-tense world facts, so it flags for review rather than failing the build.

### The Blueprint Is the Sole Carrier

At prose time the Blueprint is the *only* channel through which canon reaches the prose agent. **A detail you omit is a detail the prose agent invents or gets wrong.** When unsure whether something will surface, carry it: worldbuilding texture, psychological depth, and this chapter's slice of the story frame all raise the quality ceiling even when they never appear verbatim. Inclusion is generous; what you tier is *resolution*, not presence.

### Prominence Sets Resolution

For every element, ask *how prominent is this in THIS chapter?*

- **Foreground**: the action touches it, characters interact with it, the chapter happens inside it. Preserve most of its canon detail.
- **Background**: present, seen, or passed through, but not focal. Summarize to the impression the prose needs.
- **Dormant**: genuinely untouched. Omit.

For large multi-scenario entries, distill to the slice this chapter uses (the spells cast rather than the grimoire, the room rather than the house), **but always preserve the entry's governing logic**, whatever the tier.

### Carry the Canon's Specificity, Not Its Citations

The Blueprint is **one document written in its own voice**: a director's brief, synthesized for this chapter. It is not a dossier of quotations.

Canon entries were written to give the prose rich, specific detail, and paraphrase launders that specificity: *a ruined left shoulder he protects without discussing* must not become *an old shoulder injury*. But quotation marks do not protect specificity; wording does. So:

- **Where a canon phrase is sharper than any paraphrase, use the phrase, unquoted**, absorbed into the brief's own sentences. The prose agent treats every line as authoritative either way, and the author has the canon files for provenance.
- **Never downgrade a specific into a generic.** Distill by dropping what the chapter doesn't use, never by blurring what it does.
- **No blockquotes, no inline quotation marks around canon, no source attributions** (*per `vinnie.md`*) in the body. The one place provenance belongs is the Continuity section's canon-vs-scene resolutions, where the prose agent needs to know a choice was made.
- **Specifications stay as lists.** A POV character's complete word inventory, a forbidden-lexicon bar, the four venery terms locked to this chapter in their required order: these are not prose and must transfer exactly. A list is the honest shape for them.

The test: read a section aloud. If it sounds like someone reading index cards, rewrite it until it sounds like a brief.

### Integrate Current State

Fuse one clean, scene-current image per element, so the prose agent never reconciles a bio that says one thing against a chapter that says something subtly different. Source order:

1. **The canon entry's Revelation Log, filtered to `chapter ≤ N`** (see `canon-schemas.md` § Revelation Log).
2. **The prior chapter's `ch<NN>-notes.md` end-state block**, when one exists: wardrobe, injuries, objects carried, location, emotional residue, the hour, as the chapter actually left them.
3. **Reconstruction from prior chapters' prose or outlines** where the log and notes are silent.

Then merge bio-level description with scene-specific state into one image. **Clothing, injuries, and accessories follow a hard continuity rule:** established state is preserved *identically*; unestablished state gets specific, concrete choices now, recorded in Continuity as deliberate. Never leave physical state vague; vagueness at Blueprint time becomes inconsistency at prose time. If the bio and the scene-state conflict, resolve in favor of the scene and note it in Continuity.

### Craft Lives in the Style Guide

General craft (sensory rules, POV permissions, typography, tense, vision specs, voice laws) lives once, in `voice/style-guide.md`, for the whole book. The Blueprint carries **only what is unique to this chapter**: *these four terms attach to these referents in this order in this scene.*

**Dependency:** if `voice/style-guide.md` exists, the Blueprint carries no general craft and says so at the top of § Chapter-Specific Craft. If it does not exist, the Blueprint must transcribe the project's craft rules into that section, **and the skill must warn the author that this is a per-chapter workaround** and recommend writing the style guide.

### Tier, Don't Duplicate

When several characters serve one functional role (three kitchen staff receiving a farewell), describe them together in one compact paragraph.

### Substance, Not Padding

Every sentence carries canon detail, scene-current state, this chapter's story frame, or a chapter-specific instruction. Per-tier word counts are **ceilings, not targets**.

---

## Character Tiering

Tier each character **chapter-locally**: POV → Major → Supporting → Minor → Referenced. The story's protagonist is POV in their own chapters and Referenced, or absent, in others. The Blueprint tier is not the manifest bio tier.

### Personality Frameworks

When a bio records **Enneagram** (type, wing, integration/disintegration lines), **MBTI**, or **CliftonStrengths**, the Blueprint carries **all of them** for POV and Major characters, compactly for Supporting, not at all for Minor and Referenced. Then characterize for this chapter: which Enneagram direction fires here (integration, disintegration, or neither, said plainly), which MBTI functions and Clifton themes are live. Per the backward-only rule, arrows carry the behavioural signature and not the plot trigger. **Never invent typology the bio doesn't record**, and say so when a framework is absent so the prose agent doesn't reach for one.

### POV (up to 2,000 words)

- **Current Physical & State**: appearance fused with scene-start state under the continuity rule.
- **Emotional State & Goal**: what they want in this chapter, what shifts, what they avoid.
- **Voice Fingerprint** (chapter-distilled): register, rhythm, the slice of their reference well likely to surface, never-says, the character of the inner voice. Drop dimensions that won't surface.
- **Personality Frameworks**: per above.
- **Scene-Relevant Psychology**: the slice of arc, Lie, Ghost, fear, or drive that shapes this chapter's actions.
- **Interiority**: how the inner voice differs from the outer; what is rationalized outward versus confessed inward; the ceiling of interpretation the narration may not exceed. The most important subsection for close-third chapters.
- **Behavioral Tells**: gestures, tics, patterns, and which of them have a host in this chapter.

Drop biography not activated here, relationships with characters not present and not thought about, hobbies unconnected to the chapter.

### Major (800–1,200 words)

Appearance and current state; external voice pattern (register, cadence, one or two hallmark patterns, never-says, the tell under pressure); full frameworks block characterized to the chapter; emotional state and goal; tells; relationship to the POV as it bears here; what they do in the chapter. No internal monologue.

### Supporting (400–800 words)

Appearance and state; voice register; tells; mood and intent; compact frameworks line; one-sentence relationship to the POV if relevant.

### Minor (up to 200 words)

What they look like, wear, how they move; voice register in a sentence; one tell if the moment needs it. No psychology, frameworks, or backstory.

### Referenced (≤ 40 words)

One framing line: who they are to the POV and what charge their name carries. Only if the POV's interiority or the dialogue reaches them. Characters merely named in passing without weight are omitted.

---

## Worldbuilding Selection

Worldbuilding entries are the story's sources of truth for locations, objects, systems. Carry them at prominence-tiered fidelity:

- **Foreground**: 150–400 words, more if central to the action.
- **Background**: 40–100 words.
- **Atmospheric**: one or two sentences.

For every element: **name the scene trigger** (the moment in the chapter where it appears); distill multi-scenario entries to this chapter's slice while preserving governing logic; fold identity objects into their carrier's physical line rather than giving them their own bullet; apply the Revelation Log (≤ N); carry current state and cut chain-of-custody that runs past this chapter. Note explicitly when a canon entry carries a detail this chapter must *not* use (a superseded line, a wrong plant for the region), so the prose agent doesn't rediscover it.

---

## Required Sections

### Header

Chapter number and title; time of day and narrative date; POV with narrative style; position in the book (what precedes it, or *nothing precedes this chapter*); and a one-line knowledge-horizon statement.

### 1. Scene Function
One line, 3–6 words, standard structure terminology.

### 2. Story Context
The primer harvest, **filtered to what bears on this chapter.** Genre and register as they govern *this* chapter's tone; the premise and central question; the moral argument and thematic throughline, with how this chapter carries them; the slice of the character web among this chapter's cast; this chapter's tonal modulation. Book-level furniture (comparables, word targets, the full genre essay, the whole cast web) is cut unless it governs this chapter specifically. General tone and voice rules belong to the style guide. Expect 300–700 words; once a style guide exists and the cast web is small, this may compress to ~200.

### 3. Chapter Shape
The premise (one or two sentences, resolving against the spine slot). The **numbered beat sequence**: the dramatic spine the outline's prose carries in full, stated here as an index so the prose agent can pace the expansion. The outline remains the content; the beats never restate it. Structure and pacing (movements, the hinge); the **expansion target** relative to the outline's word count; opening and closing technique.

### 4. Characters
Per the tiering model. Entry header `### **Name (Tier)**`; POV uses the subsections in bold italics. A character unnamed in the narration is marked so in the header (*unnamed in narration; he is the big one*).

### 5. Setting
One paragraph, 75–200 words: the chapter's opening sensory frame. Specific space, hour, light, sound, smell, temperature. Deep foreground-location detail lives in Worldbuilding.

### 6. Main Source of Conflict
One paragraph, 100–150 words. The tension specific to *this* chapter, how it escalates or turns, what is at stake by the last line.

### 7. Symbolism and Thematic Layer
One paragraph, 100–150 words. Anchored to the throughline in §2; this chapter's theme is an instance of the book's. Name the central symbolic object and its resonance if there is one.

### 8. Continuity
What precedes this chapter (by number) and what it inherits: wardrobe, injuries, objects, location, residue. **State established here**, deliberately, to be held constant. **Plant instructions**, imperative, without rationale, per the backward-only rule. **Canon-vs-scene resolutions** adopted, with which entry governed and why; this is the one place provenance belongs. Markers for any gap the prose agent must write around.

### 9. Worldbuilding
Bullet list, one element per bullet, tier and scene trigger named, prominence-tiered detail per the selection rules.

### 10. Dialogue Anchors
The exchanges that must land, at beat level: who speaks, what the line must accomplish, register constraints from the speakers' fingerprints (*he never asks a question, so the objection lands as a statement*). Not drafted dialogue; where the outline already carries the author's dialogue, the anchor says that line is the author's and is preserved in substance.

### 11. Chapter-Specific Craft
Only placements unique to this chapter: a locked term set and its order of introduction, a register the chapter may not use, a lexicon bar, a sequence that must carry no vocabulary lesson. Opens with a one-line pointer to the style guide for everything general. If there is no style guide, this section carries the transcribed craft rules and the skill has warned the author.

### 12. Other Notes
Bullet list: what this chapter must not do (and it must never anticipate); what is unresolved at the last line; tonal target; POV reminders.

---

## Scene-split chapters

When a chapter is genuinely scene-split (multi-POV, or long enough for `scenes/`), sections 4, 5, 6, and 9 repeat per scene under `## Scene 1 — …` headers. Sections 2, 3, 7, 8, 10, 11, 12 stay chapter-level. Default to the single chapter-level form.

---

## Writing Style

**Tone:** a director's production brief. Professional, specific, synthesized. The prose agent reads this under cognitive load; clarity beats flourish and flow beats citation.

**Avoid:** redundancy; blockquoted or quoted canon; source attributions in the body; author-facing commentary the prose agent cannot use; anything that tells the prose agent what happens (that is the outline's) or how to write in general (that is the style guide's); anything about a later chapter.

**Include:** specific, concrete detail; canon wording absorbed where it is sharper than paraphrase; active verbs; imperatives for plants; plain statements of which framework direction fires and which does not.

**Format:** `##` numbered section headers; `### **Name (Tier)**` character headers; `***bold italics***` for POV subsection labels; paragraphs for §§2, 3, 5–8; bullets for §§9, 10, 12 and for specification lists.

---

## Quality Checklist

Before finalizing, verify:

- [ ] Every on-page character's and worldbuilding element's canon entry was read **in full**, never grepped.
- [ ] **No section names, describes, or hints at a chapter after this one.** No framework arrow carries a future trigger. No worldbuilding entry carries chain-of-custody past this chapter. Every plant is stated imperatively without its rationale. No Revelation Log entry dated after this chapter, and no reveal that hasn't landed, reached the file.
- [ ] Nothing in the file tells the prose agent *what happens* beyond the Chapter Shape's beat index; the outline is the content.
- [ ] No general craft is present when `voice/style-guide.md` exists; if it doesn't, the transcription is present and the author was warned.
- [ ] The body contains no blockquotes, quoted canon, or source attributions outside Continuity's resolutions; specification lists (inventories, lexicon bars, locked term sets) are exact.
- [ ] Every on-page character has an entry at the right tier, sized within its ceiling; no off-page character intrudes unless the POV's interiority reaches them; unnamed-in-narration characters are marked.
- [ ] Every recorded framework is carried for POV and Major, characterized to this chapter, with the firing direction (or *neither*) stated; no invented typology.
- [ ] Physical state: established state preserved identically; unestablished state given concrete choices and recorded in Continuity.
- [ ] Story Context is filtered to this chapter; book-level furniture is cut.
- [ ] Chapter Shape carries the premise, the beat index, pacing, expansion target, and opening/closing technique.
- [ ] Each worldbuilding element names its trigger and tier; governing logic preserved; superseded or region-wrong details flagged as do-not-use.
- [ ] Dialogue Anchors name the exchanges that must land with their register constraints; the author's dialogue in the outline is marked preserved.
- [ ] Open questions are frontmatter ID pointers; marker prose appears in the body only where the prose agent must write around a gap.
- [ ] The prose agent could write the chapter from the style guide, the outline, and this Blueprint alone.
