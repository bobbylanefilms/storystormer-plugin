# SB6: Portable Markdown Profile (Write What Notion Keeps, Everywhere)

## TL;DR for Rob

**The problem:** In SB5, a project that went into Notion and back kept every word, but not always its formatting. Notion re-serializes markdown its own way: emphasis markers get re-paired, numbered lists restart at 1, list spacing tightens, raw HTML tables break, non-breaking spaces turn into plain spaces. `references/store/notion.md` lists this today as a Known limit. The cost goes beyond looks: a document that changes on its way in no longer matches its source byte for byte. So `migrate`’s resume and left-behind checks need a fuzzy comparison, and an edit anchor taken from an older copy can stop matching.

**The approach:** Define one **markdown profile**: the subset of markdown that comes back from Notion byte-identical. The plugin writes only that subset, on every backend. Author text is never reformatted in place. Where author text enters Notion (a `migrate` into Notion, init intake, a quote), it is normalized to the profile once, in flight. Migrate shows that in its preflight for approval, and any other Notion write reports it in one line. The source stays as it was. After that, a round trip through Notion is byte-clean.

**Tier:** FULL-lite: one new reference, small edits to five existing docs and two skills, and a live probe that gates everything else · **Judgment profile:** judgment (what the profile allows is decided by evidence from the probe, not by guesswork)

**What changes:**
1. **A live probe** writes every candidate construct to Notion and reads it back. The profile is whatever comes back unchanged.
2. **`references/markdown-profile.md`:** the allowed constructs, plus a table of rewrites from out-of-profile markup into profile form. The rewrites change markup only, never words.
3. **Citations from the two places every writer already reads:** `file-schemas.md` (document shapes) and `prose-spec.md` (prose), plus fixes to the plugin’s own format specs that model out-of-profile output (`***bold italic***` POV labels in `blueprint-spec.md`).
4. **The Notion binding:** a write-side safety net that normalizes out-of-profile markup before sending and reports it. The Known limit list narrows to “author text outside the profile, written directly in Notion or before normalization.”
5. **`migrate` into Notion:** the preflight counts what normalization will change, by file and construct; the run writes the normalized form, and verification compares against it exactly.
6. **`storystormer-init`:** the `.docx` and intake conversion writes profile form on every backend; the intake originals are kept as today.
7. **A dev-only checker,** `tools/md-profile-check.ts`: dependency-free TypeScript run with Node, never cited by a skill. It lints files against the profile and compares the words of two trees with markup stripped.

**Why it matters:** Notion becomes a backend you can move into and out of without anything shifting under you. The fuzzy “differs only by normalization” clauses in `migrate` and the binding collapse into exact comparisons, and the plugin’s output looks the same in Obsidian, Dropbox and Notion.

---

## 1. Problem & Success

**What:** Make the plugin’s markdown portable across every backend by construction, and make entry into Notion a one-time, approved normalization rather than an ongoing silent drift.

**Why:** SB5’s first migration ring changed 86 of 96 shared files. After 0.20.1-poc fixed the data loss, the re-verify on a 32-file cut still showed 30 files changed only by Notion’s normalization, plus a stray `</table>` line. Each of those is harmless alone, but together they make Notion the one backend where “what I wrote” and “what is stored” differ. Rob asked on 2026-10-17 whether the plugin could format for Notion from the start. This plan is the answer.

**Success criteria** (each independently verifiable):
- [ ] **Probe:** a synthetic probe file (no story content) holding every candidate construct round-trips through a Notion test project. Every construct the profile allows comes back byte-identical, and the probe log records the result for every construct tried, including those left out.
- [ ] `references/markdown-profile.md` exists. It is goal-shaped (what the output looks like, not a procedure), lists every allowed construct with a one-line example, and gives a rewrite for every construct the probe excluded. Every rewrite changes markup only.
- [ ] `file-schemas.md` and `prose-spec.md` cite the profile once each. No skill gains its own citation or a copy of the rules, and the plugin’s own output-format examples and templates (`blueprint-spec.md`’s POV labels, any `file-schemas.md` template) are in profile form.
- [ ] **Plugin output lints clean:** a fresh local project taken through `init` (with a `.docx` and a brain dump), `brainstorm-session` → `decision-capture`, `character-bio`, `treatment-update`, and one chapter of `outline-chapters` → `blueprint` → `prose` → `notes` passes `md-profile-check` with zero findings.
- [ ] **Normalization is idempotent and keeps words:** the model’s normalization of the `notion-mini` fixture, run twice, gives identical output both times, and `md-profile-check --words` finds no word-level difference between the fixture and its normalized form.
- [ ] **Byte-clean round trip:** `notion-mini` → `migrate notion` (normalization approved in the preflight) → `migrate local` into an empty folder, then `diff -r` against the normalized fixture. Only migrate’s own documented changes differ (the `storage` block, `storage_kind`, What Exists, computed indexes, init-archive re-filing).
- [ ] **Full ring:** the 148-file The Good Dog ring (local → Notion → Dropbox → local) diffs clean against the normalized source on the same terms. This is the full ring SB5 didn’t re-run after its fixes.
- [ ] **Exact comparisons:** `migrate`’s resume and left-behind checks and the Notion binding’s identical-content no-op compare exactly against the normalized form. Every “differs only by its normalization” clause is removed or narrowed to author text written directly in Notion.
- [ ] **Release:** version bumped in both manifests, `claude plugin validate .` passes, the tool-name grep is clean, and the release is on `main`. The README’s “Where a story can live” Notion bullet and the v0.21 changelog say what changed in author terms.

---

## 2. Where & How

**Files in play:**

| File | What changes |
|------|--------------|
| `references/markdown-profile.md` | **new:** the allowed constructs, the rewrite table, and the scope rule (plugin-authored text everywhere; author text only on entry to Notion) |
| `references/file-schemas.md` | one sentence near § Frontmatter values: every document the plugin writes is in the profile; templates and examples fixed to profile form |
| `references/prose-spec.md` | one citation for prose output (italics, scene breaks, dialogue punctuation) |
| `references/blueprint-spec.md` | the `***bold italics***` POV subsection label (line 218) becomes the profile’s form; any other output-format example swept |
| `references/store/notion.md` | § Rendering: a write-side normalization step plus its report line; the Known limit list narrows to author text outside the profile; probe results recorded as *observed* |
| `skills/migrate/SKILL.md` | the into-Notion preflight shows normalization counts per file and construct; the resume and left-behind matching rules become exact against the normalized form |
| `skills/storystormer-init/SKILL.md` | intake conversion writes profile form; the “normalizing binding keeps local intake originals” rule stays |
| `skills/outline-chapters/SKILL.md`, `skills/blueprint/SKILL.md` | only where their own text models output (the `***…***` labels); instruction prose is otherwise left alone |
| `tools/md-profile-check.ts` + `tools/md-profile-check.test.ts` | **new, dev-only:** a linter and words-equal comparer, run with `node` (v24 strips types natively; no dependencies) and tested with `node --test` |
| `tests/markdown-profile/probe.md` | **new:** the synthetic probe file, committed (no story content, so safe in a public repo) |
| `README.md`, `guides/installing.md` | Notion’s caveat reworded; v0.21 changelog |

**The profile, as a starting hypothesis for the probe to confirm or correct.** Each line is a candidate; the probe decides.

- **Blocks:** exactly one blank line between blocks, including between a heading and its first paragraph; no blank lines inside a list; no whitespace-only lines; no trailing spaces; exactly one final newline.
- **Headings:** `#` to `####` only.
- **Emphasis:** `*italic*`, `**bold**`, `~~strike~~`; a span never shares a delimiter boundary with another span (no `***`, no `**x *y***`), never wraps or touches an inline code span (close the emphasis before the code), and never starts or ends inside a word. Bold-italic: `***x***` around a whole span if the probe keeps it, else bold only.
- **Lists:** `- ` bullets and `1. ` numbers with one space after the marker; two spaces per nesting level; to-dos `- [ ]` and `- [x]`. A numbered list is one contiguous run starting at `1.`. Numbering that must continue across a heading moves into the text (a numbered heading or a bold number lead-in).
- **Quotes:** every line starts with `> `; a paragraph break inside a quote is a lone `>` line; no lists inside quotes.
- **Line breaks:** a line break inside a paragraph is a bare newline (the binding sends it as `<br>`), never two trailing spaces.
- **Tables:** pipe tables only, in one fixed form (`| a | b |`, separator `|---|---|`, an empty cell `|  |`); no raw HTML tables.
- **Rules and breaks:** `---` for a rule; `* * *` for a scene break (the binding already escapes it).
- **Characters:** ordinary spaces, never nbsp; curly quotes and dashes as the author writes them.
- **Paths and filenames** in prose go in code spans, so their underscores and `.md` aren’t read as emphasis or autolinks.
- **HTML:** none in plugin output; HTML comments in author text are kept but show in Notion (already reported once).
- **Probe these specifically:** bold-italic forms; ordered lists after headings; multi-paragraph quotes in the `>`-on-every-line form; bare-newline versus trailing-space breaks; Obsidian syntax in author vaults (`[[wikilinks]]`, `==highlight==`, `> [!note]` callouts), so the profile can say whether each survives as literal text; filenames with underscores in prose with and without code spans; nested emphasis inside table cells.

**The change, goal-shaped.** The profile is a description of output, the same kind of thing as a schema in `file-schemas.md`. Writers produce it because the doc they already read says to, not because a skill walks them through it. Normalization of author text is model work, guided by the rewrite table (a known transform, but there is no runtime script in Cowork and the plugin can’t depend on Bash). Its guardrails are the checker’s words-equal comparison in testing and, at runtime, the preflight’s approval plus the binding’s one-line report. Scope is the hard line: the profile governs what the plugin writes. On local and Dropbox, author files stay byte-for-byte; a skill editing part of an author file writes its own new text in profile form and leaves the author’s surrounding text untouched.

**Sequence:**
1. **Probe first.** Write `tests/markdown-profile/probe.md`, round-trip it through a Notion test project (`sb6-probe` in the `StoryStormer` hub), and record the per-construct results. This gates the rest; if a hypothesis above fails, the profile follows the evidence.
2. **Profile, checker and citations:** write `markdown-profile.md`, `tools/md-profile-check.ts` with its tests, and the `file-schemas.md` and `prose-spec.md` citations, and fix the output-format specs.
3. **Binding, migrate and init:** the Notion write-side normalization and report, migrate’s preflight and exact matching, and init intake in profile form.
4. **Verify:** lint the plugin’s output, check idempotence and words, run the `notion-mini` round trip, then the full ring.
5. **Release:** version, validate, README and guide, land on `main`.

**Fixtures.** The repo is public, so no story content goes into it. The probe is synthetic and committed. The `notion-mini` cut and the 148-file The Good Dog copy are rebuilt in a scratch folder from Rob’s source (`~/Markdown/Bobby's Vault/Claude/creative/the-good-dog`, skipping `experiments/`). `notion-mini` holds 12 decisions and 14 questions with their frontmatter and preamble, the full `state.md`, two bios with a legacy `tier:`, one worldbuilding entry with a legacy `category`, the primer (which holds a raw HTML table), and the init archive with underscored filenames. Its recipe is recorded in the as-built notes so a later run can rebuild it.

---

## 3. Invariants & Scope

**Invariants this must respect:**
- Skills say what to produce, not step-by-step procedure.
- No Bash dependency at runtime (the checker is dev-only and no skill cites it).
- Nothing escapes the bundle; skills never name a connector or host tool.
- The source of a migration is never modified.
- Author text on local and Dropbox is never reformatted outside the plugin’s own edit.
- A normalization of author content is always visible: approved in migrate’s preflight, reported in one line on any other Notion write.
- The release checklist applies.

**Out of scope:**
- Reformatting existing local or Dropbox projects in place. A “tidy my project” command could come later if Rob wants one.
- Notion-specific rich features the profile could unlock (callout blocks, toggles, colors).
- Changing the plugin’s instruction prose (SKILL.md and reference text the model reads) beyond examples that model output.
- Backends other than Notion; Dropbox and local already round-trip byte-clean.
- ISSUE073 (whole-file log rewrites, a separate cost question).

---

## 4. Verification

The success criteria are the verification, in sequence order. Expected outcome: most of the hypothesis holds; bold-italic and the Obsidian constructs are the likeliest to need a fallback. The `notion-mini` round trip comes back byte-clean apart from migrate’s documented changes, and the full ring follows.

A probe construct that comes back changed is excluded from the profile and gains a rewrite; it is not a failure. A real failure is a word-level difference after normalization, a non-idempotent normalization, or a profile-form document that Notion changes. Each of those gets classified (profile wording, binding wording, connector limit) and fixed in place before release.

**Dependencies:** Notion connector in the Claude Code session; a `StoryStormer` hub test project (`sb6-probe`, `sb6-mini`, `sb6-ring` slugs), trashed at the end and listed for Rob; Rob’s The Good Dog source folder readable; 0.20.1-poc on `main`.

**Open questions for Rob:**
1. **Tidy author files on local when a skill edits them?** (a) No: only the plugin’s own new text is in profile form **(recommended;** your Obsidian files stay yours), (b) yes, normalize the whole file on any plugin edit.
2. **The Notion write-side safety net:** (a) normalize and report one line **(recommended)**, (b) stop and ask before any normalizing write.
