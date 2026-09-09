# Shortcut Quest 2026 — TK2 A8 Plan

Goal: keep the existing Shortcut Quest RPG loop (coins, shop, inventory, skills, battles, report) but rebuild the learning path for TK2 2026 so A8 is a game-based transfer/mastery module rather than a second copy of A7.

## Non-negotiables

- [x] Keep the existing RPG/meta systems: coins, shop, inventory, skills, battles, progression and report.
- [x] Keep TK2 game changes isolated in `/2026/`; the legacy root game stays preserved.
- [x] A8 introduces no new shortcut content that was not taught in current TK2 A1–A7.
- [x] Remove all Memory sections from the 2026 learning path because A7 already contains Memory as a required station.
- [x] Repetition is allowed only when retrieval mode, context or difficulty changes meaningfully.
- [x] Avoid near-identical duplicate sections.
- [x] Use exactly 30 learning sections so the RPG loop has enough runway.
- [x] Raise difficulty from recall/recognition through construction and workflow transfer to mixed retrieval, pressure and mastery.

## New 2026 mechanic — Workflow Chains

Memory is not replaced by another matching game. **Workflow Chains** ask students to solve a real workflow by choosing several complete shortcuts in the correct order.

Example:

`Neuer Browser-Tab -> Adresszeile fokussieren -> auf Seite suchen -> Tab schliessen`

Correct chain:

`Ctrl+T -> Ctrl+L -> Ctrl+F -> Ctrl+W`

The implementation reuses the stable Combo Builder interaction, but each selectable unit is a whole shortcut rather than one key.

- [x] Workflow Chain: Browser research.
- [x] Workflow Chain: Document editing.
- [x] Workflow Chain: Long-document navigation/editing.
- [x] Workflow Chain: Windows workspace.
- [x] Harder mixed Workflow Chain Gauntlet near the end.
- [x] Workflow Chains have their own titles/instructions and read as workflows, not ordinary Combo Builders.

## Content audit

- [x] Remove old Memory sections from the curated 2026 path.
- [x] Remove obvious late duplicate input rounds.
- [x] Collapse duplicate navigation puzzles into one stronger mixed navigation puzzle.
- [x] Collapse overlapping Combo Builders into distinct construction challenges.
- [x] Reduce repeated story scenes to a small set with different contexts.
- [x] Reduce Fast-Paced variants to a clear Basics -> Browser -> Windows -> Mastery progression.
- [x] Reduce duplicate Drag & Drop variants to purposeful A1 / Browser / Windows rounds.
- [x] Replace every shortcut not covered by current TK2 A1–A7.
- [x] Correct AltGr mappings specifically for the Swiss keyboard used in TK2.

## Target 2026 learning path — 30 sections

### Phase 1 — Recall foundation
- [x] 01 Warm-up – Grundlagen.
- [x] 02 A1 – Advanced Recall.
- [x] 03 Programme & Browser.
- [x] 04 Windows & Arbeitsalltag.
- [x] 05 AltGr – Schweizer Tastatur.

### Phase 2 — Association and construction
- [x] 06 Drag & Drop – Grundlagen.
- [x] 07 Drag & Drop – A1 Spezial.
- [x] 08 Drag & Drop – Browser.
- [x] 09 Drag & Drop – Windows.
- [x] 10 Combo Builder – Mixed.

### Phase 3 — Workflow transfer
- [x] 11 Workflow Chain – Browser-Recherche.
- [x] 12 Workflow Chain – Dokument.
- [x] 13 Workflow Chain – Langes Dokument.
- [x] 14 Workflow Chain – Windows Workspace.
- [x] 15 Szenario – Schulauftrag.
- [x] 16 Szenario – Browser unter Druck.

### Phase 4 — Mixed retrieval
- [x] 17 Shortcut Shuffle I.
- [x] 18 Shortcut Shuffle II.
- [x] 19 Navigation Puzzle.
- [x] 20 System Quick Access.
- [x] 21 AltGr No-Hint Recall.

### Phase 5 — Speed and pressure
- [x] 22 Fast-Paced Basics.
- [x] 23 Fast-Paced Browser.
- [x] 24 Fast-Paced Windows.
- [x] 25 Verwechslungsgefahr.

### Phase 6 — Mastery / RPG payoff
- [x] 26 Advanced Combo Builder.
- [x] 27 Workflow Chain Gauntlet.
- [x] 28 Real-World Gauntlet.
- [x] 29 Mastery Sprint.
- [x] 30 Final Mastery.

## RPG / UX integration

- [x] Keep coins as the reward for learning actions.
- [x] Keep shop, inventory/equipment and skills in the 2026 runtime.
- [x] Keep all 11 battles.
- [x] Tie battle progression to learning: Battle 1 is available immediately; each 3 first-time section clears permit the next rank, while the previous enemy must also be defeated.
- [x] Existing learning progression uses the actual `SECTION_BLUEPRINTS.length`, so it scales to the curated 30-section list.
- [x] Keep report/statistics rather than creating another A7-style formal evidence system.
- [x] Add clear `A8 · Shortcut Quest 2026` / `TK2` identity in the UI.
- [x] Add concise `x / 30` completion status; at 30/30 it becomes `A8 abgeschlossen ✓`.
- [x] Isolate the 2026 save state as `shortcutRitter_2026_v1` so the legacy game save is not overwritten.

## QA

- [x] Static content audit: every retained learning shortcut belongs to current TK2 A1–A7.
- [x] Static content audit: no `memoryGame` section remains in `2026/sections-data.js`.
- [x] Static progression audit: section count is dynamic and first clears unlock further sections up to all 30.
- [x] Static Workflow Chain audit: implementation uses the existing Combo Builder string-option/scoring path.
- [x] Relative runtime files copied into `/2026/`: index, section data, hotkeys, chart library, favicon and assets.
- [x] Save-state collision protection added before the inherited inline runtime loads.
- [ ] Browser smoke: `/2026/` loads without console errors.
- [ ] Browser smoke: complete one normal input/select section and verify coins + next unlock.
- [ ] Browser smoke: complete one Drag & Drop section.
- [ ] Browser smoke: complete one Workflow Chain section and verify scoring/unlock.
- [ ] Browser smoke: verify shop purchase, equipment/skills and Battle 1.
- [ ] Browser smoke: verify Battle 2 stays gated until 3 sections + Battle 1 clear.
- [ ] Browser smoke: verify header progress updates and 30/30 completion state.
- [ ] Final repository cleanup and diff review.
