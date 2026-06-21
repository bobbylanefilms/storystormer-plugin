---
name: decision-capture
description: Append a settled choice about the story to `decisions.md`. Use when the user has settled something the story now treats as true ("OK, Marlowe and Voss are siblings," "the story is in present tense first-person," "Act 2 ends with the locket reveal"), or asks to "log a decision," "record that," "save this choice," "add to the decision log." Captures one decision at a time with stable IDs and links to affected characters / questions / treatment.
---

# StoryStormer · Decision Capture

You are appending a decision to `decisions.md`. A decision is anything the story now treats as true — character facts, plot choices, structural moves, thematic commitments, voice/POV decisions, anything.

This skill is small and focused. It's typically called inline from `brainstorm-session` as decisions surface, but the user can also invoke it directly.

Always follow `references/plan-first.md` — confirm the wording with the user before locking it in, unless the user is dictating a decision word-for-word.

## What you do

### 1. Read what's there

Load `decisions.md` so you know the next ID. (If it doesn't exist yet, start at `D-001`.) Read the relevant active question in `questions.md` if this decision resolves one.

### 2. Compose the entry

Follow the schema in `references/file-schemas.md`. Fields:

- **ID** — next sequential, zero-padded (`D-019`).
- **Date** — today (ISO format `YYYY-MM-DD`).
- **Category** — one of: `character`, `plot`, `theme`, `setting`, `structure`, `voice`, `genre`, `mechanics`, `worldbuilding`.
- **Topic** — short noun phrase. *"Marlowe's relationship to Voss"*, *"the time loop's rules"*.
- **Summary** — one sentence. The decision in its most compressed form. *"Marlowe and Voss are estranged siblings, not strangers."*
- **Details** — 1–3 paragraphs of context. The *why* and the *texture*. What this means for character, plot, theme. Anything a future read should know to apply this decision correctly.
- **Affects** — what's downstream: characters, story locations, beats, themes. Don't try to be exhaustive — name the most directly impacted elements.
- **Source** — one of: `intake` (extracted at init), `brainstorm` (surfaced in conversation), `treatment-update` (clarified during a treatment refresh), `user-declared` (the user stated it directly).
- **Integrated into treatment** — default `no`. (Becomes `yes (<date>)` after the next `treatment-update` that includes this decision.)

### 3. Show the user before writing

Show the composed entry. Ask:

> Capturing this as `D-019`. Sound right?
>
> ```
> ## D-019 · 2026-05-11 · character
> **Topic**: Marlowe's relationship to Voss
> **Summary**: Marlowe and Voss are estranged siblings, not strangers.
> **Details**: …
> ```

If the user adjusts wording, fold in the changes. If they want details expanded, expand them. The user's voice should be visible in the decision text — these are *their* decisions, not yours.

### 4. Append, never overwrite

Append the entry to the end of `decisions.md`. Bump `state.md → What Exists → Decisions` count and adjust `unintegrated decisions` count.

### 5. Update related questions

If this decision resolves a question in `questions.md`:

- Set the question's `Status` to `resolved (D-019)`.
- Don't delete the question. The history matters.

If this decision *changes* (supersedes) an earlier decision:

- The earlier decision stays in `decisions.md` with a new `**Superseded by**: D-019` field.
- The new decision's `**Details**` should explicitly note what changed and why.

### 6. Report briefly

> Decision `D-019` captured. Updated `Q-019` to resolved. You now have 5 unintegrated decisions — want to refresh the treatment, or keep going?

## Capturing decisions during brainstorming

When `brainstorm-session` is running and a decision surfaces, you can be invoked inline. The pattern there is even lighter:

- The conversation has already established the decision; you just record it.
- You may not need to ask for confirmation on every field — *"capturing as D-019: Marlowe and Voss are estranged siblings. I'll keep brainstorming the implications now."* is enough for a clear-cut case.
- Use judgment. If the wording is fuzzy, confirm. If it's obvious, just log it.

## When to capture (be aggressive)

Lean toward capturing rather than deferring. Decisions that don't get logged tend to drift — the user remembers them differently next session, contradicts them in a later decision, or quietly forgets them when the treatment is regenerated. The log is the story's spine; keep it dense.

Trigger capture when:

- **A major story decision is confirmed** — a plot point resolved, a character detail established, a structural choice made.
- **A character's Lie, Ghost, or arc is established** — high-value decisions that inform every downstream Canon entry.
- **The thematic question, premise, or controlling idea is articulated** — foundational decisions that orient the whole story.
- **A new character is introduced with enough detail to matter** — name, role, and at least one distinguishing characteristic.
- **A worldbuilding element is introduced with rules** — especially magic systems, technology, or social structures with constraints. Rules become Consistency Constraints downstream.
- **A relationship dynamic is established** — how two characters relate, what drives their interaction, where the tension is.
- **A faction or alliance is defined** — membership, goals, internal tensions.
- **The user says "let's move on" or transitions between topics** — capture everything from the just-completed topic before it fades.
- **A chapter-anchored state change or reveal is settled** — *"Charlton is revealed as the architect in ch 35,"* *"Callie loses her left leg's mobility from ch 13 on."* Log the decision as normal — *and* propose adding a one-line **Revelation Log** entry to the affected character's or worldbuilding entry's Canon file, because the blueprint/prose stages read that log (filtered to `chapter ≤ N`) for scene-current state. Decisions are *why*; the Revelation Log is *when*. See `references/canon-schemas.md` § Revelation Log for the format. Append only on the user's go-ahead.

When in doubt, capture. A decision logged and later superseded is cheap (supersession is a first-class operation — see Step 5 above); a decision lost is expensive.

## When *not* to capture

- The user is *floating* an idea, not committing to it. *"What if Marlowe and Voss were siblings?"* is not a decision — it's a question for `questions.md`. Capture it as a question, not a decision.
- The decision is too small to log. *"OK, her name is Marlowe with one 'L' not two"* — sure, log it if it's likely to be referenced. *"OK, the diner has a red door"* — probably not, unless the red door is doing real narrative work.
- The user is brainstorming aloud and the "decision" might change in five minutes. Wait until it lands.

When in doubt, ask: *"Want me to log this as a decision, or hold off until it firms up?"*

## Multi-decision moments

Sometimes a single conversational moment produces three or four linked decisions. Capture them as separate entries with sequential IDs (`D-019`, `D-020`, `D-021`) and use the `**Affects**` field to cross-link them. Don't try to cram multiple decisions into one entry — the log becomes ungrep-able and the integration flags become muddled.

## Series Mode

If `state.md` shows `project_type: series`, read `references/series.md` first. In series mode, **every decision carries a `Scope` field** — either `series` (affects the arc or multiple books) or `book-<slug>` (affects one specific book). See `references/file-schemas.md` § Series-mode additions for the entry format.

The capture flow gains two steps in series mode:

1. **Determine scope.** Look at the decision content. If it's purely a per-book matter (Maya confronts her father in book 1 ch 35 — that's book 1's plot), use `Scope: book-<current_focus>`. If it affects the arc, plants a setup that pays off in a later book, or has implications for multiple books, use `Scope: series`. **When ambiguous, ask the user**: *"Is this just about book 1, or does it affect what books 2 and 3 do? I want to scope it right so we know which treatments to refresh."*

2. **For series-scoped decisions, list `Affects books`.** Name every book the decision touches, with the relevant act/chapter reference if known:

   ```markdown
   **Scope**: series
   **Affects books**: book-1 (ch 38 plants setup), book-3 (ch 22 pays off)
   ```

3. **For series-scoped decisions, expand `Integrated into` to a per-book breakdown:**

   ```markdown
   **Integrated into**:
   - book-1 treatment: no
   - book-3 treatment: no (book 3 not yet drafted)
   ```

   Each book's line updates independently as that book's `treatment-update` integrates the decision.

When in doubt about scope, default to the user's current focus — most decisions in a brainstorm session are about the book being discussed. Series scope is the exception, not the default, and should be deliberate.

For decisions that affect `series.md` itself (cross-book setup chains, continuity concerns, series arc shifts), flag in your report: *"D-024 affects the Cross-Book Setups and Payoffs section in series.md — recommend a series.md patch in the next brainstorm session."* This skill captures the decision but does not patch series.md.

## References

- `references/plan-first.md`
- `references/file-schemas.md` — decisions.md schema (including Series-mode additions)
- `references/canon-schemas.md` — § Revelation Log (a chapter-anchored reveal/state-change decision is also a Revelation Log candidate)
- `references/series.md` — **read when `project_type: series`** (scope, affects books, per-book integration tracking)
