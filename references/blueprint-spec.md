<!-- ABOUTME: The craft spec for a chapter Blueprint — the pre-prose production brief -->
<!-- ABOUTME: Principles, character tiering, worldbuilding selection, the 8 required sections, quality checklist -->

# Blueprint Spec

A **Blueprint** is a single, self-contained context document handed to a prose-writing agent before it writes a chapter. It replaces the older pattern of "chapter outline + full character bios + full worldbuilding dumps" with one tailored artifact: **the prose agent should be able to write the chapter from the Blueprint alone** — no cross-referencing back to the bios, the treatment, or the manifest.

The Blueprint is not a summary and not a second outline. The outline says *what happens*; the Blueprint assembles *everything the prose agent needs to render it well* — every character and worldbuilding element that will **surface** in the chapter, at the right **resolution** for each, with current state (clothing, wounds, mental state, what's been revealed) fused in. No redundancy, no dead weight.

The `blueprint` skill operates the workflow (when to run, how to gather context from the folder, propose/confirm/write). This file specifies the **content shape** of what it produces. For the file layout (frontmatter, scene-split form, history) see `references/file-schemas.md` § Blueprint.

---

## Core Principles

### The Scene-Surface Test

Every sentence in the Blueprint must pass this test: *"Will this detail surface in the prose agent's writing of THIS chapter?"* If a character's childhood friendship doesn't come up in dialogue, interiority, or behavior — cut it. If a location's security protocol isn't encountered — cut it. The prose agent's context is precious; don't spend it on dormant detail. **This is the single most important rule.**

### Integrate Current State — and never write toward future state

The major failure mode of the old outline-plus-bio-dump pattern was drift between the two: the canonical bio said one thing, the chapter context said something subtly different, and the prose agent had to reconcile. You solve this at generation time, by fusing one clean, scene-current image per element.

Scene-current state has a definite source order:

1. **The Canon entry's Revelation Log, filtered to `chapter ≤ N`** (see `canon-schemas.md` § Revelation Log). This is the crude, authoritative timeline: a character injured in ch 12 is still favoring that arm in ch 17; a character whose spouse died in ch 14 carries that grief from ch 14 on. Include every log entry dated at or before this chapter.
2. **Reconstruction from the treatment's chronology and prior chapters' outlines/prose** where the log is silent — clothing established last chapter, an emotional residue from the previous scene, an open beat carried forward.

Then:

- Merge bio-level description ("silver-white hair combed back") with scene-specific state ("tie loosened, reading glasses on the desk") into one clean image.
- If the canonical bio and the scene-state conflict, resolve in favor of the scene and note the resolution in the Continuity section.
- **Never reach past chapter N.** A Revelation Log entry dated after this chapter is *future state* — a reveal that hasn't landed, a death that hasn't happened. Writing toward it spoils the story and corrupts continuity. The base bio describes the character's *whole arc*; your job is the character *as of this chapter*, not as they end up.

### Tier, Don't Duplicate

If two or more characters serve a similar functional role in the chapter (two junior officers at the displays; three kitchen staff receiving a farewell), describe them together in one compact paragraph. Don't tier each separately when the prose agent only needs the collective impression.

### Resolution, Not Length

Per-tier ceilings are ceilings, not targets. If a POV character's surfacing content genuinely fits in 600 words, don't pad to 1,500. If a minor character needs only two sentences, stop at two. Length that doesn't earn its keep makes the Blueprint harder to use.

---

## Character Tiering

For each character on-page or meaningfully referenced, assign a tier and generate their entry at that resolution. Order in the Blueprint: POV first, then Major, then Supporting, then Minor, then Referenced. A character's Blueprint tier is **chapter-local** — the story's protagonist is the POV tier in their own chapters but may be Referenced-not-present in a chapter they don't appear in. It is *not* the same as the character's bio tier (major/supporting/minor in the manifest).

### POV (up to 1,500 words)

The character whose interiority the chapter lives inside.

**Include:**
- **Current Physical & State** — clothing, grooming, posture, visible wear, scene-start injuries, fatigue, hunger. Fuse canonical appearance with Revelation Log (≤ N) and prior-chapter state.
- **Emotional State & Goal** — what they want in this chapter, what they feel, what's at stake, what they're avoiding.
- **Voice Fingerprint (chapter-distilled)** — register and rhythm; the slice of their reference well likely to surface here; profanity profile; verbal tell under pressure; never-says; character of their inner voice. *Drop* fingerprint dimensions that won't audibly surface.
- **Scene-Relevant Psychology** — the specific aspects of their arc, The Lie, dominant fear/drive that shape their actions and interiority *in this chapter*. Omit MBTI/Enneagram labels unless the prose agent would actively use them to calibrate voice.
- **Interiority Guidance** — how their inner voice differs from their outer one; what they rationalize outward vs. confess inward. The single most important subsection for intimate third-person-limited chapters.
- **Behavioral Tells** — gestures, tics, speech patterns the prose agent should reach for.

**Drop:** Biography not activated in this chapter; relationships with characters not present and not thought about; hobbies; generic trait lists; type labels without active use.

### Major Participant (600–1,000 words)

Significant speaking presence and/or dramatic function — their choices affect the chapter's outcome.

**Include:** Physical appearance + current state; external voice pattern (register, cadence, profanity profile, one or two hallmark phrases); chapter-specific emotional state & goal; behavioral tells; relationship to the POV as it bears on this chapter only.

**Drop:** Internal monologue (that's the POV's job); deep psychological profile; type labels; family/childhood; voice dimensions the prose agent wouldn't audibly hear here.

### Supporting (400–800 words)

Present and speaks, but not in the chapter's main dramatic engine — assists, delivers, reacts.

**Include:** Appearance + current state; voice register; behavioral tells; chapter-specific mood and intent; one-sentence relationship to POV if relevant.

**Drop:** Everything in Major's drop list, plus voice complexity beyond register and one hallmark pattern.

### Minor / Walk-through (up to 200 words)

Brief on-page appearance, functional role.

**Include:** What they look like, what they're wearing, how they move, voice register in one sentence, one behavioral or vocal tell if the moment needs it.

**Drop:** Psychology, backstory, relationships, interiority, Voice Fingerprints.

### Referenced, Not Present (≤ 40 words)

Discussed, thought about, or implied — never on-page.

**Include:** Only if the POV's interiority addresses them or the dialogue references them in a way the prose agent must calibrate. One framing line: who they are to the POV and what charge their name carries.

**Drop:** Everything else. Do not include characters merely named in passing without emotional weight.

---

## Worldbuilding Selection

List only the locations, objects, systems, and elements the chapter actually touches. For each:

- **Name the scene trigger** — the moment in the chapter where this element appears or is used.
- **Emit only the dimensions the chapter uses.** A magic system: the spell cast, not the full metaphysics. A spaceship: the cockpit, not every deck. A conference room: what the characters see, hear, and interact with.
- **Collapse atmospheric-only elements** to 1–2 sentences.
- **Preserve identity markers via their carrier.** A signature object that doesn't *do* anything but rides with a character as identity goes in their physical line — not its own worldbuilding bullet.
- **Apply the Revelation Log (≤ N) to elements too** — a location damaged in an earlier chapter, a device that gained a capability, shows its current state.

Per-element budget: typically **40–100 words**, extendable to **150+** only if the element is central to the action.

---

## Required Sections

### Header Information
- Chapter number and title
- Time of day / narrative date
- POV character (with narrative style: third-person limited, past tense, etc.)

### 1. Scene Function
Single line, 3–6 words, standard story-structure terminology. *Examples:* "Inciting Incident, Character Introduction" · "Midpoint Reversal, Alliance Formation" · "All Is Lost, Mentor Death."

### 2. Characters
Per the tiering model above. Order: POV → Major → Supporting → Minor → Referenced.

**Entry format:**
- Header: `**Character Name (Tier)**`
- POV uses all subsections in bold italics: `***Current Physical & State***`, `***Emotional State & Goal***`, `***Voice Fingerprint***`, `***Scene-Relevant Psychology***`, `***Interiority***`, `***Behavioral Tells***`.
- Major drops *Interiority* and narrows *Psychology*. Supporting collapses to Physical + Voice + Emotional + Tells. Minor is a short paragraph or two. Referenced is a single sentence.

### 3. Setting
Single paragraph, 75–100 words. Sensory-rich: location, time of day, lighting, colors, spatial layout, sounds, smells, temperature, atmospheric tone. Name the *specific* space — not "the office" but the cleared Resolute desk at 7:38 AM with winter light through bulletproof glass.

### 4. Main Source of Conflict
Single paragraph, 100–125 words. The central dramatic tension specific to *this* chapter — how it manifests, how it escalates or shifts, what's at stake. Not general story conflict.

### 5. Symbolism and Thematic Layer
Single paragraph, 100–125 words. Symbols, metaphors, archetypal elements this chapter should carry. Connect to the primer's moral argument without over-explaining. If the chapter has a central symbolic object, name it and its resonance.

### 6. Continuity Considerations
Single paragraph, 150–250 words. Track connections to past and future:
- **Links to previous chapters:** physical continuity (clothing, locations, objects), emotional threads, unresolved tensions. Reference prior chapters *by number*.
- **Foreshadowing:** setups being seeded (cross-reference the primer's Setup/Payoff Ledger and the chapter outline's Setups Planted).
- **Must remain consistent:** timeline, character knowledge, established facts, ongoing subplots.
- **Canon-vs-scene resolutions:** if the canonical bio says X and a prior chapter or the Revelation Log established Y, state which the Blueprint adopts and why. Resolve here so the prose agent doesn't have to.

### 7. Worldbuilding
Bullet list. For each element, the scene trigger + only the dimensions the chapter uses. 4–8 elements typical, 40–100 words each unless action-central. Omit dimensions the chapter doesn't touch.

### 8. Other Notes
Bullet list, 75–100 words total:
- **Scene Structure** — pacing, act breaks within the chapter.
- **Transition Technique** — how the chapter begins and ends.
- **Unresolved Threads** — cliffhangers, delayed resolutions, dangling tensions.
- **Tonal Target** — the emotional register the prose should hit.
- **POV-Specific Reminders** — anything to hold constant about the POV's voice or perspective.

---

## Scene-split chapters

When a chapter is genuinely scene-split (multi-POV, or long enough for a `scenes/` subfolder), the Characters / Setting / Conflict / Worldbuilding sections repeat **per scene** under `## Scene 1 — …`, `## Scene 2 — …` headers, because tiering, POV, and current state can differ scene-to-scene. The Symbolism, Continuity, and Other Notes sections stay chapter-level. Default to the single chapter-level form; use the scene-split form only when the chapter actually needs it.

---

## Writing Style

**Tone:** Professional, concise, like a director's production brief. The prose agent reads this under cognitive load — clarity and specificity beat literary flourish.

**Avoid:** Redundancy; overly literary language; padding or throat-clearing; lists where paragraphs work better (exceptions: Worldbuilding, Other Notes, character subsections).

**Include:** Specific, concrete details; active verbs; vivid descriptors; clear connections between elements; only what the prose agent can immediately use.

**Format:** `**Bold**` for section headers, character names, tier labels. `***Bold italics***` for character subsection labels. Bullets for Worldbuilding, Other Notes, and character subsections where appropriate. Paragraphs for Setting, Conflict, Symbolism, Continuity.

---

## Quality Checklist

Before finalizing, verify:

- [ ] You read each on-page character's and worldbuilding element's Canon entry **in full** — never grepped it. (Grep returns keyword matches without the causal framing; the gaps get confabulated from genre priors.)
- [ ] Every on-page character has an entry; no off-page character intrudes unless the POV's interiority addresses them.
- [ ] Each character is tiered correctly and sized within their tier's ceiling — and below it when detail doesn't earn its keep.
- [ ] POV character retains chapter-distilled voice fingerprint + scene-relevant psychology + interiority guidance + current state.
- [ ] Non-POV characters carry no interior-monologue content.
- [ ] Minor / walk-through characters are described in short compact entries; referenced-but-absent get ≤ 1 framing line.
- [ ] Each worldbuilding element names the moment that uses it; no element includes dimensions the chapter doesn't touch.
- [ ] Current state is fused from the Revelation Log (≤ this chapter) and prior chapters; no information conflict remains between canonical bio and scene-state — conflicts are resolved in Continuity.
- [ ] **No detail reflects a Revelation Log entry dated after this chapter, or any reveal/state-change that hasn't landed yet.**
- [ ] Setting includes sensory details beyond the visual.
- [ ] Conflict is specific to *this* chapter; symbolism connects to themes without over-explaining.
- [ ] Continuity references prior chapters by number.
- [ ] The prose agent could write the chapter from this Blueprint alone, without access to the full Canon.
