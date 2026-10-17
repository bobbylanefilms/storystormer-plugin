<!-- ABOUTME: Handoff note: three places where the chapter pipeline misreads who wrote what, so AI text can outrank the author -->
<!-- ABOUTME: Found by the SB5 local-baseline live run on The Good Dog (2026-10-17); evidence in that run's log -->

# ISSUE071: Authorship signals in the chapter pipeline

**Status:** done (2026-10-17) · **Rob’s call on item 2 (2026-10-17):** author-written upstream → canon vs canon, no default; the author picks every time.
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

**Implementation notes (as built):**

- **Item 1, author-revision detection.** The rule now lives once, in `references/file-schemas.md` § Prose → “Detecting an author revision,” and `prose` § 8 and `canon-sync` § 4 cite it. `word_count` is informational only: the main session reads every prose write back, measures the body, and records the count with a frontmatter-only edit (`prose` § 7); it is never the edit signal. The signal is a body comparison against **what the plugin last wrote**, keyed on the binding’s `history`:
  - `snapshots` (local, Dropbox): a new **as-written copy**, `chapters/chapter-NN/.history/ch<NN>-prose-v<version>-as-written.md`, written right after every prose write (generate, surgical edit, Kit Bash consolidation) by whoever wrote the prose; the generation brief template in `references/subagent-pattern.md` and `references/kitbash-spec.md` carry it. Comparison is bodies only, exact where the host can compare text, else a clean-window subagent, so the main session never holds two chapters. When the body is unchanged, the as-written copy doubles as that version’s replace-time snapshot.
  - `versions`: the newest plugin-written version from `store.history`, where the binding says who wrote each; otherwise ask.
  - `native` (Notion): ask the author one plain question naming the chapter, version and date.
- **Deviation (item 1, Notion):** no `Last Edited By` property was added. Two reasons: the connector’s DDL lists no `LAST_EDITED_BY` type (only `CREATED_TIME` / `LAST_EDITED_TIME`), so putting it in `init`’s `CREATE TABLE` risks breaking scaffolding; and the connector acts as the connected user (the binding’s hub search filters on `created_by` = that user), so plugin writes and the author’s own Notion edits would very likely both read as the author, making the property useless for the one case that matters. Notion therefore asks. A live probe (edit a prose row through the connector, fetch it, read who Notion says edited it) would settle it; a `LAST_EDITED_TIME` column plus a binding-recorded write mark is the fallback idea if asking proves annoying.
- **Why the snapshot alone wasn’t enough:** the replace-time snapshot captures whatever the file holds when it is replaced, author edits included, so “compare with the last snapshot” compares against the wrong thing. The as-written copy is the plugin’s own version.
- **Item 2, canon-sync adjudication.** § 4 now traces each contested page fact upstream first (chapter outline, `structure.md` slot, treatment, decisions; through the Blueprint to its source). Author-written upstream (treatment, `structure.md`, an `author_written` or `ai_generated_author_revised` outline, an author decision) → canon vs canon, no default, both sources quoted, any upstream fix routed to its owning skill. Facts that trace to nothing author-written keep the authorship defaults, and defaulting against `ai_generated` prose first runs the revision check. § 2 reads the upstream passages per contradiction; § 5 gained a canon-vs-canon example; § 6’s decision `Details` record the trace. The guide (`guides/writing-chapters.md`) says the same.
- **Item 3, retired prose.** `retired` added to the prose `status` enum (no `superseded` existed in the schema). Only the author retires prose (`prose` § 1 handles “retire the ch 2 prose”: frontmatter-only edit, body untouched); `outline-chapters` § 9 proposes it when a fresh outline no longer describes existing prose. Retired prose is skipped by the voice-anchor lookup and story-so-far (with that chapter’s notes), Blueprint reconstruction (`references/blueprint-spec.md`), `notes`, and `canon-sync`’s span; it is not counted in What Exists → Prose chapters or `chapters_drafted`, and its `_index` Prose cell reads `retired`. Notion: `'retired'` added to the Chapters `Status` select, with an `ALTER COLUMN` line for older hubs.
- **Left for the Notion merge (outside this slice’s allowed edits to `notion.md`):** the binding’s computed `outline/_index.md` counts and What Exists → Prose chapters (§ Stored and computed) still count every prose row; they should skip `Status` = retired and render the `retired` cell.
- **Related, not changed:** outlines still use the `word_count` heuristic (`file-schemas.md` § chapter outline, `authorship` bullet). Its error falls on the safe side (a false “author revised” only puts the skill in correction-only mode), so it was left alone.
- **Version:** no bump in this slice; the release that lands it bumps both manifests.

