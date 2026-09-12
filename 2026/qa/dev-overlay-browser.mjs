import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE_URL = process.env.TK2_BASE_URL || 'http://127.0.0.1:4173/2026/';
const SVG_ARENA_RE = /arena-scene\.svg/i;

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
  await page.waitForFunction(() => document.getElementById('battleStagePreview')?.classList.contains('arena-svg-composed'));
  await page.waitForTimeout(300);
  return page;
}

async function assertArenaAsset(page) {
  const assetUrl = new URL('assets/arena-scene.svg?v=20260912-svg-arena', BASE_URL).href;
  const response = await page.request.get(assetUrl);
  assert.equal(response.ok(), true, `SVG arena asset must load: ${response.status()}`);
  const contentType = response.headers()['content-type'] || '';
  assert.match(contentType, /image\/svg\+xml|text\/xml|application\/xml/i, 'Arena asset must be served as SVG/XML');
  const text = await response.text();
  assert.ok(text.length > 6_000, 'SVG arena must be a real illustrated scene, not a tiny placeholder');
  assert.match(text, /Shortcut Quest battle arena/i, 'SVG arena should contain its accessible title');
  assert.match(text, /<animate\b/i, 'SVG arena should include subtle native scene motion');
}

const browser = await chromium.launch({ headless: true });
try {
  const desktop = await openDevOverlayPage(browser, { width: 1790, height: 900 });
  await assertArenaAsset(desktop);

  const desktopState = await desktop.evaluate(() => {
    const stage = document.getElementById('battleStagePreview');
    const haze = document.querySelector('#battleView .battle-stage-haze');
    const heroSide = document.querySelector('#battleView .battle-side.hero');
    const enemySide = document.querySelector('#battleView .battle-side.enemy');
    const heroPortrait = document.querySelector('#battleView .battle-side.hero .battle-portrait');
    const enemyPortrait = document.querySelector('#battleView .battle-side.enemy .battle-portrait');
    const heroIcon = document.querySelector('#battleView .battle-side.hero .battle-portrait-icon');
    const enemyIconWrap = document.querySelector('#battleView .battle-side.enemy .battle-portrait-icon');
    const enemyIcon = document.getElementById('battleEnemyPreviewIcon');
    const startButton = document.getElementById('battleStartBtn');
    const card = document.querySelector('#battleView .battle-card');
    const css = el => el ? getComputedStyle(el) : null;
    const rect = el => el ? el.getBoundingClientRect() : null;
    const before = stage ? getComputedStyle(stage, '::before') : null;
    const after = stage ? getComputedStyle(stage, '::after') : null;
    return {
      stageBackground: css(stage)?.backgroundImage || '',
      stageBackgroundSize: css(stage)?.backgroundSize || '',
      stageBackgroundPosition: css(stage)?.backgroundPosition || '',
      stageWidth: rect(stage)?.width || 0,
      stageHeight: rect(stage)?.height || 0,
      beforeContent: before?.content || null,
      beforeDisplay: before?.display || null,
      afterContent: after?.content || null,
      afterDisplay: after?.display || null,
      hazeDisplay: css(haze)?.display || null,
      heroParentIsStage: heroSide?.parentElement === stage,
      enemyParentIsStage: enemySide?.parentElement === stage,
      startParentIsStage: startButton?.parentElement === stage,
      heroPortraitBackground: css(heroPortrait)?.backgroundImage || null,
      heroPortraitColor: css(heroPortrait)?.backgroundColor || null,
      enemyPortraitBackground: css(enemyPortrait)?.backgroundImage || null,
      enemyPortraitColor: css(enemyPortrait)?.backgroundColor || null,
      enemyIconBackground: css(enemyIcon)?.backgroundColor || null,
      heroAnimation: css(heroIcon)?.animationName || '',
      enemyAnimation: css(enemyIconWrap)?.animationName || '',
      startWidth: rect(startButton)?.width || 0,
      startHeight: rect(startButton)?.height || 0,
      overflow: card ? card.scrollWidth > card.clientWidth + 2 : true
    };
  });

  assert.match(desktopState.stageBackground, SVG_ARENA_RE, 'DEV arena must use the vector arena scene');
  assert.equal(desktopState.stageBackgroundSize, 'cover', 'SVG arena must cover the stage without stretching');
  assert.ok(desktopState.stageWidth > 900, 'Desktop arena must remain a large showpiece');
  assert.ok(desktopState.stageHeight >= 500, 'Desktop arena must have enough vertical room for full-body fighters');
  assert.ok(desktopState.beforeContent === 'none' || desktopState.beforeDisplay === 'none', 'Stage ::before must not cover the SVG');
  assert.ok(desktopState.afterContent === 'none' || desktopState.afterDisplay === 'none', 'Stage ::after must not cover the SVG');
  assert.equal(desktopState.hazeDisplay, 'none', 'DEV motion stack must not place haze over the arena');
  assert.equal(desktopState.heroParentIsStage, true, 'Hero must be composed directly inside the arena stage');
  assert.equal(desktopState.enemyParentIsStage, true, 'Enemy must be composed directly inside the arena stage');
  assert.equal(desktopState.startParentIsStage, true, 'Fight button must live directly inside the arena stage');
  assert.equal(desktopState.heroPortraitBackground, 'none', 'Hero portrait wrapper must stay transparent');
  assert.equal(desktopState.enemyPortraitBackground, 'none', 'Enemy portrait wrapper must stay transparent');
  assert.equal(desktopState.heroPortraitColor, 'rgba(0, 0, 0, 0)', 'Hero portrait background color must be transparent');
  assert.equal(desktopState.enemyPortraitColor, 'rgba(0, 0, 0, 0)', 'Enemy portrait background color must be transparent');
  assert.equal(desktopState.enemyIconBackground, 'rgba(0, 0, 0, 0)', 'Enemy image element must not receive a dark background');
  assert.match(desktopState.heroAnimation, /a8KnightIdle/i, 'Knight needs an idle animation');
  assert.match(desktopState.enemyAnimation, /a8EnemyIdle/i, 'Enemy needs a distinct idle animation');
  assert.ok(desktopState.startWidth >= 300, 'Fight button should be visually prominent on desktop');
  assert.ok(desktopState.startHeight >= 56, 'Fight button should be comfortably large');
  assert.equal(desktopState.overflow, false, 'DEV arena must not overflow on desktop');

  // Regression: actually start the fight. This protects the real battle scene,
  // not only the pre-battle showcase.
  await desktop.locator('#battleStartBtn').click();
  await desktop.waitForFunction(() => !document.getElementById('battleSimulation')?.classList.contains('hidden'));
  await desktop.waitForTimeout(180);
  const activeBattleState = await desktop.evaluate(() => {
    const card = document.querySelector('#battleView .battle-card');
    const overview = document.querySelector('#battleView .battle-overview');
    const sim = document.getElementById('battleSimulation');
    const arena = document.getElementById('battleArena');
    const knight = document.getElementById('battleKnight');
    const enemy = document.getElementById('battleEnemy');
    const knightSprite = document.getElementById('battleKnightSprite');
    const enemySprite = document.getElementById('battleEnemySprite');
    const rect = el => el ? el.getBoundingClientRect() : null;
    const kr = rect(knightSprite);
    const er = rect(enemySprite);
    const kw = rect(knight);
    const ew = rect(enemy);
    return {
      activeClass: Boolean(card?.classList.contains('a8-battle-active')),
      simVisible: Boolean(sim && !sim.classList.contains('hidden') && rect(sim)?.height > 0),
      overviewDisplay: overview ? getComputedStyle(overview).display : null,
      arenaWidth: rect(arena)?.width || 0,
      arenaHeight: rect(arena)?.height || 0,
      knightWidth: kr?.width || 0,
      knightHeight: kr?.height || 0,
      enemyWidth: er?.width || 0,
      enemyHeight: er?.height || 0,
      knightGround: kw?.bottom || 0,
      enemyGround: ew?.bottom || 0,
      overflow: card ? card.scrollWidth > card.clientWidth + 2 : true
    };
  });
  assert.equal(activeBattleState.activeClass, true, 'Starting combat must switch the card into active-battle mode');
  assert.equal(activeBattleState.simVisible, true, 'Active battle simulation must be visible after Start');
  assert.equal(activeBattleState.overviewDisplay, 'none', 'Pre-battle arena must hide while the real fight is active');
  assert.ok(activeBattleState.arenaWidth > 900 && activeBattleState.arenaHeight >= 400, 'Active desktop arena must remain a large scene');
  assert.ok(activeBattleState.knightHeight >= 220, 'Active knight must render at character scale, not as a squashed miniature');
  assert.ok(activeBattleState.knightWidth < activeBattleState.knightHeight, 'Active knight must preserve its upright aspect ratio');
  assert.ok(activeBattleState.enemyHeight >= 200, 'Active enemy must remain visually substantial');
  assert.ok(Math.abs(activeBattleState.knightGround - activeBattleState.enemyGround) <= 2, 'Active fighters must share one floor line');
  assert.equal(activeBattleState.overflow, false, 'Active desktop battle must not overflow');
  await desktop.close();

  const mobile = await openDevOverlayPage(browser, { width: 390, height: 844 });
  const mobileState = await mobile.evaluate(() => {
    const stage = document.getElementById('battleStagePreview');
    const card = document.querySelector('#battleView .battle-card');
    const haze = document.querySelector('#battleView .battle-stage-haze');
    const hero = document.querySelector('#battleView .battle-side.hero');
    const enemy = document.querySelector('#battleView .battle-side.enemy');
    const startButton = document.getElementById('battleStartBtn');
    return {
      overflow: card ? card.scrollWidth > card.clientWidth + 2 : true,
      stageBackground: stage ? getComputedStyle(stage).backgroundImage : '',
      stageBackgroundSize: stage ? getComputedStyle(stage).backgroundSize : '',
      stageHeight: stage ? stage.getBoundingClientRect().height : 0,
      haze: haze ? getComputedStyle(haze).display : null,
      heroInStage: hero?.parentElement === stage,
      enemyInStage: enemy?.parentElement === stage,
      startInStage: startButton?.parentElement === stage,
      startWidth: startButton?.getBoundingClientRect().width || 0
    };
  });
  assert.equal(mobileState.overflow, false, 'DEV arena must not overflow at 390px');
  assert.match(mobileState.stageBackground, SVG_ARENA_RE, 'Mobile DEV arena must use the vector scene');
  assert.equal(mobileState.stageBackgroundSize, 'cover', 'Mobile SVG arena must use cover');
  assert.ok(mobileState.stageHeight >= 480, 'Mobile arena must preserve fighter room');
  assert.equal(mobileState.haze, 'none', 'DEV haze must stay disabled on mobile');
  assert.equal(mobileState.heroInStage, true, 'Mobile hero must remain inside the arena');
  assert.equal(mobileState.enemyInStage, true, 'Mobile enemy must remain inside the arena');
  assert.equal(mobileState.startInStage, true, 'Mobile fight button must remain inside the arena');
  assert.ok(mobileState.startWidth >= 240, 'Mobile fight button must remain prominent');
  await mobile.close();

  console.log('OK: DEV SVG arena and the real active battle both stay grounded, readable, and overflow-safe.');
} finally {
  await browser.close();
}
