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
6. **The web app:** a companion change, **AP5 piece 5** (`~/Git/storystormer/.plans/AP5-server-storage-contract.md` § 5; folded in from CL100), gives the app a journal and has the MCP serve the same per-entry paths, so the future StoryStormer binding (AP4) sees the same layout.

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
- [x] **Decision entries:** `file-schemas.md` defines `decisions/D-###.md`. The frontmatter holds the structured fields (`id`, `date`, `type`, `scope`, `topic`, `source`, `integrated`, `superseded_by`, plus `affects_books` in a series); the body holds Summary, Details, Affects and any free text, in the SB6 profile.
- [x] **Question entries:** `questions/Q-###.md`, the same way (`id`, `priority`, `category`, `scope`, `title`, `status`, `resolved_by`, `source`, `date`; the body holds Question, Why it matters, Possible approaches, Dependencies, Resolution).
- [x] **Indexes:** `decisions/_index.md` and `questions/_index.md`, one table row per entry (ID, date or priority, type or category, topic or title, integrated or status, superseded or resolved-by). About 9 KB for The Good Dog’s decisions.
- [x] **Journal:** `journal/<YYYY-MM-DD>-s<NN>.md`, one entry per session. Frontmatter: `date`, `session`, `skills`, `decisions` (IDs logged), `questions` (IDs opened or resolved). The body narrates what was done and why. Created by the session’s first write, edited (never rewritten whole) by later steps in the same session.
- [x] **Slim `state.md`:**
  - **Sections:** frontmatter, Summary, What Exists (one line per artifact: version, date, count; no narrative), What’s Next (forward items only, at most about five), and Last Session (two or three sentences plus the journal entry’s path).
  - **No other sections.** A finished item leaves What’s Next for that session’s journal entry.
  - **Size:** under about 4 KB after a full development loop on The Good Dog.
- [x] **Field ownership:** each field duplicated between `state.md` and `config.json` has one owner, and the mirror is gone. Rule: `config.json` owns only what resolution needs before the store is known (`storage`), plus whatever the trace in § 2 shows has to be read before `state.md`; `state.md` owns what the author sees.
- [x] **New entries:** `store.write(path, content, new)` fails when the path exists; each binding realizes it; the store reports the number it assigned (§ IDs on Notion, display numbers in the app), and skills use the reported number.
- [x] **Readers:** no skill reads a whole log to find something the index answers. Reads go index first, then the entries needed (the last ten decisions, open questions, cited IDs). Full-collection reads stay with `migrate` and audits, fanned out to subagents.
- [x] **Upgrade:** `migrate` upgrades an old-layout project in place on any backend, with the preflight as the plan:
  - **Logs:** split each log into entry files with every entry’s text kept.
  - **History:** move `## Previous Session` and finished What’s Next / What Exists narrative into journal entries.
  - **Indexes:** write them.
  - **Old files:** snapshot the old monolithic files to `.storystormer/history/<timestamp>-layout-upgrade/` and remove them from the root.
  - **Marker:** set `layout: 2` in config. Resolution offers the upgrade when it finds an old layout.
- [ ] **Live:** The Good Dog copy, upgraded, passes the development and chapter loops on local, Dropbox and Notion (**met**). Dropbox `treatment-update` lands within about 1.3× local’s time (**not met: 1.5×**, see § Live verification). The ring local → Notion → Dropbox → local diffs clean apart from migrate’s expected changes.
- [x] **Release:** version bumped, validated, on `main`; guides and README updated.

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
2. **A computed whole-log view** (`decisions.md` as a read-only rendering) on Notion and the app: **no** (**decided**, Rob, 2026-10-24), for parity; the index is the overview everywhere.
3. **An Obsidian Bases view** shipped by `init` and the layout upgrade on local: a small follow-up after SB7 (**decided**, Rob, 2026-10-24). It filters on two entry fields rather than folder paths, so SB7’s entry frontmatter carries them from the start: `storystormer_project` (the slug) and `storystormer_kind` (`decision`, `question`, `journal`). Skills rebuild a stored `_index.md` whenever an entry is newer than it, since an edit made in Bases changes an entry’s frontmatter directly.

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

---

## Implementation notes (as built)

### Slice 1: the schema and the store contract (2026-10-25)

**Files:** `references/file-schemas.md`, `references/store.md`.

- **`file-schemas.md`:** § `decisions.md` and § `questions.md` are replaced by § Entry collections (shared rules), § `decisions/`, § `decisions/_index.md`, § `questions/`, § `questions/_index.md`, § Who rebuilds an index, § `journal/` and § The old layout. § `state.md` is slimmed (four sections, about 4 KB, the journal rule in the update rules, the series-level example cut to match) and now holds § Target word count, moved from the config section because `state.md` owns the target. § `.storystormer/config.json` is down to `layout` and `storage`.
- **`store.md`:** `store.write(path, content, new)` and § New entries (create-only, the number the store assigns and reports); § Resolve step 4, the layout check; both indexes in the Local-mode clauses; the concurrency guard’s whole-document list is now `state.md` and entries, and a `new` write needs no guard; the `storage_kind` mirror sentence is gone.

**Field-ownership trace.** Every key in `state.md` frontmatter and `config.json`, with who reads it (grep over `skills/`, `commands/`, `references/`, 2026-10-25). Only `storage` and `layout` must be known before `state.md` can be read: resolution needs `storage` to bind the store at all, and `layout` says what shape `state.md` and the logs are in. Nothing else is read before `state.md`: every skill that reads the target, the series fields or the title reads `state.md` in the same step or earlier.

| Key | Readers | When read | Owner | What the other file does now |
|---|---|---|---|---|
| `storage` (`kind`, `root`, `local_root`) | `store.md` § Resolve and the locator; every binding’s root; `migrate` (flip, hybrid); `init` (pointer); Dropbox § Locate | before the store is bound | `config.json` | `state.md`’s `storage_kind` mirror is dropped (no reader found; only `init`, `migrate`, Dropbox and Notion wrote it). The What Exists **Storage** line stays: it is author prose, not a mirror |
| `layout` (new) | `store.md` § Resolve step 4; `migrate`’s layout upgrade | right after binding, before `state.md` | `config.json` | not in `state.md` |
| `title` | Dropbox and Notion § Locate (`state.md` first, config as fallback); `migrate` preflight (named the title disagreement; Notion keeps `state.md`’s); `switch`; outline skills | with or after `state.md` | `state.md` | removed from the config. The SB5 re-verify’s double title is gone |
| `project_type` | every skill’s series check (“if `state.md` shows `project_type: series`”); `series.md`; Notion | with `state.md` | `state.md` | removed from the config |
| `target_word_count` | `treatment-update`, `pre-outline-session` (read from the config today), `migrate`, `init`, `series.md`, Notion | after `state.md` (the same read step) | `state.md` (moved from the config) | removed from the config. In a series, a book’s own target lives in `books/<slug>/state.md`, absent meaning the series-level value |
| `genre`, `genre_secondary` | `genres.md`, skills choosing craft references, Notion | with `state.md` | `state.md` | removed from the config |
| `created` | `init` writes; Notion | with `state.md` | `state.md` | removed from the config |
| `surfacing_mode` | `philosophy.md`, `genres.md` (both cite `state.md`) | with `state.md` | `state.md` | removed from the config |
| `books` | `switch` (already treats `state.md` as owner), `decision-capture` (reads the config’s list for the scope slug), `brainstorm-session`, `series.md`, every series path resolution, Locate | after the root `state.md` | root `state.md` | the config’s `books` array is removed; each book’s title and own target move to `books/<slug>/state.md` |
| `current_focus` | `switch`, `brainstorm-session` (both files), `pre-outline-session`, `outline-chapters`, `prose`, `treatment-update`, `series.md` | after the root `state.md` | root `state.md` | removed from the config; `switch` no longer writes two files |
| `logline`, `stage`, `initial_maturity`, `last_session`, `session_count`, `parent_series` | Locate (`stage`, `last_session`), `treatment-update`, `init`, `switch`, `series.md`, Notion | with `state.md` | `state.md` | never in the config; unchanged |

**Decisions made in this slice** (the plan left these open):
- **The config is two keys** (`layout`, `storage`), not a smaller mirror. The trace found no field outside those two read before `state.md`, and the plan’s rule says the mirror goes.
- **The target moves to `state.md`.** It was config-owned for no reason the trace could find; per book, presence means the book’s own target and absence means it inherits.
- **An old-layout project is read-only until upgraded.** Resolution offers the upgrade; until it runs, a session reads but writes nothing the layout changes. No skill needs to understand both layouts.
- **`integrated`** is text starting with `yes`, `no`, `partially` or `n/a`, so real values with qualifiers (`n/a — governs future work`) keep their words; in a series it is a block list of `<slug> treatment <state>` items (a block list, since items may hold commas).
- **No `resolves` field on decisions.** A question’s `resolved_by` is the one owner of that link; an older decision’s `**Resolves**:` line stays in its body as written.
- **`retracted`** (a date) added to decisions for parity with the app’s tombstones (ISSUE067 in the web-app repo).
- **Journal entries carry `source`** (`plugin` or `app`) for parity with AP5 § 5’s `projectJournal.source`. The app’s `title` was not added: the body’s first sentence serves.
- **Retired types and categories are kept as written** in carried-over entries (`premise`, `process`, `methodology` included) and read as the closest of the current set, rather than rewritten by the upgrade.
- **`questions` `date` may be absent** on a carried-over entry whose log never recorded one; the upgrade doesn’t invent dates.
- **No H1 in `state.md`.** The four sections and nothing else; the title is in the frontmatter.
- **Index staleness is detected from content, not timestamps:** a listing showing an entry the index lacks, or an entry whose frontmatter disagrees with its row. The contract has no modification-time operation, and this catches Bases edits.

**Review fixes (Fable review of 4f4b66c, coordinator’s decisions, 2026-10-25):**
- **Index upkeep is per row:** the writing skill edits only its own row; a full rebuild (frontmatter-only reads) happens only when the listing’s and the index’s ID sets disagree, and a skill reading an entry anyway fixes a disagreeing row.
- **Sessions belong to the root:** the root `state.md`’s `session_count` numbers the journal; per-book `state.md` carries neither `session_count` nor `last_session` (my call: `last_session` is the same session record, and Locate reads the root’s).
- **Journal number:** one more than the higher of `session_count` and the highest `sNN` listed; the entry is created with `new` first, then `state.md` takes that number.
- **`slug`** added to the root `state.md`, set once; entries copy it into `storystormer_project`.
- **Empty and ordering rules:** empty collections start at `001`; `init` writes header-only indexes and `journal/<date>-s01.md`; numbers compare numerically.
- **Carried-over entries:** `integrated` and `source` may be absent on decisions (missing `integrated` means not integrated); `date` and `source` on questions; the upgrade composes question titles from the question’s words and says so.
- **Frontmatter is authoritative:** a skill changing `status`, `resolved_by`, `superseded_by` or `integrated` updates or removes the matching kept body line in the same edit.
- **Old layout:** a would-be writer stops before any write; a cross-backend `migrate` writes the target in layout 2 and leaves the source alone; `storage_kind` and the `state.md` H1 are dropped and named in the preflight.
- **Smaller fixes:** `integrated: "no"` quoted; the 4 KB budget excludes carried lines; subagent briefs carry the layout; the questions index is `# Questions`.
- **Deferred to the binding slice:** Dropbox `ALREADY_EXISTS` retry, Notion’s effective-target rendering.

**Follow-ups for later slices** (other files that must change): see the slice 1 report in the session; the main ones are the three bindings (`new` realization, collections in the Notion path map, the Journal database, retiring computed logs and `storage_kind`, the computed config down to two keys and a layout marker), `migrate` (layout upgrade, config flip keeps only `storage` plus `layout`), `init` (writes `layout: 2`, no mirrors, no `storage_kind`), `switch` (writes `state.md` only), `decision-capture` (book slugs from `state.md`, entries with `new`), `pre-outline-session` and `treatment-update` (target from `state.md`), and `series.md` (config is no longer a mirror; per-book targets in per-book `state.md`; the log rows in its tables).

### Ring findings fix (2026-10-25)

**Files:** `references/file-schemas.md`, `references/store/notion.md`, `references/store/dropbox.md`, `skills/notes/SKILL.md`, `skills/migrate/SKILL.md`.

- **What Exists labels (D8):** `file-schemas.md` § `state.md` now lists **Blueprints** and **Chapter notes** in its example and names every computed label, in Notion’s line order. The notes skill’s line is renamed **Chapter notes**, so an author’s **Notes** line (about `notes/`) is a carried line. `migrate`’s preflight reads an old-form **Notes** line that counts chapter notes as the computed line, by its content.
- **Completed moves (R1):** `migrate` § Same slug has a **Complete** case: a target with its own config and `state.md` and nothing to flip is already there; the skill offers to bind it or do nothing, and never re-verifies unasked.
- **Flip-pending re-verification (R2):** by listing, sizes and (on Notion) counts; a document is compared whole only on evidence of a change, and the preflight plan says so.
- **Dropbox reads (L3-2, L3-3):** a fetch of about 65 KB or more may come back as a saved result rather than inline; its content is read from there, never retyped. Listed paths are used exactly as listed; `&amp;` in a filename is never decoded.

- **Old layout read-only until upgraded:** confirmed by Rob, 2026-10-25.

### Live verification (2026-10-25, at 56788bb, then c34df20 and 834ed55)

- **Upgrade:** the old-layout Good Dog upgraded in place on local, Dropbox and Notion. `upgrade-check` clean on all three (68 decisions, 41 questions), journal backfilled s01–s12. Notion's interruption test (stopped at 36/109 rows, resumed) kept every converted row and converted the rest.
- **Loops:** the development and chapter loops passed on all three backends. `treatment-update`: local 446 s (SB5 539 s), Dropbox 669 s (1.5×, SB5 2.2×; **misses the 1.3× target**, measured before Dropbox's batched small-file deletes landed, so not re-measured), Notion 1,714 s wall with author review. Notion's `state.md` row fetch went from about 70 KB to about 30 KB. Final `state.md` on the mature project: 3.9 KB local, 4.1 KB Notion, 5.2 KB Dropbox (author-approved forward text), carried lines excluded.
- **Numbering races:** the Dropbox and Notion `new` writes renumbered and reported correctly. Local's first realization let the Write tool overwrite another session's D-080; fixed (Glob immediately before Write, then read back) and re-tested: the other device's file survived. Notion's journal-collision cleanup now withdraws the losing row instead of trashing it (the connector trashes only on the author's explicit ask).
- **Ring** local → Notion → Dropbox → local (`sb7-ring`, 216 documents): every entry kept its number on every leg; leg 3 byte-identical to leg 2. (b) list: the questions index's `./D-###` links (fixed), an autolinked `state.md` inside bold (fixed: profile row), `craft-document.md:241` (named, no in-profile form), and two What Exists author lines Notion computed (fixed: Blueprints and Chapter notes are computed labels). Leg times 4,532 / 3,853 / 1,549 s.
- **Resume:** an interrupted local → Dropbox move was detected and resumed (identical files no-ops, a changed one shown and rewritten); its findings (slug-change allowance, configless-folder search) are fixed.
- **Fix commits after the slices:** be0ca8b, 8168de8, 8e870c4 (live-run findings, reviewed by Fable), 834ed55 and 8f3ae2b (ring and resume findings, reviewed by Fable).
- **Left open:** the 1.3× Dropbox target (re-measure with batched deletes); ISSUE072 items 19–25 (chapter pipeline); the untested autolink extensions in `probe-results.md`.
