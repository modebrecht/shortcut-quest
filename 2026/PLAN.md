# Shortcut Quest 2026 — TK2 A8 Plan

Goal: keep the existing Shortcut Quest RPG loop (coins, shop, inventory, skills, battles, report) but rebuild the learning path for TK2 2026 so A8 is a game-based transfer/mastery module rather than a second copy of A7.

## Non-negotiables

- [ ] Keep the existing RPG/meta systems: coins, shop, inventory, skills, battles, progression and report.
- [ ] Do not modify the current root version; all TK2 2026 work lives in `/2026/`.
- [ ] A8 introduces no new shortcut content that was not taught in TK2 A1–A7.
- [ ] Remove all Memory sections from the 2026 learning path because A7 already contains Memory as a required station.
- [ ] Repetition is allowed only when the retrieval mode or context changes meaningfully.
- [ ] Avoid near-identical duplicate sections.
- [ ] Keep the course long enough for the RPG systems to matter: target roughly 24–30 learning sections.
- [ ] Difficulty should rise from recognition -> recall -> contextual choice -> mixed retrieval -> time pressure -> mastery.

## Content audit

- [ ] Remove Memory sections 3, 7 and 33.
- [ ] Remove obvious copy/repeat sections such as the late duplicate input rounds (31, 32, 51, 52, 53) unless one is repurposed into a harder mixed-recall task.
- [ ] Collapse duplicate navigation puzzles (for example 25 / 42) into one stronger version.
- [ ] Collapse overlapping system/combo builders (22, 23, 28, 37, 43, 48) into a smaller set of distinct builders.
- [ ] Reduce repeated story scenes (11, 12, 27, 34, 36, 38, 39, 41, 44, 46, 54) to a smaller set with genuinely different contexts.
- [ ] Reduce Fast-Paced variants (10, 20, 30, 40, 50, 55) to a progression of distinct speed challenges.
- [ ] Reduce duplicate Drag & Drop variants (8, 9, 18, 19, 21, 35, 42, 47) to a smaller set of mixed-difficulty challenges.
- [ ] Remove or replace shortcut items not covered by TK2 A1–A7.

## Target 2026 learning path

### Phase 1 — Recall foundation
- [ ] 01 Warm-up recall: general shortcuts.
- [ ] 02 Browser & tab recall.
- [ ] 03 Windows basics recognition.
- [ ] 04 AltGr / special-character retrieval.
- [ ] 05 Mixed typed recall.

### Phase 2 — Association and construction
- [ ] 06 Drag & Drop: general shortcuts.
- [ ] 07 Drag & Drop: browser/program shortcuts.
- [ ] 08 Drag & Drop: Windows shortcuts.
- [ ] 09 Combo Builder: general/browser.
- [ ] 10 Combo Builder: Windows/system.

### Phase 3 — Context transfer
- [ ] 11 Scenario: school document workflow.
- [ ] 12 Scenario: browser research workflow.
- [ ] 13 Scenario: presentation / classroom workflow.
- [ ] 14 Scenario: window-management workflow.
- [ ] 15 Scenario: stuck app / system workflow.

### Phase 4 — Mixed retrieval
- [ ] 16 Shortcut Shuffle I.
- [ ] 17 Shortcut Shuffle II.
- [ ] 18 Navigation puzzle.
- [ ] 19 System quick access.
- [ ] 20 Mixed no-hint recall.

### Phase 5 — Speed and pressure
- [ ] 21 Fast-Paced Basics.
- [ ] 22 Fast-Paced Browser + Program.
- [ ] 23 Fast-Paced Windows.
- [ ] 24 Error-resistant mixed challenge.

### Phase 6 — Mastery / RPG payoff
- [ ] 25 Advanced mixed Combo Builder.
- [ ] 26 Real-world mixed scenario gauntlet.
- [ ] 27 Mastery sprint.
- [ ] 28 Final mastery / boss gate.

## RPG / UX integration

- [ ] Keep coins as the reward for learning actions.
- [ ] Keep shop purchases meaningful across the 28-section progression.
- [ ] Keep inventory/equipment and skills functional.
- [ ] Keep battles, but place them as payoff/progression beats instead of learning substitutes.
- [ ] Ensure learning progress still unlocks the next relevant content/battle cleanly.
- [ ] Keep report/statistics, but do not duplicate A7's formal training-evidence role.
- [ ] Add a clear 2026/TK2 identity in the UI so students know this is A8.
- [ ] Add a concise completion state suitable for the TK2 diligence-grade workflow.

## QA

- [ ] Verify every retained shortcut belongs to the current TK2 A1–A7 content set.
- [ ] Verify no Memory mode remains in the 2026 path.
- [ ] Verify all 28 sections can be unlocked and completed.
- [ ] Verify coins, shop, inventory, skills and battles still work after the content reduction.
- [ ] Verify localStorage does not collide destructively with the old root version.
- [ ] Verify the 2026 version loads correctly from `/2026/` with all relative asset/script paths working.
- [ ] Smoke-test desktop interaction and the core completion loop.
