# SB2 — Skill Rewrite: Every Skill and Command Speaks the Store Contract

## TL;DR for Rob

**The problem:** Thirteen skills, seven commands and several references mention Read, Write, Glob, Edit and `.storystormer/history/` by name, and each one re-states the snapshot and index-regeneration steps as if a local folder were the only world.

**The approach:** Replace every host-tool mention with the contract's operations, replace every restated local-mode step with "per `store.md`", widen the commands' `allowed-tools`, and prove nothing changed by running the development loop on a local project before and after. No new behavior; one grep proves the rewrite is complete.

**Tier:** FULL — touches every skill and command; a regression here breaks the whole plugin · **Judgment profile:** routine

**What changes:**
1. **Skills and commands** address `store.list / read / write / edit / history / open` and say "snapshot per `store.md`".
2. **Commands' `allowed-tools`** no longer pin the local tool set.
3. **Guides** stop saying "your folder" where they mean "your project".

**Why it matters:** This is the one-time cost that makes every later backend a document, not a rewrite.

---

## 1. Problem & Decisions

**What:** Move every call site onto SB1's contract. Design: CW5 § 4 and § 9; AP4 § 3B (the same rewrite, done here once and not repeated in AP4).

**Why:** The contract is only real when nothing bypasses it.

**Key decisions** (resolved):
- **Mechanical, not creative.** Skill texture, outputs, plan-first behavior, reading discipline and the subagent doctrine are unchanged. Only the I/O vocabulary and the restated local-mode steps move. A reviewer should be able to diff each skill and see nothing but substitutions.
- **Substitution table** (apply exactly): "Read tool / full-read with the Read tool" → "`store.read` (full read, beginning to end)"; "Write the file / Write to `path`" → "`store.write(path)`"; "Glob `pattern`" → "`store.list(pattern)`"; "Edit `file`" → "`store.edit(path)`"; "snapshot to `.storystormer/history/…`" or "to `.history/`" → "snapshot per `store.md`"; "regenerate `_index.md`" → "regenerate the index per `store.md`"; "present the file (Cowork preview / send-file)" → "`store.open(path)`". Subagent briefs that say "use the Read tool" say "use `store.read` with the binding named in this brief".
- **`allowed-tools` on commands** becomes `["Read", "Write", "Edit", "Glob", "Grep", "Task"]` plus the line `mcp__*` so connector tools are pre-approved where the host honors the field; the field pre-approves, it does not restrict, so a wider list is harmless.
- **`checkpoint` and `switch`** keep their semantics but say what happens where `history` is `native` (checkpoint reports it is unsupported on that backend and points at the backend's own history) and where `config.json` is computed (switch writes `current_focus` through `store.write('state.md')`'s writable frontmatter; the config follows).
- **`init`** is rewritten for I/O only here; the onboarding question, the locator and migration are SB4.
- **Execution decisions (Rob, 2026-10-15):** (1) released together with SB1 (one bump, one landing); (2) the § 3C references are done in SB1's references slice, so SB2 § 3C covers guides only; (3) behavioral parity is judged **structurally**, not textually: the same files written, the same `.history/` and `.storystormer/history/` snapshot trees, the same index updates, the same `state.md` frontmatter fields and version bumps. Prose content will differ run to run and is not compared. (4) The baseline is captured by a scripted harness against a frozen copy of `main` @ `ef1ef20` (v0.17.2-poc) **before** SB1 lands, at `~/Git/storystormer-parity/` (see that folder's README); the post-rewrite run reuses the same script. (5) A second, eyeball-only grep (`snapshot|_index|preview|send-file|present the file`) lists every restated local-mode step for the reviewer, since the gate grep catches only tool names and history paths.
- **The grep is the gate:** `grep -rnE '\b(Read|Write|Glob|Edit) tool\b|\bGlob `|\bthe Read\b|\.storystormer/history/|\.history/' skills commands references guides` returns matches only inside `references/store.md`, `references/store/*.md`, `references/file-schemas.md`'s history definitions and layout entries, `references/series.md`'s layout tree, `commands/checkpoint.md` (its own output folder), author-facing guide lines qualified "in a local folder", and skills' reference lists citing `file-schemas.md` sections. *(As built: the original pattern `/\.history/` missed backtick-quoted `.history/`; widened 2026-10-15 after the Slice 3 review.)*

**Success criteria** (each independently verifiable):
- [ ] The grep above returns no matches outside the allowed files.
- [ ] Structural parity against the harness baseline (decision 3 above). On a local test project (a copy of The Good Dog): `brainstorm-session` → `decision-capture` → `character-bio` → `treatment-update` → `manifest-sync` produce the same files, snapshots and index updates as before the rewrite (compare the `.history/` tree and `state.md` diff).
- [ ] `outline-chapters`, `blueprint`, `prose` (generate then one revise-mode edit), `notes`, `canon-sync` run on one chapter with the same outputs as before.
- [ ] All seven commands run; `checkpoint` writes the same snapshot folder it did before.
- [ ] `claude plugin validate .` passes; version bumped; landed on `main`.

---

## 2. Current State

**Relevant files:**
| File | Role / key lines |
|------|------------------|
| `skills/*/SKILL.md` (13) | call sites; the heaviest are `worldbuilding-entry`, `treatment-update`, `character-bio`, `blueprint` (9 mentions each), `pre-outline-session`, `notes` (7), `outline-chapters` (6) |
| `commands/*.md` (7) | `allowed-tools` frontmatter; `checkpoint.md` restates the copy procedure ("Read each source file and Write its contents"); `switch.md` edits `state.md` and `config.json` directly |
| `references/plan-first.md` · `reading-discipline.md` · `subagent-pattern.md` · `prose-spec.md` · `blueprint-spec.md` · `series.md` | restate host-tool phrasing and snapshot paths |
| `guides/*.md` | user-facing; "your folder" phrasing |
| `references/store.md` | SB1's contract; the only place host tools may be named (its Local clauses) until SB3 adds `store/*.md` |

**Patterns to mirror:** the skills already load references by path and defer to them for contracts (`prose` defers to `prose-spec.md` for the assembly order). Defer to `store.md` the same way: one sentence, no restatement.

---

## 3. Implementation (by change-area, goal-shaped)

### A. Skills
**Files:** `skills/*/SKILL.md`
Apply the substitution table. Where a skill lists what it writes (the "What you produce" sections), keep the paths; they are the contract's paths. Where a skill describes snapshotting as a step in its plan template (treatment-update's example plan, prose's revise mode), keep the step but phrase it as "snapshot per `store.md`". Subagent briefs gain the three fields from `subagent-pattern.md` (backend, root, capabilities line).

### B. Commands
**Files:** `commands/*.md`
`allowed-tools` per the decision above. `checkpoint.md`: **fix the stale capture list** (baseline finding 2026-10-15: it predates the outline, chapter and voice stages, so one baseline run copied 30 files and missed every chapter, and the other improvised 79 including `pipeline/lint.py`). Capture every path `references/file-schemas.md` defines, except the history folders and `research/`, rather than a hand-kept list. This is the one deliberate behavior change in SB2; parity step 16 is an expected difference. The copy is `store.read` then `store.write` into the snapshot folder, and the command refuses with a one-line explanation where `history` is `native` or `versions`. `switch.md`: write the focus through the contract; where `config.json` is computed, write only `state.md`. `status.md`: the drift check lists through `store.list`.

### C. References and guides
**Files:** `references/plan-first.md`, `reading-discipline.md`, `subagent-pattern.md`, `prose-spec.md`, `blueprint-spec.md`, `series.md`, `guides/*.md`
Same substitutions. Guides: "your story folder" → "your story project (a folder, or a connected Dropbox or Notion workspace once those bindings ship)" where the sentence is about location, unchanged where it is about Claude Code's working directory.

### D. Release
Version bump in both manifests; `claude plugin validate .`; land on `main`.

---

## 4. Verification & Testing

**Automated:** the grep in § 1; `claude plugin validate .`.
**Manual:** the two loops in the success criteria, run on a copied local project with the pre-rewrite plugin first (record the resulting tree and `state.md`), then with the rewritten plugin on a fresh copy; diff the trees. Run every command once.
**Adversarial check:** a fresh-context read of three rewritten skills (`treatment-update`, `prose`, `storystormer-init`) with only `store.md` and `store/local.md` in hand; the reader must be able to execute them on a local folder without guessing a tool.

---

## 5. Risks & Mitigations

| Risk | Mitigation / detection |
|------|------------------------|
| A substitution changes meaning (a "Read" that meant "read the user's message") | review each hit in context; the grep lists them, the diff shows them |
| `allowed-tools` widening is ignored or rejected by Cowork | the field is advisory; `claude plugin validate .` catches schema errors; Cowork behavior is checked in SB5 |
| Subagent briefs lose the local path context they relied on | the three mandatory brief fields replace it; `subagent-pattern.md` carries an example brief |

---

## 6. Scope & Assumptions

- **Out of scope:** bindings (SB3), onboarding and migration (SB4), format changes (AP0 Part B), any behavioral change to a skill.
- **Required first:** SB1's phase committed on the shared SB1+SB2 branch (combined release).
- **Needs human judgment:** none; if a substitution is ambiguous in context, keep the original meaning and note it in the as-built notes.
