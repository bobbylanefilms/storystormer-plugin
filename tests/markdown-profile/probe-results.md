<!-- ABOUTME: Evidence for references/markdown-profile.md: what Notion returned for every construct in probe.md and probe-rewrites.md -->
<!-- ABOUTME: Probe runs of 2026-10-24 against the sb6-probe project in the StoryStormer hub; method, per-construct results, rewrites, isolation tests -->

# Markdown Profile Probe Results

**Runs:** 2026-10-24, in two rounds (the first probe, then the constructs a review of the profile asked for), through the Notion connector in a Claude Code session, against the test project `sb6-probe` (Projects row `403e980b-9c74-81a6-82b4-e342d7001d87`) in the `StoryStormer` hub at the private root. Everything written is synthetic.

## Headline

1. **Notion’s fetch serializer changed since SB5.** On 2026-10-17 a fetch returned markdown emphasis (`**x**`, `*x*`). On 2026-10-24 every fetch, including a page written during SB5, returns inline HTML tags: `<b>`, `<i>`, `<s>`, `<code>`, `<br />`. Property text changed too: an SB5 `Meta` value now comes back with `\_` escapes, `<br />` and `<code>`. The binding’s read rendering (`references/store/notion.md` § Rendering) has no rule for these tags, so read literally, every bold word in every document comes back changed. The verdicts below assume four additions to the read rendering (§ Method, E1–E4); the binding needs them whether or not the profile ships.
2. **With those additions, most of the hypothesis holds**, and several SB5 Known limits no longer reproduce: `***bold italic***` round-trips, as do ordered lists that start or continue past 1, intraword underscores, and `~~**x**~~`. What still changes is mostly spacing, alternative marker spellings, nested or boundary-sharing emphasis, links whose target looks like a domain, and anything HTML.
3. **One write lost most of a page.** On page 1 a four-backtick fence never closed, and the 27 sections after it became the body of one code block, with no warning from the connector. Five isolation writes, by create and by `replace_content`, kept the same fence intact (§ Isolation tests), so the trigger is somewhere in the combination. The profile keeps fences that hold fence lines out of plugin output, and any write path that cares about content should read back and compare.
4. **Every adopted rewrite came back byte-identical** (§ Rewrites). One candidate failed (PR57, bold around a whole link) and the profile uses PR58’s form instead: the emphasis inside the link text.
5. **The second round** found Notion renaming code-fence languages (`js` → `javascript`, `sh` → `bash`, `python` → `py`, `md` → `markdown`), dropping the target of a relative image, decoding every HTML entity (so `&lt;b&gt;` reads back as a real tag and `&#42;x&#42;` as italics), and splitting bold around a link the way it splits bold around code.

## Method

**What was written.** `probe.md` holds 243 constructs, one per `## P<group><nn> <name>` section. It went to Notion as Assets rows of `sb6-probe` with `Kind` = research, in the binding’s **write form** (§ Rendering: every `\` outside code doubled; a newline inside a paragraph, quote or list item sent as `<br>`; a tab per nesting level; pipe tables sent as `<table header-row="true">`; a bare fence sent as `plain text`; `* * *` sent as `\* \* \*`):

| Page | Row (page id) | Holds | Written by |
|---|---|---|---|
| 1 | `markdown-probe` (`403e980b-9c74-81f5-9341-ffbb7b00b13a`) | the whole probe as of the first write (191 constructs) | create with a placeholder body, then `replace_content` with the body, since the body starts with a `#` heading |
| 2 | `markdown-probe-2` (`403e980b-9c74-8129-900c-dd598837e64a`) | the 27 sections page 1 lost (PM01–PZ99), PI04 re-sent with an explicit U+00A0, and two new constructs (PD27, PI23) | create |
| R | `markdown-probe-rewrites` (`403e980b-9c74-81c2-ac21-d9880d72c9fc`) | `probe-rewrites.md` | create |
| A, B, C | `markdown-probe-fence-a`, `-b`, `-c` (`403e980b-9c74-81b4-9ef2-d58407725b3d`, `…81e9-a024-db01def8c23d`, `…8176-966b-d598b36b1c2a`) | isolation tests for PL10 and PI04 (§ Isolation tests) | create, then `replace_content` |
| 3 | `markdown-probe-3` (`403e980b-9c74-810e-99c8-fa57fbe3256a`) | round two: the 50 constructs added after review, and rewrites PR55–PR59 | create |
| 4 | `markdown-probe-4` (`403e980b-9c74-8119-b851-caffa042061f`) | round two: rewrites PR60–PR64 | create |

**What was compared.** Each page was fetched once and its `<content>` rendered back with the binding’s **read rendering**: a backslash before ASCII punctuation removed (R1); `plain text` fences read as bare (R2); blank-line runs collapsed (R3); `<br>` in a block read as a newline, with `> ` on each quote line after it and `<br>` kept in table cells (R4); nesting indentation (R5: the binding reads a tab as two spaces, but that never fired: every nested item was sent with a tab per level, and Notion returned spaces, two under `- `, three under `1.`, four under `10.`); `<table>` rebuilt as a pipe table (R6); `[t](http://t)` and `[t](https://t)` collapsed to `t` (R7); one final newline (R9). Four additions were needed for today’s serializer:

- **E1, inline tags:** `<b>` and `</b>` read as `**`, `<i>` and `</i>` as `*`, `<s>` and `</s>` as `~~`, each tag mapped where it stands; added after the mini round trip (§ Mini round trip, b2), immediately adjacent identical runs (`</b><b>`, `</i><i>`, `</s><s>` with nothing between) are merged first, and nothing else is; `<code>x</code>` reads as a backtick span whose delimiter is one backtick longer than the longest run inside, padded with one space only when the content starts or ends with a backtick. `<u>` stays `<u>`.
- **E2, `<br />`:** read the same as `<br>`.
- **E3, `txt` fences:** Notion now returns a bare or `plain text` fence as `txt`, so `txt` reads as bare too.
- **E4, Notion’s pipe tables:** Notion returns tables as pipe tables with `| --- |` separators, so the `|---|---|` form is a read-side normalization, not something Notion keeps. The tables are re-rendered in one form: `| a | b |` rows, a `|---|---|` separator, an empty cell as `|  |`, a literal `|` in a cell as `\|`.

The rendered read was compared byte for byte with the source, section by section (the text from each `## P…` heading to the next).

**Verdicts.** **K** kept (byte-identical, stored as the intended block) · **C** changed · **L** byte-identical, but Notion stores the markup as visible text or as a different block · **S** byte-identical, but Notion shows it differently (an autolink the read collapses) · **X** byte-identical, but excluded by design · **U** unverifiable from the fetch · **W** swallowed on page 1 by the unclosed fence, retested in isolation. In the table, `↵` marks a newline; the text starts right after the section’s heading line, so a leading `↵` is the blank line under the heading. “Returned” is Notion’s text inside `<content>`; “Read renders” is that text after the read rendering, shown only when the two differ.

Totals: 243 constructs: 124 K, 91 C, 21 L, 4 S, 1 X, 1 U, 1 W.

## Per-construct results

| ID | Construct | Page | Verdict | Returned (when not K) | Read renders (when changed) | Note |
|---|---|---|---|---|---|---|
| PA01 | heading-blank-paragraph | 1 | K |  |  |  |
| PA02 | heading-no-blank-paragraph | 1 | C | `↵This paragraph sits directly under its heading with no blank line.` | (same as returned) |  |
| PA03 | two-paragraphs-one-blank | 1 | K |  |  |  |
| PA04 | two-paragraphs-two-blanks | 1 | C | `↵First paragraph.↵↵Second paragraph after two blank lines.` | (same as returned) |  |
| PA05 | trailing-spaces | 1 | C | `↵This line ends with three spaces.` | (same as returned) |  |
| PA06 | whitespace-only-line | 1 | C | `↵Paragraph one.↵↵Paragraph two after a whitespace-only line.` | (same as returned) |  |
| PA07 | label-line-then-list-no-blank | 1 | C | `↵<b>Label line:</b>↵↵- first item↵- second item` | `↵**Label line:**↵↵- first item↵- second item` |  |
| PA08 | label-line-blank-then-list | 1 | K |  |  |  |
| PA09 | paragraph-then-heading-no-blank | 1 | C | `↵A paragraph with a heading right under it.↵↵### Sub heading under a paragraph` | (same as returned) |  |
| PA10 | tab-inside-paragraph | 1 | K |  |  |  |
| PA11 | leading-spaces-paragraph | 1 | C | `↵This paragraph starts with two spaces.` | (same as returned) |  |
| PB01 | h1-mid-document | 1 | K |  |  |  |
| PB02 | h2 | 1 | K |  |  |  |
| PB03 | h3 | 1 | K |  |  |  |
| PB04 | h4 | 1 | K |  |  |  |
| PB05 | h5 | 1 | C | `↵#### Level five heading` | (same as returned) |  |
| PB06 | h6 | 1 | C | `↵#### Level six heading` | (same as returned) |  |
| PB07 | closing-hashes | 1 | C | `↵### Closed heading` | (same as returned) |  |
| PB08 | setext-h1 | 1 | L | `↵Setext level one<br />================` |  | stored as a paragraph with a line break, not a heading |
| PB09 | setext-h2 | 1 | C | `↵Setext level two↵↵---` | (same as returned) |  |
| PB10 | heading-italic-code | 1 | K |  |  |  |
| PB11 | heading-bold | 1 | K |  |  |  |
| PB12 | heading-number-lead | 1 | K |  |  |  |
| PC01 | italic-star | 1 | K |  |  |  |
| PC02 | italic-underscore | 1 | C | `↵Some <i>italic</i> text.` | `↵Some *italic* text.` |  |
| PC03 | bold-star | 1 | K |  |  |  |
| PC04 | bold-underscore | 1 | C | `↵Some <b>bold</b> text.` | `↵Some **bold** text.` |  |
| PC05 | strike | 1 | K |  |  |  |
| PC06 | bold-italic-triple | 1 | K |  |  |  |
| PC07 | italic-inside-bold | 1 | C | `↵Some <b>bold with </b><i><b>italic</b></i><b> inside</b> text.` | `↵Some **bold with *****italic***** inside** text.` |  |
| PC08 | bold-inside-italic | 1 | K | `↵Some <i>italic with </i><i><b>bold</b></i><i> inside</i> text.` |  | C before the adjacent-run merge (E1), which reads it as written; it read `↵Some *italic with ****bold**** inside* text.` |
| PC09 | shared-close-boundary | 1 | C | `↵Some <b>bold ending in </b><i><b>italic</b></i> text.` | `↵Some **bold ending in *****italic*** text.` |  |
| PC10 | shared-open-boundary | 1 | K | `↵Some <i><b>bold first</b></i><i> then italic</i> text.` |  | C before the adjacent-run merge (E1); it read `↵Some ***bold first**** then italic* text.` |
| PC11 | bold-around-underscore-italic | 1 | C | `↵Some <i><b>mixed</b></i> text.` | `↵Some ***mixed*** text.` |  |
| PC12 | italic-around-underscore-bold | 1 | C | `↵Some <i><b>mixed</b></i> text.` | `↵Some ***mixed*** text.` |  |
| PC13 | bold-around-code | 1 | K | `↵Some <b>bold with </b><b><code>code</code></b><b> inside</b> text.` |  | C before the adjacent-run merge (E1); it read ``↵Some **bold with ****`code`**** inside** text.`` |
| PC14 | italic-around-code | 1 | K | `↵Some <i>italic with </i><i><code>code</code></i><i> inside</i> text.` |  | C before the adjacent-run merge (E1); it read ``↵Some *italic with **`code`** inside* text.`` |
| PC15 | bold-space-code | 1 | K |  |  |  |
| PC16 | bold-touching-code | 1 | K |  |  |  |
| PC17 | code-alone | 1 | K |  |  |  |
| PC18 | intraword-star | 1 | K |  |  |  |
| PC19 | intraword-underscore | 1 | K |  |  | Notion escapes the underscores |
| PC20 | strike-around-bold | 1 | K |  |  | SB5 saw `~~**x**~~` come back `**~~x~~**` |
| PC21 | bold-around-strike | 1 | C | `↵Some <s><b>bold struck</b></s> text.` | `↵Some ~~**bold struck**~~ text.` |  |
| PC22 | single-tilde | 1 | K |  |  | Notion escapes the tildes |
| PC23 | italic-across-line-break | 1 | K |  |  |  |
| PC24 | spaced-stars-literal | 1 | K |  |  |  |
| PC25 | literal-stars | 1 | K |  |  |  |
| PC26 | bold-italic-underscore-triple | 1 | C | `↵Some <i><b>bold italic</b></i> text.` | `↵Some ***bold italic*** text.` |  |
| PC27 | bold-touching-word | 1 | K |  |  |  |
| PC28 | bold-italic-before-punctuation | 1 | K |  |  |  |
| PC29 | italic-whole-paragraph | 1 | K |  |  |  |
| PC30 | bold-whole-paragraph | 1 | K |  |  |  |
| PD01 | dash-bullets | 1 | K |  |  |  |
| PD02 | star-bullets | 1 | C | `↵- alpha↵- beta` | (same as returned) |  |
| PD03 | plus-bullets | 1 | C | `↵- alpha↵- beta` | (same as returned) |  |
| PD04 | padded-bullets | 1 | C | `↵- alpha↵- beta` | (same as returned) |  |
| PD05 | nested-two-space | 1 | K |  |  |  |
| PD06 | nested-four-space | 1 | C | `↵- level one↵  - level two↵    - level three` | (same as returned) |  |
| PD07 | ordered | 1 | K |  |  |  |
| PD08 | ordered-start-three | 1 | K |  |  | SB5 (2026-10-17) saw continued numbering restart at 1 |
| PD09 | ordered-continued-after-heading | 1 | K |  |  | SB5 saw continued numbering restart at 1 |
| PD10 | ordered-continued-after-paragraph | 1 | K |  |  | SB5 saw continued numbering restart at 1 |
| PD11 | ordered-paren | 1 | C | `↵1. one↵2. two` | (same as returned) |  |
| PD12 | ordered-all-ones | 1 | C | `↵1. one↵2. two↵3. three` | (same as returned) |  |
| PD13 | ordered-ten | 1 | K |  |  |  |
| PD14 | ordered-padded | 1 | C | `↵1. one↵2. two` | (same as returned) |  |
| PD15 | loose-bullets | 1 | C | `↵- alpha↵- beta↵- gamma` | (same as returned) |  |
| PD16 | item-continuation-paragraph | 1 | C | `↵- an item↵  <p>↵  with a second paragraph inside it↵  </p>↵- next item` | (same as returned) |  |
| PD17 | item-soft-break-indented | 1 | C | `↵- an item that<br />wraps onto an indented line↵- next item` | `↵- an item that↵wraps onto an indented line↵- next item` |  |
| PD18 | item-soft-break-lazy | 1 | K |  |  |  |
| PD19 | todos | 1 | K |  |  |  |
| PD20 | todo-capital-x | 1 | C | `↵- [x] done task with capital X` | (same as returned) |  |
| PD21 | ordered-in-bullet | 1 | K |  |  |  |
| PD22 | bullet-in-ordered-two-space | 1 | C | `↵1. ordered↵   - bullet child two spaces↵2. ordered` | (same as returned) |  |
| PD23 | bullet-in-ordered-three-space | 1 | K |  |  |  |
| PD24 | nested-todos | 1 | K |  |  |  |
| PD25 | bold-label-items | 1 | K |  |  |  |
| PD26 | empty-item | 1 | C | `↵<ul>↵<li>↵alpha↵</li>↵<li></li>↵<li>↵gamma↵</li>↵</ul>` | (same as returned) |  |
| PD27 | bullet-in-ordered-ten | 2 | K |  |  |  |
| PE01 | quote-single-line | 1 | K |  |  |  |
| PE02 | quote-two-lines | 1 | K |  |  |  |
| PE03 | quote-two-paragraphs | 1 | K |  |  |  |
| PE04 | quote-lazy-continuation | 1 | C | `↵> First line of the quote.<br />Lazy second line.` | `↵> First line of the quote.↵> Lazy second line.` |  |
| PE05 | quote-with-list | 1 | L | `↵> Lead line.<br />- quoted item one<br />- quoted item two` |  | the list markers are stored as quote text, not a list |
| PE06 | quote-nested | 1 | L | `↵> Outer quote.<br /><br />> Inner quote.` |  | the inner `>` is stored as text, not a nested quote |
| PE07 | quote-emphasis-code | 1 | K |  |  |  |
| PE08 | two-quotes | 1 | K |  |  |  |
| PE09 | obsidian-callout | 1 | L | `↵> \[!note\] Callout title<br />Callout body.` |  | the callout marker is stored as text |
| PE10 | quote-no-space | 1 | C | `↵> No space after the marker.` | (same as returned) |  |
| PF01 | bare-newline-break | 1 | K |  |  |  |
| PF02 | two-space-break | 1 | X | `↵Line one  <br />line two` |  | kept, but a line may not end in whitespace (PA05: trailing spaces elsewhere are stripped); a bare newline gives the same break |
| PF03 | backslash-break | 1 | L | `↵Line one\\<br />line two` |  | Notion stores and shows the backslash before the break |
| PF04 | html-br | 1 | C | `↵Line one<br />line two` | `↵Line one↵line two` |  |
| PG01 | pipe-table-canonical | 1 | K |  |  |  |
| PG02 | pipe-table-spaced-separator | 1 | C | `↵\| Name \| Role \|↵\| --- \| --- \|↵\| Ada \| lead \|` | `↵\| Name \| Role \|↵\|---\|---\|↵\| Ada \| lead \|` |  |
| PG03 | pipe-table-alignment | 1 | C | `↵\| Left \| Right \|↵\| --- \| --- \|↵\| a \| b \|` | `↵\| Left \| Right \|↵\|---\|---\|↵\| a \| b \|` |  |
| PG04 | pipe-table-empty-cell-spaced | 1 | K |  |  |  |
| PG05 | pipe-table-empty-cell-tight | 1 | C | `↵\| Name \| Note \|↵\| --- \| --- \|↵\| Ada \|  \|` | `↵\| Name \| Note \|↵\|---\|---\|↵\| Ada \|  \|` |  |
| PG06 | pipe-table-escaped-pipe | 1 | K |  |  |  |
| PG07 | pipe-table-emphasis | 1 | K |  |  |  |
| PG08 | pipe-table-nested-emphasis | 1 | C | `↵\| Style \| Sample \|↵\| --- \| --- \|↵\| nested \| <b>bold </b><i><b>inner</b></i><b> bold</b> \|↵\| triple \| <i><b>both</b></i> \|` | `↵\| Style \| Sample \|↵\|---\|---\|↵\| nested \| **bold *****inner***** bold** \|↵\| triple \| ***both*** \|` |  |
| PG09 | pipe-table-code | 1 | K |  |  |  |
| PG10 | pipe-table-no-outer-pipes | 1 | C | `↵\| Name \| Role \|↵\| --- \| --- \|↵\| Ada \| lead \|` | `↵\| Name \| Role \|↵\|---\|---\|↵\| Ada \| lead \|` |  |
| PG11 | pipe-table-br | 1 | K |  |  |  |
| PG12 | html-table | 1 | C | `↵<table>↵<tr>↵<td>↵Name↵</td>↵<td>↵Role↵</td>↵</tr>↵<tr>↵<td>↵Ada↵</td>↵<td>↵lead↵</td>↵</tr>↵</table>` | `↵\| Name \| Role \|↵\|---\|---\|↵\| Ada \| lead \|` |  |
| PG13 | pipe-table-one-column | 1 | K |  |  |  |
| PG14 | pipe-table-link-quotes | 1 | K |  |  |  |
| PG15 | pipe-table-wide-separator | 1 | C | `↵\| Name \| Role \|↵\| --- \| --- \|↵\| Ada \| lead \|` | `↵\| Name \| Role \|↵\|---\|---\|↵\| Ada \| lead \|` |  |
| PH01 | rule-three-dashes | 1 | K |  |  |  |
| PH02 | rule-six-dashes | 1 | C | `↵Above.↵↵---↵↵Below.` | (same as returned) |  |
| PH03 | rule-stars | 1 | C | `↵Above.↵↵---↵↵Below.` | (same as returned) |  |
| PH04 | rule-underscores | 1 | C | `↵Above.↵↵---↵↵Below.` | (same as returned) |  |
| PH05 | scene-break | 1 | K |  |  |  |
| PH06 | rule-spaced-dashes | 1 | C | `↵Above.↵↵---↵↵Below.` | (same as returned) |  |
| PI01 | curly-quotes | 1 | K |  |  |  |
| PI02 | dashes-ellipsis | 1 | K |  |  |  |
| PI03 | straight-quotes-dots | 1 | K |  |  |  |
| PI04 | nbsp | 2 | U | `↵Two words joined by a non-breaking space.` | (same as returned) | the exact-anchor test shows Notion stores U+00A0; the fetch text can’t show it by eye, and SB5 saw it come back as a space |
| PI05 | non-ascii | 1 | K |  |  |  |
| PI06 | entity-text | 1 | C | `↵Ampersand & entity, — and   written as entities.` | (same as returned) |  |
| PI07 | angle-brackets | 1 | K |  |  |  |
| PI08 | tag-like-text | 1 | L | `↵A literal \<tag> in prose.` |  | connector warning: `<tag>` “is not a supported tag and was applied as raw text” |
| PI09 | colons-backslashes | 1 | L | `↵At 6:00, see C:\\Users\\ada and \\\[bracketed\\\] and \\<i>not italic\\</i>.` |  | bytes come back, but the doubled backslashes are stored and shown, and `\*not italic\*` is stored as italics between literal backslashes |
| PI10 | markers | 1 | K |  |  |  |
| PI11 | dollars | 1 | K |  |  |  |
| PI12 | emoji-shortcode | 1 | K |  |  |  |
| PI13 | hashes | 1 | K |  |  |  |
| PI14 | at-name | 1 | K |  |  |  |
| PI15 | symbols | 1 | K |  |  |  |
| PI16 | tildes | 1 | K |  |  |  |
| PI17 | caret | 1 | K |  |  |  |
| PI18 | double-hyphen-arrow | 1 | K |  |  |  |
| PI19 | log-header-line | 1 | K |  |  |  |
| PI20 | number-period-start | 1 | L | `↵1984\\. That year began quietly.` |  | Notion stores and shows the backslash |
| PI21 | ampersand-plain | 1 | K |  |  |  |
| PI22 | underscore-alone | 1 | K |  |  |  |
| PI23 | space-runs | 2 | K |  |  |  |
| PJ01 | inline-link | 1 | K |  |  |  |
| PJ02 | bare-url | 1 | C | `↵See [https://example.com/path](https://example.com/path) for more.` | (same as returned) |  |
| PJ03 | angle-autolink | 1 | C | `↵See [https://example.com/path](https://example.com/path) for more.` | (same as returned) |  |
| PJ04 | domain-and-filename | 1 | S | `↵See [example.com](http://example.com) and [notes.md](http://notes.md) for more.` |  | Notion links both (`http://example.com`, `http://notes.md`); the read collapses them |
| PJ05 | link-with-title | 1 | C | `↵See [the site](https://example.com/path) for more.` | (same as returned) |  |
| PJ06 | reference-link | 1 | C | `↵See [the site](https://example.com/path) for more.` | (same as returned) |  |
| PJ07 | image | 1 | K |  |  | an image block |
| PJ08 | email | 1 | C | `↵Write to [someone@example.com](mailto:someone@example.com) today.` | (same as returned) |  |
| PJ09 | relative-links | 1 | C | `↵- [Ada Vale](https://ada-vale.md) — Protagonist↵- [v2](../chapters/chapter-01/ch01-outline.md)` | (same as returned) |  |
| PJ10 | link-underscore-target | 1 | K |  |  |  |
| PJ11 | footnote | 1 | C | `↵A claim.[\[1\]](1)↵↵[\[1\]](1): The footnote text.` | `↵A claim.[[1]](1)↵↵[[1]](1): The footnote text.` |  |
| PK01 | wikilink | 1 | L | `↵See \[\[Some Page\]\] for more.` |  |  |
| PK02 | wikilink-alias | 1 | L | `↵See \[\[Some Page\\|the alias\]\] for more.` |  |  |
| PK03 | wikilink-embed | 1 | L | `↵!\[\[Some Page\]\]` |  |  |
| PK04 | highlight | 1 | L | `↵Some ==highlighted== text.` |  |  |
| PK05 | obsidian-tag | 1 | L | `↵Filed under #draft/first today.` |  |  |
| PK06 | obsidian-comment | 1 | L | `↵Visible %%hidden comment%% visible.` |  |  |
| PK07 | block-id | 1 | L | `↵A paragraph with a block id. \^abc123` |  |  |
| PL01 | inline-code-specials | 1 | K |  |  |  |
| PL02 | inline-code-double-backtick | 1 | C | ``↵Use <code>a`b</code> literally.`` | ```↵Use ``a`b`` literally.``` |  |
| PL03 | fence-bare | 1 | K |  |  |  |
| PL04 | fence-lang | 1 | K |  |  |  |
| PL05 | fence-text | 1 | C | ```` ↵```txt↵text fenced code↵``` ```` | ```` ↵```↵text fenced code↵``` ```` |  |
| PL06 | fence-tilde | 1 | C | ```` ↵```txt↵tilde fenced code↵``` ```` | ```` ↵```↵tilde fenced code↵``` ```` |  |
| PL07 | indented-code | 1 | C | `↵Paragraph before.↵↵indented code block` | (same as returned) |  |
| PL08 | fence-yaml | 1 | K |  |  |  |
| PL09 | fence-markdown-backslash | 1 | K |  |  |  |
| PL10 | fence-four-backticks | 1 | W |  |  | page 1: the fence never closed and swallowed every later section; five isolation writes kept it (§ Isolation tests) |
| PM01 | html-comment-inline | 2 | L | `↵Before \<!-- an inline comment --> after.` |  | stored as visible text (binding: HTML comments) |
| PM02 | html-comment-block | 2 | L | `↵\<!-- a block comment -->` |  | stored as visible text |
| PM03 | html-comment-multiline | 2 | L | `↵\<!--<br />a comment<br />over lines<br />-->` |  | stored as visible text |
| PM04 | html-inline-tags | 2 | C | `↵Some <u>underlined</u> and <b>bold</b> text.` | `↵Some <u>underlined</u> and **bold** text.` |  |
| PM05 | html-mark | 2 | L | `↵Some \<mark>marked\</mark> text.` |  | connector warning: `<mark>` applied as raw text |
| PM06 | html-details | 2 | C | `↵<toggle>↵Summary↵↵Hidden body.↵</toggle>` | (same as returned) | connector warning: `<details>` converted to `<toggle>` |
| PN01 | path-code-span | 2 | K |  |  |  |
| PN02 | path-bare-underscore | 2 | S | `↵See characters/ada\_[vale.md](http://vale.md) for the bio.` |  | Notion links the basename (`ada\_[vale.md](http://vale.md)`); the read collapses it |
| PN03 | filename-bare-underscores | 2 | S | `↵See Jon\_Example\_-\_[Profile.md](http://Profile.md) for the bio.` |  | Notion links the basename |
| PN04 | name-bare-underscores-no-ext | 2 | K |  |  |  |
| PN05 | path-bare-no-underscore | 2 | S | `↵See chapters/chapter-02/[ch02-prose.md](http://ch02-prose.md) for the prose.` |  | Notion links the basename |
| PN06 | path-code-span-no-underscore | 2 | K |  |  |  |
| PO01 | log-entry | 2 | K |  |  |  |
| PO02 | log-entry-blank-fields | 2 | C | `↵<b>Status</b>: resolved (D-012) — the reason in prose.↵↵<b>Why it matters</b>: A sentence.↵↵<b>Possible approaches</b>:↵↵- one approach↵- another approach` | `↵**Status**: resolved (D-012) — the reason in prose.↵↵**Why it matters**: A sentence.↵↵**Possible approaches**:↵↵- one approach↵- another approach` |  |
| PO03 | what-exists-lines | 2 | K |  |  |  |
| PO04 | index-lines | 2 | C | `↵- [Ada Vale](https://ada-vale.md) — Protagonist · POV, bureau↵- [Ben Moss](https://ben-moss.md) — Supporting` | (same as returned) |  |
| PO05 | inline-markers | 2 | K |  |  |  |
| PO06 | proposals-checklist | 2 | K |  |  |  |
| PO07 | pov-label-bold-italic | 2 | K |  |  |  |
| PO08 | pov-label-bold | 2 | K |  |  |  |
| PO09 | pov-label-h4 | 2 | K |  |  |  |
| PO10 | dialogue-prose | 2 | K |  |  |  |
| PO11 | bold-run-in | 2 | K |  |  |  |
| PO12 | outline-index-row | 2 | K |  |  |  |
| PO13 | numbered-next-steps | 2 | K |  |  |  |
| PO14 | heading-bold-number-lead | 2 | K |  |  |  |
| PB13 | heading-trailing-lone-hash | 3 | C | `↵### Issue` | (same as returned) | Notion drops the closing `#`, as CommonMark does |
| PB14 | heading-trailing-hash-number | 3 | K |  |  |  |
| PB15 | hash-no-space-line-start | 3 | K |  |  |  |
| PC31 | italic-around-strike | 3 | C | `↵Some <s><i>italic struck</i></s> text.` | `↵Some ~~*italic struck*~~ text.` |  |
| PC32 | strike-around-italic | 3 | K |  |  |  |
| PC33 | nested-inside-word | 3 | C | `↵Some <b>un</b><i><b>believ</b></i><b>able</b> text.` | `↵Some **un*****believ*****able** text.` |  |
| PC34 | literal-star-no-spaces | 3 | K |  |  |  |
| PD28 | nested-item-lazy-line | 3 | K |  |  |  |
| PD29 | fence-inside-item | 3 | C | ````↵- an item↵  ```txt↵  code inside the item↵  ```↵- next item```` | ````↵- an item↵  ```↵  code inside the item↵  ```↵- next item```` |  |
| PE11 | fence-inside-quote | 3 | C | `↵> <code><br>code inside the quote<br></code>` | `` ↵> `<br>code inside the quote<br>` `` | the fence becomes an inline code span holding `<br>`s |
| PG16 | cell-numeric-pipe-entity | 3 | C | `↵\| Expr \| Meaning \|↵\| --- \| --- \|↵\| a \\| b \| either \|` | `↵\| Expr \| Meaning \|↵\|---\|---\|↵\| a \\| b \| either \|` |  |
| PH07 | rule-four-spaced-stars | 3 | C | `↵Above.↵↵---↵↵Below.` | (same as returned) |  |
| PH08 | rule-spaced-underscores | 3 | C | `↵Above.↵↵---↵↵Below.` | (same as returned) |  |
| PI24 | entity-tag | 3 | C | `↵An \<b>escaped tag\</b> in text.` | `↵An <b>escaped tag</b> in text.` | Notion decodes the entities and the read returns a real `<b>` tag |
| PI25 | entity-numeric-star | 3 | C | `↵An \*escaped star\* pair.` | `↵An *escaped star* pair.` | Notion decodes the entities and the read returns italics |
| PI26 | entity-amp-lt | 3 | C | `↵A doubly escaped \&lt; sign.` | `↵A doubly escaped &lt; sign.` |  |
| PI27 | entity-quot | 3 | C | `↵A "quoted" word.` | (same as returned) |  |
| PI28 | entity-lt-space | 3 | C | `↵If a \< b then.` | `↵If a < b then.` |  |
| PJ12 | bold-around-link | 3 | C | `↵Some <b>see </b>[<b>the note</b>](./x.md)<b> here</b> text.` | `↵Some **see **[**the note**](./x.md)** here** text.` |  |
| PJ13 | bold-link-text | 3 | K |  |  |  |
| PJ14 | italic-around-link | 3 | C | `↵Some [<i>the site</i>](https://example.com) text.` | `↵Some [*the site*](https://example.com) text.` |  |
| PJ15 | anchor-link | 3 | K |  |  |  |
| PJ16 | image-bare-target | 3 | C | `↵<image>↵alt text↵</image>` | (same as returned) | Notion keeps an image block with the alt text and drops the target |
| PJ17 | image-relative-target | 3 | C | `↵<image>↵alt text↵</image>` | (same as returned) | Notion keeps an image block with the alt text and drops the target |
| PL11 | fence-js | 3 | C | ```` ↵```javascript↵const a = 1;↵``` ```` | (same as returned) | Notion renames the language |
| PL12 | fence-json | 3 | K |  |  |  |
| PL13 | fence-sh | 3 | C | ```` ↵```bash↵echo one↵``` ```` | (same as returned) | Notion renames the language |
| PL14 | fence-bash | 3 | K |  |  |  |
| PL15 | fence-python | 3 | C | ```` ↵```py↵a = 1↵``` ```` | (same as returned) | Notion renames the language |
| PL16 | fence-md | 3 | C | ```` ↵```markdown↵# a heading↵``` ```` | (same as returned) | Notion renames the language |
| PL17 | fence-markdown | 3 | K |  |  |  |
| PL18 | fence-html | 3 | K |  |  |  |
| PL19 | fence-css | 3 | K |  |  |  |
| PL20 | fence-diff | 3 | K |  |  |  |
| PL21 | fence-sql | 3 | K |  |  |  |
| PL22 | fence-internal-empty-lines | 3 | K |  |  |  |
| PL23 | fence-tilde-lang | 3 | C | ```` ↵```yaml↵name: Ada Vale↵``` ```` | (same as returned) |  |
| PL24 | code-span-leading-space | 3 | K |  |  |  |
| PL25 | code-span-both-spaces | 3 | C | `↵Use <code>x</code> here.` | ``↵Use `x` here.`` |  |
| PL26 | code-span-all-space | 3 | K |  |  |  |
| PL27 | bold-code-only | 3 | K |  |  |  |
| PL28 | italic-code-only | 3 | K |  |  |  |
| PM07 | html-em | 3 | C | `↵Some <i>emphasised</i> text.` | `↵Some *emphasised* text.` |  |
| PM08 | html-strong | 3 | C | `↵Some <b>strong</b> text.` | `↵Some **strong** text.` |  |
| PM09 | html-del | 3 | L | `↵Some \<del>deleted\</del> text.` |  | connector warning: `<del>` applied as raw text |
| PM10 | html-code | 3 | C | `↵Some <code>coded</code> text.` | ``↵Some `coded` text.`` |  |
| PM11 | html-sup | 3 | L | `↵E = mc\<sup>2\</sup> here.` |  | connector warning: `<sup>` applied as raw text |
| PM12 | html-a-href | 3 | C | `↵See [the site](https://example.com) here.` | (same as returned) |  |
| PM13 | html-img | 3 | C | `↵\<img src="[https://example.com/a.png](https://example.com/a.png)" alt="a">` | `↵<img src="[https://example.com/a.png](https://example.com/a.png)" alt="a">` | connector warning: `<img>` applied as raw text; the URL inside it is autolinked |
| PO15 | questions-entry-as-templated | 3 | C | `↵## Q-014 · critical · Plot↵↵<b>Title</b>: How the loop is found<br /><b>Question</b>: How is the loop found?<br /><b>Possible approaches</b>:↵↵- one approach↵- another approach<br /><b>Dependencies</b>: Q-007<br /><b>Source</b>: plugin` | `↵## Q-014 · critical · Plot↵↵**Title**: How the loop is found↵**Question**: How is the loop found?↵**Possible approaches**:↵↵- one approach↵- another approach↵**Dependencies**: Q-007↵**Source**: plugin` |  |
| PZ99 | end | 2 | K |  |  |  |

## Rewrites

`probe-rewrites.md` holds candidate in-profile forms, each written with the construct’s own words: PR01–PR54 went to Notion as page R, PR55–PR59 on page 3, PR60–PR64 on page 4. Where a rewrite is a form another construct already showed kept (`<em>x</em>` → `*x*`, kept as PC01), the profile cites that construct instead of a new PR. PR54 checks that `./` also works on a target that already holds a `/`.

| ID | Rewrites | Rewrite | Page | Result |
|---|---|---|---|---|
| PR01 | PA02 | blank-after-heading | R | byte-identical |
| PR02 | PA04 | one-blank-between-paragraphs | R | byte-identical |
| PR03 | PA05 | no-trailing-spaces | R | byte-identical |
| PR04 | PA06 | empty-line-not-whitespace | R | byte-identical |
| PR05 | PA07, PO02 | blank-between-label-and-list | R | byte-identical |
| PR06 | PA09 | blank-before-heading | R | byte-identical |
| PR07 | PA11 | no-leading-spaces | R | byte-identical |
| PR08 | PB05 | h5-as-h4 | R | byte-identical |
| PR09 | PB06 | h6-as-h4 | R | byte-identical |
| PR10 | PB07 | no-closing-hashes | R | byte-identical |
| PR11 | PB08 | setext-h1-as-atx | R | byte-identical |
| PR12 | PB09 | setext-h2-as-atx | R | byte-identical |
| PR13 | PC02 | italic-star | R | byte-identical |
| PR14 | PC04 | bold-star | R | byte-identical |
| PR15 | PC07 | italic-inside-bold-split | R | byte-identical |
| PR16 | PC08 | bold-inside-italic-split | R | byte-identical |
| PR17 | PC09 | shared-close-split | R | byte-identical |
| PR18 | PC10 | shared-open-split | R | byte-identical |
| PR19 | PC11, PC12, PC26 | bold-italic-triple-star | R | byte-identical |
| PR20 | PC13 | code-outside-bold | R | byte-identical |
| PR21 | PC14 | code-outside-italic | R | byte-identical |
| PR22 | PC21 | strike-outside-bold | R | byte-identical |
| PR23 | PD02, PD03, PD04 | dash-bullets | R | byte-identical |
| PR24 | PD06 | nested-two-space | R | byte-identical |
| PR25 | PD11, PD14 | ordered-dot-one-space | R | byte-identical |
| PR26 | PD12 | ordered-consecutive | R | byte-identical |
| PR27 | PD15 | tight-bullets | R | byte-identical |
| PR28 | PD16 | item-paragraph-as-lazy-line | R | byte-identical |
| PR29 | PD17 | item-continuation-lazy | R | byte-identical |
| PR30 | PD20 | todo-lowercase-x | R | byte-identical |
| PR31 | PD22 | child-at-content-column | R | byte-identical |
| PR32 | PD26 | no-empty-item | R | byte-identical |
| PR33 | PE04 | quote-marker-every-line | R | byte-identical |
| PR34 | PE10 | quote-marker-space | R | byte-identical |
| PR35 | PF02, PF03, PF04 | bare-newline-break | R | byte-identical |
| PR36 | PG02, PG03, PG10, PG15 | pipe-table-canonical | R | byte-identical |
| PR37 | PG05 | empty-cell-two-spaces | R | byte-identical |
| PR38 | PG08 | cell-emphasis-split | R | byte-identical |
| PR39 | PG12 | html-table-as-pipe | R | byte-identical |
| PR40 | PH02, PH03, PH04, PH06 | rule-three-dashes | R | byte-identical |
| PR41 | PI04 | ordinary-space | R | byte-identical |
| PR42 | PI06 | entities-as-characters | R | byte-identical |
| PR43 | PJ02, PJ03 | url-as-link | R | byte-identical |
| PR44 | PJ05, PJ06 | inline-link-no-title | R | byte-identical |
| PR45 | PJ08 | email-as-mailto-link | R | byte-identical |
| PR46 | PJ09, PO04 | dot-slash-relative-link | R | byte-identical |
| PR47 | PJ11 | footnote-as-bracket-number | R | byte-identical |
| PR48 | PL02 | code-backtick-no-padding | R | byte-identical |
| PR49 | PL05, PL06 | bare-backtick-fence | R | byte-identical |
| PR50 | PL07 | indented-code-as-fence | R | byte-identical |
| PR51 | PM04 | html-bold-as-stars | R | byte-identical |
| PR52 | PM06 | details-as-bold-label | R | byte-identical |
| PR53 | PD08, PD09, PD10 | numbers-as-bold-lead-ins | R | byte-identical |
| PR54 | PJ10 | path-link-with-slash | R | byte-identical |
| PR55 | PO15 | list-set-off-by-empty-lines | 3 | byte-identical |
| PR56 | PJ12 | link-outside-bold | 3 | byte-identical |
| PR57 | PJ13 | bold-outside-link | 3 | changed: `↵Some [**bold link**](./x.md) text.` |
| PR58 | PJ14 | italic-inside-link-text | 3 | byte-identical |
| PR59 | PC33 | nested-inside-word-widened | 3 | byte-identical |
| PR60 | PD29 | child-block-without-empty-line | 4 | byte-identical |
| PR61 | PJ16 | image-bare-target-as-link | 4 | byte-identical |
| PR62 | PJ17 | image-relative-target-as-link | 4 | byte-identical |
| PR63 | PL11 | fence-javascript | 4 | byte-identical |
| PR64 | PL15 | fence-py | 4 | byte-identical |

Not adopted at first, adopted after the ring round: PR41 (a non-breaking space as a plain space; Notion stores U+00A0, but every fetch returns a plain space, so it couldn’t come back: § Ring round). Not adopted: PR53 (continued numbering as bold lead-ins; continued numbering round-trips as a list, PD08–PD10, and the form stays in the file for a re-probe if the serializer reverts), and PR57 (it changed; PR58’s form replaces it).

## Isolation tests

- **PI04, non-breaking space.** The fetch text can’t show U+00A0 by eye. An `update_content` on page 2 with an anchor containing U+00A0 matched with no warning; a second edit whose anchor had a plain space in the same place matched only after the connector reported “Content was automatically corrected in 1 place(s) to match the page”. So Notion now **stores** the U+00A0 (SB5 recorded nbsp becoming a plain space). Whether the fetch returns it can’t be confirmed here, so the profile keeps ordinary spaces only.
- **PL10, four-backtick fence.** On page 1 (`replace_content`, about 14 KB) the closing ```` ```` ```` was taken as content, the fence came back as five backticks with `txt`, and every later section became its body. Isolated, the same fence came back intact under `plain text`, `markdown` and `txt` info strings (pages A, B, C by create); under `plain text` through `replace_content` (page A); after the whole code group PL01–PL10 (page B); after a subset of PA–PF (page A); and after a subset of PG–PK (page C). The trigger was not found.
- **The connector itself.** Both `allow_async: true` creates failed with 503 “Async Public API operation could not be queued”; the synchronous retries succeeded. The write warned on `<tag>` and `<mark>` (applied as raw text) and converted `<details>` to `<toggle>`.

## Where today contradicts SB5

The SB5 Known limit list (`references/store/notion.md`, observed 2026-10-17 under the earlier serializer) saw these change; today they round-trip: `***` closes (when the span is whole), ordered lists continued past a heading (`8.` → `1.`), `~~**x**~~` (became `**~~x~~**`), `_` inside words (became `*`), non-breaking spaces (stored now; see PI04). The second round agrees: a nested item’s lazy line (PD28) and a bare `#` word at a line start (PB15) are kept. A serializer that changed once in a week can change again, so re-run this probe before release and whenever a round trip shows new drift.

## Mini round trip (2026-10-24, afternoon)

A live local → Notion → local round trip of a 29-document project (`sb6-mini`) found two failures that the 243-construct probe couldn’t show; both were probed again on `sb6-probe`.

- **b1, leading whitespace in property text.** Notion strips the whitespace at the start of every line of a multi-line rich-text property, on write: the round trip’s `primer.md` frontmatter came back with its `source:` continuation lines unindented, invalid YAML, while an Assets row written 2026-10-17 still holds its indented `Meta`. Probe row `sb6-meta-probe` (`403e980b-9c74-81a9-a101-d0546bba464e`, created synchronously) holds a `Meta` with a one-line key with a quoted value, a `|` block scalar with a nested indent, an empty line and `C:\Users "dock"` in it, a `>-` block scalar, a plain scalar continued onto an indented line, a block list of wikilinks, `_lines`, `_keys`, `_as_written` and `_derived` in flow style, a `_layout` with a blank first line, a bold field label and an indented sub-item, and last, in the old form, a block scalar `old_block: |` with two indented lines. Sent with every `\` doubled (the binding’s property write form); a fetch and a rows query both returned it with each newline as `<br />`, `\_`, `\[`, `\{`, `\|` escapes and `<b>Note</b>`. The read rendering (backslash rule, `<br />` as a newline, inline tags) returned every line of the new form byte-identical, `\n`, `\"` and `\\` escapes inside the double-quoted strings included, while `old_block`’s two lines came back with their indentation gone (`indented old form`, `deeper`). That is the basis of the storage form `references/store/notion.md` § Frontmatter ↔ properties prescribes (no stored line starts with whitespace), refined after review by probe 5 below: `Meta` is sent with every punctuation character escaped, and the `_` keys as JSON. The rows query also showed rows mode leaving an empty relation (`Book`) out of a row entirely.
- **b2, a bold run split at Notion’s own escapes.** The round trip’s `elfie_character_profile.md` (a 2,900-word child page, created synchronously) returned `**Morning Routine (6:00-9:00 AM):**` as `<b>Morning Routine (6</b><b>\:00-9\:</b><b>00 AM):</b>`, three adjacent bold runs, while the same page’s `**Midday (9:00 AM-3:00 PM):**` came back as one run. Written alone, the line came back as one run, `<b>Morning Routine (6\:00-9\:00 AM):</b>`, by `replace_content` on `sb6-meta-probe` and by create on `sb6-split-probe` (`403e980b-9c74-81b1-8be9-fc61085bf329`), with italic, strikethrough and bold-italic variants alike; the trigger was not found. The read now merges immediately adjacent identical runs (E1), which renders the split line as written. In profile-form text two emphasis spans never touch, so the merge only ever undoes a split. Re-checked against this probe’s verdicts, it changes four: PC08, PC10, PC13 and PC14 now read back as written (their rows above say so), and no K verdict changes. The profile keeps its rewrites for them (§ Rewrite table, the nested-emphasis and code-span rows), one form per family.

- **Probe 5, after review** (row `sb6-probe-5`, `403e980b-9c74-81ca-b141-f48955b0a58c`):
  - **Property text as markdown.** The same `Meta` text was sent twice, as `Change Note` with only `\` doubled and as `Meta` with every ASCII punctuation character escaped: one line holding `_x_`, `__y__`, `*z*`, `**w**`, a code span, `a.md`, `[l](https://a.example)`, `~~s~~` and `<u>u</u>`; an empty line; a margin block list and a `|+` scalar with two trailing line breaks as `_lines` strings; `_lines` and `_keys` as JSON (`"no"`, `"2026-10-24"` among the keys). Unescaped, the markup came back as `<i>`, `<b>`, `<code>` and `<s>` runs, so `_x_` and `__y__` would read as `*x*` and `**y**`. Escaped, nothing was formatted; Notion still autolinked `a.md` and the URL inside the escaped link (`\[l\]([https://a.example](https://a.example))`), and the empty line came back as `<br /><br />`. With the backslash rule, `<br />` as a newline and every unescaped link collapsed to its text, the escaped `Meta` read back byte-identical, trailing `\n\n` included.
  - **Filenames with `&amp;` and `&`, in a body.** Sent with only `\` doubled, `The_Good_Dog_-_Brainstorming_&amp;_Future_Plot_Points.md` came back as `The\_Good\_Dog\_-<i>Brainstorming</i>&<i>Future\_Plot\_</i>[<i>Points.md</i>](http://Points.md)<i> and Tom</i>…`: Notion’s parser read the underscores as emphasis, one run reaching past the filename, and decoded the entity. Sent with every `_` as `\_`, it came back as `The\_Good\_Dog\_-\_Brainstorming\_&\_Future\_Plot\_[Points.md](http://Points.md)`, which reads as the name with `&`. `Tom&amp;Jerry.md` came back decoded, `Tom&[Jerry.md](http://Jerry.md)`; `Tom&Jerry.md`, `Q&A.md` and `R&D_notes.md` were autolinked from the `&` or `_` on, never percent-encoded, and read back as written; `Miles\_Corwin\_-\_Character\_Profile\_(Investigative\_Journalist).md` came back unlinked and as written; `` `Tom_&amp;_Jerry.md` `` in a code span kept its `&amp;`.

- **Probe 6, the mini2 failure re-sent** (row `sb6-probe-6`, `403e980b-9c74-81a9-86ef-d2001f6a70cd`): the second round trip (`sb6-mini2`, written before the underscore escape) failed only at `intake-original-names.md`, where its fetch showed `The\_Good\_Dog\_-<i>Brainstorming</i>&\_Future…` and `Miles\_Corwin\_-<i>Character\_Profile</i>(…)`. That document’s normalized form under the current profile (its `&amp;` filename decoded) was sent in today’s write form, every `_` as `\_`, by a create, which dropped its `# Intake — Original Filename Mapping` H1; an `insert_content` of that one line at `start` put it back. The fetch, read with the binding’s rules, matched the normalized form byte for byte: all 29 filename rows, the code-span `&amp;`, the `<b><code>…</code></b>` list items and the H1.

**Cost:** 16 Notion calls, all synchronous: 4 creates, 2 `replace_content`, 1 `insert_content`, 7 fetches (one a read-only fetch of the `sb6-mini` child page) and 2 rows queries.

## Ring round (2026-10-24, evening)

The 148-file ring (local → Notion → Dropbox → local, slug `sb6-ring`) changed seven files end to end. Each fix was probed on `sb6-probe` with the exact lines from the ring’s normalized tree (`ring/norm/`), in today’s write form (every `\` doubled, every `_` as `\_`), and read back with the binding’s rules, adjacent runs merged.

- **Probe 7** (row `sb6-probe-7`, `403e980b-9c74-81d0-9576-d84014c84fab`, one create, one fetch):
  - **`voice/style-guide.md:653`**, `~~*“Do you want a ***TREAT***?”* …~~`: came back as `<s><i>“Do you want a </i></s><s><i><b>TREAT</b></i></s><s><i>?”</i></s><s> …</s>`, which merges to `~~*“Do you want a **TREAT**?”* …~~`. **Trigger:** italic inside italic (CommonMark reads `***TREAT***` inside the italic span as a second italic); Notion stores italic once per character. The rewritten line, `**TREAT**`, came back as written.
  - **`ch01-blueprint.md:284`**, `*no mistakes*` lost its italics. **Trigger:** the same. The unspaced stars in `(*“…just* DIG*.”*)` pair, as CommonMark pairs them, from the `*` after `.”` to the `*` before `“…the Boss`, so `*no mistakes*` is an italic inside that italic. The line with `*no mistakes*`’s delimiters removed came back as written, the two unpaired stars (`DIG*.”`, `tonight.*`) included (`\*` escaped by Notion).
  - **Nesting order:** `~~a **b** c~~`, `~~a *b* c~~`, `~~*a **b** c*~~` and `~~a `x` b~~` came back as written (split runs, merged by the read); `**a *b* c**`, `***a* b**` and `**GOOD DOG means *this is over*.**` didn’t (`<b>…</b><i><b>…</b></i><b>…</b>`, no merge). `**GOOD DOG means** ***this is over.***` (the punctuation moved into the inner span) came back as written. So Notion nests `<s>` ⊃ `<i>` ⊃ `<b>` ⊃ `<code>`, and nesting in that order survives.
  - **`notes/methodology/craft-document.md:241`**: the source line, `*~~“Do you want a~~*~~ ***TREAT***\*?”\* …~~`, came back as the italic-around-strikethrough row’s result, `~~*“Do you want a*~~~~ ***TREAT***\*?”\* …~~`, and that result came back as written: the stray `~~` runs are stored as text (`\~\~`).
  - **A non-breaking space:** `A B and C D.` with U+00A0 came back with plain spaces in the fetch, as the ring found (36 lost in `notes/methodology/legacy-bio-prompt-template.md` and `chapters/chapter-01/kitbash/ch01-draft-sonnet.md` on the way out of Notion). Notion stores U+00A0 (PI04’s anchor test) but no read returns it, so the profile now rewrites it to a plain space (PR41).
- **Probe 8, `pipeline/lint/fixtures/sample.md`** (child page `403e980b-9c74-8195-b388-df2be67d71f7` under the `sb6-probe` row, one create, one fetch): its normalized form with exactly one empty line after the frontmatter (the new rewrite row), sent as a `yaml` fence then the body, read back byte-identical as `---`, the lines, `---`, one empty line, the body. The source had none and came back with one; `voice/style-guide.md` had one and lost it in the leg-2 rendering, which the read rule now fixes.
- **Probe 9, `act: 1`** (Chapters row `ch99-outline`, `403e980b-9c74-81d3-b180-f4de9b530358`, one create, one rows query): `Act` = `1` with `Meta` `_as_written: {"act": {"stored": "1", "value": "1"}}` (literal text) came back as `"Act": "1"` and the entry intact, so the read renders `act: 1` as the source wrote it, where the default (text that reads as a number, quoted) gives `act: "1"`.

**Cost:** 6 Notion calls, all synchronous: 3 creates, 2 fetches and 1 rows query (plus one fetch of a mistyped id, which failed).

## Cost

**Round one:** 30 Notion calls: 7 creates (2 of them the async failures), 5 `replace_content`, 2 `update_content`, 13 fetches (one of them the connector’s markdown spec, one a read-only fetch of an SB5-era page to confirm the serializer change), 2 searches and 1 rows query. They ran from 07:35 to 07:54 Pacific, 19 minutes of wall time including transcription.

**Round two:** 5 Notion calls: 2 creates and 3 fetches (one failed: it was sent a page name instead of an id). They ran from 08:14 to 08:18 Pacific.
