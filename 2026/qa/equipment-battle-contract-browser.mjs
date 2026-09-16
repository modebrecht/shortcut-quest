import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE_URL = process.env.TK2_BASE_URL || 'http://127.0.0.1:4173/2026/';
const EQUIPMENT = Object.freeze({
  weapon: 'bronze_sword',
  offhand: 'stahl_sword',
  helm: 'taktik_helm',
  gloves: 'panzerhandschuhe',
  necklace: 'runen_amulet',
  boots: 'stahl_stiefel',
  ring_left: 'lebens_ring',
  ring_right: 'gluecks_ring'
});

async function installBattleRuntime(page) {
  for (const file of [
    'premium-motion.js',
    'battle-motion.js',
    'arena-dev-fix.js',
    'a8-dev-polish.js',
    'battle-continuity.js',
    'battle-balance.js'
  ]) {
    await page.addScriptTag({ url: new URL(file, BASE_URL).href });
  }
}

function assertEquipment(actual, label) {
  assert.deepEqual(actual, EQUIPMENT, `${label}: all eight equipment slots must persist exactly`);
}

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error?.stack || error)));

  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await installBattleRuntime(page);

  const equipped = await page.evaluate(mapping => {
    const now = Date.now();
    const sectionClears = {};
    for (let i = 1; i <= 30; i += 1) sectionClears[String(i)] = 1;

    state.sectionClears = sectionClears;
    state.battleClears = {};
    state.battleUnlocked = 1;
    state.coins = 25;
    state.items = Object.values(mapping).map((key, index) => {
      const base = KNIGHT_POOL.find(item => item.key === key);
      if (!base) throw new Error(`Missing KNIGHT_POOL item ${key}`);
      return {
        ...base,
        id: `qa-contract-${key}-${now}`,
        tier: 1,
        totalCopies: 1,
        createdAt: now + index,
        lastObtainedAt: now + index
      };
    });
    state.equipment = {};
    recalcStats();
    const baseline = {
      atk: state.atk,
      def: state.def,
      hp: state.hp,
      maxHp: getHeroMaxHp()
    };

    for (const [slot, key] of Object.entries(mapping)) {
      equipItem(slot, key);
    }
    recalcStats();
    saveState();
    updateUI();
    renderBattleButtons();

    return {
      slotKeys: [...EQUIPMENT_SLOT_KEYS],
      equipment: Object.fromEntries(EQUIPMENT_SLOT_KEYS.map(slot => [slot, state.equipment?.[slot] || null])),
      baseline,
      stats: {
        atk: state.atk,
        def: state.def,
        hp: state.hp,
        maxHp: getHeroMaxHp()
      }
    };
  }, EQUIPMENT);

  assert.deepEqual(
    equipped.slotKeys,
    ['gloves', 'helm', 'necklace', 'boots', 'weapon', 'offhand', 'ring_left', 'ring_right'],
    'Equipment slot contract must remain eight named slots'
  );
  assertEquipment(equipped.equipment, 'Before reload');
  assert.ok(equipped.stats.atk > equipped.baseline.atk, 'Full equipment must raise ATK');
  assert.ok(equipped.stats.def > equipped.baseline.def, 'Full equipment must raise DEF');
  assert.ok(equipped.stats.maxHp > equipped.baseline.maxHp, 'Full equipment must raise derived max HP');

  await page.reload({ waitUntil: 'networkidle' });
  await installBattleRuntime(page);

  const persisted = await page.evaluate(() => ({
    equipment: Object.fromEntries(EQUIPMENT_SLOT_KEYS.map(slot => [slot, state.equipment?.[slot] || null])),
    stats: {
      atk: state.atk,
      def: state.def,
      hp: state.hp,
      maxHp: getHeroMaxHp()
    },
    unlocked: state.battleUnlocked
  }));
  assertEquipment(persisted.equipment, 'After reload');
  assert.deepEqual(persisted.stats, equipped.stats, 'ATK/DEF/HP must survive reload unchanged');
  assert.equal(persisted.unlocked, 1, 'QA setup should still begin at battle rank 1 after reload');

  await page.locator('.nav-toggle[data-view="battle"]').click();
  await page.waitForFunction(() => document.getElementById('battleView')?.classList.contains('active'));
  await page.evaluate(() => selectBattle(1));
  await page.locator('#battleStartBtn').click();
  await page.waitForFunction(() => window.SHORTCUT_QUEST_BATTLE_ENGINE_V2?.phase === 'fighting');

  const liveHero = await page.evaluate(() => ({
    atk: currentBattleContext.hero.atk,
    def: currentBattleContext.hero.def,
    maxHp: currentBattleContext.hero.maxHp,
    stateAtk: state.atk,
    stateDef: state.def,
    stateMaxHp: getHeroMaxHp()
  }));
  assert.equal(liveHero.atk, liveHero.stateAtk, 'Equipped ATK must reach the real battle hero');
  assert.equal(liveHero.def, liveHero.stateDef, 'Equipped DEF must reach the real battle hero');
  assert.equal(liveHero.maxHp, liveHero.stateMaxHp, 'Equipped derived HP must reach the real battle hero');

  await page.evaluate(() => {
    currentBattleContext.enemy.hp = 1;
    currentBattleContext.enemy.def = 0;
    currentBattleContext.enemy.atk = 0;
    currentBattleContext.enemy.variance = 0;
    currentBattleContext.enemy.crit = 0;
    currentBattleContext.hero.atk = 9999;
    currentBattleContext.hero.variance = 0;
    currentBattleContext.hero.crit = 0;
  });
  await page.waitForFunction(() => window.SHORTCUT_QUEST_BATTLE_ENGINE_V2?.phase === 'victory', null, { timeout: 10000 });

  const victory = await page.evaluate(() => ({
    clear: Boolean(state.battleClears?.['1'] || state.battleClears?.[1]),
    unlocked: state.battleUnlocked,
    equipment: Object.fromEntries(EQUIPMENT_SLOT_KEYS.map(slot => [slot, state.equipment?.[slot] || null]))
  }));
  assert.equal(victory.clear, true, 'Real rank-1 victory must persist its clear');
  assert.ok(victory.unlocked >= 2, 'Real rank-1 victory must unlock the next battle rank');
  assertEquipment(victory.equipment, 'After victory');

  await page.evaluate(() => selectBattle(1));
  await page.locator('#battleStartBtn').click();
  await page.waitForFunction(() => window.SHORTCUT_QUEST_BATTLE_ENGINE_V2?.phase === 'fighting');

  await page.evaluate(() => {
    currentBattleContext.hero.hp = 1;
    currentBattleContext.hero.atk = 1;
    currentBattleContext.hero.def = 0;
    currentBattleContext.hero.shieldWallCharges = 0;
    currentBattleContext.hero.shieldWallBonus = 0;
    currentBattleContext.enemy.atk = 9999;
    currentBattleContext.enemy.variance = 0;
    currentBattleContext.enemy.crit = 0;
    currentBattleContext.enemy.hp = currentBattleContext.enemy.maxHp;
  });
  await page.waitForFunction(() => window.SHORTCUT_QUEST_BATTLE_ENGINE_V2?.phase === 'defeat', null, { timeout: 10000 });

  const defeat = await page.evaluate(() => ({
    equipment: Object.fromEntries(EQUIPMENT_SLOT_KEYS.map(slot => [slot, state.equipment?.[slot] || null])),
    stats: {
      atk: state.atk,
      def: state.def,
      hp: state.hp,
      maxHp: getHeroMaxHp()
    }
  }));
  assertEquipment(defeat.equipment, 'After defeat');
  assert.deepEqual(defeat.stats, equipped.stats, 'Victory/defeat must not mutate persisted equipment stats');

  assert.deepEqual(pageErrors, [], `Browser must not emit page errors:\n${pageErrors.join('\n')}`);
  console.log('OK: eight-slot equipment, stat derivation, reload persistence and real victory/defeat contract are stable.');
} finally {
  await browser.close();
}
