# SB3 — Backend Bindings: Local, Dropbox, and Notion (Five Databases)

## TL;DR for Rob

**The problem:** After SB1 and SB2 the skills speak the store contract, but only the local folder answers. Dropbox and Notion are connected to the author's Claude but the plugin has no instructions for using them.

**The approach:** Three binding documents, one per backend, each saying how every contract operation is realized with that connector's tools, what its capabilities line is, and what its quirks are. The local binding writes down what the plugin already does. The Dropbox binding mirrors the local tree and realizes overwrite as delete + create. The Notion binding is the big one: five linked databases under a hub page, a path map from the plugin's paths to rows and properties, and the DDL `init` runs to create the databases.

**Tier:** FULL — the Notion path map is a new schema; Dropbox's overwrite semantics are a load-bearing workaround · **Judgment profile:** judgment

**What changes:**
1. **`references/store/local.md`** — *moved to SB1 (decision 2026-10-15); already on `main` when SB3 starts.* SB3 only adds it to anything SB1 left out.
2. **`references/store/dropbox.md`** — mirror tree under `/StoryStormer/<slug>/`, delete-create writes, read-modify-write edits.
3. **`references/store/notion.md`** — hub page, Projects / Assets / Chapters / Decisions / Questions databases, frontmatter ↔ properties, the path map, DDL, computed documents.

**Why it matters:** This is the release where a story can live somewhere other than a laptop.

---

## 1. Problem & Decisions

**What:** The three bindings for SB1's contract. Design: CW5 § 3 (verified capabilities), § 6 (Notion), § 7 (Dropbox). Research verified 2026-10-11 against Rob's live connectors.

**Why:** Each backend has one or two non-obvious realizations (Dropbox cannot update in place; Notion has no paths) that must be written down once or the model will improvise differently every session.

**Key decisions** (resolved):
- **Tools are named "the <Connector> connector's `<short name>`".** Each binding opens with the short tool list it expects (Dropbox: `list_folder`, `fetch`, `create_file`, `create_folder`, `delete`, `move`, `search`, `get_file_metadata`; Notion: `search`, `fetch`, `create-pages`, `update-page`, `create-database`, `update-data-source`, `query-data-sources`, `move-pages`) and a "verified on" date. Resolution fails loudly when a listed tool is missing.
- **Local binding capabilities:** `identity: path · write: native · edit: native · list: glob · history: snapshots · open: pane · size: unbounded · confirm: none`. Snapshots, indexes and `config.json` are stored.
- **Dropbox binding capabilities:** `identity: path · write: delete-create · edit: read-modify-write · list: folder-walk · history: snapshots · open: url · size: 5 MiB / 5 MB · confirm: batch`. Root `/StoryStormer/<project-slug>/`; the tree is byte-identical to local mode so a synced Dropbox folder is also a valid local project. `write` on an existing path: `delete` then `create_file`; on `ALREADY_EXISTS` wait one second and retry once (the delete is an async job). `edit`: `fetch`, apply the anchored edits in the model (fail the call if an anchor is missing or ambiguous), then the delete-create. `list`: one recursive `list_folder` from the root, paginate to `has_more: false`, filter by the glob in the model. `history`: the `.history/` convention written as files. `open`: the `url` the read returns. Paths are case-insensitive and must be NFC. The binding states that the plan-first approval is the confirmation for the run's writes and that the connector's per-mutation confirmation instruction is satisfied by it.
- **Notion binding capabilities:** `identity: id · write: native · edit: native · list: query · history: native · open: url · size: ~5k words sync, larger async · confirm: none`. Snapshots are not written; `checkpoint` is unsupported and says so; indexes, `state.md`, `decisions.md`, `questions.md` and `config.json` are computed.
- **Notion layout:** a hub page titled "StoryStormer" at the workspace's private root (created by `init` when absent, or bound when present); five databases as children of the hub; one Projects row per project (series books are Projects rows with a `Parent` relation). Every other row relates to its project. Unmapped paths become child pages of the project's Projects row, titled with the path.
- **Frontmatter ↔ properties.** On write, frontmatter keys land in the matching property and the markdown body becomes the page content; keys with no property are kept in a `Meta` rich-text property as `key: value` lines. On read, properties render as frontmatter in the plugin's key order from `file-schemas.md`, then the body. `Version` is a number property the skills bump exactly as they bump the frontmatter integer today.
- **Path map** (the descriptor table; the same path grammar AP2's `pathMap.ts` uses):

| Plugin path | Database | Selector |
|---|---|---|
| `state.md`, `.storystormer/config.json` | Projects | the bound row; computed documents, two writable `state.md` sections plus the frontmatter keys that are properties |
| `primer.md` · `treatment.md` · `manifest.md` · `series.md` · `outline/structure.md` · `.storystormer/genre-reference.md` | Assets | Kind = primer · treatment · manifest · series · structure · genre-reference |
| `characters/<slug>.md` | Assets | Kind = character, Slug = slug |
| `worldbuilding/<category>/<slug>.md` | Assets | Kind = worldbuilding, Category = category, Slug = slug |
| `research/<slug>.md` · `voice/style-guide.md` · `voice/writing-sample.md` | Assets | Kind = research · voice-style-guide · voice-writing-sample |
| `characters/_index.md` · `outline/_index.md` · `voice/README.md` | computed | rendered from a query; read-only |
| `chapters/chapter-NN/chNN-<artifact>.md` | Chapters | Chapter = NN, Artifact = outline · blueprint · prose · notes |
| `decisions.md` | Decisions | computed from all rows for the project; `decision-capture` creates a row |
| `questions.md` | Questions | computed; status changes update the row |
| `books/<slug>/…` | same tables | Book relation = the book's Projects row |
| anything else | child page of the Projects row | title = the path |

- **Database schemas** (DDL `init` runs through the Notion connector's `create-database`, Projects first so the relations can reference it). Show in full; these are the contract:

```sql
-- Projects
CREATE TABLE ("Name" TITLE, "Slug" RICH_TEXT, "Project Type" SELECT('novel','novella','short_story','screenplay','series'),
  "Genre" RICH_TEXT, "Genre Secondary" RICH_TEXT,
  "Stage" SELECT('concept','brain-dump','brainstorming','treatment-drafted','treatment-refined','canon-development','outlining','outline-drafted'),
  "Initial Maturity" SELECT('concept','brain-dump','brainstorming','treatment-drafted','treatment-refined'),
  "Surfacing Mode" SELECT('active','on-request'), "Created" DATE, "Last Session" DATE, "Session Count" NUMBER,
  "Target Word Count" NUMBER, "Current Focus" RICH_TEXT, "Storage Kind" SELECT('notion'),
  "Parent" RELATION('<projects-ds>', DUAL 'Books' 'books'), "Meta" RICH_TEXT)

-- Assets
CREATE TABLE ("Name" TITLE, "Project" RELATION('<projects-ds>', DUAL 'Assets'), "Book" RELATION('<projects-ds>'),
  "Kind" SELECT('primer','treatment','manifest','series','structure','genre-reference','character','worldbuilding','voice-style-guide','voice-writing-sample','research'),
  "Category" SELECT('major','supporting','minor','organization','location','geography','object','vehicle','weapon','technology','magic','creature','culture','history','religion','languages','lore'),
  "Tags" MULTI_SELECT(), "Slug" RICH_TEXT, "Version" NUMBER, "Last Updated" DATE, "Primer Version" NUMBER,
  "Authorship" SELECT('author_written','ai_generated','ai_generated_author_revised'), "Meta" RICH_TEXT)

-- Chapters
CREATE TABLE ("Name" TITLE, "Project" RELATION('<projects-ds>', DUAL 'Chapters'), "Book" RELATION('<projects-ds>'),
  "Chapter" NUMBER, "Artifact" SELECT('outline','blueprint','prose','notes'), "Title" RICH_TEXT, "POV" RICH_TEXT, "Act" RICH_TEXT,
  "Status" SELECT('new','drafted','revising','revised'), "Version" NUMBER, "Word Count" NUMBER,
  "Authorship" SELECT('author_written','ai_generated','ai_generated_author_revised'), "Last Updated" DATE,
  "Related Assets" RELATION('<assets-ds>'), "Summary" RICH_TEXT, "Meta" RICH_TEXT)

-- Decisions
CREATE TABLE ("Name" TITLE, "ID" UNIQUE_ID PREFIX 'D', "Project" RELATION('<projects-ds>', DUAL 'Decisions'), "Scope" RICH_TEXT,
  "Type" SELECT('character','plot','worldbuilding','theme','structure'), "Source" RICH_TEXT, "Date" DATE,
  "Integrated" SELECT('pending','treatment','primer','canon','n/a'), "Supersedes" RELATION('<decisions-ds>', DUAL 'Superseded By' 'superseded_by'))

-- Questions
CREATE TABLE ("Name" TITLE, "ID" UNIQUE_ID PREFIX 'Q', "Project" RELATION('<projects-ds>', DUAL 'Questions'), "Scope" RICH_TEXT,
  "Category" SELECT('character','plot','worldbuilding','theme','structure','voice','research'),
  "Priority" SELECT('critical','important','nice_to_resolve'), "Status" SELECT('open','resolved','deferred'),
  "Resolved By" RELATION('<decisions-ds>'), "Date" DATE)
```

  The Decisions `Type` and Questions `Category` option lists must match the app's enums after AP0 Part B; if AP0 has not landed when this executes, use the plugin's current values and note the mapping in the binding. Self-relations (`Parent`, `Supersedes`) are added with `update-data-source` after the table exists, per the connector's two-step rule.
- **Reads and writes on Notion.** `read` is one `fetch`; if `truncated` is set, re-fetch by section (the binding says how) and concatenate. `write` of a page over roughly five thousand words uses the async create and waits on the task before reporting. `list` is a SQL query over the relevant data source filtered by project (and book). `edit` is `update-page` with `update_content` search-and-replace, one operation per anchored edit, all-or-nothing by sending them in one call.
- **Locator roots** (SB4 uses them): Dropbox `/StoryStormer/`; Notion the hub page found by `search` for the title "StoryStormer" that has the five databases as children.

**Success criteria** (each independently verifiable):
- [ ] On a fresh Dropbox folder: `init` (SB4 provides the question; for this plan, hand-write `storage` in a local config and point it at Dropbox) → `decision-capture` → `character-bio` → `treatment-update` write and overwrite through the binding; the tree under `/StoryStormer/<slug>/` matches a local run file-for-file.
- [ ] `prose` revise mode on Dropbox: an anchored edit lands; an edit with a missing anchor fails the call and writes nothing.
- [ ] On Notion: `init`'s DDL creates the hub and five databases with the relations; `character-bio` creates an Assets row whose properties match the bio's frontmatter and whose body is the bio; `read` renders it back as the plugin's markdown with frontmatter in schema order.
- [ ] `decisions.md` and `questions.md` render from rows; `decision-capture` on Notion creates a row with the next `D-###`.
- [ ] A 4,000-word treatment writes and reads back whole on Notion; the binding's section-wise re-read is exercised once on a page long enough to set `truncated`.
- [ ] `checkpoint` on Notion refuses with the documented message; on Dropbox it writes the snapshot folder.
- [ ] `claude plugin validate .` passes; version bumped; landed on `main`.

---

## 2. Current State

**Relevant files:**
| File | Role / key lines |
|------|------------------|
| `references/store.md` (SB1) | the contract; its Bindings table gains the three rows |
| `references/file-schemas.md` | frontmatter keys per file; the property names above derive from them; § `.storystormer/config.json` for the `storage` block |
| `references/canon-schemas.md` · `frameworks.md` § Worldbuilding | the fourteen categories and the people tiers behind Assets `Category` |
| `skills/storystormer-init/SKILL.md` | gains the Notion DDL step (scaffold on Notion = create the hub and databases, then the Projects row) |
| `commands/checkpoint.md` | the refusal message for `history: native` |

**Patterns to mirror:** `references/prose-spec.md` for the register (an operational contract). AP2's `pathMap.ts` descriptor-table shape for the Notion path map (a table, never a switch on path strings).

---

## 3. Implementation (by change-area, goal-shaped)

### A. `references/store/local.md`
*Written in SB1 (decision 2026-10-15). Spec kept here for reference.* The current behavior, written as a binding: host tools by name (this is the one place they are allowed, with `store.md`), the snapshot conventions by reference to `file-schemas.md`, `open` = present the file in the host's pane.

### B. `references/store/dropbox.md`
Tool list and verified-on date; root convention; each operation's realization per the decisions; the retry rule; the confirmation clause; the quirks (case, NFC, 5 MiB, async delete, `path_display` for display and `path` for follow-on calls).

### C. `references/store/notion.md`
Tool list and verified-on date; hub and database layout; the DDL; the path map table; frontmatter ↔ properties rules including `Meta`; computed documents and how each renders (the SQL for `decisions.md`, `questions.md`, `characters/_index.md`, `outline/_index.md`, `state.md` What Exists counts); read, write, edit and list realizations; size handling; the `checkpoint` refusal; the locator root.

### D. Skill touch-points
`storystormer-init` gains "scaffold on Notion" (create hub if absent, run DDL, create the Projects row, then proceed as usual through the contract). `decision-capture`, `questions`-related skills and `manifest-sync` need no change if SB2's rewrite defers to the contract; verify and adjust only where a skill assumed `decisions.md` is a file it appends to (it must go through `store.write('decisions.md')` or the binding's append realization).

### E. Release
`store.md` Bindings table; README "where a story can live"; version bump; validate; `main`.

---

## 4. Verification & Testing

**Automated:** `claude plugin validate .`.
**Manual:** the success-criteria runs on Dropbox and Notion with a copied real project; screenshots of the Dropbox tree and of a Notion Assets row and the Chapters grid; the `treatment-update` snapshot-and-overwrite on Dropbox observed in Dropbox's version history.
**Adversarial check:** a fresh-context read of `store/notion.md` plus `store.md` only; the reader writes down how `blueprint` would gather "every character that surfaces in chapter 12" (a query over Assets and Chapters) without guessing a property name.

---

## 5. Risks & Mitigations

| Risk | Mitigation / detection |
|------|------------------------|
| Dropbox's async delete races the create | the retry rule; SB5 overwrites fifty times in a loop |
| A long treatment truncates on Notion `fetch` | the section-wise re-read; fallback decided in SB5 (one child page per act) |
| Notion option lists drift from AP0's enums | the binding carries the mapping; AP0 Part B updates it when it lands |
| Connector tool sets change | the verified-on date and the short tool list; resolution fails loudly |
| Relations in DDL need the data-source id before it exists | create Projects first; add self-relations with `update-data-source` |

---

## 6. Scope & Assumptions

- **Out of scope:** the onboarding question, the locator's UX and the `migrate` skill (SB4); the StoryStormer binding (AP4); Google Drive and OneDrive bindings (Tier 3, re-test in November 2026).
- **Required first:** SB1 and SB2 on `main`; a Dropbox and a Notion connector present in the test session.
- **Needs human judgment:** the Notion hub location when the author's workspace is a team workspace (private root vs a teamspace): ask once in `init`, default private.

---

**Implementation notes (as built):** 2026-10-16, `/implement SB3` on `feature/sb3-backend-bindings`, released as `0.19.0-poc`.

- **Slices:** (1) `references/store/dropbox.md`, Opus, live-probed; (2) `references/store/notion.md`, Opus, live-probed; (3) skill touch-points + release, Opus. Each reviewed by GPT-6.1 Sol: 14, 40 and 12 findings (13, 39 and 12 confirmed and fixed). Then two fresh-context end-to-end runs (Dropbox D1–D7 all pass; Notion N1–N7 five pass, two partial, both fixed) and one consolidated fix commit (`ac7aa6b`) for Sol’s slice-3 findings and the runs’ documentation findings.
- **Dropbox, observed vs. plan:** `fetch` appends exactly one trailing `\n` (the binding strips it; without this the byte-identical tree fails); `delete`/`move` always answer `in_progress`, so the write waits on `check_job_status` before the create instead of a fixed one-second wait (the `ALREADY_EXISTS` retry stays as a backstop); `create_folder` makes one level per call; recursive `list_folder` returns ns_paths with no `path_display`; `move` onto an existing file fails `to/conflict`; the folder’s stored casing wins. `check_job_status` joined the tool list. Size, guard and full-prior-read checks happen before any delete; one path per delete.
- **Notion, deviations forced by the connector:** per-project `Number` instead of `UNIQUE_ID` (prefix needs 2+ characters, counts per database, renders bare); `Type`, `Category` and `Tags` are text, not selects (selects reject unknown values, and adding one rewrites the option list); decision and question fields are properties (queries return properties only); `state.md` has three writable sections (Summary, What’s Next, Last Session), not two; Questions `Status` is open/resolved/invalidated. Added properties: `Logline`, `Type`, `Body Words`, `Markers`, `Open Proposals`, `Scene`, `Book Order`, `Change Note` (records `reason`), and the entry fields. `notion-delete-pages` exists now (design notes said no delete) and needs `user_confirmed: true`; the contract’s `confirm: none` definition gained a clause for per-call confirmation flags. AP0 Part B had landed, so the app’s enums are used.
- **Notion rendering rules** (all observed): blank-line runs collapse; pipe tables are written as `<table>` markup (an escaped `\|` splits a cell); backslashes are doubled on write; code is literal; `#####`/`######` become `####`; HTML comments become visible text; a page create drops a leading `# H1` (sync and async) while `replace_content` keeps it, so a body starting with `#` is created, then replaced with the same body. A 12,700-word page came back untruncated; the truncation recovery is written but unobserved (SB5).
- **Queries:** rows mode (works on every plan), 100-row cap with no cursor, paged by key; SQL `LIMIT/OFFSET ORDER BY url` and the Projects row’s relation lists are fallbacks.
- **Skills:** `storystormer-init` § Where a new project lives (Dropbox or Notion when the author asks; a storage-only pointer config in the open folder; `local_root` scaffolds locally); intake archives on native-history bindings go to `.storystormer/intake/<timestamp>/…`; binary originals stay in the open folder. `checkpoint` gives the binding’s documented refusal. Decision and question IDs are provisional until the store reports the one used. The concurrency guard now also covers un-versioned documents (content compare).
- **Locator note for SB4:** Rob’s workspace has an unrelated page titled “StoryStormer” (Software Hub), so hub finding checks the exact title, the location and all five databases.
- **Test projects left for Rob:** Dropbox `/StoryStormer/lighthouse-ledger/`; Notion hub “StoryStormer” with the “The Lighthouse Ledger” project.
- **ISSUE070 (decided with Rob):** the treatment act budget is a ceiling, not a target (it was always meant to stop a developed Act One ballooning toward prose); `treatment-update` and `file-schemas.md` changed; the app’s Treatment Agent prompt gets the same wording (handoff in `.plans/ISSUE070-treatment-first-run-budget.md`).
