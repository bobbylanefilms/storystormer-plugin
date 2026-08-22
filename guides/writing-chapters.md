<!-- ABOUTME: User-facing how-to guide for the chapter-writing pipeline — Blueprint, prose generation, and Kit Bash -->
<!-- ABOUTME: First of the help-guide series; written for authors using the plugin, not for the model -->

# How-To: Writing Chapters — Blueprint, Prose & Kit Bash

This guide walks you through turning a chapter outline into finished prose: building the **Blueprint** (the pre-prose brief), generating the **prose** itself, refining it through chat, and optionally **Kit Bashing** — generating competing drafts from multiple AI models and merging the best of each.

Not there yet? Everything upstream of the chapter outline — workspace setup, brainstorming, canon, treatment, and the outline itself — is covered in **[Developing Your Story — From Idea to Outline](developing-your-story.md)**.

Everything here works the same in **Claude Cowork** and **Claude Code**, except where marked. You never need to remember exact commands — the phrases shown are examples, and plain English variations work fine.

---

## The pipeline at a glance

```
outline  →  blueprint  →  prose  →  (refine through chat)  →  notes
                             │
                             └─ or: Kit Bash — multiple drafts → annotate → consolidate
```

| Stage | What it does | Required? |
|---|---|---|
| **Outline** (`outline-chapters`) | *What happens* in the chapter — your prose account, in your voice | **Yes.** Prose refuses without it. |
| **Blueprint** (`blueprint`) | *What must not be gotten wrong* — who's on page and in what state, the chapter's shape, the plants, every canon fact it touches, nothing from later chapters | Strongly recommended |
| **Prose** (`prose`) | Writes the actual chapter, in your voice | — |
| **Kit Bash** (part of `prose`) | Same chapter, N competing drafts from different models, merged under your direction | Optional |
| **Notes** (`notes`) | Records *what the prose actually committed* — the as-written synopsis, divergences from your outline, the harvest of particulars, accidental canon, and the end-state the next chapter inherits | Recommended once a chapter is revised or approved |

---

## Before you write: set up your voice (one-time)

The prose stage can run with nothing but an outline, but it writes *your* book only if you give it your voice. Two files, both in `voice/`:

- **`voice/writing-sample.md`** — a passage of your own prose (a few pages of anything representative: an earlier book, a short story, even a polished scene draft). This is the **voice north star** — the single most influential input on how the prose sounds. It matters most on a POV character's *first* chapter, where there's no prior prose to anchor to. *Strongly recommended.*
- **`voice/style-guide.md`** — your craft rules, stated as rules: "never open a chapter with weather," "em dashes sparingly," "no said-bookisms." *Optional.*

**No style guide? You get a craft rulebook automatically.** The plugin ships six — a default plus five genre variants (literary thriller, cozy mystery, fantasy, romance, literary fiction). The prose skill picks the one matching your project's genre and names its pick in the plan, where you can override it ("use the fantasy rulebook"). If you *do* have a style guide, it replaces the rulebook entirely — your rules win.

If you ask for prose with no writing sample, the skill will warn you and offer to scaffold the `voice/` files first. You can decline and generate anyway — just know the voice will lean on the rulebook alone.

---

## Stage 1: Blueprint — the pre-prose brief

### What it is and why you want it

Three documents reach the prose writer, and each answers one question. Your **style guide** (`voice/style-guide.md`) answers *how do I write this book?* Your **outline** answers *what happens?* The **Blueprint** answers *what must I not get wrong?* It's built from your canon — bios, worldbuilding, primer — and carries every character who appears (at the detail their role in *this* chapter earns), their **current state** as of this chapter (injuries, grief, what they know, what they're wearing), the chapter's shape and pacing, the exchanges that must land, the setting, the conflict, the slice of the story's frame that bears on this chapter, and the things that must be planted, stated as plain instructions.

Two rules make it trustworthy. **It never looks forward.** A Blueprint's knowledge horizon is its own chapter: it may state anything true as of the end of chapter N and nothing from chapter N+1 on. A plant is given to the prose writer as an exact instruction with no reason attached, because a writer who knows it is planting will telegraph. **It's written as one brief, not a pile of quotes.** Canon phrasing is carried where it's sharper than any paraphrase, but absorbed into a document that reads like a director's brief, with the specification lists (a character's complete vocabulary, a forbidden-words bar) kept exact. General craft rules stay in your style guide; the Blueprint carries only placements unique to this chapter. If you don't have a style guide yet, the Blueprint transcribes your craft rules and tells you it's doing so as a workaround.

At prose time the Blueprint **replaces** the raw canon entirely. That's the point: instead of handing the prose writer eight full bios and hoping it picks the right details, it gets one tight brief where every line is relevant. Blueprinted chapters produce noticeably tighter, more continuity-accurate prose. You *can* skip it — prose falls back to reading raw bios and worldbuilding — but the skill will recommend blueprinting first.

### How to run it

Say any of:

- **"Blueprint chapter 17"** — one chapter.
- **"Blueprint Act 1"** / **"prep chapters 1–10 for prose"** — a batch. The natural rhythm is one act at a time, right after that act's outlines are done.
- **"Rebuild the ch 12 blueprint — it's missing Linda's grief"** — targeted rebuild.

You'll get a **plan first**: which chapters, which characters and elements surface in each, what it will read, roughly how long it'll take. Approve it, and the Blueprints get built (in parallel for a batch). Each lands as `chapters/chapter-NN/ch<NN>-blueprint.md`, and the outline index and `state.md` update to show what's blueprinted.

### Good to know

- **It needs a marker-free outline.** If the outline still carries an open question (`[OPEN: Q-014]`), the skill will ask whether to resolve it first or blueprint around the gap.
- **Blueprints go stale.** Each one records the outline/treatment/primer versions it was built against. If you rewrite a bio or an outline afterward, rebuild that chapter's Blueprint before generating prose from it.
- **It reads your outline for content, not scaffolding.** Dialogue in an author-written outline is marked as yours in the Blueprint's Dialogue Anchors so the prose writer preserves it in substance.
- **It may propose Revelation Log lines.** If it notices a state change your canon doesn't record ("Marlowe's ch 9 limp isn't logged"), it proposes the log line and appends only with your OK.

---

## Stage 2: Prose — writing the chapter

### How to run it

Say any of:

- **"Write chapter 17"** / **"draft the prose for ch 12"**
- **"Write the next chapter"** / **"write the next three chapters"**

### The plan (always shown before anything generates)

The skill resolves everything it can and shows you the plan for approval:

- **Chapter, POV, and tense** — from the outline and your project defaults.
- **Path** — *lean* (Blueprint exists) or *fallback* (raw canon; it'll suggest blueprinting first).
- **Voice inputs** — writing sample? style guide, or which craft rulebook it picked?
- **Voice anchor** — the most recent earlier chapter with the same POV, whose prose anchors voice and momentum.
- **Story-so-far** — which prior chapters' synopses it will carry. Later chapters are *never* read (see the firewall, below).
- **Word target** — your ask, else estimated from the outline's density. Aim is ±15%, with an explicit rule against padding.
- **Model** — inherits your session's model unless you name one ("write it with Opus").

Correct anything in the plan by just saying so, then give it the go. Generation runs in a fresh, isolated context (so the voice conditioning actually works) and takes about 3–6 minutes per chapter.

### What you get

- **`chapters/chapter-NN/ch<NN>-prose.md`** — the chapter. Pure prose in the body; the metadata (POV, word count, a ~200-word synopsis that later chapters use as their story memory) lives in frontmatter.
- The file is **presented for reading in-app** (Cowork's preview pane) — the draft opens beside the chat.
- A compact report: word count, the synopsis, and any **continuity flags** ("the Blueprint says the locket is hidden, but ch 14's prose has her holding it — I wrote toward ch 14 and flagged the Blueprint as stale").

### Refining through chat

With the draft open, just talk about it:

- *"Make the intro more atmospheric."*
- *"Tighten the rooftop confrontation — Voss should never raise his voice."*
- *"The second scene drags; cut it by a third."*

Each note runs a **surgical edit**: the current version is snapshotted to `.history/` first, then only what you named changes — everything else is preserved verbatim. Loop as many rounds as you like. If your note is vague ("this feels flat"), the skill will diagnose first — naming what it thinks is off — and confirm before editing.

### The spoiler firewall (why it won't read your treatment)

Prose for chapter N is built **only from chapters before N**. The treatment never enters prose generation — it contains your whole plot, including the future — and no later chapter's outline, prose, or synopsis is ever read. This is deliberate and non-negotiable: it's what prevents the prose from foreshadowing reveals it shouldn't know about yet.

### Batches

"Write the next three chapters" works — same-POV chapters generate **sequentially** (each fresh chapter becomes the next one's voice anchor), and the skill pauses after each for a skim unless you tell it to run straight through.

---

## Kit Bash — competing drafts, merged under your direction

Different models write differently. Kit Bash generates the *same chapter* as several competing drafts — from identical context, so the comparison is fair — lets you mark up what you love and hate directly in the files, then consolidates into one chapter. Use it for chapters that matter most: openings, midpoint reversals, climaxes.

### Step 1 — Fan out

Say **"kit bash chapter 17"** (or "generate three drafts of ch 12"). The plan shows the draft lineup, and it depends on where you're running:

**In Claude Code:** fully automated. Claude drafts (e.g. one Opus, one Sonnet) generate in parallel with external-model drafts via the Codex CLI and Gemini CLI, if installed. Every draft lands in `chapters/chapter-NN/kitbash/` as `ch<NN>-draft-<model>.md`.

**In Cowork** (no access to external CLIs), the **generation packet** workflow:

1. The skill writes `kitbash/ch<NN>-packet.md` — the *entire* prose brief (voice, story-so-far, Blueprint, outline, prior chapter) pre-assembled into one self-contained prompt. Claude-native drafts still generate in-session.
2. You paste the packet into any external model — ChatGPT, Gemini, whatever you like.
3. Save each model's output back into `kitbash/` as `ch<NN>-draft-gpt.md`, `ch<NN>-draft-gemini.md`, etc. (any label works), and come back to the session.

> **Privacy note:** the packet contains your writing sample, canon, and story-so-far. Pasting it into an external service sends your story material outside Claude. The plan reminds you of this before building the packet.

### Step 2 — Review and annotate (in the files themselves)

Read the drafts side by side and mark them up **directly in the draft files**. Because generated prose never contains markdown formatting, anything you add is unambiguous:

| You type | Means | At consolidation |
|---|---|---|
| `**this passage**` | **Love it** | Survives essentially intact — from *any* draft, not just the base |
| `~~this passage~~` | **Hate it** | Never appears, and doesn't sneak back in reworded |
| `[kb: your note]` | Margin note | Honored like an editing instruction |

A marked-up draft might look like:

```
The rain had been falling since Tuesday. ~~It fell like tears from a
grieving sky.~~ **Marlowe counted the drips from the fire escape —
eleven, twelve — the way she counted everything she couldn't control.**
She hadn't slept. [kb: keep this restraint — the other drafts overdo
the insomnia]
```

Don't use *italics* as annotation — italics are legitimate prose (inner thoughts), so the skill ignores them. Annotate as many or as few drafts as you like; unmarked text is simply neutral.

### Step 3 — Consolidate

Say **"consolidate the drafts"** (or the skill will offer, when it sees annotated drafts). The plan reports what you marked — *"draft-codex: 4 loved, 1 struck, 2 notes; draft-gemini: 1 loved"* — and confirms the **base draft**: your pick, or it proposes the most-loved. The base is the spine (structure, pacing, default wording); loved passages from the other drafts get woven in; strikes and notes are honored; conflicts get flagged rather than silently resolved.

The result is a normal `ch<NN>-prose.md` — same as any generated chapter, with the drafts archived in `kitbash/` and the annotation marks stripped. From here it's the ordinary refine-through-chat loop.

---

## Stage 3: Notes — recording what the chapter committed

Once a chapter is past its first draft (status `revising` or `approved`), say **"take notes on chapter 17"** or **"notes for Act 1"**. The skill reads the prose against the outline and Blueprint and writes `ch17-notes.md` with five things: the **as-written synopsis** (what's on the page, as opposed to what the outline intended), **divergences** from the outline (each flagged deliberate or drift), the **harvest** (every concrete particular the chapter committed: the half-eaten apple, the matchbook's branding, the skate shoes; nouns, not themes), **accidental canon** (details the prose invented that no bio or worldbuilding entry holds), and an **end-state block** (hour, location, wardrobe, injuries, objects carried, emotional residue).

Why it's worth the two minutes:

- **The next Blueprint reads the end-state block** instead of 3,500 words of prior prose, and gets a more reliable answer.
- **The harvest is how payoffs get found.** When a later chapter needs one, the skills search the harvest across every noted chapter before inventing something new. Most of the throwaway-detail-that-pays-off density in well-woven books is found this way, not planned.
- **It catches canon drift early.** A colour the prose named, a route through the house, a walk-on's gesture: those are canon now because they're on the page. Notes surfaces them as proposals (append a Revelation Log line, promote to an entry, add to the manifest, close a chain that's been paid) and writes nothing to your canon without your OK.

It records; it never evaluates. You will not get pacing opinions from it. Running it on a first draft is allowed but discouraged (the notes describe a chapter about to change); the file is stamped so a re-run is known to be owed.

---

## Quick reference

### Phrases

| You want | Say |
|---|---|
| Build pre-prose briefs | "Blueprint Act 1" · "blueprint chapter 17" |
| Write a chapter | "Write chapter 17" · "write the next chapter" |
| Write several | "Write the next three chapters" |
| Refine a draft | "Tighten the dialogue in ch 12's confrontation" |
| Multi-model drafts | "Kit bash chapter 17" |
| Cowork external drafts | "Build the generation packet for ch 17" |
| Merge annotated drafts | "Consolidate the drafts" |
| Record what a chapter committed | "Take notes on chapter 17" · "notes for Act 1" |
| Pick a craft rulebook | "Use the cozy mystery rulebook" |
| Pick a model | "Write it with Opus" |

### Files

```
voice/
  writing-sample.md          ← your prose, the voice north star (you provide)
  style-guide.md             ← your craft rules (optional; replaces the rulebook)
chapters/chapter-17/
  ch17-outline.md            ← required before anything below
  ch17-blueprint.md          ← the pre-prose brief
  ch17-prose.md              ← the chapter (synopsis + metadata in frontmatter)
  ch17-notes.md              ← what the prose committed (run after revising/approving)
  .history/                  ← every superseded version, auto-snapshotted
  kitbash/
    ch17-packet.md           ← the portable generation packet (Kit Bash)
    ch17-draft-<label>.md    ← competing drafts, annotated by you
```

### FAQ

**Why won't it write without an outline?** The outline *is* the task — without it the model would be inventing your chapter and writing it in one breath. Run `outline-chapters` first.

**Why doesn't it use my treatment when writing prose?** The treatment contains your future plot. Reading it at prose time risks foreshadowing reveals that haven't landed. Story memory comes from prior chapters' synopses instead.

**The prose doesn't sound like me.** Add (or improve) `voice/writing-sample.md` — it's the strongest voice input by far. A style guide with your specific anti-patterns is the second lever.

**Where did my old draft go?** Nothing is ever overwritten silently — every superseded version is in that chapter's `.history/` folder, timestamped.

**Can I regenerate a chapter from scratch?** Yes — "rewrite chapter 17 from the outline" generates fresh (the old version is snapshotted). For a change of approach on an important chapter, consider a Kit Bash instead.

**Does chapter 12's prose know how the book ends?** No. The firewall is absolute: chapter N is generated only from chapters 1 through N−1 plus its own outline and Blueprint.
