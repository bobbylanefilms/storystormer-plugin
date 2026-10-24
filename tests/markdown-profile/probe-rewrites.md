Candidate rewrites for the SB6 markdown-profile probe. Each section is the in-profile form of one or more constructs that `probe.md` showed changing in Notion, under a heading of the form `## PR<nn> <construct ids> <name>`. The words are the construct’s own; only the markup differs.

## PR01 PA02 blank-after-heading

This paragraph sits directly under its heading with no blank line.

## PR02 PA04 one-blank-between-paragraphs

First paragraph.

Second paragraph after two blank lines.

## PR03 PA05 no-trailing-spaces

This line ends with three spaces.

## PR04 PA06 empty-line-not-whitespace

Paragraph one.

Paragraph two after a whitespace-only line.

## PR05 PA07+PO02 blank-between-label-and-list

**Label line:**

- first item
- second item

## PR06 PA09 blank-before-heading

A paragraph with a heading right under it.

### Sub heading under a paragraph

## PR07 PA11 no-leading-spaces

This paragraph starts with two spaces.

## PR08 PB05 h5-as-h4

#### Level five heading

## PR09 PB06 h6-as-h4

#### Level six heading

## PR10 PB07 no-closing-hashes

### Closed heading

## PR11 PB08 setext-h1-as-atx

# Setext level one

## PR12 PB09 setext-h2-as-atx

## Setext level two

## PR13 PC02 italic-star

Some *italic* text.

## PR14 PC04 bold-star

Some **bold** text.

## PR15 PC07 italic-inside-bold-split

Some **bold with** ***italic*** **inside** text.

## PR16 PC08 bold-inside-italic-split

Some *italic with* ***bold*** *inside* text.

## PR17 PC09 shared-close-split

Some **bold ending in** ***italic*** text.

## PR18 PC10 shared-open-split

Some ***bold first*** *then italic* text.

## PR19 PC11+PC12+PC26 bold-italic-triple-star

Some ***mixed*** text.

## PR20 PC13 code-outside-bold

Some **bold with** `code` **inside** text.

## PR21 PC14 code-outside-italic

Some *italic with* `code` *inside* text.

## PR22 PC21 strike-outside-bold

Some ~~**bold struck**~~ text.

## PR23 PD02+PD03+PD04 dash-bullets

- alpha
- beta

## PR24 PD06 nested-two-space

- level one
  - level two
    - level three

## PR25 PD11+PD14 ordered-dot-one-space

1. one
2. two

## PR26 PD12 ordered-consecutive

1. one
2. two
3. three

## PR27 PD15 tight-bullets

- alpha
- beta
- gamma

## PR28 PD16 item-paragraph-as-lazy-line

- an item
with a second paragraph inside it
- next item

## PR29 PD17 item-continuation-lazy

- an item that
wraps onto an indented line
- next item

## PR30 PD20 todo-lowercase-x

- [x] done task with capital X

## PR31 PD22 child-at-content-column

1. ordered
   - bullet child two spaces
2. ordered

## PR32 PD26 no-empty-item

- alpha
- gamma

## PR33 PE04 quote-marker-every-line

> First line of the quote.
> Lazy second line.

## PR34 PE10 quote-marker-space

> No space after the marker.

## PR35 PF02+PF03+PF04 bare-newline-break

Line one
line two

## PR36 PG02+PG03+PG10+PG15 pipe-table-canonical

| Name | Role |
|---|---|
| Ada | lead |

## PR37 PG05 empty-cell-two-spaces

| Name | Note |
|---|---|
| Ada |  |

## PR38 PG08 cell-emphasis-split

| Style | Sample |
|---|---|
| nested | **bold** ***inner*** **bold** |

## PR39 PG12 html-table-as-pipe

| Name | Role |
|---|---|
| Ada | lead |

## PR40 PH02+PH03+PH04+PH06 rule-three-dashes

Above.

---

Below.

## PR41 PI04 ordinary-space

Two words joined by a non-breaking space.

## PR42 PI06 entities-as-characters

Ampersand & entity, — and   written as entities.

## PR43 PJ02+PJ03 url-as-link

See [https://example.com/path](https://example.com/path) for more.

## PR44 PJ05+PJ06 inline-link-no-title

See [the site](https://example.com/path) for more.

## PR45 PJ08 email-as-mailto-link

Write to [someone@example.com](mailto:someone@example.com) today.

## PR46 PJ09+PO04 dot-slash-relative-link

- [Ada Vale](./ada-vale.md) — Protagonist · POV, bureau
- [Ben Moss](./ben-moss.md) — Supporting

## PR47 PJ11 footnote-as-bracket-number

A claim.[1]

[1] The footnote text.

## PR48 PL02 code-backtick-no-padding

Use ``a`b`` literally.

## PR49 PL05+PL06 bare-backtick-fence

```
text fenced code
```

## PR50 PL07 indented-code-as-fence

Paragraph before.

```
indented code block
```

## PR51 PM04 html-bold-as-stars

Some <u>underlined</u> and **bold** text.

## PR52 PM06 details-as-bold-label

**Summary**

Hidden body.

## PR53 PD08+PD09+PD10 numbers-as-bold-lead-ins

1. one
2. two

### Interrupting heading

**3.** three

**4.** four

## PR54 PJ10 path-link-with-slash

See [the note](./notes/a_b_c.md) here.
