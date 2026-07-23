<!-- ABOUTME: User-facing how-to guide for the story-development arc — init, brainstorming, canon, treatment, and outlining -->
<!-- ABOUTME: Second of the help-guide series; written for authors using the plugin, not for the model -->

# How-To: Developing Your Story — From Idea to Outline

This guide walks you through the front half of the pipeline: setting up a workspace with **init**, developing the story through **brainstorming** (and the decision log it feeds), building **canon** (character bios and worldbuilding), keeping the **primer and treatment** current, and finally committing to a **chapter structure** ready for prose.

Where this guide ends, **[Writing Chapters — Blueprint, Prose & Kit Bash](writing-chapters.md)** picks up.

Everything works the same in **Claude Cowork** and **Claude Code**. You never need to remember exact commands — the phrases shown are examples, and plain English works fine.

---

## The workflow at a glance

```
init  →  ┌─ the development loop ──────────────────────────┐
         │  brainstorm  ⇄  decisions & questions            │
         │       ↕                                          │
         │  treatment-update   (primer + treatment refresh) │
         │       ↕                                          │
         │  character bios · worldbuilding · manifest-sync  │
         └──────────────────────────────────────────────────┘
                 ↓  when the treatment is refined and major bios exist
         pre-outline-session  →  outline-chapters
                 ↓
         (the Writing Chapters guide takes it from here)
```

| Skill | What it does | When |
|---|---|---|
| **Init** (`storystormer-init`) | Triages whatever is in your folder and scaffolds the workspace | Once, at the start |
| **Brainstorm** (`brainstorm-session`) | The conversation where the story gets developed | Constantly — this is the core |
| **Decisions** (`decision-capture`) | Logs anything the story now treats as true | Inline, as things get settled |
| **Treatment update** (`treatment-update`) | Regenerates the primer + treatment from accumulated decisions | Every ~5+ new decisions |
| **Character bio** (`character-bio`) | Deep, tiered character dossiers | As characters mature |
| **Worldbuilding entry** (`worldbuilding-entry`) | Locations, organizations, magic systems, objects… | As elements mature |
| **Manifest sync** (`manifest-sync`) | Refreshes the one-line inventory of everything | After treatment changes add/rename elements |
| **Pre-outline** (`pre-outline-session`) | Commits the story to a numbered chapter spine | Once the treatment is solid |
| **Outline chapters** (`outline-chapters`) | Writes the per-chapter beat sheets against the spine | Act by act, after pre-outline |

Every skill follows the same rhythm: it reads what matters, **proposes a plan**, waits for your go, executes, and reports. Nothing is overwritten silently — superseded versions snapshot to history first.

---

## The files that hold your story

You don't need to memorize the folder layout (the [README](../README.md) has the full map), but five documents do most of the work, and knowing what each one *is for* makes the whole system click:

- **`decisions.md` — the story's spine.** An append-only log of everything you've settled: "Marlowe and Voss are estranged siblings," "present tense, first person," "the midpoint is the locket reveal." Decisions are never deleted — a changed mind *supersedes* the old entry, so the history of your thinking survives.
- **`questions.md` — the open-question queue.** Everything unresolved, triaged by priority (critical / important / nice-to-resolve). Brainstorm sessions work through these; decisions resolve them.
- **`primer.md` — the craft dossier.** A ~4,500-word structured reference: premise and moral argument, reveal architecture, structural framework, tone and writing rules, character dynamics. The 50,000-foot view.
- **`treatment.md` — the story itself, in prose.** The full narrative treatment, written in propulsive treatment voice. This is the source of truth every downstream stage builds from.
- **`manifest.md` — the index.** One line per character and worldbuilding element, with a pointer to its file. Lean by design — depth lives in the files it points to.

Plus **`state.md`**, the living dashboard — what exists, what stage you're at, what's next. Say **"status"** (or run `/storystormer:status`) anytime to see it.

All of it is plain markdown. You can open and hand-edit any file at any time — the agent reads your edits like anything else.

---

## Getting started: init

Run `/storystormer:init` (or just say **"set up StoryStormer here"**) in the folder where your story will live. Any starting state works:

- **Empty folder** — you'll answer a few questions (title, project type, genre) and get a minimal scaffold.
- **A one-line concept or a brain dump** — init reads it, extracts the decisions already implicit in it ("protagonist is a forensic accountant" was a decision, even if you never called it one), surfaces the open questions you wrote as "maybe X or Y???", and seeds both logs — showing you the lists for confirmation first.
- **A half-finished treatment, character sketches, a tangled mid-project mess** — init reads everything, tells you what it thinks each file is, asks about contradictions ("v1 says Alex, v2 says Marlowe — I'll treat v2 as canonical, confirm?"), and proposes a migration into the canonical structure. Your original files are snapshotted before anything moves.
- **Existing prose chapters** — detected, confirmed with you, and stashed untouched into `chapters/` with canonical naming. Init never edits your prose.

### What init deliberately does *not* create

Init scaffolds; it doesn't generate. There's no primer and no new treatment after init — those are built by your first **treatment update**, from the decisions init extracted. (If you brought in an existing treatment-like document, init can copy it in with your OK — but it won't write one from scratch.) An empty file pretending to be progress helps no one, so files appear only when there's real content for them.

Init ends by recommending your next step — usually a brainstorm session (early-stage projects) or a first treatment update (if enough is already decided).

---

## The development loop

This is where you'll spend most of your time: talk, settle things, fold them into the treatment, repeat.

### Brainstorming

Say **"let's work on the story"**, **"brainstorm Marlowe's relationship to the antagonist"**, **"talk through Act 2"** — anything conversational. The session opens by proposing a focus (usually the highest-priority open question) and then it's just a conversation, with a few deliberate habits:

- **It starts with character, not plot mechanics.** Who they are, what they want, what they're wrong about — plot follows from character pressure. Expect pushes toward the specific: *"strong how? Sarah Connor strong or Lisbeth Salander strong? Those are different stories."*
- **It matches where your project is.** A `concept`-stage session runs a broad interview; a `treatment-drafted` session opens with a quality read of what you have and offers targeted refinement passes. You can always redirect: *"skip that, I want to work on the villain."*
- **When you're stuck**, it offers 2–3 grounded directions — from genre convention or from your characters' established logic — rather than leaving you staring at a blank page.
- **Every so often it takes stock** — a structured progress check across characters, plot, theme, and worldbuilding. This is deliberate: three-hour character deep-dives that leave the midpoint untouched are a classic trap, and the check catches the dimension you've been neglecting. Ask for it anytime: **"where are we?"**

Craft frameworks (Save the Cat, Truby, McKee, the Enneagram…) inform the conversation but stay invisible by default — you get the insight, not the jargon. If you want the vocabulary, ask.

### Decisions: the log that keeps you honest

When something lands in conversation — *"OK, they're estranged siblings"* — you'll see *"capturing that as D-019"* and the entry goes to `decisions.md` with a summary, the reasoning, and what it affects. The plugin captures aggressively on purpose: an unlogged decision gets remembered differently next session, contradicted later, or silently lost in the next treatment rewrite. Logged-and-later-changed is cheap; lost is expensive.

Things worth knowing:

- **Floating an idea isn't deciding.** *"What if they were siblings?"* becomes a question, not a decision. If the agent misjudges which one you meant, say so.
- **Changing your mind is first-class.** The old decision stays in the log marked *superseded by D-041*; the new one records what changed and why.
- **You can dictate directly**: *"log a decision: the story is set in 1987."*
- **Browse anytime**: `/storystormer:decisions` lists recent entries; `/storystormer:questions` shows the open-question queue by priority.

### Treatment updates: folding the work back in

Decisions accumulate; the treatment doesn't know about them until you fold them in. Say **"update the treatment"** — or accept the offer, which appears once ~5 unintegrated decisions pile up or something structural shifts. Don't wait for session end; information living only in a chat transcript is at risk.

The update runs in two phases, with a pause between:

1. **Primer first.** The five-section craft dossier absorbs the decisions that change the story's *architecture* — premise, reveal timing, structure, tone rules, character dynamics. You review it before phase 2, because the treatment is built against it.
2. **Then the treatment.** Regenerated in treatment voice with the new decisions integrated at the right chronological spots — and everything untouched by a decision **preserved verbatim**. The update integrates; it does not rewrite for variety or "improve" prose you already approved.

Two guarantees worth internalizing:

- **It never invents story.** Every sentence traces to your existing treatment, a logged decision, or connective tissue between them. Where structure implies content nobody has brainstormed yet, you get an honest marker instead: `[NEEDS DEVELOPMENT: Elena's infiltration mechanics]` or `[OPEN: Q-021]`. Markers are features — they're the map of what to brainstorm next, and they must be resolved before those chapters can reach prose.
- **Nothing is lost.** The outgoing primer and treatment snapshot to history as a pair before the new versions land, and every consumed decision gets stamped *integrated* with the date.

After an update, the report tells you the downstream impact — including, once you have an outline, whether the change made any of it stale.

---

## Building canon

The treatment says what happens; canon is the depth underneath — who these people *are*, how this world *works*. Canon files are what the prose stage eventually draws on, so specificity here pays off directly in prose quality later.

### Character bios

Say **"develop Marlowe"** or **"write a bio for the antagonist."** Bios come in three tiers, auto-recommended from story role (you can override):

- **Major** (~1,400–1,900 words) — POV characters, antagonists, thematic load-bearers. Full psychological scaffolding: the **Lie** they believe, the **Ghost** that created it, a **Voice Fingerprint** (how they talk — register, reference well, verbal tells, what they'd never say), inner voice for POV characters, and where they stand on the story's thematic question.
- **Supporting** (~700 words) — keeps the voice and Lie/Ghost, condenses the rest.
- **Minor** (~350 words) — a voice signature and one defining trait. Deliberately no Lie/Ghost: a fabricated wound is worse than none.

The skill reads your full treatment first, tells you what it can draft from evidence and what it genuinely doesn't know, and asks rather than inventing — you choose whether to answer its questions first or let it draft best-guesses for you to correct. Before finalizing a major bio it also checks the *cast as a set*: two characters who reach for the same analogies, or two POV characters who think in the same register, will blur on the page — collisions get flagged, not silently absorbed.

### Worldbuilding entries

Say **"write up the Mercer Foundation"** or **"develop the magic system."** Entries live in 14 categories (locations, organizations, objects, magic, creatures, cultures…) in two formats: a compact **Reference Note** for real-world things with story-specific modifications, and a **Full Entry** for anything invented. The sections that matter most are the ones prose leans on hardest — the **Sensory Palette** (what it looks, sounds, smells like — the defense against generic description) and **Consistency Constraints**, stated as hard rules: *"the magazine holds exactly 8 rounds — never describe a ninth shot without a reload."* For magic systems, the bar is: could a new scene be written from the rules alone without inventing mechanics? If not, the rules aren't done.

### Manifest sync

After a stretch of development or a treatment update that added, renamed, or promoted elements, say **"sync the manifest."** It diffs the inventory against the current treatment and proposes additions, renames, tier promotions ("Alice is in 18 scenes now — functionally major, want to promote her?"), and descriptor updates. Approvals are yours; nothing is auto-removed.

### One habit for later: the Revelation Log

If a chapter-anchored change gets settled in conversation — *"Voss is exposed in chapter 31," "Callie's limp is permanent from chapter 13"* — the agent will offer to append a one-line, chapter-keyed entry to the affected bio or worldbuilding file. Say yes. These lines are how the prose pipeline later knows a character's state *at* a given chapter without leaking the future. (The [Writing Chapters guide](writing-chapters.md) covers how they're consumed.)

---

## Committing to a structure

When the treatment is refined and the major bios exist, the project is ready to become chapter-shaped. This is a genuine commitment point — the spine you build here is the contract everything downstream fulfills.

### Pre-outline: the structural conversation

Say **"let's outline the story"** or **"set up the chapter structure."** This is a 15–30 minute working conversation, not a generation:

1. **The framework.** Which structural vocabulary fits *this* story — Save the Cat's beat sheet, Truby's moral-argument blocks, Seven-Point, a heroine's-journey descent, or a custom shape for material that fights convention? You'll get 2–3 options with the reason each fits and the friction each would create. You pick.
2. **The act breaks.** Where the treatment's acts fall on the chapter scale, beat anchors (midpoint, all-is-lost), sub-act splits.
3. **Chapter count.** Calibrated from your target word count — a 120,000-word novel at ~3,000 words a chapter is 40 chapters. Prefer 32 longer ones? It recalculates.
4. **POV strategy.** Who holds POV, in what distribution, under what rules.
5. **The Chapter Spine.** The payoff: a numbered list, one line per chapter (*"17. **The Locket** — Marlowe finds her father's locket in the audit box. POV: Marlowe."*), built act by act so you can react in batches. Every entry traces to a treatment scene — where the treatment has a gap, the slot gets an honest marker instead of invented content.

If the treatment isn't ready — too many unresolved structural markers, no primer, missing POV bios — the skill says so and recommends what to resolve first, rather than building a spine on sand. Structural commitments get logged as decisions as you go; the session ends with `outline/structure.md` written and `/storystormer:outline` available as a read-only dashboard of outline progress from here on.

### Outline chapters: filling in the spine

Say **"outline Act 1"**. Chapter outlines generate in batches — an act at a time is the natural rhythm, shown in halves so you're never reacting to ten files at once. Each chapter gets a ~600–1,000-word beat sheet: premise, setting, 3–6 scene beats (each must *shift* something — a beat that changes nothing is filler), setups planted and payoffs delivered, what changes for each character, a few dialogue anchors, and the seams to the chapters on either side.

The discipline that keeps outlines trustworthy:

- **Everything traces to a source** — the spine, the treatment, a logged decision, a bio. The classic failure mode of AI outlining is invented scene mechanics: a chase the treatment never called for, a confrontation the characters don't justify. Content with no source becomes a marker, not a guess.
- **Batches get cross-checked** — chapter-to-chapter continuity seams, orphaned setups with no payoff slot, unplanned POV shifts. Problems surface to you rather than getting quietly patched.
- **Revision is targeted.** Later, saying **"chapter 17's tension feels low"** re-outlines just that chapter, using its neighbors for continuity — and if your complaint is vague, it diagnoses first and confirms what's wrong before rewriting.

A chapter outline with zero unresolved markers is prose-ready — which is exactly where the [Writing Chapters guide](writing-chapters.md) begins.

---

## Housekeeping along the way

| Command | What it does |
|---|---|
| `/storystormer:status` | The dashboard — what exists, current stage, what's next |
| `/storystormer:outline` | Outline-specific status — spine, chapters drafted, blockers, staleness |
| `/storystormer:decisions` | Browse the decision log (filter, show one, add) |
| `/storystormer:questions` | The open-question queue by priority |
| `/storystormer:checkpoint` | Manual snapshot of every story file — take one before anything risky |

The plugin is git-agnostic: `/storystormer:checkpoint` is your save point. Skills also snapshot automatically before overwriting anything, so checkpoints are for milestones ("pre-act-3-rework"), not routine safety.

**Writing a trilogy?** Series mode gives you shared characters and worldbuilding at the root with per-book treatments and outlines inside `books/` — say "series" during init (or ask to convert an existing project). Everything in this guide works the same; decisions just gain a scope, and `/storystormer:switch book-2` changes focus. The [README](../README.md#series-mode-multi-book-projects) has the details.

---

## Quick reference

### Phrases

| You want | Say |
|---|---|
| Set up a workspace | "Set up StoryStormer here" · `/storystormer:init` |
| Develop the story | "Let's work on the story" · "brainstorm the antagonist" |
| See where things stand | "Status" · "where are we?" |
| Log something settled | "Log a decision: …" |
| Fold decisions into the treatment | "Update the treatment" |
| Develop a character | "Develop Marlowe" · "write a bio for Voss" |
| Develop a world element | "Write up the Mercer Foundation" · "develop the magic system" |
| Refresh the inventory | "Sync the manifest" |
| Commit to chapters | "Let's outline the story" |
| Fill in an act | "Outline Act 1" |
| Fix one chapter's outline | "Chapter 17's tension feels low — revise it" |
| Save a milestone | `/storystormer:checkpoint` |

### Files

```
state.md                     ← the dashboard (start here when lost)
decisions.md                 ← everything settled, append-only
questions.md                 ← everything open, by priority
primer.md                    ← the craft dossier (built by treatment-update)
treatment.md                 ← the story in prose (the source of truth)
manifest.md                  ← one-line index of characters & worldbuilding
characters/<slug>.md         ← tiered bios
worldbuilding/<cat>/<slug>.md ← locations, orgs, magic, objects…
outline/structure.md         ← framework + act table + chapter spine
outline/_index.md            ← chapter × stage progress matrix
chapters/chapter-NN/…        ← per-chapter outlines (then blueprints, prose)
.storystormer/history/       ← every superseded version, snapshotted
```

### FAQ

**Why didn't init write me a treatment?** Init organizes; it doesn't generate. The treatment is built by your first treatment update, *from decisions* — so the story in it is yours, not a plausible-sounding invention. Brainstorm until enough is settled, then say "update the treatment."

**The treatment has `[NEEDS DEVELOPMENT]` markers in it. Is that broken?** No — it's the system refusing to invent your story. Each marker is a spot where structure implies content nobody has decided yet. They're your brainstorming to-do list, and they block those chapters from reaching prose until resolved.

**I changed my mind about something I decided weeks ago.** Just say so. The new decision supersedes the old one (which stays in the log with a pointer), and the next treatment update ripples the change through.

**How do I know when to run a treatment update?** When ~5 or more decisions have piled up unintegrated, or after anything structural shifts. The status dashboard shows the count, and brainstorm sessions will offer at the right moments.

**When am I ready to outline?** When the treatment is refined, the major bios (especially POV characters) exist, and no critical structural questions are open. Ask **"am I ready to outline?"** — the pre-outline skill checks the preconditions and tells you what's missing rather than building on sand.

**Do I have to finish all the canon before outlining?** No — major characters and load-bearing worldbuilding, yes; every minor character, no. Canon keeps growing during and after outlining. The manifest tracks what has depth and what's still just a one-liner.

**Can I edit the files by hand?** Yes, all of them — it's plain markdown. The agent reads your edits like anything else it finds.

**Something got overwritten and I want it back.** Nothing is ever overwritten silently. Book-level documents snapshot to `.storystormer/history/`, chapter files to their own `.history/` folders — all timestamped.
