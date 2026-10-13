# SB5 — Backend Test Matrix: Run the Whole Pipeline on Every Backend and Decide What Stays

## TL;DR for Rob

**The problem:** SB1–SB4 make the plugin storage-agnostic on paper. Each backend has one risk nobody can settle without running a real book through it: Dropbox's confirmation nagging and delete-create races, Notion's treatment size and query volume, Cowork's subagent-connector inheritance, and plain latency.

**The approach:** Run the same two loops (development and chapter) on a copied real project on each Tier 1–2 backend, migrate it around the ring, measure, and write the keep / demote / drop verdicts into CW5. No new code unless a test fails; fixes are folded in where small.

**Tier:** LEAN — verification work on existing contracts · **Judgment profile:** judgment

**What changes:**
1. **A recorded test run per backend** with call counts, wall time, and failures.
2. **CW5 § Test results** carries the verdicts and the Tier 3 re-test date.
3. **Small fixes** to bindings or skills found along the way, each noted in the as-built notes.

**Why it matters:** This is where "support it" becomes a decision backed by evidence rather than by connector docs.

---

## 1. Problem & Success

**What:** Exercise every supported backend end to end and decide the tiers for the release that follows.
**Why:** CW5 § 11 lists five unknowns; each is cheap to settle by running and expensive to discover from an author.

**Success criteria** (each independently verifiable):
- [ ] The development loop (`init` → `brainstorm-session` → `decision-capture` → `character-bio` → `treatment-update` → `manifest-sync`) runs on local, Dropbox and Notion with a copied real project; outputs diff clean against the local run except computed documents and timestamps.
- [ ] The chapter loop (`pre-outline-session` if needed → `outline-chapters` one chapter → `blueprint` → `prose` generate then one revise-mode edit → `notes` → `canon-sync`) runs on each backend for one chapter.
- [ ] Migration ring local → Notion → Dropbox → local diffs clean (SB4 criterion repeated here with the real project).
- [ ] Measurements recorded per backend: tool calls and wall time for `treatment-update` and `blueprint`; the longest single read; any failure and its cause.
- [ ] The five unknowns answered in writing: Dropbox per-file confirmation nagging (yes/no, and the wording that stopped it); fifty consecutive overwrites of one Dropbox file with no race; Notion treatment at the project's real length (fits whole / needed sections / needs per-act pages); Cowork subagents see connectors (yes/no); Cowork honors the widened `allowed-tools` (yes/no).
- [ ] Verdicts written into CW5 § 12 as a dated addendum (keep / demote / drop per backend; Drive and OneDrive re-test date in November 2026); the plugin README's "where a story can live" matches.
- [ ] Any fix shipped: version bumped, validated, on `main`.

---

## 2. Where & How

**Files in play:**
| File | What changes |
|------|--------------|
| `/Users/robert.sawyer/Git/storystormer/plan/_cowork/CW5-storage-backends-brainstorm.md` | gains § Test results (the verdict table and the measurements) |
| `references/store/*.md` | wording or rule fixes found in the runs |
| `README.md` · `guides/installing.md` | tier wording to match the verdicts |

**Pattern to follow:** the plugin's browser-verification discipline from the global CLAUDE.md (happy path, screenshots of key states, one error case, reachability). Here the "browser" is each backend's own UI: Dropbox web (version history of the overwritten treatment), Notion (the Chapters grid and an Assets row), and the Cowork session view.

**The change, goal-shaped:** one test project copied three times (The Good Dog or Twelve to Zero; Rob picks), one run per backend in Claude Code, then the same development loop repeated once in Cowork on Notion to answer the Cowork-specific unknowns. Every run is logged in a scratch file as it goes (skill, backend, calls, seconds, outcome) and summarized into CW5 at the end. A failure is first classified (binding wording, contract gap, connector limit) and fixed in place when it is small; a contract gap gets its own `ISSUE###.md` in this repo's `.plans/`.

---

## 3. Invariants & Scope

**Invariants this must respect:** plan-first (the runs are real skill runs, so each proposes and waits; batch the approvals); the release checklist for any fix; `.plans/` notes stay in the plugin repo, verdicts in CW5.

**Out of scope:** new backends; performance work beyond noting numbers; the StoryStormer backend (tested in AP4 once it exists).

---

## 4. Verification

The success criteria are the verification. Expected outcome: Notion and local pass clean; Dropbox passes with at most wording fixes to the confirmation clause; the migration ring diffs clean; the Cowork answers are recorded either way. If Dropbox nags per file after a wording fix, demote it to Tier 3 and say so in CW5 and the README.

**Dependencies:** SB4 on `main`; Dropbox and Notion connectors in the Claude Code session; a Cowork session with the same connectors; a copied real project.
