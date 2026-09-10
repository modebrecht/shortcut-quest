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

async function chooseButtonValue(ui, answer) {
  const buttons = ui.locator('.a8-choice-option');
  for (let i = 0; i < await buttons.count(); i += 1) {
    const button = buttons.nth(i);
    if ((await button.getAttribute('data-value')) === answer) {
      await button.click();
      return;
    }
  }
  throw new Error(`Button answer not found: ${answer}`);
}

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
    const ui = select.locator('xpath=preceding-sibling::div[contains(@class,"a8-choice-ui")][1]');
    if (await ui.count()) {
      await chooseButtonValue(ui, answer);
    } else {
      await select.evaluate((el, value) => {
        el.value = value;
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, answer);
    }
  }
  await section.locator(`.check-section[data-check-section="${sectionId}"]`).click();
  await page.waitForTimeout(180);
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
  await page.waitForTimeout(180);
}

async function readState() {
  return page.evaluate(() => JSON.parse(localStorage.getItem('shortcutRitter_v1')));
}

try {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.SHORTCUT_QUEST_2026_HINTS?.costXP === 30 && window.SHORTCUT_QUEST_2026_XP?.perCorrect === 5);

  assert.equal(await page.title(), 'Shortcut Quest 2026');
  assert.equal(await page.locator('html').getAttribute('data-edition'), 'tk2-2026');
  assert.equal((await page.locator('header .title').textContent())?.trim(), 'Shortcut Quest 2026');
  assert.equal((await page.locator('#a8ProgressBadge').textContent())?.trim(), '0 / 30');
  assert.equal(await page.locator('.section-tab').count(), 10, 'Expected 10 initially available sections');
  assert.equal(await page.locator('.section-stage-button').count(), 3, '30 sections should be represented as three navigation stages');
  assert.equal(await page.locator('.section-stage-meta').count(), 0, 'Legacy section meta labels should be removed');
  assert.deepEqual(await page.locator('.section-stage-button').allTextContents(), ['10', '20', '30'], 'Stage chooser should use the compact 10/20/30 labels');
  assert.deepEqual((await page.locator('#sectionTabs .section-tab:visible .section-tab-label').allTextContents()).slice(0, 10), ['1','2','3','4','5','6','7','8','9','10'], 'Visible section tabs should use numbers only');
  assert.ok(await page.locator('.section-stage-button[data-stage="0"]').evaluate(el => el.classList.contains('active')), 'Stage 1-10 should be active initially');
  assert.equal(await page.locator('.section-stage-button[data-stage="1"]').isDisabled(), true, 'Stage 11-20 should start locked');
  assert.equal(await page.locator('.section-stage-button[data-stage="2"]').isDisabled(), true, 'Stage 21-30 should start locked');
  assert.equal(await page.locator('.memory-game').count(), 0, 'Memory UI must not be rendered');

  const visibleLearningText = await page.locator('#learnView').innerText();
  assert.equal(/\bA[1-8]\b/.test(visibleLearningText), false, 'Student-facing learning UI must not mention old worksheet labels');
  assert.match((await page.locator('#learnView > .section-reward-hint').textContent()) || '', /\+5 XP pro richtige Antwort/);

  assert.equal(await page.locator('#learnSections select:visible').count(), 0, 'No dropdown should be visible before a Combo Builder is opened');
  assert.ok(await page.locator('.section[data-section="3"] .a8-choice-option').count() > 0, 'Recognition questions should render answer buttons');

  const hintConfig = await page.evaluate(() => window.SHORTCUT_QUEST_2026_HINTS);
  const xpConfig = await page.evaluate(() => window.SHORTCUT_QUEST_2026_XP);
  assert.equal(hintConfig.costXP, 30);
  assert.equal(hintConfig.storageKey, 'tk_global_xp_v1');
  assert.equal(hintConfig.behavior, 'remove-one-wrong-answer');
  assert.equal(xpConfig.perCorrect, 5, 'Every correct answer should award 5 XP');
  assert.equal(xpConfig.storageKey, 'tk_global_xp_v1');

  await page.locator('.section-tab[data-goto="6"]').click();
  const dndSection = page.locator('.section[data-section="6"]');
  const dndShell = dndSection.locator('.a8-dnd-shell');
  assert.equal(await dndShell.count(), 1, 'DnD should be upgraded to the focus shell');
  assert.equal(await dndShell.locator('.dnd-target.a8-active').count(), 1, 'Exactly one DnD target should be active');
  const visibleTokensBefore = await dndShell.locator('.dnd-token:visible').count();
  assert.ok(visibleTokensBefore > 1, 'DnD should expose a compact token pool');
  await dndShell.locator('.dnd-token:visible').first().evaluate(el => el.click());
  await page.waitForTimeout(60);
  assert.equal(await dndShell.locator('.dnd-token:visible').count(), visibleTokensBefore - 1, 'Used DnD token should disappear from the pool');
  assert.equal(await dndShell.locator('.a8-dnd-assignment').count(), 1, 'Used token should become one compact assignment');
  await dndShell.locator('.a8-dnd-assignment').first().evaluate(el => el.click());
  await page.waitForTimeout(60);
  assert.equal(await dndShell.locator('.dnd-token:visible').count(), visibleTokensBefore, 'Reopening an assignment should return its token');
  assert.equal(await dndShell.locator('.a8-dnd-assignment').count(), 0, 'Reopened assignment should return to the active task');

  await page.evaluate(() => localStorage.setItem('tk_global_xp_v1', '60'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.SHORTCUT_QUEST_2026_HINTS?.costXP === 30);
  assert.equal((await page.locator('#a8XpTop').textContent())?.trim(), 'XP: 60');
  await page.locator('.section-tab[data-goto="3"]').click();
  const firstChoice = page.locator('.section[data-section="3"] .a8-choice-ui').first();
  const optionCountBefore = await firstChoice.locator('.a8-choice-option').count();
  await firstChoice.locator('.a8-hint-button').click();
  assert.equal(await page.evaluate(() => localStorage.getItem('tk_global_xp_v1')), '30', 'Hint must deduct exactly 30 XP');
  assert.equal(await firstChoice.locator('.a8-choice-option.removed').count(), 1, 'Hint must remove exactly one wrong answer');
  assert.equal(await firstChoice.locator('.a8-choice-option').count(), optionCountBefore, 'Hint should eliminate, not delete/reflow, an option');

  await solveSimpleSection('3');
  assert.equal(await page.evaluate(() => localStorage.getItem('tk_global_xp_v1')), '70', 'Eight correct answers should award +40 XP');
  assert.match((await page.locator('.section[data-section="3"] .a8-xp-earned').textContent()) || '', /\+40 XP/);
  let state = await readState();
  assert.ok(Number(state.sectionClears?.['3']) > 0, 'Section 3 was not persisted as cleared');
  assert.ok(Number(state.coins) > 0, 'Perfect section should award coins');
  assert.equal(Number(state.sectionsUnlocked), 11, 'First clear should unlock section 11');
  assert.equal((await page.locator('#a8ProgressBadge').textContent())?.trim(), '1 / 30');
  assert.equal(await page.locator('.section-tab').count(), 11, 'Section 11 tab should appear after first clear');
  assert.equal(await page.locator('.section-stage-button[data-stage="1"]').isDisabled(), false, 'Stage 11-20 should unlock when section 11 becomes available');
  assert.equal(await page.locator('.section-tab[data-goto="11"]').isVisible(), false, 'Section 11 stays hidden until its stage is opened');

  await page.locator('.section-tab[data-goto="10"]').click();
  const comboRow = page.locator('.section[data-section="10"] .combo-row').first();
  const comboSelects = comboRow.locator('select[data-answer]');
  assert.ok(await comboSelects.count() >= 2, 'Combo Builder should keep compact native selects');
  assert.ok(await comboSelects.first().isVisible(), 'Combo Builder selects should be visible');
  const firstOptions = await comboSelects.first().locator('option').evaluateAll(options => options.map(option => option.value).filter(Boolean));
  assert.ok(firstOptions.length <= 5, 'First Combo Builder select must stay compact');
  assert.ok(firstOptions.every(value => ['Ctrl','Shift','Alt','AltGr','Win'].includes(value)), 'First Combo Builder select may only contain modifier keys');
  const lastOptions = await comboSelects.last().locator('option').evaluateAll(options => options.map(option => option.value).filter(Boolean));
  assert.ok(lastOptions.length <= 6, 'Final Combo Builder select must stay compact');
  assert.equal(await comboRow.locator('.a8-combo-bank-option').count(), 0, 'Old shared button bank must be removed');
  const comboAnswer = await comboSelects.first().getAttribute('data-answer');
  assert.ok(comboAnswer);
  await comboSelects.first().selectOption(comboAnswer);
  assert.equal(await comboSelects.first().inputValue(), comboAnswer, 'Filtered Combo Builder select must accept the correct modifier');

  const openingMission = page.locator('.section[data-section="1"]');
  assert.equal(await openingMission.locator('.narrative-card').count(), 6, 'Section 1 should render six scenario cards');
  assert.equal(await openingMission.locator('input[data-answer]').count(), 0, 'Section 1 must not contain copy-recall inputs');
  const reflexRound = page.locator('.section[data-section="2"]');
  assert.equal(await reflexRound.locator('.fast-paced').count(), 1, 'Section 2 should render the reflex round');
  assert.equal(await reflexRound.locator('input[data-answer]').count(), 0, 'Section 2 must not contain copy-recall inputs');
  await page.locator('.section-tab[data-goto="2"]').click();
  assert.ok(await reflexRound.locator('.fast-paced-start').isVisible(), 'Section 2 reflex start button should be visible when its tab is active');

  await page.locator('.section-stage-button[data-stage="1"]').click();
  assert.equal(await page.locator('.section-tab[data-goto="11"]').isVisible(), true, 'Opening stage 11-20 should reveal section 11');
  await page.locator('.section-tab[data-goto="11"]').click();
  await solveSimpleSection('11');
  state = await readState();
  assert.ok(Number(state.sectionClears?.['11']) > 0, 'Workflow Chain section did not score/persist');
  assert.equal(Number(state.sectionsUnlocked), 12, 'Workflow clear should unlock the next section');
  assert.equal((await page.locator('#a8ProgressBadge').textContent())?.trim(), '2 / 30');

  await page.locator('.section-stage-button[data-stage="0"]').click();
  await page.locator('.section-tab[data-goto="4"]').click();
  await solveSimpleSection('4');
  state = await readState();
  assert.equal(Number(state.battleUnlocked), 1, 'Battle 2 must stay gated until Battle 1 is defeated');
  assert.equal((await page.locator('#a8ProgressBadge').textContent())?.trim(), '3 / 30');

  await page.locator('.nav-toggle[data-view="battle"]').click();
  assert.equal(await page.locator('#battleButtons .battle-btn').count(), 11, 'Battle selector should expose all 11 fights');
  const battleButtonDisplay = await page.locator('#battleButtons').evaluate(el => getComputedStyle(el).display);
  assert.equal(battleButtonDisplay, 'grid', 'Battle selector should use a discoverable grid instead of hidden horizontal scrolling');
  const battleButtonOverflow = await page.locator('#battleButtons').evaluate(el => el.scrollWidth > el.clientWidth + 2);
  assert.equal(battleButtonOverflow, false, 'Battle selector must not require horizontal scrolling');
  const battleCardOverflow = await page.locator('#battleView .battle-card').evaluate(el => el.scrollWidth > el.clientWidth + 2);
  assert.equal(battleCardOverflow, false, 'Battle card must not overflow horizontally on desktop');
  assert.equal(await page.locator('#battleStagePreview').count(), 1, 'Arena preview stage should exist');
  const oneArenaLayout = await page.evaluate(() => {
    const stage = document.querySelector('#battleStagePreview')?.getBoundingClientRect();
    const card = document.querySelector('#battleView .battle-card')?.getBoundingClientRect();
    const hero = document.querySelector('#battleView .battle-side.hero')?.getBoundingClientRect();
    const enemy = document.querySelector('#battleView .battle-side.enemy')?.getBoundingClientRect();
    if (!stage || !card || !hero || !enemy) return null;
    const overlap = (a, b) => Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    return {
      stageWidthRatio: stage.width / card.width,
      stageHeight: stage.height,
      heroVerticalOverlapRatio: overlap(hero, stage) / Math.max(1, hero.height),
      enemyVerticalOverlapRatio: overlap(enemy, stage) / Math.max(1, enemy.height),
      heroInsideHorizontally: hero.left >= stage.left - 2 && hero.right <= stage.right + 2,
      enemyInsideHorizontally: enemy.left >= stage.left - 2 && enemy.right <= stage.right + 2,
      heroPosition: getComputedStyle(document.querySelector('#battleView .battle-side.hero')).position,
      enemyPosition: getComputedStyle(document.querySelector('#battleView .battle-side.enemy')).position
    };
  });
  assert.ok(oneArenaLayout, 'One-arena geometry should be measurable');
  assert.ok(oneArenaLayout.stageWidthRatio > 0.92, 'Arena stage should dominate almost the full battle card width');
  assert.ok(oneArenaLayout.stageHeight >= 400, 'Desktop one-arena stage should be substantially larger');
  assert.equal(oneArenaLayout.heroPosition, 'absolute', 'Hero HUD should overlay the arena rather than occupy a separate panel');
  assert.equal(oneArenaLayout.enemyPosition, 'absolute', 'Enemy HUD should overlay the arena rather than occupy a separate panel');
  assert.equal(oneArenaLayout.heroInsideHorizontally, true, 'Hero should sit horizontally inside the arena stage');
  assert.equal(oneArenaLayout.enemyInsideHorizontally, true, 'Enemy should sit horizontally inside the arena stage');
  assert.ok(oneArenaLayout.heroVerticalOverlapRatio > 0.72, 'Most of the hero presentation should live inside the arena stage');
  assert.ok(oneArenaLayout.enemyVerticalOverlapRatio > 0.72, 'Most of the enemy presentation should live inside the arena stage');
  const previewArenaBackground = await page.locator('#battleStagePreview').evaluate(el => getComputedStyle(el).backgroundImage);
  assert.equal(/battle-bg-forest/i.test(previewArenaBackground), false, 'Arena preview must use the dark stone arena instead of the forest background');
  assert.equal(await page.locator('#battleStartBtn').count(), 1, 'Arena should expose a dedicated start CTA');
  assert.equal(await page.locator('#battleButtons .battle-btn.selected').count(), 1, 'Arena should preselect exactly one available battle');
  assert.equal(await page.locator('#battleButtons .battle-btn.battle-featured').count(), 3, 'Arena should visually feature exactly three battle cards');
  assert.equal(await page.locator('#battleButtons .battle-btn.battle-compact').count(), 8, 'Remaining battles should stay reachable as subdued rank chips');
  assert.equal(await page.locator('.battle-btn[data-enemy="1"]').isDisabled(), false, 'Battle 1 should be available immediately');
  assert.equal(await page.locator('.battle-btn[data-enemy="2"]').isDisabled(), true, 'Battle 2 should still be locked');

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

  await page.locator('.nav-toggle[data-view="learn"]').click();
  await page.locator('.section-stage-button[data-stage="0"]').click();
  await solveDndSection('6');
  state = await readState();
  assert.ok(Number(state.sectionClears?.['6']) > 0, 'Drag & Drop section did not score/persist');

  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('shortcutRitter_v1'));
    state.sectionsUnlocked = Math.max(20, Number(state.sectionsUnlocked) || 0);
    localStorage.setItem('shortcutRitter_v1', JSON.stringify(state));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('.section-stage-button[data-stage="1"]').click();
  await page.locator('.section-tab[data-goto="20"]').click();
  await solveSimpleSection('20', { spacedPlus: true });
  state = await readState();
  assert.ok(Number(state.sectionClears?.['20']) > 0, 'Typed spacing section did not score/persist');

  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('shortcutRitter_v1'));
    state.coins = 100;
    state.gachaPreference = 'weapon';
    localStorage.setItem('shortcutRitter_v1', JSON.stringify(state));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('.nav-toggle[data-view="shop"]').click();
  const shopColumns = await page.locator('#shopView .gacha-options').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length);
  assert.equal(shopColumns, 4, 'Desktop shop should show four balanced category tiles');
  assert.equal(await page.locator('#shopView .gacha-option').count(), 4, 'Shop should expose four purchase categories');
  const shopOverflow = await page.locator('#shopView .game-grid > .card').evaluate(el => el.scrollWidth > el.clientWidth + 2);
  assert.equal(shopOverflow, false, 'Shop card must not overflow horizontally');
  assert.ok((await page.locator('#gachaBtn').textContent()).includes('20 Coins'), 'Shop CTA should show its 20 coin price clearly');
  await page.locator('#gachaBtn').click();
  await page.waitForTimeout(250);
  state = await readState();
  assert.equal(Number(state.coins), 80, 'Weapon purchase should cost 20 coins');
  assert.equal(state.lastShopPurchase?.type, 'item', 'Shop should persist the purchased item');
  assert.ok(Array.isArray(state.items) && state.items.length > 0, 'Purchased item missing from inventory state');

  await page.locator('.nav-toggle[data-view="inventory"]').click();
  assert.equal(await page.locator('.equipment-layout > .slot-row').count(), 3, 'Inventory should keep three semantic equipment rows');
  assert.equal(await page.locator('.equipment-slot').count(), 8, 'Inventory should render eight equipment slots around the hero');
  const inventoryGridStyle = await page.locator('.equipment-layout').evaluate(el => getComputedStyle(el).display);
  assert.equal(inventoryGridStyle, 'grid', 'Inventory equipment layout must be a real CSS grid');
  const heroBox = await page.locator('.equipment-layout .hero-center').boundingBox();
  assert.ok(heroBox && heroBox.width > 0 && heroBox.height > 0, 'Inventory hero cell must have a stable box');
  const overlapCount = await page.locator('.equipment-slot').evaluateAll((slots, hero) => {
    const h = hero.getBoundingClientRect();
    return slots.filter(slot => {
      const r = slot.getBoundingClientRect();
      const x = Math.max(0, Math.min(r.right, h.right) - Math.max(r.left, h.left));
      const y = Math.max(0, Math.min(r.bottom, h.bottom) - Math.max(r.top, h.top));
      return x * y > 2;
    }).length;
  }, await page.locator('.equipment-layout .hero-center').elementHandle());
  assert.equal(overlapCount, 0, 'Inventory hero must not overlap equipment slots');
  await page.locator('#autoEquipBtn').click();
  await page.waitForTimeout(150);
  state = await readState();
  assert.ok(Object.values(state.equipment || {}).some(Boolean), 'Auto-equip did not equip the purchased item');
  assert.ok(await page.locator('.equipment-slot.equipped').count() > 0, 'Equipped item is not reflected in the UI');

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

  await page.locator('.nav-toggle[data-view="skills"]').click();
  assert.ok(await page.locator('#skillsView .inventory-item[data-skill-key]').count() > 0, 'Purchased skill should render as a skill card');
  const skillAvatarBox = await page.locator('#skillsView .skill-avatar').boundingBox();
  assert.ok(skillAvatarBox && skillAvatarBox.height <= 285, 'Desktop skill avatar should stay compact');
  const skillColumns = await page.locator('#skillsView .skill-list').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length);
  assert.equal(skillColumns, 2, 'Desktop skill list should use two compact columns');
  const skillsOverflow = await page.locator('#skillsView #skillCard').evaluate(el => el.scrollWidth > el.clientWidth + 2);
  assert.equal(skillsOverflow, false, 'Skills card must not overflow horizontally');

  for (const view of ['inventory', 'skills', 'shop', 'battle', 'report', 'learn']) {
    const button = page.locator(`.nav-toggle[data-view="${view}"]`);
    await button.click();
    assert.ok(await button.evaluate(el => el.classList.contains('active')), `${view} navigation did not activate`);
  }

  await page.reload({ waitUntil: 'networkidle' });
  state = await readState();
  assert.ok(Number(state.sectionClears?.['3']) > 0 && Number(state.sectionClears?.['4']) > 0 && Number(state.sectionClears?.['6']) > 0 && Number(state.sectionClears?.['11']) > 0 && Number(state.sectionClears?.['20']) > 0,
    'Cleared sections did not survive reload');
  assert.equal(Number(state.battleUnlocked), 2, 'Battle progression did not survive reload');
  assert.equal((await page.locator('#a8ProgressBadge').textContent())?.trim(), '5 / 30');

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
  assert.equal((await page.locator('#a8ProgressBadge').textContent())?.trim(), 'Abgeschlossen ✓');
  assert.equal(await page.locator('.memory-game').count(), 0, 'Memory UI must stay absent with all sections rendered');
  assert.equal(await page.locator('#learnSections select:visible').count(), 0, 'No dropdown should be visible while a non-Combo section is active');

  for (let i = 1; i <= 30; i += 1) {
    const id = String(i);
    if (i === 1 || i === 11 || i === 21) {
      await page.locator(`.section-stage-button[data-stage="${Math.floor((i - 1) / 10)}"]`).click();
    }
    await page.locator(`.section-tab[data-goto="${id}"]`).click();
    const section = page.locator(`.section[data-section="${id}"]`);
    assert.ok(await section.evaluate(el => el.classList.contains('active')), `Section ${id} did not activate`);
  }

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('#mobileNavToggle').isVisible(), false, 'Desktop should use inline navigation, not the menu button');
  assert.ok(await page.locator('#topNav .nav-toggle').first().isVisible(), 'Desktop inline navigation should be visible');
  assert.equal(await page.locator('#a8SectionStageNav #sectionTabs').count(), 1, 'Section numbers should live inside the game-style stage chooser');

  await page.setViewportSize({ width: 1024, height: 768 });
  await page.reload({ waitUntil: 'networkidle' });
  const tabletMenu = page.locator('#mobileNavToggle');
  assert.ok(await tabletMenu.isVisible(), 'Tablet/compact desktop should use the menu button');
  assert.equal(await page.locator('#topNav .nav-toggle').first().isVisible(), false, 'Compact header should keep inline navigation closed initially');
  assert.equal(await page.locator('header > .header-right').count(), 0, 'Compact header stats must be moved out of the top header row');
  assert.equal(await page.locator('#a8XpTop').isVisible(), false, 'XP must stay hidden while the compact menu is closed');
  assert.equal(await page.locator('#coinTop').isVisible(), false, 'Coins must stay hidden while the compact menu is closed');
  const tabletHeaderOverflow = await page.evaluate(() => {
    const el = document.querySelector('header');
    return el ? el.scrollWidth - el.clientWidth : 0;
  });
  assert.ok(tabletHeaderOverflow <= 2, `Unexpected tablet header overflow: ${tabletHeaderOverflow}px`);
  await tabletMenu.click();
  assert.equal(await tabletMenu.getAttribute('aria-expanded'), 'true', 'Tablet menu should open');
  assert.ok(await page.locator('#topNav .nav-toggle').first().isVisible(), 'Tablet menu choices should be visible after opening');
  assert.ok(await page.locator('#topNav .header-right #a8XpTop').isVisible(), 'XP should appear inside the opened compact menu');
  assert.ok(await page.locator('#topNav .header-right #coinTop').isVisible(), 'Coins should appear inside the opened compact menu');
  await tabletMenu.click();
  assert.equal(await tabletMenu.getAttribute('aria-expanded'), 'false', 'Tablet menu should close again');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  const mobileMenu = page.locator('#mobileNavToggle');
  assert.ok(await mobileMenu.isVisible(), 'Mobile navigation toggle should be visible');
  assert.equal(await mobileMenu.getAttribute('aria-expanded'), 'false', 'Mobile menu should start closed');
  await mobileMenu.click();
  assert.equal(await mobileMenu.getAttribute('aria-expanded'), 'true', 'Mobile menu button should open the navigation');
  assert.ok(await page.locator('#topNav').evaluate(el => el.classList.contains('open')), 'Mobile navigation should receive the open state');
  assert.ok(await page.locator('#topNav .nav-toggle').first().isVisible(), 'Mobile navigation choices should be visible after opening');
  await mobileMenu.click();
  assert.equal(await mobileMenu.getAttribute('aria-expanded'), 'false', 'Mobile menu button should close the navigation again');
  assert.equal(await page.locator('#learnSections select:visible').count(), 0, 'No dropdown should be visible on mobile while a non-Combo section is active');
  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(horizontalOverflow <= 2, `Unexpected mobile horizontal overflow: ${horizontalOverflow}px`);

  await mobileMenu.click();
  await page.locator('#topNav .nav-toggle[data-view="battle"]').click();
  await page.waitForTimeout(80);
  assert.equal(await page.locator('#battleButtons .battle-btn').count(), 11, 'Mobile battle selector should still expose all 11 fights');
  const mobileBattleOverflow = await page.locator('#battleView .battle-card').evaluate(el => el.scrollWidth > el.clientWidth + 2);
  assert.equal(mobileBattleOverflow, false, 'Battle card must not overflow at 390px');
  const mobileBattleColumns = await page.locator('#battleButtons').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length);
  assert.equal(mobileBattleColumns, 4, '390px arena should use a four-column track for featured cards plus compact rank chips');
  assert.equal(await page.locator('#battleButtons .battle-btn.battle-featured').count(), 3, 'Mobile arena should keep exactly three featured battle cards');
  const availableBattle = page.locator('#battleButtons .battle-btn:not(:disabled)').first();
  assert.ok(await availableBattle.count(), 'At least one battle must be selectable on mobile');
  await availableBattle.click();
  assert.equal(await page.locator('#battleSimulation').isVisible(), false, 'Selecting a battle card should not start combat before the CTA');
  assert.equal(await page.locator('#battleButtons .battle-btn.selected').count(), 1, 'Exactly one battle card should be selected');
  assert.ok(await page.locator('#battleStartBtn').isVisible(), 'Arena start CTA should stay visible on mobile');
  assert.equal(await page.locator('#battleStartBtn').isDisabled(), false, 'Arena start CTA should be enabled for the selected battle');
  await page.locator('#battleStartBtn').click();
  await page.waitForTimeout(120);
  assert.ok(await page.locator('#battleSimulation').isVisible(), 'Starting through the arena CTA should reveal the battle simulation');
  const arenaBox = await page.locator('#battleArena').boundingBox();
  assert.ok(arenaBox && arenaBox.width <= 390, 'Active battle arena must fit inside the mobile viewport');
  const activeArenaBackground = await page.locator('#battleArena').evaluate(el => getComputedStyle(el).backgroundImage);
  assert.equal(/battle-bg-forest/i.test(activeArenaBackground), false, 'Active combat must not switch back to the forest background');
  const groundedFighters = await page.evaluate(() => {
    const arena = document.querySelector('#battleArena')?.getBoundingClientRect();
    if (!arena) throw new Error('Battle arena missing for grounding check');
    return ['knight', 'enemy'].map(kind => {
      const sprite = document.querySelector(`#battleArena .fighter.${kind} .fighter-sprite`);
      if (!sprite) throw new Error(`${kind} fighter sprite missing`);
      const rect = sprite.getBoundingClientRect();
      return {
        kind,
        topGap: rect.top - arena.top,
        bottomGap: arena.bottom - rect.bottom,
        leftGap: rect.left - arena.left,
        rightGap: arena.right - rect.right
      };
    });
  });
  for (const fighter of groundedFighters) {
    assert.ok(fighter.topGap >= -1, `${fighter.kind} sprite must not be clipped above the arena`);
    assert.ok(fighter.bottomGap >= 8, `${fighter.kind} sprite should sit above the arena floor instead of being bottom-cropped`);
    assert.ok(fighter.bottomGap <= 42, `${fighter.kind} sprite should still read as grounded in the scene`);
    assert.ok(fighter.leftGap >= -1 && fighter.rightGap >= -1, `${fighter.kind} sprite must stay horizontally inside the arena`);
  }
  assert.ok(Math.abs(groundedFighters[0].bottomGap - groundedFighters[1].bottomGap) <= 8, 'Hero and enemy should share one visual ground line');

  if (pageErrors.length) throw new Error(`Page errors:\n${pageErrors.join('\n')}`);
  if (consoleErrors.length) throw new Error(`Console errors:\n${consoleErrors.join('\n')}`);

  console.log('OK: browser smoke passed — focused DnD, used-token removal, +5 XP per correct answer, 30-XP hints, no worksheet labels, filtered Combo Builder selects, button choices, RPG progression and mobile layout.');
} finally {
  await browser.close();
}