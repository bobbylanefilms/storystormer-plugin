---
name: pre-outline-session
description: Run the conversation that commits a story to a chapter structure — pick the structural framework, lock the act boundaries, and map the treatment's scenes onto a numbered chapter spine. Use when the user says "let's outline the story," "set up the chapter structure," "map the treatment to chapters," "how many chapters should this be," "decide the act breaks," "build the outline scaffold," or otherwise signals they're ready to move from prose-shaped treatment to chapter-shaped outline. Produces `outline/structure.md` — the contract that `outline-chapters` then fulfills chapter by chapter.
---

# StoryStormer · Pre-Outline Session

You are running the conversation that turns a treatment into a *chapter-structured* plan. The treatment is scene-based — evocative scene headings, no chapter assignments. The outline is chapter-based — a numbered sequence with target word counts, beat positions, POV assignments. The translation between them is what this skill does.

The output is **`outline/structure.md`** — a structural commitment document with a numbered Chapter Spine. This is the *contract* that downstream `outline-chapters` calls will fulfill. Get the spine right here and the chapter outlines flow cleanly; get it wrong and you're re-mapping mid-outline.

This is a *conversational* skill, not a generator. The model proposes, the user reacts, and the structure crystallizes through dialogue. It mirrors the StoryStormer web app's pre-outline pipeline (Story Architect prompt) but runs as a chat-driven session rather than a one-shot generation.

Always follow `references/plan-first.md` — propose what you intend to focus on, get confirmation, then dive in.

## What you produce

- **`outline/structure.md`** — at version 1 for first-run, bumped on subsequent revisions. Contains the framework choice, the act structure table, POV strategy, pacing notes, the numbered Chapter Spine, and a list of open structural questions blocking specific spine slots. See `references/file-schemas.md` § `outline/structure.md` for the full schema.
- **`outline/_index.md`** — stub version, regenerated from the Chapter Spine. Every spine slot appears as `*(not yet outlined)*` until `outline-chapters` runs.
- Updates to `decisions.md` — every structural commitment that wasn't already a logged decision gets captured (e.g., *"D-031: Save the Cat as the structural framework"*; *"D-032: 40-chapter target, three-act split 10/20/10"*).
- Updates to `questions.md` — any structural gaps that surface during the conversation get logged as critical/important questions (e.g., *"Q-024: Does the midpoint shift fall in ch 18 or ch 20?"*).
- Updates to `state.md` — `What Exists → Structure` line added, `stage` advanced to `outlining` (or `outline-drafted` if the spine covers all chapters with no critical gaps).
- Snapshot to `.storystormer/history/<timestamp>-pre-outline/` if an existing `structure.md` is being replaced.

## When this skill fires

The natural entry points:

- **Treatment is refined, major bios exist, manifest is current** — the project is structurally ready, the user wants to commit to chapters. This is the canonical case.
- **User brought in pre-existing chapter outlines, beat sheets, or scene lists** at intake and `storystormer-init` flagged them. Pre-outline maps them into `outline/structure.md` shape.
- **User wants to revise an existing structure** — change the chapter count, swap frameworks, shift act boundaries. This re-opens `structure.md` and re-derives the spine.

Decline (or push back) when:

- **Treatment is thin or unstable.** If the treatment has more than 3 `[OPEN: Q-###]` or `[NEEDS DEVELOPMENT]` markers that affect structure (act break locations, midpoint mechanism, climax shape), suggest a brainstorming session to resolve those first. The spine you'd commit to is built on sand.
- **Primer Section 3 (Structural Framework) hasn't been populated.** Run `treatment-update` first — the Treatment Word Budget table in Section 3 is what calibrates per-chapter density.
- **Major bios for POV characters don't exist.** A multi-POV chapter assignment needs to know who carries each chapter's voice. Without bios for POV holders, the spine is guessing.

Surface those preconditions in your plan-first proposal, not as a refusal — *"Before we commit to a chapter structure, I'd want the midpoint shift question resolved (Q-014 in the treatment). Want to brainstorm Q-014 first and then come back to this, or push through with the midpoint marked as TBD in the spine?"*

## What to do

### 1. Pre-flight read

Load:

- `primer.md` (full — especially Section 3 Structural Framework and Section 5 Setup/Payoff Ledger)
- `treatment.md` (full — every scene, every act header, every marker)
- `manifest.md` (full)
- All major-tier character bios (full — POV holders especially)
- `decisions.md` — full read, focused on structural decisions (`decision_type: structure` or `plot`)
- `questions.md` — open structural questions (`category: structure` or `plot`)
- `state.md` (full)
- `.storystormer/genre-reference.md` if it exists — genre obligatory scenes affect spine shape
- Existing `outline/structure.md` if revising

**Operate in substantive mode** — list the files at the top of your next response, full-read each from beginning to end, and quote at least one passage from each. See `references/reading-discipline.md` § Substantive mode. The treatment is especially load-bearing — you cannot commit to a chapter spine without absorbing every scene.

### 2. Read the structural framework already in play

Before proposing anything, check what the **primer Section 3** commits to. If it names a framework (*"This novel uses Save the Cat's 15-beat structure"*), that is the binding choice — preserve it. If it hedges (*"consistent with Save the Cat's pattern"*), it's available to commit to but not yet binding. If it names no framework, the conversation will pick one.

If `decisions.md` contains a decision that locks the framework (e.g., a `voice` or `structure` decision saying *"Truby's 22 blocks because the protagonist's moral weakness drives plot"*), that supersedes the primer's hedge.

The framework choice is not yours to make unilaterally — it's the user's call, informed by your read of which framework the materials *want*.

### 3. Propose the conversation

> Here's the plan for the pre-outline session:
>
> - **Read** (substantive mode): I'll full-read `primer.md`, `treatment.md` (~6,800w), `manifest.md`, the 4 major bios, and the 3 unresolved structural questions in `questions.md` — then quote at least one passage from each in my next response.
> - **Frame the framework choice**: Primer Section 3 says *"consistent with Save the Cat's 15-beat pattern"* (hedged). The treatment's act structure mostly maps onto that, but the midpoint shift in Act 2 reads more like a Truby moral-argument inversion than a Save the Cat false-victory. I'll lay out three options — Save the Cat (lock the hedge), Truby 22 (reframe what the treatment is doing), or a hybrid spine — and you pick.
> - **Talk through the act breaks**: The treatment's *## Act One: The Impossible Threat* ends after the Walsh assassination scene. Does that map to ch 10 or ch 12? Discussion.
> - **Talk through chapter count and per-chapter density**: Primer Section 3 has Treatment Word Budget for a 120,000-word novel; that implies 40 chapters at ~500w treatment per chapter. We'll confirm that or recalibrate.
> - **Build the Chapter Spine**: I'll propose a numbered list (40 entries, one line each). We iterate on it together — you can rewrite any line, reorder, merge, or split.
> - **Capture decisions and questions**: Every structural commitment that lands gets logged to `decisions.md` (typically 5–8 entries from a first-run session). Anything that doesn't resolve becomes a `Q-###` in `questions.md`.
> - **Write the files**: `outline/structure.md` v1 + `outline/_index.md` stub. State.md updated. Snapshot if revising.
>
> This conversation usually runs 15–30 minutes of back-and-forth. Want to start, or adjust the plan first?

### 4. Read in substantive mode

Once the user agrees, do the reads. Then in your first response after the reading pass, quote at least one verbatim passage from each source file (primer, treatment, manifest, each major bio). Identify in your output:

- **The treatment's *de facto* act structure** — where the existing `## Act` headers fall, and which scenes feel like turning points even when they're not labeled.
- **The treatment's *de facto* beat positions** — opening image, inciting incident, midpoint shift, all-is-lost, climax, final image. Find them in the prose. If a beat isn't there, note it as a gap.
- **The treatment's POV pattern** — single-POV, multi-POV, observer protagonist, ensemble. The bios tell you who has interiority developed.
- **The primer's framework commitment** — exact phrasing from Section 3.
- **Open structural questions** — anything flagged in `questions.md` that affects the spine.
- **Setup/payoff chains** — the chains the spine has to preserve. If a setup is planted in Act 1 and paid off in Act 3, the chapter slots for both ends need to land.

### 5. The framework conversation

The hardest decision in this session is the framework. Most stories work in more than one framework; the question is *which framework best lets the user see this story's shape*.

Lean on `references/frameworks.md` § Structure. The frameworks available:

- **Three-act** — almost always works; useful as a baseline; doesn't specify internal beats so Act 2 can stay shapeless.
- **Save the Cat** — most prescriptive; great for genre-tight stories (thriller, romance, mystery, horror); will flatten literary work.
- **Seven-Point** — works backward from the resolution; great when the user knows beginning and end but not middle.
- **Truby's 22 Building Blocks** — plot grows from protagonist's psychological/moral weakness; great for character-driven and literary work; needs a clear protagonist weakness to anchor.
- **Story Circle (Harmon)** — Campbell reduced to 8 steps; great for short forms and single-protagonist transformation arcs.
- **Hero's Journey / Writer's Journey** — quest-driven mythic stories; can feel formulaic if forced.
- **Freytag's Pyramid** — long denouement; great for tragedy and literary fiction where the aftermath matters.
- **Heroine's Journey (Murdock / Pearson)** — descent and reintegration rather than departure and return; great for stories of grief, recovery, reconstitution.
- **Story Grid (Coyne)** — not a beat sheet but a check against genre obligatory scenes; pairs with any other framework.
- **Custom** — for stories where the conventional frameworks fight the material. See `references/alt-structure.md`. Ensemble casts, observer protagonists, theme-driven or voice-driven work often need a custom spine — chapters as juxtaposition, accumulation, irony, or circularity rather than as escalation.

Surface 2–3 framework options, each with the reason it fits *this* treatment and the friction point it would create. Let the user pick. Then commit the choice as a decision (`structure` type) and write it into `structure.md`'s Framework Choice section.

### 6. The act structure conversation

The treatment has act headers (`## Act One`, `## Act Two`, `## Act Three`, or whatever the structure uses). Walk through them with the user:

- **Where do the act breaks fall on the chapter scale?** The treatment's `## Act One: The Impossible Threat` might span what becomes chapters 1–10, or 1–8, or 1–12. The user picks. Default to the framework's canonical proportions (Save the Cat is 25/50/25 by page count; that maps to 25/50/25 by chapter count for evenly-paced novels).
- **What's in each act's beat anchors?** Save the Cat's *Fun and Games* is chapters ~11–17 in a 40-chapter novel; *Bad Guys Close In* is ~17–23; *All Is Lost* lands at ~30. Surface those positions; let the user adjust.
- **Are there sub-act divisions?** Many novels divide Act 2 into 2A and 2B (before/after midpoint). This affects the spine structure and the act table.

Each landed commitment becomes a row in the Act Structure table in `structure.md`, and ideally a decision in `decisions.md`.

### 7. The chapter count conversation

The primer's Treatment Word Budget table gives you the answer most of the time: `target chapter count` is in the per-chapter density row. If the primer says ~500w treatment per chapter for a 120,000-word novel, that's 40 chapters.

Surface this calibration to the user. If they want to deviate — *"40 feels right but I want 32 longer chapters"* — recalculate per-chapter density (120,000 / 32 = 3,750w per chapter, treatment density 625w per chapter) and confirm it's still in the "long literary novel" range rather than the "short genre novel" range.

If the primer doesn't have a Treatment Word Budget table, run `treatment-update` first — the primer's Section 3 has to crystallize before chapter count is meaningful.

### 8. The POV strategy conversation

If the story is single-POV, this is a single sentence in `structure.md`. *"Marlowe is sole POV; close third throughout."* Done.

If multi-POV:

- Which characters get POV? Check the bios — only characters with developed interiority (typically major-tier) should hold POV.
- What's the distribution? Roughly equal across the cast, weighted toward the protagonist, alternating by act?
- Are there special rules? *"Voss's POV chapters are limited to one per act, always at the act break, always in first-person";* *"Park's POV only appears in Act 2."* Surface these rules to the user.

For ensemble casts (4+ POV characters) or unusual POV strategies (observer protagonist, second-person, multiple unreliable narrators), check `references/alt-structure.md` § Observer Protagonist and § Ensemble Casts.

### 9. Building the Chapter Spine

This is the load-bearing step. You produce a numbered list — one line per chapter slot — that the user iterates on with you.

Each spine entry is **a single sentence** plus optional POV tag:

```
17. **The Locket** — Marlowe finds her father's locket in the audit box and recognizes the engraving from Voss's office. POV: Marlowe.
```

Build the spine by walking through the treatment chronologically and mapping its scenes onto chapter slots:

- A treatment scene that spans roughly one chapter's worth of action → one spine entry.
- A short transitional scene that doesn't fill a chapter → either fold into the surrounding chapter or merge two short scenes into one chapter.
- A long set-piece scene that the treatment covers in 1,500w → could span two chapters; ask the user.
- A treatment marker (`[NEEDS DEVELOPMENT: …]`) that falls between scenes → flag as an open spine slot, the user decides whether it gets its own chapter or rides along with a neighbor.

Show the spine in batches — Act 1 first (chapters 1–10), then Act 2A, etc. — and let the user react before moving to the next batch. Long unbroken spines are hard to react to; act-sized batches give natural pause points.

**Spine entries are creative-titled, not just numbered.** *"Ch 17 — The Locket"* is better than *"Ch 17 — Midpoint."* The title is a mnemonic for the chapter's identity. Pull title language from the treatment's scene headings where possible; invent only when the treatment's heading doesn't fit a single chapter.

**Use existing markers.** If the treatment has `[OPEN: Q-019]` on a scene, propagate that marker to the corresponding spine entry. If a spine slot has no treatment source (a chapter the user wants to invent at the outline level), insert `[NEEDS DEVELOPMENT: source]`.

### 10. Capture decisions and questions

As the conversation lands commitments, capture them:

- Framework choice → `structure` decision.
- Chapter count → `structure` decision (or `plot` if the user is choosing a non-default count).
- Act break locations → `structure` decisions.
- Sub-act divisions (2A / 2B) → `structure` decision.
- POV strategy → `voice` decision.
- Specific spine slot commitments that aren't already in the treatment (a chapter the user is inventing at the outline level) → `plot` decision.

If a question surfaces that you can't resolve in the session — *"Does the midpoint shift land at ch 18 or ch 20?"* — log it as a `Q-###` in `questions.md` with `category: structure` and `priority: critical` (blocks chapter outlining for the affected range).

Lean toward capture. The structural decisions are load-bearing for everything downstream; a missed log here causes outline-to-prose drift later.

### 11. Write the files

After the user approves the spine:

- Snapshot any existing `outline/structure.md` to `.storystormer/history/<timestamp>-pre-outline/`.
- Write `outline/structure.md` v1 (or bumped version) with all five sections per the schema.
- Write `outline/_index.md` stub — every spine entry as `*(not yet outlined)*`, organized by act.
- Mark consumed decisions with `Integrated into structure: yes (<date>)`. (Add this line to entries even if you didn't add it to the canonical schema — it's a parallel to `Integrated into treatment` and useful for traceability.)
- Update `state.md`:
  - `What Exists → Structure` line added with version, frameworks, chapter count.
  - `What Exists → Chapter outlines` line added showing `0/N drafted, Structure v1`.
  - `Summary` refreshed.
  - `stage` advanced to `outlining` (or `outline-drafted` if the spine has zero open critical questions — uncommon at v1).
  - `What's Next` updated — typically: *"Run `outline-chapters` for Act 1 (chapters 1–10) — `pre-outline-session` is complete."*

### 12. Report

> Pre-outline session complete. `outline/structure.md` v1 written with the Save the Cat framework, 40-chapter target, and 10/12/8/10 act split. Spine captured for all 40 chapters; 3 slots carry `[OPEN: Q-024]` (the Act 2 midpoint location), and 1 slot carries `[NEEDS DEVELOPMENT: source]` for the Act 3 reveal mechanism. 6 structural decisions logged (D-031 through D-036). Recommended next step: `outline-chapters` for Act 1, or resolve Q-024 in a brainstorm-session first if the midpoint position needs to be locked before we outline Act 2.

## Reading discipline

This skill is a heavy-context turn. **Always** operate in substantive mode (`references/reading-discipline.md` § Substantive mode). The treatment is the primary source — every spine entry must trace to a treatment scene, a logged decision, or an explicit `[NEEDS DEVELOPMENT]` marker. Don't invent chapter content; the user invents at the brainstorm-session step, not here.

If you find yourself proposing a spine entry that has no treatment source, no decision, and no marker, stop. Either find the source you forgot, or surface the entry as a question to the user: *"There's no treatment material for what falls into ch 23 in my proposed spine — what should this chapter do?"*

## The decision register

This session typically produces 5–8 decisions. Common categories:

- **D-### · structure** — Framework commitment, act break locations, sub-act divisions, chapter count.
- **D-### · voice** — POV strategy.
- **D-### · plot** — Chapter-level inventions that don't have a treatment source.

Log them as you go; don't batch-capture at the end. The plan-first protocol applies even within the session — when the user says *"OK, lock in Save the Cat,"* tell them *"capturing that as D-031"* before moving on.

## Series Mode

If `state.md` shows `project_type: series`, read `references/series.md` first. Pre-outline sessions in series mode operate on the **focused book** — produce `books/<current_focus>/outline/structure.md`. Each book has its own structure (framework, act table, chapter spine); structures are not shared across books.

Two additions in series mode:

1. **Also load `series.md`** during the pre-flight read. The Cross-Book Setups and Payoffs section is critical — every setup or payoff in this book that participates in a cross-book chain MUST land in a specific spine slot. If the user's series.md says *"book 1 ch 38 plants the protocol deviation that pays off in book 3 ch 22,"* then the spine for book 1 must have a slot at chapter 38 that includes that planting.
2. **Surface cross-book obligations in the spine.** Spine entries that participate in a cross-book chain should reference the chain explicitly: *"Ch 38 — Inauguration Day · Maya watches the ceremony from the gallery; protocol deviation planted (pays off book 3 ch 22, per D-024). POV: Maya."* Cross-book payoffs in the focused book must also be flagged similarly. This makes the cross-book chain visible at the spine level so `outline-chapters` doesn't accidentally drop the setup/payoff content.

The conversation may surface cross-book implications mid-session — *"if Maya does X at ch 35, that changes what book 2 starts with."* Capture the implication as a series-scoped decision and flag it for a `series.md` update in the report. Don't let cross-book implications dissolve into the per-book conversation.

If pre-outline reveals that `series.md` is stale or wrong (the current cross-book chains contradict what the spine wants to do), pause and recommend a `series.md` patch via brainstorm-session before continuing. Don't outline against a stale arc.

## What this skill does not do

- Generate per-chapter outlines. That's `outline-chapters`. This skill stops at the spine.
- Refresh the primer or treatment. That's `treatment-update`. If the pre-outline conversation surfaces that the primer or treatment needs revision (e.g., the framework choice contradicts what the primer says), capture the implication as a decision and recommend `treatment-update` as a separate next step — don't do it inline.
- Generate or refresh bios. That's `character-bio`. If POV strategy reveals that a POV character lacks an Inner Voice section in their bio, flag it in the report and recommend `character-bio` to expand.
- Sync the manifest. That's `manifest-sync`. The manifest doesn't usually need an update from a pre-outline session, but flag it if the spine introduces new characters not in the manifest.
- Patch `series.md`. In series mode, surface cross-book implications for a separate brainstorm-session update; don't fold series.md edits into this skill.

## References

- `references/plan-first.md` — universal plan-first behavior
- `references/file-schemas.md` — `outline/structure.md` schema, `series.md` Cross-Book Setups, `state.md` updates, decision/question schemas
- `references/reading-discipline.md` — substantive mode rules, Zoom Selection
- `references/series.md` — **read when `project_type: series`** (focused-book paths, cross-book chain integration into spine)
- `references/frameworks.md` § Structure — framework vocabulary and selection guidance
- `references/alt-structure.md` — when conventional frameworks fight the story
- `references/philosophy.md` — character pressure drives plot; the spine should reflect that
- `references/genres.md` — obligatory scenes check against the spine
