# SB1 — Store Contract: One Set of File Operations, Any Backend

## TL;DR for Rob

**The problem:** Every skill in the plugin talks to the host's file tools by name (Read, Write, Glob, Edit) and assumes a local folder. That works in Claude Code but not from a phone, a cloud Cowork session, or an author whose book lives in Dropbox or Notion.

**The approach:** Write one short reference document that defines six abstract file operations, a capabilities line each backend publishes, a `storage` block in the project config, and a once-per-session resolution step that picks the backend. Nothing else changes in this plan; SB2 moves the skills onto it and SB3 writes the bindings. This is the contract everything downstream is held to, so it is small and precise.

**Tier:** FULL — introduces the abstraction every skill will depend on and changes the config schema · **Judgment profile:** judgment

**What changes:**
1. **`references/store.md`** — the contract: operations, semantics, capabilities, resolution, the concurrency guard, the confirmation posture, the subagent rule.
1a. **`references/store/local.md`** — today's behavior written as the first binding (moved here from SB3, decision 2026-10-15: SB1's own success test and SB2's adversarial check both need a binding doc in hand).
2. **`references/file-schemas.md`** — `.storystormer/config.json` gains `storage`; `state.md` frontmatter gains `storage_kind`.
3. **`PLUGIN-GUIDE.md` and `CLAUDE.md`** — the contract becomes a hard constraint: no skill names a host or connector tool directly.

**Why it matters:** With the contract in place, adding a backend is one new binding document, not thirteen skill edits.

---

## 1. Problem & Decisions

**What:** Define the store contract the plugin's skills will address instead of host tools. Design: [`CW5`](https://github.com/bobbylanefilms/storystormer/blob/main/plan/_cowork/CW5-storage-backends-brainstorm.md) § 4–5 (in the web-app repo); the six operations come from [`AP4`](https://github.com/bobbylanefilms/storystormer/blob/main/.plans/AP4-plugin-retarget.md) § 1 unchanged.

**Why:** Thirteen skills times N backends is unmaintainable as inline branching. A contract keeps the skill bodies about story work and makes the backend a property of the project.

**Key decisions** (resolved; do not relitigate):
- **Six operations, two optional.** `list(glob)`, `read(path)`, `write(path, content)`, `edit(path, edits, reason)`, `history(path)`, `open(path)`; optional `move(from, to)` (fallback read → write → delete) and `delete(path)` (bindings use it internally; skills reach it only through `move`). Same semantics everywhere: `read` returns markdown with frontmatter; `write` is whole-file replacement that creates when absent; `edit` is the anchored string-edit grammar (an edit whose anchor is missing or ambiguous fails the whole call); `history` returns prior versions or says where they are; `open` presents the file to the author.
- **Capabilities are declared, not discovered.** Each binding publishes one line: `identity: path | id`, `write: native | delete-create | create-trash`, `edit: native | read-modify-write`, `list: glob | folder-walk | query`, `history: snapshots | native | versions`, `open: pane | url`, `size: <read cap> / <write cap>`, `confirm: none | batch`. Skills may read the line; they never special-case a backend by name.
- **Local-mode behaviors become contract clauses.** Snapshots to `.history/` happen only where `history: snapshots`. Index documents (`characters/_index.md`, `outline/_index.md`, `voice/README.md`) and `.storystormer/config.json` are written only where the binding lists them as stored, and are read-only computed documents elsewhere. Skills say "snapshot per `store.md`" and "regenerate the index per `store.md`"; the contract decides.
- **Backend is a project property.** `.storystormer/config.json` carries `storage: { kind, root, local_root? }` with `kind ∈ local | dropbox | notion | storystormer`; `state.md` frontmatter mirrors `storage_kind`. The config lives in the store (a real file on file backends; computed from the project row on Notion and the StoryStormer server).
- **Resolution happens once per session**, in a preamble every skill loads first: an open working folder with a config → its `storage` (local when `kind: local` or `local_root` exists on this machine; otherwise the named connector, if present); no folder → the locator (SB4) lists projects at each present connector's well-known root and binds one. The binding, the root, and the capabilities line live in the conversation for the session; every subagent brief carries all three.
- **Tools are named by connector and short name**, never by prefixed id: "the Dropbox connector's `create_file`". Connector ids differ per user and per surface.
- **Concurrency guard** on connector backends: before an overwrite, re-read the target's frontmatter `version`; if it is higher than what this session read, stop and show the author both versions. Native history keeps the loser after that.
- **Confirmation posture:** the plan-first approval covers every write in that run; a binding whose connector asks for per-mutation confirmation says so and tells the model not to re-ask per file.
- **Execution decisions (Rob, 2026-10-15):** (1) `references/store/local.md` is written in SB1, not SB3, using SB3 § 3A's spec and capabilities line; (2) SB1 and SB2 ship as **one release** on one branch (two committed phases, one version bump, one landing on `main`), so Cowork never sees references and skills speaking different vocabularies; (3) the reference edits SB2 § 3C lists (`plan-first`, `reading-discipline`, `subagent-pattern`, `prose-spec`, `blueprint-spec`, `series`, `kitbash-spec`) are all done in SB1's references slice so no file is edited twice; (4) check early that `claude plugin validate .` accepts `mcp__*` in a command's `allowed-tools`.

**Success criteria** (each independently verifiable):
- [ ] `references/store.md` exists, is under ~250 lines, and a fresh model reading only it plus one binding doc can state how `write` of an existing `treatment.md` is realized on that backend without guessing.
- [ ] `references/file-schemas.md` § `.storystormer/config.json` shows the `storage` block for standalone and series projects; § `state.md` lists `storage_kind`.
- [ ] `PLUGIN-GUIDE.md` and `CLAUDE.md` name the contract as a hard constraint with the grep that enforces it (see SB2).
- [ ] `references/store/local.md` exists with the local capabilities line from SB3 § 1.
- [ ] `claude plugin validate .` passes. Version bump and landing on `main` happen once, at the end of SB2 (combined release).

---

## 2. Current State

**Relevant files:**
| File | Role / key lines |
|------|------------------|
| `/Users/robert.sawyer/Git/storystormer-plugin/references/file-schemas.md` | the path contract; § `.storystormer/config.json` (~line 929) and § `.storystormer/history/` (~line 965) are the two sections this plan touches |
| `/Users/robert.sawyer/Git/storystormer-plugin/references/plan-first.md` | the propose-then-execute protocol; step 5 mentions `.storystormer/history/` by name, which becomes "per `store.md`" |
| `/Users/robert.sawyer/Git/storystormer-plugin/references/subagent-pattern.md` | subagent briefs; gains the mandatory backend / root / capabilities fields |
| `/Users/robert.sawyer/Git/storystormer-plugin/references/reading-discipline.md` | "full-read with the Read tool" phrasing becomes "full-read through `store.read`" |
| `/Users/robert.sawyer/Git/storystormer-plugin/CLAUDE.md` · `PLUGIN-GUIDE.md` | hard constraints and the release checklist |

**Patterns to mirror:** the references are loaded by path from skills (`references/prose-spec.md` is the model: an operational contract a skill reads before acting). Write `store.md` in that register: a contract, not a tutorial. The two-line `ABOUTME:` header convention applies.

---

## 3. Implementation (by change-area, goal-shaped)

### A. `references/store.md`
**Files:** `references/store.md` (new)

Sections, in order: **Operations** (the table of eight with semantics); **Capabilities** (the line, every value defined in one sentence); **Resolve** (the preamble skills load first, the two entry states, what the session remembers, the subagent rule); **Local-mode clauses** (which behaviors key on which capability value: snapshots, indexes, config file, `open` realization); **Concurrency guard**; **Confirmation posture**; **Bindings** (a table: backend → binding doc path → tier → "verified on" date; initially `store/local.md`, `store/dropbox.md`, `store/notion.md` from SB3, `store/storystormer.md` from AP4 marked "pending"). The document never names a host or connector tool; the bindings do.

The capabilities line and the `storage` block are contracts; show them in full:

```
identity: path | id
write:    native | delete-create | create-trash
edit:     native | read-modify-write
list:     glob | folder-walk | query
history:  snapshots | native | versions
open:     pane | url
size:     <read cap> / <write cap>
confirm:  none | batch
```

```json
"storage": {
  "kind": "local | dropbox | notion | storystormer",
  "root": "<dropbox folder path | notion project page id | storystormer project id>",
  "local_root": "<optional absolute path of the synced folder on this machine>"
}
```

### B. Schema updates
**Files:** `references/file-schemas.md`, `references/plan-first.md`, `references/subagent-pattern.md`, `references/reading-discipline.md`

`config.json` examples (standalone and series) gain `storage`; `state.md` frontmatter gains `storage_kind: local | dropbox | notion | storystormer`. The § `.storystormer/history/` and per-chapter `.history/` sections open with one sentence: these apply where the binding's `history` is `snapshots`. The book-level snapshot rule's file list gains worldbuilding entries (baseline finding 2026-10-15: `worldbuilding-entry` and `canon-sync` already snapshot them; the rule just never said so). `plan-first.md` step 5 and `reading-discipline.md` stop naming host tools. `subagent-pattern.md` adds the three mandatory brief fields and the rule that the main session rejects a report naming a local path when the session's binding is not local.

### C. Constraints and docs
**Files:** `CLAUDE.md`, `PLUGIN-GUIDE.md`, `README.md`

`CLAUDE.md` § Hard constraints gains: *"Skills and commands address `references/store.md`, never a host or connector tool by name; the grep in SB2 enforces it."* `PLUGIN-GUIDE.md` gets a short "Storage backends" section pointing at `store.md` and the bindings table. `README.md` gains one paragraph: where a story can live, and that only local mode exists until SB3 ships. No version bump here; the combined SB1+SB2 release bumps once.

---

## 4. Verification & Testing

**Automated:** `claude plugin validate .`.
**Manual:** read `store.md` cold and answer, for a hypothetical Dropbox binding, how `treatment-update` would snapshot, write, and present the new treatment; the answers must follow from the document alone. Run `/storystormer:status` on a local test project to confirm nothing behavioral changed (this plan touches no skill bodies).
**Adversarial check:** a fresh-context review of `store.md` against CW5 § 4–5 for any semantic the brainstorm states and the contract omits.

---

## 5. Risks & Mitigations

| Risk | Mitigation / detection |
|------|------------------------|
| The contract leaks backend names into skills later | the SB2 grep is the guard; `store.md` says "never special-case a backend by name" in its first paragraph |
| `edit` semantics differ subtly between a native edit and read-modify-write | the contract pins the failure rule (missing or ambiguous anchor fails the whole call) and SB5 tests the same revise-mode edit on every backend |
| `storage` block drifts from AP2's computed `config.json` | AP2 renders exactly this block from the project row; note the field names in AP2 when it executes |

---

## 6. Scope & Assumptions

- **Out of scope:** any skill or command change (SB2); the Dropbox and Notion bindings (SB3) and the StoryStormer binding (AP4); the onboarding question and the locator's behavior beyond naming them (SB4).
- **Required first:** nothing. Independent of AP0 Part B (formats, not I/O); do not ship the two in the same release.
- **Needs human judgment:** none expected; the decisions are resolved above.
