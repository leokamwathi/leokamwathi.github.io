# TeenSim Update Plan

Purpose

This document captures the proposed improvements to the TeenSim weekly-outline system after running through Week 15. These are system updates for review, not live rule changes yet.

Goals

- Keep the current strengths: character-first weekly play, calendar continuity, Spark pressure, and the draft-playtest-fold loop.
- Reduce manual continuity repair work.
- Make weekly files faster to audit and easier to run.
- Keep the tracker scalable as the story moves deeper into Grade 9 and beyond.
- Add a regular compaction rhythm every 4 weeks so the system stays readable over time.

## Summary Of Proposed Changes

1. Add a short `Continuity Guardrails` block to each weekly outline.
2. Add a compact `Open Loops` section to the tracker.
3. Compress tracker history into rolling windows instead of endlessly growing `Recent` blocks.
4. Add a per-week Spark ledger for fast mechanical auditing.
5. Add a short plausibility checklist before a week is finalized.
6. Separate each week's thematic prose from its operational engine.
7. Add an every-4-weeks compaction/update pass.

## Proposed Changes In Detail

### 1. Continuity Guardrails Per Week

Add a short section to each weekly outline that records only hard continuity facts.

Suggested fields:

- Entering Week: what must already be true
- Cannot Contradict: timeline, location access, relationship state, cooldown state, known secrets
- Newly True By End: what becomes canon after playtest

Why:

- Reduces continuity drift
- Makes repair work faster when a canon date changes
- Gives the SM a quick factual frame before reading the full week

## 2. Open Loops In Character Tracker

Add a compact `Open Loops` section near the top of `Character_memories.md`.

Suggested content:

- Secret admirer poem thread
- June/Nikole visibility progression
- Kate/Martin/Jayden tension
- W.E.I.R.D. pressure and meaning
- Band identity / rehearsal / talent-show trajectory
- Any active family-pressure or town-pressure threads

Why:

- Keeps unresolved arcs visible without searching long character histories
- Makes it easier to build the next week around active pressure instead of only recent events
- Helps prevent important threads from cooling by accident

## 3. Rolling Character History Windows

Refactor each character entry so it stays compact.

Suggested character structure:

- Role
- Goal(s)
- Long-Arc Pattern: one sentence
- Recent Window: last 3 to 5 material beats only
- Plans/Focus: active next pressures

Why:

- Stops `Recent` from becoming a wall of text
- Keeps the tracker readable at a glance
- Preserves continuity without turning the tracker into a second narrative draft

Note:

- Older detail should not be deleted from the repo entirely; it can remain recoverable through weekly files and periodic 4-week summaries

## 4. Weekly Spark Ledger

Add a compact Spark block to each weekly outline.

Suggested fields:

- Entering Cooldown
- Spark-Eligible This Week
- Sparks Spent This Week
- Cooldown Next Week

Why:

- Makes Spark state auditable in seconds
- Reduces the chance of rule mistakes
- Separates mechanical truth from scene prose

## 5. Week Finalization Plausibility Check

Add a small checklist to use before a week is considered done.

Suggested checks:

- Timeline/date check: do dates align with canon calendar?
- Location access check: are locations actually available that day/time?
- Cast availability check: can the listed characters realistically be there?
- Spark legality check: are cooldowns and weekly cap valid?
- Tracker fold check: has `Character_memories.md` been updated in the same pass?

Why:

- Catches practical logic errors earlier
- Reduces repair passes after generation
- Makes the workflow more reliable as the story gets denser

## 6. Separate Theme From Engine

Keep the current rich week summary, but add a short operational block that states the week's structural purpose plainly.

Suggested fields:

- Main Pressure
- Who Changes This Week
- Who Is Restricted This Week
- What Advances
- What Stays Unresolved

Why:

- Helps the SM run the week faster
- Prevents elegant prose from hiding missing mechanics or weak progression
- Makes each outline easier to skim during revision

## 7. Every-4-Weeks Update Pass

Add a formal maintenance pass every 4 weeks.

Timing:

- Run this after Week 4, Week 8, Week 12, Week 16, and so on

Purpose:

- Compact the tracker
- Summarize the last 4 weeks of material change
- Refresh active open loops
- Confirm cooldown/mechanical state is clean
- Reassess which arcs are hot, cooling, or complete

Suggested output:

Create a short 4-week review file or section containing:

- Arc Summary: what materially changed in the last 4 weeks
- Character State Shifts: who changed and how
- Open Loops Refresh: which unresolved threads remain active
- Mechanical Audit: Spark/cooldown summary and any rules issues found
- Carry Forward Priorities: what the next block of weeks should emphasize

Why:

- Prevents long-term tracker bloat
- Creates clean story phases inside the school year
- Makes future week generation faster and more accurate

## Recommended Implementation Order

1. Update the weekly template to include:
   - Continuity Guardrails
   - Spark Ledger
   - Operational block
   - Finalization checklist
2. Update `Character_memories.md` structure to include:
   - Open Loops
   - Rolling Recent Window format
3. Define the every-4-weeks review format
4. Apply the revised structure going forward
5. Optionally backfill the new format into earlier weeks only if needed

## Scope Guidance

These changes should improve operability without removing the current strengths of the system.

Do not change:

- The week-as-session model
- The draft + playtest + fold workflow
- The Spark cap / cooldown idea
- The character-first scene design philosophy
- The current emphasis on readable Markdown rather than raw data formatting

Do change:

- How quickly continuity can be checked
- How compactly tracker state is stored
- How clearly mechanical state is exposed
- How often the system pauses to compact and reassess itself

## Success Criteria

The update should be considered successful if:

- A future weekly outline can be audited faster
- Spark legality can be checked at a glance
- Continuity repairs become rarer and easier
- `Character_memories.md` stays useful past many more weeks
- Every 4 weeks, the system produces a cleaner new starting point instead of accumulating noise

## Review Question

Before implementation, confirm:

- whether this should update only `TeenSim.MD`
- whether the weekly template should change at the same time
- whether the every-4-weeks review should live in its own file, a tracker section, or both
