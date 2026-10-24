<!-- ABOUTME: The markdown profile: the subset of markdown every document the plugin writes is in, on every backend -->
<!-- ABOUTME: Allowed constructs, what author text keeps as written, the markup-only rewrite table, and the probe evidence behind them -->

# Markdown Profile

The plugin writes one kind of markdown everywhere: the subset that comes back from Notion byte-identical, which is also plain CommonMark that reads the same in Obsidian, Dropbox and any editor. A document in this profile survives a round trip through any backend unchanged, so anchors, resume checks and comparisons can be exact.

This document describes what the output looks like. It is a schema for markup, the same kind of thing as `references/file-schemas.md` is for document shapes.

## Scope

- **Plugin text, everywhere.** Every document the plugin writes, and every span it adds or replaces in an existing document, is in the profile, on every backend.
- **Author text on local and Dropbox stays as written.** When a skill edits part of an author’s file, its own new text is in the profile and the author’s surrounding text stays byte for byte. Nothing reformats an author’s file outside the plugin’s own edit.
- **Author text entering Notion is normalized once, in flight.** When author text goes into Notion (`migrate` into Notion, `init` intake, a quote of author text in a Notion write), the § Rewrite table brings it into the profile on the way in. `migrate` shows what will change in its preflight for approval; any other Notion write reports it in one line. The source is never modified. Constructs under § Kept as written are left alone.
- **What the profile covers:** a document’s body, everything after the frontmatter. Frontmatter follows `file-schemas.md` § Frontmatter values, and the contents of a fenced code block are literal.

## Document

- UTF-8, `\n` line endings, exactly one newline at the end.
- No line ends in a space or tab, and no line holds only whitespace.
- The body is a sequence of blocks (paragraph, heading, list, quote, table, fenced code block, rule, scene break) separated by **exactly one empty line**, and no empty line appears inside a block.
- No line starts with a space or tab, except a nested list item (§ Lists) and a line inside a fenced code block.

## Blocks

**Paragraph:** one or more lines of inline text. A line break inside a paragraph is a bare newline.

```
Ada waits at the dock.
The tide is turning.
```

A paragraph line never starts with something another block would claim: `#`, `>`, `|`, `- `, `* `, `+ `, digits followed by `.` or `)` and a space, three backticks or tildes, a `<`, or a line of only `-`, `=`, `*` or `_`.

**Heading:** one to four `#`, one space, inline text. No closing `#`s, no underlined (setext) headings, nothing deeper than `####`.

```
### **Ada Vale (Major)**
```

**List:** consecutive item lines with no empty line between them.

- **Bullet item:** `- ` and inline text: `- alpha`.
- **Ordered item:** a number, `.`, one space, inline text: `1. one`. Within one list at one level the numbers go up by one; the first can be any number, so a list that continues past a heading starts at `3.`.
- **To-do item:** `- [ ] ` or `- [x] ` (lowercase `x`) and inline text: `- [x] Add the harbor to worldbuilding.`
- **Nesting:** a child item is indented by its parent’s marker width: two spaces under `- ` or a to-do, three under `1.` to `9.`, four under `10.` to `99.`, adding up level by level.

```
- level one
  - level two
    - level three
1. ordered
   - child under a one-digit number
```

- **Line break inside a top-level item:** a bare newline, and the next line starts at the left margin. The plugin’s own items are single lines.

```
- an item that
wraps onto the next line
```

- An item holds inline text only: no second paragraph and no other block inside it, and no empty item.

**Quote:** every line starts with `> ` and inline text; a paragraph break inside the quote is a line holding only `>`. A quote holds no list, heading, code, nested quote or callout marker. Two quotes in a row are separated by an empty line.

```
> First paragraph of the quote.
>
> Second paragraph of the quote.
```

**Table:** a header row, a separator, then body rows, with no empty line inside.

- **Row:** `|`, then for each cell a space, the cell text, a space and `|`; an empty cell is two spaces: `| Ada |  |`.
- **Separator:** `---` per column, nothing else: `|---|---|`.
- **Cell text:** inline text, with `\|` for a literal pipe and `<br>` for a line break inside the cell.

```
| Name | Role |
|---|---|
| Ada | lead |
```

**Fenced code block:** an opening line of exactly three backticks, alone or followed by a language name (```` ```yaml ````, ```` ```ts ````), the contents verbatim, and a closing line of three backticks. The language is never `text`, `txt` or `plain text` (they come back bare), and no content line starts with three or more backticks or tildes.

**Rule:** `---` alone on its line.

**Scene break:** `* * *` alone on its line.

## Inline

**Emphasis** takes exactly five forms:

| Form | Example |
|---|---|
| italic | `*quiet*` |
| bold | `**Label:**` |
| bold italic | `***Ada’s POV***` |
| strikethrough | `~~struck~~` |
| bold strikethrough | `~~**struck bold**~~` |

- The text inside a span holds no other emphasis delimiter and no code span, and doesn’t start or end with whitespace. The bold-italic and bold-strikethrough forms wrap a whole span; nothing else nests.
- Two emphasis spans never touch: something sits between them, if only a space: `**bold with** ***italic*** **inside**`.
- A span may sit inside a word (`Un*believ*able`, `**bold**ly`), touch a code span (`` **bold**`code` ``), or cross a line break inside its paragraph.
- Emphasis is always asterisks or tildes, never underscores. A literal `_` is ordinary text (`snake_case_name`), and a literal `*` has a space on both sides (`5 * 3`).

**Code span:** backticks one longer than the longest backtick run inside, padded with one space only when the contents start or end with a backtick: `` `characters/ada-vale.md` ``, ``` ``a`b`` ```.

**Link:** `[text](target)`, with no title. The target is one of:

- an absolute `https://` or `http://` URL: `[the site](https://example.com/path)`;
- a `mailto:` address: `[someone@example.com](mailto:someone@example.com)`;
- a relative path holding a `/`: `[Ada Vale](./ada-vale.md)`, `[v2](../chapters/chapter-01/ch01-outline.md)`. A bare filename gets `./` in front, since Notion reads `ada-vale.md` as a domain.

A URL shown as text is a link to itself, `[https://example.com/path](https://example.com/path)`, never a bare URL, an `<…>` autolink or a bare email address.

**Paths and filenames** in prose go in code spans: `` `characters/ada-vale.md` ``. Bare, they come back byte-identical, but Notion shows the basename as a link.

**Characters:** any Unicode text: curly quotes and apostrophes, dashes, ellipses, other scripts, emoji, and `&`, `$`, `:`, `#`, `@`, `~`, `^`, `[`, `]`, `<`, `>` as ordinary text (Notion escapes them and the read removes the escapes), runs of spaces and tabs inside a line. Never:

- a non-breaking space (U+00A0);
- an HTML entity (`&amp;`, `&nbsp;`);
- a backslash escape (`\*`, `\[`);
- an HTML tag or comment, apart from `<br>` in a table cell; a `<` is never directly followed by a letter, `/` or `!`.

## Kept as written

These come back from Notion byte-identical but aren’t in the profile, because Notion stores the markup as visible text or shows it differently. The plugin never writes them. Author text that holds them keeps them, on every backend, including on the way into Notion: normalization leaves them alone.

- **Obsidian syntax:** `[[Page]]`, `[[Page|alias]]`, `![[Page]]`, `==highlight==`, `#tag`, `%%comment%%`, `^block-id` and `> [!note]` callouts, all stored as literal text.
- **HTML comments:** shown in Notion as a visible paragraph (the Notion binding says so once).
- **A list or a nested quote inside a quote:** stored as the quote’s text.
- **Backslash escapes** (`\[bracketed\]`, `1984\.`): Notion shows the backslash.
- **Bare paths, filenames and domains** (`characters/ada_vale.md`, `notes.md`): Notion links them; the read collapses the link.
- **`<u>underline</u>`, `<mark>` and tag-like text** (`a <tag>`): underline is native, the others are stored as raw text.
- **Images:** `![alt text](https://example.com/image.png)`, an image block.
- **A fenced code block that holds fence lines** (a four-backtick fence around a ```` ``` ```` block): it came back intact in five isolation writes, but once, on a long page, it never closed and took every later section with it. A write that holds one is read back and compared.

## Rewrite table

How out-of-profile markup becomes profile form. Every rewrite changes markup only: the words, their order and their characters stay. The IDs point to the probe evidence.

| Out of profile | In profile | Evidence |
|---|---|---|
| a heading, list, table, quote or paragraph run into the block above or below it | one empty line between them | PA02, PA07, PA09, PO02 → PR01, PR05, PR06 |
| two or more empty lines | one | PA04 → PR02 |
| spaces or tabs at the end of a line | removed | PA05 → PR03 |
| a whitespace-only line | an empty line | PA06 → PR04 |
| spaces at the start of a paragraph line | removed | PA11 → PR07 |
| `#####`, `######` | `####` | PB05, PB06 → PR08, PR09 |
| closing `#`s on a heading | removed | PB07 → PR10 |
| an underlined heading (`===`, `---`) | `# ` or `## ` | PB08, PB09 → PR11, PR12 |
| `_x_` · `__x__` · `___x___`, `**_x_**`, `*__x__*` | `*x*` · `**x**` · `***x***` | PC02, PC04, PC26, PC11, PC12 → PR13, PR14, PR19 |
| emphasis nested inside emphasis, or sharing a delimiter with it (`**a *b* c**`, `**a *b***`, `***a** b*`) | adjacent spans split at the inner edges, the inner part in the combined form, edge spaces moved outside: `**a** ***b*** **c**` | PC07–PC10, PG08 → PR15–PR18, PR38 |
| emphasis around a code span (`` **a `x` b** ``) | the emphasis closed before the code and reopened after: `` **a** `x` **b** `` | PC13, PC14 → PR20, PR21 |
| `**~~x~~**` | `~~**x**~~` | PC21 → PR22 |
| `*` or `+` bullets, padded markers (`-   `, `1.  `), `1)` | `- `, `1. ` with one space | PD02–PD04, PD11, PD14 → PR23, PR25 |
| `- [X]` | `- [x]` | PD20 → PR30 |
| nesting not at the parent’s marker width (four spaces under `- `, two under `1.`) | the marker width | PD06, PD22 → PR24, PR31 |
| ordered numbers that don’t go up by one (`1.`, `1.`, `1.`) | consecutive from the first, which is how markdown numbers them anyway | PD12 → PR26 |
| empty lines between list items | removed | PD15 → PR27 |
| a second paragraph or an indented continuation line in a list item | a bare newline and an unindented line | PD16, PD17 → PR28, PR29 |
| an empty list item | removed | PD26 → PR32 |
| a quote line without `>` (lazy continuation), or `>` with no space | `> ` on every line | PE04, PE10 → PR33, PR34 |
| a line break written as two trailing spaces, a trailing `\` or `<br>` | a bare newline | PF02–PF04 → PR35 |
| any other pipe-table spelling (spaced or long separators, alignment colons, no outer pipes, `\|\|` for an empty cell) | the profile’s table form; alignment is dropped | PG02, PG03, PG05, PG10, PG15 → PR36, PR37 |
| an HTML table | a pipe table with the same cell text; attributes and styles dropped | PG12 → PR39 |
| `------`, `***`, `___`, `- - -` as a rule | `---` | PH02–PH04, PH06 → PR40 |
| a non-breaking space | a space | PI04 → PR41 |
| an HTML entity | the character it names; `&nbsp;` a space | PI06 → PR42 |
| a bare URL or `<url>` | `[url](url)` | PJ02, PJ03 → PR43 |
| a link title, a reference-style link | an inline link without the title | PJ05, PJ06 → PR44 |
| a bare email address | `[address](mailto:address)` | PJ08 → PR45 |
| a link target that is a bare filename (`ada-vale.md`) | `./ada-vale.md` | PJ09, PO04 → PR46 |
| a footnote (`[^1]` and `[^1]: text`) | `[1]` and `[1] text` where they stand; the note is no longer linked | PJ11 → PR47 |
| a code span padded with spaces it doesn’t need | unpadded | PL02 → PR48 |
| a `text`, `txt` or tilde fence; an indented code block | a bare three-backtick fence | PL05–PL07 → PR49, PR50 |
| an HTML emphasis tag (`<b>x</b>`) | its markdown form (`**x**`) | PM04 → PR51 |
| `<details><summary>S</summary>B</details>` | `**S**`, an empty line, then `B` | PM06 → PR52 |

Normalization applies this table and nothing else, and applying it twice changes nothing more.

## Evidence

Every construct above was written to Notion and read back on 2026-10-24; the per-construct results, the exact text Notion returned and the rewrite checks are in `tests/markdown-profile/probe-results.md`, from the inputs `tests/markdown-profile/probe.md` and `tests/markdown-profile/probe-rewrites.md`.

The verdicts assume the Notion binding’s read rendering plus four additions that Notion’s current output needs (inline `<b>`, `<i>`, `<s>`, `<code>` tags read back as markdown; `<br />` read as `<br>`; `txt` fences read as bare; Notion’s pipe tables re-rendered in the profile’s form); `probe-results.md` § Method lists them. Notion’s serializer changed between 2026-10-17 and 2026-10-24, and several SB5 Known limits no longer reproduce (§ Where today contradicts SB5 there), so the probe is re-run before a release and whenever a round trip shows new drift.
