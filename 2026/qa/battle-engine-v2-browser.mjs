import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE_URL = process.env.TK2_BASE_URL || 'http://127.0.0.1:4173/2026/';
const FIGHTS = [
  { level: 9, background: 'celestial' },
  { level: 5, background: 'mountain' },
  { level: 1, background: 'forest' }
];
const EXPECTED_SKILLS = new Map([
  ['sturm_hieb', 12],
  ['schutzwall', 7],
  ['kampfrausch', 4],
  ['lichtbrunnen', 18]
]);

function playwrightKey(token) {
  const map = {
    CTRL: 'Control', CONTROL: 'Control', ALT: 'Alt', SHIFT: 'Shift', WIN: 'Meta', META: 'Meta',
    ESC: 'Escape', ESCAPE: 'Escape', ENTER: 'Enter', RETURN: 'Enter', TAB: 'Tab', SPACE: ' ',
    HOME: 'Home', END: 'End', DELETE: 'Delete', BACKSPACE: 'Backspace',
    ARROWUP: 'ArrowUp', ARROWDOWN: 'ArrowDown', ARROWLEFT: 'ArrowLeft', ARROWRIGHT: 'ArrowRight'
  };
  return map[String(token || '').toUpperCase()] || token;
}

async function pressCombo(page, sequence) {
  assert.ok(Array.isArray(sequence) && sequence.length >= 2, `Expected a real shortcut combo, got ${JSON.stringify(sequence)}`);
  const keys = sequence.map(playwrightKey);
  for (const key of keys) await page.keyboard.down(key);
  await page.waitForTimeout(30);
  for (const key of [...keys].reverse()) await page.keyboard.up(key);
}

async function currentCombo(page, skillKey) {
  return page.evaluate(key => {
    const entry = battleSkillStates.find(candidate => candidate?.skill?.key === key);
    return entry ? { sequence: entry.comboSequence?.slice() || [], display: entry.hotkeyDisplay || '' } : null;
  }, skillKey);
}

async function finishCurrentBattle(page) {
  await page.waitForFunction(() => {
    const engine = window.SHORTCUT_QUEST_BATTLE_ENGINE_V2;
    return engine && (engine.phase === 'victory' || engine.phase === 'defeat');
  }, null, { timeout: 45000 });
  return page.evaluate(() => ({
    version: window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.version,
    phase: window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.phase,
    runId: window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.runId,
    turn: window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.turn,
    lastActor: window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.lastActor,
    lastOutcome: window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.lastOutcome,
    lastError: window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.lastError,
    datasetPhase: document.getElementById('battleView')?.dataset.battlePhase || '',
    resultText: document.getElementById('battleResult')?.textContent?.trim() || '',
    logCount: document.querySelectorAll('#battleLog > *, .battle-log > *').length
  }));
}

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error?.stack || error)));

  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.addScriptTag({ url: new URL('premium-motion.js', BASE_URL).href });
  await page.addScriptTag({ url: new URL('battle-motion.js', BASE_URL).href });
  await page.addScriptTag({ url: new URL('arena-dev-fix.js', BASE_URL).href });
  await page.addScriptTag({ url: new URL('a8-dev-polish.js', BASE_URL).href });
  await page.addScriptTag({ url: new URL('battle-continuity.js', BASE_URL).href });
  await page.addScriptTag({ url: new URL('battle-balance.js', BASE_URL).href });

  const initialEngine = await page.evaluate(() => window.SHORTCUT_QUEST_BATTLE_ENGINE_V2);
  assert.ok(initialEngine, 'Battle V2 engine state must be exposed for diagnostics');
  assert.equal(initialEngine.version, 2, 'Battle engine must report version 2');
  assert.equal(initialEngine.phase, 'idle', 'Battle engine should start idle');
  assert.equal(initialEngine.turn, 0, 'Battle engine should start at turn 0');

  const balance = await page.evaluate(() => ({
    version: window.SHORTCUT_QUEST_BATTLE_BALANCE?.version,
    installed: window.SHORTCUT_QUEST_BATTLE_BALANCE?.installed,
    multiplier: window.SHORTCUT_QUEST_BATTLE_BALANCE?.heroAutoAttackMultiplier,
    cooldown: window.SHORTCUT_QUEST_BATTLE_BALANCE?.cooldownTurns,
    cap: window.SHORTCUT_QUEST_BATTLE_BALANCE?.shortcutCoinCap,
    powers: Object.fromEntries(['sturm_hieb', 'schutzwall', 'kampfrausch', 'lichtbrunnen'].map(key => [key, window.SHORTCUT_QUEST_BATTLE_BALANCE?.getSkillBasePower(key, 1)]))
  }));
  assert.equal(balance.version, 1, 'Balance overlay must expose version 1');
  assert.equal(balance.installed, true, 'Balance overlay must patch the live Battle V2 runtime');
  assert.equal(balance.multiplier, 0.45, 'Hero autohit multiplier must be battle-only 45%');
  assert.equal(balance.cooldown, 4, 'Normal skill cooldown must be configured to 4 turns');
  assert.equal(balance.cap, 4, 'Shortcut coin cap must be exactly 4 per battle');
  for (const [key, power] of EXPECTED_SKILLS) {
    assert.equal(balance.powers[key], power, `${key} tier-1 baseline must be ${power}`);
  }

  const directCooldownProbe = await page.evaluate(() => {
    const hero = { skillCooldowns: Object.create(null) };
    setHeroSkillCooldown(hero, 'qa_probe', 5);
    return getHeroSkillCooldown(hero, 'qa_probe');
  });
  assert.equal(directCooldownProbe, 4, 'Legacy/default 5-turn cooldown must now start at exactly 4');

  const equipment = await page.evaluate(() => {
    const now = Date.now();
    const sectionClears = {};
    const battleClears = {};
    for (let i = 1; i <= 30; i += 1) sectionClears[String(i)] = 1;
    for (let i = 1; i <= 8; i += 1) battleClears[String(i)] = true;

    state.sectionClears = sectionClears;
    state.battleClears = battleClears;
    state.battleUnlocked = 9;
    state.coins = 50;
    state.skills = SKILL_POOL.map(skill => ({ ...skill, tier: 1, totalCopies: 1, overcapBonusPercent: 0 }));
    state.items = [{
      id: `qa-balance-blade-${now}`,
      key: 'qa_balance_blade',
      name: 'QA Balance Blade',
      icon: 'sword_steel',
      slot: 'weapon',
      category: 'weapon',
      theme: 'knight',
      description: 'QA equipment probe',
      baseAtk: 7,
      baseDef: 0,
      baseHp: 0,
      atk: 7,
      def: 0,
      hp: 0,
      tier: 1,
      totalCopies: 1,
      createdAt: now,
      lastObtainedAt: now
    }];
    state.equipment = {};
    recalcStats();
    const unequippedAtk = state.atk;
    equipItem('weapon', 'qa_balance_blade');
    recalcStats();
    const equippedAtk = state.atk;
    saveState();
    updateUI();
    renderBattleButtons();
    return { unequippedAtk, equippedAtk, equippedKey: state.equipment?.weapon || '', battleUnlocked: state.battleUnlocked };
  });
  assert.equal(equipment.equippedKey, 'qa_balance_blade', 'QA weapon must be equipped through the real inventory flow');
  assert.ok(equipment.equippedAtk > equipment.unequippedAtk, 'Equipment must still increase combat ATK');
  assert.equal(equipment.battleUnlocked, 9, 'QA setup must expose the three themed battle ranges');

  await page.locator('.nav-toggle[data-view="battle"]').click();
  await page.waitForFunction(() => document.getElementById('battleView')?.classList.contains('active'));
  await page.waitForFunction(() => document.getElementById('battleStagePreview')?.classList.contains('arena-svg-composed'));

  const preview = await page.locator('#battleStagePreview').evaluate(stage => ({
    background: getComputedStyle(stage).backgroundImage,
    arenaSvg: stage.classList.contains('arena-svg-composed')
  }));
  assert.equal(preview.arenaSvg, true, 'Pre-battle premium arena composition must remain active');
  assert.match(preview.background, /arena-scene\.svg/i, 'Pre-battle must still use premium arena-scene.svg');

  await page.evaluate(() => { Math.random = () => 0.5; });

  const completed = [];
  for (let fightIndex = 0; fightIndex < FIGHTS.length; fightIndex += 1) {
    const { level, background } = FIGHTS[fightIndex];
    const battleButton = page.locator(`#battleButtons .battle-btn[data-enemy="${level}"]`);
    assert.equal(await battleButton.isEnabled(), true, `Fight ${fightIndex + 1}: rank ${level} must be enabled in the QA setup`);
    await battleButton.click();

    const before = await page.evaluate(() => ({
      runId: window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.runId,
      phase: window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.phase,
      coins: state.coins
    }));
    assert.notEqual(before.phase, 'fighting', `Fight ${fightIndex + 1}: previous fight must not still be running`);

    await page.locator('#battleStartBtn').click();
    await page.waitForFunction(previousRunId => {
      const engine = window.SHORTCUT_QUEST_BATTLE_ENGINE_V2;
      return engine?.phase === 'fighting' && engine.runId === previousRunId + 1;
    }, before.runId);

    const started = await page.evaluate(() => ({
      phase: window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.phase,
      datasetPhase: document.getElementById('battleView')?.dataset.battlePhase || '',
      shortcutCoins: window.SHORTCUT_QUEST_BATTLE_BALANCE.shortcutCoinsThisBattle,
      shortcutActivations: window.SHORTCUT_QUEST_BATTLE_BALANCE.shortcutActivationsThisBattle,
      heroAtk: currentBattleContext?.hero?.atk || 0,
      stateAtk: state.atk
    }));
    assert.equal(started.phase, 'fighting', `Fight ${fightIndex + 1}: state must enter fighting`);
    assert.equal(started.datasetPhase, 'fighting', `Fight ${fightIndex + 1}: DOM diagnostics must mirror fighting state`);
    assert.equal(started.shortcutCoins, 0, `Fight ${fightIndex + 1}: shortcut coin counter must reset at battle start`);
    assert.equal(started.shortcutActivations, 0, `Fight ${fightIndex + 1}: shortcut activation counter must reset at battle start`);
    assert.equal(started.heroAtk, started.stateAtk, `Fight ${fightIndex + 1}: equipped combat ATK must reach the battle hero`);

    await page.waitForFunction(() => Boolean(document.querySelector('#battleArena .a8-themed-battle-backdrop')));
    const scene = await page.locator('#battleArena').evaluate(arena => {
      const backdrop = arena.querySelector('.a8-themed-battle-backdrop');
      const hero = arena.querySelector('.fighter.knight');
      const enemy = arena.querySelector('.fighter.enemy');
      const hr = hero?.getBoundingClientRect();
      const er = enemy?.getBoundingClientRect();
      return {
        background: backdrop ? getComputedStyle(backdrop).backgroundImage : '',
        sharedGroundDelta: Math.abs((hr?.bottom || 0) - (er?.bottom || 0))
      };
    });
    assert.match(scene.background, new RegExp(`battle-bg-${background}\\.svg`, 'i'), `Fight ${fightIndex + 1}: active battle must keep ${background} SVG theme`);
    assert.ok(scene.sharedGroundDelta <= 2, `Fight ${fightIndex + 1}: fighters must share one groundline (delta ${scene.sharedGroundDelta})`);

    if (fightIndex === 0) {
      await page.evaluate(() => {
        currentBattleContext.hero.hp = 800;
        currentBattleContext.hero.maxHp = 1000;
        currentBattleContext.enemy.hp = 1000;
        currentBattleContext.enemy.maxHp = 1000;
        currentBattleContext.enemy.atk = 0;
        currentBattleContext.enemy.variance = 0;
        currentBattleContext.enemy.crit = 0;
      });

      const damageProbe = await page.evaluate(() => {
        const hero = currentBattleContext.hero;
        const saved = { atk: hero.atk, variance: hero.variance, crit: hero.crit };
        hero.atk = 20;
        hero.variance = 0;
        hero.crit = 0;
        const dummy = { def: 0, shieldWallCharges: 0, shieldWallBonus: 0 };
        const heroAuto = calculateDamage(hero, dummy).amount;
        const enemyAuto = calculateDamage({ atk: 20, variance: 0, crit: 0 }, dummy).amount;
        Object.assign(hero, saved);
        return { heroAuto, enemyAuto };
      });
      assert.equal(damageProbe.heroAuto, 9, '20 raw hero autohit damage must become 9 at the 45% Battle multiplier');
      assert.equal(damageProbe.enemyAuto, 20, 'Enemy damage must remain unnerfed');

      const skillSnapshot = await page.evaluate(() => ({
        skills: battleSkillStates.map(entry => ({
          key: entry.skill.key,
          power: getSkillEffectivePower(entry.skill),
          combo: entry.comboSequence?.slice() || []
        })),
        coinStart: state.coins
      }));
      assert.equal(skillSnapshot.skills.length, 4, 'All four shortcut skills must be available in battle');
      for (const [key, power] of EXPECTED_SKILLS) {
        const entry = skillSnapshot.skills.find(skill => skill.key === key);
        assert.ok(entry, `${key} must be present in Battle V2`);
        assert.equal(entry.power, power, `${key} must apply the new tier-1 power`);
        assert.ok(entry.combo.length >= 2, `${key} must be activated by a real shortcut combo`);
      }

      let successful = 0;
      for (const skillKey of EXPECTED_SKILLS.keys()) {
        if (skillKey === 'lichtbrunnen') {
          await page.evaluate(() => { currentBattleContext.hero.hp = Math.min(currentBattleContext.hero.hp, 800); });
        }
        const effectBefore = await page.evaluate(() => ({
          heroHp: currentBattleContext.hero.hp,
          heroAtk: currentBattleContext.hero.atk,
          shieldBonus: currentBattleContext.hero.shieldWallBonus || 0,
          enemyHp: currentBattleContext.enemy.hp
        }));
        const combo = await currentCombo(page, skillKey);
        assert.ok(combo, `${skillKey} must have an assigned shortcut`);
        await pressCombo(page, combo.sequence);
        successful += 1;
        await page.waitForFunction(count => window.SHORTCUT_QUEST_BATTLE_BALANCE.shortcutActivationsThisBattle === count, successful);
        if (skillKey === 'sturm_hieb') {
          await page.waitForFunction(enemyHpBefore => currentBattleContext.enemy.hp <= enemyHpBefore - 12, effectBefore.enemyHp, { timeout: 2500 });
        }

        const afterSkill = await page.evaluate(key => ({
          coins: state.coins,
          shortcutCoins: window.SHORTCUT_QUEST_BATTLE_BALANCE.shortcutCoinsThisBattle,
          cooldown: getHeroSkillCooldown(currentBattleContext.hero, key),
          heroHp: currentBattleContext.hero.hp,
          heroAtk: currentBattleContext.hero.atk,
          shieldBonus: currentBattleContext.hero.shieldWallBonus || 0,
          enemyHp: currentBattleContext.enemy.hp,
          strongVisual: document.getElementById('battleArena')?.classList.contains('a8-skill-impact-strong') || false,
          rewardLog: Array.from(document.querySelectorAll('#battleLog > *, .battle-log > *')).some(node => /Shortcut-Bonus/.test(node.textContent || ''))
        }), skillKey);

        assert.equal(afterSkill.coins, skillSnapshot.coinStart + successful, `${skillKey}: valid shortcut must grant exactly +1 coin`);
        assert.equal(afterSkill.shortcutCoins, successful, `${skillKey}: shortcut counter must advance exactly once`);
        assert.ok(afterSkill.cooldown === 4 || afterSkill.cooldown === 3, `${skillKey}: cooldown must start at 4 and may already have ticked once during the live turn loop (got ${afterSkill.cooldown})`);
        assert.equal(afterSkill.strongVisual, true, `${skillKey}: shortcut skill must use stronger visual emphasis`);
        assert.equal(afterSkill.rewardLog, true, `${skillKey}: +1 shortcut reward must be visibly surfaced`);

        if (skillKey === 'sturm_hieb') assert.ok(afterSkill.enemyHp <= effectBefore.enemyHp - 12, 'Sturm-Hieb must apply at least 12 instant damage after its lightning callback');
        if (skillKey === 'schutzwall') assert.equal(afterSkill.shieldBonus, 7, 'Schutzwall must apply +7 DEF baseline');
        if (skillKey === 'kampfrausch') assert.ok(afterSkill.heroAtk >= effectBefore.heroAtk + 4, 'Kampfrausch must apply +4 ATK baseline');
        if (skillKey === 'lichtbrunnen') assert.ok(afterSkill.heroHp >= effectBefore.heroHp + 18, 'Lichtbrunnen must heal at least 18 HP');

        if (successful === 1) {
          const blockedCombo = await currentCombo(page, skillKey);
          const blockedBefore = await page.evaluate(() => ({ coins: state.coins, activations: window.SHORTCUT_QUEST_BATTLE_BALANCE.shortcutActivationsThisBattle }));
          await pressCombo(page, blockedCombo.sequence);
          await page.waitForTimeout(70);
          const blockedAfter = await page.evaluate(() => ({ coins: state.coins, activations: window.SHORTCUT_QUEST_BATTLE_BALANCE.shortcutActivationsThisBattle }));
          assert.deepEqual(blockedAfter, blockedBefore, 'Cooldown-blocked shortcut must not grant a coin or count as a valid activation');
        }
      }

      assert.equal(await page.evaluate(() => window.SHORTCUT_QUEST_BATTLE_BALANCE.shortcutCoinsThisBattle), 4, 'Shortcut bonus must reach exactly the 4-coin cap');
      assert.equal(await page.evaluate(() => state.coins), skillSnapshot.coinStart + 4, 'Four valid shortcuts must grant exactly four immediate coins');

      const repeatKey = 'sturm_hieb';
      await page.waitForFunction(key => getHeroSkillCooldown(currentBattleContext.hero, key) === 0, repeatKey, { timeout: 12000 });
      const capCombo = await currentCombo(page, repeatKey);
      const beforeCapAttempt = await page.evaluate(() => ({
        coins: state.coins,
        bonus: window.SHORTCUT_QUEST_BATTLE_BALANCE.shortcutCoinsThisBattle,
        activations: window.SHORTCUT_QUEST_BATTLE_BALANCE.shortcutActivationsThisBattle
      }));
      await pressCombo(page, capCombo.sequence);
      await page.waitForFunction(count => window.SHORTCUT_QUEST_BATTLE_BALANCE.shortcutActivationsThisBattle === count + 1, beforeCapAttempt.activations);
      const afterCapAttempt = await page.evaluate(() => ({ coins: state.coins, bonus: window.SHORTCUT_QUEST_BATTLE_BALANCE.shortcutCoinsThisBattle }));
      assert.equal(afterCapAttempt.bonus, 4, 'Fifth valid shortcut must not exceed the 4-coin cap');
      assert.equal(afterCapAttempt.coins, beforeCapAttempt.coins, 'Fifth valid shortcut must not farm another coin');

      await page.evaluate(() => { currentBattleContext.enemy.hp = 1; });
    } else if (fightIndex === 1) {
      await page.evaluate(() => {
        currentBattleContext.hero.hp = 1000;
        currentBattleContext.hero.maxHp = 1000;
        currentBattleContext.enemy.hp = 1000;
        currentBattleContext.enemy.maxHp = 1000;
        currentBattleContext.enemy.atk = 0;
      });
      const coinStart = before.coins;
      const combo = await currentCombo(page, 'schutzwall');
      await pressCombo(page, combo.sequence);
      await page.waitForFunction(() => window.SHORTCUT_QUEST_BATTLE_BALANCE.shortcutCoinsThisBattle === 1);
      const resetProof = await page.evaluate(() => ({ coins: state.coins, bonus: window.SHORTCUT_QUEST_BATTLE_BALANCE.shortcutCoinsThisBattle }));
      assert.equal(resetProof.bonus, 1, 'Second battle must start a fresh shortcut bonus counter');
      assert.equal(resetProof.coins, coinStart + 1, 'Second battle first valid shortcut must again grant exactly +1 coin');
      await page.evaluate(() => { currentBattleContext.enemy.hp = 1; });
    }

    await page.waitForFunction(() => {
      const engine = window.SHORTCUT_QUEST_BATTLE_ENGINE_V2;
      return engine && (engine.turn >= 3 || engine.phase !== 'fighting');
    }, null, { timeout: 7000 });

    const result = await finishCurrentBattle(page);
    assert.equal(result.version, 2);
    assert.equal(result.runId, before.runId + 1, `Fight ${fightIndex + 1}: exactly one battle session must start`);
    assert.ok(result.turn >= 2, `Fight ${fightIndex + 1}: battle must advance beyond the opening strike`);
    assert.ok(['hero', 'enemy'].includes(result.lastActor), `Fight ${fightIndex + 1}: a real actor must complete a turn`);
    assert.ok(['victory', 'defeat'].includes(result.phase), `Fight ${fightIndex + 1}: battle must finish in a terminal state`);
    assert.equal(result.lastOutcome, result.phase, `Fight ${fightIndex + 1}: outcome and phase must agree`);
    assert.equal(result.datasetPhase, result.phase, `Fight ${fightIndex + 1}: DOM diagnostics must mirror terminal state`);
    assert.equal(result.lastError, null, `Fight ${fightIndex + 1}: engine must not fail internally`);
    assert.match(result.resultText, /Sieg|Niederlage/i, `Fight ${fightIndex + 1}: student must receive a clear result`);
    assert.ok(result.logCount >= 3, `Fight ${fightIndex + 1}: combat log must contain multiple events`);
    completed.push(result);

    if (fightIndex < FIGHTS.length - 1) {
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => document.getElementById('battleSimulation')?.classList.contains('hidden'));
      await page.waitForFunction(() => {
        const button = document.getElementById('battleStartBtn');
        return button && getComputedStyle(button).display !== 'none';
      });
    }
  }

  assert.deepEqual(completed.map(result => result.runId), [1, 2, 3], 'Three sequential fights must use distinct sessions');
  assert.equal(pageErrors.length, 0, `Battle V2 produced page errors:\n${pageErrors.join('\n')}`);
  console.log(`OK: Battle balance + V2 completed 3 sequential fights (${completed.map(x => `${x.phase}/${x.turn}t`).join(', ')}).`);
} finally {
  await browser.close();
}
