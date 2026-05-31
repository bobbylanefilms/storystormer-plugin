---
name: character-bio
description: Generate or expand a character bio at the right tier — major (~1400-1900w), supporting (~700w), or minor (~350w). Use when the user asks to "develop a character," "create a bio for [name]," "write up [name]," "flesh out a character," "promote a minor character to supporting / major," or "I have a character mentioned in the treatment but no bio yet." Auto-tiers the bio based on story role; lets the user override the tier.
---

# StoryStormer · Character Bio

You are creating or expanding a character bio. The bio is a *prose document* designed to be consumed by both the human author (for reference) and downstream agents (for prose generation). It uses craft frameworks as vocabulary — McKee, Truby, Egri, Weiland, Enneagram, MBTI, Clifton Strengths — to produce a character with real psychological texture.

Always follow `references/plan-first.md` — propose the tier and the approach, get confirmation, then write.

The frameworks and bio structure are detailed in `references/frameworks.md` and `references/file-schemas.md`. Read those before drafting; they're the texture you're producing.

## What you produce

A file at `characters/<slug>.md` following the bio schema (see `references/file-schemas.md`). YAML frontmatter, then a structured body proportional to the tier.

Three tiers — see `references/frameworks.md` for the framework vocabulary and `references/file-schemas.md` for section structure:

- **Major** — ~1,400 words standard, up to ~1,900 words extended for POV protagonists, primary antagonists, and characters carrying the thematic load.
- **Supporting** — ~700 words. Preserves Voice Fingerprint and Lie/Ghost but condenses everything else.
- **Minor** — ~350 words. Functional. Voice signature and one defining trait; usually no Lie/Ghost.

## What to do

### 1. Read context

- `treatment.md` — full read. Find every mention of the character. What do they do? Who do they interact with? What's their function in the story?
- `primer.md` — full read. Are they central to the premise / theme?
- `manifest.md` — what tier is the character currently logged at? Have they been promoted/demoted?
- `decisions.md` — grep-permitted, but read the relevant decisions in full. Anything about the character's backstory, relationships, or function?
- Existing bio at `characters/<slug>.md` if there is one (expansion/refresh case).
- Other character bios (the major characters) — for Voice Fingerprint differentiation (see *Voice well overlap* below).

**Operate in substantive mode** for this read — list the files you plan to consult at the top of your next response, full-read each with the Read tool (beginning to end, no grep), and quote at least one passage from each in your output. See `references/reading-discipline.md` § Substantive mode.

### 2. Pick the tier (and explain it)

Apply the criteria from `references/frameworks.md` and `references/file-schemas.md`. Tell the user your read:

> Marlowe is a POV protagonist mentioned in 30+ scenes across the treatment — I'm going to write her at the **Extended Major** tier (~1,700–1,900 words) so the prose agent has full Voice Fingerprint and Inner Voice texture. Her thematic posture on the central game-theory axis will be a load-bearing section.
>
> Defaulting to that unless you want a different tier.

If the user wants a different tier, honor it. Tier is the user's call — your recommendation is just a default.

### 3. Identify the gaps

Read what's there and identify what you *don't yet know* about the character. Examples:

- **The Lie** — is there a clear false belief the character holds?
- **The Ghost** — is there a wound that created the Lie?
- **Voice Fingerprint** — do we have a register, a reference well, a profanity profile, a verbal tell under pressure, a list of never-says?
- **Inner Voice** (for major POV characters) — do we know how their interior monologue differs from their public speech?
- **Thematic Posture** — if the story has a thematic axis, where does this character stand on it?
- **MBTI / Enneagram / Clifton Strengths** — do we have psychological scaffolding?

Don't fabricate these from genre priors. Identify what's missing and present it as a small set of choices for the user.

**Calibration when materials are thin.** When the treatment doesn't give you much on a character, prioritize **Psychology** and **Voice** — those carry the most downstream weight for prose generation. Physical Presence, Social Context, and Story Role can lean on lighter hints. For **Minor bios**, skip Lie/Ghost entirely — minor characters often don't have them, and a fabricated Lie is worse than no Lie. (Full calibration guidance in `references/canon-schemas.md` § Calibration when information is limited.)

### 4. Propose a plan

> Here's my plan for Marlowe's bio:
>
> - **Tier**: Extended Major (~1,700–1,900w).
> - **What I can draft from the treatment**: physical presence, profession, basic relationships, the case she's working, her general competence signature.
> - **What I need to ask you about**: the Lie / Ghost (the treatment hints she has a father wound — want me to propose three plausible Ghost candidates and you pick?), MBTI/Enneagram lean (I'd guess 6w5 → 9/3 from what's there — confirm?), the central thematic posture (game theory, in your political thriller — what's her stance?), and the Inner Voice register for intimate POV.
>
> Want me to ask the 4 questions first, or draft a first pass with my best guesses and we refine?

The user picks: answer first, or draft first. Both are valid paths.

### 5. Draft the bio

Use `references/file-schemas.md` for the section structure. Use `references/frameworks.md` for the vocabulary. Lean on the model — the structure tells you what sections to fill; the texture is judgment.

Key things to nail:

- **Quick Reference block at top** — for major bios, this is the rapid-extraction strip the prose agent reads first. Include only fields you actually know; omit rather than fabricate.
- **Essential Identity** — prose paragraph, not a list. The irreducible truth + one-sentence arc summary.
- **Voice Fingerprint** — this is the single most important section for prose generation downstream. Don't shortcut it. Register, reference well, profanity profile, humor register, inner voice (for POV), audience shift.
- **Lie and Ghost** — for major and supporting characters. Specific, named, grounded in their psychology.
- **Thematic Posture** — for major characters in stories with a thematic axis. A stance *produced by* their psychology, not a label.

Write in **flowing prose with section headers**, never in key-value or bullet-list format below the Quick Reference. (The web app's `canon-character-bio-v1.0.3.md` says this loud and clear — it's a hard rule for downstream prose quality.)

### 6. Cross-cast differentiation checks

Before finalizing a major bio, run three checks against the other major characters' bios. Each becomes more important the larger the main cast.

**Voice well overlap.** Compare the **Reference Wells** in the Voice Fingerprint across the main cast. If two characters share a well (e.g., both reach into military history), one needs a different well. *Differentiated wells are the single best defense against every smart character sounding alike.* Flag overlaps to the user: *"Both Marlowe and Park reach into military history for analogies. Want me to shift Marlowe to her father's accountant background or to her noir-fiction reading habit?"*

**Inner Voice differentiation** (Extended Major bios in multi-POV stories). Verify each POV character's interior monologue is meaningfully distinct from the others. Two POV characters who think in the same register will produce chapters that blur regardless of plot content. The split between public voice and inner voice should also differ per character — some are more honest inside than out; some are *more* performative inside than out; some are the same in both registers. Flag collisions explicitly.

**Thematic Posture differentiation** (Extended Major bios, when the story has a defined thematic axis). Scan the main-cast Postures as a set. Each major character's Posture must answer the story's organizing thematic question *differently*, and the differences must be produced by character psychology rather than thematically assigned. Test: strip the Posture labels and read only the mechanism and scene-level behavior — would each character still be doing something distinct? If two Postures collapse into the same answer, revisit. The Postures together should cover a meaningful span of the axis, not cluster in one region.

If any check fails, surface the conflict to the user and propose a resolution before writing.

### 7. Show the user the bio

For a first draft, show the whole thing and ask for reactions. For an expansion of an existing bio, show the diff (or just the changed sections).

If the user wants edits, apply them. Don't argue.

### 8. Write the file

Once approved:

- Snapshot any existing bio to `.storystormer/history/<timestamp>-character-bio/<slug>.md`.
- Write the new bio to `characters/<slug>.md`.
- Update `characters/_index.md` (mirror of manifest's character list, with one-line descriptors).
- Update `manifest.md` if the tier changed or the character is newly added.
- Update `state.md → What Exists` to reflect the new/updated bio.

### 9. Report

Short summary: tier, word count, what was added or expanded, what next character is the obvious next thing to develop (or other recommended next step).

## Working with existing bios

If a bio already exists, expansion is the default mode. Read it carefully. Identify what's missing or thin (often: Voice Fingerprint, Lie/Ghost, Thematic Posture). Propose a targeted expansion rather than a full rewrite — preserve the user's voice in sections that are working.

Tier promotion (supporting → major, minor → supporting) means a meaningful expansion. Tier demotion is rare; if the user asks for it, do it but flag the loss of detail.

## Reading discipline

This skill reads the treatment in full when generating or expanding a bio. **Never grep the treatment for character mentions** — you'll miss the implicit information and confabulate. Operate in substantive mode and quote from the source to prove the read.

See `references/reading-discipline.md` § Substantive mode.

## Subagent Dispatch

In **series mode**, populating a character bio's Per-Book Sub-Arcs section requires reading every book's treatment for the character's appearances. For a trilogy, that's 3 treatments × ~6,000 words each = ~18,000 words of treatment context just for one character's bio. Add the cross-cast differentiation checks (Voice Well, Inner Voice, Thematic Posture against other major bios) and the context cost grows further.

Dispatch read subagents per `references/subagent-pattern.md` for series-mode bio work:

1. **One per-book character-appearance subagent per book** (parallel) — each subagent full-reads its book's treatment and returns the character's appearances, actions, and arc development *in that book*, with verbatim excerpts. Scope is the character's slice of that book's treatment, not the full narrative.
2. **Cross-cast Voice Wells subagent** (when writing or expanding a major bio in a series with 3+ existing major bios) — full-reads each existing major bio's Voice Fingerprint section, returns just the Reference Wells field per character. Used by the main session's Voice Well overlap check.

The main session retains direct reads of: the character's existing bio (if expanding), the manifest, decisions affecting the character, `series.md`'s Per-Book Synopses, and `primer.md`. The bio drafting itself — the Quick Reference, Essential Identity, Voice Fingerprint, Lie/Ghost, Per-Book Sub-Arcs prose, Cross-cast differentiation judgment — happens in the main session against the subagent-aggregated appearance maps.

For **standalone-novel bios**, dispatch only when the treatment is large (15,000+ words) or when expanding 3+ bios in one session. A single bio against a normal-length treatment fits comfortably in main context.

## Series Mode

If `state.md` shows `project_type: series`, read `references/series.md` first. **Character bios are shared across the series** — one bio per character, living at `<root>/characters/<slug>.md`. The bio reflects the character's full series arc, not just one book.

Three behavioral changes in series mode:

1. **Read all relevant books' treatments**, not just the focused book's. To know what Maya does and how she changes, you need book 1's treatment, book 2's treatment, and book 3's treatment — wherever they exist. If a book's treatment doesn't exist yet (e.g., book 3 hasn't been drafted), use whatever is available — `series.md`'s Per-Book Synopses section is the lightest source of book-level arc material when treatments are absent. Also read `series.md` for the character's role in the series arc.
2. **Add the Quick Reference's `Appears in:` field**. Lists the books the character appears in, e.g., *"Appears in: books 1, 2, 3"* or *"Appears in: book 1"*. For age-progressing characters, also use the form *"Age: 28 (book 1) → 32 (book 3)"*.
3. **Add the Per-Book Sub-Arcs section** under Story Role & Arc. Each book the character appears in gets a 80–150w paragraph capturing what they do and how they change in that specific book. The overarching Series Arc paragraph (150–250w) captures the across-books trajectory. See `references/series.md` § Character bios in series mode for the exact subsection structure.

The cross-cast differentiation checks (Voice Well, Inner Voice, Thematic Posture) operate across the **full series cast**, not per book. Two characters who share a Voice Well in different books still produce voice collision when the books are read sequentially.

Bio length scales modestly with series scope. A major bio that spans three books may grow to ~2,000–2,400w (vs. the standalone ~1,400–1,900w) because of the Per-Book Sub-Arcs section. Don't pad — the additional words are arc content, not extra detail on existing sections.

For characters appearing in only one book (e.g., an antagonist who dies in book 1), the bio is structured as a series-aware single-book bio: `Appears in: book 1` in Quick Reference, the Series Arc paragraph is shorter and contextualizes the character's role in the broader series even though their direct involvement is limited.

## What this skill does not do

- Worldbuilding entries. Use `worldbuilding-entry` for locations, organizations, magic systems, technology, creatures, cultures, religions, and other non-character elements. **Disambiguation edge case**: if a sapient being functions as a worldbuilding element rather than as a character with an arc — a god, an AI system, a hive mind, a corporate egregore — use `worldbuilding-entry`, not `character-bio`. Reserve `character-bio` for entities the story portrays as individual people with inner lives.
- Manifest updates beyond reflecting this character's tier. Use `manifest-sync` for a comprehensive refresh.
- Treatment updates. If the bio surfaces facts that should be in the treatment, capture them as decisions and let `treatment-update` fold them in.
- Fork a character into multiple files for different books. One character = one bio file, regardless of how dramatically they evolve. Per-Book Sub-Arcs handle within-bio evolution. The deeper "canon states" pattern (point-in-time snapshots per chapter) is out of POC scope.

## References

- `references/plan-first.md`
- `references/file-schemas.md` — bio file layout, frontmatter
- `references/canon-schemas.md` — per-section word budgets, sub-field guidance, Voice Fingerprint vectors, writing rules, worked example
- `references/frameworks.md` — McKee, Truby, Egri, Weiland, Enneagram, Voice Fingerprint, Thematic Posture
- `references/reading-discipline.md` — full-read rules, Zoom Selection
- `references/subagent-pattern.md` — **read when project is series mode or treatment is large** (per-book character-appearance reads dispatched in parallel)
- `references/series.md` — **read when `project_type: series`** (shared bios, per-book sub-arcs, Appears in field)
- `references/philosophy.md` — character and theme matter as much as plot
