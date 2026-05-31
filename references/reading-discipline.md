<!-- ABOUTME: Reading discipline rules — substantive mode, full reads, source-grounded output -->
<!-- ABOUTME: This is the most important behavioral rule. Hallucinated story content poisons everything. -->

# Reading Discipline

The single biggest failure mode for a story-development agent is grepping large prose documents and confabulating the gaps from genre priors. The agent sounds confident, asserts things about characters and subplots that contradict the source, and corrupts every downstream artifact — treatment, manifest, bios, future generations.

This file is the hard rule. A treatment up to ~30k words fits comfortably in Claude's context window — there's no excuse for sampling, skimming, or grepping when full reads are right there. Read the source. Don't read a paraphrase of the source.

## Core principle

> **Generation of a structural index (primer, manifest, bio) requires full reads of the source (treatment). Usage of an existing index in conversation can permit targeted grep because the index already provides narrative grounding.**

The index earns the right to grep the treatment by existing.

## Zoom Selection

The plugin's canonical artifacts form a *tiered zoom system* on the same story. Before reading, ask: **what's the densest file that gives me what I need for this turn?** Don't load down-zoom when up-zoom suffices.

The zoom levels, from highest (least detail, most compressed) to lowest (most detail, raw narrative):

| Zoom level | Artifact | Approx size | Reach into when… |
|---|---|---|---|
| Project pulse | `state.md` Summary | ~200w | You need a one-paragraph sense of where the project stands. |
| Craft layer | `primer.md` | 4,500–5,500w | You need the structural framework, premise, setups, or writing rules — not the narrative content. |
| Cast & world inventory | `manifest.md` | 500–1,500w | You need to know *what* exists in the story without depth. |
| Story spine | `outline/structure.md` Chapter Spine | ~800w | You need the chapter-by-chapter shape without per-chapter detail. |
| Outline-scan | `outline/_index.md` | ~1,500w | You need status across all chapters at a glance. |
| Narrative | `treatment.md` | 5,000–7,000w | You need the actual story prose, scene-level. |
| Per-character | `characters/<slug>.md` | 350–1,900w | You need depth on one character. |
| Per-chapter beat | `outline/chapter-NN.md` | ~1,000w | You need scene beats and character beats for one specific chapter. |

### Picking the right zoom

The right zoom is the *coarsest* level that still answers the turn's question. Examples:

- *"Does this chapter touch the central thematic axis?"* → the Chapter Spine is enough; you don't need the chapter file.
- *"What happens in this chapter?"* → the chapter file is the right level; don't load the treatment to find out.
- *"What's Marlowe's voice register?"* → her bio's Voice Fingerprint; don't read the treatment.
- *"Has the midpoint been written?"* → the treatment; don't load the spine and infer.
- *"Who is in this story?"* → the manifest; don't read all the bios.
- *"Is the story's premise about justice or about loyalty?"* → primer Section 2; don't read the treatment.

When two zoom levels would both work, pick the higher one (less context for the model to manage, less noise). Add a lower zoom only if the higher one doesn't answer your question.

### When to deliberately go deep

Substantive-mode skills override this — `treatment-update`, `manifest-sync`, `pre-outline-session`, full-batch `outline-chapters`, and bio creation/expansion all need to read the *narrative* (treatment) in full, regardless of whether a more compressed artifact exists. That's because they're *generating* a structural index, and the source-of-truth for that index is the narrative itself. See `Substantive mode` below for the rules.

The principle: **choose the highest zoom that answers your question, EXCEPT when you're generating a new index — then full-read the source.**

### When prose enters the picture (future)

When the plugin adds prose generation in a later release, two new zoom levels will sit at the bottom of the table: `chapters/chapter-NN.md` (the chapter's actual prose, ~3,000–5,000w) and a derived `chapters/chapter-NN-summary.md` (~1,000w, written *after* prose lands to capture what the chapter actually does — distinct from the outline's *intent* version). The same Zoom Selection rule applies: load the chapter-summary when you need "what happened in chapter N for continuity," and the full prose only when you're revising chapter N itself.

**Until prose-writing functionality lands**, the `chapters/` folder exists only as an intake-stash location populated by `storystormer-init` when the user brings in pre-existing prose. Any skill that encounters `chapters/` files in v0.3 should treat them as **read-only reference material** — the prose-writing skills don't exist yet to coordinate writes against the outline/treatment/canon layers, so editing stashed prose risks creating inconsistencies that can't yet be detected automatically. If a skill needs to reference what the prose actually says (e.g., to verify a character's voice in the prose matches the bio's Voice Fingerprint), full-read the chapter's prose file; do not modify it.

## Substantive mode

For any heavy-context turn — treatment update, manifest sync, bio creation or expansion, worldbuilding entry creation, sweeping consistency checks — operate in **substantive mode**. Four rules, all mandatory for that turn:

1. **List every file you plan to consult before generating any output.** Name them explicitly at the top of your response. This creates an audit trail the user can call out if it looks thin.
2. **Read each file in full, using the Read tool, from beginning to end.** Do not rely on grep or glob to summarize content. Do not sample. Do not skim. If a file is genuinely too long to absorb in one pass, say so explicitly — don't pretend you read it.
3. **Quote at least one verbatim sentence from each file you used.** The quote must be exact, with surrounding context. Format: `> "exact passage" — `filename`, section`. Hallucinations don't come with quotes. This is non-negotiable.
4. **If you find yourself wanting to infer something about a character, plot, or world element that isn't directly stated in a file you've read, stop and tell the user.** Do not infer from genre conventions, training priors, or surrounding context. The source material is the only source of truth. Surface the gap as a question, not an answer.

Skills that **always** operate in substantive mode for their primary generation turn: `treatment-update`, `manifest-sync`, `character-bio` (when generating or expanding), `worldbuilding-entry` (when generating or expanding), `storystormer-init` (intake reading).

Skills that **conditionally** enter substantive mode: `brainstorm-session` enters it when the conversation spans the whole story (treatment-quality reviews, sweeping consistency checks). For focused conversations on a single character or scene, the per-file policy below governs instead.

## Per-file policy

| File | Default policy |
|---|---|
| `primer.md` | **Never grep.** Always full-read. Small enough to always afford. |
| `manifest.md` | **Never grep.** Structural index of every story element; keyword matching breaks the whole point. |
| Character bios (`characters/*.md`) | **Never grep when generating or refreshing** a bio. Permitted for targeted lookups once the bio is authoritative (*"what color are Alice's eyes?"*). |
| Worldbuilding files | Same as bios. |
| `treatment.md` | **Full read required** when generating `primer.md`, `manifest.md`, or any bio / worldbuilding file. Permitted for targeted grep once primer + manifest exist and are current — those provide the grounding. |
| `decisions.md`, `questions.md`, `state.md` | Always grep-permitted. Structured lookup data. |
| `.storystormer/genre-reference.md` | Always grep-permitted. |

## Noting disagreements

When sources disagree, flag it rather than picking silently. The treatment says Marlowe is 38; her bio says 35. Surface it:

> **Disagreement**: the treatment says Marlowe is 38; her bio says 35. Source of truth unclear — want me to pick or do you want to resolve it?

Disagreement detection is one of the highest-value byproducts of full reads. Surface them; don't paper over them.

## Verifying yourself

Before generating a primer / manifest / bio, ask: did I read the full treatment? If no, stop and read it. If you can't articulate at least three specific moments from the treatment that informed your output, you didn't read it carefully enough.

## When in doubt

Full-read. Tokens are cheap; corrupt grounding is expensive.
