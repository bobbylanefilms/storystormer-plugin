<!-- ABOUTME: Genre handling — recognition, on-demand research, surfacing heuristics -->
<!-- ABOUTME: The headline differentiator vs. generic AI writing tools is timely genre knowledge -->

# Genre Handling

Surfacing genre-specific obligatory scenes, tropes, and pitfalls at the right moment is the single biggest value-add this plugin offers over a generic chat conversation. This file documents how to do it.

## Recognition

- Watch for genre keywords in the user's description and any intake materials.
- If ambiguous, ask explicitly: *"Is this closer to a literary thriller or a procedural mystery?"* with 2–3 options.
- Allow hybrid declarations (*"literary thriller with a romance subplot"*).
- Capture in `state.md` → `genre` + `genre_secondary` fields, and in `.storystormer/config.json`.

## On-demand research

On genre confirmation, if `.storystormer/genre-reference.md` doesn't already cover this genre, run a WebSearch pass for:

- *"obligatory scenes in [genre]"* — Story Grid / Save the Cat conventions.
- *"common tropes in [genre]"* — what readers expect, what's been done.
- *"common pitfalls in [genre]"* — what tends to make stories in this genre fail.
- **Subgenre-specific research** for subgenres with known craft problems:
  - **Time-travel** → paradoxes (grandfather, bootstrap, predestination), butterfly effect, rules-of-time-travel consistency.
  - **Locked-room mystery** → fair-play conventions, least-likely-suspect reveals.
  - **Cozy mystery** → amateur sleuth conventions, stakes calibration, "the butler did it" exhaustion.
  - **Hard sci-fi** → scientific plausibility, exposition handling, big-idea grounding.
  - **Portal fantasy** → portal mechanics, returning-home tropes.
  - **Romance** → meet cute, dark moment, grand gesture, instalove pitfalls, third-act conflict authenticity.
  - **Heist** → crew chemistry, mark sympathy, the double-cross beat.
  - **Political thriller** → competence ceilings, plausible institutional behavior, "secret cabal" pitfalls.
  - **Legal drama** → procedural accuracy, courtroom-moment authenticity, the "objection!" cliché.

Synthesize into `.storystormer/genre-reference.md` with these sections:

```markdown
# [Genre] reference

**Synthesized**: 2026-05-11
**Sources**: [URL], [URL], [URL]

## Obligatory scenes
- [Scene]: [why it's expected, how it's typically done]

## Core tropes
- [Trope]: [what it is, when it works, when it's tired]

## Common pitfalls
- [Pitfall]: [why it kills stories]

## Subgenre notes (if applicable)
- [Subgenre]: [specific craft problems]

## Hybrid notes (if applicable)
- [Primary]/[Secondary] tension: [where the conventions conflict]
```

**Don't fabricate URLs.** Only include sources you actually fetched. If WebSearch is unavailable, say so explicitly and defer.

## Surfacing heuristics

When to pull from `genre-reference.md` and surface to the user:

- **Structural milestones** — when discussing major plot beats, check the treatment against the genre's obligatory scenes; flag any gaps.
- **User friction signals** — phrases like *"I'm stuck,"* *"I don't know how to handle,"* *"what do I do with,"* *"this isn't working"* → pull 2–3 relevant tropes/patterns and offer them as options.
- **Pitfall proximity** — when a decision touches a known pitfall (e.g., *"protagonist goes back and kills young Hitler"* → grandfather paradox; *"the butler did it"* in a cozy → stale trope), surface the pitfall with a brief note and options.
- **Ending planning** — obligatory-ending-scene check for the declared genre (e.g., the killer confronted in a mystery, the romantic reunion in romance, the truth-revealed scene in a thriller).

## Tone

Surface as *"One convention worth knowing: X. Does your story want to honor, subvert, or ignore it?"* rather than *"You must include X."* You are surfacing options, not enforcing rules.

## User control

`state.md` → `surfacing_mode`:

- `active` (default) — surface proactively at the moments above.
- `on-request` — only surface when the user asks.

If the user signals the surfacing is intrusive (*"stop telling me about tropes,"* *"I don't want genre advice"*), switch to `on-request` and confirm.

## Hybrid genres

Handle hybrids by storing both genres in `state.md` and synthesizing genre-reference.md with sections for **each** parent genre plus a **Hybrid notes** section for tensions. Example: a literary thriller's "ambiguity is OK" expectation tensions against a thriller's "clarity at climax" expectation.
