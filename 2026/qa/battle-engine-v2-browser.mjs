import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE_URL = process.env.TK2_BASE_URL || 'http://127.0.0.1:4173/2026/';

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error?.stack || error)));

  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.addScriptTag({ url: new URL('premium-motion.js', BASE_URL).href });
  await page.addScriptTag({ url: new URL('battle-motion.js', BASE_URL).href });
  await page.addScriptTag({ url: new URL('arena-dev-fix.js', BASE_URL).href });
  await page.addScriptTag({ url: new URL('a8-dev-polish.js', BASE_URL).href });

  const initialEngine = await page.evaluate(() => window.SHORTCUT_QUEST_BATTLE_ENGINE_V2);
  assert.ok(initialEngine, 'Battle V2 engine state must be exposed for diagnostics');
  assert.equal(initialEngine.version, 2, 'Battle engine must report version 2');
  assert.equal(initialEngine.phase, 'idle', 'Battle engine should start idle');
  assert.equal(initialEngine.turn, 0, 'Battle engine should start at turn 0');

  await page.locator('.nav-toggle[data-view="battle"]').click();
  await page.waitForFunction(() => document.getElementById('battleView')?.classList.contains('active'));
  await page.waitForFunction(() => document.getElementById('battleStagePreview')?.classList.contains('arena-svg-composed'));

  const completed = [];
  for (let fight = 1; fight <= 3; fight += 1) {
    const before = await page.evaluate(() => ({
      runId: window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.runId,
      phase: window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.phase
    }));
    assert.notEqual(before.phase, 'fighting', `Fight ${fight}: previous fight must not still be running`);

    await page.locator('#battleStartBtn').click();
    await page.waitForFunction(previousRunId => {
      const engine = window.SHORTCUT_QUEST_BATTLE_ENGINE_V2;
      return engine?.phase === 'fighting' && engine.runId === previousRunId + 1;
    }, before.runId);

    const started = await page.evaluate(() => ({
      runId: window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.runId,
      phase: window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.phase,
      datasetPhase: document.getElementById('battleView')?.dataset.battlePhase || ''
    }));
    assert.equal(started.phase, 'fighting', `Fight ${fight}: state must enter fighting`);
    assert.equal(started.datasetPhase, 'fighting', `Fight ${fight}: DOM diagnostics must mirror fighting state`);

    // Regression for the historical first-hit freeze: a normal fight must either reach
    // at least the enemy response / third turn or finish legitimately before that.
    await page.waitForFunction(() => {
      const engine = window.SHORTCUT_QUEST_BATTLE_ENGINE_V2;
      return engine && (engine.turn >= 3 || engine.phase !== 'fighting');
    }, null, { timeout: 7000 });

    await page.waitForFunction(() => {
      const engine = window.SHORTCUT_QUEST_BATTLE_ENGINE_V2;
      return engine && (engine.phase === 'victory' || engine.phase === 'defeat');
    }, null, { timeout: 45000 });

    const result = await page.evaluate(() => ({
      version: window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.version,
      phase: window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.phase,
      runId: window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.runId,
      turn: window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.turn,
      lastActor: window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.lastActor,
      lastOutcome: window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.lastOutcome,
      lastError: window.SHORTCUT_QUEST_BATTLE_ENGINE_V2.lastError,
      datasetPhase: document.getElementById('battleView')?.dataset.battlePhase || '',
      resultText: document.getElementById('battleResult')?.textContent?.trim() || '',
      logCount: document.querySelectorAll('#battleLog > *, .battle-log > *').length
    }));

    assert.equal(result.version, 2);
    assert.equal(result.runId, before.runId + 1, `Fight ${fight}: exactly one battle session must start`);
    assert.ok(result.turn >= 2, `Fight ${fight}: battle must advance beyond the opening strike`);
    assert.ok(['hero', 'enemy'].includes(result.lastActor), `Fight ${fight}: a real actor must complete a turn`);
    assert.ok(['victory', 'defeat'].includes(result.phase), `Fight ${fight}: battle must finish in a terminal state`);
    assert.equal(result.lastOutcome, result.phase, `Fight ${fight}: outcome and phase must agree`);
    assert.equal(result.datasetPhase, result.phase, `Fight ${fight}: DOM diagnostics must mirror terminal state`);
    assert.equal(result.lastError, null, `Fight ${fight}: engine must not fail internally`);
    assert.match(result.resultText, /Sieg|Niederlage/i, `Fight ${fight}: student must receive a clear result`);
    assert.ok(result.logCount >= 3, `Fight ${fight}: combat log must contain multiple events`);
    completed.push(result);

    if (fight < 3) {
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => document.getElementById('battleSimulation')?.classList.contains('hidden'));
      await page.waitForFunction(() => {
        const button = document.getElementById('battleStartBtn');
        return button && getComputedStyle(button).display !== 'none';
      });
    }
  }

  assert.deepEqual(completed.map(result => result.runId), [1, 2, 3], 'Three sequential fights must use distinct sessions');
  assert.equal(pageErrors.length, 0, `Battle V2 produced page errors:\n${pageErrors.join('\n')}`);
  console.log(`OK: Battle V2 completed 3 sequential fights (${completed.map(x => `${x.phase}/${x.turn}t`).join(', ')}).`);
} finally {
  await browser.close();
}
