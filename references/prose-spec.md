<!-- ABOUTME: The prose-generation contract — assembly order, voice model, POV/tense rules, output rules -->
<!-- ABOUTME: The "how to operate" prompt for writing a chapter's prose; cited by the prose skill and its generation subagent -->

# Prose Spec

This is the **prose-generation prompt** — the operational scaffolding that runs the prose stage. It is **voice-neutral by design**: it says *how to operate* (assembly order, POV/tense discipline, output shape, the spoiler firewall), not *how the book should sound*. The voice comes from three project-owned inputs (the writing sample, the style guide, and the prior POV chapter), described below.

The `prose` skill operates the workflow; this file is the contract its generation subagent works from. The full rationale for every ordering decision lives in the StoryStormer app's architecture reference (`plan/_architecture/prose-context-assembly.md`); this is the folder-native distillation.

---

## The two jobs

Prose generation has exactly two jobs, and everything in the assembly serves one of them:

1. **Voice** — the output must sound like *this author's* book. This is a *generation-conditioning* problem, solved by exemplar prose at the boundaries of the prompt (the writing sample near the top, the prior POV chapter at the very end).
2. **Fidelity** — the output must execute *this chapter* correctly: the right beats, the right characters in their current state, no continuity breaks, no future spoilers. This is a *reference + task* problem, solved by the outline (what happens) and the Blueprint/canon layer (who, where, how it should feel).

---

## The two paths

The single most important rule:

> **When a chapter has a Blueprint, the Blueprint *replaces* the raw canon entries — it does not supplement them.**

The Blueprint already consolidated the Canon this chapter needs — every surfacing character and element at the resolution its prominence earns, canonical facts fused with current-state continuity — and harvested the primer's story-level frame into its Story Context section. Loading the Blueprint *and* the full bios is redundant by construction.

- **Blueprint present → lean path.** The `ch<NN>-blueprint.md` stands in for character bios + worldbuilding entries + the primer entirely. The treatment stays out (future-plot spoilers).
- **Blueprint absent → fallback path.** Raw character bios (POV-first) + worldbuilding entries the chapter touches + the **primer** (for thematic/relationship framing). The **treatment stays out** on this path too — it contains future plot.

The Blueprint path is the intended one and produces tighter prose (higher signal-to-noise). The fallback exists so prose is still possible if a chapter wasn't blueprinted — but recommend blueprinting first.

---

## Assembly order — the target shape

Read the inputs in this order. The order matters for two reasons: **voice conditioning** (the most recently read prose biases the next-token distribution — so the prior POV chapter goes *last*, the writing sample goes *first*), and **task recency** (the outline near the end keeps "what to write" in active attention). Read stable-to-variable, top-to-bottom.

### Behavioral frame (read/assert first — highest attention)

- **Agent identity** — a prose-generation specialist transforming an outline into polished, publishable fiction.
- **POV type + tense** (resolved before assembly — see below), with the POV-specific rules.
- **Output rules** (below).
- **Continuation framing:** the prior prose is a *voice reference*, not text to continue mid-sentence. The output is a complete, self-contained chapter that begins where the outline says.
- **Spoiler firewall** (below).
- **Surgical-edit directives** — only in revise mode (below).

### Content (stable prefix → variable tail)

```
STABLE PREFIX  (changes rarely)
  1. Writing sample            ← PRIMACY: the voice north star
  2. Style guide (optional)     ← author-specific craft rules
  3. This prose spec            ← how to operate (the task contract)
  4. Project metadata + position ← genre, logline, where we are in the book
  5. Story so far (chapter synopses) ← narrative memory, chronological, prior-only

VARIABLE TAIL  (per-chapter → recency zone)
  6a. Blueprint   ──┐  PRESENT → consolidated canon + continuity + story context
  6b. Canon bios  ──┘  ABSENT  → fallback: bios + worldbuilding + primer
  7. Chapter outline           ← PENULTIMATE: the task (what happens)
  8. Prior POV-matched prose    ← FINAL: the voice anchor

  + final trigger ("Write the prose for this chapter now.")
```

**The Blueprint and the outline are a pair** in the task zone: the Blueprint answers *who / where / current-state / how it should feel*; the outline answers *what happens*. The outline gets the penultimate slot (structural recency); the prior prose gets the last slot (stylistic recency) — structural fidelity is easier for the model to honor than voice, so the strongest position is spent on voice.

---

## The three-input voice model + precedence

Voice comes from three project-owned inputs, split by ownership: **the app owns how to operate; the user owns how it should read; the author's hand owns the target voice.**

| Input | Owner | Lives at | Conveys |
|---|---|---|---|
| **Prose spec** (this file) | plugin | `references/prose-spec.md` | *how to operate* (voice-neutral) |
| **Style guide** | user (optional) | `voice/style-guide.md` | *how it should read* — craft rules, anti-patterns |
| **Writing sample** | author (strongly recommended) | `voice/writing-sample.md` | *what the voice is, by example* |

None is sufficient alone: a **sample** shows what the voice sounds like but can't teach avoidance ("never write 'a breath he didn't know he was holding'") or frequency targets; a **style guide** states rules but can't convey rhythm; the **spec** keeps execution correct but is voice-neutral so it's shared across projects. Read together at the top, they reinforce.

### The precedence rule

The writing sample and the prior POV chapter are **not ruling on the same question** — so the authority split is explicit:

| Question | Authority |
|---|---|
| How should the voice sound? | **Writing sample** → then style guide → then this spec |
| What just happened / current state / momentum? | **Prior POV chapter prose** |
| What happens in this chapter? | **Outline** (+ Blueprint) |

When the prior chapter's prose diverges *stylistically* from the sample, **the sample wins** — it is the style authority. The prior chapter is the **continuity authority** only. This is why both are kept: once their authority is non-overlapping, they stop being redundant. (It also prevents *drift*: the prior chapter is likely AI-generated, and if it were the sole voice anchor the model would imitate its own output and drift would compound chapter-over-chapter. The human sample is a fixed point that re-grounds every generation.)

---

## POV rules

Resolve POV from the chapter outline's `pov` (and the project/structure POV strategy) before assembling. Assert the matching rule in the behavioral frame.

- **Third-person limited** — access ONLY the POV character's interior (thoughts, feelings, sensory perception). All others are external observation only — body language, dialogue, action. Never reveal a non-POV character's interior. The narrative lens is filtered through the POV character's vocabulary and worldview. Psychic distance tightens during high emotion, widens slightly in action.
- **Third-person objective (camera eye)** — NO interior access for anyone. Only what a camera captures. Emotion is conveyed entirely through external signal. Don't editorialize.
- **Third-person omniscient** — multiple characters' interiors accessible, but deployed strategically; no head-hopping within a paragraph — transition at natural beats. The narrator may know what characters don't (dramatic irony).
- **First person** — "I" throughout; voice reflects the character's personality, education, speech patterns. They report only what they perceive; other characters' motives are inferred and can be wrong.
- **Second person** — "you" as protagonist; immediacy and complicity; stay consistent, don't slip person.

## Tense

- **Past** (most common) — "she walked, he said." Don't drift to present except in dialogue.
- **Present** — "she walks, he says." Immediacy; don't drift to past except in marked flashback.
- **Future** — "she will walk." Rare, prophetic; use deliberately.

## Output rules

- **Prose only.** No markdown formatting, no headers, no bold/italic markers, no chapter titles, no scene numbers, no structural labels.
- **No meta-commentary** — no author's notes, no explanation of craft choices.
- **Bracketed instructions** in the outline/Blueprint (e.g. `[describe the setting]`) are *guidance* — execute them naturally in prose, never reproduce the brackets.
- **Scene breaks** within the chapter use a single blank line. Paragraphs separated by a single blank line. Dialogue uses standard quotation marks; attribution follows natural patterns.
- **A complete, self-contained chapter** that begins where the outline says and ends where the outline's beats end — don't continue past the chapter's scope, don't conclude the story.
- **Match the language variant** if the project specifies one (British English, etc.).

## The spoiler firewall (non-negotiable)

The model must never know what it hasn't written.

- **Read only prior chapters.** Story-so-far is prior chapter synopses *only*; prior prose is a *prior* chapter only. Never read a chapter numbered after the one being written — not its outline, not its prose, not its synopsis.
- **The treatment stays out** of prose-time context on *both* paths — it contains future plot.
- **Never write toward a not-yet-landed reveal.** The Blueprint already filtered canon to `chapter ≤ N` (via the Revelation Log); honor that. Don't foreshadow a specific future event the prose at this point couldn't know.

---

## The synopsis the prose step emits

After writing a chapter's prose, write a **~150–250-word synopsis** of it (stored in the prose file's `synopsis` frontmatter — see `references/file-schemas.md` § `ch<NN>-prose.md`). This is *not* a teaser: written as the author of the chapter, it captures the causal events, the reveals, who learned what, and how the story's state changed by the chapter's end — exactly what a continuity-aware reader of a later chapter needs. Name characters, locations, events; don't narrate vibes or restate the title. This synopsis is what later chapters read as their story-so-far, so its accuracy compounds.

---

## Surgical edit mode (revise)

When revising existing prose rather than generating from scratch:

- The **current** chapter prose goes in the **final position** — it is both the content to edit and the voice anchor. Prior-chapter prose is dropped.
- An **editorial notes** block (the change instructions) is appended after it.
- Assert: *"Apply ONLY the changes named in the editorial notes. Preserve everything else exactly — voice, pacing, structure, word choices. Minimize collateral changes; if a change requires adjusting a surrounding sentence for flow, do so minimally. Return the complete chapter prose with the edit applied."*
