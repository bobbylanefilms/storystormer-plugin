<!-- ABOUTME: Handoff note: three places where the chapter pipeline misreads who wrote what, so AI text can outrank the author -->
<!-- ABOUTME: Found by the SB5 local-baseline live run on The Good Dog (2026-10-17); evidence in that run's log -->

# ISSUE071: Authorship signals in the chapter pipeline

**Status:** open · **Needs Rob:** yes (item 2 changes canon-sync’s adjudication default)
**Found by:** SB5 local baseline, The Good Dog, chapter 3 loop (`outline-chapters → blueprint → prose → notes → canon-sync`), 2026-10-17. The run’s log (findings F24, F27, F32) was in the session scratchpad; the essentials are copied here.

## Why it matters

The pipeline’s one load-bearing promise is that the author’s words outrank the model’s. Three rules read authorship from weak signals, and each fails in the direction of letting AI text win.

## 1. `prose` § 8, “Detect author revision” (skill bug, high impact)

**What happens:** the check flags an author edit when the stored `word_count` differs from the body’s count. With no shell (Cowork, or a Read/Write-only subagent brief) the generation subagent counts words by hand: it recorded 5,094 for a 5,105-word chapter. A literal main session then sets `authorship: ai_generated_author_revised`, and canon-sync’s adjudication treats that prose as author-touched, so the AI draft beats canon in contradictions.

**Suggested fix:** the main session computes and records `word_count` after every prose write (it already reads the result back), and the revision check compares the body with the last snapshot (or a body hash in frontmatter), not the count. If a count stays in the heuristic at all, treat a delta under ~2% as noise.

## 2. `canon-sync` § 4, adjudication by authorship (skill gap; needs Rob)

**What happens:** the default (“canon wins over `ai_generated` prose → manuscript fix list”) looks only at the prose’s `authorship`. In the run, two “contradictions” (Elfie hauled up by his harness handle; Elfie a mile out at the grave) were beats the AI prose took faithfully from the author’s own treatment and committed spine slot 3. A literal run would have put them on the fix list and deleted the author’s beat from the manuscript.

**Suggested fix:** before defaulting, trace the contested page fact upstream (treatment, `author_written` outlines, `structure.md`). When it comes from author-written upstream material, present it as canon vs canon (the bio against the treatment) with no default; the author picks. **Rob’s call:** whether this “no default” case is right, or whether author-written upstream should win by default over a bio.

## 3. `prose` § 2, voice-anchor lookup (contract gap)

**What happens:** the anchor is the latest earlier same-POV prose. Here the only candidate is `ch02-prose.md`, a pre-StoryStormer intake draft D-067 retired, which still carries `status: drafted`. A literal run anchors chapter 3’s voice on prose the author threw out.

**Suggested fix:** add `retired` (or reuse `superseded`, which kitbash drafts already use informally) to the prose status enum in `references/file-schemas.md` § Prose, and skip it in the anchor lookup and the story-so-far.

## Files

`skills/prose/SKILL.md` § 2, § 8 · `skills/canon-sync/SKILL.md` § 4 · `references/file-schemas.md` § Prose (status enum) · `references/prose-spec.md` (if it restates the check).
