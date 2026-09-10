import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.TK2_BASE_URL || 'http://127.0.0.1:4173/2026/';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

try {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.SHORTCUT_QUEST_2026_HINT_COVERAGE?.enabledSectionIds?.length === 23);

  const coverage = await page.evaluate(() => window.SHORTCUT_QUEST_2026_HINT_COVERAGE);
  const expectedEnabled = ['1','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','25','26','27','28'];
  const expectedExcluded = ['2','21','22','23','24','29','30'];
  assert.deepEqual(coverage.enabledSectionIds, expectedEnabled, 'Hint-enabled section matrix changed unexpectedly');
  assert.deepEqual(coverage.excludedSectionIds, expectedExcluded, 'Hint exclusion matrix changed unexpectedly');

  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('shortcutRitter_v1')) || {};
    state.sectionsUnlocked = 30;
    localStorage.setItem('shortcutRitter_v1', JSON.stringify(state));
    localStorage.setItem('tk_global_xp_v1', '300');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.SHORTCUT_QUEST_2026_HINT_COVERAGE?.enabledSectionIds?.length === 23);

  for (const id of expectedEnabled) {
    const count = await page.locator(`.section[data-section="${id}"] .a8-hint-button`).count();
    assert.ok(count > 0, `Section ${id}: expected at least one purchasable hint`);
  }
  for (const id of expectedExcluded) {
    const count = await page.locator(`.section[data-section="${id}"] .a8-hint-button`).count();
    assert.equal(count, 0, `Section ${id}: intentionally hint-free section must not expose a hint`);
  }

  const fastIds = ['2','22','23','24','29'];
  for (const id of fastIds) {
    assert.equal(await page.locator(`.section[data-section="${id}"] .fast-paced`).count(), 1, `Section ${id}: expected Fast-Paced activity`);
    assert.equal(await page.locator(`.section[data-section="${id}"] .a8-hint-button`).count(), 0, `Section ${id}: Fast-Paced must stay hint-free`);
  }

  const xpBeforeNarrative = Number(await page.evaluate(() => localStorage.getItem('tk_global_xp_v1')));
  const narrativeCard = page.locator('.section[data-section="1"] .narrative-card').first();
  const narrativeHint = narrativeCard.locator('.a8-targeted-hint');
  const wrongBefore = await narrativeCard.locator('.narrative-option.a8-targeted-hint-removed').count();
  await narrativeHint.click();
  const xpAfterNarrative = Number(await page.evaluate(() => localStorage.getItem('tk_global_xp_v1')));
  assert.equal(xpAfterNarrative, xpBeforeNarrative - 30, 'Narrative hint must cost exactly 30 XP');
  assert.equal(await narrativeCard.locator('.narrative-option.a8-targeted-hint-removed').count(), wrongBefore + 1,
    'Narrative hint must eliminate exactly one wrong option');
  assert.match((await narrativeCard.locator('.a8-hint-note').textContent()) || '', /falsche Möglichkeit wurde entfernt/i);

  await page.locator('.section-stage-button[data-stage="1"]').click();
  await page.locator('.section-tab[data-goto="20"]').click();
  const recallField = page.locator('.section[data-section="20"] .task-field').first();
  const recallInput = recallField.locator('input[data-answer]');
  assert.equal(await recallInput.inputValue(), '', 'Recall hint must not pre-fill the answer');
  const xpBeforeRecall = Number(await page.evaluate(() => localStorage.getItem('tk_global_xp_v1')));
  await recallField.locator('.a8-targeted-hint').click();
  const xpAfterRecall = Number(await page.evaluate(() => localStorage.getItem('tk_global_xp_v1')));
  assert.equal(xpAfterRecall, xpBeforeRecall - 30, 'Recall hint must cost exactly 30 XP');
  assert.equal(await recallInput.inputValue(), '', 'Recall hint must reveal only guidance, not fill the answer');
  assert.match((await recallField.locator('.a8-hint-note').textContent()) || '', /^Start: .+ \+ …$/,
    'Recall hint should reveal the first key only');

  console.log('HINT COVERAGE E2E OK: 23 hint-enabled sections, Fast-Paced + 21 + 30 intentionally hint-free, targeted hints cost 30 XP.');
} finally {
  await browser.close();
}
