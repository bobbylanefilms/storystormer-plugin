<!-- ABOUTME: The craft spec for a chapter Blueprint — the pre-prose production brief -->
<!-- ABOUTME: Fidelity-preservation philosophy, character tiering, personality frameworks, worldbuilding selection, the 9 required sections, quality checklist -->

# Blueprint Spec

A **Blueprint** is a single, self-contained context document handed to a prose-writing agent before it writes a chapter. At prose time it **replaces the raw Canon layer entirely** — character bios, worldbuilding entries, and the story primer are all omitted from the prose agent's context when a Blueprint exists (the prose skill's lean path). Whatever the Blueprint drops, the prose agent never sees.

That makes the Blueprint a **fidelity-preserving consolidation, not a summary, and not a second outline.** The outline says *what happens*; the Blueprint assembles *everything the prose agent needs to render it well* — every character and worldbuilding element that will **surface** in the chapter, each at the resolution its prominence earns, with current state (clothing, wounds, mental state, what's been revealed) fused in, and with the story-level frame (genre, premise, moral argument, tone) the primer would otherwise have provided. It routinely stands in for 20–30k tokens of scattered raw Canon; a finished Blueprint of **4–5k tokens (roughly 3,000–3,800 words) is money well spent for a busy chapter**, and a simple chapter can land shorter. Do not compress for its own sake. The goal is one cohesive, production-ready brief the prose agent can write from without reconstructing scattered sources — **with the Canon's richness intact wherever the chapter will use it.**

The `blueprint` skill operates the workflow (when to run, how to gather context from the folder, propose/confirm/write). This file specifies the **content shape** of what it produces. For the file layout (frontmatter, scene-split form, history) see `references/file-schemas.md` § Blueprint.

---

## Core Principles

### The Blueprint Is the Sole Carrier

At prose time, the Blueprint is the *only* channel through which Canon reaches the prose agent — the bios, worldbuilding entries, and primer it replaces are not in that context. **A detail you omit is a detail the prose agent invents or gets wrong.** When you are unsure whether something will surface, err toward carrying it: worldbuilding texture, primer framing, and psychological depth all raise the quality ceiling of the prose even when they don't appear on the page verbatim. **This is the most important rule of this spec.** Inclusion is generous; what you tier is *resolution*, not presence.

### Prominence Sets Resolution

Inclusion is generous; *resolution* is what you tier. For every element, ask: *how prominent is this in THIS chapter?*

- **Foreground** — the chapter's action touches it, characters interact with it, the chapter takes place inside it: preserve most of its Canon detail, largely verbatim.
- **Background** — present, seen, or passed through, but not focal: summarize to the impression the prose needs.
- **Dormant** — genuinely untouched by the chapter (a location nobody visits or mentions, a subplot nobody thinks about): omit.

For large multi-scenario entries, distill to the slice this chapter uses — the spells cast rather than the full grimoire, the room the chapter occupies rather than the whole house — **but always preserve the entry's overall philosophy or governing logic**, whatever the tier. The prose agent needs the *why* of a magic system or technology even when only one feature of it appears.

### Carry Canon Verbatim Where You Can

Canon entries were written to give the prose rich, specific detail — don't launder that specificity through paraphrase. Carry wording over verbatim by default. Rewrite only when you are (a) **distilling** — summarizing an entry down to the resolution its prominence earns — or (b) **characterizing** — angling material to the chapter's specific focus (e.g. naming which Enneagram direction a character is living out under this chapter's pressure). Verbatim carry-over is not laziness; it is fidelity.

### Integrate Current State — and never write toward future state

Fuse one clean, scene-current image per element at generation time — so the prose agent never has to reconcile a canonical bio that says one thing against a chapter context that says something subtly different. Drift between the two is a top failure mode; you foreclose it here.

Scene-current state has a definite source order:

1. **The Canon entry's Revelation Log, filtered to `chapter ≤ N`** (see `canon-schemas.md` § Revelation Log). This is the crude, authoritative timeline: a character injured in ch 12 is still favoring that arm in ch 17; a character whose spouse died in ch 14 carries that grief from ch 14 on. Include every log entry dated at or before this chapter.
2. **Reconstruction from the treatment's chronology and prior chapters' outlines/prose** where the log is silent — clothing established last chapter, an emotional residue from the previous scene, an open beat carried forward.

Then:

- Merge bio-level description ("silver-white hair combed back") with scene-specific state ("tie loosened, reading glasses on the desk") into one clean image.
- **Clothing, injuries, and accessories follow a hard continuity rule.** If prior chapters established a specific state (a named outfit, a bandaged hand, a watch on the wrong wrist), preserve it *identically* — do not restyle for variety. If no state has been established, **make specific, concrete choices now** (name the garments, the wear, the carried objects) and record them in Continuity as deliberate, so the prose agent has something definite to hold constant. **Never leave wardrobe or physical state vague** — vagueness at Blueprint time becomes inconsistency at prose time.
- If the canonical bio and the scene-state conflict, resolve in favor of the scene and note the resolution in the Continuity section.
- **Never reach past chapter N.** A Revelation Log entry dated after this chapter is *future state* — a reveal that hasn't landed, a death that hasn't happened. Writing toward it spoils the story and corrupts continuity. The base bio describes the character's *whole arc*; your job is the character *as of this chapter*, not as they end up. This is the whole point of the `chapter ≤ N` filter.

### Knowledge horizon & the spoiler firewall

The Blueprint's knowledge horizon is **this chapter**. The seed gives you forward *orientation* — the primer's Setup/Payoff Ledger, the structure spine, the chapter outline's Setups Planted — so you know what this chapter must plant and where it sits in the arc. Use that orientation to seed foreshadowing and anchor theme. But you are handed the treatment only as the **spine-slot passage for this chapter** (its chronology), *not* the whole plot — and even the forward-orientation artifacts are structural indexes, not future narrative. **Never leak a future event, reveal, or state into the Blueprint.** The firewall lives here: the Blueprint's output *is* the prose agent's context, so a spoiler that reaches the Blueprint reaches the prose. Seed the setup ("plant the locket's engraving as innocuous here") without narrating the payoff.

### Tier, Don't Duplicate

If two or more characters serve a similar functional role in the chapter (two junior officers at the displays; three kitchen staff receiving a farewell), describe them together in one compact paragraph. Don't tier each separately when the prose agent only needs the collective impression.

### Substance, Not Padding

The generous budgets below are for *Canon fidelity*, not filler. Never pad with invented generalities, throat-clearing, or restatement to reach a length. Every sentence should carry either Canon detail, scene-current state, primer framing, or craft guidance the prose agent can use. A lean section that carries everything relevant beats a long one that buries it. Per-tier word counts are **ceilings, not targets** — if a POV character's surfacing content genuinely fits in 800 words, don't pad to 2,000.

---

## Character Tiering

For each character on-page or meaningfully referenced, assign a tier and generate their entry at that resolution. Order in the Blueprint: POV first, then Major, then Supporting, then Minor, then Referenced. A character's Blueprint tier is **chapter-local** — the story's protagonist is the POV tier in their own chapters but may be Referenced-not-present in a chapter they don't appear in. It is *not* the same as the character's bio tier (major/supporting/minor in the manifest).

### Personality Frameworks — carry them all

Canon bios record personality frameworks in their Quick Reference and Psychology sections (see `canon-schemas.md`): **Enneagram** (type, wing, integration/disintegration lines), **MBTI** (4-letter type and cognitive style), **CliftonStrengths** (top 5 themes). When a character's bio carries these, the Blueprint carries **all of them** — even the parts this chapter won't strictly use. They are the prose agent's calibration instruments for voice, decision-making, and behavior under pressure; the agent has no other access to them.

Then *characterize* them for this chapter:

- **Enneagram:** state the type as Canon gives it, and identify **which direction the character is living out in THIS chapter** — integration (growth) or disintegration (stress) — and what that behavior concretely looks like here.
- **MBTI:** carry the full type/cognitive-style description, and **flag which functions or traits are activated** by this chapter's situation.
- **CliftonStrengths:** carry all listed themes, and **mark which are present or activated** in this chapter's action.

Depth scales by tier: POV and Major get the full framework block with scene-activation notes; Supporting gets a compact block (one line per framework, activation flagged); Minor and Referenced omit frameworks unless a specific moment needs one tell. **Never invent typology the Canon doesn't record** — if a bio has no frameworks, write the psychology from what Canon does say. The frameworks ride the Blueprint by default, because the prose agent can't reach the bio to recover them.

### POV (up to 2,000 words)

The character whose interiority the chapter lives inside.

**Include:**
- **Current Physical & State** — clothing, grooming, posture, visible wear, scene-start injuries, fatigue, hunger, intoxication. Fuse canonical appearance with Revelation Log (≤ N) and prior-chapter state; apply the clothing continuity rule (preserve established state identically; make specific choices where nothing is established).
- **Emotional State & Goal** — what they want in this chapter, what they feel, what's at stake, what they're avoiding.
- **Voice Fingerprint (chapter-distilled)** — register and rhythm; the slice of their reference well likely to surface here; profanity profile; verbal tell under pressure; never-says; character of their inner voice. *Drop* fingerprint dimensions that won't audibly surface.
- **Personality Frameworks** — per the rules above: all recorded frameworks, with this chapter's Enneagram direction named and MBTI/Clifton activations flagged.
- **Scene-Relevant Psychology** — the specific aspects of their arc, The Lie, dominant fear, dominant drive, or cognitive-emotional posture that shape their actions and interiority *in this chapter*.
- **Interiority Guidance** — how their inner voice differs from their outer one; what they rationalize outward vs. confess inward; the gap between presentation and private thought. The single most important subsection for intimate third-person-limited chapters.
- **Behavioral Tells** — gestures, tics, speech patterns the prose agent should reach for.

**Drop:** Biography not activated in this chapter; relationships with characters not present and not thought about; hobbies unconnected to the chapter.

### Major Participant (800–1,200 words)

Significant speaking presence and/or dramatic function — their choices affect the chapter's outcome.

**Include:** Physical appearance + current state (clothing continuity rule applies); external voice pattern (register, cadence, profanity profile, one or two hallmark phrases); full **Personality Frameworks** block with scene-activation notes; chapter-specific emotional state & goal; behavioral tells; relationship to the POV as it bears on this chapter.

**Drop:** Internal monologue (that's the POV's job); family and childhood history not activated here.

### Supporting (400–800 words)

Present and speaks, but not in the chapter's main dramatic engine — assists, delivers, reacts.

**Include:** Appearance + current state; voice register; behavioral tells; chapter-specific mood and intent; compact **Personality Frameworks** block (one line per recorded framework, activation flagged); one-sentence relationship to POV if relevant.

**Drop:** Interiority, deep backstory, voice complexity beyond register and one hallmark pattern.

### Minor / Walk-through (up to 200 words)

Brief on-page appearance, functional role.

**Include:** What they look like, what they're wearing, how they move, voice register in one sentence, one behavioral or vocal tell if the moment needs it.

**Drop:** Psychology, personality frameworks, backstory, relationships, interiority, Voice Fingerprints.

### Referenced, Not Present (≤ 40 words)

Discussed, thought about, or implied — never on-page.

**Include:** Only if the POV's interiority addresses them or the dialogue references them in a way the prose agent must calibrate. One framing line: who they are to the POV and what charge their name carries.

**Drop:** Everything else. Do not include characters merely named in passing without emotional weight.

---

## Worldbuilding Selection

Worldbuilding entries are the story's sources of truth for locations, objects, systems, and technology — written specifically to give the prose rich, concrete detail. The Blueprint is their only route to the prose agent, so carry them at **high fidelity, tiered by prominence**:

- **Foreground** (the action uses it, characters interact with it, the chapter happens inside it): preserve most of the entry's detail, largely verbatim — **150–400 words**, more if the element is central to the action.
- **Background** (present or perceived but not focal): summarize to the sensory impression the prose needs — **40–100 words**.
- **Atmospheric-only**: collapse to 1–2 sentences.

For every element:

- **Name the scene trigger** — the moment in the chapter where this element appears or is used.
- **Distill multi-scenario entries to this chapter's slice** — the spells cast rather than the full metaphysics, the cockpit rather than every deck, the one room rather than the whole house — **but always preserve the system's overall philosophy or governing logic**, whatever the tier. The prose agent should understand *why* the magic or technology works the way it does, even when only one feature appears.
- **Preserve identity markers via their carrier.** A signature object that doesn't *do* anything but rides with a character as identity goes in their physical line — not its own worldbuilding bullet.
- **Apply the Revelation Log (≤ N) to elements too** — a location damaged in an earlier chapter, a device that gained a capability, shows its current state.
- Omit only what is genuinely dormant — untouched, unmentioned, unthought-of in this chapter.

---

## Required Sections

### Header Information
- Chapter number and title
- Time of day / narrative date
- POV character (with narrative style: third-person limited, past tense, etc.)

### 1. Scene Function
Single line, 3–6 words, standard story-structure terminology. *Examples:* "Inciting Incident, Character Introduction" · "Midpoint Reversal, Alliance Formation" · "All Is Lost, Mentor Death."

### 2. Story Context (harvested from the primer)
200–400 words. The primer is **not** in the prose agent's context on the lean path — this section is its sole carrier. Harvest generously; carry over more than you might think necessary, because it informs the quality of the prose even when it never surfaces verbatim. Verbatim carry-over is welcome.

**Include:**
- **Genre and its promises** — what kind of book this is and what the reader has been promised.
- **Premise / logline** — the story in brief, as the primer frames it.
- **Moral argument & thematic throughline** — the book's central question and what the story argues; anchor this chapter's thematic layer to it.
- **Tone and style** — the register, texture, and stylistic identity the primer prescribes (the voice rules).
- **Character web** — the primer's intended dynamics among the characters in this chapter's cast: the "space between" them that individual bios don't carry.
- Any other primer material that bears on this chapter (stakes frame, world posture, structural intent).

**Omit:** primer material with no bearing on this chapter — but when in doubt, carry it.

### 3. Characters
Per the tiering model above. Order: POV → Major → Supporting → Minor → Referenced.

**Entry format:**
- Header: `**Character Name (Tier)**`
- POV uses all subsections in bold italics: `***Current Physical & State***`, `***Emotional State & Goal***`, `***Voice Fingerprint***`, `***Personality Frameworks***`, `***Scene-Relevant Psychology***`, `***Interiority***`, `***Behavioral Tells***`.
- Major drops *Interiority* (keeps the full frameworks block). Supporting collapses to Physical + Voice + Frameworks + Emotional + Tells. Minor is a short paragraph or two. Referenced is a single sentence.

### 4. Setting
Single paragraph, 75–150 words. Sensory-rich: location, time of day, lighting, colors, spatial layout, sounds, smells, temperature, weather, atmospheric tone, any vehicles or distinctive geography. Name the *specific* space — not "the office" but the cleared Resolute desk at 7:38 AM with winter light through bulletproof glass. Deep physical detail for foreground locations lives in Worldbuilding; this section is the chapter's opening sensory frame.

### 5. Main Source of Conflict
Single paragraph, 100–125 words. The central dramatic tension specific to *this* chapter — how it manifests, how it escalates or shifts, what's at stake. Not general story conflict.

### 6. Symbolism and Thematic Layer
Single paragraph, 100–125 words. Symbols, metaphors, archetypal elements this chapter should carry. Anchor to the moral argument and thematic throughline carried in Story Context — this chapter's theme is an instance of the book's, not a fresh invention. If the chapter has a central symbolic object, name it and its resonance.

### 7. Continuity Considerations
Single paragraph, 150–250 words. Track connections to past and future:
- **Links to previous chapters:** physical continuity (clothing, locations, objects), emotional threads, unresolved tensions. Reference prior chapters *by number*.
- **New state established here:** where prior chapters left wardrobe or physical state unestablished and you made specific choices, name them as deliberate so future chapters inherit them.
- **Foreshadowing:** setups being seeded (cross-reference the primer's Setup/Payoff Ledger and the chapter outline's Setups Planted). Seed the setup, never narrate the future payoff.
- **Must remain consistent:** timeline, character knowledge, established facts, ongoing subplots.
- **Canon-vs-scene resolutions:** if the canonical bio says X and a prior chapter or the Revelation Log established Y, state which the Blueprint adopts and why. Resolve here so the prose agent doesn't have to.

### 8. Worldbuilding
Bullet list. For each element, the scene trigger + prominence-tiered detail per the Worldbuilding Selection rules. Foreground elements run 150–400 words; background 40–100; atmospheric 1–2 sentences. Omit dimensions the chapter doesn't touch; preserve each system's governing logic.

### 9. Other Notes
Bullet list, 75–100 words total:
- **Scene Structure** — pacing, act breaks within the chapter.
- **Transition Technique** — how the chapter begins and ends.
- **Unresolved Threads** — cliffhangers, delayed resolutions, dangling tensions.
- **Tonal Target** — the emotional register the prose should hit.
- **POV-Specific Reminders** — anything to hold constant about the POV's voice or perspective.

---

## Scene-split chapters

When a chapter is genuinely scene-split (multi-POV, or long enough for a `scenes/` subfolder), the Characters / Setting / Conflict / Worldbuilding sections repeat **per scene** under `## Scene 1 — …`, `## Scene 2 — …` headers, because tiering, POV, and current state can differ scene-to-scene. The Story Context, Symbolism, Continuity, and Other Notes sections stay chapter-level. Default to the single chapter-level form; use the scene-split form only when the chapter actually needs it.

---

## Writing Style

**Tone:** Professional, concise, like a director's production brief. The prose agent reads this under cognitive load — clarity and specificity beat literary flourish.

**Avoid:** Redundancy; overly literary language; padding or throat-clearing; paraphrase that launders Canon specificity; lists where paragraphs work better (exceptions: Worldbuilding, Other Notes, character subsections).

**Include:** Specific, concrete details; Canon wording carried verbatim where fidelity allows; active verbs; vivid descriptors; clear connections between elements.

**Format:** `**Bold**` for section headers, character names, tier labels. `***Bold italics***` for character subsection labels. Bullets for Worldbuilding, Other Notes, and character subsections where appropriate. Paragraphs for Story Context, Setting, Conflict, Symbolism, Continuity.

---

## Quality Checklist

Before finalizing, verify:

- [ ] You read each on-page character's and worldbuilding element's Canon entry **in full** — never grepped it. (Grep returns keyword matches without the causal framing; the gaps get confabulated from genre priors.)
- [ ] Every on-page character has an entry; no off-page character intrudes unless the POV's interiority addresses them.
- [ ] Each character is tiered correctly; foreground detail is preserved at high fidelity, background summarized — and sized within the tier's ceiling, below it when detail doesn't earn its keep.
- [ ] Every character whose Canon bio records personality frameworks carries **all** of them — Enneagram with this chapter's integration/disintegration direction named, MBTI and CliftonStrengths with scene activations flagged. No invented typology.
- [ ] Clothing, injuries, and accessories: established state preserved identically; unestablished state given specific, concrete choices (and noted in Continuity as deliberate).
- [ ] Story Context carries the primer's genre, premise, moral argument, tone/style, and character web — generously.
- [ ] POV character retains chapter-distilled voice fingerprint + full frameworks + scene-relevant psychology + interiority guidance + current state.
- [ ] Non-POV characters carry no interior-monologue content.
- [ ] Minor / walk-through characters are described in short compact entries; referenced-but-absent get ≤ 1 framing line.
- [ ] Each worldbuilding element names the moment that uses it and is tiered by prominence; multi-scenario entries are distilled to this chapter's slice with their governing philosophy preserved.
- [ ] Canon wording is carried verbatim wherever you weren't distilling or characterizing.
- [ ] Current state is fused from the Revelation Log (≤ this chapter) and prior chapters; no information conflict remains between canonical bio and scene-state — conflicts are resolved in Continuity.
- [ ] **No detail reflects a Revelation Log entry dated after this chapter, or any reveal/state-change that hasn't landed yet; nothing from the treatment's or the setup/payoff ledger's future leaked in.**
- [ ] Setting includes sensory details beyond the visual.
- [ ] Conflict is specific to *this* chapter; symbolism anchors to the book's thematic throughline carried in Story Context.
- [ ] Continuity references prior chapters by number.
- [ ] The prose agent could write the chapter from this Blueprint alone, without access to the full Canon or the primer.
