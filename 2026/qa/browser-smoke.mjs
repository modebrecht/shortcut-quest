import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.TK2_BASE_URL || 'http://127.0.0.1:4173/2026/';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const pageErrors = [];
const consoleErrors = [];

page.on('pageerror', error => pageErrors.push(String(error && error.stack ? error.stack : error)));
page.on('console', message => {
  if (message.type() === 'error') consoleErrors.push(message.text());
});

async function solveSimpleSection(sectionId, { spacedPlus = false } = {}) {
  const section = page.locator(`.section[data-section="${sectionId}"]`);
  await section.waitFor({ state: 'attached' });
  const inputs = section.locator('input[data-answer]');
  for (let i = 0; i < await inputs.count(); i += 1) {
    const input = inputs.nth(i);
    const answer = await input.getAttribute('data-answer');
    assert.ok(answer, `Section ${sectionId}: input ${i} has no answer`);
    await input.fill(spacedPlus ? answer.replace(/\+/g, ' + ') : answer);
  }
  const selects = section.locator('select[data-answer]');
  for (let i = 0; i < await selects.count(); i += 1) {
    const select = selects.nth(i);
    const answer = await select.getAttribute('data-answer');
    assert.ok(answer, `Section ${sectionId}: select ${i} has no answer`);
    await select.selectOption({ value: answer });
  }
  await section.locator(`.check-section[data-check-section="${sectionId}"]`).click();
  await page.waitForTimeout(150);
}

async function solveDndSection(sectionId) {
  await page.locator(`.section-tab[data-goto="${sectionId}"]`).click();
  await page.evaluate(id => {
    const section = document.querySelector(`.section[data-section="${id}"]`);
    if (!section) throw new Error(`DnD section ${id} missing`);
    section.querySelectorAll('.dnd-target').forEach(target => {
      const answer = target.getAttribute('data-answer');
      const slot = target.querySelector('.drop-slot');
      if (!answer || !slot) throw new Error(`DnD target incomplete in section ${id}`);
      slot.dataset.value = answer;
      slot.textContent = answer;
    });
  }, sectionId);
  await page.locator(`.section[data-section="${sectionId}"] .check-section[data-check-section="${sectionId}"]`).click();
  await page.waitForTimeout(150);
}

async function readState() {
  return page.evaluate(() => JSON.parse(localStorage.getItem('shortcutRitter_v1')));
}

try {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  assert.equal(await page.title(), 'A8 · Shortcut Quest 2026');
  assert.equal(await page.locator('html').getAttribute('data-edition'), 'tk2-2026');
  assert.match((await page.locator('header .title').textContent()) || '', /A8.*Shortcut Quest 2026/);
  assert.equal((await page.locator('#a8ProgressBadge').textContent())?.trim(), '0 / 30');

  // The inherited runtime deliberately exposes the first 10 training sections.
  assert.equal(await page.locator('.section-tab').count(), 10, 'Expected 10 initially available sections');
  assert.equal(await page.locator('.memory-game').count(), 0, 'Memory UI must not be rendered in A8');

  // Game-first opening gate: A8 must not begin with copy-the-shortcut text fields.
  const openingMission = page.locator('.section[data-section="1"]');
  assert.equal(await openingMission.locator('.narrative-card').count(), 6, 'Section 1 should render six scenario cards');
  assert.equal(await openingMission.locator('input[data-answer]').count(), 0, 'Section 1 must not contain copy-recall inputs');
  const reflexRound = page.locator('.section[data-section="2"]');
  assert.equal(await reflexRound.locator('.fast-paced').count(), 1, 'Section 2 should render the reflex round');
  assert.equal(await reflexRound.locator('input[data-answer]').count(), 0, 'Section 2 must not contain copy-recall inputs');
  assert.ok(await reflexRound.locator('.fast-paced-start').isVisible(), 'Section 2 reflex start button should be visible');

  // First progression clear now uses a recognition section rather than the
  // deliberately game-like opening mission.
  await page.locator('.section-tab[data-goto="3"]').click();
  await solveSimpleSection('3');
  let state = await readState();
  assert.ok(Number(state.sectionClears?.['3']) > 0, 'Section 3 was not persisted as cleared');
  assert.ok(Number(state.coins) > 0, 'Perfect section should award coins');
  assert.equal(Number(state.sectionsUnlocked), 11, 'First clear should unlock section 11');
  assert.equal((await page.locator('#a8ProgressBadge').textContent())?.trim(), '1 / 30');
  assert.equal(await page.locator('.section-tab').count(), 11, 'Section 11 tab should appear after first clear');

  // New 2026 mechanic: Workflow Chain uses the stable Combo Builder runtime.
  await page.locator('.section-tab[data-goto="11"]').click();
  await solveSimpleSection('11');
  state = await readState();
  assert.ok(Number(state.sectionClears?.['11']) > 0, 'Workflow Chain section did not score/persist');
  assert.equal(Number(state.sectionsUnlocked), 12, 'Workflow clear should unlock the next section');
  assert.equal((await page.locator('#a8ProgressBadge').textContent())?.trim(), '2 / 30');

  // Third learned section: learning alone must NOT skip Battle 1.
  await page.locator('.section-tab[data-goto="4"]').click();
  await solveSimpleSection('4');
  state = await readState();
  assert.equal(Number(state.battleUnlocked), 1, 'Battle 2 must stay gated until Battle 1 is defeated');
  assert.equal((await page.locator('#a8ProgressBadge').textContent())?.trim(), '3 / 30');

  await page.locator('.nav-toggle[data-view="battle"]').click();
  assert.equal(await page.locator('.battle-btn[data-enemy="1"]').isDisabled(), false, 'Battle 1 should be available immediately');
  assert.equal(await page.locator('.battle-btn[data-enemy="2"]').isDisabled(), true, 'Battle 2 should still be locked');

  // Simulate the persisted result of winning Battle 1; the 2026 state normalizer
  // must now permit Battle 2 because three sections are already mastered.
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('shortcutRitter_v1'));
    state.battleClears = { ...(state.battleClears || {}), '1': true };
    localStorage.setItem('shortcutRitter_v1', JSON.stringify(state));
  });
  state = await readState();
  assert.equal(Number(state.battleUnlocked), 2, 'Three section clears + Battle 1 should unlock Battle 2');
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('.nav-toggle[data-view="battle"]').click();
  assert.equal(await page.locator('.battle-btn[data-enemy="2"]').isDisabled(), false, 'Battle 2 button should unlock after reload');

  // Exercise a real Drag & Drop grading path.
  await page.locator('.nav-toggle[data-view="learn"]').click();
  await solveDndSection('6');
  state = await readState();
  assert.ok(Number(state.sectionClears?.['6']) > 0, 'Drag & Drop section did not score/persist');

  // Keep the typed-input spacing regression test, but move it to a later recall
  // section so the opening itself can stay game-first.
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('shortcutRitter_v1'));
    state.sectionsUnlocked = Math.max(20, Number(state.sectionsUnlocked) || 0);
    localStorage.setItem('shortcutRitter_v1', JSON.stringify(state));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('.section-tab[data-goto="20"]').click();
  await solveSimpleSection('20', { spacedPlus: true });
  state = await readState();
  assert.ok(Number(state.sectionClears?.['20']) > 0, 'Typed spacing section did not score/persist');

  // Shop -> inventory -> equipment loop with a deterministic starting budget.
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('shortcutRitter_v1'));
    state.coins = 100;
    state.gachaPreference = 'weapon';
    localStorage.setItem('shortcutRitter_v1', JSON.stringify(state));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('.nav-toggle[data-view="shop"]').click();
  await page.locator('#gachaBtn').click();
  await page.waitForTimeout(250);
  state = await readState();
  assert.equal(Number(state.coins), 80, 'Weapon purchase should cost 20 coins');
  assert.equal(state.lastShopPurchase?.type, 'item', 'Shop should persist the purchased item');
  assert.ok(Array.isArray(state.items) && state.items.length > 0, 'Purchased item missing from inventory state');

  await page.locator('.nav-toggle[data-view="inventory"]').click();
  await page.locator('#autoEquipBtn').click();
  await page.waitForTimeout(150);
  state = await readState();
  assert.ok(Object.values(state.equipment || {}).some(Boolean), 'Auto-equip did not equip the purchased item');
  assert.ok(await page.locator('.equipment-slot.equipped').count() > 0, 'Equipped item is not reflected in the UI');

  // Skill purchase uses the same shop loop but a different collection.
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('shortcutRitter_v1'));
    state.gachaPreference = 'skill';
    localStorage.setItem('shortcutRitter_v1', JSON.stringify(state));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('.nav-toggle[data-view="shop"]').click();
  await page.locator('#gachaBtn').click();
  await page.waitForTimeout(250);
  state = await readState();
  assert.equal(Number(state.coins), 60, 'Skill purchase should cost another 20 coins');
  assert.equal(state.lastShopPurchase?.type, 'skill', 'Shop should persist the purchased skill');
  assert.ok(Array.isArray(state.skills) && state.skills.length > 0, 'Purchased skill missing from skill collection');

  // RPG/meta views still have to remain reachable after the content rewrite.
  for (const view of ['inventory', 'skills', 'shop', 'battle', 'report', 'learn']) {
    const button = page.locator(`.nav-toggle[data-view="${view}"]`);
    await button.click();
    assert.ok(await button.evaluate(el => el.classList.contains('active')), `${view} navigation did not activate`);
  }

  // Reload verifies the isolated 2026 state survives a real navigation cycle.
  await page.reload({ waitUntil: 'networkidle' });
  state = await readState();
  assert.ok(Number(state.sectionClears?.['3']) > 0 && Number(state.sectionClears?.['4']) > 0 && Number(state.sectionClears?.['6']) > 0 && Number(state.sectionClears?.['11']) > 0 && Number(state.sectionClears?.['20']) > 0,
    'Cleared sections did not survive reload');
  assert.equal(Number(state.battleUnlocked), 2, 'Battle progression did not survive reload');
  assert.equal((await page.locator('#a8ProgressBadge').textContent())?.trim(), '5 / 30');

  // Renderer gate: force the complete course visible, reload, and activate every
  // section once. This catches late-section renderer/data incompatibilities.
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('shortcutRitter_v1'));
    state.sectionsUnlocked = 30;
    state.sectionClears = { ...(state.sectionClears || {}) };
    for (let i = 1; i <= 30; i += 1) state.sectionClears[String(i)] = Math.max(1, Number(state.sectionClears[String(i)]) || 0);
    localStorage.setItem('shortcutRitter_v1', JSON.stringify(state));
  });
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('.section-tab').count(), 30, 'All 30 section tabs must render');
  assert.equal(await page.locator('#learnSections .section').count(), 30, 'All 30 section bodies must render');
  assert.equal((await page.locator('#a8ProgressBadge').textContent())?.trim(), 'A8 abgeschlossen ✓');
  assert.equal(await page.locator('.memory-game').count(), 0, 'Memory UI must stay absent with all sections rendered');

  for (let i = 1; i <= 30; i += 1) {
    const id = String(i);
    await page.locator(`.section-tab[data-goto="${id}"]`).click();
    const section = page.locator(`.section[data-section="${id}"]`);
    assert.ok(await section.evaluate(el => el.classList.contains('active')), `Section ${id} did not activate`);
  }

  // Basic mobile-layout smoke after the desktop course loop.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  assert.ok(await page.locator('#mobileNavToggle').isVisible(), 'Mobile navigation toggle should be visible');
  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(horizontalOverflow <= 2, `Unexpected mobile horizontal overflow: ${horizontalOverflow}px`);

  if (pageErrors.length) throw new Error(`Page errors:\n${pageErrors.join('\n')}`);
  if (consoleErrors.length) throw new Error(`Console errors:\n${consoleErrors.join('\n')}`);

  console.log('OK: browser smoke passed — game-first opening, inputs, DnD, Workflow Chain, shop, equipment, skills, battle gates, all 30 renderers and mobile layout.');
} finally {
  await browser.close();
}
