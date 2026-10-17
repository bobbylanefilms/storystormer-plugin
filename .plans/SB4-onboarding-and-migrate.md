# SB4 — Onboarding and Migration: Choosing Where a Story Lives, and Moving It

## TL;DR for Rob

**The problem:** After SB3 the plugin can run on a local folder, Dropbox or Notion, but nothing asks the author which one, nothing finds an existing project when no folder is open, and nothing moves a project from one home to another.

**The approach:** `init` gains one question ("Where should this story live?") filtered by the connectors present; a locator finds projects at each backend's well-known root when no folder is open; the hybrid roots (local plus synced folder) are recorded in config; and a new `migrate` skill copies a project between any two backends through the contract and flips the config, leaving the source untouched.

**Tier:** FULL — a new skill and a new entry flow across every surface · **Judgment profile:** judgment

**What changes:**
1. **`init` asks where the story lives** and writes `storage` accordingly, scaffolding the backend if needed.
2. **A session-start locator** lists projects on connected backends when no folder is open.
3. **`migrate` skill and `/storystormer:migrate`** copy a project between backends.
4. **Guides** explain the choices in author terms.

**Why it matters:** This is the author-facing half: without it the bindings are a developer feature.

---

## 1. Problem & Decisions

**What:** Onboarding, location, and migration for storage backends. Design: CW5 § 5 (resolution and the hybrid), § 8 (migration), § 9.

**Why:** The backend must be a one-time choice an author can change later without losing anything.

**Key decisions** (resolved):
- **The question is asked once, at `init`,** after triage and before the plan: *"Where should this story live?"* with the options the session can see: the open folder (when there is one; marked "also the laptop half of a sync if the folder is inside Dropbox, Google Drive or OneDrive"), Dropbox, Notion, StoryStormer (when AP4 has landed), each listed only when its connector is present. Default: the open folder in Claude Code; Notion in a session with no folder and a Notion connector; otherwise ask. The answer writes `storage` and, for a connector backend with an open folder, `local_root` too.
- **Sync-folder detection** is a path check (`/Dropbox/`, `/Google Drive/`, `/OneDrive/`, `/Library/CloudStorage/` in the folder's absolute path) and yields `kind: local` with a note in `state.md` that the folder syncs; the author can later run `migrate` to the matching connector to make it a true hybrid (`kind: dropbox` with `local_root`).
- **The locator** runs only when no folder is open: for each present connector, look at its well-known root (SB3 lists them; AP4 adds `list_projects`), present the projects found with title, stage and last session (from each project's `state.md` read through the binding), bind the chosen one. When exactly one project exists across all backends, bind it and say so. The bound backend, root and capabilities line are repeated at the top of the first response so the author can see them.
- **`migrate` is one skill for any pair.** Source = the current binding; target = the author's choice (same option list as `init`). Steps: `store.list('**')` on the source; preflight (report counts by kind and the estimated call volume; refuse if the target already has a project with the same slug unless the author says merge); then copy in canonical order (canon: `characters/`, `worldbuilding/`; story docs: `primer.md`, `treatment.md`, `manifest.md`, `series.md`, `voice/`, `research/`; `outline/`; `chapters/` in chapter order; then everything else), writing through the target binding; computed documents on the target are not copied, they are rendered; `.history/` snapshots are copied only when the target's `history` is `snapshots`; then write the new `storage` block (and `local_root` when the source was local and the target is its synced connector), and report: counts, anything stored as unmapped on the target, anything skipped and why. The source is never modified. Re-running is safe: a write of identical content is a no-op.
- **`/storystormer:migrate <target>`** invokes the skill; without an argument it lists the targets.
- **Series projects** migrate whole (shared canon, then each book in order).

**Success criteria** (each independently verifiable):
- [ ] `init` on an empty local folder with Dropbox and Notion connected asks the question with three options; choosing Notion creates the hub and databases (SB3) and a Projects row, and the folder gets only a pointer config (`storage.kind: notion`, `root`, `local_root`).
- [ ] `init` on a folder under `~/Dropbox/` marks it as syncing; `migrate dropbox` afterward turns it into the hybrid; a session with the folder open resolves to local, a session with no folder resolves to Dropbox and sees the same files.
- [ ] A Cowork session with no folder and Notion connected lists the projects at the hub and binds the chosen one; `/storystormer:status` reports from the Projects row.
- [ ] `migrate` local → Notion → Dropbox → local on a copied real project (The Good Dog or Twelve to Zero) ends with a tree that diffs clean against the original except for computed documents and timestamps; counts in each report match.
- [ ] `migrate` into a backend that already holds the slug refuses with the merge prompt.
- [ ] Guides updated; `claude plugin validate .` passes; version bumped; landed on `main`.

---

## 2. Current State

**Relevant files:**
| File | Role / key lines |
|------|------------------|
| `skills/storystormer-init/SKILL.md` | § 3–4 (questions and the plan); the question slots in after triage |
| `commands/init.md` · `commands/switch.md` | command surface; `migrate.md` is new beside them |
| `references/store.md` § Resolve (SB1) | names the locator; this plan specifies it |
| `references/store/*.md` (SB3) | the well-known roots and scaffold steps the locator and `init` use |
| `references/series.md` | series layout the migration order respects |
| `guides/installing.md` · `guides/developing-your-story.md` | author-facing; gain "Choosing where your story lives" and "Moving a story" |

**Patterns to mirror:** `init`'s existing subagent dispatch for non-trivial migrations (`subagent-pattern.md`): `migrate` dispatches one execution subagent per category with the backend fields in every brief, aggregates the logs, and writes the config last from the main session, exactly as `init`'s § 5 does for intake.

---

## 3. Implementation (by change-area, goal-shaped)

### A. `init`: the question and the scaffold
**Files:** `skills/storystormer-init/SKILL.md`, `commands/init.md`
The question, the defaults, the sync-folder note, the pointer config for connector-backed projects with an open folder, and the backend scaffold step (delegated to the binding: Dropbox creates the root folder; Notion runs SB3's DDL and creates the Projects row).

### B. The locator
**Files:** `references/store.md` § Resolve, each `references/store/*.md` (a "Locate" subsection)
What each binding does to list projects at its root and what it returns (title, slug, stage, last session). The resolution preamble presents them and binds.

### C. `migrate`
**Files:** `skills/migrate/SKILL.md` (new), `commands/migrate.md` (new)
Preflight, canonical order, subagent dispatch, the config flip, the report, the refusal rule, series handling, idempotence. Plan-first applies: the preflight is the plan.

### D. Guides and release
**Files:** `guides/installing.md`, `guides/developing-your-story.md`, `README.md`
"Choosing where your story lives" (the options in author terms, the hybrid explained in one paragraph, what each backend is good at, Tier 3 note that Drive and OneDrive work as synced folders), "Moving a story between homes". Version bump; validate; `main`.

---

## 4. Verification & Testing

**Automated:** `claude plugin validate .`.
**Manual:** the success-criteria runs; screenshots of the `init` question in Claude Code and in Cowork, the locator's project list, and the Notion hub after a migration; the diff from the round trip.
**Adversarial check:** fresh-context read of `migrate/SKILL.md` with `store.md` and two bindings; the reader must be able to say what happens to `.history/` and to `decisions.md` when migrating local → Notion without guessing.

---

## 5. Risks & Mitigations

| Risk | Mitigation / detection |
|------|------------------------|
| A big project migrates slowly (hundreds of calls) | preflight states the estimate; subagents run categories in parallel; re-run resumes because writes are idempotent |
| Two projects with the same slug on one backend | the refusal and merge prompt |
| The locator finds a hub with a broken schema | the binding's "Locate" validates the five databases and reports which is missing |
| The author picks a backend whose connector is not in the next session | resolution says which connector to connect; the config is unchanged |

---

## 6. Scope & Assumptions

- **Out of scope:** the StoryStormer target (AP4 adds it to the option list; `migrate` needs no change); two-way sync between backends (the hybrid is one store seen two ways, not two stores).
- **Required first:** SB2 and SB3 on `main`.
- **Needs human judgment:** whether `migrate` should offer to delete the source after a verified copy. Default: never; the author deletes by hand.

---

**Implementation notes (as built):** 2026-10-17, `/implement SB4 and SB5` on `feature/sb4-sb5-onboarding-migrate`, released as `0.20.0-poc` (fixes from live testing follow in `0.20.1-poc`).

- **Slices:** (1) init storage question + locator, `854ab2a` + review fix `0226758`; (2) `migrate` skill and `/storystormer:migrate`, `b4b3536` + `9dbec49`; (3) guides, README (v0.20.0 and the missing v0.18.0 changelog entries), version bump, `05c0d90` + `3194140`. Each reviewed by GPT-6.1 Sol (13, 17 and 9 findings; 10, 17 and 9 confirmed and fixed); a cold Haiku read of `migrate` answered the plan's adversarial question (`.history/` and `decisions.md` on local → Notion) from the skill's table without guessing.
- **Deviation, `local_root` in pointers:** the plan's “a connector backend with an open folder gets `local_root` too” would bind local and bypass the connector (resolution binds local wherever `local_root` exists). A pointer is exactly `{"storage": {"kind", "root"}}`; `local_root` appears only where it names the synced copy of the pointer's own Dropbox root. Success criterion 1's field list is wrong; its intent (“only a pointer config”) holds.
- **Option list:** every backend in `store.md` § Bindings that isn't pending and whose tool check passes, so StoryStormer adds itself when AP4 verifies its binding. Defaults as planned; with one option init doesn't ask.
- **Sync folders:** a path-segment check (`Dropbox*`, `Google Drive`, `OneDrive*`, anything under `/Library/CloudStorage/`) yields `kind: local` plus a **Storage** line in `state.md` → What Exists (recomputed from the folder's path whenever What Exists is rewritten). The true hybrid requires the folder to be exactly `<Dropbox sync root>/StoryStormer/<slug>`.
- **Locator:** `store.md` § Resolve step 2 plus a § Locate per binding (local contributes nothing; Dropbox lists `/StoryStormer/`; Notion lists complete hubs' top-level Projects rows). Auto-binds a lone project only when no Locate failed or was incomplete; same-slug pairs are listed side by side with last-modified times; a located `kind: local` config inside the synced folder binds the backend that found it.
- **`migrate`:** preflight is the plan; a per-item table settles what is copied, mapped, computed, unmapped or skipped per target type; same-slug refusal with merge, resume, “complete, flip pending” and “earlier source left behind” cases; verification by path set before the flip; config written last; the session rebinds to the target after the flip. Never deletes the source (plan default kept). Hybrid case A (folder already at the synced root) makes no copy.
- **Live verification (SB4 criteria):** C1 (init asks with three options; Notion chosen; hub reused; folder holds only the pointer), C2 (sync folder → `migrate dropbox` case B → hybrid; folder-open and no-folder sessions see the same files), C2a (case A, config flip only), C3 (no-folder locator over both backends; `/storystormer:status` from the Projects row), C5 (same-slug refusal) and the no-argument error case all **passed** on 2026-10-17. Criterion 4 (round trip diffs clean) **failed through Notion** on the first run (86 of 96 shared files changed, all by the two Notion legs; Dropbox and local legs byte-clean); see SB5's as-built notes for the fixes and the re-verify.
- **Found and fixed along the way:** Notion `relation_contains` with a bare page id silently returns every project's rows (`d6d4b35`).
