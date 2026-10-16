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

**Verified on:** 2026-10-16 (live probes; findings are marked *observed*).

## Layout and root

- **Hub:** a page titled exactly `StoryStormer` at the workspace’s private root (empty ancestor path) or at a teamspace’s top level (an ancestor path naming only the teamspace; that form is unobserved), whose content holds the five databases as `<database>` children named Projects, Assets, Chapters, Decisions, Questions. One `notion-fetch` of the hub returns each database’s `data-source-url` (`collection://…`); every query and create uses those.
- **Finding hubs** (the locator and `init` both use this): `notion-search` for `StoryStormer`, keep results titled exactly that at a hub location, and fetch each. A **complete** hub holds all five databases; a **partial** one holds one to four of them; a page with none is not a hub (a workspace may hold such a page elsewhere, and search is fuzzy). The locator (SB4) lists only complete hubs; `init` also needs the partials (§ Scaffolding).
- **Root** (`config.json` `storage.root`): the page id of the project’s Projects row. In a series the root is the series row; each book is a Projects row whose `Parent` is the series row (its `Books` relation fills itself), ordered by `Book Order`.
- **Unmapped paths** are child pages of the bound row (the book’s row under `books/<slug>/`), titled with the path.

## Path map

The descriptor table every operation uses; never branch on path strings outside it. **Filters:** Assets and Chapters selectors also filter `Project` = root and `Book` = the book’s row under `books/<slug>/…` (empty otherwise). Decisions and Questions filter `Project` only: they have no `Book`, a series keeps them at the root, and their scope is the `Scope` field. Projects rows are addressed by page id: the root, or a book row (`Parent` = root, `Slug` = slug).

| Path | Database | Selector |
|---|---|---|
| `state.md` · `.storystormer/config.json` | Projects | the root row (the book row for `books/<slug>/state.md`): computed |
| `primer.md` · `treatment.md` · `manifest.md` · `series.md` · `outline/structure.md` · `.storystormer/genre-reference.md` | Assets | `Kind` = primer · treatment · manifest · series · structure · genre-reference |
| `characters/<slug>.md` | Assets | `Kind` = character, `Slug` = slug |
| `worldbuilding/<folder>/<slug>.md` | Assets | `Kind` = worldbuilding, `Slug` = slug, kebab-case of `Category` = folder |
| `research/<slug>.md` · `voice/samples/<slug>.md` | Assets | `Kind` = research · voice-sample, `Slug` = slug |
| `voice/style-guide.md` · `voice/writing-sample.md` | Assets | `Kind` = voice-style-guide · voice-writing-sample |
| `characters/_index.md` · `outline/_index.md` · `voice/README.md` | none | computed from queries |
| `chapters/chapter-NN/ch<NN>-<artifact>.md` | Chapters | `Chapter` = NN, `Artifact` = outline · blueprint · prose · notes |
| `chapters/chapter-NN/scenes/ch<NN>-scene-MM.md` | Chapters | `Chapter` = NN, `Artifact` = scene, `Scene` = MM |
| `decisions.md` · `questions.md` | Decisions · Questions | every row of the project: computed |
| `.storystormer/history/**` · `chapters/*/.history/**` | none | never exist (`history: native`) |
| anything else (`kitbash/`, `.storystormer/canon-sync/*.md`, `.storystormer/intake/**`, …) | child page | parent = bound row, title = the path |

## Schema

`init` runs this through `notion-create-database` with `parent` = the hub, in this order (later tables relate to earlier ones; substitute each returned data-source id), then adds the two self-relations with `notion-update-data-source`, because a table can’t reference its own id before it exists.

```sql
-- 1 Projects
CREATE TABLE ("Name" TITLE, "Slug" RICH_TEXT, "Project Type" SELECT('novel','novella','short_story','screenplay','series'),
  "Genre" RICH_TEXT, "Genre Secondary" RICH_TEXT, "Logline" RICH_TEXT,
  "Stage" SELECT('concept','brain-dump','brainstorming','treatment-drafted','treatment-refined','canon-development','outlining','outline-drafted'),
  "Initial Maturity" SELECT('concept','brain-dump','brainstorming','treatment-drafted','treatment-refined'),
  "Surfacing Mode" SELECT('active','on-request'), "Created" DATE, "Last Session" DATE, "Session Count" NUMBER,
  "Target Word Count" NUMBER, "Current Focus" RICH_TEXT, "Book Order" NUMBER, "Storage Kind" SELECT('notion'),
  "Meta" RICH_TEXT, "Change Note" RICH_TEXT)
-- 2 Assets
CREATE TABLE ("Name" TITLE, "Project" RELATION('<projects-ds>', DUAL 'Assets'), "Book" RELATION('<projects-ds>'),
  "Kind" SELECT('primer','treatment','manifest','series','structure','genre-reference','character','worldbuilding',
    'voice-style-guide','voice-writing-sample','voice-sample','research'),
  "Slug" RICH_TEXT, "Type" RICH_TEXT, "Category" RICH_TEXT, "Tags" RICH_TEXT, "Version" NUMBER, "Last Updated" DATE,
  "Primer Version" NUMBER, "Authorship" SELECT('author_written','ai_generated','ai_generated_author_revised'),
  "Body Words" NUMBER, "Meta" RICH_TEXT, "Change Note" RICH_TEXT)
-- 3 Chapters
CREATE TABLE ("Name" TITLE, "Project" RELATION('<projects-ds>', DUAL 'Chapters'), "Book" RELATION('<projects-ds>'),
  "Chapter" NUMBER, "Artifact" SELECT('outline','blueprint','prose','notes','scene'), "Scene" NUMBER,
  "Title" RICH_TEXT, "POV" RICH_TEXT, "Act" RICH_TEXT, "Summary" RICH_TEXT, "Status" SELECT('drafted','revising','revised'),
  "Authorship" SELECT('author_written','ai_generated','ai_generated_author_revised'), "Version" NUMBER,
  "Word Count" NUMBER, "Last Updated" DATE, "Related Assets" RELATION('<assets-ds>'), "Markers" RICH_TEXT,
  "Open Proposals" NUMBER, "Meta" RICH_TEXT, "Change Note" RICH_TEXT)
-- 4 Decisions
CREATE TABLE ("Name" TITLE, "Number" NUMBER, "Project" RELATION('<projects-ds>', DUAL 'Decisions'),
  "Type" SELECT('plot','character','worldbuilding','structure','theme'), "Date" DATE, "Scope" RICH_TEXT,
  "Affects Books" RICH_TEXT, "Summary" RICH_TEXT, "Details" RICH_TEXT, "Affects" RICH_TEXT, "Source" RICH_TEXT,
  "Integrated" RICH_TEXT, "Change Note" RICH_TEXT)
-- 5 Questions
CREATE TABLE ("Name" TITLE, "Number" NUMBER, "Project" RELATION('<projects-ds>', DUAL 'Questions'),
  "Priority" SELECT('critical','important','nice_to_resolve'),
  "Category" SELECT('Story Structure','Character','Plot','Worldbuilding','Theme','Setting','Pacing'),
  "Scope" RICH_TEXT, "Affects Books" RICH_TEXT, "Question" RICH_TEXT, "Why It Matters" RICH_TEXT,
  "Possible Approaches" RICH_TEXT, "Dependencies" RICH_TEXT, "Source" RICH_TEXT,
  "Status" SELECT('open','resolved','invalidated'), "Resolution" RICH_TEXT, "Resolved By" RELATION('<decisions-ds>'),
  "Date" DATE, "Change Note" RICH_TEXT)
-- then, on Projects and on Decisions:
ADD COLUMN "Parent" RELATION('<projects-ds>', DUAL 'Books' 'books')
ADD COLUMN "Supersedes" RELATION('<decisions-ds>', DUAL 'Superseded By' 'superseded_by')
```

The `DUAL` relations to Projects give the Projects row `Assets`, `Chapters`, `Decisions` and `Questions` lists; one fetch of the row returns each list whole (*observed*: 101 entries). Decisions `Type` and Questions `Category` are the app’s enums after AP0 Part B (`recordDecision.ts`, `createQuestion.ts`); map retired values first (`file-schemas.md` § `decisions.md`, § `questions.md`).

## Frontmatter ↔ properties

**On write**, each frontmatter key lands in its property below and the markdown body becomes the page content. A key with no property goes into `Meta` as YAML text, verbatim and in the document’s order (block scalars such as `revision: >-` and a prose `synopsis: |` included). Path-derived properties (`Project`, `Book`, `Kind`, `Slug`, `Chapter`, `Artifact`, `Scene`, `Name` where no key supplies it) come from the path map. **On read**, properties and `Meta` render as frontmatter in the key order `file-schemas.md` gives for that document, values quoted per its § Frontmatter values, then the body. An empty property renders nothing, except keys the schema requires on every write (an outline’s `pov`), which render empty.

| Database | Property ← frontmatter key |
|---|---|
| Projects | `Name` ← `title` · `Genre` ← `genre` · `Genre Secondary` ← `genre_secondary` · `Project Type` ← `project_type` · `Target Word Count` ← `target_word_count` (on a book row, the book’s own value only: § Stored and computed) · `Storage Kind` ← `storage_kind` (always `notion`) · `Logline` ← `logline` · `Stage` ← `stage` · `Initial Maturity` ← `initial_maturity` · `Created` ← `created` · `Last Session` ← `last_session` · `Session Count` ← `session_count` · `Surfacing Mode` ← `surfacing_mode` · `Books` ← `books` (book rows’ `Slug`, by `Book Order`) · `Current Focus` ← `current_focus` · `Parent` ← `parent_series` (renders the parent row’s `Name`) · `Slug` ← the project or book slug |
| Assets | `Name` ← `name` (bios, worldbuilding) or `title` (`series.md`), else the document’s label (`Primer`, `Treatment`, …) · `Type` ← `type` · `Category` ← `category` · `Tags` ← `tags` · `Version` ← `version` · `Last Updated` ← `last_updated` · `Primer Version` ← `primer_version` · `Authorship` ← `authorship` |
| Chapters | `Title` ← `title` · `POV` ← `pov` · `Act` ← `act` · `Summary` ← `summary` · `Status` ← `status` (prose, scenes) · `Authorship` ← `authorship` · `Version` ← `version` · `Word Count` ← `word_count` · `Last Updated` ← `last_updated` · `chapter` renders from `Chapter` · `Name` = `ch<NN>-<artifact>` or `ch<NN>-scene-MM` |

**Chapter identity.** The path decides `Chapter`, `Artifact` and `Scene`. A frontmatter `chapter` that disagrees with the path is an error: nothing is written, and the error names both. Renumbering is `move`.

**Values.** Dates are `YYYY-MM-DD`, sent as `date:<Property>:start` with `date:<Property>:is_datetime: 0`. Numbers are numbers and render without a decimal point. A list (`tags: [hope, "sector: 7"]`, or a block list) is stored as its YAML text verbatim and renders back as is, never split or joined. Relations take page ids. Selects accept only their listed options (*observed*: the connector rejects any other value, and adding one needs `ALTER COLUMN` naming every option to keep), so open lists (People types, worldbuilding types, tags, sources) are text; for a select, normalize the old spellings `file-schemas.md` names (`author-written` → `author_written`) and stop on anything else.

**Replacing a row** sets every property from the new content: a mapped key absent from it is set to `null`, and `Meta` is rewritten whole (`null` when no unmapped key remains). Path-derived properties keep their values.

**Binding-maintained** (rebuilt on every write and on every edit that changes the body; never rendered): Chapters `Markers` = every `[OPEN: Q-###]` and `[NEEDS DEVELOPMENT` in the body, comma-separated (a parse of the plugin’s own marker format); Chapters `Related Assets` = the project’s character and worldbuilding rows the body names, matched by the model against an Assets query’s `Name`s (an index that can lag edits made in Notion); Chapters `Open Proposals` (notes rows) = the unchecked `- [ ]` items under `## Proposals`; Assets `Body Words` = the body’s word count; `Change Note` = the edit’s `reason` on every row the edit touches, cleared by a `write`, so Notion’s version history keeps each change’s note with it.

**Child pages** have only a title, so the whole document goes in the body: the frontmatter, when present, as a first block fenced as ```` ```yaml ```` holding the lines between the `---` markers verbatim (code is stored literally), then the body. `read` renders a leading `yaml` fence back as `---`, its lines, `---`, then the body. A child page carries no `Change Note`; its `reason` is dropped.

## Rendering: plugin markdown ↔ Notion

Edit anchors match the document as `read` returns it (`store.md`), so `read` returns plugin markdown and `write` sends Notion’s enhanced markdown (`notion://docs/enhanced-markdown-spec`). Each rule is *observed* unless marked:

- **Backslashes and specials** (outside code): write doubles every `\`; read removes one backslash before each of Notion’s escape characters (the backslash, the backtick, and `* ~ $ [ ] < > { } | ^ _`), scanning left to right so `\\` yields `\`, and leaves every other backslash alone. So `C:\Users`, an author’s `\[lit\]`, `[OPEN: Q-001]` and `5 * 3` all round-trip, and the same rule applies to property text (`Meta`, `Tags`).
- **Code:** inline spans and fenced blocks are sent and returned literally, never escaped or unescaped. A bare fence is sent as ```` ```plain text ```` (Notion otherwise guesses a language: a bare fence came back `javascript`), and `plain text` reads back as a bare fence; `text` also comes back `plain text`.
- **Blank lines:** read puts one blank line between blocks; consecutive list items and the lines of a block stay together. Runs of blank lines collapse to one (Notion strips them), a known normalization. `<empty-block/>` (an empty paragraph made in Notion) reads as nothing, so a later write drops it; writes never send it.
- **Line breaks inside a block:** write sends a single newline inside a paragraph, quote or list item as `<br>` (a bare newline can split the block); read renders `<br>` in a block as a newline. In table cells `<br>` stays `<br>` both ways; in properties (`Meta` included) it reads as a newline.
- **Indentation:** write sends a tab for every two spaces of nesting (the spec’s form; two spaces also nested, through three levels); read renders two spaces per tab.
- **Tables:** write sends each pipe table as `<table header-row="true">` with one `<tr>` per row and one `<td>` per cell, cell text in write form with `\|` sent as a bare `|` (Notion’s pipe-table parser splits a cell at `\|`, breaking the table). Read rebuilds a pipe table with a `|---|` separator, writing `|` in a cell as `\|` and keeping `<br>`.
- **Mentions:** a page, database or data-source mention renders as `[<title>](<url>)` (the fetch fills in the title even when the tag was sent self-closing), which the connector turns back into a mention on write; a user mention renders as its name; a date mention renders as the date (`2026-10-16`, a range as `start – end`, with time and zone when set) and is written back as text. A mention never renders as nothing.
- **Dropped:** `<page url=…>` and `<database>` child tags (other paths; `replace_content` keeps them), and autolinks Notion adds to anything that looks like a domain (`ch12-outline.md` → `[ch12-outline.md](http://ch12-outline.md)`): a link whose text is its own URL renders as the text.
- **HTML comments** are stored as a visible paragraph of literal text and read back as `<!-- … -->`; tell the author once that they show in Notion.
- **Unchanged:** curly quotes, dashes, emphasis, headings to `####` (`#####` and `######` become `####`), `---` rules, block quotes, numbered lists, to-dos (`- [ ]`, `- [x]`).

**Truncation:** if a fetch reports `truncated`, `unknown_block_count` or `unknown_block_ids`, fetch each listed block id and splice its content in at its `<unknown url=…>` placeholder, in order, treating a truncated part the same way. The read fails, naming the page, when a fetch is truncated but lists no ids, when a part can’t be fetched, or when any part is still marked truncated after splicing: a partial page is never returned as the document. (Unobserved through 12,700 words.)

## Stored and computed

Stored rows: every Assets and Chapters path, and child pages. No snapshots are written. **Computed** (`store.md` § Local-mode clauses): `state.md`, `.storystormer/config.json`, `decisions.md`, `questions.md`, `characters/_index.md`, `outline/_index.md`, `voice/README.md`. `read` renders them as below; a `write` or `edit` of one is diffed against its rendering and each change goes through the writable realization listed. Anything with no realization is refused by name, never dropped silently.

| Document | Renders from | Writable realizations |
|---|---|---|
| `state.md` | frontmatter: the bound row; a book’s `target_word_count` is its effective target (the book row’s own value, else the series row’s); `## Summary`, `## What's Next`, `## Last Session`: the row’s page content (its trailing `<page>` tags not rendered); `## What Exists`: computed on each read (below) | a frontmatter key → its property (`stage`, `last_session`, `session_count`, `current_focus`, …); a book’s `target_word_count` that differs from its effective target sets the book row’s own value, and one equal to it writes nothing; a change to one of those three sections → that section of the row’s content, child-page tags kept; What Exists is computed, so changes to it are discarded and the report says so |
| `.storystormer/config.json` | JSON in `file-schemas.md` order: `title`, `project_type`, `target_word_count`, `genre`, `genre_secondary` (`null` when empty), `created`, `surfacing_mode`, in a series `books` (book rows by `Book Order`, each `{slug, title, target_word_count}`, the last only when the book row has its own) and `current_focus`, then `"storage": {"kind": "notion", "root": "<root page id>"}` | a root field → its property; a book’s `title` or `target_word_count` → that book row (removing the key clears it); a new `books` entry → a new Projects row with `Parent` = the series row and the next `Book Order`; reordering `books` → `Book Order` renumbered 1…n; removing an entry → refused (the book’s rows stay; trashing them is the author’s call); `storage` is never written (moving backends is SB4’s `migrate`), and `local_root` is never set: it names a synced folder, which Notion doesn’t have |
| `decisions.md` | Decisions rows, sorted by `Number` (below) | a new `## D-###` entry → a new row; `**Superseded by**: D-###` added to an entry → set the later row’s `Supersedes` to it; a changed field → its property; deleting or renumbering an entry → refused (append-only) |
| `questions.md` | Questions rows, sorted by `Number` (below) | a new `## Q-###` entry → a new row; a `**Status**` change → `Status`, plus `Resolved By` for `resolved (D-###)` or `Resolution` for the parenthetical text; a changed field → its property |
| `characters/_index.md` | Assets `Kind` = character: `# Characters`, then `- [<Name>](<Slug>.md) — <Type>`, adding ` · <Tags>` when set, sorted by `Name` | none: regeneration steps are skipped |
| `outline/_index.md` (per book in a series) | `file-schemas.md` § `outline/_index.md` built from the book’s rows: cells `[v<Version>](../chapters/chapter-NN/ch<NN>-<artifact>.md)` or `—`; a scene-split chapter with no prose row shows `[<n> scenes](../chapters/chapter-NN/scenes/ch<NN>-scene-01.md)` under Prose; flags from `Markers`; titles and acts from outline rows’ `Title` and `Act`, else the structure’s chapter blocks. Frontmatter: `last_updated` (latest Chapters `Last Updated`, else the structure row’s), `structure_version`, `total_chapters` (the structure’s chapter count, in `file-schemas.md` § Target word count’s order), and the four counts by `Artifact` (a chapter with scene rows counts as drafted). No `version`: it counts regenerations, which a computed view doesn’t have, and nothing reads it | none |
| `voice/README.md` | the text in `storystormer-init` § Voice scaffolding, with the project’s name | none |

**What Exists** (standalone, or a book’s `state.md` over that book’s rows plus the shared root rows), recomputed on each read in `file-schemas.md`’s line order: Primer, Treatment, Manifest, Structure from their Assets rows (`Version`, `Last Updated`, `built_from_decisions` and `target_chapter_count` from `Meta`); Character bios as `<Name> (<Type>, ~<Body Words>w)`; Worldbuilding as `<Name> (<Category>)`; Voice (`sample` when a writing-sample or voice-sample row exists, `+ style guide` when the style-guide row does, else `README only`); Chapter outlines, Blueprints, Prose chapters and Notes (Chapters rows per `Artifact` against the structure’s chapter count; prose counts a chapter with a prose row or any scene row; Notes adds how many are stale, `Meta` `prose_version` below the chapter’s prose `Version`, and the sum of `Open Proposals`); Decisions (rows in scope, `Scope` = `series` or `book-<slug>` for a book, and how many are integrated: standalone, `Integrated` starts with `yes`; series, the property’s `<slug> treatment` line says `yes`); Open questions (`Status` = open, in scope, counted by `Priority`).

**Series root `state.md`** renders What Exists in the shape of `file-schemas.md` § Series-level state.md: Series document (the `series.md` row’s `Version` and `Last Updated`, and the rows of its Cross-Book Setups and Payoffs table), Shared manifest (version, date, counts), Shared character bios (counts by `Type`), Shared decisions (total, and counts by `Scope`), then one line per book row by `Book Order`: title, primer and treatment versions, outline and prose counts, `Stage`.

**Decision entry** (`file-schemas.md` § `decisions.md`), from one row: `## D-<Number> · <Date> · <Type>`, then `**Scope**` and `**Affects books**` (series only), `**Topic**` ← `Name`, `**Summary**`, `**Details**` (when set), `**Affects**`, `**Source**`, `**Integrated into treatment**` ← `Integrated` (a series renders `**Integrated into**:` and the property’s lines), `**Superseded by**` ← the `Superseded By` row’s number. **Question entry:** `## Q-<Number> · <Priority> · <Category>`, then `**Scope**`/`**Affects books**` (series), `**Title**` ← `Name`, `**Question**`, `**Why it matters**`, `**Possible approaches**` (one `  - ` line per line of the property), `**Dependencies**`, `**Source**`, `**Status**` ← `open`, `resolved (D-<n>)` or `invalidated (<Resolution>)`. Entries are separated by one blank line; the page bodies of these rows are not rendered.

**IDs.** `Number` is the project’s own sequence, rendered zero-padded to three digits (`D-018`; four past 999). A new row takes one more than the project’s highest (query sorted by `Number` descending, `limit: 1`). After creating, query the project for that `Number`: if two rows hold it, the one whose page id sorts later is renumbered to the new highest plus one and checked again (both sessions see the same pair, so exactly one moves). When a row ends up with a different number from the entry the skill wrote, rewrite every reference to the provisional ID in the same submission (another new entry’s `**Dependencies**`, `**Superseded by**`, `resolved (D-###)`, prose that cites it) before sending, or on rows already sent after a race, and report each ID used, which is how `decision-capture` learns it. Notion’s `UNIQUE_ID` is not used (*observed*: its prefix needs two or more characters, it counts per database across every project sharing it, it renders as a bare `1`, `2`, and a property named `ID` becomes `userDefined:ID`).

**Several rows from one call.** A computed-document write or edit can touch several rows (two new decisions and a supersession). Apply the changes in document order, recording each one (the row and its prior values, or that it was created); if one fails, undo the completed ones in reverse (prior values back, created rows trashed under the same approval) and report what was attempted. If an undo fails, name the rows it left changed.

**`open` and `history` of a computed document.** `open` gives the bound Projects row’s URL (its relation lists reach every source row) and shows the rendering in the chat: a stated exception to `store.md`’s never-paste rule, because the document exists only as that rendering. `history` names the rows that hold it (the Projects row for `state.md` and `config.json`, each entry’s row for the logs) with the version-history route below.

## Operations

| Operation | Realization |
|---|---|
| `list(glob)` | From the path map, work out which rows can match the glob, query each data source with those filters (§ Queries), and map rows back to paths. Add computed documents whose sources exist (`state.md`, `config.json` and `voice/README.md` always; `decisions.md` or `questions.md` with at least one row; `characters/_index.md` with a character; `outline/_index.md` with a structure row, per book) and child pages whose path titles match. Filter by the glob in the model |
| `read(path)` | Selector query, then one `notion-fetch` of the row, rendered per § Rendering (child pages per § Frontmatter ↔ properties). No row is a missing-path error. *Frontmatter only:* the selector query’s row properties, rendered, with no fetch (a child page still needs it). Computed documents render per § Stored and computed |
| `write(path, content)` | Computed → its writable realizations. Otherwise split frontmatter from body, check chapter identity, and run the selector query. **No row:** `notion-create-pages` with `parent.data_source_id` (or `page_id` = the bound row and title = the path for a child page), the properties per § Frontmatter ↔ properties, and `content` = the body in write form. **One row:** concurrency guard; skip if the current rendering equals `content`; `notion-update-page` `replace_content` with the body in write form plus every child `<page url=…>` tag the fetch showed, then `update_properties` per § Frontmatter ↔ properties (replacing a row). If the properties call fails after the content call, `replace_content` with the markdown fetched before the replace and report; the row never disappears. **Two rows:** stop and name both URLs |
| `edit(path, edits, reason)` | Concurrency guard, then apply the items in the model to the rendered read; any missing or ambiguous anchor fails the call with nothing sent. A computed document, a child page, or an item whose anchor spans the frontmatter and the body becomes a whole-document change: the edited document goes through `write` (or the computed realizations). Otherwise body items go to **one** `update_content` call, one `content_updates` entry per item, with `old_str` = the span of the fetched Notion markdown that renders as the anchor and `new_str` = the replacement in write form (`replace_all` → `replace_all_matches`; the connector applies all or none, *observed*). Then one `update_properties` call: the changed frontmatter properties, the rebuilt binding-maintained ones when the body changed, and `Change Note` = `reason`. If `update_content` rejects an anchor the model accepted, send the whole edited document, frontmatter and body, through `write`. If `update_properties` fails after `update_content`, restore the body with `replace_content` from the fetched markdown and report. Report connector `warnings` (it silently corrects near-miss anchors; the model’s exact check is the guarantee) |
| `history(path)` | The connector can’t read page history. Return the row’s URL and say: in Notion, open the page, then ••• → Version history (how far back depends on the workspace’s plan) |
| `open(path)` | The row’s or child page’s URL (computed documents per § Stored and computed) |
| `move(from, to)` | **Same database:** run the destination’s selector query first; a row there stops the move and names both URLs. Then change the selector properties (`Slug` and `Name` for a renamed character, `Category` for a re-filed entry, `Chapter` and `Name` for a renumbered chapter, `Book` for a document moving into or out of `books/<slug>/`). **Child page:** retitle, after checking no child page of the destination parent holds the title; to another parent, `notion-move-pages` first. **Across databases:** `read`, `write`, `delete`. **Computed documents** are skipped and the report says so: they follow their rows (series conversion’s `outline/_index.md` moves when the structure and chapter rows take the book’s `Book`) |
| `delete(path)` | `notion-delete-pages` with `user_confirmed: true` when the path is in the approved plan (see Capabilities). Trash is recoverable (Notion’s Trash, or the connector’s restore). Computed documents can’t be deleted |

**Async:** every create and update passes `allow_async: true`. When the reply is an `async_task`, poll `notion-get-async-task` (honour `poll_after_seconds`) until `succeeded` before reporting, reading back, or the next dependent call; `failed` is a failed call.

**Concurrency guard:** before a write or edit that replaces an existing row, re-run its selector query and compare `Version` with the baseline (a child page: re-fetch and compare its fence’s `version`). Projects rows carry no `Version`, so `state.md` and `config.json` are not guarded.

**`replace_content` and children:** a replace that omits a child page or database is refused with a list (*observed*). Keep their tags in `new_str`; never pass `allow_deleting_content` unless the author has approved deleting exactly what that list names. The hub’s content is never replaced.

## Queries

Use **rows mode** (`mode: "rows"`, the data-source URL, structured filters and sorts), which works on every plan: the filters from § Path map (`relation_contains` the root for `Project`; `relation_contains` the book row, or `is_empty`, for `Book`; `Parent` `relation_contains` the root for book rows), plus `enum_is` for selects, `number_equals` for numbers and `string_is` for text, with `limit: 100`. Rows mode returns properties, not bodies, and has no cursor (*observed*: 100 rows and `has_more`). Past 100:

- **Chapters, Decisions, Questions:** sort by `Chapter` or `Number` ascending; re-query with `number_greater_than_or_equal_to` the last key, drop URLs already seen, and repeat until fewer than 100 come back (*observed* on 101 Chapters rows). Ties can’t stall it: `Number` is unique per project, and one `Chapter` holds at most a few dozen rows (four artifacts plus scenes, per book).
- **Assets:** query one `Kind` at a time. If a single `Kind` returns 100, fall back to SQL mode with `ORDER BY url LIMIT 100 OFFSET n` (`url` is unique, so pages never overlap; take quoted column names from the fetched `<sqlite-table>`), which is unlimited only on Business or Enterprise with Notion AI and shares a workspace limit elsewhere. Failing that, fetch the root row’s `Assets` list, fetch the rows not yet seen, and apply the query’s `Kind`, `Book`, `Slug` and `Category` filters to them in the model, since the list holds every Assets row of the project.

SQL is never required, and nothing queries two data sources in one call.

## Scaffolding a project (`init` on Notion)

1. **Hub.** Find hubs (§ Layout and root). One complete hub → use it and its databases. Several → ask which. Any partial hub → stop and tell the author; don’t repair it by guessing and don’t create another. None → ask once whether it goes at the private root (default) or in a teamspace (`notion-get-teams`), then `notion-create-pages` titled `StoryStormer` with no parent (private) or `parent.teamspace_id`.
2. **Tables**, for a new hub only: the five `CREATE TABLE`s in order, then the two `ADD COLUMN`s; keep the returned data-source URLs.
3. **Project row.** One Projects row from the new `state.md` frontmatter (`Storage Kind` = notion) with `## Summary`, `## What's Next` and `## Last Session` as its content; in a series, the series row and one row per book with `Parent` set and `Book Order` 1…n.
4. **Pointer.** When the session has an open folder, write its `.storystormer/config.json` through the local binding with `"storage": {"kind": "notion", "root": "<row page id>"}`, so resolution finds the project next session.
5. **Intake.** Continue `init` through the contract; intake documents become rows. Notion keeps no snapshot folders, so init’s intake archives become child pages: superseded prose at `.storystormer/intake/superseded-prose/<original filename>`, the filename mapping at `.storystormer/intake-original-names.md`. Notion holds markdown only, so a non-markdown original (`.docx`, `.rtf`, `.scrivx`, …) stays where it is in the open local folder, is never deleted, and is named in the report with the canonical path it would have had (with no open folder, the report says it was not stored). Attaching it as a file needs the connector’s file upload plus an HTTP POST, which the plugin can’t require.

## `checkpoint`

`history: native`, so `checkpoint` refuses with exactly: “Nothing to checkpoint: this project lives in Notion, which keeps every page’s version history itself (open any page, then ••• → Version history). No snapshot was written.”

## Worked example: `character-bio` creates `characters/marlowe-reyes.md`

1. **Resolve** once: `kind: notion`, root = the project row’s id; the hub fetch gave the five data-source URLs.
2. **Read inputs** (`manifest.md`, `treatment.md`): rows query Assets (`Project`, `Book` empty, `Kind` = manifest), fetch, render.
3. **Write.** Selector query Assets (`Project`, `Book` empty, `Kind` = character, `Slug` = marlowe-reyes): no row. `notion-create-pages` into Assets with `Name` “Marlowe Reyes”, `Kind` character, `Slug`, `Type` Protagonist, `Tags` “[POV character, the bureau]”, `Version` 1, `Last Updated`, `Meta` “manifest_version: 2\ntreatment_version: 7”, `Body Words`, `Project`; content = the bio body in write form; wait on the async task.
4. **No snapshot or guard:** the row is new, and the report says Notion keeps the versions. `characters/_index.md` is computed, so its regeneration step is skipped; the `state.md` update writes only the frontmatter keys and Last Session.
5. **Open:** hand the author the row’s URL.

## Adversarial case: `blueprint` gathers every character in chapter 12

1. `store.read('chapters/chapter-12/ch12-outline.md')`: rows query Chapters with `Project` `relation_contains` root, `Book` (`is_empty`, or the book row in a series), `Chapter` `number_equals` 12, `Artifact` `enum_is` outline, then fetch. The row’s `Related Assets` holds the URLs of the Assets rows the outline names.
2. `store.list('characters/*.md')`: rows query Assets with `Project`, `Book` `is_empty` and `Kind` `enum_is` character, which returns `Name`, `Slug`, `Type` and the URL of each.
3. The characters whose URLs are in chapter 12’s `Related Assets` are the indexed set. `blueprint` still reads the outline body (and chapter 11’s notes End State) and adds any named character the index missed, since the index lags edits made in Notion. Each becomes `characters/<Slug>.md` and is read with `store.read`. Worldbuilding works the same way with `Kind` = worldbuilding and paths from `Category` and `Slug`.
