import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE_URL = process.env.TK2_BASE_URL || 'http://127.0.0.1:4173/2026/';
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.addScriptTag({ url: new URL('premium-motion.js', BASE_URL).href });
  await page.addScriptTag({ url: new URL('battle-motion.js', BASE_URL).href });
  await page.addScriptTag({ url: new URL('arena-dev-fix.js', BASE_URL).href });
  await page.addScriptTag({ url: new URL('a8-dev-polish.js', BASE_URL).href });
  await page.addScriptTag({ url: new URL('knight-premium-motion.js', BASE_URL).href });

  await page.evaluate(() => {
    const sections = {};
    for (let i = 1; i <= 30; i += 1) sections[String(i)] = 1;
    const battleClears = { '1': true, '2': true, '3': true, '4': true };
    const raw = JSON.parse(localStorage.getItem('shortcutRitter_v1') || '{}');
    raw.sectionClears = sections;
    raw.battleClears = battleClears;
    raw.battleUnlocked = 5;
    localStorage.setItem('shortcutRitter_v1', JSON.stringify(raw));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.addScriptTag({ url: new URL('premium-motion.js', BASE_URL).href });
  await page.addScriptTag({ url: new URL('battle-motion.js', BASE_URL).href });
  await page.addScriptTag({ url: new URL('arena-dev-fix.js', BASE_URL).href });
  await page.addScriptTag({ url: new URL('a8-dev-polish.js', BASE_URL).href });
  await page.addScriptTag({ url: new URL('knight-premium-motion.js', BASE_URL).href });

  await page.locator('.nav-toggle[data-view="battle"]').click();
  await page.waitForFunction(() => document.getElementById('battleView')?.classList.contains('active'));
  await page.locator('#battleButtons .battle-btn[data-enemy="5"]').click();
  await page.waitForTimeout(120);

  const preview = await page.evaluate(() => ({
    itemName: window.SHORTCUT_QUEST_ENEMY_ITEMS?.['5']?.name || '',
    previewItem: document.querySelector('.a8-preview-enemy-item')?.getAttribute('title') || '',
    previewKind: document.querySelector('.a8-preview-enemy-item')?.dataset.kind || '',
    knightPreviewAnimation: getComputedStyle(document.querySelector('#battleView .battle-stage-preview .battle-side.hero .battle-portrait-icon img')).animationName,
    knightMarker: document.getElementById('a8KnightPremiumMotionStyles')?.textContent.includes('A8 PREMIUM KNIGHT MOTION 2026') || false
  }));
  assert.equal(preview.itemName, 'Steinschild');
  assert.equal(preview.previewItem, 'Steinschild');
  assert.equal(preview.previewKind, 'shield');
  assert.match(preview.knightPreviewAnimation, /a8KnightPreviewPremium/, 'Knight preview must use the premium idle');
  assert.equal(preview.knightMarker, true, 'Premium knight motion marker must be installed');

  await page.locator('#battleStartBtn').click();
  await page.waitForFunction(() => !document.getElementById('battleSimulation')?.classList.contains('hidden'));
  await page.waitForFunction(() => (window.A8_PREMIUM_BATTLE_DEBUG?.turns || 0) >= 1, null, { timeout: 3000 });
  await page.waitForFunction(() => {
    const debug = window.A8_KNIGHT_PREMIUM_DEBUG;
    return debug && debug.attacks >= 1 && debug.afterimages >= 1 && debug.slashArcs >= 1 && debug.dustBursts >= 1;
  }, null, { timeout: 3000 });
  await page.waitForTimeout(80);

  const active = await page.evaluate(() => {
    const arena = document.getElementById('battleArena');
    const enemyItem = document.querySelector('#battleEnemy .a8-enemy-item');
    const debug = window.A8_PREMIUM_BATTLE_DEBUG || {};
    const knightDebug = window.A8_KNIGHT_PREMIUM_DEBUG || {};
    const knightStyle = document.getElementById('a8KnightPremiumMotionStyles')?.textContent || '';
    return {
      version: window.A8_PREMIUM_BATTLE?.version || 0,
      knightVersion: window.A8_KNIGHT_PREMIUM?.version || 0,
      itemTitle: enemyItem?.getAttribute('title') || '',
      lastAction: document.getElementById('battleEnemy')?.dataset.lastItemAction || debug.lastItemAction || '',
      turns: debug.turns || 0,
      impacts: debug.impacts || 0,
      itemUses: debug.enemyItemUses || 0,
      knightAttacks: knightDebug.attacks || 0,
      knightAfterimages: knightDebug.afterimages || 0,
      knightSlashes: knightDebug.slashArcs || 0,
      knightDust: knightDebug.dustBursts || 0,
      premiumMarker: document.getElementById('a8BattleMotionStyles')?.textContent.includes('A8 PREMIUM HD BATTLE MOTION 2026') || false,
      knightMarker: knightStyle.includes('A8 PREMIUM KNIGHT MOTION 2026'),
      knightAttackKeyframes: knightStyle.includes('a8KnightAttackPremium') && knightStyle.includes('a8KnightDualBladeFollow'),
      overflow: arena ? arena.scrollWidth > arena.clientWidth + 2 : true
    };
  });

  assert.equal(active.version, 2, 'Premium battle motion API v2 must be installed');
  assert.equal(active.knightVersion, 1, 'Premium knight motion API must be installed');
  assert.equal(active.itemTitle, 'Steinschild', 'Enemy item must be rendered in the active battle');
  assert.ok(active.itemUses >= 1, 'Enemy shield must actually be used when defending');
  assert.equal(active.lastAction, 'block', 'Shield enemy must perform a block action');
  assert.ok(active.impacts >= 1, 'Premium impact burst must fire on a real turn');
  assert.ok(active.knightAttacks >= 1, 'Knight attack choreography must fire on a real hero turn');
  assert.ok(active.knightAfterimages >= 1, 'Knight premium attack must create an afterimage');
  assert.ok(active.knightSlashes >= 1, 'Knight premium attack must create a sword slash arc');
  assert.ok(active.knightDust >= 1, 'Knight premium attack must create planted foot dust');
  assert.equal(active.premiumMarker, true, 'Premium HD motion marker must be installed');
  assert.equal(active.knightMarker, true, 'Premium knight motion marker must be installed');
  assert.equal(active.knightAttackKeyframes, true, 'Knight attack and dual-blade keyframes must exist');
  assert.equal(active.overflow, false, 'Premium FX must not overflow the arena');

  console.log('OK: premium HD battle motion, premium knight choreography, impact FX, and enemy item usage are active.');
} finally {
  await browser.close();
}
