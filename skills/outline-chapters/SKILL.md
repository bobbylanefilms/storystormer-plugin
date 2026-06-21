---
name: outline-chapters
description: Generate or revise per-chapter outlines against the chapter spine. Two modes — batch generation (typically one act at a time) when the user says "outline Act 1," "draft the outlines for chapters 1 through 10," "fill in the next act"; and single-chapter revision when the user says "expand chapter 17," "rewrite the midpoint outline," "tighten chapter 23," "this chapter's tension feels low." Reads `outline/structure.md` as the contract and produces `chapters/chapter-NN/ch<NN>-outline.md` files following the schema. Refuses if no `outline/structure.md` exists — run `pre-outline-session` first.
---

# StoryStormer · Outline Chapters

You are filling in (or revising) the per-chapter outlines that hang off the chapter spine. The spine in `outline/structure.md` says *what each chapter is*; this skill writes *what happens inside each chapter*.

Two operating modes:

- **Batch mode** — generate a range of chapter outlines, typically one act at a time. The natural cadence for a new project: outline Act 1, the user reviews, then Act 2A, etc. Batch sizes of 6–12 chapters are the sweet spot for human review.
- **Single-chapter revision mode** — re-outline one specific chapter. The user reads chapter 17, the tension feels low, they say *"expand it."* You re-outline that one file using the adjacent chapters as continuity context.

The skill is intentionally lighter than the web app's `outline_generation` pipeline. There is no analysis → fix → reanalysis loop because **the user is the verification step** — they read each batch and push back when something's off. There is no cross-chapter analyst phase because the user is reviewing chapter-by-chapter. The skill's job is to draft clean, density-calibrated outlines fast, and to surface gaps clearly rather than paper over them.

Always follow `references/plan-first.md` — propose what you'll outline, get confirmation, then execute.

## What you produce

- **`chapters/chapter-NN/ch<NN>-outline.md`** — one file per chapter, in that chapter's folder, per the schema in `references/file-schemas.md` § `chapters/chapter-NN/ch<NN>-outline.md`. Chapter-number-prefixed (`ch17-outline.md`), two/three-digit zero-padded. Each file ~600–1,000w (or whatever per-chapter density `structure.md` specifies).
- **`outline/_index.md`** — the outline view (chapter × stage matrix), regenerated to reflect the new state. Each chapter row shows its outline-stage status (version link, or `—`) plus any inline markers.
- Snapshots any overwritten chapter outline to that chapter's co-located `chapters/chapter-NN/.history/` as a flat `ch<NN>-outline-v<version>-<date>.md` file (the superseded version). New chapter outlines have nothing to snapshot.
- Updates to `state.md`:
  - `What Exists → Chapter outlines` line updated (`12/40 drafted` etc.).
  - `Summary` refreshed.
  - `stage` advanced to `outline-drafted` only when all 40 chapters are outlined AND zero unresolved markers across the bodies. Otherwise `outlining`.
  - `What's Next` updated.

## Preconditions

- **`outline/structure.md` must exist.** If it doesn't, refuse the request and recommend `pre-outline-session` as the next step. Don't try to outline chapters without a spine — you'd be inventing the spine and the chapters in the same pass, which is the failure mode `pre-outline-session` is designed to prevent.
- **The relevant Chapter Spine entries must exist.** If the user asks for "outline chapter 41" and the spine ends at chapter 40, surface the gap — either the spine needs to be extended (re-run `pre-outline-session`) or the user is asking for the wrong chapter number.
- **Primer Section 3's Treatment Word Budget exists.** Per-chapter density calibration depends on it. If absent, recommend `treatment-update` first.

## What to do

### 1. Determine the mode

The user's request tells you which mode to run:

- *"Outline Act 1"*, *"draft chapters 1–10"*, *"fill in the next act"*, *"start the outline"* → **batch mode**.
- *"Expand chapter 17"*, *"rewrite the midpoint"*, *"tighten chapter 23"*, *"this chapter's beats are off"* → **single-chapter revision mode**.
- Ambiguous *"work on the outline"* → propose batch mode for the next un-outlined act, and confirm with the user.

The modes have different reading patterns and propose-shapes; pick before reading.

### 2. Read context — batch mode

For a batch (say, chapters 1–10):

- `outline/structure.md` (full)
- `primer.md` (full — Sections 3, 4, 5 especially)
- `treatment.md` (full — every scene; you'll map specific treatment passages onto specific chapter slots)
- `manifest.md` (full)
- Major bios for any POV character appearing in the batch (full)
- Supporting bios for major non-POV characters in the batch (full)
- `decisions.md` — full read, focused on `plot`, `character`, `voice` decisions affecting the batch's chapter range
- `questions.md` — open entries that map to spine slots in the batch range (`[OPEN: Q-###]` markers carry into chapter outlines)
- `.storystormer/genre-reference.md` if it exists — obligatory scenes that should land in this batch's range
- Existing chapter outlines for chapters *adjacent* to the batch (the chapter before and the chapter after — for continuity bridges)

**Operate in substantive mode** — list the files at the top of your next response, full-read each, and quote at least one passage from each. See `references/reading-discipline.md` § Substantive mode.

### 3. Read context — single-chapter revision mode

For revising chapter N:

- `outline/structure.md` (full — to verify the spine still wants what this chapter does)
- The existing `chapters/chapter-NN/ch<NN>-outline.md` (full)
- The two chapters before and after (N-2, N-1, N+1, N+2) if they exist — for continuity
- `primer.md` — Sections 3, 4, 5 (full)
- The treatment passages corresponding to this chapter's spine slot (targeted read of the treatment section — grep-permitted *only because* the spine and existing chapter outline provide the grounding)
- Bios for characters appearing in this chapter (full for major-tier, frontmatter + Quick Reference for supporting/minor)
- `decisions.md` and `questions.md` — entries affecting this chapter

Single-chapter mode is lighter than batch mode but still substantive — quote from each file you used.

### 4. Propose the plan

**Batch mode example:**

> Here's the plan for outlining Act 1 (chapters 1–10):
>
> - **Read** (substantive mode): I'll full-read `structure.md`, `primer.md` (especially Sections 3, 4, 5), `treatment.md` (~6,800w), `manifest.md`, the 3 major-tier bios for POV / heavy characters in Act 1 (Marlowe, Voss, Park), and the 4 supporting bios for cast members in this act. Plus the 5 unresolved questions affecting ch 1–10.
> - **Density target**: 1,000w per chapter outline (from primer Section 3's per-chapter density × 2). Act 1 outline batch total: ~10,000w across 10 files.
> - **Generate**: 10 chapter outline files (`chapters/chapter-01/ch01-outline.md` through `chapter-10/ch10-outline.md`) following the schema. I'll batch them in two halves (ch 1–5 first for your review, then 6–10) so you don't have to react to 10 chapter outlines at once.
> - **Preserve markers**: 2 spine slots carry `[OPEN: Q-014]` (ch 3 inciting mechanism); I'll propagate the marker into those chapter files rather than fabricate the mechanism.
> - **Snapshot**: nothing to snapshot — these are new files.
> - **Update**: `outline/_index.md` regenerated; `state.md` updated; chapters-outlined count bumped from 0 to 10.
>
> About 8–12 minutes once we start. Sound right?

**Single-chapter mode example:**

> Plan for revising ch 17 — *The Locket*:
>
> - **Read** (lighter substantive mode): existing `ch17-outline.md`, plus `ch15-outline.md` + `ch16-outline.md` + `ch18-outline.md` + `ch19-outline.md` (in their chapter folders) for continuity, `structure.md`, treatment Act 2A section (the spine slot for ch 17 maps to the treatment's *### The Audit Box* scene), primer Sections 3 + 4 + 5, and bios for Marlowe + Voss.
> - **Diagnose**: You said the tension in this chapter feels low. I'll read the existing outline and the adjacent chapters carefully, identify whether the issue is (a) under-specified scene beats, (b) a setup that doesn't pay off in this chapter, (c) Marlowe's interior arc not landing, or (d) a continuity issue with ch 16's setup. I'll propose what I'm seeing before rewriting.
> - **Rewrite**: revised `ch17-outline.md` v2, with the issue addressed. Snapshot of v1 to `chapters/chapter-17/.history/`.
> - **Update**: `outline/_index.md` shows v2 for ch 17; `state.md` Last Session updated.
>
> About 4–6 minutes. Sound good, or do you want to tell me first what you think is off?

### 5. Read in substantive mode

Once the user agrees, do the reads. In your next response, quote verbatim from each source. Identify per chapter slot in the batch (or for the single chapter being revised):

- **Spine slot text** — the exact line from `structure.md`. This is the contract.
- **Treatment source** — which treatment scene(s) map to this chapter slot. Quote the relevant treatment passage.
- **Setup/payoff chains** — which planted chains pay off here (or get planted here for later payoff). Cross-reference primer Section 5.
- **Character beats** — what each appearing character's arc does in this chapter. Anchor to the bio's Lie/Ghost where applicable.
- **POV** — from the spine entry or the act's POV strategy.

If you find a chapter slot whose treatment source is thin or absent, surface it before generating — don't paper over.

### 6. Generate each chapter outline

For each chapter in the batch (or the single chapter being revised), write the file following the schema in `references/file-schemas.md` § `chapters/chapter-NN/ch<NN>-outline.md`:

**Frontmatter** — all fields populated. `structure_version`, `treatment_version`, `primer_version` snapshot the versions this outline was built against; downstream tools can detect staleness.

**Premise** (≤60w) — the chapter's dramatic beat. Resolve cleanly against the Spine slot.

**Setting & Time** (1–3 sentences) — concrete, sensory anchors.

**Scene Beats** (3–6 beats) — each beat names what happens and what shifts. A beat that doesn't shift something is filler. Pull dramatic beat-shape from primer Section 5's Setup/Payoff Ledger when this chapter participates in a chain.

**Setups Planted** / **Payoffs Delivered** — cross-reference primer Section 5. Each entry maps to a tracked chain. If this chapter introduces a new chain, log a `[NEEDS DEVELOPMENT: add to primer ledger]` marker and surface it in the report so the next `treatment-update` can incorporate it.

**Character Notes** — what *changes* for each character (status, knowledge, internal state, relational). Reference Lie/Ghost when the chapter touches them. Pull from the bios; don't invent character interiority that the bios don't support.

**Dialogue Anchors** (1–3) — beat-level or line-level. Not full dialogue.

**Connections** — the seams to the previous and next chapter. For the first chapter of an act, the "From" connection is from the previous act's closing chapter. For the last chapter of an act, the "To" connection is the act break itself.

**Open Threads** — propagate `[OPEN: Q-###]` markers from the spine slot. Add `[NEEDS DEVELOPMENT: …]` markers for gaps in this chapter's content that aren't yet tracked questions. Never fabricate; an honest marker is better than a confabulated answer.

### 7. Density discipline

Per-chapter target comes from primer Section 3: **outline density ≈ 2× treatment density.** A 120,000-word novel with 40 chapters has ~500w of treatment per chapter, so ~1,000w of outline per chapter.

Enforce it:

- A chapter that genuinely lands in 600w shouldn't be padded.
- A chapter that's running 1,400w probably has invented content beyond the treatment + decisions; cut it.
- A single batch that runs 30% over or under the act's treatment word budget × 2 is a signal something is off; surface it.

Never pad to hit a word count. Density is a virtue.

### 8. Show the batch (or revision) to the user

For batch mode, show the chapter outlines in halves (ch 1–5, then ch 6–10 for a 10-chapter act). For each chapter, show the full file content. The user can:

- Approve the batch → write to disk and continue with the next half.
- Request edits to specific chapters → fold in and re-show that chapter.
- Request a global edit ("the dialogue anchors are too detailed across the batch") → adjust the pattern and re-show.

For single-chapter revision, show the diff (or just the rewritten file) and let the user react.

### 9. Voice and content discipline

Outline content must trace to one of:

1. **The spine slot text** — the contract.
2. **A treatment passage** — quote-able from `treatment.md`.
3. **A logged decision** — referenced by `D-###`.
4. **A character bio's content** — voice, Lie/Ghost, relationships.
5. **A primer setup/payoff chain** — from Section 5.
6. **A `[NEEDS DEVELOPMENT: …]` marker** — honestly flagged.

You do **not** invent new plot events, character actions, settings, or dramatic moments beyond these sources. If a chapter slot needs content that doesn't exist anywhere yet, mark `[NEEDS DEVELOPMENT: …]` — don't fill the gap with genre priors.

The single biggest failure mode for chapter outlines is **AI-default scene mechanics** — a chase scene where the treatment doesn't call for one, a confrontation that the bios don't justify, a setup-payoff invented at outline time that fights primer Section 5. The discipline is: *outline = render the existing decisions at chapter resolution, not author new ones*.

### 10. Cross-chapter checks (batch mode)

Before finalizing a batch, run three quick checks:

- **Continuity** — chapter N's "To" connection should match chapter N+1's "From" connection within the batch. Mismatches mean a missed setup or a transition that needs work; flag and resolve.
- **Setup/payoff balance** — every "Setup Planted" in the batch should have a planned payoff slot in a future chapter (within or beyond the batch). Every "Payoff Delivered" should reference a prior setup. Orphan setups (no payoff slot identified) and orphan payoffs (no setup referenced) get flagged in the report.
- **POV consistency** — each chapter's POV should match the act's POV strategy from `structure.md`. Unexpected POV shifts should be intentional (the user chose them in pre-outline) and noted in the spine slot, not introduced at outline time.

If a check fails, surface it to the user before writing the batch. Don't fix it silently.

### 11. Write the files

After the user approves:

- Snapshot any existing chapter outline being overwritten to its own `chapters/chapter-NN/.history/` as a flat `ch<NN>-outline-v<version>-<date>.md` file (the superseded version). Each chapter snapshots into its own folder — there's no central group snapshot for chapter artifacts.
- Write each `chapters/chapter-NN/ch<NN>-outline.md` per the schema.
- Regenerate `outline/_index.md` — the chapter × stage matrix; every chapter row reflects current state (outline-stage version link + title from frontmatter, or `—`, plus any `[OPEN: Q-###]` or `[NEEDS DEVELOPMENT]` markers in the cell).
- Update `state.md`:
  - `What Exists → Chapter outlines` line bumped (`12/40 drafted, Structure v1`).
  - `Summary` refreshed.
  - `Last Session` updated.
  - `stage` advanced only if appropriate. `outline-drafted` requires all spine chapters outlined AND zero unresolved markers; otherwise stay at `outlining`.
  - `What's Next` updated.

### 12. Report

> Outline-chapters batch complete. Wrote 10 chapter outline files (ch 01–10), ~9,800w total at ~980w average. Snapshot saved (only 2 files had prior versions). Index regenerated. 2 chapters carry `[OPEN: Q-014]` markers (the inciting incident mechanism). 1 chapter (ch 7) carries `[NEEDS DEVELOPMENT: the off-screen Park subplot beat — primer ledger doesn't yet have this chain]` — flagging for the next `treatment-update` to add to Section 5. Recommended next step: review Act 1, then `outline-chapters` for Act 2A (chapters 11–22). Or, if Q-014 is now blocking enough, resolve it in a brainstorm-session first.

## Working with revisions

When `outline-chapters` runs in single-chapter revision mode, the existing outline is the starting point — not a clean rewrite. Preserve what's working:

- Scene beats that are landing → reproduce verbatim.
- Character notes that match the bios → preserve.
- Dialogue anchors that the user has reacted positively to in past conversations → preserve.

Identify what's wrong, write the targeted fix, and surface the diff. If the user's complaint is vague (*"this feels low-energy"*), diagnose before rewriting — propose what you think the issue is (under-specified beats, missing payoff, character interiority too thin, etc.) and let the user confirm before you act.

Tier promotion is irrelevant here (chapters don't have tiers), but **batch re-outlining** is sometimes the right move when a structural change ripples — e.g., the midpoint moved from ch 18 to ch 20, which affects ch 17–22. In that case, re-outline the affected range as a batch, not chapter-by-chapter; the cross-chapter checks matter again.

## Reading discipline

Substantive mode is mandatory in batch mode. Single-chapter revision mode is *conditional* substantive mode — substantive for the chapter being revised and its neighbors, lighter (targeted reads) for the broader context. See `references/reading-discipline.md` § Substantive mode.

The treatment is the primary source. Every plot beat in a chapter outline must trace to a treatment passage, a decision, or an explicit marker. If you find yourself reaching for genre priors instead of the source material, stop. Re-read the relevant treatment section. The source has the answer — or the source has a gap that needs a marker.

## The pre-prose readiness check

A chapter outline is *prose-ready* when:

- The body contains zero `[OPEN: Q-###]` or `[NEEDS DEVELOPMENT: …]` markers.
- The frontmatter's `structure_version`, `treatment_version`, and `primer_version` all match the current versions of those files.
- The setup/payoff entries cross-reference chains that exist in primer Section 5.
- The POV matches the spine slot's POV.

This skill doesn't enforce prose-readiness — it just produces outlines. Pre-prose readiness is what a future prose-generation skill would check. But the `[NEEDS DEVELOPMENT]` markers and the version stamps are what make that check possible. Don't skip them.

## Series Mode

If `state.md` shows `project_type: series`, read `references/series.md` first. Outline-chapters in series mode operates on the **focused book's** chapter outlines — reads `books/<current_focus>/outline/structure.md` and writes `books/<current_focus>/chapters/chapter-NN/ch<NN>-outline.md`.

Two additions in series mode:

1. **Cross-book chain awareness.** When a chapter slot's spine entry references a cross-book setup or payoff (e.g., *"Ch 38 — Inauguration Day · protocol deviation planted (pays off book 3 ch 22)"*), the chapter outline MUST include the planted/paid content in its Setups Planted or Payoffs Delivered section, cross-referenced to the series chain. Failing to render the cross-book content at chapter resolution breaks the chain.
2. **Light read of `series.md`** for cross-book context — specifically the Cross-Book Setups and Payoffs section and the Per-Book Synopses for the focused book and any book the cross-book chain reaches into. Don't full-read other books' treatments unless a specific chapter slot demands it for setup/payoff fidelity.

When a chapter outline's chain involves another book that hasn't been drafted yet, capture the chain in the chapter file but flag explicitly:

```markdown
## Setups Planted
- **Protocol deviation** — pays off in book 3 ch 22 (per series.md, D-024). *Book 3 not yet drafted; payoff content TBD.*
```

This makes the chain visible and traceable even when the receiving book hasn't been written.

Single-chapter revision mode in series gains the same series-context read — when revising chapter 17 of book 1, also consult `series.md` if chapter 17 participates in any cross-book chain.

## What this skill does not do

- Generate prose. Not in this POC's scope.
- Refresh `outline/structure.md`. That's `pre-outline-session`. If outlining reveals a structural problem (e.g., the spine slot for ch 17 doesn't actually fit any treatment scene), surface it in the report and recommend `pre-outline-session` for a structural revision — don't unilaterally edit the spine.
- Refresh the treatment. If a chapter outline reveals that the treatment is wrong (a character does something the bio contradicts, a setup doesn't exist where the primer says it does), capture the implication as a decision and recommend `treatment-update` as a follow-up.
- Generate or refresh bios. If a chapter outline reveals a bio gap (a supporting character doing something major), surface it and recommend `character-bio`.
- Sync the manifest. Same handoff — flag and recommend, don't do it inline.
- Patch `series.md`. If a chapter outline reveals a cross-book chain that needs updating in series.md (a new payoff identified, a setup that should be repositioned), flag and recommend brainstorm-session.

## References

- `references/plan-first.md` — universal plan-first behavior
- `references/file-schemas.md` — `chapters/chapter-NN/ch<NN>-outline.md` schema, `outline/_index.md` (outline view matrix), per-chapter `.history/`, marker conventions
- `references/reading-discipline.md` — substantive mode rules, Zoom Selection
- `references/series.md` — **read when `project_type: series`** (focused-book paths, cross-book chain rendering in chapter outlines)
- `references/frameworks.md` — character + setup/payoff vocabulary used in outline content
- `references/philosophy.md` — character pressure drives chapter beats
- `references/treatment-voice.md` — voice register that the chapter outline anchors against (the outline isn't written in treatment voice, but its sources are)
- `references/genres.md` — obligatory scenes that should land in specific chapter slots
