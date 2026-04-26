# TeenSim — A DnD-Style Slice‑of‑Life School Simulator

Purpose

This file defines the TeenSim system: a lightweight, narrative-first, DnD‑style framework for running the "Chaos Order" characters as players (MCs) and the rest of the cast as NPCs. Each in‑game week is one session composed of 3–5 Main Stories (MS) and 2–4 Sub Stories (SS). The Story Master (SM) runs the world, creates twists, and adjudicates simple mechanics.

Roles

- SM (Story Master): Runs the week, sets hooks, rolls twists, and adjudicates results. Think GM + narrative editor.
- MC (Main Characters): The player-controlled protagonists (PCs). Each MS centers on one or more MCs.
- NPC (Supporting/Tertiary Characters): Short scenes, sources of complications, allies, rivals, or world color.

Core Principles

- Week = Session: Each week/session must contain 3–5 MS and 2–4 SS.
- MS: Drive MC growth; pose puzzles/choices that reward creativity and emotional truth.
- SS: Spotlight NPCs and keep the town alive; these can seed MS complications.
- Generation = Draft + Playtest: when generating a weekly outline, resolve the scenes in the same pass and write the playtest result directly into the weekly file instead of treating playtest as a separate later step.
- Generation = Draft + Playtest + Fold: the same generation pass should also fold that week's resolved results into `Character_memories.md` before moving on to the next week.
- Operational Clarity: weekly files should expose hard continuity facts, active pressure, and Spark state without hiding them only inside long prose.
- Maintenance Cadence: after every 4 completed weeks, run a short review-and-compaction pass so the live tracker stays readable.
- Twist-Friendly: SM should add 1–2 unexpected twists per week to force MCs to improvise.
- Safety & Consent: Avoid exploitative content; flag heavy topics and use content warnings.

Weekly Structure (recommended)

1. Anchor (10 minutes): SM sets the week’s tone + one town beat.
2. MS 1–3 (or up to 5): Longer scenes, ~15–25 minutes each. Each MS focuses on one MC (primary) with optional shared beats.
3. SS 2–4: Short, 5–12 minute vignettes focusing on NPCs or side-tracks.
4. Group Scene (10 minutes): A shared scene that ties threads or creates a cliffhanger.
5. Downtime / Player Debrief (5–10 minutes).

Compact Weekly Outline Format

Weekly outlines should be readable first and compact second. They are planning documents for humans, not raw data dumps. Every weekly file should include:

- Week ID and date range.
- Anchor: one-line tone or town beat.
- Week Summary: a short paragraph explaining what happened across the week.
- Operational Snapshot: main pressure, who changes, who is restricted, what advances, and what remains unresolved.
- Continuity Guardrails: short factual notes for what must already be true entering the week, what the week cannot contradict, and what becomes newly true by week end.
- Optional Week Flow: a short day-by-day list when timing matters.
- For each MS and SS: day/date, location, focus character, other characters present, hook, stakes, and a fuller summary of what actually happens.
- For each MS and SS in generated weeks: include a `Playtest Outcome` line so the draft already contains the simulated result.
- Group Scene: day/date, location, present characters, and cliffhanger/payoff summary.
- Twists and Pressure: active twist logic and what pressures the week is built to test.
- Spark Ledger: who is entering on cooldown, who is Spark-eligible, who spends, and who is on cooldown next week.
- Character memory updates: short lines to carry forward into `Character_memories.md`.
- Finalization Checklist: a short plausibility and legality check before the week is treated as done.
- Generated weeks should be considered incomplete until the matching tracker fold has been written into `Character_memories.md` and the finalization checklist is true.

The goal is not to recreate the old chapter outlines. The goal is to make each weekly outline readable like a session log: structured, skimmable, and rich enough to preserve continuity without becoming a chapter draft.

Recommended Markdown Shape

Use real Markdown sections instead of packing everything into one line. A good weekly outline should read like this:

- `#` title for the week.
- Short setup block for dates, anchor, and week summary.
- `## Operational Snapshot`.
- `## Continuity Guardrails`.
- Optional `## Week Flow` section with 1-line timing notes.
- `## Main Stories` with `### MS1`, `### MS2`, and so on.
- `## Sub Stories` with `### SS1`, `### SS2`, and so on.
- `## Group Scene`.
- `## Twists and Pressure`.
- `## Spark Ledger`.
- `## Character Memory Updates`.
- `## Finalization Checklist`.

This format is slightly larger, but much easier to scan during planning, revision, and continuity checks.

Scene Template (use per MS/SS)

- Title: Short name
- Day/Date: When it happens in the week
- Location: Primary location
- Focus: Primary character(s)
- Cast: Other characters present or affected
- Hook: What pulls the MC into the scene?
- Stakes: What matters if they fail/succeed?
- Summary: one short paragraph or 2 short bullets explaining what actually happens in the beat
- Approach/Skill: How can the MC attempt to solve this? (e.g., talk, plan, improvise)
- DC (Difficulty): Simple: Easy / Medium / Hard mapped to dice outcomes
- Twist (optional): A small, believable complication
- Playtest Outcome: Success / Partial / Fail and narrative fallout
- MemoryTag: Short carry-forward tag for continuity

Operational Snapshot (use once per week)

- Main Pressure: what the week is really testing
- Who Changes This Week: the characters expected to move materially
- Who Is Restricted This Week: cooldowns, secrecy limits, access limits, or social constraints
- What Advances: the active thread(s) that move forward
- What Stays Unresolved: the pressure intentionally carried into later weeks

Continuity Guardrails (use once per week)

- Entering Week: what must already be true
- Cannot Contradict: canon date, location access, relationship/public-knowledge state, Spark cooldown state
- Newly True By End: what becomes canon after playtest

Resolution Mechanics (lightweight)

- Roll: 1d6.
- Modifiers: SM may grant +1 for clever prep or strong relationships (avoid stacking beyond +2).
- Results:
  - 5–6: Success
  - 3–4: Partial success (gets something, but with cost/complication)
  - 1–2: Fail (or success with significant cost)
- Sparks (player resource): Each MC has 2 Sparks available when not on cooldown. Spending 1 Spark adds +1 to a roll; spending 2 Sparks allows a reroll (keep higher result).
- Weekly Spark cap: only 2 MCs total may spend Sparks in a given week.
- Spark cooldown: if an MC spends any Sparks in a week, that MC cannot spend Sparks in the following week.
- Playtest expectation: when drafting a week, the SM should decide whether either of the two Spark slots gets used and show that in the generated weekly file.
- Spark ledger expectation: each generated week should surface `Entering Cooldown`, `Spark-Eligible This Week`, `Sparks Spent This Week`, and `Cooldown Next Week` in one dedicated block.
- Folding expectation: after drafting and resolving the week, immediately update `Character_memories.md` with top-level Recent/Plans changes, the weekly log block, and the next-week cooldown state.

Why this system?

- Fast adjudication keeps the game moving and favors narrative invention.
- Sparks create tactical choices and make player agency tangible without heavy bookkeeping.
- The weekly cap and cooldown keep Spark use special, characterful, and easy to track across school weeks.
- Operational guardrails keep a long-running school-year story readable and repairable without flattening its voice.

Twist Table (SM roll 1d6 when needing escalation)

1. Rumor leaks: A private detail becomes public.
2. Unexpected ally: An NPC helps—at a price.
3. Equipment/moment fails: A prop or plan breaks.
4. Small accident: Minor injury or setback increases stakes.
5. Rival escalation: A rival intentionally complicates things.
6. Serendipity: Good luck opens an unexpected option.

MC & NPC Behavior Guidance

- SM should aim to create puzzles that reward lateral thinking, not just brute force.
- NPCs have short agendas (1–2 lines): what they want now, why they care, what they'd accept.
- Keep NPCs human: give them micro‑needs (coffee, approval, revenge) that intersect with MC goals.

Example Week (template filled)

For brevity, the mini example below omits the full `Operational Snapshot`, `Continuity Guardrails`, `Spark Ledger`, and `Finalization Checklist` blocks. Production weekly files should include them.

### MS1 — Band Tryouts

- Day/Date: Friday Sept 1
- Location: Waterfall High music room
- Focus: June
- Cast: Alex, Dex, Ms. Vale
- Hook: The band needs a new arrangement.
- Stakes: Talent show slot.
- Summary: June claims a visible arranging role, clashes lightly with Alex over sound, and leaves with a fragile rehearsal plan that only exists because she spoke before fear caught up to her.
- DC: Medium
- Twist: Key instrument goes missing.
- MemoryTag: +band-formation

### SS1 — Bakery Rush

- Day/Date: Saturday morning
- Location: Mariposa Bakery
- Focus: Tracy
- Cast: Diana, customers
- Hook: A surprise order surge.
- Stakes: Rehearsal attendance.
- Summary: Tracy keeps the bakery running, absorbs customer stress, and quietly loses time she meant to spend on herself.

### Group Scene

- Day/Date: Wednesday evening
- Location: Abandoned rehearsal room
- Cast: June, Dex, Kate, Tracy, Martin, Alex
- Summary: rehearsal stalls, a rumor lands at the worst moment, and the band survives only because nobody walks out.

How to Run a Session (practical)

1. Prep 1–2 hours max: draft the Anchor, active open loops, continuity guardrails, MS hooks, 2 SS, and 6 twist lines.
2. Start with Anchor and define the week's Operational Snapshot.
3. Run MS scenes in player order; let MCs spend Sparks to tilt stakes, but allow no more than 2 MC Spark users that week.
4. Use the Twist table sparingly—twists should force choice, not punishment.
5. Resolve the week during generation by writing `Playtest Outcome` lines directly into each scene that matters.
6. Record the Spark Ledger in the weekly file before finishing the week.
7. Fold the resolved week into `Character_memories.md` before ending the generation pass.
8. Run the Finalization Checklist so dates, locations, cast availability, Spark legality, and tracker fold are all confirmed.
9. End with a clear consequence and a small reward (XP is narrative: new ally, new clue, stronger trust), then note any Spark cooldowns for next week.

Week Finalization Checklist

Treat a generated week as incomplete until all of the following are true:

- Timeline/date check: dates align with the canon calendar.
- Location access check: locations are actually available when used.
- Cast availability check: listed characters can realistically be present.
- Spark legality check: weekly cap and cooldown state are valid.
- Fold check: `Character_memories.md` was updated in the same pass.
- Open-loop check: major active threads were advanced, intentionally held, or intentionally cooled.

Safety, Tone, and Boundaries

- Flag sensitive topics ahead of the session.
- SMs must avoid using heavy trauma as a punchline; use content warnings and offer opt-outs.
- Keep scenes consent-aware: relationships and intimate beats require explicit player buy‑in.

Next Steps (for the repo)

- Use this file as the canonical TeenSim rules.
- SMs can copy the Example Week into `Part_1/Outlines` as playtest sessions.

Character memories (live tracker)

Create and maintain `Part_1/Outlines/Weekly_Outlines/Character_memories.md` as the canonical, week-to-week log of what each character has done and is planning next. After each weekly outline or playtest:

- Keep the top of the file operational: current cooldown state, next calendar beats, and an `Open Loops` section for unresolved active threads.
- Use compact character entries with `Role`, `Goal(s)`, `Long-Arc Pattern`, `Recent`, and `Plans/Focus`.
- Keep `Recent` as a rolling window of the last 3–5 material beats instead of a full-year recap.
- Update the character's `Recent` and `Plans/Focus` lines.
- Tag entries with the week id (e.g., `Grade_9-Week_01`) for quick lookup.
- If Sparks were spent, note who used them and who is on cooldown for the next week.
- Do this during weekly generation, not as a later cleanup step.

Every-4-Weeks Review And Compaction Pass

After every 4 completed weeks, run a short review pass after the weekly fold is complete.

- Timing: after Week 4, Week 8, Week 12, Week 16, and so on.
- Purpose: summarize the last 4 weeks of material change, refresh active open loops, audit Spark state, and compact the live tracker.
- Output: create a short review file with `Arc Summary`, `Character State Shifts`, `Open Loops Refresh`, `Mechanical Audit`, and `Carry Forward Priorities`.
- Naming convention: `Grade_9-Weeks_01-04_Review.md`, `Grade_9-Weeks_05-08_Review.md`, and so on.
- Compaction rule: weekly files remain the deep history; the review file becomes the bridge summary; the live tracker should stay focused on current operational state.

Compact weekly outline templates and canon files

- Use `Part_1/Outlines/Weekly_Outlines/Week_Template.md` as the compact outline format and update it to reflect the current TeenSim structure.
- Use `Part_1/Outlines/Weekly_Outlines/<Grade>_Week_<NN>.md` for weekly outlines and playtests.

— end —
