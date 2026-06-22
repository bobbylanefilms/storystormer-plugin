---
name: prose
description: Generate or revise a chapter's prose — the actual fiction, written from the chapter's Blueprint, outline, the author's voice inputs, and the story so far. Two modes — generate ("write chapter 17," "draft the prose for chapter 12," "write the next chapter," "write the next three chapters") and revise ("revise the chapter 8 prose," "this paragraph in ch 5 is flat," "tighten the dialogue in chapter 12's confrontation"). Assembles context in the voice-conditioning order (writing sample first, prior POV-matched prose last) and generates in a clean-window subagent, writing `chapters/chapter-NN/ch<NN>-prose.md`. Refuses if a chapter has no outline — run `outline-chapters` first; works best when the chapter has a Blueprint (run `blueprint` first), falling back to raw canon when it doesn't. This is the prose stage: `outline → blueprint → prose → notes`.
---

# StoryStormer · Prose

You are writing (or revising) a chapter's **prose** — the actual fiction the reader will read. Everything upstream has been preparation: the treatment shaped the story, the outline planned the chapter, the Blueprint compiled exactly what this chapter needs. This stage produces the chapter itself.

Prose generation has **two jobs**: **voice** (it must sound like *this author's* book) and **fidelity** (it must execute *this chapter* correctly — right beats, right characters in current state, no continuity breaks, no future spoilers). The whole craft of this skill is assembling the right context in the right order so a generation subagent can do both. The full contract — assembly order, the two paths, the voice model, POV/tense rules, output rules, the spoiler firewall — lives in **`references/prose-spec.md`**. Read it before generating; it is the operational prompt the subagent works from.

Always follow `references/plan-first.md` — propose what you'll write, get confirmation, then execute.

## How it runs: a clean-window generation subagent

Prose is generated in a **clean-window subagent** (see `references/subagent-pattern.md` § Generation subagents), not inline. This is a *correctness* requirement, not just context economy: the voice-conditioning order (writing sample near the top for primacy, the prior POV chapter dead last for recency) only holds in a fresh context window — buried after a long main-session conversation, the primacy is lost. The clean window is the only way to honor the architecture the prose spec encodes.

The division of labor:

- **Main session (you):** determine the mode and chapter(s), resolve POV/tense and the path (Blueprint present?), check preconditions, propose the plan, then build the subagent **brief** (the behavioral frame + the full text of `references/prose-spec.md` + project metadata + the ordered read-recipe). Pass the prose spec *in the brief* — the subagent reaches only the story folder, not the plugin bundle. Wire the index/state and present the result.
- **Subagent (clean window):** reads the story-folder inputs in the spec's order (voice assets → story-so-far synopses → Blueprint/canon → outline → prior POV prose **last**), writes `ch<NN>-prose.md` with frontmatter + synopsis, returns a compact report (word count, the synopsis it wrote, path used, continuity flags). The 5,000-word output never touches your context.

## What you produce

- **`chapters/chapter-NN/ch<NN>-prose.md`** — the chapter's prose, per the schema in `references/file-schemas.md` § `ch<NN>-prose.md`. Body is **prose only** (no markdown headers, no meta-commentary). Frontmatter carries `pov`, the version stamps (`outline_version`, `blueprint_version`, `treatment_version`, `primer_version`), `status: drafted`, `word_count`, and a **~150–250w `synopsis`** — the chapter's contribution to every later chapter's story-so-far. Scene-split chapters write `scenes/ch<NN>-scene-MM.md` instead.
- **`outline/_index.md`** — regenerated so each chapter's **Prose** column reflects the new state (version link, or `—`); bump `chapters_drafted` in its frontmatter.
- Snapshots any overwritten prose (a prior draft, or intake-stashed prose) to `chapters/chapter-NN/.history/` as `ch<NN>-prose-v<version>-<date>.md`.
- Updates to `state.md`: `What Exists → Prose chapters` line (`6/40 written`), `Summary`, `Last Session`, `What's Next`.

## Preconditions

- **`chapters/chapter-NN/ch<NN>-outline.md` must exist** — it is the task. Refuse without it and recommend `outline-chapters`. If the outline carries unresolved `[OPEN: Q-###]` / `[NEEDS DEVELOPMENT]` markers, surface them: prose written over a gap inherits the gap. Recommend resolving first, or proceed with the gap flagged.
- **A Blueprint is strongly recommended, not required.** With `ch<NN>-blueprint.md` → the **lean path** (the Blueprint replaces raw bios + worldbuilding + primer; tighter, higher-fidelity prose). Without → the **fallback path** (raw POV-first bios + worldbuilding the chapter touches + primer). On the fallback path, recommend running `blueprint` first; generate anyway if the user wants to.
- **A writing sample is strongly recommended.** `voice/writing-sample.md` is the voice north-star and the *only* anchor on a POV character's debut chapter (no prior POV prose exists yet). If absent, warn that voice will lean entirely on the prose spec + style guide (weakest on a debut), and offer to scaffold `voice/` and prompt the user for a sample before generating. Don't hard-block — but make the cost explicit.

## What to do

### 1. Determine the mode

- *"Write chapter 17," "draft the prose for ch 12," "write the next chapter," "write the next three chapters"* → **generate mode**.
- *"Revise ch 8," "this paragraph in ch 5 is flat," "tighten the dialogue in ch 12's confrontation"* → **revise mode** (surgical edit).

### 2. Resolve the chapter(s), POV/tense, and path

For each chapter in scope:

- **POV + tense** — from the chapter outline's `pov` and the project/structure POV strategy (resolve tense from the project default if not chapter-specified). This drives the POV-mode rule the subagent asserts and the POV-matched prior-prose lookup.
- **Path** — does `ch<NN>-blueprint.md` exist? Lean vs. fallback.
- **POV-matched prior prose** — walk backward to the most recent prior chapter (chapter < NN) with the **same `pov`** that has prose; that's the voice anchor. Fall back to the most recent any-POV prior prose if no same-POV chapter exists; if none at all (a POV debut, or chapter 1), there is no prior-prose anchor and the writing sample carries voice alone. (Glob `chapters/*/ch*-prose.md`, read each one's `pov` + `chapter` frontmatter, filter `< NN`, prefer matching `pov`, pick the max chapter.)

### 3. The spoiler firewall (hold this throughout)

Prose for chapter N must be built **only** from chapters before N. Never read — and never let the subagent read — a chapter numbered after N (no future outline, prose, or synopsis). **The treatment stays out** of prose-time context on both paths (it contains future plot). Story-so-far is prior chapter synopses only. This is non-negotiable; a single future leak spoils the book. See `references/prose-spec.md` § The spoiler firewall.

### 4. Build the story-so-far

The subagent gathers this in its window, but you specify the source in the recipe: for each prior chapter (chronological, `< NN`), use its `ch<NN>-prose.md` `synopsis` frontmatter where prose exists; fall back to the chapter's `ch<NN>-outline.md` **Premise** where prose doesn't exist yet. This is chapter-granular narrative memory — gist, not scene-by-scene. (Hybrid: for a scene-split *current* chapter, prior scenes within it use finer continuity from the Blueprint.)

### 5. Propose the plan

**Generate (single) example:**

> Plan for the ch 17 prose — *The Locket* (POV: Marlowe, 3rd-limited past):
>
> - **Path**: lean — `ch17-blueprint.md` exists, so the Blueprint stands in for bios + worldbuilding + primer.
> - **Voice**: `voice/writing-sample.md` present (north-star); `voice/style-guide.md` present. Prior POV-matched prose: ch 14 (Marlowe's last POV chapter) — that's the voice + continuity anchor, read last.
> - **Story-so-far**: synopses of ch 1–16 (prose synopsis where written, outline Premise for ch 13/15 which aren't drafted yet). Chapters 18+ firewalled.
> - **Generate**: clean-window subagent assembles in voice order and writes `ch17-prose.md` (~target 4,000w from the outline's density) with a synopsis. I'll wire the index + state and point you at the file to read.
>
> About 3–6 minutes. Go?

**Generate (sequential batch) example** — *"write the next three chapters"*:

> Chapters 11–13, all Marlowe POV. I'll generate them **sequentially** (not in parallel) — each chapter's fresh prose becomes the next one's voice anchor, so 11 must finish before 12 reads it. I'll pause after each for you to skim before the next, unless you'd rather I run all three and you review the batch. Same-POV so no parallel threads. ~10–15 min for three.

**Revise example:**

> Revising ch 8 prose. You flagged the dialogue in the rooftop confrontation as flat. Surgical-edit mode: the subagent gets the *current* ch 8 prose as both the text to edit and the voice anchor, plus your editorial note ("sharpen the confrontation dialogue — Voss should never raise his voice; the menace is in the control"). It changes only that passage, preserves everything else verbatim, and rewrites the synopsis only if events changed. Snapshot of v1 first. ~2–4 min.

### 6. Generate — dispatch the subagent

On approval, build the brief per `references/subagent-pattern.md` § Generation subagents and dispatch:

- **Behavioral frame** first: prose-specialist identity; the resolved **POV-mode rule** + **tense directive** (from `prose-spec.md` § POV rules / Tense); output rules; the spoiler firewall; continuation framing (prior prose is a voice reference, not text to continue).
- **The full text of `references/prose-spec.md`** pasted as the operational contract (input #3) — the subagent can't reach the plugin bundle.
- **Project metadata** — genre, logline, position in the book.
- **The ordered read-recipe** — the story-folder files in spec order (sample → style guide → story-so-far synopses → Blueprint or canon-fallback → outline → POV-matched prior prose **last**), then the write target and the return schema.

For a **sequential batch**, dispatch one subagent per chapter in order; chapter N+1's recipe points at chapter N's freshly written prose as the POV-matched anchor. Independent POV threads in one batch can run in parallel; same-POV chapters cannot.

### 7. Wire, present, and report

From the subagent's returned report (compact — the prose is on disk, not in your context):

- Regenerate `outline/_index.md` — Prose column updated; bump `chapters_drafted`.
- Update `state.md` (What Exists → Prose chapters; Summary; Last Session; What's Next).
- Present: the synopsis the subagent wrote, the word count, which path it used, the prior-prose anchor it chose, and any continuity flags it raised. Point the user at `chapters/chapter-NN/ch<NN>-prose.md` to read — **the file is the review surface** (don't dump 4,000 words into the conversation).

> Ch 17 prose written — 4,180 words, lean path (used `ch17-blueprint.md`), voice anchored on ch 14 (Marlowe's prior POV chapter). Synopsis: *[the ~200w synopsis]*. One continuity flag: the Blueprint references Marlowe's father's locket as still hidden, but ch 14's prose has her already holding it — I wrote toward the ch-14 state (she has it) and flagged the Blueprint as possibly stale. Open `chapters/chapter-17/ch17-prose.md` to read. Next: review it, then ch 18, or revise anything that's off.

### 8. Revise mode (surgical edit)

When the user wants targeted changes to existing prose:

- Snapshot the current `ch<NN>-prose.md` to `.history/` first; bump `version`, set `status: revising`.
- Dispatch a subagent in **surgical-edit mode** (`prose-spec.md` § Surgical edit mode): the *current* chapter prose goes in the final position as both the text to edit and the voice anchor; the editorial notes follow it; prior-chapter prose is dropped. The instruction: change ONLY what the notes name, preserve everything else verbatim, minimize collateral changes, return the complete chapter.
- The subagent rewrites `ch<NN>-prose.md` and updates the `synopsis` **only if** the edit changed the chapter's events.
- If the user's complaint is vague (*"this feels flat"*), diagnose before editing — name what you think is off (dialogue carrying no subtext, beats rushed, interiority thin) and confirm before dispatching.

## Reading discipline

The generation subagent operates in **substantive mode** — it full-reads every input (never grep the Blueprint, the outline, the prior prose, or canon on the fallback path; grep strips the causal/emotional framing and the prose confabulates the gaps). The clean window is what makes the voice order real. The main session reads only what it needs to build the brief and resolve the path — it does not pull the prior full prose chapter or the generated output into its own context. See `references/reading-discipline.md` and `references/subagent-pattern.md`.

## Voice assets

`voice/writing-sample.md` (the author's own prose) and `voice/style-guide.md` (craft preferences) are the project-owned half of the voice model (`references/prose-spec.md` § The three-input voice model; schema in `references/file-schemas.md` § Voice assets). If they're absent when the user asks for prose, offer to scaffold them — especially the sample, since without it a POV debut chapter has no voice anchor at all. Keep scaffolding light: create the files, prompt the user to paste a representative passage and jot a few craft rules; don't author a style guide from genre priors.

## Series Mode

If `state.md` shows `project_type: series`, read `references/series.md` first. Prose operates on the **focused book's** chapters — reads `books/<current_focus>/chapters/chapter-NN/ch<NN>-{blueprint,outline}.md`, the **shared** canon and **shared** `voice/` assets (voice is series-wide), and writes `books/<current_focus>/chapters/chapter-NN/ch<NN>-prose.md`. POV-matched prior prose and story-so-far are scoped to the focused book. The spoiler firewall still applies within the book; cross-book future events are firewalled the same way.

## What this skill does not do

- **Post-prose refinement passes** — dialogue / editorial / de-AI / style-polish. Those are the `notes` stage (post-POC). This skill does generation and surgical *revision*, not the full refinement suite.
- **Author or edit canon, the Blueprint, the outline, the treatment, or the primer.** It *reads* them. If generation reveals an upstream problem — a Blueprint that's gone stale against canon, an outline beat that contradicts a bio, a treatment fact that's wrong — it surfaces the flag and recommends the owning skill (`blueprint`, `outline-chapters`, `treatment-update`, `character-bio`). It does not fix upstream inline.
- **Append to the Revelation Log.** If the prose realizes a chapter-anchored state change, that's a `decision-capture` / canon-skill proposal, not a prose-stage write.
- **Resolve open questions or invent missing plot.** A chapter outline carrying a marker generates with the gap carried forward and flagged — it doesn't confabulate the answer.

## References

- `references/prose-spec.md` — **the operational contract**: assembly order, two paths, voice model + precedence, POV/tense rules, output rules, spoiler firewall, surgical-edit mode, the synopsis spec
- `references/subagent-pattern.md` — **§ Generation subagents**: the clean-window dispatch recipe and the sequential-batch rule
- `references/file-schemas.md` — `ch<NN>-prose.md` schema (frontmatter + synopsis + body rules), `voice/` assets, `outline/_index.md` matrix, per-chapter `.history/`
- `references/plan-first.md` — universal plan-first behavior
- `references/reading-discipline.md` — substantive mode; the no-grep rule
- `references/series.md` — **read when `project_type: series`** (focused-book paths, shared canon + voice, in-book firewall)
