# Battle Modal Visualization Plan

> Focus: This document only describes the **battle modal** that appears after selecting an enemy button (e.g., “Rank 1 Kobold”).

## Analysis & Ideas
- Document the current modal layout (hero panel, enemy panel, action column, hidden log) and list which data feeds each UI element.
- Identify visual gaps (flat backgrounds, limited motion, static portraits) and sketch redesign concepts.
- Explore enhancements for hero/enemy panels (gear grid, stat badges, trait labels), battlefield background layers, and end-of-battle outcomes.
- Consider timeline/log alternatives even if currently hidden, so the code path remains ready for reactivation.

## Next Steps
- Prototype improved modal visuals (CSS/SVG updates, animations) behind a feature flag.
- Add QA notes for ensuring the modal opens/closes correctly, respects reduced-motion preferences, and keeps buttons accessible.
- Gather feedback after each iteration and update this plan with concrete tasks as improvements progress.

## Optional Ideas
- Animate hero/enemy cards when turns change (subtle scale, colored glows).
- Add per-hit particle bursts that match the attacker’s element.
- Display temporary status icons (bleed, stun, buff) above combatants.
- Introduce a compact loot summary in the modal once the battle ends.
