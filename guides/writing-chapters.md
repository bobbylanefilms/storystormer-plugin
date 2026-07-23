<!-- ABOUTME: User-facing how-to guide for the chapter-writing pipeline — Blueprint, prose generation, and Kit Bash -->
<!-- ABOUTME: First of the help-guide series; written for authors using the plugin, not for the model -->

# How-To: Writing Chapters — Blueprint, Prose & Kit Bash

This guide walks you through turning a chapter outline into finished prose: building the **Blueprint** (the pre-prose brief), generating the **prose** itself, refining it through chat, and optionally **Kit Bashing** — generating competing drafts from multiple AI models and merging the best of each.

Not there yet? Everything upstream of the chapter outline — workspace setup, brainstorming, canon, treatment, and the outline itself — is covered in **[Developing Your Story — From Idea to Outline](developing-your-story.md)**.

Everything here works the same in **Claude Cowork** and **Claude Code**, except where marked. You never need to remember exact commands — the phrases shown are examples, and plain English variations work fine.

---

## The pipeline at a glance

```
outline  →  blueprint  →  prose  →  (refine through chat)
                             │
                             └─ or: Kit Bash — multiple drafts → annotate → consolidate
```

| Stage | What it does | Required? |
|---|---|---|
| **Outline** (`outline-chapters`) | Decides *what happens* in the chapter — beats, POV, setups | **Yes.** Prose refuses without it. |
| **Blueprint** (`blueprint`) | Compiles *everything the prose writer needs* — who's on page, their current state, the setting, the stakes — into one brief | Strongly recommended |
| **Prose** (`prose`) | Writes the actual chapter, in your voice | — |
| **Kit Bash** (part of `prose`) | Same chapter, N competing drafts from different models, merged under your direction | Optional |

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

The outline says what happens; the Blueprint compiles everything else the prose writer needs to render it well: every character who appears (at the detail their role in *this* chapter earns), their **current state** as of this chapter (injuries, grief, what they know, what they're wearing), the setting, the conflict, the story-level frame. It's built from your canon — bios, worldbuilding, primer — filtered to *this chapter's knowledge horizon*, so nothing from later chapters can leak in.

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
