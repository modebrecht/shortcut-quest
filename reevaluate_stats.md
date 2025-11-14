# Enemy HP/DEF Re-Evaluation

We need to re-calibrate every enemy rank because player power jumped after adding more gear, higher tiers and stronger skills. This document captures the references you need and the exact workflow for recomputing the stats.

## Current Enemy Table (`index.html:7341-7355`)

| Level | Enemy            | HP | DEF | ATK | Variant |
| ----- | ---------------- | -- | --- | --- | ------- |
| 1     | Kobold           | 16 | 0   | 2   | goblin |
| 2     | Gruener Goblin   | 20 | 0   | 3   | goblin |
| 3     | Hobgoblin        | 24 | 1   | 4   | goblin |
| 4     | Waldgoblin       | 26 | 2   | 4   | goblin |
| 5     | Hoehlengoblin    | 30 | 2   | 5   | goblin |
| 6     | Bergtroll        | 34 | 2   | 6   | goblin-army |
| 7     | Dunkelgoblin     | 38 | 3   | 6   | goblin-army |
| 8     | Kriegsgoblin     | 42 | 3   | 7   | goblin-army |
| 9     | Schattengoblin   | 46 | 4   | 7   | goblin-army |
| 10    | Daemonengoblin   | 52 | 4   | 8   | goblin-army |
| 11    | Goblinkoenig     | 60 | 5   | 9   | goblin-king |

## Hero Power References

### Base constants (`index.html:3554-3559`)

- `BASE_ATK = 1`, `BASE_DEF = 0`, `BASE_HP = 12`.
- `HP_PER_DEF = 6` → each point of DEF contributes +6 max HP via `getHeroMaxHp()`.
- `MAX_ITEM_TIER = 5` and `MAX_SKILL_TIER = 6`.
- Hero crit chance is fixed at 18% while crit damage bonus grows through `Gluecksring`.

### Gear scaling (`KNIGHT_POOL` @ `index.html:5239-5325`)

Item stats scale linearly with tier via `updateItemDerivedStats()` (`index.html:5515-5539`): `effectiveAtk = baseAtk * tier`, `effectiveDef = baseDef * tier`, `HP = baseHp * tier` unless the item overrides HP/crit tables.

| Slot        | Item             | Base stats per tier 1 | Tier 5 outcome | Notes |
| ----------- | ---------------- | --------------------- | -------------- | ----- |
| Weapon      | Bronzeklinge     | +2 ATK                | +10 ATK        | Early guaranteed drop. |
| Weapon      | Stahlklinge      | +3 ATK                | +15 ATK        | Same slot as above, whichever is equipped wins. |
| Weapon      | Feuerklinge      | +4 ATK                | +20 ATK        | Highest baseline. |
| Offhand     | Turmschild       | +3 DEF                | +15 DEF        | Critical for HP via DEF → HP_PER_DEF. |
| Helm        | Taktikhelm       | +1 ATK / +1 DEF       | +5 ATK / +5 DEF | Mixed stat piece. |
| Gloves      | Panzerhandschuhe | +1 DEF                | +5 DEF         | DEF only. |
| Necklace    | Runen-Amulett    | 0 stats               | 0 stats        | Only affects coins; ignore for combat math. |
| Boots       | Stahl-Stiefel    | +2 DEF                | +10 DEF        | DEF only. |
| Ring (left/right) | Lebensring | 20/40/60/80/120 HP by tier (see below) | Tier 5 = 120 HP each | Overrides `hpBonus` via `LEBENS_RING_HP_BY_TIER`. |
| Ring (left/right) | Gluecksring| +0 stats              | 0 stats        | Provides crit damage: 1/3/5/8/12% via `GLUECKS_RING_CRIT_BY_TIER`. |

`LEBENS_RING_HP_BY_TIER = {1:20, 2:40, 3:60, 4:80, 5:120}` (`index.html:3552-3557`). Both ring slots accept Lebensring or Gluecksring, so a late-game hero could double up on HP if desired.

### Skill scaling (`SKILL_POOL` @ `index.html:5263-5271`)

Skill strength is `basePower + powerPerTier * (tier-1)` and optionally gains an overcap percent (`getSkillEffectivePower()` @ `index.html:5509-5513`).

| Skill          | Effect type | Tier 1 value | Tier 6 value | Combat impact |
| -------------- | ----------- | ------------ | ------------ | ------------- |
| Sturm-Hieb     | Direct damage | 6 dmg | 6 + 4*(5)=26 dmg | One-time burst, ignores DEF. |
| Schutzwall     | Heal | 10 HP | 10 + 6*(5)=40 HP | Extends survival vs higher ATK enemies. |
| Kampfrausch    | `buff_atk` | +2 ATK | +2 + 2*(5)=12 ATK | Permanent ATK boost for the battle. |
| Schattenschritt| `debuff_enemy` | -2 enemy ATK | -12 ATK | Use to lower enemy DPS; influences how much DEF/HP they need to feel threatening. |

### Combat math (see `calculateDamage()` @ `index.html:8020-8040`)

- Final hero ATK = `BASE_ATK + sum(itemAtk)`, final DEF = `BASE_DEF + sum(itemDef)`.
- Max HP = `BASE_HP + sum(itemHP) + DEF * HP_PER_DEF` (`getHeroMaxHp()` @ `index.html:5928-5931`).
- Turn damage = `max(1, attacker.atk ± variance - defender.def)`. Crit multiplies by `1.5 * (1 + critDamageBonus%)` and adds +1.
- Hero variance defaults to `floor(atk / 4)` (`createHeroState()` @ `index.html:7873-7884`), so higher ATK widens the spread.

These are the formulas you will use when deciding how hard an enemy should hit or how long it should take to defeat them.

## How to calculate new enemy HP/DEF

1. **Capture real hero states per unlock.** Load representative saves or mock inventories for early/mid/late players and record `state.atk`, `state.def`, `state.hp`, equipped tiers, and owned skills. Use the battle preview cards (`updateBattlePreview()` / `updateBattleSimulationCards()` @ `index.html:7064-7099` and `7738-7762`) to double-check.

2. **Map each battle rank (1-11) to an expected power band.** Decide which combination of tiered gear and skill ranks a player likely has when they first challenge that rank. Example: ranks 1-3 assume tier 1-2 gear and no skills, ranks 4-6 assume one tier-3 weapon and Tier 2 Kampfrausch, etc.

3. **Compute hero ATK/DEF/HP for that band.** Use:
   ```
   heroAtk = BASE_ATK + Σ(item.baseAtk * tier) + buffPower
   heroDef = BASE_DEF + Σ(item.baseDef * tier)
   heroHp = BASE_HP + Σ(itemHp) + heroDef * HP_PER_DEF
   ```
   Remember: Lebensring HP overrides linear scaling, and Kampfrausch adds a flat ATK bonus for the whole fight.

4. **Set your difficulty targets.**
   - Decide desired turns-to-kill (TTK) for each rank (e.g., 3-4 hero swings early, 6-7 mid-game, 8+ for the boss).
   - Decide acceptable enemy damage taken after Schattenschritt (if the player owns it) so that fights remain punishing without mandatory skill usage.
   - Account for one-off burst from Sturm-Hieb when looking at HP (subtract expected skill burst from total HP so regular swings still matter).

5. **Solve for DEF first.** Choose a target hero damage per swing (`targetHeroDamage`). Rearrange the damage formula:
   ```
   enemyDef = heroAtk - targetHeroDamage
   enemyDef = clamp(enemyDef, MIN_DEF, MAX_REASONABLE_DEF)
   ```
   Where `targetHeroDamage` should ensure the hero still deals at least 1-2 damage before buffs and 3-5 damage after Kampfrausch for the intended tier.

6. **Solve for HP next.** Let `heroDamagePerSwing = max(1, heroAtk - enemyDef)`. Desired HP:
   ```
   enemyHp = heroDamagePerSwing * desiredTTK + skillBurstPadding
   skillBurstPadding = max(0, expectedSturmHiebDamage - heroDamagePerSwing)
   ```
   Round to whole numbers. Add +5-10% buffer for high-variance crit streaks.

7. **Validate through the simulator.** Start battles via the UI or by calling `startBattle(level)` in dev tools and observe:
   - Without skills, does the hero barely win or barely lose?
   - With a reasonable skill loadout, does the fight end within the target turn count?
   Adjust HP or DEF accordingly.

## Re-evaluation To-Do List

### Global prep

- [ ] Export representative hero stats for early, mid, and late game (include equipped items, tiers, and skill tiers).
- [ ] Define desired TTK and required hit-to-kill values per tier (document the targets beside this file).
- [ ] Decide whether Lebensring stacking (double ring) is considered in baseline or as an optional build.
- [ ] Script or spreadsheet the formulas above to avoid manual mistakes.
- [ ] After updating values, smoke-test fights in-browser and capture logs/screenshots.

### Per-level checklist

| Level | Enemy | Tasks |
| ----- | ----- | ----- |
| 1 | Kobold | [ ] Record expected hero ATK/DEF for fresh player • [ ] Compute new DEF via step 5 • [ ] Compute HP via step 6 • [ ] Update `ENEMY_DATA[0]`. |
| 2 | Gruener Goblin | [ ] Repeat calculations for Tier 1 gear ceiling • [ ] Ensure fight teaches blocking/damage. |
| 3 | Hobgoblin | [ ] Account for first defensive drops (helm/gloves) • [ ] Keep HP slightly above double skill burst. |
| 4 | Waldgoblin | [ ] Assume first Tier 2 weapon • [ ] Increase DEF to make Kampfrausch relevant. |
| 5 | Hoehlengoblin | [ ] Model Tier 2 shield + boots • [ ] HP tuned for ~5 hero swings post-buff. |
| 6 | Bergtroll | [ ] Mid-game loadout with Tier 3 weapon + Lebensring • [ ] Validate hero survivability vs ATK spike. |
| 7 | Dunkelgoblin | [ ] Expect Tier 3-4 armor mix • [ ] Include Schattenschritt in survivability calc. |
| 8 | Kriegsgoblin | [ ] Late Tier 4 offensive pieces • [ ] Target 6-7 swings incl. Sturm-Hieb. |
| 9 | Schattengoblin | [ ] Assume at least one Tier 5 defensive item • [ ] Confirm HP still demands skill usage. |
| 10 | Daemonengoblin | [ ] Player likely running Tier 5 weapon + double rings • [ ] Keep DEF high enough to force Kampfrausch. |
| 11 | Goblinkoenig | [ ] Final boss tuning: include Tier 6 skills (max +12 ATK buff, -12 enemy ATK debuff) • [ ] Playtest multiple loadouts before locking stats. |

### Post-update

- [ ] Double-check UI displays (preview cards, battle modal) to ensure new stats render correctly.
- [ ] Update any narrative text or tooltips that reference old values.
- [ ] Commit the changes with a clear summary (`docs: re-evaluate enemy stats` or similar).

## Sample calculation template

```
Given: Tier 4 Feuerklinge (ATK 16), Tier 3 Taktikhelm (ATK 3/DEF 3), Tier 3 Turmschild (DEF 9), Tier 3 Boots (DEF 6),
       Tier 3 Gloves (DEF 3), Tier 3 Lebensring (HP 60), Kampfrausch Tier 4 (+8 ATK).

heroAtk = 1 + 16 + 3 + 8 = 28
heroDef = 0 + 9 + 6 + 3 + 3 = 21
heroHp = 12 + 60 + (21 * 6) = 198

Target hero damage per swing = 4 → enemyDef = 28 - 4 = 24.
Desired TTK = 6 swings. heroDamagePerSwing = max(1, 28 - 24) = 4.
enemyHp = 4 * 6 = 24. Add 1x Sturm-Hieb burst (~18 at Tier 4) → HP goal ≈ 24 + 18 = 42.
```

Use this template for each rank, adjusting the inputs and desired turn count as required.
