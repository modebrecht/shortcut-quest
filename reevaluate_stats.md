# Shortcut Quest Combat + Progression Rebalance

> **Working notes (keep for devs):** The goal is that a new student finishes every section, optimizes gear/skills naturally, and reliably defeats the final enemy inside one classroom hour (~55 minutes of effective play). All numbers below are proposals ready to implement in `index.html` after we agree.

---

## 1. Target Pacing & Difficulty Curve

| Phase | Unlock window | Play time | Narrative goal | Difficulty note |
| ----- | ------------- | --------- | -------------- | --------------- |
| Tutorial | Enemies 1-2 | 5-8 min | Teach skill usage & gear equip | Almost impossible to lose; enemies stay <8 ATK, <1 DEF |
| Early Game | Enemies 3-5 | 10-15 min | Player acquires shield + first skill | Require limited skill usage, ATK variance stays 1-2 |
| Mid Game | Enemies 6-8 | 15-20 min | Player has Tier 3 weapon, shield, at least one Tier 2 skill | Moderate difficulty, skill timing required |
| Late Game | Enemies 9-11 | 20-25 min | Player collects Tier 4-5 pieces + Tier 3+ skills | Expect cooldown juggling; enemies threaten 3-shot kill if no buffs |

**Thoughts:** Keeping the first 2 fights much weaker keeps frustration away from students. The final third of the hour should feel like a race where cooldowns must be chained; therefore every skill now shares a 5-round lockout and Sturm + Aurawoge + Kampfrausch scale accordingly.

---

## 2. Revised Gear Scaling

| Item | Tier availability (expected minute) | Tier 1 stats | Tier 3 | Tier 5 | Notes |
| ---- | ----------------------------------- | ------------ | ------ | ------ | ----- |
| **Bronzeklinge** | Default (0 min) | +2 ATK | +6 | +10 | Intro baseline |
| **Stahlklinge** | Shop unlock after enemy 3 (~10 min) | +3 ATK | +9 | +15 | Incentivizes mid run upgrade |
| **Feuerklinge** | Shop unlock after enemy 7 (~30 min) | +4 ATK | +12 | +20 | Late offense anchor |
| **Turmschild** | Enemy 2 reward | +3 DEF | +9 | +15 | Drives HP via DEF |
| **Taktikhelm** | Enemy 3 reward | +1 ATK/+1 DEF | +3/+3 | +5/+5 | Mixed scaling |
| **Panzerhandschuhe** | Section 4 reward | +1 DEF | +3 | +5 | Early survivability |
| **Stahl-Stiefel** | Shop after enemy 5 | +2 DEF | +6 | +10 | Late stackable |
| **Lebensring** | Shop after enemy 4 | +20 HP | +60 | +120 | Keep HP floor high |
| **Glücksring** | Optional; unchanged | +crit dmg 1-12% | - | - | Works with new crit windows |

**Thoughts:** No numerical changes inside code yet, but this table outlines when each tier is reachable to make balancing enemies easier.

---

## 3. Skill System Overview (post-cooldown)

| Skill | Tier curve | Cooldown | Visual prompt |
| ----- | ---------- | -------- | ------------- |
| **Himmelszorn** | 6/10/14/20/26 dmg | 5 rounds | Lightning strike & cooldown badge |
| **Schutzwall** | +4/+6/+8/+11/+14 DEF for 5 hits | 5 rounds | Shield overlay + counter |
| **Kampfrausch** | +2/+5/+10/+15/+25 ATK for 5 rounds | 5 rounds | Red Frenzy aura + ATK badge flashes |
| **Aurawoge** | 12/18/24/33/42 heal | 5 rounds | Healing wave overlay |

**Thoughts:** I already added the cooldown logic & visuals in code; document keeps reasoning here for future maintainers.

---

## 4. Enemy Rebalance Targets

Recalculate each enemy’s stats based on expected player state when they reach that fight. Damage formula assumption: hero ATK ≈ weapon tier + kampfrausch + variance(ATK/4). DEF-driven HP uses `HP = BASE_HP + gearHP + DEF*6`.

| Lv | Enemy | HP | DEF | ATK | Rationale |
| -- | ----- | -- | --- | --- | --------- |
| 1 | Kobold | **12** | 0 | 2 | Fast win; no skills needed |
| 2 | Grüner Goblin | **16** | 0 | 3 | Introduce shield by forcing 4-5 hits |
| 3 | Hobgoblin | **22** | 1 | 4 | First “real” fight; rewards Turmschild usage |
| 4 | Waldgoblin | **28** | 1 | 4 | Expect helm + first skill drop |
| 5 | Höhlengoblin | **34** | 2 | 5 | Aurawoge unlock window; encourage heal |
| 6 | Bergtroll | **40** | 2 | 6 | Mid-game spike; Himmelszorn recommended |
| 7 | Dunkelgoblin | **46** | 3 | 6 | Kampfrausch Tier 2 likely; test aura buff |
| 8 | Kriegsgoblin | **52** | 3 | 7 | Late mid-game; player should juggle cooldowns |
| 9 | Schattengoblin | **58** | 4 | 8 | Expect Tier 4 gear; fights last 6-7 rounds |
| 10 | Dämonengoblin | **64** | 4 | 9 | Pseudo boss; Aurawoge Tier 4 helpful |
| 11 | Goblinkönig | **72** | 5 | 10 | Final exam; storms + frenzy + heal needed |

**Thoughts:** HP jumps roughly +6 each level. Attack grows moderately to ensure cooldown mismanagement is punished but still beatable in ~5 minutes of attempts.

---

## 5. Hero Reference Builds (for QA)

### Early (15 min)
- Gear: Bronzeklinge Tier 2, Turmschild Tier 1, Helm Tier 1, Gloves Tier 1.
- Stats: ATK 7, DEF 4, HP ≈ 12 + DEF*6 = 36.
- Skills: Himmelszorn Tier 1, Kampfrausch Tier 1.
- DPS expectation: 5 dmg per swing, w/ skill spikes to 7-8.

### Mid (30 min)
- Gear: Stahlklinge Tier 3, Turmschild Tier 2, Boots Tier 2, Lebensring Tier 2.
- Stats: ATK 15 baseline, DEF 8, HP ≈ 60.
- Skills: Kampfrausch Tier 2, Aurawoge Tier 2.
- Fight model: Use frenzy first, swap to shield/heal as needed; cooldown chain lasts exactly 15 rounds.

### Late (50+ min)
- Gear: Feuerklinge Tier 4-5, Shield Tier 4, Boots Tier 4, double Lebensring Tier 3+, helm/gloves Tier 4.
- Stats: ATK 30 (35 w/ frenzy), DEF 15, HP ≈ 102.
- Skills: Kampfrausch Tier 4, Himmelszorn Tier 4, Aurawoge Tier 3, Schutzwall Tier 3.
- This setup defeats Goblinkönig in ≤8 rounds if cooldowns chained properly.

**Thoughts:** These builds guide QA; they’re not implemented but help devs sanity-check numbers.

---

## 6. Implementation Checklist

1. **Update gear stats** in `KNIGHT_POOL` to match Section 2 table (weapon tiers, shield defs, etc.).
2. **Adjust `getSkillEffectivePower()`** with the frenzy tier table (already coded), ensure new cooldown messaging is localized.
3. **Replace `ENEMY_DATA`** with Section 4 values and confirm UI (battle cards, preview) picks up the new stats.
4. **Tween animations**: frenzy aura (done), shield overlay (done), healing wave (done). Consider soft glow for Himmelszorn cooldown if needed.
5. **Tutorial copy**: remind students that cooldown icons show rounds remaining.
6. **QA script**: run automated sim using representative gear + skills to ensure fights resolve within 3-8 turns across phases.

**Thoughts:** Implementation order prioritizes indirect dependencies: gear stats → skill numbers → enemy tuning → UI copy.

---

## 7. Open Questions

- Should Aurawoge scale by percentage instead of flat HP once Tier 4+ rings come online? (Maybe, but leave for future patch.)
- Do we want optional “challenge” modifiers after finishing the one-hour course? (Not now; focus on baseline.)
- Is a shared cooldown the best teaching tool? Monitor student feedback; might need UI hints per skill card.

---

## 8. Next Steps

1. Edit `index.html` according to sections 2-4, re-run a manual playthrough verifying the one-hour constraint.
2. Update `console.md` or debugging helpers to allow speedrunning through fights for QA.
3. Add a short onboarding tooltip explaining skill cooldowns and the new frenzy aura.

> **Reminder:** Keep this document up to date whenever numbers shift. Future contributors should never guess the intended curve. This file is the single source of truth. Let’s revisit after the next playtest session.
