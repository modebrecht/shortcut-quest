import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE_URL = process.env.TK2_BASE_URL || 'http://127.0.0.1:4173/2026/';
const EXPECTED_REWARDS = [1, 1, 2, 2, 3, 4, 4, 4, 5, 5, 100];
const EXPECTED_ITEMS = [
  null,
  null,
  ['rust_blade', 'weapon'],
  null,
  ['cave_shield', 'shield'],
  ['heavy_club', 'weapon'],
  ['shadow_rune', 'focus'],
  ['war_blade', 'weapon'],
  ['void_charm', 'focus'],
  ['ember_blade', 'weapon'],
  ['royal_elixir', 'heal']
];

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

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error?.stack || error)));

  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await installBattleRuntime(page);

  const roster = await page.evaluate(() => ({
    enemies: ENEMY_DATA.map((enemy, index) => ({
      level: index + 1,
      name: enemy.name,
      hp: Number(enemy.hp),
      atk: Number(enemy.atk),
      def: Number(enemy.def),
      reward: Number(BATTLE_LEVEL_REWARDS[index + 1] || 0),
      rewardLabel: formatBattleReward(index + 1),
      item: enemy.item ? {
        key: enemy.item.key,
        kind: enemy.item.kind,
        once: Boolean(enemy.item.once)
      } : null
    })),
    exportedItems: window.SHORTCUT_QUEST_ENEMY_ITEMS,
    consumedHealResolutionGuard: window.SHORTCUT_QUEST_BATTLE_BALANCE?.consumedHealResolutionGuard
  }));

  assert.equal(roster.enemies.length, 11, 'Battle roster must contain exactly ranks 1–11');
  assert.equal(roster.consumedHealResolutionGuard, true, 'Consumed-heal guard must be installed at resolver boundary');

  roster.enemies.forEach((enemy, index) => {
    const expectedLevel = index + 1;
    assert.equal(enemy.level, expectedLevel, `Roster position ${index} must map to rank ${expectedLevel}`);
    assert.ok(enemy.name, `Rank ${expectedLevel} must have a name`);
    assert.ok(enemy.hp > 0, `Rank ${expectedLevel} HP must be positive`);
    assert.ok(enemy.atk >= 0, `Rank ${expectedLevel} ATK must be non-negative`);
    assert.ok(enemy.def >= 0, `Rank ${expectedLevel} DEF must be non-negative`);
    assert.equal(enemy.reward, EXPECTED_REWARDS[index], `Rank ${expectedLevel} reward contract changed`);
    assert.match(enemy.rewardLabel, /Coin/i, `Rank ${expectedLevel} reward label must mention Coin`);

    const expectedItem = EXPECTED_ITEMS[index];
    if (!expectedItem) {
      assert.equal(enemy.item, null, `Rank ${expectedLevel} must not gain an unexpected enemy item`);
      assert.equal(roster.exportedItems[String(expectedLevel)] ?? null, null, `Exported rank ${expectedLevel} item must stay null`);
      return;
    }

    assert.equal(enemy.item?.key, expectedItem[0], `Rank ${expectedLevel} item key changed`);
    assert.equal(enemy.item?.kind, expectedItem[1], `Rank ${expectedLevel} item kind changed`);
    assert.equal(roster.exportedItems[String(expectedLevel)]?.key, expectedItem[0], `Exported rank ${expectedLevel} item key changed`);
    assert.equal(roster.exportedItems[String(expectedLevel)]?.kind, expectedItem[1], `Exported rank ${expectedLevel} item kind changed`);
  });

  assert.equal(roster.enemies[10].item?.once, true, 'Königselixier must remain one-shot');

  await page.evaluate(() => {
    const sectionClears = {};
    for (let i = 1; i <= 30; i += 1) sectionClears[String(i)] = 1;
    state.sectionClears = sectionClears;
    state.battleClears = Object.fromEntries(Array.from({ length: 10 }, (_, index) => [String(index + 1), true]));
    state.battleUnlocked = 11;
    state.coins = 0;
    saveState();
    updateUI();
    renderBattleButtons();
    selectBattle(11);
  });

  await page.locator('.nav-toggle[data-view="battle"]').click();
  await page.waitForFunction(() => document.getElementById('battleView')?.classList.contains('active'));
  await page.evaluate(() => selectBattle(11));
  await page.locator('#battleStartBtn').click();
  await page.waitForFunction(() => window.SHORTCUT_QUEST_BATTLE_ENGINE_V2?.phase === 'fighting');

  const beforeElixir = await page.evaluate(() => {
    const hero = currentBattleContext.hero;
    const enemy = currentBattleContext.enemy;
    hero.maxHp = 100000;
    hero.hp = 100000;
    hero.atk = 1;
    hero.variance = 0;
    hero.crit = 0;
    enemy.hp = Math.max(1, Math.floor(enemy.maxHp * 0.4));
    enemy.atk = 0;
    enemy.variance = 0;
    enemy.crit = 0;
    return {
      hp: enemy.hp,
      maxHp: enemy.maxHp,
      useCount: enemy.item?.useCount || 0
    };
  });
  assert.equal(beforeElixir.useCount, 0, 'Königselixier must start unused');

  await page.waitForFunction(() => currentBattleContext?.enemy?.item?.used === true, null, { timeout: 10000 });

  const afterHeal = await page.evaluate(() => ({
    hp: currentBattleContext.enemy.hp,
    useCount: currentBattleContext.enemy.item.useCount,
    turn: window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.turn,
    used: currentBattleContext.enemy.item.used
  }));
  assert.equal(afterHeal.used, true, 'Königselixier must mark itself consumed');
  assert.equal(afterHeal.useCount, 1, 'Königselixier must count exactly one heal use');
  assert.ok(afterHeal.hp > beforeElixir.hp, 'Königselixier must actually heal the king');

  await page.waitForFunction(
    turn => window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.phase !== 'fighting'
      || window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.turn >= turn + 4,
    afterHeal.turn,
    { timeout: 12000 }
  );

  const afterLaterTurns = await page.evaluate(() => ({
    phase: window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.phase,
    used: currentBattleContext?.enemy?.item?.used,
    useCount: currentBattleContext?.enemy?.item?.useCount
  }));
  assert.equal(afterLaterTurns.used, true, 'Consumed Königselixier must stay consumed');
  assert.equal(afterLaterTurns.useCount, 1, 'Consumed Königselixier must never re-enter generic focus/weapon fallback');

  assert.deepEqual(pageErrors, [], `Browser must not emit page errors:\n${pageErrors.join('\n')}`);
  console.log('OK: ranks 1–11, reward map, enemy items and Königselixier resolver contract are stable.');
} finally {
  await browser.close();
}
