# TeenSim Update Plan

Purpose

This document captures the proposed improvements to the TeenSim weekly-outline system after running through Week 15. These are proposed system updates for review, not live rule changes yet.

The goal is to improve operability without weakening the current strengths of TeenSim: character-first weekly play, calendar continuity, Spark pressure, and the Generation = Draft + Playtest + Fold workflow.

## Design Principles

- Preserve the current narrative-first style. These updates should add clarity, not turn TeenSim into a spreadsheet.
- Improve auditability. Hard continuity and Spark legality should be checkable in seconds.
- Keep weekly files skimmable. Rich prose can stay, but mechanical truth should be easier to find.
- Keep the tracker sustainable. `Character_memories.md` should remain useful across many weeks, not just the early run.
- Add regular maintenance. The system should pause every 4 weeks to compact, refresh, and re-center active story pressure.

## Executive Summary

The proposed update package has seven parts:

1. Add a short `Continuity Guardrails` block to each weekly outline.
2. Add a compact `Open Loops` section to `Character_memories.md`.
3. Compress tracker history into rolling windows instead of endlessly expanding `Recent` lines.
4. Add a per-week Spark ledger for fast mechanical auditing.
5. Add a short week-finalization plausibility checklist.
6. Separate each week's thematic prose from its operational engine.
7. Add a formal maintenance and compaction pass every 4 weeks.

## What Must Stay The Same

Do not change:

- Week = Session
- 3 to 5 Main Stories and 2 to 4 Sub Stories as the working weekly structure
- Generation = Draft + Playtest + Fold
- The current Spark cap and cooldown concept
- Character-first scene design
- Readable Markdown as the primary format

These updates should clarify the system, not replace it.

## What Needs Improvement

By Week 15, the system is doing its core job well, but the maintenance burden is increasing.

Current pressure points:

- Continuity repair is still too manual.
- Weekly files are readable, but hard facts are sometimes buried in prose.
- Spark state exists, but is not yet exposed in the fastest possible way.
- `Character_memories.md` is beginning to thicken into long-form recap instead of a fast operational tracker.
- There is not yet a formal cadence for stepping back and compressing the last block of weeks.

## Proposed Changes In Detail

### 1. Continuity Guardrails Per Week

Add a short section to each weekly outline that records only hard continuity facts.

Suggested fields:

- Entering Week: what must already be true
- Cannot Contradict: timeline, location access, relationship state, cooldown state, known secrets, public knowledge state
- Newly True By End: what becomes canon after the week's playtest resolves

Why:

- Reduces continuity drift
- Makes repair work faster when a canon date changes
- Gives the SM a factual frame before reading the full week

Operational note:

- This section should stay short. It is a guardrail block, not a second summary.

### 2. Open Loops In Character Tracker

Add a compact `Open Loops` section near the top of `Character_memories.md`.

Suggested content:

- Secret admirer poem thread
- June/Nikole visibility progression
- Kate/Martin/Jayden tension
- W.E.I.R.D. pressure and meaning
- Band identity / rehearsal / Talent Show trajectory
- Family-pressure or town-pressure threads that still shape week generation

Why:

- Keeps unresolved arcs visible without searching long character histories
- Makes it easier to build the next week around active pressure instead of only recent events
- Helps prevent important threads from cooling by accident

Operational note:

- Each loop should be one short bullet naming the thread and its current state, not a mini-essay.

### 3. Rolling Character History Windows

Refactor each tracker entry so it stays compact and operational.

Suggested character structure:

- Role
- Goal(s)
- Long-Arc Pattern: one sentence describing the character's durable Grade 9 pressure
- Recent Window: last 3 to 5 material beats only
- Plans/Focus: active next pressures the SM should seed or respect

Why:

- Stops `Recent` from becoming a wall of text
- Keeps the tracker readable at a glance
- Preserves continuity without turning the tracker into a second narrative draft

Retention policy:

- Older detail should not be deleted from the repo entirely.
- Weekly files remain the canonical deep history.
- Every-4-weeks review files become the compact bridge between weekly detail and the live tracker.

### 4. Weekly Spark Ledger

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

Operational note:

- This ledger should be a dedicated block, not scattered across scene outcomes.

### 5. Week Finalization Plausibility Check

Add a small checklist to use before a week is considered complete.

Suggested checks:

- Timeline/date check: do dates align with the canon calendar?
- Location access check: are locations actually available on that day and at that time?
- Cast availability check: can the listed characters realistically be present?
- Spark legality check: are cooldowns and the weekly Spark cap valid?
- Fold check: has `Character_memories.md` been updated in the same pass?
- Open-loop check: does the week advance, hold, or intentionally cool the major active threads?

Why:

- Catches practical logic errors earlier
- Reduces repair passes after generation
- Makes the workflow more reliable as the story gets denser

Operational note:

- A weekly file should not be treated as complete until this checklist is true.

### 6. Separate Theme From Engine

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

Operational note:

- This block should sit near the top of the weekly file so the intent of the week is visible immediately.

### 7. Every-4-Weeks Update Pass

Add a formal maintenance pass every 4 weeks.

Timing:

- Run this after Week 4, Week 8, Week 12, Week 16, and so on

Purpose:

- Compact the tracker
- Summarize the last 4 weeks of material change
- Refresh active open loops
- Confirm Spark and cooldown state is clean
- Reassess which arcs are hot, cooling, or complete
- Create a cleaner starting point for the next 4-week block

Recommended output:

Create a short 4-week review file containing:

- Arc Summary: what materially changed in the last 4 weeks
- Character State Shifts: who changed and how
- Open Loops Refresh: which unresolved threads remain active
- Mechanical Audit: Spark and cooldown summary, plus any rules issues found
- Carry Forward Priorities: what the next 4-week block should emphasize

Recommended cadence:

- Do the review immediately after completing the Week 4, 8, 12, 16, etc. tracker fold
- Then compact the live tracker using that review as the boundary line

Recommended naming convention:

- `Grade_9-Weeks_01-04_Review.md`
- `Grade_9-Weeks_05-08_Review.md`
- `Grade_9-Weeks_09-12_Review.md`
- `Grade_9-Weeks_13-16_Review.md`

Why:

- Prevents long-term tracker bloat
- Creates clean story phases inside the school year
- Makes future week generation faster and more accurate
- Preserves continuity while allowing the live tracker to stay compact

## Recommended Weekly Outline Shape After Update

The weekly template should remain readable and narrative-first, but gain a clearer operational spine.

Recommended top-level shape:

- Week title
- Dates / Anchor / Week Summary
- Operational Snapshot
- Continuity Guardrails
- Optional Week Flow
- Main Stories
- Sub Stories
- Group Scene
- Twists And Pressure
- Spark Ledger
- Character Memory Updates
- Finalization Checklist

This preserves the current feel of the files while making them easier to run and audit.

## Recommended Tracker Shape After Update

`Character_memories.md` should remain the live operational tracker, but with clearer separation between active state and deep history.

Recommended top-level order:

- Current Cooldown State
- Next Calendar Beats
- Open Loops
- Main Characters
- Supporting / Tertiary Characters
- History / Update Log
- References to every-4-weeks review files, if used

This keeps immediate operational truth near the top and pushes long-tail history lower.

## Migration Policy

To keep implementation practical, apply the new structure going forward instead of trying to fully rebuild everything at once.

Recommended migration rule:

- Update `TeenSim.MD` first
- Update the weekly template second
- Update `Character_memories.md` structure third
- Apply the new format to new weekly outlines from that point onward
- Backfill older weeks only when a continuity repair or major audit actually requires it

This keeps the rollout clean and avoids unnecessary rewrite work.

## Recommended Implementation Order

1. Update `TeenSim.MD` to record the new system rules and maintenance cadence.
2. Update the weekly template to include:
    - Operational Snapshot
    - Continuity Guardrails
    - Spark Ledger
    - Finalization Checklist
3. Update `Character_memories.md` to include:
    - Open Loops
    - Rolling character windows
    - a clearer separation between live state and log history
4. Define and create the every-4-weeks review format.
5. Apply the revised structure going forward.
6. Backfill only where continuity or usability demands it.

## Risks And How To Avoid Them

- Risk: over-structuring the system until the files feel mechanical.
   - Avoid by keeping every new block short and operational.
- Risk: duplicate information between weekly files, tracker, and review files.
   - Avoid by treating weekly files as deep detail, the tracker as live state, and 4-week reviews as compaction summaries.
- Risk: adding maintenance steps that feel optional and then get skipped.
   - Avoid by treating the finalization checklist and every-4-weeks review as part of completion, not extras.
- Risk: backfill work becoming a time sink.
   - Avoid by using forward adoption as the default.

## Definition Of Done

This update package should be considered successful if all of the following are true:

- A future weekly outline can be audited faster than the current format
- Spark legality can be checked at a glance
- Hard continuity facts are visible without rereading whole summaries
- `Character_memories.md` remains readable after many more weeks
- The every-4-weeks review creates a clear reset point instead of accumulating noise
- The system still reads like TeenSim rather than a raw production database

## Review Decisions Still Needed

Before implementation, confirm:

- whether the every-4-weeks review should live as its own file only, or also be summarized in `Character_memories.md`
- whether the weekly template should be updated at the same time as `TeenSim.MD`
- whether the current tracker should be compacted immediately or only when the next 4-week boundary is reached
