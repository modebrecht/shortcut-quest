import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://127.0.0.1:4173/2026/', { waitUntil: 'networkidle' });

  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('shortcutRitter_v1') || '{}');
    state.skills = [
      { key: 'shield_wall', name: 'Alles markieren', icon: 'shield', effect: 'defense', power: 4, description: 'Erhöht DEF um 4 für 5 gegnerische Angriffe.' },
      { key: 'heal', name: 'Drucken', icon: 'heal', effect: 'heal', power: 12, description: 'Heilt 12 HP.' },
      { key: 'strike', name: 'Kopieren', icon: 'lightning', effect: 'damage', power: 6, description: 'Fügt sofort 6 Schaden zu.' },
      { key: 'frenzy', name: 'Suchen', icon: 'target', effect: 'attack', power: 2, description: 'Erhöht ATK um 2 für 5 gegnerische Angriffe.' }
    ];
    localStorage.setItem('shortcutRitter_v1', JSON.stringify(state));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('.nav-toggle[data-view="battle"]').click();
  await page.waitForFunction(() => document.getElementById('battleView')?.classList.contains('active'));

  // Skill controls are intentionally only shown during the real fight.
  await page.locator('#battleStartBtn').click();
  await page.waitForFunction(() => !document.getElementById('battleSimulation')?.classList.contains('hidden'));

  const bar = page.locator('#battleSkillBar');
  await assert.doesNotReject(() => bar.waitFor({ state: 'visible', timeout: 3000 }));

  const ui = await bar.evaluate(el => {
    const cards = Array.from(el.querySelectorAll('.battle-skill'));
    const rect = node => node?.getBoundingClientRect();
    return {
      display: getComputedStyle(el).display,
      overflowX: getComputedStyle(el).overflowX,
      cards: cards.map(card => {
        const button = card.querySelector('button');
        const name = card.querySelector('.battle-skill-name');
        const icon = card.querySelector('.battle-skill-icon');
        const desc = card.querySelector('.battle-skill-desc');
        const hotkey = card.querySelector('.battle-skill-hotkey, .battle-skill-combo');
        return {
          width: rect(card)?.width || 0,
          height: rect(card)?.height || 0,
          scrollHeight: card.scrollHeight,
          clientHeight: card.clientHeight,
          buttonHeight: rect(button)?.height || 0,
          iconWidth: rect(icon)?.width || 0,
          iconHeight: rect(icon)?.height || 0,
          descHeight: rect(desc)?.height || 0,
          nameColor: name ? getComputedStyle(name).color : '',
          descColor: desc ? getComputedStyle(desc).color : '',
          hotkeySize: hotkey ? Math.max(rect(hotkey)?.width || 0, rect(hotkey)?.height || 0) : 0,
          cardOverflow: card.scrollHeight > card.clientHeight + 2,
          buttonCursor: button ? getComputedStyle(button).cursor : ''
        };
      }),
      pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
    };
  });

  console.log('Battle UI metrics:', JSON.stringify(ui));
  assert.equal(ui.cards.length, 4, 'Expected four seeded battle skill cards');
  assert.equal(ui.display, 'grid', 'Desktop skill bar must use a stable grid');
  assert.ok(ui.cards.every(card => card.width >= 210), 'Desktop skill cards must remain comfortably readable');
  assert.ok(ui.cards.every(card => card.height >= 120 && card.height <= 190), 'Skill cards must be compact but not cramped');
  assert.ok(ui.cards.every(card => card.buttonHeight >= 70), 'Skill action area must be comfortably tappable');
  assert.ok(ui.cards.every(card => card.iconWidth >= 40 && card.iconHeight >= 40), 'Skill icon must be a primary visual cue');
  assert.ok(ui.cards.every(card => card.descHeight >= 28), 'Skill effect must remain visibly readable');
  assert.ok(ui.cards.every(card => !card.cardOverflow), 'Skill card content must never be clipped');
  assert.equal(ui.pageOverflow, false, 'Battle skill UI must not create page overflow');

  await bar.screenshot({ path: '/tmp/battle-ui-skill-bar.png' });
  console.log('OK: Battle UI skill bar is compact, readable, unclipped, and responsive-ready.');
} finally {
  await browser.close();
}
