from pathlib import Path

css_path = Path('2026/modern-battle.css')
smoke_path = Path('2026/qa/browser-smoke.mjs')
css = css_path.read_text(encoding='utf-8')
smoke = smoke_path.read_text(encoding='utf-8')

marker = '/* ARENA SCREENSHOT-FAITHFUL PASS */'
if marker in css:
    css = css.split(marker)[0].rstrip() + '\n'

css += r'''

/* ARENA SCREENSHOT-FAITHFUL PASS */
/* Match the approved mockup with CSS only: no generated/new image assets. */
#battleView .battle-card {
  padding: .82rem;
  border-radius: 1.55rem;
  background:
    radial-gradient(1100px 420px at 50% -10%, rgba(28,71,119,.10), transparent 70%),
    linear-gradient(150deg, #0b1a2d 0%, #071321 48%, #06101d 100%);
}

#battleView .battle-overview {
  grid-template-columns: minmax(270px,.82fr) minmax(610px,1.38fr) minmax(270px,.82fr);
  gap: .95rem;
  min-height: 640px;
}

#battleView .battle-side,
#battleView .battle-center {
  border-radius: 1.35rem;
  background: linear-gradient(180deg, rgba(8,22,40,.86), rgba(5,14,27,.95));
  box-shadow: inset 0 1px 0 rgba(255,255,255,.035), 0 22px 50px rgba(2,6,23,.20);
}

#battleView .battle-side {
  padding: 1.35rem 1.25rem 1.15rem;
  display: flex;
  flex-direction: column;
}

#battleView .battle-side.hero {
  border-color: rgba(71,123,178,.22);
  background:
    radial-gradient(320px 250px at 50% 38%, rgba(36,86,145,.13), transparent 72%),
    linear-gradient(180deg, rgba(8,22,40,.91), rgba(5,14,27,.97));
}

#battleView .battle-side.enemy {
  border-color: rgba(126,57,61,.30);
  background:
    radial-gradient(320px 250px at 50% 38%, rgba(111,35,42,.10), transparent 72%),
    linear-gradient(180deg, rgba(11,20,36,.91), rgba(7,13,25,.97));
}

#battleView .battle-side-label,
#battleView .battle-gear-label {
  font-size: .72rem;
  letter-spacing: .085em;
}

#battleView .battle-side-head h3 {
  margin-top: .18rem;
  font-size: 1.28rem;
}

#battleView .battle-portrait {
  width: clamp(190px,14vw,238px);
  height: clamp(190px,14vw,238px);
  margin: 1.35rem auto 1.05rem;
  border-radius: 1.45rem;
  background:
    radial-gradient(circle at 50% 38%, rgba(48,87,139,.13), transparent 58%),
    linear-gradient(180deg, rgba(3,13,28,.78), rgba(2,8,20,.94));
}

#battleView .battle-side.enemy .battle-portrait {
  background:
    radial-gradient(circle at 50% 38%, rgba(112,39,48,.12), transparent 58%),
    linear-gradient(180deg, rgba(8,12,25,.82), rgba(3,8,19,.96));
}

#battleView .battle-portrait-icon img {
  width: 84%;
  max-height: 90%;
}

#battleView .battle-statline {
  margin-top: .15rem;
  gap: .42rem;
}

#battleView .battle-stat-badge {
  padding: .38rem .62rem;
  font-size: .75rem;
}

#battleView .battle-gear {
  margin-top: auto;
  padding-top: 1rem;
}

#battleView .battle-gear-card {
  min-height: 68px;
  padding: .5rem .55rem;
}

#battleView .battle-center {
  padding: .55rem .72rem .82rem;
  gap: .58rem;
  overflow: hidden;
}

#battleView .battle-center-head {
  padding-top: .1rem;
}

#battleView .battle-center-titleline {
  gap: .85rem;
}

#battleView .battle-center-titleline::before,
#battleView .battle-center-titleline::after {
  content: '';
  width: 110px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(251,191,36,.58));
}

#battleView .battle-center-titleline::after {
  background: linear-gradient(90deg, rgba(251,191,36,.58), transparent);
}

#battleView .battle-center-titleline h2 {
  font-size: 1.62rem;
  color: #f6c95f;
  text-shadow: 0 0 20px rgba(245,158,11,.12);
}

#battleView .battle-center-head p {
  margin-top: .28rem;
  color: #88a0bc;
  font-size: .8rem;
}

/* Dark stone arena: replaces forest/mountain/celestial art in both preview and combat. */
#battleView .battle-stage-preview,
#battleView .battle-arena {
  background-color: #071421 !important;
  background-image:
    radial-gradient(circle at 7% 68%, rgba(255,191,64,.92) 0 2px, rgba(245,137,20,.48) 3px 7px, rgba(245,137,20,.10) 8px 28px, transparent 46px),
    radial-gradient(circle at 93% 68%, rgba(255,191,64,.92) 0 2px, rgba(245,137,20,.48) 3px 7px, rgba(245,137,20,.10) 8px 28px, transparent 46px),
    radial-gradient(ellipse at 50% 93%, rgba(251,191,36,.18) 0 5%, rgba(251,191,36,.035) 24%, transparent 48%),
    repeating-linear-gradient(0deg, rgba(106,126,148,.075) 0 1px, transparent 1px 38px),
    repeating-linear-gradient(90deg, rgba(101,120,142,.055) 0 1px, transparent 1px 82px),
    linear-gradient(180deg, #0a2035 0%, #0a1a2c 36%, #091624 68%, #080e16 100%) !important;
  background-size: auto !important;
  background-position: center !important;
  filter: none !important;
}

#battleView .battle-stage-preview {
  min-height: 306px;
  border: 0;
  border-radius: 1.08rem;
  box-shadow: inset 0 -95px 110px rgba(2,6,23,.54), inset 0 1px 0 rgba(255,255,255,.045);
}

#battleView .battle-stage-preview::before,
#battleView .battle-arena::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    linear-gradient(90deg, rgba(2,7,14,.72) 0 5%, transparent 5% 13%, rgba(2,7,14,.44) 13% 15%, transparent 15% 85%, rgba(2,7,14,.44) 85% 87%, transparent 87% 95%, rgba(2,7,14,.72) 95%),
    radial-gradient(ellipse at 20% 58%, transparent 0 20%, rgba(4,10,19,.50) 21% 33%, transparent 34%),
    radial-gradient(ellipse at 80% 58%, transparent 0 20%, rgba(4,10,19,.50) 21% 33%, transparent 34%),
    linear-gradient(180deg, rgba(29,55,81,.14), transparent 42%, rgba(0,0,0,.14));
  mix-blend-mode: normal;
}

#battleView .battle-stage-preview::after,
#battleView .battle-arena::after {
  content: '';
  position: absolute;
  left: 13%;
  right: 13%;
  bottom: 4%;
  height: 30%;
  z-index: 1;
  pointer-events: none;
  border: 1px solid rgba(223,169,54,.29);
  border-radius: 50%;
  background:
    radial-gradient(ellipse at center, rgba(251,191,36,.10), rgba(25,34,43,.08) 38%, rgba(2,6,23,.34) 70%),
    repeating-radial-gradient(ellipse at center, transparent 0 18px, rgba(168,133,61,.10) 19px 20px, transparent 21px 33px);
  box-shadow: 0 0 0 12px rgba(251,191,36,.018), inset 0 0 42px rgba(245,158,11,.06);
}

#battleView .battle-stage-preview .battle-crest-label {
  width: 78px;
  height: 78px;
  top: 56%;
  z-index: 3;
  border-color: rgba(251,191,36,.72);
  background: radial-gradient(circle at 50% 35%, rgba(84,66,18,.34), rgba(10,17,27,.96) 66%);
  box-shadow: 0 0 38px rgba(245,158,11,.18), inset 0 0 24px rgba(245,158,11,.08);
}

/* Three hero encounter cards carry the visual weight, matching the approved mockup. */
#battleView .battle-buttons {
  margin-top: -.02rem;
  gap: .55rem !important;
}

#battleView .battle-btn.battle-featured {
  min-height: 146px !important;
  padding: .76rem .78rem !important;
  border-radius: 1rem !important;
}

#battleView .battle-btn.battle-featured .battle-btn-top {
  grid-template-columns: 64px minmax(0,1fr) 20px;
  gap: .62rem;
}

#battleView .battle-btn.battle-featured .battle-btn-art {
  width: 64px;
  height: 64px;
}

#battleView .battle-btn.battle-featured .battle-btn-name {
  font-size: .92rem;
}

#battleView .battle-btn.battle-featured .battle-btn-reward,
#battleView .battle-btn.battle-featured .battle-btn-requirement {
  margin-top: .18rem;
  font-size: .7rem;
}

#battleView .battle-btn.battle-compact {
  min-height: 28px !important;
  opacity: .46;
  border-color: rgba(148,163,184,.07) !important;
  background: rgba(5,14,27,.34) !important;
}

#battleView .battle-meta-strip {
  min-height: 46px;
  margin-top: .02rem;
  border-color: rgba(148,163,184,.11);
  background: rgba(6,16,29,.78);
}

#battleView .battle-start-btn {
  width: min(440px,100%);
  min-height: 62px;
  margin-top: .12rem;
  font-size: .98rem;
  color: #f7cd63;
  background:
    radial-gradient(190px 70px at 50% 0%, rgba(251,191,36,.14), transparent 72%),
    linear-gradient(180deg, rgba(37,38,36,.96), rgba(15,23,33,.98));
  box-shadow: 0 0 38px rgba(245,158,11,.16), inset 0 1px 0 rgba(255,255,255,.045);
}

/* Active fight uses the same approved dark arena instead of switching back to forest. */
#battleView .battle-arena {
  height: clamp(390px,45vw,520px);
  padding: 0;
  border-color: rgba(152,114,49,.26);
  box-shadow: inset 0 -110px 120px rgba(2,6,23,.40), inset 0 1px 0 rgba(255,255,255,.035);
}

#battleView .battle-arena .fighter {
  z-index: 3;
}

@media (max-width: 1180px) {
  #battleView .battle-overview {
    grid-template-columns: minmax(235px,.78fr) minmax(520px,1.38fr) minmax(235px,.78fr);
  }
  #battleView .battle-portrait {
    width: 190px;
    height: 190px;
  }
}

@media (max-width: 980px) {
  #battleView .battle-overview {
    min-height: 0;
    grid-template-columns: repeat(2,minmax(0,1fr));
  }
  #battleView .battle-center {
    grid-column: 1 / -1;
  }
  #battleView .battle-stage-preview {
    min-height: 255px;
  }
}

@media (max-width: 720px) {
  #battleView .battle-overview {
    grid-template-columns: 1fr;
  }
  #battleView .battle-center,
  #battleView .battle-side.hero,
  #battleView .battle-side.enemy {
    grid-column: auto;
  }
  #battleView .battle-stage-preview {
    min-height: 205px;
  }
  #battleView .battle-center-titleline::before,
  #battleView .battle-center-titleline::after {
    width: 46px;
  }
  #battleView .battle-btn.battle-featured {
    min-height: 116px !important;
  }
  #battleView .battle-arena {
    height: 330px;
  }
}

@media (max-width: 460px) {
  #battleView .battle-side {
    padding: .82rem;
  }
  #battleView .battle-portrait {
    width: 142px;
    height: 142px;
    margin: .7rem auto;
  }
  #battleView .battle-stage-preview {
    min-height: 182px;
  }
  #battleView .battle-center-titleline h2 {
    font-size: 1.3rem;
  }
  #battleView .battle-btn.battle-featured {
    min-height: 88px !important;
  }
  #battleView .battle-start-btn {
    min-height: 56px;
  }
  #battleView .battle-arena {
    height: 290px;
  }
}
'''

preview_anchor = "  assert.equal(await page.locator('#battleStagePreview').count(), 1, 'Arena preview stage should exist');\n"
preview_insert = preview_anchor + "  const previewArenaBackground = await page.locator('#battleStagePreview').evaluate(el => getComputedStyle(el).backgroundImage);\n  assert.equal(/battle-bg-forest/i.test(previewArenaBackground), false, 'Arena preview must use the dark stone arena instead of the forest background');\n"
if "previewArenaBackground" not in smoke:
    if preview_anchor not in smoke:
        raise SystemExit('preview smoke anchor missing')
    smoke = smoke.replace(preview_anchor, preview_insert, 1)

arena_anchor = "  assert.ok(arenaBox && arenaBox.width <= 390, 'Active battle arena must fit inside the mobile viewport');\n"
arena_insert = arena_anchor + "  const activeArenaBackground = await page.locator('#battleArena').evaluate(el => getComputedStyle(el).backgroundImage);\n  assert.equal(/battle-bg-forest/i.test(activeArenaBackground), false, 'Active combat must not switch back to the forest background');\n"
if "activeArenaBackground" not in smoke:
    if arena_anchor not in smoke:
        raise SystemExit('active arena smoke anchor missing')
    smoke = smoke.replace(arena_anchor, arena_insert, 1)

css_path.write_text(css, encoding='utf-8')
smoke_path.write_text(smoke, encoding='utf-8')
