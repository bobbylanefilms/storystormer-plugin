<!-- ABOUTME: The Kit Bash contract — multi-model draft fan-out, the generation packet, the annotation protocol, consolidation -->
<!-- ABOUTME: Cited by the prose skill's Kit Bash mode; the folder-native port of the app's Kit Bash feature -->

# Kit Bash Spec

**Kit Bash** generates a chapter's prose as *competing drafts from different models*, lets the author review them side by side and annotate directly in the files, then consolidates the drafts into one chapter that keeps what the author loved and drops what they hated. It is the folder-native port of the StoryStormer app's Kit Bash feature (AJ1/AJ3) — same idea, with the file system as the UI.

The flow: **fan out → review & annotate → consolidate.**

---

## Folder layout

Everything lives under the chapter's own folder:

```
chapters/chapter-NN/
  kitbash/
    ch<NN>-packet.md            ← the generation packet (tier 2, also fed to CLIs in tier 1)
    ch<NN>-draft-<label>.md     ← one file per draft: -codex, -gemini, -opus, -sonnet, -gpt, …
  ch<NN>-prose.md               ← the consolidated result (normal prose schema)
```

Draft labels come from the generating model or the user's filename — the skill treats any `ch<NN>-draft-*.md` in `kitbash/` as a draft. Drafts are plain prose (frontmatter optional and tolerated). After consolidation the drafts stay in `kitbash/` as the archive of the session; the consolidated chapter is a normal `ch<NN>-prose.md` and follows all standard rules (`.history/` snapshots, synopsis, index/state wiring).

---

## The two tiers

**Tier 1 — automated fan-out (Claude Code, Bash available).** The skill drives external model CLIs directly, in parallel with Claude-native drafts:

- **Claude drafts** — dispatch normal generation subagents (per `subagent-pattern.md` § Generation subagents) with a model override (e.g. one Opus, one Sonnet), each writing `kitbash/ch<NN>-draft-<model>.md` instead of the canonical prose file. Same brief, same read recipe; drafts for the same chapter are independent, so they run in parallel.
- **External drafts** — verify the CLI exists first (`which codex`, `which gemini`); for each one present, run it non-interactively, instructing it to read the packet and write its draft. Canonical shapes (verify flags with `--help` if they've drifted):
  - `codex exec --cd <story-folder> --full-auto "Read chapters/chapter-NN/kitbash/ch<NN>-packet.md and write the complete chapter prose to chapters/chapter-NN/kitbash/ch<NN>-draft-codex.md. Prose only — no commentary, no markdown."`
  - `gemini --yolo -p "<same instruction>"` (run from the story folder)
- A CLI that isn't installed simply drops to the packet workflow for that model — never block the whole fan-out on one missing tool.

**Tier 2 — the generation packet (Cowork, or any host without a shell).** The skill writes the packet (below); the user pastes it into ChatGPT / Gemini / any model they like, saves each output back into `kitbash/` as `ch<NN>-draft-<label>.md`, and returns to the session for consolidation. Claude-native drafts are still generated in-session, so a Cowork user gets a full trio (e.g. Opus + Sonnet + one external drop) without a shell.

**Privacy heads-up (both tiers, plan-time):** the packet contains the writing sample, canon, and story-so-far. Pasting it into an external service sends the story outside the Claude ecosystem. Say so in one line of the plan proposal; proceed on approval.

---

## The generation packet

The packet is the **entire prose brief rendered as one self-contained prompt file** — exactly what a generation subagent would assemble, pre-assembled, so every model writes from *identical* context and the comparison is honest. A packet-builder subagent assembles it (clean window, same read recipe as prose generation; the main session never carries the content).

Structure, mirroring the prose assembly order (`prose-spec.md` § Assembly order):

```
# Generation Packet — Chapter <NN>: <title>

<preamble: "You are writing chapter NN of a novel. Everything you need is in
this document. Output the complete chapter prose ONLY — no commentary, no
markdown formatting, no headers.">

## Behavioral frame
<identity · POV mode rule · tense directive · target length · output rules ·
language variant. No spoiler-firewall instruction — the packet already
contains only chapter ≤ NN material, which IS the firewall.>

## Writing sample — the voice north star
<voice/writing-sample.md verbatim>

## Craft rules
<voice/style-guide.md — or the selected craft rulebook when no style guide>

## Project
<genre · logline · position in the book>

## Story so far
<prior-chapter synopses, chronological>

## Chapter context
<the Blueprint — or, fallback path: POV-first bios + worldbuilding + primer + manifest>

## Chapter outline — the task
<ch<NN>-outline.md>

## Prior chapter prose — voice and continuity anchor
<the POV-matched prior chapter, full text, LAST>

Write the complete prose for chapter <NN> now. Output prose only.
```

The voice-conditioning order survives flattening: sample near the top (primacy), outline penultimate, prior prose last (recency), rules text in between.

---

## The annotation protocol

Review happens **in the draft files themselves**. The protocol works because the prose output rules ban markdown in draft bodies — any formatting found in a draft is unambiguously the author's hand:

| Marking | Meaning | Consolidation obligation |
|---|---|---|
| `**bold**` | **Love** | Must survive substantively intact — verbatim or minimally smoothed at the seams. Applies from *any* draft, not just the base. |
| `~~strikethrough~~` | **Hate** | Must not appear — and must not sneak back in paraphrased. A strike on a passage is also a signal about the *kind* of writing to avoid. |
| `[kb: …]` | **Margin note** | Freeform guidance, honored like surgical-edit notes. Inline where it applies, or at the top of a file for a draft-level verdict ("[kb: best dialogue of the three]"). |

Do **not** use italics as annotation — italics legitimately occur in prose (inner thoughts). Keep markers tight around the exact text they judge; they can span paragraphs.

---

## Consolidation

Triggered when the user asks to consolidate (or the skill notices annotated drafts in `kitbash/` and offers). Plan-first: the skill scans the drafts, reports per-draft annotation counts ("draft-codex: 4 loved, 1 struck, 2 notes; draft-gemini: 1 loved…"), proposes a **base draft** (the user's named pick wins; else propose the most-loved), and confirms before dispatching.

A **clean-window consolidation subagent** receives, in order: the behavioral frame (with the consolidation directives below) · the writing sample + craft layer (voice authority unchanged) · the Blueprint + outline (fidelity authority unchanged) · the non-base drafts with their annotations · the **base draft last** (it is both the spine and the voice anchor). Directives:

- The base draft is the spine: structure, pacing, and default wording come from it.
- Weave every loved passage in substantively intact, smoothing seams minimally.
- Honor every strike and every `[kb:]` note.
- Unannotated divergences between drafts resolve in favor of the base.
- Conflicts (a loved passage that contradicts a strike or the outline) are resolved by judgment and **flagged in the return report** — never silently dropped.
- Strip all annotation formatting; the output body is prose only.
- Write the result as a normal `ch<NN>-prose.md` — full frontmatter, `status: drafted`, word count, the ~150–250w synopsis — plus two provenance fields: `kitbash_base: <label>` and `kitbash_drafts: [<labels>]`. Snapshot any existing prose to `.history/` first.

Return schema: the standard prose report (word count, synopsis, continuity flags) plus `loved_passages_incorporated: <n>/<n>`, `strikes_honored: <n>`, and `conflicts: [...]`. The main session wires `outline/_index.md` + `state.md` exactly as a normal prose generation — the consolidated chapter is the chapter.

Post-consolidation refinement is ordinary **revise mode**: the drafts are archived, the consolidated file is the single review surface, and chat notes become surgical edits.
