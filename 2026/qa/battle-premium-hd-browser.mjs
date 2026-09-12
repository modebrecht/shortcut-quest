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
      id: `${key}-${now}`,
      key,
      name,
      icon,
      slot,
      category,
      theme: 'knight',
      description: '',
      tier,
      totalCopies: 2 ** (tier - 1),
      baseAtk,
      baseDef,
      baseHp,
      atk: baseAtk * tier,
      def: baseDef * tier,
      hp: baseHp * tier,
      createdAt: now,
      lastObtainedAt: now
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
      weapon: 'feuer_klinge',
      offhand: 'stahl_sword',
      helm: 'taktik_helm',
      gloves: 'panzerhandschuhe',
      necklace: 'runen_amulet',
      boots: 'stahl_stiefel',
      ring_left: 'lebens_ring',
      ring_right: 'gluecks_ring'
    };
    localStorage.setItem('shortcutRitter_v1', JSON.stringify(raw));
  });

  await page.reload({ waitUntil: 'networkidle' });
  await page.addScriptTag({ url: new URL('premium-motion.js', BASE_URL).href });
  await page.addScriptTag({ url: new URL('battle-motion.js', BASE_URL).href });
  await page.addScriptTag({ url: new URL('arena-dev-fix.js', BASE_URL).href });
  await page.addScriptTag({ url: new URL('a8-dev-polish.js', BASE_URL).href });
  await page.addScriptTag({ url: new URL('knight-premium-motion.js', BASE_URL).href });
  await page.addScriptTag({ url: new URL('gear-visuals.js', BASE_URL).href });

  // Equipment view: tier controls the frame; body visuals intentionally exclude helmet/rings.
  await page.locator('.nav-toggle[data-view="inventory"]').click();
  await page.waitForFunction(() => window.A8_GEAR_VISUALS?.version === 1);
  await page.waitForFunction(() => document.querySelectorAll('#heroAvatar .a8-knight-gear-piece').length === 3);
  const inventoryGear = await page.evaluate(() => {
    const slots = Array.from(document.querySelectorAll('#inventoryView [data-equip-slot]'));
    const pieces = Array.from(document.querySelectorAll('#heroAvatar .a8-knight-gear-piece'));
    const weaponSlot = document.querySelector('#inventoryView [data-equip-slot="weapon"]');
    const helmSlot = document.querySelector('#inventoryView [data-equip-slot="helm"]');
    return {
      pieceSlots: pieces.map(piece => piece.dataset.slot).sort(),
      hasHelmetPiece: Boolean(document.querySelector('#heroAvatar .a8-knight-gear-piece[data-slot="helm"]')),
      hasRingPiece: Boolean(document.querySelector('#heroAvatar .a8-knight-gear-piece[data-slot^="ring"]')),
      weaponTier: weaponSlot?.dataset.a8GearTier || '',
      helmTier: helmSlot?.dataset.a8GearTier || '',
      framedSlots: slots.filter(slot => slot.classList.contains('a8-tier-frame')).length,
      gearVersion: window.A8_GEAR_VISUALS?.version || 0,
      helmetSuppressed: window.A8_GEAR_VISUAL_DEBUG?.helmetSuppressed || false
    };
  });
  assert.deepEqual(inventoryGear.pieceSlots, ['boots', 'gloves', 'necklace']);
  assert.equal(inventoryGear.hasHelmetPiece, false, 'Helmet must stay off the knight model');
  assert.equal(inventoryGear.hasRingPiece, false, 'Tiny rings must stay off the knight model');
  assert.equal(inventoryGear.weaponTier, '5', 'Weapon frame must expose the equipped item tier');
  assert.equal(inventoryGear.helmTier, '5', 'Helmet slot still receives its tier frame even though helmet is visually suppressed');
  assert.equal(inventoryGear.framedSlots, 8, 'Every equipped slot must receive a tier frame');
  assert.equal(inventoryGear.gearVersion, 1);
  assert.equal(inventoryGear.helmetSuppressed, true);

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
      itemName: window.SHORTCUT_QUEST_ENEMY_ITEMS?.['5']?.name || '',
      previewItem: document.querySelector('.a8-preview-enemy-item')?.getAttribute('title') || '',
      previewKind: document.querySelector('.a8-preview-enemy-item')?.dataset.kind || '',
      knightPreviewAnimation: heroImage ? getComputedStyle(heroImage).animationName : '',
      knightMarker: document.getElementById('a8KnightPremiumMotionStyles')?.textContent.includes('A8 PREMIUM KNIGHT MOTION 2026') || false,
      gearMarker: document.getElementById('a8GearVisualStyles')?.textContent.includes('A8 TIERED KNIGHT GEAR VISUALS 2026') || false,
      bodyPieces: document.querySelectorAll('#battleView .battle-stage-preview .a8-knight-gear-piece').length,
      helmetPieces: document.querySelectorAll('#battleView .battle-stage-preview .a8-knight-gear-piece[data-slot="helm"]').length,
      leftTier: leftWeapon?.dataset.a8GearTier || '',
      rightTier: rightWeapon?.dataset.a8GearTier || '',
      leftFilter: leftArt ? getComputedStyle(leftArt).filter : 'none'
    };
  });
  assert.equal(preview.itemName, 'Steinschild');
  assert.equal(preview.previewItem, 'Steinschild');
  assert.equal(preview.previewKind, 'shield');
  assert.match(preview.knightPreviewAnimation, /a8KnightPreviewPremium/, 'Knight preview must use the premium idle');
  assert.equal(preview.knightMarker, true, 'Premium knight motion marker must be installed');
  assert.equal(preview.gearMarker, true, 'Tiered knight gear marker must be installed');
  assert.equal(preview.bodyPieces, 3, 'Preview knight must visibly wear gloves, necklace and boots');
  assert.equal(preview.helmetPieces, 0, 'Preview knight must not wear a helmet');
  assert.equal(preview.leftTier, '5');
  assert.equal(preview.rightTier, '4');
  assert.notEqual(preview.leftFilter, 'none', 'Tier 5 sword must receive its red-hot material treatment');

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
    const activeGear = Array.from(document.querySelectorAll('#battleKnight .a8-knight-gear-piece'));
    return {
      version: window.A8_PREMIUM_BATTLE?.version || 0,
      knightVersion: window.A8_KNIGHT_PREMIUM?.version || 0,
      gearVersion: window.A8_GEAR_VISUALS?.version || 0,
      itemTitle: enemyItem?.getAttribute('title') || '',
      lastAction: document.getElementById('battleEnemy')?.dataset.lastItemAction || debug.lastItemAction || '',
      turns: debug.turns || 0,
      impacts: debug.impacts || 0,
      itemUses: debug.enemyItemUses || 0,
      knightAttacks: knightDebug.attacks || 0,
      knightAfterimages: knightDebug.afterimages || 0,
      knightSlashes: knightDebug.slashArcs || 0,
      knightDust: knightDebug.dustBursts || 0,
      activeGearSlots: activeGear.map(piece => piece.dataset.slot).sort(),
      activeHelmetPieces: document.querySelectorAll('#battleKnight .a8-knight-gear-piece[data-slot="helm"]').length,
      weaponTier: document.getElementById('battleWeaponSlot1')?.dataset.a8GearTier || '',
      offhandTier: document.getElementById('battleWeaponSlot2')?.dataset.a8GearTier || '',
      premiumMarker: document.getElementById('a8BattleMotionStyles')?.textContent.includes('A8 PREMIUM HD BATTLE MOTION 2026') || false,
      knightMarker: knightStyle.includes('A8 PREMIUM KNIGHT MOTION 2026'),
      knightAttackKeyframes: knightStyle.includes('a8KnightAttackPremium') && knightStyle.includes('a8KnightDualBladeFollow'),
      overflow: arena ? arena.scrollWidth > arena.clientWidth + 2 : true
    };
  });

  assert.equal(active.version, 2, 'Premium battle motion API v2 must be installed');
  assert.equal(active.knightVersion, 1, 'Premium knight motion API must be installed');
  assert.equal(active.gearVersion, 1, 'Tiered knight gear API must be installed');
  assert.equal(active.itemTitle, 'Steinschild', 'Enemy item must be rendered in the active battle');
  assert.ok(active.itemUses >= 1, 'Enemy shield must actually be used when defending');
  assert.equal(active.lastAction, 'block', 'Shield enemy must perform a block action');
  assert.ok(active.impacts >= 1, 'Premium impact burst must fire on a real turn');
  assert.ok(active.knightAttacks >= 1, 'Knight attack choreography must fire on a real hero turn');
  assert.ok(active.knightAfterimages >= 1, 'Knight premium attack must create an afterimage');
  assert.ok(active.knightSlashes >= 1, 'Knight premium attack must create a sword slash arc');
  assert.ok(active.knightDust >= 1, 'Knight premium attack must create planted foot dust');
  assert.deepEqual(active.activeGearSlots, ['boots', 'gloves', 'necklace']);
  assert.equal(active.activeHelmetPieces, 0, 'Active battle knight must stay helmet-free');
  assert.equal(active.weaponTier, '5');
  assert.equal(active.offhandTier, '4');
  assert.equal(active.premiumMarker, true, 'Premium HD motion marker must be installed');
  assert.equal(active.knightMarker, true, 'Premium knight motion marker must be installed');
  assert.equal(active.knightAttackKeyframes, true, 'Knight attack and dual-blade keyframes must exist');
  assert.equal(active.overflow, false, 'Premium FX must not overflow the arena');

  console.log('OK: premium battle motion, helmet-free visible gear, tier frames, tiered weapon material, and enemy item usage are active.');
} finally {
  await browser.close();
}
