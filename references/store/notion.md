<!-- ABOUTME: The Notion binding for the store contract: a story as rows in five linked databases under a “StoryStormer” hub page -->
<!-- ABOUTME: Path map, DDL, frontmatter ↔ properties, rendering, computed documents and writable realizations, init scaffold -->

# Notion Binding

The store is a Notion workspace. Each project is one row in a **Projects** database; its documents are rows in four more databases (Assets, Chapters, Decisions, Questions) under a hub page, and anything the path map doesn’t cover is a child page of the project’s row. Skills still pass paths; this binding maps each path to a row and its properties. Read `references/store.md` first; this document only says how each operation is realized here.

## Capabilities

```
identity: id · write: native · edit: native · list: query · history: native · open: url · size: ~5k words sync, larger async · confirm: none
```

**Size in practice:** every create and update passes `allow_async: true` and waits for the task (§ Operations), so the write size never changes the procedure. One fetch returned a 12,700-word page (69 KB) whole, with no `truncated` flag.

**Confirmation:** the connector asks nothing except for trashing: `notion-delete-pages` refuses until called with `user_confirmed: true`. The plan-first approval that names the path is that confirmation (`store.md` § Confirmation posture); a delete outside the approved plan is asked for first.

## Tools

The Notion connector’s `notion-search`, `notion-fetch`, `notion-create-pages`, `notion-update-page`, `notion-create-database`, `notion-update-data-source`, `notion-query-data-sources`, `notion-get-async-task` and `notion-delete-pages`. Optional: `notion-move-pages` (`move` of a child page between rows) and `notion-get-teams` (a teamspace hub at `init`). Some surfaces expose the same tools without the `notion-` prefix; either spelling satisfies the tool check. No shell.

**Verified on:** 2026-10-16 (live probe; findings are marked *observed*).

## Layout and root

- **Hub:** a page titled exactly `StoryStormer` at the workspace’s private root (empty ancestor path), whose content holds the five databases as `<database>` children named Projects, Assets, Chapters, Decisions, Questions. One `notion-fetch` of the hub returns each database’s `data-source-url` (`collection://…`); every query and create uses those.
- **Root** (`config.json` `storage.root`): the page id of the project’s Projects row. Every other row carries `Project` = that row. In a series the root is the series row; each book is a Projects row whose `Parent` is the series row (its `Books` relation fills itself), and rows under `books/<slug>/` also carry `Book` = the book’s row. Root-level rows in a series have `Book` empty.
- **Locator root (SB4):** `notion-search` for `StoryStormer`, keep only results titled exactly that with no `path`, fetch each and keep the one with the five databases. Search is fuzzy, and a workspace may hold other pages with that title (a database row about the app, say), so the database check is the test.
- **Unmapped paths** are child pages of the bound row (the book’s row under `books/<slug>/`), titled with the path.

## Path map

The descriptor table every operation uses; never branch on path strings outside it. Every selector also filters `Project` = root, plus `Book` (the book’s row under `books/<slug>/…`, empty otherwise).

| Path | Database | Selector |
|---|---|---|
| `state.md` · `.storystormer/config.json` | Projects | the bound row (a book’s row for `books/<slug>/state.md`): computed |
| `primer.md` · `treatment.md` · `manifest.md` · `series.md` · `outline/structure.md` · `.storystormer/genre-reference.md` | Assets | `Kind` = primer · treatment · manifest · series · structure · genre-reference |
| `characters/<slug>.md` | Assets | `Kind` = character, `Slug` = slug |
| `worldbuilding/<folder>/<slug>.md` | Assets | `Kind` = worldbuilding, `Slug` = slug, kebab-case of `Category` = folder |
| `research/<slug>.md` · `voice/style-guide.md` · `voice/writing-sample.md` | Assets | `Kind` = research (+ `Slug`) · voice-style-guide · voice-writing-sample |
| `characters/_index.md` · `outline/_index.md` · `voice/README.md` | none | computed from queries |
| `chapters/chapter-NN/ch<NN>-<artifact>.md` | Chapters | `Chapter` = NN, `Artifact` = outline · blueprint · prose · notes |
| `decisions.md` · `questions.md` | Decisions · Questions | every row of the project: computed |
| `.storystormer/history/**` · `chapters/*/.history/**` | none | never exist (`history: native`) |
| anything else (`voice/samples/*.md`, `scenes/`, `kitbash/`, `.storystormer/canon-sync/*.md`, …) | child page | parent = bound row, title = the path |

## Schema

`init` runs this through `notion-create-database` with `parent` = the hub, in this order (later tables relate to earlier ones; substitute each returned data-source id), then adds the two self-relations with `notion-update-data-source`, because a table can’t reference its own id before it exists.

```sql
-- 1 Projects
CREATE TABLE ("Name" TITLE, "Slug" RICH_TEXT, "Project Type" SELECT('novel','novella','short_story','screenplay','series'),
  "Genre" RICH_TEXT, "Genre Secondary" RICH_TEXT, "Logline" RICH_TEXT,
  "Stage" SELECT('concept','brain-dump','brainstorming','treatment-drafted','treatment-refined','canon-development','outlining','outline-drafted'),
  "Initial Maturity" SELECT('concept','brain-dump','brainstorming','treatment-drafted','treatment-refined'),
  "Surfacing Mode" SELECT('active','on-request'), "Created" DATE, "Last Session" DATE, "Session Count" NUMBER,
  "Target Word Count" NUMBER, "Current Focus" RICH_TEXT, "Storage Kind" SELECT('notion'), "Meta" RICH_TEXT)
-- 2 Assets
CREATE TABLE ("Name" TITLE, "Project" RELATION('<projects-ds>', DUAL 'Assets'), "Book" RELATION('<projects-ds>'),
  "Kind" SELECT('primer','treatment','manifest','series','structure','genre-reference','character','worldbuilding','voice-style-guide','voice-writing-sample','research'),
  "Slug" RICH_TEXT, "Type" RICH_TEXT, "Category" RICH_TEXT, "Tags" RICH_TEXT, "Version" NUMBER, "Last Updated" DATE,
  "Primer Version" NUMBER, "Authorship" SELECT('author_written','ai_generated','ai_generated_author_revised'),
  "Body Words" NUMBER, "Meta" RICH_TEXT)
-- 3 Chapters
CREATE TABLE ("Name" TITLE, "Project" RELATION('<projects-ds>', DUAL 'Chapters'), "Book" RELATION('<projects-ds>'),
  "Chapter" NUMBER, "Artifact" SELECT('outline','blueprint','prose','notes'), "Title" RICH_TEXT, "POV" RICH_TEXT,
  "Act" RICH_TEXT, "Summary" RICH_TEXT, "Status" SELECT('drafted','revising','revised'),
  "Authorship" SELECT('author_written','ai_generated','ai_generated_author_revised'), "Version" NUMBER,
  "Word Count" NUMBER, "Last Updated" DATE, "Related Assets" RELATION('<assets-ds>'), "Markers" RICH_TEXT, "Meta" RICH_TEXT)
-- 4 Decisions
CREATE TABLE ("Name" TITLE, "Number" NUMBER, "Project" RELATION('<projects-ds>', DUAL 'Decisions'),
  "Type" SELECT('plot','character','worldbuilding','structure','theme'), "Date" DATE, "Scope" RICH_TEXT,
  "Affects Books" RICH_TEXT, "Summary" RICH_TEXT, "Details" RICH_TEXT, "Affects" RICH_TEXT, "Source" RICH_TEXT,
  "Integrated" RICH_TEXT)
-- 5 Questions
CREATE TABLE ("Name" TITLE, "Number" NUMBER, "Project" RELATION('<projects-ds>', DUAL 'Questions'),
  "Priority" SELECT('critical','important','nice_to_resolve'),
  "Category" SELECT('Story Structure','Character','Plot','Worldbuilding','Theme','Setting','Pacing'),
  "Scope" RICH_TEXT, "Affects Books" RICH_TEXT, "Question" RICH_TEXT, "Why It Matters" RICH_TEXT,
  "Possible Approaches" RICH_TEXT, "Dependencies" RICH_TEXT, "Source" RICH_TEXT,
  "Status" SELECT('open','resolved','invalidated'), "Resolution" RICH_TEXT, "Resolved By" RELATION('<decisions-ds>'), "Date" DATE)
-- then, on Projects and on Decisions:
ADD COLUMN "Parent" RELATION('<projects-ds>', DUAL 'Books' 'books')
ADD COLUMN "Supersedes" RELATION('<decisions-ds>', DUAL 'Superseded By' 'superseded_by')
```

The `DUAL` relations to Projects give the Projects row `Assets`, `Chapters`, `Decisions` and `Questions` lists; one fetch of the row returns each list whole (*observed*: 101 entries). Decisions `Type` and Questions `Category` are the app’s enums after AP0 Part B (`recordDecision.ts`, `createQuestion.ts`); map retired values first (`file-schemas.md` § `decisions.md`, § `questions.md`).

## Frontmatter ↔ properties

**On write**, each frontmatter key lands in its property below and the markdown body becomes the page content. A key with no property goes into `Meta` as YAML text, verbatim and in the document’s order (block scalars such as `revision: >-` and a prose `synopsis: |` included). Path-derived properties (`Project`, `Book`, `Kind`, `Slug`, `Chapter`, `Artifact`, `Name` where no key supplies it) come from the path map. **On read**, properties and `Meta` render as frontmatter in the key order `file-schemas.md` gives for that document, values quoted per its § Frontmatter values, then the body. An empty property renders nothing, except keys the schema requires on every write (an outline’s `pov`), which render empty.

| Database | Property ← frontmatter key |
|---|---|
| Projects | `Name` ← `title` · `Genre` ← `genre` · `Genre Secondary` ← `genre_secondary` · `Project Type` ← `project_type` · `Target Word Count` ← `target_word_count` · `Storage Kind` ← `storage_kind` (always `notion`) · `Logline` ← `logline` · `Stage` ← `stage` · `Initial Maturity` ← `initial_maturity` · `Created` ← `created` · `Last Session` ← `last_session` · `Session Count` ← `session_count` · `Surfacing Mode` ← `surfacing_mode` · `Books` ← `books` (each book row’s `Slug`, in relation order) · `Current Focus` ← `current_focus` · `Parent` ← `parent_series` (renders the parent row’s `Name`) · `Slug` ← the project or book slug |
| Assets | `Name` ← `name` (bios, worldbuilding) or `title` (`series.md`), else the document’s label (`Primer`, `Treatment`, …) · `Type` ← `type` · `Category` ← `category` · `Tags` ← `tags` · `Version` ← `version` · `Last Updated` ← `last_updated` · `Primer Version` ← `primer_version` · `Authorship` ← `authorship` |
| Chapters | `Chapter` ← `chapter` · `Title` ← `title` · `POV` ← `pov` · `Act` ← `act` · `Summary` ← `summary` · `Status` ← `status` (prose) · `Authorship` ← `authorship` · `Version` ← `version` · `Word Count` ← `word_count` · `Last Updated` ← `last_updated` · `Name` = `ch<NN>-<artifact>` |

**Values.** Dates are `YYYY-MM-DD`, sent as `date:<Property>:start` with `date:<Property>:is_datetime: 0`. Numbers are numbers and render without a decimal point. Lists (`tags: [a, b]`) are stored as `a, b` and render as `[a, b]`. Relations take page ids. Selects accept only their listed options (*observed*: the connector rejects any other value, and adding one needs `ALTER COLUMN` naming every option to keep), so open lists (People types, worldbuilding types, tags, sources) are text; for a select, normalize the old spellings `file-schemas.md` names (`author-written` → `author_written`) and stop on anything else.

**Binding-maintained** (set on every write of the row, never rendered): Chapters `Markers` = every `[OPEN: Q-###]` and `[NEEDS DEVELOPMENT` in the body, comma-separated (a parse of the plugin’s own marker format); Chapters `Related Assets` = the project’s character and worldbuilding rows the body names, matched by the model against an Assets query’s `Name`s (an index that can lag edits made in Notion); Assets `Body Words` = the body’s word count.

## What `read` returns

Edit anchors match the document as `read` returns it (`store.md`), so `read` returns plugin markdown, not Notion’s. Notion stores blocks and hands back enhanced markdown; render it back with these rules (each *observed* on a bio and a treatment):

- **Blank lines:** Notion drops them. Put one blank line between blocks; consecutive list items and table rows stay together.
- **Tables:** a pipe table comes back as `<table header-row="true"><tr><td>…`; render it as a pipe table again.
- **Escapes:** brackets, angle brackets and the other Markdown specials (`* _ ~ $ { } | ^ \` and the backtick) come back backslash-escaped (`\[TBD: …\]`, `\[OPEN: Q-001\]`), in properties too (`Meta`); remove the escapes. `<br>` (newlines in properties, `Meta` included) becomes a newline; `<empty-block/>` a blank line.
- **Indentation:** nested list items come back tab-indented; render two spaces per level.
- **Dropped:** `<page url=…>` child-page tags (those are other paths), mention tags (keep their text), and autolinks Notion adds to anything that looks like a domain (`ch12-outline.md` → `[ch12-outline.md](http://ch12-outline.md)`; take titles from the fetch’s plain `title` field).
- **HTML comments** are stored as a visible paragraph of literal text and render back as `<!-- … -->`; tell the author once that they show in Notion.
- **Unchanged:** curly quotes, dashes, emphasis, headings, `---` rules, block quotes, numbered lists.

**Truncation:** if a fetch reports `truncated`, `unknown_block_count` or `unknown_block_ids`, fetch each listed block id and splice its content in at its `<unknown url=…>` placeholder, in order. If any part can’t be fetched, fail the read and name the page: a partial page is never returned as the document. (Not observed through 12,700 words, so this path is unverified.)

## Stored and computed

Stored rows: every Assets and Chapters path, and child pages. No snapshots are written. **Computed** (`store.md` § Local-mode clauses): `state.md`, `.storystormer/config.json`, `decisions.md`, `questions.md`, `characters/_index.md`, `outline/_index.md`, `voice/README.md`. `read` renders them as below; a `write` or `edit` of one is diffed against its rendering and each change goes through the writable realization listed. Anything with no realization is refused by name, never dropped silently.

| Document | Renders from | Writable realizations |
|---|---|---|
| `state.md` | frontmatter: the bound row (book row for `books/<slug>/state.md`); `## Summary`, `## What's Next`, `## Last Session`: the row’s page content (its trailing `<page>` tags not rendered); `## What Exists`: computed on each read (below) | a frontmatter key → its property (`stage`, `last_session`, `session_count`, `current_focus`, `target_word_count`, …); a change to one of those three sections → that section of the row’s content, child-page tags kept; What Exists is computed, so changes to it are discarded and the report says so |
| `.storystormer/config.json` | JSON in `file-schemas.md` order: `title`, `project_type`, `target_word_count`, `genre`, `genre_secondary` (`null` when empty), `created`, `surfacing_mode`, in a series `books` (each book row’s `{slug, title, target_word_count}`, the last only when set) and `current_focus`, then `"storage": {"kind": "notion", "root": "<root page id>"}` | `target_word_count`, `current_focus`, `genre`, … → the property; a book’s `title` or `target_word_count` → that book row; a new `books` entry → a new Projects row with `Parent` = the series row; `storage` is never written (moving backends is SB4’s `migrate`) |
| `decisions.md` | Decisions rows, sorted by `Number` (below) | a new `## D-###` entry → a new row; `**Superseded by**: D-###` added to an entry → set the later row’s `Supersedes` to it; a changed field → its property; deleting or renumbering an entry → refused (append-only) |
| `questions.md` | Questions rows, sorted by `Number` (below) | a new `## Q-###` entry → a new row; a `**Status**` change → `Status`, plus `Resolved By` for `resolved (D-###)` or `Resolution` for the parenthetical text; a changed field → its property |
| `characters/_index.md` | Assets `Kind` = character: `# Characters`, then `- [<Name>](<Slug>.md) — <Type>`, adding ` · <Tags>` when set, sorted by `Name` | none: regeneration steps are skipped |
| `outline/_index.md` | `file-schemas.md` § `outline/_index.md` built from rows: cells `[v<Version>](../chapters/chapter-NN/ch<NN>-<artifact>.md)` or `—`, flags from `Markers`, titles and acts from outline rows’ `Title` and `Act` (else the structure’s chapter blocks); frontmatter `last_updated` (latest Chapters `Last Updated`), `structure_version`, `total_chapters` (structure `Meta` `target_chapter_count`, else its chapter blocks), and the four counts by `Artifact`; no `version` | none |
| `voice/README.md` | the text in `storystormer-init` § Voice scaffolding, with the project’s name | none |

**What Exists**, recomputed from queries on each read: Primer, Treatment, Manifest, Structure from their Assets rows (`Version`, `Last Updated`, `built_from_decisions` and `target_chapter_count` from `Meta`); Character bios as `<Name> (<Type>, ~<Body Words>w)`; Worldbuilding as `<Name> (<Category>)`; Voice (which voice rows exist, else `README only`); Chapter outlines and Prose chapters (Chapters rows per `Artifact` against the structure’s chapter count); Decisions (rows, and those whose `Integrated` starts with `yes`); Open questions (`Status` = open, counted by `Priority`).

**Decision entry** (`file-schemas.md` § `decisions.md`), from one row: `## D-<Number> · <Date> · <Type>`, then `**Scope**` and `**Affects books**` (series only), `**Topic**` ← `Name`, `**Summary**`, `**Details**` (when set), `**Affects**`, `**Source**`, `**Integrated into treatment**` ← `Integrated` (a series renders `**Integrated into**:` and the property’s lines), `**Superseded by**` ← the `Superseded By` row’s number. **Question entry:** `## Q-<Number> · <Priority> · <Category>`, then `**Scope**`/`**Affects books**` (series), `**Title**` ← `Name`, `**Question**`, `**Why it matters**`, `**Possible approaches**` (one `  - ` line per line of the property), `**Dependencies**`, `**Source**`, `**Status**` ← `open`, `resolved (D-<n>)` or `invalidated (<Resolution>)`. Entries are separated by one blank line; the page bodies of these rows are not rendered.

**IDs.** `Number` is the project’s own sequence, rendered zero-padded to three digits (`D-018`; four past 999). A new row takes one more than the project’s highest (query sorted by `Number` descending, `limit: 1`); if the entry the skill wrote carries a different number, use the next one and report the ID actually used, which is how `decision-capture` learns it. Notion’s `UNIQUE_ID` is not used (*observed*: its prefix needs two or more characters, it counts per database across every project sharing it, it renders as a bare `1`, `2`, and a property named `ID` becomes `userDefined:ID`).

## Operations

| Operation | Realization |
|---|---|
| `list(glob)` | From the path map, work out which rows can match the glob, query each data source with those filters (§ Queries), and map rows back to paths. Add computed documents whose sources exist (`state.md`, `config.json` and `voice/README.md` always; `decisions.md` or `questions.md` with at least one row; `characters/_index.md` with a character; `outline/_index.md` with a structure row) and child pages whose path titles match. Filter by the glob in the model |
| `read(path)` | Selector query, then one `notion-fetch` of the row, rendered per § What `read` returns. No row is a missing-path error. *Frontmatter only:* the selector query’s row properties, rendered, with no fetch. Computed documents render per § Stored and computed |
| `write(path, content)` | Computed → its writable realizations. Otherwise split frontmatter from body and run the selector query. **No row:** `notion-create-pages` with `parent.data_source_id` (or `page_id` = the bound row for a child page), the properties per § Frontmatter ↔ properties, and `content` = the body. **One row:** concurrency guard (`Version`); skip if the current rendering equals `content`; `notion-update-page` `replace_content` with the body plus any child-page `<page url=…>` tags the fetch showed, then `update_properties`. If the properties call fails after the content call, put the previous body back with `replace_content` and report; the row itself never disappears. **Two rows:** stop and name both URLs |
| `edit(path, edits, reason)` | Apply the items in the model to the rendered read; any missing or ambiguous anchor fails the call with nothing sent. Items inside the body go to **one** `update_content` call (one `content_updates` entry per item, `replace_all` → `replace_all_matches`; the connector applies all or none, *observed*); changes inside the frontmatter go to one `update_properties` call after it. If `update_content` rejects an anchor the model accepted (Notion normalizes, e.g. a table), send the whole edited body through `write` instead. If `update_properties` fails, undo the body with the inverse items. Report connector `warnings` (it silently corrects near-miss anchors; the model’s exact check is the guarantee). `reason` is not recorded |
| `history(path)` | The connector can’t read page history. Return the row’s URL and say: in Notion, open the page, then ••• → Version history (how far back depends on the workspace’s plan) |
| `open(path)` | The row’s or child page’s URL |
| `move(from, to)` | Same database: change the selector properties (`Slug` and `Name` for a renamed character, `Category` for a re-filed entry, `Chapter` and `Name` for a renumbered chapter). A child page to another parent: `notion-move-pages`, then retitle. Across databases: `read`, `write`, `delete` |
| `delete(path)` | `notion-delete-pages` with `user_confirmed: true` when the path is in the approved plan (see Capabilities). Trash is recoverable (Notion’s Trash, or the connector’s restore). Computed documents can’t be deleted |

**Async:** every create and update passes `allow_async: true`. When the reply is an `async_task`, poll `notion-get-async-task` (honour `poll_after_seconds`) until `succeeded` before reporting, reading back, or the next dependent call; `failed` is a failed call.

**Concurrency guard:** before replacing a row, re-run its selector query and compare `Version` with the baseline. Projects rows carry no `Version`, so `state.md` and `config.json` are not guarded.

**`replace_content` and children:** a replace that omits a child page or database is refused with a list (*observed*). Keep their tags in `new_str`; never pass `allow_deleting_content` unless the author has approved deleting exactly what that list names. The hub’s content is never replaced.

## Queries

Use **rows mode** (`mode: "rows"`, the data-source URL, structured filters and sorts), which works on every plan: `Project` `relation_contains` the root id, plus `enum_is` for selects, `number_equals` for numbers, `string_is` for text, `relation_contains` (or `is_empty`) for `Book`, with `limit: 100`. Rows mode returns properties, not bodies, and has no cursor (*observed*: 100 rows and `has_more`). Past 100:

- **Chapters, Decisions, Questions:** sort by `Chapter` or `Number` ascending; re-query with `number_greater_than_or_equal_to` the last key, drop URLs already seen, and repeat until fewer than 100 come back (*observed* on 101 Chapters rows).
- **Assets:** query one `Kind` at a time. If a single `Kind` returns 100, fall back to SQL mode with `LIMIT 100 OFFSET n` (`url` and quoted column names from the fetched `<sqlite-table>`), which is unlimited only on Business or Enterprise with Notion AI and shares a workspace limit elsewhere; failing that, fetch the root row and take its `Assets` list, fetching the rows not yet seen.

SQL is never required, and nothing queries two data sources in one call.

## Scaffolding a project (`init` on Notion)

1. **Hub.** Find it as the locator does. A hub missing some of the five databases: stop and tell the author; don’t repair it by guessing. No hub: ask once whether it goes at the private root (default) or in a teamspace (`notion-get-teams`), then `notion-create-pages` titled `StoryStormer` with no parent (private) or `parent.teamspace_id`.
2. **Tables.** The five `CREATE TABLE`s in order, then the two `ADD COLUMN`s; keep the returned data-source URLs.
3. **Project row.** One Projects row from the new `state.md` frontmatter (`Storage Kind` = notion) with `## Summary`, `## What's Next` and `## Last Session` as its content; in a series, the series row and one row per book with `Parent` set.
4. **Pointer.** When the session has an open folder, write its `.storystormer/config.json` through the local binding with `"storage": {"kind": "notion", "root": "<row page id>"}`, so resolution finds the project next session.
5. Continue `init` through the contract (intake documents become rows).

## `checkpoint`

`history: native`, so `checkpoint` refuses with exactly: “Nothing to checkpoint: this project lives in Notion, which keeps every page’s version history itself (open any page, then ••• → Version history). No snapshot was written.”

## Worked example: `character-bio` creates `characters/marlowe-reyes.md`

1. **Resolve** once: `kind: notion`, root = the project row’s id; the hub fetch gave the five data-source URLs.
2. **Read inputs** (`manifest.md`, `treatment.md`): rows query Assets (`Kind` = manifest), fetch, render.
3. **Write.** Selector query Assets (`Project`, `Kind` = character, `Slug` = marlowe-reyes): no row. `notion-create-pages` into Assets with `Name` “Marlowe Reyes”, `Kind` character, `Slug`, `Type` Protagonist, `Tags` “POV character, the bureau”, `Version` 1, `Last Updated`, `Meta` “manifest_version: 2\ntreatment_version: 7”, `Body Words`, `Project`; content = the bio body; wait on the async task.
4. **No snapshot or guard:** the row is new, and the report says Notion keeps the versions. `characters/_index.md` is computed, so its regeneration step is skipped; the `state.md` update writes only the frontmatter keys and Last Session.
5. **Open:** hand the author the row’s URL.

## Adversarial case: `blueprint` gathers every character in chapter 12

1. `store.read('chapters/chapter-12/ch12-outline.md')`: rows query Chapters with `Project` `relation_contains` root, `Chapter` `number_equals` 12, `Artifact` `enum_is` outline (plus `Book` in a series), then fetch. The row’s `Related Assets` holds the URLs of the Assets rows the outline names.
2. `store.list('characters/*.md')`: rows query Assets with `Project` and `Kind` `enum_is` character, which returns `Name`, `Slug`, `Type` and the URL of each.
3. The characters whose URLs are in chapter 12’s `Related Assets` are the indexed set. `blueprint` still reads the outline body (and chapter 11’s notes End State) and adds any named character the index missed, since the index lags edits made in Notion. Each becomes `characters/<Slug>.md` and is read with `store.read`. Worldbuilding works the same way with `Kind` = worldbuilding and paths from `Category` and `Slug`.
