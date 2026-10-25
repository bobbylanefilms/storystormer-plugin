<!-- ABOUTME: The markdown profile: the subset of markdown every document the plugin writes is in, on every backend -->
<!-- ABOUTME: Allowed constructs, what author text keeps as written, the markup-only rewrite table, and the probe evidence behind them -->

# Markdown Profile

The plugin writes one kind of markdown everywhere: the subset that comes back from Notion byte-identical through the Notion binding’s read rendering (with the four additions `tests/markdown-profile/probe-results.md` § Method lists), which is also plain CommonMark that reads the same in Obsidian, Dropbox and any editor. A document in this profile survives a round trip through any backend unchanged under that rendering, so anchors, resume checks and comparisons can be exact.

This document describes what the output looks like. It is a schema for markup, the same kind of thing as `references/file-schemas.md` is for document shapes.

## Scope

- **Plugin text, everywhere.** Every document the plugin writes, and every span it adds or replaces in an existing document, is in the profile, on every backend.
- **Author text on local and Dropbox stays as written.** When a skill edits part of an author’s file, its own new text is in the profile and the author’s surrounding text stays byte for byte. Nothing reformats an author’s file outside the plugin’s own edit.
- **Author text entering Notion is normalized once, in flight.** Author text enters Notion through `migrate` into Notion, `init` intake, and any Notion write that carries author text verbatim: an intake file’s text placed in a canon document, a passage quoted in chapter notes, an author-written outline saved back after a correction pass. On the way in, the § Rewrite table brings that text into the profile. `migrate` shows what will change in its preflight for approval; any other Notion write reports it in one line. The source is never modified. Constructs under § Kept as written are left alone.
- **What the profile covers:** a document’s body, everything after the frontmatter. Frontmatter follows `file-schemas.md` § Frontmatter values. The contents of a fenced code block and of a code span are literal: no rule here applies inside them.
- **Fiction and reference text.** The plugin’s fiction (chapter prose and scene files) is plain paragraphs with no markup at all, no headings and no bold or italic markers, per `references/prose-spec.md` § Output rules; an author’s own fiction may carry more. The rules that only make sense for reference text (state, decision, question and journal entries, canon, outlines, notes, specs), such as paths in code spans, apply to reference text.

## Document

- UTF-8, `\n` line endings, exactly one newline at the end.
- After frontmatter, exactly one empty line, then the body (the Notion binding’s read always renders it so). A document with frontmatter and no body ends at the closing `---` and its newline.
- No line ends in a space or tab, and no line holds only whitespace.
- The body is a sequence of blocks (paragraph, heading, list, quote, table, fenced code block, rule, scene break) separated by **exactly one empty line**. No empty line appears inside a block, except as content inside a fenced code block.
- No line starts with a space or tab, except a nested list item or a block inside an item (indented with spaces, § Lists) and a line inside a fenced code block. Indentation is always spaces; the Notion binding’s write form sends a tab per level, and Notion returns spaces.

## Blocks

**Paragraph:** one or more lines of inline text. A line break inside a paragraph is a bare newline.

```
Ada waits at the dock.
The tide is turning.
```

An unfenced header block at the top of an author’s file (`Title:`, `Category:`, `Created:` lines) is ordinary paragraph text; only a first line of `---` opens frontmatter. A line that starts with a block marker is not a paragraph line: markdown reads it as that block, and the profile and the rewrite table treat it as that block. The markers are `#` (one to six, then a space or the line’s end), `>`, `|`, `- `, `* `, `+ `, digits followed by `.` or `)` and a space, three backticks or tildes, a `<` directly followed by a letter, `/` or `!`, and a line of only `-`, `=`, `*` or `_` characters (with optional spaces). The plugin doesn’t start a paragraph line with one; `#heading` with no space is ordinary text (PB15).

**Heading:** one to four `#`, one space, inline text. No closing sequence (a run of only `#` at the end, after a space), no underlined (setext) headings, nothing deeper than `####`. A `#` that is part of the text stays: `### Issue #12`.

```
### **Ada Vale (Major)**
```

**List:** consecutive item lines with no empty line between them.

- **Bullet item:** `- ` and inline text: `- alpha`.
- **Ordered item:** a number, `.`, one space, inline text: `1. one`. Within one list at one level the numbers go up by one; the first can be any number, so a list that continues past a heading starts at `3.`.
- **To-do item:** `- [ ] ` or `- [x] ` (lowercase `x`) and inline text: `- [x] Add the harbor to worldbuilding.`
- **Nesting:** a child item is indented by its parent’s marker width, the marker and its one space: two spaces under `- ` and under a to-do (the box is content, not marker: PD24), three under `1.` to `9.`, four under `10.` to `99.`, adding up level by level. Probed: bullets in bullets, ordered in bullets, bullets in `1.` and `10.`, to-dos in to-dos.

```
- level one
  - level two
    - level three
1. ordered
   - child under a one-digit number
```

- **Continuation line:** a line directly under an item line that doesn’t itself start an item or a block is that item’s continuation. Markdown reads it that way, at any nesting level, and it starts at the left margin (PD18, PD28). It is how an item holds a line break in author text.

```
- an item that
wraps onto the next line
```

- **The plugin’s own items are single lines:** in plugin output, every line directly under an item line is another item or a nested item.
- **What an item holds:** inline text, its continuation lines, nested items, and a fenced code block indented to the item’s content column with no empty line before it (PR60). No second paragraph after an empty line, no other block (quote, table, heading) inside it, and no empty item.

**Quote:** every line starts with `> ` and inline text; a paragraph break inside the quote is a line holding only `>`. Inline code is fine (PE07); a quote holds no list, heading, fenced code block, nested quote or callout marker. Two quotes in a row are separated by an empty line.

```
> First paragraph of the quote.
>
> Second paragraph of the quote.
```

**Table:** a header row, a separator, then body rows, with no empty line inside.

- **Row:** `|`, then for each cell a space, the cell text, a space and `|`; an empty cell is two spaces: `| Ada |  |`.
- **Separator:** `---` per column, nothing else: `|---|---|`.
- **Cell text:** inline text, with `\|` for a literal pipe and `<br>` for a line break inside the cell. These are the only backslash escape and the only HTML the profile allows, and only in a cell.

```
| Name | Role |
|---|---|
| Ada | lead |
```

**Fenced code block:** an opening line of exactly three backticks, alone or followed by a language name, the contents verbatim, and a closing line of three backticks. Empty lines inside are content (PL22). No content line starts with three or more backticks or tildes. The language is one Notion keeps as written, which the probe found for `bash`, `css`, `diff`, `html`, `javascript`, `json`, `markdown`, `py`, `sql`, `ts` and `yaml`. Notion renames others (`js`, `sh`, `python`, `md`: § Rewrite table) and returns `text`, `txt` and `plain text` as a bare fence.

**Rule:** `---` alone on its line.

**Scene break:** `* * *` alone on its line, exactly three asterisks with single spaces. This is for author text and non-fiction documents; the plugin’s fiction marks a scene break with an empty line (`prose-spec.md` § Output rules; `file-schemas.md` § `chapters/` folder, the prose body), so the plugin itself doesn’t write one.

## Inline

**Emphasis** takes six forms for a whole span, and nests them in one order (below):

| Form | Example |
|---|---|
| italic | `*quiet*` |
| bold | `**Label:**` |
| bold italic | `***Ada’s POV***` |
| strikethrough | `~~struck~~` |
| bold strikethrough | `~~**struck bold**~~` |
| italic strikethrough | `~~*struck italic*~~` |

- **Nesting goes in one order:** strikethrough outermost, then italic, then bold, then a code span. A span may hold spans of a later kind, any number of them, anywhere in its text and with other text around them, to any depth in that order (`*italic with **bold** inside*`, `***bold first** then italic*`, `*a **b** c **d** e*`, `~~*a **b** c*~~`, `~~a **b** c *d* e~~`, `**bold with `code` inside**`, `~~*a `x` b*~~`, `*a **b `x` c** d*`), and never one of its own kind or an earlier one (italic inside bold, strikethrough inside either, italic inside italic). Notion stores emphasis per character and returns it nested in that same order, split into runs the read merges, so these come back as written (PC08, PC10, PC13, PC14, and the ring round’s probes 7 and 10, which cover every example here). The combined forms above are this order applied to a whole span.
- The text inside a span doesn’t start or end with whitespace, and holds no other delimiter than the nested spans’ own.
- Two emphasis spans never touch: something sits between them, if only a space: `**bold with** ***italic*** **inside**`.
- A span may sit inside a word (`Un*believ*able`, `**bold**ly`), touch a code span (`` **bold**`code` ``), or cross a line break inside its paragraph.
- **With links:** emphasis never wraps a link or part of one. A link’s text may be one whole emphasis span: `[**bold link**](./x.md)`, `[*the site*](https://example.com)` (PJ13, PR58).
- Emphasis is always asterisks or tildes, never underscores. A literal `_` is ordinary text (`snake_case_name`).

**Code span:** backticks one longer than the longest backtick run inside, padded with one space only when the contents start or end with a backtick: `` `characters/ada-vale.md` ``, ``` ``a`b`` ```. Contents that are all spaces, or that start with a space and don’t end with one, are written as they are (`` ` ` ``, `` ` x` ``: PL24, PL26). Contents never both start and end with a space unless they are all spaces.

**Link:** `[text](target)`, with no title. The target is one of:

- an absolute `https://` or `http://` URL: `[the site](https://example.com/path)`;
- a `mailto:` address: `[someone@example.com](mailto:someone@example.com)`;
- a relative path holding a `/`: `[Ada Vale](./ada-vale.md)`, `[v2](../chapters/chapter-01/ch01-outline.md)`. A bare filename gets `./` in front, since Notion reads `ada-vale.md` as a domain;
- an anchor in the same document: `[the section](#the-section)` (PJ15).

A URL shown as text is a link to itself, `[https://example.com/path](https://example.com/path)`, never a bare URL, an `<…>` autolink or a bare email address.

**Image:** `![alt text](https://example.com/image.png)`, with an absolute URL (PJ07, an image block). Notion drops a relative target (PJ16, PJ17).

**Paths and filenames** in reference text go in code spans: `` `characters/ada-vale.md` ``. Bare, they come back byte-identical, but Notion shows the basename as a link. Fiction carries no code spans.

**Characters:** any Unicode text: curly quotes and apostrophes, dashes, ellipses, other scripts, emoji, and `&`, `$`, `:`, `#`, `@`, `~`, `^`, `[`, `]`, `<`, `>` as ordinary text (Notion escapes them and the read removes the escapes), runs of spaces and tabs inside a line. A literal `*` has a space on both sides (`5 * 3`), or is the only `*` in its paragraph (`Five*three`, PC34). Never, in plugin text:

- a non-breaking space (U+00A0);
- an HTML entity (`&amp;`, `&nbsp;`);
- a backslash escape, apart from `\|` in a table cell;
- an HTML tag or comment, apart from `<br>` in a table cell; a `<` is never directly followed by a letter, `/` or `!`.

## Kept as written

These come back from Notion byte-identical but aren’t in the profile, because Notion stores the markup as visible text or shows it differently. The plugin never writes them, and normalization leaves them alone in author text, on every backend.

**The rule that decides:** a construct whose bytes survive but whose meaning Notion doesn’t keep is rewritten when a markup-only form exists that means the same thing in markdown (an underlined heading becomes a `#` heading; a line break written with a trailing `\` or two trailing spaces becomes a bare newline). It is kept as written when no such form exists, because any rewrite would change what the author’s markdown means elsewhere.

- **Obsidian syntax:** `[[Page]]`, `[[Page|alias]]`, `![[Page]]`, `==highlight==`, `#tag`, `%%comment%%`, `^block-id` and `> [!note]` callouts, all stored as literal text.
- **HTML comments:** shown in Notion as visible text (the Notion binding says so once). A comment line is not a block of its own: run into a paragraph, first, last or between its lines, it stays a line of that paragraph, and set off by empty lines it is a paragraph of its own; either way it comes back as written, so no row adds or removes empty lines around one (probes 11 and 12).
- **A list or a nested quote inside a quote:** stored as the quote’s text.
- **A `*` CommonMark can’t pair** (`DIG*.”`, `tonight.* NO`: neither spaced nor alone in its paragraph): Notion stores it as text and the read returns it (ring round, probe 7). The literal `*` rule under § Inline still governs plugin text.
- **An unpaired `~~`** (a run that can neither open nor close strikethrough, as at the end of `… running.~~` when nothing opens it): Notion stores the tildes as text (`\~\~`) and the read returns them (ring round, probe 7).
- **Backslash escapes** (`\[bracketed\]`, `1984\.`): Notion shows the backslash. (A trailing `\` line break is not one of these; the rewrite table turns it into a bare newline.)
- **Bare paths, filenames and domains** (`characters/ada_vale.md`, `notes.md`): Notion links them; the read collapses the link. Inside a bare path or filename token, the rewrite table’s emphasis and underscore rows and its URL, email and link rows don’t apply, since they would change the name and Notion doesn’t make those changes itself (the Notion binding sends every `_` escaped): `The_Good_Dog_-_Brainstorming_&_Future_Plot_Points.md` keeps its underscores (*observed (2026-10-24)*: a round trip that rewrote `_Brainstorming_` to `*Brainstorming*` inside that filename changed the name). **The entity row still applies inside a token,** because Notion decodes every entity regardless (*observed (2026-10-24)*: `…_&amp;_Future_Plot_Points.md` came back with `&`); so an author’s filename spelled with an entity no longer names the real file once it enters Notion, and `migrate`’s preflight lists each such name. The token is what `tools/md-profile-check.ts` reports as `bare-path`: a run starting at a letter, digit, `_` or `.` that doesn’t continue a word, up to whitespace, a comma, a backslash, `[`, `]`, a `)` with no `(` before it in the run, or any symbol character (`<`, `>`, `|`, a backtick, `~`, `→`), so `&`, `(` and a matched `)` stay inside it (filenames hold them: `Miles_Corwin_-_Character_Profile_(Investigative_Journalist).md`), less any trailing sentence punctuation, closing brackets, quotes and emphasis markers, holding no `://`, that ends in `.` and an extension after at least one letter or digit, and either holds a `/` (with an extension that starts with a letter) or has a common document or data extension (`md`, `markdown`, `txt`, `doc`, `docx`, `pdf`, `json`, `yaml`, `yml`, `csv`, `png`, `jpg`, `jpeg`, `gif`, `svg`). Emphasis around a whole token is still emphasis: `_notes.md_` becomes `*notes.md*`.
- **`<u>`, `<mark>`, `<del>`, `<sup>` and tag-like text** (`a <tag>`): underline is native; the others are stored as raw text (PM04, PM05, PM09, PM11, PI08).
- **A fenced code block that holds fence lines** (a four-backtick fence around a ```` ``` ```` block): it came back intact in five isolation writes, but once, on a long page, it never closed and took every later section with it (PL10).

**No in-profile form.** These change in Notion and have no markup-only rewrite. Normalization leaves them as written, and its report names them:

- a fenced code block inside a quote, which Notion turns into an inline code span (PE11);
- an HTML entity the entity row doesn’t decode, because its character would be markup where it stands (`&lt;b&gt;`, `&#42;x&#42;`, `&amp;lt;`) or is ASCII punctuation the row doesn’t name: Notion decodes it anyway (PI24–PI26);
- a quote, table or heading inside a list item (not probed);
- italic or bold around strikethrough whose rewrite would abut an author’s stray `~~` run (`*~~“Do you want a~~*~~ ***TREAT***`): Notion moves the strikethrough outside itself, giving the text that rewrite would (ring round, `notes/methodology/craft-document.md:241`), so the line changes and the plan names it.

## Rewrite table

How out-of-profile markup becomes profile form. **Normalization applies this table and nothing else, never inside a fenced code block or a code span, and inside a bare path or filename token only its entity row (§ Kept as written); applying it a second time changes nothing.** Every rewrite changes markup only: the words and their order stay, and the only characters that change are the ones a row names (an entity becomes its character, a footnote label loses its `^`, a fence’s language takes Notion’s name). The IDs point to the probe evidence: a construct that changed, then the rewrite (a PR, or another construct already kept in that form).

| Out of profile | In profile | Evidence |
|---|---|---|
| CRLF line endings | `\n` (Notion stores blocks, not line endings) | n/a |
| a body run straight into the frontmatter’s closing `---`, or set off from it by more than one empty line | exactly one empty line between them (the Notion binding’s read always renders one: a child page’s fenced frontmatter is its own block) | ring round: `pipeline/lint/fixtures/sample.md` gained one, `voice/style-guide.md` lost one; ring probe 8 (a child page) |
| a document that ends without a newline, or with empty lines after its last block | exactly one `\n` at the end (Notion stores no final newline, and the read ends every document with exactly one) | n/a; SB5’s ring: 31 files without one |
| a heading, table, quote or paragraph run into the block above or below it, or a list run on directly under a paragraph line | one empty line between them | PA02, PA07, PA09, PO02 → PR01, PR05, PR06 |
| a list indented under a non-list line (`**Possible approaches**:`, then `  - one`), or a list directly under a field label line (a line starting `**<Label>**:`, the form log entries use, or `**<Label>:**`, with the colon inside the bold, as authors also write it) | the list unindented, with an empty line before it and, when a field label line follows its last item, an empty line after it too. A line directly under the last item of such a list that starts with a field label in either form (bold text at the line start with a colon just after it or as its last character) is the next field and gets that empty line; any other line there stays the item’s continuation, as markdown reads it | PO15 → PR55 |
| two or more empty lines between blocks | one | PA04 → PR02 |
| spaces or tabs at the end of a line | removed | PA05 → PR03 |
| a whitespace-only line | an empty line | PA06 → PR04 |
| spaces at the start of a paragraph line | removed | PA11 → PR07 |
| `#####`, `######` | `####` | PB05, PB06 → PR08, PR09 |
| a heading’s closing sequence (`### Closed ###`, `### Issue #`) | removed; markdown and Notion both read the heading without it (`### Issue #12` has none) | PB07, PB13 → PR10 |
| an underlined heading (`===`, `---`) | `# ` or `## ` | PB08, PB09 → PR11, PR12 |
| `_x_` · `__x__` · `___x___`, `**_x_**`, `*__x__*` | `*x*` · `**x**` · `***x***` | PC02, PC04, PC26, PC11, PC12 → PR13, PR14, PR19 |
| a span inside a span of its own kind, as CommonMark pairs the delimiters: italic inside italic (`***b***` inside italic included, and a `*` that pairs across a stretch and encloses another italic span), bold inside bold, strikethrough inside strikethrough. Applied before the next row | every span inside the outer one loses the repeated style and keeps any other: `*a ***b*** c*` → `*a **b** c*`, `**a **b** c**` → `**a b c**`, `~~a ~~b~~ c~~` → `~~a b c~~`, and where the stars of `(*“…just* DIG*.”*)` pair across a stretch holding `*no mistakes*`, that span becomes `no mistakes`; markdown shows that text in the outer style either way | ring round: `voice/style-guide.md:653` and `ch01-blueprint.md:284` changed; probe 7 and probe 10: the rewritten lines came back as written, and the repeated bold and strikethrough came back flattened |
| emphasis nested out of order around part of the outer span: italic inside bold, or strikethrough inside either (`**a *b* c**`, `**a *b***`, `***a* b**`, `**(*a*) b**`) | three steps, in this order, each inner span at a time. **1.** A run of punctuation directly against an edge of the inner span that reaches the outer span’s edge or a space joins the inner span: `**GOOD DOG means *this is over*.**` → `**GOOD DOG means** ***this is over.***`, `**(*a*) b**` → `***(a)*** **b**`, `**(*over* now)**` → `***(over*** **now)**`. **2.** If the inner span still touches the outer span’s text on either side (it starts or ends inside a word, or against punctuation that runs on into a word), the inner style widens to the whole outer span: `**un*believ*able**` → `***unbelievable***`. **3.** Otherwise the outer span is split at the inner span’s edges, spaces moved outside, the inner part in the combined form: `**a *b* c**` → `**a** ***b*** **c**`, `***a* b**` → `***a*** **b**` | PC07, PC09, PG08, PC33 → PR15–PR18, PR38, PR59; ring probe 7 (step 1’s first example changed as a source and came back as written as a result); probe 10 (steps 1 and 3’s results came back as written) |
| italic around strikethrough as a whole span (`*~~x~~*`), unless the result’s closing `~~` would abut another `~~` run (an author’s stray one), which would change what pairs with what: then it is left as written (§ No in-profile form) | `~~*x*~~` | PC31 → PC32 |
| bold around strikethrough as a whole span (`**~~x~~**`), with the same exception | `~~**x**~~` | PC21 → PR22 |
| emphasis around a link or part of one (`**see [x](./x.md) here**`, `*[x](https://example.com)*`) | the emphasis closed around the link, or, when it wraps exactly the link, moved inside the link text: `**see** [x](./x.md) **here**`, `[*x*](https://example.com)` | PJ12, PJ14 → PR56, PR58 |
| `*` or `+` bullets, padded markers (`-   `, `1.  `), `1)` | `- `, `1. ` with one space | PD02–PD04, PD11, PD14 → PR23, PR25 |
| `- [X]` | `- [x]` | PD20 → PR30 |
| nesting with tabs, or not at the parent’s marker width (four spaces under `- `, two under `1.`) | spaces, at the marker width | PD05, PD06, PD22 → PR24, PR31 |
| ordered numbers that don’t go up by one (`1.`, `1.`, `1.`) | consecutive from the first, which is how markdown numbers them anyway | PD12 → PR26 |
| empty lines between list items | removed | PD15 → PR27 |
| a second paragraph or an indented continuation line in a list item | a bare newline and an unindented line | PD16, PD17 → PR28, PR29 |
| an empty line between an item and a fenced code block inside it | removed | PD29 → PR60 |
| an empty list item | removed | PD26 → PR32 |
| a quote line without `>` (lazy continuation), or `>` with no space | `> ` on every line | PE04, PE10 → PR33, PR34 |
| a line break written as two trailing spaces, a trailing `\`, or `<br>` outside a table cell | a bare newline | PF02–PF04 → PR35 |
| any other pipe-table spelling (spaced or long separators, alignment colons, no outer pipes, `\|\|` for an empty cell) | the profile’s table form; alignment is dropped | PG02, PG03, PG05, PG10, PG15 → PR36, PR37 |
| an HTML table | a pipe table with the same cell text; attributes and styles dropped | PG12 → PR39 |
| `------`, `***`, `___`, `* * * *`, `- - -`, `_ _ _` as a rule (never `* * *`, the scene break) | `---` | PH02–PH04, PH06–PH08 → PR40 |
| an HTML entity whose character is ordinary text where it stands: a letter, a digit, any non-ASCII character, `"` or `'`; `&` when what follows doesn’t make another entity; `<` or `>` when no tag, comment or autolink results | that character (`&mdash;` → `—`, `&quot;` → `"`, `a &lt; b` → `a < b`); `&nbsp;` becomes a plain space (the row below) | PI06, PI27, PI28 → PR42 (with a plain space where `&nbsp;` stood), PI03, PI07 |
| a non-breaking space (U+00A0) | a plain space | Notion stores U+00A0 (PI04’s anchor test), but every fetch returns a plain space, so it can’t come back: the ring round lost 36 on the way out of Notion; probe 7 → PR41 |
| `&#124;` (or `&vert;`) in a table cell | `\|` | PG16 → PG06 |
| a bare URL or `<url>`, outside a link and outside code | `[url](url)` | PJ02, PJ03 → PR43 |
| a link title, a reference-style link | an inline link without the title | PJ05, PJ06 → PR44 |
| a bare email address, outside a link and outside code | `[address](mailto:address)` | PJ08 → PR45 |
| a link target that is a bare filename (`ada-vale.md`) | `./ada-vale.md` | PJ09, PO04 → PR46 |
| an image with a relative target (`![alt](image.png)`) | a link with the same text and target, `./` added to a bare filename: `[alt](./image.png)` | PJ16, PJ17 → PR61, PR62 |
| a footnote (`[^1]` and `[^1]: text`) | `[1]` and `[1] text` where they stand; the note is no longer linked | PJ11 → PR47 |
| a code span padded with spaces it doesn’t need (``` `` a`b `` ```), or with one space at each end of contents that aren’t all spaces (`` ` x ` ``) | unpadded; markdown and Notion both read it without them | PL02, PL25 → PR48, PC17 |
| a tilde fence | a backtick fence with the same language | PL06, PL23 → PR49, PL08 |
| a fence language of `text`, `txt` or `plain text` | a bare fence | PL05 → PR49 |
| a fence language Notion renames: `js`, `sh`, `python`, `md` | `javascript`, `bash`, `py`, `markdown` | PL11, PL13, PL15, PL16 → PR63, PL14, PR64, PL17 |
| an indented code block | a bare fenced block | PL07 → PR50 |
| `<b>`, `<strong>` · `<em>` · `<code>` | `**x**` · `*x*` · a code span | PM04, PM08, PM07, PM10 → PR51, PC03, PC01, PC17 |
| `<a href="url">text</a>` · `<img src="url" alt="a">` with an absolute URL | `[text](url)` · `![a](url)` | PM12, PM13 → PJ01, PJ07 |
| `<details><summary>S</summary>B</details>` | `**S**`, an empty line, then `B` | PM06 → PR52 |

## Evidence

Every construct above was written to Notion and read back on 2026-10-24, except where marked otherwise: PL10 (lost once, kept five times), a quote, table or heading inside a list item, and the nesting combinations § Lists doesn’t list as probed. The ring round (a 148-file local → Notion → Dropbox → local migration, the same day) added the nesting order (probes 7 and 10 cover one and several inner spans, three-deep nesting and code inside italic inside strikethrough; deeper or other mixes follow the same order and are unprobed), the repeated-style, split and frontmatter rows and the non-breaking-space row (PI04: Notion stores U+00A0, but every fetch returns a plain space); the evidence is in `probe-results.md` § Ring round. The per-construct results, the exact text Notion returned and the rewrite checks are in `tests/markdown-profile/probe-results.md`, from the inputs `tests/markdown-profile/probe.md` and `tests/markdown-profile/probe-rewrites.md`.

The verdicts assume the Notion binding’s read rendering plus four additions that Notion’s current output needs (inline `<b>`, `<i>`, `<s>`, `<code>` tags read back as markdown, with immediately adjacent identical runs merged; `<br />` read as `<br>`; `txt` fences read as bare; Notion’s pipe tables re-rendered in the profile’s form); `probe-results.md` § Method lists them. Notion’s serializer changed between 2026-10-17 and 2026-10-24, and several SB5 Known limits no longer reproduce (§ Where today contradicts SB5 there), so the probe is re-run before a release and whenever a round trip shows new drift.
