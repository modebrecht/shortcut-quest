# Battle Modal Visualization Plan

#t1 Capture Current State  
- Screenshot / record the current modal in idle, attacking, and victory states.  
- Inventory hero/enemy stat sources to know which numbers we can visualize (base ATK/DEF/HP, crit, variance, equipped skills).  
- Create a quick Figma/pen sketch to identify pain points (empty space, flat backgrounds, limited motion).

#t2 Layered Battlefield Background  
- Add gradient layers + parallax particles behind the fighters to create depth.  
- Introduce subtle color shifts (hero blue, enemy red) that respond to attacker turn.  
- Ensure contrast stays AA-compliant for modal text/buttons.

#t3 Hero & Enemy Cards 2.0  
- Replace static portraits with SVG/emblem frames that react to damage (glow when hit, pulse on crit).  
- Surface HP/ATK/DEF/crit in badge rows plus a short trait line (e.g., “Defensiv, niedrige Crit-Chance”).  
- Show equipped skills/gear icons beneath the hero card so players see why stats changed.

#t4 Action Timeline & Skill Highlights  
- Convert the log into a vertical timeline with icons for attack, crit, block, skill use.  
- Color-code hero vs enemy entries and link to the skill buttons (hover timeline entry to highlight the corresponding skill card).  
- Fade resolved skill cards and add progress pips for cooldowns.

#t5 Finisher & Outcome States  
- Design hero/enemy finisher animations (SVG burst, screen shake, particle shower).  
- Add a dedicated victory/defeat banner with loot/highlights and a CTA row (“Retry”, “Next Rank”).  
- Include accessibility fallbacks (reduced-motion media query to disable camera shake).

#t6 Implementation & QA  
- Build changes behind a feature flag so we can ship incrementally.  
- Write small Cypress/Playwright smoke tests to ensure modal opens/closes, buttons remain clickable, and reduced-motion preference is respected.  
- Gather feedback, iterate, and remove the flag once stable.

## Progress Updates
- #t1 ✅ *Current State Audit* – Documented existing modal hierarchy (hero/enemy cards + log), mapped stat sources (state.atk/def/hp, ENEMY_DATA) and identified flat log / missing gear context as key issues.
- #t2 🟡 *Layered Battlefield Background* – Added hero/enemy side panels with gradient backdrops and variant colors (blue vs crimson). Further parallax/particle work still open.
- #t3 🟡 *Hero & Enemy Cards* – Rebuilt cards with stat badges and live gear grid tied to equipment slots; enemy traits now use `ENEMY_VARIANT_LABELS`. Still pending crit/glow micro-interactions.
- #t4 🟡 *Action Timeline* – Converted battle log into a timeline component with hero/enemy color coding and streaming entries via `pushBattleLog`. Need hover link-back to skill buttons + cooldown markers.
- #t5 ⚪ Pending – Finisher animations and dedicated victory banner not started.
- #t6 ⚪ Pending – Feature flag + automated QA scripts not started.
