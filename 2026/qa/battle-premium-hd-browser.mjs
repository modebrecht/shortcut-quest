import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE_URL = process.env.TK2_BASE_URL || 'http://127.0.0.1:4173/2026/';
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });

  await page.evaluate(() => {
    const now = Date.now();
    const sections = {};
    for (let i = 1; i <= 30; i += 1) sections[String(i)] = 1;
    const item = (key, name, icon, slot, category, tier, baseAtk = 0, baseDef = 0, baseHp = 0) => ({
      id: `${key}-${now}`, key, name, icon, slot, category, theme: 'knight', description: '', tier,
      totalCopies: 2 ** (tier - 1), baseAtk, baseDef, baseHp,
      atk: baseAtk * tier, def: baseDef * tier, hp: baseHp * tier,
      createdAt: now, lastObtainedAt: now
    });
    const raw = JSON.parse(localStorage.getItem('shortcutRitter_v1') || '{}');
    raw.sectionClears = sections;
    raw.battleClears = { '1': true, '2': true, '3': true, '4': true };
    raw.battleUnlocked = 5;
    raw.items = [
      item('feuer_klinge', 'Feuerklinge', 'sword_fire', 'weapon', 'weapon', 5, 4),
      item('stahl_sword', 'Stahlklinge', 'sword_steel', 'weapon', 'weapon', 4, 3),
      item('taktik_helm', 'Taktikhelm', 'helm', 'helm', 'armor', 5, 1, 1),
      item('panzerhandschuhe', 'Panzerhandschuhe', 'panzerhandschuhe', 'gloves', 'armor', 3, 0, 1),
      item('runen_amulet', 'Runen-Amulett', 'talisman', 'necklace', 'accessory', 2),
      item('stahl_stiefel', 'Stahl-Stiefel', 'stahl-stiefel', 'boots', 'armor', 4, 0, 2),
      item('lebens_ring', 'Lebensring', 'lebensring', 'ring_left', 'accessory', 3, 0, 0, 20),
      item('gluecks_ring', 'Glücksring', 'gluecksring', 'ring_right', 'accessory', 2)
    ];
    raw.equipment = {
      weapon: 'feuer_klinge', offhand: 'stahl_sword', helm: 'taktik_helm',
      gloves: 'panzerhandschuhe', necklace: 'runen_amulet', boots: 'stahl_stiefel',
      ring_left: 'lebens_ring', ring_right: 'gluecks_ring'
    };
    localStorage.setItem('shortcutRitter_v1', JSON.stringify(raw));
  });

  await page.reload({ waitUntil: 'networkidle' });
  for (const file of ['premium-motion.js', 'battle-motion.js', 'arena-dev-fix.js', 'a8-dev-polish.js', 'knight-premium-motion.js', 'gear-visuals.js']) {
    await page.addScriptTag({ url: new URL(file, BASE_URL).href });
  }

  await page.locator('.nav-toggle[data-view="inventory"]').click();
  await page.waitForFunction(() => window.A8_GEAR_VISUALS?.version === 2);
  await page.waitForFunction(() => document.querySelectorAll('#heroAvatar .a8-knight-gear-piece').length === 5);

  const inventory = await page.evaluate(() => {
    const pieces = Array.from(document.querySelectorAll('#heroAvatar .a8-knight-gear-piece'));
    const slot = key => document.querySelector(`#inventoryView [data-equip-slot="${key}"]`);
    const weaponArt = slot('weapon')?.querySelector('.slot-icon > img, .slot-icon > svg');
    return {
      pieceSlots: pieces.map(piece => piece.dataset.slot).sort(),
      helmetPieces: document.querySelectorAll('#heroAvatar .a8-knight-gear-piece[data-slot="helm"]').length,
      ringPieces: document.querySelectorAll('#heroAvatar .a8-knight-gear-piece[data-slot^="ring"]').length,
      framedSlots: document.querySelectorAll('#inventoryView .equipment-slot.a8-tier-frame').length,
      weaponTier: slot('weapon')?.dataset.a8GearTier || '',
      offhandTier: slot('offhand')?.dataset.a8GearTier || '',
      helmTier: slot('helm')?.dataset.a8GearTier || '',
      weaponFilter: weaponArt ? getComputedStyle(weaponArt).filter : 'none',
      gearVersion: window.A8_GEAR_VISUALS?.version || 0
    };
  });

  assert.deepEqual(inventory.pieceSlots, ['boots', 'gloves', 'necklace', 'offhand', 'weapon']);
  assert.equal(inventory.helmetPieces, 0, 'Helmet remains equipped but must not cover the knight head');
  assert.equal(inventory.ringPieces, 0, 'Rings remain UI-only to avoid visual clutter');
  assert.equal(inventory.framedSlots, 8, 'Every equipped slot gets its tier frame');
  assert.equal(inventory.weaponTier, '5');
  assert.equal(inventory.offhandTier, '4');
  assert.equal(inventory.helmTier, '5');
  assert.notEqual(inventory.weaponFilter, 'none', 'Tier 5 weapon must receive the red-hot weapon material');
  assert.equal(inventory.gearVersion, 2);

  await page.locator('.nav-toggle[data-view="battle"]').click();
  await page.waitForFunction(() => document.getElementById('battleView')?.classList.contains('active'));
  await page.locator('#battleButtons .battle-btn[data-enemy="5"]').click();
  await page.waitForTimeout(160);

  const preview = await page.evaluate(() => {
    const heroImage = document.querySelector('#battleView .battle-stage-preview .battle-side.hero .battle-portrait-icon > img');
    const leftWeapon = document.querySelector('#battleView .battle-stage-preview .a8-arena-weapon.weapon-left');
    const rightWeapon = document.querySelector('#battleView .battle-stage-preview .a8-arena-weapon.weapon-right');
    const leftArt = leftWeapon?.querySelector('img,svg');
    return {
      enemyItem: document.querySelector('.a8-preview-enemy-item')?.getAttribute('title') || '',
      bodySlots: Array.from(document.querySelectorAll('#battleView .battle-stage-preview .a8-knight-gear-piece')).map(el => el.dataset.slot).sort(),
      helmetPieces: document.querySelectorAll('#battleView .battle-stage-preview .a8-knight-gear-piece[data-slot="helm"]').length,
      leftTier: leftWeapon?.dataset.a8GearTier || '',
      rightTier: rightWeapon?.dataset.a8GearTier || '',
      leftFilter: leftArt ? getComputedStyle(leftArt).filter : 'none',
      knightIdle: heroImage ? getComputedStyle(heroImage).animationName : '',
      gearMarker: document.getElementById('a8GearVisualStyles')?.textContent.includes('A8 TIERED KNIGHT GEAR VISUALS 2026') || false
    };
  });

  assert.equal(preview.enemyItem, 'Steinschild');
  assert.deepEqual(preview.bodySlots, ['boots', 'gloves', 'necklace']);
  assert.equal(preview.helmetPieces, 0);
  assert.equal(preview.leftTier, '5');
  assert.equal(preview.rightTier, '4');
  assert.notEqual(preview.leftFilter, 'none');
  assert.match(preview.knightIdle, /a8KnightPreviewPremium/);
  assert.equal(preview.gearMarker, true);

  await page.locator('#battleStartBtn').click();
  await page.waitForFunction(() => !document.getElementById('battleSimulation')?.classList.contains('hidden'));
  await page.waitForFunction(() => (window.A8_PREMIUM_BATTLE_DEBUG?.turns || 0) >= 1, null, { timeout: 3000 });
  await page.waitForFunction(() => {
    const d = window.A8_KNIGHT_PREMIUM_DEBUG;
    return d && d.attacks >= 1 && d.afterimages >= 1 && d.slashArcs >= 1 && d.dustBursts >= 1;
  }, null, { timeout: 3000 });

  const active = await page.evaluate(() => ({
    battleVersion: window.A8_PREMIUM_BATTLE?.version || 0,
    knightVersion: window.A8_KNIGHT_PREMIUM?.version || 0,
    gearVersion: window.A8_GEAR_VISUALS?.version || 0,
    enemyItemUses: window.A8_PREMIUM_BATTLE_DEBUG?.enemyItemUses || 0,
    impacts: window.A8_PREMIUM_BATTLE_DEBUG?.impacts || 0,
    bodySlots: Array.from(document.querySelectorAll('#battleKnight .a8-knight-gear-piece')).map(el => el.dataset.slot).sort(),
    helmetPieces: document.querySelectorAll('#battleKnight .a8-knight-gear-piece[data-slot="helm"]').length,
    weaponTier: document.getElementById('battleWeaponSlot1')?.dataset.a8GearTier || '',
    offhandTier: document.getElementById('battleWeaponSlot2')?.dataset.a8GearTier || '',
    overflow: document.getElementById('battleArena')?.scrollWidth > document.getElementById('battleArena')?.clientWidth + 2
  }));

  assert.equal(active.battleVersion, 2);
  assert.equal(active.knightVersion, 1);
  assert.equal(active.gearVersion, 2);
  assert.ok(active.enemyItemUses >= 1);
  assert.ok(active.impacts >= 1);
  assert.deepEqual(active.bodySlots, ['boots', 'gloves', 'necklace']);
  assert.equal(active.helmetPieces, 0);
  assert.equal(active.weaponTier, '5');
  assert.equal(active.offhandTier, '4');
  assert.equal(active.overflow, false);

  console.log('OK: full helmet-free knight loadout, tier frames/materials, premium combat and enemy items are active.');
} finally {
  await browser.close();
}
