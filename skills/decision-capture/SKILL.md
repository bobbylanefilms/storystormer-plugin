---
name: decision-capture
description: Record a settled choice about the story as a new decision entry in `decisions/`. Use when the user has settled something the story now treats as true ("OK, Marlowe and Voss are siblings," "the story is in present tense first-person," "Act 2 ends with the locket reveal"), or asks to "log a decision," "record that," "save this choice," "add to the decisions." Captures one decision at a time with stable IDs and links to affected characters / questions / treatment.
---

# StoryStormer · Decision Capture

You are recording a decision as a new entry, `decisions/D-###.md`. A decision is anything the story now treats as true — character facts, plot choices, structural moves, thematic commitments, voice/POV decisions, anything.

This skill is small and focused. It's typically called inline from `brainstorm-session` as decisions surface, but the user can also invoke it directly.

Always follow `references/plan-first.md` — confirm the wording with the user before locking it in, unless the user is dictating a decision word-for-word.

## What you do

### 1. Read what's there

Read `decisions/_index.md`: it is the overview, enough to propose the next ID and to spot an earlier decision this one might supersede. Read only the entries that matter here: the one being superseded, and the question entry this decision resolves (find it in `questions/_index.md`). Never read the whole collection to log one decision.

### 2. Compose the entry

Follow `references/file-schemas.md` § `decisions/`. The frontmatter:

- **`id`** — the next number after the highest in the index, zero-padded (`D-019`). A proposal: the store assigns the number (step 4).
- **`date`** — today (ISO format `YYYY-MM-DD`).
- **`type`** — one of the app's five: `plot`, `character`, `worldbuilding`, `structure`, `theme`. Setting and speculative-mechanism rules are `worldbuilding`; voice, POV, tone, and genre choices are `theme` (`references/file-schemas.md` § `decisions/` maps the retired types).
- **`topic`** — short noun phrase. *"Marlowe's relationship to Voss"*, *"the time loop's rules"*. It is the label the index lists. A `canon-sync` ruling's topic is always `Canon ruling: <subject>` (*"Canon ruling: Vinnie's cigarettes"*), so later runs find prior rulings from the index alone.
- **`source`** — one of: `intake` (extracted at init), `brainstorm` (surfaced in conversation), `treatment-update` (clarified during a treatment refresh), `canon-sync` (a ruling on a manuscript-versus-canon conflict; the topic takes the `Canon ruling:` form above, and the Details name the notes line, the canon line, the prose authorship that set the default, and whether the author overrode it), `user-declared` (the user stated it directly).
- **`integrated`** — `"no"`. (Becomes `"yes (<date>)"` after the next `treatment-update` that includes this decision.) In a series it is always the per-book list, a one-item list for a `book-<slug>` scope (§ Series Mode below).
- **`storystormer_project`** — the root `state.md`’s `slug`; **`storystormer_kind`** — `decision`.

The body:

- **Summary** — one sentence. The decision in its most compressed form. *"Marlowe and Voss are estranged siblings, not strangers."*
- **Details** — 1–3 paragraphs of context. The *why* and the *texture*. What this means for character, plot, theme. Anything a future read should know to apply this decision correctly.
- **Affects** — what's downstream: characters, story locations, beats, themes. Don't try to be exhaustive — name the most directly impacted elements.

### 3. Show the user before writing

Show the composed entry. Ask:

> Capturing this as `D-019`. Sound right?
>
> ```
> type: character · topic: Marlowe's relationship to Voss
>
> **Summary**: Marlowe and Voss are estranged siblings, not strangers.
> **Details**: …
> ```

If the user adjusts wording, fold in the changes. If they want details expanded, expand them. The user's voice should be visible in the decision text — these are *their* decisions, not yours.

### 4. Create the entry, never overwrite

The writes go in this order:

1. **The journal entry:** created now with `new` if this is the session’s first write (`references/file-schemas.md` § `journal/`); otherwise the session’s existing entry is the one extended below. It doesn’t name the decision yet: the number isn’t known until step 2.
2. **The decision entry and its index row:** the store numbers from the folder listing, so run the index’s cheap check against that listing first (`references/file-schemas.md` § Who rebuilds an index) and propose from whichever is higher; write the entry with `store.write(decisions/D-###.md, content, new)`. The ID you proposed is provisional: the store assigns the number and reports it (`references/store.md` § New entries), and from then on that reported ID is the decision’s ID, in the confirmation line, the index row, a question’s `resolved_by`, an earlier entry’s `superseded_by`, the journal, and every other cross-reference. Then add the decision’s one row to `decisions/_index.md` (`references/file-schemas.md` § Who rebuilds an index; a store that computes the index keeps it itself).
3. **The journal line:** extend the journal entry with the reported ID in its `decisions` list and a line on what was settled. (This follows the entry only because the line carries the number the store assigned.) If the journal already names this decision by its proposed number (it was created citing it, or a step composed the line before the write), this same edit corrects every such mention to the reported ID (`references/file-schemas.md` § `journal/`, IDs as the store reported them).
4. **`state.md`:** bump `What Exists → Decisions` count and adjust the unintegrated count (a store that computes `state.md` keeps the counts itself).

Step 5's question and supersession edits land between 2 and 4, each entry with its index row.

### 5. Update related questions

If the conversation surfaced a new open question rather than a decision, create it as a question entry (`questions/Q-###.md`, written with `new`, per § `questions/`: a 3–7 word `title`, one of the seven Title Case categories, `source: plugin`; in a series, `scope` and `affects_books` per `references/series.md` § Scoping decisions and questions) and add its row to `questions/_index.md`.

If this decision resolves a question:

- In one edit of the question entry: set `status: resolved` and `resolved_by` to the decision's ID, add a `**Resolution**:` line saying how, and update or remove any old `**Status**:` body line it carries so the two agree (`references/file-schemas.md` § Entry collections, frontmatter is authoritative). Then replace its row in `questions/_index.md`.
- Don't delete the question. The history matters.

If this decision *changes* (supersedes) an earlier decision:

- The earlier entry stays, with `superseded_by` set to the new ID in its frontmatter and its index row updated to match.
- The new decision's `**Details**` should explicitly note what changed and why.

### 6. Report briefly

> Decision `D-019` captured. Updated `Q-019` to resolved. You now have 5 unintegrated decisions — want to refresh the treatment, or keep going?

## Capturing decisions during brainstorming

When `brainstorm-session` is running and a decision surfaces, you can be invoked inline. The pattern there is even lighter:

- The conversation has already established the decision; you just record it.
- You may not need to ask for confirmation on every field — *"capturing as D-019: Marlowe and Voss are estranged siblings. I'll keep brainstorming the implications now."* is enough for a clear-cut case.
- Use judgment. If the wording is fuzzy, confirm. If it's obvious, just log it.

## When to capture (be aggressive)

Lean toward capturing rather than deferring. Decisions that don't get logged tend to drift — the user remembers them differently next session, contradicts them in a later decision, or quietly forgets them when the treatment is regenerated. The decisions are the story's spine; keep them dense.

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

- The user is *floating* an idea, not committing to it. *"What if Marlowe and Voss were siblings?"* is not a decision — it's an open question. Capture it as a question entry, not a decision.
- The decision is too small to log. *"OK, her name is Marlowe with one 'L' not two"* — sure, log it if it's likely to be referenced. *"OK, the diner has a red door"* — probably not, unless the red door is doing real narrative work.
- The user is brainstorming aloud and the "decision" might change in five minutes. Wait until it lands.

When in doubt, ask: *"Want me to log this as a decision, or hold off until it firms up?"*

## Multi-decision moments

Sometimes a single conversational moment produces three or four linked decisions. Capture them as separate entries, one `new` write each (`D-019`, `D-020`, `D-021`, or whatever the store reports), and use the `**Affects**` field to cross-link them. Don't try to cram multiple decisions into one entry — the index stops saying what was decided and the integration flags become muddled.

## Series Mode

If `state.md` shows `project_type: series`, read `references/series.md` first. In series mode, **every decision carries a `scope` field** — either `series` (affects the arc or multiple books) or `book-<slug>` (affects one specific book). See `references/file-schemas.md` § `decisions/` → Series mode for the entry format; the index gains a Scope column.

Session bookkeeping goes to the root: the book's `state.md` takes its Summary, What Exists, What's Next and Last Session, and the root `state.md` takes `session_count` and `last_session` (`references/series.md` § Series-level `state.md` vs per-book `state.md`).

The capture flow gains three steps in series mode:

1. **Determine scope.** Look at the decision content. If it's purely a per-book matter (Maya confronts her father in book 1 ch 35 — that's book 1's plot), use `scope: book-<slug>`, where `<slug>` is the focused book's entry in the root `state.md`’s `books` list (a slug that already starts with `book-`, such as `book-1`, is written as it is: `scope: book-1`, never `book-book-1`). If it affects the arc, plants a setup that pays off in a later book, or has implications for multiple books, use `scope: series`. **When ambiguous, ask the user**: *"Is this just about book 1, or does it affect what books 2 and 3 do? I want to scope it right so we know which treatments to refresh."*

2. **For series-scoped decisions, list `affects_books`.** Name every book the decision touches, with the relevant act/chapter reference if known:

   ```yaml
   scope: series
   affects_books: [book-1 (ch 38 plants setup), book-3 (ch 22 pays off)]
   ```

3. **Make `integrated` a per-book list, whatever the scope:** one item per book in `affects_books` for a `series` scope, and one item for a `book-<slug>` scope:

   ```yaml
   # scope: series
   integrated:
     - book-1 treatment no
     - book-3 treatment no (book 3 not yet drafted)

   # scope: book-1
   integrated:
     - book-1 treatment no
   ```

   Each book's item updates independently as that book's `treatment-update` integrates the decision.

A question this skill creates in a series carries `scope` and `affects_books` the same way (`references/series.md` § Scoping decisions and questions).

When in doubt about scope, default to the user's current focus — most decisions in a brainstorm session are about the book being discussed. Series scope is the exception, not the default, and should be deliberate.

For decisions that affect `series.md` itself (cross-book setup chains, continuity concerns, series arc shifts), flag in your report: *"D-024 affects the Cross-Book Setups and Payoffs section in series.md — recommend a series.md patch in the next brainstorm session."* This skill captures the decision but does not patch series.md.

## References

- `references/plan-first.md`
- `references/file-schemas.md` — § `decisions/` and § `decisions/_index.md` (series mode included), § Who rebuilds an index, § `journal/`
- `references/store.md` — § New entries (the store assigns and reports the number)
- `references/canon-schemas.md` — § Revelation Log (a chapter-anchored reveal/state-change decision is also a Revelation Log candidate)
- `references/series.md` — **read when `project_type: series`** (scope, affects books, per-book integration tracking)
