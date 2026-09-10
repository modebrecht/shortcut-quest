from pathlib import Path

# --- skill-hotkeys.js -------------------------------------------------
skill_path = Path('2026/skill-hotkeys.js')
skill = skill_path.read_text(encoding='utf-8')

old = '''    const stageNav = document.createElement("div");
    stageNav.id = "a8SectionStageNav";
    stageNav.className = "section-stage-nav";

    const meta = document.createElement("div");
    meta.className = "section-stage-meta";
    meta.innerHTML = '<strong>30 Abschnitte</strong><span>3 Etappen</span>';

    const controls = document.createElement("div");
    controls.className = "section-stage-controls";
    stageNav.appendChild(meta);
    stageNav.appendChild(controls);
    navCard.insertBefore(stageNav, tabsHost);
'''
new = '''    const stageNav = document.createElement("div");
    stageNav.id = "a8SectionStageNav";
    stageNav.className = "section-stage-nav";

    const controls = document.createElement("div");
    controls.className = "section-stage-controls";
    controls.setAttribute("aria-label", "Abschnittsgruppen");
    stageNav.appendChild(controls);

    const divider = document.createElement("span");
    divider.className = "section-stage-divider";
    divider.setAttribute("aria-hidden", "true");
    stageNav.appendChild(divider);

    navCard.insertBefore(stageNav, tabsHost);
    stageNav.appendChild(tabsHost);

    const rewardHint = navCard.querySelector(":scope > .small");
    if (rewardHint) {
      rewardHint.classList.add("section-reward-hint");
      rewardHint.textContent = "+5 XP pro richtige Antwort · Perfekt = Bonus-Coins";
      navCard.insertAdjacentElement("afterend", rewardHint);
    }
'''
if old not in skill:
    raise SystemExit('stage nav shell anchor not found')
skill = skill.replace(old, new, 1)

old = '''      button.className = "section-stage-button";
      button.dataset.stage = String(stageIndex);
      button.innerHTML = `<span class="section-stage-range">${start}–${end}</span><span class="section-stage-progress">gesperrt</span>`;
'''
new = '''      button.className = "section-stage-button";
      button.dataset.stage = String(stageIndex);
      button.textContent = String(end);
      button.title = `Abschnitte ${start}–${end}`;
'''
if old not in skill:
    raise SystemExit('stage button anchor not found')
skill = skill.replace(old, new, 1)

old = '''        const targetLabel = tab.dataset.baseLabel || `Abschnitt ${number}`;
        if (label.textContent !== targetLabel) label.textContent = targetLabel;
'''
new = '''        const targetLabel = String(number);
        if (label.textContent !== targetLabel) label.textContent = targetLabel;
        tab.setAttribute("aria-label", `Abschnitt ${number}`);
        tab.title = `Abschnitt ${number}`;
'''
if old not in skill:
    raise SystemExit('tab label normalization anchor not found')
skill = skill.replace(old, new, 1)

old = '''        button.classList.toggle("active", stageIndex === activeStage);
        const progress = button.querySelector(".section-stage-progress");
        if (progress) progress.textContent = available ? `${completed}/10` : "gesperrt";
        button.setAttribute("aria-label", available
'''
new = '''        button.classList.toggle("active", stageIndex === activeStage);
        button.classList.toggle("completed", completed >= 10);
        button.setAttribute("aria-label", available
'''
if old not in skill:
    raise SystemExit('stage progress anchor not found')
skill = skill.replace(old, new, 1)

skill_path.write_text(skill, encoding='utf-8')

# --- modern-ui.css ----------------------------------------------------
css_path = Path('2026/modern-ui.css')
css = css_path.read_text(encoding='utf-8')
start_marker = '/* SECTION STAGE NAVIGATION ------------------------------------------- */'
end_marker = '/* RESPONSIVE COMPACT HEADER ------------------------------------------ */'
start = css.find(start_marker)
end = css.find(end_marker)
if start < 0 or end < 0 or end <= start:
    raise SystemExit('stage CSS markers not found')

replacement = r'''/* SECTION LEVEL CHOOSER ---------------------------------------------- */
#learnView .nav-card {
  padding: .58rem .7rem !important;
}

.section-stage-nav {
  display: flex;
  align-items: center;
  gap: .72rem;
  min-height: 56px;
}

.section-stage-controls {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 54px);
  flex: 0 0 auto;
  gap: .2rem;
  padding: .26rem;
  border: 1px solid rgba(148, 163, 184, .14);
  border-radius: 1rem;
  background:
    linear-gradient(180deg, rgba(18, 30, 51, .92), rgba(8, 17, 32, .92));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .035),
    0 8px 22px rgba(2, 6, 23, .22);
}

.section-stage-controls::before {
  content: "";
  position: absolute;
  left: 18px;
  right: 18px;
  top: 50%;
  height: 1px;
  background: rgba(148, 163, 184, .16);
  transform: translateY(-50%);
  pointer-events: none;
}

.section-stage-button {
  position: relative;
  z-index: 1;
  min-width: 54px;
  min-height: 44px;
  padding: 0;
  border: 1px solid rgba(148, 163, 184, .10);
  border-radius: .78rem;
  background: #0d182b;
  color: #8395ad;
  display: grid;
  place-items: center;
  font: inherit;
  font-size: .86rem;
  font-weight: 900;
  letter-spacing: -.02em;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.025);
  transition: transform .15s ease, background .15s ease, border-color .15s ease, color .15s ease, box-shadow .15s ease;
}

.section-stage-button:hover:not(:disabled):not(.active) {
  color: #e7eef8;
  border-color: rgba(148, 163, 184, .28);
  background: #142139;
  transform: translateY(-1px);
}

.section-stage-button.active {
  color: #172033;
  border-color: rgba(251, 191, 36, .92);
  background: linear-gradient(145deg, #fcd34d, #f59e0b);
  box-shadow:
    0 7px 18px rgba(245, 158, 11, .24),
    inset 0 1px 0 rgba(255,255,255,.35);
  transform: translateY(-1px) scale(1.035);
}

.section-stage-button.completed:not(.active)::after {
  content: "";
  position: absolute;
  right: 5px;
  top: 5px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, .10);
}

.section-stage-button:disabled {
  cursor: default;
  color: #3f5068;
  border-color: rgba(148, 163, 184, .06);
  background: #091323;
  opacity: .68;
}

.section-stage-button:disabled::after {
  content: "";
  width: 11px;
  height: 11px;
  position: absolute;
  right: 5px;
  top: 5px;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='5' y='10' width='14' height='10' rx='2'/%3E%3Cpath d='M8 10V7a4 4 0 0 1 8 0v3'/%3E%3C/svg%3E") center / contain no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='5' y='10' width='14' height='10' rx='2'/%3E%3Cpath d='M8 10V7a4 4 0 0 1 8 0v3'/%3E%3C/svg%3E") center / contain no-repeat;
}

.section-stage-divider {
  width: 1px;
  align-self: stretch;
  min-height: 38px;
  flex: 0 0 1px;
  margin-block: .34rem;
  background: linear-gradient(180deg, transparent, rgba(148, 163, 184, .22), transparent);
}

#sectionTabs {
  flex: 1 1 auto;
  min-width: 0;
  display: grid !important;
  grid-template-columns: repeat(10, minmax(38px, 1fr));
  gap: .34rem !important;
  margin: 0 !important;
  padding: .1rem 0 !important;
  overflow: visible !important;
  scroll-snap-type: none;
}

#sectionTabs .section-tab[hidden] {
  display: none !important;
}

#sectionTabs .section-tab {
  position: relative;
  min-width: 0 !important;
  width: 100%;
  min-height: 42px;
  padding: 0 !important;
  display: grid;
  place-items: center;
  border-radius: .78rem;
  font-size: .8rem;
  font-weight: 850;
  line-height: 1;
}

#sectionTabs .section-tab-label {
  white-space: nowrap;
}

#sectionTabs .section-tab.completed:not(.active) {
  color: #d7e4f3;
  border-color: rgba(74, 222, 128, .17);
  background: rgba(15, 23, 42, .68);
}

#sectionTabs .section-tab.completed:not(.active)::before {
  content: "";
  position: absolute;
  top: 5px;
  right: 5px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, .10);
}

.section-reward-hint {
  display: block;
  margin: .38rem .7rem 0 !important;
  color: #71849d !important;
  font-size: .7rem !important;
  line-height: 1.3;
  letter-spacing: .005em;
}

@media (max-width: 760px) {
  #learnView .nav-card {
    padding: .5rem !important;
  }

  .section-stage-nav {
    display: grid;
    grid-template-columns: 1fr;
    gap: .44rem;
    min-height: 0;
  }

  .section-stage-controls {
    grid-template-columns: repeat(3, minmax(52px, 1fr));
    width: min(100%, 210px);
  }

  .section-stage-divider {
    display: none;
  }

  #sectionTabs {
    grid-template-columns: repeat(10, minmax(30px, 1fr));
    gap: .24rem !important;
  }

  #sectionTabs .section-tab {
    min-height: 36px;
    border-radius: .66rem;
    font-size: .72rem;
  }

  .section-reward-hint {
    margin-inline: .55rem !important;
    font-size: .66rem !important;
  }
}

@media (max-width: 420px) {
  #sectionTabs {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

'''
css = css[:start] + replacement + css[end:]
css_path.write_text(css, encoding='utf-8')

# --- browser smoke ----------------------------------------------------
smoke_path = Path('2026/qa/browser-smoke.mjs')
smoke = smoke_path.read_text(encoding='utf-8')
anchor = "  assert.equal(await page.locator('.section-stage-button').count(), 3, '30 sections should be represented as three navigation stages');\n"
insert = anchor + "  assert.equal(await page.locator('.section-stage-meta').count(), 0, 'Legacy section meta labels should be removed');\n  assert.deepEqual(await page.locator('.section-stage-button').allTextContents(), ['10', '20', '30'], 'Stage chooser should use the compact 10/20/30 labels');\n  assert.deepEqual((await page.locator('#sectionTabs .section-tab:visible .section-tab-label').allTextContents()).slice(0, 10), ['1','2','3','4','5','6','7','8','9','10'], 'Visible section tabs should use numbers only');\n"
if anchor not in smoke:
    raise SystemExit('browser smoke stage anchor not found')
smoke = smoke.replace(anchor, insert, 1)

# Guard the desktop one-row chooser and mobile stacked chooser without brittle pixel-perfect assertions.
anchor2 = "  assert.ok(await page.locator('#topNav .nav-toggle').first().isVisible(), 'Desktop inline navigation should be visible');\n"
insert2 = anchor2 + "  assert.equal(await page.locator('#a8SectionStageNav #sectionTabs').count(), 1, 'Section numbers should live inside the game-style stage chooser');\n"
if anchor2 not in smoke:
    raise SystemExit('browser smoke desktop anchor not found')
smoke = smoke.replace(anchor2, insert2, 1)

smoke_path.write_text(smoke, encoding='utf-8')
print('patched game-style 10/20/30 section chooser')
