from pathlib import Path
import re

css_path = Path('2026/modern-battle.css')
qa_path = Path('2026/qa/browser-smoke.mjs')
css = css_path.read_text(encoding='utf-8')
qa = qa_path.read_text(encoding='utf-8')

marker = '/* PREMIUM THREE-PANEL ARENA — FINAL SHOWCASE PASS */'
if marker in css:
    raise SystemExit('Premium three-panel arena pass already present')

css += r'''

/* PREMIUM THREE-PANEL ARENA — FINAL SHOWCASE PASS */
/* Approved direction: hero panel | premium dungeon showcase | enemy panel. */
#battleView .battle-card {
  padding: .82rem;
  border: 1px solid rgba(116,151,190,.14);
  border-radius: 1.55rem;
  background:
    radial-gradient(900px 420px at 50% -8%, rgba(30,74,124,.12), transparent 68%),
    linear-gradient(145deg, #0b1b2f 0%, #071422 48%, #06101c 100%);
  box-shadow: 0 28px 72px rgba(2,6,23,.35), inset 0 1px 0 rgba(255,255,255,.035);
}

#battleView .battle-overview {
  display: grid !important;
  grid-template-columns: minmax(245px,.78fr) minmax(560px,1.5fr) minmax(245px,.78fr) !important;
  gap: .95rem !important;
  align-items: stretch;
  min-height: 650px;
  position: relative;
  isolation: isolate;
}

#battleView .battle-side,
#battleView .battle-center {
  position: relative !important;
  inset: auto !important;
  top: auto !important;
  right: auto !important;
  bottom: auto !important;
  left: auto !important;
  width: auto !important;
  height: auto !important;
  min-width: 0;
  max-width: 100%;
  pointer-events: auto;
  border: 1px solid rgba(128,157,190,.14) !important;
  border-radius: 1.32rem !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.035), 0 22px 50px rgba(2,6,23,.18) !important;
}

#battleView .battle-side {
  display: flex !important;
  flex-direction: column !important;
  padding: 1.2rem 1.05rem 1.05rem !important;
  background:
    radial-gradient(320px 280px at 50% 35%, rgba(45,91,148,.11), transparent 68%),
    linear-gradient(180deg, rgba(8,22,40,.92), rgba(5,14,27,.98)) !important;
}

#battleView .battle-side.enemy {
  border-color: rgba(129,59,62,.30) !important;
  background:
    radial-gradient(320px 280px at 50% 35%, rgba(126,44,48,.10), transparent 68%),
    linear-gradient(180deg, rgba(11,20,36,.93), rgba(7,13,25,.98)) !important;
}

#battleView .battle-side-head {
  width: 100% !important;
  max-width: none !important;
  min-width: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
}

#battleView .battle-side.enemy .battle-side-head {
  display: flex !important;
  justify-content: space-between;
  align-items: flex-start;
  gap: .65rem;
  text-align: left !important;
}

#battleView .battle-side.enemy .battle-side-head > div:last-child {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: .3rem;
}

#battleView .battle-side-label,
#battleView .battle-gear-label {
  color: #8297b0;
  font-size: .72rem !important;
  font-weight: 900;
  letter-spacing: .09em;
}

#battleView .battle-side-head h3 {
  margin-top: .22rem;
  color: #f7f9fc;
  font-size: 1.26rem !important;
  line-height: 1.05;
}

#battleView .battle-side-tier,
#battleView .battle-trait {
  padding: .3rem .58rem;
  border: 1px solid rgba(148,163,184,.14);
  border-radius: .72rem;
  background: rgba(9,19,34,.52);
  color: #aebed2;
  font-size: .7rem;
}

/* Bigger hero, as requested: stronger visual parity with the enemy. */
#battleView .battle-portrait,
#battleView .battle-portrait.hero,
#battleView .battle-portrait.enemy {
  width: 218px !important;
  height: 252px !important;
  min-height: 0 !important;
  margin: 1.15rem auto .85rem !important;
  overflow: hidden !important;
  border: 1px solid rgba(94,141,196,.20) !important;
  border-radius: 1.35rem !important;
  background:
    radial-gradient(circle at 50% 38%, rgba(64,112,168,.15), transparent 56%),
    linear-gradient(180deg, rgba(3,13,28,.78), rgba(2,8,20,.96)) !important;
  box-shadow: inset 0 0 30px rgba(2,6,23,.55), 0 16px 34px rgba(2,6,23,.24) !important;
}

#battleView .battle-side.enemy .battle-portrait {
  width: 218px !important;
  height: 252px !important;
  border-color: rgba(137,60,64,.28) !important;
  background:
    radial-gradient(circle at 50% 38%, rgba(131,48,51,.13), transparent 56%),
    linear-gradient(180deg, rgba(8,12,25,.84), rgba(3,8,19,.97)) !important;
}

#battleView .battle-portrait-icon {
  display: grid !important;
  place-items: end center;
  width: 100% !important;
  height: 100% !important;
  overflow: visible !important;
}

#battleView .battle-portrait-icon img {
  display: block;
  width: 94% !important;
  height: 94% !important;
  max-width: 94% !important;
  max-height: 94% !important;
  object-fit: contain !important;
  object-position: center bottom !important;
  transform: none !important;
  filter: drop-shadow(0 18px 22px rgba(0,0,0,.48)) !important;
}

#battleView .battle-side.hero .battle-portrait-icon img {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  transform: scale(1.08) !important;
  transform-origin: 50% 100% !important;
}

#battleView .battle-statline {
  width: auto !important;
  max-width: 100% !important;
  margin: .05rem auto 0 !important;
  padding: 0 !important;
  transform: none !important;
  justify-content: center !important;
  border: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
}

#battleView .battle-gear {
  display: flex !important;
  width: 100% !important;
  margin-top: auto !important;
  padding-top: 1.1rem;
  gap: .42rem;
}

#battleView .battle-gear-label { display: block !important; }
#battleView .battle-gear-list { width: 100%; gap: .42rem; }
#battleView .battle-gear-card {
  min-height: 66px !important;
  padding: .48rem .5rem !important;
  border-color: rgba(148,163,184,.11) !important;
  background: rgba(10,22,39,.50) !important;
  backdrop-filter: none !important;
}

#battleView .battle-center {
  display: flex !important;
  flex-direction: column !important;
  justify-content: flex-start !important;
  gap: .62rem !important;
  padding: .55rem .72rem .85rem !important;
  overflow: hidden !important;
  background:
    radial-gradient(620px 260px at 50% 12%, rgba(40,92,151,.13), transparent 68%),
    linear-gradient(180deg, rgba(7,20,37,.96), rgba(4,12,24,.99)) !important;
}

#battleView .battle-center-head {
  position: relative;
  z-index: 8;
  padding: .05rem .15rem 0;
  text-align: center;
}

#battleView .battle-center-titleline h2 {
  font-size: 1.6rem !important;
  color: #f7ca59 !important;
  text-shadow: 0 0 22px rgba(245,158,11,.15);
}

#battleView .battle-center-head p {
  margin-top: .28rem !important;
  color: #8ea4bd !important;
  font-size: .8rem !important;
}

/* Premium dungeon showcase: architecture is composed from CSS layers, not a stretched image. */
#battleView .battle-stage-preview,
#battleView .battle-arena {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background-color: #06111d !important;
  background-image:
    /* torch fire */
    radial-gradient(circle at 8% 69%, rgba(255,224,135,.98) 0 2px, rgba(255,166,40,.78) 3px 7px, rgba(245,112,14,.22) 8px 24px, transparent 46px),
    radial-gradient(circle at 92% 69%, rgba(255,224,135,.98) 0 2px, rgba(255,166,40,.78) 3px 7px, rgba(245,112,14,.22) 8px 24px, transparent 46px),
    /* distant doorway */
    radial-gradient(ellipse at 50% 49%, rgba(28,61,91,.75) 0 8%, rgba(9,23,39,.92) 9% 16%, transparent 16.5%),
    /* side arches */
    radial-gradient(ellipse at 17% 62%, transparent 0 12%, rgba(5,14,25,.88) 12.5% 19%, transparent 19.5%),
    radial-gradient(ellipse at 83% 62%, transparent 0 12%, rgba(5,14,25,.88) 12.5% 19%, transparent 19.5%),
    /* cold depth light */
    radial-gradient(ellipse at 50% 18%, rgba(52,108,164,.28), transparent 46%),
    linear-gradient(180deg, #102a43 0%, #0b2035 32%, #081725 66%, #070d14 100%) !important;
  background-size: auto !important;
  background-position: center !important;
  filter: none !important;
}

#battleView .battle-stage-preview {
  min-height: 318px !important;
  margin: 0 !important;
  border: 1px solid rgba(133,104,47,.28) !important;
  border-radius: 1.05rem !important;
  box-shadow:
    inset 0 -92px 115px rgba(2,6,23,.56),
    inset 0 1px 0 rgba(255,255,255,.04),
    0 16px 40px rgba(2,6,23,.26) !important;
}

/* Stone walls, parapets, banners and foreground side masonry. */
#battleView .battle-stage-preview::before,
#battleView .battle-arena::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    /* banners */
    linear-gradient(180deg, rgba(100,68,28,.95), rgba(63,39,18,.95)) 11% 20% / 7% 34% no-repeat,
    linear-gradient(180deg, rgba(100,68,28,.95), rgba(63,39,18,.95)) 89% 20% / 7% 34% no-repeat,
    /* banner gold seams */
    linear-gradient(180deg, rgba(220,164,62,.80), rgba(151,101,35,.55)) 13.8% 25% / 1px 20% no-repeat,
    linear-gradient(180deg, rgba(220,164,62,.80), rgba(151,101,35,.55)) 86.2% 25% / 1px 20% no-repeat,
    /* side towers */
    linear-gradient(90deg, rgba(3,9,17,.92), rgba(24,42,58,.88) 52%, rgba(5,13,22,.96)) 0 0 / 16% 100% no-repeat,
    linear-gradient(270deg, rgba(3,9,17,.92), rgba(24,42,58,.88) 52%, rgba(5,13,22,.96)) 100% 0 / 16% 100% no-repeat,
    /* stone course lines */
    repeating-linear-gradient(0deg, transparent 0 37px, rgba(137,157,176,.065) 38px 39px),
    /* vignette */
    linear-gradient(90deg, rgba(1,5,10,.38), transparent 22% 78%, rgba(1,5,10,.38));
}

#battleView .battle-stage-haze {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background:
    radial-gradient(circle at 8% 69%, rgba(255,157,29,.18), transparent 11%),
    radial-gradient(circle at 92% 69%, rgba(255,157,29,.18), transparent 11%),
    radial-gradient(ellipse at 50% 82%, rgba(247,190,74,.08), transparent 38%),
    linear-gradient(180deg, rgba(36,75,110,.05), transparent 48%, rgba(0,0,0,.12));
}

#battleView .battle-stage-haze::before,
#battleView .battle-stage-haze::after {
  content: '';
  position: absolute;
  top: 16%;
  width: 7%;
  height: 34%;
  background:
    linear-gradient(180deg, rgba(172,113,37,.86), rgba(78,46,20,.94));
  border: 1px solid rgba(225,170,65,.34);
  clip-path: polygon(0 0,100% 0,100% 76%,50% 100%,0 76%);
  box-shadow: 0 12px 30px rgba(0,0,0,.34);
  opacity: .88;
}
#battleView .battle-stage-haze::before { left: 10.9%; }
#battleView .battle-stage-haze::after { right: 10.9%; }

/* Large perspective stone dais with several readable rings. */
#battleView .battle-stage-preview::after,
#battleView .battle-arena::after {
  content: '';
  position: absolute;
  left: 13%;
  right: 13%;
  bottom: -2%;
  height: 35%;
  z-index: 3;
  pointer-events: none;
  border: 1px solid rgba(230,177,70,.38);
  border-radius: 50%;
  background:
    radial-gradient(ellipse at center, rgba(239,190,82,.20) 0 4%, rgba(85,69,45,.14) 5% 14%, transparent 15% 23%, rgba(156,126,67,.13) 24% 25%, transparent 26% 42%, rgba(126,104,62,.09) 43% 44%, rgba(6,12,19,.54) 45% 100%),
    repeating-radial-gradient(ellipse at center, transparent 0 20px, rgba(184,147,74,.11) 21px 22px, transparent 23px 35px);
  box-shadow: 0 0 0 12px rgba(205,158,66,.025), 0 20px 52px rgba(0,0,0,.34), inset 0 0 50px rgba(245,158,11,.07);
}

#battleView .battle-stage-preview .battle-crest-label {
  position: absolute !important;
  left: 50% !important;
  top: 54% !important;
  z-index: 6 !important;
  width: 78px !important;
  height: 78px !important;
  transform: translate(-50%,-50%) !important;
  border: 1px solid rgba(251,191,36,.72) !important;
  background: radial-gradient(circle at 50% 38%, rgba(100,77,24,.35), rgba(10,17,27,.96) 67%) !important;
  box-shadow: 0 0 40px rgba(245,158,11,.18), 0 14px 34px rgba(0,0,0,.28), inset 0 0 24px rgba(245,158,11,.07) !important;
}

#battleView .battle-center-actions {
  position: relative;
  z-index: 8;
  margin-top: .02rem;
}

#battleView .battle-buttons {
  position: relative !important;
  z-index: 8;
}

#battleView .battle-btn.battle-featured {
  min-height: 136px !important;
}

#battleView .battle-meta-strip {
  position: relative;
  z-index: 8;
  background: rgba(6,16,29,.84) !important;
}

#battleView .battle-start-btn {
  position: relative;
  z-index: 8;
  width: min(440px,100%) !important;
  min-height: 62px !important;
  color: #f8d063 !important;
  background:
    radial-gradient(190px 70px at 50% 0%, rgba(251,191,36,.16), transparent 72%),
    linear-gradient(180deg, rgba(39,39,35,.98), rgba(14,22,32,.99)) !important;
  box-shadow: 0 0 38px rgba(245,158,11,.16), inset 0 1px 0 rgba(255,255,255,.05) !important;
}

/* Active combat keeps the same premium dungeon language. */
#battleView .battle-arena {
  height: clamp(400px,45vw,530px) !important;
  border-color: rgba(145,106,45,.30) !important;
  box-shadow: inset 0 -110px 125px rgba(2,6,23,.45), inset 0 1px 0 rgba(255,255,255,.035) !important;
}

@media (max-width: 1180px) and (min-width: 981px) {
  #battleView .battle-overview {
    grid-template-columns: minmax(215px,.76fr) minmax(0,1.42fr) minmax(215px,.76fr) !important;
  }
  #battleView .battle-portrait,
  #battleView .battle-portrait.hero,
  #battleView .battle-portrait.enemy {
    width: 190px !important;
    height: 228px !important;
  }
}

@media (max-width: 980px) {
  #battleView .battle-overview {
    grid-template-columns: repeat(2,minmax(0,1fr)) !important;
    min-height: 0;
  }
  #battleView .battle-center {
    grid-column: 1 / -1 !important;
    grid-row: 1 !important;
  }
  #battleView .battle-side.hero,
  #battleView .battle-side.enemy {
    grid-row: 2 !important;
  }
  #battleView .battle-stage-preview { min-height: 280px !important; }
}

@media (max-width: 720px) {
  #battleView .battle-overview {
    grid-template-columns: minmax(0,1fr) !important;
  }
  #battleView .battle-center,
  #battleView .battle-side.hero,
  #battleView .battle-side.enemy {
    grid-column: auto !important;
    grid-row: auto !important;
  }
  #battleView .battle-center { order: 1; }
  #battleView .battle-side.enemy { order: 2; }
  #battleView .battle-side.hero { order: 3; }
  #battleView .battle-stage-preview { min-height: 238px !important; }
  #battleView .battle-portrait,
  #battleView .battle-portrait.hero,
  #battleView .battle-portrait.enemy {
    width: 180px !important;
    height: 210px !important;
  }
  #battleView .battle-gear { display: none !important; }
  #battleView .battle-stage-haze::before,
  #battleView .battle-stage-haze::after { opacity: .58; }
}

@media (max-width: 460px) {
  #battleView .battle-card { padding: .55rem; }
  #battleView .battle-side { padding: .82rem !important; }
  #battleView .battle-stage-preview { min-height: 205px !important; }
  #battleView .battle-portrait,
  #battleView .battle-portrait.hero,
  #battleView .battle-portrait.enemy {
    width: 154px !important;
    height: 184px !important;
  }
  #battleView .battle-center-titleline h2 { font-size: 1.3rem !important; }
  #battleView .battle-btn.battle-featured { min-height: 94px !important; }
  #battleView .battle-start-btn { min-height: 56px !important; }
}
'''

pattern = re.compile(
    r"  const oneArenaLayout = await page\.evaluate\(\(\) => \{.*?"
    r"  assert\.ok\(oneArenaLayout\.enemyVerticalOverlapRatio > 0\.72, 'Most of the enemy presentation should live inside the arena stage'\);\n",
    re.S,
)
replacement = r'''  const threePanelLayout = await page.evaluate(() => {
    const stage = document.querySelector('#battleStagePreview')?.getBoundingClientRect();
    const card = document.querySelector('#battleView .battle-card')?.getBoundingClientRect();
    const center = document.querySelector('#battleView .battle-center')?.getBoundingClientRect();
    const hero = document.querySelector('#battleView .battle-side.hero')?.getBoundingClientRect();
    const enemy = document.querySelector('#battleView .battle-side.enemy')?.getBoundingClientRect();
    const heroPortrait = document.querySelector('#battleView .battle-side.hero .battle-portrait')?.getBoundingClientRect();
    if (!stage || !card || !center || !hero || !enemy || !heroPortrait) return null;
    return {
      stageWidthRatio: stage.width / center.width,
      centerWidthRatio: center.width / card.width,
      stageHeight: stage.height,
      heroPosition: getComputedStyle(document.querySelector('#battleView .battle-side.hero')).position,
      enemyPosition: getComputedStyle(document.querySelector('#battleView .battle-side.enemy')).position,
      heroLeftOfStage: hero.right <= stage.left + 4,
      enemyRightOfStage: enemy.left >= stage.right - 4,
      heroPortraitWidth: heroPortrait.width,
      heroPortraitHeight: heroPortrait.height
    };
  });
  assert.ok(threePanelLayout, 'Three-panel arena geometry should be measurable');
  assert.ok(threePanelLayout.centerWidthRatio > 0.40, 'Center arena should remain the dominant panel');
  assert.ok(threePanelLayout.stageWidthRatio > 0.90, 'Dungeon showcase should fill the center panel');
  assert.ok(threePanelLayout.stageHeight >= 300, 'Desktop dungeon showcase should be substantial');
  assert.equal(threePanelLayout.heroPosition, 'relative', 'Hero should occupy its own panel rather than overlay the arena');
  assert.equal(threePanelLayout.enemyPosition, 'relative', 'Enemy should occupy its own panel rather than overlay the arena');
  assert.equal(threePanelLayout.heroLeftOfStage, true, 'Hero panel should sit to the left of the arena showcase');
  assert.equal(threePanelLayout.enemyRightOfStage, true, 'Enemy panel should sit to the right of the arena showcase');
  assert.ok(threePanelLayout.heroPortraitWidth >= 200, 'Knight portrait should be noticeably larger on desktop');
  assert.ok(threePanelLayout.heroPortraitHeight >= 235, 'Knight portrait should have stronger visual presence');
'''
qa2, n = pattern.subn(replacement, qa, count=1)
if n != 1:
    raise SystemExit(f'Expected to replace one one-arena QA block, replaced {n}')
qa = qa2

css_path.write_text(css, encoding='utf-8')
qa_path.write_text(qa, encoding='utf-8')
print('Applied premium three-panel arena and updated geometry QA.')
