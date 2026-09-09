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

async function solveSimpleSection(sectionId) {
  const section = page.locator(`.section[data-section="${sectionId}"]`);
  await section.waitFor({ state: 'attached' });
  const inputs = section.locator('input[data-answer]');
  for (let i = 0; i < await inputs.count(); i += 1) {
    const input = inputs.nth(i);
    const answer = await input.getAttribute('data-answer');
    assert.ok(answer, `Section ${sectionId}: input ${i} has no answer`);
    await input.fill(answer);
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

try {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  assert.equal(await page.title(), 'A8 · Shortcut Quest 2026');
  assert.equal(await page.locator('html').getAttribute('data-edition'), 'tk2-2026');
  assert.match((await page.locator('header .title').textContent()) || '', /A8.*Shortcut Quest 2026/);
  assert.equal((await page.locator('#a8ProgressBadge').textContent())?.trim(), '0 / 30');

  // The inherited runtime deliberately exposes the first 10 training sections.
  assert.equal(await page.locator('.section-tab').count(), 10, 'Expected 10 initially available sections');
  assert.equal(await page.locator('.memory-game').count(), 0, 'Memory UI must not be rendered in A8');

  // First real completion: grading, coins, persistence and next-section unlock.
  await solveSimpleSection('1');
  let state = await page.evaluate(() => JSON.parse(localStorage.getItem('shortcutRitter_v1')));
  assert.ok(Number(state.sectionClears?.['1']) > 0, 'Section 1 was not persisted as cleared');
  assert.ok(Number(state.coins) > 0, 'Perfect section should award coins');
  assert.equal(Number(state.sectionsUnlocked), 11, 'First clear should unlock section 11');
  assert.equal((await page.locator('#a8ProgressBadge').textContent())?.trim(), '1 / 30');
  assert.equal(await page.locator('.section-tab').count(), 11, 'Section 11 tab should appear after first clear');

  // New 2026 mechanic: Workflow Chain uses the stable Combo Builder runtime.
  await page.locator('.section-tab[data-goto="11"]').click();
  await solveSimpleSection('11');
  state = await page.evaluate(() => JSON.parse(localStorage.getItem('shortcutRitter_v1')));
  assert.ok(Number(state.sectionClears?.['11']) > 0, 'Workflow Chain section did not score/persist');
  assert.equal(Number(state.sectionsUnlocked), 12, 'Workflow clear should unlock the next section');
  assert.equal((await page.locator('#a8ProgressBadge').textContent())?.trim(), '2 / 30');

  // A third learned section plus battle 1 clear should allow battle rank 2.
  await page.locator('.section-tab[data-goto="2"]').click();
  await solveSimpleSection('2');
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('shortcutRitter_v1'));
    state.battleClears = { ...(state.battleClears || {}), '1': true };
    localStorage.setItem('shortcutRitter_v1', JSON.stringify(state));
  });
  state = await page.evaluate(() => JSON.parse(localStorage.getItem('shortcutRitter_v1')));
  assert.equal(Number(state.battleUnlocked), 2, 'Three section clears + battle 1 should unlock battle rank 2');
  assert.equal((await page.locator('#a8ProgressBadge').textContent())?.trim(), '3 / 30');

  // RPG/meta views still have to remain reachable after the content rewrite.
  for (const view of ['inventory', 'skills', 'shop', 'battle', 'report', 'learn']) {
    const button = page.locator(`.nav-toggle[data-view="${view}"]`);
    await button.click();
    assert.ok(await button.evaluate(el => el.classList.contains('active')), `${view} navigation did not activate`);
  }

  // Reload verifies the isolated 2026 state survives a real navigation cycle.
  await page.reload({ waitUntil: 'networkidle' });
  state = await page.evaluate(() => JSON.parse(localStorage.getItem('shortcutRitter_v1')));
  assert.ok(Number(state.sectionClears?.['1']) > 0 && Number(state.sectionClears?.['2']) > 0 && Number(state.sectionClears?.['11']) > 0,
    'Cleared sections did not survive reload');
  assert.equal(Number(state.battleUnlocked), 2, 'Battle progression did not survive reload');
  assert.equal((await page.locator('#a8ProgressBadge').textContent())?.trim(), '3 / 30');

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

  console.log('OK: browser smoke passed — grading, Workflow Chain, persistence, RPG nav, battle progression, all 30 renderers and mobile layout.');
} finally {
  await browser.close();
}
