import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.TK2_BASE_URL || 'http://127.0.0.1:4173/2026/';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

try {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.SHORTCUT_QUEST_2026_ECONOMY?.equipmentCoinBonus === false);

  const economy = await page.evaluate(() => ({
    config: window.SHORTCUT_QUEST_2026_ECONOMY,
    scaled100: window.applyCoinBonus(100),
    runenCoinBonus: window.getRunenAmuletCoinBonusPercent(),
    runen: (() => {
      const item = {
        key: 'runen_amulet',
        name: 'Runen-Amulett',
        atk: 0,
        def: 0,
        baseAtk: 0,
        baseDef: 0,
        tier: 3,
        // Item tiers use powers-of-two copy thresholds: tier 3 needs 4 copies.
        totalCopies: 4,
        description: 'legacy'
      };
      window.updateItemDerivedStats(item);
      return { item, stats: window.collectItemStats(item) };
    })()
  }));

  assert.equal(economy.config.rewardScale, 1.16);
  assert.equal(economy.config.equipmentCoinBonus, false);
  assert.equal(economy.scaled100, 116, 'Flat 2026 reward scale should replace equipment coin bonus');
  assert.equal(economy.runenCoinBonus, 0, 'Runen-Amulett must not modify coins in 2026');
  assert.equal(economy.runen.item.baseDef, 1, 'Runen-Amulett should have base DEF 1');
  assert.equal(economy.runen.item.def, 3, 'Tier-3 Runen-Amulett should provide DEF 3');
  assert.match(economy.runen.item.description, /DEF um 1 pro Tier/i);
  assert.ok(economy.runen.stats.some(stat => stat.label === 'DEF' && String(stat.value) === '3'), 'Runen-Amulett stats should show DEF 3');
  assert.ok(!economy.runen.stats.some(stat => /Münzen/i.test(stat.label)), 'Runen-Amulett stats must not show a coin bonus');

  // Verify the real learner reward path through the new game-first opening.
  // Section 1 still has 6 first-clear actions: legacy base 60 -> scaled reward 70.
  const section = page.locator('.section[data-section="1"]');
  assert.equal(await section.locator('.narrative-card').count(), 6, 'Opening mission should contain six scenario cards');
  assert.equal(await section.locator('input[data-answer]').count(), 0, 'Section 1 must not fall back to copy-the-shortcut inputs');
  await page.evaluate(() => {
    const section = document.querySelector('.section[data-section="1"]');
    if (!section) throw new Error('Section 1 missing');
    section.querySelectorAll('.narrative-blank').forEach(blank => {
      const answer = blank.dataset.answer || '';
      blank.dataset.value = answer;
      blank.dataset.filled = 'true';
      blank.textContent = answer;
    });
  });
  await section.locator('.check-section[data-check-section="1"]').click();
  await page.waitForTimeout(200);
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem('shortcutRitter_v1')));
  assert.equal(Number(state.coins), 70, 'Perfect Section 1 mission should award 70 scaled coins in 2026');

  // Arena layout, image-backed single-stage presentation, interaction, and fighter grounding are covered by browser-smoke.mjs.
  console.log('ECONOMY BROWSER OK: opening mission reward=70, no gear coin bonus, Runen-Amulett = +1 DEF/tier.');
} finally {
  await browser.close();
}
