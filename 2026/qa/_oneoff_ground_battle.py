from pathlib import Path

css_path = Path('2026/modern-battle.css')
test_path = Path('2026/qa/browser-smoke.mjs')

css = css_path.read_text(encoding='utf-8')
marker = '/* ACTIVE BATTLE CHARACTER GROUNDING 2026 */'
if marker not in css:
    css += r'''

/* ACTIVE BATTLE CHARACTER GROUNDING 2026 */
#battleView .battle-arena {
  position: relative;
  align-items: initial;
  justify-content: initial;
  padding: 0;
}

#battleView .battle-arena .fighter {
  position: absolute;
  bottom: clamp(18px, 2.2vw, 28px);
  margin: 0 !important;
  padding: 0;
  border: 0;
  background: transparent;
  overflow: visible;
  z-index: 2;
  display: block;
}

#battleView .battle-arena .fighter.knight {
  left: clamp(28px, 4vw, 64px);
  width: clamp(150px, 15vw, 210px);
  height: min(72%, 300px);
}

#battleView .battle-arena .fighter.enemy {
  left: auto;
  right: clamp(28px, 4vw, 64px);
  width: clamp(220px, 22vw, 320px);
  height: min(78%, 330px);
}

#battleView .battle-arena .fighter-sprite,
#battleView .battle-arena .fighter.knight .fighter-sprite {
  top: auto;
  bottom: 0;
  left: 50%;
  width: 100%;
  height: auto;
  max-width: none;
  max-height: 100%;
  object-fit: contain;
  object-position: center bottom;
  transform: translateX(-50%);
  transform-origin: 50% 100%;
}

@media (max-width: 720px) {
  #battleView .battle-arena .fighter {
    bottom: 14px;
  }
  #battleView .battle-arena .fighter.knight {
    left: 10px;
    width: 150px;
    height: min(72%, 220px);
  }
  #battleView .battle-arena .fighter.enemy {
    right: 8px;
    width: 220px;
    height: min(78%, 235px);
  }
}
'''
    css_path.write_text(css, encoding='utf-8')

test = test_path.read_text(encoding='utf-8')
target = "  const arenaBox = await page.locator('#battleArena').boundingBox();\n  assert.ok(arenaBox && arenaBox.width <= 390, 'Active battle arena must fit inside the mobile viewport');\n"
insert = target + r'''  const groundedFighters = await page.evaluate(() => {
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
'''
if 'Hero and enemy should share one visual ground line' not in test:
    if target not in test:
        raise SystemExit('browser-smoke grounding insertion target not found')
    test = test.replace(target, insert, 1)
    test_path.write_text(test, encoding='utf-8')
