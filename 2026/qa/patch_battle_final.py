from pathlib import Path

css_path = Path('2026/modern-battle.css')
css = css_path.read_text(encoding='utf-8')
marker = '/* BATTLE FINAL POLISH -------------------------------------------------- */'
if marker not in css:
    css += r'''

/* BATTLE FINAL POLISH -------------------------------------------------- */
/* Keep all 11 battles discoverable: no hidden horizontal scroller. */
#battleView .battle-buttons {
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  gap: .36rem !important;
  overflow: visible !important;
  padding: .08rem 0 !important;
  scroll-snap-type: none !important;
}

#battleView .battle-btn {
  width: 100%;
  min-width: 0 !important;
  min-height: 40px !important;
  padding: .46rem .48rem !important;
  white-space: normal;
  line-height: 1.15;
  text-align: center;
}

#battleView .battle-btn:focus-visible,
#battleView .skill-cast-btn:focus-visible,
#battleView .battle-next:focus-visible {
  outline: 2px solid rgba(251,191,36,.88);
  outline-offset: 2px;
}

#battleView .battle-center-actions {
  min-width: 0;
}

#battleView .battle-center {
  overflow: hidden;
}

#battleView .battle-arena,
#battleView .modal-battle-overview,
#battleView .battle-foot {
  min-width: 0;
}

@media (max-width: 720px) {
  #battleView .battle-buttons {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: .3rem !important;
    margin-inline: 0 !important;
  }

  #battleView .battle-btn {
    min-height: 38px !important;
    padding: .42rem .3rem !important;
    font-size: .69rem !important;
  }

  #battleView .battle-sim {
    padding: .55rem !important;
  }

  #battleView .battle-arena {
    width: 100%;
    max-width: 100%;
  }
}

@media (max-width: 390px) {
  #battleView .battle-buttons {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}
'''
    css_path.write_text(css, encoding='utf-8')

smoke_path = Path('2026/qa/browser-smoke.mjs')
smoke = smoke_path.read_text(encoding='utf-8')

battle_anchor = '''  await page.locator('.nav-toggle[data-view="battle"]').click();
  assert.equal(await page.locator('.battle-btn[data-enemy="1"]').isDisabled(), false, 'Battle 1 should be available immediately');
'''
battle_insert = '''  await page.locator('.nav-toggle[data-view="battle"]').click();
  assert.equal(await page.locator('#battleButtons .battle-btn').count(), 11, 'Battle selector should expose all 11 fights');
  const battleButtonDisplay = await page.locator('#battleButtons').evaluate(el => getComputedStyle(el).display);
  assert.equal(battleButtonDisplay, 'grid', 'Battle selector should use a discoverable grid instead of hidden horizontal scrolling');
  const battleButtonOverflow = await page.locator('#battleButtons').evaluate(el => el.scrollWidth > el.clientWidth + 2);
  assert.equal(battleButtonOverflow, false, 'Battle selector must not require horizontal scrolling');
  const battleCardOverflow = await page.locator('#battleView .battle-card').evaluate(el => el.scrollWidth > el.clientWidth + 2);
  assert.equal(battleCardOverflow, false, 'Battle card must not overflow horizontally on desktop');
  assert.equal(await page.locator('.battle-btn[data-enemy="1"]').isDisabled(), false, 'Battle 1 should be available immediately');
'''
if battle_anchor not in smoke:
    raise SystemExit('desktop battle smoke anchor missing')
smoke = smoke.replace(battle_anchor, battle_insert, 1)

mobile_anchor = '''  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(horizontalOverflow <= 2, `Unexpected mobile horizontal overflow: ${horizontalOverflow}px`);

  if (pageErrors.length) throw new Error(`Page errors:''' 
mobile_insert = '''  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(horizontalOverflow <= 2, `Unexpected mobile horizontal overflow: ${horizontalOverflow}px`);

  await mobileMenu.click();
  await page.locator('#topNav .nav-toggle[data-view="battle"]').click();
  await page.waitForTimeout(80);
  assert.equal(await page.locator('#battleButtons .battle-btn').count(), 11, 'Mobile battle selector should still expose all 11 fights');
  const mobileBattleOverflow = await page.locator('#battleView .battle-card').evaluate(el => el.scrollWidth > el.clientWidth + 2);
  assert.equal(mobileBattleOverflow, false, 'Battle card must not overflow at 390px');
  const mobileBattleColumns = await page.locator('#battleButtons').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length);
  assert.equal(mobileBattleColumns, 2, '390px battle selector should use two readable columns');
  const availableBattle = page.locator('#battleButtons .battle-btn:not(:disabled)').first();
  assert.ok(await availableBattle.count(), 'At least one battle must be startable on mobile');
  await availableBattle.click();
  await page.waitForTimeout(120);
  assert.ok(await page.locator('#battleSimulation').isVisible(), 'Starting a battle should reveal the battle simulation');
  const arenaBox = await page.locator('#battleArena').boundingBox();
  assert.ok(arenaBox && arenaBox.width <= 390, 'Active battle arena must fit inside the mobile viewport');

  if (pageErrors.length) throw new Error(`Page errors:'''
if mobile_anchor not in smoke:
    raise SystemExit('mobile final smoke anchor missing')
smoke = smoke.replace(mobile_anchor, mobile_insert, 1)
smoke_path.write_text(smoke, encoding='utf-8')

print('battle final polish applied')
