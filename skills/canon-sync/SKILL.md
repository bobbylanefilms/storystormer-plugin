---
name: canon-sync
description: Reconcile what the manuscript has committed back into canon, over a span of chapters — the return path that keeps bios, worldbuilding, and the manifest describing the book that is actually on the page. Reads each chapter's `ch<NN>-notes.md` (not the prose), classifies what has accumulated (accretion, contradiction, drift, promotion, obsolescence), adjudicates contradictions by authorship, snapshots the full canon set, applies approved canon edits, and produces a manuscript fix list plus the list of Blueprints the canon changes invalidated. Logs every adjudication as a decision. Use when the user says "sync canon," "reconcile chapters 1–10," "catch canon up to the manuscript," or before blueprinting a new act (a precondition `blueprint` checks). Reconciles facts; never improves canon.
---

# StoryStormer · Canon Sync

You are running the second half of the pipeline's return path. `notes` extracts, per chapter, what the prose committed; it proposes and writes nothing. **Without this skill, notes is a queue with no consumer**: the proposals pile up as a growing list of shoulds, which is precisely the ledger failure the whole artifact model exists to prevent. Canon-sync integrates, per span.

Direction matters. `treatment-update` reconciles *downhill*: canon into the primer and treatment. Canon-sync runs *uphill*: prose facts into canon. They are sequential, not alternatives:

> `notes` (per chapter) → **`canon-sync`** (per span) → `manifest-sync` (reindex) → `treatment-update` (canon → primer and treatment)

**The boundary:** canon-sync **reconciles facts; it does not improve canon.** Rewriting a thin bio, deepening a worldbuilding entry, tightening the primer: those are `character-bio`, `worldbuilding-entry`, and `treatment-update`. If this skill starts making canon *better* rather than *accurate*, the author loses the ability to run it without reviewing everything it touched. Every edit it makes must be traceable to a specific line in a specific notes file.

Always follow `references/plan-first.md`: propose, confirm, execute. This is the only skill that edits many canon files in one run, which makes it the only one whose bad run is expensive.

## When to run

Event-driven, never calendar-driven:

- **Mandatory: before blueprinting a new act.** That is exactly when staleness does damage. `blueprint` checks for pending proposals in the prior act's notes and says so before proceeding.
- Before any `treatment-update`, or the treatment regenerates from stale canon.
- At act boundaries.
- When `state.md`'s unintegrated-proposal count crosses a threshold the author finds uncomfortable (a dozen is a reasonable default).

## Preconditions

- **Notes exist for the span.** Canon-sync reads `ch<NN>-notes.md`, not prose. Chapters in the span with no notes file, or with notes stale against their prose (`prose_version` behind the prose's `version`), are listed in the plan; recommend `notes` for them first, or proceed on the noted subset and say which chapters were skipped.
- **Canon exists.** `characters/`, `worldbuilding/`, `manifest.md`. A project with prose but no canon has nothing to reconcile into; recommend `character-bio` / `worldbuilding-entry` for the cast the harvest reveals.

## What you produce

- **Canon edits**, applied on approval: Revelation Log lines appended; accretion folded into the governing section of a bio or worldbuilding entry; obsolete lines removed or corrected; each touched file's `version` bumped. Promotions (a minor element that needs its own entry) are **recommended and routed** to `character-bio` / `worldbuilding-entry`, not written here.
- **A run record** at `.storystormer/canon-sync/<YYYY-MM-DD>-ch<NN>-<MM>.md`: the classified findings, every adjudication with its ruling and decision ID, the **manuscript fix list**, and the **invalidated Blueprints** list. This is the artifact the author works from afterward.
- **Decisions**, one per adjudication, appended via `decision-capture` with `Source: canon-sync`. A ruling that is not recorded is not a ruling; without this the next pass re-litigates the same conflict.
- **Snapshot** of the full canon set (`characters/`, `worldbuilding/`, `manifest.md`) to `.storystormer/history/<timestamp>-canon-sync/` **before applying anything**.
- **Notes proposals marked** in each `ch<NN>-notes.md` § Proposals: `applied (D-###)`, `declined (reason)`, or `routed (character-bio)`.
- Updates to `state.md`: unintegrated-proposal count reset to what remains; `What's Next` carries the fix list pointer and the Blueprints to rebuild; `Last Session` updated. Recommend `manifest-sync` and, if the accumulated changes touch the story frame, `treatment-update`.

## What to do

### 1. Determine the span

- *"Sync canon for Act 1," "reconcile chapters 1–10"* → that span.
- *"Sync canon," "catch canon up"* → every chapter with notes whose § Proposals has pending items, plus the drift scan across all noted chapters. Propose the span and confirm.
- Invoked as `blueprint`'s precondition → the prior act (or everything noted before the range about to be blueprinted).

### 2. Read context

In substantive mode (`references/reading-discipline.md`), full reads:

- Every `ch<NN>-notes.md` in the span: § Proposals, § Accidental Canon, § Divergences, § Harvest, § End State.
- Every canon entry any notes file references, in full, including its Revelation Log. **Read the entry, not the line**: drift is only visible against the whole bio.
- `manifest.md` (full), for what already has an entry and what the harvest says should.
- `decisions.md`, filtered to prior `canon-sync` rulings and to anything touching the contested facts, so settled conflicts are not re-opened.
- `primer.md` § 2 Reveal Architecture, for chain closures the notes proposed.
- The prose's `authorship` frontmatter for each chapter in the span (frontmatter only; the body stays closed).

**Drop into prose only to adjudicate a specific disputed point.** A ten-chapter span reads ten notes files rather than 35,000 words of fiction; that is what makes this cheap enough to run often, and it is the concrete payoff for having built `notes`. When a contradiction turns on exact wording, read that passage and quote it in the ruling.

A span of more than three or four chapters, or a cast of more than a handful of entries, is subagent work (`references/subagent-pattern.md`): one subagent per canon entry, each reading the entry in full plus every notes line that touches it, returning a classified list. Adjudication and writing stay in the main session, where the author is.

### 3. Classify

Five categories accumulate, and they need different handling:

| Category | What it is | Default handling |
|---|---|---|
| **Accretion** | Prose committed details canon does not have | Absorb |
| **Contradiction** | Prose says something canon denies | Adjudicate (§ 4) |
| **Drift** | No single wrong line, but the character as written has diverged from the character as specified | Surface; author rules |
| **Promotion** | A minor element has grown into a real presence and needs an entry | Recommend and route |
| **Obsolescence** | Canon the manuscript quietly abandoned | Flag for removal |

**Drift is why this is a span pass rather than continuous integration.** A bio says a character never explains himself; by chapter 9 he has explained himself twice a chapter. No individual line is wrong. Only the aggregate is, and the aggregate is invisible at chapter scale. Look for it deliberately: for each POV and Major character in the span, compare the bio's Voice Fingerprint, never-says, tells, and psychology against the pattern across the span's as-written synopses and divergence lists, and name the divergence in one sentence with the chapters that show it. Drift is never absorbed by default; the author decides whether the bio follows the page or the page gets fixed.

### 4. Adjudicate contradictions, authorship-sensitive

The instinct is *the manuscript wins*. But if the manuscript always wins, an unrevised prose agent's drift becomes canon and model error is laundered into the story bible. So:

- **`author-written` or `ai-generated-author-revised` prose → the manuscript wins by default.** The author made a choice on the page; canon follows.
- **Unrevised `ai-generated` prose → canon wins by default.** The model deviated. That is a defect, not a decision.

Defaults are defaults. **Every contradiction is still surfaced**, with the canon line, the page's line (quoted from the prose if wording matters), the default ruling and why, and the author can rule either way. A prior `canon-sync` decision on the same fact is applied without re-litigating and noted as such.

**Two outputs per ruling, not one.** If canon wins, the chapter's prose is now wrong at that point and goes on the **manuscript fix list** (chapter, the passage, what it must say). If the manuscript wins, canon changes, and every Blueprint built against the prior version of that entry is stale; the version stamps make that detectable, so the ruling adds those chapters to the **invalidated Blueprints** list. A pass that edits only canon leaves the book inconsistent with its bible in the other direction.

### 5. Propose the plan, then the findings

Plan first:

> Canon-sync for ch 1–6 (Act 1). All six have current notes; 14 pending proposals across them. I'll full-read the 5 bios and 4 worldbuilding entries the notes touch, plus the manifest and prior canon-sync decisions (none yet). Snapshot the canon set to `.storystormer/history/` before writing anything. Expect roughly: 8 accretions, 2 contradictions (both in `ai-generated` prose, so canon wins by default), 1 drift candidate (Vinnie's register), 2 promotions to route, 1 obsolete line. Findings next, nothing applied until you rule.

Then the classified findings, one approve-or-rule list:

> **Accretion (absorb unless you object)**
> 1. Muppy · Revelation Log · Ch 1 — awn in the webbing of a forepaw, still in at chapter's end. (notes ch 1)
> 2. The Hartley property · mudroom floor is tile, cold underfoot; found objects go there. (notes ch 1, ch 4)
>
> **Contradiction (ruling needed)**
> 3. `vinnie.md` says he gave up cigarettes fifteen years ago. Ch 5 prose (`ai-generated`, unrevised) has him lighting one. **Default: canon wins.** Fix list: ch 5, the grave-edge beat, remove the cigarette or move it to Tommy.
> 4. `burial-site.md` places the grave fifty yards below the rise. Ch 1 prose (`author-written`) has it at thirty. **Default: manuscript wins.** Canon edit: `burial-site.md` → thirty yards; invalidates ch 1 and ch 3 Blueprints.
>
> **Drift (you rule)**
> 5. `vinnie.md`: never says *why*, explains how. Across ch 1, 3, 5 he gives a reason four times. Either the bio loosens or those lines tighten.
>
> **Promotion (routed)**
> 6. The Wagon Wheel (bar) appears in ch 1, 5, 6 with consistent detail and no entry → `worldbuilding-entry`.
>
> **Obsolescence (remove unless you object)**
> 7. `golden-valley.md` still says traffic is rare after midnight; three chapters establish teenagers out there nightly.

### 6. Snapshot, apply, log, record

After the author rules:

1. **Snapshot** `characters/`, `worldbuilding/`, and `manifest.md` to `.storystormer/history/<YYYY-MM-DDTHH-MM>-canon-sync/`, preserving relative paths. This happens before the first edit, no exceptions.
2. **Apply canon edits**: append Revelation Log lines (`- **Ch N** — …`); fold accretion into the governing section with the smallest edit that makes the entry accurate; correct or remove obsolete lines; bump each touched file's `version` and `last_updated`. Never restyle, expand, or tidy anything the ruling didn't name.
3. **Log each adjudication** via `decision-capture`: `Source: canon-sync`, `Category` per the fact, `Summary` stating the ruling, `Details` naming the notes line, the canon line, the authorship that set the default, and whether the author overrode it. Accretions absorbed without dispute do not need a decision; contradictions, drift rulings, and obsolescence removals do.
4. **Mark proposals** in each notes file's § Proposals.
5. **Write the run record** to `.storystormer/canon-sync/<date>-ch<NN>-<MM>.md`: findings by category with outcomes; the manuscript fix list (chapter · passage · required change); invalidated Blueprints (chapter · entry that changed · version stamp it was built against); promotions routed; chain closures struck from §2 (logged as decisions so `treatment-update` preserves the strike).
6. **Update `state.md`** and report.

> Canon-sync complete for ch 1–6. Snapshot at `.storystormer/history/2026-08-22T10-14-canon-sync/`. Applied: 8 accretions, 1 obsolete line removed, 2 contradictions ruled (D-041, D-042), 1 drift ruling (D-043: bio loosens). Routed: Wagon Wheel → `worldbuilding-entry`. **Fix list (2 items)** and **Blueprints to rebuild (ch 1, 3)** in `.storystormer/canon-sync/2026-08-22-ch01-06.md`. 0 proposals pending. Next: `manifest-sync`, then rebuild the two Blueprints before writing ch 7; `treatment-update` when convenient, since the burial-site change touches the treatment's staging.

## Series Mode

If `state.md` shows `project_type: series`, read `references/series.md` first. Notes are book-local; canon is shared at the series root. Revelation Log lines are book-qualified (`Ch B2-07`). A contradiction between this book's page and a fact another book's prose already established is surfaced with both chapters cited and is not ruled by default; the author decides which book bends. Chain closures that span books strike from `series.md` as well as primer §2.

## What this skill does not do

- **Improve canon.** No deepening, restyling, or tidying beyond the named fact. Thin entries are `character-bio` / `worldbuilding-entry` work.
- **Edit prose.** The fix list is the author's, applied through `prose` revise mode.
- **Rebuild Blueprints.** It lists them; `blueprint` rebuilds.
- **Read prose wholesale.** Notes are the input; prose is opened only at a disputed passage.
- **Regenerate the primer or treatment.** It recommends `treatment-update` when the changes warrant it.
- **Run without a snapshot.** Ever.

## References

- `references/file-schemas.md`: § Notes (§ Proposals statuses), § `.storystormer/history/`, § `.storystormer/canon-sync/`, `decisions.md` (the `canon-sync` source), primer §2 Reveal Architecture
- `references/canon-schemas.md`: § Revelation Log, bio and worldbuilding content shape
- `references/plan-first.md`, `references/reading-discipline.md`, `references/subagent-pattern.md`
- `references/series.md`: read when `project_type: series`
