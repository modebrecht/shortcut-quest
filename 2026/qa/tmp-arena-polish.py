from pathlib import Path

index_path = Path('2026/index.html')
css_path = Path('2026/modern-battle.css')
smoke_path = Path('2026/qa/browser-smoke.mjs')

index = index_path.read_text(encoding='utf-8')
css = css_path.read_text(encoding='utf-8')
smoke = smoke_path.read_text(encoding='utf-8')

marker = '/* ARENA SCREENSHOT HIERARCHY POLISH 2026 */'
if marker in css:
    raise SystemExit('arena screenshot polish already applied')

old = '''      const maxUnlocked = Math.min(Math.max(1, state.battleUnlocked || 1), ENEMY_DATA.length);
      if (!selectedBattleLevel || selectedBattleLevel > maxUnlocked) selectedBattleLevel = maxUnlocked;
      battleButtons.forEach(btn => {'''
new = '''      const maxUnlocked = Math.min(Math.max(1, state.battleUnlocked || 1), ENEMY_DATA.length);
      if (!selectedBattleLevel || selectedBattleLevel > maxUnlocked) selectedBattleLevel = maxUnlocked;
      const featureStart = Math.min(
        Math.max(1, selectedBattleLevel - 1),
        Math.max(1, ENEMY_DATA.length - 2)
      );
      const featuredLevels = new Set([featureStart, featureStart + 1, featureStart + 2]);
      battleButtons.forEach(btn => {'''
if old not in index:
    raise SystemExit('updateBattleButtons feature window anchor missing')
index = index.replace(old, new, 1)

old = '''        const cleared = Boolean(state.battleClears && state.battleClears[level]);
        const selected = level === selectedBattleLevel && !locked;
        btn.disabled = locked;
        btn.classList.toggle("locked", locked);
        btn.classList.toggle("cleared", cleared);
        btn.classList.toggle("selected", selected);'''
new = '''        const cleared = Boolean(state.battleClears && state.battleClears[level]);
        const selected = level === selectedBattleLevel && !locked;
        const featured = featuredLevels.has(level);
        btn.disabled = locked;
        btn.classList.toggle("locked", locked);
        btn.classList.toggle("cleared", cleared);
        btn.classList.toggle("selected", selected);
        btn.classList.toggle("battle-featured", featured);
        btn.classList.toggle("battle-compact", !featured);
        btn.style.order = featured ? String(level - featureStart) : String(10 + level);'''
if old not in index:
    raise SystemExit('updateBattleButtons class anchor missing')
index = index.replace(old, new, 1)

css += r'''

/* ARENA SCREENSHOT HIERARCHY POLISH 2026 */
#battleView .battle-card {
  padding: .72rem;
  background:
    radial-gradient(900px 360px at 50% -8%, rgba(37,99,235,.08), transparent 70%),
    linear-gradient(150deg, rgba(13,25,44,.98), rgba(5,13,25,.99));
}

#battleView .battle-overview {
  gap: .9rem;
}

#battleView .battle-side,
#battleView .battle-center {
  border-radius: 1.28rem;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.028), 0 18px 48px rgba(2,6,23,.16);
}

#battleView .battle-side {
  padding: 1.05rem 1rem;
}

#battleView .battle-side-head h3 {
  font-size: 1.05rem;
}

#battleView .battle-portrait {
  width: 176px;
  height: 176px;
  margin: .75rem auto;
  border-radius: 1.3rem;
}

#battleView .battle-center {
  padding: .82rem .9rem .9rem;
  gap: .66rem;
  background:
    radial-gradient(620px 260px at 50% 16%, rgba(37,99,235,.15), transparent 68%),
    linear-gradient(160deg, rgba(8,19,36,.88), rgba(5,14,28,.97));
}

#battleView .battle-center-titleline {
  gap: .68rem;
}

#battleView .battle-center-titleline h2 {
  font-size: 1.5rem;
  letter-spacing: -.035em;
}

#battleView .battle-title-icon {
  width: 23px;
  height: 23px;
}

#battleView .battle-center-head p {
  margin-top: .3rem;
  font-size: .78rem;
}

#battleView .battle-stage-preview {
  min-height: 248px;
  border-radius: 1.08rem;
  background-position: center 61%;
  box-shadow:
    inset 0 -82px 92px rgba(2,6,23,.58),
    inset 0 1px 0 rgba(255,255,255,.045),
    0 18px 40px rgba(2,6,23,.26);
}

#battleView .battle-stage-preview::before {
  background:
    radial-gradient(circle at 15% 70%, rgba(245,158,11,.22), transparent 15%),
    radial-gradient(circle at 85% 70%, rgba(245,158,11,.22), transparent 15%),
    radial-gradient(ellipse at 50% 87%, rgba(251,191,36,.27) 0 4%, rgba(251,191,36,.07) 23%, transparent 46%),
    linear-gradient(90deg, rgba(2,6,23,.42), transparent 28% 72%, rgba(2,6,23,.42));
}

#battleView .battle-stage-preview::after {
  left: 15%;
  right: 15%;
  bottom: 5%;
  height: 34%;
  border-color: rgba(251,191,36,.34);
  box-shadow: 0 0 0 13px rgba(251,191,36,.025), inset 0 0 38px rgba(245,158,11,.1);
}

#battleView .battle-stage-preview .battle-crest-label {
  width: 74px;
  height: 74px;
  top: 55%;
  font-size: 1.18rem;
  border-color: rgba(251,191,36,.62);
  background: radial-gradient(circle at 50% 35%, rgba(82,64,19,.35), rgba(14,20,31,.94) 66%);
  box-shadow: 0 0 38px rgba(245,158,11,.16), inset 0 0 24px rgba(245,158,11,.07);
}

#battleView .battle-buttons {
  grid-template-columns: repeat(24, minmax(0,1fr)) !important;
  gap: .48rem !important;
  align-items: stretch;
}

#battleView .battle-btn.battle-featured {
  grid-column: span 8;
  min-height: 126px !important;
  padding: .66rem .7rem !important;
  border-radius: .92rem !important;
  background: linear-gradient(155deg, rgba(16,31,52,.92), rgba(6,16,30,.96)) !important;
}

#battleView .battle-btn.battle-featured .battle-btn-top {
  grid-template-columns: 58px minmax(0,1fr) 20px;
  gap: .55rem;
}

#battleView .battle-btn.battle-featured .battle-btn-art {
  width: 58px;
  height: 58px;
  border-radius: .72rem;
}

#battleView .battle-btn.battle-featured .battle-btn-rank {
  font-size: .69rem;
}

#battleView .battle-btn.battle-featured .battle-btn-name {
  margin-top: .05rem;
  font-size: .86rem;
}

#battleView .battle-btn.battle-featured .battle-btn-reward,
#battleView .battle-btn.battle-featured .battle-btn-requirement {
  font-size: .67rem;
}

#battleView .battle-btn.battle-featured.selected {
  border-color: rgba(251,191,36,.98) !important;
  background:
    radial-gradient(220px 110px at 20% 0%, rgba(245,158,11,.16), transparent 72%),
    linear-gradient(155deg, rgba(19,39,63,.98), rgba(7,19,35,.99)) !important;
  box-shadow:
    0 0 0 1px rgba(251,191,36,.2),
    0 10px 28px rgba(245,158,11,.12),
    inset 0 1px 0 rgba(255,255,255,.045) !important;
}

#battleView .battle-btn.battle-compact {
  grid-column: span 3;
  min-height: 32px !important;
  padding: .28rem .34rem !important;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: .62rem !important;
  background: rgba(8,18,34,.46) !important;
  opacity: .72;
}

#battleView .battle-btn.battle-compact:hover:not(:disabled) {
  opacity: 1;
}

#battleView .battle-btn.battle-compact .battle-btn-art,
#battleView .battle-btn.battle-compact .battle-btn-status,
#battleView .battle-btn.battle-compact .battle-btn-reward,
#battleView .battle-btn.battle-compact .battle-btn-requirement {
  display: none;
}

#battleView .battle-btn.battle-compact .battle-btn-top {
  display: block;
  width: auto;
}

#battleView .battle-btn.battle-compact .battle-btn-copy {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: center;
  gap: .22rem;
}

#battleView .battle-btn.battle-compact .battle-btn-rank {
  font-size: .58rem;
}

#battleView .battle-btn.battle-compact .battle-btn-name {
  max-width: 72px;
  font-size: .6rem;
  color: #9caec3;
}

#battleView .battle-btn.battle-compact.selected {
  opacity: 1;
  border-color: rgba(251,191,36,.72) !important;
}

#battleView .battle-meta-strip {
  margin-top: .04rem;
  min-height: 44px;
  border-radius: .8rem;
}

#battleView .battle-meta-strip > span {
  font-size: .62rem;
}

#battleView .battle-start-btn {
  width: min(430px,100%);
  min-height: 58px;
  margin-top: .12rem;
  font-size: .91rem;
  box-shadow: 0 0 34px rgba(245,158,11,.14), inset 0 1px 0 rgba(255,255,255,.05);
}

@media (max-width: 980px) {
  #battleView .battle-portrait {
    width: 154px;
    height: 154px;
  }
  #battleView .battle-stage-preview { min-height: 225px; }
}

@media (max-width: 720px) {
  #battleView .battle-buttons {
    grid-template-columns: repeat(12, minmax(0,1fr)) !important;
  }
  #battleView .battle-btn.battle-featured { grid-column: span 4; }
  #battleView .battle-btn.battle-compact { grid-column: span 2; }
  #battleView .battle-stage-preview { min-height: 195px; }
  #battleView .battle-btn.battle-featured {
    min-height: 112px !important;
    padding: .55rem !important;
  }
  #battleView .battle-btn.battle-featured .battle-btn-top {
    grid-template-columns: 46px minmax(0,1fr) 18px;
  }
  #battleView .battle-btn.battle-featured .battle-btn-art {
    width: 46px;
    height: 46px;
  }
}

@media (max-width: 460px) {
  #battleView .battle-buttons {
    grid-template-columns: repeat(4, minmax(0,1fr)) !important;
  }
  #battleView .battle-btn.battle-featured {
    grid-column: span 4;
    min-height: 82px !important;
  }
  #battleView .battle-btn.battle-compact { grid-column: span 1; }
  #battleView .battle-btn.battle-featured .battle-btn-top {
    grid-template-columns: 44px minmax(0,1fr) 18px;
  }
  #battleView .battle-btn.battle-featured .battle-btn-art {
    width: 44px;
    height: 44px;
  }
  #battleView .battle-btn.battle-compact .battle-btn-name { display: none; }
  #battleView .battle-stage-preview { min-height: 176px; }
  #battleView .battle-center-titleline h2 { font-size: 1.22rem; }
}
'''

old = '''  assert.equal(await page.locator('#battleButtons .battle-btn.selected').count(), 1, 'Arena should preselect exactly one available battle');
  assert.equal(await page.locator('.battle-btn[data-enemy="1"]').isDisabled(), false, 'Battle 1 should be available immediately');'''
new = '''  assert.equal(await page.locator('#battleButtons .battle-btn.selected').count(), 1, 'Arena should preselect exactly one available battle');
  assert.equal(await page.locator('#battleButtons .battle-btn.battle-featured').count(), 3, 'Arena should visually feature exactly three battle cards');
  assert.equal(await page.locator('#battleButtons .battle-btn.battle-compact').count(), 8, 'Remaining battles should stay reachable as subdued rank chips');
  assert.equal(await page.locator('.battle-btn[data-enemy="1"]').isDisabled(), false, 'Battle 1 should be available immediately');'''
if old not in smoke:
    raise SystemExit('desktop arena smoke anchor missing')
smoke = smoke.replace(old, new, 1)

old = '''  const mobileBattleColumns = await page.locator('#battleButtons').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length);
  assert.equal(mobileBattleColumns, 2, '390px battle selector should use two readable columns');'''
new = '''  const mobileBattleColumns = await page.locator('#battleButtons').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length);
  assert.equal(mobileBattleColumns, 4, '390px arena should use a four-column track for featured cards plus compact rank chips');
  assert.equal(await page.locator('#battleButtons .battle-btn.battle-featured').count(), 3, 'Mobile arena should keep exactly three featured battle cards');'''
if old not in smoke:
    raise SystemExit('mobile arena smoke anchor missing')
smoke = smoke.replace(old, new, 1)

index_path.write_text(index, encoding='utf-8')
css_path.write_text(css, encoding='utf-8')
smoke_path.write_text(smoke, encoding='utf-8')
print('Arena screenshot hierarchy polish applied.')
