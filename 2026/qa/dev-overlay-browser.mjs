import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE_URL = process.env.TK2_BASE_URL || 'http://127.0.0.1:4173/2026/';

async function openDevOverlayPage(browser, viewport) {
  const page = await browser.newPage({ viewport });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.addScriptTag({ url: new URL('premium-motion.js', BASE_URL).href });
  await page.addScriptTag({ url: new URL('battle-motion.js', BASE_URL).href });
  await page.addScriptTag({ url: new URL('arena-dev-fix.js', BASE_URL).href });
  await page.evaluate(() => {
    const battleNav = document.querySelector('.nav-toggle[data-view="battle"]');
    if (!(battleNav instanceof HTMLElement)) throw new Error('Battle nav missing');
    battleNav.click();
  });
  await page.waitForFunction(() => document.getElementById('battleView')?.classList.contains('active'));
  await page.waitForTimeout(250);
  return page;
}

const browser = await chromium.launch({ headless: true });
try {
  const desktop = await openDevOverlayPage(browser, { width: 1790, height: 900 });
  const desktopState = await desktop.evaluate(() => {
    const stage = document.getElementById('battleStagePreview');
    const haze = document.querySelector('#battleView .battle-stage-haze');
    const heroPortrait = document.querySelector('#battleView .battle-side.hero .battle-portrait');
    const enemyPortrait = document.querySelector('#battleView .battle-side.enemy .battle-portrait');
    const enemyIcon = document.getElementById('battleEnemyPreviewIcon');
    const card = document.querySelector('#battleView .battle-card');
    const css = el => el ? getComputedStyle(el) : null;
    const rect = el => el ? el.getBoundingClientRect() : null;
    const before = stage ? getComputedStyle(stage, '::before') : null;
    const after = stage ? getComputedStyle(stage, '::after') : null;
    return {
      stageBackground: css(stage)?.backgroundImage || '',
      stageBackgroundColor: css(stage)?.backgroundColor || '',
      stageWidth: rect(stage)?.width || 0,
      beforeContent: before?.content || null,
      beforeDisplay: before?.display || null,
      afterContent: after?.content || null,
      afterDisplay: after?.display || null,
      hazeDisplay: css(haze)?.display || null,
      hazeOpacity: css(haze)?.opacity || null,
      heroPortraitBackground: css(heroPortrait)?.backgroundImage || null,
      heroPortraitColor: css(heroPortrait)?.backgroundColor || null,
      enemyPortraitBackground: css(enemyPortrait)?.backgroundImage || null,
      enemyPortraitColor: css(enemyPortrait)?.backgroundColor || null,
      enemyIconBackground: css(enemyIcon)?.backgroundColor || null,
      overflow: card ? card.scrollWidth > card.clientWidth + 2 : true
    };
  });

  assert.doesNotMatch(desktopState.stageBackground, /arena-premium\.jpg/i, 'DEV arena must not use the corrupt grey bitmap');
  assert.doesNotMatch(desktopState.stageBackground, /url\(/i, 'DEV arena backdrop must be self-contained CSS, not a bitmap');
  assert.match(desktopState.stageBackground, /linear-gradient/i, 'DEV arena must render the CSS dungeon backdrop');
  assert.notEqual(desktopState.stageBackgroundColor, 'rgb(128, 128, 128)', 'DEV arena background must not be neutral grey');
  assert.ok(desktopState.stageWidth > 900, 'Desktop arena must remain a large showpiece');
  assert.ok(desktopState.beforeContent === 'none' || desktopState.beforeDisplay === 'none', 'Stage ::before must not cover the dungeon backdrop');
  assert.ok(desktopState.afterContent === 'none' || desktopState.afterDisplay === 'none', 'Stage ::after must not cover the dungeon backdrop');
  assert.equal(desktopState.hazeDisplay, 'none', 'DEV motion stack must not place haze over the arena artwork');
  assert.equal(desktopState.heroPortraitBackground, 'none', 'Hero portrait wrapper must stay transparent after DEV motion scripts');
  assert.equal(desktopState.enemyPortraitBackground, 'none', 'Enemy portrait wrapper must stay transparent after DEV motion scripts');
  assert.equal(desktopState.heroPortraitColor, 'rgba(0, 0, 0, 0)', 'Hero portrait background color must be transparent');
  assert.equal(desktopState.enemyPortraitColor, 'rgba(0, 0, 0, 0)', 'Enemy portrait background color must be transparent');
  assert.equal(desktopState.enemyIconBackground, 'rgba(0, 0, 0, 0)', 'Enemy image element must not receive a dark background');
  assert.equal(desktopState.overflow, false, 'DEV arena must not overflow on desktop');
  await desktop.close();

  const mobile = await openDevOverlayPage(browser, { width: 390, height: 844 });
  const mobileState = await mobile.evaluate(() => {
    const stage = document.getElementById('battleStagePreview');
    const card = document.querySelector('#battleView .battle-card');
    const haze = document.querySelector('#battleView .battle-stage-haze');
    const enemyPortrait = document.querySelector('#battleView .battle-side.enemy .battle-portrait');
    return {
      overflow: card ? card.scrollWidth > card.clientWidth + 2 : true,
      stageBackground: stage ? getComputedStyle(stage).backgroundImage : '',
      haze: haze ? getComputedStyle(haze).display : null,
      enemyBackground: enemyPortrait ? getComputedStyle(enemyPortrait).backgroundImage : null
    };
  });
  assert.equal(mobileState.overflow, false, 'DEV arena must not overflow at 390px');
  assert.doesNotMatch(mobileState.stageBackground, /arena-premium\.jpg|url\(/i, 'Mobile DEV arena must not use the corrupt bitmap');
  assert.equal(mobileState.haze, 'none', 'DEV haze must stay disabled on mobile');
  assert.equal(mobileState.enemyBackground, 'none', 'Enemy portrait wrapper must stay transparent on mobile');
  await mobile.close();

  console.log('OK: DEV arena uses the CSS dungeon backdrop with no corrupt bitmap, no covering pseudo layers and transparent fighter wrappers.');
} finally {
  await browser.close();
}
