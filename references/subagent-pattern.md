<!-- ABOUTME: Doctrine for dispatching subagents to conserve main session context during heavy-read operations -->
<!-- ABOUTME: Read when a skill performs substantive-mode reads of many or large files. -->

# Subagent Dispatch Pattern

The substantive-mode reading discipline (`references/reading-discipline.md`) requires full reads of every relevant source — no grep, no sampling, quoted excerpts as proof. That discipline is non-negotiable for output quality, but it creates a context-consumption problem on large intakes: a project with 18 character bios, 19 worldbuilding files, and a 50,000-word legacy treatment can easily consume 30–60% of a 1M context window just on the reads, leaving inadequate margin for the conversation and the judgment work — and making the skill **incompatible with Cowork's 200K window** entirely.

The fix is to dispatch the bulk reads to subagents whose context is sacrificed to absorb the source material, while keeping the **judgment work in the main session**. Subagents act as context-extension limbs of the main session — they read on its behalf and return structured summaries with quoted excerpts as evidence. The main session never carries the raw bytes; it carries only what the subagents found.

This doctrine applies to any skill that would otherwise consume substantial main context on substantive-mode reads. The four skills currently using it:

- `storystormer-init` — folder survey and execution
- `treatment-update` — bio reads and decisions filtering
- `manifest-sync` — per-book treatment reads in series mode
- `character-bio` — per-book treatment reads in series mode

Other substantive-mode skills (`pre-outline-session`, `outline-chapters`, `worldbuilding-entry`, `brainstorm-session`) can adopt the pattern when their own context budgets become tight; the doctrine here is the template.

## The kinds of subagent work

### Read subagents

A read subagent does substantive-mode reading against an assigned scope and returns a structured summary. Its context is consumed by the source material; its return is small and aggregation-ready.

**Brief template** (the main session writes this when dispatching):

```
Task: substantive-mode read of <scope-name>

Scope: <list of file paths, or a folder path>

What to do:
- Full-read each file in scope using the Read tool (beginning to end, no grep, no sampling).
- For each file, produce a structured summary entry (see return schema below).
- Note cross-file patterns, contradictions, and anomalies across the scope.

What to return: a JSON-like structured report with the schema:
{
  "scope": "<scope-name>",
  "files": [
    {
      "path": "<filepath>",
      "type_inference": "<character bio | worldbuilding entry | brain dump | draft treatment | legacy outline | prose chapter | research note | unknown>",
      "content_shape": "<1-2 sentences describing what the file is and what it does>",
      "word_count_approx": <integer>,
      "quoted_excerpts": [
        "<verbatim passage 1, with surrounding context if helpful>",
        "<verbatim passage 2>",
        "<verbatim passage 3>"
      ],
      "anomalies_or_concerns": "<anything unusual — wrong content, corruption, contradictions, format issues, OR null>",
      "suggested_canonical_destination": "<where this file should live in the canonical structure, OR null if unclear>"
    },
    // … one entry per file …
  ],
  "cross_file_observations": [
    "<pattern, contradiction, or aggregate observation 1>",
    "<observation 2>"
  ]
}

Reading discipline: substantive mode. Full reads only. Quoted excerpts are mandatory — 3 to 5 per file is the sweet spot. Returns without quotes are rejected by the main session and re-dispatched.

What NOT to do:
- Do not grep or sample.
- Do not return the raw file contents (the main session does not need them; that's the whole point of dispatching).
- Do not make triage decisions (canonical-vs-superseded, what supersedes what, the project's stage, naming choices). Those are the main session's job; the subagent's job is to provide the evidence.
- Do not write any files. The subagent is read-only.
```

The main session aggregates the per-scope reports into a single survey before triaging.

### Execution subagents

An execution subagent performs file operations against an approved plan. Each handles one category in parallel — bios migration, worldbuilding migration, history snapshot, etc. — and reports completion.

**Brief template:**

```
Task: execute <category> operations per the approved plan

Scope: <list of file operations — each {source_path, target_path, action: write|move|stamp, frontmatter_to_apply}>

What to do:
- Perform each operation in scope.
- Stamp frontmatter per references/file-schemas.md (the brief includes the exact frontmatter to write).
- For any operation that snapshots existing content, write the snapshot to .storystormer/history/<timestamp>-<operation-name>/ first.

What to return:
{
  "category": "<category-name>",
  "operations": [
    {
      "path": "<target_path>",
      "action_taken": "wrote | moved | stamped | skipped | snapshotted",
      "anomalies_or_skips": "<reason, OR null>"
    }
  ],
  "files_written": <count>,
  "files_skipped": <count>,
  "anomalies_encountered": <count>
}

What NOT to do:
- Do not make judgment calls beyond what the brief specifies. If something looks wrong, return it as an anomaly rather than guessing.
- Do not write outside the assigned scope. Each subagent operates on its category only.
```

Execution subagents run **in parallel** (dispatched in a single main-session message with multiple Agent tool calls). The main session aggregates the completion reports for the final user-facing report.

### Generation subagents

A generation subagent receives an assembly *recipe* (which files to read, in what order, with the behavioral rules) and produces a substantial creative artifact in a **clean context window** — then writes it to disk and returns a compact report. Used by the `prose` skill, where the clean window is not just context economy but a *correctness* requirement: the prose-context-assembly order (writing sample first → … → prior POV prose last) only honors the primacy/recency voice-conditioning when the assembly is read into a fresh window, not buried after a long main-session conversation.

This kind differs from read and execution subagents in that it both reads heavily *and* generates a large output (a 3,000–5,000-word chapter), so the ordering of its own reads matters. The main session never holds the writing sample, the full prior prose chapter, or the generated output — only the recipe and the returned report.

**Brief template** (the prose skill writes this when dispatching):

```
Task: generate prose for chapter <NN> in a clean window

[BEHAVIORAL FRAME — assert before reading anything]
- You are a prose-generation specialist. <POV mode rule> <tense directive>.
- Output rules: prose only, no markdown/headers/meta-commentary; bracketed
  outline direction is guidance, never echoed; complete self-contained chapter.
- Spoiler firewall: read ONLY the files named below. Never read any chapter
  numbered after <NN> — not its outline, prose, or synopsis. Do not foreshadow
  a specific future event.

[PROSE SPEC — the operational contract, input #3]
<the full text of references/prose-spec.md, pasted by the main session — the
subagent can't reach the plugin bundle, only the story folder. It is voice-neutral,
so its position ahead of the sample doesn't compete for voice conditioning.>

[PROJECT METADATA] <genre, logline, position in the book>

Now read these story-folder files IN THIS ORDER (the order conditions voice —
sample first for primacy, prior prose last for recency):
  1. voice/writing-sample.md            (skip if absent)
  2. voice/style-guide.md               (skip if absent)
  3. <prior chapter synopses — read each prior chapter's ch<NN>-prose.md
      `synopsis` frontmatter; fall back to its ch<NN>-outline.md Premise where
      prose doesn't exist. Chapters < NN only.>
  4. chapters/chapter-<NN>/ch<NN>-blueprint.md   (lean path)
       — OR, if no Blueprint: POV-first character bios + worldbuilding the
         chapter touches + primer.md  (fallback path)
  5. chapters/chapter-<NN>/ch<NN>-outline.md     (the task)
  6. <prior POV-matched prose chapter, full>     (the voice anchor — read LAST)

Then: write the chapter's prose to chapters/chapter-<NN>/ch<NN>-prose.md with full
frontmatter (pov, version stamps, status: drafted, word_count, and a ~150–250w
synopsis) per the schema the prose spec references.

What to return (NOT the prose itself — it's on disk):
{
  "chapter": <NN>,
  "path": "chapters/chapter-<NN>/ch<NN>-prose.md",
  "word_count": <integer>,
  "synopsis": "<the ~150–250w synopsis you wrote>",
  "path_used": "blueprint | fallback",
  "prior_prose_anchor": "<chapter NN of the POV-matched prior prose, or 'none (POV debut)'>",
  "voice_inputs": "<which of sample/style-guide were present>",
  "continuity_flags": "<anything that didn't reconcile — a Blueprint that looked stale, a missing prior synopsis, a beat the outline left underspecified — OR null>"
}
```

The main session reads the returned report (compact — no 5,000-word payload), wires `outline/_index.md` + `state.md`, surfaces continuity flags, and points the user at the file to review. For a **batch**, dispatch generation subagents **sequentially** (not parallel) when the chapters share a POV — each chapter's freshly written prose is the next same-POV chapter's voice anchor, so chapter N must finish before N+1 reads it. Independent POV threads in the same batch can run in parallel.

## When to dispatch vs. when to read directly

Subagents have overhead — dispatching, briefing, aggregating, parsing returns. That overhead beats the context cost only above a certain scale.

**Dispatch subagents when:**
- The scope contains more than 3 top-level folders or 8+ files of substantial size.
- Any single file is large (≥ 5,000 words) — e.g., a legacy treatment, a long brain dump.
- The aggregate read would consume more than ~50,000 words of source material.
- The skill is running against a project that has been declared series-mode (because cross-book reads multiply the context cost).
- The user has flagged context-pressure or explicitly asked for subagent use.

**Read directly in main session when:**
- The folder is empty or contains 1–3 small files.
- The skill is running on a fresh project with minimal upstream material.
- The relevant reads are small (e.g., `state.md`, `config.json`, a single character bio).
- Subagent overhead would exceed the context savings.

When in doubt, lean toward dispatching for intake operations (where the project's scale is unknown until the survey lands) and toward direct reading for incremental updates against a known-small artifact set.

## What stays in the main session

Three categories of work **never** delegate to subagents:

1. **User conversation** — the plan-first proposal, the intake questions, the back-and-forth that lands the plan. The user is talking to the main session; subagents are invisible to the user.
2. **Triage and judgment** — deciding what stage the project is at, what's canonical vs. superseded, naming choices, the cleanup plan, the canonical destination for ambiguous files. Subagents provide evidence; the main session decides.
3. **The plan-first proposal** — what the skill intends to do, how it'll group the work, what it needs from the user. The proposal is the contract with the user; subagents execute against the contract but don't write it.

The mental model: **subagents are limbs, the main session is the brain.** Limbs extend reach (more context, parallel execution); the brain decides what to do with what the limbs find. A skill that delegates judgment to subagents has confused the two.

## Quoted-excerpt discipline

Subagent returns **must** include quoted excerpts. This is non-negotiable for the same reason substantive mode exists in the first place: without quotes, the main session has no way to distinguish a subagent that read the source from a subagent that confabulated a summary.

The main session's anti-confabulation defense is: read the quotes, ensure they're concrete and specific (not vague summaries dressed in quote marks), and re-dispatch the subagent if the quotes are missing or thin.

A subagent that returns *"This file appears to be a character bio for Alec Montgomery"* without any verbatim text from the file has not done substantive-mode reading. Reject the return. Re-dispatch with a stricter brief: *"Your return must include 3–5 verbatim excerpts per file. Without them, your read is not verifiable."*

## Parallel dispatch syntax

For execution subagents that should run concurrently, dispatch them all in a single main-session message with multiple Agent tool calls. This is how parallelism is achieved:

```
Dispatch in one message:
- Agent: subagent for bios migration
- Agent: subagent for worldbuilding migration
- Agent: subagent for decisions extraction
- Agent: subagent for history snapshot
```

For read subagents, the same applies: dispatch all per-folder survey subagents in one message so they run in parallel against their assigned scopes.

Sequential subagent dispatch (one finishes, then the next starts) is wasteful when the scopes are independent. The natural case for sequential is when one subagent's output is the input to the next — and that's rare in intake or refresh operations.

## Failure handling

If a subagent return is malformed (missing quoted excerpts, unstructured prose instead of the JSON-like schema, evidence of skipped files), the main session:

1. Surfaces the failure to the user briefly: *"The bios-survey subagent didn't return quoted excerpts — re-dispatching with a stricter brief."*
2. Re-dispatches with a revised brief that emphasizes the missing requirements.
3. If re-dispatch also fails, falls back to reading the scope directly in the main session and notes the context impact: *"Falling back to main-session reads for the bios survey. This will consume ~Xw of main context."*

The user should know when subagent dispatch is helping and when it has failed. Silent fallback creates a false sense that subagents are working when they aren't.

## What this pattern does not solve

- **It does not reduce total work.** The reads still happen; they happen elsewhere. The pattern shifts context cost, not compute cost.
- **It does not reduce wall-clock time unless dispatches are parallel.** Sequential subagent dispatch can be slower than direct main-session reads (because of dispatch overhead). Parallel dispatch is where the speed win comes from.
- **It does not eliminate substantive-mode reading.** The discipline is the same; only the locus of the read changes. Subagents must operate in substantive mode against their assigned scopes, and their returns must include the quoted-excerpt evidence that substantive mode requires.
