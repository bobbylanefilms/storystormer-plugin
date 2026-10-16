<!-- ABOUTME: Handoff note: treatment-update's hard act budget conflicts with its no-invention rule on a thin first run -->
<!-- ABOUTME: Found by the SB3 Notion end-to-end run (2026-10-16); needs Rob's product call -->

# ISSUE070: First-run treatment budget vs. the no-invention rule

**Needs Rob:** yes

## Problem

`skills/treatment-update/SKILL.md` makes the act-level word budget a **hard constraint** (each act within ±15% of its computed share of `target_word_count / 6`), and separately forbids content that doesn’t trace to the sources (decisions, bios, worldbuilding, intake). On a first run from a thin project (the SB3 test: a three-sentence brain dump and two decisions, target 40,000 words → a 6,667-word treatment budget), both rules can’t hold: hitting the budget means inventing, and not inventing means missing the budget by thousands of words.

**Repro:** a new project at `brain-dump` with two decisions, `target_word_count: 40000`; run `treatment-update`. A literal model either pads with untraceable plot (the SB3 tester’s 3,870-word treatment “goes beyond the sources”) or stops on the budget.

## Why it matters

Every new project hits this on its first treatment. The model resolves it differently each session, which is exactly what the skills are meant to prevent.

## Suggested approach

In first-run mode (and whenever the sources can’t fill the budget), the budget becomes a **ceiling**: write what the sources support, and fill each act’s gap with `[NEEDS DEVELOPMENT: …]` markers sized to the shortfall, so the treatment shows where the story is thin rather than hiding it. The report says “Act 2 is 1,200 words under budget; 4 markers.”

**Alternatives:** (a) scale the budget by the decision count or stage (`brain-dump` → a fraction); (b) let first-run mode invent, flagged with a marker per invented beat (more readable output, more cleanup for the author).

## Files

- `skills/treatment-update/SKILL.md`: the budget rule (around the “Act-level budget (hard constraint)” bullet) and the no-invention rule (substantive mode).
- `references/file-schemas.md` § Target word count and the derived budgets; § `treatment.md` → Markers for unresolved elements.
