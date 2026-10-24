# SB7 — Entry Collections: Decisions, Questions and a Journal as One Entry per File; a Slim `state.md`

## TL;DR for Rob

**The problem:** Three documents grow forever and are stored as single files: `decisions.md` (115 KB on The Good Dog), `questions.md` (about 45 KB), and `state.md`, which is 53 KB because 36 KB of it is session history the schema never asked for. Every skill reads them whole, and on Dropbox every one-line change rewrites the whole file: the main reason Dropbox ran at twice local’s time in SB5 (ISSUE073, big logs rewritten in full on every change). Notion and the StoryStormer app already store these as records; local and Dropbox store a blob, so the backends don’t match.

**The approach:** Every backend stores **entries**:
- **Three collections:** `decisions/D-078.md`, `questions/Q-041.md` and a new `journal/2026-08-22-s11.md`, each entry its own file (local, Dropbox), row (Notion) or record (app). Decisions and questions each get a small `_index.md`.
- **A slim `state.md`:** only “now, just did, next”, a few KB. Everything historical goes to the journal.
- **One owner per field** between `state.md` and `.storystormer/config.json`.
- **A one-time upgrade** for existing projects, run through `migrate`.

**Tier:** FULL (schema change across every binding and most skills) · **Judgment profile:** judgment

**What changes:**
1. **`file-schemas.md`:** entry files, indexes and the journal replace the three monolithic shapes; `state.md` gets a size budget and strict sections.
2. **`store.md`:** a `new` mode on `write` (create, never overwrite) and the rule that the store reports the number it assigned.
3. **All three bindings:** realize the collections. On Notion, this replaces most of SB5’s log-entry preservation machinery with the ordinary frontmatter ↔ properties rule.
4. **The skills that read or write the logs or `state.md`:** they address entries, not log text.
5. **`migrate`:** gains the in-place layout upgrade.
6. **The web app:** a companion change, **AP5 piece 5** (`~/Git/storystormer/.plans/AP5-app-side-finish.md` § 5; folded in from CL100), gives the app a journal and has the MCP serve the same per-entry paths, so the future StoryStormer binding (AP4) sees the same layout.

**Why it matters:**
- **Parity:** the same layout on all four backends.
- **Speed:** Dropbox writes shrink from about 115 KB to about 1 KB per decision.
- **Context:** every session stops loading about 13k tokens of stale history.
- **Safe numbering:** creating `D-078.md` fails if it already exists, so two sessions can’t both take the same number.

**Depends on:** SB6 (portable markdown profile) first, so entry bodies are written in the profile from day one.

---

## 1. Problem & Success

**What:** Replace the three append-mostly documents with entry collections on every backend, and cut `state.md` to a dashboard.

**Why:** SB5 measured the cost:
- **Dropbox:** `treatment-update` took 1,190 s against local’s 539 s, re-emitting about 315 KB to change about 4 KB of prose.
- **Notion:** every `state.md` write first re-fetches a 67–71 KB Projects row to check it hasn’t changed.

Rob’s rule (2026-10-24): whatever runs on local and Dropbox must also run on Notion and the StoryStormer MCP, with as much parity as possible.

**Success criteria** (each independently verifiable):
- [ ] **Decision entries:** `file-schemas.md` defines `decisions/D-###.md`. The frontmatter holds the structured fields (`id`, `date`, `type`, `scope`, `topic`, `source`, `integrated`, `superseded_by`, plus `affects_books` in a series); the body holds Summary, Details, Affects and any free text, in the SB6 profile.
- [ ] **Question entries:** `questions/Q-###.md`, the same way (`id`, `priority`, `category`, `scope`, `title`, `status`, `resolved_by`, `source`, `date`; the body holds Question, Why it matters, Possible approaches, Dependencies, Resolution).
- [ ] **Indexes:** `decisions/_index.md` and `questions/_index.md`, one table row per entry (ID, date or priority, type or category, topic or title, integrated or status, superseded or resolved-by). About 9 KB for The Good Dog’s decisions.
- [ ] **Journal:** `journal/<YYYY-MM-DD>-s<NN>.md`, one entry per session. Frontmatter: `date`, `session`, `skills`, `decisions` (IDs logged), `questions` (IDs opened or resolved). The body narrates what was done and why. Created by the session’s first write, edited (never rewritten whole) by later steps in the same session.
- [ ] **Slim `state.md`:**
  - **Sections:** frontmatter, Summary, What Exists (one line per artifact: version, date, count; no narrative), What’s Next (forward items only, at most about five), and Last Session (two or three sentences plus the journal entry’s path).
  - **No other sections.** A finished item leaves What’s Next for that session’s journal entry.
  - **Size:** under about 4 KB after a full development loop on The Good Dog.
- [ ] **Field ownership:** each field duplicated between `state.md` and `config.json` has one owner, and the mirror is gone. Rule: `config.json` owns only what resolution needs before the store is known (`storage`), plus whatever the trace in § 2 shows has to be read before `state.md`; `state.md` owns what the author sees.
- [ ] **New entries:** `store.write(path, content, new)` fails when the path exists; each binding realizes it; the store reports the number it assigned (§ IDs on Notion, display numbers in the app), and skills use the reported number.
- [ ] **Readers:** no skill reads a whole log to find something the index answers. Reads go index first, then the entries needed (the last ten decisions, open questions, cited IDs). Full-collection reads stay with `migrate` and audits, fanned out to subagents.
- [ ] **Upgrade:** `migrate` upgrades an old-layout project in place on any backend, with the preflight as the plan:
  - **Logs:** split each log into entry files with every entry’s text kept.
  - **History:** move `## Previous Session` and finished What’s Next / What Exists narrative into journal entries.
  - **Indexes:** write them.
  - **Old files:** snapshot the old monolithic files to `.storystormer/history/<timestamp>-layout-upgrade/` and remove them from the root.
  - **Marker:** set `layout: 2` in config. Resolution offers the upgrade when it finds an old layout.
- [ ] **Live:** The Good Dog copy, upgraded, passes the development and chapter loops on local, Dropbox and Notion. Dropbox `treatment-update` lands within about 1.3× local’s time. The ring local → Notion → Dropbox → local diffs clean apart from migrate’s expected changes.
- [ ] **Release:** version bumped, validated, on `main`; guides and README updated.

---

## 2. Where & How

**Files in play:**
| File | What changes |
|------|--------------|
| `references/file-schemas.md` | § `decisions.md`, § `questions.md` become § `decisions/`, § `questions/` (entry and index shapes); new § `journal/`; § `state.md` slimmed with a size budget; § `.storystormer/config.json` ownership rewritten, `layout` added |
| `references/store.md` | `write` gains `new`; the number-reporting rule; Local-mode clauses list the two indexes; the concurrency guard’s whole-document case for logs goes away (an entry has its own small file) |
| `references/store/local.md` | `new` realization (list, then create; single writer) |
| `references/store/dropbox.md` | `new` realization (a create that refuses an existing path; probe the connector first) |
| `references/store/notion.md` | path map: `decisions/D-###.md` and `questions/Q-###.md` → rows, with body = page content and frontmatter ↔ properties as for Assets; `_index.md` computed; a new **Journal** database (schema upgrade); computed `decisions.md`/`questions.md` and the log `Head`/`_layout`/header-part override rules retired; `state.md` simplified |
| `skills/decision-capture`, `treatment-update`, `brainstorm-session`, `canon-sync`, `pre-outline-session`, `character-bio`, `worldbuilding-entry`, `outline-chapters`, `storystormer-init` | address entries and indexes; every skill that writes Last Session also writes the session’s journal entry |
| `commands/decisions.md`, `questions.md`, `status.md`, `switch.md`, `checkpoint.md` | list and filter from the indexes; `status` can show recent journal entries |
| `references/reading-discipline.md`, `series.md`, `plan-first.md`, `canon-schemas.md`, `philosophy.md` | log references updated |
| `skills/migrate/SKILL.md` | per-item table rows for the collections and journal; the in-place layout upgrade |
| `guides/*.md`, `README.md` | the new layout, in author terms |

**The change, goal-shaped:**

- **One file per entry is the database on file stores.** A file is a row and its frontmatter is the columns. The index is the one cheap overview (stored on local and Dropbox and regenerated by the writing skill, like `characters/_index.md`; computed on Notion and in the app). The journal needs no index: filenames sort by date.
- **The entry’s number comes from the store,** as it already does on Notion. On file stores it is one more than the highest in the folder listing, written with `new`, so a collision fails instead of overwriting, and the skill takes the next number. In the app, numbers are display numbers by creation order (`lib/mcp/displayNumbers.ts` in the web-app repo), reported back the same way.
- **Notion gets simpler.** A log entry today renders from a row through `_layout` placeholders and per-header-part overrides, because the source was one big file. With one page per entry, the entry body is the page content and the frontmatter is the properties: the rule Assets rows already use. Keep SB5’s preservation for frontmatter (`_keys`, `_as_written`, `_derived`) and retire the log-specific machinery.
- **The upgrade is model-shaped,** not a parser: real logs carry extra fields, status prose and header suffixes (SB5 § Notion findings). Verification is not model-shaped: a dev-only check (beside SB6’s checker under `tools/`) compares the multiset of words in the old log against the entry files, and the entry counts.
- **Field-ownership trace first.** Before changing ownership, list every key in both `state.md` and `config.json` and every skill or binding that reads each one. The SB5 re-verify found the title in both and Notion able to keep only one. Decide each owner from what reads it and when, and record the table in the as-built notes.

**Open decisions** (recommendations marked; take them unless Rob says otherwise):
1. **Journal granularity:** one entry per session (**decided**, Rob, 2026-10-24). The app writes entries from its own chat sessions too (AP5 § 5).
2. **A computed whole-log view** (`decisions.md` as a read-only rendering) on Notion and the app: **no (recommended)**, for parity; the index is the overview everywhere.
3. **An Obsidian Bases view** (`decisions.base`) shipped by `init` on local: follow-up, not this plan.

---

## 3. Invariants & Scope

**Invariants this must respect:**
- **Store contract:** skills address `references/store.md`, never a tool by name.
- **No Bash dependency:** the dev check is never cited by a skill.
- **Nothing escapes the bundle.**
- **Entries are never deleted, only superseded or invalidated:** the app’s display numbers depend on it (ISSUE067 in the web-app repo).
- **The upgrade never touches the source of a cross-backend `migrate`:** in place, it snapshots before it removes anything.
- **Plan-first:** the upgrade’s preflight is the plan.
- **Release checklist:** both manifests bumped, `claude plugin validate .` passes, landed on `main`.

**Out of scope:**
- **The StoryStormer binding itself:** AP4 (still pending).
- **The app side:** AP5 § 5 in the web-app repo.
- **Retention rules for the journal:** it grows forever, but nothing reads it by default.
- **Obsidian Bases.**

---

## 4. Verification

**Checks:**
- **Upgrade fidelity:** the dev word-multiset check on the upgraded Good Dog copy; entry counts match the old logs’ headers.
- **State size:** `state.md` stays under about 4 KB after a loop; one journal entry per session.
- **Live loops:** the SB5 development and chapter loops on local, Dropbox and Notion, with SB5’s measurements repeated (the target is Dropbox `treatment-update` within about 1.3× local).
- **Numbering race:** a forced collision (two `new` writes of the same number) fails the second and takes the next number.
- **Ring:** local → Notion → Dropbox → local diffs clean apart from migrate’s expected changes.

**Expected outcome:** Dropbox’s gap to local closes most of the way; Notion’s binding loses about a third of its log rules.

**Dependencies:**
- **SB6** on `main`.
- **Connectors:** Dropbox and Notion connected in the Claude Code session.
- **A fresh copy of The Good Dog** (the SB5 scratch fixture was partly cleaned up).
- **AP5 piece 5,** for app parity (not needed to ship SB7 on the three plugin backends).
