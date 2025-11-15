Coins you can squeeze from the 55 learning sections: each checkable action is worth 10 coins on the first clear. Most sections carry 4 classic prompts (input/select), so the baseline is 55 × 4 × 10 = 2,200 coins. Several chapters actually pay more because DnD targets, memory pairs, narrative blanks, combo builders, and the fast‑paced drills each inject extra [data-answer] elements or extra “rounds”; hitting every fast‑paced combo, for example, adds another rounds × 10 coins. In practice you can finish the curriculum with roughly 2.3‑2.6k coins if you perfect every section once.

Coins needed to max out everything in the shop:

Gear: there are 10 item blueprints in KNIGHT_POOL. Each tier-up consumes one duplicate, so Tier 5 needs 5 copies (Tier 1 base + 4 upgrades). That’s 10 items × 5 copies = 50 gacha pulls → 50 × 20 = 1,000 coins.
Skills: 4 skills, Tier 6 requires 6 copies each, so 4 × 6 = 24 pulls → 24 × 20 = 480 coins.
Total minimum outlay: 1,000 + 480 = 1,480 coins (before accounting for RNG inefficiency).
Match-up: Even the conservative 2,200‑coin curriculum payout covers the 1,480‑coin “complete collection” cost with ~720 coins to spare. Perfect fast‑paced sessions and any repeat clears just widen the buffer, so the reward curve is more than enough to let a student finish the full shop within the one-hour adventure even with a few unlucky duplicate pulls.

---

## Should we raise the gacha cost to 25 coins?

- **Pros of increasing to 25:** Slows down shop spamming a little and stretches progression for students who grind the same section repeatedly. If a player only clears the minimum actions (≈2,200 coins) and we charge 25 per pull, they could afford 2,200 / 25 = 88 pulls instead of 110. Fully maxing every gear & skill copy needs 74 pulls (50 gear + 24 skill)—still below that ceiling, so the math works even with the higher price.
- **Cons:** The current 20-coin price already leaves ~700 spare coins after buying everything, which provides a cushion for unlucky rolls or students who skip some optional fast-paced drills. Raising the cost reduces that safety buffer to roughly 500 coins and might become punishing if RNG repeatedly hands out items the player already maxed.
- **Recommendation (revisited):** With the Runen-Amulett bonus in mind we *can* tighten prices a bit. My proposal is to raise the gacha cost from 20 → **25 coins**:
  - Base earners (≈2.3k coins without bonuses) still get 88 pulls, comfortably above the 74 pulls needed to max all gear/skills.
  - Students who unlock the 55% amulet bonus end up with 3.5‑4.0k coins, so the 25-coin price barely dents their cushion.
  - Jumping straight to 30 coins would punish anyone who never buys/levels the amulet: 74 pulls × 30 = 2,220 coins. That leaves almost zero margin for a player stuck around the 2.3k baseline. Better to observe live data first and only consider 30 if people still finish with thousands of spare coins.
  - Action item: when we flip the price switch, surface a one-time tooltip so students notice the cost increase.
  - **Extra reminder:** these numbers already ignore combat rewards (see below), so we still have a safety buffer once battle payouts are included.

### Runen-Amulett Coin Bonus

- The `Runen-Amulett` grants a dynamic bonus up to **55%** once students reach Tier 5 and complete 55 sections (`RUNEN_AMULET_DYNAMIC_CAP = 55`).  
- All math above deliberately ignored this bonus. If a player hits the cap late in the run, their 2.3‑2.6k base payout jumps to roughly **3.5‑4.0k** coins. That’s plenty of slack even with bad RNG or if we later raise the gacha price.  
- Because the bonus depends on section clears, students who struggle will naturally have fewer sections done → lower bonus → still aligned with our “breathing room” philosophy. In other words, we’re not forced to shrink base rewards just because the amulet can spike late‑game income.

### Battle Rewards (additional coins)

- Every enemy victory grants a base payout (`BATTLE_LEVEL_REWARDS`): 1,1,2,2,3,4,4,4,5,5 and a 100-coin jackpot for the Goblinkönig. The sum for all 11 fights is **131 coins** before bonuses.
- Each skill activation in a fight adds `+1` coin to the reward (see `battleSkillUseCount` logic), so students who juggle cooldowns earn a few extra coins passively.
- These coins are also boosted by the Runen-Amulett. So a diligent student who clears every battle plus every section sits closer to **3.7‑4.2k** coins, keeping the 25-coin price comfortable.
