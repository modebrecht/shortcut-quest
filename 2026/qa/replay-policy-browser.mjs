import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.TK2_BASE_URL || 'http://127.0.0.1:4173/2026/';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

async function fresh() {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.SHORTCUT_QUEST_2026_REPLAY_POLICY?.maxSubmissionsPerSection === 3);
}

async function state() {
  return page.evaluate(() => JSON.parse(localStorage.getItem('shortcutRitter_v1')));
}

async function fillNarrative(sectionId) {
  await page.evaluate(id => {
    const section = document.querySelector(`.section[data-section="${id}"]`);
    if (!section) throw new Error(`Section ${id} missing`);
    section.querySelectorAll('.narrative-blank').forEach(blank => {
      const answer = blank.dataset.answer || '';
      blank.dataset.value = answer;
      blank.dataset.filled = 'true';
      blank.textContent = answer;
    });
  }, String(sectionId));
}

async function fillInputs(sectionId) {
  await page.evaluate(id => {
    const section = document.querySelector(`.section[data-section="${id}"]`);
    if (!section) throw new Error(`Section ${id} missing`);
    section.querySelectorAll('input[data-answer]').forEach(input => {
      input.value = input.dataset.answer || '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }, String(sectionId));
}

async function playFastPerfect(sectionId, rounds) {
  const section = page.locator(`.section[data-section="${sectionId}"]`);
  const start = section.locator('.fast-paced-start');
  await start.click();
  for (let i = 0; i < rounds; i += 1) {
    await page.waitForFunction(id => {
      const root = document.querySelector(`.section[data-section="${id}"]`);
      return root && Array.from(root.querySelectorAll('.fast-paced-option')).some(btn => !btn.disabled);
    }, String(sectionId));
    await page.evaluate(id => {
      const root = document.querySelector(`.section[data-section="${id}"]`);
      const prompt = root.querySelector('.fast-paced-prompt')?.textContent?.trim() || '';
      const blueprint = window.LEARN_SECTION_BLUEPRINTS.find(section => String(section.id) === String(id));
      const match = blueprint?.fastPaced?.combos?.find(entry => entry.label === prompt);
      if (!match) throw new Error(`Fast prompt not mapped: ${prompt}`);
      const button = Array.from(root.querySelectorAll('.fast-paced-option')).find(btn => btn.dataset.combo === match.combo);
      if (!button) throw new Error(`Correct option not found for ${prompt}`);
      button.click();
    }, String(sectionId));
    await page.waitForTimeout(650);
  }
  await page.waitForFunction(id => {
    const root = document.querySelector(`.section[data-section="${id}"]`);
    const btn = root?.querySelector('.fast-paced-start');
    return btn && btn.textContent.includes('Erneut starten');
  }, String(sectionId));
}

try {
  await fresh();
  assert.deepEqual(await page.evaluate(() => window.SHORTCUT_QUEST_2026_REPLAY_POLICY), {
    maxSubmissionsPerSection: 3,
    firstRewardPercent: 100,
    repeatRewardPercent: 50,
    resetCondition: 'all-30-sections-reach-3'
  });

  const s1 = page.locator('.section[data-section="1"]');
  await fillNarrative(1);
  await s1.locator('.check-section').click();
  await page.waitForTimeout(120);
  let saved = await state();
  assert.equal(saved.coins, 70);
  assert.equal(saved.sectionSubmissions['1'], 1);

  await s1.locator('.reset-section').click();
  await fillNarrative(1);
  await s1.locator('.check-section').click();
  await page.waitForTimeout(120);
  saved = await state();
  assert.equal(saved.coins, 105);
  assert.equal(saved.sectionSubmissions['1'], 2);

  await s1.locator('.reset-section').click();
  await fillNarrative(1);
  await s1.locator('.check-section').click();
  await page.waitForTimeout(120);
  saved = await state();
  assert.equal(saved.coins, 140);
  assert.equal(saved.sectionSubmissions['1'], 3);
  assert.equal(await s1.locator('.check-section').isDisabled(), true);
  assert.equal(await page.locator('.section-tab[data-section-id="1"]').isDisabled(), true);

  await fresh();
  await page.locator('.section-tab[data-section-id="2"]').click();
  for (const expected of [70, 105, 140]) {
    await playFastPerfect(2, 6);
    saved = await state();
    assert.equal(saved.coins, expected);
  }
  assert.equal(saved.sectionSubmissions['2'], 3);
  assert.equal(await page.locator('.section[data-section="2"] .fast-paced-start').isDisabled(), true);
  assert.equal(await page.locator('.section-tab[data-section-id="2"]').isDisabled(), true);

  await fresh();
  await page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem('shortcutRitter_v1'));
    saved.sectionsUnlocked = 30;
    saved.sectionSubmissions = {};
    for (let i = 1; i <= 29; i += 1) saved.sectionSubmissions[String(i)] = 3;
    saved.sectionSubmissions['30'] = 2;
    saved.replayCycle = 1;
    saved.sectionClears = saved.sectionClears || {};
    saved.sectionClears['30'] = 1;
    saved.sectionResets = saved.sectionResets || {};
    saved.sectionResets['30'] = 1;
    localStorage.setItem('shortcutRitter_v1', JSON.stringify(saved));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('.section-stage-button[data-stage="2"]').click();
  await page.locator('.section-tab[data-section-id="30"]').click();
  await fillInputs(30);
  await page.locator('.section[data-section="30"] .check-section').click();
  await page.waitForTimeout(150);
  saved = await state();
  assert.equal(saved.replayCycle, 2);
  assert.equal(Object.keys(saved.sectionSubmissions).length, 0);
  assert.equal(await page.locator('.section-tab[data-section-id="30"]').isDisabled(), false);

  console.log('REPLAY POLICY OK: 100/50/50, max 3 rewarded runs per section, global reopen after all 30 reach 3/3.');
} finally {
  await browser.close();
}
