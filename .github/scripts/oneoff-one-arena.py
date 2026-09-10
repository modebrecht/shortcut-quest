from pathlib import Path

css_path = Path('2026/modern-battle.css')
smoke_path = Path('2026/qa/browser-smoke.mjs')

css = css_path.read_text(encoding='utf-8')
marker = '/* ONE ARENA EXPERIMENT — hero and enemy live inside the stage */'
if marker in css:
    raise SystemExit('one-arena CSS already present')

css += r'''

/* ONE ARENA EXPERIMENT — hero and enemy live inside the stage */
#battleView .battle-overview {
  display: block;
  position: relative;
  isolation: isolate;
}

#battleView .battle-center {
  position: relative;
  width: 100%;
  padding: .78rem;
  border: 0;
  background: transparent;
  box-shadow: none;
}

#battleView .battle-stage-preview {
  min-height: 440px;
  margin-top: .12rem;
  border: 1px solid rgba(152,114,49,.18);
  box-shadow:
    inset 0 -120px 140px rgba(2,6,23,.56),
    inset 0 1px 0 rgba(255,255,255,.045),
    0 24px 54px rgba(2,6,23,.28);
}

#battleView .battle-side {
  position: absolute;
  top: 108px;
  z-index: 5;
  width: min(240px, 22%);
  min-width: 0;
  padding: 0;
  border: 0;
  background: transparent !important;
  box-shadow: none;
  pointer-events: none;
}

#battleView .battle-side.hero { left: clamp(18px, 3.2vw, 48px); }
#battleView .battle-side.enemy { right: clamp(18px, 3.2vw, 48px); left: auto; }

#battleView .battle-side-head {
  width: fit-content;
  max-width: 100%;
  padding: .48rem .62rem;
  border: 1px solid rgba(148,163,184,.13);
  border-radius: .78rem;
  background: rgba(4,12,24,.68);
  box-shadow: 0 10px 28px rgba(2,6,23,.22);
  backdrop-filter: blur(7px);
}

#battleView .battle-side.enemy .battle-side-head {
  margin-left: auto;
  text-align: right;
}

#battleView .battle-side-label {
  font-size: .58rem;
  letter-spacing: .09em;
}

#battleView .battle-side-head h3 {
  font-size: 1.04rem;
  margin-top: .04rem;
}

#battleView .battle-side-tier,
#battleView .battle-trait {
  background: rgba(5,14,27,.68);
  border-color: rgba(148,163,184,.14);
}

#battleView .battle-portrait,
#battleView .battle-portrait.hero,
#battleView .battle-portrait.enemy {
  width: clamp(165px, 17vw, 230px);
  height: clamp(220px, 23vw, 300px);
  margin: .18rem auto -.18rem;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  overflow: visible;
}

#battleView .battle-portrait-icon,
#battleView .battle-portrait-icon img {
  width: 100%;
  height: 100%;
}

#battleView .battle-portrait-icon img {
  max-height: 100%;
  object-fit: contain;
  object-position: center bottom;
  filter: drop-shadow(0 22px 24px rgba(2,6,23,.62));
}

#battleView .battle-statline {
  width: fit-content;
  max-width: 100%;
  margin: 0 auto;
  padding: .28rem .34rem;
  border: 1px solid rgba(148,163,184,.10);
  border-radius: .72rem;
  background: rgba(4,12,24,.66);
  backdrop-filter: blur(7px);
}

#battleView .battle-side.enemy .battle-statline { margin-left: auto; margin-right: 0; }
#battleView .battle-side.hero .battle-statline { margin-left: 0; margin-right: auto; }

#battleView .battle-gear {
  width: min(235px, 100%);
  margin-top: .3rem;
  gap: .22rem;
}

#battleView .battle-gear-label { display: none; }

#battleView .battle-gear-card {
  min-height: 42px;
  padding: .24rem .3rem;
  background: rgba(4,12,24,.62);
  border-color: rgba(148,163,184,.10);
  backdrop-filter: blur(6px);
}

#battleView .battle-gear-card .gear-icon {
  width: 29px;
  height: 29px;
}

#battleView .battle-gear-card .gear-text strong { font-size: .62rem; }
#battleView .battle-gear-card .gear-text span { font-size: .56rem; }

#battleView .battle-stage-preview .battle-crest-label {
  width: 88px;
  height: 88px;
  top: 49%;
  font-size: 1.24rem;
  z-index: 4;
}

#battleView .battle-buttons,
#battleView .battle-meta-strip,
#battleView .battle-start-btn {
  position: relative;
  z-index: 7;
}

@media (max-width: 980px) {
  #battleView .battle-stage-preview { min-height: 405px; }
  #battleView .battle-side {
    top: 106px;
    width: 25%;
  }
  #battleView .battle-portrait,
  #battleView .battle-portrait.hero,
  #battleView .battle-portrait.enemy {
    width: clamp(145px, 20vw, 195px);
    height: clamp(190px, 26vw, 250px);
  }
}

@media (max-width: 720px) {
  #battleView .battle-center { padding: .54rem; }
  #battleView .battle-stage-preview { min-height: 350px; }
  #battleView .battle-side {
    top: 94px;
    width: 41%;
  }
  #battleView .battle-side.hero { left: 10px; }
  #battleView .battle-side.enemy { right: 10px; }
  #battleView .battle-side-head {
    padding: .34rem .42rem;
    border-radius: .62rem;
  }
  #battleView .battle-side-head h3 { font-size: .78rem; }
  #battleView .battle-side-tier,
  #battleView .battle-trait { font-size: .55rem; padding: .16rem .3rem; }
  #battleView .battle-portrait,
  #battleView .battle-portrait.hero,
  #battleView .battle-portrait.enemy {
    width: min(155px, 35vw);
    height: 205px;
  }
  #battleView .battle-stat-badge { font-size: .56rem; padding: .22rem .3rem; }
  #battleView .battle-gear { display: none; }
  #battleView .battle-stage-preview .battle-crest-label {
    width: 64px;
    height: 64px;
    font-size: 1rem;
    top: 52%;
  }
}

@media (max-width: 460px) {
  #battleView .battle-stage-preview { min-height: 318px; }
  #battleView .battle-side { top: 90px; width: 43%; }
  #battleView .battle-side.hero { left: 6px; }
  #battleView .battle-side.enemy { right: 6px; }
  #battleView .battle-side-label { display: none; }
  #battleView .battle-side-head h3 { font-size: .7rem; }
  #battleView .battle-portrait,
  #battleView .battle-portrait.hero,
  #battleView .battle-portrait.enemy {
    width: min(136px, 36vw);
    height: 178px;
  }
  #battleView .battle-statline { gap: .15rem; padding: .2rem; }
  #battleView .battle-stat-badge { font-size: .5rem; padding: .17rem .24rem; }
}
'''
css_path.write_text(css, encoding='utf-8')

smoke = smoke_path.read_text(encoding='utf-8')
anchor = "  assert.equal(await page.locator('#battleStagePreview').count(), 1, 'Arena preview stage should exist');\n"
if anchor not in smoke:
    raise SystemExit('battle stage smoke anchor not found')
insert = anchor + r'''  const oneArenaLayout = await page.evaluate(() => {
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
'''
smoke = smoke.replace(anchor, insert, 1)
smoke_path.write_text(smoke, encoding='utf-8')
