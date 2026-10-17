<!-- ABOUTME: Handoff note: the treatment act budget becomes a ceiling, not a target; plugin side done, app prompt still to align -->
<!-- ABOUTME: Found by the SB3 Notion end-to-end run (2026-10-16); decided with Rob the same day -->

# ISSUE070: Treatment act budget as a ceiling

**Status:** plugin side done (SB3, `0.19.0-poc`); the web app’s prompt still carries the old wording.

## Problem

Both the plugin’s `treatment-update` skill and the app’s Treatment Agent prompt say:

> **Act-level budget (hard constraint):** Each act’s treatment content must stay within ±15% of its derived allocation.

Two rules below that, both also say “Early development: size by what’s developed” and “Never pad.” The ±15% band reads as a floor as well as a ceiling, so on a thin project a literal model either pads with invented material or breaks the “hard constraint.” The SB3 Notion test (a three-sentence brain dump, two decisions, 40,000-word target) produced a treatment that went beyond its sources. The test brief, which asked for ~4,000 words, pushed it too.

## History (Rob, 2026-10-16)

The budget was added as a **ceiling**. In early app testing, with only Act One developed and flimsy material for Acts Two and Three, the agent drafted around 15,000 words by expanding Act One toward prose. The budget kept that in check: with only Act One developed, the treatment should be a few thousand words. The floor half of “±15%” was never the point.

## Decision (Rob, 2026-10-16)

The budget is a ceiling plus markers; the plugin and app must use the same wording.

## Shared wording (plugin as built; use verbatim in the app)

> **Act-level ceiling (hard constraint):** No act’s treatment content may run more than 15% over its computed share. The share is a ceiling, not a target: an act whose material is fully decided lands near it; an act with thin or no decided material is sized by what the decisions support (Early development, below), with its gaps marked, and can sit far under. Never expand a developed act toward near-prose to make up for an undeveloped one. Scenes within an act can vary, but the act total is the constraint.

The app prompt uses its own marker name (“For Further Development”); keep that, and say “rule 3” where the plugin says “Early development, below”.

## App-side change

- **File:** `~/Git/storystormer/lib/background-jobs/handlers/treatment-update-prompts.ts`, § WORD BUDGET → Enforcement rules, rule 1 (around line 615). Replace it with the shared wording. Rules 2–5 stay; rule 4’s “expand proportionally toward the budget, not beyond it” already agrees.
- **Check:** whether this prompt is versioned or seeded into the database (the primer prompt carries a version, e.g. CL59’s “primer prompt v2.0.0”); bump it the way that repo does.
- **Also:** grep the app for other copies of “hard constraint” / “±15%” in treatment prompts (`lib/prompts/defaultPromptContent.ts`, `seedPrompts.ts`).
- **Primer:** no change. Both sides already frame the primer’s ~4,500 words as a target under a 5,000 ceiling, and first-run sections without sources get “For Further Development.”

## Plugin files changed (for reference)

- `skills/treatment-update/SKILL.md`: the act-budget bullet; the report example now states an act that sits well under its share.
- `references/file-schemas.md` § Target word count and the derived budgets: the treatment-budget line.
- `README.md` (v0.19.0 changelog) and `guides/developing-your-story.md`: author-facing lines.
