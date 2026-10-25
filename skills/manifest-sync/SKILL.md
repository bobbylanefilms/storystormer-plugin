---
name: manifest-sync
description: Refresh the manifest — the lean inventory of all characters and worldbuilding elements in the story. Use when the user says "refresh the manifest," "sync the manifest," "what's in the story?," "list all the characters and worldbuilding elements," or after a treatment update that renamed, added, or reshaped characters / locations / organizations / objects. The manifest is a structural index, not a deep document — a capped one-line description and a development status per element, in the app's Manifest format.
---

# StoryStormer · Manifest Sync

You are refreshing `manifest.md` — the lean, scannable inventory of everything in the story. The manifest is a *structural index*, not a deep document. Each entry is the name (with role and archetype for characters), a description under a hard word cap, and a status saying how developed the element is, so the user and downstream skills recognize it at a glance and see what still needs a bio or entry.

This is the StoryStormer "Manifest" concept — the living inventory of every character and worldbuilding element in the story (the web app calls the same idea a "Manifest"; earlier drafts called it a "Call Sheet").

Always follow `references/plan-first.md` — propose what you'll add, change, or remove, get confirmation, then write.

## What you produce

`manifest.md` in the StoryStormer app's Manifest format, specified in `references/file-schemas.md` § `manifest.md`: YAML frontmatter (version, treatment_version), then the app's document (title line, Characters by Major / Supporting / Minor, Worldbuilding by type, Open Questions, the footer counts). No file paths and no "(no bio yet)" notes: the status line carries that.

```markdown
### Major Characters

**Marlowe Reyes** — Protagonist / Disgraced Forensic Accountant
Forensic accountant who missed Voss's fraud twelve years ago; wants it proven; her own guilt keeps her from asking for help.
*Status: Canon Asset Created*
```

That's the texture. Lean. Scannable. Each entry is what a casting director would put on a real call sheet, under the caps: major ≤30 words, supporting ≤20, minor ≤10, worldbuilding ≤20.

## What to do

### 1. Read context

- `treatment.md` — full read. Every character, location, organization, object the treatment names should appear in the manifest.
- `primer.md` — full read. May surface world-level elements (a culture, a body of lore) that belong under one of the project's worldbuilding types: the types its entries already use, with the app's fourteen defaults in `references/frameworks.md` § Worldbuilding as the starting list. Never invent a manifest section outside that list.
- Existing `manifest.md` — full read. So you can diff.
- All character bios (`characters/*.md`) — at minimum read the YAML frontmatter and Quick Reference. Tells you the canonical `type`, full name, and that a canon asset exists for each.
- Worldbuilding files (`worldbuilding/**/*.md`) — frontmatter + first paragraph. Tells you what each element is in a sentence, and its type (`category`).
- `state.md` for context.

This is a heavy-context turn. **Operate in substantive mode** — list the files at the top of your response, full-read each (`store.read`, full read, beginning to end), and quote at least one passage from each in your output. See `references/reading-discipline.md` § Substantive mode.

### 2. Diff against the current manifest

Compare what the treatment / bios / worldbuilding name vs. what the existing manifest lists:

- **Additions** — elements in the story that aren't in the manifest yet (often: a new character mentioned in the treatment but no bio yet; a location that appeared in Act 3 that wasn't logged).
- **Removals** — elements in the manifest that the treatment no longer references (sometimes after a treatment rewrite — flag for the user, don't auto-remove without confirmation).
- **Renames** — *"Alex" in the old manifest, "Marlowe" in the new treatment*. Detect rename via the bios' frontmatter and any decision recording it (`decisions/_index.md` topics, then that entry).
- **Role shifts** — a character was supporting, now appears in 30+ scenes and is functionally major. Flag for the user; the user makes the call (and an uncertain one goes to Open Questions).
- **Status changes** — `Canon Asset Created` exactly when the bio or entry file exists; otherwise `Mentioned`, `Partially Developed`, or `Ready for Asset` by how much detail the story has settled.
- **Merges** — the same person or thing under variant names (*Kate* and *Katherine*, *Captain Vex* and *Vex*). Merge confident cases into one entry; flag uncertain ones in Open Questions.
- **Description updates** — the description needs to reflect the current treatment's portrayal, within its word cap. Tighten any entry that has outgrown its cap.

### 3. Propose the changes

> Here's what I'm seeing for the manifest sync:
>
> **Additions**:
> - **Doris** — new minor character from the treatment update; should appear under Minor characters.
> - **Hartwell** — Voss's lawyer, mentioned twice in Act 3.
> - **Mara's Diner** — location used in Acts 1, 2, and 3; should be in Locations.
>
> **Renames**: none.
>
> **Role shifts**: I think **Alice Chen** is functioning as major now (in 18+ scenes, has her own arc) — currently logged as supporting. Want to promote her?
>
> **Removals**: none.
>
> **Status changes**: Mara's Diner moves to *Ready for Asset*; Voss Industries to *Canon Asset Created* (its entry exists now).
>
> **Description updates**: 3 minor refinements to existing entries — I'll show you the diff.
>
> Sound good?

### 4. Write the file

After the user approves:

- Snapshot current `manifest.md` per `store.md`.
- `store.write(manifest.md)` with the new manifest, with the version bumped, `treatment_version` set to the current treatment version, `last_updated` set to today, the body's `*Last synced: …*` line updated, and the footer counts recomputed.
- Update `state.md → What Exists → Manifest` to reflect the new version and current element counts, and add a line on what changed to the session's journal entry (created first if this is the session's first write; `references/file-schemas.md` § `journal/`).

### 5. Report

> Manifest v3 written. Added 3 entries (Doris, Hartwell, Mara's Diner), promoted Alice Chen to Major Characters (her bio at `characters/alice.md` is still `type: Supporting` at Supporting depth — want me to expand it?). Snapshot saved. Recommended next step: expand Alice's bio to match her new role, or `character-bio` for Doris if you want to develop her.

## Lean inventory, not deep document

This is a structural index. **Do not** put bio summaries, plot points, thematic commentary, or worldbuilding depth in the manifest. The depth lives in the bio or entry; the manifest says, through the status line, whether that file exists yet.

A character with no bio is simply not `Canon Asset Created`, which flags the missing bio without faking a depth that doesn't exist:

```markdown
**Doris Pruitt** — Informant
Diner regular who trades gossip for pie.
*Status: Mentioned*
```

Filtering follows the app's rules: a character gets an entry if named, in more than one scene, or carrying a plot function; every character is named (no "the CFO"), with first and last names for major and supporting; a worldbuilding element gets an entry if it is invented, a real thing with story-specific liberties, recurring where continuity matters, or rule-bound; a well-known real-world element or a one-scene plot beat gets none. Never describe the same information in two entries.

## Reading discipline

You read the treatment in full when syncing the manifest. **Do not** grep for character names — you'll miss the implicit information about what each character does, what role they play, and which role section they belong in. Operate in substantive mode and quote from the treatment + bios to prove the read.

The cardinal rule: *the manifest is generated from the treatment as a structural index. Grepping the treatment poisons the index.* See `references/reading-discipline.md` § Substantive mode.

## Subagent Dispatch

Manifest sync in **series mode** reads ALL books' treatments to build the `Appears in:` field per entry, plus all bios' frontmatter and Quick Reference blocks. For a trilogy with three ~6,000-word treatments and 18 bios, that's substantial context — exactly the case the subagent pattern was designed for.

Dispatch read subagents per `references/subagent-pattern.md`. Every brief carries the store block from `references/subagent-pattern.md` § Mandatory brief fields.

1. **One treatment subagent per book** (parallel) — each subagent full-reads `books/<slug>/treatment.md` and returns a structured per-character / per-worldbuilding-element appearance map with quoted excerpts of each appearance. Scope: just the appearance map, not the full narrative analysis (this skill is about the structural index, not the story).
2. **Bios scan subagent** — reads each bio's frontmatter + Quick Reference + first paragraph (lighter than the major-bio scan in `character-bio`'s subagent). Returns canonical name, `type`, current `Appears in:` value (if any), and the bio's own claim about which books the character appears in.
3. **Worldbuilding scan subagent** — same lighter pattern for worldbuilding files.

The main session aggregates the per-book appearance maps and the per-bio frontmatter scans, then performs the diff (Step 2) against the current manifest — that's the judgment work. Surfacing the diff to the user (Step 3) and writing the new manifest (Step 4) stay in the main session.

For **standalone-novel manifest syncs**, direct main-session reads are usually fine — one treatment + N bios, all of which a single context can hold without strain. Dispatch only if the standalone project is exceptionally large (a 100k-word treatment, 20+ bios).

## Series Mode

If `state.md` shows `project_type: series`, read `references/series.md` first. **The manifest is shared across the series** — one `manifest.md` at workspace root, inventorying the full cast and worldbuilding across all books.

Two behavioral changes in series mode:

1. **Read ALL books' treatments** during the substantive read, not just the focused book's. The manifest's `Appears in:` field per entry depends on cross-book treatment scanning. If a book's treatment doesn't exist yet (e.g., book 3 is undrafted), use `series.md`'s Per-Book Synopses as a lighter source for that book's named entities.
2. **Add the `*Appears in: …*` line** to every manifest entry, characters and worldbuilding alike, directly under its Status line: *"Appears in: books 1, 2, 3"* or *"Appears in: book 1"*, numbering books by their place in the series' `books` list (the app's Manifest Sync 1.4.0 writes the same line). This is the load-bearing addition for series-mode manifests — it tells downstream skills (`character-bio`, `treatment-update`) which books to consult when working on a character. Keep an entry's existing books; never drop one on the strength of a single book's treatment.

Example series-mode manifest entry:

```markdown
**Maya Vance** — Protagonist / Congressional Staffer
Hill staffer who learns her father's office brokered the deal she is investigating; wants the truth out, fears what it costs him.
*Status: Canon Asset Created*
*Appears in: books 1, 2, 3*
```

The diff step (Step 2) gains a check in series mode: verify each entry's `Appears in:` against the actual treatments. A character whose `Appears in:` says "book 1" but who is mentioned in book 2's treatment is a drift to flag — either the field is stale or the book-2 treatment introduced an unplanned cross-book appearance.

There is no per-book manifest. The shared manifest is canonical. If a user asks for "the manifest for book 2," interpret that as "filter the shared manifest by `Appears in: book 2`" — surface the filtered view in the conversation but don't write a per-book manifest file.

## What this skill does not do

- Generate or update bios. That's `character-bio`. (Manifest sync may surface bio gaps; flag them in the report and recommend `character-bio` as next.)
- Generate worldbuilding files. The manifest can list *Voss Industries* at *Ready for Asset*, but the worldbuilding file itself is a separate creation. Use `worldbuilding-entry` to write the actual entry; flag missing-file entries in the report and recommend `worldbuilding-entry` as next.
- Refresh the treatment. The manifest is downstream of the treatment, not the other way around. Treatment changes drive manifest changes, not the inverse.
- Create per-book manifest files. The shared manifest is canonical; filtered views are conversational outputs, not files on disk.

## References

- `references/plan-first.md`
- `references/file-schemas.md` — `manifest.md` (the app's Manifest format: entry shapes, word caps, status ladder, Open Questions, footer)
- `references/reading-discipline.md` — full-read rules, Zoom Selection
- `references/subagent-pattern.md` — **read when project is series mode** (per-book treatment reads dispatched in parallel)
- `references/series.md` — **read when `project_type: series`** (shared manifest, Appears in field, all-books read)
- `references/philosophy.md`
