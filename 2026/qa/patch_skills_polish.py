from pathlib import Path

css_path = Path('2026/modern-game.css')
css = css_path.read_text(encoding='utf-8')
marker = '/* SKILLS COMPACT LOADOUT POLISH --------------------------------------- */'
if marker not in css:
    css += r'''

/* SKILLS COMPACT LOADOUT POLISH --------------------------------------- */
#skillsView .skill-wrapper {
  grid-template-columns: minmax(210px, .52fr) minmax(0, 1.48fr) !important;
  gap: .78rem !important;
  align-items: stretch !important;
}

#skillsView .skill-avatar {
  --skill-svg-min: 150px !important;
  --skill-svg-fluid: 17vw !important;
  --skill-svg-max: 230px !important;
  min-height: 220px !important;
  max-height: 280px;
  padding: .72rem !important;
  overflow: hidden;
}

#skillsView .skill-avatar::before {
  inset: .65rem !important;
}

#skillsView .skill-compendium {
  display: flex;
  flex-direction: column;
  gap: .5rem !important;
}

#skillsView .skill-list {
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  grid-auto-rows: minmax(132px, auto);
  gap: .5rem !important;
  align-items: stretch;
}

#skillsView .inventory-item[data-skill-key] {
  min-height: 132px;
  height: 100%;
  padding: .62rem !important;
  gap: .42rem !important;
  border-radius: .9rem !important;
  position: relative;
  overflow: hidden;
}

#skillsView .inventory-item[data-skill-key]::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.025);
}

#skillsView .inventory-item[data-skill-key] .item-left {
  gap: .52rem !important;
  align-items: center;
}

#skillsView .inventory-item[data-skill-key] .item-icon {
  width: 50px !important;
  height: 50px !important;
  min-width: 50px !important;
  border-radius: .68rem !important;
}

#skillsView .inventory-item[data-skill-key] .item-text {
  min-width: 0 !important;
  gap: .1rem !important;
}

#skillsView .inventory-item[data-skill-key] .item-text strong {
  font-size: .84rem !important;
  line-height: 1.15;
}

#skillsView .inventory-item[data-skill-key] .item-text span {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: .68rem !important;
  line-height: 1.28 !important;
}

#skillsView .inventory-item[data-skill-key] .item-meta {
  font-size: .66rem !important;
}

#skillsView .inventory-item[data-skill-key] .item-controls {
  margin-top: auto;
  gap: .3rem !important;
  align-items: center !important;
}

#skillsView .inventory-item[data-skill-key] .item-stats {
  gap: .22rem !important;
  flex-wrap: wrap;
}

#skillsView .inventory-item[data-skill-key] .skill-bonus-indicator {
  min-height: 34px;
  padding: .38rem .48rem !important;
  border-radius: .62rem !important;
  background: rgba(15,23,42,.46);
  border-color: rgba(148,163,184,.14);
}

#skillsView .inventory-item[data-skill-key] .skill-bonus-title {
  font-size: .68rem;
  line-height: 1.2;
}

#skillsView .inventory-item[data-skill-key] .skill-bonus-progress {
  height: 4px !important;
}

#skillsView .skill-bonus-indicator[data-skill-bonus-ready="true"],
#skillsView .skill-bonus-indicator[data-skill-upgrade-ready="true"] {
  border-color: rgba(251,191,36,.48) !important;
  background: rgba(245,158,11,.10) !important;
  box-shadow: 0 0 0 1px rgba(251,191,36,.08), 0 8px 22px rgba(245,158,11,.08) !important;
}

#skillsView .skill-bonus-indicator[data-skill-bonus-ready="true"] .skill-bonus-title,
#skillsView .skill-bonus-indicator[data-skill-upgrade-ready="true"] .skill-bonus-title {
  color: #fde68a;
}

#skillsView .skill-empty {
  min-height: 84px !important;
  padding: .8rem;
  text-align: center;
  font-size: .76rem;
}

@media (max-width: 980px) {
  #skillsView .skill-wrapper {
    grid-template-columns: 1fr !important;
  }

  #skillsView .skill-avatar {
    min-height: 160px !important;
    max-height: 190px !important;
    --skill-svg-min: 120px !important;
    --skill-svg-fluid: 24vw !important;
    --skill-svg-max: 170px !important;
  }
}

@media (max-width: 720px) {
  #skillsView .skill-list {
    grid-template-columns: 1fr !important;
    grid-auto-rows: auto;
  }

  #skillsView .skill-avatar {
    min-height: 138px !important;
    max-height: 160px !important;
    padding: .5rem !important;
  }

  #skillsView .inventory-item[data-skill-key] {
    min-height: 118px;
    padding: .56rem !important;
  }

  #skillsView .inventory-item[data-skill-key] .item-icon {
    width: 46px !important;
    height: 46px !important;
    min-width: 46px !important;
  }
}
'''
    css_path.write_text(css, encoding='utf-8')

smoke_path = Path('2026/qa/browser-smoke.mjs')
smoke = smoke_path.read_text(encoding='utf-8')
anchor = "  assert.ok(Array.isArray(state.skills) && state.skills.length > 0, 'Purchased skill missing from skill collection');\n\n  for (const view of ['inventory', 'skills', 'shop', 'battle', 'report', 'learn']) {\n"
insert = "  assert.ok(Array.isArray(state.skills) && state.skills.length > 0, 'Purchased skill missing from skill collection');\n\n  await page.locator('.nav-toggle[data-view=\"skills\"]').click();\n  assert.ok(await page.locator('#skillsView .inventory-item[data-skill-key]').count() > 0, 'Purchased skill should render as a skill card');\n  const skillAvatarBox = await page.locator('#skillsView .skill-avatar').boundingBox();\n  assert.ok(skillAvatarBox && skillAvatarBox.height <= 285, 'Desktop skill avatar should stay compact');\n  const skillColumns = await page.locator('#skillsView .skill-list').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').filter(Boolean).length);\n  assert.equal(skillColumns, 2, 'Desktop skill list should use two compact columns');\n  const skillsOverflow = await page.locator('#skillsView #skillCard').evaluate(el => el.scrollWidth > el.clientWidth + 2);\n  assert.equal(skillsOverflow, false, 'Skills card must not overflow horizontally');\n\n  for (const view of ['inventory', 'skills', 'shop', 'battle', 'report', 'learn']) {\n"
if anchor not in smoke:
    raise SystemExit('skills smoke anchor not found')
smoke = smoke.replace(anchor, insert, 1)
smoke_path.write_text(smoke, encoding='utf-8')

print('skills compact polish applied')
