import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.TK2_BASE_URL || 'http://127.0.0.1:4173/2026/';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(8000);

async function fresh() {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.SHORTCUT_QUEST_2026_REPLAY_POLICY?.maxSubmissionsPerSection === 3);
}

async function readState() {
  return page.evaluate(() => JSON.parse(localStorage.getItem('shortcutRitter_v1')));
}

async function enabledSectionIds() {
  return page.evaluate(() => Array.from(document.querySelectorAll('.section-tab'))
    .filter(tab => !tab.disabled)
    .map(tab => String(tab.dataset.sectionId || tab.dataset.goto || ''))
    .filter(Boolean));
}

async function assertPlayable(label) {
  const enabled = await enabledSectionIds();
  assert.ok(enabled.length >= 1, `${label}: expected at least one playable section, got none`);
  return enabled;
}

async function activateSection(sectionId) {
  const id = Number(sectionId);
  const stage = Math.floor((id - 1) / 10);
  const stageButton = page.locator(`.section-stage-button[data-stage="${stage}"]`);
  assert.equal(await stageButton.isDisabled(), false, `Section ${id}: stage ${stage + 1} is unexpectedly locked`);
  await stageButton.click();
  const tab = page.locator(`.section-tab[data-section-id="${id}"]`);
  await tab.waitFor({ state: 'attached' });
  assert.equal(await tab.isDisabled(), false, `Section ${id}: tab must be playable before its next submission`);
  await tab.click();
  await page.locator(`.section[data-section="${id}"]`).waitFor({ state: 'visible' });
}

async function solveStandardPerfect(sectionId) {
  await page.evaluate(id => {
    const section = document.querySelector(`.section[data-section="${id}"]`);
    if (!section) throw new Error(`Section ${id} missing`);
    const answerables = Array.from(section.querySelectorAll('[data-answer], .dnd-target'));
    if (!answerables.length) throw new Error(`Section ${id} has no standard answerables`);
    answerables.forEach(field => {
      const answer = String(field.dataset.answer || '');
      if (!answer) return;
      if (field.classList.contains('dnd-target')) {
        const slot = field.querySelector('.drop-slot');
        if (!slot) throw new Error(`Section ${id}: DnD target missing slot`);
        slot.dataset.value = answer;
        slot.textContent = answer;
        return;
      }
      if (field.classList.contains('narrative-blank')) {
        field.dataset.value = answer;
        field.dataset.filled = 'true';
        field.textContent = answer;
        return;
      }
      if (field.tagName === 'INPUT') {
        field.value = answer;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        return;
      }
      if (field.tagName === 'SELECT') {
        field.value = answer;
        if (field.value !== answer) throw new Error(`Section ${id}: answer option ${answer} unavailable`);
        field.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }, String(sectionId));
  const check = page.locator(`.section[data-section="${sectionId}"] .check-section`);
  assert.equal(await check.isDisabled(), false, `Section ${sectionId}: submit unexpectedly disabled`);
  await check.click();
  await page.waitForTimeout(140);
}

async function playFastPerfect(sectionId, rounds) {
  const section = page.locator(`.section[data-section="${sectionId}"]`);
  const start = section.locator('.fast-paced-start');
  assert.equal(await start.isDisabled(), false, `Section ${sectionId}: Fast-Paced start unexpectedly disabled`);
  await start.click();
  for (let round = 0; round < rounds; round += 1) {
    await page.waitForFunction(id => {
      const root = document.querySelector(`.section[data-section="${id}"]`);
      return root && Array.from(root.querySelectorAll('.fast-paced-option')).some(btn => !btn.disabled);
    }, String(sectionId));
    await page.evaluate(id => {
      const root = document.querySelector(`.section[data-section="${id}"]`);
      const prompt = root.querySelector('.fast-paced-prompt')?.textContent?.trim() || '';
      const blueprint = window.LEARN_SECTION_BLUEPRINTS.find(section => String(section.id) === String(id));
      const match = blueprint?.fastPaced?.combos?.find(entry => entry.label === prompt);
      if (!match) throw new Error(`Section ${id}: fast prompt not mapped: ${prompt}`);
      const button = Array.from(root.querySelectorAll('.fast-paced-option'))
        .find(btn => btn.dataset.combo === match.combo && !btn.disabled);
      if (!button) throw new Error(`Section ${id}: correct fast option not found for ${prompt}`);
      button.click();
    }, String(sectionId));
    await page.waitForTimeout(620);
  }
  await page.waitForFunction(id => {
    const root = document.querySelector(`.section[data-section="${id}"]`);
    return root?.querySelector('.fast-paced-start')?.textContent?.includes('Erneut starten');
  }, String(sectionId));
}

async function sectionMeta(sectionId) {
  return page.evaluate(id => {
    const blueprint = window.LEARN_SECTION_BLUEPRINTS.find(section => String(section.id) === String(id));
    if (!blueprint) throw new Error(`Blueprint ${id} missing`);
    return {
      fast: Boolean(blueprint.fastPaced),
      rounds: Math.max(1, blueprint.fastPaced?.rounds || 0)
    };
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
  await assertPlayable('Initial state');

  for (let sectionId = 1; sectionId <= 30; sectionId += 1) {
    await activateSection(sectionId);
    const meta = await sectionMeta(sectionId);
    let firstReward = null;

    for (let run = 1; run <= 3; run += 1) {
      const before = await readState();
      const beforeCoins = Number(before.coins || 0);

      if (meta.fast) {
        await playFastPerfect(sectionId, meta.rounds);
      } else {
        await solveStandardPerfect(sectionId);
      }

      const after = await readState();
      const rewardDelta = Number(after.coins || 0) - beforeCoins;
      assert.ok(rewardDelta > 0, `Section ${sectionId} run ${run}: expected positive coin reward`);
      if (run === 1) {
        firstReward = rewardDelta;
      } else {
        assert.equal(rewardDelta, Math.floor(firstReward / 2),
          `Section ${sectionId} run ${run}: repeat reward must be 50% in whole coins`);
      }

      const isFinalSubmission = sectionId === 30 && run === 3;
      if (!isFinalSubmission) {
        assert.equal(Number(after.sectionSubmissions?.[String(sectionId)] || 0), run,
          `Section ${sectionId} run ${run}: submission counter mismatch`);
      }

      const playable = await assertPlayable(`After section ${sectionId} run ${run}`);

      if (run === 3 && sectionId < 30) {
        assert.equal(await page.locator(`.section-tab[data-section-id="${sectionId}"]`).isDisabled(), true,
          `Section ${sectionId}: should lock at 3/3`);
        assert.ok(!playable.includes(String(sectionId)), `Section ${sectionId}: capped section must not remain playable`);
      }

      if (sectionId === 30 && run === 2) {
        const preReset = await readState();
        for (let id = 1; id <= 29; id += 1) {
          assert.equal(Number(preReset.sectionSubmissions?.[String(id)] || 0), 3,
            `Before final submission: section ${id} should be 3/3`);
        }
        assert.equal(Number(preReset.sectionSubmissions?.['30'] || 0), 2,
          'Before final submission: section 30 should be 2/3');
        assert.deepEqual(playable, ['30'],
          'Before the final 3/3 submission, section 30 should be the one remaining playable section');
      }

      if (run < 3 && !meta.fast) {
        const reset = page.locator(`.section[data-section="${sectionId}"] .reset-section`);
        assert.equal(await reset.isDisabled(), false, `Section ${sectionId}: reset must stay available before 3/3`);
        await reset.click();
        await page.waitForTimeout(70);
      }
    }
  }

  const finalState = await readState();
  assert.equal(Number(finalState.replayCycle || 0), 2, 'Completing section 30 at 3/3 should start replay cycle 2');
  assert.equal(Object.keys(finalState.sectionSubmissions || {}).length, 0,
    'New replay cycle should clear all 30 submission counters');
  const reopened = await enabledSectionIds();
  assert.equal(reopened.length, 30, 'All 30 sections should reopen after every section reached 3/3');
  assert.deepEqual(reopened, Array.from({ length: 30 }, (_, index) => String(index + 1)),
    'Reopened section set should be exactly 1..30');

  console.log('REPLAY POLICY FULL E2E OK: sections 1..30 completed 3x sequentially, rewards 100/50/50, never zero playable sections, then all 30 reopen.');
} finally {
  await browser.close();
}
