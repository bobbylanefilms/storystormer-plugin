# Markdown Profile Probe

Synthetic test content for the SB6 markdown-profile probe. No story text. Each section below holds one construct, under a heading of the form `## P<group><nn> <name>`, so a round trip can be compared section by section.

## PA01 heading-blank-paragraph

A heading, one blank line, then this paragraph.

## PA02 heading-no-blank-paragraph
This paragraph sits directly under its heading with no blank line.

## PA03 two-paragraphs-one-blank

First paragraph.

Second paragraph.

## PA04 two-paragraphs-two-blanks

First paragraph.


Second paragraph after two blank lines.

## PA05 trailing-spaces

This line ends with three spaces.   

## PA06 whitespace-only-line

Paragraph one.
  
Paragraph two after a whitespace-only line.

## PA07 label-line-then-list-no-blank

**Label line:**
- first item
- second item

## PA08 label-line-blank-then-list

**Label line:**

- first item
- second item

## PA09 paragraph-then-heading-no-blank

A paragraph with a heading right under it.
### Sub heading under a paragraph

## PA10 tab-inside-paragraph

Before the tab	after the tab.

## PA11 leading-spaces-paragraph

  This paragraph starts with two spaces.

## PB01 h1-mid-document

# Level one heading

## PB02 h2

## Level two heading

## PB03 h3

### Level three heading

## PB04 h4

#### Level four heading

## PB05 h5

##### Level five heading

## PB06 h6

###### Level six heading

## PB07 closing-hashes

### Closed heading ###

## PB08 setext-h1

Setext level one
================

## PB09 setext-h2

Setext level two
----------------

## PB10 heading-italic-code

### The *quiet* `room` heading

## PB11 heading-bold

### **Ada Vale (Major)**

## PB12 heading-number-lead

### 3. Third step

## PC01 italic-star

Some *italic* text.

## PC02 italic-underscore

Some _italic_ text.

## PC03 bold-star

Some **bold** text.

## PC04 bold-underscore

Some __bold__ text.

## PC05 strike

Some ~~struck~~ text.

## PC06 bold-italic-triple

Some ***bold italic*** text.

## PC07 italic-inside-bold

Some **bold with *italic* inside** text.

## PC08 bold-inside-italic

Some *italic with **bold** inside* text.

## PC09 shared-close-boundary

Some **bold ending in *italic*** text.

## PC10 shared-open-boundary

Some ***bold first** then italic* text.

## PC11 bold-around-underscore-italic

Some **_mixed_** text.

## PC12 italic-around-underscore-bold

Some *__mixed__* text.

## PC13 bold-around-code

Some **bold with `code` inside** text.

## PC14 italic-around-code

Some *italic with `code` inside* text.

## PC15 bold-space-code

Some **bold** `code` text.

## PC16 bold-touching-code

Some **bold**`code` text.

## PC17 code-alone

Some `code` text.

## PC18 intraword-star

Un*believ*able.

## PC19 intraword-underscore

A snake_case_name in prose.

## PC20 strike-around-bold

Some ~~**struck bold**~~ text.

## PC21 bold-around-strike

Some **~~bold struck~~** text.

## PC22 single-tilde

Some ~single~ tilde.

## PC23 italic-across-line-break

Some *italic that
continues* on the next line.

## PC24 spaced-stars-literal

Some ** not bold ** text.

## PC25 literal-stars

Five * three * two.

## PC26 bold-italic-underscore-triple

Some ___bold italic___ text.

## PC27 bold-touching-word

Some **bold**ly placed text.

## PC28 bold-italic-before-punctuation

The ***word***, then more.

## PC29 italic-whole-paragraph

*An entire paragraph in italics, as a thought might be.*

## PC30 bold-whole-paragraph

**An entire paragraph in bold.**

## PD01 dash-bullets

- alpha
- beta
- gamma

## PD02 star-bullets

* alpha
* beta

## PD03 plus-bullets

+ alpha
+ beta

## PD04 padded-bullets

-   alpha
-   beta

## PD05 nested-two-space

- level one
  - level two
    - level three
  - back to two
- back to one

## PD06 nested-four-space

- level one
    - level two
        - level three

## PD07 ordered

1. one
2. two
3. three

## PD08 ordered-start-three

3. three
4. four
5. five

## PD09 ordered-continued-after-heading

1. one
2. two

### Interrupting heading

3. three
4. four

## PD10 ordered-continued-after-paragraph

1. one
2. two

An interrupting paragraph.

3. three
4. four

## PD11 ordered-paren

1) one
2) two

## PD12 ordered-all-ones

1. one
1. two
1. three

## PD13 ordered-ten

1. a
2. b
3. c
4. d
5. e
6. f
7. g
8. h
9. i
10. j

## PD14 ordered-padded

1.  one
2.  two

## PD15 loose-bullets

- alpha

- beta

- gamma

## PD16 item-continuation-paragraph

- an item

  with a second paragraph inside it
- next item

## PD17 item-soft-break-indented

- an item that
  wraps onto an indented line
- next item

## PD18 item-soft-break-lazy

- an item that
wraps onto a lazy line
- next item

## PD19 todos

- [ ] open task
- [x] done task

## PD20 todo-capital-x

- [X] done task with capital X

## PD21 ordered-in-bullet

- bullet
  1. ordered child
  2. ordered child

## PD22 bullet-in-ordered-two-space

1. ordered
  - bullet child two spaces
2. ordered

## PD23 bullet-in-ordered-three-space

1. ordered
   - bullet child three spaces
2. ordered

## PD24 nested-todos

- [ ] parent task
  - [x] child task

## PD25 bold-label-items

- **Label one:** text after the label
- **Label two:** more text

## PD26 empty-item

- alpha
-
- gamma

## PD27 bullet-in-ordered-ten

9. ninth
10. tenth
    - child four spaces under a two-digit marker

## PE01 quote-single-line

> A single-line quote.

## PE02 quote-two-lines

> First line of the quote.
> Second line of the quote.

## PE03 quote-two-paragraphs

> First paragraph of the quote.
>
> Second paragraph of the quote.

## PE04 quote-lazy-continuation

> First line of the quote.
Lazy second line.

## PE05 quote-with-list

> Lead line.
> - quoted item one
> - quoted item two

## PE06 quote-nested

> Outer quote.
>
> > Inner quote.

## PE07 quote-emphasis-code

> A quote with *italic*, **bold** and `code`.

## PE08 two-quotes

> First quote.

> Second quote.

## PE09 obsidian-callout

> [!note] Callout title
> Callout body.

## PE10 quote-no-space

>No space after the marker.

## PF01 bare-newline-break

Line one
line two
line three

## PF02 two-space-break

Line one  
line two

## PF03 backslash-break

Line one\
line two

## PF04 html-br

Line one<br>line two

## PG01 pipe-table-canonical

| Name | Role |
|---|---|
| Ada | lead |
| Ben | foil |

## PG02 pipe-table-spaced-separator

| Name | Role |
| --- | --- |
| Ada | lead |

## PG03 pipe-table-alignment

| Left | Right |
|:---|---:|
| a | b |

## PG04 pipe-table-empty-cell-spaced

| Name | Note |
|---|---|
| Ada |  |

## PG05 pipe-table-empty-cell-tight

| Name | Note |
|---|---|
| Ada ||

## PG06 pipe-table-escaped-pipe

| Expr | Meaning |
|---|---|
| a \| b | either |

## PG07 pipe-table-emphasis

| Style | Sample |
|---|---|
| italic | *word* |
| bold | **word** |
| strike | ~~word~~ |

## PG08 pipe-table-nested-emphasis

| Style | Sample |
|---|---|
| nested | **bold *inner* bold** |
| triple | ***both*** |

## PG09 pipe-table-code

| Path | Note |
|---|---|
| `characters/ada_vale.md` | a bio |

## PG10 pipe-table-no-outer-pipes

Name | Role
---|---
Ada | lead

## PG11 pipe-table-br

| Name | Lines |
|---|---|
| Ada | one<br>two |

## PG12 html-table

<table>
<tr><th>Name</th><th>Role</th></tr>
<tr><td>Ada</td><td>lead</td></tr>
</table>

## PG13 pipe-table-one-column

| Only |
|---|
| a |

## PG14 pipe-table-link-quotes

| Link | Quote |
|---|---|
| [site](https://example.com/page) | “quoted” |

## PG15 pipe-table-wide-separator

| Name | Role |
|-----|------|
| Ada | lead |

## PH01 rule-three-dashes

Above.

---

Below.

## PH02 rule-six-dashes

Above.

------

Below.

## PH03 rule-stars

Above.

***

Below.

## PH04 rule-underscores

Above.

___

Below.

## PH05 scene-break

Above.

* * *

Below.

## PH06 rule-spaced-dashes

Above.

- - -

Below.

## PI01 curly-quotes

‘Single’ and “double” curly quotes, and an apostrophe’s place.

## PI02 dashes-ellipsis

An en dash – an em dash—and an ellipsis… here.

## PI03 straight-quotes-dots

'Single' and "double" straight quotes, and three dots...

## PI04 nbsp

Two words joined by a non-breaking space.

## PI05 non-ascii

Café, naïve, 東京, and an emoji 🙂.

## PI06 entity-text

Ampersand &amp; entity, &mdash; and &nbsp; written as entities.

## PI07 angle-brackets

If a < b and b > c, then x<y.

## PI08 tag-like-text

A literal <tag> in prose.

## PI09 colons-backslashes

At 6:00, see C:\Users\ada and \[bracketed\] and \*not italic\*.

## PI10 markers

Text with [OPEN: Q-001] and [NEEDS DEVELOPMENT: the harbor] markers.

## PI11 dollars

It cost $5 and then $10.

## PI12 emoji-shortcode

A shortcode :smile: in text.

## PI13 hashes

Item #1 and a #hashtag mid-text.

## PI14 at-name

Ping @ada about it.

## PI15 symbols

Asterism ⁂, section §, pilcrow ¶, arrow →, middle dot ·.

## PI16 tildes

About ~500w and ~600w each.

## PI17 caret

The value x^2 grows.

## PI18 double-hyphen-arrow

Then -- and -> appear.

## PI19 log-header-line

D-012 · 2026-10-24 · plot

## PI20 number-period-start

1984\. That year began quietly.

## PI21 ampersand-plain

Salt & pepper.

## PI22 underscore-alone

A lone _ underscore and a __ pair.

## PI23 space-runs

Two  spaces and three   spaces between words.

## PJ01 inline-link

See [the site](https://example.com/path) for more.

## PJ02 bare-url

See https://example.com/path for more.

## PJ03 angle-autolink

See <https://example.com/path> for more.

## PJ04 domain-and-filename

See example.com and notes.md for more.

## PJ05 link-with-title

See [the site](https://example.com/path "Title") for more.

## PJ06 reference-link

See [the site][ref] for more.

[ref]: https://example.com/path

## PJ07 image

![alt text](https://example.com/image.png)

## PJ08 email

Write to someone@example.com today.

## PJ09 relative-links

- [Ada Vale](ada-vale.md) — Protagonist
- [v2](../chapters/chapter-01/ch01-outline.md)

## PJ10 link-underscore-target

See [the note](notes/a_b_c.md) here.

## PJ11 footnote

A claim.[^1]

[^1]: The footnote text.

## PK01 wikilink

See [[Some Page]] for more.

## PK02 wikilink-alias

See [[Some Page|the alias]] for more.

## PK03 wikilink-embed

![[Some Page]]

## PK04 highlight

Some ==highlighted== text.

## PK05 obsidian-tag

Filed under #draft/first today.

## PK06 obsidian-comment

Visible %%hidden comment%% visible.

## PK07 block-id

A paragraph with a block id. ^abc123

## PL01 inline-code-specials

Use `a\b*c*_d_` literally.

## PL02 inline-code-double-backtick

Use `` a`b `` literally.

## PL03 fence-bare

```
plain fenced code
  with indentation
```

## PL04 fence-lang

```ts
const x: number = 1;
```

## PL05 fence-text

```text
text fenced code
```

## PL06 fence-tilde

~~~
tilde fenced code
~~~

## PL07 indented-code

Paragraph before.

    indented code block

## PL08 fence-yaml

```yaml
name: Ada Vale
tags: [lead, "sector: 7"]
```

## PL09 fence-markdown-backslash

```
**not bold** and C:\path\file and \* star
```

## PL10 fence-four-backticks

````
```
inner fence
```
````

## PM01 html-comment-inline

Before <!-- an inline comment --> after.

## PM02 html-comment-block

<!-- a block comment -->

## PM03 html-comment-multiline

<!--
a comment
over lines
-->

## PM04 html-inline-tags

Some <u>underlined</u> and <b>bold</b> text.

## PM05 html-mark

Some <mark>marked</mark> text.

## PM06 html-details

<details>
<summary>Summary</summary>
Hidden body.
</details>

## PN01 path-code-span

See `characters/ada_vale.md` for the bio.

## PN02 path-bare-underscore

See characters/ada_vale.md for the bio.

## PN03 filename-bare-underscores

See Jon_Example_-_Profile.md for the bio.

## PN04 name-bare-underscores-no-ext

See ada_vale_profile for the bio.

## PN05 path-bare-no-underscore

See chapters/chapter-02/ch02-prose.md for the prose.

## PN06 path-code-span-no-underscore

See `chapters/chapter-02/ch02-prose.md` for the prose.

## PO01 log-entry

## D-012 · 2026-10-24 · plot

**Scope**: book-one
**Topic**: The harbor
**Summary**: A short summary.
**Integrated into treatment**: no

## PO02 log-entry-blank-fields

**Status**: resolved (D-012) — the reason in prose.

**Why it matters**: A sentence.

**Possible approaches**:
- one approach
- another approach

## PO03 what-exists-lines

- **Treatment** — v3 (2026-10-24), ~1,200w
- **Character bios** — Ada Vale (Protagonist, ~1,450w), Ben Moss (Supporting, ~700w)

## PO04 index-lines

- [Ada Vale](ada-vale.md) — Protagonist · POV, bureau
- [Ben Moss](ben-moss.md) — Supporting

## PO05 inline-markers

Ada waits at the dock [OPEN: Q-003] while the tide turns.

## PO06 proposals-checklist

## Proposals

- [ ] Promote Ben Moss to supporting.
- [x] Add the harbor to worldbuilding.

## PO07 pov-label-bold-italic

***Ada’s POV***

## PO08 pov-label-bold

**Ada’s POV**

## PO09 pov-label-h4

#### Ada’s POV

## PO10 dialogue-prose

“You came back,” she said. *Of course I did.* He set the cup down—slowly—and waited.

## PO11 bold-run-in

**Why it works.** The run-in label leads the paragraph.

## PO12 outline-index-row

| # | Title | Outline | Prose |
|---|---|---|---|
| 1 | The Dock | [v2](../chapters/chapter-01/ch01-outline.md) | — |

## PO13 numbered-next-steps

1. **Draft the treatment** — from the primer.
2. **Outline Act 1** — chapters 1 to 8.

## PO14 heading-bold-number-lead

**3.** Third step, as a bold number lead-in.

## PB13 heading-trailing-lone-hash

### Issue #

## PB14 heading-trailing-hash-number

### Issue #12

## PB15 hash-no-space-line-start

#heading with no space after the hash.

## PC31 italic-around-strike

Some *~~italic struck~~* text.

## PC32 strike-around-italic

Some ~~*struck italic*~~ text.

## PC33 nested-inside-word

Some **un*believ*able** text.

## PC34 literal-star-no-spaces

Five*three is fifteen.

## PD28 nested-item-lazy-line

- level one
  - level two that
wraps onto a lazy line
- back to one

## PD29 fence-inside-item

- an item

  ```
  code inside the item
  ```
- next item

## PE11 fence-inside-quote

> ```
> code inside the quote
> ```

## PG16 cell-numeric-pipe-entity

| Expr | Meaning |
|---|---|
| a &#124; b | either |

## PH07 rule-four-spaced-stars

Above.

* * * *

Below.

## PH08 rule-spaced-underscores

Above.

_ _ _

Below.

## PI24 entity-tag

An &lt;b&gt;escaped tag&lt;/b&gt; in text.

## PI25 entity-numeric-star

An &#42;escaped star&#42; pair.

## PI26 entity-amp-lt

A doubly escaped &amp;lt; sign.

## PI27 entity-quot

A &quot;quoted&quot; word.

## PI28 entity-lt-space

If a &lt; b then.

## PJ12 bold-around-link

Some **see [the note](./x.md) here** text.

## PJ13 bold-link-text

Some [**bold link**](./x.md) text.

## PJ14 italic-around-link

Some *[the site](https://example.com)* text.

## PJ15 anchor-link

See [the section](#the-section) above.

## PJ16 image-bare-target

![alt text](image.png)

## PJ17 image-relative-target

![alt text](./img/a.png)

## PL11 fence-js

```js
const a = 1;
```

## PL12 fence-json

```json
{"a": 1}
```

## PL13 fence-sh

```sh
echo one
```

## PL14 fence-bash

```bash
echo one
```

## PL15 fence-python

```python
a = 1
```

## PL16 fence-md

```md
# a heading
```

## PL17 fence-markdown

```markdown
# a heading
```

## PL18 fence-html

```html
<p>a</p>
```

## PL19 fence-css

```css
a { color: red; }
```

## PL20 fence-diff

```diff
- old
+ new
```

## PL21 fence-sql

```sql
SELECT 1;
```

## PL22 fence-internal-empty-lines

```
first line

third line after an empty line
```

## PL23 fence-tilde-lang

~~~yaml
name: Ada Vale
~~~

## PL24 code-span-leading-space

Use ` x` here.

## PL25 code-span-both-spaces

Use ` x ` here.

## PL26 code-span-all-space

Use ` ` here.

## PL27 bold-code-only

Use **`x`** here.

## PL28 italic-code-only

Use *`x`* here.

## PM07 html-em

Some <em>emphasised</em> text.

## PM08 html-strong

Some <strong>strong</strong> text.

## PM09 html-del

Some <del>deleted</del> text.

## PM10 html-code

Some <code>coded</code> text.

## PM11 html-sup

E = mc<sup>2</sup> here.

## PM12 html-a-href

See <a href="https://example.com">the site</a> here.

## PM13 html-img

<img src="https://example.com/a.png" alt="a">

## PO15 questions-entry-as-templated

## Q-014 · critical · Plot

**Title**: How the loop is found
**Question**: How is the loop found?
**Possible approaches**:
  - one approach
  - another approach
**Dependencies**: Q-007
**Source**: plugin

## PZ99 end

Last paragraph of the probe.
